// ─── Module 5 · Créer ses premières automatisations no-code ─────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Premières
        <br />
        automatisations no-code
      </>
    }
    sub="Make, Power Automate, Zapier : même logique, vocabulaires différents. On construit un premier scénario qui tourne."
    dur="9:20 – 11:00 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 5 · formulaire → tableur → IA → notification
      </Tag>
    }
  >
    <SecItem n={1}>Le principe d’une plateforme d’automatisation</SecItem>
    <SecItem n={2}>Make, Power Automate, Zapier : lequel choisir ?</SecItem>
    <SecItem n={3}>Déclencheur, action, module, données, variables, filtres</SecItem>
    <SecItem n={4}>Brancher une étape IA dans un scénario</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Le principe : un chef d’orchestre dans le cloud ────────────────────────
const M5App = ({ x, y, icon, tone, label, d }: { x: number; y: number; icon: IconName; tone: Tone; label: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 60, top: y - 50, width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={70} solid style={{ boxShadow: SHADOW_SM }} />
    <span style={{ fontSize: 19, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);

const M5_Principe: Page = () => (
  <Frame mod={5}>
    <Title>Le principe : un chef d’orchestre dans le cloud</Title>
    <Lede>La plateforme écoute vos applications, exécute les étapes et transporte les données, même ordinateur éteint.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M1340 580 L1340 330 M1340 580 L1560 410 M1340 580 L1600 640 M1340 580 L1500 840 M1340 580 L1180 840 M1340 580 L1080 640 M1340 580 L1120 410" stroke={C.rule} strokeWidth={3} strokeDasharray="6 8" className={A.march} />
      <FlowDot path="M1120 410 L1340 580 L1560 410" dur={2.6} r={8} color={C.electric} />
      <FlowDot path="M1080 640 L1340 580 L1600 640" dur={3.1} begin={0.8} r={8} color={C.violet} />
      <FlowDot path="M1340 330 L1340 580 L1500 840" dur={2.8} begin={1.4} r={8} color={C.green} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 1240, top: 500, width: 200, height: 160, borderRadius: 30, background: G.navy, boxShadow: '0 24px 50px -20px rgba(11,31,92,.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, ...dl(100) }}>
      <FlowMark h={34} color="#FFFFFF" accent={C.pink} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 19, color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>Plateforme
        <br />
        d’automatisation</span>
    </div>
    <M5App x={1340} y={320} icon="form" tone="violet" label="Formulaire" d={300} />
    <M5App x={1560} y={400} icon="table" tone="green" label="Tableur" d={380} />
    <M5App x={1600} y={640} icon="users" tone="blue" label="CRM" d={460} />
    <M5App x={1500} y={850} icon="mail" tone="coral" label="Email" d={540} />
    <M5App x={1180} y={850} icon="chat" tone="teal" label="Teams / Slack" d={620} />
    <M5App x={1080} y={640} icon="folder" tone="yellow" label="Stockage" d={700} />
    <M5App x={1120} y={400} icon="sparkles" tone="pink" label="IA" d={780} />
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="blue" icon="eye" title="Elle écoute" cls={A.left} style={dl(200)} size={23}>
        Un événement survient dans une application : c’est le <strong>déclencheur</strong>.
      </Card>
      <Card tone="green" icon="gear" title="Elle exécute" cls={A.left} style={dl(320)} size={23}>
        Elle enchaîne des <strong>actions</strong> dans d’autres applications, dans l’ordre prévu.
      </Card>
      <Card tone="violet" icon="route" title="Elle transporte les données" cls={A.left} style={dl(440)} size={23}>
        La sortie d’une étape devient l’entrée de la suivante : c’est le <strong>mappage</strong>.
      </Card>
    </div>
  </Frame>
);

// ─── Trois outils ───────────────────────────────────────────────────────────
const M5Tool = ({ name, tone, icon, voc, plus, when, d }: { name: string; tone: Tone; icon: IconName; voc: string; plus: ReactNode; when: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{name}</div>
    </div>
    <div style={{ fontFamily: mono, fontSize: 19, color: T[tone].fg }}>{voc}</div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>{plus}</div>
    <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start', background: T[tone].bg, borderRadius: 12, padding: '12px 16px', fontSize: 21, lineHeight: 1.4, color: C.ink }}>
      <Icon name="target" size={24} color={T[tone].fg} style={{ marginTop: 2 }} />
      <span>{when}</span>
    </div>
  </div>
);

const M5_Outils: Page = () => (
  <Frame mod={5}>
    <Title>Make, Power Automate, Zapier : lequel choisir ?</Title>
    <Lede>Les trois font la même chose. Le bon choix dépend surtout de votre environnement et de ce que l’entreprise autorise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 540, display: 'flex', gap: 26 }}>
      <M5Tool
        name="Make"
        tone="violet"
        icon="puzzle"
        voc="scénario · module · routeur"
        d={100}
        plus="Éditeur visuel en bulles, très souple pour transformer les données : boucles, agrégations, routeurs multiples."
        when="Flux riches en données, nombreuses applications SaaS."
      />
      <M5Tool
        name="Power Automate"
        tone="blue"
        icon="bolt"
        voc="flux · déclencheur · action"
        d={220}
        plus="Intégré à Microsoft 365 : Outlook, Teams, SharePoint, Excel. Approbations natives, gouvernance par l’informatique."
        when="Entreprise sous Microsoft 365, données qui restent dans le tenant."
      />
      <M5Tool
        name="Zapier"
        tone="coral"
        icon="plug"
        voc="Zap · trigger · action"
        d={340}
        plus="Le plus grand catalogue d’applications et la prise en main la plus rapide. Chemins conditionnels avec Paths."
        when="Démarrer vite, relier des outils grand public ou métiers variés."
      />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 840, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: C.soft, ...dl(700) }}>
      <IconTile name="server" tone="grey" size={44} />
      <span>
        À connaître aussi : <strong style={{ color: C.navy }}>n8n</strong>, open source et auto-hébergeable, apprécié quand les données ne doivent pas quitter l’entreprise. Plus
        technique.
      </span>
    </div>
  </Frame>
);

// ─── Vocabulaire (cartes à retourner) ───────────────────────────────────────
const M5Word = ({ word, icon, tone, def, ex }: { word: string; icon: IconName; tone: Tone; def: string; ex: string }) => (
  <FlipCard
    w={399}
    h={262}
    tone={tone}
    backTone={tone}
    front={
      <>
        <IconTile name={icon} tone={tone} size={56} />
        <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 31, color: C.navy }}>{word}</div>
      </>
    }
    back={
      <>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{word}</div>
        <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.ink }}>{def}</div>
        <div style={{ marginTop: 8, fontSize: 19, lineHeight: 1.35, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
      </>
    }
  />
);

const M5_Vocab: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Les notions essentielles, en huit cartes</Title>
    <Lede>Avant de retourner une carte, demandez à la salle de la définir en une phrase.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 399px)', gap: 28, ...dl(100) }}>
      <M5Word word="Déclencheur" icon="bolt" tone="blue" def="L’événement qui lance le scénario." ex="Nouvelle réponse à un formulaire, email reçu, chaque lundi 8 h." />
      <M5Word word="Action" icon="send" tone="green" def="Ce que le scénario fait dans une application." ex="Créer une ligne, envoyer un email, poster un message." />
      <M5Word word="Module" icon="puzzle" tone="violet" def="Une brique du scénario : déclencheur ou action, liée à une application." ex="« Google Sheets · Ajouter une ligne »." />
      <M5Word word="Données" icon="database" tone="teal" def="Ce que chaque module produit et transmet au suivant." ex="Le nom, l’email et le message du formulaire." />
      <M5Word word="Variables" icon="pen" tone="yellow" def="Une valeur réutilisée plus loin, mappée d’un module à l’autre." ex="{{1.email}} : l’email venu du module 1." />
      <M5Word word="Filtre" icon="filter" tone="coral" def="Une barrière : ne continuer que si une condition est vraie." ex="Seulement si le pays = France." />
      <M5Word word="Condition" icon="split" tone="pink" def="Un embranchement : un chemin si vrai, un autre sinon." ex="Si urgence = 3 → alerte, sinon → file." />
      <M5Word word="Scénario" icon="route" tone="navy" def="L’ensemble : déclencheur + modules + logique. On l’active ou on le coupe." ex="« Qualifier les demandes de devis »." />
    </div>
  </Frame>
);

// ─── Pierre de Rosette ──────────────────────────────────────────────────────
const M5RRow = ({ concept, make, pa, zap, d }: { concept: string; make: string; pa: string; zap: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '360px 1fr 1fr 1fr', gap: 18, alignItems: 'center', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '14px 22px', ...dl(d) }}>
    <span style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>{concept}</span>
    <span style={{ fontSize: 22, color: T.violet.fg }}>{make}</span>
    <span style={{ fontSize: 22, color: T.blue.fg }}>{pa}</span>
    <span style={{ fontSize: 22, color: T.coral.fg }}>{zap}</span>
  </div>
);

const M5_Rosetta: Page = () => (
  <Frame mod={5}>
    <Title>Un même concept, trois noms</Title>
    <Lede>Ce que vous apprenez dans un outil se transpose aux autres. Gardez ce tableau sous la main.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '360px 1fr 1fr 1fr', gap: 18, padding: '0 22px', boxSizing: 'border-box' }}>
      <span />
      <Tag tone="violet" size={22} style={{ justifySelf: 'start' }}>
        Make
      </Tag>
      <Tag tone="blue" size={22} style={{ justifySelf: 'start' }}>
        Power Automate
      </Tag>
      <Tag tone="coral" size={22} style={{ justifySelf: 'start' }}>
        Zapier
      </Tag>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 320, width: 1680, display: 'flex', flexDirection: 'column', gap: 11 }}>
      <M5RRow d={100} concept="Le workflow" make="Scénario" pa="Flux de cloud" zap="Zap" />
      <M5RRow d={170} concept="Ce qui le lance" make="Module déclencheur" pa="Déclencheur" zap="Trigger" />
      <M5RRow d={240} concept="Une étape" make="Module" pa="Action" zap="Action (step)" />
      <M5RRow d={310} concept="Bifurquer" make="Routeur + filtres" pa="Condition, Commutateur" zap="Paths" />
      <M5RRow d={380} concept="Ne continuer que si…" make="Filtre" pa="Condition de déclencheur" zap="Filter" />
      <M5RRow d={450} concept="Traiter une liste" make="Itérateur" pa="Appliquer à chacun" zap="Looping" />
      <M5RRow d={520} concept="Valider par un humain" make="Message avec boutons" pa="Approbations" zap="Human in the Loop" />
      <M5RRow d={590} concept="Ce que l’on paie" make="Opérations / crédits" pa="Licences, connecteurs premium" zap="Tâches" />
    </div>
  </Frame>
);

// ─── Simulateur : exécuter un scénario ──────────────────────────────────────
const M5_MODS = [
  { x: 260, icon: 'form' as IconName, tone: 'violet' as Tone, app: 'Formulaire', act: 'Nouvelle réponse', out: 'nom: "Léa Moreau"\nemail: "lea.moreau@exemple.fr"\ndemande: "Devis : 3 jours de\nformation Excel, 8 pers."' },
  { x: 580, icon: 'table' as IconName, tone: 'green' as Tone, app: 'Tableur', act: 'Ajouter une ligne', out: 'ligne: 57\nstatut: "nouveau"\ndate: "2026-10-13 09:42"' },
  { x: 900, icon: 'sparkles' as IconName, tone: 'pink' as Tone, app: 'IA', act: 'Générer une réponse', out: 'texte: \'{"type": "devis",\n "theme": "Excel",\n "participants": 8,\n "jours": 3}\'' },
  { x: 1220, icon: 'database' as IconName, tone: 'teal' as Tone, app: 'JSON', act: 'Analyser le JSON', out: 'type: "devis"\ntheme: "Excel"\nparticipants: 8\njours: 3' },
  { x: 1540, icon: 'chat' as IconName, tone: 'blue' as Tone, app: 'Teams', act: 'Publier un message', out: 'canal: "Ventes"\nmessage: "Devis Excel · 8 pers.\n· 3 j → ligne 57"\nstatut: envoyé' },
];

const M5Mod = ({ i, step, sel, pick }: { i: number; step: number; sel: boolean; pick: () => void }) => {
  const m = M5_MODS[i];
  const done = step > i;
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        pick();
      }}
      style={{ position: 'absolute', left: m.x - 80, top: 300, width: 160, border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: body }}
    >
      <span style={{ position: 'relative', width: 130, height: 130, borderRadius: 999, background: STRONG[m.tone], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: sel ? `0 0 0 6px #fff, 0 0 0 10px ${STRONG[m.tone]}` : '0 14px 30px -14px rgba(11,31,92,.6)', transition: `box-shadow 300ms ${EASE}` }}>
        <Icon name={m.icon} size={60} color="#fff" />
        {done ? (
          <span className={A.pop} style={{ position: 'absolute', right: -6, top: -6, width: 42, height: 42, borderRadius: 999, background: C.ink, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', animationDuration: '400ms' } as CSSProperties}>
            1
          </span>
        ) : null}
      </span>
      <span style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{m.app}</span>
      <span style={{ fontSize: 19, color: C.muted }}>{m.act}</span>
    </button>
  );
};

const M5_Simu: Page = () => {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(false);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (step >= M5_MODS.length) {
      setRun(false);
      return;
    }
    const h = window.setTimeout(() => {
      setStep((s) => s + 1);
      setSel(step);
    }, 900);
    return () => window.clearTimeout(h);
  }, [run, step]);
  const start = () => {
    setStep(0);
    setSel(0);
    setRun(true);
  };
  const m = M5_MODS[sel];
  const dotX = M5_MODS[Math.min(Math.max(step - 1, 0), M5_MODS.length - 1)].x;
  return (
    <Frame mod={5} kind="simu">
      <Title>Simulateur : exécuter un scénario une fois</Title>
      <Lede>Cliquez « Exécuter une fois », puis cliquez une bulle pour voir les données qu’elle a produites.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Btn icon="play" size={22} disabled={run} onClick={start}>
          Exécuter une fois
        </Btn>
        <Tag tone={step >= M5_MODS.length ? 'green' : 'grey'} size={21}>
          {step >= M5_MODS.length ? '✓ Exécution réussie' : run ? 'En cours…' : 'Prêt'} · {step} opération{step > 1 ? 's' : ''}
        </Tag>
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
        <path d="M260 365 H 1540" stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
        <path d={`M260 365 H ${dotX}`} stroke={C.electric} strokeWidth={8} strokeLinecap="round" style={{ transition: `all 800ms ${EASE}` }} />
      </svg>
      <M5Mod i={0} step={step} sel={sel === 0} pick={() => setSel(0)} />
      <M5Mod i={1} step={step} sel={sel === 1} pick={() => setSel(1)} />
      <M5Mod i={2} step={step} sel={sel === 2} pick={() => setSel(2)} />
      <M5Mod i={3} step={step} sel={sel === 3} pick={() => setSel(3)} />
      <M5Mod i={4} step={step} sel={sel === 4} pick={() => setSel(4)} />
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1000, ...dl(200) }}>
        <CodeDark file={`${sel + 1}. ${m.app} · ${m.act} · sortie (bundle)`} size={22} wrap style={{ minHeight: 300 }}>
          {step > sel ? (
            <div key={sel} className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
              {m.out}
            </div>
          ) : (
            <span style={{ color: '#7C86A8' }}>Pas encore exécuté.</span>
          )}
        </CodeDark>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1180, top: 560, width: 620, display: 'flex', flexDirection: 'column', gap: 16, ...dl(300) }}>
        <Callout title="Le bundle" tone="teal" icon="database" size={22}>
          Chaque bulle produit un paquet de données. Les modules suivants y piochent leurs variables.
        </Callout>
        <Callout title="L’opération" tone="yellow" icon="money" size={22}>
          Chaque module exécuté compte une opération (ou une tâche) : c’est ce que l’on paie.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Types de déclencheurs ──────────────────────────────────────────────────
const M5Trig = ({ icon, tone, title, how, ex, d }: { icon: IconName; tone: Tone; title: string; how: string; ex: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '24px 26px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} solid />
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.42, color: C.soft }}>{how}</div>
    <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.4, color: T[tone].fg, fontStyle: 'italic' }}>{ex}</div>
  </div>
);

const M5_Declencheurs: Page = () => (
  <Frame mod={5}>
    <Title>Quatre façons de déclencher un scénario</Title>
    <Lede>Le choix du déclencheur fixe le délai de réaction… et une partie de la facture.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <M5Trig icon="bolt" tone="blue" title="Instantané" how="L’application prévient la plateforme dès que l’événement a lieu (webhook)." ex="Un formulaire envoyé déclenche le scénario en une seconde." d={100} />
      <M5Trig icon="loop" tone="teal" title="Par surveillance" how="La plateforme vérifie à intervalle régulier s’il y a du nouveau." ex="Toutes les 15 minutes : y a-t-il un nouvel email ?" d={220} />
      <M5Trig icon="calendar" tone="violet" title="Planifié" how="À heure fixe, qu’il y ait du nouveau ou non." ex="Chaque lundi 8 h : rapport de la semaine passée." d={340} />
      <M5Trig icon="pointer" tone="green" title="Manuel" how="Une personne clique sur un bouton pour lancer le flux." ex="« Préparer le dossier client » depuis Teams ou mobile." d={460} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(700) }}>
      <Callout title="Attention" tone="yellow" icon="alert" size={24}>
        Une surveillance toutes les minutes consomme des opérations même quand il ne se passe rien. Préférez l’instantané quand l’application le permet.
      </Callout>
    </div>
  </Frame>
);

// ─── Brancher une étape IA ──────────────────────────────────────────────────
const M5Pill = ({ children, tone = 'violet' }: { children: ReactNode; tone?: Tone }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 999, background: STRONG[tone], color: '#fff', fontSize: 19, fontWeight: 600, margin: '0 3px' }}>{children}</span>
);

const M5Cfg = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.rule}` }}>
    <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{label}</span>
    <div style={{ fontSize: 21, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M5_ModuleIA: Page = () => (
  <Frame mod={5}>
    <Title>Brancher l’IA dans un scénario</Title>
    <Lede>Le prompt de l’atelier 2 devient un module. Les variables sont des pastilles mappées depuis les modules précédents.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 32px', borderTop: `7px solid ${C.pink}` }}>
      <PanelTitle icon="sparkles" c={T.pink.fg}>
        3 · IA · Générer une réponse
      </PanelTitle>
      <M5Cfg label="Connexion">
        <Tag tone="green" size={19}>
          <Icon name="checkCircle" size={20} /> Compte IA de l’entreprise
        </Tag>
      </M5Cfg>
      <M5Cfg label="Modèle">Celui validé par l’entreprise</M5Cfg>
      <M5Cfg label="Instructions">Tu qualifies les demandes de formation… (prompt de l’atelier 2, fixe)</M5Cfg>
      <M5Cfg label="Message">
        Demandeur : <M5Pill tone="violet">1. nom</M5Pill> · Demande : <M5Pill tone="violet">1. demande</M5Pill> · Ligne <M5Pill tone="green">2. ligne</M5Pill>
      </M5Cfg>
      <M5Cfg label="Format de sortie">
        <span style={{ fontFamily: mono }}>JSON</span> · température 0,2
      </M5Cfg>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="pen" title="Pastilles = variables" cls={A.right} style={dl(200)} size={22}>
        On ne tape pas les données : on glisse les sorties des modules précédents.
      </Card>
      <Card tone="coral" icon="key" title="La clé est un secret" cls={A.right} style={dl(320)} size={22}>
        Connexion par compte de service, jamais de clé collée dans un prompt.
      </Card>
      <Card tone="yellow" icon="money" title="Chaque appel coûte" cls={A.right} style={dl(440)} size={22}>
        Placez un filtre avant l’IA : n’appelez le modèle que si c’est utile.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 935, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="puzzle" size={24} color={C.electric} />
      Modules IA intégrés : AI Builder et Copilot (Power Automate), AI by Zapier, Make AI Tools, ou connecteurs directs vers les fournisseurs de modèles.
    </div>
  </Frame>
);

// ─── Atelier 5 ──────────────────────────────────────────────────────────────
const M5_Atelier: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="Votre première automatisation"
    defi="nocode"
    who="En binôme, un seul outil"
    minutes={45}
    where={
      <>
        Un <strong>scénario actif</strong> dans votre outil, une <strong>capture</strong> de l’historique d’exécution, et la ligne du tableur complétée par l’IA.
      </>
    }
    objective={
      <>
        Construire <strong>Formulaire → tableur → IA → notification</strong> : chaque réponse au formulaire est enregistrée, qualifiée par l’IA, et le bon interlocuteur est
        prévenu.
      </>
    }
    crit={
      <>
        <CheckItem id="a5c1" size={22}>Le déclencheur réagit à une vraie réponse</CheckItem>
        <CheckItem id="a5c2" size={22}>La ligne contient le résultat de l’IA</CheckItem>
        <CheckItem id="a5c3" size={22}>La notification reprend 2 variables</CheckItem>
        <CheckItem id="a5c4" size={22}>3 exécutions réussies, dont 1 cas piège</CheckItem>
      </>
    }
  >
    <div>1. Suivez le pas-à-pas de la page suivante, étape par étape.</div>
    <div>2. Testez chaque module dès qu’il est ajouté : n’attendez pas la fin.</div>
    <div>3. Réutilisez un prompt de l’atelier 2, avec sortie JSON.</div>
    <div>4. Envoyez trois réponses de test, dont une incomplète.</div>
    <Bonus>Remplacez le formulaire par votre propre déclencheur : celui de votre processus fil rouge.</Bonus>
  </LabPage>
);

const M5_PasAPas: Page = () => (
  <Frame mod={5} kind="lab">
    <Title>Atelier 5 · Le pas-à-pas</Title>
    <Lede>Cochez au fur et à mesure. Bloqué plus de 5 minutes sur une étape ? Levez la main.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 11 }}>
        <CheckItem id="pp1" size={24}>1 · Créer le formulaire : nom, email, demande (texte libre)</CheckItem>
        <CheckItem id="pp2" size={24}>2 · Créer le tableur : nom, email, demande, type, urgence, résumé</CheckItem>
        <CheckItem id="pp3" size={24}>3 · Nouveau scénario, déclencheur « nouvelle réponse »</CheckItem>
        <CheckItem id="pp4" size={24}>4 · Envoyer une réponse de test et récupérer les données</CheckItem>
        <CheckItem id="pp5" size={24}>5 · Action « ajouter une ligne », mapper les 3 champs</CheckItem>
        <CheckItem id="pp6" size={24}>6 · Module IA : prompt de l’atelier 2, variables, sortie JSON</CheckItem>
        <CheckItem id="pp7" size={24}>7 · Analyser le JSON, mettre à jour la ligne (type, urgence…)</CheckItem>
        <CheckItem id="pp8" size={24}>8 · Notification email ou Teams, puis activer et tester 3 cas</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Timer id="atelier-5-pas" minutes={45} label="Atelier 5" cls={A.right} style={{ width: 540, ...dl(200) }} />
        <CheckScore
          max={8}
          label="Avancement"
          style={dl(300)}
          levels={[
            { min: 0, text: 'On démarre.', tone: 'grey' },
            { min: 3, text: 'Les données circulent.', tone: 'blue' },
            { min: 6, text: 'L’IA est branchée.', tone: 'violet' },
            { min: 8, text: 'Ça tourne : bravo !', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── Pièges du débutant (cartes à retourner) ────────────────────────────────
const M5Trap = ({ sym, cause, fix }: { sym: string; cause: string; fix: string }) => (
  <FlipCard
    w={536}
    h={250}
    tone="coral"
    backTone="green"
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="bug" size={32} color={C.coral} />
          <Eyebrow c={T.coral.fg} size={18}>
            Symptôme
          </Eyebrow>
        </div>
        <div style={{ marginTop: 12, fontSize: 27, fontWeight: 700, lineHeight: 1.3, color: C.navy }}>{sym}</div>
      </>
    }
    back={
      <>
        <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>
          <strong style={{ color: C.ink }}>Cause :</strong> {cause}
        </div>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.4, color: C.ink }}>
          <strong style={{ color: T.green.fg }}>Remède :</strong> {fix}
        </div>
      </>
    }
  />
);

const M5_Pieges: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Six pièges du débutant : diagnostiquez !</Title>
    <Lede>Lisez le symptôme, proposez une cause, puis retournez la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M5Trap sym="Le scénario ne fait rien" cause="il n’a jamais été activé, ou le déclencheur surveille le mauvais dossier." fix="vérifier l’état « actif » et l’historique d’exécution." />
      <M5Trap sym="Les champs arrivent vides" cause="le test a été fait avec une réponse vide, le mappage pointe dans le vide." fix="tester avec une vraie réponse complète, puis refaire le mappage." />
      <M5Trap sym="Des centaines d’exécutions en une heure" cause="une boucle : le scénario écrit dans la feuille qui le déclenche." fix="séparer source et destination, ou filtrer sur un statut." />
      <M5Trap sym="Ça marchait hier, plus aujourd’hui" cause="une connexion a expiré, ou un champ du formulaire a été renommé." fix="reconnecter le compte, mettre à jour le mappage, activer les alertes." />
      <M5Trap sym="L’étape suivante ne lit pas la réponse IA" cause="l’IA a ajouté du texte autour du JSON." fix="« uniquement du JSON », et un module « analyser le JSON »." />
      <M5Trap sym="Le quota est épuisé le 10 du mois" cause="une surveillance à la minute, ou l’IA appelée pour tout." fix="déclencheur instantané, filtre avant l’IA." />
    </div>
  </Frame>
);

// ─── Synthèse M5 ────────────────────────────────────────────────────────────
const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Ce qu’on retient du module 5</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="green" d={100}>
        Une plateforme <strong>écoute, exécute et transporte</strong> les données, dans le cloud.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Make, Power Automate, Zapier : <strong>même logique</strong>, on choisit selon l’environnement.
      </SynthRow>
      <SynthRow n={3} tone="blue" d={300}>
        Déclencheur, action, module, données, variables, filtres, conditions, <strong>scénario</strong>.
      </SynthRow>
      <SynthRow n={4} tone="pink" d={400}>
        L’IA est <strong>un module comme un autre</strong> : prompt fixe, variables mappées, sortie JSON.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        On <strong>teste chaque module</strong> dès qu’il est ajouté, avec de vraies données de test.
      </SynthRow>
    </div>
    <ProjectCard mod={5}>
      Votre processus a son <strong>premier scénario</strong> : un déclencheur réel, une étape IA et une action. Il tourne.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Principe, M5_Outils, M5_Vocab, M5_Rosetta, M5_Simu, M5_Declencheurs, M5_ModuleIA, M5_Atelier, M5_PasAPas, M5_Pieges, M5_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M5 · 9:20

OBJECTIF — Annoncer le passage à l’outil.

DIRE — « Module 5 : on ouvre l’outil. Make, Power Automate ou Zapier : même logique, vocabulaires différents. Objectif de la matinée : que chacun reparte de ce module avec un scénario qui tourne, du formulaire jusqu’à la notification, avec une étape IA au milieu. »

TRANSITION — « D’abord, comment ça marche. »`,
  `⏱ 3 min · LE PRINCIPE

OBJECTIF — Découvrir le principe d’une plateforme d’automatisation.

DIRE — « Une plateforme d’automatisation est un chef d’orchestre dans le cloud. Elle écoute : un événement dans une application, c’est le déclencheur. Elle exécute : des actions dans d’autres applications, dans l’ordre. Et elle transporte les données : la sortie d’une étape devient l’entrée de la suivante. Tout cela tourne sur les serveurs de l’éditeur, même quand votre ordinateur est éteint. »

INSISTER — Conséquence : vos données transitent par la plateforme. On y reviendra au module 9.

TRANSITION — « Quelle plateforme choisir ? »`,
  `⏱ 4 min · TROIS OUTILS

OBJECTIF — Présenter Make, Power Automate et Zapier.

DIRE — « Make : un éditeur visuel en bulles, très souple pour manipuler des données. Power Automate : intégré à Microsoft 365, idéal si votre entreprise y vit déjà, avec des approbations natives et une gouvernance par la DSI. Zapier : le plus grand catalogue d’applications et la prise en main la plus rapide. Et n8n, open source et auto-hébergeable, quand les données ne doivent pas quitter l’entreprise. Le bon choix ? Très souvent, celui que votre informatique autorise. »

ANIMATION — Demander à ceux qui ont testé un outil (sondage d’hier) un retour en une phrase.

TRANSITION — « Le vocabulaire commun. »`,
  `⏱ 5 min · HUIT NOTIONS (cartes à retourner)

OBJECTIF — Maîtriser les notions : déclencheur, action, module, données, variables, filtres, conditions, scénarios.

DIRE — « Avant de retourner chaque carte, je vous demande une définition en une phrase. » Retourner au fil des réponses. Insister sur la différence entre filtre et condition : « Le filtre est une barrière : on continue ou on s’arrête. La condition est un embranchement : un chemin ou l’autre. »

TRANSITION — « Ces notions portent des noms différents selon l’outil. »`,
  `⏱ 3 min · PIERRE DE ROSETTE

OBJECTIF — Faire le lien entre les vocabulaires des trois outils.

DIRE — « Ce tableau est votre traducteur. Un scénario Make, un flux Power Automate, un Zap : c’est la même chose. Un routeur, une condition ou un commutateur, des Paths. Et la dernière ligne, importante : ce que l’on paie. Opérations ou crédits chez Make, tâches chez Zapier, licences et connecteurs premium chez Microsoft. »

NUANCE — Les noms et les modèles de prix évoluent : vérifier dans l’outil le jour J.

TRANSITION — « Voyons une exécution au ralenti. »`,
  `⏱ 4 min · SIMULATEUR D’EXÉCUTION

OBJECTIF — Visualiser la circulation des données et la notion d’opération.

DIRE — « Cinq modules : formulaire, tableur, IA, analyse du JSON, Teams. Je clique sur “Exécuter une fois”. » Laisser tourner. « Chaque bulle s’allume, un badge “1” apparaît : une opération. » Cliquer la bulle IA : « L’IA renvoie du texte… qui contient du JSON. » Cliquer JSON : « Le module suivant le transforme en vrais champs. » Cliquer Teams : « Et le message reprend ces champs. Cinq modules exécutés, cinq opérations. »

INSISTER — Le « bundle » est ce que vous verrez dans l’historique de votre outil : c’est votre premier réflexe de débogage.

TRANSITION — « Revenons sur le premier module : le déclencheur. »`,
  `⏱ 3 min · TYPES DE DÉCLENCHEURS

OBJECTIF — Distinguer les déclencheurs instantanés, par surveillance, planifiés et manuels.

DIRE — « Instantané : l’application prévient la plateforme, en une seconde. Par surveillance : la plateforme vérifie régulièrement, par exemple toutes les 15 minutes. Planifié : à heure fixe. Manuel : un bouton. Attention à la surveillance à la minute : elle consomme même quand il ne se passe rien. »

TRANSITION — « Et l’IA, comment la brancher ? »`,
  `⏱ 4 min · BRANCHER L’IA

OBJECTIF — Intégrer une étape IA dans un scénario.

DIRE — « Voici la configuration type d’un module IA. Une connexion, celle validée par l’entreprise. Les instructions : le prompt de l’atelier 2, fixe. Le message : des pastilles, qui sont les variables des modules précédents. Le format : JSON, température basse pour la stabilité. Trois règles à droite : on mappe au lieu de taper ; la clé d’API est un secret ; chaque appel coûte, donc un filtre avant l’IA. »

TRANSITION — « À vous : atelier 5. »`,
  `⏱ 45 min · ATELIER 5 · PREMIÈRE AUTOMATISATION (minuteur)

OBJECTIF — Construire une première automatisation simple : formulaire → tableur → IA → notification.

CONSIGNE À DIRE — « En binôme, sur un seul outil. Suivez le pas-à-pas de la page suivante. Le conseil le plus important : testez chaque module dès qu’il est ajouté. Vous avez réussi quand trois réponses de test, dont une incomplète, ont produit trois lignes complétées et trois notifications. »

ANIMATION — Afficher la page pas-à-pas. Faire la démonstration des étapes 3 à 5 en direct dans l’outil le plus représenté. Passer dans les rangs : les blocages fréquents sont l’authentification et le mappage.

DÉBRIEF — Un binôme projette son historique d’exécution.`,
  `⏱ (pendant l’atelier) · PAS-À-PAS

OBJECTIF — Guider la construction en 8 étapes vérifiables.

DIRE — « Huit étapes, cochez au fur et à mesure. La jauge à droite vous dit où vous en êtes. Bloqué plus de cinq minutes : levez la main. »

ANIMATION — Laisser le minuteur visible. À mi-parcours, faire un point collectif : « Qui a passé l’étape 5 ? »`,
  `⏱ 5 min · PIÈGES DU DÉBUTANT (cartes)

OBJECTIF — Savoir diagnostiquer les erreurs les plus fréquentes.

DIRE — « Six symptômes que vous avez peut-être rencontrés pendant l’atelier. Proposez une cause, puis on retourne. » Insister sur la boucle infinie : « Un scénario qui écrit dans la feuille qui le déclenche se relance lui-même : des centaines d’exécutions en une heure, et le quota part en fumée. »

TRANSITION — « Synthèse du module 5. »`,
  `⏱ 2 min · SYNTHÈSE M5

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Une plateforme écoute, exécute, transporte. Trois outils, même logique. Huit notions. L’IA est un module comme un autre. On teste chaque module. Côté projet : votre processus a un premier scénario qui tourne. »

TRANSITION — « Pause. Ensuite : conditions et logique. »`,
];
// @@NOTES-END
