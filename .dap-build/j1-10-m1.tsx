// ─── Module 1 · Panorama des outils IA pour le développement ────────────────

const M1_Divider: Page = () => (
  <Section
    n={1}
    title={
      <>
        Panorama des outils IA
        <br />
        pour le développement
      </>
    }
    sub="Comprendre ce qu’est un LLM pour bien choisir : typologie, critères, forces, limites et scénarios d’usage."
    dur="9:30 – 11:30 · labs inclus"
    labs={
      <>
        <Tag tone="green" size={19}>Lab 1.1</Tag>
        <Tag tone="green" size={19}>Atelier comparatif</Tag>
        <Tag tone="green" size={19}>Lab 1.2</Tag>
        <Tag tone="pink" size={19}>Bonus 1.3</Tag>
      </>
    }
  >
    <SecItem n={1}>Comment un LLM « écrit » du code</SecItem>
    <SecItem n={2}>La typologie des outils en 2026</SecItem>
    <SecItem n={3}>Critères de choix et confidentialité</SecItem>
    <SecItem n={4}>Forces, limites et scénarios d’usage</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

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
type TlHover = ({ kind: 'ev' } & TlEvent) | { kind: 'era'; era: TlEraId } | null;
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
        onMouseEnter={() => set({ kind: 'era', era })}
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
          left: 560,
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
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, lineHeight: 1.15, color: C.navy, marginTop: 10 }}>{ev.title}</div>
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

const M1_Timeline: Page = () => {
  const [hover, set] = useState<TlHover>(null);
  return (
    <Frame mod={1} beats={2}>
      <TlCtx.Provider value={{ hover, set }}>
        <Title>L’IA… depuis quand ?</Title>
        <Lede>80 ans d’histoire, deux hivers, puis une accélération brutale depuis 2017. Survolez un jalon : qui, quoi, pourquoi.</Lede>

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
          fact="Votre valeur se déplace : cadrer, découper, vérifier. C’est tout l’objet de ces deux jours."
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

// ─── Déterministe vs probabiliste ───────────────────────────────────────────
const M1_GEN = [
  { t: 'Regex simple', c: 'return /^\\S+@\\S+\\.\\S+$/.test(email);', n: 'Accepte « a@b.c »… et refuse peu de choses.' },
  { t: 'Regex « RFC 5322 »', c: 'return /^[a-z0-9!#$%&*+/=?^_{|}~-]+(?:\\.[a-z0-9…]+)*@…$/i.test(email);', n: 'Plus stricte… et illisible : qui la relira ?' },
  { t: 'Bibliothèque', c: "import isEmail from 'validator/lib/isEmail';\nreturn isEmail(email);", n: 'Propre… si la dépendance existe et est saine.' },
  { t: 'Approche « métier »', c: "const [u, d] = email.split('@');\nreturn !!u && !!d && d.includes('.');", n: 'Lisible, mais laxiste sur les cas limites.' },
];

const M1_Determinism: Page = () => {
  const [run, setRun] = useState(0);
  const [classic, setClassic] = useState(0);
  const g = M1_GEN[run % M1_GEN.length];
  return (
    <Frame mod={1} kind="demo">
      <Title>Programme classique vs IA générative</Title>
      <Lede>Même entrée, même sortie… ou pas. Cliquez « Relancer » de chaque côté et comparez.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconTile name="gear" tone="navy" size={54} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Déterministe</div>
              <div style={{ fontSize: 21, color: C.muted }}>Des règles écrites par un humain</div>
            </div>
          </div>
          <Btn icon="reset" ghost tone="navy" size={20} onClick={() => setClassic((x) => x + 1)}>
            Relancer
          </Btn>
        </div>
        <CodeDark size={21} style={{ marginTop: 20 }}>
          <Ck>function</Ck> <Cf>tva</Cf>(ht, code) {'{'}
          {'\n  '}
          <Ck>const</Ck> taux = {'{'} A: <Cn>0.2</Cn>, B: <Cn>0.1</Cn>, C: <Cn>0.055</Cn> {'}'}[code];
          {'\n  '}
          <Ck>return</Ck> ht * taux;
          {'\n}'}
          {'\n'}
          <Cf>tva</Cf>(<Cn>100</Cn>, <Cs>'B'</Cs>)
        </CodeDark>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24, color: C.soft }}>Exécution n° {classic + 1} →</span>
          <span key={classic} className={A.pop} style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.navy }}>
            10,00 €
          </span>
        </div>
        <div style={{ marginTop: 10, fontSize: 22, color: C.green, fontWeight: 600 }}>Toujours le même résultat : testable, explicable.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1000, top: 270, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconTile name="sparkles" tone="violet" size={54} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.violet }}>Probabiliste</div>
              <div style={{ fontSize: 21, color: C.muted }}>« Écris une fonction qui valide un email »</div>
            </div>
          </div>
          <Btn icon="reset" tone="violet" size={20} onClick={() => setRun((x) => x + 1)}>
            Relancer
          </Btn>
        </div>
        <div key={run} className={A.fade}>
          <div style={{ marginTop: 20, fontSize: 21, fontWeight: 700, color: T.violet.fg }}>
            Génération n° {run + 1} · {g.t}
          </div>
          <CodeDark size={20} wrap style={{ marginTop: 10, minHeight: 120 }}>
            {g.c}
          </CodeDark>
          <div style={{ marginTop: 14, fontSize: 22, color: C.coral, fontWeight: 600 }}>{g.n}</div>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(400) }}>
        <Callout title="Conséquence pour le développeur" tone="violet" icon="alert">
          Un LLM ne « calcule » pas une réponse : il en <strong>génère une plausible</strong>. Deux exécutions, deux codes. D’où trois réflexes :
          un prompt précis, des <strong>tests qui fixent le comportement</strong>, une revue humaine.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Prochain token + température ───────────────────────────────────────────
const M1_CANDS = [
  { tok: ' new Date()', p: 0.58, v: 'ok' },
  { tok: ' Date.now()', p: 0.22, v: 'ok' },
  { tok: ' today', p: 0.1, v: 'warn' },
  { tok: ' item.addedOn', p: 0.06, v: 'bad' },
  { tok: ' 0', p: 0.04, v: 'bad' },
];
const M1_VERDICT: Record<string, { t: string; tone: Tone }> = {
  ok: { t: 'correct', tone: 'green' },
  warn: { t: 'variable inventée', tone: 'yellow' },
  bad: { t: 'logique fausse', tone: 'coral' },
};

const M1Cand = ({ i, probs, picked }: { i: number; probs: number[]; picked: number | null }) => {
  const c = M1_CANDS[i];
  const v = M1_VERDICT[c.v];
  const pct = probs[i] * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62 }}>
      <span
        style={{
          width: 250,
          flex: 'none',
          fontFamily: mono,
          fontSize: 25,
          color: picked === i ? '#fff' : C.ink,
          background: picked === i ? C.electric : C.panel,
          borderRadius: 10,
          padding: '8px 12px',
          transition: 'all 250ms ease',
        }}
      >
        {c.tok.replace(' ', '·')}
      </span>
      <div style={{ flex: 1, height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: STRONG[v.tone], transition: `width 400ms ${EASE}` }} />
      </div>
      <span style={{ width: 92, flex: 'none', textAlign: 'right', fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{fr(pct, 0)} %</span>
      <span style={{ width: 210, flex: 'none' }}>
        <Tag tone={v.tone} size={18}>
          {v.t}
        </Tag>
      </span>
    </div>
  );
};

const M1_NextToken: Page = () => {
  const [temp, setTemp] = useState(0.7);
  const [picked, setPicked] = useState<number | null>(null);
  const [hist, setHist] = useState<number[]>([]);
  const w = M1_CANDS.map((c) => c.p ** (1 / Math.max(0.05, temp)));
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
  const bad = hist.filter((i) => M1_CANDS[i].v !== 'ok').length;
  return (
    <Frame mod={1} kind="demo">
      <Title>Un LLM prédit le prochain token… rien de plus</Title>
      <Lede>Il choisit une suite probable, pas une suite vraie. Jouez avec la température, puis échantillonnez.</Lede>
      <CodeDark file="src/domain/stock.ts" size={25} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
        <Cc>{'// Un produit est périmé si sa date limite est passée'}</Cc>
        {'\n'}
        <Ck>export function</Ck> <Cf>isExpired</Cf>(item: StockItem): <Ck>boolean</Ck> {'{'}
        {'\n  '}
        <Ck>return new</Ck> <Cf>Date</Cf>(item.expiresOn) {'<'}
        <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.15)', borderRadius: 4 }}>{picked === null ? '▌' : M1_CANDS[picked].tok}</span>
      </CodeDark>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 500, width: 1150, display: 'flex', flexDirection: 'column', gap: 8, ...dl(150) }}>
        <M1Cand i={0} probs={probs} picked={picked} />
        <M1Cand i={1} probs={probs} picked={picked} />
        <M1Cand i={2} probs={probs} picked={picked} />
        <M1Cand i={3} probs={probs} picked={picked} />
        <M1Cand i={4} probs={probs} picked={picked} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 500, width: 470, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={18}>
          Température
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: C.electric }}>{fr(temp, 1)}</span>
          <span style={{ fontSize: 21, color: C.muted }}>{temp < 0.4 ? 'prévisible' : temp < 1.1 ? 'équilibrée' : 'créative… et risquée'}</span>
        </div>
        <Range value={temp} onChange={setTemp} min={0.1} max={2} step={0.1} w={410} />
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <Btn icon="sparkles" size={21} onClick={sample}>
            Échantillonner
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
        <div style={{ marginTop: 16, fontSize: 21, color: C.soft }}>
          Tirages : <strong>{hist.length}</strong> · suites fausses : <strong style={{ color: bad ? C.coral : C.green }}>{bad}</strong>
        </div>
      </div>
    </Frame>
  );
};

// ─── Fenêtre de contexte ────────────────────────────────────────────────────
const M1_CTX = [
  { id: 'sys', label: 'Prompt système de l’outil', k: 3, tone: 'grey' as Tone, fixed: true },
  { id: 'ins', label: 'Instructions du dépôt', k: 1.5, tone: 'navy' as Tone, fixed: false },
  { id: 'files', label: 'Fichiers joints avec #', k: 4, tone: 'blue' as Tone, fixed: false },
  { id: 'hist', label: 'Historique de la session', k: 18, tone: 'violet' as Tone, fixed: false },
  { id: 'tools', label: 'Définitions d’outils (MCP…)', k: 12, tone: 'teal' as Tone, fixed: false },
  { id: 'res', label: 'Résultats d’outils (fichiers lus, tests)', k: 25, tone: 'pink' as Tone, fixed: false },
  { id: 'q', label: 'Votre question', k: 0.3, tone: 'green' as Tone, fixed: true },
];

const M1CtxRow = ({ i, on, toggle }: { i: number; on: boolean; toggle: () => void }) => {
  const c = M1_CTX[i];
  return (
    <Toggle
      on={on}
      onChange={() => {
        if (!c.fixed) toggle();
      }}
      tone={c.tone}
      size={24}
      label={
        <span style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span>{c.label}</span>
          <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>~{fr(c.k, c.k < 1 ? 1 : 0)} k</span>
          {c.fixed ? <span style={{ fontSize: 18, color: C.faint }}>(toujours)</span> : null}
        </span>
      }
    />
  );
};

const M1CtxSeg = ({ i, on, total }: { i: number; on: boolean; total: number }) => {
  const c = M1_CTX[i];
  return <div style={{ width: on ? `${(c.k / Math.max(total, 64)) * 100}%` : 0, height: '100%', background: STRONG[c.tone], transition: `width 450ms ${EASE}` }} />;
};

const M1_Context: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({ sys: true, ins: true, files: true, hist: false, tools: false, res: false, q: true });
  const flip = (id: string) => setOn((o) => ({ ...o, [id]: !o[id] }));
  const total = M1_CTX.reduce((a, c) => a + (on[c.id] ? c.k : 0), 0);
  const level = total < 20 ? { t: 'Contexte léger : rapide, précis, économique.', tone: 'green' as Tone } : total < 45 ? { t: 'Contexte moyen : surveillez l’historique et les sorties d’outils.', tone: 'yellow' as Tone } : { t: 'Contexte lourd : coût ↑, latence ↑, attention diluée. Nouvelle session ou /compact.', tone: 'coral' as Tone };
  return (
    <Frame mod={1} kind="demo">
      <Title>La fenêtre de contexte : tout ce que le modèle « voit »</Title>
      <Lede>Le modèle n’a pas de mémoire : il relit tout, à chaque requête. Activez les sources une à une.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 860, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M1CtxRow i={0} on={on.sys} toggle={() => flip('sys')} />
        <M1CtxRow i={1} on={on.ins} toggle={() => flip('ins')} />
        <M1CtxRow i={2} on={on.files} toggle={() => flip('files')} />
        <M1CtxRow i={3} on={on.hist} toggle={() => flip('hist')} />
        <M1CtxRow i={4} on={on.tools} toggle={() => flip('tools')} />
        <M1CtxRow i={5} on={on.res} toggle={() => flip('res')} />
        <M1CtxRow i={6} on={on.q} toggle={() => flip('q')} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1040, top: 270, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={18}>
          Envoyé au modèle à chaque requête
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: STRONG[level.tone] }}>{fr(total, 0)}</span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.faint }}>k tokens</span>
        </div>
        <div style={{ marginTop: 18, height: 40, borderRadius: 10, background: C.panel, overflow: 'hidden', display: 'flex' }}>
          <M1CtxSeg i={0} on={on.sys} total={total} />
          <M1CtxSeg i={1} on={on.ins} total={total} />
          <M1CtxSeg i={2} on={on.files} total={total} />
          <M1CtxSeg i={3} on={on.hist} total={total} />
          <M1CtxSeg i={4} on={on.tools} total={total} />
          <M1CtxSeg i={5} on={on.res} total={total} />
          <M1CtxSeg i={6} on={on.q} total={total} />
        </div>
        <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.4, fontWeight: 600, color: T[level.tone].fg }}>{level.t}</div>
        <div style={{ marginTop: 18, fontSize: 20, lineHeight: 1.45, color: C.muted }}>
          Ordres de grandeur illustratifs. Votre question pèse souvent moins de 1 % de ce qui est envoyé : l’essentiel vient du contexte.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1040, top: 760, width: 760, ...dl(300) }}>
        <Callout title="Trois conséquences" tone="blue" icon="bulb" size={23}>
          Facture : on paie chaque token, à chaque requête. Latence : plus c’est long, plus c’est lent. Qualité : un contexte saturé noie l’essentiel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Hallucinations ─────────────────────────────────────────────────────────
const M1Kind = ({ icon, title, ex, d }: { icon: IconName; title: string; ex: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', display: 'flex', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={52} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
  </div>
);

const M1_Halluc: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Hallucinations : plausible n’est pas vrai</Title>
    <Lede>Le modèle complète avec ce qui « ressemble » à une bonne réponse, sans vérifier qu’elle existe.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Bubble who="user" name="Vous" cls={A.in} w={720}>
        Quel paquet npm pour lire les dates DLC françaises dans une étiquette ?
      </Bubble>
      <Bubble who="agent" name="Assistant" cls={A.in} style={dl(300)} w={760}>
        Utilisez <code style={{ fontFamily: mono }}>french-dlc-parser</code> : <code style={{ fontFamily: mono }}>npm install french-dlc-parser</code>, puis{' '}
        <code style={{ fontFamily: mono }}>parseDLC(label)</code>. Il gère « À consommer jusqu’au » et « de préférence avant ».
      </Bubble>
      <div className={b.on(1)}>
        <Callout title="Vérification" tone="coral" icon="alert">
          Ce paquet n’existe pas. La réponse est fluide, précise… et inventée. Pire : un attaquant peut publier ce nom avec du code malveillant
          (on en reparle au module 3).
        </Callout>
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Eyebrow c={C.coral}>Les formes les plus fréquentes en code</Eyebrow>
      <M1Kind icon="archive" title="Paquet ou module inexistant" ex="Un nom crédible, assemblé à partir de vrais paquets." d={0} />
      <M1Kind icon="code" title="API ou paramètre inventé" ex="Une méthode qui « devrait » exister… mais pas dans cette version." d={120} />
      <M1Kind icon="clock" title="Connaissance périmée" ex="Une syntaxe dépréciée, connue à la date d’entraînement du modèle." d={240} />
      <M1Kind icon="book" title="Source ou norme fabriquée" ex="Une RFC, une règle RGPD ou un chiffre « cités » sans exister." d={360} />
    </div>
  </Frame>
);

// ─── Software 1.0 / 2.0 / 3.0 ───────────────────────────────────────────────
const M1Sw = ({ v, what, prog, by, when, tone, d }: { v: string; what: string; prog: string; by: string; when: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>Software {v}</div>
    <div style={{ marginTop: 14, fontSize: 30, fontWeight: 700, color: C.ink }}>{what}</div>
    <div style={{ marginTop: 6, fontSize: 23, color: C.soft }}>
      programme <strong>{prog}</strong>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, color: C.muted, lineHeight: 1.4 }}>
      {by} · {when}
    </div>
  </div>
);

const M1_Software3: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Software 3.0 : le prompt devient un programme</Title>
    <Lede>La lecture d’Andrej Karpathy (ex-Tesla, cofondateur d’OpenAI) : trois façons de programmer coexistent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 26 }}>
      <M1Sw v="1.0" what="Du code" prog="un ordinateur" by="Écrit par un humain" when="depuis les années 1940" tone="navy" d={100} />
      <M1Sw v="2.0" what="Des poids" prog="un réseau de neurones" by="Appris sur des données" when="depuis ~2012" tone="blue" d={220} />
      <M1Sw v="3.0" what="Des prompts" prog="un LLM" by="Écrits en langue naturelle" when="depuis ~2020" tone="violet" d={340} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, ...dl(500) }}>
      <Quote by="Andrej Karpathy, janvier 2023">The hottest new programming language is English.</Quote>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'flex', gap: 26 }}>
      <Card tone="coral" icon="sparkles" title="« Vibe coding » (Karpathy, 2025)" style={{ flex: 1 }} size={23}>
        On décrit, on accepte sans lire, on relance. Acceptable pour un prototype jetable du week-end.
      </Card>
      <Card tone="green" icon="shieldCheck" title="Ingénierie assistée par l’IA" style={{ flex: 1 }} size={23}>
        On spécifie, on découpe, on vérifie (tests, revue), on versionne. <strong>C’est l’objet de ces deux jours.</strong>
      </Card>
    </div>
  </Frame>
);

// ─── Les 5 niveaux d'assistance ─────────────────────────────────────────────
const M1Lvl = ({ n, title, ex, ctl, tone, beat }: { n: number; title: string; ex: string; ctl: string; tone: Tone; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ position: 'absolute', left: 120 + (n - 1) * 337, top: 780 - n * 98, width: 330 }}>
    <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '16px 20px', borderLeft: `8px solid ${STRONG[tone]}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Num n={n} tone={tone} size={40} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{ex}</div>
      <div style={{ marginTop: 6, fontSize: 19, fontWeight: 700, color: T[tone].fg }}>{ctl}</div>
    </div>
  </div>
);

const M1_Levels: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Cinq niveaux d’assistance, du Tab à l’agent autonome</Title>
    <Lede>Plus l’IA agit seule, plus elle va vite… et plus le contrôle humain doit être organisé.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <linearGradient id="m1lv" x1="0" x2="1">
          <stop offset="0" stopColor={C.green} />
          <stop offset="1" stopColor={C.coral} />
        </linearGradient>
      </defs>
      <path d="M 140 930 L 1790 930" stroke="url(#m1lv)" strokeWidth={6} strokeLinecap="round" className={A.grow} />
      <path d="M 1770 916 L 1792 930 L 1770 944" fill="none" stroke={C.coral} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ position: 'absolute', left: 140, top: 945, fontSize: 20, color: T.green.fg, fontWeight: 700 }}>Vous gardez la main à chaque frappe</div>
    <div style={{ position: 'absolute', right: 130, top: 945, fontSize: 20, color: T.coral.fg, fontWeight: 700 }}>Autonomie ↑ · contrôle à organiser ↑</div>
    <M1Lvl n={1} title="Complétion" ex="Tab, suggestions d’édition suivante (NES)" ctl="Contrôle : vous lisez chaque ligne" tone="green" beat={0} />
    <M1Lvl n={2} title="Chat (Ask)" ex="Expliquer, comparer, poser des questions" ctl="Contrôle : vous copiez ce que vous gardez" tone="teal" beat={1} />
    <M1Lvl n={3} title="Édition guidée" ex="Chat inline (Ctrl+I), modifications ciblées" ctl="Contrôle : vous relisez un diff" tone="blue" beat={2} />
    <M1Lvl n={4} title="Agent dans l’IDE" ex="Lit, modifie plusieurs fichiers, lance des commandes" ctl="Contrôle : plan validé + diffs + tests" tone="violet" beat={3} />
    <M1Lvl n={5} title="Agent autonome" ex="CLI, cloud, PR ouvertes seules (coding agent)" ctl="Contrôle : revue de PR + CI + droits limités" tone="coral" beat={4} />
  </Frame>
);

// ─── Typologie des outils 2026 ──────────────────────────────────────────────
const M1Fam = ({ icon, tone, title, desc, d, children }: { icon: IconName; tone: Tone; title: string; desc: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 10, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{desc}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>{children}</div>
  </div>
);

const M1_Typology: Page = () => (
  <Frame mod={1}>
    <Title>La typologie des outils en 2026</Title>
    <Lede>Les trois familles du programme (IDE, assistants, outils spécialisés), plus deux qui ont explosé depuis 2025.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 330, gap: 22 }}>
      <M1Fam icon="code" tone="blue" title="Assistants dans l’IDE" desc="Complétion, chat, édition et mode Agent au cœur de l’éditeur." d={100}>
        <Tag size={17}>GitHub Copilot</Tag>
        <Tag size={17}>Cursor</Tag>
        <Tag size={17}>Windsurf</Tag>
        <Tag size={17}>JetBrains AI · Junie</Tag>
        <Tag size={17}>Gemini Code Assist</Tag>
      </M1Fam>
      <M1Fam icon="chat" tone="violet" title="Assistants conversationnels" desc="Expliquer, concevoir, rédiger : hors de l’éditeur, sans accès au dépôt." d={180}>
        <Tag tone="violet" size={17}>ChatGPT</Tag>
        <Tag tone="violet" size={17}>Claude</Tag>
        <Tag tone="violet" size={17}>Gemini</Tag>
        <Tag tone="violet" size={17}>Le Chat (Mistral)</Tag>
      </M1Fam>
      <M1Fam icon="terminal" tone="coral" title="Agents CLI et cloud" desc="Ils lisent le dépôt, exécutent, testent et ouvrent des PR, parfois seuls." d={260}>
        <Tag tone="coral" size={17}>Claude Code</Tag>
        <Tag tone="coral" size={17}>OpenAI Codex</Tag>
        <Tag tone="coral" size={17}>Gemini CLI</Tag>
        <Tag tone="coral" size={17}>Copilot CLI · coding agent</Tag>
      </M1Fam>
      <M1Fam icon="cloud" tone="teal" title="IDE cloud et générateurs" desc="Un environnement prêt à coder, ou une application générée depuis une idée." d={340}>
        <Tag tone="teal" size={17}>GitHub Codespaces</Tag>
        <Tag tone="teal" size={17}>Replit</Tag>
        <Tag tone="teal" size={17}>Bolt · Lovable · v0</Tag>
        <Tag tone="teal" size={17}>Google Stitch (UI)</Tag>
      </M1Fam>
      <M1Fam icon="tool" tone="green" title="Outils spécialisés" desc="Tests, revue de code, sécurité, documentation, performance." d={420}>
        <Tag tone="green" size={17}>Qodo (tests)</Tag>
        <Tag tone="green" size={17}>Copilot code review</Tag>
        <Tag tone="green" size={17}>CodeRabbit</Tag>
        <Tag tone="green" size={17}>Copilot Autofix · Snyk</Tag>
        <Tag tone="green" size={17}>Mintlify (doc)</Tag>
      </M1Fam>
      <M1Fam icon="server" tone="navy" title="Modèles ouverts, en local" desc="Le code ne quitte pas votre réseau : souveraineté, au prix de la puissance." d={500}>
        <Tag tone="navy" size={17}>Ollama · LM Studio</Tag>
        <Tag tone="navy" size={17}>Mistral · Codestral</Tag>
        <Tag tone="navy" size={17}>Qwen Coder</Tag>
        <Tag tone="navy" size={17}>gpt-oss</Tag>
      </M1Fam>
    </div>
  </Frame>
);

// ─── Le marché en chiffres ──────────────────────────────────────────────────
const M1Fig = ({ value, label, src, tone, d }: { value: ReactNode; label: string; src: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 78, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.38, color: C.ink }}>{label}</div>
    <div style={{ marginTop: 'auto', paddingTop: 12, fontSize: 18, color: C.muted }}>{src}</div>
  </div>
);

const M1_Market: Page = () => (
  <Frame mod={1} kind="actu">
    <Title>Adoption massive, confiance… sous condition</Title>
    <Lede>Ce que disent les grandes enquêtes développeurs 2025-2026 (chiffres déclaratifs).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 310, gap: 24 }}>
      <M1Fig value={<CountUp to={90} suffix=" %" />} label="des professionnels du logiciel utilisent l’IA dans leur travail (médiane : 2 h par jour)" src="Google DORA 2025 · ~5 000 répondants" tone="blue" d={100} />
      <M1Fig value={<CountUp to={66} suffix=" %" />} label="utilisent un assistant ou un agent de code ; 26 % des workflows d’agents automatisés" src="Stack Overflow Survey 2026 · 30 000+ répondants" tone="violet" d={200} />
      <M1Fig value={<CountUp to={46} suffix=" %" />} label="se méfient de l’exactitude des réponses de l’IA, contre 33 % qui lui font confiance" src="Stack Overflow Survey 2025" tone="coral" d={300} />
      <M1Fig value={<CountUp to={6.6} digits={1} suffix=" %" />} label="lui feraient confiance pour des décisions importantes ; la vérification facile est la condition n° 1" src="Stack Overflow Survey 2026" tone="yellow" d={400} />
      <M1Fig value={<CountUp to={79} suffix=" %" />} label="jugent l’attribution des sources importante pour évaluer du code ou une réponse IA" src="Stack Overflow Survey 2026" tone="teal" d={500} />
      <M1Fig value={<CountUp to={80} prefix="> " suffix=" %" />} label="se disent plus productifs ; 59 % voient un effet positif sur la qualité du code" src="Google DORA 2025" tone="green" d={600} />
    </div>
  </Frame>
);

// ─── Le paradoxe de la productivité (METR) ──────────────────────────────────
const M1Bar = ({ label, v, tone, beat, d }: { label: string; v: number; tone: Tone; beat: number; d: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 20, ...dl(d) }}>
    <span style={{ width: 300, fontSize: 25, color: C.ink }}>{label}</span>
    <div style={{ position: 'relative', width: 760, height: 56 }}>
      <div style={{ position: 'absolute', left: 380, top: -8, bottom: -8, width: 3, background: C.faint }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          height: 56,
          borderRadius: 10,
          background: STRONG[tone],
          left: v >= 0 ? 380 : 380 + v * 12,
          width: Math.abs(v) * 12,
        }}
      />
    </div>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: STRONG[tone] }}>
      {v > 0 ? '+' : '−'}
      {Math.abs(v)} %
    </span>
  </div>
);

const M1_Paradox: Page = () => (
  <Frame mod={1} beats={3} kind="actu">
    <Title>Le paradoxe de la productivité</Title>
    <Lede>Étude METR (2025) : 16 développeurs open source expérimentés, 246 tâches réelles, avec ou sans IA.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, fontSize: 30, fontWeight: 600, color: C.ink }}>
      À votre avis, avec l’IA, ont-ils été plus rapides ? Main levée : plus rapides · pareil · plus lents.
    </div>
    <div style={{ position: 'absolute', left: 120, top: 370, display: 'flex', flexDirection: 'column', gap: 34 }}>
      <M1Bar label="Gain attendu (avant)" v={24} tone="blue" beat={1} d={0} />
      <M1Bar label="Gain ressenti (après)" v={20} tone="violet" beat={2} d={0} />
      <M1Bar label="Effet mesuré" v={-19} tone="coral" beat={3} d={0} />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'flex', gap: 24, ...dl(300) }}>
      <Card tone="coral" icon="gauge" title="Mesurez, ne ressentez pas" style={{ flex: 1 }} size={22}>
        L’impression de vitesse n’est pas un indicateur. Comparez des tâches terminées et validées.
      </Card>
      <Card tone="blue" icon="layers" title="Tout dépend du contexte" style={{ flex: 1 }} size={22}>
        Experts sur leur propre code mature : l’IA aide moins. Code nouveau, tests, boilerplate : elle aide plus.
      </Card>
      <Card tone="grey" icon="clock" title="Un résultat daté" style={{ flex: 1 }} size={22}>
        Outils de début 2025 : METR le qualifie lui-même d’historique. Le message de méthode, lui, reste.
      </Card>
    </div>
  </Frame>
);

// ─── Critères de choix (pondération interactive) ────────────────────────────
const M1_CRIT = ['Coût / budget', 'Intégration à l’outillage', 'Langages & frameworks', 'Confidentialité des données', 'Performance des résultats', 'Support & communauté'];
const M1_ARCH = [
  { name: 'Assistant IDE en SaaS (offre entreprise)', s: [3, 5, 5, 4, 5, 5], tone: 'blue' as Tone },
  { name: 'Agent CLI / cloud', s: [2, 4, 5, 3, 5, 4], tone: 'violet' as Tone },
  { name: 'Modèle ouvert hébergé en interne', s: [3, 3, 4, 5, 3, 2], tone: 'navy' as Tone },
];

const M1CritRow = ({ i, w, set }: { i: number; w: number[]; set: (i: number, v: number) => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 66 }}>
    <span style={{ width: 340, fontSize: 24, color: C.ink }}>{M1_CRIT[i]}</span>
    <Range value={w[i]} onChange={(v) => set(i, v)} min={0} max={5} step={1} w={330} tone={i === 3 ? 'coral' : 'blue'} />
    <span style={{ width: 40, fontFamily: display, fontWeight: 800, fontSize: 30, color: i === 3 ? C.coral : C.blue }}>{w[i]}</span>
  </div>
);

const M1ArchRow = ({ i, w, best }: { i: number; w: number[]; best: number }) => {
  const a = M1_ARCH[i];
  const tot = w.reduce((x, y) => x + y, 0) || 1;
  const score = a.s.reduce((acc, s, j) => acc + s * w[j], 0) / tot;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.ink }}>
        <span style={{ fontWeight: best === i ? 700 : 400 }}>
          {best === i ? '★ ' : ''}
          {a.name}
        </span>
        <strong style={{ color: STRONG[a.tone] }}>{fr(score, 1)} / 5</strong>
      </div>
      <div style={{ marginTop: 6, height: 20, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: STRONG[a.tone], transition: `width 400ms ${EASE}` }} />
      </div>
    </div>
  );
};

const M1_Criteria: Page = () => {
  const [w, setW] = useState([3, 3, 3, 3, 3, 3]);
  const set = (i: number, v: number) => setW((o) => o.map((x, j) => (j === i ? v : x)));
  const scores = M1_ARCH.map((a) => a.s.reduce((acc, s, j) => acc + s * w[j], 0));
  const best = scores.indexOf(Math.max(...scores));
  return (
    <Frame mod={1} kind="exercice">
      <Title>Choisir un outil : six critères, vos priorités</Title>
      <Lede>Réglez le poids de chaque critère selon VOTRE contexte : le classement des familles d’outils change.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M1CritRow i={0} w={w} set={set} />
        <M1CritRow i={1} w={w} set={set} />
        <M1CritRow i={2} w={w} set={set} />
        <M1CritRow i={3} w={w} set={set} />
        <M1CritRow i={4} w={w} set={set} />
        <M1CritRow i={5} w={w} set={set} />
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Btn size={19} ghost tone="coral" onClick={() => setW([2, 2, 2, 5, 3, 2])}>
            Projet sensible
          </Btn>
          <Btn size={19} ghost tone="blue" onClick={() => setW([2, 5, 3, 3, 3, 5])}>
            Grande équipe
          </Btn>
          <Btn size={19} ghost tone="green" onClick={() => setW([5, 3, 3, 2, 4, 2])}>
            Startup
          </Btn>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 270, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 24, ...dl(150) }}>
        <Eyebrow c={C.navy}>Score pondéré par famille</Eyebrow>
        <M1ArchRow i={0} w={w} best={best} />
        <M1ArchRow i={1} w={w} best={best} />
        <M1ArchRow i={2} w={w} best={best} />
        <div style={{ fontSize: 20, lineHeight: 1.45, color: C.muted }}>
          Notes indicatives à recalibrer avec vos propres essais (atelier comparatif). Un critère peut être éliminatoire : la confidentialité sur un projet
          sensible, par exemple.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1000, top: 790, width: 800, ...dl(300) }}>
        <Callout title="Le bon réflexe" tone="violet" icon="scale" size={23}>
          Pas de « meilleur outil » dans l’absolu : un outil adapté à un usage, à un niveau de risque et à un budget.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Confidentialité & contrat ──────────────────────────────────────────────
const M1Plan = ({ title, tone, children, d }: { title: string; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M1_Privacy: Page = () => (
  <Frame mod={1} kind="actu">
    <Title>Vos données : lisez le contrat avant le code</Title>
    <Lede>Exemple GitHub Copilot, deux changements de 2026 qui touchent directement les équipes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1100, display: 'flex', gap: 22 }}>
      <M1Plan title="Copilot Free, Pro, Pro+" tone="coral" d={100}>
        <Bullet tone="coral" size={22}>
          Depuis le 24 avril 2026 : prompts, extraits de code et contexte peuvent servir à <strong>entraîner les modèles</strong>, sauf opposition
        </Bullet>
        <Bullet tone="coral" size={22}>Réglage : Settings → Copilot → confidentialité (opt-out)</Bullet>
      </M1Plan>
      <M1Plan title="Copilot Business, Enterprise" tone="green" d={220}>
        <Bullet tone="green" size={22}>Données d’interaction non utilisées pour l’entraînement</Bullet>
        <Bullet tone="green" size={22}>Exclusion de contenu, journaux d’audit, politiques d’organisation</Bullet>
      </M1Plan>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 600, width: 1100, ...dl(400) }}>
      <Callout title="Et depuis le 1er juin 2026" tone="blue" icon="euro" size={24}>
        Copilot passe à la <strong>facturation à l’usage</strong> : des crédits IA (1 crédit = 0,01 $) calculés sur les tokens en entrée, en sortie et
        en cache. Une longue session d’agent coûte désormais plus qu’une question rapide.
      </Callout>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1280, top: 260, width: 520, background: G.navy, borderRadius: 20, padding: '26px 30px', color: '#fff', ...dl(300) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26 }}>6 questions à tout fournisseur</div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 22, lineHeight: 1.35, color: '#DCE3FA' }}>
        <div>1 · Mes données entraînent-elles vos modèles ?</div>
        <div>2 · Combien de temps sont-elles conservées ?</div>
        <div>3 · Où sont-elles traitées (UE ?)</div>
        <div>4 · Quels sous-traitants y accèdent ?</div>
        <div>5 · Y a-t-il un DPA conforme au RGPD ?</div>
        <div>6 · Puis-je exclure des fichiers et auditer l’usage ?</div>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, fontSize: 20, color: C.muted, ...dl(700) }}>
      Les conditions évoluent vite : vérifiez la documentation officielle et votre contrat avant chaque déploiement d’outil.
    </div>
  </Frame>
);

// ─── Forces et limites ──────────────────────────────────────────────────────
const M1FL = ({ icon, tone, title, children, cls }: { icon: IconName; tone: Tone; title: string; children: ReactNode; cls?: string }) => (
  <div className={cls} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const M1_ForcesLimits: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Forces et limites des assistants IA</Title>
    <Lede>Ce qui justifie leur usage… et ce qui impose de les encadrer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.green}` }}>
      <Eyebrow c={T.green.fg}>Forces</Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M1FL icon="bolt" tone="green" title="Vitesse sur le répétitif">Boilerplate, tests, migrations, scripts : des heures gagnées.</M1FL>
        <M1FL icon="brain" tone="green" title="Charge cognitive réduite">L’énergie va aux décisions, pas à la syntaxe.</M1FL>
        <M1FL icon="search" tone="green" title="Exploration d’un code inconnu">Expliquer un module, un legacy, une stack nouvelle.</M1FL>
        <M1FL icon="globe" tone="green" title="Multi-langages, multi-rôles">Du SQL au YAML, du test à la doc.</M1FL>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.coral}` }}>
      <Eyebrow c={T.coral.fg}>Limites</Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M1FL icon="eyeOff" tone="coral" title="Contexte projet partiel">Il ignore vos conventions… sauf si vous les écrivez.</M1FL>
        <M1FL icon="loop" tone="coral" title="Résultats variables">Même prompt, autre réponse : d’où les tests.</M1FL>
        <M1FL icon="lock" tone="coral" title="Confidentialité et dépendance">Données envoyées, service tiers, coût à l’usage.</M1FL>
        <M1FL icon="humanCheck" tone="coral" title="Vérification indispensable">La responsabilité du code reste la vôtre.</M1FL>
      </div>
    </div>
  </Frame>
);

// ─── Scénarios d'usage en production ────────────────────────────────────────
const M1Scn = ({ icon, tone, title, promise, gain, trap, flipAt }: { icon: IconName; tone: Tone; title: string; promise: string; gain: string; trap: string; flipAt: number }) => (
  <FlipCard
    w={400}
    h={560}
    tone={tone}
    backTone="grey"
    flipAt={flipAt}
    front={
      <>
        <IconTile name={icon} tone={tone} size={72} />
        <div style={{ marginTop: 22, fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink, lineHeight: 1.2 }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{promise}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={20}>
          Gain réel
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{gain}</div>
        <Eyebrow c={T.coral.fg} size={20} style={{ marginTop: 22 }}>
          Piège
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{trap}</div>
      </>
    }
  />
);

const M1_Scenarios: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Quatre scénarios d’usage en production</Title>
    <Lede>Cliquez une carte (ou avancez) pour voir le gain réel… et le piège qui va avec.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, display: 'flex', gap: 26 }}>
      <M1Scn icon="rocket" tone="blue" title="Prototypage rapide" promise="De l’idée au MVP cliquable en quelques heures." gain="Valider une idée avec des utilisateurs avant d’investir." trap="Le prototype part en production sans tests ni revue." flipAt={1} />
      <M1Scn icon="loop" tone="violet" title="Code legacy" promise="Comprendre, documenter et moderniser un vieux module." gain="Expliquer un code sans auteur, proposer une migration par étapes." trap="Une réécriture « propre » qui change le comportement." flipAt={2} />
      <M1Scn icon="doc" tone="green" title="Documentation" promise="README, JSDoc, ADR et guides générés depuis le code." gain="Une doc à jour, enfin, et des exemples d’usage." trap="Une doc qui décrit ce que le code devrait faire, pas ce qu’il fait." flipAt={3} />
      <M1Scn icon="flask" tone="pink" title="Tests unitaires" promise="Des suites de tests couvrant les cas limites." gain="Couverture et cas limites oubliés, en minutes." trap="Des tests « complaisants » qui valident le bug." flipAt={4} />
    </div>
  </Frame>
);

// ─── QCM M1 ─────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Choisir un assistant"
    q="Votre équipe démarre un projet pour un client du secteur santé. Avant de choisir un assistant de code, quel critère vérifiez-vous en premier ?"
    explain="Sur un projet sensible, la confidentialité est éliminatoire : un outil brillant mais non conforme est inutilisable. Les autres critères départagent ensuite les outils conformes."
  >
    <Opt why="Piège ! Les benchmarks publics mesurent des tâches génériques, pas votre conformité ni votre contexte.">Le score de l’outil sur les benchmarks publics</Opt>
    <Opt ok why="Oui : entraînement, rétention, localisation, sous-traitants, DPA. Sans réponse satisfaisante, l’outil est exclu.">
      Les conditions d’usage des données : entraînement, rétention, localisation, contrat
    </Opt>
    <Opt why="Non : utile pour départager, mais secondaire si l’outil ne peut pas recevoir votre code.">Le nombre de langages et de frameworks pris en charge</Opt>
    <Opt why="Non : le coût compte, mais un outil bon marché et non conforme coûte bien plus cher en cas d’incident.">Le prix par développeur et par mois</Opt>
  </QcmPage>
);

// ─── Lab 1.1 ────────────────────────────────────────────────────────────────
const M1_Lab11: Page = () => (
  <LabPage
    mod={1}
    n="1.1"
    title="Problème, personas & PRODUCT.md"
    defi="ameliorer"
    who="Product Owners · toute l’équipe"
    label="Fil rouge · Sprint 1 — De l’idée au produit"
    where={
      <>
        <PathChip>PRODUCT.md</PathChip> à la racine du dépôt (le dossier ouvert dans VS Code).
      </>
    }
    objective={
      <>
        Rédiger un <strong>PRODUCT.md</strong> de 2 pages maximum : le problème, les personas et la proposition de valeur de FrigoMalin. Ce fichier deviendra le
        contexte permanent de tous les agents.
      </>
    }
    feats={
      <>
        <Tag tone="blue" size={18}>Agent Ask</Tag>
        <Tag tone="blue" size={18}>Fichier de contexte produit</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l11a" size={22}>Le problème est chiffré (ou marqué « à vérifier »)</CheckItem>
        <CheckItem id="l11b" size={22}>Chaque persona a un objectif et une frustration</CheckItem>
        <CheckItem id="l11c" size={22}>Une section « Hors périmètre » existe</CheckItem>
      </>
    }
  >
    Ce prompt produit un texte marketing générique. Réécrivez-le pour obtenir un PRODUCT.md exploitable par des développeurs <em>et</em> par Copilot.
    <CodeDark file="Prompt de départ" size={24} wrap style={{ marginTop: 14 }}>
      Écris la description de mon application anti-gaspillage FrigoMalin.
    </CodeDark>
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: C.violet }}>
      <Icon name="bulb" size={22} color={C.violet} /> Indice : et si Copilot vous posait d’abord ses questions ?
    </div>
  </LabPage>
);

// ─── Atelier comparatif : même prompt, deux outils ──────────────────────────
const M1RateCtx = createContext<{ v: Record<string, number>; set: (k: string, n: number) => void } | null>(null);

const M1Dots = ({ id, tone }: { id: string; tone: Tone }) => {
  const ctx = useContext(M1RateCtx);
  const v = ctx?.v[id] ?? 0;
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          data-osd-interactive
          onClick={(e) => {
            e.currentTarget.blur();
            ctx?.set(id, v === n ? 0 : n);
          }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            background: n <= v ? STRONG[tone] : C.panel,
            boxShadow: n <= v ? 'none' : `inset 0 0 0 1.5px ${C.rule}`,
            transition: 'background 200ms ease',
          }}
        />
      ))}
    </div>
  );
};

const M1RateRow = ({ k: key, label }: { k: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56, borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ flex: 1, fontSize: 23, color: C.ink }}>{label}</span>
    <div style={{ width: 230 }}>
      <M1Dots id={`a-${key}`} tone="blue" />
    </div>
    <div style={{ width: 230 }}>
      <M1Dots id={`b-${key}`} tone="violet" />
    </div>
  </div>
);

const M1Total = ({ side, tone }: { side: 'a' | 'b'; tone: Tone }) => {
  const ctx = useContext(M1RateCtx);
  const s = Object.entries(ctx?.v ?? {})
    .filter(([key]) => key.startsWith(`${side}-`))
    .reduce((a, [, n]) => a + n, 0);
  return (
    <div style={{ width: 230 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>{s}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.faint }}> / 30</span>
    </div>
  );
};

const M1_Compare: Page = () => {
  const [v, setV] = useState<Record<string, number>>({});
  const set = (key: string, n: number) => setV((o) => ({ ...o, [key]: n }));
  return (
    <Frame mod={1} kind="atelier" label="Fil rouge · Sprint 1 — De l’idée au produit">
      <Title>Atelier : même prompt, deux outils</Title>
      <Lede>Votre prompt amélioré du lab 1.1, dans Copilot Chat ET dans un second assistant. Notez, comparez, argumentez.</Lede>
      <M1RateCtx.Provider value={{ v, set }}>
        <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1120, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 50 }}>
            <span style={{ flex: 1, fontSize: 20, color: C.muted, fontWeight: 700, letterSpacing: '0.06em' }}>CRITÈRE (1 à 5)</span>
            <span style={{ width: 230, fontSize: 21, fontWeight: 800, color: C.blue }}>Outil A · Copilot</span>
            <span style={{ width: 230, fontSize: 21, fontWeight: 800, color: C.violet }}>Outil B · au choix</span>
          </div>
          <M1RateRow k="pert" label="Pertinence et précision du contenu" />
          <M1RateRow k="quest" label="Pose des questions avant d’écrire" />
          <M1RateRow k="fmt" label="Respect du format demandé" />
          <M1RateRow k="fact" label="Factualité : rien d’inventé" />
          <M1RateRow k="integ" label="Intégration au workflow (dépôt, fichiers)" />
          <M1RateRow k="conf" label="Confidentialité et conditions d’usage" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 66 }}>
            <span style={{ flex: 1, fontSize: 23, fontWeight: 700, color: C.ink }}>Total</span>
            <M1Total side="a" tone="blue" />
            <M1Total side="b" tone="violet" />
          </div>
        </div>
      </M1RateCtx.Provider>
      <div style={{ position: 'absolute', left: 1300, top: 260, width: 500, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Timer id="m1-compare" minutes={10} label="Atelier comparatif" cls={A.right} style={{ width: 500 }} />
        <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(200) }}>
          <PanelTitle icon="users">Consignes</PanelTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 21, lineHeight: 1.4, color: C.soft }}>
            <div>1 · Même prompt, mot pour mot, dans les deux outils.</div>
            <div>2 · Outil B : ChatGPT, Claude, Gemini ou Le Chat.</div>
            <div>3 · Notez sans vous concerter, puis comparez en binôme.</div>
            <div>4 · Une phrase pour le groupe : « on garde A pour…, B pour… ».</div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Lab 1.2 ────────────────────────────────────────────────────────────────
const M1_Lab12: Page = () => (
  <LabPage
    mod={1}
    n="1.2"
    title="Périmètre du MVP & critères de succès"
    defi="trous"
    who="Product Owners · binômes"
    label="Fil rouge · Sprint 1 — De l’idée au produit"
    where={
      <>
        <PathChip>docs/mvp.md</PathChip> (créez le dossier <PathChip>docs/</PathChip> à la racine).
      </>
    }
    objective="Prioriser les fonctionnalités (MoSCoW) et définir des critères de succès mesurables pour le POC."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent Plan</Tag>
        <Tag tone="blue" size={18}>Priorisation MoSCoW</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l12a" size={22}>5 à 7 « Must » maximum</CheckItem>
        <CheckItem id="l12b" size={22}>Chaque « Must » a un critère mesurable</CheckItem>
        <CheckItem id="l12c" size={22}>Le partage familial est en « Won’t » (backend)</CheckItem>
      </>
    }
    bonus={
      <Callout title="Bonus · Lab 1.3" tone="pink" icon="sparkles" size={21}>
        Le backlog dans GitHub Issues via le serveur MCP GitHub (<code style={{ fontFamily: mono }}>.mcp.json</code>), critères Gherkin inclus.
      </Callout>
    }
  >
    Complétez les trous, puis lancez le prompt avec l’agent Plan en joignant PRODUCT.md.
    <CodeDark size={21} wrap style={{ marginTop: 12 }}>
      Agis comme <Hole>rôle</Hole>.{'\n'}À partir de <Cf>#PRODUCT.md</Cf>, propose le périmètre du POC FrigoMalin avec la méthode <Hole>priorisation</Hole>.{'\n'}
      Contraintes : <Hole>3 contraintes techniques non négociables</Hole>.{'\n'}Pour chaque « Must », donne <Hole>critère de réussite</Hole>.{'\n'}
      Format : <Hole>format</Hole>, enregistré dans docs/mvp.md.
    </CodeDark>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M1_Divider,
  M1_Timeline,
  M1_Determinism,
  M1_NextToken,
  M1_Context,
  M1_Halluc,
  M1_Software3,
  M1_Levels,
  M1_Typology,
  M1_Market,
  M1_Paradox,
  M1_Criteria,
  M1_Privacy,
  M1_ForcesLimits,
  M1_Scenarios,
  M1_Qcm,
  M1_Lab11,
  M1_Compare,
  M1_Lab12,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M1 · 9:30

OBJECTIF — Annoncer le module 1 du programme : panorama des outils, critères de choix, forces et limites, scénarios d’usage, atelier comparatif.

DIRE — « Module 1 : le panorama des outils. Avant de choisir un outil, il faut comprendre ce qu’il y a dessous. Je vais donc commencer par vingt minutes sur le fonctionnement d’un LLM, vu par un développeur : prédiction de tokens, contexte, hallucinations. Ce sont trois notions qui expliquent 80 % des surprises que vous aurez avec ces outils. Ensuite, la typologie des outils en 2026, les critères de choix, les forces et les limites. Puis on passe à la pratique : lab 1.1 sur FrigoMalin, un atelier comparatif entre deux outils, et le lab 1.2. »

ANIMATION — Laisser apparaître les items, pointer les badges de labs en bas.

TRANSITION — « Commençons par une question simple : l’IA, depuis quand ? »`,
  `⏱ 5 min · FRISE INTERACTIVE (3 temps)

OBJECTIF — Situer l’IA générative et agentique dans 80 ans d’histoire, mettre des visages sur les grandes étapes, montrer l’accélération récente.

DIRE — « L’IA n’est pas née avec ChatGPT. 1943, McCulloch et Pitts modélisent le neurone. 1950, Turing pose la question : une machine peut-elle penser ? 1956, Dartmouth invente le terme. 1957, le perceptron de Rosenblatt apprend. Puis la douche froide : 1969, Minsky et Papert montrent ses limites, c’est le premier hiver ; les systèmes experts des années 80 finissent dans un second hiver. Le renouveau vient de l’apprentissage : rétropropagation en 1986, CNN de Yann LeCun, LSTM… pendant que Deep Blue bat Kasparov par la force brute. Puis le deep learning : ImageNet de Fei-Fei Li, AlexNet en 2012, AlphaGo en 2016. » → clic 1. « 2017, l’article Transformer de Google, “Attention is all you need” : l’architecture de tous les LLM actuels. GPT-3 en 2020, GitHub Copilot en 2021, ChatGPT fin 2022, puis la course aux modèles. » → clic 2. « Depuis 2024 ça s’accélère encore : MCP branche les modèles aux outils, 2025 est l’année des agents de code et du “vibe coding”, 2026 celle des équipes d’agents. »

ANIMATION — → beat 1 : époque générative (violet). → beat 2 : époque agentique (vert). Survoler un jalon ouvre sa fiche (personnes, contexte, anecdote) : en piocher 2 ou 3 selon le public (ELIZA, AlexNet dans une chambre, coup 37 d’AlphaGo). Survoler une période du bandeau affiche son résumé.

TRANSITION — « Ce qui change fondamentalement, c’est la nature du programme. Démonstration. »`,
  `⏱ 4 min · DÉMO INTERACTIVE

OBJECTIF — Faire sentir la différence déterministe / probabiliste, et en tirer les réflexes de vérification.

DIRE — « À gauche, un programme classique : un calcul de TVA. Je relance, je relance : toujours 10 euros. C’est testable, explicable, reproductible. À droite, je demande à une IA : “écris une fonction qui valide un email”. Je relance… » Cliquer 3 ou 4 fois. « Regex simple, regex illisible, bibliothèque externe, approche maison. Toutes plausibles, aucune identique. Ce n’est pas un bug, c’est la nature du modèle. Conséquence : vous ne pouvez pas juger le code généré sur sa première impression. Trois réflexes : un prompt précis, des tests qui fixent le comportement attendu, et une revue humaine. »

ANIMATION — Cliquer « Relancer » à droite plusieurs fois, puis une fois à gauche. Demander : « Laquelle de ces quatre versions accepteriez-vous en PR ? » Réponse attendue : aucune sans tests.

TRANSITION — « Pourquoi ces variations ? Regardons comment le modèle choisit chaque mot. »`,
  `⏱ 4 min · DÉMO INTERACTIVE

OBJECTIF — Comprendre la prédiction du prochain token et l’effet de la température.

DIRE — « Le modèle lit tout ce qui précède et calcule, pour chaque suite possible, une probabilité. Ici, après “new Date(item.expiresOn) <”, la suite la plus probable est “new Date()”, puis “Date.now()” : deux suites correctes. Mais il existe aussi “today”, une variable qui n’existe pas, et “item.addedOn”, une logique fausse. Le modèle ne sait pas ce qui est vrai : il sait ce qui est probable. La température règle le hasard. Basse : on prend presque toujours la suite la plus probable. Haute : on explore… et on se trompe plus souvent. » Mettre la température à 0,2, échantillonner cinq fois ; puis à 1,8, échantillonner cinq fois.

ANIMATION — Compter les « suites fausses » dans les deux cas. Les outils de code fixent généralement une température basse pour la complétion.

TRANSITION — « Ce que le modèle lit avant de prédire, c’est son contexte. Et il coûte cher. »`,
  `⏱ 4 min · DÉMO INTERACTIVE

OBJECTIF — Comprendre la fenêtre de contexte : ce qui est envoyé à chaque requête et pourquoi ça compte (coût, latence, qualité).

DIRE — « Le modèle n’a aucune mémoire entre deux requêtes. Ce que vous prenez pour de la mémoire, c’est l’outil qui renvoie tout le contexte à chaque fois. Au départ : le prompt système de l’outil, les instructions du dépôt, vos fichiers joints, votre question. Léger. » Activer l’historique. « Une session qui dure depuis le matin : l’historique pèse lourd. » Activer les outils MCP, puis les résultats d’outils. « Les définitions d’outils et surtout leurs résultats — fichiers lus en entier, sorties de tests de 400 lignes — font exploser le contexte. Votre question pèse moins de 1 % de ce qui part. Trois conséquences : la facture, puisqu’on paie au token depuis juin ; la latence ; et la qualité, car un contexte saturé noie l’essentiel. »

ANIMATION — Activer les sources dans l’ordre. Le compteur passe du vert au rouge. Les chiffres sont des ordres de grandeur.

TRANSITION — « Dernière notion clé : quand le modèle ne sait pas, il invente quand même. »`,
  `⏱ 3 min · HALLUCINATIONS (2 temps)

OBJECTIF — Définir l’hallucination et ses formes typiques en développement.

DIRE — « Je demande un paquet npm pour lire des DLC françaises. Réponse fluide, précise, avec le nom du paquet, la commande d’installation et la fonction à appeler. » → clic 1. « Ce paquet n’existe pas. Le modèle a assemblé un nom crédible. Et c’est dangereux : si un attaquant publie ce nom-là avec du code malveillant, la commande d’installation devient un cheval de Troie. On en reparle au module 3. » → clic 2. « Les quatre formes que vous rencontrerez : le paquet inexistant, l’API ou le paramètre inventé, la connaissance périmée — le modèle connaît la version d’il y a deux ans —, et la source fabriquée : une RFC, un article du RGPD, un chiffre. »

ANIMATION — Demander : « Qui a déjà eu une API inventée par une IA ? » Recueillir un ou deux exemples réels.

TRANSITION — « Prenons un peu de recul : qu’est-ce que programmer, à l’ère des LLM ? »`,
  `⏱ 3 min · SOFTWARE 3.0 (1 temps)

OBJECTIF — Donner un cadre mental : coexistence code / poids / prompts ; distinguer vibe coding et ingénierie assistée.

DIRE — « Andrej Karpathy propose une lecture que je trouve utile. Software 1.0 : du code, écrit par un humain, qui programme un ordinateur. Software 2.0 : des poids, appris sur des données, qui programment un réseau de neurones. Software 3.0 : des prompts, écrits en langue naturelle, qui programment un LLM. Les trois coexistent dans vos projets. En 2023, il résumait : “le langage de programmation le plus en vogue, c’est l’anglais”. » → clic. « En 2025, il a aussi popularisé le “vibe coding” : on décrit, on accepte sans lire, on relance. C’est acceptable pour un prototype jetable. Mais dans une entreprise, on fait de l’ingénierie assistée : on spécifie, on découpe, on vérifie, on versionne. C’est exactement ce que nous allons pratiquer. »

ANIMATION — Insister sur la différence entre les deux cartes du bas : elle structure toute la formation.

TRANSITION — « Concrètement, quels niveaux d’assistance avez-vous à disposition ? »`,
  `⏱ 3 min · NIVEAUX D’ASSISTANCE (4 temps)

OBJECTIF — Situer complétion, chat, édition, agent et agent autonome sur un axe autonomie / contrôle.

DIRE — « Niveau 1 : la complétion. Vous tapez, l’IA propose, Tab pour accepter. Les suggestions d’édition suivante devinent la modification d’après. Vous lisez chaque ligne. » → clic. « Niveau 2 : le chat, en mode Ask. On explique, on compare, on questionne. » → clic. « Niveau 3 : l’édition guidée, le chat inline. Vous relisez un diff. » → clic. « Niveau 4 : l’agent dans l’IDE. Il lit plusieurs fichiers, modifie, lance des commandes, les tests. Le contrôle devient : un plan validé avant, des diffs relus, des tests au vert. » → clic. « Niveau 5 : l’agent autonome — en ligne de commande, dans le cloud, qui ouvre des PR tout seul. Là, le contrôle, c’est la revue de PR, la CI et des droits limités. Règle : plus d’autonomie, plus de contrôle organisé. Et on choisit le niveau le plus léger qui suffit à la tâche. »

ANIMATION — Les cinq marches apparaissent une à une.

TRANSITION — « Voyons maintenant qui fournit quoi : la typologie des outils. »`,
  `⏱ 4 min · TYPOLOGIE

OBJECTIF — Couvrir la typologie du programme (IDE avec IA, assistants conversationnels, outils spécialisés) et la mettre à jour pour 2026.

DIRE — « Le programme parle de trois familles : les environnements de développement avec IA, les assistants conversationnels et les outils spécialisés — tests, documentation, performance. En 2026, j’en ajoute deux qui ont explosé. Les assistants dans l’IDE : Copilot, Cursor, Windsurf, JetBrains avec Junie, Gemini Code Assist. Les assistants conversationnels, hors de l’éditeur. Les agents en ligne de commande et dans le cloud : Claude Code, Codex, Gemini CLI, Copilot CLI et le coding agent de GitHub. Les IDE cloud et générateurs d’applications : Codespaces, Replit, Bolt, Lovable, v0, et Google Stitch pour les interfaces, qu’on utilisera. Les outils spécialisés. Et les modèles ouverts, exécutables en local, pour la souveraineté. »

ANIMATION — Demander quels outils sont autorisés dans leur entreprise. Point de vigilance : le paysage change chaque trimestre, ces noms sont des exemples, pas des recommandations.

TRANSITION — « Qui les utilise, et avec quelle confiance ? »`,
  `⏱ 3 min · ACTUALITÉ · CHIFFRES

OBJECTIF — Donner des chiffres récents et sourcés sur l’adoption et la confiance.

DIRE — « Le rapport DORA 2025 de Google : 90 % des professionnels du logiciel utilisent l’IA, avec une médiane de deux heures par jour, et plus de 80 % se disent plus productifs. L’enquête Stack Overflow 2026, plus de 30 000 répondants : 66 % utilisent un assistant ou un agent de code. Mais la confiance ne suit pas : en 2025, 46 % se méfiaient de l’exactitude des réponses, contre 33 % qui lui faisaient confiance. En 2026, la confiance devient conditionnelle : on fait confiance quand on peut vérifier facilement, et seulement 6,6 % confieraient une décision importante à l’IA. 79 % veulent connaître la source. Message : tout le monde utilise l’IA, personne ne la croit sur parole. Ce sont des chiffres déclaratifs : ils mesurent des perceptions. »

ANIMATION — Les compteurs s’animent. Demander : « Ces chiffres ressemblent-ils à votre équipe ? »

TRANSITION — « Et justement, les perceptions peuvent tromper. »`,
  `⏱ 4 min · ACTUALITÉ · PARADOXE (3 temps)

OBJECTIF — Montrer l’écart entre productivité ressentie et mesurée ; installer le réflexe de mesure.

DIRE — « L’étude METR, 2025 : 16 développeurs open source expérimentés, sur leurs propres projets, 246 tâches réelles, tirées au sort avec ou sans IA. Votez : plus rapides, pareil, plus lents ? » Compter. → clic 1. « Avant, ils pensaient gagner 24 %. » → clic 2. « Après, ils estimaient avoir gagné 20 %. » → clic 3. « Mesuré : 19 % plus lents. Pourquoi ? Des experts sur un code qu’ils connaissent par cœur ; du temps passé à formuler, attendre, relire, corriger. Trois leçons : mesurez au lieu de ressentir ; le gain dépend fortement de la tâche et du contexte ; et c’est un résultat daté — METR le qualifie lui-même d’historique, les outils ont beaucoup progressé. Mais la leçon de méthode reste : on va définir des indicateurs au module 2. »

ANIMATION — Laisser le groupe réagir après la révélation du −19 %.

TRANSITION — « Si on veut mesurer et choisir, il faut des critères. »`,
  `⏱ 5 min · EXERCICE INTERACTIF

OBJECTIF — Appliquer les six critères de choix du programme (coût, intégration, langages, confidentialité, performance, support) à des familles d’outils.

DIRE — « Six critères : coût, intégration à votre outillage, langages et frameworks, confidentialité, performance, support et communauté. Il n’y a pas de meilleur outil dans l’absolu : il y a vos poids. » Cliquer « Projet sensible » : la confidentialité monte à 5, le modèle hébergé en interne remonte. Cliquer « Grande équipe » : intégration et support dominent, l’assistant IDE entreprise passe devant. Cliquer « Startup » : le coût pèse. « Ces notes sont indicatives : vous allez les recalibrer avec vos propres essais dans l’atelier comparatif. Et un critère peut être éliminatoire : sur un projet santé, si la confidentialité n’est pas garantie, le reste ne compte plus. »

ANIMATION — Faire régler les curseurs par un participant selon son contexte réel.

TRANSITION — « Parlons justement de ce critère éliminatoire : vos données. »`,
  `⏱ 3 min · ACTUALITÉ · CONFIDENTIALITÉ

OBJECTIF — Montrer que les conditions d’usage changent et doivent être vérifiées ; deux actualités 2026 de Copilot.

DIRE — « Deux changements de 2026 chez GitHub. Un : depuis le 24 avril, pour les offres individuelles Free, Pro et Pro+, les données d’interaction — prompts, extraits de code, contexte — peuvent servir à entraîner les modèles, sauf si vous vous y opposez dans les paramètres. Les offres Business et Enterprise ne sont pas concernées. Conséquence pratique : un développeur qui utilise son compte personnel sur du code d’entreprise pose un problème. Deux : depuis le 1er juin, Copilot est facturé à l’usage, en crédits calculés sur les tokens. Une longue session d’agent coûte plus qu’une question. À droite, six questions à poser à tout fournisseur : entraînement, rétention, localisation, sous-traitants, contrat RGPD, exclusion et audit. »

ANIMATION — Demander : « Qui utilise un compte personnel pour coder au travail ? » sans jugement.

TRANSITION — « Faisons le bilan : forces et limites. »`,
  `⏱ 2 min · FORCES ET LIMITES (1 temps)

OBJECTIF — Synthétiser les forces et limites (point du programme).

DIRE — « Les forces : la vitesse sur le répétitif — boilerplate, tests, migrations ; une charge cognitive réduite, l’énergie va aux décisions ; l’exploration d’un code inconnu ; la polyvalence, du SQL au YAML. » → clic. « Les limites : le contexte projet est partiel, l’IA ignore vos conventions tant que vous ne les écrivez pas ; les résultats varient ; la confidentialité et la dépendance à un service tiers, désormais facturé à l’usage ; et surtout la vérification reste indispensable. La responsabilité du code reste la vôtre. »

ANIMATION — Relier chaque limite à un module : contexte → M2, variabilité → tests M6, confidentialité → M5.

TRANSITION — « Dans quels scénarios ces forces paient-elles vraiment ? »`,
  `⏱ 4 min · SCÉNARIOS (4 temps)

OBJECTIF — Présenter les scénarios d’usage du programme avec leur gain et leur piège.

DIRE — « Quatre scénarios en production. Prototypage rapide : de l’idée au MVP en quelques heures. » → clic. « Gain réel : valider avec des utilisateurs avant d’investir. Piège : le prototype part en production sans tests. » → clic. « Code legacy : comprendre et moderniser. Piège : une réécriture élégante qui change le comportement. On verra comment l’éviter avec des tests de caractérisation. » → clic. « Documentation : enfin à jour. Piège : une doc qui décrit ce que le code devrait faire, pas ce qu’il fait. » → clic. « Tests unitaires : couverture et cas limites. Piège : des tests complaisants, générés à partir du code bogué, qui valident le bug. »

ANIMATION — Les cartes se retournent au clic (ou cliquer directement une carte). Demander quel scénario est le plus utile dans leur équipe.

TRANSITION — « Vérifions que le critère de choix est bien acquis. »`,
  `⏱ 2 min · QCM 1

OBJECTIF — Vérifier que la confidentialité est comprise comme critère éliminatoire.

DIRE — « Projet santé, quel critère en premier ? Votez. »

RÉPONSES — A ✗ piège : les benchmarks publics ne disent rien de votre conformité. B ✓ conditions d’usage des données : entraînement, rétention, localisation, contrat. C ✗ secondaire. D ✗ le coût d’un incident dépasse largement l’économie.

ANIMATION — Laisser cliquer les options, → révèle la bonne réponse, → l’explication. Rebondir : « Dans votre entreprise, qui valide ces conditions ? Le RSSI, le DPO, les achats ? » Les profils RSSI présents peuvent témoigner.

TRANSITION — « Passons à la pratique. Sprint 1 de FrigoMalin : de l’idée au produit. »`,
  `⏱ 15 min (minuteur) · LAB 1.1 · 10:45

OBJECTIF — Écrire un PRODUCT.md exploitable, en améliorant un mauvais prompt ; découvrir l’agent Ask comme sparring partner.

DIRE — « Tout commence par un problème, pas par du code. Le prompt de départ produit un texte marketing générique. Votre mission : le réécrire pour obtenir un PRODUCT.md de deux pages, factuel, qui servira de contexte à tous vos agents. Indice : demandez à Copilot de vous poser ses questions avant d’écrire. »

CORRIGÉ (formateur) — Rôle (PO senior anti-gaspillage) ; contexte (PWA 100 % navigateur, GitHub Pages, pas de backend, pas de comptes) ; « pose-moi au maximum 5 questions » ; structure imposée : problème chiffré et sourcé ou « à vérifier », 3 personas (objectif, frustration, moment d’usage), proposition de valeur en 1 phrase et 3 parcours, hors périmètre, glossaire DLC/DDM ; 2 pages max, ton factuel.

ANIMATION — Lancer le minuteur. Circuler : vérifier que les binômes laissent Copilot poser ses questions. Ce même prompt servira à l’atelier comparatif juste après : demander de le garder.

TRANSITION — « Prompt prêt ? Lancez-le maintenant dans un second outil. »`,
  `⏱ 10 min (minuteur) · ATELIER COMPARATIF (programme : test comparatif de deux outils)

OBJECTIF — Comparer deux outils sur une tâche réelle avec une grille commune ; recalibrer les critères de choix.

DIRE — « L’atelier du programme : tester deux outils sur la même tâche. Vous prenez votre prompt amélioré, mot pour mot, et vous le lancez dans Copilot Chat et dans un second assistant : ChatGPT, Claude, Gemini ou Le Chat de Mistral. Notez chaque critère de 1 à 5 sans vous concerter, puis comparez en binôme. Attention au critère “factualité” : vérifiez que les chiffres cités existent. Et au critère “confidentialité” : quel compte utilisez-vous, avec quelles conditions ? »

ANIMATION — Lancer le minuteur. La grille est cliquable : un clic sur une pastille note, un second clic annule. En restitution, chaque binôme donne sa phrase « on garde A pour…, B pour… ». Constat fréquent : l’assistant de l’IDE gagne sur l’intégration, le chat externe sur la rédaction, et beaucoup ont inventé un chiffre de gaspillage.

TRANSITION — « Vous avez le pourquoi. Passons au périmètre : le MVP. »`,
  `⏱ 15 min (minuteur) · LAB 1.2

OBJECTIF — Cadrer le MVP avec MoSCoW et des critères mesurables, avec l’agent Plan.

DIRE — « Deuxième lab, côté PO. Un prompt à trous : chaque trou est une décision. Le rôle, la méthode de priorisation, trois contraintes techniques non négociables, ce qui prouve qu’une fonctionnalité Must est réussie, et le format. Lancez-le avec l’agent Plan, en joignant PRODUCT.md avec le dièse. »

CORRIGÉ (formateur) — Rôle : PO + architecte front ; méthode MoSCoW ; contraintes : 100 % statique sur GitHub Pages, données locales (IndexedDB), hors ligne ; critère mesurable par Must (ex. « ajout d’un produit en moins de 10 s », « scan reconnu sur 8 produits sur 10 ») ; format : tableau Markdown Must/Should/Could/Won’t + critères, dans docs/mvp.md. Piège attendu : le partage familial doit être en Won’t, car il exige un backend.

ANIMATION — Lancer le minuteur. Pour les rapides : bonus 1.3, créer les issues GitHub via le serveur MCP GitHub (nécessite la politique MCP activée sur les licences Business).

TRANSITION — « Le produit est cadré. Module 2 : comment intégrer l’IA dans tout le cycle de développement. »`,
];
// @@NOTES-END
