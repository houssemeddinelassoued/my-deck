// ─── M1 · Timeline: from completion to agents ───────────────────────────────
const Era = ({ n, x, year, tone, icon, title, children }: { n: number; x: number; year: string; tone: Tone; icon: IconName; title: string; children: ReactNode }) => (
  <>
    <div className={b.pop(n)} style={{ position: 'absolute', left: x + 128, top: 448, width: 34, height: 34, borderRadius: 99, background: STRONG[tone], boxShadow: '0 0 0 6px #fff' }} />
    <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 290, width: 290, textAlign: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 58, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{year}</div>
    </div>
    <div
      className={b.on(n)}
      style={{ position: 'absolute', left: x, top: 520, width: 270, height: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 22px', ...dl(120) }}
    >
      <IconTile name={icon} tone={tone} size={60} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.08, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </>
);

const M1_Timeline: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>De l’autocomplétion aux agents</Title>
    <Lede>En cinq ans, l’assistant est passé de « finir ma ligne » à « exécuter ma tâche ».</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <line x1={140} y1={465} x2={1800} y2={465} stroke={C.rule} strokeWidth={6} strokeLinecap="round" />
      <line x1={140} y1={465} x2={1800} y2={465} stroke={C.blue} strokeWidth={6} strokeLinecap="round" pathLength={1} className={b.draw(1)} style={{ transitionDuration: '2600ms' } as CSSProperties} />
    </svg>
    <Era n={1} x={120} year="2021" tone="grey" icon="code" title="Complétion">
      Copilot en préversion : la suite de la ligne ou de la fonction, en gris.
    </Era>
    <Era n={2} x={402} year="2022" tone="blue" icon="chat" title="Chat">
      ChatGPT : on décrit, on copie-colle. Le code sort de l’IDE.
    </Era>
    <Era n={3} x={684} year="2023" tone="teal" icon="layers" title="Chat dans l’IDE">
      Copilot Chat, JetBrains AI, Cursor : le chat voit vos fichiers.
    </Era>
    <Era n={4} x={966} year="2024" tone="violet" icon="doc" title="Édition multi-fichiers">
      Plusieurs modèles au choix, diffs sur plusieurs fichiers, protocole MCP.
    </Era>
    <Era n={5} x={1248} year="2025" tone="green" icon="bot" title="Agents">
      Mode agent, Claude Code, GPT-5 : l’IA lance les tests et itère.
    </Era>
    <Era n={6} x={1530} year="2026" tone="yellow" icon="users" title="Agents en équipe">
      Tâches confiées par ticket, revue de PR, instructions de projet partagées.
    </Era>
  </Frame>
);

// ─── M1 · How an LLM writes code ────────────────────────────────────────────
const TokBar = ({ tok, p, ok, n }: { tok: string; p: number; ok?: boolean; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 54 }}>
    <span style={{ width: 230, fontFamily: mono, fontSize: 25, color: ok ? C.green : C.ink, textAlign: 'right', whiteSpace: 'pre' }}>{tok}</span>
    <div style={{ flex: 1, height: 34, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: `${p}%`, height: '100%', background: ok ? C.green : '#93C1E8', borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 80, fontFamily: mono, fontSize: 23, color: C.muted }}>
      {p} %
    </span>
  </div>
);

const M1_Predict: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comment un assistant écrit du code</Title>
    <Lede>Il ne « sait » pas : il prédit le morceau de texte (jeton) le plus probable, puis recommence.</Lede>
    <CodeDark cls={A.in} file="remise.py" size={25} style={{ position: 'absolute', left: 120, top: 290, width: 760, ...dl(100) }}>
      <Kw>def</Kw> <Fn>prix_remise</Fn>(prix, taux):{'\n'}
      {'    '}
      <St>"""Prix après remise de taux %."""</St>
      {'\n'}
      {'    '}
      <Kw>return</Kw> prix * (<Nu>1</Nu> -<span className={A.blink} style={{ display: 'inline-block', width: 3, height: 32, background: C.yellow, verticalAlign: 'middle' }} />
    </CodeDark>
    <div style={{ position: 'absolute', left: 980, top: 290, width: 820 }}>
      <Eyebrow c={C.muted}>Jetons candidats après « (1 - »</Eyebrow>
      <div style={{ marginTop: 18 }}>
        <TokBar tok=" taux / 100" p={71} ok n={1} />
        <TokBar tok=" taux" p={18} n={1} />
        <TokBar tok=" remise" p={6} n={1} />
        <TokBar tok=" 0.01 * taux" p={4} n={1} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 28 }}>
      <Card cls={b.on(2)} tone="blue" icon="chart" title="Probable" size={24}>
        Le modèle choisit la suite la plus vraisemblable d’après des milliards de lignes de code.
      </Card>
      <Card cls={b.on(2)} tone="coral" icon="alert" title="Pas prouvé" size={24} style={dl(120)}>
        Plausible ≠ correct : « taux » seul serait accepté par Python… et faux.
      </Card>
      <Card cls={b.on(3)} tone="green" icon="target" title="Guidable" size={24}>
        Noms, types, docstring et tests changent les probabilités. C’est tout l’art du prompt.
      </Card>
    </div>
  </Frame>
);

// ─── M1 · What the assistant sees ───────────────────────────────────────────
const CtxIn = ({ y, icon, tone, children, n }: { y: number; icon: IconName; tone: Tone; children: ReactNode; n: number }) => (
  <div className={b.left(n)} style={{ position: 'absolute', left: 120, top: y, width: 560, height: 78, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '0 22px' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <span style={{ fontSize: 25, color: C.ink, lineHeight: 1.25 }}>{children}</span>
  </div>
);

const M1_Context: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Ce que voit l’assistant : le contexte</Title>
    <Lede>Ce qui n’est pas dans sa fenêtre de contexte n’existe pas pour lui.</Lede>
    <CtxIn y={270} icon="code" tone="blue" n={1}>
      Le fichier ouvert, autour du curseur
    </CtxIn>
    <CtxIn y={362} icon="layers" tone="blue" n={1}>
      Les onglets ouverts, la sélection
    </CtxIn>
    <CtxIn y={454} icon="link" tone="teal" n={2}>
      Les fichiers joints : #file, @workspace
    </CtxIn>
    <CtxIn y={546} icon="note" tone="teal" n={2}>
      Les instructions de projet (AGENTS.md…)
    </CtxIn>
    <CtxIn y={638} icon="tool" tone="green" n={2}>
      Les résultats d’outils : terminal, tests
    </CtxIn>
    <CtxIn y={730} icon="chat" tone="violet" n={2}>
      L’historique de la conversation
    </CtxIn>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={700} y1={540} x2={850} y2={540} color={C.blue} w={5} n={1} />
      <Arrow x1={1270} y1={540} x2={1400} y2={540} color={C.green} w={5} n={3} />
    </svg>
    <div className={A.in} style={{ position: 'absolute', left: 870, top: 330, width: 380, height: 420, boxSizing: 'border-box', background: G.blue, borderRadius: 22, boxShadow: SHADOW, padding: 30, color: '#fff', ...dl(100) }}>
      <Icon name="brain" size={64} color="#fff" sw={1.8} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 40 }}>Fenêtre de contexte</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.4, color: '#EAF4FB' }}>
        Grande, mais limitée et coûteuse. Trop de contexte inutile dilue l’attention du modèle.
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1420, top: 400, width: 380 }}>
      <Card tone="green" icon="sparkles" title="Suggestion" size={24}>
        Aussi bonne que le contexte fourni.
      </Card>
    </div>
    <Callout cls={b.on(3)} title="Règle d’or" tone="yellow" size={26} style={{ position: 'absolute', left: 870, top: 800, width: 930 }}>
      Joignez les bons fichiers, fermez les onglets sans rapport, écrivez vos conventions une fois.
    </Callout>
  </Frame>
);

// ─── M1 · Tools panorama ────────────────────────────────────────────────────
const ToolCard = ({ id, where, d, children }: { id: AppId; where: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 590, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 24px', ...dl(d) }}>
    <AppTile id={id} size={72} />
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{APPS[id].name}</div>
    <div style={{ marginTop: 8 }}>
      <Tag tone="grey" size={18}>
        {where}
      </Tag>
    </div>
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);
const Pt = ({ children }: { children: ReactNode }) => (
  <Bullet size={21} tone="blue">
    {children}
  </Bullet>
);

const M1_Tools: Page = () => (
  <Frame mod={1}>
    <Title>Les principaux outils</Title>
    <Lede>Les fonctions convergent ; ce qui change : l’intégration, le choix des modèles, la gouvernance.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 320px)', columnGap: 20 }}>
      <ToolCard id="copilot" where="VS Code, JetBrains, Visual Studio" d={100}>
        <Pt>Complétion, chat, édition, agent</Pt>
        <Pt>Agent de codage sur un ticket GitHub</Pt>
        <Pt>Revue de PR, plusieurs modèles</Pt>
      </ToolCard>
      <ToolCard id="chatgpt" where="Web, API, Codex (CLI et cloud)" d={200}>
        <Pt>Raisonnement à la demande</Pt>
        <Pt>Appels d’outils, longs contextes</Pt>
        <Pt>Intégré à Copilot et à Cursor</Pt>
      </ToolCard>
      <ToolCard id="jetbrains" where="IntelliJ, PyCharm, WebStorm…" d={300}>
        <Pt>Complétion locale et en nuage</Pt>
        <Pt>Actions : tests, doc, commit</Pt>
        <Pt>Junie : l’agent de JetBrains</Pt>
      </ToolCard>
      <ToolCard id="cursor" where="Éditeur dérivé de VS Code" d={400}>
        <Pt>Complétion « Tab » multi-lignes</Pt>
        <Pt>Agent, règles de projet</Pt>
        <Pt>Indexation de tout le dépôt</Pt>
      </ToolCard>
      <ToolCard id="claude" where="Terminal, VS Code, JetBrains" d={500}>
        <Pt>Agent en ligne de commande</Pt>
        <Pt>Plan, modifications, tests</Pt>
        <Pt>Instructions dans CLAUDE.md</Pt>
      </ToolCard>
    </div>
    <Hint cls={A.in} style={{ position: 'absolute', left: 120, top: 900, ...dl(700) }}>
      Les noms de modèles changent tous les trimestres : comparez les modes et l’intégration, pas les versions.
    </Hint>
  </Frame>
);

// ─── M1 · Models: GPT-5 and choosing ────────────────────────────────────────
const ModelRow = ({ task, kind, tone, d }: { task: string; kind: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 70, borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ flex: 1, fontSize: 25, color: C.ink }}>{task}</span>
    <Tag tone={tone} size={21}>
      {kind}
    </Tag>
  </div>
);

const M1_Models: Page = () => (
  <Frame mod={1}>
    <Title>Un outil, plusieurs modèles</Title>
    <Lede>GPT-5 et ses concurrents raisonnent plus ou moins longtemps selon la tâche. À vous de choisir.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '28px 32px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <AppTile id="chatgpt" size={64} />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>GPT-5 : capacités avancées</div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Bullet size={25}>
          <Strong>Raisonnement à la demande</Strong> : réponse rapide ou réflexion longue
        </Bullet>
        <Bullet size={25}>
          <Strong>Agentique</Strong> : appelle des outils, enchaîne des étapes
        </Bullet>
        <Bullet size={25}>
          <Strong>Long contexte</Strong> : plusieurs fichiers, une longue spec
        </Bullet>
        <Bullet size={25}>
          <Strong>Multimodal</Strong> : une capture d’écran devient une interface
        </Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 280, width: 840 }}>
      <Eyebrow cls={A.in} c={C.muted} style={dl(200)}>
        Quel type de modèle pour quelle tâche ?
      </Eyebrow>
      <div style={{ marginTop: 12 }}>
        <ModelRow task="Compléter une ligne, renommer, petit test" kind="Rapide" tone="green" d={300} />
        <ModelRow task="Expliquer un module, écrire une fonction" kind="Standard" tone="blue" d={400} />
        <ModelRow task="Bogue subtil, concurrence, algorithme" kind="Raisonnement" tone="violet" d={500} />
        <ModelRow task="Plan de migration, architecture" kind="Raisonnement" tone="violet" d={600} />
        <ModelRow task="Tâche agent sur 10 fichiers" kind="Agentique" tone="yellow" d={700} />
      </div>
    </div>
    <Callout cls={A.in} title="Le bon réflexe" tone="blue" icon="gauge" size={25} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(800) }}>
      Commencez rapide ; passez au raisonnement quand la première réponse est fausse pour une raison de fond. Plus lent et plus cher n’est pas toujours mieux.
    </Callout>
  </Frame>
);

// ─── M1 · The 4 modes ───────────────────────────────────────────────────────
const ModeCol = ({ n, x, tone, icon, title, who, ex, risk }: { n: number; x: number; tone: Tone; icon: IconName; title: string; who: string; ex: string; risk: string }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 330, width: 396, height: 520, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '28px 28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={64} solid />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>{title}</div>
    </div>
    <Eyebrow c={C.muted} size={19} style={{ marginTop: 22 }}>
      Qui décide de chaque ligne ?
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 25, lineHeight: 1.35, color: C.ink }}>{who}</div>
    <Eyebrow c={C.muted} size={19} style={{ marginTop: 18 }}>
      Exemple
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.4, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
    <div style={{ position: 'absolute', left: 28, bottom: 24 }}>
      <Tag tone={tone} size={19}>
        {risk}
      </Tag>
    </div>
  </div>
);

const M1_Modes: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Les 4 modes d’interaction</Title>
    <Lede>Plus l’autonomie monte, plus la tâche avance vite… et plus la relecture compte.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="dv-auto" x1="0" x2="1">
          <stop offset="0" stopColor="#93C1E8" />
          <stop offset="1" stopColor={C.amber} />
        </linearGradient>
      </defs>
      <rect x={120} y={280} width={1680} height={14} rx={7} fill="url(#dv-auto)" />
      <text x={120} y={318} fontFamily="Barlow" fontSize={20} fill={C.muted}>
        AUTONOMIE FAIBLE
      </text>
      <text x={1800} y={318} fontFamily="Barlow" fontSize={20} fill={C.muted} textAnchor="end">
        AUTONOMIE FORTE
      </text>
    </svg>
    <ModeCol n={1} x={120} tone="blue" icon="code" title="Complétion" who="Vous, Tab par Tab." ex="La suite de la ligne, une fonction à partir de sa docstring." risk="Relire chaque suggestion" />
    <ModeCol n={2} x={548} tone="teal" icon="chat" title="Chat" who="Vous : il répond, vous appliquez." ex="« Pourquoi ce test échoue-t-il ? » « Compare ces 2 options. »" risk="Vérifier les affirmations" />
    <ModeCol n={3} x={976} tone="violet" icon="doc" title="Édition" who="L’IA propose un diff, vous l’acceptez." ex="« Extrais cette logique en fonction dans ces 3 fichiers. »" risk="Relire le diff" />
    <ModeCol n={4} x={1404} tone="yellow" icon="bot" title="Agent" who="L’IA, en boucle ; vous validez les étapes." ex="« Ajoute la commande export et fais passer les tests. »" risk="Plan, garde-fous, revue" />
  </Frame>
);

// ─── M1 · Exercise: which mode? ─────────────────────────────────────────────
const ModeBin = ({ x, tone, title }: { x: number; tone: Tone; title: string }) => (
  <div style={{ position: 'absolute', left: x, top: 520, width: 405, height: 440, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: T[tone].fg }}>{title}</div>
  </div>
);

const M1_ModesEx: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Quel mode pour quelle tâche ?</Title>
    <Lede>Dites-moi où va chaque étiquette. Plusieurs réponses se défendent : justifiez.</Lede>
    <ModeBin x={120} tone="blue" title="Complétion" />
    <ModeBin x={545} tone="teal" title="Chat" />
    <ModeBin x={970} tone="violet" title="Édition" />
    <ModeBin x={1395} tone="yellow" title="Agent" />
    <Drag x={120} y={270} w={405} tone="grey" size={22}>
      Écrire le corps d’un getter évident
    </Drag>
    <Drag x={545} y={270} w={405} tone="grey" size={22}>
      Comprendre un module de 800 lignes
    </Drag>
    <Drag x={970} y={270} w={405} tone="grey" size={22}>
      Renommer un concept dans 6 fichiers
    </Drag>
    <Drag x={1395} y={270} w={405} tone="grey" size={22}>
      Migrer 40 tests de unittest à pytest
    </Drag>
    <Drag x={120} y={380} w={405} tone="grey" size={22}>
      Choisir entre deux bibliothèques
    </Drag>
    <Drag x={545} y={380} w={405} tone="grey" size={22}>
      Ajouter une commande + ses tests
    </Drag>
    <Drag x={970} y={380} w={405} tone="grey" size={22}>
      Expliquer une trace d’erreur
    </Drag>
    <Drag x={1395} y={380} w={405} tone="grey" size={22}>
      Compléter un tableau de constantes
    </Drag>
  </Frame>
);

// ─── M1 · The agent loop ────────────────────────────────────────────────────
const LoopNode = ({ x, y, icon, tone, title, n }: { x: number; y: number; icon: IconName; tone: Tone; title: string; n: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 120, top: y - 62, width: 240, height: 124, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px' }}>
    <IconTile name={icon} tone={tone} size={54} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
  </div>
);

const M1_AgentLoop: Page = () => {
  const path = 'M 560 330 L 860 330 L 860 560 L 860 790 L 560 790 L 260 790 L 260 560 L 260 330 Z';
  return (
    <Frame mod={1} beats={3}>
      <Title>Ce que fait un agent</Title>
      <Lede>Une boucle : il agit, observe le résultat (tests, erreurs), et recommence.</Lede>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <path d={path} fill="none" stroke={C.rule} strokeWidth={6} strokeDasharray="12 14" className={A.march} />
        <FlowDot path={path} dur={6} color={C.blue} r={9} />
      </svg>
      <LoopNode x={560} y={330} icon="map" tone="blue" title="Planifier" n={1} />
      <LoopNode x={860} y={560} icon="search" tone="teal" title="Lire le code" n={1} />
      <LoopNode x={560} y={790} icon="code" tone="violet" title="Modifier" n={1} />
      <LoopNode x={260} y={560} icon="play" tone="green" title="Exécuter" n={1} />
      <div className={b.on(1)} style={{ position: 'absolute', left: 420, top: 520, width: 280, textAlign: 'center', fontSize: 23, color: C.muted, lineHeight: 1.35 }}>
        tests rouges ?
        <br />
        on recommence
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card cls={b.on(2)} tone="green" icon="humanCheck" title="Vos points de contrôle" size={24}>
          Valider le plan · approuver les commandes sensibles · relire le diff final · décider de fusionner.
        </Card>
        <Card cls={b.on(3)} tone="coral" icon="alert" title="Ce qui peut mal tourner" size={24}>
          Il modifie un test pour le faire passer, sort du périmètre, installe un paquet inconnu, tourne en rond.
        </Card>
        <Callout cls={b.on(3)} title="Garde-fous" tone="yellow" icon="shield" size={24}>
          Instructions de projet, branche dédiée, permissions limitées, tests comme critère d’arrêt.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M1 · Use cases and benefits ────────────────────────────────────────────
const UseCase = ({ icon, tone, title, gain, d, children }: { icon: IconName; tone: Tone; title: string; gain: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 14 }}>
      <Tag tone={tone} size={19}>
        {gain}
      </Tag>
    </div>
  </div>
);

const M1_UseCases: Page = () => (
  <Frame mod={1}>
    <Title>Cas d’usage pour une équipe de développement</Title>
    <Lede>Les gains sont réels là où le travail est répétitif, documenté ou facile à vérifier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 26, rowGap: 24 }}>
      <UseCase icon="code" tone="blue" title="Code répétitif" gain="Gain élevé, risque faible" d={100}>
        Mappers, validations, appels d’API, scripts : ce qu’on écrit pour la 50ᵉ fois.
      </UseCase>
      <UseCase icon="search" tone="teal" title="Comprendre l’inconnu" gain="Accueil des nouveaux" d={180}>
        Expliquer un module hérité, une expression régulière, une requête SQL de 60 lignes.
      </UseCase>
      <UseCase icon="check" tone="green" title="Tests" gain="Couverture, cas limites" d={260}>
        Première suite de tests, cas limites oubliés, données de test réalistes.
      </UseCase>
      <UseCase icon="doc" tone="violet" title="Documentation" gain="Enfin à jour" d={340}>
        Docstrings, README, notes de version, descriptions de pull request.
      </UseCase>
      <UseCase icon="eye" tone="yellow" title="Revue de code" gain="Premier filtre" d={420}>
        Repérer oublis, failles connues et incohérences avant le relecteur humain.
      </UseCase>
      <UseCase icon="loop" tone="coral" title="Migrations" gain="Gros volume" d={500}>
        Version de framework, bibliothèque obsolète, changement d’API sur tout le dépôt.
      </UseCase>
    </div>
  </Frame>
);

// ─── M1 · What the studies say ──────────────────────────────────────────────
const Evid = ({ value, tone, title, d, children }: { value: ReactNode; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 440, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '30px 28px', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 96, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 26, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M1_Evidence: Page = () => (
  <Frame mod={1}>
    <Title>Ce que disent les études</Title>
    <Lede>Des gains réels sur des tâches ciblées ; des résultats plus nuancés sur du vrai travail.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 26 }}>
      <Evid value={<CountUp to={55} prefix="+" suffix=" %" />} tone="green" title="plus rapide sur une tâche ciblée" d={100}>
        Écrire un serveur HTTP en JavaScript, avec ou sans Copilot (95 développeurs).
      </Evid>
      <Evid value={<CountUp to={19} prefix="−" suffix=" %" />} tone="coral" title="plus lent… en se croyant plus rapide" d={250}>
        16 développeurs expérimentés, sur leurs propres dépôts. Ils estimaient avoir gagné 20 %.
      </Evid>
      <Evid value={<CountUp to={84} suffix=" %" />} tone="blue" title="utilisent ou vont utiliser l’IA" d={400}>
        Mais 46 % se méfient de l’exactitude des réponses, contre 33 % qui lui font confiance.
      </Evid>
      <Evid value={<CountUp to={66} suffix=" %" />} tone="yellow" title="« presque juste, mais pas tout à fait »" d={550}>
        Première frustration citée : le code presque bon, long à corriger.
      </Evid>
    </div>
    <Callout cls={A.in} title="À retenir" size={25} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(700) }}>
      Le gain dépend de la tâche, du contexte fourni et de la vérification. Mesurez chez vous, sur vos tâches.
    </Callout>
    <Src y={940}>GitHub Research (2022) · METR (juillet 2025) · Stack Overflow Developer Survey 2025.</Src>
  </Frame>
);

// ─── M1 · Quiz ──────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Une fonction qui n’existe pas"
    q="L’assistant propose df = pandas.read_excelx(chemin). La fonction n’existe pas. Pourquoi ?"
    explain="Le modèle prédit un texte plausible. Un nom d’API qui « sonne juste » peut être inventé : c’est une hallucination. Seuls la documentation, l’exécution et les tests tranchent."
  >
    <Opt ok why="Exact : read_excel existe, read_excelx non. Le modèle a produit un nom vraisemblable sans vérifier qu’il existe.">
      Le modèle a prédit un nom plausible, sans le vérifier
    </Opt>
    <Opt why="Piège ! Aucune version de pandas n’a read_excelx. Croire à une « nouvelle version » est le réflexe qui fait perdre une heure.">
      C’est une fonction d’une version récente de pandas
    </Opt>
    <Opt why="Piège : un mode plus coûteux réduit les erreurs, sans les supprimer. La vérification reste nécessaire.">
      Il fallait utiliser le mode agent, qui ne se trompe pas
    </Opt>
    <Opt why="Non : l’assistant n’exécute pas le code en complétion. Il ne teste rien avant de proposer.">
      L’assistant a testé, mais l’environnement est différent
    </Opt>
  </QcmPage>
);

// ─── Lab 01 ─────────────────────────────────────────────────────────────────
const L01_Brief: Page = () => (
  <LabBrief
    mod={1}
    n="01"
    title="Les 4 modes de votre assistant"
    dur="20 min"
    folder="lab01-decouverte"
    objective="Utiliser la complétion, le chat, l’édition et l’agent sur un même petit module, et savoir lequel choisir."
    cmd={
      <>
        <Pr>pytest labs/lab01-decouverte</Pr>
        {'\n'}
        <Ko>15 failed</Ko>
        {'  '}
        <Cm>au départ</Cm>
        {'\n'}
        <Pr>npm run test:lab01</Pr>
      </>
    }
    deliverable="Tous les tests verts et NOTES.md : une phrase par mode, « utile pour… / à éviter pour… »."
  >
    <LabStep n={1} t="5 min" title="Complétion">
      Effacez le raise, laissez venir la suggestion grise, lisez avant Tab
    </LabStep>
    <LabStep n={2} t="5 min" title="Chat">
      « Explique cette fonction. Quels cas limites ne sont pas testés ? »
    </LabStep>
    <LabStep n={3} t="5 min" title="Édition">
      convertir() avec un dictionnaire de fonctions : relisez le diff
    </LabStep>
    <LabStep n={4} t="5 min" title="Agent">
      Ajouter main(argv) pour faire passer test_cli : observez ce qu’il lance
    </LabStep>
  </LabBrief>
);

const L01_Go: Page = () => (
  <LabGo mod={1} n="01" minutes={20} folder="lab01-decouverte">
    <CheckItem id="l01-1">Étape 1 : les 4 conversions complétées, suggestions lues</CheckItem>
    <CheckItem id="l01-2">Étape 2 : un cas limite pertinent noté, un hors sujet aussi</CheckItem>
    <CheckItem id="l01-3">Étape 3 : convertir() en dictionnaire, diff relu, tests verts</CheckItem>
    <CheckItem id="l01-4">Étape 4 : main() par l’agent, sans toucher aux tests</CheckItem>
    <CheckItem id="l01-5">NOTES.md : une phrase par mode</CheckItem>
  </LabGo>
);

// ─── M1 · Synthesis ─────────────────────────────────────────────────────────
const M1_Synth: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Activez votre assistant dans l’IDE que vous utilisez déjà. Choisissez le mode selon la tâche, pas par habitude. Notez une tâche où il vous a fait gagner du temps… et une où il vous en a fait perdre.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      L’assistant prédit du code plausible : utile, jamais prouvé
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      La qualité dépend du contexte : fichiers, conventions, tests
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      4 modes, de la complétion à l’agent : l’autonomie a un prix
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      Les outils convergent : choisissez selon l’intégration et la gouvernance
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      Le gain se mesure sur vos tâches, pas dans les annonces
    </SynthRow>
  </SynthPage>
);

// ─── Module 2 divider ───────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title="Génération et réécriture de code" sub="Bien demander, donner le bon contexte, et faire évoluer du code existant sans rien casser." dur="≈ 1 h 45">
    <SecItem n={1}>Générer du code à partir de prompts</SecItem>
    <SecItem n={2}>Complétion intelligente et contextuelle</SecItem>
    <SecItem n={3}>Refactoriser et optimiser du code existant</SecItem>
    <SecItem n={4}>Bonnes pratiques pour des prompts efficaces</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M1_Timeline, M1_Predict, M1_Context, M1_Tools, M1_Models, M1_Modes, M1_ModesEx, M1_AgentLoop, M1_UseCases, M1_Evidence, M1_Quiz, L01_Brief, L01_Go, M1_Synth, M2_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · 6 CLICS

OBJECTIF — Montrer l'évolution : de l'outil qui complète à l'équipier qui exécute.

→ beat 1 : « 2021 : Copilot arrive en préversion. Il complète la ligne ou la fonction, en gris. Une révolution… sur quelques lignes. »
→ beat 2 : « 2022 : ChatGPT. On décrit en français, on copie-colle le code. Mais le code sort de l'IDE, sans le contexte du projet. »
→ beat 3 : « 2023 : le chat entre dans l'IDE : Copilot Chat, JetBrains AI, Cursor. Il voit vos fichiers. »
→ beat 4 : « 2024 : on choisit son modèle, l'édition porte sur plusieurs fichiers, et un protocole ouvert, MCP, permet de brancher des outils. »
→ beat 5 : « 2025 : les agents. Le mode agent de Copilot, Claude Code, GPT-5 : l'IA lance les tests, lit l'erreur et corrige. »
→ beat 6 : « 2026 : on confie un ticket à un agent, il ouvre une pull request ; les équipes partagent des fichiers d'instructions. »

MESSAGE — « Chaque étape donne plus d'autonomie à l'outil. Et donc plus d'importance à ce que vous vérifiez. »

TRANSITION — « Mais au fond, comment ça produit du code ? »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Démystifier : un modèle de langage prédit le jeton suivant.

DIRE — « Le curseur est après "1 -". Le modèle calcule une probabilité pour chaque suite possible. »
→ beat 1 : « 71 % pour "taux / 100", 18 % pour "taux" tout court… Il prend en général la plus probable. » Les chiffres sont illustratifs.
→ beat 2 : « Probable, c'est le résultat de milliards de lignes lues. Mais pas prouvé : "1 - taux" s'exécute très bien… et donne un prix négatif pour une remise de 20 %. »
→ beat 3 : « Bonne nouvelle : vous pouvez déplacer ces probabilités. Le nom de la fonction, la docstring "taux %", un type, un test : tout cela rend la bonne suite plus probable. »

INTERACTION — « Qui a déjà accepté une suggestion qui avait l'air parfaite et ne l'était pas ? » Une anecdote au micro.

TRANSITION — « Ce qui m'amène au contexte. »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Faire comprendre que la qualité de la réponse dépend du contexte envoyé au modèle.

→ beat 1 : « Par défaut, l'assistant voit le fichier ouvert autour du curseur, les onglets ouverts, votre sélection. »
→ beat 2 : « Vous pouvez en ajouter : joindre un fichier (#file dans Copilot, @ dans Cursor), tout l'espace de travail, des instructions de projet, et en mode agent, les résultats du terminal et des tests. »
→ beat 3 : « La suggestion est aussi bonne que ce contexte. Trop peu : il invente. Trop : il se perd. »

RÈGLE D'OR — Joindre les bons fichiers, fermer les onglets sans rapport, écrire ses conventions une fois (on le fait au module 2).

TRANSITION — « Quels outils font tout cela ? »`,
  `⏱ 4 min

OBJECTIF — Présenter les outils du programme sans tomber dans la comparaison de versions.

DIRE — Un outil par carte, 40 secondes chacun :
• GitHub Copilot : « Dans VS Code, JetBrains, Visual Studio. Complétion, chat, édition, mode agent ; on peut lui assigner un ticket GitHub et il ouvre une PR ; il fait aussi des revues de PR. »
• GPT-5 / ChatGPT : « Le modèle phare d'OpenAI, utilisable dans ChatGPT, par API, dans Codex, et comme modèle dans Copilot ou Cursor. »
• JetBrains AI Assistant : « Intégré à IntelliJ, PyCharm, WebStorm : complétion, actions sur le code, et Junie, l'agent de JetBrains. »
• Cursor : « Un éditeur dérivé de VS Code, conçu autour de l'IA : complétion multi-lignes, agent, règles de projet. »
• Claude Code : « Un agent en ligne de commande, qui s'intègre aussi aux IDE. Il planifie, modifie, lance les tests. »

MESSAGE — « Les fonctions convergent. Choisissez selon votre IDE, les modèles autorisés par votre entreprise et la gouvernance (journalisation, données). »

ATTENTION — Vérifiez la veille les nouveautés de chaque outil : les noms de modèles et les offres changent souvent.

TRANSITION — « Parlons justement des modèles, dont GPT-5. »`,
  `⏱ 3 min

OBJECTIF — Présenter les capacités avancées de GPT-5 (programme) et apprendre à choisir un type de modèle.

DIRE — « GPT-5 combine une réponse rapide et un raisonnement plus long quand la tâche le demande. Il appelle des outils et enchaîne des étapes : c'est ce qui rend les agents possibles. Il lit de longs contextes et des images : une capture d'écran peut devenir une première interface. »

TABLEAU — Lire 2 ou 3 lignes : « Pour compléter une ligne, un modèle rapide suffit. Pour un bogue de concurrence ou un algorithme, un modèle de raisonnement fait souvent mieux, mais plus lentement et plus cher. »

INTERACTION — « Dans votre outil, savez-vous quel modèle répond ? » Faites ouvrir le sélecteur de modèle (ils l'ont noté au lab 00).

TRANSITION — « Au-delà du modèle, c'est la façon de travailler qui compte : les 4 modes. »`,
  `⏱ 4 min · 4 CLICS

OBJECTIF — Distinguer les 4 modes par le niveau d'autonomie et le type de contrôle.

→ beat 1 : COMPLÉTION — « Vous décidez de chaque ligne avec Tab. Risque : accepter sans lire. »
→ beat 2 : CHAT — « Il répond, vous appliquez. Risque : croire une affirmation fausse. »
→ beat 3 : ÉDITION — « Il propose un diff, sur un ou plusieurs fichiers que vous désignez. Votre contrôle : relire le diff. »
→ beat 4 : AGENT — « Il enchaîne seul : lire, modifier, lancer, corriger. Votre contrôle : le plan, les garde-fous, la revue finale. »

MESSAGE — « Aucun mode n'est meilleur. On choisit selon la taille de la tâche et ce qu'on peut vérifier. »

TRANSITION — « À vous de jouer : quel mode pour quelle tâche ? »`,
  `⏱ 5 min · EXERCICE GLISSER-DÉPOSER

OBJECTIF — Ancrer le choix du mode sur des tâches concrètes.

ANIMATION — « Dites-moi où va chaque étiquette. » Prenez les propositions au micro, déplacez l'étiquette, demandez pourquoi. Double-clic : remet une étiquette à sa place.

PROPOSITION DE CORRIGÉ (plusieurs réponses se défendent) —
• Getter évident, tableau de constantes → Complétion.
• Comprendre un module de 800 lignes, choisir entre deux bibliothèques, expliquer une trace → Chat.
• Renommer un concept dans 6 fichiers → Édition (ou le refactoring de l'IDE, encore plus sûr !).
• Migrer 40 tests, ajouter une commande + ses tests → Agent.

À SOULIGNER — « Le renommage : l'outil de refactorisation de l'IDE est déterministe. L'IA n'est pas toujours le meilleur outil. »

TRANSITION — « Regardons de plus près ce que fait un agent. »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Comprendre la boucle d'un agent et où l'humain intervient.

DIRE — « Un agent tourne en boucle : il planifie, lit le code, modifie, exécute. Si les tests sont rouges, il lit l'erreur et recommence. Le point bleu tourne : c'est ça, un agent. »
→ beat 1 : les 4 étapes apparaissent.
→ beat 2 : « Vos points de contrôle : valider le plan, approuver les commandes sensibles, relire le diff, décider de fusionner. »
→ beat 3 : « Ce qui peut mal tourner : il modifie un test pour le faire passer, sort du périmètre, installe un paquet inconnu ou tourne en rond. D'où les garde-fous : instructions de projet, branche dédiée, permissions, tests comme critère d'arrêt. »

TRANSITION — « Concrètement, pour une équipe, où sont les gains ? »`,
  `⏱ 3 min

OBJECTIF — Les cas d'usage et bénéfices pour les équipes (programme).

DIRE — Parcourir les 6 cartes, en reliant chacune à un module :
• Code répétitif → module 2.
• Comprendre l'inconnu : « Le gain le plus sous-estimé : l'accueil d'un nouveau dans l'équipe. »
• Tests → module 5. Documentation et revue → module 4.
• Migrations : « Gros volume, très bon cas pour un agent… avec une très bonne suite de tests. »

INTERACTION — « Lequel de ces 6 vous ferait gagner le plus de temps cette semaine ? Un mot chacun. » 3 ou 4 réponses.

TRANSITION — « Et que disent les études sur ces gains ? »`,
  `⏱ 4 min

OBJECTIF — Donner une vision lucide, chiffres sourcés.

DIRE —
• « +55 % : l'étude de GitHub en 2022. 95 développeurs devaient écrire un serveur HTTP en JavaScript ; ceux avec Copilot ont fini 55 % plus vite. Tâche courte, bien définie. »
• « −19 % : l'étude de METR, juillet 2025. 16 développeurs open source expérimentés, sur leurs propres dépôts, 246 tâches. Avec l'IA, ils ont été 19 % plus lents… alors qu'ils estimaient avoir gagné 20 %. »
• « 84 % : l'enquête Stack Overflow 2025 : 84 % utilisent ou vont utiliser l'IA. Mais 46 % se méfient de l'exactitude. »
• « 66 % : la première frustration citée, c'est le code presque juste. »

MESSAGE — « Les deux études ne se contredisent pas : le gain dépend de la tâche, du contexte et de l'expérience. D'où l'intérêt de mesurer chez vous. »

TRANSITION — « Petit test. »`,
  `⏱ 3 min · QCM

ANIMATION — Les participants annoncent A, B, C ou D. Cliquez la réponse majoritaire, puis les autres. → révèle la bonne réponse, puis l'essentiel.

RÉPONSE — A.
• B ✗ PIÈGE — « Le réflexe "c'est sûrement une nouvelle version" fait perdre beaucoup de temps. »
• C ✗ — Le mode agent peut exécuter et détecter l'erreur, mais il peut aussi se tromper.
• D ✗ — En complétion, rien n'est exécuté.

MESSAGE — On appelle cela une hallucination. On en verra une variante dangereuse au module 3 : les paquets qui n'existent pas.

TRANSITION — « À vous de pratiquer les 4 modes. »`,
  `⏱ 2 min · CONSIGNE DU LAB 01

DIRE — « Lab 01, dossier labs/lab01-decouverte. Un convertisseur d'unités : 5 fonctions avec leur documentation, sans code. Vous allez les écrire avec les 4 modes, dans l'ordre. »
« Étape 1 : la complétion. Effacez la ligne raise, attendez la suggestion grise, lisez-la avant Tab. »
« Étape 2 : le chat explique et cherche des cas limites. »
« Étape 3 : l'édition réécrit convertir() avec un dictionnaire. Lisez le diff. »
« Étape 4 : l'agent ajoute une fonction main() pour faire passer test_cli. Regardez quels fichiers il lit et quelles commandes il lance. »

PIÈGE À ANNONCER — « Si l'agent modifie les tests pour les faire passer, refusez. Écrivez dans votre demande : ne modifie pas les tests. »

TRANSITION — « Minuteur lancé. »`,
  `⏱ 20 min · LAB 01 EN AUTONOMIE

ANIMATION — Lancez le minuteur. Points d'étape à 7 et 14 minutes : « Où en êtes-vous : étape 1, 2, 3 ou 4 ? » Cochez la checklist pour illustrer l'avancement du groupe.

BLOCAGES FRÉQUENTS —
• Pas de suggestion grise : vérifier que l'extension est connectée (icône en bas de l'IDE).
• Mode édition introuvable : Copilot Edits est intégré au chat dans les versions récentes (mode « Edit » ou « Agent » dans la liste).
• Imports en Python : lancer pytest depuis la racine du dépôt.

DÉBRIEF (3 min, en fin de lab) — « Pour chaque mode, une phrase : utile pour… à éviter pour… » Deux ou trois participants au micro.

Puis pause de 10 h 30.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 1

DIRE — Lire les cinq points en une phrase chacun.
Encadré bleu : « Dès lundi, notez une tâche où l'assistant vous a fait gagner du temps, et une où il vous en a fait perdre. C'est votre propre étude, plus utile que les miennes. »

TRANSITION — « Pause. Au retour : comment bien demander. »

⏸ PAUSE 10 h 30 – 10 h 45.`,
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 10 h 45)

DIRE — « Module 2 : génération et réécriture de code. Comment écrire une demande qui produit du code juste du premier coup, comment guider la complétion, et comment refactoriser du code existant sans rien casser. Deux labs : générer à partir d'une spécification avant le dîner, refactoriser du code hérité juste après. »

TRANSITION — « Commençons par l'anatomie d'une bonne demande. »`,
];
// @@NOTES-END
