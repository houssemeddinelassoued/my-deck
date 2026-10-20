// ─── Module 3 · Opportunités & priorisation ─────────────────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title="Identifier et prioriser les opportunités IA"
    sub="Signaux, valeur, faisabilité : trier le backlog avec des critères explicites, et défendre ses choix."
    dur="55 min"
    kind="atelier"
    labs={
      <>
        <Tag tone="green" size={20}>
          Calculateur de valeur
        </Tag>
        <Tag tone="yellow" size={20}>
          Atelier · prioriser le backlog
        </Tag>
        <Tag tone="violet" size={20}>
          QCM 5 & 6
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Les signaux qui annoncent une bonne opportunité… et les autres</SecItem>
    <SecItem n={2}>Partir du problème, pas de la technologie</SecItem>
    <SecItem n={3}>Chiffrer la valeur, évaluer la faisabilité</SecItem>
    <SecItem n={4}>Matrice, scoring et top 3 argumenté</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Signaux et anti-signaux ────────────────────────────────────────────────
const M3Signal = ({ icon, tone, title, children, ex, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; ex: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.38, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 8, fontSize: 19, fontWeight: 600, color: T[tone].fg }}>
      <Icon name="cart" size={18} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
      {ex}
    </div>
  </div>
);

const M3_Signals: Page = () => (
  <Frame mod={3} beats={1}>
    <Title>Six signaux d’une bonne opportunité IA</Title>
    <Lede>Plus une idée coche de signaux, plus elle mérite d’être étudiée. Aucun n’est suffisant seul.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 258, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <M3Signal icon="loop" tone="blue" title="Tâche répétitive, gros volume" ex="B1 : 180 000 tickets × 4 min" d={100}>
        Le même geste, des milliers de fois : chaque seconde gagnée se multiplie.
      </M3Signal>
      <M3Signal icon="doc" tone="violet" title="Des documents, du texte, des images" ex="B1 tickets · B4 politiques voyage" d={180}>
        Là où les règles classiques échouent : le non structuré.
      </M3Signal>
      <M3Signal icon="database" tone="teal" title="Des données déjà là" ex="B2 : 50 000 dépenses classées" d={260}>
        Mieux : l’usage produit naturellement les « bonnes réponses ».
      </M3Signal>
      <M3Signal icon="humanCheck" tone="green" title="Une erreur rattrapable" ex="B1 : le salarié corrige le champ" d={340}>
        Un humain relit, corrige ou valide avant que l’erreur coûte.
      </M3Signal>
      <M3Signal icon="layers" tone="yellow" title="Des règles qui explosent" ex="B2 : 412 règles ingérables" d={420}>
        La maintenance des règles coûte plus cher que le problème.
      </M3Signal>
      <M3Signal icon="gauge" tone="coral" title="Un irritant mesurable" ex="Support : 1 050 tickets par mois" d={500}>
        Temps perdu, abandons, tickets : on saura prouver le gain.
      </M3Signal>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 770, width: 1680, boxSizing: 'border-box', background: T.coral.bg, borderRadius: 18, padding: '20px 28px', borderLeft: `8px solid ${C.coral}` }}>
      <Eyebrow c={T.coral.fg} size={20}>
        Anti-signaux : on s’arrête et on reformule
      </Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Tag tone="coral" size={20}>Une règle simple suffit (B9)</Tag>
        <Tag tone="coral" size={20}>Zéro erreur tolérée, aucun humain possible</Tag>
        <Tag tone="coral" size={20}>Aucune donnée, aucun moyen d’en produire</Tag>
        <Tag tone="coral" size={20}>Explication exigée pour chaque décision</Tag>
        <Tag tone="coral" size={20}>Volume trop faible</Tag>
        <Tag tone="coral" size={20}>« Parce que le concurrent l’a fait »</Tag>
      </div>
    </div>
  </Frame>
);

// ─── Partir du problème ─────────────────────────────────────────────────────
const M3Q = ({ n, q, a }: { n: number; q: string; a: ReactNode }) => (
  <div className={b.left(1)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', ...dl(n * 120) }}>
    <Num n={n} tone="blue" size={38} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{q}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.35, color: C.soft }}>{a}</div>
    </div>
  </div>
);

const M3_Problem: Page = () => (
  <Frame mod={3} kind="cas" beats={2}>
    <Title>« Il nous faut un chatbot » : partir du problème</Title>
    <Lede>La demande arrive souvent sous forme de solution. Votre premier travail : retrouver le problème.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 500 }}>
      <Bubble who="system" name="La direction, en comité" w={420}>
        « Les concurrents ont tous un chatbot. Il nous en faut un dans Spendo avant la fin de l’année. »
      </Bubble>
      <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted }}>
        <Icon name="search" size={30} color={C.blue} />
        Cinq questions pour creuser
      </div>
    </div>
    <div style={{ position: 'absolute', left: 680, top: 262, width: 1120, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Q n={1} q="Quel problème, pour qui ?" a="Les salariés ne savent pas ce qui est remboursable : 1 050 tickets support par mois." />
      <M3Q n={2} q="Comment est-il résolu aujourd’hui ?" a="Le support répond à la main, en 26 heures en moyenne." />
      <M3Q n={3} q="Combien coûte-t-il ?" a="Environ 350 heures de support par mois, et des notes refusées qui irritent." />
      <M3Q n={4} q="Quelle est la cause ?" a="Le plafond applicable n’est visible nulle part au moment de la saisie." />
      <M3Q n={5} q="Comment saura-t-on que c’est résolu ?" a="Tickets « remboursable ? » divisés par deux en trois mois." />
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 790, width: 1680, display: 'flex', gap: 22 }}>
      <div style={{ flex: 1 }}>
        <Callout title="Solution 1 · sans IA, 2 sprints" tone="green" icon="check" size={23}>
          Afficher le plafond de la politique du client directement dans le formulaire de saisie.
        </Callout>
      </div>
      <div style={{ flex: 1 }}>
        <Callout title="Solution 2 · IA, ensuite" tone="violet" icon="chat" size={23}>
          L’assistant B4, pour les questions complexes qui resteront. Mesuré sur l’indicateur n° 5.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Calculateur de valeur ──────────────────────────────────────────────────
const M3Slider = ({ label, value, unit, children }: { label: string; value: string; unit: string; children: ReactNode }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 23, fontWeight: 600, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: 25, fontWeight: 700, color: C.blue }}>
        {value} <span style={{ fontSize: 19, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <div style={{ marginTop: 8 }}>{children}</div>
  </div>
);

const M3Out = ({ value, label, tone }: { value: string; label: string; tone: Tone }) => (
  <div style={{ flex: 1, background: T[tone].bg, borderRadius: 14, padding: '14px 18px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, lineHeight: 1.05, color: STRONG[tone] === C.yellow ? C.amber : STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.3, color: C.ink }}>{label}</div>
  </div>
);

const M3_Value: Page = () => {
  const [vol, setVol] = useState(180);
  const [min, setMin] = useState(3);
  const [auto, setAuto] = useState(85);
  const [rate, setRate] = useState(35);
  const [cpc, setCpc] = useState(5);
  const calls = vol * 1000 * 12;
  const hours = (calls * min * (auto / 100)) / 60;
  const value = hours * rate;
  const run = (calls * cpc) / 1000;
  return (
    <Frame mod={3} kind="exercice">
      <Title>Chiffrer la valeur : le calculateur de B1</Title>
      <Lede>Un ordre de grandeur, pas une promesse. Bougez les curseurs avec le groupe.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 44, rowGap: 22 }}>
          <M3Slider label="Justificatifs par mois" value={fr(vol * 1000)} unit="">
            <Range value={vol} onChange={setVol} min={20} max={400} step={10} w={480} tone="blue" />
          </M3Slider>
          <M3Slider label="Minutes gagnées par justificatif" value={fr(min, 1)} unit="min">
            <Range value={min} onChange={setMin} min={0.5} max={5} step={0.5} w={480} tone="blue" />
          </M3Slider>
          <M3Slider label="Part lue sans correction" value={`${auto}`} unit="%">
            <Range value={auto} onChange={setAuto} min={30} max={99} step={1} w={480} tone="violet" />
          </M3Slider>
          <M3Slider label="Coût horaire chargé d’un salarié" value={`${rate}`} unit="€/h">
            <Range value={rate} onChange={setRate} min={20} max={80} step={1} w={480} tone="blue" />
          </M3Slider>
          <M3Slider label="Coût d’une lecture par le modèle" value={fr(cpc / 10, 1)} unit="centime">
            <Range value={cpc} onChange={setCpc} min={1} max={50} step={1} w={480} tone="coral" />
          </M3Slider>
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 14 }}>
          <M3Out value={`${fr(hours)} h`} label="rendues aux salariés clients, par an" tone="green" />
          <M3Out value={`${fr(value / 1e6, 1)} M€`} label="de temps valorisé chez les clients, par an" tone="blue" />
          <M3Out value={`${fr(run)} €`} label="de coût de fonctionnement du modèle, par an" tone="coral" />
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1250, top: 262, width: 550, display: 'flex', flexDirection: 'column', gap: 14, ...dl(200) }}>
        <Eyebrow c={C.navy} size={20}>
          Valeur pour qui ?
        </Eyebrow>
        <Card tone="green" icon="clock" title="Pour les clients" size={21} pad={22}>
          Du temps rendu aux salariés, des contrôles allégés pour les comptables.
        </Card>
        <Card tone="blue" icon="euro" title="Pour Spendo" size={21} pad={22}>
          Moins de résiliations, un argument commercial, peut-être une offre premium.
        </Card>
        <Card tone="coral" icon="money" title="Ce qu’il faut ajouter" size={21} pad={22}>
          Le coût de construction : environ 3 mois d’équipe. Et la maintenance du modèle.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Faisabilité ────────────────────────────────────────────────────────────
const M3Dim = ({ icon, tone, title, qs, d }: { icon: IconName; tone: Tone; title: string; qs: string[]; d: number }) => (
  <Card tone={tone} icon={icon} title={title} size={21} pad={24} cls={A.in} style={dl(d)}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {qs.map((q) => (
        <Bullet key={q} tone={tone} size={21}>
          {q}
        </Bullet>
      ))}
    </div>
  </Card>
);

const M3Mat = ({ label, lvl, tone, txt, n }: { label: string; lvl: number; tone: Tone; txt: string; n: number }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, color: C.ink }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ color: T[tone].fg, fontWeight: 700 }}>{txt}</span>
    </div>
    <div style={{ marginTop: 6, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${lvl * 20}%`, height: '100%', background: STRONG[tone], ...dl(500 + n * 120) }} />
    </div>
  </div>
);

const M3_Feas: Page = () => (
  <Frame mod={3}>
    <Title>Évaluer la faisabilité : quatre dimensions</Title>
    <Lede>Une idée à forte valeur peut être infaisable aujourd’hui. Ce n’est pas un non : c’est un « pas encore ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1100, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <M3Dim icon="database" tone="blue" title="Données" qs={['Les cinq questions du module 2', 'Qui annotera, combien de temps ?']} d={100} />
      <M3Dim icon="cpu" tone="violet" title="Technologie" qs={['Le problème est-il déjà bien résolu ailleurs ?', 'Quelle performance minimale ?']} d={200} />
      <M3Dim icon="plug" tone="teal" title="Intégration" qs={['Où dans le parcours ? Quelle latence ?', 'Quels systèmes toucher ?']} d={300} />
      <M3Dim icon="users" tone="yellow" title="Organisation & risques" qs={['Compétences disponibles, gouvernance', 'Acceptabilité pour les utilisateurs']} d={400} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1270, top: 262, width: 530, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(300) }}>
      <Eyebrow c={C.navy} size={20}>
        Maturité des technologies en 2026
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M3Mat label="Lire des documents" lvl={5} tone="green" txt="Mature" n={0} />
        <M3Mat label="Classer, catégoriser" lvl={5} tone="green" txt="Mature" n={1} />
        <M3Mat label="Prévoir des volumes" lvl={4} tone="teal" txt="Solide" n={2} />
        <M3Mat label="Assistant sur documents" lvl={3.5} tone="blue" txt="Solide, à encadrer" n={3} />
        <M3Mat label="Détecter la fraude" lvl={3} tone="yellow" txt="Dépend des données" n={4} />
        <M3Mat label="Agents autonomes" lvl={2} tone="coral" txt="Émergent" n={5} />
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1100, ...dl(700) }}>
      <Callout title="Le piège de la démo" tone="coral" icon="alert" size={23}>
        Une démo qui marche sur dix exemples choisis ne prouve rien. La faisabilité se juge sur des centaines de cas réels, y compris les pires.
      </Callout>
    </div>
  </Frame>
);

// ─── Acheter, appeler ou construire ─────────────────────────────────────────
const M3Dots = ({ n, tone }: { n: number; tone: Tone }) => (
  <span style={{ display: 'inline-flex', gap: 5 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ width: 16, height: 16, borderRadius: 99, background: i <= n ? STRONG[tone] : C.panel }} />
    ))}
  </span>
);

const M3Opt = ({ icon, tone, title, ex, rows, d }: { icon: IconName; tone: Tone; title: string; ex: string; rows: [string, number][]; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, lineHeight: 1.15, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 12, fontSize: 21, lineHeight: 1.38, color: C.soft, minHeight: 58 }}>{ex}</div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 21, color: C.ink }}>
          <span>{k}</span>
          <M3Dots n={v} tone={tone} />
        </div>
      ))}
    </div>
  </div>
);

const M3_Build: Page = () => (
  <Frame mod={3} beats={1}>
    <Title>Acheter, appeler ou construire ?</Title>
    <Lede>La question de faisabilité la plus structurante, et elle est autant produit que technique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <M3Opt
        icon="cart"
        tone="teal"
        title="Acheter un service spécialisé"
        ex="Une API de lecture de tickets et factures, prête à l’emploi."
        rows={[
          ['Rapidité de mise en œuvre', 5],
          ['Différenciation', 1],
          ['Maîtrise des données', 2],
          ['Effort de maintenance', 1],
        ]}
        d={100}
      />
      <M3Opt
        icon="cloud"
        tone="violet"
        title="Appeler un modèle généraliste"
        ex="Un LLM par API, piloté par des prompts et vos documents."
        rows={[
          ['Rapidité de mise en œuvre', 4],
          ['Différenciation', 3],
          ['Maîtrise des données', 2],
          ['Effort de maintenance', 3],
        ]}
        d={220}
      />
      <M3Opt
        icon="gear"
        tone="navy"
        title="Construire sur mesure"
        ex="Un modèle entraîné sur vos données par votre équipe data."
        rows={[
          ['Rapidité de mise en œuvre', 1],
          ['Différenciation', 5],
          ['Maîtrise des données', 5],
          ['Effort de maintenance', 5],
        ]}
        d={340}
      />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Règle de pouce" tone="blue" icon="bulb" size={25}>
        Acheter la commodité, construire la différenciation. Pour Spendo : B1 s’achète ou s’appelle ; la détection de fraude B3,
        nourrie par les données propres à Spendo, peut devenir un vrai avantage.
      </Callout>
    </div>
  </Frame>
);

// ─── Matrice valeur × faisabilité ───────────────────────────────────────────
const M3Quad = ({ x, y, tone, title, sub }: { x: number; y: number; tone: Tone; title: string; sub: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 616, height: 330, boxSizing: 'border-box', background: `${T[tone].bg}AA`, borderRadius: 16, padding: '14px 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 19, color: C.muted }}>{sub}</div>
  </div>
);

const M3Ghost = ({ id, x, y }: { id: string; x: number; y: number }) => (
  <div
    className={b.pop(1)}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      zIndex: 2,
      minWidth: 64,
      height: 40,
      padding: '0 10px',
      boxSizing: 'border-box',
      borderRadius: 999,
      border: `3px dashed ${C.navy}`,
      background: 'rgba(255,255,255,.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontWeight: 700,
      fontSize: 19,
      color: C.navy,
    }}
  >
    {id}
  </div>
);

const M3_MATRIX: [string, Tone][] = [
  ['B1 · Lire le ticket', 'blue'],
  ['B2 · Catégoriser', 'teal'],
  ['B3 · Notes suspectes', 'coral'],
  ['B4 · Assistant voyage', 'violet'],
  ['B7 · Budget trimestre', 'green'],
  ['B8 · Résumé DAF', 'pink'],
  ['B10 · Traduire', 'navy'],
];

const M3_Matrix: Page = () => (
  <Frame mod={3} kind="exercice" beats={1}>
    <Title>La matrice valeur × faisabilité</Title>
    <Lede>Placez les sept idées IA du backlog. Le débat compte plus que la position exacte.</Lede>
    <M3Quad x={560} y={262} tone="violet" title="Paris stratégiques" sub="forte valeur · faisabilité faible" />
    <M3Quad x={1184} y={262} tone="green" title="Quick wins" sub="forte valeur · faisabilité forte" />
    <M3Quad x={560} y={600} tone="grey" title="Plus tard" sub="valeur faible · faisabilité faible" />
    <M3Quad x={1184} y={600} tone="blue" title="Petits plus" sub="valeur faible · faisabilité forte" />
    <div style={{ position: 'absolute', left: 520, top: 262, width: 4, height: 668, background: C.navy, borderRadius: 2 }} />
    <div style={{ position: 'absolute', left: 520, top: 934, width: 1280, height: 4, background: C.navy, borderRadius: 2 }} />
    <div style={{ position: 'absolute', left: 486, top: 600, transform: 'rotate(-90deg)', transformOrigin: 'left top', fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', color: C.navy }}>
      VALEUR →
    </div>
    <div style={{ position: 'absolute', left: 1640, top: 944, fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', color: C.navy }}>FAISABILITÉ →</div>
    <M3Ghost id="B1" x={1600} y={340} />
    <M3Ghost id="B2" x={1420} y={470} />
    <M3Ghost id="B4" x={1230} y={540} />
    <M3Ghost id="B3" x={820} y={380} />
    <M3Ghost id="B7" x={900} y={720} />
    <M3Ghost id="B8" x={1400} y={760} />
    <M3Ghost id="B10" x={1620} y={840} />
    {M3_MATRIX.map(([label, tone], i) => (
      <Drag key={label} x={120} y={262 + i * 78} w={360} tone={tone} size={21}>
        {label}
      </Drag>
    ))}
  </Frame>
);

// ─── Scoring interactif ─────────────────────────────────────────────────────
const SCORE_COLS: { k: string; tone: Tone; inv?: boolean }[] = [
  { k: 'Impact', tone: 'blue' },
  { k: 'Portée', tone: 'teal' },
  { k: 'Données', tone: 'violet' },
  { k: 'Techno', tone: 'green' },
  { k: 'Risque', tone: 'coral', inv: true },
];
const SCORE_ROWS: { id: string; t: string; v: number[] }[] = [
  { id: 'B1', t: 'Lire le ticket photo', v: [5, 5, 3, 5, 2] },
  { id: 'B2', t: 'Proposer la catégorie', v: [2, 5, 4, 4, 1] },
  { id: 'B3', t: 'Signaler les notes suspectes', v: [4, 3, 2, 3, 4] },
  { id: 'B4', t: 'Assistant politique voyage', v: [3, 4, 4, 4, 3] },
  { id: 'B7', t: 'Prévoir le budget du trimestre', v: [2, 2, 3, 3, 2] },
  { id: 'B8', t: 'Résumé mensuel du DAF', v: [2, 2, 4, 4, 2] },
];
const scoreOf = (v: number[]) => (v[0] * v[1] * ((v[2] + v[3]) / 2)) / v[4];

const M3_Score: Page = () => {
  const [vals, setVals] = useState(() => SCORE_ROWS.map((r) => [...r.v]));
  const bump = (ri: number, ci: number) => setVals((vs) => vs.map((row, i) => (i === ri ? row.map((x, j) => (j === ci ? (x % 5) + 1 : x)) : row)));
  const scores = vals.map(scoreOf);
  const order = scores.map((s, i) => [s, i] as const).sort((a, z) => z[0] - a[0]);
  const rank = (i: number) => order.findIndex(([, j]) => j === i) + 1;
  const max = Math.max(...scores);
  return (
    <Frame mod={3} kind="atelier">
      <Title>Le scoring : rendre la priorisation explicite</Title>
      <Lede>Cliquez une note pour la changer (1 → 5). Le classement se recalcule. Chaque note doit se justifier en une phrase.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 258, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '16px 24px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '480px repeat(5, 1fr) 260px 90px', alignItems: 'center', gap: 10, padding: '6px 0 12px', borderBottom: `2px solid ${C.rule}` }}>
          <Eyebrow c={C.muted} size={17}>
            Idée
          </Eyebrow>
          {SCORE_COLS.map((c) => (
            <div key={c.k} style={{ textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 19, color: T[c.tone].fg }}>
              {c.k}
              {c.inv ? <span style={{ fontWeight: 500, color: C.muted }}> ÷</span> : null}
            </div>
          ))}
          <Eyebrow c={C.muted} size={17}>
            Score
          </Eyebrow>
          <Eyebrow c={C.muted} size={17}>
            Rang
          </Eyebrow>
        </div>
        {SCORE_ROWS.map((r, ri) => {
          const top = rank(ri) <= 3;
          return (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '480px repeat(5, 1fr) 260px 90px', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.rule}`, background: top ? `${T.green.bg}88` : 'transparent', transition: `background 300ms ${EASE}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 8 }}>
                <span style={{ width: 46, fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.navy }}>{r.id}</span>
                <span style={{ fontSize: 22, color: C.ink }}>{r.t}</span>
              </div>
              {SCORE_COLS.map((c, ci) => (
                <button
                  key={c.k}
                  type="button"
                  data-osd-interactive
                  onClick={(e) => {
                    e.currentTarget.blur();
                    bump(ri, ci);
                  }}
                  style={{
                    justifySelf: 'center',
                    width: 62,
                    height: 50,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: 24,
                    background: vals[ri][ci] >= 4 ? STRONG[c.tone] : T[c.tone].bg,
                    color: vals[ri][ci] >= 4 ? '#fff' : T[c.tone].fg,
                    boxShadow: `inset 0 0 0 1.5px ${T[c.tone].bd}`,
                  }}
                >
                  {vals[ri][ci]}
                </button>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
                  <div style={{ width: `${(scores[ri] / max) * 100}%`, height: '100%', background: top ? C.green : C.faint, transition: `width 400ms ${EASE}` }} />
                </div>
                <span style={{ width: 54, textAlign: 'right', fontFamily: mono, fontSize: 21, fontWeight: 700, color: C.ink }}>{fr(scores[ri])}</span>
              </div>
              <div style={{ justifySelf: 'center' }}>
                <Num n={rank(ri)} tone={top ? 'green' : 'grey'} size={40} />
              </div>
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 800, right: 120, display: 'flex', alignItems: 'center', gap: 18, ...dl(500) }}>
        <Code size={21} style={{ padding: '10px 18px' }}>
          Score = <Jk>Impact</Jk> × <Jk>Portée</Jk> × moyenne(<Jk>Données</Jk>, <Jk>Techno</Jk>) ÷ <Jn>Risque</Jn>
        </Code>
        <Btn icon="reset" ghost tone="grey" size={19} onClick={() => setVals(SCORE_ROWS.map((r) => [...r.v]))}>
          Notes du formateur
        </Btn>
      </div>
    </Frame>
  );
};

// ─── Atelier 1 : prioriser le backlog ───────────────────────────────────────
const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="1"
    tag="Atelier"
    kind="atelier"
    title="Le top 3 IA du backlog Spendo"
    defi="prioriser"
    who="Groupes de 3"
    minutes={12}
    objective={
      <>
        Prioriser les idées IA du backlog avec des critères explicites, et <strong>défendre votre top 3</strong> en une minute devant le groupe.
      </>
    }
    where={
      <>
        Un top 3 argumenté, une phrase par idée
        <br />
        Un quick win et un pari nommés
        <br />
        Les idées sans IA renvoyées au backlog classique
      </>
    }
    crit={
      <>
        <CheckItem id="at1-1" size={21}>Chaque note se justifie en une phrase</CheckItem>
        <CheckItem id="at1-2" size={21}>Les risques du module 2 sont pris en compte</CheckItem>
        <CheckItem id="at1-3" size={21}>Les idées sans IA sont identifiées</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet tone="blue" size={23}>
        <strong>3 min ·</strong> placez les sept idées sur la matrice valeur × faisabilité
      </Bullet>
      <Bullet tone="teal" size={23}>
        <strong>5 min ·</strong> ajustez les notes du tableau de scoring, en désaccord assumé
      </Bullet>
      <Bullet tone="green" size={23}>
        <strong>4 min ·</strong> rédigez la phrase de défense de chacune de vos trois idées
      </Bullet>
    </div>
    <TpBonus>ajoutez une idée IA de votre propre produit au tableau, et notez-la avec les mêmes critères.</TpBonus>
  </LabPage>
);

// ─── Restitution ────────────────────────────────────────────────────────────
const M3Lane = ({ tone, icon, title, items, cls }: { tone: Tone; icon: IconName; title: string; items: [string, string][]; cls: string }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, lineHeight: 1.15, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(([id, why]) => (
        <div key={id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ flex: 'none', minWidth: 46, fontFamily: mono, fontWeight: 700, fontSize: 19, color: T[tone].fg, paddingTop: 2 }}>{id}</span>
          <span style={{ fontSize: 20, lineHeight: 1.38, color: C.soft }}>{why}</span>
        </div>
      ))}
    </div>
  </div>
);

const M3_Restit: Page = () => (
  <Frame mod={3} kind="synthese" beats={3}>
    <Title>Restitution : une proposition de priorisation</Title>
    <Lede>Comparez avec vos tops 3. Il n’y a pas de réponse unique, mais il y a des arguments plus solides que d’autres.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 20, alignItems: 'stretch' }}>
      <M3Lane
        tone="green"
        icon="star"
        title="Top 3 IA"
        cls={A.in}
        items={[
          ['B1', 'Valeur massive, technologie mature. Réserve : droits d’usage des données.'],
          ['B2', 'Rapide, risque faible, se nourrit des corrections de B1.'],
          ['B4', 'Soulage le support. Sources citées et passage de main obligatoires.'],
        ]}
      />
      <M3Lane
        tone="violet"
        icon="flag"
        title="Le pari"
        cls={b.on(1)}
        items={[['B3', 'Forte valeur mais biais et RGPD. Commencer par une aide au contrôle des comptables, jamais une sanction automatique.']]}
      />
      <M3Lane
        tone="blue"
        icon="check"
        title="Sans IA, tout de suite"
        cls={b.on(2)}
        items={[
          ['B9', 'Une règle paramétrable par client.'],
          ['B5', 'Intégration classique, attendue par les comptables.'],
          ['B6', 'Prérequis des grands comptes.'],
        ]}
      />
      <M3Lane
        tone="grey"
        icon="clock"
        title="Plus tard"
        cls={b.on(3)}
        items={[
          ['B7', 'Peu d’utilisateurs concernés.'],
          ['B8', 'Un rapport standard suffit peut-être.'],
          ['B10', 'Service de traduction existant, si la demande grandit.'],
        ]}
      />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout title="Une priorisation vivante" tone="navy" icon="loop" size={24}>
        Ce classement se revoit à chaque revue de sprint : une mesure en production, un avis du DPO ou un nouveau client peuvent le faire bouger.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM 5 & 6 ──────────────────────────────────────────────────────────────
const M3_Qcm5: Page = () => (
  <QcmPage
    mod={3}
    n={5}
    title="Une règle suffit-elle ?"
    q="B9 : « Valider automatiquement les notes de moins de 50 € ». Quelle est la meilleure approche ?"
    explain="Quand la règle est connue, stable et explicable, on l’écrit. L’IA sert là où les règles échouent, pas là où elles suffisent."
  >
    <Opt why="On paierait un modèle pour réapprendre une règle qu’on connaît déjà, avec des erreurs en prime.">
      Entraîner un modèle sur les validations passées des managers
    </Opt>
    <Opt why="Plus cher, plus lent et moins prévisible qu’une simple comparaison de montant.">Demander à un LLM de décider pour chaque note</Opt>
    <Opt ok why="Simple, explicable, paramétrable par client : chaque entreprise fixe son seuil.">
      Une règle métier paramétrable par client
    </Opt>
    <Opt why="Il n’y a rien à attendre : le besoin est clair et la solution connue.">Attendre d’avoir plus de données</Opt>
  </QcmPage>
);

const M3_Qcm6: Page = () => (
  <QcmPage
    mod={3}
    n={6}
    title="La pression du client"
    q="Un grand client exige B8, le résumé mensuel par IA, pour renouveler son contrat. B8 est mal classé. Que faites-vous ?"
    explain="La pression commerciale est une information de valeur, pas un passe-droit : on revient au problème, puis on re-score avec cette valeur."
  >
    <Opt why="Le classement ne sert plus à rien s’il cède au premier client qui insiste.">Vous le passez en tête de backlog, sans discuter</Opt>
    <Opt why="Le renouvellement est une vraie valeur : l’ignorer serait aussi une erreur de PO.">Vous refusez : le scoring a tranché</Opt>
    <Opt ok why="Le vrai besoin est peut-être un rapport standard bien fait. Si l’IA apporte un plus, la valeur du contrat entre dans le score.">
      Vous creusez le besoin réel, puis re-scorez avec la valeur du contrat
    </Opt>
    <Opt why="Un POC ne dit pas si le besoin est le bon : il ne fait que repousser la décision.">Vous lancez un POC pour voir</Opt>
  </QcmPage>
);

const M3_Recap: Page = () => (
  <RecapPage
    mod={3}
    title="À retenir du module 3"
    items={[
      { icon: 'search', tone: 'blue', title: 'Partir du problème', text: 'Une demande de solution cache un problème : retrouvez-le avec cinq questions.' },
      { icon: 'loop', tone: 'teal', title: 'Six signaux', text: 'Volume, non structuré, données, erreur rattrapable, règles qui explosent, irritant mesurable.' },
      { icon: 'euro', tone: 'green', title: 'Chiffrer la valeur', text: 'Pour les clients et pour le produit, coût de fonctionnement compris.' },
      { icon: 'cpu', tone: 'violet', title: 'Faisabilité en quatre axes', text: 'Données, technologie, intégration, organisation. « Pas encore » n’est pas « non ».' },
      { icon: 'cart', tone: 'yellow', title: 'Acheter la commodité', text: 'Construire seulement ce qui vous différencie.' },
      { icon: 'filter', tone: 'navy', title: 'Un score qui se justifie', text: 'Matrice, scoring, top 3 : chaque note se défend en une phrase.' },
    ]}
    quote="Prioriser, ce n’est pas choisir l’IA la plus impressionnante : c’est choisir le problème qui en vaut la peine."
  />
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Signals, M3_Problem, M3_Value, M3_Feas, M3_Build, M3_Matrix, M3_Score, M3_Atelier, M3_Restit, M3_Qcm5, M3_Qcm6, M3_Recap];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · MODULE 3 · 11:35

OBJECTIF — Annoncer le module central de la matinée : passer d’une liste d’idées à un top 3 défendable.

DIRE — « On sait ce qu’est l’IA, on sait ce qui peut mal tourner. Maintenant, la question qui fait votre métier : où l’utiliser, et dans quel ordre ? On va voir les signaux d’une bonne opportunité, chiffrer la valeur, évaluer la faisabilité, puis prioriser le backlog de Spendo en atelier. À 12:30, chaque groupe aura son top 3. »

TRANSITION — « D’abord : à quoi reconnaît-on une bonne idée IA ? »`,
  `⏱ 5 min · SIGNAUX ET ANTI-SIGNAUX

OBJECTIF — Donner une grille de repérage rapide des opportunités.

DIRE — « Six signaux. Une tâche répétitive à gros volume : B1, 180 000 tickets à 4 minutes. Du non structuré : texte, images, documents. Des données déjà là, idéalement produites naturellement par l’usage : chaque fois qu’un salarié corrige un champ, il crée un exemple. Une erreur rattrapable : quelqu’un relit avant que ça coûte. Des règles qui explosent : nos 412 règles. Et un irritant mesurable, pour prouver le gain. »

→ beat 1 : les anti-signaux. « Et six raisons de s’arrêter. Une règle simple suffit : B9. Zéro erreur tolérée sans humain possible. Aucune donnée et aucun moyen d’en produire. Une explication exigée pour chaque décision. Un volume trop faible pour rentabiliser. Et le pire : “parce que le concurrent l’a fait”. »

QUESTION — « Dans votre backlog, une idée coche-t-elle quatre signaux ou plus ? » Recueillir un ou deux exemples.

TRANSITION — « Le dernier anti-signal arrive souvent en comité de direction. Voyons comment le traiter. »`,
  `⏱ 4 min · PARTIR DU PROBLÈME (cas)

OBJECTIF — Montrer comment reformuler une demande de solution en problème mesurable.

DIRE — « La direction dit : il nous faut un chatbot. C’est une solution. Votre travail : retrouver le problème. »

→ beat 1 : les cinq questions. « Quel problème, pour qui ? Les salariés ne savent pas ce qui est remboursable : 1 050 tickets par mois. Comment est-il résolu ? À la main, en 26 heures. Combien coûte-t-il ? 350 heures de support par mois. Quelle est la cause ? Le plafond n’est visible nulle part au moment de la saisie. Comment saura-t-on que c’est résolu ? Tickets divisés par deux en trois mois. »

→ beat 2 : deux solutions. « Et là, surprise : la première solution n’a pas besoin d’IA. Afficher le plafond dans le formulaire, deux sprints. L’assistant viendra ensuite, pour les questions complexes qui resteront, et on le mesurera sur le même indicateur. Vous avez répondu à la direction, et mieux qu’elle ne l’espérait. »

INSIST — « La cinquième question est la plus importante : c’est elle qui deviendra le critère de succès de votre user story. »

TRANSITION — « Quand l’IA est pertinente, combien vaut-elle ? »`,
  `⏱ 6 min · CALCULATEUR DE VALEUR (interactif)

OBJECTIF — Apprendre à chiffrer un ordre de grandeur de valeur et de coût de fonctionnement.

DIRE — « B1 : la lecture automatique des tickets. 180 000 justificatifs par mois, 3 minutes gagnées sur 4, 85 % lus sans correction, un coût horaire chargé de 35 €. Résultat : environ 90 000 heures rendues aux salariés par an, plus de 3 millions d’euros de temps valorisé chez les clients. Et le modèle coûte quelques milliers d’euros par an à faire tourner. »

DEMO — Baisser « Part lue sans correction » à 50 % : la valeur chute. « Voilà pourquoi la performance du modèle doit figurer dans la story. » Monter le coût par lecture à 5 centimes : « Avec un gros modèle généraliste, le coût de fonctionnement devient un sujet. »

DIRE — « À droite, la question qui fâche : valeur pour qui ? Les 3 millions, ce sont des heures chez vos clients. Pour Spendo, la valeur, c’est moins de résiliations, un argument commercial, peut-être une offre premium. Et n’oubliez pas le coût de construction : environ trois mois d’équipe, plus la maintenance. »

TRANSITION — « La valeur ne suffit pas : encore faut-il que ce soit faisable. »`,
  `⏱ 4 min · FAISABILITÉ

OBJECTIF — Structurer l’évaluation de faisabilité en quatre dimensions.

DIRE — « Quatre dimensions. Les données : les cinq questions du module 2, plus “qui annotera, et combien de temps ?”. La technologie : le problème est-il déjà bien résolu ailleurs ? L’intégration : où dans le parcours, avec quelle latence, quels systèmes ? L’organisation et les risques : les compétences, la gouvernance, l’acceptabilité. »

DIRE — « À droite, la maturité des technologies aujourd’hui. Lire des documents et classer : mature. Prévoir : solide. Un assistant sur documents : solide, mais à encadrer. Détecter la fraude : dépend énormément des données. Les agents autonomes : émergent. »

INSIST — « Le piège de la démo : dix exemples choisis ne prouvent rien. Exigez de voir des centaines de cas réels, y compris les pires tickets froissés. »

TRANSITION — « Une question de faisabilité structure tout le reste : acheter, appeler ou construire ? »`,
  `⏱ 4 min · ACHETER, APPELER OU CONSTRUIRE

OBJECTIF — Donner les critères du choix build / buy / API.

DIRE — « Trois options. Acheter un service spécialisé : une API de lecture de tickets, prête à l’emploi. Très rapide, peu de maintenance, mais aucune différenciation et peu de maîtrise des données. Appeler un modèle généraliste : un LLM piloté par des prompts. Rapide, flexible, mais coût à l’usage et dépendance. Construire sur mesure : lent, exigeant, mais différenciant, et vous maîtrisez tout. »

→ beat 1 : la règle de pouce. « Acheter la commodité, construire la différenciation. Lire un ticket, tout le monde sait le faire : on achète ou on appelle. Détecter la fraude avec les données propres à Spendo, 1 200 entreprises, ça peut devenir un avantage concurrentiel. »

TRANSITION — « Vous avez tous les critères. Plaçons les idées sur une matrice. »`,
  `⏱ 5 min · MATRICE VALEUR × FAISABILITÉ (glisser-déposer)

OBJECTIF — Visualiser le portefeuille d’idées et nommer quick wins et paris.

CONSIGNE — « Sept idées IA. Dites-moi où je les place. » Glisser sous la dictée de la salle, laisser débattre.

→ beat 1 : la proposition du formateur s’affiche en pointillés. « B1 en quick win, très haut. B2 quick win aussi, valeur plus modeste. B4 à la frontière. B3, le pari stratégique : forte valeur, faisabilité faible aujourd’hui. B7 plus tard. B8 et B10 : petits plus, faciles mais peu utiles. »

DEBRIEF — « Le débat compte plus que la position exacte. Si deux personnes placent B3 à deux endroits opposés, c’est qu’elles n’ont pas la même information : c’est ça qu’il faut faire émerger. »

TRANSITION — « La matrice donne une image. Le scoring la rend explicite. »`,
  `⏱ 4 min · SCORING (tableau interactif)

OBJECTIF — Présenter une grille de scoring adaptée à l’IA, avec le risque au dénominateur.

DIRE — « Cinq critères notés de 1 à 5. Impact : combien ça change la vie de l’utilisateur. Portée : combien d’utilisateurs. Données et techno : la faisabilité. Et le risque, au dénominateur : plus il est élevé, plus le score baisse. »

DEMO — Cliquer le risque de B3 (4 → 5 → 1) pour montrer qu’avec un risque maîtrisé, B3 remonte fortement. « Si on trouve un moyen de réduire le risque — une aide au contrôle plutôt qu’une sanction —, B3 change de catégorie. C’est exactement ce que fait un bon PO : il ne subit pas le score, il cherche à le faire bouger. » Revenir aux notes du formateur.

INSIST — « Un score n’a de valeur que si chaque note se justifie en une phrase. Sinon, c’est de l’intuition déguisée en calcul. »

TRANSITION — « À vous. »`,
  `⏱ 12 min · ATELIER 1 : PRIORISER LE BACKLOG (minuteur)

OBJECTIF — Faire prioriser le backlog en groupe, avec des critères explicites.

CONSIGNE — « Groupes de trois. Douze minutes. Trois minutes pour placer les idées sur la matrice, cinq pour ajuster les notes, quatre pour écrire une phrase de défense par idée de votre top 3. Livrables : le top 3, un quick win et un pari nommés, et les idées sans IA renvoyées au backlog classique. »

ANIMATION — Lancer le minuteur. Circuler. Relances utiles : « Pourquoi ce risque à 2 ? », « Qui a vérifié les droits sur les données ? », « Cette idée a-t-elle vraiment besoin d’IA ? ». Les groupes rapides : bonus, une idée de leur propre produit.

MISE EN COMMUN — Une minute par groupe : le top 3 et une phrase de défense. Noter au tableau les divergences.

TRANSITION — « Voici une proposition de priorisation, à comparer avec les vôtres. »`,
  `⏱ 4 min · RESTITUTION

OBJECTIF — Donner un corrigé argumenté, sans prétendre à la réponse unique.

DIRE — « Le top 3 : B1, valeur massive et technologie mature, avec une réserve sur les droits d’usage. B2, rapide et peu risqué, et qui se nourrit des corrections de B1. B4, qui soulage le support, à condition de citer ses sources et de passer la main. »

→ beat 1 : le pari. « B3. Forte valeur, mais biais et RGPD. On commence par une aide au contrôle pour les comptables : le modèle trie, l’humain décide. Jamais de sanction automatique. »

→ beat 2 : sans IA. « B9, B5, B6 : à faire tout de suite, sans IA. Ce sont souvent les meilleurs gains rapides du backlog. »

→ beat 3 : plus tard. « B7, B8, B10 : utiles, mais pas maintenant. »

DEBRIEF — Comparer avec les tops 3 des groupes : souligner les arguments les plus solides, notamment ceux qui ont intégré le risque.

TRANSITION — « Deux QCM pour finir la matinée. »`,
  `⏱ 2 min · QCM 5

OBJECTIF — Vérifier le réflexe « une règle suffit ».

INTERACTION — Vote à main levée, puis clic.

→ beat 1 : la bonne réponse s’affiche (C).
→ beat 2 : l’essentiel s’affiche.

DIRE — « Quand la règle est connue, stable et explicable, on l’écrit. »

TRANSITION — « Un cas plus politique, maintenant. »`,
  `⏱ 2 min · QCM 6

OBJECTIF — Vérifier la posture du PO face à la pression commerciale.

INTERACTION — Vote à main levée, puis clic. Ce QCM suscite souvent un débat : le laisser vivre une minute.

→ beat 1 : la bonne réponse s’affiche (C).
→ beat 2 : l’essentiel s’affiche.

DIRE — « La pression d’un client est une information de valeur, pas un passe-droit. On creuse le besoin, et on re-score. »

TRANSITION — « Ce qu’il faut retenir de la matinée. »`,
  `⏱ 1 min · À RETENIR · M3

OBJECTIF — Fixer les idées du module et clore la matinée.

DIRE — « Partir du problème. Six signaux. Chiffrer la valeur, pour qui. Quatre axes de faisabilité. Acheter la commodité. Et un score qui se justifie. »

INSIST — Relire la citation : « Prioriser, ce n’est pas choisir l’IA la plus impressionnante : c’est choisir le problème qui en vaut la peine. »

ANIMATION — Annoncer la pause déjeuner : reprise à 13:30 par un quiz flash.

TRANSITION — « Cet après-midi, on prend B1 et on le fait passer du backlog à la production. Bon appétit ! »`,
];
// @@NOTES-END
