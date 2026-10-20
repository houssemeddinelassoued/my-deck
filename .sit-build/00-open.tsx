// ─── Ouverture · Jour 1 ─────────────────────────────────────────────────────

// Vertical mini-flow on the cover: five steps, one dot travelling down.
const OCoverStep = ({ kind, label, y, d }: { kind: NodeKind; label: string; y: number; d: number }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 420, display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={NK[kind].icon} tone={NK[kind].tone} size={64} solid style={{ boxShadow: '0 0 0 6px var(--osd-bg)' }} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: T[NK[kind].tone].fg }}>{NK[kind].label}</div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{label}</div>
    </div>
  </div>
);

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 110, width: 980 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: display, fontWeight: 600, fontSize: 20, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted }}>Une formation</span>
        <span style={{ width: 2, height: 26, background: C.rule }} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, letterSpacing: '0.01em', color: C.navy }}>GK Global Knowledge</span>
      </div>
      <div className={A.in} style={{ marginTop: 26, display: 'flex', gap: 12, ...dl(60) }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 2 jours · 14 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="sparkles" size={22} /> Microsoft 365 Copilot · Claude
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '30px 0 0', fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        Support &
        <br />
        infrastructure IT
      </h1>
      <div
        className={A.in}
        style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 52, lineHeight: 1.12, letterSpacing: '-0.015em', color: C.plum, ...dl(180) }}
      >
        Boostez vos performances
        <br />
        grâce à l’IA
      </div>
      <p className={A.in} style={{ margin: '24px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 940, ...dl(240) }}>
        Rédiger, synthétiser, analyser et automatiser les tâches du quotidien IT,{' '}
        <strong style={{ color: C.navy }}>sans programmer</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={712} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 734, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers de l’IT</div>
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <Tag tone="violet" size={19}>
          <Icon name="chat" size={19} /> Prompts
        </Tag>
        <Tag tone="teal" size={19}>
          <Icon name="doc" size={19} /> Documents
        </Tag>
        <Tag tone="blue" size={19}>
          <Icon name="chart" size={19} /> Données
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="route" size={19} /> Automatisation
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 150, width: 420, height: 720 }}>
      <svg width={64} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 672" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 672" dur={3.2} r={8} color={C.electric} />
      </svg>
      <OCoverStep kind="trigger" label="Alerte : disque plein" y={0} d={400} />
      <OCoverStep kind="ai" label="L’IA résume l’incident" y={160} d={520} />
      <OCoverStep kind="data" label="Les tickets sont analysés" y={320} d={640} />
      <OCoverStep kind="human" label="Vous vérifiez et décidez" y={480} d={760} />
      <OCoverStep kind="action" label="Communication envoyée" y={640} d={880} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Bienvenue & promesse ───────────────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Deux jours pour gagner du temps</Title>
    <Lede>Une formation construite à partir de vos réponses au questionnaire, sur des tâches IT bien réelles.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour ces deux jours</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={14} suffix=" h" />} label="sur deux jours, dont plus de 60 % de pratique sur votre poste" tone="blue" d={150} />
      <OPromise value={<CountUp to={13} />} label="labs et ateliers sur le fil rouge Orvalis et sur vos propres cas" tone="violet" d={280} />
      <OPromise value={<CountUp to={1} />} label="kit d’équipe : prompts, agent, modèles et scripts réutilisables" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Zéro ligne de code à apprendre. Vous décrivez en français, l’IA produit, <strong>vous vérifiez</strong>. Le formateur montre,
        vous pratiquez : c’est vous qui tenez la souris.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA rédige, analyse et automatise ; le technicien vérifie et décide. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon métier
      </Eyebrow>
      <Poll>
        <PollRow id="o-m1" label="Technicien informatique" tone="blue" icon="tool" />
        <PollRow id="o-m2" label="Technicien d’exploitation" tone="teal" icon="gauge" />
        <PollRow id="o-m3" label="Support IT" tone="violet" icon="headset" />
        <PollRow id="o-m4" label="Administrateur infrastructures" tone="navy" icon="server" />
        <PollRow id="o-m5" label="Delivery manager ou autre" tone="green" icon="target" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        L’IA que j’ai déjà utilisée (plusieurs votes possibles)
      </Eyebrow>
      <Poll>
        <PollRow id="o-t1" label="Microsoft Copilot" tone="blue" icon="chat" />
        <PollRow id="o-t2" label="ChatGPT" tone="green" icon="chat" />
        <PollRow id="o-t3" label="Gemini" tone="violet" icon="chat" />
        <PollRow id="o-t4" label="Claude" tone="yellow" icon="chat" />
        <PollRow id="o-t5" label="Aucune, ou presque" tone="grey" icon="smile" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      En binôme, on mélange : un utilisateur régulier avec un curieux, un profil support avec un profil infrastructure.
    </Hint>
  </Frame>
);

// ─── Ce que vous nous avez dit ──────────────────────────────────────────────
const OBar = ({ label, n, max, tone, mod, d }: { label: string; n: number; max: number; tone: Tone; mod: string; d: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr 140px', alignItems: 'center', gap: 18 }}>
    <span style={{ fontSize: 23, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{label}</span>
    <div style={{ height: 40, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
      <div
        className={A.grow}
        style={{
          width: `${(n / max) * 100}%`,
          height: '100%',
          borderRadius: 10,
          background: STRONG[tone],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 14,
          boxSizing: 'border-box',
          color: '#fff',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 22,
          ...dl(d),
        }}
      >
        {n} / 5
      </div>
    </div>
    <Tag tone={tone} size={18} style={{ justifySelf: 'start' }}>
      {mod}
    </Tag>
  </div>
);

const OMini = ({ label, n, tone }: { label: string; n: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 110, fontSize: 20, fontWeight: 600, color: C.soft }}>{label}</span>
    <span style={{ display: 'flex', gap: 6 }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: n >= 1 ? STRONG[tone] : C.panel }} />
      <span style={{ width: 22, height: 22, borderRadius: 6, background: n >= 2 ? STRONG[tone] : C.panel }} />
      <span style={{ width: 22, height: 22, borderRadius: 6, background: n >= 3 ? STRONG[tone] : C.panel }} />
      <span style={{ width: 22, height: 22, borderRadius: 6, background: n >= 4 ? STRONG[tone] : C.panel }} />
      <span style={{ width: 22, height: 22, borderRadius: 6, background: n >= 5 ? STRONG[tone] : C.panel }} />
    </span>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 20, color: T[tone].fg }}>{n}</span>
  </div>
);

const O_Questionnaire: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous nous avez dit</Title>
    <Lede>Cinq réponses au questionnaire préalable. Le temps passé sur chaque thème suit vos votes.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 470, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px' }}>
        <Eyebrow c={C.navy} size={18}>
          Votre niveau
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', height: 54, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ flex: 40, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 24 }}>40 %</div>
          <div style={{ flex: 60, background: C.yellow, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 24 }}>60 %</div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 19, color: C.soft }}>
          <span>Utilisateurs réguliers</span>
          <span>Curieux, quelques essais</span>
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow c={C.navy} size={18} style={{ marginBottom: 4 }}>
          Les outils que vous connaissez
        </Eyebrow>
        <OMini label="Copilot" n={5} tone="blue" />
        <OMini label="ChatGPT" n={3} tone="green" />
        <OMini label="Gemini" n={3} tone="violet" />
        <OMini label="Claude" n={2} tone="yellow" />
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 650, top: 270, width: 1150, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(150) }}>
      <Eyebrow c={C.navy} size={18}>
        Vos cas d’usage prioritaires · et le module qui les traite
      </Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <OBar label="Automatisation de tâches administratives" n={5} max={5} tone="green" mod="M7 · 2 h 30" d={300} />
        <OBar label="Synthèse et analyse de longs rapports" n={4} max={5} tone="teal" mod="M3 · M6" d={400} />
        <OBar label="Rédaction de documents et d’e-mails" n={3} max={5} tone="violet" mod="M2 · M3" d={500} />
        <OBar label="Idées et résolution de problèmes" n={3} max={5} tone="coral" mod="M6" d={600} />
        <OBar label="Planification et organisation" n={2} max={5} tone="blue" mod="M3" d={700} />
      </div>
      <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1.5px solid ${C.rule}`, fontSize: 21, lineHeight: 1.45, color: C.soft }}>
        <strong style={{ color: C.navy }}>Aussi cités :</strong> fichiers Excel et données multi-sources, causes racines d’incidents, statistiques, préparation de
        réunions, rédaction de scripts.
      </div>
    </div>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OGoal = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '24px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs : à l’issue des deux jours, vous saurez…</Title>
    <Lede>Sept objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="chat" tone="violet" title="Choisir & formuler" d={100}>
        <Bullet size={23} tone="violet">Choisir entre Copilot et Claude selon la tâche, les données et le cadre</Bullet>
        <Bullet size={23} tone="violet">Écrire des prompts structurés et fournir le bon contexte</Bullet>
      </OGoal>
      <OGoal icon="doc" tone="teal" title="Produire & analyser" d={220}>
        <Bullet size={23} tone="teal">Rédiger et synthétiser e-mails, procédures, articles, notes</Bullet>
        <Bullet size={23} tone="teal">Exploiter Excel et des données multi-sources</Bullet>
        <Bullet size={23} tone="teal">Mener une analyse de causes racines et rédiger le post-mortem</Bullet>
      </OGoal>
      <OGoal icon="route" tone="green" title="Automatiser" d={340}>
        <Bullet size={23} tone="green">Automatiser les tâches répétitives : modèles, agents, flux sans code</Bullet>
        <Bullet size={23} tone="green">Faire écrire par l’IA des scripts simples, sans apprendre à coder</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Sécuriser" d={460}>
        <Bullet size={23} tone="coral">Protéger les données sensibles et la confidentialité</Bullet>
        <Bullet size={23} tone="coral">Appliquer le RGPD, l’AI Act et la charte interne</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, livrables des labs, QCM final, auto-positionnement au début et à la fin.
    </div>
  </Frame>
);

// ─── Programme des deux jours ───────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 78, fontFamily: mono, fontSize: 21, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="doc" tone="violet" title="Jour 1 · Comprendre et produire" sub="Outils, prompts, documents, bon usage" d={0}>
        <OSlot t="9:00" title="Ouverture · auto-positionnement" tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="Panorama : Copilot, Claude et les autres" sub="Comprendre un LLM · choisir son outil · atelier comparatif" tone="blue" d={230} />
        <OSlot t="11:15" mod="M2" title="Bien formuler : prompting et contexte" sub="Structure, contexte, itération · labs 2.1 et 2.2" tone="violet" d={310} />
        <OSlot t="14:00" mod="M3" title="Rédiger, synthétiser, préparer" sub="Rapports, procédures, réunions, plannings · labs 3.1 et 3.2" tone="teal" d={390} />
        <OSlot t="15:45" mod="M4" title="Limites, sécurité et conformité" sub="Données sensibles, scripts, RGPD · atelier d’audit" tone="coral" d={470} />
        <OSlot t="17:10" title="Bilan · lancement de l’intersession" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="route" tone="green" title="Jour 2 · Analyser et automatiser" sub="Données, incidents, agents, flux, scripts" d={200}>
        <OSlot t="9:00" title="Quiz flash sur le jour 1" tone="grey" d={350} />
        <OSlot t="9:15" mod="M5" title="Retours d’intersession" sub="Vos cas réels · matrice valeur-effort" tone="yellow" d={430} />
        <OSlot t="10:45" mod="M6" title="Analyser : données et causes racines" sub="Excel, reporting, 5 pourquoi · labs 6.1 et 6.2" tone="blue" d={510} />
        <OSlot t="14:00" mod="M7" title="Automatiser les tâches administratives" sub="Agents, flux, scripts en vibe coding · labs 7.1 → 7.3" tone="green" d={590} />
        <OSlot t="16:30" mod="M8" title="Synthèse et plan d’action" sub="Kit d’équipe · QCM final · évaluation" tone="navy" d={670} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="clock" size={24} color={T.yellow.fg} />
      Pauses vers 10:30 et 15:30 · déjeuner 12:30 – 14:00 · le bandeau en haut à droite indique toujours le module en cours.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice à la fin du jour 2.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Dire quand utiliser Copilot plutôt que Claude, et pourquoi</CheckItem>
        <CheckItem id="ap2">Écrire un prompt avec rôle, contexte, tâche, format et contraintes</CheckItem>
        <CheckItem id="ap3">Réduire un rapport de 40 pages en une note d’une page fiable</CheckItem>
        <CheckItem id="ap4">Transformer un ticket résolu en article de base de connaissances</CheckItem>
        <CheckItem id="ap5">Faire produire un reporting commenté à partir d’un export Excel</CheckItem>
        <CheckItem id="ap6">Mener une analyse « 5 pourquoi » sur un incident avec l’IA</CheckItem>
        <CheckItem id="ap7">Créer un agent ou un flux qui automatise une tâche répétitive</CheckItem>
        <CheckItem id="ap8">Faire écrire, expliquer et tester un script sans risque</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Curieux : chaque lab a un parcours de base pour vous.', tone: 'grey' },
            { min: 3, text: 'Utilisateur régulier : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'Avancé : visez les défis bonus de chaque lab.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression en fin de formation.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le fil rouge : Orvalis ─────────────────────────────────────────────────
const OCast = ({ id, d, children }: { id: CastId; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderLeft: `8px solid ${STRONG[CAST[id].tone]}`, ...dl(d) }}>
    <Who id={id} size={26} />
    <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const O_Orvalis: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.coral }}>le service IT d’Orvalis</span>
    </Title>
    <Lede>Une entreprise fictive, des fichiers fictifs, des situations que vous vivez toutes les semaines.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 520, boxSizing: 'border-box', background: G.navy, borderRadius: 22, boxShadow: SHADOW, padding: '30px 34px', color: '#fff' }}>
      <Eyebrow c="#C9B6FF" size={20}>
        Orvalis · groupe logistique
      </Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60 }}>1 400</span>
          <span style={{ fontSize: 24, color: '#C7CFEA' }}>salariés</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60 }}>9</span>
          <span style={{ fontSize: 24, color: '#C7CFEA' }}>entrepôts en France</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60 }}>1 846</span>
          <span style={{ fontSize: 24, color: '#C7CFEA' }}>tickets en septembre</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60 }}>14</span>
          <span style={{ fontSize: 24, color: '#C7CFEA' }}>personnes au service IT</span>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 690, top: 270, width: 1110, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <OCast id="ines" d={150}>
        Premier et deuxième niveau. Répond aux mêmes questions dix fois par jour.
      </OCast>
      <OCast id="thomas" d={250}>
        Supervision, sauvegardes, astreintes. Noyé sous les alertes et les journaux.
      </OCast>
      <OCast id="malik" d={350}>
        Serveurs, réseau, Wi-Fi des entrepôts. Ses procédures datent de 2019.
      </OCast>
      <OCast id="claire" d={450}>
        Comités de changement, reporting, fournisseurs. Passe ses vendredis dans Excel.
      </OCast>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 690, top: 890, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="folder" size={24} color={C.electric} />
      Tous les fichiers des labs sont dans le dossier « Orvalis » : données inventées, aucune donnée réelle.
    </div>
  </Frame>
);

// ─── La semaine du service IT ───────────────────────────────────────────────
const ODay = ({ day, icon, tone, title, children, mods, beat }: { day: string; icon: IconName; tone: Tone; title: string; children: ReactNode; mods: string; beat: number }) => (
  <div className={b.on(beat)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{day}</span>
      <IconTile name={icon} tone={tone} size={50} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 26, lineHeight: 1.2, color: C.navy }}>{title}</div>
    <div style={{ fontSize: 21, lineHeight: 1.45, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone={tone} size={18}>
        {mods}
      </Tag>
    </div>
  </div>
);

const O_Semaine: Page = () => (
  <Frame mod={0} beats={4}>
    <Title>Une semaine ordinaire au service IT d’Orvalis</Title>
    <Lede>Quatre situations, qui reviennent d’un module à l’autre. Chacune devient un lab.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 560, display: 'flex', gap: 22 }}>
      <ODay beat={1} day="Lundi 7:52" icon="hdd" tone="coral" title="Incident majeur sur FS-02" mods="M2 · M6 · M7">
        Le serveur de fichiers des entrepôts est plein. 340 personnes bloquées pendant 2 h 39. Il faut communiquer, puis comprendre.
      </ODay>
      <ODay beat={2} day="Mardi" icon="book" tone="teal" title="Documenter ce qu’on a appris" mods="M3 · M4">
        Une procédure de purge à réécrire, un article de base de connaissances à publier, un rapport d’audit de 40 pages à lire.
      </ODay>
      <ODay beat={3} day="Jeudi 14:00" icon="printer" tone="violet" title="Comité de changement" mods="M3">
        Claire présente la migration du serveur d’impression PRT-01 : dossier, risques, planning, compte rendu.
      </ODay>
      <ODay beat={4} day="Vendredi" icon="chart" tone="green" title="Reporting mensuel" mods="M6 · M7">
        Export de 1 846 tickets, indicateurs de support, écarts à expliquer… et l’envie de ne plus jamais le faire à la main.
      </ODay>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(400) }}>
      <Icon name="users" size={24} color={C.violet} />
      Et à côté du fil rouge : vos propres cas, dès l’intersession.
    </div>
  </Frame>
);

// ─── Check-up ───────────────────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : vos outils pour les labs</Title>
    <Lede>Si un accès manque, travaillez en binôme sur le poste de votre voisin : on règle le problème à la pause.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Copilot ouvert avec votre compte professionnel (icône bouclier visible)</CheckItem>
        <CheckItem id="su2" size={26}>Licence Microsoft 365 Copilot, si vous en avez une : Outlook, Teams, Excel</CheckItem>
        <CheckItem id="su3" size={26}>Un compte Claude fourni pour la formation</CheckItem>
        <CheckItem id="su4" size={26}>Le dossier « Orvalis » copié sur votre OneDrive</CheckItem>
        <CheckItem id="su5" size={26}>Excel de bureau et PowerShell ouverts (jour 2)</CheckItem>
        <CheckItem id="su6" size={26}>Un bloc-notes pour votre journal des gains de temps</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle dans les labs : ni journal de production, ni adresse IP, ni nom d’utilisateur. Le dossier Orvalis suffit.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Poll, O_Questionnaire, O_Objectifs, O_Programme, O_AutoPos, O_Orvalis, O_Semaine, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · J1 9:00

OBJECTIF — Accueillir le groupe et poser le cadre : IA appliquée au support et à l’infrastructure, sans programmation.

DIRE — « Bonjour à toutes et à tous, et bienvenue dans cette formation GK Global Knowledge. Pendant deux jours, on va utiliser l’IA pour ce qui vous prend du temps : rédiger, résumer de longs documents, exploiter vos fichiers Excel, analyser des incidents et automatiser des tâches administratives. Les deux outils principaux seront Microsoft 365 Copilot et Claude. Et une précision importante : on ne fera pas de programmation. Quand on aura besoin d’un script, c’est l’IA qui l’écrira. »

ANIMATION — Laisser la page affichée pendant l’installation. Le point qui descend à droite montre le genre de chaîne qu’on saura construire : une alerte, un résumé, une analyse, une validation humaine, une communication.

TRANSITION — « Quelques mots sur ce qui vous attend. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Donner la promesse chiffrée et le contrat pédagogique.

DIRE — « Quatorze heures, dont plus de 60 % de pratique sur votre poste. Treize labs et ateliers, sur un fil rouge commun et sur vos propres cas. Et en partant, un kit d’équipe : une bibliothèque de prompts, un agent, des modèles et des scripts que vous pourrez réutiliser dès lundi. Le contrat : zéro ligne de code à apprendre. Vous décrivez en français, l’IA produit, vous vérifiez. Et le fil conducteur, que vous allez entendre souvent : l’IA rédige, analyse et automatise ; le technicien vérifie et décide. »

INSISTER — Le groupe est mixte : 60 % de curieux et 40 % d’utilisateurs réguliers. Rassurer les premiers, annoncer aux seconds des défis bonus.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les métiers et les outils présents pour adapter les exemples et former des binômes complémentaires.

DIRE — « Premier vote : votre métier. » Compter, cliquer. « Deuxième vote : les IA que vous avez déjà utilisées, même une seule fois. Plusieurs votes possibles. »

ANIMATION — Cliquer une ligne par main levée. Repérer les utilisateurs réguliers : leur proposer d’être binôme d’un curieux. Demander à une ou deux personnes ce qu’elles font déjà avec l’IA.

TRANSITION — « Vous avez aussi répondu au questionnaire. Voici ce qu’il dit. »`,
  `⏱ 3 min · CE QUE VOUS NOUS AVEZ DIT

OBJECTIF — Montrer que le programme a été construit à partir des réponses du groupe.

DIRE — « Cinq réponses. À gauche, votre niveau : 40 % d’utilisateurs réguliers, 60 % de curieux. Tout le monde connaît Copilot, une partie connaît ChatGPT et Gemini, deux personnes connaissent Claude. On va donc bien présenter Claude. À droite, vos priorités : l’automatisation des tâches administratives a été cochée par les cinq. C’est pour ça que le module 7 dure deux heures et demie. Viennent ensuite la synthèse de longs rapports, la rédaction, la résolution de problèmes et la planification. Vous avez aussi cité Excel, les causes racines d’incidents, les statistiques, la préparation de réunions et les scripts. Tout est dans le programme. »

ANIMATION — Les barres se remplissent à l’affichage. Pointer l’étiquette de module à droite de chaque barre.

TRANSITION — « Voici donc ce que vous saurez faire en partant. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les sept objectifs pédagogiques, regroupés en quatre gestes.

DIRE — « Sept objectifs, quatre gestes. Choisir et formuler : savoir quel outil prendre et comment lui parler. Produire et analyser : les documents, les données, les incidents. Automatiser : les tâches qui reviennent chaque semaine, avec des agents, des flux et des scripts que l’IA écrit pour vous. Et sécuriser : ne jamais exposer l’entreprise. L’évaluation est continue : un quiz par module, les livrables des labs, un QCM final et l’auto-positionnement qu’on va faire dans deux minutes. »

TRANSITION — « Le déroulé heure par heure. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte des deux jours.

DIRE — « Jour 1 : comprendre et produire. Module 1, le panorama des outils. Module 2, bien formuler. Module 3, rédiger, synthétiser et préparer. Module 4, les limites, la sécurité et la conformité. Ce soir, je vous confie une mission d’intersession : une tâche réelle à traiter avec l’IA. Jour 2 : analyser et automatiser. On commence par vos retours, puis l’analyse de données et d’incidents, puis tout l’après-midi sur l’automatisation, et on termine par votre plan d’action. »

ANIMATION — Pointer le bandeau de progression en haut à droite : il suit le module courant.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ de chacun.

DIRE — « Huit affirmations, une par grande compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Notez votre score sur un coin de feuille : on refera exactement le même exercice à la fin du jour 2. »

ANIMATION — Faire cocher un volontaire à l’écran, ou laisser chacun noter sur papier. Repérer les scores élevés : leur signaler les défis bonus des labs.

TRANSITION — « Maintenant, je vous présente l’entreprise avec laquelle on va travailler. »`,
  `⏱ 3 min · LE FIL ROUGE ORVALIS

OBJECTIF — Installer le fil rouge et ses personnages.

DIRE — « Orvalis est un groupe logistique fictif : 1 400 salariés, neuf entrepôts, 1 846 tickets en septembre, un service IT de quatorze personnes. Quatre d’entre elles vont nous accompagner. Inès, technicienne support, qui répond aux mêmes questions dix fois par jour. Thomas, technicien d’exploitation, noyé sous les alertes. Malik, administrateur infrastructures, dont les procédures datent de 2019. Et Claire, delivery manager, qui passe ses vendredis dans Excel. Vous vous reconnaissez peut-être un peu. Tous les fichiers des labs sont dans le dossier Orvalis : tout est inventé, aucune donnée réelle. »

ANIMATION — Demander : « Qui se reconnaît dans Inès ? Dans Thomas ? » Associer chaque participant à un personnage proche de son métier.

TRANSITION — « Et voici leur semaine. »`,
  `⏱ 3 min · LA SEMAINE D’ORVALIS (4 clics)

OBJECTIF — Montrer les quatre situations qui serviront de labs.

DIRE — → beat 1 : « Lundi 7 h 52 : le serveur de fichiers des entrepôts, FS-02, est plein. 340 personnes bloquées pendant 2 h 39. Il faudra communiquer, puis comprendre pourquoi. » → beat 2 : « Mardi : documenter. Réécrire la procédure, publier un article de base de connaissances, lire un rapport d’audit de 40 pages. » → beat 3 : « Jeudi : le comité de changement, où Claire présente la migration du serveur d’impression. » → beat 4 : « Vendredi : le reporting mensuel. 1 846 tickets à analyser, des écarts à expliquer, et l’envie de ne plus jamais le faire à la main. »

ANIMATION — Pointer l’étiquette de modules en bas de chaque carte : chaque situation revient plusieurs fois.

TRANSITION — « Dernière étape : vérifions vos outils. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les accès nécessaires aux labs.

DIRE — « Trois minutes. Vérifiez chaque ligne et cochez. Copilot avec votre compte professionnel : vous devez voir le petit bouclier, qui indique la protection des données de l’entreprise. Si vous avez une licence Microsoft 365 Copilot, vous aurez aussi Copilot dans Outlook, Teams et Excel. Sinon, vous ferez les mêmes labs dans Copilot Chat ou dans Claude. Le dossier Orvalis doit être sur votre OneDrive. Et la règle d’or : aucune donnée réelle dans les labs. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Noter les accès manquants pour la pause.

TRANSITION — « Tout le monde est prêt ? Module 1 : le panorama des outils. »`,
];
// @@NOTES-END
