// ─── Reprise de l'après-midi : quiz flash ───────────────────────────────────

const R_Quiz: Page = () => (
  <Frame mod={8} kind="quiz">
    <Title>Quiz flash : la matinée en cinq questions</Title>
    <QuizSeries y={200}>
      <QuizQ
        q="Pour que les complétions inline respectent une convention, le levier le plus direct est…"
        explain="L’inline lit le fichier courant et les onglets voisins : un exemple bien placé et un commentaire structuré pèsent plus que toute instruction."
      >
        <QOpt>Une règle dans .github/copilot-instructions.md</QOpt>
        <QOpt ok>Un fichier exemplaire ouvert à côté et un commentaire structuré</QOpt>
        <QOpt>Un modèle plus puissant dans le sélecteur</QOpt>
      </QuizQ>
      <QuizQ
        q="Une tâche va toucher six fichiers. Votre première étape ?"
        explain="Plan en lots, chacun avec son test, validé par vous : l’agent exécute ensuite un lot à la fois."
      >
        <QOpt>Mode Agent directement, avec un prompt détaillé</QOpt>
        <QOpt ok>Mode Plan : un plan en lots, validé avant toute ligne de code</QOpt>
        <QOpt>Mode Ask, puis copier-coller les fichiers proposés</QOpt>
      </QuizQ>
      <QuizQ
        q="Comment comparer deux prompts de façon fiable ?"
        explain="Copilot n’est pas déterministe : plusieurs essais en session neuve, et une grille décidée avant de lancer les essais."
      >
        <QOpt>Un essai chacun, on garde le meilleur résultat</QOpt>
        <QOpt>Demander à Copilot lequel des deux est meilleur</QOpt>
        <QOpt ok>Plusieurs essais en session neuve, grille fixée à l’avance</QOpt>
      </QuizQ>
      <QuizQ
        q="Pourquoi vérifier un état plutôt qu’une interaction dans un test ?"
        explain="Un test d’état survit à un refactoring interne ; un test d’interaction casse dès que l’implémentation change, même si le comportement est identique."
      >
        <QOpt ok>Il résiste mieux au refactoring</QOpt>
        <QOpt>Il s’exécute plus vite</QOpt>
        <QOpt>Copilot le génère plus facilement</QOpt>
      </QuizQ>
      <QuizQ
        q="« 100 % de couverture » signifie que…"
        explain="Toutes les lignes ont été exécutées, rien de plus. Seules les assertions vérifient — et la mutation mesure si elles détectent une erreur."
      >
        <QOpt>Le code n’a plus de bug connu</QOpt>
        <QOpt ok>Chaque ligne a été exécutée par au moins un test</QOpt>
        <QOpt>Chaque comportement a été vérifié</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [R_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 8 min · QUIZ FLASH · 13:30

OBJECTIF — Réactiver la matinée et vérifier les acquis avant l’après-midi (évaluation continue).

DIRE — « Bon retour ! Cinq questions sur la matinée, à main levée. On clique la réponse majoritaire, et on discute quand le groupe se trompe. »

ANIMATION — Une question à la fois, bouton « Suivante ». Le compteur « du premier coup » donne un score collectif : l’annoncer. Si une question est majoritairement ratée, reprendre la page correspondante en deux minutes.

TRANSITION — « L’après-midi commence par ce que Copilot fait le moins bien seul : du code propre. Module 4. »`,
];
// @@NOTES-END
