// ─── Module 3 · Les assistants IA pour gagner du temps ──────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title="Les assistants IA pour gagner du temps"
    sub="Cinq assistants généralistes, cinq personnalités : savoir ce que chacun fait le mieux, et le tester sur une même tâche."
    dur="70 min"
    labs={<DefiBadge defi="comparatif" />}
  >
    <SecItem n={1}>ChatGPT · Microsoft Copilot · Google Gemini</SecItem>
    <SecItem n={2}>Claude · Perplexity</SecItem>
    <SecItem n={3}>Banc d’essai : une même tâche, plusieurs assistants</SecItem>
    <SecItem n={4}>Quel assistant pour quelle situation ?</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Panorama ───────────────────────────────────────────────────────────────
const M3Col = ({ id, best, lives, free, d }: { id: ToolId; best: string; lives: string; free: string; d: number }) => {
  const t = tool(id);
  return (
    <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 22px', borderTop: `8px solid ${t.c}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
      <ToolTile id={id} size={72} cls={A.pop} style={dl(d + 200)} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy, lineHeight: 1.15 }}>{t.short ?? t.name}</div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>Idéal pour</div>
      <div style={{ fontSize: 22, lineHeight: 1.35, color: C.ink, minHeight: 90 }}>{best}</div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>Il vit dans</div>
      <div style={{ fontSize: 21, lineHeight: 1.35, color: C.soft, minHeight: 60 }}>{lives}</div>
      <div style={{ marginTop: 'auto', fontSize: 19, color: C.muted, lineHeight: 1.35 }}>
        <Icon name="ticket" size={20} color={C.faint} style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 6 }} />
        {free}
      </div>
    </div>
  );
};

const M3_Panorama: Page = () => (
  <Frame mod={3}>
    <Title>Cinq assistants, cinq personnalités</Title>
    <Lede>Tous savent rédiger, résumer et répondre. Ce qui les distingue : leur terrain de jeu et leur point fort.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 620, display: 'flex', gap: 20 }}>
      <M3Col id="chatgpt" best="Rédaction, brainstorming, analyse de fichiers : le polyvalent" lives="Son site, son application, le mobile" free="Gratuit · offres payantes" d={100} />
      <M3Col id="copilot" best="Vos emails, documents et réunions Microsoft" lives="Outlook, Word, Excel, PowerPoint, Teams" free="Chat gratuit · M365 Copilot payant" d={200} />
      <M3Col id="gemini" best="Vos emails et fichiers Google, la recherche approfondie" lives="Gmail, Docs, Drive, Android" free="Gratuit · offres Workspace" d={300} />
      <M3Col id="claude" best="Les longs documents et l’écriture nuancée" lives="Son site, son application" free="Gratuit · offres payantes" d={400} />
      <M3Col id="perplexity" best="Les réponses actuelles avec leurs sources" lives="Son site, son navigateur, le mobile" free="Gratuit · offre Pro" d={500} />
    </div>
  </Frame>
);

// ─── Outil 1 · ChatGPT ──────────────────────────────────────────────────────
const M3Idea = ({ n, t, time }: { n: number; t: string; time: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, lineHeight: 1.3 }}>
    <Num n={n} tone="green" size={28} />
    <span style={{ flex: 1 }}>{t}</span>
    <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>{time}</span>
  </div>
);

const M3_ChatGPT: Page = () => (
  <ToolPage
    mod={3}
    id="chatgpt"
    tone="green"
    tagline="le couteau suisse"
    feats={[
      ['pen', 'Rédiger et reformuler', 'Emails, comptes rendus, posts, procédures : un premier jet en quelques secondes.'],
      ['bulb', 'Brainstormer', 'Idées de titres, plans, objections clients, questions d’entretien.'],
      ['chart', 'Analyser des fichiers', 'Un tableur ou un PDF joint : il calcule, trace des graphiques, résume.'],
      ['archive', 'Personnaliser', 'Projets et GPT personnalisés : vos consignes et documents, réutilisés à chaque fois.'],
    ]}
    exTitle="brainstorming"
    prompt="Je lance une newsletter interne mensuelle pour 300 salariés. Propose 8 rubriques récurrentes, avec le temps de préparation de chacune."
    answer={
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 26px' }}>
        <M3Idea n={1} t="Portrait d’un collègue" time="1 h" />
        <M3Idea n={2} t="Le chiffre du mois" time="15 min" />
        <M3Idea n={3} t="Bienvenue aux arrivants" time="20 min" />
        <M3Idea n={4} t="Trois questions à la direction" time="30 min" />
        <M3Idea n={5} t="L’astuce outil" time="20 min" />
        <M3Idea n={6} t="Coulisses d’un projet" time="1 h" />
        <M3Idea n={7} t="Agenda et événements" time="10 min" />
        <M3Idea n={8} t="La photo du mois" time="10 min" />
        <div style={{ gridColumn: '1 / 3', marginTop: 6, fontSize: 19, color: C.muted }}>Voulez-vous que je propose aussi un nom pour la newsletter ?</div>
      </div>
    }
    watch="Version gratuite : vos échanges peuvent servir à entraîner les modèles (désactivable dans les paramètres). Rien de confidentiel sans offre entreprise validée."
    tip="les « Projets » regroupent conversations, fichiers et consignes d’un même dossier : plus besoin de réexpliquer le contexte."
  />
);

// ─── Outil 2 · Microsoft Copilot ────────────────────────────────────────────
const M3Line = ({ icon, c, children }: { icon: IconName; c: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 19, lineHeight: 1.38 }}>
    <Icon name={icon} size={22} color={c} style={{ marginTop: 3 }} />
    <span>{children}</span>
  </div>
);

const M3_Copilot: Page = () => (
  <ToolPage
    mod={3}
    id="copilot"
    tone="blue"
    tagline="l’IA dans Microsoft 365"
    feats={[
      ['mail', 'Outlook', 'Résumer un long fil d’emails, proposer une réponse, ajuster le ton.'],
      ['doc', 'Word et PowerPoint', 'Rédiger à partir de vos fichiers, transformer un document en présentation.'],
      ['mic', 'Teams', 'Récapitulatif de réunion, décisions, tâches : « qu’est-ce que j’ai raté ? »'],
      ['table', 'Excel', 'Analyser un tableau, créer formules et graphiques en langage courant.'],
    ]}
    exTitle="Teams · après la réunion"
    prompt="Résume la réunion de ce matin sur le projet Horizon : décisions, actions avec responsable, points en suspens."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong style={{ fontSize: 18, letterSpacing: '0.06em', color: C.blue }}>DÉCISIONS</strong>
        <M3Line icon="check" c={C.green}>Lancement reporté au 2 décembre · budget communication validé (12 k€)</M3Line>
        <strong style={{ fontSize: 18, letterSpacing: '0.06em', color: C.blue }}>ACTIONS</strong>
        <M3Line icon="user" c={C.blue}>Nadia : planning révisé, vendredi · Karim : devis agence, le 20</M3Line>
        <strong style={{ fontSize: 18, letterSpacing: '0.06em', color: C.blue }}>EN SUSPENS</strong>
        <M3Line icon="alert" c={C.amber}>Choix du prestataire de formation : à trancher au comité du 18</M3Line>
      </div>
    }
    watch="Copilot voit tout ce à quoi vous avez accès : un partage trop large devient visible. L’intégration à Outlook, Word et Teams demande une licence Microsoft 365 Copilot."
    tip="connectez-vous avec votre compte professionnel : vos échanges bénéficient alors de la protection des données de l’entreprise."
  />
);

// ─── Outil 3 · Google Gemini ────────────────────────────────────────────────
const M3_Gemini: Page = () => (
  <ToolPage
    mod={3}
    id="gemini"
    tone="violet"
    tagline="l’IA de Google Workspace"
    feats={[
      ['mail', 'Gmail, Docs, Drive', 'Résumer des emails, rédiger dans Docs, retrouver une info dans vos fichiers.'],
      ['search', 'Recherche approfondie', 'Deep Research parcourt des dizaines de pages et livre un rapport sourcé.'],
      ['video', 'Formats variés', 'Longs PDF, images, vidéos YouTube : il les lit et les résume.'],
      ['bot', 'Gems', 'Des assistants personnalisés avec vos consignes, réutilisables.'],
    ]}
    exTitle="Gmail · suivi fournisseur"
    prompt="@Gmail Résume mes échanges avec le fournisseur Brévia sur les deux dernières semaines et liste ce qui reste à régler."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>6 emails échangés entre le 28 septembre et le 9 octobre.</div>
        <M3Line icon="check" c={C.green}>Tarifs 2027 acceptés (+3,5 %), contrat signé le 2 octobre</M3Line>
        <M3Line icon="alert" c={C.amber}>À régler : facture n° 2291 en double, avoir promis mais non reçu</M3Line>
        <M3Line icon="alert" c={C.amber}>À régler : date de la livraison de novembre toujours pas confirmée</M3Line>
        <div style={{ fontSize: 19, color: C.muted }}>Je peux rédiger une relance groupée sur ces deux points.</div>
      </div>
    }
    watch="Avec un compte Gmail personnel, vos échanges peuvent être relus pour améliorer le service. Pour le travail, utilisez un compte Google Workspace professionnel."
    tip="tapez @Gmail, @Drive ou @Docs dans Gemini pour interroger directement vos emails ou vos fichiers."
  />
);

// ─── Outil 4 · Claude ───────────────────────────────────────────────────────
const M3_Claude: Page = () => (
  <ToolPage
    mod={3}
    id="claude"
    tone="yellow"
    tagline="la plume et l’analyste"
    feats={[
      ['doc', 'Longs documents', 'Rapports, contrats, appels d’offres de centaines de pages, analysés finement.'],
      ['pen', 'Qualité d’écriture', 'Un français naturel et nuancé, qui suit bien les consignes de ton.'],
      ['archive', 'Projets', 'Documents de référence et consignes partagés par toutes vos conversations.'],
      ['layers', 'Artefacts', 'Crée documents, tableaux ou mini-outils affichés à côté de la conversation.'],
    ]}
    exTitle="analyse d’un appel d’offres"
    prompt="Voici le cahier des charges (60 pages, joint). Liste les exigences éliminatoires, les dates clés et les points flous à clarifier avec l’acheteur."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <M3Line icon="x" c={C.coral}>
          <strong>Éliminatoire :</strong> certification ISO 27001 en cours de validité (p. 12) ; références de 3 marchés similaires (p. 14)
        </M3Line>
        <M3Line icon="calendar" c={C.blue}>
          <strong>Dates :</strong> questions avant le 4 novembre · remise des offres le 18 novembre, 12 h (p. 3)
        </M3Line>
        <M3Line icon="alert" c={C.amber}>
          <strong>Flou :</strong> volume annuel « estimé » sans fourchette (p. 22) ; pénalités de retard non chiffrées (p. 41)
        </M3Line>
      </div>
    }
    watch="Vérifiez chaque point à la page citée : une page mal attribuée arrive. Aucun document client confidentiel sans offre professionnelle validée par votre entreprise."
    tip="demandez-lui de citer le passage exact et la page pour chaque point : la vérification devient immédiate."
  />
);

// ─── Outil 5 · Perplexity ───────────────────────────────────────────────────
const Src = ({ n }: { n: number }) => (
  <sup style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22, borderRadius: 6, background: T.teal.bg, color: T.teal.fg, fontSize: 14, fontWeight: 700, margin: '0 2px', verticalAlign: '4px' }}>
    {n}
  </sup>
);

const M3_Perplexity: Page = () => (
  <ToolPage
    mod={3}
    id="perplexity"
    tone="teal"
    tagline="la réponse avec ses sources"
    feats={[
      ['globe', 'Recherche web en temps réel', 'Une réponse rédigée à partir de pages actuelles, pas d’une mémoire figée.'],
      ['link', 'Sources numérotées', 'Chaque affirmation renvoie à sa source : on clique, on vérifie.'],
      ['loop', 'Questions de suivi', 'Il suggère les questions suivantes pour creuser le sujet.'],
    ]}
    exTitle="question réglementaire"
    prompt="Facturation électronique : quelles obligations pour une PME française, et à partir de quand ? Sources officielles en priorité."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          Depuis le <strong>1er septembre 2026</strong>, toutes les entreprises doivent pouvoir <strong>recevoir</strong> des factures électroniques
          <Src n={1} />. Les PME devront les <strong>émettre</strong> à partir du <strong>1er septembre 2027</strong>
          <Src n={1} />
          <Src n={2} />, via une plateforme agréée
          <Src n={3} />.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 17 }}>
          <Tag tone="teal" size={16}>1 · impots.gouv.fr</Tag>
          <Tag tone="teal" size={16}>2 · economie.gouv.fr</Tag>
          <Tag tone="teal" size={16}>3 · blog d’un éditeur</Tag>
        </div>
      </div>
    }
    watch="Une source citée n’est pas une source fiable : ouvrez-la. Site officiel, presse ou blog commercial ? Et dit-elle vraiment ce qui est affirmé ?"
    tip="pour une question réglementaire, ajoutez « sources officielles en priorité (.gouv.fr) » et vérifiez la date de chaque page."
  />
);

// ─── Atelier 3 · banc d’essai ───────────────────────────────────────────────
const M3_Lab: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Une même tâche, plusieurs assistants"
    defi="comparatif"
    who="Binômes · 2 assistants par binôme"
    minutes={20}
    tools={['perplexity', 'chatgpt', 'copilot', 'gemini', 'claude']}
    objective={
      <>
        Réaliser la même chaîne <strong>rechercher → analyser → synthétiser → produire une réponse professionnelle</strong> avec deux assistants, et comparer.
      </>
    }
    where={
      <>
        Les deux emails finaux côte à côte, la grille de comparaison remplie, et <strong>une recommandation</strong> : quel assistant pour quelle étape ?
      </>
    }
    crit={
      <>
        <CheckItem id="l3-c1" size={21}>Les 4 étapes faites avec les 2 outils</CheckItem>
        <CheckItem id="l3-c2" size={21}>Mêmes prompts pour les deux</CheckItem>
        <CheckItem id="l3-c3" size={21}>Au moins une source vérifiée</CheckItem>
        <CheckItem id="l3-c4" size={21}>La grille est notée et argumentée</CheckItem>
      </>
    }
  >
    <div style={{ marginBottom: 10 }}>
      <strong style={{ color: C.navy }}>Le cas :</strong> votre directrice vous demande « un point rapide » sur la <strong>semaine de quatre jours</strong> : est-ce une piste
      sérieuse pour votre entreprise de services de 120 salariés ?
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Chaque binôme choisit deux assistants (dont si possible Perplexity).</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Copiez les 4 prompts de la page suivante, dans l’ordre, dans chaque outil.</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Notez chaque assistant avec la grille, puis restitution en 1 minute.</div>
    </div>
  </LabPage>
);

const M3Step = ({ n, tone, verb, ids, children, d }: { n: number; tone: Tone; verb: string; ids: ToolId[]; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'stretch', ...dl(d) }}>
    <div style={{ flex: 'none', width: 230, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', borderRadius: 16, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 18, opacity: 0.85 }}>ÉTAPE {n}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30 }}>{verb}</span>
      <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
        {ids.map((id) => (
          <ToolTile key={id} id={id} size={30} />
        ))}
      </div>
    </div>
    <div style={{ flex: 1, background: '#0F1530', borderRadius: 16, padding: '16px 22px', fontFamily: mono, fontSize: 20, lineHeight: 1.5, color: '#E6EAF6' }}>{children}</div>
  </div>
);

const M3_LabPrompts: Page = () => (
  <Frame mod={3} kind="lab" label="Atelier 3 · Les 4 prompts à enchaîner">
    <Title size={46}>Les quatre prompts, à enchaîner dans la même conversation</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Step n={1} tone="teal" verb="Rechercher" ids={['perplexity', 'gemini']} d={100}>
        Quels retours d’expérience existent en France sur la semaine de quatre jours en entreprise depuis 2022 ? Donne des exemples concrets et <Cs>cite tes sources avec leur date</Cs>.
      </M3Step>
      <M3Step n={2} tone="blue" verb="Analyser" ids={['chatgpt', 'claude']} d={200}>
        À partir de ces informations, dresse un tableau <Cs>avantages / risques / conditions de réussite</Cs> pour une entreprise de services de 120 salariés.
      </M3Step>
      <M3Step n={3} tone="violet" verb="Synthétiser" ids={['claude', 'copilot']} d={300}>
        Résume l’essentiel en <Cs>5 points</Cs> pour une directrice qui a deux minutes. Signale ce qui reste incertain.
      </M3Step>
      <M3Step n={4} tone="green" verb="Produire" ids={['copilot', 'chatgpt']} d={400}>
        Rédige l’email de réponse à ma directrice : synthèse, <Cs>recommandation prudente</Cs> et prochaine étape proposée. 180 mots maximum, ton factuel.
      </M3Step>
    </div>
  </Frame>
);

// ─── Grille de comparaison (interactive) ────────────────────────────────────
const M3_CRIT = ['Pertinence', 'Sources', 'Rédaction', 'Rapidité', 'Facilité'];
const M3_IDS: ToolId[] = ['chatgpt', 'copilot', 'gemini', 'claude', 'perplexity'];

const M3_Grid: Page = () => {
  const [sc, setSc] = useState<Record<string, number>>({});
  const total = (id: string) => M3_CRIT.reduce((a, c) => a + (sc[`${id}-${c}`] ?? 0), 0);
  const best = Math.max(...M3_IDS.map(total));
  return (
    <Frame mod={3} kind="exercice">
      <Title>La grille du banc d’essai</Title>
      <Lede>Cliquez une case pour noter de 0 à 3 étoiles (un clic de plus repart à zéro). Le total s’affiche à droite.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px repeat(5, 1fr) 150px', alignItems: 'center', gap: 10, padding: '6px 0 12px', borderBottom: `2px solid ${C.rule}` }}>
          <span />
          {M3_CRIT.map((c) => (
            <span key={c} style={{ textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 20, color: C.navy }}>
              {c}
            </span>
          ))}
          <span style={{ textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 20, color: C.navy }}>Total</span>
        </div>
        {M3_IDS.map((id) => (
          <div key={id} style={{ display: 'grid', gridTemplateColumns: '300px repeat(5, 1fr) 150px', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1.5px solid ${C.panel}` }}>
            <ToolChip id={id} size={24} />
            {M3_CRIT.map((c) => {
              const key = `${id}-${c}`;
              const v = sc[key] ?? 0;
              return (
                <button
                  key={c}
                  type="button"
                  data-osd-interactive
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setSc((o) => ({ ...o, [key]: ((o[key] ?? 0) + 1) % 4 }));
                  }}
                  style={{ height: 62, border: 'none', borderRadius: 12, cursor: 'pointer', background: v ? T.yellow.bg : C.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  {[1, 2, 3].map((i) => (
                    <Icon key={i} name="star" size={28} color={i <= v ? C.amber : C.faint} sw={1.8} style={i <= v ? { fill: C.yellow } : undefined} />
                  ))}
                </button>
              );
            })}
            <span style={{ textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 38, color: total(id) && total(id) === best ? C.green : C.navy }}>
              {total(id)}
              <span style={{ fontSize: 20, color: C.faint }}> /15</span>
            </span>
          </div>
        ))}
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
        Pas de vainqueur absolu : la conclusion attendue est « tel outil pour telle étape ».
      </Hint>
    </Frame>
  );
};

// ─── Quel assistant pour quelle situation ? (cartes à retourner) ────────────
const M3Flip = ({ situation, id, why, d }: { situation: string; id: ToolId; why: string; d: number }) => (
  <FlipCard
    w={530}
    h={270}
    cls={A.in}
    style={dl(d)}
    tone="violet"
    backTone="green"
    front={
      <>
        <Eyebrow c={C.violet} size={17}>
          Situation
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.35, fontWeight: 600, color: C.ink }}>{situation}</div>
      </>
    }
    back={
      <>
        <ToolChip id={id} size={30} full />
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{why}</div>
      </>
    }
  />
);

const M3_Which: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Quel assistant pour quelle situation ?</Title>
    <Lede>Le groupe vote, puis on retourne la carte. Plusieurs réponses sont parfois défendables : argumentez !</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', gap: 45, rowGap: 30 }}>
      <M3Flip d={100} situation="Résumer un fil de 40 emails reçu dans Outlook" id="copilot" why="Il est déjà dans Outlook : un clic sur « Résumer », sans copier-coller." />
      <M3Flip d={180} situation="Trouver les chiffres récents d’un marché, avec sources" id="perplexity" why="Recherche web en temps réel et sources numérotées à vérifier." />
      <M3Flip d={260} situation="Analyser un appel d’offres de 80 pages" id="claude" why="Excellent sur les longs documents, et capable de citer les pages. Gemini fait aussi l’affaire." />
      <M3Flip d={340} situation="Trouver 20 idées de noms pour un nouveau service" id="chatgpt" why="Brainstorming : le polyvalent par excellence. Tous les assistants s’en sortent bien." />
      <M3Flip d={420} situation="Retrouver une information perdue dans ma messagerie Gmail" id="gemini" why="Avec @Gmail, il interroge directement vos emails Google." />
      <M3Flip d={500} situation="Préparer des slides à partir d’un document Word" id="copilot" why="Dans PowerPoint, Copilot crée une présentation à partir d’un fichier Word." />
    </div>
  </Frame>
);

// ─── Quiz M3 ────────────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz · Module 3</Title>
    <QuizSeries y={200}>
      <QuizQ q="Quel assistant affiche systématiquement des sources numérotées issues du web ?" explain="Perplexity rédige sa réponse à partir de pages web actuelles et numérote chaque source citée.">
        <QOpt>Claude</QOpt>
        <QOpt ok>Perplexity</QOpt>
        <QOpt>Microsoft Copilot dans Excel</QOpt>
      </QuizQ>
      <QuizQ q="Copilot dans Microsoft 365 peut accéder…" explain="Copilot respecte vos droits : il voit ce que vous pouvez voir. Un partage trop large devient donc visible. D’où l’importance de bien gérer les droits.">
        <QOpt>à tous les fichiers de l’entreprise, sans exception</QOpt>
        <QOpt ok>aux fichiers et emails auxquels vous avez déjà accès</QOpt>
        <QOpt>uniquement à internet</QOpt>
      </QuizQ>
      <QuizQ q="Pour analyser un contrat de 120 pages, le meilleur réflexe est…" explain="Les assistants à large contexte comme Claude ou Gemini lisent de longs documents ; demander la page citée rend la vérification rapide.">
        <QOpt>de demander un résumé sans joindre le contrat</QOpt>
        <QOpt ok>de le joindre et demander de citer la page de chaque point</QOpt>
        <QOpt>de le coller dans un outil de traduction</QOpt>
      </QuizQ>
      <QuizQ q="Vous utilisez un compte personnel gratuit. Que pouvez-vous y coller ?" explain="Avec un compte personnel gratuit, vos échanges peuvent servir à l’entraînement ou être relus : uniquement des contenus non sensibles.">
        <QOpt>Le fichier clients pour le segmenter</QOpt>
        <QOpt>Les bulletins de salaire de l’équipe</QOpt>
        <QOpt ok>Un texte public ou un cas anonymisé</QOpt>
      </QuizQ>
      <QuizQ q="Au banc d’essai, la bonne conclusion est généralement…" explain="Chaque assistant a ses forces : on choisit l’outil selon l’étape (rechercher, analyser, rédiger) et selon l’environnement de travail.">
        <QOpt>« un seul outil est le meilleur pour tout »</QOpt>
        <QOpt ok>« tel outil pour telle étape, selon mon environnement »</QOpt>
        <QOpt>« le plus cher est toujours le meilleur »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Panorama, M3_ChatGPT, M3_Copilot, M3_Gemini, M3_Claude, M3_Perplexity, M3_Lab, M3_LabPrompts, M3_Grid, M3_Which, M3_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 3 · 11:20

OBJECTIF — Annoncer les cinq assistants généralistes (outils n° 1 à 5 du programme).

DIRE — « Place aux outils. On commence par les cinq assistants généralistes : ChatGPT, Microsoft Copilot, Google Gemini, Claude et Perplexity. Ils savent tous rédiger et résumer ; la vraie question, c’est lequel utiliser, quand. Et vous le découvrirez en les comparant vous-mêmes. »

TRANSITION — « D’abord, la carte d’identité de chacun. »`,
  `⏱ 3 min · PANORAMA

OBJECTIF — Donner une carte mentale des cinq assistants.

DIRE — « ChatGPT, le polyvalent. Copilot, l’assistant qui vit dans vos outils Microsoft. Gemini, son équivalent chez Google, très fort en recherche approfondie. Claude, excellent sur les longs documents et l’écriture. Perplexity, le spécialiste des réponses sourcées. Tous ont une version gratuite. »

INSISTER — Le meilleur assistant est souvent celui qui est déjà dans votre environnement de travail et validé par votre entreprise.

TRANSITION — « Regardons-les un par un, avec un exemple concret à chaque fois. »`,
  `⏱ 4 min · OUTIL 1 · CHATGPT (2 clics)

OBJECTIF — Rédaction, brainstorming, synthèse, analyse et assistance quotidienne.

DIRE — « ChatGPT, d’OpenAI, est le plus connu. Ses forces : rédiger, brainstormer, analyser des fichiers, et se personnaliser avec les Projets ou les GPT. Exemple : je lance une newsletter interne. » Clic 1 : « En quelques secondes, huit rubriques avec le temps de préparation. Ce n’est pas un texte final, c’est un accélérateur de réflexion. » Clic 2 : « Vigilance : en version gratuite, vos échanges peuvent servir à entraîner les modèles. Ça se désactive dans les paramètres, mais rien de confidentiel sans offre entreprise. »

ANIMATION — Démo en direct possible avec une idée du groupe.

TRANSITION — « Si vous êtes dans l’univers Microsoft, voici votre assistant. »`,
  `⏱ 4 min · OUTIL 2 · MICROSOFT COPILOT (2 clics)

OBJECTIF — L’assistance dans l’environnement Microsoft.

DIRE — « Copilot est intégré à Outlook, Word, Excel, PowerPoint et Teams. Sa force : il travaille là où sont déjà vos emails, vos fichiers et vos réunions. Exemple dans Teams, après une réunion. » Clic 1 : « Décisions, actions avec responsables, points en suspens. Le compte rendu qui prenait vingt minutes. » Clic 2 : « Deux points de vigilance : Copilot voit tout ce à quoi vous avez accès, donc un dossier partagé trop largement devient visible. Et l’intégration dans les applications demande une licence payante ; Copilot Chat, lui, est accessible avec votre compte professionnel. »

TRANSITION — « Même logique chez Google. »`,
  `⏱ 4 min · OUTIL 3 · GOOGLE GEMINI (2 clics)

OBJECTIF — Recherche, rédaction et assistance.

DIRE — « Gemini est l’assistant de Google : intégré à Gmail, Docs et Drive, très fort en recherche approfondie avec Deep Research, et capable de lire des PDF, des images ou des vidéos. Exemple : je retrouve où en est un dossier fournisseur. » Clic 1 : « Il a lu six emails et sort ce qui reste à régler. » Clic 2 : « Vigilance : compte personnel ou professionnel, ce n’est pas la même protection des données. »

ASTUCE — Le symbole @ pour cibler Gmail ou Drive.

TRANSITION — « Pour les longs documents et l’écriture : Claude. »`,
  `⏱ 4 min · OUTIL 4 · CLAUDE (2 clics)

OBJECTIF — Rédaction et analyse de contenus et documents.

DIRE — « Claude, d’Anthropic, est réputé pour deux choses : l’analyse de longs documents et la qualité de son écriture. Exemple : un appel d’offres de soixante pages. » Clic 1 : « Exigences éliminatoires, dates clés, points flous, avec la page. Le travail d’une demi-journée de lecture préparé en une minute. » Clic 2 : « Mais on vérifie chaque point à la page citée. Et pas de document client confidentiel dans un outil non validé. »

TRANSITION — « Dernier assistant, et premier outil de recherche : Perplexity. »`,
  `⏱ 4 min · OUTIL 5 · PERPLEXITY (2 clics)

OBJECTIF — Recherche d’informations et synthèse avec sources.

DIRE — « Perplexity ne répond pas de mémoire : il cherche sur le web en temps réel et cite ses sources, numérotées. Exemple : la facturation électronique. » Clic 1 : « Une réponse claire, et trois sources. Regardez-les : deux sites officiels, et un blog d’éditeur de logiciel — qui a quelque chose à vendre. » Clic 2 : « Une source citée n’est pas une source fiable. On l’ouvre, on vérifie qu’elle dit bien ce qui est affirmé, et qu’elle est à jour. »

INSISTER — On reverra Perplexity au module 4, sous l’angle de la recherche.

TRANSITION — « Maintenant, testez-les vous-mêmes. »`,
  `⏱ 20 min · ATELIER 3 · BANC D’ESSAI (minuteur)

OBJECTIF — Réaliser une même tâche avec plusieurs assistants et comparer.

DIRE — « Le cas : votre directrice veut un point rapide sur la semaine de quatre jours. Chaque binôme prend deux assistants, si possible dont Perplexity, et enchaîne les quatre mêmes prompts : rechercher, analyser, synthétiser, produire l’email. Puis vous notez avec la grille. »

ANIMATION — Répartir les outils pour couvrir les cinq assistants dans la salle. Afficher la page des prompts pendant l’atelier. Lancer le minuteur. Restitution : une minute par binôme, en commençant par « pour telle étape, on préfère tel outil parce que… ».

TRANSITION — « Les prompts à copier. »`,
  `⏱ (support de l’atelier 3) · LES 4 PROMPTS

OBJECTIF — Fournir des prompts identiques pour une comparaison équitable.

DIRE — « Quatre prompts, à enchaîner dans la même conversation pour que l’outil garde le fil. Étape 1, rechercher, avec sources datées. Étape 2, analyser en tableau. Étape 3, synthétiser en cinq points pour quelqu’un qui a deux minutes, en signalant les incertitudes. Étape 4, produire l’email avec une recommandation prudente. Les petites icônes indiquent les outils les plus adaptés à chaque étape, mais testez vos deux outils sur toutes les étapes. »

TRANSITION — « Et la grille pour noter. »`,
  `⏱ (pendant / après l’atelier 3) · GRILLE DE COMPARAISON (interactive)

OBJECTIF — Objectiver la comparaison avec des critères.

DIRE — « Cinq critères : la pertinence, la qualité des sources, la rédaction, la rapidité, la facilité. De zéro à trois étoiles. Je remplis avec vos retours. »

ANIMATION — Pendant la restitution, cliquer les cases selon les retours des binômes. Insister sur le message du bas : la bonne conclusion n’est pas un classement, c’est une répartition par étape.

TRANSITION — « Testons vos réflexes. »`,
  `⏱ 5 min · QUEL ASSISTANT POUR QUELLE SITUATION ? (cartes)

OBJECTIF — Ancrer le choix de l’outil selon la situation.

DIRE — « Six situations. Pour chacune, votez, puis je retourne la carte. » Retourner une à une. « Notez que plusieurs réponses sont souvent défendables : pour le brainstorming, tous se valent ; pour l’appel d’offres, Gemini marche aussi. Ce qui compte, c’est l’argument. »

TRANSITION — « Quiz du module 3, puis déjeuner. »`,
  `⏱ 4 min · QUIZ MODULE 3

OBJECTIF — Vérifier : sources, droits d’accès de Copilot, longs documents, données en compte personnel, choix par étape.

DIRE — « Cinq questions avant le déjeuner. »

TRANSITION — « Bon appétit ! On se retrouve à 13 h 30 pour rechercher et exploiter l’information. »`,
];
// @@NOTES-END
