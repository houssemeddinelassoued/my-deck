// ─── 11 · ReAct simulator ───────────────────────────────────────────────────
type M1bStepKind = 'pensee' | 'action' | 'obs' | 'final';
const M1bKinds: Record<M1bStepKind, { label: string; icon: IconName; tone: Tone }> = {
  pensee: { label: 'Pensée', icon: 'brain', tone: 'violet' },
  action: { label: 'Action', icon: 'tool', tone: 'blue' },
  obs: { label: 'Observation', icon: 'eye', tone: 'teal' },
  final: { label: 'Réponse', icon: 'check', tone: 'green' },
};
const M1B_STEPS = 10;

// One node of the Pensée → Action → Observation loop (lights up when active).
const M1bNode = ({ x, y, kind, on, d }: { x: number; y: number; kind: M1bStepKind; on: boolean; d: number }) => {
  const m = M1bKinds[kind];
  return (
    <div style={{ position: 'absolute', left: x - 92, top: y - 52, width: 184, height: 104 }}>
      <div className={A.pop} style={{ width: '100%', height: '100%', ...dl(d) }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            borderRadius: 18,
            background: on ? STRONG[m.tone] : C.card,
            color: on ? '#fff' : T[m.tone].fg,
            boxShadow: on ? `0 0 0 8px ${T[m.tone].bg}, ${SHADOW}` : SHADOW,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transform: on ? 'scale(1.08)' : 'none',
            transition: `background 350ms ${EASE}, color 350ms ${EASE}, box-shadow 350ms ${EASE}, transform 450ms ${EASE_BACK}`,
          }}
        >
          <Icon name={m.icon} size={38} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {m.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// One line of the agent's trace (appears at step `at`, ringed while current).
const M1bRow = ({ kind, at, step, children }: { kind: M1bStepKind; at: number; step: number; children: ReactNode }) => {
  const m = M1bKinds[kind];
  const shown = step >= at;
  const cur = step === at;
  const code = kind === 'action';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        minHeight: 54,
        boxSizing: 'border-box',
        padding: '6px 18px 6px 8px',
        background: kind === 'final' ? T.green.bg : C.card,
        borderRadius: 12,
        boxShadow: cur ? `0 0 0 3px ${STRONG[m.tone]}, ${SHADOW_SM}` : SHADOW_SM,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(12px)',
        transition: `opacity 450ms ${EASE}, transform 600ms ${EASE}, box-shadow 400ms ${EASE}`,
      }}
    >
      <span
        style={{
          flex: 'none',
          width: 196,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px',
          borderRadius: 8,
          background: kind === 'final' ? C.green : T[m.tone].bg,
          color: kind === 'final' ? '#fff' : T[m.tone].fg,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <Icon name={m.icon} size={24} sw={2.4} />
        {m.label}
      </span>
      <span style={{ fontFamily: code ? mono : body, fontSize: code ? 21 : 24, lineHeight: 1.35, color: C.ink }}>{children}</span>
    </div>
  );
};

const M1bTour = ({ n, step, children }: { n: number; step: number; children: ReactNode }) => {
  const live = step >= (n - 1) * 3 + 1;
  const now = live && step <= n * 3;
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div
        style={{
          flex: 'none',
          width: 44,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          paddingTop: 7,
          opacity: live ? 1 : 0.3,
          transition: `opacity 400ms ${EASE}`,
        }}
      >
        <Num n={n} tone={now ? 'blue' : 'grey'} size={40} />
        <span style={{ flex: 1, width: 3, borderRadius: 2, background: now ? T.blue.bd : C.rule }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
};

const M1b_ReAct: Page = () => {
  const [ref, beats] = useBeats();
  const [man, setMan] = useState<number | null>(null);
  // An arrow press takes over again once it goes past the manual position.
  useEffect(() => {
    setMan((m) => (m !== null && m >= beats ? m : null));
  }, [beats]);
  const step = Math.min(M1B_STEPS, man ?? beats);
  const kind: M1bStepKind | null =
    step <= 0 ? null : step >= M1B_STEPS ? 'final' : (['pensee', 'action', 'obs'] as M1bStepKind[])[(step - 1) % 3];
  const tour = step <= 0 ? 0 : Math.min(3, Math.ceil(step / 3));
  return (
    <Frame mod={1} kind="demo" beats={M1B_STEPS} label="Module 01 · Le cycle ReAct">
      <Title>Simulateur : l’agent pense, agit, observe</Title>
      <Lede>
        Tâche confiée à l’agent : <Strong>« Envoie à l’équipe un résumé des billets TI critiques de la semaine. »</Strong>
      </Lede>

      {/* Left: the loop */}
      <div ref={ref} style={{ position: 'absolute', left: 120, top: 262, width: 600, height: 460 }}>
        <svg width={600} height={460} viewBox="0 0 600 460" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <circle cx={300} cy={240} r={170} fill="none" stroke={C.rule} strokeWidth={14} className={A.fade} />
          <path
            d="M 300 70 A 170 170 0 0 1 300 410 A 170 170 0 0 1 300 70"
            fill="none"
            stroke="#B9D7EE"
            strokeWidth={4}
            strokeDasharray="10 14"
            className={A.march}
          />
          <polygon points="-11,-10 11,0 -11,10" fill={C.faint} transform="translate(447 155) rotate(60)" />
          <polygon points="-11,-10 11,0 -11,10" fill={C.faint} transform="translate(300 410) rotate(180)" />
          <polygon points="-11,-10 11,0 -11,10" fill={C.faint} transform="translate(153 155) rotate(-60)" />
          <FlowDot path="M 300 70 A 170 170 0 0 1 300 410 A 170 170 0 0 1 300 70" dur={4.5} r={9} />
        </svg>
        <M1bNode x={300} y={70} kind="pensee" on={kind === 'pensee'} d={100} />
        <M1bNode x={447} y={325} kind="action" on={kind === 'action'} d={220} />
        <M1bNode x={153} y={325} kind="obs" on={kind === 'obs'} d={340} />
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 168,
            width: 200,
            textAlign: 'center',
          }}
        >
          {kind === 'final' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IconTile name="check" tone="green" size={58} solid />
              </div>
              <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.green }}>But atteint</div>
            </>
          ) : (
            <>
              <Eyebrow c={C.muted} size={22}>
                {step === 0 ? 'Prêt' : 'Tour'}
              </Eyebrow>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 60, lineHeight: 1.05, color: step === 0 ? C.faint : C.blue }}>
                {tour} / 3
              </div>
            </>
          )}
        </div>
      </div>

      <div className={A.in} style={{ position: 'absolute', left: 120, top: 744, width: 600, display: 'flex', alignItems: 'center', gap: 16, ...dl(450) }}>
        <Btn icon="play" disabled={step >= M1B_STEPS} onClick={() => setMan(Math.min(M1B_STEPS, step + 1))}>
          Étape suivante
        </Btn>
        <Btn icon="reset" ghost onClick={() => setMan(0)}>
          Recommencer
        </Btn>
        <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 22, color: C.muted }}>
          {pad(step)} / {M1B_STEPS}
        </span>
      </div>
      <Callout
        cls={A.in}
        title="ReAct = Reason + Act"
        icon="loop"
        tone="blue"
        size={24}
        style={{ position: 'absolute', left: 120, top: 830, width: 600, padding: '16px 24px', ...dl(550) }}
      >
        Raisonner, agir, observer… et recommencer jusqu’au but.
      </Callout>

      {/* Right: the trace */}
      <div className={A.fade} style={{ position: 'absolute', left: 760, top: 262, width: 1040, display: 'flex', flexDirection: 'column', gap: 18, ...dl(200) }}>
        <M1bTour n={1} step={step}>
          <M1bRow kind="pensee" at={1} step={step}>
            « Je dois d’abord trouver les billets critiques de la semaine. »
          </M1bRow>
          <M1bRow kind="action" at={2} step={step}>
            rechercher_billets(priorite="critique", periode="7j")
          </M1bRow>
          <M1bRow kind="obs" at={3} step={step}>
            7 billets trouvés : 2 déjà résolus, 5 encore ouverts
          </M1bRow>
        </M1bTour>
        <M1bTour n={2} step={step}>
          <M1bRow kind="pensee" at={4} step={step}>
            « J’écarte les 2 résolus et je résume les 5 ouverts. »
          </M1bRow>
          <M1bRow kind="action" at={5} step={step}>
            resumer(billets=[4471, 4475, …], format="puces")
          </M1bRow>
          <M1bRow kind="obs" at={6} step={step}>
            Résumé prêt : panne VPN à Montréal, lecteurs du CD de Lévis…
          </M1bRow>
        </M1bTour>
        <M1bTour n={3} step={step}>
          <M1bRow kind="pensee" at={7} step={step}>
            « Il reste à l’envoyer à la liste de l’équipe TI. »
          </M1bRow>
          <M1bRow kind="action" at={8} step={step}>
            envoyer_courriel(a="equipe-ti@boreal.ca", …)
          </M1bRow>
          <M1bRow kind="obs" at={9} step={step}>
            Envoi confirmé : 12 destinataires
          </M1bRow>
        </M1bTour>
        <div style={{ paddingLeft: 58 }}>
          <M1bRow kind="final" at={10} step={step}>
            « C’est fait : le résumé des 5 billets critiques encore ouverts a été envoyé à l’équipe TI (12 personnes). »
          </M1bRow>
        </div>
      </div>
    </Frame>
  );
};

// ─── 12 · Workflow or agent? ────────────────────────────────────────────────
const M1bPathCard = ({
  n,
  tone,
  title,
  sub,
  flow,
  ex,
  beat,
}: {
  n: number;
  tone: Tone;
  title: string;
  sub: ReactNode;
  flow: ReactNode;
  ex: ReactNode;
  beat: number;
}) => (
  <div className={b.on(beat)} style={{ flex: 1 }}>
    <div
      style={{
        boxSizing: 'border-box',
        height: '100%',
        padding: '32px 26px 26px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Num n={n} tone={tone} size={48} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.05, color: C.ink }}>{title}</span>
      </div>
      <div
        style={{
          marginTop: 18,
          height: 80,
          borderRadius: 14,
          background: C.panel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {flow}
      </div>
      <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{sub}</div>
      <div style={{ marginTop: 14, height: 1.5, background: C.rule }} />
      <Eyebrow c={T[tone].fg} size={20} style={{ marginTop: 14 }}>
        Chez Boréal
      </Eyebrow>
      <div style={{ marginTop: 2, fontSize: 24, lineHeight: 1.4, color: C.ink }}>{ex}</div>
    </div>
  </div>
);

const M1bBracket = ({ x, w, beat, tone, children }: { x: number; w: number; beat: number; tone: Tone; children: ReactNode }) => (
  <div className={b.fade(beat)} style={{ position: 'absolute', left: x, top: 742, width: w, height: 64 }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 20,
        borderLeft: `4px solid ${STRONG[tone]}`,
        borderRight: `4px solid ${STRONG[tone]}`,
        borderBottom: `4px solid ${STRONG[tone]}`,
        borderRadius: '0 0 10px 10px',
      }}
    />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 28, display: 'flex', justifyContent: 'center' }}>
      <Tag tone={tone} size={26}>
        {children}
      </Tag>
    </div>
  </div>
);

const M1b_Workflow: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Workflow ou agent ?</Title>
    <Lede>La vraie question : qui décide du chemin — votre code, ou le modèle ?</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 32, display: 'flex', alignItems: 'center', gap: 18 }}>
      <span style={{ fontSize: 22, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>Prévisible · contrôlable</span>
      <div style={{ flex: 1, position: 'relative', height: 6 }}>
        <div className={A.grow} style={{ position: 'absolute', inset: 0, borderRadius: 3, background: `linear-gradient(90deg, ${C.faint}, ${C.teal}, ${C.blue})`, ...dl(200) }} />
      </div>
      <Icon name="arrow" size={30} color={C.blue} sw={2.6} />
      <span style={{ fontSize: 22, fontWeight: 600, color: C.blue, whiteSpace: 'nowrap' }}>Flexible · autonome</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1680, height: 404, display: 'flex', gap: 40 }}>
      <M1bPathCard
        n={1}
        tone="grey"
        title="Script / RPA"
        beat={1}
        sub="Des règles fixes, écrites d’avance. Aucun LLM."
        ex="Copier chaque facture EDI dans l’ERP, champ par champ."
        flow={
          <>
            <IconTile name="doc" tone="grey" size={52} />
            <FlowArrow w={46} />
            <IconTile name="gear" tone="grey" size={52} />
            <FlowArrow w={46} />
            <IconTile name="database" tone="grey" size={52} />
          </>
        }
      />
      <M1bPathCard
        n={2}
        tone="teal"
        title="Workflow avec LLM"
        beat={2}
        sub="Des étapes fixes ; le LLM accomplit une tâche précise à l’une d’elles."
        ex="Courriel → extraire le n° de commande → réponse sur gabarit."
        flow={
          <>
            <IconTile name="mail" tone="grey" size={52} />
            <FlowArrow w={46} />
            <IconTile name="sparkles" tone="teal" size={52} solid />
            <FlowArrow w={46} />
            <IconTile name="send" tone="grey" size={52} />
          </>
        }
      />
      <M1bPathCard
        n={3}
        tone="blue"
        title="Agent"
        beat={3}
        sub="Le modèle choisit lui-même les étapes et les outils, en boucle."
        ex="« Règle la demande de ce client », quelle qu’elle soit."
        flow={
          <>
            <IconTile name="bot" tone="blue" size={56} solid />
            <FlowArrow w={56} color={C.blue} dashed />
            <IconTile name="search" tone="blue" size={44} />
            <IconTile name="database" tone="blue" size={44} />
            <IconTile name="mail" tone="blue" size={44} />
            <Icon name="loop" size={34} color={C.blue} style={{ marginLeft: 6 }} />
          </>
        }
      />
    </div>
    <M1bBracket x={120} w={1107} beat={4} tone="teal">
      Le code décide du chemin
    </M1bBracket>
    <M1bBracket x={1267} w={533} beat={4} tone="blue">
      Le modèle décide du chemin
    </M1bBracket>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 838, width: 1680 }}>
      <Callout title="Anthropic, « Building effective agents » (déc. 2024), en substance" icon="bulb" tone="yellow" size={27} style={{ padding: '14px 26px' }}>
        Commencez par la solution la plus simple ; n’ajoutez de l’autonomie que si elle améliore nettement le résultat.
      </Callout>
    </div>
  </Frame>
);

// ─── 13 · Landscape in three layers ─────────────────────────────────────────
const M1bChip = ({ name, org, tone, d, star }: { name: string; org: string; tone: Tone; d: number; star?: boolean }) => (
  <div className={A.fade} style={{ ...dl(d) }}>
    <div
      style={{
        boxSizing: 'border-box',
        padding: '9px 18px 10px',
        borderRadius: 12,
        background: star ? T.yellow.bg : T[tone].bg,
        boxShadow: `inset 0 0 0 1.5px ${star ? T.yellow.bd : T[tone].bd}`,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 20, lineHeight: 1.2, color: star ? T.yellow.fg : T[tone].fg }}>{org}</div>
    </div>
  </div>
);

const M1bLayer = ({
  tone,
  icon,
  name,
  sub,
  beat,
  children,
}: {
  tone: Tone;
  icon: IconName;
  name: string;
  sub: string;
  beat: number;
  children: ReactNode;
}) => (
  <div className={b.on(beat)}>
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '22px 28px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[tone]}`,
      }}
    >
      <div style={{ flex: 'none', width: 360, display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name={icon} tone={tone} size={68} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.05, color: C.ink }}>{name}</div>
          <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.3, color: C.muted }}>{sub}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 12 }}>{children}</div>
    </div>
  </div>
);

const M1b_Landscape: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Le panorama en trois couches</Title>
    <Lede>Des modèles qui raisonnent, des frameworks pour assembler, des plateformes pour déployer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M1bLayer tone="green" icon="layers" name="Plateformes" sub="Clés en main, peu ou pas de code" beat={3}>
        <M1bChip tone="green" d={0} name="Copilot Studio" org="Microsoft" />
        <M1bChip tone="green" d={0} name="Agentforce" org="Salesforce" />
        <M1bChip tone="green" d={0} name="ServiceNow" org="agents IA intégrés" />
        <M1bChip tone="green" d={0} name="Gemini Enterprise" org="Google" />
        <M1bChip tone="green" d={0} name="Bedrock AgentCore" org="AWS" />
        <M1bChip tone="green" d={0} name="n8n" org="automatisation" />
        <M1bChip tone="green" d={0} name="Make" org="automatisation" />
        <M1bChip tone="green" d={0} name="Zapier" org="automatisation" />
      </M1bLayer>
      <M1bLayer tone="teal" icon="code" name="Frameworks" sub="Pour développeurs : contrôle fin" beat={2}>
        <M1bChip tone="teal" d={0} name="LangChain · LangGraph" org="LangChain" />
        <M1bChip tone="teal" d={0} name="Agent Framework" org="Microsoft (AutoGen + Semantic Kernel)" />
        <M1bChip tone="teal" d={0} name="CrewAI" org="équipes d’agents" />
        <M1bChip tone="teal" d={0} name="LlamaIndex" org="données et RAG" />
        <M1bChip tone="teal" d={0} name="Agents SDK" org="OpenAI" />
        <M1bChip tone="teal" d={0} name="Claude Agent SDK" org="Anthropic" />
        <M1bChip tone="teal" d={0} name="ADK" org="Google" />
      </M1bLayer>
      <M1bLayer tone="blue" icon="brain" name="Modèles (LLM)" sub="Le « cerveau », loué à l’usage" beat={1}>
        <M1bChip tone="blue" d={0} name="GPT" org="OpenAI" />
        <M1bChip tone="blue" d={0} name="Claude" org="Anthropic" />
        <M1bChip tone="blue" d={0} name="Gemini" org="Google" />
        <M1bChip tone="blue" d={0} name="Mistral" org="Mistral AI · France" />
        <M1bChip tone="blue" d={0} name="Llama" org="Meta · poids ouverts" />
        <M1bChip tone="blue" d={0} name="Command" org="Cohere · Canada" star />
      </M1bLayer>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 866, width: 1680 }}>
      <Callout title="Le bon réflexe" icon="target" tone="yellow" size={26} style={{ padding: '12px 26px' }}>
        On choisit d’abord le cas d’usage, ensuite l’outil — selon vos compétences et votre écosystème (module 7).
      </Callout>
    </div>
  </Frame>
);

// ─── 14 · MCP and A2A ───────────────────────────────────────────────────────
const M1bSys = ({ x, y, w, h, icon, tone, children }: { x: number; y: number; w: number; h: number; icon: IconName; tone: Tone; children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 14px',
      background: C.card,
      borderRadius: 12,
      boxShadow: SHADOW_SM,
      fontSize: 23,
      fontWeight: 600,
      color: C.ink,
      whiteSpace: 'nowrap',
    }}
  >
    <IconTile name={icon} tone={tone} size={40} />
    {children}
  </div>
);

const M1bPrim = ({ icon, name, beat, d, children }: { icon: IconName; name: string; beat: number; d: number; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ flex: 1, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: T.blue.bg, borderRadius: 14 }}>
      <IconTile name={icon} tone="blue" size={46} solid />
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.15, color: C.ink }}>{name}</div>
        <div style={{ fontSize: 20, lineHeight: 1.25, color: T.blue.fg }}>{children}</div>
      </div>
    </div>
  </div>
);

const M1bPanel = ({ x, w, tone, d, children }: { x: number; w: number; tone: Tone; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      position: 'absolute',
      left: x,
      top: 262,
      width: w,
      height: 696,
      boxSizing: 'border-box',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      ...dl(d),
    }}
  >
    {children}
  </div>
);

const M1bLifeChip = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <Tag tone={tone} size={22}>
    {children}
  </Tag>
);

const M1b_Protocols: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>MCP et A2A : les prises standard des agents</Title>
    <Lede>Deux protocoles ouverts pour ne plus tout rebrancher à la main.</Lede>

    {/* ── MCP ── */}
    <M1bPanel x={120} w={900} tone="blue" d={0}>
      <Eyebrow style={{ position: 'absolute', left: 30, top: 26 }}>MCP · Model Context Protocol</Eyebrow>
      <div style={{ position: 'absolute', left: 30, top: 58, fontSize: 22, color: C.muted }}>
        Standard ouvert proposé par Anthropic (nov. 2024) · agent ↔ outils et données
      </div>
      <div style={{ position: 'absolute', left: 20, top: 104, width: 860, height: 400 }}>
        <svg width={860} height={400} viewBox="0 0 860 400" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {/* without MCP: every app wired to every system */}
          <g className={b.off(2)} fill="none" stroke={C.coral} strokeWidth={3} strokeLinecap="round" opacity={0.85}>
            <path d="M230 70 C 430 70, 430 50, 630 50" pathLength={1} className={b.draw(1)} style={dl(0)} />
            <path d="M230 70 C 430 70, 430 150, 630 150" pathLength={1} className={b.draw(1)} style={dl(40)} />
            <path d="M230 70 C 430 70, 430 250, 630 250" pathLength={1} className={b.draw(1)} style={dl(80)} />
            <path d="M230 70 C 430 70, 430 350, 630 350" pathLength={1} className={b.draw(1)} style={dl(120)} />
            <path d="M230 200 C 430 200, 430 50, 630 50" pathLength={1} className={b.draw(1)} style={dl(160)} />
            <path d="M230 200 C 430 200, 430 150, 630 150" pathLength={1} className={b.draw(1)} style={dl(200)} />
            <path d="M230 200 C 430 200, 430 250, 630 250" pathLength={1} className={b.draw(1)} style={dl(240)} />
            <path d="M230 200 C 430 200, 430 350, 630 350" pathLength={1} className={b.draw(1)} style={dl(280)} />
            <path d="M230 330 C 430 330, 430 50, 630 50" pathLength={1} className={b.draw(1)} style={dl(320)} />
            <path d="M230 330 C 430 330, 430 150, 630 150" pathLength={1} className={b.draw(1)} style={dl(360)} />
            <path d="M230 330 C 430 330, 430 250, 630 250" pathLength={1} className={b.draw(1)} style={dl(400)} />
            <path d="M230 330 C 430 330, 430 350, 630 350" pathLength={1} className={b.draw(1)} style={dl(440)} />
          </g>
          {/* with MCP: one standard plug per app and per system */}
          <g fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round">
            <path d="M230 70 C 300 70, 290 200, 335 200" pathLength={1} className={b.draw(2)} style={dl(300)} />
            <path d="M230 200 L 335 200" pathLength={1} className={b.draw(2)} style={dl(360)} />
            <path d="M230 330 C 300 330, 290 200, 335 200" pathLength={1} className={b.draw(2)} style={dl(420)} />
            <path d="M525 200 C 570 200, 570 50, 630 50" pathLength={1} className={b.draw(2)} style={dl(500)} />
            <path d="M525 200 C 570 200, 570 150, 630 150" pathLength={1} className={b.draw(2)} style={dl(560)} />
            <path d="M525 200 C 570 200, 570 250, 630 250" pathLength={1} className={b.draw(2)} style={dl(620)} />
            <path d="M525 200 C 570 200, 570 350, 630 350" pathLength={1} className={b.draw(2)} style={dl(680)} />
          </g>
          <g className={b.fade(2)} style={dl(900)}>
            <FlowDot path="M230 70 C 300 70, 290 200, 335 200" dur={1.8} r={6} />
            <FlowDot path="M525 200 C 570 200, 570 350, 630 350" dur={1.8} begin={0.6} r={6} />
            <FlowDot path="M230 330 C 300 330, 290 200, 335 200" dur={1.8} begin={1.1} r={6} />
            <FlowDot path="M525 200 C 570 200, 570 50, 630 50" dur={1.8} begin={0.3} r={6} />
          </g>
        </svg>
        <div className={A.left} style={{ ...dl(150) }}>
          <M1bSys x={20} y={38} w={210} h={64} icon="users" tone="violet">
            Assistant RH
          </M1bSys>
          <M1bSys x={20} y={168} w={210} h={64} icon="ticket" tone="violet">
            Agent TI
          </M1bSys>
          <M1bSys x={20} y={298} w={210} h={64} icon="chart" tone="violet">
            Copilote ventes
          </M1bSys>
        </div>
        <div className={A.right} style={{ ...dl(250) }}>
          <M1bSys x={630} y={20} w={210} h={60} icon="doc" tone="teal">
            SharePoint
          </M1bSys>
          <M1bSys x={630} y={120} w={210} h={60} icon="database" tone="teal">
            ERP
          </M1bSys>
          <M1bSys x={630} y={220} w={210} h={60} icon="org" tone="teal">
            CRM
          </M1bSys>
          <M1bSys x={630} y={320} w={210} h={60} icon="mail" tone="teal">
            Courriel
          </M1bSys>
        </div>
        <div className={b.pop(2)} style={{ position: 'absolute', left: 335, top: 148, width: 190, height: 104, ...dl(150) }}>
          <div
            className={A.glow}
            style={{
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 18,
              background: G.blue,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="plug" size={34} color="#fff" sw={2.4} />
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>MCP</span>
            </div>
            <div style={{ marginTop: 4, fontSize: 20, fontWeight: 600 }}>« USB-C de l’IA »</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 30, top: 520, width: 840, height: 44 }}>
        <div className={b.on(1)} style={{ position: 'absolute', inset: 0 }}>
          <div className={b.off(2)} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: C.ink }}>
            <Icon name="alert" size={32} color={C.coral} />
            <span>
              Sans standard : <strong style={{ color: C.coral }}>3 × 4 = 12</strong> intégrations sur mesure
            </span>
          </div>
        </div>
        <div className={b.on(2)} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: C.ink, ...dl(500) }}>
          <Icon name="check" size={32} color={C.green} sw={2.6} />
          <span>
            Avec MCP : <strong style={{ color: C.blue }}>3 + 4 = 7</strong> connecteurs réutilisables
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 30, top: 584, width: 840, display: 'flex', gap: 14 }}>
        <M1bPrim icon="tool" name="Outils" beat={3} d={0}>
          agir : créer un billet
        </M1bPrim>
        <M1bPrim icon="doc" name="Ressources" beat={3} d={150}>
          lire : fichiers, fiches
        </M1bPrim>
        <M1bPrim icon="chat" name="Prompts" beat={3} d={300}>
          gabarits prêts à l’emploi
        </M1bPrim>
      </div>
    </M1bPanel>

    {/* ── A2A ── */}
    <M1bPanel x={1060} w={740} tone="violet" d={150}>
      <Eyebrow c={C.violet} style={{ position: 'absolute', left: 30, top: 26 }}>
        A2A · Agent2Agent
      </Eyebrow>
      <div style={{ position: 'absolute', left: 30, top: 58, fontSize: 22, color: C.muted }}>
        Google (avril 2025), confié à la Linux Foundation · agent ↔ agent
      </div>
      <div className={b.on(4)} style={{ position: 'absolute', left: 30, top: 108, width: 680, height: 118 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 220,
            height: 118,
            boxSizing: 'border-box',
            borderRadius: 16,
            background: T.blue.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Avatar who="agent" size={50} />
          <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>Agent achats</div>
          <div style={{ fontSize: 20, color: T.blue.fg }}>Boréal</div>
        </div>
        <svg width={240} height={118} viewBox="0 0 240 118" style={{ position: 'absolute', left: 220, top: 0, overflow: 'visible' }}>
          <path d="M14 44 H 216" stroke={C.violet} strokeWidth={4} strokeDasharray="10 14" strokeLinecap="round" className={A.march} />
          <path d="M206 34 L 222 44 L 206 54" fill="none" stroke={C.violet} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M226 80 H 24" stroke={C.green} strokeWidth={4} strokeDasharray="10 14" strokeLinecap="round" className={A.march} />
          <path d="M34 70 L 18 80 L 34 90" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <text x={120} y={28} textAnchor="middle" fontSize={20} fontWeight={600} fill={T.violet.fg}>
            tâche
          </text>
          <text x={120} y={112} textAnchor="middle" fontSize={20} fontWeight={600} fill={T.green.fg}>
            résultat
          </text>
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 460,
            top: 0,
            width: 220,
            height: 118,
            boxSizing: 'border-box',
            borderRadius: 16,
            background: T.violet.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <IconTile name="bot" tone="violet" size={50} solid style={{ borderRadius: 999 }} />
          <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>Agent commandes</div>
          <div style={{ fontSize: 20, color: T.violet.fg }}>Fournisseur X</div>
        </div>
      </div>
      <div className={b.on(4)} style={{ position: 'absolute', left: 30, top: 246, width: 680, ...dl(250) }}>
        <Code title="Carte d’agent (publiée en JSON)" size={21} style={{ padding: '16px 22px' }}>
          {'{\n  '}
          <Jk>"nom"</Jk>: <Js>"Agent commandes · Fournisseur X"</Js>
          {',\n  '}
          <Jk>"competences"</Jk>: [<Js>"stock"</Js>, <Js>"delai_livraison"</Js>]
          {',\n  '}
          <Jk>"url"</Jk>: <Js>"https://fournisseur-x.com/a2a"</Js>
          {'\n}'}
        </Code>
      </div>
      <div className={b.on(5)} style={{ position: 'absolute', left: 30, top: 494, width: 680 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: C.soft, marginRight: 4 }}>Cycle d’une tâche</span>
          <M1bLifeChip tone="grey">soumise</M1bLifeChip>
          <FlowArrow w={38} />
          <M1bLifeChip tone="violet">en cours</M1bLifeChip>
          <FlowArrow w={38} />
          <M1bLifeChip tone="green">terminée</M1bLifeChip>
        </div>
      </div>
      <div className={b.on(5)} style={{ position: 'absolute', left: 30, top: 566, width: 680, ...dl(300) }}>
        <Callout title={null} icon="link" tone="blue" size={24} style={{ padding: '14px 22px' }}>
          <strong>MCP</strong> branche un agent sur ses outils ; <strong>A2A</strong> fait collaborer des agents entre eux.
        </Callout>
      </div>
    </M1bPanel>
  </Frame>
);

// ─── 15 · Numbers to remember ───────────────────────────────────────────────
const M1bStat = ({ big, tone, label, d, children }: { big: ReactNode; tone: Tone; label: ReactNode; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      boxSizing: 'border-box',
      height: 250,
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '24px 30px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: `${SHADOW}, inset 7px 0 0 ${STRONG[tone]}`,
      ...dl(d),
    }}
  >
    <div
      style={{
        flex: 'none',
        width: 270,
        fontFamily: display,
        fontWeight: 700,
        fontSize: 96,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: tone === 'yellow' ? C.amber : STRONG[tone],
      }}
    >
      {big}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 26, lineHeight: 1.35, color: C.ink }}>{label}</div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  </div>
);

const M1bYearBar = ({ year, pct, label, tone, d }: { year: string; pct: number; label: string; tone: Tone; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 26 }}>
    <span style={{ width: 56, fontFamily: mono, fontSize: 20, color: C.muted }}>{year}</span>
    <div style={{ position: 'relative', width: 300, height: 14, borderRadius: 7, background: C.panel }}>
      <div
        className={A.grow}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(1.5, pct)}%`, borderRadius: 7, background: STRONG[tone], ...dl(d) }}
      />
    </div>
    <span style={{ fontSize: 20, fontWeight: 600, color: T[tone].fg }}>{label}</span>
  </div>
);

const M1b_Numbers: Page = () => {
  const [ref, beats] = useBeats();
  return (
    <Frame mod={1} beats={3}>
      <Title>Les chiffres à retenir</Title>
      <Lede>Un potentiel réel… et beaucoup de projets qui n’iront pas au bout.</Lede>
      <div ref={ref} style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
          <Icon name="trend" size={30} color={C.green} />
          <Eyebrow c={C.green}>Le potentiel · selon Gartner</Eyebrow>
        </div>
        <M1bStat
          tone="blue"
          d={150}
          big={<CountUp to={33} delay={300} suffix=" %" />}
          label="des applications d’entreprise intégreront de l’IA agentique d’ici 2028"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <M1bYearBar year="2024" pct={1} label="< 1 %" tone="grey" d={500} />
            <M1bYearBar year="2028" pct={33} label="33 %" tone="blue" d={700} />
          </div>
        </M1bStat>
        <M1bStat
          tone="teal"
          d={300}
          big={<CountUp to={15} delay={450} suffix=" %" />}
          label="des décisions de travail quotidiennes prises de façon autonome d’ici 2028"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width={44} height={44} viewBox="0 0 44 44" style={{ display: 'block', flex: 'none' }}>
              <circle cx={22} cy={22} r={17} fill="none" stroke={C.panel} strokeWidth={8} />
              <path d="M22 5 A 17 17 0 0 1 35.75 12" fill="none" stroke={C.teal} strokeWidth={8} pathLength={1} className={A.draw} style={dl(800)} />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 600, color: T.teal.fg }}>≈ 1 décision sur 7, sans humain</span>
          </div>
        </M1bStat>
      </div>
      <div style={{ position: 'absolute', left: 980, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className={b.fade(1)} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
          <Icon name="alert" size={30} color={C.coral} />
          <Eyebrow c={C.coral}>La prudence · selon Gartner</Eyebrow>
        </div>
        <div className={b.on(1)}>
          <M1bStat
            tone="coral"
            d={0}
            big={beats >= 1 ? <CountUp key="on" to={40} delay={200} prefix="> " suffix=" %" /> : '> 0 %'}
            label="des projets d’IA agentique seront annulés d’ici la fin de 2027"
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <Tag tone="coral" size={21}>
                coûts
              </Tag>
              <Tag tone="coral" size={21}>
                valeur floue
              </Tag>
              <Tag tone="coral" size={21}>
                risques mal maîtrisés
              </Tag>
            </div>
          </M1bStat>
        </div>
        <div className={b.on(2)}>
          <M1bStat
            tone="yellow"
            d={0}
            big={
              <span style={{ display: 'block', fontSize: 64, lineHeight: 0.98 }}>
                « Agent
                <br />
                washing »
              </span>
            }
            label="Beaucoup de fournisseurs rebaptisent « agent » un simple chatbot."
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 600, color: T.yellow.fg }}>
              <Icon name="search" size={26} />
              Exigez une démo : quels outils ? quelles actions ?
            </div>
          </M1bStat>
        </div>
      </div>
      <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 868, width: 1680 }}>
        <Callout title={null} icon="scale" tone="yellow" size={29} style={{ padding: '16px 28px', alignItems: 'center' }}>
          <strong>Potentiel réel, mais discipline requise :</strong> commencer petit, mesurer, encadrer.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── 16 · Exercise: agent or not? ───────────────────────────────────────────
const M1bFront = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <IconTile name={icon} tone={tone} size={60} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.05, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </>
);

const M1bBack = ({ yes, children }: { yes: boolean; children: ReactNode }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: yes ? C.green : C.coral,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={yes ? 'check' : 'x'} size={26} color="#fff" sw={3} />
      </span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, letterSpacing: '0.04em', color: yes ? T.green.fg : T.coral.fg }}>
        {yes ? 'AGENT' : 'PAS UN AGENT'}
      </span>
    </div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </>
);

const M1bFlip = ({ d, flipAt, yes, front, back }: { d: number; flipAt: number; yes: boolean; front: ReactNode; back: ReactNode }) => (
  <div className={A.pop} style={{ ...dl(d) }}>
    <FlipCard w={540} h={318} flipAt={flipAt} tone="green" backTone={yes ? 'green' : 'coral'} front={front} back={back} />
  </div>
);

const M1b_Exercise: Page = () => (
  <Frame mod={1} kind="exercice" beats={6}>
    <Title>Agent ou pas agent ?</Title>
    <Lede>Votez à main levée pour chaque situation, puis retournez la carte (clic ou →).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 268, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 28, columnGap: 30 }}>
      <M1bFlip
        d={100}
        flipAt={1}
        yes={false}
        front={
          <M1bFront icon="doc" tone="grey" title="Le correcteur orthographique">
            Il souligne les fautes de votre courriel et propose des corrections.
          </M1bFront>
        }
        back={<M1bBack yes={false}>Il réagit à votre texte, sans objectif propre ni outil : il suggère, c’est vous qui décidez.</M1bBack>}
      />
      <M1bFlip
        d={200}
        flipAt={2}
        yes={false}
        front={
          <M1bFront icon="chat" tone="grey" title="Le chatbot FAQ à réponses fixes">
            Il reconnaît la question et affiche la réponse prévue dans son arbre.
          </M1bFront>
        }
        back={<M1bBack yes={false}>Un arbre de décision scripté : il ne planifie rien et n’agit sur aucun système.</M1bBack>}
      />
      <M1bFlip
        d={300}
        flipAt={3}
        yes
        front={
          <M1bFront icon="inbox" tone="blue" title="L’assistant qui trie les courriels">
            Il lit la boîte du soutien, comprend chaque demande et crée le billet.
          </M1bFront>
        }
        back={<M1bBack yes>Il perçoit (le courriel), raisonne (classer), agit (API de billetterie) et vérifie le résultat.</M1bBack>}
      />
      <M1bFlip
        d={400}
        flipAt={4}
        yes={false}
        front={
          <M1bFront icon="filter" tone="grey" title="La règle Outlook « déplacer si… »">
            Si l’objet contient « facture », le courriel va dans le dossier Finance.
          </M1bFront>
        }
        back={<M1bBack yes={false}>Une règle fixe écrite par un humain : si X, alors Y. Aucun raisonnement, aucune adaptation.</M1bBack>}
      />
      <M1bFlip
        d={500}
        flipAt={5}
        yes
        front={
          <M1bFront icon="calendar" tone="blue" title="L’agent qui prépare la réunion">
            Il bâtit l’ordre du jour, rassemble les documents et envoie les invitations.
          </M1bFront>
        }
        back={<M1bBack yes>Un objectif, plusieurs étapes, des outils (calendrier, SharePoint, courriel) : il choisit la séquence.</M1bBack>}
      />
      <M1bFlip
        d={600}
        flipAt={6}
        yes={false}
        front={
          <M1bFront icon="sparkles" tone="violet" title="ChatGPT qui rédige un texte">
            Vous demandez une note de service ; il la rédige dans la conversation.
          </M1bFront>
        }
        back={<M1bBack yes={false}>Un LLM conversationnel : il produit du texte, mais c’est vous qui copiez, envoyez, publiez.</M1bBack>}
      />
    </div>
  </Frame>
);

// ─── 17–18 · Quizzes ────────────────────────────────────────────────────────
const M1b_Qcm1: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Agent ou LLM ?"
    q="Qu’est-ce qui distingue fondamentalement un agent d’IA d’un LLM utilisé en mode conversation ?"
    explain="Agent = modèle + objectif + outils + mémoire + boucle d’exécution. Le modèle peut être identique : c’est le système autour qui agit. Corollaire : le risque passe de l’erreur de texte à l’erreur d’action."
  >
    <Opt why="Piège ! Le même modèle peut servir de chatbot ou d’agent. Ce qui change, c’est l’architecture autour : objectif, outils, boucle. Pas la taille.">
      Un agent est simplement un LLM plus puissant, entraîné sur davantage de données
    </Opt>
    <Opt ok why="Oui : boucle percevoir–raisonner–agir–observer, appels d’outils et mémoire. C’est ce qui transforme un modèle qui répond en système qui agit.">
      Il poursuit un objectif en plusieurs étapes et agit sur des systèmes au moyen d’outils
    </Opt>
    <Opt why="Non : consulter vos données réduit les erreurs sans les éliminer. Et une erreur d’agent est une erreur d’action, souvent plus coûteuse.">
      Il ne se trompe jamais, puisqu’il vérifie ses réponses dans les données de l’entreprise
    </Opt>
    <Opt why="Non : l’interface ne dit rien. Un agent peut n’avoir aucune fenêtre de clavardage et se déclencher sur un courriel, un horaire ou un événement.">
      Il offre une interface de clavardage plus évoluée et plus agréable
    </Opt>
  </QcmPage>
);

const M1b_Qcm2: Page = () => (
  <QcmPage
    mod={1}
    n={2}
    multi
    title="Mémoire et autonomie"
    q="Boréal déploie un agent de soutien TI. Quelles affirmations sont justes ?"
    explain="La mémoire se conçoit : court terme (le contexte) et long terme (stockage + récupération). L’autonomie se dose action par action : le juste niveau, souvent L2–L3, avec un humain aux étapes critiques."
  >
    <Opt ok why="Oui : la fenêtre de contexte, c’est la mémoire de travail. Ce qui doit durer (préférences, historique) va dans une mémoire à long terme.">
      La fenêtre de contexte est une mémoire à court terme : elle s’efface à la fin de la session
    </Opt>
    <Opt why="Piège ! L’autonomie augmente aussi le risque. Les agents utiles en entreprise sont surtout L2–L3, avec un humain aux points critiques.">
      Plus on lui donne d’autonomie, mieux c’est : visons le niveau L5 dès le départ
    </Opt>
    <Opt ok why="Oui : une mémoire épisodique (historique des billets) lui permet de repérer un problème récurrent sans reposer les mêmes questions.">
      Une mémoire à long terme lui permet de retrouver les billets passés d’un même employé
    </Opt>
    <Opt why="Piège ! Sans mémoire à long terme conçue (stockage + récupération), chaque session repart de zéro. La mémoire se construit.">
      Comme tout LLM, il retient d’office tout ce qu’on lui a dit lors des sessions précédentes
    </Opt>
  </QcmPage>
);

// ─── 19 · Module 1 wrap-up ──────────────────────────────────────────────────
const M1bIdea = ({ n, beat, title, children }: { n: number; beat: number; title: string; children: ReactNode }) => (
  <div
    className={A.left}
    style={{
      boxSizing: 'border-box',
      height: 116,
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '0 30px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: SHADOW,
      ...dl(n * 90),
    }}
  >
    <Num n={n} size={56} />
    <div className={b.left(beat)}>
      <div style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{children}</div>
    </div>
  </div>
);

const M1b_Synthesis: Page = () => (
  <Frame mod={1} kind="synthese" beats={6}>
    <Title>Synthèse du module 1</Title>
    <Lede>Cinq idées à garder en tête… essayez de les retrouver avant chaque clic.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 268, width: 1070, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M1bIdea n={1} beat={1} title="Un agent ne fait pas que répondre : il agit">
        Objectif + outils + mémoire + boucle d’exécution.
      </M1bIdea>
      <M1bIdea n={2} beat={2} title="Penser, agir, observer… recommencer">
        Le cycle ReAct : chaque action est vérifiée avant la suivante.
      </M1bIdea>
      <M1bIdea n={3} beat={3} title="Commencez simple">
        Un workflow d’abord ; de l’autonomie seulement si elle paie.
      </M1bIdea>
      <M1bIdea n={4} beat={4} title="Un écosystème qui se standardise">
        Modèles, frameworks, plateformes ; MCP pour les outils, A2A entre agents.
      </M1bIdea>
      <M1bIdea n={5} beat={5} title="Potentiel réel, discipline requise">
        Plus de 40 % des projets annulés d’ici 2027, selon Gartner : on cadre et on mesure.
      </M1bIdea>
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 1240, top: 268, width: 560 }}>
      <div
        style={{
          boxSizing: 'border-box',
          height: 644,
          padding: '34px 34px 30px',
          background: C.card,
          borderRadius: 'var(--osd-radius)',
          boxShadow: `${SHADOW}, inset 0 8px 0 ${C.yellow}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <KindBadge kind="atelier" />
        <Eyebrow c={T.yellow.fg} style={{ marginTop: 22 }}>
          Et maintenant · 11 h 30
        </Eyebrow>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 52, lineHeight: 1.02, color: C.ink }}>
          Module 2 : identifier un agent
        </div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet tone="yellow" size={26}>
            Choisir un irritant de votre équipe
          </Bullet>
          <Bullet tone="yellow" size={26}>
            Remplir sa carte d’identité
          </Bullet>
          <Bullet tone="yellow" size={26}>
            Le passer à la grille des critères
          </Bullet>
        </div>
        <Callout title="Commencez à y penser" icon="bulb" tone="yellow" size={24} style={{ marginTop: 'auto', padding: '16px 20px' }}>
          Quelle tâche répétitive vous coûte le plus de temps chaque semaine ?
        </Callout>
      </div>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1b_ReAct, M1b_Workflow, M1b_Landscape, M1b_Protocols, M1b_Numbers, M1b_Exercise, M1b_Qcm1, M1b_Qcm2, M1b_Synthesis];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 7 min · DÉMO INTERACTIVE

OBJECTIF — Rendre concret le fonctionnement interne d'un agent : il n'exécute pas un plan figé, il alterne raisonnement et action, et s'ajuste à ce qu'il observe.

DIRE — « On vient de voir qu'un agent appelle des outils. Mais comment décide-t-il lequel, et quand ? La méthode la plus répandue s'appelle ReAct, pour Reason + Act : raisonner, puis agir, puis observer le résultat… et recommencer. Prenons une tâche banale chez Boréal : envoyer à l'équipe un résumé des billets TI critiques de la semaine. »

ANIMATION — Avancez avec → (ou le bouton « Étape suivante »). Commentez chaque ligne :
→ 1–3 : premier tour. « Il pense d'abord : il lui faut les billets. Il appelle l'outil de recherche. Il observe : 7 billets, dont 2 déjà résolus. »
→ 4–6 : « Voilà l'intérêt de l'observation : il ajuste son plan et écarte les billets résolus. Un script aurait tout envoyé. »
→ 7–9 : « Il envoie le courriel et vérifie la confirmation. »
→ 10 : la réponse finale, avec ce qu'il a fait ET ce qu'il a écarté.
Montrez la boucle à gauche : le nœud actif s'allume, le compteur de tours avance.

INTERACTION — Demandez : « À quel moment un humain devrait-il valider ? » Réponse attendue : avant l'envoi, si le courriel part à l'externe ou à la direction. Cliquez « Recommencer » pour rejouer si besoin.

TRANSITION — « Toutes les tâches n'ont pas besoin de cette boucle. Faut-il un agent, ou un simple workflow ? »`,
  `⏱ 6 min · (PAUSE DE 10 H 30 : prendre la pause juste avant ou juste après cette page selon l'heure)

OBJECTIF — Donner le critère le plus utile du module : qui décide du chemin ? Désamorcer le réflexe « il nous faut un agent pour tout ».

DIRE — « Les fournisseurs appellent tout "agent". Voici un spectre plus honnête. »

ANIMATION —
→ beat 1 : Script / RPA. « Des règles fixes, aucun LLM. Copier les factures EDI dans l'ERP : c'est parfait pour ça, prévisible et peu coûteux. »
→ beat 2 : Workflow avec LLM. « Les étapes sont fixes, mais une étape utilise un LLM : lire un courriel et en extraire le numéro de commande. C'est déjà de l'IA générative, mais le chemin est écrit d'avance. »
→ beat 3 : Agent. « Ici, c'est le modèle qui choisit les étapes et les outils. Plus souple… et moins prévisible. »
→ beat 4 : l'accolade. « Le vrai critère : qui décide du chemin ? Le code, ou le modèle ? »
→ beat 5 : la recommandation d'Anthropic (déc. 2024), en substance : commencer simple, n'ajouter de l'autonomie que si elle améliore nettement le résultat.

INTERACTION — « Le tri des 5 000 courriels du service client de Boréal : workflow ou agent ? » Réponse nuancée attendue : un workflow pour le suivi de commande (cas fréquent et cadré), un comportement d'agent seulement pour les demandes ambiguës.

TRANSITION — (Après la pause, si elle a lieu ici.) « Quels outils permettent de construire tout ça ? Un panorama rapide. »`,
  `⏱ 6 min

OBJECTIF — Donner une carte mentale simple du marché, sans entrer dans un comparatif de produits (ce sera au module 7).

DIRE — « Le marché bouge chaque mois. Plutôt que de retenir des noms, retenez trois couches. »

ANIMATION —
→ beat 1 : les Modèles, à la base. « Le cerveau : GPT d'OpenAI, Claude d'Anthropic, Gemini de Google, Mistral en France, Llama de Meta avec des poids ouverts… et Cohere, une entreprise canadienne, souvent citée pour les enjeux de souveraineté. On les loue à l'usage par API. »
→ beat 2 : les Frameworks. « Pour les équipes de développement : LangGraph, Microsoft Agent Framework, qui réunit AutoGen et Semantic Kernel, CrewAI pour les équipes d'agents, LlamaIndex pour le RAG, et les SDK d'OpenAI, d'Anthropic et de Google. Plus de contrôle, plus de code. »
→ beat 3 : les Plateformes. « Clés en main : Copilot Studio si vous êtes sur Microsoft 365, Agentforce dans Salesforce, ServiceNow pour les TI, Gemini Enterprise, Bedrock AgentCore chez AWS… et des outils d'automatisation comme n8n, Make ou Zapier. »
→ beat 4 : le bon réflexe. « Le cas d'usage d'abord, l'outil ensuite. »

INTERACTION — « Quelle couche votre organisation utilise-t-elle déjà ? » Souvent : Copilot ou Microsoft 365. « C'est un critère de choix très fort : on y reviendra demain. »

À ÉVITER — Débattre du « meilleur modèle » : les classements changent tous les trimestres.

TRANSITION — « Pour brancher ces agents sur vos systèmes, deux standards sont en train de s'imposer. »`,
  `⏱ 7 min

OBJECTIF — Expliquer simplement pourquoi MCP et A2A comptent : ils réduisent le coût d'intégration, le vrai frein des projets d'agents.

DIRE — « Imaginez Boréal avec trois assistants : RH, TI, ventes. Et quatre systèmes : SharePoint, l'ERP, le CRM, le courriel. »

ANIMATION —
→ beat 1 : le spaghetti. « Sans standard, chaque assistant a besoin de son propre branchement vers chaque système : 3 × 4 = 12 intégrations à développer et à maintenir. Et chaque nouveau système multiplie le travail. »
→ beat 2 : MCP. « Le Model Context Protocol, proposé par Anthropic en novembre 2024, c'est une prise standard. On l'appelle souvent le "port USB-C de l'IA". Chaque système expose un serveur MCP une fois ; chaque agent sait parler MCP. 3 + 4 = 7. »
→ beat 3 : ce qu'expose un serveur MCP : des outils (agir), des ressources (lire) et des prompts (gabarits).
→ beat 4 : A2A. « MCP relie un agent à ses outils. Agent2Agent, lancé par Google en avril 2025 puis confié à la Linux Foundation, relie des agents entre eux. L'agent achats de Boréal interroge l'agent du fournisseur. Chaque agent publie une carte d'agent : qui il est, ce qu'il sait faire, où le joindre. »
→ beat 5 : le cycle d'une tâche et la phrase à retenir.

ATTENTION — Un serveur MCP donne des accès : il doit respecter le moindre privilège. On en reparle au module 6 (sécurité).

TRANSITION — « Prenons du recul avec quelques chiffres. »`,
  `⏱ 5 min

OBJECTIF — Situer l'enjeu avec des chiffres crédibles, sans hype ni catastrophisme : il y a un vrai potentiel, et un vrai taux d'échec.

DIRE — « Trois prévisions de Gartner, publiées en 2024 et 2025. »

À l'arrivée (colonne de gauche) :
• « D'ici 2028, 33 % des applications d'entreprise intégreront de l'IA agentique, contre moins de 1 % en 2024. Regardez les deux barres : c'est une adoption très rapide. »
• « Toujours d'ici 2028, 15 % des décisions de travail quotidiennes seraient prises de façon autonome. Environ une sur sept. »

→ beat 1 : « Le revers : plus de 40 % des projets d'IA agentique seraient annulés d'ici la fin de 2027. Pourquoi ? Des coûts qui grimpent, une valeur d'affaires floue, des risques mal maîtrisés. »
→ beat 2 : l'agent washing. « Beaucoup de fournisseurs rebaptisent "agent" un simple chatbot. Votre meilleure défense : demander une démo et poser deux questions. Quels outils l'agent utilise-t-il ? Quelles actions fait-il réellement ? »
→ beat 3 : le message. « Potentiel réel, discipline requise. C'est exactement l'objet du jour 2 : commencer petit, mesurer, encadrer. »

PRUDENCE — Ce sont des prévisions d'analystes, pas des faits. Formulez « selon Gartner ».

INTERACTION — « Avez-vous déjà vu passer un produit présenté comme "agent" qui n'en était pas un ? » C'est la transition idéale vers l'exercice.

TRANSITION — « Justement : testons votre œil. Agent ou pas agent ? »`,
  `⏱ 8 min · EXERCICE

OBJECTIF — Appliquer la définition à des situations familières et ancrer les critères : objectif, plusieurs étapes, outils, adaptation.

ANIMATION — Pour chaque carte : lisez la situation, faites voter à main levée (« agent » / « pas agent »), demandez à une personne de justifier, puis retournez la carte d'un clic ou avec →. Les flèches retournent les cartes dans l'ordre.

RÉPONSES —
1. Correcteur orthographique — PAS UN AGENT. Il réagit, sans objectif propre ni outil.
2. Chatbot FAQ à réponses fixes — PAS UN AGENT. Arbre scripté. C'est souvent ce qu'on vend comme « agent » (agent washing).
3. Assistant qui trie les courriels et crée les billets — AGENT. Il perçoit, raisonne, agit sur un système et vérifie.
4. Règle Outlook « déplacer si… » — PAS UN AGENT. Une règle « si X alors Y » écrite par un humain : de l'automatisation classique.
5. Agent qui prépare la réunion — AGENT. Objectif, plusieurs étapes, plusieurs outils ; il choisit la séquence.
6. ChatGPT qui rédige un texte — PAS UN AGENT, dans cet usage. PIÈGE fréquent : « c'est de l'IA, donc c'est un agent ». Nuance utile : si on lui donne des outils (envoyer le courriel, publier), le même modèle devient le cœur d'un agent.

DÉBAT ATTENDU — La carte 6 fait souvent discuter : c'est voulu. Revenez au critère : agit-il sur un système, en plusieurs étapes, vers un objectif ?

TRANSITION — « Vérifions maintenant individuellement avec deux QCM. »`,
  `⏱ 4 min · QCM

OBJECTIF — Vérifier la distinction centrale du module : un agent, c'est un système autour d'un modèle, pas un « meilleur » modèle.

ANIMATION — Lisez la question, faites voter, cliquez la réponse majoritaire. Si c'est un piège, laissez la rétroaction s'afficher, puis cliquez les autres options. → révèle la bonne réponse, → révèle l'essentiel.

RÉPONSES —
• A ✗ PIÈGE — « L'idée reçue la plus répandue. Le même modèle, par exemple GPT ou Claude, peut servir de chatbot dans une fenêtre de clavardage ou de cerveau à un agent. Ce n'est pas la puissance qui change, c'est ce qu'on branche autour. »
• B ✓ — Objectif, plusieurs étapes, outils : la définition vue ce matin, et le simulateur ReAct en est l'illustration.
• C ✗ — « Consulter vos données réduit les erreurs sans les éliminer. Et une erreur d'agent n'est plus une phrase fausse : c'est un courriel envoyé, un billet fermé, une commande passée. »
• D ✗ — « Beaucoup d'agents n'ont aucune interface de clavardage : ils se déclenchent sur un courriel entrant, un horaire ou un événement dans un système. »

MESSAGE CLÉ — Le risque change de nature : de l'erreur de texte à l'erreur d'action. C'est pour ça que les garde-fous occuperont autant de place demain.

TRANSITION — « Deuxième question : la mémoire et l'autonomie. »`,
  `⏱ 5 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Consolider deux notions souvent mal comprises : la mémoire n'est pas magique, et l'autonomie n'est pas un objectif en soi.

ANIMATION — Faites voter option par option (A, B, C, D), cochez les options choisies par la majorité, cliquez « Valider ma sélection », puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, → l'essentiel.

RÉPONSES — A et C.
• A ✓ — La fenêtre de contexte, c'est la mémoire de travail : tout ce qui y est disparaît à la fin de la session.
• B ✗ PIÈGE — « Plus d'autonomie, c'est aussi plus de risque. Rappelez-vous l'échelle d'autonomie : les agents utiles en entreprise sont surtout aux niveaux L2–L3, avec un humain aux points critiques. Pour une réinitialisation de mot de passe, par exemple, on garde une vérification d'identité. »
• C ✓ — La mémoire épisodique : l'historique des billets d'un employé permet de repérer un problème récurrent (« c'est la troisième fois ce mois-ci que votre VPN décroche »).
• D ✗ PIÈGE — « Beaucoup de gens le croient parce que ChatGPT affiche une fonction "mémoire". Mais cette mémoire est une composante construite : on stocke, puis on récupère. Sans elle, chaque session repart de zéro. »

MESSAGE CLÉ — La mémoire se conçoit, l'autonomie se dose.

TRANSITION — « Faisons la synthèse du module avant l'atelier. »`,
  `⏱ 4 min · SYNTHÈSE (fin du module 1, vers 11 h 25)

OBJECTIF — Consolider par le rappel actif : le groupe reformule chaque idée avant qu'elle n'apparaisse.

ANIMATION — Les cinq cases n'affichent d'abord que leur numéro. Pour chacune, demandez : « Quelle était l'idée n° 1 ? » Laissez une ou deux personnes répondre, puis révélez avec →.
→ 1 : un agent agit — objectif, outils, mémoire, boucle.
→ 2 : le cycle ReAct — penser, agir, observer, recommencer.
→ 3 : commencer simple — un workflow suffit souvent.
→ 4 : l'écosystème — trois couches, MCP pour les outils, A2A entre agents.
→ 5 : discipline — plus de 40 % des projets annulés d'ici 2027, selon Gartner.
→ 6 : le panneau de l'atelier.

DIRE — « Si vous ne deviez retenir qu'une phrase : un agent, ce n'est pas un meilleur chatbot, c'est un système qui agit. Et tout ce qui agit doit être encadré. »

ATELIER — « Dans quelques minutes, le module 2 : un atelier de 30 minutes. Vous allez choisir un irritant réel de votre équipe, lui donner une carte d'identité d'agent, puis le passer à une grille de critères. Commencez déjà à y penser : quelle tâche répétitive vous coûte le plus de temps chaque semaine ? »

QUESTIONS — Gardez deux ou trois minutes pour les questions ouvertes du module.

TRANSITION — « Place à l'atelier ! »`,
];
// @@NOTES-END
