// ─── Projet final & clôture ─────────────────────────────────────────────────

const F_Section: Page = () => (
  <Frame mod={11} chrome={false}>
    <Slab x={-60} y={-60} w={700} h={1200} r={56} cls={A.left}>
      <div style={{ position: 'absolute', left: 150, top: 240 }}>
        <div className={A.in} style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: '#AEB9E6', ...dl(300) }}>
          JOUR 2 · FINAL
        </div>
        <div className={A.pop} style={{ marginTop: 30, ...dl(450) }}>
          <FlowMark h={150} color="#FFFFFF" accent={C.pink} />
        </div>
        <div className={A.grow} style={{ marginTop: 40, width: 150, height: 8, borderRadius: 4, background: G.violet, ...dl(650) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <CourseLogo size={24} color="#FFFFFF" accent={C.pink} />
      </div>
    </Slab>
    <Outline x={1480} y={-40} w={520} h={150} r={40} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 760, top: 200, width: 1040 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Tag tone="grey" size={22}>
          <Icon name="clock" size={22} /> 16:20 – 17:00
        </Tag>
        <KindBadge kind="lab" />
      </div>
      <h1 className={A.in} style={{ margin: '24px 0 0', fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 1.06, letterSpacing: '-0.015em', color: C.navy, ...dl(120) }}>
        Projet final :<br />
        votre automatisation
      </h1>
      <p className={A.in} style={{ margin: '22px 0 0', fontSize: 30, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        Assemblez les pièces de votre carnet de bord en un workflow complet, puis présentez-le au groupe en trois minutes.
      </p>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SecItem n={1}>Le canevas du projet</SecItem>
        <SecItem n={2}>Le format de présentation</SecItem>
        <SecItem n={3}>Auto-positionnement final</SecItem>
        <SecItem n={4}>Votre plan pour les 30 prochains jours</SecItem>
      </div>
    </div>
    <Footer left={760} short />
  </Frame>
);
F_Section.transition = BLOOM;

// ─── Brief du projet final ──────────────────────────────────────────────────
const F_Brief: Page = () => (
  <LabPage
    mod={11}
    n="final"
    title="Concevoir son automatisation professionnelle"
    defi="projet"
    who="Individuel, présentation au groupe"
    minutes={25}
    whereTitle="Ce que vous présentez"
    where={
      <>
        Le <strong>canevas rempli</strong> (page suivante), votre <strong>schéma</strong>, et si possible le <strong>scénario</strong> qui tourne sur un cas fictif.
      </>
    }
    objective={
      <>
        Construire un <strong>workflow complet</strong> correspondant à une situation réelle de votre métier : de l’événement déclencheur au résultat tracé, garde-fous compris.
      </>
    }
    crit={
      <>
        <CheckItem id="fbc1" size={22}>Le gain est chiffré</CheckItem>
        <CheckItem id="fbc2" size={22}>L’IA n’est utilisée que pour le langage</CheckItem>
        <CheckItem id="fbc3" size={22}>Validation humaine justifiée</CheckItem>
        <CheckItem id="fbc4" size={22}>Les risques ont leur parade</CheckItem>
      </>
    }
  >
    <div>1. Rouvrez votre carnet de bord : cartographie, prompts, schéma, scénario.</div>
    <div>2. Remplissez les 8 cases du canevas, sans en sauter une.</div>
    <div>3. Faites tourner votre scénario sur un cas fictif, capture à l’appui.</div>
    <div>4. Préparez 3 minutes de présentation selon le format proposé.</div>
    <Bonus>Ajoutez l’indicateur que vous suivrez le premier mois pour décider de garder ou non l’automatisation.</Bonus>
  </LabPage>
);

// ─── Canevas ────────────────────────────────────────────────────────────────
const FBox = ({ n, tone, icon, title, q, d }: { n: number; tone: Tone; icon: IconName; title: string; q: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px', minHeight: 250, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={38} />
      <IconTile name={icon} tone={tone} size={42} />
    </div>
    <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.42, color: C.soft }}>{q}</div>
  </div>
);

const F_Canevas: Page = () => (
  <Frame mod={11} kind="lab">
    <Title>Le canevas du projet : huit cases</Title>
    <Lede>Une case par pièce du carnet de bord. Si une case reste vide, c’est là que votre automatisation cassera.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      <FBox n={1} tone="blue" icon="target" title="Processus et gain" q="Quel processus, quel volume, combien d’heures gagnées par mois ?" d={80} />
      <FBox n={2} tone="teal" icon="bolt" title="Déclencheur et données" q="Quel événement lance le flux ? Quelles données entrent ?" d={150} />
      <FBox n={3} tone="violet" icon="sparkles" title="Étapes IA et prompts" q="Où faut-il comprendre du langage ? Quel format de sortie ?" d={220} />
      <FBox n={4} tone="yellow" icon="split" title="Règles et routes" q="Quelles conditions, quelle route « sinon », quelles exceptions ?" d={290} />
      <FBox n={5} tone="pink" icon="plug" title="Applications connectées" q="Lesquelles, avec quel identifiant, quelle source de vérité ?" d={360} />
      <FBox n={6} tone="green" icon="humanCheck" title="Validation humaine" q="Où, par qui, avec quel délai et quelle escalade ?" d={430} />
      <FBox n={7} tone="coral" icon="shieldCheck" title="Risques et garde-fous" q="Niveau des données, injection, erreurs : quelles parades ?" d={500} />
      <FBox n={8} tone="navy" icon="chart" title="Indicateur de succès" q="Que mesurerez-vous dans un mois pour décider de garder ?" d={570} />
    </div>
  </Frame>
);

// ─── Format de présentation ─────────────────────────────────────────────────
const FStep = ({ t, tone, title, children, d }: { t: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <span style={{ flex: 'none', width: 80, fontFamily: mono, fontWeight: 700, fontSize: 22, color: STRONG[tone] }}>{t}</span>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const F_Pitch: Page = () => (
  <Frame mod={11} kind="exercice">
    <Title>Trois minutes pour convaincre</Title>
    <Lede>Le même format pour tout le monde. Le groupe donne un retour en trois temps.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FStep t="0:30" tone="blue" title="Le problème" d={100}>
        Le processus aujourd’hui, son coût en temps, ce qui agace.
      </FStep>
      <FStep t="1:00" tone="violet" title="Le schéma" d={200}>
        Du déclencheur au résultat : où est l’IA, où est l’humain.
      </FStep>
      <FStep t="0:45" tone="green" title="La preuve" d={300}>
        Le scénario qui tourne sur un cas fictif, ou sa capture.
      </FStep>
      <FStep t="0:30" tone="coral" title="Les garde-fous" d={400}>
        Le risque principal et sa parade.
      </FStep>
      <FStep t="0:15" tone="navy" title="Le gain" d={500}>
        Heures par mois, et l’indicateur que vous suivrez.
      </FStep>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="pitch" minutes={3} label="Présentation" cls={A.right} style={{ width: 620, ...dl(200) }} />
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(350) }}>
        <PanelTitle icon="users">Le retour du groupe</PanelTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Bullet size={23} tone="green">
            <strong>Une force</strong> du projet
          </Bullet>
          <Bullet size={23} tone="blue">
            <strong>Une question</strong> qui reste ouverte
          </Bullet>
          <Bullet size={23} tone="violet">
            <strong>Une suggestion</strong> concrète
          </Bullet>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const F_AutoPos: Page = () => (
  <Frame mod={11} kind="exercice">
    <Title>Auto-positionnement final : mesurez le chemin parcouru</Title>
    <Lede>Les mêmes huit affirmations qu’hier matin. Comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="fap1">Dire si une tâche se prête à l’automatisation, et pourquoi</CheckItem>
        <CheckItem id="fap2">Écrire un prompt qui renvoie toujours le même format (JSON, tableau)</CheckItem>
        <CheckItem id="fap3">Faire extraire des champs fiables d’un document non structuré</CheckItem>
        <CheckItem id="fap4">Dessiner un workflow avec déclencheur, conditions et validation</CheckItem>
        <CheckItem id="fap5">Construire un scénario dans Make, Power Automate ou Zapier</CheckItem>
        <CheckItem id="fap6">Faire circuler une donnée entre formulaire, tableur, CRM et email</CheckItem>
        <CheckItem id="fap7">Configurer un assistant IA spécialisé avec ses règles et documents</CheckItem>
        <CheckItem id="fap8">Expliquer quand il ne faut surtout pas automatiser</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les fiches synthèse des modules.', tone: 'grey' },
            { min: 4, text: 'Solide : passez à un premier pilote.', tone: 'blue' },
            { min: 7, text: 'Prêt à automatiser votre service.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Écart avec le score de départ : c’est votre progression sur ces deux jours.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan pour les 30 prochains jours ───────────────────────────────────────
const FWeek = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '22px 24px', ...dl(d) }}>
    <Eyebrow c={T[tone].fg} size={19}>
      Semaine {n}
    </Eyebrow>
    <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const F_Plan: Page = () => (
  <Frame mod={11}>
    <Title>Vos 30 prochains jours</Title>
    <Lede>Une automatisation ne se met pas en service en un jour. Quatre semaines pour passer du prototype à la décision.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 22 }}>
      <FWeek n={1} tone="blue" title="Valider le cadre" d={100}>
        Présentez le projet à votre manager et à l’informatique : outil, comptes, données autorisées.
      </FWeek>
      <FWeek n={2} tone="violet" title="Mode brouillon" d={200}>
        Le scénario tourne sur de vrais cas, mais rien ne part : il prépare, vous comparez.
      </FWeek>
      <FWeek n={3} tone="pink" title="Validation à 100 %" d={300}>
        Tout passe par vous. Vous notez les erreurs et ajustez prompts et règles.
      </FWeek>
      <FWeek n={4} tone="green" title="Décider" d={400}>
        Taux d’erreur, temps gagné, retours : on garde, on corrige ou on arrête. Documentez.
      </FWeek>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 22, ...dl(600) }}>
      <Card tone="navy" icon="book" title="Pour aller plus loin" style={{ flex: 1 }} size={22}>
        Documentation et modèles de votre outil d’automatisation · fiches pratiques de la CNIL sur l’IA · charte IA de votre entreprise.
      </Card>
      <Card tone="green" icon="users" title="Ne restez pas seul" style={{ flex: 1 }} size={22}>
        Partagez vos fiches prompt et vos schémas avec vos collègues : une bibliothèque commune vaut mieux que dix scénarios isolés.
      </Card>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const F_Merci: Page = () => (
  <Frame mod={11} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 860 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.navy }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, ...dl(150) }}>
        L’IA traite, le workflow orchestre, <strong style={{ color: C.navy }}>l’humain décide</strong>. À vous de jouer dans votre service.
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
        Ma première automatisation
      </Eyebrow>
      <Poll>
        <PollRow id="fm1" label="Dès ce mois-ci" tone="green" icon="rocket" />
        <PollRow id="fm2" label="Ce trimestre" tone="blue" icon="calendar" />
        <PollRow id="fm3" label="Après validation" tone="yellow" icon="shieldCheck" />
        <PollRow id="fm4" label="À réfléchir" tone="grey" icon="bulb" />
      </Poll>
      <div style={{ marginTop: 22, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Pensez à remplir l’évaluation de la formation avant de partir.</div>
    </div>
    <Footer left={390} />
  </Frame>
);
F_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [F_Section, F_Brief, F_Canevas, F_Pitch, F_AutoPos, F_Plan, F_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · PROJET FINAL · 16:20

OBJECTIF — Lancer le projet final.

DIRE — « Votre carnet de bord est complet : cartographie, prompts, données, schéma, scénario, logique, connexions, assistant éventuel, garde-fous. Il est temps de tout assembler en un workflow complet, correspondant à une situation réelle de votre métier, et de le présenter au groupe en trois minutes. »

TRANSITION — « Le brief. »`,
  `⏱ 25 min · BRIEF DU PROJET FINAL (minuteur)

OBJECTIF — Chaque participant construit un workflow complet correspondant à une situation professionnelle réelle.

CONSIGNE À DIRE — « Vingt-cinq minutes. Rouvrez votre carnet de bord, remplissez les huit cases du canevas, faites tourner votre scénario sur un cas fictif et préparez trois minutes de présentation. Quatre critères de réussite : un gain chiffré, une IA utilisée seulement pour le langage, une validation humaine justifiée, et une parade pour chaque risque. »

ANIMATION — Afficher le canevas pendant le travail. Passer voir chacun : la case la plus souvent vide est la 8, l’indicateur de succès.

GESTION DU TEMPS — Avec un grand groupe, faire présenter par binôme ou sélectionner 4 à 5 projets représentatifs.`,
  `⏱ (pendant le projet) · CANEVAS

OBJECTIF — Structurer le projet en huit cases.

DIRE — « Une case par pièce de votre carnet de bord. Si une case reste vide, c’est là que votre automatisation cassera. »

ANIMATION — Laisser la page affichée pendant le travail individuel.`,
  `⏱ 15 à 25 min · PRÉSENTATIONS (minuteur 3 min par personne)

OBJECTIF — Faire présenter et évaluer les projets.

DIRE — « Trois minutes chacun : le problème, le schéma, la preuve, les garde-fous, le gain. Le groupe répond en trois temps : une force, une question, une suggestion. »

ANIMATION — Relancer le minuteur à chaque présentation (bouton reset). Noter pour chaque projet un point fort à reprendre dans la synthèse.`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression, exigence du dispositif d’évaluation.

DIRE — « Les mêmes huit affirmations qu’hier matin. Cochez honnêtement, et comparez avec votre score de départ. L’écart, c’est votre progression. »

ANIMATION — Demander à main levée : « Qui a gagné 3 points ou plus ? »

TRANSITION — « Et après la formation ? »`,
  `⏱ 3 min · PLAN À 30 JOURS

OBJECTIF — Donner un plan d’action réaliste pour la mise en œuvre.

DIRE — « Une automatisation ne se met pas en service en un jour. Semaine 1 : valider le cadre avec votre manager et l’informatique. Semaine 2 : mode brouillon, le scénario prépare mais rien ne part. Semaine 3 : validation à 100 %, vous notez les erreurs. Semaine 4 : vous décidez, avec des chiffres, de garder, corriger ou arrêter. Et partagez vos fiches prompt et vos schémas : une bibliothèque commune vaut mieux que dix scénarios isolés. »

TRANSITION — « Pour finir… »`,
  `⏱ 3 min · CLÔTURE

OBJECTIF — Clore, recueillir l’intention de mise en œuvre, rappeler l’évaluation.

DIRE — « Merci pour ces deux jours. Un dernier vote : quand mettrez-vous en place votre première automatisation ? » Cliquer les votes. « Retenez le fil conducteur : l’IA traite, le workflow orchestre, l’humain décide. Pensez à remplir l’évaluation de la formation, et n’hésitez pas à me contacter pour vos retours d’expérience. Bonne automatisation ! »`,
];
// @@NOTES-END
