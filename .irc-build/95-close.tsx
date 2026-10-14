// ─── Clôture ────────────────────────────────────────────────────────────────

const F_Quiz: Page = () => (
  <Frame mod={11} kind="quiz">
    <Title>Quiz final : huit questions pour toute la journée</Title>
    <QuizSeries y={220}>
      <QuizQ q="Les cinq ingrédients d’un bon prompt sont…" explain="Rôle, contexte, tâche, format, ton. Le contexte (faits + procédure) est celui qui réduit le plus les inventions.">
        <QOpt>Politesse, longueur, mots-clés, langue, date</QOpt>
        <QOpt ok>Rôle, contexte, tâche, format, ton</QOpt>
        <QOpt>Question, réponse, source, signature, émoji</QOpt>
      </QuizQ>
      <QuizQ q="Analyser une demande, c’est identifier…" explain="Intention, catégorie, informations clés, urgence, émotion : la fiche d’analyse du module 2.">
        <QOpt ok>Intention, catégorie, infos clés, urgence, émotion</QOpt>
        <QOpt>Le nom, l’âge et l’adresse du client</QOpt>
        <QOpt>Le nombre de mots et de fautes</QOpt>
      </QuizQ>
      <QuizQ q="Dans une bonne réponse, la solution arrive…" explain="Saluer, reconnaître, puis répondre : la solution vient tôt, l’explication ensuite, puis la prochaine étape.">
        <QOpt>Tout à la fin</QOpt>
        <QOpt ok>Juste après avoir reconnu la situation</QOpt>
        <QOpt>Dans un second message</QOpt>
      </QuizQ>
      <QuizQ q="Face à un client en colère, quelle phrase éviter ?" explain="« Calmez-vous » nie l’émotion et la fait monter. On reformule avec un fait précis et on propose une action.">
        <QOpt>« Voici ce que je peux faire dès maintenant. »</QOpt>
        <QOpt ok>« Calmez-vous, s’il vous plaît. »</QOpt>
        <QOpt>« Je comprends, vous avez attendu toute la journée. »</QOpt>
      </QuizQ>
      <QuizQ q="Pour une recherche fiable dans la documentation, l’IA doit…" explain="Répondre uniquement à partir du document, citer la section, et dire quand l’information est absente.">
        <QOpt>Compléter avec ses connaissances générales</QOpt>
        <QOpt ok>Répondre seulement à partir du document, en citant la section</QOpt>
        <QOpt>Donner la réponse la plus probable</QOpt>
      </QuizQ>
      <QuizQ q="Pour compter les motifs de contact sur 1 000 conversations…" explain="L’IA classe, le tableur compte, l’humain interprète.">
        <QOpt>On demande le total à l’IA</QOpt>
        <QOpt ok>L’IA classe, un tableur compte</QOpt>
        <QOpt>On lit un échantillon de 10</QOpt>
      </QuizQ>
      <QuizQ q="Laquelle de ces données ne doit jamais aller dans une IA ?" explain="Les données bancaires, les mots de passe et les données de santé ne servent pas à rédiger une réponse : jamais, même dans l’outil autorisé.">
        <QOpt>La description de la panne</QOpt>
        <QOpt>La date de livraison</QOpt>
        <QOpt ok>Le numéro de carte bancaire</QOpt>
      </QuizQ>
      <QuizQ q="Qui décide d’un geste commercial ?" explain="Le conseiller dans sa délégation, ou son responsable au-delà, selon la procédure. L’IA peut préparer la note, jamais décider.">
        <QOpt>L’IA, si elle le propose</QOpt>
        <QOpt ok>Le conseiller ou son responsable, selon la procédure</QOpt>
        <QOpt>Le client</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const F_AutoPos: Page = () => (
  <Frame mod={11} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations que ce matin. Comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="fp1">Citer trois usages concrets de l’IA dans un service client</CheckItem>
        <CheckItem id="fp2">Faire identifier l’intention, l’urgence et l’émotion d’un message</CheckItem>
        <CheckItem id="fp3">Obtenir une réponse claire, au bon ton, personnalisée</CheckItem>
        <CheckItem id="fp4">Préparer une réponse à une réclamation tendue</CheckItem>
        <CheckItem id="fp5">Créer un modèle de réponse réutilisable par toute l’équipe</CheckItem>
        <CheckItem id="fp6">Transformer une procédure en FAQ ou en arbre de décision</CheckItem>
        <CheckItem id="fp7">Faire ressortir les motifs de contact d’un lot de conversations</CheckItem>
        <CheckItem id="fp8">Savoir quelles données ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les fiches de synthèse et refaites les ateliers.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : pratiquez chaque jour, ça viendra vite.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : à vous de jouer lundi !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Ce matin : ___ / 8. Ce soir : ___ / 8. La différence, c’est votre journée.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d’action ──────────────────────────────────────────────────────────
const F_Plan: Page = () => (
  <Frame mod={11} kind="exercice">
    <Title>Mon plan d’action : trois usages dès lundi</Title>
    <Lede>Choisissez-en trois, pas plus. Le meilleur usage est celui que vous ferez vraiment, chaque jour.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...dl(100) }}>
        <CheckItem id="pl1" size={22} tone="violet">Analyser les messages longs avec la fiche</CheckItem>
        <CheckItem id="pl2" size={22} tone="violet">Retoucher mes brouillons (plus clair, plus court)</CheckItem>
        <CheckItem id="pl3" size={22} tone="violet">Créer 3 modèles pour mes cas fréquents</CheckItem>
        <CheckItem id="pl4" size={22} tone="violet">Préparer mes réponses aux réclamations</CheckItem>
        <CheckItem id="pl5" size={22} tone="violet">M’entraîner avec la simulation de client</CheckItem>
        <CheckItem id="pl6" size={22} tone="violet">Chercher dans la doc avec citation des sources</CheckItem>
        <CheckItem id="pl7" size={22} tone="violet">Synthétiser mes appels au même format</CheckItem>
        <CheckItem id="pl8" size={22} tone="violet">Proposer une amélioration tirée des irritants</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1350, top: 262, width: 450, ...dl(300) }}>
        <CheckScore
          max={3}
          label="Mes engagements"
          levels={[
            { min: 0, text: 'Choisissez trois usages.', tone: 'grey' },
            { min: 1, text: 'Encore un peu…', tone: 'blue' },
            { min: 3, text: 'Parfait : notez-les, et faites le point dans 15 jours.', tone: 'green' },
            { min: 4, text: 'Trop d’un coup : gardez-en trois.', tone: 'coral' },
          ]}
        />
      </div>
    </Checklist>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1180, ...dl(600) }}>
      <Callout title="Votre boîte à outils" tone="blue" icon="note" size={23}>
        Votre document contient désormais : la recette du prompt, les prompts d’analyse, de rédaction, de réclamation, de simulation, de recherche
        documentaire, de synthèse d’appel et de reporting, et vos modèles.
      </Callout>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const F_Merci: Page = () => (
  <Frame mod={11} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={1830} y={900} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1000 }}>
      <Eyebrow c={C.violet} size={24} cls={A.in}>
        Merci pour votre énergie !
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '24px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        L’IA propose,
        <br />
        <span style={{ color: C.plum }}>vous disposez.</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Elle vous fait gagner du temps sur ce qui se répète. Vous gardez ce qui fait la différence : l’écoute, le jugement, et la relation.
      </p>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Questions, retours, suite
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={20}>
          <Icon name="form" size={20} /> Questionnaire d’évaluation
        </Tag>
        <Tag tone="green" size={20}>
          <Icon name="note" size={20} /> Votre boîte à prompts
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1440, top: 200, width: 360, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OCoverStep icon="search" tone="blue" eyebrow="Comprendre" label="Analyser la demande" y={0} d={400} solid={false} />
      <OCoverStep icon="pen" tone="violet" eyebrow="Répondre" label="Rédiger, au bon ton" y={130} d={500} solid={false} />
      <OCoverStep icon="heart" tone="coral" eyebrow="Apaiser" label="Désamorcer, escalader" y={260} d={600} solid={false} />
      <OCoverStep icon="book" tone="teal" eyebrow="Capitaliser" label="Partager la connaissance" y={390} d={700} solid={false} />
      <OCoverStep icon="chart" tone="green" eyebrow="Améliorer" label="Écouter tous les clients" y={520} d={800} solid={false} />
    </div>
    <Footer left={390} />
  </Frame>
);
F_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [F_Quiz, F_AutoPos, F_Plan, F_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 6 min · QUIZ FINAL (8 questions) · 17:15

OBJECTIF — Évaluer les acquis sur l’ensemble de la journée.

DIRE — « Huit questions, une par grand thème de la journée. On vote à main levée, puis je clique. Le score « du premier coup » est celui du groupe. »

ANIMATION — Rythme rapide : 40 secondes par question. Commenter brièvement les erreurs fréquentes.

TRANSITION — « Et vous, où en êtes-vous ? »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression (même grille que ce matin).

DIRE — « Les mêmes huit affirmations que ce matin. Cochez ce que vous savez faire maintenant. Comparez avec votre score de départ. » Demander qui a progressé de 3 points ou plus.

TRANSITION — « Le plus important : ce que vous ferez lundi. »`,
  `⏱ 3 min · PLAN D’ACTION

OBJECTIF — Ancrer le transfert en situation de travail.

DIRE — « Trois usages, pas plus. Le meilleur est celui que vous ferez vraiment, tous les jours. Notez-les, et faites le point dans quinze jours. Votre document contient tous les prompts de la journée : c’est votre boîte à outils. »

ANIMATION — Faire lire trois ou quatre plans d’action à voix haute.

TRANSITION — « Pour finir. »`,
  `⏱ 3 min · MERCI · 17:30

OBJECTIF — Conclure sur le message clé et recueillir l’évaluation.

DIRE — « Merci pour votre énergie et votre participation. Si vous ne retenez qu’une phrase : l’IA propose, vous disposez. Elle vous fait gagner du temps sur ce qui se répète ; vous gardez l’écoute, le jugement et la relation. Merci de remplir le questionnaire d’évaluation, et n’hésitez pas à revenir vers moi avec vos questions. »

ANIMATION — Distribuer ou afficher le lien du questionnaire d’évaluation. Rappeler de sauvegarder le document de prompts.`,
];
// @@NOTES-END
