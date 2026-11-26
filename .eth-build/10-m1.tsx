// ─── M1 · Divider ───────────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Qu’est-ce que l’intelligence artificielle ?" sub="Ce que c’est, d’où ça vient, comment ça apprend… et pourquoi ça se trompe." dur="≈ 50 min">
    <SecItem n={1}>Définition et historique</SecItem>
    <SecItem n={2}>IA, machine learning, deep learning : les différences</SecItem>
    <SecItem n={3}>Comment un outil comme ChatGPT écrit ses réponses</SecItem>
    <SecItem n={4}>Panorama des technologies d’IA</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── M1 · A day full of AI ──────────────────────────────────────────────────
const M1Moment = ({ x, n, time, icon, tone, title, ai }: { x: number; n: number; time: string; icon: IconName; tone: Tone; title: string; ai: string }) => (
  <>
    <div className={A.fade} style={{ position: 'absolute', left: x - 60, top: 470, width: 120, textAlign: 'center', fontFamily: mono, fontSize: 22, color: C.muted, ...dl(200 + n * 80) }}>
      {time}
    </div>
    <div className={A.dot} style={{ position: 'absolute', left: x - 13, top: 517, width: 26, height: 26, borderRadius: 99, background: '#fff', boxShadow: `inset 0 0 0 6px ${STRONG[tone]}`, ...dl(300 + n * 80) }} />
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 140, top: 300, width: 280, display: 'flex', justifyContent: 'center' }}>
      <IconTile name={icon} tone={tone} size={110} solid />
    </div>
    <div className={b.on(n)} style={{ position: 'absolute', left: x - 140, top: 590, width: 280, ...dl(120) }}>
      <div style={{ boxSizing: 'border-box', height: 250, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '26px 22px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{ai}</div>
      </div>
    </div>
  </>
);

const M1_Day: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Une journée ordinaire… pleine d’IA</Title>
    <Lede>Vous utilisez déjà l’intelligence artificielle des dizaines de fois par jour, souvent sans le savoir.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 528, width: 1680, height: 4, background: C.rule, ...dl(100) }} />
    <M1Moment x={260} n={1} time="7:00" icon="lock" tone="blue" title="Déverrouiller son téléphone" ai="Reconnaissance du visage" />
    <M1Moment x={540} n={2} time="8:10" icon="map" tone="teal" title="Éviter le bouchon" ai="Le GPS prédit la circulation" />
    <M1Moment x={820} n={3} time="9:00" icon="mail" tone="green" title="Une boîte sans pourriels" ai="Le filtre a appris à les reconnaître" />
    <M1Moment x={1100} n={4} time="11:30" icon="globe" tone="yellow" title="Lire un courriel en anglais" ai="Traduction automatique" />
    <M1Moment x={1380} n={5} time="14:00" icon="chat" tone="violet" title="Le clavier finit la phrase" ai="Prédiction du mot suivant" />
    <M1Moment x={1660} n={6} time="20:30" icon="play" tone="coral" title="« Vous aimerez aussi… »" ai="Recommandations de séries et de musique" />
  </Frame>
);

// ─── M1 · Definition ────────────────────────────────────────────────────────
const M1Cap = ({ n, icon, tone, verb, children, ex }: { n: number; icon: IconName; tone: Tone; verb: string; children: ReactNode; ex: string }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={72} />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 42, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', fontSize: 22, lineHeight: 1.35, color: T[tone].fg, background: T[tone].bg, borderRadius: 10, padding: '10px 14px' }}>{ex}</div>
    </div>
  </div>
);

const M1_Define: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>L’intelligence artificielle, en une phrase</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1680, ...dl(100) }}>
      <Quote by="Définition de travail, pour aujourd’hui">
        Des programmes capables de faire des tâches qui demandaient jusqu’ici l’<Hl>intelligence humaine</Hl>.
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', gap: 28 }}>
      <M1Cap n={1} icon="eye" tone="blue" verb="PERCEVOIR" ex="Ex. : transcrire l’appel d’un membre">
        Voir une image, entendre une voix
      </M1Cap>
      <M1Cap n={2} icon="book" tone="teal" verb="COMPRENDRE" ex="Ex. : résumer 40 courriels">
        Lire un texte et en saisir le sens
      </M1Cap>
      <M1Cap n={3} icon="trend" tone="green" verb="PRÉDIRE" ex="Ex. : repérer une réclamation inhabituelle">
        Anticiper à partir du passé
      </M1Cap>
      <M1Cap n={4} icon="sparkles" tone="violet" verb="GÉNÉRER" ex="Ex. : rédiger une lettre au membre">
        Produire un texte, une image, un plan
      </M1Cap>
    </div>
  </Frame>
);

// ─── M1 · A short history ───────────────────────────────────────────────────
const M1Year = ({ x, i, year, up, hot, children }: { x: number; i: number; year: string; up: boolean; hot?: boolean; children: ReactNode }) => (
  <>
    <div className={A.dot} style={{ position: 'absolute', left: x - 16, top: 584, width: 32, height: 32, borderRadius: 99, background: hot ? C.yellow : '#fff', boxShadow: `inset 0 0 0 7px ${hot ? C.amber : C.blue}`, ...dl(300 + i * 160) }} />
    <div style={{ position: 'absolute', left: x, top: up ? 380 : 640, width: 0, height: up ? 200 : 0 }}>
      <div className={A.in} style={{ position: 'absolute', left: -150, top: 0, width: 300, ...dl(380 + i * 160) }}>
        <div style={{ boxSizing: 'border-box', height: 190, background: hot ? T.yellow.bg : C.card, borderRadius: 16, boxShadow: hot ? `inset 0 0 0 3px ${C.yellow}` : SHADOW, padding: '18px 22px' }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, lineHeight: 1, color: hot ? C.amber : C.blue }}>{year}</div>
          <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</div>
        </div>
      </div>
    </div>
  </>
);

// Round picture sitting on the timeline, as the node of its year (drawn above the dot).
const M1Pic = ({ x, i, ph, pos = 'center', children }: { x: number; i: number; up?: boolean; ph?: PhotoId; pos?: string; children?: ReactNode }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 33, top: 567, width: 66, height: 66, borderRadius: 99, overflow: 'hidden', background: '#fff', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.rule}, 0 10px 22px -10px rgba(20,60,100,.5)`, ...dl(450 + i * 160) }}>
    {ph ? <Photo id={ph} w={66} h={66} radius={99} pos={pos} credit={false} /> : <div style={{ width: 66, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
  </div>
);

const M1_History: Page = () => (
  <Frame mod={1}>
    <Title>75 ans d’IA… et une accélération récente</Title>
    <Lede>Ce qui a changé en 2022 : l’IA est devenue accessible à tous, en français, sans programmer.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 597, width: 1680, height: 6, background: C.rule, ...dl(100) }} />
    <M1Year x={270} i={0} year="1950" up>
      Turing : « Les machines peuvent-elles penser ? »
    </M1Year>
    <M1Year x={467} i={1} year="1956" up={false}>
      Le terme « intelligence artificielle » est créé.
    </M1Year>
    <M1Year x={664} i={2} year="1997" up>
      Deep Blue bat Kasparov aux échecs.
    </M1Year>
    <M1Year x={861} i={3} year="2012" up={false}>
      L’apprentissage profond reconnaît les images.
    </M1Year>
    <M1Year x={1058} i={4} year="2016" up>
      AlphaGo bat un champion du jeu de go.
    </M1Year>
    <M1Year x={1255} i={5} year="2017" up={false}>
      Le « Transformer », le T de GPT, est inventé.
    </M1Year>
    <M1Year x={1452} i={6} year="2022" up hot>
      ChatGPT : l’IA générative pour tous.
    </M1Year>
    <M1Year x={1650} i={7} year="2025 +" up={false}>
      Des « agents » qui agissent dans nos outils.
    </M1Year>
    <M1Pic x={270} i={0} up ph="turing" />
    <M1Pic x={467} i={1} up={false} ph="mccarthy" />
    <M1Pic x={664} i={2} up ph="deepBlue" />
    <M1Pic x={861} i={3} up={false} ph="hinton" pos="50% 25%" />
    <M1Pic x={1058} i={4} up ph="leeSedol" pos="30% 30%" />
    <M1Pic x={1255} i={5} up={false}>
      <IconTile name="layers" tone="violet" size={66} solid style={{ borderRadius: 99 }} />
    </M1Pic>
    <M1Pic x={1452} i={6} up>
      <AppTile id="chatgpt" size={66} style={{ borderRadius: 99 }} />
    </M1Pic>
    <M1Pic x={1650} i={7} up={false}>
      <IconTile name="bot" tone="coral" size={66} solid style={{ borderRadius: 99 }} />
    </M1Pic>
  </Frame>
);

// ─── M1 · Programming vs learning ───────────────────────────────────────────
const M1Node = ({ icon, tone, children, w = 210 }: { icon: IconName; tone: Tone; children: ReactNode; w?: number }) => (
  <div style={{ boxSizing: 'border-box', width: w, minHeight: 92, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T[tone].bg, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${T[tone].bd}` }}>
    <Icon name={icon} size={30} color={T[tone].fg} />
    <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{children}</span>
  </div>
);

const M1Machine = ({ label }: { label: string }) => (
  <div style={{ width: 150, height: 150, borderRadius: 24, background: G.blue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#fff', flex: 'none' }}>
    <Icon name="cpu" size={56} color="#fff" />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em' }}>{label}</span>
  </div>
);

const M1Panel = ({ x, title, tone, children, cls, style }: { x: number; title: string; tone: Tone; children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: 270, width: 820, height: 540, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', ...style }}>
    <Eyebrow c={T[tone].fg}>{title}</Eyebrow>
    {children}
  </div>
);

const M1_RulesVsLearn: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Programmer… ou laisser la machine apprendre</Title>
    <Lede>La vraie nouveauté : on ne donne plus les règles, on donne des exemples.</Lede>
    <M1Panel x={120} title="Programmation classique" tone="grey" cls={A.left}>
      <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <M1Node icon="list" tone="grey">Des règles</M1Node>
          <M1Node icon="mail" tone="grey">Un courriel</M1Node>
        </div>
        <FlowArrow w={56} />
        <M1Machine label="PROGRAMME" />
        <FlowArrow w={56} />
        <M1Node icon="check" tone="grey" w={170}>Un résultat</M1Node>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 24, lineHeight: 1.5, color: C.ink, background: '#F7FAFC', borderRadius: 12, padding: '16px 20px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>
        SI le courriel contient « gratuit »
        <br />
        ALORS pourriel
      </div>
      <div className={b.fade(1)} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, fontSize: 25, color: T.coral.fg }}>
        <Icon name="alert" size={28} /> « Consultation gratuite avec votre conseiller » → bloqué à tort
      </div>
    </M1Panel>
    <M1Panel x={980} title="Apprentissage automatique" tone="blue" cls={b.on(2)}>
      <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <M1Node icon="archive" tone="blue">100 000 courriels</M1Node>
          <M1Node icon="check" tone="blue">déjà classés</M1Node>
        </div>
        <FlowArrow w={56} color={C.blue} />
        <M1Machine label="APPRENTISSAGE" />
        <FlowArrow w={56} color={C.blue} />
        <M1Node icon="sparkles" tone="green" w={170}>Ses propres règles</M1Node>
      </div>
      <div className={b.fade(3)} style={{ marginTop: 40 }}>
        <Callout title="Ce qui change" tone="green" icon="bulb" size={26}>
          La machine repère seule des centaines d’indices. On l’appelle un <b>modèle</b>.
        </Callout>
      </div>
    </M1Panel>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 850, width: 1680, fontSize: 26, color: C.soft, ...dl(300) }}>
      Revers de la médaille : le modèle apprend aussi les <b>erreurs et les biais</b> de ses exemples (module 4).
    </div>
  </Frame>
);

// ─── M1 · Learning by example (classifier that improves) ────────────────────
const M1Pt = ({ x, y, spam }: { x: number; y: number; spam?: boolean }) =>
  spam ? <rect x={x - 11} y={y - 11} width={22} height={22} fill={C.coral} /> : <circle cx={x} cy={y} r={12} fill={C.blue} />;

const M1Step = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={46} />
    <span style={{ fontSize: 26, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M1_Learn: Page = () => {
  const [ref, c] = useBeats();
  const angle = c >= 3 ? 36 : c >= 2 ? 10 : -28;
  const errors = c >= 3 ? '0' : c >= 2 ? '4' : c >= 1 ? '9' : '—';
  return (
    <Frame mod={1} kind="demo" beats={5}>
      <Title>Apprendre par l’exemple : le filtre anti-pourriel</Title>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1000, height: 730, background: C.card, borderRadius: 18, boxShadow: SHADOW }}>
        <svg width={1000} height={730} viewBox="0 0 1000 730" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <clipPath id="m1-plot">
              <rect x={70} y={30} width={900} height={600} />
            </clipPath>
          </defs>
          <g transform="translate(70 30)" clipPath="url(#m1-plot)">
            <g className={b.fade(1)}>
              <g style={{ transform: `translate(450px, 300px) rotate(${angle}deg)`, transition: `transform 900ms ${EASE}` }}>
                <rect x={-900} y={-900} width={1800} height={900} fill={T.coral.bg} opacity={0.75} />
                <line x1={-900} y1={0} x2={900} y2={0} stroke={C.ink} strokeWidth={4} strokeDasharray="14 10" />
              </g>
            </g>
          </g>
          <g transform="translate(70 30)">
            <M1Pt x={150} y={480} />
            <M1Pt x={220} y={380} />
            <M1Pt x={260} y={520} />
            <M1Pt x={320} y={440} />
            <M1Pt x={180} y={330} />
            <M1Pt x={380} y={520} />
            <M1Pt x={300} y={300} />
            <M1Pt x={420} y={430} />
            <M1Pt x={120} y={250} />
            <M1Pt x={500} y={520} />
            <M1Pt x={600} y={120} spam />
            <M1Pt x={700} y={220} spam />
            <M1Pt x={760} y={140} spam />
            <M1Pt x={560} y={240} spam />
            <M1Pt x={680} y={320} spam />
            <M1Pt x={800} y={260} spam />
            <M1Pt x={520} y={150} spam />
            <M1Pt x={640} y={60} spam />
            <M1Pt x={780} y={360} spam />
            <M1Pt x={720} y={420} spam />
            <g className={b.pop(4)}>
              <circle cx={610} cy={330} r={22} fill="#fff" stroke={C.ink} strokeWidth={3} />
              <text x={610} y={340} textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontWeight={700} fontSize={28} fill={C.ink}>
                ?
              </text>
            </g>
            <g className={b.pop(5)}>
              <rect x={588} y={308} width={44} height={44} fill={C.coral} />
              <text x={650} y={392} fontFamily="Barlow, sans-serif" fontWeight={600} fontSize={24} fill={T.coral.fg}>
                Pourriel à 92 %
              </text>
            </g>
          </g>
          <path d="M70 630 H970 M70 630 V30" stroke={C.faint} strokeWidth={3} fill="none" />
          <text x={520} y={672} textAnchor="middle" fontFamily="Barlow, sans-serif" fontSize={22} fill={C.muted}>
            Nombre de liens dans le courriel →
          </text>
          <text x={40} y={330} textAnchor="middle" fontFamily="Barlow, sans-serif" fontSize={22} fill={C.muted} transform="rotate(-90 40 330)">
            Mots promotionnels →
          </text>
        </svg>
        <div style={{ position: 'absolute', right: 26, bottom: 18, display: 'flex', gap: 22, fontSize: 22, color: C.soft }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, borderRadius: 99, background: C.blue }} /> Légitime
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, background: C.coral }} /> Pourriel
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1170, top: 220, width: 630, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 26px', display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Eyebrow c={C.muted} size={22}>
            Erreurs du modèle
          </Eyebrow>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1, color: errors === '0' ? C.green : C.coral, transition: 'color 400ms' }}>{errors}</span>
          <span style={{ fontSize: 22, color: C.muted }}>sur 20 exemples</span>
        </div>
        <M1Step n={1} tone="blue">
          Il trace une première frontière… au hasard.
        </M1Step>
        <M1Step n={2} tone="blue">
          Il compte ses erreurs et ajuste un peu.
        </M1Step>
        <M1Step n={3} tone="blue">
          Il recommence des milliers de fois : c’est l’<b>entraînement</b>.
        </M1Step>
        <M1Step n={4} tone="violet">
          Un nouveau courriel arrive…
        </M1Step>
        <M1Step n={5} tone="coral">
          Il le classe, avec une <b>probabilité</b>, jamais une certitude.
        </M1Step>
      </div>
    </Frame>
  );
};

// ─── M1 · How an LLM writes: one word at a time (interactive) ───────────────
type M1Cand = { w: string; p: number };
const M1_SEQ: { pick: string; cands: M1Cand[] }[] = [
  { pick: ' a', cands: [{ w: 'a', p: 41 }, { w: 'sera', p: 33 }, { w: 'est', p: 17 }, { w: 'nous', p: 6 }] },
  { pick: ' été', cands: [{ w: 'été', p: 62 }, { w: 'bien', p: 21 }, { w: 'fait', p: 9 }, { w: 'reçu', p: 4 }] },
  { pick: ' acceptée', cands: [{ w: 'acceptée', p: 36 }, { w: 'reçue', p: 34 }, { w: 'traitée', p: 18 }, { w: 'refusée', p: 8 }] },
  { pick: ',', cands: [{ w: ',', p: 45 }, { w: '.', p: 31 }, { w: 'et', p: 14 }, { w: 'le', p: 6 }] },
  { pick: ' vous', cands: [{ w: 'vous', p: 44 }, { w: 'et', p: 27 }, { w: 'le', p: 14 }, { w: 'nous', p: 9 }] },
  { pick: ' recevrez', cands: [{ w: 'recevrez', p: 47 }, { w: 'serez', p: 22 }, { w: 'pouvez', p: 18 }, { w: 'devez', p: 7 }] },
];

const M1CandRow = ({ c, top }: { c: M1Cand | undefined; top: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 58 }}>
    <span style={{ width: 190, fontFamily: mono, fontSize: 26, fontWeight: top ? 700 : 400, color: top ? C.blue : C.ink }}>« {c?.w ?? ''} »</span>
    <div style={{ flex: 1, height: 34, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ width: `${(c?.p ?? 0) * 2}%`, height: '100%', background: top ? C.blue : '#9CC6EA', borderRadius: 8, transition: `width 600ms ${EASE}` }} />
    </div>
    <span style={{ width: 80, textAlign: 'right', fontFamily: display, fontWeight: 700, fontSize: 32, color: top ? C.blue : C.muted }}>{c?.p ?? 0} %</span>
  </div>
);

const M1_NextWord: Page = () => {
  const [step, setStep] = useState(0);
  const done = step >= M1_SEQ.length;
  const text = M1_SEQ.slice(0, step)
    .map((s) => s.pick)
    .join('');
  const cands = done ? [] : M1_SEQ[step].cands;
  return (
    <Frame mod={1} kind="exercice">
      <Title>Comment ChatGPT écrit : un mot à la fois</Title>
      <Lede>Un modèle de langage (LLM) devine le mot le plus probable, puis recommence.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1060, height: 650, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 36px' }}>
        <Eyebrow c={C.muted} size={22}>
          Texte en cours
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 130, fontSize: 38, lineHeight: 1.4, color: C.ink }}>
          Bonjour, votre demande de remboursement<span style={{ color: C.blue, fontWeight: 600 }}>{text}</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 4, height: 40, marginLeft: 4, verticalAlign: '-6px', background: C.blue }} />
        </div>
        <Eyebrow c={C.muted} size={22} style={{ marginTop: 18 }}>
          {done ? 'Phrase terminée' : 'Mots candidats et probabilités'}
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 250 }}>
          {done ? (
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              Fluide, rassurant… mais <b>personne n’a ouvert le dossier</b>. « Acceptée » était seulement le mot le plus probable.
            </div>
          ) : (
            <>
              <M1CandRow c={cands[0]} top />
              <M1CandRow c={cands[1]} top={false} />
              <M1CandRow c={cands[2]} top={false} />
              <M1CandRow c={cands[3]} top={false} />
            </>
          )}
        </div>
        <div style={{ position: 'absolute', left: 36, bottom: 30, display: 'flex', gap: 16 }}>
          <Btn icon="play" disabled={done} onClick={() => setStep((s) => Math.min(M1_SEQ.length, s + 1))}>
            Mot suivant
          </Btn>
          <Btn icon="reset" ghost tone="grey" onClick={() => setStep(0)}>
            Recommencer
          </Btn>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1230, top: 280, width: 570, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone="blue" icon="book" title="1. Il a lu" cls={A.right} style={dl(200)}>
          Des milliards de phrases : livres, sites web, articles.
        </Card>
        <Card tone="teal" icon="chart" title="2. Il calcule" cls={A.right} style={dl(320)}>
          La probabilité de chaque mot qui pourrait suivre.
        </Card>
        <Card tone="violet" icon="loop" title="3. Il choisit, et recommence" cls={A.right} style={dl(440)}>
          Mot après mot, jusqu’à la fin de la réponse.
        </Card>
      </div>
    </Frame>
  );
};

// ─── M1 · Probable is not true ──────────────────────────────────────────────
for (let n = 1; n <= 3; n++) {
  CSS.push(`
.${P}-m1fl${n}{transition:background 400ms ${EASE},box-shadow 400ms ${EASE};border-radius:4px}
${at(n)} .${P}-m1fl${n}{background:${T.coral.bg};box-shadow:inset 0 -3px 0 ${C.coral}}
`);
}

const M1Why = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px' }}>
    <Num n={n} tone="coral" size={44} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 26, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Plausible: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Probable ne veut pas dire vrai</Title>
    <Lede>Chloé vérifie un point de la Loi 25. La réponse est claire, précise… et en partie inventée.</Lede>
    <PromptBox cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 960, ...dl(100) }}>
      Quelle est l’amende maximale prévue par la Loi 25 pour une entreprise ?
    </PromptBox>
    <AnswerBox cls={A.in} size={27} style={{ position: 'absolute', left: 120, top: 470, width: 960, ...dl(300) }}>
      L’amende maximale est de <span className={k('m1fl1')}>15 M$ ou 3 % du chiffre d’affaires mondial</span>, selon{' '}
      <span className={k('m1fl2')}>l’article 47.3 de la Loi 25</span>. Bonne nouvelle :{' '}
      <span className={k('m1fl3')}>les PME de moins de 50 employés en sont exemptées</span>.
    </AnswerBox>
    <div style={{ position: 'absolute', left: 1140, top: 280, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M1Why n={1} title="Un chiffre faux, mais crédible">
        Les vrais plafonds : 10 M$ ou 2 % (sanction administrative), 25 M$ ou 4 % (amende pénale).
      </M1Why>
      <M1Why n={2} title="Une référence inventée">
        La Loi 25 modifie plusieurs lois : « son article 47.3 » ne veut rien dire.
      </M1Why>
      <M1Why n={3} title="Une exception imaginaire">
        Aucune exemption pour les PME : toute entreprise est visée.
      </M1Why>
    </div>
    <Callout cls={b.on(4)} title="Ça s’appelle une hallucination" tone="coral" icon="alert" style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      Le modèle comble les trous avec du vraisemblable. Chiffre, loi, source : on vérifie toujours à la source.
    </Callout>
  </Frame>
);

// ─── M1 · Exercise: AI or not? ──────────────────────────────────────────────
const M1Flip = ({ icon, q, ai, why }: { icon: IconName; q: string; ai: boolean; why: string }) => (
  <FlipCard
    w={530}
    h={300}
    tone="green"
    backTone={ai ? 'blue' : 'grey'}
    front={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <IconTile name={icon} tone="green" size={60} />
        <div style={{ fontSize: 29, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{q}</div>
      </div>
    }
    back={
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: ai ? C.blue : C.soft }}>{ai ? '✓ C’est de l’IA' : '✗ Pas d’IA'}</div>
        <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.4, color: C.ink }}>{why}</div>
      </div>
    }
  />
);

const M1_AiOrNot: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>IA… ou pas IA ?</Title>
    <Lede>« IA » ou « pas IA » ? Votez, puis on retourne la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', rowGap: 30, columnGap: 44, ...dl(150) }}>
      <M1Flip icon="bell" q="Outlook vous rappelle une réunion 15 minutes avant" ai={false} why="Une règle fixe : « 15 min avant, afficher une alerte ». Aucun apprentissage." />
      <M1Flip icon="play" q="Netflix vous propose une série qui vous plaît" ai why="Le système a appris vos goûts et ceux de millions d’abonnés semblables." />
      <M1Flip icon="video" q="Teams résume une réunion d’une heure en 10 lignes" ai why="IA qui perçoit (transcription), puis IA qui génère (résumé)." />
      <M1Flip icon="chart" q="Excel colore en rouge les tâches en retard" ai={false} why="Une mise en forme conditionnelle : si date > échéance, alors rouge." />
      <M1Flip icon="mail" q="Gmail suggère « Merci, c’est noté ! » en réponse" ai why="Le modèle prédit une réponse probable à partir du courriel reçu." />
      <M1Flip icon="clock" q="Le thermostat baisse le chauffage à 22 h chaque soir" ai={false} why="Une programmation horaire. S’il apprenait vos habitudes, ce serait de l’IA." />
    </div>
  </Frame>
);

// ─── M1 · IA ⊃ ML ⊃ DL ⊃ IA générative ─────────────────────────────────────
const M1Ring = ({ r, label, tone, n, mid = false }: { r: number; label: string; tone: Tone; n?: number; mid?: boolean }) => (
  <g className={n ? b.pop(n) : undefined} style={vars({ o: 'center bottom' })}>
    <circle cx={350} cy={690 - r} r={r} fill={T[tone].bg} stroke={STRONG[tone]} strokeWidth={4} />
    <text x={350} y={mid ? 690 - r + 10 : 690 - 2 * r + 56} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 30, fill: T[tone].fg }}>
      {label}
    </text>
  </g>
);

const M1Def = ({ tone, name, children, ex, cls }: { tone: Tone; name: string; children: ReactNode; ex: string; cls?: string }) => (
  <div className={cls} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 26px', borderLeft: `8px solid ${STRONG[tone]}` }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{name}</div>
    <div style={{ marginTop: 2, fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</div>
    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, color: C.muted }}>
      <Icon name="leaf" size={22} color={C.teal} />
      {ex}
    </div>
  </div>
);

const M1_Nested: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>IA, machine learning, deep learning : des poupées russes</Title>
    <Lede>Chaque terme est un cas particulier du précédent.</Lede>
    <svg className={A.fade} width={700} height={700} viewBox="0 0 700 700" style={{ position: 'absolute', left: 120, top: 250 }}>
      <M1Ring r={340} label="Intelligence artificielle" tone="grey" />
      <M1Ring r={262} label="Machine learning" tone="blue" n={1} />
      <M1Ring r={186} label="Deep learning" tone="violet" n={2} />
      <M1Ring r={112} label="IA générative" tone="teal" n={3} mid />
    </svg>
    <div style={{ position: 'absolute', left: 880, top: 250, width: 920, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Def tone="grey" name="Intelligence artificielle" ex="Un système expert qui applique les règles de souscription" cls={A.right}>
        Tout système qui imite une capacité humaine, même avec des règles écrites à la main.
      </M1Def>
      <M1Def tone="blue" name="Machine learning · apprentissage automatique" ex="Un modèle qui estime le risque de fraude d’une réclamation" cls={b.left(1)}>
        Le système <b>apprend à partir d’exemples</b> au lieu de suivre des règles écrites.
      </M1Def>
      <M1Def tone="violet" name="Deep learning · apprentissage profond" ex="Lire un formulaire manuscrit numérisé" cls={b.left(2)}>
        Du machine learning avec des <b>réseaux de neurones</b> à nombreuses couches.
      </M1Def>
      <M1Def tone="teal" name="IA générative" ex="Rédiger la réponse à un courriel de membre" cls={b.left(3)}>
        Du deep learning qui <b>produit du contenu nouveau</b> : texte, image, voix, code.
      </M1Def>
    </div>
  </Frame>
);

// ─── M1 · Deep learning: layers that learn to see ───────────────────────────
const M1_PIX = ['1111110', '0000110', '0001100', '0001100', '0011000', '0011000', '0110000'];
const M1_COLS = [340, 540, 740];
const M1_ROWS = [130, 220, 310, 400, 490];

const M1Layer = ({ c, n, label }: { c: number; n: number; label: string }) => (
  <g className={b.fade(n)}>
    {M1_ROWS.map((y) => (
      <circle key={y} cx={M1_COLS[c]} cy={y} r={22} fill={T.violet.bg} stroke={C.violet} strokeWidth={4} />
    ))}
    <text x={M1_COLS[c]} y={580} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 30, fill: T.violet.fg }}>
      {label}
    </text>
  </g>
);

// Links into layer `to` (0 = from the image, 1–2 = from the previous layer).
const M1Links = ({ to, n }: { to: number; n: number }) => (
  <g className={b.fade(n)} stroke={C.faint} strokeWidth={1.5}>
    {M1_ROWS.flatMap((y2) =>
      (to === 0 ? [200, 260, 310, 360, 420] : M1_ROWS).map((y1) => (
        <line key={`${y1}-${y2}`} x1={to === 0 ? 200 : M1_COLS[to - 1] + 22} y1={y1} x2={M1_COLS[to] - 22} y2={y2} />
      )),
    )}
  </g>
);

const M1_Deep: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Le deep learning : des couches qui apprennent à voir</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1100, height: 680, background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100) }}>
      <svg width={1100} height={680} viewBox="0 0 1100 680" style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(40 233)">
          {M1_PIX.flatMap((row, y) =>
            row.split('').map((v, x) => <rect key={`${x}-${y}`} x={x * 22} y={y * 22} width={20} height={20} fill={v === '1' ? C.ink : C.panel} />),
          )}
        </g>
        <text x={117} y={430} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 26, fill: C.muted }}>
          Image
        </text>
        <M1Links to={0} n={1} />
        <M1Layer c={0} n={1} label="Traits" />
        <M1Links to={1} n={2} />
        <M1Layer c={1} n={2} label="Formes" />
        <M1Links to={2} n={3} />
        <M1Layer c={2} n={3} label="Chiffres" />
        <g className={b.pop(4)} style={vars({ o: 'center' })}>
          <path d="M772 310 H880" stroke={C.violet} strokeWidth={5} />
          <path d="M868 298 L884 310 L868 322" fill="none" stroke={C.violet} strokeWidth={5} strokeLinecap="round" />
          <rect x={900} y={240} width={160} height={140} rx={18} fill={C.violet} />
          <text x={980} y={336} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 84, fill: '#fff' }}>
            7
          </text>
          <text x={980} y={425} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 30, fill: T.violet.fg }}>
            à 97 %
          </text>
        </g>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1270, top: 220, width: 530, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="violet" icon="layers" title="Pourquoi « profond » ?" size={25} cls={A.right} style={dl(200)}>
        Parce qu’il y a beaucoup de couches. Chacune combine ce que la précédente a repéré.
      </Card>
      <Card tone="blue" icon="database" title="Ce qu’il lui faut" size={25} cls={A.right} style={dl(320)}>
        Des millions d’exemples et une grande puissance de calcul.
      </Card>
      <Callout cls={b.on(4)} title="Le revers" tone="coral" icon="eye" size={25}>
        Personne n’a écrit ces règles : difficile d’expliquer une décision (module 4).
      </Callout>
    </div>
  </Frame>
);

// ─── M1 · Panorama of AI technologies ───────────────────────────────────────
const M1Tech = ({ d, icon, tone, title, children, ex }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode; ex: string }) => (
  <Card tone={tone} icon={icon} title={title} size={25} cls={A.in} style={{ height: 300, ...dl(d) }}>
    {children}
    <div style={{ marginTop: 12, fontSize: 22, color: T[tone].fg, display: 'flex', gap: 8, alignItems: 'center' }}>
      <Icon name="leaf" size={20} />
      <span>{ex}</span>
    </div>
  </Card>
);

const M1_Panorama: Page = () => (
  <Frame mod={1}>
    <Title>Panorama : six grandes familles de technologies</Title>
    <Lede>Les outils du marché combinent souvent plusieurs familles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M1Tech d={100} icon="eye" tone="blue" title="Vision par ordinateur" ex="Lire les formulaires de réclamation">
        Reconnaître des objets, des visages, du texte dans une image.
      </M1Tech>
      <M1Tech d={200} icon="book" tone="teal" title="Traitement du langage" ex="Classer les courriels des membres">
        Comprendre, classer, résumer et traduire des textes.
      </M1Tech>
      <M1Tech d={300} icon="mic" tone="green" title="Reconnaissance de la parole" ex="Transcrire les appels du centre de contact">
        Transformer la voix en texte, et le texte en voix.
      </M1Tech>
      <M1Tech d={400} icon="trend" tone="yellow" title="Analyse prédictive" ex="Estimer le risque de fraude">
        Prévoir, estimer un risque, détecter une anomalie.
      </M1Tech>
      <M1Tech d={500} icon="sparkles" tone="violet" title="IA générative" ex="Rédiger une lettre, illustrer une campagne">
        Produire texte, image, voix ou code.
        <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
          <AppTile id="chatgpt" size={44} />
          <AppTile id="copilot" size={44} />
          <AppTile id="gemini" size={44} />
          <AppTile id="claude" size={44} />
        </div>
      </M1Tech>
      <M1Tech d={600} icon="bot" tone="coral" title="Agents IA" ex="Préparer seul un dossier de réclamation">
        Enchaîner des actions dans des outils, avec une part d’autonomie.
      </M1Tech>
    </div>
  </Frame>
);

// ─── M1 · QCM & synthesis ───────────────────────────────────────────────────
const M1_Qcm1: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="IA, machine learning ou deep learning ?"
    q="Mei entraîne un réseau de neurones à lire les formulaires manuscrits numérisés. Comment le classer ?"
    explain="Un réseau de neurones à plusieurs couches, entraîné sur des exemples, c’est du deep learning. Et comme les poupées russes, c’est donc aussi du machine learning et de l’IA."
  >
    <Opt why="Piège ! Il apprend à partir d’exemples de formulaires déjà lus : c’est la définition du machine learning.">De l’IA, mais pas du machine learning</Opt>
    <Opt why="Piège ! Le machine learning est une partie de l’IA : tout ce qui est machine learning est aussi de l’IA.">Du machine learning, mais pas de l’IA</Opt>
    <Opt ok why="Exact : réseau de neurones profond, donc deep learning, donc machine learning, donc IA.">
      Du deep learning, donc aussi du machine learning et de l’IA
    </Opt>
    <Opt why="Piège ! Il recopie le texte déjà écrit sur le formulaire : il reconnaît, il ne crée rien de nouveau.">De l’IA générative, puisqu’il produit du texte</Opt>
  </QcmPage>
);

const M1_Synth: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Notez trois moments de votre semaine où vous utilisez déjà l’IA sans y penser.
        <br />
        <br />
        Pour chacun : machine learning, deep learning ou IA générative ?
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      L’IA <b>apprend à partir d’exemples</b> au lieu de suivre des règles écrites.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      IA ⊃ machine learning ⊃ deep learning ⊃ <b>IA générative</b>.
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Elle répond avec une <b>probabilité</b>, jamais une certitude.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      Un LLM écrit le mot le plus <b>probable</b>, pas le plus vrai.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      Tout ce qui est automatique <b>n’est pas</b> de l’IA.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M1_Divider,
  M1_Day,
  M1_Define,
  M1_History,
  M1_RulesVsLearn,
  M1_Learn,
  M1_Nested,
  M1_Deep,
  M1_Panorama,
  M1_NextWord,
  M1_Plausible,
  M1_AiOrNot,
  M1_Qcm1,
  M1_Synth,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 15)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : qu'est-ce que l'intelligence artificielle ? Le but n'est pas de faire de vous des spécialistes, mais que vous compreniez assez bien la machine pour savoir quand lui faire confiance… et quand vous en méfier. C'est la base de toute l'éthique de cet après-midi. »

SOBEYS — Dites « de la matinée 2 » au lieu de « de cet après-midi ».

« Au programme : une définition et un peu d'histoire ; comment une machine apprend ; la différence entre IA, machine learning et deep learning ; un panorama des technologies ; et comment un outil comme ChatGPT écrit ses réponses. »

RYTHME — Environ 50 minutes.

TRANSITION — « Commençons par une journée ordinaire. »`,
  `⏱ 3 min · UNE JOURNÉE AVEC L'IA (6 clics)

OBJECTIF — Montrer que l'IA n'est ni nouvelle ni lointaine : on l'utilise déjà tous les jours.

DIRE — « Avant de définir quoi que ce soit, suivons une journée ordinaire. »
→ beat 1 : « 7 h : vous déverrouillez votre téléphone avec votre visage. C'est de l'IA qui perçoit. »
→ beat 2 : « 8 h 10 : le GPS vous fait éviter un bouchon. Il prédit la circulation à partir de millions de trajets. »
→ beat 3 : « 9 h : votre boîte de réception est presque sans pourriels. Le filtre a appris à les reconnaître. »
→ beat 4 : « 11 h 30 : un courriel en anglais ? Un clic, il est traduit. »
→ beat 5 : « 14 h : votre clavier finit la phrase à votre place. C'est exactement le principe de ChatGPT, en miniature. »
→ beat 6 : « 20 h 30 : "Vous aimerez aussi…". La plateforme a appris vos goûts. »

QUESTION — « Avant ce matin, qui aurait dit "j'utilise l'IA tous les jours" ? » Deux ou trois réponses au micro.

TRANSITION — « Alors, comment définir ce qui se cache derrière tout ça ? »`,
  `⏱ 3 min · DÉFINITION (4 clics)

OBJECTIF — Donner une définition simple et quatre capacités concrètes.

DIRE — « Une définition de travail, pour aujourd'hui : des programmes capables de faire des tâches qui demandaient jusqu'ici l'intelligence humaine. Concrètement, quatre capacités. »
→ beat 1 : « Percevoir : voir une image, entendre une voix. À la Mutuelle : transcrire l'appel d'un membre. »
→ beat 2 : « Comprendre : lire un texte et en saisir le sens. Résumer 40 courriels. »
→ beat 3 : « Prédire : anticiper à partir du passé. Repérer une réclamation inhabituelle. »
→ beat 4 : « Générer : produire un texte, une image. Rédiger une lettre. C'est l'IA générative, celle de ChatGPT. »

INSISTER — L'IA n'est pas « intelligente » comme nous : elle imite certaines capacités, sans conscience ni compréhension du monde. Le mot « intelligence » est une métaphore, et il crée des attentes.

TRANSITION — « D'où vient-elle ? Petit détour par l'histoire. »`,
  `⏱ 3 min · HISTORIQUE

OBJECTIF — Situer l'IA dans le temps : un domaine ancien, une rupture récente.

DIRE — « 1950 : Alan Turing pose la question "Les machines peuvent-elles penser ?" et propose un test. 1956 : le terme intelligence artificielle est inventé, lors d'un atelier à Dartmouth, aux États-Unis. 1997 : Deep Blue bat Kasparov aux échecs, avec des règles et beaucoup de calcul. 2012 : l'apprentissage profond se met à reconnaître les images, c'est le début du deep learning moderne. 2016 : AlphaGo bat un champion du jeu de go. 2017 : des chercheurs de Google inventent le Transformer, le T de GPT. »

Pointer 2022 (en jaune) : « Novembre 2022 : ChatGPT. Pour la première fois, n'importe qui peut parler à une IA, en français, sans rien installer. »

« Depuis 2025, on parle d'agents : des IA qui ne se contentent plus de répondre, mais qui agissent dans nos outils. »

À SOULIGNER — L'histoire a connu des « hivers de l'IA » (années 1970 et fin des années 1980) : des promesses non tenues, puis des budgets coupés. L'enthousiasme actuel n'est pas le premier.

CLIN D'ŒIL QUÉBEC — Montréal est un pôle mondial du deep learning (Mila, Yoshua Bengio, prix Turing 2018).

TRANSITION — « Ce qui a tout changé, c'est une nouvelle façon de programmer. »`,
  `⏱ 4 min · PROGRAMMER OU APPRENDRE (3 clics)

OBJECTIF — Faire comprendre l'idée centrale de l'apprentissage automatique.

DIRE — « À gauche, la programmation classique. Un humain écrit les règles : si le courriel contient "gratuit", alors c'est un pourriel. »
→ beat 1 : « Problème : la Mutuelle écrit à ses membres "Consultation gratuite avec votre conseiller", et le courriel est bloqué à tort. Les règles écrites à la main sont fragiles. »
→ beat 2 : « À droite, l'apprentissage automatique. On ne donne plus les règles : on donne 100 000 courriels déjà classés par des humains. La machine en déduit ses propres règles. »
→ beat 3 : « Elle repère seule des centaines d'indices. Ce qu'elle a appris s'appelle un modèle. Et revers de la médaille : elle apprend aussi les erreurs et les biais de ses exemples. On y reviendra au module 4. »

ANALOGIE — « C'est la différence entre donner une recette à quelqu'un et lui faire goûter 1 000 plats jusqu'à ce qu'il cuisine seul. »

TRANSITION — « Regardons cet apprentissage en action. »`,
  `⏱ 4 min · DÉMO ANIMÉE : APPRENDRE PAR L'EXEMPLE (5 clics)

OBJECTIF — Visualiser l'entraînement d'un modèle et la notion de probabilité.

DIRE — « Chaque point est un courriel. Rond bleu : légitime. Carré rouge : pourriel. En bas, le nombre de liens ; à gauche, les mots promotionnels. »
→ beat 1 : « Le modèle trace une première frontière, au hasard. Tout ce qui est dans la zone rose sera classé pourriel. Neuf erreurs. »
→ beat 2 : « Il compte ses erreurs et ajuste. Quatre erreurs. »
→ beat 3 : « Il recommence des milliers de fois : c'est l'entraînement. Zéro erreur sur ces exemples. »
→ beat 4 : « Un nouveau courriel arrive. Le modèle ne l'a jamais vu. »
→ beat 5 : « Il le classe… avec une probabilité : pourriel à 92 %. Jamais une certitude. »

INSISTER — Le mot clé est « probabilité ». Toutes les IA, y compris ChatGPT, fonctionnent ainsi. Une probabilité de 92 %, c'est aussi 8 % de chances de se tromper : sur 310 000 membres, ça fait du monde.

TRANSITION — « Ce que vous venez de voir, c'est du machine learning. Situons-le par rapport aux autres mots. »`,
  `⏱ 5 min · IA ⊃ ML ⊃ DL ⊃ IA GÉNÉRATIVE (3 clics)

OBJECTIF — Fixer la différence entre IA, machine learning et deep learning (objectif officiel n° 1).

DIRE — « Des poupées russes. Le grand cercle : l'intelligence artificielle, tout système qui imite une capacité humaine, même avec des règles écrites à la main. Exemple : un vieux système expert qui applique les règles de souscription. »
→ beat 1 : « Dedans, le machine learning, l'apprentissage automatique : le système apprend à partir d'exemples. C'est ce qu'on vient de voir avec les pourriels. À la Mutuelle : un modèle qui estime le risque de fraude d'une réclamation. »
→ beat 2 : « Dedans, le deep learning, l'apprentissage profond : du machine learning avec des réseaux de neurones à nombreuses couches. Excellent pour les images, le son, le texte. Lire un formulaire manuscrit numérisé. »
→ beat 3 : « Et au cœur, l'IA générative : du deep learning qui produit du contenu nouveau. ChatGPT, Copilot, Gemini, Claude. »

À RETENIR — « Tout ce qui est deep learning est du machine learning, et tout ce qui est machine learning est de l'IA. L'inverse n'est pas vrai. »

QUESTION — « Dans les médias, quand on dit "l'IA", on parle de quel cercle, la plupart du temps ? » Réponse attendue : de l'IA générative, le plus petit.

TRANSITION — « Ouvrons le cercle violet : pourquoi parle-t-on de "profond" ? »`,
  `⏱ 3 min · DEEP LEARNING (4 clics)

OBJECTIF — Donner une intuition des réseaux de neurones, sans mathématiques, et préparer la notion de boîte noire.

DIRE — « À gauche, une image : un chiffre écrit à la main. Le réseau va la lire en plusieurs étapes. »
→ beat 1 : « La première couche repère des traits : un trait horizontal, un trait en biais. »
→ beat 2 : « La deuxième combine les traits en formes : un angle, une barre. »
→ beat 3 : « La troisième combine les formes en chiffres. »
→ beat 4 : « Résultat : un 7, à 97 %. Toujours une probabilité. »

« Pourquoi profond ? Parce qu'il y a beaucoup de couches : les grands modèles actuels en ont des dizaines, avec des milliards de réglages. Il leur faut des millions d'exemples et beaucoup de calcul. »

LE REVERS — « Personne n'a écrit ces règles. Si le modèle refuse une réclamation, il est très difficile de dire pourquoi. C'est le problème de la boîte noire : on y revient au module 4. »

PRÉCISION — Le schéma est une simplification pédagogique : dans un vrai réseau, ce que « voit » chaque couche est beaucoup moins net.

TRANSITION — « Vision, langage, voix… Faisons le tour des grandes familles. »`,
  `⏱ 4 min · PANORAMA DES TECHNOLOGIES

OBJECTIF — Donner une carte des technologies d'IA, avec un exemple pour la Mutuelle à chaque fois.

DIRE — Parcourez les six tuiles :
• Vision par ordinateur : objets, visages, texte dans une image. À la Mutuelle : lire les formulaires de réclamation.
• Traitement du langage : comprendre, classer, résumer, traduire. Classer les courriels des membres.
• Reconnaissance de la parole : la voix en texte, le texte en voix. Transcrire les appels du centre de contact.
• Analyse prédictive : prévoir, estimer un risque, détecter une anomalie. Le risque de fraude.
• IA générative : texte, image, voix, code. Rédiger une lettre, illustrer une campagne.
• Agents IA : enchaîner des actions dans des outils. Préparer seul un dossier de réclamation.

À SOULIGNER — Les outils du marché combinent souvent plusieurs familles : Teams transcrit (parole), puis résume (langage, génératif).

QUESTION — « Laquelle de ces familles existe déjà dans votre organisation ? »

TRANSITION — « Ouvrons le capot de l'IA générative. »`,
  `⏱ 5 min · EXERCICE INTERACTIF : LE MOT SUIVANT

OBJECTIF — Faire comprendre comment un LLM écrit, et pourquoi c'est un enjeu éthique.

ANIMATION — Cliquez « Mot suivant » à six reprises. À chaque clic, lisez à voix haute les candidats et leurs probabilités, puis le mot retenu.

DIRE — « La phrase commence par : "Bonjour, votre demande de remboursement…". C'est l'agent conversationnel de la Mutuelle qui répond à un membre. Quel est le mot suivant le plus probable ? » Laissez deux ou trois personnes proposer au micro. « Le modèle hésite entre "a", "sera", "est"… Il choisit "a". Puis il recommence avec la phrase allongée. »

À droite, les trois étapes : il a lu des milliards de phrases, il calcule la probabilité de chaque mot, il choisit et recommence.

CHUTE — À la fin : « "Votre demande de remboursement a été acceptée, vous recevrez…". Fluide, rassurant. Mais le modèle n'a pas ouvert le dossier ! "Acceptée" était simplement plus probable que "refusée" dans les phrases qu'il a lues. Si le membre se fie à cette réponse, qui est responsable ? » On verra un vrai cas au module 4 : Air Canada.

PRÉCISION — Les probabilités affichées sont illustratives.

ASTUCE — « Recommencer » remet la phrase à zéro.

TRANSITION — « Conséquence directe : ce qui est probable n'est pas toujours vrai. »`,
  `⏱ 4 min · HALLUCINATION (4 clics)

OBJECTIF — Montrer une hallucination réaliste, sur un sujet de la journée : la Loi 25.

DIRE — « Chloé, notre responsable de la protection des renseignements personnels, vérifie un point de la Loi 25. La réponse est claire, précise, rassurante. »
→ beat 1 : « 15 M$ ou 3 % : faux, mais crédible. Les vrais plafonds, dans la loi sur le secteur privé : jusqu'à 10 M$ ou 2 % du chiffre d'affaires mondial pour une sanction administrative pécuniaire, et jusqu'à 25 M$ ou 4 % pour une amende pénale (doublée en cas de récidive). »
→ beat 2 : « "L'article 47.3 de la Loi 25" : la Loi 25 est une loi qui en modifie plusieurs autres ; cette référence ne veut rien dire. Le format est plausible, le contenu est inventé. »
→ beat 3 : « L'exemption des PME n'existe pas : toute entreprise qui traite des renseignements personnels est visée. »
→ beat 4 : « Ça s'appelle une hallucination. Le modèle comble les trous avec du vraisemblable. »

INSISTER — Plus la question est précise (chiffre, date, source, article de loi), plus il faut vérifier, à la source : ici, le site de la Commission d'accès à l'information (cai.gouv.qc.ca) ou LégisQuébec.

PRÉCISION — La réponse affichée est fabriquée pour l'exercice ; les vrais montants sont dans les notes ci-dessus.

TRANSITION — « Dernier réflexe à tester : tout ce qui est automatique est-il de l'IA ? »`,
  `⏱ 4 min · EXERCICE : IA OU PAS IA ?

OBJECTIF — Distinguer IA et simple règle programmée.

ANIMATION — Pour chaque carte : lisez-la, faites voter à voix haute (« IA » ou « pas IA »), puis cliquez pour retourner.

RÉPONSES —
• Rappel Outlook 15 min avant : pas d'IA, règle fixe.
• Netflix : IA, apprentissage des goûts.
• Résumé Teams : IA, perception (transcription) puis génération (résumé).
• Excel en rouge : pas d'IA, mise en forme conditionnelle.
• Réponse suggérée Gmail : IA, prédiction de texte.
• Thermostat à 22 h : pas d'IA. « S'il apprenait vos habitudes tout seul, là ce serait de l'IA. »

MESSAGE CLÉ — Tout ce qui est automatique n'est pas de l'IA. Le critère : est-ce que ça apprend ou interprète ? C'est aussi important pour l'éthique : une règle fixe s'explique facilement ; un modèle appris, beaucoup moins.

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 3 min · QCM 1

ANIMATION — Votes à voix haute (A, B, C ou D). Cliquez l'option majoritaire pour la rétroaction, puis → pour la bonne réponse et → pour l'essentiel.

RÉPONSE — C : du deep learning, donc aussi du machine learning et de l'IA.
• A ✗ PIÈGE — Il apprend à partir d'exemples : c'est du machine learning.
• B ✗ PIÈGE — Le machine learning est inclus dans l'IA.
• D ✗ PIÈGE — Il reconnaît du texte existant, il ne génère rien de nouveau. Bon réflexe toutefois : un même outil peut combiner lecture (deep learning) et rédaction (génératif).

TRANSITION — « Faisons le bilan du module 1. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 1

DIRE — Relisez les cinq points en les reliant aux animations vues :
1. L'IA apprend à partir d'exemples (le filtre anti-pourriel).
2. Les poupées russes : IA, machine learning, deep learning, IA générative.
3. Toujours une probabilité (92 %, 97 %), jamais une certitude.
4. Un LLM écrit le mot le plus probable, pas le plus vrai (la demande « acceptée », l'amende inventée).
5. Tout ce qui est automatique n'est pas de l'IA.

À VOTRE POSTE — Lisez la carte bleue : trois moments où vous utilisez l'IA, et à quel cercle ils appartiennent.

TRANSITION — « Maintenant qu'on sait ce que c'est, voyons ce qu'elle fait concrètement, secteur par secteur. »`,
];
// @@NOTES-END
