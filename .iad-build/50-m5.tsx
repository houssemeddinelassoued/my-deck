// ─── Module 5 · IA et organisation du travail ───────────────────────────────
const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        IA et organisation
        <br />
        du travail
      </>
    }
    sub="Planifier une journée, prioriser, préparer une réunion, bâtir une checklist ou un planning : l’IA propose une structure, vous arbitrez."
    dur="14:30 – 15:10 · exercices inclus"
  >
    <SecItem n={1}>Organiser une journée, prioriser les tâches</SecItem>
    <SecItem n={2}>Préparer une réunion et ses agendas</SecItem>
    <SecItem n={3}>Créer une checklist, construire un planning</SecItem>
    <SecItem n={4}>Générer des modèles réutilisables</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Prioriser (matrice urgent / important, glisser-déposer) ────────────────
const M5Quad = ({ x, y, tone, title, verb, sol }: { x: number; y: number; tone: Tone; title: string; verb: string; sol: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 540, height: 340, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase', color: STRONG[tone] }}>{verb}</span>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 20, right: 20, bottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: T[tone].fg }}>
      <Icon name="checkCircle" size={24} color={STRONG[tone]} /> {sol}
    </div>
  </div>
);

const M5Chip = ({ n, y, children }: { n: number; y: number; children: ReactNode }) => (
  <Drag x={120} y={y} w={500} tone="navy" size={20}>
    <Num n={n} tone="navy" size={30} />
    <span>{children}</span>
  </Drag>
);

const M5_Prioriser: Page = () => (
  <Frame mod={5} kind="exercice" beats={1}>
    <Title size={46}>Prioriser : la matrice urgent / important</Title>
    <Eyebrow c={C.coral} size={18} cls={A.fade} style={{ position: 'absolute', left: 720, top: 158 }}>
      ← Urgent
    </Eyebrow>
    <Eyebrow c={C.blue} size={18} cls={A.fade} style={{ position: 'absolute', left: 1280, top: 158 }}>
      Pas urgent →
    </Eyebrow>
    <M5Quad x={700} y={190} tone="coral" title="Urgent et important" verb="Faire" sol="2 · 5" />
    <M5Quad x={1260} y={190} tone="blue" title="Important, pas urgent" verb="Planifier" sol="3 · 7" />
    <M5Quad x={700} y={550} tone="yellow" title="Urgent, pas important" verb="Déléguer" sol="1 · 8" />
    <M5Quad x={1260} y={550} tone="grey" title="Ni l’un ni l’autre" verb="Abandonner" sol="4 · 6" />
    <M5Chip n={1} y={200}>Réserver un taxi pour un visiteur à 11 h</M5Chip>
    <M5Chip n={2} y={272}>Dossier de subvention à déposer ce soir</M5Chip>
    <M5Chip n={3} y={344}>Mettre à jour la procédure d’accueil</M5Chip>
    <M5Chip n={4} y={416}>Trier les newsletters non lues</M5Chip>
    <M5Chip n={5} y={488}>Client important furieux au téléphone</M5Chip>
    <M5Chip n={6} y={560}>Reclasser les vieux dossiers de 2015 par couleur</M5Chip>
    <M5Chip n={7} y={632}>Préparer le séminaire de mars</M5Chip>
    <M5Chip n={8} y={704}>Commander des capsules de café</M5Chip>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 500, ...dl(400) }}>
      <Callout title="Le prompt" tone="violet" icon="chat" size={20}>
        « Classe ces tâches dans la matrice urgent / important. Pour chaque tâche, une phrase de justification. Signale celles où tu manques d’information. »
      </Callout>
    </div>
  </Frame>
);

// ─── Organiser une journée ──────────────────────────────────────────────────
const M5_DAY: [string, string, Tone, number][] = [
  ['8:30', 'Emails urgents et appels (30 min)', 'yellow', 1],
  ['9:00', 'Dossier de subvention : bloc sans interruption', 'coral', 1],
  ['11:00', 'Taxi du visiteur · accueil', 'yellow', 2],
  ['11:30', 'Rappel du client mécontent (préparé avec A·R·S·S)', 'coral', 2],
  ['14:00', 'Préparation du séminaire : devis traiteur', 'blue', 3],
  ['16:00', 'Emails non urgents, classement', 'grey', 3],
  ['16:45', 'Bilan et liste de demain', 'green', 3],
];

const M5_Journee: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Organiser sa journée avec l’IA</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 640 }}>
      <Bubble who="user" w={600} size={21}>
        Voici mes tâches du jour et mes contraintes : réunion de 10 h à 11 h, pause déjeuner 12 h 30 – 13 h 30, je pars à 17 h 30. Propose un planning heure par heure. Les tâches importantes le matin, des blocs de concentration de 1 h 30 maximum, 15 min de marge l’après-midi.
      </Bubble>
      <div className={b.on(4)} style={{ marginTop: 24 }}>
        <Callout title="Vous gardez la main" tone="blue" icon="hand" size={21}>
          L’IA ne connaît ni votre énergie, ni les imprévus de votre directeur : le planning est une proposition à ajuster.
        </Callout>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 820, top: 200, width: 980, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {M5_DAY.map(([h, t, tone, n]) => (
        <div key={h} className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '13px 20px' }}>
          <span style={{ width: 80, fontFamily: mono, fontSize: 22, fontWeight: 700, color: STRONG[tone] }}>{h}</span>
          <span style={{ fontSize: 23, color: C.ink }}>{t}</span>
        </div>
      ))}
      <div className={b.fade(3)} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, marginTop: 6 }}>
        <Icon name="alert" size={24} color={C.amber} /> Les newsletters et le classement de 2015 ? Repoussés : ni urgents ni importants.
      </div>
    </div>
  </Frame>
);

// ─── Préparer une réunion (onglets) ─────────────────────────────────────────
const M5Prep = ({ prompt, children }: { prompt: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 28 }}>
    <Bubble who="user" w={520} size={21}>
      {prompt}
    </Bubble>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 22, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M5Ag = ({ t, d, who }: { t: string; d: string; who: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 170px', gap: 14, padding: '6px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ fontFamily: mono, fontWeight: 700, color: C.green }}>{d}</span>
    <span>{t}</span>
    <span style={{ color: C.muted }}>{who}</span>
  </div>
);

const M5_Reunion: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Préparer une réunion : avant, pendant, après</Title>
    <Lede>Comité de direction mensuel · 1 h 30 · 6 participants · trois moments où l’IA vous aide.</Lede>
    <Tabs initial="avant" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="avant" tone="green" icon="calendar">
          Avant · l’ordre du jour
        </TabBtn>
        <TabBtn id="pendant" tone="blue" icon="note">
          Pendant · la trame de notes
        </TabBtn>
        <TabBtn id="apres" tone="violet" icon="send">
          Après · le suivi
        </TabBtn>
      </div>
      <TabPane id="avant">
        <M5Prep prompt="Prépare l’ordre du jour du comité de direction (1 h 30). Sujets : résultats d’octobre, séminaire de mars, recrutement d’un commercial, divers. Minutage, responsable et objectif (informer / décider) par point.">
          <M5Ag d="10’" t="Validation du CR précédent · informer" who="M. Garnier" />
          <M5Ag d="25’" t="Résultats d’octobre · informer" who="Mme Roux" />
          <M5Ag d="25’" t="Séminaire de mars · décider du budget" who="Nadia" />
          <M5Ag d="20’" t="Recrutement commercial · décider du profil" who="M. Petit" />
          <M5Ag d="10’" t="Divers et prochaine date" who="Tous" />
        </M5Prep>
      </TabPane>
      <TabPane id="pendant">
        <M5Prep prompt="À partir de cet ordre du jour, crée une trame de prise de notes : pour chaque point, des cases « décision », « action / qui / quand », « questions ouvertes ».">
          <div style={{ fontFamily: mono, fontSize: 20, lineHeight: 1.7, color: C.soft }}>
            3. Séminaire de mars (25’)
            <br />
            {'   '}Décision : ______________________
            <br />
            {'   '}Action / qui / quand : __________
            <br />
            {'   '}Questions ouvertes : ____________
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: C.green, fontWeight: 600 }}>→ Des notes déjà rangées = un compte rendu en 5 minutes.</div>
        </M5Prep>
      </TabPane>
      <TabPane id="apres">
        <M5Prep prompt="À partir de mes notes : 1) le compte rendu (module 4) ; 2) un email de diffusion de 60 mots ; 3) un message de rappel pour chaque responsable d’action, 2 jours avant l’échéance.">
          <Bullet size={22} tone="violet">Compte rendu structuré, à relire avec les notes.</Bullet>
          <Bullet size={22} tone="violet">Email de diffusion avec le CR en pièce jointe.</Bullet>
          <Bullet size={22} tone="violet">Rappels personnalisés à programmer dans votre messagerie (envoi différé).</Bullet>
        </M5Prep>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(400) }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>Un ordre du jour qui distingue <strong style={{ color: C.navy }}>informer</strong> et <strong style={{ color: C.navy }}>décider</strong> raccourcit les réunions.</span>
    </div>
  </Frame>
);

// ─── Créer une checklist (interactive) ──────────────────────────────────────
const M5_Checklist: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Créer une checklist : l’arrivée d’un nouveau salarié</Title>
    <Lede>« Crée la checklist d’accueil d’un nouveau commercial, de J − 7 à J + 7, regroupée par moment. Une ligne = une action vérifiable. »</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 300, width: 1150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Eyebrow c={C.blue} size={18}>
            J − 7 · avant l’arrivée
          </Eyebrow>
          <CheckItem id="m5-1" size={23} tone="blue">Commander poste, téléphone et badge</CheckItem>
          <CheckItem id="m5-2" size={23} tone="blue">Créer les comptes informatiques</CheckItem>
          <CheckItem id="m5-3" size={23} tone="blue">Envoyer le mail de bienvenue</CheckItem>
          <Eyebrow c={C.green} size={18} style={{ marginTop: 8 }}>
            Jour J
          </Eyebrow>
          <CheckItem id="m5-4" size={23}>Accueil et visite des locaux</CheckItem>
          <CheckItem id="m5-5" size={23}>Remise du livret d’accueil</CheckItem>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="m5-6" size={23}>Déjeuner avec l’équipe</CheckItem>
          <Eyebrow c={C.violet} size={18} style={{ marginTop: 8 }}>
            J + 1 à J + 7
          </Eyebrow>
          <CheckItem id="m5-7" size={23} tone="violet">Planifier les rendez-vous avec chaque service</CheckItem>
          <CheckItem id="m5-8" size={23} tone="violet">Formation au logiciel CRM</CheckItem>
          <CheckItem id="m5-9" size={23} tone="violet">Point d’étonnement à J + 7 avec le manager</CheckItem>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 300, width: 470, ...dl(300) }}>
        <CheckScore
          max={9}
          label="Avancement de l’accueil"
          levels={[
            { min: 0, text: 'Tout reste à faire.', tone: 'grey' },
            { min: 3, text: 'Les préparatifs avancent.', tone: 'blue' },
            { min: 6, text: 'Presque prêt !', tone: 'yellow' },
            { min: 9, text: 'Accueil réussi.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Demandez ensuite : « Qu’ai-je oublié ? » L’IA suggère souvent les accès, la mutuelle ou la carte de visite.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Construire un planning (rétroplanning) ─────────────────────────────────
const M5_WEEKS = ['S−12', 'S−10', 'S−8', 'S−6', 'S−4', 'S−2', 'J'];
const M5_TASKS: [string, number, number, Tone, number][] = [
  ['Valider budget et date', 0, 1, 'navy', 1],
  ['Réserver lieu et traiteur', 1, 2, 'blue', 1],
  ['Construire le programme', 2, 3, 'green', 2],
  ['Envoyer les invitations', 3, 1, 'violet', 2],
  ['Relancer les non-réponses', 4, 1, 'yellow', 3],
  ['Logistique : badges, supports', 5, 1, 'teal', 3],
];

const M5_Planning: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Construire un planning : le rétroplanning du séminaire</Title>
    <Lede>« Construis le rétroplanning d’un séminaire de 35 personnes le 20 mars : tâches, durée, ordre. Tableau prêt pour Excel. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', alignItems: 'center' }}>
        <span />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${M5_WEEKS.length}, 1fr)`, fontFamily: mono, fontSize: 19, color: C.muted }}>
          {M5_WEEKS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </div>
      {M5_TASKS.map(([t, s, d, tone, n]) => (
        <div key={t} style={{ display: 'grid', gridTemplateColumns: '400px 1fr', alignItems: 'center', height: 62, borderTop: `1.5px solid ${C.rule}` }}>
          <span style={{ fontSize: 23, color: C.ink }}>{t}</span>
          <div style={{ position: 'relative', height: 30 }}>
            <div className={b.grow(n)} style={{ position: 'absolute', left: `${(s / M5_WEEKS.length) * 100}%`, width: `${(d / M5_WEEKS.length) * 100}%`, top: 0, bottom: 0, borderRadius: 8, background: STRONG[tone] }} />
          </div>
        </div>
      ))}
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout title="À vérifier" tone="yellow" icon="calendar" size={22}>
        Les vacances scolaires, les jours fériés et les délais réels de vos prestataires : l’IA propose des durées types, <strong>pas les vôtres</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Modèles réutilisables (cartes) ─────────────────────────────────────────
const M5Tpl = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: string }) => (
  <FlipCard
    w={536}
    h={280}
    tone={tone}
    backTone={tone}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name={icon} tone={tone} size={56} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 29, color: C.navy }}>{title}</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{desc}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={17}>
          Demande pour créer le modèle
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.ink, fontStyle: 'italic' }}>{ex}</div>
      </>
    }
  />
);

const M5_Modeles: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Générer des modèles réutilisables</Title>
    <Lede>Ce que vous refaites chaque mois mérite un modèle. Cliquez une carte pour voir comment le faire créer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, rowGap: 30 }}>
      <M5Tpl icon="calendar" tone="green" title="Ordre du jour" desc="Une trame avec minutage, objectif et responsable par point." ex="« Crée un modèle d’ordre du jour avec des [CHAMPS] pour : date, participants, points, durée, objectif. »" />
      <M5Tpl icon="doc" tone="navy" title="Compte rendu" desc="Les 6 rubriques, prêtes à remplir pendant la réunion." ex="« Crée un modèle Word de compte rendu en 6 rubriques, avec un tableau d’actions qui / quoi / quand. »" />
      <M5Tpl icon="mail" tone="teal" title="Emails types" desc="Confirmation de rendez-vous, accusé de réception, relance." ex="« Rédige 5 emails types d’accusé de réception, avec des [CHAMPS] pour le nom, l’objet et le délai. »" />
      <M5Tpl icon="checkCircle" tone="violet" title="Checklists" desc="Accueil, déplacement, événement, clôture de mois." ex="« Crée la checklist d’organisation d’un déplacement professionnel : transport, hôtel, documents, notes de frais. »" />
      <M5Tpl icon="table" tone="yellow" title="Tableaux de suivi" desc="Courriers, contrats, échéances, fournitures." ex="« Propose les colonnes d’un tableau de suivi des contrats : prestataire, objet, échéance, préavis, responsable. »" />
      <M5Tpl icon="book" tone="blue" title="Procédures" desc="La mémoire du poste, utile en cas d’absence." ex="« Transforme mes explications en procédure numérotée pour mon remplaçant pendant mes congés. »" />
    </div>
  </Frame>
);

// ─── Quiz M5 ────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>Quiz : organisation du travail</Title>
    <QuizSeries y={220}>
      <QuizQ q="« Préparer le séminaire de mars » se range dans quel quadrant ?" explain="C’est important (l’événement engage l’entreprise) mais pas urgent aujourd’hui : on le planifie, sinon il deviendra urgent.">
        <QOpt>Urgent et important : je fais tout maintenant</QOpt>
        <QOpt ok>Important, pas urgent : je planifie</QOpt>
        <QOpt>Ni l’un ni l’autre : j’abandonne</QOpt>
      </QuizQ>
      <QuizQ q="Pour qu’un planning proposé par l’IA soit utile, il faut d’abord lui donner…" explain="Sans vos contraintes (réunions, horaires, échéances), l’IA produit une journée théorique qui ne tient pas compte de votre agenda réel.">
        <QOpt>Votre mot de passe d’agenda</QOpt>
        <QOpt ok>Vos tâches et vos contraintes horaires</QOpt>
        <QOpt>Rien, elle connaît les bonnes pratiques</QOpt>
      </QuizQ>
      <QuizQ q="Quelle question poser à l’IA après avoir créé une checklist ?" explain="« Qu’ai-je oublié ? » fait relire la liste sous un autre angle et fait souvent remonter des points manquants.">
        <QOpt ok>« Qu’ai-je oublié ? »</QOpt>
        <QOpt>« Es-tu sûre ? »</QOpt>
        <QOpt>« Peux-tu la raccourcir ? »</QOpt>
      </QuizQ>
      <QuizQ q="Un ordre du jour efficace précise pour chaque point…" explain="Durée, responsable et objectif (informer ou décider) : chacun sait ce qu’on attend de lui, et la réunion tient dans le temps.">
        <QOpt>Uniquement le titre</QOpt>
        <QOpt ok>La durée, le responsable et l’objectif (informer / décider)</QOpt>
        <QOpt>Les noms des absents</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Prioriser, M5_Journee, M5_Reunion, M5_Checklist, M5_Planning, M5_Modeles, M5_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 5 · 14:30

OBJECTIF — Annoncer un module court et très pratique.

DIRE — « Module 5 : l’organisation du travail. L’IA ne remplacera pas votre agenda, mais elle est très bonne pour proposer une structure : un planning, un ordre du jour, une checklist, un rétroplanning. Elle propose, vous arbitrez. »

TRANSITION — « Commençons par la question de tous les matins : par quoi je commence ? »`,
  `⏱ 6 min · PRIORISER (glisser-déposer, 1 clic pour la solution)

OBJECTIF — Rappeler la matrice urgent / important et montrer que l’IA peut faire un premier tri.

DIRE — « Huit tâches de Nadia ce matin. Quatre cases : urgent et important, je fais ; important mais pas urgent, je planifie ; urgent mais pas important, je fais vite ou je délègue ; ni l’un ni l’autre, j’abandonne. À vous de placer les étiquettes. »

ANIMATION — Faire glisser selon les propositions du groupe, débattre, puis clic pour la solution. Montrer ensuite le prompt en bas à gauche : l’IA peut proposer ce tri, avec une justification par tâche, mais elle ne sait pas que le client mécontent est votre plus gros client. C’est vous qui arbitrez.

TRANSITION — « Une fois les priorités posées, on construit la journée. »`,
  `⏱ 4 min · ORGANISER SA JOURNÉE (4 clics)

OBJECTIF — Montrer un planning de journée proposé à partir de contraintes.

DIRE — « La demande donne les tâches et les contraintes : la réunion de 10 h, le déjeuner, l’heure de départ, et des règles : l’important le matin, des blocs de concentration, de la marge. » Clics successifs pour faire apparaître le planning. « Le dossier de subvention en bloc protégé le matin, le client rappelé avant midi, les tâches légères en fin de journée. Les tâches du quatrième quadrant sont repoussées. » Dernier clic : « C’est une proposition : l’IA ne connaît ni votre énergie ni les imprévus de votre directeur. »

TRANSITION — « Autre grand consommateur de temps : les réunions. »`,
  `⏱ 5 min · PRÉPARER UNE RÉUNION (onglets)

OBJECTIF — Montrer l’aide de l’IA avant, pendant et après une réunion.

DIRE — Onglet Avant : « Un ordre du jour minuté, avec un responsable et un objectif par point : informer ou décider. » Onglet Pendant : « Une trame de prise de notes déjà rangée par point, avec les cases décision, action, questions. Avec ça, le compte rendu prend cinq minutes. » Onglet Après : « Le compte rendu, l’email de diffusion et des rappels à programmer avant chaque échéance. »

INSISTER — Le lien avec le module 4 : la trame de notes rend le compte rendu beaucoup plus fiable.

TRANSITION — « Les checklists, maintenant. »`,
  `⏱ 4 min · CRÉER UNE CHECKLIST (interactive)

OBJECTIF — Montrer une checklist générée et rangée par moment.

DIRE — « La demande impose une organisation par moment, de J − 7 à J + 7, et une règle : une ligne égale une action vérifiable. Voici le résultat. » Cocher quelques lignes pour montrer le score. « Et la question magique : qu’ai-je oublié ? L’IA suggère souvent les accès, la mutuelle, la carte de visite. »

ANIMATION — Demander au groupe ce qui manque à leurs yeux : il y a toujours une particularité de l’entreprise que l’IA ne peut pas connaître.

TRANSITION — « Pour les projets plus longs : le rétroplanning. »`,
  `⏱ 3 min · RÉTROPLANNING (4 clics)

OBJECTIF — Montrer un planning de projet généré à partir d’une date cible.

DIRE — « Séminaire le 20 mars. On part de la date et on remonte. » Clics : « Valider budget et date, réserver lieu et traiteur, construire le programme, envoyer les invitations, relancer, préparer la logistique. On demande un tableau prêt pour Excel pour le retravailler. » Dernier clic : « Les durées sont des durées types : vérifiez les vacances scolaires, les jours fériés et les délais réels de vos prestataires. »

TRANSITION — « Tout ce que vous refaites régulièrement mérite un modèle. »`,
  `⏱ 4 min · MODÈLES RÉUTILISABLES (cartes à retourner)

OBJECTIF — Faire le lien avec la bibliothèque de prompts : des modèles de documents cette fois.

DIRE — « Six modèles qui font gagner du temps chaque mois. Je retourne une carte : voici la demande pour créer le modèle. » Retourner deux ou trois cartes. « Notez l’usage des champs entre crochets, comme pour les prompts. Et la procédure pour votre remplaçant : c’est la mémoire du poste, très utile pendant vos congés. »

ANIMATION — Demander à chacun de choisir le modèle qu’il créera en premier en rentrant.

TRANSITION — « Petit quiz, puis pause. »`,
  `⏱ 3 min · QUIZ M5 (4 questions)

OBJECTIF — Valider les notions d’organisation.

DIRE — « Quatre questions rapides. »

ANIMATION — Cliquer la réponse majoritaire, lire les explications.

TRANSITION — « Pause de dix minutes. On reprend avec les tableaux et les données. »`,
];
// @@NOTES-END
