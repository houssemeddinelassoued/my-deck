// ─── M3 · Debugging method ──────────────────────────────────────────────────
const DbgStep = ({ n, icon, tone, title, ai, children }: { n: number; icon: IconName; tone: Tone; title: string; ai: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <IconTile name={icon} tone={tone} size={48} />
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', background: T.violet.bg, borderRadius: 12, padding: '10px 14px', fontSize: 20, lineHeight: 1.35, color: T.violet.fg }}>
      <strong>IA :</strong> {ai}
    </div>
  </div>
);

const M3_Method: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Déboguer avec l’IA : une méthode en 6 étapes</Title>
    <Lede>L’IA accélère chaque étape. Elle ne remplace aucune d’entre elles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', columnGap: 16 }}>
      <DbgStep n={1} icon="play" tone="blue" title="Reproduire" ai="écrire le script ou le test qui reproduit">
        Un cas minimal, toujours le même résultat.
      </DbgStep>
      <DbgStep n={2} icon="filter" tone="teal" title="Isoler" ai="résumer une trace de 200 lignes">
        La plus petite entrée qui échoue.
      </DbgStep>
      <DbgStep n={3} icon="chat" tone="violet" title="Expliquer" ai="expliquer la trace et le code">
        Comprendre avant de toucher au code.
      </DbgStep>
      <DbgStep n={4} icon="bulb" tone="yellow" title="Hypothèses" ai="proposer 2 ou 3 causes possibles">
        Les vérifier une par une, en lisant ou en traçant.
      </DbgStep>
      <DbgStep n={5} icon="tool" tone="coral" title="Corriger" ai="proposer des corrections et leurs limites">
        Traiter la cause, pas le symptôme.
      </DbgStep>
      <DbgStep n={6} icon="shieldCheck" tone="green" title="Prouver" ai="écrire le test de non-régression">
        Un test qui échoue sans la correction.
      </DbgStep>
    </div>
  </Frame>
);

// ─── M3 · What to give the assistant ────────────────────────────────────────
const M3_Context: Page = () => (
  <Frame mod={3} kind="demo" beats={2}>
    <Title>Donner à l’IA ce qu’elle ne peut pas deviner</Title>
    <Lede>La trace complète, le code, l’attendu et l’obtenu. Puis demander une explication, pas un correctif.</Lede>
    <Term cls={A.in} title="python tableau_de_bord.py" size={19} style={{ position: 'absolute', left: 120, top: 280, width: 900, ...dl(100) }}>
      Occupation des salles · lundi 2 novembre{'\n'}
      {'  '}A-101 : 60%{'\n'}
      {'  '}A-102 : 10%{'\n'}
      <Ko>Traceback (most recent call last):</Ko>
      {'\n'}
      {'  '}File "tableau_de_bord.py", line 22, in afficher{'\n'}
      {'  '}File "reservations.py", line 48, in taux_occupation{'\n'}
      {'    '}return round(heures / (heures_ouvertes * len(jours)), 2){'\n'}
      <Ko>ZeroDivisionError: division by zero</Ko>
    </Term>
    <PromptBox cls={A.in} label="Votre demande" size={23} style={{ position: 'absolute', left: 120, top: 640, width: 900, ...dl(250) }}>
      Voici la trace complète et reservations.py (#file). Attendu : 0 % pour une salle sans réservation. Explique la cause racine en 3 phrases, puis propose 2 corrections avec leurs inconvénients. Pas encore de code.
    </PromptBox>
    <AnswerBox cls={b.on(1)} id="copilot" size={22} style={{ position: 'absolute', left: 1080, top: 280, width: 720 }}>
      <strong>Cause :</strong> pour B-204, aucune réservation, donc l’ensemble jours est vide : len(jours) vaut 0.
      <br />
      <strong>Option 1 :</strong> retourner 0 si la salle n’a aucune réservation (au début de la fonction).
      <br />
      <strong>Option 2 :</strong> try/except ZeroDivisionError → 0. Simple, mais masque d’autres erreurs.
    </AnswerBox>
    <Callout cls={b.on(2)} title="Votre décision" tone="green" icon="humanCheck" size={24} style={{ position: 'absolute', left: 1080, top: 640, width: 720 }}>
      Option 1 : elle traite la cause (« pas de jour ») et documente le cas. Puis un test qui le prouve.
    </Callout>
  </Frame>
);

// ─── M3 · Automatic error detection: layers ─────────────────────────────────
const Layer = ({ n, w, tone, icon, title, ex }: { n: number; w: number; tone: Tone; icon: IconName; title: string; ex: string }) => (
  <div className={b.on(n)} style={{ width: w, height: 104, boxSizing: 'border-box', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 18, background: T[tone].bg, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '0 26px' }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: T[tone].fg }}>{ex}</div>
    </div>
  </div>
);

const M3_Detection: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Détecter les erreurs automatiquement : des filets superposés</Title>
    <Lede>L’IA ajoute une couche ; les outils déterministes restent la base.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1100, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Layer n={5} w={620} tone="green" icon="gear" title="CI : à chaque push" ex="tous les filets, sur chaque pull request" />
      <Layer n={4} w={740} tone="violet" icon="sparkles" title="IA : expliquer et proposer" ex="« Expliquer l’erreur », /fix, revue de PR" />
      <Layer n={3} w={860} tone="coral" icon="check" title="Tests" ex="pytest, node --test : le comportement" />
      <Layer n={2} w={980} tone="teal" icon="code" title="Typage" ex="mypy, pyright, tsc --strict : les incohérences" />
      <Layer n={1} w={1100} tone="blue" icon="search" title="Analyse statique dans l’IDE" ex="ruff, ESLint : erreurs, failles connues, complexité" />
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 1290, top: 260, width: 510 }}>
      <Card tone="yellow" icon="bulb" title="Le bon usage de l’IA" size={24}>
        Elle explique un avertissement obscur, propose la correction, écrit le test manquant. Elle ne remplace pas le linter, qui ne se trompe pas et ne coûte rien.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Symptom vs cause ──────────────────────────────────────────────────
const M3_Symptom: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Corriger la cause, pas le symptôme</Title>
    <Lede>La correction la plus courte proposée par l’IA est souvent un pansement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 810 }}>
      <Tag tone="coral" size={22}>
        Pansement
      </Tag>
      <CodeDark size={21} style={{ marginTop: 14 }}>
        <Kw>def</Kw> <Fn>taux_occupation</Fn>(reservations, salle):{'\n'}
        <Ln kind="add">
          {'    '}
          <Kw>try</Kw>:
        </Ln>
        {'        '}…{'\n'}
        {'        '}
        <Kw>return</Kw> <Fn>round</Fn>(heures / (h * <Fn>len</Fn>(jours)), <Nu>2</Nu>){'\n'}
        <Ln kind="add">
          {'    '}
          <Kw>except</Kw> <Ty>Exception</Ty>:
        </Ln>
        <Ln kind="add">
          {'        '}
          <Kw>return</Kw> <Nu>0</Nu>
        </Ln>
      </CodeDark>
      <div className={b.on(1)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="coral" size={23}>
          Avale aussi les vraies erreurs (clé absente, None…)
        </Bullet>
        <Bullet tone="coral" size={23}>
          Le prochain bogue affichera « 0 % » sans bruit
        </Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 280, width: 810 }}>
      <Tag tone="green" size={22}>
        Cause traitée
      </Tag>
      <CodeDark size={21} style={{ marginTop: 14 }}>
        <Kw>def</Kw> <Fn>taux_occupation</Fn>(reservations, salle):{'\n'}
        {'    '}de_la_salle = [r <Kw>for</Kw> r <Kw>in</Kw> reservations <Kw>if</Kw> …]{'\n'}
        <Ln kind="add">
          {'    '}
          <Kw>if</Kw> <Kw>not</Kw> de_la_salle:{'  '}
          <Cm># aucune réservation</Cm>
        </Ln>
        <Ln kind="add">
          {'        '}
          <Kw>return</Kw> <Nu>0.0</Nu>
        </Ln>
        {'    '}jours = {'{'}r.debut.date() <Kw>for</Kw> r <Kw>in</Kw> de_la_salle{'}'}
        {'\n'}
        {'    '}…
      </CodeDark>
      <div className={b.on(2)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="green" size={23}>
          Le cas métier est explicite et documenté
        </Bullet>
        <Bullet tone="green" size={23}>
          Les autres erreurs restent visibles
        </Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Lab 04 ─────────────────────────────────────────────────────────────────
const L04_Brief: Page = () => (
  <LabBrief
    mod={3}
    n="04"
    title="Chasse aux bogues avec l’IA"
    dur="25 min"
    folder="lab04-debogage"
    objective="Déboguer méthodiquement : reproduire, faire expliquer, formuler des hypothèses, corriger, puis prouver par un test de non-régression."
    cmd={
      <>
        <Pr>pytest labs/lab04-debogage</Pr>
        {'\n'}
        <Ok>4 passed</Ok>, <Ko>5 failed</Ko>
        {'\n'}
        <Pr>npm run test:lab04</Pr>
      </>
    }
    deliverable="9 tests verts (INC-105 en bonus), un commit par ticket avec la cause racine dans le message."
  >
    <LabStep n={1} t="3 min" title="Reproduire INC-101">
      Lancez tableau_de_bord : vous obtenez la trace du rapport d’incidents
    </LabStep>
    <LabStep n={2} t="5 min" title="Faire expliquer, pas corriger">
      Trace complète + code : cause racine et 2 corrections. Vous choisissez.
    </LabStep>
    <LabStep n={3} t="12 min" title="Un ticket à la fois">
      INC-102 à 104 : symptôme + test rouge → hypothèse → vérification
    </LabStep>
    <LabStep n={4} t="5 min" title="Non-régression">
      git stash : le test redevient rouge ? git stash pop.
    </LabStep>
  </LabBrief>
);

const L04_Go: Page = () => (
  <LabGo mod={3} n="04" minutes={25} folder="lab04-debogage">
    <CheckItem id="l04-1">INC-101 reproduit, cause racine expliquée</CheckItem>
    <CheckItem id="l04-2">INC-102 : pagination sans doublon</CheckItem>
    <CheckItem id="l04-3">INC-103 : réservations bout à bout acceptées</CheckItem>
    <CheckItem id="l04-4">INC-104 : arrondi au cent supérieur (sans + 0.0001)</CheckItem>
    <CheckItem id="l04-5">Bonus INC-105 : réservation sur deux jours</CheckItem>
  </LabGo>
);

// ─── M3 · Complexity, measured ──────────────────────────────────────────────
const TimeBar = ({ label, s, max, tone, n, txt }: { label: string; s: number; max: number; tone: Tone; n: number; txt: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 64 }}>
    <span style={{ width: 210, fontSize: 24, color: C.ink, textAlign: 'right' }}>{label}</span>
    <div style={{ flex: 1, height: 40, background: C.panel, borderRadius: 8 }}>
      <div className={b.grow(n)} style={{ width: `${Math.max(0.4, (s / max) * 100)}%`, height: '100%', background: STRONG[tone], borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 120, fontFamily: mono, fontSize: 23, color: tone === 'green' ? C.green : C.ink }}>
      {txt}
    </span>
  </div>
);

const M3_Complexity: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Optimiser : quand la taille double, le temps fait ×4</Title>
    <Lede>Fonction communs() du lab 05, mesurée sur un portable : un « in » sur une liste, dans une boucle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1100 }}>
      <Eyebrow c={C.coral}>Avant · O(n²)</Eyebrow>
      <div style={{ marginTop: 12 }}>
        <TimeBar label="2 000 courriels" s={0.104} max={12.4} tone="coral" n={1} txt="0,10 s" />
        <TimeBar label="4 000" s={0.433} max={12.4} tone="coral" n={1} txt="0,43 s" />
        <TimeBar label="8 000" s={1.896} max={12.4} tone="coral" n={1} txt="1,90 s" />
        <TimeBar label="20 000" s={12.4} max={12.4} tone="coral" n={1} txt="12,4 s" />
      </div>
      <Eyebrow c={C.green} style={{ marginTop: 34 }}>
        Après · O(n), un ensemble (set)
      </Eyebrow>
      <div style={{ marginTop: 12 }}>
        <TimeBar label="20 000" s={0.017} max={12.4} tone="green" n={2} txt="0,02 s" />
        <TimeBar label="200 000" s={0.268} max={12.4} tone="green" n={2} txt="0,27 s" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1290, top: 280, width: 510, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Stat cls={b.on(2)} value="×700" label="plus rapide à 20 000 courriels" tone="green" size={110} />
      <Card cls={b.on(3)} tone="blue" icon="bulb" title="Ce que l’IA voit bien" size={23}>
        Les recherches dans une liste, les count() dans une boucle, les requêtes N+1. Demandez-lui la complexité, ligne par ligne.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Measure first ─────────────────────────────────────────────────────
const M3_Measure: Page = () => (
  <Frame mod={3}>
    <Title>Mesurer avant, mesurer après</Title>
    <Lede>« C’est plus rapide » sans mesure n’est pas une preuve. Le profileur dit où chercher.</Lede>
    <Term cls={A.in} title="python -m cProfile -s cumtime bench.py" size={20} style={{ position: 'absolute', left: 120, top: 280, width: 1000, ...dl(100) }}>
      {'   ncalls  cumtime  filename:lineno(function)\n'}
      {'        3   14.912  analyse.py:31(communs)\n'}
      <Ko>{'     4000   12.871  analyse.py:13(dedoublonner)'}</Ko>
      {'\n'}
      {'        3    0.191  analyse.py:21(top_domaines)\n'}
      {'    80000    0.031  analyse.py:7(normaliser)'}
    </Term>
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1000, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 20 }}>
      <Card cls={A.in} tone="blue" icon="gauge" title="1 · Mesurer" size={22} style={dl(200)}>
        Banc d’essai à plusieurs tailles, profileur.
      </Card>
      <Card cls={A.in} tone="violet" icon="sparkles" title="2 · Proposer" size={22} style={dl(300)}>
        L’IA explique la ligne coûteuse et propose mieux.
      </Card>
      <Card cls={A.in} tone="green" icon="check" title="3 · Prouver" size={22} style={dl(400)}>
        Mêmes tests de comportement, nouveau chrono.
      </Card>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1190, top: 280, width: 610, ...dl(500) }}>
      <Card tone="coral" icon="alert" title="Les pièges classiques" size={23}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <Bullet tone="coral" size={22}>
            list(set(x)) : rapide, mais l’ordre est perdu
          </Bullet>
          <Bullet tone="coral" size={22}>
            Micro-optimisations qui ne changent pas un O(n²)
          </Bullet>
          <Bullet tone="coral" size={22}>
            Cache ajouté sans invalidation
          </Bullet>
          <Bullet tone="coral" size={22}>
            Code illisible pour gagner 3 %
          </Bullet>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Lab 05 ─────────────────────────────────────────────────────────────────
const L05_Brief: Page = () => (
  <LabBrief
    mod={3}
    n="05"
    title="Optimiser avec l’IA… et le prouver"
    dur="20 min"
    folder="lab05-performance"
    objective="Faire analyser la complexité par l’IA, appliquer l’optimisation, puis mesurer le gain sans changer le comportement."
    cmd={
      <>
        <Pr>python …/python/bench.py</Pr>
        {'\n'}
        <Pr>pytest labs/lab05-performance</Pr>
        {'\n'}
        <Ok>6 passed</Ok>, <Ko>2 failed</Ko>
        {'  '}
        <Cm>budgets de temps</Cm>
      </>
    }
    deliverable="Tous les tests verts, dont les 2 budgets de temps, et un tableau avant / après dans NOTES.md."
  >
    <LabStep n={1} t="3 min" title="Mesurer d’abord">
      Banc d’essai : quand la taille double, ×2 ou ×4 ?
    </LabStep>
    <LabStep n={2} t="5 min" title="Faire analyser">
      Complexité de chaque fonction, ligne responsable, version O(n) qui garde l’ordre
    </LabStep>
    <LabStep n={3} t="7 min" title="Appliquer et vérifier">
      Une fonction à la fois, tests de comportement après chacune
    </LabStep>
    <LabStep n={4} t="5 min" title="Mesurer après">
      Banc d’essai, puis 200 000 courriels : les budgets passent ?
    </LabStep>
  </LabBrief>
);

const L05_Go: Page = () => (
  <LabGo mod={3} n="05" minutes={20} folder="lab05-performance">
    <CheckItem id="l05-1">Mesure de départ notée (3 tailles)</CheckItem>
    <CheckItem id="l05-2">Complexité de chaque fonction expliquée</CheckItem>
    <CheckItem id="l05-3">dedoublonner et communs en O(n), ordre conservé</CheckItem>
    <CheckItem id="l05-4">top_domaines : égalités par ordre alphabétique</CheckItem>
    <CheckItem id="l05-5">Budgets de temps verts, tableau avant / après</CheckItem>
  </LabGo>
);

// ─── M3 · Limits: hallucinations ────────────────────────────────────────────
const Halluc = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 270, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M3_Hallucinations: Page = () => (
  <Frame mod={3}>
    <Title>Limites : ce que l’IA invente avec aplomb</Title>
    <Lede>Le code est syntaxiquement parfait. C’est justement ce qui rend l’erreur difficile à voir.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1080, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 24, rowGap: 24 }}>
      <Halluc icon="code" tone="coral" title="API inventées" d={100}>
        Une méthode ou une option qui « devrait » exister : read_excelx(), un paramètre timeout imaginaire.
      </Halluc>
      <Halluc icon="archive" tone="coral" title="Paquets fantômes" d={200}>
        Un nom de paquet plausible… qu’un attaquant peut publier ensuite (« slopsquatting »).
      </Halluc>
      <Halluc icon="clock" tone="yellow" title="Connaissances datées" d={300}>
        Une API dépréciée, une version ancienne : le modèle a une date de coupure.
      </Halluc>
      <Halluc icon="chat" tone="yellow" title="Fausse certitude" d={400}>
        « Ce code est thread-safe » : une affirmation n’est pas une preuve.
      </Halluc>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1260, top: 270, width: 540, ...dl(500) }}>
      <Stat value={<CountUp to={19.7} digits={1} suffix=" %" />} label="des paquets cités dans du code généré n’existaient pas (576 000 extraits, 16 modèles)" tone="coral" size={110} />
      <Callout title="Réflexe" tone="blue" icon="search" size={23} style={{ marginTop: 28 }}>
        Avant d’installer un paquet proposé : il existe, il est maintenu, c’est bien celui de la documentation officielle.
      </Callout>
    </div>
    <Src y={950}>Spracklen et al., « We Have a Package for You! », USENIX Security 2025.</Src>
  </Frame>
);

// ─── M3 · Limits: security and data ─────────────────────────────────────────
const M3_Security: Page = () => (
  <Frame mod={3}>
    <Title>Limites : sécurité et confidentialité</Title>
    <Lede>Le modèle reproduit les motifs qu’il a lus, y compris les mauvais.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 520, ...dl(100) }}>
      <Stat value={<CountUp to={45} suffix=" %" />} label="des extraits de code générés contenaient une faille du Top 10 OWASP" tone="coral" size={130} />
    </div>
    <div style={{ position: 'absolute', left: 700, top: 280, width: 1100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 24, rowGap: 20 }}>
      <Card cls={A.in} tone="coral" icon="database" title="Injection" size={22} style={dl(200)}>
        Requêtes SQL ou commandes construites par concaténation.
      </Card>
      <Card cls={A.in} tone="coral" icon="key" title="Secrets et crypto" size={22} style={dl(300)}>
        Clé en dur, MD5 pour des mots de passe, aléatoire non sûr.
      </Card>
      <Card cls={A.in} tone="yellow" icon="lock" title="Vos données" size={22} style={dl(400)}>
        Ce que vous collez part chez le fournisseur : suivez la politique de votre entreprise.
      </Card>
      <Card cls={A.in} tone="yellow" icon="scale" title="Licences" size={22} style={dl(500)}>
        Activez le filtre de code public si l’outil le propose ; attention aux longs extraits recopiés.
      </Card>
    </div>
    <Callout cls={A.in} title="Conséquence" tone="blue" icon="shieldCheck" size={25} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      Le code généré passe par les mêmes contrôles que le vôtre : revue, analyse statique, tests de sécurité. On le pratique au lab 07.
    </Callout>
    <Src y={950}>Veracode, 2025 GenAI Code Security Report (plus de 100 modèles, 80 tâches).</Src>
  </Frame>
);

// ─── M3 · Human validation checklist ────────────────────────────────────────
const M3_Validate: Page = () => (
  <Frame mod={3}>
    <Title>Valider avant d’accepter : la checklist</Title>
    <Lede>Cinq questions avant chaque Tab, chaque diff, chaque fusion. Elles sont dans le guide PDF.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1080, ...dl(100) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="v1" size={28}>
          Je comprends chaque ligne, et je saurais l’expliquer en revue
        </CheckItem>
        <CheckItem id="v2" size={28}>
          Les tests passent, et l’un d’eux échoue si je casse le code
        </CheckItem>
        <CheckItem id="v3" size={28}>
          Les API, options et paquets cités existent vraiment
        </CheckItem>
        <CheckItem id="v4" size={28}>
          Pas de faille évidente : entrées, secrets, SQL, chemins
        </CheckItem>
        <CheckItem id="v5" size={28}>
          Le diff ne touche que ce que j’ai demandé
        </CheckItem>
      </div>
    </Checklist>
    <div className={A.right} style={{ position: 'absolute', left: 1260, top: 280, width: 540, ...dl(300) }}>
      <Quote by="Règle de l’équipe, à afficher">Vous êtes l’auteur du code que vous fusionnez, quel que soit celui qui l’a tapé.</Quote>
    </div>
  </Frame>
);

// ─── M3 · Quiz ──────────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="Un paquet inconnu"
    q="L’agent propose : pip install fastapi-jwt-helpers. Vous ne connaissez pas ce paquet. Que faites-vous ?"
    explain="Un paquet proposé par l’IA peut ne pas exister, ou avoir été publié par un attaquant sous ce nom plausible. Vérifiez l’existence, le mainteneur et l’usage avant toute installation."
  >
    <Opt why="Piège ! Installer d’abord, c’est exécuter du code inconnu sur votre poste (scripts d’installation).">
      J’installe et je regarde si les tests passent
    </Opt>
    <Opt ok why="Oui : page du paquet, dépôt source, mainteneur, téléchargements, date. Et la documentation officielle de FastAPI pour l’authentification.">
      Je vérifie qu’il existe, qui le maintient et s’il est vraiment utilisé
    </Opt>
    <Opt why="Le demander à la même IA ne prouve rien : elle peut confirmer son invention avec aplomb.">Je demande à l’agent si le paquet est fiable</Opt>
    <Opt why="Un nom proche d’un paquet connu est justement la technique d’attaque (typosquatting).">
      Il ressemble à un paquet connu, donc c’est bon
    </Opt>
  </QcmPage>
);

// ─── M3 · Synthesis ─────────────────────────────────────────────────────────
const M3_Synth: Page = () => (
  <SynthPage
    mod={3}
    title="Module 3 · Ce qu’il faut retenir"
    poste={<>Au prochain bogue : collez la trace complète et demandez une explication, pas un correctif. Et ajoutez la checklist « valider avant d’accepter » au modèle de pull request de votre équipe.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Reproduire, isoler, expliquer, hypothèses, corriger, prouver
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      Donner la trace, l’attendu et l’obtenu ; demander une explication
    </SynthRow>
    <SynthRow n={3} tone="coral" d={300}>
      Traiter la cause, pas le symptôme ; un test de non-régression
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      Optimiser : mesurer avant, mesurer après, mêmes tests
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      API inventées, paquets fantômes, failles : on valide toujours
    </SynthRow>
  </SynthPage>
);

// ─── Day 1 wrap-up ──────────────────────────────────────────────────────────
const J1Mod = ({ n, tone, title, labs, d, children }: { n: number; tone: Tone; title: string; labs: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Num n={pad(n)} tone={tone} size={56} />
      <Tag tone="green" size={20}>
        {labs}
      </Tag>
    </div>
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const J1_Wrap: Page = () => (
  <Frame mod={3} kind="synthese" label="Bilan du jour 1">
    <Title>Bilan du jour 1</Title>
    <Lede>Ce matin, comprendre et générer. Cet après-midi, réécrire, déboguer, optimiser, valider.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 30 }}>
      <J1Mod n={1} tone="blue" title="Panorama" labs="Labs 00, 01" d={100}>
        Un modèle qui prédit, un contexte qui guide, 4 modes d’autonomie croissante.
      </J1Mod>
      <J1Mod n={2} tone="teal" title="Générer, réécrire" labs="Labs 02, 03" d={220}>
        Cinq ingrédients, les tests comme critère, la refactorisation en petites étapes.
      </J1Mod>
      <J1Mod n={3} tone="coral" title="Déboguer, optimiser" labs="Labs 04, 05" d={340}>
        Expliquer avant de corriger, mesurer avant d’optimiser, valider toujours.
      </J1Mod>
    </div>
    <Callout cls={A.in} title="Demain" tone="green" icon="calendar" size={27} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      Documentation et revue, tests et CI/CD, architecture et planification, puis le projet final avec un agent.
    </Callout>
  </Frame>
);

const Ticket = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 30px', ...dl(n * 140) }}>
    <IconTile name={icon} tone={tone} size={72} solid />
    <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const J1_Exit: Page = () => (
  <Frame mod={3} label="Fin du jour 1">
    <Title>Billet de sortie</Title>
    <Lede>Avant de partir : trois réponses courtes, chacun à son tour, au micro.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 30 }}>
      <Ticket n={1} icon="bulb" tone="blue" title="Une chose apprise">
        Ce qui vous a le plus surpris aujourd’hui.
      </Ticket>
      <Ticket n={2} icon="chat" tone="violet" title="Une question">
        Ce qui reste flou : on y répond demain matin.
      </Ticket>
      <Ticket n={3} icon="rocket" tone="green" title="Un essai ce soir">
        Une demande en 5 ingrédients sur un vrai ticket.
      </Ticket>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 700, display: 'flex', alignItems: 'center', gap: 26, ...dl(600) }}>
      <MiniSquares size={56} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 64, color: C.ink }}>Merci, et à demain 9 h !</span>
    </div>
    <Squares s={170} x={1574} y={700} delay={500} />
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Method, M3_Context, M3_Detection, M3_Symptom, L04_Brief, L04_Go, M3_Complexity, M3_Measure, L05_Brief, L05_Go, M3_Hallucinations, M3_Security, M3_Validate, M3_Quiz, M3_Synth, J1_Wrap, J1_Exit];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · 6 CLICS

OBJECTIF — Poser une méthode de débogage où l'IA intervient à chaque étape, sans en sauter aucune.

→ beat 1 : REPRODUIRE — « Un cas minimal qui échoue à chaque fois. L'IA peut écrire le script ou le test de reproduction. »
→ beat 2 : ISOLER — « La plus petite entrée qui échoue. L'IA résume très bien une trace de 200 lignes. »
→ beat 3 : EXPLIQUER — « Avant de toucher au code : comprendre. "Explique cette trace", pas "corrige". »
→ beat 4 : HYPOTHÈSES — « Deux ou trois causes possibles. Vous les vérifiez une par une : lecture, print, débogueur. »
→ beat 5 : CORRIGER — « La cause, pas le symptôme : on y revient dans deux pages. »
→ beat 6 : PROUVER — « Un test qui échoue sans la correction, et passe avec. Sinon, le bogue reviendra. »

TRANSITION — « Que faut-il donner à l'IA pour l'étape 3 ? »`,
  `⏱ 4 min · DÉMO · 2 CLICS

OBJECTIF — Montrer une demande de débogage efficace (c'est le ticket INC-101 du lab 04).

DÉMO — Lancez en direct python labs/lab04-debogage/python/tableau_de_bord.py, collez la trace dans le chat avec le fichier.
DIRE — « La trace complète, le fichier, l'attendu. Et je demande une explication et deux options, pas de code. »
→ beat 1 : la réponse. « La cause : aucun jour, donc len(jours) vaut zéro. Deux options : un test au début, ou un try/except. »
→ beat 2 : « C'est moi qui choisis. L'option 1 traite la cause. Et ensuite : le test qui le prouve. »

TRANSITION — « Avant même de déboguer, des outils détectent beaucoup d'erreurs. »`,
  `⏱ 3 min · 5 CLICS

OBJECTIF — Situer l'IA parmi les outils de détection automatique (programme : détection automatique des erreurs).

→ beat 1 : « La base : l'analyse statique dans l'IDE. ruff, ESLint. Gratuit, instantané, déterministe. »
→ beat 2 : « Le typage : mypy, pyright, tsc en mode strict. »
→ beat 3 : « Les tests : ils vérifient le comportement. »
→ beat 4 : « L'IA : elle explique un avertissement obscur, propose la correction (/fix dans Copilot, "Expliquer l'erreur" dans JetBrains), et fait de la revue de PR. »
→ beat 5 : « Et la CI qui rejoue tout à chaque push. » Carte jaune : « L'IA complète le linter ; elle ne le remplace pas. »

TRANSITION — « Quand l'IA propose une correction, méfiez-vous de la plus courte. »`,
  `⏱ 3 min · 2 CLICS

OBJECTIF — Distinguer pansement et correction de la cause.

DIRE — « À gauche, la correction la plus fréquente proposée : un try/except autour de tout. »
→ beat 1 : « Elle avale toutes les erreurs. Demain, une clé absente affichera 0 % sans un bruit. »
→ beat 2 : « À droite : le cas métier, aucune réservation, est explicite. Les autres erreurs restent visibles. »

INTERACTION — « Qui a déjà vu un except vide en production ? » Une anecdote au micro.

TRANSITION — « À vous de chasser les bogues : lab 04. »`,
  `⏱ 2 min · CONSIGNE DU LAB 04

DIRE — « Lab 04, labs/lab04-debogage. Un module de réservation de salles en production, et un rapport d'incidents : 5 tickets du support. Ils décrivent des symptômes, pas des causes. 4 tests verts, 5 rouges : un par ticket. »
« Méthode : reproduire, faire expliquer, hypothèse, vérifier, corriger, prouver. Un commit par ticket, avec la cause dans le message. »

PIÈGES À ANNONCER — INC-104 : « round(x + 0.0001) "marche"… et échoue ailleurs. Exigez une explication : la représentation binaire des décimaux. » INC-105 en bonus.

TRANSITION — « 25 minutes. »`,
  `⏱ 25 min · LAB 04 EN AUTONOMIE

ANIMATION — Points d'étape à 8 et 16 minutes : « Combien de tickets fermés ? »

INDICES SI BLOCAGE (dans l'ordre) —
• INC-102 : borne de fin d'une tranche (slice) : exclue.
• INC-103 : intervalles semi-ouverts [début, fin[ : < au lieu de <=.
• INC-104 : 31,15 × 1,5 vaut 46,72499… en binaire ; Decimal en Python, calcul en cents en TypeScript.
• INC-105 : timedelta.seconds ignore les jours ; total_seconds(). En TypeScript : getHours() ignore la date.

DÉBRIEF (3 min) — « Quel ticket l'IA a-t-elle résolu du premier coup ? Lequel l'a fait tourner en rond ? »

⏸ PAUSE 14 h 30 – 14 h 45 (si le lab se termine avant, faites la pause ici).`,
  `⏱ 3 min · 3 CLICS · RETOUR DE PAUSE

OBJECTIF — Faire sentir ce qu'est un O(n²), avec des mesures réelles.

DIRE — « La fonction communs() du lab 05 : un "in" sur une liste, à l'intérieur d'une boucle. »
→ beat 1 : « 2 000 courriels : 0,1 seconde. 4 000 : 0,43. 8 000 : 1,9. 20 000 : 12 secondes. Quand la taille double, le temps est multiplié par 4. C'est la signature du quadratique. »
→ beat 2 : « Avec un ensemble (set) : 20 000 courriels en 2 centièmes. 200 000 en un quart de seconde. 700 fois plus rapide. »
→ beat 3 : « L'IA repère très bien ces motifs : recherche dans une liste, count() dans une boucle, requêtes N+1 sur une base. Demandez-lui la complexité ligne par ligne. »

Mesures faites sur un portable pendant la préparation ; vos participants auront d'autres chiffres, mais le même rapport.

TRANSITION — « Encore faut-il savoir où chercher. »`,
  `⏱ 3 min

OBJECTIF — Mesurer avant d'optimiser.

DIRE — « Le profileur dit où le temps passe. Ici, dedoublonner appelée 4 000 fois : c'est elle. »
« La méthode en trois temps : mesurer, faire proposer, prouver avec les mêmes tests et un nouveau chrono. »
Carte rouge : « list(set(...)) est rapide mais perd l'ordre ; un test du lab le détecte. Et une compréhension de liste à la place d'une boucle ne change pas un O(n²). »

Le profil affiché est simplifié pour la lisibilité.

TRANSITION — « Lab 05. »`,
  `⏱ 1 min · CONSIGNE DU LAB 05

DIRE — « Lab 05, labs/lab05-performance. Trois fonctions correctes mais lentes. Les tests de comportement sont verts ; deux budgets de temps sont rouges. »
« Mesurez d'abord, faites analyser, appliquez une fonction à la fois, mesurez après. »

TRANSITION — « 20 minutes. »`,
  `⏱ 20 min · LAB 05 EN AUTONOMIE

ANIMATION — Point d'étape à 10 minutes : « Quel facteur entre avant et après ? » Recueillez les chiffres au micro.

INDICES —
• Python : dict.fromkeys() garde l'ordre ; Counter pour les comptes, mais trier soi-même pour les égalités.
• TypeScript : new Set() garde l'ordre d'insertion ; Map pour les comptes.

DÉBRIEF (2 min) — « Quelqu'un a-t-il eu un list(set()) qui a cassé l'ordre ? »`,
  `⏱ 4 min

OBJECTIF — Les limites (programme : limites et validation humaine) : hallucinations.

DIRE — Les 4 cartes :
• « API inventées : on l'a vu avec read_excelx. »
• « Paquets fantômes : la variante dangereuse. Une étude de 2025 a analysé 576 000 extraits de code produits par 16 modèles : près de 20 % des paquets cités n'existaient pas. Un attaquant peut publier un paquet sous ce nom : c'est le slopsquatting. »
• « Connaissances datées : le modèle a une date de coupure ; il propose parfois une API dépréciée. »
• « Fausse certitude : "ce code est thread-safe". Une affirmation n'est pas une preuve. »

Le taux varie beaucoup selon les modèles (bien plus faible pour les modèles commerciaux de l'étude) : retenez le réflexe, pas le chiffre exact.

TRANSITION — « Autre limite : la sécurité. »`,
  `⏱ 4 min

OBJECTIF — Sécurité, confidentialité, licences.

DIRE — « Veracode a testé en 2025 plus de 100 modèles sur 80 tâches de code : 45 % des extraits générés contenaient une faille du Top 10 OWASP. Le modèle reproduit ce qu'il a lu, y compris le mauvais code. »
Les 4 cartes : injection, secrets et cryptographie faible, vos données (ce que vous collez part chez le fournisseur : suivez la politique de l'entreprise, privilégiez les offres entreprise sans entraînement sur vos données), licences (filtre de code public dans Copilot).

MESSAGE — « Le code généré passe par les mêmes contrôles que le vôtre. On fera une vraie revue de sécurité au lab 07. »

TRANSITION — « Concrètement, que vérifier ? »`,
  `⏱ 3 min · CHECKLIST INTERACTIVE

OBJECTIF — Une checklist de validation humaine réutilisable.

ANIMATION — Lisez les 5 questions. « Pour le code que vous avez accepté aujourd'hui, comptez pour vous combien de cases vous auriez cochées. » Cochez à l'écran pour illustrer, sans demander de score public.

CITATION — « Vous êtes l'auteur du code que vous fusionnez, quel que soit celui qui l'a tapé. » C'est aussi en annexe A du guide PDF.

TRANSITION — « Un dernier QCM. »`,
  `⏱ 3 min · QCM

RÉPONSE — B.
• A ✗ PIÈGE — Installer exécute du code (scripts d'installation, dépendances).
• C ✗ — La même IA peut confirmer son invention.
• D ✗ — Un nom proche d'un paquet connu, c'est précisément le typosquatting.

TRANSITION — « Synthèse du module 3. »`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 3

DIRE — Lire les 5 points. Encadré : « Ajoutez la checklist au modèle de pull request de votre équipe : c'est 5 lignes, et ça change la culture. »

TRANSITION — « Bilan de la journée. »`,
  `⏱ 4 min · BILAN DU JOUR 1 (≈ 15 h 40)

DIRE — « Trois modules, six labs. » Une phrase par carte. Puis : « Demain : documentation et revue, tests et CI/CD, architecture et planification, et le projet final avec un agent. »

INTERACTION — « Un mot pour résumer la journée ? » Trois ou quatre au micro.

TRANSITION — « Avant de partir, le billet de sortie. »`,
  `⏱ 10 min · BILLET DE SORTIE

ANIMATION — Appelez chaque participant par son prénom, dans l'ordre de la liste ; trois réponses courtes, micro ouvert. Notez les questions pour la réactivation de demain matin.

DEVOIR FACULTATIF — « Ce soir ou demain matin, une demande en 5 ingrédients sur un vrai ticket de votre travail, avec du code non confidentiel. On en parle à 9 h. »

FIN DU JOUR 1 — Rappeler l'horaire : 9 h demain. Laissez le dépôt des labs ouvert : tous les labs restent disponibles.`,
];
// @@NOTES-END
