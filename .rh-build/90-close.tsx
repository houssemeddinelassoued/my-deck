// ─── Clôture ────────────────────────────────────────────────────────────────

// ─── Restitutions du cas pratique ───────────────────────────────────────────
const C_Restitution: Page = () => (
  <Frame mod={8} kind="atelier">
    <Title>Restitutions : trois minutes par binôme</Title>
    <Lede>Montrez votre chaîne, une vérification humaine qui a changé quelque chose, et ce que vous referez demain.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { n: 1, t: 'Le poste en une phrase', s: 'Le profil validé avec Julien, et le piège repéré dans sa note', tone: 'navy' as Tone },
        { n: 2, t: 'Votre meilleure trouvaille', s: 'Une accroche, une question d’entretien, un message de refus…', tone: 'blue' as Tone },
        { n: 3, t: 'Une correction humaine', s: 'Où l’IA s’est trompée ou a inventé, et comment vous l’avez vu', tone: 'coral' as Tone },
        { n: 4, t: 'Le temps gagné', s: 'Estimation honnête par rapport à votre façon de faire actuelle', tone: 'green' as Tone },
      ].map((x, i) => (
        <div key={x.n} className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px', ...dl(100 + i * 100) }}>
          <Num n={x.n} tone={x.tone} size={50} />
          <div>
            <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{x.t}</div>
            <div style={{ fontSize: 22, color: C.muted, lineHeight: 1.35 }}>{x.s}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Timer id="restitution" minutes={3} label="Restitution" cls={A.right} style={{ width: 560, ...dl(200) }} />
      <Card tone="violet" icon="users" title="Le groupe répond" cls={A.right} style={dl(350)} size={23}>
        Une force · une question · une suggestion. En trente secondes.
      </Card>
    </div>
  </Frame>
);

// ─── La journée en sept réflexes ────────────────────────────────────────────
const CReflex = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '28px 26px', minHeight: 300, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={`M${n}`} tone={tone} size={40} style={{ fontSize: 16 }} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const C_Synthese: Page = () => (
  <Frame mod={8} kind="synthese">
    <Title>La journée en sept réflexes</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
      <CReflex n={1} tone="blue" title="Prompter" d={100}>
        Rôle, contexte, tâche, contraintes, format. Puis relancer.
      </CReflex>
      <CReflex n={2} tone="violet" title="Rédiger" d={180}>
        « N’invente rien. Marque [À COMPLÉTER] ce qui manque. »
      </CReflex>
      <CReflex n={3} tone="teal" title="Analyser" d={260}>
        « Montre-moi la ligne du CV qui le prouve. »
      </CReflex>
      <CReflex n={4} tone="navy" title="Interviewer" d={340}>
        « Prenez la dernière fois. Qu’avez-vous fait, vous ? »
      </CReflex>
      <CReflex n={5} tone="green" title="Communiquer" d={420}>
        Bon prénom, bon poste, bonne date, aucune promesse.
      </CReflex>
      <CReflex n={6} tone="yellow" title="Accompagner" d={500}>
        Des faits anonymisés ; l’appréciation reste au dialogue humain.
      </CReflex>
      <CReflex n={7} tone="coral" title="Encadrer" d={580}>
        Outil validé, données minimisées, critères légaux, validation réelle.
      </CReflex>
      <div className={A.pop} style={{ background: G.navy, borderRadius: 18, boxShadow: SHADOW, padding: '22px 24px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...dl(700) }}>
        <Icon name="humanCheck" size={40} color="#C9B6FF" />
        <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 36, lineHeight: 1.2 }}>L’IA propose, le professionnel RH décide.</div>
      </div>
    </div>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const C_AutoPos: Page = () => (
  <Frame mod={8} kind="exercice">
    <Title>Auto-positionnement final : mesurez votre progression</Title>
    <Lede>Les mêmes huit affirmations que ce matin. Comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="fp1">Écrire un prompt structuré (rôle, contexte, tâche, format) pour une tâche RH</CheckItem>
        <CheckItem id="fp2">Faire rédiger une offre d’emploi et la décliner pour plusieurs plateformes</CheckItem>
        <CheckItem id="fp3">Construire une grille de critères objective avant de lire les CV</CheckItem>
        <CheckItem id="fp4">Faire résumer un CV par l’IA sans lui déléguer la décision</CheckItem>
        <CheckItem id="fp5">Générer un guide d’entretien et simuler un entretien avec l’IA</CheckItem>
        <CheckItem id="fp6">Produire des messages candidats personnalisés à partir d’un modèle</CheckItem>
        <CheckItem id="fp7">Préparer un entretien annuel ou un plan de développement avec l’IA</CheckItem>
        <CheckItem id="fp8">Dire ce qu’on n’a pas le droit de confier à l’IA (RGPD, discrimination)</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau ce soir"
          levels={[
            { min: 0, text: 'Reprenez les pages de synthèse et les prompts types.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : pratiquez dès cette semaine.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : partagez vos prompts à l’équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>L’écart avec votre score de ce matin, c’est votre progression du jour.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d’action à 30 jours ───────────────────────────────────────────────
const CWeek = ({ n, title, children, tone, d }: { n: number; title: string; children: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 26px', ...dl(d) }}>
    <Eyebrow c={T[tone].fg} size={19}>
      Semaine {n}
    </Eyebrow>
    <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const C_Plan: Page = () => (
  <Frame mod={8}>
    <Title>Et demain ? Votre plan d’action à 30 jours</Title>
    <Lede>Commencez petit, sur un usage sans risque, et mesurez le temps gagné.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <CWeek n={1} tone="navy" title="Vérifier le cadre" d={100}>
        Quel outil est autorisé ? Existe-t-il une charte ? Qui est le DPO ? Partagez votre charte personnelle avec votre manager.
      </CWeek>
      <CWeek n={2} tone="blue" title="Un premier usage « feu vert »" d={220}>
        Réécrire une offre existante, ou créer votre bibliothèque de messages. Aucune donnée personnelle.
      </CWeek>
      <CWeek n={3} tone="violet" title="Structurer" d={340}>
        Grille de critères et guide d’entretien pour le prochain recrutement. Notez le temps passé.
      </CWeek>
      <CWeek n={4} tone="green" title="Partager" d={460}>
        Une bibliothèque de prompts commune au service, avec les vérifications associées.
      </CWeek>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(700) }}>
      <Callout title="Mon engagement" tone="yellow" icon="flag" size={25}>
        Écrivez maintenant, sur un post-it : <strong>le premier usage que je teste lundi</strong>, et <strong>la règle que je ne transgresserai pas</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const C_Merci: Page = () => (
  <Frame mod={8} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 860 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.navy }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, ...dl(150) }}>
        L’IA vous rend du temps. <strong style={{ color: C.navy }}>Utilisez-le pour les personnes</strong> : les candidats, les collaborateurs, les managers.
      </p>
      <Portrait w={170} x={0} y={330} cls={A.in} />
      <div className={A.in} style={{ position: 'absolute', left: 230, top: 354, ...dl(300) }}>
        <Eyebrow c={C.muted} size={20}>
          Votre formateur
        </Eyebrow>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>{AUTHOR}</div>
        <div style={{ marginTop: 8, fontSize: 23, color: C.soft }}>Questions, retours d’expérience : je reste joignable après la formation.</div>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1300, top: 160, width: 500, ...dl(300) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon premier usage lundi
      </Eyebrow>
      <Poll>
        <PollRow id="fm1" label="Une offre d’emploi" tone="blue" icon="megaphone" />
        <PollRow id="fm2" label="Mes messages candidats" tone="green" icon="mail" />
        <PollRow id="fm3" label="Un guide d’entretien" tone="violet" icon="chat" />
        <PollRow id="fm4" label="Un support RH interne" tone="yellow" icon="note" />
      </Poll>
      <div style={{ marginTop: 22, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Pensez à remplir l’évaluation de la formation avant de partir.</div>
    </div>
    <Footer left={390} />
  </Frame>
);
C_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [C_Restitution, C_Synthese, C_AutoPos, C_Plan, C_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 15 min · RESTITUTIONS (minuteur 3 min par binôme)

OBJECTIF — Faire présenter et évaluer les cas pratiques.

DIRE — « Trois minutes par binôme, quatre points : le poste en une phrase et le piège repéré, votre meilleure trouvaille, une correction humaine qui a compté, le temps gagné. Le groupe répond : une force, une question, une suggestion. »

ANIMATION — Relancer le minuteur à chaque binôme (bouton reset). Noter au tableau les « corrections humaines » citées : elles illustrent parfaitement la règle de la journée. Avec un grand groupe, sélectionner 4 ou 5 binômes.

TRANSITION — « Récapitulons la journée. »`,
  `⏱ 3 min · LA JOURNÉE EN SEPT RÉFLEXES

OBJECTIF — Ancrer un réflexe par module.

DIRE — Parcourir les sept cartes. « Prompter : les cinq ingrédients. Rédiger : n’invente rien. Analyser : montre-moi la preuve. Interviewer : la dernière fois, vous. Communiquer : les dix secondes de relecture. Accompagner : des faits anonymisés. Encadrer : outil, données, critères, validation. Et la phrase qui résume tout : l’IA propose, le professionnel RH décide. »

TRANSITION — « Mesurons le chemin parcouru. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression, exigence du dispositif d’évaluation.

DIRE — « Les mêmes huit affirmations que ce matin. Cochez honnêtement, puis comparez avec votre score de départ. »

ANIMATION — Demander à main levée : « Qui a gagné trois points ou plus ? » Féliciter le groupe.

TRANSITION — « Et à partir de lundi ? »`,
  `⏱ 3 min · PLAN À 30 JOURS

OBJECTIF — Donner un plan d’action réaliste et faire prendre un engagement.

DIRE — « Semaine 1 : vérifier le cadre, outil autorisé, charte, DPO. Semaine 2 : un premier usage sans risque, sans donnée personnelle. Semaine 3 : structurer le prochain recrutement. Semaine 4 : partager une bibliothèque de prompts avec le service. Et maintenant, un post-it : le premier usage que vous testez lundi, et la règle que vous ne transgresserez pas. »

ANIMATION — Laisser une minute pour écrire. Proposer à deux volontaires de lire leur post-it.

TRANSITION — « Pour finir… »`,
  `⏱ 3 min · CLÔTURE

OBJECTIF — Clore la journée, recueillir l’intention de mise en œuvre, rappeler l’évaluation.

DIRE — « Merci pour votre énergie et vos questions. Un dernier vote : quel sera votre premier usage lundi ? » Cliquer les votes. « Retenez ceci : l’IA vous rend du temps. Utilisez-le pour les personnes. Pensez à remplir l’évaluation de la formation, et n’hésitez pas à me contacter pour vos retours d’expérience. Belle fin de journée ! »`,
];
// @@NOTES-END
