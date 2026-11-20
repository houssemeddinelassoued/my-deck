// ═══ Module 6 · Atelier · Un premier flux ═══════════════════════════════════

const M6_Section: Page = () => (
  <Section n={6} title="Atelier · Un premier flux" sub="Une démonstration Power Automate, puis votre premier scénario, de bout en bout." dur="1 h" kind="atelier">
    <SecItem n={1}>Démonstration d’un flux Power Automate simple</SecItem>
    <SecItem n={2}>Le même flux dans Make</SecItem>
    <SecItem n={3}>Votre premier scénario, testé</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Demo: a simple Power Automate cloud flow ───────────────────────────────
const M6PaCard = ({ app, kind, title, fields, beat }: { app: AppId; kind: NodeKind; title: string; fields: [string, ReactNode][]; beat?: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 12, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[NK[kind].tone]}`, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: C.panel }}>
      <AppTile id={app} size={38} />
      <span style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</span>
      <span style={{ marginLeft: 'auto' }}>
        <NodeChip kind={kind} size={17} />
      </span>
    </div>
    <div style={{ padding: '10px 20px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {fields.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 14, fontSize: 21 }}>
          <span style={{ width: 180, color: C.muted }}>{k}</span>
          <span style={{ color: C.ink }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const Pill = ({ children, tone = 'blue' }: { children: ReactNode; tone?: Tone }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 10px', borderRadius: 6, background: T[tone].bg, boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}`, color: T[tone].fg, fontWeight: 600, fontSize: '0.92em', whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const M6_DemoPA: Page = () => (
  <Frame mod={6} kind="demo" beats={3}>
    <Title>Démo · Un flux Power Automate en trois blocs</Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Cabinet d’architectes · les plans reçus des clients se perdent dans les boîtes</CasTag>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <M6PaCard app="outlook" kind="trigger" title="Lors de l’arrivée d’un nouvel e-mail (V3)" fields={[['Dossier', 'Boîte de réception'], ['Avec pièces jointes', 'Oui']]} />
      <div className={b.fade(1)}>
        <Icon name="download" size={36} color={C.faint} />
      </div>
      <M6PaCard beat={1} app="sharepoint" kind="action" title="Créer un fichier" fields={[['Dossier', 'Projets / Plans reçus'], ['Nom', <Pill key="n">Nom de la pièce jointe</Pill>]]} />
      <div className={b.fade(2)}>
        <Icon name="download" size={36} color={C.faint} />
      </div>
      <M6PaCard beat={2} app="teams" kind="action" title="Publier un message dans un canal" fields={[['Canal', 'Projets · Général'], ['Message', <span key="m">Nouveau plan de <Pill>De</Pill> : <Pill>Objet</Pill></span>]]} />
    </div>
    <div style={{ position: 'absolute', left: 960, top: 260, width: 840, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="play" title="Ce que je montre" size={24} cls={A.right}>
        Créer le flux depuis un modèle, choisir le déclencheur, insérer le <b>contenu dynamique</b> (les pastilles), tester, puis lire l’historique.
      </Card>
      <Callout cls={b.on(3)} title="Retenez la structure" tone="green" icon="layers" size={24}>
        Un déclencheur, des actions, des données qui passent d’un bloc à l’autre. <b>Exactement ce que vous allez faire dans Make.</b>
      </Callout>
      <Verified cls={A.fade} style={dl(500)}>
        Power Automate (infonuagique) demande une licence Microsoft 365. Libellés vérifiés en novembre 2026.
      </Verified>
    </div>
  </Frame>
);

// ─── The same idea in Make: our first scenario ──────────────────────────────
const M6_Make: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Votre premier scénario Make : deux modules</Title>
    <Lede>Une nouvelle demande arrive dans le classeur ; vous recevez un courriel qui la résume. Simple, mais complet.</Lede>
    <Chain
      x={260}
      y={330}
      size={150}
      gap={260}
      steps
      items={[
        { app: 'sheets', label: 'Google Sheets', sub: 'Watch New Rows · « Demandes IA135 »' },
        { app: 'gmail', label: 'Gmail', sub: 'Send an email · à vous-même' },
      ]}
    />
    <div className={b.on(1)} style={{ position: 'absolute', left: 1080, top: 300, width: 720 }}>
      <AppWin id="gmail" title="Courriel reçu">
        <div style={{ fontSize: 22, color: C.muted }}>
          Objet : Nouvelle demande de <Pill>Nom</Pill>
        </div>
        <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.5, color: C.ink }}>
          Bonjour,
          <br />
          <Pill>Nom</Pill> (<Pill>Courriel</Pill>) a écrit le <Pill>Date</Pill> :
          <br />« <Pill>Message</Pill> »
        </div>
      </AppWin>
    </div>
    <Callout cls={b.on(2)} title="Les pastilles" tone="blue" icon="link" style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      Chaque pastille est une <b>variable</b> : la valeur de la colonne, pour la ligne qui vient d’arriver. C’est le <b>mapping</b>, le cœur de tout workflow.
    </Callout>
  </Frame>
);

// ─── Step by step ───────────────────────────────────────────────────────────
const M6_PasAPas: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Pas à pas dans Make</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow cls={A.in}>Module 1 · le déclencheur</Eyebrow>
      <Do n={1}>
        <Kbd>Scenarios</Kbd> › <Kbd>Create a new scenario</Kbd>, puis le grand <Kbd>+</Kbd>.
      </Do>
      <Do n={2}>
        Cherchez <b>Google Sheets</b> › <Kbd>Watch New Rows</Kbd>. Créez la connexion avec votre compte Google.
      </Do>
      <Do n={3}>
        Choisissez le classeur <b>« Demandes IA135 »</b>, la feuille, <i>Table contains headers : Yes</i>, limite : 5.
      </Do>
      <Do n={4}>
        <i>Choose where to start</i> : <b>From now on</b>. Seules les nouvelles lignes compteront.
      </Do>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 200, width: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow cls={A.in} c={T.green.fg} style={dl(200)}>
        Module 2 · l’action, puis le test
      </Eyebrow>
      <Do n={5} tone="green">
        <Kbd>+</Kbd> à droite du module › <b>Gmail</b> › <Kbd>Send an email</Kbd>. Destinataire : votre adresse.
      </Do>
      <Do n={6} tone="green">
        Objet et contenu : cliquez dans le champ, puis sur les pastilles <Pill>Nom</Pill>, <Pill>Message</Pill>…
      </Do>
      <Do n={7} tone="green">
        <Kbd>Save</Kbd>, puis <Kbd>Run once</Kbd> : le scénario attend.
      </Do>
      <Do n={8} tone="green">
        Ajoutez une ligne fictive dans le classeur. Une bulle apparaît sur chaque module : cliquez-la pour voir les données.
      </Do>
    </div>
    <Callout cls={A.in} title="Gmail refuse la connexion ?" tone="yellow" icon="alert" size={23} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(500) }}>
      Certains comptes professionnels bloquent l’accès. Plan B : remplacez Gmail par <b>Google Sheets › Add a Row</b> dans une feuille « Journal ».
    </Callout>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M6_Atelier: Page = () => (
  <AtelierPage
    mod={6}
    n="Atelier 1"
    title="Votre premier scénario, de bout en bout"
    timerId="m6-atelier"
    minutes={25}
    tools="Make (offre gratuite) · Google Sheets · Gmail (ou une feuille « Journal »)"
    objective="Construire et tester un scénario à deux modules : une nouvelle ligne dans le classeur déclenche un courriel qui la résume."
    deliver={
      <>
        Un scénario <b>« IA135 · Atelier 1 »</b> sauvegardé, exécuté avec succès au moins une fois, et une capture de la bulle de données.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Le déclencheur voit la nouvelle ligne</CheckItem>
        <CheckItem id="b" size={22}>Le courriel contient les vraies valeurs</CheckItem>
        <CheckItem id="c" size={22}>L’historique montre une exécution réussie</CheckItem>
        <CheckItem id="d" size={22}>La planification reste désactivée</CheckItem>
      </>
    }
  >
    <Do n={1}>Suivez les 8 étapes de la page précédente (le pas à pas est aussi dans le Chat).</Do>
    <Do n={2}>Testez avec 2 lignes fictives : une demande normale, une avec un champ vide.</Do>
    <Do n={3}>Ouvrez les bulles de données : que reçoit le module 2 quand un champ est vide ?</Do>
    <Do n={4}>Renommez le scénario et sauvegardez. Notez dans votre carnet ce qui vous a bloqué.</Do>
    <Bonus>Ajoutez un filtre sur le lien : ne continuer que si le champ Message n’est pas vide.</Bonus>
  </AtelierPage>
);

// ─── First-time pitfalls ────────────────────────────────────────────────────
const M6_Pieges: Page = () => (
  <Frame mod={6}>
    <Title>Les six pièges du premier scénario</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 210, width: 1680 }}
      cols="560px 1fr"
      size={24}
      head={['Symptôme', 'Cause et solution']}
      rows={[
        ['Rien ne se passe après Run once', 'Le déclencheur démarre « From now on » : ajoutez une nouvelle ligne après avoir cliqué Run once.'],
        ['Le courriel arrive vide', 'Le texte a été tapé au lieu de cliquer sur les pastilles : refaites le mapping.'],
        ['Les colonnes s’appellent A, B, C', '« Table contains headers » est à No, ou la ligne 1 est vide : corrigez le classeur.'],
        ['Erreur de connexion', 'Connexion expirée ou refusée : recréez-la, ou passez au plan B (feuille Journal).'],
        ['Toutes les anciennes lignes reviennent', 'Point de départ réglé sur « All » : remettez « From now on » (clic droit sur le module).'],
        ['Les crédits fondent', 'Planification activée trop tôt : laissez-la désactivée tant que vous testez.'],
      ]}
    />
  </Frame>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M6_Synthese: Page = () => (
  <SynthPage
    mod={6}
    title="Module 6 · Ce qu’il faut retenir"
    poste={
      <>
        Remplacez le classeur par une vraie source de votre travail (<b>formulaire, boîte partagée</b>), toujours avec des données fictives tant que vous testez.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Power Automate ou Make : <b>déclencheur, actions, données</b> qui circulent.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Le <b>mapping</b> relie la sortie d’un module à l’entrée du suivant.
    </SynthRow>
    <SynthRow n={3} tone="green" d={340}>
      <b>Run once</b> + une donnée de test + la bulle de données : la boucle de test.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      La planification s’active <b>en dernier</b>, quand tout fonctionne.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_DemoPA, M6_Make, M6_PasAPas, M6_Atelier, M6_Pieges, M6_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 6 (1 h)

DIRE — « On passe à la pratique. D'abord je vous montre un flux simple dans Power Automate, l'outil de Microsoft. Puis vous construisez le même genre de flux dans Make. »

TRANSITION — « La démonstration. »`,
  `⏱ 10 min · DÉMO EN PARTAGE D'ÉCRAN

OBJECTIF — Montrer un flux Power Automate simple (programme : démonstration d'un flux Power Automate).

PRÉPARATION — Un compte Microsoft 365 avec Power Automate, un site SharePoint (ou OneDrive) avec un dossier « Plans reçus », un canal Teams de test. Envoyez-vous un courriel avec un PDF fictif juste avant.

DÉROULÉ — Sur make.powerautomate.com : Créer › Flux de cloud automatisé. Révélez les blocs (→ beats 1 et 2) au fil de la construction :
1. Déclencheur Outlook « Lors de l'arrivée d'un nouvel e-mail (V3) », avec pièces jointes.
2. « Créer un fichier » dans SharePoint : montrez le contenu dynamique (les pastilles) et la boucle « Appliquer à chacun » qui apparaît seule pour les pièces jointes.
3. « Publier un message » dans Teams.
Testez, puis ouvrez l'historique d'exécution.
→ beat 3 — La structure à retenir.

PLAN B — Sans licence Microsoft 365 : montrez le flux de bureau Power Automate Desktop du module 4, ou déroulez la page bloc par bloc.

TRANSITION — « Le même principe, dans Make. »`,
  `⏱ 4 min

OBJECTIF — Présenter le scénario de l'atelier et la notion de mapping.

DIRE — « Deux modules : Google Sheets surveille les nouvelles lignes, Gmail vous envoie un courriel. »
→ beat 1 — Le courriel reçu : les pastilles sont remplacées par les vraies valeurs.
→ beat 2 — « Le mapping : relier ce qui sort d'un module à ce qui entre dans le suivant. C'est 80 % du travail dans un workflow. »

TRANSITION — « Le pas à pas. »`,
  `⏱ 5 min · DÉMONSTRATION GUIDÉE

OBJECTIF — Montrer chaque clic avant que les participants se lancent.

DÉROULÉ — Faites les 8 étapes en direct, en partage d'écran, lentement. Collez ensuite le pas à pas dans le Chat.

POINTS D'ATTENTION —
• Étape 2 : la fenêtre de connexion Google peut s'ouvrir derrière le navigateur.
• Étape 4 : « From now on » explique le piège n° 1.
• Étape 6 : il faut cliquer dans le champ pour voir les pastilles du module 1.
• Plan B Gmail : expliquez-le dès maintenant pour éviter les blocages.

TRANSITION — « À vous. »`,
  `⏱ 25 min · ATELIER 1 INDIVIDUEL

OBJECTIF — Chacun a un scénario qui tourne.

ANIMATION — Lancez le minuteur.

POINTS D'ÉTAPE —
• à 8 min : « Où en êtes-vous : module 1, module 2, test ? » Réponses au micro, par prénom.
• à 18 min : « Qui a reçu son courriel ? » Quelqu'un bloque : il partage son écran 2 minutes ; les autres continuent.

CORRIGÉ — Le scénario de démonstration, exporté (menu … › Export Blueprint), peut être partagé par lien ; chacun peut l'importer (… › Import Blueprint) s'il est très en retard.

FIN — Deux volontaires montrent la bulle de données de leur module 2 (1 minute chacun). Pause de 15 minutes juste après.

TRANSITION — « Avant la pause : les pièges que vous avez peut-être rencontrés. »`,
  `⏱ 3 min

OBJECTIF — Capitaliser sur les erreurs de l'atelier.

DIRE — Parcourez le tableau. Pour chaque ligne : « Qui l'a rencontré ? » Une ou deux réponses au micro.

INSISTER — Le dernier piège : « L'offre gratuite donne 1 000 crédits par mois. Un scénario planifié toutes les 15 minutes vérifie le classeur près de 3 000 fois par mois : chaque vérification peut coûter un crédit, même sans nouvelle ligne. »

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

LOGISTIQUE — Pause de 15 minutes (10 h 15). « Au retour : on arrête de cliquer et on conçoit, sur papier, le workflow de votre tâche. »`,
];
// @@NOTES-END
