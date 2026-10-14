// ─── Module 4 · Rechercher, analyser et exploiter l’information ─────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title="Rechercher, analyser et exploiter l’information"
    sub="Trouver vite, vérifier toujours : des outils qui citent leurs sources, et une méthode pour ne jamais prendre une réponse IA pour une information vérifiée."
    dur="45 min"
    labs={<DefiBadge defi="recherche" />}
  >
    <SecItem n={1}>Perplexity · la recherche assistée par IA</SecItem>
    <SecItem n={2}>NotebookLM · interroger ses propres documents</SecItem>
    <SecItem n={3}>Elicit et Consensus · la recherche scientifique</SecItem>
    <SecItem n={4}>Cas pratique : de la recherche à la note professionnelle</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── D’où vient la réponse ? ────────────────────────────────────────────────
const M4Src = ({ id, icon, where, good, d }: { id: ToolId; icon: IconName; where: string; good: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <ToolTile id={id} size={58} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{tool(id).short ?? tool(id).name}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: T.grey.bg, borderRadius: 14, padding: '14px 16px' }}>
      <Icon name={icon} size={38} color={tool(id).c} />
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>Il cherche dans</div>
        <div style={{ fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{where}</div>
      </div>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{good}</div>
  </div>
);

const M4_Where: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>La première question : d’où vient la réponse ?</Title>
    <Lede>Quatre outils de recherche, quatre réservoirs d’information différents. Le bon choix dépend de ce que vous cherchez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 440, display: 'flex', gap: 22 }}>
      <M4Src id="perplexity" icon="globe" where="Le web, en temps réel" good="Actualité, réglementation, marché, veille : ce qui a changé récemment." d={100} />
      <M4Src id="notebooklm" icon="folder" where="Vos documents, et eux seuls" good="Procédures, contrats, rapports internes : répondre à partir de vos sources." d={200} />
      <M4Src id="elicit" icon="book" where="Les publications scientifiques" good="Revue de littérature, extraction de données d’études, en profondeur." d={300} />
      <M4Src id="consensus" icon="flask" where="Les publications scientifiques" good="Une question fermée : que disent les études ? Oui, non, peut-être." d={400} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 750, width: 1680 }}>
      <Callout title="Le piège à éviter" tone="coral" icon="alert" size={25}>
        Un assistant sans accès au web répond <strong>de mémoire</strong> : il peut être daté, et inventer. Pour une information factuelle, choisissez un outil qui montre ses sources.
      </Callout>
    </div>
  </Frame>
);

// ─── Outil 6 · Perplexity (angle recherche) ─────────────────────────────────
const M4_Perplexity: Page = () => (
  <ToolPage
    mod={4}
    id="perplexity"
    tone="teal"
    tagline="la recherche assistée par IA"
    feats={[
      ['search', 'Recherche approfondie', 'Il lance des dizaines de recherches et livre un rapport structuré et sourcé.'],
      ['folder', 'Espaces', 'Regroupez une veille : consignes, fichiers et recherches d’un même sujet.'],
      ['filter', 'Choix des sources', 'Web, publications académiques, vos fichiers : vous orientez la recherche.'],
    ]}
    exTitle="recherche approfondie"
    prompt="Recherche approfondie : le télétravail en France aujourd’hui. Chiffres clés, tendances, débats en cours. Sources de moins de 2 ans."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="teal" size={16}>
            <Icon name="doc" size={16} /> Rapport de 4 pages
          </Tag>
          <Tag tone="teal" size={16}>
            <Icon name="link" size={16} /> Plusieurs dizaines de sources
          </Tag>
          <Tag tone="teal" size={16}>
            <Icon name="clock" size={16} /> Quelques minutes
          </Tag>
        </div>
        <M3Line icon="check" c={C.teal}>1. Qui télétravaille, et combien de jours par semaine</M3Line>
        <M3Line icon="check" c={C.teal}>2. Ce que disent les accords d’entreprise récents</M3Line>
        <M3Line icon="check" c={C.teal}>3. Effets observés : productivité, bien-être, immobilier</M3Line>
        <M3Line icon="check" c={C.teal}>4. Débats : retour au bureau, équité entre métiers</M3Line>
        <M3Line icon="alert" c={C.amber}>5. Limites : chiffres d’enquêtes aux méthodes différentes</M3Line>
      </div>
    }
    watch="Vérifiez au moins les 3 sources qui portent les chiffres clés : date, auteur, et la phrase exacte. Un rapport sourcé n’est pas un rapport vérifié."
    tip="demandez « signale les points où les sources se contredisent » : c’est souvent là que se cache l’information utile."
  />
);

// ─── Outil 7 · NotebookLM ───────────────────────────────────────────────────
const M4_NotebookLM: Page = () => (
  <ToolPage
    mod={4}
    id="notebooklm"
    tone="violet"
    tagline="interrogez vos documents"
    feats={[
      ['folder', 'Vos sources uniquement', 'PDF, Docs, sites, vidéos : il ne répond qu’à partir de ce que vous chargez.'],
      ['link', 'Citations cliquables', 'Chaque phrase renvoie au passage exact du document.'],
      ['mic', 'Résumé audio', 'Vos documents transformés en discussion façon podcast, à écouter.'],
      ['map', 'Cartes mentales et guides', 'FAQ, fiches de synthèse, chronologies générées en un clic.'],
    ]}
    exTitle="3 sources RH chargées (fictives)"
    prompt="Un salarié en télétravail peut-il se faire rembourser son abonnement internet ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <strong>Pas séparément.</strong> L’accord télétravail prévoit une indemnité forfaitaire par jour télétravaillé, qui couvre les frais de connexion
          <Src n={1} />. Le guide des notes de frais exclut tout remboursement distinct de l’abonnement
          <Src n={2} />.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="violet" size={16}>1 · Accord télétravail, art. 6</Tag>
          <Tag tone="violet" size={16}>2 · Guide notes de frais, p. 4</Tag>
        </div>
        <div style={{ fontSize: 18, color: C.muted }}>Le règlement intérieur ne traite pas cette question.</div>
      </div>
    }
    watch="Il ne connaît que vos sources : si elles sont obsolètes ou incomplètes, la réponse aussi. Documents internes : uniquement avec un compte professionnel autorisé."
    tip="le « résumé audio » transforme 50 pages en 10 minutes d’écoute : idéal pour découvrir un dossier dans les transports."
  />
);

// ─── Outil 8 · Elicit ───────────────────────────────────────────────────────
const M4Row = ({ cells, head = false }: { cells: string[]; head?: boolean }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr 1.4fr',
      gap: 12,
      padding: '7px 10px',
      fontSize: head ? 15 : 18,
      fontWeight: head ? 700 : 400,
      letterSpacing: head ? '0.08em' : 0,
      textTransform: head ? 'uppercase' : 'none',
      color: head ? C.muted : C.ink,
      background: head ? 'transparent' : T.grey.bg,
      borderRadius: 8,
    }}
  >
    {cells.map((c) => (
      <span key={c}>{c}</span>
    ))}
  </div>
);

const M4_Elicit: Page = () => (
  <ToolPage
    mod={4}
    id="elicit"
    tone="green"
    tagline="l’assistant de recherche scientifique"
    feats={[
      ['search', 'Recherche par question', 'Posez une question, il trouve les articles scientifiques pertinents.'],
      ['table', 'Extraction en tableau', 'Population, méthode, résultats : une colonne par information, une ligne par étude.'],
      ['layers', 'Synthèse des résultats', 'Un résumé des principaux constats, avec lien vers chaque article.'],
    ]}
    exTitle="revue de littérature"
    prompt="Quels sont les effets du télétravail sur la productivité ? Extrais : population, méthode, résultat principal."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M4Row head cells={['Étude', 'Population', 'Résultat principal']} />
        <M4Row cells={['Étude A · 2021', 'Centre d’appels', 'Productivité en hausse']} />
        <M4Row cells={['Étude B · 2023', 'Ingénieurs', 'Effet neutre, moins de départs']} />
        <M4Row cells={['Étude C · 2022', 'Enquête multi-secteurs', 'Variable selon le métier']} />
        <div style={{ fontSize: 16, color: C.faint }}>Illustration : études et résultats fictifs.</div>
      </div>
    }
    watch="Corpus surtout anglophone et académique. Une étude n’est pas une vérité : lisez au moins le résumé des articles clés avant de citer un résultat."
    tip="posez la question en anglais pour des résultats plus complets, puis demandez la synthèse en français."
  />
);

// ─── Outil 9 · Consensus ────────────────────────────────────────────────────
const M4Meter = ({ label, pct, c }: { label: string; pct: number; c: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 19 }}>
    <span style={{ width: 120 }}>{label}</span>
    <div style={{ flex: 1, height: 20, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
      <div className={b.grow(1)} style={{ width: `${pct}%`, height: '100%', background: c, ...dl(300) }} />
    </div>
    <span style={{ width: 54, textAlign: 'right', fontFamily: mono, fontSize: 18 }}>{pct} %</span>
  </div>
);

const M4_Consensus: Page = () => (
  <ToolPage
    mod={4}
    id="consensus"
    tone="yellow"
    tagline="ce que disent les études"
    feats={[
      ['flask', 'Réponses issues de la science', 'Il cherche uniquement dans des publications scientifiques évaluées par des pairs.'],
      ['gauge', 'Le « Consensus Meter »', 'Pour une question oui / non : la répartition des études qui disent oui, non, peut-être.'],
      ['filter', 'Filtres de qualité', 'Méta-analyses, essais contrôlés, année, domaine : on trie les preuves.'],
    ]}
    exTitle="question fermée"
    prompt="Les pauses courtes et régulières améliorent-elles la concentration au travail ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M4Meter label="Oui" pct={68} c={C.green} />
        <M4Meter label="Peut-être" pct={21} c={C.yellow} />
        <M4Meter label="Non" pct={11} c={C.coral} />
        <div style={{ fontSize: 19, lineHeight: 1.4 }}>La majorité des études trouvent un effet positif, surtout sur la fatigue ; les effets sur la performance varient.</div>
        <div style={{ fontSize: 16, color: C.faint }}>Illustration : répartition fictive.</div>
      </div>
    }
    watch="Le compteur additionne des études, il ne pèse pas leur qualité : une méta-analyse vaut plus que dix petites études. Ouvrez les plus citées."
    tip="filtrez sur « méta-analyses » et « revues systématiques » : vous obtenez directement les synthèses les plus solides."
  />
);

// ─── Méthode : 4 questions avant de croire ──────────────────────────────────
const M4Check = ({ n, icon, q, children }: { n: number; icon: IconName; q: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${C.navy}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone="navy" size={50} />
      <IconTile name={icon} tone="navy" size={50} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{q}</div>
    <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M4_Method: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>Quatre questions avant de croire une réponse IA</Title>
    <Lede>Trente secondes par affirmation importante. C’est le prix d’une note que l’on peut signer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      <M4Check n={1} icon="user" q="Qui ?">
        Qui parle ? Un organisme officiel, un média, un chercheur… ou une entreprise qui vend quelque chose ?
      </M4Check>
      <M4Check n={2} icon="calendar" q="Quand ?">
        De quand date la source ? Une règle de 2019 a peut-être changé depuis.
      </M4Check>
      <M4Check n={3} icon="eye" q="Quoi ?">
        La source dit-elle vraiment ce que l’IA affirme ? Lisez la phrase, pas le résumé.
      </M4Check>
      <M4Check n={4} icon="layers" q="Recoupé ?">
        Une deuxième source indépendante dit-elle la même chose ?
      </M4Check>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Règle de la journée" tone="coral" icon="shieldCheck" size={25}>
        Une réponse IA, même sourcée, est une <strong>piste</strong>. Elle devient une <strong>information</strong> quand vous l’avez vérifiée.
      </Callout>
    </div>
  </Frame>
);

// ─── Jeu : fiable ou pas ? ──────────────────────────────────────────────────
const M4Flip = ({ src, kind, verdict, ok, d }: { src: string; kind: string; verdict: string; ok: 'ok' | 'mid' | 'ko'; d: number }) => (
  <FlipCard
    w={530}
    h={250}
    cls={A.in}
    style={dl(d)}
    tone="navy"
    backTone={ok === 'ok' ? 'green' : ok === 'mid' ? 'yellow' : 'coral'}
    front={
      <>
        <Eyebrow c={C.muted} size={16}>
          {kind}
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.35, fontWeight: 600, color: C.ink }}>{src}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={ok === 'ok' ? T.green.fg : ok === 'mid' ? T.yellow.fg : T.coral.fg} size={20}>
          {ok === 'ok' ? '✓ Fiable' : ok === 'mid' ? '≈ À recouper' : '✗ Insuffisant seul'}
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{verdict}</div>
      </>
    }
  />
);

const M4_Game: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Fiable, à recouper, ou insuffisant ?</Title>
    <Lede>Perplexity vous cite ces six sources. Votez pour chacune, puis retournez la carte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', gap: 45, rowGap: 30 }}>
      <M4Flip d={100} kind="Site officiel" src="Une page service-public.fr mise à jour le mois dernier" ok="ok" verdict="Source officielle et récente : la référence pour une règle. Vérifiez quand même la date d’entrée en vigueur." />
      <M4Flip d={180} kind="Presse" src="Un article de grand quotidien… de 2019" ok="mid" verdict="Média sérieux, mais daté : la situation a pu changer. Cherchez une source plus récente." />
      <M4Flip d={260} kind="Blog d’entreprise" src="« 10 chiffres clés » sur le blog d’un éditeur de logiciel" ok="ko" verdict="Contenu marketing : chiffres souvent sans méthode, et un intérêt à vendre. Remontez à l’étude d’origine." />
      <M4Flip d={340} kind="Forum" src="Une discussion très populaire sur un forum d’entraide" ok="ko" verdict="Témoignages utiles pour comprendre un problème, jamais pour établir un fait ou une règle." />
      <M4Flip d={420} kind="Étude scientifique" src="Une méta-analyse publiée dans une revue à comité de lecture" ok="ok" verdict="Le plus haut niveau de preuve : elle synthétise de nombreuses études. Lisez au moins le résumé." />
      <M4Flip d={500} kind="Communiqué" src="Le communiqué de presse d’une entreprise sur ses résultats" ok="mid" verdict="Fiable sur ce que dit l’entreprise d’elle-même, pas sur ce qu’en pensent les autres. À recouper." />
    </div>
  </Frame>
);

// ─── Cas pratique ───────────────────────────────────────────────────────────
const M4Pipe = ({ steps }: { steps: [string, ToolId[]][] }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
    {steps.map(([s, ids], i) => (
      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: T.navy.bg, borderRadius: 12, padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 19, color: C.navy }}>{s}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {ids.map((id) => (
              <ToolTile key={id} id={id} size={26} />
            ))}
          </div>
        </div>
        {i < steps.length - 1 ? <Icon name="arrow" size={22} color={C.faint} /> : null}
      </div>
    ))}
  </div>
);

const M4_Lab: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="De la recherche à la note professionnelle"
    defi="recherche"
    who="Binômes"
    minutes={20}
    tools={['perplexity', 'notebooklm', 'claude', 'copilot']}
    label="Module 4 · Cas pratique"
    objective={
      <>
        Produire une <strong>note d’une page</strong>, vérifiée et sourcée, à partir de plusieurs sources : recherche → vérification → synthèse → note.
      </>
    }
    where={
      <>
        La note d’une page (modèle page suivante) et la <strong>fiche de vérification</strong> : chaque affirmation clé avec sa source et son statut.
      </>
    }
    crit={
      <>
        <CheckItem id="l4-c1" size={21}>Au moins 3 sources ouvertes et lues</CheckItem>
        <CheckItem id="l4-c2" size={21}>Chaque chiffre a sa source datée</CheckItem>
        <CheckItem id="l4-c3" size={21}>Une affirmation écartée et pourquoi</CheckItem>
        <CheckItem id="l4-c4" size={21}>La note tient sur une page</CheckItem>
      </>
    }
  >
    <div>
      <strong style={{ color: C.navy }}>Le sujet :</strong> votre direction RH se demande si elle doit proposer le <strong>forfait mobilités durables</strong> aux salariés. Que dit la règle,
      combien ça coûte, qui l’a fait ?
    </div>
    <M4Pipe
      steps={[
        ['Rechercher', ['perplexity']],
        ['Vérifier', ['perplexity']],
        ['Synthétiser', ['notebooklm']],
        ['Rédiger', ['claude', 'copilot']],
      ]}
    />
    <div style={{ marginTop: 12, fontSize: 21 }}>
      Étape 3 : chargez dans NotebookLM <strong>uniquement les sources vérifiées</strong>, puis interrogez-les.
    </div>
  </LabPage>
);

// ─── Fiche de vérification (interactive) ────────────────────────────────────
const M4_KINDS = ['Officiel', 'Presse', 'Étude', 'Blog', 'Forum'];
const M4_STATES: { t: string; tone: Tone; icon: IconName }[] = [
  { t: 'À vérifier', tone: 'grey', icon: 'eye' },
  { t: 'Confirmé', tone: 'green', icon: 'check' },
  { t: 'Incertain', tone: 'yellow', icon: 'alert' },
  { t: 'Écarté', tone: 'coral', icon: 'x' },
];

const M4Cycle = ({ label, tone, icon, onClick, w }: { label: string; tone: Tone; icon?: IconName; onClick: () => void; w: number }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{ width: w, height: 52, border: 'none', borderRadius: 12, cursor: 'pointer', background: T[tone].bg, color: T[tone].fg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: body, fontWeight: 700, fontSize: 20 }}
  >
    {icon ? <Icon name={icon} size={22} sw={2.6} /> : null}
    {label}
  </button>
);

const M4_Sheet: Page = () => {
  const [kind, setKind] = useState<Record<number, number>>({});
  const [st, setSt] = useState<Record<number, number>>({});
  const rows = [1, 2, 3, 4, 5];
  const done = rows.filter((r) => (st[r] ?? 0) !== 0).length;
  return (
    <Frame mod={4} kind="lab" label="Cas pratique · Fiche de vérification">
      <Title size={46}>La fiche de vérification</Title>
      <Lede top={164}>Une ligne par affirmation clé. Cliquez le type de source, puis le statut, pour la faire évoluer en direct.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 220px', gap: 16, padding: '4px 0 12px', borderBottom: `2px solid ${C.rule}`, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
          <span>N°</span>
          <span>Affirmation · source · date</span>
          <span style={{ textAlign: 'center' }}>Type de source</span>
          <span style={{ textAlign: 'center' }}>Statut</span>
        </div>
        {rows.map((r) => {
          const s = M4_STATES[st[r] ?? 0];
          return (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 220px', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: `1.5px solid ${C.panel}` }}>
              <Num n={r} tone="navy" size={40} />
              <div style={{ height: 52, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 20, color: C.faint }}>
                « … » · nom du site ou du document · date de publication
              </div>
              <M4Cycle w={200} label={M4_KINDS[kind[r] ?? 0]} tone="navy" onClick={() => setKind((o) => ({ ...o, [r]: ((o[r] ?? 0) + 1) % M4_KINDS.length }))} />
              <M4Cycle w={220} label={s.t} tone={s.tone} icon={s.icon} onClick={() => setSt((o) => ({ ...o, [r]: ((o[r] ?? 0) + 1) % M4_STATES.length }))} />
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: C.muted, ...dl(500) }}>
        <Icon name="checkCircle" size={26} color={done === 5 ? C.green : C.faint} />
        {done} affirmation{done > 1 ? 's' : ''} sur 5 traitée{done > 1 ? 's' : ''} · seules les affirmations « Confirmé » entrent dans la note.
      </div>
    </Frame>
  );
};

// ─── Modèle de note professionnelle ─────────────────────────────────────────
const M4Part = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="blue" size={40} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.navy }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Note: Page = () => (
  <Frame mod={4} kind="lab" label="Cas pratique · Modèle de note">
    <Title size={46}>Le modèle de note d’une page</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Part n={1} title="Objet" d={100}>
        La question posée, en une phrase.
      </M4Part>
      <M4Part n={2} title="L’essentiel en 3 points" d={180}>
        Ce que le lecteur doit retenir s’il ne lit que ça.
      </M4Part>
      <M4Part n={3} title="Éléments clés" d={260}>
        Règle, coûts, exemples : chaque chiffre avec sa source.
      </M4Part>
      <M4Part n={4} title="Recommandation" d={340}>
        Ce que vous proposez, et la prochaine étape.
      </M4Part>
      <M4Part n={5} title="Sources et limites" d={420}>
        Liste datée des sources ; ce qui reste incertain.
      </M4Part>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 930, top: 190, width: 870, ...dl(300) }}>
      <CodeDark file="Prompt de rédaction · dans NotebookLM ou votre assistant" size={21} wrap>
        Tu es chargé d’études RH. À partir <Cs>uniquement des sources fournies</Cs>, rédige une note d’une page pour la directrice des ressources humaines sur le forfait mobilités durables.{'\n\n'}
        Structure : objet · l’essentiel en 3 points · éléments clés · recommandation · sources et limites.{'\n\n'}
        Cite la source de chaque chiffre. <Cs>Si une information manque, écris « non trouvé dans les sources »</Cs>. 350 mots maximum.
      </CodeDark>
      <Callout title="Dernier contrôle" tone="coral" icon="eye" cls={A.fade} style={{ marginTop: 22, ...dl(700) }} size={22}>
        Relisez chaque chiffre de la note face à votre fiche de vérification : ce n’est pas l’IA qui signe, c’est vous.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M4 ────────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <Frame mod={4} kind="quiz">
    <Title>Quiz · Module 4</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous voulez interroger uniquement le règlement intérieur et l’accord télétravail de votre entreprise. Quel outil ?" explain="NotebookLM répond uniquement à partir des documents que vous lui donnez, avec des citations vers le passage exact.">
        <QOpt>Consensus</QOpt>
        <QOpt ok>NotebookLM</QOpt>
        <QOpt>Runway</QOpt>
      </QuizQ>
      <QuizQ q="Perplexity cite 5 sources dans sa réponse. Vous pouvez donc…" explain="Une source citée doit être ouverte et lue : vérifier qui parle, la date, et que la phrase dit bien ce qui est affirmé.">
        <QOpt>copier la réponse : elle est vérifiée</QOpt>
        <QOpt ok>ouvrir les sources clés et vérifier ce qu’elles disent vraiment</QOpt>
        <QOpt>citer Perplexity comme source dans votre note</QOpt>
      </QuizQ>
      <QuizQ q="« Les études montrent-elles que X améliore Y ? » Quel outil donne une répartition oui / non / peut-être ?" explain="Le Consensus Meter de Consensus montre la répartition des conclusions des études sur une question fermée.">
        <QOpt ok>Consensus</QOpt>
        <QOpt>Gamma</QOpt>
        <QOpt>DeepL</QOpt>
      </QuizQ>
      <QuizQ q="Quelle source est la plus fiable pour une règle administrative ?" explain="Un site officiel à jour fait foi pour une règle ; les blogs commerciaux et forums ne suffisent jamais seuls.">
        <QOpt>Un forum très fréquenté</QOpt>
        <QOpt>Le blog d’un éditeur de logiciel</QOpt>
        <QOpt ok>Un site officiel mis à jour récemment</QOpt>
      </QuizQ>
      <QuizQ q="Elicit vous extrait un résultat d’étude intéressant. Avant de le citer…" explain="Une étude isolée n’est pas une vérité : on lit au moins le résumé de l’article pour vérifier le contexte, la population et la méthode.">
        <QOpt ok>vous lisez au moins le résumé de l’article</QOpt>
        <QOpt>vous le citez : Elicit ne se trompe jamais</QOpt>
        <QOpt>vous le traduisez dans DeepL</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Where, M4_Perplexity, M4_NotebookLM, M4_Elicit, M4_Consensus, M4_Method, M4_Game, M4_Lab, M4_Sheet, M4_Note, M4_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 4 · 13:30

OBJECTIF — Lancer l’après-midi sur la recherche d’information (outils n° 6 à 9).

DIRE — « Bon retour ! Cet après-midi, on produit. Et on commence par l’information : la trouver vite, et surtout la vérifier. Quatre outils : Perplexity, NotebookLM, Elicit et Consensus. Et une règle qui va nous suivre tout le module : une réponse IA n’est pas une information vérifiée. »

TRANSITION — « Première question à se poser : d’où vient la réponse ? »`,
  `⏱ 3 min · D’OÙ VIENT LA RÉPONSE ? (1 clic)

OBJECTIF — Distinguer les réservoirs d’information : web, vos documents, publications scientifiques.

DIRE — « Perplexity cherche sur le web, en temps réel : parfait pour l’actualité et la réglementation. NotebookLM ne cherche que dans vos documents : parfait pour vos procédures. Elicit et Consensus cherchent dans les publications scientifiques : l’un pour creuser en profondeur, l’autre pour une réponse rapide à une question fermée. » Clic : « Et le piège : un assistant sans accès au web répond de mémoire. »

TRANSITION — « Perplexity, cette fois côté recherche. »`,
  `⏱ 4 min · OUTIL 6 · PERPLEXITY RECHERCHE (2 clics)

OBJECTIF — La recherche assistée par IA : recherche approfondie, espaces, choix des sources.

DIRE — « Ce matin, on a vu Perplexity comme assistant. Sa vraie force est la recherche approfondie : il lance des dizaines de recherches et livre un rapport structuré. Exemple : le télétravail en France. » Clic 1 : « Un rapport de quatre pages, plusieurs dizaines de sources, en quelques minutes. Remarquez le point 5 : il signale lui-même les limites. » Clic 2 : « Vigilance : vérifiez au moins les trois sources qui portent les chiffres clés. »

ASTUCE — Demander où les sources se contredisent.

TRANSITION — « Et quand l’information est dans vos propres documents ? »`,
  `⏱ 5 min · OUTIL 7 · NOTEBOOKLM (2 clics)

OBJECTIF — Analyse et interrogation de ses propres documents.

DIRE — « NotebookLM, de Google, fonctionne à l’envers des autres : il ne répond qu’à partir des documents que vous chargez. Résultat : beaucoup moins d’inventions, et chaque phrase renvoie au passage exact. Exemple : trois documents RH fictifs. » Clic 1 : « La réponse est nuancée, sourcée, et il dit aussi ce que les documents ne traitent pas. » Clic 2 : « Vigilance : si vos documents sont obsolètes, la réponse l’est aussi. Et les documents internes uniquement avec un compte professionnel autorisé. »

ANIMATION — Si possible, démo du résumé audio : c’est souvent le « effet waouh » de la journée.

TRANSITION — « Pour aller dans la recherche scientifique : Elicit. »`,
  `⏱ 3 min · OUTIL 8 · ELICIT (2 clics)

OBJECTIF — Recherche et synthèse de publications et informations spécialisées.

DIRE — « Elicit est un assistant de recherche scientifique. On pose une question, il trouve les articles pertinents et, surtout, il extrait les informations dans un tableau : population, méthode, résultat. Ce qui prenait des jours de lecture prend une heure. » Clic 1 : « Ici un exemple illustratif, avec des études fictives. » Clic 2 : « Vigilance : corpus surtout anglophone, et une étude n’est pas une vérité. »

ADAPTER — Pour un public non chercheur, présenter Elicit comme l’outil des études de marché, des dossiers RH ou santé au travail où l’on veut s’appuyer sur des preuves.

TRANSITION — « Et pour une réponse rapide fondée sur la science : Consensus. »`,
  `⏱ 3 min · OUTIL 9 · CONSENSUS (2 clics)

OBJECTIF — Recherche d’informations issues de travaux scientifiques.

DIRE — « Consensus répond à une question à partir de publications scientifiques. Son outil phare : le Consensus Meter, qui montre combien d’études disent oui, non, peut-être. » Clic 1 : « Ici, la majorité dit oui — répartition illustrative. » Clic 2 : « Mais attention : le compteur additionne les études sans peser leur qualité. Une méta-analyse vaut plus que dix petites études. »

TRANSITION — « Vous avez des outils qui citent leurs sources. Reste à vérifier. Méthode. »`,
  `⏱ 4 min · QUATRE QUESTIONS (5 clics)

OBJECTIF — Donner une méthode simple de vérification.

DIRE — Clic par clic : « Qui parle ? Quand ? La source dit-elle vraiment ça ? Est-ce recoupé ? Trente secondes par affirmation importante. » Clic 5 : « Et la règle : une réponse IA, même sourcée, est une piste. Elle devient une information quand vous l’avez vérifiée. »

INSISTER — C’est l’objectif explicite du module : ne pas considérer automatiquement une réponse IA comme une information vérifiée.

TRANSITION — « Entraînons-nous. »`,
  `⏱ 5 min · FIABLE OU PAS ? (cartes)

OBJECTIF — Exercer le jugement sur le type de source.

DIRE — « Perplexity vous cite ces six sources. Pour chacune : fiable, à recouper, ou insuffisant seul ? Votez, je retourne. »

ANIMATION — Les cartes « presse 2019 » et « communiqué » provoquent souvent des débats : c’est l’objectif. Rappeler la question « Quand ? ».

TRANSITION — « À vous : le cas pratique. »`,
  `⏱ 20 min · CAS PRATIQUE · NOTE PROFESSIONNELLE (minuteur)

OBJECTIF — Recherche → vérification → synthèse → production d’une note professionnelle.

DIRE — « Le sujet : votre DRH se demande s’il faut proposer le forfait mobilités durables. Étape 1 : recherchez avec Perplexity. Étape 2 : vérifiez avec la fiche de vérification, ouvrez au moins trois sources. Étape 3 : chargez uniquement les sources vérifiées dans NotebookLM et interrogez-les. Étape 4 : rédigez la note d’une page avec le modèle. »

ANIMATION — Lancer le minuteur. Le point clé à observer : est-ce que les binômes écartent des sources ? Valoriser publiquement un binôme qui a écarté une affirmation non confirmée.

TRANSITION — « La fiche de vérification. »`,
  `⏱ (support du cas pratique) · FICHE DE VÉRIFICATION (interactive)

OBJECTIF — Donner un outil de traçabilité.

DIRE — « Une ligne par affirmation clé. Le type de source, et le statut : à vérifier, confirmé, incertain, écarté. Seules les affirmations confirmées entrent dans la note. »

ANIMATION — Remplir en direct avec un binôme pendant la restitution : cliquer type et statut selon ce qu’il annonce.

TRANSITION — « Et le modèle de note. »`,
  `⏱ (support du cas pratique) · MODÈLE DE NOTE

OBJECTIF — Fournir une structure de note et un prompt de rédaction.

DIRE — « Cinq parties : objet, l’essentiel en trois points, éléments clés sourcés, recommandation, sources et limites. Le prompt à droite impose deux choses : n’utiliser que les sources fournies, et écrire “non trouvé dans les sources” plutôt qu’inventer. Et le dernier contrôle : relire chaque chiffre face à la fiche. »

TRANSITION — « Quiz du module 4. »`,
  `⏱ 4 min · QUIZ MODULE 4

OBJECTIF — Vérifier : choix de l’outil selon la source, vérification, Consensus Meter, fiabilité des sources, lecture des études.

DIRE — « Cinq questions. »

TRANSITION — « On a trouvé l’information. Maintenant, rédigeons plus vite et mieux. »`,
];
// @@NOTES-END
