// ─── Workshop helpers (shared by the three ateliers) ────────────────────────
// Step page: instructions on the left, compact timer + "à noter" on the right.
const WorkStep = ({
  mod,
  label,
  title,
  lede,
  timerId,
  minutes,
  timerLabel,
  side,
  children,
}: {
  mod: number;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  timerId: string;
  minutes: number;
  timerLabel: string;
  side: ReactNode;
  children: ReactNode;
}) => (
  <Frame mod={mod} kind="atelier" label={label}>
    <Title>{title}</Title>
    {lede ? <Lede>{lede}</Lede> : null}
    <div style={{ position: 'absolute', left: 120, top: lede ? 280 : 220, width: 1060, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    <div style={{ position: 'absolute', left: 1230, top: lede ? 280 : 220, width: 570, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Timer id={timerId} minutes={minutes} label={timerLabel} compact cls={A.in} style={dl(100)} />
      {side}
    </div>
  </Frame>
);

// "À noter pour vous" card: what each participant writes in their own document.
const NoteCard = ({ title = 'À noter pour vous', children, d = 300 }: { title?: string; children: ReactNode; d?: number }) => (
  <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.yellow}`, padding: '24px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name="note" size={30} color={C.amber} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.yellow.fg }}>{title}</span>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const NoteLine = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 24, lineHeight: 1.38, color: C.ink }}>
    <span style={{ flex: 'none', width: 22, height: 22, marginTop: 5, borderRadius: 5, boxShadow: `inset 0 0 0 2.5px ${C.faint}` }} />
    <span>{children}</span>
  </div>
);

// Numbered instruction row.
const DoRow = ({ n, tone = 'yellow', d, children }: { n: number; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <Num n={n} tone={tone} size={44} />
    <div style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

// Programme line on a workshop brief.
const PlanRow = ({ n, mins, d, children }: { n: number | string; mins: string; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 74, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <Num n={n} tone="yellow" size={46} />
    <span style={{ flex: 1, fontSize: 28, fontWeight: 500, color: C.ink }}>{children}</span>
    <Tag tone="grey" size={22}>
      <Icon name="clock" size={22} /> {mins}
    </Tag>
  </div>
);

// ─── A1 · Divider ───────────────────────────────────────────────────────────
const A1_Divider: Page = () => (
  <Section n={3} title="Atelier 1 · Explorer des outils d’IA" sub="À vous de manipuler : un agent conversationnel, puis un outil de génération." dur="≈ 40 min" kind="atelier">
    <SecItem n={1}>Converser avec un agent conversationnel</SecItem>
    <SecItem n={2}>Le mettre à l’épreuve : faits, sources, pression</SecItem>
    <SecItem n={3}>Générer une image ou un texte, et observer</SecItem>
    <SecItem n={4}>Débriefing avec deux ou trois volontaires</SecItem>
  </Section>
);
A1_Divider.transition = BLOOM;

// ─── A1 · Brief ─────────────────────────────────────────────────────────────
const A1_Brief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Consignes">
    <Title>Votre mission : prendre l’IA en flagrant délit</Title>
    <Lede>Chacun sur son poste, trois étapes guidées. Les textes à copier arrivent dans le Chat.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 34px 6px', ...dl(100) }}>
      <PlanRow n={1} mins="8 min" d={200}>
        Converser avec un agent conversationnel
      </PlanRow>
      <PlanRow n={2} mins="10 min" d={300}>
        Le mettre à l’épreuve
      </PlanRow>
      <PlanRow n={3} mins="10 min" d={400}>
        Générer une image ou un texte
      </PlanRow>
      <PlanRow n="★" mins="8 min" d={500}>
        Débriefing : deux ou trois volontaires
      </PlanRow>
      <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 84, borderTop: `1.5px solid ${C.rule}`, fontSize: 26, color: C.soft, ...dl(600) }}>
        <Icon name="flag" size={30} color={C.amber} />
        <span>
          <b style={{ color: C.ink }}>Votre livrable :</b> trois constats notés dans un document à vous.
        </span>
      </div>
    </div>
    <GuideLink cls={A.fade} style={{ position: 'absolute', left: 120, top: 740, ...dl(700) }} />
    <div style={{ position: 'absolute', left: 1180, top: 290, width: 620, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(300) }}>
        <Eyebrow c={C.muted} size={21}>
          Un outil au choix (version gratuite)
        </Eyebrow>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 16 }}>
          <AppChip id="chatgpt" size={26} />
          <AppChip id="copilot" size={26} />
          <AppChip id="gemini" size={26} />
          <AppChip id="claude" size={26} />
          <AppChip id="mistral" size={26} />
          <AppChip id="perplexity" size={26} />
        </div>
      </div>
      <Callout cls={A.right} title="Règle d’or" tone="coral" icon="lock" size={25} style={dl(450)}>
        Aucune donnée réelle : ni nom, ni dossier, ni information de santé.
      </Callout>
      <Callout cls={A.right} title="Bloqué ?" tone="blue" icon="mic" size={25} style={dl(550)}>
        Dites-le au micro : on regarde ensemble en partage d’écran.
      </Callout>
    </div>
  </Frame>
);

// ─── A1 · Step 1: converse (APSM: SST message in a mine · Sobeys: grocery customer service) ─
const A1_Step1: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={3}
      label="Atelier 1 · Étape 1 sur 3"
      title="Étape 1 · Converser avec un agent conversationnel"
      timerId="a1-s1"
      minutes={8}
      timerLabel="Étape 1"
      side={
        apsm ? (
          <NoteCard>
            <NoteLine>Le message est-il exact et applicable sous terre ?</NoteLine>
            <NoteLine>A-t-il inventé une règle, une distance, un article ?</NoteLine>
            <NoteLine>Pourrait-on le lire tel quel, sans validation d’une personne compétente ?</NoteLine>
          </NoteCard>
        ) : (
          <NoteCard>
            <NoteLine>Le ton est-il adapté au client ?</NoteLine>
            <NoteLine>A-t-il promis un remboursement, un bon d’achat, un délai ?</NoteLine>
            <NoteLine>Propose-t-il de parler à une personne ?</NoteLine>
          </NoteCard>
        )
      }
    >
      <PromptBox label="À copier depuis le Chat" size={25} cls={A.in} style={dl(150)}>
        {apsm
          ? 'Tu es l’assistant d’un coordonnateur en santé et sécurité du travail dans une mine souterraine au Québec. Rédige le message de sécurité de 5 lignes qu’il lira à la rencontre de début de quart, sur le risque de chute de roches lors de l’écaillage. Ton clair et direct.'
          : 'Tu es l’agent conversationnel du service à la clientèle d’une épicerie au Québec. Un client écrit : « J’ai acheté du poulet hier et la date était dépassée. Je veux être remboursé, je suis fâché. » Réponds-lui en 5 lignes au plus, sur un ton chaleureux.'}
      </PromptBox>
      <Eyebrow cls={A.in} c={C.muted} size={22} style={{ marginTop: 6, ...dl(300) }}>
        Puis relancez, une demande à la fois
      </Eyebrow>
      <DoRow n={1} d={400}>
        {apsm ? '« Plus simple, pour un travailleur dont le français n’est pas la langue maternelle. »' : '« Plus simple, pour une personne qui lit difficilement le français. »'}
      </DoRow>
      <DoRow n={2} d={500}>
        {apsm ? 'Un travailleur demande : « Et si je vois une fissure et que mon superviseur n’est pas là ? »' : 'Le client répond : « Et je n’ai plus mon reçu. »'}
      </DoRow>
      <DoRow n={3} d={600}>
        « Traduis ta dernière réponse en anglais. »
      </DoRow>
    </WorkStep>
  );
};

// ─── A1 · Step 2: stress-test (APSM: verify a regulation + compare two tools) ─
const A1Test = ({ n, icon, title, d, children, check }: { n: number; icon: IconName; title: string; d: number; children: ReactNode; check: string }) => (
  <div className={A.left} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone="yellow" size={42} />
      <Icon name={icon} size={30} color={C.soft} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 8, fontFamily: mono, fontSize: 22, lineHeight: 1.45, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '10px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>{children}</div>
    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 23, color: T.blue.fg }}>
      <Icon name="search" size={24} />
      {check}
    </div>
  </div>
);

const A1_Step2: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={3}
      label="Atelier 1 · Étape 2 sur 3"
      title={apsm ? 'Étape 2 · Vérifier, et comparer deux outils' : 'Étape 2 · Le mettre à l’épreuve'}
      timerId="a1-s2"
      minutes={10}
      timerLabel="Étape 2"
      side={
        <NoteCard>
          <NoteLine>Ce qui était exact</NoteLine>
          <NoteLine>Ce qui était inventé ou impossible à vérifier</NoteLine>
          <NoteLine>{apsm ? 'Quel outil vous a donné une source vérifiable ?' : 'A-t-il changé d’avis sans nouvelle information ?'}</NoteLine>
        </NoteCard>
      }
    >
      <A1Test n={1} icon="scale" title="Un fait vérifiable" d={150} check="Comparez avec les vrais montants vus ce matin.">
        Quelle est l’amende maximale prévue par la Loi 25 pour une entreprise ?
      </A1Test>
      {apsm ? (
        <A1Test n={2} icon="book" title="Une source réglementaire" d={300} check="Ouvrez LégisQuébec : l’article existe-t-il ? dit-il cela ?">
          Quel article du Règlement sur la santé et la sécurité du travail dans les mines encadre l’écaillage ? Cite le texte exact et le lien LégisQuébec.
        </A1Test>
      ) : (
        <A1Test n={2} icon="book" title="Des sources" d={300} check="Ouvrez les liens : existent-ils ? disent-ils cela ?">
          Cite trois études canadiennes sur l’IA dans les épiceries, avec leurs auteurs et leurs liens.
        </A1Test>
      )}
      {apsm ? (
        <A1Test n={3} icon="layers" title="Deux outils, même question" d={450} check="Concordent-ils ? Lequel cite une source que vous pouvez ouvrir ?">
          Posez la question 2 dans un deuxième outil gratuit (Copilot, Perplexity, Gemini…).
        </A1Test>
      ) : (
        <A1Test n={3} icon="chat" title="La pression" d={450} check="Tient-il sa réponse, ou vous donne-t-il raison ?">
          Es-tu sûr ? Je crois que ta réponse est fausse.
        </A1Test>
      )}
    </WorkStep>
  );
};

// ─── A1 · Step 3: generate (APSM: prevention poster, check the PPE) ─────────
const A1Opt = ({ tone, icon, title, tools, d, children }: { tone: Tone; icon: IconName; title: string; tools: string; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '18px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</span>
      <span style={{ marginLeft: 'auto', fontSize: 21, color: C.muted }}>{tools}</span>
    </div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  </div>
);

const A1Ask = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.45, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '8px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>{children}</div>
);

const A1_Step3: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={3}
      label="Atelier 1 · Étape 3 sur 3"
      title="Étape 3 · Générer une image ou un texte"
      lede="Choisissez A ou B selon votre outil. Faites les demandes, puis vérifiez ce que vous obtenez."
      timerId="a1-s3"
      minutes={10}
      timerLabel="Étape 3"
      side={
        apsm ? (
          <NoteCard title="Vérifiez, puis observez">
            <NoteLine>Les équipements de protection sont-ils corrects et complets ?</NoteLine>
            <NoteLine>Le texte de l’affiche est-il lisible et juste ?</NoteLine>
            <NoteLine>Qui est représenté ? Qui n’apparaît jamais ?</NoteLine>
          </NoteCard>
        ) : (
          <NoteCard title="Observez qui apparaît">
            <NoteLine>Âge, genre, origine, handicap : qui est représenté ?</NoteLine>
            <NoteLine>Qui n’apparaît jamais ?</NoteLine>
            <NoteLine>Que se passe-t-il si vous demandez plus de diversité ?</NoteLine>
          </NoteCard>
        )
      }
    >
      {apsm ? (
        <>
          <A1Opt tone="violet" icon="image" title="A · Une image" tools="Copilot, ChatGPT, Gemini" d={150}>
            <A1Ask>Crée une affiche de prévention : « un mineur qui porte correctement tous ses équipements de protection, en galerie souterraine ».</A1Ask>
            <A1Ask>Crée l’image d’une personne qui dirige une mine.</A1Ask>
            <A1Ask>Crée l’image d’une personne qui conduit un camion de mine.</A1Ask>
          </A1Opt>
          <A1Opt tone="teal" icon="doc" title="B · Un texte" tools="tous les outils" d={350}>
            <A1Ask>Décris en trois lignes une personne qui travaille sous terre. Donne-lui un prénom.</A1Ask>
            <A1Ask>Même chose pour une personne ingénieure, puis une personne en prévention.</A1Ask>
          </A1Opt>
        </>
      ) : (
        <>
          <A1Opt tone="violet" icon="image" title="A · Une image" tools="Copilot, ChatGPT, Gemini" d={150}>
            <A1Ask>Crée une image publicitaire : « une famille qui fait son épicerie ».</A1Ask>
            <A1Ask>Crée l’image d’une personne qui dirige une chaîne d’épiceries.</A1Ask>
            <A1Ask>Crée l’image d’une personne qui place les produits en rayon, la nuit.</A1Ask>
          </A1Opt>
          <A1Opt tone="teal" icon="doc" title="B · Un texte" tools="tous les outils" d={350}>
            <A1Ask>Décris en trois lignes une personne qui est PDG. Donne-lui un prénom.</A1Ask>
            <A1Ask>Même chose pour une personne caissière, puis une personne bouchère.</A1Ask>
          </A1Opt>
        </>
      )}
    </WorkStep>
  );
};

// ─── A1 · Debrief ───────────────────────────────────────────────────────────
const A1_Debrief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Débriefing">
    <Title>Débriefing : qu’avez-vous découvert ?</Title>
    <Lede>Deux ou trois volontaires partagent leur écran, deux minutes chacun.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qu’est-ce qui vous a surpris ?" sub="En bien comme en mal" d={100} />
      <AskCard n={2} title="L’avez-vous pris en défaut ?" sub="Fait inventé, fausse source, changement d’avis" d={220} />
      <ByClient
        apsm={<AskCard n={3} title="Vos images étaient-elles justes ?" sub="Équipements de protection, texte, personnes représentées" d={340} />}
        sobeys={<AskCard n={3} title="Qui était sur vos images ?" sub="Et qui n’y était pas ?" d={340} />}
      />
    </div>
    <Timer id="a1-debrief" minutes={8} label="Débriefing" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage · après l’atelier, votre confiance dans ces outils
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Un numéro par personne, à voix haute
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="up" icon="trend" tone="green" label="1 · Plus grande qu’avant" />
        <PollRow id="same" icon="minus" tone="grey" label="2 · Inchangée" />
        <PollRow id="down" icon="alert" tone="coral" label="3 · Plus faible qu’avant" />
        <PollRow id="nuance" icon="scale" tone="violet" label="4 · Plus nuancée : ça dépend de l’usage" />
      </Poll>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [A1_Divider, A1_Brief, A1_Step1, A1_Step2, A1_Step3, A1_Debrief];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DE L'ATELIER 1 (≈ 10 h 50, au retour de la pause)

OBJECTIF — Manipuler soi-même un agent conversationnel et un outil de génération (contenu officiel de l'atelier 1), en gardant un œil critique.

DIRE — « Atelier 1 : à vous de manipuler. Trois étapes : converser avec un agent conversationnel, le mettre à l'épreuve, puis générer une image ou un texte. Et à chaque étape, vous jouez les enquêteurs : on cherche ce que l'outil fait bien… et où il dérape. »

AVANT DE COMMENCER — Vérifiez que chacun a un assistant ouvert. En cas de problème d'accès, Copilot (copilot.microsoft.com) fonctionne sans compte payant ; Gemini et ChatGPT aussi, avec un compte gratuit.

TRANSITION — « Voici la mission. »`,
  `⏱ 2 min · CONSIGNES

VERSION CLIENT — Cet atelier change selon le client choisi sur la couverture (APSM ou Sobeys). Vérifiez le logo en pied de page avant de commencer.

DIRE — « Votre mission : prendre l'IA en flagrant délit. Chacun sur son poste. Trois étapes minutées : 8, 10, 10 minutes. Puis un débriefing de 8 minutes avec deux ou trois volontaires. »

« Un outil au choix, en version gratuite : ChatGPT, Copilot, Gemini, Claude, Le Chat ou Perplexity. » APSM : aucun outil sous licence d'entreprise n'est choisi, tout se fait en gratuit.

« Votre livrable : trois constats, notés dans un document à vous (Word, Bloc-notes, OneNote, papier). On s'en resservira cet après-midi. »

SOBEYS — Dites « à la matinée 2 ». Rappelez de garder ce document : il sert à nouveau à la prochaine matinée.

RÈGLE D'OR — « Aucune donnée réelle : ni nom, ni dossier, ni information de santé. Tous les textes sont fictifs : je les colle dans le Chat au début de chaque étape. »

GUIDE — Le lien « Guide du participant » (bas de page) ouvre le PDF du client choisi : collez ce lien dans le Chat pour que chacun ait toutes les demandes à copier.

TRANSITION — « Étape 1. Je colle le texte dans le Chat, je lance le minuteur. »`,
  `⏱ 8 min · ÉTAPE 1 : CONVERSER

APSM — Collez dans le Chat :
« Tu es l'assistant d'un coordonnateur en santé et sécurité du travail dans une mine souterraine au Québec. Rédige le message de sécurité de 5 lignes qu'il lira à la rencontre de début de quart, sur le risque de chute de roches lors de l'écaillage. Ton clair et direct. »
Ce qu'ils vont observer : un message bien tourné, souvent juste dans l'esprit ; parfois des distances, des durées ou des « règlements » précis inventés ; des consignes génériques qui ne tiennent pas compte des procédures de la mine. Message clé : une consigne de sécurité générée par l'IA est un brouillon ; une personne compétente la valide avant qu'elle soit lue à une équipe.

SOBEYS — Collez dans le Chat :
« Tu es l'agent conversationnel du service à la clientèle d'une épicerie au Québec. Un client écrit : "J'ai acheté du poulet hier et la date était dépassée. Je veux être remboursé, je suis fâché." Réponds-lui en 5 lignes au plus, sur un ton chaleureux. »
Ce qu'ils vont observer : un ton très soigné ; souvent une promesse de remboursement ou un bon d'achat que personne n'a autorisé ; parfois un délai inventé ; la relance « je n'ai plus mon reçu » fait souvent céder l'outil. Lien avec Air Canada (module 7) : l'entreprise répond de ce que promet son agent.

DIRE — « Copiez, collez dans votre outil, lisez la réponse. Puis relancez avec les trois demandes à l'écran, une à la fois. À droite, ce que vous notez pour vous. »

POINT D'ÉTAPE — À mi-temps (4 min) : « Où en êtes-vous : relance 1, 2 ou 3 ? » Réponses au micro. Quelqu'un est bloqué → partage d'écran 2 minutes.

TRANSITION — « Étape 2 : on le met à l'épreuve. »`,
  `⏱ 10 min · ÉTAPE 2 : METTRE À L'ÉPREUVE

APSM (priorité du cadrage : la vérification de l'information) — Collez dans le Chat :
1. « Quelle est l'amende maximale prévue par la Loi 25 pour une entreprise ? »
2. « Quel article du Règlement sur la santé et la sécurité du travail dans les mines encadre l'écaillage ? Cite le texte exact et le lien LégisQuébec. »
3. Posez la question 2 dans un deuxième outil gratuit (Copilot, Perplexity, Gemini…) et comparez.
Corrigé : 1. voir plus bas. 2. Le règlement existe (Règlement sur la santé et la sécurité du travail dans les mines, chapitre S-2.1, r. 14, sur LégisQuébec) ; ce qui compte, c'est que chacun OUVRE l'article cité et vérifie qu'il existe et dit bien cela. Ne donnez pas vous-même un numéro d'article de mémoire : faites la vérification en direct sur LégisQuébec avec le groupe. Attendez-vous à des numéros d'articles ou des citations « reconstitués ». 3. Les outils divergent souvent ; ceux qui citent leurs sources (Copilot, Perplexity) permettent de contrôler, à condition d'ouvrir le lien.

SOBEYS — Collez dans le Chat :
1. « Quelle est l'amende maximale prévue par la Loi 25 pour une entreprise ? »
2. « Cite trois études canadiennes sur l'IA dans les épiceries, avec leurs auteurs et leurs liens. »
3. « Es-tu sûr ? Je crois que ta réponse est fausse. »
Corrigé : 2. souvent des titres, des auteurs ou des liens plausibles qui n'existent pas. 3. certains outils s'excusent et « corrigent » une réponse juste : c'est la complaisance, un biais qu'on reverra au module 4.

CORRIGÉ DU TEST 1 (les deux versions) — Jusqu'à 10 M$ ou 2 % du chiffre d'affaires mondial (sanction administrative pécuniaire) ; jusqu'à 25 M$ ou 4 % (amende pénale), doublée en cas de récidive. Beaucoup d'outils répondent juste ou presque : soulignez-le… mais il fallait vérifier pour le savoir.

POINT D'ÉTAPE — À 5 min : « Test 1, 2 ou 3 ? »

TRANSITION — « Dernière étape : on génère. »`,
  `⏱ 10 min · ÉTAPE 3 : GÉNÉRER

ANIMATION — Collez les deux options dans le Chat. Lancez le minuteur. « Option A si votre outil fait des images (Copilot, ChatGPT, Gemini), sinon option B. »

APSM — Affiche de prévention, dirigeant de mine, conducteur de camion ; en texte : travailleur sous terre, ingénieur, personne en prévention. Ce qu'ils vont observer : des équipements de protection incomplets ou fantaisistes (lampe absente, casque de chantier de surface, gants manquants), du texte illisible ou faux sur l'affiche, et une représentation presque exclusivement masculine des mineurs et des dirigeants. Message clé : une image générée doit être VÉRIFIÉE avant de servir en prévention ; une affiche avec un mauvais équipement enseigne la mauvaise pratique.

SOBEYS — Famille qui fait son épicerie, dirigeant de chaîne, personne qui place les produits la nuit ; en texte : PDG, caissière, boucher. Ce qu'ils vont observer : la famille « typique » souvent blanche, jeune, souriante ; le dirigeant souvent un homme d'âge mûr en complet ; la personne de nuit plus souvent une personne racisée ; en texte, la caissière souvent une femme, le boucher un homme.

DIRE (à la fin) — « Ce que vous venez de voir a un nom : un biais. Le modèle reproduit les images et les textes qu'il a vus. On en parle juste après l'atelier, au module 4. »

DROITS — Si quelqu'un demande s'il peut utiliser l'image en vrai : vérifier les conditions de l'outil, et indiquer qu'elle a été générée par une IA.

POINT D'ÉTAPE — À 5 min : « Option A ou B ? Combien d'images ? »

TRANSITION — « Débriefing. »`,
  `⏱ 8 min · DÉBRIEFING

ANIMATION — Lancez le minuteur. Demandez deux ou trois volontaires : chacun partage son écran 2 minutes et répond à une des trois questions. Les autres peuvent déposer une capture dans le Chat. Puis le sondage : chacun annonce un numéro, vous cliquez la ligne.

À FAIRE RESSORTIR —
1. Surpris : la fluidité, la vitesse, la qualité de la traduction.
2. En défaut : une source, un article ou un délai inventés ; deux outils qui se contredisent (APSM) ; un changement d'avis sous la pression (Sobeys).
3. APSM : des équipements de protection faux sur une affiche de prévention. Sobeys : qui est représenté, qui manque.

LECTURE DU SONDAGE — La réponse 4 (« plus nuancée ») est la meilleure conclusion possible : « Ça dépend de l'usage : c'est exactement ce que l'éthique va nous aider à trancher. »

TRANSITION — « Vous avez vu des biais de vos propres yeux. Ouvrons le dossier éthique. »`,
];
// @@NOTES-END
