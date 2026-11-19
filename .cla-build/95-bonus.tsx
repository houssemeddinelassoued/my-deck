// ─── Bonus (hors deck de base) · Docker et bac à sable ──────────────────────

const X_Section: Page = () => (
  <Section n={13} num={0} title="Bonus · Docker et bac à sable" sub="Laisser des agents travailler sans demander, en sécurité, et en faire tourner plusieurs en parallèle." dur="hors programme · 30 min">
    <SecItem n={1}>Pourquoi isoler un agent</SecItem>
    <SecItem n={2}>Le bac à sable intégré de Claude Code</SecItem>
    <SecItem n={3}>Un conteneur de développement pour Claude Code</SecItem>
    <SecItem n={4}>Orchestrer plusieurs agents en parallèle</SecItem>
  </Section>
);
X_Section.transition = BLOOM;

// ─── Pourquoi isoler ────────────────────────────────────────────────────────
const X_Pourquoi: Page = () => (
  <Frame mod={13}>
    <Title>Pourquoi isoler un agent ?</Title>
    <Lede>Demander une permission à chaque commande protège, mais fatigue : on finit par tout accepter sans lire. L’isolation déplace la sécurité du clic vers l’environnement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="lock" tone="navy" title="Système de fichiers" size={23} pad={24} cls={A.in} style={dl(100)}>
        L’agent ne voit que le dépôt monté : ni vos clés SSH, ni vos autres projets, ni vos identifiants.
      </Card>
      <Card icon="globe" tone="blue" title="Réseau" size={23} pad={24} cls={A.in} style={dl(200)}>
        Liste blanche : registre de paquets, GitHub, API de Claude. Tout le reste est coupé, donc pas d’exfiltration.
      </Card>
      <Card icon="reset" tone="green" title="Jetable" size={23} pad={24} cls={A.in} style={dl(300)}>
        Une tâche, un conteneur. Résultat poussé sur une branche, conteneur détruit : aucun état caché.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680 }}>
      <Callout tone="coral" icon="alert" title="Ce que l’isolation ne règle pas" size={24} cls={A.in} style={dl(500)}>
        La qualité du code produit, et les secrets que vous montez vous-même dans le conteneur. Le harnais (garde, tests, relecture) reste indispensable.
      </Callout>
    </div>
  </Frame>
);

// ─── Bac à sable intégré ────────────────────────────────────────────────────
const X_Sandbox: Page = () => (
  <Frame mod={13}>
    <Title>Le bac à sable intégré de Claude Code</Title>
    <Lede>Claude Code peut exécuter ses commandes dans un bac à sable du système d’exploitation : accès en écriture limité au projet, réseau filtré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 860, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Row2 icon="terminal" tone="navy" title="Activation" d={100}>
        <Ic>/sandbox</Ic> dans la session, ou dans <Ic>.claude/settings.json</Ic> pour toute l’équipe
      </Row2>
      <Row2 icon="lock" tone="blue" title="Fichiers" d={200}>
        écriture dans le dossier du projet seulement ; lecture des chemins sensibles refusée
      </Row2>
      <Row2 icon="globe" tone="teal" title="Réseau" d={300}>
        seulement les domaines autorisés ; une nouvelle destination demande votre accord
      </Row2>
      <Row2 icon="check" tone="green" title="Effet" d={400}>
        les commandes dans le bac à sable peuvent s’exécuter sans demander à chaque fois
      </Row2>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card icon="cpu" tone="violet" title="Selon le système" size={22} pad={22} cls={A.right} style={dl(200)}>
        Repose sur les mécanismes d’isolation de macOS et de Linux ; sous Windows, passez par WSL 2 ou par un conteneur.
      </Card>
      <Callout tone="yellow" icon="calendar" title="À vérifier avant usage" size={22} cls={A.right} style={dl(350)}>
        Fonction récente et en évolution : options exactes et plateformes prises en charge dans la documentation de Claude Code, à la date de votre installation.
      </Callout>
    </div>
  </Frame>
);

// ─── Conteneur de développement ─────────────────────────────────────────────
const X_Devcontainer: Page = () => (
  <Frame mod={13}>
    <Title>Un conteneur de développement pour Claude Code</Title>
    <Lede>Le dépôt de Claude Code fournit une configuration de référence (devcontainer) avec un pare-feu en liste blanche. Le principe tient en quelques lignes :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file="Terminal · bonus" size={19} cls={A.left}>
        <Sh c="# image avec la stack, Claude Code et le pare-feu">docker build -t guichet-agent -f bonus/Dockerfile .</Sh>
        <Sh c="# seul le dépôt est monté, rien d’autre">{'docker run --rm -it \\'}</Sh>
        {'    -v "$PWD:/travail" -w /travail \\\n'}
        {'    --cap-add NET_ADMIN \\\n'}
        {'    guichet-agent claude\n'}
        {'\n'}
        <Cc>{'# dans le conteneur, et seulement là :'}</Cc>
        {'\n'}
        <Sh>claude --dangerously-skip-permissions</Sh>
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="shield" tone="navy" title="Pare-feu au démarrage" size={22} pad={22} cls={A.right} style={dl(200)}>
        Un script autorise npm, PyPI, Maven, NuGet, GitHub et l’API de Claude ; il bloque tout le reste.
      </Card>
      <Card icon="key" tone="coral" title="Identifiants" size={22} pad={22} cls={A.right} style={dl(350)}>
        Connexion à votre compte dans le conteneur ; jamais vos fichiers de clés ni le .env de production montés en volume.
      </Card>
      <Card icon="archive" tone="teal" title="Docker Sandboxes" size={22} pad={22} cls={A.right} style={dl(500)}>
        Docker Desktop propose aussi des bacs à sable prêts à l’emploi pour les agents de code : même idée, sans écrire le Dockerfile.
      </Card>
    </div>
  </Frame>
);

// ─── Orchestration en parallèle ─────────────────────────────────────────────
const X_Parallele: Page = () => (
  <Frame mod={13} beats={3}>
    <Title>Orchestrer plusieurs agents en parallèle</Title>
    <Lede>Une tâche, une branche, un conteneur. Les agents ne se marchent pas dessus ; vous relisez des PR, pas des sessions.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file="bonus/lancer-agents.sh (extrait)" size={19} cls={A.left}>
        <Ck>for</Ck> t <Ck>in</Ck> taches/*.md; <Ck>do</Ck>
        {'\n'}  b=<Cs>"agent/$(basename $t .md)"</Cs>
        {'\n'}  git worktree add <Cs>"../wt-$b"</Cs> -b <Cs>"$b"</Cs>
        {'\n'}  docker run -d --rm -v <Cs>"$PWD/../wt-$b:/travail"</Cs> guichet-agent \
        {'\n'}    claude -p <Cs>"$(cat $t)"</Cs> --dangerously-skip-permissions
        {'\n'}<Ck>done</Ck>
        {'\n'}<Cc>{'# chaque agent : implémente, lance garde + tests, commite sur sa branche'}</Cc>
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="git" tone="blue" title="1. Copies de travail Git" size={22} pad={22} cls={b.on(1)}>
        <Ic>git worktree</Ic> : un dossier et une branche par tâche, sur le même dépôt.
      </Card>
      <Card icon="layers" tone="navy" title="2. Un conteneur par agent" size={22} pad={22} cls={b.on(2)}>
        Isolés les uns des autres et de votre poste ; mêmes hooks et même garde, grâce au dossier .claude/ versionné.
      </Card>
      <Card icon="eye" tone="green" title="3. Vous relisez des PR" size={22} pad={22} cls={b.on(3)}>
        Le relecteur sécurité passe d’abord ; vous fusionnez ce qui est vert et relu.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1000 }}>
      <Callout tone="blue" icon="globe" title="Sans Docker" size={22} cls={b.on(3)}>
        Claude Code sur le Web fait la même chose dans le cloud : une session par tâche, une branche ou une PR à la fin.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier bonus ──────────────────────────────────────────────────────────
const X_Lab: Page = () => (
  <Frame mod={13} kind="bonus">
    <Title>Atelier bonus · trois agents, trois branches</Title>
    <Lede>Énoncé dans <Ic>ateliers/BONUS-docker.md</Ic> et annexe E du guide. Prérequis : Docker (ou Docker Desktop) autorisé sur le poste.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <LabStep id="B1" title="L’image" min={10} d={100}>
        Construisez <Ic>guichet-agent</Ic> ; dans le conteneur, vérifiez que <Ic>curl https://example.com</Ic> échoue et que <Ic>npm view</Ic> réussit.
      </LabStep>
      <LabStep id="B2" title="Un agent sans permissions, isolé" min={10} d={200}>
        Lancez une tâche avec <Ic>--dangerously-skip-permissions</Ic> dans le conteneur ; observez : aucun accès hors du dépôt monté.
      </LabStep>
      <LabStep id="B3" title="Trois en parallèle" min={10} d={300}>
        Trois fichiers dans <Ic>taches/</Ic>, <Ic>bonus/lancer-agents.sh</Ic>, puis relecture des trois branches avec le sous-agent relecteur.
      </LabStep>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [X_Section, X_Pourquoi, X_Sandbox, X_Devcontainer, X_Parallele, X_Lab];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · BONUS · DOCKER ET BAC À SABLE (hors programme)

OBJECTIF — Présenter le bonus, à montrer s’il reste du temps, ou à consulter seul avec l’annexe E du guide.

DIRE — « En bonus : comment laisser des agents travailler sans demander de permission, en sécurité, et en faire tourner plusieurs en parallèle. »

TRANSITION — « Pourquoi isoler ? »`,
  `⏱ 2 min · POURQUOI ISOLER

OBJECTIF — Faire comprendre que l’isolation remplace la fatigue des permissions.

DIRE — « Demander une permission à chaque commande protège, mais au bout de cinquante demandes, on accepte tout sans lire. L’isolation déplace la sécurité vers l’environnement : fichiers limités au dépôt, réseau en liste blanche, conteneur jetable. Mais elle ne règle ni la qualité du code, ni les secrets que vous montez vous-même. »

TRANSITION — « Première option, intégrée. »`,
  `⏱ 2 min · BAC À SABLE INTÉGRÉ

OBJECTIF — Présenter le bac à sable natif de Claude Code et ses limites de plateforme.

DIRE — « Claude Code peut lancer ses commandes dans un bac à sable du système : écriture limitée au projet, réseau filtré. Les commandes peuvent alors s’exécuter sans demander à chaque fois. Sous Windows, on passe par WSL 2 ou par un conteneur. »

ANIMATION — Fonction récente : vérifier la commande et les options dans la documentation de Claude Code avant la session.

TRANSITION — « Deuxième option : un conteneur. »`,
  `⏱ 3 min · CONTENEUR DE DÉVELOPPEMENT

OBJECTIF — Montrer le principe du devcontainer avec pare-feu, et le seul cadre acceptable pour --dangerously-skip-permissions.

DIRE — « Le dépôt de Claude Code fournit une configuration de référence avec un pare-feu en liste blanche. Le principe : une image avec votre stack et Claude Code, seul le dépôt monté, et un script qui n’autorise que les registres de paquets, GitHub et l’API de Claude. Dans ce conteneur, et seulement là, on peut lancer Claude Code sans permissions. »

DIRE — « Docker Desktop propose aussi des bacs à sable prêts à l’emploi pour les agents de code. »

ANIMATION — Les noms de commandes de Docker Sandboxes évoluent : vérifier la documentation Docker à jour.

TRANSITION — « Et pour en faire tourner plusieurs ? »`,
  `⏱ 3 min · ORCHESTRATION EN PARALLÈLE (3 beats)

OBJECTIF — Montrer le schéma une tâche = une branche = un conteneur.

DIRE — « Un petit script : pour chaque tâche, une copie de travail Git et une branche, un conteneur, et claude -p avec la tâche. »
→ beat 1 « Les copies de travail Git séparent les fichiers. »
→ beat 2 « Les conteneurs séparent les environnements ; les hooks et la garde suivent, car .claude/ est versionné. »
→ beat 3 « Et vous relisez des PR, après le relecteur sécurité. Sans Docker, Claude Code sur le Web fait la même chose dans le cloud. »

TRANSITION — « Si vous voulez essayer. »`,
  `⏱ 30 min · ATELIER BONUS (facultatif)

OBJECTIF — Proposer un atelier autonome de 30 minutes pour qui a Docker.

DIRE — « Trois étapes : l’image et son pare-feu, un agent sans permissions mais isolé, puis trois agents en parallèle relus par votre sous-agent. L’énoncé est dans le dépôt et dans l’annexe E du guide. »

ANIMATION — À proposer seulement si Docker est autorisé chez Wevioo.`,
];
// @@NOTES-END
