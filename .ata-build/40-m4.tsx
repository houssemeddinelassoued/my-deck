// ═══ Module 4 · RPA, les robots logiciels ═══════════════════════════════════

const M4_Section: Page = () => (
  <Section n={4} title="RPA · les robots logiciels" sub="Quand il n’y a pas de connecteur, un robot fait les clics à votre place." dur="50 min" kind="demo">
    <SecItem n={1}>Comment fonctionne un robot logiciel ?</SecItem>
    <SecItem n={2}>Cas d’usage : courriels, fichiers, rapports</SecItem>
    <SecItem n={3}>Démonstration et limites</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── The robot at work (animated) ───────────────────────────────────────────
const M4_SPOTS = [
  { x: 80, y: 85 },
  { x: 600, y: 130 },
  { x: 600, y: 220 },
  { x: 600, y: 310 },
  { x: 500, y: 400 },
  { x: 500, y: 400 },
];
const M4Field = ({ label, value, on }: { label: string; value: string; on: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span style={{ width: 200, fontSize: 21, color: C.muted, textAlign: 'right' }}>{label}</span>
    <span style={{ width: 380, height: 50, boxSizing: 'border-box', padding: '0 14px', display: 'flex', alignItems: 'center', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 2px ${on ? C.blue : C.rule}`, fontFamily: mono, fontSize: 21, color: C.ink, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {on ? value : ''}
    </span>
  </div>
);

const M4_Robot: Page = () => {
  const live = useIsActivePage();
  const [s, setS] = useState(5);
  useEffect(() => {
    if (!live) {
      setS(5);
      return;
    }
    setS(0);
    const h = window.setInterval(() => setS((x) => (x + 1) % 6), 1100);
    return () => window.clearInterval(h);
  }, [live]);
  const p = M4_SPOTS[s];
  return (
    <Frame mod={4}>
      <Title>Un robot logiciel imite vos gestes à l’écran</Title>
      <Lede w={760}>Il ne « voit » pas comme vous : il repère les éléments de l’interface (champs, boutons) et agit dessus, très vite, sans se lasser.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 430, width: 760, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {(
          [
            ['search', 'blue', 'Repérer', 'un champ, un bouton, une cellule, grâce à ses propriétés (son « sélecteur »)'],
            ['pointer', 'teal', 'Agir', 'cliquer, taper, copier, ouvrir un fichier, lire un texte'],
            ['loop', 'green', 'Enchaîner', 'répéter pour chaque ligne, décider selon une condition, noter ce qu’il a fait'],
          ] as [IconName, Tone, string, string][]
        ).map(([i, t, h, d], n) => (
          <div key={h} className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(200 + n * 150) }}>
            <IconTile name={i} tone={t} size={58} />
            <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>
              <b style={{ fontFamily: display, fontSize: 30, color: C.ink }}>{h}</b> · {d}
            </div>
          </div>
        ))}
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 960, top: 230, width: 840, height: 620, borderRadius: 16, background: C.card, boxShadow: SHADOW, overflow: 'hidden', ...dl(200) }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', background: '#5C6670', color: '#fff', fontSize: 20 }}>
          <Icon name="server" size={22} color="#fff" /> GestiDossiers 2009 · Nouveau dossier client
        </div>
        <div style={{ display: 'flex', height: 568 }}>
          <div style={{ width: 200, background: C.panel, padding: '20px 16px', boxSizing: 'border-box' }}>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: s >= 1 && s <= 4 ? T.blue.bg : 'transparent', fontSize: 20, fontWeight: 600, color: C.ink }}>+ Nouveau</div>
            <div style={{ padding: '10px 12px', fontSize: 20, color: C.muted }}>Rechercher</div>
            <div style={{ padding: '10px 12px', fontSize: 20, color: C.muted }}>Rapports</div>
          </div>
          <div style={{ flex: 1, padding: '60px 0 0 0', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <M4Field label="Nom" value="Garage Duval inc." on={s >= 2 && s <= 4} />
            <M4Field label="Courriel" value="info@garageduval.ca" on={s >= 3 && s <= 4} />
            <M4Field label="Montant" value="2 480,00" on={s >= 4} />
            <div style={{ marginLeft: 216, width: 180, height: 56, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s === 5 ? C.green : C.blue, color: '#fff', fontWeight: 700, fontSize: 22, transition: 'background 300ms' }}>
              {s === 5 ? 'Enregistré ✓' : 'Enregistrer'}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${p.x}px, ${p.y}px)`, transition: `transform 700ms ${EASE}` }}>
          <Icon name="pointer" size={44} color={C.ink} style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.3))' }} />
        </div>
      </div>
    </Frame>
  );
};

// ─── UI vs API ──────────────────────────────────────────────────────────────
const M4_Api: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Par l’écran ou par la porte de service ?</Title>
    <Lede>Le robot RPA passe par l’écran, comme un humain. Un connecteur passe par l’API, la porte prévue pour les programmes.</Lede>
    <Card tone="teal" icon="bot" title="RPA · par l’écran" size={25} cls={A.left} style={{ position: 'absolute', left: 120, top: 300, width: 810, height: 470 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet tone="green">Fonctionne avec <b>n’importe quel logiciel</b>, même ancien</Bullet>
        <Bullet tone="green">Aucun accès technique à demander</Bullet>
        <Bullet tone="coral">Plus lent : il attend que l’écran s’affiche</Bullet>
        <Bullet tone="coral">Fragile : un bouton déplacé, et il se perd</Bullet>
      </div>
    </Card>
    <Card tone="violet" icon="plug" title="Connecteur · par l’API" size={25} cls={A.right} style={{ position: 'absolute', left: 990, top: 300, width: 810, height: 470 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet tone="green">Rapide et <b>robuste</b> : l’interface peut changer</Bullet>
        <Bullet tone="green">Fonctionne sans écran, en continu</Bullet>
        <Bullet tone="coral">Seulement si l’application propose une API</Bullet>
        <Bullet tone="coral">Demande parfois une autorisation technique</Bullet>
      </div>
    </Card>
    <Callout cls={b.on(1)} title="La règle" style={{ position: 'absolute', left: 120, top: 810, width: 1680 }}>
      Un connecteur existe ? On l’utilise. Le RPA est le <Hl>plan B</Hl> pour les logiciels sans porte de service.
    </Callout>
  </Frame>
);

// ─── Attended / unattended ──────────────────────────────────────────────────
const M4_Modes: Page = () => (
  <Frame mod={4}>
    <Title>Robot assisté ou robot autonome</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 220, width: 1680 }}
      cols="300px 1fr 1fr"
      size={25}
      head={['', 'Assisté (attended)', 'Non assisté (unattended)']}
      rows={[
        ['Qui le lance ?', 'Vous, d’un clic, quand vous en avez besoin', 'Un horaire ou un événement, sans personne'],
        ['Où tourne-t-il ?', 'Sur votre poste, pendant que vous êtes là', 'Sur un poste ou un serveur dédié, même la nuit'],
        ['Pour quoi ?', 'Gagner du temps sur vos propres tâches', 'Traiter des volumes en continu'],
        ['Avec Power Automate Desktop', 'Gratuit sous Windows 10 et 11', 'Licence payante (exécution planifiée)'],
      ]}
    />
    <Callout cls={A.in} tone="teal" icon="bot" title="Pour ces deux jours" style={{ position: 'absolute', left: 120, top: 700, width: 1680, ...dl(400) }}>
      On reste en mode <b>assisté</b> : un robot que vous lancez vous-même, sur votre poste, gratuitement.
    </Callout>
  </Frame>
);

// ─── Building blocks ────────────────────────────────────────────────────────
const M4_BLOCKS: { icon: IconName; tone: Tone; t: string; s: string }[] = [
  { icon: 'database', tone: 'teal', t: 'Variables', s: 'Des « boîtes » qui gardent une valeur : un nom de fichier, un montant.' },
  { icon: 'loop', tone: 'blue', t: 'Boucles', s: 'Pour chaque fichier, chaque ligne, chaque courriel : la même suite d’actions.' },
  { icon: 'split', tone: 'yellow', t: 'Conditions', s: 'Si le montant dépasse 1 000 $, alors… sinon…' },
  { icon: 'target', tone: 'violet', t: 'Sélecteurs', s: 'L’adresse d’un élément à l’écran : le bouton « Enregistrer » de telle fenêtre.' },
  { icon: 'alert', tone: 'coral', t: 'Gestion d’erreurs', s: 'Que faire si une fenêtre n’apparaît pas ? Réessayer, passer, prévenir.' },
  { icon: 'note', tone: 'green', t: 'Journal', s: 'Ce que le robot a fait, ligne par ligne : indispensable pour vérifier.' },
];

const M4_Anatomie: Page = () => (
  <Frame mod={4}>
    <Title>Les six briques de tout robot</Title>
    <Lede>Les mêmes briques se retrouvent dans Power Automate Desktop, UiPath… et dans les workflows sans code.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      {M4_BLOCKS.map((x, i) => (
        <Card key={x.t} tone={x.tone} icon={x.icon} title={x.t} size={24} cls={A.in} style={{ height: 270, ...dl(100 + i * 90) }}>
          {x.s}
        </Card>
      ))}
    </div>
  </Frame>
);

// ─── Use cases (tabs) ───────────────────────────────────────────────────────
const M4_CASES: { id: string; icon: IconName; t: string; cas: string; nodes: FlowItem[]; gain: string }[] = [
  {
    id: 'mails',
    icon: 'mail',
    t: 'Extraction de données d’emails',
    cas: 'Courtier d’assurance · demandes de soumission',
    nodes: [
      { kind: 'trigger', label: 'Nouveau courriel', sub: 'Dossier « Soumissions »' },
      { kind: 'robot', label: 'Lit le corps', sub: 'Nom, adresse, véhicule' },
      { kind: 'robot', label: 'Saisit dans le logiciel', sub: 'Logiciel de courtage sans API' },
      { kind: 'out', label: 'Dossier créé', sub: 'Numéro renvoyé au client' },
    ],
    gain: 'Le formulaire du courriel est toujours le même : des règles suffisent. Texte libre ? On ajoute une étape IA (module 5).',
  },
  {
    id: 'files',
    icon: 'folder',
    t: 'Synchronisation entre fichiers',
    cas: 'Agence immobilière · fiches de propriétés',
    nodes: [
      { kind: 'trigger', label: 'Fichier déposé', sub: 'Dossier « À traiter »' },
      { kind: 'robot', label: 'Renomme et range', sub: 'Date + adresse' },
      { kind: 'robot', label: 'Met à jour Excel', sub: 'Une ligne par propriété' },
      { kind: 'out', label: 'Tout est à jour', sub: 'Dossier partagé + tableau' },
    ],
    gain: 'Plus de version « finale_v3 » : un seul nommage, un seul tableau, toujours synchronisés.',
  },
  {
    id: 'reports',
    icon: 'chart',
    t: 'Automatisation des rapports',
    cas: 'Distributeur alimentaire · rapport des ventes du lundi',
    nodes: [
      { kind: 'trigger', label: 'Lundi 7 h', sub: 'Planifié' },
      { kind: 'robot', label: 'Exporte du logiciel', sub: 'Ventes de la semaine' },
      { kind: 'robot', label: 'Met en forme', sub: 'Tableau croisé, graphique' },
      { kind: 'action', label: 'Envoie le PDF', sub: 'Aux directeurs' },
    ],
    gain: 'Le rapport qui prenait la matinée du lundi est dans les boîtes à 7 h 05.',
  },
];

const M4_Cas: Page = () => (
  <Frame mod={4} kind="cas">
    <Title>Trois cas d’usage du RPA</Title>
    <Tabs initial="mails" cls={A.in} style={{ position: 'absolute', left: 120, top: 196, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {M4_CASES.map((c) => (
          <TabBtn key={c.id} id={c.id} icon={c.icon} tone="teal">
            {c.t}
          </TabBtn>
        ))}
      </div>
      {M4_CASES.map((c) => (
        <TabPane key={c.id} id={c.id}>
          <div style={{ position: 'relative', height: 640 }}>
            <CasTag style={{ marginTop: 30 }}>{c.cas}</CasTag>
            <FlowRow x={0} y={130} w={360} gap={80} nodes={c.nodes} />
            <Callout title="Ce que ça change" tone="green" icon="trend" style={{ position: 'absolute', left: 0, top: 420, width: 1680 }}>
              {c.gain}
            </Callout>
          </div>
        </TabPane>
      ))}
    </Tabs>
  </Frame>
);

// ─── Demo: Power Automate Desktop ───────────────────────────────────────────
const M4Act = ({ n, icon, children, ind = 0, beat }: { n: number; icon: IconName; children: ReactNode; ind?: number; beat: number }) => (
  <div className={b.left(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: ind * 44, background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 16px' }}>
    <span style={{ width: 28, fontFamily: mono, fontSize: 19, color: C.faint }}>{n}</span>
    <Icon name={icon} size={26} color={C.blue} />
    <span style={{ fontSize: 23, color: C.ink }}>{children}</span>
  </div>
);

const M4_Demo: Page = () => (
  <Frame mod={4} kind="demo" beats={7}>
    <Title>Démo · Power Automate Desktop range les factures</Title>
    <div style={{ position: 'absolute', left: 120, top: 190 }}>
      <CasTag>Cabinet de comptabilité · le dossier « À traiter » déborde</CasTag>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1000, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M4Act beat={1} n={1} icon="folder">
        Obtenir les fichiers du dossier <b>« À traiter »</b> (*.pdf)
      </M4Act>
      <M4Act beat={2} n={2} icon="loop">
        Pour chaque fichier…
      </M4Act>
      <M4Act beat={3} n={3} icon="clock" ind={1}>
        Lire la date du jour (format AAAA-MM)
      </M4Act>
      <M4Act beat={4} n={4} icon="doc" ind={1}>
        Renommer : <b>AAAA-MM-JJ_nom-du-fichier.pdf</b>
      </M4Act>
      <M4Act beat={5} n={5} icon="archive" ind={1}>
        Déplacer vers <b>Archives\AAAA-MM</b> (créer le dossier s’il manque)
      </M4Act>
      <M4Act beat={6} n={6} icon="table" ind={1}>
        Écrire une ligne dans <b>journal.xlsx</b> : nom, date, emplacement
      </M4Act>
      <M4Act beat={7} n={7} icon="bell">
        Afficher un message : « 12 fichiers traités »
      </M4Act>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 270, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="teal" icon="bot" title="À montrer" size={23} cls={A.right}>
        L’enregistreur d’actions, le volet des variables, l’exécution pas à pas, puis le journal Excel rempli.
      </Card>
      <Callout cls={A.right} title="Pas de Windows ?" tone="blue" icon="eye" size={23} style={dl(200)}>
        Suivez la démo : on reconstruira la même logique dans Make demain.
      </Callout>
      <Verified cls={A.fade} style={dl(400)}>
        Libellés des actions selon la version française de Power Automate Desktop.
      </Verified>
    </div>
  </Frame>
);

// ─── Limits and countermeasures ─────────────────────────────────────────────
const M4Risk = ({ beat, risk, fix }: { beat: number; risk: ReactNode; fix: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center' }}>
    <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, background: T.coral.bg, borderRadius: 14, padding: '16px 22px', fontSize: 24, color: C.ink, ...dl(beat * 80) }}>
      <Icon name="alert" size={30} color={T.coral.fg} /> {risk}
    </div>
    <div className={b.fade(beat)} style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow w={64} color={C.green} />
    </div>
    <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: T.green.bg, borderRadius: 14, padding: '16px 22px', fontSize: 24, color: C.ink }}>
      <Icon name="shieldCheck" size={30} color={T.green.fg} /> {fix}
    </div>
  </div>
);

const M4_Fragile: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>Pourquoi un robot tombe en panne, et comment l’éviter</Title>
    <Lede>Un robot RPA est aussi solide que l’écran qu’il imite. Pour chaque risque, une parade.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Risk beat={1} risk="L’interface change (mise à jour du logiciel)" fix="Sélecteurs robustes, tests après chaque mise à jour" />
      <M4Risk beat={2} risk="Une fenêtre inattendue apparaît" fix="Prévoir le cas : fermer, réessayer, ou s’arrêter proprement" />
      <M4Risk beat={3} risk="Le logiciel est lent à répondre" fix="Attendre qu’un élément apparaisse, pas un délai fixe" />
      <M4Risk beat={4} risk="Une donnée imprévue (champ vide, format bizarre)" fix="Vérifier avant de saisir, mettre de côté les cas douteux" />
      <M4Risk beat={5} risk="Personne ne sait ce que le robot a fait" fix="Un journal à chaque exécution, et un responsable nommé" />
    </div>
  </Frame>
);

// ─── Exercise: put the robot steps in order ─────────────────────────────────
const M4_Ordre: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Remettez le robot dans l’ordre</Title>
    <Lede w={1680}>Un robot saisit les commandes reçues par courriel dans un vieux logiciel. Dites-moi l’ordre des étapes ; je déplace les étiquettes.</Lede>
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div key={i} style={{ position: 'absolute', left: 1080, top: 280 + (i - 1) * 88, width: 720, height: 72, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 16, borderRadius: 12, boxShadow: `inset 0 0 0 2px ${C.rule}`, background: 'rgba(255,255,255,.5)' }}>
        <Num n={i} tone="teal" size={40} />
      </div>
    ))}
    <Drag x={120} y={280} w={860} tone="teal">Pour chaque courriel non lu…</Drag>
    <Drag x={120} y={368} w={860} tone="teal">Ouvrir le dossier « Commandes » dans Outlook</Drag>
    <Drag x={120} y={456} w={860} tone="teal">Lire le numéro de client et les quantités</Drag>
    <Drag x={120} y={544} w={860} tone="teal">Marquer le courriel comme traité et écrire au journal</Drag>
    <Drag x={120} y={632} w={860} tone="teal">Ouvrir le logiciel de commandes et cliquer « Nouvelle »</Drag>
    <Drag x={120} y={720} w={860} tone="teal">Si un champ manque : mettre le courriel de côté</Drag>
    <Drag x={120} y={808} w={860} tone="teal">Saisir les champs et cliquer « Enregistrer »</Drag>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="RPA ou connecteur ?"
    q="Chaque soir, il faut copier les nouvelles inscriptions d’un formulaire Google vers un logiciel de paie installé sur un vieux poste Windows, sans API. Quelle solution ?"
    explain="Le logiciel de paie n’a ni connecteur ni API : seul un robot qui agit à l’écran peut y saisir. Côté Google, un connecteur suffit pour récupérer les inscriptions."
  >
    <Opt why="Piège ! Make ne peut pas écrire dans un logiciel qui n’a pas d’API : il n’a pas de porte où frapper.">
      Un scénario Make avec un connecteur vers le logiciel de paie
    </Opt>
    <Opt why="Piège ! Une IA comprend le texte, mais elle ne remplace pas la saisie dans le logiciel.">
      Une IA générative qui lit les inscriptions
    </Opt>
    <Opt ok why="Exact : le robot lit les inscriptions, puis saisit dans le logiciel comme un humain. On ajoute un journal et la gestion des champs manquants.">
      Un robot RPA sur le poste Windows
    </Opt>
    <Opt why="Piège ! La tâche est quotidienne, volumineuse et réglée : un très bon candidat, qu’il serait dommage de garder manuel.">
      Rien : ce n’est pas automatisable
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M4_Synthese: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={
      <>
        Sous Windows ? Faites enregistrer à Power Automate Desktop <b>un geste que vous répétez</b> : ranger des fichiers, ouvrir trois applications le matin.
      </>
    }
  >
    <SynthRow n={1} tone="teal" d={100}>
      Un robot RPA <b>repère, agit, enchaîne</b> à l’écran, comme vous, en plus rapide.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      Connecteur d’abord ; le RPA est le <b>plan B</b> pour les logiciels sans API.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Six briques : variables, boucles, conditions, sélecteurs, <b>erreurs</b>, journal.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      Un robot est fragile : prévoir les imprévus et <b>un responsable</b>.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Robot, M4_Api, M4_Modes, M4_Anatomie, M4_Cas, M4_Demo, M4_Fragile, M4_Ordre, M4_Qcm, M4_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 4 (50 min)

DIRE — « Le RPA, Robotic Process Automation : l'automatisation par des robots logiciels. Pas de robot physique : un programme qui utilise votre ordinateur comme vous. »

TRANSITION — « Regardez-le travailler. »`,
  `⏱ 4 min · ANIMATION

OBJECTIF — Faire comprendre le principe : le robot repère des éléments et agit dessus.

DIRE — « Un vieux logiciel de dossiers clients, sans aucun connecteur. Le robot clique sur Nouveau, remplit le nom, le courriel, le montant, et enregistre. En boucle. »

Commentez les trois verbes à gauche :
• Repérer : « Il ne voit pas l'écran comme vous : il connaît l'adresse technique de chaque champ, son sélecteur. »
• Agir : « Cliquer, taper, copier, ouvrir. »
• Enchaîner : « Répéter pour chaque ligne, décider, noter ce qu'il a fait. »

QUESTION — « Que se passe-t-il si l'éditeur déplace le bouton Enregistrer ? » Le robot se perd : on y revient dans les limites.

TRANSITION — « Écran ou API : quelle différence ? »`,
  `⏱ 4 min

OBJECTIF — Positionner le RPA par rapport aux connecteurs.

DIRE — « Deux façons d'entrer dans une application : par la porte d'entrée, l'écran, comme un humain ; ou par la porte de service, l'API. » Lisez les deux cartes.
→ beat 1 — La règle : connecteur d'abord, RPA en plan B.

EXEMPLES — « Gmail, Sheets, un CRM en ligne : connecteur. Un logiciel comptable des années 2000 installé sur un poste : RPA. »

TRANSITION — « Deux modes de robots. »`,
  `⏱ 3 min

OBJECTIF — Distinguer robot assisté et non assisté, et ce qui est gratuit.

DIRE — Lisez le tableau ligne par ligne. « Le robot assisté, c'est votre assistant personnel : vous le lancez. Le robot non assisté travaille seul, la nuit, sur un serveur. »

INSISTER — « Power Automate Desktop est gratuit sous Windows 10 et 11 en mode assisté. Pour le mode non assisté, il faut une licence. » Revérifiez avant la session.

TRANSITION — « De quoi est fait un robot ? »`,
  `⏱ 4 min

OBJECTIF — Donner les six briques, réutilisées dans les workflows.

DIRE — Parcourez les cartes. « Ces six mots, vous les retrouverez demain dans Make : variables, boucles (on dit itérateur), conditions (filtres, routeurs), et gestion des erreurs. »

INSISTER — Le journal : « Un robot sans journal, c'est un collègue qui ne dit jamais ce qu'il a fait. »

TRANSITION — « Les trois cas d'usage du programme. »`,
  `⏱ 6 min · CAS

OBJECTIF — Illustrer les trois usages du programme : courriels, fichiers, rapports.

ANIMATION — Cliquez les trois onglets. Pour chacun, lisez le cas (secteur différent à chaque fois), le circuit, et ce que ça change.

À SOULIGNER —
• Courriels : un formulaire toujours identique → règles ; un texte libre → IA.
• Fichiers : la discipline de nommage, c'est déjà la moitié du gain.
• Rapports : l'exemple le plus parlant pour les gestionnaires.

INTERACTION — « Lequel de ces trois ressemble à votre tâche ? » Deux réponses.

TRANSITION — « Démonstration. »`,
  `⏱ 10 min · DÉMO EN PARTAGE D'ÉCRAN

OBJECTIF — Montrer un vrai robot, construit en quelques minutes.

PRÉPARATION — Avant la session : un dossier « À traiter » avec une dizaine de PDF fictifs, un dossier « Archives » vide, un journal.xlsx avec les en-têtes Nom · Date · Emplacement. Power Automate Desktop installé.

DÉROULÉ — Révélez les actions (→ beats 1 à 7) à mesure que vous les construisez réellement dans Power Automate Desktop. Montrez : le volet des variables qui se remplit, l'exécution pas à pas, le message final, le journal Excel.

PLAN B — Si la démo échoue, déroulez la page : chaque clic révèle une action et vous la commentez.

SANS WINDOWS — Les participants sous Mac suivent : la même logique sera reconstruite dans Make au jour 2.

TRANSITION — « Ce robot est utile… mais fragile. »`,
  `⏱ 5 min

OBJECTIF — Connaître les causes de panne et les parades.

DIRE — Révélez chaque parade (→ beats 1 à 5).
1. Mise à jour du logiciel : « Testez le robot après chaque mise à jour. »
2. Fenêtre inattendue : « Le robot doit savoir quoi faire, sinon il s'arrête au milieu. »
3. Lenteur : « Attendre un élément, pas trois secondes. »
4. Donnée imprévue : « On ne saisit pas un dossier douteux : on le met de côté pour un humain. »
5. Journal et responsable : « Quand le robot tombe en panne un vendredi soir, qui le sait ? »

TRANSITION — « À vous de construire mentalement un robot. »`,
  `⏱ 6 min · EXERCICE ORAL

OBJECTIF — Exercer la logique séquentielle d'un robot.

ANIMATION — Appelez des participants par leur prénom : « Quelle est l'étape 1 ? » Déplacez l'étiquette dans la case. Laissez débattre au micro quand il y a désaccord.

CORRIGÉ —
1. Ouvrir le dossier « Commandes » dans Outlook
2. Pour chaque courriel non lu…
3. Lire le numéro de client et les quantités
4. Si un champ manque : mettre le courriel de côté
5. Ouvrir le logiciel de commandes et cliquer « Nouvelle »
6. Saisir les champs et cliquer « Enregistrer »
7. Marquer le courriel comme traité et écrire au journal

À SOULIGNER — L'étape 4 avant la saisie : on vérifie avant d'écrire. Les étapes 3 à 7 sont à l'intérieur de la boucle.

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 4

RÉPONSE — C. Le logiciel de paie n'a pas d'API : il faut un robot à l'écran.
• A ✗ — Pas d'API, pas de connecteur.
• B ✗ — L'IA ne saisit pas dans le logiciel.
• D ✗ — Quotidien, volumineux, réglé : très bon candidat.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

LOGISTIQUE — Pause de 15 minutes. « Au retour : ce que l'IA ajoute à tout ça. Gardez votre assistant IA ouvert. »

TRANSITION — « Après la pause : automatiser avec l'IA. »`,
];
// @@NOTES-END
