// ─── Module 3 · Prompting et contexte ───────────────────────────────────────
const M3_Divider: Page = () => (
  <Section
    n={3}
    title={
      <>
        Prompting
        <br />
        et contexte
      </>
    }
    sub="Ce que vous écrivez et ce que vous montrez décident de ce que Copilot produit."
    dur="J1 · 13:30 – 14:55"
    labs={<Tag tone="green" size={19}>Atelier 3 · du brief à document.js</Tag>}
  >
    <SecItem n={1}>L’anatomie d’un bon prompt</SecItem>
    <SecItem n={2}>Ce que Copilot lit, et les références de contexte</SecItem>
    <SecItem n={3}>La fenêtre de contexte, le commentaire guide et la JSDoc</SecItem>
    <SecItem n={4}>Du plan à la spécification, puis l’agent</SecItem>
    <SecItem n={5}>Lire avant d’accepter</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ─── Anatomie d'un prompt ───────────────────────────────────────────────────
const M3Ing = ({ tone, label, children, d }: { tone: Tone; label: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr)', gap: 16, alignItems: 'center', ...dl(d) }}>
    <Tag tone={tone} size={21}>
      {label}
    </Tag>
    <span style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const M3Part = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span style={{ background: T[tone].bg, boxShadow: `inset 0 -3px 0 ${T[tone].bd}`, borderRadius: 4, padding: '0 4px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{children}</span>
);

const M3_Anatomie: Page = () => (
  <Frame mod={3} beats={1}>
    <Title>L’anatomie d’un bon prompt : cinq ingrédients</Title>
    <Lede>« Fais le module document » laisse Copilot deviner. Chaque ingrédient retire une devinette.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M3Ing tone="blue" label="Objectif" d={100}>
        ce qu’il faut produire, en une phrase
      </M3Ing>
      <M3Ing tone="teal" label="Contexte" d={180}>
        les fichiers, la version, le métier
      </M3Ing>
      <M3Ing tone="violet" label="Contraintes" d={260}>
        ce qui est imposé ou interdit
      </M3Ing>
      <M3Ing tone="green" label="Critères" d={340}>
        comment on saura que c’est fini
      </M3Ing>
      <M3Ing tone="yellow" label="Format" d={420}>
        la forme de la réponse attendue
      </M3Ing>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 940, top: 262, width: 860, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="chat" c={C.violet}>
        Le prompt de l’Atelier 3
      </PanelTitle>
      <div style={{ fontSize: 23, lineHeight: 1.75, color: C.ink }}>
        <M3Part tone="blue">Écris src/document.js selon #BRIEF.md.</M3Part> <M3Part tone="teal">Contexte : #erreurs.js et les tests #a3-document.test.js, Node 22, aucune dépendance.</M3Part>{' '}
        <M3Part tone="violet">Fonctions pures, ErreurParafo avec les codes du brief, JSDoc en français.</M3Part>{' '}
        <M3Part tone="green">Fini quand npm run test:atelier3 est vert, sans modifier les tests.</M3Part>{' '}
        <M3Part tone="yellow">Réponds par un plan numéroté, puis la liste des cas limites.</M3Part>
      </div>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(700) }}>
      Les règles qui reviennent à chaque prompt iront dans un fichier d’instructions : c’est le Module 4.
    </Hint>
  </Frame>
);

// ─── Ce que Copilot voit ────────────────────────────────────────────────────
const M3Seg = ({ icon, tone, title, sub, beat }: { icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 5px 0 0 ${STRONG[tone]}` }}>
    <Icon name={icon} size={28} color={T[tone].fg} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M3_Contexte: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Ce que Copilot lit avant de proposer</Title>
    <Lede>Deux mécanismes, deux contextes. Ce qui n’est pas dans le contexte n’existe pas pour le modèle.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="code" c={C.blue}>
        Suggestion inline · texte grisé
      </PanelTitle>
      <CodeDark file="src/document.js" size={20}>
        <div style={{ boxShadow: 'inset 4px 0 0 #82AAFF', paddingLeft: 12 }}>
          <Ck>import</Ck> {'{ ETATS }'} <Ck>from</Ck> <Cs>'./etats.js'</Cs>;{'\n'}
          <Cc>{'// Vrai si l’état fait partie du cycle de vie'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>estEtatValide</Cf>(etat) {'{'}
        </div>
        <div style={{ paddingLeft: 16 }}>
          {'  '}
          <Ck>return</Ck> <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>ETATS.includes(etat);</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 24, background: '#FFD27A', verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
        <div style={{ boxShadow: 'inset 4px 0 0 #C792EA', paddingLeft: 12 }}>
          {'}'}
          {'\n'}
          <Ck>export function</Ck> <Cf>changerEtat</Cf>(document, nouvelEtat) {'{ … }'}
        </div>
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={23} tone="blue">
          Le code <em>avant</em> et <em>après</em> le curseur
        </Bullet>
        <Bullet size={23} tone="blue">
          Commentaires, noms, imports, nom du fichier
        </Bullet>
        <Bullet size={23} tone="blue">
          Les onglets ouverts à côté (pas les fichiers fermés)
        </Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="chat" c={C.violet}>
        Copilot Chat · ce qui part au modèle
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M3Seg icon="gear" tone="grey" title="Instructions de l’outil" sub="fixées par VS Code, invisibles pour vous" beat={1} />
        <M3Seg icon="doc" tone="navy" title="Instructions du dépôt" sub=".github/copilot-instructions.md (Module 4)" beat={1} />
        <M3Seg icon="link" tone="blue" title="Vos références" sub="#file · #selection · #codebase · fichiers glissés" beat={1} />
        <M3Seg icon="loop" tone="yellow" title="L’historique de la session" sub="tout ce qui a été dit… erreurs comprises" beat={1} />
        <M3Seg icon="send" tone="violet" title="Votre message" sub="souvent la plus petite partie" beat={1} />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 905, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>
        <strong>Conséquence :</strong> pour l’inline, soignez le fichier et les onglets ; pour le Chat, soignez les références et repartez d’une session propre.
      </span>
    </div>
  </Frame>
);

// ─── Les références de contexte ─────────────────────────────────────────────
const M3Ref = ({ code, tone, title, children, d }: { code: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', borderLeft: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span style={{ fontFamily: mono, fontSize: 23, fontWeight: 700, color: T[tone].fg }}>{code}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 20, color: C.soft, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const M3_References: Page = () => (
  <Frame mod={3}>
    <Title>Les références de contexte : montrer plutôt que décrire</Title>
    <Lede>
      Tapez <Ic>#</Ic> dans le Chat, ou le bouton « + » : vous joignez exactement ce que Copilot doit lire.
    </Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
      <M3Ref code="#document.js" tone="blue" title="Un fichier" d={100}>
        Le plus sûr et le moins cher. Ou glissez le fichier dans le Chat.
      </M3Ref>
      <M3Ref code="#selection" tone="teal" title="La sélection" d={160}>
        Juste les lignes surlignées dans l’éditeur.
      </M3Ref>
      <M3Ref code="#codebase" tone="violet" title="Tout le dépôt" d={220}>
        Copilot cherche lui-même les extraits utiles. Plus large, plus coûteux.
      </M3Ref>
      <M3Ref code="#problems" tone="coral" title="Les erreurs" d={280}>
        Ce que l’éditeur souligne en rouge, avec les messages.
      </M3Ref>
      <M3Ref code="#changes" tone="navy" title="Vos modifications" d={340}>
        Le diff Git en cours : idéal pour « relis ce que j’ai changé ».
      </M3Ref>
      <M3Ref code="#terminalLastCommand" tone="yellow" title="Le terminal" d={400}>
        La dernière commande et sa sortie, par exemple un test rouge.
      </M3Ref>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="blue" icon="search" title="En mode Agent" size={22} cls={A.in} style={dl(600)}>
        L’agent cherche et lit aussi tout seul. Vos références lui évitent des tours de boucle inutiles.
      </Callout>
      <Callout tone="green" icon="eye" title="Vérifiez ce qui a été lu" size={22} cls={A.in} style={dl(750)}>
        Sous chaque réponse, « Références » liste les fichiers utilisés. Un fichier attendu manque ? Joignez-le.
      </Callout>
    </div>
  </Frame>
);

// ─── Fenêtre de contexte ────────────────────────────────────────────────────
const M3Block = ({ w, tone, label, cls }: { w: number; tone: Tone; label: string; cls?: string }) => (
  <div className={cls} style={{ width: w, height: 70, boxSizing: 'border-box', borderRadius: 10, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 600, color: T[tone].fg, textAlign: 'center', padding: '0 8px', lineHeight: 1.2 }}>
    {label}
  </div>
);

const M3_Fenetre: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>La fenêtre de contexte : une mémoire de taille fixe</Title>
    <Lede>Le modèle ne lit qu’un nombre limité de « tokens » à la fois (un token ≈ ¾ de mot). Quand c’est plein, quelque chose sort.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <Eyebrow c={C.navy} size={20}>
        Ce qui tient dans la fenêtre
      </Eyebrow>
      <div style={{ position: 'relative', marginTop: 14, width: 1400, height: 96, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${C.navy}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 13px', boxSizing: 'border-box' }}>
        <M3Block w={170} tone="grey" label="Instructions" />
        <M3Block w={260} tone="navy" label="Fichier courant" />
        <M3Block w={230} tone="blue" label="Onglets voisins" />
        <M3Block w={300} tone="yellow" label="Historique de la session" cls={b.on(1)} />
        <M3Block w={180} tone="violet" label="Votre message" />
        <div className={b.on(1)} style={{ position: 'absolute', left: 1420, top: 13 }}>
          <M3Block w={240} tone="coral" label="… tronqué" />
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="eyeOff" tone="coral" title="Symptômes" size={22} pad={24} cls={b.on(1)}>
        Il « oublie » une consigne donnée au début, mélange deux sujets, invente une fonction que vous aviez montrée il y a longtemps.
      </Card>
      <Card icon="filter" tone="blue" title="Moins, mais mieux" size={22} pad={24} cls={b.on(2)}>
        Fermez les onglets sans rapport, joignez le fichier utile avec <Ic>#file</Ic>, plutôt que tout le projet.
      </Card>
      <Card icon="reset" tone="green" title="Repartir propre" size={22} pad={24} cls={b.on(2)}>
        Un sujet = une session (<Kbd>Ctrl+N</Kbd>). Session longue : <Ic>/compact</Ic> la résume.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Grands projets : #codebase laisse Copilot chercher les extraits pertinents, au lieu de tout envoyer.
    </Hint>
  </Frame>
);

const Gh = ({ children }: { children: ReactNode }) => <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>{children}</span>;

// ─── Le commentaire comme guide (interactif) ────────────────────────────────
const M3_ING = [
  { key: 'Entrée', tone: 'blue' as Tone, line: '// Entrée : le titre saisi (texte)' },
  { key: 'Sortie', tone: 'teal' as Tone, line: '// Sortie : true ou false' },
  { key: 'Règle', tone: 'violet' as Tone, line: '// Règle : 3 à 120 caractères, espaces autour ignorés' },
  { key: 'Exemple', tone: 'green' as Tone, line: '// Ex. : "Contrat" → true · "  ab  " → false' },
  { key: 'Contrainte', tone: 'coral' as Tone, line: '// Pas un texte (42, undefined) → false' },
];
const M3_OUT = [
  'return titre.length > 0;',
  'return typeof titre === "string";',
  'return titre.length >= 3 && titre.length <= 120;',
  'return titre.trim().length >= 3 && titre.trim().length <= 120;',
  'return titre.trim().length >= 3 && titre.trim().length <= 120;',
  'if (typeof titre !== "string") return false;\n  return titre.trim().length >= 3 && titre.trim().length <= 120;',
];

const M3Builder = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const n = on.filter(Boolean).length;
  const quality = n <= 1 ? 'coral' : n <= 3 ? 'yellow' : 'green';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '440px minmax(0, 1fr)', gap: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {M3_ING.map((g, i) => (
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
        <CodeDark file="src/document.js" size={21}>
          <Cc>{'// Vérifie le titre'}</Cc>
          {M3_ING.map((g, i) => (on[i] ? <Cc key={g.key}>{`\n${g.line}`}</Cc> : null))}
          {'\n'}
          <Ck>function</Ck> <Cf>estTitreValide</Cf>(titre) {'{'}
          {'\n  '}
          <Gh>{M3_OUT[n]}</Gh>
          {'\n}'}
        </CodeDark>
        <div style={{ marginTop: 16, borderRadius: 14, padding: '14px 20px', fontSize: 23, lineHeight: 1.4, background: T[quality].bg, color: C.ink }}>
          <strong style={{ color: T[quality].fg }}>{n}/5 ingrédients · </strong>
          {n <= 1 ? 'Copilot devine : « ab » passerait.' : n <= 3 ? 'Mieux, mais un cas limite reste ouvert.' : 'Précis et vérifiable : la suggestion respecte la règle et ses pièges.'}
        </div>
      </div>
    </div>
  );
};

const M3_Commentaire: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Le commentaire guide : 5 ingrédients, puis la JSDoc</Title>
    <Lede>Dites-moi quel ingrédient ajouter au micro : j’active, et l’on regarde la suggestion probable évoluer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M3Builder />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Suggestions illustratives. Pour une fonction exportée, mettez ces ingrédients dans la JSDoc (@param, @returns, @throws) : elle guide Copilot et documente le code.
    </Hint>
  </Frame>
);

// ─── Simulateur : accepter, refuser, choisir ────────────────────────────────
const M3_ALTS = [
  {
    code: 'return documents.filter((d) => d.etat === "signe").reduce((s, d) => s + d.taille, 0);',
    ok: true,
    verdict: 'Correcte : filtre les signés, valeur initiale 0 (registre vide → 0).',
  },
  {
    code: 'return documents.reduce((s, d) => s + d.taille);',
    ok: false,
    verdict: 'Fausse : oublie le filtre « signé » et la valeur initiale (registre vide → erreur).',
  },
  {
    code: 'let total = 0; for (const d of documents) if (d.etat === "signe") total += d.taille; return total;',
    ok: true,
    verdict: 'Correcte aussi, plus verbeuse : une question de style d’équipe.',
  },
];

const M3Sim = () => {
  const [alt, setAlt] = useState(0);
  const [taken, setTaken] = useState(0);
  const [state, setState] = useState<'ghost' | 'done' | 'no'>('ghost');
  const words = M3_ALTS[alt].code.match(/\S+\s*/g) ?? [];
  const accepted = state === 'done' ? words.join('') : words.slice(0, taken).join('');
  const ghost = state === 'ghost' ? words.slice(taken).join('') : '';
  const reset = () => {
    setTaken(0);
    setState('ghost');
  };
  return (
    <div>
      <CodeDark file="src/registre.js" size={22} wrap>
        <Cc>{'// Taille totale, en octets, des documents signés'}</Cc>
        {'\n'}
        <Ck>function</Ck> <Cf>tailleSignes</Cf>(documents) {'{'}
        {'\n  '}
        <span style={{ color: '#E6EAF6' }}>{accepted}</span>
        <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>{ghost}</span>
        {state === 'no' ? <span style={{ color: '#F28B82' }}>{'  // suggestion refusée'}</span> : null}
        {'\n}'}
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Btn size={20} tone="blue" ghost disabled={state !== 'ghost'} onClick={() => { setAlt((alt + 1) % M3_ALTS.length); setTaken(0); }}>
          Alt+] suivante ({alt + 1}/3)
        </Btn>
        <Btn size={20} tone="teal" ghost disabled={state !== 'ghost'} onClick={() => (taken + 1 >= words.length ? setState('done') : setTaken(taken + 1))}>
          Ctrl+→ un mot
        </Btn>
        <Btn size={20} tone="green" disabled={state !== 'ghost'} onClick={() => setState('done')}>
          Tab accepter
        </Btn>
        <Btn size={20} tone="coral" ghost disabled={state !== 'ghost'} onClick={() => setState('no')}>
          Échap refuser
        </Btn>
        <Btn size={20} tone="grey" ghost icon="reset" onClick={reset} />
      </div>
      <div style={{ marginTop: 18, minHeight: 74, boxSizing: 'border-box', borderRadius: 14, padding: '14px 20px', fontSize: 23, lineHeight: 1.4, background: state === 'done' ? (M3_ALTS[alt].ok ? T.green.bg : T.coral.bg) : T.grey.bg, color: C.ink }}>
        {state === 'done' ? (
          <>
            <strong style={{ color: M3_ALTS[alt].ok ? T.green.fg : T.coral.fg }}>{M3_ALTS[alt].ok ? '✓ ' : '✗ Acceptée trop vite : '}</strong>
            {M3_ALTS[alt].verdict}
          </>
        ) : state === 'no' ? (
          <span>Refusée. Continuez à taper : Copilot reproposera en tenant compte de ce que vous écrivez.</span>
        ) : (
          <span style={{ color: C.muted }}>Lisez la proposition {alt + 1} avant d’appuyer sur Tab. Laquelle est juste ?</span>
        )}
      </div>
    </div>
  );
};

const M3_Simulateur: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Accepter, refuser ou choisir : entraînez-vous</Title>
    <Lede>Trois propositions pour la même fonction. Dites-moi au micro laquelle garder, puis je joue les touches.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M3Sim />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="yellow" icon="eye" title="Ce que l’exercice montre" size={24} cls={A.fade} style={dl(500)}>
        Les trois propositions ont l’air sûres d’elles. Une seule lecture attentive suffit à écarter la mauvaise : c’est le geste le plus rentable de la formation.
      </Callout>
    </div>
  </Frame>
);

// ─── Du plan à la spécification ─────────────────────────────────────────────
const M3PlanLine = ({ n, children, cls, strike }: { n: number | string; children: ReactNode; cls?: string; strike?: boolean }) => (
  <div className={cls} style={{ display: 'flex', gap: 12, fontSize: 21, lineHeight: 1.45, color: strike ? '#F28B82' : '#E6EAF6', textDecoration: strike ? 'line-through' : 'none' }}>
    <span style={{ width: 26, color: '#8E98BC', flex: 'none' }}>{n}</span>
    <span>{children}</span>
  </div>
);

const M3_PlanSpec: Page = () => (
  <Frame mod={3} kind="demo" beats={3}>
    <Title>Du plan à la spécification, puis l’agent</Title>
    <Lede>En mode Plan, Copilot propose ; vous corrigez ; le plan corrigé devient la spécification que l’agent exécute.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 960, background: '#0F1530', borderRadius: 18, padding: '20px 26px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', display: 'flex', flexDirection: 'column', gap: 6, ...dl(100) }}>
      <div style={{ fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E98BC', marginBottom: 6 }}>Plan proposé · src/document.js</div>
      <M3PlanLine n={1}>empreinteSha256 avec node:crypto</M3PlanLine>
      <M3PlanLine n={2}>creerDocument : titre 3 à 120 caractères, auteur e-mail en minuscules</M3PlanLine>
      <M3PlanLine n={3} strike>
        taille = contenu.length
      </M3PlanLine>
      <M3PlanLine n="3’" cls={b.on(1)}>
        <span style={{ color: '#9BE29B' }}>taille en octets : Buffer.byteLength (« été » = 5 octets)</span>
      </M3PlanLine>
      <M3PlanLine n={4}>changerEtat : transitions du brief, copie du document</M3PlanLine>
      <M3PlanLine n={5} strike>
        adapter les tests si besoin
      </M3PlanLine>
      <M3PlanLine n="5’" cls={b.on(2)}>
        <span style={{ color: '#9BE29B' }}>ne jamais modifier test/acceptance/ ; npm run test:atelier3 jusqu’au vert</span>
      </M3PlanLine>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 262, width: 660, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <PanelTitle icon="eye" c={C.navy}>
        Relire un plan : 5 vérifications
      </PanelTitle>
      <Bullet size={22}>Toutes les règles du brief y sont</Bullet>
      <Bullet size={22}>Les cas limites sont nommés</Bullet>
      <Bullet size={22}>Les fichiers touchés, et seulement eux</Bullet>
      <Bullet size={22}>Ce qu’il ne doit pas toucher</Bullet>
      <Bullet size={22}>La commande qui prouve que c’est fini</Bullet>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="green" icon="play" title="Puis : mettre en œuvre" size={23}>
        On lance l’agent depuis le plan relu. Il édite, lance les tests, itère ; vous approuvez les commandes et vous relisez le diff.
      </Callout>
    </div>
  </Frame>
);

// ─── Lire avant d'accepter ──────────────────────────────────────────────────
const M3Q = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="violet" size={40} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const M3_Lire: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Lire une suggestion avant de l’accepter : 5 questions</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M3Q n={1} title="Fait-elle ce que j’ai demandé ?" d={100}>
        Toute la demande, rien de plus.
      </M3Q>
      <M3Q n={2} title="Ce qu’elle appelle existe-t-il ?" d={200}>
        Fonctions, propriétés, bibliothèques : rien d’inventé.
      </M3Q>
      <M3Q n={3} title="Et les cas limites ?" d={300}>
        Liste vide, null, zéro, doublon, très grand nombre.
      </M3Q>
      <M3Q n={4} title="A-t-elle des effets de bord ?" d={400}>
        Modifie-t-elle ses paramètres, un état global, un fichier ?
      </M3Q>
      <M3Q n={5} title="Puis-je l’expliquer ligne à ligne ?" d={500}>
        Sinon : Ask « explique », ou je refuse.
      </M3Q>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 950, top: 210, width: 850, ...dl(300) }}>
      <CodeDark file="suggestion acceptée sans lecture" size={21}>
        <Cc>{'// Renvoie le dernier document créé'}</Cc>
        {'\n'}
        <Ck>function</Ck> <Cf>dernierDocument</Cf>(documents) {'{'}
        {'\n  '}documents.<span style={{ background: 'rgba(242,139,130,.25)' }}>sort</span>((a, b) =&gt; a.creeLe.<span style={{ background: 'rgba(242,139,130,.25)' }}>localeCompare</span>(b.creeLe));
        {'\n  '}
        <Ck>return</Ck> documents[<span style={{ background: 'rgba(242,139,130,.25)' }}>documents.length</span>];{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className={b.on(1)}>
          <Callout tone="coral" icon="bug" title="Question 4 · effet de bord" size={21}>
            <Ic>sort</Ic> trie le tableau reçu sur place : tout le registre est réordonné.
          </Callout>
        </div>
        <div className={b.on(2)}>
          <Callout tone="coral" icon="bug" title="Question 3 · cas limite" size={21}>
            <Ic>documents[documents.length]</Ic> vaut toujours <Ic>undefined</Ic> : il fallait <Ic>length - 1</Ic>.
          </Callout>
        </div>
        <div className={b.on(3)}>
          <Callout tone="green" icon="check" title="Version relue" size={21}>
            <Ic>{'documents.toSorted(…).at(-1)'}</Ic>, ou un simple <Ic>reduce</Ic> qui garde le plus récent.
          </Callout>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M3_Lab: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Du brief au code : document.js"
    defi="plan"
    who="Individuel · 35 min"
    objective={
      <>
        Transformer un <strong>brief métier</strong> en code testé : un plan <strong>relu et corrigé</strong>, puis l’<strong>agent</strong> guidé par les tests d’acceptation. JSDoc en français.
      </>
    }
    where={
      <>
        <PathChip size={19}>ateliers/atelier-03-document/BRIEF.md</PathChip>
        <br />
        <PathChip size={19}>src/document.js</PathChip>
        <br />
        un commit « feat : document à signer »
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="l3a" size={21}>test:atelier3 : 39 tests verts</CheckItem>
        <CheckItem id="l3b" size={21}>npm run garde : vert</CheckItem>
        <CheckItem id="l3c" size={21}>JSDoc avec @throws partout</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (plan relu ?) et 25 min (combien de tests verts ?)."
  >
    <WStep n={1}>Lisez le brief : repérez vous-même deux règles faciles à oublier.</WStep>
    <WStep n={2}>Mode Plan, prompt en 5 ingrédients (dans le Chat). Vos deux règles sont-elles dans le plan ? Corrigez-le.</WStep>
    <WStep n={3}>Mise en œuvre en mode Agent ; refusez toute modification de test/acceptance/. Relisez le diff, puis commit.</WStep>
    <TpBonus>demandez en Ask quels cas du brief les tests ne vérifient pas.</TpBonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <Frame mod={3} kind="qcm">
    <Title>QCM · Module 3 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="« Écris document.js. Fonctions pures, JSDoc en français. » Quel ingrédient manque le plus ?" explain="Sans critère d’acceptation, ni vous ni l’agent ne savez quand c’est fini. « npm run test:atelier3 vert, tests non modifiés » ferme la porte aux devinettes.">
        <QOpt>Le format de réponse</QOpt>
        <QOpt ok>Le critère qui dit que c’est fini</QOpt>
        <QOpt>Une formule de politesse</QOpt>
      </QuizQ>
      <QuizQ q="Une longue conversation, et Copilot « oublie » votre première consigne. Que faire ?" explain="La fenêtre de contexte est limitée : une nouvelle session sur un sujet précis, avec les bonnes références, vaut mieux qu’un historique qui déborde.">
        <QOpt>Répéter la consigne en majuscules</QOpt>
        <QOpt>Passer au modèle le plus cher</QOpt>
        <QOpt ok>Repartir d’une session propre, avec les bons fichiers joints</QOpt>
      </QuizQ>
      <QuizQ q="Le plan proposé dit « adapter les tests si besoin ». Que faites-vous ?" explain="Les tests d’acceptation sont le contrat : on le corrige dans le plan avant de lancer l’agent. npm run garde le vérifierait de toute façon.">
        <QOpt ok>Je corrige le plan : on ne modifie jamais les tests d’acceptation</QOpt>
        <QOpt>Je lance l’agent : il sait ce qu’il fait</QOpt>
        <QOpt>Je supprime les tests qui gênent</QOpt>
      </QuizQ>
      <QuizQ q="Copilot propose documents[documents.length] pour « le dernier document ». Quelle question de relecture l’aurait détecté ?" explain="Les cas limites : un indice égal à la longueur est toujours hors du tableau ; il fallait length - 1, ou at(-1).">
        <QOpt>Fait-elle ce que j’ai demandé ?</QOpt>
        <QOpt ok>Et les cas limites ?</QOpt>
        <QOpt>Ce qu’elle appelle existe-t-il ?</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M3_Pause: Page = () => <BreakPage mod={3} title="Pause" back="Reprise à 15 h 10 : les fichiers qui guident Copilot sur votre projet." minutes={15} />;

// @@PAGES-BEGIN
export const __pages = [M3_Divider, M3_Anatomie, M3_Contexte, M3_References, M3_Fenetre, M3_Commentaire, M3_Simulateur, M3_PlanSpec, M3_Lire, M3_Lab, M3_Qcm, M3_Pause];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 3 · 13:30

OBJECTIF — Annoncer le module : ce que l’on écrit et ce que l’on montre décident du résultat.

DIRE — « Module 3 : bien parler à Copilot. Deux leviers : ce que vous écrivez, le prompt, et ce que vous lui montrez, le contexte. Et une méthode qui sert tout le Jour 2 : un plan d’abord, l’agent ensuite. »

TRANSITION — « Qu’est-ce qu’un bon prompt ? »`,
  `⏱ 6 min · ANATOMIE D’UN PROMPT

OBJECTIF — Donner les cinq ingrédients d’un prompt, illustrés par celui de l’atelier.

DIRE — « “Fais le module document” : Copilot va deviner. Cinq ingrédients retirent les devinettes. L’objectif, en une phrase. Le contexte : les fichiers, la version, le métier. Les contraintes : ce qui est imposé ou interdit. Les critères : comment on saura que c’est fini. Et le format de la réponse. »

→ beat 1 « Voici le prompt que vous utiliserez à l’atelier, avec ses cinq couleurs. Le vert est le plus souvent oublié, et c’est le plus important : sans critère, l’agent ne sait pas quand s’arrêter. »

ANIMATION — Demander au micro : « Dans vos prompts d’hier, lequel des cinq manquait le plus souvent ? »

TRANSITION — « Le contexte, justement : que lit Copilot ? »`,
  `⏱ 5 min · CE QUE COPILOT VOIT

OBJECTIF — Distinguer le contexte de l’inline et celui du chat.

DIRE — « À gauche, une suggestion inline. Copilot lit le code avant et après le curseur, le commentaire, le nom de la fonction, l’import : ici, il sait que ETATS existe, donc il propose ETATS.includes. Il lit aussi les onglets ouverts à côté, mais pas les fichiers fermés. » → beat 1 « À droite, le Chat : des instructions fixées par l’outil, les instructions de votre dépôt, vos références, tout l’historique de la session, et votre message, souvent la plus petite partie. » → beat 2 « Conséquence pratique : pour l’inline, on soigne le fichier et les onglets ; pour le Chat, les références, et on repart d’une session propre. »

TRANSITION — « Et ce contexte a une taille limite. »`,
  `⏱ 6 min · RÉFÉRENCES DE CONTEXTE

OBJECTIF — Montrer comment joindre exactement ce que Copilot doit lire.

DIRE — « Dans le Chat, tapez dièse, ou le bouton plus. Un fichier : le plus sûr et le moins cher. La sélection. Tout le dépôt avec #codebase : Copilot cherche lui-même, c’est plus large et plus coûteux. Les erreurs de l’éditeur. Vos modifications Git, idéal pour “relis ce que j’ai changé”. Et la dernière commande du terminal, par exemple un test rouge. »

DIRE — « En mode Agent, il cherche aussi tout seul ; vos références lui évitent des tours de boucle. Et sous chaque réponse, la liste Références vous dit ce qu’il a vraiment lu. »

TRANSITION — « Pourquoi ne pas tout joindre ? Parce que la place est limitée. »`,
  `⏱ 5 min · FENÊTRE DE CONTEXTE

OBJECTIF — Faire comprendre la limite de la fenêtre et ses effets sur la qualité.

DIRE — « Le modèle lit un nombre limité de tokens, des morceaux de mots. Instructions, fichier courant, onglets, votre message. » → beat 1 « Ajoutez une longue conversation, et la fenêtre déborde : ce qui sort, c’est souvent le plus ancien, par exemple votre première consigne. Symptômes : il oublie, il mélange. » → beat 2 « Parades : moins mais mieux, en joignant le bon fichier plutôt que tout le projet ; et repartir propre, une session par sujet, ou /compact pour résumer. »

ANIMATION — Pour les curieux : un autre support de la plateforme détaille la fenêtre de contexte.

TRANSITION — « Revenons au code : comment guider une seule fonction ? »`,
  `⏱ 5 min · COMMENTAIRE GUIDE ET JSDOC (exercice oral)

OBJECTIF — Montrer qu’un commentaire précis, puis la JSDoc, oriente la suggestion.

DIRE — « Une fonction : estTitreValide. Avec seulement “vérifie le titre”, Copilot devine. Dites-moi quel ingrédient ajouter : l’entrée, la sortie, la règle, un exemple, une contrainte. »

ANIMATION — Activer les ingrédients au fil des réponses : à 5/5, la suggestion gère le type et les espaces. Rappeler que les suggestions sont illustratives.

DIRE — « Pour une fonction exportée, ces ingrédients vont dans la JSDoc : @param, @returns, @throws. Elle guide Copilot ET documente votre code. À l’atelier, chaque fonction exportée en aura une. »

TRANSITION — « Lire une suggestion, c’est un réflexe : entraînons-le. »`,
  `⏱ 5 min · SIMULATEUR (exercice oral)

OBJECTIF — Entraîner le réflexe : lire, comparer les alternatives, puis seulement accepter.

DIRE — « Trois propositions pour la même fonction. Je les fais défiler avec Alt+crochet. Dites-moi laquelle garder. »

ANIMATION — Faire défiler les 3 propositions, accepter la n° 2 si quelqu’un la choisit (pour montrer le verdict rouge), réinitialiser, puis accepter la n° 1 mot par mot avec Ctrl+→.

TRANSITION — « Comment lire vite et bien ? Cinq questions. »`,
  `⏱ 7 min · DU PLAN À LA SPÉCIFICATION (démo)

OBJECTIF — Montrer le geste central du Jour 2 : relire et corriger un plan avant de lancer l’agent.

DIRE — « Le mode Plan sur le brief de l’atelier. Copilot propose cinq étapes. Relisons ensemble, avec les cinq vérifications de droite. »

→ beat 1 « Étape 3 : la taille avec length, ce sont des caractères. Le brief dit octets : je corrige. “été”, c’est trois caractères et cinq octets. »

→ beat 2 « Étape 5 : “adapter les tests si besoin”. Non : les tests d’acceptation sont le contrat. Je corrige. »

→ beat 3 « Le plan corrigé devient la spécification. On lance l’agent depuis ce plan : il édite, lance les tests, itère ; j’approuve les commandes et je relis le diff. »

ANIMATION — Faire la démo réelle en mode Plan si le temps le permet, sinon commenter la page.

TRANSITION — « Dernier réflexe avant l’atelier : lire avant d’accepter. »`,
  `⏱ 5 min · LIRE AVANT D’ACCEPTER

OBJECTIF — Donner une grille de relecture rapide, et la faire pratiquer sur un exemple.

DIRE — « Cinq questions, dans l’ordre : fait-elle ce que j’ai demandé ? Ce qu’elle appelle existe-t-il ? Et les cas limites ? A-t-elle des effets de bord ? Puis-je l’expliquer ligne à ligne ? À droite, une suggestion acceptée sans lecture. Qui voit un problème ? » → beat 1 « Effet de bord : sort trie le tableau reçu, tout le registre est réordonné. » → beat 2 « Cas limite : l’indice length est toujours hors du tableau. » → beat 3 « La version relue. »

TRANSITION — « À vous : l’Atelier 3. »`,
  `⏱ 35 min · ATELIER 3 (individuel) · 14:15

OBJECTIF — Du brief au code : un plan relu et corrigé, puis l’agent guidé par les tests, avec JSDoc.

DIRE — « Trente-cinq minutes. Lisez le brief et repérez vous-même deux règles faciles à oublier. Puis le mode Plan, avec le prompt en cinq ingrédients : je le colle dans le Chat. Vos deux règles sont-elles dans le plan ? Sinon, corrigez-le. Ensuite l’agent : il lance les tests, vous approuvez, et vous refusez toute modification des tests d’acceptation. Relisez le diff, commit. »

ACTION — Coller dans le Chat le prompt de l’étape 2 du README de l’atelier.

ANIMATION — Points d’étape à 15 min (« Votre plan est relu ? ») et 25 min (« Combien de tests verts ? »). Pièges : taille en caractères (test « été ») ; changerEtat qui modifie le document reçu ; borne >= au lieu de > sur 10 Mo ; l’agent qui veut « simplifier » un test. Agent qui tourne en rond : nouvelle session, un seul test rouge à la fois. Atelier non fini : npm run reprise -- 3 avant l’Atelier 4.

TRANSITION — « QCM du module. »`,
  `⏱ 5 min · QCM MODULE 3 (vote oral)

OBJECTIF — Vérifier les ingrédients du prompt, la fenêtre de contexte, la relecture d’un plan et d’une suggestion.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Pause de quinze minutes. »`,
  `⏱ 15 min · PAUSE · 14:55

DIRE — « Quinze minutes de pause, loin de l’écran. Reprise à 15 h 10 : les fichiers qui apprennent à Copilot les règles de votre projet. »`,
];
// @@NOTES-END
