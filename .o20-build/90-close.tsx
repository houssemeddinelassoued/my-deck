// ─── Bilan & clôture ────────────────────────────────────────────────────────

// ─── Mémo : quel outil pour quelle tâche ────────────────────────────────────
const CMemo = ({ icon, tone, verb, ids, d }: { icon: IconName; tone: Tone; verb: string; ids: ToolId[]; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={30} color={STRONG[tone]} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{verb}</span>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '12px 22px' }}>
      {ids.map((id) => (
        <ToolChip key={id} id={id} size={21} />
      ))}
    </div>
  </div>
);

const C_Memo: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Le mémo : quel outil pour quelle tâche ?</Title>
    <Lede>Les neuf verbes du matin, et les outils de la journée qui y répondent le mieux.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <CMemo d={100} icon="pen" tone="blue" verb="Rédiger" ids={['chatgpt', 'copilot', 'claude', 'gemini']} />
      <CMemo d={160} icon="loop" tone="violet" verb="Reformuler, corriger" ids={['deepl', 'grammarly', 'claude']} />
      <CMemo d={220} icon="layers" tone="teal" verb="Résumer" ids={['copilot', 'notebooklm', 'claude']} />
      <CMemo d={280} icon="translate" tone="navy" verb="Traduire" ids={['deepl', 'chatgpt']} />
      <CMemo d={340} icon="search" tone="blue" verb="Rechercher" ids={['perplexity', 'gemini', 'elicit', 'consensus']} />
      <CMemo d={400} icon="chart" tone="green" verb="Analyser" ids={['chatgpt', 'claude', 'notebooklm']} />
      <CMemo d={460} icon="image" tone="pink" verb="Créer" ids={['canva', 'gamma', 'firefly', 'runway', 'capcut']} />
      <CMemo d={520} icon="calendar" tone="yellow" verb="Organiser" ids={['otter', 'fireflies', 'notion']} />
      <CMemo d={580} icon="bolt" tone="coral" verb="Automatiser" ids={['zapier', 'make', 'powerautomate']} />
    </div>
  </Frame>
);

// ─── Grand quiz final ───────────────────────────────────────────────────────
const C_Quiz: Page = () => (
  <Frame mod={9} kind="quiz">
    <Title>Le grand quiz de la journée</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi une IA générative peut-elle inventer un chiffre avec assurance ?" explain="Elle prédit la suite de mots la plus plausible ; sans source fournie ou consultée, elle comble les manques par des inventions vraisemblables.">
        <QOpt>Parce qu’elle ment volontairement</QOpt>
        <QOpt ok>Parce qu’elle prédit des mots plausibles, sans vérifier</QOpt>
        <QOpt>Parce qu’elle manque de mémoire vive</QOpt>
      </QuizQ>
      <QuizQ q="Quelles sont les 5 briques d’un bon prompt ?" explain="Contexte, objectif, rôle, contraintes, format : avec elles, l’IA ne devine plus, elle exécute.">
        <QOpt ok>Contexte, objectif, rôle, contraintes, format</QOpt>
        <QOpt>Politesse, longueur, anglais, émojis, urgence</QOpt>
        <QOpt>Titre, sous-titre, image, lien, signature</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez une réponse fondée uniquement sur vos procédures internes. Quel outil ?" explain="NotebookLM répond uniquement à partir des documents chargés, avec des citations vers les passages exacts.">
        <QOpt>Runway</QOpt>
        <QOpt ok>NotebookLM</QOpt>
        <QOpt>Grammarly</QOpt>
      </QuizQ>
      <QuizQ q="Votre réunion est terminée. Pour obtenir actions et responsables automatiquement ?" explain="Fireflies.ai (ou Otter.ai) transcrit la réunion et extrait les actions — après information et accord des participants.">
        <QOpt ok>Fireflies.ai, annoncé aux participants</QOpt>
        <QOpt>Adobe Firefly</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="Transformer une note en présentation de 8 slides en une minute ?" explain="Gamma génère une présentation complète à partir d’un texte ; choisissez de conserver votre texte pour éviter les ajouts.">
        <QOpt>DeepL</QOpt>
        <QOpt>Otter.ai</QOpt>
        <QOpt ok>Gamma</QOpt>
      </QuizQ>
      <QuizQ q="La règle qui résume la journée ?" explain="L’IA propose un premier jet, vous vérifiez, ajustez et décidez. La responsabilité reste humaine.">
        <QOpt>« L’IA décide, je valide sans lire »</QOpt>
        <QOpt ok>« L’IA propose, vous disposez »</QOpt>
        <QOpt>« Plus l’outil est cher, plus il est fiable »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const C_AutoPos: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les huit affirmations de ce matin. Cochez ce que vous savez faire maintenant.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="af1">Expliquer simplement ce qu’est une IA générative et ses limites</CheckItem>
        <CheckItem id="af2">Citer trois tâches de mon poste que l’IA peut accélérer</CheckItem>
        <CheckItem id="af3">Écrire un prompt avec contexte, objectif, rôle, contraintes et format</CheckItem>
        <CheckItem id="af4">Choisir entre ChatGPT, Copilot, Gemini, Claude et Perplexity selon la tâche</CheckItem>
        <CheckItem id="af5">Vérifier une information donnée par une IA avant de l’utiliser</CheckItem>
        <CheckItem id="af6">Transformer des notes en email, en présentation ou en visuel avec l’IA</CheckItem>
        <CheckItem id="af7">Obtenir automatiquement le compte rendu et les actions d’une réunion</CheckItem>
        <CheckItem id="af8">Savoir quelles données je n’ai pas le droit de confier à une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez le mémo et testez un outil par semaine.', tone: 'yellow' },
            { min: 4, text: 'Bien parti : appliquez votre mini-plan dès demain.', tone: 'blue' },
            { min: 7, text: 'Bravo : vous pouvez aider vos collègues !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Comparez avec votre score de ce matin : de combien de points avez-vous progressé ?
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Vos 30 prochains jours ─────────────────────────────────────────────────
const CStep = ({ when, tone, icon, title, items, d }: { when: string; tone: Tone; icon: IconName; title: string; items: string[]; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <Tag tone={tone} size={18}>
      {when}
    </Tag>
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((x) => (
        <Bullet key={x} size={22} tone={tone}>
          {x}
        </Bullet>
      ))}
    </div>
  </div>
);

const C_Next: Page = () => (
  <Frame mod={9}>
    <Title>Vos 30 prochains jours</Title>
    <Lede>Une formation ne fait gagner du temps que si elle devient une habitude. Trois étapes simples.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <CStep
        when="Dès demain"
        tone="blue"
        icon="rocket"
        title="Tester votre mini-plan"
        items={['Lancez la tâche n° 1 avec l’outil choisi', 'Créez votre document « Mes prompts »', 'Vérifiez l’outil autorisé par votre entreprise']}
        d={100}
      />
      <CStep
        when="Semaines 2 et 3"
        tone="violet"
        icon="tool"
        title="Ajouter un spécialiste"
        items={['Un nouvel outil par semaine, sur une vraie tâche', 'Gardez les prompts qui marchent', 'Abandonnez sans regret ce qui ne sert pas']}
        d={250}
      />
      <CStep
        when="Jour 30"
        tone="green"
        icon="chart"
        title="Mesurer et partager"
        items={['Combien de temps gagné par semaine ?', 'Partagez une astuce avec votre équipe', 'Identifiez une tâche à automatiser']}
        d={400}
      />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(700) }}>
      <Callout title="Le fil conducteur" tone="violet" icon="humanCheck" size={26}>
        L’IA propose, <strong>vous disposez</strong> : vous vérifiez, vous décidez, vous signez.
      </Callout>
    </div>
  </Frame>
);

// ─── Votre avis ─────────────────────────────────────────────────────────────
const C_Feedback: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Votre avis, à chaud</Title>
    <Lede>Deux votes à main levée avant de nous quitter. Le questionnaire d’évaluation détaillé suit par email.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Cette journée m’a été…
      </Eyebrow>
      <Poll>
        <PollRow id="c-f1" label="Très utile" tone="green" icon="star" />
        <PollRow id="c-f2" label="Utile" tone="blue" icon="checkCircle" />
        <PollRow id="c-f3" label="Moyennement utile" tone="yellow" icon="smile" />
        <PollRow id="c-f4" label="Peu utile" tone="coral" icon="alert" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        L’outil que j’utilise dès demain
      </Eyebrow>
      <Poll>
        <PollRow id="c-t1" label="Un assistant : ChatGPT, Copilot, Gemini, Claude" tone="blue" icon="chat" />
        <PollRow id="c-t2" label="Perplexity ou NotebookLM" tone="teal" icon="search" />
        <PollRow id="c-t3" label="DeepL, Grammarly ou Gamma" tone="green" icon="pen" />
        <PollRow id="c-t4" label="Fireflies, Otter ou Notion AI" tone="yellow" icon="mic" />
        <PollRow id="c-t5" label="Canva, Firefly, Runway ou CapCut" tone="pink" icon="image" />
      </Poll>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const C_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 1000 }}>
      <Eyebrow c={C.violet} cls={A.in}>
        Fin de la formation
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '20px 0 0', fontFamily: display, fontWeight: 800, fontSize: 130, lineHeight: 1, letterSpacing: '-0.03em', color: C.navy, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '34px 0 0', fontSize: 34, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        Vingt outils, une méthode, et une règle :<br />
        <strong style={{ color: C.plum }}>l’IA propose, vous disposez.</strong>
      </p>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 26, lineHeight: 1.45, color: C.muted, ...dl(360) }}>
        Des questions ? C’est le moment.
      </p>
    </div>
    <Portrait w={170} x={390} y={690} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 610, top: 715, ...dl(400) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · productivité augmentée</div>
    </div>
    <div style={{ position: 'absolute', left: 1440, top: 230, width: 400, display: 'grid', gridTemplateColumns: 'repeat(4, 84px)', gap: 12 }}>
      {PROG20.map((id, i) => (
        <div key={i} className={A.pop} style={dl(500 + i * 50)}>
          <div className={A.float} style={dl((i % 4) * 400)}>
            <ToolTile id={id} size={84} />
          </div>
        </div>
      ))}
    </div>
    <Footer left={390} />
  </Frame>
);
C_Thanks.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [C_Memo, C_Quiz, C_AutoPos, C_Next, C_Feedback, C_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · LE MÉMO · 17:20

OBJECTIF — Synthétiser les 20 outils par usage.

DIRE — « Voici la page à photographier. Les neuf verbes de ce matin, et pour chacun les outils de la journée qui y répondent le mieux. Vous n’avez pas besoin des vingt : commencez par un assistant, puis ajoutez le spécialiste de la tâche qui vous coûte le plus de temps. »

ANIMATION — Laisser une minute pour photographier.

TRANSITION — « Un dernier quiz, sur toute la journée. »`,
  `⏱ 5 min · GRAND QUIZ

OBJECTIF — Évaluer les acquis transversaux : fonctionnement, prompting, choix d’outils, posture.

DIRE — « Six questions, une par grand thème de la journée. Votez à main levée. »

ANIMATION — Faire répondre en équipe (moitié de salle contre moitié) pour l’énergie de fin de journée.

TRANSITION — « Mesurons votre progression. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression par rapport au début de journée.

DIRE — « Les mêmes huit affirmations que ce matin. Cochez ce que vous savez faire maintenant. Comparez avec votre score du matin. » Faire annoncer quelques progressions à voix haute.

INSISTER — Les points non cochés indiquent quoi revoir : le mémo et les pages d’outils restent disponibles.

TRANSITION — « Et maintenant, comment ne pas tout oublier ? »`,
  `⏱ 3 min · LES 30 PROCHAINS JOURS

OBJECTIF — Ancrer la mise en pratique.

DIRE — « Dès demain : testez votre mini-plan et créez votre document “Mes prompts”. Semaines deux et trois : un nouvel outil par semaine, sur une vraie tâche. Jour trente : mesurez le temps gagné et partagez une astuce. Et gardez en tête le fil conducteur : l’IA propose, vous disposez. »

TRANSITION — « Votre avis, avant de nous quitter. »`,
  `⏱ 3 min · VOTRE AVIS (sondage)

OBJECTIF — Recueillir un retour à chaud et l’intention d’usage.

DIRE — « Deux votes. L’utilité de la journée, et l’outil que vous utilisez dès demain. Le questionnaire détaillé vous arrive par email. »

ANIMATION — Cliquer une ligne par main levée. Commenter le second vote : c’est un bon indicateur d’engagement.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 2 min · MERCI

OBJECTIF — Clore et ouvrir les questions.

DIRE — « Merci pour votre énergie et votre curiosité. Vingt outils, une méthode, et une règle : l’IA propose, vous disposez. Je reste disponible pour vos questions, maintenant ou après la formation. »

ANIMATION — Laisser la page affichée pendant les questions et les échanges informels.`,
];
// @@NOTES-END
