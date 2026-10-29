// ─── M5 · Test pyramid ──────────────────────────────────────────────────────
const PyrLevel = ({ n, w, y, tone, title, ai }: { n: number; w: number; y: number; tone: Tone; title: string; ai: string }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: 120 + (900 - w) / 2, top: y, width: w, height: 150, boxSizing: 'border-box', background: STRONG[tone], borderRadius: 14, color: tone === 'yellow' ? C.ink : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34 }}>{title}</div>
    <div style={{ fontSize: 21, opacity: 0.92 }}>{ai}</div>
  </div>
);

const M5_Pyramid: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Quels tests demander à l’IA ?</Title>
    <Lede>Beaucoup de tests unitaires rapides, moins de tests d’intégration, quelques scénarios de bout en bout.</Lede>
    <PyrLevel n={3} w={420} y={290} tone="yellow" title="Bout en bout · charge" ai="scénarios, données réalistes, scripts de charge" />
    <PyrLevel n={2} w={660} y={460} tone="teal" title="Intégration" ai="vrais composants : API, base, fichiers" />
    <PyrLevel n={1} w={900} y={630} tone="blue" title="Unitaires" ai="cas nominaux, limites, erreurs : l’IA excelle ici" />
    <div style={{ position: 'absolute', left: 1100, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={b.on(1)} tone="green" icon="check" title="L’IA est très bonne pour…" size={23}>
        Énumérer les cas limites, écrire des tests paramétrés, fabriquer des données de test, écrire les fixtures.
      </Card>
      <Card cls={b.on(4)} tone="coral" icon="alert" title="… mais attention à" size={23}>
        Des tests qui exécutent sans vérifier, des attendus recalculés avec la même formule que le code, des tests liés entre eux.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · Behaviours first, then code ───────────────────────────────────────
const M5_Behaviours: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>D’abord la liste des comportements, ensuite le code</Title>
    <Lede>Les tests générés d’un coup couvrent ce que le code fait, pas ce qu’il devrait faire.</Lede>
    <PromptBox cls={A.in} size={23} style={{ position: 'absolute', left: 120, top: 270, width: 800, ...dl(100) }}>
      Liste les comportements de la classe Panier à tester : cas nominaux, valeurs limites, erreurs. Un comportement par ligne, sans code.
    </PromptBox>
    <AnswerBox cls={b.on(1)} id="copilot" size={21} style={{ position: 'absolute', left: 120, top: 470, width: 800 }}>
      1. Ajouter cumule les quantités du même article
      <br />
      2. Quantité 0 ou négative → ValueError
      <br />
      3. Maximum 99 par article (99 accepté, 100 refusé)
      <br />
      4. Stock exact accepté, stock + 1 refusé, panier inchangé
      <br />
      5. MOINS10 : 10 % du sous-total ; code insensible à la casse
      <br />
      6. Livraison gratuite <b>exactement</b> à 50,00 $
      <br />
      7. Le rabais peut faire perdre la livraison gratuite
    </AnswerBox>
    <CodeDark cls={b.on(2)} file="test_panier.py" lang="python" size={20} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <Fn>@pytest.fixture</Fn>
      {'\n'}
      <Kw>def</Kw> <Fn>souris</Fn>():{'\n'}
      {'    '}
      <Kw>return</Kw> Produit(<St>"MS-02"</St>, <St>"Souris"</St>, <Nu>1_500</Nu>, stock=<Nu>3</Nu>){'\n'}
      {'\n'}
      <Fn>@pytest.mark.parametrize</Fn>(<St>"quantite"</St>, [<Nu>0</Nu>, <Nu>-1</Nu>]){'\n'}
      <Kw>def</Kw> <Fn>test_quantite_invalide</Fn>(panier, souris, quantite):{'\n'}
      {'    '}
      <Kw>with</Kw> pytest.raises(<Ty>ValueError</Ty>):{'\n'}
      {'        '}panier.ajouter(souris, quantite){'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>test_stock_insuffisant</Fn>(panier, souris):{'\n'}
      {'    '}panier.ajouter(souris, <Nu>3</Nu>){'\n'}
      {'    '}
      <Kw>with</Kw> pytest.raises(<Ty>StockInsuffisant</Ty>):{'\n'}
      {'        '}panier.ajouter(souris){'\n'}
      <Ln kind="hl">
        {'    '}
        <Kw>assert</Kw> panier.lignes == {'{'}
        <St>"MS-02"</St>: <Nu>3</Nu>
        {'}'}
        {'  '}
        <Cm># inchangé</Cm>
      </Ln>
    </CodeDark>
  </Frame>
);

// ─── M5 · Coverage vs mutation ──────────────────────────────────────────────
const M5_Mutation: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>100 % de couverture ne veut pas dire « bien testé »</Title>
    <Lede>La couverture mesure ce qui s’exécute. Le test de mutation mesure ce qui est vérifié.</Lede>
    <CodeDark cls={A.in} file="panier.py · mutant n° 7" lang="python" size={22} style={{ position: 'absolute', left: 120, top: 280, width: 900, ...dl(100) }}>
      <Kw>def</Kw> <Fn>livraison</Fn>(self) -&gt; <Ty>int</Ty>:{'\n'}
      {'    '}…{'\n'}
      <Ln kind="del">
        {'    '}
        <Kw>if</Kw> self.sous_total() - self.rabais() &gt;= SEUIL:
      </Ln>
      <Ln kind="add">
        {'    '}
        <Kw>if</Kw> self.sous_total() - self.rabais() &gt; SEUIL:
      </Ln>
      {'        '}
      <Kw>return</Kw> <Nu>0</Nu>
      {'\n'}
      {'    '}
      <Kw>return</Kw> FRAIS_LIVRAISON
    </CodeDark>
    <Term cls={b.on(1)} title="python mutants.py" size={21} style={{ position: 'absolute', left: 120, top: 580, width: 900 }}>
      {'  '}
      <Ok>tué      </Ok> quantité 0 acceptée{'\n'}
      {'  '}
      <Ok>tué      </Ok> rabais de 1 %{'\n'}
      {'  '}
      <Ko>SURVIVANT</Ko> seuil de livraison strict{'\n'}
      {'\n'}
      Score de mutation : <Ko>5/8</Ko>
      {'   '}couverture : <Ok>100 %</Ok>
    </Term>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={b.on(2)} tone="violet" icon="bug" title="Le principe" size={23}>
        On introduit un petit bogue (un mutant). Si aucun test n’échoue, le mutant « survit » : ce comportement n’est pas vérifié.
      </Card>
      <Card cls={b.on(3)} tone="green" icon="sparkles" title="Avec l’IA" size={23}>
        Pour chaque survivant : « Écris le test qui tue ce mutant. » Ici : un panier à exactement 50,00 $.
      </Card>
      <Hint cls={b.on(3)}>Outils : mutmut (Python), Stryker (JS/TS, Java, C#). Le lab 08 en fournit un simplifié.</Hint>
    </div>
  </Frame>
);

// ─── M5 · Test smells ───────────────────────────────────────────────────────
const M5_Smells: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Ce test généré est-il utile ?</Title>
    <Lede>Votez pour chaque carte : utile ou pas ? Puis je la retourne.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 405px)', columnGap: 20, ...dl(100) }}>
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="coral"
        front={<div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'def test_panier():\n    p = Panier()\n    p.ajouter(CLAVIER)\n    assert p is not None'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Inutile.</b> Il exécute le code sans rien vérifier. Couverture en hausse, protection nulle.</div>}
      />
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="coral"
        front={<div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'def test_rabais():\n    ...\n    attendu = (\n      p.sous_total() // 10)\n    assert p.rabais() == attendu'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Tautologique.</b> L’attendu recopie la formule du code : si la formule est fausse, le test aussi. Écrivez 999.</div>}
      />
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="green"
        front={<div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'def test_livraison_\n    gratuite_au_seuil(p):\n    p.ajouter(SUPPORT_50)\n    assert p.livraison() == 0'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Utile.</b> Une valeur limite exacte, un nom qui dit la règle, une seule vérification claire.</div>}
      />
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="coral"
        front={<div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'PANIER = Panier()\n\ndef test_1():\n    PANIER.ajouter(A)\n\ndef test_2():\n    assert PANIER.total()\n      == 4999'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Fragile.</b> test_2 dépend de test_1 : l’ordre ou l’exécution seule le casse. Une fixture par test.</div>}
      />
    </div>
  </Frame>
);

// ─── Lab 08 ─────────────────────────────────────────────────────────────────
const L08_Brief: Page = () => (
  <LabBrief
    mod={5}
    n="08"
    title="Des tests unitaires qui servent vraiment"
    dur="30 min"
    folder="lab08-tests"
    objective="Faire générer une suite de tests, puis la juger avec deux mesures objectives : la couverture des branches et le score de mutation."
    cmd={
      <>
        <Pr>pytest … --cov=panier --cov-branch</Pr>
        {'\n'}
        <Pr>python …/mutants.py</Pr>
        {'\n'}
        Score de mutation : <Ko>1/8</Ko>
        {'\n'}
        <Pr>npm run cov:lab08</Pr>
      </>
    }
    deliverable="Couverture des branches ≥ 95 %, score de mutation 8/8, tous les tests verts en moins d’une seconde."
  >
    <LabStep n={1} t="5 min" title="Lister les comportements">
      Sans code ; ajoutez celui que l’IA a oublié
    </LabStep>
    <LabStep n={2} t="10 min" title="Générer">
      Fixtures, tests paramétrés, noms en phrases
    </LabStep>
    <LabStep n={3} t="5 min" title="Mesurer">
      Couverture, puis mutants ; un test par survivant
    </LabStep>
    <LabStep n={4} t="5 min" title="Relire">
      Supprimez les tests qui ne vérifient rien
    </LabStep>
    <LabStep n={5} t="5 min" title="Valeurs limites">
      99 articles, 50,00 $, stock exact
    </LabStep>
  </LabBrief>
);

const L08_Go: Page = () => (
  <LabGo mod={5} n="08" minutes={30} folder="lab08-tests">
    <CheckItem id="l08-1">Liste de comportements, complétée par vous</CheckItem>
    <CheckItem id="l08-2">Suite générée : fixtures, paramétrage</CheckItem>
    <CheckItem id="l08-3">Couverture des branches ≥ 95 %</CheckItem>
    <CheckItem id="l08-4">Score de mutation 8/8</CheckItem>
    <CheckItem id="l08-5">Aucun test tautologique ni dépendant d’un autre</CheckItem>
  </LabGo>
);

// ─── M5 · Integration tests ─────────────────────────────────────────────────
const M5_Integration: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Tests d’intégration : de vrais composants, de vrais échanges</Title>
    <Lede>Un vrai serveur HTTP, une vraie base de test, un port choisi par le système. L’IA écrit les scénarios.</Lede>
    <CodeDark cls={A.in} file="test_integration.py" lang="python" size={21} style={{ position: 'absolute', left: 120, top: 270, width: 960, ...dl(100) }}>
      <Fn>@pytest.fixture</Fn>(scope=<St>"module"</St>){'\n'}
      <Kw>def</Kw> <Fn>serveur</Fn>():{'\n'}
      {'    '}srv = creer_serveur(){'  '}
      <Cm># port 0 : un port libre</Cm>
      {'\n'}
      {'    '}threading.Thread(target=srv.serve_forever, daemon=<Kw>True</Kw>).start(){'\n'}
      {'    '}
      <Kw>yield</Kw> <St>f"http://127.0.0.1:</St>
      {'{'}srv.server_address[<Nu>1</Nu>]{'}'}
      <St>"</St>
      {'\n'}
      {'    '}srv.shutdown(){'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>test_creer_puis_suivre_un_lien</Fn>(serveur):{'\n'}
      {'    '}code = creer(serveur, <St>"https://exemple.ca/page"</St>){'\n'}
      {'    '}statut, entetes, _ = requete(serveur, <St>"GET"</St>, <St>f"/l/</St>
      {'{'}code{'}'}
      <St>"</St>){'\n'}
      {'    '}
      <Kw>assert</Kw> statut == <Nu>302</Nu>
      {'\n'}
      {'    '}
      <Kw>assert</Kw> entetes[<St>"Location"</St>] == <St>"https://exemple.ca/page"</St>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1140, top: 270, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(1)} tone="teal" icon="list" title="Scénarios à demander" size={22}>
        Nominal de bout en bout · erreurs 4xx (entrée invalide, introuvable) · concurrence (200 créations, codes uniques) · données limites.
      </Card>
      <Card cls={b.on(2)} tone="coral" icon="alert" title="Faux tests d’intégration" size={22}>
        Appeler les fonctions en mémoire, simuler (mock) tout ce qui compte, port fixe 8009 : échecs aléatoires en CI.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · Load testing ──────────────────────────────────────────────────────
const LatBar = ({ label, ms, max, tone, n }: { label: string; ms: number; max: number; tone: Tone; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 58 }}>
    <span style={{ width: 70, fontFamily: mono, fontSize: 23, color: C.ink }}>{label}</span>
    <div style={{ flex: 1, height: 36, background: C.panel, borderRadius: 8 }}>
      <div className={b.grow(n)} style={{ width: `${(ms / max) * 100}%`, height: '100%', background: STRONG[tone], borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 110, fontFamily: mono, fontSize: 23, color: C.ink }}>
      {fr(ms, 1)} ms
    </span>
  </div>
);

const M5_Load: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Simuler des scénarios et tester la charge</Title>
    <Lede>L’IA écrit le script de charge et interprète les chiffres. L’objectif de service, c’est vous qui le fixez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 960 }}>
      <Term cls={A.in} title="python charge.py 2000 20" size={20} style={dl(100)}>
        2000 requêtes · 20 utilisateurs · 3.1 s · 653 req/s{'\n'}
        erreurs  0.10%{'\n'}
        Objectif de service : <Ok>respecté</Ok>
      </Term>
      <Eyebrow c={C.muted} style={{ marginTop: 28 }}>
        Latences mesurées (API du lab 09)
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <LatBar label="p50" ms={7.2} max={528} tone="green" n={1} />
        <LatBar label="p95" ms={9.6} max={528} tone="green" n={1} />
        <LatBar label="p99" ms={528.2} max={528} tone="coral" n={2} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 270, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.in} tone="blue" icon="target" title="Objectif de service" size={22} style={dl(200)}>
        p95 &lt; 50 ms et moins de 1 % d’erreurs, avec 80 % de lectures : écrit avant le test.
      </Card>
      <Card cls={b.on(2)} tone="yellow" icon="bulb" title="Lire les percentiles" size={22}>
        La moyenne ment : 1 requête sur 100 attend plus d’une demi-seconde. Demandez à l’IA pourquoi (file d’attente, verrou…).
      </Card>
      <Card cls={b.on(3)} tone="violet" icon="tool" title="Outils" size={22}>
        k6, Locust, JMeter, Gatling : l’IA traduit votre scénario dans leur langage.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · CI/CD pipeline ────────────────────────────────────────────────────
const PipeStage = ({ n, x, icon, tone, title, sub }: { n: number; x: number; icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: 300, width: 240, height: 210, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 20px', textAlign: 'center' }}>
    <IconTile name={icon} tone={tone} size={60} style={{ margin: '0 auto' }} />
    <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 20, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M5_Pipeline: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>Intégrer les tests au pipeline CI/CD</Title>
    <Lede>À chaque push et chaque pull request, tout se rejoue. Une PR rouge ne se fusionne pas.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <line x1={180} y1={405} x2={1740} y2={405} stroke={C.rule} strokeWidth={5} strokeDasharray="10 12" className={A.march} />
    </svg>
    <PipeStage n={1} x={120} icon="code" tone="blue" title="Push / PR" sub="déclencheur" />
    <PipeStage n={2} x={408} icon="search" tone="teal" title="Lint" sub="ruff, ESLint" />
    <PipeStage n={3} x={696} icon="check" tone="green" title="Tests" sub="matrice de versions" />
    <PipeStage n={4} x={984} icon="gauge" tone="violet" title="Couverture" sub="seuil : 80 %" />
    <PipeStage n={5} x={1272} icon="shield" tone="coral" title="Sécurité" sub="audit, CodeQL" />
    <PipeStage n={6} x={1560} icon="rocket" tone="yellow" title="Déploiement" sub="si tout est vert" />
    <CodeDark cls={b.on(6)} file=".github/workflows/ci.yml" lang="yaml" size={19} style={{ position: 'absolute', left: 120, top: 560, width: 1000 }}>
      <Kw>on</Kw>: {'{'} push: {'{'} branches: [main] {'}'}, pull_request: {'{}'} {'}'}
      {'\n'}
      <Kw>jobs</Kw>:{'\n'}
      {'  '}python:{'\n'}
      {'    '}strategy: {'{'} matrix: {'{'} python-version: [<St>"3.11"</St>, <St>"3.13"</St>] {'}'} {'}'}
      {'\n'}
      {'    '}steps:{'\n'}
      {'      '}- uses: actions/setup-python@v5{'  '}
      <Cm># avec cache: pip</Cm>
      {'\n'}
      {'      '}- run: ruff check labs/lab09-ci{'\n'}
      {'      '}- run: pytest --cov=api --cov-fail-under=<Nu>80</Nu>
    </CodeDark>
    <Callout cls={b.on(6)} title="Avec l’IA" tone="blue" icon="sparkles" size={23} style={{ position: 'absolute', left: 1180, top: 560, width: 620 }}>
      Elle écrit le YAML et explique un job rouge à partir du journal. Vérifiez chaque action et version sur sa page officielle : elle en invente.
    </Callout>
  </Frame>
);

// ─── Lab 09 ─────────────────────────────────────────────────────────────────
const L09_Brief: Page = () => (
  <LabBrief
    mod={5}
    n="09"
    title="Intégration, charge et pipeline CI/CD"
    dur="35 min"
    folder="lab09-ci"
    objective="Écrire avec l’IA des tests d’intégration sur une vraie API, simuler une charge avec un objectif de service, et brancher le tout dans GitHub Actions."
    cmd={
      <>
        <Pr>pytest labs/lab09-ci</Pr>
        {'\n'}
        <Ok>12 passed</Ok>, <Ko>6 failed</Ko>
        {'  '}
        <Cm>ci.yml</Cm>
        {'\n'}
        <Pr>python …/charge.py</Pr>
      </>
    }
    deliverable="Tests d’intégration verts (couverture ≥ 80 %), ci.yml conforme et vert sur GitHub, une phrase sur l’objectif de service."
  >
    <LabStep n={1} t="10 min" title="Scénarios d’intégration">
      Au moins 6, dont 200 créations concurrentes
    </LabStep>
    <LabStep n={2} t="7 min" title="Charge">
      charge.py, puis 5 000 requêtes et 100 utilisateurs : faites interpréter
    </LabStep>
    <LabStep n={3} t="12 min" title="Pipeline">
      ci-a-completer.yml → .github/workflows/ci.yml : les 6 TODO
    </LabStep>
    <LabStep n={4} t="6 min" title="Le voir bloquer">
      Poussez, puis une PR qui casse un test : le pipeline passe au rouge
    </LabStep>
  </LabBrief>
);

const L09_Go: Page = () => (
  <LabGo mod={5} n="09" minutes={35} folder="lab09-ci">
    <CheckItem id="l09-1">6 scénarios d’intégration, dont la concurrence</CheckItem>
    <CheckItem id="l09-2">Couverture de l’API ≥ 80 %</CheckItem>
    <CheckItem id="l09-3">Charge mesurée et interprétée</CheckItem>
    <CheckItem id="l09-4">ci.yml : test_workflow vert, exécution verte sur GitHub</CheckItem>
    <CheckItem id="l09-5">PR fautive bloquée par le pipeline</CheckItem>
  </LabGo>
);

// ─── M5 · Quiz ──────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="L’agent a fait passer les tests"
    q="Votre agent annonce : « Les 42 tests passent. » Vous regardez le diff. Que vérifiez-vous en premier ?"
    explain="Un agent qui doit « faire passer les tests » peut modifier les tests eux-mêmes, en supprimer, ou les marquer comme ignorés. Le diff des fichiers de test se relit en premier."
  >
    <Opt why="Utile, mais secondaire : la vitesse ne dit rien de la justesse.">Que les tests s’exécutent en moins d’une seconde</Opt>
    <Opt ok why="Oui : un assert affaibli, un @skip, un attendu modifié, et le vert ne prouve plus rien.">
      Qu’il n’a pas modifié, ignoré ou supprimé de tests
    </Opt>
    <Opt why="Le style compte moins que la validité des tests : ruff le vérifie de toute façon.">Que le code respecte le style de l’équipe</Opt>
    <Opt why="Le nombre de tests ne mesure pas leur qualité : relisez ce qu’ils vérifient.">Qu’il a ajouté au moins 10 nouveaux tests</Opt>
  </QcmPage>
);

// ─── M5 · Synthesis ─────────────────────────────────────────────────────────
const M5_Synth: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={<>Sur votre module le moins testé : liste de comportements par l’IA, tests générés, puis un outil de mutation. Et une règle dans votre CI : seuil de couverture et PR rouge non fusionnable.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Lister les comportements avant d’écrire les tests
    </SynthRow>
    <SynthRow n={2} tone="violet" d={200}>
      La mutation mesure ce que la couverture ne mesure pas
    </SynthRow>
    <SynthRow n={3} tone="teal" d={300}>
      Intégration : vrais composants, port libre, concurrence
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={400}>
      Charge : objectif de service fixé avant, percentiles lus après
    </SynthRow>
    <SynthRow n={5} tone="green" d={500}>
      CI : tout se rejoue à chaque PR ; on relit le diff des tests
    </SynthRow>
  </SynthPage>
);

// ─── Module 6 divider ───────────────────────────────────────────────────────
const M6_Divider: Page = () => (
  <Section n={6} title="IA pour la planification et l’architecture logicielle" sub="Un partenaire pour concevoir, estimer, planifier et anticiper les risques." dur="≈ 1 h">
    <SecItem n={1}>Aide à la conception d’architectures logicielles</SecItem>
    <SecItem n={2}>Estimation des tâches et planification agile</SecItem>
    <SecItem n={3}>Gestion des dépendances et des risques</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M5_Pyramid, M5_Behaviours, M5_Mutation, M5_Smells, L08_Brief, L08_Go, M5_Integration, M5_Load, M5_Pipeline, L09_Brief, L09_Go, M5_Quiz, M5_Synth, M6_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · 4 CLICS

OBJECTIF — Situer les tests que l'IA écrit bien.

→ beat 1 : « La base : les tests unitaires. Énumérer les cas limites, écrire des tests paramétrés, fabriquer des données : l'IA excelle. »
→ beat 2 : « L'intégration : de vrais composants qui se parlent. L'IA écrit bien les scénarios, si on lui donne la fixture. »
→ beat 3 : « Au sommet : bout en bout et charge. Moins nombreux, plus lents. L'IA écrit les scripts et les données réalistes. »
→ beat 4 : « Attention : des tests qui exécutent sans vérifier, des attendus recalculés avec la formule du code, des tests liés entre eux. On les voit dans deux pages. »

TRANSITION — « Comment obtenir de bons tests unitaires ? »`,
  `⏱ 4 min · DÉMO · 2 CLICS

DÉMO — Dans le chat, sur labs/lab08-tests/python/panier.py.
DIRE — « Je ne demande pas de tests. Je demande d'abord la liste des comportements. »
→ beat 1 : la liste. « Regardez : "exactement à 50,00 $", "stock exact accepté, stock + 1 refusé" : des valeurs limites. Et j'ajoute ce qu'il a oublié : le code LIVRAISON. »
→ beat 2 : les tests générés. « Fixtures, parametrize, et la ligne surlignée : il vérifie que le panier est inchangé après un refus. C'est le genre de vérification qu'on oublie. »

TRANSITION — « Comment savoir si une suite de tests est bonne ? »`,
  `⏱ 4 min · 3 CLICS

OBJECTIF — Faire comprendre le test de mutation.

DIRE — « Mutant n° 7 : on remplace >= par >. Un bogue d'une lettre. »
→ beat 1 : « Le script relance les tests sur chaque mutant. Celui-ci survit : aucun test n'échoue. Et pourtant la couverture est à 100 % ! »
→ beat 2 : « Le principe : si un bogue peut être introduit sans qu'aucun test échoue, ce comportement n'est pas vérifié. »
→ beat 3 : « Avec l'IA : pour chaque survivant, "écris le test qui tue ce mutant". Ici, un panier à exactement 50,00 $. »

OUTILS — mutmut en Python, Stryker pour JavaScript/TypeScript, Java, C#. Le lab 08 en contient un simplifié, en 50 lignes.

TRANSITION — « Testons votre œil. »`,
  `⏱ 5 min · EXERCICE · CARTES

ANIMATION — Pour chaque carte : « Utile ou pas ? » Votes au micro (un mot), puis cliquez pour retourner.

RÉPONSES — 1 inutile (n'assert rien d'utile), 2 tautologique, 3 utile, 4 fragile (dépendance entre tests).

MESSAGE — « Les 4 défauts les plus fréquents des tests générés. Les cartes 1 et 2 font monter la couverture sans tuer aucun mutant. »

TRANSITION — « Lab 08. »`,
  `⏱ 1 min · CONSIGNE DU LAB 08

DIRE — « Lab 08, labs/lab08-tests. Un panier d'achat sans tests. Deux mesures objectives : couverture des branches au moins 95 %, et score de mutation 8 sur 8. Au départ : 1 sur 8. »
« Commencez par la liste des comportements, pas par le code. »

TRANSITION — « 30 minutes. »`,
  `⏱ 30 min · LAB 08 EN AUTONOMIE

ANIMATION — Points d'étape à 10 et 20 minutes : « Quel score de mutation ? »

INDICES —
• Mutant « maximum 99 décalé » : ajouter exactement 99 doit passer.
• « retrait partiel faux » : retirer exactement la quantité présente supprime la ligne.
• « livraison facturée au panier vide » : panier vide → livraison 0.
• « code sensible à la casse » : appliquer_code("moins10").

DÉBRIEF (3 min) — « Couverture à 100 % et combien de mutants survivants avant vos ajouts ? » Recueillez 2 ou 3 chiffres.`,
  `⏱ 3 min · 2 CLICS

OBJECTIF — Tests d'intégration (programme).

DIRE — « Le lab 09 contient une petite API de liens courts. La fixture démarre un vrai serveur HTTP sur un port choisi par le système, le port 0. Le test fait de vraies requêtes et vérifie la redirection 302. »
→ beat 1 : les scénarios à demander, dont la concurrence.
→ beat 2 : « Les faux tests d'intégration : appeler les fonctions en mémoire, ou tout simuler. Et le port fixe : deux jobs CI en parallèle, et c'est l'échec aléatoire. »

TRANSITION — « Et sous la charge ? »`,
  `⏱ 4 min · 3 CLICS

OBJECTIF — Simulation de scénarios et tests de charge (programme).

DIRE — « Le script charge.py du lab 09 : 2 000 requêtes, 20 utilisateurs simultanés, 80 % de lectures. Objectif de service, fixé avant : p95 sous 50 ms, moins de 1 % d'erreurs. »
→ beat 1 : « p50 : 7 ms, p95 : 10 ms. Respecté. »
→ beat 2 : « Mais p99 : plus d'une demi-seconde ! La moyenne ne le montre pas. Une requête sur cent attend. Pourquoi ? Faites-le interpréter par l'IA : file d'attente du serveur, verrou, ramasse-miettes. »
→ beat 3 : « En vrai projet : k6, Locust, JMeter, Gatling. L'IA traduit votre scénario dans leur format. »

Chiffres mesurés pendant la préparation ; ils varient selon le poste.

TRANSITION — « Tout cela doit tourner à chaque PR. »`,
  `⏱ 4 min · 6 CLICS

OBJECTIF — Intégration CI/CD (programme).

→ beats 1 à 6 : les étapes du pipeline apparaissent : déclencheur, lint, tests avec matrice de versions, couverture avec seuil, sécurité (audit des dépendances, CodeQL), déploiement si tout est vert.
Au beat 6 : le YAML. « C'est le corrigé du lab 09, en résumé. »

AVEC L'IA — « Elle écrit très bien le YAML et explique un job rouge à partir du journal. Mais elle invente des versions d'actions et des options : vérifiez sur la page officielle de l'action. »

TRANSITION — « Lab 09. »`,
  `⏱ 2 min · CONSIGNE DU LAB 09

DIRE — « Lab 09, labs/lab09-ci. Trois parties : tests d'intégration sur la vraie API, test de charge, pipeline GitHub Actions. Le fichier ci-a-completer.yml a 6 TODO ; test_workflow.py vérifie votre pipeline. »
« Étape 4 : sur votre fork, ouvrez une PR qui casse un test, par exemple LONGUEUR_CODE = 5, et regardez le pipeline passer au rouge. »

PRÉREQUIS — Les Actions doivent être activées sur le fork (onglet Actions, bouton « I understand… enable »).

TRANSITION — « 35 minutes, jusqu'au dîner. »`,
  `⏱ 35 min · LAB 09 EN AUTONOMIE

ANIMATION — Points d'étape à 12 et 25 minutes : « Partie 1, 2 ou 3 ? »

BLOCAGES FRÉQUENTS —
• Actions désactivées sur un fork : onglet Actions, les activer.
• test_workflow : il cherche « --cov-fail-under » et au moins deux versions 3.1x dans la matrice.
• Pas de droit de pousser sur GitHub depuis le poste d'entreprise : valider seulement test_workflow en local.

DÉBRIEF (3 min) — « Qui a vu son pipeline bloquer la PR fautive ? »`,
  `⏱ 2 min · QCM

RÉPONSE — B. C'est le piège n° 1 des agents : modifier, ignorer (@skip) ou supprimer un test pour atteindre le vert. Le diff des fichiers de test se relit en premier.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 5

DIRE — Lire les cinq points. Encadré : « Votre module le moins testé : liste de comportements, tests générés, un outil de mutation. Vous serez surpris. »

⏸ DÎNER 12 h – 13 h 15. Au retour : architecture et planification.`,
  `⏱ 1 min · DÉBUT DU MODULE 6 (≈ 13 h 15)

DIRE — « Module 6 : l'IA pour la planification et l'architecture. Trois sujets du programme : aide à la conception d'architectures, estimation et planification agile, gestion des dépendances et des risques. Un lab de 35 minutes, sur un cahier des charges réaliste. »

TRANSITION — « L'IA peut-elle être un architecte ? »`,
];
// @@NOTES-END
