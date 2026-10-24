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
      <Quote by="Définition simple, pour ces deux jours">
        Des programmes capables de faire des tâches qui demandaient jusqu’ici l’<Hl>intelligence humaine</Hl>.
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', gap: 28 }}>
      <M1Cap n={1} icon="eye" tone="blue" verb="PERCEVOIR" ex="Ex. : transcrire une réunion">
        Voir une image, entendre une voix
      </M1Cap>
      <M1Cap n={2} icon="book" tone="teal" verb="COMPRENDRE" ex="Ex. : résumer 40 courriels">
        Lire un texte et en saisir le sens
      </M1Cap>
      <M1Cap n={3} icon="trend" tone="green" verb="PRÉDIRE" ex="Ex. : repérer une tâche qui va glisser">
        Anticiper à partir du passé
      </M1Cap>
      <M1Cap n={4} icon="sparkles" tone="violet" verb="GÉNÉRER" ex="Ex. : rédiger un plan de projet">
        Produire un texte, une image, un plan
      </M1Cap>
    </div>
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
        <Icon name="alert" size={28} /> « Livraison gratuite de vos vélos » → bloqué à tort
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
      Revers de la médaille : le modèle apprend aussi les <b>erreurs et les biais</b> de ses exemples (module 5).
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

// ─── M1 · Three families ────────────────────────────────────────────────────
const M1Fam = ({ n, icon, tone, name, what, ex, pm }: { n: number; icon: IconName; tone: Tone; name: string; what: string; ex: string; pm: string }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 620, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '34px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.4, color: C.soft }}>{what}</div>
      <div style={{ marginTop: 22, fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Au quotidien :</b> {ex}
      </div>
      <div style={{ marginTop: 'auto', fontSize: 24, lineHeight: 1.4, color: T[tone].fg, background: T[tone].bg, borderRadius: 12, padding: '14px 18px' }}>
        <b>En projet :</b> {pm}
      </div>
    </div>
  </div>
);

const M1_Families: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Trois grandes familles d’IA</Title>
    <Lede>Toutes apprennent à partir d’exemples. Elles diffèrent par ce qu’elles produisent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M1Fam n={1} icon="trend" tone="green" name="L’IA qui prédit" what="Elle classe, estime, anticipe." ex="filtre anti-pourriel, détection de fraude bancaire." pm="estimer une durée, signaler une tâche à risque." />
      <M1Fam n={2} icon="eye" tone="teal" name="L’IA qui perçoit" what="Elle voit et entend." ex="reconnaissance du visage, dictée vocale." pm="transcrire une réunion, lire une facture numérisée." />
      <M1Fam n={3} icon="sparkles" tone="violet" name="L’IA qui génère" what="Elle produit du nouveau contenu." ex="ChatGPT, Gemini, Copilot, Claude." pm="rédiger un plan, un compte rendu, un courriel." />
    </div>
  </Frame>
);

// ─── M1 · How an LLM writes: one word at a time (interactive) ───────────────
type M1Cand = { w: string; p: number };
const M1_SEQ: { pick: string; cands: M1Cand[] }[] = [
  { pick: ' lundi', cands: [{ w: 'lundi', p: 38 }, { w: 'demain', p: 31 }, { w: 'jeudi', p: 17 }, { w: 'une date', p: 9 }] },
  { pick: ' prochain', cands: [{ w: 'prochain', p: 46 }, { w: 'matin', p: 29 }, { w: '10 h', p: 12 }, { w: 'midi', p: 8 }] },
  { pick: ',', cands: [{ w: ',', p: 44 }, { w: 'à', p: 30 }, { w: '.', p: 18 }, { w: 'en', p: 5 }] },
  { pick: ' car', cands: [{ w: 'car', p: 35 }, { w: 'en', p: 33 }, { w: 'afin', p: 14 }, { w: 'dans', p: 9 }] },
  { pick: ' le', cands: [{ w: 'le', p: 40 }, { w: 'l’', p: 27 }, { w: 'plusieurs', p: 15 }, { w: 'Luc', p: 6 }] },
  { pick: ' fournisseur', cands: [{ w: 'fournisseur', p: 34 }, { w: 'local', p: 21 }, { w: 'chantier', p: 19 }, { w: 'budget', p: 11 }] },
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
          La réunion de suivi du projet est reportée à<span style={{ color: C.blue, fontWeight: 600 }}>{text}</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 4, height: 40, marginLeft: 4, verticalAlign: '-6px', background: C.blue }} />
        </div>
        <Eyebrow c={C.muted} size={22} style={{ marginTop: 18 }}>
          {done ? 'Phrase terminée' : 'Mots candidats et probabilités'}
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 250 }}>
          {done ? (
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              Fluide, plausible… mais <b>personne n’a dit</b> que le fournisseur était en cause. Le modèle a choisi ce qui « sonne bien ».
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
    <Lede>Karim demande une durée de travaux. La réponse est claire, précise… et en partie inventée.</Lede>
    <PromptBox cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 960, ...dl(100) }}>
      Combien de temps durent en moyenne les travaux d’aménagement d’une boutique de 250 m² à Québec ?
    </PromptBox>
    <AnswerBox cls={A.in} size={27} style={{ position: 'absolute', left: 120, top: 470, width: 960, ...dl(300) }}>
      Comptez en moyenne <span className={k('m1fl1')}>11,4 semaines</span>, selon{' '}
      <span className={k('m1fl2')}>l’étude 2023 de l’Observatoire québécois des chantiers commerciaux</span>. Prévoyez aussi{' '}
      <span className={k('m1fl3')}>2 semaines pour le permis</span> de la Ville de Québec.
    </AnswerBox>
    <div style={{ position: 'absolute', left: 1140, top: 280, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M1Why n={1} title="Une fausse précision">
        « 11,4 » sonne scientifique. Rien ne dit d’où vient ce chiffre.
      </M1Why>
      <M1Why n={2} title="Une source introuvable">
        L’IA a produit un nom plausible. Cette étude n’existe pas.
      </M1Why>
      <M1Why n={3} title="Un délai à vérifier">
        Peut-être juste, peut-être pas : seule la Ville le sait.
      </M1Why>
    </div>
    <Callout cls={b.on(4)} title="Ça s’appelle une hallucination" tone="coral" icon="alert" style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      Le modèle comble les trous avec du vraisemblable. Plus la question est précise, plus il faut vérifier.
    </Callout>
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

const M1_History: Page = () => (
  <Frame mod={1}>
    <Title>70 ans d’IA… et une accélération récente</Title>
    <Lede>Ce qui a changé en 2022 : l’IA est devenue accessible à tous, en français, sans programmer.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 597, width: 1680, height: 6, background: C.rule, ...dl(100) }} />
    <M1Year x={270} i={0} year="1956" up>
      Le terme « intelligence artificielle » est créé.
    </M1Year>
    <M1Year x={467} i={1} year="1997" up={false}>
      Deep Blue bat Kasparov aux échecs.
    </M1Year>
    <M1Year x={664} i={2} year="2011" up>
      Siri arrive dans nos téléphones.
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
    <M1Year x={1650} i={7} year="2023 +" up={false}>
      L’IA entre dans Outlook, Teams, Notion…
    </M1Year>
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
    <Lede>Votez dans le clavardage : « IA » ou « pas IA » ? Puis on retourne la carte.</Lede>
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

// ─── M1 · AI vs automation vs robotics ──────────────────────────────────────
const M1Word = ({ d, icon, tone, name, meta, def, ex }: { d: number; icon: IconName; tone: Tone; name: string; meta: string; def: ReactNode; ex: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 640, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 32px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name={icon} tone={tone} size={84} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: C.ink }}>{name}</div>
          <Tag tone={tone} size={20} style={{ marginTop: 6 }}>
            {meta}
          </Tag>
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 28, lineHeight: 1.42, color: C.ink }}>{def}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '16px 20px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <Eyebrow c={T[tone].fg} size={19}>
          Exemple projet
        </Eyebrow>
        <div style={{ marginTop: 4 }}>{ex}</div>
      </div>
    </div>
  </div>
);

const M1_ThreeWords: Page = () => (
  <Frame mod={1}>
    <Title>IA, automatisation, robotisation : trois mots souvent confondus</Title>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1680, display: 'flex', gap: 30 }}>
      <M1Word
        d={100}
        icon="gear"
        tone="grey"
        name="Automatisation"
        meta="La recette suivie à la lettre"
        def={
          <>
            Exécute des règles fixes : <b>« si… alors… »</b>. Toujours le même résultat.
          </>
        }
        ex="Quand une tâche passe en retard, un courriel part au responsable."
      />
      <M1Word
        d={250}
        icon="arm"
        tone="teal"
        name="Robotisation"
        meta="La main qui exécute"
        def={
          <>
            Un robot <b>physique</b> (bras d’usine) ou <b>logiciel</b> (RPA) qui refait les clics d’un humain.
          </>
        }
        ex="Un robot logiciel recopie chaque facture dans le vieux logiciel comptable."
      />
      <M1Word
        d={400}
        icon="brain"
        tone="blue"
        name="Intelligence artificielle"
        meta="Le jugement appris"
        def={
          <>
            Interprète, prédit ou génère à partir d’exemples. Gère l’<b>imprévu</b>… avec des erreurs possibles.
          </>
        }
        ex="Lire un courriel libre du fournisseur et en déduire le retard annoncé."
      />
    </div>
  </Frame>
);

// ─── M1 · They combine (pipeline) ───────────────────────────────────────────
const M1Station = ({ n, icon, tone, who, title, children }: { n: number; icon: IconName; tone: Tone; who: string; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 340, flex: 'none' }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '28px 26px' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <Eyebrow c={T[tone].fg} size={21} style={{ marginTop: 18 }}>
        {who}
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Pipeline: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Dans la vraie vie, les trois se combinent</Title>
    <Lede>Le fournisseur de comptoirs écrit à Karim : « On aura deux semaines de retard, désolés. »</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div className={A.left} style={{ width: 200, flex: 'none', textAlign: 'center' }}>
        <IconTile name="mail" tone="grey" size={110} style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 14, fontSize: 24, fontWeight: 600, color: C.ink }}>Courriel reçu</div>
        <div style={{ fontSize: 21, color: C.muted }}>texte libre</div>
      </div>
      <FlowArrow w={60} color={C.blue} dashed />
      <M1Station n={1} icon="brain" tone="blue" who="IA" title="Comprendre">
        Repère le lot touché, le retard annoncé (2 semaines) et l’impact sur l’ouverture.
      </M1Station>
      <div className={b.fade(2)}>
        <FlowArrow w={60} color={C.blue} dashed />
      </div>
      <M1Station n={2} icon="gear" tone="grey" who="Automatisation" title="Appliquer la règle">
        Si un jalon bouge de plus d’une semaine, alors alerte à Karim et à Luc.
      </M1Station>
      <div className={b.fade(3)}>
        <FlowArrow w={60} color={C.blue} dashed />
      </div>
      <M1Station n={3} icon="arm" tone="teal" who="Robot logiciel" title="Saisir">
        Inscrit le changement dans le registre, un vieil outil sans connecteur.
      </M1Station>
    </div>
    <Callout cls={b.on(4)} title="Qui décide ?" tone="yellow" icon="humanCheck" style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      Aucun des trois. Karim valide le nouvel échéancier et Luc arbitre si la date d’ouverture est menacée.
    </Callout>
  </Frame>
);

// ─── M1 · Comparison table ──────────────────────────────────────────────────
const M1Cell = ({ children, tone }: { children: ReactNode; tone?: Tone }) => (
  <div style={{ flex: 1, padding: '0 22px', fontSize: 25, lineHeight: 1.35, color: tone ? T[tone].fg : C.ink, fontWeight: tone ? 600 : 400 }}>{children}</div>
);

const M1Row = ({ n, label, children }: { n: number; label: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', minHeight: 104, borderTop: `2px solid ${C.rule}` }}>
    <div style={{ width: 300, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{label}</div>
    {children}
  </div>
);

const M1Head = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px' }}>
    <IconTile name={icon} tone={tone} size={50} solid />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{children}</span>
  </div>
);

const M1_Compare: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Comparons-les, critère par critère</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1680, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 30px 10px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 80 }}>
        <div style={{ width: 300, flex: 'none' }} />
        <M1Head icon="gear" tone="grey">
          Automatisation
        </M1Head>
        <M1Head icon="arm" tone="teal">
          Robotisation
        </M1Head>
        <M1Head icon="brain" tone="blue">
          IA
        </M1Head>
      </div>
      <M1Row n={1} label="Fonctionne avec">
        <M1Cell>des règles écrites à l’avance</M1Cell>
        <M1Cell>les écrans et les clics d’un humain</M1Cell>
        <M1Cell>des exemples et des données</M1Cell>
      </M1Row>
      <M1Row n={2} label="Face à l’imprévu">
        <M1Cell tone="coral">bloque</M1Cell>
        <M1Cell tone="coral">bloque si l’écran change</M1Cell>
        <M1Cell tone="green">s’adapte, en partie</M1Cell>
      </M1Row>
      <M1Row n={3} label="Résultat">
        <M1Cell tone="green">toujours identique</M1Cell>
        <M1Cell tone="green">toujours identique</M1Cell>
        <M1Cell tone="yellow">variable, probable</M1Cell>
      </M1Row>
      <M1Row n={4} label="Erreur typique">
        <M1Cell>une règle mal pensée</M1Cell>
        <M1Cell>une mise à jour du logiciel</M1Cell>
        <M1Cell>une erreur dite avec aplomb</M1Cell>
      </M1Row>
      <M1Row n={5} label="Idéal pour">
        <M1Cell>les tâches répétitives et stables</M1Cell>
        <M1Cell>les vieux logiciels sans connecteur</M1Cell>
        <M1Cell>le texte, le langage, l’ambigu</M1Cell>
      </M1Row>
    </div>
  </Frame>
);

// ─── M1 · Exercise: sort the tasks ──────────────────────────────────────────
const M1Zone = ({ x, icon, tone, label }: { x: number; icon: IconName; tone: Tone; label: string }) => (
  <div
    className={A.fade}
    style={{ position: 'absolute', left: x, top: 500, width: 540, height: 450, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, border: `3px dashed ${T[tone].bd}`, padding: '18px 22px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M1Key = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span className={b.pop(1)} style={{ flex: 'none', marginLeft: 'auto', padding: '2px 10px', borderRadius: 8, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
    {children}
  </span>
);

const M1_Sort: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>À vous : classez ces tâches du projet Limoilou</Title>
    <Lede>Dites-moi dans le clavardage où va chaque étiquette. Le corrigé apparaît au clic.</Lede>
    <M1Zone x={120} icon="gear" tone="grey" label="Automatisation" />
    <M1Zone x={690} icon="arm" tone="teal" label="Robotisation" />
    <M1Zone x={1260} icon="brain" tone="blue" label="IA" />
    <Drag x={120} y={262} w={405} tone="blue">
      Rappel automatique la veille d’une échéance <M1Key tone="grey">AUTO</M1Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue">
      Résumer un fil de 40 courriels <M1Key tone="blue">IA</M1Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue">
      Recopier les factures PDF dans le logiciel comptable <M1Key tone="teal">ROBOT</M1Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue">
      Créer une tâche quand un formulaire est rempli <M1Key tone="grey">AUTO</M1Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue">
      Repérer les tâches qui risquent de glisser <M1Key tone="blue">IA</M1Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue">
      Rédiger l’annonce de l’ouverture <M1Key tone="blue">IA</M1Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue">
      Bras qui assemble les cadres de vélo <M1Key tone="teal">ROBOT</M1Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue">
      Archiver les fichiers du projet chaque vendredi <M1Key tone="grey">AUTO</M1Key>
    </Drag>
  </Frame>
);

// ─── M1 · Panorama in business ──────────────────────────────────────────────
const M1Dept = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={25} cls={A.in} style={{ width: 540, height: 300, ...dl(d) }}>
    {children}
  </Card>
);

const M1_Business: Page = () => (
  <Frame mod={1}>
    <Title>En entreprise : l’IA est déjà dans chaque service</Title>
    <Lede>Les mêmes services que dans vos projets. Repérez le vôtre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M1Dept d={100} icon="users" tone="green" title="Ressources humaines">
        Rédiger des offres d’emploi, répondre aux questions des employés, préparer l’accueil.
      </M1Dept>
      <M1Dept d={200} icon="megaphone" tone="yellow" title="Marketing">
        Textes et visuels de campagne, idées de contenus, analyse des résultats.
      </M1Dept>
      <M1Dept d={300} icon="server" tone="violet" title="Technologies de l’information">
        Soutien aux utilisateurs, documentation, aide à la programmation.
      </M1Dept>
      <M1Dept d={400} icon="money" tone="teal" title="Finance">
        Lecture de factures, prévision de trésorerie, détection d’anomalies.
      </M1Dept>
      <M1Dept d={500} icon="chat" tone="blue" title="Service à la clientèle">
        Agents conversationnels, tri des courriels, réponses suggérées.
      </M1Dept>
      <M1Dept d={600} icon="truck" tone="coral" title="Opérations">
        Prévision de la demande, planification, maintenance prédictive.
      </M1Dept>
    </div>
  </Frame>
);

// ─── M1 · A few figures ─────────────────────────────────────────────────────
const M1Fig = ({ d, tone, value, label, src }: { d: number; tone: Tone; value: ReactNode; label: ReactNode; src: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '36px 34px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 110, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
      <div style={{ marginTop: 20, fontSize: 28, lineHeight: 1.4, color: C.ink }}>{label}</div>
      <div style={{ marginTop: 'auto', fontSize: 21, color: C.muted }}>{src}</div>
    </div>
  </div>
);

const M1_Figures: Page = () => (
  <Frame mod={1}>
    <Title>Une adoption rapide, au Canada comme ailleurs</Title>
    <Lede>Trois repères pour situer le mouvement, à mettre à jour régulièrement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M1Fig d={100} tone="blue" value={<CountUp to={800} suffix=" M" delay={300} />} label="d’utilisateurs de ChatGPT chaque semaine" src="Annonce d’OpenAI, octobre 2025" />
      <M1Fig
        d={250}
        tone="green"
        value={<CountUp to={12.2} digits={1} suffix=" %" delay={450} />}
        label="des entreprises canadiennes utilisent l’IA pour produire, deux fois plus qu’un an plus tôt"
        src="Statistique Canada, 2ᵉ trimestre 2025"
      />
      <M1Fig d={400} tone="yellow" value="80 %" label="du travail de gestion de projet « classique » (collecte, suivi, rapports) pris en charge par l’IA d’ici 2030" src="Prédiction de Gartner, 2019" />
    </div>
    <Callout cls={A.in} title="Lecture" tone="blue" icon="bulb" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      Le chargé de projet ne disparaît pas : il passe moins de temps à compiler, plus de temps à décider et à animer.
    </Callout>
  </Frame>
);

// ─── M1 · Good at / bad at ──────────────────────────────────────────────────
const M1Good = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 28, lineHeight: 1.3, color: C.ink }}>
    <span style={{ flex: 'none', width: 40, height: 40, borderRadius: 99, background: ok ? C.green : C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={ok ? 'check' : 'x'} size={24} color="#fff" sw={3} />
    </span>
    <span>{children}</span>
  </div>
);

const M1_GoodBad: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Ce que l’IA générative fait bien… et moins bien</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 230, width: 810, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '32px 36px' }}>
      <Eyebrow c={T.green.fg}>Très bonne pour</Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M1Good ok>Produire un premier jet en quelques secondes</M1Good>
        <M1Good ok>Résumer, reformuler, changer de ton</M1Good>
        <M1Good ok>Structurer : listes, tableaux, plans</M1Good>
        <M1Good ok>Proposer des idées, des risques oubliés</M1Good>
        <M1Good ok>Traduire et corriger</M1Good>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 990, top: 230, width: 810, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.coral}`, padding: '32px 36px' }}>
      <Eyebrow c={T.coral.fg}>Moins bonne pour</Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M1Good ok={false}>Les faits précis, les chiffres, les sources</M1Good>
        <M1Good ok={false}>Les calculs longs, non vérifiés</M1Good>
        <M1Good ok={false}>Ce que vous ne lui dites pas (votre contexte)</M1Good>
        <M1Good ok={false}>Les décisions et les arbitrages</M1Good>
        <M1Good ok={false}>Assumer la responsabilité d’une erreur</M1Good>
      </div>
    </div>
    <Callout cls={b.on(2)} title="Règle d’or" tone="yellow" icon="star" size={30} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      L’IA fait le <b>premier</b> jet. Vous faites le <b>dernier</b>.
    </Callout>
  </Frame>
);

// ─── M1 · QCMs ──────────────────────────────────────────────────────────────
const M1_Qcm1: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Automatisation ou IA ?"
    q="Chaque lundi, un courriel liste automatiquement les tâches en retard. De quoi s’agit-il ?"
    explain="Une règle fixe (« si échéance dépassée, alors lister ») = automatisation. Ce serait de l’IA si l’outil prédisait les tâches qui VONT prendre du retard."
  >
    <Opt why="Piège ! Rien n’est appris ni interprété : la règle est écrite à l’avance et donne toujours le même résultat.">De l’intelligence artificielle, puisque c’est automatique</Opt>
    <Opt ok why="Exact : un déclencheur (lundi), une condition (échéance dépassée), une action (courriel). C’est une automatisation classique.">
      Une automatisation à base de règles
    </Opt>
    <Opt why="Piège ! Aucun robot ne refait des clics à l’écran ici : l’outil de gestion de tâches envoie lui-même le courriel.">Une robotisation (RPA)</Opt>
    <Opt why="Piège ! Les trois notions sont bien distinctes, même si les outils les combinent souvent.">Les trois, c’est la même chose</Opt>
  </QcmPage>
);

const M1_Qcm2: Page = () => (
  <QcmPage
    mod={1}
    n={2}
    title="Pourquoi l’IA invente-t-elle ?"
    q="ChatGPT cite une étude qui n’existe pas. Quelle est la meilleure explication ?"
    explain="Un LLM produit la suite la plus probable, pas la plus vraie. Une source au nom plausible « sonne bien ». D’où la règle : toute source, tout chiffre se vérifie."
  >
    <Opt why="Piège ! Il n’y a pas d’intention : le modèle ne « sait » pas qu’il ment.">Il cherche volontairement à tromper l’utilisateur</Opt>
    <Opt why="Piège ! Même relié à Internet, il peut mal lire ou combiner des sources. Le problème est le mode de fonctionnement, pas une panne.">Il était déconnecté d’Internet, c’est un bogue</Opt>
    <Opt ok why="Oui : il prédit des mots probables. Un nom d’étude crédible est très probable… sans être vrai.">
      Il génère le texte le plus probable, sans vérifier qu’il est vrai
    </Opt>
    <Opt why="Piège ! Une demande plus précise aide, mais ne supprime pas le risque d’invention.">La question était trop longue</Opt>
  </QcmPage>
);

// ─── M1 · Synthesis ─────────────────────────────────────────────────────────
const M1_Synth: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Notez trois moments de votre semaine où vous utilisez déjà l’IA sans y penser.
        <br />
        <br />
        Puis posez une question de votre métier à un assistant… et vérifiez la réponse.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      L’IA <b>apprend à partir d’exemples</b> au lieu de suivre des règles écrites.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Trois familles : elle <b>prédit</b>, elle <b>perçoit</b>, elle <b>génère</b>.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      Un LLM écrit le mot le plus <b>probable</b>, pas le plus vrai.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Automatisation = règles, robotisation = clics, IA = jugement appris.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      L’IA fait le premier jet, <b>vous faites le dernier</b>.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M1_Day,
  M1_Define,
  M1_RulesVsLearn,
  M1_Learn,
  M1_Families,
  M1_NextWord,
  M1_Plausible,
  M1_History,
  M1_AiOrNot,
  M1_ThreeWords,
  M1_Pipeline,
  M1_Compare,
  M1_Sort,
  M1_Business,
  M1_Figures,
  M1_GoodBad,
  M1_Qcm1,
  M1_Qcm2,
  M1_Synth,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · UNE JOURNÉE AVEC L'IA (6 clics)

OBJECTIF — Montrer que l'IA n'est pas nouvelle ni lointaine : on l'utilise déjà tous les jours.

DIRE — « Avant de définir quoi que ce soit, suivons une journée ordinaire. »
→ beat 1 : « 7 h : vous déverrouillez votre téléphone avec votre visage. C'est de l'IA qui perçoit. »
→ beat 2 : « 8 h 10 : le GPS vous fait éviter un bouchon. Il prédit la circulation à partir de millions de trajets. »
→ beat 3 : « 9 h : votre boîte de réception est presque sans pourriels. Le filtre a appris à les reconnaître. »
→ beat 4 : « 11 h 30 : un courriel en anglais ? Un clic, il est traduit. »
→ beat 5 : « 14 h : votre clavier finit la phrase à votre place. C'est exactement le principe de ChatGPT, en miniature. »
→ beat 6 : « 20 h 30 : "Vous aimerez aussi…". La plateforme a appris vos goûts. »

QUESTION — « Avant ce matin, combien d'entre vous auraient dit "j'utilise l'IA tous les jours" ? »

TRANSITION — « Alors, comment définir ce qui se cache derrière tout ça ? »`,
  `⏱ 3 min · DÉFINITION (4 clics)

OBJECTIF — Donner une définition simple et quatre capacités concrètes.

DIRE — « Une définition simple, qu'on gardera pour deux jours : des programmes capables de faire des tâches qui demandaient jusqu'ici l'intelligence humaine. Concrètement, quatre capacités. »
→ beat 1 : « Percevoir : voir une image, entendre une voix. Exemple projet : transcrire une réunion. »
→ beat 2 : « Comprendre : lire un texte et en saisir le sens. Exemple : résumer un fil de 40 courriels. »
→ beat 3 : « Prédire : anticiper à partir du passé. Exemple : repérer la tâche qui va glisser. »
→ beat 4 : « Générer : produire un texte, une image, un plan. C'est l'IA générative, celle de ChatGPT. »

INSISTER — L'IA n'est pas « intelligente » comme nous : elle imite certaines capacités, sans conscience ni compréhension du monde.

TRANSITION — « Mais qu'est-ce qui la rend différente d'un logiciel ordinaire ? »`,
  `⏱ 4 min · PROGRAMMER OU APPRENDRE (3 clics)

OBJECTIF — Faire comprendre l'idée centrale de l'apprentissage automatique.

DIRE — « À gauche, la programmation classique. Un humain écrit les règles : si le courriel contient "gratuit", alors c'est un pourriel. »
→ beat 1 : « Problème : le fournisseur écrit "Livraison gratuite de vos vélos", et le courriel est bloqué à tort. Les règles écrites à la main sont fragiles. »
→ beat 2 : « À droite, l'apprentissage automatique. On ne donne plus les règles : on donne 100 000 courriels déjà classés par des humains. La machine en déduit ses propres règles. »
→ beat 3 : « Elle repère seule des centaines d'indices. Ce qu'elle a appris s'appelle un modèle. Et revers de la médaille : elle apprend aussi les erreurs et les biais de ses exemples. On y reviendra demain au module 5. »

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

INSISTER — Le mot clé est « probabilité ». Toutes les IA, y compris ChatGPT, fonctionnent ainsi.

TRANSITION — « Toutes les IA apprennent comme ça. Mais elles ne produisent pas toutes la même chose. »`,
  `⏱ 3 min · TROIS FAMILLES (3 clics)

OBJECTIF — Donner une carte simple des types d'IA.

DIRE — → beat 1 : « L'IA qui prédit : elle classe, estime, anticipe. Le filtre anti-pourriel, la détection de fraude. En projet : estimer une durée, signaler une tâche à risque. »
→ beat 2 : « L'IA qui perçoit : elle voit et entend. Votre visage, votre voix. En projet : transcrire une réunion, lire une facture numérisée. »
→ beat 3 : « L'IA qui génère : elle produit du contenu nouveau. ChatGPT, Gemini, Copilot, Claude. En projet : un plan, un compte rendu, un courriel. C'est celle qui nous occupera le plus. »

À SOULIGNER — Les outils modernes combinent souvent les trois : Teams transcrit (perçoit), puis résume (génère).

TRANSITION — « Ouvrons le capot de l'IA qui génère. »`,
  `⏱ 5 min · EXERCICE INTERACTIF : LE MOT SUIVANT

OBJECTIF — Faire comprendre comment un LLM écrit, et pourquoi il peut se tromper.

ANIMATION — Cliquez « Mot suivant » à six reprises. À chaque clic, lisez à voix haute les candidats et leurs probabilités, puis le mot retenu.

DIRE — « La phrase commence par : "La réunion de suivi du projet est reportée à…". Quel est le mot suivant le plus probable ? » Laissez le groupe proposer. « Le modèle hésite entre lundi, demain, jeudi… Il choisit "lundi". Puis il recommence avec la phrase allongée. »

À droite, les trois étapes : il a lu des milliards de phrases, il calcule la probabilité de chaque mot, il choisit et recommence.

CHUTE — À la fin : « La phrase est fluide. Mais qui a dit que le fournisseur était en cause ? Personne. Le modèle a choisi ce qui sonne bien. Retenez ça : il prédit, il ne vérifie pas. »

ASTUCE — « Recommencer » remet la phrase à zéro si un participant veut refaire l'expérience.

TRANSITION — « Conséquence directe : ce qui est probable n'est pas toujours vrai. »`,
  `⏱ 4 min · HALLUCINATION (4 clics)

OBJECTIF — Montrer une hallucination réaliste, dans le contexte du fil rouge.

DIRE — « Karim demande combien de temps durent des travaux d'aménagement. La réponse est claire, précise, rassurante. »
→ beat 1 : « 11,4 semaines. La virgule fait sérieux. Rien ne dit d'où vient ce chiffre. »
→ beat 2 : « Une étude d'un "Observatoire québécois des chantiers commerciaux". Le nom est plausible. Cette étude n'existe pas : l'IA l'a fabriquée. »
→ beat 3 : « Deux semaines pour le permis : peut-être juste. Seule la Ville le sait. »
→ beat 4 : « Ça s'appelle une hallucination. Le modèle comble les trous avec du vraisemblable. »

INSISTER — Plus la question est précise (chiffre, date, source, loi), plus il faut vérifier.

TRANSITION — « Un petit détour par l'histoire pour comprendre pourquoi tout le monde en parle depuis 2022. »`,
  `⏱ 3 min · HISTORIQUE

OBJECTIF — Situer l'IA dans le temps : un domaine ancien, une rupture récente.

DIRE — « 1956 : le terme intelligence artificielle est inventé lors d'une conférence aux États-Unis. 1997 : Deep Blue bat Kasparov aux échecs. 2011 : Siri. 2012 : l'apprentissage profond se met à reconnaître les images. 2016 : AlphaGo bat un champion du jeu de go. 2017 : des chercheurs de Google inventent le Transformer, le T de GPT. »

Pointer 2022 (en jaune) : « Novembre 2022 : ChatGPT. Pour la première fois, n'importe qui peut parler à une IA, en français, sans rien installer. »

« Depuis 2023, l'IA entre dans les outils que vous utilisez déjà : Outlook, Teams, Google, Notion, ClickUp. C'est ce qui nous intéresse pour la gestion de projet. »

TRANSITION — « Vérifions vos réflexes : IA ou pas IA ? »`,
  `⏱ 6 min · EXERCICE : IA OU PAS IA ?

OBJECTIF — Distinguer IA et simple règle programmée.

ANIMATION — Pour chaque carte : lisez-la, faites voter dans le clavardage (« IA » ou « pas IA »), puis cliquez pour retourner.

RÉPONSES —
• Rappel Outlook 15 min avant : pas d'IA, règle fixe.
• Netflix : IA, apprentissage des goûts.
• Résumé Teams : IA, perception (transcription) puis génération (résumé).
• Excel en rouge : pas d'IA, mise en forme conditionnelle.
• Réponse suggérée Gmail : IA, prédiction de texte.
• Thermostat à 22 h : pas d'IA. « S'il apprenait vos habitudes tout seul, là ce serait de l'IA. »

MESSAGE CLÉ — Tout ce qui est automatique n'est pas de l'IA. Le critère : est-ce que ça apprend ou interprète ?

TRANSITION — « Justement, trois mots se mélangent souvent : IA, automatisation, robotisation. » (Pause de 10 h 30 vers ici selon le rythme.)`,
  `⏱ 4 min · TROIS MOTS

OBJECTIF — Définir clairement automatisation, robotisation et IA.

DIRE — « Automatisation : la recette suivie à la lettre. Des règles "si… alors…", toujours le même résultat. Exemple : une tâche passe en retard, un courriel part au responsable. »

« Robotisation : la main qui exécute. Un robot physique, comme un bras d'usine, ou un robot logiciel, qu'on appelle RPA, qui refait les clics d'un humain dans un logiciel. Exemple : recopier chaque facture dans un vieux logiciel comptable. »

« Intelligence artificielle : le jugement appris. Elle interprète, prédit ou génère. Elle gère l'imprévu… avec des erreurs possibles. Exemple : lire un courriel libre du fournisseur et comprendre qu'il annonce un retard. »

QUESTION — « Dans votre service, vous avez plutôt de l'automatisation, de la robotisation ou de l'IA ? »

TRANSITION — « Et dans la réalité, ils travaillent souvent ensemble. »`,
  `⏱ 3 min · PIPELINE (4 clics)

OBJECTIF — Montrer que les trois se combinent dans un même flux.

DIRE — « Le fournisseur de comptoirs écrit à Karim : "On aura deux semaines de retard, désolés." Un texte libre, comme tous les courriels. »
→ beat 1 : « L'IA comprend : quel lot est touché, quel retard, quel impact sur l'ouverture. »
→ beat 2 : « L'automatisation applique une règle : si un jalon bouge de plus d'une semaine, alerte à Karim et à Luc. »
→ beat 3 : « Le robot logiciel inscrit le changement dans le registre, un vieil outil sans connecteur. »
→ beat 4 : « Et qui décide ? Aucun des trois. Karim valide le nouvel échéancier ; Luc arbitre si l'ouverture est menacée. »

TRANSITION — « Résumons les différences critère par critère. »`,
  `⏱ 3 min · TABLEAU COMPARATIF (5 clics)

OBJECTIF — Fixer les différences de façon mémorisable.

DIRE — Une ligne par clic.
→ beat 1 : « Fonctionne avec : des règles, des clics, ou des exemples. »
→ beat 2 : « Face à l'imprévu : l'automatisation et le robot bloquent. L'IA s'adapte, en partie. »
→ beat 3 : « Le résultat : identique à chaque fois pour les deux premiers. Variable pour l'IA : posez deux fois la même question, vous aurez deux réponses différentes. »
→ beat 4 : « L'erreur typique : une règle mal pensée, une mise à jour du logiciel qui casse le robot… et pour l'IA, une erreur dite avec aplomb. »
→ beat 5 : « Idéal pour : le répétitif et stable, les vieux logiciels, et pour l'IA le texte, le langage, l'ambigu. »

TRANSITION — « À vous de jouer. »`,
  `⏱ 6 min · EXERCICE GLISSER-DÉPOSER (1 clic pour le corrigé)

OBJECTIF — Appliquer la distinction sur des tâches du projet Limoilou.

ANIMATION — Pour chaque étiquette, demandez la colonne dans le clavardage (« auto », « robot » ou « IA ») et glissez-la selon la majorité. Double-cliquer une étiquette la remet à sa place.
→ beat 1 : le corrigé apparaît sur chaque étiquette.

CORRIGÉ —
• Automatisation : rappel la veille d'une échéance, tâche créée par formulaire, archivage du vendredi.
• Robotisation : recopier les factures PDF (robot logiciel), bras qui assemble les cadres (robot physique).
• IA : résumer 40 courriels, repérer les tâches à risque, rédiger l'annonce.

DÉBAT — « Repérer les tâches qui risquent de glisser » : certains diront automatisation. Nuance : une règle signale le retard constaté ; l'IA prédit le retard à venir.

TRANSITION — « Élargissons : où trouve-t-on l'IA en entreprise ? »`,
  `⏱ 3 min · PANORAMA PAR SERVICE

OBJECTIF — Montrer l'IA dans chaque service, en écho aux profils du groupe.

DIRE — Parcourez rapidement les six tuiles, en vous attardant sur les services des participants (notés au tour de table).
• RH : offres d'emploi, questions des employés. « Attention au tri automatique de CV : on parlera des biais demain. »
• Marketing : textes et visuels, idées de contenus.
• TI : soutien, documentation, aide au code.
• Finance : lecture de factures, prévision.
• Service à la clientèle : agents conversationnels, tri des courriels.
• Opérations : prévision de la demande, maintenance prédictive.

QUESTION — « Dans votre service, qu'est-ce qui existe déjà ? »

TRANSITION — « Quelques chiffres pour mesurer la vitesse du mouvement. »`,
  `⏱ 3 min · CHIFFRES

OBJECTIF — Situer l'ampleur du mouvement, avec des sources.

DIRE — « 800 millions d'utilisateurs de ChatGPT chaque semaine, selon OpenAI en octobre 2025. »
« Au Canada, Statistique Canada mesure la part des entreprises qui utilisent l'IA pour produire des biens ou des services : 12,2 % au 2ᵉ trimestre 2025, le double d'un an plus tôt. C'est encore une minorité, mais ça double chaque année. »
« Et une prédiction de Gartner, faite en 2019 : d'ici 2030, 80 % du travail de gestion de projet "classique" (collecte de données, suivi, rapports) serait pris en charge par l'IA. »

LECTURE — « Ça ne veut pas dire que le chargé de projet disparaît. Il passe moins de temps à compiler, plus de temps à décider et à animer. »

À VÉRIFIER — Avant chaque session, vérifiez si des chiffres plus récents sont disponibles (OpenAI, Statistique Canada).

TRANSITION — « Concrètement, à quoi l'IA générative est-elle bonne ? »`,
  `⏱ 3 min · FORCES ET LIMITES (2 clics)

OBJECTIF — Poser un regard équilibré, préparer le module 5.

DIRE — « À gauche, ce qu'elle fait très bien : un premier jet en quelques secondes, résumer, reformuler, structurer, proposer des idées et des risques oubliés, traduire. »
→ beat 1 : « À droite, ce qu'elle fait moins bien : les faits précis, les chiffres et les sources ; les calculs longs ; votre contexte, si vous ne le lui donnez pas ; les décisions ; et surtout, elle n'assume aucune responsabilité. »
→ beat 2 : « La règle d'or de ces deux jours : l'IA fait le premier jet, vous faites le dernier. »

TRANSITION — « Deux questions pour vérifier tout ça. »`,
  `⏱ 3 min · QCM 1

ANIMATION — Votes dans le clavardage (A, B, C ou D). Cliquez l'option majoritaire pour la rétroaction, puis → pour la bonne réponse et → pour l'essentiel.

RÉPONSE — B, une automatisation à base de règles.
• A ✗ PIÈGE — « Automatique ne veut pas dire intelligent. »
• C ✗ PIÈGE — Pas de clics simulés : l'outil envoie lui-même le courriel.
• D ✗ PIÈGE — Les trois notions sont distinctes.

POUR ALLER PLUS LOIN — « Qu'est-ce qui en ferait de l'IA ? Prédire les tâches qui vont prendre du retard, avant qu'elles le soient. »

TRANSITION — « Deuxième question, sur les hallucinations. »`,
  `⏱ 3 min · QCM 2

RÉPONSE — C : il génère le texte le plus probable, sans vérifier qu'il est vrai.
• A ✗ PIÈGE — Pas d'intention : aucune volonté de tromper.
• B ✗ PIÈGE — Ce n'est pas un bogue : c'est le fonctionnement normal du modèle.
• D ✗ PIÈGE — Une demande précise aide, mais ne supprime pas le risque.

MESSAGE CLÉ — Tout chiffre, toute source, toute référence à une loi se vérifie.

TRANSITION — « Faisons le bilan du module 1. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 1

DIRE — Relisez les cinq points en les reliant aux animations vues :
1. L'IA apprend à partir d'exemples (le filtre anti-pourriel).
2. Trois familles : prédire, percevoir, générer.
3. Un LLM écrit le mot le plus probable (le mot suivant), pas le plus vrai (l'étude inventée).
4. Automatisation, robotisation, IA : règles, clics, jugement appris.
5. L'IA fait le premier jet, vous faites le dernier.

À VOTRE POSTE — Lisez la carte bleue : trois moments où vous utilisez déjà l'IA, et une question métier à vérifier.

TRANSITION — « Passons au cœur du sujet : l'IA dans la gestion de projet. »`,
];
// @@NOTES-END
