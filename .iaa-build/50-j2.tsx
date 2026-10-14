// ─── Ouverture · Jour 2 ─────────────────────────────────────────────────────

const J2_Cover: Page = () => (
  <Frame mod={10} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 980 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="green" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="puzzle" size={22} /> Automatiser et intégrer
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Du schéma
        <br />
        <span style={{ color: C.green }}>au scénario qui tourne</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Hier, vous avez conçu. Aujourd’hui, vous construisez, vous connectez, vous sécurisez… et vous présentez votre automatisation.
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', gap: 12, flexWrap: 'wrap', ...dl(400) }}>
        <Tag tone="green" size={21}>M5 · No-code</Tag>
        <Tag tone="yellow" size={21}>M6 · Logique</Tag>
        <Tag tone="pink" size={21}>M7 · Connexions</Tag>
        <Tag tone="blue" size={21}>M8 · Agents</Tag>
        <Tag tone="coral" size={21}>M9 · Garde-fous</Tag>
        <Tag tone="navy" size={21}>Projet final</Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 150, width: 400, height: 720 }}>
      <svg width={64} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 672" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 672" dur={3.2} r={8} color={C.green} />
      </svg>
      <OCoverStep kind="trigger" label="Nouvelle réponse au formulaire" y={0} d={400} />
      <OCoverStep kind="data" label="Ligne ajoutée au tableur" y={160} d={520} />
      <OCoverStep kind="ai" label="L’IA qualifie la demande" y={320} d={640} />
      <OCoverStep kind="cond" label="Routeur : 3 chemins" y={480} d={760} />
      <OCoverStep kind="action" label="CRM + email + Teams" y={640} d={880} />
    </div>
    <Footer left={390} />
  </Frame>
);
J2_Cover.transition = BLOOM;

// ─── Quiz de rappel du jour 1 ───────────────────────────────────────────────
const J2_Rappel: Page = () => (
  <Frame mod={10} kind="quiz">
    <Title>Rappel du jour 1 : cinq questions pour se réveiller</Title>
    <QuizSeries y={200}>
      <QuizQ q="Chaque CV reçu est résumé par l’IA et présenté au recruteur, qui décide. Quel niveau ?" explain="Le flux tourne seul (règles + IA pour lire), la décision reste humaine : automatisation intelligente avec validation.">
        <QOpt>Assistance</QOpt>
        <QOpt ok>Automatisation intelligente avec validation humaine</QOpt>
        <QOpt>Automatisation simple</QOpt>
      </QuizQ>
      <QuizQ q="Que doit renvoyer une étape IA dont la sortie est lue par une condition ?" explain="Un format imposé avec des valeurs autorisées : la condition teste une valeur exacte.">
        <QOpt>Un texte bien rédigé</QOpt>
        <QOpt ok>Un JSON avec des valeurs autorisées</QOpt>
        <QOpt>Un résumé en puces</QOpt>
      </QuizQ>
      <QuizQ q="L’IA ne trouve pas une information dans le document. Elle doit…" explain="null est une information exploitable ; une valeur inventée passe inaperçue.">
        <QOpt>La déduire du contexte</QOpt>
        <QOpt>Laisser un texte d’excuse</QOpt>
        <QOpt ok>Renvoyer null</QOpt>
      </QuizQ>
      <QuizQ q="Calculer un montant TTC dans un workflow : IA ou règle ?" explain="Une formule : gratuite, instantanée, exacte. L’IA extrait les montants, la règle calcule.">
        <QOpt ok>Règle</QOpt>
        <QOpt>IA</QOpt>
        <QOpt>Les deux, pour comparer</QOpt>
      </QuizQ>
      <QuizQ q="Où placer la validation humaine d’une réponse envoyée à un client ?" explain="Avant l’action externe : une fois partie, la réponse ne se rattrape pas.">
        <QOpt>Après l’envoi</QOpt>
        <QOpt ok>Avant l’envoi</QOpt>
        <QOpt>Nulle part si le prompt est testé</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Programme du jour 2 ────────────────────────────────────────────────────
const J2_Programme: Page = () => (
  <Frame mod={10}>
    <Title>Le programme du jour 2</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OSlot t="9:00" title="Reprise · quiz de rappel" tone="grey" d={100} />
      <OSlot t="9:20" mod="M5" title="Premières automatisations no-code" sub="Make, Power Automate, Zapier · atelier 5" tone="green" d={180} />
      <OSlot t="11:00" mod="M6" title="Conditions et logique" sub="Filtres, routeur, exceptions · atelier 6" tone="yellow" d={260} />
      <OSlot t="13:30" mod="M7" title="Connecter les outils" sub="Formulaire → IA → tableur → CRM · atelier 7" tone="pink" d={340} />
      <OSlot t="14:30" mod="M8" title="Assistants et agents IA" sub="Mission, règles, outils · atelier 8" tone="blue" d={420} />
      <OSlot t="15:45" mod="M9" title="Sécurité, fiabilité, gouvernance" sub="Arbitrer les risques · atelier 9" tone="coral" d={500} />
      <OSlot t="16:20" title="Projet final · présentations · clôture" tone="navy" d={580} />
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 200, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(300) }}>
        <Eyebrow c={C.navy} size={20}>
          Du schéma au scénario
        </Eyebrow>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name="pen" tone="violet" size={64} />
          <FlowArrow w={60} color={C.faint} />
          <IconTile name="puzzle" tone="green" size={64} solid />
          <FlowArrow w={60} color={C.faint} />
          <IconTile name="rocket" tone="blue" size={64} solid />
        </div>
        <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.45, color: C.soft }}>
          Chaque composant de votre schéma devient un module dans l’outil. Les couleurs ne changent pas.
        </div>
      </div>
      <Callout title="Règle du jour" tone="coral" icon="lock" cls={A.right} style={dl(500)} size={24}>
        On construit avec des données fictives et une boîte mail de test. Rien ne part vers un vrai client.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Rappel, J2_Programme];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE JOUR 2 · 9:00

OBJECTIF — Relancer la dynamique et annoncer la bascule : de la conception à la construction.

DIRE — « Bonjour à toutes et à tous. Hier, vous avez conçu : cartographie, prompts, traitement des documents, schéma complet. Aujourd’hui, on construit. À droite, le genre de scénario que vous aurez en fin de matinée : une réponse de formulaire, une ligne de tableur, l’IA qui qualifie, un routeur à trois chemins, et des actions dans le CRM, par email et dans Teams. Et en fin de journée, chacun présente son automatisation. »

TRANSITION — « Cinq questions pour se remettre en route. »`,
  `⏱ 5 min · QUIZ DE RAPPEL (5 questions)

OBJECTIF — Réactiver les acquis du jour 1.

DIRE — « Cinq questions, une par grande idée d’hier. Votez, puis on clique. » Après chaque réponse, rappeler en une phrase le module concerné.

ANIMATION — Utiliser le compteur « du premier coup » comme défi collectif : viser 5 / 5.

TRANSITION — « Le programme de la journée. »`,
  `⏱ 2 min · PROGRAMME JOUR 2

OBJECTIF — Donner le déroulé du jour 2 et rappeler la règle des données fictives.

DIRE — « Cinq modules et le projet final. Le fil : chaque composant de votre schéma d’hier devient un module dans l’outil, avec les mêmes couleurs. Et la règle du jour : données fictives, boîte mail de test. Un workflow qui part en production par erreur, ça arrive vite. »

ANIMATION — Vérifier rapidement que chacun a son compte d’automatisation connecté.

TRANSITION — « Module 5 : vos premières automatisations no-code. »`,
];
// @@NOTES-END
