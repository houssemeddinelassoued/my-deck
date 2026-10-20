// ─── Module 8 · Synthèse et plan d'action ───────────────────────────────────

const M8_Section: Page = () => (
  <Section
    n={8}
    title={
      <>
        Synthèse et
        <br />
        plan d’action
      </>
    }
    sub="Rassembler ce que vous avez construit en deux jours, et repartir avec un plan applicable dès la semaine prochaine."
    dur="16:30 – 17:30"
    labs={
      <Tag tone="green" size={19}>
        Votre plan à 30 jours
      </Tag>
    }
  >
    <SecItem n={1}>Les deux jours en une page</SecItem>
    <SecItem n={2}>Le kit de l’équipe</SecItem>
    <SecItem n={3}>Votre plan d’action à 30 jours</SecItem>
    <SecItem n={4}>Auto-positionnement, QCM final, évaluation</SecItem>
  </Section>
);
M8_Section.transition = BLOOM;

// ─── Les deux jours en une page ─────────────────────────────────────────────
const M8Mod = ({ n, tone, title, idea, d }: { n: number; tone: Tone; title: string; idea: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `6px solid ${STRONG[tone]}`, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={`M${n}`} tone={tone} size={44} style={{ fontSize: 18 }} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, lineHeight: 1.2, color: C.navy }}>{title}</span>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{idea}</div>
  </div>
);

const M8_Recap: Page = () => (
  <Frame mod={8}>
    <Title>Les deux jours en une page</Title>
    <Lede>Une idée par module. Si vous ne deviez retenir qu’une page, ce serait celle-ci.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      <M8Mod n={1} tone="blue" title="Panorama" idea="Copilot pour Microsoft 365, Claude pour le long et le complexe." d={100} />
      <M8Mod n={2} tone="violet" title="Bien formuler" idea="Rôle, contexte, tâche, format, contraintes ; puis relancer." d={160} />
      <M8Mod n={3} tone="teal" title="Rédiger, synthétiser" idea="Trois passes, une source par fait, une relecture." d={220} />
      <M8Mod n={4} tone="coral" title="Sécurité" idea="Le feu tricolore, et un script n’est jamais lancé à l’aveugle." d={280} />
      <M8Mod n={5} tone="yellow" title="Retours" idea="Un gain se mesure : minutes × fréquence." d={340} />
      <M8Mod n={6} tone="blue" title="Analyser" idea="L’IA calcule ; vous vérifiez ; personne n’est une cause racine." d={400} />
      <M8Mod n={7} tone="green" title="Automatiser" idea="La marche la plus basse qui suffit, et huit cases avant la production." d={460} />
      <M8Mod n={8} tone="navy" title="Plan d’action" idea="Une automatisation complète vaut mieux que dix essais." d={520} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(800) }}>
      <Quote by="Le fil conducteur de la formation" style={{ paddingLeft: 84 }}>L’IA rédige, analyse et automatise ; le technicien vérifie et décide.</Quote>
    </div>
  </Frame>
);

// ─── Le kit de l'équipe ─────────────────────────────────────────────────────
const M8Kit = ({ icon, tone, title, items, d }: { icon: IconName; tone: Tone; title: string; items: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</span>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.5, color: C.soft }}>{items}</div>
  </div>
);

const M8_Kit: Page = () => (
  <Frame mod={8}>
    <Title>Le kit de l’équipe : ce que vous avez construit</Title>
    <Lede>Rien de tout cela ne doit rester sur un seul poste. Un espace partagé, un propriétaire par élément.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
      <M8Kit icon="note" tone="violet" title="Prompts" d={100} items="Communication d’incident, réponses types, synthèse en trois passes, article de base de connaissances." />
      <M8Kit icon="folder" tone="coral" title="Projets et agent" d={200} items="Projet « Reporting », agent « Assistant support » et ses vingt questions de test." />
      <M8Kit icon="route" tone="green" title="Flux et scripts" d={300} items="Flux du lundi, script d’inventaire, macro de consolidation, chacun avec sa fiche." />
      <M8Kit icon="shieldCheck" tone="blue" title="Règles" d={400} items="Feu tricolore, quatre règles des scripts, huit cases avant la production, règle d’équipe." />
      <M8Kit icon="chart" tone="teal" title="Mesure" d={500} items="Le compteur de temps gagné, tenu un mois, puis présenté au responsable." />
      <M8Kit icon="book" tone="yellow" title="Modèles" d={600} items="Procédure, article, post-mortem, fiche de changement, reporting : au format de la maison." />
    </div>
  </Frame>
);

// ─── Plan d'action à 30 jours ───────────────────────────────────────────────
const M8Line = ({ n }: { n: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '50px 1.6fr 1fr 1fr 1fr', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <Num n={n} tone="navy" size={40} />
    <span style={{ height: 34, borderBottom: `2px dashed ${C.faint}` }} />
    <span style={{ height: 34, borderBottom: `2px dashed ${C.faint}` }} />
    <span style={{ height: 34, borderBottom: `2px dashed ${C.faint}` }} />
    <span style={{ height: 34, borderBottom: `2px dashed ${C.faint}` }} />
  </div>
);

const M8_Plan: Page = () => (
  <Frame mod={8} kind="atelier">
    <Title>Votre plan d’action à 30 jours</Title>
    <Lede>Trois tâches, pas plus. Recopiez ce tableau dans OneNote ou sur papier : vous le relirez dans un mois.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '50px 1.6fr 1fr 1fr 1fr', gap: 14, fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.06em', color: C.muted, paddingBottom: 6 }}>
        <span />
        <span>TÂCHE</span>
        <span>MARCHE · OUTIL</span>
        <span>GAIN / MOIS</span>
        <span>D’ICI LE</span>
      </div>
      <M8Line n={1} />
      <M8Line n={2} />
      <M8Line n={3} />
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 22, color: C.soft }}>
        <div>
          <strong style={{ color: C.navy }}>Mon premier pas lundi :</strong> ……………
        </div>
        <div>
          <strong style={{ color: C.navy }}>Qui peut m’aider :</strong> ……………
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1350, top: 262, width: 450, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="m8-plan" minutes={8} label="Plan d’action" cls={A.right} style={{ width: 450, ...dl(200) }} />
      <Callout title="Conseil" tone="green" icon="target" size={22} cls={A.right} style={dl(350)}>
        Une tâche « gain rapide », une tâche de votre intersession, une tâche du module 7.
      </Callout>
    </div>
  </Frame>
);

// ─── Auto-positionnement de fin ─────────────────────────────────────────────
const M8_AutoPos: Page = () => (
  <Frame mod={8} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations qu’hier matin. Comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="af1">Dire quand utiliser Copilot plutôt que Claude, et pourquoi</CheckItem>
        <CheckItem id="af2">Écrire un prompt avec rôle, contexte, tâche, format et contraintes</CheckItem>
        <CheckItem id="af3">Réduire un rapport de 40 pages en une note d’une page fiable</CheckItem>
        <CheckItem id="af4">Transformer un ticket résolu en article de base de connaissances</CheckItem>
        <CheckItem id="af5">Faire produire un reporting commenté à partir d’un export Excel</CheckItem>
        <CheckItem id="af6">Mener une analyse « 5 pourquoi » sur un incident avec l’IA</CheckItem>
        <CheckItem id="af7">Créer un agent ou un flux qui automatise une tâche répétitive</CheckItem>
        <CheckItem id="af8">Faire écrire, expliquer et tester un script sans risque</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les fiches des modules : la pratique viendra.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : appliquez votre plan.', tone: 'blue' },
            { min: 7, text: 'Excellent : devenez le référent IA de l’équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Quelle affirmation a le plus progressé pour vous ? Un mot chacun.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── QCM final ──────────────────────────────────────────────────────────────
const M8_Qcm: Page = () => (
  <Frame mod={8} kind="quiz">
    <Title>QCM final : huit questions sur les deux jours</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pour résumer un long fil d’e-mails dans Outlook, quel outil en premier ?" explain="Microsoft 365 Copilot lit le fil sur place, sans copier-coller, dans la limite de vos droits.">
        <QOpt ok>Copilot dans Outlook</QOpt>
        <QOpt>Une IA grand public, en copiant le fil</QOpt>
        <QOpt>Aucun, c’est trop long</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient du prompt est le plus souvent oublié ?" explain="Le contexte : les faits, les documents, la situation. Sans lui, l’IA reste générique.">
        <QOpt>Le rôle</QOpt>
        <QOpt ok>Le contexte</QOpt>
        <QOpt>La politesse</QOpt>
      </QuizQ>
      <QuizQ q="Une synthèse de rapport est prête. Avant de l’envoyer…" explain="On vérifie la page source de chaque fait, trois chiffres, et ce qui a été écarté.">
        <QOpt>Je l’envoie, l’IA a tout lu</QOpt>
        <QOpt ok>Je vérifie sources, chiffres et oublis</QOpt>
        <QOpt>Je la raccourcis encore</QOpt>
      </QuizQ>
      <QuizQ q="Un export de tickets avec noms d’utilisateurs est classé…" explain="Orange : on anonymise d’abord, en local, avant de le donner à l’IA.">
        <QOpt>Vert</QOpt>
        <QOpt ok>Orange</QOpt>
        <QOpt>Rouge</QOpt>
      </QuizQ>
      <QuizQ q="Le total de tickets calculé ne correspond pas au nombre de lignes. Vous…" explain="Ne publiez pas : cherchez l’écart (lignes vides, doublons, filtres) et demandez combien de lignes ont été lues.">
        <QOpt>Arrondissez</QOpt>
        <QOpt ok>Cherchez l’écart avant de publier</QOpt>
        <QOpt>Gardez le chiffre de l’IA</QOpt>
      </QuizQ>
      <QuizQ q="La cause racine de l’incident FS-02 était…" explain="Un trou dans la procédure de changement, qui ne prévoyait pas de vérifier la supervision.">
        <QOpt>L’erreur d’un administrateur</QOpt>
        <QOpt ok>Un trou dans la procédure de changement</QOpt>
        <QOpt>Le disque, trop petit</QOpt>
      </QuizQ>
      <QuizQ q="Pour automatiser une réponse récurrente simple, la bonne marche est souvent…" explain="La plus basse qui suffit : un prompt enregistré ou un modèle, avant un agent ou un flux.">
        <QOpt>Un script</QOpt>
        <QOpt ok>Un prompt enregistré ou un modèle</QOpt>
        <QOpt>Un flux complet</QOpt>
      </QuizQ>
      <QuizQ q="Avant de lancer un script écrit par l’IA, il faut d’abord…" explain="Savoir l’expliquer ligne par ligne et vérifier qu’il ne modifie rien sans le vouloir, puis le tester sans risque.">
        <QOpt>Le lancer en administrateur</QOpt>
        <QOpt ok>Savoir l’expliquer et le tester sans risque</QOpt>
        <QOpt>Vérifier qu’il fait moins de dix lignes</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Ressources ─────────────────────────────────────────────────────────────
const M8Res = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M8_Ressources: Page = () => (
  <Frame mod={8}>
    <Title>Pour continuer après la formation</Title>
    <Lede>Les outils évoluent tous les mois. Ces sources restent à jour, contrairement à cette présentation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <M8Res icon="book" tone="blue" title="Microsoft Learn · Copilot" d={100}>
        Les fonctions de Copilot application par application, et la gestion des agents.
      </M8Res>
      <M8Res icon="book" tone="coral" title="Centre d’aide de Claude" d={200}>
        Projets, analyse de fichiers, paramètres de confidentialité.
      </M8Res>
      <M8Res icon="shieldCheck" tone="violet" title="CNIL · intelligence artificielle" d={300}>
        Recommandations sur les données personnelles et l’IA.
      </M8Res>
      <M8Res icon="scale" tone="teal" title="AI Act · règlement européen" d={400}>
        Les obligations et leur calendrier d’application.
      </M8Res>
      <M8Res icon="folder" tone="green" title="Le dossier Orvalis" d={500}>
        Tous les fichiers des labs, pour refaire les exercices à votre rythme.
      </M8Res>
      <M8Res icon="users" tone="yellow" title="Votre bibliothèque d’équipe" d={600}>
        La meilleure ressource : celle que vous enrichirez chaque semaine.
      </M8Res>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const M8_Merci: Page = () => (
  <Frame mod={11} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 900 }}>
      <Tag tone="green" size={22} cls={A.in}>
        <Icon name="checkCircle" size={22} /> Fin de la formation · 17:30
      </Tag>
      <h1 className={A.in} style={{ margin: '30px 0 0', fontFamily: display, fontWeight: 800, fontSize: 130, lineHeight: 1, letterSpacing: '-0.03em', color: C.navy, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, ...dl(240) }}>
        Deux jours, treize labs et ateliers, et un plan pour les trente prochains jours. Prenez cinq minutes pour l’<strong style={{ color: C.navy }}>évaluation à chaud</strong> : elle améliore les prochaines sessions.
      </p>
      <div className={A.in} style={{ marginTop: 40, display: 'flex', gap: 12, ...dl(400) }}>
        <Tag tone="violet" size={21}>
          <Icon name="chat" size={21} /> Prompts
        </Tag>
        <Tag tone="teal" size={21}>
          <Icon name="doc" size={21} /> Documents
        </Tag>
        <Tag tone="blue" size={21}>
          <Icon name="chart" size={21} /> Données
        </Tag>
        <Tag tone="green" size={21}>
          <Icon name="route" size={21} /> Automatisation
        </Tag>
      </div>
    </div>
    <Portrait w={260} x={1420} y={260} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 1420, top: 620, width: 400, ...dl(300) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft }}>Votre formateur</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 390, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.muted, ...dl(700) }}>
      <Icon name="bulb" size={28} color={C.violet} />
      « L’IA rédige, analyse et automatise ; le technicien vérifie et décide. »
    </div>
    <Footer left={390} />
  </Frame>
);
M8_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M8_Section, M8_Recap, M8_Kit, M8_Plan, M8_AutoPos, M8_Qcm, M8_Ressources, M8_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M8 · 16:30

OBJECTIF — Annoncer la synthèse et le plan d’action.

DIRE — « Dernière heure. On rassemble ce que vous avez construit, chacun écrit son plan à trente jours, on mesure le chemin parcouru, et on termine par le QCM final et l’évaluation. »

TRANSITION — « Les deux jours en une page. »`,
  `⏱ 4 min · LES DEUX JOURS EN UNE PAGE

OBJECTIF — Récapituler une idée par module.

DIRE — Lire chaque carte en une phrase, du module 1 au module 8. Puis le fil conducteur : « L’IA rédige, analyse et automatise ; le technicien vérifie et décide. »

QUESTION — « Si vous ne deviez garder qu’une carte, laquelle ? » Faire répondre deux ou trois personnes.

TRANSITION — « Et concrètement, qu’avez-vous construit ? »`,
  `⏱ 4 min · LE KIT DE L’ÉQUIPE

OBJECTIF — Faire prendre conscience du kit produit et organiser son partage.

DIRE — « En deux jours, vous avez produit un vrai kit : des prompts, un projet et un agent, un flux et des scripts, des règles, une mesure, des modèles. Rien de tout cela ne doit rester sur un seul poste. Un espace partagé, et un propriétaire par élément. »

ANIMATION — Désigner avec le groupe qui centralise le kit (souvent le delivery manager ou le responsable support).

TRANSITION — « Maintenant, votre plan à vous. »`,
  `⏱ 10 min · PLAN D’ACTION À 30 JOURS (minuteur 8 min)

OBJECTIF — Faire écrire un plan d’action personnel et réaliste.

DIRE — « Trois tâches, pas plus. Pour chacune : la marche et l’outil, le gain mensuel estimé, une date. Puis votre premier pas lundi, et qui peut vous aider. Conseil : une tâche gain rapide, une tâche de votre intersession, une tâche du module 7. »

ANIMATION — Lancer le minuteur. Faire lire deux plans à voix haute, en vérifiant qu’ils sont datés et mesurables.

TRANSITION — « Mesurons le chemin parcouru. »`,
  `⏱ 4 min · AUTO-POSITIONNEMENT DE FIN

OBJECTIF — Mesurer la progression par rapport au début du jour 1.

DIRE — « Les mêmes huit affirmations qu’hier matin. Cochez ce que vous savez faire maintenant. Comparez avec votre score de départ. Quelle affirmation a le plus progressé pour vous ? »

TRANSITION — « Le QCM final. »`,
  `⏱ 8 min · QCM FINAL

OBJECTIF — Évaluation sommative des acquis des deux jours.

DIRE — « Huit questions, une par grande notion. Vote à main levée, ou chacun note ses réponses sur papier. »

ANIMATION — Pour une évaluation individuelle, faire noter les réponses avant de cliquer. Le score « du premier coup » donne la tendance du groupe.

TRANSITION — « Pour continuer après aujourd’hui. »`,
  `⏱ 2 min · RESSOURCES

OBJECTIF — Donner des sources à jour pour la suite.

DIRE — « Les outils changent tous les mois : cette présentation vieillira, ces sources non. Microsoft Learn pour Copilot, le centre d’aide de Claude, la CNIL pour les données personnelles, le texte de l’AI Act. Le dossier Orvalis reste à votre disposition. Et la meilleure ressource sera votre bibliothèque d’équipe. »

TRANSITION — « Il est temps de conclure. »`,
  `⏱ 5 min · MERCI · 17:30

OBJECTIF — Clore la formation et lancer l’évaluation à chaud.

DIRE — « Merci à toutes et à tous pour ces deux jours. Vous avez fait treize labs et ateliers, et vous repartez avec un kit d’équipe et un plan pour les trente prochains jours. Dernière demande : cinq minutes pour l’évaluation à chaud, elle sert vraiment à améliorer les prochaines sessions. Et souvenez-vous : l’IA rédige, analyse et automatise ; c’est vous qui vérifiez et qui décidez. »

ANIMATION — Laisser la page affichée pendant l’évaluation. Rester disponible pour les questions individuelles.`,
];
// @@NOTES-END
