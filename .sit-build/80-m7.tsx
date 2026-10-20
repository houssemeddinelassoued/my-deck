// ─── Module 7 · Automatiser les tâches administratives ──────────────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title={
      <>
        Automatiser les tâches
        <br />
        administratives
      </>
    }
    sub="Ne plus refaire à la main ce qui revient chaque semaine : des modèles, un agent, des flux, et des scripts que l’IA écrit pour vous."
    dur="14:00 – 16:30 · pause incluse"
    labs={
      <>
        <Tag tone="green" size={19}>
          Lab 7.1 · agent support
        </Tag>
        <Tag tone="green" size={19}>
          Lab 7.2 · flux de reporting
        </Tag>
        <Tag tone="green" size={19}>
          Lab 7.3 · script en vibe coding
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Repérer ce qui s’automatise</SecItem>
    <SecItem n={2}>Modèles et agents sans code</SecItem>
    <SecItem n={3}>Des flux décrits en français</SecItem>
    <SecItem n={4}>Des scripts en vibe coding, sans apprendre à coder</SecItem>
    <SecItem n={5}>Garder la main · atelier sur votre tâche</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Repérer les tâches automatisables (interactif) ─────────────────────────
const M7_CRIT = ['Elle revient au moins chaque semaine', 'Elle prend plus de dix minutes', 'Ses règles sont stables et explicables', 'Ses données sont déjà numériques', 'Une erreur serait sans gravité'];
const M7_PRESETS: Record<string, boolean[]> = {
  rep: [true, true, true, true, true],
  mfa: [true, false, true, true, true],
  adm: [false, true, false, true, false],
};

const M7_Reperer: Page = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const tone: Tone = n >= 4 ? 'green' : n >= 3 ? 'yellow' : 'coral';
  const verdict = n >= 4 ? 'Excellente candidate : automatisez-la' : n >= 3 ? 'Possible : avec une validation humaine' : 'Gardez-la manuelle, ou assistée seulement';
  return (
    <Frame mod={7} kind="exercice">
      <Title>Cette tâche mérite-t-elle d’être automatisée ?</Title>
      <Lede>Cinq questions. Testez les trois exemples, puis une tâche à vous.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, display: 'flex', gap: 12 }}>
        <Btn size={20} ghost icon="chart" onClick={() => setOn(M7_PRESETS.rep)}>
          Reporting du lundi
        </Btn>
        <Btn size={20} ghost icon="key" onClick={() => setOn(M7_PRESETS.mfa)}>
          Réponses « nouveau téléphone »
        </Btn>
        <Btn size={20} ghost icon="shield" onClick={() => setOn(M7_PRESETS.adm)}>
          Validation des accès administrateur
        </Btn>
        <Btn size={20} ghost tone="grey" icon="reset" onClick={() => setOn([false, false, false, false, false])} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 360, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 24, ...dl(100) }}>
        <Toggle on={on[0]} onChange={() => flip(0)} label={M7_CRIT[0]} size={26} tone="green" />
        <Toggle on={on[1]} onChange={() => flip(1)} label={M7_CRIT[1]} size={26} tone="green" />
        <Toggle on={on[2]} onChange={() => flip(2)} label={M7_CRIT[2]} size={26} tone="green" />
        <Toggle on={on[3]} onChange={() => flip(3)} label={M7_CRIT[3]} size={26} tone="green" />
        <Toggle on={on[4]} onChange={() => flip(4)} label={M7_CRIT[4]} size={26} tone="green" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1170, top: 360, width: 630, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 20, boxShadow: `inset 0 0 0 3px ${T[tone].bd}`, padding: '30px 34px', ...dl(200) }}>
        <Eyebrow c={T[tone].fg} size={20}>
          Score
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, color: STRONG[tone] === C.yellow ? C.amber : STRONG[tone] }}>{n}</span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: C.faint }}>/ 5</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 28, fontWeight: 700, lineHeight: 1.3, color: T[tone].fg }}>{verdict}</div>
      </div>
    </Frame>
  );
};

// ─── L'échelle d'automatisation ─────────────────────────────────────────────
const M7Rung = ({ n, icon, tone, title, ex, beat }: { n: number; icon: IconName; tone: Tone; title: string; ex: string; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: 120 + (n - 1) * 300, top: 760 - n * 98, width: 470, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 -5px 0 ${STRONG[tone]}`, padding: '14px 18px' }}>
    <IconTile name={icon} tone={tone} size={52} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>
        {n}. {title}
      </div>
      <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.3 }}>{ex}</div>
    </div>
  </div>
);

const M7_Echelle: Page = () => (
  <Frame mod={7} beats={5}>
    <Title>L’échelle de l’automatisation</Title>
    <Lede>Chaque marche fait gagner plus de temps, et demande plus de rigueur. On monte une marche à la fois.</Lede>
    <M7Rung beat={1} n={1} icon="note" tone="blue" title="Prompt enregistré" ex="On ne réécrit plus la demande" />
    <M7Rung beat={2} n={2} icon="folder" tone="violet" title="Modèle ou projet" ex="Instructions et documents réutilisés" />
    <M7Rung beat={3} n={3} icon="bot" tone="teal" title="Agent" ex="Il répond à la place de l’équipe" />
    <M7Rung beat={4} n={4} icon="route" tone="green" title="Flux" ex="Il se déclenche tout seul" />
    <M7Rung beat={5} n={5} icon="terminal" tone="navy" title="Script" ex="Il agit sur les systèmes" />
    <div className={b.fade(5)} style={{ position: 'absolute', left: 120, top: 800, width: 1680, display: 'flex', justifyContent: 'space-between', fontFamily: display, fontWeight: 700, fontSize: 21, letterSpacing: '0.08em' }}>
      <span style={{ color: T.green.fg }}>◀ RAPIDE, SANS RISQUE</span>
      <span style={{ color: T.coral.fg }}>PLUS DE GAIN, PLUS DE CONTRÔLES ▶</span>
    </div>
  </Frame>
);

// ─── Modèles réutilisables ──────────────────────────────────────────────────
const M7_Modeles: Page = () => (
  <Frame mod={7}>
    <Title>Marches 1 et 2 : des modèles qui travaillent pour l’équipe</Title>
    <Lede>Claire crée un projet « Reporting Orvalis » dans Claude. Chaque lundi, elle y dépose l’export, et c’est tout.</Lede>
    <AppWin id="claude" title="Projet · Reporting Orvalis" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <Eyebrow c={C.muted} size={17}>
        Instructions du projet
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.5, color: C.ink }}>
        Tu prépares le reporting hebdomadaire du support d’Orvalis. À chaque export déposé : vérifie la qualité des données, calcule les cinq indicateurs
        selon nos définitions, compare avec la semaine précédente, signale les trois plus forts écarts. Montre tes calculs. Commentaire de dix lignes au
        maximum, sans jargon.
      </div>
      <Eyebrow c={C.muted} size={17} style={{ marginTop: 18 }}>
        Connaissances du projet
      </Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <PathChip>definitions-indicateurs.docx</PathChip>
        <PathChip>objectifs-SLA-2026.xlsx</PathChip>
        <PathChip>modele-reporting.docx</PathChip>
      </div>
    </AppWin>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="note" tone="blue" title="Côté Copilot" size={22} cls={A.right} style={dl(200)}>
        Les prompts enregistrés et partagés jouent le même rôle pour les demandes courtes.
      </Card>
      <Card icon="users" tone="violet" title="Partager" size={22} cls={A.right} style={dl(350)}>
        Un projet partagé avec l’équipe : la méthode survit aux congés et aux départs.
      </Card>
    </div>
  </Frame>
);

// ─── Agent Copilot ──────────────────────────────────────────────────────────
const M7Field = ({ label, children, d }: { label: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>{label}</div>
    <div style={{ marginTop: 6, background: '#fff', borderRadius: 10, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '10px 14px', fontSize: 21, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M7_Agent: Page = () => (
  <Frame mod={7}>
    <Title>Marche 3 : un agent sans code, en dix minutes</Title>
    <Lede>Dans Microsoft 365 Copilot, on décrit l’agent en français et on lui donne ses sources. Pas une ligne de code.</Lede>
    <AppWin id="copilot" title="Créer un agent" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M7Field label="Nom" d={100}>
          Assistant support Orvalis
        </M7Field>
        <M7Field label="Instructions" d={200}>
          Aide les salariés à résoudre les problèmes informatiques courants. Réponds uniquement à partir des articles fournis. Si la réponse n’y est pas,
          dis-le et propose d’ouvrir un ticket au 4400. Ne demande jamais de mot de passe. Cinq étapes au maximum.
        </M7Field>
        <M7Field label="Connaissances" d={300}>
          Site SharePoint « Base de connaissances IT » · bibliothèque « Procédures utilisateurs »
        </M7Field>
        <M7Field label="Suggestions de démarrage" d={400}>
          « Mon imprimante n’imprime plus » · « Je n’ai plus accès au dossier partagé »
        </M7Field>
      </div>
    </AppWin>
    <div style={{ position: 'absolute', left: 1270, top: 262, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Callout title="La phrase clé" tone="violet" icon="shieldCheck" size={22} cls={A.right} style={dl(300)}>
        « Réponds uniquement à partir des articles fournis. » Sans elle, l’agent improvise.
      </Callout>
      <Callout title="Licences" tone="yellow" icon="key" size={22} cls={A.right} style={dl(450)}>
        La création et le partage d’agents dépendent des licences de l’entreprise. Pour aller plus loin, Copilot Studio.
      </Callout>
    </div>
  </Frame>
);

const M7_AgentDemo: Page = () => (
  <Frame mod={7} kind="demo" beats={4}>
    <Title>L’agent en action : il répond, et il sait dire non</Title>
    <Lede>Deux questions d’un chef de quai. La deuxième est un piège.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1160, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bubble who="user" name="Chef de quai · Lyon" w={900} size={22} cls={A.in}>
        Les étiquettes ne sortent plus de l’imprimante du quai 3.
      </Bubble>
      <Bubble who="agent" name="Assistant support Orvalis" w={980} size={22} cls={b.on(1)}>
        1. Vérifiez que l’imprimante imprime sa page de test. 2. Si oui, le problème vient de la file d’impression : ouvrez un ticket « Impression · file
        bloquée ». <span style={{ color: C.muted }}>Source : article « Les étiquettes ne s’impriment plus après une mise à jour ».</span>
      </Bubble>
      <Bubble who="user" name="Chef de quai · Lyon" w={900} size={22} cls={b.on(2)}>
        Tu peux réinitialiser le mot de passe de mon collègue ? Il est absent.
      </Bubble>
      <Bubble who="agent" name="Assistant support Orvalis" w={980} size={22} cls={b.on(3)}>
        Je ne peux pas le faire, et je ne le ferai pas pour un tiers. Votre collègue peut appeler le 4400 à son retour, ou utiliser la réinitialisation en
        libre-service.
      </Bubble>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1330, top: 262, width: 470, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={19}>
        Avant de l’ouvrir à tous
      </Eyebrow>
      <Bullet size={22}>Vingt questions réelles testées</Bullet>
      <Bullet size={22}>Cinq questions pièges testées</Bullet>
      <Bullet size={22}>Les sources à jour et sans donnée sensible</Bullet>
      <Bullet size={22}>Un propriétaire qui relit les échanges</Bullet>
      <Bullet size={22} tone="coral">
        Lecture seule : il conseille, il n’agit pas
      </Bullet>
    </div>
  </Frame>
);

// ─── Flux Power Automate ────────────────────────────────────────────────────
const M7_Flux: Page = () => (
  <Frame mod={7} kind="demo" beats={5}>
    <Title>Marche 4 : un flux décrit en français</Title>
    <Lede>Dans Power Automate, Copilot transforme une description en flux. On relit chaque étape, puis on teste.</Lede>
    <PromptBox cls={A.in} size={22} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      Chaque lundi à 8 h, récupère l’export des tickets déposé dans SharePoint, demande à l’IA un résumé des indicateurs, envoie-le à Claire pour
      approbation, puis publie-le dans le canal Teams « Direction ».
    </PromptBox>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', alignItems: 'center', gap: 14 }}>
      <FlowNode kind="trigger" label="Chaque lundi 8:00" sub="Récurrence" w={300} cls={b.on(1)} />
      <FlowArrow w={40} cls={b.fade(2)} />
      <FlowNode kind="data" label="Fichier d’export" sub="SharePoint · Reporting" w={300} cls={b.on(2)} />
      <FlowArrow w={40} cls={b.fade(3)} />
      <FlowNode kind="ai" label="Résumé des indicateurs" sub="Étape IA · prompt de Claire" w={300} cls={b.on(3)} />
      <FlowArrow w={40} cls={b.fade(4)} />
      <FlowNode kind="human" label="Approbation" sub="Claire valide ou corrige" w={300} cls={b.on(4)} />
      <FlowArrow w={40} cls={b.fade(5)} />
      <FlowNode kind="action" label="Publication" sub="Canal Teams « Direction »" w={300} cls={b.on(5)} />
    </div>
    <div className={b.fade(5)} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(300) }}>
      <Callout title="L’étape qui compte" tone="pink" icon="humanCheck" size={24}>
        L’approbation de Claire : rien ne part à la direction sans qu’une personne ait relu. On pourra la retirer… après trois mois sans correction.
      </Callout>
    </div>
  </Frame>
);

// ─── Trois flux types ───────────────────────────────────────────────────────
const M7Chain = ({ id, children }: { id: string; children: ReactNode }) => (
  <TabPane id={id}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
  </TabPane>
);

const M7_TroisFlux: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Trois flux qui reviennent dans toutes les équipes IT</Title>
    <Lede>Cliquez un onglet. Même code couleur partout : déclencheur, données, IA, validation, action.</Lede>
    <Tabs initial="f1" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        <TabBtn id="f1" icon="inbox">
          Tri des demandes
        </TabBtn>
        <TabBtn id="f2" icon="chart">
          Rapport hebdomadaire
        </TabBtn>
        <TabBtn id="f3" icon="user">
          Arrivée d’un collaborateur
        </TabBtn>
      </div>
      <M7Chain id="f1">
        <FlowNode kind="trigger" label="E-mail reçu" sub="support@orvalis" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="ai" label="Classer et résumer" sub="catégorie, urgence" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="cond" label="Urgent ?" sub="urgence = 3" w={260} />
        <FlowArrow w={36} />
        <FlowNode kind="action" label="Ticket créé" sub="+ alerte Teams si urgent" w={300} />
      </M7Chain>
      <M7Chain id="f2">
        <FlowNode kind="trigger" label="Vendredi 16:00" sub="Récurrence" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="data" label="Tickets de la semaine" sub="Export" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="ai" label="Faits marquants" sub="cinq lignes" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="human" label="Relecture" sub="responsable support" w={300} />
      </M7Chain>
      <M7Chain id="f3">
        <FlowNode kind="trigger" label="Formulaire RH" sub="nouvel arrivant" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="ai" label="Check-list" sub="selon le poste et le site" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="action" label="Tâches créées" sub="Planner, une par action" w={300} />
        <FlowArrow w={36} />
        <FlowNode kind="human" label="Accès validés" sub="par le manager" w={300} />
      </M7Chain>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 680, width: 1680, display: 'flex', gap: 12, flexWrap: 'wrap', ...dl(400) }}>
      <NodeChip kind="trigger" />
      <NodeChip kind="data" />
      <NodeChip kind="ai" />
      <NodeChip kind="cond" />
      <NodeChip kind="human" />
      <NodeChip kind="action" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 780, width: 1680, ...dl(500) }}>
      <Callout title="Règle" tone="coral" icon="lock" size={23}>
        La création de comptes et les droits d’accès restent validés par une personne, même dans un flux automatisé.
      </Callout>
    </div>
  </Frame>
);

// ─── Le vibe coding ─────────────────────────────────────────────────────────
const M7Loop = ({ x, y, n, icon, tone, title, sub, beat }: { x: number; y: number; n: number; icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x - 150, top: y - 70, width: 300, boxSizing: 'border-box', textAlign: 'center' }}>
    <IconTile name={icon} tone={tone} size={64} solid style={{ margin: '0 auto' }} />
    <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>
      {n}. {title}
    </div>
    <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M7_Vibe: Page = () => (
  <Frame mod={7} beats={5}>
    <Title>Marche 5 : le vibe coding, ou programmer en français</Title>
    <Lede>Vous décrivez le résultat, l’IA écrit le code et l’explique. Vous ne codez pas ; vous restez responsable du test.</Lede>
    <svg width={900} height={640} viewBox="0 0 900 640" style={{ position: 'absolute', left: 120, top: 250 }} aria-hidden>
      <ellipse cx={450} cy={330} rx={300} ry={230} fill="none" stroke={C.rule} strokeWidth={4} strokeDasharray="10 12" className={A.march} />
    </svg>
    <M7Loop beat={1} x={570} y={330} n={1} icon="chat" tone="violet" title="Décrire" sub="le résultat, en français" />
    <M7Loop beat={2} x={870} y={460} n={2} icon="sparkles" tone="blue" title="L’IA écrit" sub="le script, commenté" />
    <M7Loop beat={3} x={760} y={800} n={3} icon="book" tone="teal" title="Expliquer" sub="ligne par ligne" />
    <M7Loop beat={4} x={380} y={800} n={4} icon="play" tone="green" title="Tester" sub="lecture seule d’abord" />
    <M7Loop beat={5} x={270} y={460} n={5} icon="bug" tone="coral" title="Corriger" sub="coller l’erreur" />
    <div style={{ position: 'absolute', left: 1120, top: 280, width: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card icon="target" tone="green" title="Pour quoi faire ?" size={23} cls={A.right} style={dl(200)}>
        Inventaires, exports, contrôles, consolidations de fichiers, rapports : des tâches de lecture et de mise en forme.
      </Card>
      <Card icon="lock" tone="coral" title="Pas pour quoi ?" size={23} cls={A.right} style={dl(350)}>
        Ce qui modifie la production sans relecture d’un administrateur. Les quatre règles du module 4 s’appliquent.
      </Card>
    </div>
  </Frame>
);

// ─── Le prompt de vibe coding ───────────────────────────────────────────────
const M7Part = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <span style={{ flex: 'none', width: 190, marginTop: 2 }}>
      <Tag tone={tone} size={18}>
        {label}
      </Tag>
    </span>
    <span style={{ fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</span>
  </div>
);

const M7_VibePrompt: Page = () => (
  <Frame mod={7}>
    <Title>Le prompt de Thomas : six ingrédients, zéro code</Title>
    <Lede>Il veut chaque matin l’espace libre de tous les serveurs. Il décrit ce qu’il veut, pas comment le faire.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.navy}`, padding: '26px 34px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M7Part tone="blue" label="Objectif">
        Je veux connaître l’espace libre de tous les disques de nos serveurs Windows.
      </M7Part>
      <M7Part tone="violet" label="Environnement">
        Windows Server, PowerShell 5.1, je lance le script depuis mon poste avec mon compte d’exploitation.
      </M7Part>
      <M7Part tone="teal" label="Entrée">
        La liste des serveurs est dans un fichier serveurs.txt, un nom par ligne.
      </M7Part>
      <M7Part tone="green" label="Sortie">
        Un fichier CSV pour Excel dans C:\Rapports : serveur, disque, Go libres, % libre, trié du plus plein au moins plein.
      </M7Part>
      <M7Part tone="coral" label="Sécurité">
        Le script ne doit rien modifier sur les serveurs : uniquement de la lecture.
      </M7Part>
      <M7Part tone="yellow" label="Pédagogie">
        Je ne sais pas programmer : commente chaque ligne en français et explique-moi comment le lancer.
      </M7Part>
    </div>
  </Frame>
);

// ─── Le script obtenu ───────────────────────────────────────────────────────
const PsL = ({ n, hl, children }: { n: number; hl?: number; children?: ReactNode }) => (
  <div data-beat={hl} style={{ display: 'flex', gap: 16, borderRadius: 6 }}>
    <span style={{ width: 26, flex: 'none', textAlign: 'right', color: '#5C668A' }}>{n}</span>
    <span>{children}</span>
  </div>
);

const M7Why = ({ beat, lines, children }: { beat: number; lines: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 18, fontWeight: 700, color: T.navy.fg, background: T.navy.bg, borderRadius: 8, padding: '2px 8px' }}>{lines}</span>
    <span style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M7_Script: Page = () => (
  <Frame mod={7} kind="demo" beats={4}>
    <Title>Le script obtenu, et son explication en français</Title>
    <Lede>Thomas ne l’a pas écrit. Mais il peut dire ce que fait chaque ligne : c’est la condition pour le lancer.</Lede>
    <CodeDark file="inventaire-disques.ps1" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1010 }}>
      <PsL n={1}>
        <Cc># Inventaire de l’espace disque · lecture seule</Cc>
      </PsL>
      <PsL n={2} hl={1}>
        <Cf>$serveurs</Cf> = <Cf>Get-Content</Cf> .\serveurs.txt
      </PsL>
      <PsL n={3} hl={2}>
        <Cf>$resultat</Cf> = <Ck>foreach</Ck> (<Cf>$s</Cf> <Ck>in</Ck> <Cf>$serveurs</Cf>) {'{'}
      </PsL>
      <PsL n={4} hl={2}>
        {'  '}
        <Cf>Get-CimInstance</Cf> Win32_LogicalDisk <Cn>-ComputerName</Cn> <Cf>$s</Cf> <Cn>-Filter</Cn> <Cs>"DriveType=3"</Cs> |
      </PsL>
      <PsL n={5} hl={3}>
        {'    '}
        <Cf>Select-Object</Cf> @{'{'}n=<Cs>'Serveur'</Cs>;e={'{'}
        <Cf>$s</Cf>
        {'}}'}, DeviceID,
      </PsL>
      <PsL n={6} hl={3}>
        {'      '}@{'{'}n=<Cs>'Libre_Go'</Cs>;e={'{'}[math]::Round(<Cf>$_</Cf>.FreeSpace/1GB,1){'}}'},
      </PsL>
      <PsL n={7} hl={3}>
        {'      '}@{'{'}n=<Cs>'Libre_%'</Cs>;e={'{'}[math]::Round(100*<Cf>$_</Cf>.FreeSpace/<Cf>$_</Cf>.Size,1){'}}'}
      </PsL>
      <PsL n={8}>{'}'}</PsL>
      <PsL n={9} hl={4}>
        <Cf>$resultat</Cf> | <Cf>Sort-Object</Cf> <Cs>'Libre_%'</Cs> |
      </PsL>
      <PsL n={10} hl={4}>
        {'  '}
        <Cf>Export-Csv</Cf> C:\Rapports\inventaire-disques.csv <Cn>-Delimiter</Cn> <Cs>';'</Cs> <Cn>-Encoding</Cn> UTF8
      </PsL>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M7Why beat={1} lines="2">
        Lit la liste des serveurs, un nom par ligne.
      </M7Why>
      <M7Why beat={2} lines="3-4">
        Pour chaque serveur, demande la liste des disques locaux. Uniquement de la lecture.
      </M7Why>
      <M7Why beat={3} lines="5-7">
        Garde le nom du serveur, la lettre du disque, l’espace libre en Go et en pourcentage.
      </M7Why>
      <M7Why beat={4} lines="9-10">
        Trie du plus plein au moins plein, puis enregistre un fichier lisible dans Excel.
      </M7Why>
    </div>
    <div className={b.fade(4)} style={{ position: 'absolute', left: 120, top: 770, width: 1010, ...dl(300) }}>
      <Callout title="Vérification de Thomas" tone="green" icon="checkCircle" size={22}>
        Aucun verbe qui modifie : Get, Select, Sort, Export vers son propre poste. Il peut le tester.
      </Callout>
    </div>
  </Frame>
);

// ─── Quand ça plante ────────────────────────────────────────────────────────
const M7_Erreur: Page = () => (
  <Frame mod={7} beats={3}>
    <Title>Ça plante ? On colle l’erreur, on ne la décode pas</Title>
    <Lede>Premier essai : un message rouge. Thomas ne cherche pas à comprendre seul, il le donne à l’IA.</Lede>
    <CodeDark file="PowerShell" size={21} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <span style={{ color: '#FF8A8A' }}>
        Export-Csv : Impossible de trouver une partie du chemin d’accès « C:\Rapports\inventaire-disques.csv ».
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 120, top: 400, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bubble who="user" name="Thomas" w={1200} size={22} cls={b.on(1)}>
        J’ai cette erreur en lançant ton script : [message collé]. Explique-moi simplement et corrige.
      </Bubble>
      <Bubble who="agent" name="Claude" w={1300} size={22} cls={b.on(2)}>
        Le dossier C:\Rapports n’existe pas sur votre poste : le script ne peut pas y enregistrer le fichier. Deux solutions : créez le dossier vous-même,
        ou j’ajoute au début du script une ligne qui le crée s’il manque.
      </Bubble>
      <Bubble who="user" name="Thomas" w={1200} size={22} cls={b.on(3)}>
        Ajoute la ligne. Et dis-moi : est-ce que cette ligne modifie quelque chose ?
      </Bubble>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 850, width: 1680, ...dl(300) }}>
      <Callout title="Le bon réflexe" tone="violet" icon="eye" size={23}>
        La correction ajoute une création de dossier : c’est une modification, sans risque ici, mais Thomas l’a vue et l’a demandée.
      </Callout>
    </div>
  </Frame>
);

// ─── Le résultat ────────────────────────────────────────────────────────────
const M7Csv = ({ srv, disk, go, pct, alert = false }: { srv: string; disk: string; go: string; pct: string; alert?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 200px 200px', background: alert ? T.coral.bg : '#fff', borderBottom: `1px solid ${C.rule}` }}>
    <M6Cell bad={alert}>{srv}</M6Cell>
    <M6Cell bad={alert}>{disk}</M6Cell>
    <M6Cell bad={alert}>{go}</M6Cell>
    <M6Cell bad={alert}>{pct}</M6Cell>
  </div>
);

const M7_Resultat: Page = () => (
  <Frame mod={7} beats={2}>
    <Title>Le résultat : deux serveurs à surveiller dès ce matin</Title>
    <Lede>Le CSV s’ouvre dans Excel. Une mise en forme conditionnelle sous 15 %, et le contrôle quotidien est fait.</Lede>
    <AppWin id="excel" title="inventaire-disques.csv" pad={0} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 200px 200px' }}>
        <M6Cell head>Serveur</M6Cell>
        <M6Cell head>Disque</M6Cell>
        <M6Cell head>Libre_Go</M6Cell>
        <M6Cell head>Libre_%</M6Cell>
      </div>
      <M7Csv srv="FS-03" disk="D:" go="38,1" pct="9,3" alert />
      <M7Csv srv="PRT-01" disk="C:" go="6,2" pct="12,1" alert />
      <M7Csv srv="FS-02" disk="D:" go="96,0" pct="18,8" />
      <M7Csv srv="FS-01" disk="D:" go="140,2" pct="27,4" />
      <M7Csv srv="APP-04" disk="C:" go="61,5" pct="48,0" />
    </AppWin>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1170, top: 262, width: 630 }}>
      <Callout title="FS-03 à 9,3 %" tone="coral" icon="alert" size={23}>
        Le même scénario que FS-02 se prépare peut-être. Thomas ouvre un ticket préventif, avant l’incident.
      </Callout>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1170, top: 500, width: 630, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={19}>
        Et ensuite ?
      </Eyebrow>
      <Bullet size={22}>Le planifier chaque matin à 7:00</Bullet>
      <Bullet size={22}>Envoyer le CSV par un flux, seulement s’il y a une alerte</Bullet>
      <Bullet size={22}>Le ranger dans la bibliothèque de l’équipe, avec sa fiche</Bullet>
    </div>
  </Frame>
);

// ─── Macro Excel ────────────────────────────────────────────────────────────
const M7_Macro: Page = () => (
  <Frame mod={7}>
    <Title>Même méthode pour Excel : une macro de consolidation</Title>
    <Lede>Claire reçoit un export par entrepôt. Elle veut un seul tableau. Elle décrit, l’IA écrit la macro et explique où la coller.</Lede>
    <PromptBox cls={A.in} size={21} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      Écris une macro Excel qui ouvre tous les fichiers .xlsx du dossier C:\Exports, copie leurs lignes (sans l’en-tête) à la suite dans l’onglet «
      Consolidation », puis referme chaque fichier sans l’enregistrer. Commente en français et explique où la coller.
    </PromptBox>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 820, display: 'flex', flexDirection: 'column', gap: 12, ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Où la coller : trois gestes
      </Eyebrow>
      <Bullet size={22}>
        <Kbd>Alt</Kbd> + <Kbd>F11</Kbd> ouvre l’éditeur de macros
      </Bullet>
      <Bullet size={22}>Insertion, puis Module : coller le code</Bullet>
      <Bullet size={22}>
        <Kbd>F5</Kbd> lance la macro ; enregistrer en .xlsm
      </Bullet>
    </div>
    <CodeDark file="ConsoliderExports · VBA" size={18} cls={A.right} style={{ position: 'absolute', left: 990, top: 262, width: 810, ...dl(150) }}>
      <div>
        <Ck>Sub</Ck> <Cf>ConsoliderExports</Cf>()
      </div>
      <div>
        {'  '}
        <Ck>Dim</Ck> fichier <Ck>As String</Ck>, source <Ck>As</Ck> Workbook
      </div>
      <div>
        {'  '}
        <Ck>Set</Ck> cible = ThisWorkbook.Sheets(<Cs>"Consolidation"</Cs>)
      </div>
      <div>
        {'  '}fichier = Dir(<Cs>"C:\Exports\*.xlsx"</Cs>)
      </div>
      <div>
        {'  '}
        <Ck>Do While</Ck> fichier &lt;&gt; <Cs>""</Cs>
      </div>
      <div>
        {'    '}
        <Ck>Set</Ck> source = Workbooks.Open(<Cs>"C:\Exports\"</Cs> &amp; fichier, ReadOnly:=<Ck>True</Ck>)
      </div>
      <div>
        {'    '}
        <Cc>' copie les lignes sous la dernière ligne remplie</Cc>
      </div>
      <div>{'    '}source.Sheets(1).UsedRange.Offset(1).Copy _</div>
      <div>{'      '}cible.Cells(cible.Rows.Count, 1).End(xlUp).Offset(1)</div>
      <div>
        {'    '}source.Close SaveChanges:=<Ck>False</Ck>
      </div>
      <div>{'    '}fichier = Dir()</div>
      <div>
        {'  '}
        <Ck>Loop</Ck>
      </div>
      <div>
        <Ck>End Sub</Ck>
      </div>
    </CodeDark>
    <div className={A.fade} style={{ position: 'absolute', left: 990, top: 820, width: 810, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(500) }}>
      <Icon name="bulb" size={24} color={C.violet} />
      Alternative sans macro : demandez à Copilot de vous guider dans Power Query.
    </div>
  </Frame>
);

// ─── Garder la main ─────────────────────────────────────────────────────────
const M7_GardeFous: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Garder la main : prêt pour la production ?</Title>
    <Lede>Avant qu’un script ou un flux tourne tout seul, chaque case doit être cochée. Testez avec le script de Thomas.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="gf1" size={24}>
          Je sais expliquer chaque ligne ou chaque étape
        </CheckItem>
        <CheckItem id="gf2" size={24}>
          Testé en lecture seule ou en simulation (-WhatIf)
        </CheckItem>
        <CheckItem id="gf3" size={24}>
          Testé sur un environnement de test ou un petit périmètre
        </CheckItem>
        <CheckItem id="gf4" size={24}>
          Relu par un collègue qui connaît le système
        </CheckItem>
        <CheckItem id="gf5" size={24}>
          Aucun mot de passe ni secret écrit dans le script ou le flux
        </CheckItem>
        <CheckItem id="gf6" size={24}>
          Une validation humaine avant toute action visible ou irréversible
        </CheckItem>
        <CheckItem id="gf7" size={24}>
          Il laisse une trace : journal, e-mail ou fichier de résultat
        </CheckItem>
        <CheckItem id="gf8" size={24}>
          Un propriétaire nommé et une fiche dans la bibliothèque
        </CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 262, width: 480, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Prêt pour la production ?"
          levels={[
            { min: 0, text: 'Pas encore : il reste un brouillon.', tone: 'coral' },
            { min: 5, text: 'Presque : terminez les cases manquantes.', tone: 'yellow' },
            { min: 8, text: 'Oui : il peut tourner seul.', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── Labs ───────────────────────────────────────────────────────────────────
const M7_Lab1: Page = () => (
  <LabPage
    mod={7}
    n="7.1"
    title="L’agent « assistant support »"
    defi="agent"
    who="En binôme · au choix avec le lab 7.2"
    minutes={20}
    tools="Microsoft 365 Copilot (agents) · ou un projet Claude"
    where={
      <>
        <PathChip>Orvalis/base-connaissances/</PathChip>
        <div style={{ marginTop: 10 }}>Un agent testé sur cinq questions réelles et deux questions pièges.</div>
      </>
    }
    objective={
      <>
        Créer l’agent qui répond aux questions courantes des entrepôts <strong>uniquement</strong> à partir de la base de connaissances d’Orvalis.
      </>
    }
    crit={
      <>
        <CheckItem id="l71-c1" size={22}>
          Il cite l’article source
        </CheckItem>
        <CheckItem id="l71-c2" size={22}>
          Il dit « je ne sais pas » hors de ses sources
        </CheckItem>
        <CheckItem id="l71-c3" size={22}>
          Il refuse les deux questions pièges
        </CheckItem>
      </>
    }
  >
    <div>Nom, instructions, connaissances, suggestions de démarrage. Ajoutez vos articles du lab 3.2. Puis testez : une question hors sujet, une demande de mot de passe.</div>
    <Bonus>Demandez à l’IA de générer vingt questions de test réalistes, puis passez-les à l’agent.</Bonus>
  </LabPage>
);

const M7_Lab2: Page = () => (
  <LabPage
    mod={7}
    n="7.2"
    title="Le flux de reporting automatique"
    defi="flux"
    who="En binôme · au choix avec le lab 7.1"
    minutes={20}
    tools="Power Automate avec Copilot · ou schéma papier + projet Claude"
    where={
      <>
        <PathChip>Orvalis/Reporting/</PathChip>
        <div style={{ marginTop: 10 }}>Un flux testé une fois, avec l’étape d’approbation.</div>
      </>
    }
    objective={
      <>
        Construire le flux du lundi : <strong>export → résumé IA → approbation → publication</strong>, décrit en français puis relu étape par étape.
      </>
    }
    crit={
      <>
        <CheckItem id="l72-c1" size={22}>
          Une étape d’approbation humaine
        </CheckItem>
        <CheckItem id="l72-c2" size={22}>
          Testé une fois, résultat vérifié
        </CheckItem>
        <CheckItem id="l72-c3" size={22}>
          Le prompt de l’étape IA dans la bibliothèque
        </CheckItem>
      </>
    }
  >
    <div>Décrivez le flux à Copilot dans Power Automate. Relisez chaque étape générée, corrigez, puis lancez un test avec l’export de septembre.</div>
    <Bonus>Ajoutez une condition : si le respect des SLA passe sous 90 %, une alerte part aussi au responsable support.</Bonus>
  </LabPage>
);

const M7_Lab3: Page = () => (
  <LabPage
    mod={7}
    n="7.3"
    title="Votre premier script en vibe coding"
    defi="script"
    who="Individuel · puis relecture croisée"
    minutes={25}
    tools="Claude ou Copilot · PowerShell en lecture seule · Excel"
    where={
      <>
        <PathChip>Orvalis/serveurs-test.txt</PathChip>
        <div style={{ marginTop: 10 }}>Un script commenté, testé, et sa fiche. Bonus : la macro.</div>
      </>
    }
    objective={
      <>
        Faire écrire, expliquer et tester un <strong>script d’inventaire</strong> en lecture seule : espace disque des serveurs de test, ou comptes inactifs
        depuis 90 jours.
      </>
    }
    crit={
      <>
        <CheckItem id="l73-c1" size={22}>
          Le prompt contient les six ingrédients
        </CheckItem>
        <CheckItem id="l73-c2" size={22}>
          Chaque ligne expliquée à votre voisin
        </CheckItem>
        <CheckItem id="l73-c3" size={22}>
          Aucun verbe qui modifie, vérifié
        </CheckItem>
      </>
    }
  >
    <div>Reprenez le prompt de Thomas et adaptez-le. En cas d’erreur, collez le message. Avant de lancer : « Ce script modifie-t-il quelque chose ? »</div>
    <Bonus>Faites écrire la macro de consolidation et testez-la sur les exports d’entrepôts.</Bonus>
  </LabPage>
);

const M7_Binomes: Page = () => (
  <LabPage
    mod={7}
    n="7"
    tag="Atelier"
    kind="atelier"
    title="Votre tâche, automatisée avant ce soir"
    defi="binome"
    who="En binôme · une tâche apportée par chacun"
    minutes={20}
    tools="L’outil de votre choix · règles du module 4"
    where={
      <>
        <div>Une tâche réelle (score de 3 ou plus), automatisée sur la bonne marche de l’échelle, avec sa fiche.</div>
      </>
    }
    objective={
      <>
        Chacun apporte une tâche qui revient chaque semaine. Le binôme choisit la <strong>bonne marche</strong> et la construit pour l’une des deux.
      </>
    }
    crit={
      <>
        <CheckItem id="a7-c1" size={22}>
          Score de la tâche calculé
        </CheckItem>
        <CheckItem id="a7-c2" size={22}>
          La marche la plus basse qui suffit
        </CheckItem>
        <CheckItem id="a7-c3" size={22}>
          Les garde-fous cochés
        </CheckItem>
      </>
    }
  >
    <div>Score de la tâche, choix de la marche : prompt, modèle, agent, flux ou script. Puis construction et test. Une minute de démonstration au groupe à la fin.</div>
    <Bonus>Estimez le temps gagné par mois et ajoutez-le au compteur de l’équipe.</Bonus>
  </LabPage>
);

// ─── Quiz & synthèse ────────────────────────────────────────────────────────
const M7_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz du module 7</Title>
    <QuizSeries y={200}>
      <QuizQ q="Une tâche revient chaque jour, mais une erreur serait grave. Que faites-vous ?" explain="On peut l’automatiser, mais avec une validation humaine avant l’action, ou la garder assistée.">
        <QOpt>Automatisation complète</QOpt>
        <QOpt ok>Automatisation avec validation humaine</QOpt>
        <QOpt>Surtout pas d’IA</QOpt>
      </QuizQ>
      <QuizQ q="Quelle phrase rend un agent fiable ?" explain="« Réponds uniquement à partir des articles fournis » : sans elle, l’agent improvise.">
        <QOpt>« Sois créatif »</QOpt>
        <QOpt ok>« Réponds uniquement à partir des articles fournis »</QOpt>
        <QOpt>« Réponds toujours, même sans source »</QOpt>
      </QuizQ>
      <QuizQ q="Qu’est-ce que le vibe coding ?" explain="Décrire le résultat en langage naturel ; l’IA écrit le code et l’explique ; vous restez responsable du test.">
        <QOpt>Apprendre PowerShell en accéléré</QOpt>
        <QOpt ok>Faire écrire le code par l’IA à partir d’une description</QOpt>
        <QOpt>Copier un script trouvé sur un forum</QOpt>
      </QuizQ>
      <QuizQ q="Le script affiche une erreur rouge. Le premier réflexe ?" explain="Coller le message à l’IA et demander une explication simple et une correction, puis vérifier ce que la correction modifie.">
        <QOpt>Relancer en administrateur</QOpt>
        <QOpt ok>Coller l’erreur à l’IA et demander une explication</QOpt>
        <QOpt>Supprimer les lignes qui posent problème</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M7_Synthese: Page = () => (
  <Frame mod={7} kind="synthese">
    <Title>Ce qu’on retient du module 7</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="green" d={100}>
        On automatise ce qui est <strong>fréquent, long, stable, numérique et sans gravité</strong>.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Cinq marches : <strong>prompt, modèle, agent, flux, script</strong>. La plus basse qui suffit.
      </SynthRow>
      <SynthRow n={3} tone="violet" d={300}>
        Un agent répond <strong>uniquement depuis ses sources</strong> et sait dire non.
      </SynthRow>
      <SynthRow n={4} tone="navy" d={400}>
        Vibe coding : <strong>décrire, expliquer, tester, corriger</strong>. Sans coder, sans exécuter à l’aveugle.
      </SynthRow>
      <SynthRow n={5} tone="pink" d={500}>
        Huit cases avant la production, dont la <strong>validation humaine</strong>.
      </SynthRow>
    </div>
    <PosteCard>
      Une seule automatisation le mois prochain, mais complète : testée, relue, documentée. C’est elle qui convaincra pour les suivantes.
    </PosteCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_Reperer, M7_Echelle, M7_Modeles, M7_Agent, M7_AgentDemo, M7_Flux, M7_TroisFlux, M7_Vibe, M7_VibePrompt, M7_Script, M7_Erreur, M7_Resultat, M7_Macro, M7_GardeFous, M7_Lab1, M7_Lab2, M7_Lab3, M7_Binomes, M7_Quiz, M7_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M7 · 14:00

OBJECTIF — Annoncer le module le plus attendu.

DIRE — « Les cinq personnes du groupe ont coché l’automatisation des tâches administratives. Voici le module. On va repérer ce qui s’automatise, puis monter une échelle : des modèles, un agent, des flux, et des scripts que l’IA écrit pour vous. Et vous repartirez ce soir avec une de vos tâches automatisée. »

TRANSITION — « D’abord : quelle tâche mérite d’être automatisée ? »`,
  `⏱ 5 min · REPÉRER (exercice interactif)

OBJECTIF — Donner une grille de décision simple.

DIRE — « Cinq questions : fréquente, longue, stable, numérique, sans gravité en cas d’erreur. » Cliquer « Reporting du lundi » : « 5 sur 5, on fonce. » « Réponses nouveau téléphone » : « 4 sur 5, très bonne candidate. » « Validation des accès administrateur » : « 2 sur 5 : gardez-la manuelle. » Puis demander une tâche à un participant et régler les interrupteurs ensemble.

TRANSITION — « Une tâche candidate, oui. Mais automatisée comment ? »`,
  `⏱ 4 min · L’ÉCHELLE (5 clics)

OBJECTIF — Présenter les cinq niveaux d’automatisation.

DIRE — Une marche par clic. → beat 1 : « Le prompt enregistré : on ne réécrit plus la demande. » → beat 2 : « Le modèle ou le projet : des instructions et des documents réutilisés. » → beat 3 : « L’agent : il répond à la place de l’équipe. » → beat 4 : « Le flux : il se déclenche tout seul. » → beat 5 : « Le script : il agit sur les systèmes. Plus on monte, plus on gagne, plus il faut de contrôles. La règle : la marche la plus basse qui suffit. »

TRANSITION — « Les deux premières marches. »`,
  `⏱ 3 min · MODÈLES (marches 1 et 2)

OBJECTIF — Montrer un projet réutilisable.

DIRE — « Claire crée un projet dans Claude : des instructions permanentes et trois documents de référence. Chaque lundi, elle dépose l’export, et le reporting arrive avec les calculs. Côté Copilot, les prompts enregistrés et partagés jouent le même rôle pour les demandes courtes. Et partagés avec l’équipe, ils survivent aux congés et aux départs. »

TRANSITION — « Marche 3 : l’agent. »`,
  `⏱ 4 min · AGENT SANS CODE

OBJECTIF — Montrer l’anatomie d’un agent Copilot.

DIRE — « Un agent, c’est quatre champs. Un nom. Des instructions en français. Des connaissances : un site SharePoint, une bibliothèque de documents. Et des suggestions de démarrage. La phrase clé : “Réponds uniquement à partir des articles fournis.” Sans elle, l’agent improvise. »

INSISTER — La création et le partage d’agents dépendent des licences. Si personne n’a la licence dans le groupe, le lab 7.1 se fait avec un projet Claude, sur le même principe.

TRANSITION — « Voyons-le répondre. »`,
  `⏱ 4 min · L’AGENT EN ACTION (démo, 4 clics)

OBJECTIF — Montrer une réponse sourcée et un refus.

DIRE — « Un chef de quai écrit à l’agent. » → beat 1 : « L’agent répond à partir de l’article écrit hier au lab 3.2, et cite sa source. » → beat 2 : « Deuxième question : réinitialiser le mot de passe d’un collègue. » → beat 3 : « L’agent refuse et oriente. C’est exactement ce qu’on veut. » → beat 4 : « Avant de l’ouvrir à tous : vingt questions réelles, cinq pièges, des sources propres, un propriétaire, et la lecture seule. »

TRANSITION — « Marche 4 : le flux. »`,
  `⏱ 5 min · FLUX DÉCRIT EN FRANÇAIS (démo, 5 clics)

OBJECTIF — Montrer la création d’un flux à partir d’une description.

DIRE — « Claire décrit son flux en une phrase. Copilot dans Power Automate en fait des étapes. » Une étape par clic : → beat 1 le déclencheur, → beat 2 le fichier, → beat 3 l’étape IA, → beat 4 l’approbation, → beat 5 la publication. « L’étape qui compte : l’approbation de Claire. On pourra la retirer après trois mois sans correction, pas avant. »

INSISTER — On relit chaque étape générée : le connecteur, le dossier, les destinataires. Copilot se trompe parfois de canal ou de dossier.

TRANSITION — « Trois autres flux classiques. »`,
  `⏱ 3 min · TROIS FLUX TYPES (démo)

OBJECTIF — Donner des modèles de flux pour une équipe IT.

DIRE — Cliquer chaque onglet. « Le tri des demandes : un e-mail arrive, l’IA classe, une condition repère l’urgence, un ticket est créé. Le rapport hebdomadaire. Et l’arrivée d’un collaborateur : une check-list générée selon le poste, des tâches créées, et des accès validés par le manager. La règle : les comptes et les droits restent validés par une personne. »

TRANSITION — « Dernière marche : les scripts. Et vous n’allez pas apprendre à coder. »`,
  `⏱ 4 min · LE VIBE CODING (5 clics)

OBJECTIF — Définir le vibe coding et son cadre.

DIRE — « Le vibe coding, c’est programmer en décrivant le résultat en français. » Un clic par étape de la boucle : → beat 1 décrire, → beat 2 l’IA écrit, → beat 3 expliquer, → beat 4 tester en lecture seule, → beat 5 corriger en collant l’erreur. « Pour quoi faire ? Inventaires, exports, contrôles, consolidations, rapports : de la lecture et de la mise en forme. Pas pour modifier la production sans un administrateur qui relit. »

INSISTER — Vous ne codez pas, mais vous restez responsable de ce qui s’exécute. Les quatre règles du module 4 s’appliquent.

TRANSITION — « Voyons le prompt de Thomas. »`,
  `⏱ 3 min · LE PROMPT DE VIBE CODING

OBJECTIF — Donner les six ingrédients d’un prompt de script.

DIRE — « Thomas veut l’espace libre de tous les serveurs chaque matin. Six ingrédients. L’objectif. L’environnement : Windows, PowerShell, son compte. L’entrée : un fichier de serveurs. La sortie : un CSV pour Excel, trié. La sécurité : uniquement de la lecture. Et la pédagogie : “Je ne sais pas programmer, commente chaque ligne en français.” Il décrit ce qu’il veut, jamais comment le faire. »

TRANSITION — « Voici ce que l’IA a produit. »`,
  `⏱ 4 min · LE SCRIPT ET SON EXPLICATION (4 clics)

OBJECTIF — Montrer qu’on peut comprendre un script sans savoir l’écrire.

DIRE — « Dix lignes. Thomas ne les a pas écrites, mais il peut les expliquer. » → beat 1 : « Ligne 2 : lire la liste des serveurs. » → beat 2 : « Lignes 3 et 4 : pour chaque serveur, demander la liste des disques. De la lecture. » → beat 3 : « Lignes 5 à 7 : garder le nom, la lettre, l’espace libre. » → beat 4 : « Lignes 9 et 10 : trier, enregistrer. Vérification : aucun verbe qui modifie. Il peut tester. »

INSISTER — Rappel de la page « Repérez l’invention » du module 1 : la commande inventée n’existait pas ; celle-ci utilise des commandes standard, vérifiables avec Get-Help.

TRANSITION — « Premier essai… »`,
  `⏱ 3 min · QUAND ÇA PLANTE (3 clics)

OBJECTIF — Montrer la boucle de correction par l’erreur collée.

DIRE — « Premier essai, un message rouge. Thomas ne le décode pas seul. » → beat 1 : « Il le colle et demande une explication simple. » → beat 2 : « Le dossier n’existe pas. Deux solutions proposées. » → beat 3 : « Thomas choisit, et pose la bonne question : cette ligne modifie-t-elle quelque chose ? Oui, elle crée un dossier. Sans risque ici, mais il l’a vu. »

TRANSITION — « Et le résultat ? »`,
  `⏱ 3 min · LE RÉSULTAT (2 clics)

OBJECTIF — Montrer la valeur concrète du script.

DIRE — « Le CSV s’ouvre dans Excel, trié. » → beat 1 : « FS-03 est à 9,3 % : c’est peut-être le prochain FS-02. Thomas ouvre un ticket préventif, avant l’incident. » → beat 2 : « Et ensuite : le planifier chaque matin, l’envoyer par un flux seulement s’il y a une alerte, et le ranger dans la bibliothèque. »

TRANSITION — « La même méthode marche dans Excel. »`,
  `⏱ 3 min · MACRO EXCEL

OBJECTIF — Montrer le vibe coding appliqué à Excel.

DIRE — « Claire reçoit un export par entrepôt et veut un seul tableau. Elle décrit, l’IA écrit la macro et explique où la coller : Alt F11, Insertion Module, F5. Les fichiers sources sont ouverts en lecture seule et refermés sans enregistrer. Et une alternative sans macro : Power Query, avec Copilot comme guide. »

INSISTER — Un classeur avec macro s’enregistre en .xlsm, et certaines entreprises bloquent les macros : vérifier la politique avant.

TRANSITION — « Avant de laisser tourner quoi que ce soit : les garde-fous. »`,
  `⏱ 4 min · GARDER LA MAIN (checklist interactive)

OBJECTIF — Donner la liste de contrôle avant mise en production.

DIRE — « Huit cases. On les coche ensemble pour le script de Thomas. » Cocher au fil de la discussion. « Il lui manque la relecture par un collègue et le propriétaire nommé : il n’est pas encore prêt. Une automatisation, c’est comme un collaborateur : elle a un responsable. »

TRANSITION — « À vous. Trois labs. »`,
  `⏱ 2 min + 20 min · LAB 7.1 (au choix avec 7.2, minuteur)

OBJECTIF — Créer un agent support sourcé et tester ses refus.

DIRE — « Labs 7.1 et 7.2 au choix : l’agent pour les profils support, le flux pour les profils delivery et exploitation. Pour l’agent : quatre champs, vos articles du lab 3.2, puis des tests, dont deux pièges. »

ANIMATION — Sans licence agent : même lab dans un projet Claude avec les mêmes instructions et documents.

TRANSITION — « Ou bien le flux. »`,
  `⏱ 20 min · LAB 7.2 (au choix avec 7.1, minuteur)

OBJECTIF — Construire et tester un flux de reporting avec approbation.

DIRE — « Le flux du lundi. Décrivez-le à Copilot dans Power Automate, relisez chaque étape, corrigez, testez avec l’export de septembre. L’approbation est obligatoire. »

ANIMATION — Sans accès Power Automate : dessiner le flux sur papier avec le code couleur, et faire tourner l’étape IA dans le projet Claude. Lancer le minuteur commun aux deux labs.

TRANSITION — « Pause, puis le lab 7.3 pour tout le monde : votre premier script. »`,
  `⏱ 2 min + 25 min · LAB 7.3 (minuteur)

OBJECTIF — Faire écrire, expliquer et tester un script en lecture seule.

DIRE — « Tout le monde. Reprenez le prompt de Thomas et adaptez-le : espace disque des serveurs de test, ou comptes inactifs depuis 90 jours. Faites expliquer chaque ligne à votre voisin. Avant de lancer : “Ce script modifie-t-il quelque chose ?” »

ANIMATION — Lancer le minuteur. Les curieux reprennent le prompt de Thomas tel quel ; les réguliers font l’option comptes inactifs ou la macro.

RÉPONSES TYPES — Les comptes inactifs passent par le module Active Directory : vérifier qu’il est installé sur le poste, sinon l’IA proposera une alternative ; c’est l’occasion de coller l’erreur.

TRANSITION — « Dernier atelier : votre propre tâche. »`,
  `⏱ 2 min + 20 min · ATELIER 7 EN BINÔMES (minuteur)

OBJECTIF — Automatiser une tâche réelle apportée par un participant.

DIRE — « Chacun apporte une tâche qui revient chaque semaine. Calculez le score, choisissez la marche la plus basse qui suffit, construisez, testez, cochez les garde-fous. Une minute de démonstration au groupe à la fin. »

ANIMATION — Passer dans les binômes pour arbitrer le choix de la marche. Garder 5 minutes de démonstrations.

TRANSITION — « Quiz. »`,
  `⏱ 4 min · QUIZ M7

OBJECTIF — Évaluation formative du module 7.

DIRE — « Quatre questions, vote à main levée. »

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M7 · 16:30

OBJECTIF — Ancrer les cinq idées du module.

DIRE — « On automatise ce qui est fréquent, long, stable, numérique et sans gravité. Cinq marches, la plus basse qui suffit. Un agent répond depuis ses sources et sait dire non. Le vibe coding : décrire, expliquer, tester, corriger. Et huit cases avant la production. »

TRANSITION — « Dernier module : on rassemble tout dans votre plan d’action. »`,
];
// @@NOTES-END
