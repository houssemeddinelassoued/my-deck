// ─── Jour 2 · Reprise ───────────────────────────────────────────────────────

const J2_Cover: Page = () => (
  <Frame mod={10} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 160, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="blue" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 9 h 00 – 15 h 30
        </Tag>
        <Tag tone="navy" size={22}>
          <Icon name="bot" size={22} /> API, agents et Claude Code
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Automatiser,
        <br />
        <span style={{ color: C.electric }}>déléguer à un agent</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1150, ...dl(240) }}>
        Brancher Claude sur l’interface web par l’API et le tool use, puis confier le dépôt à Claude Code, encadré par les garde-fous d’hier.
      </p>
      <div className={A.in} style={{ marginTop: 40, display: 'flex', gap: 12, ...dl(400) }}>
        <Tag tone="teal" size={20}>
          M4 · API et automatisation
        </Tag>
        <Tag tone="violet" size={20}>
          M5 · Agents et Claude Code
        </Tag>
        <Tag tone="pink" size={20}>
          M6 · Défi final
        </Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', right: 120, top: 760, ...dl(600) }}>
      <LogoPlate which="both" h={70} pad={18} />
    </div>
    <Footer left={390} />
  </Frame>
);
J2_Cover.transition = BLOOM;

const J2_Quiz: Page = () => (
  <Frame mod={10} kind="quiz">
    <Title>Quiz de reprise : le Jour 1 en cinq questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Sur Opus 5.5, comment demander plus de réflexion ?" explain="La réflexion adaptative est toujours active ; on règle sa profondeur par output_config.effort (ou /effort dans Claude Code).">
        <QOpt>« Réfléchis étape par étape » en majuscules</QOpt>
        <QOpt ok>Augmenter le niveau d’effort</QOpt>
        <QOpt>Donner un budget de réflexion en jetons</QOpt>
      </QuizQ>
      <QuizQ q="Où placer la question dans un prompt qui contient 40 fichiers ?" explain="Documents en haut, consignes ensuite, question tout à la fin : meilleure qualité, et cet ordre maximise le cache.">
        <QOpt>Tout en haut, avant les fichiers</QOpt>
        <QOpt>Au milieu, entre deux fichiers</QOpt>
        <QOpt ok>À la fin, après les documents et les consignes</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi choisir les exemples few-shot par du code ?" explain="Des exemples fixes biaisent : le modèle imite le seul cas montré. On choisit les plus proches, avec de la diversité.">
        <QOpt ok>Pour montrer des cas proches et variés, sans biaiser vers un seul</QOpt>
        <QOpt>Pour réduire la taille du prompt à zéro</QOpt>
        <QOpt>Parce que l’API refuse les exemples fixes</QOpt>
      </QuizQ>
      <QuizQ q="La boucle a échoué 3 fois de suite. Que fait le harnais ?" explain="Il s’arrête et escalade vers un humain avec l’historique. Une boucle sans limite brûle du temps et des jetons.">
        <QOpt>Il relance indéfiniment</QOpt>
        <QOpt ok>Il s’arrête et escalade vers un humain, avec l’historique</QOpt>
        <QOpt>Il désactive la garde pour laisser passer</QOpt>
      </QuizQ>
      <QuizQ q="Votre évaluation montre 9 / 12. Un collègue propose de retirer les 3 cas « trop durs »." explain="Le jeu de référence est figé : on n’en retire jamais un cas raté. On en ajoute quand la réalité en révèle un nouveau.">
        <QOpt>Bonne idée, ils faussent la moyenne</QOpt>
        <QOpt>On les garde mais on ne les compte plus</QOpt>
        <QOpt ok>Non : on garde le jeu figé et on corrige le système</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const J2_Programme: Page = () => (
  <Frame mod={10}>
    <Title>Programme du Jour 2</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1040, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OSlot t="9:15" mod="M4" title="API, tool use et automatisation" sub="Requête, sorties structurées, boucle d’outils, injection" tone="teal" d={100} />
      <OSlot t="9:45" title="Atelier 3 · formulaire → Claude → base des demandes" sub="Simulateur par défaut, claude-cli en bonus" tone="green" d={160} />
      <OSlot t="11:15" title="Pause" tone="yellow" d={220} />
      <OSlot t="11:25" mod="M5" title="Agents et Claude Code" sub="Boucle agentique, MCP, CLAUDE.md, Skills, hooks, sous-agents" tone="violet" d={280} />
      <OSlot t="12:00" title="Déjeuner" tone="yellow" d={340} />
      <OSlot t="12:30" title="Atelier 4 · l’environnement Claude Code du dépôt" tone="green" d={400} />
      <OSlot t="14:25" mod="M6" title="Atelier 5 · défi final en autonomie" tone="pink" d={460} />
      <OSlot t="15:00" title="Restitution, QCM final, clôture" tone="grey" d={520} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 210, width: 570, ...dl(300) }}>
      <Card icon="chat" tone="yellow" title="Vos questions d’hier" size={23} pad={26}>
        Je réponds ici aux points restés flous.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted, fontStyle: 'italic' }}>
          Atelier 2 pas terminé ? <Ic>node guichet.mjs reprise A2.5</Ic> maintenant : l’Atelier 3 réutilise le contrat d’hier.
        </div>
      </Card>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Quiz, J2_Programme];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · COUVERTURE JOUR 2 · J2 9:00

OBJECTIF — Accueillir, annoncer la journée : automatiser puis déléguer à un agent.

DIRE — « Bonjour à tous. Hier, on a construit le cœur : des prompts mesurés et un harnais. Aujourd’hui, on le branche : ce matin par l’API, avec un vrai pipeline d’automatisation ; cet après-midi, en confiant le dépôt à Claude Code, encadré par vos garde-fous. »

TRANSITION — « Cinq questions pour se remettre en route. »`,
  `⏱ 6 min · QUIZ DE REPRISE (vote oral)

OBJECTIF — Réactiver les notions du Jour 1.

DIRE — « Cinq questions, vote à voix haute. »

ANIMATION — Une minute par question. Si la question 4 ou 5 est ratée par la majorité, revenir 1 minute sur la page « Évaluer avant d’affirmer ».

TRANSITION — « Le programme du jour. »`,
  `⏱ 2 min · PROGRAMME DU JOUR 2

OBJECTIF — Donner le déroulé et organiser les reprises.

DIRE — « Ce matin, l’API et le tool use, puis l’Atelier 3 : une demande saisie dans l’interface web arrive qualifiée dans la base. Après la pause, Claude Code et les agents. Cet après-midi, vous construisez l’environnement agentique du dépôt, puis un défi final en autonomie. »

ANIMATION — Faire lancer maintenant reprise A2.5 à ceux qui n’ont pas fini l’Atelier 2.

TRANSITION — « Module 4 : l’API. »`,
];
// @@NOTES-END
