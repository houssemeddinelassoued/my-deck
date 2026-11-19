// ─── Module 5 · Agents et Claude Code ───────────────────────────────────────

const M5_Section: Page = () => (
  <Section n={5} title="Agents et Claude Code" sub="La boucle agentique, les façons de brancher des outils, et tout ce qui configure Claude Code pour un dépôt." dur="35 min + atelier 1 h 45" labs={<Tag tone="green" size={20}>Atelier 4 · L’environnement Claude Code</Tag>}>
    <SecItem n={1}>La boucle d’un agent : contexte, action, vérification</SecItem>
    <SecItem n={2}>CLI natif, scripts ou MCP : comment l’agent atteint les outils</SecItem>
    <SecItem n={3}>CLAUDE.md, permissions, Skills, sous-agents, hooks</SecItem>
    <SecItem n={4}>Bonnes pratiques d’optimisation</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── La boucle agentique ────────────────────────────────────────────────────
const M5Step = ({ n, icon, tone, title, ex, x, y }: { n: number; icon: IconName; tone: Tone; title: string; ex: string; x: number; y: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: y, width: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
    <IconTile name={icon} tone={tone} size={80} solid />
    <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35 }}>{ex}</div>
  </div>
);

const M5_Boucle: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Un agent, c’est une boucle qui s’arrête toute seule</Title>
    <Lede>Le modèle choisit l’action suivante, la lance par un outil, lit le résultat, et recommence jusqu’à juger la tâche terminée.</Lede>
    <svg width={1000} height={620} style={{ position: 'absolute', left: 120, top: 250 }} aria-hidden>
      <circle cx={500} cy={320} r={240} fill="none" stroke={C.rule} strokeWidth={4} strokeDasharray="4 12" className={A.spin} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 500, top: 490, width: 240, height: 160, borderRadius: 24, background: G.navy, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW }}>
      <Icon name="target" size={40} color="#fff" />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, marginTop: 6 }}>La tâche</div>
    </div>
    <M5Step n={1} icon="search" tone="blue" title="Rassembler le contexte" ex="lire, chercher, explorer le dépôt" x={455} y={250} />
    <M5Step n={2} icon="wand" tone="violet" title="Agir" ex="modifier, lancer une commande" x={790} y={500} />
    <M5Step n={3} icon="shieldCheck" tone="green" title="Vérifier" ex="tests, garde, relecture" x={455} y={700} />
    <M5Step n={4} icon="loop" tone="navy" title="Recommencer ou finir" ex="selon le résultat" x={120} y={500} />
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="terminal" tone="navy" title="Claude Code = cette boucle" size={22} pad={22} cls={A.right} style={dl(300)}>
        Outils intégrés : lire, chercher, éditer, lancer des commandes, aller sur le Web, déléguer à un sous-agent.
      </Card>
      <Card icon="shield" tone="green" title="Votre rôle" size={22} pad={22} cls={A.right} style={dl(450)}>
        Lui donner le contexte, régler ses droits, et brancher la vérification <strong>dans</strong> la boucle : c’est le harnais d’hier.
      </Card>
    </div>
  </Frame>
);

// ─── CLI natif, scripts ou MCP ──────────────────────────────────────────────
const M5Way = ({ n, icon, tone, title, ex, when, cost }: { n: number; icon: IconName; tone: Tone; title: string; ex: ReactNode; when: ReactNode; cost: string }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `8px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
    </div>
    <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.4 }}>{ex}</div>
    <div style={{ fontSize: 20, color: C.ink, lineHeight: 1.4 }}>
      <strong>Quand : </strong>
      {when}
    </div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone={tone} size={18}>
        {cost}
      </Tag>
    </div>
  </div>
);

const M5_Comm: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Trois façons pour un agent d’atteindre un outil</Title>
    <Lede>Un agent qui sait lancer un terminal dispose déjà de milliers d’outils. MCP n’est pas toujours la réponse : c’est un choix.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 470, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M5Way n={1} icon="terminal" tone="navy" title="CLI natif" ex={<><Ic>git</Ic>, <Ic>gh</Ic>, <Ic>npm</Ic>, <Ic>mvn</Ic>, <Ic>dotnet</Ic>, <Ic>docker</Ic>, <Ic>sqlite3</Ic>…</>} when="l’outil a une ligne de commande que le modèle connaît déjà" cost="Rien à installer · zéro contexte en plus" />
      <M5Way n={2} icon="code" tone="blue" title="Scripts du projet" ex={<><Ic>node guichet.mjs garde</Ic>, un Makefile, un script de migration</>} when="la procédure est propre au projet et doit être exacte à chaque fois" cost="Déterministe · versionné avec le code" />
      <M5Way n={3} icon="plug" tone="violet" title="Serveur MCP" ex="Notion, Jira, une base interne, un outil sans CLI" when="pas de CLI, authentification OAuth, données structurées, partage entre plusieurs clients" cost="Définitions chargées dans le contexte" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="yellow" icon="alert" title="Chaque serveur MCP a un coût" size={23} cls={b.on(3)} style={dl(150)}>
        Ses définitions d’outils occupent du contexte, ses réponses entrent dans la conversation (risque d’injection), et c’est du code tiers : provenance et droits à vérifier comme une dépendance.
      </Callout>
    </div>
  </Frame>
);

// ─── MCP en une page ────────────────────────────────────────────────────────
const M5Box = ({ x, y, w, h, tone, title, children, cls }: { x: number; y: number; w: number; h: number; tone: Tone; title: string; children: ReactNode; cls?: string }) => (
  <div className={cls ?? A.pop} style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 19, color: C.ink, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const M5_MCP: Page = () => (
  <Frame mod={5}>
    <Title>MCP : un protocole ouvert pour brancher outils et données</Title>
    <Lede>Un hôte (Claude Code, l’app Claude…) parle à des serveurs MCP. Chaque serveur expose des outils, des ressources et des prompts.</Lede>
    <M5Box x={120} y={290} w={420} h={300} tone="navy" title="Hôte">
      Claude Code, l’application Claude, un IDE…
      <br />
      Il contient un client MCP par serveur et décide d’appeler ou non.
    </M5Box>
    <svg width={260} height={300} style={{ position: 'absolute', left: 540, top: 290 }} aria-hidden>
      <path d="M 10 80 H 250" stroke={C.faint} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" className={A.march} />
      <path d="M 10 220 H 250" stroke={C.faint} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" className={A.march} />
      <text x={130} y={66} textAnchor="middle" fontSize={18} fill={C.muted} fontFamily="JetBrains Mono, monospace">
        stdio (local)
      </text>
      <text x={130} y={206} textAnchor="middle" fontSize={18} fill={C.muted} fontFamily="JetBrains Mono, monospace">
        HTTP (distant)
      </text>
    </svg>
    <M5Box x={800} y={290} w={420} h={130} tone="teal" title="mcp-demandes (local)" cls={A.right}>
      un script du dépôt, lit la base SQLite
    </M5Box>
    <M5Box x={800} y={460} w={420} h={130} tone="violet" title="Notion (distant)" cls={A.right}>
      serveur hébergé, connexion OAuth
    </M5Box>
    <div style={{ position: 'absolute', left: 1280, top: 290, width: 520, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row2 icon="tool" tone="blue" title="Outils" d={300}>
        actions : chercher, créer, mettre à jour
      </Row2>
      <Row2 icon="doc" tone="teal" title="Ressources" d={400}>
        données à lire : fichiers, enregistrements
      </Row2>
      <Row2 icon="note" tone="violet" title="Prompts" d={500}>
        modèles de demandes prêts à l’emploi
      </Row2>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      <CodeDark file="Terminal" size={20} cls={A.in} style={dl(600)}>
        <Sh c="# serveur local, partagé via .mcp.json">claude mcp add --scope project demandes -- node outils/mcp-demandes/serveur.mjs</Sh>
        <Sh c="# serveur distant (option Notion)">claude mcp add --transport http notion https://mcp.notion.com/mcp</Sh>
      </CodeDark>
    </div>
  </Frame>
);

// ─── Les surfaces de Claude Code ────────────────────────────────────────────
const M5_Surfaces: Page = () => (
  <Frame mod={5}>
    <Title>Un même Claude Code, trois façons de l’ouvrir</Title>
    <Lede>Même moteur, mêmes fichiers de configuration dans le dépôt. Ce qui change : où tourne le code et comment vous suivez le travail.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="code" tone="navy" title="Application de bureau" size={23} pad={26} cls={A.in} style={dl(100)}>
        Onglet Code : une session sur un dossier de votre poste. Visualisation des modifications, plusieurs sessions côte à côte.
        <div style={{ marginTop: 14 }}>
          <Tag tone="green" size={19}>
            Notre choix pour les ateliers
          </Tag>
        </div>
      </Card>
      <Card icon="globe" tone="blue" title="Sur le Web" size={23} pad={26} cls={A.in} style={dl(200)}>
        claude.ai/code : la session tourne dans un environnement cloud sur votre dépôt GitHub, et produit une branche ou une PR. Idéal pour lancer des tâches en parallèle.
      </Card>
      <Card icon="terminal" tone="violet" title="Terminal" size={23} pad={26} cls={A.in} style={dl(300)}>
        <Ic>claude</Ic> en interactif, <Ic>claude -p</Ic> en non interactif pour les scripts, comme vous l’avez fait hier pour la génération mesurée.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680 }}>
      <Callout tone="teal" icon="git" title="Ce qui est commun" size={24} cls={A.in} style={dl(500)}>
        <Ic>CLAUDE.md</Ic>, <Ic>.claude/</Ic> et <Ic>.mcp.json</Ic> sont versionnés dans le dépôt : toute l’équipe, et toutes les surfaces, travaillent avec la même configuration.
      </Callout>
    </div>
  </Frame>
);

// ─── Anatomie du dossier .claude ────────────────────────────────────────────
const M5Tree = ({ path, tone, children, d, shared = true }: { path: string; tone: Tone; children: ReactNode; d: number; shared?: boolean }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '440px minmax(0, 1fr) 150px', gap: 18, alignItems: 'center', ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 21, color: T[tone].fg, background: T[tone].bg, borderRadius: 8, padding: '5px 12px', boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}` }}>{path}</span>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
    <Tag tone={shared ? 'green' : 'grey'} size={17}>
      {shared ? 'versionné' : 'personnel'}
    </Tag>
  </div>
);

const M5_Anatomie: Page = () => (
  <Frame mod={5}>
    <Title>Tout ce qui configure Claude Code tient dans le dépôt</Title>
    <Lede>À la fin de l’Atelier 4, votre dépôt Guichet contiendra chacun de ces fichiers.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', flexDirection: 'column', gap: 13 }}>
      <M5Tree path="CLAUDE.md" tone="blue" d={100}>
        mémoire du projet, lue à chaque session : commandes, conventions, interdits
      </M5Tree>
      <M5Tree path=".claude/settings.json" tone="navy" d={180}>
        permissions (autoriser, demander, refuser) et hooks
      </M5Tree>
      <M5Tree path=".claude/skills/<nom>/SKILL.md" tone="teal" d={260}>
        procédures chargées à la demande, avec leurs scripts
      </M5Tree>
      <M5Tree path=".claude/agents/<nom>.md" tone="violet" d={340}>
        sous-agents spécialisés : rôle, outils, modèle
      </M5Tree>
      <M5Tree path=".mcp.json" tone="pink" d={420}>
        serveurs MCP du projet
      </M5Tree>
      <M5Tree path="CLAUDE.local.md · settings.local.json" tone="grey" d={500} shared={false}>
        vos préférences, jamais commitées
      </M5Tree>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="violet" icon="archive" title="Et pour partager entre dépôts : les plugins" size={23} cls={A.in} style={dl(650)}>
        Un plugin regroupe Skills, sous-agents, hooks et serveurs MCP dans un paquet installable depuis une marketplace (<Ic>/plugin</Ic>) : la façon de standardiser une équipe.
      </Callout>
    </div>
  </Frame>
);

// ─── CLAUDE.md ──────────────────────────────────────────────────────────────
const M5_ClaudeMd: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Un bon CLAUDE.md est court et vérifiable</Title>
    <Lede>Il est relu à chaque session : chaque ligne coûte du contexte et doit changer un comportement. <Ic>/init</Ic> en produit un premier jet à corriger.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960 }}>
      <CodeDark file="CLAUDE.md (extrait)" size={19} wrap cls={A.left}>
        <Ck># Guichet (Python)</Ck>
        {'\n'}Portail des demandes clients d’Oasis Digital : formulaire → extraction par Claude → SQLite.
        {'\n\n'}<Ck>## Commandes</Ck>
        {'\n'}- Tests : `node guichet.mjs tests` · garde : `node guichet.mjs garde`
        {'\n'}- Lancer : `node guichet.mjs simu` puis `node guichet.mjs lancer`
        {'\n\n'}<Ck>## Architecture</Ck>
        {'\n'}api/ → pipeline/ → domaine/ ← depot/. Le domaine n’importe jamais l’API ni le dépôt.
        {'\n\n'}<Ck>## Règles</Ck>
        {'\n'}- Le schéma contrats/demande.schema.json est la source de vérité des champs.
        {'\n'}- La priorité est calculée par domaine/priorite, jamais par le modèle.
        {'\n'}- Ne modifie pas tests/acceptance/ : corrige le code.
        {'\n\n'}<Ck>## Avant de dire « fini »</Ck>
        {'\n'}garde et tests au vert.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 262, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="checkCircle" tone="green" title="Ce qui y gagne sa place" size={22} pad={22} cls={b.on(1)}>
        Les commandes exactes, l’architecture en une ligne, les règles que Claude ne peut pas deviner, et la définition de « fini ».
      </Card>
      <Card icon="x" tone="coral" title="Ce qui n’y a pas sa place" size={22} pad={22} cls={b.on(2)}>
        L’historique du projet, des règles de style qu’un linter vérifie déjà, des consignes vagues (« écris du bon code »), des secrets.
      </Card>
      <Callout tone="navy" icon="shield" title="Une règle qui doit tenir à 100 %" size={22} cls={b.on(2)} style={dl(150)}>
        n’est pas une ligne de CLAUDE.md : c’est un hook ou une permission.
      </Callout>
    </div>
  </Frame>
);

// ─── Permissions ────────────────────────────────────────────────────────────
const M5_Permissions: Page = () => (
  <Frame mod={5}>
    <Title>Permissions : décider avant de déléguer</Title>
    <Lede>Ce que l’agent fait seul, ce qu’il doit demander, ce qui lui est interdit. Les refus l’emportent toujours.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file=".claude/settings.json" size={19} cls={A.left}>
        {'{'}
        {'\n'}  <Cs>"permissions"</Cs>: {'{'}
        {'\n'}    <Cs>"allow"</Cs>: [
        {'\n'}      <Cs>"Bash(node guichet.mjs *)"</Cs>,
        {'\n'}      <Cs>"Bash(git diff *)"</Cs>, <Cs>"Bash(git status)"</Cs>
        {'\n'}    ],
        {'\n'}    <Cs>"ask"</Cs>: [<Cs>"Bash(git commit *)"</Cs>],
        {'\n'}    <Cs>"deny"</Cs>: [
        {'\n'}      <Cs>"Read(./.env)"</Cs>, <Cs>"Read(./**/secrets/**)"</Cs>,
        {'\n'}      <Cs>"Bash(git push *)"</Cs>, <Cs>"Bash(curl *)"</Cs>
        {'\n'}    ]
        {'\n'}  {'}'}
        {'\n'}{'}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={19}>
        Les modes de permission
      </Eyebrow>
      <Row2 icon="hand" tone="grey" title="Par défaut" d={200}>
        demande avant chaque modification et chaque commande non autorisée
      </Row2>
      <Row2 icon="map" tone="blue" title="Plan" d={300}>
        lit et propose un plan, sans rien modifier : idéal pour démarrer
      </Row2>
      <Row2 icon="check" tone="green" title="Accepter les modifications" d={400}>
        modifie les fichiers sans demander ; les commandes restent soumises aux règles
      </Row2>
      <Row2 icon="alert" tone="coral" title="Sans permissions" d={500}>
        à réserver à un bac à sable isolé, sans secrets ni réseau (bonus Docker)
      </Row2>
    </div>
  </Frame>
);

// ─── Skills ─────────────────────────────────────────────────────────────────
const M5_Skills: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Skills : des procédures chargées seulement quand il le faut</Title>
    <Lede>Au démarrage, Claude ne lit que le nom et la description de chaque Skill. Le reste n’entre dans le contexte que si la tâche correspond.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 980 }}>
      <CodeDark file=".claude/skills/ajouter-champ/SKILL.md" size={19} wrap cls={A.left}>
        <span style={{ color: '#8A8A98' }}>---</span>
        {'\n'}<Ck>name</Ck>: ajouter-champ
        {'\n'}<Ck>description</Ck>: Ajoute un champ à la demande de bout en bout (schéma, modèle, validation, base, interface, tests). À utiliser dès qu’on demande d’ajouter, renommer ou rendre obligatoire un champ de demande.
        {'\n'}<span style={{ color: '#8A8A98' }}>---</span>
        {'\n\n'}<Ck># Ajouter un champ</Ck>
        {'\n'}1. Modifier contrats/demande.schema.json (source de vérité).
        {'\n'}2. Lancer `node guichet.mjs contrat` pour régénérer les types.
        {'\n'}3. Migration SQLite : voir migrations/LISEZMOI.md.
        {'\n'}4. Ajouter le champ dans web/ (formulaire et tableau).
        {'\n'}5. Un test par règle du champ ; garde et tests au vert.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 262, width: 640, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="target" tone="teal" title="La description déclenche" size={22} pad={22} cls={b.on(1)}>
        Ce qu’elle fait et <strong>quand</strong> l’utiliser, avec les mots que vous emploierez en la demandant. Une description vague, et la Skill ne se déclenche jamais.
      </Card>
      <Card icon="layers" tone="navy" title="Une Skill peut contenir des scripts" size={22} pad={22} cls={b.on(2)}>
        Les étapes exactes sont dans un script versionné ; la Skill dit quand et comment le lancer. Vous l’appelez aussi à la main : <Ic>/ajouter-champ</Ic>.
      </Card>
    </div>
  </Frame>
);

// ─── Sous-agents ────────────────────────────────────────────────────────────
const M5_SousAgents: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Sous-agents : un contexte propre, des droits restreints</Title>
    <Lede>Un sous-agent travaille dans sa propre fenêtre de contexte et ne renvoie qu’un résultat. Il a son rôle, ses outils et son modèle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file=".claude/agents/relecteur-securite.md" size={19} wrap cls={A.left}>
        <span style={{ color: '#8A8A98' }}>---</span>
        {'\n'}<Ck>name</Ck>: relecteur-securite
        {'\n'}<Ck>description</Ck>: Relit les modifications de src/ sous l’angle sécurité (injection, secrets, validation). À utiliser après chaque implémentation, avant de conclure.
        {'\n'}<Ck>tools</Ck>: Read, Grep, Glob, Bash
        {'\n'}<Ck>model</Ck>: sonnet
        {'\n'}<span style={{ color: '#8A8A98' }}>---</span>
        {'\n\n'}Tu ne modifies aucun fichier. Lis `git diff`, puis rends une liste de constats : fichier, ligne, risque, correction proposée. Aucun constat sans preuve dans le code.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={19}>
        Orchestration de l’Atelier 4
      </Eyebrow>
      <div className={b.on(1)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Num n={1} tone="blue" size={42} />
        <span style={{ fontSize: 23, color: C.ink }}>
          <strong>Session principale</strong> : implémente avec la Skill
        </span>
      </div>
      <div className={b.on(2)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Num n={2} tone="violet" size={42} />
        <span style={{ fontSize: 23, color: C.ink }}>
          <strong>relecteur-securite</strong> : lit le diff, rend ses constats
        </span>
      </div>
      <div className={b.on(3)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Num n={3} tone="green" size={42} />
        <span style={{ fontSize: 23, color: C.ink }}>
          <strong>Session principale</strong> : corrige, relance garde et tests
        </span>
      </div>
      <Callout tone="teal" icon="bulb" title="Pourquoi pas tout dans la session ?" size={22} cls={b.on(3)} style={dl(150)}>
        Le relecteur ne voit pas les justifications de l’implémenteur : il lit le code comme un collègue. Et il n’a pas le droit d’écrire.
      </Callout>
    </div>
  </Frame>
);

// ─── Hooks ──────────────────────────────────────────────────────────────────
const M5_Hooks: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Hooks : ce qui doit arriver à chaque fois</Title>
    <Lede>Une commande lancée par Claude Code à un moment précis de la boucle. Elle ne dépend pas de la bonne volonté du modèle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960 }}>
      <CodeDark file=".claude/settings.json (suite)" size={19} cls={A.left}>
        <Cs>"hooks"</Cs>: {'{'}
        {'\n'}  <Cs>"PreToolUse"</Cs>: [{'{'}
        {'\n'}    <Cs>"matcher"</Cs>: <Cs>"Write|Edit"</Cs>,
        {'\n'}    <Cs>"hooks"</Cs>: [{'{'} <Cs>"type"</Cs>: <Cs>"command"</Cs>,
        {'\n'}                <Cs>"command"</Cs>: <Cs>"node .claude/hooks/bloquer-secrets.mjs"</Cs> {'}'}]
        {'\n'}  {'}'}],
        {'\n'}  <Cs>"PostToolUse"</Cs>: [{'{'}
        {'\n'}    <Cs>"matcher"</Cs>: <Cs>"Write|Edit"</Cs>,
        {'\n'}    <Cs>"hooks"</Cs>: [{'{'} <Cs>"type"</Cs>: <Cs>"command"</Cs>,
        {'\n'}                <Cs>"command"</Cs>: <Cs>"node guichet.mjs garde --rapide"</Cs> {'}'}]
        {'\n'}  {'}'}]
        {'\n'}{'}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 262, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="lock" tone="navy" title="Avant l’outil : bloquer" size={22} pad={22} cls={b.on(1)}>
        Le script lit l’appel prévu (JSON sur l’entrée standard). Code de sortie <Ic>2</Ic> : l’action est bloquée et le message d’erreur est renvoyé à Claude.
      </Card>
      <Card icon="loop" tone="green" title="Après l’outil : vérifier" size={22} pad={22} cls={b.on(2)}>
        La garde tourne après chaque modification ; si elle échoue, Claude reçoit la sortie et corrige. C’est la boucle d’hier, sans l’écrire.
      </Card>
      <div className={b.on(2)} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Tag tone="grey" size={18}>
          SessionStart
        </Tag>
        <Tag tone="grey" size={18}>
          UserPromptSubmit
        </Tag>
        <Tag tone="grey" size={18}>
          Stop
        </Tag>
        <Tag tone="grey" size={18}>
          SubagentStop
        </Tag>
        <Tag tone="grey" size={18}>
          … <Ic>/hooks</Ic>
        </Tag>
      </div>
    </div>
  </Frame>
);

// ─── Quel mécanisme ? (cartes) ──────────────────────────────────────────────
const M5Pick = ({ need, answer, why, tone }: { need: string; answer: string; why: string; tone: Tone }) => (
  <FlipCard
    w={530}
    h={230}
    tone="grey"
    backTone={tone}
    front={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Icon name="target" size={28} color={C.muted} />
        <div style={{ fontSize: 24, lineHeight: 1.35, color: C.ink, fontWeight: 600 }}>{need}</div>
      </div>
    }
    back={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: T[tone].fg }}>{answer}</div>
        <div style={{ fontSize: 20, lineHeight: 1.4, color: C.ink }}>{why}</div>
      </div>
    }
  />
);

const M5_Choisir: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>À vous : quel mécanisme pour quel besoin ?</Title>
    <Lede>Votez à voix haute : CLAUDE.md, permission, Skill, sous-agent, hook ou MCP ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', justifyContent: 'space-between', rowGap: 28 }}>
      <M5Pick need="« Les tests se lancent avec node guichet.mjs tests »" answer="CLAUDE.md" why="Un fait sur le projet, utile à chaque session, que Claude ne peut pas deviner." tone="blue" />
      <M5Pick need="Ne jamais lire le fichier .env" answer="Permission (deny)" why="Une interdiction absolue : une règle de refus, pas une consigne." tone="navy" />
      <M5Pick need="La procédure en 6 étapes pour ajouter un champ" answer="Skill" why="Utile parfois, longue : chargée seulement quand on ajoute un champ." tone="teal" />
      <M5Pick need="Lancer la garde après chaque modification" answer="Hook (PostToolUse)" why="Doit arriver à chaque fois, sans dépendre du modèle." tone="green" />
      <M5Pick need="Une relecture sécurité sans les biais de l’auteur" answer="Sous-agent" why="Contexte séparé, droits en lecture seule, rapport synthétique." tone="violet" />
      <M5Pick need="Lire les tickets d’un outil sans ligne de commande" answer="Serveur MCP" why="Pas de CLI, authentification, données structurées : le cas d’usage de MCP." tone="pink" />
    </div>
  </Frame>
);

// ─── Optimiser ──────────────────────────────────────────────────────────────
const M5_Optim: Page = () => (
  <Frame mod={5}>
    <Title>Bonnes pratiques pour des agents efficaces</Title>
    <Lede>Ce qui fait la différence au quotidien, par ordre d’impact.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <Card icon="map" tone="blue" title="Plan d’abord" size={22} pad={22} cls={A.in} style={dl(100)}>
        Mode Plan pour toute tâche de plus de quelques fichiers : on corrige le plan, pas 300 lignes de code.
      </Card>
      <Card icon="shieldCheck" tone="green" title="Vérification dans la boucle" size={22} pad={22} cls={A.in} style={dl(180)}>
        Tests et garde lancés par un hook : l’agent voit ses erreurs tout seul et s’arrête vert.
      </Card>
      <Card icon="filter" tone="navy" title="Contexte propre" size={22} pad={22} cls={A.in} style={dl(260)}>
        <Ic>/clear</Ic> entre deux tâches, <Ic>/compact</Ic> sur une longue session, <Ic>/context</Ic> pour voir ce qui pèse.
      </Card>
      <Card icon="users" tone="violet" title="Sous-agents pour lire" size={22} pad={22} cls={A.in} style={dl(340)}>
        L’exploration d’un gros dépôt dans un sous-agent : la session principale ne reçoit que le résumé.
      </Card>
      <Card icon="layers" tone="teal" title="Parallèle, mais isolé" size={22} pad={22} cls={A.in} style={dl(420)}>
        Plusieurs sessions sur des copies de travail Git séparées, ou sur le Web : jamais deux agents sur les mêmes fichiers.
      </Card>
      <Card icon="gauge" tone="yellow" title="Le bon modèle, le bon effort" size={22} pad={22} cls={A.in} style={dl(500)}>
        <Ic>/model</Ic> et l’effort selon la tâche ; un modèle léger pour les sous-agents de lecture.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="pink" icon="sparkles" title="Bonus en annexe : Docker et bac à sable" size={23} cls={A.in} style={dl(650)}>
        Faire tourner des agents dans des conteneurs isolés pour les laisser travailler sans demander, et en orchestrer plusieurs en parallèle.
      </Callout>
    </div>
  </Frame>
);

// ─── Démo : une session commentée ───────────────────────────────────────────
const M5DemoStep = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 18, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <IconTile name={icon} tone={tone} size={56} solid />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.4 }}>{children}</div>
    </div>
  </div>
);

const M5_Demo: Page = () => (
  <Frame mod={5} kind="demo" beats={5}>
    <Title>Démo : une session Claude Code, commentée</Title>
    <Lede>Sur le dépôt corrigé de l’Atelier 4, je demande : « ajoute un champ site_web facultatif ». Observez ce qui se déclenche, et quand.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M5DemoStep n={1} icon="map" tone="blue" title="Mode Plan">
        Claude lit CLAUDE.md, le schéma et la Skill ; il propose un plan en 5 étapes que je corrige (pas de migration destructive).
      </M5DemoStep>
      <M5DemoStep n={2} icon="sparkles" tone="teal" title="La Skill ajouter-champ se déclenche">
        Sa description correspond à la demande : la procédure entre dans le contexte à ce moment-là seulement.
      </M5DemoStep>
      <M5DemoStep n={3} icon="lock" tone="navy" title="Un hook bloque">
        Claude tente d’écrire un jeton d’exemple dans un test : PreToolUse sort en code 2, Claude reformule.
      </M5DemoStep>
      <M5DemoStep n={4} icon="loop" tone="green" title="La garde tourne après chaque modification">
        Une requête construite par concaténation est signalée ; Claude la corrige sans que je le demande.
      </M5DemoStep>
      <M5DemoStep n={5} icon="humanCheck" tone="violet" title="Le relecteur passe">
        Deux constats : une validation d’URL trop permissive, un test manquant. Correction, tests verts, commit.
      </M5DemoStep>
    </div>
  </Frame>
);

const M5_Dejeuner: Page = () => <BreakPage mod={5} title="Déjeuner" back="Reprise à 12 h 30 : l’Atelier 4, l’environnement Claude Code de votre dépôt." minutes={30} icon="smile" />;

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M5_A4: Page = () => (
  <LabPage
    mod={5}
    n="4"
    title="L’environnement Claude Code du dépôt"
    defi="agent"
    who="Individuel"
    minutes={100}
    objective={
      <>
        Équiper le dépôt Guichet pour que Claude Code y travaille <strong>seul et en sécurité</strong> : mémoire du projet, permissions, une Skill, deux hooks, un serveur MCP et un sous-agent
        relecteur.
      </>
    }
    where={
      <>
        <Ic>CLAUDE.md</Ic>
        <br />
        <Ic>.claude/settings.json</Ic>
        <br />
        <Ic>.claude/skills/ajouter-champ/</Ic>
        <br />
        <Ic>.claude/agents/relecteur-securite.md</Ic>
        <br />
        <Ic>.mcp.json</Ic>
      </>
    }
    crit={
      <>
        <CheckItem id="a4c1" size={21}>
          Le hook bloque l’écriture d’un secret
        </CheckItem>
        <CheckItem id="a4c2" size={21}>
          « Ajoute le champ site_web » passe par la Skill, garde et tests verts
        </CheckItem>
        <CheckItem id="a4c3" size={21}>
          verifier A4.5 au vert
        </CheckItem>
      </>
    }
    suivi="Points d’étape à 12 h 55, 13 h 20 et 13 h 50 : « A4.1, A4.2, A4.3, A4.4 ou A4.5 ? »"
  >
    <WStep n="4.1">Ouvrir le dépôt dans l’app (onglet Code) ; /init ; corriger CLAUDE.md ; permissions.</WStep>
    <WStep n="4.2">Écrire la Skill ajouter-champ ; la tester sur le champ site_web.</WStep>
    <WStep n="4.3">Deux hooks : bloquer les secrets, lancer la garde après chaque modification.</WStep>
    <WStep n="4.4">Brancher le serveur MCP des demandes ; interroger la base en langage naturel.</WStep>
    <WStep n="4.5">Sous-agent relecteur-securite ; orchestrer implémentation → relecture → correction.</WStep>
  </LabPage>
);

const M5_A4Etapes: Page = () => (
  <Frame mod={5} kind="lab">
    <Title>Atelier 4 · les étapes et leurs points de reprise</Title>
    <Lede>Énoncé complet dans <Ic>ateliers/A4.md</Ic>. Claude Code fait le travail ; vous écrivez la configuration et vous vérifiez son comportement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <LabStep id="A4.1" title="Mémoire et droits" min={15} d={100}>
        <Ic>/init</Ic>, puis réduisez CLAUDE.md à l’essentiel ; règles <Ic>allow</Ic> / <Ic>deny</Ic> ; vérifiez qu’il refuse de lire <Ic>.env</Ic>.
      </LabStep>
      <LabStep id="A4.2" title="La Skill ajouter-champ" min={25} d={180}>
        Écrivez SKILL.md ; nouvelle session ; « ajoute un champ site_web facultatif » : la Skill se déclenche-t-elle ? Corrigez sa description sinon.
      </LabStep>
      <LabStep id="A4.3" title="Deux hooks" min={20} d={260}>
        Complétez <Ic>.claude/hooks/bloquer-secrets.mjs</Ic> (code de sortie 2) ; garde après chaque Write/Edit ; demandez à Claude d’écrire un jeton en dur : il doit être bloqué.
      </LabStep>
      <LabStep id="A4.4" title="Le serveur MCP des demandes" min={15} d={340}>
        <Ic>claude mcp add --scope project demandes …</Ic> ; « quelles demandes P1 sont ouvertes depuis plus de 48 h ? » ; comparez avec <Ic>sqlite3</Ic> en CLI.
      </LabStep>
      <LabStep id="A4.5" title="Le relecteur et l’orchestration" min={25} d={420}>
        Créez le sous-agent ; implémentez « filtrer le tableau de bord par client » ; faites relire, corriger, et commitez. Bonus : empaqueter le tout en plugin.
      </LabStep>
    </div>
  </Frame>
);

const M5_Pause: Page = () => <BreakPage mod={5} title="Pause" back="Dix minutes. Ensuite : le défi final, en autonomie." minutes={10} />;

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Boucle, M5_Comm, M5_MCP, M5_Surfaces, M5_Anatomie, M5_ClaudeMd, M5_Permissions, M5_Skills, M5_SousAgents, M5_Hooks, M5_Choisir, M5_Optim, M5_Demo, M5_Dejeuner, M5_A4, M5_A4Etapes, M5_Pause];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 5 · J2 11:25

OBJECTIF — Annoncer le passage du workflow à l’agent.

DIRE — « Ce matin, votre code orchestrait. Maintenant, c’est le modèle qui choisit ses étapes : un agent. On voit comment il fonctionne, comment il atteint ses outils, et tout ce qui configure Claude Code pour un dépôt. Puis, après le déjeuner, vous équipez votre dépôt. »

TRANSITION — « D’abord, la boucle. »`,
  `⏱ 3 min · LA BOUCLE AGENTIQUE (4 beats)

OBJECTIF — Donner le modèle mental de la boucle d’agent et du rôle du développeur.

DIRE — « Un agent est une boucle qui s’arrête toute seule. »
→ beat 1 « Il rassemble le contexte : il lit, cherche, explore. »
→ beat 2 « Il agit : il modifie, il lance une commande. »
→ beat 3 « Il vérifie. »
→ beat 4 « Et il recommence, ou il décide que c’est fini. Votre rôle : le contexte, les droits, et brancher la vérification dans la boucle, c’est-à-dire le harnais d’hier. »

TRANSITION — « Comment atteint-il ses outils ? »`,
  `⏱ 3 min · CLI, SCRIPTS OU MCP (3 beats)

OBJECTIF — Donner les critères de choix entre CLI natif, scripts du projet et MCP.

DIRE — « Trois voies. »
→ beat 1 « Le CLI natif : git, gh, npm, docker. Le modèle les connaît déjà, rien à installer, zéro contexte en plus. »
→ beat 2 « Les scripts du projet : quand la procédure doit être exacte à chaque fois. C’est notre guichet.mjs. »
→ beat 3 « MCP : quand il n’y a pas de ligne de commande, qu’il faut une authentification OAuth, ou que plusieurs clients doivent partager le même outil. Mais chaque serveur a un coût : du contexte, un risque d’injection, et du code tiers à vérifier. »

TRANSITION — « MCP en une page. »`,
  `⏱ 3 min · MCP

OBJECTIF — Expliquer l’architecture hôte / client / serveur et les trois primitives.

DIRE — « Un hôte, comme Claude Code ou l’application Claude, parle à des serveurs MCP. En local, par l’entrée et la sortie standard ; à distance, en HTTP. Chaque serveur expose des outils, des ressources et des prompts. »

DIRE — « En bas, les deux commandes de l’atelier : un serveur local du dépôt, partagé dans .mcp.json, et en option le serveur distant de Notion. »

TRANSITION — « Et où lance-t-on Claude Code ? »`,
  `⏱ 2 min · TROIS SURFACES

OBJECTIF — Situer l’app de bureau, le Web et le terminal.

DIRE — « Même moteur, trois façons de l’ouvrir. L’application de bureau, onglet Code : notre choix, une session sur un dossier de votre poste. Le Web, claude.ai/code : la session tourne dans le cloud sur votre dépôt GitHub et produit une branche ou une PR, pratique pour lancer des tâches en parallèle. Et le terminal, que vous avez utilisé hier avec claude -p. »

DIRE — « Ce qui est commun : la configuration est dans le dépôt. »

TRANSITION — « Voyons ce qu’il y a dans ce dépôt. »`,
  `⏱ 2 min · ANATOMIE DE LA CONFIGURATION

OBJECTIF — Montrer les fichiers que l’atelier va produire, versionnés ou personnels.

DIRE — « CLAUDE.md, la mémoire du projet. settings.json, les permissions et les hooks. Les Skills et les sous-agents dans leurs dossiers. .mcp.json pour les serveurs MCP. Et les fichiers locaux, vos préférences, jamais commités. Pour partager tout ça entre dépôts : un plugin. »

TRANSITION — « Commençons par CLAUDE.md. »`,
  `⏱ 3 min · CLAUDE.MD (2 beats)

OBJECTIF — Donner les critères d’un CLAUDE.md utile.

DIRE — « CLAUDE.md est relu à chaque session : chaque ligne coûte du contexte. Voici celui de Guichet : les commandes, l’architecture en une ligne, les règles, et la définition de fini. »
→ beat 1 « Y gagne sa place : ce que Claude ne peut pas deviner. »
→ beat 2 « N’y a pas sa place : l’historique, ce que le linter vérifie déjà, les consignes vagues, les secrets. Et une règle qui doit tenir à cent pour cent n’est pas une ligne de CLAUDE.md : c’est un hook ou une permission. »

TRANSITION — « Les permissions, justement. »`,
  `⏱ 3 min · PERMISSIONS

OBJECTIF — Montrer allow / ask / deny et les modes de permission.

DIRE — « Trois listes : ce qu’il fait seul, ce qu’il doit demander, ce qui est interdit. Les refus l’emportent toujours. Ici : il lance nos scripts et lit le diff seul, il demande avant de commiter, il ne lit jamais .env et ne pousse jamais. »

DIRE — « À droite, les modes : par défaut il demande, Plan il lit sans rien modifier, Accepter les modifications il écrit sans demander, et sans permissions… seulement dans un bac à sable isolé, c’est le bonus Docker. »

TRANSITION — « Les Skills. »`,
  `⏱ 3 min · SKILLS (2 beats)

OBJECTIF — Expliquer le chargement à la demande et l’importance de la description.

DIRE — « Au démarrage, Claude ne lit que le nom et la description de chaque Skill. Le corps n’entre dans le contexte que si la tâche correspond. »
→ beat 1 « Donc la description déclenche : ce que fait la Skill et quand l’utiliser, avec vos mots. »
→ beat 2 « Une Skill peut contenir des scripts : les étapes exactes sont versionnées, la Skill dit quand les lancer. Et vous pouvez l’appeler à la main : /ajouter-champ. »

TRANSITION — « Les sous-agents. »`,
  `⏱ 3 min · SOUS-AGENTS (3 beats)

OBJECTIF — Expliquer contexte isolé, droits restreints et orchestration implémenteur → relecteur.

DIRE — « Un sous-agent a sa propre fenêtre de contexte, ses outils et son modèle, et ne renvoie qu’un résultat. Voici le relecteur sécurité : lecture seule, Sonnet, et une consigne : aucun constat sans preuve. »
→ beat 1 « La session principale implémente avec la Skill. »
→ beat 2 « Le relecteur lit le diff et rend ses constats. »
→ beat 3 « La session principale corrige et relance garde et tests. Le relecteur ne voit pas les justifications de l’auteur : il lit le code comme un collègue. »

TRANSITION — « Et pour ce qui doit arriver à chaque fois : les hooks. »`,
  `⏱ 3 min · HOOKS (2 beats)

OBJECTIF — Expliquer PreToolUse / PostToolUse et le code de sortie 2.

DIRE — « Un hook est une commande lancée par Claude Code à un moment précis. Elle ne dépend pas de la bonne volonté du modèle. »
→ beat 1 « Avant un Write ou un Edit, un script lit l’appel prévu. S’il sort avec le code 2, l’action est bloquée et son message est renvoyé à Claude. »
→ beat 2 « Après, la garde tourne ; si elle échoue, Claude voit la sortie et corrige. C’est la boucle d’hier, sans l’écrire. Il existe d’autres événements : début de session, envoi d’un prompt, fin de tour. »

TRANSITION — « À vous de choisir le bon mécanisme. »`,
  `⏱ 3 min · QUEL MÉCANISME ? (cartes, vote oral)

OBJECTIF — Faire associer chaque besoin au bon mécanisme.

DIRE — « Six besoins. Pour chacun, votez : CLAUDE.md, permission, Skill, sous-agent, hook ou MCP. »

ANIMATION — Retourner chaque carte après deux ou trois avis. La règle à retenir : un fait → CLAUDE.md ; une interdiction → permission ; une procédure → Skill ; un « à chaque fois » → hook ; un regard séparé → sous-agent ; un outil sans CLI → MCP.

TRANSITION — « Et pour finir, les bonnes pratiques. »`,
  `⏱ 2 min · BONNES PRATIQUES

OBJECTIF — Donner six pratiques d’optimisation et renvoyer Docker en bonus.

DIRE — « Par ordre d’impact : le plan d’abord ; la vérification dans la boucle ; un contexte propre, avec clear, compact et context ; des sous-agents pour lire ; du parallèle, mais isolé ; et le bon modèle avec le bon effort. »

DIRE — « L’orchestration d’agents dans des conteneurs Docker est en annexe, en bonus : on peut y revenir à la fin si le temps le permet. »

TRANSITION — « Je vous montre tout ça en action. »`,
  `⏱ 4 min · DÉMO SESSION COMMENTÉE (5 beats)

OBJECTIF — Montrer toute la configuration en action avant que les participants l’écrivent.

DIRE — « Je demande d’ajouter un champ site_web. »
→ beat 1 « Mode Plan : il lit CLAUDE.md, le schéma et la Skill, et propose un plan ; je le corrige. »
→ beat 2 « La Skill se déclenche parce que sa description correspond. »
→ beat 3 « Un hook bloque l’écriture d’un jeton : code de sortie 2, Claude reformule. »
→ beat 4 « La garde tourne après chaque modification et Claude corrige seul. »
→ beat 5 « Le relecteur trouve deux points ; correction, tests verts, commit. C’est exactement ce que vous allez construire. »

ANIMATION — Faire la démo en vrai si possible (dépôt à l’état A4.5, application de bureau, onglet Code), sinon dérouler la page. Prévoir 4 minutes : une démo en direct déborde vite.

TRANSITION — « Bon appétit, reprise à 12 h 30. »`,
  `⏱ 30 min · DÉJEUNER · J2 12:00

OBJECTIF — Pause déjeuner.

ANIMATION — Lancer le minuteur.

TRANSITION — « Atelier 4. »`,
  `⏱ 3 min · BRIEF ATELIER 4 (minuteur 100 min)

OBJECTIF — Lancer l’atelier : la configuration agentique complète du dépôt.

DIRE — « Cinq étapes, et à la fin votre dépôt est prêt pour que Claude Code y travaille seul et en sécurité. Vous écrivez la configuration, Claude Code fait le travail, et vous vérifiez qu’il se comporte comme prévu. Points d’étape à 12 h 55, 13 h 20 et 13 h 50. »

ANIMATION — Lancer le minuteur. Blocages fréquents : Skill qui ne se déclenche pas (description trop vague ; ouvrir une nouvelle session après l’avoir créée) ; hook qui ne bloque pas (code de sortie 1 au lieu de 2, ou matcher qui ne correspond pas) ; serveur MCP absent (relancer la session, vérifier /mcp).

TRANSITION — « Le détail des étapes. »`,
  `⏱ 2 min · ÉTAPES DE L’ATELIER 4

OBJECTIF — Montrer les étapes et les reprises.

DIRE — « Pour chaque étape, testez le comportement : demandez à Claude de lire .env, d’écrire un jeton en dur, d’ajouter un champ. Ce qui doit être bloqué doit l’être. »

TRANSITION — « Pause à 14 h 15. »`,
  `⏱ 10 min · PAUSE · J2 14:15

OBJECTIF — Vraie pause.

ANIMATION — Lancer le minuteur.

TRANSITION — « Le défi final. »`,
];
// @@NOTES-END
