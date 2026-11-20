// ═══ Module 2 · Identifier les processus répétitifs ═════════════════════════

const M2_Section: Page = () => (
  <Section n={2} title="Identifier les processus répétitifs" sub="Avant d’automatiser, comprendre. Puis choisir la bonne tâche." dur="1 h 20" kind="exercice">
    <SecItem n={1}>Méthodes d’analyse : SIPOC et cartographie</SecItem>
    <SecItem n={2}>Exercices : analyser son propre quotidien</SecItem>
    <SecItem n={3}>Critères : fréquence, volume, règles, outils</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Don't automate the mess ────────────────────────────────────────────────
const M2Stage = ({ n, tone, icon, title, beat, children }: { n: number; tone: Tone; icon: IconName; title: string; beat: number; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={`${n} · ${title}`} size={25} cls={b.on(beat)} style={{ height: 300 }}>
    {children}
  </Card>
);

const M2_Desordre: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>On n’automatise pas le désordre</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1680, ...dl(100) }}>
      <Quote by="Principe attribué à Bill Gates, souvent cité en gestion des opérations">
        L’automatisation appliquée à une opération inefficace <Hl>amplifie l’inefficacité</Hl>.
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
      <M2Stage n={1} beat={1} tone="blue" icon="search" title="Comprendre">
        Qui fait quoi, avec quelles données, pour qui ? On décrit le processus <b>tel qu’il est</b>.
      </M2Stage>
      <M2Stage n={2} beat={2} tone="teal" icon="filter" title="Simplifier">
        On supprime les étapes inutiles, les doubles saisies, les validations qui ne servent à rien.
      </M2Stage>
      <M2Stage n={3} beat={3} tone="green" icon="bolt" title="Automatiser">
        Seulement alors on automatise ce qui reste : moins d’étapes, donc moins de pannes.
      </M2Stage>
    </div>
  </Frame>
);

// ─── SIPOC ──────────────────────────────────────────────────────────────────
const SIPOC: { l: string; w: string; tone: Tone; q: string; ex: string }[] = [
  { l: 'S', w: 'Suppliers · Fournisseurs', tone: 'blue', q: 'Qui fournit ce qui entre ?', ex: 'Employé, banque, client, logiciel' },
  { l: 'I', w: 'Inputs · Entrées', tone: 'teal', q: 'Qu’est-ce qui entre ?', ex: 'Formulaire, courriel, fichier, reçu' },
  { l: 'P', w: 'Process · Étapes', tone: 'green', q: 'Quelles grandes étapes ? (4 à 7)', ex: 'Recevoir, vérifier, saisir, approuver' },
  { l: 'O', w: 'Outputs · Sorties', tone: 'yellow', q: 'Qu’est-ce qui sort ?', ex: 'Paiement, rapport, réponse, mise à jour' },
  { l: 'C', w: 'Customers · Clients', tone: 'violet', q: 'Qui reçoit ce qui sort ?', ex: 'Employé, gestionnaire, client final' },
];

const M2_Sipoc: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Le SIPOC : un processus sur une seule page</Title>
    <Lede>Cinq colonnes, de gauche à droite. On reste à haut niveau : la vue d’ensemble, pas le détail.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
      {SIPOC.map((c, i) => (
        <div key={c.l} className={b.on(i + 1)} style={{ height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[c.tone]}`, padding: '26px 24px' }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 130, lineHeight: 1, color: c.tone === 'yellow' ? C.amber : STRONG[c.tone] }}>{c.l}</div>
          <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 26, lineHeight: 1.15, color: C.ink }}>{c.w}</div>
          <div style={{ marginTop: 18, fontSize: 25, fontWeight: 600, lineHeight: 1.35, color: T[c.tone].fg }}>{c.q}</div>
          <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.4, color: C.muted }}>Ex. : {c.ex}</div>
        </div>
      ))}
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 880 }}>Astuce : commencez par P (les étapes), puis O et C, puis I et S.</Hint>
  </Frame>
);

// ─── SIPOC example ──────────────────────────────────────────────────────────
const M2Cell = ({ items }: { items: string[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((t) => (
      <div key={t} style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 14px', fontSize: 22, lineHeight: 1.3, color: C.ink }}>
        {t}
      </div>
    ))}
  </div>
);

const M2_SipocEx: Page = () => {
  const cols: string[][] = [
    ['Employé', 'Carte de crédit d’entreprise', 'Gestionnaire'],
    ['Formulaire Excel', 'Reçus (photo ou PDF)', 'Politique de remboursement'],
    ['1. Remplir le formulaire', '2. Joindre les reçus', '3. Approuver', '4. Vérifier la conformité', '5. Saisir et payer'],
    ['Virement à l’employé', 'Écriture comptable', 'Dossier archivé'],
    ['Employé', 'Comptabilité', 'Vérificateur externe'],
  ];
  return (
    <Frame mod={2} beats={5} kind="cas">
      <Title>Exemple : les notes de frais</Title>
      <div style={{ position: 'absolute', left: 120, top: 186 }}>
        <CasTag>PME de services · 120 employés · 300 notes de frais par mois</CasTag>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
        {SIPOC.map((c, i) => (
          <div key={c.l} style={{ height: 620, boxSizing: 'border-box', background: T[c.tone].bg, borderRadius: 18, padding: '18px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 54, lineHeight: 1, color: c.tone === 'yellow' ? C.amber : STRONG[c.tone] }}>{c.l}</span>
              <span style={{ fontFamily: display, fontWeight: 600, fontSize: 22, color: T[c.tone].fg }}>{c.w.split(' · ')[1]}</span>
            </div>
            <div className={b.on([3, 4, 1, 2, 5][i])}>
              <M2Cell items={cols[i]} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ─── Process mapping: the symbols ───────────────────────────────────────────
const M2Sym = ({ shape, title, sub, d }: { shape: ReactNode; title: string; sub: string; d: number }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 26, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <div style={{ width: 150, height: 80, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{shape}</div>
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M2_Carto: Page = () => (
  <Frame mod={2}>
    <Title>La cartographie : le processus étape par étape</Title>
    <Lede w={760}>Le SIPOC donne la vue d’ensemble. La carte montre le détail : qui fait quoi, dans quel ordre, et où ça bloque.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M2Sym d={100} title="Début / fin" sub="Ce qui déclenche, ce qui termine" shape={<div style={{ width: 140, height: 60, borderRadius: 999, background: T.green.bg, boxShadow: `inset 0 0 0 3px ${C.green}` }} />} />
      <M2Sym d={200} title="Étape" sub="Un verbe d’action : « vérifier le montant »" shape={<div style={{ width: 140, height: 64, borderRadius: 10, background: T.blue.bg, boxShadow: `inset 0 0 0 3px ${C.blue}` }} />} />
      <M2Sym d={300} title="Décision" sub="Une question à deux sorties : oui / non" shape={<div style={{ width: 56, height: 56, transform: 'rotate(45deg)', background: T.yellow.bg, boxShadow: `inset 0 0 0 3px ${C.amber}` }} />} />
      <M2Sym d={400} title="Flèche" sub="L’ordre des étapes, le passage de relais" shape={<FlowArrow w={120} color={C.soft} />} />
    </div>
    <Card tone="teal" icon="layers" title="Les couloirs" size={25} cls={A.right} style={{ position: 'absolute', left: 980, top: 230, width: 820, height: 330, ...dl(300) }}>
      Une bande horizontale par acteur (personne, service ou logiciel). Chaque fois qu’une flèche <b>change de couloir</b>, il y a un passage de relais… et souvent une attente.
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['Employé', 'Gestionnaire', 'Comptabilité'].map((l, i) => (
          <div key={l} style={{ height: 40, display: 'flex', alignItems: 'center', paddingLeft: 14, borderRadius: 8, background: [T.blue.bg, T.yellow.bg, T.green.bg][i], fontSize: 20, fontWeight: 600, color: C.soft }}>
            {l}
          </div>
        ))}
      </div>
    </Card>
    <Callout cls={A.right} title="Règle d’or" style={{ position: 'absolute', left: 980, top: 600, width: 820, ...dl(500) }}>
      Dessinez le processus <b>réel</b>, avec ses contournements et ses relances, pas celui de la procédure officielle.
    </Callout>
  </Frame>
);

// ─── Swimlane map with pain points ──────────────────────────────────────────
const M2Box = ({ cx: x, cy: y, w = 240, children, oval = false, tone = 'blue' }: { cx: number; cy: number; w?: number; children: ReactNode; oval?: boolean; tone?: Tone }) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - 43,
      width: w,
      height: 86,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 14px',
      borderRadius: oval ? 999 : 12,
      background: C.card,
      boxShadow: `${SHADOW_SM}, inset 0 0 0 3px ${STRONG[tone]}`,
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.2,
      color: C.ink,
    }}
  >
    {children}
  </div>
);

const M2Wire = ({ pts, dir }: { pts: [number, number][]; dir: 'r' | 'u' | 'd' }) => {
  const [ex, ey] = pts[pts.length - 1];
  const head = dir === 'r' ? `${ex},${ey} ${ex - 16},${ey - 10} ${ex - 16},${ey + 10}` : dir === 'd' ? `${ex},${ey} ${ex - 10},${ey - 16} ${ex + 10},${ey - 16}` : `${ex},${ey} ${ex - 10},${ey + 16} ${ex + 10},${ey + 16}`;
  return (
    <g>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.soft} strokeWidth={3.5} strokeLinejoin="round" />
      <polygon points={head} fill={C.soft} />
    </g>
  );
};

const M2_CartoEx: Page = () => (
  <Frame mod={2} kind="cas">
    <Title>La carte réelle des notes de frais… et ses irritants</Title>
    <Hint style={{ position: 'absolute', left: 120, top: 186 }}>Cliquez les pastilles rouges : où se perd le temps ?</Hint>
    {['Employé', 'Gestionnaire', 'Comptabilité'].map((l, i) => (
      <div key={l} style={{ position: 'absolute', left: 120, top: 250 + i * 200, width: 1680, height: 190, borderRadius: 14, background: [T.blue.bg, T.yellow.bg, T.green.bg][i] }}>
        <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: display, fontWeight: 700, fontSize: 28, color: [T.blue.fg, T.yellow.fg, T.green.fg][i] }}>{l}</div>
      </div>
    ))}
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <M2Wire dir="r" pts={[[590, 345], [636, 345]]} />
      <M2Wire dir="d" pts={[[880, 345], [1050, 345], [1050, 500]]} />
      <M2Wire dir="d" pts={[[1050, 588], [1050, 690]]} />
      <M2Wire dir="u" pts={[[968, 745], [760, 745], [760, 392]]} />
      <M2Wire dir="r" pts={[[1132, 745], [1216, 745]]} />
      <M2Wire dir="r" pts={[[1460, 745], [1506, 745]]} />
      <M2Wire dir="u" pts={[[1630, 702], [1630, 392]]} />
      <text x={800} y={730} fontSize={21} fill={C.coral} fontWeight={700}>
        non · relance
      </text>
      <text x={1142} y={728} fontSize={21} fill={T.green.fg} fontWeight={700}>
        oui
      </text>
    </svg>
    <M2Box cx={470} cy={345}>Remplit le formulaire Excel</M2Box>
    <M2Box cx={760} cy={345}>Joint les reçus scannés</M2Box>
    <M2Box cx={1050} cy={545} tone="yellow">Approuve par courriel</M2Box>
    <div style={{ position: 'absolute', left: 990, top: 685, width: 120, height: 120, transform: 'rotate(45deg)', background: C.card, boxShadow: `${SHADOW_SM}, inset 0 0 0 3px ${C.amber}` }} />
    <div style={{ position: 'absolute', left: 980, top: 718, width: 140, textAlign: 'center', fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: C.ink }}>Dossier complet ?</div>
    <M2Box cx={1340} cy={745} tone="green">Ressaisit dans le logiciel</M2Box>
    <M2Box cx={1630} cy={745} tone="green">Effectue le virement</M2Box>
    <M2Box cx={1630} cy={345} oval tone="green">Remboursé</M2Box>
    <Hotspot n={1} x={590} y={302} title="Double saisie">
      L’employé recopie chaque montant des reçus dans Excel : 5 à 10 minutes par note, et des fautes de frappe.
    </Hotspot>
    <Hotspot n={2} x={1170} y={502} title="Attente">
      L’approbation se perd dans la boîte de réception du gestionnaire : 4 jours en moyenne, deux relances.
    </Hotspot>
    <Hotspot n={3} x={1100} y={680} side="left" title="Aller-retour">
      Une note sur quatre est incomplète (reçu manquant) : elle repart au début.
    </Hotspot>
    <Hotspot n={4} x={1460} y={702} side="left" title="Ressaisie">
      La comptabilité retape tout dans le logiciel comptable : la même donnée saisie deux fois.
    </Hotspot>
  </Frame>
);

// ─── Time thieves ───────────────────────────────────────────────────────────
const M2_THIEVES: { icon: IconName; tone: Tone; t: string; s: string }[] = [
  { icon: 'keyboard', tone: 'blue', t: 'Ressaisir', s: 'La même donnée tapée dans deux outils' },
  { icon: 'copy', tone: 'teal', t: 'Copier-coller', s: 'D’un courriel vers un tableau, d’un tableau vers un rapport' },
  { icon: 'search', tone: 'violet', t: 'Chercher', s: 'Retrouver un fichier, une version, un numéro de dossier' },
  { icon: 'bell', tone: 'yellow', t: 'Relancer', s: 'Courir après une approbation, un document, une réponse' },
  { icon: 'chart', tone: 'green', t: 'Mettre en forme', s: 'Le même rapport, reconstruit chaque semaine' },
  { icon: 'inbox', tone: 'coral', t: 'Trier', s: 'Lire, classer, transférer les courriels entrants' },
];

const M2_Voleurs: Page = () => (
  <Frame mod={2}>
    <Title>Six voleurs de temps à traquer</Title>
    <Lede>Quand vous cartographiez, ces gestes trahissent une tâche automatisable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      {M2_THIEVES.map((x, i) => (
        <div key={x.t} className={A.in} style={{ display: 'flex', gap: 24, alignItems: 'center', height: 250, boxSizing: 'border-box', padding: '0 30px', background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100 + i * 100) }}>
          <IconTile name={x.icon} tone={x.tone} size={92} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>{x.t}</div>
            <div style={{ marginTop: 6, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{x.s}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Exercise 1: my daily work ──────────────────────────────────────────────
const M2_Journal: Page = () => (
  <AtelierPage
    mod={2}
    kind="exercice"
    n="Exercice 1"
    title="Analyser son propre quotidien"
    timerId="m2-journal"
    minutes={10}
    tools="Votre carnet de bord (document personnel) · rubrique 1"
    objective="Lister au moins cinq tâches répétitives de votre travail et estimer le temps qu’elles vous prennent."
    deliver={
      <>
        Un tableau de 5 lignes : <b>tâche · fréquence · durée · outils utilisés</b>.
        <div style={{ marginTop: 10, fontSize: 21, color: C.muted }}>
          Pas d’idée ? Courriels à trier, rapport du lundi, relances, saisie de formulaires, comptes rendus, mise à jour d’un tableau de suivi.
        </div>
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Au moins 5 tâches</CheckItem>
        <CheckItem id="b" size={22}>Une durée et une fréquence pour chacune</CheckItem>
        <CheckItem id="c" size={22}>Les outils nommés (Outlook, Excel, logiciel métier…)</CheckItem>
      </>
    }
  >
    <Do n={1}>Pensez à votre dernière semaine, jour par jour : qu’avez-vous refait plusieurs fois ?</Do>
    <Do n={2}>Notez chaque tâche avec un verbe : « saisir », « relancer », « compiler »…</Do>
    <Do n={3}>Estimez la durée d’une fois et le nombre de fois par semaine.</Do>
    <Do n={4}>Cherchez les six voleurs de temps : ressaisir, copier-coller, chercher, relancer, mettre en forme, trier.</Do>
  </AtelierPage>
);

// ─── The four criteria ──────────────────────────────────────────────────────
const M2_CRIT: { icon: IconName; tone: Tone; t: string; q: string; lo: string; hi: string }[] = [
  { icon: 'loop', tone: 'blue', t: 'Fréquence', q: 'Combien de fois revient-elle ?', lo: '1 · une fois par an', hi: '5 · plusieurs fois par jour' },
  { icon: 'layers', tone: 'teal', t: 'Volume', q: 'Combien de cas à chaque fois ?', lo: '1 · un ou deux', hi: '5 · des dizaines ou des centaines' },
  { icon: 'list', tone: 'yellow', t: 'Règles claires', q: 'La logique peut-elle s’écrire ?', lo: '1 · jugement au cas par cas', hi: '5 · toujours la même logique' },
  { icon: 'plug', tone: 'green', t: 'Outils utilisés', q: 'Les applications sont-elles connectables ?', lo: '1 · logiciel fermé, papier', hi: '5 · applications en ligne, connecteurs' },
];

const M2_Criteres: Page = () => (
  <Frame mod={2}>
    <Title>Quatre critères pour choisir quoi automatiser</Title>
    <Lede>Notez chaque tâche de 1 à 5 sur chacun. Les règles floues ou les vieux logiciels ne disent pas « non » : ils disent « autrement ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
      {M2_CRIT.map((c, i) => (
        <div key={c.t} className={A.in} style={{ height: 470, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[c.tone]}`, padding: '28px 26px', display: 'flex', flexDirection: 'column', ...dl(100 + i * 120) }}>
          <IconTile name={c.icon} tone={c.tone} size={70} />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>{c.t}</div>
          <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.35, color: C.soft }}>{c.q}</div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Tag tone="grey" size={19} style={{ whiteSpace: 'normal' }}>
              {c.lo}
            </Tag>
            <Tag tone={c.tone} size={19} style={{ whiteSpace: 'normal' }}>
              {c.hi}
            </Tag>
          </div>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 806, width: 1680, display: 'flex', gap: 24, ...dl(700) }}>
      <Callout title="Règles floues ?" tone="violet" icon="sparkles" size={24} style={{ flex: 1 }}>
        Candidat pour une <b>étape IA</b> (module 5).
      </Callout>
      <Callout title="Pas de connecteur ?" tone="teal" icon="bot" size={24} style={{ flex: 1 }}>
        Candidat pour un <b>robot RPA</b> (module 4).
      </Callout>
    </div>
  </Frame>
);

// ─── Interactive score ──────────────────────────────────────────────────────
const M2_PRESETS: { t: string; v: number[] }[] = [
  { t: 'Saisie des factures', v: [5, 4, 4, 4] },
  { t: 'Rapport hebdomadaire', v: [3, 2, 5, 4] },
  { t: 'Tri des plaintes', v: [5, 4, 2, 4] },
  { t: 'Copie vers un vieux logiciel', v: [4, 3, 5, 1] },
  { t: 'Plan stratégique annuel', v: [1, 1, 1, 3] },
];

const M2_Score: Page = () => {
  const [v, setV] = useState([5, 4, 4, 4]);
  const set = (i: number, x: number) => setV((o) => o.map((y, j) => (j === i ? x : y)));
  const total = v.reduce((a, x) => a + x, 0);
  const verdict =
    total >= 16
      ? { t: 'Excellent candidat', tone: 'green' as Tone, s: 'Gain rapide : à construire en premier.' }
      : total >= 12
        ? { t: 'Bon candidat', tone: 'blue' as Tone, s: 'À automatiser, après une petite simplification.' }
        : total >= 8
          ? { t: 'À simplifier d’abord', tone: 'yellow' as Tone, s: 'Clarifiez le processus avant de construire.' }
          : { t: 'À laisser de côté', tone: 'coral' as Tone, s: 'Peu de gain : gardez votre énergie pour une autre tâche.' };
  const how = v[2] <= 2 ? { icon: 'sparkles' as IconName, t: 'Workflow + étape IA' } : v[3] <= 2 ? { icon: 'bot' as IconName, t: 'Robot RPA' } : { icon: 'puzzle' as IconName, t: 'Workflow sans code' };
  return (
    <Frame mod={2} kind="exercice">
      <Title>Notez une tâche, voyez le verdict</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 196, display: 'flex', gap: 10 }}>
        {M2_PRESETS.map((p) => (
          <Btn key={p.t} ghost size={20} onClick={() => setV(p.v)}>
            {p.t}
          </Btn>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 300, width: 1000, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {M2_CRIT.map((c, i) => (
          <div key={c.t} className={A.left} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(i * 100) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconTile name={c.icon} tone={c.tone} size={48} />
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink, width: 240 }}>{c.t}</span>
              <Range value={v[i]} onChange={(x) => set(i, x)} min={1} max={5} w={480} tone={c.tone} />
              <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 700, fontSize: 48, color: c.tone === 'yellow' ? C.amber : STRONG[c.tone] }}>{v[i]}</span>
            </div>
            <div style={{ marginTop: 6, marginLeft: 64, fontSize: 20, color: C.muted }}>
              {c.lo} → {c.hi}
            </div>
          </div>
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1180, top: 300, width: 620, height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 34px', ...dl(200) }}>
        <Eyebrow c={C.muted}>Score</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: verdict.tone === 'yellow' ? C.amber : STRONG[verdict.tone] }}>{total}</span>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 48, color: C.faint }}>/ 20</span>
        </div>
        <div style={{ marginTop: 10, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
          <div style={{ width: `${(total / 20) * 100}%`, height: '100%', background: STRONG[verdict.tone], transition: `width 400ms ${EASE}` }} />
        </div>
        <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 40, color: T[verdict.tone].fg }}>{verdict.t}</div>
        <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{verdict.s}</div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: T.blue.bg }}>
          <Icon name={how.icon} size={34} color={T.blue.fg} />
          <div>
            <div style={{ fontSize: 19, color: C.muted }}>Technique probable</div>
            <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{how.t}</div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Gain calculator ────────────────────────────────────────────────────────
const M2Input = ({ label, value, set, min, max, step = 1, unit, tone }: { label: string; value: number; set: (x: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>
        {value} <span style={{ fontSize: 24, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <Range value={value} onChange={set} min={min} max={max} step={step} w={880} tone={tone} />
  </div>
);

const M2_Gain: Page = () => {
  const [min, setMin] = useState(10);
  const [n, setN] = useState(15);
  const [pct, setPct] = useState(80);
  const [setup, setSetup] = useState(6);
  const perWeek = (min * n * pct) / 100 / 60;
  const year = perWeek * 46;
  const payback = perWeek > 0 ? setup / perWeek : 0;
  return (
    <Frame mod={2} kind="exercice">
      <Title>Combien de temps rendrait cette automatisation ?</Title>
      <Lede>Le calcul de base, à refaire pour votre tâche. Il servira de point de comparaison au module 10.</Lede>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 290, width: 940, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M2Input label="Durée d’une fois" value={min} set={setMin} min={1} max={60} unit="min" tone="blue" />
        <M2Input label="Fois par semaine" value={n} set={setN} min={1} max={100} unit="fois" tone="teal" />
        <M2Input label="Part réellement automatisée" value={pct} set={setPct} min={30} max={100} step={5} unit="%" tone="violet" />
        <M2Input label="Temps de mise en place" value={setup} set={setSetup} min={1} max={40} unit="h" tone="yellow" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1120, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
        <div style={{ background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff' }}>
          <Eyebrow c="#DDEEFA">Temps rendu par an (46 semaines)</Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 130, lineHeight: 1.05 }}>{fr(year, 0)} h</div>
          <div style={{ fontSize: 24, color: '#E6F2FB' }}>soit {fr(perWeek, 1)} h par semaine, environ {fr(year / 7, 0)} journées de travail</div>
        </div>
        <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
          <Eyebrow c={C.muted}>Rentabilisé après</Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 80, lineHeight: 1.05, color: payback <= 8 ? T.green.fg : payback <= 26 ? C.amber : C.coral }}>
            {fr(payback, 1)} semaines
          </div>
          <div style={{ fontSize: 22, color: C.soft }}>Ajoutez au module 10 le temps de maintenance : une automatisation s’entretient.</div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Exercise 2: score + SIPOC of my task ───────────────────────────────────
const M2_Atelier: Page = () => (
  <AtelierPage
    mod={2}
    kind="exercice"
    n="Exercice 2"
    title="Choisir sa tâche et la décrire en SIPOC"
    timerId="m2-sipoc"
    minutes={25}
    tools="Votre carnet de bord · rubriques 2 et 3 · un assistant IA gratuit si vous voulez un premier jet"
    objective="Identifier la tâche qui consomme le plus de temps pour le moins de jugement, et la décrire sur une page."
    deliver={
      <>
        Rubrique 2 : vos 5 tâches notées sur 20 et la tâche retenue.
        <br />
        Rubrique 3 : son SIPOC (5 colonnes, 4 à 7 étapes) et son gain estimé en heures par an.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Les 4 critères notés pour chaque tâche</CheckItem>
        <CheckItem id="b" size={22}>Une tâche retenue, score ≥ 12</CheckItem>
        <CheckItem id="c" size={22}>Un SIPOC complet, étapes avec des verbes</CheckItem>
        <CheckItem id="d" size={22}>Un gain estimé en heures par an</CheckItem>
      </>
    }
  >
    <Do n={1}>Notez vos 5 tâches sur les 4 critères (1 à 5). Gardez la meilleure.</Do>
    <Do n={2}>Écrivez ses étapes (P) : 4 à 7 verbes d’action, dans l’ordre.</Do>
    <Do n={3}>Complétez O et C (ce qui sort, pour qui), puis I et S (ce qui entre, d’où).</Do>
    <Do n={4}>Repérez les voleurs de temps et estimez le gain (calculateur de la page précédente).</Do>
    <Bonus>Demandez à votre assistant IA de critiquer votre SIPOC : « Quelles étapes manquent ? Quels cas particuliers oublié-je ? » Données fictives seulement.</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Le meilleur candidat"
    q="Laquelle de ces tâches faut-il automatiser en premier ?"
    explain="On cherche la combinaison fréquence + volume + règles claires + outils connectables. Le rapprochement quotidien coche tout ; les autres manquent de fréquence, de règles ou d’enjeu."
  >
    <Opt why="Piège ! Une fois par an : même parfaitement automatisé, le gain est minime pour un effort réel.">
      Préparer le budget annuel du service
    </Opt>
    <Opt why="Piège ! C’est relationnel et délicat : on peut préparer avec l’IA, pas automatiser l’échange.">
      Répondre aux plaintes d’un client stratégique
    </Opt>
    <Opt why="Piège ! Rare et chaque fois différent : la logique ne s’écrit pas.">
      Organiser le party de fin d’année
    </Opt>
    <Opt ok why="Exact : tous les jours, des dizaines de lignes, une règle claire (même montant, même référence), des fichiers numériques. Score proche de 20.">
      Rapprocher chaque jour les paiements reçus et les factures
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M2_Synthese: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Montrez votre SIPOC à une personne qui fait la même tâche : <b>a-t-elle les mêmes étapes ?</b> Les écarts sont vos cas particuliers.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Comprendre, <b>simplifier</b>, puis automatiser : jamais dans l’autre sens.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Le <b>SIPOC</b> donne la vue d’ensemble ; la <b>carte</b> montre les relais et les attentes.
    </SynthRow>
    <SynthRow n={3} tone="yellow" d={340}>
      Quatre critères : <b>fréquence, volume, règles, outils</b>. Score sur 20.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Le gain se calcule : durée × fréquence × part automatisée, moins la mise en place.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_Desordre, M2_Sipoc, M2_SipocEx, M2_Carto, M2_CartoEx, M2_Voleurs, M2_Journal, M2_Criteres, M2_Score, M2_Gain, M2_Atelier, M2_Qcm, M2_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 2 (1 h 20, pause de 15 min vers 10 h 40 incluse dans le déroulé)

DIRE — « Le module le plus important des deux jours. Une bonne automatisation commence par une bonne analyse. On voit deux outils, le SIPOC et la cartographie, puis vous les appliquez à votre propre travail. »

TRANSITION — « Premier principe. »`,
  `⏱ 3 min

OBJECTIF — Ancrer la règle « simplifier avant d'automatiser ».

DIRE — Lisez la citation. « Si un processus est mal conçu, l'automatiser produit les mêmes erreurs, mais plus vite. »
→ beat 1 Comprendre — « On décrit la réalité, pas la procédure officielle. »
→ beat 2 Simplifier — « Souvent, 20 à 30 % des étapes disparaissent : une validation que plus personne ne lit, un fichier intermédiaire. »
→ beat 3 Automatiser — « Ce qui reste est plus court, donc plus simple à construire et à maintenir. »

INTERACTION — « Avez-vous une étape dans votre travail dont personne ne sait plus pourquoi elle existe ? » Une ou deux réponses.

TRANSITION — « Premier outil pour comprendre : le SIPOC. »`,
  `⏱ 5 min

OBJECTIF — Expliquer le SIPOC simplement.

DIRE — « SIPOC vient de l'anglais : Suppliers, Inputs, Process, Outputs, Customers. Cinq colonnes qui tiennent sur une page. » Révélez les colonnes (→ beats 1 à 5) avec la question de chacune.

INSISTER — « P, ce sont 4 à 7 grandes étapes. Si vous en avez 25, vous êtes dans la cartographie détaillée, c'est trop tôt. »

ASTUCE — On remplit dans l'ordre P, O, C, I, S : on part de ce qu'on fait, puis on regarde à qui ça sert, puis ce dont on a besoin.

TRANSITION — « Un exemple complet. »`,
  `⏱ 5 min · CAS : NOTES DE FRAIS

OBJECTIF — Montrer un SIPOC rempli, dans l'ordre recommandé.

DIRE — « Une PME de services : 120 employés, 300 notes de frais par mois. » Révélez dans l'ordre (→) :
→ beat 1 P — les 5 étapes.
→ beat 2 O — virement, écriture comptable, dossier archivé.
→ beat 3 S, beat 4 I — l'employé, la carte de crédit ; le formulaire, les reçus, la politique.
→ beat 5 C — l'employé, la comptabilité… et le vérificateur externe, qu'on oublie souvent.

QUESTION — « Quel client du processus est le plus pressé ? » L'employé, qui attend son argent. « Et le plus exigeant ? » Le vérificateur : il faut la traçabilité.

TRANSITION — « Le SIPOC ne montre pas où ça coince. Pour ça : la carte. »`,
  `⏱ 4 min

OBJECTIF — Donner les quatre symboles et la notion de couloir.

DIRE — Présentez les symboles : début/fin, étape (un verbe), décision (une question oui/non), flèche. « Quatre symboles suffisent. Pas besoin de norme compliquée. »

Couloirs — « Une bande par acteur. Chaque fois qu'une flèche change de couloir, quelqu'un attend quelqu'un d'autre. C'est là que se cachent les délais. »

RÈGLE D'OR — « Dessinez le vrai processus, avec ses relances et ses contournements. »

OUTILS — Papier, PowerPoint, draw.io (gratuit), ou demander à une IA de proposer un diagramme à partir d'une liste d'étapes.

TRANSITION — « Voici la carte réelle des notes de frais. »`,
  `⏱ 6 min · CAS INTERACTIF

OBJECTIF — Lire une carte pour y trouver les gains.

DIRE — Suivez le parcours avec le pointeur : formulaire, reçus, approbation par courriel, décision « dossier complet ? », ressaisie, virement.

ANIMATION — « Où perd-on du temps ? » Laissez proposer, puis cliquez les pastilles 1 à 4 :
1. Double saisie des montants par l'employé.
2. Attente de l'approbation : 4 jours, deux relances.
3. Une note sur quatre revient au début.
4. Ressaisie par la comptabilité.

QUESTION — « Que simplifieriez-vous avant d'automatiser ? » Pistes : un formulaire en ligne avec photo du reçu (supprime 1 et 4), une approbation par bouton avec rappel automatique (2), des champs obligatoires (3). « L'IA n'apparaît qu'à un endroit : lire le reçu. »

TRANSITION — « Ces irritants ont des familles. »`,
  `⏱ 3 min

OBJECTIF — Donner une grille de repérage pour l'exercice suivant.

DIRE — Parcourez les six cartes. « Si vous vous surprenez à faire un de ces gestes plusieurs fois par semaine, notez-le. »

INTERACTION — « Lequel de ces six est votre pire ennemi ? » Trois réponses rapides, par prénom.

TRANSITION — « À vous : on analyse votre quotidien. »`,
  `⏱ 10 min · EXERCICE 1 INDIVIDUEL

OBJECTIF — Chacun liste au moins cinq tâches répétitives, avec fréquence, durée et outils.

ANIMATION — Lancez le minuteur. Collez dans le Chat le gabarit du tableau (tâche · fréquence · durée · outils). Rappelez : on pense à la dernière semaine, jour par jour.

POINT D'ÉTAPE à 5 min — « Combien de tâches avez-vous déjà ? » Réponses au micro ou un chiffre dans le Chat. Quelqu'un est bloqué : proposez la liste d'exemples du livrable.

À LA FIN — Deux volontaires lisent leur tâche la plus chronophage. Ne commentez pas encore : on va les noter.

NOTE — Si la pause n'a pas encore eu lieu, placez-la ici (10 h 40, 15 min).

TRANSITION — « Comment savoir laquelle automatiser ? Quatre critères. »`,
  `⏱ 4 min

OBJECTIF — Présenter les quatre critères du programme.

DIRE — Parcourez les cartes.
• Fréquence : « Une fois par an, même automatisée, ne rapporte presque rien. »
• Volume : « Dix cas d'un coup valent mieux qu'un. »
• Règles claires : « Si deux personnes font la tâche de la même façon, la règle s'écrit. »
• Outils : « Applications en ligne avec connecteurs : facile. Vieux logiciel sans connecteur : plus difficile. »

INSISTER — Les deux encadrés : règles floues → IA ; pas de connecteur → RPA. « Une note basse oriente vers une technique, elle n'élimine pas forcément la tâche. »

TRANSITION — « Essayons avec un outil de notation. »`,
  `⏱ 5 min · OUTIL INTERACTIF

OBJECTIF — S'entraîner à noter et lire le verdict.

ANIMATION — Cliquez les exemples un à un et commentez :
• Saisie des factures (17) : excellent candidat, workflow sans code.
• Rapport hebdomadaire (14) : bon candidat ; volume faible mais règles claires.
• Tri des plaintes (15) : bon candidat, mais règles floues → étape IA.
• Copie vers un vieux logiciel (13) : outils à 1 → robot RPA.
• Plan stratégique (6) : on laisse de côté.

INTERACTION — Demandez à un volontaire sa tâche la plus chronophage (exercice 1) et notez-la ensemble avec les curseurs, à voix haute.

TRANSITION — « Et en heures, ça représente combien ? »`,
  `⏱ 4 min · CALCULATEUR

OBJECTIF — Chiffrer le gain, et introduire la notion de rentabilité.

DIRE — « Exemple : 10 minutes, 15 fois par semaine, 80 % automatisés : 2 heures par semaine, environ 92 heures par an. Avec 6 heures de mise en place, c'est rentabilisé en trois semaines. »

ANIMATION — Bougez les curseurs : « Que se passe-t-il pour une tâche de 3 minutes, une fois par semaine ? » Quelques heures par an : la rentabilité dépasse l'année.

INSISTER — « Gardez ce chiffre dans votre carnet : au module 10, vous le comparerez au gain réel. Et on ajoutera la maintenance. »

TRANSITION — « À vous : choisir votre tâche et la décrire. »`,
  `⏱ 25 min · EXERCICE 2 INDIVIDUEL

OBJECTIF — Chacun choisit sa tâche réelle et la décrit en SIPOC, avec un gain estimé.

ANIMATION — Lancez le minuteur. Collez dans le Chat le gabarit SIPOC (5 colonnes). Rappelez l'ordre P, O, C, I, S.

POINTS D'ÉTAPE —
• à 8 min : « Votre tâche est-elle choisie ? Score ? » Un chiffre au micro.
• à 18 min : « Où en êtes-vous : P, O-C, ou I-S ? » Quelqu'un est bloqué → partage d'écran 2 minutes.

RESTITUTION (5 min, incluse) — Deux ou trois volontaires partagent leur SIPOC en 1 minute chacun. Questions à poser : « Combien d'étapes ? » « Quel client oublié ? » « Où serait l'étape IA ? »

ATTENTION — Tâche avec données sensibles : on la garde, mais on construira plus tard avec des données fictives.

TRANSITION — « Un dernier QCM avant le dîner. »`,
  `⏱ 2 min · QCM 2

RÉPONSE — D. Le rapprochement quotidien coche les quatre critères.
• A ✗ — Annuel : trop rare.
• B ✗ — Relationnel et sensible.
• C ✗ — Rare et toujours différent.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Votre carnet contient maintenant votre tâche, son score, son SIPOC et son gain estimé. C'est la base de tout le jour 2. »

LOGISTIQUE — Dîner 12 h – 13 h. « En revenant, on découvre les outils et on crée les comptes : ayez votre compte Google sous la main. »

TRANSITION — « Après le dîner : les outils d'automatisation. »`,
];
// @@NOTES-END
