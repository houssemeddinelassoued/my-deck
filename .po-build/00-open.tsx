// ─── Ouverture ──────────────────────────────────────────────────────────────

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="bulb" size={22} /> Initiation
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{
          margin: '34px 0 0',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
          color: C.navy,
          ...dl(120),
        }}
      >
        L’IA pour
        <br />
        <span style={{ color: C.plum }}>Product Owner</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1000, ...dl(240) }}>
        Prioriser les cas d’usage IA d’un backlog et cadrer des user stories réalistes :
        passer du besoin à <strong style={{ color: C.navy }}>une mise en œuvre maîtrisée</strong>.
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 560, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>
        Together we grow
      </div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au produit</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={19}>
          <Icon name="brain" size={19} /> Fondamentaux
        </Tag>
        <Tag tone="teal" size={19}>
          <Icon name="filter" size={19} /> Priorisation
        </Tag>
        <Tag tone="violet" size={19}>
          <Icon name="route" size={19} /> Workflow
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="note" size={19} /> User stories
        </Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 720, ...dl(600) }}>
      <DapLogo size={40} />
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
    <Title>Bienvenue ! Une journée pour parler IA… en PO</Title>
    <Lede>Pas de mathématiques, pas de code : des décisions de produit, prises en connaissance de cause.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="pour passer de « l’IA, ça a l’air magique » à « voici ce que je mets dans le sprint »" tone="blue" d={150} />
      <OPromise value={<CountUp to={8} />} label="QCM interactifs pour vérifier que les notions sont acquises, module après module" tone="violet" d={280} />
      <OPromise value={<CountUp to={1} />} label="user story IA complète, avec ses critères d’acceptation, rédigée par vous" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Toute la journée, on travaille sur le même produit et le même backlog. Chaque notion se termine par une décision
        que vous prenez : <strong>c’est vous le PO</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « On ne priorise pas de l’IA. On priorise un problème… que l’IA résout parfois. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous, où en êtes-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 760 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon rôle
      </Eyebrow>
      <Poll>
        <PollRow id="o-r1" label="Product Owner" tone="blue" icon="target" />
        <PollRow id="o-r2" label="Chef de projet / Product Manager" tone="teal" icon="route" />
        <PollRow id="o-r3" label="Business analyst / fonctionnel" tone="violet" icon="doc" />
        <PollRow id="o-r4" label="UX / design" tone="pink" icon="palette" />
        <PollRow id="o-r5" label="Autre (dev, data, métier…)" tone="grey" icon="plus" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 940, top: 270, width: 860, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon rapport à l’IA aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="J’utilise ChatGPT ou Copilot au quotidien" tone="blue" icon="chat" />
        <PollRow id="o-a2" label="On me demande « de l’IA » dans le produit" tone="yellow" icon="alert" />
        <PollRow id="o-a3" label="Une feature IA est déjà dans mon backlog" tone="green" icon="note" />
        <PollRow id="o-a4" label="Une feature IA a déjà été livrée chez nous" tone="teal" icon="rocket" />
        <PollRow id="o-a5" label="Je suis plutôt sceptique" tone="coral" icon="eyeOff" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Gardez en tête une feature IA de votre propre produit : on s’en servira dans l’atelier de l’après-midi.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '20px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={52} />
    <div style={{ fontSize: 28, lineHeight: 1.32, color: C.ink }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs de la formation</Title>
    <Lede>À l’issue de la journée, vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1080, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Comprendre les notions fondamentales</strong> de l’IA utiles à un PO
      </OObj>
      <OObj n={2} tone="teal" d={220}>
        <strong>Identifier les opportunités IA</strong> dans un backlog produit… et les fausses bonnes idées
      </OObj>
      <OObj n={3} tone="violet" d={340}>
        <strong>Découvrir les workflows IA</strong> et leurs contraintes : données, modèle, intégration, UX
      </OObj>
      <OObj n={4} tone="green" d={460}>
        <strong>Cadrer une user story intégrant l’IA</strong>, avec des critères d’acceptation testables
      </OObj>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 260, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
      <Eyebrow c={C.navy}>L’objectif opérationnel</Eyebrow>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: C.navy }}>
        Prioriser les cas d’usage IA d’un backlog et cadrer des user stories réalistes.
      </div>
      <div style={{ marginTop: 22, height: 2, background: C.rule }} />
      <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
        Évaluation continue : QCM à chaque module, atelier, TP noté par les pairs, quiz final.
      </div>
    </div>
  </Frame>
);

// ─── Programme de la journée ────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 23, color: C.muted, paddingTop: 4 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 11, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 22, color: C.muted, lineHeight: 1.38, marginTop: 4 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 60 }}>
      <OHalf icon="brain" tone="blue" title="Matinée" sub="Comprendre l’IA et repérer les opportunités" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT}`} tone="grey" d={150} />
        <OSlot t="9:25" mod="M1" title="Comprendre l’IA" sub="Définitions, familles de modèles, cas d’usage" tone="blue" d={250} />
        <OSlot t="10:25" title="Pause" tone="yellow" d={330} />
        <OSlot t="10:40" mod="M2" title="Capacités & limites" sub="Données, biais, sécurité, gouvernance produit" tone="coral" d={400} />
        <OSlot t="11:35" mod="M3" title="Opportunités & priorisation" sub="Signaux, valeur, faisabilité · atelier backlog" tone="teal" d={500} />
      </OHalf>
      <OHalf icon="note" tone="green" title="Après-midi" sub="Du workflow IA à la user story" d={200}>
        <OSlot t="13:30" title="Reprise · quiz flash de la matinée" tone="grey" d={450} />
        <OSlot t="13:40" mod="M4" title="Le workflow IA du PO" sub="Données → modèle → intégration → UX" tone="violet" d={550} />
        <OSlot t="14:30" mod="M5" title="Cadrer une fonctionnalité IA" sub="Critères d’acceptation adaptés" tone="blue" d={650} />
        <OSlot t="15:40" mod="M6" title="Atelier & TP user story" sub="Reformuler un besoin · rédiger une story complète" tone="green" d={750} />
        <OSlot t="16:40" title="Synthèse · quiz final · évaluation" tone="navy" d={850} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 l’après-midi.
    </div>
  </Frame>
);

// ─── Le fil rouge Spendo ────────────────────────────────────────────────────
const OFact = ({ value, label, tone, d }: { value: ReactNode; label: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 46, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.35, color: C.soft }}>{label}</div>
  </div>
);

const OPain = ({ icon, tone, who, children, d }: { icon: IconName; tone: Tone; who: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{who}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.green }}>{PROJECT}</span>, l’appli de notes de frais
    </Title>
    <Lede>Un produit SaaS fictif mais réaliste, que vous allez faire évoluer toute la journée.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 20 }}>
      <OFact value="1 200" label="entreprises clientes (PME et ETI)" tone="blue" d={100} />
      <OFact value="85 000" label="salariés utilisateurs" tone="teal" d={180} />
      <OFact value="180 000" label="justificatifs déposés par mois" tone="violet" d={260} />
      <OFact value="2 100" label="tickets au support par mois" tone="coral" d={340} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 450, width: 980, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(400)}>
        Ce que remontent les utilisateurs
      </Eyebrow>
      <OPain icon="user" tone="blue" who="Les salariés" d={500}>
        « Je recopie montant, date et TVA de chaque ticket : 4 minutes par justificatif. »
      </OPain>
      <OPain icon="users" tone="yellow" who="Les managers" d={620}>
        « Je valide tout en bloc le vendredi soir, je ne regarde plus rien. »
      </OPain>
      <OPain icon="euro" tone="coral" who="Les comptables" d={740}>
        « Je contrôle tout à la main, et les doublons passent quand même. »
      </OPain>
      <OPain icon="chat" tone="teal" who="Le support" d={860}>
        « La moitié des tickets : “Est-ce que je peux me faire rembourser… ?” »
      </OPain>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1160, top: 450, width: 640, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(400) }}>
      <Eyebrow c={C.navy} size={20}>
        La squad
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 23, color: C.soft, lineHeight: 1.35 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <IconTile name="target" tone="green" size={46} solid />
          <span>
            <strong style={{ color: C.ink }}>Natalie</strong>, Product Owner… c’est vous
          </span>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <IconTile name="code" tone="blue" size={46} />
          <span>3 développeurs, 1 designer UX</span>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <IconTile name="chart" tone="violet" size={46} />
          <span>1 data scientist partagé avec une autre squad</span>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <IconTile name="shield" tone="coral" size={46} />
          <span>Un DPO et un RSSI, consultés « quand il faut »</span>
        </div>
      </div>
      <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.4, color: C.muted }}>
        La direction veut « de l’IA dans Spendo avant la fin de l’année ».
      </div>
    </div>
  </Frame>
);

// ─── Le backlog Spendo ──────────────────────────────────────────────────────
const BACKLOG: { id: string; icon: IconName; tone: Tone; t: string; by: string }[] = [
  { id: 'B1', icon: 'barcode', tone: 'blue', t: 'Remplir automatiquement montant, date, TVA et commerçant à partir de la photo du ticket', by: 'Salariés' },
  { id: 'B2', icon: 'layers', tone: 'teal', t: 'Proposer automatiquement la catégorie de dépense', by: 'Salariés' },
  { id: 'B3', icon: 'alert', tone: 'coral', t: 'Signaler les notes suspectes : doublons, montants anormaux', by: 'Comptables' },
  { id: 'B4', icon: 'chat', tone: 'violet', t: 'Assistant qui répond aux questions sur la politique de voyage', by: 'Support' },
  { id: 'B5', icon: 'archive', tone: 'grey', t: 'Export comptable vers Sage et Cegid', by: 'Comptables' },
  { id: 'B6', icon: 'lock', tone: 'grey', t: 'Connexion unique (SSO) avec l’annuaire de l’entreprise', by: 'DSI clientes' },
  { id: 'B7', icon: 'trend', tone: 'green', t: 'Prévoir le budget déplacements du trimestre par service', by: 'DAF' },
  { id: 'B8', icon: 'doc', tone: 'pink', t: 'Générer un résumé mensuel des dépenses pour le DAF', by: 'DAF' },
  { id: 'B9', icon: 'check', tone: 'yellow', t: 'Valider automatiquement les notes de moins de 50 €', by: 'Managers' },
  { id: 'B10', icon: 'globe', tone: 'navy', t: 'Traduire les justificatifs étrangers', by: 'Salariés' },
];

const BacklogItem = ({ it, size = 22, cls, style }: { it: (typeof BACKLOG)[number]; size?: number; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px', boxSizing: 'border-box', ...style }}
  >
    <span style={{ flex: 'none', width: 58, fontFamily: mono, fontWeight: 700, fontSize: size - 2, color: STRONG[it.tone] === C.faint ? C.muted : STRONG[it.tone] }}>{it.id}</span>
    <IconTile name={it.icon} tone={it.tone} size={44} />
    <span style={{ flex: 1, fontSize: size, lineHeight: 1.3, color: C.ink }}>{it.t}</span>
    <Tag tone="grey" size={17}>
      {it.by}
    </Tag>
  </div>
);

const O_Backlog: Page = () => (
  <Frame mod={0}>
    <Title>Le backlog de Natalie : dix idées, combien d’IA ?</Title>
    <Lede>Tout ce qui suit a été demandé par un client, un utilisateur ou la direction. Rien n’est encore priorisé.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {BACKLOG.map((it, i) => (
        <BacklogItem key={it.id} it={it} cls={A.in} style={dl(100 + i * 70)} />
      ))}
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(900) }}>
      <Callout title="Votre mission ce matin" tone="violet" icon="target">
        Pour chaque idée : <strong>faut-il de l’IA ? Laquelle ? Avec quelle valeur, quels risques ?</strong> À 12:30, vous
        aurez un top 3 argumenté. Petit indice : au moins trois de ces idées n’ont besoin d’aucune IA.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Poll, O_Objectifs, O_Programme, O_FilRouge, O_Backlog];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, poser le ton : une journée de décisions produit, pas un cours d’informatique.

DIRE — « Bonjour à toutes et à tous, bienvenue. Cette journée s’adresse aux Product Owners, aux chefs de projet et à toutes celles et ceux qui conçoivent un produit numérique. Le but n’est pas de faire de vous des data scientists. Le but, c’est que demain, quand quelqu’un dira “il faudrait mettre de l’IA là-dedans”, vous sachiez poser les bonnes questions, prioriser, et écrire une user story que l’équipe pourra vraiment livrer. »

ANIMATION — Laisser la page affichée pendant l’installation.

TRANSITION — « Quelques mots sur ce que vous allez produire aujourd’hui. »`,
  `⏱ 3 min · BIENVENUE

OBJECTIF — Donner la promesse chiffrée et le contrat pédagogique.

DIRE — « Sept heures. Huit QCM pour vérifier, au fil de l’eau, que les notions passent. Et à la fin, une user story IA complète, avec ses critères d’acceptation, rédigée par vous et relue par vos pairs. Le contrat : on travaille toute la journée sur un même produit et un même backlog. Chaque notion se termine par une décision que vous prenez, vous, en tant que PO. »

INSIST — « Le fil conducteur : on ne priorise pas de l’IA. On priorise un problème… que l’IA résout parfois. Gardez cette phrase, on y reviendra souvent. »

TRANSITION — « Faisons connaissance. »`,
  `⏱ 5 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les profils pour doser les exemples, et repérer les sceptiques comme les enthousiastes.

SONDAGE — « Premier vote : votre rôle. » Compter les mains, cliquer. « Deuxième vote : votre rapport à l’IA aujourd’hui. Plusieurs réponses possibles. »

ANIMATION — Cliquer une ligne par main levée. Faire réagir une ou deux personnes : « Vous avez déjà une feature IA livrée ? Qu’est-ce qui a été le plus difficile ? » Noter les sceptiques : ce sont souvent les meilleurs alliés sur le module 2.

CONSIGNE — « Gardez en tête une idée IA de votre propre produit : on s’en servira dans l’atelier de l’après-midi. »

TRANSITION — « Voici les objectifs de la formation. »`,
  `⏱ 3 min · OBJECTIFS

OBJECTIF — Présenter les quatre objectifs du programme et l’objectif opérationnel.

DIRE — « Quatre objectifs. Comprendre les notions fondamentales : juste ce qu’il faut pour dialoguer avec une équipe data. Identifier les opportunités dans un backlog, et surtout les fausses bonnes idées. Découvrir le workflow et ses contraintes : pourquoi une feature IA ne se livre pas comme une autre. Et cadrer une user story IA. L’objectif opérationnel, à droite, c’est celui qu’on évaluera : prioriser, puis cadrer. »

TRANSITION — « Le déroulé heure par heure. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère visuel du bandeau.

DIRE — « Le matin, on comprend et on repère : les fondamentaux, les limites, puis les opportunités et la priorisation, avec un atelier sur le backlog. L’après-midi, on construit : le workflow d’une feature IA, le cadrage avec les critères d’acceptation, et l’atelier plus le TP de rédaction. On reprend à 13:30 par un quiz flash. Le bandeau en haut à droite vous dit toujours où on en est. »

ANIMATION — Les horaires sont indicatifs : ajuster selon le rythme du groupe.

TRANSITION — « Parlons du produit sur lequel vous allez travailler toute la journée. »`,
  `⏱ 4 min · FIL ROUGE SPENDO

OBJECTIF — Installer le produit fil rouge, ses utilisateurs et ses irritants.

DIRE — « Spendo est une application SaaS de notes de frais pour les PME et ETI. 1 200 entreprises clientes, 85 000 salariés, 180 000 justificatifs déposés chaque mois. Quatre populations, quatre irritants. Les salariés recopient chaque ticket : 4 minutes par justificatif. Les managers valident en bloc sans regarder. Les comptables contrôlent tout à la main, et les doublons passent quand même. Le support croule sous les questions de politique de voyage. »

DIRE — « La squad : Natalie, la PO — c’est vous —, trois développeurs, une ou un designer, un data scientist partagé, et un DPO et un RSSI qu’on consulte “quand il faut”. Et la direction veut “de l’IA dans Spendo avant la fin de l’année”. Ça vous rappelle quelque chose ? »

INTERACTION — Laisser réagir. La pression « mettez de l’IA » est presque universelle : c’est le point de départ de la journée.

TRANSITION — « Voici le backlog dont vous héritez. »`,
  `⏱ 3 min · LE BACKLOG

OBJECTIF — Présenter les dix idées qui serviront de matière à tous les exercices.

DIRE — « Dix idées, toutes demandées par quelqu’un. Lisez-les en silence trente secondes. » Pause. « Votre mission ce matin : pour chacune, savoir s’il faut de l’IA, laquelle, avec quelle valeur et quels risques. À 12:30, vous aurez un top 3 argumenté. »

INSIST — « Petit indice : au moins trois de ces idées n’ont besoin d’aucune IA. Les repérer, c’est déjà faire votre métier de PO. »

ANIMATION — Ne pas donner les réponses. Pour mémoire : B5 export et B6 SSO sont de l’intégration classique ; B9 est une simple règle métier. B10 peut se faire avec un service de traduction existant, sans projet IA.

TRANSITION — « Pour trier ce backlog, il faut d’abord savoir de quoi on parle. Module 1 : comprendre l’IA. »`,
];
// @@NOTES-END
