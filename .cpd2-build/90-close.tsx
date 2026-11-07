// ─── Clôture ────────────────────────────────────────────────────────────────

const CKey = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.35, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const C_Cles: Page = () => (
  <Frame mod={12} kind="synthese">
    <Title>Les 10 clés à emporter</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
      <CKey n={1} tone="blue" title="Copilot prédit, il ne vérifie pas" d={100}>
        Plausible n’est pas correct : la preuve, ce sont vos tests.
      </CKey>
      <CKey n={2} tone="navy" title="Le plus petit mode qui suffit" d={150}>
        Inline, Ask, Plan, Agent ; modèle Auto ; un œil sur les crédits.
      </CKey>
      <CKey n={3} tone="teal" title="Un prompt en cinq ingrédients" d={200}>
        Objectif, contexte, contraintes, critères, format.
      </CKey>
      <CKey n={4} tone="green" title="Un plan relu avant l’agent" d={250}>
        Le plan corrigé devient la spécification.
      </CKey>
      <CKey n={5} tone="blue" title="Les règles du projet dans un fichier" d={300}>
        Court, versionné, prouvé par un test A/B.
      </CKey>
      <CKey n={6} tone="navy" title="Régler le harnais d’abord" d={350}>
        Outils minimaux, permissions manuelles, auto-approbation précise.
      </CKey>
      <CKey n={7} tone="violet" title="Un agent et une skill par métier" d={400}>
        Un rôle, ses outils, sa méthode : écrits une fois, réutilisés.
      </CKey>
      <CKey n={8} tone="pink" title="Un test doit pouvoir échouer" d={450}>
        Couverture relue, mutation, définition de fini.
      </CKey>
      <CKey n={9} tone="coral" title="Une donnée n’est jamais un ordre" d={500}>
        MCP, fichiers, pages web : lire ce qu’ils renvoient.
      </CKey>
      <CKey n={10} tone="yellow" title="Vous signez le code" d={550}>
        Checklist, relecteur en lecture seule, tests : puis seulement, le commit.
      </CKey>
    </div>
  </Frame>
);

const CHorizon = ({ icon, tone, when, title, children, d }: { icon: IconName; tone: Tone; when: string; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div>
        <Eyebrow c={T[tone].fg} size={18}>
          {when}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
      </div>
    </div>
    <div style={{ marginTop: 14, fontSize: 22, color: C.soft, lineHeight: 1.45 }}>{children}</div>
  </div>
);

const C_Plan: Page = () => (
  <Frame mod={12}>
    <Title>Votre plan d’action : 30 jours pour en faire un réflexe</Title>
    <Lede>Écrivez-le dans votre JOURNAL.md, avec une date pour chaque ligne.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <CHorizon icon="rocket" tone="blue" when="Lundi" title="Instructions et première tâche" d={100}>
        Les instructions de votre projet, testées en A/B, et une première tâche confiée à l’agent, plan relu d’abord.
      </CHorizon>
      <CHorizon icon="flask" tone="green" when="Semaine 2" title="Une skill de tests" d={220}>
        Une skill de tests avec sa définition de fini, appliquée à une fonction importante de votre projet.
      </CHorizon>
      <CHorizon icon="users" tone="violet" when="Fin du mois" title="Partager avec l’équipe" d={340}>
        Un agent Relecteur et vos skills proposés à l’équipe, dans le dépôt ou dans un plugin.
      </CHorizon>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Le bon indicateur" size={24} cls={A.in} style={dl(600)}>
        Pas « combien de lignes l’agent a écrites », mais « combien de ses propositions j’ai refusées à bon escient, et combien de tests protègent mon code ».
      </Callout>
    </div>
  </Frame>
);

const CRes = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Row2 icon={icon} tone={tone} title={title} d={d}>
    {children}
  </Row2>
);

const C_Ressources: Page = () => (
  <Frame mod={12}>
    <Title>Ressources pour continuer</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1000, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CRes icon="archive" tone="green" title="Votre kit d’ateliers" d={100}>
        Le dépôt modèle parafo-copilot, le bouton « Labs » de ce support, les 9 énoncés et les points de reprise.
      </CRes>
      <CRes icon="book" tone="blue" title="Documentation VS Code" d={180}>
        code.visualstudio.com/docs/agents · harnais, agents, skills, MCP, plugins
      </CRes>
      <CRes icon="doc" tone="navy" title="Documentation GitHub Copilot" d={260}>
        docs.github.com/copilot · offres, réglages, confidentialité
      </CRes>
      <CRes icon="bolt" tone="coral" title="Le journal des nouveautés" d={340}>
        github.blog/changelog, étiquette « copilot » : les nouveautés chaque semaine
      </CRes>
      <CRes icon="shield" tone="violet" title="Sécurité du code" d={420}>
        OWASP Top 10 · owasp.org : les failles à connaître, avec des exemples
      </CRes>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 210, width: 600, ...dl(300) }}>
      <Card icon="git" tone="teal" title="Pour aller plus loin" size={22} pad={26}>
        Le niveau suivant : hooks, places de marché, agent cloud, automatisations, tests d’intégration et intégration CI.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted }}>Formation Docaposte Institute « GitHub Copilot · Niveau avancé ».</div>
      </Card>
    </div>
  </Frame>
);

const C_Eval: Page = () => (
  <Frame mod={12} kind="exercice">
    <Title>Votre avis compte : évaluation de la formation</Title>
    <Lede>Le questionnaire de satisfaction arrive dans le Chat. Cinq minutes, maintenant, pendant que tout est frais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CKey n={1} tone="blue" title="Questionnaire « à chaud »" d={100}>
        Contenu, rythme, ateliers, animation : soyez francs, c’est ce qui améliore la formation.
      </CKey>
      <CKey n={2} tone="violet" title="Questionnaire « à froid »" d={200}>
        Dans quelques semaines : ce que vous avez réellement mis en pratique.
      </CKey>
      <CKey n={3} tone="green" title="Le mot de la fin, au micro" d={300}>
        Une phrase chacun : ce que vous ferez différemment lundi.
      </CKey>
    </div>
    <Timer id="evaluation" minutes={5} label="Questionnaire" cls={A.right} style={{ position: 'absolute', left: 1240, top: 280, width: 560, ...dl(300) }} />
  </Frame>
);

const C_Merci: Page = () => (
  <Frame mod={12} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 200, width: 1400 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: '-0.02em', color: C.navy }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '34px 0 0', fontSize: 34, lineHeight: 1.45, color: C.soft, maxWidth: 1100, ...dl(200) }}>
        Copilot propose, <strong style={{ color: C.navy }}>vous disposez</strong>… et vous prouvez. Bon code à toutes et à tous !
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 560, ...dl(700) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au développement</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 790, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
C_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [C_Cles, C_Plan, C_Ressources, C_Eval, C_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · LES 10 CLÉS · 17:24

OBJECTIF — Synthétiser les deux jours en dix réflexes.

DIRE — « Dix clés, dix réflexes. » (Les parcourir rapidement, en reliant chacune à un atelier : le mode à l’Atelier 2, le prompt et le plan au 3, les instructions au 4, le harnais au 5, l’agent et la skill au 6, la mutation au 7, l’injection au 8, la revue au 9.) « Si vous ne deviez en garder qu’une : vous signez le code. »

TRANSITION — « Comment en faire un réflexe ? Un plan d’action. »`,
  `⏱ 2 min · PLAN D’ACTION

OBJECTIF — Transformer la formation en actions datées.

DIRE — « Trois horizons. Lundi : les instructions de votre projet, testées en A/B, et une première tâche confiée à l’agent, plan relu d’abord. Semaine deux : une skill de tests avec sa définition de fini, sur une fonction importante de votre projet. Fin du mois : un agent Relecteur et vos skills, proposés à l’équipe dans le dépôt ou dans un plugin. Écrivez-le dans votre journal, avec une date pour chaque ligne. »

DIRE — « Et le bon indicateur : combien de propositions de l’agent vous avez refusées à bon escient, et combien de tests protègent votre code. »

TRANSITION — « Les ressources pour continuer. »`,
  `⏱ 2 min · RESSOURCES

OBJECTIF — Donner les ressources de référence et la suite de parcours.

DIRE — « Votre kit d’ateliers reste à vous : le dépôt et le guide. La documentation de VS Code et de GitHub, le journal des nouveautés, et l’OWASP pour la sécurité. Et si vous voulez aller plus loin : la formation niveau avancé, avec les modes Plan et Agent, les tests d’intégration et l’audit de sécurité. »

TRANSITION — « Votre avis, maintenant. »`,
  `⏱ 5 min · ÉVALUATION (minuteur 5 min)

OBJECTIF — Recueillir la satisfaction à chaud et le mot de la fin.

DIRE — « Le questionnaire est dans le Chat : cinq minutes, maintenant. Dans quelques semaines, vous recevrez un questionnaire à froid. Puis, une phrase chacun au micro : ce que vous ferez différemment lundi. »

ANIMATION — Coller le lien du questionnaire. Lancer le minuteur. Tour de parole final dans l’ordre de la liste.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI

DIRE — « Merci pour votre énergie pendant ces deux jours. Copilot propose, vous disposez, et vous prouvez. Bon code à toutes et à tous, et à bientôt ! »`,
];
// @@NOTES-END
