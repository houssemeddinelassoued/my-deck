// ─── Close · The journey ────────────────────────────────────────────────────
const CLMod = ({ n, tone, title, labs, d, children }: { n: number; tone: Tone; title: string; labs: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Num n={pad(n)} tone={tone} size={44} />
      <Tag tone="green" size={17}>
        {labs}
      </Tag>
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const CL_Journey: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Deux jours, sept modules, douze labs</Title>
    <Lede>Du premier Tab à la pull request revue.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: 14 }}>
      <CLMod n={1} tone="blue" title="Panorama" labs="00 · 01" d={100}>
        Il prédit ; le contexte guide ; 4 modes.
      </CLMod>
      <CLMod n={2} tone="teal" title="Générer, réécrire" labs="02 · 03" d={170}>
        5 ingrédients, tests, petites étapes.
      </CLMod>
      <CLMod n={3} tone="coral" title="Déboguer, optimiser" labs="04 · 05" d={240}>
        Expliquer, mesurer, valider.
      </CLMod>
      <CLMod n={4} tone="violet" title="Doc et revue" labs="06 · 07" d={310}>
        Convention, exemples vérifiés, tri.
      </CLMod>
      <CLMod n={5} tone="green" title="Tests et CI/CD" labs="08 · 09" d={380}>
        Mutation, intégration, charge, pipeline.
      </CLMod>
      <CLMod n={6} tone="yellow" title="Architecture" labs="10" d={450}>
        Questions, options, ADR, audit.
      </CLMod>
      <CLMod n={7} tone="blue" title="Projet final" labs="11" d={520}>
        Un agent encadré, de la spec à la PR.
      </CLMod>
    </div>
    <Callout cls={A.in} title="Le fil des deux jours" tone="yellow" icon="humanCheck" size={27} style={{ position: 'absolute', left: 120, top: 680, width: 1680, ...dl(700) }}>
      L’IA propose, vous décidez, les tests tranchent. Vous restez l’auteur du code que vous fusionnez.
    </Callout>
  </Frame>
);

// ─── Close · Final quiz (multi) ─────────────────────────────────────────────
const CL_Quiz: Page = () => (
  <Frame mod={9} kind="qcm" beats={2} label="Clôture · Quiz final">
    <Title>
      <span style={{ color: C.violet }}>Quiz final</span> · Les bons réflexes
    </Title>
    <Qcm
      multi
      q="Lesquelles de ces pratiques recommanderiez-vous à votre équipe ?"
      explain="Contexte écrit une fois, critères objectifs, relecture des tests modifiés, données protégées : l’IA accélère sans que la qualité ne dépende de la chance."
    >
      <Opt ok why="Oui : des instructions versionnées donnent le même comportement à toute l’équipe.">Versionner un fichier d’instructions de projet</Opt>
      <Opt why="Piège ! Une PR dont l’agent a modifié les tests doit être relue en priorité, pas fusionnée plus vite.">
        Fusionner sans revue si l’agent annonce « tous les tests passent »
      </Opt>
      <Opt ok why="Oui : la couverture dit ce qui s’exécute ; la mutation dit ce qui est vérifié.">
        Juger une suite de tests générée par la mutation, pas seulement la couverture
      </Opt>
      <Opt why="Piège ! Un secret collé dans un outil non approuvé est un secret divulgué.">
        Coller la configuration de production pour déboguer plus vite
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Close · Personal action plan ───────────────────────────────────────────
const CLWhen = ({ d, tone, icon, when, children, ex }: { d: number; tone: Tone; icon: IconName; when: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={72} solid />
    <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{when}</div>
    <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.42, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 23, lineHeight: 1.4, color: C.ink }}>
      <b>Exemple :</b> {ex}
    </div>
  </div>
);

const CL_Action: Page = () => (
  <Frame mod={9} label="Clôture · Plan d’action">
    <Title>Votre plan d’action : trois engagements</Title>
    <Lede>Écrivez-les maintenant, dans un document à vous (la dernière page du guide PDF est prévue pour ça).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 30 }}>
      <CLWhen d={100} tone="blue" icon="bolt" when="Cette semaine" ex="le fichier d’instructions de mon dépôt, avec 5 règles.">
        Un usage essayé sur un vrai ticket.
      </CLWhen>
      <CLWhen d={250} tone="teal" icon="calendar" when="Ce mois-ci" ex="tests générés + mutation sur mon module le moins testé.">
        Une pratique installée dans votre routine.
      </CLWhen>
      <CLWhen d={400} tone="green" icon="users" when="Dans 3 mois" ex="un pilote d’agent sur un dépôt, avec des mesures avant / après.">
        Une pratique partagée avec l’équipe.
      </CLWhen>
    </div>
    <Callout cls={A.in} title="Petit et précis" tone="yellow" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      « Ajouter la checklist de validation à notre modèle de PR » plutôt que « utiliser l’IA plus souvent ».
    </Callout>
  </Frame>
);

// ─── Close · Toolbox ────────────────────────────────────────────────────────
const CLTool = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={23} cls={A.in} style={{ height: 250, ...dl(d) }}>
    {children}
  </Card>
);

const CL_Toolbox: Page = () => (
  <Frame mod={9} label="Clôture · Boîte à outils">
    <Title>Votre boîte à outils</Title>
    <Lede>Tout reste disponible après la formation : le dépôt, le guide PDF et ce support.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 26, columnGap: 26 }}>
      <CLTool d={100} icon="code" tone="blue" title="Le dépôt des labs">
        12 labs indépendants, Python et TypeScript, à refaire dans n’importe quel ordre.
      </CLTool>
      <CLTool d={180} icon="book" tone="teal" title="Le guide PDF">
        Une fiche par lab, le canevas de demande et l’aide-mémoire des commandes.
      </CLTool>
      <CLTool d={260} icon="list" tone="violet" title="Le canevas de demande">
        Contexte, tâche, contraintes, format, exemples. Module 2.
      </CLTool>
      <CLTool d={340} icon="check" tone="green" title="La checklist de validation">
        Cinq questions avant chaque Tab, diff ou fusion. Module 3.
      </CLTool>
      <CLTool d={420} icon="eye" tone="yellow" title="La grille de revue">
        Gravité, format de commentaire, verdict. Lab 07.
      </CLTool>
      <CLTool d={500} icon="note" tone="coral" title="Les gabarits">
        Instructions de projet, AGENTS.md, ADR, workflow CI. Labs 07 à 11.
      </CLTool>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, ...dl(600) }}>
      <RepoChip size={26} />
    </div>
  </Frame>
);

// ─── Close · Thanks ─────────────────────────────────────────────────────────
const CL_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA132 · Fin
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 38, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        L’IA écrit le premier jet. <Hl>Vous signez le commit.</Hl>
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 18, ...dl(400) }}>
        <IconTile name="star" tone="yellow" size={64} solid />
        <span style={{ fontSize: 30, fontWeight: 500, color: C.ink }}>Merci de remplir l’évaluation de la formation.</span>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(560) }}>
      <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>
    <Squares s={380} x={1270} y={330} delay={200} />
    <Footer2 />
  </Frame>
);
CL_Thanks.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [CL_Journey, CL_Quiz, CL_Action, CL_Toolbox, CL_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · CLÔTURE (≈ 15 h 45)

OBJECTIF — Remettre en perspective le chemin parcouru.

DIRE — Une phrase par module. « Hier : comprendre comment l'assistant produit du code, bien lui demander, refactoriser sans casser, déboguer en expliquant d'abord, optimiser en mesurant, et connaître ses limites. Aujourd'hui : documenter et faire la revue, tester jusqu'à la mutation et la charge, brancher le pipeline, concevoir et planifier, et un projet complet avec un agent. »
« Le fil : l'IA propose, vous décidez, les tests tranchent. »

QUESTION — « Quel module vous servira le plus lundi ? » Deux ou trois réponses.

TRANSITION — « Un dernier quiz. »`,
  `⏱ 3 min · QCM FINAL À RÉPONSES MULTIPLES

ANIMATION — Les participants annoncent leurs lettres ; cochez la majorité, « Valider », puis cliquez chaque option.

RÉPONSES — A et C.
• B ✗ PIÈGE — « Tous les tests passent » : relire d'abord le diff des tests.
• D ✗ PIÈGE — Les secrets ne se collent jamais.

TRANSITION — « Passons de la formation à votre quotidien. »`,
  `⏱ 6 min · PLAN D'ACTION

ANIMATION — « Prenez 3 minutes pour écrire vos trois engagements, dans un document à vous ou la dernière page du guide. » Minuteur facultatif. Puis tour rapide au micro, par prénom : un engagement chacun (celui de la semaine).

À SOULIGNER — Petit et précis. Reprenez les règles proposées au débriefing du module 7.`,
  `⏱ 2 min

DIRE — « Tout reste à vous : le dépôt et ses 12 labs, à refaire dans n'importe quel ordre ; le guide PDF ; les gabarits : instructions de projet, AGENTS.md, ADR, workflow CI. »
Collez une dernière fois le lien du dépôt dans le clavardage.

RAPPEL — Les corrigés ne sont pas dans le dépôt public ; si vous les partagez, faites-le après la formation.

TRANSITION — « Merci. »`,
  `⏱ 2 min · FIN

DIRE — « Merci pour votre participation et vos questions. L'IA écrit le premier jet ; c'est vous qui signez le commit. »
« Merci de remplir l'évaluation de la formation : elle m'aide vraiment à l'améliorer. »

LOGISTIQUE — Lien d'évaluation dans le clavardage. Restez quelques minutes connecté pour les questions individuelles.`,
];
// @@NOTES-END
