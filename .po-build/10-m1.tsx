// ─── Module 1 · Comprendre l’IA ─────────────────────────────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title="Comprendre l’IA"
    sub="Définitions, familles de modèles, cas d’usage : le vocabulaire minimal pour dialoguer avec une équipe data."
    dur="60 min"
    labs={
      <>
        <Tag tone="green" size={20}>
          Exercice · quelle famille ?
        </Tag>
        <Tag tone="violet" size={20}>
          QCM 1 & 2
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Écrire des règles ou apprendre d’exemples : ce qui change</SecItem>
    <SecItem n={2}>IA, machine learning, deep learning, IA générative</SecItem>
    <SecItem n={3}>Les familles de modèles et leurs cas d’usage</SecItem>
    <SecItem n={4}>Comment « pense » un LLM, et pourquoi c’est important pour vous</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Règles vs apprentissage ────────────────────────────────────────────────
const M1Fail = ({ label, d }: { label: string; d: number }) => (
  <div className={b.on(1)} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, ...dl(d) }}>
    <span style={{ fontFamily: mono, color: C.ink }}>{label}</span>
    <FlowArrow w={50} />
    <Tag tone="coral" size={20}>
      <Icon name="x" size={18} sw={3} /> aucune règle
    </Tag>
  </div>
);

const M1_Rules: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Écrire des règles… ou apprendre d’exemples ?</Title>
    <Lede>Le besoin B2 : proposer automatiquement la catégorie d’une dépense. Deux façons de s’y prendre.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Card tone="grey" icon="code" title="Programmer des règles" style={{ height: 490 }}>
        <Code size={21} style={{ marginTop: 4 }}>
          <Jk>SI</Jk> commerçant contient <Js>"SNCF"</Js> → Transport{'\n'}
          <Jk>SI</Jk> commerçant contient <Js>"Hôtel"</Js> → Hébergement{'\n'}
          <Jk>SI</Jk> montant {'<'} <Jn>25 €</Jn> <Jk>ET</Jk> 12h–14h → Repas{'\n'}
          <Jc>… 412 règles plus tard</Jc>
        </Code>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <M1Fail label="OUIGO 29,00 €" d={0} />
          <M1Fail label="Trainline 34,50 €" d={150} />
          <M1Fail label="Brasserie, 19h40" d={300} />
        </div>
      </Card>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1000, top: 270, width: 800 }}>
      <Card tone="blue" icon="brain" title="Apprendre à partir d’exemples" style={{ height: 490 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
          <div style={{ flex: 1, background: T.blue.bg, borderRadius: 14, padding: '16px 18px', fontSize: 22, lineHeight: 1.35, color: C.ink }}>
            <strong>50 000 dépenses</strong> déjà classées par les comptables
          </div>
          <FlowArrow w={56} color={C.blue} />
          <div style={{ flex: 'none', background: G.blue, color: '#fff', borderRadius: 14, padding: '16px 20px', fontFamily: display, fontWeight: 700, fontSize: 24 }}>
            Modèle
          </div>
        </div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: mono }}>Trainline 34,50 €</span>
            <FlowArrow w={50} color={C.blue} />
            <Tag tone="green" size={20}>Transport · 92 %</Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: mono }}>Brasserie, 19h40</span>
            <FlowArrow w={50} color={C.blue} />
            <Tag tone="yellow" size={20}>Repas · 64 %</Tag>
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.4, color: C.muted }}>
          Personne n’a écrit « Trainline = Transport » : le modèle l’a déduit des exemples… avec un niveau de confiance.
        </div>
      </Card>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout title="Définition de travail" tone="violet" icon="bulb">
        Une IA « moderne » est un système qui <strong>apprend à partir de données</strong> à produire une prédiction ou un
        contenu. Elle ne suit pas des règles écrites : elle généralise… et peut donc se tromper.
      </Callout>
    </div>
  </Frame>
);

// ─── IA ⊃ ML ⊃ DL ⊃ IA générative ───────────────────────────────────────────
const M1Ring = ({ r, label, tone, n, mid = false, cy0 = 700 }: { r: number; label: string; tone: Tone; n?: number; mid?: boolean; cy0?: number }) => (
  <g className={n ? b.pop(n) : undefined} style={vars({ o: 'center bottom' })}>
    <circle cx={380} cy={cy0 - r} r={r} fill={T[tone].bg} stroke={STRONG[tone]} strokeWidth={4} />
    <text x={380} y={mid ? cy0 - r + 9 : cy0 - 2 * r + 62} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 24, fill: T[tone].fg }}>
      {label}
    </text>
  </g>
);

const M1Def = ({ tone, name, children, ex, cls, d = 0 }: { tone: Tone; name: string; children: ReactNode; ex: string; cls?: string; d?: number }) => (
  <div className={cls} style={{ display: 'flex', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '12px 22px', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{name}</div>
      <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.35, color: C.ink }}>{children}</div>
      <div style={{ marginTop: 4, fontSize: 19, color: C.muted }}>
        <Icon name="cart" size={18} color={C.muted} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
        {ex}
      </div>
    </div>
  </div>
);

const M1_Nested: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>IA, machine learning, deep learning, IA générative</Title>
    <Lede>Des poupées russes : chaque terme est un cas particulier du précédent.</Lede>
    <svg className={A.fade} width={760} height={720} viewBox="0 0 760 720" style={{ position: 'absolute', left: 100, top: 250 }}>
      <M1Ring r={340} label="Intelligence artificielle" tone="navy" />
      <M1Ring r={262} label="Machine learning" tone="blue" n={1} />
      <M1Ring r={186} label="Deep learning" tone="violet" n={2} />
      <M1Ring r={112} label="IA générative" tone="pink" n={3} mid />
    </svg>
    <div style={{ position: 'absolute', left: 900, top: 250, width: 900, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M1Def tone="navy" name="Intelligence artificielle" ex="Un moteur de règles anti-doublons" cls={A.right}>
        Tout système qui réalise une tâche qu’on associe à l’intelligence humaine, y compris avec des règles écrites.
      </M1Def>
      <M1Def tone="blue" name="Machine learning" ex="B2 · proposer la catégorie de dépense" cls={b.left(1)}>
        Le système <strong>apprend des exemples</strong> au lieu de suivre des règles écrites à la main.
      </M1Def>
      <M1Def tone="violet" name="Deep learning" ex="B1 · lire un ticket photographié" cls={b.left(2)}>
        Apprentissage par réseaux de neurones profonds : excelle sur les images, le son, le texte.
      </M1Def>
      <M1Def tone="pink" name="IA générative" ex="B8 · rédiger le résumé mensuel du DAF" cls={b.left(3)}>
        Des modèles qui <strong>produisent du contenu nouveau</strong> : texte, image, code. Les LLM en font partie.
      </M1Def>
    </div>
  </Frame>
);

// ─── Entraînement vs inférence ──────────────────────────────────────────────
const M1Box = ({ icon, tone, title, sub, solid = false }: { icon: IconName; tone: Tone; title: string; sub: string; solid?: boolean }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, background: solid ? STRONG[tone] : C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <IconTile name={icon} tone={tone} size={54} solid={!solid} style={solid ? { background: 'rgba(255,255,255,.18)' } : undefined} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: solid ? '#fff' : C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.3, color: solid ? 'rgba(255,255,255,.85)' : C.muted }}>{sub}</div>
    </div>
  </div>
);

const M1Lane = ({ label, tone, children, cls, d = 0 }: { label: string; tone: Tone; children: ReactNode; cls?: string; d?: number }) => (
  <div className={cls} style={{ ...dl(d) }}>
    <Eyebrow c={T[tone].fg} size={20} style={{ marginBottom: 10 }}>
      {label}
    </Eyebrow>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>{children}</div>
  </div>
);

const M1Take = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ flex: 1 }}>
    <Card tone={tone} icon={icon} title={title} size={23} style={{ height: '100%' }}>
      {children}
    </Card>
  </div>
);

const M1_Learn: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Deux moments dans la vie d’un modèle</Title>
    <Lede>Comprendre cette distinction évite la moitié des malentendus avec l’équipe data.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M1Lane label="1 · Entraînement — une fois, puis à intervalles réguliers" tone="violet" cls={A.in}>
        <M1Box icon="database" tone="violet" title="Données historiques" sub="50 000 dépenses étiquetées" />
        <FlowArrow w={60} color={C.violet} />
        <M1Box icon="gear" tone="violet" title="Apprentissage" sub="le modèle ajuste ses paramètres" />
        <FlowArrow w={60} color={C.violet} />
        <M1Box icon="brain" tone="violet" title="Modèle" sub="un fichier, versionné" solid />
      </M1Lane>
      <M1Lane label="2 · Inférence — à chaque utilisation, en production" tone="blue" cls={b.on(1)}>
        <M1Box icon="barcode" tone="blue" title="Nouvelle dépense" sub="Trainline · 34,50 €" />
        <FlowArrow w={60} color={C.blue} />
        <M1Box icon="brain" tone="blue" title="Modèle" sub="quelques millisecondes" solid />
        <FlowArrow w={60} color={C.blue} />
        <M1Box icon="target" tone="blue" title="Prédiction" sub="Transport · confiance 92 %" />
      </M1Lane>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24 }}>
      <M1Take icon="eye" tone="teal" title="Il ne sait que ce qu’il a vu">
        Un nouveau type de dépense, un nouveau pays : sans exemples, il devine.
      </M1Take>
      <M1Take icon="gauge" tone="yellow" title="Il répond toujours">
        Même quand il ne sait pas. D’où l’importance du score de confiance.
      </M1Take>
      <M1Take icon="clock" tone="coral" title="Il vieillit">
        Les usages changent, les données dérivent : il faut le surveiller et le ré-entraîner.
      </M1Take>
    </div>
  </Frame>
);

// ─── Les familles de modèles ────────────────────────────────────────────────
const FAMILIES: { icon: IconName; tone: Tone; name: string; q: string; ex: string; spendo: string }[] = [
  { icon: 'layers', tone: 'blue', name: 'Classer', q: 'Dans quelle case ?', ex: 'Filtre anti-spam, tri des demandes, scoring de crédit', spendo: 'B2 · catégorie de dépense' },
  { icon: 'trend', tone: 'green', name: 'Prévoir un nombre', q: 'Combien ? Quand ?', ex: 'Ventes du mois, délai de livraison, risque de départ client', spendo: 'B7 · budget du trimestre' },
  { icon: 'alert', tone: 'coral', name: 'Détecter l’anormal', q: 'Qu’est-ce qui sort de l’ordinaire ?', ex: 'Fraude à la carte, panne machine, intrusion réseau', spendo: 'B3 · notes suspectes' },
  { icon: 'users', tone: 'teal', name: 'Regrouper', q: 'Qui se ressemble ?', ex: 'Segments clients, thèmes dans des verbatims', spendo: 'Profils de voyageurs' },
  { icon: 'star', tone: 'yellow', name: 'Recommander', q: 'Quoi proposer à qui ?', ex: 'Produits, contenus, prochaine action commerciale', spendo: 'Hôtel conforme à la politique' },
  { icon: 'eye', tone: 'violet', name: 'Voir et lire', q: 'Que contient ce document ?', ex: 'Lecture de factures, contrôle qualité visuel', spendo: 'B1 · lire le ticket photo' },
  { icon: 'chat', tone: 'navy', name: 'Comprendre le texte', q: 'De quoi parle ce message ?', ex: 'Sentiment, extraction d’entités, routage des e-mails', spendo: 'Router les tickets support' },
  { icon: 'sparkles', tone: 'pink', name: 'Générer', q: 'Écris, résume, réponds.', ex: 'Assistant conversationnel, rédaction, synthèse', spendo: 'B4 assistant · B8 résumé' },
];

const M1_Families: Page = () => (
  <Frame mod={1}>
    <Title>Huit familles de modèles, huit questions</Title>
    <Lede>On ne choisit pas « une IA » : on choisit la question à laquelle on veut une réponse. Cliquez pour retourner.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      {FAMILIES.map((f, i) => (
        <FlipCard
          key={f.name}
          w={403}
          h={322}
          tone={f.tone}
          backTone={f.tone}
          cls={A.in}
          style={dl(80 + i * 70)}
          front={
            <>
              <IconTile name={f.icon} tone={f.tone} size={62} />
              <div style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{f.name}</div>
              <div style={{ marginTop: 8, fontSize: 25, fontStyle: 'italic', color: T[f.tone].fg }}>« {f.q} »</div>
            </>
          }
          back={
            <>
              <Eyebrow c={T[f.tone].fg} size={18}>
                Exemples
              </Eyebrow>
              <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.38, color: C.ink }}>{f.ex}</div>
              <div style={{ marginTop: 'auto', fontSize: 21, fontWeight: 700, color: T[f.tone].fg }}>
                <Icon name="cart" size={20} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 8 }} />
                {f.spendo}
              </div>
            </>
          }
        />
      ))}
    </div>
  </Frame>
);

// ─── Comment « pense » un LLM ───────────────────────────────────────────────
const LLM_START = 'Le déjeuner client du 12 mars';
const LLM_STEPS: [string, number][][] = [
  [['est', 46], ['a', 21], ['sera', 17], ['coûte', 16]],
  [['remboursable', 38], ['plafonné', 27], ['refusé', 20], ['délicieux', 15]],
  [['dans', 41], ['à', 30], ['si', 19], ['selon', 10]],
  [['la', 50], ['une', 20], ['les', 18], ['notre', 12]],
  [['limite', 44], ['politique', 31], ['mesure', 15], ['galaxie', 10]],
  [['de', 52], ['du', 22], ['fixée', 16], ['autorisée', 10]],
  [['45 €', 38], ['30 €', 30], ['votre contrat', 20], ['mars', 12]],
];
const HOT_T = 2.6;
const llmDist = (step: [string, number][], hot: boolean) => {
  const w = step.map(([, p]) => (hot ? Math.pow(p, 1 / HOT_T) : p));
  const s = w.reduce((a, x) => a + x, 0);
  return w.map((x) => (x / s) * 100);
};

const M1_Llm: Page = () => {
  const [picked, setPicked] = useState<number[]>([]);
  const [hot, setHot] = useState(false);
  const step = picked.length;
  const done = step >= LLM_STEPS.length;
  const cur = done ? null : LLM_STEPS[step];
  const dist = cur ? llmDist(cur, hot) : [];
  const next = () => {
    if (!cur) return;
    let i = 0;
    if (hot) {
      let r = Math.random() * 100;
      for (; i < dist.length - 1; i++) {
        r -= dist[i];
        if (r <= 0) break;
      }
    }
    setPicked((p) => [...p, i]);
  };
  const words = picked.map((i, s) => LLM_STEPS[s][i][0]);
  const offTrack = picked.some((i) => i !== 0);
  return (
    <Frame mod={1} kind="demo">
      <Title>Comment « pense » un LLM : il prédit le mot suivant</Title>
      <Lede>ChatGPT, Mistral, Claude, Gemini… fonctionnent tous ainsi : un mot (un « token ») après l’autre.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px' }}>
        <Eyebrow c={C.muted} size={18}>
          Texte généré
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 130, fontSize: 36, lineHeight: 1.4, color: C.ink }}>
          {LLM_START}{' '}
          {words.map((w, i) => (
            <span key={i} className={A.pop} style={{ display: 'inline-block', marginRight: 10, color: picked[i] === 0 ? C.violet : C.coral, fontWeight: 600 }}>
              {w}
            </span>
          ))}
          {!done ? <span className={A.blink} style={{ display: 'inline-block', width: 4, height: 38, background: C.violet, verticalAlign: '-6px' }} /> : '.'}
        </div>
        <div style={{ marginTop: 18, height: 2, background: C.rule }} />
        <Eyebrow c={C.muted} size={18} style={{ marginTop: 18 }}>
          {done ? 'Phrase terminée' : `Candidats pour le mot n° ${step + 1}`}
        </Eyebrow>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 236 }}>
          {cur
            ? cur.map(([w], i) => (
                <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ width: 190, fontFamily: mono, fontSize: 25, color: C.ink }}>{w}</span>
                  <div style={{ flex: 1, height: 34, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                    <div style={{ width: `${dist[i]}%`, height: '100%', background: i === 0 ? G.violet : hot ? C.yellow : C.faint, transition: `width 500ms ${EASE}` }} />
                  </div>
                  <span style={{ width: 70, textAlign: 'right', fontFamily: mono, fontSize: 23, color: C.soft }}>{Math.round(dist[i])} %</span>
                </div>
              ))
            : (
                <div style={{ fontSize: 26, lineHeight: 1.45, color: offTrack ? T.coral.fg : C.ink }}>
                  {offTrack
                    ? 'Le hasard a choisi des mots moins probables : la phrase dérive, parfois jusqu’à l’absurde.'
                    : 'Fluide, plausible, sûre d’elle… Mais d’où vient « 45 € » ? De nulle part : c’est la suite la plus probable, pas un fait.'}
                </div>
              )}
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Btn icon="play" tone="violet" disabled={done} onClick={next}>
            Mot suivant
          </Btn>
          <Btn icon="reset" ghost tone="grey" onClick={() => setPicked([])}>
            Recommencer
          </Btn>
          <div style={{ marginLeft: 'auto' }}>
            <Toggle on={hot} onChange={setHot} label="Température élevée" tone="yellow" size={24} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="violet" icon="brain" title="Il prédit, il ne sait pas" size={22} cls={A.right} style={dl(150)}>
          Il produit la suite la plus probable, apprise sur des milliards de textes. Le vrai et le plausible se ressemblent.
        </Card>
        <Card tone="yellow" icon="gauge" title="La température" size={22} cls={A.right} style={dl(300)}>
          Basse : réponses stables et prévisibles. Haute : plus de variété… et plus de dérapages.
        </Card>
        <Card tone="green" icon="doc" title="Pour parler de VOS règles" size={22} cls={A.right} style={dl(450)}>
          On lui fournit vos documents au moment de répondre : c’est le <strong>RAG</strong> (génération augmentée par recherche).
        </Card>
      </div>
    </Frame>
  );
};

// ─── Prédictif vs génératif ─────────────────────────────────────────────────
const M1Row = ({ k: label, a, g, n }: { k: string; a: ReactNode; g: ReactNode; n?: number }) => (
  <div className={n ? b.on(n) : A.in} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: display, fontWeight: 700, fontSize: 23, color: C.navy }}>{label}</div>
    <div style={{ background: T.blue.bg, borderRadius: 12, padding: '14px 20px', fontSize: 23, lineHeight: 1.35, color: C.ink }}>{a}</div>
    <div style={{ background: T.pink.bg, borderRadius: 12, padding: '14px 20px', fontSize: 23, lineHeight: 1.35, color: C.ink }}>{g}</div>
  </div>
);

const M1_PredGen: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>IA prédictive ou IA générative : deux projets très différents</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={A.fade} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 18 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile name="target" tone="blue" size={46} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.blue }}>Prédictive (ML « classique »)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile name="sparkles" tone="pink" size={46} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.pink }}>Générative (LLM)</span>
        </div>
      </div>
      <M1Row k="Ce qu’elle produit" a="Une étiquette, un score, un nombre" g="Du texte, une image, du code" />
      <M1Row k="Données" a="Vos données historiques, souvent étiquetées" g="Un modèle déjà entraîné + vos documents et consignes" />
      <M1Row k="Mise en œuvre" n={1} a="Entraîner, puis ré-entraîner un modèle" g="Appeler une API, écrire des prompts, brancher des sources" />
      <M1Row k="Évaluation" n={1} a="Métriques nettes : précision, rappel, erreur moyenne" g="Plus subjective : grilles, relecture, jeux de tests" />
      <M1Row k="Coût" n={2} a="Surtout au départ : données, entraînement" g="Surtout à l’usage : on paie chaque requête" />
      <M1Row k="Risque typique" n={2} a="Erreur de classement, biais des données" g="Hallucination, fuite de données, injection de consignes" />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 770, width: 1680 }}>
      <Callout title="Réflexe PO" tone="blue" icon="target" size={26}>
        Le bon outil dépend de la sortie attendue. Un LLM peut classer… mais un petit modèle dédié sera souvent plus fiable, plus rapide et moins cher.
      </Callout>
    </div>
  </Frame>
);

// ─── Cas d’usage réels ──────────────────────────────────────────────────────
const M1Case = ({ sector, icon, tone, title, fam, po, d }: { sector: string; icon: IconName; tone: Tone; title: string; fam: string; po: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div>
        <Eyebrow c={T[tone].fg} size={17}>
          {sector}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: C.ink }}>{title}</div>
      </div>
    </div>
    <div>
      <Tag tone={tone} size={18}>
        {fam}
      </Tag>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: C.navy }}>Décision PO · </strong>
      {po}
    </div>
  </div>
);

const M1_UseCases: Page = () => (
  <Frame mod={1} kind="cas">
    <Title>Des cas d’usage qui tournent déjà en production</Title>
    <Lede>Chaque fois, le cœur du travail produit n’est pas le modèle : c’est la décision autour.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M1Case sector="Banque" icon="money" tone="coral" title="Bloquer les paiements frauduleux" fam="Détecter l’anormal" po="Bloquer à tort un client sur 500, ou laisser passer une fraude ?" d={100} />
      <M1Case sector="E-commerce" icon="cart" tone="yellow" title="« Vous aimerez aussi »" fam="Recommander" po="Quel indicateur prouve la valeur : les clics ou le panier moyen ?" d={180} />
      <M1Case sector="Assurance" icon="doc" tone="violet" title="Lire les déclarations de sinistre" fam="Voir et lire + texte" po="Quels champs, et quel taux de reprise manuelle est acceptable ?" d={260} />
      <M1Case sector="Télécom" icon="phone" tone="green" title="Anticiper les résiliations" fam="Prévoir" po="Que fait-on concrètement d’un client « à risque » ?" d={340} />
      <M1Case sector="Service public" icon="org" tone="navy" title="Assistant de réponse aux usagers" fam="Générer + documents" po="Quand l’assistant passe-t-il la main à un agent humain ?" d={420} />
      <M1Case sector="Logistique" icon="truck" tone="teal" title="Prévoir les volumes de colis" fam="Prévoir un nombre" po="À quel horizon, avec quelle marge d’erreur tolérée ?" d={500} />
    </div>
  </Frame>
);

// ─── Exercice : quelle famille ? ────────────────────────────────────────────
const M1Zone = ({ x, y, tone, title, answer }: { x: number; y: number; tone: Tone; title: string; answer: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 360, height: 318, boxSizing: 'border-box', borderRadius: 18, border: `3px dashed ${T[tone].bd}`, background: `${T[tone].bg}99`, padding: '14px 18px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: T[tone].fg }}>{title}</div>
    <div className={b.fade(1)} style={{ position: 'absolute', left: 18, right: 18, bottom: 12, fontSize: 20, fontWeight: 700, color: T[tone].fg }}>
      ✓ {answer}
    </div>
  </div>
);

const M1_SORT: [string, Tone][] = [
  ['B1 · Lire le ticket photo', 'blue'],
  ['B2 · Catégorie de dépense', 'teal'],
  ['B3 · Notes suspectes', 'coral'],
  ['B4 · Assistant politique voyage', 'violet'],
  ['B5 · Export Sage / Cegid', 'grey'],
  ['B6 · Connexion SSO', 'grey'],
  ['B7 · Budget du trimestre', 'green'],
  ['B8 · Résumé mensuel DAF', 'pink'],
  ['B9 · Valider sous 50 €', 'yellow'],
];

const M1_Sort: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>À vous : rangez le backlog de Spendo</Title>
    <Lede>Glissez chaque idée dans la bonne famille. Double-clic pour renvoyer une étiquette à sa place.</Lede>
    <M1Zone x={660} y={262} tone="violet" title="Voir et lire" answer="B1" />
    <M1Zone x={1050} y={262} tone="blue" title="Classer" answer="B2" />
    <M1Zone x={1440} y={262} tone="coral" title="Détecter l’anormal" answer="B3" />
    <M1Zone x={660} y={612} tone="green" title="Prévoir un nombre" answer="B7" />
    <M1Zone x={1050} y={612} tone="pink" title="Générer (+ documents)" answer="B4 · B8" />
    <M1Zone x={1440} y={612} tone="grey" title="Pas besoin d’IA" answer="B5 · B6 · B9" />
    {M1_SORT.map(([label, tone], i) => (
      <Drag key={label} x={120} y={262 + i * 74} w={500} tone={tone} size={22}>
        {label}
      </Drag>
    ))}
  </Frame>
);

// ─── QCM 1 & 2 ──────────────────────────────────────────────────────────────
const M1_Qcm1: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Machine learning"
    q="L’équipe annonce : « On va faire du machine learning pour catégoriser les dépenses. » Concrètement, cela veut dire…"
    explain="Machine learning = apprendre à partir d’exemples. La question PO qui en découle : avons-nous ces exemples, en quantité et en qualité ?"
  >
    <Opt why="Ça, c’est un système de règles : utile, mais chaque règle est écrite et maintenue à la main.">
      On écrit des règles plus fines pour chaque commerçant
    </Opt>
    <Opt ok why="Exactement : des exemples étiquetés, et le modèle généralise aux nouveaux cas, avec un niveau de confiance.">
      Le système apprend la catégorie à partir de dépenses déjà catégorisées
    </Opt>
    <Opt why="Il ne « comprend » rien : il repère des régularités statistiques dans les exemples qu’on lui a montrés.">
      Le système comprend ce qu’est une dépense professionnelle
    </Opt>
    <Opt why="Un LLM peut catégoriser, mais ce n’est pas ce que désigne l’annonce ; et ce serait souvent plus cher et moins stable.">
      On branche ChatGPT sur l’application
    </Opt>
  </QcmPage>
);

const M1_Qcm2: Page = () => (
  <QcmPage
    mod={1}
    n={2}
    title="Choisir la famille"
    q="Le support veut un assistant qui répond aux salariés sur la politique de voyage de LEUR entreprise. Quelle approche ?"
    explain="Le LLM rédige, les documents de l’entreprise fournissent les faits : c’est le principe du RAG, la génération augmentée par recherche."
  >
    <Opt why="Un classifieur range dans des cases prédéfinies : il ne rédige pas de réponse.">Un modèle de classification</Opt>
    <Opt why="Il répondra avec aplomb… des règles inventées : il ne connaît pas la politique de chaque client.">
      Un LLM grand public, sans autre information
    </Opt>
    <Opt ok why="Le modèle s’appuie sur la bonne politique au moment de répondre, et peut citer sa source.">
      Un LLM qui s’appuie sur les documents de politique de chaque client
    </Opt>
    <Opt why="Possible pour une FAQ figée, mais fragile dès que la question est formulée autrement.">
      Un moteur de règles avec 300 questions-réponses
    </Opt>
  </QcmPage>
);

// ─── À retenir (page réutilisée par chaque module) ──────────────────────────
type KeyItem = { icon: IconName; tone: Tone; title: string; text: ReactNode };

const RecapPage = ({ mod, title, items, quote }: { mod: number; title: string; items: KeyItem[]; quote?: ReactNode }) => (
  <Frame mod={mod} kind="synthese">
    <Title>{title}</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: items.length > 4 ? '1fr 1fr' : '1fr', gap: 16 }}>
      {items.map((it, i) => (
        <div key={it.title} className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px', ...dl(100 + i * 110) }}>
          <IconTile name={it.icon} tone={it.tone} size={58} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 25, color: C.ink }}>{it.title}</div>
            <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.38, color: C.soft }}>{it.text}</div>
          </div>
        </div>
      ))}
    </div>
    {quote ? (
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(900) }}>
        <Quote>{quote}</Quote>
      </div>
    ) : null}
  </Frame>
);

const M1_Recap: Page = () => (
  <RecapPage
    mod={1}
    title="À retenir du module 1"
    items={[
      { icon: 'brain', tone: 'blue', title: 'Apprendre plutôt que programmer', text: 'Le modèle généralise à partir d’exemples : il est utile… et faillible.' },
      { icon: 'layers', tone: 'violet', title: 'IA ⊃ ML ⊃ DL ⊃ générative', text: 'Utilisez le terme précis : il change le projet, les données et les coûts.' },
      { icon: 'target', tone: 'teal', title: 'Une famille = une question', text: 'Classer, prévoir, détecter, regrouper, recommander, lire, comprendre, générer.' },
      { icon: 'clock', tone: 'coral', title: 'Entraînement ≠ inférence', text: 'Un modèle apprend sur le passé et vieillit : il se surveille en production.' },
      { icon: 'sparkles', tone: 'pink', title: 'Un LLM prédit, il ne sait pas', text: 'Plausible n’est pas vrai : pour vos règles, donnez-lui vos documents (RAG).' },
      { icon: 'check', tone: 'green', title: 'Pas d’IA est une option', text: 'Une règle simple ou une intégration règle souvent le problème mieux et moins cher.' },
    ]}
    quote="On ne priorise pas de l’IA. On priorise un problème… que l’IA résout parfois."
  />
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Rules, M1_Nested, M1_Learn, M1_Families, M1_Llm, M1_PredGen, M1_UseCases, M1_Sort, M1_Qcm1, M1_Qcm2, M1_Recap];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · MODULE 1 · 9:25

OBJECTIF — Annoncer le module : le vocabulaire minimal pour dialoguer avec une équipe data, sans mathématiques.

DIRE — « Premier module : comprendre l’IA. Je vous promets zéro équation. On va voir ce qui change quand on passe de règles écrites à un système qui apprend, démêler les mots — IA, machine learning, deep learning, IA générative —, découvrir les grandes familles de modèles, et comprendre comment “pense” un LLM. À la fin, vous rangerez vous-mêmes le backlog de Spendo. »

TRANSITION — « Partons d’une idée du backlog : B2, proposer la catégorie d’une dépense. »`,
  `⏱ 6 min · RÈGLES OU APPRENTISSAGE

OBJECTIF — Faire comprendre la différence fondamentale entre un programme à règles et un modèle qui apprend.

DIRE — « Première façon de faire : écrire des règles. Si le commerçant contient SNCF, c’est du transport. Si c’est un hôtel, c’est de l’hébergement. Ça marche… au début. Puis on arrive à 412 règles, et personne n’ose plus y toucher. »

→ beat 1 : les cas qui cassent. « OUIGO, Trainline : pas de règle. Une brasserie à 19h40 : la règle des repas de midi ne s’applique pas. Chaque nouveau cas, c’est une nouvelle règle. »

→ beat 2 : l’apprentissage. « Deuxième façon : on montre au système 50 000 dépenses déjà classées par les comptables. Il en déduit des régularités. Personne n’a écrit que Trainline, c’est du transport : il l’a déduit. Et regardez : il donne un niveau de confiance. 92 % pour Trainline, seulement 64 % pour la brasserie. »

→ beat 3 : la définition de travail. « C’est ça, l’IA moderne : un système qui apprend à partir de données. Il généralise, donc il peut se tromper. Toute la journée découle de cette phrase. »

QUESTION — « Dans votre produit, où avez-vous un empilement de règles que plus personne ne maîtrise ? » Une ou deux réponses.

TRANSITION — « Mettons de l’ordre dans le vocabulaire. »`,
  `⏱ 5 min · IA ⊃ ML ⊃ DL ⊃ GÉNÉRATIVE

OBJECTIF — Clarifier les quatre termes et leur emboîtement.

DIRE — « Le plus grand cercle : l’intelligence artificielle. C’est très large : un moteur de règles anti-doublons, c’est déjà de l’IA au sens historique. »

→ beat 1 : le machine learning. « À l’intérieur : le machine learning, les systèmes qui apprennent des exemples. Notre catégorisation de dépenses. »

→ beat 2 : le deep learning. « Plus précisément, le deep learning : des réseaux de neurones profonds, qui excellent sur les images, le son et le texte. C’est ce qui permet de lire un ticket photographié de travers. »

→ beat 3 : l’IA générative. « Et au cœur : l’IA générative, qui produit du contenu nouveau. Les LLM, comme ChatGPT, en font partie. »

INSIST — « Pourquoi c’est important pour vous ? Parce que quand quelqu’un dit “on va mettre de l’IA”, la réponse n’est pas la même selon le cercle : les données, les coûts et les risques changent complètement. Demandez toujours : de quel cercle parle-t-on ? »

TRANSITION — « Comment un modèle apprend-il, concrètement ? »`,
  `⏱ 5 min · ENTRAÎNEMENT ET INFÉRENCE

OBJECTIF — Distinguer les deux moments de la vie d’un modèle et en tirer trois conséquences produit.

DIRE — « Premier moment : l’entraînement. On prend des données historiques étiquetées, le modèle ajuste ses paramètres, et on obtient un modèle : concrètement, un fichier, qu’on versionne comme du code. »

→ beat 1 : l’inférence. « Deuxième moment : l’inférence. C’est ce qui se passe en production, à chaque utilisation. Une nouvelle dépense arrive, le modèle répond en quelques millisecondes : transport, confiance 92 %. »

→ beat 2 : les trois conséquences. « Trois conséquences pour vous. Un : il ne sait que ce qu’il a vu. Spendo ouvre l’Espagne ? Pas d’exemples espagnols, il devine. Deux : il répond toujours, même quand il ne sait pas : d’où le score de confiance, qu’on utilisera dans les critères d’acceptation. Trois : il vieillit. Les usages changent — le télétravail a bouleversé les notes de frais —, il faut surveiller et ré-entraîner. »

INSIST — « Ce troisième point est souvent oublié dans les budgets : un modèle n’est jamais “fini”. »

TRANSITION — « Quelles questions un modèle peut-il résoudre ? Huit familles. »`,
  `⏱ 8 min · FAMILLES DE MODÈLES (cartes)

OBJECTIF — Associer chaque famille de modèles à la question qu’elle résout et à un exemple concret.

DIRE — « On ne choisit pas “une IA” : on choisit la question. Huit familles, huit questions. Classer : dans quelle case ? Prévoir un nombre : combien, quand ? Détecter l’anormal : qu’est-ce qui sort de l’ordinaire ? Regrouper : qui se ressemble ? Recommander : quoi proposer à qui ? Voir et lire : que contient ce document ? Comprendre le texte : de quoi parle ce message ? Générer : écris, résume, réponds. »

ANIMATION — Retourner les cartes une à une en demandant à la salle : « Un exemple dans votre quotidien ? » avant de cliquer. Le dos montre des exemples et le lien avec le backlog Spendo.

INSIST — « Retenez surtout la question. Quand un besoin arrive, reformulez-le en question : “dans quelle catégorie ?”, “est-ce anormal ?”. La famille en découle. »

TRANSITION — « La famille dont tout le monde parle, c’est la dernière : générer. Voyons comment elle fonctionne. »`,
  `⏱ 7 min · DÉMO : LE MOT SUIVANT

OBJECTIF — Faire sentir qu’un LLM produit du plausible, pas du vrai, et introduire température et RAG.

DIRE — « Un LLM fait une seule chose : prédire le mot suivant. Je pars de “Le déjeuner client du 12 mars”. »

DEMO — Cliquer « Mot suivant » sept fois, en commentant les candidats : « est » à 46 %, « remboursable » à 38 %… Arriver à « dans la limite de 45 € ».

DIRE — « Fluide, plausible, sûr de lui. Mais d’où vient 45 € ? De nulle part. C’est la suite la plus probable, pas un fait. C’est ça, une hallucination : pas un bug, le fonctionnement normal. »

DEMO — Recommencer, activer « Température élevée » : les barres s’aplatissent. Cliquer plusieurs fois : la phrase dérive, parfois jusqu’à « galaxie ». « Température haute : plus de créativité, plus de dérapages. Pour un produit de notes de frais, on la veut basse. »

DIRE — « Et pour répondre sur VOS règles, on lui donne vos documents au moment de répondre : c’est le RAG. On en reparlera. »

TRANSITION — « Prédictif, génératif : deux projets très différents. »`,
  `⏱ 5 min · PRÉDICTIF VS GÉNÉRATIF

OBJECTIF — Montrer que les deux approches n’ont ni les mêmes données, ni les mêmes coûts, ni les mêmes risques.

DIRE — « Deux colonnes. Ce qu’elles produisent : une étiquette ou un nombre, contre du texte ou une image. Les données : vos historiques étiquetés, contre un modèle déjà entraîné à qui on donne vos documents. »

→ beat 1 : mise en œuvre et évaluation. « Le prédictif s’entraîne ; le génératif s’appelle par API et se pilote par des prompts. Le prédictif s’évalue avec des métriques nettes ; le génératif, c’est plus subjectif : il faut des grilles et des jeux de test. »

→ beat 2 : coûts et risques. « Le prédictif coûte surtout au départ ; le génératif coûte à chaque requête, ce qui compte quand on a 180 000 justificatifs par mois. Et les risques diffèrent : erreur de classement et biais d’un côté ; hallucination, fuite et injection de consignes de l’autre. »

→ beat 3 : le réflexe PO. « Un LLM peut tout faire, y compris classer. Mais un petit modèle dédié sera souvent plus fiable, plus rapide et moins cher. Ne laissez pas la mode choisir l’outil. »

TRANSITION — « Quelques cas réels pour ancrer tout ça. »`,
  `⏱ 5 min · CAS D’USAGE RÉELS

OBJECTIF — Ancrer les familles dans des cas de production, et montrer que la décision clé est toujours produit.

DIRE — « Six cas qui tournent en production, dans six secteurs. Regardez la ligne “Décision PO” : aucune ne parle d’algorithme. »

ANIMATION — Commenter deux ou trois cartes, selon les secteurs des participants. La banque : « Bloquer à tort un client sur 500, ou laisser passer une fraude ? C’est un arbitrage métier, pas technique : on y reviendra avec les erreurs du module 2. » Le service public : « Quand l’assistant passe-t-il la main ? C’est une règle de produit. »

QUESTION — « Lequel ressemble le plus à votre produit ? Quelle serait votre décision ? »

TRANSITION — « À vous de jouer avec le backlog de Spendo. »`,
  `⏱ 8 min · EXERCICE : QUELLE FAMILLE ? (glisser-déposer)

OBJECTIF — Appliquer la notion de famille au backlog fil rouge, et repérer les idées sans IA.

CONSIGNE — « Neuf idées du backlog, six zones. Dites-moi où je glisse chaque étiquette. » Faire glisser à l’écran sous la dictée de la salle ; laisser débattre quand il y a désaccord.

→ beat 1 : les réponses s’affichent dans les zones. B1 : voir et lire. B2 : classer. B3 : détecter l’anormal. B7 : prévoir. B4 et B8 : générer, avec des documents pour B4. B5, B6 et B9 : pas besoin d’IA.

DEBRIEF — « B9, valider les notes de moins de 50 € : c’est une règle métier, une ligne de code. Si on la confie à un modèle, on paie plus cher pour un résultat moins prévisible. B5 et B6, c’est de l’intégration classique. Trois idées sur neuf : c’est fréquent. Et c’est précieux : ce sont souvent des gains rapides. »

ANIMATION — Double-clic sur une étiquette pour la renvoyer à sa place.

TRANSITION — « Vérifions avec deux QCM. »`,
  `⏱ 3 min · QCM 1

OBJECTIF — Vérifier la compréhension de « machine learning ».

INTERACTION — Lire la question, faire voter à main levée, puis cliquer la réponse majoritaire. Cliquer ensuite les autres options pour commenter les pièges.

→ beat 1 : la bonne réponse s’affiche (B).
→ beat 2 : l’essentiel s’affiche.

DIRE — « Le piège C est fréquent : le modèle ne comprend rien, il repère des régularités. Et la question qui en découle pour vous : avons-nous les exemples ? »

TRANSITION — « Deuxième QCM, sur le choix de la famille. »`,
  `⏱ 3 min · QCM 2

OBJECTIF — Vérifier le choix d’approche pour un assistant documentaire.

INTERACTION — Vote à main levée, puis clic.

→ beat 1 : la bonne réponse s’affiche (C).
→ beat 2 : l’essentiel s’affiche.

DIRE — « Le piège B est celui des démos qui impressionnent en réunion : le LLM seul répond avec aplomb des règles inventées. Le RAG, c’est le modèle pour la forme et vos documents pour le fond. »

TRANSITION — « Ce qu’il faut retenir du module. »`,
  `⏱ 3 min · À RETENIR · M1

OBJECTIF — Fixer les six idées du module.

DIRE — « Six idées. Apprendre plutôt que programmer : utile et faillible. Le bon terme change le projet. Une famille, c’est une question. Entraînement et inférence : le modèle vieillit. Un LLM prédit, il ne sait pas. Et “pas d’IA” est une option, souvent la meilleure. »

INSIST — Relire la citation : « On ne priorise pas de l’IA. On priorise un problème… que l’IA résout parfois. »

ANIMATION — Annoncer la pause : 15 minutes, reprise à 10:40.

TRANSITION — « Après la pause : ce que l’IA fait bien… et tout ce qui peut mal tourner. »`,
];
// @@NOTES-END
