// ─── Module 4 · Les fichiers qui guident Copilot ────────────────────────────
const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Les fichiers qui
        <br />
        guident Copilot
      </>
    }
    sub="Écrire une fois les règles de votre projet, au lieu de les répéter dans chaque prompt."
    dur="J1 · 15:10 – 16:45"
    labs={<Tag tone="green" size={19}>Atelier 4 · instructions testées en A/B</Tag>}
  >
    <SecItem n={1}>Quel fichier pour quel besoin</SecItem>
    <SecItem n={2}>copilot-instructions.md ou AGENTS.md</SecItem>
    <SecItem n={3}>Instructions ciblées avec applyTo, portée et priorité</SecItem>
    <SecItem n={4}>Prompt files et skills, l’éditeur de personnalisation</SecItem>
    <SecItem n={5}>Prouver qu’une instruction sert : le test A/B</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Quel fichier pour quel besoin ──────────────────────────────────────────
const M4Row = ({ path, what, when, tone, day, d }: { path: string; what: string; when: string; tone: Tone; day: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '560px minmax(0, 1fr) 300px 120px', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', borderLeft: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 19, color: T[tone].fg }}>{path}</span>
    <span style={{ fontSize: 21, color: C.ink, lineHeight: 1.3 }}>{what}</span>
    <span style={{ fontSize: 19, color: C.soft, lineHeight: 1.3 }}>{when}</span>
    <Tag tone={tone} size={16}>
      {day}
    </Tag>
  </div>
);

const M4_Panorama: Page = () => (
  <Frame mod={4}>
    <Title>Quel fichier pour quel besoin ?</Title>
    <Lede>Des fichiers Markdown versionnés avec le code. Le harnais Copilot les lit à la même place dans VS Code, le CLI et l’app.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M4Row path=".github/copilot-instructions.md" what="Les règles de la maison" when="à chaque requête" tone="navy" day="Aujourd’hui" d={100} />
      <M4Row path="AGENTS.md" what="La même chose, format partagé entre outils" when="à chaque requête" tone="navy" day="Aujourd’hui" d={160} />
      <M4Row path=".github/instructions/*.instructions.md" what="Des règles pour certains fichiers" when="si applyTo correspond" tone="blue" day="Aujourd’hui" d={220} />
      <M4Row path="~/.copilot/copilot-instructions.md" what="Vos préférences personnelles" when="dans tous vos projets" tone="teal" day="Aujourd’hui" d={280} />
      <M4Row path=".github/skills/<nom>/SKILL.md" what="Une méthode réutilisable, avec ses fichiers" when="à la demande" tone="violet" day="Module 6" d={340} />
      <M4Row path=".github/agents/<nom>.agent.md" what="Un rôle : consignes, outils, modèle" when="quand vous le choisissez" tone="violet" day="Module 6" d={400} />
      <M4Row path=".vscode/mcp.json" what="Des outils de plus pour l’agent" when="quand il en a besoin" tone="pink" day="Module 8" d={460} />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 880, ...dl(700) }}>
      Aujourd’hui les instructions ; demain les skills, les agents et les outils. Le dossier .github de Parafo est vide : vous l’écrivez.
    </Hint>
  </Frame>
);

// ─── copilot-instructions.md ────────────────────────────────────────────────
const M4_Instructions: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Les règles de la maison : copilot-instructions.md</Title>
    <Lede>Un fichier court, joint automatiquement à chaque requête du Chat et de l’agent.</Lede>
    <CodeDark file=".github/copilot-instructions.md" size={19} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Ck># Parafo · instructions pour Copilot</Ck>
      {'\n'}Parafo est un parapheur numérique FICTIF.{'\n'}JavaScript, modules ES, Node.js 22 ou plus.{'\n\n'}
      <Ck>## Règles maison</Ck>
      {'\n'}- Aucune dépendance npm : modules node: uniquement.{'\n'}- Donnée invalide : ErreurParafo (src/erreurs.js) avec{'\n  '}un code en MAJUSCULES, jamais throw new Error.{'\n'}- Messages, JSDoc et commentaires en français.{'\n'}- Fonctions pures : ne jamais modifier un paramètre.{'\n'}- Affichage : virgule décimale, 1 Ko = 1024 o.{'\n\n'}
      <Ck>## Tests</Ck>
      {'\n'}- node:test ; ne jamais modifier test/acceptance/.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Bien écrit" size={21} pad={22} cls={A.right} style={dl(200)}>
        Court, impératif, vérifiable. Une règle par ligne, pas une encyclopédie.
      </Card>
      <Card icon="eye" tone="blue" title="Vérifier qu’il est lu" size={21} pad={22} cls={A.right} style={dl(350)}>
        Sous la réponse, la liste « Références » cite le fichier.
      </Card>
      <Card icon="bolt" tone="violet" title="Le générer" size={21} pad={22} cls={A.right} style={dl(500)}>
        <Ic>/init</Ic> dans une session d’agent propose un premier jet à partir du projet. À relire et à raccourcir !
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Il guide le Chat et l’agent ; les suggestions inline, elles, imitent surtout le fichier ouvert.
    </Hint>
  </Frame>
);

// ─── copilot-instructions.md ou AGENTS.md ───────────────────────────────────
const M4_AgentsMd: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>copilot-instructions.md ou AGENTS.md ?</Title>
    <Lede>Le harnais Copilot lit l’un ou l’autre. La vraie question : quels outils utilise votre équipe ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
      <Card icon="git" tone="navy" title=".github/copilot-instructions.md" size={23} pad={28} cls={A.in} style={dl(100)}>
        <Bullet size={22} tone="navy">Le format historique de GitHub Copilot</Bullet>
        <Bullet size={22} tone="navy">Lu par VS Code, le CLI, l’app, github.com</Bullet>
        <Bullet size={22} tone="navy">Une équipe 100 % Copilot : parfait</Bullet>
      </Card>
      <Card icon="users" tone="violet" title="AGENTS.md (à la racine)" size={23} pad={28} cls={A.in} style={dl(220)}>
        <Bullet size={22} tone="violet">Un format partagé entre agents de code</Bullet>
        <Bullet size={22} tone="violet">Lu aussi par Codex et d’autres outils</Bullet>
        <Bullet size={22} tone="violet">Une équipe qui mélange les outils : un seul fichier</Bullet>
      </Card>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680 }}>
      <Callout tone="coral" icon="alert" title="Jamais deux sources qui se contredisent" size={24}>
        Copilot combine toutes les instructions applicables, sans ordre de priorité entre elles. Deux règles contraires : il choisit au hasard. Gardez-en un seul.
      </Callout>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(600) }}>
      AGENTS.md n’est pas un agent personnalisé : c’est un fichier d’instructions. Les agents arrivent au Module 6.
    </Hint>
  </Frame>
);

// ─── Instructions ciblées : applyTo ─────────────────────────────────────────
const M4Glob = ({ glob, file, children, d }: { glob: string; file: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: 16, alignItems: 'baseline', ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 20, color: C.electric }}>{glob}</span>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>
      <strong style={{ color: C.ink }}>{file}</strong> · {children}
    </span>
  </div>
);

const M4_ApplyTo: Page = () => (
  <Frame mod={4}>
    <Title>Des règles pour certains fichiers : applyTo</Title>
    <Lede>Un en-tête YAML dit à quels fichiers s’applique le fichier d’instructions. Le reste du temps, il ne coûte rien.</Lede>
    <CodeDark file=".github/instructions/tests.instructions.md" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>applyTo</Ck>: <Cs>"test/**/*.test.js"</Cs>
      {'\n'}
      <Ck>description</Ck>: <Cs>Conventions des tests de Parafo</Cs>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}- node:test et node:assert/strict.{'\n'}- Noms de tests en français.{'\n'}- Arrange / Act / Assert.{'\n'}- Une date fixe, jamais l’heure réelle.{'\n'}- Ne jamais modifier test/acceptance/.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Eyebrow c={C.navy} size={20}>
        Exemples de motifs
      </Eyebrow>
      <M4Glob glob="test/**/*.test.js" file="tests" d={200}>
        conventions de test
      </M4Glob>
      <M4Glob glob="**/*.py" file="Python" d={300}>
        le bonus de l’atelier
      </M4Glob>
      <M4Glob glob="src/legacy/**" file="code hérité" d={400}>
        « ne corrige rien pendant un refactoring »
      </M4Glob>
      <M4Glob glob="**" file="tout" d={500}>
        autant écrire copilot-instructions.md
      </M4Glob>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 730, width: 1680 }}>
      <Callout tone="yellow" icon="pointer" title="Piège classique" size={23} cls={A.in} style={dl(700)}>
        <Ic>tests/**</Ic> au lieu de <Ic>test/**</Ic> : le fichier n’est jamais appliqué, et rien ne vous prévient. Vérifiez les Références.
      </Callout>
    </div>
  </Frame>
);

// ─── Portée : personnel, dépôt, organisation, mémoire ───────────────────────
const M4Scope = ({ icon, tone, title, where, children, d }: { icon: IconName; tone: Tone; title: string; where: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontFamily: mono, fontSize: 17, color: T[tone].fg }}>{where}</div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M4_Portee: Page = () => (
  <Frame mod={4}>
    <Title>Qui dit quoi : quatre sources de consignes</Title>
    <Lede>Elles s’additionnent dans la même requête. Chacune à sa place, sans se contredire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
      <M4Scope icon="user" tone="teal" title="Vous" where="~/.copilot/copilot-instructions.md" d={100}>
        Vos préférences dans tous vos projets : langue des réponses, style d’explication.
      </M4Scope>
      <M4Scope icon="git" tone="navy" title="Le dépôt" where=".github/… ou AGENTS.md" d={200}>
        Les règles de l’équipe, versionnées et relues comme du code.
      </M4Scope>
      <M4Scope icon="org" tone="violet" title="L’organisation" where="réglée sur GitHub" d={300}>
        Des consignes communes, fixées par l’administrateur (offres entreprise).
      </M4Scope>
      <M4Scope icon="brain" tone="yellow" title="La mémoire" where="Copilot Memory" d={400}>
        Des faits que l’agent retient d’une session à l’autre. Consultables et supprimables.
      </M4Scope>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 690, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="blue" icon="target" title="Ce qui va où" size={22} cls={A.in} style={dl(600)}>
        Une règle d’équipe va dans le dépôt, jamais seulement dans vos préférences : vos collègues et la CI ne la verraient pas.
      </Callout>
      <Callout tone="coral" icon="shield" title="Rien de secret" size={22} cls={A.in} style={dl(750)}>
        Ces fichiers partent dans les requêtes : ni mot de passe, ni jeton, ni donnée client.
      </Callout>
    </div>
  </Frame>
);

// ─── Prompt files et skills ─────────────────────────────────────────────────
const M4_PromptSkill: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Prompt files et skills : l’ancien et le nouveau format</Title>
    <Lede>Une demande que vous répétez souvent mérite un fichier. Mais lequel ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(100) }}>
        <PanelTitle icon="note" c={C.muted}>
          Prompt file · .prompt.md
        </PanelTitle>
        <Bullet size={22} tone="grey">Un prompt enregistré, lancé avec /nom</Bullet>
        <Bullet size={22} tone="grey">Format du harnais Local (l’ancien moteur)</Bullet>
        <Bullet size={22} tone="grey">
          <strong>Ignoré</strong> par le harnais Copilot
        </Bullet>
      </div>
      <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', borderTop: `7px solid ${C.violet}`, ...dl(220) }}>
        <PanelTitle icon="sparkles" c={C.violet}>
          Skill · .github/skills/nom/SKILL.md
        </PanelTitle>
        <Bullet size={22} tone="violet">Une méthode, avec ses scripts et modèles</Bullet>
        <Bullet size={22} tone="violet">Chargée quand la demande s’y prête, ou par /nom</Bullet>
        <Bullet size={22} tone="violet">Standard ouvert, lu par Copilot et d’autres agents</Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 600, width: 1680 }}>
      <CodeDark file="un prompt file devenu skill · SKILL.md" size={20}>
        <Cc>---</Cc>
        {'\n'}
        <Ck>name</Ck>: <Cs>revue-rapide</Cs>
        {'\n'}
        <Ck>description</Ck>: <Cs>Relire un diff de Parafo avec la checklist maison.</Cs>
        {'\n'}
        <Ck>disable-model-invocation</Ck>: <Cn>true</Cn> <Cc>{'   # seulement quand vous tapez /revue-rapide'}</Cc>
        {'\n'}
        <Cc>---</Cc>
      </CodeDark>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Les skills en vrai : au Module 6, avec le refactoring.
    </Hint>
  </Frame>
);

// ─── L'éditeur de personnalisation, et la taille des fichiers ───────────────
const M4_Editeur: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Un seul endroit pour tout voir, et des fichiers courts</Title>
    <Lede>
      Commande <strong>Chat: Open Customizations</strong> : ce que la session Copilot charge vraiment, fichier par fichier.
    </Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: '#0F1530', borderRadius: 18, padding: '18px 22px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(100) }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Tag tone="blue" size={17}>Instructions</Tag>
        <Tag tone="grey" size={17}>Agents</Tag>
        <Tag tone="grey" size={17}>Skills</Tag>
        <Tag tone="grey" size={17}>Tools</Tag>
        <Tag tone="grey" size={17}>MCP</Tag>
        <Tag tone="grey" size={17}>Plugins</Tag>
      </div>
      <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.8, color: '#E6EAF6' }}>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> copilot-instructions.md <span style={{ color: '#9BE29B' }}>✓ chargé</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> tests.instructions.md <span style={{ color: '#FFD27A' }}>applyTo</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>User ›</span> copilot-instructions.md <span style={{ color: '#9BE29B' }}>✓ chargé</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> + nouveau fichier…
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="gauge" tone="coral" title="Chaque ligne se paie à chaque requête" size={22} pad={24} cls={A.right} style={dl(250)}>
        Les instructions occupent la fenêtre de contexte et coûtent des tokens, à chaque tour de boucle de l’agent.
      </Card>
      <Card icon="filter" tone="green" title="Règle de l’atelier : 60 lignes au plus" size={22} pad={24} cls={A.right} style={dl(400)}>
        Une règle n’y entre que si elle change le code produit. Le reste va dans un fichier ciblé ou une skill.
      </Card>
    </div>
  </Frame>
);

// ─── La méthode A/B ─────────────────────────────────────────────────────────
const M4Arm = ({ tone, title, children, d }: { tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: T[tone].bg, borderRadius: 18, padding: '20px 24px', boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: T[tone].fg }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M4_AB: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Prouver qu’une instruction sert : le test A/B</Title>
    <Lede>Une instruction que rien ne mesure est une opinion. On compare deux essais identiques, sauf un fichier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px minmax(0, 1fr)', gap: 16, alignItems: 'center' }}>
      <M4Arm tone="grey" title="A · sans instructions" d={100}>
        Session neuve, prompt exact, mode Agent. <Ic>npm run test:atelier4</Ic> : je note les tests verts.
      </M4Arm>
      <div style={{ textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 40, color: C.faint }}>vs</div>
      <M4Arm tone="green" title="B · avec instructions" d={250}>
        <strong>Nouvelle</strong> session, <strong>même</strong> prompt, mot pour mot. Les Références citent le fichier. Je note.
      </M4Arm>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <Card icon="flask" tone="blue" title="Ce qu’on mesure" size={22} pad={22}>
        Les tests de format : codes d’erreur, virgule décimale, types stricts. Ce sont vos règles maison.
      </Card>
      <Card icon="loop" tone="yellow" title="Ce qui fausse" size={22} pad={22}>
        Même session (le contexte de A pollue B), prompt reformulé, ou un autre modèle entre A et B.
      </Card>
      <Card icon="note" tone="violet" title="Ce qu’on garde" size={22} pad={22}>
        Les règles qui changent le résultat. Les autres sortent du fichier.
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M4_Lab: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Les instructions de Parafo, testées en A/B"
    defi="instructions"
    who="Individuel · 45 min"
    objective={
      <>
        Écrire les <strong>instructions du dépôt</strong> et un fichier ciblé pour les tests, puis <strong>prouver</strong> qu’ils changent le code : la même demande sans (A), puis avec (B).
      </>
    }
    where={
      <>
        <PathChip size={19}>.github/copilot-instructions.md</PathChip>
        <br />
        <PathChip size={19}>.github/instructions/tests.instructions.md</PathChip>
        <br />
        <PathChip size={19}>src/format.js</PathChip> · tableau A/B
      </>
    }
    minutes={45}
    crit={
      <>
        <CheckItem id="l4a" size={21}>test:atelier4 : 35 tests verts</CheckItem>
        <CheckItem id="l4b" size={21}>Les Références citent vos instructions</CheckItem>
        <CheckItem id="l4c" size={21}>Écart A/B noté dans JOURNAL.md</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (essai A noté ?) et 30 min (instructions écrites ?)."
  >
    <WStep n={1}>Essai A sans instructions : le prompt exact est dans le Chat. Notez les tests verts, gardez une copie, puis restaurez format.js.</WStep>
    <WStep n={2}>Les 7 règles maison en instructions courtes (60 lignes au plus), plus un fichier applyTo pour les tests.</WStep>
    <WStep n={3}>Essai B : nouvelle session, même prompt mot pour mot. Comparez, puis choisissez entre AGENTS.md et copilot-instructions.md.</WStep>
    <TpBonus>Python ou Java avec applyTo : faites écrire katas/python/reference.py ou katas/java/Reference.java.</TpBonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <Frame mod={4} kind="qcm">
    <Title>QCM · Module 4 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Où mettre la règle « toute erreur lève une ErreurParafo » ?" explain="C’est une règle d’équipe, valable dans tout le dépôt : les instructions du dépôt, versionnées. Vos préférences personnelles ne suivent pas le projet.">
        <QOpt ok>Dans les instructions du dépôt (.github/copilot-instructions.md ou AGENTS.md)</QOpt>
        <QOpt>Dans mes instructions personnelles</QOpt>
        <QOpt>Dans chaque prompt, à recopier</QOpt>
      </QuizQ>
      <QuizQ q="Votre fichier tests.instructions.md n’est jamais appliqué. Cause la plus probable ?" explain="Un motif applyTo qui ne correspond à aucun fichier (tests/** au lieu de test/**) : rien ne prévient, seule la liste des Références le montre.">
        <QOpt>Le fichier est trop court</QOpt>
        <QOpt ok>Le motif applyTo ne correspond pas aux fichiers</QOpt>
        <QOpt>Il faut redémarrer l’ordinateur</QOpt>
      </QuizQ>
      <QuizQ q="Un prompt file .prompt.md ne marche pas dans votre session Copilot. Pourquoi ?" explain="Les prompt files sont un format du harnais Local. Le harnais Copilot les ignore : on les transforme en skill (disable-model-invocation: true pour un usage à la demande).">
        <QOpt>Il manque une licence payante</QOpt>
        <QOpt>Il doit être dans le dossier test/</QOpt>
        <QOpt ok>C’est un format du harnais Local : on en fait une skill</QOpt>
      </QuizQ>
      <QuizQ q="Pour prouver qu’une instruction sert, il faut…" explain="Deux essais identiques sauf le fichier : même prompt, nouvelle session, même modèle, et une mesure objective (les tests).">
        <QOpt>Demander au Chat s’il l’a bien lue</QOpt>
        <QOpt ok>Comparer deux essais identiques, avec et sans, mesurés par les tests</QOpt>
        <QOpt>L’écrire en majuscules</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Bilan du Jour 1 ────────────────────────────────────────────────────────
const M4Key = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '20px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const M4_Bilan: Page = () => (
  <Frame mod={4} kind="synthese" label="Bilan du Jour 1">
    <Title>Bilan du Jour 1 : quatre réflexes acquis</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <M4Key n={1} tone="blue" title="Copilot prédit, il ne vérifie pas" d={100}>
        Du code plausible, à rendre correct par la lecture et les tests.
      </M4Key>
      <M4Key n={2} tone="navy" title="Le plus petit mode qui suffit" d={200}>
        Inline, Ask, Plan, Agent ; modèle Auto ; un œil sur les crédits.
      </M4Key>
      <M4Key n={3} tone="teal" title="Un prompt en cinq ingrédients" d={300}>
        Objectif, contexte, contraintes, critères, format ; un plan relu avant l’agent.
      </M4Key>
      <M4Key n={4} tone="green" title="Les règles du projet dans un fichier" d={400}>
        Court, versionné, et prouvé par un test A/B.
      </M4Key>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(600) }}>
      <PanelTitle icon="users">Restitution : 2 ou 3 volontaires, deux minutes chacun</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24, marginTop: 4 }}>
        <Bullet size={23}>Votre écart A/B à l’Atelier 4</Bullet>
        <Bullet size={23}>Une correction faite dans un plan</Bullet>
        <Bullet size={23}>Le mode que vous utiliserez lundi</Bullet>
      </div>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, ...dl(800) }}>
      Les autres peuvent déposer leur tableau A/B dans le Chat.
    </Hint>
  </Frame>
);

// ─── Billet de sortie ───────────────────────────────────────────────────────
const M4_Sortie: Page = () => (
  <Frame mod={4} kind="exercice" label="Fin du Jour 1">
    <Title>Billet de sortie, et rendez-vous demain</Title>
    <Lede>Une phrase chacun, au micro : ce que vous retenez, ce qui reste flou.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Key n={1} tone="blue" title="Ce que je retiens" d={100}>
        Le geste ou l’idée que vous utiliserez dès demain matin.
      </M4Key>
      <M4Key n={2} tone="yellow" title="Ce qui reste flou" d={200}>
        J’y réponds en ouverture du Jour 2.
      </M4Key>
      <M4Key n={3} tone="green" title="Mes crédits du jour" d={300}>
        Le total noté dans JOURNAL.md : nous en reparlerons demain.
      </M4Key>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1140, top: 262, width: 660, ...dl(400) }}>
      <Card icon="rocket" tone="violet" title="Demain · Jour 2" size={23} pad={28}>
        On délègue : régler l’agent, lui créer des collègues spécialisés, lui faire écrire des tests, lui brancher des outils, et une revue de code piégée.
        <div style={{ marginTop: 18, fontSize: 21, color: C.muted }}>
          9 h 00 · quiz de reprise. Atelier 4 pas fini ? <Ic>npm run reprise -- 4</Ic> avant de commencer.
        </div>
      </Card>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M4_Divider, M4_Panorama, M4_Instructions, M4_AgentsMd, M4_ApplyTo, M4_Portee, M4_PromptSkill, M4_Editeur, M4_AB, M4_Lab, M4_Qcm, M4_Bilan, M4_Sortie];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 4 · 15:10

OBJECTIF — Annoncer le module : écrire une fois les règles du projet.

DIRE — « Module 4. Cet après-midi, vous avez répété plusieurs fois les mêmes consignes : JSDoc en français, ErreurParafo, pas de dépendance. Ce module vous apprend à les écrire une fois pour toutes, dans des fichiers que Copilot lit tout seul. Et surtout à prouver qu’ils servent. »

TRANSITION — « Il existe plusieurs fichiers : lequel pour quel besoin ? »`,
  `⏱ 5 min · QUEL FICHIER POUR QUEL BESOIN

OBJECTIF — Donner la carte des fichiers de personnalisation, et ce qui sera vu quand.

DIRE — « Des fichiers Markdown, versionnés avec le code. Les instructions du dépôt, lues à chaque requête : copilot-instructions.md, ou AGENTS.md. Les instructions ciblées, pour certains fichiers seulement. Vos préférences personnelles, dans votre dossier utilisateur. Demain : les skills, des méthodes réutilisables ; les agents, des rôles ; et les outils MCP. »

DIRE — « Bonne nouvelle : le harnais Copilot les lit au même endroit dans VS Code, le CLI et l’app. Et le dossier .github de Parafo est vide : c’est vous qui l’écrivez. »

TRANSITION — « Commençons par le plus important. »`,
  `⏱ 7 min · COPILOT-INSTRUCTIONS.MD (démo)

OBJECTIF — Montrer un fichier d’instructions court et efficace, et comment vérifier qu’il est lu.

DIRE — « Voici à quoi ressemble un bon fichier : une ligne pour présenter le projet, puis des règles courtes, impératives, vérifiables. Pas une encyclopédie. Pour vérifier qu’il est lu : sous la réponse, la liste Références le cite. Et /init, dans une session d’agent, en propose un premier jet à partir du projet : à relire et à raccourcir. »

ANIMATION — En partage d’écran : poser une question dans le Chat de ma copie, ouvrir les Références et montrer le fichier cité.

TRANSITION — « On voit aussi passer un autre nom : AGENTS.md. »`,
  `⏱ 5 min · COPILOT-INSTRUCTIONS.MD OU AGENTS.MD

OBJECTIF — Aider à choisir entre les deux formats, et poser la règle « une seule source ».

DIRE — « Le harnais Copilot lit l’un ou l’autre. copilot-instructions.md, c’est le format historique de GitHub. AGENTS.md, à la racine, c’est un format partagé entre agents de code : il est lu aussi par Codex et d’autres. Une équipe 100 % Copilot : le premier suffit. Une équipe qui mélange les outils : AGENTS.md, un seul fichier. »

→ beat 1 « Et la règle d’or : jamais deux sources qui se contredisent. Copilot combine toutes les instructions applicables, sans ordre de priorité entre elles. Deux règles contraires, et le résultat devient imprévisible. »

ANIMATION — Précision si on la demande : AGENTS.md n’est pas un agent personnalisé, malgré son nom.

TRANSITION — « Et pour des règles qui ne valent que pour certains fichiers ? »`,
  `⏱ 5 min · APPLYTO

OBJECTIF — Montrer les instructions ciblées et le piège du motif qui ne correspond à rien.

DIRE — « Un fichier .instructions.md avec un en-tête : applyTo, un motif de fichiers. Ici, les conventions de test ne sont chargées que lorsque la demande concerne un fichier de test. Le reste du temps, elles ne coûtent rien. Autres exemples : Python pour le bonus de l’atelier, ou le code hérité. »

DIRE — « Le piège classique : tests au pluriel au lieu de test au singulier. Le fichier n’est jamais appliqué, et rien ne vous prévient. Seules les Références le montrent. »

TRANSITION — « Ces fichiers ne sont pas les seules sources de consignes. »`,
  `⏱ 5 min · QUATRE SOURCES DE CONSIGNES

OBJECTIF — Distinguer instructions personnelles, du dépôt, de l’organisation, et la mémoire.

DIRE — « Quatre sources s’additionnent dans la même requête. Vous : vos préférences, dans tous vos projets. Le dépôt : les règles de l’équipe. L’organisation : des consignes fixées par l’administrateur, dans les offres entreprise. Et la mémoire : des faits que l’agent retient d’une session à l’autre, que vous pouvez consulter et supprimer. »

DIRE — « Deux règles. Une règle d’équipe va dans le dépôt, sinon vos collègues ne la voient pas. Et rien de secret dans ces fichiers : ils partent dans chaque requête. »

TRANSITION — « Et pour une demande que vous répétez souvent ? »`,
  `⏱ 5 min · PROMPT FILES ET SKILLS

OBJECTIF — Expliquer pourquoi les prompt files ne marchent pas dans le harnais Copilot, et annoncer les skills.

DIRE — « Les anciens tutoriels parlent des prompt files : un prompt enregistré, lancé avec slash et son nom. C’était un format du harnais Local, l’ancien moteur. Le harnais Copilot les ignore. Le nouveau format, ce sont les skills : une méthode, avec ses fichiers, chargée quand la demande s’y prête ou quand vous tapez slash et son nom. »

→ beat 1 « Un prompt file se transforme facilement en skill : un nom, une description, et disable-model-invocation à true si vous voulez qu’elle ne se lance que sur votre demande. Les skills en vrai : demain, au Module 6. »

TRANSITION — « Comment voir tout ce qui est chargé ? »`,
  `⏱ 6 min · ÉDITEUR DE PERSONNALISATION (démo)

OBJECTIF — Montrer l’éditeur Agent Customizations et poser la règle des fichiers courts.

DIRE — « Commande Chat: Open Customizations. Un onglet par type de fichier : instructions, agents, skills, outils, MCP, plugins. Pour chaque fichier : chargé, conditionnel, ou ignoré. C’est le premier réflexe quand un fichier “ne marche pas”. »

DIRE — « Et une règle : des fichiers courts. Chaque ligne d’instruction occupe la fenêtre de contexte et coûte des tokens, à chaque requête et à chaque tour de boucle de l’agent. À l’atelier : soixante lignes au plus. »

ANIMATION — En partage d’écran : ouvrir l’éditeur, montrer l’onglet Instructions de ma copie.

TRANSITION — « Dernière question avant l’atelier : comment prouver qu’une instruction sert ? »`,
  `⏱ 6 min · LE TEST A/B

OBJECTIF — Donner la méthode de l’atelier : deux essais identiques sauf un fichier.

DIRE — « Une instruction que rien ne mesure est une opinion. Essai A : session neuve, un prompt exact, sans instructions ; je note les tests verts. Essai B : nouvelle session, le même prompt mot pour mot, avec les instructions ; les Références doivent citer le fichier ; je note. »

→ beat 1 « On mesure vos règles maison, que les tests de format vérifient. Ce qui fausse : la même session pour A et B, un prompt reformulé, un autre modèle. Et ce qu’on garde : les règles qui changent le résultat. Les autres sortent du fichier. »

TRANSITION — « À vous : quarante-cinq minutes. »`,
  `⏱ 45 min · ATELIER 4 (individuel) · 15:55

OBJECTIF — Écrire les instructions de Parafo et prouver leur effet par un test A/B.

DIRE — « Quarante-cinq minutes. Essai A sans instructions, avec le prompt exact que je colle dans le Chat. Vous notez, vous gardez une copie, vous restaurez le fichier. Puis vous écrivez les instructions : les sept règles maison, soixante lignes au plus, et un fichier ciblé pour les tests. Essai B : nouvelle session, même prompt. Et vous comparez. »

ACTION — Coller dans le Chat le prompt de l’essai A (README de l’atelier, étape 1).

ANIMATION — Points d’étape à 15 et 30 min. Pièges : essai B dans la même session ; instructions vagues ; applyTo « tests/** » ; contradiction entre deux fichiers. Si les Références ne citent pas le fichier : chemin exact et session neuve. Bonus Python ou Java pour les plus rapides.

TRANSITION — « QCM, puis bilan du jour. »`,
  `⏱ 5 min · QCM MODULE 4 (vote oral)

OBJECTIF — Vérifier : où mettre une règle, applyTo, prompt files et skills, méthode A/B.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Faisons le bilan de la journée. »`,
  `⏱ 10 min · BILAN DU JOUR 1 · 16:45

OBJECTIF — Ancrer quatre réflexes et faire témoigner 2 ou 3 volontaires.

DIRE — « Quatre réflexes aujourd’hui. Copilot prédit, il ne vérifie pas. Le plus petit mode qui suffit, avec le modèle Auto. Un prompt en cinq ingrédients, et un plan relu avant l’agent. Et les règles du projet dans un fichier court, prouvé par un test A/B. »

DIRE — « Deux ou trois volontaires, deux minutes chacun : votre écart A/B, une correction faite dans un plan, le mode que vous utiliserez lundi. Les autres, votre tableau dans le Chat si vous le souhaitez. »

TRANSITION — « Un dernier mot avant de nous quitter. »`,
  `⏱ 10 min · BILLET DE SORTIE (au micro)

OBJECTIF — Recueillir une phrase par participant, et préparer le Jour 2.

DIRE — « Une phrase chacun, dans l’ordre de la liste : ce que vous retenez, et ce qui reste flou. Je réponds au flou demain à 9 heures. Notez vos crédits du jour dans votre journal. Demain, on délègue vraiment : régler l’agent, lui créer des collègues spécialisés, des tests, des outils, et une revue piégée. Atelier 4 pas fini ? npm run reprise -- 4 avant de commencer. »

ANIMATION — Noter les points flous : y répondre au quiz de reprise.`,
];
// @@NOTES-END
