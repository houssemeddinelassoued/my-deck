// ─── Ouverture Jour 1 ───────────────────────────────────────────────────────

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 2 jours · 14 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="sparkles" size={22} /> Édition 2026
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{
          margin: '34px 0 0',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: C.navy,
          ...dl(120),
        }}
      >
        <span style={{ color: C.plum }}>Développeurs</span> <span style={{ color: C.navy, fontWeight: 500 }}>│</span> Boostez vos
        <br />
        performances grâce à l’IA
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 980, ...dl(240) }}>
        Intégrer l’IA dans votre workflow, automatiser ce qui doit l’être, sécuriser vos usages et{' '}
        <strong style={{ color: C.navy }}>garder le contrôle</strong> de vos livrables.
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1330, top: 470, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>
        Together we grow
      </div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Concepteur du cahier de TP « FrigoMalin »</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="green" size={19}>
          <Icon name="code" size={19} /> GitHub Copilot
        </Tag>
        <Tag tone="blue" size={19}>
          <Icon name="bot" size={19} /> Agents
        </Tag>
        <Tag tone="coral" size={19}>
          <Icon name="shield" size={19} /> Sécurité
        </Tag>
        <Tag tone="violet" size={19}>
          <Icon name="checkCircle" size={19} /> Qualité
        </Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 720, ...dl(600) }}>
      <DapLogo size={40} stacked />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Votre formateur & la promesse ──────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Deux jours pour passer à la pratique</Title>
    <Lede>Une formation construite autour d’un vrai projet, livré en ligne à la fin du jour 2.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur · auteur des labs FrigoMalin</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={14} suffix=" h" />} label="de formation sur 2 jours, dont plus de 60 % de pratique" tone="blue" d={150} />
      <OPromise value={<CountUp to={23} />} label="labs essentiels sur le projet fil rouge (+ 8 labs bonus)" tone="green" d={280} />
      <OPromise value={<CountUp to={1} />} label="application publiée sur GitHub Pages, testable sur votre téléphone" tone="violet" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec une méthode, des fichiers de configuration réutilisables dans vos dépôts et un plan d’action personnel.
        Le formateur montre, vous pratiquez : <strong>c’est vous qui tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA est un accélérateur, mais c’est le développeur qui crée la valeur. »
    </div>
  </Frame>
);

// ─── Organisation ───────────────────────────────────────────────────────────
const ODayBar = ({ day, d }: { day: string; d: number }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{day}</span>
      <span style={{ fontSize: 22, color: C.muted }}>9:00 → 17:30</span>
    </div>
    <div style={{ display: 'flex', height: 76, borderRadius: 14, overflow: 'hidden', boxShadow: SHADOW_SM }}>
      <div style={{ flex: 90, background: T.blue.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 600, color: T.blue.fg }}>9:00</div>
      <div style={{ flex: 15, background: T.yellow.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="clock" size={22} color={T.yellow.fg} />
      </div>
      <div style={{ flex: 105, background: T.blue.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 600, color: T.blue.fg }}>→ 12:30</div>
      <div style={{ flex: 90, background: C.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, color: C.muted }}>Déjeuner</div>
      <div style={{ flex: 90, background: T.violet.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 600, color: T.violet.fg }}>14:00</div>
      <div style={{ flex: 15, background: T.yellow.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="clock" size={22} color={T.yellow.fg} />
      </div>
      <div style={{ flex: 105, background: T.violet.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 600, color: T.violet.fg }}>→ 17:30</div>
    </div>
  </div>
);

const ORule = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 29, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const O_Orga: Page = () => (
  <Frame mod={0}>
    <Title>Organisation des deux journées</Title>
    <Lede>Deux demi-journées par jour, deux pauses de 15 minutes, et des règles simples.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 900, display: 'flex', flexDirection: 'column', gap: 52 }}>
      <ODayBar day="Jour 1" d={100} />
      <ODayBar day="Jour 2" d={220} />
      <div className={A.fade} style={{ display: 'flex', gap: 22, fontSize: 21, color: C.muted, ...dl(400) }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="clock" size={22} color={T.yellow.fg} /> pauses vers 10:30 et 15:30
        </span>
        <span>· horaires ajustés au rythme du groupe</span>
      </div>
      <Callout title="En distanciel" tone="navy" icon="eye" style={dl(500)} cls={A.in}>
        Caméra allumée autant que possible, micro coupé hors échanges, questions à l’oral ou dans le chat.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <ORule icon="chat" tone="blue" title="Vos questions sont bienvenues" d={200}>
        À tout moment. Celles qui nous éloignent du fil vont au « parking » et sont traitées avant la fin.
      </ORule>
      <ORule icon="users" tone="green" title="On travaille en binôme" d={320}>
        Un pilote au clavier, un copilote qui relit le prompt et le diff. On inverse à chaque lab.
      </ORule>
      <ORule icon="note" tone="violet" title="Évaluation à chaque demi-journée" d={440}>
        Une fiche courte : ce qui est clair, ce qui ne l’est pas encore. Elle ajuste la suite.
      </ORule>
      <ORule icon="lock" tone="coral" title="Zéro donnée réelle dans les prompts" d={560}>
        Ni code client, ni secret, ni donnée personnelle : FrigoMalin est fait pour ça.
      </ORule>
    </div>
  </Frame>
);

// ─── Tour de table : sondages ───────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : où en êtes-vous avec l’IA ?</Title>
    <Lede>Main levée (ou réaction dans le chat) : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage actuel de l’IA pour coder
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais ou presque" tone="grey" icon="x" />
        <PollRow id="o-u2" label="Un chat IA de temps en temps" tone="blue" icon="chat" />
        <PollRow id="o-u3" label="Un assistant dans l’IDE au quotidien" tone="teal" icon="code" />
        <PollRow id="o-u4" label="Des agents qui modifient mon code" tone="violet" icon="bot" />
        <PollRow id="o-u5" label="Des agents orchestrés, jusqu’en CI" tone="pink" icon="route" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1080, top: 270, width: 720, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon attente n° 1
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="Gagner du temps au quotidien" tone="green" icon="bolt" />
        <PollRow id="o-a2" label="Mieux tester et fiabiliser" tone="blue" icon="checkCircle" />
        <PollRow id="o-a3" label="Sécuriser nos usages" tone="coral" icon="shield" />
        <PollRow id="o-a4" label="Cadrer l’usage en équipe" tone="yellow" icon="users" />
        <PollRow id="o-a5" label="Comprendre les agents" tone="violet" icon="brain" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Gardez ces résultats en tête : on y reviendra au module 7 pour votre plan d’action.
    </Hint>
  </Frame>
);

// ─── Objectifs pédagogiques ─────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 24, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '24px 28px', ...dl(d) }}>
    <Num n={n} tone={tone} size={58} />
    <div style={{ fontSize: 30, lineHeight: 1.35, color: C.ink }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs pédagogiques</Title>
    <Lede>À l’issue de la formation, vous utiliserez l’IA comme un assistant au service du développement. Vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Intégrer</strong> des outils d’IA dans votre workflow de développement
      </OObj>
      <OObj n={2} tone="violet" d={220}>
        <strong>Automatiser</strong> certaines tâches grâce aux assistants et aux agents
      </OObj>
      <OObj n={3} tone="pink" d={340}>
        <strong>Évaluer les risques</strong> de l’IA générative dans un développement sécurisé
      </OObj>
      <OObj n={4} tone="green" d={460}>
        <strong>Appliquer les bonnes pratiques</strong> de cybersécurité : données sensibles, code confidentiel
      </OObj>
      <OObj n={5} tone="navy" d={580}>
        <strong>Garder le contrôle</strong> sur la qualité et la conformité de vos livrables
      </OObj>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1240, top: 280, width: 560, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
      <Eyebrow c={C.navy}>Répartition du temps</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.ink }}>
            <span>Labs, ateliers, études de cas</span>
            <strong style={{ color: C.green }}>≥ 60 %</strong>
          </div>
          <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
            <div className={A.grow} style={{ width: '62%', height: '100%', background: G.green, ...dl(600) }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.ink }}>
            <span>Apports et démonstrations</span>
            <strong style={{ color: C.blue }}>≈ 30 %</strong>
          </div>
          <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
            <div className={A.grow} style={{ width: '30%', height: '100%', background: G.blue, ...dl(750) }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.ink }}>
            <span>QCM et évaluations</span>
            <strong style={{ color: C.violet }}>≈ 8 %</strong>
          </div>
          <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
            <div className={A.grow} style={{ width: '8%', height: '100%', background: G.violet, ...dl(900) }} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
        Évaluation continue : questions orales, QCM, labs, études de cas. Auto-positionnement au début et à la fin.
      </div>
    </div>
  </Frame>
);

// ─── Programme des deux jours ───────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 23, color: C.muted, paddingTop: 4 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 11, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 22, color: C.muted, lineHeight: 1.38, marginTop: 4 }}>{sub}</div> : null}
    </div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 810, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <IconTile name="code" tone="blue" size={50} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Jour 1</div>
          <div style={{ fontSize: 21, color: C.muted }}>Découvrir et intégrer l’IA dans le workflow</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <OSlot t="9:00" title="Ouverture · fil rouge FrigoMalin" tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="Panorama des outils IA" sub="Comprendre les LLM · typologie · critères · atelier comparatif · labs 1.1–1.2" tone="blue" d={250} />
        <OSlot t="11:30" mod="M2" title="Intégrer l’IA dans le workflow" sub="Modes, prompting, contexte · labs 2.1 → 3.4" tone="violet" d={350} />
        <OSlot t="15:45" mod="M3" title="Limites & précautions" sub="Défauts, licences, sécurité des prompts · lab 3.2 · audit collaboratif" tone="coral" d={450} />
        <OSlot t="17:10" mod="IS" title="Lancement de l’intersession" sub="Votre cas d’usage + maquettes Stitch (lab 4.1)" tone="yellow" d={550} />
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 990, top: 190, width: 810, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <IconTile name="shieldCheck" tone="violet" size={50} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Jour 2</div>
          <div style={{ fontSize: 21, color: C.muted }}>Sécurité, optimisation et mise en pratique</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <OSlot t="9:00" mod="M4" title="Exploitation de l’intersession" sub="Retours d’expérience · sprint skills & features · labs 4.2 → 5.4" tone="teal" d={350} />
        <OSlot t="11:15" mod="M5" title="Cybersécurité & IA" sub="Risques, secrets, données, journalisation, cadre légal · analyse d’incidents" tone="coral" d={450} />
        <OSlot t="14:00" mod="M6" title="Évaluer & fiabiliser le code" sub="Agents spécialisés, hooks, tests, optimisation · labs 6.1 → 8.2 · binômes" tone="green" d={550} />
        <OSlot t="16:55" mod="M7" title="Synthèse & plan d’action" sub="CI/CD et mise en ligne · lab 9.1 · votre feuille de route" tone="navy" d={650} />
        <OSlot t="17:30" title="Fin · évaluation à chaud" tone="grey" d={750} />
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 900, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(900) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3, intersession (IS), puis M4 → M7.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, honnêtement. On refera l’exercice à la fin du jour 2.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CheckItem id="ap1" size={28}>Expliquer pourquoi un LLM peut « halluciner » une API ou un paquet</CheckItem>
        <CheckItem id="ap2" size={28}>Choisir un outil d’IA selon des critères explicites (coût, confidentialité…)</CheckItem>
        <CheckItem id="ap3" size={28}>Écrire un prompt avec rôle, contexte ciblé, tâche, format et critère de fin</CheckItem>
        <CheckItem id="ap4" size={28}>Configurer les instructions de mon assistant pour un dépôt</CheckItem>
        <CheckItem id="ap5" size={28}>Faire travailler un agent en mode Plan, puis par petits lots</CheckItem>
        <CheckItem id="ap6" size={28}>Dire quelles données ne doivent jamais partir dans un prompt</CheckItem>
        <CheckItem id="ap7" size={28}>Valider du code généré avec tests et analyse statique avant le merge</CheckItem>
        <CheckItem id="ap8" size={28}>Citer les obligations RGPD et AI Act qui touchent mon usage</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : vous êtes au bon endroit.', tone: 'grey' },
            { min: 3, text: 'Pratiquant : on va structurer et sécuriser.', tone: 'blue' },
            { min: 6, text: 'Avancé : visez les labs bonus et l’orchestration.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score sur votre fiche : il servira de référence pour mesurer votre progression.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le fil rouge FrigoMalin ────────────────────────────────────────────────
const OFeat = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const OItem = ({ name, info, days, tone }: { name: string; info: string; days: string; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: '#fff', boxShadow: SHADOW_SM }}>
    <span style={{ width: 10, height: 40, borderRadius: 5, background: STRONG[tone] }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 19, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 15, color: C.muted }}>{info}</div>
    </div>
    <span style={{ fontSize: 15, fontWeight: 700, color: T[tone].fg, background: T[tone].bg, borderRadius: 999, padding: '3px 10px' }}>{days}</span>
  </div>
);

const O_Frigo: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.green }}>FrigoMalin</span>, l’appli anti-gaspillage du foyer
    </Title>
    <Lede>Vous allez la construire de l’idée jusqu’à l’URL publique, avec GitHub Copilot comme coéquipier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <OFeat icon="barcode" tone="blue" title="Inventaire du frigo et des placards" d={100}>
        Scan du code-barres, fiche produit via l’API publique Open Food Facts
      </OFeat>
      <OFeat icon="calendar" tone="coral" title="Dates DLC / DDM suivies" d={200}>
        Ce qui expire bientôt remonte en haut de la liste
      </OFeat>
      <OFeat icon="bulb" tone="yellow" title="« Que cuisiner ? »" d={300}>
        Des recettes classées selon les produits qui expirent
      </OFeat>
      <OFeat icon="cart" tone="violet" title="Liste de courses anti-doublon" d={400}>
        On n’achète pas ce qui dort déjà au fond du placard
      </OFeat>
      <OFeat icon="leaf" tone="green" title="Tableau « kg et € sauvés »" d={500}>
        Le gaspillage évité, mesuré et motivant
      </OFeat>
      <div className={A.fade} style={{ display: 'flex', gap: 10, marginTop: 6, ...dl(700) }}>
        <Tag tone="navy" size={19}>PWA installable · hors ligne</Tag>
        <Tag tone="navy" size={19}>100 % navigateur · aucun backend</Tag>
        <Tag tone="navy" size={19}>GitHub Pages</Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1330, top: 250, width: 380, height: 700, borderRadius: 54, background: '#0F1530', boxShadow: '0 40px 80px -40px rgba(11,31,92,.7)', ...dl(300) }}>
      <div style={{ position: 'absolute', left: 14, top: 14, right: 14, bottom: 14, borderRadius: 42, background: '#F4F7FB', overflow: 'hidden' }}>
        <div style={{ padding: '30px 20px 14px', background: G.green, color: '#fff' }}>
          <div style={{ fontSize: 15, opacity: 0.85 }}>Mon frigo · 23 produits</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30 }}>FrigoMalin</div>
          <div style={{ marginTop: 8, fontSize: 16, background: 'rgba(255,255,255,.2)', borderRadius: 10, padding: '6px 10px' }}>3,4 kg · 18 € sauvés ce mois</div>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <OItem name="Yaourts nature ×4" info="Frigo · DLC" days="demain" tone="coral" />
          <OItem name="Épinards frais" info="Frigo · DLC" days="2 j" tone="coral" />
          <OItem name="Crème fraîche" info="Frigo · DLC" days="4 j" tone="yellow" />
          <OItem name="Pâtes complètes" info="Placard · DDM" days="5 mois" tone="green" />
          <OItem name="Lait demi-écrémé" info="Placard · DDM" days="3 mois" tone="green" />
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 18, borderRadius: 16, background: C.navy, color: '#fff', padding: '12px 16px', fontSize: 17, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="bulb" size={22} color="#FFD27A" /> Ce soir : quiche épinards-crème ?
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Le parcours FrigoMalin ─────────────────────────────────────────────────
const OStep = ({ n, children, tone, d, when }: { n: number; children: ReactNode; tone: Tone; d: number; when: string }) => (
  <div className={A.pop} style={{ width: 263, boxSizing: 'border-box', minHeight: 170, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 20px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: STRONG[tone] }}>{pad(n)}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: T[tone].fg, background: T[tone].bg, borderRadius: 999, padding: '3px 10px' }}>{when}</span>
    </div>
    <div style={{ marginTop: 10, fontSize: 26, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{children}</div>
  </div>
);

const O_Parcours: Page = () => (
  <Frame mod={0}>
    <Title>Le parcours : de l’idée à l’URL publique</Title>
    <Lede>12 étapes, 23 labs essentiels, 8 labs bonus. Chaque lab ajoute une brique au dépôt.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      <OStep n={1} tone="blue" when="J1" d={100}>Idée & PRODUCT.md</OStep>
      <OStep n={2} tone="blue" when="J1" d={160}>Architecture & ADR</OStep>
      <OStep n={3} tone="blue" when="J1" d={220}>Contexte Copilot</OStep>
      <OStep n={4} tone="yellow" when="IS + J2" d={280}>Stitch & skills</OStep>
      <OStep n={5} tone="violet" when="J2" d={340}>Features en TDD</OStep>
      <OStep n={6} tone="violet" when="J2" d={400}>Agents spécialisés</OStep>
      <OStep n={7} tone="violet" when="J2" d={460}>Orchestration</OStep>
      <OStep n={8} tone="violet" when="J2" d={520}>Optimisation</OStep>
      <OStep n={9} tone="violet" when="J2" d={580}>Garde-fous</OStep>
      <OStep n={10} tone="violet" when="J2" d={640}>CI/CD</OStep>
      <OStep n={11} tone="green" when="J2" d={700}>GitHub Pages</OStep>
      <OStep n={12} tone="pink" when="bonus" d={760}>Recette & V2</OStep>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 690, width: 1680, display: 'flex', gap: 24, ...dl(900) }}>
      <Card tone="blue" icon="code" title="Développeurs · ~80 %" style={{ flex: 1 }} size={25}>
        Contexte, maquettes, skills, agents, orchestration, tests, CI/CD.
      </Card>
      <Card tone="violet" icon="org" title="PO & architectes · ~20 %" style={{ flex: 1 }} size={25}>
        PRODUCT.md, MVP, backlog GitHub Issues, ADR, recette sur l’URL publique.
      </Card>
      <Card tone="green" icon="rocket" title="Résultat" style={{ flex: 1 }} size={25}>
        Un POC publié… et une méthode réutilisable sur vos propres dépôts.
      </Card>
    </div>
  </Frame>
);

// ─── Le dépôt ───────────────────────────────────────────────────────────────
const O_Repo: Page = () => (
  <Frame mod={0}>
    <Title>Le dépôt que vous allez construire</Title>
    <Lede>Tout ce que vous créez vit dans le dépôt : versionné, relu en PR, partagé avec l’équipe.</Lede>
    <CodeDark file="frigomalin/" size={25} cls={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 960 }}>
      <Cf>PRODUCT.md</Cf>
      {'                  '}
      <Cc>{'# le « pourquoi » (lab 1.1)'}</Cc>
      {'\n'}
      <Cf>.copilotignore</Cf>
      {'              '}
      <Cc>{'# ce que l’IA ne lit pas'}</Cc>
      {'\n'}
      <Cf>.mcp.json</Cf>
      {'                   '}
      <Cc>{'# serveurs MCP partagés'}</Cc>
      {'\n'}design/stitch/{'              '}
      <Cc>{'# maquettes web + mobile'}</Cc>
      {'\n'}docs/adr/ docs/reports/{'     '}
      <Cc>{'# décisions, rapports'}</Cc>
      {'\n'}.github/{'\n'}
      {'├─ '}
      <Ck>copilot-instructions.md</Ck>
      {'  '}
      <Cc>{'# toujours chargé'}</Cc>
      {'\n├─ '}
      <Ck>instructions/*.instructions.md</Ck>
      {'\n├─ '}
      <Ck>skills/*/SKILL.md</Ck>
      {'        '}
      <Cc>{'# à la demande'}</Cc>
      {'\n├─ '}
      <Ck>agents/*.agent.md</Ck>
      {'        '}
      <Cc>{'# votre équipe'}</Cc>
      {'\n├─ '}
      <Ck>hooks/quality.json</Ck>
      {'       '}
      <Cc>{'# contrôles sûrs'}</Cc>
      {'\n└─ '}
      <Ck>workflows/deploy-pages.yml</Ck>
      {'\n'}src/ <Cs>domain</Cs> · <Cs>data</Cs> · <Cs>ui</Cs>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1120, top: 270, width: 680, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Callout title="Règle d’or" tone="violet" icon="star" cls={A.in} style={dl(200)}>
        Jamais dans votre profil VS Code : <strong>toujours dans le dépôt</strong>. Chaque lab précise « Où créer le fichier ? ».
      </Callout>
      <Card tone="blue" icon="git" title="Pourquoi c’est décisif" cls={A.in} style={dl(350)} size={23}>
        Les instructions, skills et agents deviennent du <strong>code d’équipe</strong> : relus, améliorés, identiques pour tous, et réutilisables
        dans vos vrais projets dès lundi.
      </Card>
      <Card tone="green" icon="layers" title="Stack recommandée" cls={A.in} style={dl(500)} size={23}>
        React + TypeScript (Vite) · IndexedDB (Dexie) · Vitest · Playwright. Vue 3 ou Svelte possibles.
      </Card>
    </div>
  </Frame>
);

// ─── Les défis : pas de prompt prêt à copier ────────────────────────────────
const ODefi = ({ defi, children, d }: { defi: Defi; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(d) }}>
    <DefiBadge defi={defi} size={19} />
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const O_Defis: Page = () => (
  <Frame mod={0}>
    <Title>Ici, pas de prompt prêt à copier</Title>
    <Lede>Savoir écrire le bon prompt, c’est LA compétence. Chaque lab est un défi, avec indices et critères de réussite.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      <ODefi defi="trous" d={100}>Chaque [___] est une décision à prendre.</ODefi>
      <ODefi defi="construire" d={170}>Assembler rôle, contexte, tâche, format, critère de fin.</ODefi>
      <ODefi defi="ameliorer" d={240}>Un prompt qui marche mal : diagnostiquer, réécrire.</ODefi>
      <ODefi defi="inverse" d={310}>Partir du résultat attendu, retrouver le prompt.</ODefi>
      <ODefi defi="qcm" d={380}>Choisir, vérifier, comprendre l’explication.</ODefi>
      <ODefi defi="verification" d={450}>Lancer un prompt donné, observer ce qui part au modèle.</ODefi>
      <ODefi defi="squelette" d={520}>Compléter un fichier de configuration Copilot.</ODefi>
      <div className={A.in} style={{ background: G.navy, borderRadius: 16, padding: '18px 22px', color: '#fff', ...dl(590) }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24 }}>Et toujours :</div>
        <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.45, color: '#D5DCF5' }}>des indices à débloquer un par un, et des critères pour vous auto-évaluer.</div>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 700, width: 1680, ...dl(700) }}>
      <Callout title="Pourquoi ce choix pédagogique ?" tone="blue" icon="brain">
        Un prompt copié s’oublie, un prompt construit s’apprend. Vous écrirez des dizaines de prompts : c’est la répétition, avec un retour immédiat,
        qui installe le réflexe. Le corrigé existe (mode formateur), mais il vient <strong>après</strong> votre tentative.
      </Callout>
    </div>
  </Frame>
);

// ─── Check technique ────────────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check technique : 10 minutes pour être prêts</Title>
    <Lede>Cochez au fur et à mesure. Un point bloquant ? Levez la main : on règle tout avant le premier lab.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1100, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="st1" size={26}>VS Code à jour + extension GitHub Copilot connectée à votre compte</CheckItem>
        <CheckItem id="st2" size={26}>Licence Copilot active (Business / Enterprise : serveurs MCP autorisés par l’admin)</CheckItem>
        <CheckItem id="st3" size={26}>
          Node.js 22 LTS : <Kbd>node -v</Kbd>
        </CheckItem>
        <CheckItem id="st4" size={26}>
          Git configuré : <Kbd>git config user.name</Kbd>
        </CheckItem>
        <CheckItem id="st5" size={26}>Compte GitHub et dépôt « frigomalin » créé (Pages activable)</CheckItem>
        <CheckItem id="st6" size={26}>Compte Google pour Google Stitch (maquettes)</CheckItem>
        <CheckItem id="st7" size={26}>Dossier du projet approuvé dans VS Code (Workspace Trust)</CheckItem>
        <CheckItem id="st8" size={26}>Un téléphone pour tester la PWA et le scan</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1270, top: 270, width: 530, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Timer id="o-setup" minutes={10} label="Check technique" cls={A.right} style={{ width: 530 }} />
        <CheckScore
          max={8}
          label="Poste prêt"
          levels={[
            { min: 0, text: 'On démarre…', tone: 'grey' },
            { min: 5, text: 'Presque prêt !', tone: 'yellow' },
            { min: 8, text: 'Prêt pour le lab 1.1 ✓', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, width: 1100, fontSize: 21, color: C.muted, display: 'flex', gap: 12, alignItems: 'center', ...dl(600) }}>
      <Icon name="euro" size={24} color={C.coral} />
      Copilot est facturé à l’usage depuis le 1er juin 2026 (crédits IA) : prévoyez un budget par apprenant. Le module 6 apprend à le réduire.
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Orga, O_Poll, O_Objectifs, O_Programme, O_AutoPos, O_Frigo, O_Parcours, O_Repo, O_Defis, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, poser le ton : concret, pratique, exigeant sur la qualité.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Je suis Houssem Eddine Lassoued, je vais vous accompagner pendant ces deux jours. Le titre de la formation est ambitieux : “Boostez vos performances grâce à l’IA”. Je vais le prendre au sérieux, mais avec une nuance que vous entendrez souvent : l’IA accélère, c’est vous qui décidez. Pendant deux jours, on ne va pas faire un catalogue d’outils. On va construire une vraie application, FrigoMalin, avec GitHub Copilot comme coéquipier, et on va apprendre à le faire vite, proprement et en sécurité. »

ANIMATION — Laisser la page s’installer (le titre et la signature « Together we grow » apparaissent). En distanciel : vérifier le son et le partage d’écran avant d’aller plus loin.

TRANSITION — « Avant de parler technique, deux minutes sur ce que je vous promets concrètement. »`,
  `⏱ 3 min · PROMESSE

OBJECTIF — Donner trois chiffres-repères et le contrat pédagogique.

DIRE — « Trois chiffres. 14 heures, dont plus de 60 % de pratique : c’est le format officiel de la formation, et je vais le tenir. 23 labs essentiels sur un projet fil rouge, plus 8 labs bonus pour celles et ceux qui vont vite. Et à la fin du jour 2 : une application publiée sur GitHub Pages, que vous pourrez ouvrir sur votre téléphone. Le contrat est simple : je montre, vous pratiquez. C’est vous qui tenez le clavier. Et vous repartez avec des fichiers de configuration — instructions, skills, agents — que vous pourrez copier dans vos dépôts dès lundi. »

ANIMATION — Les compteurs s’animent à l’arrivée. Pointer le fil conducteur en bas de page : c’est la citation de clôture de la formation.

TRANSITION — « Côté organisation, quelques règles du jeu. »`,
  `⏱ 2 min · ORGANISATION

OBJECTIF — Horaires, pauses, règles de fonctionnement.

DIRE — « Nous travaillons de 9 h à 12 h 30, puis de 14 h à 17 h 30, avec deux pauses de quinze minutes vers 10 h 30 et 15 h 30. J’ajusterai selon le rythme des labs. Quatre règles. Un : vos questions sont bienvenues tout le temps ; si elles nous emmènent trop loin, je les note dans un “parking” et on les traite avant la fin. Deux : on travaille en binôme, un pilote au clavier, un copilote qui relit le prompt et le diff, et on inverse à chaque lab. Trois : une fiche d’évaluation courte à chaque demi-journée, elle m’aide à ajuster. Quatre, la plus importante : zéro donnée réelle dans les prompts. Pas de code client, pas de secret, pas de donnée personnelle. FrigoMalin existe précisément pour qu’on puisse tout essayer sans risque. »

ANIMATION — En distanciel, insister sur caméras et micros.

TRANSITION — « Faisons connaissance avec un petit sondage. »`,
  `⏱ 6 min · SONDAGE / TOUR DE TABLE

OBJECTIF — Mesurer le niveau d’usage réel et les attentes ; créer l’interaction dès le départ.

DIRE — « Deux questions, main levée. Première : votre usage actuel de l’IA pour coder. Jamais ou presque ? Un chat de temps en temps ? Un assistant dans l’IDE tous les jours ? Des agents qui modifient votre code ? Des agents orchestrés jusqu’en CI ? » Compter, cliquer une fois par vote. « Deuxième question : votre attente numéro un. »

ANIMATION — Cliquer chaque ligne autant de fois qu’il y a de mains (le « − » corrige). En distanciel : réactions dans le chat. Faire un tour de table rapide : prénom, rôle, contexte technique, en une phrase. Repérer les profils PO / RSSI / chefs de projet : leur donner un rôle de copilote attentif sur les sujets sécurité et cadrage.

RÉPONSES TYPES — Souvent : beaucoup de « chat de temps en temps », peu d’agents. C’est normal : la formation va de l’un à l’autre.

TRANSITION — « Vos attentes rejoignent les objectifs officiels. Les voici. »`,
  `⏱ 3 min · OBJECTIFS

OBJECTIF — Énoncer les objectifs officiels du programme et la répartition du temps.

DIRE — « Les objectifs sont ceux du programme Docaposte Institute. À la fin, vous saurez intégrer des outils d’IA dans votre workflow, automatiser certaines tâches avec des assistants et des agents, évaluer les risques de l’IA générative dans un contexte de développement sécurisé, et appliquer les bonnes pratiques de cybersécurité : données sensibles, confidentialité du code. J’en ajoute un cinquième qui traverse tout : garder le contrôle sur la qualité et la conformité de ce que vous livrez. Sur la droite, la répartition : plus de 60 % du temps en labs, ateliers et études de cas. L’évaluation est continue : questions orales, QCM interactifs, labs, études de cas, et un auto-positionnement au début et à la fin. »

ANIMATION — Les barres se remplissent. Relier chaque objectif à une attente exprimée dans le sondage.

TRANSITION — « Voyons comment ces objectifs se répartissent sur les deux jours. »`,
  `⏱ 3 min · PROGRAMME

OBJECTIF — Donner la carte des deux jours, alignée sur le programme officiel.

DIRE — « Jour 1 : découvrir et intégrer. Module 1, le panorama des outils, avec ce qu’il faut comprendre d’un LLM pour bien choisir, et un atelier de comparaison. Module 2, l’intégration dans le workflow : les modes de l’assistant, le prompting, le contexte. C’est là que FrigoMalin prend forme. Module 3, les limites et les précautions, avec un audit collaboratif de code généré. En fin de journée, je vous lance l’intersession : un cas d’usage à mener chez vous et les maquettes Stitch. Jour 2 : sécurité, optimisation et mise en pratique. On exploite vos retours d’intersession, on développe les features, puis le module cybersécurité, le module évaluer et fiabiliser avec les agents spécialisés, et la synthèse avec la mise en ligne. »

ANIMATION — Pointer le bandeau de progression en haut à droite : il suit le module courant.

TRANSITION — « Avant d’entrer dans le module 1, je vous propose de mesurer votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (évaluation officielle « avant »)

OBJECTIF — Chaque participant mesure son niveau de départ sur 8 compétences visées.

DIRE — « Huit affirmations. Cochez ce que vous savez faire aujourd’hui, pas ce que vous avez déjà entendu. Personne ne vous juge, c’est votre point de départ. Notez votre score : on refait exactement le même exercice à la fin du jour 2, et la différence, c’est ce que la formation vous a apporté. »

ANIMATION — Faire cocher par un volontaire à l’écran (ou lire chaque ligne et demander « qui sait déjà faire ? »). Le score s’affiche avec un niveau : découverte, pratiquant, avancé. Aux « avancés » : annoncer qu’ils auront des labs bonus et des rôles de référents en binôme.

TRANSITION — « Passons au projet qui va nous accompagner pendant deux jours. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Présenter FrigoMalin et ses contraintes, qui justifient beaucoup de choix techniques plus tard.

DIRE — « FrigoMalin, c’est une application anti-gaspillage pour le foyer. On scanne un produit, l’application récupère sa fiche sur Open Food Facts, une base ouverte et gratuite, sans clé d’API. Elle suit les dates — DLC pour les produits frais, DDM pour le reste —, propose “Que cuisiner ?” avec ce qui expire, une liste de courses qui évite les doublons et un tableau du gaspillage évité. Contrainte forte : c’est une PWA 100 % navigateur, publiée sur GitHub Pages. Pas de backend, pas de base serveur, pas de comptes. Ça nous simplifie la vie… et ça pose des questions d’architecture et de sécurité intéressantes, qu’on verra. »

ANIMATION — La maquette de téléphone apparaît : montrer le tri par urgence (rouge, orange, vert). Question au groupe : « Qui jette encore des yaourts périmés ? » pour détendre.

TRANSITION — « Comment allons-nous construire ça en deux jours ? »`,
  `⏱ 2 min · PARCOURS

OBJECTIF — Montrer la progression en 12 étapes et le partage des rôles.

DIRE — « Douze étapes. Le jour 1, on pose les fondations : le pourquoi dans PRODUCT.md, l’architecture et ses décisions, puis le contexte que Copilot verra à chaque requête. Pendant l’intersession, vous ferez les maquettes avec Google Stitch. Le jour 2, on développe les features en TDD, on crée une équipe d’agents spécialisés, on les orchestre, on optimise la consommation, on pose des garde-fous, puis la CI/CD et la publication sur GitHub Pages. La recette et la V2 sont en bonus. Les labs sont pensés à 80 % pour les développeurs et à 20 % pour les profils PO et architectes : si vous êtes PO, vous aurez votre partition. »

ANIMATION — Les cartes apparaissent dans l’ordre. Les couleurs indiquent le moment : bleu J1, jaune intersession, violet J2, vert mise en ligne, rose bonus.

TRANSITION — « Concrètement, à la fin, votre dépôt ressemblera à ceci. »`,
  `⏱ 2 min · DÉPÔT

OBJECTIF — Ancrer la règle d’or : la configuration de l’IA est du code d’équipe, versionné.

DIRE — « Regardez la structure. À la racine : PRODUCT.md, le contexte produit ; .copilotignore, ce que l’IA ne doit pas lire ; .mcp.json, les serveurs MCP partagés. Dans .github : les instructions globales, toujours chargées ; les instructions ciblées par type de fichier ; les skills, chargés à la demande ; vos agents ; un hook de qualité ; et le workflow de déploiement. Règle d’or : rien dans votre profil VS Code personnel. Si c’est dans le dépôt, c’est relu en PR, partagé et identique pour toute l’équipe. C’est exactement ce que vous pourrez transposer dans vos projets réels. »

ANIMATION — Pointer les commentaires à droite de l’arbre (toujours / à la demande / votre équipe) : ce vocabulaire reviendra au module 2.

TRANSITION — « Dernier point de méthode : la façon dont les labs sont conçus. »`,
  `⏱ 2 min · MÉTHODE DES LABS

OBJECTIF — Expliquer pourquoi on ne copie pas de prompts, et présenter les sept types de défis.

DIRE — « Vous ne trouverez pas de prompt prêt à copier dans les labs. C’est voulu. La compétence clé, c’est d’écrire le bon prompt. Il y a sept types de défis : compléter un prompt à trous, en construire un à partir d’ingrédients, en améliorer un mauvais, retrouver le prompt à partir du résultat, répondre à un QCM corrigé immédiatement, tester un prompt fourni pour observer ce qui part réellement au modèle, et compléter un fichier de configuration Copilot. Chaque lab a des indices à débloquer un par un et des critères de réussite. J’ai les corrigés en mode formateur, mais ils arrivent après votre essai. »

ANIMATION — Les badges de couleur sont ceux que vous retrouverez en haut de chaque page de lab.

TRANSITION — « Avant de commencer, assurons-nous que tous les postes sont prêts. »`,
  `⏱ 5 min (minuteur 10 min, en parallèle de M1 si besoin) · CHECK TECHNIQUE

OBJECTIF — Lever les blocages techniques avant le premier lab.

DIRE — « Dix minutes de check technique. VS Code avec l’extension Copilot connectée. Une licence active : si vous êtes sur une licence Business ou Enterprise, les serveurs MCP doivent être autorisés par votre administrateur, ils sont désactivés par défaut. Node 22, Git, un dépôt “frigomalin” sur GitHub, un compte Google pour Stitch, le dossier approuvé dans VS Code, et un téléphone. Un mot sur le coût : depuis le 1er juin 2026, Copilot est facturé à l’usage, en crédits IA calculés sur les tokens. Les sessions d’agent longues coûtent plus que les questions courtes. On apprendra au module 6 à réduire la facture. »

ANIMATION — Lancer le minuteur. Faire cocher à voix haute. Les points bloquants (licence, proxy, MCP) : les noter et proposer un binôme avec un poste fonctionnel pour ne perdre personne.

TRANSITION — « Les postes sont prêts : entrons dans le module 1, le panorama des outils. »`,
];
// @@NOTES-END
