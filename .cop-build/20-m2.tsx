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
    sub="De l’arborescence à l’API REST complète : structure, patterns, dépendances, sans perdre la main sur le design."
    dur="10:45 – 11:40 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 2 · API REST complète</Tag>}
  >
    <SecItem n={1}>Générer une structure de projet complète</SecItem>
    <SecItem n={2}>Une API REST de bout en bout</SecItem>
    <SecItem n={3}>Repository, Service, Factory</SecItem>
    <SecItem n={4}>Générer à l’image de l’existant</SecItem>
    <SecItem n={5}>Dépendances et imports générés</SecItem>
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
    <Lede>L’arborescence est une décision d’architecture : on la fait proposer en mode Plan, on la discute, puis on la fige.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <CodeDark file="Prompt · mode Plan" size={21} wrap>
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
      <CodeDark file="Prompt · mode Agent" size={22} wrap>
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
    who="Binôme"
    minutes={30}
    where={
      <>
        <PathChip>PLAN.md</PathChip> plan validé, en lots
        <br />
        <PathChip>src/**</PathChip> selon l’arborescence retenue
        <br />
        <PathChip>openapi.yaml</PathChip> ou route /docs
      </>
    }
    objective={
      <>
        L’API {PROJECT} fonctionne : authentification JWT, CRUD des salles (admin), réservations avec contrôle de chevauchement, validation et documentation.
      </>
    }
    crit={
      <>
        <CheckItem id="tp2-1" size={21}>Plan validé avant toute ligne de code</CheckItem>
        <CheckItem id="tp2-2" size={21}>Chevauchement refusé : 409 Conflict</CheckItem>
        <CheckItem id="tp2-3" size={21}>401 sans jeton, 403 si non admin</CheckItem>
        <CheckItem id="tp2-4" size={21}>Doc OpenAPI accessible et à jour</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Mode Plan : arborescence et interfaces, à valider.</M2Step>
      <M2Step n={2}>Lot 1 : domaine (reprenez overlaps du TP 1) et repositories en mémoire.</M2Step>
      <M2Step n={3}>Lot 2 : services et erreurs métier typées.</M2Step>
      <M2Step n={4}>Lot 3 : routes, validation, auth · lot 4 : OpenAPI.</M2Step>
    </div>
    <TpBonus>Demandez à Copilot une revue d’architecture de son propre code : écarts au plan, couplages, logique dans les routes.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M2_Divider, M2_Scaffold, M2_ApiFlow, M2_Patterns, M2_Exemplar, M2_Deps, M2_Qcm, M2_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M2 · 10:45

OBJECTIF — Annoncer le module 2 du programme : génération de modules et d’architectures complexes.

DIRE — « Module 2 : on passe de la fonction au module, puis à l’application. Générer une structure complète, développer une API REST de bout en bout, travailler avec les patterns Repository, Service et Factory, gérer les dépendances et les imports générés, et garder un code maintenable. Le TP 2 produit l’API SalleLibre complète. »

TRANSITION — « Tout commence par l’arborescence. »`,
  `⏱ 4 min · STRUCTURE DE PROJET (2 temps)

OBJECTIF — Générer une structure de projet complète : arborescence, modules, interfaces.

DIRE — « L’arborescence, c’est de l’architecture : on ne la laisse pas émerger au fil des prompts. Mode Plan : on donne le contexte, le style d’architecture voulu, et on demande pour chaque dossier son rôle en une ligne, plus la liste des interfaces à créer en premier. Aucune implémentation. » → clic. « Voici une proposition retenue : un domaine pur, des repositories derrière des interfaces, des services métier, des routes fines, et PLAN.md qui garde le plan. » → clic. « Interfaces d’abord : une fois les contrats validés, les implémentations se génèrent par lots, et l’arbo figée va dans les instructions du dépôt pour que chaque session la respecte. »

TRANSITION — « Suivons une requête à travers ces couches. »`,
  `⏱ 4 min · API DE BOUT EN BOUT (1 temps)

OBJECTIF — Développer une API REST complète : routes, modèles, validation, et montrer les équivalents par stack.

DIRE — « Une réservation entre par une requête avec un jeton. L’authentification établit l’identité et le rôle. La validation rejette ce qui est mal formé avant tout traitement. La route, fine, traduit HTTP vers le métier. Le service applique les règles : heures ouvrées, chevauchement. Le repository persiste. Chaque couche a sa responsabilité, donc son prompt et ses tests : c’est ce découpage qui rend la génération relisible. » → clic. « Le tableau des équivalents pour vos stacks : Copilot les connaît toutes ; précisez toujours la vôtre et sa version dans les instructions. »

TRANSITION — « Dans ces couches, trois patterns reviennent. »`,
  `⏱ 4 min · PATTERNS (cartes à retourner)

OBJECTIF — Travailler avec Repository, Service et Factory.

DIRE — « Copilot connaît ces patterns par cœur. Ce qu’il ne connaît pas, c’est votre variante : quelles méthodes, quelles erreurs, ce qui est interdit dedans. Retournons les cartes. » Cliquer chaque carte. « Remarquez : chaque prompt dit ce qu’il ne faut pas faire. Pas de logique métier dans le repository, pas d’objet HTTP dans le service. Et le piège : demander les bonnes pratiques en général produit des couches vides. Un pattern se justifie par un besoin. »

TRANSITION — « Le plus efficace pour un code maintenable, c’est de montrer un modèle. »`,
  `⏱ 3 min · GÉNÉRER À L’IMAGE DE L’EXISTANT (3 temps)

OBJECTIF — Copilot et les design patterns : générer du code maintenable et extensible.

DIRE — « Copilot imite mieux qu’il n’invente. Le prompt : crée RoomService exactement sur le modèle de BookingService, tests compris, et demande avant de t’écarter. C’est ce qui garde trente services cohérents. À droite, les quatre contrats à exiger : dépendances injectées. » → clic. « Erreurs métier typées. » → clic. « Interfaces aux frontières. » → clic. « Routes sans logique. Ce sont aussi vos critères de revue cet après-midi. »

TRANSITION — « Dernier point avant le TP : ce que Copilot importe. »`,
  `⏱ 3 min · DÉPENDANCES (1 temps)

OBJECTIF — Gérer les dépendances et les imports générés automatiquement.

DIRE — « Quatre risques. Le paquet halluciné : l’étude USENIX Security 2025 de Spracklen et al. a mesuré près de 20 % de paquets inexistants parmi ceux recommandés par 16 modèles. Et comme les mêmes noms reviennent, un attaquant peut les publier : c’est le slopsquatting. La version datée, l’import fantôme, la dépendance superflue. » → clic. « Les règles d’équipe : une liste blanche dans les instructions, interdiction d’ajouter une dépendance sans accord, vérification sur le registre, lockfile commité et audit en CI. »

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 2

OBJECTIF — Vérifier le réflexe de vérification des dépendances.

DIRE — « Le piège C est le plus intéressant : demander au modèle de valider sa propre hallucination. Il le fera avec aplomb. La vérification se fait hors du modèle. »

ANIMATION — Vote, clic, → bonne réponse, → l’essentiel.

TRANSITION — « TP 2 : l’API complète. »`,
  `⏱ 30 min (minuteur) · TP 2

OBJECTIF — Cas pratique du programme : générer une API REST complète avec authentification, validation et documentation, en utilisant des prompts structurés.

DIRE — « Quatre lots, un plan. D’abord le mode Plan : arborescence et interfaces, vous validez, vous sauvegardez dans PLAN.md. Puis le domaine — reprenez overlaps du TP 1 — et des repositories en mémoire : pas de base de données aujourd’hui, ça garde les tests rapides. Puis les services, puis routes, validation et authentification, puis la documentation. Critères : un chevauchement renvoie 409, une route protégée renvoie 401 sans jeton et 403 sans le bon rôle. »

ANIMATION — Minuteur. Vérifier que les binômes valident le plan avant de coder. Signaler les binômes qui génèrent tout en un seul prompt : leur faire relire le diff.

TRANSITION — « Votre API tourne. Est-elle correcte ? Module 3 : les tests. »`,
];
// @@NOTES-END
