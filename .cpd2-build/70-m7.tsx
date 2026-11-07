// ─── Module 7 · Tests et définition de fini ─────────────────────────────────
const M7_Divider: Page = () => (
  <Section
    n={7}
    title={
      <>
        Tests et
        <br />
        définition de fini
      </>
    }
    sub="Faire écrire des tests par une skill, puis prouver qu’ils protègent vraiment le code."
    dur="J2 · 13:30 – 14:55"
    labs={<Tag tone="green" size={19}>Atelier 7 · le journal d’audit, mutation 7/7</Tag>}
  >
    <SecItem n={1}>Un test unitaire : Préparer, Agir, Vérifier</SecItem>
    <SecItem n={2}>Générer avec une skill : la liste des cas d’abord</SecItem>
    <SecItem n={3}>Organiser, vérifier les assertions, injecter l’horloge</SecItem>
    <SecItem n={4}>Couverture et mutation : mesurer le filet</SecItem>
    <SecItem n={5}>La définition de fini, appliquée par l’agent</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// ─── Pourquoi ───────────────────────────────────────────────────────────────
const M7Why = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Row2 icon={icon} tone={tone} title={title} d={d}>
    {children}
  </Row2>
);

const M7_Pourquoi: Page = () => (
  <Frame mod={7}>
    <Title>Un test unitaire vérifie un comportement</Title>
    <Lede>Une fonction, une situation, un résultat attendu. Il s’exécute en millisecondes, des milliers de fois par jour.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M7Why icon="shield" tone="green" title="Un filet de sécurité" d={100}>
        Il prévient dès qu’un changement casse quelque chose, même trois mois plus tard.
      </M7Why>
      <M7Why icon="doc" tone="blue" title="Une documentation qui ne ment pas" d={200}>
        « refuse un signataire hors de son tour » : la règle, écrite et vérifiée.
      </M7Why>
      <M7Why icon="wand" tone="violet" title="La liberté de refactorer" d={300}>
        Vous l’avez vécu ce matin : sans tests de caractérisation, on n’ose pas toucher au code de 2019.
      </M7Why>
      <M7Why icon="sparkles" tone="coral" title="Le juge du code généré" d={400}>
        Avec un agent, on écrit plus de code, plus vite : les tests disent s’il est juste.
      </M7Why>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1100, top: 280, width: 700, ...dl(300) }}>
      <svg viewBox="0 0 700 430" width={700} height={430}>
        <polygon points="350,20 470,150 230,150" fill={T.coral.bg} stroke={T.coral.bd} strokeWidth={3} />
        <polygon points="230,160 470,160 560,290 140,290" fill={T.yellow.bg} stroke={T.yellow.bd} strokeWidth={3} />
        <polygon points="140,300 560,300 660,420 40,420" fill={T.green.bg} stroke={C.green} strokeWidth={4} />
        <text x={350} y={115} textAnchor="middle" fontSize={22} fontWeight={700} fill={T.coral.fg}>
          Bout en bout
        </text>
        <text x={350} y={235} textAnchor="middle" fontSize={22} fontWeight={700} fill={T.yellow.fg}>
          Intégration
        </text>
        <text x={350} y={368} textAnchor="middle" fontSize={26} fontWeight={800} fill={T.green.fg}>
          Unitaires : nombreux, rapides
        </text>
      </svg>
      <div style={{ textAlign: 'center', fontSize: 21, color: C.muted, marginTop: 6 }}>Aujourd’hui : la base de la pyramide.</div>
    </div>
  </Frame>
);

// ─── AAA ────────────────────────────────────────────────────────────────────
const M7Band = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr)', alignItems: 'stretch' }}>
    <div style={{ background: STRONG[tone], color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px 0 0 10px' }}>{label}</div>
    <div style={{ background: '#0F1530', padding: '10px 20px', fontFamily: mono, fontSize: 21, lineHeight: 1.55, color: '#E6EAF6', whiteSpace: 'pre', borderRadius: '0 10px 10px 0' }}>{children}</div>
  </div>
);

const M7_AAA: Page = () => (
  <Frame mod={7}>
    <Title>Anatomie d’un test : Préparer, Agir, Vérifier</Title>
    <Lede>Le motif « AAA » (Arrange, Act, Assert). Écrivez-le dans la skill : les tests de l’agent deviennent lisibles d’un coup d’œil.</Lede>
    <CodeDark file="test/journal.test.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <Ck>import</Ck> assert <Ck>from</Ck> <Cs>'node:assert/strict'</Cs>;{'\n'}
      <Ck>import</Ck> {'{ describe, it }'} <Ck>from</Ck> <Cs>'node:test'</Cs>;{'\n'}
      <Ck>import</Ck> {'{ verifierChaine }'} <Ck>from</Ck> <Cs>'../src/journal.js'</Cs>;{'\n\n'}
      <Cf>describe</Cf>(<Cs>'verifierChaine'</Cs>, () =&gt; {'{'}
      {'\n  '}
      <Cf>it</Cf>(<Cs>'détecte une falsification de la dernière entrée'</Cs>, () =&gt; {'{'}
    </CodeDark>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 1060, display: 'flex', flexDirection: 'column', gap: 8, ...dl(200) }}>
      <M7Band tone="blue" label="Préparer">{"const entrees = journalDeTrois().lister();\nentrees[2] = { ...entrees[2], type: 'refus' };"}</M7Band>
      <M7Band tone="violet" label="Agir">{'const resultat = verifierChaine(entrees);'}</M7Band>
      <M7Band tone="green" label="Vérifier">{'assert.deepEqual(resultat, { valide: false, indexCorrompu: 2 });'}</M7Band>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="note" tone="blue" title="Le nom dit le comportement" size={22} pad={22} cls={A.right} style={dl(300)}>
        « détecte une falsification de la dernière entrée », pas « test 3 ». En cas d’échec, on sait quoi chercher.
      </Card>
      <Card icon="target" tone="green" title="Un comportement par test" size={22} pad={22} cls={A.right} style={dl(450)}>
        Un seul « Agir » ; les vérifications portent sur ce comportement-là.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      node:test et node:assert sont inclus dans Node : aucune bibliothèque à installer.
    </Hint>
  </Frame>
);

// ─── Générer avec une skill ─────────────────────────────────────────────────
const M7Way = ({ n, tone, title, prompt, children, d }: { n: number; tone: Tone; title: string; prompt: ReactNode; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.5 }}>{prompt}</div>
    <div style={{ marginTop: 12, fontSize: 20, color: C.soft, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const M7_Generer: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Générer des tests : la liste des cas, puis la skill</Title>
    <Lede>Copilot laissé seul teste les cas nominaux. Vous lui donnez la liste des cas et une méthode écrite une fois.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M7Way n={1} tone="blue" title="La liste des cas" d={100} prompt={<Pr>« #journal.js — Liste les comportements à tester : nominaux, erreurs, bornes. Pas de code. »</Pr>}>
        Mode Ask. Vous relisez, vous complétez : la dernière entrée falsifiée ? le chaînage ?
      </M7Way>
      <M7Way n={2} tone="violet" title="La skill tests-node" d={220} prompt={<>node:test, AAA, horloge injectée, un test par code d’erreur, et la <strong>définition de fini</strong>.</>}>
        Écrite une fois dans .github/skills/, chargée dès que la demande parle de tests.
      </M7Way>
      <M7Way n={3} tone="green" title="L’agent écrit et exécute" d={340} prompt={<Pr>« Écris test/journal.test.js avec la skill tests-node, puis applique sa définition de fini. »</Pr>}>
        Il itère jusqu’au vert. Vous relisez le diff, surtout les attendus.
      </M7Way>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout tone="yellow" icon="alert" title="Le piège du « tout vert »" size={24} cls={A.in} style={dl(500)}>
        Un test généré qui passe du premier coup ne prouve rien : il a peut-être été écrit à partir du code… y compris de ses bugs.
      </Callout>
    </div>
  </Frame>
);

// ─── Organiser ──────────────────────────────────────────────────────────────
const M7_Organiser: Page = () => (
  <Frame mod={7}>
    <Title>Nommer, organiser, structurer les tests générés</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 880 }}>
      <CodeDark file="test/journal.test.js · structure" size={20}>
        <Cc>{'// une fabrique et une horloge fixe'}</Cc>
        {'\n'}
        <Ck>const</Ck> evenement = (champs = {'{}'}) =&gt; ({'{ type: '}<Cs>'depot'</Cs>{', …champs }'});{'\n'}
        <Ck>const</Ck> horlogeFixe = () =&gt; () =&gt; <Ck>new</Ck> Date(<Cs>'2026-11-10T08:00:00Z'</Cs>);{'\n\n'}
        <Cf>describe</Cf>(<Cs>'ajouter'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'chaîne la première entrée à la genèse'</Cs>){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'refuse un type inconnu (TYPE_INCONNU)'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'lister · parDocument'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'renvoie une copie : la modifier ne change rien'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'verifierChaine'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'détecte une entrée falsifiée au milieu'</Cs>){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'détecte un chaînage cassé, empreinte recalculée'</Cs>)
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 210, width: 740, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="doc" tone="blue" title="Un fichier par module" d={200}>
        <Ic>src/journal.js</Ic> ↔ <Ic>test/journal.test.js</Ic>
      </Row2>
      <Row2 icon="layers" tone="violet" title="Un describe par fonction" d={300}>
        La sortie des tests se lit comme la spécification.
      </Row2>
      <Row2 icon="note" tone="green" title="Des noms en phrases" d={400}>
        « refuse… quand… », « accepte… », « signale… »
      </Row2>
      <Row2 icon="tool" tone="teal" title="Une fabrique de données" d={500}>
        Moins de bruit dans chaque test, les données utiles ressortent.
      </Row2>
      <Row2 icon="target" tone="coral" title="Un comportement par test" d={600}>
        Quand il échoue, une seule raison possible.
      </Row2>
    </div>
  </Frame>
);

// ─── Vérifier les assertions ────────────────────────────────────────────────
const M7Trap = ({ n, title, bad, why, d }: { n: number; title: string; bad: string; why: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone="coral" size={36} />
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: '#0F1530', color: '#E6EAF6', borderRadius: 10, padding: '10px 14px' }}>{bad}</div>
    <div style={{ marginTop: 10, fontSize: 21, color: C.soft, lineHeight: 1.4 }}>{why}</div>
  </div>
);

const M7_Assertions: Page = () => (
  <Frame mod={7}>
    <Title>Vérifier la cohérence des assertions : quatre pièges</Title>
    <Lede>Pour chaque test, une seule question : échouerait-il si le code était faux ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <M7Trap n={1} title="Le test tautologique" bad={'const attendue = calculerEmpreinte(entree);\nassert.equal(entree.empreinte, attendue);'} why="Il recalcule l’attendu avec le code testé : faux et faux donnent vert. Seul, il ne prouve rien." d={100} />
      <M7Trap n={2} title="L’assertion trop molle" bad={'const r = journal.verifier();\nassert.ok(r);'} why="Un objet est toujours « vrai » : un journal falsifié passe aussi." d={200} />
      <M7Trap n={3} title="equal au lieu de deepEqual" bad={'assert.equal(journal.verifier(), { valide: true, indexCorrompu: null });'} why="equal compare des références : il échoue toujours, ou on le « corrige » mal. deepEqual." d={300} />
      <M7Trap n={4} title="L’attendu recopié du résultat" bad={"// recopié d’une exécution :\nassert.equal(e.horodatage, '2026-11-09T14:03:27.118Z');"} why="Le test fige l’heure du jour où il a été écrit : il échoue demain. L’attendu vient de la règle ; l’horloge s’injecte." d={400} />
    </div>
  </Frame>
);

// ─── Mocks ──────────────────────────────────────────────────────────────────
const M7_Mocks: Page = () => (
  <Frame mod={7} kind="demo" beats={1}>
    <Title>Injecter l’horloge, et un premier mock</Title>
    <Lede>Date du jour, réseau, hasard : un test unitaire ne doit dépendre d’aucun. On les injecte, puis on les simule.</Lede>
    <CodeDark file="test/journal.test.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <Ck>import</Ck> {'{ describe, it, mock }'} <Ck>from</Ck> <Cs>'node:test'</Cs>;{'\n\n'}
      <Cf>it</Cf>(<Cs>'horodate avec l’horloge injectée'</Cs>, () =&gt; {'{'}
      {'\n  '}
      <Ck>const</Ck> horloge = mock.fn(() =&gt; <Ck>new</Ck> Date(<Cs>'2026-01-02T03:04:05.000Z'</Cs>));{'\n  '}
      <Ck>const</Ck> journal = creerJournal({'{ horloge }'});{'\n\n  '}
      <Ck>const</Ck> e = journal.ajouter(evenement());{'\n\n  '}
      assert.equal(e.horodatage, <Cs>'2026-01-02T03:04:05.000Z'</Cs>);{'\n  '}
      assert.equal(horloge.mock.callCount(), <Cn>1</Cn>);{'\n'}
      {'});'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="plug" tone="blue" title="Injecter" size={21} pad={22} cls={A.right} style={dl(200)}>
        <Ic>{'creerJournal({ horloge })'}</Ic> : l’heure arrive en paramètre, le code est testable par construction.
      </Card>
      <Card icon="flask" tone="green" title="Simuler" size={21} pad={22} cls={A.right} style={dl(350)}>
        <Ic>mock.fn()</Ic> de node:test : une fausse fonction qui compte ses appels.
      </Card>
      <Card icon="alert" tone="coral" title="Sans excès" size={21} pad={22} cls={b.on(1)}>
        Vérifiez le résultat, pas chaque appel interne : un mock trop bavard casse au moindre refactoring.
      </Card>
    </div>
  </Frame>
);

// ─── Couverture ─────────────────────────────────────────────────────────────
const M7CovRow = ({ file, line, branch, gap, hl }: { file: string; line: string; branch: string; gap: string; hl?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '300px 120px 140px minmax(0, 1fr)', gap: 12, fontFamily: mono, fontSize: 19, lineHeight: 1.8, color: hl ? '#FFD27A' : '#E6EAF6' }}>
    <span>{file}</span>
    <span>{line}</span>
    <span>{branch}</span>
    <span style={{ color: '#7C86A8' }}>{gap}</span>
  </div>
);

const M7_Couverture: Page = () => (
  <Frame mod={7} kind="demo" beats={1}>
    <Title>La couverture : ce que vos tests exécutent</Title>
    <Lede>
      <Ic>npm run couverture</Ic> : pour chaque fichier, la part des lignes et des branches parcourues par les tests.
    </Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: '#0F1530', borderRadius: 16, padding: '18px 24px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(100) }}>
      <M7CovRow file="fichier" line="lignes" branch="branches" gap="lignes non couvertes" />
      <M7CovRow file="src/document.js" line="100 %" branch="96 %" gap="" />
      <M7CovRow file="src/circuit.js" line="98 %" branch="91 %" gap="73" />
      <M7CovRow file="src/journal.js" line="94 %" branch="80 %" gap="36" hl />
      <M7CovRow file="src/relances.js" line="100 %" branch="95 %" gap="" />
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="eye" tone="blue" title="Lire les trous" size={21} pad={22} cls={A.right} style={dl(300)}>
        Ligne 36 de journal.js : le contrôle de l’empreinte n’est jamais atteint. Un test manque.
      </Card>
      <Card icon="alert" tone="coral" title="100 % ne prouve rien" size={21} pad={22} cls={b.on(1)}>
        Un test qui appelle verifier() sans aucune assertion « couvre » tout… et ne vérifie rien.
      </Card>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1060 }}>
      <Callout tone="yellow" icon="bulb" title="La couverture dit ce qui est exécuté" size={23}>
        Pas ce qui est vérifié. Pour savoir si vos tests protègent vraiment : la mutation.
      </Callout>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(700) }}>
      Chiffres illustratifs. La commande utilise --experimental-test-coverage de Node : aucune bibliothèque.
    </Hint>
  </Frame>
);

// ─── Mutation ───────────────────────────────────────────────────────────────
const M7Res = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink }}>
    <span style={{ width: 30, height: 30, borderRadius: 99, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: ok ? C.green : C.coral, color: '#fff', fontWeight: 800, fontSize: 18 }}>{ok ? '✓' : '✗'}</span>
    <span>{children}</span>
  </div>
);

const M7Mutant = () => {
  const [mut, setMut] = useState(false);
  const [full, setFull] = useState(false);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '700px minmax(0, 1fr)', gap: 40 }}>
      <div>
        <CodeDark file="src/journal.js · verifierChaine" size={21}>
          <Ck>for</Ck> (<Ck>let</Ck> i = <Cn>0</Cn>; i &lt; <span style={{ background: mut ? 'rgba(242,139,130,.35)' : 'rgba(155,226,155,.2)', borderRadius: 4, padding: '0 4px' }}>{mut ? 'entrees.length - 1' : 'entrees.length'}</span>; i++) {'{'}
          {'\n  '}
          <Cc>{'// … contrôle de chaque entrée …'}</Cc>
          {'\n}'}
        </CodeDark>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toggle on={mut} onChange={setMut} tone="coral" size={24} label={<span style={{ fontWeight: 600 }}>Introduire la mutation (la dernière entrée n’est plus contrôlée)</span>} />
          <Toggle on={full} onChange={setFull} tone="green" size={24} label={<span style={{ fontWeight: 600 }}>Ajouter le test « falsification de la dernière entrée »</span>} />
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PanelTitle icon="flask" c={C.pink}>
          node --test test/journal.test.js
        </PanelTitle>
        <M7Res ok>un journal intact est valide</M7Res>
        <M7Res ok>détecte une entrée falsifiée au milieu</M7Res>
        <M7Res ok>refuse un type inconnu</M7Res>
        {full ? <M7Res ok={!mut}>détecte une falsification de la dernière entrée</M7Res> : null}
        <div style={{ marginTop: 6, borderRadius: 12, padding: '12px 16px', fontSize: 22, lineHeight: 1.4, background: mut ? (full ? T.green.bg : T.coral.bg) : T.grey.bg }}>
          {!mut ? 'Tout est vert : normal, le code est juste.' : full ? 'Un test rougit : la mutation est « tuée ». Votre filet fonctionne.' : 'Tout reste vert malgré le bug : votre suite a un trou sur la dernière entrée.'}
        </div>
      </div>
    </div>
  );
};

const M7_Mutation: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Le test de mutation : casser exprès pour vérifier le filet</Title>
    <Lede>On introduit exprès un bug. Si aucun test ne rougit, il manque un test. Que prédisez-vous ? Au micro.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M7Mutant />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      À l’Atelier 7 : npm run mutation lance 7 mutants contre votre propre suite.
    </Hint>
  </Frame>
);

// ─── Définition de fini ─────────────────────────────────────────────────────
const M7_Fini: Page = () => (
  <Frame mod={7} beats={1}>
    <Title>La définition de fini, écrite dans la skill</Title>
    <Lede>« J’ai terminé » doit vouloir dire la même chose pour vous et pour l’agent. Écrivez-le, il l’appliquera.</Lede>
    <CodeDark file=".github/skills/tests-node/SKILL.md (fin)" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <Cf>## Définition de fini</Cf>
      {'\n'}Le travail n’est terminé que si TOUT est vrai :{'\n'}- [ ] les tests du module passent ;{'\n'}- [ ] npm run mutation : tous les mutants détectés ;{'\n'}- [ ] npm run garde : aucun fichier protégé modifié ;{'\n'}- [ ] la couverture a été relue, les trous justifiés ;{'\n'}- [ ] le résumé liste les commandes lancées{'\n'}
      {'      '}et leur résultat.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="checkCircle" tone="green" title="Vérifiable" size={21} pad={22} cls={A.right} style={dl(250)}>
        Chaque ligne est une commande ou un fait que l’on peut contrôler, pas un vœu.
      </Card>
      <Card icon="shield" tone="navy" title="La garde" size={21} pad={22} cls={A.right} style={dl(400)}>
        <Ic>npm run garde</Ic> : un agent qui « fait passer » les tests en les modifiant est pris.
      </Card>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout tone="blue" icon="eye" title="L’agent l’applique, vous le vérifiez" size={23}>
        Son résumé final cite les commandes et leurs résultats. Un « tout est vert » sans commande : relancez-les vous-même.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 7 ──────────────────────────────────────────────────────────────
const M7_Lab: Page = () => (
  <LabPage
    mod={7}
    n="7"
    title="Des tests générés par une skill, et vérifiés"
    defi="tests"
    who="Individuel · 45 min"
    objective={
      <>
        Écrire la skill <strong>tests-node</strong> et sa <strong>définition de fini</strong>, faire générer la suite du <strong>journal d’audit</strong>, puis prouver qu’elle protège le code : <strong>mutation 7/7</strong>.
      </>
    }
    where={
      <>
        <PathChip size={19}>.github/skills/tests-node/SKILL.md</PathChip>
        <br />
        <PathChip size={19}>test/journal.test.js</PathChip>
        <br />
        src/journal.js : fourni, à ne pas modifier
      </>
    }
    minutes={45}
    crit={
      <>
        <CheckItem id="l7a" size={21}>npm run mutation : 7 / 7</CheckItem>
        <CheckItem id="l7b" size={21}>npm run garde : vert</CheckItem>
        <CheckItem id="l7c" size={21}>Score au premier essai noté</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (skill écrite ?) et 30 min (score de mutation ?)."
  >
    <WStep n={1}>Ask : la liste des comportements de journal.js. Puis la skill : node:test, AAA, horloge, et « ## Définition de fini ».</WStep>
    <WStep n={2}>Mode Agent : la suite avec la skill, puis sa définition de fini. Vérifiez que la skill est chargée.</WStep>
    <WStep n={3}>
      <Ic>npm run couverture</Ic>, puis <Ic>npm run mutation</Ic> : un mutant survivant = un test manquant, un à la fois.
    </WStep>
    <TpBonus>la même skill sur src/circuit.js : quels cas les tests d’acceptation ne couvraient pas ?</TpBonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <Frame mod={7} kind="qcm">
    <Title>QCM · Module 7 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Votre suite atteint 100 % de couverture. Elle est donc…" explain="La couverture mesure ce qui est exécuté, pas ce qui est vérifié : un test sans assertion couvre tout. La mutation dit si les tests détectent une erreur.">
        <QOpt>Complète : plus rien à tester</QOpt>
        <QOpt ok>Exécutée en entier, mais pas forcément vérifiée</QOpt>
        <QOpt>Inutile : il faut viser 80 %</QOpt>
      </QuizQ>
      <QuizQ q="Un mutant « survit ». Que faites-vous ?" explain="Un mutant survivant montre un comportement qu’aucun test ne vérifie : on ajoute ce test, puis on relance la mutation.">
        <QOpt>Je supprime ce mutant du script</QOpt>
        <QOpt ok>J’ajoute le test qui le détecte</QOpt>
        <QOpt>Je modifie src/journal.js pour le tuer</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi injecter une horloge dans le journal ?" explain="Avec l’heure réelle, l’horodatage change à chaque exécution : impossible de l’attendre précisément. Une horloge fixe rend le test déterministe.">
        <QOpt>Pour aller plus vite</QOpt>
        <QOpt>Parce que new Date() est interdit en JavaScript</QOpt>
        <QOpt ok>Pour qu’un test donne toujours le même résultat</QOpt>
      </QuizQ>
      <QuizQ q="L’agent annonce « tout est vert » sans citer de commande. Que faites-vous ?" explain="La définition de fini exige les commandes et leurs résultats. Sans elles, vous relancez vous-même : tests, mutation, garde.">
        <QOpt ok>Je relance moi-même les commandes de la définition de fini</QOpt>
        <QOpt>Je le crois : il a accès au terminal</QOpt>
        <QOpt>Je commite tout de suite</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M7_Pause: Page = () => <BreakPage mod={7} title="Pause" back="Reprise à 15 h 10 : de nouveaux outils pour l’agent, un plugin, deux sessions en parallèle." minutes={15} />;

// @@PAGES-BEGIN
export const __pages = [M7_Divider, M7_Pourquoi, M7_AAA, M7_Generer, M7_Organiser, M7_Assertions, M7_Mocks, M7_Couverture, M7_Mutation, M7_Fini, M7_Lab, M7_Qcm, M7_Pause];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 7 · 13:30

OBJECTIF — Annoncer le module : des tests générés par une skill, et la preuve qu’ils servent.

DIRE — « Module 7 : les tests. Copilot écrit des tests très vite ; la question est de savoir s’ils protègent vraiment le code. Vous allez écrire une skill de tests, avec une définition de fini que l’agent devra appliquer, et mesurer votre filet par la mutation. »

TRANSITION — « D’abord : à quoi sert un test unitaire ? »`,
  `⏱ 3 min · POURQUOI DES TESTS

OBJECTIF — Rappeler les quatre rôles d’un test unitaire, et la pyramide.

DIRE — « Un test vérifie un comportement. Quatre rôles : un filet de sécurité ; une documentation qui ne ment pas ; la liberté de refactorer, vous l’avez vécue ce matin ; et surtout, avec un agent, le juge du code généré. Aujourd’hui, la base de la pyramide : les tests unitaires, nombreux et rapides. »

TRANSITION — « Comment est fait un bon test ? »`,
  `⏱ 4 min · AAA

OBJECTIF — Montrer le motif Préparer, Agir, Vérifier sur le journal d’audit.

DIRE — « Le motif AAA. Préparer : un journal de trois entrées, et je falsifie la dernière. Agir : un seul appel, verifierChaine. Vérifier : le journal n’est pas valide, et l’entrée corrompue est la numéro 2. Le nom du test dit le comportement. Ce motif, vous l’écrirez dans la skill : l’agent l’appliquera. »

TRANSITION — « Comment faire écrire ces tests à Copilot ? »`,
  `⏱ 5 min · GÉNÉRER AVEC UNE SKILL (démo)

OBJECTIF — Donner le chemin de l’atelier : liste des cas, skill, agent.

DIRE — « Trois temps. D’abord la liste des cas, en mode Ask, sans code : vous la relisez et vous la complétez. Ensuite la skill tests-node : les conventions, l’horloge injectée, et la définition de fini. Enfin l’agent écrit, exécute, itère. »

DIRE — « Et le piège : un test généré qui passe du premier coup ne prouve rien. Il a peut-être été écrit à partir du code, bugs compris. »

TRANSITION — « Comment organiser ce que l’agent produit ? »`,
  `⏱ 3 min · ORGANISER

OBJECTIF — Donner les conventions d’organisation à mettre dans la skill.

DIRE — « Un fichier par module, un describe par fonction, des noms en phrases, une fabrique de données, une horloge fixe, et un comportement par test. Quand un test échoue, on sait tout de suite quoi chercher. »

TRANSITION — « Un test vert peut-il être un mauvais test ? Oui, de quatre façons. »`,
  `⏱ 4 min · QUATRE PIÈGES D’ASSERTION

OBJECTIF — Apprendre à repérer les assertions qui ne protègent rien.

DIRE — « Une seule question pour chaque test : échouerait-il si le code était faux ? Le test tautologique recalcule l’attendu avec le code testé. L’assertion molle : assert.ok sur un objet, toujours vrai. equal au lieu de deepEqual sur un objet. Et l’attendu recopié d’une exécution : ici, une heure réelle, et le test échouera demain. »

TRANSITION — « L’heure, justement : comment la maîtriser ? »`,
  `⏱ 3 min · HORLOGE INJECTÉE ET MOCK (démo)

OBJECTIF — Montrer l’injection de dépendance et un mock simple de node:test.

DIRE — « Le journal reçoit son horloge en paramètre : en test, on lui donne une horloge fixe. Et mock.fn de node:test fabrique une fausse fonction qui compte ses appels. »

→ beat 1 « Sans excès : on vérifie le résultat, pas chaque appel interne, sinon le test casse au moindre refactoring. »

TRANSITION — « Vos tests exécutent-ils tout le code ? »`,
  `⏱ 4 min · COUVERTURE (démo)

OBJECTIF — Lire un rapport de couverture et en connaître la limite.

DIRE — « npm run couverture : pour chaque fichier, les lignes et les branches parcourues par les tests, et les lignes jamais atteintes. Ici, la ligne 36 du journal : le contrôle de l’empreinte n’est jamais exécuté. Un test manque. »

→ beat 1 « Mais attention : 100 % ne prouve rien. Un test sans assertion couvre tout. La couverture dit ce qui est exécuté, pas ce qui est vérifié. Pour ça : la mutation. »

TRANSITION — « Casser exprès pour vérifier le filet. »`,
  `⏱ 4 min · MUTATION (exercice oral)

OBJECTIF — Faire comprendre le test de mutation par une prédiction.

DIRE — « On introduit volontairement un bug : la boucle ne contrôle plus la dernière entrée. Que prédisez-vous : nos trois tests vont-ils le voir ? Au micro. »

ANIMATION — Activer la mutation : tout reste vert, le mutant survit. Activer le test « dernière entrée » : il rougit, le mutant est tué. À l’atelier, npm run mutation lance sept mutants contre leur suite.

TRANSITION — « Comment s’assurer que l’agent fait tout ça avant de dire “fini” ? »`,
  `⏱ 4 min · DÉFINITION DE FINI

OBJECTIF — Écrire une définition de fini vérifiable dans la skill.

DIRE — « La définition de fini, à la fin de la skill : les tests passent, la mutation ne laisse aucun survivant, la garde est verte, la couverture est relue, et le résumé cite les commandes et leurs résultats. Chaque ligne se vérifie. La garde attrape un agent qui “fait passer” les tests en les modifiant. »

→ beat 1 « L’agent l’applique, vous la vérifiez : un “tout est vert” sans commande, vous relancez vous-même. »

TRANSITION — « À vous : quarante-cinq minutes. »`,
  `⏱ 45 min · ATELIER 7 (individuel) · 14:05

OBJECTIF — Écrire la skill tests-node et sa définition de fini, faire générer la suite du journal, atteindre la mutation 7/7.

DIRE — « Quarante-cinq minutes. Ask d’abord : la liste des comportements du journal. Puis la skill, avec sa définition de fini. Puis l’agent écrit la suite. Enfin couverture et mutation : chaque mutant survivant donne une piste, ajoutez le test qui manque, un mutant à la fois. Notez votre score au premier essai. »

ANIMATION — Points d’étape à 15 et 30 min. Pièges : tests tautologiques ; new Date() au lieu de l’horloge (mutant 2) ; dernière entrée oubliée (mutant 4) ; chaînage cassé avec empreinte recalculée oublié (mutant 5, le plus souvent survivant) ; l’agent qui modifie src/journal.js « pour le rendre testable » → refuser, npm run garde. Atelier non fini : npm run reprise -- 7.

TRANSITION — « QCM, puis pause. »`,
  `⏱ 5 min · QCM MODULE 7 (vote oral)

OBJECTIF — Vérifier couverture vs mutation, horloge injectée, définition de fini.

DIRE — « Quatre questions, votez à voix haute. Et votre score de mutation au premier essai ? »

TRANSITION — « Pause. »`,
  `⏱ 15 min · PAUSE · 14:55

DIRE — « Quinze minutes de pause. Reprise à 15 h 10 : on branche de nouveaux outils à l’agent, on empaquette votre travail dans un plugin, et deux agents travaillent en parallèle. »`,
];
// @@NOTES-END
