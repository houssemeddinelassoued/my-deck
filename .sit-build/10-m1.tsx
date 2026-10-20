// ─── Module 1 · Panorama : Copilot, Claude et les autres ────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        Panorama : Copilot,
        <br />
        Claude et les autres
      </>
    }
    sub="Comprendre ce que fait vraiment un assistant IA, puis choisir le bon outil pour la bonne tâche."
    dur="9:30 – 11:15 · pause incluse"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · comparatif Copilot / Claude
      </Tag>
    }
  >
    <SecItem n={1}>Ce que fait vraiment un modèle de langage</SecItem>
    <SecItem n={2}>Ses trois limites : contexte, inventions, date</SecItem>
    <SecItem n={3}>Copilot Chat et Microsoft 365 Copilot</SecItem>
    <SecItem n={4}>Claude, puis ChatGPT et Gemini en repère</SecItem>
    <SecItem n={5}>Choisir son outil · atelier comparatif</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Le mot suivant ─────────────────────────────────────────────────────────
const M1Cand = ({ word, p, tone, d, chosen = false }: { word: string; p: number; tone: Tone; d: number; chosen?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 110px', alignItems: 'center', gap: 18 }}>
    <span className={chosen ? b.hi(2) : undefined} style={{ fontFamily: mono, fontSize: 28, fontWeight: 700, color: chosen ? C.navy : C.soft, padding: '4px 12px', borderRadius: 10, justifySelf: 'start' }}>
      {word}
    </span>
    <div style={{ height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
      <div className={b.grow(1)} style={{ width: `${Math.max(p, 1)}%`, height: '100%', borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    </div>
    <span className={b.fade(1)} style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg, ...dl(d + 300) }}>
      {p < 1 ? '< 1 %' : `${p} %`}
    </span>
  </div>
);

const M1_MotSuivant: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Un modèle de langage prédit la suite la plus probable</Title>
    <Lede>Copilot, Claude, ChatGPT ou Gemini : tous reposent sur un grand modèle de langage (LLM) qui écrit mot après mot.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 40px' }}>
      <Eyebrow c={C.muted} size={18}>
        Le texte déjà écrit
      </Eyebrow>
      <div style={{ marginTop: 12, fontSize: 40, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        « Le serveur FS-02 ne répond plus : son disque est{' '}
        <span className={b.pop(2)} style={{ color: C.violet, fontWeight: 800 }}>
          plein
        </span>
        <span className={A.blink} style={{ display: 'inline-block', width: 4, height: 40, marginLeft: 6, verticalAlign: -6, background: C.electric }} /> »
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1000, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={18} cls={b.fade(1)}>
        Les suites envisagées par le modèle
      </Eyebrow>
      <M1Cand word="plein" p={71} tone="violet" d={0} chosen />
      <M1Cand word="saturé" p={18} tone="blue" d={100} />
      <M1Cand word="défectueux" p={7} tone="teal" d={200} />
      <M1Cand word="chiffré" p={3} tone="grey" d={300} />
      <M1Cand word="magnifique" p={0} tone="grey" d={400} />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1180, top: 500, width: 620 }}>
      <Callout title="Ce qu’il faut retenir" tone="yellow" icon="bulb" size={26}>
        Le modèle ne vérifie rien : il produit un texte <strong>plausible</strong>. Il a raison très souvent… et tort avec la même assurance.
      </Callout>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 1180, top: 760, width: 620, fontSize: 23, lineHeight: 1.45, color: C.soft }}>
      Plausible ne veut pas dire vrai : c’est pour ça que <strong style={{ color: C.navy }}>vous</strong> restez le contrôle qualité.
    </div>
  </Frame>
);

// ─── Trois limites ──────────────────────────────────────────────────────────
const M1Face = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <>
    <IconTile name={icon} tone={tone} size={84} solid />
    <div style={{ marginTop: 26, fontFamily: display, fontWeight: 800, fontSize: 34, lineHeight: 1.15, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </>
);

const M1Back = ({ tone, title, children, parade }: { tone: Tone; title: string; children: ReactNode; parade: ReactNode }) => (
  <>
    <Eyebrow c={T[tone].fg} size={19}>
      {title}
    </Eyebrow>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
    <div style={{ marginTop: 'auto', background: '#fff', borderRadius: 12, padding: '14px 18px', fontSize: 22, lineHeight: 1.4, color: C.ink }}>
      <strong style={{ color: T[tone].fg }}>Parade · </strong>
      {parade}
    </div>
  </>
);

const M1_Limites: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Trois limites à connaître avant de s’en servir</Title>
    <Lede>Cliquez une carte pour la retourner, ou avancez : elles se retournent une par une.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 45 }}>
      <FlipCard
        w={530}
        h={600}
        flipAt={1}
        tone="blue"
        backTone="blue"
        cls={A.in}
        front={
          <M1Face icon="layers" tone="blue" title="Une mémoire de travail limitée">
            La « fenêtre de contexte » : ce que le modèle peut lire d’un coup.
          </M1Face>
        }
        back={
          <M1Back tone="blue" title="Fenêtre de contexte" parade="donner seulement les documents utiles, découper ce qui est trop long, ouvrir une nouvelle conversation par sujet.">
            Au-delà, il oublie le début ou tronque sans prévenir. Et d’une conversation à l’autre, il ne se souvient de rien, sauf si une mémoire est activée.
          </M1Back>
        }
      />
      <FlipCard
        w={530}
        h={600}
        flipAt={2}
        tone="coral"
        backTone="coral"
        cls={A.in}
        style={dl(120)}
        front={
          <M1Face icon="alert" tone="coral" title="Il peut inventer">
            Les « hallucinations » : une réponse fausse, mais rédigée avec aplomb.
          </M1Face>
        }
        back={
          <M1Back tone="coral" title="Hallucinations" parade="demander la source, vérifier les commandes et les chiffres, tester en lecture seule avant d’agir.">
            Une commande qui n’existe pas, un paramètre inventé, un chiffre arrondi au hasard, une page de rapport qui ne dit pas ça.
          </M1Back>
        }
      />
      <FlipCard
        w={530}
        h={600}
        flipAt={3}
        tone="violet"
        backTone="violet"
        cls={A.in}
        style={dl(240)}
        front={
          <M1Face icon="calendar" tone="violet" title="Ses connaissances ont une date">
            Le modèle a appris jusqu’à une date, puis plus rien.
          </M1Face>
        }
        back={
          <M1Back tone="violet" title="Connaissances datées" parade="activer la recherche web quand c’est autorisé, ou fournir la documentation à jour de l’éditeur.">
            Une version de Windows Server, une fin de support, un tarif de licence : sans recherche web, il répond avec ce qu’il savait.
          </M1Back>
        }
      />
    </div>
  </Frame>
);

// ─── Fenêtre de contexte ────────────────────────────────────────────────────
const M1Fit = ({ icon, label, size, w, tone, verdict, beat }: { icon: IconName; label: string; size: string; w: number; tone: Tone; verdict: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '470px 1fr 330px', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: 19, color: C.muted }}>{size}</div>
      </div>
    </div>
    <div style={{ position: 'relative', height: 26, borderRadius: 8, background: C.panel }}>
      <div className={b.grow(beat)} style={{ width: `${Math.min(w, 100)}%`, height: '100%', borderRadius: 8, background: STRONG[tone], ...dl(150) }} />
      {w > 100 ? <span className={b.pop(beat)} style={{ position: 'absolute', right: -14, top: -12, fontSize: 34, fontWeight: 800, color: C.coral, ...dl(700) }}>✕</span> : null}
    </div>
    <Tag tone={tone} size={20} style={{ justifySelf: 'start' }}>
      {verdict}
    </Tag>
  </div>
);

const M1_Contexte: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>La fenêtre de contexte, concrètement</Title>
    <Lede>Ce qui rentre en entier, et ce qu’il faut découper, filtrer ou faire calculer. La barre pleine représente la fenêtre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Fit beat={1} icon="mail" label="Un fil de 30 e-mails" size="une quinzaine de pages" w={4} tone="green" verdict="✓ facile" />
      <M1Fit beat={2} icon="book" label="Une procédure d’exploitation" size="une dizaine de pages" w={3} tone="green" verdict="✓ facile" />
      <M1Fit beat={3} icon="doc" label="Le rapport d’audit Orvalis" size="40 pages" w={12} tone="teal" verdict="✓ ça rentre" />
      <M1Fit beat={4} icon="table" label="L’export des 1 846 tickets" size="un fichier Excel de 8 colonnes" w={70} tone="yellow" verdict="≈ faire calculer" />
      <M1Fit beat={5} icon="server" label="Six mois de journaux de FS-02" size="plusieurs gigaoctets" w={140} tone="coral" verdict="✗ filtrer d’abord" />
    </div>
    <div className={b.fade(5)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(400) }}>
      <Callout title="La règle" tone="blue" icon="filter" size={25}>
        Pour un tableau, on ne demande pas à l’IA de tout lire : on lui demande de <strong>calculer</strong> (M6). Pour des journaux, on extrait d’abord la
        bonne période et les bonnes lignes.
      </Callout>
    </div>
  </Frame>
);

// ─── Une hallucination ──────────────────────────────────────────────────────
const M1_Hallu: Page = () => (
  <Frame mod={1} kind="exercice" beats={4}>
    <Title>Repérez l’invention</Title>
    <Lede>Thomas demande comment lister l’espace libre des serveurs. La réponse est fluide… et fausse. Cliquez les pastilles.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, width: 1000, height: 530, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted }}>
        <Icon name="user" size={24} color={C.navy} /> « Quelle commande affiche l’espace libre de tous les serveurs du domaine ? »
      </div>
      <div style={{ position: 'absolute', left: 30, top: 80, width: 940, fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        Bien sûr ! Voici la commande native à utiliser :
      </div>
      <CodeDark size={23} style={{ position: 'absolute', left: 30, top: 150, width: 940 }}>
        <Cf>Get-DiskSpaceReport</Cf> <Cn>-AllServers</Cn> <Cn>-Threshold</Cn> 15
      </CodeDark>
      <div style={{ position: 'absolute', left: 30, top: 280, width: 940, fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        Disponible nativement depuis Windows Server 2022, elle interroge tous les serveurs du domaine en une fois.
      </div>
      <div style={{ position: 'absolute', left: 30, top: 410, width: 940, fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        Elle est sans risque et ne demande aucun droit particulier.
      </div>
    </div>
    <Hotspot n={1} x={1150} y={300} at={1} w={560} title="« Bien sûr ! »">
      Le ton assuré ne prouve rien. Le modèle est toujours aussi sûr de lui.
    </Hotspot>
    <Hotspot n={2} x={1150} y={430} at={2} w={560} title="Une commande qui n’existe pas">
      Le nom ressemble à une vraie commande PowerShell, mais elle n’existe pas.
    </Hotspot>
    <Hotspot n={3} x={1150} y={560} at={3} w={560} title="Une affirmation sans source">
      « Nativement depuis 2022 » : précis, crédible, et inventé.
    </Hotspot>
    <Hotspot n={4} x={1150} y={690} at={4} w={560} title="Une promesse dangereuse">
      Seul un test en lecture seule, ou la documentation, peut le confirmer.
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 1680, display: 'flex', gap: 18, ...dl(400) }}>
      <Tag tone="green" size={21}>
        <Icon name="check" size={21} /> « Donne-moi le lien vers la documentation officielle »
      </Tag>
      <Tag tone="green" size={21}>
        <Icon name="check" size={21} /> « Es-tu sûr que cette commande existe ? »
      </Tag>
      <Tag tone="green" size={21}>
        <Icon name="check" size={21} /> Test en lecture seule
      </Tag>
    </div>
  </Frame>
);

// ─── Copilot : deux visages ─────────────────────────────────────────────────
const M1Feat = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 23, lineHeight: 1.4, color: C.soft }}>
    <Icon name={icon} size={28} color={T[tone].fg} style={{ marginTop: 2 }} />
    <span>{children}</span>
  </div>
);

const M1_CopilotDeux: Page = () => (
  <Frame mod={1}>
    <Title>Copilot : un nom, deux outils</Title>
    <Lede>La différence tient en une question : Copilot a-t-il accès à vos e-mails, réunions et fichiers ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 815, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${C.blue}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AppTile id="chat" size={56} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Copilot Chat</div>
          <div style={{ fontSize: 20, color: C.muted }}>Inclus avec votre compte professionnel Microsoft 365</div>
        </div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M1Feat icon="globe" tone="blue">Répond à partir du web et de ce que vous lui donnez : texte collé, fichier joint.</M1Feat>
        <M1Feat icon="shieldCheck" tone="green">Protection des données de l’entreprise : vos échanges ne servent pas à entraîner les modèles.</M1Feat>
        <M1Feat icon="eyeOff" tone="grey">Ne voit pas vos e-mails, vos réunions ni vos fichiers d’elle-même.</M1Feat>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 985, top: 270, width: 815, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${C.violet}`, ...dl(150) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AppTile id="copilot" size={56} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Microsoft 365 Copilot</div>
          <div style={{ fontSize: 20, color: C.muted }}>Licence supplémentaire, attribuée par utilisateur</div>
        </div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M1Feat icon="database" tone="violet">Lit vos e-mails, réunions, fichiers et conversations Teams, via Microsoft Graph.</M1Feat>
        <M1Feat icon="lock" tone="green">Ne voit que ce que vous avez déjà le droit de voir.</M1Feat>
        <M1Feat icon="layers" tone="violet">Intégré dans Outlook, Teams, Word, Excel et PowerPoint.</M1Feat>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 770, width: 1680, ...dl(400) }}>
      <Callout title="Un sujet pour les équipes infrastructure" tone="coral" icon="alert" size={25}>
        Copilot respecte les droits… y compris les mauvais. Un dossier SharePoint ouvert à tous devient trouvable par tous : le ménage dans les partages
        précède le déploiement.
      </Callout>
    </div>
  </Frame>
);

// ─── Copilot dans les applications ──────────────────────────────────────────
const M1Use = ({ children }: { children: ReactNode }) => (
  <Bullet size={25} tone="violet">
    {children}
  </Bullet>
);

const M1AppPane = ({ id, uses, prompt }: { id: AppId; uses: ReactNode; prompt: ReactNode }) => (
  <TabPane id={id}>
    <div style={{ display: 'flex', gap: 40 }}>
      <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Eyebrow c={C.navy} size={19}>
          Usages IT
        </Eyebrow>
        {uses}
      </div>
      <div style={{ flex: 1 }}>
        <PromptBox label={`Exemple · Copilot dans ${APPS[id].short}`} size={24}>
          {prompt}
        </PromptBox>
      </div>
    </div>
  </TabPane>
);

const M1_CopilotApps: Page = () => (
  <Frame mod={1} kind="demo">
    <Title>Microsoft 365 Copilot, application par application</Title>
    <Lede>Cliquez un onglet. Dans chaque application, « / » permet de citer un fichier, un e-mail ou une personne.</Lede>
    <Tabs initial="outlook" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 30 }}>
        <TabBtn id="outlook" tone="blue">
          <AppTile id="outlook" size={26} /> Outlook
        </TabBtn>
        <TabBtn id="teams" tone="violet">
          <AppTile id="teams" size={26} /> Teams
        </TabBtn>
        <TabBtn id="word" tone="blue">
          <AppTile id="word" size={26} /> Word
        </TabBtn>
        <TabBtn id="excel" tone="green">
          <AppTile id="excel" size={26} /> Excel
        </TabBtn>
        <TabBtn id="ppt" tone="coral">
          <AppTile id="ppt" size={26} /> PowerPoint
        </TabBtn>
      </div>
      <M1AppPane
        id="outlook"
        uses={
          <>
            <M1Use>Résumer un long fil avec un fournisseur</M1Use>
            <M1Use>Rédiger une réponse avec le bon ton</M1Use>
            <M1Use>Relire un message sensible avant envoi</M1Use>
          </>
        }
        prompt="Résume ce fil avec le prestataire Wi-Fi : engagements pris, dates promises, points encore ouverts. Termine par les questions à lui renvoyer."
      />
      <M1AppPane
        id="teams"
        uses={
          <>
            <M1Use>Récapitulatif de réunion (transcription activée)</M1Use>
            <M1Use>Retrouver une décision dans un canal</M1Use>
            <M1Use>« Qu’ai-je manqué ? » au retour d’astreinte</M1Use>
          </>
        }
        prompt="Liste les décisions prises et les actions décidées pendant le comité de changement de jeudi, avec le responsable et l’échéance de chacune."
      />
      <M1AppPane
        id="word"
        uses={
          <>
            <M1Use>Premier jet à partir d’un fichier existant</M1Use>
            <M1Use>Réécrire une procédure ancienne</M1Use>
            <M1Use>Résumer un rapport en une page</M1Use>
          </>
        }
        prompt="À partir de /journal-incident-FS02, rédige une procédure de purge des journaux : prérequis, étapes, vérifications, retour arrière."
      />
      <M1AppPane
        id="excel"
        uses={
          <>
            <M1Use>Écrire et expliquer une formule</M1Use>
            <M1Use>Créer un tableau croisé ou un graphique</M1Use>
            <M1Use>Repérer les valeurs anormales</M1Use>
          </>
        }
        prompt="Ajoute une colonne qui calcule le délai de résolution en heures, puis un tableau croisé des délais moyens par catégorie."
      />
      <M1AppPane
        id="ppt"
        uses={
          <>
            <M1Use>Créer une présentation depuis un document</M1Use>
            <M1Use>Résumer une présentation reçue</M1Use>
            <M1Use>Ajouter des notes pour l’orateur</M1Use>
          </>
        }
        prompt="Crée une présentation de six diapositives pour le comité de changement à partir de /dossier-migration-PRT01."
      />
    </Tabs>
  </Frame>
);

// ─── Claude ─────────────────────────────────────────────────────────────────
const M1Claude = ({ icon, title, children, d }: { icon: IconName; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone="coral" title={title} size={23} cls={A.in} style={{ ...dl(d), height: 300 }}>
    {children}
  </Card>
);

const M1_Claude: Page = () => (
  <Frame mod={1}>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 96, display: 'flex', alignItems: 'center', gap: 20 }}>
      <AppTile id="claude" size={64} />
      <h2 style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 54, color: C.navy }}>Claude : lire long, raisonner, produire</h2>
    </div>
    <Lede top={190}>L’assistant d’Anthropic. Il ne vit pas dans Outlook, mais il excelle sur les documents et les analyses.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <M1Claude icon="folder" title="Les projets" d={100}>
        Un espace par sujet : des instructions permanentes et des documents de référence. Idéal pour « l’assistant procédures » de l’équipe.
      </M1Claude>
      <M1Claude icon="book" title="Les longs documents" d={200}>
        Un rapport d’audit entier ou une documentation éditeur : il les lit d’un bloc et peut citer le passage exact.
      </M1Claude>
      <M1Claude icon="chart" title="L’analyse de fichiers" d={300}>
        Sur un fichier Excel ou CSV, il écrit et exécute lui-même le calcul. Il produit tableaux, graphiques et fichiers à télécharger.
      </M1Claude>
      <M1Claude icon="brain" title="Le raisonnement" d={400}>
        Un mode de réflexion approfondie pour les problèmes à plusieurs causes : diagnostic, arbitrage, plan de migration.
      </M1Claude>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="lock" size={24} color={C.coral} />
      Comptes professionnels (Team, Enterprise) : vos données ne servent pas à l’entraînement. Comptes personnels : vérifiez les paramètres.
    </div>
  </Frame>
);

// ─── Et les autres ──────────────────────────────────────────────────────────
const M1Other = ({ id, title, children, d }: { id: AppId; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <AppTile id={id} size={56} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const M1_Autres: Page = () => (
  <Frame mod={1}>
    <Title>ChatGPT et Gemini : des repères</Title>
    <Lede>Vous les avez cités dans le questionnaire. Les capacités se rapprochent ; ce qui change, c’est l’intégration à vos outils.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 30 }}>
      <M1Other id="chatgpt" title="ChatGPT · OpenAI" d={100}>
        <Bullet size={24} tone="green">Le plus répandu, très polyvalent</Bullet>
        <Bullet size={24} tone="green">Assistants personnalisés et analyse de données</Bullet>
        <Bullet size={24} tone="green">Le moteur d’une partie de Copilot</Bullet>
      </M1Other>
      <M1Other id="gemini" title="Gemini · Google" d={250}>
        <Bullet size={24} tone="violet">Intégré à Gmail, Docs et Sheets</Bullet>
        <Bullet size={24} tone="violet">Pertinent si l’entreprise est sous Google Workspace</Bullet>
        <Bullet size={24} tone="violet">Recherche web native</Bullet>
      </M1Other>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, ...dl(450) }}>
      <Callout title="La règle d’or" tone="blue" icon="shieldCheck" size={27}>
        Le meilleur outil est d’abord <strong>celui que votre entreprise autorise</strong>, avec un compte professionnel. Une version gratuite et personnelle
        n’offre pas les mêmes garanties sur vos données.
      </Callout>
    </div>
  </Frame>
);

// ─── Quatre questions pour choisir ──────────────────────────────────────────
const M1Q = ({ n, q, children, beat }: { n: number; q: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 24, background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 26px' }}>
    <Num n={n} tone="blue" size={52} />
    <div style={{ width: 520, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 27, color: C.navy, lineHeight: 1.25 }}>{q}</div>
    <div style={{ flex: 1, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M1_Criteres: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Choisir son outil : quatre questions</Title>
    <Lede>Dans cet ordre. La première réponse qui tranche donne le bon outil.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M1Q n={1} q="Qu’autorise l’entreprise ?" beat={1}>
        La charte prime sur tout. Pas d’outil personnel pour des données de travail.
      </M1Q>
      <M1Q n={2} q="Où sont les informations ?" beat={2}>
        Dans vos e-mails, réunions, SharePoint : <strong>Microsoft 365 Copilot</strong>. Dans un fichier isolé : les deux conviennent.
      </M1Q>
      <M1Q n={3} q="Quelle taille, quelle complexité ?" beat={3}>
        Un rapport très long, un raisonnement à plusieurs étapes : <strong>Claude</strong> est souvent plus à l’aise.
      </M1Q>
      <M1Q n={4} q="Faut-il calculer ?" beat={4}>
        Dans le classeur ouvert : <strong>Copilot dans Excel</strong>. Plusieurs fichiers à croiser : <strong>Claude</strong> ou l’agent Analyst.
      </M1Q>
    </div>
  </Frame>
);

// ─── Quel outil pour quelle tâche ? ─────────────────────────────────────────
const M1Verdict = ({ id, apps, why, tone = 'green' }: { id: string; apps: ReactNode; why: ReactNode; tone?: Tone }) => (
  <TabPane id={id}>
    <div style={{ display: 'flex', gap: 30, alignItems: 'stretch' }}>
      <div style={{ width: 600, flex: 'none', boxSizing: 'border-box', background: T[tone].bg, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '24px 28px' }}>
        <Eyebrow c={T[tone].fg} size={19}>
          Notre choix
        </Eyebrow>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>{apps}</div>
      </div>
      <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 28px' }}>
        <Eyebrow c={C.navy} size={19}>
          Pourquoi
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.45, color: C.ink }}>{why}</div>
      </div>
    </div>
  </TabPane>
);

const M1_Choisir: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>À vous : quel outil pour quelle tâche ?</Title>
    <Lede>Votez à main levée, puis cliquez la tâche pour afficher notre choix.</Lede>
    <Tabs initial="t1" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 30 }}>
        <TabBtn id="t1">Résumer un fil de 40 e-mails</TabBtn>
        <TabBtn id="t2">Lire un rapport de 120 pages</TabBtn>
        <TabBtn id="t3">Compte rendu du comité</TabBtn>
        <TabBtn id="t4">Croiser trois exports CSV</TabBtn>
        <TabBtn id="t5">Ticket → article KB</TabBtn>
        <TabBtn id="t6" tone="coral">
          Analyser des journaux bruts
        </TabBtn>
      </div>
      <M1Verdict id="t1" apps={<AppChip id="outlook" size={28} />} why="Le fil est déjà dans Outlook : Copilot le lit sur place, sans copier-coller, et respecte les droits d’accès." />
      <M1Verdict id="t2" apps={<AppChip id="claude" size={28} />} why="Un document très long, qu’il faut lire en entier et dont on veut citer les passages exacts : le point fort de Claude." />
      <M1Verdict id="t3" apps={<AppChip id="teams" size={28} />} why="Si la réunion était enregistrée et transcrite, Copilot dans Teams produit décisions et actions en quelques secondes." />
      <M1Verdict
        id="t4"
        apps={
          <>
            <AppChip id="claude" size={28} />
            <AppChip id="excel" size={28} />
          </>
        }
        why="Claude croise plusieurs fichiers en exécutant le calcul. Si tout est dans un classeur, Copilot dans Excel suffit."
      />
      <M1Verdict
        id="t5"
        apps={
          <>
            <AppChip id="copilot" size={28} />
            <AppChip id="claude" size={28} />
          </>
        }
        why="Les deux font très bien la rédaction. Prenez celui qui a déjà le ticket sous la main, et un modèle d’article commun."
      />
      <M1Verdict
        id="t6"
        tone="coral"
        apps={<div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: T.coral.fg }}>Aucun, pas tout de suite</div>}
        why="Des journaux bruts contiennent des adresses IP, des noms d’utilisateurs, parfois des secrets. On filtre et on anonymise d’abord (M4)."
      />
    </Tabs>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Atelier: Page = () => (
  <LabPage
    mod={1}
    n="1"
    tag="Atelier"
    kind="atelier"
    title="Même tâche, deux outils"
    defi="comparatif"
    who="En binôme · un poste par outil"
    minutes={20}
    where={
      <>
        <PathChip>Orvalis/journal-incident-FS02.docx</PathChip>
        <div style={{ marginTop: 10 }}>Une note de dix lignes par outil, et la grille de la page suivante remplie.</div>
      </>
    }
    objective={
      <>
        Résumer le journal de l’incident FS-02 pour le directeur logistique, une fois avec <strong>Copilot</strong>, une fois avec <strong>Claude</strong>, avec
        exactement le même prompt.
      </>
    }
    crit={
      <>
        <CheckItem id="a1-c1" size={22}>
          Même prompt, mot pour mot, dans les deux outils
        </CheckItem>
        <CheckItem id="a1-c2" size={22}>
          Chaque chiffre vérifié dans le journal
        </CheckItem>
        <CheckItem id="a1-c3" size={22}>
          Une note lisible par un non-technicien
        </CheckItem>
      </>
    }
  >
    <div>
      Prompt de départ : « Résume ce journal d’incident en dix lignes pour le directeur logistique : ce qui s’est passé, l’impact, la durée, ce qui est fait
      pour que ça ne recommence pas. Pas de jargon technique. »
    </div>
    <Bonus>Demandez ensuite à chaque outil : « Qu’as-tu laissé de côté, et pourquoi ? » Comparez les réponses.</Bonus>
  </LabPage>
);

// ─── Grille de comparaison (interactive) ────────────────────────────────────
const M1_CRIT = ['Fidélité au journal', 'Clarté pour le lecteur', 'Respect du format', 'Rapidité', 'Facilité d’accès'];

const M1Row = ({ label, a, bb, setA, setB }: { label: string; a: number; bb: number; setA: (v: number) => void; setB: (v: number) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr 1fr', alignItems: 'center', gap: 30, padding: '10px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <Range value={a} onChange={setA} min={0} max={5} w={380} tone="violet" />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.violet, width: 30 }}>{a}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <Range value={bb} onChange={setB} min={0} max={5} w={380} tone="coral" />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.coral, width: 30 }}>{bb}</span>
    </div>
  </div>
);

const M1_Grille: Page = () => {
  const [co, setCo] = useState([3, 3, 3, 3, 3]);
  const [cl, setCl] = useState([3, 3, 3, 3, 3]);
  const set = (arr: number[], f: (x: number[]) => void, i: number) => (v: number) => f(arr.map((x, j) => (j === i ? v : x)));
  const tCo = co.reduce((a, x) => a + x, 0);
  const tCl = cl.reduce((a, x) => a + x, 0);
  const verdict = tCo === tCl ? 'Égalité : choisissez selon le contexte' : tCo > tCl ? 'Copilot devant sur cette tâche' : 'Claude devant sur cette tâche';
  return (
    <Frame mod={1} kind="atelier">
      <Title>La grille commune : notez chaque outil de 0 à 5</Title>
      <Lede>Un binôme vient régler les curseurs à l’écran. On compare ensuite avec les autres binômes.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 34px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr 1fr', gap: 30, paddingBottom: 8 }}>
          <span />
          <AppChip id="copilot" size={24} />
          <AppChip id="claude" size={24} />
        </div>
        <M1Row label={M1_CRIT[0]} a={co[0]} bb={cl[0]} setA={set(co, setCo, 0)} setB={set(cl, setCl, 0)} />
        <M1Row label={M1_CRIT[1]} a={co[1]} bb={cl[1]} setA={set(co, setCo, 1)} setB={set(cl, setCl, 1)} />
        <M1Row label={M1_CRIT[2]} a={co[2]} bb={cl[2]} setA={set(co, setCo, 2)} setB={set(cl, setCl, 2)} />
        <M1Row label={M1_CRIT[3]} a={co[3]} bb={cl[3]} setA={set(co, setCo, 3)} setB={set(cl, setCl, 3)} />
        <M1Row label={M1_CRIT[4]} a={co[4]} bb={cl[4]} setA={set(co, setCo, 4)} setB={set(cl, setCl, 4)} />
        <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr 1fr', alignItems: 'center', gap: 30, paddingTop: 16 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Total / 25</span>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: C.violet }}>{tCo}</span>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: C.coral }}>{tCl}</span>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 16, ...dl(400) }}>
        <Tag tone={tCo === tCl ? 'grey' : tCo > tCl ? 'violet' : 'coral'} size={24}>
          <Icon name="scale" size={24} /> {verdict}
        </Tag>
        <Btn
          size={20}
          icon="reset"
          ghost
          tone="grey"
          onClick={() => {
            setCo([3, 3, 3, 3, 3]);
            setCl([3, 3, 3, 3, 3]);
          }}
        >
          Remettre à 3
        </Btn>
      </div>
    </Frame>
  );
};

// ─── Quiz & synthèse ────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz du module 1</Title>
    <QuizSeries y={200}>
      <QuizQ q="Que fait fondamentalement un modèle de langage ?" explain="Il prédit la suite la plus probable, mot après mot. C’est puissant, mais il ne vérifie pas ce qu’il écrit.">
        <QOpt>Il cherche la réponse dans une base de données vérifiée</QOpt>
        <QOpt ok>Il produit la suite de texte la plus probable</QOpt>
        <QOpt>Il exécute toujours un calcul exact</QOpt>
      </QuizQ>
      <QuizQ q="Copilot Chat, sans licence Microsoft 365 Copilot, peut-il lire vos e-mails ?" explain="Non : Copilot Chat travaille sur le web et sur ce que vous lui donnez. C’est la licence Microsoft 365 Copilot qui ouvre l’accès à vos données via Microsoft Graph.">
        <QOpt>Oui, tous vos e-mails</QOpt>
        <QOpt ok>Non, seulement ce que vous lui donnez</QOpt>
        <QOpt>Oui, mais seulement les e-mails non lus</QOpt>
      </QuizQ>
      <QuizQ q="Vous devez analyser un rapport d’audit de 120 pages et citer les passages. Votre premier choix ?" explain="Claude lit les très longs documents d’un bloc et cite les passages exacts. Copilot convient aussi pour des documents plus courts.">
        <QOpt ok>Claude</QOpt>
        <QOpt>Copilot dans Outlook</QOpt>
        <QOpt>Aucun, c’est trop long pour une IA</QOpt>
      </QuizQ>
      <QuizQ q="L’IA vous propose une commande PowerShell inconnue. Que faites-vous ?" explain="On vérifie dans la documentation officielle et on teste en lecture seule. Le ton assuré ne prouve rien.">
        <QOpt>Je l’exécute : l’IA a l’air sûre d’elle</QOpt>
        <QOpt ok>Je vérifie la documentation et je teste en lecture seule</QOpt>
        <QOpt>Je l’exécute en administrateur pour éviter les erreurs</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Ce qu’on retient du module 1</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        Un LLM produit un texte <strong>plausible</strong> : c’est vous le contrôle qualité.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Trois limites : <strong>contexte</strong> limité, <strong>inventions</strong>, connaissances <strong>datées</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        <strong>Copilot</strong> quand l’information est dans Microsoft 365, <strong>Claude</strong> pour le long et le complexe.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        On compare deux outils avec <strong>le même prompt</strong> et <strong>la même grille</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Le premier critère reste <strong>ce que l’entreprise autorise</strong>.
      </SynthRow>
    </div>
    <PosteCard>
      Ouvrez Copilot et Claude côte à côte. Pour votre prochaine tâche de rédaction, posez la même demande aux deux et gardez le meilleur résultat.
    </PosteCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_MotSuivant, M1_Limites, M1_Contexte, M1_Hallu, M1_CopilotDeux, M1_CopilotApps, M1_Claude, M1_Autres, M1_Criteres, M1_Choisir, M1_Atelier, M1_Grille, M1_Quiz, M1_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M1 · 9:30

OBJECTIF — Annoncer le module : comprendre avant de choisir.

DIRE — « Avant d’utiliser un outil, il faut savoir ce qu’il fait vraiment. On va voir en dix minutes comment fonctionne un modèle de langage, ses trois limites, puis les deux outils principaux de la formation, Copilot et Claude, avec ChatGPT et Gemini en repère. On termine par un atelier : la même tâche, dans les deux outils. »

TRANSITION — « Commençons par le cœur du sujet : comment l’IA écrit. »`,
  `⏱ 4 min · LE MOT SUIVANT (3 clics)

OBJECTIF — Faire comprendre qu’un LLM produit du texte plausible, pas vérifié.

DIRE — « Tous ces outils reposent sur un grand modèle de langage. Son principe est simple : à partir du texte déjà écrit, il prédit le mot suivant. » → beat 1 : « Voici ce qu’il envisage après “son disque est” : plein, saturé, défectueux… et presque jamais “magnifique”. » → beat 2 : « Il choisit “plein”, puis recommence avec le mot d’après, et ainsi de suite. » → beat 3 : « Il ne vérifie rien. Il produit ce qui est plausible. Et la plupart du temps, plausible et vrai coïncident. Mais pas toujours. »

INSISTER — Les pourcentages sont illustratifs. Le message : le modèle n’a aucune notion de vérité.

TRANSITION — « Ce fonctionnement explique ses trois limites. »`,
  `⏱ 5 min · TROIS LIMITES (3 clics)

OBJECTIF — Présenter fenêtre de contexte, hallucinations et connaissances datées, avec leur parade.

DIRE — → beat 1 : « Première limite : la mémoire de travail. Le modèle ne lit qu’une quantité limitée de texte à la fois. Au-delà, il oublie le début. Et d’une conversation à l’autre, il ne se souvient de rien. Parade : ne donner que l’utile, et une conversation par sujet. » → beat 2 : « Deuxième limite : il peut inventer. Une commande, un paramètre, un chiffre. Parade : vérifier, demander la source, tester en lecture seule. » → beat 3 : « Troisième limite : ses connaissances s’arrêtent à une date. Une fin de support, une version récente : sans recherche web, il répond avec ce qu’il savait. »

ANIMATION — Les cartes se retournent aussi au clic de souris : utile si un participant pose une question sur une carte précise.

TRANSITION — « Voyons la première limite de plus près. »`,
  `⏱ 3 min · FENÊTRE DE CONTEXTE (5 clics)

OBJECTIF — Donner des repères concrets sur ce qui rentre ou non.

DIRE — Une ligne par clic. → beat 1 : « Un fil de 30 e-mails : aucun problème. » → beat 2 : « Une procédure : aucun problème. » → beat 3 : « Le rapport d’audit d’Orvalis, 40 pages : ça rentre. » → beat 4 : « L’export des 1 846 tickets : ça peut rentrer, mais ce n’est pas la bonne méthode. On ne demande pas à l’IA de lire 1 846 lignes, on lui demande de calculer. » → beat 5 : « Six mois de journaux : beaucoup trop. On filtre d’abord. »

INSISTER — Les tailles de fenêtre varient selon les outils et les versions ; retenir l’ordre de grandeur, pas un chiffre.

TRANSITION — « Et maintenant, la deuxième limite, en situation. »`,
  `⏱ 4 min · REPÉREZ L’INVENTION (exercice, 4 clics)

OBJECTIF — Apprendre à repérer une hallucination dans une réponse technique.

DIRE — « Thomas demande à une IA comment lister l’espace libre des serveurs. Lisez la réponse. Qu’est-ce qui vous gêne ? » Laisser répondre. → beat 1 : « Le “Bien sûr !” : le ton ne prouve rien. » → beat 2 : « La commande n’existe pas. Elle ressemble à une vraie commande, c’est tout. » → beat 3 : « “Nativement depuis 2022” : précis, crédible, inventé. » → beat 4 : « Et “sans risque” : seul un test le dira. En bas, les trois bons réflexes. On écrira la vraie commande ensemble au module 7, et vous verrez qu’elle est différente. »

ANIMATION — Les pastilles s’ouvrent aussi au clic. Faire voter : « Qui aurait exécuté la commande ? »

TRANSITION — « Passons aux outils. D’abord Copilot, qui a deux visages. »`,
  `⏱ 4 min · COPILOT : DEUX OUTILS

OBJECTIF — Distinguer Copilot Chat et Microsoft 365 Copilot.

DIRE — « Quand on dit Copilot, on parle souvent de deux choses. Copilot Chat est inclus avec votre compte professionnel : il travaille avec le web et avec ce que vous lui donnez, et vos échanges sont protégés. Microsoft 365 Copilot demande une licence : lui a accès à vos e-mails, vos réunions, vos fichiers, grâce à Microsoft Graph. Mais seulement à ce que vous avez déjà le droit de voir. »

INSISTER — Point clé pour un public infrastructure : Copilot respecte les droits, y compris les droits trop larges. Le ménage dans les partages SharePoint et OneDrive est un préalable au déploiement.

QUESTION — « Qui a une licence Microsoft 365 Copilot dans le groupe ? » Adapter les démonstrations.

TRANSITION — « Voyons ce que Copilot fait dans chaque application. »`,
  `⏱ 5 min · COPILOT DANS LES APPLICATIONS (démo)

OBJECTIF — Donner des usages IT concrets par application.

DIRE — Cliquer chaque onglet. « Outlook : résumer un long fil avec un fournisseur, rédiger une réponse. Teams : le récapitulatif de réunion, si la transcription est activée. Word : un premier jet à partir d’un fichier existant. Excel : écrire et expliquer des formules, créer des tableaux croisés. PowerPoint : une présentation à partir d’un document. Dans chaque application, la barre oblique permet de citer un fichier ou un e-mail précis. »

ANIMATION — Si une licence est disponible, faire la démonstration Outlook en direct sur un fil fictif.

TRANSITION — « Le deuxième outil : Claude. »`,
  `⏱ 4 min · CLAUDE

OBJECTIF — Présenter Claude à un groupe qui le connaît peu (2 personnes sur 5).

DIRE — « Claude est l’assistant d’Anthropic. Il ne vit pas dans Outlook, mais il est très fort sur quatre points. Les projets : un espace par sujet, avec des instructions permanentes et des documents de référence. Les longs documents : il lit un rapport entier et peut citer le passage exact. L’analyse de fichiers : sur un fichier Excel, il écrit et exécute lui-même le calcul, et produit tableaux et graphiques. Et le raisonnement, pour les problèmes à plusieurs causes. »

INSISTER — Comptes professionnels : pas d’entraînement sur vos données. Comptes personnels : vérifier les paramètres de confidentialité.

TRANSITION — « Et les deux autres outils que vous avez cités ? »`,
  `⏱ 2 min · CHATGPT ET GEMINI

OBJECTIF — Situer les autres outils sans s’y attarder.

DIRE — « ChatGPT est le plus répandu, et une partie de Copilot repose sur ses modèles. Gemini est intégré à Google Workspace : pertinent si votre entreprise est chez Google. Les capacités se rapprochent d’année en année. La vraie différence, c’est l’intégration à vos outils. Et la règle d’or : le meilleur outil est celui que votre entreprise autorise, avec un compte professionnel. »

TRANSITION — « Alors, comment choisir ? Quatre questions. »`,
  `⏱ 3 min · QUATRE QUESTIONS (4 clics)

OBJECTIF — Donner une méthode de choix simple.

DIRE — → beat 1 : « D’abord : qu’autorise l’entreprise ? C’est éliminatoire. » → beat 2 : « Ensuite : où sont les informations ? Dans Microsoft 365, Copilot les lit sur place. » → beat 3 : « Quelle taille, quelle complexité ? Pour le très long et le raisonnement, Claude est souvent plus à l’aise. » → beat 4 : « Faut-il calculer ? Dans le classeur, Copilot dans Excel. Plusieurs fichiers à croiser : Claude, ou l’agent Analyst de Microsoft 365 Copilot. »

TRANSITION — « Testons la méthode sur six tâches. »`,
  `⏱ 5 min · QUEL OUTIL POUR QUELLE TÂCHE ? (exercice)

OBJECTIF — Appliquer les quatre questions.

DIRE — Lire chaque tâche, faire voter, puis cliquer l’onglet. « Résumer 40 e-mails : Outlook. Un rapport de 120 pages : Claude. Le compte rendu du comité : Teams. Trois exports CSV : Claude, ou Excel si tout est dans un classeur. Un article de base de connaissances : les deux. Et les journaux bruts : aucun, pas tout de suite. On y revient au module 4. »

RÉPONSES TYPES — Les participants proposent souvent ChatGPT par habitude : rappeler la question 1 (l’outil autorisé).

TRANSITION — « À vous de comparer pour de vrai. »`,
  `⏱ 2 min + 20 min · ATELIER 1 (minuteur)

OBJECTIF — Comparer Copilot et Claude sur une même tâche.

DIRE — « En binôme. Une personne travaille avec Copilot, l’autre avec Claude. Même prompt, mot pour mot. Vous résumez le journal de l’incident FS-02 pour le directeur logistique. Puis vous vérifiez chaque chiffre dans le journal, et vous remplissez la grille de la page suivante. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Repérer une différence intéressante entre les deux outils pour la restitution.

RÉPONSES TYPES — Écarts fréquents : un outil oublie la cause, l’autre garde du jargon ; durée mal calculée (2 h 39 et non « environ 3 h »).

TRANSITION — « Remplissons la grille ensemble. »`,
  `⏱ 6 min · GRILLE DE COMPARAISON (interactive)

OBJECTIF — Restituer l’atelier avec une grille commune.

DIRE — « Un binôme vient régler les curseurs. Fidélité au journal, clarté, respect du format, rapidité, facilité d’accès. » Puis demander aux autres binômes s’ils ont le même résultat. « Ce qu’on constate presque toujours : les écarts entre binômes sont plus grands que les écarts entre outils. Le prompt et la vérification comptent plus que l’outil. »

ANIMATION — Les curseurs se règlent à la souris. Le bouton « Remettre à 3 » réinitialise pour le binôme suivant.

TRANSITION — « Vérifions ce qu’on a retenu. »`,
  `⏱ 4 min · QUIZ M1

OBJECTIF — Évaluation formative du module 1.

DIRE — « Quatre questions. Votez à main levée, puis je clique. »

ANIMATION — Les boutons numérotés à droite permettent de naviguer entre les questions. Le score « du premier coup » se met à jour.

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M1

OBJECTIF — Ancrer les cinq idées du module.

DIRE — « Un LLM produit du plausible : c’est vous le contrôle qualité. Trois limites : le contexte, les inventions, la date. Copilot quand l’information est dans Microsoft 365, Claude pour le long et le complexe. On compare avec le même prompt et la même grille. Et le premier critère reste ce que l’entreprise autorise. »

ANIMATION — Pointer la carte de droite : la pratique à faire dès lundi.

TRANSITION — « On a vu que le prompt compte plus que l’outil. Module 2 : bien formuler. »`,
];
// @@NOTES-END
