// ─── Module 4 · Génération de code simple ───────────────────────────────────

const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Génération de
        <br />
        code simple
      </>
    }
    sub="Des noms et des commentaires qui guident, du code qui se vérifie : le premier morceau de TaskFlow."
    dur="J1 · 14:55 – 16:55"
    labs={<Tag tone="green" size={19}>Atelier 4 · TaskFlow v1, le modèle de ticket</Tag>}
  >
    <SecItem n={1}>Variables, constantes et structures de base</SecItem>
    <SecItem n={2}>Compléter une fonction à partir de son nom ou d’un commentaire</SecItem>
    <SecItem n={3}>Le commentaire comme guide de génération</SecItem>
    <SecItem n={4}>Python, JavaScript, Java : même demande, trois langages</SecItem>
    <SecItem n={5}>Patterns courants et comportements attendus</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Variables, constantes, structures ──────────────────────────────────────
const Gh = ({ children }: { children: ReactNode }) => <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>{children}</span>;

const M4_Structures: Page = () => (
  <Frame mod={4} kind="demo" beats={2}>
    <Title>Variables, constantes et structures : le terrain favori</Title>
    <Lede>Vous tapez le début, Copilot devine la suite à partir des noms et de ce qu’il voit déjà dans le fichier.</Lede>
    <CodeDark file="src/tickets.js" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Cc>{'// Statuts, dans l’ordre du flux'}</Cc>
      {'\n'}
      <Ck>export const</Ck> STATUTS = Object.freeze([<Gh>{'\n  "backlog", "afaire", "encours", "termine",\n]);'}</Gh>
      {'\n\n'}
      <span className={b.fade(1)}>
        <Ck>export const</Ck> LIBELLES = {'{'}
        {'\n'}
        <Gh>{'  backlog: "Backlog",\n  afaire: "À faire",\n  encours: "En cours",\n  termine: "Terminé",\n};'}</Gh>
      </span>
      {'\n\n'}
      <span className={b.fade(2)}>
        <Ck>const</Ck> ticketVide = {'{'}<Gh>{'\n  id: 0, titre: "", type: "tache",\n  priorite: 2, points: null,\n};'}</Gh>
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 270, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Ce qui marche" size={22} pad={24} cls={A.right} style={dl(200)}>
        Des noms du domaine (<Ic>STATUTS</Ic>, <Ic>LIBELLES</Ic>) et un premier exemple : la suite devient évidente.
      </Card>
      <Card icon="eye" tone="yellow" title="Ce qu’on vérifie" size={22} pad={24} cls={b.on(1)}>
        L’ordre, l’orthographe exacte des clés, les accents des libellés, aucune valeur inventée.
      </Card>
      <Card icon="bulb" tone="blue" title="L’astuce" size={22} pad={24} cls={b.on(2)}>
        La 2e structure profite de la 1re : Copilot réutilise les mêmes clés. Écrivez d’abord la plus importante.
      </Card>
    </div>
  </Frame>
);

// ─── Le nom de la fonction ──────────────────────────────────────────────────
const M4_NomFonction: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Un bon nom vaut un bon prompt</Title>
    <Lede>Le nom et les paramètres sont la première chose que Copilot lit. Ils disent ce que la fonction doit faire.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 820 }}>
      <PanelTitle icon="x" c={C.coral}>
        Nom vague : Copilot devine
      </PanelTitle>
      <CodeDark size={22}>
        <Ck>function</Ck> <Cf>calc</Cf>(x, y) {'{'}
        {'\n  '}
        <Gh>return x * y / 100;</Gh>
        {'\n}'}
      </CodeDark>
      <div style={{ marginTop: 14, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Un pourcentage ? Une surface ? Le modèle choisit le motif le plus fréquent.</div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <PanelTitle icon="check" c={C.green}>
        Nom précis : Copilot exécute
      </PanelTitle>
      <CodeDark size={20}>
        <Ck>function</Ck> <Cf>convertirPointsEnJours</Cf>(points, pointsParJour = <Cn>2</Cn>) {'{'}
        {'\n  '}
        <Gh>if (points == null) return null;</Gh>
        {'\n  '}
        <Gh>return Math.ceil(points / pointsParJour);</Gh>
        {'\n}'}
      </CodeDark>
      <div style={{ marginTop: 14, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Verbe + objet + unité, une valeur par défaut : l’intention est sans ambiguïté.</div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Callout tone="blue" icon="note" title="Verbe d’action" size={22} cls={A.in} style={dl(400)}>
        convertir, valider, trier, filtrer, compter…
      </Callout>
      <Callout tone="blue" icon="ticket" title="Vocabulaire métier" size={22} cls={A.in} style={dl(500)}>
        ticket, statut, points : les mots du projet
      </Callout>
      <Callout tone="blue" icon="gear" title="Paramètres parlants" size={22} cls={A.in} style={dl(600)}>
        unités, valeurs par défaut, types en JSDoc
      </Callout>
    </div>
  </Frame>
);

// ─── Le commentaire comme guide (interactif) ────────────────────────────────
const M4_ING = [
  { key: 'Entrée', tone: 'blue' as Tone, line: '// Entrée : un ticket { points: number | null }' },
  { key: 'Sortie', tone: 'teal' as Tone, line: '// Sortie : true ou false' },
  { key: 'Règle', tone: 'violet' as Tone, line: '// Règle : null (non estimé) ou valeur de 1, 2, 3, 5, 8, 13' },
  { key: 'Exemple', tone: 'green' as Tone, line: '// Ex. : 5 → true · 4 → false · null → true' },
  { key: 'Contrainte', tone: 'coral' as Tone, line: '// Sans bibliothèque ; "5" (texte) → false' },
];
const M4_OUT = [
  'return points > 0;',
  'return typeof points === "number";',
  'return points === null || points > 0;',
  'return points === null || [1, 2, 3, 5, 8, 13].includes(points);',
  'return points === null || [1, 2, 3, 5, 8, 13].includes(points);',
  'return points === null || POINTS_VALIDES.includes(points); // "5" → false',
];

const M4Builder = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const n = on.filter(Boolean).length;
  const quality = n <= 1 ? 'coral' : n <= 3 ? 'yellow' : 'green';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '440px minmax(0, 1fr)', gap: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {M4_ING.map((g, i) => (
          <Toggle key={g.key} on={on[i]} tone={g.tone} size={24} label={<span style={{ fontWeight: 600 }}>{g.key}</span>} onChange={(v) => setOn(on.map((x, j) => (j === i ? v : x)))} />
        ))}
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Rien
          </Btn>
        </div>
      </div>
      <div>
        <CodeDark file="src/tickets.js" size={21}>
          <Cc>{'// Vérifie les points'}</Cc>
          {M4_ING.map((g, i) => (on[i] ? <Cc key={g.key}>{`\n${g.line}`}</Cc> : null))}
          {'\n'}
          <Ck>function</Ck> <Cf>estPointsValide</Cf>(points) {'{'}
          {'\n  '}
          <Gh>{M4_OUT[n]}</Gh>
          {'\n}'}
        </CodeDark>
        <div style={{ marginTop: 16, borderRadius: 14, padding: '14px 20px', fontSize: 23, lineHeight: 1.4, background: T[quality].bg, color: C.ink }}>
          <strong style={{ color: T[quality].fg }}>{n}/5 ingrédients · </strong>
          {n <= 1 ? 'Copilot devine : « 4 » passerait.' : n <= 3 ? 'Mieux, mais un cas limite reste ouvert.' : 'Précis et vérifiable : la suggestion respecte la règle et ses pièges.'}
        </div>
      </div>
    </div>
  );
};

const M4_Commentaire: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Le commentaire comme guide : 5 ingrédients</Title>
    <Lede>Dites-moi quel ingrédient ajouter au micro : j’active, et l’on regarde la suggestion probable évoluer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M4Builder />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Suggestions illustratives : en vrai, chaque essai varie. Mais la tendance est toujours la même.
    </Hint>
  </Frame>
);

// ─── Trois langages ─────────────────────────────────────────────────────────
const M4_Langages: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Même commentaire, trois langages</Title>
    <Lede>Copilot connaît la syntaxe et les idiomes de chaque langage. Cliquez un onglet : la règle métier ne change pas, l’écriture si.</Lede>
    <LangTabs initial="JavaScript" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="JavaScript" tone="yellow" />
        <LangBtn lang="Python" tone="green" />
        <LangBtn lang="Java" tone="coral" />
      </div>
      <LangPane lang="JavaScript">
        <CodeDark file="src/tickets.js" size={21}>
          <Cc>{'// Vrai si points vaut null ou 1, 2, 3, 5, 8, 13'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>estPointsValide</Cf>(points) {'{'}
          {'\n  '}
          <Gh>return points === null || POINTS_VALIDES.includes(points);</Gh>
          {'\n}'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="katas/python/tickets.py" size={21}>
          <Cc>{'# Vrai si points vaut None ou 1, 2, 3, 5, 8, 13'}</Cc>
          {'\n'}
          <Ck>def</Ck> <Cf>est_points_valide</Cf>(points) -&gt; <Cn>bool</Cn>:{'\n    '}
          <Gh>{'if points is None:\n        return True\n    return type(points) is int and points in POINTS_VALIDES'}</Gh>
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="katas/java/Ticket.java" size={21}>
          <Cc>{'// Vrai si points vaut null ou 1, 2, 3, 5, 8, 13'}</Cc>
          {'\n'}
          <Ck>static boolean</Ck> <Cf>estPointsValide</Cf>(Integer points) {'{'}
          {'\n    '}
          <Gh>return points == null || POINTS_VALIDES.contains(points);</Gh>
          {'\n}'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1230, top: 270, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="bug" tone="coral" title="Le piège qui change" size={22} pad={24} cls={A.right} style={dl(200)}>
        En Python, <Ic>True == 1</Ic> : sans <Ic>type(points) is int</Ic>, un booléen passerait. Copilot l’oublie presque toujours.
      </Card>
      <Card icon="layers" tone="blue" title="Ce qui ne change pas" size={22} pad={24} cls={A.right} style={dl(350)}>
        Le commentaire, la règle, les tests d’acceptation. Variantes Python et Java fournies dans <Ic>katas/</Ic>.
      </Card>
    </div>
  </Frame>
);

// ─── Patterns courants ──────────────────────────────────────────────────────
const M4Pat = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M4_Patterns: Page = () => (
  <Frame mod={4}>
    <Title>Les patterns que Copilot reconnaît au premier coup d’œil</Title>
    <Lede>Plus un motif est répandu, plus la suggestion est rapide et fiable. Écrivez le premier cas, il fait les suivants.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M4Pat icon="loop" tone="blue" title="La répétition" d={100}>
        Un cas de <Ic>switch</Ic> ou une ligne de table de correspondance : il écrit les autres.
      </M4Pat>
      <M4Pat icon="reset" tone="teal" title="Le miroir" d={180}>
        <Ic>exporterCsv</Ic> après <Ic>parserCsv</Ic>, <Ic>set</Ic> après <Ic>get</Ic> : la fonction inverse.
      </M4Pat>
      <M4Pat icon="layers" tone="violet" title="La série" d={260}>
        Jours, mois, codes HTTP, suite de Fibonacci : il complète la liste.
      </M4Pat>
      <M4Pat icon="doc" tone="navy" title="Le squelette" d={340}>
        <Ic>try / catch</Ic>, boucle de lecture, export de module, en-tête de test.
      </M4Pat>
      <M4Pat icon="route" tone="green" title="La conversion" d={420}>
        Dates, unités, formats : à condition de préciser l’entrée et la sortie.
      </M4Pat>
      <M4Pat icon="flask" tone="pink" title="Le test jumeau" d={500}>
        Un premier test écrit, et les cas voisins arrivent un par un.
      </M4Pat>
    </div>
  </Frame>
);

// ─── Comportements attendus ─────────────────────────────────────────────────
const M4_Comportements: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Comportement attendu : Copilot imite votre fichier</Title>
    <Lede>Il prolonge le style qu’il voit, le bon comme le mauvais. Même demande, deux fichiers :</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <PanelTitle icon="archive" c={C.coral}>
        Dans le vieux fichier legacy
      </PanelTitle>
      <CodeDark file="src/legacy/kanban-legacy.js" size={21}>
        <Ck>var</Ck> LIMITE = <Cn>3</Cn>;{'\n'}
        <Ck>function</Ck> <Cf>compter</Cf>(l, s) {'{'}
        {'\n  '}
        <Gh>{'var n = 0;\n  for (var k = 0; k < l.length; k++)\n    if (l[k].statut == s) n = n + 1;\n  return n;'}</Gh>
        {'\n}'}
      </CodeDark>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 262, width: 820 }}>
      <PanelTitle icon="check" c={C.green}>
        Dans le fichier moderne
      </PanelTitle>
      <CodeDark file="src/kanban.js" size={21}>
        <Ck>export const</Ck> LIMITE_WIP = <Cn>3</Cn>;{'\n'}
        <Ck>export function</Ck> <Cf>compterParStatut</Cf>(tickets, statut) {'{'}
        {'\n  '}
        <Gh>{'return tickets.filter((t) => t.statut === statut).length;'}</Gh>
        {'\n}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 690, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Callout tone="yellow" icon="eye" title="Il imite" size={22} cls={A.in} style={dl(400)}>
        var, ==, noms d’une lettre : il continue. Nettoyez d’abord, générez ensuite.
      </Callout>
      <Callout tone="yellow" icon="sparkles" title="Il invente" size={22} cls={A.in} style={dl(500)}>
        Une fonction voisine plausible mais absente : vérifiez qu’elle existe.
      </Callout>
      <Callout tone="yellow" icon="clock" title="Il date" size={22} cls={A.in} style={dl(600)}>
        Une syntaxe ou une API d’il y a quelques années : vérifiez la version.
      </Callout>
    </div>
  </Frame>
);

// ─── Pause ──────────────────────────────────────────────────────────────────
const M4_Pause: Page = () => <BreakPage mod={4} title="Pause" back="Reprise à 15 h 55 : l’Atelier 4, le premier morceau de TaskFlow." minutes={15} />;

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M4_Lab: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="TaskFlow v1 : le modèle de ticket"
    defi="commentaire"
    who="Individuel · 55 min"
    feats={<Tag tone="grey" size={19}>Variantes Python · Java</Tag>}
    objective={
      <>
        Générer, <strong>commentaire par commentaire</strong>, les constantes, <Ic>estPointsValide</Ic>, <Ic>validerTicket</Ic> et <Ic>creerTicket</Ic>. Les <strong>8 tests d’acceptation</strong> fournis passent au vert, sans être modifiés.
      </>
    }
    where={
      <>
        <PathChip size={19}>src/tickets.js</PathChip>
        <br />
        <PathChip size={19}>npm run test:atelier4</PathChip> au vert
        <br />
        Un commit « Atelier 4 »
      </>
    }
    minutes={55}
    crit={
      <>
        <CheckItem id="l4a" size={21}>8 tests au vert, tests intacts</CheckItem>
        <CheckItem id="l4b" size={21}>Points 4 et "5" refusés</CheckItem>
        <CheckItem id="l4c" size={21}>Aucun new Date() dans tickets.js</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (constantes), 30 min (validerTicket), 45 min (tout vert ?)."
  >
    <WStep n={1}>
      <Ic>npm run test:atelier4</Ic> : lisez les échecs, ce sont vos spécifications.
    </WStep>
    <WStep n={2}>Une fonction à la fois : curseur sous le commentaire, lire, accepter ou préciser le commentaire, tester.</WStep>
    <WStep n={3}>Tout est vert ? Commit, puis la variante Python ou Java de votre choix.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <Frame mod={4} kind="qcm">
    <Title>QCM · Module 4 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Copilot propose points > 0 && points <= 13 pour valider une estimation. Le problème ?" explain="La suite 1-2-3-5-8-13 est une liste, pas un intervalle : 4, 6 ou 7 passeraient. Un exemple négatif dans le commentaire (« 4 → false ») l’évite.">
        <QOpt>Aucun, c’est plus court</QOpt>
        <QOpt ok>4, 6, 7… passeraient : c’est une liste, pas un intervalle</QOpt>
        <QOpt>Il faudrait points {'>='} 0</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient de commentaire réduit le plus les cas limites oubliés ?" explain="Les exemples, surtout négatifs (4 → false, null → true), forcent la suggestion à couvrir les bords.">
        <QOpt>Le nom de l’auteur</QOpt>
        <QOpt ok>Des exemples, y compris des cas refusés</QOpt>
        <QOpt>La date de création</QOpt>
      </QuizQ>
      <QuizQ q="Dans un fichier rempli de var et de ==, Copilot propose du code… avec var et ==. Pourquoi ?" explain="Il imite le style visible dans le contexte. Nettoyer le fichier (ou générer dans un fichier propre) change les suggestions.">
        <QOpt>Son modèle date de 2015</QOpt>
        <QOpt ok>Il prolonge le style qu’il voit dans le fichier</QOpt>
        <QOpt>Les réglages de VS Code l’imposent</QOpt>
      </QuizQ>
      <QuizQ q="En Python, quel cas Copilot oublie-t-il souvent pour est_points_valide ?" explain="True == 1 en Python : sans vérifier type(points) is int, un booléen serait accepté comme 1 point.">
        <QOpt>None</QOpt>
        <QOpt ok>True, qui vaut 1</QOpt>
        <QOpt>13</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Bilan du Jour 1 ────────────────────────────────────────────────────────
const M4Key = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '20px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const M4_Bilan: Page = () => (
  <Frame mod={4} kind="synthese" label="Bilan du Jour 1">
    <Title>Bilan du Jour 1 : quatre réflexes acquis</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <M4Key n={1} tone="blue" title="Copilot prédit, il ne vérifie pas" d={100}>
        Du code plausible, à rendre correct par la lecture et les tests.
      </M4Key>
      <M4Key n={2} tone="navy" title="Un poste réglé, des gestes au clavier" d={200}>
        Tab, Échap, Ctrl+→, Alt+], Ctrl+I, Ctrl+Alt+I : sans souris.
      </M4Key>
      <M4Key n={3} tone="teal" title="Le contexte fait la suggestion" d={300}>
        Onglets utiles ouverts, conversation propre, références explicites.
      </M4Key>
      <M4Key n={4} tone="green" title="Le commentaire est un prompt" d={400}>
        Entrée, sortie, règle, exemple, contrainte : et un test pour prouver.
      </M4Key>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(600) }}>
      <PanelTitle icon="users">Restitution : deux minutes chacun, au micro</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24, marginTop: 4 }}>
        <Bullet size={23}>Combien de tests verts à l’Atelier 4 ?</Bullet>
        <Bullet size={23}>Une suggestion que vous avez eu raison de refuser</Bullet>
        <Bullet size={23}>Le réglage ou le geste qui vous a le plus servi</Bullet>
      </div>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, ...dl(800) }}>
      Au-delà de 10 participants : 5 ou 6 volontaires au micro, les autres dans le clavardage.
    </Hint>
  </Frame>
);

// ─── Billet de sortie ───────────────────────────────────────────────────────
const M4_Sortie: Page = () => (
  <Frame mod={4} kind="exercice" label="Fin du Jour 1">
    <Title>Billet de sortie, et rendez-vous demain</Title>
    <Lede>Une phrase chacun, au micro : ce que vous retenez, ce qui reste flou.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Key n={1} tone="blue" title="Ce que je retiens" d={100}>
        Le geste ou l’idée que vous utiliserez dès demain matin.
      </M4Key>
      <M4Key n={2} tone="yellow" title="Ce qui reste flou" d={200}>
        J’y réponds en ouverture du Jour 2.
      </M4Key>
      <M4Key n={3} tone="green" title="Mon score d’atelier" d={300}>
        Nombre de tests verts sur 8, à noter dans JOURNAL.md.
      </M4Key>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1140, top: 262, width: 660, ...dl(400) }}>
      <Card icon="rocket" tone="violet" title="Demain · Jour 2" size={23} pad={28}>
        TaskFlow grandit : fonctions complètes et classe, import CSV et API, refactoring d’un vieux code, vraie suite de tests, et une revue où vous chasserez 8 défauts.
        <div style={{ marginTop: 18, fontSize: 21, color: C.muted }}>9 h 00 · quiz de reprise sur le Jour 1. Pas fini l’Atelier 4 ? Le point de reprise est dans <Ic>reprises/</Ic>.</div>
      </Card>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M4_Divider, M4_Structures, M4_NomFonction, M4_Commentaire, M4_Langages, M4_Patterns, M4_Comportements, M4_Pause, M4_Lab, M4_Qcm, M4_Bilan, M4_Sortie];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 4 · 14:55

OBJECTIF — Annoncer le passage à la génération guidée.

DIRE — « Module 4 : générer du code simple. Variables, fonctions à partir d’un nom ou d’un commentaire, trois langages, et les comportements à attendre. Puis vous écrirez avec Copilot le premier morceau de TaskFlow : le modèle de ticket. »

TRANSITION — « Commençons par ce que Copilot fait le mieux. »`,
  `⏱ 5 min · STRUCTURES (démo)

OBJECTIF — Montrer la complétion de constantes et de structures, et ce qu’on y vérifie.

DIRE — « Je tape export const STATUTS, avec un commentaire qui dit “dans l’ordre du flux”, et Copilot propose les quatre statuts. » → beat 1 « Une table de libellés : il reprend les mêmes clés, puisqu’il les voit juste au-dessus. Je vérifie l’orthographe, les accents. » → beat 2 « Un ticket vide : il réutilise les valeurs par défaut probables. L’astuce : écrivez d’abord la structure la plus importante, les suivantes s’en inspirent. »

ANIMATION — Faire en direct dans src/tickets.js d’une copie du dépôt, puis annuler.

TRANSITION — « Pour une fonction, tout commence par son nom. »`,
  `⏱ 4 min · NOM DE FONCTION

OBJECTIF — Faire du nommage un levier de génération.

DIRE — « À gauche, calc de x et y : Copilot choisit le motif le plus fréquent, un pourcentage peut-être. Aucun moyen de savoir. » → beat 1 « À droite, convertirPointsEnJours, avec points et pointsParJour par défaut : l’intention est claire, la suggestion aussi, et elle gère même le ticket non estimé. Trois règles : un verbe d’action, le vocabulaire du métier, des paramètres parlants. »

TRANSITION — « Quand le nom ne suffit pas : le commentaire. »`,
  `⏱ 6 min · LE COMMENTAIRE GUIDE (exercice oral)

OBJECTIF — Faire découvrir les 5 ingrédients d’un commentaire efficace.

DIRE — « Un commentaire vague : “vérifie les points”. Regardez la suggestion : points supérieurs à zéro. 4 passerait. Quel ingrédient ajouter ? Dites-le au micro. »

ANIMATION — Activer les ingrédients dans l’ordre proposé par les participants. Faire remarquer : la règle seule ne suffit pas ; c’est l’exemple négatif (« 4 → false ») et la contrainte (« "5" texte → false ») qui ferment les cas limites. Préciser que les suggestions affichées sont illustratives.

TRANSITION — « Et dans un autre langage ? »`,
  `⏱ 4 min · TROIS LANGAGES (démo)

OBJECTIF — Montrer la génération multi-langage et son piège propre à chaque langage.

DIRE — « Même commentaire en JavaScript, Python et Java. Copilot adopte les idiomes : includes en JavaScript, in en Python, contains en Java. Mais chaque langage a son piège : en Python, True vaut 1, et Copilot oublie presque toujours de l’exclure. La règle métier, elle, ne change pas, et les tests d’acceptation non plus. Les variantes Python et Java sont dans le dossier katas, en bonus de l’atelier. »

ANIMATION — Cliquer les trois onglets. Demander aux pythonistes du tour de table s’ils connaissaient le piège.

TRANSITION — « Quels motifs Copilot reconnaît-il immédiatement ? »`,
  `⏱ 3 min · PATTERNS COURANTS

OBJECTIF — Donner les motifs où l’on peut aller vite.

DIRE — « Six motifs. La répétition : écrivez un cas de switch, il fait les autres. Le miroir : après parserCsv, il propose exporterCsv. La série : jours, mois, Fibonacci. Le squelette : try-catch, export. La conversion, à condition de préciser entrée et sortie. Et le test jumeau : un premier test, les suivants arrivent. »

TRANSITION — « Et un comportement à connaître absolument. »`,
  `⏱ 4 min · COMPORTEMENTS ATTENDUS

OBJECTIF — Faire comprendre que Copilot imite le contexte, et ses deux autres travers.

DIRE — « Même demande, deux fichiers. Dans le legacy, avec des var et des ==, Copilot propose… des var et des ==. » → beat 1 « Dans un fichier moderne, il propose filter et ===. Il imite ce qu’il voit. Deux autres comportements : il invente des fonctions voisines plausibles, et il peut proposer une syntaxe datée. D’où la règle : nettoyer d’abord, générer ensuite, et toujours vérifier. »

TRANSITION — « Quinze minutes de pause, et à vous de générer. »`,
  `⏱ 15 min · PAUSE · 15:40

DIRE — « Quinze minutes loin de l’écran. À 15 h 55, l’Atelier 4 : le modèle de ticket de TaskFlow. »`,
  `⏱ 55 min · ATELIER 4 (individuel) · 15:55

OBJECTIF — Générer le modèle de ticket guidé par des commentaires, et prouver le résultat par les tests.

DIRE — « Cinquante-cinq minutes. Énoncé dans ateliers/atelier-04-modele. Lancez d’abord npm run test:atelier4 : les échecs sont votre cahier des charges. Puis une fonction à la fois : curseur sous le commentaire, lire, accepter ou préciser le commentaire, relancer les tests. On ne modifie jamais les tests. Tout est vert ? Commit, puis variante Python ou Java. »

ANIMATION — Points d’étape à 15, 30 et 45 min. Piège fréquent : points > 0 && points <= 13 ; titre undefined qui fait planter trim. Bloqué à 45 min : le point de reprise est dans reprises/fin-atelier-04.

TRANSITION — « QCM, puis bilan de la journée. »`,
  `⏱ 5 min · QCM MODULE 4 (vote oral)

OBJECTIF — Vérifier les pièges de génération vus en atelier.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Faisons le bilan de cette première journée. »`,
  `⏱ 15 min · BILAN DU JOUR 1 (restitution)

OBJECTIF — Ancrer les quatre réflexes du jour ; restitution individuelle.

DIRE — « Quatre réflexes aujourd’hui : Copilot prédit, il ne vérifie pas ; un poste réglé et des gestes au clavier ; le contexte fait la suggestion ; le commentaire est un prompt. Maintenant, à vous : deux minutes chacun, dans l’ordre de la liste. Combien de tests verts, une suggestion que vous avez eu raison de refuser, et le geste qui vous a le plus servi. »

ANIMATION — Minuter à 2 min par personne. Au-delà de 10 participants : 5 ou 6 volontaires, les autres écrivent dans le clavardage.

TRANSITION — « Dernier mot avant de nous quitter. »`,
  `⏱ 5 min · BILLET DE SORTIE

OBJECTIF — Recueillir ce qui est acquis et ce qui reste flou, annoncer le Jour 2.

DIRE — « Une phrase chacun : ce que vous retenez, ce qui reste flou. Je réponds aux points flous demain matin. Notez aussi votre score de tests dans le journal. Demain, TaskFlow grandit : fonctions et classe, import CSV, refactoring d’un vieux code, une vraie suite de tests, et une revue de code. Si vous n’avez pas fini l’Atelier 4, le point de reprise est dans le dossier reprises. Très bonne soirée à toutes et à tous ! »

ANIMATION — Noter les points flous : les traiter dans la page de reprise du Jour 2.`,
];
// @@NOTES-END
