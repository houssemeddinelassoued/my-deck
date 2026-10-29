// ─── M7 · The final project ─────────────────────────────────────────────────
const M7_Project: Page = () => (
  <Frame mod={7} kind="lab">
    <Title>Le projet : taches, un gestionnaire de tâches en ligne de commande</Title>
    <Lede>Petit, complet, et entièrement spécifié : 6 commandes, des règles, des codes de sortie, des tests d’acceptation.</Lede>
    <Term cls={A.in} title="python -m taches" size={21} style={{ position: 'absolute', left: 120, top: 280, width: 960, ...dl(100) }}>
      <Pr>taches ajouter "Préparer la démo" --priorite haute --echeance 2026-11-05 --etiquette ia</Pr>
      {'\n'}Tâche 1 ajoutée : Préparer la démo{'\n'}
      <Pr>taches ajouter "Relire la PR #42" --etiquette revue</Pr>
      {'\n'}Tâche 2 ajoutée : Relire la PR #42{'\n'}
      <Pr>taches lister</Pr>
      {'\n'}[ ] 1  haute    2026-11-05  Préparer la démo  #ia{'\n'}
      [ ] 2  normale  —           Relire la PR #42  #revue{'\n'}
      <Pr>taches terminer 1</Pr>
      {'\n'}Tâche 1 terminée{'\n'}
      <Pr>taches exporter --format csv</Pr>
      {'\n'}id,titre,priorite,echeance,etiquettes,terminee{'\n'}…
    </Term>
    <div style={{ position: 'absolute', left: 1140, top: 280, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.in} tone="blue" icon="doc" title="SPEC.md" size={22} style={dl(200)}>
        Les commandes, l’ordre d’affichage, les identifiants jamais réutilisés, les formats d’export, les codes de sortie 0 / 1 / 2.
      </Card>
      <Card cls={A.in} tone="green" icon="check" title="Tests d’acceptation" size={22} style={dl(300)}>
        16 en Python, 11 en TypeScript : tous rouges. Interdit de les modifier.
      </Card>
      <Card cls={A.in} tone="violet" icon="note" title="AGENTS.md" size={22} style={dl(400)}>
        Un gabarit d’instructions pour l’agent, à compléter en premier.
      </Card>
    </div>
  </Frame>
);

// ─── M7 · Team workflow with an agent ───────────────────────────────────────
const FlowStep = ({ n, x, icon, tone, title, sub }: { n: number; x: number; icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: 290, width: 260, height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <IconTile name={icon} tone={tone} size={48} />
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{sub}</div>
  </div>
);

const M7_Workflow: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Le flux de travail d’une équipe avec un agent</Title>
    <Lede>Ce qu’on fait au lab 11, et ce qu’on peut adopter dès lundi.</Lede>
    <FlowStep n={1} x={120} icon="note" tone="violet" title="Instructions" sub="AGENTS.md : conventions, commandes, interdits" />
    <FlowStep n={2} x={404} icon="map" tone="blue" title="Plan validé" sub="L’agent propose, vous corrigez, puis on code" />
    <FlowStep n={3} x={688} icon="code" tone="teal" title="Incréments" sub="Une commande à la fois, tests verts, commit" />
    <FlowStep n={4} x={972} icon="doc" tone="green" title="Documentation" sub="README généré, chaque exemple lancé" />
    <FlowStep n={5} x={1256} icon="eye" tone="yellow" title="PR et revue" sub="Description relue, revue IA, revue humaine" />
    <FlowStep n={6} x={1540} icon="star" tone="coral" title="Rétrospective" sub="Ce que l’agent a bien fait, 2 erreurs détectées" />
    <Callout cls={b.on(6)} title="Le principe" tone="blue" icon="humanCheck" size={25} style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      L’agent accélère chaque étape ; aucune étape ne disparaît. Les points de contrôle humains sont le plan, chaque diff, et la fusion.
    </Callout>
  </Frame>
);

// ─── Lab 11 ─────────────────────────────────────────────────────────────────
const L11_Brief: Page = () => (
  <LabBrief
    mod={7}
    n="11"
    title="Projet final, de la spécification à la PR"
    dur="55 min"
    folder="lab11-projet-final"
    objective="Développer de bout en bout un petit outil avec un agent (plan, code, tests, documentation, pull request revue) en suivant le flux d’une équipe."
    cmd={
      <>
        <Pr>pytest labs/lab11-projet-final</Pr>
        {'\n'}
        <Ko>16 failed</Ko>
        {'\n'}
        <Pr>npm run test:lab11</Pr>
        {'\n'}
        <Ko>ℹ fail 11</Ko>
      </>
    }
    deliverable="Tests d’acceptation verts + 5 tests à vous, README, AGENTS.md, NOTES.md, une PR revue sur votre fork."
  >
    <LabStep n={1} t="5 min" title="Préparer l’agent">
      Branche lab11, AGENTS.md complété avec l’IA
    </LabStep>
    <LabStep n={2} t="5 min" title="Plan avant le code">
      L’agent propose ; vous corrigez le découpage modele / depot / cli
    </LabStep>
    <LabStep n={3} t="25 min" title="Incréments">
      ajouter + lister, terminer / supprimer, en-retard, exporter
    </LabStep>
    <LabStep n={4} t="10 min" title="README et PR">
      Exemples vérifiés ; PR relue, revue IA, réponses aux commentaires
    </LabStep>
    <LabStep n={5} t="5 min" title="Rétrospective">
      NOTES.md : temps, réussites, 2 erreurs de l’agent
    </LabStep>
  </LabBrief>
);

const L11_Go: Page = () => (
  <LabGo mod={7} n="11" minutes={55} folder="lab11-projet-final">
    <CheckItem id="l11-1">AGENTS.md complété, plan validé</CheckItem>
    <CheckItem id="l11-2">ajouter + lister, puis terminer / supprimer</CheckItem>
    <CheckItem id="l11-3">en-retard et exporter : acceptation au vert</CheckItem>
    <CheckItem id="l11-4">5 tests unitaires à vous, README vérifié</CheckItem>
    <CheckItem id="l11-5">PR ouverte, revue, NOTES.md rédigé</CheckItem>
  </LabGo>
);

// ─── M7 · Presentations ─────────────────────────────────────────────────────
const Crit = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(100 + n * 100) }}>
    <Num n={n} tone="yellow" size={44} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.muted }}>{children}</div>
    </div>
  </div>
);

const M7_Present: Page = () => (
  <Frame mod={7} kind="atelier" label="Module 07 · Présentations">
    <Title>Vos présentations : 2 à 3 minutes en partage d’écran</Title>
    <Lede>Chacun son tour, dans l’ordre de la liste. Au-delà de 10 personnes : 5 ou 6 volontaires, les autres déposent une capture.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1000, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Crit n={1} title="La démo">
        Trois commandes de votre outil, en direct
      </Crit>
      <Crit n={2} title="Le chiffre">
        Tests verts, temps passé, nombre d’itérations
      </Crit>
      <Crit n={3} title="Une erreur de l’agent">
        Et comment vous l’avez détectée
      </Crit>
      <Crit n={4} title="Une leçon pour votre équipe">
        Ce que vous referiez, ce que vous éviteriez
      </Crit>
    </div>
    <Timer id="present" minutes={3} label="Présentation" cls={A.in} style={{ position: 'absolute', left: 1220, top: 290, width: 580, ...dl(400) }} />
    <Callout cls={A.in} title="Rétroaction" tone="green" icon="chat" size={24} style={{ position: 'absolute', left: 1220, top: 600, width: 580, ...dl(500) }}>
      Un point fort et une piste, au micro. Puis « participant suivant ».
    </Callout>
  </Frame>
);

// ─── M7 · Integrating AI in the company ─────────────────────────────────────
const Pillar = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 24px' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);
const Pb = ({ children, tone = 'blue' }: { children: ReactNode; tone?: Tone }) => (
  <Bullet size={22} tone={tone}>
    {children}
  </Bullet>
);

const M7_Enterprise: Page = () => (
  <Frame mod={7} beats={4}>
    <Title>Intégrer l’IA dans l’équipe : quatre chantiers</Title>
    <Lede>Les outils sont prêts. Ce qui fait la différence : les règles, les pratiques, la mesure, la formation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 22 }}>
      <Pillar n={1} icon="shield" tone="coral" title="Gouvernance">
        <Pb tone="coral">Outils et modèles autorisés</Pb>
        <Pb tone="coral">Offre entreprise : pas d’entraînement sur vos données</Pb>
        <Pb tone="coral">Filtre de code public, journalisation</Pb>
        <Pb tone="coral">Données interdites dans les demandes</Pb>
      </Pillar>
      <Pillar n={2} icon="note" tone="blue" title="Pratiques">
        <Pb>Instructions de projet versionnées</Pb>
        <Pb>Bibliothèque de demandes partagée</Pb>
        <Pb>Checklist dans le modèle de PR</Pb>
        <Pb>Agents sur branche, jamais sur main</Pb>
      </Pillar>
      <Pillar n={3} icon="chart" tone="green" title="Mesure">
        <Pb tone="green">Délai de cycle des PR</Pb>
        <Pb tone="green">Taux de défauts, retours arrière</Pb>
        <Pb tone="green">Couverture et score de mutation</Pb>
        <Pb tone="green">Ressenti de l’équipe, pas seulement la vitesse</Pb>
      </Pillar>
      <Pillar n={4} icon="users" tone="yellow" title="Adoption">
        <Pb tone="yellow">Un projet pilote, 4 à 6 semaines</Pb>
        <Pb tone="yellow">Des référents, une démo par sprint</Pb>
        <Pb tone="yellow">Partager les échecs, pas seulement les succès</Pb>
        <Pb tone="yellow">Garder les juniors dans la boucle</Pb>
      </Pillar>
    </div>
  </Frame>
);

// ─── M7 · Debrief poll ──────────────────────────────────────────────────────
const M7_Debrief: Page = () => (
  <Frame mod={7} label="Module 07 · Débriefing">
    <Title>Débriefing : où l’IA vous a-t-elle le plus aidé ?</Title>
    <Lede>Un numéro chacun, au micro. Puis : où vous a-t-elle le plus ralenti ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000 }}>
      <Poll cls={A.in} style={dl(100)}>
        <PollRow id="gen" icon="code" tone="blue" label="1 · Générer du code à partir d’une spec" />
        <PollRow id="refac" icon="loop" tone="teal" label="2 · Refactoriser, optimiser" />
        <PollRow id="debug" icon="bug" tone="coral" label="3 · Déboguer, expliquer une erreur" />
        <PollRow id="doc" icon="doc" tone="violet" label="4 · Documenter, faire la revue" />
        <PollRow id="tests" icon="check" tone="green" label="5 · Écrire des tests, le pipeline" />
        <PollRow id="archi" icon="map" tone="yellow" label="6 · Concevoir, planifier" />
      </Poll>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 280, width: 600, ...dl(300) }}>
      <Card tone="grey" icon="chat" title="Deux questions ouvertes" size={24}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <span>Quelle tâche ne confierez-vous jamais à un agent ?</span>
          <span>Quelle règle proposerez-vous à votre équipe la semaine prochaine ?</span>
        </div>
      </Card>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Project, M7_Workflow, L11_Brief, L11_Go, M7_Present, M7_Enterprise, M7_Debrief];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min

OBJECTIF — Présenter le projet final (programme : mise en place d'un projet avec l'IA).

DIRE — « Un gestionnaire de tâches en ligne de commande. Petit, mais complet : six commandes, un fichier JSON, des règles d'ordre, des exports, des codes de sortie. Tout est dans SPEC.md, et les tests d'acceptation sont tous rouges. »
« Vous allez le construire avec un agent, comme une équipe le ferait : instructions, plan, incréments, documentation, pull request revue. »

À SOULIGNER — Le programme parle de « projet collaboratif » : en classe virtuelle, chacun mène son propre projet, et la collaboration passe par la PR, la revue et vos présentations.

TRANSITION — « Le flux de travail. »`,
  `⏱ 3 min · 6 CLICS

→ beats 1 à 6 : une étape par clic.
1. « Instructions : c'est ce qui rend le travail reproductible pour toute une équipe. »
2. « Plan validé : jamais de code avant. »
3. « Incréments : une commande à la fois, tests verts, commit. »
4. « Documentation : chaque exemple du README est lancé. »
5. « PR et revue : la description est relue, une revue IA, puis la vôtre. »
6. « Rétrospective : ce que l'agent a bien fait, et deux erreurs que vous avez détectées. »
Callout : « L'agent accélère chaque étape ; aucune ne disparaît. »

TRANSITION — « Lab 11. »`,
  `⏱ 2 min · CONSIGNE DU LAB 11

DIRE — « Lab 11, labs/lab11-projet-final. 55 minutes. Points d'étape toutes les 15 minutes. Après, chacun présente en 2 à 3 minutes en partage d'écran. »
« Si vous n'avez pas fini : présentez ce qui marche. Le but n'est pas 100 % des tests, c'est la méthode. »

PIÈGES À ANNONCER — argparse appelle sys.exit sur une erreur : la spec exige un code retourné. Les identifiants ne sont jamais réutilisés. Node : pas de « constructor(readonly x) », le TypeScript est exécuté sans compilation.

TRANSITION — « C'est parti. »`,
  `⏱ 55 min · LAB 11 EN AUTONOMIE

ANIMATION — Points d'étape à 15, 30 et 45 minutes : « Quelles commandes passent ? Combien de tests verts ? » Cochez la checklist selon l'avancement du groupe.

SI QUELQU'UN EST TRÈS EN AVANCE — Bonus du README : commande modifier, tests d'acceptation écrits avant ; ou le job du lab 11 dans le pipeline du lab 09.

SI QUELQU'UN EST BLOQUÉ — Partage d'écran 2 minutes. Souvent : l'agent a tout écrit d'un coup ; revenir au plan, repartir d'une commande.

CORRIGÉS — Dans corriges/lab11-projet-final (réservé au formateur) : modele / depot / cli, en Python et en TypeScript.`,
  `⏱ 25 min · PRÉSENTATIONS (≈ 15 h 25)

ANIMATION — Appelez par prénom, dans l'ordre de la liste. Lancez le minuteur de 3 minutes à chaque présentation (bouton réinitialiser entre deux). Au-delà de 10 participants : 5 ou 6 volontaires, les autres déposent une capture de leur terminal dans le clavardage.

RÉTROACTION — Après chaque présentation : un point fort, une piste, au micro (vous ou un participant). « Participant suivant. »

À NOTER — Les erreurs de l'agent citées : elles nourrissent la page suivante.`,
  `⏱ 4 min · 4 CLICS

OBJECTIF — Bonnes pratiques pour l'intégration en entreprise (programme).

→ beat 1 : GOUVERNANCE — « Quels outils et modèles sont autorisés ? Une offre entreprise qui n'entraîne pas sur vos données ; le filtre de code public ; ce qu'on ne colle jamais : secrets, données clients. »
→ beat 2 : PRATIQUES — « Tout ce qu'on a fait en deux jours : instructions versionnées, bibliothèque de demandes, checklist dans le modèle de PR, agents sur une branche. »
→ beat 3 : MESURE — « Pas seulement la vitesse : délai de cycle des PR, défauts, retours arrière, couverture, mutation. Rappelez-vous l'étude METR : on se croit plus rapide. »
→ beat 4 : ADOPTION — « Un pilote de quelques semaines, des référents, partager les échecs. Et garder les juniors dans la boucle : ils doivent encore apprendre à lire et écrire du code. »

TRANSITION — « Votre bilan. »`,
  `⏱ 5 min · SONDAGE ET DÉBRIEFING

ANIMATION — Chacun annonce un numéro de 1 à 6 ; cliquez la ligne. Puis la question inverse : « où vous a-t-elle le plus ralenti ? » (réponses libres, au micro).

QUESTIONS OUVERTES — Deux ou trois réponses chacune. Notez les règles proposées : elles alimentent le plan d'action de la clôture.

TRANSITION — « Clôture. »`,
];
// @@NOTES-END
