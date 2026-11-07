// ─── Module 6 · Agents, skills et refactoring ───────────────────────────────
const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Agents, skills
        <br />
        et refactoring
      </>
    }
    sub="Rendre lisible un code de 2019 sans changer ce qu’il fait, avec un agent et une méthode écrits par vous."
    dur="J2 · 10:50 – 12:30"
    labs={<Tag tone="green" size={19}>Atelier 6 · l’agent Refactoreur et sa skill</Tag>}
  >
    <SecItem n={1}>Repérer le code à refactoriser et formuler la demande</SecItem>
    <SecItem n={2}>Renommer, extraire, simplifier ; comparer avant et après</SecItem>
    <SecItem n={3}>Un agent personnalisé : le fichier .agent.md</SecItem>
    <SecItem n={4}>Une skill : la méthode, chargée quand elle sert</SecItem>
    <SecItem n={5}>Sous-agents, et les garde-fous de l’autonomie</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── Les odeurs ─────────────────────────────────────────────────────────────
const M6Smell = ({ icon, title, ex, children, d }: { icon: IconName; title: string; ex: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', borderTop: `6px solid ${C.violet}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone="violet" size={48} />
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 12, fontFamily: mono, fontSize: 19, color: T.violet.fg, background: T.violet.bg, borderRadius: 8, padding: '6px 10px' }}>{ex}</div>
    <div style={{ marginTop: 10, fontSize: 21, color: C.soft, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const M6_Odeurs: Page = () => (
  <Frame mod={6}>
    <Title>Identifier le code à refactoriser : six « odeurs »</Title>
    <Lede>Le code marche, mais on a peur d’y toucher. Tous ces exemples viennent des relances de Parafo, écrites en 2019.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <M6Smell icon="eyeOff" title="Noms obscurs" ex="calc(d, n, f, t)" d={100}>
        Il faut lire tout le corps pour deviner le rôle.
      </M6Smell>
      <M6Smell icon="layers" title="Imbrication" ex="while { if { if" d={180}>
        Chaque niveau ajoute un cas à garder en tête.
      </M6Smell>
      <M6Smell icon="gauge" title="Nombres magiques" ex="86400000 · c % 3" d={260}>
        Un jour en millisecondes ? Une constante nommée le dirait.
      </M6Smell>
      <M6Smell icon="route" title="Paramètre aiguillage" ex="t == 'r' ? … : 'e'" d={340}>
        Un paramètre qui fait de la fonction deux fonctions en une.
      </M6Smell>
      <M6Smell icon="alert" title="Effets de bord" ex="f.sort();" d={420}>
        La fonction trie la liste que l’appelant lui passe.
      </M6Smell>
      <M6Smell icon="clock" title="Syntaxe datée" ex="var · == · substring" d={500}>
        Des pièges connus que le JavaScript moderne évite.
      </M6Smell>
    </div>
  </Frame>
);

// ─── Le legacy de Parafo ────────────────────────────────────────────────────
const M6_Legacy: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Cas pratique : les relances de Parafo, écrites en 2019</Title>
    <Lede>« Ça marche, ne touchez à rien. » Combien d’odeurs voyez-vous ? Dites-les : je clique les pastilles.</Lede>
    <CodeDark file="src/legacy/relances-2019.js (extrait)" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <Ck>var</Ck> FERIES = [<Cs>'2019-01-01'</Cs>, <Cs>'2019-04-22'</Cs>, <Cc>{'/* … */'}</Cc>];{'\n'}
      <Ck>function</Ck> <Cf>ok</Cf>(x, f) {'{'}
      {'\n  '}
      <Ck>var</Ck> j = x.getUTCDay();{'\n  '}
      <Ck>if</Ck> (j == <Cn>0</Cn> || j == <Cn>6</Cn>) <Ck>return false</Ck>;{'\n  '}
      <Ck>for</Ck> (<Ck>var</Ck> i = <Cn>0</Cn>; i &lt; f.length; i++) <Ck>if</Ck> (f[i] == d2s(x)) <Ck>return false</Ck>;{'\n  '}
      <Ck>return true</Ck>;{'\n}\n'}
      <Ck>export function</Ck> <Cf>calc</Cf>(d, n, f, t) {'{'}
      {'\n  '}
      <Ck>if</Ck> (!f) f = FERIES;{'\n  '}
      f.sort();{'\n  '}
      <Ck>var</Ck> x = <Ck>new</Ck> Date(d + <Cs>'T00:00:00Z'</Cs>), r = [], c = <Cn>0</Cn>;{'\n  '}
      <Ck>if</Ck> (ok(x, f)) c = <Cn>1</Cn>;{'\n  '}
      <Ck>while</Ck> (c &lt; n) {'{'}
      {'\n    '}x = <Ck>new</Ck> Date(x.getTime() + <Cn>86400000</Cn>);{'\n    '}
      <Ck>if</Ck> (ok(x, f)) {'{ '}c++; <Ck>if</Ck> (t == <Cs>'r'</Cs> &amp;&amp; c % <Cn>3</Cn> == <Cn>0</Cn> &amp;&amp; c &lt; n) r.push(d2s(x)); {'}'}
      {'\n  }\n  '}
      <Ck>return</Ck> t == <Cs>'e'</Cs> ? d2s(x) : t == <Cs>'r'</Cs> ? r : <Ck>null</Ck>;{'\n}'}
    </CodeDark>
    <Hotspot n={1} x={590} y={547} title="Noms d’une lettre" w={420}>
      d, n, f, t, x, c, r : il faut lire tout le corps pour deviner.
    </Hotspot>
    <Hotspot n={2} x={800} y={341} title="Fériés de 2019 en dur" w={420} side="left">
      Sans liste fournie, le 1er mai 2026 compte comme un jour ouvré.
    </Hotspot>
    <Hotspot n={3} x={985} y={462} title="Comparaison large ==" w={420} side="left">
      Un délai « 5 » en texte marche. Le changer est un changement de comportement !
    </Hotspot>
    <Hotspot n={4} x={445} y={612} title="Effet de bord" w={420}>
      f.sort() trie la liste de fériés de l’appelant.
    </Hotspot>
    <Hotspot n={5} x={445} y={670} title="Le bug" w={460}>
      Le jour d’envoi compte comme premier jour ouvré : l’expiration tombe un jour trop tôt.
    </Hotspot>
    <Hotspot n={6} x={1170} y={753} title="Nombres magiques, aiguillage" w={440} side="left">
      86400000, 3, et t qui fait de calc deux fonctions en une.
    </Hotspot>
    <div className={A.right} style={{ position: 'absolute', left: 1290, top: 262, width: 510, ...dl(300) }}>
      <Card icon="flask" tone="green" title="Le filet de sécurité" size={22} pad={24}>
        10 tests de caractérisation, déjà verts, défauts compris : les tests marqués ⚠ figent le bug et les bizarreries.
        <div style={{ marginTop: 14 }}>
          <Ic>npm run test:atelier6</Ic>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Formuler la demande ────────────────────────────────────────────────────
const M6Ing = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '170px minmax(0, 1fr)', gap: 14, alignItems: 'baseline' }}>
    <Tag tone={tone} size={19}>
      {label}
    </Tag>
    <span style={{ fontSize: 22, color: C.ink, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const M6_Formuler: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Formuler la demande : « améliore ce code » ne suffit pas</Title>
    <Lede>Une demande vague mélange tout : renommage, réécriture, correction de bug. Et le comportement change en silence.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 640 }}>
      <PanelTitle icon="x" c={C.coral}>
        La demande vague
      </PanelTitle>
      <div style={{ background: T.coral.bg, borderRadius: 16, padding: '22px 26px', fontSize: 26, lineHeight: 1.45 }}>
        <Pr>« Améliore ce code. »</Pr>
        <div style={{ marginTop: 16, fontSize: 21, color: C.soft }}>Résultat typique : 40 lignes réécrites, le jour d’envoi « corrigé » au passage, == devenu ===. Trois tests de caractérisation au rouge.</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 820, top: 280, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="check" c={C.green}>
        La demande en 4 ingrédients
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M6Ing tone="blue" label="Quoi">
          Remplace var par const/let et extrais estOuvre et lendemain.
        </M6Ing>
        <M6Ing tone="teal" label="Périmètre">
          Uniquement src/legacy/relances-2019.js, rien d’autre.
        </M6Ing>
        <M6Ing tone="violet" label="Contrainte">
          Exactement le même comportement : garde ==, le tri des fériés, le délai en texte.
        </M6Ing>
        <M6Ing tone="green" label="Vérification">
          Les 10 tests de caractérisation restent verts.
        </M6Ing>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="blue" icon="target" title="Petits pas" size={24} cls={b.on(1)}>
        Une transformation par demande, un test après chaque demande. Ces quatre ingrédients, vous les écrirez une fois pour toutes dans une skill.
      </Callout>
    </div>
  </Frame>
);

// ─── Les trois gestes ───────────────────────────────────────────────────────
const M6Geste = ({ tone, title, how, before, after, d }: { tone: Tone; title: string; how: ReactNode; before: string; after: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 20, color: C.soft, lineHeight: 1.4, minHeight: 56 }}>{how}</div>
    <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.coral.bg, color: T.coral.fg, borderRadius: 10, padding: '10px 14px' }}>{before}</div>
    <div style={{ textAlign: 'center', fontSize: 24, color: C.faint, margin: '4px 0' }}>↓</div>
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.green.bg, color: T.green.fg, borderRadius: 10, padding: '10px 14px' }}>{after}</div>
  </div>
);

const M6_Gestes: Page = () => (
  <Frame mod={6} kind="demo">
    <Title>Simplifier, renommer, extraire : trois gestes de base</Title>
    <Lede>Copilot et l’agent les accélèrent ; VS Code les sécurise. Combinez les deux.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M6Geste
        tone="blue"
        title="Renommer"
        how={
          <>
            <Kbd>F2</Kbd> sur le nom : VS Code renomme partout ; Copilot propose des noms, NES suit.
          </>
        }
        before={'function calc(d, n, f, t) {\n  var x = new Date(…);'}
        after={'function calc(dateEnvoi, delai,\n  feries, type) {\n  let date = new Date(…);'}
        d={100}
      />
      <M6Geste
        tone="violet"
        title="Extraire"
        how={
          <>
            Sélection › <Kbd>Ctrl+.</Kbd> « Extraire dans une fonction », ou <Kbd>Ctrl+I</Kbd> en la nommant.
          </>
        }
        before={'var j = x.getUTCDay();\nif (j == 0 || j == 6)\n  return false;'}
        after={'if (estWeekEnd(date))\n  return false;'}
        d={220}
      />
      <M6Geste
        tone="teal"
        title="Simplifier"
        how={<>Retours anticipés, constantes nommées, conditions regroupées.</>}
        before={'x = new Date(x.getTime()\n  + 86400000);'}
        after={'date = lendemain(date);'}
        d={340}
      />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Simplifier une condition avec === au lieu de == change le comportement : vérifiez les tests à chaque pas.
    </Hint>
  </Frame>
);

// ─── Comparer avant / après ─────────────────────────────────────────────────
const M6_Comparer: Page = () => (
  <Frame mod={6}>
    <Title>Comparer avant et après pour valider la transformation</Title>
    <Lede>Trois outils, du plus automatique au plus humain. Les trois, à chaque étape.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="flask" tone="green" title="1 · Les tests de caractérisation" size={22} pad={26} cls={A.in} style={dl(100)}>
        Ils photographient ce que le code fait <em>aujourd’hui</em>, bugs compris. Verts avant, verts après.
      </Card>
      <Card icon="git" tone="blue" title="2 · Le diff Git" size={22} pad={26} cls={A.in} style={dl(220)}>
        Vue Contrôle de code source ou <Ic>git diff</Ic> : chaque ligne changée doit être un renommage, une extraction ou une simplification.
      </Card>
      <Card icon="eye" tone="violet" title="3 · La relecture" size={22} pad={26} cls={A.in} style={dl(340)}>
        Vous devez pouvoir expliquer chaque changement. Sinon : Ask « pourquoi ce changement ? », ou on annule.
      </Card>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(500) }}>
      <PanelTitle icon="flag" c={C.coral}>
        Refactoring ≠ correction de bug
      </PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
        <div style={{ fontSize: 23, color: C.ink, lineHeight: 1.45 }}>
          <Ic>refactor : relances 2019 lisibles</Ic>
          <br />
          même comportement, tests inchangés
        </div>
        <div style={{ fontSize: 23, color: C.ink, lineHeight: 1.45 }}>
          <Ic>fix : expiration sans le jour d’envoi</Ic>
          <br />
          comportement changé, prouvé par les tests de contrat
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Anatomie d’un agent ────────────────────────────────────────────────────
type AnaField = 'name' | 'desc' | 'tools' | 'skills' | 'model' | 'body';
const ANA_LINES: { f: AnaField; node: ReactNode }[] = [
  { f: 'name', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'name', node: <><Ck>name</Ck>: Refactoreur</> },
  { f: 'desc', node: <><Ck>description</Ck>: Refactore par petits pas sûrs,</> },
  { f: 'desc', node: <>{'  '}sans changer le comportement. Code hérité.</> },
  { f: 'tools', node: <><Ck>tools</Ck>: [<Cs>'read'</Cs>, <Cs>'search'</Cs>, <Cs>'edit'</Cs>, <Cs>'execute'</Cs>]</> },
  { f: 'skills', node: <><Ck>skills</Ck>: [<Cs>'refactoring-sur'</Cs>]</> },
  { f: 'model', node: <span style={{ color: '#7C86A8' }}># model : facultatif</span> },
  { f: 'body', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'body', node: <>Tu es le Refactoreur de Parafo.</> },
  { f: 'body', node: <>- Lance les tests avant et après chaque geste.</> },
  { f: 'body', node: <>- Un seul geste à la fois ; test rouge : annule.</> },
  { f: 'body', node: <>- Aucune correction de bug pendant un refactoring.</> },
  { f: 'body', node: <>- Ne modifie jamais test/acceptance/.</> },
];
const ANA_INFO: Record<AnaField, { t: string; tone: Tone; icon: IconName; text: ReactNode; tip: string }> = {
  name: { t: 'name · le nom', tone: 'navy', icon: 'user', text: 'Le nom affiché dans la liste des agents du Chat. Sans lui, le nom du fichier.', tip: 'Court et unique : « Refactoreur », pas « Agent 2 ».' },
  desc: { t: 'description · quand l’utiliser', tone: 'blue', icon: 'note', text: 'Obligatoire pour le harnais Copilot. Elle dit ce que fait l’agent et quand le choisir.', tip: 'Dites aussi ce qu’il ne fait jamais.' },
  tools: { t: 'tools · ce qu’il a le droit de faire', tone: 'coral', icon: 'tool', text: 'La liste des outils : sans « edit », il ne peut pas modifier de fichier ; sans « execute », pas de terminal. Cliquez les outils pour voir le risque.', tip: 'Le minimum nécessaire, jamais « * » par confort.' },
  skills: { t: 'skills · ses savoir-faire', tone: 'violet', icon: 'book', text: 'Les skills chargées dans son contexte : ici la méthode de refactoring, écrite une fois, réutilisable par d’autres agents.', tip: 'Une skill = un dossier .github/skills/<nom>/.' },
  model: { t: 'model · facultatif', tone: 'green', icon: 'cpu', text: 'Un modèle, ou une liste par ordre de préférence. Sans ce champ : le modèle choisi dans le sélecteur.', tip: 'Les champs handoffs et agents des anciens tutoriels sont ignorés par le harnais Copilot.' },
  body: { t: 'Le corps · son rôle et ses règles', tone: 'pink', icon: 'chat', text: 'Les consignes en Markdown, ajoutées à chaque demande faite à cet agent : sa mission, sa méthode, ses interdits.', tip: 'Des règles vérifiables, pas des vœux pieux.' },
};
const ANA_ORDER: AnaField[] = ['name', 'desc', 'tools', 'skills', 'model', 'body'];
const TOOLS9 = [
  { id: 'read', what: 'lire les fichiers', risk: 1 },
  { id: 'search', what: 'chercher dans le code', risk: 1 },
  { id: 'todo', what: 'tenir une liste de tâches', risk: 0 },
  { id: 'edit', what: 'créer et modifier des fichiers', risk: 2 },
  { id: 'agent', what: 'déléguer à d’autres agents', risk: 2 },
  { id: 'execute', what: 'lancer des commandes (terminal)', risk: 3 },
  { id: 'web', what: 'lire des pages Internet', risk: 3 },
];

const M6_Anatomie: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<AnaField | null>(null);
  const [tools, setTools] = useState<string[]>(['read', 'search', 'edit', 'execute']);
  useEffect(() => setPick(null), [beats]);
  const sel = pick ?? ANA_ORDER[Math.min(beats, 5)];
  const info = ANA_INFO[sel];
  const risk = TOOLS9.filter((t) => tools.includes(t.id)).reduce((a, t) => a + t.risk, 0);
  const lvl = risk <= 3 ? { t: 'faible', tone: 'green' as Tone } : risk <= 7 ? { t: 'modéré', tone: 'yellow' as Tone } : { t: 'élevé', tone: 'coral' as Tone };
  const injection = tools.includes('execute') && tools.includes('web');
  return (
    <Frame mod={6} beats={5}>
      <Title>Un agent personnalisé, c’est un fichier .agent.md</Title>
      <Lede>Un rôle, des outils et des savoir-faire, écrits une fois et versionnés. Créez-le dans Customizations › Agents, ou à la main.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '16px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px 10px', fontFamily: mono, fontSize: 18, color: '#9AA6C8' }}>
          <Icon name="doc" size={22} color="#9AA6C8" /> .github/agents/refactoreur.agent.md
        </div>
        {ANA_LINES.map((l, i) => {
          const on = l.f === sel;
          return (
            <div
              key={i}
              role="button"
              data-osd-interactive
              className={k('row')}
              onClick={() => setPick(l.f)}
              style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', fontFamily: mono, fontSize: 21, lineHeight: '33px', color: on ? '#fff' : '#C9D2EA', background: on ? 'rgba(116,66,224,.32)' : 'transparent', boxShadow: on ? `inset 5px 0 0 ${STRONG[ANA_INFO[l.f].tone]}` : 'none', whiteSpace: 'pre' }}
            >
              <span style={{ textAlign: 'right', paddingRight: 14, color: '#56607E' }}>{i + 1}</span>
              <span>{l.node}</span>
            </div>
          );
        })}
      </div>
      <div key={sel} className={k('swap')} style={{ position: 'absolute', left: 1070, top: 270, width: 730, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[info.tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={info.icon} tone={info.tone} size={56} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{info.t}</span>
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{info.text}</div>
        {sel === 'tools' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {TOOLS9.map((t) => {
                const on = tools.includes(t.id);
                const tone: Tone = t.risk >= 3 ? 'coral' : t.risk === 2 ? 'yellow' : 'green';
                return (
                  <div
                    key={t.id}
                    role="button"
                    data-osd-interactive
                    className={k('chip')}
                    onClick={() => setTools((o) => (o.includes(t.id) ? o.filter((x) => x !== t.id) : [...o, t.id]))}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, background: on ? T[tone].bg : C.panel, boxShadow: on ? `inset 0 0 0 2px ${STRONG[tone]}` : 'none', opacity: on ? 1 : 0.6 }}
                  >
                    <Icon name={on ? 'checkCircle' : 'x'} size={22} color={on ? STRONG[tone] : C.faint} sw={2.4} />
                    <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{t.id}</span>
                    <span style={{ fontSize: 17, color: C.soft, lineHeight: 1.2 }}>{t.what}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.soft }}>
              Pouvoir donné :
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (risk / 12) * 100)}%`, height: '100%', background: STRONG[lvl.tone], transition: `width 400ms ${EASE}` }} />
              </div>
              <Tag tone={lvl.tone} size={18}>
                {lvl.t}
              </Tag>
            </div>
            {injection ? <div style={{ fontSize: 19, color: T.coral.fg, fontWeight: 600 }}>⚠ Terminal + Internet : une page piégée peut lui dicter une commande (injection de prompt).</div> : null}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T[info.tone].bg, color: T[info.tone].fg, borderRadius: 14, padding: '14px 18px', fontSize: 21, fontWeight: 600 }}>
            <Icon name="bulb" size={26} sw={2.2} /> {info.tip}
          </div>
        )}
      </div>
    </Frame>
  );
};

// ─── Skills ─────────────────────────────────────────────────────────────────
type SkLvl = 1 | 2 | 3;
const SKILLS9 = [
  { id: 'refactoring-sur', desc: 'Refactoring sûr du code hérité, sous tests de caractérisation.', res: 'gestes.md' as string | null },
  { id: 'tests-node', desc: 'Écrire et vérifier des tests node:test pour Parafo.', res: 'modele.test.js' },
  { id: 'note-de-version', desc: 'Rédiger la note de version d’une livraison.', res: 'gabarit.md' },
];
const SK_REQ: { q: string; lv: SkLvl[] }[] = [
  { q: 'Refactore relances-2019.js sans changer son comportement', lv: [3, 1, 1] },
  { q: 'Ajoute des tests pour journal.js', lv: [1, 3, 1] },
  { q: 'Renomme la variable x en date', lv: [1, 1, 1] },
  { q: '/note-de-version 2.1', lv: [1, 1, 3] },
];
const SK_TOK = (lv: SkLvl) => (lv === 1 ? 0.1 : lv === 2 ? 1.5 : 2.4);

const M6_Skills: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const ri = pick ?? Math.min(Math.max(beats - 1, 0), 3);
  const req = SK_REQ[ri];
  const tok = req.lv.reduce((a, l) => a + SK_TOK(l), 0);
  const LV: Record<SkLvl, { t: string; tone: Tone }> = { 1: { t: 'nom + description', tone: 'grey' }, 2: { t: '+ instructions', tone: 'blue' }, 3: { t: '+ fichiers', tone: 'violet' } };
  return (
    <Frame mod={6} beats={4}>
      <Title>Une Skill : un savoir-faire chargé seulement quand il sert</Title>
      <Lede>Un dossier, un SKILL.md, des fichiers. Copilot lit la description ; le reste n’entre que si la demande le justifie.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CodeDark file=".github/skills/refactoring-sur/SKILL.md" size={19}>
          <span style={{ color: '#7C86A8' }}>---</span>
          {'\n'}
          <Ck>name</Ck>: refactoring-sur
          {'\n'}
          <Ck>description</Ck>: Refactoring sûr du code
          {'\n'}
          {'  '}hérité, sous tests de caractérisation.
          {'\n'}
          <span style={{ color: '#7C86A8' }}>---</span>
          {'\n'}
          <Cf># Refactoring sûr</Cf>
          {'\n'}- tests de caractérisation d’abord, verts
          {'\n'}- un geste à la fois, tests après chaque geste
          {'\n'}- Les gestes : [gestes.md](./gestes.md)
        </CodeDark>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {[
            ['1', 'Découverte', 'nom + description, toujours lus', 'grey'],
            ['2', 'Instructions', 'le corps du SKILL.md, si pertinent', 'blue'],
            ['3', 'Ressources', 'fichiers cités, si nécessaires', 'violet'],
          ].map(([n, t, s2, tone]) => (
            <div key={n} style={{ background: T[tone as Tone].bg, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, color: T[tone as Tone].fg }}>
                {n} · {t}
              </div>
              <div style={{ marginTop: 4, fontSize: 18, lineHeight: 1.35, color: C.soft }}>{s2}</div>
            </div>
          ))}
        </div>
      </div>
      <div ref={ref} className={A.right} style={{ position: 'absolute', left: 870, top: 290, width: 930, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <PanelTitle icon="chat">Votre demande · cliquez</PanelTitle>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {SK_REQ.map((r, i) => (
            <Btn key={r.q} size={18} ghost={i !== ri} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
              {r.q}
            </Btn>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SKILLS9.map((s, i) => {
            const lv = req.lv[i];
            const L = LV[lv];
            return (
              <div key={`${ri}-${s.id}`} className={k('swap')} style={{ ...dl(i * 90), display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr) 170px', gap: 12, alignItems: 'center', padding: '10px 14px', borderRadius: 14, background: lv > 1 ? T[L.tone].bg : C.panel, boxShadow: lv > 1 ? `inset 0 0 0 2px ${STRONG[L.tone]}` : 'none' }}>
                <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{s.id}</span>
                <span style={{ fontSize: 17, lineHeight: 1.3, color: C.soft }}>
                  {s.desc}
                  {lv === 3 && s.res ? <strong style={{ color: T.violet.fg }}> + {s.res}</strong> : null}
                </span>
                <Tag tone={L.tone} size={16}>
                  {L.t}
                </Tag>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, color: C.soft }}>
          Contexte occupé par les skills :
          <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${(tok / 7.5) * 100}%`, height: '100%', background: G.violet, transition: `width 450ms ${EASE}` }} />
          </div>
          <strong style={{ fontFamily: mono, color: C.ink }}>~{fr(tok, 1)} k tokens</strong>
        </div>
        <div style={{ marginTop: 6, fontSize: 16, color: C.faint }}>Ordres de grandeur illustratifs.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 870, top: 830, width: 930, ...dl(400) }}>
        <Callout tone="yellow" icon="bulb" title="La description fait tout" size={20}>
          Sans les bons mots dans la description, la skill ne se charge jamais. Elle s’appelle aussi à la main : tapez / dans le Chat.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Quel fichier pour quel besoin ? ────────────────────────────────────────
const FILES9 = [
  { name: 'copilot-instructions.md', path: '.github/ ou AGENTS.md', icon: 'note' as IconName, tone: 'navy' as Tone, when: 'Chargé à chaque demande', what: 'Les règles d’équipe : langage, style, interdits.' },
  { name: 'SKILL.md', path: '.github/skills/<nom>/', icon: 'book' as IconName, tone: 'violet' as Tone, when: 'Chargé si la demande correspond', what: 'Un savoir-faire, avec ses fichiers.' },
  { name: '*.agent.md', path: '.github/agents/', icon: 'bot' as IconName, tone: 'blue' as Tone, when: 'Choisi dans la liste', what: 'Un rôle : consignes, outils, skills.' },
  { name: 'mcp.json', path: '.vscode/', icon: 'plug' as IconName, tone: 'teal' as Tone, when: 'Outils appelés par l’agent', what: 'Un accès à un système externe : annuaire, tickets.' },
];
const SIT9 = [
  { q: '« Toute erreur lève une ErreurParafo. »', a: 0 },
  { q: '« Notre méthode de refactoring, avec ses gestes. »', a: 1 },
  { q: '« Un relecteur qui ne modifie jamais de fichier. »', a: 2 },
  { q: '« Chercher un signataire dans l’annuaire. »', a: 3 },
];

const M6_QuelFichier: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const si = pick ?? (beats >= 1 ? Math.min(beats - 1, 3) : null);
  const ans = si === null ? null : SIT9[si].a;
  return (
    <Frame mod={6} kind="exercice" beats={4}>
      <Title>Instructions, skill, agent ou MCP : quel fichier ?</Title>
      <Lede>Quatre fichiers Markdown, quatre usages. Pour chaque besoin, votez à voix haute, puis je clique la réponse.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {SIT9.map((s, i) => (
          <Btn key={s.q} size={20} tone="navy" ghost={si !== i} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
            {i + 1}. {s.q}
          </Btn>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 430, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
        {FILES9.map((f, i) => {
          const on = ans === i;
          const off = ans !== null && !on;
          return (
            <div key={f.name} className={cx(A.in, k('agn'))} style={{ ...dl(150 + i * 100), height: 420, boxSizing: 'border-box', background: C.card, borderRadius: 22, padding: '24px 24px', boxShadow: on ? `0 0 0 5px ${STRONG[f.tone]}, 0 24px 50px -24px rgba(11,31,92,.6)` : `${SHADOW}, inset 0 7px 0 ${STRONG[f.tone]}`, transform: on ? 'translateY(-10px)' : 'none', opacity: off ? 0.4 : 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <IconTile name={f.icon} tone={f.tone} size={60} solid={on} />
              <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ink }}>{f.name}</div>
              <div style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{f.path}</div>
              <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{f.what}</div>
              <div style={{ marginTop: 'auto' }}>
                <Tag tone={f.tone} size={17}>
                  {f.when}
                </Tag>
              </div>
              {on ? (
                <div className={k('swap')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 21, fontWeight: 700, color: T.green.fg }}>
                  <Icon name="checkCircle" size={26} sw={2.4} color={C.green} /> Réponse {(si ?? 0) + 1}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
        Ils se combinent : l’agent Refactoreur suit les instructions du dépôt et charge la skill refactoring-sur.
      </div>
    </Frame>
  );
};

const RISK9: { icon: IconName; t: string; f: string; p: string }[] = [
  { icon: 'euro', t: 'La facture', f: 'Chaque agent, sous-agent et aller-retour consomme des crédits IA.', p: 'Un plan précis, peu d’allers-retours, Auto ou un modèle léger pour les rôles simples.' },
  { icon: 'route', t: 'L’erreur en cascade', f: 'Un plan faux au départ : tout le reste est faux, avec aplomb.', p: 'Vous relisez le plan avant de lancer l’agent. Toujours.' },
  { icon: 'users', t: 'La complaisance', f: 'Un agent qui « fait passer » les tests en les modifiant.', p: 'npm run garde, et des tests d’acceptation relus par vous.' },
  { icon: 'key', t: 'Trop de pouvoir', f: 'Terminal + Internet + secrets : une page piégée peut dicter une commande.', p: 'Outils minimaux par agent, approbation des commandes, bac à sable.' },
  { icon: 'puzzle', t: 'Les agents et skills de tiers', f: 'Une skill peut contenir des scripts : c’est du code exécuté chez vous.', p: 'Relire avant d’installer, source de confiance, versionner dans le dépôt.' },
  { icon: 'eyeOff', t: 'L’humain hors boucle', f: 'Une PR de 2 000 lignes produite en 10 minutes ne sera jamais vraiment relue.', p: 'Petits lots, relecture du diff, et le « c’est fini » reste à vous.' },
];

const M6_Attention: Page = () => (
  <Frame mod={6} beats={6}>
    <Title>Plus d’autonomie, plus de garde-fous</Title>
    <Lede>Six points d’attention quand on délègue à des agents, et leurs parades. Les cartes se retournent au clic.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      {RISK9.map((r, i) => (
        <FlipCard
          key={r.t}
          w={542}
          h={318}
          flipAt={i + 1}
          tone="coral"
          backTone="green"
          cls={A.in}
          style={dl(i * 90)}
          front={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <IconTile name={r.icon} tone="coral" size={54} />
                <span style={{ fontSize: 27, fontWeight: 800, color: C.ink }}>{r.t}</span>
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{r.f}</div>
            </div>
          }
          back={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800, color: T.green.fg }}>
                <Icon name="shieldCheck" size={28} sw={2.4} /> Parade
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.42, color: C.ink }}>{r.p}</div>
            </div>
          }
        />
      ))}
    </div>
  </Frame>
);

// ─── Refactorer avec l'agent Refactoreur ────────────────────────────────────
const M6DiffLine = ({ kind, children }: { kind: '+' | '-' | ' '; children: string }) => (
  <div style={{ display: 'flex', gap: 10, background: kind === '+' ? 'rgba(155,226,155,.14)' : kind === '-' ? 'rgba(242,139,130,.16)' : 'transparent', padding: '0 12px' }}>
    <span style={{ width: 14, color: kind === '+' ? '#9BE29B' : kind === '-' ? '#F28B82' : '#7C86A8' }}>{kind}</span>
    <span style={{ whiteSpace: 'pre', color: kind === '-' ? '#F2B8B3' : '#E6EAF6' }}>{children}</span>
  </div>
);

const M6Flow = ({ n, who, children }: { n: number; who: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <Num n={n} tone="violet" size={32} />
    <div style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>
      <strong style={{ color: C.ink }}>{who}</strong> · {children}
    </div>
  </div>
);

const M6_Refactoreur: Page = () => (
  <Frame mod={6} kind="demo" beats={2}>
    <Title>Refactorer avec l’agent Refactoreur</Title>
    <Lede>Vous choisissez l’agent dans la liste ; il applique sa skill : un geste, les tests, et il s’arrête si un test rougit.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: '#0F1530', borderRadius: 16, overflow: 'hidden', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: '#18204A', fontSize: 19, color: '#DCE2F5' }}>
        <Tag tone="violet" size={16}>
          Refactoreur
        </Tag>
        <span style={{ fontStyle: 'italic' }}>Extrais le test du week-end dans estWeekEnd(date), même comportement</span>
      </div>
      <div style={{ padding: '14px 0', fontFamily: mono, fontSize: 19, lineHeight: 1.6 }}>
        <M6DiffLine kind=" ">{'function estOuvre(date, feries) {'}</M6DiffLine>
        <M6DiffLine kind="-">{'  var j = date.getUTCDay();'}</M6DiffLine>
        <M6DiffLine kind="-">{'  if (j == 0 || j == 6) return false;'}</M6DiffLine>
        <M6DiffLine kind="+">{'  if (estWeekEnd(date)) return false;'}</M6DiffLine>
        <M6DiffLine kind=" ">{'  for (const jour of feries) if (jour == versTexte(date)) …'}</M6DiffLine>
      </div>
      <div style={{ padding: '10px 18px 14px', borderTop: '1px solid #2C3260', fontFamily: mono, fontSize: 18, color: '#9BE29B' }}>
        execute · npm run test:atelier6 · caractérisation 10 / 10 ✓
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="check" tone="green" title="Ce diff est sûr" size={22} pad={22} cls={b.on(1)}>
        Le <Ic>==</Ic> sur les fériés est resté : c’est voulu, c’est le comportement de 2019.
      </Card>
      <Card icon="git" tone="blue" title="Puis, toujours" size={22} pad={22} cls={b.on(2)}>
        Relire le diff, puis commit <Ic>refactor : …</Ic>. Un geste, un test, un commit.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20, ...dl(500) }}>
      <M6Flow n={1} who="Ask">comprendre calc, règle par règle</M6Flow>
      <M6Flow n={2} who="Plan">la liste des gestes, relue</M6Flow>
      <M6Flow n={3} who="Refactoreur">un geste, les tests</M6Flow>
      <M6Flow n={4} who="Vous">le diff, le commit</M6Flow>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 760, ...dl(700) }}>
      Ensuite seulement : la version moderne src/relances.js, et la correction du bug dans un commit « fix » séparé.
    </Hint>
  </Frame>
);

// ─── Sous-agents ────────────────────────────────────────────────────────────
const M6Box = ({ x, y, w, h, tone, title, children, cls }: { x: number; y: number; w: number; h: number; tone: Tone; title: string; children: ReactNode; cls?: string }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 22px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M6_SousAgents: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Déléguer à un sous-agent : un contexte à part</Title>
    <Lede>L’agent principal confie une sous-tâche bornée ; le sous-agent travaille dans son propre contexte et ne renvoie que le résultat.</Lede>
    <M6Box x={120} y={290} w={560} h={250} tone="navy" title="Session principale" cls={A.in}>
      « Avant de refactorer, utilise un sous-agent pour lister les fonctions de src/legacy et les tests qui les couvrent. »
    </M6Box>
    <div className={b.on(1)} style={{ position: 'absolute', left: 700, top: 390 }}>
      <FlowArrow w={120} color={C.violet} dashed />
    </div>
    <M6Box x={840} y={290} w={560} h={250} tone="violet" title="Sous-agent" cls={b.on(1)}>
      Lit 14 fichiers, lance 3 recherches… dans <strong>son</strong> contexte, qui ne pollue pas le vôtre.
    </M6Box>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1420, top: 290, width: 380 }}>
      <Card icon="send" tone="green" title="Retour" size={21} pad={20}>
        Un résumé de 10 lignes, pas les 14 fichiers.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 600, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <Card icon="target" tone="blue" title="Quand déléguer" size={21} pad={22} cls={A.in} style={dl(400)}>
        Explorer, chercher, vérifier : une tâche bornée dont seul le résultat compte.
      </Card>
      <Card icon="euro" tone="yellow" title="Ce que ça coûte" size={21} pad={22} cls={A.in} style={dl(520)}>
        La délégation consomme aussi des tokens : pas pour une petite tâche.
      </Card>
      <Card icon="alert" tone="coral" title="Anciens tutoriels" size={21} pad={22} cls={A.in} style={dl(640)}>
        Les boutons de relais (handoffs) et le champ agents : harnais Local seulement, ignorés par Copilot.
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 6 ──────────────────────────────────────────────────────────────
const M6_Lab: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="L’agent Refactoreur et sa skill"
    defi="refacto"
    who="Individuel · 50 min"
    objective={
      <>
        Créer l’agent <strong>Refactoreur</strong> et la skill <strong>refactoring-sur</strong>, puis rendre <Ic>calc</Ic> lisible <strong>sans changer son comportement</strong>, et écrire sa version moderne, <strong>corrigée</strong>.
      </>
    }
    where={
      <>
        <PathChip size={19}>.github/agents/refactoreur.agent.md</PathChip>
        <br />
        <PathChip size={19}>.github/skills/refactoring-sur/SKILL.md</PathChip>
        <br />
        <PathChip size={19}>src/relances.js</PathChip> · 2 commits
      </>
    }
    minutes={50}
    crit={
      <>
        <CheckItem id="l6a" size={21}>test:atelier6 : 46 tests verts</CheckItem>
        <CheckItem id="l6b" size={21}>La skill est chargée (journaux)</CheckItem>
        <CheckItem id="l6c" size={21}>Refactor et fix : 2 commits distincts</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (skill), 30 min (agent), 40 min (refactoring)."
  >
    <WStep n={1}>La skill : name = nom du dossier, une description qui dit quoi ET quand, la méthode en 5 lignes.</WStep>
    <WStep n={2}>L’agent : description, outils limités, skills: ['refactoring-sur'], 5 à 8 consignes. Pas de handoffs.</WStep>
    <WStep n={3}>Choisissez le Refactoreur : refactoring sous tests, commit ; puis src/relances.js sous les tests de contrat, commit « fix ».</WStep>
    <TpBonus>faites déléguer calc(…, 'e') à dateExpiration, dans une branche.</TpBonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <Frame mod={6} kind="qcm">
    <Title>QCM · Module 6 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pendant le refactoring, un test de caractérisation passe au rouge. Cela signifie…" explain="Le comportement a changé : ce n’est plus un refactoring. On annule le dernier geste et on le refait plus petit.">
        <QOpt>Le test est faux, on le supprime</QOpt>
        <QOpt ok>Le comportement a changé : ce n’est plus un refactoring</QOpt>
        <QOpt>C’est normal après un refactoring</QOpt>
      </QuizQ>
      <QuizQ q="Quel champ d’un .agent.md limite ce que l’agent peut faire ?" explain="tools : sans edit, il ne modifie aucun fichier ; sans execute, pas de terminal. La description dit quand l’utiliser, le corps donne ses consignes.">
        <QOpt>description</QOpt>
        <QOpt ok>tools</QOpt>
        <QOpt>name</QOpt>
      </QuizQ>
      <QuizQ q="Votre skill n’est jamais chargée. Cause la plus probable ?" explain="Copilot ne lit d’abord que le nom et la description : si la description ne contient pas les mots de la demande, ou si name diffère du nom du dossier, la skill reste invisible.">
        <QOpt ok>Une description vague, ou un name différent du nom du dossier</QOpt>
        <QOpt>Le fichier SKILL.md est trop long</QOpt>
        <QOpt>Il faut le modèle le plus cher</QOpt>
      </QuizQ>
      <QuizQ q="Un tutoriel vous fait écrire des handoffs dans votre agent. Dans une session Copilot…" explain="Les handoffs (boutons de relais) n’existent que dans le harnais Local ; le harnais Copilot les ignore. On délègue plutôt à un sous-agent.">
        <QOpt>Ils créent des boutons de relais</QOpt>
        <QOpt ok>Ils sont ignorés : c’est un champ du harnais Local</QOpt>
        <QOpt>Ils bloquent l’agent</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Dejeuner: Page = () => <BreakPage mod={6} title="Bon appétit !" back="Reprise à 13 h 30 : des tests générés par une skill… et vérifiés." minutes={60} icon="smile" />;

// @@PAGES-BEGIN
export const __pages = [M6_Divider, M6_Odeurs, M6_Legacy, M6_Formuler, M6_Gestes, M6_Comparer, M6_Anatomie, M6_Skills, M6_QuelFichier, M6_Refactoreur, M6_SousAgents, M6_Attention, M6_Lab, M6_Qcm, M6_Dejeuner];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 6 · 10:50

OBJECTIF — Annoncer le module : refactorer sans changer le comportement, avec un agent et une skill écrits par vous.

DIRE — « Module 6. Un code de 2019, celui des relances de Parafo, à rendre lisible sans changer ce qu’il fait. Copilot est très bon pour proposer des transformations, et très tenté de corriger au passage. Vous allez donc écrire deux fichiers qui le cadrent : un agent, le Refactoreur, et une skill, sa méthode. L’arbitre reste le même : les tests. »

TRANSITION — « D’abord : comment reconnaître un code à refactoriser ? »`,
  `⏱ 3 min · LES SIX ODEURS

OBJECTIF — Donner un vocabulaire pour repérer le code à refactoriser.

DIRE — « Six odeurs, toutes tirées des relances de 2019. Des noms d’une lettre. De l’imbrication. Des nombres magiques : 86 400 000, c’est un jour en millisecondes, mais il faut le savoir. Un paramètre aiguillage : t fait de calc deux fonctions en une. Un effet de bord : la fonction trie la liste qu’on lui passe. Et une syntaxe datée : var, double égal. »

TRANSITION — « Les voici dans le vrai fichier. »`,
  `⏱ 5 min · LE LEGACY (exercice oral)

OBJECTIF — Faire repérer les odeurs et le bug sur le code réel de l’atelier.

DIRE — « Les relances de Parafo, écrites en 2019. Combien d’odeurs voyez-vous ? Dites-les au micro, je clique les pastilles correspondantes. »

ANIMATION — Cliquer les pastilles au fil des réponses. Insister sur la 3 (== : un délai « 5 » en texte marche, le changer change le comportement) et la 5 (le bug : le jour d’envoi compte ; on le garde pendant le refactoring, on le corrige dans un commit séparé). Montrer les tests ⚠ de caractérisation.

TRANSITION — « Comment demander à Copilot de nettoyer ça sans tout casser ? »`,
  `⏱ 4 min · FORMULER LA DEMANDE

OBJECTIF — Remplacer « améliore ce code » par une demande en 4 ingrédients.

DIRE — « “Améliore ce code” : Copilot réécrit quarante lignes, corrige le jour d’envoi au passage, met des triples égal partout. Trois tests au rouge. »

→ beat 1 « La demande en quatre ingrédients : quoi, le périmètre, la contrainte “même comportement”, et la vérification. Ces quatre ingrédients, vous les écrirez une fois pour toutes dans une skill. »

TRANSITION — « Les gestes de base. »`,
  `⏱ 4 min · TROIS GESTES

OBJECTIF — Montrer renommer, extraire, simplifier, avec les outils VS Code et Copilot.

DIRE — « Renommer : F2 renomme partout, sans risque. Extraire : la sélection, Ctrl+point, “Extraire dans une fonction”, ou une demande à l’agent. Simplifier : une constante nommée, une fonction lendemain. Attention : remplacer double égal par triple égal change le comportement ; testez à chaque pas. »

TRANSITION — « Comment être sûr que rien n’a changé ? »`,
  `⏱ 3 min · COMPARER AVANT / APRÈS

OBJECTIF — Donner les trois outils de validation et la règle des deux commits.

DIRE — « Trois vérifications, à chaque geste : les tests de caractérisation, verts avant et après ; le diff Git, où chaque ligne doit être un renommage, une extraction ou une simplification ; et votre relecture. Et deux commits : refactor, même comportement ; puis fix, comportement changé et prouvé par les tests de contrat. »

TRANSITION — « Maintenant, écrivons l’agent qui appliquera cette discipline. »`,
  `⏱ 5 min · ANATOMIE D’UN AGENT (interactif, 5 temps)

OBJECTIF — Présenter les champs d’un .agent.md pour le harnais Copilot.

DIRE — « Un agent personnalisé, c’est un fichier .agent.md dans .github/agents. On le crée dans Customizations, onglet Agents, ou à la main. »

→ beat 1 « La description : obligatoire pour le harnais Copilot. Elle dit ce que fait l’agent et quand le choisir. »

→ beat 2 « Les outils : ce qu’il a le droit de faire. Cliquez : terminal plus Internet, et le risque d’injection apparaît. »

→ beat 3 « Les skills : la méthode qu’il charge. »

→ beat 4 « Le modèle : facultatif. Et attention aux anciens tutoriels : handoffs et agents sont des champs du harnais Local, ignorés par Copilot. »

→ beat 5 « Le corps : ses consignes, en Markdown. Des règles vérifiables. »

TRANSITION — « La méthode qu’il charge, justement : la skill. »`,
  `⏱ 5 min · SKILLS (interactif, 4 temps)

OBJECTIF — Montrer le chargement progressif d’une skill selon la demande.

DIRE — « Une skill : un dossier, un SKILL.md, et des fichiers. Copilot ne lit d’abord que le nom et la description de chaque skill ; le corps n’entre que si la demande le justifie ; les fichiers, seulement s’il en a besoin. »

→ beat 1 « Une demande de refactoring : la skill refactoring-sur se charge en entier. » → beat 2 « Des tests : c’est tests-node. » → beat 3 « Un simple renommage : aucune ne se charge, le contexte reste léger. » → beat 4 « Slash et son nom : vous l’appelez vous-même. »

DIRE — « Conséquence : la description fait tout. Sans les bons mots, la skill ne se charge jamais. »

TRANSITION — « Instructions, skill, agent, MCP : lequel pour quel besoin ? »`,
  `⏱ 3 min · QUEL FICHIER (vote oral, 4 temps)

OBJECTIF — Faire choisir le bon fichier pour quatre besoins.

DIRE — « Quatre besoins. Votez à voix haute : instructions, skill, agent ou MCP ? »

→ beat 1 ErreurParafo partout → instructions. → beat 2 La méthode de refactoring → skill. → beat 3 Un relecteur qui ne modifie rien → agent. → beat 4 Chercher dans l’annuaire → un outil MCP, cet après-midi.

TRANSITION — « Voyons le Refactoreur au travail. »`,
  `⏱ 4 min · L’AGENT REFACTOREUR (démo)

OBJECTIF — Montrer le déroulé d’un refactoring avec l’agent : un geste, les tests, le diff, le commit.

DIRE — « Je choisis le Refactoreur dans la liste des agents. Ma demande : extraire le test du week-end. Il propose ce diff, puis il lance les tests : dix sur dix. »

→ beat 1 « Le double égal sur les fériés est resté : c’est voulu, c’est le comportement de 2019. »

→ beat 2 « Puis je relis le diff et je commite. Un geste, un test, un commit. Et seulement à la fin : la version moderne, et la correction du bug, dans un commit séparé. »

ANIMATION — Faire la démo réelle si possible sur ma copie (corrigé de l’étape 06).

TRANSITION — « Et quand une tâche demande beaucoup de lecture ? »`,
  `⏱ 4 min · SOUS-AGENTS

OBJECTIF — Expliquer la délégation à un sous-agent et l’isolation du contexte.

DIRE — « L’agent principal peut confier une sous-tâche bornée à un sous-agent : par exemple, lister les fonctions du code hérité et les tests qui les couvrent. »

→ beat 1 « Le sous-agent lit, cherche, dans son propre contexte : il ne pollue pas le vôtre. »

→ beat 2 « Il ne renvoie qu’un résumé. Quand déléguer : explorer, chercher, vérifier. Ce que ça coûte : des tokens aussi, donc pas pour une petite tâche. Et les boutons de relais des anciens tutoriels : harnais Local seulement. »

TRANSITION — « Plus d’autonomie, plus de garde-fous. »`,
  `⏱ 4 min · POINTS D’ATTENTION (cartes, 6 temps)

OBJECTIF — Lister les risques de la délégation et leurs parades.

DIRE — « Six risques. Je retourne chaque carte pour la parade. » → beats 1 à 6 : la facture ; l’erreur en cascade (relire le plan) ; la complaisance (npm run garde) ; trop de pouvoir (outils minimaux, approbations, bac à sable) ; les agents et skills de tiers (relire avant d’installer) ; l’humain hors boucle (petits lots, relecture du diff).

TRANSITION — « À vous : cinquante minutes. »`,
  `⏱ 50 min · ATELIER 6 (individuel) · 11:35

OBJECTIF — Créer l’agent Refactoreur et la skill refactoring-sur, refactorer sous tests, puis moderniser et corriger.

DIRE — « Cinquante minutes. D’abord la skill : un dossier à son nom, une description qui dit quoi et quand, la méthode en quelques lignes. Ensuite l’agent : description, outils limités, la skill, quelques consignes ; pas de handoffs. Puis vous le choisissez et vous refactorez, tests verts à chaque pas ; commit. Enfin la version moderne, sous les tests de contrat ; commit fix. »

ANIMATION — Points d’étape à 15, 30 et 40 min. Pièges : l’agent « corrige » pendant le refactoring (tri des fériés, délai texte) → test ⚠ rouge ; skill jamais chargée (name ≠ dossier, description vague) ; handoffs recopié d’un tutoriel ; l’agent veut modifier un test ⚠ → refuser, npm run garde. Bloqué : git checkout du fichier, geste plus petit ; npm run reprise -- 6 avant l’Atelier 7.

TRANSITION — « QCM, puis déjeuner. »`,
  `⏱ 5 min · QCM MODULE 6 (vote oral)

OBJECTIF — Vérifier refactoring vs changement de comportement, champs d’agent, skills, handoffs.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Bon appétit ! »`,
  `⏱ 60 min · DÉJEUNER · 12:30

DIRE — « Bon appétit ! Reprise à 13 h 30 : nous ferons écrire des tests par une skill… et nous vérifierons qu’ils servent à quelque chose. »`,
];
// @@NOTES-END
