// ─── M4 · What to document ──────────────────────────────────────────────────
const DocLevel = ({ n, icon, tone, title, who, children }: { n: number; icon: IconName; tone: Tone; title: string; who: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px', display: 'flex', flexDirection: 'column' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone={tone} size={19}>
        {who}
      </Tag>
    </div>
  </div>
);

const M4_DocLevels: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Ce que l’IA documente bien… et ce qu’elle ne peut pas savoir</Title>
    <Lede>Le « quoi » se lit dans le code ; le « pourquoi » est dans votre tête. La doc utile parle du pourquoi.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 22 }}>
      <DocLevel n={1} icon="code" tone="blue" title="Docstrings" who="IA : très bien">
        Paramètres, retour, exceptions, exemple. Format imposé (Google, NumPy, TSDoc).
      </DocLevel>
      <DocLevel n={2} icon="book" tone="teal" title="README" who="IA : bon premier jet">
        But, installation, exemple, limites. À vérifier en lançant chaque commande.
      </DocLevel>
      <DocLevel n={3} icon="list" tone="violet" title="Changelog, PR" who="IA : très bien">
        À partir de git log ou du diff : notes de version, description de pull request.
      </DocLevel>
      <DocLevel n={4} icon="map" tone="yellow" title="Décisions" who="Vous : le pourquoi">
        Pourquoi haversine plutôt qu’une API ? Pourquoi cette limite ? L’IA rédige, vous dictez.
      </DocLevel>
    </div>
    <Callout cls={b.on(4)} title="Le test d’une bonne doc" tone="blue" icon="eye" size={25} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      Un collègue qui n’a jamais vu le module peut l’utiliser correctement… sans lire le code.
    </Callout>
  </Frame>
);

// ─── M4 · Docstring generation demo ─────────────────────────────────────────
const M4_Docstring: Page = () => (
  <Frame mod={4} kind="demo" beats={3}>
    <Title>Générer une documentation conforme à une convention</Title>
    <Lede>Précisez le format, la langue et l’exemple exécutable : sinon, chaque fonction aura son style.</Lede>
    <PromptBox cls={A.in} size={23} style={{ position: 'absolute', left: 120, top: 270, width: 700, ...dl(100) }}>
      /doc · Docstring au format Google, en français, avec Args, Returns, Raises et un exemple doctest exécutable. Explique le pourquoi (formule, hypothèses), pas le comment.
    </PromptBox>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 560, width: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card tone="green" icon="check" title="Vérifiable" size={23}>
        python -m doctest -v geo.py exécute l’exemple : s’il est faux, ça se voit.
      </Card>
      <Card tone="coral" icon="alert" title="À traquer" size={23}>
        Les exemples inventés et les promesses fausses (« précis au mètre »).
      </Card>
    </div>
    <CodeDark cls={A.in} file="geo.py" lang="python" size={20} style={{ position: 'absolute', left: 880, top: 270, width: 920, ...dl(200) }}>
      <Kw>def</Kw> <Fn>distance_km</Fn>(a: <Ty>Point</Ty>, b: <Ty>Point</Ty>) -&gt; <Ty>float</Ty>:{'\n'}
      <span className={b.fade(1)}>
        {'    '}
        <St>"""Distance à vol d'oiseau, formule de haversine.</St>
        {'\n'}
        {'\n'}
        {'    '}
        <St>Terre supposée sphérique : précision d'environ 0,5 %.</St>
        {'\n'}
        {'\n'}
        {'    '}
        <St>Args:</St>
        {'\n'}
        {'        '}
        <St>a: Point de départ.</St>
        {'\n'}
        {'        '}
        <St>b: Point d'arrivée.</St>
        {'\n'}
        {'\n'}
        {'    '}
        <St>Returns:</St>
        {'\n'}
        {'        '}
        <St>La distance en kilomètres, arrondie à 0,1 km.</St>
        {'\n'}
        {'\n'}
      </span>
      <span className={b.fade(2)}>
        {'    '}
        <St>Example:</St>
        {'\n'}
        {'        '}
        <St>&gt;&gt;&gt; distance_km(MONTREAL, QUEBEC)</St>
        {'\n'}
        {'        '}
        <St>233.0</St>
        {'\n'}
        {'    '}
        <St>"""</St>
      </span>
    </CodeDark>
  </Frame>
);

// ─── M4 · README, changelog, PR description ─────────────────────────────────
const M4_Readme: Page = () => (
  <Frame mod={4}>
    <Title>README, journal des modifications, description de PR</Title>
    <Lede>Les documents que personne n’aime écrire… et que l’IA rédige bien à partir du code et de l’historique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 24 }}>
      <div className={A.in} style={dl(100)}>
        <PromptBox label="README" size={22}>
          À partir de geo.py et des tests, écris un README : but, installation, un exemple qui fonctionne, limites connues. Pas de fonctionnalité qui n’existe pas.
        </PromptBox>
      </div>
      <div className={A.in} style={dl(200)}>
        <PromptBox label="Journal des modifications" size={22}>
          À partir de git log --oneline v1.2..HEAD, rédige l’entrée de CHANGELOG au format Keep a Changelog : Ajouté, Modifié, Corrigé.
        </PromptBox>
      </div>
      <div className={A.in} style={dl(300)}>
        <PromptBox label="Description de PR" size={22}>
          À partir du diff, décris la PR : le problème, la solution, comment tester, les risques. Pour un relecteur pressé.
        </PromptBox>
      </div>
    </div>
    <Term cls={A.in} title="CHANGELOG.md" size={20} style={{ position: 'absolute', left: 120, top: 600, width: 1100, ...dl(400) }}>
      <Ok>## [1.3.0] - 2026-11-03</Ok>
      {'\n'}
      ### Ajouté{'\n'}- Export CSV des tâches, étiquettes séparées par « ; ».{'\n'}### Corrigé{'\n'}- Les identifiants ne sont plus réutilisés après une suppression.
    </Term>
    <Callout cls={A.in} title="Toujours" tone="yellow" icon="humanCheck" size={24} style={{ position: 'absolute', left: 1280, top: 600, width: 520, ...dl(500) }}>
      Lancer chaque commande du README. Rayer ce que le code ne fait pas.
    </Callout>
  </Frame>
);

// ─── Lab 06 ─────────────────────────────────────────────────────────────────
const L06_Brief: Page = () => (
  <LabBrief
    mod={4}
    n="06"
    title="Documenter… et vérifier ce qui est écrit"
    dur="20 min"
    folder="lab06-documentation"
    objective="Générer une documentation conforme à une convention, un README et un changelog, puis vérifier que la documentation dit vrai."
    cmd={
      <>
        <Pr>pytest labs/lab06-documentation</Pr>
        {'\n'}
        <Ok>4 passed</Ok>, <Ko>7 failed</Ko>
        {'\n'}
        <Pr>python -m doctest -v …/geo.py</Pr>
      </>
    }
    deliverable="Tous les tests verts (docstrings complètes, exemples justes) et un README revu par vous."
  >
    <LabStep n={1} t="3 min" title="Convention d’abord">
      Une fonction avec, puis sans la convention : comparez
    </LabStep>
    <LabStep n={2} t="7 min" title="Tout le module">
      Module, classe Point, 4 fonctions : /doc, Generate documentation ou chat
    </LabStep>
    <LabStep n={3} t="5 min" title="Vérifier">
      doctest exécute les exemples ; cherchez une phrase fausse
    </LabStep>
    <LabStep n={4} t="5 min" title="README et changelog">
      Puis une entrée de CHANGELOG à partir de git log
    </LabStep>
  </LabBrief>
);

const L06_Go: Page = () => (
  <LabGo mod={4} n="06" minutes={20} folder="lab06-documentation">
    <CheckItem id="l06-1">Comparaison avec / sans convention notée</CheckItem>
    <CheckItem id="l06-2">Module, Point et 4 fonctions documentés</CheckItem>
    <CheckItem id="l06-3">Exemples exécutés et justes (doctest ou à la main)</CheckItem>
    <CheckItem id="l06-4">Une phrase fausse ou invérifiable repérée et corrigée</CheckItem>
    <CheckItem id="l06-5">README et entrée de CHANGELOG</CheckItem>
  </LabGo>
);

// ─── M4 · Style and conventions ─────────────────────────────────────────────
const StyleRow = ({ tool, what, ai, d }: { tool: string; what: string; ai: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', alignItems: 'center', columnGap: 24, minHeight: 74, borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 23, color: T.blue.fg }}>{tool}</span>
    <span style={{ fontSize: 23, color: C.ink }}>{what}</span>
    <span style={{ fontSize: 22, color: T.violet.fg }}>{ai}</span>
  </div>
);

const M4_Style: Page = () => (
  <Frame mod={4}>
    <Title>Style et conventions : les outils décident, l’IA explique</Title>
    <Lede>Un formateur et un linter appliquent les règles sans débat. L’IA intervient là où ils s’arrêtent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', columnGap: 24, paddingBottom: 10, borderBottom: `3px solid ${C.ink}`, ...dl(50) }}>
        <Eyebrow c={C.muted} size={20}>
          Outil
        </Eyebrow>
        <Eyebrow c={C.muted} size={20}>
          Ce qu’il fait (déterministe)
        </Eyebrow>
        <Eyebrow c={C.violet} size={20}>
          Où l’IA aide
        </Eyebrow>
      </div>
      <StyleRow tool="ruff format · Prettier" what="Mise en forme, sans discussion" ai="Rien : laissez l’outil faire" d={150} />
      <StyleRow tool="ruff · ESLint" what="Règles, erreurs, complexité, sécurité (S)" ai="Expliquer une règle, corriger un avertissement" d={250} />
      <StyleRow tool="mypy · tsc --strict" what="Cohérence des types" ai="Ajouter les annotations manquantes" d={350} />
      <StyleRow tool="Instructions de projet" what="—" ai="Conventions non outillables : nommage métier, gestion d’erreurs" d={450} />
      <StyleRow tool="Revue de PR" what="—" ai="Lisibilité, cohérence avec le reste du dépôt" d={550} />
    </div>
    <Callout cls={A.in} title="Règle d’efficacité" tone="yellow" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(700) }}>
      Ne demandez jamais à l’IA ce qu’un outil déterministe fait gratuitement : formatage, tri des imports, règles de lint.
    </Callout>
  </Frame>
);

// ─── M4 · Spot the flaws (pins on the PR of lab 07) ─────────────────────────
const FlawPin = ({ n, x, y }: { n: number; x: number; y: number }) => (
  <div
    className={b.pop(n)}
    style={{ position: 'absolute', left: x, top: y, width: 40, height: 40, borderRadius: 99, background: C.coral, color: '#fff', border: '3px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 22, boxShadow: '0 6px 16px -6px rgba(180,60,40,.7)', zIndex: 5 }}
  >
    {n}
  </div>
);

const Flaw = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 14, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.coral}`, padding: '12px 18px' }}>
    <Num n={n} tone="coral" size={36} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 23, color: T.coral.fg }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.35, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M4_Hotspots: Page = () => (
  <Frame mod={4} kind="exercice" beats={5}>
    <Title>Revue éclair : repérez les failles</Title>
    <Lede>Extrait de la PR n° 42 du lab 07. Dites-moi ce que vous voyez ; je révèle ensuite les 5 failles, une par clic.</Lede>
    <CodeDark cls={A.in} file="notes_service.py · PR #42" lang="python" size={21} style={{ position: 'absolute', left: 160, top: 270, width: 1040, ...dl(100) }}>
      SECRET_KEY = <St>"s3cr3t-prod-2026"</St>
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>connecter</Fn>(self, email, mot_de_passe):{'\n'}
      {'    '}h = hashlib.<Fn>md5</Fn>(mot_de_passe.encode()).hexdigest(){'\n'}
      {'    '}
      <Kw>try</Kw>:{'\n'}
      {'        '}row = self.bd.execute({'\n'}
      {'            '}
      <St>f"select id from users where email = '</St>
      {'{'}email{'}'}
      <St>' and password = '</St>
      {'{'}h{'}'}
      <St>'"</St>){'\n'}
      {'    '}
      <Kw>except</Kw> <Ty>Exception</Ty>:{'\n'}
      {'        '}
      <Kw>return</Kw> <Kw>None</Kw>
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>lire_note</Fn>(self, user_id, note_id):{'\n'}
      {'    '}row = self.bd.execute(<St>"select contenu from notes where id = ?"</St>, (note_id,))
    </CodeDark>
    <FlawPin n={1} x={110} y={318} />
    <FlawPin n={2} x={110} y={384} />
    <FlawPin n={3} x={110} y={449} />
    <FlawPin n={4} x={110} y={515} />
    <FlawPin n={5} x={110} y={612} />
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Flaw n={1} title="Secret en dur">
        Il finit dans Git : à lire dans l’environnement.
      </Flaw>
      <Flaw n={2} title="MD5, sans sel">
        pbkdf2, scrypt ou argon2, un sel par compte.
      </Flaw>
      <Flaw n={3} title="Injection SQL">
        « ana@x.ca' -- » entre sans mot de passe.
      </Flaw>
      <Flaw n={4} title="Exception avalée">
        Elle cache l’injection et toutes les erreurs.
      </Flaw>
      <Flaw n={5} title="Contrôle d’accès absent">
        Bob lit les notes d’Ana. Aucun outil ne le voit.
      </Flaw>
    </div>
    <Callout cls={b.on(5)} title="Qui trouve quoi ?" tone="violet" icon="eye" size={23} style={{ position: 'absolute', left: 120, top: 840, width: 1080 }}>
      <b>ruff (S)</b> : 1, 2, 3 · <b>IA</b> : 1 à 4, souvent 5 · <b>Vous</b> : 5, la règle métier.
    </Callout>
  </Frame>
);

// ─── M4 · Automating reviews ────────────────────────────────────────────────
const RevStep = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px' }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M4_ReviewFlow: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Automatiser la revue : l’IA en premier relecteur</Title>
    <Lede>Elle filtre avant l’humain ; elle ne remplace ni l’approbation ni la responsabilité.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RevStep n={1} icon="code" tone="blue" title="Avant d’ouvrir la PR">
        Auto-revue dans le chat avec la grille de l’équipe ; description générée et relue.
      </RevStep>
      <RevStep n={2} icon="gear" tone="teal" title="Pipeline CI">
        Lint, types, tests, analyse de sécurité (CodeQL, ruff S) : bloquants.
      </RevStep>
      <RevStep n={3} icon="bot" tone="violet" title="Revue IA de la PR">
        Copilot en relecteur, ou une action de revue : commentaires en ligne, suggestions.
      </RevStep>
      <RevStep n={4} icon="humanCheck" tone="green" title="Revue humaine et approbation">
        Conception, règles métier, pertinence : un humain approuve et fusionne.
      </RevStep>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={b.on(3)} tone="green" icon="check" title="L’IA repère bien" size={23}>
        Oublis de cas d’erreur, failles connues, incohérences de nommage, tests absents, documentation périmée.
      </Card>
      <Card cls={b.on(4)} tone="coral" icon="alert" title="Elle repère mal" size={23}>
        Règles métier, choix d’architecture, effets sur le reste du système… et elle produit du bruit : il faut trier.
      </Card>
    </div>
  </Frame>
);

// ─── M4 · Review prompt and comment format ──────────────────────────────────
const M4_ReviewPrompt: Page = () => (
  <Frame mod={4}>
    <Title>Une demande de revue qui produit des constats utiles</Title>
    <Lede>Une grille de gravité, un format imposé, un verdict. Sinon : 15 remarques de style.</Lede>
    <PromptBox cls={A.in} label="Demande de revue" size={23} style={{ position: 'absolute', left: 120, top: 270, width: 820, ...dl(100) }}>
      Fais la revue de ce fichier comme un relecteur senior, selon grille-revue.md. Pour chaque constat : ligne, gravité (Bloquant, Majeur, Mineur, Suggestion), problème, correction. Ignore le formatage (ruff s’en charge). Termine par un verdict : approuver ou demander des changements.
    </PromptBox>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 620, width: 820, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 12, ...dl(250) }}>
      <Tag tone="coral" size={21}>Bloquant</Tag>
      <Tag tone="yellow" size={21}>Majeur</Tag>
      <Tag tone="blue" size={21}>Mineur</Tag>
      <Tag tone="grey" size={21}>Suggestion</Tag>
    </div>
    <AnswerBox cls={A.right} id="copilot" label="Commentaire de revue" size={22} style={{ position: 'absolute', left: 1000, top: 270, width: 800, ...dl(350) }}>
      <span style={{ fontFamily: mono, fontSize: 20, color: T.coral.fg }}>[Bloquant] notes_service.py:31 · Injection SQL</span>
      <br />
      Le courriel est inséré tel quel dans la requête : « ana@x.ca' -- » contourne le mot de passe.
      <br />
      <b>Correction :</b> requête paramétrée, execute("… where email = ?", (email,)).
    </AnswerBox>
    <Callout cls={A.in} title="Un bon commentaire" tone="green" icon="chat" size={24} style={{ position: 'absolute', left: 1000, top: 560, width: 800, ...dl(450) }}>
      Où, quoi, pourquoi c’est grave, comment corriger. Il critique le code, jamais la personne.
    </Callout>
  </Frame>
);

// ─── Lab 07 ─────────────────────────────────────────────────────────────────
const L07_Brief: Page = () => (
  <LabBrief
    mod={4}
    n="07"
    title="Revue de code assistée par l’IA"
    dur="25 min"
    folder="lab07-revue"
    objective="Mener la revue d’une pull request avec l’IA et un analyseur statique, classer et trier les constats, corriger les bloquants."
    cmd={
      <>
        <Pr>ruff check labs/lab07-revue/python</Pr>
        {'\n'}
        <Ko>S105 S324 S608 …</Ko>
        {'\n'}
        <Pr>pytest labs/lab07-revue</Pr>
        {'\n'}
        <Ok>4 passed</Ok>, <Ko>5 failed</Ko>
      </>
    }
    deliverable="REVUE.md (constats classés, « trouvé par : moi / IA / ruff ») et les 9 tests verts."
  >
    <LabStep n={1} t="3 min" title="Revue humaine éclair">
      Lisez la PR sans IA, notez ce qui vous frappe
    </LabStep>
    <LabStep n={2} t="7 min" title="Revue IA + analyseur">
      Demande avec grille-revue.md, puis ruff check
    </LabStep>
    <LabStep n={3} t="5 min" title="Trier, puis révéler">
      Vrai, faux positif, discutable ? Puis lancez les tests de sécurité
    </LabStep>
    <LabStep n={4} t="10 min" title="Corriger les bloquants">
      SQL paramétré, empreinte salée, contrôle d’accès, secret externe
    </LabStep>
  </LabBrief>
);

const L07_Go: Page = () => (
  <LabGo mod={4} n="07" minutes={25} folder="lab07-revue">
    <CheckItem id="l07-1">Ma revue sans IA : constats notés</CheckItem>
    <CheckItem id="l07-2">Revue IA et ruff : trois listes comparées</CheckItem>
    <CheckItem id="l07-3">Constats triés : vrai, faux positif, discutable</CheckItem>
    <CheckItem id="l07-4">Bloquants corrigés : SQL, mot de passe, accès, secret</CheckItem>
    <CheckItem id="l07-5">9 tests verts, REVUE.md rédigé</CheckItem>
  </LabGo>
);

// ─── M4 · Quiz ──────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="La revue IA a dit « LGTM »"
    q="La revue automatique par l’IA ne signale rien sur votre PR. Que pouvez-vous en conclure ?"
    explain="L’absence de constat n’est pas une preuve d’absence de défaut. La revue IA est un premier filtre probabiliste : les tests, l’analyse statique et la revue humaine restent nécessaires."
  >
    <Opt why="Piège ! L’IA ne connaît pas vos règles métier et rate des défauts ; « rien à signaler » n’est pas une garantie.">La PR peut être fusionnée sans autre revue</Opt>
    <Opt ok why="Oui : c’est un filtre de plus. Les tests, l’analyse statique et l’approbation humaine restent les garde-fous.">
      Rien de plus : il faut toujours les tests et une revue humaine
    </Opt>
    <Opt why="Non : aucun outil ne prouve l’absence de faille. Même CodeQL a des angles morts.">Il n’y a aucune faille de sécurité</Opt>
    <Opt why="Faux : la revue IA ne connaît que le diff et un peu de contexte, pas vos décisions passées.">Le code respecte toutes les conventions de l’équipe</Opt>
  </QcmPage>
);

// ─── M4 · Synthesis ─────────────────────────────────────────────────────────
const M4_Synth: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={<>Ajoutez la convention de documentation à vos instructions de projet. Activez une revue IA sur un dépôt pilote… et mesurez combien de ses constats sont utiles.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Imposer une convention ; exemples exécutables, donc vérifiés
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      README, changelog, PR : premier jet IA, vérification humaine
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      Le style aux outils déterministes ; l’IA pour ce qui reste
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      Revue IA : grille, gravité, verdict… puis tri des constats
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      Les règles métier et l’approbation restent humaines
    </SynthRow>
  </SynthPage>
);

// ─── Module 5 divider ───────────────────────────────────────────────────────
const M5_Divider: Page = () => (
  <Section n={5} title="Génération de tests et assurance qualité" sub="Des tests qui protègent vraiment, de l’unitaire à la charge, branchés dans le pipeline." dur="≈ 1 h 20">
    <SecItem n={1}>Tests unitaires et d’intégration</SecItem>
    <SecItem n={2}>Simulation de scénarios et tests de charge</SecItem>
    <SecItem n={3}>Intégration CI/CD et pipelines automatisés</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M4_DocLevels, M4_Docstring, M4_Readme, L06_Brief, L06_Go, M4_Style, M4_Hotspots, M4_ReviewFlow, M4_ReviewPrompt, L07_Brief, L07_Go, M4_Quiz, M4_Synth, M5_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · 4 CLICS

OBJECTIF — Situer ce que l'IA documente bien et ce qu'elle ne peut pas savoir.

→ beat 1 : « Les docstrings : l'IA est très bonne, à condition d'imposer le format. »
→ beat 2 : « Le README : un bon premier jet, à vérifier en lançant chaque commande. »
→ beat 3 : « Le changelog et les descriptions de PR : très bon, car tout est dans git log et le diff. »
→ beat 4 : « Les décisions : le pourquoi. Pourquoi haversine plutôt qu'une API de cartographie ? L'IA peut rédiger, mais c'est vous qui savez. »
Callout : « Le test d'une bonne doc : un collègue peut utiliser le module sans lire le code. »

TRANSITION — « Démonstration. »`,
  `⏱ 4 min · DÉMO · 3 CLICS

DÉMO — Dans l'IDE, sur labs/lab06-documentation/python/geo.py : sélectionnez distance_km, /doc dans Copilot (ou « Generate documentation » dans JetBrains), avec la consigne affichée.
→ beat 1 : la description et les sections Args / Returns. « Il a expliqué la formule et l'hypothèse de la Terre sphérique : c'est le pourquoi. »
→ beat 2 : l'exemple doctest. « 233.0 km entre Montréal et Québec : python -m doctest l'exécute. S'il avait écrit 250, ce serait visible. »
→ beat 3 : les deux cartes.

À SOULIGNER — Sans préciser la convention, on obtient un style par fonction. C'est l'étape 1 du lab.

TRANSITION — « Au-delà des docstrings. »`,
  `⏱ 3 min

OBJECTIF — Montrer trois documents « corvée » que l'IA rédige bien.

DIRE — Lire les trois demandes. « Le journal des modifications à partir de git log : très efficace si vos messages de commit sont clairs. C'est un argument de plus pour les commits du lab 03. »
« La description de PR : écrite pour un relecteur pressé : problème, solution, comment tester, risques. »
Callout : « Toujours lancer chaque commande du README. Une doc qui ment est pire que pas de doc. »

TRANSITION — « Lab 06. »`,
  `⏱ 1 min · CONSIGNE DU LAB 06

DIRE — « Lab 06, labs/lab06-documentation. Un module géographique de 4 fonctions, zéro commentaire. Les tests de documentation sont rouges : ils exigent les sections et un exemple exécutable, et doctest vérifie que les exemples sont justes. »

TRANSITION — « 20 minutes. »`,
  `⏱ 20 min · LAB 06 EN AUTONOMIE

ANIMATION — Point d'étape à 10 minutes : « Combien de tests de documentation verts ? »

BLOCAGES FRÉQUENTS —
• Python : la docstring de module doit faire plus de 40 caractères ; la classe Point doit avoir « Attributes: ».
• Doctest : l'exemple doit utiliser des valeurs réelles (233.0, pas « environ 230 »).
• TypeScript : @param <nom> pour chaque paramètre, @throws pour dansLeRayon.

DÉBRIEF (2 min) — « Avez-vous trouvé une phrase fausse dans la doc générée ? Laquelle ? »`,
  `⏱ 3 min

OBJECTIF — Analyse de style et respect des conventions (programme).

DIRE — « Pour le style, des outils déterministes existent : ruff format ou Prettier pour la mise en forme, ruff ou ESLint pour les règles, mypy ou tsc pour les types. Ils ne se trompent pas et ne coûtent rien. »
« L'IA intervient là où ils s'arrêtent : expliquer une règle obscure, ajouter des types, et surtout les conventions non outillables : le nommage métier, la façon de gérer les erreurs. Ça, on l'écrit dans les instructions de projet. »

RÈGLE — Ne jamais demander à l'IA de formater ou trier des imports.

TRANSITION — « Passons à la revue. Un exercice d'abord. »`,
  `⏱ 5 min · EXERCICE · 5 CLICS

OBJECTIF — Faire vivre une revue avant de l'automatiser.

ANIMATION — « Prenez 60 secondes. Que voyez-vous dans cet extrait ? » Écoutez 3 ou 4 propositions au micro. Puis → révèle les failles une par une : pastille sur le code, explication à droite.
1. Secret en dur. 2. MD5 sans sel. 3. Injection SQL. 4. Exception avalée. 5. Contrôle d'accès absent.

À SOULIGNER (carte violette) — « ruff détecte 1, 2 et 3. L'IA trouve souvent les 5. Mais le contrôle d'accès, c'est une règle métier : c'est vous. »

TRANSITION — « Comment automatiser cette revue ? »`,
  `⏱ 3 min · 4 CLICS

OBJECTIF — Automatiser les revues de code avec l'IA (programme).

→ beat 1 : « Avant d'ouvrir la PR : auto-revue dans le chat, avec la grille de l'équipe. »
→ beat 2 : « La CI : lint, types, tests, analyse de sécurité. Bloquants. »
→ beat 3 : « La revue IA de la PR : Copilot comme relecteur dans GitHub, ou une action de revue. Commentaires en ligne, suggestions applicables. »
→ beat 4 : « Revue humaine et approbation : la conception et les règles métier. »

MESSAGE — « L'IA en premier relecteur fait gagner du temps au second… si on trie le bruit. »

TRANSITION — « Comment lui demander une revue utile ? »`,
  `⏱ 3 min

OBJECTIF — Une demande de revue structurée.

DIRE — « Une grille de gravité, un format, un verdict, et dire ce qu'on ne veut pas : le formatage. » Lire le commentaire de revue : « Où, quoi, pourquoi c'est grave, comment corriger. »
« La grille est dans le dépôt : labs/lab07-revue/grille-revue.md. »

TRANSITION — « Lab 07. »`,
  `⏱ 1 min · CONSIGNE DU LAB 07

DIRE — « Lab 07, labs/lab07-revue. La PR n° 42, "prête pour la prod". Les tests fonctionnels passent. D'abord votre revue, sans IA, 3 minutes. Puis l'IA et ruff. Comparez les trois listes. Ensuite seulement, lancez les tests de sécurité : votre revue avait-elle tout vu ? Puis corrigez les bloquants. »

À SOULIGNER — L'ordre compte : revue humaine d'abord, pour mesurer ce que l'IA ajoute.

TRANSITION — « 25 minutes, jusqu'à la pause. »`,
  `⏱ 25 min · LAB 07 EN AUTONOMIE

ANIMATION — Points d'étape à 10 et 18 minutes : « Combien de bloquants corrigés ? »

INDICES —
• Python : hashlib.pbkdf2_hmac avec os.urandom(16) comme sel ; hmac.compare_digest pour comparer. TypeScript : scryptSync et timingSafeEqual.
• lire_note : « where id = ? and owner = ? ».
• Secret : os.environ["NOTES_SECRET"] (les tests le définissent).

DÉBRIEF (3 min) — « Qui a trouvé le contrôle d'accès sans l'IA ? Et l'IA, l'a-t-elle trouvé ? »`,
  `⏱ 2 min · QCM

RÉPONSE — B.
• A ✗ PIÈGE — « Rien à signaler » n'est pas une garantie.
• C ✗ — Aucun outil ne prouve l'absence de faille.
• D ✗ — La revue IA ne connaît pas vos décisions passées, sauf celles écrites dans les instructions.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 4

DIRE — Lire les cinq points. Encadré : « Activez une revue IA sur un dépôt pilote pendant deux semaines, et comptez les constats utiles. C'est votre mesure. »

⏸ PAUSE 10 h 30 – 10 h 45. Au retour : module 5, les tests.`,
  `⏱ 1 min · DÉBUT DU MODULE 5 (≈ 10 h 45)

DIRE — « Module 5 : génération de tests et assurance qualité. Trois sujets : tests unitaires et d'intégration, simulation de scénarios et tests de charge, intégration CI/CD. Deux labs : une suite de tests jugée par le score de mutation, puis intégration, charge et pipeline GitHub Actions. »

TRANSITION — « D'abord : qu'est-ce qu'un bon test ? »`,
];
// @@NOTES-END
