// ─── Module 3 · Exploiter l’IA avec les documents et les données ───────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Documents
        <br />& données
      </>
    }
    sub="Lire, extraire, résumer, comparer, transformer : faire de vos documents des données exploitables… et vérifiées."
    dur="13:30 – 15:00 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · document → résultat structuré
      </Tag>
    }
  >
    <SecItem n={1}>Analyser, extraire, résumer, synthétiser</SecItem>
    <SecItem n={2}>Comparer et classer des documents</SecItem>
    <SecItem n={3}>Du texte libre au tableau de données</SecItem>
    <SecItem n={4}>Chercher dans une documentation</SecItem>
    <SecItem n={5}>Contrôler la qualité des résultats</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Huit opérations sur un document ────────────────────────────────────────
const M3Op = ({ icon, tone, title, ex, d }: { icon: IconName; tone: Tone; title: string; ex: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 24px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, lineHeight: 1.15, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{ex}</div>
  </div>
);

const M3_Operations: Page = () => (
  <Frame mod={3}>
    <Title>Ce que l’IA sait faire avec un document</Title>
    <Lede>Huit opérations. Dans un workflow, on en enchaîne souvent deux ou trois sur le même fichier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      <M3Op icon="eye" tone="blue" title="Analyser" ex="Ton, risques, points faibles d’une réclamation ou d’un contrat." d={80} />
      <M3Op icon="search" tone="teal" title="Extraire" ex="Montant, date, référence, nom : les champs d’une facture ou d’un CV." d={160} />
      <M3Op icon="note" tone="violet" title="Résumer · synthétiser" ex="Un rapport de 30 pages en 10 lignes, pour un lecteur précis." d={240} />
      <M3Op icon="layers" tone="pink" title="Comparer" ex="Deux versions d’un contrat, trois devis fournisseurs." d={320} />
      <M3Op icon="filter" tone="yellow" title="Classer" ex="Type de document, service concerné, niveau de confidentialité." d={400} />
      <M3Op icon="table" tone="green" title="Transformer" ex="Avis libres, comptes rendus, emails → lignes d’un tableau." d={480} />
      <M3Op icon="target" tone="coral" title="Repérer l’important" ex="Échéances, pénalités, engagements cachés en page 14." d={560} />
      <M3Op icon="book" tone="navy" title="Chercher dans une doc" ex="Répondre à une question en citant la procédure interne." d={640} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: C.muted, ...dl(900) }}>
      <Icon name="shieldCheck" size={26} color={C.green} />
      Le résultat est toujours <strong style={{ color: C.navy }}>structuré</strong> et toujours <strong style={{ color: C.navy }}>contrôlé</strong> : on y revient en fin de module.
    </div>
  </Frame>
);

// ─── Démo : extraction champ par champ ──────────────────────────────────────
const M3_FIELDS = [
  { k: 'contact', v: '"Claire Martin"', c: '#FFD27A' },
  { k: 'entreprise', v: '"Batinord"', c: '#82AAFF' },
  { k: 'effectif', v: '82', c: '#F7B36B' },
  { k: 'besoin', v: '"entretiens annuels"', c: '#9BE29B' },
  { k: 'participants', v: '12', c: '#C792EA' },
  { k: 'modalite', v: '"présentiel"', c: '#7FDBCA' },
  { k: 'periode', v: '"2026-11-17"', c: '#FF9CAC' },
  { k: 'budget_ht', v: '9000', c: '#F7B36B' },
  { k: 'financement', v: 'null', c: '#AEB9E6' },
];

const M3Src = ({ i, n, children }: { i: number; n: number; children: ReactNode }) => {
  const on = n > i;
  const c = M3_FIELDS[i].c;
  return (
    <span style={{ background: on ? `${c}33` : 'transparent', boxShadow: on ? `inset 0 -3px 0 ${c}` : 'none', borderRadius: 4, transition: 'all 400ms ease', padding: '0 2px' }}>{children}</span>
  );
};

const M3Field = ({ i, n }: { i: number; n: number }) => {
  const f = M3_FIELDS[i];
  if (n <= i) return null;
  return (
    <div className={A.left} style={{ animationDuration: '400ms' } as CSSProperties}>
      {'  '}
      <Cs>"{f.k}"</Cs>: <span style={{ color: f.c }}>{f.v}</span>,
    </div>
  );
};

const M3_Extraction: Page = () => {
  const [n, setN] = useState(0);
  return (
    <Frame mod={3} kind="demo">
      <Title>Extraction automatique : d’un email à une fiche</Title>
      <Lede>Une demande de formation arrive par email. Cliquez « Extraire » pour voir chaque champ trouvé… et sa source.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 30px' }}>
        <PanelTitle icon="mail">Email reçu · demande de devis</PanelTitle>
        <div style={{ fontSize: 25, lineHeight: 1.7, color: C.ink }}>
          Bonjour, je suis <M3Src i={0} n={n}>Claire Martin</M3Src>, responsable RH chez <M3Src i={1} n={n}>Batinord</M3Src> (<M3Src i={2} n={n}>82 salariés</M3Src>, Lille). Nous
          souhaiterions former <M3Src i={4} n={n}>12 managers</M3Src> à la <M3Src i={3} n={n}>conduite des entretiens annuels</M3Src>, idéalement{' '}
          <M3Src i={5} n={n}>en présentiel</M3Src>, <M3Src i={6} n={n}>la semaine du 17 novembre</M3Src>. Notre budget tourne autour de <M3Src i={7} n={n}>9 000 € HT</M3Src>.
          Pouvez-vous me rappeler ? Merci !
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
          <Btn icon="sparkles" size={22} disabled={n >= M3_FIELDS.length} onClick={() => setN((x) => Math.min(M3_FIELDS.length, x + 1))}>
            Extraire le champ suivant
          </Btn>
          <Btn ghost size={22} onClick={() => setN(M3_FIELDS.length)}>
            Tout
          </Btn>
          <Btn ghost tone="grey" icon="reset" size={22} onClick={() => setN(0)} />
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1040, top: 262, width: 760, ...dl(150) }}>
        <CodeDark file="fiche_demande.json" size={23} style={{ minHeight: 470 }}>
          {'{'}
          <M3Field i={0} n={n} />
          <M3Field i={1} n={n} />
          <M3Field i={2} n={n} />
          <M3Field i={3} n={n} />
          <M3Field i={4} n={n} />
          <M3Field i={5} n={n} />
          <M3Field i={6} n={n} />
          <M3Field i={7} n={n} />
          <M3Field i={8} n={n} />
          {'}'}
        </CodeDark>
        {n >= M3_FIELDS.length ? (
          <div className={A.in} style={{ marginTop: 18, animationDuration: '450ms' } as CSSProperties}>
            <Callout title="Deux pièges évités" tone="green" icon="check" size={22}>
              « La semaine du 17 novembre » devient une date normée. Le financement n’est pas mentionné : <strong>null</strong>, pas une supposition.
            </Callout>
          </div>
        ) : null}
      </div>
    </Frame>
  );
};

// ─── Résumé et synthèse : trois formats ─────────────────────────────────────
const M3Sum = ({ who, children }: { who: string; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 30px', minHeight: 430, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <Icon name="user" size={26} color={C.violet} />
      <span style={{ fontSize: 22, fontWeight: 600, color: T.violet.fg }}>Pour : {who}</span>
    </div>
    <div style={{ fontSize: 25, lineHeight: 1.55, color: C.ink }}>{children}</div>
  </div>
);

const M3_Resume: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Résumer et synthétiser : pour qui, pour quoi faire ?</Title>
    <Lede>Le même rapport mensuel du SAV (14 pages), trois sorties différentes. Le prompt dit qui lira et ce qu’il en fera.</Lede>
    <Tabs initial="tldr" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <TabBtn id="tldr" tone="blue" icon="bolt">
          En une phrase
        </TabBtn>
        <TabBtn id="points" tone="violet" icon="note">
          Points clés
        </TabBtn>
        <TabBtn id="actions" tone="green" icon="target">
          Décisions & actions
        </TabBtn>
      </div>
      <TabPane id="tldr">
        <M3Sum who="la direction, dans un fil Teams">
          Octobre : 1 240 demandes (+18 %), délai moyen de réponse passé de 2,1 à 3,4 jours à cause des retards transporteur ; satisfaction stable à 4,2 / 5.
        </M3Sum>
      </TabPane>
      <TabPane id="points">
        <M3Sum who="le responsable SAV, en réunion d’équipe">
          • Volume : 1 240 demandes, +18 % sur un mois
          <br />• 41 % concernent la livraison (transporteur B)
          <br />• Délai moyen : 3,4 jours (objectif : 2)
          <br />• Retours produits stables, sauf la gamme « arrosage »
          <br />• Satisfaction : 4,2 / 5, commentaires négatifs sur l’attente
        </M3Sum>
      </TabPane>
      <TabPane id="actions">
        <M3Sum who="le tableau de suivi des actions">
          <span style={{ fontFamily: mono, fontSize: 21 }}>
            décision : renégocier le contrat transporteur B<br />
            action : réponse type « retard livraison » · resp. SAV · 30/11
            <br />
            action : analyse qualité gamme arrosage · resp. achats · 15/12
            <br />
            risque : délai &gt; 3 j si pic de Noël
          </span>
        </M3Sum>
      </TabPane>
    </Tabs>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="user" title="Le lecteur" cls={A.right} style={dl(200)} size={22}>
        Direction, équipe, outil : il change le niveau de détail et le vocabulaire.
      </Card>
      <Card tone="blue" icon="note" title="La longueur" cls={A.right} style={dl(300)} size={22}>
        Une phrase, cinq puces, 150 mots : un chiffre, pas « court ».
      </Card>
      <Card tone="green" icon="book" title="La source" cls={A.right} style={dl(400)} size={22}>
        « Cite la page » : on vérifie en 10 secondes au lieu de tout relire.
      </Card>
    </div>
  </Frame>
);

// ─── Comparer deux documents ────────────────────────────────────────────────
const M3Del = ({ children }: { children: ReactNode }) => <span style={{ background: '#FDE2E2', color: '#B42F2F', textDecoration: 'line-through', borderRadius: 4, padding: '0 3px' }}>{children}</span>;
const M3Ins = ({ children, beat }: { children: ReactNode; beat: number }) => (
  <span className={b.hi(beat)} style={{ background: '#DDF5E8', color: '#0A7A55', fontWeight: 600, borderRadius: 4, padding: '0 3px' }}>
    {children}
  </span>
);

const M3DiffRow = ({ clause, avant, apres, impact, tone, beat }: { clause: string; avant: string; apres: string; impact: string; tone: Tone; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '180px 150px 150px 1fr', gap: 12, alignItems: 'center', padding: '12px 16px', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM }}>
    <span style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{clause}</span>
    <span style={{ fontSize: 20, color: C.muted }}>{avant}</span>
    <span style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{apres}</span>
    <Tag tone={tone} size={18}>
      {impact}
    </Tag>
  </div>
);

const M3_Comparer: Page = () => (
  <Frame mod={3} kind="cas" beats={3}>
    <Title>Comparer deux documents : le contrat fournisseur v1 / v2</Title>
    <Lede>Le fournisseur renvoie « la même version, avec quelques corrections ». L’IA liste les écarts et leur impact.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="doc">Contrat v2 · extraits modifiés</PanelTitle>
      <div style={{ fontSize: 23, lineHeight: 1.7, color: C.ink }}>
        <strong>Art. 4 · Délais.</strong> Livraison sous <M3Del>10</M3Del> <M3Ins beat={1}>15 jours ouvrés</M3Ins> à compter de la commande.
        <br />
        <strong>Art. 7 · Pénalités.</strong> En cas de retard, pénalité de <M3Del>1 %</M3Del> <M3Ins beat={2}>0,5 % par semaine, plafonnée à 5 %</M3Ins>.
        <br />
        <strong>Art. 11 · Durée.</strong> Contrat d’un an, <M3Ins beat={3}>reconduit tacitement sauf préavis de 3 mois</M3Ins>.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800 }}>
      <div className={A.fade} style={{ display: 'grid', gridTemplateColumns: '180px 150px 150px 1fr', gap: 12, padding: '0 16px 10px', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted, textTransform: 'uppercase' }}>
        <span>Clause</span>
        <span>Avant</span>
        <span>Après</span>
        <span>Impact</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M3DiffRow beat={1} clause="Art. 4 Délais" avant="10 jours" apres="15 j. ouvrés" impact="Défavorable" tone="coral" />
        <M3DiffRow beat={2} clause="Art. 7 Pénalités" avant="1 % / sem." apres="0,5 %, max 5 %" impact="Défavorable" tone="coral" />
        <M3DiffRow beat={3} clause="Art. 11 Durée" avant="1 an" apres="Tacite reconduction" impact="À surveiller" tone="yellow" />
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Dans un workflow" tone="blue" icon="route" size={24}>
        Nouveau fichier déposé dans « Contrats / à revoir » → l’IA compare à la version signée → tableau des écarts envoyé au juriste, qui décide. L’IA repère, l’humain
        tranche.
      </Callout>
    </div>
  </Frame>
);

// ─── Transformer du texte libre en données ──────────────────────────────────
const M3Review = ({ children, d }: { children: string; d: number }) => (
  <div className={A.left} style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', fontSize: 22, lineHeight: 1.45, fontStyle: 'italic', color: C.soft, ...dl(d) }}>
    « {children} »
  </div>
);

const M3TRow = ({ theme, sent, tone, sugg, beat }: { theme: string; sent: string; tone: Tone; sugg: string; beat: number }) => (
  <div className={b.left(beat)} style={{ display: 'grid', gridTemplateColumns: '170px 140px 1fr', gap: 12, alignItems: 'center', padding: '14px 18px', borderBottom: `1px solid ${C.rule}` }}>
    <span style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>{theme}</span>
    <Tag tone={tone} size={18}>
      {sent}
    </Tag>
    <span style={{ fontSize: 21, color: C.soft }}>{sugg}</span>
  </div>
);

const M3_Transformer: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Transformer des données non structurées</Title>
    <Lede>Des avis clients en texte libre deviennent un tableau qu’on peut filtrer, compter et suivre dans le temps.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Review d={100}>Livraison rapide mais carton abîmé, heureusement la serre était intacte.</M3Review>
      <M3Review d={200}>Impossible de joindre le SAV, 40 minutes d’attente. Inadmissible.</M3Review>
      <M3Review d={300}>Notice claire, montage en une heure. Il manque juste une vis de rechange.</M3Review>
      <M3Review d={400}>Prix correct, mais le site plante au moment du paiement.</M3Review>
    </div>
    <div style={{ position: 'absolute', left: 920, top: 400 }}>
      <FlowArrow w={60} color={C.violet} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1010, top: 262, width: 790, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', ...dl(200) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '170px 140px 1fr', gap: 12, padding: '14px 18px', background: T.green.bg, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.green.fg }}>
        <span>Thème</span>
        <span>Sentiment</span>
        <span>Suggestion</span>
      </div>
      <M3TRow beat={1} theme="Emballage" sent="mitigé" tone="yellow" sugg="Renforcer le calage des grands colis" />
      <M3TRow beat={2} theme="SAV" sent="négatif" tone="coral" sugg="Rappel automatique au-delà de 10 min" />
      <M3TRow beat={3} theme="Produit" sent="positif" tone="green" sugg="Ajouter une vis de rechange au kit" />
      <M3TRow beat={4} theme="Site web" sent="négatif" tone="coral" sugg="Signaler le bug de paiement à l’équipe web" />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 800, width: 1680, display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, color: C.ink }}>
      <Icon name="chart" size={30} color={C.green} />
      <span>
        Sur 500 avis par mois, le tableau donne enfin des <strong>chiffres</strong> : 31 % SAV négatif, en hausse. Le texte libre devient un <strong>indicateur</strong>.
      </span>
    </div>
  </Frame>
);

// ─── Chercher dans une documentation ────────────────────────────────────────
const M3Chunk = ({ src, txt, score, beat, keep }: { src: string; txt: string; score: string; beat: number; keep: boolean }) => (
  <div className={cx(b.on(beat), keep ? undefined : b.dim(beat + 1))} style={{ background: C.card, borderRadius: 14, boxShadow: keep ? `${SHADOW_SM}, inset 5px 0 0 ${C.teal}` : SHADOW_SM, padding: '14px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, color: T.teal.fg }}>
      <span>{src}</span>
      <span style={{ fontFamily: mono }}>pertinence {score}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.4, color: C.ink }}>{txt}</div>
  </div>
);

const M3_Recherche: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Chercher dans une documentation sans tout relire</Title>
    <Lede>L’IA ne « connaît » pas vos procédures : le système retrouve les bons passages, puis l’IA répond en les citant.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 520 }}>
      <Bubble who="user" name="Question d’un salarié" w={430}>
        Je pars en déplacement à Lyon : quel plafond pour l’hôtel ?
      </Bubble>
      <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: C.muted }}>
        <IconTile name="book" tone="navy" size={52} />
        <span>
          Base : 240 pages de procédures RH et achats
          <br />
          découpées en passages
        </span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 700, top: 262, width: 520, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.teal.fg} size={19} cls={b.fade(1)}>
        1 · Passages retrouvés
      </Eyebrow>
      <M3Chunk beat={1} keep src="Note de frais · §3.2" score="0,91" txt="Hébergement : 120 € TTC par nuit à Paris, Lyon, Marseille ; 95 € ailleurs." />
      <M3Chunk beat={1} keep src="Déplacements · §1.4" score="0,77" txt="Réservation via la plateforme agréée, sauf urgence justifiée." />
      <M3Chunk beat={1} keep={false} src="Télétravail · §2.1" score="0,41" txt="Indemnité forfaitaire mensuelle pour les frais de connexion." />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1280, top: 300, width: 520 }}>
      <Eyebrow c={T.violet.fg} size={19} style={{ marginBottom: 14 }}>
        2 · Réponse sourcée
      </Eyebrow>
      <Bubble who="agent" name="Assistant RH" w={430}>
        Pour Lyon, le plafond est de <strong>120 € TTC par nuit</strong>, réservation via la plateforme agréée.
        <div style={{ marginTop: 10, fontSize: 19, color: C.blue }}>Sources : Note de frais §3.2 · Déplacements §1.4</div>
      </Bubble>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(600) }}>
      <Icon name="layers" size={26} color={C.electric} />
      Outils courants : un assistant avec base de connaissances, un projet avec fichiers joints, la recherche de Copilot dans SharePoint, NotebookLM… Toujours : « réponds uniquement
      d’après les sources, sinon dis que tu ne sais pas ».
    </div>
  </Frame>
);

// ─── Contrôler la qualité ───────────────────────────────────────────────────
const M3Ctl = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3Bar = ({ label, pct, d }: { label: string; pct: number; d: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 70px', gap: 14, alignItems: 'center' }}>
    <span style={{ fontSize: 21, color: C.soft }}>{label}</span>
    <div style={{ height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: '100%', background: G.violet, ...dl(d) }} />
    </div>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.violet }}>{pct} %</span>
  </div>
);

const M3_Qualite: Page = () => (
  <Frame mod={3}>
    <Title>Contrôler la qualité des résultats</Title>
    <Lede>Une extraction n’est utile que si on sait quand elle est fausse. Six contrôles, du moins cher au plus cher.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <M3Ctl icon="check" tone="green" title="Champs obligatoires" d={100}>
        Le JSON est-il complet ? Sinon, file d’attente.
      </M3Ctl>
      <M3Ctl icon="gauge" tone="green" title="Valeurs plausibles" d={160}>
        Date pas dans le futur, montant positif, SIRET à 14 chiffres.
      </M3Ctl>
      <M3Ctl icon="scale" tone="teal" title="Recoupements" d={220}>
        HT + TVA = TTC ; somme des lignes = total.
      </M3Ctl>
      <M3Ctl icon="book" tone="teal" title="Citation de la source" d={280}>
        Page ou phrase d’origine : vérifiable en un coup d’œil.
      </M3Ctl>
      <M3Ctl icon="layers" tone="violet" title="Double extraction" d={340}>
        Deux passes (ou deux modèles) : on compare, on alerte si écart.
      </M3Ctl>
      <M3Ctl icon="humanCheck" tone="pink" title="Échantillon humain" d={400}>
        Une personne vérifie une part des cas, chaque semaine.
      </M3Ctl>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1260, top: 262, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(300) }}>
      <Eyebrow c={C.navy} size={20}>
        Part vérifiée par un humain
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M3Bar label="Semaines 1–2" pct={100} d={500} />
        <M3Bar label="Mois 1" pct={30} d={650} />
        <M3Bar label="Mois 2" pct={10} d={800} />
        <M3Bar label="Régime établi" pct={3} d={950} />
      </div>
      <div style={{ marginTop: 22, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
        On baisse seulement si le taux d’erreur mesuré reste bas. Tout nouveau type de document repart à 100 %.
      </div>
    </div>
  </Frame>
);

// ─── Exercice : quatre erreurs dans une extraction de CV ────────────────────
const M3_ErreursCV: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Exercice : quatre erreurs dans cette extraction de CV</Title>
    <Lede>Comparez la source et le résultat, puis cliquez les pastilles. Lesquelles un contrôle automatique aurait-il détectées ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="doc">CV source (extrait)</PanelTitle>
      <div style={{ fontSize: 22, lineHeight: 1.65, color: C.ink }}>
        <strong>Inès Durand</strong> · Lille
        <br />
        Assistante de gestion · Cabinet Morel · <strong>2019 – 2024</strong>
        <br />
        Comptable junior · Fiduciaire Nord · 2016 – 2019
        <br />
        BTS Comptabilité et gestion · 2016
        <br />
        Langues : anglais courant, <strong>espagnol intermédiaire</strong>
        <br />
        Logiciels : Sage, Excel avancé
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 960, top: 262, width: 760, ...dl(150) }}>
      <CodeDark file="extraction_cv.json" size={22}>
        {'{'}
        {'\n  '}
        <Cs>"nom"</Cs>: <Cn>"Inès Durand"</Cn>,{'\n  '}
        <Cs>"email"</Cs>: <Cn>"ines.durand@gmail.com"</Cn>,{'\n  '}
        <Cs>"poste_actuel"</Cs>: <Cn>"Assistante de gestion"</Cn>,{'\n  '}
        <Cs>"experience_ans"</Cs>: <Cn>5</Cn>,{'\n  '}
        <Cs>"diplome"</Cs>: <Cn>"Licence pro comptabilité"</Cn>,{'\n  '}
        <Cs>"langues"</Cs>: [<Cn>"anglais"</Cn>],{'\n  '}
        <Cs>"logiciels"</Cs>: [<Cn>"Sage"</Cn>, <Cn>"Excel"</Cn>]{'\n'}
        {'}'}
      </CodeDark>
    </div>
    <Hotspot n={1} x={1745} y={413} side="left" title="Email inventé" w={460}>
      Aucun email dans la source : l’IA a fabriqué une adresse plausible. Contrôle : « citez la source » ou null.
    </Hotspot>
    <Hotspot n={2} x={1800} y={481} side="left" title="Expérience sous-estimée" w={460}>
      2016 – 2024 = 8 ans, pas 5 : seul le dernier poste a été compté. Contrôle : recalcul par une règle.
    </Hotspot>
    <Hotspot n={3} x={1745} y={515} side="left" title="Diplôme halluciné" w={460}>
      La source dit BTS. Contrôle : la valeur doit apparaître mot pour mot dans le document.
    </Hotspot>
    <Hotspot n={4} x={1800} y={549} side="left" title="Langue oubliée" w={460}>
      L’espagnol intermédiaire a disparu. Contrôle : demander le niveau pour chaque langue citée.
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(500) }}>
      <Callout title="Et l’éthique ?" tone="coral" icon="scale" size={23}>
        En recrutement, l’IA extrait et résume, elle ne note pas les candidats seule : risque de discrimination, et usage classé « à haut risque » par le règlement européen sur
        l’IA.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Du document au résultat structuré"
    defi="extraction"
    who="En binôme"
    minutes={40}
    where={
      <>
        La <strong>chaîne de prompts</strong> (extraction → analyse → synthèse), le <strong>résultat structuré</strong> obtenu et la liste des{' '}
        <strong>contrôles</strong> que vous appliqueriez.
      </>
    }
    objective={
      <>
        À partir d’un document professionnel <strong>anonymisé ou fictif</strong>, construire la chaîne <strong>Document → extraction → analyse → synthèse → résultat structuré</strong>.
      </>
    }
    crit={
      <>
        <CheckItem id="a3c1" size={22}>Chaque maillon a sa sortie nommée</CheckItem>
        <CheckItem id="a3c2" size={22}>Les valeurs absentes sont à null</CheckItem>
        <CheckItem id="a3c3" size={22}>Au moins 2 contrôles automatiques</CheckItem>
        <CheckItem id="a3c4" size={22}>La source est citée pour chaque fait</CheckItem>
      </>
    }
  >
    <div>1. Choisissez un cas (page suivante) ou un document type de votre métier.</div>
    <div>2. Maillon 1 · extraction : quels champs, quel format ?</div>
    <div>3. Maillon 2 · analyse : quels risques, écarts, priorités ?</div>
    <div>4. Maillon 3 · synthèse pour un lecteur précis, puis le résultat final en tableau ou JSON.</div>
    <Bonus>Faites vérifier l’extraction par une seconde passe IA et comparez.</Bonus>
  </LabPage>
);

// ─── Atelier 3 · Les cas ────────────────────────────────────────────────────
const M3Chain = ({ steps, out }: { steps: string[]; out: string }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
      <M3ChainStep n={1} tone="teal" t={steps[0]} />
      <M3ChainStep n={2} tone="pink" t={steps[1]} />
      <M3ChainStep n={3} tone="violet" t={steps[2]} />
    </div>
    <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 16, background: T.navy.bg, borderRadius: 14, padding: '18px 24px' }}>
      <Icon name="flag" size={30} color={C.navy} />
      <span style={{ fontSize: 23, color: C.ink }}>
        <strong>Résultat structuré :</strong> {out}
      </span>
    </div>
  </div>
);

const M3ChainStep = ({ n, tone, t }: { n: number; tone: Tone; t: string }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, borderTop: `6px solid ${STRONG[tone]}`, padding: '18px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <Num n={n} tone={tone} size={36} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: T[tone].fg }}>{['Extraction', 'Analyse', 'Synthèse'][n - 1]}</span>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{t}</div>
  </div>
);

const M3_Cas: Page = () => (
  <Frame mod={3} kind="lab">
    <Title>Atelier 3 · Cinq documents au choix</Title>
    <Tabs initial="client" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <TabBtn id="client" tone="blue" icon="mail">
          Demande client
        </TabBtn>
        <TabBtn id="cv" tone="violet" icon="user">
          CV
        </TabBtn>
        <TabBtn id="cdc" tone="teal" icon="doc">
          Cahier des charges
        </TabBtn>
        <TabBtn id="compare" tone="pink" icon="layers">
          Comparer deux documents
        </TabBtn>
        <TabBtn id="tableau" tone="green" icon="table">
          Document → tableau
        </TabBtn>
      </div>
      <TabPane id="client">
        <M3Chain steps={['Demandeur, objet, produit, échéance, pièces jointes citées', 'Urgence, ton, risque de perte du client, infos manquantes', '3 lignes pour le commercial + questions à poser']} out="fiche JSON + brouillon de réponse à valider" />
      </TabPane>
      <TabPane id="cv">
        <M3Chain steps={['Postes, dates, diplômes, compétences, langues avec niveau', 'Correspondance avec les 5 critères de la fiche de poste, sans note globale', 'Résumé factuel de 5 lignes pour le recruteur']} out="ligne de tableau « candidat × critère » (oui / non / à vérifier)" />
      </TabPane>
      <TabPane id="cdc">
        <M3Chain steps={['Exigences, livrables, délais, critères d’attribution, pénalités', 'Exigences floues, risques, points bloquants, questions au client', 'Note go / no-go d’une page pour la direction']} out="tableau des exigences avec statut « couvert / partiel / non couvert »" />
      </TabPane>
      <TabPane id="compare">
        <M3Chain steps={['Clauses ou sections de chaque version, alignées', 'Écarts : ajout, suppression, modification, impact', 'Les 3 écarts qui comptent, pour le décideur']} out="tableau clause / avant / après / impact (favorable, défavorable, neutre)" />
      </TabPane>
      <TabPane id="tableau">
        <M3Chain steps={['Chaque ligne d’information du compte rendu ou du rapport', 'Classement : décision, action, risque, information', 'Les actions avec responsable et échéance']} out="tableau prêt à coller dans Excel ou à envoyer dans un outil de suivi" />
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.coral, ...dl(500) }}>
      <Icon name="lock" size={26} /> Documents fictifs ou anonymisés uniquement : ni nom réel, ni donnée client, ni contrat en cours.
    </div>
  </Frame>
);

// ─── QCM M3 (plusieurs réponses) ────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="Contrôles automatiques"
    multi
    q="Votre workflow extrait les champs de 300 factures fournisseurs par mois. Quels contrôles automatiques mettez-vous en place ?"
    explain="Les bons contrôles sont des règles vérifiables : recoupement des montants, plausibilité, format. Demander à l’IA si elle est sûre d’elle ne remplace pas une règle ; tout relire indéfiniment annule le gain."
  >
    <Opt ok why="Un recoupement arithmétique détecte la plupart des erreurs de lecture de montants.">
      Vérifier que HT + TVA = TTC
    </Opt>
    <Opt ok why="Une facture datée dans le futur signale une erreur de lecture (jour et mois inversés…).">
      Rejeter une date de facture dans le futur
    </Opt>
    <Opt why="Utile comme indice, mais l’IA peut être sûre d’elle et se tromper : ce n’est pas un contrôle.">Demander à l’IA si elle est certaine</Opt>
    <Opt ok why="Un format connu (14 chiffres) se vérifie par une règle simple.">
      Vérifier que le SIRET a 14 chiffres
    </Opt>
  </QcmPage>
);

// ─── Synthèse M3 ────────────────────────────────────────────────────────────
const M3_Synthese: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Ce qu’on retient du module 3</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="teal" d={100}>
        Huit opérations sur un document, souvent <strong>enchaînées</strong> : extraire, analyser, synthétiser.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Un résumé se conçoit <strong>pour un lecteur et un usage</strong>, avec une longueur chiffrée.
      </SynthRow>
      <SynthRow n={3} tone="green" d={300}>
        Le texte libre devient un <strong>tableau</strong>, donc un indicateur.
      </SynthRow>
      <SynthRow n={4} tone="navy" d={400}>
        Pour une doc interne : <strong>retrouver les passages, puis répondre en les citant</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        <strong>Contrôles automatiques + échantillon humain</strong> : jamais d’extraction sans vérification.
      </SynthRow>
    </div>
    <ProjectCard mod={3}>
      Vous savez quelles <strong>données</strong> votre processus extrait, sous quel <strong>format</strong>, et quels <strong>contrôles</strong> les vérifient.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Operations, M3_Extraction, M3_Resume, M3_Comparer, M3_Transformer, M3_Recherche, M3_Qualite, M3_ErreursCV, M3_Atelier, M3_Cas, M3_Qcm, M3_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M3 · 13:30

OBJECTIF — Relancer après le déjeuner, annoncer le module documents.

DIRE — « Bon retour. Une grande part de l’information de l’entreprise dort dans des documents : emails, PDF, contrats, CV, comptes rendus. Ce module apprend à en faire des données exploitables, et surtout vérifiées. L’atelier 3 vous fera construire une chaîne complète : document, extraction, analyse, synthèse, résultat structuré. »

TRANSITION — « Huit opérations à connaître. »`,
  `⏱ 3 min · HUIT OPÉRATIONS

OBJECTIF — Couvrir l’analyse, l’extraction, le résumé, la comparaison, la classification, la transformation, l’identification et la recherche documentaire.

DIRE — « Huit opérations, que vous connaissez en partie. Ce qui change en automatisation, c’est qu’on les enchaîne sur le même fichier : on extrait, puis on analyse ce qu’on a extrait, puis on synthétise pour un lecteur. Et deux règles transversales, en bas : le résultat est toujours structuré et toujours contrôlé. »

ANIMATION — Demander : « Quel document de votre métier lisez-vous le plus souvent ? » Noter deux ou trois réponses pour l’atelier.

TRANSITION — « Voyons l’extraction au ralenti. »`,
  `⏱ 4 min · EXTRACTION (démo interactive)

OBJECTIF — Montrer l’extraction automatique d’informations et la traçabilité vers la source.

DIRE — « Une demande de devis de formation arrive par email. Je clique : chaque champ trouvé s’affiche à droite, et sa source s’allume à gauche dans la même couleur. » Cliquer 6 ou 7 fois en commentant. « Regardez la période : “la semaine du 17 novembre” devient une date normée, que le tableur et l’agenda comprennent. Et le financement : pas mentionné, donc null. Pas une supposition. »

INSISTER — Le lien champ ↔ source est la clé de la vérification : demandez toujours à l’IA de pouvoir le montrer.

TRANSITION — « Après l’extraction, le résumé. »`,
  `⏱ 4 min · RÉSUMÉ ET SYNTHÈSE (onglets)

OBJECTIF — Distinguer les formats de résumé selon le lecteur et l’usage.

DIRE — « Le même rapport SAV de 14 pages. Pour la direction dans Teams : une phrase avec les chiffres. » Onglet 2 : « Pour le responsable SAV en réunion : cinq points clés. » Onglet 3 : « Pour le tableau de suivi : décisions, actions avec responsable et date, risques. C’est ce format-là qui se branche le mieux dans un workflow. »

INSISTER — Trois réglages à droite : le lecteur, une longueur chiffrée, la citation de la source.

TRANSITION — « Autre opération fréquente : comparer. »`,
  `⏱ 4 min · COMPARER DEUX DOCUMENTS (3 clics)

OBJECTIF — Montrer la comparaison de documents et son intégration dans un workflow.

DIRE — « Le fournisseur vous renvoie son contrat “avec quelques corrections”. » Clic : « Article 4, le délai passe de 10 jours à 15 jours ouvrés. » Clic : « Article 7, les pénalités baissent et sont plafonnées. » Clic : « Article 11, une tacite reconduction apparaît. Trois écarts, deux défavorables. Dans un workflow : le dépôt du fichier déclenche la comparaison avec la version signée, et le tableau part chez le juriste. L’IA repère, l’humain tranche. »

TRANSITION — « Transformer du texte en données. »`,
  `⏱ 3 min · TRANSFORMER EN TABLEAU (4 clics)

OBJECTIF — Montrer la transformation de données non structurées.

DIRE — « Quatre avis clients en texte libre. » Clic par ligne : « Emballage, mitigé. SAV, négatif. Produit, positif. Site web, négatif. » Dernier clic : « Sur 500 avis par mois, ça devient un indicateur : 31 % d’avis négatifs sur le SAV, et on peut suivre son évolution. On est passé de la lecture à la mesure. »

ANIMATION — Demander : « Quel texte libre de votre métier mériterait de devenir un tableau ? » (enquêtes, comptes rendus, tickets…)

TRANSITION — « Et quand la réponse se trouve dans une documentation ? »`,
  `⏱ 4 min · RECHERCHE DOCUMENTAIRE (3 clics)

OBJECTIF — Expliquer simplement la recherche dans une documentation (principe du RAG, sans jargon).

DIRE — « Un salarié demande le plafond d’hôtel à Lyon. L’IA ne connaît pas vos procédures. » Clic : « Le système cherche d’abord les passages pertinents dans 240 pages. » Clic : « Il écarte ceux qui ne servent pas. » Clic : « Et l’IA répond uniquement d’après les passages retenus, en les citant. C’est ce que font les assistants avec base de connaissances, les projets avec fichiers, Copilot sur SharePoint, NotebookLM. La phrase magique : réponds uniquement d’après les sources, sinon dis que tu ne sais pas. »

NUANCE — La qualité dépend surtout de la documentation : à jour, sans doublons ni versions contradictoires.

TRANSITION — « Reste l’essentiel : vérifier. »`,
  `⏱ 4 min · CONTRÔLE QUALITÉ

OBJECTIF — Donner une méthode de contrôle de la qualité des résultats.

DIRE — « Six contrôles, du moins cher au plus cher. Les quatre premiers sont automatiques : champs obligatoires, valeurs plausibles, recoupements arithmétiques, citation de la source. Le cinquième, la double extraction, coûte deux appels. Le sixième, l’échantillon humain, coûte du temps. À droite, la règle de décroissance : tout vérifier au début, puis baisser par paliers, et seulement si le taux d’erreur mesuré reste bas. »

INSISTER — Tout nouveau type de document repart à 100 % de vérification.

TRANSITION — « Mettez-vous à la place du contrôleur. »`,
  `⏱ 5 min · EXERCICE : ERREURS DANS UN CV (hotspots)

OBJECTIF — Identifier les erreurs typiques d’une extraction et le contrôle qui les détecte.

DIRE — « À gauche le CV, à droite ce que l’IA a extrait. Quatre erreurs. Cherchez. » Cliquer les pastilles au fil des trouvailles. « Un email inventé : hallucination. Huit ans d’expérience comptés cinq. Un diplôme halluciné. Une langue oubliée. Trois sur quatre se détectent automatiquement : valeur présente mot pour mot dans la source, calcul par une règle, null obligatoire si absent. »

INSISTER — L’encart du bas : en recrutement, l’IA extrait et résume ; elle ne classe pas les candidats seule. Le règlement européen sur l’IA classe ces usages « à haut risque ».

TRANSITION — « À vous : atelier 3. »`,
  `⏱ 40 min · ATELIER 3 · DOCUMENT → RÉSULTAT STRUCTURÉ (minuteur)

OBJECTIF — Construire la chaîne Document → extraction → analyse → synthèse → résultat structuré.

CONSIGNE À DIRE — « En binôme, un document fictif ou anonymisé. Trois maillons : extraction, analyse, synthèse, puis le résultat final en tableau ou en JSON. Les valeurs absentes sont à null, chaque fait cite sa source, et vous listez au moins deux contrôles automatiques. »

ANIMATION — Afficher la page des cas. Rappeler la règle : aucun document réel avec données personnelles ou confidentielles. Passer dans les rangs : vérifier les null et les citations.

DÉBRIEF — Deux binômes montrent leur résultat structuré et un contrôle qui a détecté une erreur.`,
  `⏱ (pendant l’atelier) · LES CINQ CAS

OBJECTIF — Proposer des documents variés : demande client, CV, cahier des charges, comparaison, document → tableau.

DIRE — « Pour chaque cas : ce qu’on extrait, ce qu’on analyse, ce qu’on synthétise, et la forme du résultat. Pour le CV, notez : pas de note globale, une correspondance critère par critère. »

TRANSITION — Après l’atelier : « Un QCM pour vérifier les réflexes de contrôle. »`,
  `⏱ 3 min · QCM 3 (plusieurs réponses)

OBJECTIF — Vérifier la notion de contrôle automatique.

DIRE — « Plusieurs bonnes réponses : cochez, puis validez. » Laisser voter. Valider. Cliquer chaque option pour l’explication.

INSISTER — « Demander à l’IA si elle est sûre » est un indice, pas un contrôle.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE M3

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Cinq idées : on enchaîne les opérations ; un résumé se conçoit pour un lecteur ; le texte libre devient un indicateur ; pour une doc interne, on cite les sources ; jamais d’extraction sans contrôle. Côté projet : vous savez quelles données votre processus extrait et comment vous les vérifiez. »

TRANSITION — « Pause. Ensuite, on assemble tout : concevoir un workflow complet. »`,
];
// @@NOTES-END
