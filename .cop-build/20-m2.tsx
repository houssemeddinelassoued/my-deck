// ─── Module 2 · Modules & architectures ─────────────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Générer modules
        <br />
        et architectures
      </>
    }
    sub="De l’arborescence à l’API REST complète, guidée par vos fichiers d’instructions : structure, patterns, dépendances."
    dur="10:25 – 11:35 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 2 · API REST complète</Tag>}
  >
    <SecItem n={1}>Générer une structure de projet complète</SecItem>
    <SecItem n={2}>Une API REST de bout en bout</SecItem>
    <SecItem n={3}>Patterns, et générer à l’image de l’existant</SecItem>
    <SecItem n={4}>Dépendances et imports générés</SecItem>
    <SecItem n={5}>Les fichiers qui guident Copilot</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── Structure de projet ────────────────────────────────────────────────────
const M2Tree = ({ depth = 0, dir = false, name, note, tone = 'navy' }: { depth?: number; dir?: boolean; name: string; note?: string; tone?: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingLeft: depth * 30, fontFamily: mono, fontSize: 21, lineHeight: 1.55 }}>
    <span style={{ color: dir ? T[tone].fg : C.ink, fontWeight: dir ? 700 : 400 }}>
      {dir ? '▸ ' : '  '}
      {name}
    </span>
    {note ? <span style={{ fontFamily: body, fontSize: 18, color: C.muted }}>{note}</span> : null}
  </div>
);

const M2_Scaffold: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Générer une structure de projet complète</Title>
    <Lede>L’arborescence est une décision d’architecture : on la fait proposer en rôle Plan, on la discute, puis on la fige.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <CodeDark file="Prompt · rôle Plan" size={21} wrap>
        Contexte : API REST {PROJECT} (salles, réservations, auth JWT, rôles membre/admin).{'\n\n'}
        Propose une arborescence en couches : domaine pur, repositories derrière des interfaces, services métier, routes fines, validation à l’entrée.{'\n\n'}
        <span style={{ color: '#FFD27A' }}>Pour chaque dossier : son rôle en une ligne. Liste les interfaces à créer en premier. N’écris aucune implémentation.</span>
      </CodeDark>
      <div className={b.on(2)} style={{ marginTop: 24 }}>
        <Callout title="Interfaces d’abord" tone="blue" icon="layers" size={24}>
          Contrats validés → implémentations générées lot par lot. L’arbo figée va dans les instructions du dépôt.
        </Callout>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="layers">Proposition retenue</PanelTitle>
      <M2Tree dir name="src/" />
      <M2Tree depth={1} dir name="domain/" note="types, règles pures" tone="violet" />
      <M2Tree depth={2} name="overlap · availability" />
      <M2Tree depth={1} dir name="repositories/" note="interfaces + impl." tone="teal" />
      <M2Tree depth={1} dir name="services/" note="cas d’usage métier" tone="blue" />
      <M2Tree depth={1} dir name="api/" note="routes fines" tone="pink" />
      <M2Tree depth={2} name="routes · validation · auth" />
      <M2Tree depth={1} dir name="config/" note="env, injection" tone="grey" />
      <M2Tree dir name="tests/" />
      <M2Tree depth={1} dir name="unit/ · integration/" tone="green" />
      <M2Tree name="openapi.yaml" note="contrat publié" />
      <M2Tree name="PLAN.md" note="plan validé, lots" />
    </div>
  </Frame>
);

// ─── API REST de bout en bout ───────────────────────────────────────────────
const M2Hop = ({ x, icon, tone, title, sub }: { x: number; icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: 270, width: 250, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `6px solid ${STRONG[tone]}`, padding: '16px 18px', ...dl(x / 4) }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.35, color: C.soft }}>{sub}</div>
  </div>
);

const M2Row = ({ label, a, b: bb, c, d, head = false }: { label: string; a: string; b: string; c: string; d: string; head?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', gap: 14, alignItems: 'center', padding: head ? '0 18px' : '12px 18px', borderRadius: 12, background: head ? 'transparent' : C.card, boxShadow: head ? 'none' : SHADOW_SM }}>
    <span style={{ fontSize: head ? 18 : 21, fontWeight: 700, letterSpacing: head ? '0.08em' : 0, color: head ? C.muted : C.navy }}>{label}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: head ? 19 : 19, fontWeight: head ? 700 : 400, color: head ? T.blue.fg : C.ink }}>{a}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: 19, fontWeight: head ? 700 : 400, color: head ? T.yellow.fg : C.ink }}>{bb}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: 19, fontWeight: head ? 700 : 400, color: head ? T.coral.fg : C.ink }}>{c}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: 19, fontWeight: head ? 700 : 400, color: head ? T.violet.fg : C.ink }}>{d}</span>
  </div>
);

const M2_ApiFlow: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Une API REST de bout en bout</Title>
    <Lede>Une couche, une responsabilité : un prompt et des tests par couche. C’est ce qui rend la génération relisible.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 245 470 H 1675" stroke={C.rule} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <FlowDot path="M 245 470 H 1675" dur={3.2} color={C.electric} />
    </svg>
    <M2Hop x={120} icon="send" tone="grey" title="Requête" sub="POST /bookings + jeton JWT" />
    <M2Hop x={407} icon="lock" tone="coral" title="Auth" sub="jeton valide, rôle, identité" />
    <M2Hop x={694} icon="filter" tone="yellow" title="Validation" sub="schéma, types, bornes" />
    <M2Hop x={981} icon="route" tone="pink" title="Route" sub="fine : traduit HTTP ↔ métier" />
    <M2Hop x={1268} icon="gear" tone="blue" title="Service" sub="règles : chevauchement, heures" />
    <M2Hop x={1555} icon="database" tone="teal" title="Repository" sub="persistance derrière interface" />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M2Row head label="COUCHE" a="TypeScript · Express" b="Python · FastAPI" c="Java · Spring Boot" d="C# · ASP.NET Core" />
      <M2Row label="Routes" a="express.Router" b="APIRouter" c="@RestController" d="Minimal API / Controller" />
      <M2Row label="Validation" a="zod" b="Pydantic" c="Bean Validation" d="DataAnnotations" />
      <M2Row label="Auth JWT" a="jsonwebtoken" b="OAuth2 + PyJWT" c="Spring Security" d="JwtBearer" />
      <M2Row label="OpenAPI" a="zod-to-openapi" b="natif (/docs)" c="springdoc" d="AspNetCore.OpenApi" />
    </div>
  </Frame>
);

// ─── Patterns ───────────────────────────────────────────────────────────────
const M2Pattern = ({ icon, tone, title, role, when, prompt }: { icon: IconName; tone: Tone; title: string; role: string; when: string; prompt: string }) => (
  <FlipCard
    w={538}
    h={470}
    tone={tone}
    backTone={tone}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={icon} tone={tone} size={60} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.ink }}>{title}</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>RÔLE</div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: C.ink }}>{role}</div>
        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>DANS {PROJECT.toUpperCase()}</div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: C.soft }}>{when}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={18}>
          Le prompt
        </Eyebrow>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 21, lineHeight: 1.5, color: C.ink }}>{prompt}</div>
      </>
    }
  />
);

const M2_Patterns: Page = () => (
  <Frame mod={2}>
    <Title>Repository, Service, Factory : nommer le pattern</Title>
    <Lede>Copilot connaît tous les patterns. Ce qu’il ignore, c’est votre variante : nommez-la, bornez-la. Cliquez une carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 33 }}>
      <M2Pattern
        icon="database"
        tone="teal"
        title="Repository"
        role="Isole la persistance derrière une interface métier."
        when="BookingRepository : findOverlapping(roomId, from, to). Mémoire en test, SQL en prod."
        prompt="Crée l’interface BookingRepository (findOverlapping, save, delete) puis une implémentation en mémoire. Aucune logique métier dedans."
      />
      <M2Pattern
        icon="gear"
        tone="blue"
        title="Service"
        role="Porte un cas d’usage et ses règles métier."
        when="BookingService.book() : vérifie heures ouvrées, chevauchement, propriétaire."
        prompt="Crée BookingService avec le repository injecté par le constructeur. Erreurs métier typées (BookingConflict), jamais d’objet HTTP ici."
      />
      <M2Pattern
        icon="puzzle"
        tone="violet"
        title="Factory"
        role="Centralise la création d’objets valides ou de variantes."
        when="RoomFactory : salle standard, visio, amphi, avec leurs équipements par défaut."
        prompt="Crée RoomFactory.create(kind) pour standard, visio, amphi. Un type inconnu lève une erreur. Ajoute un test par variante."
      />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(500) }}>
      <Callout title="Piège classique" tone="coral" icon="alert" size={24}>
        Demander « applique les bonnes pratiques » produit des couches vides et des interfaces inutiles. Un pattern se justifie par un besoin.
      </Callout>
    </div>
  </Frame>
);

// ─── Générer à l'image de l'existant ────────────────────────────────────────
const M2Rule = ({ icon, tone, title, children, beat }: { icon: IconName; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Exemplar: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Maintenable et extensible : générer à l’image de l’existant</Title>
    <Lede>Le meilleur prompt d’architecture est un fichier de référence. Copilot imite très bien ; il invente moins bien.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 860 }}>
      <CodeDark file="Prompt · rôle Agent" size={22} wrap>
        Crée <Cf>RoomService</Cf> en suivant exactement le modèle de <span style={{ color: '#FFD27A' }}>#file:src/services/booking.service</span> :{'\n'}
        {'  '}· même injection par constructeur{'\n'}
        {'  '}· mêmes erreurs métier typées{'\n'}
        {'  '}· même structure de tests dans <span style={{ color: '#FFD27A' }}>#file:tests/unit/booking.service.test</span>
        {'\n\n'}
        <Cc>Si tu dois t’écarter du modèle, demande-moi d’abord.</Cc>
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 22, fontSize: 23, lineHeight: 1.45, color: C.soft, ...dl(400) }}>
        Un fichier exemplaire relu vaut mieux que dix lignes de consignes : c’est aussi ce qui garde 30 services cohérents entre eux.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 270, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={20}>
        Quatre contrats d’extensibilité à exiger
      </Eyebrow>
      <M2Rule icon="plug" tone="blue" title="Dépendances injectées" beat={0}>
        Pas de <code style={{ fontFamily: mono }}>new</code> d’infrastructure dans un service.
      </M2Rule>
      <M2Rule icon="alert" tone="coral" title="Erreurs métier typées" beat={1}>
        BookingConflict, pas Error("conflit") ni un code HTTP.
      </M2Rule>
      <M2Rule icon="layers" tone="violet" title="Interfaces aux frontières" beat={2}>
        Le domaine ne connaît ni la base, ni le framework web.
      </M2Rule>
      <M2Rule icon="route" tone="teal" title="Routes sans logique" beat={3}>
        Valider, appeler le service, traduire la réponse. Rien d’autre.
      </M2Rule>
    </div>
  </Frame>
);

// ─── Dépendances et imports ─────────────────────────────────────────────────
const M2Risk = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Deps: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Dépendances et imports générés : vérifier avant d’installer</Title>
    <Lede>Un modèle suggère des paquets plausibles, pas des paquets vérifiés. Et un attaquant peut publier le nom halluciné.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M2Risk icon="eyeOff" tone="coral" title="Paquet halluciné" d={100}>
        Il n’existe pas… jusqu’à ce qu’un attaquant le publie (slopsquatting).
      </M2Risk>
      <M2Risk icon="clock" tone="yellow" title="Version datée" d={200}>
        Celle de la date d’entraînement, parfois vulnérable ou dépréciée.
      </M2Risk>
      <M2Risk icon="link" tone="violet" title="Import fantôme" d={300}>
        Chemin, fonction ou option qui n’existent pas dans votre version.
      </M2Risk>
      <M2Risk icon="layers" tone="grey" title="Dépendance superflue" d={400}>
        Une librairie entière pour trois lignes de code.
      </M2Risk>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1080, top: 270, width: 720, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Stat value={<CountUp to={19.7} digits={1} suffix=" %" />} label="des paquets recommandés par des LLM n’existaient pas (576 000 échantillons de code, USENIX Security 2025)" tone="coral" size={96} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1080, top: 590, width: 720, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px' }}>
      <PanelTitle icon="shieldCheck" c={T.green.fg}>
        Les règles de l’équipe
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={22} tone="green">Liste des dépendances autorisées dans les instructions</Bullet>
        <Bullet size={22} tone="green">« N’ajoute aucune dépendance sans me demander »</Bullet>
        <Bullet size={22} tone="green">Registre vérifié : existence, âge, mainteneurs</Bullet>
        <Bullet size={22} tone="green">Lockfile commité, audit en CI (module 5)</Bullet>
      </div>
    </div>
  </Frame>
);

// ═══ Les fichiers qui guident Copilot (repris de copilot-debutant-v2, p. 62–68) ═══

// ─── Quel fichier pour quel besoin ──────────────────────────────────────────
const M2FRow = ({ path, what, when, tone, day, d }: { path: string; what: string; when: string; tone: Tone; day: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '560px minmax(0, 1fr) 300px 120px', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', borderLeft: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 19, color: T[tone].fg }}>{path}</span>
    <span style={{ fontSize: 21, color: C.ink, lineHeight: 1.3 }}>{what}</span>
    <span style={{ fontSize: 19, color: C.soft, lineHeight: 1.3 }}>{when}</span>
    <Tag tone={tone} size={16}>
      {day}
    </Tag>
  </div>
);

const M2_Panorama: Page = () => (
  <Frame mod={2}>
    <Title>Les fichiers qui guident Copilot : lequel pour quel besoin ?</Title>
    <Lede>Des fichiers Markdown versionnés avec le code. Le harnais Copilot les lit à la même place dans VS Code, le CLI et l’app.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M2FRow path=".github/copilot-instructions.md" what="Les règles de la maison" when="à chaque requête" tone="navy" day="TP 2" d={100} />
      <M2FRow path="AGENTS.md" what="La même chose, format partagé entre outils" when="à chaque requête" tone="navy" day="TP 2" d={160} />
      <M2FRow path=".github/instructions/*.instructions.md" what="Des règles pour certains fichiers" when="si applyTo correspond" tone="blue" day="TP 3 · 5" d={220} />
      <M2FRow path="~/.copilot/copilot-instructions.md" what="Vos préférences personnelles" when="dans tous vos projets" tone="teal" day="Option" d={280} />
      <M2FRow path=".github/skills/<nom>/SKILL.md" what="Une méthode réutilisable, avec ses fichiers" when="à la demande" tone="violet" day="TP 3" d={340} />
      <M2FRow path=".github/agents/<nom>.agent.md" what="Un rôle : consignes, outils, modèle" when="quand vous le choisissez" tone="violet" day="TP 4 · 6" d={400} />
      <M2FRow path=".vscode/mcp.json" what="Des outils de plus pour l’agent" when="quand il en a besoin" tone="pink" day="Mention" d={460} />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 880, ...dl(700) }}>
      Ce matin les instructions et les skills ; cet après-midi les agents et leur orchestration. Votre dossier .github grossit à chaque TP.
    </Hint>
  </Frame>
);

// ─── copilot-instructions.md ────────────────────────────────────────────────
const M2_Instructions: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Les règles de la maison : copilot-instructions.md</Title>
    <Lede>Un fichier court, joint automatiquement à chaque requête du Chat et de l’agent.</Lede>
    <CodeDark file=".github/copilot-instructions.md" size={19} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Ck># SalleLibre · instructions pour Copilot</Ck>
      {'\n'}API REST FICTIVE de réservation de salles.{'\n'}TypeScript, Express, Node.js 22 (ou votre stack).{'\n\n'}
      <Ck>## Architecture (voir PLAN.md)</Ck>
      {'\n'}- domain/ pur : ni HTTP, ni stockage.{'\n'}- Routes fines → services (règles) → repositories.{'\n'}- Erreur métier typée : ConflictError → 409,{'\n  '}ForbiddenError → 403, jamais une erreur générique.{'\n\n'}
      <Ck>## Règles maison</Ck>
      {'\n'}- Aucune dépendance ajoutée sans mon accord.{'\n'}- Toute entrée validée avant le service.{'\n'}- Aucun secret dans le code : variables d’environnement.{'\n\n'}
      <Ck>## Tests</Ck>
      {'\n'}- Un test par règle métier ; ne jamais modifier tests/acceptance/.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Bien écrit" size={21} pad={22} cls={A.right} style={dl(200)}>
        Court, impératif, vérifiable. Une règle par ligne, pas une encyclopédie.
      </Card>
      <Card icon="eye" tone="blue" title="Vérifier qu’il est lu" size={21} pad={22} cls={A.right} style={dl(350)}>
        Sous la réponse, la liste « Références » cite le fichier.
      </Card>
      <Card icon="bolt" tone="violet" title="Le générer" size={21} pad={22} cls={A.right} style={dl(500)}>
        <Ic>/init</Ic> dans une session d’agent propose un premier jet à partir du projet. À relire et à raccourcir !
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Il guide le Chat et l’agent ; les suggestions inline, elles, imitent surtout le fichier ouvert.
    </Hint>
  </Frame>
);

// ─── copilot-instructions.md ou AGENTS.md ───────────────────────────────────
const M2_AgentsMd: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>copilot-instructions.md ou AGENTS.md ?</Title>
    <Lede>Le harnais Copilot lit l’un ou l’autre. La vraie question : quels outils utilise votre équipe ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
      <Card icon="git" tone="navy" title=".github/copilot-instructions.md" size={23} pad={28} cls={A.in} style={dl(100)}>
        <Bullet size={22} tone="navy">Le format historique de GitHub Copilot</Bullet>
        <Bullet size={22} tone="navy">Lu par VS Code, le CLI, l’app, github.com</Bullet>
        <Bullet size={22} tone="navy">Une équipe 100 % Copilot : parfait</Bullet>
      </Card>
      <Card icon="users" tone="violet" title="AGENTS.md (à la racine)" size={23} pad={28} cls={A.in} style={dl(220)}>
        <Bullet size={22} tone="violet">Un format partagé entre agents de code</Bullet>
        <Bullet size={22} tone="violet">Lu aussi par Codex et d’autres outils</Bullet>
        <Bullet size={22} tone="violet">Une équipe qui mélange les outils : un seul fichier</Bullet>
      </Card>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680 }}>
      <Callout tone="coral" icon="alert" title="Jamais deux sources qui se contredisent" size={24}>
        Copilot combine toutes les instructions applicables, sans ordre de priorité entre elles. Deux règles contraires : il choisit au hasard. Gardez-en un seul.
      </Callout>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(600) }}>
      AGENTS.md n’est pas un agent personnalisé : c’est un fichier d’instructions. Les agents arrivent au Module 4.
    </Hint>
  </Frame>
);

// ─── Instructions ciblées : applyTo ─────────────────────────────────────────
const M2Glob = ({ glob, file, children, d }: { glob: string; file: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: 16, alignItems: 'baseline', ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 20, color: C.electric }}>{glob}</span>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>
      <strong style={{ color: C.ink }}>{file}</strong> · {children}
    </span>
  </div>
);

const M2_ApplyTo: Page = () => (
  <Frame mod={2}>
    <Title>Des règles pour certains fichiers : applyTo</Title>
    <Lede>Un en-tête YAML dit à quels fichiers s’applique le fichier d’instructions. Le reste du temps, il ne coûte rien.</Lede>
    <CodeDark file=".github/instructions/tests.instructions.md" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>applyTo</Ck>: <Cs>"tests/**"</Cs>
      {'\n'}
      <Ck>description</Ck>: <Cs>Conventions des tests de SalleLibre</Cs>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}- Le framework de la stack (Vitest, pytest…).{'\n'}- Un test paramétré par règle métier.{'\n'}- Arrange / Act / Assert, noms en français.{'\n'}- Une horloge fixe, jamais l’heure réelle.{'\n'}- Ne jamais modifier tests/acceptance/.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Eyebrow c={C.navy} size={20}>
        Exemples de motifs
      </Eyebrow>
      <M2Glob glob="tests/**" file="tests" d={200}>
        conventions de test (TP 3)
      </M2Glob>
      <M2Glob glob="src/api/**" file="sécurité" d={300}>
        contrôle d’accès, DTO, secrets (TP 5)
      </M2Glob>
      <M2Glob glob="src/legacy/**" file="code hérité" d={400}>
        « ne corrige rien pendant un refactoring »
      </M2Glob>
      <M2Glob glob="**" file="tout" d={500}>
        autant écrire copilot-instructions.md
      </M2Glob>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 730, width: 1680 }}>
      <Callout tone="yellow" icon="pointer" title="Piège classique" size={23} cls={A.in} style={dl(700)}>
        <Ic>test/**</Ic> au lieu de <Ic>tests/**</Ic> : le fichier n’est jamais appliqué, et rien ne vous prévient. Vérifiez les Références.
      </Callout>
    </div>
  </Frame>
);

// ─── Portée : personnel, dépôt, organisation, mémoire ───────────────────────
const M2Scope = ({ icon, tone, title, where, children, d }: { icon: IconName; tone: Tone; title: string; where: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontFamily: mono, fontSize: 17, color: T[tone].fg }}>{where}</div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M2_Portee: Page = () => (
  <Frame mod={2}>
    <Title>Qui dit quoi : quatre sources de consignes</Title>
    <Lede>Elles s’additionnent dans la même requête. Chacune à sa place, sans se contredire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
      <M2Scope icon="user" tone="teal" title="Vous" where="~/.copilot/copilot-instructions.md" d={100}>
        Vos préférences dans tous vos projets : langue des réponses, style d’explication.
      </M2Scope>
      <M2Scope icon="git" tone="navy" title="Le dépôt" where=".github/… ou AGENTS.md" d={200}>
        Les règles de l’équipe, versionnées et relues comme du code.
      </M2Scope>
      <M2Scope icon="org" tone="violet" title="L’organisation" where="réglée sur GitHub" d={300}>
        Des consignes communes, fixées par l’administrateur (offres entreprise).
      </M2Scope>
      <M2Scope icon="brain" tone="yellow" title="La mémoire" where="Copilot Memory" d={400}>
        Des faits que l’agent retient d’une session à l’autre. Consultables et supprimables.
      </M2Scope>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 690, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="blue" icon="target" title="Ce qui va où" size={22} cls={A.in} style={dl(600)}>
        Une règle d’équipe va dans le dépôt, jamais seulement dans vos préférences : vos collègues et la CI ne la verraient pas.
      </Callout>
      <Callout tone="coral" icon="shield" title="Rien de secret" size={22} cls={A.in} style={dl(750)}>
        Ces fichiers partent dans les requêtes : ni mot de passe, ni jeton, ni donnée client.
      </Callout>
    </div>
  </Frame>
);

// ─── Prompt files et skills ─────────────────────────────────────────────────
const M2_PromptSkill: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Prompt files et skills : l’ancien et le nouveau format</Title>
    <Lede>Une demande que vous répétez souvent mérite un fichier. Mais lequel ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(100) }}>
        <PanelTitle icon="note" c={C.muted}>
          Prompt file · .prompt.md
        </PanelTitle>
        <Bullet size={22} tone="grey">Un prompt enregistré, lancé avec /nom</Bullet>
        <Bullet size={22} tone="grey">Format du harnais Local (l’ancien moteur)</Bullet>
        <Bullet size={22} tone="grey">
          <strong>Ignoré</strong> par le harnais Copilot
        </Bullet>
      </div>
      <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', borderTop: `7px solid ${C.violet}`, ...dl(220) }}>
        <PanelTitle icon="sparkles" c={C.violet}>
          Skill · .github/skills/nom/SKILL.md
        </PanelTitle>
        <Bullet size={22} tone="violet">Une méthode, avec ses scripts et modèles</Bullet>
        <Bullet size={22} tone="violet">Chargée quand la demande s’y prête, ou par /nom</Bullet>
        <Bullet size={22} tone="violet">Standard ouvert, lu par Copilot et d’autres agents</Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 600, width: 1680 }}>
      <CodeDark file="un prompt d’équipe devenu skill · .github/skills/nouvel-endpoint/SKILL.md" size={20}>
        <Cc>---</Cc>
        {'\n'}
        <Ck>name</Ck>: <Cs>nouvel-endpoint</Cs>
        {'\n'}
        <Ck>description</Ck>: <Cs>Créer un endpoint REST de SalleLibre et ses tests, sur le modèle de bookings.</Cs>
        {'\n'}
        <Ck>disable-model-invocation</Ck>: <Cn>true</Cn> <Cc>{'   # seulement quand vous tapez /nouvel-endpoint'}</Cc>
        {'\n'}
        <Cc>---</Cc>
      </CodeDark>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Vos .prompt.md d’hier se convertissent en skills. Votre première skill : au TP 3.
    </Hint>
  </Frame>
);

// ─── L'éditeur de personnalisation, et la taille des fichiers ───────────────
const M2_Editeur: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Un seul endroit pour tout voir, et des fichiers courts</Title>
    <Lede>
      Commande <strong>Chat: Open Customizations</strong> : ce que la session Copilot charge vraiment, fichier par fichier.
    </Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: '#0F1530', borderRadius: 18, padding: '18px 22px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(100) }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Tag tone="blue" size={17}>Instructions</Tag>
        <Tag tone="grey" size={17}>Agents</Tag>
        <Tag tone="grey" size={17}>Skills</Tag>
        <Tag tone="grey" size={17}>Tools</Tag>
        <Tag tone="grey" size={17}>MCP</Tag>
        <Tag tone="grey" size={17}>Plugins</Tag>
      </div>
      <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.8, color: '#E6EAF6' }}>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> copilot-instructions.md <span style={{ color: '#9BE29B' }}>✓ chargé</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> tests.instructions.md <span style={{ color: '#FFD27A' }}>applyTo</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> security.instructions.md <span style={{ color: '#FFD27A' }}>applyTo</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>User ›</span> copilot-instructions.md <span style={{ color: '#9BE29B' }}>✓ chargé</span>
        </div>
        <div>
          <span style={{ color: '#8E98BC' }}>Workspace ›</span> + nouveau fichier…
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="gauge" tone="coral" title="Chaque ligne se paie à chaque requête" size={22} pad={24} cls={A.right} style={dl(250)}>
        Les instructions occupent la fenêtre de contexte et coûtent des tokens, à chaque tour de boucle de l’agent.
      </Card>
      <Card icon="filter" tone="green" title="Règle des TP : 40 lignes au plus" size={22} pad={24} cls={A.right} style={dl(400)}>
        Une règle n’y entre que si elle change le code produit. Le reste va dans un fichier ciblé ou une skill.
      </Card>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Un paquet inconnu"
    q="L’agent propose d’installer jwt-express-guard-pro, un paquet que personne ne connaît dans l’équipe. Que faites-vous ?"
    explain="Un nom plausible n’est pas une preuve d’existence ni de fiabilité. On vérifie hors du modèle, et on préfère ce que l’équipe a déjà validé."
  >
    <Opt why="Les tests ne détectent ni un paquet malveillant ni un script d’installation : le mal est fait dès l’installation.">
      L’installer : si les tests passent, c’est qu’il fonctionne
    </Opt>
    <Opt ok why="Exact : registre officiel, âge, mainteneurs, téléchargements, dépôt source. Et en priorité une librairie déjà validée par l’équipe.">
      Vérifier sur le registre, puis préférer une librairie déjà validée
    </Opt>
    <Opt why="Le modèle peut confirmer avec assurance un paquet qu’il a lui-même halluciné : ce n’est pas une source de vérification.">
      Demander à Copilot si ce paquet est fiable
    </Opt>
    <Opt why="Les scripts d’installation s’exécutent aussi pour une dépendance de développement, sur votre poste et en CI.">
      L’installer seulement en dépendance de développement
    </Opt>
  </QcmPage>
);

// ─── TP 2 ───────────────────────────────────────────────────────────────────
const M2Step = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <Num n={n} tone="blue" size={32} style={{ marginTop: 2 }} />
    <span style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</span>
  </div>
);

const M2_TP: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Générer une API REST complète"
    defi="generer"
    who="Individuel"
    minutes={30}
    feats={
      <Tag tone="navy" size={19}>
        <Icon name="doc" size={20} /> copilot-instructions.md
      </Tag>
    }
    where={
      <>
        <PathChip>PLAN.md</PathChip> plan validé, en lots
        <br />
        <PathChip>.github/copilot-instructions.md</PathChip> ≤ 40 lignes
        <br />
        <PathChip>src/**</PathChip> + <PathChip>openapi.yaml</PathChip>
      </>
    }
    objective={
      <>
        L’API {PROJECT} fonctionne, guidée par <strong>vos</strong> règles de la maison : authentification JWT, CRUD des salles (admin), réservations sans chevauchement, validation, documentation.
      </>
    }
    crit={
      <>
        <CheckItem id="tp2-1" size={21}>Plan validé avant toute ligne de code</CheckItem>
        <CheckItem id="tp2-2" size={21}>Instructions citées dans les Références</CheckItem>
        <CheckItem id="tp2-3" size={21}>409 sur chevauchement, 401 sans jeton, 403 sans rôle</CheckItem>
        <CheckItem id="tp2-4" size={21}>Doc OpenAPI accessible et à jour</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Rôle Plan : arborescence et interfaces, validées dans PLAN.md.</M2Step>
      <M2Step n={2}>Écrivez copilot-instructions.md : stack, couches, erreurs → codes HTTP, dépendances.</M2Step>
      <M2Step n={3}>Rôle Agent, lot par lot : domaine (overlaps du TP 1), repositories, services.</M2Step>
      <M2Step n={4}>Routes, validation, auth, puis OpenAPI. Une règle ignorée ? Corrigez le fichier, pas le prompt.</M2Step>
    </div>
    <TpBonus>Transformez votre meilleur prompt du TP 1 en skill /chevauchement (disable-model-invocation: true), puis rejouez-la.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M2_Divider, M2_Scaffold, M2_ApiFlow, M2_Patterns, M2_Exemplar, M2_Deps, M2_Panorama, M2_Instructions, M2_AgentsMd, M2_ApplyTo, M2_Portee, M2_PromptSkill, M2_Editeur, M2_Qcm, M2_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M2 · 10:25

OBJECTIF — Annoncer le module 2 du programme : génération de modules et d’architectures complexes.

DIRE — « Module 2 : on passe de la fonction au module, puis à l’application. Générer une structure complète, une API REST de bout en bout, les patterns Repository, Service et Factory, les dépendances générées. Et la seconde moitié du module : les fichiers qui guident Copilot. Vous ne répéterez plus vos règles dans chaque prompt : vous les écrirez une fois, dans le dépôt. Le TP 2 produit l’API SalleLibre, guidée par vos propres instructions. »

TRANSITION — « Tout commence par l’arborescence. »`,
  `⏱ 4 min · STRUCTURE DE PROJET (2 temps)

OBJECTIF — Générer une structure de projet complète : arborescence, modules, interfaces.

DIRE — « L’arborescence, c’est de l’architecture : on ne la laisse pas émerger au fil des prompts. Rôle Plan : on donne le contexte, le style d’architecture voulu, et on demande pour chaque dossier son rôle en une ligne, plus la liste des interfaces à créer en premier. Aucune implémentation. »
→ beat 1 « Voici une proposition retenue : un domaine pur, des repositories derrière des interfaces, des services métier, des routes fines, et PLAN.md qui garde le plan. »
→ beat 2 « Interfaces d’abord : une fois les contrats validés, les implémentations se génèrent par lots, et l’arbo figée va dans les instructions du dépôt pour que chaque session la respecte. On voit ce fichier dans un quart d’heure. »

TRANSITION — « Suivons une requête à travers ces couches. »`,
  `⏱ 4 min · API DE BOUT EN BOUT (1 temps)

OBJECTIF — Développer une API REST complète : routes, modèles, validation, et montrer les équivalents par stack.

DIRE — « Une réservation entre par une requête avec un jeton. L’authentification établit l’identité et le rôle. La validation rejette ce qui est mal formé avant tout traitement. La route, fine, traduit HTTP vers le métier. Le service applique les règles : heures ouvrées, chevauchement. Le repository persiste. Chaque couche a sa responsabilité, donc son prompt et ses tests : c’est ce découpage qui rend la génération relisible. »
→ beat 1 « Le tableau des équivalents pour vos stacks : Copilot les connaît toutes ; précisez toujours la vôtre et sa version dans les instructions. »

TRANSITION — « Dans ces couches, trois patterns reviennent. »`,
  `⏱ 4 min · PATTERNS (cartes à retourner)

OBJECTIF — Travailler avec Repository, Service et Factory.

DIRE — « Copilot connaît ces patterns par cœur. Ce qu’il ne connaît pas, c’est votre variante : quelles méthodes, quelles erreurs, ce qui est interdit dedans. Retournons les cartes : dites-moi laquelle d’abord. » Cliquer chaque carte. « Remarquez : chaque prompt dit ce qu’il ne faut pas faire. Pas de logique métier dans le repository, pas d’objet HTTP dans le service. Et le piège : demander les bonnes pratiques en général produit des couches vides. Un pattern se justifie par un besoin. »

TRANSITION — « Le plus efficace pour un code maintenable, c’est de montrer un modèle. »`,
  `⏱ 3 min · GÉNÉRER À L’IMAGE DE L’EXISTANT (3 temps)

OBJECTIF — Copilot et les design patterns : générer du code maintenable et extensible.

DIRE — « Copilot imite mieux qu’il n’invente. Le prompt : crée RoomService exactement sur le modèle de BookingService, tests compris, et demande avant de t’écarter. C’est ce qui garde trente services cohérents. À droite, les quatre contrats à exiger : dépendances injectées. »
→ beat 1 « Erreurs métier typées. »
→ beat 2 « Interfaces aux frontières. »
→ beat 3 « Routes sans logique. Ce sont aussi vos critères de revue cet après-midi, et ils iront dans copilot-instructions.md. »

TRANSITION — « Un point avant les fichiers : ce que Copilot importe. »`,
  `⏱ 3 min · DÉPENDANCES (1 temps)

OBJECTIF — Gérer les dépendances et les imports générés automatiquement.

DIRE — « Quatre risques. Le paquet halluciné : l’étude USENIX Security 2025 de Spracklen et al. a mesuré près de 20 % de paquets inexistants parmi ceux recommandés par 16 modèles. Et comme les mêmes noms reviennent, un attaquant peut les publier : c’est le slopsquatting. La version datée, l’import fantôme, la dépendance superflue. »
→ beat 1 « Les règles d’équipe : une liste blanche dans les instructions, interdiction d’ajouter une dépendance sans accord, vérification sur le registre, lockfile commité et audit en CI. »

TRANSITION — « Ces règles d’équipe, où les écrire pour que Copilot les applique à chaque fois ? Dans des fichiers. »`,
  `⏱ 3 min · QUEL FICHIER POUR QUEL BESOIN

OBJECTIF — Donner la carte des fichiers de personnalisation lus par le harnais Copilot, et leur place dans la journée.

DIRE — « Sept fichiers, tous en Markdown ou presque, tous versionnés avec le code. Les règles de la maison, à chaque requête : copilot-instructions.md ou AGENTS.md. Des règles ciblées par chemin : les fichiers .instructions.md. Vos préférences personnelles, dans votre dossier utilisateur. Puis trois fichiers plus puissants : la skill, une méthode chargée à la demande ; l’agent, un rôle avec ses outils ; et mcp.json, qui donne des outils de plus à l’agent. Regardez la colonne de droite : c’est le programme de vos TP. Votre dossier .github grossit à chaque TP. »

TRANSITION — « Le premier, celui que vous écrirez dans le TP 2. »`,
  `⏱ 3 min · COPILOT-INSTRUCTIONS.MD (démo)

OBJECTIF — Montrer un fichier d’instructions de dépôt court, impératif et vérifiable.

DIRE — « Voici celui de SalleLibre. Une description du projet en deux lignes, l’architecture de PLAN.md, les règles maison, les tests. Chaque ligne est une règle qui change le code produit : l’erreur typée, aucune dépendance sans accord, la validation avant le service. Comment savoir s’il est lu ? Sous chaque réponse, la liste Références le cite. Et pour démarrer : /init dans une session d’agent propose un premier jet à partir du projet. À relire, et surtout à raccourcir. »

ANIMATION — Démo : ouvrir le fichier dans VS Code, poser une question au Chat, déplier les Références.

TRANSITION — « Ce fichier a un concurrent : AGENTS.md. »`,
  `⏱ 2 min · COPILOT-INSTRUCTIONS.MD OU AGENTS.MD (1 temps)

OBJECTIF — Choisir entre les deux formats selon les outils de l’équipe.

DIRE — « Le harnais Copilot lit les deux. copilot-instructions.md, c’est le format historique de Copilot, lu partout où Copilot tourne. AGENTS.md est un format partagé entre agents de code : Codex et d’autres le lisent aussi. Une équipe qui mélange les outils écrit un seul AGENTS.md. »
→ beat 1 « Le piège : avoir les deux, qui se contredisent. Copilot combine les instructions sans priorité entre elles. Gardez-en un seul. Et attention au nom : AGENTS.md n’est pas un agent, c’est un fichier d’instructions. Les vrais agents arrivent au module 4. »

TRANSITION — « Toutes les règles ne concernent pas tous les fichiers. »`,
  `⏱ 3 min · APPLYTO

OBJECTIF — Écrire des instructions ciblées par chemin avec applyTo.

DIRE — « Un fichier .instructions.md commence par un en-tête YAML : applyTo dit à quels fichiers il s’applique. Ici, les conventions de test, seulement quand Copilot travaille dans tests/. Le reste du temps, il ne coûte rien. À droite, les motifs que vous écrirez aujourd’hui : tests au TP 3, sécurité de l’API au TP 5. Le motif double étoile, tout le dépôt : autant l’écrire dans copilot-instructions.md. Et le piège classique : test au singulier au lieu de tests. Le fichier n’est jamais appliqué, et rien ne vous prévient. Le réflexe : vérifier les Références. »

TRANSITION — « Ces instructions s’additionnent à d’autres sources. »`,
  `⏱ 2 min · QUATRE SOURCES DE CONSIGNES

OBJECTIF — Situer instructions personnelles, de dépôt, d’organisation et mémoire.

DIRE — « Quatre sources s’additionnent dans la même requête. Vous : vos préférences, dans tous vos projets. Le dépôt : les règles de l’équipe, relues en PR. L’organisation : des consignes fixées par l’administrateur, sur les offres entreprise. Et la mémoire : des faits que l’agent retient d’une session à l’autre, consultables et supprimables. Deux règles : une règle d’équipe va dans le dépôt, jamais seulement chez vous ; et rien de secret dans ces fichiers, ils partent dans les requêtes. »

TRANSITION — « Et vos prompts réutilisables, ceux que vous rangiez dans .github/prompts ? »`,
  `⏱ 3 min · PROMPT FILES ET SKILLS (1 temps)

OBJECTIF — Expliquer que les prompt files sont ignorés par le harnais Copilot et que les skills les remplacent.

DIRE — « Beaucoup d’entre vous ont des .prompt.md, lancés par /nom. C’est le format du harnais Local, l’ancien moteur : le harnais Copilot les ignore. Le format qui les remplace, c’est la skill : un dossier, un SKILL.md, et ses fichiers — modèles, scripts. Copilot lit sa description et la charge quand la demande s’y prête, ou quand vous tapez /nom. C’est un standard ouvert, lu par d’autres agents. »
→ beat 1 « Convertir un prompt d’équipe en skill : un en-tête name et description, et disable-model-invocation à true si vous voulez qu’elle ne parte que sur /nouvel-endpoint. Votre première skill : au TP 3, et en bonus dès le TP 2. »

TRANSITION — « Dernier outil : voir d’un coup d’œil ce qui est chargé. »`,
  `⏱ 2 min · ÉDITEUR DE PERSONNALISATION (démo)

OBJECTIF — Montrer « Chat: Open Customizations » et la règle des fichiers courts.

DIRE — « La commande Chat: Open Customizations montre, onglet par onglet, ce que la session Copilot charge vraiment : instructions, agents, skills, outils, MCP. C’est là que vous diagnostiquez une règle ignorée. Et une contrainte : chaque ligne se paie à chaque requête, à chaque tour de boucle de l’agent. Règle des TP : 40 lignes au plus. Ce qui ne change pas le code produit sort du fichier, ou part dans un fichier ciblé ou une skill. »

ANIMATION — Démo : ouvrir l’éditeur de personnalisation sur le dépôt SalleLibre.

TRANSITION — « QCM, puis vous écrivez le vôtre. »`,
  `⏱ 2 min · QCM 2

OBJECTIF — Vérifier le réflexe de vérification des dépendances.

DIRE — « Le piège C est le plus intéressant : demander au modèle de valider sa propre hallucination. Il le fera avec aplomb. La vérification se fait hors du modèle. Et la règle « aucune dépendance sans accord » ira dans votre copilot-instructions.md. »

ANIMATION — Vote à voix haute, clic sur la réponse majoritaire, → bonne réponse, → l’essentiel.

TRANSITION — « TP 2 : l’API complète, guidée par vos instructions. »`,
  `⏱ 30 min (minuteur) · TP 2

OBJECTIF — Cas pratique du programme : générer une API REST complète avec authentification, validation et documentation, guidée par un fichier d’instructions de dépôt.

DIRE — « TP individuel. D’abord le rôle Plan : arborescence et interfaces, vous validez, vous sauvegardez dans PLAN.md. Ensuite, avant toute génération, vous écrivez .github/copilot-instructions.md : quarante lignes au plus, la stack, les couches, les erreurs métier et leurs codes HTTP, la règle des dépendances. /init peut proposer un premier jet : raccourcissez-le. Puis le rôle Agent, lot par lot : le domaine — reprenez overlaps du TP 1 —, des repositories en mémoire, les services, puis routes, validation, authentification, et la documentation. À chaque réponse, vérifiez que vos instructions apparaissent dans les Références. Si Copilot ignore une règle, corrigez le fichier, pas le prompt. Critères : 409 sur chevauchement, 401 sans jeton, 403 sans le bon rôle. »

ANIMATION — Lancer le minuteur. Points d’étape à 10 et 20 minutes : « Où en êtes-vous : plan, instructions, lot 1, 2 ou 3 ? » Quelqu’un bloqué partage son écran 2 minutes. Rappeler que tout générer en un seul prompt rend le diff impossible à relire. Pour le bonus : coller dans le Chat l’en-tête d’une skill (name, description, disable-model-invocation).

TRANSITION — « Votre API tourne. Est-elle correcte ? Module 3 : les tests. »`,
];
// @@NOTES-END
