// ─── Ouverture ──────────────────────────────────────────────────────────────

// Vertical recruitment pipeline on the cover: one dot travels down the steps.
const OStep = ({ icon, tone, label, sub, y, d, human = false }: { icon: IconName; tone: Tone; label: string; sub: string; y: number; d: number; human?: boolean }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 420, display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} solid style={{ boxShadow: '0 0 0 6px var(--osd-bg)' }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: T[tone].fg }}>{sub}</div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{label}</div>
    </div>
    {human ? (
      <span title="Décision humaine" style={{ flex: 'none', width: 40, height: 40, borderRadius: 999, background: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="humanCheck" size={24} color="#fff" />
      </span>
    ) : null}
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
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 82, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        L’IA pour les
        <br />
        <span style={{ color: C.plum }}>ressources humaines</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Recruter, communiquer et gérer les talents avec l’IA, <strong style={{ color: C.navy }}>en gardant la main sur chaque décision</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · usages responsables</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={19}>
          <Icon name="megaphone" size={19} /> Offres
        </Tag>
        <Tag tone="teal" size={19}>
          <Icon name="search" size={19} /> Présélection
        </Tag>
        <Tag tone="violet" size={19}>
          <Icon name="chat" size={19} /> Entretiens
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="graduation" size={19} /> Talents
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1400, top: 130, width: 420, height: 780 }}>
      <svg width={64} height={780} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 742" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 742" dur={3.6} r={8} color={C.electric} />
      </svg>
      <OStep icon="briefcase" tone="navy" sub="Besoin" label="Un poste à pourvoir" y={0} d={400} />
      <OStep icon="megaphone" tone="blue" sub="Offre" label="L’IA rédige, vous ajustez" y={142} d={500} />
      <OStep icon="search" tone="teal" sub="Présélection" label="L’IA documente les CV" y={284} d={600} human />
      <OStep icon="chat" tone="violet" sub="Entretien" label="Questions et grille prêtes" y={426} d={700} human />
      <OStep icon="mail" tone="green" sub="Communication" label="Chaque candidat a sa réponse" y={568} d={800} />
      <OStep icon="graduation" tone="pink" sub="Intégration" label="Un parcours sur mesure" y={710} d={900} />
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
    <Title>Bienvenue ! Gagner du temps, sans perdre la main</Title>
    <Lede>L’IA ne remplace ni votre jugement ni votre relation aux candidats. Elle vous rend le temps de les exercer.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="pour couvrir tout le cycle RH : de l’offre d’emploi au développement des collaborateurs" tone="blue" d={150} />
      <OPromise value={<CountUp to={5} />} label="ateliers pratiques sur un cas fil rouge, avec des données 100 % fictives" tone="violet" d={280} />
      <OPromise value={<CountUp to={20} suffix="+" />} label="prompts RH prêts à réutiliser dès demain dans votre service" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Je montre, vous pratiquez : chaque module se termine par un livrable que vous gardez. Et une règle qui ne bouge pas de la journée :{' '}
        <strong>l’IA propose, le professionnel RH décide</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Posez vos questions à tout moment : vos cas réels nourrissent les exemples (anonymisés, bien sûr).
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous, d’où partez-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon métier
      </Eyebrow>
      <Poll>
        <PollRow id="o-m1" label="Chargé·e de recrutement / talent acquisition" tone="blue" icon="search" />
        <PollRow id="o-m2" label="Assistant·e RH / gestionnaire RH" tone="teal" icon="folder" />
        <PollRow id="o-m3" label="Responsable RH / RRH généraliste" tone="violet" icon="org" />
        <PollRow id="o-m4" label="Consultant·e en recrutement (cabinet)" tone="yellow" icon="briefcase" />
        <PollRow id="o-m5" label="Manager ou autre fonction" tone="grey" icon="users" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage de l’IA aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais essayé" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="Quelques essais, à titre personnel" tone="teal" icon="chat" />
        <PollRow id="o-u3" label="De temps en temps au travail" tone="blue" icon="briefcase" />
        <PollRow id="o-u4" label="Tous les jours, outil fourni par l’entreprise" tone="green" icon="rocket" />
        <PollRow id="o-u5" label="On me l’interdit / je ne sais pas si j’ai le droit" tone="coral" icon="lock" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Les binômes mélangent les profils : un·e recruteur·se avec un·e généraliste si possible.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OGoal = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs : à la fin de la journée, vous saurez…</Title>
    <Lede>Huit objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="shieldCheck" tone="coral" title="Comprendre & encadrer" d={100}>
        <Bullet size={23} tone="coral">Situer les usages de l’IA générative dans les fonctions RH et recrutement</Bullet>
        <Bullet size={23} tone="coral">Identifier les risques : biais, confidentialité, données personnelles</Bullet>
      </OGoal>
      <OGoal icon="megaphone" tone="blue" title="Attirer" d={220}>
        <Bullet size={23}>Rédiger et optimiser des offres d’emploi attractives et ciblées</Bullet>
        <Bullet size={23}>Structurer et préparer une recherche de candidats</Bullet>
      </OGoal>
      <OGoal icon="search" tone="teal" title="Évaluer" d={340}>
        <Bullet size={23} tone="teal">Analyser et synthétiser des candidatures, en aide à la décision</Bullet>
        <Bullet size={23} tone="teal">Préparer des entretiens : questions, grilles, mises en situation</Bullet>
      </OGoal>
      <OGoal icon="users" tone="green" title="Communiquer & accompagner" d={460}>
        <Bullet size={23} tone="green">Générer des communications personnalisées pour candidats et collaborateurs</Bullet>
        <Bullet size={23} tone="green">Faciliter intégration, développement et suivi des collaborateurs</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz par module, livrables d’atelier, cas pratique final, auto-positionnement en début et en fin de journée.
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
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
      <OHalf icon="megaphone" tone="blue" title="Matin · Attirer et sélectionner" sub="Du besoin au choix des candidats à rencontrer" d={0}>
        <OSlot t="9:00" title="Ouverture · le cas fil rouge" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="L’IA dans les RH" sub="Usages, limites, premier prompt RH" tone="blue" d={230} />
        <OSlot t="10:00" mod="M2" title="Rédiger des offres d’emploi" sub="Profil, compétences, plateformes · atelier offre" tone="violet" d={310} />
        <OSlot t="10:50" title="Pause" tone="grey" d={350} />
        <OSlot t="11:05" mod="M3" title="Recherche et présélection" sub="Critères, grille, analyse de CV · atelier" tone="teal" d={390} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={470} />
      </OHalf>
      <OHalf icon="users" tone="green" title="Après-midi · Échanger et accompagner" sub="Des entretiens aux collaborateurs, en toute conformité" d={200}>
        <OSlot t="13:30" mod="M4" title="Préparer et conduire les entretiens" sub="Guide, questions, grille · simulation" tone="navy" d={350} />
        <OSlot t="14:40" mod="M5" title="Communication avec les candidats" sub="Sept moments clés · bibliothèque de messages" tone="green" d={430} />
        <OSlot t="15:25" title="Pause" tone="grey" d={470} />
        <OSlot t="15:40" mod="M6" title="Gérer et développer les collaborateurs" sub="Entretiens annuels, formation, parcours" tone="yellow" d={510} />
        <OSlot t="16:15" mod="M7" title="Éthique, confidentialité et projet final" sub="RGPD, biais, cas pratique de bout en bout" tone="coral" d={590} />
        <OSlot t="17:20" title="Bilan et clôture" tone="grey" d={670} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 925, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M7 l’après-midi.
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
        <CheckItem id="ap1">Écrire un prompt structuré (rôle, contexte, tâche, format) pour une tâche RH</CheckItem>
        <CheckItem id="ap2">Faire rédiger une offre d’emploi et la décliner pour plusieurs plateformes</CheckItem>
        <CheckItem id="ap3">Construire une grille de critères objective avant de lire les CV</CheckItem>
        <CheckItem id="ap4">Faire résumer un CV par l’IA sans lui déléguer la décision</CheckItem>
        <CheckItem id="ap5">Générer un guide d’entretien et simuler un entretien avec l’IA</CheckItem>
        <CheckItem id="ap6">Produire des messages candidats personnalisés à partir d’un modèle</CheckItem>
        <CheckItem id="ap7">Préparer un entretien annuel ou un plan de développement avec l’IA</CheckItem>
        <CheckItem id="ap8">Dire ce qu’on n’a pas le droit de confier à l’IA (RGPD, discrimination)</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Premiers usages : on va structurer et sécuriser.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus des ateliers.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Notez votre score : il servira de référence pour mesurer votre progression ce soir.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le cas fil rouge ───────────────────────────────────────────────────────
const OJob = ({ icon, tone, title, lines, d }: { icon: IconName; tone: Tone; title: string; lines: string[]; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '20px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {lines.map((l) => (
        <Tag key={l} tone="grey" size={19}>
          {l}
        </Tag>
      ))}
    </div>
  </div>
);

const OLog = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <Num n={`M${n}`} tone={tone} size={40} style={{ fontSize: 16 }} />
    <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>{title}</span>
      <span style={{ fontSize: 20, color: C.muted }}>{out}</span>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Notre cas fil rouge : <span style={{ color: C.green }}>{PME}</span>, une PME qui recrute
    </Title>
    <Lede>Entreprise, personnes et documents inventés : transposez librement à votre contexte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 880, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={A.in} style={{ display: 'flex', gap: 16 }}>
        <Stat value={<CountUp to={240} />} label="salariés, Nantes et Angers" size={72} tone="navy" style={{ flex: 1 }} />
        <Stat value={<CountUp to={35} />} label="recrutements prévus cette année" size={72} tone="blue" style={{ flex: 1 }} />
        <Stat value={<CountUp to={2} />} label="personnes au service RH" size={72} tone="coral" style={{ flex: 1 }} />
      </div>
      <div className={A.in} style={{ fontSize: 24, lineHeight: 1.45, color: C.soft, ...dl(100) }}>
        {PME} installe et entretient des pompes à chaleur et des panneaux solaires chez les particuliers et les entreprises. Deux postes sont ouverts :
      </div>
      <OJob icon="phone" tone="teal" title={JOB_A} lines={['CDI', 'Nantes', 'Plateau de 12 personnes', 'Débutant accepté']} d={200} />
      <OJob icon="code" tone="violet" title={JOB_B} lines={['CDI', 'Hybride 2 j / semaine', 'Portail client', '3 ans d’expérience']} d={320} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1060, top: 270, width: 740, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Ce que vous allez produire
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 15 }}>
        <OLog n={1} tone="blue" title="Premier prompt RH" out="la méthode en 5 ingrédients" d={300} />
        <OLog n={2} tone="violet" title="Offre d’emploi" out="+ déclinaisons par plateforme" d={360} />
        <OLog n={3} tone="teal" title="Grille de critères" out="+ synthèses de CV argumentées" d={420} />
        <OLog n={4} tone="navy" title="Guide d’entretien" out="+ grille d’évaluation, simulation" d={480} />
        <OLog n={5} tone="green" title="Bibliothèque de messages" out="7 modèles du parcours candidat" d={540} />
        <OLog n={6} tone="yellow" title="Parcours d’intégration" out="et préparation d’entretien annuel" d={600} />
        <OLog n={7} tone="coral" title="Dossier de recrutement" out="complet, vérifié, conforme" d={660} />
      </div>
    </div>
  </Frame>
);

// ─── Check-up & règles du jeu ───────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : vos outils et nos règles du jeu</Title>
    <Lede>Un seul assistant IA suffit : prenez celui que votre entreprise autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA ouvert : Copilot, ChatGPT, Gemini, Claude, Le Chat…</CheckItem>
        <CheckItem id="su2" size={26}>De préférence le compte professionnel fourni par l’entreprise</CheckItem>
        <CheckItem id="su3" size={26}>Un traitement de texte pour garder vos livrables de la journée</CheckItem>
        <CheckItem id="su4" size={26}>Les pièces du cas Solvéa : besoins, CV, notes (toutes dans ce support)</CheckItem>
        <CheckItem id="su5" size={26}>Papier et stylo pour les grilles et les simulations</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle de candidat ou de salarié dans un outil IA pendant la formation. Nous travaillons sur des données fictives.
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

OBJECTIF — Accueillir le groupe et poser l’intention de la journée.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va voir comment l’IA générative peut vous aider à recruter, à communiquer et à accompagner les collaborateurs. Regardez le parcours à droite : un besoin de recrutement, une offre, une présélection, un entretien, des messages aux candidats, puis l’intégration. L’IA peut intervenir à chaque étape. Mais vous voyez ces deux pastilles roses ? Ce sont les moments de décision. Ils restent humains. C’est le fil conducteur de la journée. »

ANIMATION — Laisser la page affichée pendant l’installation. Le point qui descend le long du parcours illustre le cycle complet que nous allons parcourir.

TRANSITION — « Quelques mots sur la journée et sur moi. »`,
  `⏱ 3 min · BIENVENUE

OBJECTIF — Se présenter, annoncer la promesse et le contrat pédagogique.

DIRE — « Je m’appelle Houssem Eddine Lassoued, j’accompagne des équipes métier dans l’usage concret et responsable de l’IA. Sept heures, cinq ateliers sur un cas fil rouge, et plus de vingt prompts que vous pourrez réutiliser dès demain. Le contrat : je montre, vous pratiquez. Et une règle qui ne bougera pas de la journée : l’IA propose, le professionnel RH décide. »

INSISTER — Public débutant : rassurer. Aucun prérequis technique, on part de zéro.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les métiers et le niveau d’usage pour adapter les exemples et former les binômes.

DIRE — « Premier vote : votre métier. » Compter les mains, cliquer une fois par vote. « Deuxième vote : votre usage de l’IA aujourd’hui. Pas de jugement : jamais essayé, c’est très bien, vous êtes au bon endroit. Et si vous ne savez pas si vous avez le droit d’utiliser l’IA au travail, c’est une vraie question : on y répondra au module 7. »

ANIMATION — Noter les personnes qui utilisent déjà l’IA tous les jours : les placer en binôme avec des débutants. Repérer celles qui ont une interdiction : leur proposer de travailler sur papier avec leur binôme.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les huit objectifs officiels, regroupés en quatre gestes.

DIRE — « Le programme compte huit objectifs. Je les range en quatre gestes. Comprendre et encadrer : savoir à quoi sert l’IA en RH, et quels risques elle fait courir. Attirer : rédiger des offres et préparer une recherche de candidats. Évaluer : analyser des candidatures et préparer des entretiens, toujours en aide à la décision. Communiquer et accompagner : les messages aux candidats et aux collaborateurs, l’intégration, le développement. »

TRANSITION — « Comment la journée est organisée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé et les repères horaires.

DIRE — « Le matin, on attire et on sélectionne : les usages, puis les offres d’emploi, puis la présélection. L’après-midi, on échange et on accompagne : les entretiens, la communication avec les candidats, la gestion des collaborateurs, et on termine par l’éthique, le RGPD et un cas pratique de bout en bout. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Horaires indicatifs : ajuster au rythme du groupe.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par objectif. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Notez votre score sur un coin de feuille : on refera exactement le même exercice ce soir. »

ANIMATION — Faire cocher un volontaire à l’écran ou laisser chacun noter sur papier. Les scores élevés : proposer les bonus des ateliers.

TRANSITION — « Faisons connaissance avec l’entreprise qui va nous accompagner toute la journée. »`,
  `⏱ 3 min · LE CAS FIL ROUGE SOLVÉA

OBJECTIF — Installer le cas fictif qui servira à tous les exemples et ateliers.

DIRE — « Solvéa est une PME fictive : 240 salariés à Nantes et Angers, elle installe et entretient des pompes à chaleur et des panneaux solaires. Trente-cinq recrutements prévus cette année, et un service RH de deux personnes. Autrement dit : beaucoup de travail répétitif et peu de temps. Deux postes sont ouverts : un ou une chargée de relation client, poste ouvert aux débutants, et un ou une développeuse web pour le portail client. À droite, ce que vous allez produire, module par module, jusqu’au dossier de recrutement complet. »

INSISTER — Les participants qui le souhaitent peuvent transposer à un poste de leur entreprise, à condition de n’utiliser que des données fictives.

TRANSITION — « Dernière étape : vérifions les outils. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les outils et poser la règle de confidentialité.

DIRE — « Trois minutes : cochez chaque ligne. Un seul assistant IA suffit, idéalement celui que votre entreprise fournit, parce que les comptes professionnels offrent en général des garanties sur l’utilisation des données. Et la règle d’or : aucune donnée réelle de candidat ou de salarié dans un outil IA aujourd’hui. Tout le dossier Solvéa est fictif. »

ANIMATION — Lancer le minuteur, passer dans les rangs. Les pièces du cas Solvéa (besoins, CV, notes) sont toutes dans ce support : partager l’export PDF si les participants veulent copier les textes. Si quelqu’un n’a pas d’accès, il travaille avec son binôme.

TRANSITION — « Tout le monde est prêt ? Module 1 : l’IA dans les RH. »`,
];
// @@NOTES-END
