// ─── Module 4 · Optimisation & refactoring ──────────────────────────────────

const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Optimisation
        <br />
        et refactoring avancé
      </>
    }
    sub="Repérer les anti-patterns du code généré, restructurer avec SOLID, optimiser en mesurant, moderniser le legacy."
    dur="13:35 – 14:40 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 4 · refactoring avec votre agent</Tag>}
  >
    <SecItem n={1}>Les anti-patterns du code généré</SecItem>
    <SecItem n={2}>Refactoring avancé : SOLID</SecItem>
    <SecItem n={3}>Optimiser les performances</SecItem>
    <SecItem n={4}>Moderniser le legacy, comparer les implémentations</SecItem>
    <SecItem n={5}>Agents personnalisés : un rôle, des outils, des interdits</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Anti-patterns (exercice) ───────────────────────────────────────────────
const M4_Smells: Page = () => (
  <Frame mod={4} kind="exercice" beats={6}>
    <Title>Repérez les anti-patterns : six défauts, une fonction</Title>
    <Lede>Du code généré « qui marche ». Cherchez les défauts avant que les réponses n’apparaissent.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1040 }}>
      <CodeDark file="booking.service.ts" size={20}>
        <Ck>async</Ck> <Cf>book</Cf>(req: <Ck>any</Ck>) {'{'}
        <M3Mark n={1} />
        {'\n'}
        {'  '}<Ck>if</Ck> (!req.roomId || !req.start) <Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'bad'</Cs>);{'\n'}
        {'  '}<Ck>const</Ck> s = <Ck>new</Ck> <Cf>Date</Cf>(req.start), e = <Ck>new</Ck> <Cf>Date</Cf>(req.end);{'\n'}
        {'  '}<Ck>if</Ck> (s.<Cf>getHours</Cf>() {'<'} <Cn>8</Cn> || e.<Cf>getHours</Cf>() {'>'} <Cn>19</Cn>) <Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'closed'</Cs>);
        <M3Mark n={2} />
        {'\n'}
        {'  '}<Ck>const</Ck> rooms = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>query</Cf>(<Cs>'SELECT * FROM rooms'</Cs>);{'\n'}
        {'  '}<Ck>for</Ck> (<Ck>const</Ck> r <Ck>of</Ck> rooms) {'{'}
        {'\n'}
        {'    '}<Ck>const</Ck> bs = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>query</Cf>(<Cs>'SELECT * FROM bookings'</Cs>);
        <M3Mark n={3} />
        {'\n'}
        {'    '}<Ck>for</Ck> (<Ck>const</Ck> b <Ck>of</Ck> bs){'\n'}
        {'      '}<Ck>if</Ck> (r.id === req.roomId {'&&'} b.roomId === r.id {'&&'} s {'<'} b.end {'&&'} b.start {'<'} e){'\n'}
        {'        '}<Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'conflict'</Cs>);
        <M3Mark n={4} />
        {'\n'}
        {'  }'}
        {'\n'}
        {'  '}<Ck>const</Ck> id = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>insert</Cf>(<Cs>'bookings'</Cs>, req);{'\n'}
        {'  '}<Ck>try</Ck> {'{'} <Ck>await</Ck> <Ck>new</Ck> <Cf>SmtpMailer</Cf>().<Cf>send</Cf>(req.email); {'}'} <Ck>catch</Ck> {'{}'}
        <M3Mark n={5} />
        {'\n'}
        {'  '}<Ck>return</Ck> id;
        <M3Mark n={6} />
        {'\n'}
        {'}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1210, top: 262, width: 590, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="any à l’entrée">Plus aucun contrat : la validation est contournée.</M3Flaw>
      <M3Flaw n={2} title="Valeurs magiques">8 et 19 en dur, fuseau horaire ignoré.</M3Flaw>
      <M3Flaw n={3} title="N+1, tout charger">Une requête par salle, toutes les réservations à chaque fois.</M3Flaw>
      <M3Flaw n={4} title="Erreurs non typées">« conflict » : la route ne peut pas répondre 409 proprement.</M3Flaw>
      <M3Flaw n={5} title="Exception avalée, new caché">Échec d’envoi invisible ; mailer impossible à tester.</M3Flaw>
      <M3Flaw n={6} title="Fonction fourre-tout">Valide, calcule, persiste, notifie : quatre raisons de changer.</M3Flaw>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(600) }}>
      <Icon name="chart" size={24} color={C.violet} />
      GitClear 2025 : en 2024, pour la première fois, plus de lignes copiées-collées que de lignes déplacées par refactoring.
    </div>
  </Frame>
);

// ─── SOLID ──────────────────────────────────────────────────────────────────
const M4Solid = ({ l, tone, name, symptom, prompt, beat }: { l: string; tone: Tone; name: string; symptom: string; prompt: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '70px 300px 400px 1fr', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '12px 22px' }}>
    <span style={{ width: 62, height: 62, borderRadius: 14, background: STRONG[tone], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 36 }}>{l}</span>
    <span style={{ fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{name}</span>
    <span style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>{symptom}</span>
    <span style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.45, color: C.navy }}>{prompt}</span>
  </div>
);

const M4_Solid: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Refactoring avancé : SOLID, un principe par prompt</Title>
    <Lede>« Applique SOLID » donne un diff géant. Nommez le symptôme, le principe et la cible : un refactoring par demande.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '70px 300px 400px 1fr', gap: 22, padding: '0 22px', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span />
        <span>PRINCIPE</span>
        <span>SYMPTÔME DANS LE CODE GÉNÉRÉ</span>
        <span>LE PROMPT</span>
      </div>
      <M4Solid l="S" tone="blue" name="Responsabilité unique" symptom="book() valide, calcule, persiste et notifie" prompt="Extrais validation, règle de chevauchement et notification. book() ne fait plus qu’orchestrer." beat={0} />
      <M4Solid l="O" tone="teal" name="Ouvert / fermé" symptom="switch (room.kind) recopié en trois endroits" prompt="Remplace le switch par une stratégie par type de salle. Ajouter « amphi » ne modifie aucune classe." beat={1} />
      <M4Solid l="L" tone="violet" name="Substitution de Liskov" symptom="InMemoryRepo.delete() lève « non implémenté »" prompt="Écris un test de contrat commun à toutes les implémentations du repository." beat={2} />
      <M4Solid l="I" tone="pink" name="Ségrégation des interfaces" symptom="IBookingRepository à 14 méthodes" prompt="Découpe par usage : lecture de disponibilité, écriture de réservation." beat={3} />
      <M4Solid l="D" tone="green" name="Inversion des dépendances" symptom="new SmtpMailer() dans le service" prompt="Injecte un port Notifier par le constructeur ; l’adaptateur SMTP vit dans l’infrastructure." beat={4} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(600) }}>
      <Icon name="flag" size={24} color={C.violet} />
      Règle : tests au vert avant, tests au vert après, <strong style={{ color: C.navy }}>aucun fichier de test modifié</strong> pendant un refactoring.
    </div>
  </Frame>
);

// ─── Performance ────────────────────────────────────────────────────────────
const M4Bar = ({ label, ms, w, tone, cls }: { label: string; ms: string; w: number; tone: Tone; cls?: string }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.ink, marginBottom: 6 }}>
      <span>{label}</span>
      <strong style={{ fontFamily: mono, color: STRONG[tone] }}>{ms}</strong>
    </div>
    <div style={{ height: 26, borderRadius: 13, background: C.panel, overflow: 'hidden' }}>
      <div className={cls} style={{ width: `${w}%`, height: '100%', borderRadius: 13, background: STRONG[tone] }} />
    </div>
  </div>
);

const M4_Perf: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Optimiser : mesurer d’abord, demander mieux ensuite</Title>
    <Lede>Copilot écrit spontanément l’algorithme le plus évident. Il sait faire mieux… si on lui donne la mesure et la cible.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file="Prompt" size={21} wrap>
        Analyse la complexité de <Cf>findAvailableRooms</Cf> (voir le profil joint : 1,8 s pour 200 salles et 10 000 réservations).{'\n\n'}
        Propose une version en O((R + B) log B) : réservations indexées par salle et triées par début.{'\n\n'}
        <span style={{ color: '#FFD27A' }}>Même signature. Tests existants inchangés et au vert. Ajoute un benchmark reproductible.</span>
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10, ...dl(300) }}>
        <Bullet size={23} tone="blue">Profiler avant : on optimise ce qui coûte, pas ce qu’on suppose</Bullet>
        <Bullet size={23} tone="blue">Côté base : requête bornée + index (room_id, start)</Bullet>
        <Bullet size={23} tone="blue">Lisibilité contre performance : un choix, pas un réflexe</Bullet>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1040, top: 262, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(200) }}>
      <PanelTitle icon="gauge">Benchmark · 200 salles × 10 000 réservations</PanelTitle>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M4Bar label="Généré au TP 2 · boucles imbriquées" ms="1 840 ms" w={100} tone="coral" cls={A.grow} />
        <M4Bar label="Index par salle + tri" ms="14 ms" w={2} tone="green" cls={b.grow(1)} />
        <M4Bar label="Requête SQL bornée + index" ms="3 ms" w={1} tone="teal" cls={b.grow(2)} />
      </div>
      <div style={{ marginTop: 22, fontSize: 19, color: C.muted }}>Ordres de grandeur illustratifs : mesurez sur votre machine au TP 4.</div>
    </div>
  </Frame>
);

// ─── Legacy ─────────────────────────────────────────────────────────────────
const M4Leg = ({ n, tone, icon, title, children, beat }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 316, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={42} />
      <IconTile name={icon} tone={tone} size={42} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M4_Legacy: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Moderniser du legacy : figer avant de toucher</Title>
    <Lede>Copilot excelle à expliquer et à réécrire. Le risque : réécrire en changeant le comportement sans que personne le voie.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M4Leg n={1} tone="blue" icon="search" title="Comprendre" beat={0}>
        /explain, diagramme de séquence, glossaire métier. Rien ne bouge.
      </M4Leg>
      <M4Leg n={2} tone="yellow" icon="lock" title="Figer" beat={1}>
        Tests de caractérisation : on capture le comportement actuel, bugs compris.
      </M4Leg>
      <M4Leg n={3} tone="violet" icon="route" title="Contourner" beat={2}>
        Figuier étrangleur : le nouveau module derrière la même interface.
      </M4Leg>
      <M4Leg n={4} tone="pink" icon="wand" title="Moderniser" beat={3}>
        Un changement par PR : types, async, API dépréciée, version du langage.
      </M4Leg>
      <M4Leg n={5} tone="green" icon="checkCircle" title="Retirer" beat={4}>
        Bascule mesurée, puis suppression de l’ancien code.
      </M4Leg>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(600) }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={24}>
        « Corrige les bugs au passage » : une modernisation ne change pas le comportement. Les bugs trouvés vont dans des tickets séparés.
      </Callout>
    </div>
  </Frame>
);

// ─── Comparer des implémentations (matrice pondérée interactive) ───────────
const M4_SCORES = {
  naif: [5, 1, 4, 4],
  index: [3, 4, 4, 3],
  sql: [4, 5, 2, 4],
};
type M4Key = keyof typeof M4_SCORES;

const M4Weight = ({ label, v, set, tone }: { label: string; v: number; set: (x: number) => void; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 170, fontSize: 22, fontWeight: 600, color: C.ink }}>{label}</span>
    <Range value={v} onChange={set} min={0} max={5} w={230} tone={tone} />
    <span style={{ width: 30, fontFamily: mono, fontSize: 24, fontWeight: 700, color: STRONG[tone] }}>{v}</span>
  </div>
);

const M4Impl = ({ id, name, sub, total, max, best }: { id: M4Key; name: string; sub: string; total: number; max: number; best: boolean }) => (
  <div style={{ background: best ? T.green.bg : C.card, borderRadius: 16, boxShadow: best ? `inset 0 0 0 3px ${C.green}` : SHADOW_SM, padding: '16px 22px', transition: `all 300ms ${EASE}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>
          {name} {best ? <Tag tone="green" size={17}>retenue</Tag> : null}
        </div>
        <div style={{ fontSize: 19, color: C.muted }}>{sub}</div>
      </div>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: best ? C.green : C.soft }}>{total}</span>
    </div>
    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
      <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{M4_SCORES[id].join(' · ')}</span>
    </div>
    <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${max ? (total / max) * 100 : 0}%`, height: '100%', background: best ? C.green : C.faint, transition: `width 400ms ${EASE}` }} />
    </div>
  </div>
);

const M4_Compare: Page = () => {
  const [w, setW] = useState([3, 3, 3, 3]);
  const setAt = (i: number) => (x: number) => setW((o) => o.map((y, j) => (j === i ? x : y)));
  const tot = (id: M4Key) => M4_SCORES[id].reduce((a, s, i) => a + s * w[i], 0);
  const t = { naif: tot('naif'), index: tot('index'), sql: tot('sql') };
  const max = Math.max(t.naif, t.index, t.sql);
  return (
    <Frame mod={4} kind="demo">
      <Title>Comparer les implémentations générées</Title>
      <Lede>Demandez trois versions aux compromis différents, puis choisissez avec vos critères — pas ceux du modèle.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 720 }}>
        <CodeDark file="Prompt" size={20} wrap>
          Propose trois implémentations de findAvailableRooms aux compromis différents. Pour chacune : complexité, avantages, risques. <span style={{ color: '#FFD27A' }}>Ne choisis pas : présente un tableau.</span>
        </CodeDark>
        <div style={{ marginTop: 26, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Eyebrow c={C.navy} size={19}>
            Poids de vos critères (0 à 5)
          </Eyebrow>
          <M4Weight label="Lisibilité" v={w[0]} set={setAt(0)} tone="blue" />
          <M4Weight label="Performance" v={w[1]} set={setAt(1)} tone="coral" />
          <M4Weight label="Testabilité" v={w[2]} set={setAt(2)} tone="pink" />
          <M4Weight label="Cohérence" v={w[3]} set={setAt(3)} tone="teal" />
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 900, top: 262, width: 900, display: 'flex', flexDirection: 'column', gap: 16, ...dl(200) }}>
        <M4Impl id="naif" name="A · Boucles simples" sub="O(R × B) · évident à relire" total={t.naif} max={max} best={t.naif === max} />
        <M4Impl id="index" name="B · Index en mémoire trié" sub="O((R + B) log B) · plus de code" total={t.index} max={max} best={t.index === max} />
        <M4Impl id="sql" name="C · Requête SQL indexée" sub="délègue à la base · tests d’intégration requis" total={t.sql} max={max} best={t.sql === max} />
        <Hint>Notes 1 à 5 par critère (lisibilité · performance · testabilité · cohérence). Bougez les curseurs.</Hint>
      </div>
    </Frame>
  );
};

// ═══ Les agents personnalisés (repris de copilot-debutant-v2, p. 94 et 96, adaptés à SalleLibre) ═══
// Formats vérifiés le 11 novembre 2026 (code.visualstudio.com, docs.github.com) : .github/agents/*.agent.md,
// champs name, description, tools, model, skills, user-invocable, disable-model-invocation.
// Harnais Copilot : délégation par l’outil natif (alias « agent ») ; handoffs ignorés.

// ─── Anatomie d’un agent ────────────────────────────────────────────────────
type AnaField = 'name' | 'desc' | 'tools' | 'skills' | 'model' | 'body';
const ANA_LINES: { f: AnaField; node: ReactNode }[] = [
  { f: 'name', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'name', node: <><Ck>name</Ck>: Refactoreur</> },
  { f: 'desc', node: <><Ck>description</Ck>: Refactore SalleLibre par petits pas</> },
  { f: 'desc', node: <>{'  '}sûrs, sans changer le comportement.</> },
  { f: 'tools', node: <><Ck>tools</Ck>: [<Cs>'read'</Cs>, <Cs>'search'</Cs>, <Cs>'edit'</Cs>, <Cs>'execute'</Cs>]</> },
  { f: 'skills', node: <><Ck>skills</Ck>: [<Cs>'refactoring-sur'</Cs>]</> },
  { f: 'model', node: <span style={{ color: '#7C86A8' }}># model : facultatif</span> },
  { f: 'body', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'body', node: <>Tu es le Refactoreur de SalleLibre.</> },
  { f: 'body', node: <>- Lance les tests avant et après chaque geste.</> },
  { f: 'body', node: <>- Un refactoring à la fois ; test rouge : annule.</> },
  { f: 'body', node: <>- Aucune correction de bug pendant un refactoring.</> },
  { f: 'body', node: <>- Ne modifie jamais tests/.</> },
];
const ANA_INFO: Record<AnaField, { t: string; tone: Tone; icon: IconName; text: ReactNode; tip: string }> = {
  name: { t: 'name · le nom', tone: 'navy', icon: 'user', text: 'Le nom affiché dans la liste des rôles du Chat, et celui qu’un autre agent utilise pour le solliciter. Sans lui, le nom du fichier.', tip: 'Court et unique : « Refactoreur », pas « Agent 2 ».' },
  desc: { t: 'description · quand l’utiliser', tone: 'blue', icon: 'note', text: 'Obligatoire pour le harnais Copilot. Elle dit ce que fait l’agent et quand le choisir : c’est elle qui décide de la délégation.', tip: 'Dites aussi ce qu’il ne fait jamais.' },
  tools: { t: 'tools · ce qu’il a le droit de faire', tone: 'coral', icon: 'tool', text: 'La liste des outils : sans « edit », il ne peut pas modifier de fichier ; sans « execute », pas de terminal. Cliquez les outils pour voir le risque.', tip: 'Le minimum nécessaire, jamais « * » par confort.' },
  skills: { t: 'skills · ses savoir-faire', tone: 'violet', icon: 'book', text: 'Les skills chargées dans son contexte : ici la méthode de refactoring, écrite une fois, réutilisable par d’autres agents.', tip: 'Une skill = un dossier .github/skills/<nom>/, comme au TP 3.' },
  model: { t: 'model · facultatif', tone: 'green', icon: 'cpu', text: 'Un modèle, ou une liste par ordre de préférence. Sans ce champ : le modèle choisi dans le sélecteur.', tip: 'Les champs handoffs et agents des anciens tutoriels sont ignorés par le harnais Copilot.' },
  body: { t: 'Le corps · son rôle et ses règles', tone: 'pink', icon: 'chat', text: 'Les consignes en Markdown, ajoutées à chaque demande faite à cet agent, en plus de copilot-instructions.md : sa mission, sa méthode, ses interdits.', tip: 'Des règles vérifiables, pas des vœux pieux.' },
};
const ANA_ORDER: AnaField[] = ['name', 'desc', 'tools', 'skills', 'model', 'body'];
const TOOLS_AG = [
  { id: 'read', what: 'lire les fichiers', risk: 1 },
  { id: 'search', what: 'chercher dans le code', risk: 1 },
  { id: 'todo', what: 'tenir une liste de tâches', risk: 0 },
  { id: 'edit', what: 'créer et modifier des fichiers', risk: 2 },
  { id: 'agent', what: 'déléguer à d’autres agents', risk: 2 },
  { id: 'execute', what: 'lancer des commandes (terminal)', risk: 3 },
  { id: 'web', what: 'lire des pages Internet', risk: 3 },
];

const M4_Agent: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<AnaField | null>(null);
  const [tools, setTools] = useState<string[]>(['read', 'search', 'edit', 'execute']);
  useEffect(() => setPick(null), [beats]);
  const sel = pick ?? ANA_ORDER[Math.min(beats, 5)];
  const info = ANA_INFO[sel];
  const risk = TOOLS_AG.filter((t) => tools.includes(t.id)).reduce((a, t) => a + t.risk, 0);
  const lvl = risk <= 3 ? { t: 'faible', tone: 'green' as Tone } : risk <= 7 ? { t: 'modéré', tone: 'yellow' as Tone } : { t: 'élevé', tone: 'coral' as Tone };
  const injection = tools.includes('execute') && tools.includes('web');
  return (
    <Frame mod={4} beats={5}>
      <Title>Un agent personnalisé, c’est un fichier .agent.md</Title>
      <Lede>Un rôle, des outils et des savoir-faire, écrits une fois et versionnés. Créez-le dans Customizations › Agents, ou à la main.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '16px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px 10px', fontFamily: mono, fontSize: 18, color: '#9AA6C8' }}>
          <Icon name="doc" size={22} color="#9AA6C8" /> .github/agents/refactoreur.agent.md
        </div>
        {ANA_LINES.map((l, i) => {
          const on = l.f === sel;
          return (
            <div
              key={i}
              role="button"
              data-osd-interactive
              className={k('row')}
              onClick={() => setPick(l.f)}
              style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', fontFamily: mono, fontSize: 21, lineHeight: '33px', color: on ? '#fff' : '#C9D2EA', background: on ? 'rgba(116,66,224,.32)' : 'transparent', boxShadow: on ? `inset 5px 0 0 ${STRONG[ANA_INFO[l.f].tone]}` : 'none', whiteSpace: 'pre' }}
            >
              <span style={{ textAlign: 'right', paddingRight: 14, color: '#56607E' }}>{i + 1}</span>
              <span>{l.node}</span>
            </div>
          );
        })}
      </div>
      <div key={sel} className={k('swap')} style={{ position: 'absolute', left: 1070, top: 270, width: 730, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[info.tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={info.icon} tone={info.tone} size={56} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{info.t}</span>
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{info.text}</div>
        {sel === 'tools' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {TOOLS_AG.map((t) => {
                const on = tools.includes(t.id);
                const tone: Tone = t.risk >= 3 ? 'coral' : t.risk === 2 ? 'yellow' : 'green';
                return (
                  <div
                    key={t.id}
                    role="button"
                    data-osd-interactive
                    className={k('chip')}
                    onClick={() => setTools((o) => (o.includes(t.id) ? o.filter((x) => x !== t.id) : [...o, t.id]))}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, background: on ? T[tone].bg : C.panel, boxShadow: on ? `inset 0 0 0 2px ${STRONG[tone]}` : 'none', opacity: on ? 1 : 0.6 }}
                  >
                    <Icon name={on ? 'checkCircle' : 'x'} size={22} color={on ? STRONG[tone] : C.faint} sw={2.4} />
                    <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{t.id}</span>
                    <span style={{ fontSize: 17, color: C.soft, lineHeight: 1.2 }}>{t.what}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.soft }}>
              Pouvoir donné :
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (risk / 12) * 100)}%`, height: '100%', background: STRONG[lvl.tone], transition: `width 400ms ${EASE}` }} />
              </div>
              <Tag tone={lvl.tone} size={18}>
                {lvl.t}
              </Tag>
            </div>
            {injection ? <div style={{ fontSize: 19, color: T.coral.fg, fontWeight: 600 }}>⚠ Terminal + Internet : une page piégée peut lui dicter une commande (injection de prompt).</div> : null}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T[info.tone].bg, color: T[info.tone].fg, borderRadius: 14, padding: '14px 18px', fontSize: 21, fontWeight: 600 }}>
            <Icon name="bulb" size={26} sw={2.2} /> {info.tip}
          </div>
        )}
      </div>
    </Frame>
  );
};

// ─── Six agents pour SalleLibre (catalogue détaillé) ────────────────────────
type AgDef = {
  tab: string;
  file: string;
  icon: IconName;
  tone: Tone;
  tp: string;
  desc: string;
  tools: string[];
  extra: ReactNode[];
  body: string[];
  mission: string;
  never: string;
  call: string;
};
const AGENTS6: AgDef[] = [
  {
    tab: 'Architecte',
    file: 'architecte.agent.md',
    icon: 'layers',
    tone: 'teal',
    tp: 'TP 6',
    desc: 'Découpe une demande en lots vérifiables. Ne code jamais.',
    tools: ['read', 'search'],
    extra: [],
    body: ['Tu es l’Architecte de SalleLibre.', '- Lis PLAN.md et le code concerné.', '- Propose des lots de 1 à 3 fichiers,', '  chacun avec le test qui le valide.', '- Signale tout écart à PLAN.md.', '- Tu ne modifies aucun fichier.'],
    mission: 'Transformer une demande floue en plan relisible, avant la première ligne de code.',
    never: 'Écrire ou modifier du code.',
    call: 'Choisi dans la liste des rôles, ou sollicité par le chef d’orchestre.',
  },
  {
    tab: 'Testeur',
    file: 'testeur.agent.md',
    icon: 'flask',
    tone: 'pink',
    tp: 'TP 6',
    desc: 'Écrit les tests d’un lot à partir de la matrice validée.',
    tools: ['read', 'search', 'edit', 'execute'],
    extra: [<><Ck>skills</Ck>: [<Cs>'matrice-de-tests'</Cs>]</>],
    body: ['Tu es le Testeur de SalleLibre.', '- Matrice validée d’abord, puis les tests.', '- Un nouveau test doit d’abord être ROUGE.', '- Tu ne modifies que tests/, jamais src/.', '- Tu ne supprimes ni n’affaiblis un test.'],
    mission: 'Prouver le comportement attendu avant qu’il existe : des tests rouges, puis verts.',
    never: 'Toucher au code de production, sauter ou affaiblir un test.',
    call: 'Votre skill du TP 3, devenue un rôle à part entière.',
  },
  {
    tab: 'Refactoreur',
    file: 'refactoreur.agent.md',
    icon: 'wand',
    tone: 'violet',
    tp: 'TP 4',
    desc: 'Refactore par petits pas sûrs, sans changer le comportement.',
    tools: ['read', 'search', 'edit', 'execute'],
    extra: [<><Ck>skills</Ck>: [<Cs>'refactoring-sur'</Cs>]</>],
    body: ['Tu es le Refactoreur de SalleLibre.', '- Tests avant et après chaque geste.', '- Un refactoring à la fois ; rouge : annule.', '- Aucune correction de bug au passage.', '- Ne modifie jamais tests/.'],
    mission: 'Améliorer la structure (SOLID, performance) avec la preuve que rien n’a bougé.',
    never: 'Modifier un test, corriger un bug en douce, livrer un diff géant.',
    call: 'Choisi dans la liste des rôles pendant le TP 4.',
  },
  {
    tab: 'Auditeur',
    file: 'auditeur.agent.md',
    icon: 'shield',
    tone: 'coral',
    tp: 'TP 5',
    desc: 'Audite un diff selon OWASP Top 10 : 2025. Lecture seule.',
    tools: ['read', 'search'],
    extra: [<><Ck>user-invocable</Ck>: <Cn>false</Cn> <Cc>{'# sous-agent seulement'}</Cc></>],
    body: ['Tu es l’Auditeur sécurité de SalleLibre.', '- Grille : OWASP Top 10 : 2025.', '- Par faille : fichier, ligne, criticité,', '  la requête qui l’exploite, le correctif.', '- Tu ne modifies aucun fichier.'],
    mission: 'Un regard extérieur, dans un contexte neuf : il n’a pas écrit le code qu’il relit.',
    never: 'Corriger lui-même : il rapporte, l’agent principal corrige avec un test.',
    call: 'Masqué de la liste : on le sollicite comme sous-agent.',
  },
  {
    tab: 'Documentaliste',
    file: 'documentaliste.agent.md',
    icon: 'doc',
    tone: 'green',
    tp: 'TP 6',
    desc: 'Met à jour OpenAPI et README à partir du code.',
    tools: ['read', 'search', 'edit'],
    extra: [<Cc>{'# model : un modèle rapide suffit'}</Cc>],
    body: ['Tu es le Documentaliste de SalleLibre.', '- Pars du code et des tests, pas du plan.', '- Mets à jour openapi.yaml et README.md.', '- Exemples de requête et codes d’erreur.', '- Tu ne modifies aucun autre fichier.'],
    mission: 'Une documentation qui décrit ce que fait le code, pas ce qu’on voulait qu’il fasse.',
    never: 'Toucher à src/ ou à tests/.',
    call: 'Sollicité en fin de lot par le chef d’orchestre.',
  },
  {
    tab: 'Chef d’orchestre',
    file: 'chef-orchestre.agent.md',
    icon: 'route',
    tone: 'navy',
    tp: 'TP 6',
    desc: 'Mène une feature de bout en bout en déléguant.',
    tools: ['agent', 'read', 'search', 'edit', 'execute', 'todo'],
    extra: [],
    body: ['Délègue, par leur nom exact :', '1. Architecte : le plan. STOP, attends-moi.', '2. Testeur : les tests du lot, rouges.', '3. Toi : le code, jusqu’au vert.', '4. Auditeur, puis Documentaliste.', '5. Résume ; je relis avant la PR.'],
    mission: 'Coordonner : chaque rôle travaille dans son propre contexte, vous validez aux étapes clés.',
    never: 'Passer une étape de validation humaine, modifier un test pour passer au vert.',
    call: 'Choisi dans la liste des rôles. Détaillé au module 6.',
  },
];
const toolTone = (id: string): Tone => (['execute', 'web'].includes(id) ? 'coral' : ['edit', 'agent'].includes(id) ? 'yellow' : 'green');

const M4AgRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr)', gap: 14, alignItems: 'baseline' }}>
    <span style={{ fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, fontWeight: 700 }}>{label}</span>
    <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M4_Equipe: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const i = pick ?? Math.min(beats, AGENTS6.length - 1);
  const a = AGENTS6[i];
  return (
    <Frame mod={4} beats={5}>
      <Title>Six agents pour SalleLibre : un rôle, des droits, des interdits</Title>
      <Lede>Six fichiers dans .github/agents/. Pour chacun : le fichier complet, ce qu’il peut faire, ce qu’il ne fait jamais.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 258 }}>
        <MTabs items={AGENTS6.map((x) => x.tab)} cur={i} set={setPick} size={19} />
      </div>
      <div key={`f-${i}`} className={k('swap')} style={{ position: 'absolute', left: 120, top: 340, width: 860, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '16px 24px 20px', fontFamily: mono, fontSize: 20, lineHeight: '31px', color: '#C9D2EA', whiteSpace: 'pre' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 8, fontSize: 18, color: '#9AA6C8' }}>
          <Icon name="doc" size={22} color="#9AA6C8" /> .github/agents/{a.file}
        </div>
        <div style={{ color: '#7C86A8' }}>---</div>
        <div>
          <Ck>name</Ck>: {a.tab}
        </div>
        <div>
          <Ck>description</Ck>: {a.desc}
        </div>
        <div>
          <Ck>tools</Ck>: [
          {a.tools.map((t, j) => (
            <span key={t}>
              <Cs>'{t}'</Cs>
              {j < a.tools.length - 1 ? ', ' : ''}
            </span>
          ))}
          ]
        </div>
        {a.extra.map((x, j) => (
          <div key={j}>{x}</div>
        ))}
        <div style={{ color: '#7C86A8' }}>---</div>
        {a.body.map((l) => (
          <div key={l} style={{ color: '#E6EAF6' }}>
            {l}
          </div>
        ))}
      </div>
      <div key={`c-${i}`} className={k('swap')} style={{ position: 'absolute', left: 1020, top: 340, width: 780, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[a.tone]}`, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(80) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={a.icon} tone={a.tone} size={56} solid />
          <span style={{ flex: 1, fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>{a.tab}</span>
          <Tag tone={a.tone} size={18}>
            {a.tp}
          </Tag>
        </div>
        <M4AgRow label="Mission">{a.mission}</M4AgRow>
        <M4AgRow label="Outils">
          <span style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
            {a.tools.map((t) => (
              <Tag key={t} tone={toolTone(t)} size={17}>
                {t}
              </Tag>
            ))}
          </span>
        </M4AgRow>
        <M4AgRow label="Appel">{a.call}</M4AgRow>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: T.coral.bg, color: T.coral.fg, borderRadius: 14, padding: '12px 16px', fontSize: 20, lineHeight: 1.4, fontWeight: 600 }}>
          <Icon name="x" size={24} sw={2.6} style={{ marginTop: 2 }} /> Jamais : {a.never}
        </div>
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 915, ...dl(600) }}>
        Moins un agent a d’outils, plus on lui fait confiance : l’Auditeur et l’Architecte ne peuvent rien casser.
      </Hint>
    </Frame>
  );
};

// ─── Instructions, skill, agent ou MCP : quel fichier ? ─────────────────────
const FILES_AG = [
  { name: 'copilot-instructions.md', path: '.github/ ou AGENTS.md', icon: 'note' as IconName, tone: 'navy' as Tone, when: 'Chargé à chaque demande', what: 'Les règles d’équipe : stack, couches, interdits.' },
  { name: 'SKILL.md', path: '.github/skills/<nom>/', icon: 'book' as IconName, tone: 'violet' as Tone, when: 'Chargé si la demande correspond', what: 'Un savoir-faire, avec ses fichiers.' },
  { name: '*.agent.md', path: '.github/agents/', icon: 'bot' as IconName, tone: 'blue' as Tone, when: 'Choisi ou sollicité', what: 'Un rôle : consignes, outils, skills.' },
  { name: 'mcp.json', path: '.vscode/', icon: 'plug' as IconName, tone: 'teal' as Tone, when: 'Outils appelés par l’agent', what: 'Un accès à un système externe : tickets, base.' },
];
const SIT_AG = [
  { q: '« Toute erreur métier est une erreur typée. »', a: 0 },
  { q: '« Notre méthode de matrice de tests, avec son modèle. »', a: 1 },
  { q: '« Un auditeur qui ne modifie jamais de fichier. »', a: 2 },
  { q: '« Lire les tickets ouverts sur SalleLibre. »', a: 3 },
];

const M4_QuelFichier: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const si = pick ?? (beats >= 1 ? Math.min(beats - 1, 3) : null);
  const ans = si === null ? null : SIT_AG[si].a;
  return (
    <Frame mod={4} kind="exercice" beats={4}>
      <Title>Instructions, skill, agent ou MCP : quel fichier ?</Title>
      <Lede>Quatre fichiers, quatre usages. Pour chaque besoin, votez à voix haute, puis je clique la réponse.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {SIT_AG.map((s, i) => (
          <Btn key={s.q} size={20} tone="navy" ghost={si !== i} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
            {i + 1}. {s.q}
          </Btn>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 430, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
        {FILES_AG.map((f, i) => {
          const on = ans === i;
          const off = ans !== null && !on;
          return (
            <div key={f.name} className={cx(A.in, k('agn'))} style={{ ...dl(150 + i * 100), height: 420, boxSizing: 'border-box', background: C.card, borderRadius: 22, padding: '24px 24px', boxShadow: on ? `0 0 0 5px ${STRONG[f.tone]}, 0 24px 50px -24px rgba(11,31,92,.6)` : `${SHADOW}, inset 0 7px 0 ${STRONG[f.tone]}`, transform: on ? 'translateY(-10px)' : 'none', opacity: off ? 0.4 : 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <IconTile name={f.icon} tone={f.tone} size={60} solid={on} />
              <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ink }}>{f.name}</div>
              <div style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{f.path}</div>
              <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{f.what}</div>
              <div style={{ marginTop: 'auto' }}>
                <Tag tone={f.tone} size={17}>
                  {f.when}
                </Tag>
              </div>
              {on ? (
                <div className={k('swap')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 21, fontWeight: 700, color: T.green.fg }}>
                  <Icon name="checkCircle" size={26} sw={2.4} color={C.green} /> Réponse {(si ?? 0) + 1}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
        Ils se combinent : l’agent Testeur suit les instructions du dépôt et charge la skill matrice-de-tests.
      </div>
    </Frame>
  );
};

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="Un refactoring trop gros"
    q="Vous demandez de refactorer BookingService. Le diff touche 14 fichiers et modifie 3 tests. Les tests passent. Que faites-vous ?"
    explain="Un refactoring se prouve par des tests inchangés. Un diff que personne ne peut relire n’est pas un gain de temps : c’est une dette différée."
  >
    <Opt why="Les tests ont été modifiés dans le même diff : ils ne prouvent plus que le comportement est préservé.">
      L’accepter : les tests passent
    </Opt>
    <Opt ok why="Exact : on rejette, puis un refactoring par demande, tests inchangés, un commit chacun. Chaque diff reste relisible.">
      Rejeter et redemander par petites étapes, tests intouchés
    </Opt>
    <Opt why="Reporter la relecture, c’est la faire sur un diff encore plus gros, mélangé à d’autres changements.">
      L’accepter et relire plus tard, en pull request
    </Opt>
    <Opt why="Un résumé décrit l’intention de l’agent, pas ce que fait réellement le diff.">
      Demander un résumé du diff et valider sur cette base
    </Opt>
  </QcmPage>
);

// ─── TP 4 ───────────────────────────────────────────────────────────────────
const M4_TP: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Refactoring en profondeur"
    defi="refacto"
    who="Individuel"
    minutes={25}
    feats={
      <Tag tone="violet" size={19}>
        <Icon name="bot" size={20} /> agent Refactoreur
      </Tag>
    }
    where={
      <>
        <PathChip>.github/agents/refactoreur.agent.md</PathChip>
        <br />
        <PathChip>.github/skills/refactoring-sur/</PathChip>
        <br />
        <PathChip>REFACTO.md</PathChip> + un commit par refactoring
      </>
    }
    objective={<>Optimiser le code du matin (SOLID, patterns, performance) avec <strong>votre</strong> agent Refactoreur, sans changer le comportement.</>}
    crit={
      <>
        <CheckItem id="tp4-1" size={21}>Rapport d’anti-patterns en rôle Ask, priorisé</CheckItem>
        <CheckItem id="tp4-2" size={21}>Refactoreur : 4 outils au plus, règles vérifiables</CheckItem>
        <CheckItem id="tp4-3" size={21}>Trois refactorings, un commit chacun, tests intouchés</CheckItem>
        <CheckItem id="tp4-4" size={21}>Benchmark avant / après de la recherche</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Rôle Ask : anti-patterns et violations SOLID dans REFACTO.md. Priorisez-en trois.</M2Step>
      <M2Step n={2}>Écrivez refactoreur.agent.md et sa skill refactoring-sur (vos gestes, 10 lignes).</M2Step>
      <M2Step n={3}>Rôle Refactoreur : un refactoring, les tests, un commit. Trois fois.</M2Step>
      <M2Step n={4}>Optimisez findAvailableRooms, benchmark à l’appui.</M2Step>
    </div>
    <TpBonus>Retirez « execute » de l’agent et relancez : que fait-il quand il ne peut plus lancer les tests ?</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M4_Divider, M4_Smells, M4_Solid, M4_Perf, M4_Legacy, M4_Compare, M4_Agent, M4_Equipe, M4_QuelFichier, M4_Qcm, M4_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M4 · 13:35

OBJECTIF — Annoncer le module 4 du programme : optimisation et refactoring avancé.

DIRE — « Module 4. Copilot produit du code qui marche ; il ne produit pas spontanément du code qui dure. On va identifier les anti-patterns du code généré, refactorer avec SOLID, optimiser les performances en mesurant, moderniser du legacy, comparer plusieurs implémentations. Puis on industrialise : un agent personnalisé, un rôle écrit une fois avec ses outils et ses interdits. TP 4 : un refactoring en profondeur de votre code du matin, avec votre propre agent Refactoreur. »

TRANSITION — « Commençons par un exercice d’œil. »`,
  `⏱ 5 min · ANTI-PATTERNS (exercice, 6 temps)

OBJECTIF — Identifier les anti-patterns dans le code généré par Copilot.

DIRE — « Cette fonction a été générée en un prompt. Elle fonctionne. Trouvez six défauts. » Laisser chercher une minute, puis → clic par défaut. « Un : any, plus aucun contrat. Deux : 8 et 19 en dur, et le fuseau ignoré. Trois : une requête par salle, et toutes les réservations à chaque tour. Quatre : des erreurs en chaîne de caractères, la route ne peut pas répondre 409 proprement. Cinq : une exception avalée et un new caché, impossible à tester. Six : la fonction fait quatre choses. Le chiffre en haut : le rapport GitClear 2025 observe que 2024 est la première année où les lignes copiées-collées dépassent les lignes déplacées par refactoring. L’IA duplique plus qu’elle ne factorise. »

TRANSITION — « Comment corriger ? Un principe à la fois. »`,
  `⏱ 4 min · SOLID (4 temps)

OBJECTIF — Refactoring avancé : restructuration, découplage, SOLID.

DIRE — « Demander "applique SOLID", c’est obtenir un diff de quinze fichiers impossible à relire. Pour chaque principe : le symptôme dans le code généré, et le prompt ciblé. Responsabilité unique : on extrait, book() orchestre. » → clic. « Ouvert-fermé : le switch recopié devient une stratégie. » → clic. « Liskov : l’implémentation qui lève "non implémenté" ; un test de contrat commun le révèle. » → clic. « Ségrégation : l’interface à quatorze méthodes. » → clic. « Inversion : le new SmtpMailer devient un port injecté. Et la règle du bas : pendant un refactoring, aucun fichier de test ne bouge. »

TRANSITION — « Le défaut numéro trois, c’était la performance. »`,
  `⏱ 4 min · PERFORMANCE (2 temps)

OBJECTIF — Optimisation des performances : génération d’algorithmes efficaces.

DIRE — « Copilot écrit l’algorithme le plus évident. Il sait faire mieux si on lui donne la mesure et la cible : le profil, la complexité visée, la contrainte de signature, les tests inchangés, et un benchmark reproductible. Le code du TP 2 : près de deux secondes. » → clic. « Index par salle et tri : quelques millisecondes. » → clic. « Une requête bornée avec index côté base : encore mieux, mais il faut alors des tests d’intégration. Les chiffres sont des ordres de grandeur : vous mesurerez les vôtres. Et lisibilité contre performance, c’est un choix, pas un réflexe. »

TRANSITION — « Optimiser du code neuf, c’est facile. Moderniser du vieux code, beaucoup moins. »`,
  `⏱ 4 min · LEGACY (4 temps)

OBJECTIF — Utiliser Copilot pour moderniser du code legacy.

DIRE — « Copilot est excellent pour expliquer du code ancien : /explain, diagramme de séquence, glossaire. Première étape, on ne touche à rien. » → clic. « Deux : on fige le comportement avec des tests de caractérisation — Copilot les génère très bien —, bugs compris. » → clic. « Trois : le figuier étrangleur, le nouveau module derrière la même interface. » → clic. « Quatre : un changement par PR. » → clic. « Cinq : bascule mesurée, puis suppression. Le piège : "corrige les bugs au passage". Une modernisation qui change le comportement n’est plus vérifiable. »

TRANSITION — « Dernier outil : quand Copilot propose plusieurs solutions, comment choisir ? »`,
  `⏱ 4 min · COMPARER LES IMPLÉMENTATIONS (démo interactive)

OBJECTIF — Comparer les implémentations générées et choisir la meilleure approche.

DIRE — « On demande trois versions aux compromis différents, et surtout on interdit au modèle de choisir : il présente un tableau. Ensuite, on décide avec nos critères. Avec des poids égaux, la requête SQL l’emporte. » Pousser Testabilité à 5, Performance à 1. « Si votre équipe n’a pas de base en test, les boucles simples gagnent. » Pousser Performance à 5. « Si la recherche est critique, l’index. Le choix dépend du contexte : c’est votre travail, pas celui de Copilot. »

ANIMATION — Faire proposer les poids par le groupe.

TRANSITION — « QCM. »`,
  `⏱ 5 min · ANATOMIE D’UN AGENT (5 temps, interactif)

OBJECTIF — Lire et écrire un fichier .agent.md : nom, description, outils, skills, modèle, corps.

DIRE — « Un agent personnalisé, c’est un fichier Markdown dans .github/agents. Le nom : celui que vous voyez dans la liste des rôles, et celui qu’un autre agent utilisera pour le solliciter. »
→ beat 1 « La description : obligatoire pour le harnais Copilot. Elle dit quand choisir cet agent, et c’est elle qui décide de la délégation. »
→ beat 2 « Les outils : ce qu’il a le droit de faire. Sans edit, il ne modifie rien ; sans execute, pas de terminal. » Cliquer web : « Terminal plus Internet : une page piégée peut lui dicter une commande. » Re-cliquer pour retirer.
→ beat 3 « Les skills : ses savoir-faire. Exactement le format de votre skill du TP 3. »
→ beat 4 « Le modèle : facultatif. Et attention aux anciens tutoriels : handoffs et agents sont des champs de l’ancien harnais Local, ignorés par le harnais Copilot. »
→ beat 5 « Le corps : la mission, la méthode, les interdits. Des règles vérifiables : « lance les tests avant et après », pas « sois rigoureux ». »

ANIMATION — Les lignes du fichier sont cliquables ; les outils aussi. Démo possible : Chat: Open Customizations › Agents › nouveau fichier.

TRANSITION — « Un agent seul, c’est utile. Une équipe d’agents, c’est autre chose. Voici six rôles pour SalleLibre. »`,
  `⏱ 5 min · SIX AGENTS POUR SALLELIBRE (5 temps, onglets)

OBJECTIF — Montrer des exemples complets d’agents, leurs droits et leurs interdits, et préparer l’orchestration du module 6.

DIRE — « L’Architecte : lecture seule. Il découpe une demande en lots de un à trois fichiers, chacun avec son test. Il ne peut rien casser. »
→ beat 1 « Le Testeur : il reprend votre skill du TP 3. Sa règle d’or : un nouveau test doit d’abord être rouge, et il ne touche jamais src. »
→ beat 2 « Le Refactoreur : celui que vous écrivez au TP 4. »
→ beat 3 « L’Auditeur : lecture seule, et user-invocable à false : il n’apparaît pas dans la liste, on le sollicite comme sous-agent. Intérêt : un contexte neuf, il n’a pas écrit le code qu’il relit. Vous l’utiliserez au TP 5. »
→ beat 4 « Le Documentaliste : edit, mais seulement sur la doc ; un modèle rapide suffit. »
→ beat 5 « Et le chef d’orchestre : il a l’outil agent, il délègue aux autres par leur nom exact, et il s’arrête pour vous demander de valider le plan. On le détaille au module 6, c’est votre TP 6. Regardez les outils : moins un agent en a, plus on peut lui faire confiance. »

ANIMATION — Les onglets sont cliquables : revenir sur l’onglet demandé par un participant.

TRANSITION — « Avec tous ces fichiers, comment choisir le bon ? Petit exercice. »`,
  `⏱ 3 min · QUEL FICHIER (exercice, 4 temps)

OBJECTIF — Distinguer instructions, skill, agent et MCP.

DIRE — « Quatre besoins. Pour chacun, dites-moi à voix haute : instructions, skill, agent ou MCP ? »
→ beat 1 « Une règle valable à chaque demande : les instructions du dépôt. »
→ beat 2 « Une méthode avec son modèle de fichier, utile seulement quand on écrit des tests : une skill. »
→ beat 3 « Un rôle avec des droits restreints : un agent, ici sans edit. »
→ beat 4 « Un accès à un système externe, les tickets : un serveur MCP, déclaré dans mcp.json. Et ils se combinent : le Testeur suit les instructions du dépôt et charge la skill matrice-de-tests. »

ANIMATION — Faire voter à voix haute avant chaque clic ; les boutons de situation sont cliquables.

TRANSITION — « QCM, puis votre premier agent. »`,
  `⏱ 2 min · QCM 4

OBJECTIF — Ancrer la discipline du refactoring par petits pas.

DIRE — « Le réflexe : un diff que vous ne pouvez pas relire se rejette. Les tests modifiés dans le même diff ne prouvent plus rien. C’est exactement la règle « ne modifie jamais tests/ » de votre Refactoreur. »

ANIMATION — Vote à voix haute, clic sur la réponse majoritaire, → bonne réponse, → l’essentiel.

TRANSITION — « TP 4. »`,
  `⏱ 25 min (minuteur) · TP 4

OBJECTIF — Atelier du programme : refactoring en profondeur, optimiser le code généré le matin en appliquant SOLID et les patterns vus.

DIRE — « TP individuel. D’abord un diagnostic en rôle Ask : un rapport dans REFACTO.md, aucune modification, et vous priorisez trois refactorings. Ensuite vous écrivez votre agent : .github/agents/refactoreur.agent.md, quatre outils au plus — read, search, edit, execute —, et des règles vérifiables : tests avant et après chaque geste, un refactoring à la fois, aucune correction de bug au passage, ne jamais modifier tests. Sa skill refactoring-sur contient vos gestes en dix lignes. Puis vous choisissez Refactoreur dans la liste des rôles : un refactoring, les tests, un commit. Trois fois. Enfin la recherche de salles, benchmark avant et après. Bonus : retirez execute et relancez : l’agent ne peut plus prouver, regardez ce qu’il fait. »

ANIMATION — Coller dans le Chat le squelette d’un .agent.md (en-tête name, description, tools, skills). Lancer le minuteur. Points d’étape à 8 et 18 minutes : « Rapport, agent écrit, premier commit ? » Quelqu’un bloqué partage son écran 2 minutes. Faire montrer à un volontaire son historique git : un commit par refactoring.

TRANSITION — « Votre code est propre. Est-il sûr ? Module 5. »`,
];
// @@NOTES-END
