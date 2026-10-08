// ═══ Module 9 — Plan de déploiement ═════════════════════════════════════════

// ─── M9 divider ─────────────────────────────────────────────────────────────
const M910_M9Divider: Page = () => (
  <Section n={9} title="Plan de déploiement" sub="Du prototype qui impressionne… au service qui tient la route." dur="≈ 30 min">
    <SecItem n={1}>Prototype → pilote → production</SecItem>
    <SecItem n={2}>La checklist go/no-go</SecItem>
    <SecItem n={3}>Infrastructure, clés et coûts</SecItem>
    <SecItem n={4}>Gestion du changement</SecItem>
  </Section>
);
M910_M9Divider.transition = BLOOM;

// ─── Prototype → Pilote → Production ────────────────────────────────────────
const M910StageRow = ({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <Icon name={icon} size={28} color={C.muted} style={{ marginTop: 4 }} />
    <div>
      <Eyebrow c={C.muted} size={20}>
        {label}
      </Eyebrow>
      <div style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M910Stage = ({
  x,
  tone,
  icon,
  name,
  dur,
  beat,
  pop,
  goal,
  gate,
  gateLabel = 'Critère de passage',
}: {
  x: number;
  tone: Tone;
  icon: IconName;
  name: string;
  dur: string;
  beat: number;
  pop: ReactNode;
  goal: ReactNode;
  gate: ReactNode;
  gateLabel?: string;
}) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x, top: 372, width: 500 }}>
    <div
      style={{
        boxSizing: 'border-box',
        padding: '26px 28px', height: 512, display: 'flex', flexDirection: 'column',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <IconTile name={icon} tone={tone} size={64} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 42, lineHeight: 1.05, color: C.ink }}>{name}</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: T[tone].fg }}>{dur}</div>
        </div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M910StageRow icon="users" label="Population">
          {pop}
        </M910StageRow>
        <M910StageRow icon="target" label="Objectif">
          {goal}
        </M910StageRow>
      </div>
      <div style={{ marginTop: 'auto', padding: '14px 18px', borderRadius: 12, background: T.green.bg, boxShadow: `inset 0 0 0 1.5px ${T.green.bd}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="shieldCheck" size={24} color={T.green.fg} />
          <Eyebrow c={T.green.fg} size={20}>
            {gateLabel}
          </Eyebrow>
        </div>
        <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.ink }}>{gate}</div>
      </div>
    </div>
  </div>
);

const M910StageNode = ({ cx: x, n, tone, d }: { cx: number; n: number; tone: Tone; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 30, top: 270, ...dl(d) }}>
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 999,
        background: STRONG[tone],
        boxShadow: '0 0 0 6px #fff, 0 10px 24px -12px rgba(20,60,100,.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 32,
        color: '#fff',
      }}
    >
      {n}
    </div>
  </div>
);

const M910Gate = ({ cx: x, beat }: { cx: number; beat: number }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x - 60, top: 276, width: 120 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          background: C.green,
          boxShadow: '0 0 0 5px #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="check" size={28} color="#fff" sw={3} />
      </div>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', color: T.green.fg, whiteSpace: 'nowrap' }}>
        GO / NO-GO
      </span>
    </div>
  </div>
);

const M910_Stages: Page = () => (
  <Frame mod={9} beats={6}>
    <Title>Prototype → Pilote → Production</Title>
    <Lede>Trois jalons, trois populations… et des critères de passage fixés avant de commencer.</Lede>
    {/* Track */}
    <div className={A.grow} style={{ position: 'absolute', left: 370, top: 297, width: 1180, height: 6, borderRadius: 3, background: C.rule }} />
    <div className={b.grow(2)} style={{ position: 'absolute', left: 370, top: 297, width: 590, height: 6, borderRadius: 3, background: G.blue }} />
    <div className={b.grow(4)} style={{ position: 'absolute', left: 960, top: 297, width: 590, height: 6, borderRadius: 3, background: G.green }} />
    <M910StageNode cx={370} n={1} tone="blue" d={150} />
    <M910StageNode cx={960} n={2} tone="teal" d={300} />
    <M910StageNode cx={1550} n={3} tone="green" d={450} />
    <M910Gate cx={665} beat={2} />
    <M910Gate cx={1255} beat={4} />
    <M910Stage
      x={120}
      tone="blue"
      icon="puzzle"
      name="Prototype"
      dur="2 à 4 semaines"
      beat={1}
      pop="Équipe projet et 3 à 5 utilisateurs-clés"
      goal="Prouver la faisabilité sur des cas réels"
      gate="≥ 85 % d’exactitude sur le jeu de test, garde-fous éprouvés"
    />
    <M910Stage
      x={710}
      tone="teal"
      icon="eye"
      name="Pilote"
      dur="4 à 8 semaines"
      beat={3}
      pop="Une vraie équipe : 10 agents du service client"
      goal="Prouver la valeur, avec un humain dans la boucle"
      gate="Gain mesuré vs la référence, satisfaction ≥ 4/5, zéro incident grave"
    />
    <M910Stage
      x={1300}
      tone="green"
      icon="rocket"
      name="Production"
      dur="Par vagues : 10 % → 50 % → 100 %"
      beat={5}
      pop="Tous les utilisateurs visés, équipe par équipe"
      goal="Tenir dans la durée, à coût maîtrisé"
      gateLabel="Critère de maintien"
      gate="KPI suivis chaque semaine, retour arrière testé, responsable nommé"
    />
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 908, width: 1680 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 27, color: C.ink }}>
        <Icon name="flag" size={32} color={C.coral} />
        <span>
          <Strong c={C.coral}>Règle d’or :</Strong> chaque passage est une décision explicite du parrain métier, sur des critères écrits d’avance.
        </span>
      </div>
    </div>
  </Frame>
);

// ─── Checklist go/no-go ─────────────────────────────────────────────────────
const M910_GoNoGo: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Checklist go/no-go : prêt pour le pilote ?</Title>
    <Lede>Cochez ce qui est vrai pour le prototype de tri des courriels conçu à l’atelier.</Lede>
    <Checklist style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <div className={A.in} style={{ width: 1060, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CheckItem id="m910-exact" w={2} size={26}>
          Exactitude ≥ 85 % sur un jeu de test doré de 100 cas réels
        </CheckItem>
        <CheckItem id="m910-guard" w={2} size={26}>
          Garde-fous testés : injection de prompt, demandes hors périmètre
        </CheckItem>
        <CheckItem id="m910-hitl" w={2} size={26}>
          Humain dans la boucle pour les crédits et les remboursements
        </CheckItem>
        <CheckItem id="m910-efvp" w={2} size={26}>
          EFVP réalisée et approuvée par le responsable (Loi 25)
        </CheckItem>
        <CheckItem id="m910-back" w={2} size={26}>
          Plan de retour arrière : agent désactivable en 5 minutes
        </CheckItem>
        <CheckItem id="m910-logs" size={26}>
          Journalisation active : qui, quoi, quand, avec quel outil
        </CheckItem>
        <CheckItem id="m910-owner" size={26}>
          Parrain métier et responsable opérationnel désignés
        </CheckItem>
        <CheckItem id="m910-train" size={26}>
          Utilisateurs pilotes formés, canal de rétroaction ouvert
        </CheckItem>
        <CheckItem id="m910-cost" size={26}>
          Coût par courriel estimé et budget mensuel plafonné
        </CheckItem>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1120, top: 0, width: 560, ...dl(200) }}>
        <Hint>Cliquez une ligne pour la cocher : le verdict se met à jour</Hint>
        <CheckScore
          max={14}
          label="Verdict"
          style={{ marginTop: 18 }}
          levels={[
            { min: 0, text: 'NO-GO : retour au prototype', tone: 'coral' },
            { min: 8, text: 'GO conditionnel : plan d’action daté', tone: 'yellow' },
            { min: 12, text: 'GO pour le pilote !', tone: 'green' },
          ]}
        />
        <Callout title="Critères bloquants" tone="coral" icon="alert" size={25} style={{ marginTop: 26 }}>
          EFVP, humain dans la boucle, retour arrière : un seul manquant = NO-GO, quel que soit le score.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ─── Infrastructure et clés ─────────────────────────────────────────────────
const M910Env = ({
  x,
  tone,
  env,
  acct,
  perm,
  data,
  d,
}: {
  x: number;
  tone: Tone;
  env: string;
  acct: string;
  perm: string;
  data: string;
  d: number;
}) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 230, width: 240, ...dl(d) }}>
    <div
      style={{
        boxSizing: 'border-box',
        padding: '20px 16px 18px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Tag tone={tone} size={20}>
        {env}
      </Tag>
      <Icon name="bot" size={46} color={tone === 'grey' ? C.muted : STRONG[tone]} />
      <div style={{ fontFamily: mono, fontSize: 20, color: C.soft }}>{acct}</div>
      <div className={b.pop(3)}>
        <Tag tone="violet" size={20}>
          <Icon name="lock" size={18} /> {perm}
        </Tag>
      </div>
      <div className={b.fade(4)} style={{ fontSize: 21, color: C.muted }}>
        {data}
      </div>
    </div>
  </div>
);

const M910Practice = ({ icon, tone, beat, title, children }: { icon: IconName; tone: Tone; beat: number; title: string; children: ReactNode }) => (
  <div className={b.on(beat)}>
    <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
      <IconTile name={icon} tone={tone} size={60} />
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
      </div>
    </div>
  </div>
);

const M910_Infra: Page = () => (
  <Frame mod={9} beats={5}>
    <Title>Infrastructure et clés : sécuriser l’agent</Title>
    <Lede>Un agent détient des accès : traitez-le comme un employé à privilèges… qui ne dort jamais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 840, height: 660 }}>
      <svg width={840} height={660} viewBox="0 0 840 660" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Arrow x1={420} y1={112} x2={120} y2={226} color={C.amber} n={1} />
        <Arrow x1={420} y1={112} x2={420} y2={226} color={C.amber} n={1} d={120} />
        <Arrow x1={420} y1={112} x2={720} y2={226} color={C.amber} n={1} d={240} />
        <g className={b.fade(1)}>
          <FlowDot path="M420 112 L120 226" color={C.amber} dur={2} />
          <FlowDot path="M420 112 L420 226" color={C.amber} dur={2} begin={0.5} />
          <FlowDot path="M420 112 L720 226" color={C.amber} dur={2} begin={1} />
        </g>
        <path d="M270 215 V500" stroke={C.coral} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" className={b.fade(4)} />
        <path d="M570 215 V500" stroke={C.coral} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" className={b.fade(4)} />
        <Arrow x1={120} y1={480} x2={250} y2={548} color={C.blue} n={5} dashed />
        <Arrow x1={420} y1={480} x2={420} y2={548} color={C.blue} n={5} dashed />
        <Arrow x1={720} y1={480} x2={590} y2={548} color={C.blue} n={5} dashed />
      </svg>
      <div className={A.down} style={{ position: 'absolute', left: 230, top: 0, width: 380 }}>
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '16px 22px',
            background: C.card,
            borderRadius: 'var(--osd-radius)',
            boxShadow: `${SHADOW}, inset 0 0 0 2.5px ${C.amber}`,
          }}
        >
          <IconTile name="key" tone="yellow" size={64} solid />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>Coffre-fort de secrets</div>
            <div style={{ fontSize: 21, color: C.muted }}>aucune clé dans le code</div>
          </div>
        </div>
      </div>
      <div className={b.pop(2)} style={{ position: 'absolute', left: 630, top: 26 }}>
        <Tag tone="yellow" size={20}>
          <Icon name="loop" size={20} /> rotation · 90 jours
        </Tag>
      </div>
      <M910Env x={0} tone="grey" env="DEV" acct="svc-tri-dev" perm="lecture seule" data="données fictives" d={200} />
      <M910Env x={300} tone="blue" env="TEST" acct="svc-tri-test" perm="lecture seule" data="données anonymisées" d={320} />
      <M910Env x={600} tone="coral" env="PROD" acct="svc-tri-prod" perm="écriture : 2 outils" data="données réelles" d={440} />
      <div className={b.on(5)} style={{ position: 'absolute', left: 150, top: 556, width: 540 }}>
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '16px 22px',
            background: C.card,
            borderRadius: 'var(--osd-radius)',
            boxShadow: `${SHADOW}, inset 0 0 0 2.5px ${C.blue}`,
          }}
        >
          <IconTile name="archive" tone="blue" size={60} solid />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>Journal centralisé</div>
            <div style={{ fontSize: 21, color: C.muted }}>chaque appel d’outil, horodaté et conservé</div>
          </div>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1010, top: 286, width: 790, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <M910Practice icon="key" tone="yellow" beat={1} title="Coffre-fort de secrets">
        Aucune clé dans le code ni dans le prompt : Azure Key Vault, AWS Secrets Manager, HashiCorp Vault…
      </M910Practice>
      <M910Practice icon="loop" tone="yellow" beat={2} title="Rotation des clés">
        Rotation automatique (ex. tous les 90 jours) et révocation immédiate en cas de fuite.
      </M910Practice>
      <M910Practice icon="lock" tone="violet" beat={3} title="Comptes de service à moindre privilège">
        Un compte par agent, lecture seule par défaut ; l’écriture s’accorde outil par outil.
      </M910Practice>
      <M910Practice icon="layers" tone="coral" beat={4} title="Environnements séparés">
        Jamais de données réelles en développement, jamais d’essais en production.
      </M910Practice>
      <M910Practice icon="archive" tone="blue" beat={5} title="Journalisation">
        Chaque appel d’outil tracé : qui, quoi, quand, avec quel résultat. Indispensable en cas d’incident.
      </M910Practice>
    </div>
  </Frame>
);

// ─── Calculateur de coûts en jetons ─────────────────────────────────────────
const M910Slider = ({ label, value, children }: { label: string; value: string; children: ReactNode }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: 800, marginBottom: 6 }}>
      <span style={{ fontSize: 25, color: C.soft }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: 27, fontWeight: 700, color: C.ink }}>{value}</span>
    </div>
    {children}
  </div>
);

const M910MiniStat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>{value}</div>
    <div style={{ fontSize: 20, color: C.muted }}>{label}</div>
  </div>
);

const M910CostBar = ({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.soft, marginBottom: 6 }}>
      <span>{label}</span>
      <span style={{ fontFamily: mono, fontWeight: 700, color: C.ink }}>{value}</span>
    </div>
    <div style={{ height: 26, borderRadius: 13, background: C.panel }}>
      <div style={{ width: `${Math.max(2, pct)}%`, height: 26, borderRadius: 13, background: color, transition: `width 500ms ${EASE}` }} />
    </div>
  </div>
);

const M910_Tokens: Page = () => {
  const [req, setReq] = useState(250);
  const [steps, setSteps] = useState(4);
  const [tin, setTin] = useState(3000);
  const [tout, setTout] = useState(400);
  const [pin, setPin] = useState(3);
  const [pout, setPout] = useState(15);
  const calls = req * 22 * steps;
  const perCall = (tin * pin + tout * pout) / 1e6;
  const monthly = calls * perCall;
  const chatbot = req * 22 * perCall;
  const tokens = calls * (tin + tout);
  const money = (x: number) => (x >= 100 ? fr(Math.round(x)) : fr(x, 2));
  const preset = (a: number, z: number) => {
    setPin(a);
    setPout(z);
  };
  const isP = (a: number) => Math.abs(pin - a) < 0.001;
  return (
    <Frame mod={9} kind="demo">
      <Title>Calculateur : combien coûte un agent ?</Title>
      <Lede>Les agents multiplient les appels au modèle : faites le calcul avant le pilote, pas après.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 800, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M910Slider label="Requêtes par jour (courriels)" value={fr(req)}>
          <Range value={req} onChange={setReq} min={50} max={2000} step={50} w={800} />
        </M910Slider>
        <M910Slider label="Appels au modèle par requête" value={String(steps)}>
          <Range value={steps} onChange={setSteps} min={1} max={15} w={800} tone="violet" />
        </M910Slider>
        <M910Slider label="Jetons d’entrée par appel" value={fr(tin)}>
          <Range value={tin} onChange={setTin} min={500} max={20000} step={500} w={800} tone="teal" />
        </M910Slider>
        <M910Slider label="Jetons de sortie par appel" value={fr(tout)}>
          <Range value={tout} onChange={setTout} min={100} max={3000} step={100} w={800} tone="teal" />
        </M910Slider>
        <M910Slider label="Prix entrée ($ US / million de jetons)" value={fr(pin, 2)}>
          <Range value={pin} onChange={setPin} min={0.05} max={20} step={0.05} w={800} tone="yellow" />
        </M910Slider>
        <M910Slider label="Prix sortie ($ US / million de jetons)" value={fr(pout, 2)}>
          <Range value={pout} onChange={setPout} min={0.2} max={80} step={0.1} w={800} tone="yellow" />
        </M910Slider>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <span style={{ fontSize: 22, color: C.muted, marginRight: 4 }}>Gamme de modèle :</span>
          <Btn size={22} tone="green" ghost={!isP(0.15)} onClick={() => preset(0.15, 0.6)}>
            Économique
          </Btn>
          <Btn size={22} tone="blue" ghost={!isP(3)} onClick={() => preset(3, 15)}>
            Intermédiaire
          </Btn>
          <Btn size={22} tone="violet" ghost={!isP(15)} onClick={() => preset(15, 75)}>
            Haut de gamme
          </Btn>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 280, width: 800, ...dl(200) }}>
        <div
          style={{
            boxSizing: 'border-box',
            padding: '26px 32px 30px',
            background: C.card,
            borderRadius: 'var(--osd-radius)',
            boxShadow: `${SHADOW}, inset 0 8px 0 ${C.yellow}`,
          }}
        >
          <Eyebrow c={C.muted} size={22}>
            Coût mensuel estimé (22 jours ouvrables)
          </Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6 }}>
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 104, lineHeight: 1, color: C.ink }}>{money(monthly)}</span>
            <span style={{ fontSize: 32, fontWeight: 600, color: C.soft }}>$ US / mois</span>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 22, paddingTop: 18, borderTop: `2px solid ${C.rule}` }}>
            <M910MiniStat value={fr(calls)} label="appels / mois" />
            <M910MiniStat value={tokens >= 1e6 ? `${fr(tokens / 1e6, 1)} M` : fr(tokens)} label="jetons / mois" />
            <M910MiniStat value={`${fr(perCall * steps, 3)} $`} label="par courriel" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
            <M910CostBar label="Simple assistant (1 appel)" value={`${money(chatbot)} $`} pct={(100 * chatbot) / monthly} color={C.teal} />
            <M910CostBar label={`Agent (${steps} appel${steps > 1 ? 's' : ''} par courriel)`} value={`${money(monthly)} $`} pct={100} color={C.coral} />
          </div>
        </div>
        <Callout title="Leviers d’économie" tone="yellow" icon="money" size={25} style={{ marginTop: 26 }}>
          Plafonner le nombre d’étapes, mettre en cache les instructions répétées, et prendre le plus petit modèle qui réussit le jeu de test.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Gestion du changement ──────────────────────────────────────────────────
const M910Lever = ({ beat, icon, tone, title, children }: { beat: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ flex: 1, display: 'flex' }}>
    <div
      style={{
        flex: 1,
        boxSizing: 'border-box',
        padding: '26px 24px 24px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
      }}
    >
      <IconTile name={icon} tone={tone} size={60} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 31, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M910Objection = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Icon name="chat" size={40} color={C.coral} style={{ flexShrink: 0, marginTop: 4 }} />
    <div style={{ fontFamily: display, fontSize: 32, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{text}</div>
  </div>
);

const M910Answer = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 24, lineHeight: 1.4, color: C.ink }}>{children}</div>;

const M910_Change: Page = () => (
  <Frame mod={9} beats={8}>
    <Title>Gestion du changement : l’humain d’abord</Title>
    <Lede>Un agent mal accueilli reste inutilisé. Le déploiement est aussi un projet humain.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 25 }}>
      <M910Lever beat={1} icon="send" tone="blue" title="Communiquer">
        Le pourquoi, le calendrier, et le message clé : « l’agent trie, vous décidez ».
      </M910Lever>
      <M910Lever beat={2} icon="book" tone="teal" title="Former">
        Ateliers courts (45 min) par rôle : quand se fier à l’agent, quand le corriger.
      </M910Lever>
      <M910Lever beat={3} icon="star" tone="yellow" title="Ambassadeurs">
        Un par équipe, formé en premier : il répond aux questions et remonte les irritants.
      </M910Lever>
      <M910Lever beat={4} icon="chat" tone="green" title="Rétroaction">
        Bouton « utile / pas utile » sur chaque suggestion, et revue chaque semaine.
      </M910Lever>
      <M910Lever beat={5} icon="users" tone="violet" title="Rôles qui évoluent">
        Moins de saisie et de tri, plus de cas complexes et de relation client.
      </M910Lever>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 622, ...dl(300) }}>
      <Eyebrow c={C.coral} size={22}>
        Objections fréquentes · cliquez pour la réponse
      </Eyebrow>
    </div>
    <FlipCard
      w={544}
      h={290}
      flipAt={6}
      tone="coral"
      style={{ position: 'absolute', left: 120, top: 664 }}
      front={<M910Objection text="« L’IA va prendre mon emploi. »" />}
      back={
        <M910Answer>
          L’agent prend le tri et les réponses répétitives. Vous gardez les cas délicats, les décisions et la relation. On le dit, et on le prouve pendant le pilote.
        </M910Answer>
      }
    />
    <FlipCard
      w={544}
      h={290}
      flipAt={7}
      tone="coral"
      style={{ position: 'absolute', left: 688, top: 664 }}
      front={<M910Objection text="« Il va se tromper, et c’est moi qui serai blâmé. »" />}
      back={
        <M910Answer>
          Pendant le pilote, vous validez avant l’envoi. Les erreurs servent à améliorer l’agent : elles sont attendues, journalisées et jamais reprochées.
        </M910Answer>
      }
    />
    <FlipCard
      w={544}
      h={290}
      flipAt={8}
      tone="coral"
      style={{ position: 'absolute', left: 1256, top: 664 }}
      front={<M910Objection text="« Encore un outil de plus à apprendre… »" />}
      back={
        <M910Answer>
          L’agent s’intègre à la boîte de courriels existante : pas de nouvel écran. Formation de 45 minutes, ambassadeur à côté de vous.
        </M910Answer>
      }
    />
  </Frame>
);

// ─── QCM 10 ─────────────────────────────────────────────────────────────────
const M910_Qcm10: Page = () => (
  <QcmPage
    mod={9}
    n={10}
    title="Du prototype à la production"
    q="La démo du prototype de tri des courriels a impressionné la direction. Quelle est la meilleure prochaine étape ?"
    explain="Une démo prouve la faisabilité sur des cas choisis, pas la fiabilité sur le volume réel. Le pilote mesure la valeur, révèle les cas limites et prépare les équipes, avec des critères go/no-go fixés d’avance."
  >
    <Opt why="Piège ! Une démo réussie porte sur quelques cas choisis. Sur 5 000 courriels par mois, les cas limites apparaîtront… chez vos clients.">
      Passer en production pour tout le service client dès lundi, pendant que l’enthousiasme est là
    </Opt>
    <Opt why="Non : aucun agent n’atteint 100 %. On fixe un seuil réaliste et un humain dans la boucle pour rattraper les erreurs.">
      Attendre que l’agent atteigne 100 % d’exactitude sur tous les tests avant d’aller plus loin
    </Opt>
    <Opt ok why="Oui : une équipe réelle, l’humain dans la boucle, des critères écrits et un retour arrière prêt. C’est le chemin sûr.">
      Lancer un pilote encadré : une équipe, des critères de passage écrits et un plan de retour arrière
    </Opt>
    <Opt why="Piège ! Air Canada l’a appris en 2024 : l’entreprise reste responsable de ce que dit son agent, peu importe le fournisseur.">
      Confier le déploiement au fournisseur du modèle, qui en assumera la responsabilité
    </Opt>
  </QcmPage>
);

// @@PAGES-BEGIN
export const __pages = [M910_M9Divider, M910_Stages, M910_GoNoGo, M910_Infra, M910_Tokens, M910_Change, M910_Qcm10];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 9 (≈ 15 h 00, après la pause)

OBJECTIF — Relancer l'énergie après la pause et annoncer le dernier virage : passer du prototype de l'atelier à un service réel.

DIRE — « Bon retour ! Vous avez prototypé un agent de tri des courriels pendant l'atelier. C'est souvent là que les projets meurent : la démo impressionne, tout le monde applaudit… et six mois plus tard, rien n'est en production. Rappelez-vous le chiffre de Gartner vu ce matin : plus de 40 % des projets d'IA agentique pourraient être annulés d'ici fin 2027. Ce module sert à faire partie des 60 % qui survivent. »

« Au programme, en trente minutes : les trois jalons prototype, pilote, production ; une checklist go/no-go que vous pourrez réutiliser telle quelle ; l'infrastructure et les clés, c'est-à-dire comment sécuriser les accès de l'agent ; le coût réel en jetons, avec un calculateur ; et enfin la gestion du changement, parce qu'un agent que personne n'utilise ne vaut rien. »

INTERACTION — Question rapide à main levée : « Qui a déjà vu un projet techno mourir entre la démo et la production ? » Il y a toujours beaucoup de mains : servez-vous-en comme accroche.

TRANSITION — « Commençons par la route elle-même : trois étapes, pas une. »`,
  `⏱ 6 min

OBJECTIF — Faire comprendre qu'on ne déploie pas un agent d'un coup : chaque étape a sa population, son objectif et un critère de passage écrit d'avance.

DIRE — Montrer d'abord la ligne : « Trois jalons, deux portes. »
→ beat 1 : « Le prototype : 2 à 4 semaines, l'équipe projet plus 3 à 5 utilisateurs-clés. On prouve que c'est faisable sur de vrais cas, pas sur des exemples inventés. »
→ beat 2 : « Première porte. On ne passe que si l'agent atteint, par exemple, 85 % d'exactitude sur le jeu de test et que les garde-fous ont été éprouvés. »
→ beat 3 : « Le pilote : 4 à 8 semaines avec une vraie équipe — chez Boréal, 10 agents du service client. L'humain reste dans la boucle. On ne prouve plus la faisabilité, on prouve la VALEUR. »
→ beat 4 : « Deuxième porte : gain mesuré par rapport à la situation de référence, satisfaction d'au moins 4 sur 5, aucun incident grave. »
→ beat 5 : « La production, par vagues : 10 %, 50 %, 100 %. Ici, on parle de critère de maintien : si les KPI se dégradent, on revient en arrière. »
→ beat 6 : la règle d'or.

INSISTER — Les critères se fixent AVANT de commencer. Sinon, on les ajuste après coup pour justifier la décision qu'on voulait prendre.

INTERACTION — « Dans votre organisation, qui signerait le passage au pilote ? » Faire émerger le rôle du parrain métier.

TRANSITION — « Concrètement, à quoi ressemble cette porte go/no-go ? Testons-la. »`,
  `⏱ 6 min · EXERCICE INTERACTIF

OBJECTIF — Outiller la décision de passage au pilote avec une grille pondérée réutilisable, et faire comprendre la notion de critère bloquant.

ANIMATION — « On reprend le prototype de tri des courriels que vos équipes ont construit tout à l'heure. Je lis chaque critère ; vous me dites si c'est vrai pour votre prototype. » Cliquez les lignes selon les réponses du groupe. Le verdict change en direct : NO-GO sous 8 points, GO conditionnel de 8 à 11, GO à partir de 12 sur 14.

POINTS À FAIRE RESSORTIR —
• Les critères ×2 portent sur la qualité, la sécurité, la conformité et la réversibilité. Les critères ×1 sont organisationnels, mais pas optionnels.
• En général, le groupe coche l'exactitude et les garde-fous, mais oublie l'EFVP et le plan de retour arrière. C'est exactement le but : montrer les angles morts.
• Pointer l'encadré rouge : « Attention ! Même avec 12 points sur 14, s'il manque l'EFVP, l'humain dans la boucle ou le retour arrière, c'est NO-GO. Un score ne remplace pas le jugement. »

DIRE — « Le plan de retour arrière, c'est une question simple : si l'agent dérape vendredi à 17 h, qui le désactive, et en combien de temps ? Si personne ne sait répondre, vous n'êtes pas prêts. »

ASTUCE — Proposer aux participants de photographier la grille : elle s'adapte à n'importe quel agent.

TRANSITION — « Plusieurs de ces critères touchent l'infrastructure. Regardons-la de plus près. »`,
  `⏱ 4 min

OBJECTIF — Donner les cinq pratiques d'infrastructure non négociables, sans jargon excessif, pour que les gestionnaires sachent quoi exiger des TI ou du fournisseur.

DIRE — « Un agent, c'est un employé à privilèges qui travaille 24 heures sur 24 et qui peut se faire manipuler par un courriel piégé. On le sécurise en conséquence. »
→ beat 1 : « Les clés d'API et les mots de passe vivent dans un coffre-fort de secrets. Jamais dans le code, jamais dans le prompt : un prompt peut fuiter. »
→ beat 2 : « Rotation automatique, par exemple aux 90 jours, et révocation immédiate en cas de fuite. »
→ beat 3 : « Un compte de service par agent et par environnement. Lecture seule par défaut ; l'écriture s'accorde outil par outil. Chez Boréal, l'agent de production peut écrire avec deux outils seulement : envoyer une réponse et créer une note au dossier. Rappelez-vous Replit en 2025 : un agent de code a supprimé une base de production malgré un gel des changements. Il avait simplement trop de droits. »
→ beat 4 : « Des environnements séparés : données fictives en développement, anonymisées en test, réelles en production uniquement. »
→ beat 5 : « Un journal centralisé : en cas d'incident ou de plainte, c'est votre seule preuve de ce que l'agent a fait. »

INTERACTION — « Qui sait aujourd'hui où sont stockées les clés d'API utilisées par son équipe ? » Silence fréquent : c'est le message.

TRANSITION — « Ces appels au modèle ont un coût. Faisons le calcul. »`,
  `⏱ 5 min · DÉMO INTERACTIVE

OBJECTIF — Montrer que le coût d'un agent se calcule simplement, et qu'il est multiplié par le nombre d'appels au modèle par tâche.

DIRE — « Un modèle se paie au jeton : ce qu'on lui envoie, ce qu'il répond. Un simple assistant fait un appel par question. Un agent en fait plusieurs : classer, consulter un outil, rédiger, vérifier. »

INTERACTION — Partir des valeurs par défaut : 250 courriels par jour, 4 appels, 3 000 jetons d'entrée, prix intermédiaire. Résultat : environ 330 $ US par mois, soit un peu plus d'un cent par courriel.
→ Monter les appels à 12 : « Un agent qui tourne en rond triple la facture. »
→ Cliquer « Haut de gamme » : « Le même agent avec le plus gros modèle coûte cinq fois plus. Est-ce que le tri des courriels le justifie ? »
→ Cliquer « Économique » : « Une quinzaine de dollars par mois. Si ce modèle réussit le jeu de test, pourquoi payer plus ? »
→ Demander au groupe de régler le volume de leur propre cas.

INSISTER — Les prix sont indicatifs et changent souvent : vérifiez la grille de votre fournisseur. Le message durable est la structure du calcul, pas le chiffre. Comparez toujours au coût humain actuel de la tâche.

LEVIERS — Plafonner les étapes, mettre en cache les instructions fixes, choisir le plus petit modèle suffisant, et fixer une alerte budgétaire.

TRANSITION — « Le coût technique est la partie facile. Le vrai défi, ce sont les personnes. »`,
  `⏱ 4 min

OBJECTIF — Faire comprendre que l'adoption se prépare, et outiller les gestionnaires face aux objections les plus fréquentes.

DIRE — « Rappelez-vous Klarna : en 2024, l'entreprise annonçait un assistant équivalant à 700 agents ; en 2025, elle réembauchait des humains pour la qualité du service. L'humain n'est pas un détail du déploiement. »
→ beat 1 : Communiquer. Le message clé : « l'agent trie, vous décidez ».
→ beat 2 : Former, en ateliers courts par rôle. On apprend surtout quand NE PAS se fier à l'agent.
→ beat 3 : Ambassadeurs. Une personne par équipe, formée en premier, crédible auprès de ses collègues.
→ beat 4 : Rétroaction. Un bouton « utile / pas utile » alimente la boucle d'amélioration du module 10.
→ beat 5 : Rôles qui évoluent. Soyez honnêtes : certaines tâches disparaissent, d'autres apparaissent.

OBJECTIONS — Retourner les cartes une à une (beats 6 à 8) ou demander au groupe de répondre d'abord, puis cliquer.
→ « L'IA va prendre mon emploi » : ne jamais promettre ce que la direction n'a pas décidé ; parler des tâches.
→ « Je serai blâmé » : l'erreur pendant le pilote est une donnée, pas une faute.
→ « Encore un outil » : intégrer l'agent aux outils existants.

INTERACTION — « Quelle objection entendrez-vous en premier dans votre équipe ? »

TRANSITION — « Vérifions que la logique de déploiement est bien ancrée. »`,
  `⏱ 4 min · QCM

OBJECTIF — Ancrer l'idée qu'une démo réussie ne justifie pas un passage direct en production.

DIRE — « Situation très réelle : la démo a impressionné. Quelle est la meilleure prochaine étape ? Votez. »

INTERACTION — Laisser 30 secondes de réflexion, faire voter à main levée, puis cliquer sur les réponses proposées par le groupe.

RÉPONSES —
✗ A — Production dès lundi. C'est LE piège du module : l'enthousiasme pousse à sauter le pilote. Une démo porte sur des cas choisis ; les cas limites arriveront chez les clients.
✗ B — Attendre 100 %. Piège inverse : la paralysie. Aucun agent n'est parfait ; on fixe un seuil réaliste et un humain rattrape les erreurs.
✓ C — Pilote encadré : une équipe réelle, des critères écrits, un retour arrière prêt.
✗ D — Confier au fournisseur. Rappel d'Air Canada (2024) : le tribunal a tenu l'entreprise responsable de ce que disait son assistant. La responsabilité ne se délègue pas.

PIÈGE — A séduit les participants pressés de livrer ; D séduit ceux qui veulent transférer le risque.

DIRE APRÈS — « Retenez : démo = faisabilité ; pilote = valeur ; production = durée. »

TRANSITION — « Le pilote doit prouver la valeur… encore faut-il savoir la mesurer. C'est le module 10. »`,
];
// @@NOTES-END
