// ─── Module 5 · Génération de fonctions et blocs de code ────────────────────

const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Fonctions et
        <br />
        blocs de code
      </>
    }
    sub="Des fonctions complètes, une classe, un fichier structuré, des appels HTTP et de la documentation."
    dur="J2 · 9:15 – 10:45"
    labs={<Tag tone="green" size={19}>Atelier 5 · backlog, classe et import</Tag>}
  >
    <SecItem n={1}>Fonctions complètes avec paramètres et retours</SecItem>
    <SecItem n={2}>Classes et méthodes</SecItem>
    <SecItem n={3}>Structurer un fichier source avec Copilot</SecItem>
    <SecItem n={4}>Appels HTTP et parseurs</SecItem>
    <SecItem n={5}>Documentation JSDoc et docstring</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Signature d'abord ──────────────────────────────────────────────────────
const M5Step = ({ n, tone, title, children, beat }: { n: number; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={44} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.4 }}>{children}</div>
    </div>
  </div>
);

const M5_Fonction: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>Une fonction complète : la signature d’abord</Title>
    <Lede>Vous fixez le contrat (nom, paramètres, retour), Copilot écrit le corps, le test tranche.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M5Step n={1} tone="blue" title="Le contrat" beat={0}>
        <Ic>/**</Ic> + Entrée au-dessus de la signature : Copilot propose la JSDoc, vous la corrigez.
      </M5Step>
      <M5Step n={2} tone="violet" title="Le corps" beat={1}>
        Curseur dans la fonction : il écrit en respectant le contrat. Lisez avant Tab.
      </M5Step>
      <M5Step n={3} tone="green" title="La preuve" beat={2}>
        <Ic>npm run test:atelier5</Ic> immédiatement, avant la fonction suivante.
      </M5Step>
    </div>
    <CodeDark file="src/backlog.js" size={20} cls={A.in} style={{ position: 'absolute', left: 740, top: 262, width: 1060, ...dl(200) }}>
      <Cc>{'/**\n * Trie le backlog : priorité croissante, puis points (non estimés en bas), puis id.\n * @param {Ticket[]} tickets\n * @returns {Ticket[]} un NOUVEAU tableau ; l’original n’est pas modifié\n */'}</Cc>
      {'\n'}
      <Ck>export function</Ck> <Cf>trierBacklog</Cf>(tickets) {'{'}
      <span className={b.fade(1)}>
        {'\n  '}
        <Gh>{'const pts = (t) => (t.points === null ? Infinity : t.points);\n  return [...tickets].sort(\n    (a, b) => a.priorite - b.priorite || pts(a) - pts(b) || a.id - b.id,\n  );'}</Gh>
      </span>
      {'\n}'}
    </CodeDark>
    <div className={b.on(2)} style={{ position: 'absolute', left: 740, top: 690, width: 1060 }}>
      <Callout tone="green" icon="flask" title="Ce que le test vérifie, et pas vous" size={22}>
        L’ordre exact des 12 tickets, et que le tableau d’origine est intact : le <Ic>[...tickets]</Ic> n’est pas un détail.
      </Callout>
    </div>
  </Frame>
);

// ─── Ce que Copilot oublie ──────────────────────────────────────────────────
const M5Gap = ({ icon, title, children, d }: { icon: IconName; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone="coral" title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M5_Oublis: Page = () => (
  <Frame mod={5}>
    <Title>Les six cas que Copilot oublie le plus souvent</Title>
    <Lede>Mettez-les dans le commentaire, ou vérifiez-les dans la suggestion. Ils font la différence entre « ça marche » et « c’est juste ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M5Gap icon="inbox" title="La liste vide" d={100}>
        <Ic>0 / 0</Ic> donne <Ic>NaN</Ic> ; <Ic>reduce</Ic> sans valeur initiale lève une erreur.
      </M5Gap>
      <M5Gap icon="eyeOff" title="null et undefined" d={180}>
        Un ticket non estimé, un champ absent : chaque accès doit y survivre.
      </M5Gap>
      <M5Gap icon="reset" title="La mutation de l’entrée" d={260}>
        <Ic>sort</Ic>, <Ic>push</Ic>, <Ic>splice</Ic> modifient le tableau reçu.
      </M5Gap>
      <M5Gap icon="scale" title="Les égalités" d={340}>
        Deux tickets de même priorité et mêmes points : quel ordre ?
      </M5Gap>
      <M5Gap icon="gauge" title="Les bornes" d={420}>
        3 caractères, 80 caractères, 3 tickets en cours : inclus ou exclus ?
      </M5Gap>
      <M5Gap icon="alert" title="L’entrée invalide" d={500}>
        Texte au lieu d’un nombre, type inconnu : erreur claire, pas plantage.
      </M5Gap>
    </div>
  </Frame>
);

// ─── Classes ────────────────────────────────────────────────────────────────
const M5_Classe: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>Générer une classe et ses méthodes</Title>
    <Lede>Le nom et le commentaire de la classe donnent le plan ; Copilot propose les méthodes une à une.</Lede>
    <CodeDark file="src/backlog.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Cc>{'/** Un backlog : une liste de tickets et ses opérations. */'}</Cc>
      {'\n'}
      <Ck>export class</Ck> <Cf>Backlog</Cf> {'{'}
      {'\n  '}#tickets;{'\n  '}#aujourdHui;{'\n\n  '}
      <Ck>constructor</Ck>(tickets = [], {'{ aujourdHui }'}) {'{'}
      {'\n    '}
      <Gh>{'this.#tickets = tickets.map((t) => ({ ...t }));'}</Gh>
      {'\n    '}
      <Gh>this.#aujourdHui = aujourdHui;</Gh>
      {'\n  }'}
      <span className={b.fade(1)}>
        {'\n\n  '}
        <Gh>{'ajouter(donnees) {\n    const id = this.#tickets.reduce((m, t) => Math.max(m, t.id), 0) + 1;\n    …\n  }'}</Gh>
      </span>
      <span className={b.fade(2)}>
        {'\n\n  '}
        <Gh>{'get stats() {\n    return statistiques(this.#tickets);\n  }'}</Gh>
      </span>
      {'\n}'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="lock" tone="violet" title="Champs privés" size={22} pad={22} cls={A.right} style={dl(200)}>
        <Ic>#tickets</Ic> : personne ne modifie la liste sans passer par les méthodes.
      </Card>
      <Card icon="archive" tone="blue" title="Le constructeur copie" size={22} pad={22} cls={b.on(1)}>
        Sinon, supprimer dans le backlog supprimerait aussi dans le tableau d’origine.
      </Card>
      <Card icon="layers" tone="green" title="Il réutilise vos fonctions" size={22} pad={22} cls={b.on(2)}>
        <Ic>statistiques</Ic> existe déjà dans le fichier : Copilot l’appelle au lieu de la réécrire.
      </Card>
    </div>
  </Frame>
);

// ─── Structurer un fichier ──────────────────────────────────────────────────
const M5Part = ({ n, title, sub, tone, d }: { n: number; title: string; sub: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderRadius: 14, background: T[tone].bg, boxShadow: `inset 6px 0 0 ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: T[tone].fg, width: 34 }}>{n}</span>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M5_Fichier: Page = () => (
  <Frame mod={5}>
    <Title>Structurer un fichier source avec Copilot</Title>
    <Lede>Demandez d’abord le plan, en Ask ; remplissez-le ensuite, bloc par bloc, en inline.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px' }}>
      <PanelTitle icon="chat" c={C.teal}>
        Le prompt de plan
      </PanelTitle>
      <div style={{ fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        <Pr>« #file:src/backlog.js — Propose le plan de ce fichier : sections dans l’ordre, signature JSDoc de chaque export, sans écrire les corps. Respecte le style de src/tickets.js. »</Pr>
      </div>
      <div style={{ marginTop: 18, fontSize: 21, color: C.soft, lineHeight: 1.45 }}>
        Vous relisez le plan, vous le corrigez, puis vous collez les signatures dans le fichier : le contexte est prêt pour l’inline.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5Part n={1} title="Imports" sub="ce dont le fichier dépend, rien de plus" tone="grey" d={200} />
      <M5Part n={2} title="Constantes" sub="valeurs du domaine, figées" tone="navy" d={280} />
      <M5Part n={3} title="Fonctions internes" sub="petites aides non exportées" tone="blue" d={360} />
      <M5Part n={4} title="Fonctions exportées" sub="le contrat public, avec JSDoc" tone="teal" d={440} />
      <M5Part n={5} title="Classe" sub="qui s’appuie sur les fonctions" tone="violet" d={520} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="target" title="Un fichier, une responsabilité" size={23} cls={A.in} style={dl(700)}>
        backlog.js trie et compte, api.js importe, kanban.js déplace : des fichiers courts donnent un meilleur contexte à Copilot.
      </Callout>
    </div>
  </Frame>
);

// ─── Appels HTTP ────────────────────────────────────────────────────────────
const M5_HTTP: Page = () => (
  <Frame mod={5} beats={1}>
    <Title>Travailler avec des API : les appels HTTP</Title>
    <Lede>Copilot écrit un fetch en une seconde. Les trois oublis classiques : le statut HTTP, la forme des données, la testabilité.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 820 }}>
      <PanelTitle icon="x" c={C.coral}>
        Première suggestion, acceptée telle quelle
      </PanelTitle>
      <CodeDark file="src/api.js" size={20}>
        <Ck>export async function</Ck> <Cf>chargerTickets</Cf>(url) {'{'}
        {'\n  '}
        <Ck>const</Ck> r = <Ck>await</Ck> fetch(url);{'\n  '}
        <Ck>return</Ck> r.json();{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={22} tone="coral">Une erreur 500 passe pour un succès</Bullet>
        <Bullet size={22} tone="coral">Un objet au lieu d’un tableau casse l’affichage</Bullet>
        <Bullet size={22} tone="coral">Impossible à tester sans réseau</Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <PanelTitle icon="check" c={C.green}>
        Après un commentaire précis et une relecture
      </PanelTitle>
      <CodeDark file="src/api.js" size={18}>
        <Ck>export async function</Ck> <Cf>chargerTickets</Cf>(url, {'{'} fetchFn = fetch {'}'} = {'{}'}) {'{'}
        {'\n  '}
        <Ck>const</Ck> r = <Ck>await</Ck> fetchFn(url);{'\n  '}
        <Ck>if</Ck> (!r.ok) <Ck>throw new</Ck> Error(<Cs>{'`HTTP ${r.status}`'}</Cs>);{'\n  '}
        <Ck>const</Ck> data = <Ck>await</Ck> r.json();{'\n  '}
        <Ck>if</Ck> (!Array.isArray(data)) <Ck>throw new</Ck> Error(<Cs>"Format inattendu"</Cs>);{'\n  '}
        <Ck>return</Ck> data;{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={22} tone="green">Statut vérifié, format vérifié</Bullet>
        <Bullet size={22} tone="green">fetchFn injectable : testable à l’Atelier 7</Bullet>
        <Bullet size={22} tone="green">Aucun jeton ni URL secrète dans le code</Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Parseurs ───────────────────────────────────────────────────────────────
const M5Trap = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <Num n={n} tone="coral" size={32} style={{ marginTop: 2 }} />
    <span style={{ fontSize: 22, color: C.ink, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const M5_Parseurs: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Générer un parseur : le fichier réel est toujours piégé</Title>
    <Lede>Ouvrez le fichier de données dans un onglet voisin : Copilot voit son format. Combien de pièges voyez-vous ? Au micro.</Lede>
    <CodeDark file="data/import.csv" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 860 }}>
      <Cc>{'1 '}</Cc>titre;type;priorite;points{'\n'}
      <Cc>{'2 '}</Cc>Paiement par carte refusé;bug;<Cn>1</Cn>;<Cn>3</Cn>
      {'\n'}
      <Cc>{'3 '}</Cc>Filtre par date des factures;story;<Cn>2</Cn>;<Cn>5</Cn>
      {'\n'}
      <Cc>{'4 '}</Cc>
      {'\n'}
      <Cc>{'5 '}</Cc>
      <span style={{ background: 'rgba(255,210,122,.2)' }}>{'  Mode sombre  '}</span>;story;<Cn>3</Cn>;{'\n'}
      <Cc>{'6 '}</Cc>Traduction anglaise;tache;<Cn>2</Cn>;<Cn>8</Cn>;<span style={{ background: 'rgba(242,139,130,.3)' }}>en trop</span>
      {'\n'}
      <Cc>{'7 '}</Cc>Synchronisation agenda;story;<Cn>2</Cn>;<span style={{ background: 'rgba(242,139,130,.3)' }}>4</span>
      {'\n'}
      <Cc>{'8 '}</Cc>Lien mort dans le pied de page;bug;<Cn>3</Cn>;<Cn>1</Cn>
      {'\n'}
      <Cc>{'9 '}</Cc>
      <span style={{ background: 'rgba(242,139,130,.3)' }}>{';'}</span>tache;<Cn>2</Cn>;<Cn>1</Cn>
    </CodeDark>
    <div className={A.right} style={{ position: 'absolute', left: 1040, top: 270, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
      <PanelTitle icon="bug" c={C.coral}>
        Les pièges à mettre dans le commentaire
      </PanelTitle>
      <M5Trap n={1}>Séparateur « ; » (CSV à la française), pas « , »</M5Trap>
      <M5Trap n={2}>En-tête à ignorer, lignes vides à sauter</M5Trap>
      <M5Trap n={3}>Espaces autour des champs, points vides → null</M5Trap>
      <M5Trap n={4}>Mauvais nombre de colonnes, titre vide : rejet avec n° de ligne</M5Trap>
      <M5Trap n={5}>Fins de ligne Windows et BOM : invisibles à l’œil nu</M5Trap>
      <M5Trap n={6}>Points « 4 » : syntaxe juste, règle métier fausse</M5Trap>
    </div>
  </Frame>
);

// ─── Documentation ──────────────────────────────────────────────────────────
const M5_Doc: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Générer la documentation : JSDoc, docstring, Javadoc</Title>
    <Lede>Deux gestes : /** + Entrée au-dessus d’une fonction, ou Ctrl+I puis /doc sur une sélection.</Lede>
    <LangTabs initial="JavaScript" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="JavaScript" tone="yellow" />
        <LangBtn lang="Python" tone="green" />
        <LangBtn lang="Java" tone="coral" />
      </div>
      <LangPane lang="JavaScript">
        <CodeDark file="src/api.js" size={20}>
          <Gh>{'/**\n * Lit un CSV « titre;type;priorite;points ».\n * @param {string} texte contenu du fichier\n * @returns {{ tickets: object[], rejets: { ligne: number, raison: string }[] }}\n * @example parserCsv("titre;type;priorite;points\\nA;bug;1;3")\n */'}</Gh>
          {'\n'}
          <Ck>export function</Ck> <Cf>parserCsv</Cf>(texte) {'{ … }'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="katas/python/tickets.py" size={20}>
          <Ck>def</Ck> <Cf>creer_ticket</Cf>(donnees: dict, *, id: int, aujourd_hui: str) -&gt; dict:{'\n    '}
          <Gh>{'"""Crée un ticket complet.\n\n    Args:\n        donnees: titre, type, priorite, points (partiels).\n        id: identifiant unique.\n        aujourd_hui: date AAAA-MM-JJ.\n\n    Raises:\n        ValueError: si les données sont invalides.\n    """'}</Gh>
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="katas/java/Ticket.java" size={20}>
          <Gh>{'/**\n * Valide les champs d’un ticket.\n * @param titre    3 à 80 caractères après strip\n * @param priorite 1, 2 ou 3\n * @return toutes les erreurs, dans l’ordre ; liste vide si valide\n */'}</Gh>
          {'\n'}
          <Ck>static</Ck> List&lt;String&gt; <Cf>valider</Cf>(…) {'{ … }'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1230, top: 270, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Une bonne doc dit le contrat" size={22} pad={22} cls={A.right} style={dl(200)}>
        Paramètres, retour, erreurs, un exemple. Ce que l’appelant doit savoir.
      </Card>
      <Card icon="x" tone="coral" title="Une mauvaise doc paraphrase" size={22} pad={22} cls={A.right} style={dl(350)}>
        « Cette fonction parse le CSV » : inutile. Et une doc fausse est pire que pas de doc : relisez-la.
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 5 ──────────────────────────────────────────────────────────────
const M5_Lab: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="TaskFlow v2 : backlog, classe et import"
    defi="generer"
    who="Individuel · 50 min"
    objective={
      <>
        Générer <Ic>trierBacklog</Ic>, <Ic>filtrerBacklog</Ic>, <Ic>statistiques</Ic>, la classe <Ic>Backlog</Ic>, <Ic>parserCsv</Ic> et <Ic>chargerTickets</Ic>, chacun avec sa <strong>JSDoc</strong>. Les tests passent et l’interface TaskFlow s’allume.
      </>
    }
    where={
      <>
        <PathChip size={19}>src/backlog.js</PathChip> <PathChip size={19}>src/api.js</PathChip>
        <br />
        <PathChip size={19}>npm run serveur</PathChip> → localhost:3000
      </>
    }
    minutes={50}
    crit={
      <>
        <CheckItem id="l5a" size={21}>test:atelier5 au vert</CheckItem>
        <CheckItem id="l5b" size={21}>« securite » trouve « Sécurité »</CheckItem>
        <CheckItem id="l5c" size={21}>Une JSDoc par fonction exportée</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (tri), 30 min (classe), 45 min (CSV et interface)."
  >
    <WStep n={1}>Ask + <Ic>#file:src/backlog.js</Ic> : le plan et les signatures JSDoc, sans les corps.</WStep>
    <WStep n={2}>Une fonction à la fois : JSDoc, corps, test. Puis la classe, méthode par méthode.</WStep>
    <WStep n={3}>
      <Ic>parserCsv</Ic> avec <PathChip size={20}>data/import.csv</PathChip> ouvert à côté, puis <Ic>chargerTickets</Ic> et l’interface.
    </WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <Frame mod={5} kind="qcm">
    <Title>QCM · Module 5 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Copilot propose return tickets.sort(…) pour trierBacklog. Que vérifiez-vous en premier ?" explain="sort trie sur place : le tableau reçu est modifié. Il faut trier une copie ([...tickets] ou toSorted).">
        <QOpt ok>Que sort existe bien en JavaScript</QOpt>
        <QOpt>Que le tableau reçu n’est pas modifié</QOpt>
        <QOpt>Que la fonction est assez courte</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi passer fetchFn en paramètre de chargerTickets ?" explain="L’injection de dépendance permet de remplacer fetch par un faux (mock) dans les tests : aucun réseau, résultats déterministes.">
        <QOpt>Pour aller plus vite</QOpt>
        <QOpt ok>Pour pouvoir le remplacer par un faux dans les tests</QOpt>
        <QOpt>Parce que fetch n’existe pas dans Node</QOpt>
      </QuizQ>
      <QuizQ q="Avant de générer un parseur CSV, le geste le plus utile est…" explain="Ouvrir le fichier réel dans un onglet voisin : Copilot voit le séparateur, l’en-tête et les cas réels.">
        <QOpt>Choisir un modèle plus puissant</QOpt>
        <QOpt>Ouvrir le fichier de données dans un onglet voisin</QOpt>
        <QOpt ok>Écrire « fais un parseur robuste »</QOpt>
      </QuizQ>
      <QuizQ q="Quelle JSDoc est la plus utile ?" explain="Une doc décrit le contrat : paramètres, retour, erreurs, exemple. La paraphrase du nom n’apporte rien.">
        <QOpt ok>« Cette fonction trie le backlog. »</QOpt>
        <QOpt>@param, @returns « un nouveau tableau », @throws, un @example</QOpt>
        <QOpt>Le nom de l’auteur et la date</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M5_Pause: Page = () => <BreakPage mod={5} title="Pause" back="Reprise à 11 h 00 : le refactoring d’un vieux code de 2019." minutes={15} />;

// @@PAGES-BEGIN
export const __pages = [M5_Divider, M5_Fonction, M5_Oublis, M5_Classe, M5_Fichier, M5_HTTP, M5_Parseurs, M5_Doc, M5_Lab, M5_Qcm, M5_Pause];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 5 · 9:15

OBJECTIF — Annoncer le passage aux blocs de code complets.

DIRE — « Module 5 : des fonctions complètes, une classe, un fichier structuré, des appels HTTP, un parseur, et la documentation. Hier, on générait ligne par ligne ; aujourd’hui, on génère des blocs entiers, avec une méthode. »

TRANSITION — « La méthode tient en trois temps. »`,
  `⏱ 6 min · SIGNATURE D’ABORD (démo)

OBJECTIF — Installer la méthode contrat → corps → preuve.

DIRE — « Premier temps : le contrat. Je tape barre-oblique étoile étoile au-dessus de la signature, Copilot propose une JSDoc, je la corrige : “un nouveau tableau, l’original n’est pas modifié”. » → beat 1 « Deuxième temps : le corps. Copilot respecte le contrat : il trie une copie. » → beat 2 « Troisième temps : le test, tout de suite. Il vérifie l’ordre des douze tickets et que l’original est intact. »

ANIMATION — Le faire en direct sur une copie du dépôt.

TRANSITION — « Quels cas Copilot oublie-t-il le plus ? »`,
  `⏱ 4 min · LES SIX OUBLIS

OBJECTIF — Donner la liste des cas limites à exiger.

DIRE — « Six oublis classiques. La liste vide : zéro divisé par zéro donne NaN. null et undefined : le ticket non estimé. La mutation de l’entrée : sort, push, splice. Les égalités : deux tickets identiques, quel ordre ? Les bornes : trois caractères, inclus ou exclus ? Et l’entrée invalide : une erreur claire plutôt qu’un plantage. Mettez-les dans le commentaire, ou cherchez-les dans la suggestion. »

TRANSITION — « Passons aux classes. »`,
  `⏱ 5 min · CLASSE (démo)

OBJECTIF — Montrer la génération d’une classe méthode par méthode.

DIRE — « Un commentaire, export class Backlog, deux champs privés. Le constructeur : Copilot propose une copie des tickets. Pourquoi c’est important ? Sinon, supprimer dans le backlog supprimerait aussi dans le tableau d’origine. » → beat 1 « La méthode ajouter : l’id suivant, puis creerTicket. » → beat 2 « Le getter stats : il réutilise statistiques, qui existe déjà dans le fichier, au lieu de la réécrire. Une méthode à la fois, un test à chaque fois. »

TRANSITION — « Et pour organiser tout un fichier ? »`,
  `⏱ 4 min · STRUCTURER UN FICHIER

OBJECTIF — Faire demander le plan avant le code.

DIRE — « Pour un fichier entier, je demande d’abord le plan, en mode Ask, avec le fichier joint : les sections dans l’ordre et les signatures, sans les corps. Je relis, je corrige, je colle les signatures : le contexte est prêt pour l’inline. L’ordre classique : imports, constantes, fonctions internes, fonctions exportées, classe. Et une règle : un fichier, une responsabilité. Des fichiers courts donnent un meilleur contexte. »

TRANSITION — « Un cas fréquent : appeler une API. »`,
  `⏱ 5 min · APPELS HTTP

OBJECTIF — Montrer les trois oublis d’un fetch généré.

DIRE — « La première suggestion de Copilot pour charger des tickets : fetch, puis json. Trois problèmes : une erreur 500 passe pour un succès, un objet au lieu d’un tableau casse l’affichage, et on ne peut pas le tester sans réseau. » → beat 1 « Avec un commentaire précis : le statut vérifié, le format vérifié, et fetchFn injectable, ce qui nous permettra de le simuler à l’Atelier 7. Et jamais de jeton dans le code. »

TRANSITION — « Les données arrivent aussi par fichier. »`,
  `⏱ 5 min · PARSEURS (exercice oral)

OBJECTIF — Faire repérer les pièges d’un fichier réel avant de générer.

DIRE — « Voici le fichier que vous importerez. Combien de pièges voyez-vous ? Dites-les au micro. »

ANIMATION — Laisser chercher 1 minute. Faire citer les lignes : 4 (vide), 5 (espaces, points vides), 6 (colonne en trop), 7 (points 4 : syntaxe juste, règle fausse), 9 (titre vide). Puis montrer la liste à droite ; insister sur les pièges invisibles : fins de ligne Windows et BOM.

TRANSITION — « Dernier bloc : la documentation. »`,
  `⏱ 4 min · DOCUMENTATION (démo)

OBJECTIF — Montrer les deux gestes de génération de doc, et ce qu’est une bonne doc.

DIRE — « Deux gestes : barre-oblique étoile étoile puis Entrée, ou Ctrl+I puis /doc sur une sélection. En JavaScript, une JSDoc ; en Python, une docstring ; en Java, une Javadoc. Une bonne doc dit le contrat : paramètres, retour, erreurs, exemple. Une mauvaise paraphrase le nom de la fonction. Et une doc fausse est pire que pas de doc : relisez-la comme du code. »

ANIMATION — Cliquer les trois onglets.

TRANSITION — « À vous : cinquante minutes pour TaskFlow v2. »`,
  `⏱ 50 min · ATELIER 5 (individuel) · 9:55

OBJECTIF — Générer des fonctions complètes, une classe et un parseur, documentés et prouvés par les tests.

DIRE — « Cinquante minutes. Énoncé dans ateliers/atelier-05-backlog-api. D’abord le plan en Ask, puis une fonction à la fois : JSDoc, corps, test. La classe méthode par méthode. Le parseur avec le CSV ouvert à côté. Et à la fin, npm run serveur : l’interface TaskFlow s’allume avec votre code. »

ANIMATION — Points d’étape à 15 min (tri), 30 min (classe), 45 min (CSV et interface). Pièges fréquents : sort sur place ; toLowerCase sans normalize ; split(',') ; numéro de ligne décalé de 1.

TRANSITION — « QCM, puis pause. »`,
  `⏱ 5 min · QCM MODULE 5 (vote oral)

OBJECTIF — Vérifier méthode, oublis classiques et testabilité.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Quinze minutes de pause. »`,
  `⏱ 15 min · PAUSE · 10:45

DIRE — « Quinze minutes loin de l’écran. À 11 h, on ouvre un vieux code de 2019, et on le remet à neuf sans rien casser. »`,
];
// @@NOTES-END
