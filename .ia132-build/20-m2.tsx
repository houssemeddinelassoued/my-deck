// ─── M2 · Anatomy of a code prompt ──────────────────────────────────────────
const Ingr = ({ n, letter, tone, title, children }: { n: number; letter: string; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '24px 24px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{letter}</div>
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M2_Anatomy: Page = () => (
  <Frame mod={2} beats={6}>
    <Title>Une demande de code en 5 ingrédients</Title>
    <Lede>Contexte, tâche, contraintes, format, exemples. Plus la tâche est risquée, plus chacun compte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', columnGap: 20 }}>
      <Ingr n={1} letter="C" tone="blue" title="Contexte">
        Langage, version, fichiers, conventions du projet.
      </Ingr>
      <Ingr n={2} letter="T" tone="teal" title="Tâche">
        Un verbe d’action précis : implémente, refactorise, explique.
      </Ingr>
      <Ingr n={3} letter="C" tone="coral" title="Contraintes">
        Ce qui ne doit pas changer : API, tests, dépendances.
      </Ingr>
      <Ingr n={4} letter="F" tone="violet" title="Format">
        Un diff, une fonction, un plan sans code, des tests.
      </Ingr>
      <Ingr n={5} letter="E" tone="green" title="Exemples">
        Une entrée et la sortie attendue, ou un extrait du style voulu.
      </Ingr>
    </div>
    <PromptBox cls={b.on(6)} label="La même demande, avec les 5 ingrédients" size={23} style={{ position: 'absolute', left: 120, top: 610, width: 1680 }}>
      <Strong>C</Strong> Python 3.12, fichier facture.py, montants en cents (entiers). <Strong>T</Strong> Implémente calculer_facture() selon #SPEC.md.{' '}
      <Strong c={C.coral}>C</Strong> Arrondi demi vers le haut, aucune dépendance, ne modifie pas les tests.{' '}
      <Strong c={C.violet}>F</Strong> Une fonction publique et des fonctions privées nommées d’après les règles.{' '}
      <Strong c={C.green}>E</Strong> Panier de 215,97 $ avec BIENVENUE10 → rabais 21,60 $, total 223,48 $.
    </PromptBox>
  </Frame>
);

// ─── M2 · Vague vs structured ───────────────────────────────────────────────
const M2_BeforeAfter: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Même besoin, deux demandes</Title>
    <Lede>Le code généré reflète exactement ce que vous avez (ou n’avez pas) dit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 810 }}>
      <PromptBox cls={A.in} label="Demande vague" size={24} style={dl(100)}>
        Fais une fonction qui calcule le total d’une facture avec les taxes.
      </PromptBox>
      <CodeDark cls={b.on(1)} file="facture.py" size={21} style={{ marginTop: 20 }}>
        <Kw>def</Kw> <Fn>total</Fn>(items):{'\n'}
        {'    '}t = <Fn>sum</Fn>(i[<St>"price"</St>] <Kw>for</Kw> i <Kw>in</Kw> items){'\n'}
        <Ln kind="del">
          {'    '}
          <Kw>return</Kw> <Fn>round</Fn>(t * <Nu>1.15</Nu>, <Nu>2</Nu>)
        </Ln>
      </CodeDark>
      <div className={b.on(1)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="coral" size={23}>
          Taux inventé (15 %), TPS et TVQ confondues
        </Bullet>
        <Bullet tone="coral" size={23}>
          Nombres à virgule, round() arrondit 0,5 au pair
        </Bullet>
        <Bullet tone="coral" size={23}>
          Ni rabais, ni livraison, ni erreurs
        </Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 270, width: 810 }}>
      <PromptBox cls={A.in} label="Demande structurée + #SPEC.md + tests" size={24} style={dl(200)}>
        … montants en cents, arrondi demi vers le haut, règles de SPEC.md, sans modifier test_facture.py.
      </PromptBox>
      <CodeDark cls={b.on(2)} file="facture.py" size={21} style={{ marginTop: 20 }}>
        <Ln kind="add">
          TAUX_TVQ = (<Nu>9975</Nu>, <Nu>100_000</Nu>){'  '}
          <Cm># 9,975 %</Cm>
        </Ln>
        <Ln kind="add">
          <Kw>def</Kw> <Fn>arrondi</Fn>(num, den): <Kw>return</Kw> (<Nu>2</Nu>*num + den) // (<Nu>2</Nu>*den)
        </Ln>
        <Ln kind="add">
          <Kw>def</Kw> <Fn>calculer_rabais</Fn>(sous_total, code): …
        </Ln>
      </CodeDark>
      <div className={b.on(2)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="green" size={23}>
          Chaque règle est nommée et visible
        </Bullet>
        <Bullet tone="green" size={23}>
          Entiers en cents, arrondi exact
        </Bullet>
        <Bullet tone="green" size={23}>
          Les tests disent si c’est juste
        </Bullet>
      </div>
    </div>
  </Frame>
);

// ─── M2 · Project instructions ──────────────────────────────────────────────
const InstrRow = ({ id, file, d }: { id: AppId; file: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 64, borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <AppTile id={id} size={42} />
    <span style={{ width: 210, fontSize: 24, fontWeight: 600, color: C.ink }}>{APPS[id].short}</span>
    <span style={{ fontFamily: mono, fontSize: 22, color: T.blue.fg }}>{file}</span>
  </div>
);

const M2_Instructions: Page = () => (
  <Frame mod={2}>
    <Title>Écrire ses conventions une fois : les instructions de projet</Title>
    <Lede>Un fichier versionné, lu à chaque demande. Toute l’équipe obtient le même comportement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 800 }}>
      <InstrRow id="copilot" file=".github/copilot-instructions.md" d={100} />
      <InstrRow id="codex" file="AGENTS.md  (standard ouvert)" d={180} />
      <InstrRow id="cursor" file=".cursor/rules/*.mdc" d={260} />
      <InstrRow id="claude" file="CLAUDE.md" d={340} />
      <InstrRow id="junie" file=".junie/guidelines.md" d={420} />
      <Callout cls={A.in} title="Ce qu’on y met" tone="blue" icon="note" size={24} style={{ marginTop: 28, ...dl(500) }}>
        Langages et versions, conventions, commandes de test, règles d’équipe, ce qui est interdit.
      </Callout>
    </div>
    <CodeDark cls={A.right} file=".github/copilot-instructions.md" lang="md" size={20} style={{ position: 'absolute', left: 990, top: 280, width: 810, ...dl(300) }}>
      <Fn>## Règles de l’équipe</Fn>
      {'\n'}- Montants d’argent en entiers (cents).{'\n'}- Requêtes SQL toujours paramétrées.{'\n'}- Aucun secret dans le code.{'\n'}- Lever une exception explicite,{'\n'}
      {'  '}jamais un except vide.{'\n'}
      {'\n'}
      <Fn>## Ne pas faire</Fn>
      {'\n'}- Modifier un test pour le faire passer.{'\n'}- Ajouter une dépendance sans le dire.{'\n'}- Toucher hors du dossier demandé.
    </CodeDark>
    <Hint cls={A.in} style={{ position: 'absolute', left: 990, top: 870, ...dl(600) }}>
      Celui du dépôt des labs : ouvrez-le, il sert aux labs 02, 07 et 11.
    </Hint>
  </Frame>
);

// ─── M2 · Guiding completion ────────────────────────────────────────────────
const M2_Completion: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Guider la complétion par l’intention</Title>
    <Lede>Le nom, les types, la docstring et un exemple : la suggestion suit ce que vous écrivez avant.</Lede>
    <CodeDark cls={A.in} file="dates.py" lang="python" size={23} style={{ position: 'absolute', left: 120, top: 280, width: 1020, ...dl(100) }}>
      <Kw>def</Kw> <Fn>jours_ouvrables</Fn>(debut: <Ty>date</Ty>, fin: <Ty>date</Ty>) -&gt; <Ty>int</Ty>:{'\n'}
      {'    '}
      <St>"""Nombre de jours du lundi au vendredi entre debut</St>
      {'\n'}
      {'    '}
      <St>et fin inclus. Lève ValueError si fin &lt; debut.</St>
      {'\n'}
      {'\n'}
      {'    '}
      <St>&gt;&gt;&gt; jours_ouvrables(date(2026, 11, 6), date(2026, 11, 9))</St>
      {'\n'}
      {'    '}
      <St>2</St>
      {'\n'}
      {'    '}
      <St>"""</St>
      {'\n'}
      <span className={b.fade(1)}>
        <Ghost>{'    '}if fin &lt; debut:</Ghost>
        {'\n'}
        <Ghost>{'        '}raise ValueError("fin avant debut")</Ghost>
        {'\n'}
        <Ghost>{'    '}jours = (fin - debut).days + 1</Ghost>
        {'\n'}
        <Ghost>{'    '}return sum(1 for i in range(jours)</Ghost>
        {'\n'}
        <Ghost>{'               '}if (debut + timedelta(i)).weekday() &lt; 5)</Ghost>
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1200, top: 280, width: 600, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(2)} tone="blue" icon="target" title="Ce qui guide" size={23}>
        Un nom explicite · des types · une docstring qui dit le cas limite · un exemple doctest · les fichiers liés ouverts.
      </Card>
      <Card cls={b.on(3)} tone="coral" icon="eye" title="Ce qu’il faut relire" size={23}>
        Inclus ou exclus ? Fuseau horaire ? Jours fériés ? La suggestion répond à la docstring, pas au métier.
      </Card>
    </div>
  </Frame>
);

// ─── M2 · Contextual completion (pattern continuation) ──────────────────────
const M2_Pattern: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Autocomplétion contextuelle : elle continue vos motifs</Title>
    <Lede>Deux exemples écrits à la main ; le troisième est proposé. Idéal pour les tests et les tables de données.</Lede>
    <CodeDark cls={A.in} file="test_dates.py" lang="python" size={22} style={{ position: 'absolute', left: 120, top: 280, width: 1100, ...dl(100) }}>
      <Kw>def</Kw> <Fn>test_meme_jour_ouvrable</Fn>():{'\n'}
      {'    '}
      <Kw>assert</Kw> jours_ouvrables(date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>2</Nu>), date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>2</Nu>)) == <Nu>1</Nu>
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>test_week_end_seul</Fn>():{'\n'}
      {'    '}
      <Kw>assert</Kw> jours_ouvrables(date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>7</Nu>), date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>8</Nu>)) == <Nu>0</Nu>
      {'\n'}
      {'\n'}
      <span className={b.fade(1)}>
        <Ghost>def test_fin_avant_debut():</Ghost>
        {'\n'}
        <Ghost>{'    '}with pytest.raises(ValueError):</Ghost>
        {'\n'}
        <Ghost>{'        '}jours_ouvrables(date(2026, 11, 9), date(2026, 11, 6))</Ghost>
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(1)} tone="green" icon="check" title="Il a lu la docstring" size={23}>
        Le cas « fin &lt; debut » vient du fichier dates.py, ouvert dans un onglet.
      </Card>
      <Card cls={b.on(2)} tone="yellow" icon="bulb" title="Astuce" size={23}>
        Écrivez le nom du test d’abord : test_un_jour_ferie… La suggestion suit le nom.
      </Card>
    </div>
  </Frame>
);

// ─── M2 · Quiz ──────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Quelle demande ?"
    q="Le test test_arrondi échoue après génération. Quelle demande au chat est la plus efficace ?"
    explain="Donnez à l’IA ce qu’elle ne peut pas deviner : le message d’échec, l’attendu et la contrainte. « Corrige » sans contexte relance une prédiction au hasard."
  >
    <Opt why="Trop vague : l’assistant ne sait pas quel test, ni pourquoi. Il risque de réécrire autre chose.">Corrige le code, il y a un bogue.</Opt>
    <Opt ok why="Oui : la trace, l’attendu et la contrainte. L’assistant peut raisonner sur la cause (round arrondit 0,5 au pair).">
      Voici l’échec de test_arrondi (attendu 51, obtenu 50). Explique la cause, sans modifier le test.
    </Opt>
    <Opt why="Piège ! Changer l’attendu du test, c’est masquer le bogue. Le test décrit la spécification.">Modifie test_arrondi pour qu’il accepte 50.</Opt>
    <Opt why="Réécrire tout le fichier efface le travail juste et rend le diff illisible. Ciblez.">Réécris tout facture.py depuis le début.</Opt>
  </QcmPage>
);

// ─── Lab 02 ─────────────────────────────────────────────────────────────────
const L02_Brief: Page = () => (
  <LabBrief
    mod={2}
    n="02"
    title="Générer à partir d’une spécification"
    dur="25 min"
    folder="lab02-generation"
    objective="Rédiger un prompt structuré et utiliser des tests existants comme critère d’acceptation du code généré."
    cmd={
      <>
        <Pr>pytest labs/lab02-generation</Pr>
        {'\n'}
        <Ko>12 failed</Ko>
        {'  '}
        <Cm>au départ</Cm>
        {'\n'}
        <Pr>npm run test:lab02</Pr>
      </>
    }
    deliverable="12 tests verts sans les modifier, et PROMPT.md : votre prompt final et le nombre d’itérations."
  >
    <LabStep n={1} t="3 min" title="Lisez SPEC.md">
      Repérez les 2 règles les plus piégeuses
    </LabStep>
    <LabStep n={2} t="7 min" title="Rédigez PROMPT.md">
      Contexte, tâche, contraintes, format, exemples
    </LabStep>
    <LabStep n={3} t="5 min" title="Générez">
      Avec SPEC.md et le fichier de tests joints au contexte
    </LabStep>
    <LabStep n={4} t="7 min" title="Itérez sur les échecs">
      Collez le message d’échec, pas « corrige »
    </LabStep>
    <LabStep n={5} t="3 min" title="Relisez">
      Chaque règle de la spec est-elle nommée dans le code ?
    </LabStep>
  </LabBrief>
);

const L02_Go: Page = () => (
  <LabGo mod={2} n="02" minutes={25} folder="lab02-generation">
    <CheckItem id="l02-1">Les 2 règles piégeuses repérées dans SPEC.md</CheckItem>
    <CheckItem id="l02-2">PROMPT.md avec les 5 ingrédients</CheckItem>
    <CheckItem id="l02-3">Première génération : combien de tests verts ?</CheckItem>
    <CheckItem id="l02-4">Itérations avec les messages d’échec</CheckItem>
    <CheckItem id="l02-5">12 tests verts, tests intacts</CheckItem>
  </LabGo>
);

// ─── M2 · Refactoring: the safety net ───────────────────────────────────────
const RfStep = ({ n, x, icon, tone, title, children }: { n: number; x: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 300, width: 300, height: 330, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 22px' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M2_Refactor: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Refactoriser avec l’IA : d’abord le filet de sécurité</Title>
    <Lede>Refactoriser, c’est changer la structure sans changer le comportement. Il faut pouvoir le prouver.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={425} y1={465} x2={465} y2={465} color={C.faint} w={4} n={2} head={14} />
      <Arrow x1={770} y1={465} x2={810} y2={465} color={C.faint} w={4} n={3} head={14} />
      <Arrow x1={1115} y1={465} x2={1155} y2={465} color={C.faint} w={4} n={4} head={14} />
      <Arrow x1={1460} y1={465} x2={1500} y2={465} color={C.faint} w={4} n={5} head={14} />
      <path d="M 1650 640 C 1650 740, 1300 740, 1300 640" fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="10 12" className={cx(A.march, b.fade(5))} />
    </svg>
    <RfStep n={1} x={120} icon="shield" tone="blue" title="Tests de caractérisation">
      Figer les sorties actuelles (« golden master »), même bizarres.
    </RfStep>
    <RfStep n={2} x={465} icon="search" tone="teal" title="Diagnostic">
      L’IA liste les problèmes, du plus coûteux au moins coûteux. Sans code.
    </RfStep>
    <RfStep n={3} x={810} icon="map" tone="violet" title="Plan en étapes">
      5 étapes maximum, chacune sans changement de comportement.
    </RfStep>
    <RfStep n={4} x={1155} icon="code" tone="yellow" title="Une étape à la fois">
      Demander, relire le diff, lancer les tests.
    </RfStep>
    <RfStep n={5} x={1500} icon="check" tone="green" title="Commit vert">
      Un commit par étape ; sinon git restore et on reformule.
    </RfStep>
    <Callout cls={b.on(5)} title="Le piège n° 1" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      « J’en ai profité pour corriger un bogue » : en refactorisation, aucun changement de comportement. On corrige dans un commit séparé, avec son test.
    </Callout>
  </Frame>
);

// ─── M2 · Before / after ────────────────────────────────────────────────────
const M2_Smells: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Avant / après : ce que l’IA sait bien réécrire</Title>
    <Lede>Noms d’une lettre, if imbriqués, nombres magiques, code dupliqué : des motifs qu’elle reconnaît.</Lede>
    <CodeDark cls={A.in} file="commandes.py · avant" size={20} style={{ position: 'absolute', left: 120, top: 280, width: 800, ...dl(100) }}>
      <Kw>if</Kw> r == <St>"QC"</St>:{'\n'}
      {'    '}
      <Kw>if</Kw> x[<St>"poids"</St>] &lt;= <Nu>2</Nu>:{'\n'}
      {'        '}f = <Nu>8</Nu>
      {'\n'}
      {'    '}
      <Kw>else</Kw>:{'\n'}
      {'        '}
      <Kw>if</Kw> x[<St>"poids"</St>] &lt;= <Nu>10</Nu>:{'\n'}
      {'            '}f = <Nu>15</Nu>
      {'\n'}
      {'        '}
      <Kw>else</Kw>:{'\n'}
      {'            '}f = <Nu>15</Nu> + (x[<St>"poids"</St>] - <Nu>10</Nu>) * <Nu>1.5</Nu>
      {'\n'}
      <Kw>elif</Kw> r == <St>"ON"</St>:{'\n'}
      {'    '}
      <Cm># … le même bloc, avec 10, 18, 1.75</Cm>
    </CodeDark>
    <CodeDark cls={b.on(1)} file="commandes.py · après" size={20} style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      GRILLES = {'{'}
      {'\n'}
      {'    '}
      <St>"QC"</St>: <Ty>Grille</Ty>(leger=<Nu>8</Nu>, moyen=<Nu>15</Nu>, par_kg=<Nu>1.5</Nu>),{'\n'}
      {'    '}
      <St>"ON"</St>: <Ty>Grille</Ty>(leger=<Nu>10</Nu>, moyen=<Nu>18</Nu>, par_kg=<Nu>1.75</Nu>),{'\n'}
      {'}'}
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>frais_livraison</Fn>(poids, region):{'\n'}
      {'    '}g = GRILLES.get(region, GRILLE_AUTRES){'\n'}
      {'    '}
      <Kw>if</Kw> poids &lt;= POIDS_LEGER: <Kw>return</Kw> g.leger{'\n'}
      {'    '}
      <Kw>if</Kw> poids &lt;= POIDS_MOYEN: <Kw>return</Kw> g.moyen{'\n'}
      {'    '}
      <Kw>return</Kw> g.moyen + (poids - POIDS_MOYEN) * g.par_kg
    </CodeDark>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 770, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 20 }}>
      <Tag tone="green" size={22}>Complexité : 17 → 4</Tag>
      <Tag tone="green" size={22}>Une région = une ligne</Tag>
      <Tag tone="green" size={22}>Constantes nommées</Tag>
      <Tag tone="coral" size={22}>À vérifier : arrondis et seuils</Tag>
    </div>
  </Frame>
);

// ─── M2 · Refactoring prompts ───────────────────────────────────────────────
const PromptCard = ({ n, title, tone, d, children }: { n: number; title: string; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone={tone} size={44} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.45, color: C.ink, fontStyle: 'italic', background: T.blue.bg, borderRadius: 12, padding: '12px 16px' }}>{children}</div>
  </div>
);

const M2_RefactorPrompts: Page = () => (
  <Frame mod={2}>
    <Title>Quatre demandes pour refactoriser et optimiser</Title>
    <Lede>Séparer le diagnostic, le plan et l’exécution : vous gardez la main à chaque étape.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 26, rowGap: 24 }}>
      <PromptCard n={1} title="Diagnostic" tone="blue" d={100}>
        « Liste les problèmes de lisibilité et de maintenabilité de traiter(), du plus coûteux au moins coûteux. Pas encore de code. »
      </PromptCard>
      <PromptCard n={2} title="Plan" tone="teal" d={200}>
        « Propose un plan en 5 étapes maximum. Chaque étape doit garder exactement le même comportement. »
      </PromptCard>
      <PromptCard n={3} title="Une étape" tone="violet" d={300}>
        « Applique uniquement l’étape 2. Ne touche ni aux tests ni aux arrondis. Montre-moi le diff. »
      </PromptCard>
      <PromptCard n={4} title="Optimiser" tone="green" d={400}>
        « Quelle est la complexité de cette fonction ? Propose une version plus rapide qui garde le même résultat et l’ordre des éléments. »
      </PromptCard>
    </div>
    <Hint cls={A.in} style={{ position: 'absolute', left: 120, top: 900, ...dl(600) }}>
      Mesurer la complexité avant et après : ruff check --select C901 (Python), règle complexity d’ESLint (TypeScript).
    </Hint>
  </Frame>
);

// ─── Lab 03 ─────────────────────────────────────────────────────────────────
const L03_Brief: Page = () => (
  <LabBrief
    mod={2}
    n="03"
    title="Refactoriser du code hérité, sans rien casser"
    dur="25 min"
    folder="lab03-refactorisation"
    objective="Refactoriser un module hérité par petites étapes vérifiées : l’IA propose, les tests protègent, Git garde chaque étape."
    cmd={
      <>
        <Pr>pytest labs/lab03-refactorisation</Pr>
        {'\n'}
        <Ok>11 passed</Ok>
        {'  '}
        <Cm>doivent le rester</Cm>
        {'\n'}
        <Pr>ruff check --select C901 …</Pr>
        {'\n'}
        <Ko>C901 traiter is too complex (17)</Ko>
      </>
    }
    deliverable="Tests toujours verts et intacts, 3 à 5 commits « refactor: … », traiter sous le seuil de complexité 8."
  >
    <LabStep n={1} t="5 min" title="Diagnostic">
      Faites lister les problèmes ; notez la complexité de départ
    </LabStep>
    <LabStep n={2} t="3 min" title="Plan">
      5 étapes au plus : validez-les ou réordonnez-les vous-même
    </LabStep>
    <LabStep n={3} t="15 min" title="Une étape, un diff, un test, un commit">
      Si un test casse : git restore . et reformulez
    </LabStep>
    <LabStep n={4} t="2 min" title="Bilan">
      ruff check --select C901 : traiter ne doit plus apparaître
    </LabStep>
  </LabBrief>
);

const L03_Go: Page = () => (
  <LabGo mod={2} n="03" minutes={25} folder="lab03-refactorisation">
    <CheckItem id="l03-1">Diagnostic obtenu, complexité de départ notée (17)</CheckItem>
    <CheckItem id="l03-2">Plan validé : 5 étapes au plus</CheckItem>
    <CheckItem id="l03-3">Étapes 1 et 2 : tests verts, commits faits</CheckItem>
    <CheckItem id="l03-4">Étapes 3 à 5 : tests verts, commits faits</CheckItem>
    <CheckItem id="l03-5">traiter sous le seuil de complexité</CheckItem>
  </LabGo>
);

// ─── M2 · Prompt best practices (flip cards) ────────────────────────────────
const BadGood = ({ bad, good, why }: { bad: ReactNode; good: ReactNode; why: ReactNode }) => (
  <FlipCard
    w={405}
    h={500}
    tone="coral"
    backTone="green"
    front={
      <>
        <Eyebrow c={C.coral} size={20}>
          Demande à améliorer
        </Eyebrow>
        <div style={{ marginTop: 16, fontSize: 28, lineHeight: 1.35, color: C.ink, fontStyle: 'italic' }}>{bad}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={20}>
          Mieux
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.4, color: C.ink, fontStyle: 'italic' }}>{good}</div>
        <div style={{ marginTop: 'auto', fontSize: 21, lineHeight: 1.35, color: T.green.fg }}>{why}</div>
      </>
    }
  />
);

const M2_Practices: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Bonnes pratiques : réécrivez ces demandes</Title>
    <Lede>Proposez une meilleure version à voix haute, puis je retourne la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 405px)', columnGap: 20, ...dl(100) }}>
      <BadGood
        bad="Améliore ce code."
        good="Réduis la complexité de traiter() sans changer son comportement ; les tests de caractérisation doivent rester verts."
        why="Un critère mesurable remplace « améliore »."
      />
      <BadGood
        bad="Écris-moi toute l’API de réservation."
        good="Propose d’abord la liste des routes et les modèles de données. Ensuite, une route à la fois, avec ses tests."
        why="Petites étapes relisibles."
      />
      <BadGood
        bad="Pourquoi ça plante ?"
        good="Voici la trace complète et le code de taux_occupation(). Explique la cause racine en 3 phrases, sans corriger."
        why="La trace et l’attendu valent mieux que toute paraphrase."
      />
      <BadGood
        bad="Fais des tests."
        good="Liste d’abord les comportements à tester : nominaux, limites, erreurs. Puis des tests pytest paramétrés."
        why="Penser avant d’écrire."
      />
    </div>
  </Frame>
);

// ─── M2 · Synthesis ─────────────────────────────────────────────────────────
const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={<>Créez le fichier d’instructions de votre projet avec 5 règles. Gardez un canevas de prompt à portée de main. Pour votre prochaine refactorisation : tests de caractérisation d’abord.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Contexte, tâche, contraintes, format, exemples
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      Les tests existants sont le meilleur critère d’acceptation
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      Instructions de projet : écrire ses conventions une fois
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      La complétion suit le nom, les types et la docstring
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      Refactoriser : filet de tests, petites étapes, un commit par étape
    </SynthRow>
  </SynthPage>
);

// ─── Module 3 divider ───────────────────────────────────────────────────────
const M3_Divider: Page = () => (
  <Section n={3} title="Débogage et optimisation avec l’IA" sub="Trouver la cause, corriger, accélérer… et savoir quand ne pas faire confiance." dur="≈ 1 h 45">
    <SecItem n={1}>Détection automatique des erreurs</SecItem>
    <SecItem n={2}>Suggestions de correction et explications</SecItem>
    <SecItem n={3}>Optimiser les performances, réduire la complexité</SecItem>
    <SecItem n={4}>Limites et validation humaine</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M2_Anatomy, M2_BeforeAfter, M2_Instructions, M2_Completion, M2_Pattern, M2_Quiz, L02_Brief, L02_Go, M2_Refactor, M2_Smells, M2_RefactorPrompts, L03_Brief, L03_Go, M2_Practices, M2_Synth, M3_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · 6 CLICS

OBJECTIF — Donner une structure de demande réutilisable (elle est en annexe A du guide PDF).

→ beat 1 : CONTEXTE — « Langage, version, le fichier concerné, les conventions. L'IA ne devine pas que vos montants sont en cents. »
→ beat 2 : TÂCHE — « Un verbe d'action précis. Implémente, refactorise, explique, compare. »
→ beat 3 : CONTRAINTES — « Ce qui ne doit pas changer. C'est souvent ce qu'on oublie, et c'est là que l'IA déborde. »
→ beat 4 : FORMAT — « Un diff ? Un plan sans code ? Des tests ? Dites-le. »
→ beat 5 : EXEMPLES — « Une entrée, la sortie attendue. Le meilleur moyen de lever une ambiguïté. »
→ beat 6 : lire l'exemple complet. « C'est exactement la demande du lab 02, avant le dîner. »

TRANSITION — « Voyons la différence en direct. »`,
  `⏱ 4 min · DÉMO · 2 CLICS

OBJECTIF — Montrer que le code généré reflète la demande.

DÉMO (si possible en direct dans l'IDE, sinon avec la page) —
→ beat 1 : « Demande vague : il invente un taux de 15 %, mélange TPS et TVQ, utilise des nombres à virgule. Et round() en Python arrondit 0,5 au pair : 50,5 donne 50. Ce code passe une revue rapide… et donne des factures fausses. »
→ beat 2 : « Demande structurée, avec SPEC.md et les tests joints : chaque règle est nommée, les montants sont des entiers, l'arrondi est exact. Et surtout : les tests disent si c'est juste. »

MESSAGE — « La demande vague n'est pas plus rapide : elle déplace le travail vers la relecture et le débogage. »

TRANSITION — « Certaines informations reviennent dans toutes vos demandes : écrivez-les une fois. »`,
  `⏱ 3 min

OBJECTIF — Présenter les fichiers d'instructions de projet.

DIRE — « Chaque outil lit un fichier d'instructions à chaque demande : .github/copilot-instructions.md pour Copilot, AGENTS.md, un format ouvert lu par de plus en plus d'agents, les règles de Cursor, CLAUDE.md, les guidelines de Junie. »
« On y met les langages, les conventions, les commandes de test, les règles d'équipe, et surtout ce qui est interdit. »
« Il est versionné avec le code : toute l'équipe obtient le même comportement, et on le fait évoluer par pull request. »

ACTION — Faites ouvrir .github/copilot-instructions.md dans le dépôt des labs.

TRANSITION — « Passons à la complétion : comment la guider. »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Montrer que la complétion suit l'intention écrite avant le curseur.

DIRE — « Un nom explicite, des types, une docstring qui dit le cas limite, et un exemple doctest. »
→ beat 1 : la suggestion apparaît. « Il a repris le ValueError de la docstring, et le weekday() < 5. »
→ beat 2 : « Ce qui guide : tout ce qui précède le curseur et les fichiers ouverts. Le commentaire devient une spécification. »
→ beat 3 : « Ce qu'il faut relire : inclus ou exclus ? Jours fériés ? La suggestion répond à la docstring, pas à votre métier. S'il y a des jours fériés au Québec dans votre besoin, il faut le dire. »

TRANSITION — « La complétion est aussi contextuelle : elle continue vos motifs. »`,
  `⏱ 3 min · DÉMO · 2 CLICS

OBJECTIF — L'autocomplétion contextuelle : continuer un motif.

DÉMO — Dans l'IDE : écrivez deux tests, tapez « def test_ » et laissez venir la suggestion.
→ beat 1 : « Il propose le cas d'erreur : il l'a trouvé dans la docstring de dates.py, ouvert dans un autre onglet. »
→ beat 2 : « Astuce : écrivez le nom du test d'abord. test_un_jour_ferie : la suggestion suivra le nom. »

À SOULIGNER — Très efficace pour les tests paramétrés, les tables de données, les mappers. Moins pour la logique métier nouvelle.

TRANSITION — « Un QCM avant le lab. »`,
  `⏱ 3 min · QCM

RÉPONSE — B.
• A ✗ — « Corrige » sans contexte : l'IA reprédit au hasard.
• C ✗ PIÈGE — Changer l'attendu du test masque le bogue. C'est le piège n° 1 des agents.
• D ✗ — Tout réécrire rend le diff illisible.

MESSAGE — Collez le message d'échec, l'attendu, la contrainte. On le refait au lab 02, étape 4.

TRANSITION — « À vous : lab 02. »`,
  `⏱ 2 min · CONSIGNE DU LAB 02

DIRE — « Lab 02, labs/lab02-generation. Une boutique en ligne québécoise : TPS, TVQ, codes promo, livraison gratuite, arrondi au cent. Tout est dans SPEC.md. 12 tests d'acceptation sont rouges. »
« Votre mission : écrire le prompt dans PROMPT.md avec les 5 ingrédients, générer, puis itérer avec les messages d'échec. »
« Interdit de modifier les tests. »

PIÈGES À ANNONCER — round() en Python ; les montants en float ; « le rabais peut faire perdre la livraison gratuite ».

TRANSITION — « Minuteur lancé, 25 minutes. »`,
  `⏱ 25 min · LAB 02 EN AUTONOMIE

ANIMATION — Points d'étape à 8 et 16 minutes : « Combien de tests verts après la première génération ? » (souvent 8 à 10 sur 12). Écoutez les chiffres au micro : c'est un excellent débriefing.

BLOCAGES FRÉQUENTS —
• test_arrondi : round() → arrondi demi vers le haut en entiers.
• test_le_rabais_peut_faire_perdre_la_livraison_gratuite : la livraison se calcule après le rabais.
• TypeScript : RangeError attendue, pas Error.

DÉBRIEF (3 min) — « Combien d'itérations ? Quelle règle l'IA a-t-elle ratée ? » Deux participants partagent leur PROMPT.md au micro ou en capture dans le clavardage.

⏸ DÎNER 12 h – 13 h. Au retour : refactorisation.`,
  `⏱ 4 min · 5 CLICS · RETOUR DU DÎNER (13 h)

OBJECTIF — Poser la méthode de refactorisation sûre avec l'IA.

DIRE — « Refactoriser, c'est changer la structure sans changer le comportement. Comment le prouver ? »
→ beat 1 : « Tests de caractérisation : on fige les sorties actuelles, même bizarres. On ne juge pas, on photographie. »
→ beat 2 : « Diagnostic par l'IA, sans code. »
→ beat 3 : « Un plan en 5 étapes maximum. Vous le validez. »
→ beat 4 : « Une étape à la fois : demander, relire le diff, lancer les tests. »
→ beat 5 : « Un commit par étape verte. Si ça casse : git restore, on reformule. Et la flèche verte : on boucle sur l'étape suivante. »

PIÈGE — « J'en ai profité pour corriger un bogue » : jamais dans un commit de refactorisation.

TRANSITION — « Voyons ce que l'IA sait bien réécrire. »`,
  `⏱ 3 min · DÉMO · 2 CLICS

OBJECTIF — Montrer une refactorisation typique (c'est le code du lab 03).

DIRE — « À gauche, le code hérité : noms d'une lettre, quatre niveaux de if, des nombres magiques, et le même bloc copié pour chaque région. »
→ beat 1 : « Après : une grille de tarifs par région, une fonction frais_livraison avec des retours anticipés. Une nouvelle région, c'est une ligne. »
→ beat 2 : « Complexité de 17 à 4. Mais attention : les arrondis et les seuils stricts (supérieur à 100, pas supérieur ou égal) doivent rester identiques. C'est là que l'IA "améliore" sans le dire. »

TRANSITION — « Les demandes qui mènent là. »`,
  `⏱ 3 min

OBJECTIF — Donner 4 demandes types (diagnostic, plan, une étape, optimiser).

DIRE — Lire les 4 cartes. Insister : « Séparer le diagnostic, le plan et l'exécution, c'est garder la main. L'IA qui fait tout d'un coup produit un diff de 300 lignes impossible à relire. »
« La 4ᵉ demande, optimiser, prépare le module 3. »

OUTILS — Mesurer la complexité : ruff C901 en Python, la règle complexity d'ESLint en TypeScript. On le fait au lab 03.

TRANSITION — « À vous : lab 03. »`,
  `⏱ 1 min · CONSIGNE DU LAB 03

DIRE — « Lab 03, labs/lab03-refactorisation. Une fonction traiter() de 2017. Les tests de caractérisation sont verts : ils doivent le rester à chaque étape. »
« Objectif mesurable : faire passer traiter() sous le seuil de complexité 8, en 3 à 5 commits. »

PIÈGE À ANNONCER — Le print devient une exception ? C'est un changement de comportement. Un logging.warning est acceptable : discutez-en.

TRANSITION — « 25 minutes. »`,
  `⏱ 25 min · LAB 03 EN AUTONOMIE

ANIMATION — Points d'étape à 10 et 18 minutes : « Combien de commits verts ? »

BLOCAGES FRÉQUENTS —
• Test cassé après une étape : git restore . puis demander une étape plus petite.
• L'IA change round(t + f, 2) en round(t, 2) + round(f, 2) : comportement différent, le golden master le détecte.
• TypeScript : pas d'outil de complexité installé : compter les niveaux d'imbrication, ou npx eslint avec la règle complexity.

DÉBRIEF (3 min) — « Quelle étape l'IA a-t-elle ratée ? Combien de git restore ? »`,
  `⏱ 5 min · EXERCICE · CARTES

OBJECTIF — Réinvestir les bonnes pratiques.

ANIMATION — Pour chaque carte : « Comment la réécririez-vous ? » Écoutez une ou deux propositions au micro, puis cliquez la carte pour la retourner.

À SOULIGNER — Les quatre principes : un critère mesurable, de petites étapes, la trace plutôt que la paraphrase, penser avant d'écrire.

TRANSITION — « Synthèse du module 2. »`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 2

DIRE — Lire les cinq points. Encadré : « Créez le fichier d'instructions de votre projet dès lundi, avec 5 règles. Ça prend 15 minutes et ça sert à toute l'équipe. »

TRANSITION — « Module 3 : quand le code ne marche pas. »`,
  `⏱ 1 min · DÉBUT DU MODULE 3 (≈ 13 h 30)

DIRE — « Module 3 : débogage et optimisation avec l'IA. La méthode pour trouver une cause racine, l'optimisation mesurée, et un moment important : les limites. Où l'IA se trompe, avec quelle fréquence, et comment valider. Deux labs : une chasse aux bogues, puis une optimisation. »

TRANSITION — « Commençons par la méthode. »`,
];
// @@NOTES-END
