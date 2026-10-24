// ─── Close · The journey ────────────────────────────────────────────────────
const CLMod = ({ n, tone, title, d, children }: { n: number; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 28px' }}>
      <Num n={pad(n)} tone={tone} size={48} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const CL_Journey: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Deux jours, six modules : le chemin parcouru</Title>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <CLMod n={1} tone="blue" title="Introduction à l’IA" d={100}>
        Elle apprend d’exemples et prédit le mot probable, pas le vrai.
      </CLMod>
      <CLMod n={2} tone="teal" title="L’IA en gestion de projet" d={200}>
        Planifier, suivre, rendre compte, communiquer, en cinq ingrédients.
      </CLMod>
      <CLMod n={3} tone="yellow" title="Atelier 1" d={300}>
        Un plan généré en minutes, vérifié ligne par ligne.
      </CLMod>
      <CLMod n={4} tone="violet" title="Automatiser et collaborer" d={400}>
        Comptes rendus, tâches, alertes, bibliothèque d’équipe.
      </CLMod>
      <CLMod n={5} tone="coral" title="Limites et adoption" d={500}>
        Biais, erreurs, données : encadrer, puis embarquer l’équipe.
      </CLMod>
      <CLMod n={6} tone="green" title="Atelier 2" d={600}>
        Un projet complet, un imprévu, et l’IA sous contrôle.
      </CLMod>
    </div>
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
      q="Lesquelles de ces pratiques sont recommandées pour un chargé de projet ?"
      explain="L’IA prépare, l’humain décide et vérifie, sur des outils approuvés, avec des données protégées. C’est la conclusion de ces deux jours."
    >
      <Opt ok why="Oui : le contexte, c’est l’ingrédient qui réduit le plus les inventions.">
        Donner le contexte du projet et le format attendu
      </Opt>
      <Opt why="Piège ! Un compte rendu se relit : fausse décision, mauvaise personne, date inventée, point disparu.">
        Diffuser le compte rendu généré sans relecture
      </Opt>
      <Opt ok why="Oui : « Quelles durées as-tu supposées ? » révèle souvent les inventions.">
        Demander à l’IA ce qu’elle a supposé ou deviné
      </Opt>
      <Opt why="Piège ! Des CV dans un outil non approuvé : renseignements personnels exposés et tri biaisé.">
        Classer les CV des candidats avec un assistant gratuit
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Close · Personal action plan ───────────────────────────────────────────
const CLWhen = ({ d, tone, icon, when, children, ex }: { d: number; tone: Tone; icon: IconName; when: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{when}</div>
      <div style={{ marginTop: 10, fontSize: 29, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Exemple :</b> {ex}
      </div>
    </div>
  </div>
);

const CL_Action: Page = () => (
  <Frame mod={9} label="Clôture · Plan d’action">
    <Title>Votre plan d’action : trois engagements</Title>
    <Lede>Écrivez-les maintenant, dans un document à vous. Un engagement écrit a bien plus de chances d’être tenu.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <CLWhen d={100} tone="blue" icon="bolt" when="Cette semaine" ex="la demande de compte rendu à ma prochaine réunion.">
        Une demande de la bibliothèque, essayée sur un vrai cas.
      </CLWhen>
      <CLWhen d={250} tone="teal" icon="calendar" when="Ce mois-ci" ex="le rapport hebdo préparé avec l’IA, et le temps mesuré.">
        Un usage installé dans votre routine de projet.
      </CLWhen>
      <CLWhen d={400} tone="green" icon="users" when="Dans 3 mois" ex="une charte d’usage proposée et adoptée par l’équipe.">
        Une pratique partagée avec votre équipe.
      </CLWhen>
    </div>
    <Callout cls={A.in} title="Petit et précis" tone="yellow" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      « Faire mon compte rendu du mardi avec le modèle » plutôt que « utiliser l’IA plus souvent ».
    </Callout>
  </Frame>
);

// ─── Close · Toolbox ────────────────────────────────────────────────────────
const CLTool = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={24} cls={A.in} style={{ width: 540, height: 270, ...dl(d) }}>
    {children}
  </Card>
);

const CL_Toolbox: Page = () => (
  <Frame mod={9} label="Clôture · Boîte à outils">
    <Title>Votre boîte à outils</Title>
    <Lede>Tout ce que vous emportez de ces deux jours, à retrouver dans ce support.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <CLTool d={100} icon="list" tone="blue" title="Les cinq ingrédients">
        Rôle, contexte, tâche, format, contraintes. Module 2.
      </CLTool>
      <CLTool d={200} icon="book" tone="teal" title="La bibliothèque">
        Six demandes types : plan, compte rendu, rapport, message, risques, réunion. Module 4.
      </CLTool>
      <CLTool d={300} icon="check" tone="green" title="La grille de contrôle">
        Huit critères pour vérifier un plan généré. Atelier 1.
      </CLTool>
      <CLTool d={400} icon="filter" tone="coral" title="Le feu tricolore">
        Vert, jaune, rouge : quelles données dans quel outil. Module 5.
      </CLTool>
      <CLTool d={500} icon="shieldCheck" tone="violet" title="La charte d’équipe">
        Huit règles d’usage, à adapter avec votre équipe. Module 5.
      </CLTool>
      <CLTool d={600} icon="shield" tone="yellow" title="Pour aller plus loin">
        Commission d’accès à l’information du Québec (cai.gouv.qc.ca) et l’aide en ligne de vos outils.
      </CLTool>
    </div>
  </Frame>
);

// ─── Close · Thanks ─────────────────────────────────────────────────────────
const CL_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA124 · Fin
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 38, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        L’IA fait le premier jet. <Hl>Vous faites le dernier.</Hl>
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
  `⏱ 3 min · CLÔTURE (≈ 15 h 40)

OBJECTIF — Remettre en perspective le chemin parcouru.

DIRE — « Deux jours, six modules. Hier matin, on a compris ce qu'est l'IA : elle apprend d'exemples et prédit le mot probable, pas le vrai. On l'a appliquée à la gestion de projet, avec cinq ingrédients pour bien demander. On a généré un plan et appris à le vérifier. Ce matin, on a automatisé comptes rendus, tâches et alertes, on a parlé des biais, des erreurs, des données et de l'adoption en équipe. Et cet après-midi, vous avez tout mis en pratique. »

QUESTION — « Quel module vous servira le plus lundi ? »

TRANSITION — « Un dernier quiz, pour la route. »`,
  `⏱ 3 min · QUIZ FINAL (réponses multiples)

ANIMATION — Faites voter pour chaque option, cochez, validez, puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Le contexte réduit les inventions.
• B ✗ PIÈGE — Un compte rendu se relit, toujours.
• C ✓ — Demander ce qui a été supposé.
• D ✗ PIÈGE — Données personnelles et tri biaisé.

MESSAGE CLÉ — « L'IA prépare, vous décidez et vous vérifiez. »

TRANSITION — « Passons de la formation à votre quotidien. »`,
  `⏱ 5 min · PLAN D'ACTION PERSONNEL

OBJECTIF — Transformer la formation en engagements concrets.

ANIMATION — Chacun écrit ses trois engagements dans un document ou un carnet. Laissez 3 minutes de silence (caméras allumées si possible). Puis invitez 2 ou 3 personnes à en lire un au micro ; les autres peuvent en déposer un dans le clavardage.

DIRE — « Trois engagements. Cette semaine : une demande de la bibliothèque, essayée sur un vrai cas. Ce mois-ci : un usage installé dans votre routine, et le temps gagné mesuré. Dans trois mois : une pratique partagée avec votre équipe, une charte d'usage par exemple. »

INSISTER — « Petit et précis vaut mieux que grand et vague. "Utiliser l'IA plus souvent" ne marche pas ; "faire mon compte rendu du mardi avec le modèle" marche. »

TRANSITION — « Ce que vous emportez. »`,
  `⏱ 2 min · BOÎTE À OUTILS

DIRE — « Six outils à retrouver dans ce support : les cinq ingrédients, la bibliothèque de demandes, la grille de contrôle, le feu tricolore, la charte d'équipe, et des ressources : le site de la Commission d'accès à l'information du Québec pour la protection des renseignements personnels, et l'aide en ligne de vos outils, qui évoluent tous les mois. »

LOGISTIQUE — Indiquez comment les participants récupèrent le support (courriel, plateforme Technologia, lien de partage).

TRANSITION — « Il ne me reste qu'à vous remercier. »`,
  `⏱ 5 min · REMERCIEMENTS ET ÉVALUATION

DIRE — « Merci pour votre participation, vos questions et vos présentations. Une seule phrase à retenir : l'IA fait le premier jet, vous faites le dernier. »

ÉVALUATION — Laissez 5 minutes pour remplir l'évaluation de la formation (lien ou formulaire Technologia). Restez disponible pour les questions individuelles.

À PERSONNALISER — Vos coordonnées professionnelles si vous souhaitez être joint après la formation.

CLÔTURE — « Bon retour, et bons projets ! »`,
];
// @@NOTES-END
