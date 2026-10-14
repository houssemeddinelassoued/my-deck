// ─── Module 6 · Gérer et développer les collaborateurs ──────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Après l’embauche :
        <br />
        accompagner les talents
      </>
    }
    sub="Entretiens annuels, formation, parcours, communication interne : l’IA prépare, structure et rédige. Le dialogue avec le collaborateur reste humain."
    dur="15:40 – 16:15"
  >
    <SecItem n={1}>Préparer les entretiens annuels</SecItem>
    <SecItem n={2}>Construire un plan de développement</SecItem>
    <SecItem n={3}>Identifier les besoins de formation</SecItem>
    <SecItem n={4}>Créer un parcours d’intégration</SecItem>
    <SecItem n={5}>Communication interne et supports RH</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Préparer l’entretien annuel ────────────────────────────────────────────
const M6_Annuel: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Préparer l’entretien annuel : deux guides, une même trame</Title>
    <Lede>L’IA prépare le manager et le collaborateur. Elle n’évalue personne : elle aide chacun à préparer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.navy}`, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="org" tone="navy" size={52} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Guide du manager</span>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Bullet size={23} tone="navy">Bilan de l’année : faits marquants, objectifs atteints ou non</Bullet>
          <Bullet size={23} tone="navy">Questions ouvertes pour faire parler le collaborateur</Bullet>
          <Bullet size={23} tone="navy">Comment formuler un point d’amélioration sans blesser</Bullet>
          <Bullet size={23} tone="navy">Objectifs SMART proposés pour l’année suivante</Bullet>
        </div>
      </div>
      <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '24px 28px', ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="user" tone="green" size={52} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Guide du collaborateur</span>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Bullet size={23} tone="green">Auto-évaluation : mes réussites, mes difficultés</Bullet>
          <Bullet size={23} tone="green">Ce dont j’ai besoin : moyens, formation, organisation</Bullet>
          <Bullet size={23} tone="green">Mon souhait d’évolution à 1 an et à 3 ans</Bullet>
          <Bullet size={23} tone="green">Les questions que je veux poser à mon manager</Bullet>
        </div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1060 }}>
      <PromptPanel title="prompt · préparer l’entretien (manager)" size={19}>
        Je prépare l’entretien annuel d’un·e <V>poste</V>. Faits de l’année (anonymisés) : <V>faits</V>. Propose une trame de 45 min, 8 questions ouvertes, une façon bienveillante
        d’aborder <V>point_amélioration</V>, et 3 objectifs SMART. Ne porte aucun jugement sur la personne.
      </PromptPanel>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1220, top: 640, width: 580 }}>
      <Callout title="Ligne rouge" tone="coral" icon="lock" size={21}>
        Ni nom, ni données de santé, ni éléments disciplinaires dans l’outil. Et jamais de note ou d’appréciation rédigée par l’IA sans relecture du manager.
      </Callout>
    </div>
  </Frame>
);

// ─── Plan de développement (70 / 20 / 10) ───────────────────────────────────
const M6Act = ({ t, w }: { t: string; w: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <Icon name="checkCircle" size={26} color={C.green} />
    <span style={{ flex: 1, fontSize: 23, color: C.ink, lineHeight: 1.35 }}>{t}</span>
    <Tag tone="grey" size={18}>
      {w}
    </Tag>
  </div>
);

const M6_PDI: Page = () => (
  <Frame mod={6} kind="demo">
    <Title>Un plan de développement concret : le modèle 70 / 20 / 10</Title>
    <Lede>Camille, un an après son arrivée, veut devenir référente qualité du plateau. L’IA propose ; Camille et Karim choisissent.</Lede>
    <Tabs initial="70" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <TabBtn id="70" icon="tool" tone="blue">
          70 % · en situation
        </TabBtn>
        <TabBtn id="20" icon="users" tone="violet">
          20 % · avec les autres
        </TabBtn>
        <TabBtn id="10" icon="graduation" tone="green">
          10 % · formation
        </TabBtn>
      </div>
      <TabPane id="70">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M6Act t="Écouter et évaluer 5 appels par semaine avec la grille qualité" w="T1" />
          <M6Act t="Animer le point qualité du lundi (15 min)" w="T2" />
          <M6Act t="Rédiger 3 fiches réponses pour les réclamations fréquentes" w="T2" />
        </div>
      </TabPane>
      <TabPane id="20">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M6Act t="Binôme mensuel avec la référente qualité du site d’Angers" w="T1 → T4" />
          <M6Act t="Observer une séance de calibration entre managers" w="T2" />
          <M6Act t="Feedback trimestriel structuré avec Karim" w="T1 → T4" />
        </div>
      </TabPane>
      <TabPane id="10">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M6Act t="Formation « Donner un feedback constructif » (1 jour)" w="T1" />
          <M6Act t="Module en ligne « Démarche qualité en relation client »" w="T2" />
        </div>
      </TabPane>
    </Tabs>
    <div style={{ position: 'absolute', left: 1270, top: 262, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptPanel title="prompt · plan de développement" size={18} cls={A.right} style={dl(200)}>
        Objectif d’évolution : <V>objectif</V>. Compétences actuelles : <V>forces</V>. Écarts : <V>écarts</V>. Propose un plan sur 12 mois selon le modèle 70 / 20 / 10, avec des
        actions concrètes, datées et mesurables.
      </PromptPanel>
      <Callout title="Le bon usage" tone="green" icon="humanCheck" cls={A.right} style={dl(350)} size={21}>
        Le plan se co-construit en entretien. L’IA fournit une liste d’options ; on en garde trois ou quatre, réalistes.
      </Callout>
    </div>
  </Frame>
);

// ─── Identifier les besoins de formation ────────────────────────────────────
const M6_NEEDS = [
  { t: 'Gérer les clients difficiles', n: 14, tone: 'coral' as Tone },
  { t: 'Maîtriser le nouveau CRM', n: 11, tone: 'blue' as Tone },
  { t: 'Bases techniques des pompes à chaleur', n: 9, tone: 'teal' as Tone },
  { t: 'Organiser son temps et ses rappels', n: 6, tone: 'violet' as Tone },
  { t: 'Rédiger des réponses écrites', n: 4, tone: 'green' as Tone },
];

const M6_Besoins: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Identifier les besoins de formation à partir de 30 entretiens</Title>
    <Lede>Prompt sur les comptes rendus anonymisés : « Identifie et compte les besoins exprimés. Cite un extrait par thème. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px' }}>
      <Eyebrow c={C.navy} size={20}>
        Besoins exprimés · nombre de mentions sur 30 entretiens
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {M6_NEEDS.map((x, i) => (
          <div key={x.t} style={{ display: 'grid', gridTemplateColumns: '380px 1fr 50px', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 22, color: C.ink, fontWeight: 600 }}>{x.t}</span>
            <div style={{ height: 30, background: C.panel, borderRadius: 8 }}>
              <div className={A.grow} style={{ width: `${(x.n / 30) * 100}%`, height: '100%', borderRadius: 8, background: STRONG[x.tone], ...dl(200 + i * 120) }} />
            </div>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, textAlign: 'right' }}>{x.n}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 280, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <AIPanel title="Extrait cité" size={21} cls={b.on(1)}>
        « Je ne sais pas quoi répondre quand un client me menace de résilier, je finis par transférer à Karim. »
      </AIPanel>
      <Callout title="À vérifier" tone="yellow" icon="search" cls={b.on(2)} size={21}>
        Recomptez sur un échantillon : l’IA peut regrouper trop largement ou oublier un thème rare mais important.
      </Callout>
      <Callout title="Données" tone="coral" icon="eyeOff" cls={b.on(2)} size={21}>
        Comptes rendus anonymisés et agrégés : on cherche des tendances, pas des personnes.
      </Callout>
    </div>
  </Frame>
);

// ─── Créer un parcours d’intégration ────────────────────────────────────────
const M6Step = ({ x, when, title, items, tone, beat }: { x: number; when: string; title: string; items: string[]; tone: Tone; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ position: 'absolute', left: x, top: 380, width: 400 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 26, height: 26, borderRadius: 99, background: STRONG[tone], boxShadow: '0 0 0 7px var(--osd-bg)' }} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: STRONG[tone] }}>{when}</span>
    </div>
    <div style={{ marginTop: 18, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 22px' }}>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map((it) => (
          <Bullet key={it} size={20} tone={tone}>
            {it}
          </Bullet>
        ))}
      </div>
    </div>
  </div>
);

const M6_Parcours: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Un parcours d’intégration sur 90 jours</Title>
    <Lede>Prompt : « Crée un parcours d’intégration de 90 jours pour <V>poste</V> : étapes, interlocuteurs, jalons. »</Lede>
    <svg width={1680} height={20} style={{ position: 'absolute', left: 120, top: 383 }} aria-hidden>
      <path d="M13 10 H 1667" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
    </svg>
    <M6Step x={120} when="Avant J1" tone="grey" beat={0} title="Préparer l’arrivée" items={['Message J−7 (module 5)', 'Poste, accès, badge prêts', 'Binôme désigné : Nadia']} />
    <M6Step x={545} when="Semaine 1" tone="blue" beat={1} title="Découvrir" items={['Accueil, visite, équipe', 'Écoute d’appels en double', 'Les 10 pannes les plus fréquentes']} />
    <M6Step x={970} when="J30" tone="violet" beat={2} title="Pratiquer" items={['Premiers appels seul·e, binôme à côté', 'Formation CRM terminée', 'Point d’étonnement avec RH']} />
    <M6Step x={1395} when="J90" tone="green" beat={3} title="Être autonome" items={['Objectifs de qualité atteints', 'Bilan de fin de période d’essai', 'Premier souhait de développement']} />
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 880, width: 1680 }}>
      <Callout title="Rapport d’étonnement" tone="yellow" icon="bulb" size={22}>
        À J30, demandez au nouvel arrivant ce qui l’a surpris : l’IA peut ensuite synthétiser ces rapports pour améliorer le parcours.
      </Callout>
    </div>
  </Frame>
);

// ─── Communication interne et supports RH : la boîte à prompts ──────────────
const M6Box = ({ icon, tone, title, use, prompt }: { icon: IconName; tone: Tone; title: string; use: string; prompt: ReactNode }) => (
  <FlipCard
    w={538}
    h={290}
    tone={tone}
    backTone="violet"
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={icon} tone={tone} size={52} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{use}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.violet.fg} size={17}>
          Le prompt
        </Eyebrow>
        <div style={{ marginTop: 10, fontFamily: mono, fontSize: 17, lineHeight: 1.5, color: C.ink }}>{prompt}</div>
      </>
    }
  />
);

const M6_Supports: Page = () => (
  <Frame mod={6} kind="demo">
    <Title>Communication interne : six prompts prêts à l’emploi</Title>
    <Lede>Cliquez une carte pour découvrir le prompt. Tous suivent la méthode des cinq ingrédients.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 538px)', gap: 33, rowGap: 30 }}>
      <M6Box icon="note" tone="blue" title="Note interne" use="Annoncer un changement : horaires, mutuelle, nouvel outil." prompt="Rédige une note interne de 150 mots pour annoncer {{changement}}. Public : {{public}}. Commence par ce qui change pour eux, puis pourquoi, puis quand. Ton clair et rassurant." />
      <M6Box icon="chat" tone="teal" title="FAQ salariés" use="Traduire un accord ou une politique en questions simples." prompt="À partir de ce texte {{politique}}, rédige une FAQ de 10 questions que se poseraient des salariés non juristes. Réponses de 3 lignes maximum, en citant l’article concerné." />
      <M6Box icon="megaphone" tone="violet" title="Newsletter RH" use="Le rendez-vous mensuel : arrivées, formations, rappels." prompt="Rédige la newsletter RH de {{mois}} à partir de ces informations {{infos}}. 4 rubriques, titres accrocheurs, 300 mots, ton convivial. N’ajoute aucune information." />
      <M6Box icon="graduation" tone="green" title="Quiz de formation" use="Vérifier les acquis après une formation ou un e-learning." prompt="Crée un quiz de 10 questions à choix multiples sur {{support}}. Une seule bonne réponse, 3 distracteurs plausibles, une explication courte par question." />
      <M6Box icon="layers" tone="yellow" title="Fiche pratique" use="Une page pour expliquer une démarche : congés, notes de frais…" prompt="Transforme cette procédure {{procédure}} en fiche pratique d’une page : 5 étapes numérotées, un encadré « erreurs fréquentes », un contact. Langage simple." />
      <M6Box icon="palette" tone="pink" title="Support de présentation" use="Le plan d’une réunion d’information ou d’un atelier." prompt="Propose le plan d’une présentation de 20 minutes sur {{sujet}} pour {{public}} : 8 diapositives, un titre et 3 idées par diapositive, une question d’interaction." />
    </div>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz : accompagner les collaborateurs avec l’IA</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pour préparer l’entretien annuel de Karim, vous collez dans l’IA…" explain="Des faits anonymisés suffisent pour obtenir une trame et des questions. Nom, santé ou disciplinaire n’apportent rien et exposent des données sensibles.">
        <QOpt>Son dossier complet, arrêts maladie compris</QOpt>
        <QOpt ok>Des faits de l’année, anonymisés, sans donnée sensible</QOpt>
        <QOpt>Rien : l’IA est interdite pour les entretiens annuels</QOpt>
      </QuizQ>
      <QuizQ q="Dans le modèle 70 / 20 / 10, les 70 % correspondent à…" explain="L’essentiel du développement se fait en situation de travail ; la formation formelle n’en représente qu’une petite part.">
        <QOpt>La formation en salle</QOpt>
        <QOpt ok>L’apprentissage en situation de travail</QOpt>
        <QOpt>Le mentorat</QOpt>
      </QuizQ>
      <QuizQ q="L’IA a identifié 5 besoins de formation dans 30 comptes rendus. Avant de décider…" explain="L’IA peut regrouper trop largement ou oublier un thème rare : on vérifie sur un échantillon avant d’engager un budget.">
        <QOpt>On lance le plan de formation tel quel</QOpt>
        <QOpt ok>On vérifie le comptage sur un échantillon</QOpt>
        <QOpt>On demande à l’IA de confirmer son analyse</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M6_Synthese: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Ce qu’on retient du module 6</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="navy" d={100}>
        Entretien annuel : l’IA <strong>prépare les deux parties</strong>, elle n’évalue personne.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Plan de développement <strong>70 / 20 / 10</strong>, co-construit en entretien.
      </SynthRow>
      <SynthRow n={3} tone="coral" d={300}>
        Besoins de formation : des <strong>tendances</strong> sur données anonymisées, vérifiées.
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        Un <strong>parcours d’intégration</strong> de 90 jours, jalonné et mesuré.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        Notes, FAQ, newsletters, quiz : <strong>six prompts</strong> pour la communication interne.
      </SynthRow>
    </div>
    <ReflexCard title="Mon réflexe · M6">
      Quand il s’agit d’un collaborateur, je travaille sur <strong>des faits anonymisés</strong> et je garde l’<strong>appréciation pour le dialogue humain</strong>.
    </ReflexCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_Annuel, M6_PDI, M6_Besoins, M6_Parcours, M6_Supports, M6_Quiz, M6_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M6 · 15:40

OBJECTIF — Basculer du recrutement vers les collaborateurs en poste.

DIRE — « Camille a été recrutée. Et maintenant ? L’IA peut aussi vous aider après l’embauche : entretiens annuels, plans de développement, besoins de formation, parcours d’intégration, communication interne. Avec le même principe : l’IA prépare, le dialogue reste humain. Trente-cinq minutes, rythme soutenu. »

TRANSITION — « Premier usage, très attendu : l’entretien annuel. »`,
  `⏱ 6 min · ENTRETIEN ANNUEL (2 clics)

OBJECTIF — Montrer comment préparer l’entretien annuel avec l’IA, côté manager et côté collaborateur.

DIRE — « L’entretien annuel se prépare des deux côtés. Pour le manager : bilan, questions ouvertes, formulation des points d’amélioration, objectifs SMART. Pour le collaborateur : auto-évaluation, besoins, souhaits d’évolution. Vous pouvez fournir les deux guides. » Clic : le prompt. « Des faits anonymisés, et la consigne : ne porte aucun jugement sur la personne. » Clic : la ligne rouge.

ANIMATION — Question au groupe : « Qui fournit déjà un guide de préparation aux collaborateurs ? » C’est souvent l’usage le plus apprécié.

TRANSITION — « Après l’entretien, le plan de développement. »`,
  `⏱ 5 min · PLAN DE DÉVELOPPEMENT 70 / 20 / 10 (onglets)

OBJECTIF — Produire un plan de développement concret.

DIRE — « Camille veut devenir référente qualité. Le modèle 70 / 20 / 10 : 70 % du développement se fait en situation, 20 % avec les autres, 10 % en formation. » Cliquer les trois onglets. « L’IA propose des actions concrètes, datées. Camille et Karim en choisissent trois ou quatre. »

INSISTER — Le 70 / 20 / 10 est un repère, pas une loi : l’utiliser pour équilibrer, pas pour calculer.

TRANSITION — « À l’échelle du service, comment repérer les besoins de formation ? »`,
  `⏱ 5 min · BESOINS DE FORMATION (2 clics)

OBJECTIF — Montrer l’analyse de comptes rendus pour identifier des tendances.

DIRE — « Trente comptes rendus d’entretiens du service client, anonymisés. L’IA identifie et compte les besoins exprimés. En tête : gérer les clients difficiles, quatorze mentions. » Clic : « Elle cite un extrait par thème : ça permet de vérifier. » Clic : « Deux vigilances : recompter sur un échantillon, et travailler sur des données anonymisées et agrégées. »

TRANSITION — « Ces besoins nourrissent aussi l’intégration des nouveaux. »`,
  `⏱ 4 min · PARCOURS D’INTÉGRATION (3 clics)

OBJECTIF — Créer un parcours d’intégration jalonné.

DIRE — « Avant J1 : on retrouve le message J−7 du module 5. » Clic : « Semaine 1 : découvrir. » Clic : « J30 : pratiquer, avec un point d’étonnement. » Clic : « J90 : autonomie et bilan de période d’essai. » Puis le rapport d’étonnement : « C’est une mine d’or, et l’IA sait très bien les synthétiser. »

TRANSITION — « Dernier volet : la communication interne. »`,
  `⏱ 6 min · SIX PROMPTS (cartes à retourner)

OBJECTIF — Couvrir communication interne et création de supports RH.

DIRE — « Six usages fréquents, six prompts prêts à l’emploi. » Retourner deux ou trois cartes selon l’intérêt du groupe. « La FAQ salariés est souvent la plus rentable : un accord de quarante pages devient dix questions compréhensibles. Remarquez la consigne : citer l’article concerné, pour pouvoir vérifier. »

ANIMATION — Demander quel support le groupe produit le plus souvent ; le faire générer en direct si le temps le permet.

TRANSITION — « Trois questions pour vérifier. »`,
  `⏱ 3 min · QUIZ M6

ANIMATION — Une question à la fois, vote, clic.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE M6

DIRE — Relire les cinq lignes. « Et le réflexe : des faits anonymisés, et l’appréciation réservée au dialogue humain. »

TRANSITION — « Dernier module : éthique, confidentialité, et le cas pratique qui reprend toute la journée. »`,
];
// @@NOTES-END
