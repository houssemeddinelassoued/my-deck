// ═══ Module 7 · Méthodologie de conception ══════════════════════════════════

const M7_Section: Page = () => (
  <Section n={7} title="Méthodologie de conception" sub="Dix minutes de conception évitent deux heures de clics." dur="40 min" kind="exercice">
    <SecItem n={1}>Définir un besoin métier clair</SecItem>
    <SecItem n={2}>Formaliser les étapes et réaliser un diagramme simple</SecItem>
    <SecItem n={3}>Déterminer les données d’entrée et de sortie</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── A clear business need ──────────────────────────────────────────────────
const M7Part = ({ tone, k: key, v }: { tone: Tone; k: string; v: ReactNode }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', margin: '0 6px 12px 0', verticalAlign: 'top' }}>
    <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg }}>{key}</span>
    <span style={{ padding: '4px 12px', borderRadius: 8, background: T[tone].bg, boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}`, fontSize: 27, color: C.ink }}>{v}</span>
  </span>
);

const M7_Besoin: Page = () => (
  <Frame mod={7} beats={2}>
    <Title>Définir un besoin métier clair</Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Service des ressources humaines · demandes d’attestation d’emploi</CasTag>
    </div>
    <Card tone="coral" icon="x" title="Flou" size={27} cls={A.left} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      « Il faudrait automatiser les attestations, ça prend trop de temps. »
    </Card>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 450, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '30px 34px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <IconTile name="check" tone="green" size={56} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Clair</span>
      </div>
      <M7Part tone="blue" k="Pour qui" v="Les conseillères RH" />
      <M7Part tone="teal" k="Quand" v="un employé demande une attestation par le formulaire" />
      <M7Part tone="green" k="Je veux" v="que l’attestation soit générée et envoyée pour signature" />
      <M7Part tone="violet" k="Afin de" v="passer de 3 jours à 4 heures de délai" />
      <M7Part tone="yellow" k="Sauf" v="les cas particuliers (congé, fin d’emploi) : traités à la main" />
    </div>
    <Callout cls={b.on(2)} title="Le test du besoin clair" style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      Une personne qui ne connaît pas la tâche comprend <b>quoi</b>, <b>quand</b>, <b>pourquoi</b>, et <b>comment on saura que ça marche</b>.
    </Callout>
  </Frame>
);

// ─── Formalise the steps ────────────────────────────────────────────────────
const M7_Etapes: Page = () => (
  <Frame mod={7}>
    <Title>Formaliser les étapes : un verbe, un outil, une règle</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 210, width: 1680 }}
      cols="70px 1.3fr 1fr 1.3fr 1.2fr"
      size={22}
      head={['#', 'Étape', 'Outil', 'Règle', 'Exception']}
      rows={[
        ['1', 'Recevoir la demande', 'Formulaire', 'Champs obligatoires remplis', 'Champ manquant → redemander'],
        ['2', 'Retrouver l’employé', 'Fichier du personnel', 'Recherche par numéro d’employé', 'Introuvable → conseillère'],
        ['3', 'Vérifier le statut', 'Fichier du personnel', 'Statut « actif »', 'Congé, fin d’emploi → conseillère'],
        ['4', 'Générer l’attestation', 'Modèle de document', 'Nom, poste, date d’embauche, salaire si demandé', '—'],
        ['5', 'Faire signer', 'Signature électronique', 'Envoyée à la directrice RH', 'Pas signée en 24 h → rappel'],
        ['6', 'Envoyer à l’employé', 'Courriel', 'Pièce jointe PDF', '—'],
        ['7', 'Consigner', 'Registre', 'Date, demandeur, délai', '—'],
      ]}
    />
    <Hint style={{ position: 'absolute', left: 120, top: 890 }}>Chaque exception non écrite devient une panne en production.</Hint>
  </Frame>
);

// ─── A simple diagram with the colour code ──────────────────────────────────
const M7_Diagramme: Page = () => (
  <Frame mod={7} beats={2}>
    <Title>Réaliser un diagramme simple</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 186, display: 'flex', gap: 10 }}>
      {(['trigger', 'data', 'cond', 'ai', 'action', 'human', 'out'] as NodeKind[]).map((n) => (
        <NodeChip key={n} kind={n} />
      ))}
    </div>
    <FlowRow
      x={120}
      y={280}
      w={300}
      gap={45}
      nodes={[
        { kind: 'trigger', label: 'Demande reçue', sub: 'Formulaire RH' },
        { kind: 'data', label: 'Fiche employé', sub: 'Recherche par numéro' },
        { kind: 'cond', label: 'Statut actif ?', sub: 'Oui → suite' },
        { kind: 'action', label: 'Attestation générée', sub: 'Modèle + champs' },
        { kind: 'out', label: 'Envoyée et consignée', sub: 'Après signature' },
      ]}
    />
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M 960 440 V 560" stroke={C.coral} strokeWidth={4} strokeDasharray="10 10" className={b.fade(1)} />
      <polygon points="960,580 950,560 970,560" fill={C.coral} className={b.fade(1)} />
    </svg>
    <FlowNode kind="human" label="Conseillère RH" sub="Statut non actif ou cas particulier : traitement manuel" w={420} cls={b.on(1)} style={{ position: 'absolute', left: 750, top: 590 }} />
    <Callout cls={b.on(2)} title="Où mettre l’IA ?" tone="violet" icon="sparkles" size={24} style={{ position: 'absolute', left: 1230, top: 590, width: 570 }}>
      Nulle part ici : les données sont structurées. Si les demandes arrivaient par courriel libre, une étape IA lirait le type d’attestation voulu.
    </Callout>
  </Frame>
);

// ─── Inputs and outputs ─────────────────────────────────────────────────────
const M7_IO: Page = () => (
  <Frame mod={7}>
    <Title>Déterminer les données d’entrée et de sortie</Title>
    <Lede>Le dictionnaire de données : chaque information, d’où elle vient, à quoi elle ressemble.</Lede>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}
      cols="110px 1fr 1fr 1fr 150px 1fr"
      size={22}
      head={['Sens', 'Donnée', 'Source', 'Format', 'Obligatoire', 'Exemple fictif']}
      rows={[
        [<Tag key="e1" tone="blue" size={18}>Entrée</Tag>, 'Numéro d’employé', 'Formulaire', '6 chiffres', 'Oui', '104 233'],
        [<Tag key="e2" tone="blue" size={18}>Entrée</Tag>, 'Type d’attestation', 'Formulaire', 'Liste : simple, avec salaire', 'Oui', 'avec salaire'],
        [<Tag key="e3" tone="blue" size={18}>Entrée</Tag>, 'Date d’embauche', 'Fichier du personnel', 'AAAA-MM-JJ', 'Oui', '2019-04-15'],
        [<Tag key="s1" tone="green" size={18}>Sortie</Tag>, 'Attestation signée', 'Signature électronique', 'PDF', 'Oui', 'Attestation_104233.pdf'],
        [<Tag key="s2" tone="green" size={18}>Sortie</Tag>, 'Ligne du registre', 'Registre', 'Date, demandeur, délai', 'Oui', '2026-11-20 · 104 233 · 3 h'],
      ]}
    />
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 24, ...dl(500) }}>
      <Callout title="Le format" tone="yellow" icon="alert" size={23} style={{ flex: 1 }}>
        12/04/2026 : avril ou décembre ? Fixez un format (AAAA-MM-JJ) dès la conception.
      </Callout>
      <Callout title="Le sensible" tone="coral" icon="lock" size={23} style={{ flex: 1 }}>
        Le salaire est un renseignement personnel : qui y accède, où transite-t-il ?
      </Callout>
    </div>
  </Frame>
);

// ─── The design sheet ───────────────────────────────────────────────────────
const M7_FICHE: [IconName, Tone, string, string][] = [
  ['target', 'blue', 'Besoin', 'Pour qui, quand, je veux, afin de, sauf'],
  ['bolt', 'blue', 'Déclencheur', 'Événement, horaire ou condition'],
  ['list', 'teal', 'Étapes', 'Verbe, outil, règle, exception'],
  ['route', 'teal', 'Diagramme', 'Avec le code couleur des étapes'],
  ['database', 'green', 'Données', 'Entrées, sorties, formats, sensibles'],
  ['sparkles', 'violet', 'Étape IA', 'Opération, prompt, seuil de confiance'],
  ['humanCheck', 'coral', 'Validation', 'Qui valide quoi, et quand'],
  ['gauge', 'yellow', 'Indicateurs', 'Gain attendu, taux d’erreur, responsable'],
];

const M7_Fiche: Page = () => (
  <Frame mod={7}>
    <Title>La fiche de conception, en huit rubriques</Title>
    <Lede>Elle tient sur une page. Elle sert à construire, à faire valider, puis à documenter.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      {M7_FICHE.map(([ic, tone, t, s], i) => (
        <div key={t} className={A.in} style={{ height: 270, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 24px', ...dl(80 + i * 80) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Num n={i + 1} tone={tone} size={44} />
            <Icon name={ic} size={34} color={T[tone].fg} />
          </div>
          <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{t}</div>
          <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{s}</div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Exercise 4 ─────────────────────────────────────────────────────────────
const M7_Atelier: Page = () => (
  <AtelierPage
    mod={7}
    kind="exercice"
    n="Exercice 4"
    title="La fiche de conception de votre tâche"
    timerId="m7-fiche"
    minutes={20}
    tools="Votre carnet de bord · rubrique 4 (modèle dans le Chat) · un assistant IA pour relire"
    objective="Transformer le SIPOC d’hier en une fiche de conception prête à construire."
    deliver={
      <>
        Rubrique 4 du carnet : les <b>8 rubriques</b> remplies pour votre tâche, avec un diagramme simple (papier, draw.io ou liste fléchée).
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Un besoin qui passe le test du besoin clair</CheckItem>
        <CheckItem id="b" size={22}>Chaque étape : verbe, outil, règle, exception</CheckItem>
        <CheckItem id="c" size={22}>Les données d’entrée et de sortie, avec formats</CheckItem>
        <CheckItem id="d" size={22}>La validation humaine placée</CheckItem>
      </>
    }
  >
    <Do n={1}>Écrivez le besoin : pour qui, quand, je veux, afin de, sauf.</Do>
    <Do n={2}>Reprenez les étapes de votre SIPOC et ajoutez outil, règle et exception à chacune.</Do>
    <Do n={3}>Dessinez le diagramme avec le code couleur ; placez l’étape IA et la validation humaine.</Do>
    <Do n={4}>Listez les données d’entrée et de sortie ; repérez ce qui est sensible.</Do>
    <Bonus>Demandez à votre assistant IA : « Joue le rôle d’un testeur. Quels cas particuliers ma fiche oublie-t-elle ? »</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <QcmPage
    mod={7}
    n={6}
    title="Un besoin bien défini"
    q="Laquelle de ces formulations est un besoin métier clair, prêt à concevoir ?"
    explain="Un besoin clair dit pour qui, quand, quoi, pourquoi et comment on mesure, et nomme les exceptions. Les autres décrivent un outil, une envie ou un objectif sans critère."
  >
    <Opt why="Piège ! C’est une solution (un outil), pas un besoin : on ne sait ni quoi automatiser ni pourquoi.">
      « Il nous faut un workflow Make avec de l’IA »
    </Opt>
    <Opt why="Piège ! Aucun déclencheur, aucun critère : comment saura-t-on que c’est réussi ?">
      « Il faut que les demandes clients aillent plus vite »
    </Opt>
    <Opt ok why="Exact : pour qui, quand, quoi, afin de (mesurable) et sauf (exceptions). On peut concevoir et tester.">
      « Pour le service client, quand une demande arrive par le formulaire, je veux qu’elle soit classée et assignée, afin de répondre en moins de 4 h, sauf les plaintes juridiques »
    </Opt>
    <Opt why="Piège ! Tout automatiser n’est pas un besoin : c’est un risque. Et rien n’est mesurable.">
      « Automatiser tout ce qui peut l’être dans le service »
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M7_Synthese: Page = () => (
  <SynthPage
    mod={7}
    title="Module 7 · Ce qu’il faut retenir"
    poste={
      <>
        Faites relire votre fiche par la personne qui fait la tâche <b>et</b> par celle qui en reçoit le résultat. Leurs remarques valent dix tests.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Un besoin clair : <b>pour qui, quand, je veux, afin de, sauf</b>.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Chaque étape : <b>un verbe, un outil, une règle, une exception</b>.
    </SynthRow>
    <SynthRow n={3} tone="green" d={340}>
      Le dictionnaire de données fixe <b>formats</b> et <b>données sensibles</b>.
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={460}>
      La fiche en 8 rubriques : on construit, on valide, on documente.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_Besoin, M7_Etapes, M7_Diagramme, M7_IO, M7_Fiche, M7_Atelier, M7_Qcm, M7_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 7 (40 min)

DIRE — « On lâche la souris. Avant de construire le workflow de votre tâche, on le conçoit. Quatre étapes du programme : le besoin, les étapes, le diagramme, les données. »

TRANSITION — « D'abord, le besoin. »`,
  `⏱ 4 min · CAS : RH

OBJECTIF — Apprendre à formuler un besoin métier clair.

DIRE — Lisez la version floue. « Que faut-il automatiser exactement ? Pour qui ? Comment saura-t-on que c'est réussi ? »
→ beat 1 — La version claire, morceau par morceau : pour qui, quand, je veux, afin de, sauf.
→ beat 2 — Le test du besoin clair.

INSISTER — « Afin de » doit être mesurable (3 jours → 4 heures) : c'est ce qu'on vérifiera au module 10. « Sauf » : les exceptions dites dès le départ.

TRANSITION — « Ensuite, les étapes. »`,
  `⏱ 4 min

OBJECTIF — Formaliser des étapes exploitables.

DIRE — « Sept étapes, et pour chacune quatre colonnes. » Parcourez 2 ou 3 lignes. « La colonne la plus importante, c'est la dernière : l'exception. Le processus heureux, tout le monde le connaît. Ce sont les exceptions qui font tomber les automatisations. »

QUESTION — « Quelle exception manque ? » Pistes : demande en double, employé qui demande pour un autre, attestation en anglais.

TRANSITION — « On le dessine. »`,
  `⏱ 4 min

OBJECTIF — Réaliser un diagramme simple avec le code couleur du deck.

DIRE — Présentez le code couleur (déclencheur bleu, données sarcelle, condition jaune, IA violet, action vert, validation corail, résultat gris). « Ce code, vous le retrouverez dans tous les schémas d'aujourd'hui. »
→ beat 1 — La branche « non » : la conseillère RH.
→ beat 2 — « Où mettre l'IA ? Nulle part ici. » Bon rappel : on ne met pas de l'IA par principe.

OUTILS — Papier, draw.io (gratuit), PowerPoint, ou une IA qui produit un diagramme à partir de la liste d'étapes.

TRANSITION — « Les données. »`,
  `⏱ 4 min

OBJECTIF — Déterminer les données d'entrée et de sortie (programme).

DIRE — Lisez le tableau. « Pour chaque donnée : d'où elle vient, son format, si elle est obligatoire, un exemple. »

INSISTER —
• Formats : la date est la source d'erreur n° 1 entre logiciels.
• Sensible : « Le salaire est un renseignement personnel au sens de la Loi 25. Il ne passe pas par une IA gratuite, et l'accès doit être limité. »

TRANSITION — « Tout ça tient dans une fiche. »`,
  `⏱ 2 min

OBJECTIF — Présenter le modèle de fiche de conception.

DIRE — Parcourez les huit rubriques. « Six viennent de ce qu'on a vu ; deux sont nouvelles : la validation humaine, et les indicateurs avec un responsable. »

LOGISTIQUE — Collez le modèle de fiche dans le Chat.

TRANSITION — « À vous, pour votre tâche. »`,
  `⏱ 20 min · EXERCICE 4 INDIVIDUEL

OBJECTIF — Chacun produit la fiche de conception de sa tâche réelle.

ANIMATION — Lancez le minuteur.

POINTS D'ÉTAPE —
• à 7 min : « Votre besoin passe-t-il le test ? » Un volontaire lit le sien ; le groupe vérifie les cinq morceaux.
• à 15 min : « Où est votre validation humaine ? » Deux réponses au micro.

SI UNE TÂCHE EST TROP GROSSE — Proposez d'en automatiser seulement une portion (les 3 premières étapes).

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 6

RÉPONSE — C.
• A ✗ — Une solution, pas un besoin.
• B ✗ — Pas de déclencheur ni de critère.
• D ✗ — Ni mesurable, ni prudent.

TRANSITION — « Synthèse. »`,
  `⏱ 1 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Votre fiche est votre plan de construction pour le module 8 et l'atelier du module 9. »

TRANSITION — « On construit : module 8. »`,
];
// @@NOTES-END
