// ─── Clôture ────────────────────────────────────────────────────────────────

const C_Qcm: Page = () => (
  <Frame mod={12} kind="qcm">
    <Title>QCM final</Title>
    <QuizSeries y={190}>
      <QuizQ q="Claude répond avec stop_reason « tool_use ». Votre code…" explain="Il exécute chaque outil demandé, puis renvoie tous les tool_result dans un seul message user, et relance la requête avec l’historique complet.">
        <QOpt>s’arrête : la réponse est incomplète</QOpt>
        <QOpt>affiche le texte de la réponse</QOpt>
        <QOpt ok>exécute les outils et renvoie tous les résultats dans un message</QOpt>
        <QOpt>relance la même requête sans changement</QOpt>
      </QuizQ>
      <QuizQ q="Dans Guichet, la priorité d’une demande est…" explain="Le modèle extrait des faits ; une règle métier, en code, décide. Une injection dans le formulaire ne peut donc pas changer la priorité.">
        <QOpt ok>calculée par le code à partir des faits extraits</QOpt>
        <QOpt>décidée par Claude selon le ton du message</QOpt>
        <QOpt>donnée par le client dans le formulaire</QOpt>
        <QOpt>fixée à P1 par défaut</QOpt>
      </QuizQ>
      <QuizQ q="À quoi sert la clé d’idempotence ?" explain="Une demande soumise deux fois (double clic, nouvelle tentative) n’est enregistrée qu’une fois, et sans rappeler Claude.">
        <QOpt>à accélérer les réponses de Claude</QOpt>
        <QOpt>à chiffrer les demandes en base</QOpt>
        <QOpt>à remplacer la validation du schéma</QOpt>
        <QOpt ok>à n’enregistrer qu’une fois une demande soumise deux fois</QOpt>
      </QuizQ>
      <QuizQ q="« Ne jamais lire le fichier .env » se configure dans…" explain="Une interdiction absolue est une règle deny des permissions : elle s’applique quoi que le modèle décide.">
        <QOpt>CLAUDE.md</QOpt>
        <QOpt ok>une règle deny des permissions</QOpt>
        <QOpt>une Skill</QOpt>
        <QOpt>la description d’un sous-agent</QOpt>
      </QuizQ>
      <QuizQ q="Votre Skill ne se déclenche jamais. Cause la plus probable ?" explain="Claude ne lit au départ que le nom et la description : si elle ne dit pas quand l’utiliser, avec les mots de la demande, la Skill reste ignorée.">
        <QOpt ok>sa description ne dit pas quand l’utiliser</QOpt>
        <QOpt>son corps est trop court</QOpt>
        <QOpt>le modèle est trop petit</QOpt>
        <QOpt>il faut l’accompagner d’un serveur MCP</QOpt>
      </QuizQ>
      <QuizQ q="Un hook PreToolUse sort avec le code 2. Que se passe-t-il ?" explain="L’action prévue est bloquée et le message d’erreur du hook est renvoyé à Claude, qui peut s’adapter.">
        <QOpt>rien, le code 2 est ignoré</QOpt>
        <QOpt>la session se ferme</QOpt>
        <QOpt>le fichier concerné est supprimé</QOpt>
        <QOpt ok>l’action est bloquée et le message renvoyé à Claude</QOpt>
      </QuizQ>
      <QuizQ q="Lire les tickets d’un outil interne sans ligne de commande, avec connexion OAuth :" explain="Pas de CLI, une authentification, des données structurées : c’est le cas d’usage typique d’un serveur MCP.">
        <QOpt>un script bash dans le dépôt</QOpt>
        <QOpt ok>un serveur MCP</QOpt>
        <QOpt>une ligne dans CLAUDE.md</QOpt>
        <QOpt>un hook Stop</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi un sous-agent relecteur plutôt qu’une relecture dans la même session ?" explain="Son contexte est séparé : il ne voit pas les justifications de l’auteur et lit le code comme un collègue ; ses droits sont limités à la lecture.">
        <QOpt>il coûte toujours moins cher</QOpt>
        <QOpt>il a plus de droits que la session principale</QOpt>
        <QOpt ok>contexte séparé, sans les justifications de l’auteur, en lecture seule</QOpt>
        <QOpt>Claude Code l’impose</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Points clés ────────────────────────────────────────────────────────────
const CKey = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.4, marginTop: 2 }}>{children}</div>
    </div>
  </div>
);

const C_Cles: Page = () => (
  <Frame mod={12} kind="synthese">
    <Title>Les cinq idées à garder</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CKey n={1} tone="blue" title="Un prompt est du code" d={100}>
        Structuré, versionné, mesuré sur les mêmes tests à chaque version, relu à chaque changement de modèle.
      </CKey>
      <CKey n={2} tone="navy" title="Ce qui doit être vrai se vérifie par du code" d={200}>
        Schémas, garde, tests, permissions, hooks. Les consignes et le juge pour le reste, puis un humain.
      </CKey>
      <CKey n={3} tone="violet" title="Mesurer avant d’affirmer" d={300}>
        Un jeu de référence figé, un score par champ, le coût par tâche réussie.
      </CKey>
      <CKey n={4} tone="teal" title="Le modèle propose, votre code décide" d={400}>
        Tool use, données non fiables, règles métier en code, moindre privilège, idempotence.
      </CKey>
      <CKey n={5} tone="green" title="Un agent se configure comme un collègue" d={500}>
        Mémoire courte, droits clairs, procédures en Skills, contrôles en hooks, regard extérieur en sous-agent.
      </CKey>
    </div>
  </Frame>
);

// ─── Plan d'action ──────────────────────────────────────────────────────────
const C_Plan: Page = () => (
  <Frame mod={12} kind="exercice">
    <Title>Votre plan d’action, en trois horizons</Title>
    <Lede>Écrivez-le pour vous, dans votre propre document : une action concrète par horizon, sur un vrai projet.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="bolt" tone="blue" title="Lundi" size={24} pad={26} cls={A.in} style={dl(100)}>
        Un CLAUDE.md court et des permissions sur un dépôt réel de votre équipe.
        <div style={{ marginTop: 12, fontSize: 20, color: C.muted, fontStyle: 'italic' }}>Exemple : refuser .env et git push, autoriser les tests.</div>
      </Card>
      <Card icon="calendar" tone="navy" title="Dans un mois" size={24} pad={26} cls={A.in} style={dl(200)}>
        Une Skill pour votre procédure la plus répétée, et un hook qui lance vos tests ou votre linter.
        <div style={{ marginTop: 12, fontSize: 20, color: C.muted, fontStyle: 'italic' }}>Exemple : « ajouter un endpoint », « créer une migration ».</div>
      </Card>
      <Card icon="rocket" tone="violet" title="Dans un trimestre" size={24} pad={26} cls={A.in} style={dl(300)}>
        Un premier workflow automatisé, avec contrat, garde, évaluation… et une clé API.
        <div style={{ marginTop: 12, fontSize: 20, color: C.muted, fontStyle: 'italic' }}>Exemple : tri d’e-mails, extraction de documents, revue de PR.</div>
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout tone="green" icon="users" title="Tour rapide" size={24} cls={A.in} style={dl(500)}>
        Deux ou trois volontaires partagent leur action de lundi, en une phrase.
      </Callout>
    </div>
  </Frame>
);

// ─── Ressources ─────────────────────────────────────────────────────────────
const CRes = ({ icon, tone, title, url, children, d }: { icon: IconName; tone: Tone; title: string; url: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: T.blue.fg, marginTop: 2 }}>{url}</div>
      <div style={{ fontSize: 19, color: C.soft, marginTop: 4, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const C_Ressources: Page = () => (
  <Frame mod={12}>
    <Title>Pour aller plus loin</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
      <CRes icon="book" tone="blue" title="Documentation de l’API Claude" url="platform.claude.com/docs" d={100}>
        Modèles, sorties structurées, tool use, prompt caching, évaluations.
      </CRes>
      <CRes icon="terminal" tone="navy" title="Documentation de Claude Code" url="code.claude.com/docs" d={180}>
        Paramètres, permissions, Skills, sous-agents, hooks, MCP, plugins, bac à sable.
      </CRes>
      <CRes icon="note" tone="violet" title="Guide de prompt engineering" url="platform.claude.com/docs → prompt engineering" d={260}>
        Balises XML, exemples, long contexte, raisonnement, prompts système.
      </CRes>
      <CRes icon="plug" tone="teal" title="Model Context Protocol" url="modelcontextprotocol.io" d={340}>
        Spécification, SDK, serveurs de référence, bonnes pratiques de sécurité.
      </CRes>
      <CRes icon="git" tone="green" title="Votre dépôt Guichet" url={REPO} d={420}>
        Les 4 stacks, les énoncés, le guide PDF et ses annexes. Gardez-le comme modèle.
      </CRes>
      <CRes icon="archive" tone="pink" title="Le bonus de ce support" url="annexes après la clôture" d={500}>
        Docker et bac à sable : agents isolés et orchestrés en parallèle.
      </CRes>
    </div>
  </Frame>
);

// ─── Évaluation ─────────────────────────────────────────────────────────────
const C_Eval: Page = () => (
  <Frame mod={12}>
    <Title>Votre avis compte</Title>
    <Lede>Cinq minutes pour le questionnaire d’évaluation de {PROVIDER} : ce qui vous a servi, ce qui doit changer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Row2 icon="star" tone="yellow" title="Le contenu" d={100}>
        utile pour vos projets ? trop, ou pas assez, de quelque chose ?
      </Row2>
      <Row2 icon="flask" tone="green" title="Les ateliers" d={200}>
        le fil rouge, les reprises, le rythme
      </Row2>
      <Row2 icon="chat" tone="blue" title="Vos suggestions" d={300}>
        un sujet à approfondir dans une prochaine session ?
      </Row2>
    </div>
    <Timer id="evaluation" minutes={5} label="Questionnaire" cls={A.right} style={{ position: 'absolute', left: 1240, top: 290, width: 560, ...dl(300) }} />
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const C_Merci: Page = () => (
  <Frame mod={12} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 200, width: 1400 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.navy }}>
        Merci <span style={{ color: C.electric }}>!</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, maxWidth: 1100, ...dl(150) }}>
        Contraindre, vérifier, boucler, mesurer : Claude devient un collègue fiable quand le harnais tient le cadre.
      </p>
    </div>
    <Portrait w={170} x={390} y={600} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 624, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Questions, retours d’expérience : je reste joignable.</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', right: 120, top: 760, ...dl(600) }}>
      <LogoPlate which="both" h={84} pad={22} />
    </div>
    <Footer left={390} />
  </Frame>
);
C_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [C_Qcm, C_Cles, C_Plan, C_Ressources, C_Eval, C_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 7 min · QCM FINAL (vote oral)

OBJECTIF — Vérifier l’acquisition des notions du Jour 2.

DIRE — « Huit questions sur la journée, vote à voix haute. »

ANIMATION — Moins d’une minute par question. Si une question est ratée par la majorité, reprendre l’explication en une phrase.

TRANSITION — « Ce qu’il faut garder. »`,
  `⏱ 2 min · CINQ IDÉES À GARDER

OBJECTIF — Synthétiser les deux jours en cinq idées.

DIRE — « Un prompt est du code. Ce qui doit être vrai se vérifie par du code. On mesure avant d’affirmer. Le modèle propose, votre code décide. Et un agent se configure comme un collègue : mémoire courte, droits clairs, procédures, contrôles, regard extérieur. »

TRANSITION — « Et maintenant, chez vous. »`,
  `⏱ 3 min · PLAN D’ACTION

OBJECTIF — Faire écrire une action concrète par horizon.

DIRE — « Trois horizons. Lundi : un CLAUDE.md court et des permissions sur un vrai dépôt. Dans un mois : une Skill et un hook. Dans un trimestre : un premier workflow automatisé, avec contrat, garde et évaluation. Écrivez-les pour vous. »

ANIMATION — Deux ou trois volontaires partagent leur action de lundi, en une phrase.

TRANSITION — « Les ressources. »`,
  `⏱ 1 min · RESSOURCES

OBJECTIF — Donner les références officielles et rappeler le dépôt.

DIRE — « La documentation de l’API, celle de Claude Code, le guide de prompt engineering, le site de MCP. Et votre dépôt Guichet, avec le guide PDF et ses annexes : gardez-le comme modèle. »

TRANSITION — « Votre avis. »`,
  `⏱ 5 min · ÉVALUATION (minuteur 5 min)

OBJECTIF — Recueillir l’évaluation à chaud.

DIRE — « Cinq minutes pour le questionnaire de GoMyCode. Soyez précis : ce qui vous a servi, ce qui doit changer. »

ANIMATION — Lancer le minuteur. Donner le lien du questionnaire GoMyCode.

TRANSITION — « Merci. »`,
  `⏱ 1 min · MERCI · J2 15:30

OBJECTIF — Clore la formation.

DIRE — « Merci à toutes et à tous pour ces deux jours. Contraindre, vérifier, boucler, mesurer : avec un bon harnais, Claude devient un collègue fiable. Je reste joignable pour vos questions et vos retours d’expérience. »

ANIMATION — Annexes bonus après cette page : Docker et bac à sable, à montrer s’il reste du temps ou à consulter seul.`,
];
// @@NOTES-END
