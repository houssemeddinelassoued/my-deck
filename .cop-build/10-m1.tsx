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
    dur="9:15 – 10:10 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 1 · réécrire et mesurer</Tag>}
  >
    <SecItem n={1}>Comment Copilot interprète le contexte</SecItem>
    <SecItem n={2}>Session, harnais, rôle, modèle</SecItem>
    <SecItem n={3}>Contexte, contraintes, exemples attendus</SecItem>
    <SecItem n={4}>Prompts multi-étapes et commentaires structurés</SecItem>
    <SecItem n={5}>Comparer, mesurer, itérer</SecItem>
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
        <M1Seg icon="terminal" tone="teal" title="Résultats d’outils" sub="recherche, terminal, tests (rôle Agent)" beat={1} />
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
        <CodeDark file="Prompt (Chat · rôle Agent)" size={23} wrap style={{ minHeight: 480 }}>
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
        Et vos propres skills d’équipe, en /nom (module 2).
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

// ─── Session, harnais, rôle, modèle (repris de copilot-debutant-v2, p. 41) ──
const M1Layer = ({ tone, label, ex, children, d }: { tone: Tone; label: string; ex: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: 20, alignItems: 'center', background: T[tone].bg, borderRadius: 16, padding: '16px 22px', boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{label}</div>
    <div>
      <div style={{ fontSize: 22, color: C.ink, lineHeight: 1.35 }}>{children}</div>
      <div style={{ marginTop: 4, fontFamily: mono, fontSize: 18, color: T[tone].fg }}>{ex}</div>
    </div>
  </div>
);

const M1Drop = ({ label, value, tone }: { label: string; value: string; tone: Tone }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E98BC' }}>{label}</span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#232B5A', borderRadius: 8, padding: '6px 12px', fontSize: 19, color: '#fff', boxShadow: `inset 0 0 0 1.5px ${STRONG[tone]}` }}>
      {value} <span style={{ color: '#8E98BC' }}>▾</span>
    </span>
  </div>
);

const M1_Session: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Session, harnais, rôle, modèle : quatre réglages différents</Title>
    <Lede>On les confond souvent. Dans la zone de saisie du Chat, ce sont quatre listes distinctes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1040, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Layer tone="navy" label="Session · harnais" ex="Copilot · Local · Claude · Codex · Cloud" d={100}>
        <strong>Qui fait tourner</strong> la boucle de l’agent : outils, contexte, permissions.
      </M1Layer>
      <M1Layer tone="violet" label="Rôle" ex="Ask · Plan · Agent · vos agents" d={200}>
        <strong>Ce qu’on lui demande d’être</strong> : répondre, planifier, agir, ou un rôle que vous écrivez.
      </M1Layer>
      <M1Layer tone="blue" label="Modèle" ex="Auto · rapide · avancé" d={300}>
        <strong>Le cerveau</strong> qui prédit la suite. Il change la qualité et le coût, pas les droits.
      </M1Layer>
      <M1Layer tone="teal" label="Environnement" ex="votre poste · copie de travail · cloud" d={400}>
        <strong>Où s’exécutent</strong> les commandes et où vont les modifications.
      </M1Layer>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1220, top: 262, width: 580, background: '#0F1530', borderRadius: 18, padding: '22px 24px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(300) }}>
      <div style={{ fontSize: 19, color: '#AEB9E6', fontStyle: 'italic', marginBottom: 16 }}>Décris ce que tu veux faire…</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <M1Drop label="Session" value="Copilot" tone="navy" />
        <M1Drop label="Rôle" value="Agent" tone="violet" />
        <M1Drop label="Modèle" value="Auto" tone="blue" />
        <M1Drop label="Permissions" value="Manuelles" tone="coral" />
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1220, top: 560, width: 580 }}>
      <Callout tone="green" icon="checkCircle" title="Nos réglages pour la journée" size={23}>
        Session <strong>Copilot</strong>, permissions <strong>manuelles</strong>. Modèle <strong>fixé</strong> pendant les mesures du TP 1, Auto ensuite. Le rôle change selon le TP.
      </Callout>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(700) }}>
      Le harnais Copilot est le même dans VS Code, le CLI et l’app : vos instructions, skills et agents vous suivent partout.
    </Hint>
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
    who="Individuel"
    minutes={20}
    feats={
      <Tag tone="navy" size={19}>
        <Icon name="cpu" size={20} /> Session Copilot · modèle fixé
      </Tag>
    }
    where={
      <>
        <PathChip>prompts/tp1-mesures.md</PathChip> grille V1 / V2
        <br />
        <PathChip>src/domain/overlap.*</PathChip> + tests
        <br />
        <PathChip>prompts/meilleur-prompt.md</PathChip> → skill au TP 2
      </>
    }
    objective={
      <>
        Prouver, chiffres à l’appui, qu’un prompt structuré produit un meilleur code qu’un prompt basique sur trois tâches de {PROJECT}.
      </>
    }
    crit={
      <>
        <CheckItem id="tp1-1" size={22}>Session Copilot, rôle Agent, un seul modèle pour toutes les mesures</CheckItem>
        <CheckItem id="tp1-2" size={22}>Trois prompts réécrits avec les cinq composants</CheckItem>
        <CheckItem id="tp1-3" size={22}>Chaque version lancée 2 fois en session neuve, grille remplie</CheckItem>
        <CheckItem id="tp1-4" size={22}>Le meilleur prompt conservé pour le TP 2</CheckItem>
      </>
    }
  >
    Les trois prompts de départ :
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: mono, fontSize: 21, color: C.ink }}>
      <span>P1 · « fais une fonction qui vérifie si deux réservations se chevauchent »</span>
      <span>P2 · « génère les modèles de données de l’appli »</span>
      <span>P3 · « écris la fonction qui trouve les salles libres »</span>
    </div>
    <TpBonus>Relancez votre meilleur prompt avec un autre modèle : la grille bouge-t-elle plus d’un modèle à l’autre que d’un prompt à l’autre ?</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M1_Divider, M1_Context, M1_Session, M1_Anatomy, M1_MultiStep, M1_DocComments, M1_Compare, M1_Levers, M1_Qcm, M1_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M1 · 9:15

OBJECTIF — Annoncer le module 1 du programme : techniques avancées de prompt engineering.

DIRE — « Module 1 : le prompt engineering avancé. Vous connaissez les bases, on ne s’y attarde pas. On repart de ce que Copilot voit réellement, on distingue les quatre réglages d’une session — harnais, rôle, modèle, environnement —, puis on structure les prompts, on les décompose en étapes, et surtout on apprend à mesurer : comparer deux prompts autrement qu’à l’impression. Puis le TP 1. »

TRANSITION — « Point de départ : qu’est-ce que Copilot voit quand il vous répond ? »`,
  `⏱ 5 min · CONTEXTE (2 temps)

OBJECTIF — Rappeler comment Copilot interprète le contexte, en distinguant inline et chat.

DIRE — « La complétion inline est un mécanisme rapide : le modèle reçoit ce qui précède votre curseur et ce qui suit — c’est le fill-in-the-middle —, plus des extraits des onglets ouverts et des fichiers voisins pertinents. Remarquez le commentaire au-dessus de la fonction : il fait partie du préfixe, donc il guide la suggestion. Point important pour des utilisateurs avancés : vos instructions personnalisées ne sont pas lues par l’inline. »
→ beat 1 « Le chat et l’agent, c’est une fenêtre de contexte beaucoup plus large, composée de couches : le prompt système et les outils, vos instructions de dépôt, vos références explicites, l’historique de session — erreurs comprises —, les résultats d’outils, et enfin votre message, souvent la plus petite part. »
→ beat 2 « Conséquence pratique : deux leviers différents selon l’outil. »

ANIMATION — Démo possible : ouvrir un fichier types dans un onglet voisin et montrer que la complétion change.

TRANSITION — « Cette fenêtre, qui la remplit ? Ça dépend de quatre réglages qu’on confond souvent. »`,
  `⏱ 4 min · SESSION, HARNAIS, RÔLE, MODÈLE (1 temps)

OBJECTIF — Distinguer les quatre réglages d’une session de Chat ; fixer les réglages de la journée.

DIRE — « Dans la zone de saisie du Chat, il y a désormais quatre listes. La session, ou harnais : qui fait tourner la boucle de l’agent. Depuis fin octobre, le harnais Copilot est le défaut ; l’ancien moteur de VS Code s’appelle Local, il est déprécié. Claude ou Codex sont d’autres harnais, branchés dans la même fenêtre. Le rôle : ce qu’on demande à l’agent d’être. Ask répond, Plan planifie sans toucher au code, Agent agit. Et cet après-midi, vos propres rôles : vos agents personnalisés. Le modèle : le cerveau. Il change la qualité et le coût, jamais les droits. Enfin l’environnement : où s’exécutent les commandes. »
→ beat 1 « Nos réglages pour la journée : session Copilot, permissions manuelles, on approuve chaque commande. Pendant les mesures du TP 1, on fixe le modèle : sinon on compare deux modèles, pas deux prompts. »

ANIMATION — Démo rapide : ouvrir les quatre listes dans VS Code, montrer le harnais Copilot sélectionné.

TRANSITION — « Les réglages sont posés. Reste le message lui-même : structurons-le. »`,
  `⏱ 5 min · STRUCTURER UN PROMPT (démo interactive)

OBJECTIF — Montrer l’effet de chaque composant : contexte, tâche bornée, contraintes, exemples attendus, critère de fin.

DIRE — « Voici le prompt que tout le monde écrit : fais une fonction qui vérifie si deux réservations se chevauchent. » Activer Contexte. « On dit où sont les types. » Tâche bornée. « On dit quoi, et seulement quoi. » Contraintes. « Voici la décision que Copilot prenait au hasard : les bornes. 10h–11h et 11h–12h, chevauchement ou pas ? C’est une règle métier, pas une évidence. » Exemples. « Les exemples attendus sont la contrainte la plus forte : ils deviennent les tests. » Critère de fin. « Et on dit quand c’est fini. Regardez la jauge. »

ANIMATION — Cliquer les toggles un à un. Demander à deux participants, par prénom, lequel ils oublient le plus souvent : en général les exemples et le critère de fin.

TRANSITION — « Pour une tâche plus grosse, un seul prompt ne suffit plus : on décompose. »`,
  `⏱ 4 min · MULTI-ÉTAPES (4 temps)

OBJECTIF — Décomposer une tâche complexe en instructions claires et vérifiables.

DIRE — « Étape 1 : clarifier. On demande à Copilot de nous interroger avant d’écrire : c’est la technique la plus sous-utilisée. »
→ beat 1 « Étape 2 : planifier, en lots de un à trois fichiers, chacun avec le test qui le valide. Pas de code : c’est le rôle Plan. »
→ beat 2 « Étape 3 : exécuter un seul lot, et s’arrêter quand ses tests passent. »
→ beat 3 « Étape 4 : faire relire le diff par Copilot lui-même avant le lot suivant : il trouve souvent ses propres oublis. »
→ beat 4 « La règle : pas d’étape suivante sans preuve. Et quand la session devient longue et confuse, on repart d’une session neuve avec le plan validé : l’historique pollué est un contexte comme un autre. »

TRANSITION — « Pour l’inline, le meilleur prompt multi-étapes, c’est un commentaire bien écrit. »`,
  `⏱ 4 min · COMMENTAIRES STRUCTURÉS (démo, onglets)

OBJECTIF — Utiliser JSDoc, docstring, Javadoc ou XML doc comme levier de qualité.

DIRE — « Quatre stacks, même idée. Le commentaire structuré fixe ce que la signature ne dit pas : la sémantique des bornes, le tri du résultat, l’exception attendue, et un exemple. Pour l’inline, c’est le préfixe parfait. Et contrairement à un message de chat, il reste dans le code : relu en revue, utile au prochain développeur. »

ANIMATION — Cliquer chaque onglet de langage selon les stacks du groupe. Démo possible : écrire le commentaire, puis laisser l’inline proposer le corps.

TRANSITION — « Comment savoir si un prompt est meilleur qu’un autre ? En mesurant. »`,
  `⏱ 4 min · COMPARER DES PROMPTS (3 temps)

OBJECTIF — Comparer des prompts par des mesures, et itérer méthodiquement.

DIRE — « Copilot n’est pas déterministe : un essai ne prouve rien. Protocole : même tâche, même modèle, session neuve, plusieurs essais par version. V1, le prompt basique : il compile une fois sur trois, les bornes sont fausses. »
→ beat 1 « V2 ajoute contexte et contraintes : nettement mieux. »
→ beat 2 « V3 ajoute exemples et critère de fin : zéro aller-retour. »
→ beat 3 « Votre grille doit être décidée avant les essais, avec des critères binaires ou comptables. Et pour itérer : un seul changement à la fois. Les chiffres affichés sont illustratifs : vous produirez les vôtres au TP 1. »

TRANSITION — « Avant le TP, les leviers du chat que vous devez avoir sous les doigts. »`,
  `⏱ 3 min · LEVIERS DU CHAT

OBJECTIF — Rappeler les références, participants, commandes et le choix du modèle.

DIRE — « Vous les connaissez, on va vite. Le dièse : ce que le modèle lit. Peu de fichiers bien choisis valent mieux que tout le dépôt. L’arobase : qui répond. La barre oblique : des intentions prêtes, /tests, /fix, /compact pour résumer une session longue — et dès le module 2, vos propres skills d’équipe, appelées par /nom. Enfin le modèle : un modèle rapide pour le répétitif, un modèle de raisonnement pour un plan ou une architecture ; tous n’ont pas le même coût. »

ANIMATION — Insister sur la limite : l’outil évolue chaque mois.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 2 min · QCM 1

OBJECTIF — Vérifier la compréhension du contexte inline.

DIRE — « Le piège attendu, c’est la B : les instructions personnalisées sont précieuses, mais pour le chat et les agents. L’inline, lui, lit le fichier et les onglets voisins. »

ANIMATION — Faire voter à voix haute, cliquer la réponse majoritaire, puis → pour la bonne réponse et → pour l’essentiel.

TRANSITION — « À vous : TP 1. »`,
  `⏱ 20 min (minuteur) · TP 1

OBJECTIF — Atelier du programme : réécrire des prompts basiques en prompts avancés et mesurer l’impact sur la qualité du code généré.

DIRE — « TP individuel. Réglages : session Copilot, rôle Agent, et un seul modèle choisi dans la liste pour toutes vos mesures, pas Auto : sinon vous mesurez le modèle, pas le prompt. Trois prompts basiques. Pour chacun : lancez-le tel quel deux fois en session neuve, notez la grille. Réécrivez-le avec les cinq composants, relancez deux fois, notez. Gardez le code du meilleur résultat pour overlaps : c’est la première brique de SalleLibre. Et conservez votre meilleur prompt dans prompts/meilleur-prompt.md : au TP 2, il deviendra une skill. »

ANIMATION — Coller les trois prompts de départ dans le Chat. Lancer le minuteur. Point d’étape à 10 minutes : « Où en êtes-vous : P1, P2 ou P3 ? » Quelqu’un bloqué partage son écran 2 minutes. À 18 minutes, demander à deux volontaires leurs chiffres V1/V2.

TRANSITION — « Vous avez une fonction et une méthode. Passons à l’échelle d’un module entier… et écrivons enfin les règles de la maison. »`,
];
// @@NOTES-END
