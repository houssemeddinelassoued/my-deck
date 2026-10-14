// ─── Ouverture · Jour 1 ─────────────────────────────────────────────────────

// Vertical mini-workflow on the cover: five steps, one dot travelling down.
const OCoverStep = ({ kind, label, y, d }: { kind: NodeKind; label: string; y: number; d: number }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 400, display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={NK[kind].icon} tone={NK[kind].tone} size={64} solid style={{ boxShadow: '0 0 0 6px var(--osd-bg)' }} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: T[NK[kind].tone].fg }}>{NK[kind].label}</div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{label}</div>
    </div>
  </div>
);

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 960 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 2 jours · 14 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="bolt" size={22} /> Niveau intermédiaire
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        IA avancée
        <br />
        <span style={{ color: C.plum }}>& automatisation</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Concevoir et automatiser ses processus professionnels avec l’IA : passer de l’outil qu’on interroge au{' '}
        <strong style={{ color: C.navy }}>processus qui travaille pour vous</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · automatisation des processus</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="violet" size={19}>
          <Icon name="chat" size={19} /> Prompts
        </Tag>
        <Tag tone="teal" size={19}>
          <Icon name="doc" size={19} /> Documents
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="puzzle" size={19} /> No-code
        </Tag>
        <Tag tone="blue" size={19}>
          <Icon name="bot" size={19} /> Agents
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 150, width: 400, height: 720 }}>
      <svg width={64} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 672" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 672" dur={3.2} r={8} color={C.electric} />
      </svg>
      <OCoverStep kind="trigger" label="Formulaire reçu" y={0} d={400} />
      <OCoverStep kind="ai" label="L’IA classe et résume" y={160} d={520} />
      <OCoverStep kind="cond" label="Demande urgente ?" y={320} d={640} />
      <OCoverStep kind="human" label="Un humain valide" y={480} d={760} />
      <OCoverStep kind="action" label="Réponse envoyée" y={640} d={880} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Bienvenue & promesse ───────────────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Deux jours pour changer d’échelle</Title>
    <Lede>Vous savez déjà converser avec une IA. Ici, on apprend à la faire travailler dans vos processus, sans vous.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour ces deux jours</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={14} suffix=" h" />} label="sur deux jours : la moitié du temps en ateliers, sur vos propres cas" tone="blue" d={150} />
      <OPromise value={<CountUp to={9} />} label="modules, chacun clos par un atelier qui produit un livrable réutilisable" tone="violet" d={280} />
      <OPromise value={<CountUp to={1} />} label="automatisation complète de votre métier, conçue et présentée au groupe" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec une méthode d’analyse, des prompts prêts à brancher et au moins un workflow qui tourne.
        Le formateur montre, vous construisez : <strong>c’est vous qui tenez la souris</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA traite, le workflow orchestre, l’humain décide. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : d’où partez-vous ?</Title>
    <Lede>Main levée (ou réaction dans le chat) : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon assistant IA au quotidien
      </Eyebrow>
      <Poll>
        <PollRow id="o-t1" label="ChatGPT" tone="green" icon="chat" />
        <PollRow id="o-t2" label="Microsoft Copilot" tone="blue" icon="chat" />
        <PollRow id="o-t3" label="Gemini" tone="violet" icon="chat" />
        <PollRow id="o-t4" label="Claude" tone="yellow" icon="chat" />
        <PollRow id="o-t5" label="Le Chat (Mistral) ou autre" tone="grey" icon="plus" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon expérience de l’automatisation
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="Jamais automatisé quoi que ce soit" tone="grey" icon="smile" />
        <PollRow id="o-a2" label="Des règles Outlook / Gmail, des macros Excel" tone="teal" icon="mail" />
        <PollRow id="o-a3" label="Déjà testé Power Automate" tone="blue" icon="puzzle" />
        <PollRow id="o-a4" label="Déjà testé Make ou Zapier" tone="violet" icon="puzzle" />
        <PollRow id="o-a5" label="J’ai des automatisations en production" tone="green" icon="rocket" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Les binômes mélangent les profils : un « métier » et un « outillé » si possible.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OGoal = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '24px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs : à l’issue des deux jours, vous saurez…</Title>
    <Lede>Treize objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="search" tone="blue" title="Analyser" d={100}>
        <Bullet size={22}>Repérer les opportunités d’automatisation dans vos processus</Bullet>
        <Bullet size={22}>Distinguer assistance, automatisation et automatisation intelligente</Bullet>
        <Bullet size={22}>Comprendre ce que font vraiment les agents IA</Bullet>
      </OGoal>
      <OGoal icon="chat" tone="violet" title="Concevoir" d={220}>
        <Bullet size={22} tone="violet">Écrire des prompts faits pour tourner dans un workflow</Bullet>
        <Bullet size={22} tone="violet">Analyser et transformer documents et données</Bullet>
        <Bullet size={22} tone="violet">Dessiner un workflow intégrant une ou plusieurs étapes IA</Bullet>
        <Bullet size={22} tone="violet">Concevoir des assistants IA spécialisés</Bullet>
      </OGoal>
      <OGoal icon="puzzle" tone="green" title="Automatiser" d={340}>
        <Bullet size={22} tone="green">Utiliser un outil no-code : Make, Power Automate, Zapier</Bullet>
        <Bullet size={22} tone="green">Connecter plusieurs applications dans un même flux</Bullet>
        <Bullet size={22} tone="green">Manier conditions, filtres et règles</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Encadrer" d={460}>
        <Bullet size={22} tone="coral">Placer une validation humaine au bon endroit</Bullet>
        <Bullet size={22} tone="coral">Identifier les risques : données, confidentialité, erreurs</Bullet>
        <Bullet size={22} tone="coral">Livrer un processus automatisé adapté à votre métier</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, livrables d’atelier, projet final présenté au groupe, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme des deux jours ───────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 78, fontFamily: mono, fontSize: 21, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="route" tone="violet" title="Jour 1 · Concevoir" sub="Des workflows qui intègrent l’IA" d={0}>
        <OSlot t="9:00" title="Ouverture · votre processus fil rouge" tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="De l’IA générative à l’automatisation" sub="Niveaux d’automatisation · atelier cartographie" tone="blue" d={230} />
        <OSlot t="11:00" mod="M2" title="Prompting avancé pour les workflows" sub="Variables, formats, chaînage · atelier prompts" tone="violet" d={310} />
        <OSlot t="13:30" mod="M3" title="Exploiter documents et données" sub="Extraire, comparer, structurer · atelier documents" tone="teal" d={390} />
        <OSlot t="15:15" mod="M4" title="Concevoir un workflow IA" sub="Composants, règles, validation · atelier schéma" tone="navy" d={470} />
        <OSlot t="16:45" title="Bilan du jour 1" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="puzzle" tone="green" title="Jour 2 · Automatiser" sub="Intégrer, connecter, sécuriser" d={200}>
        <OSlot t="9:00" mod="M5" title="Premières automatisations no-code" sub="Make, Power Automate, Zapier · atelier" tone="green" d={350} />
        <OSlot t="11:00" mod="M6" title="Conditions et logique" sub="Filtres, routage, exceptions · atelier" tone="yellow" d={430} />
        <OSlot t="13:30" mod="M7" title="Connecter les outils professionnels" sub="Écosystème multi-applications · atelier" tone="pink" d={510} />
        <OSlot t="14:30" mod="M8" title="Assistants et agents IA" sub="Mission, règles, outils · atelier" tone="blue" d={590} />
        <OSlot t="15:45" mod="M9" title="Sécurité, fiabilité, gouvernance" sub="Arbitrer : automatiser ou pas · atelier" tone="coral" d={670} />
        <OSlot t="16:20" title="Projet final · présentations · clôture" tone="navy" d={750} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M4 le jour 1, M5 → M9 le jour 2.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice à la fin du jour 2.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Dire si une tâche se prête à l’automatisation, et pourquoi</CheckItem>
        <CheckItem id="ap2">Écrire un prompt qui renvoie toujours le même format (JSON, tableau)</CheckItem>
        <CheckItem id="ap3">Faire extraire des champs fiables d’un document non structuré</CheckItem>
        <CheckItem id="ap4">Dessiner un workflow avec déclencheur, conditions et validation</CheckItem>
        <CheckItem id="ap5">Construire un scénario dans Make, Power Automate ou Zapier</CheckItem>
        <CheckItem id="ap6">Faire circuler une donnée entre formulaire, tableur, CRM et email</CheckItem>
        <CheckItem id="ap7">Configurer un assistant IA spécialisé avec ses règles et documents</CheckItem>
        <CheckItem id="ap8">Expliquer quand il ne faut surtout pas automatiser</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Utilisateur d’IA : on va industrialiser vos usages.', tone: 'grey' },
            { min: 3, text: 'Déjà outillé : on va structurer et fiabiliser.', tone: 'blue' },
            { min: 6, text: 'Avancé : visez les bonus de chaque atelier.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression en fin de formation.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Votre processus fil rouge ──────────────────────────────────────────────
const OCrit = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const OLog = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <Num n={`M${n}`} tone={tone} size={40} style={{ fontSize: 16 }} />
    <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontSize: 21, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>{title}</span>
      <span style={{ fontSize: 19, color: C.muted }}>{out}</span>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Votre fil rouge : <span style={{ color: C.green }}>un processus de votre métier</span>
    </Title>
    <Lede>Chaque module ajoute une pièce. Au bout des deux jours, l’automatisation est conçue, construite et défendue.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade}>
        Un bon candidat est…
      </Eyebrow>
      <OCrit icon="loop" tone="blue" title="Fréquent" d={100}>
        Au moins chaque semaine, idéalement chaque jour
      </OCrit>
      <OCrit icon="clock" tone="violet" title="Chronophage" d={200}>
        Il vous coûte du temps sans vous apporter de valeur
      </OCrit>
      <OCrit icon="scale" tone="teal" title="Assez régulier" d={300}>
        Des règles explicables, même avec quelques exceptions
      </OCrit>
      <OCrit icon="doc" tone="green" title="Déjà numérique" d={400}>
        Emails, formulaires, fichiers, tableurs : pas de papier
      </OCrit>
      <OCrit icon="shield" tone="coral" title="Sans enjeu critique pour commencer" d={500}>
        Pas de décision RH, juridique ou financière irréversible
      </OCrit>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1040, top: 270, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Carnet de bord du projet
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <OLog n={1} tone="blue" title="Cartographie" out="entrée → étapes → sortie" d={300} />
        <OLog n={2} tone="violet" title="Prompts" out="les consignes de chaque étape IA" d={360} />
        <OLog n={3} tone="teal" title="Données" out="ce qu’on extrait, sous quel format" d={420} />
        <OLog n={4} tone="navy" title="Schéma" out="règles, exceptions, validation" d={480} />
        <OLog n={5} tone="green" title="Premier scénario" out="un déclencheur, une action" d={540} />
        <OLog n={6} tone="yellow" title="Logique" out="conditions et routage" d={600} />
        <OLog n={7} tone="pink" title="Connexions" out="les applications du flux" d={660} />
        <OLog n={8} tone="blue" title="Assistant" out="si une conversation est utile" d={720} />
        <OLog n={9} tone="coral" title="Garde-fous" out="risques et contrôles" d={780} />
      </div>
    </div>
  </Frame>
);

// ─── Règles du jeu & équipement ─────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : vos outils pour les ateliers</Title>
    <Lede>Un seul outil d’automatisation suffit : prenez celui que votre entreprise autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA professionnel ouvert (compte de l’entreprise)</CheckItem>
        <CheckItem id="su2" size={26}>Un compte Make, Power Automate ou Zapier (offre gratuite ou d’essai)</CheckItem>
        <CheckItem id="su3" size={26}>Un tableur en ligne : Google Sheets ou Excel sur OneDrive</CheckItem>
        <CheckItem id="su4" size={26}>Un outil de formulaire : Google Forms, Microsoft Forms, Tally…</CheckItem>
        <CheckItem id="su5" size={26}>Une boîte mail de test (pas votre boîte principale)</CheckItem>
        <CheckItem id="su6" size={26}>Papier, feutres et post-it pour dessiner avant de cliquer</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle de client, de salarié ou de contrat dans les ateliers. Nous utilisons des jeux de données fictifs.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Poll, O_Objectifs, O_Programme, O_AutoPos, O_FilRouge, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · J1 9:00

OBJECTIF — Accueillir, poser le niveau : ce n’est pas une initiation à l’IA générative.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Pendant deux jours, on va travailler sur une question simple : comment passer d’une IA que l’on interroge à la main, une question à la fois, à une IA qui travaille dans vos processus, toute seule, avec des garde-fous. À droite, vous voyez le genre d’objet que vous saurez construire : un formulaire arrive, l’IA le classe et le résume, une condition repère l’urgence, un humain valide, la réponse part. Rien de magique : des briques simples, bien assemblées. »

ANIMATION — Laisser la page affichée pendant l’installation. Le point qui descend illustre l’idée de flux : y revenir si quelqu’un demande ce qu’est un workflow.

TRANSITION — « Quelques mots sur ce qui vous attend. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Donner la promesse chiffrée et le contrat pédagogique.

DIRE — « Quatorze heures, dont la moitié en atelier. Neuf modules, chacun clos par un atelier qui produit quelque chose : une cartographie, des prompts, un schéma, un scénario qui tourne. Et un fil rouge : votre propre processus. À la fin du jour 2, chacun présente son automatisation au groupe. Le contrat : je montre, vous construisez. Et le fil conducteur, que vous allez entendre souvent : l’IA traite, le workflow orchestre, l’humain décide. »

INSISTER — Le public a déjà de l’expérience : valoriser ce qu’il sait, annoncer qu’on va le structurer.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les outils déjà utilisés pour adapter les démonstrations et former des binômes complémentaires.

DIRE — « Premier vote : votre assistant IA du quotidien. » Compter, cliquer. « Deuxième vote : votre expérience de l’automatisation. Pas de jugement : les règles Outlook, c’est déjà de l’automatisation, et c’est un excellent point de départ. »

ANIMATION — Cliquer une ligne par main levée. Repérer les personnes qui ont déjà des automatisations en production : leur proposer d’être binôme d’un débutant et de partager un retour d’expérience au module 5.

TRANSITION — « Voici ce que vous saurez faire en partant. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les treize objectifs du programme, regroupés en quatre gestes.

DIRE — « Le programme officiel compte treize objectifs. Pour les retenir, je les range en quatre gestes. Analyser : savoir regarder un processus et dire ce qui s’automatise. Concevoir : écrire des prompts faits pour tourner seuls, traiter des documents, dessiner un workflow, configurer un assistant. Automatiser : construire avec un outil no-code, connecter des applications, poser des conditions. Encadrer : placer la validation humaine, maîtriser les risques, livrer quelque chose d’adapté à votre métier. Le jour 1 couvre surtout les deux premiers gestes, le jour 2 les deux derniers. »

TRANSITION — « Le déroulé heure par heure. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé et le repère visuel du bandeau.

DIRE — « Jour 1, on conçoit : du concept d’automatisation intelligente jusqu’au schéma complet d’un workflow, en passant par les prompts et le traitement des documents. Jour 2, on automatise : on construit dans un vrai outil, on ajoute la logique, on connecte les applications, on découvre assistants et agents, et on finit par la sécurité et la gouvernance avant le projet final. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe. Pauses vers 10:45 et 15:00, déjeuner 12:30.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par grande compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide et sans chercher. Notez votre score sur un coin de feuille : on refera exactement le même exercice à la fin du jour 2. »

ANIMATION — Faire cocher un volontaire à l’écran ou laisser chacun noter sur papier. Repérer les scores élevés : leur proposer les bonus des ateliers.

TRANSITION — « Maintenant, choisissons votre fil rouge. »`,
  `⏱ 5 min · VOTRE PROCESSUS FIL ROUGE

OBJECTIF — Faire choisir dès maintenant un processus réel qui servira de projet final.

DIRE — « Chacun d’entre vous va travailler sur un processus de son propre métier. Pas besoin de le choisir parfaitement : vous pourrez changer jusqu’au module 4. Un bon candidat est fréquent, chronophage, assez régulier pour qu’on puisse expliquer ses règles, déjà numérique, et sans enjeu critique pour commencer. Exemples : traiter les demandes reçues sur une adresse générique, préparer un compte rendu de réunion, qualifier des prospects, trier des factures, répondre aux questions récurrentes des salariés. À droite, votre carnet de bord : chaque module ajoute une pièce, jusqu’aux garde-fous du module 9. »

ANIMATION — Laisser deux minutes : chacun écrit en une phrase le processus pressenti. Faire lire trois ou quatre exemples à voix haute pour inspirer les hésitants.

TRANSITION — « Dernière étape : vérifions que vous avez les outils. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les comptes et outils nécessaires aux ateliers.

DIRE — « Trois minutes. Vérifiez chaque ligne et cochez. Pour l’outil d’automatisation, un seul suffit : prenez celui que votre entreprise autorise. Power Automate est souvent déjà inclus dans Microsoft 365 ; Make et Zapier ont des offres gratuites suffisantes pour la formation. Et la règle d’or : aucune donnée réelle dans les ateliers. Nous avons des jeux de données fictifs. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si un compte manque, le binôme travaille sur le poste de l’autre ; la création de compte peut se faire pendant le module 1.

TRANSITION — « Tout le monde est prêt ? Module 1 : de l’IA générative à l’automatisation intelligente. »`,
];
// @@NOTES-END
