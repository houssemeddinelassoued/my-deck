// ─── Module 1 · Découvrir l’IA et identifier ses opportunités ───────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title="Découvrir l’IA et ses opportunités"
    sub="Ce qu’est l’IA générative, ce qu’on peut lui demander, ce qu’il ne faut pas lui confier — et où se cache votre temps perdu."
    dur="55 min"
    labs={<DefiBadge defi="taches" />}
  >
    <SecItem n={1}>Comprendre l’IA générative et ses limites</SecItem>
    <SecItem n={2}>Les 9 verbes de l’IA au quotidien professionnel</SecItem>
    <SecItem n={3}>Identifier les tâches chronophages à lui confier</SecItem>
    <SecItem n={4}>Choisir le bon outil pour la bonne tâche</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── IA classique vs IA générative ──────────────────────────────────────────
const M1Out = ({ icon, label, ex, tone, d }: { icon: IconName; label: string; ex: string; tone: Tone; d: number }) => (
  <div className={b.pop(1)} style={{ display: 'flex', gap: 16, alignItems: 'center', background: T[tone].bg, borderRadius: 14, padding: '14px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{ex}</div>
    </div>
  </div>
);

const M1_GenAI: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Qu’est-ce que l’IA générative ?</Title>
    <Lede>Vous utilisez de l’IA depuis des années sans le savoir. Ce qui change : elle ne fait plus que trier, elle crée.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px' }}>
      <Eyebrow c={C.muted}>L’IA « classique » · elle prédit, elle classe</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Bullet size={26} tone="grey">Le filtre anti-spam de votre messagerie</Bullet>
        <Bullet size={26} tone="grey">Le GPS qui recalcule l’itinéraire selon le trafic</Bullet>
        <Bullet size={26} tone="grey">Les recommandations d’une plateforme vidéo</Bullet>
        <Bullet size={26} tone="grey">La détection de fraude sur votre carte bancaire</Bullet>
      </div>
      <div style={{ position: 'absolute', left: 32, right: 32, bottom: 28, fontSize: 22, color: C.muted, lineHeight: 1.4 }}>
        Réponse attendue : <strong style={{ color: C.ink }}>oui / non, une catégorie, un score</strong>.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 920, top: 280, width: 880 }}>
      <Eyebrow c={C.violet} cls={b.fade(1)}>
        L’IA générative · elle produit du contenu nouveau
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <M1Out icon="doc" label="Du texte" ex="emails, synthèses, rapports" tone="blue" d={0} />
        <M1Out icon="image" label="Des images" ex="visuels, illustrations" tone="pink" d={120} />
        <M1Out icon="mic" label="Du son" ex="voix, podcasts, musique" tone="yellow" d={240} />
        <M1Out icon="video" label="De la vidéo" ex="clips, sous-titres, montage" tone="violet" d={360} />
      </div>
      <div className={b.on(2)} style={{ marginTop: 26 }}>
        <Callout title="Définition simple" tone="violet" icon="sparkles" size={25}>
          Une IA générative est un programme entraîné sur d’immenses volumes de contenus, capable de{' '}
          <strong>produire un contenu nouveau à partir d’une simple demande en langage courant</strong> : le prompt.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Comment fonctionne un assistant : prédire le mot suivant ───────────────
const M1Cand = ({ w, p, top, n }: { w: string; p: number; top?: boolean; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 150, fontFamily: mono, fontSize: 26, fontWeight: top ? 700 : 400, color: top ? C.electric : C.soft }}>{w}</span>
    <div style={{ flex: 1, height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: `${p * 1.8}%`, height: '100%', borderRadius: 8, background: top ? G.blue : C.faint }} />
    </div>
    <span className={b.fade(n)} style={{ width: 70, textAlign: 'right', fontFamily: mono, fontSize: 24, color: top ? C.electric : C.muted }}>
      {p} %
    </span>
  </div>
);

const M1_How: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comment fonctionne un assistant IA ?</Title>
    <Lede>Un seul mécanisme, répété des milliers de fois : deviner le mot suivant le plus probable.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px' }}>
      <Eyebrow c={C.muted} size={19}>
        Votre demande, déjà en partie écrite
      </Eyebrow>
      <div style={{ marginTop: 14, fontSize: 30, lineHeight: 1.45, color: C.ink }}>
        « Bonjour Paul, je vous propose de décaler notre réunion à{' '}
        <span className={b.fade(2)} style={{ fontWeight: 700, color: C.electric, background: T.blue.bg, borderRadius: 8, padding: '0 8px' }}>
          demain
        </span>
        <span className={cx(A.blink, b.off(2))} style={{ color: C.electric, fontWeight: 700 }}>
          ▍
        </span>{' '}
        »
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Eyebrow c={C.violet} size={19} cls={b.fade(1)}>
          Ce que le modèle calcule pour le mot suivant
        </Eyebrow>
        <M1Cand w="demain" p={46} top n={1} />
        <M1Cand w="jeudi" p={21} n={1} />
        <M1Cand w="lundi" p={14} n={1} />
        <M1Cand w="14 h" p={9} n={1} />
        <M1Cand w="Paris" p={2} n={1} />
      </div>
      <div className={b.fade(1)} style={{ marginTop: 16, fontSize: 19, color: C.faint }}>
        Probabilités illustratives.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 270, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="book" title="Il a beaucoup lu" cls={b.on(3)} size={22}>
        Entraîné sur des milliards de textes, il connaît les tournures, les styles, les formats.
      </Card>
      <Card tone="violet" icon="sparkles" title="Il prédit, il ne vérifie pas" cls={b.on(3)} style={dl(150)} size={22}>
        Un texte fluide et sûr de lui peut être faux. Plausible ≠ exact.
      </Card>
      <Card tone="green" icon="user" title="Il ne sait de vous que ce que vous lui dites" cls={b.on(3)} style={dl(300)} size={22}>
        Votre contexte, votre client, vos contraintes : c’est à vous de les donner.
      </Card>
    </div>
  </Frame>
);

// ─── Que peut-on demander ? Les 9 verbes ────────────────────────────────────
type Verb = { id: string; icon: IconName; tone: Tone; prompt: string; tools: ToolId[]; mod: string };
const VERBS: Verb[] = [
  { id: 'Rédiger', icon: 'pen', tone: 'blue', prompt: 'Rédige un email de relance courtois pour une facture impayée depuis 30 jours.', tools: ['chatgpt', 'copilot', 'claude'], mod: 'M2 · M3' },
  { id: 'Reformuler', icon: 'loop', tone: 'violet', prompt: 'Reformule ce paragraphe pour un public non technique, en trois phrases maximum.', tools: ['deepl', 'grammarly', 'chatgpt'], mod: 'M5' },
  { id: 'Résumer', icon: 'layers', tone: 'teal', prompt: 'Résume ce compte rendu en 5 points et liste les décisions prises.', tools: ['copilot', 'claude', 'notebooklm'], mod: 'M3 · M4' },
  { id: 'Traduire', icon: 'translate', tone: 'navy', prompt: 'Traduis cette fiche produit en anglais en gardant un ton commercial.', tools: ['deepl', 'chatgpt'], mod: 'M5' },
  { id: 'Rechercher', icon: 'search', tone: 'blue', prompt: 'Quels dispositifs financent la formation des salariés en PME ? Cite tes sources.', tools: ['perplexity', 'gemini'], mod: 'M4' },
  { id: 'Analyser', icon: 'chart', tone: 'green', prompt: 'Voici 200 réponses d’enquête : quels sont les 3 irritants principaux ?', tools: ['chatgpt', 'claude', 'copilot'], mod: 'M3' },
  { id: 'Créer', icon: 'image', tone: 'pink', prompt: 'Crée un visuel pour annoncer notre webinaire du 14 novembre.', tools: ['canva', 'firefly', 'gamma'], mod: 'M5 · M7' },
  { id: 'Organiser', icon: 'calendar', tone: 'yellow', prompt: 'Transforme ces notes de réunion en tâches avec responsable et échéance.', tools: ['notion', 'fireflies', 'otter'], mod: 'M6' },
  { id: 'Automatiser', icon: 'bolt', tone: 'coral', prompt: 'À chaque formulaire reçu : résumé IA, ligne dans le tableur, email de confirmation.', tools: ['zapier', 'make', 'powerautomate'], mod: 'M8' },
];

const M1VerbBtn = ({ v, i }: { v: Verb; i: number }) => {
  const ctx = useContext(TabCtx);
  const on = ctx?.cur === v.id;
  return (
    <button
      type="button"
      data-osd-interactive
      className={A.pop}
      onClick={(e) => {
        e.currentTarget.blur();
        ctx?.set(v.id);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 168,
        border: 'none',
        borderRadius: 18,
        cursor: 'pointer',
        background: on ? STRONG[v.tone] : C.card,
        color: on ? '#fff' : C.ink,
        boxShadow: on ? `0 16px 30px -16px ${STRONG[v.tone]}` : SHADOW_SM,
        transform: on ? 'translateY(-4px)' : 'none',
        transition: `all 250ms ${EASE}`,
        fontFamily: display,
        fontWeight: 700,
        fontSize: 25,
        ...dl(100 + i * 70),
      }}
    >
      <Icon name={v.icon} size={44} color={on ? '#fff' : STRONG[v.tone]} />
      {v.id}
    </button>
  );
};

const M1_Verbs: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Que peut-on demander à une IA ? Neuf verbes</Title>
    <Lede>Cliquez sur un verbe : un exemple de demande, et les outils de la journée qui s’y prêtent le mieux.</Lede>
    <Tabs initial="Rédiger">
      <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {VERBS.map((v, i) => (
          <M1VerbBtn key={v.id} v={v} i={i} />
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1080, top: 270, width: 720, height: 540, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 34px', ...dl(300) }}>
        {VERBS.map((v) => (
          <TabPane key={v.id} id={v.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconTile name={v.icon} tone={v.tone} size={64} solid />
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.navy }}>{v.id}</div>
              <Tag tone="grey" size={18} style={{ marginLeft: 'auto' }}>
                vu en {v.mod}
              </Tag>
            </div>
            <Eyebrow c={C.muted} size={18} style={{ marginTop: 28 }}>
              Exemple de demande
            </Eyebrow>
            <div style={{ marginTop: 10 }}>
              <PromptBox size={25}>{v.prompt}</PromptBox>
            </div>
            <Eyebrow c={C.muted} size={18} style={{ marginTop: 30 }}>
              Outils à essayer
            </Eyebrow>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {v.tools.map((t) => (
                <ToolChip key={t} id={t} size={25} full />
              ))}
            </div>
          </TabPane>
        ))}
      </div>
    </Tabs>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(900) }}>
      Question au groupe : lequel de ces verbes occupe le plus votre semaine ?
    </Hint>
  </Frame>
);

// ─── Les limites : repérez les erreurs ──────────────────────────────────────
const M1_ERRS: [string, string][] = [
  ['Chiffres inventés', 'L’IA n’a jamais vu votre rapport. Faute de source, elle produit des chiffres plausibles : c’est une « hallucination ».'],
  ['Source fictive', 'Ce cabinet et cette étude n’existent pas. Une citation n’est une preuve que si vous pouvez l’ouvrir et la lire.'],
  ['Erreur de calcul', '3 × 1,2 = 3,6 M€, pas 4,6. Un modèle de langage prédit des mots : sans outil de calcul, il se trompe.'],
  ['Connaissances datées', 'Le modèle s’arrête à sa date d’entraînement : ce qu’il appelle « le plus récent » ne l’est souvent plus.'],
  ['Excès de confiance', 'Le ton assuré ne dit rien de la fiabilité. L’IA n’a ni jugement, ni responsabilité : vous, si.'],
];

const M1Err = ({ n, sel, set, children }: { n: number; sel: number[]; set: (n: number) => void; children: ReactNode }) => {
  const on = sel.includes(n);
  return (
    <span style={{ background: on ? 'rgba(224,72,72,.16)' : 'transparent', borderRadius: 6, transition: `background 300ms ${EASE}` }}>
      {children}
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          set(n);
        }}
        className={on ? undefined : A.glow}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          margin: '0 4px',
          verticalAlign: 'middle',
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          background: on ? C.coral : '#fff',
          color: on ? '#fff' : C.coral,
          boxShadow: `inset 0 0 0 2.5px ${C.coral}`,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        {n}
      </button>
    </span>
  );
};

const M1_Limits: Page = () => {
  const [sel, setSel] = useState<number[]>([]);
  const set = (n: number) => setSel((s) => [...s.filter((x) => x !== n), n]);
  const last = sel.length ? sel[sel.length - 1] : 0;
  return (
    <Frame mod={1} kind="exercice">
      <Title>Les principales limites : repérez les 5 erreurs</Title>
      <Lede>Demande : « Résume le rapport annuel 2025 de notre société. » — sans joindre le rapport. Cliquez les numéros.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1100, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px' }}>
        <Bubble who="agent" name="Assistant IA" size={25} w={960}>
          <span style={{ lineHeight: 1.7 }}>
            Bien sûr ! En 2025, votre société a{' '}
            <M1Err n={1} sel={sel} set={set}>réalisé un chiffre d’affaires de 48,3 M€, en hausse de 12,4 %</M1Err>. Selon{' '}
            <M1Err n={2} sel={sel} set={set}>une étude du cabinet Markovia de mars 2024</M1Err>, votre secteur reste porteur. Avec trois trimestres à 1,2 M€ de
            résultat, <M1Err n={3} sel={sel} set={set}>le résultat cumulé atteint 4,6 M€</M1Err>.{' '}
            <M1Err n={4} sel={sel} set={set}>Le modèle d’IA le plus récent à ce jour</M1Err> vous aidera à poursuivre cette dynamique.{' '}
            <M1Err n={5} sel={sel} set={set}>C’est certain</M1Err> : 2026 sera une année record.
          </span>
        </Bubble>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 640, width: 1100, height: 210, boxSizing: 'border-box', background: last ? T.coral.bg : T.grey.bg, borderRadius: 18, padding: '22px 30px', transition: `background 300ms ${EASE}` }}>
        {last ? (
          <div key={last} className={A.in} style={{ animationDuration: '450ms' } as CSSProperties}>
            <Eyebrow c={T.coral.fg} size={22}>
              Erreur {last} · {M1_ERRS[last - 1][0]}
            </Eyebrow>
            <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.45, color: C.ink }}>{M1_ERRS[last - 1][1]}</div>
          </div>
        ) : (
          <div style={{ fontSize: 26, color: C.muted }}>Lisez la réponse : elle a l’air parfaite. Où sont les pièges ?</div>
        )}
        <div style={{ position: 'absolute', right: 26, bottom: 18, fontFamily: display, fontWeight: 800, fontSize: 22, color: sel.length === 5 ? C.green : C.muted }}>
          {sel.length} / 5 trouvées
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1280, top: 270, width: 520, display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
        <Eyebrow c={C.coral} size={20}>
          Les limites à garder en tête
        </Eyebrow>
        {(
          [
            ['alert', 'Hallucinations : invente avec aplomb'],
            ['clock', 'Connaissances arrêtées à une date'],
            ['chart', 'Calculs et chiffres peu fiables'],
            ['scale', 'Biais hérités des données'],
            ['lock', 'Confidentialité de ce que vous collez'],
            ['humanCheck', 'Aucune responsabilité : c’est vous qui signez'],
          ] as [IconName, string][]
        ).map(([ic, t]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '12px 16px', fontSize: 22, color: C.ink }}>
            <Icon name={ic} size={26} color={C.coral} /> {t}
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ─── Calculateur : votre temps récupérable ──────────────────────────────────
const M1Slider = ({ label, value, set, min, max, step = 1, unit, tone }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontSize: 23, color: C.ink }}>
      <span>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: STRONG[tone] }}>
        {value} <span style={{ fontSize: 19, fontWeight: 600, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <div style={{ marginTop: 8 }}>
      <Range value={value} onChange={set} min={min} max={max} step={step} w={880} tone={tone} />
    </div>
  </div>
);

const M1Bar = ({ label, min, max, tone }: { label: string; min: number; max: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.soft }}>
    <span style={{ width: 150 }}>{label}</span>
    <div style={{ flex: 1, height: 18, borderRadius: 9, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, (min / Math.max(1, max)) * 100)}%`, height: '100%', background: STRONG[tone], transition: `width 400ms ${EASE}` }} />
    </div>
    <span style={{ width: 90, textAlign: 'right', fontFamily: mono, fontSize: 20 }}>{Math.round(min)} min</span>
  </div>
);

const M1_Calc: Page = () => {
  const [mails, setMails] = useState(25);
  const [meet, setMeet] = useState(5);
  const [docs, setDocs] = useState(4);
  const [search, setSearch] = useState(3);
  // Weekly minutes saved, with deliberately cautious gain hypotheses.
  const g = {
    mails: mails * 3 * 5 * 0.2,
    meet: meet * 20 * 0.5,
    docs: docs * 60 * 0.25,
    search: search * 60 * 0.25,
  };
  const total = g.mails + g.meet + g.docs + g.search;
  const max = Math.max(g.mails, g.meet, g.docs, g.search);
  const hours = total / 60;
  const days = (hours * 45) / 7;
  return (
    <Frame mod={1} kind="simu">
      <Title>Combien de temps pourriez-vous récupérer ?</Title>
      <Lede>Réglez les curseurs sur votre semaine type. Hypothèses prudentes, affichées en bas : à vous de les discuter.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 960, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <M1Slider label="Emails écrits par jour (≈ 3 min chacun)" value={mails} set={setMails} min={0} max={80} unit="/ jour" tone="blue" />
        <M1Slider label="Réunions à résumer par semaine (≈ 20 min de CR)" value={meet} set={setMeet} min={0} max={20} unit="/ sem." tone="yellow" />
        <M1Slider label="Heures de rédaction de documents par semaine" value={docs} set={setDocs} min={0} max={20} unit="h / sem." tone="green" />
        <M1Slider label="Heures de recherche d’information par semaine" value={search} set={setSearch} min={0} max={15} unit="h / sem." tone="navy" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1130, top: 270, width: 670, boxSizing: 'border-box', background: C.navy, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff', ...dl(200) }}>
        <Eyebrow c="#AEB9E6" size={19}>
          Temps potentiellement récupérable
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 10 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1 }}>{fr(hours, 1)}</span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: '#AEB9E6' }}>h / semaine</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 26, color: '#DCE3FB' }}>
          soit environ <strong style={{ color: '#fff', fontSize: 34 }}>{fr(days, 0)} jours</strong> de travail par an
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1130, top: 560, width: 670, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px', display: 'flex', flexDirection: 'column', gap: 14, ...dl(350) }}>
        <Eyebrow c={C.muted} size={18}>
          Gain par semaine, par poste
        </Eyebrow>
        <M1Bar label="Emails" min={g.mails} max={max} tone="blue" />
        <M1Bar label="Réunions" min={g.meet} max={max} tone="yellow" />
        <M1Bar label="Documents" min={g.docs} max={max} tone="green" />
        <M1Bar label="Recherche" min={g.search} max={max} tone="navy" />
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, fontSize: 19, lineHeight: 1.45, color: C.muted, ...dl(700) }}>
        Hypothèses de gain : emails −20 %, comptes rendus −50 %, documents −25 %, recherche −25 % · 45 semaines travaillées · journées de 7 h. Estimation pédagogique, pas une promesse : le gain réel dépend de la tâche et de la relecture.
      </div>
    </Frame>
  );
};

// ─── Tri : IA, ensemble ou humain ? ─────────────────────────────────────────
const M1Zone = ({ x, title, tone, icon, answer }: { x: number; title: string; tone: Tone; icon: IconName; answer: string }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 470, width: 540, height: 430, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '18px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</span>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 22, right: 22, bottom: 18, fontSize: 19, lineHeight: 1.4, color: T[tone].fg, background: '#fff', borderRadius: 12, padding: '10px 14px' }}>
      <strong>Proposition : </strong>
      {answer}
    </div>
  </div>
);

const M1_Sort: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Confier à l’IA… ou pas ? Le jeu du tri</Title>
    <Lede>Glissez chaque tâche dans une colonne (double-clic pour la remettre). Puis → pour notre proposition.</Lede>
    <M1Zone x={120} title="L’IA peut s’en charger" tone="green" icon="bot" answer="premier jet de relance, idées de titres, orthographe." />
    <M1Zone x={690} title="L’IA aide, je valide" tone="yellow" icon="humanCheck" answer="résumé de 30 pages, traduction d’une fiche, trame de contrat." />
    <M1Zone x={1260} title="Je garde la main" tone="coral" icon="user" answer="annonce sensible, décision d’augmentation, client en colère." />
    <Drag x={120} y={262} w={530} tone="grey">Premier jet d’un email de relance</Drag>
    <Drag x={690} y={262} w={530} tone="grey">Résumer un document de 30 pages</Drag>
    <Drag x={1260} y={262} w={540} tone="grey">Annoncer une mauvaise nouvelle</Drag>
    <Drag x={120} y={330} w={530} tone="grey">Traduire une fiche produit en anglais</Drag>
    <Drag x={690} y={330} w={530} tone="grey">Décider d’une augmentation de salaire</Drag>
    <Drag x={1260} y={330} w={540} tone="grey">Trouver 10 idées de titres pour un article</Drag>
    <Drag x={120} y={398} w={530} tone="grey">Rédiger la trame d’un contrat client</Drag>
    <Drag x={690} y={398} w={530} tone="grey">Corriger l’orthographe d’un rapport</Drag>
    <Drag x={1260} y={398} w={540} tone="grey">Gérer un client mécontent au téléphone</Drag>
  </Frame>
);

// ─── Comment choisir le bon outil ───────────────────────────────────────────
const M1Q = ({ n, q, children, d }: { n: number; q: string; children: ReactNode; d: number }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 22, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="violet" size={56} />
    <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 26px' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{q}</div>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: '12px 26px', alignItems: 'center', fontSize: 22, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1Arrow = () => <Icon name="arrow" size={22} color={C.faint} />;

const M1_Choose: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comment choisir le bon outil ? Trois questions</Title>
    <Lede>Dans cet ordre. La première question peut à elle seule éliminer la moitié des outils.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <M1Q n={1} q="Mes données sont-elles sensibles ?" d={0}>
        <Tag tone="coral" size={21}>Oui</Tag> <M1Arrow /> uniquement l’outil validé par mon entreprise (version professionnelle, données protégées)
        <Tag tone="green" size={21}>Non</Tag> <M1Arrow /> je peux tester librement
      </M1Q>
      <M1Q n={2} q="Où est-ce que je travaille déjà ?" d={0}>
        <span>Outlook, Word, Teams</span> <M1Arrow /> <ToolChip id="copilot" size={22} />
        <span style={{ marginLeft: 20 }}>Gmail, Docs, Drive</span> <M1Arrow /> <ToolChip id="gemini" size={22} />
        <span style={{ marginLeft: 20 }}>Ailleurs</span> <M1Arrow /> <ToolChip id="chatgpt" size={22} /> <ToolChip id="claude" size={22} />
      </M1Q>
      <M1Q n={3} q="De quoi ai-je besoin précisément ?" d={0}>
        <span>Des sources</span> <M1Arrow /> <ToolChip id="perplexity" size={22} />
        <span style={{ marginLeft: 14 }}>Mes documents</span> <M1Arrow /> <ToolChip id="notebooklm" size={22} />
        <span style={{ marginLeft: 14 }}>Traduire</span> <M1Arrow /> <ToolChip id="deepl" size={22} />
        <span style={{ marginLeft: 14 }}>Des slides</span> <M1Arrow /> <ToolChip id="gamma" size={22} />
        <span style={{ marginLeft: 14 }}>Une réunion</span> <M1Arrow /> <ToolChip id="otter" size={22} /> <ToolChip id="fireflies" size={22} />
      </M1Q>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(400) }}>
      <Callout title="Règle simple" tone="blue" icon="target" size={24}>
        Un généraliste pour 80 % des tâches, un spécialiste quand la tâche revient souvent et mérite mieux.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Lab: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Mes 5 tâches à confier à l’IA"
    defi="taches"
    who="Individuel, puis partage en binôme"
    minutes={12}
    tools={['chatgpt', 'copilot', 'gemini', 'claude']}
    objective={
      <>
        Identifier <strong>5 tâches de votre quotidien</strong> pour lesquelles l’IA pourrait vous faire gagner du temps, et estimer ce gain.
      </>
    }
    where={
      <>
        Une fiche de 5 lignes : <strong>tâche · fréquence · temps passé · verbe IA · outil pressenti</strong>. Gardez-la : elle sert à l’atelier final.
      </>
    }
    crit={
      <>
        <CheckItem id="l1-c1" size={21}>5 tâches réelles, concrètes, nommées</CheckItem>
        <CheckItem id="l1-c2" size={21}>Fréquence et temps estimés</CheckItem>
        <CheckItem id="l1-c3" size={21}>Un verbe IA et un outil par tâche</CheckItem>
        <CheckItem id="l1-c4" size={21}>Aucune tâche « à garder humaine »</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Listez seul ce qui vous prend du temps cette semaine (5 min).</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Demandez de l’aide à votre assistant avec le prompt de la page suivante.</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Gardez les 5 tâches les plus fréquentes et les moins risquées.</div>
      <div><strong style={{ color: C.navy }}>4.</strong> En binôme : chacun challenge le choix de l’autre (2 min chacun).</div>
    </div>
    <Bonus>Classez vos 5 tâches par gain estimé : la première sera votre fil rouge de l’atelier final.</Bonus>
  </LabPage>
);

const M1Row = ({ t, f, time, v, id, g, d }: { t: string; f: string; time: string; v: string; id: ToolId; g: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '1.9fr 0.9fr 0.8fr 0.9fr 1.2fr 0.7fr', alignItems: 'center', gap: 14, padding: '12px 18px', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, fontSize: 21, color: C.ink, ...dl(d) }}>
    <span style={{ fontWeight: 600 }}>{t}</span>
    <span>{f}</span>
    <span>{time}</span>
    <Tag tone="violet" size={17}>{v}</Tag>
    <ToolChip id={id} size={19} />
    <span style={{ fontFamily: display, fontWeight: 800, color: C.green }}>{g}</span>
  </div>
);

const M1_LabSheet: Page = () => (
  <Frame mod={1} kind="lab" label="Atelier 1 · Exemple et prompt d’aide">
    <Title size={46}>Exemple : la fiche de Léa, assistante commerciale</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className={A.fade} style={{ display: 'grid', gridTemplateColumns: '1.9fr 0.9fr 0.8fr 0.9fr 1.2fr 0.7fr', gap: 14, padding: '0 18px', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
        <span>Tâche</span>
        <span>Fréquence</span>
        <span>Temps</span>
        <span>Verbe</span>
        <span>Outil pressenti</span>
        <span>Gain</span>
      </div>
      <M1Row t="Répondre aux demandes de devis" f="10 / jour" time="5 min" v="Rédiger" id="copilot" g="≈ 2 h/sem" d={100} />
      <M1Row t="Compte rendu de la réunion d’équipe" f="1 / sem." time="45 min" v="Résumer" id="fireflies" g="≈ 30 min" d={180} />
      <M1Row t="Traduire les fiches produits" f="3 / sem." time="30 min" v="Traduire" id="deepl" g="≈ 1 h/sem" d={260} />
      <M1Row t="Préparer la présentation mensuelle" f="1 / mois" time="3 h" v="Créer" id="gamma" g="≈ 2 h/mois" d={340} />
      <M1Row t="Veille sur les concurrents" f="1 / sem." time="1 h" v="Rechercher" id="perplexity" g="≈ 30 min" d={420} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, ...dl(500) }}>
      <CodeDark file="Prompt d’aide · à copier dans votre assistant" size={22} wrap>
        Je suis <Hole>votre poste</Hole> dans <Hole>votre secteur</Hole>. Mes journées comprennent surtout <Hole>3 activités</Hole>.{'\n'}
        Propose-moi 15 tâches de ce type de poste pour lesquelles l’IA peut faire gagner du temps.{'\n'}
        Pour chacune : le verbe (rédiger, résumer, traduire…), un exemple de demande, et le risque si l’IA se trompe.{'\n'}
        <Cc>Présente le résultat sous forme de tableau, du gain le plus élevé au plus faible.</Cc>
      </CodeDark>
    </div>
  </Frame>
);

// ─── Quiz M1 ────────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz · Module 1</Title>
    <QuizSeries y={200}>
      <QuizQ q="Une IA générative comme ChatGPT produit sa réponse…" explain="Elle prédit, mot après mot, la suite la plus probable. Elle ne consulte pas une base de faits vérifiés.">
        <QOpt>en cherchant la bonne réponse dans une base de faits vérifiés</QOpt>
        <QOpt ok>en prédisant la suite de mots la plus probable</QOpt>
        <QOpt>en comprenant le sens comme un humain</QOpt>
      </QuizQ>
      <QuizQ q="Vous demandez « Résume notre rapport annuel » sans le joindre. Le risque principal ?" explain="Sans source, l’IA peut inventer un résumé plausible : chiffres, études, citations. C’est une hallucination.">
        <QOpt>Elle refuse toujours de répondre</QOpt>
        <QOpt ok>Elle invente un résumé plausible, avec de faux chiffres</QOpt>
        <QOpt>Elle va chercher le rapport sur votre intranet</QOpt>
      </QuizQ>
      <QuizQ q="Quelle tâche devez-vous garder humaine ?" explain="Les situations à forte charge émotionnelle ou à enjeu de décision restent humaines. L’IA peut aider à préparer, pas à annoncer.">
        <QOpt>Corriger l’orthographe d’un rapport</QOpt>
        <QOpt ok>Annoncer une mauvaise nouvelle à un collaborateur</QOpt>
        <QOpt>Proposer dix idées de titres</QOpt>
      </QuizQ>
      <QuizQ q="Vous travaillez toute la journée dans Outlook, Word et Teams. L’assistant le plus intégré ?" explain="Microsoft Copilot est intégré à l’environnement Microsoft 365 : il travaille là où sont vos emails et documents.">
        <QOpt ok>Microsoft Copilot</QOpt>
        <QOpt>Runway</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="La tâche idéale à confier en premier à l’IA est…" explain="Fréquente, répétitive, à faible risque : c’est là que le gain cumulé est le plus fort et l’erreur la moins grave.">
        <QOpt>rare, mais à très fort enjeu</QOpt>
        <QOpt ok>fréquente, répétitive et à faible risque</QOpt>
        <QOpt>confidentielle et urgente</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_GenAI, M1_How, M1_Verbs, M1_Limits, M1_Calc, M1_Sort, M1_Choose, M1_Lab, M1_LabSheet, M1_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 1 · 9:20

OBJECTIF — Annoncer le module : comprendre avant d’utiliser.

DIRE — « Avant d’ouvrir les outils, prenons vingt minutes pour comprendre ce qu’il y a sous le capot. Pas pour devenir ingénieur : pour savoir quand faire confiance à l’IA, et quand s’en méfier. Puis on cherchera ensemble où se cache votre temps perdu. »

TRANSITION — « Première question : qu’est-ce qui est nouveau avec l’IA générative ? »`,
  `⏱ 4 min · QU’EST-CE QUE L’IA GÉNÉRATIVE ? (2 clics)

OBJECTIF — Distinguer l’IA qui classe de l’IA qui crée.

DIRE — « Vous utilisez de l’IA depuis longtemps : le filtre anti-spam, le GPS qui recalcule, les recommandations de films, la détection de fraude. Toutes ces IA répondent par oui ou non, une catégorie, un score. » Clic 1. « Depuis fin 2022, une autre famille s’est imposée : l’IA générative. Elle produit du contenu nouveau — texte, image, son, vidéo. » Clic 2. « Et surtout, on lui parle en français courant. Cette demande, c’est le prompt. »

ANIMATION — Demander : « Qui a déjà utilisé l’une de ces IA classiques aujourd’hui ? » Tout le monde, en général : le filtre anti-spam.

TRANSITION — « Mais comment fait-elle pour écrire ? »`,
  `⏱ 5 min · COMMENT FONCTIONNE UN ASSISTANT (3 clics)

OBJECTIF — Faire comprendre le principe de prédiction, source de ses forces et de ses limites.

DIRE — « Prenons une phrase en cours d’écriture. » Clic 1. « Le modèle calcule pour chaque mot possible une probabilité. “Demain” est le plus probable, “Paris” très peu. » Clic 2. « Il choisit, ajoute le mot, et recommence. Des milliers de fois. C’est tout. » Clic 3. « Trois conséquences. Il a énormément lu, donc il écrit bien. Il prédit, il ne vérifie pas : un texte fluide peut être faux. Et il ne sait de vous que ce que vous lui dites : c’est pour cela que le prompt est si important. »

INSISTER — Plausible n’est pas exact. C’est la phrase à retenir du module.

TRANSITION — « Alors, que peut-on lui demander ? »`,
  `⏱ 6 min · LES 9 VERBES (interactif)

OBJECTIF — Couvrir les usages du programme : rédiger, reformuler, résumer, traduire, rechercher, analyser, créer, organiser, automatiser.

DIRE — « Neuf verbes résument presque tout ce que l’IA fait pour vous au travail. » Cliquer Rédiger : « Exemple : une relance de facture. ChatGPT, Copilot ou Claude le font très bien. » Puis Résumer, Rechercher (« ici on veut des sources : Perplexity »), Créer (« on passe aux outils visuels : Canva, Firefly »), Automatiser (« ce sera le dernier module »).

ANIMATION — Laisser le groupe choisir 3 ou 4 verbes à explorer. Poser la question du bas : quel verbe occupe le plus votre semaine ? Noter les réponses, elles serviront à l’atelier.

TRANSITION — « Mais attention : l’IA a des limites. Jouons à les repérer. »`,
  `⏱ 6 min · LES LIMITES (hotspots)

OBJECTIF — Rendre concrètes les limites : hallucination, sources fictives, calcul, date de connaissance, excès de confiance.

DIRE — « Quelqu’un a demandé à un assistant de résumer le rapport annuel de son entreprise, sans le lui fournir. Voici la réponse. Elle a l’air parfaite. Trouvez les cinq erreurs. » Laisser chercher 1 minute, puis cliquer chaque numéro au fil des propositions du groupe. « Un : les chiffres sont inventés, l’IA n’a jamais vu le rapport. Deux : le cabinet n’existe pas. Trois : trois fois 1,2, c’est 3,6, pas 4,6. Quatre : “le modèle le plus récent”, l’IA ne le sait pas. Cinq : “c’est certain” — le ton assuré ne prouve rien. »

INSISTER — À droite, les six limites à retenir. La dernière est clé : c’est vous qui signez, pas l’IA.

TRANSITION — « Ces limites posées, voyons ce que vous pouvez gagner. »`,
  `⏱ 5 min · CALCULATEUR DE TEMPS (simulateur)

OBJECTIF — Rendre tangible le gain potentiel, avec des hypothèses explicites et discutables.

DIRE — « Prenons un volontaire. Combien d’emails écrivez-vous par jour ? Combien de réunions à résumer par semaine ? » Régler les curseurs avec lui. « Avec des hypothèses volontairement prudentes, on arrive à plusieurs heures par semaine. Regardez la ligne du bas : ce sont des estimations pédagogiques. Le vrai gain dépend de la tâche, et il faut toujours compter le temps de relecture. »

ANIMATION — Faire réagir : « Ces hypothèses vous paraissent-elles réalistes pour vous ? » C’est souvent sur les comptes rendus de réunion que le gain surprend le plus.

TRANSITION — « Toutes les tâches ne se valent pas. Jouons au tri. »`,
  `⏱ 6 min · LE JEU DU TRI (glisser-déposer, 1 clic)

OBJECTIF — Distinguer ce qu’on peut confier, ce qu’on partage avec validation, ce qu’on garde.

DIRE — « Neuf tâches. Trois colonnes. Vous me dites où les mettre, je les déplace. » Faire voter le groupe pour chaque tâche et glisser. Puis clic : « Voici notre proposition. Ce qui compte, ce n’est pas la colonne exacte, c’est le raisonnement : quel est le risque si l’IA se trompe ? Une faute dans un titre : aucun. Une erreur dans un contrat : grave, donc validation. Une annonce difficile : c’est une relation humaine. »

ANIMATION — Les désaccords sont précieux : « traduire une fiche produit » peut aller en colonne 1 ou 2 selon l’enjeu commercial. Double-clic pour remettre une étiquette à sa place initiale.

TRANSITION — « Et comment choisir l’outil ? Trois questions. »`,
  `⏱ 4 min · CHOISIR LE BON OUTIL (3 clics)

OBJECTIF — Donner une méthode de choix simple et sûre.

DIRE — Clic 1 : « Première question, toujours : mes données sont-elles sensibles ? Si oui, uniquement l’outil validé par votre entreprise. » Clic 2 : « Deuxième : où je travaille déjà ? Dans Microsoft 365, Copilot. Dans Google Workspace, Gemini. Sinon, ChatGPT ou Claude. » Clic 3 : « Troisième : de quoi ai-je besoin ? Des sources : Perplexity. Interroger mes documents : NotebookLM. Traduire : DeepL. Des slides : Gamma. Une réunion : Otter ou Fireflies. »

INSISTER — La règle du bas : un généraliste pour 80 % des besoins, un spécialiste pour ce qui revient souvent.

TRANSITION — « À vous : atelier 1. »`,
  `⏱ 12 min · ATELIER 1 · MES 5 TÂCHES (minuteur)

OBJECTIF — Chaque participant identifie 5 tâches de son quotidien où l’IA peut lui faire gagner du temps.

DIRE — « Douze minutes. Cinq minutes seul : listez ce qui vous a pris du temps cette semaine. Puis utilisez votre assistant avec le prompt d’aide de la page suivante pour compléter. Gardez cinq tâches fréquentes et peu risquées. Enfin, en binôme, challengez-vous. »

ANIMATION — Afficher la page suivante pendant l’atelier. Lancer le minuteur. Passer dans les rangs : vérifier qu’aucune tâche de la colonne « je garde la main » ne s’est glissée. Cocher les critères avec un volontaire à la fin.

TRANSITION — « Gardez précieusement cette fiche : elle revient dans l’atelier final. »`,
  `⏱ (support de l’atelier 1) · EXEMPLE ET PROMPT D’AIDE

OBJECTIF — Donner un modèle rempli et un prompt prêt à l’emploi.

DIRE — « Voici la fiche de Léa, assistante commerciale. Cinq tâches, avec la fréquence, le temps, le verbe, l’outil et le gain estimé. Ses devis avec Copilot, la réunion d’équipe avec Fireflies, les traductions avec DeepL, la présentation mensuelle avec Gamma, la veille avec Perplexity. Et en bas, le prompt d’aide : remplacez les trous jaunes, collez-le dans votre assistant, il vous propose quinze tâches typiques de votre poste. »

INSISTER — Le prompt demande aussi « le risque si l’IA se trompe » : on prend déjà l’habitude de penser au contrôle.

TRANSITION — « Petit quiz pour clore le module. »`,
  `⏱ 4 min · QUIZ MODULE 1

OBJECTIF — Vérifier les acquis : principe de prédiction, hallucination, tâches à garder humaines, choix de l’outil, bonne tâche à confier.

DIRE — « Cinq questions. Votez à main levée, puis je clique. »

ANIMATION — Utiliser les numéros à droite pour naviguer. Sur chaque erreur, faire expliquer par un participant pourquoi la réponse est piégée.

TRANSITION — « Pause de quinze minutes. Ensuite : comment parler à l’IA pour obtenir ce que l’on veut. »`,
];
// @@NOTES-END
