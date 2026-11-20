// ═══ Module 8 · Construire un workflow automatisé ═══════════════════════════

const M8_Section: Page = () => (
  <Section n={8} title="Construire un workflow automatisé" sub="Sources, déclencheurs, actions… et une étape IA au milieu." dur="1 h 20">
    <SecItem n={1}>Connexion aux sources : SharePoint, Excel, courriels, CRM…</SecItem>
    <SecItem n={2}>Déclencheurs et actions</SecItem>
    <SecItem n={3}>Intégrer une IA : résumé, extraction, analyse de texte</SecItem>
  </Section>
);
M8_Section.transition = BLOOM;

// ─── Sources ────────────────────────────────────────────────────────────────
const M8_SRC: { apps: AppId[]; t: string; trig: string; act: string; warn: string }[] = [
  { apps: ['sheets', 'excel'], t: 'Tableurs', trig: 'Nouvelle ligne, ligne modifiée', act: 'Ajouter, mettre à jour, chercher des lignes', warn: 'En-têtes stables, pas de cellules fusionnées' },
  { apps: ['gmail', 'outlook'], t: 'Courriels', trig: 'Nouveau courriel (dossier, expéditeur, objet)', act: 'Envoyer, créer un brouillon, déplacer', warn: 'Boîtes partagées : droits à vérifier' },
  { apps: ['sharepoint', 'drive'], t: 'Fichiers et documents', trig: 'Fichier ajouté dans un dossier', act: 'Copier, renommer, lire le contenu', warn: 'Chemins et noms de fichiers sans surprise' },
  { apps: ['crm'], t: 'CRM', trig: 'Nouveau contact, affaire qui change d’étape', act: 'Créer, mettre à jour une fiche, ajouter une note', warn: 'Données clients : renseignements personnels' },
  { apps: ['forms'], t: 'Formulaires', trig: 'Nouvelle réponse', act: '(rarement une action)', warn: 'La meilleure source : des données déjà structurées' },
  { apps: ['make'], t: 'Webhook et API', trig: 'Un autre logiciel appelle une adresse', act: 'Appeler l’API d’un logiciel (module HTTP)', warn: 'Demande un peu de technique : à faire accompagner' },
];

const M8_Sources: Page = () => (
  <Frame mod={8}>
    <Title>Se connecter aux sources de données</Title>
    <Lede>Pour chaque source : ce qui peut déclencher, ce qu’on peut faire, et le point d’attention.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      {M8_SRC.map((s, i) => (
        <div key={s.t} className={A.in} style={{ height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(80 + i * 80) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {s.apps.map((a) => (
              <AppTile key={a} id={a} size={48} />
            ))}
            <span style={{ marginLeft: 6, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{s.t}</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 21, lineHeight: 1.35 }}>
            <div>
              <NodeChip kind="trigger" size={16} /> <span style={{ color: C.soft }}>{s.trig}</span>
            </div>
            <div>
              <NodeChip kind="action" size={16} /> <span style={{ color: C.soft }}>{s.act}</span>
            </div>
            <div style={{ color: T.coral.fg, fontWeight: 600 }}>⚠ {s.warn}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Triggers ───────────────────────────────────────────────────────────────
const M8_Declencheurs: Page = () => (
  <Frame mod={8}>
    <Title>Trois façons de démarrer un workflow</Title>
    <Tabs initial="evt" cls={A.in} style={{ position: 'absolute', left: 120, top: 196, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <TabBtn id="evt" icon="bolt" tone="blue">
          Un événement
        </TabBtn>
        <TabBtn id="time" icon="clock" tone="teal">
          Un horaire
        </TabBtn>
        <TabBtn id="cond" icon="filter" tone="yellow">
          Une condition
        </TabBtn>
      </div>
      <TabPane id="evt">
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Card tone="blue" icon="bolt" title="Quand quelque chose arrive" size={25} style={{ height: 520 }}>
            Un courriel, une ligne, un fichier, une réponse de formulaire.
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Bullet>
                <b>Par vérification</b> : la plateforme regarde toutes les X minutes (Watch New Rows, Watch Emails).
              </Bullet>
              <Bullet>
                <b>Instantané</b> : l’application prévient la plateforme (webhook), sans délai.
              </Bullet>
            </div>
          </Card>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Chain x={40} y={0} size={110} gap={200} items={[{ app: 'forms', label: 'Nouvelle réponse' }, { app: 'sheets', label: 'Ligne ajoutée' }]} />
            <Callout title="Le cas le plus courant" tone="blue" icon="bulb" size={24} style={{ marginTop: 230 }}>
              C’est le déclencheur de vos ateliers : <b>une nouvelle ligne</b> dans le classeur.
            </Callout>
          </div>
        </div>
      </TabPane>
      <TabPane id="time">
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Card tone="teal" icon="clock" title="À heure fixe" size={25} style={{ height: 520 }}>
            Chaque lundi à 7 h, chaque jour à 17 h, le premier du mois.
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Bullet tone="teal">Rapports hebdomadaires, relances, sauvegardes, rapprochements.</Bullet>
              <Bullet tone="teal">
                Dans Make : le module de départ peut être <b>n’importe quelle action</b> (chercher des lignes), planifiée.
              </Bullet>
            </div>
          </Card>
          <Callout title="Scénario B du module 9" tone="teal" icon="chart" size={24}>
            Le rapport hebdomadaire : un horaire, une recherche, un résumé IA, un courriel.
          </Callout>
        </div>
      </TabPane>
      <TabPane id="cond">
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Card tone="yellow" icon="filter" title="Seulement si…" size={25} style={{ height: 520 }}>
            Un déclencheur large, puis un <b>filtre</b> juste après : « seulement si l’objet contient “commande” », « seulement si le montant dépasse 500 $ ».
          </Card>
          <Callout title="Économisez vos crédits" tone="yellow" icon="money" size={24}>
            Filtrez le plus tôt possible : ce qui est filtré ne passe pas dans les modules suivants, donc ne les consomme pas.
          </Callout>
        </div>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Actions ────────────────────────────────────────────────────────────────
const M8_Actions: Page = () => (
  <Frame mod={8}>
    <Title>Quatre familles d’actions</Title>
    <Lede>Tous les modules d’action entrent dans une de ces quatre familles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
      {(
        [
          ['plus', 'green', 'Créer', ['Ajouter une ligne', 'Créer un fichier, un brouillon', 'Créer une fiche CRM']],
          ['loop', 'blue', 'Mettre à jour', ['Modifier une ligne', 'Déplacer, renommer un fichier', 'Changer le statut d’une affaire']],
          ['scan', 'teal', 'Extraire', ['Chercher des lignes', 'Lire le contenu d’un fichier', 'Extraire des champs avec l’IA']],
          ['split', 'yellow', 'Décider', ['Filtre : continuer ou non', 'Routeur : choisir un chemin', 'Classification IA + seuil']],
        ] as [IconName, Tone, string, string[]][]
      ).map(([ic, tone, t, items], i) => (
        <div key={t} className={A.in} style={{ height: 540, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '30px 28px', ...dl(100 + i * 120) }}>
          <IconTile name={ic} tone={tone} size={76} solid />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>{t}</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((x) => (
              <Bullet key={x} tone={tone} size={24}>
                {x}
              </Bullet>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Mapping ────────────────────────────────────────────────────────────────
const M8Kv = ({ k: key, v, tone }: { k: string; v: string; tone: Tone }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 14px', borderRadius: 10, background: T[tone].bg, fontSize: 21 }}>
    <b style={{ color: T[tone].fg }}>{key}</b>
    <span style={{ color: C.ink, textAlign: 'right' }}>{v}</span>
  </div>
);
const M8Field = ({ label, children, beat }: { label: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span style={{ width: 170, fontSize: 21, color: C.muted, textAlign: 'right' }}>{label}</span>
    <span style={{ flex: 1, minHeight: 50, boxSizing: 'border-box', padding: '8px 12px', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 2px ${C.rule}`, display: 'flex', alignItems: 'center', gap: 8, fontSize: 21 }}>{children}</span>
  </div>
);

const M8_Mapping: Page = () => (
  <Frame mod={8} beats={4}>
    <Title>Le mapping : brancher les données d’un module à l’autre</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 210, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '18px 20px' }}>
        <Eyebrow c={T.green.fg} size={20}>
          Sortie du module 1 · Sheets
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <M8Kv tone="green" k="Row number" v="7" />
          <M8Kv tone="green" k="Nom" v="Sophie Lavoie" />
          <M8Kv tone="green" k="Message" v="Mon colis n’est jamais arrivé…" />
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '18px 20px' }}>
        <Eyebrow c={T.violet.fg} size={20}>
          Sortie du module 3 · Parse JSON
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <M8Kv tone="violet" k="categorie" v="livraison" />
          <M8Kv tone="violet" k="priorite" v="haute" />
          <M8Kv tone="violet" k="resume" v="Colis jamais livré, cliente inquiète" />
        </div>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 760, top: 210, width: 1040, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(150) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <AppTile id="sheets" size={40} />
        <span style={{ fontSize: 24, fontWeight: 700 }}>Module 4 · Google Sheets › Update a Row</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M8Field beat={1} label="Row number">
          <Pill tone="green">1. Row number</Pill>
        </M8Field>
        <M8Field beat={2} label="Catégorie">
          <Pill tone="violet">3. categorie</Pill>
        </M8Field>
        <M8Field beat={2} label="Priorité">
          <Pill tone="violet">3. priorite</Pill>
        </M8Field>
        <M8Field beat={3} label="Résumé">
          <Pill tone="violet">3. resume</Pill> <span style={{ color: C.muted }}>(</span>
          <span style={{ color: C.muted }}>par</span> <Pill tone="green">1. Nom</Pill>
          <span style={{ color: C.muted }}>)</span>
        </M8Field>
      </div>
      <Callout cls={b.on(4)} title="Les fonctions" tone="blue" icon="code" size={21} style={{ marginTop: 22 }}>
        On peut transformer une valeur au passage : <code>formatDate(now; "YYYY-MM-DD")</code>, <code>upper()</code>, <code>ifempty(…; "inconnu")</code>.
      </Callout>
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 860 }}>Le numéro dans la pastille dit de quel module vient la valeur.</Hint>
  </Frame>
);

// ─── The AI step ────────────────────────────────────────────────────────────
const M8_IA: Page = () => (
  <Frame mod={8} beats={3}>
    <Title>Intégrer une IA : le module Gemini dans Make</Title>
    <Chain
      x={120}
      y={200}
      size={100}
      gap={110}
      items={[
        { app: 'sheets', label: 'Demande' },
        { app: 'gemini', label: 'Gemini', sub: 'Generate a response' },
        { icon: 'code', tone: 'teal', label: 'JSON', sub: 'Parse JSON' },
      ]}
    />
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 440, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(
        [
          ['doc', 'green', 'Résumé automatique', 'Un compte rendu, un fil de courriels → 3 lignes'],
          ['scan', 'teal', 'Extraction d’informations', 'Un courriel, une facture → des champs'],
          ['smile', 'violet', 'Analyse de texte', 'Catégorie, ton, urgence, langue'],
        ] as [IconName, Tone, string, string][]
      ).map(([ic, tone, t, s]) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
          <IconTile name={ic} tone={tone} size={52} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{t}</div>
            <div style={{ fontSize: 21, color: C.soft }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 960, top: 200, width: 840, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <AppTile id="gemini" size={40} />
        <span style={{ fontSize: 24, fontWeight: 700 }}>Google Gemini AI › Generate a response</span>
      </div>
      <div className={b.on(1)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M8Field beat={1} label="Connection">
          Ma clé AI Studio <Tag tone="green" size={16}>gratuite</Tag>
        </M8Field>
        <M8Field beat={1} label="Model">
          le modèle « Flash » proposé
        </M8Field>
      </div>
      <div className={b.on(2)} style={{ marginTop: 14 }}>
        <div style={{ fontSize: 21, color: C.muted, marginBottom: 6 }}>Message (prompt)</div>
        <div style={{ boxSizing: 'border-box', padding: '12px 14px', borderRadius: 8, boxShadow: `inset 0 0 0 2px ${C.rule}`, fontSize: 20, lineHeight: 1.5, color: C.ink }}>
          Analyse la demande ci-dessous. Réponds uniquement avec un objet JSON, sans balises de code : {'{'}"categorie", "priorite", "resume", "confiance"{'}'}… Demande : <Pill tone="green">1. Message</Pill>
        </div>
      </div>
      <Callout cls={b.on(3)} title="Puis Parse JSON" tone="teal" icon="code" size={21} style={{ marginTop: 16 }}>
        La réponse est un texte. <b>Parse JSON</b> le découpe en champs utilisables : <Pill tone="violet">categorie</Pill> <Pill tone="violet">priorite</Pill>…
      </Callout>
    </div>
    <Verified style={{ position: 'absolute', left: 960, top: 905 }}>Noms des modules Make vérifiés en novembre 2026 ; l’interface évolue souvent.</Verified>
  </Frame>
);

// ─── Router ─────────────────────────────────────────────────────────────────
const M8B = ({ cx: x, cy: y, size = 96, cls, ...it }: BubbleItem & { cx: number; cy: number; size?: number; cls?: string }) => (
  <div style={{ position: 'absolute', left: x - (size + 90) / 2, top: y - size / 2 }}>
    <Bubble2 {...it} size={size} cls={cls} />
  </div>
);
const M8Filter = ({ x, y, children, beat }: { x: number; y: number; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: T.yellow.bg, boxShadow: `inset 0 0 0 1.5px ${T.yellow.bd}`, fontSize: 19, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>
    <Icon name="filter" size={20} color={T.yellow.fg} /> {children}
  </div>
);

const M8_Router: Page = () => (
  <Frame mod={8} beats={3}>
    <Title>Décider : le routeur et ses filtres</Title>
    <Lede>Un routeur ouvre plusieurs chemins. Un filtre sur chaque chemin dit quelles demandes le prennent.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M 300 560 H 980" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" />
      <path d="M 980 560 C 1100 560, 1100 360, 1320 360" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" fill="none" className={b.fade(1)} />
      <path d="M 980 560 H 1320" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" className={b.fade(2)} />
      <path d="M 980 560 C 1100 560, 1100 760, 1320 760" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" fill="none" className={b.fade(3)} />
    </svg>
    <M8B cx={300} cy={560} app="sheets" label="Demande" />
    <M8B cx={520} cy={560} app="gemini" label="Classer" />
    <M8B cx={740} cy={560} icon="code" tone="teal" label="Parse JSON" />
    <M8B cx={980} cy={560} icon="split" tone="yellow" label="Routeur" />
    <M8B cx={1420} cy={360} app="gmail" label="Alerte au responsable" cls={b.pop(1)} />
    <M8B cx={1420} cy={560} app="sheets" label="Registre mis à jour" cls={b.pop(2)} />
    <M8B cx={1420} cy={760} icon="humanCheck" tone="coral" label="File « à vérifier »" cls={b.pop(3)} />
    <M8Filter beat={1} x={1080} y={300}>
      priorite = haute ET confiance ≥ 0,75
    </M8Filter>
    <M8Filter beat={2} x={1100} y={500}>
      confiance ≥ 0,75
    </M8Filter>
    <M8Filter beat={3} x={1080} y={800}>
      confiance &lt; 0,75
    </M8Filter>
    <Hint cls={b.fade(3)} style={{ position: 'absolute', left: 1560, top: 900 }}>
      Aucune demande ne se perd.
    </Hint>
  </Frame>
);

// ─── Target of the guided build ─────────────────────────────────────────────
const M8_Cible: Page = () => (
  <Frame mod={8} beats={1}>
    <Title>L’atelier guidé : ajouter l’IA à votre premier scénario</Title>
    <Lede>On repart du scénario de l’atelier 1. Trois modules s’ajoutent au milieu, l’alerte devient conditionnelle.</Lede>
    <Chain
      x={150}
      y={330}
      size={120}
      gap={150}
      items={[
        { app: 'sheets', label: '1 · Watch New Rows', sub: 'déjà fait' },
        { app: 'gemini', label: '2 · Generate a response', sub: 'nouveau' },
        { icon: 'code', tone: 'teal', label: '3 · Parse JSON', sub: 'nouveau' },
        { app: 'sheets', label: '4 · Update a Row', sub: 'nouveau' },
        { app: 'gmail', label: '5 · Send an email', sub: 'avec un filtre' },
      ]}
    />
    <Callout cls={b.on(1)} title="Le résultat attendu" tone="green" icon="check" style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      Vous ajoutez une demande fictive dans le classeur : les colonnes <b>Catégorie, Priorité, Résumé</b> se remplissent seules, et seule une demande urgente vous envoie un courriel.
    </Callout>
  </Frame>
);

// ─── Guided steps ───────────────────────────────────────────────────────────
const M8_Guide: Page = () => (
  <Frame mod={8} kind="atelier">
    <Title>Pas à pas · l’étape IA et la mise à jour</Title>
    <div style={{ position: 'absolute', left: 120, top: 196, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow cls={A.in} c={T.violet.fg}>
        L’étape IA
      </Eyebrow>
      <Do n={1} tone="violet">
        Clic droit sur le lien entre Sheets et Gmail › <Kbd>Add a module</Kbd> › <b>Google Gemini AI</b> › <Kbd>Generate a response</Kbd>.
      </Do>
      <Do n={2} tone="violet">
        <Kbd>Create a connection</Kbd> : collez votre clé d’API (dans Make, jamais dans le Chat).
      </Do>
      <Do n={3} tone="violet">Collez le prompt fourni dans le Chat ; remplacez la fin par la pastille Message du module 1.</Do>
      <Do n={4} tone="violet">
        <Kbd>Run once</Kbd> + une ligne de test : la bulle du module montre le JSON reçu.
      </Do>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 196, width: 800, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow cls={A.in} c={T.teal.fg} style={dl(200)}>
        Découper, écrire, alerter
      </Eyebrow>
      <Do n={5} tone="teal">
        Ajoutez <b>JSON</b> › <Kbd>Parse JSON</Kbd>. Structure : <Kbd>Add</Kbd> › <Kbd>Generate</Kbd>, collez un exemple de JSON.
      </Do>
      <Do n={6} tone="teal">
        Ajoutez <b>Google Sheets</b> › <Kbd>Update a Row</Kbd> : Row number = pastille <Pill tone="green">1. Row number</Pill>.
      </Do>
      <Do n={7} tone="teal">Mappez Catégorie, Priorité, Résumé avec les pastilles du module 3.</Do>
      <Do n={8} tone="teal">
        Clic sur le lien avant Gmail › <Kbd>Set up a filter</Kbd> : <i>priorite</i> égal à <b>haute</b>.
      </Do>
    </div>
    <Callout cls={A.in} title="Parse JSON échoue ?" tone="yellow" icon="alert" size={22} style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(500) }}>
      L’IA a sans doute entouré sa réponse de balises <code>```json</code>. Renforcez le prompt (« sans balises de code »), ou retirez-les avec la fonction <code>replace()</code>.
    </Callout>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M8_Atelier: Page = () => (
  <AtelierPage
    mod={8}
    n="Atelier 2"
    title="Ajouter l’IA à votre flux"
    timerId="m8-atelier"
    minutes={30}
    tools="Make · Google Gemini AI (votre clé AI Studio) · JSON · Google Sheets · Gmail"
    objective="Faire classer et résumer chaque nouvelle demande par l’IA, écrire le résultat dans le classeur et n’alerter que pour les demandes urgentes."
    deliver={
      <>
        Le scénario <b>« IA135 · Atelier 2 »</b> (5 modules) testé sur 3 demandes fictives : une urgente, une normale, une ambiguë.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Gemini renvoie un JSON valide</CheckItem>
        <CheckItem id="b" size={22}>Les 3 colonnes se remplissent seules</CheckItem>
        <CheckItem id="c" size={22}>Seule la demande urgente déclenche le courriel</CheckItem>
        <CheckItem id="d" size={22}>La demande ambiguë est repérée (confiance basse)</CheckItem>
      </>
    }
  >
    <Do n={1}>Dupliquez votre scénario de l’atelier 1 (… › Clone) et renommez-le.</Do>
    <Do n={2}>Suivez les 8 étapes de la page précédente.</Do>
    <Do n={3}>Testez les 3 demandes fictives collées dans le Chat, une par une, avec Run once.</Do>
    <Do n={4}>Ouvrez chaque bulle : la catégorie et la confiance sont-elles justes ? Notez-le dans votre carnet.</Do>
    <Bonus>Remplacez le filtre par un routeur à trois chemins, comme sur la page « Décider ».</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M8_Qcm: Page = () => (
  <QcmPage
    mod={8}
    n={7}
    title="Le bon module au bon endroit"
    q="Gemini renvoie le texte {&quot;categorie&quot;: &quot;livraison&quot;, &quot;priorite&quot;: &quot;haute&quot;}. Pour écrire la catégorie dans le classeur, que faut-il ajouter avant Update a Row ?"
    explain="La réponse d’une IA est un texte. Parse JSON le transforme en champs séparés que l’on peut mapper un à un. Sans lui, on écrirait tout le texte dans une seule cellule."
  >
    <Opt ok why="Exact : Parse JSON découpe le texte en champs ; on mappe ensuite categorie dans la colonne Catégorie.">
      Un module Parse JSON
    </Opt>
    <Opt why="Piège ! Un routeur choisit un chemin ; il ne découpe pas le texte en champs.">
      Un routeur
    </Opt>
    <Opt why="Piège ! Une seconde étape IA coûterait du temps et des crédits, sans garantir un meilleur découpage.">
      Une seconde étape Gemini qui extrait la catégorie
    </Opt>
    <Opt why="Piège ! Un filtre laisse passer ou arrête ; il ne transforme pas les données.">
      Un filtre sur le lien
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M8_Synthese: Page = () => (
  <SynthPage
    mod={8}
    title="Module 8 · Ce qu’il faut retenir"
    poste={
      <>
        Reprenez votre fiche de conception : écrivez à côté de chaque étape <b>le module Make</b> qui la réalisera.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Déclencheur : un <b>événement</b>, un <b>horaire</b> ou une <b>condition</b>.
    </SynthRow>
    <SynthRow n={2} tone="green" d={220}>
      Actions : <b>créer, mettre à jour, extraire, décider</b>.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      Étape IA → <b>Parse JSON</b> → mapping des champs.
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={460}>
      Routeur + filtres : <b>aucune demande ne se perd</b>, le doute va à un humain.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M8_Section, M8_Sources, M8_Declencheurs, M8_Actions, M8_Mapping, M8_IA, M8_Router, M8_Cible, M8_Guide, M8_Atelier, M8_Qcm, M8_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 8 (50 min avant le dîner + 30 min d'atelier guidé après)

DIRE — « Le module central du jour 2 : on construit un vrai workflow avec une étape IA. Avant le dîner, les briques ; après le dîner, vous les assemblez. »

TRANSITION — « D'abord, les sources. »`,
  `⏱ 5 min

OBJECTIF — Connaître les sources du programme : SharePoint, Excel, courriels, CRM…

DIRE — Parcourez les six cartes : déclencheur typique, action typique, point d'attention.

INSISTER —
• Formulaires : « La meilleure source : les données arrivent déjà rangées. Souvent, la vraie amélioration, c'est de remplacer un courriel libre par un formulaire. »
• CRM et boîtes partagées : droits et renseignements personnels.
• Webhook et HTTP : « Pour un logiciel sans module tout prêt mais avec une API. À faire accompagner par l'informatique. »

TRANSITION — « Comment démarrer un workflow ? »`,
  `⏱ 5 min

OBJECTIF — Distinguer événements, horaires et conditions (programme).

ANIMATION — Cliquez les trois onglets.
• Événement : vérification périodique ou instantané (webhook).
• Horaire : rapports, relances.
• Condition : un filtre juste après le déclencheur.

INSISTER — « Filtrer tôt économise des crédits : ce qui est arrêté ne passe pas dans les modules suivants. »

INTERACTION — « Quel est le déclencheur de votre tâche ? » Deux réponses, par prénom, à partir de la fiche de conception.

TRANSITION — « Et une fois démarré, que fait-il ? »`,
  `⏱ 3 min

OBJECTIF — Classer les actions (programme : création, mise à jour, extraction, décision).

DIRE — Parcourez les quatre familles. « Regardez votre fiche : chaque étape entre dans une de ces familles. Si ce n'est pas le cas, elle est sans doute trop vague. »

TRANSITION — « Le geste qu'on fait le plus : le mapping. »`,
  `⏱ 5 min

OBJECTIF — Comprendre le mapping entre modules.

DIRE — « À gauche, ce qui sort des modules précédents. À droite, le module qui met à jour la ligne. »
→ beat 1 — Row number vient du module 1 : « C'est ce qui permet d'écrire sur la bonne ligne. »
→ beat 2 — Catégorie et priorité viennent du module 3, l'IA découpée.
→ beat 3 — On peut combiner plusieurs pastilles et du texte.
→ beat 4 — Les fonctions : formatDate, upper, ifempty.

TRANSITION — « L'étape IA elle-même. »`,
  `⏱ 6 min · PAGE PÉRISSABLE

OBJECTIF — Montrer comment l'IA s'intègre (programme : résumé automatique, extraction d'informations, analyse de texte).

DIRE — Les trois usages à gauche. Puis la configuration du module (→ beats) :
→ beat 1 — La connexion avec votre clé AI Studio, et le modèle « Flash » proposé (rapide, inclus dans l'offre gratuite).
→ beat 2 — Le prompt, avec la pastille Message à la fin.
→ beat 3 — Parse JSON : « L'IA renvoie du texte ; Parse JSON le découpe en champs. »

AVANT CHAQUE SESSION — Vérifiez dans Make le nom exact du module Gemini et des champs (l'interface évolue).

DONNÉES — Offre gratuite de Gemini : les requêtes peuvent servir à améliorer les produits de Google. Données fictives uniquement.

TRANSITION — « Et pour décider où va chaque demande ? »`,
  `⏱ 5 min

OBJECTIF — Expliquer routeur et filtres (programme : décision).

DIRE — « Après la classification, un routeur ouvre trois chemins. » Révélez (→ beats 1 à 3) :
1. Urgent et sûr → alerte au responsable.
2. Sûr → registre mis à jour.
3. Pas sûr → file « à vérifier ».

INSISTER — « Les filtres doivent couvrir tous les cas. Sinon, une demande peut passer entre les mailles sans que personne ne le sache. Dans Make, on peut aussi marquer une route comme route par défaut (fallback). »

TRANSITION — « Avant le dîner, je vous montre ce qu'on va construire. »`,
  `⏱ 3 min

OBJECTIF — Présenter la cible de l'atelier guidé.

DIRE — « On repart du scénario de ce matin. Entre Sheets et Gmail, on insère trois modules : Gemini, Parse JSON, Update a Row. Et on met un filtre devant Gmail. »
→ beat 1 — Le résultat attendu.

LOGISTIQUE — Dîner 12 h – 13 h. Avant de partir, collez dans le Chat : le prompt de l'atelier, un exemple de JSON pour Parse JSON, et les 3 demandes de test.

PROMPT (à coller) —
Tu es l'assistant du service client. Analyse la demande ci-dessous. Réponds uniquement avec un objet JSON, sans balises de code ni texte autour : {"categorie": "livraison | produit endommagé | question produit | facturation | autre", "priorite": "haute | normale", "resume": "une phrase de 15 mots maximum", "confiance": nombre entre 0 et 1}. Si tu hésites, categorie = "autre" et confiance inférieure à 0.5. Demande : [pastille Message]

EXEMPLE JSON — {"categorie": "livraison", "priorite": "haute", "resume": "Colis non livré", "confiance": 0.9}

DEMANDES DE TEST — 1. « Mon colis devait arriver mardi, toujours rien, c'est urgent pour un anniversaire samedi. » 2. « Faites-vous la livraison à Rimouski ? » 3. « J'ai une idée pour améliorer votre site, on peut en parler ? »`,
  `⏱ 5 min · DÉMONSTRATION GUIDÉE (au retour du dîner, 13 h)

OBJECTIF — Montrer les 8 étapes avant l'atelier.

DÉROULÉ — En partage d'écran, faites les étapes 1 à 8 sur votre propre scénario, rapidement. Montrez la bulle de Gemini (le JSON en texte), puis celle de Parse JSON (les champs séparés).

PIÈGE FRÉQUENT — Les balises \`\`\`json autour de la réponse : montrez le symptôme (erreur de Parse JSON) et le remède.

TRANSITION — « À vous. »`,
  `⏱ 30 min · ATELIER 2 INDIVIDUEL

OBJECTIF — Chacun a un workflow avec une étape IA qui fonctionne.

ANIMATION — Lancez le minuteur.

POINTS D'ÉTAPE —
• à 10 min : « Votre module Gemini renvoie-t-il un JSON ? » Réponses au micro.
• à 20 min : « Les colonnes se remplissent ? » Quelqu'un bloque : partage d'écran 2 minutes.

CORRIGÉ — Le blueprint du scénario corrigé peut être partagé (… › Export Blueprint) pour ceux qui sont très en retard.

FIN — Deux volontaires montrent la demande ambiguë : quelle confiance l'IA a-t-elle donnée ? Comparez : les résultats diffèrent d'une exécution à l'autre, c'est normal, d'où les tests du module 10.

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 7

RÉPONSE — A. Parse JSON.
• B ✗ — Le routeur choisit un chemin.
• C ✗ — Une seconde IA : coût et incertitude.
• D ✗ — Un filtre ne transforme rien.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Vous avez construit le cœur d'un workflow avec IA. Le module 9 : un scénario complet, au choix. »

TRANSITION — « Module 9. »`,
];
// @@NOTES-END
