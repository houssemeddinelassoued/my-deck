// ─── Jour 2 · Reprise ───────────────────────────────────────────────────────

const J2_Cover: Page = () => (
  <Frame mod={10} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 9 h 00 – 17 h 30
        </Tag>
        <Tag tone="teal" size={22}>
          <Icon name="globe" size={22} /> Classe virtuelle
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Approfondissement
        <br />
        <span style={{ color: C.violet }}>et bonnes pratiques</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1100, ...dl(240) }}>
        Fonctions complètes et classes, refactoring, tests unitaires, vérification : TaskFlow devient un vrai petit logiciel, prouvé par ses tests.
      </p>
      <div className={A.in} style={{ marginTop: 40, display: 'flex', gap: 12, ...dl(400) }}>
        <Tag tone="teal" size={20}>M5 · Fonctions</Tag>
        <Tag tone="violet" size={20}>M6 · Refactoring</Tag>
        <Tag tone="pink" size={20}>M7 · Tests</Tag>
        <Tag tone="coral" size={20}>M8 · Vérification</Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 790, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
J2_Cover.transition = BLOOM;

const J2_Quiz: Page = () => (
  <Frame mod={10} kind="quiz">
    <Title>Quiz de reprise : le Jour 1 en cinq questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi Copilot peut-il proposer du code faux avec assurance ?" explain="Il prédit la suite la plus probable ; il n’exécute rien et n’a pas d’intention. Plausible n’est pas correct.">
        <QOpt>Parce que son modèle est trop ancien</QOpt>
        <QOpt ok>Parce qu’il prédit du code plausible, sans l’exécuter</QOpt>
        <QOpt>Parce que la connexion est lente</QOpt>
      </QuizQ>
      <QuizQ q="Quel geste accepte une suggestion mot par mot ?" explain="Ctrl+→ (Cmd+→ sur macOS). Tab accepte tout, Alt+] change de proposition.">
        <QOpt>Tab</QOpt>
        <QOpt ok>Ctrl+→</QOpt>
        <QOpt>Alt+]</QOpt>
      </QuizQ>
      <QuizQ q="Une suggestion inline peut-elle s’appuyer sur un fichier fermé du projet ?" explain="Non : l’inline lit le fichier courant et les onglets ouverts. Ouvrez le fichier utile dans un onglet voisin.">
        <QOpt>Oui, il indexe tout le projet</QOpt>
        <QOpt ok>Non, seulement le fichier courant et les onglets ouverts</QOpt>
        <QOpt>Oui, si le fichier est dans le même dossier</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient d’un commentaire ferme le mieux les cas limites ?" explain="Les exemples, surtout négatifs : « 4 → false » empêche la suggestion « intervalle ».">
        <QOpt>La règle seule</QOpt>
        <QOpt ok>Des exemples, dont des cas refusés</QOpt>
        <QOpt>Un ton impératif</QOpt>
      </QuizQ>
      <QuizQ q="À l’Atelier 4, un test d’acceptation échoue. Que faites-vous ?" explain="Les tests fournis sont la spécification : on corrige le code (ou le commentaire qui le guide), jamais le test.">
        <QOpt>Je modifie le test pour qu’il passe</QOpt>
        <QOpt ok>Je corrige le code ou je précise le commentaire-guide</QOpt>
        <QOpt>Je supprime le test</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const J2_Programme: Page = () => (
  <Frame mod={10}>
    <Title>Programme du Jour 2 : TaskFlow devient un vrai logiciel</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1040, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <OSlot t="9:15" mod="M5" title="Fonctions et blocs de code" sub="Fonctions complètes, classe, fichier, API HTTP, CSV, JSDoc · Atelier 5" tone="teal" d={100} />
      <OSlot t="10:45" title="Pause" tone="yellow" d={160} />
      <OSlot t="11:00" mod="M6" title="Refactoring avec Copilot" sub="Le vieux code de 2019 · Atelier 6" tone="violet" d={220} />
      <OSlot t="12:30" title="Déjeuner" tone="yellow" d={280} />
      <OSlot t="14:00" mod="M7" title="Tests unitaires avec Copilot" sub="Générer, organiser, vérifier, mocks · Atelier 7" tone="pink" d={340} />
      <OSlot t="15:15" mod="M8" title="Bonnes pratiques et vérification" sub="Checklist, hallucinations, droits, revue · Atelier 8" tone="coral" d={400} />
      <OSlot t="16:40" mod="M9" title="Les agents dans Copilot" sub="Agents, Skills, orchestration · Atelier 9" tone="violet" d={430} />
      <OSlot t="17:20" title="Auto-positionnement, évaluation, clôture" tone="grey" d={460} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 210, width: 570, ...dl(300) }}>
      <Card icon="chat" tone="yellow" title="Vos points flous d’hier" size={23} pad={26}>
        Je réponds ici aux questions laissées dans le billet de sortie.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted, fontStyle: 'italic' }}>Atelier 4 pas terminé ? Copiez reprises/fin-atelier-04/tickets.js dans src/ avant 9 h 55.</div>
      </Card>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Quiz, J2_Programme];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE JOUR 2 · 9:00

OBJECTIF — Accueillir, vérifier le son, relancer la dynamique.

DIRE — « Bonjour à toutes et à tous, bienvenue dans ce deuxième jour ! Hier, on a découvert Copilot, on l’a réglé, on a compris ses suggestions et généré le modèle de ticket. Aujourd’hui, TaskFlow devient un vrai petit logiciel : des fonctions complètes, du refactoring, des tests, et pour finir une revue de code. Tout le monde m’entend bien ? »

TRANSITION — « On commence par réveiller la mémoire. »`,
  `⏱ 8 min · QUIZ DE REPRISE (vote oral)

OBJECTIF — Réactiver les acquis du Jour 1 (évaluation continue).

DIRE — « Cinq questions sur hier. Votez à voix haute, A, B ou C. »

ANIMATION — Après chaque réponse, demander à un participant d’expliquer en une phrase. Noter le score « du premier coup » affiché.

TRANSITION — « Voici le programme de la journée. »`,
  `⏱ 5 min · PROGRAMME DU JOUR 2

OBJECTIF — Donner le déroulé et répondre aux points flous du billet de sortie.

DIRE — « Quatre modules : fonctions et blocs de code, refactoring, tests, et vérification. Chaque module a son atelier, sur le même dépôt. Avant de commencer, vos questions d’hier… » (répondre aux 2 ou 3 points flous notés). « Si l’Atelier 4 n’est pas terminé, copiez le point de reprise maintenant : l’Atelier 5 en a besoin. »

TRANSITION — « Module 5 : des fonctions complètes. »`,
];
// @@NOTES-END
