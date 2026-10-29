// ─── M6 · AI as an architecture partner ─────────────────────────────────────
const RoleCard = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 24px' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M6_Partner: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>L’IA comme partenaire d’architecture</Title>
    <Lede>Elle ne connaît ni votre équipe, ni votre budget, ni votre historique. Elle élargit vos options et challenge vos choix.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 22 }}>
      <RoleCard n={1} icon="chat" tone="blue" title="Poser les questions">
        Exigences non fonctionnelles, volumes, intégrations, données sensibles : ce qu’on oublie.
      </RoleCard>
      <RoleCard n={2} icon="layers" tone="teal" title="Comparer des options">
        Deux ou trois architectures contrastées, avec leurs compromis face à vos contraintes.
      </RoleCard>
      <RoleCard n={3} icon="doc" tone="violet" title="Documenter">
        Diagrammes Mermaid ou C4, ADR, tableau des composants : en minutes.
      </RoleCard>
      <RoleCard n={4} icon="scale" tone="yellow" title="Avocat du diable">
        « Quel scénario ferait regretter ce choix dans deux ans ? »
      </RoleCard>
    </div>
    <Callout cls={b.on(5)} title="Le biais à connaître" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      Sans contraintes, l’IA propose l’architecture « à la mode » : microservices, Kubernetes, files de messages… pour 4 développeurs et un pilote en 6 semaines.
    </Callout>
  </Frame>
);

// ─── M6 · Questions before answers ──────────────────────────────────────────
const M6_Questions: Page = () => (
  <Frame mod={6} kind="demo" beats={2}>
    <Title>Faire poser les questions avant la solution</Title>
    <Lede>Cas du lab 10 : Cantine+, précommande de repas pour 3 cafétérias (projet fictif).</Lede>
    <PromptBox cls={A.in} size={23} style={{ position: 'absolute', left: 120, top: 270, width: 760, ...dl(100) }}>
      Voici le cahier des charges (#cahier-des-charges.md). Avant de proposer une architecture, pose-moi les 8 questions les plus importantes, classées par impact sur l’architecture.
    </PromptBox>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 760, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 16, rowGap: 14, ...dl(200) }}>
      <Tag tone="grey" size={21}>1 500 commandes en 45 min</Tag>
      <Tag tone="grey" size={21}>Paie SAP par lot nocturne</Tag>
      <Tag tone="grey" size={21}>Allergènes : risque légal</Tag>
      <Tag tone="grey" size={21}>Loi 25 : données de santé</Tag>
      <Tag tone="grey" size={21}>4 devs, 20 points / sprint</Tag>
      <Tag tone="grey" size={21}>Pilote en 3 sprints</Tag>
    </div>
    <AnswerBox cls={b.on(1)} id="chatgpt" size={21} style={{ position: 'absolute', left: 940, top: 270, width: 860 }}>
      1. Le prestataire a-t-il un logiciel de caisse à intégrer ? <i>(intégration)</i>
      <br />
      2. Qui valide les allergènes, avec quelle traçabilité ? <i>(conformité)</i>
      <br />
      3. Quel délai acceptable entre commande et retenue sur la paie ? <i>(cohérence)</i>
      <br />
      4. Quel hébergement est autorisé par la sécurité ? <i>(plateforme)</i>
      <br />
      5. Les contractuels ont-ils accès ? <i>(identité)</i>
      <br />
      6. Que se passe-t-il si le paiement échoue à 10 h 29 ? <i>(résilience)</i>
      <br />…
    </AnswerBox>
    <Callout cls={b.on(2)} title="Vous jouez le PO" tone="green" icon="humanCheck" size={24} style={{ position: 'absolute', left: 940, top: 720, width: 860 }}>
      Répondez à 3 questions. Vos réponses deviennent du contexte : la proposition suivante sera bien meilleure.
    </Callout>
  </Frame>
);

// ─── M6 · Options and diagram ───────────────────────────────────────────────
const M6_Options: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Deux options contrastées, un diagramme, une décision</Title>
    <Lede>Demandez des compromis face à vos contraintes, pas « la meilleure architecture ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.in} tone="green" icon="layers" title="Monolithe modulaire" size={22} style={dl(100)}>
        Un déploiement, des modules aux frontières nettes, une file de messages pour le pic. <b>Tient en 3 sprints avec 4 personnes.</b>
      </Card>
      <Card cls={A.in} tone="coral" icon="cloud" title="Microservices" size={22} style={dl(200)}>
        Mise à l’échelle indépendante… mais exploitation, traçage distribué et 6 pipelines. <b>Trop lourd pour le pilote.</b>
      </Card>
      <Callout cls={b.on(2)} title="Décision → ADR-001" tone="blue" icon="flag" size={23}>
        Monolithe modulaire ; extraire le module Commande s’il devient le goulot.
      </Callout>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 900, top: 270, width: 900, height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: 20 }}>
      <Eyebrow c={C.muted} size={19}>
        Diagramme généré (Mermaid, rendu)
      </Eyebrow>
      <svg width={860} height={530} viewBox="0 0 860 530" style={{ display: 'block' }}>
        <g fontFamily="Barlow" fontSize={19} textAnchor="middle">
          <rect x={20} y={40} width={170} height={70} rx={12} fill={T.grey.bg} stroke={T.grey.bd} strokeWidth={2} />
          <text x={105} y={82} fill={C.ink}>Employé · web</text>
          <rect x={20} y={200} width={170} height={70} rx={12} fill={T.grey.bg} stroke={T.grey.bd} strokeWidth={2} />
          <text x={105} y={242} fill={C.ink}>Cuisine · tablette</text>
          <rect x={300} y={110} width={230} height={100} rx={14} fill={T.blue.bg} stroke={C.blue} strokeWidth={3} />
          <text x={415} y={155} fill={C.ink} fontWeight={700}>API Cantine+</text>
          <text x={415} y={182} fill={T.blue.fg} fontSize={16}>monolithe modulaire</text>
          <rect x={620} y={30} width={210} height={64} rx={12} fill={T.violet.bg} stroke={T.violet.bd} strokeWidth={2} />
          <text x={725} y={69} fill={C.ink}>Entra ID (SSO)</text>
          <rect x={620} y={130} width={210} height={64} rx={12} fill={T.teal.bg} stroke={T.teal.bd} strokeWidth={2} />
          <text x={725} y={169} fill={C.ink}>PostgreSQL</text>
          <rect x={300} y={300} width={230} height={64} rx={12} fill={T.yellow.bg} stroke={T.yellow.bd} strokeWidth={2} />
          <text x={415} y={339} fill={C.ink}>File de messages</text>
          <rect x={160} y={430} width={210} height={64} rx={12} fill={T.green.bg} stroke={T.green.bd} strokeWidth={2} />
          <text x={265} y={469} fill={C.ink}>Notifications</text>
          <rect x={460} y={430} width={210} height={64} rx={12} fill={T.green.bg} stroke={T.green.bd} strokeWidth={2} />
          <text x={565} y={469} fill={C.ink}>Adaptateur paie</text>
          <rect x={720} y={430} width={120} height={64} rx={12} fill={T.coral.bg} stroke={T.coral.bd} strokeWidth={2} />
          <text x={780} y={469} fill={C.ink}>SAP</text>
        </g>
        <g stroke={C.faint} strokeWidth={3} fill="none">
          <path d="M190 75 L300 140" />
          <path d="M190 235 L300 185" />
          <path d="M530 140 L620 62" />
          <path d="M530 162 L620 162" />
          <path d="M415 210 L415 300" />
          <path d="M380 364 L285 430" />
          <path d="M450 364 L545 430" />
          <path d="M670 462 L720 462" />
        </g>
      </svg>
    </div>
  </Frame>
);

// ─── M6 · ADR ───────────────────────────────────────────────────────────────
const M6_Adr: Page = () => (
  <Frame mod={6}>
    <Title>Documenter la décision : l’ADR</Title>
    <Lede>Architecture Decision Record : une page, versionnée avec le code. L’IA rédige ; la décision est la vôtre.</Lede>
    <CodeDark cls={A.in} file="docs/adr/001-monolithe-modulaire.md" lang="md" size={20} style={{ position: 'absolute', left: 120, top: 270, width: 1000, ...dl(100) }}>
      <Fn># ADR-001 · Un monolithe modulaire</Fn>
      {'\n'}- Statut : accepté · 2026-11-03{'\n'}
      {'\n'}
      <Fn>## Contexte</Fn>
      {'\n'}4 développeurs, pilote en 3 sprints, pic prévisible,{'\n'}paie SAP par lot. Aucune expérience microservices.{'\n'}
      {'\n'}
      <Fn>## Décision</Fn>
      {'\n'}Nous construirons un monolithe modulaire (Menu,{'\n'}Commande, Paiement, Rapport) et une file de messages.{'\n'}
      {'\n'}
      <Fn>## Alternatives</Fn> · microservices · sans serveur{'\n'}
      <Fn>## Conséquences</Fn> · un pipeline · frontières à tester
    </CodeDark>
    <div style={{ position: 'absolute', left: 1180, top: 270, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={A.in} tone="green" icon="check" title="Pourquoi un ADR" size={23} style={dl(200)}>
        Dans un an, on saura pourquoi. Et quand le contexte change, on écrit l’ADR-002 qui le remplace.
      </Card>
      <PromptBox cls={A.in} label="Avocat du diable" size={22} style={dl(300)}>
        Critique cet ADR : quel scénario ferait regretter cette décision dans 2 ans ? Que faudrait-il surveiller ?
      </PromptBox>
    </div>
  </Frame>
);

// ─── M6 · Estimation ────────────────────────────────────────────────────────
const Story = ({ n, id, title, pts, sprint, dep, bad }: { n: number; id: string; title: string; pts: number; sprint: string; dep?: string; bad?: boolean }) => (
  <div className={n ? b.on(n) : undefined} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 70px 90px 120px', alignItems: 'center', columnGap: 12, height: 58, borderBottom: `1.5px solid ${C.rule}`, background: bad ? T.coral.bg : undefined, padding: '0 12px' }}>
    <span style={{ fontFamily: mono, fontSize: 20, color: T.blue.fg }}>{id}</span>
    <span style={{ fontSize: 22, color: C.ink }}>{title}</span>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: bad ? C.coral : C.ink, textAlign: 'center' }}>{pts}</span>
    <span style={{ fontSize: 20, color: C.muted, textAlign: 'center' }}>{sprint}</span>
    <span style={{ fontFamily: mono, fontSize: 18, color: C.muted }}>{dep ?? '—'}</span>
  </div>
);

const M6_Estimate: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Estimer et planifier : l’IA propose, l’équipe engage</Title>
    <Lede>User stories, critères Gherkin, points de Fibonacci, sprints. Puis vérifier la capacité et les dépendances.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 10px', ...dl(100) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 70px 90px 120px', columnGap: 12, padding: '0 12px 8px', borderBottom: `2px solid ${C.ink}` }}>
        <Eyebrow c={C.muted} size={18}>Id</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Story</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Pts</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Sprint</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Dépend de</Eyebrow>
      </div>
      <Story n={0} id="US-01" title="Connexion avec le compte Microsoft" pts={5} sprint="1" />
      <Story n={0} id="US-02" title="Publier le menu de la semaine" pts={5} sprint="1" />
      <Story n={0} id="US-05" title="Précommander et choisir un créneau" pts={8} sprint="2" dep="US-01 US-02" />
      <Story n={0} id="US-07" title="Payer par carte" pts={8} sprint="2" dep="US-05" />
      <Story n={2} id="US-12" title="Payer par retenue sur la paie" pts={13} sprint="2" dep="US-07" bad />
      <Story n={0} id="US-08" title="Tableau des quantités en cuisine" pts={5} sprint="3" dep="US-05" />
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(1)} tone="blue" icon="list" title="Ce que l’IA fait bien" size={22}>
        Découper en stories, rédiger les critères d’acceptation, signaler les dépendances.
      </Card>
      <Card cls={b.on(2)} tone="coral" icon="alert" title="Ce qu’elle rate" size={22}>
        Sprint 2 : 29 points pour une vélocité de 20. Et 13 points = trop gros : découpez.
      </Card>
      <Card cls={b.on(3)} tone="green" icon="users" title="Ce qui reste à l’équipe" size={22}>
        L’engagement : le planning poker humain, l’IA en préparation (estimations à justifier).
      </Card>
    </div>
  </Frame>
);

// ─── M6 · Dependencies and risks ────────────────────────────────────────────
const RiskDot = ({ x, y, tone, label }: { x: number; y: number; tone: Tone; label: string }) => (
  <g>
    <circle cx={x} cy={y} r={16} fill={STRONG[tone]} />
    <text x={x + 24} y={y + 7} fontFamily="Barlow" fontSize={21} fill={C.ink}>
      {label}
    </text>
  </g>
);

const M6_Risks: Page = () => (
  <Frame mod={6}>
    <Title>Dépendances et risques : l’IA analyse, un outil vérifie</Title>
    <Lede>Elle recense, classe et propose des mesures. Pour les failles connues, seul un outil d’audit fait foi.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 760, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: 20, ...dl(100) }}>
      <Eyebrow c={C.muted} size={19}>
        Registre des risques · probabilité × impact
      </Eyebrow>
      <svg width={720} height={490} viewBox="0 0 720 490" style={{ display: 'block' }}>
        <rect x={60} y={20} width={640} height={420} fill={C.panel} rx={10} />
        <rect x={380} y={20} width={320} height={210} fill={T.coral.bg} rx={10} />
        <line x1={60} y1={230} x2={700} y2={230} stroke={C.rule} strokeWidth={2} />
        <line x1={380} y1={20} x2={380} y2={440} stroke={C.rule} strokeWidth={2} />
        <text x={380} y={475} fontFamily="Barlow" fontSize={19} fill={C.muted} textAnchor="middle">
          Probabilité →
        </text>
        <text x={30} y={230} fontFamily="Barlow" fontSize={19} fill={C.muted} textAnchor="middle" transform="rotate(-90 30 230)">
          Impact →
        </text>
        <RiskDot x={420} y={80} tone="coral" label="Paie SAP en retard" />
        <RiskDot x={450} y={160} tone="coral" label="Dépendances obsolètes" />
        <RiskDot x={110} y={60} tone="yellow" label="Allergène erroné" />
        <RiskDot x={260} y={150} tone="yellow" label="Pic de 10 h 30" />
        <RiskDot x={420} y={330} tone="teal" label="Caisse du prestataire" />
        <RiskDot x={140} y={330} tone="teal" label="Adoption faible" />
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 270, width: 860 }}>
      <Term cls={A.in} title="pip-audit --disable-pip --no-deps -r requirements-legacy.txt" size={19} style={dl(250)}>
        {'Name      Version  ID               Fix Versions\n'}
        {'django    2.2.0    '}
        <Ko>PYSEC-2019-13</Ko>
        {'    2.2.4\n'}
        {'requests  2.19.1   '}
        <Ko>PYSEC-2018-28</Ko>
        {'    2.20.0\n'}
        {'pyyaml    5.3      '}
        <Ko>PYSEC-2021-142</Ko>
        {'   5.4\n'}
        {'jinja2    2.10     '}
        <Ko>PYSEC-2019-217</Ko>
        {'   2.10.1\n…\n'}
        <Ko>139 vulnérabilités connues dans 7 paquets sur 7</Ko>
      </Term>
      <Callout cls={A.in} title="Piège mesuré" tone="coral" icon="alert" size={23} style={{ marginTop: 22, ...dl(400) }}>
        L’IA cite des numéros de CVE plausibles… parfois inexistants ou attribués au mauvais paquet. Croisez toujours avec pip-audit, npm audit ou la base OSV.
      </Callout>
      <Hint cls={A.in} style={{ marginTop: 16, ...dl(500) }}>
        Audit réel du 29 octobre 2026, sortie abrégée : le total augmente avec le temps.
      </Hint>
    </div>
  </Frame>
);

// ─── Lab 10 ─────────────────────────────────────────────────────────────────
const L10_Brief: Page = () => (
  <LabBrief
    mod={6}
    n="10"
    title="Concevoir et planifier avec l’IA"
    dur="35 min"
    folder="lab10-architecture"
    objective="Utiliser l’IA comme partenaire d’architecture : questions, options, ADR, backlog estimé, risques et audit des dépendances, en vérifiant chaque affirmation."
    cmd={
      <>
        <Pr>pytest labs/lab10-architecture</Pr>
        {'\n'}
        <Ko>17 failed</Ko>
        {'  '}
        <Cm>livrables à créer</Cm>
        {'\n'}
        <Pr>npm run test:lab10</Pr>
      </>
    }
    deliverable="5 fichiers dans livrables/ : architecture.md, adr-001.md, backlog.csv, risques.md, dependances.md. Tests verts."
  >
    <LabStep n={1} t="5 min" title="Questions d’abord">
      Les 8 questions de l’IA ; répondez à 3 en tant que PO
    </LabStep>
    <LabStep n={2} t="8 min" title="Architecture + ADR">
      2 options contrastées, diagramme Mermaid, décision documentée
    </LabStep>
    <LabStep n={3} t="12 min" title="Backlog et planification">
      12 stories ou plus ; les tests vérifient vélocité et dépendances
    </LabStep>
    <LabStep n={4} t="10 min" title="Risques et dépendances">
      Registre des risques ; audit vérifié par pip-audit / npm audit
    </LabStep>
  </LabBrief>
);

const L10_Go: Page = () => (
  <LabGo mod={6} n="10" minutes={35} folder="lab10-architecture">
    <CheckItem id="l10-1">Questions obtenues, 3 réponses de PO données</CheckItem>
    <CheckItem id="l10-2">architecture.md (Mermaid) et adr-001.md</CheckItem>
    <CheckItem id="l10-3">backlog.csv : vélocité 20 et dépendances respectées</CheckItem>
    <CheckItem id="l10-4">risques.md : 5 risques avec mesures</CheckItem>
    <CheckItem id="l10-5">dependances.md vérifié par un outil d’audit</CheckItem>
  </LabGo>
);

// ─── M6 · Synthesis ─────────────────────────────────────────────────────────
const M6_Synth: Page = () => (
  <SynthPage
    mod={6}
    title="Module 6 · Ce qu’il faut retenir"
    poste={<>À votre prochaine décision technique : faites poser les questions, demandez deux options, écrivez l’ADR. Et ajoutez pip-audit ou npm audit à votre pipeline.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Les questions avant la solution ; vos contraintes en contexte
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      Options contrastées et compromis, pas « la meilleure »
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      Diagrammes et ADR en minutes ; la décision reste humaine
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={400}>
      Estimations : à justifier, vérifier vélocité et dépendances
    </SynthRow>
    <SynthRow n={5} tone="coral" d={500}>
      Dépendances et CVE : un outil d’audit fait foi
    </SynthRow>
  </SynthPage>
);

// ─── Module 7 divider ───────────────────────────────────────────────────────
const M7_Divider: Page = () => (
  <Section n={7} title="Ateliers pratiques : un projet complet avec un agent" sub="Tout assembler : instructions, plan, code, tests, documentation, pull request revue." dur="≈ 1 h 30" kind="atelier">
    <SecItem n={1}>Mettre en place un projet avec l’IA</SecItem>
    <SecItem n={2}>Développement complet : code, tests, documentation</SecItem>
    <SecItem n={3}>Débriefing et intégration en entreprise</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M6_Partner, M6_Questions, M6_Options, M6_Adr, M6_Estimate, M6_Risks, L10_Brief, L10_Go, M6_Synth, M7_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · 5 CLICS · RETOUR DU DÎNER (13 h 15)

OBJECTIF — Aide à la conception d'architectures (programme) : positionner l'IA.

→ beats 1 à 4 : les quatre rôles. « Poser les questions qu'on oublie. Comparer des options. Documenter vite. Jouer l'avocat du diable. »
→ beat 5 : « Le biais : sans contraintes, l'IA propose l'architecture à la mode. Microservices et Kubernetes pour quatre développeurs. Ce n'est pas de la malveillance : c'est ce qu'elle a le plus lu. »

INTERACTION — « Qui a déjà hérité d'une architecture surdimensionnée ? » Une anecdote au micro.

TRANSITION — « D'abord, les questions. »`,
  `⏱ 4 min · DÉMO · 2 CLICS

DÉMO — Ouvrez labs/lab10-architecture/cahier-des-charges.md, joignez-le au chat, envoyez la demande.
DIRE — « Les contraintes clés sont en gris : un pic de 1 500 commandes en 45 minutes, la paie SAP par lot, les allergènes, la Loi 25, une équipe de 4. »
→ beat 1 : les questions. « Plusieurs sont dans la section "questions ouvertes" du cahier ; d'autres non, comme le paiement qui échoue à 10 h 29. »
→ beat 2 : « Vous jouez le PO : répondez à trois questions. Ces réponses deviennent du contexte. »

TRANSITION — « Ensuite, comparer. »`,
  `⏱ 4 min · 2 CLICS

OBJECTIF — Options contrastées, diagramme, décision.

DIRE — « Je demande deux options contrastées, avec leurs compromis face à mes contraintes. Monolithe modulaire contre microservices. »
→ beat 1 : le diagramme. « Généré en Mermaid, rendu ici. L'adaptateur paie isole SAP ; la file de messages absorbe le pic et découple les notifications. »
→ beat 2 : la décision. « Elle va dans un ADR. »

ASTUCE — Les diagrammes Mermaid se rendent dans GitHub, VS Code (extension) et la plupart des wikis : la doc reste versionnée avec le code.

TRANSITION — « L'ADR justement. »`,
  `⏱ 3 min

OBJECTIF — Documenter une décision d'architecture.

DIRE — « Un ADR, Architecture Decision Record : une page, versionnée avec le code. Contexte, décision, alternatives, conséquences. L'IA le rédige en une minute à partir de notre conversation. »
« Dans un an, quelqu'un demandera "pourquoi pas des microservices ?" La réponse est là. »
Avocat du diable : « Demandez-lui de critiquer votre ADR. C'est souvent la partie la plus utile. »

TRANSITION — « De l'architecture au plan. »`,
  `⏱ 4 min · 3 CLICS

OBJECTIF — Estimation et planification agile (programme).

DIRE — « L'IA découpe en user stories avec critères Gherkin, propose des points et des sprints. »
→ beat 1 : « Ce qu'elle fait bien : découper, rédiger, repérer les dépendances. »
→ beat 2 : la ligne rouge. « Ce qu'elle rate : au sprint 2, 5 + 8 + 8 + 13 = 34 points pour une vélocité de 20. Et une story de 13 points ne tient pas dans un sprint. »
→ beat 3 : « L'engagement reste à l'équipe. L'IA prépare : des estimations qu'on lui demande de justifier ("pourquoi 8 ?"), et l'équipe tranche en planning poker. »

Les tests du lab 10 vérifient exactement cela : vélocité, dépendances, pas de 13 dans un sprint.

TRANSITION — « Dernier volet : dépendances et risques. »`,
  `⏱ 4 min

OBJECTIF — Gestion des dépendances et des risques (programme).

DIRE — « À gauche, le registre des risques en probabilité × impact : l'IA en propose de bons, que vous classez. En haut à droite, ce qu'il faut traiter en premier. »
« À droite : l'équipe veut réutiliser les dépendances d'un prototype de 2019. pip-audit trouve 139 vulnérabilités connues, dans les 7 paquets (dont 43 pour Django 2.2.0 et 69 pour Pillow 8.0.0). »
Callout : « L'IA analyse aussi ces fichiers, mais elle cite parfois des numéros de CVE plausibles et inexistants. Un outil d'audit fait foi. »

ATTENTION — Audit lancé le 29 octobre 2026 (pip-audit --disable-pip --no-deps) ; lancez-le en direct si possible : le total ne fait qu'augmenter.

TRANSITION — « Lab 10. »`,
  `⏱ 2 min · CONSIGNE DU LAB 10

DIRE — « Lab 10, labs/lab10-architecture. Le cahier des charges de Cantine+, des gabarits, et les fichiers de dépendances du vieux prototype. Vous produisez 5 livrables dans livrables/. Les tests ne jugent pas la qualité de votre architecture : ils vérifient que c'est complet et cohérent. Vélocité, dépendances, pilote en 3 sprints : c'est là que l'IA se trompe. »

PRÉREQUIS — pip install pip-audit ; pour npm audit, un npm install --package-lock-only dans le dossier dependances.

TRANSITION — « 35 minutes. »`,
  `⏱ 35 min · LAB 10 EN AUTONOMIE

ANIMATION — Points d'étape à 12 et 25 minutes : « Combien de tests verts sur 17 ? »

BLOCAGES FRÉQUENTS —
• backlog.csv : les champs qui contiennent des virgules doivent être entre guillemets (ou reformulés sans virgule).
• Le critère Gherkin doit contenir « Étant donné … quand … alors ».
• Sprints : une story sans sprint (COULD) est acceptée ; ses dépendances doivent exister.
• Pas d'accès réseau pour pip-audit : consignez l'analyse de l'IA en signalant « non vérifié » ; le test demande au moins le nom de l'outil.

DÉBRIEF (3 min) — « Sur quoi avez-vous corrigé l'IA ? » Deux ou trois réponses.

⏸ PAUSE 14 h 15 – 14 h 30.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 6

DIRE — Lire les cinq points. Encadré : « Ajoutez pip-audit ou npm audit à votre pipeline : c'est une ligne, et elle tourne à chaque PR. »

TRANSITION — « Dernier module : on assemble tout. »`,
  `⏱ 1 min · DÉBUT DU MODULE 7 (≈ 14 h 30)

DIRE — « Module 7 : les ateliers pratiques. Un projet complet avec un agent : on le met en place avec des instructions, on le développe de bout en bout (code, tests, documentation), et on ouvre une pull request revue. Puis vos présentations, et comment intégrer tout ça en entreprise. »

TRANSITION — « Le projet : un petit outil en ligne de commande. »`,
];
// @@NOTES-END
