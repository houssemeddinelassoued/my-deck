// ─── Module 6 · Copilot en équipe ───────────────────────────────────────────

const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Bonnes pratiques
        <br />
        d’intégration en équipe
      </>
    }
    sub="Conventions, pull requests, CI/CD, orchestration d’agents, mesure et charte : passer d’usages individuels à une pratique d’équipe."
    dur="15:40 – 16:40 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 6 · feature orchestrée</Tag>}
  >
    <SecItem n={1}>Des conventions d’usage d’équipe</SecItem>
    <SecItem n={2}>Pull requests, revue de code et CI/CD</SecItem>
    <SecItem n={3}>Orchestrer une équipe d’agents</SecItem>
    <SecItem n={4}>Mesurer avec et sans Copilot</SecItem>
    <SecItem n={5}>Une charte d’utilisation responsable</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── Conventions ────────────────────────────────────────────────────────────
const M6Conv = ({ icon, tone, title, q, d }: { icon: IconName; tone: Tone; title: string; q: string; d: number }) => (
  <Card cls={A.in} tone={tone} icon={icon} title={title} size={23} style={dl(d)}>
    {q}
  </Card>
);

const M6_Conventions: Page = () => (
  <Frame mod={6}>
    <Title>Des conventions d’usage, décidées ensemble</Title>
    <Lede>Sans conventions, chacun a son Copilot : six questions que l’équipe tranche une fois, par écrit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M6Conv icon="bot" tone="violet" title="Quels modes, où ?" q="Agent autorisé sur quels dossiers ? Plan obligatoire au-delà de combien de fichiers ?" d={100} />
      <M6Conv icon="cpu" tone="blue" title="Quels modèles ?" q="Lesquels pour quelles tâches, et quel budget de requêtes premium ?" d={180} />
      <M6Conv icon="lock" tone="coral" title="Quelles données ?" q="Ce qui ne part jamais dans un prompt, et les exclusions de contenu configurées." d={260} />
      <M6Conv icon="eye" tone="yellow" title="Quelle revue ?" q="Tout code généré relu comme du code humain. Qui approuve une PR d’agent ?" d={340} />
      <M6Conv icon="flag" tone="teal" title="Quelle traçabilité ?" q="Mention dans la PR, label « ai-assisted », prompts utiles conservés." d={420} />
      <M6Conv icon="flask" tone="green" title="Quelle preuve ?" q="Tests exigés pour tout code généré, seuils de couverture, analyse en CI." d={500} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="doc" size={24} color={C.electric} />
      Les réponses vont dans le dépôt : <span style={{ fontFamily: mono, color: C.navy }}>CONTRIBUTING.md</span> et <span style={{ fontFamily: mono, color: C.navy }}>.github/copilot-instructions.md</span>.
    </div>
  </Frame>
);

// ─── Pull request et revue ──────────────────────────────────────────────────
const M6Flow = ({ x, icon, tone, title, sub, who, beat }: { x: number; icon: IconName; tone: Tone; title: string; sub: string; who: 'ia' | 'humain' | 'outil'; beat: number }) => (
  <div className={beat ? b.pop(beat) : A.pop} style={{ position: 'absolute', left: x, top: 300, width: 250, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 18px', borderTop: `6px solid ${STRONG[tone]}` }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 23, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.35, color: C.soft, minHeight: 52 }}>{sub}</div>
    <div style={{ marginTop: 10 }}>
      <Tag tone={who === 'ia' ? 'violet' : who === 'humain' ? 'green' : 'grey'} size={16}>
        {who === 'ia' ? 'Copilot' : who === 'humain' ? 'Humain' : 'Outil'}
      </Tag>
    </div>
  </div>
);

const M6_PR: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>Copilot dans le workflow de pull request</Title>
    <Lede>Copilot écrit, décrit et relit en premier. La CI prouve. Un humain décide.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 245 290 H 1675" stroke={C.rule} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
    </svg>
    <M6Flow x={120} icon="ticket" tone="grey" title="Issue" sub="critères d’acceptation écrits" who="humain" beat={0} />
    <M6Flow x={407} icon="bot" tone="violet" title="Agent" sub="local, ou issue assignée à Copilot" who="ia" beat={1} />
    <M6Flow x={694} icon="doc" tone="blue" title="PR décrite" sub="résumé généré, relu, complété" who="ia" beat={2} />
    <M6Flow x={981} icon="checkCircle" tone="teal" title="CI" sub="tests, couverture, CodeQL" who="outil" beat={3} />
    <M6Flow x={1268} icon="eye" tone="pink" title="Revue Copilot" sub="premier passage, commentaires" who="ia" beat={4} />
    <M6Flow x={1555} icon="humanCheck" tone="green" title="Revue humaine" sub="approbation obligatoire" who="humain" beat={5} />
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
      <Card tone="green" icon="humanCheck" title="Approbation" size={22}>
        Une PR créée par l’agent est approuvée par un autre humain que celui qui l’a demandée.
      </Card>
      <Card tone="pink" icon="doc" title="Instructions de revue" size={22}>
        La revue Copilot lit les instructions du dépôt : mettez-y vos points de contrôle.
      </Card>
      <Card tone="yellow" icon="alert" title="Taille" size={22}>
        Au-delà de 400 lignes, la revue humaine décroche. Découpez en amont.
      </Card>
    </div>
  </Frame>
);

// ─── CI/CD ──────────────────────────────────────────────────────────────────
const M6Check = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <Num n={n} tone="teal" size={38} style={{ marginTop: 2 }} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6Num = ({ n }: { n: number }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, marginLeft: 10, borderRadius: 99, background: C.teal, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 17, verticalAlign: 'middle' }}>{n}</span>
);

const M6_CICD: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Copilot et CI/CD : générer pipelines et scripts</Title>
    <Lede>Copilot écrit très bien du YAML… avec les versions et les permissions de sa date d’entraînement. Quatre vérifications.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file=".github/workflows/ci.yml" size={20}>
        <Ck>on</Ck>: [pull_request]{'\n'}
        <Ck>permissions</Ck>:{'\n'}
        {'  '}<Ck>contents</Ck>: <Cs>read</Cs>
        <M6Num n={1} />
        {'\n'}
        <Ck>jobs</Ck>:{'\n'}
        {'  '}<Ck>test</Ck>:{'\n'}
        {'    '}<Ck>runs-on</Ck>: <Cs>ubuntu-latest</Cs>
        {'\n'}
        {'    '}<Ck>steps</Ck>:{'\n'}
        {'      '}- <Ck>uses</Ck>: <Cs>actions/checkout@</Cs><Cn>{'<sha>'}</Cn> <Cc># v4.x vérifiée</Cc>
        <M6Num n={2} />
        {'\n'}
        {'      '}- <Ck>uses</Ck>: <Cs>actions/setup-node@</Cs><Cn>{'<sha>'}</Cn>
        {'\n'}
        {'        '}<Ck>with</Ck>: {'{'} <Ck>node-version</Ck>: <Cn>22</Cn>, <Ck>cache</Ck>: <Cs>npm</Cs> {'}'}
        {'\n'}
        {'      '}- <Ck>run</Ck>: <Cs>npm ci</Cs>
        <M6Num n={3} />
        {'\n'}
        {'      '}- <Ck>run</Ck>: <Cs>npm run test:ci</Cs> <Cc># seuil : 80 % des branches</Cc>
        <M6Num n={4} />
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 18, fontSize: 21, color: C.muted, ...dl(500) }}>
        Même démarche pour GitLab CI, Azure Pipelines ou Jenkins, et pour Dockerfile, Makefile et scripts de migration.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M6Check n={1} title="Permissions minimales">Lecture seule par défaut, écriture au cas par cas.</M6Check>
      <M6Check n={2} title="Actions épinglées">Par SHA, version vérifiée : le modèle propose souvent une version ancienne.</M6Check>
      <M6Check n={3} title="Installation reproductible">npm ci, pip install --require-hashes, lockfile respecté.</M6Check>
      <M6Check n={4} title="Portes de qualité">Tests, seuil de couverture, analyse de sécurité bloquants.</M6Check>
    </div>
  </Frame>
);

// ─── Mesurer ────────────────────────────────────────────────────────────────
const M6Metric = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_Metrics: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Évaluer productivité et qualité, avec et sans Copilot</Title>
    <Lede>Deux études sérieuses, deux conclusions opposées. Le ressenti n’est pas une mesure : il faut la vôtre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 880, display: 'flex', gap: 24 }}>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${C.green}` }}>
        <Stat value={<CountUp to={55} prefix="+" suffix=" %" />} label="de vitesse sur une tâche isolée (serveur HTTP), devs avec Copilot" tone="green" size={92} />
        <div style={{ marginTop: 12, fontSize: 18, color: C.muted }}>GitHub · essai contrôlé, 2022</div>
      </div>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${C.coral}`, ...dl(200) }}>
        <Stat value={<CountUp to={19} prefix="−" suffix=" %" />} label="de vitesse pour des seniors sur leurs propres dépôts… qui se croyaient 20 % plus rapides" tone="coral" size={92} />
        <div style={{ marginTop: 12, fontSize: 18, color: C.muted }}>METR · essai randomisé, 2025</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 700, width: 880 }}>
      <Callout title="Protocole d’équipe" tone="blue" icon="flask" size={22}>
        Métriques fixées à l’avance, tâches comparables, 6 à 8 semaines, avant / après. Et on regarde la qualité en même temps que la vitesse.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 262, width: 740, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.navy} size={19}>
        Quoi mesurer
      </Eyebrow>
      <M6Metric icon="trend" tone="blue" title="Flux" d={200}>
        Délai de livraison, durée de cycle des PR (DORA).
      </M6Metric>
      <M6Metric icon="bug" tone="coral" title="Qualité" d={300}>
        Taux d’échec des changements, défauts échappés, score de mutation.
      </M6Metric>
      <M6Metric icon="smile" tone="green" title="Expérience" d={400}>
        Satisfaction, charge cognitive, temps de revue (SPACE).
      </M6Metric>
      <M6Metric icon="chart" tone="grey" title="Usage" d={500}>
        Utilisateurs actifs, taux d’acceptation : de l’usage, pas de la valeur.
      </M6Metric>
    </div>
  </Frame>
);

// ─── Charte ─────────────────────────────────────────────────────────────────
const M6_Charter: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Une charte d’utilisation responsable de l’IA</Title>
    <Lede>Huit engagements, à adapter. Comptez pour vous ceux que votre équipe applique déjà, réellement.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'flex', flexDirection: 'column', gap: 11 }}>
        <CheckItem id="ch1" size={23} tone="navy">Le développeur reste l’auteur et le responsable du code qu’il commite.</CheckItem>
        <CheckItem id="ch2" size={23} tone="navy">Aucun secret, donnée personnelle ou code client hors périmètre dans un prompt.</CheckItem>
        <CheckItem id="ch3" size={23} tone="navy">Tout code généré est relu et testé comme du code humain.</CheckItem>
        <CheckItem id="ch4" size={23} tone="navy">Toute dépendance proposée est vérifiée avant ajout.</CheckItem>
        <CheckItem id="ch5" size={23} tone="navy">Le filtre de code public est actif ; les licences sont respectées.</CheckItem>
        <CheckItem id="ch6" size={23} tone="navy">Les agents travaillent sur branche, droits minimaux, approbation humaine.</CheckItem>
        <CheckItem id="ch7" size={23} tone="navy">Instructions et prompts d’équipe sont versionnés et relus.</CheckItem>
        <CheckItem id="ch8" size={23} tone="navy">L’usage est mesuré ; la charte est revue chaque trimestre.</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1360, top: 262, width: 440, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Maturité de l’équipe"
          levels={[
            { min: 0, text: 'Usages individuels : commencez par 1, 2 et 3.', tone: 'coral' },
            { min: 4, text: 'En construction : écrivez la charte.', tone: 'yellow' },
            { min: 7, text: 'Pratique d’équipe : partagez-la.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Ce qui n’est pas coché aujourd’hui alimente votre plan d’action de fin de journée.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ═══ Orchestration d’agents (orchestrateur ; simulation et potentiel repris de copilot-debutant v1, p. 119–120) ═══
// Harnais Copilot (doc VS Code « Use subagents », 11 novembre 2026) : l’agent principal délègue à des agents
// intégrés ou personnalisés via l’outil natif (alias « agent ») ; chaque sous-agent a son propre contexte.

// ─── Le chef d’orchestre : un agent qui délègue ─────────────────────────────
const M6Worker = ({ icon, tone, name, tools, children, cls }: { icon: IconName; tone: Tone; name: string; tools: string; children: ReactNode; cls: string }) => (
  <div className={cls} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr)', gap: 14, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '10px 16px', borderLeft: `6px solid ${STRONG[tone]}` }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: C.ink }}>{name}</span>
        <span style={{ fontFamily: mono, fontSize: 16, color: T[tone].fg }}>{tools}</span>
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.3, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6Gate = ({ children, cls }: { children: ReactNode; cls: string }) => (
  <div className={cls} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 700, color: T.green.fg }}>
    <span style={{ width: 18, height: 18, background: C.green, transform: 'rotate(45deg)', borderRadius: 4, flex: 'none' }} />
    {children}
  </div>
);

const M6_Orchestrateur: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Un chef d’orchestre : l’agent qui fait travailler les autres</Title>
    <Lede>Il ne fait pas tout : il découpe, délègue à chaque agent dans un contexte séparé, et s’arrête là où vous devez décider.</Lede>
    <CodeDark file=".github/agents/chef-orchestre.agent.md" size={18} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>name</Ck>: Chef d’orchestre
      {'\n'}
      <Ck>description</Ck>: Mène une feature de SalleLibre de bout en{'\n  '}bout en déléguant aux agents spécialisés.
      {'\n'}
      <Ck>tools</Ck>: [<Cs>'agent'</Cs>, <Cs>'read'</Cs>, <Cs>'search'</Cs>, <Cs>'edit'</Cs>, <Cs>'execute'</Cs>, <Cs>'todo'</Cs>]
      {'\n'}
      <Cc>---</Cc>
      {'\n'}Tu coordonnes. Sollicite chaque agent comme{'\n'}sous-agent, par son nom exact.{'\n'}
      <Cf>1.</Cf> Architecte : un plan en lots.{'\n   '}
      <strong style={{ color: '#9BE29B' }}>ARRÊTE-TOI : j’approuve le plan.</strong>
      {'\n'}
      <Cf>2.</Cf> Pour chaque lot :{'\n   '}a. Testeur : les tests du lot, ROUGES.{'\n   '}b. Toi : le code minimal, jusqu’au vert.{'\n      '}Ne modifie aucun test.{'\n   '}c. Auditeur : audit du diff.{'\n      '}Faille bloquante : retour en a.{'\n'}
      <Cf>3.</Cf> Documentaliste : OpenAPI et README.{'\n'}
      <Cf>4.</Cf> Résume lots, tests, failles, risques.{'\n   '}
      <strong style={{ color: '#9BE29B' }}>Je relis le diff avant la PR.</strong>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1030, top: 262, width: 770, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, background: G.navy, color: '#fff', borderRadius: 16, padding: '12px 18px', ...dl(150) }}>
        <IconTile name="route" tone="navy" size={48} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23 }}>Chef d’orchestre</div>
          <div style={{ fontSize: 18, color: '#C9D2EA' }}>choisi par vous dans la liste des rôles · code lui-même</div>
        </div>
      </div>
      <M6Worker icon="layers" tone="teal" name="Architecte" tools="read · search" cls={b.on(1)}>
        rend un plan en lots ; ne peut rien modifier
      </M6Worker>
      <M6Worker icon="flask" tone="pink" name="Testeur" tools="+ edit · execute" cls={b.on(1)}>
        écrit les tests rouges, seulement dans tests/
      </M6Worker>
      <M6Worker icon="shield" tone="coral" name="Auditeur" tools="read · search" cls={b.on(1)}>
        rend un rapport de failles ; ne corrige pas
      </M6Worker>
      <M6Worker icon="doc" tone="green" name="Documentaliste" tools="+ edit" cls={b.on(1)}>
        met à jour la doc, seulement la doc
      </M6Worker>
      <div style={{ display: 'flex', gap: 30, paddingLeft: 6, marginTop: 4 }}>
        <M6Gate cls={b.on(2)}>Vous : le plan</M6Gate>
        <M6Gate cls={b.on(2)}>Vous : le diff, puis la PR</M6Gate>
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1030, top: 790, width: 770 }}>
      <Callout tone="yellow" icon="bulb" title="Dans le Chat" size={20}>
        Chaque sous-agent apparaît replié, avec son nom : dépliez-le pour voir ce qu’il a lu et rendu. Les boutons de relais (handoffs) des anciens tutoriels sont ignorés.
      </Callout>
    </div>
  </Frame>
);

// ─── Orchestration : la simulation ──────────────────────────────────────────
type NodeId = 'H' | 'HUB' | 'ARC' | 'TST' | 'REF' | 'AUD' | 'DOC';
const NODES6: Record<NodeId, { x: number; y: number; label: string; icon: IconName; tone: Tone }> = {
  H: { x: 215, y: 655, label: 'Vous', icon: 'humanCheck', tone: 'green' },
  HUB: { x: 700, y: 655, label: 'Chef d’orchestre', icon: 'route', tone: 'navy' },
  ARC: { x: 450, y: 420, label: 'Architecte', icon: 'layers', tone: 'teal' },
  TST: { x: 780, y: 390, label: 'Testeur', icon: 'flask', tone: 'pink' },
  REF: { x: 1090, y: 450, label: 'Refactoreur', icon: 'wand', tone: 'violet' },
  AUD: { x: 1090, y: 800, label: 'Auditeur', icon: 'shield', tone: 'coral' },
  DOC: { x: 700, y: 900, label: 'Documentaliste', icon: 'doc', tone: 'green' },
};
type Move = [NodeId, NodeId, string];
type SStep = { m: Move[]; log: string; bad?: boolean; gate?: boolean; cost: number };
const SCEN6: { label: string; kind: string; steps: SStep[] }[] = [
  {
    label: 'Nouvelle fonctionnalité',
    kind: 'Relais par lots',
    steps: [
      { m: [['H', 'HUB', 'brief']], log: 'Vous : « réservations récurrentes, chaque mardi, avec exceptions »', cost: 1 },
      { m: [['HUB', 'ARC', 'demande']], log: 'Architecte : 3 lots, un test par lot', cost: 2 },
      { m: [['ARC', 'HUB', 'plan']], log: 'Architecte → plan rendu au chef d’orchestre', cost: 1 },
      { m: [['HUB', 'H', 'plan']], log: 'Chef d’orchestre s’arrête : vous relisez et validez le plan', gate: true, cost: 0 },
      { m: [['HUB', 'TST', 'lot 1']], log: 'Testeur : 6 tests du lot 1, tous rouges', cost: 3 },
      { m: [['TST', 'HUB', 'tests ✗']], log: 'Chef d’orchestre : code minimal, les 6 tests passent', cost: 4 },
      { m: [['HUB', 'REF', 'lot 1 ✓']], log: 'Refactoreur : extrait RecurrenceRule, tests intouchés, verts', cost: 2 },
      { m: [['HUB', 'AUD', 'diff']], log: 'Auditeur : récurrence sans limite → 10 000 réservations possibles', cost: 2 },
      { m: [['AUD', 'HUB', '✗ faille']], log: 'Faille bloquante : retour au Testeur, test d’exploitation rouge', bad: true, cost: 1 },
      { m: [['HUB', 'TST', 'faille']], log: 'Testeur + chef : limite à 52 occurrences, test vert', cost: 3 },
      { m: [['HUB', 'DOC', 'diff']], log: 'Documentaliste : OpenAPI et README à jour', cost: 1 },
      { m: [['HUB', 'H', 'synthèse']], log: 'Vous : relecture du diff (tests d’abord), puis la PR', gate: true, cost: 0 },
    ],
  },
  {
    label: 'Revue en parallèle',
    kind: 'Éventail puis synthèse',
    steps: [
      { m: [['H', 'HUB', 'PR #42']], log: 'Vous : « fais relire la PR #42 »', cost: 1 },
      { m: [['HUB', 'ARC', 'diff'], ['HUB', 'TST', 'diff'], ['HUB', 'AUD', 'diff']], log: 'Chef d’orchestre : 3 sous-agents lancés en même temps', cost: 2 },
      { m: [['ARC', 'HUB', '1 écart au plan'], ['TST', 'HUB', '2 tests manquants'], ['AUD', 'HUB', '1 faille']], log: 'Chacun rend son rapport, depuis un contexte séparé', cost: 6 },
      { m: [['HUB', 'H', 'synthèse']], log: 'Synthèse : 1 bloquant (faille), 2 tests à ajouter → vous décidez', gate: true, cost: 1 },
    ],
  },
  {
    label: 'Bug en production',
    kind: 'Boucle courte',
    steps: [
      { m: [['H', 'HUB', 'ticket #87']], log: 'Vous : « 409 à tort : 10h–11h puis 11h–12h »', cost: 1 },
      { m: [['HUB', 'TST', 'ticket']], log: 'Testeur : un test qui reproduit le bug, rouge', cost: 2 },
      { m: [['TST', 'HUB', 'test ✗']], log: 'Chef d’orchestre : correctif minimal sur la borne, vert', cost: 2 },
      { m: [['HUB', 'AUD', 'diff']], log: 'Auditeur : rien à signaler sur 6 lignes', cost: 1 },
      { m: [['HUB', 'H', 'PR 6 lignes']], log: 'Vous : relecture rapide et fusion', gate: true, cost: 0 },
    ],
  },
  {
    label: 'Garde-fou sécurité',
    kind: 'Blocage et arbitrage',
    steps: [
      { m: [['H', 'HUB', 'brief']], log: 'Vous : « branche SalleLibre sur l’annuaire de l’entreprise »', cost: 1 },
      { m: [['HUB', 'AUD', 'diff']], log: 'Chef d’orchestre : client d’annuaire écrit, envoyé à l’audit', cost: 3 },
      { m: [['AUD', 'HUB', '✗ secret en clair']], log: 'Auditeur : BLOQUÉ, mot de passe de service dans le code', bad: true, cost: 1 },
      { m: [['HUB', 'AUD', 'variable d’env.']], log: 'Chef d’orchestre : secret lu depuis l’environnement, nouvel audit', cost: 2 },
      { m: [['HUB', 'H', 'question']], log: 'Auditeur via le chef : « quel coffre-fort en production ? » → décision humaine', gate: true, cost: 1 },
    ],
  },
];

const AgNode = ({ id, state }: { id: NodeId; state: 'idle' | 'on' | 'done' | 'bad' }) => {
  const n = NODES6[id];
  const on = state === 'on' || state === 'bad';
  const ring = state === 'bad' ? C.coral : STRONG[n.tone];
  const hub = id === 'HUB';
  return (
    <div
      className={k('agn')}
      style={{
        position: 'absolute',
        left: n.x - 115,
        top: n.y - 42,
        width: 230,
        height: 84,
        boxSizing: 'border-box',
        borderRadius: 18,
        background: hub ? G.navy : on ? T[n.tone].bg : C.card,
        color: hub ? '#fff' : C.ink,
        boxShadow: on ? `0 0 0 4px ${ring}, 0 0 0 14px ${T[n.tone].bg}` : SHADOW,
        transform: on ? 'scale(1.07)' : 'none',
        opacity: state === 'idle' ? 0.72 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 14px',
        zIndex: 2,
      }}
    >
      <IconTile name={n.icon} tone={n.tone} size={50} solid={on || hub} />
      <span style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.15 }}>{n.label}</span>
      {state === 'done' ? (
        <span style={{ position: 'absolute', right: -8, top: -8, width: 28, height: 28, borderRadius: 99, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={18} sw={3} />
        </span>
      ) : null}
    </div>
  );
};

const M6_Orchestration: Page = () => {
  const [ref, beats] = useBeats();
  const [sc, setSc] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scen = SCEN6[sc];
  const N = scen.steps.length;
  useEffect(() => {
    if (beats > 3) return;
    setSc(Math.max(0, Math.min(beats, 3)));
    setStep(0);
    setPlaying(true);
  }, [beats]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => Math.min(N, s + 1)), 1700);
    return () => window.clearInterval(id);
  }, [playing, N, sc]);
  useEffect(() => {
    if (step >= N) setPlaying(false);
  }, [step, N]);
  const cur = step > 0 ? scen.steps[step - 1] : null;
  const done = new Set<NodeId>();
  scen.steps.slice(0, Math.max(0, step - 1)).forEach((s) => s.m.forEach(([, to]) => done.add(to)));
  const active = new Set<NodeId>();
  cur?.m.forEach(([, to]) => active.add(to));
  const used = new Set<NodeId>();
  scen.steps.slice(0, step).forEach((s) => s.m.forEach(([a, z]) => [a, z].forEach((x) => x !== 'H' && x !== 'HUB' && used.add(x))));
  const gates = scen.steps.slice(0, step).filter((s) => s.gate).length;
  const cost = scen.steps.slice(0, step).reduce((a, s) => a + s.cost, 0);
  const choose = (i: number) => {
    setSc(i);
    setStep(0);
    setPlaying(true);
  };
  return (
    <Frame mod={6} kind="demo" beats={3}>
      <Title>Simulation : une équipe d’agents orchestrée</Title>
      <Lede>Le chef d’orchestre sollicite chaque agent comme sous-agent, dans son propre contexte. Choisissez un scénario et regardez circuler le travail.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 262 }}>
        <MTabs items={SCEN6.map((s) => s.label)} cur={sc} set={choose} size={19} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        {(Object.keys(NODES6) as NodeId[])
          .filter((id) => id !== 'HUB')
          .map((id) => (
            <line key={id} x1={NODES6.HUB.x} y1={NODES6.HUB.y} x2={NODES6[id].x} y2={NODES6[id].y} stroke={C.rule} strokeWidth={3} strokeDasharray="4 10" />
          ))}
        {cur?.m.map(([a, z], i) => (
          <line key={`${sc}-${step}-${i}`} className={k('edge')} x1={NODES6[a].x} y1={NODES6[a].y} x2={NODES6[z].x} y2={NODES6[z].y} stroke={cur.bad ? C.coral : C.electric} strokeWidth={5} strokeLinecap="round" />
        ))}
      </svg>
      {(Object.keys(NODES6) as NodeId[]).map((id) => (
        <AgNode key={id} id={id} state={active.has(id) ? (cur?.bad ? 'bad' : 'on') : done.has(id) ? 'done' : 'idle'} />
      ))}
      {cur?.m.map(([a, z, art], i) => (
        <div
          key={`p-${sc}-${step}-${i}`}
          className={k('pkt')}
          style={{ ['--x0' as string]: `${NODES6[a].x}px`, ['--y0' as string]: `${NODES6[a].y}px`, ['--x1' as string]: `${NODES6[z].x}px`, ['--y1' as string]: `${NODES6[z].y - 62}px`, ...dl(i * 120), zIndex: 3, padding: '6px 14px', borderRadius: 99, background: cur.bad ? C.coral : C.electric, color: '#fff', fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 10px 24px -10px rgba(11,31,92,.8)' } as CSSProperties}
        >
          {art}
        </div>
      ))}
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 262, width: 480, height: 700, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '18px 20px', display: 'flex', flexDirection: 'column', ...dl(200) }}>
        <div style={{ fontSize: 17, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9AA6C8' }}>{scen.kind}</div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          {(
            [
              ['étapes', `${step} / ${N}`],
              ['sous-agents mobilisés', `${used.size}`],
              ['validations humaines', `${gates}`],
              ['crédits (illustratif)', `≈ ${cost * 6}`],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: '#fff' }}>{v}</div>
              <div style={{ fontSize: 15, color: '#9AA6C8' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
          {scen.steps.slice(Math.max(0, step - 6), step).map((s, i, arr) => {
            const last = i === arr.length - 1;
            return (
              <div key={`${sc}-${step - arr.length + i}`} className={k('swap')} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0, 1fr)', gap: 8, padding: '6px 8px', borderRadius: 8, background: last ? 'rgba(255,255,255,.08)' : 'transparent' }}>
                <Icon name={s.bad ? 'alert' : s.gate ? 'humanCheck' : 'send'} size={20} color={s.bad ? C.coral : s.gate ? '#3DDC97' : '#82AAFF'} sw={2.2} />
                <span style={{ fontSize: 17, lineHeight: 1.3, color: last ? '#fff' : '#C9D2EA' }}>{s.log}</span>
              </div>
            );
          })}
          {step === 0 ? <div style={{ fontSize: 18, color: '#7C86A8' }}>Appuyez sur Lecture…</div> : null}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 980, display: 'flex', gap: 10, ...dl(300) }}>
        <Btn icon={playing ? 'pause' : 'play'} size={19} onClick={() => (step >= N ? choose(sc) : setPlaying((p) => !p))}>
          {playing ? 'Pause' : 'Lecture'}
        </Btn>
        <Btn
          icon="arrow"
          size={19}
          ghost
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(N, s + 1));
          }}
        >
          Pas
        </Btn>
        <Btn
          icon="reset"
          size={19}
          ghost
          tone="grey"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        />
      </div>
    </Frame>
  );
};

// ─── Le potentiel ───────────────────────────────────────────────────────────
const GANTT_SOLO: [string, number, number, Tone][] = [
  ['Planifier', 0, 2, 'teal'],
  ['Tester', 2, 5, 'pink'],
  ['Coder', 5, 9, 'navy'],
  ['Refactorer', 9, 11, 'violet'],
  ['Sécurité', 11, 13, 'coral'],
  ['Documenter', 13, 15, 'green'],
];
const GANTT_TEAM: [string, number, number, Tone][] = [
  ['Planifier', 0, 1, 'teal'],
  ['Tester', 1, 3, 'pink'],
  ['Coder', 2, 5, 'navy'],
  ['Refactorer', 4, 5.5, 'violet'],
  ['Sécurité', 4, 6, 'coral'],
  ['Documenter', 5, 6.5, 'green'],
];
const GX6 = (u: number) => (u / 15) * 1180;

const M6Gantt = ({ rows, beat, top, gates }: { rows: [string, number, number, Tone][]; beat: number; top: number; gates: number[] }) => (
  <div style={{ position: 'absolute', left: 300, top, width: 1180, height: rows.length * 34 }}>
    {rows.map(([t, a, z, tone], i) => (
      <div key={t} className={beat ? b.grow(beat) : A.grow} style={{ position: 'absolute', left: GX6(a), top: i * 34, width: GX6(z - a), height: 26, borderRadius: 8, background: STRONG[tone], transformOrigin: 'left center', display: 'flex', alignItems: 'center', paddingLeft: 10, boxSizing: 'border-box', color: '#fff', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', ...dl(i * 140) }}>
        {t}
      </div>
    ))}
    {gates.map((g) => (
      <div key={g} className={beat ? b.pop(beat) : A.pop} style={{ position: 'absolute', left: GX6(g) - 13, top: -34, width: 26, height: 26, transform: 'rotate(45deg)', background: C.green, borderRadius: 5, ...dl(900) }} />
    ))}
  </div>
);

const M6_Potentiel: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Le potentiel : spécialiser, paralléliser, se vérifier</Title>
    <Lede>Une équipe d’agents ne pense pas mieux qu’un seul modèle : elle découpe, parallélise et se contrôle. Durées illustratives.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 320, width: 170, fontSize: 21, fontWeight: 700, color: C.ink }}>
      Un agent seul
      <div style={{ fontSize: 17, fontWeight: 400, color: C.muted }}>tout dans un contexte</div>
    </div>
    <M6Gantt rows={GANTT_SOLO} beat={0} top={320} gates={[15]} />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 170, fontSize: 21, fontWeight: 700, color: C.ink }}>
      Une équipe orchestrée
      <div style={{ fontSize: 17, fontWeight: 400, color: C.muted }}>un contexte par rôle</div>
    </div>
    <M6Gantt rows={GANTT_TEAM} beat={1} top={560} gates={[1, 6.5]} />
    <div className={b.fade(1)} style={{ position: 'absolute', left: 1500, top: 560, width: 300, fontSize: 19, color: C.soft, lineHeight: 1.4 }}>
      <span style={{ display: 'inline-block', width: 16, height: 16, background: C.green, transform: 'rotate(45deg)', borderRadius: 3, marginRight: 10 }} />
      vos validations : le plan, puis le diff
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 22 }}>
      <Card tone="blue" icon="target" title="Spécialisation" size={19} pad={18}>
        Un contexte court et propre par rôle : moins de bruit, de meilleures réponses.
      </Card>
      <Card tone="violet" icon="layers" title="Parallélisme" size={19} pad={18}>
        Tests, sécurité et relecture en même temps, sur le même diff.
      </Card>
      <Card tone="teal" icon="shieldCheck" title="Contrôle croisé" size={19} pad={18}>
        L’Auditeur n’a pas écrit le code qu’il relit : il le prouve.
      </Card>
      <Card tone="green" icon="note" title="Traçabilité" size={19} pad={18}>
        Chaque relais laisse un artefact relisible : plan, tests, rapport.
      </Card>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <QcmPage
    mod={6}
    n={6}
    title="Lire un indicateur"
    q="Le taux d’acceptation des suggestions de l’équipe passe de 25&nbsp;% à 38&nbsp;% en un trimestre. Qu’en concluez-vous ?"
    explain="Le taux d’acceptation mesure l’usage. La valeur se lit dans le flux et la qualité livrés : on croise toujours plusieurs indicateurs."
  >
    <Opt why="Accepter plus de suggestions ne dit rien du temps total, ni des corrections faites ensuite.">
      La productivité de l’équipe a augmenté de 52 %
    </Opt>
    <Opt ok why="Exact : signal d’adoption intéressant, à croiser avec délai de livraison, taux d’échec des changements et défauts.">
      L’usage progresse ; la valeur reste à croiser avec flux et qualité
    </Opt>
    <Opt why="Du code accepté plus souvent peut aussi être du code relu moins attentivement.">
      La qualité du code s’est améliorée
    </Opt>
    <Opt why="Mesurer reste indispensable : c’est l’indicateur isolé qui trompe, pas la mesure.">
      Rien : les indicateurs d’usage sont inutiles
    </Opt>
  </QcmPage>
);

// ─── TP 6 · projet de clôture ───────────────────────────────────────────────
const M6Feat = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <IconTile name={icon} tone={tone} size={40} />
    <span style={{ fontSize: 22, lineHeight: 1.35, color: C.soft }}>
      <strong style={{ color: C.ink }}>{title}</strong> · {children}
    </span>
  </div>
);

const M6_TP: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="Projet de clôture : une feature orchestrée"
    defi="soutenance"
    who="Individuel · 2 ou 3 volontaires présentent"
    minutes={25}
    feats={
      <Tag tone="navy" size={19}>
        <Icon name="route" size={20} /> agent Chef d’orchestre
      </Tag>
    }
    where={
      <>
        <PathChip>.github/agents/chef-orchestre.agent.md</PathChip>
        <br />
        + architecte, testeur, documentaliste
        <br />
        une PR décrite : code, tests, doc, audit
      </>
    }
    objective={<>Livrer une feature de {PROJECT} en orchestrant vos agents, en gardant la main aux deux décisions : le plan, puis le diff.</>}
    crit={
      <>
        <CheckItem id="tp6-1" size={21}>Délégation par nom, deux points d’arrêt</CheckItem>
        <CheckItem id="tp6-2" size={21}>Plan validé, tests rouges puis verts</CheckItem>
        <CheckItem id="tp6-3" size={21}>Audit du diff fait, failles traitées</CheckItem>
        <CheckItem id="tp6-4" size={21}>Diff des tests relu, PR décrite, CI verte</CheckItem>
      </>
    }
  >
    Écrivez le chef d’orchestre (les autres agents sont dans le Chat), choisissez-le, décrivez la feature :
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M6Feat icon="loop" tone="violet" title="Réservations récurrentes">chaque mardi, avec exceptions</M6Feat>
      <M6Feat icon="clock" tone="yellow" title="Liste d’attente">la salle se libère, le suivant est notifié</M6Feat>
      <M6Feat icon="calendar" tone="teal" title="Export iCal">vos réservations dans votre agenda</M6Feat>
    </div>
    <TpBonus>Lancez la revue en parallèle : Architecte, Testeur et Auditeur relisent votre PR en même temps.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M6_Divider, M6_Conventions, M6_PR, M6_CICD, M6_Orchestrateur, M6_Orchestration, M6_Potentiel, M6_Metrics, M6_Charter, M6_Qcm, M6_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M6 · 15:40

OBJECTIF — Annoncer le module 6 du programme : bonnes pratiques d’intégration en équipe.

DIRE — « Dernier module. Tout ce que vous avez fait aujourd’hui, vous l’avez fait seul, avec un agent à la fois. Comment en faire une pratique d’équipe ? Conventions d’usage, Copilot dans les pull requests et la CI/CD, puis une équipe d’agents orchestrée par un chef d’orchestre, la mesure de la productivité et de la qualité, et une charte d’utilisation responsable. Puis le projet de clôture : une feature livrée par vos agents. »

TRANSITION — « Premier chantier : les conventions. »`,
  `⏱ 3 min · CONVENTIONS

OBJECTIF — Définir des conventions d’usage de Copilot au sein d’une équipe.

DIRE — « Six questions à trancher une fois, par écrit. Quels rôles où : l’agent est-il autorisé partout, ou pas sur le code de paiement ? Quels modèles, avec quel budget ? Quelles données ne partent jamais ? Quelle revue : qui approuve une PR créée par un agent ? Quelle traçabilité ? Et quelle preuve : des tests obligatoires pour tout code généré. Les réponses vont dans le dépôt, pas dans un wiki que personne ne lit : CONTRIBUTING et les fichiers que vous avez écrits aujourd’hui — instructions, skills, agents. »

TRANSITION — « Ce code finit en pull request. »`,
  `⏱ 4 min · PULL REQUEST (5 temps)

OBJECTIF — Intégrer Copilot dans un workflow de pull request et de revue de code.

DIRE — « Tout part d’une issue avec des critères d’acceptation : c’est le meilleur prompt qui soit. »
→ beat 1 « L’agent travaille, en local ou parce que l’issue est assignée à Copilot, qui ouvre lui-même une PR. »
→ beat 2 « La description de PR est générée, puis relue et complétée. »
→ beat 3 « La CI prouve. »
→ beat 4 « Copilot fait une première revue. »
→ beat 5 « Un humain décide. Trois règles : la PR d’un agent est approuvée par quelqu’un d’autre que celui qui l’a demandée ; la revue Copilot lit vos instructions, mettez-y vos points de contrôle ; et au-delà de 400 lignes, la revue humaine décroche. »

TRANSITION — « La CI, justement : Copilot sait l’écrire. »`,
  `⏱ 3 min · CI/CD (4 temps)

OBJECTIF — Copilot et CI/CD : automatiser la génération de scripts et de pipelines.

DIRE — « Copilot écrit du YAML impeccable en apparence. Quatre vérifications. Les permissions : lecture seule par défaut. »
→ beat 1 « Les actions épinglées par SHA, avec une version vérifiée : le modèle propose celles de sa date d’entraînement. »
→ beat 2 « Une installation reproductible. »
→ beat 3 « Des portes de qualité bloquantes. La même démarche vaut pour GitLab, Azure Pipelines, Jenkins, et pour les Dockerfile ou scripts de migration. »

TRANSITION — « Vous avez écrit un agent par TP. Et si on les faisait travailler ensemble ? »`,
  `⏱ 5 min · LE CHEF D’ORCHESTRE (3 temps)

OBJECTIF — Montrer un agent orchestrateur complet : outils, délégation par nom, points d’arrêt humains.

DIRE — « Voici le fichier de votre TP 6. Un agent comme les autres, avec un outil de plus : agent, qui lui permet de solliciter d’autres agents comme sous-agents. Dans le harnais Copilot, il les appelle par leur nom exact, et chaque sous-agent travaille dans son propre contexte : il ne voit que la tâche confiée, et ne renvoie que son résultat. Lisez le corps : un plan d’abord, puis pour chaque lot les tests rouges, le code, l’audit. Le chef d’orchestre code lui-même, mais ne touche jamais aux tests. »
→ beat 1 « Ses quatre équipiers, et leurs droits : l’Architecte et l’Auditeur sont en lecture seule, ils ne peuvent rien casser. Le Testeur n’écrit que dans tests, le Documentaliste que dans la doc. »
→ beat 2 « Et les deux losanges verts : les deux moments où le chef d’orchestre s’arrête et vous rend la main. Le plan, puis le diff. Ce sont les deux lignes en vert dans le fichier : sans elles, l’agent enchaîne tout seul. »
→ beat 3 « Dans le Chat, chaque sous-agent apparaît replié avec son nom : dépliez-le pour voir ce qu’il a lu et rendu. Et si un ancien tutoriel vous fait écrire des handoffs, des boutons de relais : c’est l’ancien harnais Local, le harnais Copilot les ignore. »

TRANSITION — « Voyons-le tourner, sur quatre scénarios. »`,
  `⏱ 5 min · SIMULATION D’ORCHESTRATION (3 temps, animation)

OBJECTIF — Visualiser quatre schémas d’orchestration : relais par lots, éventail parallèle, boucle courte, blocage par un garde-fou.

DIRE — « Premier scénario, une nouvelle fonctionnalité : les réservations récurrentes. Regardez : l’Architecte rend un plan, et le chef d’orchestre s’arrête pour vous. Puis le Testeur, le code, le Refactoreur… et l’Auditeur trouve une faille : une récurrence sans limite crée dix mille réservations. Retour en arrière, test d’exploitation, correctif. Le Documentaliste, et vous relisez le diff. »
→ beat 1 « Deuxième schéma : la revue en parallèle. Trois sous-agents relisent la même PR en même temps, chacun dans son contexte. Le chef d’orchestre fait la synthèse, vous décidez. »
→ beat 2 « Troisième : la boucle courte, un bug en production. Un test qui reproduit, un correctif minimal, un audit rapide. »
→ beat 3 « Quatrième : le garde-fou. L’Auditeur bloque un secret en clair. Et la dernière question — quel coffre-fort en production ? — n’est pas une question pour un agent : c’est une décision humaine. Regardez le compteur de crédits : chaque sous-agent consomme. On n’orchestre pas une correction de faute de frappe. »

ANIMATION — Chaque clic change de scénario et lance la lecture. Boutons Pause, Pas et Réinitialiser à droite ; les onglets sont cliquables.

TRANSITION — « Qu’est-ce qu’on y gagne vraiment ? »`,
  `⏱ 3 min · LE POTENTIEL (2 temps)

OBJECTIF — Expliquer ce que l’orchestration apporte réellement, sans survendre.

DIRE — « En haut, un agent seul : tout dans un seul contexte, une étape après l’autre, une seule validation à la fin. »
→ beat 1 « En bas, une équipe orchestrée : les étapes se chevauchent, lot par lot, et vous validez deux fois, au plan et au diff. Durées illustratives. »
→ beat 2 « Quatre gains, et aucun ne vient d’une intelligence supérieure. La spécialisation : un contexte court et propre par rôle. Le parallélisme. Le contrôle croisé : l’Auditeur n’a pas écrit le code qu’il relit. La traçabilité : chaque relais laisse un artefact relisible. »

TRANSITION — « Tout ça a un coût. Est-ce que ça rapporte ? Il faut mesurer. »`,
  `⏱ 4 min · MESURER (1 temps)

OBJECTIF — Évaluer la productivité et la qualité avec et sans Copilot.

DIRE — « Deux études sérieuses. GitHub, 2022 : 55 % plus rapide sur une tâche isolée, écrire un serveur HTTP. METR, 2025 : seize développeurs expérimentés, sur leurs propres dépôts, 19 % plus lents avec l’IA… alors qu’ils estimaient être 20 % plus rapides. Les deux sont vraies : tout dépend de la tâche, du contexte, de la maturité. La leçon : le ressenti n’est pas une mesure. »
→ beat 1 « Le protocole : métriques fixées avant, tâches comparables, plusieurs semaines. À droite, quoi mesurer : le flux, la qualité, l’expérience — et l’usage, en sachant que le taux d’acceptation dit qu’on utilise l’outil, pas qu’il crée de la valeur. »

TRANSITION — « Dernière brique : la charte. »`,
  `⏱ 4 min · CHARTE (atelier)

OBJECTIF — Construire une charte d’utilisation responsable de l’IA en développement.

DIRE — « Huit engagements, qui reprennent la journée : responsabilité, données, relecture, dépendances, licences, agents, partage, mesure. Chacun compte pour soi ce que son équipe applique réellement aujourd’hui ; je coche à l’écran ce que deux volontaires me disent. Ce qui n’est pas coché alimente votre plan d’action. »

ANIMATION — Demander à deux volontaires, par prénom, leur engagement le plus difficile à tenir. Cocher pour illustrer.

TRANSITION — « QCM, puis le projet de clôture. »`,
  `⏱ 2 min · QCM 6

OBJECTIF — Savoir lire un indicateur d’usage.

DIRE — « Le taux d’acceptation est l’indicateur le plus visible du tableau de bord Copilot, et le plus mal interprété. »

ANIMATION — Vote à voix haute, clic sur la réponse majoritaire, → bonne réponse, → l’essentiel.

TRANSITION — « Projet de clôture. »`,
  `⏱ 25 min (minuteur) · TP 6

OBJECTIF — Projet de clôture du programme : livrer une feature complète (code, tests, documentation, sécurité) en orchestrant des agents, puis la présenter.

DIRE — « TP individuel. Je colle dans le Chat les fichiers de l’Architecte, du Testeur et du Documentaliste ; votre Refactoreur et votre Auditeur existent déjà. Vous écrivez le chef d’orchestre : l’outil agent, la délégation par nom exact, et surtout les deux points d’arrêt — le plan, le diff. Choisissez-le dans la liste des rôles et décrivez une feature parmi les trois. Validez le plan quand il s’arrête. À la fin, relisez le diff des tests avant celui du code, puis la PR. Mieux vaut une feature réduite et prouvée qu’une feature complète et douteuse. À 16:40, deux ou trois volontaires présentent. »

ANIMATION — Coller dans le Chat les trois fichiers d’agents (catalogue du module 4) et le squelette du chef d’orchestre. Lancer le minuteur. Points d’étape à 8, 15 et 22 minutes : « Plan validé ? Premier lot vert ? Audit fait ? » Quelqu’un bloqué partage son écran 2 minutes. Repérer pendant le TP deux ou trois volontaires dont le parcours est intéressant (une faille bloquée, un plan refusé).

TRANSITION — « Place aux présentations. »`,
];
// @@NOTES-END
