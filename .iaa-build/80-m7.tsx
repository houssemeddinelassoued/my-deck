// ─── Module 7 · Connecter les outils professionnels ─────────────────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title={
      <>
        Connecter
        <br />
        les outils
      </>
    }
    sub="Faire circuler l’information entre messagerie, tableur, formulaires, CRM, stockage, agenda et outils collaboratifs : un écosystème plutôt que des îlots."
    dur="13:30 – 14:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 7 · un workflow multi-applications
      </Tag>
    }
  >
    <SecItem n={1}>L’écosystème des outils professionnels</SecItem>
    <SecItem n={2}>Connecteurs, API, webhooks : comment les applications se parlent</SecItem>
    <SecItem n={3}>Le fil de l’information : identifiant, source de vérité</SecItem>
    <SecItem n={4}>Points d’attention : droits, coûts, continuité</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── L’écosystème ───────────────────────────────────────────────────────────
const M7Fam = ({ x, y, icon, tone, title, ex, d }: { x: number; y: number; icon: IconName; tone: Tone; title: string; ex: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: y, width: 360, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={58} solid />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35 }}>{ex}</div>
    </div>
  </div>
);

const M7_Ecosysteme: Page = () => (
  <Frame mod={7}>
    <Title>Un écosystème plutôt que des outils séparés</Title>
    <Lede>Huit familles d’outils. Le workflow est le fil qui les relie : chaque information n’est saisie qu’une fois.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M960 600 L300 330 M960 600 L740 330 M960 600 L1180 330 M960 600 L1620 330 M960 600 L300 850 M960 600 L740 850 M960 600 L1180 850 M960 600 L1620 850" stroke={C.rule} strokeWidth={3} strokeDasharray="6 8" className={A.march} />
      <FlowDot path="M300 330 L960 600 L1620 850" dur={3} r={8} color={C.electric} />
      <FlowDot path="M1620 330 L960 600 L300 850" dur={3.4} begin={0.7} r={8} color={C.violet} />
      <FlowDot path="M740 330 L960 600 L1180 850" dur={2.6} begin={1.3} r={8} color={C.green} />
    </svg>
    <M7Fam x={120} y={270} icon="mail" tone="coral" title="Messagerie" ex="Outlook, Gmail" d={100} />
    <M7Fam x={560} y={270} icon="table" tone="green" title="Tableurs" ex="Excel, Google Sheets" d={160} />
    <M7Fam x={1000} y={270} icon="form" tone="violet" title="Formulaires" ex="Microsoft Forms, Google Forms, Tally" d={220} />
    <M7Fam x={1440} y={270} icon="users" tone="blue" title="CRM" ex="HubSpot, Salesforce, Pipedrive" d={280} />
    <M7Fam x={120} y={790} icon="folder" tone="yellow" title="Stockage" ex="SharePoint, OneDrive, Drive" d={340} />
    <M7Fam x={560} y={790} icon="calendar" tone="teal" title="Calendrier" ex="Outlook, Google Agenda" d={400} />
    <M7Fam x={1000} y={790} icon="chat" tone="navy" title="Collaboratif" ex="Teams, Slack, Notion" d={460} />
    <M7Fam x={1440} y={790} icon="sparkles" tone="pink" title="Outils IA" ex="Assistants, modèles via API" d={520} />
    <div className={A.pop} style={{ position: 'absolute', left: 860, top: 530, width: 200, height: 140, borderRadius: 28, background: G.navy, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 24px 50px -20px rgba(11,31,92,.7)', ...dl(50) }}>
      <FlowMark h={32} color="#FFFFFF" accent={C.pink} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 21, color: '#fff' }}>Workflow</span>
    </div>
  </Frame>
);

// ─── Comment les applications se parlent ────────────────────────────────────
const M7Way = ({ icon, tone, title, image, children, d }: { icon: IconName; tone: Tone; title: string; image: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', gap: 22, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={72} solid />
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</span>
        <span style={{ fontSize: 21, fontStyle: 'italic', color: T[tone].fg }}>{image}</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Comment: Page = () => (
  <Frame mod={7}>
    <Title>Comment les applications se parlent</Title>
    <Lede>Pas besoin de coder, mais il faut comprendre ces quatre mots pour lire une documentation ou parler à l’informatique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      <M7Way icon="plug" tone="green" title="Connecteur" image="une prise prête à brancher" d={100}>
        Fourni par la plateforme : choisir l’application, se connecter, choisir l’action. 90 % des besoins.
      </M7Way>
      <M7Way icon="server" tone="blue" title="API" image="le guichet de l’application" d={200}>
        La porte d’entrée officielle pour lire ou écrire des données. Le connecteur l’utilise pour vous.
      </M7Way>
      <M7Way icon="bell" tone="yellow" title="Webhook" image="une sonnette" d={300}>
        L’application prévient la plateforme dès qu’un événement se produit : le déclencheur instantané.
      </M7Way>
      <M7Way icon="key" tone="coral" title="Autorisation" image="un badge visiteur" d={400}>
        Vous autorisez la plateforme une fois (OAuth) ; elle agit ensuite avec vos droits, ni plus ni moins.
      </M7Way>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(600) }}>
      <Callout title="Pas de connecteur ?" tone="blue" icon="puzzle" size={23}>
        Le module « requête HTTP » appelle n’importe quelle API documentée. C’est la porte de sortie… et le bon moment pour demander de l’aide à l’informatique.
      </Callout>
    </div>
  </Frame>
);

// ─── Le fil de l’information ────────────────────────────────────────────────
const M7Hop = ({ x, icon, tone, app, status, d }: { x: number; icon: IconName; tone: Tone; app: string; status: string; d: number }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 300, width: 330, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <span style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{app}</span>
    </div>
    <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: C.electric, color: '#fff' }}>DEM-0057</span>
      <Tag tone="grey" size={18}>
        {status}
      </Tag>
    </div>
  </div>
);

const M7Rule = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card tone={tone} icon={icon} title={title} cls={A.in} style={{ flex: 1, ...dl(d) }} size={22}>
    {children}
  </Card>
);

const M7_Fil: Page = () => (
  <Frame mod={7}>
    <Title>Le fil de l’information : un cas, un identifiant</Title>
    <Lede>Le même identifiant accompagne la demande dans chaque application. On retrouve tout, on évite les doublons.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M450 370 H 570 M900 370 H 1020 M1350 370 H 1470" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
    </svg>
    <M7Hop x={120} icon="form" tone="violet" app="Formulaire" status="nouveau" d={100} />
    <M7Hop x={570} icon="table" tone="green" app="Tableur de suivi" status="qualifié" d={200} />
    <M7Hop x={1020} icon="users" tone="blue" app="CRM" status="assigné" d={300} />
    <M7Hop x={1470} icon="mail" tone="coral" app="Email au client" status="répondu" d={400} />
    <div style={{ position: 'absolute', left: 120, top: 540, width: 1680, display: 'flex', gap: 24 }}>
      <M7Rule icon="key" tone="blue" title="Un identifiant unique" d={500}>
        Créé au début, recopié partout, cité dans chaque message.
      </M7Rule>
      <M7Rule icon="database" tone="green" title="Une source de vérité" d={600}>
        Le CRM pour les clients, le tableur pour le suivi : jamais deux maîtres.
      </M7Rule>
      <M7Rule icon="search" tone="yellow" title="Chercher avant de créer" d={700}>
        « Rechercher le contact, sinon le créer » : zéro doublon.
      </M7Rule>
      <M7Rule icon="flag" tone="violet" title="Un statut qui avance" d={800}>
        Nouveau → qualifié → assigné → répondu : on sait où en est chaque cas.
      </M7Rule>
    </div>
  </Frame>
);

// ─── Démo : le workflow multi-applications du programme ─────────────────────
const M7Data = ({ x, beat, children }: { x: number; beat: number; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x, top: 560, width: 254, boxSizing: 'border-box' }}>
    <svg width={254} height={36} aria-hidden style={{ display: 'block' }}>
      <path d="M127 0 V 32" stroke={C.rule} strokeWidth={3} strokeDasharray="6 6" />
    </svg>
    <div style={{ fontFamily: mono, fontSize: 17, lineHeight: 1.5, color: C.ink, background: '#F7FAFC', borderRadius: 12, padding: '12px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, whiteSpace: 'pre-wrap', minHeight: 160, boxSizing: 'border-box' }}>{children}</div>
  </div>
);

const M7_Demo: Page = () => (
  <Frame mod={7} kind="cas" beats={6}>
    <Title>Formulaire → IA → tableur → CRM → email → notification</Title>
    <Lede>Un prospect remplit le formulaire du site. Six applications, zéro ressaisie. Suivez-le (→).</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M247 300 H 1673" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M247 300 H 1673" dur={4.2} r={9} color={C.electric} />
    </svg>
    <FlowNode kind="trigger" icon="form" label="Formulaire" sub="site web" w={254} cls={A.in} style={{ position: 'absolute', left: 120, top: 330, ...dl(100) }} />
    <FlowNode kind="ai" label="IA" sub="qualifie et note" w={254} cls={A.in} style={{ position: 'absolute', left: 405, top: 330, ...dl(180) }} />
    <FlowNode kind="data" icon="table" label="Tableur" sub="ligne de suivi" w={254} cls={A.in} style={{ position: 'absolute', left: 690, top: 330, ...dl(260) }} />
    <FlowNode kind="action" icon="users" label="CRM" sub="rechercher ou créer" w={254} cls={A.in} style={{ position: 'absolute', left: 975, top: 330, ...dl(340) }} />
    <FlowNode kind="action" icon="mail" label="Email" sub="au prospect" w={254} cls={A.in} style={{ position: 'absolute', left: 1260, top: 330, ...dl(420) }} />
    <FlowNode kind="action" icon="bell" label="Notification" sub="au commercial" w={254} cls={A.in} style={{ position: 'absolute', left: 1545, top: 330, ...dl(500) }} />
    <M7Data x={120} beat={1}>
      {'Nina Roy · Altea\n« Former 15 agents\nà l’accueil client,\nbudget défini »'}
    </M7Data>
    <M7Data x={405} beat={2}>
      {'{"besoin": "accueil",\n "volume": 15,\n "budget": true,\n "score": 82}'}
    </M7Data>
    <M7Data x={690} beat={3}>
      {'DEM-0057 · Altea\nscore 82 · chaud\nstatut : qualifié'}
    </M7Data>
    <M7Data x={975} beat={4}>
      {'Contact : trouvé\nOpportunité créée\nDEM-0057\nPropriétaire : Karim'}
    </M7Data>
    <M7Data x={1260} beat={5}>
      {'« Merci Nina,\nKarim vous rappelle\nsous 24 h. »\nréf. DEM-0057'}
    </M7Data>
    <M7Data x={1545} beat={6}>
      {'@Karim : lead chaud\nAltea · 15 agents\nscore 82 → CRM'}
    </M7Data>
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="clock" size={28} color={C.green} />
      <span>
        Délai entre l’envoi du formulaire et l’appel du commercial : de <strong style={{ color: C.coral }}>2 jours</strong> à <strong style={{ color: C.green }}>quelques minutes</strong>.
      </span>
    </div>
  </Frame>
);

// ─── Écosystèmes par métier (onglets) ───────────────────────────────────────
const M7Flow = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'space-between' }}>{children}</div>;
const M7Arr = () => <FlowArrow w={34} color={C.faint} />;

const M7_Metiers: Page = () => (
  <Frame mod={7} kind="cas">
    <Title>Un écosystème par métier</Title>
    <Lede>Même logique, applications différentes. Trouvez l’onglet le plus proche de votre fil rouge.</Lede>
    <Tabs initial="rh" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 34 }}>
        <TabBtn id="rh" tone="violet" icon="user">
          RH · candidatures
        </TabBtn>
        <TabBtn id="com" tone="blue" icon="money">
          Commercial · leads
        </TabBtn>
        <TabBtn id="adm" tone="green" icon="euro">
          Administratif · factures
        </TabBtn>
        <TabBtn id="sup" tone="teal" icon="tool">
          Support · tickets
        </TabBtn>
      </div>
      <TabPane id="rh">
        <M7Flow>
          <FlowNode kind="trigger" icon="form" label="Candidature reçue" sub="formulaire + CV" w={300} />
          <M7Arr />
          <FlowNode kind="ai" label="CV résumé" sub="critères du poste, sans note" w={300} />
          <M7Arr />
          <FlowNode kind="data" icon="table" label="Vivier candidats" sub="tableur partagé" w={300} />
          <M7Arr />
          <FlowNode kind="human" label="Le recruteur décide" sub="notifié dans Teams" w={300} />
          <M7Arr />
          <FlowNode kind="action" icon="mail" label="Accusé de réception" sub="email personnalisé" w={300} />
        </M7Flow>
      </TabPane>
      <TabPane id="com">
        <M7Flow>
          <FlowNode kind="trigger" icon="form" label="Lead du site" sub="formulaire contact" w={300} />
          <M7Arr />
          <FlowNode kind="ai" label="Qualification" sub="besoin, budget, score" w={300} />
          <M7Arr />
          <FlowNode kind="action" icon="users" label="CRM" sub="rechercher ou créer" w={300} />
          <M7Arr />
          <FlowNode kind="action" icon="bell" label="Commercial notifié" sub="si score ≥ 70" w={300} />
          <M7Arr />
          <FlowNode kind="action" icon="calendar" label="Relance J+3" sub="si pas de réponse" w={300} />
        </M7Flow>
      </TabPane>
      <TabPane id="adm">
        <M7Flow>
          <FlowNode kind="trigger" icon="mail" label="Facture reçue" sub="boîte factures@" w={300} />
          <M7Arr />
          <FlowNode kind="ai" label="Extraction" sub="montants, échéance" w={300} />
          <M7Arr />
          <FlowNode kind="cond" label="Contrôles" sub="HT + TVA = TTC, bon de commande" w={300} />
          <M7Arr />
          <FlowNode kind="data" icon="table" label="Tableau de suivi" sub="ou logiciel comptable" w={300} />
          <M7Arr />
          <FlowNode kind="human" label="Bon à payer" sub="approbation du budget" w={300} />
        </M7Flow>
      </TabPane>
      <TabPane id="sup">
        <M7Flow>
          <FlowNode kind="trigger" icon="inbox" label="Ticket créé" sub="email ou portail" w={300} />
          <M7Arr />
          <FlowNode kind="ai" label="Classe et propose" sub="réponse depuis la base" w={300} />
          <M7Arr />
          <FlowNode kind="human" label="L’agent valide" sub="ou corrige" w={300} />
          <M7Arr />
          <FlowNode kind="action" icon="send" label="Réponse envoyée" sub="ticket mis à jour" w={300} />
          <M7Arr />
          <FlowNode kind="out" icon="smile" label="Satisfaction" sub="enquête 1 question" w={300} />
        </M7Flow>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 640, width: 1680, ...dl(500) }}>
      <Callout title="Le réflexe" tone="violet" icon="bulb" size={24}>
        Pour chaque flèche, posez trois questions : <strong>quelle donnée passe ?</strong> <strong>sous quel identifiant ?</strong> <strong>qui est la source de vérité ?</strong>
      </Callout>
    </div>
  </Frame>
);

// ─── Points d’attention ─────────────────────────────────────────────────────
const M7_Attention: Page = () => (
  <Frame mod={7}>
    <Title>Connecter, c’est aussi ouvrir des portes</Title>
    <Lede>Chaque connexion donne à la plateforme un accès à vos données. Six points à régler avant la mise en service.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <Card tone="blue" icon="user" title="Compte de service" cls={A.in} style={dl(100)} size={22}>
        Pas votre compte personnel : si vous partez, le workflow ne doit pas s’arrêter.
      </Card>
      <Card tone="coral" icon="lock" title="Droits minimaux" cls={A.in} style={dl(200)} size={22}>
        Lire un dossier, pas tout le SharePoint. Écrire dans une feuille, pas dans tout le Drive.
      </Card>
      <Card tone="yellow" icon="money" title="Quotas et coûts" cls={A.in} style={dl(300)} size={22}>
        Opérations, appels IA, connecteurs premium : estimez le volume mensuel avant.
      </Card>
      <Card tone="teal" icon="globe" title="Où passent les données" cls={A.in} style={dl(400)} size={22}>
        Région d’hébergement de la plateforme et du modèle IA : à valider avec l’informatique.
      </Card>
      <Card tone="green" icon="humanCheck" title="Un propriétaire et un suppléant" cls={A.in} style={dl(500)} size={22}>
        Qui reçoit les alertes pendant les congés du propriétaire ?
      </Card>
      <Card tone="navy" icon="doc" title="Inventaire des connexions" cls={A.in} style={dl(600)} size={22}>
        Quelles applications, quel compte, quels droits, depuis quand.
      </Card>
    </div>
  </Frame>
);

// ─── Exercice : remettre le flux dans l’ordre ───────────────────────────────
const M7Slot = ({ n, x, sol }: { n: number; x: number; sol: string }) => (
  <div style={{ position: 'absolute', left: x, top: 580, width: 266, height: 250, boxSizing: 'border-box', borderRadius: 16, border: `3px dashed ${C.faint}`, background: 'rgba(255,255,255,.5)' }}>
    <div style={{ position: 'absolute', left: 12, top: 10 }}>
      <Num n={n} tone="navy" size={38} />
    </div>
    <div className={b.pop(1)} style={{ position: 'absolute', left: 0, right: 0, bottom: 12, textAlign: 'center' }}>
      <span style={{ display: 'inline-block', fontFamily: display, fontWeight: 800, fontSize: 26, color: '#fff', background: C.green, borderRadius: 10, padding: '4px 16px' }}>{sol}</span>
    </div>
  </div>
);

const M7Chip = ({ l, x, y, tone, children }: { l: string; x: number; y: number; tone: Tone; children: ReactNode }) => (
  <Drag x={x} y={y} w={266} tone={tone} size={20}>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: STRONG[tone] }}>{l}</span>
    <span>{children}</span>
  </Drag>
);

const M7_Ordre: Page = () => (
  <Frame mod={7} kind="exercice" beats={1}>
    <Title>Exercice : remettez le flux dans l’ordre</Title>
    <Lede>Un prospect remplit le formulaire. Glissez les six étapes dans les cases. → affiche la solution.</Lede>
    <M7Chip l="A" x={120} y={270} tone="green">Email de remerciement au prospect</M7Chip>
    <M7Chip l="B" x={405} y={270} tone="violet">L’IA qualifie le besoin et attribue un score</M7Chip>
    <M7Chip l="C" x={690} y={270} tone="blue">Notification au commercial dans Teams</M7Chip>
    <M7Chip l="D" x={975} y={270} tone="yellow">Le prospect envoie le formulaire</M7Chip>
    <M7Chip l="E" x={1260} y={270} tone="teal">CRM : rechercher le contact, sinon le créer</M7Chip>
    <M7Chip l="F" x={1545} y={270} tone="pink">Ligne ajoutée au tableur de suivi</M7Chip>
    <M7Slot n={1} x={120} sol="D" />
    <M7Slot n={2} x={405} sol="B" />
    <M7Slot n={3} x={690} sol="F" />
    <M7Slot n={4} x={975} sol="E" />
    <M7Slot n={5} x={1260} sol="A" />
    <M7Slot n={6} x={1545} sol="C" />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 870, width: 1680, fontSize: 23, color: C.soft }}>
      <strong style={{ color: C.navy }}>Débat :</strong> A et C peuvent s’inverser. Mais le CRM (E) doit précéder l’email : on cite l’identifiant et le nom du commercial.
    </div>
  </Frame>
);

// ─── Atelier 7 ──────────────────────────────────────────────────────────────
const M7_Atelier: Page = () => (
  <LabPage
    mod={7}
    n="7"
    title="Un workflow multi-applications"
    defi="integration"
    who="En binôme"
    minutes={35}
    where={
      <>
        Votre scénario étendu à <strong>au moins 4 applications</strong>, avec un <strong>identifiant unique</strong> présent dans chacune, et la liste des connexions
        (compte, droits).
      </>
    }
    objective={
      <>
        Construire <strong>Formulaire → IA → tableur → CRM → email → notification</strong>, ou l’équivalent pour votre processus, pour que l’information circule seule.
      </>
    }
    crit={
      <>
        <CheckItem id="a7c1" size={22}>4 applications ou plus reliées</CheckItem>
        <CheckItem id="a7c2" size={22}>Le même identifiant partout</CheckItem>
        <CheckItem id="a7c3" size={22}>« Rechercher ou créer » : pas de doublon</CheckItem>
        <CheckItem id="a7c4" size={22}>Connexions et droits listés</CheckItem>
      </>
    }
  >
    <div>1. Générez un identifiant dès le déclencheur (ex. DEM- + numéro de ligne).</div>
    <div>2. Pas de CRM ? Un deuxième onglet « Contacts » dans le tableur fera l’affaire.</div>
    <div>3. Ajoutez l’email au demandeur, puis la notification interne.</div>
    <div>4. Envoyez deux fois le même contact : un seul doit exister à la fin.</div>
    <Bonus>Ajoutez un évènement dans l’agenda du commercial pour le rappel.</Bonus>
  </LabPage>
);

// ─── Synthèse M7 ────────────────────────────────────────────────────────────
const M7_Synthese: Page = () => (
  <Frame mod={7} kind="synthese">
    <Title>Ce qu’on retient du module 7</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="pink" d={100}>
        Huit familles d’outils, un fil : <strong>chaque information n’est saisie qu’une fois</strong>.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        <strong>Connecteur, API, webhook, autorisation</strong> : quatre mots pour comprendre les échanges.
      </SynthRow>
      <SynthRow n={3} tone="blue" d={300}>
        <strong>Un identifiant unique, une source de vérité</strong>, chercher avant de créer.
      </SynthRow>
      <SynthRow n={4} tone="coral" d={400}>
        Compte de service, <strong>droits minimaux</strong>, coûts estimés, propriétaire et suppléant.
      </SynthRow>
    </div>
    <ProjectCard mod={7}>
      Les <strong>applications</strong> de votre processus sont reliées : l’information circule seule, sous un identifiant unique, sans doublon.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_Ecosysteme, M7_Comment, M7_Fil, M7_Demo, M7_Metiers, M7_Attention, M7_Ordre, M7_Atelier, M7_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M7 · 13:30

OBJECTIF — Annoncer le module de connexion des outils.

DIRE — « Bon retour. Ce matin, votre scénario a appris à choisir son chemin. Cet après-midi, il va parler à toutes vos applications : messagerie, tableur, formulaires, CRM, stockage, agenda, outils collaboratifs. L’idée : un écosystème automatisé plutôt que des outils utilisés séparément. »

TRANSITION — « Faisons l’inventaire. »`,
  `⏱ 3 min · L’ÉCOSYSTÈME

OBJECTIF — Situer les familles d’outils à connecter.

DIRE — « Huit familles d’outils, que vous utilisez déjà. Aujourd’hui, c’est souvent vous qui faites le lien : vous lisez un email, vous recopiez dans un tableur, vous ressaisissez dans le CRM, vous prévenez un collègue dans Teams. Le workflow devient ce lien. Le principe à retenir : chaque information n’est saisie qu’une fois. »

ANIMATION — Demander : « Combien d’outils touchez-vous pour traiter une seule demande ? » La réponse dépasse souvent quatre.

TRANSITION — « Comment ces outils se parlent-ils ? »`,
  `⏱ 4 min · CONNECTEUR, API, WEBHOOK, AUTORISATION

OBJECTIF — Comprendre comment l’information circule entre applications.

DIRE — « Quatre mots. Le connecteur : une prise prête à brancher, fournie par la plateforme. L’API : le guichet officiel de l’application, que le connecteur utilise pour vous. Le webhook : une sonnette, l’application prévient dès qu’il se passe quelque chose. L’autorisation : un badge visiteur, vous autorisez la plateforme une fois et elle agit avec vos droits. Et quand il n’y a pas de connecteur, le module “requête HTTP” appelle n’importe quelle API documentée : c’est le moment d’en parler à votre informatique. »

TRANSITION — « Quand l’information circule, il faut pouvoir la suivre. »`,
  `⏱ 4 min · LE FIL DE L’INFORMATION

OBJECTIF — Garantir la cohérence des données entre applications.

DIRE — « Une demande, DEM-0057, traverse quatre applications. Le même identifiant la suit partout : dans le tableur, dans le CRM, dans l’email au client. Quatre règles : un identifiant unique ; une source de vérité, jamais deux maîtres ; chercher avant de créer, pour ne pas fabriquer de doublons ; et un statut qui avance. »

INSISTER — Les doublons dans le CRM sont le premier dégât visible d’une automatisation mal conçue.

TRANSITION — « Le workflow complet du programme. »`,
  `⏱ 5 min · DÉMO MULTI-APPLICATIONS (6 clics)

OBJECTIF — Illustrer l’exemple du programme : formulaire → IA → tableur → CRM → email → notification.

DIRE — Un clic par étape : « Nina Roy, de la société Altea, veut former 15 agents. » « L’IA qualifie : besoin, volume, budget, score de 82. » « Le tableur reçoit la ligne DEM-0057, statut qualifié. » « Le CRM cherche le contact, le trouve, crée l’opportunité et l’attribue à Karim. » « Nina reçoit un email qui cite Karim et la référence. » « Karim est notifié : lead chaud. » Dernier constat : « De deux jours à quelques minutes. »

TRANSITION — « Et dans votre métier ? »`,
  `⏱ 4 min · ÉCOSYSTÈMES PAR MÉTIER (onglets)

OBJECTIF — Transposer à des métiers variés : RH, commercial, administratif, support.

DIRE — Cliquer chaque onglet. « RH : le recruteur décide, l’IA ne note pas. Commercial : on ne notifie que les leads chauds. Administratif : des contrôles avant le bon à payer. Support : l’IA propose, l’agent valide. Le réflexe pour chaque flèche : quelle donnée passe, sous quel identifiant, et qui est la source de vérité. »

ANIMATION — Demander à chacun de choisir l’onglet le plus proche de son fil rouge.

TRANSITION — « Avant de tout connecter, quelques précautions. »`,
  `⏱ 4 min · POINTS D’ATTENTION

OBJECTIF — Identifier les risques liés aux connexions : comptes, droits, coûts, hébergement, continuité.

DIRE — « Chaque connexion ouvre une porte. Compte de service plutôt que compte personnel : si vous partez, le workflow ne doit pas s’arrêter. Droits minimaux. Quotas et coûts estimés avant. La région d’hébergement de la plateforme et du modèle IA, à valider avec l’informatique. Un propriétaire et un suppléant. Et un inventaire des connexions. »

TRANSITION — « Un exercice de mise en ordre. »`,
  `⏱ 4 min · EXERCICE : REMETTRE EN ORDRE (glisser-déposer, 1 clic = solution)

OBJECTIF — Vérifier la compréhension de l’ordre des étapes et des dépendances de données.

DIRE — « Six étapes mélangées. Dites-moi l’ordre, je déplace. » Déplacer les cartes selon les propositions. → pour la solution : D, B, F, E, A, C.

DÉBAT — A et C peuvent s’inverser. En revanche, le CRM doit précéder l’email : l’email cite le nom du commercial attribué dans le CRM. C’est une dépendance de données.

TRANSITION — « Atelier 7. »`,
  `⏱ 35 min · ATELIER 7 · MULTI-APPLICATIONS (minuteur)

OBJECTIF — Construire un workflow multi-applications.

CONSIGNE À DIRE — « Étendez votre scénario à au moins quatre applications. Générez un identifiant dès le déclencheur et faites-le figurer partout. Pas de CRM ? Un onglet Contacts dans le tableur. Test final : envoyez deux fois le même contact, un seul doit exister à la fin. »

ANIMATION — Montrer en direct le module « rechercher ou créer » dans l’outil majoritaire. Passer dans les rangs.

DÉBRIEF — Un binôme montre son identifiant dans les quatre applications.`,
  `⏱ 2 min · SYNTHÈSE M7

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Chaque information n’est saisie qu’une fois. Quatre mots pour comprendre les échanges. Un identifiant unique, une source de vérité. Et des connexions sous contrôle. Côté projet : vos applications sont reliées. »

TRANSITION — « Et si, au lieu d’un scénario fixe, on donnait à l’IA des outils et un objectif ? Module 8 : assistants et agents. »`,
];
// @@NOTES-END
