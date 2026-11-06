// ─── Module 3 · Comprendre les suggestions de Copilot ───────────────────────

const M3_Divider: Page = () => (
  <Section
    n={3}
    title={
      <>
        Comprendre les
        <br />
        suggestions
      </>
    }
    sub="Ce que Copilot lit avant de proposer, et ce que vous lisez avant d’accepter."
    dur="J1 · 12:15 – 12:30 · 14:00 – 14:55"
    labs={<Tag tone="green" size={19}>Atelier 3 · le contexte fait la suggestion</Tag>}
  >
    <SecItem n={1}>Comment Copilot lit le contexte : fichier, commentaires, imports</SecItem>
    <SecItem n={2}>Suggestion inline ou Copilot Chat</SecItem>
    <SecItem n={3}>Accepter, refuser ou choisir parmi plusieurs suggestions</SecItem>
    <SecItem n={4}>Lire et analyser une suggestion avant de l’accepter</SecItem>
    <SecItem n={5}>Les limites de la fenêtre de contexte</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

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
      <CodeDark file="src/tickets.js" size={20}>
        <div style={{ boxShadow: 'inset 4px 0 0 #82AAFF', paddingLeft: 12 }}>
          <Ck>import</Ck> {'{ STATUTS }'} <Ck>from</Ck> <Cs>'./constantes.js'</Cs>;{'\n'}
          <Cc>{'// Vrai si le statut fait partie du flux'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>estStatutValide</Cf>(statut) {'{'}
        </div>
        <div style={{ paddingLeft: 16 }}>
          {'  '}
          <Ck>return</Ck> <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>STATUTS.includes(statut);</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 24, background: '#FFD27A', verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
        <div style={{ boxShadow: 'inset 4px 0 0 #C792EA', paddingLeft: 12 }}>
          {'}'}
          {'\n'}
          <Ck>export function</Ck> <Cf>validerTicket</Cf>(ticket) {'{ … }'}
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
        <M3Seg icon="doc" tone="navy" title="Instructions du dépôt" sub=".github/copilot-instructions.md (Module 8)" beat={1} />
        <M3Seg icon="link" tone="blue" title="Vos références" sub="#file · #selection · #codebase · fichiers glissés" beat={1} />
        <M3Seg icon="loop" tone="yellow" title="L’historique de la conversation" sub="tout ce qui a été dit… erreurs comprises" beat={1} />
        <M3Seg icon="send" tone="violet" title="Votre message" sub="souvent la plus petite partie" beat={1} />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 905, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>
        <strong>Conséquence :</strong> pour l’inline, soignez le fichier et les onglets ; pour le chat, soignez les références et repartez d’une conversation propre.
      </span>
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
        <M3Block w={300} tone="yellow" label="Historique du chat" cls={b.on(1)} />
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
        Un sujet = une conversation (<Kbd>Ctrl+N</Kbd>). Conversation longue : <Ic>/compact</Ic> la résume.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Grands projets : #codebase laisse Copilot chercher les extraits pertinents, au lieu de tout envoyer.
    </Hint>
  </Frame>
);

// ─── Inline ou chat ─────────────────────────────────────────────────────────
const M3Cell = ({ children, head = false, tone = 'grey' }: { children: ReactNode; head?: boolean; tone?: Tone }) => (
  <div style={{ padding: '18px 22px', fontSize: head ? 26 : 24, fontWeight: head ? 800 : 400, fontFamily: head ? display : body, color: head ? T[tone].fg : C.ink, background: head ? T[tone].bg : C.card, lineHeight: 1.35, borderBottom: `1px solid ${C.rule}` }}>
    {children}
  </div>
);

const M3_InlineVsChat: Page = () => (
  <Frame mod={3}>
    <Title>Suggestion inline ou Copilot Chat : quelle différence ?</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: '260px repeat(3, minmax(0, 1fr))', borderRadius: 20, overflow: 'hidden', boxShadow: SHADOW }}>
      <M3Cell head> </M3Cell>
      <M3Cell head tone="blue">
        Suggestion inline
      </M3Cell>
      <M3Cell head tone="violet">
        Chat en ligne · Ctrl+I
      </M3Cell>
      <M3Cell head tone="teal">
        Vue Chat · Ask
      </M3Cell>
      <M3Cell>
        <strong>Déclencheur</strong>
      </M3Cell>
      <M3Cell>Vous tapez, il propose</M3Cell>
      <M3Cell>Vous sélectionnez et décrivez</M3Cell>
      <M3Cell>Vous posez une question</M3Cell>
      <M3Cell>
        <strong>Contexte</strong>
      </M3Cell>
      <M3Cell>Autour du curseur, onglets ouverts</M3Cell>
      <M3Cell>La sélection, le fichier</M3Cell>
      <M3Cell>Vos références, l’historique</M3Cell>
      <M3Cell>
        <strong>Résultat</strong>
      </M3Cell>
      <M3Cell>Quelques lignes en texte grisé</M3Cell>
      <M3Cell>Un diff à accepter ou rejeter</M3Cell>
      <M3Cell>Une explication, du code à copier</M3Cell>
      <M3Cell>
        <strong>Idéal pour</strong>
      </M3Cell>
      <M3Cell>Écrire vite ce que vous savez déjà</M3Cell>
      <M3Cell>Retoucher une fonction précise</M3Cell>
      <M3Cell>Comprendre, comparer, apprendre</M3Cell>
      <M3Cell>
        <strong>Coût</strong>
      </M3Cell>
      <M3Cell>Hors crédits IA</M3Cell>
      <M3Cell>Crédits IA</M3Cell>
      <M3Cell>Crédits IA</M3Cell>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="bulb" title="Règle simple" size={25} cls={A.in} style={dl(500)}>
        Vous savez ce que vous voulez écrire : inline. Vous savez quoi changer : Ctrl+I. Vous ne savez pas encore : Ask.
      </Callout>
    </div>
  </Frame>
);

// ─── Exercice : le bon outil ────────────────────────────────────────────────
const M3Zone = ({ x, icon, tone, title, sub, answer }: { x: number; icon: IconName; tone: Tone; title: string; sub: string; answer: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: 262, width: 540, height: 480, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: T[tone].fg }}>{title}</div>
        <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 24, right: 24, bottom: 18, fontSize: 19, lineHeight: 1.45, color: T[tone].fg }}>
      <strong>Corrigé · </strong>
      {answer}
    </div>
  </div>
);

const M3_ChoisirOutil: Page = () => (
  <Frame mod={3} kind="exercice" beats={1}>
    <Title>À vous : quel outil pour quelle situation ?</Title>
    <Lede>Dites-moi au micro dans quelle colonne va chaque étiquette : je la déplace. Double-clic pour la renvoyer.</Lede>
    <M3Zone x={120} icon="code" tone="blue" title="Inline" sub="texte grisé, Tab, NES" answer="boucle évidente, tableau de constantes, renommage propagé." />
    <M3Zone x={690} icon="pointer" tone="violet" title="Ctrl+I" sub="modifier la sélection" answer="gestion d’erreur ajoutée, JSDoc de la fonction sélectionnée." />
    <M3Zone x={1260} icon="chat" tone="teal" title="Ask" sub="comprendre, comparer" answer="regex héritée, deux approches, message d’erreur du terminal." />
    <Drag x={120} y={780} w={405} tone="grey">Finir une boucle évidente</Drag>
    <Drag x={545} y={780} w={405} tone="grey">Comprendre une regex héritée</Drag>
    <Drag x={970} y={780} w={405} tone="grey">Ajouter la gestion d’erreur ici</Drag>
    <Drag x={1395} y={780} w={405} tone="grey">Écrire un tableau de constantes</Drag>
    <Drag x={120} y={860} w={405} tone="grey">Choisir entre deux approches</Drag>
    <Drag x={545} y={860} w={405} tone="grey">Propager un renommage</Drag>
    <Drag x={970} y={860} w={405} tone="grey">Expliquer une erreur du terminal</Drag>
    <Drag x={1395} y={860} w={405} tone="grey">Documenter la fonction choisie</Drag>
  </Frame>
);

// ─── Simulateur : accepter, refuser, choisir ────────────────────────────────
const M3_ALTS = [
  {
    code: 'return tickets.filter((t) => t.statut === "termine").reduce((s, t) => s + t.points, 0);',
    ok: true,
    verdict: 'Correcte : filtre les terminés, valeur initiale 0 (liste vide → 0).',
  },
  {
    code: 'return tickets.reduce((s, t) => s + t.points);',
    ok: false,
    verdict: 'Fausse : oublie le filtre « termine » et la valeur initiale (liste vide → erreur).',
  },
  {
    code: 'let total = 0; for (const t of tickets) if (t.statut === "termine") total += t.points; return total;',
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
      <CodeDark file="src/backlog.js" size={22} wrap>
        <Cc>{'// Somme des points des tickets terminés'}</Cc>
        {'\n'}
        <Ck>function</Ck> <Cf>pointsTermines</Cf>(tickets) {'{'}
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
        <Cc>{'// Renvoie le dernier ticket créé'}</Cc>
        {'\n'}
        <Ck>function</Ck> <Cf>dernierTicket</Cf>(tickets) {'{'}
        {'\n  '}tickets.<span style={{ background: 'rgba(242,139,130,.25)' }}>sort</span>((a, b) =&gt; a.creeLe.<span style={{ background: 'rgba(242,139,130,.25)' }}>localeCompare</span>(b.creeLe));
        {'\n  '}
        <Ck>return</Ck> tickets[<span style={{ background: 'rgba(242,139,130,.25)' }}>tickets.length</span>];{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className={b.on(1)}>
          <Callout tone="coral" icon="bug" title="Question 4 · effet de bord" size={21}>
            <Ic>sort</Ic> trie le tableau reçu sur place : tout le backlog est réordonné.
          </Callout>
        </div>
        <div className={b.on(2)}>
          <Callout tone="coral" icon="bug" title="Question 3 · cas limite" size={21}>
            <Ic>tickets[tickets.length]</Ic> vaut toujours <Ic>undefined</Ic> : il fallait <Ic>length - 1</Ic>.
          </Callout>
        </div>
        <div className={b.on(3)}>
          <Callout tone="green" icon="check" title="Version relue" size={21}>
            <Ic>{'tickets.toSorted(…).at(-1)'}</Ic>, ou un simple <Ic>reduce</Ic> qui garde le plus récent.
          </Callout>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Déjeuner ───────────────────────────────────────────────────────────────
const M3_Dejeuner: Page = () => <BreakPage mod={3} title="Bon appétit !" back="Reprise à 14 h 00 : quel outil choisir, puis l’Atelier 3." minutes={90} icon="smile" />;

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M3_Lab: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Le contexte fait la suggestion"
    defi="contexte"
    who="Individuel · 35 min"
    objective={
      <>
        Prouver par l’expérience que la suggestion dépend de ce que Copilot <strong>voit</strong> (nom seul, onglet voisin, commentaire précis, import), puis trouver <strong>en lisant</strong> trois défauts de code accepté trop vite.
      </>
    }
    where={
      <>
        <PathChip size={19}>katas/03-contexte/</PathChip>
        <br />
        Grille « Atelier 3 » de <PathChip size={19}>JOURNAL.md</PathChip>
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="l3a" size={21}>Les 4 expériences notées dans le journal</CheckItem>
        <CheckItem id="l3b" size={21}>L’expérience 2 affiche 21.7</CheckItem>
        <CheckItem id="l3c" size={21}>Les 3 défauts trouvés avant d’exécuter</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (« Exp. 1 et 2 : quelle différence ? ») et à 30 min."
  >
    <WStep n={1}>
      <strong>Nom seul</strong>, puis <strong>avec un onglet voisin et une JSDoc</strong> : comparez les deux suggestions de <Ic>calculerVelocite</Ic>.
    </WStep>
    <WStep n={2}>Commentaire vague contre précis, puis l’effet d’un import ; parcourez les alternatives.</WStep>
    <WStep n={3}>Expérience 4 : trouvez les 3 défauts en lisant, puis exécutez et comparez avec l’avis du chat.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <Frame mod={3} kind="qcm">
    <Title>QCM · Module 3 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pour qu’une suggestion inline utilise votre fichier de données d’exemple, il faut…" explain="L’inline lit le fichier courant et les onglets ouverts. Un fichier fermé n’est pas dans son contexte.">
        <QOpt>Qu’il soit dans le même dossier</QOpt>
        <QOpt>Qu’il soit ouvert dans un onglet</QOpt>
        <QOpt ok>Le mentionner dans le chat</QOpt>
      </QuizQ>
      <QuizQ q="Au bout d’une heure de conversation, Copilot oublie votre première consigne. Que faire ?" explain="La fenêtre de contexte est pleine ou diluée. Nouvelle conversation avec la consigne et les seuls fichiers utiles, ou /compact.">
        <QOpt ok>Répéter la consigne en majuscules</QOpt>
        <QOpt>Changer de modèle</QOpt>
        <QOpt>Repartir d’une nouvelle conversation avec le contexte utile</QOpt>
      </QuizQ>
      <QuizQ q="Copilot propose tickets[tickets.length] pour « le dernier élément ». Quelle question de relecture l’aurait détecté ?" explain="Les cas limites : l’indice length est toujours hors du tableau. Tester mentalement avec [1, 2, 3] suffit.">
        <QOpt>Ce qu’elle appelle existe-t-il ?</QOpt>
        <QOpt ok>Et les cas limites ?</QOpt>
        <QOpt>A-t-elle des effets de bord ?</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez seulement comprendre une regex héritée, sans risque de la modifier. Quel outil ?" explain="Ask explique sans toucher au fichier. Ctrl+I propose une modification ; l’inline complète ce que vous tapez.">
        <QOpt>La vue Chat, agent Ask</QOpt>
        <QOpt>Le chat en ligne, Ctrl+I</QOpt>
        <QOpt ok>Une suggestion inline sous la regex</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Divider, M3_Contexte, M3_Fenetre, M3_InlineVsChat, M3_Dejeuner, M3_ChoisirOutil, M3_Simulateur, M3_Lire, M3_Lab, M3_Qcm];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 3 · 12:15

OBJECTIF — Annoncer le cœur du Jour 1 : comprendre ce que Copilot voit, et apprendre à lire.

DIRE — « Module 3 : comprendre les suggestions. Pourquoi Copilot propose parfois exactement ce qu’il faut, et parfois n’importe quoi ? La réponse tient en un mot : le contexte. Et la parade tient en un geste : lire avant d’accepter. »

TRANSITION — « Qu’est-ce que Copilot lit, exactement ? »`,
  `⏱ 5 min · CE QUE COPILOT VOIT

OBJECTIF — Distinguer le contexte de l’inline et celui du chat.

DIRE — « À gauche, une suggestion inline. Copilot lit le code avant et après le curseur, le commentaire, le nom de la fonction, l’import : ici, il sait que STATUTS existe, donc il propose STATUTS.includes. Il lit aussi les onglets ouverts à côté, mais pas les fichiers fermés. » → beat 1 « À droite, le chat : des instructions fixées par l’outil, les instructions de votre dépôt, vos références, tout l’historique de la conversation, et votre message, souvent la plus petite partie. » → beat 2 « Conséquence pratique : pour l’inline, on soigne le fichier et les onglets ; pour le chat, les références, et on repart d’une conversation propre. »

TRANSITION — « Et ce contexte a une taille limite. »`,
  `⏱ 5 min · FENÊTRE DE CONTEXTE

OBJECTIF — Faire comprendre la limite de la fenêtre et ses effets sur la qualité.

DIRE — « Le modèle lit un nombre limité de tokens, des morceaux de mots. Instructions, fichier courant, onglets, votre message. » → beat 1 « Ajoutez une longue conversation, et la fenêtre déborde : ce qui sort, c’est souvent le plus ancien, par exemple votre première consigne. Symptômes : il oublie, il mélange. » → beat 2 « Parades : moins mais mieux, en joignant le bon fichier plutôt que tout le projet ; et repartir propre, une conversation par sujet, ou /compact pour résumer. »

ANIMATION — Pour les curieux : un autre support de la plateforme détaille la fenêtre de contexte.

TRANSITION — « Inline, chat en ligne, vue Chat : comparons-les. »`,
  `⏱ 3 min · INLINE OU CHAT

OBJECTIF — Fixer la différence et la règle de choix.

DIRE — « Le tableau se lit en colonnes. L’inline se déclenche quand vous tapez, regarde autour du curseur et propose quelques lignes ; il ne consomme pas de crédits. Ctrl+I part de votre sélection et propose un diff. La vue Chat répond à une question, avec vos références. La règle : vous savez ce que vous voulez écrire, inline ; vous savez quoi changer, Ctrl+I ; vous ne savez pas encore, Ask. »

TRANSITION — « Bon appétit ! À 14 h, on vérifie tout ça avec un exercice. »`,
  `⏱ 90 min · DÉJEUNER · 12:30

DIRE — « Bon appétit ! Reprise à 14 h 00 précises : un exercice, puis l’Atelier 3. Laissez VS Code ouvert sur le dépôt. »`,
  `⏱ 5 min · QUEL OUTIL ? (exercice oral)

OBJECTIF — Appliquer la règle de choix sur 8 situations.

DIRE — « Huit étiquettes, trois colonnes. Dites-moi où va chacune, je la déplace. » Puis → beat 1 pour afficher le corrigé.

ANIMATION — Appeler les participants par prénom, une étiquette chacun. Accepter les variantes argumentées : « documenter la fonction » peut aussi se faire en Ask.

TRANSITION — « Entraînons maintenant le geste de base. »`,
  `⏱ 5 min · SIMULATEUR (exercice oral)

OBJECTIF — Entraîner le réflexe : lire, comparer les alternatives, puis seulement accepter.

DIRE — « Trois propositions pour la même fonction. Je les fais défiler avec Alt+crochet. Dites-moi laquelle garder. »

ANIMATION — Faire défiler les 3 propositions, accepter la n° 2 si quelqu’un la choisit (pour montrer le verdict rouge), réinitialiser, puis accepter la n° 1 mot par mot avec Ctrl+→.

TRANSITION — « Comment lire vite et bien ? Cinq questions. »`,
  `⏱ 5 min · LIRE AVANT D’ACCEPTER

OBJECTIF — Donner une grille de relecture rapide, et la faire pratiquer sur un exemple.

DIRE — « Cinq questions, dans l’ordre : fait-elle ce que j’ai demandé ? Ce qu’elle appelle existe-t-il ? Et les cas limites ? A-t-elle des effets de bord ? Puis-je l’expliquer ligne à ligne ? À droite, une suggestion acceptée sans lecture. Qui voit un problème ? » → beat 1 « Effet de bord : sort trie le tableau reçu. » → beat 2 « Cas limite : l’indice length est toujours hors du tableau. » → beat 3 « La version relue. »

TRANSITION — « À vous : l’Atelier 3. »`,
  `⏱ 35 min · ATELIER 3 (individuel) · 14:15

OBJECTIF — Vérifier par l’expérience l’effet du contexte, et pratiquer la lecture critique.

DIRE — « Re-bonjour ! Trente-cinq minutes, énoncé dans ateliers/atelier-03-contexte. Quatre expériences : nom seul, onglet voisin et JSDoc, commentaire vague ou précis, et lire avant d’accepter. Notez vos observations dans la grille du journal : c’est ce que nous partagerons à la fin. »

ANIMATION — Points d’étape à 15 min (« Expériences 1 et 2 : quelle différence avez-vous vue ? ») et 30 min. Faire partager 2 observations au micro à la fin.

TRANSITION — « QCM rapide, puis on génère du vrai code. »`,
  `⏱ 5 min · QCM MODULE 3 (vote oral)

OBJECTIF — Vérifier contexte, fenêtre et grille de lecture.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Module 4 : générer du code simple, et le premier morceau de TaskFlow. »`,
];
// @@NOTES-END
