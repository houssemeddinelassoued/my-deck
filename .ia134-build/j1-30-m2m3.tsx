// ═══ Module 2 — Atelier · Identifier un agent ═══════════════════════════════

// ─── M2 divider ─────────────────────────────────────────────────────────────
const M23_Divider2: Page = () => (
  <Section n={2} title="Identifier un agent" sub="De l’irritant du quotidien… à une idée d’agent bien cadrée." dur="≈ 30 min" kind="atelier">
    <SecItem n={1}>Choisir un irritant réel de votre organisation</SecItem>
    <SecItem n={2}>Remplir la carte d’identité de votre agent</SecItem>
    <SecItem n={3}>Vérifier s’il est un bon candidat</SecItem>
    <SecItem n={4}>Partager et recevoir de la rétroaction</SecItem>
  </Section>
);
M23_Divider2.transition = BLOOM;

// ─── M2 · Consignes ─────────────────────────────────────────────────────────
const M23PhaseBar = ({ n, tone, dur, d }: { n: number; tone: Tone; dur: string; d: number }) => (
  <div style={{ position: 'relative', flex: 1, height: 56 }}>
    <div className={A.grow} style={{ position: 'absolute', inset: 0, borderRadius: 12, background: STRONG[tone], ...dl(d) }} />
    <div
      className={A.fade}
      style={{
        position: 'relative',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: '0.06em',
        color: tone === 'yellow' ? C.ink : '#fff',
        ...dl(d + 350),
      }}
    >
      <span>ÉTAPE {n}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="clock" size={26} sw={2.4} /> {dur}
      </span>
    </div>
  </div>
);

const M23PhaseCard = ({
  icon,
  tone,
  who,
  title,
  d,
  children,
}: {
  icon: IconName;
  tone: Tone;
  who: string;
  title: string;
  d: number;
  children: ReactNode;
}) => (
  <div
    className={A.in}
    style={{
      flex: 1,
      boxSizing: 'border-box',
      padding: '28px 30px 30px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: SHADOW,
      ...dl(d),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <IconTile name={icon} tone={tone} size={60} />
      <Eyebrow c={T[tone].fg} size={24}>
        {who}
      </Eyebrow>
    </div>
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M23_Brief: Page = () => (
  <Frame mod={2} kind="atelier">
    <Title>Consignes de l’atelier</Title>
    <Lede>30 minutes pour passer d’un irritant concret à une idée d’agent bien cadrée.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 284, width: 1680, display: 'flex', gap: 30 }}>
      <M23PhaseBar n={1} tone="blue" dur="10 min" d={100} />
      <M23PhaseBar n={2} tone="teal" dur="10 min" d={300} />
      <M23PhaseBar n={3} tone="green" dur="10 min" d={500} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 364, width: 1680, display: 'flex', gap: 30, alignItems: 'stretch' }}>
      <M23PhaseCard icon="user" tone="blue" who="Seul" title="Choisissez un irritant" d={300}>
        Une tâche répétitive qui agace tout le monde. Notez qui la fait, combien de fois par mois et combien de temps elle prend.
      </M23PhaseCard>
      <M23PhaseCard icon="users" tone="teal" who="En duo" title="Remplissez la carte d’identité" d={500}>
        Objectif, utilisateurs, données, outils, limites. Votre voisin joue le gestionnaire sceptique.
      </M23PhaseCard>
      <M23PhaseCard icon="chat" tone="green" who="En groupe" title="2 ou 3 partages" d={700}>
        2 minutes par duo. Le groupe juge avec la grille : bon candidat… ou pas encore ?
      </M23PhaseCard>
    </div>
    <Timer
      id="m23-atelier"
      minutes={20}
      label="Étapes 1 et 2"
      compact
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 768, ...dl(900) }}
    />
    <Callout
      cls={A.in}
      title="En panne d’idée ?"
      tone="blue"
      icon="bulb"
      size={25}
      style={{ position: 'absolute', left: 960, top: 768, width: 840, ...dl(1000) }}
    >
      « Où en est ma commande ? » · « J’ai oublié mon mot de passe » · « Où est la dernière version de la procédure ? »
    </Callout>
  </Frame>
);

// ─── M2 · Carte d'identité (exemple Boréal) ─────────────────────────────────
const M23Rubric = ({
  icon,
  tone,
  label,
  n,
  d = 0,
  children,
}: {
  icon: IconName;
  tone: Tone;
  label: string;
  n: number;
  d?: number;
  children: ReactNode;
}) => (
  <div
    className={b.on(n)}
    style={{
      boxSizing: 'border-box',
      display: 'flex',
      gap: 18,
      alignItems: 'flex-start',
      padding: '18px 22px',
      background: C.card,
      borderRadius: 16,
      boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`,
      ...dl(d),
    }}
  >
    <IconTile name={icon} tone={tone} size={52} />
    <div style={{ flex: 1 }}>
      <Eyebrow c={T[tone].fg} size={20}>
        {label}
      </Eyebrow>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.36, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M23AutoSq = ({ l, on, d }: { l: number; on: boolean; d: number }) => (
  <div
    className={A.pop}
    style={{
      width: 52,
      height: 44,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: display,
      fontWeight: 700,
      fontSize: 22,
      background: on ? C.blue : C.panel,
      color: on ? '#fff' : C.faint,
      ...dl(d),
    }}
  >
    L{l}
  </div>
);

const M23_IdCard: Page = () => (
  <Frame mod={2} kind="atelier" beats={4}>
    <Title>Carte d’identité d’un agent · exemple Boréal</Title>
    <Lede>L’agent « Aide-accès TI » traite les mots de passe oubliés et les demandes d’accès.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 30, alignItems: 'stretch' }}>
      <div
        className={A.left}
        style={{
          flex: 'none',
          width: 470,
          boxSizing: 'border-box',
          position: 'relative',
          background: C.card,
          borderRadius: 'var(--osd-radius)',
          boxShadow: SHADOW,
          overflow: 'hidden',
          padding: '0 32px 30px',
        }}
      >
        <div style={{ margin: '0 -32px', height: 112, background: G.blue, padding: '22px 32px 0', boxSizing: 'border-box' }}>
          <Eyebrow c="#fff" size={22}>
            Carte d’identité · agent
          </Eyebrow>
          <div style={{ marginTop: 2, fontSize: 20, color: 'rgba(255,255,255,.85)' }}>Boréal Distribution · Soutien TI</div>
        </div>
        <div
          style={{
            marginTop: -44,
            marginLeft: 'auto',
            width: 104,
            height: 104,
            borderRadius: 22,
            background: C.card,
            boxShadow: `0 0 0 5px #fff, ${SHADOW}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="bot" size={64} color={C.blue} sw={1.8} />
        </div>
        <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 48, lineHeight: 1.05, color: C.ink }}>Aide-accès TI</div>
        <div style={{ marginTop: 4, fontSize: 22, color: C.muted }}>Agent multi-outils, canal Teams et portail TI</div>
        <div style={{ marginTop: 22, height: 2, background: C.rule }} />
        <Eyebrow c={C.muted} size={20} style={{ marginTop: 20 }}>
          Volume ciblé
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: C.blue }}>
            ≈ <CountUp to={630} delay={400} />
          </span>
          <span style={{ fontSize: 24, fontWeight: 600, color: C.soft }}>billets / mois</span>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.35, color: C.muted }}>≈ 35 % des 1 800 billets TI mensuels</div>
        <Eyebrow c={C.muted} size={20} style={{ marginTop: 22 }}>
          Niveau d’autonomie visé
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <M23AutoSq l={0} on d={500} />
          <M23AutoSq l={1} on d={580} />
          <M23AutoSq l={2} on d={660} />
          <M23AutoSq l={3} on d={740} />
          <M23AutoSq l={4} on={false} d={820} />
          <M23AutoSq l={5} on={false} d={900} />
        </div>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.35, color: C.soft }}>Agit seul dans un cadre strict, l’humain gère les exceptions</div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <M23Rubric n={1} icon="target" tone="blue" label="Objectif">
          Régler en moins de 5 min les mots de passe oubliés et les accès courants
        </M23Rubric>
        <M23Rubric n={1} d={150} icon="users" tone="blue" label="Utilisateurs">
          Les 1 200 employés, via Teams ou le portail du soutien TI
        </M23Rubric>
        <M23Rubric n={2} icon="bolt" tone="teal" label="Déclencheur">
          Un nouveau billet ou un message « J’ai oublié mon mot de passe »
        </M23Rubric>
        <M23Rubric n={2} d={150} icon="database" tone="teal" label="Données">
          Annuaire des employés, catalogue des accès, historique des billets
        </M23Rubric>
        <M23Rubric n={3} icon="tool" tone="violet" label="Outils">
          Vérifier l’identité (MFA) · réinitialiser · mettre à jour le billet
        </M23Rubric>
        <M23Rubric n={3} d={150} icon="shieldCheck" tone="violet" label="Actions permises / interdites">
          <span style={{ color: T.green.fg, fontWeight: 600 }}>✓</span> Réinitialiser après MFA
          <br />
          <span style={{ color: T.coral.fg, fontWeight: 600 }}>✗</span> Droits admin, suppression de comptes
        </M23Rubric>
        <M23Rubric n={4} icon="humanCheck" tone="coral" label="Escalade">
          Échec du MFA ou accès sensible (paie, finance) : technicien + résumé
        </M23Rubric>
        <M23Rubric n={4} d={150} icon="gauge" tone="green" label="Mesure de succès">
          ≥ 60 % résolus sans humain · délai moyen &lt; 5 min · 0 incident
        </M23Rubric>
      </div>
    </div>
  </Frame>
);

// ─── M2 · Est-ce un bon candidat ? ──────────────────────────────────────────
const M23_Candidate: Page = () => (
  <Frame mod={2} kind="atelier">
    <Title>Est-ce un bon candidat ?</Title>
    <Lede>Cochez les critères que respecte votre idée d’agent : le score se calcule en direct.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1040, display: 'flex', flexDirection: 'column', gap: 10, ...dl(100) }}>
      <CheckItem id="m23-c1" w={3} size={26}>
        Tâche répétitive et volumineuse (des centaines de fois par mois)
      </CheckItem>
      <CheckItem id="m23-c2" w={3} size={26}>
        Erreur récupérable : on peut corriger ou annuler sans dégât
      </CheckItem>
      <CheckItem id="m23-c3" w={2} size={26}>
        Données accessibles : API, base de données, documents numériques
      </CheckItem>
      <CheckItem id="m23-c4" w={2} size={26}>
        Règles claires, déjà écrites ou faciles à écrire
      </CheckItem>
      <CheckItem id="m23-c5" w={2} size={26}>
        Gain mesurable : temps, délai de réponse, qualité
      </CheckItem>
      <CheckItem id="m23-c6" w={2} size={26}>
        Un parrain métier prêt à porter le projet
      </CheckItem>
      <CheckItem id="m23-c7" w={1} size={26}>
        Entrées en langage naturel : courriels, demandes, documents
      </CheckItem>
      <CheckItem id="m23-c8" w={1} size={26}>
        Peu de renseignements personnels, ou bien encadrés (Loi 25)
      </CheckItem>
      <div style={{ position: 'absolute', left: 1100, top: 0, width: 580 }}>
        <CheckScore
          max={16}
          label="Score du candidat"
          levels={[
            { min: 0, text: 'À retravailler : changez d’irritant ou réduisez le périmètre', tone: 'coral' },
            { min: 7, text: 'Prometteur : renforcez les critères manquants avant de prototyper', tone: 'yellow' },
            { min: 12, text: 'Excellent candidat : un quick win en vue !', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
    <Hint cls={A.in} style={{ position: 'absolute', left: 120, top: 856, ...dl(300) }}>
      Cliquez les critères respectés · ×3, ×2 = poids du critère
    </Hint>
    <Callout
      cls={A.in}
      title="Exemple Boréal"
      tone="blue"
      icon="bot"
      size={25}
      style={{ position: 'absolute', left: 1220, top: 640, width: 580, ...dl(500) }}
    >
      Aide-accès TI : 15 / 16. Seul bémol, les comptes d’accès sont des données sensibles.
    </Callout>
    <Callout
      cls={A.in}
      title="Signal d’alarme"
      tone="coral"
      icon="alert"
      size={25}
      style={{ position: 'absolute', left: 1220, top: 800, width: 580, ...dl(650) }}
    >
      Erreur irréversible et aucun humain dans la boucle ? Revoyez le périmètre.
    </Callout>
  </Frame>
);

// ═══ Module 3 — Les types d'agents ══════════════════════════════════════════

// ─── M3 divider ─────────────────────────────────────────────────────────────
const M23_Divider3: Page = () => (
  <Section n={3} title="Les types d’agents" sub="Du simple clavardage aux équipes d’agents : choisir la bonne architecture." dur="≈ 1 h 15">
    <SecItem n={1}>La carte des familles d’agents</SecItem>
    <SecItem n={2}>Conversationnels, autonomes, multi-outils, orchestrateurs</SecItem>
    <SecItem n={3}>Le pipeline RAG, pas à pas</SecItem>
    <SecItem n={4}>Les 5 patrons d’Anthropic</SecItem>
    <SecItem n={5}>Exercice et QCM : quel type pour quel besoin ?</SecItem>
  </Section>
);
M23_Divider3.transition = BLOOM;

// ─── M3 · Carte des familles ────────────────────────────────────────────────
const M23FamBubble = ({
  n,
  x,
  y,
  s,
  tone,
  icon,
  name,
  lvl,
}: {
  n: number;
  x: number;
  y: number;
  s: number;
  tone: Tone;
  icon: IconName;
  name: ReactNode;
  lvl: string;
}) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s }}>
    <div
      className={A.float}
      style={{
        width: s,
        height: s,
        borderRadius: '50%',
        boxSizing: 'border-box',
        background: T[tone].bg,
        border: `4px solid ${STRONG[tone]}`,
        boxShadow: SHADOW_SM,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 14,
        ...dl(n * 300),
      }}
    >
      <Icon name={icon} size={40} color={T[tone].fg} />
      <div style={{ marginTop: 4, fontFamily: display, fontWeight: 700, fontSize: 24, lineHeight: 1.08, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 4, fontSize: 20, fontWeight: 600, color: T[tone].fg }}>{lvl}</div>
    </div>
  </div>
);

const M23FamRow = ({ n, tone, name, children }: { n: number; tone: Tone; name: string; children: ReactNode }) => (
  <div
    className={b.on(n)}
    style={{
      display: 'flex',
      gap: 18,
      alignItems: 'flex-start',
      padding: '16px 22px',
      background: C.card,
      borderRadius: 16,
      boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`,
    }}
  >
    <Num n={n} tone={tone} size={40} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 27, lineHeight: 1.15, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M23_Families: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>La carte des familles d’agents</Title>
    <Lede>Deux questions suffisent pour situer un agent : agit-il seul ? Est-il branché à vos systèmes ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1080, height: 700 }}>
      <svg width={1080} height={700} viewBox="0 0 1080 700" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <rect className={A.fade} x={90} y={20} width={970} height={590} rx={18} fill={C.panel} />
        <path
          className={A.march}
          d="M130 580 L1030 50"
          fill="none"
          stroke={C.faint}
          strokeWidth={3}
          strokeDasharray="10 14"
          opacity={0.6}
        />
        <Arrow x1={90} y1={610} x2={1062} y2={610} color={C.muted} w={4} />
        <Arrow x1={90} y1={610} x2={90} y2={10} color={C.muted} w={4} />
      </svg>
      <div className={A.fade} style={{ position: 'absolute', left: 90, top: 626, width: 970, display: 'flex', justifyContent: 'space-between', ...dl(200) }}>
        <span style={{ fontSize: 22, color: C.muted }}>Répond quand on lui parle</span>
        <Eyebrow c={C.ink} size={24}>
          Autonomie →
        </Eyebrow>
        <span style={{ fontSize: 22, color: C.muted }}>Poursuit seul un objectif</span>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 0, top: 20, width: 60, height: 590, ...dl(200) }}>
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 295,
            width: 560,
            marginLeft: -280,
            marginTop: -16,
            textAlign: 'center',
            transform: 'rotate(-90deg)',
            fontFamily: display,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.ink,
          }}
        >
          Intégration aux systèmes →
        </div>
      </div>
      <M23FamBubble n={1} x={240} y={480} s={196} tone="blue" icon="chat" name="Conversa­tionnels" lvl="L1" />
      <M23FamBubble n={2} x={450} y={330} s={196} tone="teal" icon="book" name="Assistants RAG" lvl="L1–L2" />
      <M23FamBubble n={3} x={690} y={190} s={200} tone="violet" icon="plug" name="Multi-outils" lvl="L2–L3" />
      <M23FamBubble n={4} x={910} y={420} s={196} tone="coral" icon="loop" name="Autonomes" lvl="L3–L4" />
      <M23FamBubble n={5} x={920} y={130} s={200} tone="yellow" icon="org" name="Multi-agents" lvl="L3–L5" />
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M23FamRow n={1} tone="blue" name="Conversationnels">
        Répondent aux questions, sans toucher aux systèmes
      </M23FamRow>
      <M23FamRow n={2} tone="teal" name="Assistants RAG">
        Répondent à partir de vos documents, avec sources
      </M23FamRow>
      <M23FamRow n={3} tone="violet" name="Multi-outils">
        Agissent dans l’ERP, le CRM, le courriel…
      </M23FamRow>
      <M23FamRow n={4} tone="coral" name="Autonomes">
        Bouclent seuls vers un objectif, sur la durée
      </M23FamRow>
      <M23FamRow n={5} tone="yellow" name="Orchestrateurs multi-agents">
        Un superviseur répartit le travail entre spécialistes
      </M23FamRow>
    </div>
    <div
      className={b.on(5)}
      style={{
        position: 'absolute',
        left: 1240,
        top: 890,
        width: 560,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontSize: 22,
        lineHeight: 1.3,
        color: C.soft,
        ...dl(400),
      }}
    >
      <Icon name="trend" size={34} color={C.coral} />
      <span>
        Vers le haut à droite : <Strong c={C.coral}>valeur, coût et risque</Strong> augmentent ensemble.
      </span>
    </div>
  </Frame>
);

// ─── M3 · Agents conversationnels ───────────────────────────────────────────
const M23ProCon = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 25, lineHeight: 1.36, color: C.ink }}>
    <span
      style={{
        flex: 'none',
        marginTop: 3,
        width: 30,
        height: 30,
        borderRadius: 8,
        background: ok ? T.green.bg : T.coral.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={ok ? 'check' : 'x'} size={20} sw={3} color={ok ? T.green.fg : T.coral.fg} />
    </span>
    <span>{children}</span>
  </div>
);

const M23_Conversational: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Agents conversationnels</Title>
    <Lede>FAQ, soutien, accueil des nouveaux : ils répondent 24 h sur 24, sans agir dans vos systèmes.</Lede>
    <div
      className={A.left}
      style={{
        position: 'absolute',
        left: 120,
        top: 280,
        width: 900,
        height: 680,
        boxSizing: 'border-box',
        background: C.panel,
        borderRadius: 'var(--osd-radius)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 28px',
          background: C.card,
          boxShadow: SHADOW_SM,
        }}
      >
        <span className={A.blink} style={{ width: 14, height: 14, borderRadius: '50%', background: C.green }} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.ink }}>Clavardage RH · Boréal</span>
        <span style={{ marginLeft: 'auto', fontSize: 20, color: C.muted }}>≈ 300 demandes RH / mois</span>
      </div>
      <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Bubble who="user" size={24} w={600} cls={A.in} style={dl(300)}>
          Combien de jours de vacances après 3 ans chez Boréal ?
        </Bubble>
        <Bubble who="agent" name="Agent RH" size={24} w={640} cls={A.in} style={dl(1100)}>
          Après 3 ans de service : 15 jours ouvrables par année.
          <div style={{ marginTop: 6, fontSize: 20, color: C.muted }}>Source : Guide de l’employé, section 4.2</div>
        </Bubble>
        <Bubble who="user" size={24} w={600} cls={A.in} style={dl(1900)}>
          Parfait ! Inscris-moi en congé du 21 au 25 juillet.
        </Bubble>
        <Bubble who="agent" name="Agent RH" size={24} w={640} cls={A.in} style={dl(2700)}>
          Je ne peux pas modifier votre dossier. Voici le formulaire de demande de congé, à faire approuver par votre gestionnaire.
        </Bubble>
      </div>
    </div>
    <Card
      cls={b.on(1)}
      tone="green"
      icon="check"
      title="Forces"
      pad={28}
      style={{ position: 'absolute', left: 1070, top: 280, width: 730, gap: 0 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M23ProCon ok>Rapides à déployer : quelques semaines</M23ProCon>
        <M23ProCon ok>Absorbent les questions répétitives, 24 h sur 24</M23ProCon>
        <M23ProCon ok>Risque faible : ils ne modifient aucune donnée</M23ProCon>
      </div>
    </Card>
    <Card
      cls={b.on(2)}
      tone="coral"
      icon="alert"
      title="Limites"
      pad={28}
      style={{ position: 'absolute', left: 1070, top: 590, width: 730, gap: 0 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M23ProCon ok={false}>N’agissent pas : l’employé doit encore faire la démarche</M23ProCon>
        <M23ProCon ok={false}>Hallucinent sans base documentaire fiable</M23ProCon>
        <M23ProCon ok={false}>Réponse engageante = responsabilité (Air Canada, 2024)</M23ProCon>
      </div>
    </Card>
  </Frame>
);

// ─── M3 · Agents autonomes ──────────────────────────────────────────────────
const M23LoopNode = ({
  x,
  y,
  tone,
  icon,
  title,
  sub,
  d,
}: {
  x: number;
  y: number;
  tone: Tone;
  icon: IconName;
  title: string;
  sub: string;
  d: number;
}) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 130, top: y - 50, width: 260, ...dl(d) }}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 18px',
        background: C.card,
        borderRadius: 18,
        boxShadow: `${SHADOW}, inset 0 -5px 0 ${STRONG[tone]}`,
      }}
    >
      <IconTile name={icon} tone={tone} size={54} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.1, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 20, lineHeight: 1.25, color: C.muted }}>{sub}</div>
      </div>
    </div>
  </div>
);

const M23Guard = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div
    className={b.on(n)}
    style={{
      display: 'flex',
      gap: 18,
      alignItems: 'center',
      padding: '16px 22px',
      background: C.card,
      borderRadius: 16,
      boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${C.coral}`,
    }}
  >
    <IconTile name={icon} tone="coral" size={56} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.12, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M23_Autonomous: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Agents autonomes</Title>
    <Lede>Ils reçoivent un objectif, puis choisissent seuls leurs étapes, en boucle, jusqu’au résultat.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 720, height: 680 }}>
      <svg width={720} height={680} viewBox="0 0 720 680" style={{ position: 'absolute', inset: 0 }}>
        <circle className={A.fade} cx={360} cy={340} r={250} fill="none" stroke={C.rule} strokeWidth={14} />
        <circle
          className={A.march}
          cx={360}
          cy={340}
          r={250}
          fill="none"
          stroke={C.blue}
          strokeWidth={4}
          strokeDasharray="10 14"
          opacity={0.5}
        />
        <FlowDot path="M360 90 A250 250 0 1 1 359.9 90" dur={6} r={11} color={C.blue} />
        <FlowDot path="M360 90 A250 250 0 1 1 359.9 90" dur={6} begin={3} r={8} color={C.teal} />
      </svg>
      <div
        className={A.pop}
        style={{
          position: 'absolute',
          left: 262,
          top: 220,
          width: 196,
          height: 240,
          boxSizing: 'border-box',
          borderRadius: 24,
          background: G.blue,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 18,
          boxShadow: SHADOW,
          ...dl(200),
        }}
      >
        <Icon name="target" size={44} color="#fff" />
        <div style={{ marginTop: 6, fontSize: 20, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>Objectif</div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, lineHeight: 1.15 }}>Repérer les fournisseurs à risque</div>
      </div>
      <M23LoopNode x={360} y={90} tone="blue" icon="map" title="Planifier" sub="Qui vérifier ce soir ?" d={500} />
      <M23LoopNode x={600} y={340} tone="violet" icon="search" title="Agir" sub="Actualités, ERP, retards" d={700} />
      <M23LoopNode x={360} y={590} tone="teal" icon="eye" title="Observer" sub="Faillite ? Rappel ? Retard ?" d={900} />
      <M23LoopNode x={120} y={340} tone="green" icon="check" title="Évaluer" sub="Objectif atteint ?" d={1100} />
    </div>
    <div style={{ position: 'absolute', left: 900, top: 280, width: 900, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card cls={b.on(1)} tone="blue" icon="bulb" title="Quand les utiliser ?" pad={26} size={24}>
        Tâches longues et ouvertes, dont le chemin n’est pas connu d’avance. Exemple Boréal : la veille nocturne de 300 fournisseurs, avec
        un rapport prêt à 7 h.
      </Card>
      <Eyebrow c={C.coral} size={24} cls={b.fade(2)} style={{ marginTop: 6 }}>
        Trois garde-fous obligatoires
      </Eyebrow>
      <M23Guard n={2} icon="money" title="Un budget">
        Plafond de coût par exécution : au-delà, l’agent s’arrête
      </M23Guard>
      <M23Guard n={3} icon="loop" title="Un plafond d’étapes">
        25 tours maximum : on évite la boucle infinie
      </M23Guard>
      <M23Guard n={4} icon="humanCheck" title="Un point de contrôle humain">
        Avant toute action engageante : courriel au fournisseur, commande
      </M23Guard>
    </div>
  </Frame>
);

// ─── M3 · Agents multi-outils ───────────────────────────────────────────────
const M23ToolNode = ({
  x,
  y,
  n,
  tone,
  icon,
  name,
  d,
}: {
  x: number;
  y: number;
  n: number;
  tone: Tone;
  icon: IconName;
  name: string;
  d: number;
}) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 110, top: y - 62, width: 220, ...dl(d) }}>
    <div
      className={b.hi(n)}
      style={{
        boxSizing: 'border-box',
        height: 124,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: C.card,
        borderRadius: 18,
        boxShadow: SHADOW,
      }}
    >
      <IconTile name={icon} tone={tone} size={56} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 25, lineHeight: 1.05, color: C.ink, textAlign: 'center' }}>{name}</div>
    </div>
  </div>
);

const M23ToolLink = ({ n, x, y, color }: { n: number; x: number; y: number; color: string }) => (
  <g>
    <path className={A.march} d={`M500 360 L${x} ${y}`} stroke={C.faint} strokeWidth={3} strokeDasharray="10 14" fill="none" />
    <path className={b.draw(n)} d={`M500 360 L${x} ${y}`} pathLength={1} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
    <FlowDot path={`M500 360 L${x} ${y}`} dur={2.2} begin={n * 0.35} r={8} color={color} />
  </g>
);

const M23Step = ({ n, tool, tone, children }: { n: number; tool: string; tone: Tone; children: ReactNode }) => (
  <div
    className={b.on(n)}
    style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 20px', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM }}
  >
    <Num n={n} tone={tone} size={40} />
    <div style={{ flex: 1 }}>
      <Tag tone={tone} size={20}>
        {tool}
      </Tag>
      <div style={{ marginTop: 6, fontSize: 24, lineHeight: 1.3, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M23_MultiTool: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Agents multi-outils</Title>
    <Lede>Un seul agent, branché à vos systèmes, enchaîne les appels d’outils pour régler une demande.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1000, height: 700 }}>
      <svg width={1000} height={700} viewBox="0 0 1000 700" style={{ position: 'absolute', inset: 0 }}>
        <M23ToolLink n={1} x={500} y={90} color={C.blue} />
        <M23ToolLink n={2} x={850} y={280} color={C.violet} />
        <M23ToolLink n={3} x={720} y={590} color={C.teal} />
        <M23ToolLink n={4} x={280} y={590} color={C.green} />
        <M23ToolLink n={5} x={150} y={280} color={C.amber} />
      </svg>
      <div
        className={A.pop}
        style={{
          position: 'absolute',
          left: 400,
          top: 270,
          width: 200,
          height: 180,
          boxSizing: 'border-box',
          borderRadius: 26,
          background: G.blue,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          boxShadow: SHADOW,
        }}
      >
        <Icon name="bot" size={64} color="#fff" sw={1.8} />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 26, lineHeight: 1.1, textAlign: 'center' }}>Agent service client</div>
      </div>
      <M23ToolNode n={1} x={500} y={90} tone="blue" icon="users" name="CRM" d={300} />
      <M23ToolNode n={2} x={850} y={280} tone="violet" icon="database" name="ERP" d={450} />
      <M23ToolNode n={3} x={720} y={590} tone="teal" icon="book" name="Base de connaissances" d={600} />
      <M23ToolNode n={4} x={280} y={590} tone="green" icon="mail" name="Courriel" d={750} />
      <M23ToolNode n={5} x={150} y={280} tone="yellow" icon="calendar" name="Calendrier" d={900} />
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 280, width: 620, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={A.fade} style={{ fontSize: 24, lineHeight: 1.3, color: C.soft, marginBottom: 4, ...dl(400) }}>
        Courriel reçu : <Strong>« Où est ma commande 48213 ? »</Strong>
      </div>
      <M23Step n={1} tool="CRM" tone="blue">
        Identifier le client et son historique
      </M23Step>
      <M23Step n={2} tool="ERP" tone="violet">
        Commande retardée de 3 jours au centre de Laval
      </M23Step>
      <M23Step n={3} tool="Base de connaissances" tone="teal">
        Politique : livraison gratuite sur la prochaine commande
      </M23Step>
      <M23Step n={4} tool="Courriel" tone="green">
        Rédiger la réponse… validée par un humain
      </M23Step>
      <M23Step n={5} tool="Calendrier" tone="yellow">
        Planifier un suivi le jour de la livraison
      </M23Step>
    </div>
  </Frame>
);

// ─── M3 · Orchestrateurs / multi-agents ─────────────────────────────────────
const M23Spec = ({ x, tone, icon, name, sub, d }: { x: number; tone: Tone; icon: IconName; name: string; sub: string; d: number }) => (
  <div className={A.in} style={{ position: 'absolute', left: x - 135, top: 400, width: 270, ...dl(d) }}>
    <div
      style={{
        boxSizing: 'border-box',
        padding: '20px 20px 22px',
        background: C.card,
        borderRadius: 20,
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <IconTile name={icon} tone={tone} size={60} />
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.3, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M23Cost = ({ n, big, tone, children }: { n: number; big: string; tone: Tone; children: ReactNode }) => (
  <div
    className={b.on(n)}
    style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '16px 24px', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM }}
  >
    <div style={{ flex: 'none', width: 196, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1, color: T[tone].fg }}>{big}</div>
    <div style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</div>
  </div>
);

const M23_Orchestrator: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Orchestrateurs et systèmes multi-agents</Title>
    <Lede>Un superviseur découpe la tâche et la confie à des agents spécialisés, puis assemble le résultat.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 980, height: 690 }}>
      <svg width={980} height={690} viewBox="0 0 980 690" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Arrow x1={400} y1={140} x2={160} y2={392} color={C.blue} w={4} n={1} curve={-30} />
        <Arrow x1={490} y1={140} x2={490} y2={392} color={C.blue} w={4} n={1} d={150} />
        <Arrow x1={580} y1={140} x2={820} y2={392} color={C.blue} w={4} n={1} d={300} curve={30} />
        <g className={b.fade(1)}>
          <FlowDot path="M400 140 L160 400" dur={2.4} r={8} color={C.blue} />
          <FlowDot path="M490 140 L490 400" dur={2.4} begin={0.5} r={8} color={C.blue} />
          <FlowDot path="M580 140 L820 400" dur={2.4} begin={1} r={8} color={C.blue} />
        </g>
        <Arrow x1={624} y1={470} x2={682} y2={470} color={C.coral} w={4} n={2} head={14} />
        <Arrow x1={682} y1={530} x2={624} y2={530} color={C.coral} w={4} n={2} d={300} head={14} />
        <g className={b.fade(3)}>
          <FlowDot path="M160 400 L400 140" dur={2.4} r={8} color={C.green} />
          <FlowDot path="M490 400 L490 140" dur={2.4} begin={0.6} r={8} color={C.green} />
          <FlowDot path="M820 400 L580 140" dur={2.4} begin={1.2} r={8} color={C.green} />
        </g>
      </svg>
      <div
        className={A.pop}
        style={{
          position: 'absolute',
          left: 290,
          top: 0,
          width: 400,
          height: 140,
          boxSizing: 'border-box',
          borderRadius: 24,
          background: G.blue,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 26px',
          boxShadow: SHADOW,
        }}
      >
        <Icon name="org" size={60} color="#fff" sw={1.8} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1 }}>Superviseur</div>
          <div style={{ fontSize: 21, lineHeight: 1.3, opacity: 0.9 }}>Planifie, délègue, assemble</div>
        </div>
      </div>
      <div className={b.fade(1)} style={{ position: 'absolute', left: 520, top: 230, fontSize: 21, fontWeight: 600, color: C.blue }}>
        délègue
      </div>
      <M23Spec x={150} tone="teal" icon="search" name="Recherche" sub="Fouille les 40 000 documents" d={300} />
      <M23Spec x={490} tone="violet" icon="note" name="Rédacteur" sub="Rédige chaque section" d={450} />
      <M23Spec x={830} tone="coral" icon="shieldCheck" name="Vérificateur" sub="Contrôle prix et conformité" d={600} />
      <div className={b.on(2)} style={{ position: 'absolute', left: 520, top: 640, width: 400, textAlign: 'center' }}>
        <Tag tone="coral" size={21}>
          Boucle de révision
        </Tag>
      </div>
      <div
        className={b.on(3)}
        style={{
          position: 'absolute',
          left: 0,
          top: 640,
          width: 470,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 22,
          lineHeight: 1.3,
          color: C.soft,
        }}
      >
        <Icon name="humanCheck" size={34} color={C.green} />
        <span>Dossier assemblé, puis révisé par un humain</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 280, width: 640, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.coral} size={24} cls={b.fade(4)}>
        Le prix de la coordination
      </Eyebrow>
      <M23Cost n={4} big="≈ 15×" tone="coral">
        plus de jetons qu’un simple clavardage (Anthropic, 2025)
      </M23Cost>
      <M23Cost n={4} big="+ pannes" tone="coral">
        Chaque passage de relais peut perdre ou déformer l’information
      </M23Cost>
      <M23Cost n={4} big="Débogage" tone="coral">
        Qui s’est trompé ? Il faut tracer chaque agent
      </M23Cost>
      <Callout cls={b.on(5)} title="Règle pratique" tone="yellow" icon="bulb" size={24} style={{ marginTop: 8 }}>
        Commencez avec un seul agent. Passez au multi-agents seulement si la tâche se découpe en morceaux vraiment indépendants.
      </Callout>
    </div>
  </Frame>
);

// ─── M3 · Pipeline RAG ──────────────────────────────────────────────────────
const M23RagStep = ({ n, tone, icon, title, children }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode }) => (
  <div
    className={b.on(n)}
    style={{
      flex: 1,
      boxSizing: 'border-box',
      padding: '20px 20px 22px',
      background: C.card,
      borderRadius: 18,
      boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={56} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: C.rule }}>{n}</span>
    </div>
    <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 27, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const M23Chunk = ({ src, score, d }: { src: string; score: string; d: number }) => (
  <div
    className={b.left(7)}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 18px',
      background: C.card,
      borderRadius: 12,
      boxShadow: SHADOW_SM,
      ...dl(d),
    }}
  >
    <Icon name="doc" size={28} color={C.teal} />
    <span style={{ flex: 1, fontSize: 22, color: C.ink }}>{src}</span>
    <span style={{ fontFamily: mono, fontSize: 21, fontWeight: 600, color: T.teal.fg }}>{score}</span>
  </div>
);

const M23_Rag: Page = () => (
  <Frame mod={3} beats={8}>
    <Title>Le pipeline RAG, pas à pas</Title>
    <Lede>RAG : chercher les bons extraits dans vos documents, puis les donner au modèle pour répondre.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 268, width: 1108, ...dl(100) }}>
      <div style={{ height: 4, background: C.teal, borderRadius: 2 }} />
      <Eyebrow c={T.teal.fg} size={20} style={{ marginTop: 6 }}>
        Indexation · une fois, puis à chaque mise à jour
      </Eyebrow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1264, top: 268, width: 536, ...dl(200) }}>
      <div style={{ height: 4, background: C.blue, borderRadius: 2 }} />
      <Eyebrow c={C.blue} size={20} style={{ marginTop: 6 }}>
        À chaque question
      </Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 320, width: 1680, display: 'flex', gap: 36, alignItems: 'stretch' }}>
      <M23RagStep n={1} tone="teal" icon="archive" title="Ingestion">
        SharePoint, Google Drive, vieux wiki
      </M23RagStep>
      <M23RagStep n={2} tone="teal" icon="layers" title="Découpage">
        Des extraits de quelques paragraphes
      </M23RagStep>
      <M23RagStep n={3} tone="teal" icon="cpu" title="Plongements">
        Chaque extrait devient un vecteur de sens
      </M23RagStep>
      <M23RagStep n={4} tone="teal" icon="database" title="Base vectorielle">
        Indexe les vecteurs pour la recherche
      </M23RagStep>
      <M23RagStep n={5} tone="blue" icon="search" title="Récupération">
        Les 3 à 5 extraits les plus proches
      </M23RagStep>
      <M23RagStep n={6} tone="blue" icon="sparkles" title="Génération">
        Réponse rédigée, avec citations
      </M23RagStep>
    </div>
    <svg width={1680} height={40} viewBox="0 0 1680 40" style={{ position: 'absolute', left: 120, top: 588 }}>
      <path className={A.march} d="M125 20 L1555 20" stroke={C.faint} strokeWidth={3} strokeDasharray="10 14" fill="none" />
      <circle cx={125} cy={20} r={8} fill={C.teal} />
      <circle cx={411} cy={20} r={8} fill={C.teal} />
      <circle cx={697} cy={20} r={8} fill={C.teal} />
      <circle cx={983} cy={20} r={8} fill={C.teal} />
      <circle cx={1269} cy={20} r={8} fill={C.blue} />
      <circle cx={1555} cy={20} r={8} fill={C.blue} />
      <FlowDot path="M125 20 L1555 20" dur={6} r={12} color={C.amber} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 652, width: 440 }}>
      <Eyebrow c={C.muted} size={20} cls={b.fade(7)}>
        Question d’un employé
      </Eyebrow>
      <Bubble who="user" size={24} w={360} cls={b.on(7)} style={{ marginTop: 10 }}>
        Quel est le délai de retour pour un client B2B ?
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 600, top: 652, width: 560, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Eyebrow c={C.muted} size={20} cls={b.fade(7)}>
        Extraits récupérés · similarité
      </Eyebrow>
      <M23Chunk src="Politique retours B2B, v3 · p. 2" score="0,91" d={0} />
      <M23Chunk src="Conditions générales 2026 · § 8" score="0,87" d={150} />
      <M23Chunk src="FAQ service client · retours" score="0,79" d={300} />
    </div>
    <div style={{ position: 'absolute', left: 1200, top: 652, width: 600 }}>
      <Eyebrow c={C.muted} size={20} cls={b.fade(8)}>
        Réponse générée
      </Eyebrow>
      <Bubble who="agent" name="Assistant documentaire" size={24} w={520} cls={b.on(8)} style={{ marginTop: 10 }}>
        30 jours après la livraison, produit non ouvert <Strong c={C.blue}>[1]</Strong>. Au-delà, frais de 15 %{' '}
        <Strong c={C.blue}>[2]</Strong>.
      </Bubble>
    </div>
  </Frame>
);

// ─── M3 · Les 5 patrons d'Anthropic ─────────────────────────────────────────
const M23PatCard = ({
  n,
  tone,
  name,
  desc,
  ex,
  children,
}: {
  n: number;
  tone: Tone;
  name: string;
  desc: string;
  ex: string;
  children: ReactNode;
}) => (
  <div
    className={b.on(n)}
    style={{
      flex: 1,
      boxSizing: 'border-box',
      padding: '20px 22px 24px',
      background: C.card,
      borderRadius: 20,
      boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
    }}
  >
    <div style={{ height: 150, background: C.panel, borderRadius: 14, marginTop: 6 }}>
      <svg width="100%" height={150} viewBox="0 0 270 150">
        {children}
      </svg>
    </div>
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: STRONG[tone] }}>{n}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.1, color: C.ink }}>{name}</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.35, color: C.soft }}>{desc}</div>
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `2px solid ${C.rule}`, fontSize: 21, lineHeight: 1.35, color: C.ink }}>
      <span style={{ fontWeight: 700, color: T[tone].fg }}>Boréal · </span>
      {ex}
    </div>
  </div>
);

// Mini-diagram node (LLM call) — rx rounded rect.
const M23N = ({ x, y, w = 50, h = 34, c }: { x: number; y: number; w?: number; h?: number; c: string }) => (
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={9} fill={c} />
);
const M23L = ({ d, c = C.faint }: { d: string; c?: string }) => <path d={d} stroke={c} strokeWidth={3} fill="none" strokeLinecap="round" />;

const M23_Patterns: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Les 5 patrons d’Anthropic</Title>
    <Lede>Selon Anthropic (« Building effective agents », déc. 2024), 5 patrons couvrent l’essentiel.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 24, alignItems: 'stretch' }}>
      <M23PatCard n={1} tone="blue" name="Chaînage" desc="Une suite d’étapes fixes, chacune nourrit la suivante." ex="Facture : extraire, valider, saisir dans l’ERP">
        <M23L d="M40 75 L230 75" />
        <M23N x={40} y={75} c={C.blue} />
        <M23N x={135} y={75} c={C.blue} />
        <M23N x={230} y={75} c={C.blue} />
        <FlowDot path="M40 75 L230 75" dur={2.4} r={7} color={C.amber} />
      </M23PatCard>
      <M23PatCard n={2} tone="yellow" name="Routage" desc="Un tri initial envoie chaque demande au bon traitement." ex="Courriel client : commande, plainte ou facture ?">
        <M23L d="M35 75 L110 75 M110 75 L220 30 M110 75 L220 75 M110 75 L220 120" />
        <M23N x={35} y={75} w={40} c={C.faint} />
        <rect x={92} y={57} width={36} height={36} rx={6} fill={C.yellow} transform="rotate(45 110 75)" />
        <M23N x={225} y={30} c={C.blue} />
        <M23N x={225} y={75} c={C.blue} />
        <M23N x={225} y={120} c={C.blue} />
        <FlowDot path="M35 75 L110 75 L220 120" dur={2.4} r={7} color={C.amber} />
      </M23PatCard>
      <M23PatCard n={3} tone="teal" name="Parallélisation" desc="Plusieurs appels simultanés, résultats combinés." ex="Analyser un contrat : prix, délais et clauses en même temps">
        <M23L d="M30 75 L135 30 L240 75 M30 75 L135 75 L240 75 M30 75 L135 120 L240 75" />
        <M23N x={30} y={75} w={36} c={C.faint} />
        <M23N x={135} y={30} c={C.teal} />
        <M23N x={135} y={75} c={C.teal} />
        <M23N x={135} y={120} c={C.teal} />
        <M23N x={240} y={75} w={40} c={C.green} />
        <FlowDot path="M30 75 L135 30 L240 75" dur={2.4} r={6} color={C.amber} />
        <FlowDot path="M30 75 L135 120 L240 75" dur={2.4} r={6} color={C.amber} />
      </M23PatCard>
      <M23PatCard n={4} tone="violet" name="Orchestrateur-exécutants" desc="Un LLM découpe la tâche à la volée et délègue." ex="Appel d’offres : sections confiées à des exécutants">
        <M23L d="M135 32 L50 115 M135 32 L135 115 M135 32 L220 115" />
        <M23N x={135} y={32} w={70} c={C.violet} />
        <M23N x={50} y={115} c={C.blue} />
        <M23N x={135} y={115} c={C.blue} />
        <M23N x={220} y={115} c={C.blue} />
        <FlowDot path="M135 32 L50 115" dur={2} r={6} color={C.amber} />
        <FlowDot path="M135 32 L220 115" dur={2} begin={1} r={6} color={C.amber} />
      </M23PatCard>
      <M23PatCard n={5} tone="green" name="Évaluateur-optimiseur" desc="Un LLM produit, un autre critique, on recommence." ex="Courriel délicat : rédiger, évaluer le ton, réviser">
        <path d="M80 60 C110 15 160 15 190 60" stroke={C.faint} strokeWidth={3} fill="none" />
        <path d="M190 90 C160 135 110 135 80 90" stroke={C.faint} strokeWidth={3} fill="none" />
        <M23N x={70} y={75} w={64} h={40} c={C.blue} />
        <M23N x={200} y={75} w={64} h={40} c={C.green} />
        <FlowDot path="M80 60 C110 15 160 15 190 60 L190 90 C160 135 110 135 80 90 Z" dur={3.2} r={7} color={C.amber} />
      </M23PatCard>
    </div>
    <Callout
      cls={b.on(6)}
      title="Workflows ou agent ?"
      tone="blue"
      icon="route"
      size={25}
      style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}
    >
      Ces patrons sont des <Strong>workflows</Strong> : vous dessinez le chemin. Un <Strong>agent</Strong> choisit lui-même le sien. Conseil
      d’Anthropic : la solution la plus simple qui fonctionne.
    </Callout>
  </Frame>
);

// ─── M3 · Comparatif ────────────────────────────────────────────────────────
const M23Gauge = ({ v, tone, d }: { v: number; tone: Tone; d: number }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    <M23Seg on={v >= 1} tone={tone} d={d} />
    <M23Seg on={v >= 2} tone={tone} d={d + 80} />
    <M23Seg on={v >= 3} tone={tone} d={d + 160} />
    <M23Seg on={v >= 4} tone={tone} d={d + 240} />
    <M23Seg on={v >= 5} tone={tone} d={d + 320} />
  </div>
);
const M23Seg = ({ on, tone, d }: { on: boolean; tone: Tone; d: number }) => (
  <div style={{ width: 34, height: 22, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
    {on ? <div className={A.grow} style={{ width: 34, height: 22, background: STRONG[tone], ...dl(d) }} /> : null}
  </div>
);

const M23Row = ({
  icon,
  tone,
  name,
  a,
  c,
  r,
  d,
  children,
}: {
  icon: IconName;
  tone: Tone;
  name: string;
  a: number;
  c: number;
  r: number;
  d: number;
  children: ReactNode;
}) => (
  <div
    className={A.in}
    style={{
      display: 'grid',
      gridTemplateColumns: '440px 260px 260px 260px 1fr',
      alignItems: 'center',
      height: 104,
      padding: '0 28px',
      boxSizing: 'border-box',
      background: C.card,
      borderRadius: 16,
      boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`,
      ...dl(d),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</span>
    </div>
    <M23Gauge v={a} tone="blue" d={d + 300} />
    <M23Gauge v={c} tone="violet" d={d + 400} />
    <M23Gauge v={r} tone="coral" d={d + 500} />
    <div style={{ fontSize: 23, lineHeight: 1.3, color: C.soft }}>{children}</div>
  </div>
);

const M23_Compare: Page = () => (
  <Frame mod={3}>
    <Title>Comparatif des cinq types</Title>
    <Lede>Plus l’agent est autonome, plus il coûte à construire… et plus il faut l’encadrer.</Lede>
    <div
      className={A.fade}
      style={{
        position: 'absolute',
        left: 120,
        top: 282,
        width: 1680,
        display: 'grid',
        gridTemplateColumns: '440px 260px 260px 260px 1fr',
        padding: '0 28px',
        boxSizing: 'border-box',
      }}
    >
      <Eyebrow c={C.muted} size={21}>
        Type
      </Eyebrow>
      <Eyebrow c={C.blue} size={21}>
        Autonomie
      </Eyebrow>
      <Eyebrow c={C.violet} size={21}>
        Complexité
      </Eyebrow>
      <Eyebrow c={C.coral} size={21}>
        Risque
      </Eyebrow>
      <Eyebrow c={C.muted} size={21}>
        Exemple Boréal
      </Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 326, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M23Row icon="chat" tone="blue" name="Conversationnel" a={1} c={1} r={1} d={100}>
        FAQ RH : 300 demandes / mois
      </M23Row>
      <M23Row icon="book" tone="teal" name="Assistant RAG" a={2} c={2} r={2} d={250}>
        Retrouver une procédure parmi 40 000 documents
      </M23Row>
      <M23Row icon="plug" tone="violet" name="Multi-outils" a={3} c={3} r={3} d={400}>
        Aide-accès TI : ≈ 630 billets / mois
      </M23Row>
      <M23Row icon="loop" tone="coral" name="Autonome" a={4} c={3} r={4} d={550}>
        Veille nocturne des fournisseurs
      </M23Row>
      <M23Row icon="org" tone="yellow" name="Multi-agents" a={4} c={5} r={4} d={700}>
        Réponse aux appels d’offres
      </M23Row>
    </div>
    <div
      className={A.in}
      style={{
        position: 'absolute',
        left: 120,
        top: 910,
        width: 1680,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontSize: 23,
        color: C.soft,
        ...dl(1200),
      }}
    >
      <Icon name="bulb" size={30} color={C.amber} />
      <span>
        Le bon choix est le type <Strong>le moins complexe</Strong> qui règle vraiment le problème.
      </span>
    </div>
  </Frame>
);

// ─── M3 · Exercice : quel type d'agent ? ────────────────────────────────────
const M23Need = ({ n, x, y, dept, tone, need, type, why }: { n: number; x: number; y: number; dept: string; tone: Tone; need: string; type: string; why: string }) => (
  <FlipCard
    w={540}
    h={300}
    flipAt={n}
    tone={tone}
    backTone="green"
    cls={A.in}
    style={{ position: 'absolute', left: x, top: y, ...dl(100 + n * 120) }}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tag tone={tone} size={21}>
            {dept}
          </Tag>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.rule }}>{n}</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 27, lineHeight: 1.32, color: C.ink }}>{need}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={20}>
          Type recommandé
        </Eyebrow>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.ink }}>{type}</div>
        <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.36, color: C.soft }}>{why}</div>
      </>
    }
  />
);

const M23_WhichType: Page = () => (
  <Frame mod={3} kind="exercice" beats={6}>
    <Title>Quel type d’agent pour Boréal ?</Title>
    <Lede>Pour chaque besoin, votez pour un type d’agent, puis retournez la carte.</Lede>
    <M23Need
      n={1}
      x={120}
      y={276}
      dept="Service client"
      tone="blue"
      need="Répondre aux 5 000 courriels mensuels sur le statut des commandes"
      type="Multi-outils"
      why="CRM + ERP + courriel. Réponses validées par un humain au début, puis envoi direct pour les cas simples."
    />
    <M23Need
      n={2}
      x={690}
      y={276}
      dept="Ressources humaines"
      tone="teal"
      need="Répondre aux questions sur les vacances et les avantages sociaux"
      type="Conversationnel + RAG"
      why="Répond à partir du guide de l’employé, avec la source. Ne modifie aucun dossier."
    />
    <M23Need
      n={3}
      x={1260}
      y={276}
      dept="Documentation"
      tone="violet"
      need="Retrouver la bonne procédure parmi 40 000 documents dispersés"
      type="Assistant RAG"
      why="Indexer SharePoint, Drive et le wiki ; citer le document et sa version. Ménage préalable recommandé."
    />
    <M23Need
      n={4}
      x={120}
      y={596}
      dept="Approvisionnement"
      tone="coral"
      need="Surveiller chaque nuit les fournisseurs et signaler les risques"
      type="Autonome"
      why="Boucle longue, chemin variable. Budget, plafond d’étapes et rapport validé avant toute action."
    />
    <M23Need
      n={5}
      x={690}
      y={596}
      dept="Ventes"
      tone="yellow"
      need="Préparer une réponse complète à un appel d’offres de 80 pages"
      type="Orchestrateur multi-agents"
      why="Sections indépendantes : recherche, rédaction, vérification des prix. Révision humaine finale."
    />
    <M23Need
      n={6}
      x={1260}
      y={596}
      dept="Finance"
      tone="green"
      need="Saisir et rapprocher les 2 500 factures fournisseurs du mois"
      type="Workflow (chaînage)"
      why="Piège ! Étapes connues d’avance : pas besoin d’autonomie. Extraire, valider, saisir, exceptions à un humain."
    />
    <Hint cls={A.in} style={{ position: 'absolute', left: 120, top: 918, ...dl(1000) }}>
      Cliquez une carte pour la retourner · ou avancez : une carte par étape
    </Hint>
  </Frame>
);

// ─── M3 · QCM 3 — RAG ───────────────────────────────────────────────────────
const M23_Qcm3: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="Le RAG"
    q="Boréal branche un assistant RAG sur ses 40 000 documents. Que se passe-t-il quand un employé pose une question ?"
    explain="Le RAG ne modifie jamais le modèle : il récupère quelques extraits pertinents dans une base vectorielle et les joint à la question. Mettre un document à jour suffit donc à mettre les réponses à jour."
  >
    <Opt why="Piège ! Le modèle n’est pas modifié : on lui fournit des extraits au moment de la question. Le ré-entraînement, c’est l’ajustement fin (fine-tuning).">
      Le modèle est ré-entraîné sur les documents de Boréal pour en apprendre le contenu
    </Opt>
    <Opt why="Non : 40 000 documents dépassent largement la fenêtre de contexte. On ne transmet que quelques extraits choisis.">
      Le modèle relit les 40 000 documents en entier avant de répondre
    </Opt>
    <Opt ok why="Oui : récupération des extraits les plus proches dans la base vectorielle, puis génération d’une réponse qui les cite.">
      Les extraits les plus pertinents sont récupérés, puis fournis au modèle pour rédiger une réponse sourcée
    </Opt>
    <Opt why="Non : le RAG interroge vos propres documents indexés, pas Internet. C’est ce qui permet de citer des sources internes.">
      Le modèle cherche la réponse sur Internet, puis la compare aux documents de Boréal
    </Opt>
  </QcmPage>
);

// ─── M3 · QCM 4 — multi-agents ──────────────────────────────────────────────
const M23_Qcm4: Page = () => (
  <QcmPage
    mod={3}
    n={4}
    title="Les systèmes multi-agents"
    q="Un gestionnaire veut passer de 1 à 6 agents pour améliorer les réponses du service client. Quelle affirmation est juste ?"
    explain="Le multi-agents paie quand la tâche se découpe en morceaux indépendants. Sinon, il multiplie les jetons, les relais qui perdent de l’information et la difficulté de débogage. On commence toujours avec un seul agent."
  >
    <Opt why="Non : chaque agent ajoute des appels au modèle. Anthropic observe environ 15 fois plus de jetons qu’un simple clavardage.">
      Le multi-agents réduit les coûts, car chaque agent traite une plus petite partie du travail
    </Opt>
    <Opt ok why="Oui : c’est le critère clé. Pour des courriels simples et similaires, un seul agent multi-outils suffit.">
      Il se justifie si la tâche se découpe en sous-tâches indépendantes ; sinon, il ajoute coûts et pannes
    </Opt>
    <Opt why="Piège ! Plus d’agents, c’est plus de relais, de coûts et de points de défaillance. La qualité ne suit pas automatiquement.">
      Plus d’agents donne toujours un meilleur résultat, car chacun se spécialise
    </Opt>
    <Opt why="Non : des agents qui se vérifient entre eux peuvent partager les mêmes erreurs. La supervision humaine reste nécessaire.">
      Il élimine le besoin de supervision humaine, car les agents se vérifient entre eux
    </Opt>
  </QcmPage>
);

// ─── M3 · Synthèse ──────────────────────────────────────────────────────────
const M23Take = ({ n, d, children }: { n: number; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 22, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="blue" size={48} />
    <div style={{ fontSize: 28, lineHeight: 1.36, color: C.ink, paddingTop: 4 }}>{children}</div>
  </div>
);

const M23Decide = ({ q, type, tone, last, d }: { q: string; type: string; tone: Tone; last?: boolean; d: number }) => (
  <div className={A.in} style={dl(d)}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 430,
          boxSizing: 'border-box',
          padding: '14px 20px',
          background: C.card,
          borderRadius: 14,
          boxShadow: SHADOW_SM,
          fontSize: 24,
          lineHeight: 1.3,
          color: C.ink,
        }}
      >
        {q}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: T.green.fg }}>Oui</span>
        <FlowArrow w={64} color={C.green} />
      </div>
      <div
        style={{
          flex: 1,
          padding: '14px 18px',
          borderRadius: 14,
          background: T[tone].bg,
          boxShadow: `inset 0 0 0 3px ${STRONG[tone]}`,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 25,
          lineHeight: 1.15,
          color: C.ink,
          textAlign: 'center',
        }}
      >
        {type}
      </div>
    </div>
    {last ? null : (
      <div style={{ width: 430, textAlign: 'center', fontSize: 20, fontWeight: 600, color: C.muted, lineHeight: '34px' }}>Non ↓</div>
    )}
  </div>
);

const M23_Synthesis: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Synthèse · les types d’agents</Title>
    <Lede>Choisir le type d’agent le plus simple qui règle vraiment le problème.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 284, width: 760, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <Eyebrow c={C.blue} size={24} cls={A.fade}>
        À retenir
      </Eyebrow>
      <M23Take n={1} d={150}>
        Deux axes classent un agent : <Strong>autonomie</Strong> et <Strong>intégration</Strong> aux systèmes.
      </M23Take>
      <M23Take n={2} d={300}>
        Le RAG ne ré-entraîne pas le modèle : il lui fournit des <Strong>extraits sourcés</Strong>.
      </M23Take>
      <M23Take n={3} d={450}>
        Les 5 patrons d’Anthropic sont des <Strong>workflows</Strong> : commencez simple.
      </M23Take>
      <M23Take n={4} d={600}>
        Plus d’agents ≠ meilleur résultat : <Strong>coûts et pannes</Strong> grimpent.
      </M23Take>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 284, width: 840 }}>
      <Eyebrow c={C.violet} size={24} cls={A.fade} style={{ marginBottom: 14 }}>
        Quel type choisir ?
      </Eyebrow>
      <M23Decide d={400} q="Répondre à partir de vos documents suffit ?" type="Assistant RAG" tone="teal" />
      <M23Decide d={600} q="Il faut agir dans vos systèmes, étapes connues ?" type="Workflow / multi-outils" tone="violet" />
      <M23Decide d={800} q="Le chemin est inconnu et la tâche longue ?" type="Autonome + garde-fous" tone="coral" />
      <M23Decide d={1000} q="La tâche se découpe en morceaux indépendants ?" type="Multi-agents" tone="yellow" last />
    </div>
    <Callout
      cls={A.in}
      title="Et maintenant ?"
      tone="blue"
      icon="arrow"
      size={28}
      style={{ position: 'absolute', left: 120, top: 836, width: 1680, ...dl(1300) }}
    >
      Module 4 : trois cas réels (RH, soutien TI, documentaire), avec leur type d’agent, leurs outils et leurs garde-fous.
    </Callout>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [
  M23_Divider2,
  M23_Brief,
  M23_IdCard,
  M23_Candidate,
  M23_Divider3,
  M23_Families,
  M23_Conversational,
  M23_Autonomous,
  M23_MultiTool,
  M23_Orchestrator,
  M23_Rag,
  M23_Patterns,
  M23_Compare,
  M23_WhichType,
  M23_Qcm3,
  M23_Qcm4,
  M23_Synthesis,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 11 h 30)

OBJECTIF — Faire passer le groupe du mode « écoute » au mode « production » : c'est le premier atelier, il doit être concret et rassurant.

DIRE — « On a passé la matinée à définir ce qu'est un agent. Maintenant, on arrête de parler des agents des autres : on parle des vôtres. Pendant 30 minutes, vous allez identifier UN agent possible dans votre propre organisation. »

« Le plan est simple : vous choisissez un irritant réel — une tâche qui agace tout le monde —, vous remplissez la carte d'identité de l'agent qui pourrait s'en charger, vous vérifiez avec une grille si c'est un bon candidat, puis deux ou trois d'entre vous partagent avec le groupe. »

RASSURER — « Il n'y a pas de mauvaise réponse. Une idée qui obtient un score faible à la grille est une excellente leçon : vous saurez pourquoi elle n'est pas prête. »

LOGISTIQUE — Annoncez les duos dès maintenant (voisin de gauche ou de droite) pour ne pas perdre de temps. Si quelqu'un est seul, faites un trio.

LIEN — Rappelez les irritants notés pendant le tour de table : « Plusieurs d'entre vous en ont déjà mentionné un ce matin. »

TRANSITION — « Voici les consignes précises. »`,
  `⏱ 2 min · CONSIGNES (le minuteur de 20 min couvre les étapes 1 et 2)

OBJECTIF — Donner des consignes claires, minutées, pour que personne ne reste bloqué.

DIRE — « Trois étapes de 10 minutes. »
• Étape 1, seul — « Choisissez un irritant. Pas un grand rêve de transformation : une tâche précise, répétitive, qui revient souvent. Notez qui la fait, combien de fois par mois, combien de temps chaque fois. Ces trois chiffres feront votre argumentaire. »
• Étape 2, en duo — « Vous présentez votre irritant à votre voisin et vous remplissez ensemble la carte d'identité : je vous en montre un exemple juste après. Le voisin joue le gestionnaire sceptique : "Et si l'agent se trompe ? Qui le surveille ? Où sont les données ?" »
• Étape 3, en groupe — « Deux ou trois duos partagent, deux minutes chacun, et le groupe juge avec la grille. »

ANIMATION — Montrez d'abord l'exemple Boréal et la grille (pages suivantes, 2 min), puis revenez ici ou lancez le minuteur directement depuis cette page : il continue de tourner quand vous changez de page. Le bouton « + 1 min » sert si le groupe est très engagé.

PANNE D'IDÉE — Lisez les trois exemples de l'encadré bleu : ce sont des demandes qui reviennent dans presque toutes les organisations.

TRANSITION — « Voici à quoi ressemble une carte d'identité bien remplie. »`,
  `⏱ 2 min (puis laisser à l'écran pendant le travail en duo)

OBJECTIF — Montrer un exemple complet et réaliste de carte d'identité, pour que les duos aient un modèle à imiter.

DIRE — « Voici l'agent Aide-accès TI de Boréal. Il cible environ 630 billets par mois : les 35 % de mots de passe oubliés et de demandes d'accès parmi les 1 800 billets TI. Niveau d'autonomie visé : L3, il agit seul, mais dans un cadre strict. »

ANIMATION — Quatre clics, deux rubriques à la fois :
→ beat 1 : Objectif et utilisateurs. « L'objectif est chiffré : moins de 5 minutes. Un objectif sans chiffre ne se mesure pas. »
→ beat 2 : Déclencheur et données. « Qu'est-ce qui le réveille ? À quelles données a-t-il accès ? »
→ beat 3 : Outils, actions permises et interdites. « La rubrique la plus importante : ce qu'il n'a PAS le droit de faire. Aucun droit d'administrateur, aucune suppression de compte. »
→ beat 4 : Escalade et mesure de succès. « Quand passe-t-il la main ? Et comment saura-t-on que ça marche ? »

À SOULIGNER — Actions interdites et Escalade sont les rubriques les plus souvent oubliées. On y reviendra au module 4 avec l'incident Replit.

INTERACTION — « Quelle rubrique sera la plus difficile pour votre cas ? » Souvent : les données.

TRANSITION — « Avant de lancer le minuteur, voici la grille qui vous dira si votre idée tient la route. »`,
  `⏱ 5 min (grille, puis 2 ou 3 partages après les 20 min de travail)

OBJECTIF — Donner une grille d'évaluation simple et pondérée, que les participants réutiliseront demain dans la matrice de priorisation.

DIRE — « Huit critères, avec des poids différents. Les deux plus lourds, ×3 : le volume — un agent coûte cher à concevoir, il doit servir souvent — et l'erreur récupérable. Si une erreur de l'agent est irréversible, on change de catégorie de risque. »

ANIMATION — Faites la démonstration avec Aide-accès TI : cochez tous les critères sauf le dernier (les comptes d'accès sont sensibles). Le score monte à 15 sur 16 : « excellent candidat ». Puis décochez tout et lancez le minuteur de l'atelier.

PARTAGES — Après le travail en duo, deux ou trois duos présentent leur agent en deux minutes. Cochez la grille en direct avec le groupe. Questions utiles : « Combien de fois par mois ? », « Que se passe-t-il si l'agent se trompe ? », « Qui est votre parrain ? »

LECTURE DU SCORE — Moins de 7 : retravailler. De 7 à 11 : prometteur. 12 et plus : candidat au quick win.

SIGNAL D'ALARME — Une erreur irréversible sans humain dans la boucle annule tout le reste, même avec un bon score.

TRANSITION — « Gardez précieusement votre carte : on la ressortira demain matin. Bon dîner, on se retrouve à 13 h pour découvrir les grandes familles d'agents. »`,
  `⏱ 1 min · DÉBUT DU MODULE 3 (13 h 00, retour du dîner)

OBJECTIF — Relancer l'énergie après le dîner et annoncer un module dense mais très visuel.

DIRE — « Ce matin, vous avez imaginé un agent pour votre organisation. Question naturelle : quel genre d'agent, au juste ? Un agent qui répond ? Un agent qui agit dans vos systèmes ? Un agent qui travaille seul toute la nuit ? Une équipe d'agents ? Ce n'est pas du tout le même projet, ni le même budget, ni le même risque. »

« Pendant 1 h 15, on fait le tour des grandes familles, on démonte le pipeline RAG — le type d'agent le plus déployé en entreprise —, puis on voit les 5 patrons publiés par Anthropic, qui sont devenus une référence. On termine par un exercice sur les besoins de Boréal et deux QCM. »

ASTUCE — Demandez à chacun de garder sa carte d'identité de l'atelier sous les yeux : « À chaque famille, demandez-vous : est-ce que mon agent est de ce type-là ? »

ÉNERGIE — Après le dîner, faites lever le groupe 30 secondes ou posez une question à main levée : « Qui a déjà utilisé un robot conversationnel au travail cette semaine ? »

TRANSITION — « Commençons par une carte, pour se repérer. »`,
  `⏱ 6 min · CARTE DES FAMILLES (≈ 13 h 01)

OBJECTIF — Donner une grille de lecture simple : deux axes suffisent pour situer n'importe quel agent.

DIRE — « Axe horizontal : l'autonomie. Est-ce que l'agent attend qu'on lui parle, ou poursuit-il seul un objectif ? Axe vertical : l'intégration. Est-il isolé, ou branché à votre ERP, votre CRM, votre courriel ? »

ANIMATION — Une famille par clic :
→ beat 1 : Conversationnels, en bas à gauche. Ils répondent, sans toucher aux systèmes.
→ beat 2 : Assistants RAG. Ils répondent à partir de VOS documents, avec les sources.
→ beat 3 : Multi-outils. Ils agissent : créer un billet, consulter une commande.
→ beat 4 : Autonomes. Ils bouclent seuls vers un objectif, parfois pendant des heures.
→ beat 5 : Multi-agents. Un superviseur et des spécialistes. La phrase du bas apparaît : valeur, coût et risque montent ensemble.

LIEN — Les niveaux L1 à L5 renvoient à l'échelle d'autonomie vue au module 1.

INTERACTION — « Placez votre agent de l'atelier sur la carte : levez la main pour chaque zone. » La plupart des idées tombent dans RAG ou multi-outils. C'est normal, et sain : c'est là que se trouvent les quick wins.

NUANCE — Les frontières sont floues : un agent multi-outils utilise souvent le RAG. La carte sert à se repérer, pas à classer au millimètre.

TRANSITION — « Zoomons sur chaque famille, en commençant par la plus simple. »`,
  `⏱ 5 min · AGENTS CONVERSATIONNELS (≈ 13 h 07)

OBJECTIF — Montrer la valeur réelle des agents conversationnels… et leur plafond : ils n'agissent pas.

DIRE — « Voici l'agent RH de Boréal, qui absorbe une partie des 300 demandes RH mensuelles. Lisez la conversation avec moi. »

ANIMATION — Les bulles apparaissent d'elles-mêmes. Commentez :
• 1re réponse : précise et sourcée. « Remarquez la source : c'est ce qui crée la confiance. »
• 2e demande : l'employé veut une action. L'agent refuse poliment et redirige vers le formulaire. « C'est la limite du conversationnel : l'employé doit encore faire la démarche lui-même. »
→ beat 1 : Forces. Déploiement rapide, disponibilité 24 h sur 24, risque faible.
→ beat 2 : Limites. Pas d'action, hallucinations sans base documentaire, et responsabilité juridique.

CAS — Air Canada, 2024 : le robot conversationnel avait inventé une politique de remboursement pour un deuil. Le tribunal a obligé la compagnie à honorer la promesse. « Ce que dit votre agent vous engage. »

INTERACTION — « Dans vos organisations, quelles questions reviennent 50 fois par semaine ? » Notez deux ou trois réponses.

TRANSITION — « Et si l'agent pouvait aller au bout de la démarche, seul, pendant des heures ? On passe à l'autre extrémité de la carte. »`,
  `⏱ 6 min · AGENTS AUTONOMES (≈ 13 h 12)

OBJECTIF — Faire comprendre la boucle autonome et rendre les garde-fous non négociables.

DIRE — « Un agent autonome ne reçoit pas une question : il reçoit un objectif. Exemple Boréal : repérer chaque nuit les fournisseurs à risque. Il planifie, agit — recherche d'actualités, consultation de l'ERP —, observe le résultat, évalue s'il a atteint son objectif… et recommence. Les points qui circulent montrent cette boucle. »

ANIMATION —
→ beat 1 : Quand les utiliser. Tâches longues et ouvertes, dont le chemin n'est pas connu d'avance.
→ beat 2 : Budget. « Sans plafond, une boucle mal conçue peut coûter des centaines de dollars en une nuit. »
→ beat 3 : Plafond d'étapes. « 25 tours maximum : l'agent qui tourne en rond s'arrête. »
→ beat 4 : Point de contrôle humain. « Aucun courriel à un fournisseur, aucune commande sans validation. »

À SOULIGNER — L'autonomie n'est pas un objectif en soi. Gartner prévoit que plus de 40 % des projets agentiques seront annulés d'ici fin 2027, souvent faute de valeur claire ou de contrôles suffisants.

INTERACTION — « Quelle tâche de votre service pourrait tourner la nuit, avec un rapport le matin ? »

TRANSITION — « Entre le conversationnel et l'autonome, il y a la famille la plus utile au quotidien : l'agent branché à vos outils. »`,
  `⏱ 6 min · AGENTS MULTI-OUTILS (≈ 13 h 18)

OBJECTIF — Montrer concrètement comment un agent enchaîne plusieurs outils pour régler une demande de bout en bout.

DIRE — « Au centre, l'agent du service client de Boréal. Autour, cinq outils : CRM, ERP, base de connaissances, courriel, calendrier. Les points qui circulent, ce sont les appels d'outils. Suivons un vrai courriel : "Où est ma commande 48213 ?" »

ANIMATION — Un clic par outil ; la ligne se colore et l'outil s'illumine :
→ beat 1 : CRM. Qui est ce client ? Quel historique ?
→ beat 2 : ERP. La commande est retardée de 3 jours au centre de distribution.
→ beat 3 : Base de connaissances. Que prévoit la politique en cas de retard ?
→ beat 4 : Courriel. L'agent rédige la réponse, validée par un humain au début.
→ beat 5 : Calendrier. Un suivi est planifié le jour de la livraison.

À SOULIGNER — L'agent décide lui-même de l'ordre des appels. C'est la différence avec un script.

RISQUE — Chaque outil branché ajoute une capacité… et une porte d'entrée. On reparlera au module 4 du moindre privilège : en lecture seule d'abord, l'écriture ensuite.

LIEN — Le protocole MCP (Anthropic, nov. 2024) standardise justement ces branchements.

TRANSITION — « Et quand un seul agent ne suffit plus ? On lui donne des collègues. »`,
  `⏱ 6 min · ORCHESTRATEURS ET MULTI-AGENTS (≈ 13 h 24)

OBJECTIF — Expliquer le fonctionnement d'un système multi-agents et surtout son prix : coûts et complexité.

DIRE — « Exemple Boréal : répondre à un appel d'offres de 80 pages. Un superviseur découpe le travail. La recherche fouille les 40 000 documents, le rédacteur écrit chaque section, le vérificateur contrôle les prix et la conformité. »

ANIMATION —
→ beat 1 : Délégation. Les flèches se dessinent, les points bleus descendent vers les spécialistes.
→ beat 2 : Boucle de révision entre le rédacteur et le vérificateur.
→ beat 3 : Les résultats remontent (points verts). Le dossier est assemblé, puis révisé par un humain.
→ beat 4 : Le prix de la coordination. Anthropic a observé qu'un système multi-agents consomme environ 15 fois plus de jetons qu'un clavardage. Chaque relais peut perdre de l'information. Le débogage devient difficile.
→ beat 5 : La règle pratique.

À SOULIGNER — Le protocole A2A (Google, avril 2025) vise à faire dialoguer des agents de fournisseurs différents. C'est prometteur, mais encore jeune.

INTERACTION — « Votre agent de l'atelier aurait-il vraiment besoin de plusieurs agents ? » Presque toujours : non.

TRANSITION — « Revenons à la famille la plus déployée en entreprise. Ouvrons le capot du RAG. »`,
  `⏱ 8 min · PIPELINE RAG (≈ 13 h 30)

OBJECTIF — Démystifier le RAG, étape par étape, et ancrer l'idée clé : on ne ré-entraîne pas le modèle.

DIRE — « RAG veut dire génération augmentée par récupération. Deux phases. En haut à gauche, l'indexation, faite une fois puis à chaque mise à jour. En haut à droite, ce qui se passe à chaque question. »

ANIMATION — Un clic par étape :
→ beat 1 : Ingestion. SharePoint, Google Drive, le vieux wiki de Boréal.
→ beat 2 : Découpage en extraits de quelques paragraphes.
→ beat 3 : Plongements. Chaque extrait devient un vecteur qui capture son sens.
→ beat 4 : Base vectorielle. Elle range ces vecteurs pour les retrouver vite.
→ beat 5 : Récupération. La question devient un vecteur ; on prend les 3 à 5 extraits les plus proches.
→ beat 6 : Génération. Le modèle rédige la réponse en citant ses sources.
→ beat 7 : Exemple concret. La question, puis les extraits avec leur score de similarité.
→ beat 8 : La réponse, avec les citations [1] et [2].

À SOULIGNER — « Le modèle n'apprend rien. On lui glisse les bons extraits au moment de la question. Mettre un document à jour suffit. »

PIÈGE CLASSIQUE — La qualité dépend surtout des documents. Avec 40 000 documents, le ménage passe avant l'IA.

TRANSITION — « Voyons maintenant comment combiner des appels au modèle : les 5 patrons d'Anthropic. »`,
  `⏱ 8 min · LES 5 PATRONS D'ANTHROPIC (≈ 13 h 38)

OBJECTIF — Donner un vocabulaire commun pour décrire l'architecture d'une solution, et inviter à la sobriété.

DIRE — « En décembre 2024, Anthropic a publié "Building effective agents", un article devenu une référence. Son constat : les équipes qui réussissent utilisent des patrons simples et composables, pas des cadriciels complexes. »

ANIMATION — Un patron par clic, avec un exemple Boréal :
→ beat 1 : Chaînage. Étapes fixes : extraire la facture, la valider, la saisir.
→ beat 2 : Routage. Un tri initial : commande, plainte ou facture ? Chaque catégorie a son traitement.
→ beat 3 : Parallélisation. Plusieurs analyses en même temps, puis on combine.
→ beat 4 : Orchestrateur-exécutants. Le découpage se décide à la volée, comme pour l'appel d'offres.
→ beat 5 : Évaluateur-optimiseur. L'un rédige, l'autre critique, et on boucle jusqu'à la qualité visée.
→ beat 6 : Workflow ou agent ? Dans un workflow, c'est vous qui tracez le chemin. Un agent choisit le sien.

À SOULIGNER — « La plupart des besoins de Boréal se règlent avec un workflow. L'agent autonome vient seulement quand le chemin ne peut pas être prévu. »

INTERACTION — « Quel patron correspond à votre idée de l'atelier ? » Faites voter avec les doigts, de 1 à 5.

TRANSITION — « Récapitulons tout ça dans un seul tableau. »`,
  `⏱ 4 min · COMPARATIF (≈ 13 h 46)

OBJECTIF — Consolider les cinq familles dans une vue unique, avant l'exercice.

DIRE — « Une ligne par type, trois jauges : autonomie, complexité de construction, risque. Et un exemple Boréal pour chacun. »

ANIMATION — Les lignes et les jauges se remplissent d'elles-mêmes. Lisez-les de haut en bas :
• Conversationnel : tout au minimum. FAQ RH.
• Assistant RAG : un cran plus haut. Le défi, c'est la qualité documentaire.
• Multi-outils : niveau moyen partout. Aide-accès TI, 630 billets par mois.
• Autonome : autonomie et risque élevés. Veille des fournisseurs.
• Multi-agents : complexité maximale. Appels d'offres.

À SOULIGNER — Les jauges montent presque ensemble. « On n'achète pas l'autonomie gratuitement : on la paie en complexité et en risque. »

NUANCE — Les jauges sont indicatives. Un agent multi-outils en lecture seule est moins risqué qu'un agent qui envoie des courriels aux clients.

PHRASE CLÉ — Lisez la ligne du bas : « Le bon choix est le type le moins complexe qui règle vraiment le problème. »

INTERACTION — « Qui hésite encore entre deux types pour son idée de ce matin ? » Prenez un exemple et tranchez avec le groupe.

TRANSITION — « À vous de jouer : six besoins réels de Boréal, à vous de choisir le type. »`,
  `⏱ 10 min · EXERCICE (≈ 13 h 50)

OBJECTIF — Faire appliquer la grille à des cas concrets et repérer le piège : tout ne demande pas un agent.

CONSIGNE — « En équipes de trois ou quatre, prenez 4 minutes pour associer un type d'agent à chacun des six besoins. Ensuite, on retourne les cartes une à une. »

ANIMATION — Chaque clic retourne une carte (beats 1 à 6) ; on peut aussi cliquer directement sur une carte. Avant chaque retournement, demandez le vote des équipes.
→ 1 Service client : multi-outils (CRM, ERP, courriel).
→ 2 RH : conversationnel avec RAG sur le guide de l'employé.
→ 3 Documentation : assistant RAG, après un ménage des 40 000 documents.
→ 4 Approvisionnement : autonome, avec budget, plafond d'étapes et validation.
→ 5 Ventes : orchestrateur multi-agents, avec révision humaine finale.
→ 6 Finance : PIÈGE ! Un workflow (chaînage) suffit. Les étapes sont connues d'avance, l'autonomie n'apporte que du risque.

DÉBAT — Les cartes 1 et 2 génèrent souvent des désaccords. Plusieurs réponses se défendent : valorisez l'argumentation plutôt que la réponse « officielle ».

À SOULIGNER — « Un bon conseiller sait dire : pas besoin d'agent ici. »

TRANSITION — « Vérifions maintenant deux notions qui piègent souvent : le RAG, puis le multi-agents. »`,
  `⏱ 4 min · QCM 3 (≈ 14 h 00)

OBJECTIF — Vérifier la compréhension du RAG et déloger l'idée reçue du ré-entraînement.

ANIMATION — Laissez 45 secondes de réflexion individuelle, puis faites voter à main levée. Cliquez une option pour afficher la rétroaction. → beat 1 : bonne réponse ; → beat 2 : explication.

RÉPONSES —
✗ A — PIÈGE : « ré-entraîné sur les documents ». C'est la confusion la plus fréquente. Ré-entraîner, c'est le fine-tuning : coûteux, lent, et ça n'apporte pas de sources. Le RAG ne touche pas au modèle.
✗ B — Relire les 40 000 documents : impossible, cela dépasse de loin la fenêtre de contexte, et ce serait hors de prix.
✓ C — Récupérer les extraits pertinents, puis générer une réponse sourcée : c'est exactement le pipeline vu tantôt.
✗ D — Internet : non, le RAG interroge vos documents indexés. C'est pour ça qu'il peut citer « Politique retours B2B, v3 ».

DIRE — « Si vous retenez une chose : le RAG, c'est un examen à livre ouvert. Le modèle n'a rien mémorisé, il consulte les bonnes pages au bon moment. »

CONSÉQUENCE PRATIQUE — Quand une politique change chez Boréal, on met à jour le document, et la réponse change dès la prochaine question. Pas de réentraînement, pas de délai.

TRANSITION — « Deuxième question, sur les systèmes à plusieurs agents. »`,
  `⏱ 4 min · QCM 4 (≈ 14 h 04)

OBJECTIF — Déconstruire l'intuition « plus d'agents = mieux » et rappeler le critère de décomposition.

ANIMATION — Même déroulement : réflexion individuelle, vote, clic sur une option. → beat 1 : bonne réponse ; → beat 2 : explication.

RÉPONSES —
✗ A — Réduction des coûts : c'est l'inverse. Chaque agent fait ses propres appels au modèle. Anthropic rapporte environ 15 fois plus de jetons qu'un clavardage pour son système de recherche multi-agents.
✓ B — Le critère clé : des sous-tâches vraiment indépendantes. Pour des courriels de suivi de commande, un seul agent multi-outils suffit.
✗ C — PIÈGE : « plus d'agents = meilleur résultat ». Intuitif, mais faux. Chaque relais peut déformer l'information, et les erreurs se propagent d'un agent à l'autre.
✗ D — Supervision éliminée : non. Des agents qui utilisent le même modèle peuvent partager les mêmes angles morts. L'humain reste dans la boucle pour les actions engageantes.

DIRE — « Pensez à une réunion : à 3, on avance ; à 15, on passe son temps à se coordonner. C'est pareil pour les agents. »

LIEN — Ce piège rejoint la statistique de Gartner : plus de 40 % des projets agentiques annulés d'ici 2027, souvent à cause d'une complexité injustifiée.

TRANSITION — « On termine le module avec une synthèse. »`,
  `⏱ 4 min · SYNTHÈSE M3 (≈ 14 h 08, pause à 14 h 15)

OBJECTIF — Fixer les quatre idées clés et donner un outil de décision réutilisable.

DIRE — Reprenez les quatre points de gauche :
1. « Deux axes classent un agent : son autonomie et son intégration à vos systèmes. »
2. « Le RAG ne ré-entraîne pas le modèle : il lui fournit des extraits sourcés. »
3. « Les patrons d'Anthropic sont des workflows. Commencez par le plus simple. »
4. « Plus d'agents ne veut pas dire meilleur résultat : coûts et pannes grimpent. »

ANIMATION — L'arbre de décision de droite apparaît question par question. Lisez-le de haut en bas, comme un entonnoir : on s'arrête à la première réponse « oui ». « Remarquez l'ordre : on commence toujours par le plus simple. »

INTERACTION — « Repassez votre agent de l'atelier dans cet arbre. Où s'arrête-t-il ? » Faites répondre deux personnes. S'il s'arrête plus haut que prévu, c'est une bonne nouvelle : le projet sera plus simple et moins risqué.

À NOTER — Si le module a pris du retard, réduisez cette page à l'arbre de décision seulement.

TRANSITION — « Pause de 15 minutes. Au retour, trois cas concrets chez Boréal — RH, soutien TI et assistant documentaire — avec leurs garde-fous. »`,
];
// @@NOTES-END
