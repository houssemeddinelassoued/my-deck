// ─── Jour 2 · Reprise ───────────────────────────────────────────────────────

const J2_Cover: Page = () => (
  <Frame mod={10} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 9 h 00 – 17 h 35
        </Tag>
        <Tag tone="teal" size={22}>
          <Icon name="globe" size={22} /> Classe virtuelle
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Déléguer, outiller,
        <br />
        <span style={{ color: C.violet }}>vérifier</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1100, ...dl(240) }}>
        Régler l’agent, lui créer des collègues spécialisés, lui faire écrire des tests, lui brancher des outils… et relire ce qu’il produit.
      </p>
      <div className={A.in} style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', ...dl(400) }}>
        <Tag tone="navy" size={20}>M5 · Harnais</Tag>
        <Tag tone="violet" size={20}>M6 · Agents et skills</Tag>
        <Tag tone="pink" size={20}>M7 · Tests</Tag>
        <Tag tone="teal" size={20}>M8 · MCP et plugins</Tag>
        <Tag tone="coral" size={20}>M9 · Vérifier</Tag>
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
      <QuizQ q="Quel mode choisir pour une tâche en plusieurs étapes, sur plusieurs fichiers ?" explain="Un plan d’abord, relu et corrigé, puis l’agent qui exécute ce plan sous le contrôle des tests.">
        <QOpt>Inline, ligne par ligne</QOpt>
        <QOpt ok>Plan, puis Agent</QOpt>
        <QOpt>Ask, puis copier-coller</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient du prompt dit à l’agent quand s’arrêter ?" explain="Le critère d’acceptation : « npm run test:atelier3 vert, tests non modifiés ».">
        <QOpt>Le format</QOpt>
        <QOpt>Le contexte</QOpt>
        <QOpt ok>Le critère d’acceptation</QOpt>
      </QuizQ>
      <QuizQ q="Copilot combine vos instructions personnelles et celles du dépôt. En cas de contradiction ?" explain="Il n’y a pas d’ordre de priorité général entre fichiers d’instructions : on supprime la contradiction à la source.">
        <QOpt>Le dépôt gagne toujours</QOpt>
        <QOpt ok>Résultat imprévisible : on supprime la contradiction</QOpt>
        <QOpt>Vos préférences gagnent toujours</QOpt>
      </QuizQ>
      <QuizQ q="Un test d’acceptation échoue. L’agent propose de le modifier. Que faites-vous ?" explain="Les tests fournis sont le contrat : on corrige le code, jamais le test. npm run garde le vérifie.">
        <QOpt>J’accepte, il a sûrement raison</QOpt>
        <QOpt ok>Je refuse : on corrige le code, jamais le contrat</QOpt>
        <QOpt>Je supprime le test</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const J2_Programme: Page = () => (
  <Frame mod={10}>
    <Title>Programme du Jour 2 : déléguer, outiller, vérifier</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1040, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OSlot t="9:15" mod="M5" title="Le harnais : boucle, outils, permissions" sub="Régler l’agent, livrer le circuit de signature · Atelier 5" tone="navy" d={100} />
      <OSlot t="10:35" title="Pause" tone="yellow" d={160} />
      <OSlot t="10:50" mod="M6" title="Agents, skills et refactoring" sub="Un agent Refactoreur pour le code de 2019 · Atelier 6" tone="violet" d={220} />
      <OSlot t="12:30" title="Déjeuner" tone="yellow" d={280} />
      <OSlot t="13:30" mod="M7" title="Tests et définition de fini" sub="Une skill de tests, couverture, mutation · Atelier 7" tone="pink" d={340} />
      <OSlot t="15:10" mod="M8" title="MCP, plugins et sessions" sub="Annuaire MCP, plugin, deux sessions en parallèle · Atelier 8" tone="teal" d={400} />
      <OSlot t="16:20" mod="M9" title="Vérifier et valider" sub="Une PR piégée, un agent relecteur · Atelier 9" tone="coral" d={460} />
      <OSlot t="17:20" title="Évaluation et clôture" tone="grey" d={520} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 210, width: 570, ...dl(300) }}>
      <Card icon="chat" tone="yellow" title="Vos points flous d’hier" size={23} pad={26}>
        Je réponds ici aux questions laissées dans le billet de sortie.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted, fontStyle: 'italic' }}>
          Atelier 4 pas terminé ? <Ic>npm run reprise -- 4</Ic> maintenant : l’Atelier 5 en a besoin.
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
  `⏱ 2 min · COUVERTURE JOUR 2 · 9:00

OBJECTIF — Accueillir, vérifier le son, relancer la dynamique.

DIRE — « Bonjour à toutes et à tous, bienvenue dans ce deuxième jour ! Hier, vous avez appris à guider Copilot : les modes, le prompt, le plan, les instructions. Aujourd’hui, on lui délègue vraiment le travail : on règle ce qu’il a le droit de faire, on lui crée des collègues spécialisés, on lui fait écrire des tests, on lui branche des outils, et on relit ce qu’il produit. Tout le monde m’entend bien ? »

TRANSITION — « On commence par réveiller la mémoire. »`,
  `⏱ 8 min · QUIZ DE REPRISE (vote oral)

OBJECTIF — Réactiver les acquis du Jour 1 (évaluation continue).

DIRE — « Cinq questions sur hier. Votez à voix haute, A, B ou C. »

ANIMATION — Après chaque réponse, demander à un participant volontaire d’expliquer en une phrase. Noter le score « du premier coup » affiché.

TRANSITION — « Voici le programme de la journée. »`,
  `⏱ 5 min · PROGRAMME DU JOUR 2

OBJECTIF — Donner le déroulé et répondre aux points flous du billet de sortie.

DIRE — « Cinq modules aujourd’hui : le harnais, les agents et les skills, les tests, les outils MCP et les plugins, et la vérification. Chaque module a son atelier, sur le même dépôt. Avant de commencer, vos questions d’hier… » (répondre aux 2 ou 3 points flous notés). « Si l’Atelier 4 n’est pas terminé : npm run reprise -- 4, maintenant. »

TRANSITION — « Module 5 : ouvrons le capot de l’agent. »`,
];
// @@NOTES-END
