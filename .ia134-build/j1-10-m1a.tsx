// ─── M1 · 1. From AI that answers to AI that acts (timeline) ────────────────
// Six milestones; each → press reveals the next one and moves the cursor.
const M1aTlX = [250, 534, 818, 1102, 1386, 1670];

const M1aMilestone = ({
  i,
  year,
  title,
  icon,
  tone,
  children,
}: {
  i: number;
  year: string;
  title: string;
  icon: IconName;
  tone: Tone;
  children: ReactNode;
}) => (
  <div
    className={i === 0 ? A.in : b.on(i)}
    style={{ position: 'absolute', left: M1aTlX[i] - 130, top: 330, width: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
  >
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{year}</div>
    <div
      style={{
        marginTop: 18,
        width: 32,
        height: 32,
        boxSizing: 'border-box',
        borderRadius: 999,
        background: '#fff',
        border: `7px solid ${STRONG[tone]}`,
        boxShadow: SHADOW_SM,
      }}
    />
    <div style={{ width: 3, height: 24, background: C.rule }} />
    <div
      style={{
        boxSizing: 'border-box',
        width: 260,
        minHeight: 300,
        padding: '24px 22px 22px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      }}
    >
      <IconTile name={icon} tone={tone} size={54} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 31, lineHeight: 1.08, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1aBand = ({ x, w, tone, cls, children }: { x: number; w: number; tone: Tone; cls: string; children: ReactNode }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: 276, width: w }}>
    <div style={{ height: 5, borderRadius: 3, background: STRONG[tone] }} />
    <Eyebrow c={T[tone].fg} size={22} style={{ marginTop: 8 }}>
      {children}
    </Eyebrow>
  </div>
);

const M1a_Timeline: Page = () => {
  const [ref, count] = useBeats();
  const idx = Math.min(count, 5);
  return (
    <Frame mod={1} beats={6}>
      <Title>De l’IA qui répond à l’IA qui agit</Title>
      <Lede>En huit ans, le modèle de langage est passé de curiosité de laboratoire à moteur d’action.</Lede>
      <M1aBand x={120} w={828} tone="blue" cls={A.fade}>
        L’IA qui répond
      </M1aBand>
      <M1aBand x={972} w={828} tone="green" cls={b.fade(3)}>
        L’IA qui agit
      </M1aBand>
      {/* Track + progress fill + cursor */}
      <div ref={ref} className={A.grow} style={{ position: 'absolute', left: 250, top: 405, width: 1420, height: 6, borderRadius: 3, background: C.rule }} />
      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 405,
          width: M1aTlX[idx] - M1aTlX[0],
          height: 6,
          borderRadius: 3,
          background: G.blue,
          transition: `width 900ms ${EASE}`,
        }}
      />
      <M1aMilestone i={0} year="2017" title="Transformer" icon="layers" tone="blue">
        L’architecture « Attention Is All You Need » : la base de tous les LLM.
      </M1aMilestone>
      <M1aMilestone i={1} year="2020" title="GPT-3" icon="brain" tone="blue">
        Un modèle géant qui rédige, résume et traduit sur simple consigne.
      </M1aMilestone>
      <M1aMilestone i={2} year="Nov. 2022" title="ChatGPT" icon="chat" tone="teal">
        L’assistant conversationnel arrive chez tout le monde : on lui parle.
      </M1aMilestone>
      <M1aMilestone i={3} year="2023" title="Appels d’outils" icon="tool" tone="green">
        Le modèle demande l’exécution d’une fonction : API, recherche, calcul.
      </M1aMilestone>
      <M1aMilestone i={4} year="2024" title="MCP, premiers agents" icon="plug" tone="yellow">
        Un standard pour brancher les outils (Anthropic) ; agents de code, d’assistance.
      </M1aMilestone>
      <M1aMilestone i={5} year="2025" title="Agents en entreprise" icon="org" tone="violet">
        Plateformes d’agents et protocole A2A : les agents collaborent entre eux.
      </M1aMilestone>
      {/* Cursor: pulsing ring on the current milestone */}
      <svg
        width={80}
        height={80}
        viewBox="0 0 80 80"
        style={{ position: 'absolute', left: M1aTlX[idx] - 40, top: 368, overflow: 'visible', pointerEvents: 'none', transition: `left 900ms ${EASE}` }}
      >
        <circle cx={40} cy={40} r={22} fill="rgba(31,120,193,.35)" className={A.pulse} />
      </svg>
      <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 826, width: 1680 }}>
        <Callout title="Le basculement" tone="blue" icon="bolt" size={28}>
          Le LLM n’est plus la destination : il devient le <Strong>cerveau</Strong> d’un système qui <Hl>agit à travers des outils</Hl>.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M1 · 2. Definition: the perceive → reason → act → observe loop ─────────
const M1aCX = 450;
const M1aCY = 360;
const M1aR = 245;
const M1aPt = (a: number) => {
  const r = (a * Math.PI) / 180;
  return [M1aCX + M1aR * Math.sin(r), M1aCY - M1aR * Math.cos(r)] as const;
};

// Clockwise arc between two angles (degrees from the top), drawn on beat n.
const M1aLoopArc = ({ a1, a2, n, d = 0 }: { a1: number; a2: number; n: number; d?: number }) => {
  const [x1, y1] = M1aPt(a1);
  const [x2, y2] = M1aPt(a2);
  const r = (a2 * Math.PI) / 180;
  const tx = Math.cos(r);
  const ty = Math.sin(r);
  const tip = `${x2 + tx * 20},${y2 + ty * 20}`;
  const c1 = `${x2 - ty * 12},${y2 + tx * 12}`;
  const c2 = `${x2 + ty * 12},${y2 - tx * 12}`;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} A ${M1aR} ${M1aR} 0 0 1 ${x2} ${y2}`}
        pathLength={1}
        fill="none"
        stroke={C.blue}
        strokeWidth={6}
        strokeLinecap="round"
        className={b.draw(n)}
        style={dl(d)}
      />
      <polygon points={`${tip} ${c1} ${c2}`} fill={C.blue} className={b.fade(n)} style={dl(d + 700)} />
    </g>
  );
};

const M1aLoopNode = ({
  a,
  n,
  icon,
  tone,
  verb,
  children,
}: {
  a: number;
  n: number;
  icon: IconName;
  tone: Tone;
  verb: string;
  children: ReactNode;
}) => {
  const [x, y] = M1aPt(a);
  return (
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 140, top: y - 70, width: 280 }}>
      <div
        style={{
          boxSizing: 'border-box',
          width: 280,
          minHeight: 140,
          padding: '16px 20px',
          background: C.card,
          borderRadius: 16,
          boxShadow: `${SHADOW}, inset 0 0 0 2px ${T[tone].bd}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={icon} tone={tone} size={48} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1, color: C.ink }}>{verb}</span>
          <Num n={n} tone={tone} size={30} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.35, color: C.soft }}>{children}</div>
      </div>
    </div>
  );
};

const M1aExRow = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 52 }}>
    <Num n={n} tone={tone} size={38} />
    <span style={{ fontSize: 25, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const M1a_Definition: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Qu’est-ce qu’un agent IA ?</Title>
    <Lede>Un système qui perçoit, raisonne, agit… et recommence jusqu’à atteindre son objectif.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 780 }}>
      <Eyebrow cls={A.in}>Définition</Eyebrow>
      <Quote cls={A.in} style={{ marginTop: 26, ...dl(120) }}>
        Un agent IA <Hl>poursuit un objectif</Hl> en percevant son environnement, en raisonnant et en agissant avec des outils — en boucle.
      </Quote>
      <Eyebrow cls={A.in} c={C.teal} size={22} style={{ marginTop: 44, ...dl(260) }}>
        Exemple Boréal · soutien TI
      </Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <M1aExRow n={1} tone="blue">
          Un courriel : « Je n’ai plus accès à mon compte »
        </M1aExRow>
        <M1aExRow n={2} tone="violet">
          Demande d’accès : vérifier l’identité d’abord
        </M1aExRow>
        <M1aExRow n={3} tone="teal">
          Lance la réinitialisation du mot de passe
        </M1aExRow>
        <M1aExRow n={4} tone="green">
          Compte débloqué ? Oui → confirme à l’employé
        </M1aExRow>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 900, top: 270, width: 900, height: 700 }}>
      <svg width={900} height={700} viewBox="0 0 900 700" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx={M1aCX} cy={M1aCY} r={M1aR} fill="none" stroke={C.rule} strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" className={A.fade} />
        <circle cx={M1aCX} cy={M1aCY} r={86} fill="rgba(31,120,193,.18)" className={A.pulse} />
        <M1aLoopArc a1={36} a2={69} n={2} />
        <M1aLoopArc a1={111} a2={141} n={3} />
        <M1aLoopArc a1={219} a2={249} n={4} />
        <M1aLoopArc a1={291} a2={321} n={4} d={500} />
        <g className={b.fade(4)} style={dl(1200)}>
          <FlowDot path={`M ${M1aCX} ${M1aCY - M1aR} A ${M1aR} ${M1aR} 0 1 1 ${M1aCX} ${M1aCY + M1aR} A ${M1aR} ${M1aR} 0 1 1 ${M1aCX} ${M1aCY - M1aR}`} dur={5} r={11} color={C.yellow} />
        </g>
      </svg>
      <div className={A.float} style={{ position: 'absolute', left: M1aCX - 75, top: M1aCY - 95, width: 150, height: 150 }}>
        <div
          className={A.pop}
          style={{
            width: 150,
            height: 150,
            borderRadius: 32,
            background: G.blue,
            boxShadow: '0 24px 48px -24px rgba(20,60,100,.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...dl(200),
          }}
        >
          <Icon name="bot" size={88} color="#fff" sw={1.8} />
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: M1aCX - 120, top: M1aCY + 72, width: 240, textAlign: 'center', ...dl(400) }}>
        <Eyebrow size={22} c={C.blue}>
          L’agent
        </Eyebrow>
      </div>
      <M1aLoopNode a={0} n={1} icon="eye" tone="blue" verb="Percevoir">
        Lire la demande, le contexte, les données
      </M1aLoopNode>
      <M1aLoopNode a={90} n={2} icon="brain" tone="violet" verb="Raisonner">
        Comprendre et planifier les étapes
      </M1aLoopNode>
      <M1aLoopNode a={180} n={3} icon="tool" tone="teal" verb="Agir">
        Appeler un outil : API, courriel, base
      </M1aLoopNode>
      <M1aLoopNode a={270} n={4} icon="search" tone="green" verb="Observer">
        Lire le résultat, ajuster, recommencer
      </M1aLoopNode>
    </div>
  </Frame>
);

// ─── M1 · 3. Anatomy of an agent ────────────────────────────────────────────
const M1aPart = ({
  x,
  y,
  w = 500,
  n,
  icon,
  tone,
  title,
  ex,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  n: number;
  icon: IconName;
  tone: Tone;
  title: string;
  ex: ReactNode;
  children: ReactNode;
}) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: y, width: w }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        padding: '20px 24px 20px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 7px 0 0 ${STRONG[tone]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={54} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.35, color: T[tone].fg, fontStyle: 'italic' }}>{ex}</div>
    </div>
  </div>
);

// Connector from the brain to a component: draws on beat n, then a dot flows.
const M1aWire = ({ x1, y1, x2, y2, n, tone, out = true }: { x1: number; y1: number; x2: number; y2: number; n: number; tone: Tone; out?: boolean }) => (
  <g>
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} pathLength={1} stroke={T[tone].bd} strokeWidth={5} strokeLinecap="round" fill="none" className={b.draw(n)} />
    <g className={b.fade(n)} style={dl(800)}>
      <FlowDot path={out ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x2} ${y2} L ${x1} ${y1}`} dur={2.2} r={8} color={STRONG[tone] === C.yellow ? C.amber : STRONG[tone]} />
    </g>
  </g>
);

const M1a_Anatomy: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Anatomie d’un agent</Title>
    <Lede>Un LLM au centre, cinq composants autour : c’est l’ensemble qui fait l’agent.</Lede>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <circle cx={960} cy={500} r={124} fill="rgba(31,120,193,.16)" className={A.pulse} />
      <M1aWire x1={960} y1={500} x2={620} y2={376} n={1} tone="blue" out={false} />
      <M1aWire x1={960} y1={500} x2={620} y2={596} n={2} tone="violet" out={false} />
      <M1aWire x1={960} y1={500} x2={1300} y2={376} n={3} tone="teal" />
      <M1aWire x1={960} y1={500} x2={1300} y2={596} n={4} tone="green" out={false} />
      <M1aWire x1={960} y1={500} x2={960} y2={780} n={5} tone="coral" />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 850, top: 390, width: 220, height: 220 }}>
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 44,
          background: G.blue,
          boxShadow: '0 30px 60px -28px rgba(20,60,100,.65)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Icon name="brain" size={104} color="#fff" sw={1.7} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em', color: '#fff' }}>LLM</span>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 810, top: 632, width: 300, display: 'flex', justifyContent: 'center', ...dl(300) }}>
      <Tag tone="blue" size={22} style={{ background: '#fff' }}>
        le cerveau : comprend et décide
      </Tag>
    </div>
    <M1aPart x={120} y={290} n={1} icon="target" tone="blue" title="Instructions et objectif" ex="« Aide les employés de Boréal pour leurs accès TI. »">
      Rôle, mission, règles : le prompt système.
    </M1aPart>
    <M1aPart x={120} y={510} n={2} icon="archive" tone="violet" title="Mémoire" ex="« Cet employé a déjà demandé un VPN mardi. »">
      Ce qui s’est dit, ce qui a été fait.
    </M1aPart>
    <M1aPart x={1300} y={290} n={3} icon="tool" tone="teal" title="Outils (API)" ex="Billetterie, annuaire, courriel, calendrier, ERP…">
      Ses mains : les actions dans vos systèmes.
    </M1aPart>
    <M1aPart x={1300} y={510} n={4} icon="database" tone="green" title="Données et connaissances" ex="Procédures TI, politiques RH, fiches produits (RAG)">
      Ce qu’il consulte pour répondre juste.
    </M1aPart>
    <M1aPart x={560} y={772} w={800} n={5} icon="shieldCheck" tone="coral" title="Garde-fous + humain dans la boucle" ex="Ex. : tout accès administrateur doit être approuvé par un technicien.">
      Permissions, plafonds, journal ; un humain valide le sensible.
    </M1aPart>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1a_Timeline, M1a_Definition, M1a_Anatomy];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · OUVERTURE DU MODULE 1 (≈ 9 h 32)

OBJECTIF — Montrer que l'IA agentique n'est pas une mode sortie de nulle part : c'est l'aboutissement logique de huit ans de progrès, avec un basculement clair en 2023.

DIRE — « En 2017, une équipe de Google publie un article au titre un peu provocateur : Attention Is All You Need. Il décrit le Transformer, l'architecture qui est sous le capot de tous les grands modèles de langage d'aujourd'hui. »

ANIMATION — Avancez le curseur à chaque clic :
→ beat 1 : 2020, GPT-3. « Pour la première fois, un modèle rédige, résume, traduit… sur simple consigne. »
→ beat 2 : novembre 2022, ChatGPT. « Tout le monde peut parler à un modèle. Mais remarquez : il RÉPOND. Il ne fait rien dans vos systèmes. »
→ beat 3 : 2023, la bande verte apparaît. « Les modèles apprennent à demander l'exécution d'une fonction : chercher, calculer, appeler une API. C'est le vrai point de bascule. »
→ beat 4 : 2024. « Anthropic propose MCP, une prise standard pour brancher les outils. Les premiers agents de code et d'assistance arrivent. »
→ beat 5 : 2025. « Les éditeurs lancent des plateformes d'agents, et Google propose A2A pour que les agents se parlent. »
→ beat 6 : le basculement.

INTERACTION — « Dans votre organisation, vous êtes plutôt à gauche ou à droite de la ligne de 2023 ? » La plupart diront « à gauche » : c'est normal, et c'est l'objet de la formation.

TRANSITION — « Mais concrètement, qu'est-ce qui fait qu'un système mérite le nom d'agent ? »`,
  `⏱ 5 min

OBJECTIF — Donner une définition simple, mémorisable, et la rendre concrète avec un exemple Boréal.

DIRE — Lisez la définition lentement. « Retenez trois mots : objectif, outils, boucle. Un agent poursuit un but, il agit avec des outils, et il recommence tant que le but n'est pas atteint. »

ANIMATION — Chaque clic ajoute une étape de la boucle ET la ligne correspondante de l'exemple Boréal, à gauche :
→ beat 1 : PERCEVOIR. « Un courriel arrive au soutien TI : "Je n'ai plus accès à mon compte". »
→ beat 2 : RAISONNER. « L'agent comprend qu'il s'agit d'une demande d'accès, et il planifie : d'abord vérifier l'identité. »
→ beat 3 : AGIR. « Il appelle l'outil de réinitialisation du mot de passe. »
→ beat 4 : OBSERVER, la boucle se ferme et le point jaune se met à tourner. « Il vérifie le résultat. Le compte est débloqué ? Il confirme à l'employé. Sinon, il recommence ou passe la main à un technicien. »

À SOULIGNER — « C'est la boucle qui fait la différence. ChatGPT en mode conversation fait un seul tour : vous demandez, il répond, fin. Un agent enchaîne plusieurs tours, sans que vous ayez à relancer à chaque étape. »

INTERACTION — « Pensez à une tâche que vous faites chaque semaine : pouvez-vous la décrire avec ces quatre verbes ? » Une ou deux réponses.

TRANSITION — « Ouvrons le capot : de quoi est fait un agent ? »`,
  `⏱ 5 min

OBJECTIF — Faire comprendre qu'un agent n'est pas « un modèle plus puissant », mais un système : un LLM entouré de composants. C'est la grille de lecture qu'on réutilisera dans tous les cas.

DIRE — « Au centre, le LLM : c'est le cerveau. Il comprend et il décide. Mais un cerveau seul ne fait rien. Voici ce qu'on branche autour. »

ANIMATION — Un composant par clic ; le point qui circule montre le sens du flux :
→ beat 1 : INSTRUCTIONS ET OBJECTIF. « Le prompt système : le rôle, la mission, ce qui est permis et interdit. C'est la fiche de poste de l'agent. »
→ beat 2 : MÉMOIRE. « Ce qui s'est dit dans la conversation, ce qui a déjà été fait, les préférences. On y revient dans quelques pages. »
→ beat 3 : OUTILS. « Ce sont ses mains : les API de la billetterie, de l'annuaire, du courriel. Le flux part du cerveau vers l'outil. »
→ beat 4 : DONNÉES ET CONNAISSANCES. « Les documents qu'il consulte, souvent par RAG : il va chercher le bon passage avant de répondre. »
→ beat 5 : GARDE-FOUS ET HUMAIN. « Permissions, plafonds, journal des actions… et un humain qui valide ce qui est sensible. Ce composant-là, beaucoup l'oublient. C'est celui qui coûte le plus cher quand il manque. »

INTERACTION — « Selon vous, lequel de ces cinq composants est le plus souvent négligé dans les projets ? » Réponse attendue : les garde-fous. Annoncez les cas Air Canada et Replit de cet après-midi.

TRANSITION — « Comparons maintenant point par point un LLM classique et un agent. »`,
];
// @@NOTES-END
