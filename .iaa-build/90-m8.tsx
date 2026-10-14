// ─── Module 8 · Assistants et agents IA ─────────────────────────────────────

const M8_Section: Page = () => (
  <Section
    n={8}
    title={
      <>
        Assistants
        <br />& agents IA
      </>
    }
    sub="Un assistant spécialisé suit une mission et des règles. Un agent choisit ses actions et utilise des outils. Les deux exigent un cadre."
    dur="14:30 – 15:45 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 8 · concevoir un assistant ou un agent
      </Tag>
    }
  >
    <SecItem n={1}>Assistant spécialisé ou conversation classique</SecItem>
    <SecItem n={2}>Mission, règles, connaissances, comportement, tests</SecItem>
    <SecItem n={3}>Qu’est-ce qu’un agent IA ?</SecItem>
    <SecItem n={4}>Chatbot, assistant, workflow, agent</SecItem>
    <SecItem n={5}>Limites, risques et contrôle humain</SecItem>
  </Section>
);
M8_Section.transition = BLOOM;

// ─── Assistant spécialisé vs conversation classique ─────────────────────────
const M8Col = ({ tone, icon, title, children, cls, style }: { tone: Tone; icon: IconName; title: string; children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '24px 30px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
  </div>
);

const M8_Versus: Page = () => (
  <Frame mod={8} beats={1}>
    <Title>Assistant spécialisé ou conversation classique ?</Title>
    <Lede>Un assistant spécialisé, c’est une conversation qu’on a préparée une fois pour toutes, puis partagée.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 30 }}>
      <M8Col tone="grey" icon="chat" title="Conversation classique" cls={A.in}>
        <Bullet tone="grey" size={25}>Chaque fois, on réexplique le contexte</Bullet>
        <Bullet tone="grey" size={25}>Les réponses varient selon qui demande</Bullet>
        <Bullet tone="grey" size={25}>On joint les documents à la main</Bullet>
        <Bullet tone="grey" size={25}>Aucune règle commune à l’équipe</Bullet>
      </M8Col>
      <M8Col tone="blue" icon="bot" title="Assistant spécialisé" cls={b.on(1)}>
        <Bullet tone="blue" size={25}>Une mission et un public définis</Bullet>
        <Bullet tone="blue" size={25}>Des règles et un ton imposés</Bullet>
        <Bullet tone="blue" size={25}>Une base de connaissances jointe</Bullet>
        <Bullet tone="blue" size={25}>Testé, puis partagé à toute l’équipe</Bullet>
      </M8Col>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout title="Exemple" tone="blue" icon="user" size={24}>
        « Assistant congés » : connaît l’accord d’entreprise, répond aux salariés 24 h / 24, cite l’article, et renvoie vers les RH dès qu’une situation est personnelle.
      </Callout>
    </div>
  </Frame>
);

// ─── Les cinq briques ───────────────────────────────────────────────────────
const M8Brick = ({ n, tone, icon, title, q, ex, beat }: { n: number; tone: Tone; icon: IconName; title: string; q: string; ex: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Num n={n} tone={tone} size={38} />
      <IconTile name={icon} tone={tone} size={42} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</div>
    <div style={{ fontSize: 21, fontStyle: 'italic', color: T[tone].fg }}>{q}</div>
    <div style={{ fontSize: 20, lineHeight: 1.45, color: C.soft }}>{ex}</div>
  </div>
);

const M8_Briques: Page = () => (
  <Frame mod={8} beats={4}>
    <Title>Cinq briques pour concevoir un assistant</Title>
    <Lede>Exemple fil : l’assistant du support client d’un éditeur de logiciel de gestion.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 20, alignItems: 'stretch' }}>
      <M8Brick beat={0} n={1} tone="blue" icon="target" title="Mission" q="Pour qui, pour quoi ?" ex="Aider les clients à résoudre les incidents courants du module facturation." />
      <M8Brick beat={1} n={2} tone="coral" icon="shield" title="Règles" q="Ce qui est interdit, ce qui est obligatoire" ex="Jamais de geste commercial. Toujours le n° de ticket. Escalade si perte de données." />
      <M8Brick beat={2} n={3} tone="teal" icon="book" title="Connaissances" q="Sur quoi s’appuyer ?" ex="Guide utilisateur, FAQ, notes de version. Rien d’autre." />
      <M8Brick beat={3} n={4} tone="violet" icon="chat" title="Comportement" q="Comment répondre ?" ex="Vouvoiement, étapes numérotées, une question à la fois si l’info manque." />
      <M8Brick beat={4} n={5} tone="green" icon="flask" title="Tests" q="Comment savoir qu’il est prêt ?" ex="20 questions types, dont 5 pièges. Revue des réponses par le support." />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="loop" size={30} color={C.green} />
      <span>
        Tester, lire les échecs, corriger les règles ou les connaissances, retester : un assistant <strong>s’améliore par itérations</strong>, pas en une fois.
      </span>
    </div>
  </Frame>
);

// ─── Exemple d’instructions ─────────────────────────────────────────────────
const M8_Instructions: Page = () => (
  <Frame mod={8} kind="cas">
    <Title>Exemple d’instructions : l’assistant congés</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1180 }}>
      <CodeDark file="instructions · Assistant congés (v2)" size={21} wrap>
        <Cc># Mission</Cc>
        {'\n'}Tu réponds aux questions des salariés sur les congés, RTT et absences, d’après l’accord d’entreprise et le guide RH joints.{'\n\n'}
        <Cc># Règles</Cc>
        {'\n'}- Réponds uniquement d’après les documents joints. Cite l’article.{'\n'}- Si la réponse n’y figure pas : dis-le, et oriente vers rh@entreprise.fr.
        {'\n'}- Situation personnelle (maladie, conflit, cas particulier) : ne conseille pas, oriente vers les RH.{'\n'}- Ne demande ni ne mémorise aucune donnée personnelle.
        {'\n\n'}
        <Cc># Comportement</Cc>
        {'\n'}Vouvoiement, réponse en 5 lignes maximum, puis la source.{'\n'}Si la question est ambiguë, pose une seule question de clarification.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1360, top: 200, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="target" title="Mission" cls={A.right} style={dl(200)} size={21} pad={22}>
        Une phrase : public, sujet, sources.
      </Card>
      <Card tone="coral" icon="shield" title="Règles" cls={A.right} style={dl(300)} size={21} pad={22}>
        Ce qu’il ne fait jamais, et vers qui il oriente.
      </Card>
      <Card tone="violet" icon="chat" title="Comportement" cls={A.right} style={dl(400)} size={21} pad={22}>
        Ton, longueur, format, gestion de l’ambiguïté.
      </Card>
    </div>
  </Frame>
);

// ─── Tester un assistant (simulateur) ───────────────────────────────────────
const M8_TESTS = [
  { kind: 'Question standard', tone: 'blue' as Tone, q: 'Combien de jours de congés pour un mariage ?', a: 'Quatre jours ouvrables pour votre mariage ou votre PACS, à prendre dans le mois qui l’entoure.', src: 'Accord d’entreprise, art. 12.3', ok: 'Réponse courte et sourcée.' },
  { kind: 'Hors périmètre', tone: 'yellow' as Tone, q: 'Quel est le meilleur fournisseur de café pour la machine ?', a: 'Je réponds uniquement aux questions sur les congés et absences. Pour les achats, vous pouvez contacter les services généraux.', src: '', ok: 'Il reste dans sa mission.' },
  { kind: 'Situation personnelle', tone: 'coral' as Tone, q: 'Mon médecin m’arrête 3 semaines, mon manager me met la pression, que faire ?', a: 'Je ne peux pas vous conseiller sur une situation personnelle. Le service RH peut vous accompagner en toute confidentialité : rh@entreprise.fr.', src: '', ok: 'Il oriente sans conseiller.' },
  { kind: 'Question ambiguë', tone: 'violet' as Tone, q: 'J’ai droit à combien de jours ?', a: 'Pour vous répondre précisément : parlez-vous des congés payés, des RTT ou d’un congé pour événement familial ?', src: '', ok: 'Une seule question de clarification.' },
];

const M8TestBtn = ({ i, cur, pick }: { i: number; cur: number; pick: () => void }) => {
  const t = M8_TESTS[i];
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        pick();
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', boxSizing: 'border-box', padding: '14px 18px', border: 'none', borderRadius: 14, cursor: 'pointer', textAlign: 'left', fontFamily: body, background: cur === i ? T[t.tone].bg : C.card, boxShadow: cur === i ? `inset 0 0 0 3px ${STRONG[t.tone]}` : SHADOW_SM, transition: `all 250ms ${EASE}` }}
    >
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[t.tone].fg }}>{t.kind}</span>
      <span style={{ fontSize: 21, lineHeight: 1.35, color: C.ink }}>{t.q}</span>
    </button>
  );
};

const M8_Tester: Page = () => {
  const [cur, setCur] = useState(0);
  const t = M8_TESTS[cur];
  return (
    <Frame mod={8} kind="simu">
      <Title>Tester un assistant : les quatre questions qui révèlent tout</Title>
      <Lede>Un assistant se juge sur les cas difficiles. Cliquez un type de question et vérifiez le comportement attendu.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M8TestBtn i={0} cur={cur} pick={() => setCur(0)} />
        <M8TestBtn i={1} cur={cur} pick={() => setCur(1)} />
        <M8TestBtn i={2} cur={cur} pick={() => setCur(2)} />
        <M8TestBtn i={3} cur={cur} pick={() => setCur(3)} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 800, top: 262, width: 1000, background: '#F1F4FA', borderRadius: 22, padding: '26px 30px', boxSizing: 'border-box', minHeight: 560, ...dl(150) }}>
        <div key={cur} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Bubble who="user" name="Salarié" w={680} cls={A.in} style={{ animationDuration: '400ms' } as CSSProperties}>
            {t.q}
          </Bubble>
          <Bubble who="agent" name="Assistant congés" w={760} cls={A.in} style={dl(350)}>
            {t.a}
            {t.src ? <div style={{ marginTop: 8, fontSize: 19, color: C.blue }}>Source : {t.src}</div> : null}
          </Bubble>
          <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 700, color: T.green.fg, ...dl(700) }}>
            <Icon name="checkCircle" size={30} color={C.green} /> Attendu : {t.ok}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Où créer un assistant ──────────────────────────────────────────────────
const M8Where = ({ name, what, tone, d }: { name: string; what: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '24px 26px', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{name}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{what}</div>
  </div>
);

const M8_Ou: Page = () => (
  <Frame mod={8}>
    <Title>Où créer un assistant spécialisé ?</Title>
    <Lede>Chaque grand assistant propose sa version. Les briques sont les mêmes : instructions, fichiers, parfois des outils.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M8Where name="ChatGPT · GPTs" what="Instructions, fichiers de connaissances, actions vers des API. Partage dans l’espace de l’entreprise." tone="green" d={100} />
      <M8Where name="Claude · Projets" what="Instructions et documents partagés par toute une équipe, sur un même projet." tone="yellow" d={180} />
      <M8Where name="Gemini · Gems" what="Assistants personnalisés, avec accès aux documents Google Workspace." tone="violet" d={260} />
      <M8Where name="Microsoft 365 Copilot · agents" what="Agents appuyés sur SharePoint, Teams, Outlook ; Copilot Studio pour aller plus loin." tone="blue" d={340} />
      <M8Where name="Le Chat (Mistral) · agents" what="Agents avec instructions et bibliothèques de documents ; option européenne." tone="coral" d={420} />
      <M8Where name="Plateformes no-code" what="Make, Zapier, n8n, Power Automate proposent aussi des agents reliés à vos scénarios." tone="teal" d={500} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 770, width: 1680, ...dl(700) }}>
      <Callout title="Avant de choisir" tone="coral" icon="lock" size={23}>
        Utilisez l’outil et la licence validés par l’entreprise : c’est ce qui décide où vont les documents que vous joignez.
      </Callout>
    </div>
  </Frame>
);

// ─── Qu’est-ce qu’un agent ? (boucle pas à pas) ─────────────────────────────
const M8_LOOP = [
  { k: 'plan', icon: 'brain' as IconName, tone: 'violet' as Tone, t: 'Je planifie : 1) l’historique client, 2) les derniers échanges, 3) l’actualité de l’entreprise, 4) une note de préparation.' },
  { k: 'act', icon: 'tool' as IconName, tone: 'blue' as Tone, t: 'J’agis · outil CRM : rechercher « Altea ».' },
  { k: 'obs', icon: 'eye' as IconName, tone: 'teal' as Tone, t: 'J’observe : opportunité DEM-0057, 15 agents à former, score 82.' },
  { k: 'act', icon: 'tool' as IconName, tone: 'blue' as Tone, t: 'J’agis · outil messagerie : 3 derniers emails avec Nina Roy.' },
  { k: 'obs', icon: 'eye' as IconName, tone: 'teal' as Tone, t: 'J’observe : elle hésite entre présentiel et distanciel ; budget validé.' },
  { k: 'act', icon: 'tool' as IconName, tone: 'blue' as Tone, t: 'J’agis · outil recherche web : actualités d’Altea.' },
  { k: 'obs', icon: 'eye' as IconName, tone: 'teal' as Tone, t: 'J’observe : ouverture de deux agences le mois prochain.' },
  { k: 'res', icon: 'flag' as IconName, tone: 'green' as Tone, t: 'Résultat : note d’une page, 3 questions à poser, proposition hybride. Envoi de l’invitation ? → validation humaine demandée.' },
];

const M8LoopLine = ({ i, n }: { i: number; n: number }) => {
  if (n <= i) return null;
  const s = M8_LOOP[i];
  return (
    <div className={A.left} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDuration: '450ms' } as CSSProperties}>
      <IconTile name={s.icon} tone={s.tone} size={42} solid={s.k === 'res'} />
      <div style={{ fontSize: 21, lineHeight: 1.42, color: C.ink, paddingTop: 6 }}>{s.t}</div>
    </div>
  );
};

const M8_Agent: Page = () => {
  const [n, setN] = useState(0);
  return (
    <Frame mod={8} kind="simu">
      <Title>Qu’est-ce qu’un agent IA ?</Title>
      <Lede>Il reçoit un objectif, choisit ses étapes, utilise des outils et observe les résultats, jusqu’au but.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 560 }}>
        <Bubble who="user" name="Objectif donné" w={460}>
          Prépare mon rendez-vous de demain avec Altea.
        </Bubble>
        <div style={{ marginTop: 34, position: 'relative', width: 420, height: 300, marginLeft: 40 }}>
          <svg width={420} height={300} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <circle cx={210} cy={150} r={115} fill="none" stroke={C.rule} strokeWidth={5} strokeDasharray="10 10" className={A.march} />
            <FlowDot path="M210 35 A 115 115 0 1 1 209.9 35" dur={4} r={9} color={C.violet} />
          </svg>
          <div style={{ position: 'absolute', left: 150, top: 8 }}>
            <Tag tone="violet" size={20}>Planifier</Tag>
          </div>
          <div style={{ position: 'absolute', left: 330, top: 130 }}>
            <Tag tone="blue" size={20}>Agir</Tag>
          </div>
          <div style={{ position: 'absolute', left: 140, top: 250 }}>
            <Tag tone="teal" size={20}>Observer</Tag>
          </div>
          <div style={{ position: 'absolute', left: -24, top: 130 }}>
            <Tag tone="green" size={20}>Finir ?</Tag>
          </div>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 740, top: 262, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', boxSizing: 'border-box', minHeight: 640, ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Btn icon="play" size={21} disabled={n >= M8_LOOP.length} onClick={() => setN((x) => Math.min(M8_LOOP.length, x + 1))}>
            Étape suivante
          </Btn>
          <Btn ghost size={21} onClick={() => setN(M8_LOOP.length)}>
            Tout
          </Btn>
          <Btn ghost tone="grey" icon="reset" size={21} onClick={() => setN(0)} />
          <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 20, color: C.muted }}>
            {n} / {M8_LOOP.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M8LoopLine i={0} n={n} />
          <M8LoopLine i={1} n={n} />
          <M8LoopLine i={2} n={n} />
          <M8LoopLine i={3} n={n} />
          <M8LoopLine i={4} n={n} />
          <M8LoopLine i={5} n={n} />
          <M8LoopLine i={6} n={n} />
          <M8LoopLine i={7} n={n} />
        </div>
      </div>
    </Frame>
  );
};

// ─── Chatbot, assistant, workflow, agent ────────────────────────────────────
const M8Cell = ({ children, tone, head = false }: { children: ReactNode; tone?: Tone; head?: boolean }) => (
  <div style={{ padding: '14px 16px', fontSize: head ? 24 : 21, fontWeight: head ? 800 : 400, fontFamily: head ? display : body, lineHeight: 1.35, color: head && tone ? STRONG[tone] : C.ink, background: head && tone ? T[tone].bg : 'transparent', borderRadius: head ? 12 : 0 }}>{children}</div>
);

const M8CRow = ({ label, cells, d }: { label: string; cells: ReactNode[]; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr)', gap: 10, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, ...dl(d) }}>
    <div style={{ padding: '14px 18px', fontSize: 21, fontWeight: 700, color: C.navy }}>{label}</div>
    {cells[0]}
    {cells[1]}
    {cells[2]}
    {cells[3]}
  </div>
);

const M8_Compare: Page = () => (
  <Frame mod={8}>
    <Title>Chatbot, assistant, workflow, agent : qui décide de quoi ?</Title>
    <Lede>La vraie différence : qui choisit les étapes, et avec quels outils.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr)', gap: 10 }}>
      <span />
      <M8Cell head tone="grey">Chatbot</M8Cell>
      <M8Cell head tone="blue">Assistant</M8Cell>
      <M8Cell head tone="green">Workflow</M8Cell>
      <M8Cell head tone="violet">Agent</M8Cell>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 340, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M8CRow d={100} label="Qui choisit les étapes ?" cells={[<M8Cell key={1}>Un arbre de réponses écrit d’avance</M8Cell>, <M8Cell key={2}>L’utilisateur, à chaque question</M8Cell>, <M8Cell key={3}>Le concepteur, une fois pour toutes</M8Cell>, <M8Cell key={4}>L’agent, selon l’objectif</M8Cell>]} />
      <M8CRow d={200} label="Outils" cells={[<M8Cell key={1}>Aucun</M8Cell>, <M8Cell key={2}>Ses documents</M8Cell>, <M8Cell key={3}>Les applications connectées</M8Cell>, <M8Cell key={4}>Ceux qu’on lui confie</M8Cell>]} />
      <M8CRow d={300} label="Prévisibilité" cells={[<M8Cell key={1}>Totale, mais rigide</M8Cell>, <M8Cell key={2}>Bonne, dans son périmètre</M8Cell>, <M8Cell key={3}>Élevée : même chemin</M8Cell>, <M8Cell key={4}>Variable : à encadrer</M8Cell>]} />
      <M8CRow d={400} label="Exemple" cells={[<M8Cell key={1}>FAQ du site à choix multiples</M8Cell>, <M8Cell key={2}>Assistant congés</M8Cell>, <M8Cell key={3}>Routage des demandes</M8Cell>, <M8Cell key={4}>Préparer un rendez-vous client</M8Cell>]} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(600) }}>
      <Callout title="Règle de choix" tone="green" icon="target" size={23}>
        Si vous savez dessiner les étapes à l’avance, faites un <strong>workflow</strong> : c’est plus fiable et moins cher. Réservez l’agent aux tâches dont le chemin change à
        chaque fois.
      </Callout>
    </div>
  </Frame>
);

// ─── Agent = modèle + instructions + outils + données ───────────────────────
const M8Term = ({ icon, tone, title, sub, d }: { icon: IconName; tone: Tone; title: string; sub: string; d: number }) => (
  <div className={A.pop} style={{ width: 300, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '22px 24px', boxSizing: 'border-box', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} solid />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{sub}</div>
  </div>
);

const M8Op = ({ children, d }: { children: string; d: number }) => (
  <span className={A.fade} style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: C.faint, ...dl(d) }}>
    {children}
  </span>
);

const M8_Formule: Page = () => (
  <Frame mod={8}>
    <Title>Un agent = modèle + instructions + outils + données</Title>
    <Lede>Et une cinquième pièce, indispensable : les garde-fous.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <M8Term icon="brain" tone="violet" title="Modèle" sub="Raisonne, planifie, rédige." d={100} />
      <M8Op d={200}>+</M8Op>
      <M8Term icon="doc" tone="blue" title="Instructions" sub="Mission, règles, limites, ton." d={250} />
      <M8Op d={350}>+</M8Op>
      <M8Term icon="tool" tone="green" title="Outils" sub="CRM, messagerie, agenda, recherche." d={400} />
      <M8Op d={500}>+</M8Op>
      <M8Term icon="database" tone="teal" title="Données" sub="Documents, historique, contexte." d={550} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24, ...dl(700) }}>
      <div style={{ flex: 1.2, background: G.navy, borderRadius: 20, padding: '24px 30px', color: '#fff', display: 'flex', alignItems: 'center', gap: 20 }}>
        <Icon name="shieldCheck" size={56} color="#C9B6FF" />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30 }}>+ Garde-fous</div>
          <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.45, color: '#E6EAF6' }}>Outils en lecture seule par défaut, validation avant toute action externe, plafonds, journal de chaque action.</div>
        </div>
      </div>
      <div style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
        <Eyebrow c={C.navy} size={19}>
          Pour aller plus loin
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          Le protocole <strong style={{ color: C.navy }}>MCP</strong> (Model Context Protocol) devient le standard pour brancher des outils et des données sur un assistant ou un
          agent.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Niveaux d’autonomie, risques et contrôle humain ────────────────────────
const M8_AUTO = [
  { t: 'Suggérer', can: 'Propose une idée, une réponse, un plan.', risk: 'Très faible', tone: 'green' as Tone, ex: 'Assistant documentaire' },
  { t: 'Préparer', can: 'Prépare des brouillons, des notes, des fichiers. Ne les envoie pas.', risk: 'Faible', tone: 'teal' as Tone, ex: 'Préparation de rendez-vous' },
  { t: 'Agir avec validation', can: 'Agit dans les outils après accord explicite d’un humain.', risk: 'Maîtrisé', tone: 'blue' as Tone, ex: 'Envoi de relances commerciales' },
  { t: 'Agir puis rendre compte', can: 'Agit seul dans un périmètre borné, rapport quotidien.', risk: 'Élevé', tone: 'yellow' as Tone, ex: 'Tri et classement de documents' },
  { t: 'Agir seul', can: 'Choisit et exécute sans contrôle, y compris vers l’extérieur.', risk: 'Très élevé', tone: 'coral' as Tone, ex: 'À éviter en entreprise' },
];

const M8Risk = ({ icon, title, children, d }: { icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={44} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M8_Autonomie: Page = () => {
  const [lv, setLv] = useState(2);
  const a = M8_AUTO[lv];
  return (
    <Frame mod={8} kind="simu">
      <Title>Limites, risques et contrôle humain</Title>
      <Lede>Plus l’agent est autonome, plus une erreur va loin avant qu’on la voie. Réglez le curseur.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ fontSize: 23, color: C.ink, whiteSpace: 'nowrap' }}>Niveau d’autonomie</span>
          <Range value={lv} onChange={setLv} min={0} max={4} w={480} tone={a.tone} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[a.tone] }}>{lv + 1} / 5</span>
        </div>
        <div key={lv} className={A.fade} style={{ marginTop: 26, animationDuration: '350ms' } as CSSProperties}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{a.t}</div>
          <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{a.can}</div>
          <div style={{ marginTop: 20, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Tag tone={a.tone} size={22}>
              <Icon name="alert" size={22} /> Risque : {a.risk}
            </Tag>
            <Tag tone="grey" size={22}>
              <Icon name="bot" size={22} /> {a.ex}
            </Tag>
          </div>
        </div>
        <div style={{ marginTop: 26, fontSize: 21, lineHeight: 1.45, color: C.muted }}>En entreprise, visez les niveaux 1 à 3 ; le niveau 4 sur un périmètre étroit et réversible.</div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 18, ...dl(200) }}>
        <Eyebrow c={T.coral.fg} size={20}>
          Les risques propres aux agents
        </Eyebrow>
        <M8Risk icon="alert" title="Erreur en cascade" d={250}>
          Une mauvaise observation au début fausse toutes les actions suivantes.
        </M8Risk>
        <M8Risk icon="mail" title="Instructions cachées" d={350}>
          Un email ou une page web peut contenir des ordres que l’agent suivra.
        </M8Risk>
        <M8Risk icon="key" title="Droits trop larges" d={450}>
          L’agent peut tout ce que ses outils permettent : limitez-les.
        </M8Risk>
        <M8Risk icon="money" title="Coûts imprévisibles" d={550}>
          Une boucle de raisonnement peut multiplier les appels au modèle.
        </M8Risk>
      </div>
    </Frame>
  );
};

// ─── Atelier 8 ──────────────────────────────────────────────────────────────
const M8_Atelier: Page = () => (
  <LabPage
    mod={8}
    n="8"
    title="Concevoir un assistant ou un agent spécialisé"
    defi="assistant"
    who="En binôme"
    minutes={35}
    where={
      <>
        Une <strong>fiche de conception</strong> (mission, règles, connaissances, outils, autonomie, tests) et, si l’outil le permet, l’assistant <strong>créé et testé</strong>.
      </>
    }
    objective={
      <>
        Concevoir le fonctionnement d’un assistant ou d’un agent spécialisé : <strong>commercial, RH, administratif, support client ou documentaire</strong>, ou celui de votre
        processus.
      </>
    }
    crit={
      <>
        <CheckItem id="a8c1" size={22}>Mission en une phrase</CheckItem>
        <CheckItem id="a8c2" size={22}>3 règles dont 1 interdiction</CheckItem>
        <CheckItem id="a8c3" size={22}>Niveau d’autonomie justifié</CheckItem>
        <CheckItem id="a8c4" size={22}>Les 4 types de tests passés</CheckItem>
      </>
    }
  >
    <div>1. Choisissez un assistant (page suivante) ou celui de votre fil rouge.</div>
    <div>2. Rédigez les instructions : mission, règles, comportement.</div>
    <div>3. Listez connaissances et outils ; fixez le niveau d’autonomie (1 à 5).</div>
    <div>4. Testez : standard, hors périmètre, situation sensible, question ambiguë.</div>
    <Bonus>Créez-le pour de vrai dans l’assistant de votre entreprise et partagez-le à votre binôme.</Bonus>
  </LabPage>
);

// ─── Atelier 8 · Cinq assistants ────────────────────────────────────────────
const M8Spec = ({ mission, rules, know, tools, lvl }: { mission: string; rules: string; know: string; tools: string; lvl: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
    <M8SpecCell icon="target" tone="blue" k="Mission">
      {mission}
    </M8SpecCell>
    <M8SpecCell icon="shield" tone="coral" k="Règles clés">
      {rules}
    </M8SpecCell>
    <M8SpecCell icon="book" tone="teal" k="Connaissances">
      {know}
    </M8SpecCell>
    <M8SpecCell icon="tool" tone="green" k="Outils · autonomie">
      {tools} · <strong>{lvl}</strong>
    </M8SpecCell>
  </div>
);

const M8SpecCell = ({ icon, tone, k: key, children }: { icon: IconName; tone: Tone; k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px' }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg }}>{key}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.42, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M8_Fiches: Page = () => (
  <Frame mod={8} kind="lab">
    <Title>Atelier 8 · Cinq assistants au choix</Title>
    <Tabs initial="com" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
        <TabBtn id="com" tone="blue" icon="money">
          Commercial
        </TabBtn>
        <TabBtn id="rh" tone="violet" icon="user">
          RH
        </TabBtn>
        <TabBtn id="adm" tone="green" icon="archive">
          Administratif
        </TabBtn>
        <TabBtn id="sup" tone="teal" icon="tool">
          Support client
        </TabBtn>
        <TabBtn id="doc" tone="navy" icon="book">
          Documentaire
        </TabBtn>
      </div>
      <TabPane id="com">
        <M8Spec mission="Préparer les rendez-vous et les relances des commerciaux." rules="Aucun prix ni remise hors grille. Jamais d’envoi sans validation." know="Grille tarifaire, fiches produits, historique CRM." tools="CRM, messagerie, agenda en lecture" lvl="niveau 2 · préparer" />
      </TabPane>
      <TabPane id="rh">
        <M8Spec mission="Répondre aux questions des salariés sur congés, mutuelle, formation." rules="Sources citées. Situation personnelle → RH. Aucune donnée personnelle." know="Accord d’entreprise, guide RH, catalogue formation." tools="Aucun outil, documents seuls" lvl="niveau 1 · suggérer" />
      </TabPane>
      <TabPane id="adm">
        <M8Spec mission="Trier les documents entrants et préparer leur enregistrement." rules="Doute → file humaine. Aucune suppression. Journal de chaque classement." know="Plan de classement, règles de nommage." tools="Stockage en écriture sur un seul dossier" lvl="niveau 4 · périmètre étroit" />
      </TabPane>
      <TabPane id="sup">
        <M8Spec mission="Proposer une réponse à chaque ticket de niveau 1." rules="Jamais de geste commercial. Escalade si perte de données ou colère." know="FAQ, guide utilisateur, notes de version." tools="Outil de ticketing : brouillon seulement" lvl="niveau 3 · agir avec validation" />
      </TabPane>
      <TabPane id="doc">
        <M8Spec mission="Retrouver la bonne procédure interne et la résumer." rules="Uniquement d’après la base. Citer document et version. « Je ne sais pas » autorisé." know="Procédures qualité, notes de service à jour." tools="Recherche documentaire" lvl="niveau 1 · suggérer" />
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(500) }}>
      <Callout title="Test en binôme" tone="violet" icon="users" size={23}>
        Votre binôme joue l’utilisateur piégeur : une question hors périmètre, une situation sensible, une question ambiguë. Notez ce qui casse et corrigez les règles.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM M8 ─────────────────────────────────────────────────────────────────
const M8_Qcm: Page = () => (
  <QcmPage
    mod={8}
    n={8}
    title="Agent ou workflow ?"
    q="Chaque facture fournisseur reçue doit être lue, contrôlée et enregistrée, toujours selon les mêmes étapes. Que choisissez-vous ?"
    explain="Les étapes sont connues d’avance et toujours identiques : un workflow avec une étape IA est plus fiable, plus traçable et moins cher qu’un agent qui redécide à chaque fois."
  >
    <Opt why="Un agent redécide des étapes à chaque facture : plus de variabilité, plus de coût, pour un chemin qui ne change jamais.">Un agent autonome avec accès à la comptabilité</Opt>
    <Opt ok why="Exact : chemin fixe = workflow. L’IA ne sert qu’à l’extraction, au milieu de règles fixes.">
      Un workflow avec une étape IA d’extraction
    </Opt>
    <Opt why="Un assistant répond à des questions ; il ne traite pas un flux de documents entrants.">Un assistant conversationnel</Opt>
    <Opt why="Le volume et la régularité en font un excellent candidat à l’automatisation.">Rien : c’est trop risqué</Opt>
  </QcmPage>
);

// ─── Synthèse M8 ────────────────────────────────────────────────────────────
const M8_Synthese: Page = () => (
  <Frame mod={8} kind="synthese">
    <Title>Ce qu’on retient du module 8</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        Un assistant = <strong>mission, règles, connaissances, comportement, tests</strong>.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        On le teste sur les <strong>cas difficiles</strong> : hors périmètre, sensible, ambigu.
      </SynthRow>
      <SynthRow n={3} tone="violet" d={300}>
        Un agent <strong>planifie, agit avec des outils, observe</strong>, jusqu’à l’objectif.
      </SynthRow>
      <SynthRow n={4} tone="teal" d={400}>
        Chemin connu → <strong>workflow</strong> ; chemin variable → <strong>agent</strong>, encadré.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Autonomie limitée, <strong>outils en lecture</strong>, validation avant toute action externe.
      </SynthRow>
    </div>
    <ProjectCard mod={8}>
      Si une <strong>conversation</strong> est utile dans votre processus, son assistant est conçu : mission, règles, connaissances, niveau d’autonomie, tests.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M8_Section, M8_Versus, M8_Briques, M8_Instructions, M8_Tester, M8_Ou, M8_Agent, M8_Compare, M8_Formule, M8_Autonomie, M8_Atelier, M8_Fiches, M8_Qcm, M8_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M8 · 14:30

OBJECTIF — Annoncer le module assistants et agents.

DIRE — « Jusqu’ici, c’est vous qui dessiniez chaque étape. Ce module présente deux autres façons d’utiliser l’IA : l’assistant spécialisé, une conversation préparée une fois pour toutes, et l’agent, à qui l’on donne un objectif et des outils, et qui choisit lui-même ses étapes. Les deux sont puissants, et les deux exigent un cadre. »

TRANSITION — « Commençons par l’assistant. »`,
  `⏱ 3 min · ASSISTANT VS CONVERSATION (1 clic)

OBJECTIF — Distinguer assistant spécialisé et conversation classique.

DIRE — « En conversation classique, on réexplique le contexte à chaque fois, les réponses varient, on joint les documents à la main. » Clic. « Un assistant spécialisé a une mission, des règles, une base de connaissances ; il est testé, puis partagé. Exemple : l’assistant congés, qui répond aux salariés à toute heure, cite l’article, et renvoie vers les RH dès que c’est personnel. »

TRANSITION — « Comment le concevoir ? Cinq briques. »`,
  `⏱ 4 min · CINQ BRIQUES (4 clics)

OBJECTIF — Définir mission, règles, connaissances, comportement, et tester.

DIRE — « L’assistant du support d’un éditeur de logiciel. Mission : aider sur les incidents du module facturation. » Clic. « Règles : jamais de geste commercial, toujours le numéro de ticket, escalade si perte de données. » Clic. « Connaissances : guide, FAQ, notes de version, rien d’autre. » Clic. « Comportement : vouvoiement, étapes numérotées, une seule question si l’information manque. » Clic. « Tests : vingt questions dont cinq pièges. Et on itère. »

TRANSITION — « À quoi ressemblent des instructions complètes ? »`,
  `⏱ 3 min · EXEMPLE D’INSTRUCTIONS

OBJECTIF — Montrer des instructions réelles et réutilisables.

DIRE — « Voici les instructions de l’assistant congés, version 2. Trois parties. La mission en une phrase. Les règles : uniquement d’après les documents, citer l’article, dire quand on ne sait pas, orienter les situations personnelles, ne demander aucune donnée personnelle. Le comportement : ton, longueur, et la gestion de l’ambiguïté. Remarquez la version : comme une fiche prompt, un assistant se versionne. »

TRANSITION — « Un assistant se juge sur les cas difficiles. »`,
  `⏱ 4 min · TESTER UN ASSISTANT (simulateur)

OBJECTIF — Tester et améliorer un assistant.

DIRE — « Quatre types de questions. La question standard : réponse courte et sourcée. » Cliquer « Hors périmètre » : « Il reste dans sa mission. » « Situation personnelle » : « Il oriente sans conseiller : c’est la règle la plus importante. » « Question ambiguë » : « Une seule question de clarification, pas un interrogatoire. Si l’un de ces quatre tests échoue, on corrige les règles ou les connaissances, et on reteste. »

TRANSITION — « Où créer un tel assistant ? »`,
  `⏱ 3 min · OÙ CRÉER UN ASSISTANT

OBJECTIF — Situer les principales offres sans parti pris.

DIRE — « Chaque grand assistant a sa version : les GPTs de ChatGPT, les Projets de Claude, les Gems de Gemini, les agents de Microsoft 365 Copilot et Copilot Studio, les agents du Chat de Mistral, et les plateformes no-code qui ajoutent des agents à leurs scénarios. Les briques sont les mêmes partout. Le critère décisif : l’outil et la licence validés par votre entreprise, car c’est ce qui décide où vont vos documents. »

NUANCE — Les noms et les fonctionnalités changent vite : vérifier l’offre disponible dans votre entreprise.

TRANSITION — « Passons aux agents. »`,
  `⏱ 5 min · QU’EST-CE QU’UN AGENT (pas à pas)

OBJECTIF — Comprendre le fonctionnement d’un agent IA.

DIRE — « Un objectif : préparer mon rendez-vous de demain avec Altea. Je n’ai pas dessiné les étapes : l’agent planifie. » Cliquer « Étape suivante » en commentant : « Il planifie quatre sous-tâches. Il agit : outil CRM. Il observe le résultat. Il agit encore : messagerie. Il observe : elle hésite entre présentiel et distanciel. Recherche web. Observation. Et le résultat : une note d’une page… et avant d’envoyer l’invitation, il demande une validation. C’est la boucle à gauche : planifier, agir, observer, recommencer jusqu’au but. »

TRANSITION — « En quoi est-ce différent de tout ce qu’on a vu ? »`,
  `⏱ 4 min · CHATBOT, ASSISTANT, WORKFLOW, AGENT

OBJECTIF — Différencier chatbot, assistant, workflow et agent.

DIRE — « La vraie question : qui choisit les étapes ? Le chatbot suit un arbre écrit d’avance. L’assistant suit l’utilisateur, question après question. Le workflow suit le concepteur, une fois pour toutes. L’agent choisit lui-même selon l’objectif. Conséquence sur la prévisibilité : élevée pour le workflow, variable pour l’agent. D’où la règle : si vous savez dessiner les étapes, faites un workflow. »

TRANSITION — « De quoi est fait un agent ? »`,
  `⏱ 3 min · LA FORMULE DE L’AGENT

OBJECTIF — Retenir : agent = modèle + instructions + outils + données.

DIRE — « Le modèle raisonne. Les instructions cadrent. Les outils permettent d’agir. Les données donnent le contexte. Et la cinquième pièce, indispensable : les garde-fous. Outils en lecture seule par défaut, validation avant toute action externe, plafonds, journal. Pour aller plus loin, retenez le sigle MCP : un protocole standard pour brancher outils et données sur un agent. »

TRANSITION — « Jusqu’où laisser l’agent agir seul ? »`,
  `⏱ 4 min · AUTONOMIE ET RISQUES (curseur)

OBJECTIF — Connaître les limites et risques des agents autonomes, et l’importance du contrôle humain.

DIRE — Déplacer le curseur de 1 à 5. « Suggérer, préparer, agir avec validation, agir puis rendre compte, agir seul. En entreprise, on vise les niveaux 1 à 3 ; le niveau 4 sur un périmètre étroit et réversible ; le niveau 5, jamais vers l’extérieur. » Puis les risques à droite : « L’erreur en cascade. Les instructions cachées dans un email ou une page web, qu’on appelle injection de prompt. Les droits trop larges. Et les coûts imprévisibles. »

TRANSITION — « Atelier 8. »`,
  `⏱ 35 min · ATELIER 8 · ASSISTANT OU AGENT (minuteur)

OBJECTIF — Concevoir le fonctionnement d’un assistant ou d’un agent spécialisé.

CONSIGNE À DIRE — « En binôme, choisissez un assistant : commercial, RH, administratif, support ou documentaire, ou celui de votre fil rouge. Rédigez les instructions, listez connaissances et outils, fixez le niveau d’autonomie et justifiez-le. Puis votre binôme joue l’utilisateur piégeur avec les quatre types de tests. »

ANIMATION — Si l’entreprise dispose d’un outil d’assistants, faire créer l’assistant pour de vrai. Sinon, la fiche suffit.

DÉBRIEF — Un binôme lit ses règles ; un autre raconte le test qui a cassé son assistant.`,
  `⏱ (pendant l’atelier) · CINQ ASSISTANTS

OBJECTIF — Fournir des fiches de départ pour les cinq exemples du programme.

DIRE — « Cinq fiches de départ. Remarquez que le niveau d’autonomie varie : 1 pour l’assistant RH, qui ne fait que répondre ; 4 pour le tri administratif, mais sur un seul dossier et sans suppression. »`,
  `⏱ 3 min · QCM 8

OBJECTIF — Vérifier la règle de choix entre agent et workflow.

DIRE — Lire, faire voter, cliquer. « Les étapes sont toujours les mêmes : workflow. L’agent n’apporte que de la variabilité et du coût. »

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE M8

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Cinq briques pour un assistant. Des tests sur les cas difficiles. Un agent planifie, agit, observe. Chemin connu : workflow ; chemin variable : agent encadré. Autonomie limitée et validation avant l’action externe. Côté projet : si une conversation est utile dans votre processus, son assistant est conçu. »

TRANSITION — « Pause. Dernier module : sécurité, fiabilité et gouvernance. »`,
];
// @@NOTES-END
