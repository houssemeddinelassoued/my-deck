// ═══ Module 10 · Tester, optimiser, déployer ════════════════════════════════

const M10_Section: Page = () => (
  <Section n={10} title="Tester, optimiser, déployer" sub="Qu’il tourne lundi, sans vous, et qu’on sache ce qu’il rapporte." dur="45 min">
    <SecItem n={1}>Identifier les erreurs fréquentes</SecItem>
    <SecItem n={2}>Test unitaire et test global</SecItem>
    <SecItem n={3}>Mesure du temps gagné, mise en production, documentation</SecItem>
  </Section>
);
M10_Section.transition = BLOOM;

// ─── Frequent errors ────────────────────────────────────────────────────────
const M10_ERR: { icon: IconName; tone: Tone; sym: string; cause: string }[] = [
  { icon: 'bolt', tone: 'blue', sym: 'Le scénario ne démarre jamais', cause: 'Déclencheur mal réglé (dossier, feuille), planification désactivée' },
  { icon: 'link', tone: 'teal', sym: 'Des champs vides à l’arrivée', cause: 'Mapping cassé après une modification du classeur ou du module' },
  { icon: 'calendar', tone: 'yellow', sym: 'Des dates absurdes', cause: 'Formats différents : 04/12 lu comme le 12 avril' },
  { icon: 'copy', tone: 'violet', sym: 'Des doublons', cause: 'Scénario relancé sur les mêmes données, pas de contrôle d’unicité' },
  { icon: 'sparkles', tone: 'coral', sym: 'L’étape IA plante ou dérive', cause: 'JSON entouré de balises, catégorie inventée, quota gratuit atteint' },
  { icon: 'key', tone: 'green', sym: 'Tout s’arrête un matin', cause: 'Connexion expirée, mot de passe changé, crédits épuisés' },
];

const M10_Erreurs: Page = () => (
  <Frame mod={10}>
    <Title>Les six erreurs les plus fréquentes</Title>
    <Lede>Vous en avez croisé plusieurs aujourd’hui. Chacune a un symptôme reconnaissable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {M10_ERR.map((e, i) => (
        <FlipCard
          key={e.sym}
          w={544}
          h={270}
          tone={e.tone}
          backTone="green"
          cls={A.in}
          style={dl(80 + i * 80)}
          front={
            <>
              <IconTile name={e.icon} tone={e.tone} size={58} />
              <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: C.ink }}>{e.sym}</div>
            </>
          }
          back={
            <>
              <Eyebrow c={T.green.fg} size={20}>
                Cause probable
              </Eyebrow>
              <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: C.ink }}>{e.cause}</div>
            </>
          }
        />
      ))}
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 890 }}>Demandez la cause probable avant de retourner chaque carte.</Hint>
  </Frame>
);

// ─── Unit test vs end-to-end ────────────────────────────────────────────────
const M10_Tests: Page = () => (
  <Frame mod={10} beats={2}>
    <Title>Test unitaire, puis test global</Title>
    <Card tone="blue" icon="puzzle" title="Test unitaire · un module à la fois" size={25} cls={A.left} style={{ position: 'absolute', left: 120, top: 220, width: 810, height: 560 }}>
      On vérifie qu’un module fait bien son travail, avec une donnée connue.
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet>
          Make : clic droit › <Kbd>Run this module only</Kbd>
        </Bullet>
        <Bullet>L’étape IA : 10 messages dont on connaît la bonne catégorie</Bullet>
        <Bullet>On compare sortie attendue et sortie obtenue</Bullet>
      </div>
      <Tag tone="blue" size={20} style={{ marginTop: 20 }}>
        Pendant la construction
      </Tag>
    </Card>
    <Card tone="green" icon="route" title="Test global · de bout en bout" size={25} cls={b.on(1)} style={{ position: 'absolute', left: 990, top: 220, width: 810, height: 560 }}>
      On vérifie que tout le circuit produit le bon résultat, dans les vraies applications.
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet tone="green">Une vraie demande fictive, du formulaire au courriel</Bullet>
        <Bullet tone="green">Les cas limites et les erreurs, pas seulement le cas heureux</Bullet>
        <Bullet tone="green">Idéalement fait par la personne qui fait la tâche</Bullet>
      </div>
      <Tag tone="green" size={20} style={{ marginTop: 20 }}>
        Avant la mise en production
      </Tag>
    </Card>
    <Callout cls={b.on(2)} title="Pour l’étape IA" tone="violet" icon="sparkles" style={{ position: 'absolute', left: 120, top: 820, width: 1680 }}>
      Une IA ne répond pas toujours pareil : on teste <b>plusieurs fois</b> et on mesure un <b>taux de bonnes réponses</b>, pas un « ça a marché ».
    </Callout>
  </Frame>
);

// ─── The test set ───────────────────────────────────────────────────────────
const M10_Jeu: Page = () => (
  <Frame mod={10} beats={5}>
    <Title>Un jeu de test : cinq types de cas</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 210, width: 1680 }}
      cols="250px 1.3fr 1.2fr 160px"
      size={28}
      hi={1}
      head={['Type', 'Exemple (scénario A)', 'Résultat attendu', 'Obtenu ?']}
      rows={[
        ['Normal', 'Colis en retard, client poli', 'Livraison · normale · ligne remplie', '✓'],
        ['Urgent', 'Produit endommagé, cliente irritée', 'Priorité haute · courriel au responsable', '✓'],
        ['Limite', 'Message de 2 mots, ou de 2 pages', 'Pas d’erreur ; résumé correct', '?'],
        ['Invalide', 'Champ courriel vide, caractères spéciaux', 'Pas de plantage ; mis de côté', '✗'],
        ['Ambigu', 'Demande de partenariat', 'Autre · confiance basse · à vérifier', '✓'],
      ]}
    />
    <Hint style={{ position: 'absolute', left: 120, top: 820 }}>Chaque ✗ devient une correction ; on rejoue tout le jeu après chaque correction.</Hint>
  </Frame>
);

// ─── Optimise: robustness and credits ───────────────────────────────────────
const M10_Robuste: Page = () => (
  <Frame mod={10}>
    <Title>Optimiser : plus robuste, plus économe</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      <Card tone="coral" icon="alert" title="Gérer les erreurs" size={23} cls={A.in} style={{ height: 520 }}>
        Clic droit sur un module › <b>Add error handler</b> :
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bullet tone="coral" size={22}>
            <b>Ignore</b> : on passe à la suite
          </Bullet>
          <Bullet tone="coral" size={22}>
            <b>Resume</b> : on continue avec une valeur de secours
          </Bullet>
          <Bullet tone="coral" size={22}>
            <b>Break</b> : on met de côté et on réessaie plus tard
          </Bullet>
        </div>
        Et un courriel d’alerte à vous-même.
      </Card>
      <Card tone="yellow" icon="money" title="Économiser les crédits" size={23} cls={A.in} style={{ height: 520, ...dl(150) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bullet tone="yellow" size={22}>Filtrer juste après le déclencheur</Bullet>
          <Bullet tone="yellow" size={22}>Espacer la planification : toutes les heures suffit souvent</Bullet>
          <Bullet tone="yellow" size={22}>Traiter par lots (limite de lignes)</Bullet>
          <Bullet tone="yellow" size={22}>Pas d’étape IA quand une règle suffit</Bullet>
        </div>
      </Card>
      <Card tone="teal" icon="gauge" title="Améliorer la qualité" size={23} cls={A.in} style={{ height: 520, ...dl(300) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bullet tone="teal" size={22}>Ajuster le seuil de confiance avec les résultats réels</Bullet>
          <Bullet tone="teal" size={22}>Ajouter au prompt les exemples mal classés</Bullet>
          <Bullet tone="teal" size={22}>Échantillonner : relire 1 résultat sur 20 chaque semaine</Bullet>
        </div>
      </Card>
    </div>
    <Verified style={{ position: 'absolute', left: 120, top: 780 }}>Noms des gestionnaires d’erreur de Make vérifiés en novembre 2026.</Verified>
  </Frame>
);

// ─── Measuring the time saved (net) ─────────────────────────────────────────
const M10_Mesure: Page = () => {
  const [brut, setBrut] = useState(90);
  const [verif, setVerif] = useState(15);
  const [maint, setMaint] = useState(12);
  const net = Math.max(0, brut - verif - maint);
  return (
    <Frame mod={10} kind="exercice">
      <Title>Mesurer le temps réellement gagné</Title>
      <Lede>Le gain brut estimé au module 2, moins ce que l’automatisation coûte encore en temps humain.</Lede>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 290, width: 940, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M2Input label="Gain brut estimé (module 2)" value={brut} set={setBrut} min={10} max={300} step={5} unit="h/an" tone="blue" />
        <M2Input label="Vérifications et cas « à vérifier »" value={verif} set={setVerif} min={0} max={100} unit="h/an" tone="coral" />
        <M2Input label="Maintenance (pannes, ajustements)" value={maint} set={setMaint} min={0} max={60} unit="h/an" tone="yellow" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1120, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
        <div style={{ background: G.green, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff' }}>
          <Eyebrow c="#E4F6E6">Gain net par an</Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 130, lineHeight: 1.05 }}>{fr(net, 0)} h</div>
          <div style={{ fontSize: 24 }}>soit {fr((net / Math.max(1, brut)) * 100, 0)} % du gain brut</div>
        </div>
        <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
          <Eyebrow c={C.muted}>Mesurez aussi</Eyebrow>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 23, color: C.soft }}>
            <div>· Le <b>délai</b> de traitement, avant et après</div>
            <div>· Le <b>taux d’erreur</b> (saisie, classement)</div>
            <div>· La <b>satisfaction</b> de qui reçoit le résultat</div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Going to production ────────────────────────────────────────────────────
const M10_Prod: Page = () => (
  <Frame mod={10}>
    <Title>Mettre en production : la liste de contrôle</Title>
    <Lede>Ce qui sépare une démonstration d’un outil sur lequel on compte.</Lede>
    <Checklist style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CheckItem id="a" size={25}>Outil et compte approuvés par l’organisation (pas un compte personnel)</CheckItem>
      <CheckItem id="b" size={25}>Données réelles autorisées : politique interne, Loi 25, offre IA adaptée</CheckItem>
      <CheckItem id="c" size={25}>Jeu de test complet passé, résultats consignés</CheckItem>
      <CheckItem id="d" size={25}>Un responsable et un suppléant nommés</CheckItem>
      <CheckItem id="e" size={25}>Alertes d’erreur actives, vers une boîte surveillée</CheckItem>
      <CheckItem id="f" size={25}>Plan B : comment refaire à la main si ça s’arrête</CheckItem>
      <CheckItem id="g" size={25}>Utilisateurs informés : ce qui change, à qui signaler un problème</CheckItem>
    </Checklist>
    <div style={{ position: 'absolute', left: 1180, top: 280, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="green" icon="rocket" title="Démarrer petit" size={24} cls={A.right}>
        Deux semaines en <b>parallèle</b> du processus manuel, puis on compare. Ensuite seulement, on arrête le manuel.
      </Card>
      <Callout cls={A.right} title="Données et IA gratuite" tone="coral" icon="lock" size={23} style={dl(200)}>
        Une offre gratuite peut réutiliser vos données. En production, des renseignements personnels exigent une offre et un outil approuvés.
      </Callout>
    </div>
  </Frame>
);

// ─── Documentation ──────────────────────────────────────────────────────────
const M10_DOC: [string, string][] = [
  ['But', 'Le besoin, en une phrase (fiche de conception)'],
  ['Déclencheur et fréquence', 'Quoi, quand, combien de fois'],
  ['Applications et comptes', 'Lesquels, au nom de qui'],
  ['Données', 'Entrées, sorties, ce qui est sensible'],
  ['Étape IA', 'Prompt, modèle, seuil, version'],
  ['En cas d’erreur', 'Symptômes, que faire, qui appeler'],
  ['Responsables', 'Responsable, suppléant'],
  ['Historique', 'Date, changement, testé par'],
];

const M10_Doc: Page = () => (
  <Frame mod={10}>
    <Title>Documenter : la fiche d’exploitation</Title>
    <Lede>Écrite pour la personne qui reprendra votre workflow le jour où vous serez en vacances.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {M10_DOC.map(([k, v], i) => (
        <div key={k} className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(60 + i * 60) }}>
          <Num n={i + 1} tone={i < 4 ? 'blue' : 'teal'} size={44} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{k}</div>
            <div style={{ fontSize: 22, color: C.soft }}>{v}</div>
          </div>
        </div>
      ))}
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 830 }}>Les rubriques 1 à 5 se recopient de votre fiche de conception : la documentation est déjà à moitié écrite.</Hint>
  </Frame>
);

// ─── Final exercise ─────────────────────────────────────────────────────────
const M10_Atelier: Page = () => (
  <AtelierPage
    mod={10}
    kind="exercice"
    n="Exercice 5"
    title="Plan de test, gain et fiche d’exploitation"
    timerId="m10-plan"
    minutes={15}
    tools="Votre carnet de bord · rubrique 5 · votre scénario du module 9"
    objective="Préparer le passage en production de votre workflow : le tester, chiffrer son gain net, le documenter."
    deliver={
      <>
        Rubrique 5 : un <b>jeu de test de 5 cas</b> avec résultats, le <b>gain net</b> estimé, et la fiche d’exploitation (8 rubriques, même brèves).
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Les 5 types de cas, avec résultat attendu</CheckItem>
        <CheckItem id="b" size={22}>Gain net = brut − vérification − maintenance</CheckItem>
        <CheckItem id="c" size={22}>Un responsable et un plan B nommés</CheckItem>
      </>
    }
  >
    <Do n={1}>Écrivez un cas de chaque type : normal, urgent, limite, invalide, ambigu.</Do>
    <Do n={2}>Jouez-en au moins deux sur votre scénario ; notez ✓ ou ✗.</Do>
    <Do n={3}>Reprenez votre gain brut du module 2 et calculez le gain net.</Do>
    <Do n={4}>Remplissez la fiche d’exploitation, même en une ligne par rubrique.</Do>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M10_Qcm: Page = () => (
  <QcmPage
    mod={10}
    n={8}
    title="Prêt pour la production ?"
    q="Votre workflow a bien fonctionné sur cinq demandes de test. Que faites-vous avant de couper le processus manuel ?"
    explain="Cinq tests heureux ne prouvent rien sur les cas limites ni sur la durée. On complète le jeu de test, on nomme un responsable, on active les alertes, puis on fait tourner en parallèle avant d’arrêter le manuel."
  >
    <Opt why="Piège ! Cinq cas, probablement tous « normaux » : ni les cas limites ni les erreurs n’ont été testés.">
      Rien : cinq tests réussis suffisent
    </Opt>
    <Opt why="Piège ! Plus d’IA n’améliore pas la fiabilité : c’est même une source d’incertitude supplémentaire.">
      Ajouter une seconde étape IA qui vérifie la première
    </Opt>
    <Opt why="Piège ! Activer partout d’un coup, sans responsable ni alerte, c’est découvrir les pannes par les plaintes.">
      L’activer pour tout le service dès lundi, puis corriger au fil de l’eau
    </Opt>
    <Opt ok why="Exact : jeu de test complet, responsable, alertes, puis deux semaines en parallèle du manuel avant de l’arrêter.">
      Compléter les tests, nommer un responsable, activer les alertes et tourner en parallèle quelques semaines
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M10_Synthese: Page = () => (
  <SynthPage
    mod={10}
    title="Module 10 · Ce qu’il faut retenir"
    poste={
      <>
        Fixez une date dans un mois pour <b>mesurer le gain réel</b> et comparer avec votre estimation. Inscrivez-la à votre agenda maintenant.
      </>
    }
  >
    <SynthRow n={1} tone="coral" d={100}>
      Six erreurs fréquentes : déclencheur, mapping, dates, doublons, <b>IA</b>, connexions.
    </SynthRow>
    <SynthRow n={2} tone="blue" d={220}>
      Test <b>unitaire</b> en construisant, test <b>global</b> avant la production, 5 types de cas.
    </SynthRow>
    <SynthRow n={3} tone="green" d={340}>
      Le gain se mesure <b>net</b> : brut − vérifications − maintenance.
    </SynthRow>
    <SynthRow n={4} tone="teal" d={460}>
      Production : responsable, alertes, plan B, <b>fiche d’exploitation</b>.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M10_Section, M10_Erreurs, M10_Tests, M10_Jeu, M10_Robuste, M10_Mesure, M10_Prod, M10_Doc, M10_Atelier, M10_Qcm, M10_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 10 (45 min)

DIRE — « Dernier module. Un workflow qui marche en formation, c'est bien. Un workflow sur lequel votre organisation peut compter lundi, c'est autre chose : tests, optimisation, mise en production et documentation. »

TRANSITION — « D'abord, les erreurs fréquentes. »`,
  `⏱ 5 min · CARTES À RETOURNER

OBJECTIF — Identifier les erreurs fréquentes (programme).

ANIMATION — Pour chaque carte, lisez le symptôme et demandez : « Cause probable ? » Écoutez une ou deux réponses au micro, puis cliquez pour retourner.

À SOULIGNER — « Vous en avez rencontré plusieurs aujourd'hui : c'est normal, c'est même le but. » L'erreur IA spécifique : balises \`\`\`json, catégories inventées, quota gratuit atteint (message d'erreur de limite de requêtes).

TRANSITION — « Comment les attraper avant vos utilisateurs ? »`,
  `⏱ 4 min

OBJECTIF — Distinguer test unitaire et test global (programme).

DIRE — « Le test unitaire, vous l'avez fait toute la journée : Run once, une donnée, on ouvre la bulle. Dans Make, “Run this module only” teste un module isolé. »
→ beat 1 — Le test global : tout le circuit, dans les vraies applications, avec les cas limites.
→ beat 2 — Pour l'IA : un taux de bonnes réponses sur un échantillon. « Sur 20 messages connus, combien sont bien classés ? 18 ? Alors 10 % iront à la vérification, ou on améliore le prompt. »

TRANSITION — « Quels cas tester ? »`,
  `⏱ 4 min

OBJECTIF — Construire un jeu de test.

DIRE — Révélez les lignes (→ beats 1 à 5) : normal, urgent, limite, invalide, ambigu. « Le ✗ sur l'invalide : un champ courriel vide a fait planter le module Gmail. On ajoute un filtre ou un gestionnaire d'erreur, puis on rejoue tout. »

TRANSITION — « Optimiser. »`,
  `⏱ 4 min

OBJECTIF — Optimiser : robustesse, coût, qualité.

DIRE — Parcourez les trois cartes.
• Erreurs : « Les gestionnaires d'erreur décident de ce qui se passe quand un module échoue, au lieu que tout s'arrête. »
• Crédits : « Toutes les 15 minutes, c'est souvent inutile : une fois par heure suffit pour la plupart des tâches de bureau. »
• Qualité : « L'IA s'améliore par le prompt : ajoutez les exemples qu'elle a mal classés. Et relisez un échantillon chaque semaine. »

TRANSITION — « Combien rapporte réellement le workflow ? »`,
  `⏱ 4 min · CALCULATEUR

OBJECTIF — Mesurer le temps gagné (programme), en net.

DIRE — « Au module 2, on a estimé un gain brut. En réalité, il reste du temps humain : vérifier les cas douteux, réparer, ajuster. » Exemple : 90 h brutes − 15 h de vérification − 12 h de maintenance = 63 h nettes, 70 % du brut.

INSISTER — Mesurez aussi le délai, le taux d'erreur, la satisfaction : « Parfois, le vrai gain n'est pas le temps, c'est le délai de réponse au client. »

TRANSITION — « Passer en production. »`,
  `⏱ 5 min

OBJECTIF — Mise en production (programme).

DIRE — Cliquez les cases au fil des explications.
• Compte approuvé : « Un workflow sur votre compte personnel s'arrête le jour où vous partez. »
• Données : « La Loi 25 encadre les renseignements personnels ; l'offre gratuite de Gemini peut réutiliser les données. En production, on passe par les outils et offres approuvés. »
• Responsable et suppléant, alertes, plan B, utilisateurs informés.

DÉMARRER PETIT — Deux semaines en parallèle du manuel, puis comparaison.

TRANSITION — « Et la documentation. »`,
  `⏱ 3 min

OBJECTIF — Documenter (programme : documentation).

DIRE — « Huit rubriques. Les cinq premières viennent de votre fiche de conception : la documentation est déjà à moitié écrite. » Insistez sur « En cas d'erreur » et « Historique » : ce sont les rubriques qu'on oublie et qui servent le plus.

TRANSITION — « À vous, pour votre workflow. »`,
  `⏱ 15 min · EXERCICE 5 INDIVIDUEL

OBJECTIF — Chacun prépare le passage en production de son workflow.

ANIMATION — Lancez le minuteur. Collez dans le Chat le modèle de fiche d'exploitation.

POINT D'ÉTAPE à 8 min — « Votre gain net ? » Deux ou trois chiffres au micro : comparez avec les estimations du module 2.

TRANSITION — « Dernier QCM. »`,
  `⏱ 2 min · QCM 8

RÉPONSE — D.
• A ✗ — Cinq cas heureux ne prouvent rien.
• B ✗ — Plus d'IA, plus d'incertitude.
• C ✗ — Pas de responsable ni d'alertes.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

À VOTRE POSTE — « Une date dans un mois pour mesurer le gain réel. Mettez-la à votre agenda maintenant, pendant qu'on y est. »

TRANSITION — « Bouclons ces deux jours. »`,
];
// @@NOTES-END
