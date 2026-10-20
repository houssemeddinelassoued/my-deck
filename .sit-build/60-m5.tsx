// ─── Module 5 · Retours d'intersession ──────────────────────────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Retours
        <br />
        d’intersession
      </>
    }
    sub="Vos cas réels sont la meilleure matière de la formation : on les écoute, on mesure le temps gagné, on en tire les règles de l’équipe."
    dur="9:15 – 10:30"
    labs={
      <Tag tone="green" size={19}>
        Atelier 5 · vos cas, trois minutes chacun
      </Tag>
    }
  >
    <SecItem n={1}>Trois minutes par cas : tâche, prompt, résultat, gain</SecItem>
    <SecItem n={2}>Le compteur de temps gagné de l’équipe</SecItem>
    <SecItem n={3}>La matrice valeur-effort</SecItem>
    <SecItem n={4}>Ce qui marche, et les pièges</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Format de restitution ──────────────────────────────────────────────────
const M5Box = ({ n, tone, icon, title, q }: { n: number; tone: Tone; icon: IconName; title: string; q: string }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(n * 100) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</span>
    </div>
    <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{q}</div>
  </div>
);

const M5_Format: Page = () => (
  <Frame mod={5} kind="atelier">
    <Title>Trois minutes chacun, quatre cases</Title>
    <Lede>Le groupe écoute avec une question en tête : « Est-ce que je pourrais réutiliser ce cas chez moi ? »</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1100, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M5Box n={1} tone="blue" icon="target" title="La tâche" q="Laquelle, à quelle fréquence, combien de temps à la main ?" />
      <M5Box n={2} tone="violet" icon="chat" title="Le prompt" q="Le prompt final, l’outil, le nombre de relances." />
      <M5Box n={3} tone="teal" icon="doc" title="Le résultat" q="Ce qui était bon, ce qu’il a fallu corriger." />
      <M5Box n={4} tone="green" icon="clock" title="Le temps gagné" q="Minutes avant, minutes après, par occurrence." />
    </div>
    <div style={{ position: 'absolute', left: 1270, top: 270, width: 530, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Timer id="m5-pitch" minutes={3} label="Présentation" cls={A.right} style={{ width: 530, ...dl(300) }} />
      <Callout title="Pas de cas ?" tone="yellow" icon="bulb" size={22} cls={A.right} style={dl(450)}>
        Racontez une tâche que vous auriez aimé confier à l’IA, et pourquoi vous ne l’avez pas fait.
      </Callout>
    </div>
  </Frame>
);

// ─── Compteur de temps gagné ────────────────────────────────────────────────
const M5Row = ({ i, m, f, setM, setF }: { i: number; m: number; f: number; setM: (v: number) => void; setF: (v: number) => void }) => {
  const h = (m * f) / 60;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 1fr 170px', alignItems: 'center', gap: 26, padding: '10px 0', borderBottom: `1.5px solid ${C.rule}` }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 23, color: C.navy }}>Cas {i}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Range value={m} onChange={setM} min={0} max={120} step={5} w={330} tone="violet" />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.violet, width: 90 }}>{m} min</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Range value={f} onChange={setF} min={0} max={40} w={330} tone="teal" />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.teal, width: 90 }}>{f} ×</span>
      </div>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.green, textAlign: 'right' }}>{fr(h, 1)} h</span>
    </div>
  );
};

const M5_Gains: Page = () => {
  const [mins, setMins] = useState([20, 15, 30, 10, 45]);
  const [freq, setFreq] = useState([8, 20, 4, 30, 2]);
  const set = (arr: number[], f: (x: number[]) => void, i: number) => (v: number) => f(arr.map((x, j) => (j === i ? v : x)));
  const total = mins.reduce((a, m, i) => a + (m * freq[i]) / 60, 0);
  return (
    <Frame mod={5} kind="atelier">
      <Title>Le compteur de temps gagné de l’équipe</Title>
      <Lede>Pour chaque cas présenté : minutes gagnées par occurrence, et nombre d’occurrences par mois.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '16px 34px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 1fr 170px', gap: 26, paddingBottom: 6, fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', color: C.muted }}>
          <span />
          <span>MINUTES GAGNÉES PAR FOIS</span>
          <span>FOIS PAR MOIS</span>
          <span style={{ textAlign: 'right' }}>PAR MOIS</span>
        </div>
        <M5Row i={1} m={mins[0]} f={freq[0]} setM={set(mins, setMins, 0)} setF={set(freq, setFreq, 0)} />
        <M5Row i={2} m={mins[1]} f={freq[1]} setM={set(mins, setMins, 1)} setF={set(freq, setFreq, 1)} />
        <M5Row i={3} m={mins[2]} f={freq[2]} setM={set(mins, setMins, 2)} setF={set(freq, setFreq, 2)} />
        <M5Row i={4} m={mins[3]} f={freq[3]} setM={set(mins, setMins, 3)} setF={set(freq, setFreq, 3)} />
        <M5Row i={5} m={mins[4]} f={freq[4]} setM={set(mins, setMins, 4)} setF={set(freq, setFreq, 4)} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 790, width: 1680, display: 'flex', gap: 24, ...dl(300) }}>
        <div style={{ flex: 1, background: G.navy, borderRadius: 20, padding: '20px 30px', color: '#fff', display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 72 }}>{fr(total, 1)} h</span>
          <span style={{ fontSize: 25, color: '#C7CFEA' }}>gagnées par mois, pour cinq cas seulement</span>
        </div>
        <div style={{ flex: 1, background: T.green.bg, borderRadius: 20, boxShadow: `inset 0 0 0 2px ${T.green.bd}`, padding: '20px 30px', display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 72, color: T.green.fg }}>{fr(total * 11, 0)} h</span>
          <span style={{ fontSize: 25, color: C.soft }}>sur une année de onze mois travaillés</span>
        </div>
      </div>
    </Frame>
  );
};

// ─── Matrice valeur-effort ──────────────────────────────────────────────────
const M5Quad = ({ x, y, tone, title, sub }: { x: number; y: number; tone: Tone; title: string; sub: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 640, height: 300, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 18, color: C.soft }}>{sub}</div>
  </div>
);

const M5_Matrice: Page = () => (
  <Frame mod={5} kind="atelier">
    <Title>Où placer chaque cas ? La matrice valeur-effort</Title>
    <Lede>Glissez les cas présentés et les exemples ci-dessous. On discute chaque placement.</Lede>
    <div style={{ position: 'absolute', left: 150, top: 262, width: 40, height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: C.muted }}>VALEUR →</span>
    </div>
    <M5Quad x={200} y={262} tone="green" title="Gains rapides" sub="forte valeur, peu d’effort : on commence par là" />
    <M5Quad x={860} y={262} tone="blue" title="Projets" sub="forte valeur, effort important : on planifie" />
    <M5Quad x={200} y={582} tone="grey" title="Bonus" sub="faible valeur, peu d’effort : si on a le temps" />
    <M5Quad x={860} y={582} tone="coral" title="À éviter" sub="faible valeur, effort important" />
    <div style={{ position: 'absolute', left: 200, top: 895, width: 1300, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: C.muted }}>EFFORT →</div>
    <Drag x={1530} y={262} w={270} tone="violet" size={20}>
      Réponses types
    </Drag>
    <Drag x={1530} y={322} w={270} tone="violet" size={20}>
      Articles KB
    </Drag>
    <Drag x={1530} y={382} w={270} tone="violet" size={20}>
      Synthèse de rapports
    </Drag>
    <Drag x={1530} y={442} w={270} tone="violet" size={20}>
      Reporting mensuel
    </Drag>
    <Drag x={1530} y={502} w={270} tone="violet" size={20}>
      Agent support N1
    </Drag>
    <Drag x={1530} y={562} w={270} tone="violet" size={20}>
      Analyse de journaux
    </Drag>
    <Drag x={1530} y={622} w={270} tone="yellow" size={20}>
      Cas 1
    </Drag>
    <Drag x={1530} y={682} w={270} tone="yellow" size={20}>
      Cas 2
    </Drag>
    <Drag x={1530} y={742} w={270} tone="yellow" size={20}>
      Cas 3
    </Drag>
    <Drag x={1530} y={802} w={270} tone="yellow" size={20}>
      Cas 4
    </Drag>
    <Drag x={1530} y={862} w={270} tone="yellow" size={20}>
      Cas 5
    </Drag>
  </Frame>
);

// ─── Ce qui marche, les pièges ──────────────────────────────────────────────
const M5Item = ({ tone, icon, children, beat }: { tone: Tone; icon: IconName; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${STRONG[tone]}`, padding: '14px 20px' }}>
    <Icon name={icon} size={28} color={T[tone].fg} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M5_Pratiques: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Ce qui marche, et les pièges : les règles du groupe</Title>
    <Lede>Ce qu’on entend presque toujours au retour d’intersession. Complétez avec ce que vous venez de dire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 815, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Tag tone="green" size={22} cls={A.in} style={{ alignSelf: 'flex-start' }}>
        <Icon name="check" size={22} /> Ce qui marche
      </Tag>
      <M5Item beat={1} tone="green" icon="doc">
        Joindre le fichier plutôt que le décrire
      </M5Item>
      <M5Item beat={1} tone="green" icon="target">
        Montrer un exemple du résultat attendu
      </M5Item>
      <M5Item beat={2} tone="green" icon="loop">
        Relancer deux fois avant de réécrire
      </M5Item>
      <M5Item beat={2} tone="green" icon="note">
        Garder le prompt qui a marché, tout de suite
      </M5Item>
    </div>
    <div style={{ position: 'absolute', left: 985, top: 262, width: 815, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Tag tone="coral" size={22} cls={A.in} style={{ alignSelf: 'flex-start', ...dl(150) }}>
        <Icon name="alert" size={22} /> Les pièges
      </Tag>
      <M5Item beat={3} tone="coral" icon="search">
        Un chiffre non vérifié, découvert par le lecteur
      </M5Item>
      <M5Item beat={3} tone="coral" icon="clock">
        Vingt relances au lieu de reprendre le prompt
      </M5Item>
      <M5Item beat={4} tone="coral" icon="lock">
        Une donnée sensible collée « juste pour tester »
      </M5Item>
      <M5Item beat={4} tone="coral" icon="eyeOff">
        Un résultat envoyé sans relecture
      </M5Item>
    </div>
    <div className={b.fade(4)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout title="Notre règle d’équipe" tone="blue" icon="users" size={24}>
        À écrire ensemble, en une phrase. Exemple : « Tout texte produit par l’IA est relu par son auteur avant envoi, et tout chiffre est vérifié. »
      </Callout>
    </div>
  </Frame>
);

const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Ce qu’on retient du module 5</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="yellow" d={100}>
        Un cas se raconte en <strong>quatre cases</strong> : tâche, prompt, résultat, gain.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        Le gain se mesure : <strong>minutes × fréquence</strong>, pas à l’impression.
      </SynthRow>
      <SynthRow n={3} tone="blue" d={300}>
        On commence par les <strong>gains rapides</strong> : forte valeur, peu d’effort.
      </SynthRow>
      <SynthRow n={4} tone="coral" d={400}>
        Les pièges sont toujours les mêmes : <strong>chiffres, relances, données, relecture</strong>.
      </SynthRow>
    </div>
    <PosteCard title="Pour l’équipe">
      Tenez le compteur de temps gagné un mois. C’est l’argument le plus solide pour obtenir des licences ou du temps pour automatiser.
    </PosteCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Format, M5_Gains, M5_Matrice, M5_Pratiques, M5_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M5 · 9:15

OBJECTIF — Lancer la restitution des missions d’intersession.

DIRE — « Vos cas réels valent plus que tous mes exemples. On va les écouter, mesurer le temps gagné, les placer dans une matrice, et en tirer les règles de l’équipe. »

ANIMATION — Si les deux jours sont consécutifs, donner d’abord 20 minutes pour réaliser la mission, puis enchaîner.

TRANSITION — « Le format : trois minutes, quatre cases. »`,
  `⏱ 25 min · TROIS MINUTES CHACUN (minuteur)

OBJECTIF — Faire présenter chaque cas de façon structurée.

DIRE — « Trois minutes chacun, quatre cases : la tâche, le prompt, le résultat, le temps gagné. Le groupe écoute avec une question : est-ce que je pourrais réutiliser ce cas chez moi ? »

ANIMATION — Relancer le minuteur pour chaque personne (bouton de réinitialisation). Noter au tableau, pour chaque cas, les minutes gagnées et la fréquence : elles servent à la page suivante.

RÉPONSES TYPES — Cas fréquents chez les profils support et infrastructure : réponse à un utilisateur difficile, synthèse d’un rapport d’exploitation, préparation d’un point hebdomadaire, tableau Excel de suivi commenté, procédure rafraîchie.

TRANSITION — « Faisons les comptes. »`,
  `⏱ 6 min · COMPTEUR DE TEMPS GAGNÉ (interactif)

OBJECTIF — Rendre visible le gain cumulé, de façon honnête.

DIRE — « Pour chaque cas : les minutes gagnées à chaque fois, et combien de fois par mois. » Régler les curseurs avec les chiffres notés. « Regardez le total, puis le total sur une année. Ce chiffre, c’est votre argument pour obtenir des licences ou du temps pour automatiser. »

INSISTER — Rester honnête : un gain surestimé décrédibilise tout le reste. Les valeurs par défaut sont fictives, à remplacer.

TRANSITION — « Tous ces cas ne se valent pas. Plaçons-les. »`,
  `⏱ 10 min · MATRICE VALEUR-EFFORT (glisser-déposer)

OBJECTIF — Prioriser les cas du groupe et les exemples du fil rouge.

DIRE — « En haut à gauche, les gains rapides : forte valeur, peu d’effort. C’est par là qu’on commence lundi. En haut à droite, les projets. En bas à droite, ce qu’on évite. » Glisser chaque étiquette en demandant l’avis de la salle.

RÉPONSES TYPES — Réponses types et articles KB : gains rapides. Reporting mensuel : gain rapide si l’export est propre, sinon projet. Agent N1 : projet. Analyse de journaux : débat (valeur forte, mais anonymisation coûteuse).

TRANSITION — « Ce qui marche et les pièges. »`,
  `⏱ 8 min · CE QUI MARCHE, LES PIÈGES (4 clics)

OBJECTIF — Produire une synthèse collective et une règle d’équipe.

DIRE — → beat 1 et → beat 2 : « Ce qui marche : joindre le fichier, montrer un exemple, relancer deux fois avant de réécrire, garder le prompt qui a marché. » → beat 3 et → beat 4 : « Les pièges : le chiffre non vérifié, les vingt relances, la donnée sensible “juste pour tester”, le résultat envoyé sans relecture. » « Et maintenant, écrivons ensemble votre règle d’équipe, en une phrase. »

ANIMATION — Compléter oralement avec ce que les participants ont dit pendant leurs présentations.

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M5 · 10:30

OBJECTIF — Ancrer les quatre idées du module.

DIRE — « Quatre cases pour raconter un cas. Un gain qui se mesure. Les gains rapides d’abord. Et des pièges qu’on connaît maintenant. »

TRANSITION — « Pause ! Au retour, le module 6 : analyser des données et des incidents. »`,
];
// @@NOTES-END
