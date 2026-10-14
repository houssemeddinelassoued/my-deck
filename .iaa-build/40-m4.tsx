// ─── Module 4 · Concevoir un workflow IA ────────────────────────────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Concevoir
        <br />
        un workflow IA
      </>
    }
    sub="Avant de cliquer dans un outil, on dessine : composants, entrées et sorties, règles, exceptions et validation humaine."
    dur="15:15 – 16:45 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · du papier au schéma
      </Tag>
    }
  >
    <SecItem n={1}>Les huit composants d’un workflow</SecItem>
    <SecItem n={2}>Entrées, sorties et place de l’IA</SecItem>
    <SecItem n={3}>Règles de décision et exceptions</SecItem>
    <SecItem n={4}>La validation humaine au bon endroit</SecItem>
    <SecItem n={5}>Un workflow fiable et compréhensible</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Les huit composants ────────────────────────────────────────────────────
const M4Comp = ({ kind, q, ex, d }: { kind: NodeKind; q: string; ex: string; d: number }) => {
  const nk = NK[kind];
  return (
    <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[nk.tone]}`, padding: '20px 22px 24px', ...dl(d) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconTile name={nk.icon} tone={nk.tone} size={52} solid />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy, lineHeight: 1.15 }}>{nk.label === 'Validation' ? 'Validation humaine' : nk.label === 'Étape IA' ? 'Intervention de l’IA' : nk.label === 'Données' ? 'Données d’entrée' : nk.label}</div>
      </div>
      <div style={{ marginTop: 14, fontSize: 22, fontStyle: 'italic', color: T[nk.tone].fg }}>{q}</div>
      <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
  );
};

const M4_Composants: Page = () => (
  <Frame mod={4}>
    <Title>Les huit composants d’un workflow</Title>
    <Lede>Un schéma complet répond à huit questions. Si l’une reste sans réponse, le workflow cassera là.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      <M4Comp kind="trigger" q="Qu’est-ce qui le lance ?" ex="Un email, un formulaire, un fichier déposé, une heure fixe." d={80} />
      <M4Comp kind="data" q="Avec quelles informations ?" ex="Les champs, le texte, la pièce jointe, l’historique client." d={160} />
      <M4Comp kind="step" q="Quelles opérations fixes ?" ex="Nettoyer, convertir une date, chercher dans un tableau." d={240} />
      <M4Comp kind="ai" q="Où faut-il comprendre du texte ?" ex="Classer, extraire, résumer, rédiger un brouillon." d={320} />
      <M4Comp kind="cond" q="Quels chemins possibles ?" ex="Si urgent, si montant > 5 000 €, si catégorie = SAV." d={400} />
      <M4Comp kind="action" q="Que fait-on concrètement ?" ex="Créer une ligne, envoyer un email, notifier une équipe." d={480} />
      <M4Comp kind="human" q="Où un humain valide-t-il ?" ex="Avant un envoi externe, au-dessus d’un seuil, sur échantillon." d={560} />
      <M4Comp kind="out" q="Qu’est-ce qui prouve que c’est fini ?" ex="Un statut, un document, une trace dans un journal." d={640} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(900) }}>
      <Callout title="Mêmes couleurs partout" tone="blue" icon="palette" size={23}>
        Ce code couleur est celui de tous les schémas de la formation, et celui que vous utiliserez dans l’atelier 4.
      </Callout>
    </div>
  </Frame>
);

// ─── Un workflow déroulé pas à pas ──────────────────────────────────────────
const M4Data = ({ x, beat, children }: { x: number; beat: number; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x, top: 560, width: 300, boxSizing: 'border-box' }}>
    <svg width={300} height={40} aria-hidden style={{ display: 'block' }}>
      <path d="M150 0 V 36" stroke={C.rule} strokeWidth={3} strokeDasharray="6 6" />
    </svg>
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.5, color: C.ink, background: '#F7FAFC', borderRadius: 12, padding: '12px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, whiteSpace: 'pre-wrap', minHeight: 150, boxSizing: 'border-box' }}>{children}</div>
  </div>
);

const M4_Deroule: Page = () => (
  <Frame mod={4} kind="cas" beats={5}>
    <Title>Un workflow, pas à pas : la demande via formulaire</Title>
    <Lede>Suivez la donnée (→) : à chaque étape, elle change de forme.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M270 300 H 1650" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M270 300 H 1650" dur={4} r={9} color={C.electric} />
    </svg>
    <FlowNode kind="trigger" label="Formulaire rempli" sub="site web · « demande d’info »" w={300} cls={A.in} style={{ position: 'absolute', left: 120, top: 330, ...dl(100) }} />
    <FlowNode kind="data" label="Données enregistrées" sub="nouvelle ligne du tableur" w={300} cls={A.in} style={{ position: 'absolute', left: 465, top: 330, ...dl(200) }} />
    <FlowNode kind="ai" label="L’IA analyse la demande" sub="besoin, urgence, profil" w={300} cls={A.in} style={{ position: 'absolute', left: 810, top: 330, ...dl(300) }} />
    <FlowNode kind="ai" label="Synthèse générée" sub="5 lignes pour le commercial" w={300} cls={A.in} style={{ position: 'absolute', left: 1155, top: 330, ...dl(400) }} />
    <FlowNode kind="action" label="Notification envoyée" sub="canal Teams « Ventes »" w={300} cls={A.in} style={{ position: 'absolute', left: 1500, top: 330, ...dl(500) }} />
    <M4Data x={120} beat={1}>
      {'nom: Paul Lenoir\nsociété: Orvia\nmessage: « 30 postes,\nlogiciel de paie,\navant janvier »'}
    </M4Data>
    <M4Data x={465} beat={2}>
      {'Ligne 214\nA: 12/10 09:41\nB: Paul Lenoir\nC: Orvia\nD: « 30 postes… »'}
    </M4Data>
    <M4Data x={810} beat={3}>
      {'{"besoin": "paie",\n "volume": 30,\n "echeance": "2027-01",\n "urgence": 2}'}
    </M4Data>
    <M4Data x={1155} beat={4}>
      {'Orvia · 30 postes\nBesoin : logiciel de paie\nÉchéance : janvier\nÀ rappeler sous 48 h'}
    </M4Data>
    <M4Data x={1500} beat={5}>
      {'@Ventes Nouvelle\ndemande Orvia\n(30 postes, paie)\n→ ligne 214'}
    </M4Data>
  </Frame>
);

// ─── Entrées et sorties ─────────────────────────────────────────────────────
const M4Row = ({ step, kind, inp, out, fmt, fail, d }: { step: string; kind: NodeKind; inp: string; out: string; fmt: string; fail: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 220px 1fr', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[NK[kind].tone]}`, padding: '16px 22px', ...dl(d) }}>
    <span style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{step}</span>
    <span style={{ fontSize: 21, color: C.soft }}>{inp}</span>
    <span style={{ fontSize: 21, color: C.ink, fontWeight: 600 }}>{out}</span>
    <span style={{ fontFamily: mono, fontSize: 19, color: T[NK[kind].tone].fg }}>{fmt}</span>
    <span style={{ fontSize: 20, color: T.coral.fg }}>{fail}</span>
  </div>
);

const M4_IO: Page = () => (
  <Frame mod={4}>
    <Title>Définir les entrées et les sorties de chaque étape</Title>
    <Lede>La sortie d’une étape est l’entrée de la suivante. Écrivez ce contrat avant de construire, colonne « si échec » comprise.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '300px 1fr 1fr 220px 1fr', gap: 18, padding: '0 22px', boxSizing: 'border-box', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
      <span>Étape</span>
      <span>Entrée</span>
      <span>Sortie</span>
      <span>Format</span>
      <span>Si échec</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 302, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M4Row d={100} step="Formulaire reçu" kind="trigger" inp="Envoi du formulaire" out="Champs bruts" fmt="texte" fail="Champ obligatoire vide → relance" />
      <M4Row d={200} step="Enregistrer" kind="data" inp="Champs bruts" out="Ligne du tableur" fmt="ligne n°" fail="Doublon → fusion" />
      <M4Row d={300} step="Analyser (IA)" kind="ai" inp="Message + société" out="Besoin, volume, urgence" fmt="JSON" fail="JSON invalide → relance 1 fois" />
      <M4Row d={400} step="Urgent ?" kind="cond" inp="urgence" out="Chemin A ou B" fmt="1 | 2 | 3" fail="Valeur inconnue → chemin B" />
      <M4Row d={500} step="Synthèse (IA)" kind="ai" inp="JSON d’analyse" out="Texte de 5 lignes" fmt="texte ≤ 80 mots" fail="Trop long → tronquer" />
      <M4Row d={600} step="Notifier" kind="action" inp="Synthèse + lien" out="Message posté" fmt="Teams" fail="Échec → email de secours" />
    </div>
  </Frame>
);

// ─── Où placer l’IA ? (cartes à retourner) ──────────────────────────────────
const M4Where = ({ task, ai, why }: { task: string; ai: boolean; why: string }) => (
  <FlipCard
    w={536}
    h={250}
    tone="navy"
    backTone={ai ? 'violet' : 'green'}
    flipAt={1}
    front={
      <>
        <Eyebrow c={C.muted} size={18}>
          IA ou règle ?
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 30, fontWeight: 700, lineHeight: 1.3, color: C.navy }}>{task}</div>
      </>
    }
    back={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile name={ai ? 'sparkles' : 'gear'} tone={ai ? 'violet' : 'green'} size={48} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: ai ? T.violet.fg : T.green.fg }}>{ai ? 'IA' : 'Règle'}</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.42, color: C.ink }}>{why}</div>
      </>
    }
  />
);

const M4_OuIA: Page = () => (
  <Frame mod={4} kind="exercice" beats={1}>
    <Title>Où placer l’IA ? Là où il faut comprendre du langage</Title>
    <Lede>Votez pour chaque carte, puis retournez-la. → retourne tout. Une règle est gratuite, rapide et ne se trompe pas.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M4Where task="Calculer le montant TTC d’une commande" ai={false} why="Une formule. L’IA pourrait se tromper sur un calcul simple." />
      <M4Where task="Comprendre ce que demande un client mécontent" ai why="Il faut lire entre les lignes : ton, intention, sous-entendus." />
      <M4Where task="Vérifier qu’un champ « email » est rempli" ai={false} why="Un test « est vide » suffit. Zéro coût, zéro erreur." />
      <M4Where task="Rédiger un premier jet de réponse personnalisée" ai why="Production de langage adaptée au cas : c’est le cœur de l’IA générative." />
      <M4Where task="Router vers l’agence selon le code postal" ai={false} why="Une table de correspondance code postal → agence." />
      <M4Where task="Repérer une menace de procédure dans un email" ai why="Les formulations varient à l’infini : une liste de mots-clés en raterait." />
    </div>
  </Frame>
);

// ─── Règles de décision et exceptions ───────────────────────────────────────
const M4Rule = ({ c1, c2, c3, act, tone, d }: { c1: string; c2: string; c3: string; act: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '210px 160px 190px 1fr', gap: 14, alignItems: 'center', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 20, color: C.ink }}>{c1}</span>
    <span style={{ fontFamily: mono, fontSize: 20, color: C.ink }}>{c2}</span>
    <span style={{ fontFamily: mono, fontSize: 20, color: C.ink }}>{c3}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 600, color: T[tone].fg }}>
      <Icon name="arrow" size={22} /> {act}
    </span>
  </div>
);

const M4Exc = ({ children, beat }: { children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: T.pink.bg, borderRadius: 12, padding: '14px 18px', fontSize: 22, lineHeight: 1.35, color: C.ink }}>
    <Icon name="alert" size={26} color={C.pink} />
    <span>{children}</span>
  </div>
);

const M4_Regles: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Définir les règles de décision… et prévoir les exceptions</Title>
    <Lede>Une table de décision rend les règles lisibles par tous. Les exceptions, elles, sortent du flux vers un humain.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <div className={A.fade} style={{ display: 'grid', gridTemplateColumns: '210px 160px 190px 1fr', gap: 14, padding: '0 20px 10px', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
        <span>Catégorie</span>
        <span>Urgence</span>
        <span>Montant</span>
        <span>Alors</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M4Rule d={100} c1="commercial" c2="*" c3="< 5 000 €" act="Commercial de secteur" tone="blue" />
        <M4Rule d={180} c1="commercial" c2="*" c3="≥ 5 000 €" act="Responsable grands comptes" tone="violet" />
        <M4Rule d={260} c1="sav" c2="3" c3="*" act="Alerte immédiate + SAV" tone="coral" />
        <M4Rule d={340} c1="sav" c2="1 | 2" c3="*" act="File SAV standard" tone="teal" />
        <M4Rule d={420} c1="autre" c2="*" c3="*" act="Accueil, tri manuel" tone="grey" />
      </div>
      <div className={A.fade} style={{ marginTop: 18, fontSize: 21, color: C.muted, ...dl(700) }}>
        « * » = toute valeur. Une ligne « sinon » attrape tout ce que les autres n’ont pas prévu.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.pink.fg} size={20} cls={b.fade(1)}>
        Exceptions → file humaine
      </Eyebrow>
      <M4Exc beat={1}>Pièce jointe illisible ou protégée par mot de passe</M4Exc>
      <M4Exc beat={2}>Demande dans une langue non prévue</M4Exc>
      <M4Exc beat={3}>Client signalé « sensible » dans le CRM</M4Exc>
      <M4Exc beat={4}>Même demandeur, troisième message en 24 h</M4Exc>
    </div>
  </Frame>
);

// ─── Validation humaine : trois positions + simulateur de seuil ─────────────
const M4_TH = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
const M4_HUMAN = [2, 4, 6, 9, 12, 16, 21, 28, 38, 55];
const M4_ERR = [38, 30, 24, 18, 13, 9, 6, 4, 2, 1];

const M4Pattern = ({ n, title, when, ex, d }: { n: number; title: string; when: string; ex: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${C.pink}`, padding: '18px 22px', ...dl(d) }}>
    <Num n={n} tone="pink" size={44} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, color: T.pink.fg }}>{when}</div>
      <div style={{ marginTop: 4, fontSize: 20, color: C.soft }}>{ex}</div>
    </div>
  </div>
);

const M4Meter = ({ label, value, pct, tone }: { label: string; value: string; pct: number; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 23, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>{value}</span>
    </div>
    <div style={{ marginTop: 8, height: 18, borderRadius: 9, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: STRONG[tone], transition: `width 400ms ${EASE}` }} />
    </div>
  </div>
);

const M4_Validation: Page = () => {
  const [i, setI] = useState(6);
  return (
    <Frame mod={4} kind="simu">
      <Title>Ajouter une validation humaine au bon endroit</Title>
      <Lede>Trois positions possibles. Le seuil se règle : trop bas, les erreurs passent ; trop haut, l’humain revoit tout.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Pattern n={1} d={100} title="Avant chaque action externe" when="systématique, l’IA prépare un brouillon" ex="Réponse client, publication, envoi d’un devis." />
        <M4Pattern n={2} d={200} title="Sur seuil" when="seulement les cas à risque" ex="Confiance < seuil, montant > 5 000 €, client sensible." />
        <M4Pattern n={3} d={300} title="A posteriori, par échantillon" when="le flux tourne, on contrôle après" ex="5 % des classements revus chaque vendredi." />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 262, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', ...dl(250) }}>
        <PanelTitle icon="gauge" c={C.navy}>
          Simulateur · position 2 sur 1 000 demandes
        </PanelTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 10 }}>
          <span style={{ fontSize: 23, color: C.ink, whiteSpace: 'nowrap' }}>Seuil de confiance</span>
          <Range value={i} onChange={setI} min={0} max={9} w={380} tone="pink" />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.pink }}>{fr(M4_TH[i], 2)}</span>
        </div>
        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <M4Meter label="Demandes revues par un humain" value={`${M4_HUMAN[i]} %`} pct={M4_HUMAN[i]} tone="blue" />
          <M4Meter label="Erreurs qui passent sans contrôle" value={`${M4_ERR[i]}`} pct={(M4_ERR[i] / 40) * 100} tone="coral" />
        </div>
        <div style={{ marginTop: 26, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Valeurs illustratives. Dans la vraie vie, on mesure pendant les premières semaines, puis on règle le seuil avec le métier.
        </div>
      </div>
    </Frame>
  );
};

// ─── Fiable et compréhensible ───────────────────────────────────────────────
const M4Pr = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card tone={tone} icon={icon} title={title} cls={A.in} style={dl(d)} size={22}>
    {children}
  </Card>
);

const M4_Fiable: Page = () => (
  <Frame mod={4}>
    <Title>Concevoir un workflow fiable et compréhensible</Title>
    <Lede>Dans six mois, quelqu’un devra le comprendre, le réparer ou l’arrêter. Peut-être pas vous.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M4Pr icon="pen" tone="blue" title="Nommer chaque étape" d={100}>
        « Classer l’email (IA) » plutôt que « Module 4 ». Le schéma se lit seul.
      </M4Pr>
      <M4Pr icon="target" tone="violet" title="Une étape, un rôle" d={200}>
        Une étape qui fait trois choses échoue de trois façons.
      </M4Pr>
      <M4Pr icon="note" tone="teal" title="Tout journaliser" d={300}>
        Date, entrée, sortie IA, version du prompt, décision prise, par qui.
      </M4Pr>
      <M4Pr icon="alert" tone="coral" title="Prévoir l’échec" d={400}>
        Chaque étape a un « si échec » : relance, chemin de secours, alerte.
      </M4Pr>
      <M4Pr icon="user" tone="green" title="Un propriétaire" d={500}>
        Une personne nommée, qui reçoit les alertes et valide les évolutions.
      </M4Pr>
      <M4Pr icon="doc" tone="navy" title="Une page de documentation" d={600}>
        Le schéma, les règles, les prompts, le contact. Une page, pas un roman.
      </M4Pr>
    </div>
  </Frame>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Concevoir sur papier, puis en schéma"
    defi="schema"
    who="Individuel sur votre processus, revue en binôme"
    minutes={40}
    where={
      <>
        Un <strong>schéma</strong> (papier photographié, tableau blanc, ou outil de diagramme) aux couleurs des 8 composants, plus la <strong>table de décision</strong> et la
        liste des <strong>exceptions</strong>.
      </>
    }
    objective={
      <>
        Transformer la cartographie de l’atelier 1 en <strong>workflow complet</strong> : déclencheur, données, étapes IA, conditions, actions, validation et résultat.
      </>
    }
    crit={
      <>
        <CheckItem id="a4c1" size={22}>Les 8 composants sont présents</CheckItem>
        <CheckItem id="a4c2" size={22}>Entrée / sortie écrites pour chaque étape</CheckItem>
        <CheckItem id="a4c3" size={22}>Au moins 2 exceptions vers un humain</CheckItem>
        <CheckItem id="a4c4" size={22}>Un « si échec » sur chaque étape IA</CheckItem>
      </>
    }
  >
    <div>1. Papier d’abord : dessinez le chemin principal, de gauche à droite.</div>
    <div>2. Ajoutez les conditions, puis les exceptions qui sortent du flux.</div>
    <div>3. Placez la validation humaine et justifiez sa position (1, 2 ou 3).</div>
    <div>4. Mettez au propre en schéma ; le binôme le lit sans explication orale.</div>
    <Bonus>Remplissez le tableau entrées / sorties pour chaque étape, colonne « si échec » comprise.</Bonus>
  </LabPage>
);

// ─── Atelier 4 · Exemple complet ────────────────────────────────────────────
const M4_Schema: Page = () => (
  <Frame mod={4} kind="cas" beats={3}>
    <Title>Exemple : traiter les emails entrants de bout en bout</Title>
    <Lede>Email reçu → analyse → classification → réponse → validation → envoi → archivage. Puis les chemins de côté (→).</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M334 400 H 364 M578 400 H 608 M822 400 H 852 M1066 400 H 1096 M1310 400 H 1340 M1554 400 H 1584" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
      <path className={b.draw(1)} pathLength={1} d="M715 490 V 610" stroke={C.coral} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path className={b.draw(2)} pathLength={1} d="M1203 490 C 1203 590, 959 590, 959 496" stroke={C.pink} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path className={b.draw(3)} pathLength={1} d="M1691 490 V 610" stroke={C.navy} strokeWidth={4} strokeLinecap="round" fill="none" />
    </svg>
    <FlowNode kind="trigger" label="Email reçu" sub="contact@" w={214} cls={A.in} style={{ position: 'absolute', left: 120, top: 320, ...dl(100) }} />
    <FlowNode kind="ai" label="Analyse" sub="langue, intention" w={214} cls={A.in} style={{ position: 'absolute', left: 364, top: 320, ...dl(180) }} />
    <FlowNode kind="ai" icon="filter" label="Classification" sub="6 catégories" w={214} cls={A.in} style={{ position: 'absolute', left: 608, top: 320, ...dl(260) }} />
    <FlowNode kind="ai" icon="pen" label="Réponse" sub="brouillon 80 mots" w={214} cls={A.in} style={{ position: 'absolute', left: 852, top: 320, ...dl(340) }} />
    <FlowNode kind="human" label="Validation" sub="conseiller" w={214} cls={A.in} style={{ position: 'absolute', left: 1096, top: 320, ...dl(420) }} />
    <FlowNode kind="action" label="Envoi" sub="depuis contact@" w={214} cls={A.in} style={{ position: 'absolute', left: 1340, top: 320, ...dl(500) }} />
    <FlowNode kind="out" icon="archive" label="Archivage" sub="CRM + journal" w={214} cls={A.in} style={{ position: 'absolute', left: 1584, top: 320, ...dl(580) }} />
    <div className={b.on(1)} style={{ position: 'absolute', left: 480, top: 620, width: 350 }}>
      <Callout title="Hors périmètre" tone="coral" icon="alert" size={21}>
        Réclamation juridique, presse, sujet sensible : file humaine, pas de brouillon.
      </Callout>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 870, top: 620, width: 420 }}>
      <Callout title="Refusé" tone="pink" icon="reset" size={21}>
        Le conseiller refuse : retour au brouillon avec son commentaire, qui devient un exemple.
      </Callout>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1450, top: 620, width: 350 }}>
      <Callout title="Trace" tone="navy" icon="note" size={21}>
        Qui a validé, quand, avec quelle version du prompt.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M4 ────────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <Frame mod={4} kind="quiz">
    <Title>Quiz du module 4</Title>
    <QuizSeries y={200}>
      <QuizQ q="Votre workflow doit diriger chaque demande vers l’agence du client selon son code postal. Que mettez-vous ?" explain="Une table code postal → agence est exacte, gratuite et instantanée. L’IA n’apporte rien ici, et pourrait se tromper.">
        <QOpt>Une étape IA qui devine l’agence</QOpt>
        <QOpt ok>Une règle (table de correspondance)</QOpt>
        <QOpt>Une validation humaine systématique</QOpt>
      </QuizQ>
      <QuizQ q="Où placer la validation humaine pour un brouillon de réponse envoyé à un client ?" explain="Avant l’action externe : une fois l’email parti, on ne peut plus le rattraper. La relecture après coup sert au contrôle qualité, pas à la protection du client.">
        <QOpt ok>Avant l’envoi</QOpt>
        <QOpt>Après l’envoi, en relisant la boîte d’envoi</QOpt>
        <QOpt>Inutile si le prompt est bon</QOpt>
      </QuizQ>
      <QuizQ q="Une demande arrive en allemand alors que le workflow ne gère que le français. Que doit-il se passer ?" explain="C’est une exception : le cas sort du flux vers un humain, avec une alerte. Le traiter « au mieux » risque une réponse fausse ; l’ignorer perd le client.">
        <QOpt>L’IA traduit et répond quand même</QOpt>
        <QOpt>Le workflow ignore la demande</QOpt>
        <QOpt ok>Le cas part en file humaine</QOpt>
      </QuizQ>
      <QuizQ q="Quel élément rend un workflow compréhensible par un collègue dans six mois ?" explain="Des étapes nommées, un propriétaire et une page de documentation. Le nombre d’étapes ou l’outil choisi ne changent rien à la lisibilité.">
        <QOpt>Le plus petit nombre d’étapes possible</QOpt>
        <QOpt ok>Des étapes nommées, un propriétaire, une page de doc</QOpt>
        <QOpt>Un outil d’automatisation connu</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse M4 ────────────────────────────────────────────────────────────
const M4_Synthese: Page = () => (
  <Frame mod={4} kind="synthese">
    <Title>Ce qu’on retient du module 4</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        Huit composants : <strong>déclencheur, données, traitement, IA, conditions, action, validation, résultat</strong>.
      </SynthRow>
      <SynthRow n={2} tone="teal" d={200}>
        Chaque étape a un <strong>contrat</strong> : entrée, sortie, format, « si échec ».
      </SynthRow>
      <SynthRow n={3} tone="violet" d={300}>
        L’IA là où il faut <strong>comprendre du langage</strong> ; une règle partout ailleurs.
      </SynthRow>
      <SynthRow n={4} tone="pink" d={400}>
        Validation humaine <strong>avant l’action externe</strong>, sur seuil, ou par échantillon.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        Fiable = <strong>nommé, journalisé, documenté, avec un propriétaire</strong>.
      </SynthRow>
    </div>
    <ProjectCard mod={4}>
      Votre workflow est <strong>dessiné</strong> : les 8 composants, la table de décision, les exceptions et la validation humaine. Demain, on le construit.
    </ProjectCard>
  </Frame>
);

// ─── Bilan du jour 1 ────────────────────────────────────────────────────────
const J1_Bilan: Page = () => (
  <Frame mod={4} label="Bilan du jour 1" kind="exercice">
    <Title>Bilan du jour 1 : ce que vous avez construit</Title>
    <Lede>Cochez ce qui est prêt. Ce qui ne l’est pas est à terminer avant demain matin.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="j1b1">Ma cartographie, étapes étiquetées H / Auto / IA</CheckItem>
        <CheckItem id="j1b2">Les prompts de mes étapes IA, testés sur 3 cas</CheckItem>
        <CheckItem id="j1b3">Les données extraites, leur format et leurs contrôles</CheckItem>
        <CheckItem id="j1b4">Mon schéma : 8 composants, règles, exceptions</CheckItem>
        <CheckItem id="j1b5">Un compte d’automatisation actif pour demain</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1080, top: 270, width: 720, ...dl(200) }}>
        <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
          Météo de fin de journée
        </Eyebrow>
        <Poll>
          <PollRow id="j1m1" label="Clair, et je vois comment l’appliquer" tone="green" icon="smile" />
          <PollRow id="j1m2" label="Clair, mais dense" tone="blue" icon="layers" />
          <PollRow id="j1m3" label="Il me manque des exemples de mon métier" tone="yellow" icon="search" />
          <PollRow id="j1m4" label="Je me sens un peu perdu" tone="coral" icon="alert" />
        </Poll>
      </div>
    </Checklist>
  </Frame>
);

const J1_Demain: Page = () => (
  <Frame mod={4} label="Bilan du jour 1">
    <Title>Demain : on passe du schéma au scénario qui tourne</Title>
    <Lede>Ce que vous avez dessiné aujourd’hui devient, demain, un vrai workflow dans un outil no-code.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 26 }}>
      <Card tone="green" icon="puzzle" title="No-code" cls={A.in} style={{ flex: 1, ...dl(100) }} size={22}>
        M5 · Votre premier scénario : déclencheur, IA, notification.
      </Card>
      <Card tone="yellow" icon="split" title="Logique" cls={A.in} style={{ flex: 1, ...dl(200) }} size={22}>
        M6 · Conditions, routage, exceptions, erreurs.
      </Card>
      <Card tone="pink" icon="plug" title="Connexions" cls={A.in} style={{ flex: 1, ...dl(300) }} size={22}>
        M7 · Formulaire, tableur, CRM, email, Teams.
      </Card>
      <Card tone="blue" icon="bot" title="Agents" cls={A.in} style={{ flex: 1, ...dl(400) }} size={22}>
        M8 · Assistants spécialisés et agents IA.
      </Card>
      <Card tone="coral" icon="shieldCheck" title="Garde-fous" cls={A.in} style={{ flex: 1, ...dl(500) }} size={22}>
        M9 · Données, risques, quand ne pas automatiser.
      </Card>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 620, width: 1680, ...dl(700) }}>
      <Callout title="Pour demain matin" tone="violet" icon="calendar" size={25}>
        Connectez votre outil d’automatisation à votre tableur et à votre messagerie de test, et préparez <strong>5 cas fictifs</strong> de votre processus pour tester.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 820, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: C.navy, fontWeight: 600, ...dl(1000) }}>
      <FlowMark h={30} /> Merci pour cette première journée. À demain, 9:00 !
    </div>
  </Frame>
);
J1_Demain.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Composants, M4_Deroule, M4_IO, M4_OuIA, M4_Regles, M4_Validation, M4_Fiable, M4_Atelier, M4_Schema, M4_Quiz, M4_Synthese, J1_Bilan, J1_Demain];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M4 · 15:15

OBJECTIF — Annoncer le module d’assemblage du jour 1.

DIRE — « Dernier module du jour 1. On a les briques : le niveau d’automatisation, les prompts, le traitement des documents. Il faut maintenant les assembler en un workflow complet, et le dessiner avant de le construire. Un workflow mal conçu se construit très bien… et casse en production. L’atelier 4 transforme votre cartographie en schéma complet. »

TRANSITION — « Huit composants à connaître. »`,
  `⏱ 4 min · LES HUIT COMPOSANTS

OBJECTIF — Présenter les composants d’un workflow : déclencheur, données d’entrée, traitement, IA, conditions, action, validation, résultat.

DIRE — « Huit composants, huit questions. Qu’est-ce qui le lance ? Avec quelles informations ? Quelles opérations fixes ? Où faut-il comprendre du texte ? Quels chemins possibles ? Que fait-on concrètement ? Où un humain valide-t-il ? Et qu’est-ce qui prouve que c’est fini ? La dernière question est la plus oubliée : sans résultat tracé, impossible de savoir si le workflow a fonctionné. »

INSISTER — Le code couleur est celui de tous les schémas : les participants l’utilisent dans l’atelier.

TRANSITION — « Voyons-les à l’œuvre sur l’exemple du programme. »`,
  `⏱ 4 min · DÉROULÉ PAS À PAS (5 clics)

OBJECTIF — Illustrer l’exemple du programme : formulaire → données → IA → synthèse → notification.

DIRE — « Suivons une donnée. » Clic : « Le formulaire : Paul Lenoir, société Orvia, 30 postes, logiciel de paie, avant janvier. » Clic : « Elle devient la ligne 214 du tableur. » Clic : « L’IA en tire un JSON : besoin, volume, échéance normée, urgence. » Clic : « Une deuxième étape IA rédige une synthèse de cinq lignes pour le commercial. » Clic : « La notification part dans Teams, avec le lien vers la ligne. La donnée a changé quatre fois de forme. »

TRANSITION — « Ces changements de forme, il faut les écrire noir sur blanc. »`,
  `⏱ 4 min · ENTRÉES ET SORTIES

OBJECTIF — Définir les entrées et sorties de chaque étape.

DIRE — « Le contrat de chaque étape, en cinq colonnes : entrée, sortie, format, et surtout “si échec”. C’est cette colonne qui fait la différence entre un prototype et un outil fiable. Champ vide : on relance. Doublon : on fusionne. JSON invalide : une relance. Valeur inconnue : chemin par défaut. Teams en panne : email de secours. »

ANIMATION — Demander : « Dans votre processus, quelle étape a le plus de chances d’échouer ? »

TRANSITION — « Question clé : où mettre l’IA ? »`,
  `⏱ 5 min · IA OU RÈGLE ? (cartes, 1 clic = tout retourner)

OBJECTIF — Identifier les étapes nécessitant l’IA.

DIRE — « Six tâches. Pour chacune, votez : IA ou règle ? » Retourner les cartes une à une après le vote. « Le principe : l’IA là où il faut comprendre du langage ; une règle partout ailleurs. Une règle est gratuite, instantanée et ne se trompe pas. Un réflexe utile : si vous pouvez l’écrire dans une formule Excel, ce n’est pas un travail d’IA. »

POINT DE DÉBAT — La menace de procédure : on pourrait chercher le mot « avocat », mais « je vais faire valoir mes droits » passerait au travers.

TRANSITION — « Après la place de l’IA, les règles. »`,
  `⏱ 4 min · RÈGLES ET EXCEPTIONS (4 clics)

OBJECTIF — Définir les règles de décision et prévoir les exceptions.

DIRE — « À gauche, une table de décision : catégorie, urgence, montant, et l’action correspondante. Tout le monde peut la lire, y compris le métier qui la valide. La dernière ligne attrape tout le reste. » Clics à droite : « Et les exceptions : pièce jointe illisible, langue imprévue, client sensible, demandeur qui insiste. Elles ne se traitent pas : elles sortent du flux vers un humain. »

TRANSITION — « Justement : où placer cet humain ? »`,
  `⏱ 5 min · VALIDATION HUMAINE (simulateur)

OBJECTIF — Intégrer une étape de validation humaine au bon endroit.

DIRE — « Trois positions. Un : avant chaque action externe, l’IA prépare et l’humain valide tout. Deux : sur seuil, seulement les cas à risque. Trois : a posteriori, par échantillon. » Simulateur : « Position 2 sur 1 000 demandes. À 0,80, un humain revoit 21 % des demandes et 6 erreurs passent. » Baisser à 0,60 : « 6 % revus, mais 24 erreurs passent. » Monter à 0,95 : « Plus que 1 erreur, mais 55 % revus : on a presque supprimé le gain. »

NUANCE — Valeurs illustratives : le réglage réel se fait sur mesures, avec le métier.

TRANSITION — « Dernier point de conception : la fiabilité. »`,
  `⏱ 3 min · FIABLE ET COMPRÉHENSIBLE

OBJECTIF — Concevoir un workflow fiable et compréhensible.

DIRE — « Six principes. Nommer chaque étape. Une étape, un rôle. Tout journaliser, y compris la version du prompt. Prévoir l’échec. Nommer un propriétaire. Et une page de documentation. La question à se poser : dans six mois, si je suis absent, quelqu’un peut-il comprendre, réparer ou arrêter ce workflow ? »

TRANSITION — « Atelier 4. »`,
  `⏱ 40 min · ATELIER 4 · SCHÉMA (minuteur)

OBJECTIF — Concevoir sur papier puis sous forme de schéma un workflow professionnel.

CONSIGNE À DIRE — « Reprenez votre cartographie de ce matin. Papier d’abord : le chemin principal de gauche à droite, puis les conditions, puis les exceptions, puis la validation humaine. Ensuite, mettez au propre. Test final : votre binôme doit comprendre le schéma sans que vous l’expliquiez. »

ANIMATION — Montrer l’exemple de la page suivante en début d’atelier. Passer dans les rangs : vérifier la présence des 8 composants et d’un « si échec » sur les étapes IA.

DÉBRIEF — Deux schémas projetés ou photographiés, critiqués par le groupe avec la grille des 8 composants.`,
  `⏱ 4 min · EXEMPLE DE BOUT EN BOUT (3 clics)

OBJECTIF — Illustrer l’exemple du programme : email reçu → analyse → classification → réponse → validation → envoi → archivage.

DIRE — « Le chemin principal en sept étapes : trois étapes IA, une validation humaine, deux actions. » Clic : « Les cas hors périmètre ou sensibles sortent vers une file humaine, sans brouillon. » Clic : « Si le conseiller refuse, retour au brouillon avec son commentaire ; sa correction devient un exemple pour le prompt. » Clic : « Et la trace : qui a validé, quand, avec quelle version du prompt. »

TRANSITION — « Vérifions les acquis. »`,
  `⏱ 4 min · QUIZ M4 (4 questions)

OBJECTIF — Vérifier : IA ou règle, position de la validation, exceptions, lisibilité.

DIRE — Lire, faire voter, cliquer. Insister sur la question 3 : « Traiter au mieux, c’est le pire choix : la réponse sera peut-être fausse et personne ne le saura. »

TRANSITION — « Synthèse du module 4. »`,
  `⏱ 2 min · SYNTHÈSE M4

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Huit composants ; un contrat par étape ; l’IA seulement pour le langage ; la validation avant l’action externe ; nommé, journalisé, documenté, avec un propriétaire. Côté projet : votre workflow est dessiné. Demain, on le construit. »

TRANSITION — « Faisons le bilan de la journée. »`,
  `⏱ 6 min · BILAN DU JOUR 1 (checklist + sondage)

OBJECTIF — Faire le point sur les livrables et recueillir la météo du groupe.

DIRE — « Cochez ce qui est prêt. Le schéma est le plus important pour demain : sans lui, on construirait à l’aveugle. » Puis le sondage : « Votre météo de fin de journée, main levée. »

ANIMATION — Si plusieurs personnes manquent d’exemples métier, prévoir d’en collecter au début du jour 2. Si quelqu’un se sent perdu, lui proposer un binôme renforcé demain.

TRANSITION — « Ce qui vous attend demain. »`,
  `⏱ 2 min · DEMAIN

OBJECTIF — Annoncer le jour 2 et les préparatifs.

DIRE — « Demain, on passe du schéma au scénario qui tourne : no-code, logique, connexions, agents, garde-fous, puis votre projet final. Pour demain matin : votre outil connecté à votre tableur et à votre messagerie de test, et cinq cas fictifs de votre processus pour les tests. Merci pour cette journée, à demain 9 heures. »`,
];
// @@NOTES-END
