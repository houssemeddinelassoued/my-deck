// ═══ Clôture ═════════════════════════════════════════════════════════════════

const CL_TILES: { n: number; tone: Tone; t: string; k: string }[] = [
  { n: 1, tone: 'blue', t: 'Automatiser', k: 'Quand… Si… Alors…' },
  { n: 2, tone: 'teal', t: 'Identifier', k: 'SIPOC, carte, score /20' },
  { n: 3, tone: 'blue', t: 'Les outils', k: 'Connecteur d’abord' },
  { n: 4, tone: 'teal', t: 'RPA', k: 'Le plan B à l’écran' },
  { n: 5, tone: 'violet', t: 'L’IA', k: 'Texte libre → champs' },
  { n: 6, tone: 'yellow', t: 'Premier flux', k: 'Le mapping' },
  { n: 7, tone: 'teal', t: 'Concevoir', k: 'La fiche en 8 rubriques' },
  { n: 8, tone: 'blue', t: 'Construire', k: 'IA → Parse JSON → routeur' },
  { n: 9, tone: 'yellow', t: 'Scénario complet', k: 'Module par module' },
  { n: 10, tone: 'green', t: 'Déployer', k: 'Tests, gain net, doc' },
];

const CL_Recap: Page = () => (
  <Frame mod={11} label="Clôture · Les deux jours en une page">
    <Title>Dix modules, dix réflexes</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
      {CL_TILES.map((x, i) => (
        <div key={x.n} className={A.pop} style={{ height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[x.tone]}`, padding: '24px 22px', ...dl(60 + i * 70) }}>
          <Num n={pad(x.n)} tone={x.tone} size={50} />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.05, color: C.ink }}>{x.t}</div>
          <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.35, color: C.soft }}>{x.k}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const CL_Plan: Page = () => (
  <Frame mod={11} label="Clôture · Plan d’action">
    <Title>Votre plan d’action en trois horizons</Title>
    <Lede>Écrivez-le dans votre carnet, puis une phrase au micro : ce que vous ferez cette semaine.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <Card tone="blue" icon="bolt" title="Cette semaine" size={25} cls={A.in} style={{ height: 470 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet>Faire relire votre fiche de conception</Bullet>
          <Bullet>Demander quels outils et données sont autorisés</Bullet>
          <Bullet>Exporter votre scénario (blueprint)</Bullet>
        </div>
      </Card>
      <Card tone="teal" icon="calendar" title="Ce mois-ci" size={25} cls={A.in} style={{ height: 470, ...dl(150) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet tone="teal">Construire votre workflow dans l’outil approuvé</Bullet>
          <Bullet tone="teal">Jouer le jeu de test complet</Bullet>
          <Bullet tone="teal">Deux semaines en parallèle du manuel</Bullet>
        </div>
      </Card>
      <Card tone="green" icon="trend" title="Ce trimestre" size={25} cls={A.in} style={{ height: 470, ...dl(300) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet tone="green">Mesurer le gain net réel</Bullet>
          <Bullet tone="green">Partager le résultat avec votre gestionnaire</Bullet>
          <Bullet tone="green">Choisir la deuxième tâche de votre liste</Bullet>
        </div>
      </Card>
    </div>
    <Timer id="cl-plan" minutes={8} label="Plan d’action" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 800, ...dl(500) }} />
  </Frame>
);

const CL_RES: { icon: IconName; tone: Tone; t: string; s: string }[] = [
  { icon: 'book', tone: 'violet', t: 'Make Academy', s: 'academy.make.com · cours gratuits, du débutant à l’avancé' },
  { icon: 'doc', tone: 'blue', t: 'Aide de Make', s: 'help.make.com · modules, fonctions, gestion des erreurs' },
  { icon: 'bot', tone: 'teal', t: 'Power Automate Desktop', s: 'learn.microsoft.com · documentation et tutoriels en français' },
  { icon: 'sparkles', tone: 'violet', t: 'Google AI Studio', s: 'ai.google.dev · clés, modèles, conditions de l’offre gratuite' },
  { icon: 'puzzle', tone: 'green', t: 'Zapier et n8n', s: 'zapier.com/learn · docs.n8n.io · pour comparer' },
  { icon: 'shield', tone: 'coral', t: 'Loi 25', s: 'cai.gouv.qc.ca · obligations sur les renseignements personnels' },
];

const CL_Ressources: Page = () => (
  <Frame mod={11} label="Clôture · Pour aller plus loin">
    <Title>Pour continuer après la formation</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {CL_RES.map((r, i) => (
        <Card key={r.t} tone={r.tone} icon={r.icon} title={r.t} size={23} cls={A.in} style={{ height: 250, ...dl(60 + i * 80) }}>
          {r.s}
        </Card>
      ))}
    </div>
    <Callout cls={A.in} title="Votre carnet" icon="note" tone="blue" style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      Tâches, score, SIPOC, prompt, fiche de conception, tests, gain : vous repartez avec un dossier complet pour convaincre et construire.
    </Callout>
  </Frame>
);

const CL_Merci: Page = () => (
  <Frame mod={11} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <Squares s={300} x={1400} y={330} delay={200} />
    <div style={{ position: 'absolute', left: 120, top: 380, width: 1100 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.ink }}>
        {LIGHT ? 'À bientôt !' : 'Merci !'}
      </h1>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 36, lineHeight: 1.35, color: C.soft, ...dl(150) }}>
        {LIGHT
          ? 'Avant la formation : créez vos comptes gratuits (Make, Google) et pensez à une tâche répétitive de votre travail. Le guide du participant explique tout.'
          : 'Votre avis compte : prenez trois minutes pour remplir l’évaluation de la formation.'}
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 22, ...dl(300) }}>
        <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
        <div>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
          <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia · IA135</div>
        </div>
      </div>
    </div>
    <Footer2 />
  </Frame>
);
CL_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [CL_Recap, CL_Plan, CL_Ressources, CL_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · CLÔTURE

OBJECTIF — Récapituler les deux jours en dix réflexes.

DIRE — Parcourez les tuiles, une phrase chacune. « Si vous ne gardez qu'une chose : on comprend et on simplifie avant d'automatiser, et l'IA travaille sous contrôle. »

TRANSITION — « Et maintenant, que ferez-vous lundi ? »`,
  `⏱ 8 min · PLAN D'ACTION

OBJECTIF — Engager chacun sur une action concrète.

ANIMATION — Laissez 3 minutes pour écrire dans le carnet. Puis lancez le minuteur : appelez chacun par son prénom, une phrase au micro : « Cette semaine, je… ».

ÉCOUTER — Les obstacles évoqués (outils non autorisés, données sensibles, temps) : répondez brièvement en renvoyant aux modules 3 et 10.`,
  `⏱ 2 min · RESSOURCES

DIRE — Parcourez les ressources. Collez la liste des liens dans le Chat.

PÉRISSABLE — Vérifiez les adresses avant la session.

TRANSITION — « Merci. »`,
  `⏱ 3 min · FIN

DIRE — « Merci pour votre énergie pendant ces deux jours. Vous repartez avec une tâche analysée, un workflow qui tourne, et la méthode pour en faire d'autres. »

LOGISTIQUE — Collez le lien de l'évaluation dans le Chat et laissez 3 minutes pour la remplir. Rappelez : supprimez votre clé d'API Gemini si vous ne l'utilisez plus (aistudio.google.com), et désactivez les scénarios Make de test.`,
];
// @@NOTES-END
