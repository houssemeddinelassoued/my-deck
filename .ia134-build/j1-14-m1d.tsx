// ─── M1 · 8. Goals: break them down (tree built beat by beat) ───────────────
// Root goal → 3 sub-goals (beat 1) → tasks (beat 2) → tools (beat 3) → message (beat 4).
const M1dColX = [360, 855, 1350]; // column lefts (width 450)
const M1dColW = 450;
const M1dMid = (i: number) => M1dColX[i] + M1dColW / 2;

const M1dLevel = ({ y, cls, c = C.blue, children }: { y: number; cls: string; c?: string; children: ReactNode }) => (
  <div className={cls} style={{ position: 'absolute', left: 120, top: y, width: 210 }}>
    <Eyebrow c={c} size={22}>
      {children}
    </Eyebrow>
    <div style={{ marginTop: 6, width: 56, height: 4, borderRadius: 2, background: c }} />
  </div>
);

const M1dSub = ({ i, icon, tone, children }: { i: number; icon: IconName; tone: Tone; children: ReactNode }) => (
  <div className={b.on(1)} style={{ position: 'absolute', left: M1dColX[i], top: 420, width: M1dColW, ...dl(i * 140) }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: M1dColW,
        minHeight: 112,
        padding: '22px 20px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`,
      }}
    >
      <IconTile name={icon} tone={tone} size={52} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{children}</span>
    </div>
  </div>
);

const M1dTaskLine = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, lineHeight: 1.35, color: C.ink }}>
    <Icon name="check" size={24} color={T[tone].fg} sw={2.6} />
    <span>{children}</span>
  </div>
);

const M1dTasks = ({ i, tone, children }: { i: number; tone: Tone; children: ReactNode }) => (
  <div className={b.on(2)} style={{ position: 'absolute', left: M1dColX[i], top: 572, width: M1dColW, ...dl(i * 140) }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: M1dColW,
        padding: '14px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: T[tone].bg,
        borderRadius: 14,
        boxShadow: `inset 0 0 0 2px ${T[tone].bd}`,
      }}
    >
      {children}
    </div>
  </div>
);

const M1dTools = ({ i, children }: { i: number; children: ReactNode }) => (
  <div
    className={b.pop(3)}
    style={{ position: 'absolute', left: M1dColX[i], top: 718, width: M1dColW, display: 'flex', justifyContent: 'center', gap: 12, ...dl(i * 140) }}
  >
    {children}
  </div>
);

const M1dTool = ({ icon, children }: { icon: IconName; children: ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 16px',
      borderRadius: 999,
      background: '#fff',
      boxShadow: `${SHADOW_SM}, inset 0 0 0 2px ${C.rule}`,
      fontFamily: mono,
      fontSize: 20,
      color: C.soft,
    }}
  >
    <Icon name={icon} size={22} color={C.muted} />
    {children}
  </span>
);

const M1d_Goals: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Objectifs : décomposer pour agir</Title>
    <Lede>Un agent reçoit un but, pas une recette : il le découpe jusqu’à des actions concrètes.</Lede>
    <M1dLevel y={300} cls={A.fade}>
      Objectif
    </M1dLevel>
    <M1dLevel y={452} cls={b.fade(1)} c={C.violet}>
      Sous-objectifs
    </M1dLevel>
    <M1dLevel y={610} cls={b.fade(2)} c={C.teal}>
      Tâches
    </M1dLevel>
    <M1dLevel y={722} cls={b.fade(3)} c={C.muted}>
      Outils
    </M1dLevel>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d={`M 1080 366 V 394 H ${M1dMid(0)} V 420`} pathLength={1} fill="none" stroke={C.faint} strokeWidth={4} strokeLinejoin="round" className={b.draw(1)} />
      <path d="M 1080 366 V 420" pathLength={1} fill="none" stroke={C.faint} strokeWidth={4} className={b.draw(1)} />
      <path d={`M 1080 366 V 394 H ${M1dMid(2)} V 420`} pathLength={1} fill="none" stroke={C.faint} strokeWidth={4} strokeLinejoin="round" className={b.draw(1)} />
      <path d={`M ${M1dMid(0)} 532 V 572`} pathLength={1} fill="none" stroke={T.blue.bd} strokeWidth={4} className={b.draw(2)} />
      <path d={`M ${M1dMid(1)} 532 V 572`} pathLength={1} fill="none" stroke={T.teal.bd} strokeWidth={4} className={b.draw(2)} />
      <path d={`M ${M1dMid(2)} 532 V 572`} pathLength={1} fill="none" stroke={T.violet.bd} strokeWidth={4} className={b.draw(2)} />
      <path d={`M ${M1dMid(0)} 680 V 718`} pathLength={1} fill="none" stroke={C.faint} strokeWidth={3} strokeDasharray="6 8" className={b.fade(3)} />
      <path d={`M ${M1dMid(1)} 680 V 718`} pathLength={1} fill="none" stroke={C.faint} strokeWidth={3} strokeDasharray="6 8" className={b.fade(3)} />
      <path d={`M ${M1dMid(2)} 680 V 718`} pathLength={1} fill="none" stroke={C.faint} strokeWidth={3} strokeDasharray="6 8" className={b.fade(3)} />
    </svg>
    {/* Root goal */}
    <div className={A.pop} style={{ position: 'absolute', left: 560, top: 270, width: 1040, ...dl(150) }}>
      <div
        style={{
          boxSizing: 'border-box',
          width: 1040,
          height: 96,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          background: G.blue,
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 48px -26px rgba(20,60,100,.6)',
        }}
      >
        <Icon name="target" size={48} color="#fff" sw={2} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.05, color: '#fff' }}>
          Réduire de 30 % le temps de traitement des billets TI
        </span>
      </div>
    </div>
    <M1dSub i={0} icon="filter" tone="blue">
      Trier et router chaque billet
    </M1dSub>
    <M1dSub i={1} icon="key" tone="teal">
      Régler seul les accès simples
    </M1dSub>
    <M1dSub i={2} icon="doc" tone="violet">
      Préparer les cas complexes
    </M1dSub>
    <M1dTasks i={0} tone="blue">
      <M1dTaskLine tone="blue">Lire et classer le billet</M1dTaskLine>
      <M1dTaskLine tone="blue">Assigner la bonne équipe</M1dTaskLine>
    </M1dTasks>
    <M1dTasks i={1} tone="teal">
      <M1dTaskLine tone="teal">Vérifier l’identité (MFA)</M1dTaskLine>
      <M1dTaskLine tone="teal">Réinitialiser le mot de passe</M1dTaskLine>
    </M1dTasks>
    <M1dTasks i={2} tone="violet">
      <M1dTaskLine tone="violet">Résumer l’historique du billet</M1dTaskLine>
      <M1dTaskLine tone="violet">Suggérer un article de la base</M1dTaskLine>
    </M1dTasks>
    <M1dTools i={0}>
      <M1dTool icon="ticket">billetterie</M1dTool>
      <M1dTool icon="users">annuaire</M1dTool>
    </M1dTools>
    <M1dTools i={1}>
      <M1dTool icon="shieldCheck">mfa</M1dTool>
      <M1dTool icon="lock">gestion_acces</M1dTool>
    </M1dTools>
    <M1dTools i={2}>
      <M1dTool icon="search">base_connaissances</M1dTool>
    </M1dTools>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 812, width: 1680 }}>
      <Callout title="Le partage des rôles" tone="blue" icon="route" size={28}>
        <Strong>Vous</Strong> fixez l’objectif et les limites ; <Hl>l’agent le décompose</Hl> en tâches et choisit ses outils.
      </Callout>
    </div>
  </Frame>
);

// ─── M1 · 9. Memory: short-term / long-term / episodic ──────────────────────
const M1dMemCol = ({
  x,
  n,
  icon,
  tone,
  title,
  sub,
  life,
  ex,
  children,
}: {
  x: number;
  n: number;
  icon: IconName;
  tone: Tone;
  title: string;
  sub: string;
  life: string;
  ex: ReactNode;
  children: ReactNode;
}) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 280, width: 540 }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: 540,
        padding: '30px 26px 24px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1, color: C.ink }}>{title}</span>
        <Num n={n} tone={tone} size={36} style={{ marginLeft: 'auto' }} />
      </div>
      <Eyebrow c={T[tone].fg} size={22} style={{ marginTop: 14 }}>
        {sub}
      </Eyebrow>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 21, color: C.muted }}>
        <Icon name="clock" size={20} color={C.muted} />
        {life}
      </div>
      <div
        style={{
          boxSizing: 'border-box',
          marginTop: 16,
          minHeight: 214,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 10,
          background: C.panel,
          borderRadius: 12,
        }}
      >
        {children}
      </div>
      <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.38, color: T[tone].fg, fontStyle: 'italic' }}>{ex}</div>
    </div>
  </div>
);

// One message in the context window (faded = already pushed out of the window).
const M1dCtxRow = ({ who, faded = false, children }: { who: 'user' | 'agent'; faded?: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, lineHeight: 1.3, color: faded ? C.faint : C.ink }}>
    <span
      style={{
        flex: 'none',
        width: 26,
        height: 26,
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: faded ? C.rule : who === 'agent' ? C.blue : T.grey.bd,
      }}
    >
      <Icon name={who === 'agent' ? 'bot' : 'user'} size={18} color="#fff" sw={2.2} />
    </span>
    <span style={{ textDecoration: faded ? 'line-through' : undefined }}>{children}</span>
  </div>
);

const M1dFact = ({ k: key, children }: { k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontSize: 22, lineHeight: 1.3 }}>
    <span style={{ flex: 'none', width: 120, fontFamily: mono, fontSize: 20, color: C.muted }}>{key}</span>
    <span style={{ fontWeight: 600, color: C.ink }}>{children}</span>
  </div>
);

const M1dLog = ({ t, last = false, children }: { t: string; last?: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, lineHeight: 1.3, color: C.ink }}>
    <span style={{ flex: 'none', width: 12, height: 12, borderRadius: 999, background: last ? C.coral : C.green }} />
    <span style={{ flex: 'none', width: 118, fontFamily: mono, fontSize: 19, color: C.muted }}>{t}</span>
    <span style={{ fontWeight: last ? 700 : 400 }}>{children}</span>
  </div>
);

const M1d_Memory: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>La mémoire : trois horizons</Title>
    <Lede>Sans mémoire, chaque demande repart de zéro. Avec elle, l’agent enchaîne et personnalise.</Lede>
    <M1dMemCol
      x={120}
      n={1}
      icon="chat"
      tone="blue"
      title="Court terme"
      sub="La fenêtre de contexte"
      life="Dure : la conversation en cours"
      ex="« Depuis ce matin » : il comprend qu’on parle du VPN cité deux messages plus haut."
    >
      <M1dCtxRow who="user" faded>
        Bonjour, une question sur ma paie…
      </M1dCtxRow>
      <M1dCtxRow who="user">« Mon VPN ne fonctionne plus. »</M1dCtxRow>
      <M1dCtxRow who="agent">« Depuis quand ? »</M1dCtxRow>
      <M1dCtxRow who="user">« Depuis ce matin. »</M1dCtxRow>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, color: C.muted }}>
        <span style={{ flex: 'none' }}>Capacité</span>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: C.rule, overflow: 'hidden' }}>
          <div className={b.grow(1)} style={{ width: '86%', height: 12, borderRadius: 6, background: G.blue, ...dl(400) }} />
        </div>
        <span style={{ flex: 'none' }}>limitée</span>
      </div>
    </M1dMemCol>
    <M1dMemCol
      x={690}
      n={2}
      icon="archive"
      tone="violet"
      title="Long terme"
      sub="Profil, préférences, savoirs"
      life="Dure : des mois, d’une session à l’autre"
      ex="Il répond en français et propose la procédure de la Finance, sans rien redemander."
    >
      <M1dFact k="langue">français</M1dFact>
      <M1dFact k="service">Finance · Montréal</M1dFact>
      <M1dFact k="poste">portable, Windows 11</M1dFact>
      <M1dFact k="savoirs">procédures TI (base RAG)</M1dFact>
    </M1dMemCol>
    <M1dMemCol
      x={1260}
      n={3}
      icon="clock"
      tone="green"
      title="Épisodique"
      sub="L’historique des actions"
      life="Dure : selon la règle de conservation"
      ex="Troisième incident VPN cette semaine : il escalade au lieu de répéter la même solution."
    >
      <M1dLog t="mar. 09:12">Accès VPN rétabli</M1dLog>
      <M1dLog t="mer. 14:05">Billet #8812 fermé</M1dLog>
      <M1dLog t="jeu. 10:30">VPN rétabli (bis)</M1dLog>
      <M1dLog t="ven. 08:47" last>
        VPN en panne : 3ᵉ fois
      </M1dLog>
    </M1dMemCol>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 846, width: 1680 }}>
      <Callout title="La mémoire, ce sont des données" tone="yellow" icon="lock" size={28}>
        Décidez <Strong>quoi garder</Strong>, <Strong>combien de temps</Strong> et <Strong>qui y a accès</Strong> : la Loi 25 s’applique aussi ici.
      </Callout>
    </div>
  </Frame>
);

// ─── M1 · 10. The ability to act: tool calls ────────────────────────────────
// Three columns: the agent's JSON request (odd beats), then the system's result (even beats).
const M1dCallX = [120, 700, 1280];
const M1dCallW = 520;

const M1dCallHead = ({ i, tone, children }: { i: number; tone: Tone; children: ReactNode }) => (
  <div
    className={i === 0 ? A.in : b.fade(i * 2 + 1)}
    style={{ position: 'absolute', left: M1dCallX[i], top: 278, width: M1dCallW, display: 'flex', alignItems: 'center', gap: 14 }}
  >
    <Num n={i + 1} tone={tone} size={40} />
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.ink }}>{children}</span>
  </div>
);

const M1dCall = ({ i, children }: { i: number; children: ReactNode }) => (
  <div className={b.on(i * 2 + 1)} style={{ position: 'absolute', left: M1dCallX[i], top: 338, width: M1dCallW }}>
    <Code title="L’agent choisit et demande" size={20} style={{ width: M1dCallW, background: '#fff', boxShadow: `${SHADOW_SM}, inset 0 0 0 1.5px ${C.rule}` }}>
      {children}
    </Code>
  </div>
);

const M1dResult = ({ i, icon, children }: { i: number; icon: IconName; children: ReactNode }) => (
  <div className={b.on(i * 2 + 2)} style={{ position: 'absolute', left: M1dCallX[i], top: 640, width: M1dCallW }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, paddingLeft: 26 }}>
      <svg width={6} height={44} viewBox="0 0 6 44" style={{ flex: 'none' }}>
        <path d="M 3 0 V 44" stroke={C.faint} strokeWidth={4} strokeDasharray="6 6" className={A.march} />
      </svg>
      <Icon name="gear" size={24} color={C.muted} />
      <span style={{ fontSize: 21, color: C.muted }}>Le système exécute, puis renvoie :</span>
    </div>
    <div
      style={{
        boxSizing: 'border-box',
        width: M1dCallW,
        marginTop: 6,
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: T.green.bg,
        borderLeft: `7px solid ${C.green}`,
        borderRadius: 14,
      }}
    >
      <IconTile name={icon} tone="green" size={48} />
      <span style={{ fontSize: 24, lineHeight: 1.35, color: C.ink }}>{children}</span>
    </div>
  </div>
);

const M1dLink = ({ i }: { i: number }) => (
  <div className={b.fade(i * 2 + 1)} style={{ position: 'absolute', left: M1dCallX[i] - 54, top: 470 }}>
    <FlowArrow w={48} color={C.faint} />
  </div>
);

const M1d_Tools: Page = () => (
  <Frame mod={1} beats={7}>
    <Title>La capacité d’agir : les appels d’outils</Title>
    <Lede>L’agent choisit l’outil et ses paramètres ; le système l’exécute et lui renvoie le résultat.</Lede>
    <M1dCallHead i={0} tone="blue">
      rechercher_billets
    </M1dCallHead>
    <M1dCallHead i={1} tone="violet">
      resumer
    </M1dCallHead>
    <M1dCallHead i={2} tone="teal">
      envoyer_courriel
    </M1dCallHead>
    <M1dCall i={0}>
      {'{\n  '}
      <Jk>"outil"</Jk>: <Js>"rechercher_billets"</Js>
      {',\n  '}
      <Jk>"arguments"</Jk>
      {': {\n    '}
      <Jk>"priorite"</Jk>: <Js>"critique"</Js>
      {',\n    '}
      <Jk>"periode"</Jk>: <Js>"7 derniers jours"</Js>
      {'\n  }\n}'}
    </M1dCall>
    <M1dCall i={1}>
      {'{\n  '}
      <Jk>"outil"</Jk>: <Js>"resumer"</Js>
      {',\n  '}
      <Jk>"arguments"</Jk>
      {': {\n    '}
      <Jk>"source"</Jk>: <Js>"resultat_appel_1"</Js>
      {',\n    '}
      <Jk>"format"</Jk>: <Js>"5 puces"</Js>
      {'\n  }\n}'}
    </M1dCall>
    <M1dCall i={2}>
      {'{\n  '}
      <Jk>"outil"</Jk>: <Js>"envoyer_courriel"</Js>
      {',\n  '}
      <Jk>"arguments"</Jk>
      {': {\n    '}
      <Jk>"a"</Jk>: <Js>"equipe-ti@boreal.ca"</Js>
      {',\n    '}
      <Jk>"objet"</Jk>: <Js>"Billets critiques"</Js>
      {'\n  }\n}'}
    </M1dCall>
    <M1dLink i={1} />
    <M1dLink i={2} />
    <M1dResult i={0} icon="ticket">
      12 billets critiques : VPN (5), ERP (4), imprimantes (3)
    </M1dResult>
    <M1dResult i={1} icon="note">
      Résumé prêt : 5 puces, cause principale en tête
    </M1dResult>
    <M1dResult i={2} icon="send">
      Courriel envoyé à 14 personnes ; action journalisée
    </M1dResult>
    <div className={b.on(7)} style={{ position: 'absolute', left: 120, top: 846, width: 1680 }}>
      <Callout title="Qui fait quoi ?" tone="blue" icon="shieldCheck" size={28}>
        Le modèle ne fait que <Strong>demander</Strong> : c’est <Hl>votre système qui exécute</Hl>… et qui peut refuser.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1d_Goals, M1d_Memory, M1d_Tools];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min

OBJECTIF — Première notion clé : l'objectif. Un agent ne reçoit pas une recette pas à pas, mais un but qu'il découpe en sous-objectifs, en tâches, puis en appels d'outils.

DIRE — « Le soutien TI de Boréal reçoit environ 1 800 billets par mois. La direction fixe un objectif mesurable : réduire de 30 % le temps de traitement. Ce n'est pas une tâche, c'est un but. »

ANIMATION —
→ beat 1 : SOUS-OBJECTIFS. « Trois chantiers : trier, régler seul les accès simples, préparer les cas complexes. Environ 35 % des billets touchent les mots de passe et les accès : c'est là qu'est le gros du gain. »
→ beat 2 : TÂCHES. « Chaque sous-objectif devient des tâches concrètes : vérifier l'identité, réinitialiser, résumer l'historique… »
→ beat 3 : OUTILS. « Chaque tâche s'appuie sur un outil. Pas d'outil, pas d'action. »
→ beat 4 : « Votre travail, c'est le haut de l'arbre et les limites. Celui de l'agent, c'est le bas. »

À SOULIGNER — Un objectif flou donne un agent flou : « améliorer le soutien TI » ne se décompose pas ; « −30 % du temps de traitement », oui (module 6).

INTERACTION — « Quel sous-objectif confieriez-vous à un agent dès demain ? » Attendu : les accès simples, volumineux et à faible risque.

TRANSITION — « Pour enchaîner ces tâches, l'agent doit se souvenir de ce qu'il a fait. Parlons mémoire. »`,
  `⏱ 4 min

OBJECTIF — Deuxième notion clé : la mémoire. Distinguer trois horizons et montrer que chacun a une utilité concrète… et un enjeu de confidentialité.

DIRE — « Un LLM, par nature, n'a pas de mémoire : chaque appel repart de zéro. Ce qu'on appelle la mémoire d'un agent, c'est ce que le système lui redonne à lire à chaque tour. »

ANIMATION —
→ beat 1 : COURT TERME. « La fenêtre de contexte : la conversation en cours. "Depuis ce matin" ? L'agent comprend qu'on parle du VPN. Mais la capacité est limitée : les plus vieux messages finissent par sortir. »
→ beat 2 : LONG TERME. « Profil et préférences, conservés d'une session à l'autre, plus la base de connaissances interrogée par RAG. Il ne redemande pas ce qu'il sait déjà. »
→ beat 3 : ÉPISODIQUE. « Le journal de ce qu'il a fait. Troisième panne VPN de la semaine : au lieu de réinitialiser encore, il escalade. Sans cette mémoire, il tournerait en rond. »
→ beat 4 : LA MÉMOIRE, CE SONT DES DONNÉES. « Tout ce qu'on garde, ce sont des renseignements, parfois personnels. Durée de conservation, accès, finalité : la Loi 25 s'applique. »

INTERACTION — « Dans vos outils actuels, laquelle de ces trois mémoires vous manque le plus ? » Souvent : l'épisodique, l'historique des actions.

TRANSITION — « Un objectif, une mémoire… il reste le plus important : la capacité d'agir. »`,
  `⏱ 5 min

OBJECTIF — Troisième notion clé : la capacité d'agir. Démystifier l'appel d'outil : le modèle ne « fait » rien lui-même, il produit une demande structurée que votre système exécute.

DIRE — « La demande : envoyer à l'équipe un résumé des billets TI critiques de la semaine. Regardez ce que l'agent produit réellement : pas une phrase, un petit bloc JSON. »

ANIMATION —
→ beat 1 : APPEL 1. « Il choisit l'outil rechercher_billets et remplit lui-même les paramètres : priorité critique, sept derniers jours. »
→ beat 2 : « Le système exécute la recherche et lui renvoie le résultat : 12 billets. »
→ beat 3 : APPEL 2. « Il décide de résumer ce résultat. »
→ beat 4 : « Résumé prêt. »
→ beat 5 : APPEL 3. « Il envoie le courriel à l'équipe. »
→ beat 6 : « Courriel envoyé, et l'action est journalisée. »
→ beat 7 : QUI FAIT QUOI. « Le modèle demande, votre code exécute. C'est donc là qu'on place permissions, plafonds et validations humaines. »

À SOULIGNER — Personne n'a programmé l'ordre des trois appels : l'agent l'a choisi. C'est ce qui le distingue d'un script.

INTERACTION — « Lequel de ces appels feriez-vous valider par un humain ? » Attendu : l'envoi du courriel, seul effet visible à l'extérieur.

TRANSITION — « Voyons maintenant le raisonnement complet de l'agent, pas à pas : pensée, action, observation. C'est le simulateur ReAct. »`,
];
// @@NOTES-END
