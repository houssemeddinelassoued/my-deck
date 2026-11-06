// ─── Module 7 · Introduction aux tests unitaires avec Copilot ───────────────

const M7_Divider: Page = () => (
  <Section
    n={7}
    title={
      <>
        Tests unitaires
        <br />
        avec Copilot
      </>
    }
    sub="Copilot écrit vite des tests. Votre travail : vérifier qu’ils détectent vraiment une erreur."
    dur="J2 · 14:00 – 15:15"
    labs={<Tag tone="green" size={19}>Atelier 7 · une vraie suite de tests</Tag>}
  >
    <SecItem n={1}>Rappel : qu’est-ce qu’un test unitaire, et pourquoi en écrire ?</SecItem>
    <SecItem n={2}>Générer des tests à partir d’une fonction existante</SecItem>
    <SecItem n={3}>Nommer, organiser et structurer les tests générés</SecItem>
    <SecItem n={4}>Vérifier la cohérence des assertions</SecItem>
    <SecItem n={5}>Premiers mocks simples</SecItem>
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
        « refuse un 4e ticket en cours » : la règle, écrite et vérifiée.
      </M7Why>
      <M7Why icon="wand" tone="violet" title="La liberté de refactorer" d={300}>
        Vous l’avez vécu ce matin : sans tests, on n’ose pas toucher au legacy.
      </M7Why>
      <M7Why icon="sparkles" tone="coral" title="Le juge du code généré" d={400}>
        Avec Copilot, on écrit plus de code, plus vite : les tests disent s’il est juste.
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
    <Lede>Le motif « AAA » (Arrange, Act, Assert). Exigez-le de Copilot : ses tests deviennent lisibles d’un coup d’œil.</Lede>
    <CodeDark file="test/kanban.test.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <Ck>import</Ck> assert <Ck>from</Ck> <Cs>'node:assert/strict'</Cs>;{'\n'}
      <Ck>import</Ck> {'{ describe, it }'} <Ck>from</Ck> <Cs>'node:test'</Cs>;{'\n'}
      <Ck>import</Ck> {'{ deplacerTicket }'} <Ck>from</Ck> <Cs>'../src/kanban.js'</Cs>;{'\n\n'}
      <Cf>describe</Cf>(<Cs>'R1 · limite de travail en cours'</Cs>, () =&gt; {'{'}
      {'\n  '}
      <Cf>it</Cf>(<Cs>'refuse le 4e ticket en cours'</Cs>, () =&gt; {'{'}
    </CodeDark>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 1060, display: 'flex', flexDirection: 'column', gap: 8, ...dl(200) }}>
      <M7Band tone="blue" label="Préparer">{'const tickets = [encours(1), encours(2), encours(3), afaire(4)];'}</M7Band>
      <M7Band tone="violet" label="Agir">{'const r = deplacerTicket(tickets, 4, "encours");'}</M7Band>
      <M7Band tone="green" label="Vérifier">{'assert.deepEqual(r, { ok: false, erreur: "WIP atteint (3/3)" });'}</M7Band>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="note" tone="blue" title="Le nom dit le comportement" size={22} pad={22} cls={A.right} style={dl(300)}>
        « refuse le 4e ticket en cours », pas « test 3 ». En cas d’échec, on sait quoi chercher.
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

// ─── Générer ────────────────────────────────────────────────────────────────
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
    <Title>Générer des tests à partir d’une fonction existante</Title>
    <Lede>Trois chemins. Le meilleur pour débuter : faire lister les cas d’abord, puis générer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M7Way n={1} tone="blue" title="/tests sur la sélection" d={100} prompt={<><Kbd>Ctrl+I</Kbd> sur la fonction, puis <Ic>/tests</Ic></>}>
        Rapide. Mais Copilot choisit seul les cas : souvent les nominaux, rarement les bords.
      </M7Way>
      <M7Way n={2} tone="green" title="La liste des cas d’abord" d={220} prompt={<Pr>« #file:src/kanban.js — Liste les cas à tester pour deplacerTicket : nominaux, limites, erreurs. Pas de code. »</Pr>}>
        Vous relisez et complétez la liste. Puis : « Génère un test par cas, node:test, AAA ».
      </M7Way>
      <M7Way n={3} tone="violet" title="L’agent écrit et exécute" d={340} prompt={<Pr>« Écris test/kanban.test.js et lance npm test. »</Pr>}>
        Il itère jusqu’au vert… parfois en affaiblissant les tests. Relisez le diff.
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
      <CodeDark file="test/kanban.test.js · structure" size={20}>
        <Cc>{'// une fabrique : des données de test lisibles'}</Cc>
        {'\n'}
        <Ck>const</Ck> ticket = (id, statut, points = <Cn>3</Cn>) =&gt; ({'{ id, statut, points }'});{'\n\n'}
        <Cf>describe</Cf>(<Cs>'R1 · limite de travail en cours'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'accepte le 3e ticket en cours'</Cs>){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'refuse le 4e ticket en cours'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'R2 · Definition of Ready'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'bloque un ticket non estimé dans le backlog'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'R4 · immuabilité'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'ne modifie pas le tableau d’origine'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'Erreurs'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'signale un id inconnu sans planter'</Cs>)
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 210, width: 740, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="doc" tone="blue" title="Un fichier par module" d={200}>
        <Ic>src/kanban.js</Ic> ↔ <Ic>test/kanban.test.js</Ic>
      </Row2>
      <Row2 icon="layers" tone="violet" title="Un describe par règle" d={300}>
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
      <M7Trap n={1} title="Le test tautologique" bad={'const attendu = tickets.filter((t) => t.statut === "encours").length;\nassert.equal(compterEnCours(tickets), attendu);'} why="Il recalcule l’attendu avec la même logique que le code : faux et faux donnent vert." d={100} />
      <M7Trap n={2} title="L’assertion trop molle" bad={'const r = deplacerTicket(tickets, 4, "encours");\nassert.ok(r);'} why="Un objet est toujours « vrai » : le refus comme l’acceptation passent." d={200} />
      <M7Trap n={3} title="equal au lieu de deepEqual" bad={'assert.equal(r.tickets, attendu); // deux objets'} why="equal compare des références : il échoue toujours, ou on le « corrige » mal." d={300} />
      <M7Trap n={4} title="L’attendu recopié du résultat" bad={'// généré en lançant le code actuel :\nassert.equal(stats.avancement, NaN);'} why="Le test fige le bug au lieu de le révéler. L’attendu vient de la règle, pas du code." d={400} />
    </div>
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
        <CodeDark file="src/kanban.js" size={21}>
          <Ck>if</Ck> (enCours <span style={{ background: mut ? 'rgba(242,139,130,.35)' : 'rgba(155,226,155,.2)', borderRadius: 4, padding: '0 4px' }}>{mut ? '>' : '>='}</span> LIMITE_WIP){'\n  '}
          <Ck>return</Ck> {'{ ok: false, erreur: … };'}
        </CodeDark>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toggle on={mut} onChange={setMut} tone="coral" size={24} label={<span style={{ fontWeight: 600 }}>Introduire la mutation (&gt;= devient &gt;)</span>} />
          <Toggle on={full} onChange={setFull} tone="green" size={24} label={<span style={{ fontWeight: 600 }}>Ajouter le test de la limite exacte</span>} />
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PanelTitle icon="flask" c={C.pink}>
          npm test
        </PanelTitle>
        <M7Res ok>accepte un ticket estimé hors du backlog</M7Res>
        <M7Res ok>bloque un ticket non estimé</M7Res>
        <M7Res ok>refuse le 6e ticket quand 5 sont en cours</M7Res>
        {full ? <M7Res ok={!mut}>refuse le 4e ticket quand 3 sont en cours</M7Res> : null}
        <div style={{ marginTop: 6, borderRadius: 12, padding: '12px 16px', fontSize: 22, lineHeight: 1.4, background: mut ? (full ? T.green.bg : T.coral.bg) : T.grey.bg }}>
          {!mut ? 'Tout est vert : normal, le code est juste.' : full ? 'Un test rougit : la mutation est « tuée ». Votre filet fonctionne.' : 'Tout reste vert malgré le bug : votre suite a un trou à la limite exacte.'}
        </div>
      </div>
    </div>
  );
};

const M7_Mutation: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Le test de mutation : casser exprès pour vérifier le filet</Title>
    <Lede>On introduit volontairement un bug. Si aucun test ne rougit, il manque un test. Que prédisez-vous ? Au micro, puis je bascule.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M7Mutant />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      À l’Atelier 7, vous le ferez pour de vrai, à la main, sur votre propre suite.
    </Hint>
  </Frame>
);

// ─── Mocks ──────────────────────────────────────────────────────────────────
const M7_Mocks: Page = () => (
  <Frame mod={7} kind="demo" beats={1}>
    <Title>Premiers mocks : remplacer ce qui est lent ou imprévisible</Title>
    <Lede>Réseau, date du jour, hasard : un test unitaire ne doit dépendre d’aucun. On les injecte, puis on les simule.</Lede>
    <CodeDark file="test/api-charger.test.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <Ck>import</Ck> {'{ describe, it, mock }'} <Ck>from</Ck> <Cs>'node:test'</Cs>;{'\n\n'}
      <Ck>const</Ck> reponse = (status, corps) =&gt; ({'{'}
      {'\n  '}ok: status &lt; <Cn>300</Cn>, status, json: <Ck>async</Ck> () =&gt; corps,{'\n'}
      {'});\n\n'}
      <Cf>it</Cf>(<Cs>'lève « HTTP 500 » quand le serveur est en panne'</Cs>, <Ck>async</Ck> () =&gt; {'{'}
      {'\n  '}
      <Ck>const</Ck> fetchFn = mock.fn(<Ck>async</Ck> () =&gt; reponse(<Cn>500</Cn>, {'{}'}));{'\n  '}
      <Ck>await</Ck> assert.rejects(chargerTickets(<Cs>'/api'</Cs>, {'{ fetchFn }'}), /HTTP 500/);{'\n  '}
      assert.equal(fetchFn.mock.callCount(), <Cn>1</Cn>);{'\n'}
      {'});'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="plug" tone="blue" title="Injecter" size={21} pad={22} cls={A.right} style={dl(200)}>
        <Ic>fetchFn</Ic> en paramètre, <Ic>aujourdHui</Ic> en paramètre : le code est testable par construction.
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

// ─── Atelier 7 ──────────────────────────────────────────────────────────────
const M7_Lab: Page = () => (
  <LabPage
    mod={7}
    n="7"
    title="Une vraie suite de tests, générée et vérifiée"
    defi="tests"
    who="Individuel · 40 min"
    objective={
      <>
        Faire générer une suite <strong>lisible</strong> (AAA, noms en phrases) pour <Ic>deplacerTicket</Ic>, tester <Ic>chargerTickets</Ic> <strong>sans réseau</strong> avec un mock, puis prouver par une mutation que les tests détectent une erreur.
      </>
    }
    where={
      <>
        <PathChip size={19}>test/kanban.test.js</PathChip>
        <br />
        <PathChip size={19}>test/api-charger.test.js</PathChip>
        <br />
        <PathChip size={19}>npm run couverture</PathChip>
      </>
    }
    minutes={40}
    crit={
      <>
        <CheckItem id="l7a" size={21}>10 tests ou plus, groupés par règle</CheckItem>
        <CheckItem id="l7b" size={21}>3 tests de l’API, zéro réseau</CheckItem>
        <CheckItem id="l7c" size={21}>Mutation &gt;= → &gt; détectée</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (liste des cas), 30 min (suite verte), 45 min (mutation)."
  >
    <WStep n={1}>Ask : faites lister les cas (nominaux, limites, erreurs) ; complétez la liste vous-même.</WStep>
    <WStep n={2}>Générez un test par cas, puis supprimez ou durcissez chaque test qui ne pourrait pas échouer.</WStep>
    <WStep n={3}>Mock de fetch pour l’API ; mutation à la main ; couverture ; commit.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <Frame mod={7} kind="qcm">
    <Title>QCM · Module 7 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Un test généré calcule l’attendu avec tickets.filter(…), exactement comme le code testé. Problème ?" explain="C’est un test tautologique : si la logique est fausse, l’attendu l’est aussi, et le test reste vert. L’attendu doit venir de la règle (une valeur écrite à la main).">
        <QOpt>Aucun, c’est plus court</QOpt>
        <QOpt>Il ne peut pas détecter une erreur de cette logique</QOpt>
        <QOpt ok>Il sera trop lent</QOpt>
      </QuizQ>
      <QuizQ q="Pour comparer deux objets dans un test node:test, on utilise…" explain="deepEqual compare le contenu ; equal compare les références (deux objets distincts ne sont jamais « égaux »).">
        <QOpt ok>assert.equal</QOpt>
        <QOpt>assert.deepEqual</QOpt>
        <QOpt>assert.ok</QOpt>
      </QuizQ>
      <QuizQ q="Vous changez >= en > dans la règle WIP et tous les tests restent verts. Conclusion ?" explain="La mutation survit : aucun test ne vérifie la limite exacte (3 en cours → le 4e refusé). Il faut écrire ce test.">
        <QOpt>Le code est robuste</QOpt>
        <QOpt ok>Il manque un test sur la limite exacte</QOpt>
        <QOpt>Les tests sont trop nombreux</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi passer fetchFn et aujourdHui en paramètres ?" explain="Pour les remplacer dans les tests par des valeurs contrôlées : pas de réseau, pas de date qui change, des tests déterministes.">
        <QOpt>Pour respecter une convention JavaScript</QOpt>
        <QOpt>Pour pouvoir les simuler et rendre les tests déterministes</QOpt>
        <QOpt ok>Pour que Copilot comprenne mieux</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Divider, M7_Pourquoi, M7_AAA, M7_Generer, M7_Organiser, M7_Assertions, M7_Mutation, M7_Mocks, M7_Lab, M7_Qcm];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 7 · 14:00

OBJECTIF — Annoncer les tests, et l’angle : vérifier les tests générés.

DIRE — « Re-bonjour ! Module 7 : les tests unitaires. Copilot écrit des tests très vite. Notre travail cet après-midi : vérifier qu’ils servent à quelque chose, c’est-à-dire qu’ils échouent quand le code est faux. »

TRANSITION — « Petit rappel : qu’est-ce qu’un test unitaire ? »`,
  `⏱ 4 min · POURQUOI DES TESTS

OBJECTIF — Rappeler la définition et les raisons d’être, en lien avec Copilot.

DIRE — « Un test unitaire, c’est un petit programme qui appelle une fonction dans une situation donnée et vérifie le résultat. Il s’exécute en millisecondes. Quatre raisons d’en écrire : un filet de sécurité, une documentation qui ne ment pas, la liberté de refactorer, vous l’avez vécu ce matin, et le juge du code généré. Avec Copilot, on écrit plus de code, plus vite ; les tests disent s’il est juste. Ce sont les plus nombreux de la pyramide. »

TRANSITION — « À quoi ressemble un bon test ? »`,
  `⏱ 4 min · AAA

OBJECTIF — Fixer la structure Préparer / Agir / Vérifier et le nommage.

DIRE — « Trois temps. Préparer : trois tickets en cours, un à faire. Agir : on essaie de déplacer le quatrième. Vérifier : on attend un refus avec un message précis. Le nom du test dit le comportement, “refuse le 4e ticket en cours”, pas “test 3”. Et un comportement par test. Avec node:test et node:assert, tout est inclus dans Node. »

TRANSITION — « Comment faire écrire ça par Copilot ? »`,
  `⏱ 5 min · GÉNÉRER DES TESTS (démo)

OBJECTIF — Présenter trois chemins de génération et recommander « la liste d’abord ».

DIRE — « Premier chemin : Ctrl+I puis /tests. Rapide, mais Copilot choisit les cas, souvent les plus évidents. Deuxième chemin, celui que je recommande : demander d’abord la liste des cas, sans code, la compléter, puis générer un test par cas. Troisième : l’agent écrit et lance les tests ; il itère jusqu’au vert, parfois en affaiblissant un test pour qu’il passe. Et un piège : un test généré qui passe du premier coup ne prouve rien. »

ANIMATION — Montrer en direct le chemin 2 sur src/kanban.js.

TRANSITION — « Les tests générés, il faut aussi les ranger. »`,
  `⏱ 4 min · ORGANISER

OBJECTIF — Donner les conventions de structure.

DIRE — « Un fichier de tests par module. Un describe par règle : la sortie des tests se lit comme la spécification. Des noms en phrases. Une petite fabrique de données, comme ticket(id, statut), pour que chaque test montre seulement ce qui compte. Et un comportement par test : s’il échoue, une seule raison possible. Demandez explicitement cette structure à Copilot. »

TRANSITION — « Maintenant, le plus important : vérifier les assertions. »`,
  `⏱ 6 min · VÉRIFIER LES ASSERTIONS

OBJECTIF — Faire reconnaître les quatre pièges des tests générés.

DIRE — « Une seule question pour chaque test : échouerait-il si le code était faux ? Piège 1 : le test tautologique, qui recalcule l’attendu avec la même logique que le code. Piège 2 : l’assertion trop molle, assert.ok d’un objet, toujours vrai. Piège 3 : equal au lieu de deepEqual sur des objets. Piège 4, le plus sournois : l’attendu recopié du résultat actuel ; le test fige le bug. L’attendu vient de la règle, pas du code. »

TRANSITION — « Un outil pour vérifier tout ça d’un coup : la mutation. »`,
  `⏱ 5 min · MUTATION (exercice oral)

OBJECTIF — Faire comprendre le test de mutation par la prédiction.

DIRE — « On casse exprès : le supérieur ou égal devient supérieur strict. Notre suite a trois tests. Prédiction : est-ce qu’un test va rougir ? Dites-le au micro. »

ANIMATION — Activer la mutation : tout reste vert (la suite n’a pas de test sur la limite exacte). Puis activer « Ajouter le test de la limite exacte » : un test rougit. Désactiver la mutation : tout redevient vert.

TRANSITION — « Dernier outil : les mocks. »`,
  `⏱ 5 min · MOCKS (démo)

OBJECTIF — Montrer un mock simple de fetch avec node:test.

DIRE — « Un test unitaire ne doit dépendre ni du réseau, ni de la date, ni du hasard. Vous avez déjà préparé le terrain : fetchFn et aujourdHui sont des paramètres. Dans le test, je passe une fausse fonction, créée avec mock.fn, qui répond 500. Je vérifie l’erreur, et que fetch a été appelé une fois. » → beat 1 « Sans excès : vérifiez le résultat, pas chaque appel interne, sinon le moindre refactoring casse vos tests. »

TRANSITION — « À vous : cinquante minutes. »`,
  `⏱ 40 min · ATELIER 7 (individuel) · 14:30

OBJECTIF — Générer, durcir et prouver une suite de tests, avec un mock.

DIRE — « Cinquante minutes, énoncé dans ateliers/atelier-07-tests. La liste des cas d’abord, puis la génération, puis la chasse aux tests qui ne peuvent pas échouer. Ensuite le mock de fetch, la mutation à la main, et la couverture. »

ANIMATION — Points d’étape à 15, 30 et 45 min. Pièges : tests tautologiques ; equal sur objets ; date du jour dans un test. Bloqué sur kanban.js : point de reprise reprises/fin-atelier-06.

TRANSITION — « QCM, et nous attaquons les bonnes pratiques. »`,
  `⏱ 5 min · QCM MODULE 7 (vote oral)

OBJECTIF — Vérifier la lecture critique des tests.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Module 8 : les bonnes pratiques de vérification. »`,
];
// @@NOTES-END
