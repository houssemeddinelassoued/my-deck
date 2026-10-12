// ─── Module 1 · Prompt engineering avancé ───────────────────────────────────

const M1_Divider: Page = () => (
  <Section
    n={1}
    title={
      <>
        Prompt engineering
        <br />
        avancé
      </>
    }
    sub="Comprendre ce que Copilot voit, structurer la demande, décomposer, mesurer et itérer."
    dur="9:20 – 10:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 1 · réécrire et mesurer</Tag>}
  >
    <SecItem n={1}>Comment Copilot interprète le contexte</SecItem>
    <SecItem n={2}>Contexte, contraintes, exemples attendus</SecItem>
    <SecItem n={3}>Prompts multi-étapes et commentaires structurés</SecItem>
    <SecItem n={4}>Comparer, mesurer, itérer</SecItem>
    <SecItem n={5}>Inline, Chat ou Agent : le bon outil</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── Ce que Copilot voit ────────────────────────────────────────────────────
const M1Seg = ({ icon, tone, title, sub, beat }: { icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 5px 0 0 ${STRONG[tone]}` }}>
    <Icon name={icon} size={28} color={T[tone].fg} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M1_Context: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Ce que Copilot voit vraiment</Title>
    <Lede>Deux mécanismes, deux contextes différents. Ce qui n’est pas dans la fenêtre n’existe pas pour le modèle.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="code" c={C.blue}>
        Complétion inline · ghost text
      </PanelTitle>
      <CodeDark file="booking.ts" size={20}>
        <div style={{ boxShadow: 'inset 4px 0 0 #82AAFF', paddingLeft: 12 }}>
          <Ck>import</Ck> {'{ Booking }'} <Ck>from</Ck> <Cs>'./types'</Cs>;{'\n'}
          <Cc>{'/** Vrai si les deux créneaux se recouvrent. */'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>overlaps</Cf>(a: Booking, b: Booking) {'{'}
        </div>
        <div style={{ paddingLeft: 16 }}>
          {'  '}
          <Ck>return</Ck> <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>a.start {'<'} b.end {'&&'} b.start {'<'} a.end;</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 24, background: '#FFD27A', verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
        <div style={{ boxShadow: 'inset 4px 0 0 #C792EA', paddingLeft: 12 }}>
          {'}'}
          {'\n'}
          <Ck>export function</Ck> <Cf>isWithinHours</Cf>(b: Booking) {'{ … }'}
        </div>
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={23} tone="blue">
          Préfixe <em>et</em> suffixe autour du curseur (fill-in-the-middle)
        </Bullet>
        <Bullet size={23} tone="blue">
          Onglets ouverts, fichiers voisins, imports, nom du fichier
        </Bullet>
        <Bullet size={23} tone="coral">
          Pas vos instructions personnalisées : elles servent au chat
        </Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="chat" c={C.violet}>
        Chat et agent · fenêtre de contexte
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M1Seg icon="gear" tone="grey" title="Prompt système et outils disponibles" sub="fixé par l’outil, invisible pour vous" beat={1} />
        <M1Seg icon="doc" tone="navy" title="Instructions du dépôt" sub="copilot-instructions.md · *.instructions.md" beat={1} />
        <M1Seg icon="link" tone="blue" title="Vos références explicites" sub="#file · #selection · #codebase · #problems" beat={1} />
        <M1Seg icon="loop" tone="yellow" title="Historique de la session" sub="tout ce qui a été dit… y compris les erreurs" beat={1} />
        <M1Seg icon="terminal" tone="teal" title="Résultats d’outils" sub="recherche, terminal, tests (mode Agent)" beat={1} />
        <M1Seg icon="send" tone="violet" title="Votre message" sub="souvent la plus petite part du contexte" beat={1} />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 905, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>
        <strong>Conséquence :</strong> pour l’inline, on soigne le fichier et les onglets ; pour le chat, on soigne les instructions et les références.
      </span>
    </div>
  </Frame>
);

// ─── Structurer un prompt (constructeur interactif) ─────────────────────────
const M1_PARTS = [
  { label: 'Contexte', tone: 'blue' as Tone, txt: 'Projet SalleLibre, API REST. Les types Booking et Room sont dans #file:src/domain/types.' },
  { label: 'Tâche bornée', tone: 'violet' as Tone, txt: 'Écris uniquement la fonction overlaps(a, b) qui dit si deux réservations se recouvrent.' },
  { label: 'Contraintes', tone: 'pink' as Tone, txt: 'Fonction pure, sans dépendance. Créneaux semi-ouverts [début, fin[ : 10h–11h et 11h–12h ne se recouvrent pas.' },
  { label: 'Exemples attendus', tone: 'teal' as Tone, txt: 'overlaps(9h–10h, 9h30–11h) → true · overlaps(9h–10h, 10h–11h) → false · même salle seulement.' },
  { label: 'Critère de fin', tone: 'green' as Tone, txt: 'Ajoute les tests de ces exemples, lance la suite : tout doit passer. Résume en 3 lignes.' },
];

const M1Part = ({ i, on }: { i: number; on: boolean }) => {
  const p = M1_PARTS[i];
  return on ? (
    <div className={A.fade} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDuration: '400ms' } as CSSProperties}>
      <span style={{ flex: 'none', width: 8, alignSelf: 'stretch', borderRadius: 4, background: STRONG[p.tone] }} />
      <span>{p.txt}</span>
    </div>
  ) : null;
};

const M1PartBtn = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const p = M1_PARTS[i];
  return <Toggle on={on} onChange={flip} tone={p.tone} size={24} label={<span style={{ fontWeight: 600 }}>{p.label}</span>} />;
};

const M1_Anatomy: Page = () => {
  const [on, setOn] = useState<boolean[]>([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const verdict =
    n === 0
      ? 'Copilot devine tout : bornes, types, format.'
      : n < 3
        ? 'Mieux, mais les cas limites restent au hasard.'
        : n < 5
          ? 'Presque : rien ne dit quand c’est fini.'
          : 'Prompt complet : résultat prévisible et vérifiable.';
  return (
    <Frame mod={1} kind="demo">
      <Title>Structurer un prompt : contexte, contraintes, exemples</Title>
      <Lede>Partez du prompt basique, ajoutez les composants un à un et regardez la demande devenir vérifiable.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 440, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Eyebrow c={C.navy} size={20}>
          Composants
        </Eyebrow>
        <M1PartBtn i={0} on={on[0]} flip={() => flip(0)} />
        <M1PartBtn i={1} on={on[1]} flip={() => flip(1)} />
        <M1PartBtn i={2} on={on[2]} flip={() => flip(2)} />
        <M1PartBtn i={3} on={on[3]} flip={() => flip(3)} />
        <M1PartBtn i={4} on={on[4]} flip={() => flip(4)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Vider
          </Btn>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 620, top: 270, width: 1180, ...dl(150) }}>
        <CodeDark file="Prompt (Chat · mode Agent)" size={23} wrap style={{ minHeight: 480 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <M1Part i={0} on={on[0]} />
            {on[1] ? <M1Part i={1} on /> : <div style={{ color: '#FFD27A' }}>Fais une fonction qui vérifie si deux réservations se chevauchent.</div>}
            <M1Part i={2} on={on[2]} />
            <M1Part i={3} on={on[3]} />
            <M1Part i={4} on={on[4]} />
          </div>
        </CodeDark>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 1 ? C.coral : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 2 ? C.yellow : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 3 ? C.yellow : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 4 ? C.green : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 5 ? C.green : C.panel }} />
          </div>
          <span style={{ fontSize: 25, fontWeight: 600, color: n === 5 ? T.green.fg : n >= 3 ? T.yellow.fg : T.coral.fg }}>{verdict}</span>
        </div>
      </div>
    </Frame>
  );
};

// ─── Prompts multi-étapes ───────────────────────────────────────────────────
const M1Stage = ({ n, tone, icon, title, prompt, check, beat }: { n: number; tone: Tone; icon: IconName; title: string; prompt: string; check: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={44} />
      <IconTile name={icon} tone={tone} size={44} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{title}</div>
    </div>
    <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '12px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, minHeight: 170 }}>{prompt}</div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.4, color: T.green.fg }}>
      <Icon name="checkCircle" size={24} color={C.green} style={{ marginTop: 3 }} />
      <span>{check}</span>
    </div>
  </div>
);

const M1_MultiStep: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Prompts multi-étapes : décomposer pour garder la main</Title>
    <Lede>Une tâche complexe en un seul prompt, c’est une revue impossible. Quatre étapes, chacune avec sa preuve.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M1Stage n={1} tone="blue" icon="chat" title="Clarifier" prompt="Avant d’écrire du code, pose-moi au plus 5 questions sur les règles de réservation." check="Ambiguïtés levées par écrit" beat={0} />
      <M1Stage n={2} tone="violet" icon="map" title="Planifier" prompt="Propose un plan en lots de 1 à 3 fichiers, avec le test qui valide chaque lot. Pas de code." check="Plan relu et validé" beat={1} />
      <M1Stage n={3} tone="pink" icon="code" title="Exécuter" prompt="Implémente uniquement le lot 1. Arrête-toi quand ses tests passent." check="Un lot = un diff relisible" beat={2} />
      <M1Stage n={4} tone="green" icon="eye" title="Vérifier" prompt="Relis ton diff : cas limites oubliés ? écart au plan ? Liste-les avant le lot suivant." check="Auto-critique, puis lot suivant" beat={3} />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      <Callout title="La règle" tone="violet" icon="flag">
        On ne passe jamais à l’étape suivante sans sa preuve. Session trop longue ou confuse ? <strong>Nouvelle session</strong>, avec le plan validé en entrée.
      </Callout>
    </div>
  </Frame>
);

// ─── Commentaires structurés ────────────────────────────────────────────────
const M1_DocComments: Page = () => (
  <Frame mod={1} kind="demo">
    <Title>Le commentaire structuré, un prompt durable</Title>
    <Lede>Signature typée + JSDoc, docstring ou Javadoc : l’inline a enfin des contraintes et des exemples à respecter.</Lede>
    <LangTabs initial="TypeScript" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="TypeScript" />
        <LangBtn lang="Python" tone="yellow" />
        <LangBtn lang="Java" tone="coral" />
        <LangBtn lang="C#" tone="violet" />
      </div>
      <LangPane lang="TypeScript">
        <CodeDark file="availability.ts" size={21}>
          <Cc>{`/**
 * Salles libres sur tout le créneau [from, to[.
 * @param rooms    salles candidates
 * @param bookings réservations existantes (toutes salles)
 * @param minSeats capacité minimale requise
 * @returns salles triées par capacité croissante
 * @throws RangeError si from >= to
 * @example findAvailableRooms(rooms, [], 9h, 10h, 4) → [r1, r3]
 */`}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>findAvailableRooms</Cf>(rooms: Room[], bookings: Booking[],{'\n'}
          {'  '}from: Date, to: Date, minSeats: <Cn>number</Cn>): Room[] {'{'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="availability.py" size={21}>
          <Ck>def</Ck> <Cf>find_available_rooms</Cf>(rooms: list[Room], bookings: list[Booking],{'\n'}
          {'                         '}start: datetime, end: datetime, min_seats: <Cn>int</Cn>) -{'>'} list[Room]:{'\n'}
          <Cs>{`    """Salles libres sur tout le créneau [start, end[.

    Args:
        bookings: réservations existantes (toutes salles).
        min_seats: capacité minimale requise.
    Returns:
        Salles triées par capacité croissante.
    Raises:
        ValueError: si start >= end.

    >>> find_available_rooms(rooms, [], nine, ten, 4)
    [r1, r3]
    """`}</Cs>
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="AvailabilityService.java" size={21}>
          <Cc>{`/**
 * Salles libres sur tout le créneau [from, to[.
 * @param bookings réservations existantes (toutes salles)
 * @param minSeats capacité minimale requise
 * @return salles triées par capacité croissante
 * @throws IllegalArgumentException si from n'est pas avant to
 * Exemple : aucune réservation, 9h-10h, 4 places → [r1, r3]
 */`}</Cc>
          {'\n'}
          <Ck>public</Ck> List{'<'}Room{'>'} <Cf>findAvailableRooms</Cf>(List{'<'}Room{'>'} rooms, List{'<'}Booking{'>'} bookings,{'\n'}
          {'    '}Instant from, Instant to, <Ck>int</Ck> minSeats) {'{'}
        </CodeDark>
      </LangPane>
      <LangPane lang="C#">
        <CodeDark file="AvailabilityService.cs" size={21}>
          <Cc>{`/// <summary>Salles libres sur tout le créneau [from, to[.</summary>
/// <param name="bookings">Réservations existantes (toutes salles).</param>
/// <param name="minSeats">Capacité minimale requise.</param>
/// <returns>Salles triées par capacité croissante.</returns>
/// <exception cref="ArgumentException">Si from >= to.</exception>
/// <example>Aucune réservation, 9h-10h, 4 places → [r1, r3]</example>`}</Cc>
          {'\n'}
          <Ck>public</Ck> IReadOnlyList{'<'}Room{'>'} <Cf>FindAvailableRooms</Cf>(IEnumerable{'<'}Room{'>'} rooms,{'\n'}
          {'    '}IEnumerable{'<'}Booking{'>'} bookings, DateTime from, DateTime to, <Ck>int</Ck> minSeats) {'{'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.right} tone="blue" icon="target" title="Des contraintes" size={22} style={dl(200)}>
        Bornes semi-ouvertes, tri, exception : ce qui était implicite devient exigé.
      </Card>
      <Card cls={A.right} tone="teal" icon="layers" title="Un exemple" size={22} style={dl(320)}>
        L’@example fixe le comportement mieux qu’une phrase de plus.
      </Card>
      <Card cls={A.right} tone="green" icon="eye" title="Relu en revue" size={22} style={dl(440)}>
        Versionné avec le code : il guide Copilot <em>et</em> le prochain lecteur.
      </Card>
    </div>
  </Frame>
);

// ─── Comparer des prompts ───────────────────────────────────────────────────
const M1Cell = ({ v, tone, cls }: { v: ReactNode; tone: Tone; cls?: string }) => (
  <div className={cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, borderRadius: 12, background: T[tone].bg, color: T[tone].fg, fontFamily: display, fontWeight: 700, fontSize: 26 }}>
    {v}
  </div>
);

const M1Head = ({ v, sub, tone, cls }: { v: string; sub: string; tone: Tone; cls?: string }) => (
  <div className={cls} style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: STRONG[tone] }}>{v}</div>
    <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M1Crit = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: 64, fontSize: 24, fontWeight: 600, color: C.ink }}>{children}</div>
);

const M1_Compare: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comparer des prompts : mesurer plutôt que ressentir</Title>
    <Lede>Même tâche, même modèle, nouvelle session, trois essais par version : Copilot n’est pas déterministe.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '400px 1fr 1fr 1fr', columnGap: 18, rowGap: 12 }}>
      <div />
      <M1Head v="V1" sub="prompt basique" tone="coral" />
      <M1Head v="V2" sub="+ contexte, contraintes" tone="yellow" cls={b.on(1)} />
      <M1Head v="V3" sub="+ exemples, critère de fin" tone="green" cls={b.on(2)} />
      <M1Crit>Compile du premier coup</M1Crit>
      <M1Cell v="1 / 3" tone="coral" />
      <M1Cell v="3 / 3" tone="green" cls={b.on(1)} />
      <M1Cell v="3 / 3" tone="green" cls={b.on(2)} />
      <M1Crit>Tests de référence passés</M1Crit>
      <M1Cell v="7 / 12" tone="coral" />
      <M1Cell v="10 / 12" tone="yellow" cls={b.on(1)} />
      <M1Cell v="12 / 12" tone="green" cls={b.on(2)} />
      <M1Crit>Bornes [début, fin[ correctes</M1Crit>
      <M1Cell v="✗" tone="coral" />
      <M1Cell v="✓" tone="green" cls={b.on(1)} />
      <M1Cell v="✓" tone="green" cls={b.on(2)} />
      <M1Crit>Conventions du projet</M1Crit>
      <M1Cell v="✗" tone="coral" />
      <M1Cell v="~" tone="yellow" cls={b.on(1)} />
      <M1Cell v="✓" tone="green" cls={b.on(2)} />
      <M1Crit>Allers-retours nécessaires</M1Crit>
      <M1Cell v="5" tone="coral" />
      <M1Cell v="2" tone="yellow" cls={b.on(1)} />
      <M1Cell v="0" tone="green" cls={b.on(2)} />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1360, top: 262, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="flask" title="Votre grille" size={22}>
        Des critères binaires ou comptables, décidés <em>avant</em> de lancer les essais.
      </Card>
      <Card tone="navy" icon="loop" title="Itérer" size={22}>
        Changez un seul composant du prompt à la fois, sinon vous ne saurez pas ce qui a aidé.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, fontSize: 21, color: C.muted, ...dl(600) }}>
      Exemple de mesure sur overlaps() · chiffres illustratifs : vous produirez les vôtres au TP 1.
    </div>
  </Frame>
);

// ─── Les leviers du chat ────────────────────────────────────────────────────
const M1Lever = ({ sym, tone, title, children, d }: { sym: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', gap: 22, ...dl(d) }}>
    <div style={{ flex: 'none', width: 84, height: 84, borderRadius: 18, background: STRONG[tone], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 44 }}>
      {sym}
    </div>
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.5, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1Mono = ({ children }: { children: ReactNode }) => <span style={{ fontFamily: mono, fontSize: 21, color: C.navy }}>{children}</span>;

const M1_Levers: Page = () => (
  <Frame mod={1}>
    <Title>Les leviers du chat : #, @, / et le modèle</Title>
    <Lede>Quatre réflexes qui distinguent l’utilisateur avancé : il choisit ce que le modèle lit et qui répond.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      <M1Lever sym="#" tone="blue" title="Références : ce que le modèle lit" d={100}>
        <M1Mono>#file #selection #codebase #changes #problems #fetch</M1Mono>
        <br />
        Peu de fichiers, bien choisis, plutôt que tout le dépôt.
      </M1Lever>
      <M1Lever sym="@" tone="violet" title="Participants : qui répond" d={200}>
        <M1Mono>@vscode @terminal @github</M1Mono>
        <br />
        Un expert du domaine concerné, avec ses propres outils.
      </M1Lever>
      <M1Lever sym="/" tone="teal" title="Commandes : intentions prêtes" d={300}>
        <M1Mono>/explain /fix /tests /doc /new /compact</M1Mono>
        <br />
        Et vos propres prompts d’équipe, en /nom (module 6).
      </M1Lever>
      <M1Lever sym="⚙" tone="pink" title="Modèle : le bon moteur" d={400}>
        Rapide pour l’inline et le répétitif, raisonnement pour un plan ou une architecture.
        <br />
        Chaque modèle a son coût en requêtes premium.
      </M1Lever>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
      <Callout title="Limite à connaître" tone="yellow" icon="alert" size={24}>
        Les noms de variables, de participants et de modèles évoluent vite : vérifiez la doc de votre version de VS Code.
      </Callout>
    </div>
  </Frame>
);

// ─── Inline, Chat ou Agent (jeu de tri) ─────────────────────────────────────
const M1Zone = ({ x, icon, tone, title, sub, answer }: { x: number; icon: IconName; tone: Tone; title: string; sub: string; answer: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: 262, width: 540, height: 480, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: T[tone].fg }}>{title}</div>
        <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 24, right: 24, bottom: 18, fontSize: 19, lineHeight: 1.45, color: T[tone].fg }}>
      <strong>Corrigé · </strong>
      {answer}
    </div>
  </div>
);

const M1_ChatVsInline: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Inline, Chat ou Agent : à chaque besoin son outil</Title>
    <Lede>Glissez chaque situation dans la bonne colonne. Double-clic pour renvoyer une étiquette à sa place.</Lede>
    <M1Zone x={120} icon="code" tone="blue" title="Inline · NES" sub="Tab, suggestions de modification suivante" answer="boucle évidente, mapper répétitif, propager un renommage." />
    <M1Zone x={690} icon="chat" tone="violet" title="Chat · Ask, Ctrl+I" sub="comprendre, comparer, corriger sur place" answer="regex héritée, deux stratégies, erreur sous le curseur." />
    <M1Zone x={1260} icon="bot" tone="green" title="Plan puis Agent" sub="multi-fichiers, commandes, itérations" answer="endpoint + tests sur 5 fichiers, migrer 30 appels dépréciés." />
    <Drag x={120} y={780} w={405} tone="blue">Finir une boucle évidente</Drag>
    <Drag x={545} y={780} w={405} tone="grey">Endpoint + tests sur 5 fichiers</Drag>
    <Drag x={970} y={780} w={405} tone="grey">Comprendre une regex héritée</Drag>
    <Drag x={1395} y={780} w={405} tone="grey">Mapper DTO répétitif</Drag>
    <Drag x={120} y={860} w={405} tone="grey">Choisir entre deux stratégies</Drag>
    <Drag x={545} y={860} w={405} tone="grey">Migrer 30 appels dépréciés</Drag>
    <Drag x={970} y={860} w={405} tone="grey">Corriger l’erreur sous le curseur</Drag>
    <Drag x={1395} y={860} w={405} tone="grey">Propager un renommage</Drag>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Le bon levier"
    q="Les complétions inline ignorent votre convention de nommage. Quel levier est le plus efficace ?"
    explain="L’inline lit le fichier courant et les onglets voisins, pas les instructions personnalisées. Montrez-lui le bon exemple, au bon endroit."
  >
    <Opt why="Le chat n’influence pas les complétions inline, et répéter une règle à chaque prompt ne passe pas à l’échelle.">
      Répéter la convention dans chaque prompt du chat
    </Opt>
    <Opt why="Utile pour le chat et les agents, mais les instructions personnalisées ne sont pas prises en compte par les complétions inline.">
      L’inscrire dans .github/copilot-instructions.md
    </Opt>
    <Opt ok why="Exact : signature typée, commentaire structuré et fichier exemplaire ouvert dans un onglet voisin, c’est précisément ce que l’inline lit.">
      Ouvrir un fichier exemplaire à côté, écrire signature et commentaire dans le style voulu
    </Opt>
    <Opt why="Le modèle n’est pas le problème : sans exemple dans son contexte, n’importe quel modèle devinera.">
      Changer de modèle de complétion
    </Opt>
  </QcmPage>
);

// ─── TP 1 ───────────────────────────────────────────────────────────────────
const M1_TP: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Réécrire des prompts basiques et mesurer"
    defi="ameliorer"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>prompts/tp1-mesures.md</PathChip> grille V1 / V2
        <br />
        <PathChip>src/domain/overlap.*</PathChip> + tests
        <br />
        <PathChip>.github/prompts/overlap.prompt.md</PathChip>
      </>
    }
    objective={
      <>
        Prouver, chiffres à l’appui, qu’un prompt structuré produit un meilleur code qu’un prompt basique sur trois tâches de {PROJECT}.
      </>
    }
    crit={
      <>
        <CheckItem id="tp1-1" size={22}>Trois prompts réécrits avec les cinq composants</CheckItem>
        <CheckItem id="tp1-2" size={22}>Chaque version lancée 2 fois, en session neuve</CheckItem>
        <CheckItem id="tp1-3" size={22}>Grille remplie : compile, tests, bornes, allers-retours</CheckItem>
        <CheckItem id="tp1-4" size={22}>Le meilleur prompt sauvegardé en .prompt.md</CheckItem>
      </>
    }
  >
    Les trois prompts de départ :
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: mono, fontSize: 21, color: C.ink }}>
      <span>P1 · « fais une fonction qui vérifie si deux réservations se chevauchent »</span>
      <span>P2 · « génère les modèles de données de l’appli »</span>
      <span>P3 · « écris la fonction qui trouve les salles libres »</span>
    </div>
    <TpBonus>Rétro-prompt : donnez la meilleure implémentation et demandez le prompt qui l’aurait produite du premier coup.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M1_Divider, M1_Context, M1_Anatomy, M1_MultiStep, M1_DocComments, M1_Compare, M1_Levers, M1_ChatVsInline, M1_Qcm, M1_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M1 · 9:20

OBJECTIF — Annoncer le module 1 du programme : techniques avancées de prompt engineering.

DIRE — « Module 1 : le prompt engineering avancé. On commence par un rappel des bases — ce que Copilot voit réellement —, puis on structure les prompts, on les décompose en étapes, on utilise les commentaires structurés comme levier, et surtout on apprend à mesurer : comparer deux prompts autrement qu’à l’impression. On termine par le choix de l’outil — inline, chat ou agent — et le TP 1. »

TRANSITION — « Point de départ : qu’est-ce que Copilot voit quand il vous répond ? »`,
  `⏱ 5 min · CONTEXTE (2 temps)

OBJECTIF — Rappeler comment Copilot interprète le contexte, en distinguant inline et chat.

DIRE — « La complétion inline est un mécanisme rapide : le modèle reçoit ce qui précède votre curseur et ce qui suit — c’est le fill-in-the-middle —, plus des extraits des onglets ouverts et des fichiers voisins pertinents. Remarquez le commentaire au-dessus de la fonction : il fait partie du préfixe, donc il guide la suggestion. Point important pour des utilisateurs avancés : vos instructions personnalisées ne sont pas lues par l’inline. » → clic. « Le chat et l’agent, c’est une fenêtre de contexte beaucoup plus large, composée de couches : le prompt système et les outils, vos instructions de dépôt, vos références explicites, l’historique de session — erreurs comprises —, les résultats d’outils, et enfin votre message, souvent la plus petite part. » → clic. « Conséquence pratique : deux leviers différents selon l’outil. »

ANIMATION — Démo possible : ouvrir un fichier types dans un onglet voisin et montrer que la complétion change.

TRANSITION — « Puisque le message compte, structurons-le. »`,
  `⏱ 5 min · STRUCTURER UN PROMPT (démo interactive)

OBJECTIF — Montrer l’effet de chaque composant : contexte, tâche bornée, contraintes, exemples attendus, critère de fin.

DIRE — « Voici le prompt que tout le monde écrit : fais une fonction qui vérifie si deux réservations se chevauchent. » Activer Contexte. « On dit où sont les types. » Tâche bornée. « On dit quoi, et seulement quoi. » Contraintes. « Voici la décision que Copilot prenait au hasard : les bornes. 10h–11h et 11h–12h, chevauchement ou pas ? C’est une règle métier, pas une évidence. » Exemples. « Les exemples attendus sont la contrainte la plus forte : ils deviennent les tests. » Critère de fin. « Et on dit quand c’est fini. Regardez la jauge. »

ANIMATION — Cliquer les toggles un à un. Demander au groupe lequel ils oublient le plus souvent : en général les exemples et le critère de fin.

TRANSITION — « Pour une tâche plus grosse, un seul prompt ne suffit plus : on décompose. »`,
  `⏱ 4 min · MULTI-ÉTAPES (4 temps)

OBJECTIF — Décomposer une tâche complexe en instructions claires et vérifiables.

DIRE — « Étape 1 : clarifier. On demande à Copilot de nous interroger avant d’écrire : c’est la technique la plus sous-utilisée. » → clic. « Étape 2 : planifier, en lots de un à trois fichiers, chacun avec le test qui le valide. Pas de code. » → clic. « Étape 3 : exécuter un seul lot, et s’arrêter quand ses tests passent. » → clic. « Étape 4 : faire relire le diff par Copilot lui-même avant le lot suivant : il trouve souvent ses propres oublis. » → clic. « La règle : pas d’étape suivante sans preuve. Et quand la session devient longue et confuse, on repart d’une session neuve avec le plan validé : l’historique pollué est un contexte comme un autre. »

TRANSITION — « Pour l’inline, le meilleur prompt multi-étapes, c’est un commentaire bien écrit. »`,
  `⏱ 4 min · COMMENTAIRES STRUCTURÉS (démo, onglets)

OBJECTIF — Utiliser JSDoc, docstring, Javadoc ou XML doc comme levier de qualité.

DIRE — « Quatre stacks, même idée. Le commentaire structuré fixe ce que la signature ne dit pas : la sémantique des bornes, le tri du résultat, l’exception attendue, et un exemple. Pour l’inline, c’est le préfixe parfait. Et contrairement à un message de chat, il reste dans le code : relu en revue, utile au prochain développeur. »

ANIMATION — Cliquer chaque onglet de langage selon les stacks du groupe. Démo possible : écrire le commentaire, puis laisser l’inline proposer le corps.

TRANSITION — « Comment savoir si un prompt est meilleur qu’un autre ? En mesurant. »`,
  `⏱ 4 min · COMPARER DES PROMPTS (3 temps)

OBJECTIF — Comparer des prompts par des mesures, et itérer méthodiquement.

DIRE — « Copilot n’est pas déterministe : un essai ne prouve rien. Protocole : même tâche, même modèle, session neuve, trois essais par version. V1, le prompt basique : il compile une fois sur trois, les bornes sont fausses. » → clic. « V2 ajoute contexte et contraintes : nettement mieux. » → clic. « V3 ajoute exemples et critère de fin : zéro aller-retour. » → clic. « Votre grille doit être décidée avant les essais, avec des critères binaires ou comptables. Et pour itérer : un seul changement à la fois. Les chiffres affichés sont illustratifs : vous produirez les vôtres au TP 1. »

TRANSITION — « Avant le TP, les leviers du chat que vous devez avoir sous les doigts. »`,
  `⏱ 3 min · LEVIERS DU CHAT

OBJECTIF — Rappeler les références, participants, commandes et le choix du modèle.

DIRE — « Le dièse : ce que le modèle lit. Peu de fichiers bien choisis valent mieux que tout le dépôt. L’arobase : qui répond, par exemple @terminal pour une erreur de commande. La barre oblique : des intentions prêtes, /tests, /fix, /explain, /compact pour résumer une session longue — et cet après-midi, vos propres commandes d’équipe. Enfin le modèle : un modèle rapide pour le répétitif, un modèle de raisonnement pour un plan ou une architecture ; tous n’ont pas le même coût en requêtes premium. »

ANIMATION — Insister sur la limite : l’outil évolue chaque mois.

TRANSITION — « Dernier choix : quel outil pour quel besoin ? Petit jeu. »`,
  `⏱ 5 min · INLINE / CHAT / AGENT (jeu de tri, 1 temps)

OBJECTIF — Choisir entre suggestions inline et Copilot Chat selon le cas d’usage.

DIRE — « Huit situations, trois colonnes. Venez glisser les étiquettes, ou dictez-moi. » Laisser débattre. → clic pour le corrigé. « Le critère : la portée et le besoin de vérification. Une ligne évidente, c’est l’inline ou les suggestions de modification suivante. Comprendre ou comparer, c’est le chat. Plusieurs fichiers, des commandes, des tests à faire passer : plan puis agent. »

ANIMATION — Drag & drop sur l’écran partagé. Double-clic remet une étiquette à sa place.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 2 min · QCM 1

OBJECTIF — Vérifier la compréhension du contexte inline.

DIRE — « Le piège attendu, c’est la B : les instructions personnalisées sont précieuses, mais pour le chat et les agents. L’inline, lui, lit le fichier et les onglets voisins. »

ANIMATION — Faire voter, cliquer la réponse choisie, puis → pour la bonne réponse et → pour l’essentiel.

TRANSITION — « À vous : TP 1. »`,
  `⏱ 25 min (minuteur) · TP 1

OBJECTIF — Atelier du programme : réécrire des prompts basiques en prompts avancés et mesurer l’impact sur la qualité du code généré.

DIRE — « Trois prompts basiques. Pour chacun : lancez-le tel quel deux fois en session neuve, notez la grille. Réécrivez-le avec les cinq composants, relancez deux fois, notez. Gardez le code du meilleur résultat pour overlaps : c’est la première brique de SalleLibre. Et sauvegardez votre meilleur prompt dans .github/prompts : on le partagera au module 6. »

ANIMATION — Lancer le minuteur. Passer dans les binômes : vérifier que la grille est décidée avant les essais. À 20 minutes, demander à deux binômes leurs chiffres V1/V2.

TRANSITION — « Vous avez une fonction et une méthode. Passons à l’échelle d’un module entier. »`,
];
// @@NOTES-END
