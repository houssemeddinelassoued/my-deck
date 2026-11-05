// ─── Module 6 · Refactoring avec Copilot ────────────────────────────────────

const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Refactoring
        <br />
        avec Copilot
      </>
    }
    sub="Rendre un code lisible sans changer ce qu’il fait : Copilot propose, les tests tranchent."
    dur="J2 · 11:00 – 12:30"
    labs={<Tag tone="green" size={19}>Atelier 6 · le Kanban legacy de 2019</Tag>}
  >
    <SecItem n={1}>Identifier le code à refactoriser et formuler la demande</SecItem>
    <SecItem n={2}>Simplifier, renommer, extraire des fonctions</SecItem>
    <SecItem n={3}>Refactorer en langage naturel avec Copilot Chat</SecItem>
    <SecItem n={4}>Comparer avant et après pour valider</SecItem>
    <SecItem n={5}>Cas pratique : améliorer un code legacy fourni</SecItem>
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
    <Lede>Le code marche, mais on a peur d’y toucher. Tous ces exemples viennent du fichier legacy de TaskFlow.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <M6Smell icon="eyeOff" title="Noms obscurs" ex="traiter(l, i, s, opt)" d={100}>
        Il faut lire tout le corps pour deviner le rôle.
      </M6Smell>
      <M6Smell icon="layers" title="Imbrication" ex="if { if { for { if" d={180}>
        Chaque niveau ajoute un cas à garder en tête.
      </M6Smell>
      <M6Smell icon="gauge" title="Nombres magiques" ex="if (n > 3)" d={260}>
        3 quoi ? Une constante nommée le dirait.
      </M6Smell>
      <M6Smell icon="loop" title="Duplication" ex="for (var k…) ×2" d={340}>
        Deux boucles presque identiques à maintenir.
      </M6Smell>
      <M6Smell icon="alert" title="Effets de bord" ex="r.statut = s;" d={420}>
        La fonction modifie la liste qu’on lui passe.
      </M6Smell>
      <M6Smell icon="clock" title="Syntaxe datée" ex="var · == · substring" d={500}>
        Des pièges connus que le JavaScript moderne évite.
      </M6Smell>
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
        <div style={{ marginTop: 16, fontSize: 21, color: C.soft }}>Résultat typique : 40 lignes réécrites, le bug WIP corrigé « au passage », == devenu ===. Trois tests de caractérisation au rouge.</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 820, top: 280, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="check" c={C.green}>
        La demande en 4 ingrédients
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M6Ing tone="blue" label="Quoi">
          Remplace var par const/let et extrais trouverTicket et compterEnCours.
        </M6Ing>
        <M6Ing tone="teal" label="Périmètre">
          Uniquement la fonction traiter, rien d’autre dans le fichier.
        </M6Ing>
        <M6Ing tone="violet" label="Contrainte">
          Exactement le même comportement : garde == et la mutation.
        </M6Ing>
        <M6Ing tone="green" label="Vérification">
          Les 9 tests de kanban-legacy.test.js doivent rester verts.
        </M6Ing>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="blue" icon="target" title="Petits pas" size={24} cls={b.on(1)}>
        Une transformation par demande, un test après chaque demande. Si un test rougit, on annule le dernier pas, pas toute la matinée.
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
    <Lede>Copilot les accélère ; VS Code les sécurise. Combinez les deux.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M6Geste
        tone="blue"
        title="Renommer"
        how={
          <>
            <Kbd>F2</Kbd> sur le nom : VS Code renomme partout ; Copilot propose des noms, NES suit.
          </>
        }
        before={'function traiter(l, i, s) {\n  var r = null;'}
        after={'function traiter(tickets, id, versStatut) {\n  let ticket = null;'}
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
        before={'var n = 0;\nfor (var k2 = 0; …)\n  if (l[k2].statut == "encours") n++;'}
        after={'const n = compterEnCours(tickets);'}
        d={220}
      />
      <M6Geste
        tone="teal"
        title="Simplifier"
        how={<>Retours anticipés, constantes nommées, conditions regroupées.</>}
        before={'if (s == "termine") {\n  if (r.statut != "encours") {\n    return …'}
        after={'if (versStatut === "termine"\n    && ticket.statut !== "encours")\n  return …'}
        d={340}
      />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Simplifier une condition avec === au lieu de == change le comportement : vérifiez les tests à chaque pas.
    </Hint>
  </Frame>
);

// ─── Refactorer avec le chat ────────────────────────────────────────────────
const M6DiffLine = ({ kind, children }: { kind: '+' | '-' | ' '; children: string }) => (
  <div style={{ display: 'flex', gap: 10, background: kind === '+' ? 'rgba(155,226,155,.14)' : kind === '-' ? 'rgba(242,139,130,.16)' : 'transparent', padding: '0 12px' }}>
    <span style={{ width: 14, color: kind === '+' ? '#9BE29B' : kind === '-' ? '#F28B82' : '#7C86A8' }}>{kind}</span>
    <span style={{ whiteSpace: 'pre', color: kind === '-' ? '#F2B8B3' : '#E6EAF6' }}>{children}</span>
  </div>
);

const M6_Chat: Page = () => (
  <Frame mod={6} kind="demo" beats={2}>
    <Title>Refactorer en langage naturel avec Ctrl+I</Title>
    <Lede>Vous décrivez la transformation, Copilot propose un diff. Rien n’est écrit avant votre clic sur « Accepter ».</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: '#0F1530', borderRadius: 16, overflow: 'hidden', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: '#18204A', fontSize: 19, color: '#DCE2F5' }}>
        <Icon name="sparkles" size={20} color="#AEB9E6" />
        <span style={{ fontStyle: 'italic' }}>Extrais la boucle de comptage dans compterEnCours(tickets), même comportement</span>
      </div>
      <div style={{ padding: '14px 0', fontFamily: mono, fontSize: 19, lineHeight: 1.6 }}>
        <M6DiffLine kind=" ">{'  if (versStatut == "encours") {'}</M6DiffLine>
        <M6DiffLine kind="-">{'    var n = 0;'}</M6DiffLine>
        <M6DiffLine kind="-">{'    for (var k2 = 0; k2 < l.length; k2++) {'}</M6DiffLine>
        <M6DiffLine kind="-">{'      if (l[k2].statut == "encours") { n = n + 1; }'}</M6DiffLine>
        <M6DiffLine kind="-">{'    }'}</M6DiffLine>
        <M6DiffLine kind="+">{'    const n = compterEnCours(tickets);'}</M6DiffLine>
        <M6DiffLine kind=" ">{'    if (n > LIMITE) return { ok: false, msg: "WIP" };'}</M6DiffLine>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderTop: '1px solid #2C3260' }}>
        <span style={{ background: C.electric, color: '#fff', borderRadius: 6, padding: '4px 14px', fontSize: 18 }}>Accepter</span>
        <span style={{ background: '#2C3470', color: '#DCE2F5', borderRadius: 6, padding: '4px 14px', fontSize: 18 }}>Ignorer</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="check" tone="green" title="Ce diff est sûr" size={22} pad={22} cls={b.on(1)}>
        La limite <Ic>n {'>'} LIMITE</Ic> est restée telle quelle : bug compris. C’est voulu.
      </Card>
      <Card icon="flask" tone="blue" title="Puis, toujours" size={22} pad={22} cls={b.on(2)}>
        <Ic>npm run test:atelier6</Ic>, puis commit. Un pas, un test, un commit.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1680, display: 'flex', gap: 28, fontSize: 22, color: C.soft, ...dl(600) }}>
      <span>
        <strong style={{ color: C.navy }}>Ctrl+I</strong> : une fonction
      </span>
      <span>
        <strong style={{ color: C.navy }}>Vue Chat, Ask</strong> : comprendre avant de toucher
      </span>
      <span>
        <strong style={{ color: C.navy }}>Agent</strong> : plusieurs fichiers, à réserver aux tâches bien bornées
      </span>
    </div>
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
          <Ic>refactor : kanban legacy lisible</Ic>
          <br />
          même comportement, tests inchangés
        </div>
        <div style={{ fontSize: 23, color: C.ink, lineHeight: 1.45 }}>
          <Ic>fix : limite WIP respectée</Ic>
          <br />
          comportement changé, test mis à jour <em>exprès</em>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Le legacy de TaskFlow ──────────────────────────────────────────────────
const M6_Legacy: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Cas pratique : le Kanban legacy de TaskFlow</Title>
    <Lede>Écrit en 2019, « ça marche, ne touchez à rien ». Combien d’odeurs voyez-vous ? Dites-les : je clique les pastilles.</Lede>
    <CodeDark file="src/legacy/kanban-legacy.js" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <Ck>var</Ck> LIMITE = <Cn>3</Cn>;{'\n'}
      <Ck>function</Ck> <Cf>traiter</Cf>(l, i, s, opt) {'{'}
      {'\n  '}
      <Ck>var</Ck> r = <Ck>null</Ck>;{'\n  '}
      <Ck>for</Ck> (<Ck>var</Ck> k = <Cn>0</Cn>; k &lt; l.length; k++) {'{ '}
      <Ck>if</Ck> (l[k].id == i) {'{ r = l[k]; } }'}
      {'\n  '}
      <Ck>if</Ck> (r == <Ck>null</Ck>) {'{ '}
      <Ck>return</Ck> {'{ ok: false, msg: '}
      <Cs>"introuvable"</Cs> {'}; }'}
      {'\n  '}
      <Cc>{'// … statut inconnu, ticket non estimé …'}</Cc>
      {'\n  '}
      <Ck>if</Ck> (s == <Cs>"encours"</Cs>) {'{'}
      {'\n    '}
      <Ck>var</Ck> n = <Cn>0</Cn>;{'\n    '}
      <Ck>for</Ck> (<Ck>var</Ck> k2 = <Cn>0</Cn>; k2 &lt; l.length; k2++) {'{ '}
      <Ck>if</Ck> (l[k2].statut == <Cs>"encours"</Cs>) {'{ n = n + 1; } }'}
      {'\n    '}
      <Ck>if</Ck> (n &gt; LIMITE) {'{ '}
      <Ck>return</Ck> {'{ ok: false, msg: '}
      <Cs>"WIP"</Cs> {'}; }'}
      {'\n  }\n  '}
      r.statut = s;{'\n  '}
      <Cc>{'// … termineLe = new Date() …'}</Cc>
      {'\n  '}
      <Ck>return</Ck> {'{ ok: true, msg: "" };\n}'}
    </CodeDark>
    <Hotspot n={1} x={500} y={346} title="Noms d’une lettre" w={420}>
      l, i, s, r, k, k2 : rien ne dit ce qu’ils contiennent.
    </Hotspot>
    <Hotspot n={2} x={1040} y={431} title="Comparaison large ==" w={420} side="left">
      "1" trouve le ticket 1. Le changer est un changement de comportement !
    </Hotspot>
    <Hotspot n={3} x={1110} y={637} title="Duplication" w={420} side="left">
      Deux boucles qui parcourent la liste : à extraire en fonctions nommées.
    </Hotspot>
    <Hotspot n={4} x={640} y={667} title="Nombre magique et bug" w={460}>
      n {'>'} 3 laisse passer un 4e ticket en cours : le bug WIP, à corriger dans un commit séparé.
    </Hotspot>
    <Hotspot n={5} x={330} y={727} title="Effet de bord" w={420}>
      La fonction modifie le ticket de la liste reçue.
    </Hotspot>
    <div className={A.right} style={{ position: 'absolute', left: 1280, top: 262, width: 520, ...dl(300) }}>
      <Card icon="flask" tone="green" title="Le filet de sécurité" size={22} pad={24}>
        9 tests de caractérisation, déjà écrits, déjà verts, y compris le test « ⚠ accepte un 4e ticket en cours ».
        <div style={{ marginTop: 14 }}>
          <Ic>npm run test:atelier6</Ic>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 6 ──────────────────────────────────────────────────────────────
const M6_Lab: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="Refactorer le Kanban legacy"
    defi="refacto"
    who="Individuel · 45 min"
    objective={
      <>
        Rendre <Ic>traiter</Ic> lisible <strong>sans changer son comportement</strong> (9 tests verts), puis écrire sa version moderne <Ic>deplacerTicket</Ic> : pure, nommée, et <strong>corrigée</strong> du bug WIP.
      </>
    }
    where={
      <>
        <PathChip size={19}>src/legacy/kanban-legacy.js</PathChip>
        <br />
        <PathChip size={19}>src/kanban.js</PathChip>
        <br />2 commits : refactor, puis fix
      </>
    }
    minutes={45}
    crit={
      <>
        <CheckItem id="l6a" size={21}>test:atelier6 : 12 tests verts</CheckItem>
        <CheckItem id="l6b" size={21}>Plus aucun var dans le legacy</CheckItem>
        <CheckItem id="l6c" size={21}>Refactor et fix : 2 commits distincts</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (renommages), 30 min (extractions), 40 min (kanban.js)."
  >
    <WStep n={1}>Ask : faites expliquer traiter règle par règle ; comparez avec les noms des tests.</WStep>
    <WStep n={2}>
      <Kbd>F2</Kbd> pour renommer, <Kbd>Ctrl+I</Kbd> pour extraire et simplifier : un pas, un test, puis commit.
    </WStep>
    <WStep n={3}>
      Générez <Ic>src/kanban.js</Ic> depuis ses commentaires : le contrat WIP passe, commit « fix ».
    </WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <Frame mod={6} kind="qcm">
    <Title>QCM · Module 6 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Après « améliore ce code », un test de caractérisation passe au rouge. Que s’est-il passé ?" explain="Le comportement a changé : Copilot a corrigé ou modifié quelque chose au passage. Un refactoring garde tous les tests de caractérisation verts.">
        <QOpt>Le test est faux, on le supprime</QOpt>
        <QOpt ok>Le comportement a changé : ce n’est plus un refactoring</QOpt>
        <QOpt>C’est normal après un refactoring</QOpt>
      </QuizQ>
      <QuizQ q="Remplacer == par === dans le legacy, c’est…" explain="Un changement de comportement : le texte « 1 » ne trouve plus le ticket 1. Peut-être souhaitable, mais à décider et commiter séparément.">
        <QOpt>Un simple nettoyage sans risque</QOpt>
        <QOpt ok>Un changement de comportement, à traiter à part</QOpt>
        <QOpt>Obligatoire pour que les tests passent</QOpt>
      </QuizQ>
      <QuizQ q="Quel est le bon découpage des commits ?" explain="Un commit de refactoring (même comportement) puis un commit de correction (comportement changé, test mis à jour exprès) : la revue et l’annulation restent simples.">
        <QOpt>Un seul gros commit « nettoyage »</QOpt>
        <QOpt ok>Refactoring d’abord, correction du bug ensuite</QOpt>
        <QOpt>Correction d’abord, refactoring jamais</QOpt>
      </QuizQ>
      <QuizQ q="Un test de caractérisation sert à…" explain="Il fige le comportement actuel, bugs compris, pour détecter tout changement involontaire pendant le refactoring.">
        <QOpt>Prouver que le code est correct</QOpt>
        <QOpt ok>Figer ce que le code fait aujourd’hui, bugs compris</QOpt>
        <QOpt>Mesurer la performance</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Dejeuner: Page = () => <BreakPage mod={6} title="Bon appétit !" back="Reprise à 14 h 00 : des tests unitaires générés… et vérifiés." minutes={90} icon="smile" />;

// @@PAGES-BEGIN
export const __pages = [M6_Divider, M6_Odeurs, M6_Formuler, M6_Gestes, M6_Chat, M6_Comparer, M6_Legacy, M6_Lab, M6_Qcm, M6_Dejeuner];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 6 · 11:00

OBJECTIF — Annoncer le refactoring : lisible, sans changer le comportement.

DIRE — « Module 6 : le refactoring. Rendre un code lisible sans changer ce qu’il fait. Copilot est très bon pour proposer des transformations ; il est aussi très tenté de corriger ou d’améliorer au passage. Notre arbitre : les tests. »

TRANSITION — « D’abord : comment reconnaître un code à refactoriser ? »`,
  `⏱ 4 min · LES SIX ODEURS

OBJECTIF — Donner un vocabulaire pour repérer le code à refactoriser.

DIRE — « Six odeurs, toutes tirées du vieux fichier de TaskFlow. Des noms d’une lettre ; de l’imbrication ; des nombres magiques ; de la duplication ; des effets de bord, la fonction modifie ce qu’on lui passe ; et une syntaxe datée, var et double égal. Aucune n’empêche le code de marcher. Toutes rendent la modification risquée. »

TRANSITION — « Comment demander à Copilot de nettoyer ça ? »`,
  `⏱ 5 min · FORMULER LA DEMANDE

OBJECTIF — Remplacer « améliore ce code » par une demande en 4 ingrédients.

DIRE — « La demande vague : “améliore ce code”. Résultat typique : quarante lignes réécrites, le bug corrigé au passage, le double égal transformé en triple. Trois tests au rouge, et on ne sait plus pourquoi. » → beat 1 « La bonne demande a quatre ingrédients : quoi, le périmètre, la contrainte “même comportement”, et la vérification. Et des petits pas : une transformation, un test. »

TRANSITION — « Les trois gestes de base. »`,
  `⏱ 5 min · TROIS GESTES (démo)

OBJECTIF — Montrer renommer, extraire, simplifier, avec les outils VS Code et Copilot.

DIRE — « Renommer : F2, VS Code renomme toutes les occurrences sans se tromper, et Copilot peut proposer de meilleurs noms. Extraire : sélection, Ctrl+point, “extraire dans une fonction”, ou Ctrl+I en donnant le nom. Simplifier : retours anticipés, constantes nommées. Attention à la dernière ligne : passer du double au triple égal change le comportement. »

ANIMATION — Faire un renommage F2 en direct dans le legacy, montrer la suggestion de modification suivante.

TRANSITION — « Le geste le plus puissant : décrire la transformation en français. »`,
  `⏱ 5 min · REFACTORER AVEC CTRL+I (démo)

OBJECTIF — Montrer le diff de Ctrl+I et la discipline un pas / un test / un commit.

DIRE — « Je sélectionne la fonction, Ctrl+I : “extrais la boucle de comptage dans compterEnCours, même comportement”. Copilot propose un diff : en rouge ce qui part, en vert ce qui arrive. » → beat 1 « Je lis : la limite est restée “supérieur strict”, le bug est conservé. C’est voulu : on refactore, on ne corrige pas. » → beat 2 « J’accepte, je lance les tests, je commite. »

TRANSITION — « Comment être sûr que rien n’a changé ? »`,
  `⏱ 4 min · COMPARER AVANT / APRÈS

OBJECTIF — Donner les trois outils de validation et la règle des deux commits.

DIRE — « Trois outils. Les tests de caractérisation : ils photographient ce que le code fait aujourd’hui, bugs compris. Le diff Git : chaque ligne doit être un renommage, une extraction ou une simplification. Et votre relecture : si vous ne pouvez pas expliquer un changement, vous l’annulez. Et la règle d’or : refactoring et correction de bug, ce sont deux commits différents. »

TRANSITION — « Voici le code que vous allez reprendre. »`,
  `⏱ 5 min · LE LEGACY (exercice oral)

OBJECTIF — Faire repérer les odeurs sur le code réel de l’atelier.

DIRE — « Le Kanban legacy. Combien d’odeurs voyez-vous ? Dites-les au micro, je clique les pastilles correspondantes. »

ANIMATION — Cliquer les pastilles au fil des réponses. Insister sur la 2 (== : comportement) et la 4 (le bug WIP, conservé pendant le refactoring). Montrer le test « ⚠ accepte un 4e ticket ».

TRANSITION — « À vous : quarante-cinq minutes. »`,
  `⏱ 45 min · ATELIER 6 (individuel) · 11:35

OBJECTIF — Refactorer en petits pas sous la protection des tests, puis réécrire et corriger séparément.

DIRE — « Quarante-cinq minutes, énoncé dans ateliers/atelier-06-refactoring. D’abord comprendre avec Ask. Puis renommer, extraire, simplifier : un pas, un test, un commit. Enfin, générer src/kanban.js : la version moderne, pure, qui corrige le bug WIP. Deux commits distincts. »

ANIMATION — Points d’étape à 15, 30 et 40 min. Piège n° 1 : « améliore ce code » qui casse 3 tests. Piège n° 2 : === dans le legacy. Bloqué : git checkout du fichier et refaire en plus petit ; point de reprise dans reprises/fin-atelier-06.

TRANSITION — « QCM, puis déjeuner. »`,
  `⏱ 5 min · QCM MODULE 6 (vote oral)

OBJECTIF — Vérifier la distinction refactoring / changement de comportement.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Bon appétit ! Cet après-midi : les tests. »`,
  `⏱ 90 min · DÉJEUNER · 12:30

DIRE — « Bon appétit ! Reprise à 14 h 00 : nous ferons écrire des tests à Copilot… et nous vérifierons qu’ils servent à quelque chose. »`,
];
// @@NOTES-END
