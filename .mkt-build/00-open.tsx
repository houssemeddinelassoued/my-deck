// ─── Ouverture ──────────────────────────────────────────────────────────────

// Cover: one idea fans out into six channel tiles, dots travel along each path.
const OCh = ({ icon, tone, label, y, d }: { icon: IconName; tone: Tone; label: string; y: number; d: number }) => (
  <div className={A.right} style={{ position: 'absolute', left: 300, top: y, display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} solid />
    <span style={{ fontSize: 25, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);
const OPath = ({ y, d }: { y: number; d: number }) => {
  const path = `M 110 380 C 200 380, 210 ${y + 32}, 296 ${y + 32}`;
  return (
    <>
      <path d={path} pathLength={1} fill="none" stroke={C.rule} strokeWidth={4} strokeLinecap="round" className={A.draw} style={dl(d)} />
      <FlowDot path={path} dur={2.6} begin={d / 1000} r={6} color={C.electric} />
    </>
  );
};

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 120, width: 900 }}>
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
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        L’IA pour le
        <br />
        marketing &
        <br />
        <span style={{ color: C.plum }}>la communication</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 860, ...dl(240) }}>
        Créer plus rapidement et plus efficacement : des idées aux contenus, des visuels à l’analyse,{' '}
        <strong style={{ color: C.navy }}>sans perdre la voix de votre marque</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={650} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 674, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · marketing & communication</div>
    </div>
    <div style={{ position: 'absolute', left: 1290, top: 150, width: 560, height: 800 }}>
      <svg width={560} height={800} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <OPath y={20} d={500} />
        <OPath y={150} d={580} />
        <OPath y={280} d={660} />
        <OPath y={410} d={740} />
        <OPath y={540} d={820} />
        <OPath y={670} d={900} />
      </svg>
      <div className={A.pop} style={{ position: 'absolute', left: 0, top: 320, ...dl(300) }}>
        <div className={A.glow} style={{ width: 120, height: 120, borderRadius: 28, background: G.violet, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bulb" size={66} color="#fff" />
        </div>
        <div style={{ marginTop: 12, width: 120, textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 20, letterSpacing: '0.12em', color: C.violet }}>1 IDÉE</div>
      </div>
      <OCh icon="news" tone="navy" label="Article" y={20} d={560} />
      <OCh icon="linkedin" tone="blue" label="Post LinkedIn" y={150} d={640} />
      <OCh icon="insta" tone="pink" label="Instagram" y={280} d={720} />
      <OCh icon="mail" tone="teal" label="Newsletter" y={410} d={800} />
      <OCh icon="image" tone="violet" label="Visuels" y={540} d={880} />
      <OCh icon="video" tone="coral" label="Script vidéo" y={670} d={960} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Bienvenue ──────────────────────────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Une journée pour créer plus vite… et mieux</Title>
    <Lede>Aucun prérequis technique : si vous savez écrire un email, vous savez parler à une IA. On va apprendre à bien lui parler.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="dont la moitié en ateliers : vous produisez, je vous accompagne" tone="blue" d={150} />
      <OPromise value={<CountUp to={6} />} label="modules, de la stratégie à l’analyse, chacun avec un livrable concret" tone="violet" d={280} />
      <OPromise value={<CountUp to={1} />} label="mini-campagne complète, construite et présentée en fin de journée" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec une méthode de prompt, une bibliothèque de prompts testés et une mini-campagne prête à adapter.
        Je montre, <strong>vous tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA propose, le marketeur dispose. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous ?</Title>
    <Lede>Main levée (ou réaction dans le chat) : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon métier
      </Eyebrow>
      <Poll>
        <PollRow id="o-m1" label="Chargé·e de marketing" tone="blue" icon="target" />
        <PollRow id="o-m2" label="Chargé·e de communication" tone="violet" icon="megaphone" />
        <PollRow id="o-m3" label="Community manager" tone="pink" icon="hash" />
        <PollRow id="o-m4" label="Assistant·e marketing" tone="teal" icon="calendar" />
        <PollRow id="o-m5" label="Responsable communication" tone="navy" icon="org" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage de l’IA aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais essayé, ou presque" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="Quelques essais, résultats décevants" tone="coral" icon="alert" />
        <PollRow id="o-u3" label="De temps en temps, pour reformuler" tone="yellow" icon="pen" />
        <PollRow id="o-u4" label="Chaque semaine, pour plusieurs tâches" tone="blue" icon="calendar" />
        <PollRow id="o-u5" label="Tous les jours, c’est mon assistant" tone="green" icon="rocket" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      On formera des binômes mixtes : un profil « contenus » avec un profil « stratégie » si possible.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
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
    <Lede>Huit objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="bulb" tone="blue" title="Comprendre" d={100}>
        <Bullet size={23}>Les usages de l’IA générative en marketing et communication</Bullet>
        <Bullet size={23}>Chercher des idées, analyser une problématique, construire des pistes</Bullet>
      </OGoal>
      <OGoal icon="pen" tone="violet" title="Créer" d={220}>
        <Bullet size={23} tone="violet">Générer et améliorer articles, posts, emails, newsletters, supports</Bullet>
        <Bullet size={23} tone="violet">Rédiger des briefs et concevoir des visuels professionnels</Bullet>
      </OGoal>
      <OGoal icon="split" tone="teal" title="Adapter" d={340}>
        <Bullet size={23} tone="teal">Décliner un contenu par public, canal et format</Bullet>
        <Bullet size={23} tone="teal">Personnaliser pour rendre chaque message plus pertinent</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Analyser & garantir" d={460}>
        <Bullet size={23} tone="coral">Analyser données, avis clients et performances de campagne</Bullet>
        <Bullet size={23} tone="coral">Vérifier, corriger, garantir qualité et conformité à la marque</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, livrables d’atelier, mini-campagne présentée au groupe, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme de la journée ────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 78, fontFamily: mono, fontSize: 21, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="bulb" tone="violet" title="Matin · Penser & écrire" sub="De la stratégie aux contenus" d={0}>
        <OSlot t="9:00" title="Ouverture · le fil rouge de la journée" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Comprendre l’IA dans le marketing" sub="Outils, formats, opportunités, limites" tone="blue" d={230} />
        <OSlot t="10:00" mod="M2" title="Stratégie et création d’idées" sub="Cible, personas, ligne éditoriale · atelier calendrier" tone="violet" d={310} />
        <OSlot t="11:10" title="Pause" tone="grey" d={390} />
        <OSlot t="11:25" mod="M3" title="Création de contenus" sub="Article, posts, emails, slogans, scripts · atelier" tone="teal" d={470} />
      </OHalf>
      <OHalf icon="palette" tone="green" title="Après-midi · Montrer & mesurer" sub="Visuels, déclinaisons, analyse, projet" d={200}>
        <OSlot t="13:30" mod="M4" title="Images et contenus visuels" sub="Prompt image, brief créatif, déclinaisons · atelier" tone="pink" d={350} />
        <OSlot t="14:20" mod="M5" title="Personnalisation et adaptation" sub="Un contenu, six canaux · atelier multicanal" tone="green" d={430} />
        <OSlot t="15:10" title="Pause" tone="grey" d={510} />
        <OSlot t="15:25" mod="M6" title="Analyse marketing avec l’IA" sub="Données, avis, tendances, recommandations" tone="yellow" d={590} />
        <OSlot t="16:05" title="Projet final · mini-campagne · clôture" tone="navy" d={670} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 l’après-midi, puis le projet.
    </div>
  </Frame>
);

// ─── Le fil rouge : Ardente ─────────────────────────────────────────────────
const OFact = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const OLog = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <Num n={`M${n}`} tone={tone} size={42} style={{ fontSize: 16 }} />
    <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>{title}</span>
      <span style={{ fontSize: 20, color: C.muted }}>{out}</span>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Notre fil rouge : <span style={{ color: BRAND.coffee }}>Ardente</span>, torréfacteur lyonnais
    </Title>
    <Lede>Une marque fictive, des problèmes très réels. Vous pourrez aussi travailler sur votre propre entreprise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 880, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 4 }}>
        <BrandDot size={64} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: BRAND.dark }}>Ardente · café de spécialité</div>
          <div style={{ fontSize: 21, color: C.muted }}>14 salariés · torréfaction lente · relation directe avec les producteurs</div>
        </div>
      </div>
      <OFact icon="cart" tone="yellow" title="Trois offres" d={150}>
        E-shop (grains et moulu) · abonnement « Ardente Box » · <strong>Ardente Bureau</strong> : le café en entreprise
      </OFact>
      <OFact icon="megaphone" tone="blue" title="Quatre canaux" d={250}>
        Instagram 8 000 abonnés · LinkedIn 2 000 · newsletter 12 000 inscrits · site et blog
      </OFact>
      <OFact icon="clock" tone="coral" title="Le problème" d={350}>
        Une seule chargée de communication, 12 contenus par semaine à produire, aucune analyse des résultats.
      </OFact>
      <OFact icon="flag" tone="green" title="La mission du jour" d={450}>
        Lancer <strong>Ardente Bureau</strong> auprès des entreprises lyonnaises, en novembre.
      </OFact>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1060, top: 270, width: 740, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Carnet de campagne
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OLog n={1} tone="blue" title="Les bons outils" out="et leurs limites" d={300} />
        <OLog n={2} tone="violet" title="Cible & idées" out="persona, ligne, calendrier" d={380} />
        <OLog n={3} tone="teal" title="Contenus" out="une idée, plusieurs textes" d={460} />
        <OLog n={4} tone="pink" title="Visuels" out="brief et concept de campagne" d={540} />
        <OLog n={5} tone="green" title="Déclinaisons" out="six canaux, plusieurs cibles" d={620} />
        <OLog n={6} tone="yellow" title="Analyse" out="ce qui marche, quoi tester" d={700} />
      </div>
      <div className={A.fade} style={{ marginTop: 22, paddingTop: 18, borderTop: `1.5px solid ${C.rule}`, fontSize: 22, color: C.soft, lineHeight: 1.4, ...dl(800) }}>
        <strong style={{ color: C.navy }}>16:05 · Projet final</strong> : vous assemblez tout en une mini-campagne.
      </div>
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice en fin de journée.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Citer trois usages concrets de l’IA dans mon métier</CheckItem>
        <CheckItem id="ap2">Écrire un prompt qui donne un résultat utilisable du premier coup</CheckItem>
        <CheckItem id="ap3">Faire générer un persona et un calendrier éditorial crédibles</CheckItem>
        <CheckItem id="ap4">Transformer une idée en post, email, article et script vidéo</CheckItem>
        <CheckItem id="ap5">Rédiger un prompt d’image et un brief créatif</CheckItem>
        <CheckItem id="ap6">Adapter un même message à LinkedIn, Instagram et une newsletter</CheckItem>
        <CheckItem id="ap7">Faire analyser des avis clients ou des résultats de campagne</CheckItem>
        <CheckItem id="ap8">Repérer une erreur, un biais ou un risque juridique dans un texte d’IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Utilisateur : on va structurer et fiabiliser.', tone: 'blue' },
            { min: 6, text: 'Avancé : visez les bonus de chaque atelier.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression à 17:00.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Règles du jeu & outils ─────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : vos outils et nos règles du jeu</Title>
    <Lede>Un seul assistant IA suffit : prenez celui que votre entreprise autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA ouvert : ChatGPT, Copilot, Gemini, Claude ou Le Chat</CheckItem>
        <CheckItem id="su2" size={26}>Un outil d’image : Canva, Adobe Firefly, Copilot ou l’image de votre assistant</CheckItem>
        <CheckItem id="su3" size={26}>Un tableur (Excel ou Google Sheets) pour le calendrier et l’analyse</CheckItem>
        <CheckItem id="su4" size={26}>Un document vierge : votre « bibliothèque de prompts » de la journée</CheckItem>
        <CheckItem id="su5" size={26}>Votre charte éditoriale ou graphique, si vous en avez une</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée client réelle, aucun fichier confidentiel dans un outil grand public. Aujourd’hui : données fictives.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Poll, O_Objectifs, O_Programme, O_FilRouge, O_AutoPos, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir et poser la promesse : produire plus vite sans perdre la qualité ni la voix de la marque.

DIRE — « Bonjour à toutes et à tous, bienvenue. Aujourd’hui, on va apprendre à faire de l’IA un vrai membre de l’équipe marketing. Regardez le schéma à droite : une seule idée, et six contenus qui en sortent, un article, un post LinkedIn, une publication Instagram, une newsletter, des visuels, un script vidéo. C’est exactement ce que vous saurez faire ce soir. Pas de magie : une méthode, des prompts, et votre regard de professionnel. »

TRANSITION — « Je me présente rapidement, et je vous dis comment va se passer la journée. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Fixer le contrat pédagogique : beaucoup de pratique, des livrables réutilisables.

DIRE — « Je suis Houssem Eddine LASSOUED… » (se présenter en 3 phrases : parcours, usage de l’IA dans des équipes marketing, ce qui vous passionne). « Sept heures, dont la moitié en ateliers. Six modules, chacun se termine par quelque chose que vous pourrez réutiliser lundi. Et à 16 heures, vous assemblez tout en une mini-campagne. Le contrat : je montre, vous tenez le clavier. Et retenez notre fil conducteur : l’IA propose, le marketeur dispose. »

INSISTER — Public débutant : rassurer. « Aucun prérequis technique. Si vous savez rédiger un brief à un stagiaire, vous savez écrire un prompt. »

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les métiers et le niveau d’usage pour adapter les exemples et former des binômes.

DIRE — « Premier vote : votre métier. » Compter les mains, cliquer une ligne par vote. « Deuxième vote : votre usage de l’IA aujourd’hui. Pas de jugement : si vous avez essayé et été déçus, c’est très normal, et c’est même le meilleur point de départ. On va voir pourquoi les résultats étaient décevants. »

ANIMATION — Demander à 2 ou 3 personnes « déçues » ce qu’elles avaient demandé : en général un prompt d’une ligne. Le noter au tableau, on le réutilisera en M2. Former des binômes mixtes (contenu + stratégie).

TRANSITION — « Voici ce que vous saurez faire en partant. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les huit objectifs du programme, regroupés en quatre gestes.

DIRE — « Le programme compte huit objectifs. Pour les retenir, je les range en quatre gestes. Comprendre : à quoi sert l’IA dans nos métiers, et comment s’en servir pour réfléchir, pas seulement pour écrire. Créer : des textes de tous formats, des briefs et des visuels. Adapter : un même contenu pour plusieurs publics et plusieurs canaux. Et enfin analyser et garantir : exploiter les données et les avis, et surtout vérifier ce que l’IA produit, parce que c’est votre signature qui est en bas du post, pas la sienne. »

TRANSITION — « Voici comment on enchaîne tout ça dans la journée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée et les horaires.

DIRE — « Le matin, on pense et on écrit : comprendre l’IA, définir une cible et des idées, puis produire des contenus. L’après-midi, on montre et on mesure : visuels, déclinaisons multicanales, analyse. Et à 16:05, le projet final : une mini-campagne complète. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Horaires indicatifs : ajuster au rythme du groupe. Pauses 11:10 et 15:10, déjeuner 12:30 – 13:30.

TRANSITION — « Toute la journée, on suivra une marque : Ardente. »`,
  `⏱ 3 min · FIL ROUGE ARDENTE

OBJECTIF — Installer le cas fil rouge qui servira à tous les exemples et ateliers.

DIRE — « Ardente est une marque fictive : un torréfacteur lyonnais de café de spécialité. Trois offres : l’e-shop, un abonnement, et une nouvelle offre B2B, Ardente Bureau, le café en entreprise. Le problème est très réel : une seule chargée de communication, douze contenus par semaine, et personne pour analyser les résultats. La mission du jour : lancer Ardente Bureau en novembre. À droite, le carnet de campagne : chaque module ajoute une pièce. Si vous préférez travailler sur votre propre entreprise, c’est possible, avec des informations non confidentielles. »

ANIMATION — Demander : « Qui veut travailler sur sa propre marque ? » Noter les volontaires.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Notez votre score sur un coin de feuille : on refera exactement le même exercice à 17 heures. »

ANIMATION — Laisser chacun noter sur papier, puis faire cocher un volontaire à l’écran. Repérer les scores élevés : leur proposer les bonus d’atelier.

TRANSITION — « Dernière étape : vérifions vos outils. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les accès aux outils et poser la règle de confidentialité.

DIRE — « Trois minutes. Un seul assistant IA suffit : celui que votre entreprise autorise. Pour les images, Canva, Firefly ou l’outil intégré à votre assistant. Ouvrez aussi un document vierge : ce sera votre bibliothèque de prompts. Chaque prompt qui fonctionne aujourd’hui, vous le collez dedans. Et la règle d’or : aucune donnée client réelle, aucun document confidentiel dans un outil grand public. Ce que vous tapez peut être conservé, voire utilisé pour entraîner le modèle selon l’offre. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si un compte manque, le binôme partage un poste.

TRANSITION — « Tout le monde est prêt ? Module 1 : comprendre l’IA dans le marketing. »`,
];
// @@NOTES-END
