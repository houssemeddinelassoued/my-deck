// ─── M2 · Divider ───────────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title="L’IA dans la gestion de projet" sub="Planifier, trier et suivre, rendre compte, relancer : quatre usages, vos outils du quotidien." dur="≈ 1 h 30">
    <SecItem n={1}>L’IA à chaque phase du cycle de vie</SecItem>
    <SecItem n={2}>Quatre cas d’usage : planification, courriels, comptes rendus, relances</SecItem>
    <SecItem n={3}>Copilot dans Outlook, Teams, Word, Excel… et vos outils métier</SecItem>
    <SecItem n={4}>Bien formuler sa demande à l’IA</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── M2 · Lifecycle ─────────────────────────────────────────────────────────
const M2Phase = ({ i, n, tone, name, children }: { i: number; n: number; tone: Tone; name: string; children: ReactNode }) => (
  <div style={{ width: 320, flex: 'none' }}>
    <div
      className={A.left}
      style={{
        height: 96,
        background: STRONG[tone],
        clipPath: i === 1 ? 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)' : 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: tone === 'yellow' ? C.ink : '#fff',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: '0.04em',
        ...dl(i * 120),
      }}
    >
      {name}
    </div>
    <div className={b.on(n)} style={{ marginTop: 22 }}>
      <div style={{ boxSizing: 'border-box', height: 480, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  </div>
);

const M2Use = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <IconTile name={icon} tone={tone} size={44} />
    <span style={{ fontSize: 24, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M2_Lifecycle: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>L’IA peut aider à chaque phase du projet</Title>
    <Lede>Le cycle de vie que vous connaissez, phase par phase.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 20 }}>
      <M2Phase i={1} n={1} tone="blue" name="Transférer">
        <M2Use icon="doc" tone="blue">
          Résumer la soumission et les exclusions
        </M2Use>
        <M2Use icon="users" tone="blue">
          Liste des intervenants : EG, architecte, ingénieur
        </M2Use>
        <M2Use icon="search" tone="blue">
          Questions pour la réunion de démarrage
        </M2Use>
      </M2Phase>
      <M2Phase i={2} n={2} tone="teal" name="Planifier">
        <M2Use icon="route" tone="teal">
          Étapes et dépendances jusqu’à la pose
        </M2Use>
        <M2Use icon="gantt" tone="teal">
          Échéancier des dessins et des commandes
        </M2Use>
        <M2Use icon="alert" tone="teal">
          Registre des risques
        </M2Use>
      </M2Phase>
      <M2Phase i={3} n={3} tone="green" name="Exécuter">
        <M2Use icon="note" tone="green">
          Comptes rendus de réunion de chantier
        </M2Use>
        <M2Use icon="mail" tone="green">
          Tri des courriels et relances
        </M2Use>
        <M2Use icon="doc" tone="green">
          Demandes d’information (DI) à rédiger
        </M2Use>
      </M2Phase>
      <M2Phase i={4} n={4} tone="violet" name="Suivre">
        <M2Use icon="bell" tone="violet">
          Alertes sur les livraisons
        </M2Use>
        <M2Use icon="chart" tone="violet">
          Rapport du vendredi
        </M2Use>
        <M2Use icon="money" tone="violet">
          Avis de modification comparés au contrat
        </M2Use>
      </M2Phase>
      <M2Phase i={5} n={5} tone="yellow" name="Fermer">
        <M2Use icon="camera" tone="yellow">
          Liste de déficiences
        </M2Use>
        <M2Use icon="archive" tone="yellow">
          Documents de fin de projet
        </M2Use>
        <M2Use icon="bulb" tone="yellow">
          Leçons apprises, service après-vente
        </M2Use>
      </M2Phase>
    </div>
  </Frame>
);

// ─── M2 · Where the time goes ───────────────────────────────────────────────
const M2Bar = ({ i, label, h, ai, tone }: { i: number; label: string; h: number; ai?: string; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 84 }}>
    <span style={{ width: 340, flex: 'none', fontSize: 27, fontWeight: 500, color: C.ink }}>{label}</span>
    <div className={A.grow} style={{ width: h * 70, height: 50, borderRadius: 8, background: STRONG[tone], flex: 'none', ...dl(200 + i * 120) }} />
    <span className={A.fade} style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink, ...dl(700 + i * 120) }}>
      {h} h
    </span>
    {ai ? (
      <span className={b.pop(1)} style={{ ...vars({ o: 'left center' }), ...dl(i * 90) }}>
        <Tag tone="blue" size={22}>
          <Icon name="sparkles" size={22} /> {ai}
        </Tag>
      </span>
    ) : null}
  </div>
);

const M2_Time: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Où passe la semaine de Mathieu ?</Title>
    <Lede>Une semaine type de 40 heures sur 13 projets, telle qu’il l’a notée. L’IA aide surtout là où ça déborde.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 40px' }}>
      <M2Bar i={0} label="Courriels et relances" h={11} tone="blue" ai="tri, résumés, relances" />
      <M2Bar i={1} label="Réunions et visites" h={9} tone="blue" ai="comptes rendus" />
      <M2Bar i={2} label="Dessins et commandes" h={6} tone="teal" ai="suivi, alertes" />
      <M2Bar i={3} label="Rapports et tableaux" h={4} tone="teal" ai="rapport du vendredi" />
      <M2Bar i={4} label="Imprévus à régler" h={6} tone="grey" />
      <M2Bar i={5} label="Téléphone et chantier" h={4} tone="grey" />
    </div>
    <Callout cls={b.on(1)} title="Le vrai gain" tone="green" icon="clock" style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(500) }}>
      Le temps libéré sur les courriels et les comptes rendus revient à ce que l’IA ne fait pas : les imprévus, le chantier, les clients.
    </Callout>
  </Frame>
);

// ─── M2 · Use-case pages (shared layout) ────────────────────────────────────
const M2Item = ({ d, icon, tone, children }: { d: number; icon: IconName; tone: Tone; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <span style={{ fontSize: 26, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const M2Case = ({
  n,
  tone,
  icon,
  title,
  lede,
  items,
  prompt,
  answer,
  app = 'chatgpt',
}: {
  n: number;
  tone: Tone;
  icon: IconName;
  title: string;
  lede: string;
  items: ReactNode;
  prompt: ReactNode;
  answer: ReactNode;
  app?: AppId;
}) => (
  <Frame mod={2} beats={2} label={`Module 02 · Cas d’usage ${n} sur 4`}>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 104 }}>
      <IconTile name={icon} tone={tone} size={74} solid />
    </div>
    <h2 className={A.in} style={{ position: 'absolute', left: 216, top: 108, margin: 0, fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: C.ink }}>
      {title}
    </h2>
    <Lede>{lede}</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>{items}</div>
    <FilRouge cls={A.fade} style={{ position: 'absolute', left: 780, top: 280, ...dl(300) }}>
      Mathieu
    </FilRouge>
    <div className={b.on(1)} style={{ position: 'absolute', left: 780, top: 336, width: 1020 }}>
      <PromptBox size={27}>{prompt}</PromptBox>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 780, top: 590, width: 1020 }}>
      <AnswerBox id={app} size={26}>{answer}</AnswerBox>
    </div>
  </Frame>
);

const M2Line = ({ children }: { children: ReactNode }) => <div style={{ marginTop: 4 }}>{children}</div>;

const M2_UcPlan: Page = () => (
  <M2Case
    n={1}
    tone="teal"
    icon="gantt"
    title="Planification"
    lede="Du dossier des ventes à un premier échéancier, en quelques minutes."
    items={
      <>
        <M2Item d={100} icon="doc" tone="teal">
          Résumer le dossier transmis par les ventes
        </M2Item>
        <M2Item d={200} icon="route" tone="teal">
          Proposer les étapes et leurs dépendances
        </M2Item>
        <M2Item d={300} icon="clock" tone="teal">
          Repérer les délais critiques (verre, approbations)
        </M2Item>
        <M2Item d={400} icon="alert" tone="teal">
          Lister les risques et les questions à poser
        </M2Item>
      </>
    }
    app="copilot"
    prompt="Tu es chargé de projet chez un fabricant-installateur d’enveloppe en aluminium et verre. Voici la soumission et les exclusions transmises par les ventes (ci-dessous). Propose les grandes étapes jusqu’au bâtiment fermé du 14 mai, avec leurs dépendances."
    answer={
      <>
        <M2Line>
          <b>1. Transfert</b> : revue du contrat et des exclusions, réunion de démarrage avec l’EG
        </M2Line>
        <M2Line>
          <b>2. Relevés et dessins d’atelier</b> : relevés au chantier, dessins, approbation de l’architecte
        </M2Line>
        <M2Line>
          <b>3. Commandes</b> : verre (8 semaines, après approbation), profilés, quincaillerie
        </M2Line>
        <M2Line>
          <b>4. Fabrication</b> : cadres en usine · <b>5. Installation</b> : fenêtres, mur-rideau, entrées, verrière
        </M2Line>
        <M2Line>
          <b>6. Fermeture</b> : déficiences, documents de fin de projet, garanties
        </M2Line>
      </>
    }
  />
);

const M2_UcTrack: Page = () => (
  <M2Case
    n={2}
    tone="violet"
    icon="inbox"
    title="Courriels et priorités"
    lede="80 courriels par jour : savoir ce qui compte avant de tout lire."
    items={
      <>
        <M2Item d={100} icon="list" tone="violet">
          Résumer un long fil en cinq lignes
        </M2Item>
        <M2Item d={200} icon="filter" tone="violet">
          Trier : à traiter, à transférer, à relancer
        </M2Item>
        <M2Item d={300} icon="search" tone="violet">
          Repérer les demandes restées sans réponse
        </M2Item>
        <M2Item d={400} icon="send" tone="violet">
          Préparer le transfert à l’adjointe, avec la consigne
        </M2Item>
      </>
    }
    app="copilot"
    prompt="Voici les courriels reçus depuis hier sur mes projets. Classe-les en quatre groupes : à traiter aujourd’hui, à transférer à Nadia (avec la consigne), à relancer, à classer. Une ligne par courriel."
    answer={
      <>
        <M2Line>
          <b>À traiter aujourd’hui (3)</b> : Boréa demande la date de pose du hall ; l’architecte refuse un détail de solin ; Patrice signale un écart de 40 mm.
        </M2Line>
        <M2Line>
          <b>À transférer à Nadia (4)</b> : bordereau de livraison à classer ; certificat d’assurance demandé par Boréa…
        </M2Line>
        <M2Line>
          <b>À relancer (2)</b> : dessins d’atelier soumis le 23 novembre, sans retour ; prix des panneaux d’allège.
        </M2Line>
      </>
    }
  />
);

const M2_UcReport: Page = () => (
  <M2Case
    n={3}
    tone="blue"
    icon="note"
    title="Comptes rendus"
    lede="Le compte rendu de la réunion de chantier en 10 minutes au lieu d’une heure."
    items={
      <>
        <M2Item d={100} icon="chat" tone="blue">
          Réunion : décisions, actions, points ouverts
        </M2Item>
        <M2Item d={200} icon="camera" tone="blue">
          Visite de chantier : notes dictées et photos
        </M2Item>
        <M2Item d={300} icon="chart" tone="blue">
          Rapport du vendredi pour la direction
        </M2Item>
        <M2Item d={400} icon="gauge" tone="blue">
          Une météo vert, jaune, rouge par projet
        </M2Item>
      </>
    }
    app="copilot"
    prompt="Voici mes notes de la réunion de chantier de ce matin. Rédige le compte rendu : décisions, actions (qui, quoi, quand), points ouverts. N’invente rien : si une information manque, écris « à confirmer »."
    answer={
      <>
        <M2Line>
          <b>Décision</b> : pose du mur-rideau du hall à partir du 22 mars, si la dalle est libérée (accord de Boréa).
        </M2Line>
        <M2Line>
          <b>Actions</b> : Mathieu envoie les dessins corrigés du solin (vendredi) ; Boréa confirme l’accès à la grue (date à confirmer).
        </M2Line>
        <M2Line>
          <b>Point ouvert</b> : couleur des panneaux d’allège, en attente de l’architecte.
        </M2Line>
      </>
    }
  />
);

const M2_UcComm: Page = () => (
  <M2Case
    n={4}
    tone="yellow"
    icon="bell"
    title="Relances et suivis"
    lede="Relancer poliment et précisément, au bon ton, sans y passer la matinée."
    items={
      <>
        <M2Item d={100} icon="bell" tone="yellow">
          Relancer l’architecte, le verrier, l’EG
        </M2Item>
        <M2Item d={200} icon="users" tone="yellow">
          Adapter le ton : courtois, ferme, formel
        </M2Item>
        <M2Item d={300} icon="mail" tone="yellow">
          Annoncer un retard sans braquer le client
        </M2Item>
        <M2Item d={400} icon="globe" tone="yellow">
          Écrire en anglais à un fournisseur
        </M2Item>
      </>
    }
    app="claude"
    prompt="Les dessins d’atelier du mur-rideau ont été soumis à l’architecte le 23 novembre, sans retour. Sans approbation d’ici le 7 décembre, la commande du verre glisse. Rédige une relance courtoise, une relance ferme pour dans 5 jours, et un courriel à Boréa sur le risque."
    answer={
      <>
        <M2Line>
          <b>Relance courtoise</b> : « Nous avons transmis le 23 novembre les dessins d’atelier du mur-rideau. Pourriez-vous nous indiquer… »
        </M2Line>
        <M2Line>
          <b>Relance ferme</b> : « Sans approbation d’ici le 7 décembre, la commande du verre (8 semaines) ne pourra… »
        </M2Line>
        <M2Line>
          <b>À Boréa</b> : « Pour votre information : l’approbation des dessins conditionne la pose du 22 mars… »
        </M2Line>
      </>
    }
  />
);

// ─── M2 · Exercise: what to hand over? (2×2 matrix) ─────────────────────────
const M2Quad = ({ x, y, tone, title, sub }: { x: number; y: number; tone: Tone; title: string; sub: string }) => (
  <div className={A.fade} style={{ position: 'absolute', left: x, top: y, width: 600, height: 300, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 16, padding: '16px 22px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 21, color: C.soft }}>{sub}</div>
  </div>
);

const M2_Matrix: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>À vous : que confier à l’IA ?</Title>
    <Lede>Proposez une case pour chaque tâche. Il y a débat… c’est voulu.</Lede>
    <M2Quad x={540} y={270} tone="yellow" title="Avec relecture attentive" sub="Gain élevé, risque élevé" />
    <M2Quad x={1160} y={270} tone="green" title="À confier en priorité" sub="Gain élevé, risque faible" />
    <M2Quad x={540} y={590} tone="coral" title="À garder pour soi" sub="Gain faible, risque élevé" />
    <M2Quad x={1160} y={590} tone="grey" title="Si le temps le permet" sub="Gain faible, risque faible" />
    <svg width={1260} height={660} style={{ position: 'absolute', left: 520, top: 260, overflow: 'visible', pointerEvents: 'none' }}>
      <Arrow x1={10} y1={650} x2={10} y2={0} color={C.soft} w={4} />
      <Arrow x1={1250} y1={650} x2={20} y2={650} color={C.soft} w={4} />
    </svg>
    <div style={{ position: 'absolute', left: 494, top: 600, transform: 'rotate(-90deg)', transformOrigin: 'left top', fontSize: 22, fontWeight: 600, color: C.soft, whiteSpace: 'nowrap' }}>
      Temps gagné →
    </div>
    <div style={{ position: 'absolute', left: 880, top: 930, fontSize: 22, fontWeight: 600, color: C.soft }}>← Risque si l’IA se trompe</div>
    <Drag x={120} y={270} w={360} tone="blue" size={22}>
      Compte rendu de chantier
    </Drag>
    <Drag x={120} y={350} w={360} tone="blue" size={22}>
      Annonce d’un retard au client
    </Drag>
    <Drag x={120} y={430} w={360} tone="blue" size={22}>
      Résumer un fil de 30 courriels
    </Drag>
    <Drag x={120} y={510} w={360} tone="blue" size={22}>
      Accepter un avis de modification
    </Drag>
    <Drag x={120} y={590} w={360} tone="blue" size={22}>
      Ordre du jour de la réunion
    </Drag>
    <Drag x={120} y={670} w={360} tone="blue" size={22}>
      Prix d’un avenant au client
    </Drag>
    <Drag x={120} y={750} w={360} tone="blue" size={22}>
      Reformuler une note interne
    </Drag>
    <Drag x={120} y={830} w={360} tone="blue" size={22}>
      Évaluation d’un employé
    </Drag>
  </Frame>
);

// ─── M2 · Two families of tools ─────────────────────────────────────────────
const M2Pro = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, lineHeight: 1.3, color: C.ink }}>
    <Icon name={ok ? 'plus' : 'x'} size={28} color={ok ? C.green : C.coral} sw={3} />
    <span>{children}</span>
  </div>
);

const M2Family = ({ x, n, tone, icon, name, sub, apps, children }: { x: number; n?: number; tone: Tone; icon: IconName; name: string; sub: string; apps: ReactNode; children: ReactNode }) => (
  <div className={n ? b.on(n) : A.left} style={{ position: 'absolute', left: x, top: 260, width: 820 }}>
    <div style={{ boxSizing: 'border-box', height: 540, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name={icon} tone={tone} size={76} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: C.ink }}>{name}</div>
          <div style={{ fontSize: 24, color: C.muted }}>{sub}</div>
        </div>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 18 }}>{apps}</div>
      <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  </div>
);

const M2_Families: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Deux familles d’outils</Title>
    <M2Family
      x={120}
      tone="blue"
      icon="chat"
      name="Les assistants génériques"
      sub="Une fenêtre de conversation, pour tout"
      apps={
        <>
          <AppChip id="copilot" />
          <AppChip id="claude" />
          <AppChip id="chatgpt" />
          <AppChip id="gemini" />
        </>
      }
    >
      <M2Pro ok>Polyvalents : rédiger, planifier, analyser</M2Pro>
      <M2Pro ok>Copilot Chat inclus avec Microsoft 365</M2Pro>
      <M2Pro ok={false}>Ne voient que ce que vous collez</M2Pro>
      <M2Pro ok={false}>Copier-coller entre les outils</M2Pro>
    </M2Family>
    <M2Family
      x={980}
      n={1}
      tone="green"
      icon="puzzle"
      name="L’IA intégrée"
      sub="Dans l’outil où le travail se fait déjà"
      apps={
        <>
          <AppChip id="outlook" />
          <AppChip id="teams" />
          <AppChip id="excel" />
          <AppChip id="procore" />
          <AppChip id="smartsheet" />
          <AppChip id="bluebeam" />
        </>
      }
    >
      <M2Pro ok>Voit vos courriels, réunions, documents</M2Pro>
      <M2Pro ok>Agit sur place : crée, résume, met à jour</M2Pro>
      <M2Pro ok={false}>Souvent une licence payante</M2Pro>
      <M2Pro ok={false}>Limitée à son propre outil</M2Pro>
    </M2Family>
    <Callout cls={b.on(1)} title="Les deux se complètent" tone="blue" icon="puzzle" style={{ position: 'absolute', left: 120, top: 840, width: 1680, ...dl(400) }}>
      Le générique pour réfléchir et rédiger, l’intégré pour travailler sur vos courriels, réunions et dossiers.
    </Callout>
  </Frame>
);

// ─── M2 · The four generic assistants ───────────────────────────────────────
const M2Assist = ({ d, id, by, children, tip }: { d: number; id: AppId; by: string; children: ReactNode; tip: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 600, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 28px', display: 'flex', flexDirection: 'column' }}>
      <AppTile id={id} size={84} />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{APPS[id].short}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{by}</div>
      <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T.blue.bg, borderRadius: 12, padding: '12px 16px', fontSize: 22, lineHeight: 1.4, color: T.blue.fg }}>{tip}</div>
    </div>
  </div>
);

const M2_Generic: Page = () => (
  <Frame mod={2}>
    <Title>Les assistants génériques : quatre grands noms</Title>
    <Lede>Ils se ressemblent beaucoup. Le meilleur ? Celui que votre organisation autorise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 26 }}>
      <M2Assist d={100} id="copilot" by="Microsoft" tip="Votre outil de référence, avec votre compte Lessard.">
        Copilot Chat pour tous ; avec la licence Microsoft 365 Copilot, dans Outlook, Teams, Word, Excel.
      </M2Assist>
      <M2Assist d={220} id="claude" by="Anthropic" tip="Quelques comptes chez vous : précieux pour les longs devis.">
        Rédaction soignée, analyse de longs documents (devis, contrats), raisonnement.
      </M2Assist>
      <M2Assist d={340} id="chatgpt" by="OpenAI" tip="Le plus connu : jamais de données de clients dans un compte personnel.">
        Rédaction, analyse de fichiers, recherche sur le web, images.
      </M2Assist>
      <M2Assist d={460} id="gemini" by="Google" tip="Surtout utile dans Google Workspace : peu pertinent chez vous.">
        Relié aux services Google : Gmail, Docs, Drive, Meet.
      </M2Assist>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, fontSize: 22, color: C.muted, ...dl(700) }}>
      Fonctions et forfaits évoluent tous les mois : vérifiez ce qui est inclus dans votre version.
    </div>
  </Frame>
);

// ─── M2 · Microsoft 365 ─────────────────────────────────────────────────────
const M2Mini = ({ children, tone = 'violet' }: { children: ReactNode; tone?: Tone }) => (
  <div style={{ marginTop: 14, background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
);

const M2Mail = ({ from, subj, faded }: { from: string; subj: string; faded?: boolean }) => (
  <div style={{ display: 'flex', gap: 14, padding: '9px 0', borderBottom: `1.5px solid ${C.rule}`, opacity: faded ? 0.55 : 1 }}>
    <span style={{ width: 130, flex: 'none', fontSize: 21, fontWeight: 600, color: C.ink }}>{from}</span>
    <span style={{ fontSize: 21, color: C.soft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subj}</span>
  </div>
);

const M2_Microsoft: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>L’IA dans Outlook et Teams</Title>
    <Lede>Microsoft 365 Copilot travaille directement sur vos courriels et vos réunions.</Lede>
    <AppWin id="outlook" title="Dessins d’atelier · mur-rideau (14)" cls={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 820, ...dl(100) }}>
      <M2Mail from="Architecte" subj="RE: RE: Dessins MR-01, commentaires" />
      <M2Mail from="Boréa" subj="RE: Date de pose du hall ?" faded />
      <M2Mail from="Hélène" subj="RE: Risque sur le 14 mai ?" faded />
      <div className={b.on(1)}>
        <M2Mini>
          <b>Résumé par Copilot</b> : l’architecte demande deux corrections (solin, ancrages). Boréa veut une date de pose. Hélène demande si le 14 mai est menacé. Aucune réponse envoyée.
        </M2Mini>
      </div>
    </AppWin>
    <AppWin id="teams" title="Réunion de chantier · Méandres" cls={A.right} style={{ position: 'absolute', left: 980, top: 280, width: 820, ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.soft }}>
        <Icon name="video" size={26} color={C.violet} /> Réunion terminée · 52 min · transcription activée
      </div>
      <div className={b.on(2)}>
        <M2Mini>
          <b>Récapitulatif</b>
          <br />• Décision : pose du hall à partir du 22 mars.
          <br />• Tâche : Mathieu renvoie les dessins corrigés (échéance 11 décembre).
          <br />• Point ouvert : accès à la grue, à confirmer par Boréa.
        </M2Mini>
      </div>
    </AppWin>
    <Callout cls={A.in} title="Avant de promettre ces fonctions à votre équipe" tone="blue" icon="key" size={25} style={{ position: 'absolute', left: 120, top: 840, width: 1680, padding: '14px 26px', ...dl(500) }}>
      Elles exigent la licence Microsoft 365 Copilot (pas seulement Copilot Chat) et l’accord de vos TI. Le récapitulatif exige une réunion transcrite.
    </Callout>
  </Frame>
);

// ─── M2 · Google Workspace ──────────────────────────────────────────────────
const M2GTile = ({ d, icon, app, children }: { d: number; icon: IconName; app: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '28px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone="green" size={60} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>{app}</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Google: Page = () => (
  <Frame mod={2}>
    <Title>Copilot dans Word, Excel, Planner et Power Automate</Title>
    <Lede>La même IA, dans les autres outils Microsoft 365 que vous ouvrez chaque jour.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 26 }}>
      <M2GTile d={100} icon="doc" app="Word">
        Résumer un devis ou un contrat, comparer deux versions, rédiger une lettre ou un rapport de visite.
      </M2GTile>
      <M2GTile d={220} icon="chart" app="Excel">
        Analyser le registre des livraisons, expliquer ou écrire une formule, repérer les écarts.
      </M2GTile>
      <M2GTile d={340} icon="kanban" app="Planner">
        Créer un plan et des tâches à partir d’un objectif, résumer l’avancement d’un plan.
      </M2GTile>
      <M2GTile d={460} icon="loop" app="Automate">
        Décrire un flux en français : « quand un courriel de Boréa arrive, l’enregistrer dans le dossier ».
      </M2GTile>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 22, alignItems: 'center', ...dl(600) }}>
      <AppTile id="copilot" size={60} />
      <span style={{ fontSize: 27, lineHeight: 1.4, color: C.ink }}>
        L’IA travaille <b>là où sont vos documents</b>, avec les droits d’accès que vous avez déjà. Tout dépend de la licence.
      </span>
    </div>
  </Frame>
);

// ─── M2 · Project tools ─────────────────────────────────────────────────────
const M2Tool = ({ d, id, children }: { d: number; id: AppId; children: ReactNode }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 290, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 26px' }}>
      <AppChip id={id} size={30} />
      <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_PmTools: Page = () => (
  <Frame mod={2}>
    <Title>Vos outils métier ajoutent aussi de l’IA</Title>
    <Lede>Procore, Smartsheet, Bluebeam : ce qui existe en novembre 2026, à vérifier dans votre forfait.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', columnGap: 30 }}>
      <M2Tool d={100} id="procore">
        Procore AI (Helix) : agents pour rédiger les demandes d’information (DI), recouper les documents soumis, suivre les journaux de chantier.
      </M2Tool>
      <M2Tool d={250} id="smartsheet">
        Smartsheet AI : écrire une formule en français, résumer une feuille, colonnes qui classent ou résument chaque ligne.
      </M2Tool>
      <M2Tool d={400} id="bluebeam">
        Bluebeam Max : recherche en langage naturel, et Claude qui pilote Revu : étiquettes, signets, annotations.
      </M2Tool>
    </div>
    <Callout cls={A.in} title="Avant d’en parler à votre équipe" tone="blue" icon="key" size={26} style={{ position: 'absolute', left: 120, top: 640, width: 1680, ...dl(600) }}>
      Ces fonctions changent chaque trimestre et dépendent du forfait (Procore : déploiement progressif ; Smartsheet : forfait Enterprise ; Bluebeam Max : offre premium). Demandez à vos TI ce que Lessard a activé.
    </Callout>
  </Frame>
);

// ─── M2 · How to choose (decision path) ─────────────────────────────────────
const M2Q = ({ x, y, n, children }: { x: number; y: number; n?: number; children: ReactNode }) => (
  <div className={n ? b.pop(n) : A.pop} style={{ position: 'absolute', left: x, top: y, width: 560 }}>
    <div style={{ boxSizing: 'border-box', minHeight: 120, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 0 0 3px ${C.blue}`, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon name="search" size={36} color={C.blue} />
      <span style={{ fontSize: 27, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{children}</span>
    </div>
  </div>
);

const M2A = ({ x, y, n, tone, icon, children }: { x: number; y: number; n: number; tone: Tone; icon: IconName; children: ReactNode }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: y, width: 520, ...dl(200) }}>
    <div style={{ boxSizing: 'border-box', background: T[tone].bg, borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon name={icon} size={34} color={T[tone].fg} />
      <span style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</span>
    </div>
  </div>
);

const M2YesNo = ({ x, y, yes }: { x: number; y: number; yes: boolean }) => (
  <span style={{ position: 'absolute', left: x, top: y, fontFamily: display, fontWeight: 700, fontSize: 24, color: yes ? C.green : C.coral }}>{yes ? 'OUI' : 'NON'}</span>
);

const M2_Choose: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Quel outil choisir ? Trois questions</Title>
    <Lede>Avant la puissance de l’outil : la nature de vos données.</Lede>
    <svg width={1680} height={700} style={{ position: 'absolute', left: 120, top: 270, overflow: 'visible' }}>
      <Arrow x1={560} y1={60} x2={700} y2={60} color={C.faint} n={1} />
      <Arrow x1={230} y1={120} x2={230} y2={240} color={C.faint} n={1} />
      <Arrow x1={560} y1={300} x2={700} y2={300} color={C.faint} n={2} />
      <Arrow x1={230} y1={360} x2={230} y2={480} color={C.faint} n={2} />
      <Arrow x1={560} y1={540} x2={700} y2={540} color={C.faint} n={3} />
    </svg>
    <M2Q x={120} y={270}>
      Les données sont-elles confidentielles ou personnelles ?
    </M2Q>
    <M2YesNo x={712} y={284} yes />
    <M2A x={820} y={276} n={1} tone="coral" icon="lock">
      Uniquement un outil <b>approuvé</b> par Lessard : Copilot avec votre compte.
    </M2A>
    <M2YesNo x={250} y={410} yes={false} />
    <M2Q x={120} y={510} n={1}>
      L’information est-elle déjà dans Outlook, Teams, Procore… ?
    </M2Q>
    <M2YesNo x={712} y={524} yes />
    <M2A x={820} y={516} n={2} tone="green" icon="puzzle">
      Utilisez l’<b>IA intégrée</b> : elle voit le contexte, pas de copier-coller.
    </M2A>
    <M2YesNo x={250} y={650} yes={false} />
    <M2Q x={120} y={750} n={2}>
      Besoin ponctuel : un texte, une idée, une analyse ?
    </M2Q>
    <M2YesNo x={712} y={764} yes />
    <M2A x={820} y={756} n={3} tone="blue" icon="chat">
      Un <b>assistant générique</b> fait très bien l’affaire.
    </M2A>
  </Frame>
);

// ─── M2 · Anatomy of a good request ─────────────────────────────────────────
for (let n = 1; n <= 5; n++) {
  CSS.push(`
.${P}-m2pp${n}{transition:background 450ms ${EASE},color 450ms ${EASE};border-radius:6px;color:${C.faint}}
${at(n)} .${P}-m2pp${n}{color:${C.ink};background:var(--pb)}
`);
}

const M2Ing = ({ n, tone, name, q }: { n: number; tone: Tone; name: string; q: string }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '14px 20px' }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{q}</div>
    </div>
  </div>
);

const M2Seg = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <span className={k(`m2pp${n}`)} style={vars({ pb: T[tone].bg })}>
    {children}
  </span>
);

const M2_Anatomy: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Une bonne demande en cinq ingrédients</Title>
    <Lede>Plus l’IA a de contexte, moins elle invente. Un ingrédient par clic.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M2Ing n={1} tone="blue" name="Rôle" q="Qui l’IA doit-elle être ?" />
      <M2Ing n={2} tone="teal" name="Contexte" q="Quelle situation, quelles données ?" />
      <M2Ing n={3} tone="green" name="Tâche" q="Que doit-elle produire ?" />
      <M2Ing n={4} tone="yellow" name="Format" q="Sous quelle forme ?" />
      <M2Ing n={5} tone="violet" name="Contraintes" q="Quelles limites, quel ton ?" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 280, width: 1060, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.blue}`, padding: '28px 36px 36px', ...dl(200) }}>
      <Eyebrow c={C.blue} size={22}>
        La demande de Mathieu
      </Eyebrow>
      <div style={{ marginTop: 16, fontSize: 35, lineHeight: 1.55 }}>
        <M2Seg n={1} tone="blue">
          Tu es chargé de projet chez un fabricant-installateur d’enveloppe en aluminium et verre.
        </M2Seg>{' '}
        <M2Seg n={2} tone="teal">
          Les dessins d’atelier du mur-rideau ont été soumis à l’architecte le 23 novembre, sans retour. Sans approbation d’ici le 7 décembre, la commande du verre glisse.
        </M2Seg>{' '}
        <M2Seg n={3} tone="green">
          Rédige une relance à l’architecte
        </M2Seg>{' '}
        <M2Seg n={4} tone="yellow">
          de six lignes au maximum, avec un objet clair.
        </M2Seg>{' '}
        <M2Seg n={5} tone="violet">
          Ton courtois mais précis. N’invente aucune date.
        </M2Seg>
      </div>
    </div>
  </Frame>
);

// ─── M2 · Before / after (interactive toggle) ───────────────────────────────
const M2_BeforeAfter: Page = () => {
  const [good, setGood] = useState(false);
  return (
    <Frame mod={2} kind="exercice">
      <Title>Même outil, deux demandes, deux résultats</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 204, ...dl(100) }}>
        <Toggle on={good} onChange={setGood} label={good ? 'Demande en cinq ingrédients' : 'Demande vague'} tone="green" size={28} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 290, width: 760 }}>
        <PromptBox size={30} style={{ boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${good ? C.green : C.coral}` }}>
          {good
            ? 'Tu es chargé de projet. Le verrier devait confirmer hier la date de livraison des unités scellées (projet des Méandres, commande du 8 décembre). Rédige une relance de cinq lignes : rappel de la commande, date attendue, impact sur la pose du 22 mars. Ton courtois et ferme.'
            : 'Fais-moi un courriel pour relancer le fournisseur.'}
        </PromptBox>
        <div style={{ marginTop: 26, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Tag tone={good ? 'green' : 'grey'}>Rôle</Tag>
          <Tag tone={good ? 'green' : 'grey'}>Contexte</Tag>
          <Tag tone={good ? 'green' : 'coral'}>Tâche</Tag>
          <Tag tone={good ? 'green' : 'grey'}>Format</Tag>
          <Tag tone={good ? 'green' : 'grey'}>Contraintes</Tag>
        </div>
      </div>
      <div key={good ? 'g' : 'b'} className={A.in} style={{ position: 'absolute', left: 940, top: 290, width: 860 }}>
        <AnswerBox id="copilot" size={27}>
          {good ? (
            <>
              <M2Line>
                <b>Objet</b> : Méandres · confirmation de livraison des unités scellées
              </M2Line>
              <M2Line>Bonjour, nous attendions hier la confirmation de la date de livraison des unités scellées (commande du 8 décembre).</M2Line>
              <M2Line>Notre pose du mur-rideau débute le 22 mars : il nous faut une livraison au plus tard le 15 février.</M2Line>
              <M2Line>Pourriez-vous nous confirmer la date d’ici jeudi ? Merci de votre suivi.</M2Line>
            </>
          ) : (
            <>
              <M2Line>Bonjour,</M2Line>
              <M2Line>Je me permets de revenir vers vous concernant notre dernière commande. Pourriez-vous me donner des nouvelles dès que possible ?</M2Line>
              <M2Line>Merci et bonne journée !</M2Line>
            </>
          )}
        </AnswerBox>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 600, color: good ? T.green.fg : T.coral.fg }}>
          <Icon name={good ? 'check' : 'alert'} size={30} />
          {good ? 'Utilisable tel quel, après vérification des dates.' : 'Poli… et inutile : quelle commande ? quelle date ?'}
        </div>
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 920, ...dl(500) }}>
        Cliquez l’interrupteur pour comparer
      </Hint>
    </Frame>
  );
};

// ─── M2 · Iterate (conversation) ────────────────────────────────────────────
const M2_Iterate: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>La première réponse n’est qu’un début</Title>
    <Lede>On affine en conversation, comme avec un collègue. Trois relances utiles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1120, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Bubble who="agent" name="Assistant" w={900} cls={A.in} style={dl(100)}>
        Voici les grandes étapes du lot enveloppe, du transfert des ventes au bâtiment fermé…
      </Bubble>
      <div className={b.on(1)}>
        <Bubble who="user" name="Mathieu" w={900}>
          Ajoute les dépendances entre les étapes et indique le chemin critique.
        </Bubble>
      </div>
      <div className={b.on(2)}>
        <Bubble who="user" name="Mathieu" w={900}>
          Le verre prend 8 semaines après l’approbation, pas 4. Recalcule.
        </Bubble>
      </div>
      <div className={b.on(3)}>
        <Bubble who="user" name="Mathieu" w={900}>
          Qu’est-ce que j’oublie ? Pose-moi 5 questions avant de finaliser.
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1300, top: 280, width: 500, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="route" title="Approfondir" cls={b.on(1)} size={24}>
        Demander ce qui manque : dépendances, responsables, livraisons.
      </Card>
      <Card tone="coral" icon="tool" title="Corriger" cls={b.on(2)} size={24}>
        Donner le fait que vous connaissez, l’IA ajuste le reste.
      </Card>
      <Card tone="green" icon="search" title="Inverser les rôles" cls={b.on(3)} size={24}>
        Laisser l’IA vous questionner : elle révèle les angles morts.
      </Card>
    </div>
    <Callout cls={b.on(4)} title="Astuce" tone="yellow" icon="bulb" size={26} style={{ position: 'absolute', left: 120, top: 790, width: 1120, padding: '14px 26px' }}>
      Une conversation par sujet. Quand elle part dans tous les sens, on en ouvre une nouvelle avec un résumé.
    </Callout>
  </Frame>
);

// ─── M2 · QCM & synthesis ───────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={3}
    title="Le bon outil"
    q="Nadia veut un résumé de la réunion de chantier d’hier, tenue dans Teams et transcrite, à laquelle elle n’a pas assisté. Que lui conseiller ?"
    explain="L’IA intégrée travaille là où sont les données : la transcription est déjà dans Teams. Pas de copier-coller, et les droits d’accès sont respectés."
  >
    <Opt why="Piège ! Possible, mais long et risqué : copier une transcription interne dans un outil public peut exposer des données.">Copier la transcription dans un ChatGPT gratuit</Opt>
    <Opt why="Piège ! Gemini fonctionne dans Google Workspace : il ne voit pas une réunion Teams.">Gemini dans Google Docs</Opt>
    <Opt why="Piège ! Possible pour un détail, mais c’est exactement le travail que l’IA fait bien.">Réécouter les 52 minutes d’enregistrement</Opt>
    <Opt ok why="Oui : avec la licence Microsoft 365 Copilot, le récapitulatif dans Teams résume la réunion et liste les tâches, sans sortir les données.">
      Le récapitulatif de Copilot dans Teams
    </Opt>
  </QcmPage>
);

const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Vérifiez si votre compte inclut Microsoft 365 Copilot, ou seulement Copilot Chat.
        <br />
        <br />
        Puis reprenez une demande que vous faites souvent et réécrivez-la en cinq ingrédients.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Quatre usages : <b>planifier, trier, rendre compte, relancer</b>.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Assistants <b>génériques</b> pour tout, IA <b>intégrée</b> là où sont vos données.
    </SynthRow>
    <SynthRow n={3} tone="coral" d={340}>
      Données confidentielles : uniquement un outil <b>approuvé</b>.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Rôle, contexte, tâche, format, contraintes : <b>cinq ingrédients</b>.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      On <b>affine en conversation</b> : approfondir, corriger, se faire questionner.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M2_Divider,
  M2_Lifecycle,
  M2_Time,
  M2_UcPlan,
  M2_UcTrack,
  M2_UcReport,
  M2_UcComm,
  M2_Matrix,
  M2_Families,
  M2_Generic,
  M2_Microsoft,
  M2_Google,
  M2_PmTools,
  M2_Choose,
  M2_Anatomy,
  M2_BeforeAfter,
  M2_Iterate,
  M2_Qcm,
  M2_Synth,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 11 h 15)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 2 : l'IA dans la gestion de projet. Maintenant qu'on sait ce qu'est l'IA, on la met au service de vos projets. »

« Au programme : l'IA à chaque étape de vos projets, du transfert des ventes à la fermeture ; quatre cas d'usage tirés de vos réponses au questionnaire : planifier, trier les courriels, rédiger les comptes rendus, relancer ; Copilot dans Outlook, Teams, Word et Excel, et l'IA qui arrive dans Procore, Smartsheet et Bluebeam ; et la compétence qui fait toute la différence : bien formuler sa demande. »

RYTHME — Le dîner tombe vers la page « Deux familles d'outils ». Les outils et les demandes se font après le dîner.

TRANSITION — « Commençons par le cycle de vos projets. »`,
  `⏱ 4 min · CYCLE DE VIE (5 clics)

OBJECTIF — Montrer que l'IA intervient à chaque étape, pas seulement pour « écrire des textes ».

DIRE — « Vous reconnaissez les étapes d'un lot d'enveloppe. Voyons ce que l'IA y apporte. »
→ beat 1 : « Transférer : le dossier arrive des ventes. L'IA résume la soumission et les exclusions, liste les intervenants, prépare les questions de la réunion de démarrage. »
→ beat 2 : « Planifier : les étapes et leurs dépendances, l'échéancier des dessins d'atelier et des commandes, le registre des risques. C'est l'atelier de cet après-midi. »
→ beat 3 : « Exécuter : comptes rendus de chantier, courriels, relances, demandes d'information. Le gros du volume. »
→ beat 4 : « Suivre : alertes sur les livraisons, rapport du vendredi, et comparer un avis de modification au contrat. Demain matin. »
→ beat 5 : « Fermer : la liste de déficiences, les documents de fin de projet, et ce qui passe au service après-vente. »

QUESTION — « À quelle étape perdez-vous le plus de temps ? »

TRANSITION — « Regardons où passe le temps de Mathieu. »`,
  `⏱ 3 min · LA SEMAINE DE MATHIEU (1 clic)

OBJECTIF — Relier l'IA à un irritant mesurable : le temps.

DIRE — « Mathieu a noté sa semaine, sur ses 13 projets. 11 heures de courriels et de relances, 9 heures de réunions et de visites, 6 heures à suivre les dessins et les commandes, 4 de rapports, 6 d'imprévus à régler, et 4 au téléphone ou au chantier. »
→ beat 1 : « L'IA aide surtout sur les quatre premières lignes : tri et résumés de courriels, comptes rendus, suivi, rapport du vendredi. Pas sur les imprévus ni sur la relation avec le chantier. »

INSISTER — « Le but n'est pas d'en faire plus. C'est de rendre du temps à ce que l'IA ne fait pas : régler les problèmes, être présent pour le chantier et pour le client. »

PRÉCISION — Ces heures sont un exemple, pas une statistique. Mais le questionnaire et le cadrage avec Valérie vont dans ce sens : les courriels et les relances arrivent en tête.

INTERACTION — « Si vous faisiez l'exercice, quelle serait votre plus grande barre ? » Écoutez deux ou trois réponses, dont une adjointe.

TRANSITION — « Quatre usages concrets, un par page. Premier : planifier. »`,
  `⏱ 4 min · CAS D'USAGE 1 : PLANIFICATION (2 clics)

OBJECTIF — Montrer une demande de planification réaliste et sa réponse.

DIRE — « À gauche, ce que l'IA fait bien au lancement d'un projet : résumer le dossier des ventes, ordonner les étapes, repérer les délais critiques, lister les risques. »
→ beat 1 : « La demande de Mathieu. Il dit qui il est, colle la soumission et les exclusions, et donne la date qui compte : le bâtiment fermé du 14 mai. »
→ beat 2 : « La réponse, en quelques secondes : six étapes cohérentes, et la bonne dépendance : le verre se commande après l'approbation des dessins. Est-ce parfait ? Non. Mais Mathieu ne part plus d'une page blanche. »

QUESTION — « Que manque-t-il dans ce découpage ? » Réponses possibles : les relevés après la structure, la mobilisation de l'équipe de pose, la protection des ouvrages, les essais d'étanchéité, les documents de fin de projet exigés par l'EG. « Bravo : c'est exactement votre valeur ajoutée. »

ATTENTION — Une soumission contient des prix. Elle ne se colle que dans Copilot avec le compte Lessard, jamais dans un compte personnel.

TRANSITION — « Deuxième usage : la boîte de réception. »`,
  `⏱ 4 min · CAS D'USAGE 2 : COURRIELS ET PRIORITÉS (2 clics)

OBJECTIF — Répondre au premier besoin exprimé au cadrage : le volume de courriels, les priorités, le transfert aux adjointes.

DIRE — « 80 courriels par jour sur 13 projets. Le vrai problème n'est pas de les lire : c'est de savoir lesquels comptent. »
→ beat 1 : « Mathieu demande un tri en quatre groupes : à traiter aujourd'hui, à transférer à Nadia avec la consigne, à relancer, à classer. »
→ beat 2 : « La réponse : trois urgences, quatre transferts, deux relances. Les demandes restées sans réponse ressortent toutes seules. »

INSISTER — L'IA propose, Mathieu décide. Il vérifie surtout la colonne « à traiter aujourd'hui » : un courriel urgent mal classé coûte cher.

DANS OUTLOOK — Avec la licence Microsoft 365 Copilot : « Résumer » en haut d'un fil, et la fonction « Prioriser ma boîte de réception » dans le nouvel Outlook (elle marque les courriels importants). Avec Copilot Chat seulement : copier les courriels dans Copilot, avec le compte Lessard.

TRANSITION — « Troisième usage : les comptes rendus. »`,
  `⏱ 3 min · CAS D'USAGE 3 : COMPTES RENDUS (2 clics)

OBJECTIF — Répondre au deuxième besoin du cadrage : comptes rendus de réunion et synthèse des visites de chantier.

DIRE — « Le compte rendu de la réunion de chantier : une heure en moyenne, souvent le soir. »
→ beat 1 : « Mathieu colle ses notes en vrac et impose une structure : décisions, actions avec qui, quoi, quand, points ouverts. Et une consigne précieuse : n'invente rien, écris "à confirmer". »
→ beat 2 : « Le résultat : une décision conditionnelle, deux actions, un point ouvert. Et la date de la grue reste "à confirmer" : l'IA n'a pas comblé le trou. »

LIEN — « Demain, on fera la même chose avec une visite de chantier : des notes dictées et des photos, transformées en rapport et en liste de déficiences. »

INSISTER — Le compte rendu engage Lessard : une décision mal rapportée peut servir dans une réclamation. Relecture obligatoire.

TRANSITION — « Quatrième usage : les relances. »`,
  `⏱ 3 min · CAS D'USAGE 4 : RELANCES ET SUIVIS (2 clics)

OBJECTIF — Répondre au besoin du questionnaire : « faire des suivis auprès des clients ».

DIRE — « Les dessins d'atelier du mur-rideau attendent l'approbation de l'architecte depuis le 23 novembre. Chaque jour de retard pousse la commande du verre. »
→ beat 1 : « Une seule demande pour trois messages : une relance courtoise, une relance ferme à envoyer dans cinq jours, et un courriel à Boréa pour l'informer du risque. Ici avec Claude, que certains d'entre vous ont. »
→ beat 2 : « Trois tons, trois publics. La relance ferme rappelle le délai du verre : c'est l'argument qui fait bouger. »

ASTUCE — Pour un message délicat, demandez aussi : « Relis ce courriel comme si tu étais l'architecte. Qu'est-ce qui pourrait l'irriter ? »

NUANCE — « Automatique » ne veut pas dire « envoyé sans vous ». L'IA prépare le brouillon ; demain, on verra comment préparer ces relances à l'avance, mais l'envoi reste humain.

TRANSITION — « À vous de juger : que confier à l'IA ? »`,
  `⏱ 6 min · EXERCICE MATRICE (glisser-déposer)

OBJECTIF — Développer le jugement : gain de temps versus risque en cas d'erreur.

ANIMATION — Pour chaque étiquette, demandez une case à voix haute (« priorité », « relecture », « pour soi », « si le temps ») et glissez-la selon la majorité. Double-cliquer une étiquette la remet à sa place. Laissez débattre : il n'y a pas de corrigé unique.

PISTES DE CORRIGÉ —
• À confier en priorité : résumer un fil de 30 courriels, ordre du jour de la réunion, reformuler une note interne.
• Avec relecture attentive : compte rendu de chantier (il engage Lessard), annonce d'un retard au client, prix d'un avenant (l'IA met en forme, les chiffres se vérifient).
• À garder pour soi : accepter un avis de modification, évaluation d'un employé.

DÉBAT ATTENDU — « Compte rendu de chantier » : certains le mettront en priorité. Oui pour le gain, mais une décision mal rapportée peut coûter cher en cas de litige : relecture attentive.

TRANSITION — « Avec quels outils ? Deux familles. » (Dîner vers ici selon l'heure.)`,
  `⏱ 3 min · DEUX FAMILLES D'OUTILS (1 clic)

OBJECTIF — Distinguer assistants génériques et IA intégrée.

DIRE — « Première famille : les assistants génériques. Copilot Chat, Claude, ChatGPT, Gemini. Une fenêtre de conversation, pour tout. Avantage chez vous : Copilot Chat est inclus avec votre compte Microsoft 365. Limites : ils ne voient que ce que vous leur collez, et on copie-colle entre les outils. »
→ beat 1 : « Deuxième famille : l'IA intégrée, dans Outlook, Teams, Excel, et maintenant Procore, Smartsheet, Bluebeam. Elle voit vos courriels, vos réunions, vos documents, et agit sur place. Limites : une licence en plus, et chaque IA reste dans son outil. »

MESSAGE CLÉ — Les deux se complètent. Le générique pour réfléchir et rédiger ; l'intégré pour travailler sur vos courriels, réunions et dossiers.

TRANSITION — « Faisons le tour des génériques. »`,
  `⏱ 3 min · QUATRE ASSISTANTS

OBJECTIF — Présenter les quatre assistants, en partant de ce que Lessard a.

DIRE — « Copilot, de Microsoft : votre outil de référence. Copilot Chat est accessible à tous avec le compte Lessard ; la licence Microsoft 365 Copilot l'ajoute dans Outlook, Teams, Word et Excel. Claude, d'Anthropic : quelques comptes chez vous ; il est apprécié pour les longs documents, un devis de 300 pages par exemple. ChatGPT, d'OpenAI : tout le monde le connaît, mais jamais de données de clients dans un compte personnel. Gemini, de Google : surtout utile pour qui travaille dans Google. »

MESSAGE CLÉ — « Le meilleur assistant, c'est celui que votre organisation autorise. Les écarts de qualité sont faibles pour nos usages ; les écarts de confidentialité, eux, sont importants. »

À VÉRIFIER — Avant la session, confirmez avec Valérie ou les TI qui a une licence Microsoft 365 Copilot complète et qui a un compte Claude.

DÉMO OPTIONNELLE — Posez la même question à Copilot et à Claude, et comparez en direct.

TRANSITION — « Copilot là où vous travaillez : Outlook et Teams. »`,
  `⏱ 4 min · DÉMO OUTLOOK ET TEAMS (2 clics)

OBJECTIF — Montrer concrètement Copilot sur des courriels et une réunion.

DIRE — « À gauche, Outlook. Un fil de 14 messages sur les dessins d'atelier du mur-rideau : l'architecte, Boréa, Hélène. »
→ beat 1 : « Copilot le résume : deux corrections demandées, une date de pose attendue, une inquiétude d'Hélène, et surtout : aucune réponse envoyée. Mathieu sait quoi faire en 20 secondes. »
« À droite, Teams. La réunion de chantier a été transcrite. »
→ beat 2 : « Le récapitulatif : la décision, la tâche avec son responsable et son échéance, le point ouvert. »

PRÉCAUTION — Lire l'encadré : ces fonctions exigent la licence Microsoft 365 Copilot. La transcription doit être activée, et les participants informés (module 5). Une réunion de chantier se tient souvent sur place, sans Teams : la solution est alors la dictée de notes, demain matin.

DÉMO EN DIRECT — Si vous avez accès à Microsoft 365 Copilot, montrez « Résumer » dans un fil Outlook de démonstration.

TRANSITION — « Et dans les autres outils Microsoft ? »`,
  `⏱ 2 min · WORD, EXCEL, PLANNER, POWER AUTOMATE

OBJECTIF — Montrer Copilot dans les autres outils Microsoft 365 de l'équipe.

DIRE — « Dans Word : résumer un devis ou un contrat, comparer deux versions, rédiger une lettre ou un rapport de visite. Dans Excel : analyser le registre des livraisons, écrire une formule. Dans Planner : créer un plan à partir d'un objectif. Et dans Power Automate : décrire un flux en français, par exemple "quand un courriel de Boréa arrive, l'enregistrer dans le dossier du projet". »

MESSAGE CLÉ — « L'IA travaille là où sont vos documents, avec vos droits d'accès. Mais tout dépend de la licence. »

QUESTION — « Qui utilise Planner ou Power Automate aujourd'hui ? » Adaptez les démonstrations de demain.

TRANSITION — « Et dans vos outils métier ? »`,
  `⏱ 3 min · VOS OUTILS MÉTIER

OBJECTIF — Faire le point sur l'IA dans les outils cités au questionnaire : Procore, Smartsheet, Bluebeam.

DIRE — Parcourez les trois tuiles :
• Procore : l'IA de Procore (Helix) propose des agents qui rédigent les demandes d'information, recoupent les documents soumis et suivent les journaux de chantier. Déploiement progressif en 2026 : tous les comptes ne l'ont pas.
• Smartsheet : décrire une formule en français, résumer une feuille, des colonnes qui classent chaque ligne. Réservé au forfait Enterprise.
• Bluebeam Max : l'offre premium de 2026. Recherche en langage naturel, et Claude peut piloter Revu : créer des étiquettes de pages, des signets, des annotations.

LIEN AVEC LA VOÛTE — Le besoin « remplacer des pages dans notre voûte » : aujourd'hui, la fonction de feuilles de remplacement par lot de Bluebeam (Batch Slip Sheet) le fait déjà, sans IA. Demain, Bluebeam Max avec Claude pourra peut-être enchaîner ces gestes à partir d'une consigne en français. À tester avec les TI avant d'y compter.

À VÉRIFIER — Ces fonctions évoluent vite ; vérifiez avant la session ce que Lessard a activé.

TRANSITION — « Comment choisir, alors ? Trois questions. »`,
  `⏱ 3 min · CHOISIR L'OUTIL (3 clics)

OBJECTIF — Donner un réflexe de choix fondé sur les données.

DIRE — « Première question, toujours la même : les données sont-elles confidentielles ou personnelles ? Un prix, un contrat, l'adresse d'un client, un nom : oui. »
→ beat 1 : « Si oui : uniquement un outil approuvé par Lessard, Copilot avec votre compte. Si non, on continue. »
→ beat 2 : « L'information est-elle déjà dans Outlook, Teams, Procore ? Si oui : l'IA intégrée. Elle voit le contexte et respecte les droits d'accès. »
→ beat 3 : « Besoin ponctuel, un texte, une idée ? Un assistant générique fait très bien l'affaire. »

INSISTER — Le choix commence par les données, pas par la puissance de l'outil. Claude : à utiliser pour des données de projet seulement si Lessard l'a approuvé pour cet usage.

TRANSITION — « Quel que soit l'outil, une compétence fait la différence : bien demander. »`,
  `⏱ 5 min · CINQ INGRÉDIENTS (5 clics)

OBJECTIF — Donner une structure de demande simple et mémorisable.

DIRE — « À droite, la demande de Mathieu, en gris. À chaque clic, un ingrédient s'allume. »
→ beat 1 : « Le rôle : "Tu es chargé de projet chez un fabricant-installateur d'enveloppe en aluminium et verre." On oriente le vocabulaire : dessins d'atelier, mur-rideau, verrier. »
→ beat 2 : « Le contexte : la date d'envoi, l'absence de retour, l'impact sur la commande du verre. C'est l'ingrédient le plus oublié, et le plus important. »
→ beat 3 : « La tâche : rédiger une relance. Un verbe d'action clair. »
→ beat 4 : « Le format : six lignes, un objet clair. »
→ beat 5 : « Les contraintes : courtois mais précis, et "n'invente aucune date". Cette dernière phrase est précieuse : elle empêche l'IA de promettre à votre place. »

MÉMO — Rôle, Contexte, Tâche, Format, Contraintes.

TRANSITION — « Voyons la différence en direct. »`,
  `⏱ 4 min · EXERCICE AVANT / APRÈS (interrupteur)

OBJECTIF — Faire constater l'effet du contexte sur la qualité.

ANIMATION — Commencez sur « Demande vague ». Lisez la demande et la réponse. Puis cliquez l'interrupteur.

DIRE — « Demande vague : "Fais-moi un courriel pour relancer le fournisseur." Réponse : polie, et inutile. Quelle commande ? Quelle date ? Le verrier va répondre "laquelle ?". »
Cliquez l'interrupteur : « Même outil, demande en cinq ingrédients. Réponse : un objet clair, la commande, la date attendue, l'impact et une échéance de réponse. Utilisable, après vérification des dates. »

QUESTION — « Qu'est-ce qui a fait la différence ? » Réponse attendue : le contexte et le format.

TRANSITION — « Et si la réponse ne convient pas ? On ne recommence pas : on converse. »`,
  `⏱ 3 min · ITÉRER (4 clics)

OBJECTIF — Montrer que la qualité vient de la conversation.

DIRE — « L'assistant propose les grandes étapes du lot. Ce n'est qu'un début. »
→ beat 1 : « Approfondir : "Ajoute les dépendances et le chemin critique." »
→ beat 2 : « Corriger : "Le verre prend 8 semaines après l'approbation, pas 4." Vous apportez le fait, l'IA recalcule le reste. »
→ beat 3 : « Inverser les rôles : "Pose-moi 5 questions avant de finaliser." C'est la relance la plus sous-utilisée, et la plus puissante. »
→ beat 4 : « Astuce : une conversation par sujet, ou par projet. Si elle part dans tous les sens, demandez un résumé et ouvrez une nouvelle conversation. »

TRANSITION — « Un dernier QCM sur le choix d'outil. »`,
  `⏱ 3 min · QCM 3

RÉPONSE — D : le récapitulatif de Copilot dans Teams (avec la licence Microsoft 365 Copilot).
• A ✗ PIÈGE — Copier une transcription interne dans un ChatGPT gratuit peut exposer des données.
• B ✗ PIÈGE — Gemini ne voit pas une réunion Teams.
• C ✗ PIÈGE — Possible, mais c'est justement ce que l'IA fait bien.

NUANCE — Sans licence Microsoft 365 Copilot, la bonne réponse devient : demander le compte rendu à Mathieu, ou coller la transcription dans Copilot Chat avec le compte Lessard.

TRANSITION — « Faisons le bilan du module 2. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 2

DIRE — Relisez les cinq points :
1. Quatre usages : planifier, trier, rendre compte, relancer.
2. Génériques pour tout, intégrés là où sont les données.
3. Données confidentielles : uniquement un outil approuvé, Copilot avec le compte Lessard.
4. Cinq ingrédients : rôle, contexte, tâche, format, contraintes.
5. On affine en conversation.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « Assez parlé : place à l'atelier 1. Vous allez lancer le projet des Méandres. »`,
];
// @@NOTES-END
