// ─── Ouverture ──────────────────────────────────────────────────────────────

// Shared page helpers (used across parts) ─────────────────────────────────────
const BreakPage = ({ mod, title, back, minutes, icon = 'clock' }: { mod: number; title: string; back: string; minutes: number; icon?: IconName }) => (
  <Frame mod={mod}>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1000 }}>
      <div className={A.in}>
        <IconTile name={icon} tone="yellow" size={96} solid />
      </div>
      <h2 className={A.in} style={{ margin: '40px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: C.navy, ...dl(120) }}>
        {title}
      </h2>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        {back}
      </p>
      <div className={A.fade} style={{ marginTop: 40, display: 'flex', gap: 14, ...dl(500) }}>
        <Tag tone="teal" size={22}>
          <Icon name="eyeOff" size={22} /> Loin de l’écran
        </Tag>
        <Tag tone="grey" size={22}>
          <Icon name="clock" size={22} /> On reprend à l’heure
        </Tag>
      </div>
    </div>
    <Timer id={`pause-${mod}-${minutes}-${title}`} minutes={minutes} label={title} cls={A.right} style={{ position: 'absolute', left: 1240, top: 300, width: 560, ...dl(300) }} />
  </Frame>
);

// Two-line "icon + title + explanation" row used by several modules.
const Row2 = ({ icon, tone, title, children, d = 0, cls }: { icon: IconName; tone: Tone; title: ReactNode; children: ReactNode; d?: number; cls?: string }) => (
  <div className={cls ?? A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 2 }}>{children}</div>
    </div>
  </div>
);

// Inline code chip (light).
const Ic = ({ children }: { children: ReactNode }) => (
  <code style={{ fontFamily: mono, fontSize: '0.86em', color: T.blue.fg, background: T.blue.bg, borderRadius: 6, padding: '1px 7px' }}>{children}</code>
);

// Quoted prompt.
const Pr = ({ children }: { children: ReactNode }) => (
  <span style={{ fontStyle: 'italic', color: C.navy, background: T.violet.bg, borderRadius: 6, padding: '1px 8px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{children}</span>
);

// Numbered step line used in lab panels.
const WStep = ({ n, children }: { n: number | string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
    <Num n={n} tone="green" size={34} style={{ marginTop: 2 }} />
    <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

// Lab step row: id, title, minutes, what to do, reprise command.
const LabStep = ({ id, title, min, children, d = 0 }: { id: string; title: ReactNode; min: number; children: ReactNode; d?: number }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr) 230px', gap: 20, alignItems: 'start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.green }}>{id}</div>
      <div style={{ fontSize: 18, color: C.muted, marginTop: 2 }}>{min} min</div>
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.42, marginTop: 4 }}>{children}</div>
    </div>
    <div style={{ alignSelf: 'center' }}>
      <div style={{ fontSize: 15, fontFamily: display, fontWeight: 700, letterSpacing: '0.1em', color: C.muted, textTransform: 'uppercase' }}>Bloqué ?</div>
      <div style={{ marginTop: 4, fontFamily: mono, fontSize: 17, color: T.navy.fg, background: T.navy.bg, borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>reprise {id}</div>
    </div>
  </div>
);

// Dark terminal line helpers.
const Sh = ({ children, c }: { children: ReactNode; c?: ReactNode }) => (
  <>
    <span style={{ color: '#8A8A98' }}>$ </span>
    {children}
    {c ? (
      <>
        {'  '}
        <Cc>{c}</Cc>
      </>
    ) : null}
    {'\n'}
  </>
);

// ─── Couverture ─────────────────────────────────────────────────────────────
const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color={C.electric} />
    <div style={{ position: 'absolute', left: 390, top: 120, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="blue" size={22}>
          <Icon name="calendar" size={22} /> Formation · 2 jours · 12 h
        </Tag>
        <Tag tone="navy" size={22}>
          <Icon name="code" size={22} /> Développeurs
        </Tag>
        <Tag tone="green" size={22}>
          <Icon name="flask" size={22} /> 80 % pratique
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 100, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Claude
        <br />
        <span style={{ color: C.electric }}>l’IA avancée pour les développeurs</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1180, ...dl(240) }}>
        Prompt engineering avancé, harness engineering, API et tool use, agents et Claude Code : faire entrer Claude <strong style={{ color: C.navy }}>au cœur</strong> du cycle de
        développement, avec des garde-fous.
      </p>
    </div>
    <Portrait w={170} x={390} y={680} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 704, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée au développement logiciel</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', right: 120, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, ...dl(600) }}>
      <Eyebrow c={C.muted} size={18}>
        Une formation {PROVIDER} pour {CLIENT}
      </Eyebrow>
      <LogoPlate which="both" h={84} pad={22} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Formateur ──────────────────────────────────────────────────────────────
const OStatCard = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const O_Formateur: Page = () => (
  <Frame mod={0}>
    <Title>Votre formateur</Title>
    <Portrait w={250} x={130} y={250} cls={A.in} />
    <div style={{ position: 'absolute', left: 490, top: 240, width: 1310, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.in} style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: C.navy }}>
        {AUTHOR}
      </div>
      <Bullet size={27} cls={A.left} style={dl(120)}>
        Expert IA &amp; ingénierie logicielle · Ingénieur IT et doctorant en intelligence artificielle
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(200)}>
        Développeur senior depuis 18 ans (Java, Python, Web) &amp; CEO de National Quantum
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(280)}>
        Chercheur, enseignant universitaire et consultant en transformation numérique
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(360)}>
        Utilisateur quotidien de Claude Code, de ses agents et de l’API dans des projets réels
      </Bullet>
    </div>
    <div style={{ position: 'absolute', left: 490, top: 660, width: 1310, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      <OStatCard icon="star" tone="blue" title="250+ sessions" d={500}>
        Formations animées en ingénierie logicielle et IA générative
      </OStatCard>
      <OStatCard icon="globe" tone="violet" title="60+ entreprises" d={600}>
        Accompagnées dans l’adoption concrète des outils IA
      </OStatCard>
      <OStatCard icon="users" tone="green" title="3 000+ apprenants" d={700}>
        Développeurs, profils techniques et équipes métiers
      </OStatCard>
    </div>
  </Frame>
);

// ─── Cadre de travail (présentiel) ──────────────────────────────────────────
const O_Cadre: Page = () => (
  <Frame mod={0}>
    <Title>Notre cadre de travail pour ces deux jours</Title>
    <Lede>En présentiel, chez {CLIENT}. Chacun sur son poste : je projette pour les démos, vous codez sur le vôtre, avec votre propre Claude.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Card title="Ateliers 100 % individuels" icon="target" tone="green" size={23} pad={24} cls={A.in} style={dl(100)}>
        Minuteur affiché, point d’étape oral toutes les 20 minutes. Bloqué ? Une commande de reprise vous remet au bon endroit.
      </Card>
      <Card title="Claude Code, sans VS Code" icon="terminal" tone="navy" size={23} pad={24} cls={A.in} style={dl(200)}>
        L’application de bureau Claude (onglet Code) ou claude.ai/code, plus un terminal pour lancer les tests.
      </Card>
      <Card title="Votre stack, au choix" icon="layers" tone="blue" size={23} pad={24} cls={A.in} style={dl(300)}>
        Le même projet existe en TypeScript, Python, Java et .NET : mêmes étapes, mêmes tests, mêmes reprises.
      </Card>
      <Card title="Zéro donnée réelle" icon="shield" tone="coral" size={23} pad={24} cls={A.in} style={dl(400)}>
        Ni code client, ni secret, ni donnée personnelle réelle : l’entreprise du fil rouge est fictive, exprès.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="teal" icon="clock" title="Rythme" size={25} cls={A.in} style={dl(550)}>
        9 h 00 – 15 h 30, déjeuner de 12 h 00 à 12 h 30, une pause de 10 minutes le matin et une l’après-midi, loin de l’écran.
      </Callout>
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table &amp; point de départ</Title>
    <Lede>Dites-moi à voix haute le numéro qui vous correspond : je compte les voix à l’écran.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1040 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage de Claude aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-p1" tone="grey" icon="chat" label="1 · Conversation sur claude.ai, de temps en temps" />
        <PollRow id="o-p2" tone="blue" icon="code" label="2 · Tous les jours pour écrire ou expliquer du code" />
        <PollRow id="o-p3" tone="teal" icon="terminal" label="3 · J’ai déjà essayé Claude Code" />
        <PollRow id="o-p4" tone="violet" icon="plug" label="4 · J’ai déjà appelé l’API ou écrit un agent" />
      </Poll>
      <Eyebrow c={C.navy} style={{ margin: '26px 0 14px' }}>
        Ma stack pour les ateliers
      </Eyebrow>
      <Poll>
        <PollRow id="o-l1" tone="yellow" icon="code" label="5 · TypeScript / Node" />
        <PollRow id="o-l2" tone="green" icon="code" label="6 · Python" />
        <PollRow id="o-l3" tone="coral" icon="code" label="7 · Java" />
        <PollRow id="o-l4" tone="violet" icon="code" label="8 · .NET (C#)" />
      </Poll>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 260, width: 570, ...dl(250) }}>
      <Card title="Tour de table express (30 s)" icon="chat" tone="navy" size={23} pad={26}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Strong>1.</Strong> Votre prénom
          </div>
          <div>
            <Strong>2.</Strong> Votre projet ou votre rôle chez {CLIENT}
          </div>
          <div>
            <Strong>3.</Strong> La tâche que vous aimeriez confier à Claude dès lundi
          </div>
        </div>
      </Card>
      <Hint style={{ marginTop: 22 }}>Dans l’ordre des places, 30 secondes chacun.</Hint>
    </div>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <div style={{ fontSize: 26, lineHeight: 1.3, color: C.ink }}>{children}</div>
  </div>
);

const OBar = ({ label, value, pct, bg, c, d }: { label: string; value: string; pct: number; bg: string; c: string; d: number }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, color: C.ink }}>
      <span>{label}</span>
      <strong style={{ color: c }}>{value}</strong>
    </div>
    <div style={{ marginTop: 6, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: '100%', background: bg, ...dl(d) }} />
    </div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Les 5 objectifs de vos deux jours</Title>
    <Lede>À la fin de la formation, vous serez capables de :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <OObj n={1} tone="blue" d={100}>
        Maîtriser le <strong>prompt engineering avancé</strong> : structure XML, exemples dynamiques, raisonnement, prompt caching
      </OObj>
      <OObj n={2} tone="navy" d={180}>
        Pratiquer le <strong>harness engineering</strong> : encadrer, vérifier et évaluer ce que produit l’IA
      </OObj>
      <OObj n={3} tone="teal" d={260}>
        <strong>Automatiser</strong> un workflow avec l’API Claude, les sorties structurées et le tool use
      </OObj>
      <OObj n={4} tone="violet" d={340}>
        Utiliser <strong>Claude Code</strong> : agents, Skills, hooks, sous-agents, dans un vrai dépôt
      </OObj>
      <OObj n={5} tone="pink" d={420}>
        Explorer le <strong>Model Context Protocol</strong> (MCP) et savoir quand le préférer à un script
      </OObj>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 250, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(450) }}>
        <Eyebrow c={C.navy} size={19}>
          Le temps des deux jours (12 h)
        </Eyebrow>
        <OBar label="Ateliers individuels" value="≈ 8 h 15" pct={69} bg={G.green} c={C.green} d={600} />
        <OBar label="Apports et démonstrations" value="≈ 2 h 15" pct={19} bg={G.blue} c={C.blue} d={700} />
        <OBar label="QCM, restitutions, bilans" value="≈ 1 h 30" pct={12} bg={G.violet} c={C.violet} d={800} />
      </div>
      <Callout tone="green" icon="flask" title="80 % de pratique" size={23} cls={A.right} style={dl(900)}>
        Chaque notion est suivie d’un atelier sur le même dépôt.
      </Callout>
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 22, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 48 }}>
      <OHalf icon="note" tone="blue" title="Jour 1" sub="Prompt engineering et harness engineering" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT} · QCM d’entrée`} tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="Au-delà des bases" sub="Gamme 2026, réflexion, effort, caching, sorties structurées" tone="blue" d={230} />
        <OSlot t="9:55" mod="M2" title="Prompt engineering avancé" sub="XML, exemples dynamiques, raisonnement · Atelier 1" tone="navy" d={310} />
        <OSlot t="12:30" mod="M3" title="Harness engineering" sub="Contrat, garde-fous, boucle, juge · Atelier 2" tone="violet" d={390} />
        <OSlot t="14:30" mod="M3" title="Évaluer avant d’affirmer" sub="Mini-évaluation sur 12 cas de référence" tone="violet" d={470} />
        <OSlot t="15:10" title="Restitution · QCM du jour · bilan" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="bot" tone="violet" title="Jour 2" sub="API, automatisation, agents et Claude Code" d={200}>
        <OSlot t="9:00" title="Reprise · quiz du Jour 1" tone="grey" d={450} />
        <OSlot t="9:15" mod="M4" title="API, tool use et automatisation" sub="Formulaire → Claude → base des demandes · Atelier 3" tone="teal" d={530} />
        <OSlot t="11:25" mod="M5" title="Agents et Claude Code" sub="MCP, CLAUDE.md, Skills, hooks, sous-agents · Atelier 4" tone="violet" d={610} />
        <OSlot t="14:25" mod="M6" title="Défi final" sub="Une demande métier livrée en autonomie · Atelier 5" tone="pink" d={690} />
        <OSlot t="15:00" title="Restitution · QCM final · clôture" tone="grey" d={770} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 975, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le Jour 1, M4 → M6 le Jour 2.
    </div>
  </Frame>
);

// ─── Fil rouge ──────────────────────────────────────────────────────────────
const OPipe = ({ icon, tone, title, sub, d }: { icon: IconName; tone: Tone; title: string; sub: string; d: number }) => (
  <div className={A.pop} style={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={78} solid />
    <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title size={48}>
      Fil rouge : <span style={{ color: C.electric }}>{PROJECT}</span>, le portail des demandes d’Oasis Digital
    </Title>
    <Lede>Une ESN fictive reçoit les demandes de ses clients par un formulaire libre. Aujourd’hui, un chargé de compte relit et recopie tout à la main.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 250px)', columnGap: 107, justifyContent: 'space-between' }}>
      <OPipe icon="inbox" tone="grey" title="Formulaire web" sub="texte libre, fautes, urgences criées" d={100} />
      <OPipe icon="sparkles" tone="blue" title="Claude extrait" sub="type, priorité, client, contact, résumé" d={300} />
      <OPipe icon="shieldCheck" tone="navy" title="Garde-fous" sub="schéma, règles métier, injection" d={500} />
      <OPipe icon="database" tone="teal" title="Base des demandes" sub="SQLite local, ou Notion en option" d={700} />
      <OPipe icon="chart" tone="green" title="Tableau de bord" sub="demandes qualifiées, triées" d={900} />
    </div>
    <svg width={1680} height={40} style={{ position: 'absolute', left: 120, top: 330 }} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${250 + i * 357 + 20} 20 H ${250 + i * 357 + 87}`} stroke={C.faint} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 10" className={A.march} />
      ))}
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 590, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="note" tone="blue" title="Jour 1 · le cœur" size={22} pad={22} cls={A.in} style={dl(1100)}>
        Les prompts qui extraient et qualifient, puis le harnais qui les vérifie et les évalue.
      </Card>
      <Card icon="plug" tone="teal" title="Jour 2 matin · le pipeline" size={22} pad={22} cls={A.in} style={dl(1200)}>
        L’API Claude, les sorties structurées et la boucle d’outils, branchées sur l’interface web.
      </Card>
      <Card icon="bot" tone="violet" title="Jour 2 après-midi · l’atelier agentique" size={22} pad={22} cls={A.in} style={dl(1300)}>
        Claude Code fait évoluer le dépôt : CLAUDE.md, Skill, hooks, MCP, sous-agent relecteur.
      </Card>
    </div>
  </Frame>
);

// ─── Trois moteurs ──────────────────────────────────────────────────────────
const OMoteur = ({ name, tone, icon, title, cost, children, d }: { name: string; tone: Tone; icon: IconName; title: string; cost: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: T[tone].fg, background: T[tone].bg, borderRadius: 10, padding: '4px 12px' }}>MOTEUR={name}</span>
      <IconTile name={icon} tone={tone} size={50} />
    </div>
    <div style={{ marginTop: 16, fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.45, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 14 }}>
      <Tag tone={tone} size={19}>
        <Icon name="euro" size={19} /> {cost}
      </Tag>
    </div>
  </div>
);

const O_Moteurs: Page = () => (
  <Frame mod={0}>
    <Title>Pas de clé API ? Trois moteurs interchangeables</Title>
    <Lede>Votre licence Claude Team ou Enterprise donne Claude Code, pas l’API. Le code du fil rouge appelle donc Claude à travers une interface à trois moteurs.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 286, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      <OMoteur name="simu" tone="teal" icon="server" title="Simulateur local" cost="Gratuit, hors ligne" d={100}>
        Un petit serveur qui parle le format de l’API Messages. Le <strong>SDK officiel</strong> pointe dessus : vous écrivez du vrai code API, réponses déterministes.
      </OMoteur>
      <OMoteur name="claude-cli" tone="blue" icon="terminal" title="Le vrai modèle, par Claude Code" cost="Inclus dans la licence" d={250}>
        Votre code lance <Ic>claude -p --json-schema …</Ic> : vraie extraction, vraie évaluation, avec votre compte.
      </OMoteur>
      <OMoteur name="api" tone="violet" icon="key" title="L’API, avec une clé" cost="Facturé à l’usage" d={400}>
        Si une clé API est fournie : même code, on change une variable. C’est la cible en production.
      </OMoteur>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      <Callout tone="navy" icon="shield" title="Première leçon de harness engineering" size={24} cls={A.in} style={dl(700)}>
        Le code métier ne connaît que l’interface <Ic>MoteurClaude</Ic>. On peut le tester sans réseau, rejouer un cas, changer de fournisseur : la dépendance au modèle est isolée.
      </Callout>
    </div>
  </Frame>
);

// ─── Le kit d'ateliers ──────────────────────────────────────────────────────
const OKitRow = ({ path, children }: { path: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: 16, alignItems: 'baseline' }}>
    <PathChip size={20}>{path}</PathChip>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const O_Kit: Page = () => (
  <Frame mod={0}>
    <Title>Votre kit : le dépôt {REPO}</Title>
    <Lede>Un modèle de dépôt GitHub et le bouton « Labs » de ce support. Un seul outil en ligne de commande pour toutes les stacks.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PanelTitle icon="archive">Ce qu’il contient</PanelTitle>
      <OKitRow path="ts/ python/">la même application en TypeScript et en Python…</OKitRow>
      <OKitRow path="java/ dotnet/">… en Java (Spring Boot) et en .NET (ASP.NET Core)</OKitRow>
      <OKitRow path="web/">l’interface web commune : formulaire et tableau de bord</OKitRow>
      <OKitRow path="simulateur/">le faux serveur API et ses scénarios enregistrés</OKitRow>
      <OKitRow path="donnees/">12 demandes de référence, dont 2 pièges</OKitRow>
      <OKitRow path="ateliers/">un énoncé par atelier, étape par étape</OKitRow>
      <OKitRow path="guichet.mjs">l’outil commun : poste, tests, garde, reprise…</OKitRow>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 262, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodeDark file={`Terminal · ${REPO}`} size={20} cls={A.right} style={dl(200)}>
        <Sh c="# une fois">node guichet.mjs init python</Sh>
        <Sh c="# prérequis">node guichet.mjs poste</Sh>
        <Sh c="# simulateur :8787">node guichet.mjs simu</Sh>
        <Sh c="# appli web :3000">node guichet.mjs lancer</Sh>
        <Sh c="# étape réussie ?">node guichet.mjs verifier A3.2</Sh>
        <Sh c="# rattraper">node guichet.mjs reprise A3.2</Sh>
      </CodeDark>
      <Callout tone="green" icon="flask" title="Des tests rouges au départ" size={23} cls={A.right} style={dl(400)}>
        Chaque étape les fait passer au vert. <Ic>verifier</Ic> dit si l’étape est réussie ; <Ic>reprise</Ic> vous amène au début de l’étape suivante.
      </Callout>
    </div>
  </Frame>
);

// ─── Vérification du poste ──────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Atelier 0 · vérification du poste</Title>
    <Lede>La fiche d’accueil l’a préparée il y a une semaine. Chacun vérifie à nouveau sur son poste, maintenant.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <CheckItem id="su1" size={25}>Dépôt cloné, stack choisie : node guichet.mjs init &lt;stack&gt;</CheckItem>
        <CheckItem id="su2" size={25}>node guichet.mjs poste affiche « poste prêt »</CheckItem>
        <CheckItem id="su3" size={25}>Application Claude ouverte, onglet Code, connectée à votre compte</CheckItem>
        <CheckItem id="su4" size={25}>Dans un terminal : claude -p "Dis bonjour" répond</CheckItem>
        <CheckItem id="su5" size={25}>Simulateur et appli lancés : http://localhost:3000 s’affiche</CheckItem>
        <CheckItem id="su6" size={25}>node guichet.mjs verifier A0 : tout est vert</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={5} label="Vérification" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Une ligne qui coince ?" tone="blue" icon="plug" cls={A.right} style={dl(400)} size={23}>
          Dites-le tout de suite : je passe vous voir. En attendant, suivez sur l’écran projeté.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ─── QCM d'entrée ───────────────────────────────────────────────────────────
const O_Qcm: Page = () => (
  <Frame mod={0} kind="qcm">
    <Title>QCM d’entrée : six idées reçues à tester</Title>
    <QuizSeries y={210}>
      <QuizQ
        q="Pour obtenir du JSON fiable de Claude en 2026, le plus sûr est…"
        explain="Les sorties structurées (output_config.format) contraignent la génération au schéma JSON fourni. Le pré-remplissage de la réponse n’existe plus sur les modèles récents."
      >
        <QOpt>d’écrire « RÉPONDS UNIQUEMENT EN JSON » en majuscules</QOpt>
        <QOpt>de pré-remplir le début de la réponse avec une accolade</QOpt>
        <QOpt ok>d’utiliser les sorties structurées avec un schéma JSON</QOpt>
        <QOpt>de baisser la température à 0</QOpt>
      </QuizQ>
      <QuizQ q="Votre licence Claude Team ou Enterprise vous permet d’appeler l’API depuis votre code…" explain="Non : l’abonnement donne claude.ai et Claude Code. L’API se paie à l’usage, avec une clé créée dans la console Anthropic. D’où les trois moteurs du fil rouge.">
        <QOpt ok>non : l’API demande une clé distincte, facturée à l’usage</QOpt>
        <QOpt>oui, avec le même identifiant de connexion</QOpt>
        <QOpt>oui, mais seulement avec le modèle Haiku</QOpt>
        <QOpt>oui, à condition de rester en local</QOpt>
      </QuizQ>
      <QuizQ q="Avec le prompt caching, qu’est-ce qui est mis en cache ?" explain="Le préfixe identique de la requête : outils, puis instructions système, puis le début des messages. Un seul octet qui change dans ce préfixe invalide tout ce qui suit.">
        <QOpt>la réponse de Claude, pour la resservir telle quelle</QOpt>
        <QOpt>l’historique de toutes les conversations de l’équipe</QOpt>
        <QOpt>les fichiers du dépôt, indexés une fois pour toutes</QOpt>
        <QOpt ok>le début identique de la requête : outils, système, premiers messages</QOpt>
      </QuizQ>
      <QuizQ q="Quel garde-fou garantit qu’aucun secret n’est écrit dans le code généré ?" explain="Une consigne dans le prompt réduit le risque, elle ne le supprime pas. Un contrôle déterministe (script, hook) bloque à coup sûr ce qu’il sait détecter.">
        <QOpt>la phrase « n’écris jamais de secret » dans le prompt</QOpt>
        <QOpt ok>un script ou un hook qui analyse le code et bloque l’écriture</QOpt>
        <QOpt>un modèle plus puissant, réglé sur l’effort maximal</QOpt>
        <QOpt>un exemple de bon code dans le prompt</QOpt>
      </QuizQ>
      <QuizQ q="Une Skill de Claude Code, c’est…" explain="Un dossier avec un fichier SKILL.md (et parfois des scripts). Claude ne lit que sa description au départ, et charge le reste quand la tâche correspond.">
        <QOpt>une extension à installer dans VS Code</QOpt>
        <QOpt ok>un dossier SKILL.md chargé à la demande quand la tâche correspond</QOpt>
        <QOpt>un modèle spécialisé, entraîné sur votre code</QOpt>
        <QOpt>un serveur MCP déguisé</QOpt>
      </QuizQ>
      <QuizQ q="Le Model Context Protocol (MCP) sert à…" explain="MCP est un protocole ouvert : un serveur expose des outils, des ressources et des prompts ; n’importe quel client compatible (Claude Code, l’app Claude…) peut s’y brancher.">
        <QOpt ok>brancher des outils et des données à un agent par un protocole standard</QOpt>
        <QOpt>entraîner Claude sur les données de l’entreprise</QOpt>
        <QOpt>chiffrer les prompts envoyés au modèle</QOpt>
        <QOpt>compresser la fenêtre de contexte</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Formateur, O_Cadre, O_Poll, O_Objectifs, O_Programme, O_FilRouge, O_Moteurs, O_Kit, O_Setup, O_Qcm];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · COUVERTURE · J1 9:00

OBJECTIF — Accueillir le groupe et poser la promesse : sortir de l’usage conversationnel pour mettre Claude au cœur du cycle de développement, avec des garde-fous.

DIRE — « Bonjour à toutes et à tous, bienvenue dans cette formation Claude pour les développeurs, que GoMyCode organise pour Wevioo. Deux jours, quatre-vingts pour cent de pratique : vous allez écrire des prompts mesurés, un harnais qui vérifie ce que Claude produit, un pipeline qui appelle l’API, et un environnement Claude Code complet sur un vrai dépôt. »

ANIMATION — Laisser la page affichée pendant l’installation. Saluer chaque arrivant par son prénom.

TRANSITION — « Quelques mots sur moi. »`,
  `⏱ 2 min · FORMATEUR

OBJECTIF — Asseoir la légitimité en une minute, sans s’étendre.

DIRE — « Je suis développeur depuis dix-huit ans, en Java, Python et Web, chercheur en intelligence artificielle, et je forme des équipes à ces outils depuis huit ans. J’utilise Claude Code et l’API tous les jours : ce que je vais vous montrer, ce sont des usages réels, avec leurs limites. »

TRANSITION — « Voici notre cadre de travail. »`,
  `⏱ 2 min · CADRE DE TRAVAIL

OBJECTIF — Fixer les règles : ateliers individuels, Claude Code sans VS Code, stack au choix, aucune donnée réelle, horaires.

DIRE — « Tous les ateliers sont individuels, chacun sur son poste. Je ferai un point d’étape à voix haute toutes les vingt minutes ; si vous êtes bloqué, levez les yeux de l’écran et appelez-moi, je passe. Et si vous prenez du retard, une commande de reprise vous remet au début de l’étape suivante : personne ne reste sur le carreau. »

DIRE — « On travaille avec l’application de bureau Claude, onglet Code, ou avec claude.ai/code, plus un terminal. Pas besoin de VS Code. Le projet existe en quatre langages : prenez celui de votre quotidien. Et la règle d’or : aucune donnée réelle de Wevioo ou d’un client dans les prompts pendant la formation. »

TRANSITION — « Faisons connaissance. »`,
  `⏱ 3 min · TOUR DE TABLE (vote oral)

OBJECTIF — Connaître le niveau réel et la répartition des stacks pour doser les démos.

DIRE — « Premier vote, à voix haute : votre usage de Claude aujourd’hui, de 1 à 4. » Cliquer une ligne par voix. « Deuxième vote : votre stack pour les ateliers, de 5 à 8. » Puis : « Tour de table express, trente secondes chacun, dans l’ordre des places : prénom, projet ou rôle, et la tâche que vous aimeriez confier à Claude dès lundi. »

ANIMATION — Noter les tâches citées : y revenir au Module 5 (Skills, hooks) et pendant le défi final.

TRANSITION — « Voici ce que vous saurez faire à la fin. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les cinq objectifs du programme et la part de pratique.

DIRE — « Cinq objectifs, ceux du programme : le prompt engineering avancé, le harness engineering, l’automatisation par l’API, Claude Code avec ses agents et ses Skills, et MCP. Le deuxième est le fil conducteur des deux jours : un modèle seul ne suffit pas, c’est le harnais autour qui rend le résultat fiable. »

ANIMATION — À droite : environ huit heures d’ateliers sur douze.

TRANSITION — « Le déroulé des deux jours. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère du bandeau.

DIRE — « Jour 1 : le cœur. On voit ce qui a changé chez Claude en 2026, on écrit des prompts de code qu’on mesure, puis on construit le harnais : contrat, garde-fous, boucle de correction, évaluation. Jour 2 : on passe à l’API, avec un vrai pipeline d’automatisation, puis à Claude Code, où vous construirez tout l’environnement agentique du dépôt, avant un défi final en autonomie. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe. Pauses : 10 h 15 et 14 h 20 le Jour 1, 11 h 15 et 14 h 15 le Jour 2.

TRANSITION — « Parlons du projet sur lequel vous allez travailler. »`,
  `⏱ 2 min · FIL ROUGE GUICHET

OBJECTIF — Présenter Guichet et ce que chaque demi-journée y ajoute.

DIRE — « Oasis Digital est une ESN fictive. Ses clients déposent leurs demandes dans un formulaire libre : “notre appli plante depuis la mise à jour, c’est urgent, rappelez Karim au 22 333 444”. Aujourd’hui, quelqu’un relit, requalifie et recopie. Notre but : que Claude extraie et qualifie chaque demande, que des garde-fous vérifient, et que la demande arrive propre dans une base, visible dans un tableau de bord web. »

DIRE — « En bas, ce que chaque demi-journée ajoute : les prompts et le harnais aujourd’hui, le pipeline API demain matin, et l’environnement Claude Code demain après-midi. »

TRANSITION — « Une question pratique d’abord : comment appeler Claude sans clé API ? »`,
  `⏱ 2 min · TROIS MOTEURS

OBJECTIF — Lever l’obstacle « pas de clé API » et présenter l’interface MoteurClaude.

DIRE — « Votre licence Team ou Enterprise vous donne Claude Code, pas l’API : l’API se paie à part, avec une clé. On a donc trois moteurs. Le simulateur, par défaut : un petit serveur local qui répond comme l’API ; vous écrivez du vrai code avec le SDK officiel d’Anthropic, et il tourne sans réseau ni coût. Claude-cli : votre code appelle claude -p, donc le vrai modèle, avec votre licence. Et api, si un jour vous avez une clé : même code. »

DIRE — « Et retenez la leçon : le code métier ne connaît que l’interface. C’est déjà du harness engineering. »

ANIMATION — Si Wevioo a fourni des clés API, le dire ici : MOTEUR=api est alors utilisable dès l’Atelier 3.

TRANSITION — « Voici le dépôt. »`,
  `⏱ 2 min · KIT D’ATELIERS

OBJECTIF — Montrer ce que contient le dépôt et l’outil commun guichet.mjs.

DIRE — « Le dépôt contient la même application en quatre langages, une interface web commune, le simulateur, douze demandes de référence dont deux pièges, et les énoncés. Un seul outil pour tout le monde, quel que soit votre langage : node guichet.mjs. Init choisit votre stack, poste vérifie les prérequis, simu et lancer démarrent le simulateur et l’appli, verifier dit si une étape est réussie, et reprise vous remet au début de l’étape suivante si vous êtes bloqué. »

DIRE — « Les corrigés des reprises sont stockés compressés : un agent ne peut pas aller les copier en douce. »

TRANSITION — « Cinq minutes pour vérifier vos postes. »`,
  `⏱ 5 min · ATELIER 0 · VÉRIFICATION DU POSTE (minuteur 5 min)

OBJECTIF — Vérifier que chacun peut travailler : stack choisie, prérequis, Claude Code connecté, claude -p, appli lancée.

DIRE — « Cinq minutes. Normalement, tout est prêt grâce à la fiche d’accueil ; on vérifie quand même, ligne par ligne. La quatrième ligne est la plus importante pour aujourd’hui : claude -p doit répondre dans un terminal, c’est lui qui sert de moteur réel. »

ANIMATION — Lancer le minuteur, passer dans les rangs. Ceux qui n’ont pas répondu à la fiche d’accueil sont les plus à risque : commencer par eux. claude -p bloqué (réseau, proxy) : ils travaillent avec MOTEUR=simu et suivent la partie claude-cli sur l’écran projeté.

TRANSITION — « Tout le monde est prêt ? Testons six idées reçues. »`,
  `⏱ 7 min · QCM D’ENTRÉE (vote oral)

OBJECTIF — Faire émerger les idées reçues que la formation va corriger, sans noter personne.

DIRE — « Six questions, vous votez à voix haute avec la lettre, je clique la réponse majoritaire. Ce n’est pas noté : c’est pour savoir où on part. »

ANIMATION — Une minute par question. Ne pas développer les explications : chaque question renvoie à un module. Q1 et Q3 → Module 1, Q2 → les trois moteurs, Q4 → Module 3, Q5 et Q6 → Module 5. Noter les questions ratées par la majorité pour insister plus tard.

TRANSITION — « Allons au-delà des bases. Module 1. »`,
];
// @@NOTES-END
