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
    sub="Conventions, prompts partagés, pull requests, CI/CD, mesure et charte : passer d’usages individuels à une pratique d’équipe."
    dur="15:40 – 16:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 6 · projet de clôture</Tag>}
  >
    <SecItem n={1}>Des conventions d’usage d’équipe</SecItem>
    <SecItem n={2}>Prompts et templates dans le dépôt</SecItem>
    <SecItem n={3}>Pull requests, revue de code et CI/CD</SecItem>
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

// ─── Partager prompts et templates ──────────────────────────────────────────
const M6_RepoAssets: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Partager prompts et templates via le dépôt</Title>
    <Lede>Ce qui marche pour un développeur devient l’outil de toute l’équipe : versionné, relu en PR, amélioré.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 700, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="layers">.github/</PanelTitle>
      <M2Tree name="copilot-instructions.md" note="stack, arbo, conventions" />
      <M2Tree dir name="instructions/" tone="blue" />
      <M2Tree depth={1} name="tests.instructions.md" note="applyTo **/*.test.*" />
      <M2Tree depth={1} name="security.instructions.md" note="TP 5" />
      <M2Tree dir name="prompts/" tone="green" />
      <M2Tree depth={1} name="new-endpoint.prompt.md" note="/new-endpoint" />
      <M2Tree depth={1} name="security-review.prompt.md" note="grille OWASP" />
      <M2Tree depth={1} name="overlap.prompt.md" note="TP 1" />
      <M2Tree dir name="agents/" tone="violet" />
      <M2Tree depth={1} name="reviewer.agent.md" note="relecteur outillé" />
      <div style={{ marginTop: 10, fontSize: 19, color: C.muted }}>
        <span style={{ fontFamily: mono }}>AGENTS.md</span> à la racine : portable entre outils.
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 880, top: 262, width: 920, ...dl(200) }}>
      <CodeDark file=".github/prompts/new-endpoint.prompt.md" size={20}>
        <Cc>---</Cc>
        {'\n'}
        <Ck>description</Ck>: <Cs>Crée un endpoint REST complet avec ses tests</Cs>
        {'\n'}
        <Ck>agent</Ck>: <Cs>agent</Cs>
        {'\n'}
        <Cc>---</Cc>
        {'\n'}
        Crée l’endpoint <Cn>{'${input:route:ex. GET /rooms/{id}/bookings}'}</Cn>.{'\n'}
        Modèle à suivre : #file:src/api/routes/bookings{'\n'}
        1. Propose le plan (route, validation, service, tests).{'\n'}
        {'   '}Attends ma validation.{'\n'}
        2. Tests d’abord : nominal, limites, négatifs, sécurité.{'\n'}
        3. Implémente jusqu’au vert, puis mets à jour l’OpenAPI.
      </CodeDark>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 880, top: 700, width: 920 }}>
      <Callout title="Dans le chat" tone="green" icon="terminal" size={24}>
        On tape <span style={{ fontFamily: mono }}>/new-endpoint</span> : la méthode de l’équipe, en une commande. Un prompt partagé se relit en PR comme du code.
      </Callout>
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
    <Lede>Huit engagements, à adapter. Cochez ceux que votre équipe applique déjà, réellement.</Lede>
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
    title="Projet de clôture : une feature complète"
    defi="soutenance"
    who="Binôme · 4 min de soutenance"
    minutes={25}
    where={
      <>
        une pull request avec description
        <br />
        code, tests, doc OpenAPI, audit
        <br />
        CI verte
      </>
    }
    objective={<>Développer entièrement avec Copilot une feature de {PROJECT}, puis la présenter et la défendre : code, tests, documentation, sécurité.</>}
    crit={
      <>
        <CheckItem id="tp6-1" size={21}>Plan et prompt d’équipe utilisés</CheckItem>
        <CheckItem id="tp6-2" size={21}>Matrice de cas et tests au vert</CheckItem>
        <CheckItem id="tp6-3" size={21}>Revue OWASP faite, failles traitées</CheckItem>
        <CheckItem id="tp6-4" size={21}>PR décrite, CI verte</CheckItem>
      </>
    }
  >
    Choisissez une feature :
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M6Feat icon="loop" tone="violet" title="Réservations récurrentes">chaque mardi, avec exceptions</M6Feat>
      <M6Feat icon="clock" tone="yellow" title="Liste d’attente">la salle se libère, le suivant est notifié</M6Feat>
      <M6Feat icon="calendar" tone="teal" title="Export iCal">vos réservations dans votre agenda</M6Feat>
    </div>
    <TpBonus>Passez la PR à la revue Copilot avant la soutenance, et montrez ce que vous avez accepté ou refusé.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M6_Divider, M6_Conventions, M6_RepoAssets, M6_PR, M6_CICD, M6_Metrics, M6_Charter, M6_Qcm, M6_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M6 · 15:40

OBJECTIF — Annoncer le module 6 du programme : bonnes pratiques d’intégration en équipe.

DIRE — « Dernier module. Tout ce que vous avez fait aujourd’hui, vous l’avez fait seul ou en binôme. Comment en faire une pratique d’équipe ? Conventions d’usage, prompts et templates partagés dans le dépôt, Copilot dans les pull requests et la revue de code, dans la CI/CD, la mesure de la productivité et de la qualité, et une charte d’utilisation responsable. Puis le projet de clôture. »

TRANSITION — « Premier chantier : les conventions. »`,
  `⏱ 3 min · CONVENTIONS

OBJECTIF — Définir des conventions d’usage de Copilot au sein d’une équipe.

DIRE — « Six questions à trancher une fois, par écrit. Quels modes où : l’agent est-il autorisé partout, ou pas sur le code de paiement ? Quels modèles, avec quel budget ? Quelles données ne partent jamais ? Quelle revue : qui approuve une PR créée par un agent ? Quelle traçabilité ? Et quelle preuve : des tests obligatoires pour tout code généré. Les réponses vont dans le dépôt, pas dans un wiki que personne ne lit : CONTRIBUTING et les instructions Copilot. »

TRANSITION — « Le dépôt est aussi l’endroit où partager ce qui marche. »`,
  `⏱ 4 min · PROMPTS PARTAGÉS (1 temps)

OBJECTIF — Partager des prompts et templates efficaces via le dépôt de projet.

DIRE — « Le dossier .github devient la boîte à outils de l’équipe. Les instructions globales, les instructions par chemin — dont celle de sécurité du TP 5 —, les fichiers de prompt — dont celui du TP 1 —, et des agents personnalisés, comme un relecteur. À droite, un fichier de prompt : une description, l’agent à utiliser, une variable de saisie, et la méthode de la journée en trois étapes. » → clic. « Dans le chat, on tape /new-endpoint : toute la méthode en une commande. Et un prompt partagé se relit en PR comme du code. »

ANIMATION — Les noms de champs de l’en-tête évoluent selon les versions de VS Code : vérifier la documentation.

TRANSITION — « Ce code finit en pull request. »`,
  `⏱ 4 min · PULL REQUEST (5 temps)

OBJECTIF — Intégrer Copilot dans un workflow de pull request et de revue de code.

DIRE — « Tout part d’une issue avec des critères d’acceptation : c’est le meilleur prompt qui soit. » → clic. « L’agent travaille, en local ou parce que l’issue est assignée à Copilot, qui ouvre lui-même une PR. » → clic. « La description de PR est générée, puis relue et complétée. » → clic. « La CI prouve. » → clic. « Copilot fait une première revue. » → clic. « Un humain décide. Trois règles : la PR d’un agent est approuvée par quelqu’un d’autre que celui qui l’a demandée ; la revue Copilot lit vos instructions, mettez-y vos points de contrôle ; et au-delà de 400 lignes, la revue humaine décroche. »

TRANSITION — « La CI, justement : Copilot sait l’écrire. »`,
  `⏱ 3 min · CI/CD (4 temps)

OBJECTIF — Copilot et CI/CD : automatiser la génération de scripts et de pipelines.

DIRE — « Copilot écrit du YAML impeccable en apparence. Quatre vérifications. Les permissions : lecture seule par défaut. » → clic. « Les actions épinglées par SHA, avec une version vérifiée : le modèle propose celles de sa date d’entraînement. » → clic. « Une installation reproductible. » → clic. « Des portes de qualité bloquantes. La même démarche vaut pour GitLab, Azure Pipelines, Jenkins, et pour les Dockerfile ou scripts de migration. »

TRANSITION — « Tout ça a un coût. Est-ce que ça rapporte ? »`,
  `⏱ 4 min · MESURER (1 temps)

OBJECTIF — Évaluer la productivité et la qualité avec et sans Copilot.

DIRE — « Deux études sérieuses. GitHub, 2022 : 55 % plus rapide sur une tâche isolée, écrire un serveur HTTP. METR, 2025 : seize développeurs expérimentés, sur leurs propres dépôts, 19 % plus lents avec l’IA… alors qu’ils estimaient être 20 % plus rapides. Les deux sont vraies : tout dépend de la tâche, du contexte, de la maturité. La leçon : le ressenti n’est pas une mesure. » → clic. « Le protocole : métriques fixées avant, tâches comparables, plusieurs semaines. À droite, quoi mesurer : le flux, la qualité, l’expérience — et l’usage, en sachant que le taux d’acceptation dit qu’on utilise l’outil, pas qu’il crée de la valeur. »

TRANSITION — « Dernière brique : la charte. »`,
  `⏱ 4 min · CHARTE (atelier)

OBJECTIF — Construire une charte d’utilisation responsable de l’IA en développement.

DIRE — « Huit engagements, qui reprennent la journée : responsabilité, données, relecture, dépendances, licences, agents, partage, mesure. Cochez ce que votre équipe applique réellement aujourd’hui. Ce qui n’est pas coché alimente votre plan d’action. »

ANIMATION — Faire cocher par un volontaire. Demander quel engagement manque le plus dans les équipes présentes.

TRANSITION — « QCM, puis le projet de clôture. »`,
  `⏱ 2 min · QCM 6

OBJECTIF — Savoir lire un indicateur d’usage.

DIRE — « Le taux d’acceptation est l’indicateur le plus visible du tableau de bord Copilot, et le plus mal interprété. »

TRANSITION — « Projet de clôture. »`,
  `⏱ 25 min (minuteur) + soutenances · TP 6

OBJECTIF — Projet de clôture du programme : présenter et défendre une feature complète (code, tests, documentation, sécurité) développée entièrement avec Copilot.

DIRE — « Une feature au choix. Appliquez tout : le plan, le prompt d’équipe, la matrice de cas, les tests, la revue de sécurité, la PR décrite, la CI. À 16:30, chaque binôme a quatre minutes : la démo, une preuve par critère, et un moment où vous avez refusé une proposition de Copilot — et pourquoi. »

ANIMATION — Minuteur. À 15 minutes, rappeler que la soutenance compte plus que l’exhaustivité : mieux vaut une feature réduite et prouvée.

TRANSITION — « Place aux soutenances. »`,
];
// @@NOTES-END
