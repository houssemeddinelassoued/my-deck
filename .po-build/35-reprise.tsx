// ─── Reprise de l’après-midi : quiz flash ───────────────────────────────────

const R_Quiz: Page = () => (
  <Frame mod={8} kind="quiz">
    <Title>Quiz flash : la matinée en six questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="« IA générative » désigne…" explain="Des modèles qui produisent du contenu nouveau : texte, image, code. C’est le plus petit cercle des poupées russes.">
        <QOpt>Tout système qui apprend à partir de données</QOpt>
        <QOpt ok>Des modèles qui produisent du contenu nouveau</QOpt>
        <QOpt>Les modèles qui prévoient des chiffres</QOpt>
      </QuizQ>
      <QuizQ q="Un modèle juste à 95 %, appliqué aux 180 000 justificatifs mensuels de Spendo, c’est…" explain="5 % de 180 000 : 9 000 erreurs chaque mois. D’où la question : que se passe-t-il quand il se trompe ?">
        <QOpt>Quasiment aucune erreur</QOpt>
        <QOpt>900 erreurs par mois</QOpt>
        <QOpt ok>9 000 erreurs par mois</QOpt>
      </QuizQ>
      <QuizQ q="Baisser le seuil d’alerte d’un détecteur de fraude…" explain="On détecte plus de fraudes (rappel), au prix de plus de fausses alertes (précision). C’est un arbitrage métier.">
        <QOpt ok>Augmente les fraudes détectées et les fausses alertes</QOpt>
        <QOpt>Rend le modèle plus précis</QOpt>
        <QOpt>Oblige à ré-entraîner le modèle</QOpt>
      </QuizQ>
      <QuizQ q="Pour qu’un assistant réponde juste sur la politique voyage d’un client, il faut…" explain="Lui fournir les documents du client au moment de répondre, et exiger qu’il les cite : c’est le RAG.">
        <QOpt>Un modèle plus gros</QOpt>
        <QOpt ok>Lui donner les documents du client au moment de répondre</QOpt>
        <QOpt>Une température plus élevée</QOpt>
      </QuizQ>
      <QuizQ q="Laquelle de ces idées n’a pas besoin d’IA ?" explain="Une règle connue, stable et explicable s’écrit en une ligne : paramétrable par client, sans modèle.">
        <QOpt>Lire le ticket photographié</QOpt>
        <QOpt ok>Valider automatiquement les notes sous 50 €</QOpt>
        <QOpt>Proposer la catégorie de dépense</QOpt>
      </QuizQ>
      <QuizQ q="Une idée à forte valeur mais à faible faisabilité aujourd’hui est…" explain="Un pari stratégique : on ne l’abandonne pas, on cherche ce qui la rendrait faisable (données, risque réduit).">
        <QOpt>Un quick win</QOpt>
        <QOpt>Une idée à abandonner</QOpt>
        <QOpt ok>Un pari stratégique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [R_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 10 min · REPRISE · QUIZ FLASH · 13:30

OBJECTIF — Réactiver les notions de la matinée après la pause déjeuner.

DIRE — « Bon retour ! Avant d’attaquer l’après-midi, six questions pour réveiller la matinée. Votez à main levée, je clique la réponse majoritaire. Le score du premier coup s’affiche à droite. »

INTERACTION — Une question à la fois : lire, faire voter, cliquer. Si la majorité se trompe, ne pas donner la réponse : cliquer la mauvaise option, laisser le groupe se corriger, puis cliquer la bonne. Bouton « Suivante » pour avancer.

ANIMATION — Questions 2 et 3 : faire le lien avec l’après-midi. « Ces 9 000 erreurs et ce seuil, on va les retrouver dans la user story. »

TRANSITION — « Ce matin, on a choisi quoi faire. Cet après-midi, on voit comment le faire. Module 4 : le workflow. »`,
];
// @@NOTES-END
