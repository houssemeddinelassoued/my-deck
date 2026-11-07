// ─── Module 1 · Sous le capot (suite) : ML, réseaux, entraînement, tokens, Transformer, ───
// génération probabiliste, hallucinations, agents, prompt / contexte / harnais.
// Les pages sont listées (et commentées) dans 10-m1.tsx, dans l’ordre du module.

CSS.push(`
.${P}-nn-e{stroke:${C.rule};stroke-opacity:.6;stroke-width:2}
.${P}-nn-n{fill:#fff;stroke:${C.navy};stroke-width:3}
@keyframes ${P}-nnflash{0%{stroke:${C.rule};stroke-opacity:.6}35%{stroke:${C.electric};stroke-opacity:1;stroke-width:3.6}100%{stroke:${C.rule};stroke-opacity:.6}}
@keyframes ${P}-nnnode{0%{fill:#fff}35%{fill:${C.electric}}100%{fill:#fff}}
.${P}-nn-go .${P}-nn-e{animation:${P}-nnflash 950ms ${EASE} var(--d,0ms) both}
.${P}-nn-go .${P}-nn-n{animation:${P}-nnnode 950ms ${EASE} var(--d,0ms) both}
@keyframes ${P}-arcdraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.${P}-arc{stroke-dasharray:1;animation:${P}-arcdraw 650ms ${EASE} var(--d,0ms) both}
@keyframes ${P}-tokpop{0%{opacity:0;transform:translateY(16px) scale(.8)}100%{opacity:1;transform:none}}
.${P}-tok{animation:${P}-tokpop 460ms ${EASE_BACK} var(--d,0ms) both}
@keyframes ${P}-swap{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.${P}-swap{animation:${P}-swap 480ms ${EASE} var(--d,0ms) both}
.${P}-ball{transition:transform 420ms ${EASE_BACK}}
.${P}-layer{cursor:pointer;transition:box-shadow 320ms ${EASE},transform 320ms ${EASE}}
.${P}-agnode{transition:transform 380ms ${EASE_BACK},box-shadow 320ms ${EASE},opacity 320ms ${EASE}}
`);

// Boutons « onglets » réutilisés par plusieurs pages.
const MTabs = ({ items, cur, set, size = 21 }: { items: string[]; cur: number; set: (i: number) => void; size?: number }) => (
  <div style={{ display: 'flex', gap: 12 }}>
    {items.map((t, i) => (
      <Btn key={t} size={size} tone="blue" ghost={i !== cur} onClick={() => set(i)}>
        {t}
      </Btn>
    ))}
  </div>
);

// ─── IA ⊃ machine learning ⊃ deep learning ⊃ LLM ───────────────────────────
const MRing = ({ d, tone, label, cls, solid = false, pt = 22, size = 27 }: { d: number; tone: Tone; label: string; cls: string; solid?: boolean; pt?: number; size?: number }) => (
  <div
    className={cls}
    style={{
      position: 'absolute',
      left: 470 - d / 2,
      top: 630 - d / 2,
      width: d,
      height: d,
      boxSizing: 'border-box',
      borderRadius: '50%',
      background: solid ? G.blue : T[tone].bg,
      boxShadow: solid ? '0 18px 40px -18px rgba(30,34,232,.7)' : `inset 0 0 0 3px ${T[tone].bd}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: solid ? 'center' : 'flex-start',
      paddingTop: solid ? 0 : pt,
    }}
  >
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.1, color: solid ? '#fff' : T[tone].fg, textAlign: 'center' }}>{label}</span>
  </div>
);

const MDef = ({ tone, term, years, children, cls }: { tone: Tone; term: string; years: string; children: ReactNode; cls: string }) => (
  <div className={cls} style={{ display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
    <span style={{ marginTop: 9, width: 20, height: 20, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>
        {term} <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 500, color: C.muted }}>{years}</span>
      </div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const MChip = ({ children, tone, d }: { children: ReactNode; tone: Tone; d: number }) => (
  <div className={k('swap')} style={{ ...dl(d), padding: '10px 14px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, color: T[tone].fg, fontSize: 20, fontWeight: 600, textAlign: 'center' }}>
    {children}
  </div>
);

const M1_IAMLDL: Page = () => {
  const [ml, setMl] = useState(false);
  return (
    <Frame mod={1} beats={3}>
      <Title>IA, machine learning, deep learning, LLM : emboîtés</Title>
      <Lede>Chaque cercle est un cas particulier du précédent. Copilot vit dans le plus petit.</Lede>
      <MRing d={700} tone="navy" label="Intelligence artificielle" cls={A.pop} pt={42} size={24} />
      <MRing d={540} tone="blue" label="Machine learning" cls={b.pop(1)} />
      <MRing d={380} tone="violet" label="Deep learning" cls={b.pop(2)} />
      <MRing d={220} tone="blue" label="LLM" cls={b.pop(3)} solid size={40} />
      <div style={{ position: 'absolute', left: 900, top: 280, width: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MDef tone="navy" term="Intelligence artificielle" years="depuis 1956" cls={A.right}>
          Des machines qui accomplissent des tâches dites « intelligentes ».
        </MDef>
        <MDef tone="blue" term="Machine learning" years="années 1990" cls={b.on(1)}>
          Au lieu d’écrire les règles, on les fait apprendre à partir d’exemples.
        </MDef>
        <MDef tone="violet" term="Deep learning" years="depuis 2012" cls={b.on(2)}>
          L’apprentissage avec des réseaux de neurones à très nombreuses couches.
        </MDef>
        <MDef tone="pink" term="LLM (grand modèle de langage)" years="depuis 2018" cls={b.on(3)}>
          Un réseau géant entraîné sur du texte et du code : GPT, Claude, Gemini…
        </MDef>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 900, top: 610, width: 900, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(300) }}>
        <PanelTitle icon="loop">Programmer ou apprendre ? Cliquez</PanelTitle>
        <MTabs items={['Programmation classique', 'Machine learning']} cur={ml ? 1 : 0} set={(i) => setMl(i === 1)} size={19} />
        <div key={ml ? 'ml' : 'cl'} style={{ display: 'grid', gridTemplateColumns: '240px 36px 210px 36px minmax(0, 1fr)', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MChip tone={ml ? 'blue' : 'navy'} d={0}>
              {ml ? 'Des données' : 'Des règles écrites par vous'}
            </MChip>
            <MChip tone={ml ? 'green' : 'blue'} d={90}>
              {ml ? 'Les réponses attendues' : 'Des données'}
            </MChip>
          </div>
          <Icon name="arrow" size={32} color={C.faint} sw={2.4} />
          <div className={k('swap')} style={{ ...dl(180), height: 124, borderRadius: 16, background: ml ? G.blue : G.navy, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 22, fontWeight: 700 }}>
            <Icon name={ml ? 'brain' : 'code'} size={34} sw={2.2} />
            {ml ? 'Entraînement' : 'Programme'}
          </div>
          <Icon name="arrow" size={32} color={C.faint} sw={2.4} />
          <MChip tone={ml ? 'violet' : 'green'} d={280}>
            {ml ? 'Des règles apprises : le modèle' : 'Des réponses'}
          </MChip>
        </div>
        <div key={ml ? 'mlc' : 'clc'} className={k('swap')} style={{ ...dl(360), fontSize: 20, color: C.soft }}>
          {ml ? (
            <>10 000 tickets déjà triés → le modèle apprend seul à trier les suivants.</>
          ) : (
            <>
              <span style={{ fontFamily: mono, fontSize: 19, color: C.ink }}>{"if (titre.includes('bloquant')) priorite = 'haute'"}</span> : une règle à la fois.
            </>
          )}
        </div>
      </div>
    </Frame>
  );
};

// ─── Neurone et réseau de neurones ──────────────────────────────────────────
const NEU_IN = [
  { label: 'Client bloqué', w: 0.7 },
  { label: 'En production', w: 0.5 },
  { label: 'Simple faute de frappe', w: -0.6 },
];
const NEU_BIAS = -0.6;
const NEU_Y = [90, 200, 310];
const NEU_X0 = 400;
const NEU_CX = 610;
const NEU_CY = 200;

const NN_LAYERS = [4, 6, 6, 3];
const NN_X = [70, 250, 430, 610];
const nnY = (n: number, j: number) => 190 + (j - (n - 1) / 2) * 60;

const M1_Neurones: Page = () => {
  const [x, setX] = useState([1, 0, 0]);
  const [wave, setWave] = useState(0);
  const z = NEU_IN.reduce((s, e, i) => s + e.w * x[i], NEU_BIAS);
  const p = 1 / (1 + Math.exp(-8 * z));
  const urgent = p >= 0.5;
  const sgn = (v: number) => (v < 0 ? '−' : '+');
  return (
    <Frame mod={1} beats={2}>
      <Title>Un neurone artificiel : multiplier, additionner, décider</Title>
      <Lede>Exemple jouet : un neurone qui décide si un ticket est urgent. Activez les entrées.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, height: 470, background: C.card, borderRadius: 20, boxShadow: SHADOW }}>
        <svg width={900} height={470} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          {NEU_IN.map((e, i) => {
            const on = x[i] === 1;
            const col = e.w > 0 ? C.green : C.coral;
            return (
              <g key={e.label}>
                <line x1={NEU_X0} y1={NEU_Y[i]} x2={NEU_CX} y2={NEU_CY} stroke={on ? col : C.rule} strokeWidth={2 + Math.abs(e.w) * 9} strokeLinecap="round" style={{ transition: 'stroke 300ms ease' }} />
                <circle cx={NEU_X0} cy={NEU_Y[i]} r={14} fill={on ? col : '#fff'} stroke={col} strokeWidth={3} style={{ transition: 'fill 300ms ease' }} />
                <text x={NEU_X0 + 52} y={NEU_Y[i] + (NEU_CY - NEU_Y[i]) * 0.28 - 12} fontFamily={mono} fontSize={21} fontWeight={700} fill={col} stroke="#fff" strokeWidth={6} paintOrder="stroke">
                  ×{fr(e.w, 1)}
                </text>
              </g>
            );
          })}
          <line x1={NEU_CX} y1={NEU_CY} x2={725} y2={NEU_CY} stroke={urgent ? C.coral : C.green} strokeWidth={6} strokeLinecap="round" />
          <circle cx={NEU_CX} cy={NEU_CY} r={64} fill={C.electric} fillOpacity={0.12 + 0.88 * p} stroke={C.navy} strokeWidth={3} style={{ transition: 'fill-opacity 400ms ease' }} />
          <text x={NEU_CX} y={NEU_CY + 16} textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={46} fill={p > 0.5 ? '#fff' : C.navy}>
            Σ
          </text>
        </svg>
        {NEU_IN.map((e, i) => (
          <div key={e.label} style={{ position: 'absolute', left: 28, top: NEU_Y[i] - 22, width: 345 }}>
            <Toggle on={x[i] === 1} onChange={(v) => setX((o) => o.map((u, j) => (j === i ? (v ? 1 : 0) : u)))} label={e.label} tone={e.w > 0 ? 'green' : 'coral'} size={23} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: 735, top: NEU_CY - 52, width: 140, height: 104, borderRadius: 16, background: urgent ? T.coral.bg : T.green.bg, boxShadow: `inset 0 0 0 3px ${urgent ? C.coral : C.green}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 300ms ease' }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: urgent ? T.coral.fg : T.green.fg }}>{urgent ? 'URGENT' : 'normal'}</span>
          <span style={{ fontFamily: mono, fontSize: 21, color: C.soft }}>{fr(p * 100, 0)} %</span>
        </div>
        <div style={{ position: 'absolute', left: 28, top: 392, right: 28, fontFamily: mono, fontSize: 22, color: C.ink, background: C.panel, borderRadius: 12, padding: '12px 16px' }}>
          Σ = {NEU_IN.map((e, i) => `${i ? ` ${sgn(e.w)} ` : e.w < 0 ? '−' : ''}${fr(Math.abs(e.w), 1)}×${x[i]}`).join('')} − {fr(Math.abs(NEU_BIAS), 1)} = <strong style={{ color: urgent ? C.coral : C.green }}>{z >= 0 ? '+' : '−'}{fr(Math.abs(z), 1)}</strong>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 770, width: 900 }}>
        <Callout tone="blue" icon="bulb" title="Ce que fait l’entraînement" size={22}>
          Les poids (0,7 ; 0,5 ; −0,6) ne sont écrits par personne : l’entraînement les trouve. Un LLM, c’est ce calcul répété des milliards de fois.
        </Callout>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1080, top: 270, width: 720, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 20px', ...dl(250) }}>
        <PanelTitle icon="brain">Un réseau = des couches de neurones</PanelTitle>
        <svg width={680} height={380} style={{ display: 'block', marginTop: 8 }}>
          <g key={wave} className={wave ? k('nn-go') : undefined}>
            {NN_LAYERS.slice(0, -1).map((n, l) =>
              Array.from({ length: n }, (_, a) =>
                Array.from({ length: NN_LAYERS[l + 1] }, (_, c) => (
                  <line key={`${l}-${a}-${c}`} className={k('nn-e')} x1={NN_X[l]} y1={nnY(n, a)} x2={NN_X[l + 1]} y2={nnY(NN_LAYERS[l + 1], c)} style={dl(l * 300)} />
                )),
              ),
            )}
            {NN_LAYERS.map((n, l) => Array.from({ length: n }, (_, a) => <circle key={`n${l}-${a}`} className={k('nn-n')} cx={NN_X[l]} cy={nnY(n, a)} r={15} style={dl(l * 300)} />))}
          </g>
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) 150px', fontSize: 19, color: C.muted, textAlign: 'center' }}>
          <span>entrées</span>
          <span>couches cachées</span>
          <span>sortie</span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
          <Btn icon="bolt" size={21} onClick={() => setWave((w) => w + 1)}>
            Propager un signal
          </Btn>
        </div>
      </div>
      <div className={b.on(2)} style={{ position: 'absolute', left: 1080, top: 850, width: 720, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
        <div style={{ background: T.violet.bg, borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: T.violet.fg }}>175 Md</div>
          <div style={{ fontSize: 19, color: C.soft }}>de poids dans GPT-3 (2020)</div>
        </div>
        <div style={{ background: T.blue.bg, borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: T.blue.fg }}>96 couches</div>
          <div style={{ fontSize: 19, color: C.soft }}>empilées ; les modèles de 2026 sont plus grands</div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Entraînement : descente de gradient + 3 phases ─────────────────────────
const LOSS = (w: number) => 3.2 * (w - 0.68) ** 2 + 0.04;
const GX = (w: number) => 30 + w * 780;
const GY = (l: number) => 280 - (l / 1.6) * 250;
const LOSS_PATH = Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'}${GX(i / 60).toFixed(1)} ${GY(LOSS(i / 60)).toFixed(1)}`).join(' ');
type GdState = { w: number; n: number; trail: number[] };
const GD0: GdState = { w: 0.04, n: 0, trail: [] };

const M1_Entrainement: Page = () => {
  const [s, setS] = useState<GdState>(GD0);
  const [lr, setLr] = useState(0.1);
  const lrRef = useRef(lr);
  lrRef.current = lr;
  const pas = () =>
    setS((o) => {
      const w = Math.min(1, Math.max(0, o.w - lrRef.current * 6.4 * (o.w - 0.68)));
      return { w, n: o.n + 1, trail: [...o.trail.slice(-14), o.w] };
    });
  const dix = () => {
    for (let i = 0; i < 10; i++) window.setTimeout(pas, i * 190);
  };
  const verdict = lr < 0.06 ? { t: 'lent', tone: 'yellow' as Tone } : lr < 0.2 ? { t: 'efficace', tone: 'green' as Tone } : lr < 0.3 ? { t: 'ça oscille', tone: 'yellow' as Tone } : { t: 'ça diverge !', tone: 'coral' as Tone };
  return (
    <Frame mod={1} beats={4}>
      <Title>Entraîner un modèle : réduire l’erreur, pas à pas</Title>
      <Lede>Deviner le token suivant, mesurer l’erreur, ajuster les poids… des milliers de milliards de fois.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 900, height: 550, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px' }}>
        <PanelTitle icon="trend">Descente de gradient (version jouet)</PanelTitle>
        <svg width={840} height={300} style={{ display: 'block', marginTop: 6 }}>
          <line x1={GX(0.68)} y1={20} x2={GX(0.68)} y2={290} stroke={C.green} strokeWidth={2} strokeDasharray="6 8" />
          <text x={GX(0.68) + 10} y={40} fontSize={19} fill={C.green} fontWeight={700}>
            erreur minimale
          </text>
          <path d={LOSS_PATH} fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" />
          <text x={36} y={30} fontSize={18} fill={C.muted}>
            erreur ↑
          </text>
          <text x={640} y={296} fontSize={18} fill={C.muted}>
            valeur d’un poids →
          </text>
          {s.trail.map((w, i) => (
            <circle key={`${s.n}-${i}`} cx={GX(w)} cy={GY(LOSS(w))} r={6} fill={C.violet} fillOpacity={0.15 + (i / Math.max(1, s.trail.length)) * 0.45} />
          ))}
          <g className={k('ball')} style={{ transform: `translate(${GX(s.w)}px, ${GY(LOSS(s.w))}px)` }}>
            <circle r={17} fill={C.coral} stroke="#fff" strokeWidth={4} />
          </g>
        </svg>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Btn icon="play" size={20} onClick={pas}>
            Un pas
          </Btn>
          <Btn icon="loop" size={20} ghost onClick={dix}>
            10 pas
          </Btn>
          <Btn icon="reset" size={20} ghost tone="grey" onClick={() => setS(GD0)} />
          <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 21, color: C.soft }}>
            étape <strong style={{ color: C.ink }}>{s.n}</strong> · erreur <strong style={{ color: LOSS(s.w) < 0.08 ? C.green : C.coral }}>{fr(LOSS(s.w), 2)}</strong>
          </span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20, color: C.soft, whiteSpace: 'nowrap' }}>Taux d’apprentissage</span>
          <Range value={lr} onChange={setLr} min={0.02} max={0.32} step={0.02} w={330} />
          <span style={{ fontFamily: mono, fontSize: 20, color: C.ink }}>{fr(lr, 2)}</span>
          <Tag tone={verdict.tone} size={18}>
            {verdict.t}
          </Tag>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card tone="navy" icon="database" title="1 · Pré-entraînement" size={20} pad={18} cls={b.on(1)}>
          Prédire le token suivant sur des milliers de milliards de tokens : web, livres, code public. Des semaines sur des milliers de GPU.
        </Card>
        <Card tone="blue" icon="chat" title="2 · Affinage par instructions" size={20} pad={18} cls={b.on(2)}>
          Des exemples « consigne → bonne réponse » : il apprend à suivre une demande et à converser.
        </Card>
        <Card tone="violet" icon="humanCheck" title="3 · Alignement (RLHF)" size={20} pad={18} cls={b.on(3)}>
          Des humains comparent des réponses ; il apprend à préférer les plus utiles et les plus sûres.
        </Card>
      </div>
      <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
        <Callout tone="coral" icon="lock" title="Ensuite, les poids sont figés" size={23}>
          Le modèle n’apprend pas pendant votre session et ses connaissances s’arrêtent à une date de coupure. Ce qu’il « sait » de votre projet vient uniquement du contexte envoyé.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Tokens ─────────────────────────────────────────────────────────────────
const TOK_SAMPLES = [
  { label: 'Du code', text: "const urgents = tickets.filter(t => t.priorite === 'haute');", toks: ['const', ' urg', 'ents', ' =', ' tickets', '.filter', '(t', ' =>', ' t', '.prior', 'ite', ' ===', " '", 'ha', 'ute', "');"] },
  { label: 'Du français', text: 'Le ticket bloque la mise en production depuis hier.', toks: ['Le', ' ticket', ' blo', 'que', ' la', ' mise', ' en', ' production', ' depuis', ' hier', '.'] },
  { label: 'La même chose en anglais', text: 'The ticket has been blocking the release since yesterday.', toks: ['The', ' ticket', ' has', ' been', ' blocking', ' the', ' release', ' since', ' yesterday', '.'] },
  { label: 'Un identifiant', text: 'getTicketsByPriorityAndStatus', toks: ['get', 'Tickets', 'By', 'Priority', 'And', 'Status'] },
];
const TOK_TONES: Tone[] = ['blue', 'violet', 'green', 'yellow', 'pink'];
const tokId = (t: string) => {
  let h = 7;
  for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 99991;
  return h + 100;
};

const M1_Tokens: Page = () => {
  const [cur, setCur] = useState(0);
  const [ids, setIds] = useState(false);
  const s = TOK_SAMPLES[cur];
  return (
    <Frame mod={1} beats={1}>
      <Title>Le modèle ne lit pas des mots : il lit des tokens</Title>
      <Lede>Un token est un morceau de mot. Choisissez un texte pour voir son découpage (illustratif).</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 268 }}>
        <MTabs items={TOK_SAMPLES.map((x) => x.label)} cur={cur} set={setCur} size={20} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 344, width: 1680, height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(120) }}>
        <div key={cur} style={{ minHeight: 180 }}>
          {s.toks.map((t, i) => {
            const tn = T[TOK_TONES[i % TOK_TONES.length]];
            return (
              <span key={`${cur}-${i}`} className={k('tok')} style={{ ...dl(i * 55), display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 6px 12px 0', verticalAlign: 'top' }}>
                <span style={{ fontFamily: mono, fontSize: 34, color: C.ink, whiteSpace: 'pre', padding: '5px 10px', borderRadius: 10, background: tn.bg, boxShadow: `inset 0 0 0 2px ${tn.bd}` }}>{t.replace(/^ /, '·')}</span>
                <span style={{ fontFamily: mono, fontSize: 18, color: C.muted, marginTop: 4, visibility: ids ? 'visible' : 'hidden' }}>{tokId(t)}</span>
              </span>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 20, display: 'flex', alignItems: 'center', gap: 28, fontSize: 22, color: C.soft }}>
          <span>
            <strong style={{ color: C.ink }}>{s.text.length}</strong> caractères
          </span>
          <span>
            <strong style={{ color: C.electric }}>{s.toks.length}</strong> tokens
          </span>
          <span>
            ≈ <strong style={{ color: C.ink }}>{fr(s.text.length / s.toks.length, 1)}</strong> caractères par token
          </span>
          <span style={{ marginLeft: 'auto' }}>
            <Toggle on={ids} onChange={setIds} label="Ce que voit le modèle : des nombres" tone="violet" size={21} />
          </span>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 680, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 28 }}>
        <Card tone="yellow" icon="euro" title="La facture" size={21} pad={24}>
          Les crédits IA du chat et des agents se calculent en tokens, en entrée comme en sortie.
        </Card>
        <Card tone="blue" icon="layers" title="La limite" size={21} pad={24}>
          La fenêtre de contexte se mesure en tokens : au-delà, le modèle oublie ou on résume.
        </Card>
        <Card tone="coral" icon="eyeOff" title="Les angles morts" size={21} pad={24}>
          Compter des lettres, épeler, calculer : il voit des morceaux, pas des caractères.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Transformer : l’attention ──────────────────────────────────────────────
type AttMap = Record<number, [number, number][]>;
const ATT_SETS: { label: string; words: string[]; att: AttMap; why: Record<number, string>; def: number }[] = [
  {
    label: 'Une phrase',
    words: ['Le', 'serveur', 'refuse', 'le', 'ticket', 'car', 'il', 'est', 'trop', 'long'],
    att: {
      6: [[4, 0.62], [1, 0.22], [2, 0.08], [9, 0.08]],
      9: [[4, 0.48], [6, 0.28], [8, 0.16], [1, 0.08]],
      2: [[1, 0.52], [4, 0.3], [6, 0.1], [9, 0.08]],
    },
    why: {
      6: '« il » regarde surtout « ticket » : le modèle comprend que c’est le ticket qui est trop long, pas le serveur.',
      9: '« long » se rattache à « ticket » et à « il » : c’est une propriété du ticket.',
      2: '« refuse » cherche qui agit (« serveur ») et sur quoi (« ticket »).',
    },
    def: 6,
  },
  {
    label: 'Du code',
    words: ['tickets', '.filter', '(', 't', '=>', 't', '.statut', '===', "'fini'", ')'],
    att: {
      5: [[0, 0.5], [3, 0.3], [1, 0.12], [6, 0.08]],
      8: [[6, 0.58], [7, 0.22], [5, 0.12], [0, 0.08]],
      6: [[5, 0.46], [0, 0.32], [8, 0.14], [1, 0.08]],
    },
    why: {
      5: '« t » renvoie à un élément de « tickets » : voilà pourquoi Copilot propose ensuite des champs de ticket.',
      8: '« \'fini\' » regarde « .statut » : la valeur proposée doit ressembler à un statut.',
      6: '« .statut » regarde « t » et « tickets » : il cherche quels champs existent.',
    },
    def: 5,
  },
];
const ATT_CW = 18;
const ATT_GAP = 22;
const attLayout = (words: string[]) => {
  const ws = words.map((w) => w.length * ATT_CW + 30);
  const total = ws.reduce((a, x) => a + x, 0) + ATT_GAP * (words.length - 1);
  let x = (1680 - total) / 2;
  return ws.map((w) => {
    const r = { x, w, c: x + w / 2 };
    x += w + ATT_GAP;
    return r;
  });
};
const attOf = (set: (typeof ATT_SETS)[number], i: number): [number, number][] => {
  if (set.att[i]) return set.att[i];
  const out: [number, number][] = [];
  if (i > 0) out.push([i - 1, 0.5]);
  if (i < set.words.length - 1) out.push([i + 1, 0.3]);
  if (i > 1) out.push([0, 0.2]);
  return out;
};

const M1_Transformer: Page = () => {
  const [si, setSi] = useState(0);
  const set = ATT_SETS[si];
  const [sel, setSel] = useState<number>(ATT_SETS[0].def);
  const pos = attLayout(set.words);
  const arcs = attOf(set, sel);
  const wOf = (j: number) => arcs.find(([t]) => t === j)?.[1] ?? 0;
  const Y0 = 262;
  return (
    <Frame mod={1} beats={1}>
      <Title>Le Transformer : chaque token regarde tous les autres</Title>
      <Lede>C’est le mécanisme d’attention (Google, 2017, « Attention Is All You Need »). Cliquez un mot : vers qui regarde-t-il ?</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 268 }}>
        <MTabs
          items={ATT_SETS.map((x) => x.label)}
          cur={si}
          set={(i) => {
            setSi(i);
            setSel(ATT_SETS[i].def);
          }}
          size={20}
        />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 330, width: 1680, height: 400, background: C.card, borderRadius: 20, boxShadow: SHADOW, ...dl(120) }}>
        <svg width={1680} height={400} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          {arcs.map(([t, w], r) => {
            const a = pos[sel].c;
            const c = pos[t].c;
            const h = Math.min(230, 50 + Math.abs(a - c) * 0.45);
            return (
              <path
                key={`${si}-${sel}-${t}`}
                className={k('arc')}
                pathLength={1}
                d={`M${a} ${Y0} Q${(a + c) / 2} ${Y0 - h} ${c} ${Y0}`}
                fill="none"
                stroke={C.violet}
                strokeOpacity={0.35 + 0.65 * w}
                strokeWidth={3 + w * 24}
                strokeLinecap="round"
                style={dl(r * 120)}
              />
            );
          })}
        </svg>
        {set.words.map((wd, j) => {
          const w = wOf(j);
          const me = j === sel;
          return (
            <div key={`${si}-${j}`} style={{ position: 'absolute', left: pos[j].x, top: 270, width: pos[j].w }}>
              <button
                type="button"
                data-osd-interactive
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSel(j);
                }}
                style={{
                  width: '100%',
                  height: 60,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 12,
                  fontFamily: mono,
                  fontSize: 30,
                  fontWeight: 600,
                  color: me ? '#fff' : C.ink,
                  background: me ? C.electric : w ? `color-mix(in srgb, ${C.violet} ${Math.round(12 + w * 60)}%, #fff)` : C.panel,
                  boxShadow: me ? '0 10px 24px -12px rgba(30,34,232,.8)' : 'none',
                  transition: 'background 300ms ease, color 300ms ease',
                }}
              >
                {wd}
              </button>
              <div style={{ marginTop: 8, textAlign: 'center', fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.violet, visibility: w ? 'visible' : 'hidden' }}>{fr(w * 100, 0)} %</div>
            </div>
          );
        })}
      </div>
      <div key={`${si}-${sel}`} className={k('swap')} style={{ position: 'absolute', left: 120, top: 748, width: 1680, display: 'flex', gap: 14, alignItems: 'center', fontSize: 23, color: C.soft }}>
        <Icon name="eye" size={28} color={C.violet} sw={2.2} />
        <span>{set.why[sel] ?? 'Sans lien fort : ce mot regarde surtout ses voisins.'}</span>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 820, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 36px minmax(0,1fr) 36px minmax(0,1fr) 36px minmax(0,1fr) 36px minmax(0,1fr)', alignItems: 'center', gap: 6 }}>
        {(
          [
            ['code', 'Tokens', 'le texte découpé', 'navy'],
            ['layers', 'Vecteurs', 'chaque token devient une liste de nombres', 'blue'],
            ['brain', '× N couches', 'attention + calcul, des dizaines de fois', 'violet'],
            ['chart', 'Probabilités', 'pour chaque token possible', 'pink'],
            ['loop', 'Un token choisi', 'ajouté au texte… et on recommence', 'green'],
          ] as [IconName, string, string, Tone][]
        ).flatMap(([ic, t, s2, tone], i) => [
          i ? <Icon key={`a${i}`} name="arrow" size={28} color={C.faint} sw={2.4} /> : null,
          <div key={t} style={{ height: 140, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>
              <Icon name={ic} size={26} sw={2.2} /> {t}
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.35, color: C.soft }}>{s2}</div>
          </div>,
        ])}
      </div>
    </Frame>
  );
};

// ─── Génération probabiliste + température ──────────────────────────────────
const GEN_CANDS = [
  { tok: ' maintenant', p: 0.46, v: 'ok' },
  { tok: ' new Date()', p: 0.3, v: 'warn' },
  { tok: ' Date.now()', p: 0.12, v: 'warn' },
  { tok: ' ticket.creeLe', p: 0.07, v: 'bad' },
  { tok: ' aujourdhui', p: 0.05, v: 'bad2' },
];
const GEN_VERDICT: Record<string, { t: string; tone: Tone }> = {
  ok: { t: 'correct', tone: 'green' },
  warn: { t: 'ignore le paramètre', tone: 'yellow' },
  bad: { t: 'logique fausse', tone: 'coral' },
  bad2: { t: 'variable inventée', tone: 'coral' },
};

const GenCand = ({ i, probs, picked }: { i: number; probs: number[]; picked: number | null }) => {
  const c = GEN_CANDS[i];
  const v = GEN_VERDICT[c.v];
  const pct = probs[i] * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62 }}>
      <span style={{ width: 270, flex: 'none', fontFamily: mono, fontSize: 24, color: picked === i ? '#fff' : C.ink, background: picked === i ? C.electric : C.panel, borderRadius: 10, padding: '8px 12px', transition: 'all 250ms ease' }}>
        {c.tok.replace(' ', '·')}
      </span>
      <div style={{ flex: 1, height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: STRONG[v.tone], transition: `width 400ms ${EASE}` }} />
      </div>
      <span style={{ width: 92, flex: 'none', textAlign: 'right', fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{fr(pct, 0)} %</span>
      <span style={{ width: 250, flex: 'none' }}>
        <Tag tone={v.tone} size={18}>
          {v.t}
        </Tag>
      </span>
    </div>
  );
};

const M1_Generation: Page = () => {
  const [temp, setTemp] = useState(0.7);
  const [picked, setPicked] = useState<number | null>(null);
  const [hist, setHist] = useState<number[]>([]);
  const w = GEN_CANDS.map((c) => c.p ** (1 / Math.max(0.05, temp)));
  const sum = w.reduce((a, x) => a + x, 0);
  const probs = w.map((x) => x / sum);
  const sample = () => {
    let r = Math.random();
    let i = 0;
    while (i < probs.length - 1 && r > probs[i]) {
      r -= probs[i];
      i++;
    }
    setPicked(i);
    setHist((h) => [...h.slice(-11), i]);
  };
  const bad = hist.filter((i) => GEN_CANDS[i].v !== 'ok').length;
  return (
    <Frame mod={1} kind="demo" beats={1}>
      <Title>Génération probabiliste : le token suivant, tiré au sort</Title>
      <Lede>Le modèle calcule une probabilité pour chaque suite possible, puis en tire une. Réglez la température et tirez.</Lede>
      <CodeDark file="src/tickets.js" size={24} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
        <Cc>{'// Un ticket est en retard si son échéance est dépassée'}</Cc>
        {'\n'}
        <Ck>export function</Ck> <Cf>estEnRetard</Cf>(ticket, maintenant) {'{'}
        {'\n  '}
        <Ck>return new</Ck> <Cf>Date</Cf>(ticket.echeance) {'<'}
        <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.15)', borderRadius: 4 }}>{picked === null ? '▌' : GEN_CANDS[picked].tok}</span>
      </CodeDark>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 486, width: 1170, display: 'flex', flexDirection: 'column', gap: 6, ...dl(150) }}>
        {GEN_CANDS.map((c, i) => (
          <GenCand key={c.tok} i={i} probs={probs} picked={picked} />
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 486, width: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={18}>
          Température
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 50, color: C.electric }}>{fr(temp, 1)}</span>
          <span style={{ fontSize: 21, color: C.muted }}>{temp < 0.4 ? 'prévisible' : temp < 1.1 ? 'équilibrée' : 'créative… et risquée'}</span>
        </div>
        <Range value={temp} onChange={setTemp} min={0.1} max={2} step={0.1} w={410} />
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <Btn icon="sparkles" size={21} onClick={sample}>
            Tirer un token
          </Btn>
          <Btn
            icon="reset"
            ghost
            tone="grey"
            size={21}
            onClick={() => {
              setPicked(null);
              setHist([]);
            }}
          />
        </div>
        <div style={{ marginTop: 14, fontSize: 21, color: C.soft }}>
          Tirages : <strong>{hist.length}</strong> · suites douteuses : <strong style={{ color: bad ? C.coral : C.green }}>{bad}</strong>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
        <Callout tone="yellow" icon="loop" title="Puis il recommence, token après token" size={23}>
          Le token tiré est ajouté au texte, et il prédit le suivant. Même question, réponse différente : c’est normal. <strong>Plausible</strong> ne veut pas dire <strong>correct</strong>.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Hallucinations ─────────────────────────────────────────────────────────
const HAL = [
  {
    tag: 'Méthode',
    title: 'Une méthode qui n’existe pas',
    code: "const tries = tickets.sortBy('priorite');",
    back: 'Array.prototype.sortBy n’existe pas en JavaScript : le nom vient de Lodash ou d’autres langages. Détecté dès l’exécution… ou par un test.',
  },
  {
    tag: 'Dépendance',
    title: 'Un paquet npm inventé',
    code: 'npm install parafo-date-utils',
    back: 'Le paquet n’existe pas… ou pire, quelqu’un l’a publié exprès pour piéger les copier-coller (« slopsquatting »). Vérifiez auteur, téléchargements et date sur npmjs.com.',
  },
  {
    tag: 'Réglage',
    title: 'Une option de configuration imaginaire',
    code: '"github.copilot.autoTests": true',
    back: 'Ce réglage n’existe pas. VS Code l’ignore, sans erreur bloquante. Seule la documentation officielle fait foi.',
  },
];

const M1_Hallucinations: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Hallucination : du faux, dit avec aplomb</Title>
    <Lede>Il ne consulte pas une base de faits : il complète avec le plus plausible, même quand il ne sait pas.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 36 }}>
      {HAL.map((h, i) => (
        <FlipCard
          key={h.tag}
          w={536}
          h={380}
          flipAt={i + 1}
          tone="coral"
          backTone="green"
          cls={A.in}
          style={dl(i * 140)}
          front={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Tag tone="coral" size={18}>
                  Suggestion · {h.tag}
                </Tag>
              </div>
              <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{h.title}</div>
              <div style={{ fontFamily: mono, fontSize: 21, lineHeight: 1.4, background: '#0F1730', color: '#E6EDF7', borderRadius: 12, padding: '14px 16px', whiteSpace: 'pre-wrap' }}>{h.code}</div>
            </div>
          }
          back={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 25, fontWeight: 700, color: T.green.fg }}>
                <Icon name="search" size={28} sw={2.4} /> Ce qui cloche
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{h.back}</div>
            </div>
          }
        />
      ))}
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 36 }}>
      <Callout tone="coral" icon="alert" title="Pourquoi ça arrive" size={22}>
        Motif rare ou absent des données · contexte incomplet · question qui présuppose la réponse · un modèle entraîné à répondre, pas à dire « je ne sais pas ».
      </Callout>
      <Callout tone="green" icon="shieldCheck" title="Vos parades" size={22}>
        Exécuter et tester · fournir le bon contexte (#fichier, doc) · demander la source et la vérifier · se méfier des API récentes. On y revient au Module 8.
      </Callout>
    </div>
  </Frame>
);

// ─── L’agent et la boucle agentique ─────────────────────────────────────────
type AgK = 'plan' | 'act' | 'obs' | 'done';
const AG_KIND: Record<AgK, { icon: IconName; tone: Tone; label: string }> = {
  plan: { icon: 'brain', tone: 'violet', label: 'Réfléchir' },
  act: { icon: 'tool', tone: 'blue', label: 'Agir' },
  obs: { icon: 'eye', tone: 'teal', label: 'Observer' },
  done: { icon: 'humanCheck', tone: 'green', label: 'Conclure' },
};
const AG_STEPS: { k: AgK; t: string }[] = [
  { k: 'plan', t: 'Lire le test qui échoue avant de toucher au code' },
  { k: 'act', t: 'lire_fichier · test/tickets.test.js' },
  { k: 'obs', t: 'Attendu : points parmi 1, 2, 3, 5, 8, 13' },
  { k: 'act', t: 'éditer · src/tickets.js → estPointsValide()' },
  { k: 'act', t: 'terminal · npm run test:atelier4  (vous approuvez)' },
  { k: 'obs', t: '✗ 1 échec : trim() appelé sur undefined' },
  { k: 'plan', t: 'Un titre absent doit lever une erreur claire' },
  { k: 'act', t: 'éditer · src/tickets.js → validerTicket()' },
  { k: 'obs', t: '✓ tous les tests de l’atelier 4 passent' },
  { k: 'done', t: 'Résumé + diff proposés : à vous de relire' },
];
const AG_NODES: { k: AgK; left: number; top: number }[] = [
  { k: 'plan', left: 390, top: 295 },
  { k: 'act', left: 572, top: 610 },
  { k: 'obs', left: 208, top: 610 },
];

const M1_Agent: Page = () => {
  const [ref, beats] = useBeats();
  const [auto, setAuto] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const N = AG_STEPS.length;
  useEffect(() => {
    setAuto(null);
    setPlaying(false);
  }, [beats]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setAuto((a) => Math.min(N, (a ?? 0) + 1)), 1100);
    return () => window.clearInterval(id);
  }, [playing, N]);
  useEffect(() => {
    if (auto !== null && auto >= N) setPlaying(false);
  }, [auto, N]);
  const step = auto ?? Math.min(beats, N);
  const cur = step > 0 ? AG_STEPS[step - 1].k : null;
  return (
    <Frame mod={1} beats={N}>
      <Title>Du chat à l’agent : la boucle agentique</Title>
      <Lede>Un agent, c’est un LLM, des outils et une boucle : il réfléchit, agit, observe le résultat… et recommence jusqu’à l’objectif.</Lede>
      <div className={A.fade} style={{ position: 'absolute', left: 290, top: 350, width: 420, height: 420 }}>
        <svg width={420} height={420} className={A.spin} style={{ display: 'block' }}>
          <circle cx={210} cy={210} r={200} fill="none" stroke={C.faint} strokeWidth={4} strokeDasharray="12 14" />
        </svg>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 380, top: 470, width: 240, height: 120, boxSizing: 'border-box', borderRadius: 18, background: cur === 'done' ? G.green : G.navy, color: '#fff', padding: '14px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, transition: 'background 400ms ease' }}>
        <span style={{ fontSize: 17, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.8 }}>Objectif</span>
        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25 }}>Faire passer les tests de l’atelier 4 au vert</span>
      </div>
      {AG_NODES.map((n, i) => {
        const kd = AG_KIND[n.k];
        const on = cur === n.k;
        return (
          <div
            key={n.k}
            className={cx(A.pop, k('agnode'))}
            style={{
              position: 'absolute',
              left: n.left,
              top: n.top,
              width: 220,
              height: 110,
              boxSizing: 'border-box',
              borderRadius: 18,
              background: on ? T[kd.tone].bg : C.card,
              boxShadow: on ? `0 0 0 4px ${STRONG[kd.tone]}, 0 0 0 14px ${T[kd.tone].bg}` : SHADOW,
              transform: on ? 'scale(1.08)' : 'none',
              opacity: cur && !on ? 0.55 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 18px',
              ...dl(200 + i * 150),
            }}
          >
            <IconTile name={kd.icon} tone={kd.tone} size={58} solid={on} />
            <span style={{ fontSize: 25, fontWeight: 700, color: on ? T[kd.tone].fg : C.ink }}>{kd.label}</span>
          </div>
        );
      })}
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, width: 820, ...dl(500) }}>
        <Callout tone="blue" icon="humanCheck" title="En mode Agent de Copilot" size={21}>
          Il vous demande avant de lancer une commande, et vous relisez le diff à la fin. L’objectif et le « c’est fini » restent à vous.
        </Callout>
      </div>
      <div ref={ref} className={A.right} style={{ position: 'absolute', left: 990, top: 270, width: 810, height: 600, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: mono, fontSize: 19, color: '#9AA6C8', marginBottom: 14 }}>
          <Icon name="terminal" size={24} color="#9AA6C8" /> Journal de l’agent · étape {step} / {N}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AG_STEPS.slice(0, step).map((s, i) => {
            const kd = AG_KIND[s.k];
            const last = i === step - 1;
            return (
              <div key={i} className={k('swap')} style={{ display: 'grid', gridTemplateColumns: '34px 130px minmax(0, 1fr)', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 10, background: last ? 'rgba(255,255,255,.08)' : 'transparent' }}>
                <Icon name={kd.icon} size={24} color={STRONG[kd.tone]} sw={2.2} />
                <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: STRONG[kd.tone] }}>{kd.label}</span>
                <span style={{ fontFamily: mono, fontSize: 19, color: last ? '#fff' : '#C9D2EA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.t}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 990, top: 892, display: 'flex', gap: 12, ...dl(300) }}>
        <Btn
          icon="play"
          size={21}
          onClick={() => {
            setAuto(0);
            setPlaying(true);
          }}
        >
          Lecture automatique
        </Btn>
        <Btn
          icon="reset"
          ghost
          tone="grey"
          size={21}
          onClick={() => {
            setPlaying(false);
            setAuto(0);
          }}
        >
          Recommencer
        </Btn>
      </div>
    </Frame>
  );
};

// ─── Prompt, contexte, harnais ──────────────────────────────────────────────
const ENG = [
  {
    name: 'Prompt engineering',
    q: 'Que demandez-vous ?',
    tone: 'green' as Tone,
    icon: 'chat' as IconName,
    era: '2022 – 2023 : l’art de bien formuler',
    items: ['Un objectif précis et vérifiable', 'Les contraintes : langage, style, interdits', 'Le format attendu : fonction, tests, tableau…', 'Un exemple d’entrée et de sortie'],
    cop: ['un commentaire avant la fonction', 'votre message dans le chat', '/explain, /tests, /fix…', 'des fichiers .prompt.md réutilisables'],
  },
  {
    name: 'Context engineering',
    q: 'Que voit le modèle ?',
    tone: 'blue' as Tone,
    icon: 'layers' as IconName,
    era: 'popularisé en 2025',
    items: ['Les bons fichiers, pas tout le dépôt', 'Les règles du projet, écrites une fois', 'Une tâche = une session propre', 'Retirer le bruit : chaque token coûte'],
    cop: ['#fichier, #codebase, la sélection', '.github/copilot-instructions.md', '/compact ou nouvelle session', 'serveurs MCP : doc, tickets…'],
  },
  {
    name: 'Harness engineering',
    q: 'Dans quel cadre l’agent agit-il ?',
    tone: 'violet' as Tone,
    icon: 'shield' as IconName,
    era: 'le chantier de 2026',
    items: ['La boucle : réfléchir, agir, observer', 'Les outils autorisés et les permissions', 'Des garde-fous automatiques : tests, lint, CI', 'Un bac à sable et une revue humaine'],
    cop: ['mode Agent, agents personnalisés', 'approbation des commandes terminal', 'bac à sable local (VS Code)', 'hooks, CI, revue de PR'],
  },
];
const ENG_BOX = [
  { left: 225, top: 495, w: 590, h: 370, cls: A.pop },
  { left: 170, top: 380, w: 700, h: 540, cls: b.pop(1) },
  { left: 120, top: 280, w: 800, h: 690, cls: b.pop(2) },
];

const M1_Engineering: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const sel = pick ?? Math.min(beats, 2);
  const e = ENG[sel];
  return (
    <Frame mod={1} beats={2}>
      <Title>Prompt, contexte, harnais : trois façons de guider l’IA</Title>
      <Lede>Trois couches emboîtées : de la phrase que vous écrivez au système dans lequel l’agent travaille. Cliquez une couche.</Lede>
      {[2, 1, 0].map((i) => {
        const bx = ENG_BOX[i];
        const en = ENG[i];
        const on = sel === i;
        return (
          <div
            key={en.name}
            role="button"
            data-osd-interactive
            onClick={() => setPick(i)}
            className={cx(bx.cls, k('layer'))}
            style={{
              position: 'absolute',
              left: bx.left,
              top: bx.top,
              width: bx.w,
              height: bx.h,
              boxSizing: 'border-box',
              borderRadius: 26,
              background: i === 0 ? C.card : T[en.tone].bg,
              boxShadow: on ? `0 0 0 5px ${STRONG[en.tone]}, 0 22px 50px -24px rgba(11,31,92,.55)` : `inset 0 0 0 2px ${T[en.tone].bd}`,
              padding: '20px 26px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconTile name={en.icon} tone={en.tone} size={52} solid={on} />
              <div>
                <div style={{ fontSize: 25, fontWeight: 800, color: T[en.tone].fg }}>{en.name}</div>
                <div style={{ fontSize: 19, color: C.soft }}>{en.q}</div>
              </div>
            </div>
            {i === 0 ? (
              <div style={{ marginTop: 22, fontFamily: mono, fontSize: 20, lineHeight: 1.45, background: '#0F1730', color: '#E6EDF7', borderRadius: 12, padding: '14px 16px' }}>
                <span style={{ color: '#7C86A8' }}>{'// Valide un ticket : titre non vide,'}</span>
                <br />
                <span style={{ color: '#7C86A8' }}>{'// points dans {1, 2, 3, 5, 8, 13}.'}</span>
                <br />
                <span style={{ color: '#7C86A8' }}>{'// Lève une Error explicite sinon.'}</span>
              </div>
            ) : null}
          </div>
        );
      })}
      <div ref={ref} style={{ position: 'absolute', left: 980, top: 280, width: 820, height: 690 }}>
        <div key={sel} className={k('swap')} style={{ height: '100%', boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[e.tone]}`, padding: '30px 34px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconTile name={e.icon} tone={e.tone} size={64} solid />
            <div>
              <div style={{ fontFamily: display, fontSize: 34, fontWeight: 800, color: C.ink }}>{e.name}</div>
              <div style={{ fontSize: 22, color: C.soft }}>{e.q}</div>
            </div>
          </div>
          <div>
            <Tag tone={e.tone} size={19}>
              {e.era}
            </Tag>
          </div>
          <Eyebrow c={C.muted} size={18}>
            Ce que vous réglez
          </Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: -6 }}>
            {e.items.map((t, i) => (
              <div key={t} className={k('swap')} style={{ ...dl(80 + i * 70), display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: C.ink }}>
                <Icon name="check" size={24} color={STRONG[e.tone]} sw={2.8} /> {t}
              </div>
            ))}
          </div>
          <Eyebrow c={C.muted} size={18}>
            Dans Copilot
          </Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginTop: -6 }}>
            {e.cop.map((t, i) => (
              <div key={t} className={k('swap')} style={{ ...dl(380 + i * 70), fontSize: 20, lineHeight: 1.3, color: T[e.tone].fg, background: T[e.tone].bg, borderRadius: 12, padding: '10px 14px' }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// @@PAGES-BEGIN
export const __pages = [];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [];
// @@NOTES-END
