// ═══ Module 9 · Atelier · Un scénario complet ═══════════════════════════════

const M9_Section: Page = () => (
  <Section n={9} title="Atelier · Un scénario complet" sub="Trois scénarios au choix selon votre niveau, ou votre propre tâche." dur="1 h 15" kind="atelier">
    <SecItem n={1}>Suivi des demandes clients</SecItem>
    <SecItem n={2}>Rapport hebdomadaire automatique</SecItem>
    <SecItem n={3}>Réponses automatiques intelligentes</SecItem>
  </Section>
);
M9_Section.transition = BLOOM;

// ─── Choose your scenario ───────────────────────────────────────────────────
const M9Choice = ({ l, tone, icon, t, lvl, s, d }: { l: string; tone: Tone; icon: IconName; t: string; lvl: string; s: string; d: number }) => (
  <div className={A.in} style={{ height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '28px 28px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Num n={l} tone={tone} size={60} />
      <IconTile name={icon} tone={tone} size={60} />
    </div>
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.08, color: C.ink }}>{t}</div>
    <Tag tone={tone} size={19} style={{ marginTop: 12, alignSelf: 'flex-start' }}>
      {lvl}
    </Tag>
    <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{s}</div>
  </div>
);

const M9_Choix: Page = () => (
  <Frame mod={9}>
    <Title>Choisissez votre scénario</Title>
    <Lede>Exemples proposés selon le niveau. Votre propre tâche est prête et réaliste ? Elle est la bienvenue.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
      <M9Choice d={100} l="A" tone="blue" icon="inbox" t="Suivi des demandes clients" lvl="Niveau intermédiaire" s="Extraction, classification IA, enregistrement, notification. Prolonge l’atelier 2." />
      <M9Choice d={220} l="B" tone="teal" icon="chart" t="Rapport hebdomadaire" lvl="Niveau débutant" s="Chaque lundi, les demandes de la semaine résumées par l’IA, envoyées par courriel." />
      <M9Choice d={340} l="C" tone="violet" icon="send" t="Réponses intelligentes" lvl="Niveau avancé" s="L’IA rédige un brouillon de réponse à partir d’une FAQ ; un humain valide avant l’envoi." />
      <M9Choice d={460} l="D" tone="yellow" icon="target" t="Votre propre tâche" lvl="Si votre fiche est prête" s="Votre fiche de conception, construite avec des données fictives. Le plus utile… et le plus exigeant." />
    </div>
  </Frame>
);

// ─── Scenario A ─────────────────────────────────────────────────────────────
const M9_ScA: Page = () => (
  <Frame mod={9} kind="atelier" beats={4}>
    <Title>
      <span style={{ color: C.blue }}>Scénario A</span> · Suivi des demandes clients
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Boutique en ligne de cosmétiques québécoise · demandes via un formulaire</CasTag>
    </div>
    <FlowRow
      steps
      x={120}
      y={270}
      w={360}
      gap={80}
      nodes={[
        { kind: 'trigger', label: 'Extraction', sub: 'Google Forms → nouvelle ligne : nom, courriel, commande, message' },
        { kind: 'ai', label: 'Classification IA', sub: 'Gemini : catégorie, priorité, résumé, confiance (JSON)' },
        { kind: 'data', label: 'Enregistrement', sub: 'Update a Row + n° de dossier : DEM-{{date}}-{{ligne}}' },
        { kind: 'action', label: 'Notification', sub: 'Routeur : urgent → courriel au responsable ; doute → « à vérifier »' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card tone="blue" icon="list" title="Modules Make" size={22} cls={b.on(4)}>
        Google Forms (ou Sheets) › Watch Responses · Google Gemini AI › Generate a response · JSON › Parse JSON · Google Sheets › Update a Row · Router · Gmail › Send an email
      </Card>
      <Bonus cls={b.on(4)} style={{ fontSize: 22 }}>
        Envoyez au client un accusé de réception avec son numéro de dossier et le délai annoncé selon la priorité.
      </Bonus>
    </div>
  </Frame>
);

// ─── Scenario B ─────────────────────────────────────────────────────────────
const M9_ScB: Page = () => (
  <Frame mod={9} kind="atelier" beats={4}>
    <Title>
      <span style={{ color: T.teal.fg }}>Scénario B</span> · Rapport hebdomadaire automatique
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Firme de services informatiques · le directeur veut son point du lundi</CasTag>
    </div>
    <FlowRow
      steps
      x={120}
      y={270}
      w={360}
      gap={80}
      nodes={[
        { kind: 'trigger', label: 'Chaque lundi 7 h', sub: 'Planification du scénario (pour tester : Run once)' },
        { kind: 'data', label: 'Les demandes de la semaine', sub: 'Search Rows : date ≥ il y a 7 jours' },
        { kind: 'ai', label: 'Synthèse IA', sub: 'Text aggregator → Gemini : chiffres, tendances, 3 points d’attention' },
        { kind: 'action', label: 'Envoi du rapport', sub: 'Gmail : objet daté, synthèse en corps de message' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card tone="teal" icon="list" title="Modules Make" size={22} cls={b.on(4)}>
        Google Sheets › Search Rows · Tools › Text aggregator · Google Gemini AI › Generate a response · Gmail › Send an email
      </Card>
      <Callout cls={b.on(4)} title="Le piège" tone="yellow" icon="alert" size={22}>
        Les chiffres : faites-les <b>calculer</b> par Make (nombre de lignes, compteurs), pas par l’IA. L’IA commente, elle ne compte pas.
      </Callout>
    </div>
  </Frame>
);

// ─── Scenario C ─────────────────────────────────────────────────────────────
const M9_ScC: Page = () => (
  <Frame mod={9} kind="atelier" beats={4}>
    <Title>
      <span style={{ color: C.violet }}>Scénario C</span> · Réponses automatiques intelligentes
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Centre de formation · questions répétitives sur les inscriptions</CasTag>
    </div>
    <FlowRow
      steps
      x={120}
      y={270}
      w={360}
      gap={80}
      nodes={[
        { kind: 'trigger', label: 'Question reçue', sub: 'Nouvelle ligne (ou courriel avec étiquette « Questions »)' },
        { kind: 'ai', label: 'Brouillon de réponse', sub: 'Gemini + votre FAQ collée dans le prompt : répond seulement à partir de la FAQ' },
        { kind: 'human', label: 'Validation humaine', sub: 'Gmail › Create a draft : rien ne part sans relecture' },
        { kind: 'out', label: 'Journal', sub: 'Question, brouillon, « hors FAQ » oui ou non' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card tone="violet" icon="list" title="La règle du prompt" size={22} cls={b.on(4)}>
        « Réponds uniquement à partir de la FAQ ci-dessous. Si la réponse n’y est pas, écris HORS_FAQ et rien d’autre. Ne promets ni prix, ni date, ni remboursement. »
      </Card>
      <Callout cls={b.on(4)} title="Pourquoi un brouillon" tone="coral" icon="humanCheck" size={22}>
        L’IA parle au nom de l’organisation. Le brouillon garde l’humain responsable de ce qui part.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M9_Atelier: Page = () => (
  <AtelierPage
    mod={9}
    n="Atelier 3"
    title="Votre scénario complet"
    timerId="m9-atelier"
    minutes={50}
    tools="Make · Gemini · Google Sheets, Forms, Gmail · données fictives fournies dans le Chat"
    objective="Construire de bout en bout le scénario choisi (A, B, C ou votre tâche) et le tester sur au moins trois cas différents."
    deliver={
      <>
        Un scénario sauvegardé, testé sur 3 cas (normal, limite, ambigu), et dans le carnet : <b>ce qui marche, ce qui reste à faire</b>.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Les 4 étapes du scénario fonctionnent</CheckItem>
        <CheckItem id="b" size={22}>L’IA est encadrée (choix fermés, JSON, seuil)</CheckItem>
        <CheckItem id="c" size={22}>Un humain intervient là où l’erreur coûte</CheckItem>
        <CheckItem id="d" size={22}>3 cas testés, résultats notés</CheckItem>
      </>
    }
  >
    <Do n={1}>Annoncez votre choix (A, B, C ou D) au micro quand je vous appelle.</Do>
    <Do n={2}>Partez de votre scénario de l’atelier 2 (A, C) ou d’un nouveau scénario (B, D).</Do>
    <Do n={3}>Construisez étape par étape, et testez après chaque module ajouté (Run once).</Do>
    <Do n={4}>Testez les 3 cas fictifs ; notez les résultats et les surprises dans votre carnet.</Do>
    <Bonus>Ajoutez un gestionnaire d’erreur sur le module Gemini (clic droit › Add error handler › Resume ou Ignore) : voyez le module 10.</Bonus>
  </AtelierPage>
);

// ─── Milestones (live poll) ─────────────────────────────────────────────────
const M9_Jalons: Page = () => (
  <Frame mod={9} kind="atelier" label="Module 09 · Point d’étape">
    <Title>Où en êtes-vous ?</Title>
    <Lede w={800}>Annoncez le numéro de la dernière étape franchie. Je compte.</Lede>
    <Poll cls={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 920 }}>
      <PollRow id="1" icon="bolt" tone="blue" label="1 · Mon déclencheur voit les données" />
      <PollRow id="2" icon="sparkles" tone="violet" label="2 · Mon étape IA renvoie un JSON" />
      <PollRow id="3" icon="table" tone="teal" label="3 · Le résultat est enregistré" />
      <PollRow id="4" icon="bell" tone="green" label="4 · La notification ou le brouillon part" />
      <PollRow id="5" icon="checkCircle" tone="yellow" label="5 · J’ai testé mes 3 cas" />
    </Poll>
    <div className={A.right} style={{ position: 'absolute', left: 1120, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 20, ...dl(200) }}>
      <Card tone="coral" icon="hand" title="Bloqué depuis 5 minutes ?" size={24}>
        Dites-le au micro : vous partagez votre écran 2 minutes, on regarde ensemble. Souvent, la réponse aide tout le monde.
      </Card>
      <Card tone="green" icon="rocket" title="Déjà fini ?" size={24}>
        Bonus de votre scénario, ou commencez le plan de test du module 10 sur votre carnet.
      </Card>
    </div>
  </Frame>
);

// ─── Restitution by volunteers ──────────────────────────────────────────────
const M9_Restitution: Page = () => (
  <Frame mod={9} kind="atelier" label="Module 09 · Restitution">
    <Title>Deux ou trois volontaires montrent leur scénario</Title>
    <Lede>Trois minutes chacun, en partage d’écran. Les autres peuvent déposer une capture de leur scénario dans le Chat.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px' }}>
      <Eyebrow>La grille, pour chaque présentation</Eyebrow>
      <Checklist style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="a">Ça tourne de bout en bout sur un cas réel (fictif)</CheckItem>
        <CheckItem id="b">L’étape IA est encadrée : choix fermés, JSON, seuil</CheckItem>
        <CheckItem id="c">Un humain garde la main là où il faut</CheckItem>
        <CheckItem id="d">Aucune donnée réelle ou sensible</CheckItem>
        <CheckItem id="e">Le gain est estimé, en heures par an</CheckItem>
      </Checklist>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 290, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="m9-resto" minutes={3} label="Présentation" cls={A.right} />
      <Callout cls={A.right} title="Rétroaction" tone="blue" icon="chat" size={23} style={dl(200)}>
        Un point fort et une piste, au micro. Puis « participant suivant ».
      </Callout>
    </div>
  </Frame>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M9_Synthese: Page = () => (
  <SynthPage
    mod={9}
    title="Module 9 · Ce qu’il faut retenir"
    poste={
      <>
        Exportez votre scénario (… › <b>Export Blueprint</b>) et rangez le fichier avec votre carnet : c’est votre point de départ au bureau.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Extraction → <b>classification IA</b> → enregistrement → notification : le schéma universel.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Les <b>chiffres</b> se calculent par des modules ; l’IA commente.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      Une réponse IA part d’abord en <b>brouillon</b>, à partir d’une source validée.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      On construit <b>module par module</b>, en testant à chaque ajout.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M9_Section, M9_Choix, M9_ScA, M9_ScB, M9_ScC, M9_Atelier, M9_Jalons, M9_Restitution, M9_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 9 (1 h 15)

DIRE — « L'atelier principal de la formation : un scénario complet, de bout en bout. Trois exemples proposés selon votre niveau, comme le prévoit le programme, ou votre propre tâche si votre fiche est prête. »

TRANSITION — « Les choix. »`,
  `⏱ 3 min

OBJECTIF — Aider chacun à choisir un scénario réaliste pour 50 minutes.

DIRE — Présentez les quatre cartes. Orientez :
• A : ceux dont l'atelier 2 fonctionne bien.
• B : ceux qui ont eu du mal ce matin : moins de modules, gain très visible.
• C : les plus à l'aise ; enjeu de validation humaine.
• D : seulement si la fiche de conception est claire et l'outil accessible avec des données fictives.

TRANSITION — « Les trois scénarios en détail. »`,
  `⏱ 3 min · SCÉNARIO A

DIRE — Révélez les étapes (→ beats 1 à 3) : extraction, classification IA, enregistrement, notification. « C'est exactement l'exemple du programme. » → beat 4 : modules Make et bonus.

POINT TECHNIQUE — Le numéro de dossier se construit avec formatDate et le numéro de ligne. Google Forms écrit dans un classeur : on peut surveiller le classeur ou le formulaire.

TRANSITION — « Scénario B. »`,
  `⏱ 2 min · SCÉNARIO B

DIRE — Révélez les étapes. « Un horaire au lieu d'un événement. Search Rows trouve les lignes de la semaine ; le Text aggregator les assemble en un seul texte ; Gemini rédige la synthèse. »

INSISTER — Le piège : les modèles de langage comptent mal. Le nombre de demandes se calcule dans Make (agrégateur numérique ou nombre de lignes renvoyées), puis on le donne à l'IA.

TRANSITION — « Scénario C. »`,
  `⏱ 2 min · SCÉNARIO C

DIRE — Révélez les étapes. « L'IA répond seulement à partir de votre FAQ, collée dans le prompt. Si la réponse n'y est pas : HORS_FAQ. Et rien ne part sans relecture : Gmail crée un brouillon. »

LOGISTIQUE — Collez dans le Chat une FAQ fictive de 8 questions (dates, prix, annulation, attestation, prérequis, accès à distance, matériel, contact) et 5 questions de test, dont 2 hors FAQ.

TRANSITION — « À vous. »`,
  `⏱ 50 min · ATELIER 3 INDIVIDUEL

OBJECTIF — Chacun a un scénario complet testé sur trois cas.

ANIMATION — Appelez chaque participant par son prénom : « A, B, C ou D ? » Notez les choix. Lancez le minuteur.

POINTS D'ÉTAPE — à 15, 30 et 45 minutes, passez à la page suivante (le sondage « Où en êtes-vous ? »), faites annoncer les numéros, puis revenez ici. Le minuteur continue de tourner.

AIDE — Quelqu'un est bloqué depuis 5 minutes : il partage son écran 2 minutes. Les erreurs les plus fréquentes : mapping vide, JSON entouré de balises, Row number oublié, filtre mal réglé.

DONNÉES — Collez dans le Chat les jeux de données fictifs des trois scénarios (une dizaine de lignes chacun).

TRANSITION — « Restitution. »`,
  `⏱ (pendant l'atelier) · POINT D'ÉTAPE

ANIMATION — Chacun annonce le numéro de la dernière étape franchie ; cliquez la ligne correspondante (« − » corrige). Ne réinitialisez pas entre deux points d'étape : cliquez seulement les changements, ou rechargez la page pour repartir de zéro.

LECTURE — Beaucoup bloqués à 2 : refaites une démonstration de 3 minutes de Parse JSON et des balises \`\`\`json. Beaucoup à 5 : avancez la restitution.`,
  `⏱ 10 min · RESTITUTION PAR VOLONTAIRES

ANIMATION — Demandez deux ou trois volontaires, idéalement des scénarios différents. Trois minutes chacun, en partage d'écran, minuteur. Cochez la grille à l'écran pendant qu'ils présentent (à titre indicatif, sans note).

RÉTROACTION — Après chaque présentation : un point fort et une piste, au micro, d'un ou deux participants. Synthétisez, puis « participant suivant ». Les autres peuvent déposer une capture dans le Chat.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

LOGISTIQUE — Pause de 15 minutes (14 h 45). « Au retour : comment s'assurer que ça marche aussi lundi, et mesurer le gain. »`,
];
// @@NOTES-END
