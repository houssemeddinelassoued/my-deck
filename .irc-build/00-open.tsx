// ─── Ouverture ──────────────────────────────────────────────────────────────

// Vertical mini-parcours on the cover: five steps, one dot travelling down.
const OCoverStep = ({ icon, tone, eyebrow, label, y, d, solid = true }: { icon: IconName; tone: Tone; eyebrow: string; label: string; y: number; d: number; solid?: boolean }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 420, display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} solid={solid} style={{ boxShadow: '0 0 0 6px var(--osd-bg)' }} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: T[tone].fg }}>{eyebrow}</div>
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
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="smile" size={22} /> Niveau débutant
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        L’IA pour la
        <br />
        <span style={{ color: C.plum }}>relation client</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Améliorer la qualité et l’efficacité du service client grâce à l’IA : répondre plus vite, répondre mieux,{' '}
        <strong style={{ color: C.navy }}>et garder la main sur chaque réponse</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · relation client</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={19}>
          <Icon name="search" size={19} /> Analyser
        </Tag>
        <Tag tone="violet" size={19}>
          <Icon name="pen" size={19} /> Rédiger
        </Tag>
        <Tag tone="coral" size={19}>
          <Icon name="heart" size={19} /> Apaiser
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="chart" size={19} /> Améliorer
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 150, width: 420, height: 720 }}>
      <svg width={64} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 672" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 672" dur={3.2} r={8} color={C.electric} />
      </svg>
      <OCoverStep icon="mail" tone="blue" eyebrow="Demande" label="Un client écrit" y={0} d={400} />
      <OCoverStep icon="sparkles" tone="violet" eyebrow="Analyse IA" label="Intention, urgence, émotion" y={160} d={520} />
      <OCoverStep icon="pen" tone="violet" eyebrow="Brouillon IA" label="Une réponse proposée" y={320} d={640} />
      <OCoverStep icon="humanCheck" tone="pink" eyebrow="Conseiller" label="Je vérifie, j’ajuste, j’envoie" y={480} d={760} />
      <OCoverStep icon="smile" tone="green" eyebrow="Client" label="Satisfait, et ça se mesure" y={640} d={880} />
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
    <Title>Bienvenue ! Une journée pour travailler mieux, pas plus</Title>
    <Lede>Aucun prérequis technique : si vous savez écrire un email, vous savez parler à une IA.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur aujourd’hui</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de formation, dont la moitié en ateliers sur des cas clients réalistes" tone="blue" d={150} />
      <OPromise value={<CountUp to={7} />} label="modules, de l’analyse d’une demande jusqu’à l’analyse de la satisfaction" tone="violet" d={280} />
      <OPromise value={<CountUp to={6} />} label="ateliers pratiques : vous repartez avec vos propres prompts et modèles" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Je montre, vous pratiquez. Chaque technique est testée tout de suite, sur des demandes clients comme celles que vous traitez tous
        les jours. <strong>Toutes les questions sont bonnes</strong>, surtout les plus simples.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur de la journée : « L’IA propose, le conseiller dispose. »
    </div>
  </Frame>
);

// ─── Tour de table (sondage) ────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon métier
      </Eyebrow>
      <Poll>
        <PollRow id="o-m1" label="Conseiller(ère) / téléconseiller(ère)" tone="blue" icon="headset" />
        <PollRow id="o-m2" label="Service après-vente (SAV)" tone="teal" icon="tool" />
        <PollRow id="o-m3" label="Chargé(e) de clientèle / back-office" tone="violet" icon="inbox" />
        <PollRow id="o-m4" label="Superviseur / manager d’équipe" tone="green" icon="users" />
        <PollRow id="o-m5" label="Autre métier en contact client" tone="grey" icon="plus" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage de l’IA aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais essayé" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="Un peu, à titre personnel" tone="teal" icon="chat" />
        <PollRow id="o-u3" label="De temps en temps au travail" tone="blue" icon="sparkles" />
        <PollRow id="o-u4" label="Tous les jours au travail" tone="violet" icon="bolt" />
        <PollRow id="o-u5" label="Notre outil client intègre déjà de l’IA" tone="green" icon="bot" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Pour les ateliers, on forme des binômes qui mélangent les métiers et les niveaux.
    </Hint>
  </Frame>
);

// ─── Objectifs pédagogiques ─────────────────────────────────────────────────
const OGoal = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs : à la fin de la journée, vous saurez…</Title>
    <Lede>Huit objectifs pédagogiques, regroupés en quatre gestes du quotidien.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="search" tone="blue" title="Comprendre" d={100}>
        <Bullet size={23}>Connaître les principaux usages de l’IA générative en relation client</Bullet>
        <Bullet size={23}>Analyser et reformuler efficacement une demande client</Bullet>
      </OGoal>
      <OGoal icon="pen" tone="violet" title="Répondre" d={220}>
        <Bullet size={23} tone="violet">Rédiger des réponses claires, personnalisées, adaptées au contexte</Bullet>
        <Bullet size={23} tone="violet">Préparer les réponses aux réclamations et désamorcer les tensions</Bullet>
        <Bullet size={23} tone="violet">Créer et améliorer des modèles de réponses</Bullet>
      </OGoal>
      <OGoal icon="chart" tone="green" title="Capitaliser" d={340}>
        <Bullet size={23} tone="green">Structurer et enrichir une base de connaissances</Bullet>
        <Bullet size={23} tone="green">Analyser les échanges : tendances, irritants, axes d’amélioration</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Sécuriser" d={460}>
        <Bullet size={23} tone="coral">Protéger la confidentialité des données clients</Bullet>
        <Bullet size={23} tone="coral">Contrôler chaque réponse et garder la validation humaine</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, productions d’atelier, cas fil rouge final, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme de la journée ────────────────────────────────────────────────
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
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="search" tone="blue" title="Matin · Comprendre et répondre" sub="De la demande à la réponse" d={0}>
        <OSlot t="9:00" title="Ouverture · le cas Nova Maison" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="L’IA au service de la relation client" sub="Usages, assistance au conseiller, limites" tone="blue" d={230} />
        <OSlot t="10:00" mod="M2" title="Comprendre et analyser une demande" sub="Intention, catégorie, urgence, émotion · atelier 1" tone="teal" d={310} />
        <OSlot t="10:55" title="Pause" tone="grey" d={390} />
        <OSlot t="11:10" mod="M3" title="Rédiger des réponses clients avec l’IA" sub="Clarté, ton, personnalisation, traduction · atelier 2" tone="violet" d={470} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="heart" tone="coral" title="Après-midi · Apaiser et améliorer" sub="Des situations difficiles au pilotage" d={200}>
        <OSlot t="13:30" mod="M4" title="Réclamations et situations difficiles" sub="Désamorcer, escalader · atelier 3 (simulations)" tone="coral" d={350} />
        <OSlot t="14:30" mod="M5" title="Créer une base de connaissances" sub="FAQ, procédures, scripts, arbre de décision · atelier 4" tone="teal" d={430} />
        <OSlot t="15:20" title="Pause" tone="grey" d={510} />
        <OSlot t="15:35" mod="M6" title="Analyser les interactions clients" sub="Motifs, irritants, reporting · atelier 5" tone="green" d={590} />
        <OSlot t="16:25" mod="M7" title="Cas fil rouge et bonnes pratiques" sub="Confidentialité, contrôle humain · atelier 6" tone="navy" d={670} />
        <OSlot t="17:15" title="Quiz final · bilan · clôture" tone="grey" d={750} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M7 l’après-midi.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui avec une IA, sans aide. On refera l’exercice ce soir.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Citer trois usages concrets de l’IA dans un service client</CheckItem>
        <CheckItem id="ap2">Faire identifier l’intention, l’urgence et l’émotion d’un message</CheckItem>
        <CheckItem id="ap3">Obtenir une réponse claire, au bon ton, personnalisée</CheckItem>
        <CheckItem id="ap4">Préparer une réponse à une réclamation tendue</CheckItem>
        <CheckItem id="ap5">Créer un modèle de réponse réutilisable par toute l’équipe</CheckItem>
        <CheckItem id="ap6">Transformer une procédure en FAQ ou en arbre de décision</CheckItem>
        <CheckItem id="ap7">Faire ressortir les motifs de contact d’un lot de conversations</CheckItem>
        <CheckItem id="ap8">Savoir quelles données ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : vous êtes au bon endroit, on part de zéro.', tone: 'grey' },
            { min: 3, text: 'Premiers pas : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'À l’aise : visez les bonus de chaque atelier.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score sur un coin de feuille : il servira de référence pour mesurer votre progression.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le cas fil rouge : Nova Maison ─────────────────────────────────────────
const OFact = ({ icon, tone, children, d }: { icon: IconName; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0} beats={1}>
    <Title>
      Le fil rouge : <span style={{ color: C.violet }}>le service client de Nova Maison</span>
    </Title>
    <Lede>Une enseigne fictive, des situations bien réelles. On suivra une de ses clientes toute la journée.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
        <IconTile name="cart" tone="violet" size={64} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.navy }}>Nova Maison</div>
          <div style={{ fontSize: 22, color: C.muted }}>Vente en ligne d’électroménager et de mobilier</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OFact icon="users" tone="blue" d={250}>
          <strong style={{ color: C.ink }}>45 conseillers</strong> · téléphone, email, chat, réseaux sociaux
        </OFact>
        <OFact icon="inbox" tone="teal" d={350}>
          <strong style={{ color: C.ink }}>2 800 contacts</strong> par semaine, +40 % en période de soldes
        </OFact>
        <OFact icon="truck" tone="yellow" d={450}>
          Motifs : livraison, SAV, retours, remboursements, garanties
        </OFact>
        <OFact icon="target" tone="green" d={550}>
          Objectif : répondre en moins de 24 h, sans perdre en qualité
        </OFact>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 280, width: 860 }}>
      <Eyebrow c={C.coral} size={20} cls={A.fade} style={dl(500)}>
        Lundi, 8 h 42 · email reçu
      </Eyebrow>
      <Bubble who="user" name="Mme Léa Moreau · commande NM-48213" cls={A.in} style={{ marginTop: 14, ...dl(650) }} size={25}>
        Bonjour, mon lave-linge est arrivé avec <strong>6 jours de retard</strong> et il <strong>fuit dès le premier lavage</strong> ! J’ai
        dû éponger toute la buanderie. C’est la <strong>deuxième fois</strong> que je vous écris et personne ne répond. Je veux une solution
        rapide, sinon j’annule tout et je laisse un avis.
      </Bubble>
      <div className={b.on(1)} style={{ marginTop: 26 }}>
        <Callout title="Toute la journée" tone="violet" icon="route" size={24}>
          Ce message va passer par chaque module : on l’<strong>analyse</strong> (M2), on y <strong>répond</strong> (M3), on{' '}
          <strong>désamorce</strong> (M4), on <strong>cherche la procédure</strong> (M5), on <strong>mesure</strong> (M6), puis on le traite
          de bout en bout (M7).
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Règles du jeu & check-up ───────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : prêts pour les ateliers ?</Title>
    <Lede>Un seul outil suffit : l’assistant IA que votre entreprise autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA professionnel ouvert (Copilot, ChatGPT Entreprise, Gemini…)</CheckItem>
        <CheckItem id="su2" size={26}>Le kit de cas Nova Maison (messages, procédures, conversations)</CheckItem>
        <CheckItem id="su3" size={26}>Un document vierge pour garder vos meilleurs prompts</CheckItem>
        <CheckItem id="su4" size={26}>Votre binôme identifié pour les ateliers</CheckItem>
        <CheckItem id="su5" size={26}>Téléphone en silencieux, pas sur vos files de contact</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle de client dans les ateliers : pas de nom, d’adresse, de numéro de contrat ou de carte. Le kit est 100 % fictif.
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
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, rassurer : la formation est pensée pour des débutants et pour le quotidien d’un service client.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va voir comment l’IA peut vous aider dans votre métier : comprendre plus vite ce que veut un client, lui répondre mieux, gérer les situations tendues, et tirer des enseignements de tous vos échanges. À droite, vous avez le parcours d’une demande : un client écrit, l’IA aide à analyser, elle propose une réponse… et c’est vous qui vérifiez, ajustez et envoyez. »

INSISTER — L’IA ne remplace pas le conseiller : elle lui fait gagner du temps sur ce qui est répétitif, pour qu’il en ait plus pour ce qui compte.

TRANSITION — « Quelques mots sur la journée. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Poser le cadre : 7 heures, 7 modules, 6 ateliers, beaucoup de pratique.

DIRE — « Je suis votre formateur aujourd’hui. Sept heures, sept modules, six ateliers. La moitié du temps, c’est vous qui pratiquez, sur des demandes clients réalistes. Pas besoin d’être à l’aise avec la technique : si vous savez écrire un email, vous savez parler à une IA. Et une phrase à garder en tête toute la journée : l’IA propose, le conseiller dispose. »

ANIMATION — Les chiffres s’animent tout seuls. Laisser le temps de lire le contrat.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les métiers et les niveaux pour adapter les exemples et former les binômes.

DIRE — « Premier vote : votre métier. » Compter les mains, cliquer. « Deuxième vote : votre usage de l’IA aujourd’hui. Aucun jugement : « jamais essayé » est une excellente réponse, c’est même pour vous que cette journée est faite. »

ANIMATION — Cliquer une ligne par main levée. Repérer les personnes à l’aise pour les associer à des débutants. Si l’outil client intègre déjà de l’IA, demander lequel et ce qu’il fait : cela donnera des exemples concrets au module 1.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les huit objectifs pédagogiques, regroupés en quatre gestes.

DIRE — « Le programme compte huit objectifs. Pour les retenir, je les range en quatre gestes. Comprendre : savoir ce que l’IA peut faire pour vous, et analyser une demande. Répondre : rédiger, gérer les réclamations, créer des modèles. Capitaliser : construire une base de connaissances et analyser les échanges pour améliorer le service. Et sécuriser : confidentialité et contrôle humain, qui reviennent dans tous les modules. »

TRANSITION — « Concrètement, voici le déroulé. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée.

DIRE — « Le matin, on comprend et on répond : les usages, l’analyse d’une demande, puis la rédaction des réponses. L’après-midi, on apaise et on améliore : les réclamations, la base de connaissances, l’analyse des interactions, et pour finir le cas fil rouge complet avec les bonnes pratiques. Le bandeau en haut à droite vous indique toujours où nous en sommes. »

ANIMATION — Horaires indicatifs : ajuster au rythme du groupe. Les pauses peuvent glisser de 10 minutes.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ pour pouvoir constater la progression en fin de journée.

DIRE — « Huit affirmations, une par compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Si vous avez zéro, c’est parfait : vous allez voir la différence. Notez votre score : on refait exactement le même exercice ce soir. »

ANIMATION — Faire cocher un volontaire à l’écran, ou chacun sur papier. Ne pas commenter les scores individuels.

TRANSITION — « Je vous présente maintenant l’entreprise qui va nous accompagner toute la journée. »`,
  `⏱ 4 min · LE CAS FIL ROUGE : NOVA MAISON (→ fait apparaître l’encadré)

OBJECTIF — Installer le cas fil rouge et la cliente qui reviendra à chaque module.

DIRE — « Nova Maison est une enseigne fictive de vente en ligne d’électroménager et de mobilier. Quarante-cinq conseillers, deux mille huit cents contacts par semaine, beaucoup plus en période de soldes. Et lundi matin, Mme Moreau écrit. » Lire le message à voix haute, avec le ton. « Retard, panne, deuxième relance, menace d’annulation et d’avis négatif. Tout y est. »

ANIMATION — Demander : « Qui a déjà reçu ce genre de message cette semaine ? » → révéler l’encadré : ce message va passer par chaque module.

INSISTER — Toutes les données sont fictives : c’est une règle de la journée, on en reparle tout de suite.

TRANSITION — « Dernière vérification avant de démarrer. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier que chacun a un outil IA autorisé et le kit de cas, et poser la règle d’or des données.

DIRE — « Trois minutes. Vérifiez chaque ligne. Un seul outil suffit : celui que votre entreprise autorise. Ouvrez aussi un document vierge : vous y collerez vos meilleurs prompts au fil de la journée, ce sera votre boîte à outils. Et la règle d’or : aucune donnée réelle de client. Pas de nom, pas d’adresse, pas de numéro de contrat. Le kit Nova Maison est entièrement fictif. »

ANIMATION — Lancer le minuteur, passer dans les rangs. Si un outil manque, travailler en binôme sur un seul poste.

TRANSITION — « Tout le monde est prêt ? Module 1 : l’IA au service de la relation client. »`,
];
// @@NOTES-END
