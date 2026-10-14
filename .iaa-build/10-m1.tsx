// ─── Module 1 · De l’IA générative à l’automatisation intelligente ─────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        Vers l’automatisation
        <br />
        intelligente
      </>
    }
    sub="De l’IA qu’on interroge à l’IA intégrée dans un processus : ce qui change, ce qui s’automatise, ce qui reste humain."
    dur="9:30 – 11:00 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · cartographier un processus
      </Tag>
    }
  >
    <SecItem n={1}>Ce que l’IA générative sait faire… et ne sait pas faire</SecItem>
    <SecItem n={2}>Assistance, augmentation, automatisation, automatisation intelligente</SecItem>
    <SecItem n={3}>Qu’est-ce qu’un workflow IA ?</SecItem>
    <SecItem n={4}>Repérer les tâches à automatiser et celles à garder</SecItem>
    <SecItem n={5}>Évaluer le potentiel et le gain d’un processus</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Rappel : capacités (cartes à retourner) ────────────────────────────────
const M1Cap = ({ icon, tone, title, desc, ex, flipAt }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode; flipAt?: number }) => (
  <FlipCard
    w={536}
    h={300}
    tone={tone}
    backTone={tone}
    flipAt={flipAt}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name={icon} tone={tone} size={60} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{desc}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={19}>
          Dans un workflow
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M1_Capacites: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Rappel : six choses que l’IA générative fait très bien</Title>
    <Lede>Cliquez une carte pour voir la même capacité branchée dans un processus. → retourne tout.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M1Cap icon="pen" tone="violet" title="Rédiger" desc="Brouillons d’emails, réponses types, comptes rendus, fiches." ex="Chaque demande reçue génère un brouillon de réponse, prêt à valider dans la boîte mail." flipAt={1} />
      <M1Cap icon="note" tone="blue" title="Résumer" desc="Réduire un long texte à l’essentiel, dans un format choisi." ex="Chaque réunion enregistrée produit un compte rendu avec décisions et actions, déposé dans Teams." flipAt={1} />
      <M1Cap icon="filter" tone="yellow" title="Classer" desc="Ranger un texte dans une catégorie : sujet, urgence, ton." ex="Chaque email du SAV reçoit une catégorie et une priorité, puis part dans la bonne file." flipAt={1} />
      <M1Cap icon="search" tone="teal" title="Extraire" desc="Retrouver des champs précis dans un texte libre ou un PDF." ex="Chaque facture fournisseur devient une ligne : date, montant HT, TVA, échéance." flipAt={1} />
      <M1Cap icon="loop" tone="green" title="Transformer" desc="Changer de forme : texte → tableau, ton, langue, longueur." ex="Les avis clients libres deviennent un tableau thème / sentiment / suggestion." flipAt={1} />
      <M1Cap icon="eye" tone="pink" title="Analyser" desc="Comparer, repérer des écarts, des risques, des tendances." ex="Chaque nouvelle version de contrat est comparée à la précédente : écarts signalés au juriste." flipAt={1} />
    </div>
  </Frame>
);

// ─── Quiz flash : vrai ou faux ? ────────────────────────────────────────────
const M1_QuizFlash: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz flash : ce que l’IA générative ne fait pas (bien)</Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA calcule de façon fiable la TVA de 500 lignes de factures. »" explain="Un modèle de langage prédit du texte ; il peut se tromper sur un calcul. On lui fait extraire les montants, et une formule ou l’outil d’automatisation calcule.">
        <QOpt>Vrai, c’est un ordinateur</QOpt>
        <QOpt ok>Faux : extraction par l’IA, calcul par une règle</QOpt>
        <QOpt>Vrai, si on lui demande d’être précise</QOpt>
      </QuizQ>
      <QuizQ q="« Le même prompt donne toujours exactement la même réponse. »" explain="La génération comporte une part d’aléatoire. Dans un workflow, on réduit l’écart avec un format imposé, des exemples, des valeurs autorisées… et on contrôle la sortie.">
        <QOpt>Vrai</QOpt>
        <QOpt ok>Faux : il faut cadrer le format et vérifier la sortie</QOpt>
        <QOpt>Vrai, sauf le week-end</QOpt>
      </QuizQ>
      <QuizQ q="« L’IA connaît nos procédures internes et nos tarifs. »" explain="Elle ne connaît que ce qu’on lui fournit dans le contexte : documents joints, base de connaissances, données passées par le workflow. Sinon, elle invente une réponse plausible.">
        <QOpt>Vrai, elle a été entraînée sur Internet</QOpt>
        <QOpt>Vrai, si l’entreprise a un site web</QOpt>
        <QOpt ok>Faux, sauf si on les lui fournit</QOpt>
      </QuizQ>
      <QuizQ q="« L’IA peut se tromper en ayant l’air parfaitement sûre d’elle. »" explain="C’est l’hallucination : une réponse fausse, bien formulée. D’où les contrôles automatiques et la validation humaine aux endroits qui comptent (module 9).">
        <QOpt ok>Vrai, et c’est le principal risque</QOpt>
        <QOpt>Faux, elle dit « je ne sais pas »</QOpt>
        <QOpt>Faux, avec les modèles récents</QOpt>
      </QuizQ>
      <QuizQ q="« Pour lire 300 emails par jour, l’IA est plus rapide qu’une personne. »" explain="Vrai, en quelques secondes par email. Le gain réel dépend du temps de contrôle qu’on garde : c’est ce qu’on calculera avec le simulateur de gain.">
        <QOpt ok>Vrai</QOpt>
        <QOpt>Faux</QOpt>
        <QOpt>Seulement en anglais</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── De l’usage ponctuel au processus ───────────────────────────────────────
const M1Hop = ({ icon, tone, label, sub }: { icon: IconName; tone: Tone; label: string; sub: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M1Down = () => (
  <div style={{ paddingLeft: 18, height: 26 }}>
    <svg width={20} height={26} aria-hidden>
      <path d="M10 2 V 20 M4 14 L10 21 L16 14" fill="none" stroke={C.faint} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const M1_Ponctuel: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>De l’usage ponctuel à l’intégration dans le processus</Title>
    <Lede>Même tâche, même IA : seule la place de l’humain change.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 800, height: 580, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <PanelTitle icon="user" c={C.coral}>
          Aujourd’hui · usage ponctuel
        </PanelTitle>
        <Tag tone="coral" size={20}>× 40 par jour</Tag>
      </div>
      <M1Hop icon="mail" tone="grey" label="J’ouvre l’email" sub="je lis, je comprends la demande" />
      <M1Down />
      <M1Hop icon="chat" tone="grey" label="Je copie-colle dans l’IA" sub="j’écris (encore) le même prompt" />
      <M1Down />
      <M1Hop icon="eye" tone="grey" label="Je relis la réponse" sub="je corrige, je reformule" />
      <M1Down />
      <M1Hop icon="send" tone="grey" label="Je recolle et j’envoie" sub="je classe l’email à la main" />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1000, top: 260, width: 800, height: 580, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 0 0 3px ${C.green}`, padding: '26px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <PanelTitle icon="route" c={T.green.fg}>
          Demain · IA intégrée
        </PanelTitle>
        <Tag tone="green" size={20}>sans copier-coller</Tag>
      </div>
      <M1Hop icon="bolt" tone="blue" label="L’email arrive : le flux démarre" sub="déclencheur automatique" />
      <M1Down />
      <M1Hop icon="sparkles" tone="violet" label="L’IA classe et rédige un brouillon" sub="prompt écrit une fois, testé, versionné" />
      <M1Down />
      <M1Hop icon="humanCheck" tone="pink" label="Je valide ou je corrige" sub="mon temps va à la décision" />
      <M1Down />
      <M1Hop icon="archive" tone="green" label="Envoi et classement automatiques" sub="tout est tracé" />
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 878, width: 1680, display: 'flex', alignItems: 'center', gap: 18, fontSize: 26, color: C.ink }}>
      <Icon name="clock" size={30} color={C.violet} />
      <span>
        40 × 4 min = <strong style={{ color: C.coral }}>2 h 40</strong> par jour → 40 × 1 min de validation = <strong style={{ color: C.green }}>40 min</strong>. Et une réponse plus homogène.
      </span>
    </div>
  </Frame>
);

// ─── Les quatre niveaux ─────────────────────────────────────────────────────
const M1Level = ({ n, tone, title, who, ex, x, top, cls }: { n: number; tone: Tone; title: string; who: string; ex: string; x: number; top: number; cls: string }) => (
  <div
    className={cls}
    style={{ position: 'absolute', left: x, top, width: 400, height: 900 - top, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '22px 26px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone={tone} size={46} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, lineHeight: 1.15, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, fontWeight: 600, color: T[tone].fg }}>{who}</div>
    <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.42, color: C.soft }}>{ex}</div>
  </div>
);

const M1_Niveaux: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Quatre niveaux d’automatisation</Title>
    <Lede>Plus on monte, moins l’humain intervient à chaque cas… et plus le cadrage initial compte.</Lede>
    <M1Level n={1} tone="grey" x={120} top={520} cls={A.in} title="Assistance" who="L’humain fait, l’IA aide à la demande" ex="« Reformule ce mail plus poliment. » Un échange, une réponse." />
    <M1Level n={2} tone="blue" x={546} top={440} cls={b.on(1)} title="Augmentation" who="L’IA propose, l’humain décide et finit" ex="L’IA prépare un compte rendu ; vous le corrigez et l’envoyez." />
    <M1Level n={3} tone="green" x={972} top={360} cls={b.on(2)} title="Automatisation" who="Des règles fixes s’exécutent seules" ex="Toute facture reçue est enregistrée dans le bon dossier. Aucune IA : si X, alors Y." />
    <M1Level n={4} tone="violet" x={1398} top={280} cls={b.on(3)} title="Automatisation intelligente" who="Règles + IA pour comprendre le langage" ex="Chaque email est lu, classé et routé ; un humain valide les cas sensibles." />
    <svg width={1680} height={60} style={{ position: 'absolute', left: 120, top: 908 }} aria-hidden>
      <path d="M10 30 H 1640" stroke={C.rule} strokeWidth={4} strokeLinecap="round" />
      <path d="M1625 18 L1660 30 L1625 42" fill="none" stroke={C.faint} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 960, fontSize: 20, color: C.muted }}>Autonomie du système ↑ · interventions humaines par cas ↓ · exigence de conception ↑</div>
  </Frame>
);

// ─── Exercice : ranger les exemples (glisser-déposer) ───────────────────────
const M1Zone = ({ x, tone, title, sol }: { x: number; tone: Tone; title: string; sol: string }) => (
  <div style={{ position: 'absolute', left: x, top: 410, width: 405, height: 520, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 18px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{title}</div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 18, right: 18, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>
      <Icon name="checkCircle" size={26} color={STRONG[tone]} /> {sol}
    </div>
  </div>
);

const M1Chip = ({ n, x, y, children }: { n: number; x: number; y: number; children: ReactNode }) => (
  <Drag x={x} y={y} w={405} tone="navy" size={20}>
    <Num n={n} tone="navy" size={32} />
    <span>{children}</span>
  </Drag>
);

const M1_Classer: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title size={46}>Exercice : à quel niveau appartient chaque usage ?</Title>
    <M1Zone x={120} tone="grey" title="1 · Assistance" sol="Solution : 3 · 7" />
    <M1Zone x={545} tone="blue" title="2 · Augmentation" sol="Solution : 1 · 5" />
    <M1Zone x={970} tone="green" title="3 · Automatisation" sol="Solution : 4 · 8" />
    <M1Zone x={1395} tone="violet" title="4 · Auto. intelligente" sol="Solution : 2 · 6" />
    <M1Chip n={1} x={120} y={190}>L’IA rédige un compte rendu que je corrige</M1Chip>
    <M1Chip n={2} x={545} y={190}>Chaque CV reçu est résumé et noté, le recruteur décide</M1Chip>
    <M1Chip n={3} x={970} y={190}>Je demande une analyse SWOT de mon offre</M1Chip>
    <M1Chip n={4} x={1395} y={190}>Relance automatique à J+7 d’un devis non signé</M1Chip>
    <M1Chip n={5} x={120} y={296}>L’IA propose un plan de formation que j’adapte</M1Chip>
    <M1Chip n={6} x={545} y={296}>Les emails SAV sont lus par l’IA et routés au bon service</M1Chip>
    <M1Chip n={7} x={970} y={296}>Je fais traduire une offre commerciale en anglais</M1Chip>
    <M1Chip n={8} x={1395} y={296}>Toute pièce jointe « facture » est copiée dans un dossier</M1Chip>
    <Hint style={{ position: 'absolute', left: 120, top: 950 }}>Glissez chaque carte dans une colonne (double-clic = retour). → affiche la correction.</Hint>
  </Frame>
);

// ─── Qu’est-ce qu’un workflow IA ? ──────────────────────────────────────────
const M1Gap = ({ x }: { x: number }) => (
  <div style={{ position: 'absolute', left: x, top: 545 }}>
    <FlowArrow w={48} color={C.faint} />
  </div>
);

const M1_Workflow: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Qu’est-ce qu’un workflow IA ?</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680 }}>
      <Callout title="Définition de travail" tone="violet" icon="route">
        Une suite d’étapes <strong>déclenchée par un événement</strong>, qui s’exécute sans intervention, et dont au moins une étape confie à l’IA une tâche de{' '}
        <strong>compréhension ou de production de langage</strong>.
      </Callout>
    </div>
    <FlowNode kind="trigger" label="Un formulaire est envoyé" sub="« nouvelle demande »" w={296} cls={A.in} style={{ position: 'absolute', left: 120, top: 470, ...dl(200) }} />
    <M1Gap x={420} />
    <FlowNode kind="data" label="Les champs sont lus" sub="nom, service, message" w={296} cls={A.in} style={{ position: 'absolute', left: 466, top: 470, ...dl(300) }} />
    <M1Gap x={766} />
    <FlowNode kind="ai" label="L’IA résume et classe" sub="catégorie, urgence, résumé" w={296} cls={cx(A.in, b.hi(1))} style={{ position: 'absolute', left: 812, top: 470, ...dl(400) }} />
    <M1Gap x={1112} />
    <FlowNode kind="cond" label="Urgent ?" sub="oui → alerte · non → file" w={296} cls={A.in} style={{ position: 'absolute', left: 1158, top: 470, ...dl(500) }} />
    <M1Gap x={1458} />
    <FlowNode kind="action" label="Le bon service est notifié" sub="avec le résumé" w={296} cls={A.in} style={{ position: 'absolute', left: 1504, top: 470, ...dl(600) }} />
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="violet" icon="sparkles" title="L’IA n’est qu’une étape" cls={b.on(1)} style={{ flex: 1 }} size={23}>
        Elle comprend le texte. Le reste, ce sont des règles et des actions classiques.
      </Card>
      <Card tone="blue" icon="bolt" title="Il tourne sans vous" cls={b.on(2)} style={{ flex: 1 }} size={23}>
        Un événement le lance : un email, un formulaire, une heure, un fichier déposé.
      </Card>
      <Card tone="green" icon="flag" title="Il produit un résultat" cls={b.on(3)} style={{ flex: 1 }} size={23}>
        Vérifiable et tracé : une ligne, un message, un document, une décision à prendre.
      </Card>
    </div>
  </Frame>
);

// ─── Identifier les tâches automatisables ───────────────────────────────────
const M1Crit = ({ icon, tone, title, signal, ex, d }: { icon: IconName; tone: Tone; title: string; signal: string; ex: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', gap: 22, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={66} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 29, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 23, fontStyle: 'italic', color: T[tone].fg }}>{signal}</div>
      <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
  </div>
);

const M1_Taches: Page = () => (
  <Frame mod={1}>
    <Title>Repérer les tâches à automatiser : quatre signaux</Title>
    <Lede>Écoutez comment vous parlez de votre travail : certaines phrases trahissent une tâche à automatiser.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <M1Crit icon="loop" tone="blue" title="Répétitive" signal="« Je fais toujours la même chose. »" ex="Accusés de réception, relances, saisies, mises en forme de rapports." d={100} />
      <M1Crit icon="clock" tone="violet" title="Chronophage" signal="« Ça me prend des heures chaque semaine. »" ex="Tri d’une boîte partagée, consolidation de fichiers, préparation de réunions." d={200} />
      <M1Crit icon="archive" tone="teal" title="À faible valeur ajoutée" signal="« Je recopie d’un outil à l’autre. »" ex="Ressaisie d’un formulaire dans le CRM, copie de pièces jointes, mise à jour de tableaux." d={300} />
      <M1Crit icon="filter" tone="yellow" title="Classer ou analyser du texte" signal="« Je lis pour savoir à qui l’envoyer. »" ex="Qualifier une demande, résumer un document, extraire les infos d’un CV ou d’une facture." d={400} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 700, width: 1680, ...dl(600) }}>
      <Callout title="Le meilleur candidat" tone="green" icon="target">
        Une tâche qui coche les quatre signaux, par exemple le tri des demandes reçues sur une adresse générique : répétitif, chronophage, sans valeur ajoutée… et il faut
        lire pour classer, donc l’IA est utile.
      </Callout>
    </div>
  </Frame>
);

// ─── Ce qui doit rester humain ──────────────────────────────────────────────
const M1Keep = ({ icon, title, children, d }: { icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone="pink" size={54} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M1_Humain: Page = () => (
  <Frame mod={1}>
    <Title>Ce qui doit rester sous contrôle humain</Title>
    <Lede>Automatiser ne veut pas dire tout déléguer. Cinq zones où l’humain garde la main.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1000, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M1Keep icon="scale" title="Les décisions qui affectent une personne" d={100}>
        Recrutement, sanction, crédit, refus de prestation : le RGPD encadre la décision 100 % automatisée.
      </M1Keep>
      <M1Keep icon="hand" title="Les relations sensibles" d={200}>
        Réclamation grave, conflit, situation personnelle difficile : l’empathie ne s’automatise pas.
      </M1Keep>
      <M1Keep icon="key" title="Ce qui engage l’entreprise" d={300}>
        Prix, remise, contrat, signature, réponse juridique : quelqu’un doit en répondre.
      </M1Keep>
      <M1Keep icon="alert" title="Les cas inédits et les exceptions" d={400}>
        Ce que les règles n’ont pas prévu doit sortir du flux vers une personne.
      </M1Keep>
      <M1Keep icon="eye" title="Le contrôle de la qualité" d={500}>
        Même automatisé, un processus se vérifie : échantillons, indicateurs, revue régulière.
      </M1Keep>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1180, top: 280, width: 620, ...dl(400) }}>
      <Quote by="Le fil conducteur des deux jours">L’IA traite, le workflow orchestre, l’humain décide.</Quote>
      <div style={{ marginTop: 48 }}>
        <Callout title="Règle pratique" tone="pink" icon="humanCheck" size={24}>
          Si une erreur de l’IA peut blesser quelqu’un, coûter cher ou engager l’entreprise, un humain valide <strong>avant</strong> l’action.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Simulateur : potentiel d’automatisation ────────────────────────────────
type M1Vals = { freq: number; vol: number; rules: number; data: number; tol: number; judg: number };
const M1_PRESETS: Record<string, M1Vals> = {
  factures: { freq: 5, vol: 4, rules: 4, data: 4, tol: 3, judg: 1 },
  reclam: { freq: 3, vol: 2, rules: 2, data: 4, tol: 1, judg: 5 },
  cr: { freq: 4, vol: 3, rules: 3, data: 5, tol: 4, judg: 2 },
};

const M1Slider = ({ label, hint, v, set, tone }: { label: string; hint: string; v: number; set: (n: number) => void; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <div style={{ width: 330 }}>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 18, color: C.muted }}>{hint}</div>
    </div>
    <Range value={v} onChange={set} min={1} max={5} w={440} tone={tone} />
    <span style={{ width: 40, fontFamily: display, fontWeight: 800, fontSize: 34, color: STRONG[tone] }}>{v}</span>
  </div>
);

const M1_Score: Page = () => {
  const [v, setV] = useState<M1Vals>(M1_PRESETS.factures);
  const set = (key: keyof M1Vals) => (n: number) => setV((o) => ({ ...o, [key]: n }));
  const raw = (v.freq + v.vol + v.rules + v.data + v.tol + (6 - v.judg) - 6) / 24;
  const score = Math.round(raw * 100);
  const lv =
    score >= 80
      ? { t: 'Automatiser, contrôle par échantillon', tone: 'green' as Tone, n: 4 }
      : score >= 62
        ? { t: 'Automatiser avec validation humaine', tone: 'violet' as Tone, n: 4 }
        : score >= 42
          ? { t: 'Augmenter : l’IA propose, l’humain décide', tone: 'blue' as Tone, n: 2 }
          : { t: 'Garder humain, assistance ponctuelle', tone: 'coral' as Tone, n: 1 };
  return (
    <Frame mod={1} kind="simu">
      <Title>Simulateur : quel potentiel d’automatisation ?</Title>
      <Lede>Notez le processus de 1 à 5 sur chaque critère, ou partez d’un exemple.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 12 }}>
        <Btn size={20} ghost icon="euro" onClick={() => setV(M1_PRESETS.factures)}>
          Factures fournisseurs
        </Btn>
        <Btn size={20} ghost tone="coral" icon="alert" onClick={() => setV(M1_PRESETS.reclam)}>
          Réclamations clients
        </Btn>
        <Btn size={20} ghost tone="violet" icon="note" onClick={() => setV(M1_PRESETS.cr)}>
          Comptes rendus
        </Btn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 340, width: 1000, display: 'flex', flexDirection: 'column', gap: 22, ...dl(150) }}>
        <M1Slider label="Fréquence" hint="1 = rare · 5 = plusieurs fois par jour" v={v.freq} set={set('freq')} tone="blue" />
        <M1Slider label="Volume" hint="1 = quelques cas · 5 = des centaines" v={v.vol} set={set('vol')} tone="blue" />
        <M1Slider label="Règles stables" hint="1 = au cas par cas · 5 = toujours pareil" v={v.rules} set={set('rules')} tone="teal" />
        <M1Slider label="Données numériques" hint="1 = papier, oral · 5 = formulaires, emails" v={v.data} set={set('data')} tone="teal" />
        <M1Slider label="Tolérance à l’erreur" hint="1 = erreur grave · 5 = sans conséquence" v={v.tol} set={set('tol')} tone="green" />
        <M1Slider label="Besoin de jugement" hint="1 = aucun · 5 = empathie, arbitrage" v={v.judg} set={set('judg')} tone="coral" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1200, top: 340, width: 600, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
        <Eyebrow c={C.muted} size={20}>
          Potentiel d’automatisation
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, color: STRONG[lv.tone] }}>{score}</span>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 40, color: C.faint }}>/ 100</span>
        </div>
        <div style={{ marginTop: 16, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: STRONG[lv.tone], transition: `width 500ms ${EASE}, background 300ms` }} />
        </div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Num n={lv.n} tone={lv.tone} size={44} />
          <span style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.3, color: T[lv.tone].fg }}>{lv.t}</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Le « besoin de jugement » pèse à l’envers : plus il est fort, plus l’humain doit rester dans la boucle.
        </div>
      </div>
    </Frame>
  );
};

// ─── Calculateur de gain ────────────────────────────────────────────────────
const M1Gauge = ({ label, hint, v, set, min, max, step = 1, unit, tone }: { label: string; hint: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: STRONG[tone] }}>
        {fr(v)} <span style={{ fontSize: 22, fontWeight: 600 }}>{unit}</span>
      </span>
    </div>
    <div style={{ fontSize: 19, color: C.muted, marginBottom: 10 }}>{hint}</div>
    <Range value={v} onChange={set} min={min} max={max} step={step} w={900} tone={tone} />
  </div>
);

const M1_Gain: Page = () => {
  const [vol, setVol] = useState(400);
  const [mins, setMins] = useState(6);
  const [share, setShare] = useState(70);
  const [ctrl, setCtrl] = useState(1);
  const perTask = Math.max(0, (mins * share) / 100 - ctrl);
  const hMonth = (vol * perTask) / 60;
  const dYear = (hMonth * 11) / 7;
  return (
    <Frame mod={1} kind="simu">
      <Title>Évaluer le gain avant de construire</Title>
      <Lede>Le gain réel = temps automatisé − temps de contrôle qu’on garde. Ajustez avec un cas de votre service.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <M1Gauge label="Volume" hint="nombre de cas traités par mois" v={vol} set={setVol} min={20} max={2000} step={20} unit="/ mois" tone="blue" />
        <M1Gauge label="Temps par cas aujourd’hui" hint="lecture, saisie, rédaction, classement" v={mins} set={setMins} min={1} max={45} unit="min" tone="violet" />
        <M1Gauge label="Part automatisable" hint="ce que le workflow fera vraiment seul" v={share} set={setShare} min={10} max={100} step={5} unit="%" tone="teal" />
        <M1Gauge label="Contrôle humain gardé" hint="validation, relecture, exceptions, par cas" v={ctrl} set={setCtrl} min={0} max={10} step={0.5} unit="min" tone="coral" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1120, top: 270, width: 680, display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
        <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', borderTop: `7px solid ${C.green}` }}>
          <Eyebrow c={C.muted} size={20}>
            Temps libéré
          </Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 110, lineHeight: 1.05, color: C.green }}>
            {fr(hMonth, hMonth < 10 ? 1 : 0)} <span style={{ fontSize: 44 }}>h / mois</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 26, color: C.soft }}>
            soit environ <strong style={{ color: C.navy }}>{fr(dYear)} jours</strong> de travail par an
          </div>
        </div>
        <Callout title="Avant de se réjouir" tone="yellow" icon="alert" size={23}>
          Ajoutez le temps de construction (quelques heures à quelques jours), de maintenance et le coût des outils. Un gain sous 5 h / mois rarement rentable.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Atelier 1 · Cartographier un processus ─────────────────────────────────
const M1_Atelier: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Cartographier un processus de votre activité"
    defi="cartographie"
    who="Individuel, puis échange en binôme"
    minutes={30}
    where={
      <>
        Une feuille A3 ou un tableau blanc numérique : <strong>une carte</strong> de votre processus, chaque étape étiquetée <strong>H</strong>, <strong>Auto</strong> ou{' '}
        <strong>IA</strong>, et le potentiel calculé avec le simulateur.
      </>
    }
    objective={
      <>
        Décrire votre processus fil rouge avec la grille <strong>Entrée → étapes → décisions → sortie</strong>, puis repérer les étapes qui peuvent être assistées ou automatisées par
        l’IA.
      </>
    }
    crit={
      <>
        <CheckItem id="a1c1" size={22}>Une entrée et une sortie clairement nommées</CheckItem>
        <CheckItem id="a1c2" size={22}>Les décisions apparaissent (losanges)</CheckItem>
        <CheckItem id="a1c3" size={22}>Chaque étape porte H, Auto ou IA</CheckItem>
        <CheckItem id="a1c4" size={22}>Volume et temps par cas estimés</CheckItem>
      </>
    }
  >
    <div>1. Listez les étapes telles qu’elles se passent <em>vraiment</em>, pas comme dans la procédure.</div>
    <div>2. Entourez les décisions : qui décide, sur quel critère ?</div>
    <div>3. Étiquetez : H (humain), Auto (règle fixe), IA (il faut comprendre du texte).</div>
    <div>4. Le binôme challenge : « pourquoi H ici ? qu’est-ce qui coince ? »</div>
    <Bonus>Passez votre processus dans le simulateur et le calculateur : notez score et gain.</Bonus>
  </LabPage>
);

// ─── Exemple de cartographie : les notes de frais ───────────────────────────
const M1Box = ({ x, y, w = 214, title, sub, tone = 'grey', d }: { x: number; y: number; w?: number; title: string; sub?: string; tone?: Tone; d: number }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: y, width: w, height: 140, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[tone]}`, padding: '16px 14px', ...dl(d) }}>
    <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{title}</div>
    {sub ? <div style={{ marginTop: 4, fontSize: 17, lineHeight: 1.3, color: C.muted }}>{sub}</div> : null}
  </div>
);

const M1Lbl = ({ x, y, kind, beat }: { x: number; y: number; kind: 'auto' | 'ia' | 'h'; beat: number }) => {
  const m = { auto: { t: 'AUTO', tone: 'green' as Tone }, ia: { t: 'IA', tone: 'violet' as Tone }, h: { t: 'HUMAIN', tone: 'pink' as Tone } }[kind];
  return (
    <div className={b.pop(beat)} style={{ position: 'absolute', left: x, top: y }}>
      <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 8, background: STRONG[m.tone], color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 18, letterSpacing: '0.1em' }}>{m.t}</span>
    </div>
  );
};

const M1_Exemple: Page = () => (
  <Frame mod={1} kind="cas" beats={3}>
    <Title>Exemple de cartographie : les notes de frais</Title>
    <Lede>Entrée → étapes → décisions → sortie. Puis on étiquette chaque étape (→).</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M314 400 H 340 M554 400 H 580 M794 400 H 820 M1034 400 H 1066 M1234 400 H 1290 M1504 400 H 1530" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
      <path d="M1150 480 V 610" stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
      <text x={1166} y={556} fontSize={20} fontWeight={700} fill={C.coral}>
        non
      </text>
      <text x={1244} y={386} fontSize={20} fontWeight={700} fill={C.green}>
        oui
      </text>
    </svg>
    <M1Box x={120} y={330} w={194} title="Entrée" sub="photo du ticket + formulaire" tone="blue" d={100} />
    <M1Box x={340} y={330} title="1 · Collecter" sub="justificatif envoyé par mail" d={180} />
    <M1Box x={580} y={330} title="2 · Lire le ticket" sub="date, montant, TVA" d={260} />
    <M1Box x={820} y={330} title="3 · Vérifier" sub="plafonds, catégorie, doublon" d={340} />
    <div className={A.pop} style={{ position: 'absolute', left: 1080, top: 330, width: 140, height: 140, ...dl(420) }}>
      <div style={{ position: 'absolute', inset: 14, transform: 'rotate(45deg)', background: T.yellow.bg, boxShadow: `inset 0 0 0 3px ${C.yellow}`, borderRadius: 14 }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 700, color: T.yellow.fg, textAlign: 'center' }}>
        Conforme ?
      </div>
    </div>
    <M1Box x={1290} y={330} title="4 · Saisir en compta" sub="ligne + pièce jointe" d={500} />
    <M1Box x={1530} y={330} w={270} title="Sortie" sub="remboursement + archivage" tone="navy" d={580} />
    <M1Box x={1043} y={610} title="5 · Compléter ou refuser" sub="le manager tranche" tone="coral" d={660} />
    <M1Lbl x={360} y={488} kind="auto" beat={1} />
    <M1Lbl x={1310} y={488} kind="auto" beat={1} />
    <M1Lbl x={1550} y={488} kind="auto" beat={1} />
    <M1Lbl x={600} y={488} kind="ia" beat={2} />
    <M1Lbl x={840} y={488} kind="ia" beat={2} />
    <M1Lbl x={1063} y={768} kind="h" beat={3} />
    <div style={{ position: 'absolute', left: 120, top: 820, width: 860, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Bullet cls={b.on(1)} size={24} tone="green">
        <strong>Auto</strong> : collecter, saisir, archiver suivent des règles fixes
      </Bullet>
      <Bullet cls={b.on(2)} size={24} tone="violet">
        <strong>IA</strong> : lire un ticket photographié, juger une catégorie de dépense
      </Bullet>
      <Bullet cls={b.on(3)} size={24} tone="pink">
        <strong>Humain</strong> : l’exception (refus, complément) reste au manager
      </Bullet>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Quel niveau d’automatisation ?"
    q="Chaque email reçu sur contact@ est lu par l’IA, classé par sujet et transféré au bon service. Un humain ne relit que les demandes jugées sensibles. C’est…"
    explain="Des règles (transférer, notifier) combinées à une IA qui comprend le texte : c’est l’automatisation intelligente. La relecture des cas sensibles n’en fait pas de l’augmentation : la majorité des cas passent sans humain."
  >
    <Opt why="L’assistance suppose qu’un humain demande à l’IA, cas par cas. Ici, personne ne déclenche rien.">De l’assistance</Opt>
    <Opt why="En augmentation, l’humain finit chaque cas. Ici, la plupart des emails sont traités sans lui.">De l’augmentation</Opt>
    <Opt why="Une automatisation simple n’utilise que des règles fixes ; or il faut comprendre le texte pour classer.">Une automatisation simple</Opt>
    <Opt ok why="Exact : règles + IA pour le langage, et une validation humaine ciblée sur les cas sensibles.">
      Une automatisation intelligente
    </Opt>
  </QcmPage>
);

// ─── Synthèse M1 ────────────────────────────────────────────────────────────
const SynthRow = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={48} />
    <div style={{ fontSize: 26, lineHeight: 1.35, color: C.ink }}>{children}</div>
  </div>
);

const ProjectCard = ({ mod, children }: { mod: number; children: ReactNode }) => (
  <div className={A.right} style={{ position: 'absolute', left: 1240, top: 270, width: 560, background: G.navy, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', color: '#fff', ...dl(500) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="flag" size={34} color="#C9B6FF" />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: '#C9B6FF' }}>MON PROJET · M{mod}</span>
    </div>
    <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.5, color: '#E6EAF6' }}>{children}</div>
  </div>
);

const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Ce qu’on retient du module 1</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        L’IA générative <strong>comprend et produit du langage</strong> ; elle ne calcule ni ne décide de façon fiable.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Quatre niveaux : <strong>assistance, augmentation, automatisation, automatisation intelligente</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Un workflow IA est <strong>déclenché par un événement</strong> ; l’IA n’y est qu’une étape parmi d’autres.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        On automatise le <strong>répétitif, chronophage, sans valeur ajoutée</strong> ; on garde l’humain sur ce qui engage.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        On <strong>chiffre le gain</strong> avant de construire : temps automatisé moins temps de contrôle.
      </SynthRow>
    </div>
    <ProjectCard mod={1}>
      Votre processus est cartographié : entrée, étapes, décisions, sortie. Chaque étape est étiquetée <strong>H</strong>, <strong>Auto</strong> ou <strong>IA</strong>, et vous
      connaissez son potentiel.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Capacites, M1_QuizFlash, M1_Ponctuel, M1_Niveaux, M1_Classer, M1_Workflow, M1_Taches, M1_Humain, M1_Score, M1_Gain, M1_Atelier, M1_Exemple, M1_Qcm, M1_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M1 · 9:30

OBJECTIF — Annoncer le module : poser le vocabulaire commun des deux jours.

DIRE — « Premier module : on part de ce que vous connaissez, l’IA générative utilisée à la main, et on va jusqu’à l’automatisation intelligente. On se donne un vocabulaire commun, une définition du workflow IA, et surtout une méthode pour regarder votre travail et dire : ceci s’automatise, ceci reste humain. L’atelier 1 vous fera cartographier votre processus fil rouge. »

TRANSITION — « Un rappel rapide de ce que l’IA générative fait bien. »`,
  `⏱ 4 min · RAPPEL DES CAPACITÉS (cartes à retourner)

OBJECTIF — Réactiver les acquis et montrer chaque capacité sous l’angle « processus ».

DIRE — « Six verbes résument presque tout ce qu’on demande à l’IA générative : rédiger, résumer, classer, extraire, transformer, analyser. Vous les utilisez déjà en conversation. Retournons les cartes : voici chaque capacité branchée dans un processus. Remarquez le changement de formulation : on ne dit plus “je demande”, on dit “chaque”. Chaque email, chaque facture, chaque réunion. Le mot “chaque”, c’est le passage à l’automatisation. »

ANIMATION — Faire retourner une carte par un participant, puis → pour tout retourner. Demander : « Laquelle de ces six capacités vous sert le plus aujourd’hui ? »

TRANSITION — « Et maintenant, ce qu’elle fait mal. »`,
  `⏱ 5 min · QUIZ FLASH (5 questions)

OBJECTIF — Rappeler les limites qui conditionnent la conception d’un workflow : calcul, variabilité, connaissance, hallucination.

DIRE — « Cinq affirmations, vote à main levée, puis on clique. » Après chaque réponse, lire l’explication. Insister sur la question 1 : « Retenez la règle de conception : l’IA extrait, une règle calcule. » Sur la question 3 : « Elle ne connaît que ce qu’on lui donne : c’est pourquoi le module 3 sur les documents est central. »

ANIMATION — Compter les bonnes réponses du premier coup dans l’encart de droite.

TRANSITION — « Ces limites posées, regardons ce que change l’intégration dans un processus. »`,
  `⏱ 4 min · DU PONCTUEL AU PROCESSUS (2 clics)

OBJECTIF — Faire sentir le coût caché du copier-coller et la valeur de l’intégration.

DIRE — « À gauche, la réalité de beaucoup d’utilisateurs avancés : on ouvre l’email, on copie dans l’IA, on réécrit le même prompt, on relit, on recolle, on classe. Quarante fois par jour. » Clic. « À droite, la même IA, intégrée : l’email déclenche le flux, le prompt a été écrit une fois et testé, vous ne faites plus que valider. » Clic. « Les chiffres : quatre minutes par email deviennent une minute de validation. Et la qualité devient homogène, parce que le prompt ne dépend plus de votre humeur du jour. »

INSISTER — L’humain n’a pas disparu : il a changé de place, de l’exécution vers la décision.

TRANSITION — « On peut décrire ce glissement en quatre niveaux. »`,
  `⏱ 5 min · LES QUATRE NIVEAUX (3 clics)

OBJECTIF — Distinguer assistance, augmentation, automatisation et automatisation intelligente (objectif pédagogique explicite).

DIRE — « Niveau 1, l’assistance : vous faites, l’IA aide quand vous le demandez. » Clic. « Niveau 2, l’augmentation : l’IA propose un premier jet, vous décidez et vous finissez. » Clic. « Niveau 3, l’automatisation classique : des règles fixes s’exécutent seules ; pas besoin d’IA, si X alors Y. On en fait depuis vingt ans. » Clic. « Niveau 4, l’automatisation intelligente : des règles, plus une IA pour tout ce qui demande de comprendre du langage. C’est l’objet de la formation. Attention à la flèche du bas : plus on monte, moins l’humain intervient à chaque cas, mais plus la conception doit être rigoureuse. »

TRANSITION — « Vérifions que la distinction est claire. »`,
  `⏱ 5 min · EXERCICE GLISSER-DÉPOSER (1 clic = correction)

OBJECTIF — Appliquer la distinction des niveaux à des cas concrets.

DIRE — « Huit usages, quatre colonnes. Dites-moi où je les range. » Déplacer les cartes selon les propositions de la salle. Puis → pour la correction.

POINTS DE DÉBAT — Le 2 (CV) : intelligent parce que le flux tourne seul, mais la décision reste humaine. Le 8 (pièce jointe facture) : automatisation simple, pas besoin d’IA si la règle est fiable. Le 1 et le 5 : augmentation, l’humain finit. Le 3 et le 7 : assistance ponctuelle.

TRANSITION — « Formalisons maintenant ce qu’est un workflow IA. »`,
  `⏱ 4 min · DÉFINITION DU WORKFLOW IA (3 clics)

OBJECTIF — Donner une définition opérationnelle et l’illustrer.

DIRE — « Notre définition de travail : une suite d’étapes déclenchée par un événement, qui s’exécute sans intervention, avec au moins une étape où l’IA comprend ou produit du langage. Voici un exemple : un formulaire est envoyé, ses champs sont lus, l’IA résume et classe, une condition teste l’urgence, le bon service est notifié. » Clic. « L’IA n’est qu’une étape : une sur cinq. » Clic. « Il tourne sans vous, déclenché par un événement. » Clic. « Et il produit un résultat vérifiable. »

INSISTER — Les couleurs des nœuds sont les mêmes dans tout le support : bleu déclencheur, turquoise données, violet IA, jaune condition, vert action, rose validation humaine.

TRANSITION — « Comment repérer, dans votre travail, ce qui peut devenir un workflow ? »`,
  `⏱ 4 min · REPÉRER LES TÂCHES AUTOMATISABLES

OBJECTIF — Donner quatre critères concrets d’identification.

DIRE — « Quatre signaux, et une astuce : écoutez comment vous parlez de votre travail. “Je fais toujours la même chose” : répétitif. “Ça me prend des heures” : chronophage. “Je recopie d’un outil à l’autre” : faible valeur ajoutée. “Je lis pour savoir à qui l’envoyer” : il faut classer ou analyser du texte, c’est là que l’IA devient utile. Le meilleur candidat coche les quatre : le tri des demandes reçues sur une adresse générique en est l’exemple type. »

ANIMATION — Demander à deux participants quelle phrase ils prononcent le plus souvent au travail.

TRANSITION — « Et ce qu’il ne faut pas automatiser ? »`,
  `⏱ 4 min · CE QUI RESTE HUMAIN

OBJECTIF — Identifier les tâches qui doivent rester sous contrôle humain.

DIRE — « Cinq zones. Les décisions qui affectent une personne : le RGPD, article 22, donne le droit de ne pas faire l’objet d’une décision entièrement automatisée produisant des effets juridiques ou significatifs. Les relations sensibles. Ce qui engage l’entreprise : prix, contrat, réponse juridique. Les exceptions, que les règles n’ont pas prévues. Et le contrôle de la qualité lui-même. Retenez la règle pratique : si une erreur peut blesser, coûter cher ou engager, un humain valide avant l’action. »

TRANSITION — « Pour arbitrer entre les deux, un simulateur. »`,
  `⏱ 5 min · SIMULATEUR DE POTENTIEL

OBJECTIF — Évaluer le potentiel d’automatisation d’un processus avec une grille simple.

DIRE — « Six critères notés de 1 à 5. Commençons par les factures fournisseurs : fréquentes, nombreuses, règles stables, données numériques. Score élevé : on automatise avec contrôle. » Cliquer « Réclamations clients ». « Le besoin de jugement est à 5, la tolérance à l’erreur à 1 : le score tombe, on reste en augmentation, l’IA prépare et l’humain répond. » Puis « Comptes rendus ».

ANIMATION — Faire noter le processus d’un volontaire en direct, critère par critère, avec l’avis de la salle.

INSISTER — C’est une grille d’aide à la discussion, pas une vérité : le score sert à poser les bonnes questions.

TRANSITION — « Potentiel ne veut pas dire rentable. Calculons le gain. »`,
  `⏱ 4 min · CALCULATEUR DE GAIN

OBJECTIF — Chiffrer un gain réaliste, contrôle humain compris.

DIRE — « Quatre réglages. Exemple de départ : 400 cas par mois, 6 minutes chacun, 70 % automatisables, une minute de contrôle gardée. Résultat affiché à droite. » Monter le contrôle à 4 minutes : « Le gain fond. C’est l’erreur classique : on oublie le temps de vérification. » Baisser le volume à 40 : « Moins de 5 heures par mois : le temps de construction et de maintenance risque de ne jamais être amorti. »

INSISTER — Le calcul est un ordre de grandeur, à confronter au coût des outils et au temps de construction.

TRANSITION — « À vous : atelier 1. »`,
  `⏱ 30 min · ATELIER 1 · CARTOGRAPHIE (minuteur)

OBJECTIF — Cartographier un processus professionnel et repérer les étapes assistables ou automatisables.

CONSIGNE À DIRE — « Prenez votre processus fil rouge. Décrivez-le tel qu’il se passe vraiment. Entrée, étapes, décisions en losange, sortie. Puis étiquetez chaque étape : H pour humain, Auto pour une règle fixe, IA quand il faut comprendre du texte. Vingt minutes en individuel, dix minutes d’échange en binôme : le binôme vous challenge sur chaque H. »

ANIMATION — Montrer la page suivante (exemple) pendant les premières minutes. Passer dans les rangs : les erreurs fréquentes sont d’oublier les décisions et de décrire la procédure idéale au lieu de la réalité.

DÉBRIEF — Deux ou trois volontaires présentent leur carte en une minute.`,
  `⏱ 4 min · EXEMPLE : NOTES DE FRAIS (3 clics)

OBJECTIF — Montrer le livrable attendu de l’atelier 1.

DIRE — « Les notes de frais : entrée, une photo de ticket et un formulaire. Collecter, lire le ticket, vérifier la politique de dépenses, décider si c’est conforme. Oui : saisie en compta, puis remboursement et archivage. Non : le manager complète ou refuse. » Clic. « Auto : collecter, saisir, archiver, ce sont des règles. » Clic. « IA : lire un ticket photographié et juger la catégorie de dépense. » Clic. « Humain : l’exception. Le manager ne voit plus que les cas litigieux. »

TRANSITION — « Vérifions vos acquis avant la pause. »`,
  `⏱ 3 min · QCM 1

OBJECTIF — Vérifier la distinction des niveaux.

DIRE — Lire la question. Faire voter. Cliquer la réponse majoritaire, puis les autres pour les pièges.

INSISTER — Le piège fréquent est « augmentation » à cause de la relecture : la relecture ciblée ne concerne qu’une minorité de cas, le flux tourne seul pour les autres.

TRANSITION — « Synthèse du module. »`,
  `⏱ 2 min · SYNTHÈSE M1

OBJECTIF — Ancrer les cinq idées clés et faire le point sur le projet.

DIRE — « Cinq idées. L’IA comprend et produit du langage, elle ne calcule ni ne décide de façon fiable. Quatre niveaux d’automatisation. Un workflow est déclenché par un événement, l’IA n’y est qu’une étape. On automatise le répétitif et on garde l’humain sur ce qui engage. Et on chiffre le gain avant de construire. Côté projet : votre processus est cartographié et étiqueté. »

TRANSITION — « Pause de 15 minutes. Au retour : les prompts conçus pour tourner dans un workflow. »`,
];
// @@NOTES-END
