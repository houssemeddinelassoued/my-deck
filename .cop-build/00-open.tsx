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
          <Icon name="bolt" size={22} /> Niveau avancé
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
        GitHub Copilot
        <br />
        <span style={{ color: C.plum }}>niveau avancé</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1000, ...dl(240) }}>
        Prompts structurés, architectures, tests, refactoring, sécurité et travail d’équipe :
        passer de l’assistant qu’on utilise à <strong style={{ color: C.navy }}>l’outil qu’on maîtrise</strong>.
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
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au développement</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={19}>
          <Icon name="chat" size={19} /> Prompts
        </Tag>
        <Tag tone="pink" size={19}>
          <Icon name="flask" size={19} /> Tests
        </Tag>
        <Tag tone="coral" size={19}>
          <Icon name="shield" size={19} /> Sécurité
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="users" size={19} /> Équipe
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
    <Title>Bienvenue ! Une journée pour passer un cap</Title>
    <Lede>Vous utilisez déjà Copilot. Aujourd’hui, on le pousse dans ses retranchements… et on apprend à s’en méfier.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de formation intensive : 60 % d’apports et de démos, 40 % de pratique" tone="blue" d={150} />
      <OPromise value={<CountUp to={6} />} label="TP enchaînés sur le même projet fil rouge, du prompt à la CI" tone="green" d={280} />
      <OPromise value={<CountUp to={1} />} label="feature complète (code, tests, doc, sécurité) défendue devant le groupe" tone="violet" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec des prompts éprouvés, des fichiers d’équipe réutilisables et une méthode de vérification.
        Le formateur montre, vous pratiquez : <strong>c’est vous qui tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « Copilot propose, le développeur dispose… et prouve. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous, qu’attendez-vous ?</Title>
    <Lede>Main levée (ou réaction dans le chat) : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 760 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ma stack pour les TP
      </Eyebrow>
      <Poll>
        <PollRow id="o-s1" label="TypeScript / Node" tone="blue" icon="code" />
        <PollRow id="o-s2" label="Python" tone="yellow" icon="code" />
        <PollRow id="o-s3" label="Java / Kotlin" tone="coral" icon="code" />
        <PollRow id="o-s4" label="C# / .NET" tone="violet" icon="code" />
        <PollRow id="o-s5" label="Autre (Go, PHP…)" tone="grey" icon="plus" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 940, top: 270, width: 860, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon attente n° 1
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="Des prompts qui marchent du premier coup" tone="blue" icon="chat" />
        <PollRow id="o-a2" label="Générer des modules propres et cohérents" tone="teal" icon="layers" />
        <PollRow id="o-a3" label="Des tests générés qui servent vraiment" tone="pink" icon="flask" />
        <PollRow id="o-a4" label="Refactorer et moderniser du legacy" tone="violet" icon="wand" />
        <PollRow id="o-a5" label="Sécuriser le code produit par l’IA" tone="coral" icon="shield" />
        <PollRow id="o-a6" label="Cadrer l’usage dans mon équipe" tone="green" icon="users" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Les binômes se forment par stack : même langage, deux profils différents si possible.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={52} />
    <div style={{ fontSize: 28, lineHeight: 1.32, color: C.ink }}>{children}</div>
  </div>
);

const OBar = ({ label, value, pct, bg, c, d }: { label: string; value: string; pct: number; bg: string; c: string; d: number }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.ink }}>
      <span>{label}</span>
      <strong style={{ color: c }}>{value}</strong>
    </div>
    <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: '100%', background: bg, ...dl(d) }} />
    </div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs de la formation</Title>
    <Lede>À l’issue de la journée, vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Maîtriser le prompt engineering avancé</strong> pour des suggestions de qualité
      </OObj>
      <OObj n={2} tone="teal" d={200}>
        <strong>Générer des architectures et modules</strong> complexes et maintenables
      </OObj>
      <OObj n={3} tone="pink" d={300}>
        <strong>Automatiser les tests</strong> unitaires, d’intégration et les mocks
      </OObj>
      <OObj n={4} tone="violet" d={400}>
        <strong>Optimiser, sécuriser et auditer</strong> le code généré par l’IA
      </OObj>
      <OObj n={5} tone="green" d={500}>
        <strong>Intégrer Copilot</strong> dans les workflows CI/CD et les pratiques d’équipe
      </OObj>
      <OObj n={6} tone="coral" d={600}>
        <strong>Identifier et contourner les limites</strong> de Copilot sur les projets complexes
      </OObj>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 260, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
      <Eyebrow c={C.navy}>Équilibre de la journée</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <OBar label="Apports, démos, cas réels" value="60 %" pct={60} bg={G.blue} c={C.blue} d={600} />
        <OBar label="TP et mises en situation" value="40 %" pct={40} bg={G.green} c={C.green} d={750} />
      </div>
      <div style={{ marginTop: 28, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
        Évaluation continue : questions orales, QCM à chaque module, TP, soutenance finale. Auto-positionnement au début et à la fin.
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
      <OHalf icon="chat" tone="blue" title="Matinée" sub="Prompt engineering et génération avancée" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT}`} tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Prompt engineering avancé" sub="Contexte, prompts structurés, multi-étapes · TP 1" tone="blue" d={250} />
        <OSlot t="10:30" title="Pause" tone="yellow" d={330} />
        <OSlot t="10:45" mod="M2" title="Modules & architectures" sub="Arborescence, API REST, patterns · TP 2" tone="teal" d={400} />
        <OSlot t="11:40" mod="M3" title="Automatiser les tests" sub="Unitaires, mocks, intégration, couverture · TP 3" tone="pink" d={500} />
      </OHalf>
      <OHalf icon="shieldCheck" tone="violet" title="Après-midi" sub="Sécurité, optimisation et intégration équipe" d={200}>
        <OSlot t="13:30" title="Reprise · quiz flash de la matinée" tone="grey" d={450} />
        <OSlot t="13:40" mod="M4" title="Optimisation & refactoring" sub="Anti-patterns, SOLID, performance, legacy · TP 4" tone="violet" d={550} />
        <OSlot t="14:30" mod="M5" title="Sécurité & audit" sub="OWASP, failles du code généré, licences · TP 5" tone="coral" d={650} />
        <OSlot t="15:40" mod="M6" title="Copilot en équipe" sub="Conventions, PR, CI/CD, mesure, charte · TP 6" tone="green" d={750} />
        <OSlot t="16:30" title="Soutenances · synthèse · évaluation" tone="navy" d={850} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 l’après-midi.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, honnêtement. On refera l’exercice en fin de journée.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1" size={27}>Expliquer ce que Copilot « voit » quand il propose une complétion</CheckItem>
        <CheckItem id="ap2" size={27}>Découper une tâche complexe en une suite de prompts vérifiables</CheckItem>
        <CheckItem id="ap3" size={27}>Faire générer un module qui respecte l’architecture existante</CheckItem>
        <CheckItem id="ap4" size={27}>Obtenir des tests qui couvrent cas limites et cas négatifs</CheckItem>
        <CheckItem id="ap5" size={27}>Refactorer du code généré en appliquant SOLID, tests au vert</CheckItem>
        <CheckItem id="ap6" size={27}>Repérer une injection ou un contrôle d’accès manquant dans une suggestion</CheckItem>
        <CheckItem id="ap7" size={27}>Partager instructions et prompts d’équipe via le dépôt</CheckItem>
        <CheckItem id="ap8" size={27}>Mesurer l’apport réel de Copilot sur une équipe</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Utilisateur régulier : on va structurer.', tone: 'grey' },
            { min: 3, text: 'Utilisateur confirmé : on va industrialiser.', tone: 'blue' },
            { min: 6, text: 'Expert : visez les bonus de chaque TP.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression à 16:50.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le fil rouge SalleLibre ────────────────────────────────────────────────
const OFeat = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const OStep = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <Num n={n} tone={tone} size={44} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{out}</div>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.green }}>{PROJECT}</span>, l’API de réservation de salles
    </Title>
    <Lede>Une seule base de code toute la journée : chaque TP s’appuie sur le précédent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <OFeat icon="map" tone="blue" title="Salles" d={100}>
        Catalogue, capacité, équipements · CRUD réservé aux admins
      </OFeat>
      <OFeat icon="calendar" tone="violet" title="Réservations" d={200}>
        Créneaux sans chevauchement, heures ouvrées, annulation
      </OFeat>
      <OFeat icon="lock" tone="coral" title="Authentification JWT et rôles" d={300}>
        Membre ou admin · chacun ne gère que ses réservations
      </OFeat>
      <OFeat icon="search" tone="teal" title="Recherche de salles libres" d={400}>
        Par date, durée, capacité : le cœur algorithmique
      </OFeat>
      <OFeat icon="doc" tone="green" title="Documentation OpenAPI" d={500}>
        Générée, relue, à jour
      </OFeat>
      <div className={A.fade} style={{ display: 'flex', gap: 10, marginTop: 4, ...dl(700) }}>
        <Tag tone="navy" size={19}>TypeScript · Express</Tag>
        <Tag tone="navy" size={19}>Python · FastAPI</Tag>
        <Tag tone="navy" size={19}>Java · Spring Boot</Tag>
        <Tag tone="navy" size={19}>C# · ASP.NET Core</Tag>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1060, top: 270, width: 740, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Votre parcours
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OStep n={1} tone="blue" title="Prompts avancés" out="Bibliothèque de prompts mesurés" d={300} />
        <OStep n={2} tone="teal" title="API complète" out="Routes, auth, validation, OpenAPI" d={400} />
        <OStep n={3} tone="pink" title="Suite de tests" out="Unitaires, mocks, intégration" d={500} />
        <OStep n={4} tone="violet" title="Refactoring" out="SOLID, performance, tests au vert" d={600} />
        <OStep n={5} tone="coral" title="Audit de sécurité" out="Failles trouvées, prouvées, corrigées" d={700} />
        <OStep n={6} tone="green" title="Feature défendue" out="PR, CI, documentation, soutenance" d={800} />
      </div>
    </div>
  </Frame>
);

// ─── Check-up technique ─────────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up technique : trois minutes avant de coder</Title>
    <Lede>Tout ce qui n’est pas prêt maintenant vous coûtera dix minutes en plein TP.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>VS Code à jour, extension GitHub Copilot connectée (Chat inclus)</CheckItem>
        <CheckItem id="su2" size={26}>Vue Chat : modes Ask, Plan et Agent visibles, sélecteur de modèle actif</CheckItem>
        <CheckItem id="su3" size={26}>Runtime de votre stack : Node 22, Python 3.12, JDK 21 ou .NET 8+</CheckItem>
        <CheckItem id="su4" size={26}>Framework de test prêt : Jest/Vitest, pytest, JUnit 5 ou xUnit</CheckItem>
        <CheckItem id="su5" size={26}>Dépôt Git « sallelibre » initialisé, premier commit poussé</CheckItem>
        <CheckItem id="su6" size={26}>Binôme formé : un pilote au clavier, un copilote qui relit</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Zéro code client, zéro secret, zéro donnée personnelle dans un prompt. {PROJECT} est fait pour ça.
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

OBJECTIF — Accueillir, poser le niveau : ce n’est pas une découverte de Copilot.

DIRE — « Bonjour à toutes et à tous. Cette journée s’adresse à des développeurs qui utilisent déjà GitHub Copilot au quotidien. On ne va pas apprendre à appuyer sur Tab : on va apprendre à obtenir du code qu’on peut défendre en revue. Prompts structurés, architectures, tests, refactoring, sécurité et travail d’équipe. »

ANIMATION — Laisser la page affichée pendant l’installation.

TRANSITION — « Quelques mots sur la journée et sur ce que vous allez produire. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Donner la promesse chiffrée et le contrat pédagogique.

DIRE — « Sept heures, dont environ 40 % de pratique : six TP qui s’enchaînent sur le même projet. Le TP 2 produit une API, le TP 3 la teste, le TP 4 la refactore, le TP 5 l’audite, et en fin de journée chaque binôme défend une feature complète devant le groupe. Le contrat : je montre, vous pratiquez. Et le fil conducteur : Copilot propose, le développeur dispose… et prouve. Prouver, c’est le mot de la journée : des tests, des mesures, des revues. »

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les stacks pour former les binômes, et les attentes pour doser les modules.

DIRE — « Premier vote : la stack que vous utiliserez dans les TP. Les binômes se forment par langage. » Compter, cliquer. « Deuxième vote : votre attente numéro un. Chaque ligne correspond à un module de la journée. »

ANIMATION — Cliquer une ligne par main levée. Noter les deux attentes les plus fortes : y revenir explicitement dans les modules correspondants.

TRANSITION — « Voici les objectifs officiels de la formation. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les six objectifs du programme et l’équilibre de la journée.

DIRE — « Six objectifs, un par module, à une nuance près : le sixième — identifier et contourner les limites de Copilot — est transversal. Chaque module se termine par un QCM et un TP. L’équilibre annoncé : 60 % d’apports et de démonstrations, 40 % de pratique. Évaluation continue, et auto-positionnement au début et à la fin pour mesurer votre progression. »

TRANSITION — « Le déroulé heure par heure. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère visuel du bandeau.

DIRE — « Le matin : prompt engineering, génération d’architectures, puis tests. L’après-midi : refactoring, sécurité, et intégration en équipe. On reprend à 13:30 par un quiz flash sur la matinée. La fin de journée est réservée aux soutenances : chaque binôme présente sa feature. Le bandeau en haut à droite vous dit toujours où on en est. »

ANIMATION — Les horaires sont indicatifs : ajuster selon le rythme du groupe.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Notez votre score : on refera exactement le même exercice en fin de journée. »

ANIMATION — Faire cocher collectivement un participant volontaire, ou laisser chacun noter sur papier. Repérer les scores très hauts : leur proposer les bonus des TP.

TRANSITION — « Parlons du projet sur lequel vous allez travailler toute la journée. »`,
  `⏱ 3 min · FIL ROUGE SALLELIBRE

OBJECTIF — Présenter le projet commun et la chaîne des TP.

DIRE — « SalleLibre est une API REST de réservation de salles de réunion. Volontairement banale : tout le monde comprend le métier, donc on peut se concentrer sur la technique. Mais elle contient tout ce qui rend Copilot intéressant… et dangereux : de la logique métier avec des cas limites — les chevauchements de créneaux —, de l’authentification et des rôles — chacun ne gère que ses réservations —, un algorithme de recherche, et de la documentation. Chaque binôme choisit sa stack. À droite, votre parcours : six TP, chacun produit quelque chose que le suivant réutilise. »

TRANSITION — « Dernière étape avant de coder : le check-up technique. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les prérequis techniques du programme : VS Code et Copilot actif.

DIRE — « Trois minutes. Vérifiez chaque ligne et cochez. Le point le plus fréquent en panne : le mode Agent absent, souvent parce que l’extension n’est pas à jour ou qu’une politique d’organisation le désactive. Et la règle d’or : aucune donnée réelle dans un prompt aujourd’hui. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si un poste n’a pas Copilot, le binôme travaille sur le poste de l’autre.

TRANSITION — « Tout le monde est prêt ? Module 1 : le prompt engineering avancé. »`,
];
// @@NOTES-END
