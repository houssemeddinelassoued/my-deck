// ─── Module 2 · Prompt engineering avancé ──────────────────────────────────

const M2_Section: Page = () => (
  <Section n={2} title="Prompt engineering avancé pour le code" sub="Structurer, illustrer, faire raisonner… et mesurer chaque version sur les mêmes tests." dur="20 min + atelier 1 h 35" labs={<Tag tone="green" size={20}>Atelier 1 · Prompt mesuré</Tag>}>
    <SecItem n={1}>Anatomie d’un prompt de code, structuré en XML</SecItem>
    <SecItem n={2}>Long contexte : où placer quoi</SecItem>
    <SecItem n={3}>Exemples dynamiques (few-shot) choisis par le code</SecItem>
    <SecItem n={4}>Faire raisonner : plan explicite, arbre de pensées</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Anatomie ───────────────────────────────────────────────────────────────
const M2Block = ({ tag, tone, title, children, d }: { tag: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', alignItems: 'center', gap: 20, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 21, color: T[tone].fg }}>{tag}</span>
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M2_Anatomie: Page = () => (
  <Frame mod={2}>
    <Title>Anatomie d’un prompt de code qui tient la route</Title>
    <Lede>Claude a été entraîné à lire des balises XML : elles séparent sans ambiguïté ce qui est consigne, donnée, exemple ou format attendu.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M2Block tag="système" tone="navy" title="Rôle et cadre" d={100}>
        qui il est, pour qui il travaille, ce qui est hors sujet
      </M2Block>
      <M2Block tag="<contexte>" tone="blue" title="Le pourquoi" d={180}>
        à quoi sert le code, qui l’appelle, contraintes du projet
      </M2Block>
      <M2Block tag="<code_existant>" tone="teal" title="Ce qui existe déjà" d={260}>
        types, signatures, conventions, un fichier voisin bien écrit
      </M2Block>
      <M2Block tag="<tache>" tone="green" title="Ce qu’il faut faire" d={340}>
        une seule tâche, un verbe d’action, un périmètre
      </M2Block>
      <M2Block tag="<criteres>" tone="yellow" title="Comment on saura que c’est fini" d={420}>
        cas limites, comportements attendus, tests à faire passer
      </M2Block>
      <M2Block tag="<format_sortie>" tone="violet" title="Ce qu’il doit rendre" d={500}>
        un seul fichier, pas d’explication, ou un plan puis le code
      </M2Block>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card icon="bulb" tone="blue" title="Expliquez le pourquoi" size={22} pad={22} cls={A.right} style={dl(300)}>
        « Les numéros sont rappelés par un automate, d’où le format E.164 » vaut mieux que « FORMAT E.164 OBLIGATOIRE ».
      </Card>
      <Card icon="target" tone="green" title="Des critères vérifiables" size={22} pad={22} cls={A.right} style={dl(450)}>
        Chaque critère doit pouvoir devenir un test. Sinon, c’est un souhait.
      </Card>
      <Card icon="layers" tone="navy" title="Noms de balises libres" size={22} pad={22} cls={A.right} style={dl(600)}>
        Pas de balises « magiques » : choisissez des noms clairs et réutilisez-les dans la consigne.
      </Card>
    </div>
  </Frame>
);

// ─── Avant / après ──────────────────────────────────────────────────────────
const M2_XML: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Le même besoin, deux prompts</Title>
    <Lede>Tâche du fil rouge : écrire la fonction qui normalise une demande (téléphone, e-mail, date, montant).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 640 }}>
      <Eyebrow c={T.coral.fg} size={19} style={{ marginBottom: 10 }}>
        Version 1 · naïve
      </Eyebrow>
      <CodeDark file="prompts/normaliser.v1.md" size={20} wrap cls={A.left}>
        Écris une fonction qui nettoie les données d’une demande client : téléphone, e-mail, date et montant. Fais attention aux cas bizarres. Code propre stp.
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 18, display: 'flex', gap: 10, ...dl(400) }}>
        <Tag tone="coral" size={20}>
          <Icon name="x" size={20} /> langage ? signature ? formats ?
        </Tag>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 820, top: 262, width: 980 }}>
      <Eyebrow c={T.green.fg} size={19} style={{ marginBottom: 10 }}>
        Version 2 · structurée
      </Eyebrow>
      <CodeDark file="prompts/normaliser.v2.md" size={18}>
        <Ck>{'<contexte>'}</Ck>
        {'\n'}Guichet reçoit des demandes saisies à la main. Les téléphones sont
        {'\n'}rappelés par un automate (format E.164), les montants vont en base.
        {'\n'}<Ck>{'</contexte>'}</Ck>
        {'\n'}<Ck>{'<code_existant>'}</Ck>{'{{fichier:src/domaine/demande}}'}<Ck>{'</code_existant>'}</Ck>
        {'\n'}<Ck>{'<tache>'}</Ck>Implémente normaliserDemande(brute) → DemandeNormalisee.<Ck>{'</tache>'}</Ck>
        {'\n'}<Ck>{'<criteres>'}</Ck>
        {'\n'}- téléphone tunisien ou français → E.164 (+216…, +33…), sinon null
        {'\n'}- e-mail en minuscules, espaces retirés ; invalide → null
        {'\n'}- dates « 12/11 », « hier », « 2026-11-12 » → ISO, fuseau Africa/Tunis
        {'\n'}- « 1 500,50 DT » → {'{'} montant: 1500.5, devise: "TND" {'}'}
        {'\n'}- ne lève jamais d’exception : un champ illisible devient null
        {'\n'}<Ck>{'</criteres>'}</Ck>
        {'\n'}<Ck>{'<format_sortie>'}</Ck>Le fichier complet, sans explication.<Ck>{'</format_sortie>'}</Ck>
      </CodeDark>
    </div>
  </Frame>
);

// ─── Long contexte ──────────────────────────────────────────────────────────
const M2_LongCtx: Page = () => (
  <Frame mod={2}>
    <Title>Long contexte : les documents en haut, la question en bas</Title>
    <Lede>Quand le prompt contient beaucoup de matière (code, spécifications, journaux), l’ordre change sensiblement la qualité.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
        { t: '<documents> … 40 fichiers, la spécification, les logs … </documents>', tone: 'teal' as Tone, h: 220 },
        { t: '<consignes> rôle, contraintes, critères </consignes>', tone: 'blue' as Tone, h: 80 },
        { t: '<question> la tâche précise, à la toute fin </question>', tone: 'green' as Tone, h: 80 },
      ].map((x, i) => (
        <div key={i} style={{ height: x.h, borderRadius: 14, background: T[x.tone].bg, boxShadow: `inset 0 0 0 2px ${T[x.tone].bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center', fontFamily: mono, fontSize: 20, color: T[x.tone].fg }}>
          {x.t}
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 940, top: 262, width: 860, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="doc" tone="teal" title="Un document par balise, avec sa source" d={200}>
        <Ic>{'<document source="src/api/demandes.ts">'}</Ic> : Claude peut citer d’où vient une information.
      </Row2>
      <Row2 icon="search" tone="blue" title="Faire extraire avant de répondre" d={300}>
        « Recopie d’abord dans <Ic>{'<extraits>'}</Ic> les passages utiles, puis réponds. » Le bruit est écarté avant le raisonnement.
      </Row2>
      <Row2 icon="layers" tone="navy" title="Stable en haut = cache" d={400}>
        Les documents qui ne changent pas, en tête : c’est aussi l’ordre qui maximise le prompt caching.
      </Row2>
    </div>
  </Frame>
);

// ─── Few-shot dynamique ─────────────────────────────────────────────────────
const M2Ex = ({ txt, tone, on }: { txt: string; tone: Tone; on: boolean }) => (
  <div
    style={{
      fontSize: 18,
      lineHeight: 1.3,
      padding: '8px 12px',
      borderRadius: 10,
      background: on ? T[tone].bg : C.card,
      color: on ? T[tone].fg : C.muted,
      boxShadow: on ? `inset 0 0 0 2px ${T[tone].bd}` : `inset 0 0 0 1.5px ${C.rule}`,
      fontWeight: on ? 700 : 400,
      transition: `all 400ms ${EASE}`,
    }}
  >
    {txt}
  </div>
);

const M2_FewShot: Page = () => {
  const [ref, n] = useBeats();
  const sel = n >= 2;
  return (
    <Frame mod={2} beats={3}>
      <div ref={ref} />
      <Title>Exemples dynamiques : le bon exemple pour le bon cas</Title>
      <Lede>Quelques exemples valent mieux qu’une page de règles. Mais des exemples fixes biaisent : on les choisit par du code, selon le cas traité.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 400 }}>
        <Card icon="inbox" tone="grey" title="Demande entrante" size={22} pad={20}>
          <span style={{ fontStyle: 'italic' }}>« Le portail RH ne charge plus depuis ce matin, 40 personnes bloquées, contrat Or. »</span>
        </Card>
      </div>
      <svg width={120} height={40} style={{ position: 'absolute', left: 530, top: 380 }} aria-hidden>
        <path d="M 6 20 H 106" stroke={C.faint} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 10" className={A.march} />
        <path d="M 96 10 L 110 20 L 96 30" fill="none" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div className={A.in} style={{ position: 'absolute', left: 660, top: 262, width: 520, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8, ...dl(150) }}>
        <Eyebrow c={C.muted} size={17}>
          donnees/exemples.jsonl · 40 exemples
        </Eyebrow>
        <M2Ex txt="Incident · appli mobile plante · Or" tone="blue" on={sel} />
        <M2Ex txt="Devis · refonte site vitrine" tone="blue" on={false} />
        <M2Ex txt="Incident · lenteur portail · Argent" tone="blue" on={sel} />
        <M2Ex txt="Question · facture en double" tone="blue" on={false} />
        <M2Ex txt="Évolution · export Excel du reporting" tone="blue" on={false} />
        <M2Ex txt="Incident · panne totale · Or · 200 utilisateurs" tone="blue" on={sel} />
        <M2Ex txt="… 34 autres" tone="blue" on={false} />
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card icon="filter" tone="blue" title="1. Le code sélectionne" size={22} pad={20} cls={b.on(1)}>
          Similarité simple (mots-clés, type probable) ou par embeddings : les 3 plus proches.
        </Card>
        <Card icon="layers" tone="teal" title="2. Diversité" size={22} pad={20} cls={b.on(2)}>
          Pas trois fois le même cas : au moins un contre-exemple (une fausse urgence).
        </Card>
        <Card icon="note" tone="green" title="3. Balisés, après les consignes" size={22} pad={20} cls={b.on(3)}>
          <Ic>{'<exemple><entree>…</entree><sortie>…</sortie></exemple>'}</Ic>
        </Card>
      </div>
    </Frame>
  );
};

// ─── Few-shot : code à compléter ────────────────────────────────────────────
const M2_FewShotCode: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>À compléter : choisir les exemples</Title>
    <Lede>C’est la fonction de l’étape A1.3. Dites-moi à voix haute ce qui va dans chaque trou.</Lede>
    <LangTabs initial="TS" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="TS" />
        <LangBtn lang="Python" />
      </div>
      <LangPane lang="TS">
        <CodeDark file="ts/src/prompts/exemples.ts" size={20}>
          <Ck>export function</Ck> <Cf>choisirExemples</Cf>(texte: <Ck>string</Ck>, tous: Exemple[], k = <Cn>3</Cn>): Exemple[] {'{'}
          {'\n'}  <Ck>const</Ck> mots = <Cf>motsCles</Cf>(texte);
          {'\n'}  <Ck>const</Ck> notes = tous.<Cf>map</Cf>((ex) {'=>'} ({'{'} ex, score: <Hole>mots en commun</Hole> {'}'}));
          {'\n'}  notes.<Cf>sort</Cf>((a, b) {'=>'} <Hole>ordre</Hole>);
          {'\n'}  <Ck>const</Ck> choisis: Exemple[] = [];
          {'\n'}  <Ck>for</Ck> (<Ck>const</Ck> {'{'} ex {'}'} <Ck>of</Ck> notes) {'{'}
          {'\n'}    <Ck>if</Ck> (choisis.<Cf>some</Cf>((c) {'=>'} <Hole>même type</Hole>)) <Ck>continue</Ck>;
          {'\n'}    choisis.<Cf>push</Cf>(ex);
          {'\n'}    <Ck>if</Ck> (choisis.length === k) <Ck>break</Ck>;
          {'\n'}  {'}'}
          {'\n'}  <Ck>return</Ck> choisis;
          {'\n'}{'}'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="python/guichet/prompts/exemples.py" size={20}>
          <Ck>def</Ck> <Cf>choisir_exemples</Cf>(texte: <Ck>str</Ck>, tous: list[Exemple], k: <Ck>int</Ck> = <Cn>3</Cn>) -{'>'} list[Exemple]:
          {'\n'}    mots = <Cf>mots_cles</Cf>(texte)
          {'\n'}    notes = [(ex, <Hole>mots en commun</Hole>) <Ck>for</Ck> ex <Ck>in</Ck> tous]
          {'\n'}    notes.<Cf>sort</Cf>(key=<Hole>ordre</Hole>)
          {'\n'}    choisis: list[Exemple] = []
          {'\n'}    <Ck>for</Ck> ex, _ <Ck>in</Ck> notes:
          {'\n'}        <Ck>if</Ck> <Cf>any</Cf>(<Hole>même type</Hole> <Ck>for</Ck> c <Ck>in</Ck> choisis):
          {'\n'}            <Ck>continue</Ck>
          {'\n'}        choisis.<Cf>append</Cf>(ex)
          {'\n'}        <Ck>if</Ck> <Cf>len</Cf>(choisis) == k:
          {'\n'}            <Ck>break</Ck>
          {'\n'}    <Ck>return</Ck> choisis
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1280, top: 316, width: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card icon="flask" tone="green" title="Le test qui juge" size={22} pad={22} cls={A.right} style={dl(200)}>
        Pour la demande « portail RH bloqué », les 3 exemples choisis doivent contenir au moins un incident et au moins un type différent.
      </Card>
      <Callout tone="blue" icon="bulb" title="Pourquoi « même type » ?" size={22} cls={A.right} style={dl(350)}>
        Sans diversité, Claude imite le seul cas montré : toutes les demandes deviennent des incidents urgents.
      </Callout>
    </div>
  </Frame>
);

// ─── Raisonnement explicite ─────────────────────────────────────────────────
const M2_CoT: Page = () => (
  <Frame mod={2}>
    <Title>Raisonner : quand demander un plan explicite ?</Title>
    <Lede>La réflexion adaptative raisonne déjà en interne. Un raisonnement écrit dans la réponse reste utile quand <strong>vous</strong> devez le lire ou le traiter.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 780, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="eye" tone="blue" title="Relire avant d’accepter" d={100}>
        Un plan de modification relu en 30 secondes évite 10 minutes de code à jeter.
      </Row2>
      <Row2 icon="code" tone="teal" title="Le traiter par programme" d={200}>
        <Ic>{'<plan>'}</Ic> puis <Ic>{'<code>'}</Ic> : votre script garde le code et journalise le plan.
      </Row2>
      <Row2 icon="search" tone="navy" title="Comprendre une erreur" d={300}>
        Quand la sortie est fausse, le raisonnement écrit montre où il a dérapé.
      </Row2>
      <Row2 icon="bolt" tone="coral" title="Sinon, laissez faire l’effort" d={400}>
        « Réfléchis étape par étape » n’apporte plus grand-chose : augmentez plutôt l’effort.
      </Row2>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 270, width: 840 }}>
      <CodeDark file="extrait de prompt" size={20} wrap cls={A.right} style={dl(250)}>
        Avant d’écrire le code, propose dans <Ck>{'<plan>'}</Ck> :{'\n'}
        {'\n'}1. les fichiers que tu modifies et pourquoi ;
        {'\n'}2. les cas limites que tu traites ;
        {'\n'}3. ce que tu ne changes pas.
        {'\n'}
        {'\n'}Puis écris le code dans <Ck>{'<code>'}</Ck>. Si une information manque, dis-le dans <Ck>{'<questions>'}</Ck> au lieu d’inventer.
      </CodeDark>
    </div>
  </Frame>
);

// ─── Arbre de pensées pratique ──────────────────────────────────────────────
const M2_ToT: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>« Arbre de pensées », version pratique</Title>
    <Lede>Pour une décision de conception : faire produire plusieurs pistes, les évaluer sur des critères donnés, puis développer seulement la meilleure.</Lede>
    <svg width={1680} height={560} style={{ position: 'absolute', left: 120, top: 270 }} aria-hidden>
      {[38, 137, 235].map((y) => (
        <path key={y} d={`M 300 195 C 430 195 430 ${y} 560 ${y}`} fill="none" stroke={C.faint} strokeWidth={3} pathLength={1} className={b.draw(1)} />
      ))}
    </svg>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 360, width: 300 }}>
      <Card icon="target" tone="navy" title="Problème" size={22} pad={20}>
        Détecter les demandes en double (même client, même sujet, à quelques heures d’écart)
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 680, top: 268, width: 440, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { t: 'A · Hachage du texte normalisé', s: 'simple, rate les reformulations' },
        { t: 'B · Similarité + fenêtre de 48 h', s: 'robuste, réglable, sans dépendance' },
        { t: 'C · Un appel à Claude par dépôt', s: 'précis, mais coût et latence par demande' },
      ].map((x, i) => (
        <div key={i} className={cx(b.on(1), i === 1 ? b.hi(3) : b.dim(3))} style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px', ...dl(i * 120) }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{x.t}</div>
          <div style={{ fontSize: 19, color: C.muted }}>{x.s}</div>
        </div>
      ))}
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1160, top: 268, width: 320 }}>
      <Card icon="scale" tone="yellow" title="Critères donnés" size={21} pad={18}>
        coût par demande · faux positifs · maintenance · testabilité
      </Card>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1320, top: 520, width: 480 }}>
      <Card icon="checkCircle" tone="green" title="On développe B" size={22} pad={20}>
        et on garde la trace : pistes, notes, raison du choix, dans <Ic>decisions/doublons.md</Ic>.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
      <Callout tone="blue" icon="bulb" title="L’intérêt réel" size={22} cls={b.on(3)}>
        Les critères viennent de vous, pas du modèle. Claude explore, vous tranchez : la décision reste documentée et discutable.
      </Callout>
    </div>
  </Frame>
);

// ─── Réparer un prompt ──────────────────────────────────────────────────────
const M2_Repare: Page = () => (
  <Frame mod={2} kind="exercice" beats={4}>
    <Title>À vous : quatre défauts dans ce prompt</Title>
    <Lede>Il est utilisé pour qualifier les demandes du Guichet. Dites-moi à voix haute ce qui cloche, je souligne au fur et à mesure.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 940 }}>
      <CodeDark file="prompts/qualifier.md" size={21} wrap cls={A.left}>
        <span className={b.fade(1)} style={{ textDecoration: 'underline wavy #FF6B6B', textUnderlineOffset: 6 }}>
          Nous sommes le {'{{date_du_jour}}'}.
        </span>{' '}
        Tu es un assistant. Lis la demande et donne sa priorité et son type.{' '}
        <span className={b.fade(2)} style={{ textDecoration: 'underline wavy #FF6B6B', textUnderlineOffset: 6 }}>
          SOIS TRÈS PRÉCIS !!!
        </span>
        {'\n\n'}Demande : {'{{texte_du_formulaire}}'}
        {'\n\n'}
        <span className={b.fade(3)} style={{ textDecoration: 'underline wavy #FF6B6B', textUnderlineOffset: 6 }}>
          Réponds en JSON.
        </span>
        {'\n\n'}
        <span className={b.fade(4)} style={{ textDecoration: 'underline wavy #FF6B6B', textUnderlineOffset: 6 }}>
          (Si le client dit que c’est urgent, mets urgent.)
        </span>
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1110, top: 262, width: 690, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Callout tone="coral" icon="clock" title="1. La date en tête" size={21} cls={b.on(1)}>
        Elle change chaque jour : elle casse le cache. À mettre à la fin, ou à calculer dans le code.
      </Callout>
      <Callout tone="coral" icon="alert" title="2. Crier au lieu d’expliquer" size={21} cls={b.on(2)}>
        Aucun critère de priorité. Il faut la grille : contrat, nombre d’utilisateurs touchés, panne totale ou partielle.
      </Callout>
      <Callout tone="coral" icon="code" title="3. « En JSON » sans schéma" size={21} cls={b.on(3)}>
        Quels champs, quelles valeurs ? Sorties structurées avec un schéma, et le texte entre balises.
      </Callout>
      <Callout tone="coral" icon="shield" title="4. Le client décide de sa priorité" size={21} cls={b.on(4)}>
        Le texte du formulaire est une donnée, pas une consigne. La priorité se calcule par des règles (Module 4).
      </Callout>
    </div>
  </Frame>
);

// ─── Démo : de la v1 à la v2 ────────────────────────────────────────────────
const M2_Demo: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Démo : de la v1 à la v2, en direct</Title>
    <Lede>Je lance les deux versions sur la même tâche, devant vous. Regardez trois choses : le score, le temps, et ce que Claude a dû deviner.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file={`Terminal · ${REPO}`} size={21} cls={A.left}>
        <Sh>node guichet.mjs generer normaliser v1</Sh>
        <span style={{ color: '#FF8A8A' }}>✗ 0 / 24 : ne respecte pas la signature attendue</span>
        <span style={{ color: '#8A8A98' }}> · 23 s</span>
        {'\n'}
        <span style={{ color: '#8A8A98' }}>{'  (fichier précédent restauré, génération dans generations/)'}</span>
        {'\n\n'}
        <Sh>node guichet.mjs generer normaliser v2 --modele haiku</Sh>
        <span style={{ color: '#9BE29B' }}>✓ 23 / 24 tests</span>
        <span style={{ color: '#8A8A98' }}> · 71 s</span>
        {'\n\n'}
        <Sh>node guichet.mjs generer normaliser v2 --modele sonnet</Sh>
        <span style={{ color: '#9BE29B' }}>✓ 24 / 24 tests</span>
        <span style={{ color: '#8A8A98' }}> · 90 s</span>
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 14, fontSize: 19, color: C.muted, ...dl(400) }}>Mesures réelles du 15 novembre 2026 (stack TypeScript) : les vôtres varieront d’une génération à l’autre.</div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="eye" tone="blue" title="Ce qu’on regarde" size={22} pad={22} cls={A.right} style={dl(200)}>
        La v1 invente son propre nom de fonction : aucun test ne peut même s’exécuter. La v2 suit le type existant et les critères, mot pour mot.
      </Card>
      <Card icon="search" tone="navy" title="Le modèle compte aussi" size={22} pad={22} cls={A.right} style={dl(350)}>
        Avec Haiku, un cas limite reste rouge : c’est le travail de la v3, à l’atelier. Le prompt a pesé bien plus que le modèle.
      </Card>
    </div>
  </Frame>
);

// ─── Où pratiquer : la boucle de l'atelier ──────────────────────────────────
const M2Loop = ({ n, icon, tone, title, sub, d }: { n: number; icon: IconName; tone: Tone; title: string; sub: ReactNode; d: number }) => (
  <div className={A.pop} style={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, ...dl(d) }}>
    <div style={{ position: 'relative' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <span style={{ position: 'absolute', right: -14, top: -12 }}>
        <Num n={n} tone="grey" size={34} />
      </span>
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35 }}>{sub}</div>
  </div>
);

const M2_Boucle: Page = () => (
  <Frame mod={2}>
    <Title>L’Atelier 1 : un prompt, une génération, un score</Title>
    <Lede>Vous n’allez pas « sentir » qu’un prompt est meilleur : vous allez le mesurer, sur les mêmes tests, à chaque version.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 300px)', justifyContent: 'space-between' }}>
      <M2Loop n={1} icon="note" tone="blue" title="Écrire" sub={<>une version de prompt dans <Ic>prompts/</Ic></>} d={100} />
      <M2Loop n={2} icon="terminal" tone="navy" title="Générer" sub={<>Claude (via <Ic>claude -p</Ic>) écrit le fichier de code</>} d={250} />
      <M2Loop n={3} icon="flask" tone="green" title="Tester" sub="les mêmes 24 tests à chaque fois" d={400} />
      <M2Loop n={4} icon="chart" tone="violet" title="Comparer" sub={<>le score s’ajoute à <Ic>resultats.csv</Ic></>} d={550} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 580, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 760px', gap: 30 }}>
      <CodeDark file={`Terminal · ${REPO}`} size={21} cls={A.in} style={dl(700)}>
        <Sh c="# claude -p, puis tests">node guichet.mjs generer normaliser v2</Sh>
        <span style={{ color: '#9BE29B' }}>✓ 19 / 24 tests</span>
        <span style={{ color: '#8A8A98' }}> · 41 s · ajouté à resultats.csv</span>
      </CodeDark>
      <Callout tone="blue" icon="terminal" title="Et l’application Claude ?" size={22} cls={A.in} style={dl(850)}>
        Vous y écrivez et relisez vos prompts, vous y discutez des échecs. La génération mesurée, elle, passe par <Ic>claude -p</Ic> : même modèle, même compte.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M2_A1: Page = () => (
  <LabPage
    mod={2}
    n="1"
    title="Prompt engineering pour le code"
    defi="prompt"
    who="Individuel"
    minutes={95}
    objective={
      <>
        Faire passer la normalisation des demandes de quelques tests verts à 24 / 24, <strong>en ne modifiant que le prompt</strong>, puis outiller le choix des exemples et
        documenter une décision de conception.
      </>
    }
    where={
      <>
        <Ic>prompts/normaliser.v1.md</Ic> → <Ic>v3.md</Ic>
        <br />
        <Ic>resultats.csv</Ic> (vos scores)
        <br />
        la fonction <Ic>choisirExemples</Ic>
        <br />
        <Ic>decisions/doublons.md</Ic>
      </>
    }
    crit={
      <>
        <CheckItem id="a1c1" size={21}>
          v1, v2, v3 mesurées et notées dans resultats.csv
        </CheckItem>
        <CheckItem id="a1c2" size={21}>
          Code de normalisation à 24 / 24 sans retouche manuelle
        </CheckItem>
        <CheckItem id="a1c3" size={21}>
          verifier A1.3 et A1.4 au vert
        </CheckItem>
      </>
    }
    suivi="Points d’étape à 10 h 45, 11 h 10 et 11 h 35 : « Où en êtes-vous : A1.1, A1.2, A1.3 ou A1.4 ? »"
  >
    <WStep n="1.1">Lancer la v1 naïve, lire les tests qui échouent.</WStep>
    <WStep n="1.2">Écrire la v2 structurée en XML, avec critères ; re-générer.</WStep>
    <WStep n="1.3">Compléter <Ic>choisirExemples</Ic> et brancher les exemples dans le prompt d’extraction.</WStep>
    <WStep n="1.4">Faire proposer 3 conceptions de détection des doublons, choisir sur critères.</WStep>
  </LabPage>
);

const M2_A1Etapes: Page = () => (
  <Frame mod={2} kind="lab">
    <Title>Atelier 1 · les étapes et leurs points de reprise</Title>
    <Lede>Énoncé complet dans <Ic>ateliers/A1.md</Ic>. Une étape réussie : <Ic>node guichet.mjs verifier A1.2</Ic>. Bloqué : la commande à droite vous remet au début de l’étape suivante.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <LabStep id="A1.1" title="Le prompt naïf, et ce qu’il rate" min={20} d={100}>
        <Ic>generer normaliser v1</Ic> ; lisez 3 tests rouges ; notez dans resultats.csv ce qui manquait au prompt (pas au modèle).
      </LabStep>
      <LabStep id="A1.2" title="La version structurée" min={25} d={200}>
        Balises <Ic>contexte</Ic>, <Ic>code_existant</Ic>, <Ic>tache</Ic>, <Ic>criteres</Ic>, <Ic>format_sortie</Ic>. Visez 20 / 24 ; puis une v3 qui traite les derniers cas.
      </LabStep>
      <LabStep id="A1.3" title="Exemples dynamiques" min={20} d={300}>
        Complétez <Ic>choisirExemples</Ic>, branchez-la dans <Ic>prompts/extraction.md</Ic> ; <Ic>extraire --cas 7</Ic> avec et sans exemples, comparez.
      </LabStep>
      <LabStep id="A1.4" title="Plan explicite et arbre de pensées" min={20} d={400}>
        Faites produire 3 conceptions de détection des doublons, notées sur vos critères ; consignez le choix dans <Ic>decisions/doublons.md</Ic>.
      </LabStep>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 930, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(600) }}>
      <Icon name="sparkles" size={24} color={T.pink.fg} /> Bonus : même v3 avec <Ic>--modele haiku</Ic> et <Ic>--modele sonnet</Ic>. Le score bouge-t-il ? Et le temps ?
    </div>
  </Frame>
);

const M2_A1Restit: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Atelier 1 · restitution</Title>
    <Lede>Deux ou trois volontaires montrent leur fichier resultats.csv et leur meilleure version, 2 minutes chacun.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
      <PanelTitle icon="chart">Ce qu’on regarde ensemble</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={24}>Le saut de score entre v1 et v2 : quelles balises ont compté ?</Bullet>
        <Bullet size={24}>Les derniers tests rouges : manque d’information, ou critère ambigu ?</Bullet>
        <Bullet size={24}>Les exemples choisis : variés, ou trois fois le même cas ?</Bullet>
        <Bullet size={24}>La décision sur les doublons : vos critères, ou ceux du modèle ?</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="restit-a1" minutes={8} label="Restitution A1" cls={A.right} style={dl(200)} />
      <Callout tone="green" icon="bulb" title="À retenir" size={23} cls={A.right} style={dl(350)}>
        Un prompt se versionne, se teste et se compare comme du code. Ce qui manquait presque toujours : le contexte et des critères vérifiables.
      </Callout>
    </div>
  </Frame>
);

const M2_Pause: Page = () => <BreakPage mod={2} title="Pause" back="Dix minutes, loin de l’écran. Ensuite : l’Atelier 1, 1 h 35." minutes={10} />;
const M2_Dejeuner: Page = () => <BreakPage mod={2} title="Déjeuner" back="Reprise à 12 h 30 : le harness engineering, puis l’Atelier 2." minutes={30} icon="smile" />;

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_Anatomie, M2_XML, M2_LongCtx, M2_FewShot, M2_FewShotCode, M2_CoT, M2_ToT, M2_Repare, M2_Boucle, M2_Demo, M2_Pause, M2_A1, M2_A1Etapes, M2_A1Restit, M2_Dejeuner];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 2 · J1 9:55

OBJECTIF — Annoncer le module et l’atelier qui suit : on va mesurer les prompts, pas les juger à l’œil.

DIRE — « Module 2 : le prompt engineering avancé, appliqué au code. Quatre techniques, puis un atelier d’une heure trente-cinq où chaque version de prompt sera notée par les mêmes tests. »

TRANSITION — « Commençons par l’anatomie. »`,
  `⏱ 2 min · ANATOMIE

OBJECTIF — Donner le squelette d’un prompt de code structuré en XML.

DIRE — « Six blocs. Le système pour le rôle et le cadre. Le contexte : à quoi sert le code. Le code existant : les types, les conventions, un fichier voisin bien écrit. La tâche, une seule. Les critères, c’est-à-dire comment on saura que c’est fini. Et le format de sortie. Claude a été entraîné à lire des balises XML : elles séparent sans ambiguïté la consigne de la donnée. »

DIRE — « À droite, trois conseils : expliquez le pourquoi au lieu de crier, écrivez des critères qui peuvent devenir des tests, et choisissez des noms de balises clairs : il n’y a pas de balise magique. »

TRANSITION — « Comparons deux prompts sur notre fil rouge. »`,
  `⏱ 2 min · AVANT / APRÈS (1 beat)

OBJECTIF — Rendre concret l’écart entre un prompt naïf et un prompt structuré.

DIRE — « La version 1, je l’ai vue cent fois : “nettoie les données, fais attention aux cas bizarres, code propre”. Quel langage ? Quelle signature ? Quels formats ? Claude va deviner. »
→ beat 1 « La version 2 : le contexte explique pourquoi le format E.164, le code existant est injecté par une variable, la tâche est une signature, et les critères sont des cas précis, qui sont exactement les tests. »

ANIMATION — Ne pas lire tout le prompt : pointer les critères, qui correspondent aux tests de l’Atelier 1.

TRANSITION — « Et quand le prompt est très long ? »`,
  `⏱ 2 min · LONG CONTEXTE

OBJECTIF — Donner la règle de placement et la technique d’extraction préalable.

DIRE — « Quand vous injectez beaucoup de matière, mettez les documents en haut, les consignes ensuite, et la question tout à la fin. Un document par balise avec sa source. Et une technique efficace : demander d’abord de recopier les passages utiles dans une balise extraits, puis de répondre. Bonus : cet ordre est aussi celui qui maximise le cache. »

TRANSITION — « Deuxième technique : les exemples. »`,
  `⏱ 2 min · EXEMPLES DYNAMIQUES (3 beats)

OBJECTIF — Expliquer le few-shot dynamique : les exemples sont choisis par du code selon le cas.

DIRE — « Quelques exemples valent mieux qu’une page de règles. Mais des exemples fixes biaisent : si vous montrez trois incidents urgents, tout devient incident urgent. »
→ beat 1 « Le code sélectionne les exemples les plus proches de la demande entrante : mots-clés, type probable, ou embeddings. »
→ beat 2 « On impose de la diversité : au moins un contre-exemple. »
→ beat 3 « Et on les balise, après les consignes. »

TRANSITION — « C’est justement ce que vous coderez. »`,
  `⏱ 2 min · CODE À COMPLÉTER (vote oral)

OBJECTIF — Faire compléter oralement la fonction de sélection, avant l’atelier.

DIRE — « Trois trous. Le score : le nombre de mots-clés en commun. L’ordre : décroissant. Et le filtre de diversité : on saute un exemple si on a déjà un exemple du même type. Dites-moi à voix haute. »

ANIMATION — Basculer sur l’onglet Python si une partie du groupe est en Python. Réponses : intersection des mots-clés ; b.score − a.score (ou key=lambda n: -n[1]) ; c.type === ex.type.

TRANSITION — « Troisième technique : faire raisonner. »`,
  `⏱ 2 min · PLAN EXPLICITE

OBJECTIF — Positionner le raisonnement écrit par rapport à la réflexion adaptative.

DIRE — « Claude raisonne déjà en interne. Un raisonnement écrit dans la réponse reste utile dans trois cas : quand vous voulez relire un plan avant d’accepter du code, quand votre script doit traiter le plan à part, et quand vous voulez comprendre une erreur. Sinon, augmentez l’effort plutôt que d’écrire “réfléchis étape par étape”. »

DIRE — « À droite, un extrait que vous réutiliserez : un plan, le code, et une balise questions pour qu’il demande au lieu d’inventer. »

TRANSITION — « Et pour une vraie décision de conception ? »`,
  `⏱ 2 min · ARBRE DE PENSÉES (3 beats)

OBJECTIF — Donner une version praticable du Tree of Thoughts : pistes, critères, choix documenté.

DIRE — « Le problème : détecter les demandes en double. »
→ beat 1 « On fait produire trois pistes : un hachage, une similarité avec une fenêtre de temps, ou un appel à Claude à chaque dépôt. »
→ beat 2 « On donne nos critères : coût par demande, faux positifs, maintenance, testabilité. »
→ beat 3 « Et on développe seulement la meilleure, ici B, en gardant la trace de la décision. Les critères viennent de vous : Claude explore, vous tranchez. »

TRANSITION — « À vous de jouer les relecteurs. »`,
  `⏱ 3 min · RÉPARER UN PROMPT (4 beats, vote oral)

OBJECTIF — Faire repérer quatre défauts typiques, dont un défaut de sécurité.

DIRE — « Ce prompt sert à qualifier les demandes. Dites-moi ce qui cloche. »
→ beat 1 « La date en tête : elle change tous les jours, elle casse le cache. »
→ beat 2 « Les majuscules au lieu d’une grille de priorité. »
→ beat 3 « “En JSON” sans schéma. »
→ beat 4 « Et le plus grave : le client décide de sa priorité. Le texte du formulaire est une donnée non fiable. On y reviendra au Module 4 avec l’injection de prompt. »

ANIMATION — Laisser chercher 30 secondes avant chaque clic ; valider les propositions justes même hors liste.

TRANSITION — « Voici comment vous allez travailler pendant l’atelier. »`,
  `⏱ 2 min · LA BOUCLE DE L’ATELIER

OBJECTIF — Expliquer la mécanique écrire → générer → tester → comparer, et le rôle de claude -p.

DIRE — « Vous écrivez une version de prompt dans le dossier prompts. La commande generer l’envoie à Claude par claude -p, avec votre compte, et Claude écrit le fichier de code. Les mêmes vingt-quatre tests tournent, et le score s’ajoute à resultats.csv. Vous ne touchez jamais au code à la main : seul le prompt change. »

DIRE — « L’application Claude reste votre atelier d’écriture : vous y relisez vos prompts, vous discutez des échecs. La mesure, elle, passe par claude -p. »

TRANSITION — « Je vous montre une fois, en direct. »`,
  `⏱ 3 min · DÉMO V1 → V2 (en direct)

OBJECTIF — Montrer la mesure en vrai avant l’atelier : même tâche, deux prompts, deux scores.

DIRE — « Je lance la v1 : zéro sur vingt-quatre. Le code n’expose même pas la fonction attendue : il a inventé son propre nom. Je lance la v2 avec Haiku : vingt-trois. Avec Sonnet : vingt-quatre. Le prompt a pesé bien plus que le modèle ; le dernier cas de Haiku, ce sera votre v3. »

ANIMATION — Lancer réellement les deux commandes sur le poste formateur (dépôt à l’état A1.1). Si le réseau est lent, montrer la page telle quelle : les scores affichés sont des exemples.

TRANSITION — « Dix minutes de pause, puis c’est à vous. »`,
  `⏱ 10 min · PAUSE · J1 10:15

OBJECTIF — Vraie pause, loin de l’écran.

ANIMATION — Lancer le minuteur. Pendant la pause, vérifier sur 2 ou 3 postes que claude -p répond (Atelier 0).

TRANSITION — « On reprend : Atelier 1. »`,
  `⏱ 3 min · BRIEF ATELIER 1 (minuteur 95 min)

OBJECTIF — Lancer l’atelier : objectif, livrables, critères, points d’étape.

DIRE — « Objectif : faire passer la normalisation à vingt-quatre sur vingt-quatre en ne modifiant que le prompt. Puis vous coderez la sélection des exemples, et vous documenterez une décision de conception. Quatre étapes, chacune avec son point de reprise. »

ANIMATION — Lancer le minuteur de 95 minutes. Points d’étape à voix haute à 10 h 45, 11 h 10 et 11 h 35. Passer dans les rangs : les blocages fréquents sont claude -p non connecté (relancer claude puis /login) et un prompt qui demande « le code et une explication » (le format de sortie doit exiger le fichier seul).

TRANSITION — « Le détail des étapes. »`,
  `⏱ 1 min · ÉTAPES DE L’ATELIER 1

OBJECTIF — Montrer les étapes, les durées et les commandes de reprise.

DIRE — « Quatre étapes, vingt minutes environ chacune. Une étape est réussie quand verifier passe au vert. Si à l’heure du point d’étape vous êtes encore sur l’étape d’avant, lancez la reprise : vous partez de la solution de l’étape et vous continuez avec les autres. »

ANIMATION — Laisser cette page affichée pendant l’atelier (ou la précédente, avec le minuteur).

TRANSITION — Fin d’atelier : « Qui veut nous montrer son resultats.csv ? »`,
  `⏱ 8 min · RESTITUTION ATELIER 1 (2–3 volontaires)

OBJECTIF — Tirer les leçons de la mesure : contexte et critères expliquent la plupart des gains.

DIRE — « Deux ou trois volontaires, deux minutes chacun : votre resultats.csv et votre meilleure version. »

ANIMATION — Questionner sur les quatre points affichés. Lancer le minuteur. Conclure par l’encadré : le prompt se versionne et se teste comme du code.

TRANSITION — « Bon appétit, on reprend à 12 h 30 avec le harnais. »`,
  `⏱ 30 min · DÉJEUNER · J1 12:00

OBJECTIF — Pause déjeuner.

ANIMATION — Lancer le minuteur. Rappeler l’heure de reprise : 12 h 30.

TRANSITION — « Module 3 : le harness engineering. »`,
];
// @@NOTES-END
