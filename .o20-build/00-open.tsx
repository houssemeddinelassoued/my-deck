// ─── Ouverture ──────────────────────────────────────────────────────────────

// The 20 numbered slots of the programme (Perplexity and Canva AI appear twice).
const PROG20: ToolId[] = [
  'chatgpt', 'copilot', 'gemini', 'claude', 'perplexity',
  'perplexity', 'notebooklm', 'elicit', 'consensus', 'grammarly',
  'deepl', 'canva', 'gamma', 'otter', 'fireflies',
  'notion', 'firefly', 'canva', 'runway', 'capcut',
];

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 130, width: 940 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="smile" size={22} /> Débutant · aucun prérequis
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        Les 20 outils IA
        <br />
        <span style={{ color: C.plum }}>
          qui font gagner
          <br />
          du temps
        </span>
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 27, lineHeight: 1.45, color: C.soft, maxWidth: 920, ...dl(240) }}>
        Rédiger, rechercher, analyser, résumer, créer, automatiser : apprendre à confier à l’IA{' '}
        <strong style={{ color: C.navy }}>ce qui vous prend du temps sans vous apporter de valeur</strong>.
      </p>
    </div>
    <Portrait w={160} x={390} y={720} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 610, top: 740, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · productivité augmentée</div>
    </div>
    <div style={{ position: 'absolute', left: 1390, top: 190, width: 420, display: 'grid', gridTemplateColumns: 'repeat(4, 96px)', gap: 12 }}>
      {PROG20.map((id, i) => (
        <div key={i} className={A.pop} style={{ position: 'relative', ...dl(400 + i * 55) }}>
          <ToolTile id={id} size={96} />
          <span
            style={{
              position: 'absolute',
              right: -6,
              top: -6,
              minWidth: 30,
              height: 30,
              borderRadius: 99,
              background: '#fff',
              boxShadow: SHADOW_SM,
              fontFamily: display,
              fontWeight: 800,
              fontSize: 15,
              color: C.navy,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i + 1}
          </span>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1390, top: 760, width: 420, fontSize: 20, lineHeight: 1.45, color: C.muted, ...dl(1700) }}>
      + Zapier, Make et Power Automate pour découvrir l’automatisation.
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
    <Title>Bienvenue ! Une journée pour reprendre du temps</Title>
    <Lede>Pas de jargon, pas de code : des outils concrets, testés ensemble, sur des tâches de votre quotidien.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de formation, dont plus de la moitié en pratique sur les outils" tone="blue" d={150} />
      <OPromise value={<CountUp to={20} />} label="outils IA présentés, classés par usage : écrire, chercher, résumer, créer…" tone="violet" d={280} />
      <OPromise value={<CountUp to={8} />} label="ateliers : vous repartez avec des prompts, des modèles et un plan d’action" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Aucune question n’est naïve, aucun outil n’est imposé. Je montre, <strong>vous testez sur vos propres cas</strong>, et
        chacun garde les outils qui lui servent vraiment.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur de la journée : « L’IA propose, vous disposez. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : d’où partez-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Aujourd’hui, j’utilise l’IA…
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais, je découvre" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="De temps en temps, pour essayer" tone="teal" icon="sparkles" />
        <PollRow id="o-u3" label="Chaque semaine" tone="blue" icon="calendar" />
        <PollRow id="o-u4" label="Tous les jours, pour mon travail" tone="green" icon="rocket" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce qui me prend le plus de temps
      </Eyebrow>
      <Poll>
        <PollRow id="o-t1" label="Mes emails" tone="blue" icon="mail" />
        <PollRow id="o-t2" label="Réunions et comptes rendus" tone="yellow" icon="mic" />
        <PollRow id="o-t3" label="Chercher et vérifier des informations" tone="navy" icon="search" />
        <PollRow id="o-t4" label="Documents, rapports, présentations" tone="green" icon="doc" />
        <PollRow id="o-t5" label="Visuels, vidéos, réseaux sociaux" tone="pink" icon="image" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Le second vote nous dit où mettre l’accent cet après-midi.
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
    <Lede>Neuf objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="search" tone="blue" title="Comprendre" d={100}>
        <Bullet size={22}>Les principaux usages de l’IA générative au travail</Bullet>
        <Bullet size={22}>Repérer les tâches de votre quotidien que l’IA peut alléger</Bullet>
      </OGoal>
      <OGoal icon="chat" tone="violet" title="Demander" d={220}>
        <Bullet size={22} tone="violet">Maîtriser les fondamentaux du prompting</Bullet>
        <Bullet size={22} tone="violet">Rédiger des demandes efficaces pour de meilleurs résultats</Bullet>
      </OGoal>
      <OGoal icon="rocket" tone="green" title="Produire" d={340}>
        <Bullet size={22} tone="green">Utiliser 20 outils IA adaptés à vos besoins</Bullet>
        <Bullet size={22} tone="green">Rédiger, rechercher, analyser, synthétiser, créer</Bullet>
        <Bullet size={22} tone="green">Gagner du temps sur emails, documents, réunions, présentations</Bullet>
        <Bullet size={22} tone="green">Découvrir ce que l’on peut automatiser</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Encadrer" d={460}>
        <Bullet size={22} tone="coral">Utiliser l’IA de manière responsable et sécurisée</Bullet>
        <Bullet size={22} tone="coral">Garder le contrôle humain sur ce qui compte</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : un quiz par module, huit ateliers, un mini-plan d’action personnel, auto-positionnement début / fin.
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="bulb" tone="violet" title="Matin · Comprendre et demander" sub="Les bases qui servent à tous les outils" d={0}>
        <OSlot t="9:00" title="Ouverture · vos attentes" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Découvrir l’IA et ses opportunités" sub="Usages, limites, tâches chronophages · atelier 1" tone="blue" d={230} />
        <OSlot t="10:15" title="Pause" tone="grey" d={290} />
        <OSlot t="10:30" mod="M2" title="Les fondamentaux du prompting" sub="Les 5 briques d’un bon prompt · atelier 2" tone="violet" d={350} />
        <OSlot t="11:20" mod="M3" title="Les assistants IA" sub="ChatGPT, Copilot, Gemini, Claude, Perplexity · atelier 3" tone="teal" d={410} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={470} />
      </OHalf>
      <OHalf icon="rocket" tone="green" title="Après-midi · Produire" sub="Un outil pour chaque tâche" d={200}>
        <OSlot t="13:30" mod="M4" title="Rechercher et exploiter l’information" sub="Perplexity, NotebookLM, Elicit, Consensus · cas" tone="navy" d={350} />
        <OSlot t="14:15" mod="M5" title="Rédiger plus vite, mieux" sub="Grammarly, DeepL, Canva AI, Gamma · ateliers" tone="green" d={410} />
        <OSlot t="15:05" mod="M6" title="Réunions et organisation" sub="Otter, Fireflies, Notion AI · cas · pause 15:45" tone="yellow" d={470} />
        <OSlot t="16:00" mod="M7" title="Images, vidéos et contenus" sub="Firefly, Canva AI, Runway, CapCut · atelier" tone="pink" d={530} />
        <OSlot t="16:40" mod="M8" title="Automatisation et bonnes pratiques" sub="Zapier, Make, Power Automate · atelier final" tone="coral" d={590} />
        <OSlot t="17:20" title="Bilan et clôture" tone="grey" d={650} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M8 l’après-midi.
    </div>
  </Frame>
);

// ─── La boîte à outils ──────────────────────────────────────────────────────
const OFamily = ({ icon, tone, title, mod, ids, d }: { icon: IconName; tone: Tone; title: string; mod: string; ids: ToolId[]; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 28px', minHeight: 250, boxSizing: 'border-box', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={46} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</div>
      <Tag tone={tone} size={17} style={{ marginLeft: 'auto' }}>
        {mod}
      </Tag>
    </div>
    <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: '18px 28px' }}>
      {ids.map((id, i) => (
        <ToolChip key={id} id={id} size={25} cls={A.pop} style={dl(d + 250 + i * 90)} />
      ))}
    </div>
  </div>
);

const O_Toolbox: Page = () => (
  <Frame mod={0}>
    <Title>Votre boîte à outils du jour</Title>
    <Lede>Six familles d’usages. On ne retient pas 20 noms : on retient quel outil sert à quoi.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
      <OFamily icon="chat" tone="blue" title="Assistants" mod="M3" ids={['chatgpt', 'copilot', 'gemini', 'claude', 'perplexity']} d={100} />
      <OFamily icon="search" tone="navy" title="Recherche" mod="M4" ids={['perplexity', 'notebooklm', 'elicit', 'consensus']} d={200} />
      <OFamily icon="pen" tone="green" title="Rédaction" mod="M5" ids={['grammarly', 'deepl', 'canva', 'gamma']} d={300} />
      <OFamily icon="mic" tone="yellow" title="Réunions" mod="M6" ids={['otter', 'fireflies', 'notion']} d={400} />
      <OFamily icon="image" tone="pink" title="Création" mod="M7" ids={['firefly', 'canva', 'runway', 'capcut']} d={500} />
      <OFamily icon="loop" tone="coral" title="Automatisation" mod="M8" ids={['zapier', 'make', 'powerautomate']} d={600} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1400) }}>
      <Icon name="bulb" size={24} color={C.violet} />
      Perplexity et Canva AI apparaissent deux fois : on les voit sous deux angles (assistant / recherche, rédaction / création).
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice ce soir.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Expliquer simplement ce qu’est une IA générative et ses limites</CheckItem>
        <CheckItem id="ap2">Citer trois tâches de mon poste que l’IA peut accélérer</CheckItem>
        <CheckItem id="ap3">Écrire un prompt avec contexte, objectif, rôle, contraintes et format</CheckItem>
        <CheckItem id="ap4">Choisir entre ChatGPT, Copilot, Gemini, Claude et Perplexity selon la tâche</CheckItem>
        <CheckItem id="ap5">Vérifier une information donnée par une IA avant de l’utiliser</CheckItem>
        <CheckItem id="ap6">Transformer des notes en email, en présentation ou en visuel avec l’IA</CheckItem>
        <CheckItem id="ap7">Obtenir automatiquement le compte rendu et les actions d’une réunion</CheckItem>
        <CheckItem id="ap8">Savoir quelles données je n’ai pas le droit de confier à une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Curieux outillé : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus des ateliers.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression en fin de journée.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Règles du jeu & équipement ─────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : prêts pour les ateliers ?</Title>
    <Lede>Les versions gratuites suffisent pour la journée. Ouvrez les comptes au fil des modules.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un ordinateur avec un navigateur récent (Chrome, Edge ou Firefox)</CheckItem>
        <CheckItem id="su2" size={26}>Au moins un assistant : ChatGPT, Copilot, Gemini ou Claude</CheckItem>
        <CheckItem id="su3" size={26}>Un compte Google (Gemini, NotebookLM) ou Microsoft (Copilot)</CheckItem>
        <CheckItem id="su4" size={26}>Les comptes gratuits ouverts au fil de l’eau : Perplexity, Canva, Gamma, DeepL…</CheckItem>
        <CheckItem id="su5" size={26}>Le dossier d’exercices fictifs fourni (notes, transcription, brief)</CheckItem>
        <CheckItem id="su6" size={26}>Votre liste mentale de tâches qui vous agacent : on en aura besoin !</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle de client, de collègue ou de contrat dans les ateliers. Nous utilisons des cas fictifs.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Poll, O_Objectifs, O_Programme, O_Toolbox, O_AutoPos, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, rassurer : c’est une formation pour débutants, orientée gain de temps concret.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va parler d’intelligence artificielle, mais surtout de temps : le temps que vous passez sur des emails, des comptes rendus, des recherches, des présentations. À droite, vous voyez les vingt outils numérotés du programme. Rassurez-vous : personne ne vous demandera de les retenir par cœur. L’objectif, c’est que ce soir vous sachiez lequel ouvrir pour quelle tâche, et comment lui parler. »

ANIMATION — Laisser les tuiles apparaître. Pointer deux ou trois noms connus (ChatGPT, Copilot, Canva) pour montrer qu’on part de choses familières.

TRANSITION — « Quelques mots sur la journée et sur moi. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Poser le contrat pédagogique et le fil conducteur.

DIRE — « Sept heures, vingt outils, huit ateliers. Plus de la moitié du temps, c’est vous qui tenez la souris. Mon rôle : vous montrer, vous éviter les pièges, et vous aider à choisir. Votre rôle : tester sur vos propres cas — avec des données fictives, j’y reviendrai. Et le fil conducteur, que vous allez entendre souvent : l’IA propose, vous disposez. Elle produit un premier jet ; c’est vous qui décidez de ce qui part. »

INSISTER — Il n’y a pas de question naïve. Beaucoup de participants ont peur de « mal utiliser » l’IA : désamorcer dès maintenant.

TRANSITION — « Faisons connaissance avec un petit vote. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître le niveau du groupe et ses irritants pour adapter les démonstrations.

DIRE — « Premier vote : à quelle fréquence utilisez-vous l’IA aujourd’hui ? » Compter les mains, cliquer. « Deuxième vote, le plus important : qu’est-ce qui vous prend le plus de temps ? Vous pouvez voter deux fois. »

ANIMATION — Cliquer une ligne par main levée. Noter les deux irritants les plus votés : ce sont les exemples à privilégier dans les démonstrations de l’après-midi (M5 pour les emails et documents, M6 pour les réunions, M4 pour la recherche). Repérer les utilisateurs quotidiens : leur proposer d’aider un voisin débutant pendant les ateliers.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les neuf objectifs du programme en quatre gestes faciles à retenir.

DIRE — « Le programme compte neuf objectifs. Je les range en quatre gestes. Comprendre : ce que fait l’IA générative, et ce qu’elle peut faire pour vous. Demander : le prompting, c’est-à-dire l’art de formuler une demande. Produire : c’est le gros de la journée, avec les vingt outils, pour vos emails, documents, réunions, présentations, et un aperçu de l’automatisation. Encadrer : utiliser tout cela de manière responsable, sans mettre en danger vos données ni celles de vos clients. »

TRANSITION — « Et voici comment la journée est découpée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée.

DIRE — « Le matin, on pose les bases qui servent partout : comprendre l’IA, savoir lui parler, et découvrir les cinq grands assistants. L’après-midi, on produit : un module par grande famille de tâches — rechercher, rédiger, les réunions, la création visuelle — et on termine par l’automatisation et les bonnes pratiques, avec votre plan d’action personnel. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe. Garder les 40 dernières minutes pour M8 et le bilan, c’est là que se construit le plan d’action.

TRANSITION — « Voici les outils, rangés par famille. »`,
  `⏱ 2 min · LA BOÎTE À OUTILS

OBJECTIF — Montrer que les 20 outils se rangent en six familles d’usages.

DIRE — « Six familles. Les assistants, les généralistes qui savent presque tout faire. La recherche, pour trouver et vérifier de l’information. La rédaction, pour corriger, traduire, mettre en forme. Les réunions, pour ne plus prendre de notes. La création, pour les images et les vidéos. Et l’automatisation, pour que certaines tâches se fassent toutes seules. Vous remarquerez que Perplexity et Canva apparaissent deux fois : c’est voulu, ce sont deux outils polyvalents que l’on verra sous deux angles. »

INSISTER — On retient une famille et un usage, pas un nom d’outil. Les outils changent vite ; les usages restent.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par compétence visée aujourd’hui. Cochez seulement ce que vous savez faire maintenant, sans aide. Notez votre score sur une feuille : on refera exactement le même exercice ce soir, et vous verrez la différence. »

ANIMATION — Faire cocher un volontaire à l’écran, ou laisser chacun noter sur papier. Repérer les scores élevés : leur proposer les bonus des ateliers.

TRANSITION — « Dernière vérification : votre équipement. »`,
  `⏱ 3 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier l’accès aux outils et poser la règle d’or sur les données.

DIRE — « Trois minutes : vérifiez chaque ligne. Pas besoin d’ouvrir les vingt comptes maintenant, on le fera au fil des modules. Les versions gratuites suffisent pour la journée. Et la règle d’or, que je répéterai : aucune donnée réelle de client, de collègue ou de contrat dans les ateliers. Les versions grand public de ces outils peuvent conserver vos échanges. Nous travaillons sur des cas fictifs que je vous fournis. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si quelqu’un n’a pas d’accès, il travaille en binôme.

TRANSITION — « Tout le monde est prêt ? Module 1 : découvrir l’IA et ses opportunités. »`,
];
// @@NOTES-END
