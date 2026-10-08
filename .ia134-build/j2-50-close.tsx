// ─── Clôture J2 · Feuille de route 90 jours ─────────────────────────────────
const Cl2Phase = ({
  n,
  tone,
  days,
  verb,
  gate,
  children,
}: {
  n: number;
  tone: Tone;
  days: string;
  verb: string;
  gate: ReactNode;
  children: ReactNode;
}) => (
  <div className={b.on(n)} style={{ flex: 1, display: 'flex' }}>
    <div
      style={{
        flex: 1,
        boxSizing: 'border-box',
        padding: '28px 28px 26px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Num n={n} tone={tone} size={46} />
        <Tag tone={tone} size={22}>
          {days}
        </Tag>
      </div>
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 42, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>
        {verb}
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: T[tone].bg, borderRadius: 12 }}>
          <Icon name="flag" size={30} color={T[tone].fg} />
          <span style={{ fontSize: 24, lineHeight: 1.3, color: C.ink }}>
            <b style={{ color: T[tone].fg }}>Jalon · </b>
            {gate}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const Cl2Dot = ({ x, tone, n }: { x: number; tone: Tone; n: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 14, top: 34, width: 28, height: 28, ...dl(650) }}>
    <div style={{ width: 28, height: 28, borderRadius: 999, background: '#fff', boxShadow: `0 0 0 6px ${STRONG[tone]}` }} />
  </div>
);

const Cl2Mark = ({ x, n, align, children }: { x: number; n: number; align: 'center' | 'right'; children: ReactNode }) => (
  <div
    className={b.fade(n)}
    style={{
      position: 'absolute',
      left: align === 'center' ? x - 120 : x - 240,
      top: 0,
      width: 240,
      textAlign: align,
      fontFamily: mono,
      fontSize: 22,
      fontWeight: 700,
      color: C.ink,
      ...dl(650),
    }}
  >
    {children}
  </div>
);

const Cl2_Roadmap: Page = () => (
  <Frame mod={0} beats={3} label="Clôture · Passer à l’action">
    <Title>Votre feuille de route sur 90 jours</Title>
    <Lede>Trois phases de 30 jours, chacune fermée par une décision explicite.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 268, width: 1680, height: 70 }}>
      <div className={A.fade} style={{ position: 'absolute', left: 0, top: 0, fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.blue }}>
        Aujourd’hui
      </div>
      <div style={{ position: 'absolute', left: 0, top: 44, width: 1680, height: 8, borderRadius: 4, background: C.rule }} />
      <div className={b.grow(1)} style={{ position: 'absolute', left: 0, top: 44, width: 554, height: 8, borderRadius: 4, background: C.blue }} />
      <div className={b.grow(2)} style={{ position: 'absolute', left: 554, top: 44, width: 572, height: 8, borderRadius: 4, background: C.teal }} />
      <div className={b.grow(3)} style={{ position: 'absolute', left: 1126, top: 44, width: 554, height: 8, borderRadius: 4, background: C.green }} />
      <div className={A.pulse} style={{ position: 'absolute', left: -14, top: 34, width: 28, height: 28, borderRadius: 999, background: C.blue }} />
      <div style={{ position: 'absolute', left: -14, top: 34, width: 28, height: 28, borderRadius: 999, background: C.blue, boxShadow: '0 0 0 6px #fff' }} />
      <Cl2Dot x={554} tone="blue" n={1} />
      <Cl2Dot x={1126} tone="teal" n={2} />
      <Cl2Dot x={1680} tone="green" n={3} />
      <Cl2Mark x={554} n={1} align="center">
        Jour 30
      </Cl2Mark>
      <Cl2Mark x={1126} n={2} align="center">
        Jour 60
      </Cl2Mark>
      <Cl2Mark x={1680} n={3} align="right">
        Jour 90
      </Cl2Mark>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 372, width: 1680, display: 'flex', gap: 36 }}>
      <Cl2Phase n={1} tone="blue" days="Jours 0 à 30" verb="CADRER" gate="charte approuvée, données prêtes">
        <Bullet size={28} tone="blue">
          Choisir un quick win dans votre matrice (ex. FAQ RH, accès TI)
        </Bullet>
        <Bullet size={28} tone="blue">
          Rédiger la charte d’agent : objectifs, limites, KPI
        </Bullet>
        <Bullet size={28} tone="blue">
          Installer la gouvernance : parrain métier, EFVP, règles d’usage
        </Bullet>
      </Cl2Phase>
      <Cl2Phase n={2} tone="teal" days="Jours 31 à 60" verb="PROTOTYPER ET PILOTER" gate="go/no-go sur des critères écrits">
        <Bullet size={28} tone="teal">
          Prototype testé sur un jeu de cas de référence
        </Bullet>
        <Bullet size={28} tone="teal">
          Pilote avec un petit groupe, humain dans la boucle
        </Bullet>
        <Bullet size={28} tone="teal">
          Recueillir la rétroaction et ajuster chaque semaine
        </Bullet>
      </Cl2Phase>
      <Cl2Phase n={3} tone="green" days="Jours 61 à 90" verb="MESURER ET DÉCIDER" gate="bilan présenté à la direction">
        <Bullet size={28} tone="green">
          Mesurer qualité, efficacité, adoption et coûts
        </Bullet>
        <Bullet size={28} tone="green">
          Décider : déployer, ajuster… ou arrêter
        </Bullet>
        <Bullet size={28} tone="green">
          Lancer le cadrage du 2ᵉ cas d’usage
        </Bullet>
      </Cl2Phase>
    </div>
  </Frame>
);

// ─── Synthèse des 2 jours ───────────────────────────────────────────────────
const Cl2Row = ({ n, tone, d, children }: { n: number; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <Num n={pad(n)} tone={tone} size={44} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{MOD_TITLES[n]}</div>
      <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const Cl2DayPanel = ({ day, verb, tone, children }: { day: number; verb: string; tone: Tone; children: ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      height: '100%',
      padding: '26px 32px 30px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: T[tone].fg }}>Jour {day}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, letterSpacing: '0.08em', color: C.muted }}>{verb}</span>
    </div>
    {children}
  </div>
);

const Cl2_Synth: Page = () => (
  <Frame mod={0} kind="synthese" beats={2} label="Clôture · Synthèse">
    <Title>Deux jours, dix modules, une démarche</Title>
    <Lede>Comprendre ce qu’est un agent, puis construire la feuille de route qui le met au travail.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 276, width: 620, height: 548 }}>
      <Cl2DayPanel day={1} verb="COMPRENDRE" tone="blue">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <Cl2Row n={1} tone="blue" d={200}>
            Percevoir, raisonner, agir, observer : en boucle
          </Cl2Row>
          <Cl2Row n={2} tone="yellow" d={300}>
            Partir d’un irritant réel, pas de la technologie
          </Cl2Row>
          <Cl2Row n={3} tone="blue" d={400}>
            Choisir le type d’agent le plus simple qui marche
          </Cl2Row>
          <Cl2Row n={4} tone="teal" d={500}>
            L’entreprise répond de ce que dit son agent
          </Cl2Row>
        </div>
      </Cl2DayPanel>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 776, top: 276, width: 1024, height: 548 }}>
      <Cl2DayPanel day={2} verb="CONSTRUIRE" tone="green">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 34, rowGap: 56 }}>
          <Cl2Row n={5} tone="green" d={0}>
            Un quick win d’abord, choisi à la matrice
          </Cl2Row>
          <Cl2Row n={8} tone="yellow" d={0}>
            Lire → extraire → décider → agir
          </Cl2Row>
          <Cl2Row n={6} tone="green" d={0}>
            Fait, ne fait pas, escalade · Loi 25
          </Cl2Row>
          <Cl2Row n={9} tone="green" d={0}>
            Pilote encadré, puis go/no-go écrit
          </Cl2Row>
          <Cl2Row n={7} tone="green" d={0}>
            Peu d’outils, des droits minimaux
          </Cl2Row>
          <Cl2Row n={10} tone="green" d={0}>
            4 familles de KPI, suivies en continu
          </Cl2Row>
        </div>
      </Cl2DayPanel>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 852, width: 1680 }}>
      <div
        style={{
          boxSizing: 'border-box',
          height: 110,
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          padding: '0 40px',
          background: C.card,
          borderRadius: 'var(--osd-radius)',
          boxShadow: SHADOW,
        }}
      >
        <MiniSquares size={46} />
        <Eyebrow c={C.muted} size={22}>
          En une phrase
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: C.ink }}>
          Commencer petit, <span style={{ color: C.blue }}>encadrer</span> fort, <span style={{ color: C.green }}>mesurer</span> toujours.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Ressources ─────────────────────────────────────────────────────────────
const Cl2Res = ({ icon, tone, cat, d, children }: { icon: IconName; tone: Tone; cat: string; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      boxSizing: 'border-box',
      height: 326,
      padding: '26px 28px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      ...dl(d),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <Eyebrow c={T[tone].fg} size={24}>
        {cat}
      </Eyebrow>
    </div>
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
  </div>
);

const Cl2Ref = ({ name, src }: { name: ReactNode; src: string }) => (
  <div>
    <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{name}</div>
    <div style={{ marginTop: 4, fontFamily: mono, fontSize: 20, color: C.muted }}>{src}</div>
  </div>
);

const Cl2Chips = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{children}</div>;

const Cl2_Resources: Page = () => (
  <Frame mod={0} label="Clôture · Pour aller plus loin">
    <Title>Ressources pour continuer</Title>
    <Lede>Une sélection courte, en accès libre, pour chaque étape de votre feuille de route.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
      <Cl2Res icon="bulb" tone="blue" cat="Comprendre et concevoir" d={100}>
        <Cl2Ref name="« Building effective agents »" src="Anthropic · déc. 2024" />
        <Cl2Ref name="AI Agents Course (gratuit)" src="Hugging Face · huggingface.co/learn" />
      </Cl2Res>
      <Cl2Res icon="plug" tone="teal" cat="Standards ouverts" d={200}>
        <Cl2Ref name="Model Context Protocol (MCP)" src="modelcontextprotocol.io" />
        <Cl2Ref name="Agent2Agent (A2A)" src="a2a-protocol.org" />
      </Cl2Res>
      <Cl2Res icon="shield" tone="coral" cat="Sécurité" d={300}>
        <Cl2Ref name="OWASP Top 10 pour les applications LLM 2025" src="genai.owasp.org" />
        <Cl2Ref name="Injection de prompt, agentivité excessive" src="LLM01 · LLM06" />
      </Cl2Res>
      <Cl2Res icon="scale" tone="violet" cat="Conformité au Québec" d={400}>
        <Cl2Ref name="Commission d’accès à l’information" src="cai.gouv.qc.ca" />
        <Cl2Ref name="Loi 25 : guide sur l’EFVP" src="CAI · section Loi 25" />
      </Cl2Res>
      <Cl2Res icon="code" tone="green" cat="Construire" d={500}>
        <Cl2Chips>
          <Tag tone="green" size={22}>LangGraph</Tag>
          <Tag tone="green" size={22}>CrewAI</Tag>
          <Tag tone="green" size={22}>Microsoft Agent Framework</Tag>
          <Tag tone="green" size={22}>OpenAI Agents SDK</Tag>
          <Tag tone="green" size={22}>Claude Agent SDK</Tag>
          <Tag tone="green" size={22}>Google ADK</Tag>
          <Tag tone="green" size={22}>Copilot Studio</Tag>
          <Tag tone="green" size={22}>n8n</Tag>
        </Cl2Chips>
      </Cl2Res>
      <Cl2Res icon="gauge" tone="yellow" cat="Évaluer et surveiller" d={600}>
        <Cl2Chips>
          <Tag tone="yellow" size={22}>RAGAS</Tag>
          <Tag tone="yellow" size={22}>DeepEval</Tag>
          <Tag tone="yellow" size={22}>promptfoo</Tag>
          <Tag tone="yellow" size={22}>LangSmith</Tag>
          <Tag tone="yellow" size={22}>Langfuse</Tag>
          <Tag tone="yellow" size={22}>Arize Phoenix</Tag>
          <Tag tone="yellow" size={22}>OpenTelemetry GenAI</Tag>
        </Cl2Chips>
      </Cl2Res>
    </div>
  </Frame>
);

// ─── Merci ! ────────────────────────────────────────────────────────────────
const Cl2Ask = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      flex: 1,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 22,
      padding: '26px 28px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      ...dl(d),
    }}
  >
    <IconTile name={icon} tone={tone} size={68} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const Cl2_Thanks: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 70, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1180 }}>
      <Eyebrow cls={A.in} size={28}>
        Fin de la formation IA134
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '12px 0 0', fontFamily: display, fontWeight: 700, fontSize: 140, lineHeight: 1.12, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '18px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Vous repartez avec une feuille de route. À vous de jouer.
      </p>
      <div style={{ marginTop: 60, display: 'flex', gap: 26 }}>
        <Cl2Ask icon="star" tone="yellow" title="Votre évaluation Technologia" d={420}>
          Cinq minutes, à chaud : vos commentaires améliorent la formation.
        </Cl2Ask>
        <Cl2Ask icon="chat" tone="blue" title="Vos questions" d={560}>
          Sur vos cas, vos outils, votre premier pilote : c’est le moment.
        </Cl2Ask>
      </div>
    </div>
    <Portrait x={1440} y={280} w={300} />
    <div className={A.in} style={{ position: 'absolute', left: 1440, top: 750, width: 380, ...dl(700) }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
      <div style={{ fontSize: 22, color: C.muted }}>Formateur · Technologia</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 928, display: 'flex', alignItems: 'center', gap: 20, ...dl(900) }}>
      <img src={logoWide} alt="Technologia" style={{ height: 40, display: 'block', mixBlendMode: 'multiply' }} />
      <span style={{ width: 1.5, height: 26, background: C.rule }} />
      <span style={{ fontSize: 20, color: C.muted }}>{COURSE} · IA134</span>
    </div>
    <Footer2 />
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [Cl2_Roadmap, Cl2_Synth, Cl2_Resources, Cl2_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · CLÔTURE (≈ 15 h 50)

OBJECTIF — Transformer deux jours de contenu en un plan d'action daté. C'est le livrable promis dès l'ouverture : la feuille de route de 90 jours.

DIRE — « Le mandat de Boréal était clair : une feuille de route IA agentique réaliste, sur 90 jours. La voici, et elle vaut aussi pour votre organisation. Remarquez que chaque phase se termine par un jalon : une décision écrite, pas une impression. »

ANIMATION —
→ beat 1 : Jours 0 à 30, CADRER. « On choisit UN quick win de la matrice — pour Boréal, la FAQ RH ou les accès TI. On rédige la charte d'agent, on nomme un parrain métier et on lance l'EFVP si des renseignements personnels sont en jeu. »
→ beat 2 : Jours 31 à 60, PROTOTYPER ET PILOTER. « Prototype évalué sur des cas de référence, puis petit groupe pilote, avec un humain qui valide. Au jour 60 : go ou no-go, selon la checklist du module 9. »
→ beat 3 : Jours 61 à 90, MESURER ET DÉCIDER. « Les KPI du module 10. Trois issues : déployer, ajuster ou arrêter — arrêter est légitime. Et on prépare le deuxième cas. »

INTERACTION — « Quel serait VOTRE quick win des 30 premiers jours ? » Deux ou trois réponses ; renvoyez aux matrices produites ce matin.

TRANSITION — « Prenons un peu de recul sur ces deux jours. »`,
  `⏱ 2 min · SYNTHÈSE

OBJECTIF — Relier les dix modules en une seule démarche, pour que les participants repartent avec une vue d'ensemble et non une pile de diapos.

DIRE — « Hier, nous avons appris à comprendre. Un agent, c'est une boucle : il perçoit, raisonne, agit et observe. On part toujours d'un irritant réel, on choisit le type d'agent le plus simple qui fonctionne, et on se souvient d'Air Canada : l'entreprise répond de ce que dit son agent. »

ANIMATION —
→ beat 1 : le Jour 2. « Aujourd'hui, nous avons construit. On a priorisé avec la matrice impact × complexité, cadré ce que l'agent fait, ne fait pas et escalade, choisi peu d'outils, bien décrits. Au prototype, vous avez vu la logique lire, extraire, décider, agir, avec un humain pour les cas délicats. Puis le déploiement par étapes et la mesure en continu. »
→ beat 2 : la phrase à retenir. « Si vous ne gardez qu'une phrase : commencer petit, encadrer fort, mesurer toujours. C'est ce qui distingue les projets qui durent des 40 % que Gartner voit annulés d'ici 2027. »

INTERACTION — « Quel module vous sera le plus utile dès lundi ? » Un tour rapide, un mot par personne si le temps le permet.

TRANSITION — « Pour continuer à apprendre après aujourd'hui, voici une courte sélection de ressources. »`,
  `⏱ 1 min · RESSOURCES

OBJECTIF — Donner des points d'appui fiables et gratuits pour chaque étape de la feuille de route, sans noyer le groupe sous une bibliographie.

DIRE — « Six familles, une par étape. »
• Comprendre et concevoir — « Si vous ne lisez qu'un texte, lisez Building effective agents d'Anthropic, publié en décembre 2024 : workflows contre agents, les cinq patterns vus hier, et le conseil de commencer simple. Le cours gratuit de Hugging Face sur les agents convient aux profils plus techniques. »
• Standards ouverts — « MCP pour brancher les outils, A2A pour faire dialoguer les agents. Suivez-les : l'écosystème bouge vite. »
• Sécurité — « Le Top 10 OWASP pour les applications LLM 2025 : remettez-le à votre équipe de sécurité, en particulier LLM01, l'injection de prompt, et LLM06, l'agentivité excessive. »
• Conformité au Québec — « Le site de la Commission d'accès à l'information : tout sur la Loi 25 et l'EFVP. À consulter avec votre responsable de la protection des renseignements personnels. »
• Construire, Évaluer et surveiller — « Les outils cités au module 7 et au module 10. Ne les apprenez pas tous : choisissez selon votre écosystème et vos compétences internes. »

ASTUCE — Les noms suffisent : une recherche en ligne mène à la bonne page. Invitez les participants à photographier l'écran.

TRANSITION — « Il me reste deux choses à vous demander avant de nous quitter. »`,
  `⏱ 3 min · MOT DE LA FIN (jusqu'à 16 h 00)

OBJECTIF — Remercier, recueillir l'évaluation et laisser de la place aux dernières questions.

DIRE — « Merci pour votre participation, vos questions et vos cas concrets : ce sont eux qui ont fait la richesse de ces deux jours. Il y a deux jours, l'IA agentique était peut-être un mot à la mode. Aujourd'hui, vous savez ce qu'est un agent, quand il crée de la valeur, comment le cadrer et comment le mesurer. Vous repartez avec une feuille de route : à vous de jouer. »

ÉVALUATION — « Première demande : l'évaluation Technologia. Cinq minutes, à chaud, pendant que tout est frais. Vos commentaires, positifs comme critiques, servent vraiment à améliorer la formation. » À PERSONNALISER : indiquez comment y accéder (lien, courriel ou formulaire remis par Technologia) et laissez le temps de la remplir en salle.

QUESTIONS — « Deuxième demande : vos questions. Sur vos cas, vos outils, votre premier pilote. Je reste disponible quelques minutes après la fin. » Laissez la page affichée pendant les échanges.

INTERACTION — Si le temps le permet, demandez à chacun un engagement en une phrase : « Lundi, je vais… ». C'est un excellent moyen de terminer sur l'action.

FIN — Remerciez une dernière fois et souhaitez bon retour.`,
];
// @@NOTES-END
