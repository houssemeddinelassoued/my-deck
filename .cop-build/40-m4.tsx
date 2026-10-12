// ─── Module 4 · Optimisation & refactoring ──────────────────────────────────

const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Optimisation
        <br />
        et refactoring avancé
      </>
    }
    sub="Repérer les anti-patterns du code généré, restructurer avec SOLID, optimiser en mesurant, moderniser le legacy."
    dur="13:40 – 14:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 4 · refactoring en profondeur</Tag>}
  >
    <SecItem n={1}>Les anti-patterns du code généré</SecItem>
    <SecItem n={2}>Refactoring avancé : SOLID</SecItem>
    <SecItem n={3}>Optimiser les performances</SecItem>
    <SecItem n={4}>Moderniser du code legacy</SecItem>
    <SecItem n={5}>Comparer les implémentations générées</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Anti-patterns (exercice) ───────────────────────────────────────────────
const M4_Smells: Page = () => (
  <Frame mod={4} kind="exercice" beats={6}>
    <Title>Repérez les anti-patterns : six défauts, une fonction</Title>
    <Lede>Du code généré « qui marche ». Cherchez les défauts avant que les réponses n’apparaissent.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1040 }}>
      <CodeDark file="booking.service.ts" size={20}>
        <Ck>async</Ck> <Cf>book</Cf>(req: <Ck>any</Ck>) {'{'}
        <M3Mark n={1} />
        {'\n'}
        {'  '}<Ck>if</Ck> (!req.roomId || !req.start) <Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'bad'</Cs>);{'\n'}
        {'  '}<Ck>const</Ck> s = <Ck>new</Ck> <Cf>Date</Cf>(req.start), e = <Ck>new</Ck> <Cf>Date</Cf>(req.end);{'\n'}
        {'  '}<Ck>if</Ck> (s.<Cf>getHours</Cf>() {'<'} <Cn>8</Cn> || e.<Cf>getHours</Cf>() {'>'} <Cn>19</Cn>) <Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'closed'</Cs>);
        <M3Mark n={2} />
        {'\n'}
        {'  '}<Ck>const</Ck> rooms = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>query</Cf>(<Cs>'SELECT * FROM rooms'</Cs>);{'\n'}
        {'  '}<Ck>for</Ck> (<Ck>const</Ck> r <Ck>of</Ck> rooms) {'{'}
        {'\n'}
        {'    '}<Ck>const</Ck> bs = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>query</Cf>(<Cs>'SELECT * FROM bookings'</Cs>);
        <M3Mark n={3} />
        {'\n'}
        {'    '}<Ck>for</Ck> (<Ck>const</Ck> b <Ck>of</Ck> bs){'\n'}
        {'      '}<Ck>if</Ck> (r.id === req.roomId {'&&'} b.roomId === r.id {'&&'} s {'<'} b.end {'&&'} b.start {'<'} e){'\n'}
        {'        '}<Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'conflict'</Cs>);
        <M3Mark n={4} />
        {'\n'}
        {'  }'}
        {'\n'}
        {'  '}<Ck>const</Ck> id = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>insert</Cf>(<Cs>'bookings'</Cs>, req);{'\n'}
        {'  '}<Ck>try</Ck> {'{'} <Ck>await</Ck> <Ck>new</Ck> <Cf>SmtpMailer</Cf>().<Cf>send</Cf>(req.email); {'}'} <Ck>catch</Ck> {'{}'}
        <M3Mark n={5} />
        {'\n'}
        {'  '}<Ck>return</Ck> id;
        <M3Mark n={6} />
        {'\n'}
        {'}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1210, top: 262, width: 590, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="any à l’entrée">Plus aucun contrat : la validation est contournée.</M3Flaw>
      <M3Flaw n={2} title="Valeurs magiques">8 et 19 en dur, fuseau horaire ignoré.</M3Flaw>
      <M3Flaw n={3} title="N+1, tout charger">Une requête par salle, toutes les réservations à chaque fois.</M3Flaw>
      <M3Flaw n={4} title="Erreurs non typées">« conflict » : la route ne peut pas répondre 409 proprement.</M3Flaw>
      <M3Flaw n={5} title="Exception avalée, new caché">Échec d’envoi invisible ; mailer impossible à tester.</M3Flaw>
      <M3Flaw n={6} title="Fonction fourre-tout">Valide, calcule, persiste, notifie : quatre raisons de changer.</M3Flaw>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(600) }}>
      <Icon name="chart" size={24} color={C.violet} />
      GitClear 2025 : en 2024, pour la première fois, plus de lignes copiées-collées que de lignes déplacées par refactoring.
    </div>
  </Frame>
);

// ─── SOLID ──────────────────────────────────────────────────────────────────
const M4Solid = ({ l, tone, name, symptom, prompt, beat }: { l: string; tone: Tone; name: string; symptom: string; prompt: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '70px 300px 400px 1fr', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '12px 22px' }}>
    <span style={{ width: 62, height: 62, borderRadius: 14, background: STRONG[tone], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 36 }}>{l}</span>
    <span style={{ fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{name}</span>
    <span style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>{symptom}</span>
    <span style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.45, color: C.navy }}>{prompt}</span>
  </div>
);

const M4_Solid: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Refactoring avancé : SOLID, un principe par prompt</Title>
    <Lede>« Applique SOLID » donne un diff géant. Nommez le symptôme, le principe et la cible : un refactoring par demande.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '70px 300px 400px 1fr', gap: 22, padding: '0 22px', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span />
        <span>PRINCIPE</span>
        <span>SYMPTÔME DANS LE CODE GÉNÉRÉ</span>
        <span>LE PROMPT</span>
      </div>
      <M4Solid l="S" tone="blue" name="Responsabilité unique" symptom="book() valide, calcule, persiste et notifie" prompt="Extrais validation, règle de chevauchement et notification. book() ne fait plus qu’orchestrer." beat={0} />
      <M4Solid l="O" tone="teal" name="Ouvert / fermé" symptom="switch (room.kind) recopié en trois endroits" prompt="Remplace le switch par une stratégie par type de salle. Ajouter « amphi » ne modifie aucune classe." beat={1} />
      <M4Solid l="L" tone="violet" name="Substitution de Liskov" symptom="InMemoryRepo.delete() lève « non implémenté »" prompt="Écris un test de contrat commun à toutes les implémentations du repository." beat={2} />
      <M4Solid l="I" tone="pink" name="Ségrégation des interfaces" symptom="IBookingRepository à 14 méthodes" prompt="Découpe par usage : lecture de disponibilité, écriture de réservation." beat={3} />
      <M4Solid l="D" tone="green" name="Inversion des dépendances" symptom="new SmtpMailer() dans le service" prompt="Injecte un port Notifier par le constructeur ; l’adaptateur SMTP vit dans l’infrastructure." beat={4} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(600) }}>
      <Icon name="flag" size={24} color={C.violet} />
      Règle : tests au vert avant, tests au vert après, <strong style={{ color: C.navy }}>aucun fichier de test modifié</strong> pendant un refactoring.
    </div>
  </Frame>
);

// ─── Performance ────────────────────────────────────────────────────────────
const M4Bar = ({ label, ms, w, tone, cls }: { label: string; ms: string; w: number; tone: Tone; cls?: string }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.ink, marginBottom: 6 }}>
      <span>{label}</span>
      <strong style={{ fontFamily: mono, color: STRONG[tone] }}>{ms}</strong>
    </div>
    <div style={{ height: 26, borderRadius: 13, background: C.panel, overflow: 'hidden' }}>
      <div className={cls} style={{ width: `${w}%`, height: '100%', borderRadius: 13, background: STRONG[tone] }} />
    </div>
  </div>
);

const M4_Perf: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Optimiser : mesurer d’abord, demander mieux ensuite</Title>
    <Lede>Copilot écrit spontanément l’algorithme le plus évident. Il sait faire mieux… si on lui donne la mesure et la cible.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file="Prompt" size={21} wrap>
        Analyse la complexité de <Cf>findAvailableRooms</Cf> (voir le profil joint : 1,8 s pour 200 salles et 10 000 réservations).{'\n\n'}
        Propose une version en O((R + B) log B) : réservations indexées par salle et triées par début.{'\n\n'}
        <span style={{ color: '#FFD27A' }}>Même signature. Tests existants inchangés et au vert. Ajoute un benchmark reproductible.</span>
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10, ...dl(300) }}>
        <Bullet size={23} tone="blue">Profiler avant : on optimise ce qui coûte, pas ce qu’on suppose</Bullet>
        <Bullet size={23} tone="blue">Côté base : requête bornée + index (room_id, start)</Bullet>
        <Bullet size={23} tone="blue">Lisibilité contre performance : un choix, pas un réflexe</Bullet>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1040, top: 262, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(200) }}>
      <PanelTitle icon="gauge">Benchmark · 200 salles × 10 000 réservations</PanelTitle>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M4Bar label="Généré au TP 2 · boucles imbriquées" ms="1 840 ms" w={100} tone="coral" cls={A.grow} />
        <M4Bar label="Index par salle + tri" ms="14 ms" w={2} tone="green" cls={b.grow(1)} />
        <M4Bar label="Requête SQL bornée + index" ms="3 ms" w={1} tone="teal" cls={b.grow(2)} />
      </div>
      <div style={{ marginTop: 22, fontSize: 19, color: C.muted }}>Ordres de grandeur illustratifs : mesurez sur votre machine au TP 4.</div>
    </div>
  </Frame>
);

// ─── Legacy ─────────────────────────────────────────────────────────────────
const M4Leg = ({ n, tone, icon, title, children, beat }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 316, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={42} />
      <IconTile name={icon} tone={tone} size={42} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M4_Legacy: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Moderniser du legacy : figer avant de toucher</Title>
    <Lede>Copilot excelle à expliquer et à réécrire. Le risque : réécrire en changeant le comportement sans que personne le voie.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M4Leg n={1} tone="blue" icon="search" title="Comprendre" beat={0}>
        /explain, diagramme de séquence, glossaire métier. Rien ne bouge.
      </M4Leg>
      <M4Leg n={2} tone="yellow" icon="lock" title="Figer" beat={1}>
        Tests de caractérisation : on capture le comportement actuel, bugs compris.
      </M4Leg>
      <M4Leg n={3} tone="violet" icon="route" title="Contourner" beat={2}>
        Figuier étrangleur : le nouveau module derrière la même interface.
      </M4Leg>
      <M4Leg n={4} tone="pink" icon="wand" title="Moderniser" beat={3}>
        Un changement par PR : types, async, API dépréciée, version du langage.
      </M4Leg>
      <M4Leg n={5} tone="green" icon="checkCircle" title="Retirer" beat={4}>
        Bascule mesurée, puis suppression de l’ancien code.
      </M4Leg>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(600) }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={24}>
        « Corrige les bugs au passage » : une modernisation ne change pas le comportement. Les bugs trouvés vont dans des tickets séparés.
      </Callout>
    </div>
  </Frame>
);

// ─── Comparer des implémentations (matrice pondérée interactive) ───────────
const M4_SCORES = {
  naif: [5, 1, 4, 4],
  index: [3, 4, 4, 3],
  sql: [4, 5, 2, 4],
};
type M4Key = keyof typeof M4_SCORES;

const M4Weight = ({ label, v, set, tone }: { label: string; v: number; set: (x: number) => void; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 170, fontSize: 22, fontWeight: 600, color: C.ink }}>{label}</span>
    <Range value={v} onChange={set} min={0} max={5} w={230} tone={tone} />
    <span style={{ width: 30, fontFamily: mono, fontSize: 24, fontWeight: 700, color: STRONG[tone] }}>{v}</span>
  </div>
);

const M4Impl = ({ id, name, sub, total, max, best }: { id: M4Key; name: string; sub: string; total: number; max: number; best: boolean }) => (
  <div style={{ background: best ? T.green.bg : C.card, borderRadius: 16, boxShadow: best ? `inset 0 0 0 3px ${C.green}` : SHADOW_SM, padding: '16px 22px', transition: `all 300ms ${EASE}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>
          {name} {best ? <Tag tone="green" size={17}>retenue</Tag> : null}
        </div>
        <div style={{ fontSize: 19, color: C.muted }}>{sub}</div>
      </div>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: best ? C.green : C.soft }}>{total}</span>
    </div>
    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
      <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{M4_SCORES[id].join(' · ')}</span>
    </div>
    <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${max ? (total / max) * 100 : 0}%`, height: '100%', background: best ? C.green : C.faint, transition: `width 400ms ${EASE}` }} />
    </div>
  </div>
);

const M4_Compare: Page = () => {
  const [w, setW] = useState([3, 3, 3, 3]);
  const setAt = (i: number) => (x: number) => setW((o) => o.map((y, j) => (j === i ? x : y)));
  const tot = (id: M4Key) => M4_SCORES[id].reduce((a, s, i) => a + s * w[i], 0);
  const t = { naif: tot('naif'), index: tot('index'), sql: tot('sql') };
  const max = Math.max(t.naif, t.index, t.sql);
  return (
    <Frame mod={4} kind="demo">
      <Title>Comparer les implémentations générées</Title>
      <Lede>Demandez trois versions aux compromis différents, puis choisissez avec vos critères — pas ceux du modèle.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 720 }}>
        <CodeDark file="Prompt" size={20} wrap>
          Propose trois implémentations de findAvailableRooms aux compromis différents. Pour chacune : complexité, avantages, risques. <span style={{ color: '#FFD27A' }}>Ne choisis pas : présente un tableau.</span>
        </CodeDark>
        <div style={{ marginTop: 26, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Eyebrow c={C.navy} size={19}>
            Poids de vos critères (0 à 5)
          </Eyebrow>
          <M4Weight label="Lisibilité" v={w[0]} set={setAt(0)} tone="blue" />
          <M4Weight label="Performance" v={w[1]} set={setAt(1)} tone="coral" />
          <M4Weight label="Testabilité" v={w[2]} set={setAt(2)} tone="pink" />
          <M4Weight label="Cohérence" v={w[3]} set={setAt(3)} tone="teal" />
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 900, top: 262, width: 900, display: 'flex', flexDirection: 'column', gap: 16, ...dl(200) }}>
        <M4Impl id="naif" name="A · Boucles simples" sub="O(R × B) · évident à relire" total={t.naif} max={max} best={t.naif === max} />
        <M4Impl id="index" name="B · Index en mémoire trié" sub="O((R + B) log B) · plus de code" total={t.index} max={max} best={t.index === max} />
        <M4Impl id="sql" name="C · Requête SQL indexée" sub="délègue à la base · tests d’intégration requis" total={t.sql} max={max} best={t.sql === max} />
        <Hint>Notes 1 à 5 par critère (lisibilité · performance · testabilité · cohérence). Bougez les curseurs.</Hint>
      </div>
    </Frame>
  );
};

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="Un refactoring trop gros"
    q="Vous demandez de refactorer BookingService. Le diff touche 14 fichiers et modifie 3 tests. Les tests passent. Que faites-vous ?"
    explain="Un refactoring se prouve par des tests inchangés. Un diff que personne ne peut relire n’est pas un gain de temps : c’est une dette différée."
  >
    <Opt why="Les tests ont été modifiés dans le même diff : ils ne prouvent plus que le comportement est préservé.">
      L’accepter : les tests passent
    </Opt>
    <Opt ok why="Exact : on rejette, puis un refactoring par demande, tests inchangés, un commit chacun. Chaque diff reste relisible.">
      Rejeter et redemander par petites étapes, tests intouchés
    </Opt>
    <Opt why="Reporter la relecture, c’est la faire sur un diff encore plus gros, mélangé à d’autres changements.">
      L’accepter et relire plus tard, en pull request
    </Opt>
    <Opt why="Un résumé décrit l’intention de l’agent, pas ce que fait réellement le diff.">
      Demander un résumé du diff et valider sur cette base
    </Opt>
  </QcmPage>
);

// ─── TP 4 ───────────────────────────────────────────────────────────────────
const M4_TP: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Refactoring en profondeur"
    defi="refacto"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>REFACTO.md</PathChip> rapport priorisé
        <br />
        un commit par refactoring
        <br />
        <PathChip>bench/availability.*</PathChip>
      </>
    }
    objective={<>Optimiser le code généré le matin en appliquant les principes SOLID et les patterns vus, sans changer le comportement.</>}
    crit={
      <>
        <CheckItem id="tp4-1" size={21}>Rapport d’anti-patterns produit et priorisé</CheckItem>
        <CheckItem id="tp4-2" size={21}>Trois refactorings, un commit chacun</CheckItem>
        <CheckItem id="tp4-3" size={21}>Aucun fichier de test modifié entre-temps</CheckItem>
        <CheckItem id="tp4-4" size={21}>Benchmark avant / après de la recherche</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Mode Ask : anti-patterns et violations SOLID de votre code. Un rapport, aucune modification.</M2Step>
      <M2Step n={2}>Priorisez trois refactorings avec votre binôme.</M2Step>
      <M2Step n={3}>Un refactoring, un prompt, un commit. Tests au vert à chaque fois.</M2Step>
      <M2Step n={4}>Optimisez findAvailableRooms, benchmark à l’appui.</M2Step>
    </div>
    <TpBonus>Ajoutez le type de salle « amphi » sans modifier une seule classe existante.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M4_Divider, M4_Smells, M4_Solid, M4_Perf, M4_Legacy, M4_Compare, M4_Qcm, M4_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M4 · 13:40

OBJECTIF — Annoncer le module 4 du programme : optimisation et refactoring avancé.

DIRE — « Module 4. Copilot produit du code qui marche ; il ne produit pas spontanément du code qui dure. On va identifier les anti-patterns du code généré, refactorer avec SOLID, optimiser les performances en mesurant, moderniser du legacy, et apprendre à comparer plusieurs implémentations. TP 4 : un refactoring en profondeur de votre code du matin. »

TRANSITION — « Commençons par un exercice d’œil. »`,
  `⏱ 5 min · ANTI-PATTERNS (exercice, 6 temps)

OBJECTIF — Identifier les anti-patterns dans le code généré par Copilot.

DIRE — « Cette fonction a été générée en un prompt. Elle fonctionne. Trouvez six défauts. » Laisser chercher une minute, puis → clic par défaut. « Un : any, plus aucun contrat. Deux : 8 et 19 en dur, et le fuseau ignoré. Trois : une requête par salle, et toutes les réservations à chaque tour. Quatre : des erreurs en chaîne de caractères, la route ne peut pas répondre 409 proprement. Cinq : une exception avalée et un new caché, impossible à tester. Six : la fonction fait quatre choses. Le chiffre en haut : le rapport GitClear 2025 observe que 2024 est la première année où les lignes copiées-collées dépassent les lignes déplacées par refactoring. L’IA duplique plus qu’elle ne factorise. »

TRANSITION — « Comment corriger ? Un principe à la fois. »`,
  `⏱ 4 min · SOLID (4 temps)

OBJECTIF — Refactoring avancé : restructuration, découplage, SOLID.

DIRE — « Demander "applique SOLID", c’est obtenir un diff de quinze fichiers impossible à relire. Pour chaque principe : le symptôme dans le code généré, et le prompt ciblé. Responsabilité unique : on extrait, book() orchestre. » → clic. « Ouvert-fermé : le switch recopié devient une stratégie. » → clic. « Liskov : l’implémentation qui lève "non implémenté" ; un test de contrat commun le révèle. » → clic. « Ségrégation : l’interface à quatorze méthodes. » → clic. « Inversion : le new SmtpMailer devient un port injecté. Et la règle du bas : pendant un refactoring, aucun fichier de test ne bouge. »

TRANSITION — « Le défaut numéro trois, c’était la performance. »`,
  `⏱ 4 min · PERFORMANCE (2 temps)

OBJECTIF — Optimisation des performances : génération d’algorithmes efficaces.

DIRE — « Copilot écrit l’algorithme le plus évident. Il sait faire mieux si on lui donne la mesure et la cible : le profil, la complexité visée, la contrainte de signature, les tests inchangés, et un benchmark reproductible. Le code du TP 2 : près de deux secondes. » → clic. « Index par salle et tri : quelques millisecondes. » → clic. « Une requête bornée avec index côté base : encore mieux, mais il faut alors des tests d’intégration. Les chiffres sont des ordres de grandeur : vous mesurerez les vôtres. Et lisibilité contre performance, c’est un choix, pas un réflexe. »

TRANSITION — « Optimiser du code neuf, c’est facile. Moderniser du vieux code, beaucoup moins. »`,
  `⏱ 4 min · LEGACY (4 temps)

OBJECTIF — Utiliser Copilot pour moderniser du code legacy.

DIRE — « Copilot est excellent pour expliquer du code ancien : /explain, diagramme de séquence, glossaire. Première étape, on ne touche à rien. » → clic. « Deux : on fige le comportement avec des tests de caractérisation — Copilot les génère très bien —, bugs compris. » → clic. « Trois : le figuier étrangleur, le nouveau module derrière la même interface. » → clic. « Quatre : un changement par PR. » → clic. « Cinq : bascule mesurée, puis suppression. Le piège : "corrige les bugs au passage". Une modernisation qui change le comportement n’est plus vérifiable. »

TRANSITION — « Dernier outil : quand Copilot propose plusieurs solutions, comment choisir ? »`,
  `⏱ 4 min · COMPARER LES IMPLÉMENTATIONS (démo interactive)

OBJECTIF — Comparer les implémentations générées et choisir la meilleure approche.

DIRE — « On demande trois versions aux compromis différents, et surtout on interdit au modèle de choisir : il présente un tableau. Ensuite, on décide avec nos critères. Avec des poids égaux, la requête SQL l’emporte. » Pousser Testabilité à 5, Performance à 1. « Si votre équipe n’a pas de base en test, les boucles simples gagnent. » Pousser Performance à 5. « Si la recherche est critique, l’index. Le choix dépend du contexte : c’est votre travail, pas celui de Copilot. »

ANIMATION — Faire proposer les poids par le groupe.

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 4

OBJECTIF — Ancrer la discipline du refactoring par petits pas.

DIRE — « Le réflexe : un diff que vous ne pouvez pas relire se rejette. Les tests modifiés dans le même diff ne prouvent plus rien. »

TRANSITION — « TP 4. »`,
  `⏱ 25 min (minuteur) · TP 4

OBJECTIF — Atelier du programme : refactoring en profondeur, optimiser le code généré le matin en appliquant SOLID et les patterns vus.

DIRE — « D’abord un diagnostic en mode Ask : un rapport, aucune modification. Priorisez trois refactorings. Puis un prompt, un commit, à chaque fois tests au vert et aucun fichier de test touché. Enfin la recherche de salles, benchmark avant et après. Bonus : ajouter un type de salle sans modifier une classe existante, c’est le test de l’ouvert-fermé. »

ANIMATION — Minuteur. Vérifier les historiques git : un commit par refactoring.

TRANSITION — « Votre code est propre. Est-il sûr ? Module 5. »`,
];
// @@NOTES-END
