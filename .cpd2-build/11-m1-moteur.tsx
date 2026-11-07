// ─── Module 1 · Sous le capot : histoire de l’IA, ML, deep learning, LLM, agents ─────
// Frise portée depuis .dap-build/j1-10-m1.tsx (portraits Wikimedia Commons, licences libres).

// ─── Frise 1943 → 2026 (interactive : survol d’un jalon = fiche détaillée) ──
// Portraits & visuels : Wikimedia Commons (licences libres), recadrés en 256 px.
const TLI = {
  pitts: new URL('./assets/timeline/pitts.jpg', import.meta.url).href,
  turing: new URL('./assets/timeline/turing.jpg', import.meta.url).href,
  bombe: new URL('./assets/timeline/bombe.jpg', import.meta.url).href,
  mccarthy: new URL('./assets/timeline/mccarthy.jpg', import.meta.url).href,
  minsky: new URL('./assets/timeline/minsky.jpg', import.meta.url).href,
  rosenblatt: new URL('./assets/timeline/rosenblatt.jpg', import.meta.url).href,
  markI: new URL('./assets/timeline/markI.jpg', import.meta.url).href,
  weizenbaum: new URL('./assets/timeline/weizenbaum.jpg', import.meta.url).href,
  eliza: new URL('./assets/timeline/eliza.jpg', import.meta.url).href,
  papert: new URL('./assets/timeline/papert.jpg', import.meta.url).href,
  feigenbaum: new URL('./assets/timeline/feigenbaum.jpg', import.meta.url).href,
  lisp: new URL('./assets/timeline/lisp.jpg', import.meta.url).href,
  rumelhart: new URL('./assets/timeline/rumelhart.jpg', import.meta.url).href,
  hinton: new URL('./assets/timeline/hinton.jpg', import.meta.url).href,
  lecun: new URL('./assets/timeline/lecun.jpg', import.meta.url).href,
  schmidhuber: new URL('./assets/timeline/schmidhuber.jpg', import.meta.url).href,
  deepblue: new URL('./assets/timeline/deepblue.jpg', import.meta.url).href,
  kasparov: new URL('./assets/timeline/kasparov.jpg', import.meta.url).href,
  bengio: new URL('./assets/timeline/bengio.jpg', import.meta.url).href,
  feifeili: new URL('./assets/timeline/feifeili.jpg', import.meta.url).href,
  goodfellow: new URL('./assets/timeline/goodfellow.jpg', import.meta.url).href,
  alphago: new URL('./assets/timeline/alphago.jpg', import.meta.url).href,
  hassabis: new URL('./assets/timeline/hassabis.jpg', import.meta.url).href,
  leesedol: new URL('./assets/timeline/leesedol.jpg', import.meta.url).href,
  transformer: new URL('./assets/timeline/transformer.jpg', import.meta.url).href,
  altman: new URL('./assets/timeline/altman.jpg', import.meta.url).href,
  amodei: new URL('./assets/timeline/amodei.jpg', import.meta.url).href,
  karpathy: new URL('./assets/timeline/karpathy.jpg', import.meta.url).href,
};

type TlEraId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
const TL_ERA: Record<TlEraId, { name: string; band?: string; years: string; c: string; tone: Tone; text: string }> = {
  a: { name: 'Fondations', years: '1943 – 1966', c: C.teal, tone: 'teal', text: 'Logique, neurone formel, test de Turing : l’IA naît de la cybernétique, dans un optimisme débordant. Premier âge d’or.' },
  b: { name: 'Hivers de l’IA', band: 'Hivers', years: '1969 – années 80', c: '#6B7690', tone: 'grey', text: 'Promesses non tenues, crédits coupés : deux hivers (1974–1980, 1987–1993). L’IA « symbolique » à base de règles domine.' },
  c: { name: 'Renouveau', years: '1986 – 1997', c: C.blue, tone: 'blue', text: 'Retour de l’apprentissage : rétropropagation, réseaux convolutifs, LSTM… pendant que Deep Blue gagne par la force brute.' },
  d: { name: 'Deep learning', years: '2006 – 2016', c: C.navy, tone: 'navy', text: 'Données massives + GPU + réseaux profonds : la vision, la voix puis le jeu de go tombent l’un après l’autre.' },
  e: { name: 'IA générative', years: '2017 – 2023', c: C.violet, tone: 'violet', text: 'Le Transformer et le pré-entraînement à très grande échelle : les modèles écrivent du texte, du code, des images.' },
  f: { name: 'IA agentique', years: '2024 – 2026', c: C.green, tone: 'green', text: 'Les modèles agissent : ils se branchent aux outils (MCP), lisent le dépôt, lancent les tests, ouvrent la PR… en équipes.' },
};

type TlPerson = { n: string; img?: string };
type TlEvent = {
  i: number;
  year: string;
  title: string;
  era: TlEraId;
  img?: string;
  icon?: IconName;
  pic?: string;
  picCap?: string;
  people: TlPerson[];
  text: string;
  fact: string;
};
type TlHover = ({ kind: 'ev' } & TlEvent) | { kind: 'era'; era: TlEraId; cx: number } | null;
const TlCtx = createContext<{ hover: TlHover; set: (h: TlHover) => void }>({ hover: null, set: () => {} });

// Axis geometry (pixel-constant).
const TL_X0 = 210;
const TL_DX = 62.5;
const TL_BAND = 566; // top of the period band (48 px tall)
const tlX = (i: number) => TL_X0 + i * TL_DX;

CSS.push(`
.${P}-tl-w.${P}-on1,.${P}-tl-w.${P}-on2,.${P}-tl-w.${P}-fd1,.${P}-tl-w.${P}-fd2{pointer-events:none}
${at(1)} .${P}-tl-w.${P}-on1,${at(1)} .${P}-tl-w.${P}-fd1,${at(2)} .${P}-tl-w.${P}-on2,${at(2)} .${P}-tl-w.${P}-fd2{pointer-events:auto}
.${P}-tl-ev{cursor:pointer;outline:none;transition:opacity 260ms ${EASE},filter 260ms ${EASE}}
.${P}-tl-dim{opacity:.26;filter:grayscale(.75)}
.${P}-tl-fade{transition:opacity 260ms ${EASE},filter 260ms ${EASE}}
.${P}-tl-thumb{transition:transform 320ms ${EASE_BACK},box-shadow 320ms ${EASE}}
.${P}-tl-on .${P}-tl-thumb{transform:scale(1.24);box-shadow:0 0 0 7px color-mix(in srgb,var(--c) 22%,transparent),0 16px 30px -12px rgba(11,31,92,.6)}
.${P}-tl-title{transition:color 220ms ${EASE}}
.${P}-tl-on .${P}-tl-title{color:var(--c)}
.${P}-tl-stem{transition:opacity 220ms ${EASE},transform 220ms ${EASE}}
.${P}-tl-on .${P}-tl-stem{opacity:1 !important;transform:scaleX(1.7)}
.${P}-tl-dot{transition:transform 260ms ${EASE_BACK},background 220ms ${EASE}}
.${P}-tl-on .${P}-tl-dot{transform:scale(1.6);background:var(--c) !important}
.${P}-tl-era{cursor:help;transition:filter 220ms ${EASE},transform 260ms ${EASE},opacity 260ms ${EASE}}
.${P}-tl-era:hover{filter:brightness(1.15) saturate(1.1);transform:translateY(-3px)}
.${P}-tl-era-dim{opacity:.35}
@keyframes ${P}-tlpop{from{opacity:0;transform:translateY(var(--dy,10px)) scale(.97)}to{opacity:1;transform:none}}
.${P}-tl-pop{animation:${P}-tlpop 240ms ${EASE} both}
`);

const TlThumb = ({ img, icon, c, size }: { img?: string; icon?: IconName; c: string; size: number }) => (
  <div
    className={k('tl-thumb')}
    style={{
      width: size,
      height: size,
      margin: '0 auto',
      borderRadius: '50%',
      boxSizing: 'border-box',
      border: `4px solid ${c}`,
      background: img ? '#fff' : `linear-gradient(140deg, ${c} 0%, ${C.electric} 130%)`,
      color: '#fff',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {img ? (
      <img src={img} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    ) : icon ? (
      <Icon name={icon} size={size * 0.48} sw={2.2} />
    ) : null}
  </div>
);

// One milestone. Even index → above the axis, odd → below; every other one on a far lane.
const TlEv = ({ beat = 0, ...ev }: TlEvent & { beat?: number }) => {
  const { hover, set } = useContext(TlCtx);
  const x = tlX(ev.i);
  const up = ev.i % 2 === 0;
  const far = up ? ev.i % 4 === 0 : ev.i % 4 === 3;
  const c = TL_ERA[ev.era].c;
  const stem = far ? 172 : 26;
  const top = up ? (far ? 262 : 408) : TL_BAND + 42;
  const on = hover?.kind === 'ev' && hover.i === ev.i;
  const dim = hover !== null && !on && (hover.kind === 'ev' || hover.era !== ev.era);
  const enter = () => set({ kind: 'ev', ...ev });
  const leave = () => set(null);
  const card = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 22, lineHeight: 1.1, color: c, marginBottom: 6 }}>{ev.year}</div>
      <TlThumb img={ev.img} icon={ev.icon} c={c} size={72} />
      <div
        className={k('tl-title')}
        style={{ fontSize: 19, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginTop: 8, whiteSpace: 'nowrap' }}
      >
        {ev.title}
      </div>
    </div>
  );
  const stemEl = (
    <div style={{ position: 'relative', height: stem }}>
      <div
        className={k('tl-stem')}
        style={{ position: 'absolute', left: 88.5, top: 0, width: 3, height: '100%', background: c, opacity: 0.4 }}
      />
      <div
        className={k('tl-dot')}
        style={{
          position: 'absolute',
          left: 83,
          ...(up ? { bottom: -7 } : { top: -7 }),
          width: 14,
          height: 14,
          borderRadius: '50%',
          boxSizing: 'border-box',
          border: `3px solid ${c}`,
          background: '#fff',
        }}
      />
    </div>
  );
  return (
    <div
      className={cx(k('tl-w'), beat ? b.on(beat) : A.in)}
      style={{ position: 'absolute', left: x - 90, top, width: 180, zIndex: on ? 5 : 1, ...dl(beat ? (ev.i % 6) * 70 : 150 + ev.i * 45) }}
    >
      <div
        className={cx(k('tl-ev'), on && k('tl-on'), dim && k('tl-dim'))}
        style={vars({ c })}
        tabIndex={0}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={enter}
        onBlur={leave}
      >
        {up ? card : stemEl}
        {up ? stemEl : card}
      </div>
    </div>
  );
};

// One period of the band (chevron), spanning milestones `from`…`to`.
const TlEra = ({ era, from, to, beat = 0, first }: { era: TlEraId; from: number; to: number; beat?: number; first?: boolean }) => {
  const { hover, set } = useContext(TlCtx);
  const e = TL_ERA[era];
  const left = tlX(from) - TL_DX / 2;
  const w = (to - from + 1) * TL_DX;
  const dim = hover?.kind === 'era' && hover.era !== era;
  const tip = 16;
  return (
    <div
      className={cx(beat ? b.fade(beat) : A.fade, k('tl-w'))}
      style={{ position: 'absolute', left: left - (first ? 0 : tip), top: TL_BAND, width: w + (first ? 0 : tip), height: 48, ...dl(beat ? 0 : 300) }}
    >
      <div
        className={cx(k('tl-era'), dim && k('tl-era-dim'))}
        onMouseEnter={() => set({ kind: 'era', era, cx: left + w / 2 })}
        onMouseLeave={() => set(null)}
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, ${e.c} 0%, color-mix(in srgb, ${e.c} 78%, #fff) 100%)`,
          clipPath: `polygon(0 0, calc(100% - ${tip}px) 0, 100% 50%, calc(100% - ${tip}px) 100%, 0 100%${first ? '' : `, ${tip}px 50%`})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: first ? 0 : tip,
          paddingRight: tip,
          boxSizing: 'border-box',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        {e.band ?? e.name}
      </div>
    </div>
  );
};

const TlChip = ({ p, c }: { p: TlPerson; c: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: p.img ? '3px 14px 3px 3px' : '5px 14px',
      borderRadius: 999,
      background: '#fff',
      boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${c} 30%, transparent)`,
      fontSize: 18,
      fontWeight: 600,
      color: C.ink,
      whiteSpace: 'nowrap',
    }}
  >
    {p.img ? <img src={p.img} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : null}
    {p.n}
  </span>
);

// Detail card shown on hover — opposite side of the axis from the hovered milestone.
const TlPop = () => {
  const { hover } = useContext(TlCtx);
  if (!hover) return null;
  if (hover.kind === 'era') {
    const e = TL_ERA[hover.era];
    return (
      <div
        key={`era-${hover.era}`}
        className={k('tl-pop')}
        style={{
          position: 'absolute',
          left: Math.min(Math.max(hover.cx - 400, 120), 1000),
          top: TL_BAND + 70,
          width: 800,
          padding: '26px 32px',
          boxSizing: 'border-box',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.97)',
          boxShadow: `${SHADOW}, inset 0 0 0 2px color-mix(in srgb, ${e.c} 35%, transparent)`,
          pointerEvents: 'none',
          zIndex: 20,
          ...vars({ dy: '10px' }),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: e.c }}>{e.name}</span>
          <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>{e.years}</span>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft, marginTop: 10 }}>{e.text}</div>
      </div>
    );
  }
  const ev = hover;
  const e = TL_ERA[ev.era];
  const x = tlX(ev.i);
  const up = ev.i % 2 === 0;
  const W = 940;
  const left = Math.min(Math.max(x - W / 2, 120), 1800 - W);
  const pic = ev.pic ?? ev.img;
  return (
    <div
      key={`ev-${ev.i}`}
      className={k('tl-pop')}
      style={{
        position: 'absolute',
        left,
        width: W,
        ...(up ? { top: TL_BAND + 62 } : { bottom: 1080 - TL_BAND + 14 }),
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        gap: 28,
        borderRadius: 22,
        background: 'rgba(255,255,255,0.98)',
        boxShadow: `0 0 0 1px rgba(16,24,40,.06), 0 30px 60px -28px rgba(11,31,92,.55), inset 0 0 0 2px color-mix(in srgb, ${e.c} 35%, transparent)`,
        pointerEvents: 'none',
        zIndex: 20,
        ...vars({ dy: up ? '-10px' : '10px' }),
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: x - left - 12,
          ...(up ? { top: -11 } : { bottom: -11 }),
          width: 24,
          height: 24,
          background: '#fff',
          transform: 'rotate(45deg)',
          boxShadow: up ? `inset 2px 2px 0 color-mix(in srgb, ${e.c} 35%, transparent)` : `inset -2px -2px 0 color-mix(in srgb, ${e.c} 35%, transparent)`,
        }}
      />
      <div style={{ flex: 'none', width: 230 }}>
        <div
          style={{
            width: 230,
            height: 230,
            borderRadius: 16,
            overflow: 'hidden',
            background: pic ? '#fff' : `linear-gradient(140deg, ${e.c} 0%, ${C.electric} 130%)`,
            boxShadow: `inset 0 0 0 1px ${C.rule}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          {pic ? (
            <img src={pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : ev.icon ? (
            <Icon name={ev.icon} size={110} sw={1.8} />
          ) : null}
        </div>
        {ev.picCap ? (
          <div style={{ fontSize: 16, lineHeight: 1.35, color: C.muted, marginTop: 8, fontStyle: 'italic' }}>{ev.picCap}</div>
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 22,
              color: '#fff',
              background: e.c,
              borderRadius: 8,
              padding: '3px 12px',
            }}
          >
            {ev.year}
          </span>
          <Tag tone={e.tone} size={17}>{e.name}</Tag>
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: C.navy, marginTop: 8 }}>{ev.title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {ev.people.map((p) => (
            <TlChip key={p.n} p={p.img === pic ? { n: p.n } : p} c={e.c} />
          ))}
        </div>
        <div style={{ fontSize: 21, lineHeight: 1.45, color: C.soft, marginTop: 12 }}>{ev.text}</div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 12,
            background: T[e.tone].bg,
            color: T[e.tone].fg,
            fontSize: 19,
            lineHeight: 1.4,
          }}
        >
          <Icon name="bulb" size={24} sw={2.2} style={{ flex: 'none', marginTop: 1 }} />
          <span>
            <b>Le saviez-vous ?</b> {ev.fact}
          </span>
        </div>
      </div>
    </div>
  );
};

const M1_IAHistoire: Page = () => {
  const [hover, set] = useState<TlHover>(null);
  return (
    <Frame mod={1} beats={2}>
      <TlCtx.Provider value={{ hover, set }}>
        <Title>L’IA… depuis quand ?</Title>
        <Lede cls={cx(k('tl-fade'), hover && k('tl-dim'))}>80 ans d’histoire, deux hivers, puis une accélération brutale depuis 2017. Survolez un jalon : qui, quoi, pourquoi.</Lede>

        <div style={{ position: 'absolute', left: 178, top: TL_BAND + 20, width: 1566, height: 8, borderRadius: 4, background: C.rule }} />
        <TlEra era="a" from={0} to={4} first />
        <TlEra era="b" from={5} to={6} />
        <TlEra era="c" from={7} to={10} />
        <TlEra era="d" from={11} to={15} />
        <TlEra era="e" from={16} to={21} beat={1} />
        <TlEra era="f" from={22} to={24} beat={2} />

        <TlEv
          i={0}
          year="1943"
          title="Neurone formel"
          era="a"
          img={TLI.pitts}
          people={[{ n: 'Warren McCulloch' }, { n: 'Walter Pitts', img: TLI.pitts }]}
          text="Premier modèle mathématique du neurone : des entrées pondérées, un seuil, une sortie 0 ou 1. L’ancêtre direct de chaque neurone de vos LLM."
          fact="Walter Pitts, génie autodidacte, avait fugué à 15 ans et n’a jamais obtenu de diplôme."
        />
        <TlEv
          i={1}
          year="1950"
          title="Test de Turing"
          era="a"
          img={TLI.turing}
          pic={TLI.bombe}
          picCap="La « Bombe » de Bletchley Park"
          people={[{ n: 'Alan Turing', img: TLI.turing }]}
          text="« Computing Machinery and Intelligence » : plutôt que « une machine peut-elle penser ? », Turing propose un test, le jeu de l’imitation."
          fact="Pendant la guerre, ses « Bombes » électromécaniques ont aidé à casser le chiffre Enigma."
        />
        <TlEv
          i={2}
          year="1956"
          title="Dartmouth"
          era="a"
          img={TLI.mccarthy}
          people={[{ n: 'John McCarthy', img: TLI.mccarthy }, { n: 'Marvin Minsky', img: TLI.minsky }, { n: 'Claude Shannon' }, { n: 'Nathaniel Rochester' }]}
          text="Un atelier d’été au Dartmouth College. John McCarthy y baptise le domaine : « intelligence artificielle »."
          fact="La proposition estimait qu’un été à dix chercheurs suffirait à faire « des progrès significatifs »."
        />
        <TlEv
          i={3}
          year="1957"
          title="Perceptron"
          era="a"
          img={TLI.rosenblatt}
          pic={TLI.markI}
          picCap="Mark I Perceptron (manuel, 1960)"
          people={[{ n: 'Frank Rosenblatt', img: TLI.rosenblatt }]}
          text="Le premier réseau de neurones qui apprend à partir d’exemples, construit en machine : le Mark I Perceptron et sa caméra de 20 × 20 pixels."
          fact="En 1958, le New York Times annonçait une machine qui saurait « marcher, parler, voir… et avoir conscience d’exister »."
        />
        <TlEv
          i={4}
          year="1966"
          title="ELIZA"
          era="a"
          img={TLI.weizenbaum}
          pic={TLI.eliza}
          picCap="Une conversation avec ELIZA"
          people={[{ n: 'Joseph Weizenbaum', img: TLI.weizenbaum }]}
          text="Le premier chatbot : il imite un psychothérapeute en reformulant vos phrases avec de simples règles de motifs. Aucune compréhension."
          fact="Sa secrétaire lui aurait demandé de sortir pour « parler en privé » à ELIZA : c’est l’« effet ELIZA »."
        />
        <TlEv
          i={5}
          year="1969"
          title="Le mur du XOR"
          era="b"
          img={TLI.papert}
          people={[{ n: 'Marvin Minsky', img: TLI.minsky }, { n: 'Seymour Papert', img: TLI.papert }]}
          text="Le livre « Perceptrons » démontre qu’un perceptron à une couche ne sait pas apprendre le XOR. Les crédits fondent : premier hiver de l’IA."
          fact="Au Royaume-Uni, le rapport Lighthill (1973) achève de couper les financements."
        />
        <TlEv
          i={6}
          year="1980"
          title="Systèmes experts"
          era="b"
          img={TLI.feigenbaum}
          pic={TLI.lisp}
          picCap="Machine LISP Symbolics"
          people={[{ n: 'Edward Feigenbaum', img: TLI.feigenbaum }]}
          text="L’IA « symbolique » : des milliers de règles SI… ALORS écrites avec des experts. XCON configure les ordinateurs VAX de DEC."
          fact="Trop coûteux à maintenir, ils s’effondrent avec le marché des machines LISP en 1987 : second hiver."
        />
        <TlEv
          i={7}
          year="1986"
          title="Rétropropagation"
          era="c"
          img={TLI.rumelhart}
          people={[{ n: 'David Rumelhart', img: TLI.rumelhart }, { n: 'Geoffrey Hinton', img: TLI.hinton }, { n: 'Ronald Williams' }]}
          text="L’article de Nature popularise l’algorithme qui entraîne des réseaux à plusieurs couches… et fait sauter le mur du XOR."
          fact="C’est toujours ainsi qu’on entraîne les LLM : mesurer l’erreur, la propager en arrière, ajuster les poids."
        />
        <TlEv
          i={8}
          year="1989"
          title="LeNet · CNN"
          era="c"
          img={TLI.lecun}
          people={[{ n: 'Yann LeCun', img: TLI.lecun }]}
          text="Les réseaux convolutifs reconnaissent les chiffres manuscrits. À la fin des années 90, ils lisent une grande part des chèques aux États-Unis."
          fact="Yann LeCun est français : ingénieur ESIEE Paris, docteur de l’université Pierre-et-Marie-Curie."
        />
        <TlEv
          i={9}
          year="1997"
          title="LSTM"
          era="c"
          img={TLI.schmidhuber}
          people={[{ n: 'Sepp Hochreiter' }, { n: 'Jürgen Schmidhuber', img: TLI.schmidhuber }]}
          text="Une mémoire à long terme pour les réseaux récurrents : la base de la traduction et de la reconnaissance vocale jusqu’en 2017."
          fact="Google Traduction (2016) et la dictée vocale de nos smartphones tournaient sur des LSTM."
        />
        <TlEv
          i={10}
          year="1997"
          title="Deep Blue"
          era="c"
          img={TLI.deepblue}
          picCap="Deep Blue (IBM), Computer History Museum"
          people={[{ n: 'Garry Kasparov', img: TLI.kasparov }, { n: 'Feng-hsiung Hsu' }, { n: 'Murray Campbell' }]}
          text="Deep Blue bat le champion du monde d’échecs 3½ à 2½. Pure force brute : 200 millions de positions par seconde, aucun apprentissage."
          fact="Un coup déroutant, peut-être dû à un bug, aurait déstabilisé Kasparov dès la première partie."
        />
        <TlEv
          i={11}
          year="2006"
          title="Deep learning"
          era="d"
          img={TLI.hinton}
          people={[{ n: 'Geoffrey Hinton', img: TLI.hinton }, { n: 'Yoshua Bengio', img: TLI.bengio }]}
          text="Le pré-entraînement couche par couche permet enfin d’entraîner des réseaux profonds. Le terme « deep learning » s’impose."
          fact="Geoffrey Hinton a reçu le prix Nobel de physique 2024, avec John Hopfield."
        />
        <TlEv
          i={12}
          year="2009"
          title="ImageNet"
          era="d"
          img={TLI.feifeili}
          people={[{ n: 'Fei-Fei Li', img: TLI.feifeili }]}
          text="14 millions d’images annotées à la main via Amazon Mechanical Turk : le jeu de données qui fera décoller la vision par ordinateur."
          fact="Sans données de qualité, pas d’IA : vrai aussi pour le contexte que vous donnez à votre assistant."
        />
        <TlEv
          i={13}
          year="2012"
          title="AlexNet"
          era="d"
          icon="cpu"
          people={[{ n: 'Alex Krizhevsky' }, { n: 'Ilya Sutskever' }, { n: 'Geoffrey Hinton', img: TLI.hinton }]}
          text="Un réseau convolutif entraîné sur deux cartes graphiques écrase le concours ImageNet : 15,3 % d’erreur contre 26,2 % pour le second."
          fact="Il a été entraîné dans la chambre d’Alex Krizhevsky, sur deux GeForce GTX 580 de joueur."
        />
        <TlEv
          i={14}
          year="2014"
          title="GANs"
          era="d"
          img={TLI.goodfellow}
          people={[{ n: 'Ian Goodfellow', img: TLI.goodfellow }]}
          text="Deux réseaux s’affrontent : un faussaire génère, un critique juge. Premiers visages photoréalistes… et premiers deepfakes."
          fact="L’idée lui serait venue lors d’une discussion dans un bar de Montréal ; il l’a codée dans la nuit."
        />
        <TlEv
          i={15}
          year="2016"
          title="AlphaGo"
          era="d"
          img={TLI.alphago}
          picCap="Partie 4 : la seule victoire de Lee Sedol"
          people={[{ n: 'Demis Hassabis', img: TLI.hassabis }, { n: 'David Silver' }, { n: 'Lee Sedol', img: TLI.leesedol }]}
          text="AlphaGo (DeepMind) bat Lee Sedol 4 à 1 au go, jeu réputé hors de portée. Réseaux profonds + apprentissage par renforcement."
          fact="Le coup 37 de la 2ᵉ partie, jugé « inhumain » par les experts, a changé la façon de jouer au go."
        />
        <TlEv
          i={16}
          beat={1}
          year="2017"
          title="Transformer"
          era="e"
          icon="layers"
          pic={TLI.transformer}
          picCap="L’architecture Transformer"
          people={[{ n: 'Ashish Vaswani' }, { n: 'Noam Shazeer' }, { n: '+ 6 co-auteurs (Google)' }]}
          text="« Attention Is All You Need » : le mécanisme d’attention remplace la récurrence et se parallélise sur GPU. C’est le « T » de GPT."
          fact="Les huit auteurs ont tous quitté Google depuis ; la plupart ont fondé leur start-up (Cohere, Character.AI…)."
        />
        <TlEv
          i={17}
          beat={1}
          year="2018"
          title="Prix Turing"
          era="e"
          img={TLI.bengio}
          people={[{ n: 'Yoshua Bengio', img: TLI.bengio }, { n: 'Geoffrey Hinton', img: TLI.hinton }, { n: 'Yann LeCun', img: TLI.lecun }]}
          text="Le « Nobel de l’informatique » consacre les trois « parrains du deep learning ». La même année naissent GPT-1 et BERT."
          fact="Bengio et Hinton sont aujourd’hui parmi les voix les plus fortes pour alerter sur les risques de l’IA."
        />
        <TlEv
          i={18}
          beat={1}
          year="2020"
          title="GPT-3"
          era="e"
          icon="brain"
          people={[{ n: 'Alec Radford' }, { n: 'Ilya Sutskever' }, { n: 'Dario Amodei', img: TLI.amodei }]}
          text="175 milliards de paramètres : sans réentraînement, il suit des exemples donnés dans le prompt (« few-shot »). Le prompt engineering est né."
          fact="GPT-1 (2018) n’avait que 117 millions de paramètres : × 1 500 en deux ans."
        />
        <TlEv
          i={19}
          beat={1}
          year="2021"
          title="GitHub Copilot"
          era="e"
          icon="code"
          people={[{ n: 'GitHub Next' }, { n: 'OpenAI Codex' }, { n: 'Nat Friedman' }]}
          text="Preview en juin 2021 : la complétion de code par IA arrive dans l’IDE. Disponible pour tous les développeurs en juin 2022."
          fact="Codex, le premier modèle derrière Copilot, est un GPT-3 affiné sur le code public de GitHub."
        />
        <TlEv
          i={20}
          beat={1}
          year="2022"
          title="ChatGPT"
          era="e"
          img={TLI.altman}
          people={[{ n: 'Sam Altman', img: TLI.altman }, { n: 'OpenAI' }]}
          text="Lancé le 30 novembre 2022 : 1 million d’utilisateurs en 5 jours, 100 millions en 2 mois. L’IA générative devient grand public."
          fact="En interne, ChatGPT était présenté comme une simple « démo de recherche »."
        />
        <TlEv
          i={21}
          beat={1}
          year="2023"
          title="GPT-4 · Claude"
          era="e"
          img={TLI.amodei}
          people={[{ n: 'Dario Amodei (Anthropic)', img: TLI.amodei }, { n: 'Arthur Mensch (Mistral AI)' }, { n: 'Meta · Llama' }]}
          text="La course aux modèles : GPT-4, Claude, Llama en poids ouverts, Mistral AI côté français. Multimodal et longs contextes arrivent."
          fact="Mistral AI, fondée à Paris en avril 2023, lève 105 M€ quelques semaines plus tard."
        />
        <TlEv
          i={22}
          beat={2}
          year="2024"
          title="MCP"
          era="f"
          icon="plug"
          people={[{ n: 'Anthropic' }, { n: 'David Soria Parra' }, { n: 'Justin Spahr-Summers' }]}
          text="Model Context Protocol (novembre) : un standard ouvert pour brancher les modèles à vos outils, bases et API. L’« USB-C de l’IA »."
          fact="Adopté en 2025 par OpenAI, Google et Microsoft (GitHub Copilot, VS Code)."
        />
        <TlEv
          i={23}
          beat={2}
          year="2025"
          title="Agents de code"
          era="f"
          img={TLI.karpathy}
          people={[{ n: 'Andrej Karpathy', img: TLI.karpathy }, { n: 'Claude Code' }, { n: 'Codex' }, { n: 'Copilot Agent' }]}
          text="Les agents lisent le dépôt, éditent plusieurs fichiers, lancent les tests et ouvrent la PR. Karpathy invente le « vibe coding »."
          fact="« Vibe coding » a été élu mot de l’année 2025 par le dictionnaire Collins."
        />
        <TlEv
          i={24}
          beat={2}
          year="2026"
          title="Équipes d’agents"
          era="f"
          icon="users"
          people={[{ n: 'Vous, chef d’orchestre' }]}
          text="Plusieurs agents spécialisés (architecte, dev, testeur, relecteur) orchestrés ensemble, avec une facturation à l’usage."
          fact="Votre valeur se déplace : cadrer, découper, vérifier. Ces deux jours en posent les bases."
        />

        <div
          className={A.fade}
          style={{
            position: 'absolute',
            left: 120,
            top: 940,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 20,
            color: C.muted,
            ...dl(1400),
          }}
        >
          <Icon name="pointer" size={24} sw={2.2} color={C.blue} />
          Survolez un jalon pour sa fiche (personnes, contexte, anecdote) · survolez une période pour son résumé.
        </div>
        <TlPop />
      </TlCtx.Provider>
    </Frame>
  );
};


// @@PAGES-BEGIN
export const __pages = [];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [];
// @@NOTES-END
