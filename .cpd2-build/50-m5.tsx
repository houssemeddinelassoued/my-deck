// ─── Module 5 · Le harnais : boucle, outils, permissions ────────────────────
const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Le harnais : boucle,
        <br />
        outils, permissions
      </>
    }
    sub="Décider ce que l’agent a le droit de faire avant de lui confier une tâche, puis l’observer."
    dur="J2 · 9:15 – 10:35"
    labs={<Tag tone="green" size={19}>Atelier 5 · harnais réglé, circuit livré</Tag>}
  >
    <SecItem n={1}>Un tour de boucle : ce que fait le modèle, ce que fait le harnais</SecItem>
    <SecItem n={2}>Les outils de l’agent, et pourquoi en limiter le nombre</SecItem>
    <SecItem n={3}>Approbations, permissions, auto-approbation du terminal</SecItem>
    <SecItem n={4}>Le bac à sable et la compaction du contexte</SecItem>
    <SecItem n={5}>Observer : journaux, tokens, crédits</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Un tour de boucle ──────────────────────────────────────────────────────
const M5Job = ({ n, icon, title, children, beat }: { n: number; icon: IconName; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone="navy" size={34} style={{ marginTop: 2 }} />
    <IconTile name={icon} tone="navy" size={40} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M5_Boucle: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Un tour de boucle : qui fait quoi ?</Title>
    <Lede>Le modèle ne fait qu’une chose : prédire la suite, ou demander un outil. Tout le reste, c’est le harnais.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 520, background: T.violet.bg, borderRadius: 20, padding: '24px 28px', boxShadow: `inset 0 0 0 2px ${T.violet.bd}`, ...dl(100) }}>
      <PanelTitle icon="brain" c={T.violet.fg}>
        Le modèle
      </PanelTitle>
      <div style={{ fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        Reçoit un texte, renvoie :
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Bullet size={22} tone="violet">une réponse pour vous, ou</Bullet>
          <Bullet size={22} tone="violet">« appelle tel outil avec tels arguments »</Bullet>
        </div>
        <div style={{ marginTop: 16, fontSize: 20, color: C.soft }}>Il n’ouvre aucun fichier, ne lance aucune commande.</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 700, top: 262, width: 1100, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Eyebrow c={C.navy} size={20}>
        Le harnais, à chaque tour
      </Eyebrow>
      <M5Job n={1} icon="layers" title="Assemble le contexte" beat={0}>
        instructions, fichiers, historique, liste des outils disponibles
      </M5Job>
      <M5Job n={2} icon="shield" title="Vérifie la permission" beat={1}>
        approuvé d’office, ou il vous demande
      </M5Job>
      <M5Job n={3} icon="terminal" title="Exécute l’outil" beat={1}>
        lit, édite, lance npm test… dans le bac à sable s’il est activé
      </M5Job>
      <M5Job n={4} icon="loop" title="Renvoie le résultat au modèle" beat={2}>
        la sortie de l’outil entre dans le contexte, et on recommence
      </M5Job>
      <M5Job n={5} icon="doc" title="Compacte et journalise" beat={3}>
        résume quand c’est plein, trace chaque appel
      </M5Job>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 700, width: 540, ...dl(600) }}>
      Même modèle, autre harnais : autres outils, autres droits, autre comportement.
    </Hint>
  </Frame>
);

// ─── Les outils ─────────────────────────────────────────────────────────────
const M5Tool = ({ alias, title, children, tone, d }: { alias: string; title: string; children: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', borderLeft: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, color: T[tone].fg }}>{alias}</span>
      <span style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 4, fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{children}</div>
  </div>
);

const M5_Outils: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Les outils de l’agent : ses mains et ses yeux</Title>
    <Lede>Intégrés, apportés par un serveur MCP ou par une extension. L’agent ne peut faire que ce que ses outils permettent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
      <M5Tool alias="read" title="Lire" tone="blue" d={100}>
        fichiers, erreurs de l’éditeur, sortie du terminal
      </M5Tool>
      <M5Tool alias="search" title="Chercher" tone="blue" d={160}>
        dans les fichiers, les noms, les modifications
      </M5Tool>
      <M5Tool alias="edit" title="Modifier" tone="violet" d={220}>
        créer et éditer des fichiers
      </M5Tool>
      <M5Tool alias="execute" title="Exécuter" tone="coral" d={280}>
        lancer une commande dans le terminal
      </M5Tool>
      <M5Tool alias="web" title="Le web" tone="yellow" d={340}>
        lire une page à une adresse donnée
      </M5Tool>
      <M5Tool alias="agent" title="Déléguer" tone="teal" d={400}>
        confier une sous-tâche à un sous-agent
      </M5Tool>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="gear" tone="navy" title="Où les choisir" size={22} pad={24} cls={A.right} style={dl(300)}>
        <strong>Chat: Open Customizations › Tools</strong> : activez ou désactivez des outils, ou des groupes entiers.
      </Card>
      <Card icon="gauge" tone="green" title="Pourquoi en retirer" size={22} pad={24} cls={A.right} style={dl(450)}>
        Chaque outil disponible occupe du contexte à chaque tour, et trop de choix en rend certains mauvais.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 760, ...dl(700) }}>
      Ces noms courts (read, search, edit…) serviront dans vos agents personnalisés, au Module 6.
    </Hint>
  </Frame>
);

// ─── Approbations et permissions ────────────────────────────────────────────
const M5Level = ({ tone, title, sub, children, d }: { tone: Tone; title: string; sub: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
    <div style={{ fontFamily: mono, fontSize: 17, color: T[tone].fg, marginTop: 4 }}>{sub}</div>
    <div style={{ marginTop: 12, fontSize: 21, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const M5_Permissions: Page = () => (
  <Frame mod={5} beats={1}>
    <Title>Approbations : qui dit oui à chaque action ?</Title>
    <Lede>Un niveau de permission par session, choisi dans la zone de saisie du Chat. Il se change à tout moment.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M5Level tone="green" title="Manual permissions" sub="par défaut" d={100}>
        L’agent vous demande avant toute action risquée : commande, écriture hors du dépôt, page web. <strong>Notre réglage.</strong>
      </M5Level>
      <M5Level tone="yellow" title="Allow all" sub="tout approuver" d={220}>
        Plus de questions : l’agent enchaîne. Vous découvrez ce qu’il a fait… après.
      </M5Level>
      <M5Level tone="coral" title="Autopilot" sub="autonomie complète" d={340}>
        Il va jusqu’au bout sans vous. Réservé à un environnement isolé, jetable.
      </M5Level>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="blue" icon="hand" title="Une demande d’approbation se lit" size={22}>
        Quelle commande, dans quel dossier, pour quoi faire ? « Toujours autoriser » vaut pour toute la suite : jamais par réflexe.
      </Callout>
      <Callout tone="coral" icon="alert" title="Votre organisation peut décider" size={22}>
        Un administrateur peut imposer un niveau par défaut, ou interdire les plus permissifs.
      </Callout>
    </div>
  </Frame>
);

// ─── Auto-approbation du terminal ───────────────────────────────────────────
const M5_AutoApprove: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>Auto-approuver seulement ce qui est sûr</Title>
    <Lede>Le terminal est un seul outil, mais chaque commande est évaluée à part. Vous écrivez les règles.</Lede>
    <CodeDark file=".vscode/settings.json" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Cs>"chat.tools.terminal.autoApprove"</Cs>: {'{'}
      {'\n  '}
      <Cs>{'"/^npm (test|run test:atelier\\\\d)$/"'}</Cs>: <Cn>true</Cn>,
      {'\n  '}
      <Cs>{'"/^node --test( \\\\S+)*$/"'}</Cs>: <Cn>true</Cn>,
      {'\n  '}
      <Cs>{'"/^git (push|reset|clean)\\\\b/"'}</Cs>: <Ck>false</Ck>,
      {'\n  '}
      <Cs>{'"/^(rm|del|Remove-Item)\\\\b/"'}</Cs>: <Ck>false</Ck>,
      {'\n  '}
      <Cs>{'"/^(npm|npx) (install|i|add|exec)\\\\b/"'}</Cs>: <Ck>false</Ck>
      {'\n}'}
      ,{'\n'}
      <Cs>"chat.permissions.default"</Cs>: <Cs>"default"</Cs>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="check" tone="green" title="true : sans demander" size={21} pad={20} cls={A.right} style={dl(200)}>
        Les tests, et seulement eux. Une clé entre <Ic>/…/</Ic> est une expression régulière.
      </Card>
      <Card icon="hand" tone="coral" title="false : toujours demander" size={21} pad={20} cls={b.on(1)}>
        Une règle false l’emporte sur une règle true. Elle demande votre accord, elle ne bloque pas.
      </Card>
      <Card icon="alert" tone="yellow" title="Le piège" size={21} pad={20} cls={b.on(2)}>
        <Ic>"npm": true</Ic> approuve aussi <Ic>npm install paquet-inconnu</Ic>. Soyez précis.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1000, ...dl(700) }}>
      Commande composée (a && b) : approuvée seulement si chaque morceau l’est. Atelier 5 : des tests vérifient vos règles.
    </Hint>
  </Frame>
);

// ─── Le bac à sable ─────────────────────────────────────────────────────────
const M5_Sandbox: Page = () => (
  <Frame mod={5}>
    <Title>Le bac à sable : limiter ce que l’agent peut toucher</Title>
    <Lede>Les commandes de l’agent s’exécutent dans une enceinte : seulement les dossiers et les sites que vous autorisez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="lock" tone="navy" title="Fichiers" size={22} pad={24} cls={A.in} style={dl(100)}>
        Lecture et écriture dans le dossier de travail ; le reste en lecture seule ou interdit.
      </Card>
      <Card icon="globe" tone="teal" title="Réseau" size={22} pad={24} cls={A.in} style={dl(200)}>
        Couper le réseau, ou n’autoriser que quelques domaines (par exemple api.github.com).
      </Card>
      <Card icon="cpu" tone="violet" title="Prérequis" size={22} pad={24} cls={A.in} style={dl(300)}>
        macOS 15, Linux ou WSL 2 ; Windows 11 récent en expérimental. Sinon, la commande ne se lance pas.
      </Card>
    </div>
    <CodeDark file="Réglages utilisateur (JSON)" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 900, ...dl(450) }}>
      <Cs>"chat.agent.sandbox.enabled"</Cs>: <Cs>"on"</Cs>,{'\n'}
      <Cs>"chat.agent.sandbox.network.allowNetwork"</Cs>: <Ck>false</Ck>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1080, top: 560, width: 720 }}>
      <Callout tone="yellow" icon="shield" title="Deux protections différentes" size={22} cls={A.in} style={dl(600)}>
        L’approbation décide <em>si</em> une commande part ; le bac à sable limite <em>ce qu’elle peut faire</em> une fois partie. L’un ne remplace pas l’autre.
      </Callout>
    </div>
  </Frame>
);

// ─── Compaction ─────────────────────────────────────────────────────────────
const M5_Compaction: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Quand le contexte déborde : la compaction</Title>
    <Lede>À chaque tour, les sorties des outils s’ajoutent. Une longue session finit par remplir la fenêtre.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <M3Block w={180} tone="grey" label="Instructions" />
        <M3Block w={180} tone="navy" label="Tour 1" />
        <M3Block w={200} tone="navy" label="Tour 2 + test rouge" />
        <M3Block w={220} tone="navy" label="Tour 3 + 400 lignes" />
        <M3Block w={180} tone="navy" label="Tour 4" />
        <div className={b.on(1)} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <FlowArrow w={60} color={C.violet} />
          <M3Block w={300} tone="violet" label="Résumé des tours 1 à 4" />
          <M3Block w={160} tone="navy" label="Tour 5" />
        </div>
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 460, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="layers" tone="violet" title="Ce que fait le harnais" size={22} pad={22}>
        Il résume les anciens tours pour faire de la place. Un détail peut se perdre dans le résumé.
      </Card>
      <Card icon="reset" tone="green" title="Ce que vous faites" size={22} pad={22}>
        Une session par tâche. <Ic>/compact</Ic> pour résumer vous-même ; une nouvelle session pour changer de sujet.
      </Card>
      <Card icon="users" tone="teal" title="Ce qui isole" size={22} pad={22}>
        Un sous-agent travaille dans son propre contexte et ne renvoie que son résultat (Module 6).
      </Card>
    </div>
  </Frame>
);

// ─── Observer ───────────────────────────────────────────────────────────────
const M5LogLine = ({ t, kind, children }: { t: string; kind: 'tool' | 'model' | 'ask'; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '90px 110px minmax(0, 1fr)', gap: 12, fontFamily: mono, fontSize: 18, lineHeight: 1.7 }}>
    <span style={{ color: '#7C86A8' }}>{t}</span>
    <span style={{ color: kind === 'tool' ? '#82AAFF' : kind === 'ask' ? '#FFD27A' : '#C792EA' }}>{kind === 'tool' ? 'outil' : kind === 'ask' ? 'approb.' : 'modèle'}</span>
    <span style={{ color: '#E6EAF6' }}>{children}</span>
  </div>
);

const M5_Observer: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Observer l’agent : journaux, tokens, crédits</Title>
    <Lede>
      Menu <strong>…</strong> de la vue Chat › <strong>Show Agent Debug Logs</strong> : chaque tour, chaque outil, chaque durée.
    </Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: '#0F1530', borderRadius: 16, padding: '18px 22px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(100) }}>
      <M5LogLine t="0,0 s" kind="model">plan en 3 étapes · 1 840 tokens</M5LogLine>
      <M5LogLine t="2,1 s" kind="tool">read · src/circuit.js</M5LogLine>
      <M5LogLine t="2,4 s" kind="tool">read · test/acceptance/a5-circuit.test.js</M5LogLine>
      <M5LogLine t="9,8 s" kind="tool">edit · src/circuit.js (+92 lignes)</M5LogLine>
      <M5LogLine t="10,2 s" kind="tool">execute · npm run test:atelier5 · auto-approuvé</M5LogLine>
      <M5LogLine t="12,9 s" kind="model">2 tests rouges : PAS_VOTRE_TOUR · 6 210 tokens</M5LogLine>
      <M5LogLine t="15,0 s" kind="tool">edit · src/circuit.js (ordre des contrôles)</M5LogLine>
      <M5LogLine t="15,6 s" kind="tool">execute · npm run test:atelier5 · 35 / 35</M5LogLine>
      <M5LogLine t="16,1 s" kind="ask">git commit -am … · en attente de votre accord</M5LogLine>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="loop" tone="navy" title="Combien de tours ?" size={21} pad={20} cls={A.right} style={dl(250)}>
        Des allers-retours sans fin sur le même test : arrêtez, précisez, relancez.
      </Card>
      <Card icon="gauge" tone="violet" title="Combien de tokens ?" size={21} pad={20} cls={A.right} style={dl(400)}>
        Indicateur de contexte, et coût du modèle au survol du sélecteur.
      </Card>
      <Card icon="eye" tone="green" title="Qu’a-t-il vraiment lu ?" size={21} pad={20} cls={A.right} style={dl(550)}>
        Un fichier attendu absent du journal : il a travaillé à l’aveugle.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 820, ...dl(700) }}>
      Journal illustratif. Ou commande « Developer: Open Agent Debug Logs ».
    </Hint>
  </Frame>
);

// ─── Atelier 5 ──────────────────────────────────────────────────────────────
const M5_Lab: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="Régler le harnais, puis livrer le circuit"
    defi="harnais"
    who="Individuel · 35 min"
    objective={
      <>
        Décider <strong>ce que l’agent a le droit de faire</strong> (outils, auto-approbation, permissions), puis lui faire livrer <Ic>src/circuit.js</Ic> et <strong>observer</strong> sa boucle dans les journaux.
      </>
    }
    where={
      <>
        <PathChip size={19}>.vscode/settings.json</PathChip> · règles du terminal
        <br />
        <PathChip size={19}>src/circuit.js</PathChip>
        <br />
        JOURNAL.md · outils, appels, approbations
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="l5a" size={21}>test:atelier5 : 35 tests verts</CheckItem>
        <CheckItem id="l5b" size={21}>npm test passe sans demander, git push demande</CheckItem>
        <CheckItem id="l5c" size={21}>Appels d’outils comptés dans les journaux</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (règles vertes ?) et 25 min (circuit livré ?)."
  >
    <WStep n={1}>Permissions manuelles ; Customizations › Tools : gardez lire, chercher, éditer, terminal. Notez le nombre d’outils.</WStep>
    <WStep n={2}>
      Règles <Ic>chat.tools.terminal.autoApprove</Ic> : les tests passent seuls, <Ic>git push</Ic>, suppressions et <Ic>npm install</Ic> demandent toujours.
    </WStep>
    <WStep n={3}>Mode Agent : le circuit selon son en-tête, tests après chaque modification. Puis les journaux : tours, outils, tokens.</WStep>
    <TpBonus>le bac à sable, si votre système le permet (réglages utilisateur).</TpBonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <Frame mod={5} kind="qcm">
    <Title>QCM · Module 5 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Qui lance réellement npm test quand l’agent « décide » de tester ?" explain="Le modèle demande l’outil ; le harnais vérifie la permission, exécute la commande et renvoie la sortie au modèle.">
        <QOpt>Le modèle de langage</QOpt>
        <QOpt ok>Le harnais, après vérification de la permission</QOpt>
        <QOpt>GitHub, dans le cloud</QOpt>
      </QuizQ>
      <QuizQ q="Quelle règle d’auto-approbation est dangereuse ?" explain="« npm » approuve n’importe quelle commande npm, y compris npm install d’un paquet inconnu. Une règle précise, ou une règle false, protège.">
        <QOpt ok>"npm": true</QOpt>
        <QOpt>"/^npm test$/": true</QOpt>
        <QOpt>"/^git push\\b/": false</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi retirer des outils inutiles à l’agent ?" explain="Chaque outil disponible occupe du contexte à chaque tour et multiplie les choix possibles : moins d’outils, moins de tokens et de meilleures décisions.">
        <QOpt>Pour que l’agent aille plus vite sur le réseau</QOpt>
        <QOpt>Parce que les outils sont payants un par un</QOpt>
        <QOpt ok>Moins de contexte consommé, de meilleurs choix d’outil</QOpt>
      </QuizQ>
      <QuizQ q="Approbations et bac à sable, c’est…" explain="L’approbation décide si une commande part ; le bac à sable limite ce qu’elle peut toucher (fichiers, réseau) une fois partie.">
        <QOpt>La même chose sous deux noms</QOpt>
        <QOpt ok>Deux protections complémentaires</QOpt>
        <QOpt>Inutiles avec le modèle Auto</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M5_Pause: Page = () => <BreakPage mod={5} title="Pause" back="Reprise à 10 h 50 : des agents et des skills pour refactorer un code de 2019." minutes={15} />;

// @@PAGES-BEGIN
export const __pages = [M5_Divider, M5_Boucle, M5_Outils, M5_Permissions, M5_AutoApprove, M5_Sandbox, M5_Compaction, M5_Observer, M5_Lab, M5_Qcm, M5_Pause];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 5 · 9:15

OBJECTIF — Annoncer le module : régler l’agent avant de lui confier une tâche.

DIRE — « Module 5 : le harnais. Hier, nous l’avons nommé ; aujourd’hui, on ouvre le capot. Avant de confier une tâche à un agent, on décide ce qu’il a le droit de faire. Puis on regarde ce qu’il fait vraiment. »

TRANSITION — « D’abord : un tour de boucle, qui fait quoi ? »`,
  `⏱ 6 min · UN TOUR DE BOUCLE

OBJECTIF — Séparer le rôle du modèle de celui du harnais.

DIRE — « À gauche, le modèle : il reçoit un texte et renvoie soit une réponse, soit “appelle tel outil avec tels arguments”. Il n’ouvre aucun fichier, il ne lance aucune commande. À droite, le harnais. À chaque tour, il assemble le contexte : instructions, fichiers, historique, et la liste des outils. »

→ beat 1 « Le modèle demande un outil : le harnais vérifie la permission, puis l’exécute, dans le bac à sable s’il est activé. »

→ beat 2 « La sortie de l’outil, par exemple un test rouge, entre dans le contexte, et on recommence. »

→ beat 3 « Et il compacte quand c’est plein, et il trace chaque appel. Conséquence : même modèle, autre harnais, autre comportement. »

TRANSITION — « Ces outils, quels sont-ils ? »`,
  `⏱ 6 min · LES OUTILS (démo)

OBJECTIF — Présenter les familles d’outils et l’endroit où on les choisit.

DIRE — « Les outils sont les mains et les yeux de l’agent. Lire, chercher, modifier, exécuter, le web, déléguer à un sous-agent. Ils viennent du harnais, d’un serveur MCP, ou d’une extension. Retenez ces noms courts : read, search, edit, execute ; vous les écrirez dans vos agents tout à l’heure. »

DIRE — « On les choisit dans Customizations, onglet Tools. Pourquoi en retirer ? Chaque outil disponible occupe du contexte à chaque tour, et trop de choix en rend certains mauvais. »

ANIMATION — En partage d’écran : ouvrir l’onglet Tools, décocher le groupe web, montrer le compteur d’outils.

TRANSITION — « Quand l’agent veut utiliser un outil, qui dit oui ? »`,
  `⏱ 6 min · APPROBATIONS ET PERMISSIONS

OBJECTIF — Présenter les trois niveaux de permission et le réflexe de lecture d’une demande.

DIRE — « Trois niveaux, dans la zone de saisie. Manual permissions, par défaut : l’agent vous demande avant toute action risquée. C’est notre réglage. Allow all : plus de questions, vous découvrez après. Autopilot : il va jusqu’au bout sans vous ; seulement dans un environnement isolé et jetable. »

→ beat 1 « Une demande d’approbation se lit : quelle commande, dans quel dossier, pour quoi faire. “Toujours autoriser” vaut pour la suite : jamais par réflexe. Et votre organisation peut imposer un niveau ou interdire les plus permissifs. »

TRANSITION — « Entre tout demander et ne rien demander, il y a une voie : auto-approuver ce qui est sûr. »`,
  `⏱ 7 min · AUTO-APPROBATION DU TERMINAL (démo)

OBJECTIF — Apprendre à écrire des règles d’auto-approbation précises.

DIRE — « Le terminal est un seul outil, mais VS Code évalue chaque commande à part. Vous écrivez des règles dans les réglages : true, la commande passe sans demander ; ici, seulement les tests. Une clé entre barres obliques est une expression régulière. »

→ beat 1 « false : la commande demande toujours votre accord. Une règle false l’emporte sur une règle true. Attention : elle demande, elle ne bloque pas. »

→ beat 2 « Le piège : “npm” à true approuve aussi npm install d’un paquet inconnu. Soyez précis. Et une commande composée n’est approuvée que si chaque morceau l’est. À l’atelier, des tests vérifient vos règles. »

ANIMATION — Précision : dans le harnais Copilot, des commandes en lecture seule ou exécutées dans le bac à sable peuvent être approuvées par le harnais avant vos règles.

TRANSITION — « L’approbation décide si une commande part. Et une fois partie ? »`,
  `⏱ 5 min · LE BAC À SABLE

OBJECTIF — Expliquer le bac à sable, ses prérequis, et sa complémentarité avec les approbations.

DIRE — « Le bac à sable enferme les commandes de l’agent : il ne peut écrire que dans les dossiers autorisés, et n’atteindre que les sites autorisés, voire aucun. Il a des prérequis : macOS 15, Linux ou WSL 2, et sous Windows 11 récent, c’est encore expérimental. Si l’isolation est impossible, la commande ne se lance pas du tout. »

DIRE — « Deux protections différentes : l’approbation décide si une commande part ; le bac à sable limite ce qu’elle peut faire une fois partie. »

ANIMATION — À l’atelier, le bac à sable est un bonus : seulement si le poste le permet, et dans les réglages utilisateur.

TRANSITION — « Autre limite physique : la place dans le contexte. »`,
  `⏱ 4 min · COMPACTION

OBJECTIF — Montrer ce qui se passe quand la fenêtre se remplit, et les parades.

DIRE — « À chaque tour, les sorties des outils s’ajoutent au contexte : un test rouge, quatre cents lignes de fichier… »

→ beat 1 « Quand c’est plein, le harnais résume les anciens tours. »

→ beat 2 « Un détail peut se perdre dans le résumé. Vos parades : une session par tâche, /compact pour résumer vous-même, une nouvelle session pour changer de sujet. Et les sous-agents, qui travaillent dans leur propre contexte : on les voit au Module 6. »

TRANSITION — « Comment savoir ce que l’agent a vraiment fait ? »`,
  `⏱ 5 min · OBSERVER (démo)

OBJECTIF — Apprendre à lire les journaux de l’agent : tours, outils, tokens.

DIRE — « Menu trois points de la vue Chat, Show Agent Debug Logs. Chaque tour, chaque outil, chaque durée. Ici : il lit le fichier et les tests, il écrit, il lance les tests, auto-approuvés grâce à nos règles ; deux tests rouges ; il corrige l’ordre des contrôles ; tout passe ; et pour le commit, il attend mon accord. »

DIRE — « Trois questions à poser au journal : combien de tours ? combien de tokens ? qu’a-t-il vraiment lu ? »

ANIMATION — Ouvrir les vrais journaux d’une session de ma copie. Le journal de la page est illustratif.

TRANSITION — « À vous : trente-cinq minutes. »`,
  `⏱ 35 min · ATELIER 5 (individuel) · 9:55

OBJECTIF — Régler le harnais, faire livrer le circuit de signature, observer la boucle.

DIRE — « Trente-cinq minutes. D’abord les droits : permissions manuelles, et seulement quatre familles d’outils. Puis vos règles d’auto-approbation : les tests passent seuls, git push, les suppressions et npm install demandent toujours ; les tests a5-harnais vérifient vos règles. Ensuite l’agent livre le circuit. Enfin, les journaux : notez tours, outils, approbations. »

ACTION — Coller dans le Chat le prompt de l’étape 5 du README de l’atelier.

ANIMATION — Points d’étape à 15 et 25 min. Pièges : « npm »: true ; « Allow all » choisi pour aller vite ; signer qui accepte n’importe quel signataire en séquentiel (ordre des contrôles) ; le circuit d’origine modifié au lieu d’une copie. Bac à sable activé sur un Windows non compatible : plus aucune commande ne part, le retirer des réglages utilisateur. Atelier non fini : npm run reprise -- 5.

TRANSITION — « QCM, puis pause. »`,
  `⏱ 5 min · QCM MODULE 5 (vote oral)

OBJECTIF — Vérifier : rôle du harnais, règles d’auto-approbation, outils, bac à sable.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Pause. »`,
  `⏱ 15 min · PAUSE · 10:35

DIRE — « Quinze minutes de pause. Reprise à 10 h 50 : vous allez créer votre premier agent personnalisé, et sa skill, pour refactorer un code de 2019. »`,
];
// @@NOTES-END
