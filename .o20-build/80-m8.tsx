// ─── Module 8 · Automatisation et bonnes pratiques ──────────────────────────

const M8_Section: Page = () => (
  <Section
    n={8}
    title="Automatisation et bonnes pratiques"
    sub="Comprendre ce qu’on peut faire tourner tout seul, utiliser l’IA de façon responsable, et repartir avec votre plan d’action."
    dur="40 min"
    labs={<DefiBadge defi="plan" />}
  >
    <SecItem n={1}>Qu’est-ce qu’un workflow, que peut-on automatiser ?</SecItem>
    <SecItem n={2}>Zapier · Make · Microsoft Power Automate</SecItem>
    <SecItem n={3}>Utiliser l’IA de manière responsable</SecItem>
    <SecItem n={4}>Atelier final : votre mini-plan IA</SecItem>
  </Section>
);
M8_Section.transition = BLOOM;

// ─── Qu’est-ce qu’un workflow ? ─────────────────────────────────────────────
const M8_Workflow: Page = () => (
  <Frame mod={8} beats={4}>
    <Title>Qu’est-ce qu’un workflow ?</Title>
    <Lede>Une recette que l’ordinateur suit tout seul : « quand ceci arrive, fais cela, puis cela ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <FlowNode kind="trigger" label="Quand un email arrive" sub="dans la boîte « contact »" w={360} cls={b.pop(1)} />
      <FlowArrow w={70} cls={b.fade(2)} />
      <FlowNode kind="ai" label="L’IA le résume et le classe" sub="demande, réclamation, devis…" w={360} cls={b.pop(2)} />
      <FlowArrow w={70} cls={b.fade(3)} />
      <FlowNode kind="action" label="Une ligne s’ajoute au tableau" sub="et l’équipe est prévenue" w={360} cls={b.pop(3)} />
      <FlowArrow w={70} cls={b.fade(4)} dashed />
      <FlowNode kind="human" label="Un humain répond" sub="avec le brouillon préparé" w={300} cls={b.pop(4)} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 620, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, ...dl(400) }}>
      <Card tone="blue" icon="bolt" title="Un déclencheur" size={22}>
        L’événement qui lance tout : un email, un formulaire, une date, un fichier déposé.
      </Card>
      <Card tone="violet" icon="sparkles" title="Des étapes" size={22}>
        Ce que le workflow fait : transformer, résumer, classer — l’IA est une étape parmi d’autres.
      </Card>
      <Card tone="green" icon="send" title="Une action" size={22}>
        Le résultat : un tableau mis à jour, un message envoyé, une tâche créée.
      </Card>
    </div>
  </Frame>
);

// ─── Ma tâche est-elle automatisable ? ──────────────────────────────────────
const M8_Fit: Page = () => (
  <Frame mod={8} kind="exercice">
    <Title>Quelles tâches peut-on automatiser ?</Title>
    <Lede>Prenez une tâche de votre liste de l’atelier 1. Cochez les critères qu’elle remplit.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1130, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="f1">Elle revient souvent (au moins chaque semaine)</CheckItem>
        <CheckItem id="f2">Elle suit toujours les mêmes étapes</CheckItem>
        <CheckItem id="f3">Elle part d’un élément numérique : email, formulaire, fichier</CheckItem>
        <CheckItem id="f4">Les règles s’expliquent en quelques phrases</CheckItem>
        <CheckItem id="f5">Une erreur serait gênante, mais pas grave</CheckItem>
        <CheckItem id="f6">Elle passe d’un outil à l’autre (copier-coller)</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1310, top: 270, width: 490, display: 'flex', flexDirection: 'column', gap: 20, ...dl(300) }}>
        <CheckScore
          max={6}
          label="Potentiel d’automatisation"
          levels={[
            { min: 0, text: 'Faible : gardez l’IA en assistant, à la demande.', tone: 'grey' },
            { min: 3, text: 'Moyen : automatisez une partie, gardez la main.', tone: 'yellow' },
            { min: 5, text: 'Fort : un bon candidat pour un workflow !', tone: 'green' },
          ]}
        />
        <Callout title="À ne pas automatiser" tone="coral" icon="hand" size={21}>
          Décisions sur des personnes, engagements juridiques ou financiers, situations émotionnelles.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ─── Trois exemples (onglets) ───────────────────────────────────────────────
const M8Chain = ({ nodes, ids }: { nodes: [NodeKind, string, string][]; ids: ToolId[] }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {nodes.map(([kind, label, sub], i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <FlowNode kind={kind} label={label} sub={sub} w={280} cls={A.pop} style={dl(i * 120)} />
          {i < nodes.length - 1 ? <FlowArrow w={46} /> : null}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 18, fontSize: 21, color: C.muted }}>
      Réalisable avec :
      {ids.map((id) => (
        <ToolChip key={id} id={id} size={22} />
      ))}
    </div>
  </div>
);

const M8_Examples: Page = () => (
  <Frame mod={8} kind="demo">
    <Title>Trois workflows typiques</Title>
    <Lede>Cliquez sur chaque onglet. Remarquez où se place, à chaque fois, le contrôle humain.</Lede>
    <Tabs initial="mail">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, display: 'flex', gap: 12 }}>
        <TabBtn id="mail" tone="blue" icon="mail">
          Email → résumé → réponse
        </TabBtn>
        <TabBtn id="form" tone="teal" icon="form">
          Formulaire → analyse → rapport
        </TabBtn>
        <TabBtn id="meet" tone="yellow" icon="mic">
          Réunion → compte rendu → tâches
        </TabBtn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 350, width: 1680, height: 480, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '40px 40px', ...dl(150) }}>
        <TabPane id="mail">
          <M8Chain
            ids={['zapier', 'make', 'powerautomate']}
            nodes={[
              ['trigger', 'Email reçu', 'boîte support@'],
              ['ai', 'Résumé et catégorie', 'assistant IA'],
              ['ai', 'Brouillon de réponse', 'selon la catégorie'],
              ['human', 'Relu et envoyé', 'par un conseiller'],
            ]}
          />
        </TabPane>
        <TabPane id="form">
          <M8Chain
            ids={['make', 'zapier', 'powerautomate']}
            nodes={[
              ['trigger', 'Formulaire rempli', 'enquête de satisfaction'],
              ['data', 'Réponses stockées', 'tableur'],
              ['ai', 'Analyse hebdomadaire', 'tendances, irritants'],
              ['out', 'Rapport envoyé', 'au manager, chaque lundi'],
            ]}
          />
        </TabPane>
        <TabPane id="meet">
          <M8Chain
            ids={['fireflies', 'zapier', 'notion']}
            nodes={[
              ['trigger', 'Réunion terminée', 'transcription prête'],
              ['ai', 'Compte rendu', 'synthèse, décisions'],
              ['human', 'Validé par l’animateur', 'en 2 minutes'],
              ['action', 'Tâches créées', 'dans l’outil projet'],
            ]}
          />
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Zapier · Make · Power Automate ─────────────────────────────────────────
const M8Tool = ({ id, tone, pitch, who, pros, ai, d }: { id: ToolId; tone: Tone; pitch: string; who: string; pros: string[]; ai: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `8px solid ${tool(id).c}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ToolTile id={id} size={64} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{tool(id).name}</div>
        <div style={{ fontSize: 20, color: STRONG[tone], fontWeight: 600 }}>{pitch}</div>
      </div>
    </div>
    <div style={{ fontSize: 20, color: C.muted }}>
      <strong style={{ color: C.ink }}>Pour qui : </strong>
      {who}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {pros.map((p) => (
        <Bullet key={p} size={21} tone={tone}>
          {p}
        </Bullet>
      ))}
    </div>
    <div style={{ marginTop: 'auto', background: T.violet.bg, borderRadius: 12, padding: '12px 16px', fontSize: 19, lineHeight: 1.4, color: C.ink }}>
      <Icon name="sparkles" size={20} color={C.violet} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
      {ai}
    </div>
  </div>
);

const M8_Tools: Page = () => (
  <Frame mod={8}>
    <Title>Trois outils pour automatiser sans coder</Title>
    <Lede>Le but n’est pas de devenir expert : c’est de savoir ce qui est possible, et à qui en parler.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 600, display: 'flex', gap: 24 }}>
      <M8Tool
        id="zapier"
        tone="coral"
        pitch="le plus simple pour débuter"
        who="tout le monde, en quelques clics"
        pros={['Des milliers d’applications connectées', 'Logique « quand… alors… » très lisible', 'Modèles prêts à l’emploi']}
        ai="Étapes IA intégrées, et création d’un workflow à partir d’une simple description."
        d={100}
      />
      <M8Tool
        id="make"
        tone="violet"
        pitch="le plus visuel et flexible"
        who="les profils à l’aise avec la logique"
        pros={['Scénarios dessinés comme un schéma', 'Embranchements, filtres, boucles', 'Souvent économique à volume égal']}
        ai="Modules IA (ChatGPT, Claude, Gemini…) à glisser dans le scénario."
        d={220}
      />
      <M8Tool
        id="powerautomate"
        tone="blue"
        pitch="le natif de Microsoft 365"
        who="les entreprises sous Outlook, Teams, SharePoint"
        pros={['Souvent déjà inclus dans vos licences', 'Outlook, Teams, Excel, SharePoint connectés', 'Cadre de sécurité de l’entreprise']}
        ai="Décrivez le flux en langage courant, Copilot le construit."
        d={340}
      />
    </div>
  </Frame>
);

// ─── Démo : un Zap en 4 étapes ──────────────────────────────────────────────
const M8ZapStep = ({ n, icon, app, what, c }: { n: number; icon: IconName; app: string; what: string; c: string }) => (
  <div className={b.pop(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 14, boxShadow: `inset 0 0 0 2px ${C.rule}`, padding: '14px 18px', width: 720 }}>
    <span style={{ flex: 'none', width: 50, height: 50, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={28} color="#fff" />
    </span>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
        {n === 1 ? 'Déclencheur' : `Action ${n - 1}`} · {app}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{what}</div>
    </div>
  </div>
);

const M8_Demo: Page = () => (
  <Frame mod={8} kind="demo" beats={5}>
    <Title>Démo : les demandes de devis triées toutes seules</Title>
    <ToolWindow id="zapier" title="Zap · demandes de devis" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 800, height: 700 }} pad={28}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <M8ZapStep n={1} icon="mail" app="Gmail / Outlook" what="Nouvel email avec « devis » dans l’objet" c="#EA4335" />
        <Icon name="arrow" size={26} color={C.faint} style={{ transform: 'rotate(90deg)' }} />
        <M8ZapStep n={2} icon="sparkles" app="Assistant IA" what="Extraire : client, besoin, budget, urgence" c={C.violet} />
        <Icon name="arrow" size={26} color={C.faint} style={{ transform: 'rotate(90deg)' }} />
        <M8ZapStep n={3} icon="table" app="Google Sheets / Excel" what="Ajouter une ligne au suivi des devis" c="#0F9D58" />
        <Icon name="arrow" size={26} color={C.faint} style={{ transform: 'rotate(90deg)' }} />
        <M8ZapStep n={4} icon="bell" app="Teams / Slack" what="Prévenir le commercial si urgence = haute" c="#5B5FC7" />
      </div>
    </ToolWindow>
    <div style={{ position: 'absolute', left: 980, top: 190, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.on(2)}>
        <Eyebrow c={C.violet} size={18}>
          Le prompt de l’étape IA
        </Eyebrow>
        <div style={{ marginTop: 8 }}>
          <CodeDark size={19} wrap>
            Extrais de cet email : nom du client, besoin en une phrase, budget (ou « non précisé »), urgence (haute / normale).{'\n'}
            <Cs>Réponds uniquement en JSON.</Cs> N’invente rien.
          </CodeDark>
        </div>
      </div>
      <div className={b.on(5)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Stat value="0 min" label="de saisie manuelle par demande, au lieu de 5" tone="green" size={80} />
        <Callout title="Et le contrôle ?" tone="pink" icon="humanCheck" size={22}>
          Le workflow trie et prévient ; <strong>c’est le commercial qui répond</strong>. Chaque semaine, il vérifie quelques lignes du tableau.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Feu tricolore des données ──────────────────────────────────────────────
const M8Zone = ({ x, title, tone, icon, answer }: { x: number; title: string; tone: Tone; icon: IconName; answer: string }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 480, width: 540, height: 420, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '18px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</span>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 22, right: 22, bottom: 18, fontSize: 19, lineHeight: 1.4, color: T[tone].fg, background: '#fff', borderRadius: 12, padding: '10px 14px' }}>
      <strong>Proposition : </strong>
      {answer}
    </div>
  </div>
);

const M8_Data: Page = () => (
  <Frame mod={8} kind="exercice" beats={1}>
    <Title>Le feu tricolore des données</Title>
    <Lede>Que peut-on coller dans un assistant IA ? Glissez chaque donnée dans sa couleur, puis → pour notre proposition.</Lede>
    <M8Zone x={120} title="Vert · librement" tone="green" icon="check" answer="texte public, brouillon de post, cas anonymisé." />
    <M8Zone x={690} title="Orange · outil pro validé" tone="yellow" icon="shieldCheck" answer="CR interne, proposition commerciale, email client." />
    <M8Zone x={1260} title="Rouge · jamais" tone="coral" icon="lock" answer="mots de passe, paie, santé, données bancaires." />
    <Drag x={120} y={262} w={530} tone="grey">Un article de presse public</Drag>
    <Drag x={690} y={262} w={530} tone="grey">Un mot de passe ou un accès</Drag>
    <Drag x={1260} y={262} w={540} tone="grey">Un compte rendu de réunion interne</Drag>
    <Drag x={120} y={330} w={530} tone="grey">Les fiches de paie de l’équipe</Drag>
    <Drag x={690} y={330} w={530} tone="grey">Le brouillon d’un post LinkedIn</Drag>
    <Drag x={1260} y={330} w={540} tone="grey">Un email client avec nom et adresse</Drag>
    <Drag x={120} y={398} w={530} tone="grey">Un cas client anonymisé</Drag>
    <Drag x={690} y={398} w={530} tone="grey">Un arrêt maladie, un dossier médical</Drag>
    <Drag x={1260} y={398} w={540} tone="grey">Une proposition commerciale confidentielle</Drag>
  </Frame>
);

// ─── Six réflexes d’un usage responsable ────────────────────────────────────
const M8Rule = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M8_Responsible: Page = () => (
  <Frame mod={8} beats={6}>
    <Title>Utiliser l’IA de manière responsable : six réflexes</Title>
    <Lede>Ce que nous avons vu toute la journée, rassemblé sur une page. À afficher à côté de votre écran.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <M8Rule n={1} icon="search" tone="blue" title="Vérifier les informations">
        Chiffres, dates, noms, citations : on remonte à la source avant d’utiliser.
      </M8Rule>
      <M8Rule n={2} icon="alert" tone="yellow" title="Repérer les hallucinations">
        Trop précis, trop sûr, invérifiable : les signes d’une invention plausible.
      </M8Rule>
      <M8Rule n={3} icon="lock" tone="coral" title="Protéger les données confidentielles">
        Rien de sensible sans vérifier les règles de l’entreprise et l’outil autorisé.
      </M8Rule>
      <M8Rule n={4} icon="users" tone="teal" title="Respecter clients et collègues">
        Données personnelles : RGPD. Anonymisez, minimisez, informez.
      </M8Rule>
      <M8Rule n={5} icon="ticket" tone="violet" title="Propriété intellectuelle">
        Conditions d’usage des contenus générés, droits des œuvres et des marques d’autrui.
      </M8Rule>
      <M8Rule n={6} icon="humanCheck" tone="green" title="Garder la validation humaine">
        Dès qu’il y a un enjeu, c’est un humain qui relit, décide et signe.
      </M8Rule>
    </div>
  </Frame>
);

// ─── Atelier final ──────────────────────────────────────────────────────────
const M8_Lab: Page = () => (
  <LabPage
    mod={8}
    n="8"
    title="Mon mini-plan IA"
    defi="plan"
    who="Individuel, puis partage au groupe"
    minutes={15}
    tools={['chatgpt', 'copilot', 'perplexity', 'notebooklm', 'gamma', 'fireflies']}
    label="Module 8 · Atelier final"
    objective={
      <>
        Choisir <strong>une tâche chronophage</strong> de votre activité et construire votre mini-plan : tâche → outil IA → méthode → résultat attendu → contrôle humain.
      </>
    }
    where={
      <>
        Votre mini-plan sur une ligne (modèle page suivante), et <strong>une date</strong> : quand le testerez-vous pour de vrai ?
      </>
    }
    crit={
      <>
        <CheckItem id="l8-c1" size={21}>Une tâche réelle et fréquente</CheckItem>
        <CheckItem id="l8-c2" size={21}>L’outil est autorisé pour ces données</CheckItem>
        <CheckItem id="l8-c3" size={21}>Le prompt ou la méthode est écrit</CheckItem>
        <CheckItem id="l8-c4" size={21}>Le contrôle humain est précis</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Reprenez votre fiche de l’atelier 1 : choisissez la tâche n° 1.</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Choisissez l’outil parmi les 20 vus aujourd’hui (ou un workflow).</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Écrivez la méthode : le prompt, les étapes.</div>
      <div><strong style={{ color: C.navy }}>4.</strong> Définissez le résultat attendu et le gain de temps visé.</div>
      <div><strong style={{ color: C.navy }}>5.</strong> Précisez le contrôle : qui vérifie quoi, quand.</div>
    </div>
    <Bonus>Volontaires : présentez votre mini-plan au groupe en 1 minute.</Bonus>
  </LabPage>
);

// ─── Le canevas du mini-plan (éditable) ─────────────────────────────────────
const PLAN_COLS: { t: string; icon: IconName; tone: Tone; ph: string }[] = [
  { t: 'Tâche', icon: 'clock', tone: 'blue', ph: 'Quelle tâche, à quelle fréquence, combien de temps ?' },
  { t: 'Outil IA', icon: 'tool', tone: 'violet', ph: 'Lequel des 20 outils ? Autorisé ?' },
  { t: 'Méthode', icon: 'chat', tone: 'teal', ph: 'Le prompt, les étapes, le workflow' },
  { t: 'Résultat attendu', icon: 'target', tone: 'green', ph: 'Le livrable et le temps gagné' },
  { t: 'Contrôle humain', icon: 'humanCheck', tone: 'pink', ph: 'Qui vérifie quoi, quand ?' },
];

const PLAN_EX: Record<string, string[]> = {
  devis: [
    'Répondre aux demandes de devis · 10 par jour · 5 min chacune',
    'Copilot dans Outlook (licence entreprise)',
    'Prompt modèle « Mes prompts » : contexte client + grille tarifaire jointe + ton maison, 120 mots',
    'Brouillon prêt en 1 min · ≈ 2 h gagnées par semaine',
    'Je relis prix, délais et nom du client avant chaque envoi',
  ],
  veille: [
    'Veille concurrentielle hebdomadaire · 1 h chaque lundi',
    'Perplexity (Espace « Veille ») puis NotebookLM',
    'Même recherche chaque lundi, sources de moins de 7 jours ; synthèse en 5 points',
    'Note de veille en 15 min au lieu d’1 h',
    'J’ouvre les 3 sources principales ; rien de non vérifié dans la note',
  ],
  vide: ['', '', '', '', ''],
};

const M8_Plan: Page = () => {
  const [v, setV] = useState<string[]>(PLAN_EX.devis);
  return (
    <Frame mod={8} kind="lab" label="Atelier final · Le canevas">
      <Title size={46}>Le canevas de votre mini-plan</Title>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 172, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 21, color: C.muted, marginRight: 4 }}>Charger :</span>
        <Btn size={19} ghost tone="blue" icon="mail" onClick={() => setV(PLAN_EX.devis)}>
          Exemple devis
        </Btn>
        <Btn size={19} ghost tone="teal" icon="search" onClick={() => setV(PLAN_EX.veille)}>
          Exemple veille
        </Btn>
        <Btn size={19} ghost tone="grey" icon="reset" onClick={() => setV(PLAN_EX.vide)}>
          Canevas vide
        </Btn>
        <span style={{ fontSize: 19, color: C.faint, marginLeft: 10 }}>Cliquez dans une case pour écrire en direct.</span>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', alignItems: 'stretch', gap: 10 }}>
        {PLAN_COLS.map((c, i) => (
          <div key={c.t} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div className={A.in} style={{ flex: 1, minWidth: 0, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[c.tone]}`, padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(i * 100) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconTile name={c.icon} tone={c.tone} size={44} solid />
                <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: C.navy }}>{c.t}</span>
              </div>
              <textarea
                data-osd-interactive
                value={v[i]}
                placeholder={c.ph}
                onChange={(e) => {
                  const val = e.target.value;
                  setV((o) => o.map((x, j) => (j === i ? val : x)));
                }}
                style={{ flex: 1, width: '100%', minWidth: 0, boxSizing: 'border-box', resize: 'none', border: 'none', outline: 'none', borderRadius: 12, background: T[c.tone].bg, padding: '14px 16px', fontFamily: body, fontSize: 22, lineHeight: 1.45, color: C.ink }}
              />
            </div>
            {i < PLAN_COLS.length - 1 ? <Icon name="arrow" size={26} color={C.faint} /> : null}
          </div>
        ))}
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(700) }}>
        Recopiez votre plan sur papier ou dans votre document « Mes prompts » : la page se réinitialise à chaque ouverture.
      </Hint>
    </Frame>
  );
};

// ─── Quiz M8 ────────────────────────────────────────────────────────────────
const M8_Quiz: Page = () => (
  <Frame mod={8} kind="quiz">
    <Title>Quiz · Module 8</Title>
    <QuizSeries y={200}>
      <QuizQ q="Dans un workflow, « un nouvel email arrive dans la boîte contact » est…" explain="C’est le déclencheur : l’événement qui lance le workflow.">
        <QOpt ok>le déclencheur</QOpt>
        <QOpt>l’action finale</QOpt>
        <QOpt>la validation humaine</QOpt>
      </QuizQ>
      <QuizQ q="Votre entreprise travaille sous Outlook, Teams et SharePoint. L’outil d’automatisation le plus naturel ?" explain="Power Automate est intégré à l’écosystème Microsoft 365 et souvent déjà inclus dans les licences.">
        <QOpt>CapCut</QOpt>
        <QOpt ok>Microsoft Power Automate</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="Quelle tâche ne faut-il pas automatiser entièrement ?" explain="Une décision qui touche une personne ou engage l’entreprise exige une validation humaine.">
        <QOpt>Classer les demandes de devis entrantes</QOpt>
        <QOpt ok>Refuser une candidature à un poste</QOpt>
        <QOpt>Ajouter une ligne dans un tableau de suivi</QOpt>
      </QuizQ>
      <QuizQ q="Un email client avec nom, adresse et réclamation : où peut-il aller ?" explain="Données personnelles : uniquement dans un outil professionnel validé par l’entreprise, en minimisant ce qui est transmis.">
        <QOpt>Dans n’importe quel assistant gratuit</QOpt>
        <QOpt ok>Seulement dans un outil professionnel validé</QOpt>
        <QOpt>Sur un forum pour demander conseil</QOpt>
      </QuizQ>
      <QuizQ q="Dans votre mini-plan, la colonne « contrôle humain » doit préciser…" explain="Un contrôle efficace est précis : qui vérifie, quoi exactement, et à quel moment.">
        <QOpt>« je ferai attention »</QOpt>
        <QOpt ok>qui vérifie quoi, et quand</QOpt>
        <QOpt>rien si l’outil est payant</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M8_Section, M8_Workflow, M8_Fit, M8_Examples, M8_Tools, M8_Demo, M8_Data, M8_Responsible, M8_Lab, M8_Plan, M8_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 8 · 16:40

OBJECTIF — Annoncer le dernier module : automatisation, usage responsable, plan d’action.

DIRE — « Dernier module. Jusqu’ici, c’est vous qui demandiez à l’IA. Maintenant : et si certaines tâches se faisaient toutes seules ? On découvre l’automatisation, sans devenir expert. Puis on rassemble les règles d’un usage responsable. Et vous repartez avec votre plan. »

TRANSITION — « Qu’est-ce qu’un workflow ? »`,
  `⏱ 3 min · QU’EST-CE QU’UN WORKFLOW ? (4 clics)

OBJECTIF — Définir déclencheur, étapes, action.

DIRE — « Un workflow, c’est une recette que l’ordinateur suit seul. » Clic par clic : « Quand un email arrive… l’IA le résume et le classe… une ligne s’ajoute au tableau… et un humain répond avec le brouillon préparé. » Puis : « Trois briques : un déclencheur, des étapes, une action. L’IA n’est qu’une étape parmi d’autres. »

TRANSITION — « Toutes les tâches ne s’y prêtent pas. Testons. »`,
  `⏱ 3 min · QUELLES TÂCHES AUTOMATISER ? (checklist)

OBJECTIF — Donner des critères d’automatisabilité.

DIRE — « Reprenez une tâche de votre fiche de l’atelier 1. Six critères : fréquente, toujours les mêmes étapes, numérique, règles simples, erreur peu grave, copier-coller entre outils. » Faire cocher un volontaire. « Et ce qu’on n’automatise pas : décisions sur des personnes, engagements juridiques ou financiers, situations émotionnelles. »

TRANSITION — « Trois exemples typiques. »`,
  `⏱ 4 min · TROIS WORKFLOWS (onglets)

OBJECTIF — Illustrer les exemples du programme : email → résumé → réponse, formulaire → analyse → rapport, réunion → compte rendu → tâches.

DIRE — Onglet 1 : « Le support client : l’IA résume, classe, prépare un brouillon ; un conseiller relit et envoie. » Onglet 2 : « L’enquête de satisfaction : chaque lundi, un rapport d’analyse arrive tout seul. » Onglet 3 : « La réunion : on a vu la chaîne au module 6 ; ici elle tourne seule, avec une validation de l’animateur. »

INSISTER — Où est le contrôle humain à chaque fois ? Faire répondre le groupe.

TRANSITION — « Avec quels outils ? »`,
  `⏱ 4 min · ZAPIER, MAKE, POWER AUTOMATE

OBJECTIF — Découvrir les trois outils du programme.

DIRE — « Zapier : le plus simple pour débuter, des milliers d’applications, une logique “quand… alors…”. Make : le plus visuel, on dessine des scénarios avec des embranchements. Power Automate : le natif de Microsoft 365, souvent déjà inclus dans vos licences. Les trois intègrent l’IA, et permettent même de décrire un workflow en langage courant. »

INSISTER — L’objectif n’est pas de devenir expert : savoir ce qui est possible, et en parler à votre service informatique.

TRANSITION — « Un exemple concret. »`,
  `⏱ 4 min · DÉMONSTRATION ZAPIER (5 clics)

OBJECTIF — Montrer un workflow réaliste de bout en bout.

DIRE — Clic 1 : « Le déclencheur : un email avec “devis” dans l’objet. » Clic 2 : « L’étape IA, avec son prompt : extraire client, besoin, budget, urgence, en JSON, sans rien inventer. » Clic 3 : « Une ligne dans le suivi des devis. » Clic 4 : « Le commercial est prévenu si c’est urgent. » Clic 5 : « Zéro saisie manuelle. Et le contrôle : c’est le commercial qui répond, et il vérifie le tableau chaque semaine. »

ANIMATION — Si une connexion est disponible, montrer un modèle de Zap réel dans Zapier.

TRANSITION — « Passons à l’usage responsable. Premier sujet : les données. »`,
  `⏱ 5 min · FEU TRICOLORE DES DONNÉES (glisser-déposer, 1 clic)

OBJECTIF — Ne pas transmettre de données confidentielles sans vérifier les règles ; confidentialité clients et collaborateurs.

DIRE — « Neuf données. Vert : je peux coller librement. Orange : seulement dans un outil professionnel validé par l’entreprise. Rouge : jamais. » Faire voter et glisser. Clic : « Notre proposition. Les mots de passe, la paie, la santé : jamais. L’email client avec nom et adresse : orange, et en minimisant. »

ADAPTER — La politique de votre entreprise prime : certaines classent tout en orange par défaut.

TRANSITION — « Les six réflexes, rassemblés. »`,
  `⏱ 3 min · SIX RÉFLEXES (6 clics)

OBJECTIF — Synthèse de l’usage responsable : vérifier, hallucinations, données, confidentialité, propriété intellectuelle, validation humaine.

DIRE — Clic par clic, en reliant chaque réflexe à un moment de la journée : « Vérifier — le module 4. Les hallucinations — le rapport annuel inventé du module 1. Les données — le feu tricolore. Clients et collègues — le RGPD et l’enregistrement des réunions. Propriété intellectuelle — les images du module 7. Validation humaine — l’email de suivi du module 6. »

TRANSITION — « Dernier atelier : votre plan. »`,
  `⏱ 15 min · ATELIER FINAL · MON MINI-PLAN (minuteur)

OBJECTIF — Chaque participant construit son mini-plan : tâche → outil IA → méthode → résultat attendu → contrôle humain.

DIRE — « Reprenez votre fiche de l’atelier 1. Choisissez la tâche numéro un. Puis remplissez les cinq colonnes. Et fixez une date : quand allez-vous le tester pour de vrai ? »

ANIMATION — Afficher le canevas (page suivante) avec l’exemple devis. Lancer le minuteur. Pour la restitution, saisir en direct le plan d’un ou deux volontaires dans le canevas vide.

TRANSITION — « Le canevas. »`,
  `⏱ (support de l’atelier final) · CANEVAS ÉDITABLE

OBJECTIF — Fournir un modèle à compléter, avec deux exemples.

DIRE — « Exemple devis : Copilot dans Outlook, un prompt modèle, deux heures gagnées par semaine, et un contrôle précis : prix, délais, nom du client. Exemple veille : Perplexity puis NotebookLM, et le contrôle : les trois sources principales ouvertes. » Puis « Canevas vide » pour la restitution.

INSISTER — Le contrôle humain doit être précis : qui vérifie quoi, quand. « Je ferai attention » n’est pas un contrôle.

TRANSITION — « Dernier quiz de module. »`,
  `⏱ 4 min · QUIZ MODULE 8

OBJECTIF — Vérifier : déclencheur, Power Automate, tâche à ne pas automatiser, données personnelles, contrôle humain précis.

DIRE — « Cinq questions. »

TRANSITION — « Il est temps de faire le bilan de la journée. »`,
];
// @@NOTES-END
