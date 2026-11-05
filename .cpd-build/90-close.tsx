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
  <Frame mod={9} kind="synthese">
    <Title>Les 10 clés à emporter</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
      <CKey n={1} tone="blue" title="Copilot prédit, il ne vérifie pas" d={100}>
        Plausible n’est pas correct : la preuve, ce sont vos tests.
      </CKey>
      <CKey n={2} tone="navy" title="Un poste réglé, des gestes au clavier" d={150}>
        Tab, Échap, Ctrl+→, Alt+], Ctrl+I, Ctrl+Alt+I.
      </CKey>
      <CKey n={3} tone="teal" title="Le contexte fait la suggestion" d={200}>
        Onglets utiles ouverts, références explicites, conversation propre.
      </CKey>
      <CKey n={4} tone="green" title="Le commentaire est un prompt" d={250}>
        Entrée, sortie, règle, exemple, contrainte.
      </CKey>
      <CKey n={5} tone="blue" title="La signature d’abord" d={300}>
        Contrat, corps, test : une fonction à la fois.
      </CKey>
      <CKey n={6} tone="coral" title="Les six oublis" d={350}>
        Vide, null, mutation, égalités, bornes, entrée invalide.
      </CKey>
      <CKey n={7} tone="violet" title="Refactoring ≠ correction" d={400}>
        Même comportement, tests verts, deux commits.
      </CKey>
      <CKey n={8} tone="pink" title="Un test doit pouvoir échouer" d={450}>
        Liste des cas d’abord, mutation pour prouver le filet.
      </CKey>
      <CKey n={9} tone="yellow" title="La checklist avant Tab" d={500}>
        Logique, performances, sécurité, licence.
      </CKey>
      <CKey n={10} tone="green" title="Les règles dans le dépôt" d={550}>
        copilot-instructions.md : l’équipe et Copilot partagent les conventions.
      </CKey>
    </div>
  </Frame>
);

const C_AutoPos: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Auto-positionnement final : mesurez le chemin parcouru</Title>
    <Lede>Les mêmes huit compétences qu’hier matin. Comptez pour vous, puis comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="af1" size={26}>Expliquer ce qu’est un LLM et pourquoi Copilot peut se tromper</CheckItem>
        <CheckItem id="af2" size={26}>Installer Copilot dans VS Code et vérifier ma licence</CheckItem>
        <CheckItem id="af3" size={26}>Accepter, refuser ou parcourir les suggestions au clavier</CheckItem>
        <CheckItem id="af4" size={26}>Choisir entre suggestion inline, chat en ligne et vue Chat</CheckItem>
        <CheckItem id="af5" size={26}>Écrire un commentaire qui guide une génération précise</CheckItem>
        <CheckItem id="af6" size={26}>Refactorer un code sans changer son comportement</CheckItem>
        <CheckItem id="af7" size={26}>Faire générer des tests et vérifier leurs assertions</CheckItem>
        <CheckItem id="af8" size={26}>Relire du code généré : logique, performance, sécurité, licence</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau aujourd’hui"
          levels={[
            { min: 0, text: 'Les bases sont posées : pratiquez avec le guide.', tone: 'grey' },
            { min: 4, text: 'Autonome : gardez la checklist à côté.', tone: 'blue' },
            { min: 7, text: 'Prêt à l’enseigner à votre équipe !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Au micro : de combien de points avez-vous progressé ?</div>
      </div>
    </Checklist>
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
  <Frame mod={9}>
    <Title>Votre plan d’action : 30 jours pour en faire un réflexe</Title>
    <Lede>Écrivez-le dans votre JOURNAL.md, avec une date pour chaque ligne.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <CHorizon icon="rocket" tone="blue" when="Lundi" title="Le poste et les gestes" d={100}>
        Vos réglages dans le projet, les 8 gestes au clavier, et une première tâche répétitive confiée à Copilot.
      </CHorizon>
      <CHorizon icon="flask" tone="green" when="Semaine 2" title="Des tests sur l’existant" d={220}>
        Une fonction importante de votre projet, sa liste de cas, ses tests générés… et une mutation pour les vérifier.
      </CHorizon>
      <CHorizon icon="users" tone="violet" when="Fin du mois" title="Les règles de l’équipe" d={340}>
        Un copilot-instructions.md proposé à l’équipe, et la checklist de relecture partagée en revue de code.
      </CHorizon>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Le bon indicateur" size={24} cls={A.in} style={dl(600)}>
        Pas « combien de lignes Copilot a écrites », mais « combien de suggestions j’ai refusées à bon escient, et combien de tests protègent mon code ».
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
  <Frame mod={9}>
    <Title>Ressources pour continuer</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1000, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CRes icon="archive" tone="green" title="Votre kit d’ateliers" d={100}>
        Bouton « Labs » de ce support : dépôt TaskFlow, guide PDF des 8 ateliers, points de reprise.
      </CRes>
      <CRes icon="book" tone="blue" title="Documentation VS Code" d={180}>
        code.visualstudio.com/docs/copilot · aide-mémoire des fonctionnalités et raccourcis
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
        Le niveau suivant : prompts structurés, modes Plan et Agent, tests d’intégration, audit de sécurité et intégration CI.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted }}>Formation Docaposte Institute « GitHub Copilot · Niveau avancé ».</div>
      </Card>
    </div>
  </Frame>
);

const C_Eval: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Votre avis compte : évaluation de la formation</Title>
    <Lede>Le questionnaire de satisfaction arrive dans le clavardage. Cinq minutes, maintenant, pendant que tout est frais.</Lede>
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
  <Frame mod={9} chrome={false}>
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
export const __pages = [C_Cles, C_AutoPos, C_Plan, C_Ressources, C_Eval, C_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · LES 10 CLÉS · 17:15

OBJECTIF — Récapituler la formation en dix réflexes.

DIRE — « Dix clés, une par ligne. Si vous n’en gardez qu’une : Copilot prédit, il ne vérifie pas ; la preuve, ce sont vos tests. Tout le reste en découle : le contexte, le commentaire, la signature d’abord, les six oublis, refactoring et correction séparés, des tests qui peuvent échouer, la checklist avant Tab, et des règles d’équipe dans le dépôt. »

TRANSITION — « Mesurons le chemin parcouru. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression (exigence du dispositif d’évaluation).

DIRE — « Les mêmes huit compétences qu’hier matin. Comptez pour vous, puis comparez avec votre score de départ noté dans le journal. Au micro : de combien de points avez-vous progressé ? »

ANIMATION — Cocher à l’écran un exemple puis décocher. Relever les compétences encore fragiles : les citer dans le plan d’action.

TRANSITION — « Comment ne pas tout oublier d’ici lundi ? Un plan. »`,
  `⏱ 2 min · PLAN D’ACTION

OBJECTIF — Transformer la formation en actions datées.

DIRE — « Trois horizons. Lundi : vos réglages et vos gestes, et une première tâche répétitive confiée à Copilot. Semaine deux : des tests générés sur une fonction importante de votre projet, vérifiés par une mutation. Fin du mois : un fichier d’instructions proposé à votre équipe. Et le bon indicateur : combien de suggestions vous avez refusées à bon escient. »

TRANSITION — « Les ressources pour continuer. »`,
  `⏱ 2 min · RESSOURCES

OBJECTIF — Donner les ressources de référence et la suite de parcours.

DIRE — « Votre kit d’ateliers reste à vous : le dépôt et le guide. La documentation de VS Code et de GitHub, le journal des nouveautés, et l’OWASP pour la sécurité. Et si vous voulez aller plus loin : la formation niveau avancé, avec les modes Plan et Agent, les tests d’intégration et l’audit de sécurité. »

TRANSITION — « Votre avis, maintenant. »`,
  `⏱ 5 min · ÉVALUATION (minuteur 5 min)

OBJECTIF — Recueillir la satisfaction à chaud et le mot de la fin.

DIRE — « Le questionnaire est dans le clavardage : cinq minutes, maintenant. Dans quelques semaines, vous recevrez un questionnaire à froid. Puis, une phrase chacun au micro : ce que vous ferez différemment lundi. »

ANIMATION — Coller le lien du questionnaire. Lancer le minuteur. Tour de parole final dans l’ordre de la liste.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI

DIRE — « Merci pour votre énergie pendant ces deux jours. Copilot propose, vous disposez, et vous prouvez. Bon code à toutes et à tous, et à bientôt ! »`,
];
// @@NOTES-END
