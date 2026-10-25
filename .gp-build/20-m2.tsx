// ─── M2 · Divider ───────────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title="L’IA dans la gestion de projet" sub="Planifier, suivre, rendre compte, communiquer : quatre usages, vos outils du quotidien." dur="≈ 1 h 30">
    <SecItem n={1}>L’IA à chaque phase du cycle de vie</SecItem>
    <SecItem n={2}>Quatre cas d’usage : planification, suivi, reporting, communication</SecItem>
    <SecItem n={3}>L’IA dans Outlook, Teams, Google, Notion, Trello…</SecItem>
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
      <M2Phase i={1} n={1} tone="blue" name="Démarrer">
        <M2Use icon="doc" tone="blue">
          Premier jet de la charte de projet
        </M2Use>
        <M2Use icon="users" tone="blue">
          Liste des parties prenantes
        </M2Use>
        <M2Use icon="search" tone="blue">
          Questions à poser au commanditaire
        </M2Use>
      </M2Phase>
      <M2Phase i={2} n={2} tone="teal" name="Planifier">
        <M2Use icon="layers" tone="teal">
          Découpage en lots et en tâches
        </M2Use>
        <M2Use icon="gantt" tone="teal">
          Échéancier et jalons de départ
        </M2Use>
        <M2Use icon="alert" tone="teal">
          Registre des risques
        </M2Use>
      </M2Phase>
      <M2Phase i={3} n={3} tone="green" name="Exécuter">
        <M2Use icon="note" tone="green">
          Comptes rendus de réunion
        </M2Use>
        <M2Use icon="mail" tone="green">
          Courriels et relances
        </M2Use>
        <M2Use icon="book" tone="green">
          Procédures et documents
        </M2Use>
      </M2Phase>
      <M2Phase i={4} n={4} tone="violet" name="Suivre">
        <M2Use icon="bell" tone="violet">
          Alertes sur les retards
        </M2Use>
        <M2Use icon="chart" tone="violet">
          Rapport d’avancement
        </M2Use>
        <M2Use icon="trend" tone="violet">
          Écarts de budget expliqués
        </M2Use>
      </M2Phase>
      <M2Phase i={5} n={5} tone="yellow" name="Clôturer">
        <M2Use icon="star" tone="yellow">
          Bilan de projet
        </M2Use>
        <M2Use icon="bulb" tone="yellow">
          Leçons apprises
        </M2Use>
        <M2Use icon="archive" tone="yellow">
          Documentation de transfert
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
    <Title>Où passe la semaine de Karim ?</Title>
    <Lede>Une semaine type de 40 heures, telle qu’il l’a notée. L’IA aide surtout… là où ça déborde.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 40px' }}>
      <M2Bar i={0} label="Réunions" h={11} tone="blue" ai="comptes rendus" />
      <M2Bar i={1} label="Courriels et relances" h={9} tone="blue" ai="rédaction, résumés" />
      <M2Bar i={2} label="Planification" h={6} tone="teal" ai="premiers jets" />
      <M2Bar i={3} label="Rapports et tableaux" h={5} tone="teal" ai="rapport hebdo" />
      <M2Bar i={4} label="Imprévus à régler" h={5} tone="grey" />
      <M2Bar i={5} label="Sur le terrain, avec l’équipe" h={4} tone="grey" />
    </div>
    <Callout cls={b.on(1)} title="Le vrai gain" tone="green" icon="clock" style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(500) }}>
      Le temps libéré sur la compilation revient à ce que l’IA ne fait pas : les imprévus et l’équipe.
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
      Karim
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
    lede="Passer de la page blanche à une première structure en quelques minutes."
    items={
      <>
        <M2Item d={100} icon="layers" tone="teal">
          Découper en lots et en tâches
        </M2Item>
        <M2Item d={200} icon="route" tone="teal">
          Proposer un ordre et des dépendances
        </M2Item>
        <M2Item d={300} icon="clock" tone="teal">
          Estimer des durées de départ
        </M2Item>
        <M2Item d={400} icon="alert" tone="teal">
          Lister risques et parties prenantes
        </M2Item>
      </>
    }
    prompt="Tu es chargé de projet. J’ouvre une boutique-atelier de vélos à Québec dans 22 semaines (budget 420 k$, 8 embauches, travaux, TI, campagne). Propose un découpage en 6 lots au maximum, avec les tâches principales de chacun."
    answer={
      <>
        <M2Line>
          <b>1. Cadrage</b> : charte, budget détaillé, comité de suivi
        </M2Line>
        <M2Line>
          <b>2. Local et travaux</b> : plans, soumissions, permis, chantier
        </M2Line>
        <M2Line>
          <b>3. Ressources humaines</b> : postes, affichage, entrevues, formation
        </M2Line>
        <M2Line>
          <b>4. Systèmes TI</b> : caisse, inventaire, réseau, rendez-vous
        </M2Line>
        <M2Line>
          <b>5. Marketing</b> : campagne locale, portes ouvertes · <b>6. Ouverture</b> : essais, inauguration
        </M2Line>
      </>
    }
  />
);

const M2_UcTrack: Page = () => (
  <M2Case
    n={2}
    tone="violet"
    icon="eye"
    title="Suivi"
    lede="Savoir ce qui glisse avant que ça devienne un problème."
    items={
      <>
        <M2Item d={100} icon="inbox" tone="violet">
          Consolider les mises à jour de l’équipe
        </M2Item>
        <M2Item d={200} icon="bell" tone="violet">
          Repérer les retards et leurs effets
        </M2Item>
        <M2Item d={300} icon="search" tone="violet">
          Répondre à « Où en est-on ? »
        </M2Item>
        <M2Item d={400} icon="calendar" tone="violet">
          Préparer la réunion de suivi
        </M2Item>
      </>
    }
    prompt="Voici l’export des tâches de la semaine (statut, responsable, échéance). Quelles tâches sont en retard ou à risque ? Quel effet sur le jalon « Travaux terminés » du 5 mars ?"
    answer={
      <>
        <M2Line>
          <b>3 tâches en retard</b> : soumission de l’électricien (Karim, 4 jours), choix du logiciel de caisse (Annie, 2 jours), affichage des postes (Julie, 1 jour).
        </M2Line>
        <M2Line>
          <b>Effet</b> : la soumission de l’électricien est sur le chemin critique. Sans décision d’ici vendredi, le jalon du 5 mars glisse d’environ une semaine.
        </M2Line>
      </>
    }
  />
);

const M2_UcReport: Page = () => (
  <M2Case
    n={3}
    tone="blue"
    icon="chart"
    title="Reporting"
    lede="Le rapport du vendredi en 5 minutes au lieu d’une heure."
    items={
      <>
        <M2Item d={100} icon="doc" tone="blue">
          Rédiger le rapport d’avancement
        </M2Item>
        <M2Item d={200} icon="target" tone="blue">
          Résumer pour la direction en 5 lignes
        </M2Item>
        <M2Item d={300} icon="gauge" tone="blue">
          Proposer une météo vert, jaune, rouge
        </M2Item>
        <M2Item d={400} icon="chart" tone="blue">
          Mettre des données en tableau
        </M2Item>
      </>
    }
    app="copilot"
    prompt="À partir de mes notes ci-dessous, rédige le rapport hebdomadaire pour Luc : météo globale, avancement, 3 points d’attention, décision attendue. 150 mots au maximum."
    answer={
      <>
        <M2Line>
          <b>Météo : JAUNE</b>. Avancement 38 % (prévu : 40 %).
        </M2Line>
        <M2Line>
          <b>Points d’attention</b> : soumission de l’électricien en retard ; logiciel de caisse à choisir ; 2 postes sans candidat.
        </M2Line>
        <M2Line>
          <b>Décision attendue</b> : approuver un dépassement de 6 000 $ sur le lot électricité.
        </M2Line>
      </>
    }
  />
);

const M2_UcComm: Page = () => (
  <M2Case
    n={4}
    tone="yellow"
    icon="megaphone"
    title="Communication"
    lede="Le bon message, au bon public, dans le bon ton."
    items={
      <>
        <M2Item d={100} icon="users" tone="yellow">
          Adapter un message à chaque public
        </M2Item>
        <M2Item d={200} icon="mail" tone="yellow">
          Rédiger un courriel délicat
        </M2Item>
        <M2Item d={300} icon="calendar" tone="yellow">
          Préparer l’ordre du jour
        </M2Item>
        <M2Item d={400} icon="globe" tone="yellow">
          Simplifier ou traduire un document
        </M2Item>
      </>
    }
    app="claude"
    prompt="Le fournisseur de comptoirs annonce 2 semaines de retard. Rédige trois versions : un courriel à Luc (impact et options), un message Teams à l’équipe (actions), une réponse polie au fournisseur."
    answer={
      <>
        <M2Line>
          <b>À Luc</b> : « Retard des comptoirs : impact limité si on inverse deux tâches. Deux options… »
        </M2Line>
        <M2Line>
          <b>À l’équipe</b> : « Les comptoirs arrivent le 19 au lieu du 5. Annie, on avance le câblage réseau… »
        </M2Line>
        <M2Line>
          <b>Au fournisseur</b> : « Merci de nous avoir prévenus. Pourriez-vous nous transmettre d’ici jeudi… »
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
      Compte rendu de réunion
    </Drag>
    <Drag x={120} y={350} w={360} tone="blue" size={22}>
      Annonce d’un retard au client
    </Drag>
    <Drag x={120} y={430} w={360} tone="blue" size={22}>
      Premier découpage des tâches
    </Drag>
    <Drag x={120} y={510} w={360} tone="blue" size={22}>
      Décision de reporter l’ouverture
    </Drag>
    <Drag x={120} y={590} w={360} tone="blue" size={22}>
      Ordre du jour de la réunion
    </Drag>
    <Drag x={120} y={670} w={360} tone="blue" size={22}>
      Budget final à présenter
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
          <AppChip id="chatgpt" />
          <AppChip id="gemini" />
          <AppChip id="copilot" />
          <AppChip id="claude" />
        </>
      }
    >
      <M2Pro ok>Polyvalents : rédiger, planifier, analyser</M2Pro>
      <M2Pro ok>Versions gratuites pour commencer</M2Pro>
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
          <AppChip id="teams" />
          <AppChip id="outlook" />
          <AppChip id="google" />
          <AppChip id="notion" />
          <AppChip id="clickup" />
          <AppChip id="trello" />
        </>
      }
    >
      <M2Pro ok>Voit vos courriels, réunions, tâches</M2Pro>
      <M2Pro ok>Agit sur place : crée, résume, met à jour</M2Pro>
      <M2Pro ok={false}>Souvent une licence payante</M2Pro>
      <M2Pro ok={false}>Limitée à son propre outil</M2Pro>
    </M2Family>
    <Callout cls={b.on(1)} title="Les deux se complètent" tone="blue" icon="puzzle" style={{ position: 'absolute', left: 120, top: 840, width: 1680, ...dl(400) }}>
      Le générique pour réfléchir et rédiger, l’intégré pour travailler sur les données du projet.
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
      <M2Assist d={100} id="chatgpt" by="OpenAI" tip="Le plus répandu : beaucoup de tutoriels et d’exemples.">
        Rédaction, analyse de fichiers, recherche sur le web, images.
      </M2Assist>
      <M2Assist d={220} id="gemini" by="Google" tip="Naturel si votre organisation est sur Google Workspace.">
        Relié aux services Google : Gmail, Docs, Drive, Meet.
      </M2Assist>
      <M2Assist d={340} id="copilot" by="Microsoft" tip="Naturel si votre organisation est sur Microsoft 365.">
        Copilot Chat pour tous ; Microsoft 365 Copilot dans Word, Outlook, Teams.
      </M2Assist>
      <M2Assist d={460} id="claude" by="Anthropic" tip="Apprécié pour les longs documents et la rédaction.">
        Rédaction soignée, analyse de documents, raisonnement.
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
    <AppWin id="outlook" title="Retard comptoirs (14 messages)" cls={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 820, ...dl(100) }}>
      <M2Mail from="Fournisseur" subj="RE: RE: Livraison des comptoirs, nouvelle date" />
      <M2Mail from="Maxime" subj="RE: Est-ce que ça touche les portes ouvertes ?" faded />
      <M2Mail from="Luc" subj="RE: On a une option B ?" faded />
      <div className={b.on(1)}>
        <M2Mini>
          <b>Résumé par Copilot</b> : livraison reportée du 5 au 19 février. Le fournisseur propose une pose le samedi. Luc demande une option B. Aucune décision prise.
        </M2Mini>
      </div>
    </AppWin>
    <AppWin id="teams" title="Suivi hebdo · projet Limoilou" cls={A.right} style={{ position: 'absolute', left: 980, top: 280, width: 820, ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.soft }}>
        <Icon name="video" size={26} color={C.violet} /> Réunion terminée · 52 min · transcription activée
      </div>
      <div className={b.on(2)}>
        <M2Mini>
          <b>Récapitulatif</b>
          <br />• Décision : pose des comptoirs le samedi 20 février.
          <br />• Tâche : Annie avance le câblage réseau (échéance 12 février).
          <br />• Point ouvert : impact sur la date des portes ouvertes.
        </M2Mini>
      </div>
    </AppWin>
    <Callout cls={A.in} title="Avant de promettre ces fonctions à votre équipe" tone="blue" icon="key" size={25} style={{ position: 'absolute', left: 120, top: 840, width: 1680, padding: '14px 26px', ...dl(500) }}>
      Elles dépendent de votre licence et des réglages de vos TI. Le récapitulatif exige que la réunion soit transcrite.
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
    <Title>L’IA dans Google Workspace</Title>
    <Lede>Gemini est intégré aux applications Google, selon l’édition de votre organisation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 26 }}>
      <M2GTile d={100} icon="mail" app="Gmail">
        Résumer un long fil, proposer une réponse, retrouver une information dans vos courriels.
      </M2GTile>
      <M2GTile d={220} icon="doc" app="Docs">
        « Aide-moi à écrire » : premier jet d’une charte, d’une procédure, d’un bilan.
      </M2GTile>
      <M2GTile d={340} icon="chart" app="Sheets">
        Créer un tableau de suivi, expliquer une formule, analyser des données.
      </M2GTile>
      <M2GTile d={460} icon="video" app="Meet">
        « Prendre des notes pour moi » : un document de notes partagé après la réunion.
      </M2GTile>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 22, alignItems: 'center', ...dl(600) }}>
      <AppTile id="gemini" size={60} />
      <span style={{ fontSize: 27, lineHeight: 1.4, color: C.ink }}>
        Même logique que Microsoft : l’IA travaille <b>là où sont vos documents</b>, avec les droits d’accès que vous avez déjà.
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
    <Title>L’IA dans les outils de gestion de projet</Title>
    <Lede>Tous ajoutent de l’IA. Ce qu’elle fait concrètement, outil par outil.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M2Tool d={100} id="notion">
        Notion AI : rédiger et résumer des pages, répondre à des questions sur l’espace, notes de réunion.
      </M2Tool>
      <M2Tool d={200} id="clickup">
        ClickUp Brain : générer des tâches et sous-tâches, résumer un fil, rédiger une mise à jour de statut.
      </M2Tool>
      <M2Tool d={300} id="trello">
        Trello : IA d’Atlassian pour rédiger une carte, la résumer ou en tirer une liste de contrôle.
      </M2Tool>
      <M2Tool d={400} id="planner">
        Microsoft Planner : créer un plan et des tâches à partir d’un objectif, avec Copilot.
      </M2Tool>
      <M2Tool d={500} id="asana">
        Asana : résumés de projet, statuts rédigés à partir des tâches, règles intelligentes.
      </M2Tool>
      <M2Tool d={600} id="monday">
        monday.com : générer des tâches, résumer des mises à jour, remplir des colonnes.
      </M2Tool>
    </div>
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
      Uniquement un outil <b>approuvé</b> par votre organisation (version entreprise).
    </M2A>
    <M2YesNo x={250} y={410} yes={false} />
    <M2Q x={120} y={510} n={1}>
      L’information est-elle déjà dans Teams, Notion, ClickUp… ?
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
        La demande de Karim
      </Eyebrow>
      <div style={{ marginTop: 16, fontSize: 35, lineHeight: 1.55 }}>
        <M2Seg n={1} tone="blue">
          Tu es un chargé de projet expérimenté dans le commerce de détail.
        </M2Seg>{' '}
        <M2Seg n={2} tone="teal">
          J’ouvre une boutique-atelier de vélos à Québec le 10 avril. Budget : 420 k$. Équipe : RH, marketing, TI, opérations.
        </M2Seg>{' '}
        <M2Seg n={3} tone="green">
          Propose les jalons principaux du projet
        </M2Seg>{' '}
        <M2Seg n={4} tone="yellow">
          sous forme de tableau : jalon, date cible, responsable, condition de réussite.
        </M2Seg>{' '}
        <M2Seg n={5} tone="violet">
          Huit jalons au maximum. Signale les dates que tu as dû deviner.
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
            ? 'Tu es chargé de projet. Boutique de vélos à Québec, ouverture le 10 avril, 8 embauches. Propose le plan de recrutement en tableau : poste, date d’affichage, date d’entrée, formation. Signale ce qui est serré.'
            : 'Fais-moi un plan pour recruter du monde.'}
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
        <AnswerBox size={27}>
          {good ? (
            <>
              <M2Line>
                <b>Mécaniciens (3)</b> : affichage 4 janvier · entrée 8 mars · formation atelier 2 semaines
              </M2Line>
              <M2Line>
                <b>Conseillers vente (4)</b> : affichage 18 janvier · entrée 22 mars · formation produits 1 semaine
              </M2Line>
              <M2Line>
                <b>Gérant(e) (1)</b> : affichage 7 décembre · entrée 1ᵉʳ février
              </M2Line>
              <M2Line>
                <b>Point serré</b> : les mécaniciens. Pénurie dans la région : commencer dès décembre.
              </M2Line>
            </>
          ) : (
            <>
              <M2Line>Voici un plan de recrutement en 7 étapes :</M2Line>
              <M2Line>1. Définir vos besoins · 2. Rédiger une offre attrayante · 3. Publier sur les plateformes d’emploi · 4. Trier les candidatures · 5. Mener les entrevues · 6. Faire une offre · 7. Accueillir la recrue.</M2Line>
              <M2Line>Bonne chance dans votre recrutement !</M2Line>
            </>
          )}
        </AnswerBox>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 600, color: good ? T.green.fg : T.coral.fg }}>
          <Icon name={good ? 'check' : 'alert'} size={30} />
          {good ? 'Utilisable tel quel, à vérifier avec Julie.' : 'Juste… et inutilisable : rien sur votre projet.'}
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
        Voici 8 jalons pour l’ouverture de la boutique, du cadrage à l’inauguration…
      </Bubble>
      <div className={b.on(1)}>
        <Bubble who="user" name="Karim" w={900}>
          Ajoute les dépendances entre les jalons et indique le chemin critique.
        </Bubble>
      </div>
      <div className={b.on(2)}>
        <Bubble who="user" name="Karim" w={900}>
          Le permis prend 6 semaines à Québec, pas 2. Recalcule.
        </Bubble>
      </div>
      <div className={b.on(3)}>
        <Bubble who="user" name="Karim" w={900}>
          Qu’est-ce que j’oublie ? Pose-moi 5 questions avant de finaliser.
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1300, top: 280, width: 500, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="route" title="Approfondir" cls={b.on(1)} size={24}>
        Demander ce qui manque : dépendances, responsables, coûts.
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
    q="Annie veut un résumé de la réunion Teams d’hier, transcrite, à laquelle elle n’a pas assisté. Que lui conseiller ?"
    explain="L’IA intégrée travaille là où sont les données : la transcription est déjà dans Teams. Pas de copier-coller, et les droits d’accès sont respectés."
  >
    <Opt why="Piège ! Possible, mais long et risqué : copier une transcription interne dans un outil public peut exposer des données.">Copier la transcription dans un ChatGPT gratuit</Opt>
    <Opt ok why="Oui : si la licence le permet, le récapitulatif de Copilot dans Teams résume la réunion et liste les tâches, sans sortir les données.">
      Le récapitulatif de Copilot dans Teams
    </Opt>
    <Opt why="Piège ! Gemini fonctionne dans Google Workspace : il ne voit pas une réunion Teams.">Gemini dans Google Docs</Opt>
    <Opt why="Piège ! Possible pour un détail, mais c’est exactement le travail que l’IA fait bien.">Réécouter les 52 minutes d’enregistrement</Opt>
  </QcmPage>
);

const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Vérifiez quelle IA votre organisation autorise et ce que votre licence inclut.
        <br />
        <br />
        Puis reprenez une demande que vous faites souvent et réécrivez-la en cinq ingrédients.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Quatre usages : <b>planifier, suivre, rendre compte, communiquer</b>.
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

« Au programme : l'IA à chaque phase du cycle de vie ; quatre cas d'usage concrets sur le projet de Karim ; l'IA dans les outils que vous utilisez déjà, Outlook, Teams, Google, Notion, Trello, ClickUp ; et la compétence qui fait toute la différence : bien formuler sa demande. »

RYTHME — Le dîner tombe vers la page « Deux familles d'outils ». Les outils et les demandes se font après le dîner.

TRANSITION — « Commençons par le cycle de vie que vous connaissez. »`,
  `⏱ 4 min · CYCLE DE VIE (5 clics)

OBJECTIF — Montrer que l'IA intervient à chaque phase, pas seulement pour « écrire des textes ».

DIRE — « Vous reconnaissez les cinq phases. Voyons ce que l'IA y apporte. »
→ beat 1 : « Démarrer : un premier jet de la charte, la liste des parties prenantes, et les questions à poser au commanditaire avant de commencer. »
→ beat 2 : « Planifier : le découpage en tâches, l'échéancier de départ, le registre des risques. C'est l'atelier de cet après-midi. »
→ beat 3 : « Exécuter : comptes rendus, courriels, documents. Le gros du volume. »
→ beat 4 : « Suivre : alertes, rapport d'avancement, écarts expliqués. Demain matin. »
→ beat 5 : « Clôturer : bilan, leçons apprises, transfert. La phase qu'on bâcle souvent, faute de temps. »

QUESTION — « Dans quelle phase perdez-vous le plus de temps ? »

TRANSITION — « Regardons justement où passe le temps de Karim. »`,
  `⏱ 3 min · LA SEMAINE DE KARIM (1 clic)

OBJECTIF — Relier l'IA à un irritant mesurable : le temps.

DIRE — « Karim a noté sa semaine. 11 heures de réunions, 9 heures de courriels et relances, 6 de planification, 5 de rapports, 5 d'imprévus, et seulement 4 heures sur le terrain avec l'équipe. »
→ beat 1 : « L'IA aide surtout sur les quatre premières lignes : comptes rendus, rédaction, premiers jets, rapport hebdomadaire. Pas sur les imprévus ni sur l'équipe. »

INSISTER — « Le but n'est pas de faire plus de réunions. C'est de rendre du temps à ce que l'IA ne fait pas : régler les imprévus et animer l'équipe. »

PRÉCISION — Ces heures sont un exemple de l'entreprise fictive, pas une statistique.

INTERACTION — « Si vous faisiez l'exercice, quelle serait votre plus grande barre ? »

TRANSITION — « Quatre usages concrets, un par page. Premier : planifier. »`,
  `⏱ 4 min · CAS D'USAGE 1 : PLANIFICATION (2 clics)

OBJECTIF — Montrer une demande de planification réaliste et sa réponse.

DIRE — « À gauche, ce que l'IA fait bien en planification : découper, ordonner, estimer, lister les risques. »
→ beat 1 : « La demande de Karim. Remarquez : il donne le contexte (22 semaines, 420 k$, 8 embauches) et une contrainte (6 lots au maximum). »
→ beat 2 : « La réponse, en quelques secondes : six lots cohérents. Est-ce parfait ? Non. Mais Karim ne part plus d'une page blanche. »

QUESTION — « Que manque-t-il dans ce découpage ? » Réponses possibles : les achats d'inventaire, l'assurance, la gestion de projet elle-même, l'enseigne. « Bravo : c'est exactement votre valeur ajoutée. »

TRANSITION — « Deuxième usage : le suivi. »`,
  `⏱ 4 min · CAS D'USAGE 2 : SUIVI (2 clics)

OBJECTIF — Montrer l'IA comme lecteur rapide d'un état d'avancement.

DIRE — « Le suivi, c'est consolider, repérer ce qui glisse, répondre à "où en est-on ?", préparer la réunion. »
→ beat 1 : « Karim colle l'export de ses tâches et pose une question précise, avec un jalon et une date. »
→ beat 2 : « La réponse liste trois retards et, surtout, identifie celui qui compte : la soumission de l'électricien, sur le chemin critique. »

INSISTER — L'IA peut se tromper sur le chemin critique si les dépendances ne sont pas dans les données. Karim vérifie.

LIEN — « Demain, on verra comment l'outil peut faire ce suivi tout seul, avec des alertes. »

TRANSITION — « Troisième usage : le rapport. »`,
  `⏱ 3 min · CAS D'USAGE 3 : REPORTING (2 clics)

OBJECTIF — Montrer le gain sur le rapport d'avancement hebdomadaire.

DIRE — « Le rapport du vendredi : une heure en moyenne pour beaucoup de chargés de projet. »
→ beat 1 : « Karim donne ses notes en vrac et impose une structure : météo, avancement, trois points d'attention, décision attendue, 150 mots. »
→ beat 2 : « Le résultat est prêt pour Luc. Météo jaune, 38 % contre 40 % prévu, et la décision attendue est claire. »

INSISTER — La météo (vert, jaune, rouge) est un jugement : l'IA la propose, Karim l'assume. Un rapport trop optimiste détruit la confiance.

TRANSITION — « Quatrième usage : communiquer. »`,
  `⏱ 3 min · CAS D'USAGE 4 : COMMUNICATION (2 clics)

OBJECTIF — Montrer l'adaptation d'un même message à plusieurs publics.

DIRE — « Une mauvaise nouvelle : deux semaines de retard sur les comptoirs. Trois publics, trois messages. »
→ beat 1 : « Une seule demande pour trois versions. »
→ beat 2 : « Pour Luc : impact et options. Pour l'équipe : les actions. Pour le fournisseur : poli, mais ferme sur le plan de rattrapage. »

ASTUCE — Pour un message délicat, demandez aussi : « Relis ce courriel comme si tu étais Luc. Qu'est-ce qui pourrait l'irriter ? »

TRANSITION — « À vous de juger : que confier à l'IA ? »`,
  `⏱ 6 min · EXERCICE MATRICE (glisser-déposer)

OBJECTIF — Développer le jugement : gain de temps versus risque en cas d'erreur.

ANIMATION — Pour chaque étiquette, demandez une case à voix haute (« priorité », « relecture », « pour soi », « si le temps ») et glissez-la selon la majorité. Double-cliquer une étiquette la remet à sa place. Laissez débattre : il n'y a pas de corrigé unique.

PISTES DE CORRIGÉ —
• À confier en priorité : compte rendu de réunion, ordre du jour, reformuler une note, premier découpage des tâches.
• Avec relecture attentive : annonce d'un retard au client, budget final (l'IA peut mettre en forme, mais les chiffres se vérifient).
• À garder pour soi : décision de reporter l'ouverture, évaluation d'un employé.

DÉBAT ATTENDU — « Évaluation d'un employé » : l'IA peut aider à formuler, mais le jugement et les données personnelles posent problème (module 5).

TRANSITION — « Avec quels outils ? Deux familles. » (Dîner vers ici selon l'heure.)`,
  `⏱ 3 min · DEUX FAMILLES D'OUTILS (1 clic)

OBJECTIF — Distinguer assistants génériques et IA intégrée.

DIRE — « Première famille : les assistants génériques. ChatGPT, Gemini, Copilot, Claude. Une fenêtre de conversation, pour tout. Avantages : polyvalents, et des versions gratuites pour commencer. Limites : ils ne voient que ce que vous leur collez, et on copie-colle entre les outils. »
→ beat 1 : « Deuxième famille : l'IA intégrée, dans Teams, Outlook, Google, Notion, ClickUp, Trello. Elle voit vos courriels, vos réunions, vos tâches, et agit sur place. Limites : souvent une licence payante, et chaque IA reste dans son outil. »

MESSAGE CLÉ — Les deux se complètent. Le générique pour réfléchir et rédiger ; l'intégré pour travailler sur les données du projet.

TRANSITION — « Faisons le tour des génériques. »`,
  `⏱ 3 min · QUATRE ASSISTANTS

OBJECTIF — Présenter les quatre assistants sans faire de palmarès.

DIRE — « ChatGPT, d'OpenAI : le plus répandu. Gemini, de Google : naturel si vous êtes sur Google Workspace. Copilot, de Microsoft : Copilot Chat est accessible avec un compte professionnel ; Microsoft 365 Copilot, payant, s'intègre dans Word, Outlook et Teams. Claude, d'Anthropic : apprécié pour les longs documents et la rédaction. »

MESSAGE CLÉ — « Le meilleur assistant, c'est celui que votre organisation autorise. Les écarts de qualité sont faibles pour nos usages ; les écarts de confidentialité, eux, sont importants. »

À VÉRIFIER — Les offres changent souvent : vérifiez avant chaque session ce qui est gratuit ou inclus.

DÉMO OPTIONNELLE — Posez la même question à deux assistants et comparez en direct.

TRANSITION — « L'IA intégrée maintenant, en commençant par Microsoft. »`,
  `⏱ 4 min · DÉMO OUTLOOK ET TEAMS (2 clics)

OBJECTIF — Montrer concrètement l'IA intégrée de Microsoft 365.

DIRE — « À gauche, Outlook. Un fil de 14 messages sur le retard des comptoirs. »
→ beat 1 : « Copilot le résume : nouvelle date, proposition du fournisseur, question de Luc, et surtout : aucune décision prise. Karim sait quoi faire en 20 secondes. »
« À droite, Teams. La réunion de suivi a été transcrite. »
→ beat 2 : « Le récapitulatif : la décision, la tâche avec son responsable et son échéance, le point ouvert. »

PRÉCAUTION — Lire l'encadré : tout dépend de la licence et des réglages des TI. La transcription doit être activée, et les participants informés (module 5).

DÉMO EN DIRECT — Si vous avez accès à Microsoft 365 Copilot, montrez « Résumer » dans un fil Outlook de démonstration.

TRANSITION — « Même logique chez Google. »`,
  `⏱ 2 min · GOOGLE WORKSPACE

OBJECTIF — Montrer l'équivalent Google pour les participants concernés.

DIRE — « Gemini dans Gmail : résumer un fil, proposer une réponse. Dans Docs : "Aide-moi à écrire", pour un premier jet de charte ou de bilan. Dans Sheets : créer un tableau de suivi, expliquer une formule. Dans Meet : "Prendre des notes pour moi", qui produit un document de notes après la réunion. »

MESSAGE CLÉ — « Même logique que Microsoft : l'IA travaille là où sont vos documents, avec vos droits d'accès. »

QUESTION — « Qui est sur Google, qui est sur Microsoft ? » Adaptez les démonstrations de l'atelier.

TRANSITION — « Et dans les outils de gestion de projet ? »`,
  `⏱ 3 min · OUTILS DE GESTION DE PROJET

OBJECTIF — Panorama des outils de gestion de tâches et de leurs fonctions d'IA.

DIRE — Parcourez les six tuiles :
• Notion AI : rédiger, résumer, questions sur l'espace, notes de réunion.
• ClickUp Brain : générer tâches et sous-tâches, résumer, rédiger des mises à jour de statut.
• Trello : l'IA d'Atlassian pour rédiger, résumer, créer des listes de contrôle.
• Planner : créer un plan à partir d'un objectif, avec Copilot.
• Asana : résumés de projet, statuts, règles intelligentes.
• monday.com : générer des tâches, résumer, remplir des colonnes.

À SOULIGNER — « Notion AI et ClickUp sont nos deux outils de l'atelier 1 cet après-midi. »

À VÉRIFIER — Ces fonctions et leurs forfaits évoluent vite ; vérifiez avant la session.

TRANSITION — « Comment choisir, alors ? Trois questions. »`,
  `⏱ 3 min · CHOISIR L'OUTIL (3 clics)

OBJECTIF — Donner un réflexe de choix fondé sur les données.

DIRE — « Première question, toujours la même : les données sont-elles confidentielles ou personnelles ? »
→ beat 1 : « Si oui : uniquement un outil approuvé par votre organisation, en version entreprise. Si non, on continue. »
→ beat 2 : « L'information est-elle déjà dans Teams, Notion, ClickUp ? Si oui : l'IA intégrée. Elle voit le contexte et respecte les droits d'accès. »
→ beat 3 : « Besoin ponctuel, un texte, une idée ? Un assistant générique fait très bien l'affaire. »

INSISTER — Le choix commence par les données, pas par la puissance de l'outil.

TRANSITION — « Quel que soit l'outil, une compétence fait la différence : bien demander. »`,
  `⏱ 5 min · CINQ INGRÉDIENTS (5 clics)

OBJECTIF — Donner une structure de demande simple et mémorisable.

DIRE — « À droite, la demande de Karim, en gris. À chaque clic, un ingrédient s'allume. »
→ beat 1 : « Le rôle : "Tu es un chargé de projet expérimenté dans le commerce de détail." On oriente le vocabulaire et le niveau. »
→ beat 2 : « Le contexte : date, budget, équipe. C'est l'ingrédient le plus oublié, et le plus important. »
→ beat 3 : « La tâche : proposer les jalons. Un verbe d'action clair. »
→ beat 4 : « Le format : un tableau, avec ses colonnes. »
→ beat 5 : « Les contraintes : huit jalons au maximum, et "signale les dates que tu as dû deviner". Cette dernière phrase est précieuse : elle fait apparaître les inventions. »

MÉMO — Rôle, Contexte, Tâche, Format, Contraintes.

TRANSITION — « Voyons la différence en direct. »`,
  `⏱ 4 min · EXERCICE AVANT / APRÈS (interrupteur)

OBJECTIF — Faire constater l'effet du contexte sur la qualité.

ANIMATION — Commencez sur « Demande vague ». Lisez la demande et la réponse. Puis cliquez l'interrupteur.

DIRE — « Demande vague : "Fais-moi un plan pour recruter du monde." Réponse : sept étapes génériques, justes et inutilisables. Rien sur votre projet. »
Cliquez l'interrupteur : « Même outil, demande en cinq ingrédients. Réponse : des postes, des dates, des formations, et un point d'alerte sur les mécaniciens. Utilisable, à vérifier avec Julie. »

QUESTION — « Qu'est-ce qui a fait la différence ? » Réponse attendue : le contexte et le format.

TRANSITION — « Et si la réponse ne convient pas ? On ne recommence pas : on converse. »`,
  `⏱ 3 min · ITÉRER (4 clics)

OBJECTIF — Montrer que la qualité vient de la conversation.

DIRE — « L'assistant propose huit jalons. Ce n'est qu'un début. »
→ beat 1 : « Approfondir : "Ajoute les dépendances et le chemin critique." »
→ beat 2 : « Corriger : "Le permis prend 6 semaines, pas 2." Vous apportez le fait, l'IA recalcule le reste. »
→ beat 3 : « Inverser les rôles : "Pose-moi 5 questions avant de finaliser." C'est la relance la plus sous-utilisée, et la plus puissante. »
→ beat 4 : « Astuce : une conversation par sujet. Si elle part dans tous les sens, demandez un résumé et ouvrez une nouvelle conversation. »

TRANSITION — « Un dernier QCM sur le choix d'outil. »`,
  `⏱ 3 min · QCM 3

RÉPONSE — B : le récapitulatif de Copilot dans Teams (si la licence le permet).
• A ✗ PIÈGE — Copier une transcription interne dans un outil public peut exposer des données.
• C ✗ PIÈGE — Gemini ne voit pas une réunion Teams.
• D ✗ PIÈGE — Possible, mais c'est justement ce que l'IA fait bien.

NUANCE — Sans licence Copilot, la bonne réponse devient : demander au responsable de la réunion le compte rendu, ou utiliser l'outil approuvé par l'organisation.

TRANSITION — « Faisons le bilan du module 2. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 2

DIRE — Relisez les cinq points :
1. Quatre usages : planifier, suivre, rendre compte, communiquer.
2. Génériques pour tout, intégrés là où sont les données.
3. Données confidentielles : uniquement un outil approuvé.
4. Cinq ingrédients : rôle, contexte, tâche, format, contraintes.
5. On affine en conversation.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « Assez parlé : place à l'atelier 1. Vous allez générer le plan du projet Limoilou. »`,
];
// @@NOTES-END
