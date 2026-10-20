// ─── Module 5 · Cadrer une fonctionnalité IA ────────────────────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title="Cadrer une fonctionnalité IA"
    sub="Une user story IA se teste comme les autres… à condition d’écrire des critères d’acceptation adaptés à un système probabiliste."
    dur="55 min"
    labs={
      <>
        <Tag tone="green" size={20}>
          Exercice · story à corriger
        </Tag>
        <Tag tone="violet" size={20}>
          QCM 8
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Pourquoi la user story classique ne suffit pas</SecItem>
    <SecItem n={2}>Le canevas d’une user story IA, en huit blocs</SecItem>
    <SecItem n={3}>Des critères d’acceptation testables : comportement et statistique</SecItem>
    <SecItem n={4}>Definition of Ready, Definition of Done, découpage</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Pourquoi la story classique ne suffit pas ──────────────────────────────
const M5Col = ({ tone, icon, title, items, cls }: { tone: Tone; icon: IconName; title: string; items: string[]; cls: string }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it) => (
        <Bullet key={it} tone={tone} size={23}>
          {it}
        </Bullet>
      ))}
    </div>
  </div>
);

const M5_Why: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Pourquoi la user story classique ne suffit pas</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680 }}>
      <Code title="La story de B1, écrite comme d’habitude" size={23}>
        <Jk>En tant que</Jk> salarié, <Jk>je veux</Jk> que le montant soit lu sur la photo <Jk>afin de</Jk> ne plus le saisir.{'\n'}
        <Jc>Critère :</Jc> <Jk>étant donné</Jk> une photo de ticket, <Jk>quand</Jk> je la dépose, <Jk>alors</Jk> le montant est <Jn>rempli correctement</Jn>.
      </Code>
    </div>
    <div className={b.pop(1)} style={{ position: 'absolute', left: 1330, top: 330, transform: 'rotate(-4deg)', border: `4px solid ${C.coral}`, color: C.coral, borderRadius: 12, padding: '6px 18px', fontFamily: display, fontWeight: 800, fontSize: 25, background: '#fff' }}>
      Jamais vrai à 100 %
    </div>
    <div style={{ position: 'absolute', left: 120, top: 440, width: 1680, display: 'flex', gap: 24 }}>
      <M5Col
        tone="grey"
        icon="code"
        title="Feature classique"
        cls={b.on(1)}
        items={['Même entrée, même sortie', 'Critère binaire : ça marche ou pas', 'Testé une fois, reste vrai', 'Les cas limites se listent']}
      />
      <M5Col
        tone="violet"
        icon="brain"
        title="Feature IA"
        cls={b.on(2)}
        items={['Juste 96 fois sur 100, jamais 100', 'Critère statistique, sur un jeu de test', 'Se dégrade avec le temps', 'Il faut décrire le comportement quand elle doute']}
      />
    </div>
  </Frame>
);

// ─── Le canevas en huit blocs ───────────────────────────────────────────────
const CANVAS: { icon: IconName; tone: Tone; t: string; q: string }[] = [
  { icon: 'user', tone: 'blue', t: 'La story', q: 'En tant que… je veux… afin de… et l’indicateur de succès' },
  { icon: 'brain', tone: 'violet', t: 'Le comportement IA', q: 'Ce que fait le modèle, et son niveau d’automatisation' },
  { icon: 'database', tone: 'teal', t: 'Les données', q: 'Entrées, sources, données personnelles, droit d’usage' },
  { icon: 'target', tone: 'green', t: 'La performance', q: 'Métrique, seuil, jeu de test, sous-groupes' },
  { icon: 'gauge', tone: 'yellow', t: 'Le doute et le repli', q: 'Seuils de confiance, saisie manuelle, panne' },
  { icon: 'pointer', tone: 'pink', t: 'L’UX', q: 'Transparence, correction, retour utilisateur' },
  { icon: 'shield', tone: 'coral', t: 'Les garde-fous', q: 'Biais, sécurité, RGPD, AI Act' },
  { icon: 'chart', tone: 'navy', t: 'La mesure en production', q: 'Indicateurs, seuil d’alerte, ré-entraînement' },
];

const CanvasBlock = ({ i, c, cls, style }: { i: number; c: (typeof CANVAS)[number]; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 20px', borderTop: `6px solid ${STRONG[c.tone]}`, boxSizing: 'border-box', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={i + 1} tone={c.tone} size={38} />
      <IconTile name={c.icon} tone={c.tone} size={44} />
    </div>
    <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 25, lineHeight: 1.15, color: C.navy }}>{c.t}</div>
    <div style={{ marginTop: 6, fontSize: 20, lineHeight: 1.38, color: C.soft }}>{c.q}</div>
  </div>
);

const M5_Canvas: Page = () => (
  <Frame mod={5}>
    <Title>Le canevas d’une user story IA : huit blocs</Title>
    <Lede>Les deux premiers ressemblent à une story classique. Les six suivants sont ce qui la rend livrable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      {CANVAS.map((c, i) => (
        <CanvasBlock key={c.t} i={i} c={c} cls={A.in} style={{ minHeight: 252, ...dl(100 + i * 90) }} />
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 832, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(1000) }}>
      <Icon name="note" size={28} color={C.green} />
      C’est le canevas du TP de fin de journée : gardez-le sous les yeux.
    </div>
  </Frame>
);

// ─── Six familles de critères ───────────────────────────────────────────────
const M5Fam = ({ icon, tone, title, children, ex, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; ex: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 25, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.38, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 10, background: T[tone].bg, borderRadius: 10, padding: '10px 14px', fontSize: 20, lineHeight: 1.38, color: C.ink }}>
      <strong style={{ color: T[tone].fg }}>B1 · </strong>
      {ex}
    </div>
  </div>
);

const M5_Families: Page = () => (
  <Frame mod={5}>
    <Title>Six familles de critères d’acceptation</Title>
    <Lede>Les critères classiques restent. On en ajoute cinq, propres à l’IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 258, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <M5Fam icon="check" tone="blue" title="Fonctionnels" ex="Le montant lu s’affiche dans le champ de la note." d={100}>
        Les critères habituels : ce que voit et fait l’utilisateur.
      </M5Fam>
      <M5Fam icon="target" tone="green" title="Performance" ex="Montant exact ≥ 95 % sur le jeu de test v1." d={180}>
        Une métrique, un seuil, un jeu de test nommé.
      </M5Fam>
      <M5Fam icon="gauge" tone="yellow" title="Doute et repli" ex="Sous 60 % de confiance : champ vide, photo affichée." d={260}>
        Ce que fait le produit quand l’IA hésite ou tombe en panne.
      </M5Fam>
      <M5Fam icon="pointer" tone="pink" title="UX et transparence" ex="Chaque champ lu porte la mention « lu automatiquement »." d={340}>
        Dire que c’est l’IA, montrer le doute, corriger facilement.
      </M5Fam>
      <M5Fam icon="shield" tone="coral" title="Éthique et conformité" ex="Nom et carte masqués avant tout envoi au fournisseur." d={420}>
        Biais par sous-groupe, données personnelles, transparence.
      </M5Fam>
      <M5Fam icon="server" tone="navy" title="Exploitation" ex="≤ 5 s pour 95 % des tickets, ≤ 1 centime par ticket." d={500}>
        Latence, coût, journalisation, seuil d’alerte.
      </M5Fam>
    </div>
  </Frame>
);

// ─── Gherkin adapté ─────────────────────────────────────────────────────────
const M5Note = ({ tone, icon, title, children, cls }: { tone: Tone; icon: IconName; title: string; children: ReactNode; cls: string }) => (
  <div className={cls}>
    <Callout title={title} tone={tone} icon={icon} size={22}>
      {children}
    </Callout>
  </div>
);

const M5_Gherkin: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Given / When / Then : deux types de critères</Title>
    <Lede>Des scénarios de comportement, testés comme d’habitude, et des critères statistiques, vérifiés à chaque version.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080 }}>
      <Code size={20} style={{ whiteSpace: 'pre-wrap' }}>
        <Jc># Comportement</Jc>
        {'\n'}
        <Jk>Scénario :</Jk> confiance élevée{'\n'}
        {'  '}
        <Jk>Étant donné</Jk> une confiance ≥ <Jn>90 %</Jn> sur le montant{'\n'}
        {'  '}
        <Jk>Quand</Jk> le salarié dépose la photo{'\n'}
        {'  '}
        <Jk>Alors</Jk> le montant est pré-rempli et marqué « lu automatiquement »{'\n'}
        {'\n'}
        <Jk>Scénario :</Jk> doute{'\n'}
        {'  '}
        <Jk>Étant donné</Jk> une confiance entre <Jn>60</Jn> et <Jn>90 %</Jn>
        {'\n'}
        {'  '}
        <Jk>Alors</Jk> le champ est surligné « à vérifier » et la zone du ticket encadrée{'\n'}
        {'\n'}
        <Jc># Statistique · jeu de test v1, 750 tickets</Jc>
        {'\n'}
        <Jk>Scénario :</Jk> performance{'\n'}
        {'  '}
        <Jk>Alors</Jk> le montant est exact pour au moins <Jn>95 %</Jn> des tickets{'\n'}
        {'  '}
        <Jk>Et</Jk> aucun sous-groupe (pays, type) n’est sous <Jn>90 %</Jn>
        {'\n'}
        {'  '}
        <Jk>Et</Jk> moins de <Jn>1 %</Jn> de montants faux <Js>non signalés</Js>
      </Code>
    </div>
    <div style={{ position: 'absolute', left: 1250, top: 262, width: 550, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M5Note tone="blue" icon="check" title="Comportement" cls={A.right}>
        Testable automatiquement, en simulant la confiance. Il passe ou il casse, comme d’habitude.
      </M5Note>
      <M5Note tone="violet" icon="chart" title="Statistique" cls={b.on(1)}>
        Vérifié sur le jeu de test figé, à chaque nouvelle version du modèle. Jamais sur trois exemples choisis.
      </M5Note>
      <M5Note tone="coral" icon="alert" title="Le critère qui compte" cls={b.on(2)}>
        Un montant faux mais surligné est rattrapé. Un montant faux non signalé part au remboursement : c’est lui qu’on plafonne.
      </M5Note>
    </div>
  </Frame>
);

// ─── Choisir la métrique ────────────────────────────────────────────────────
const M5_METRICS: { id: string; tone: Tone; icon: IconName; t: string; q: string; m: string; why: string }[] = [
  { id: 'B1', tone: 'blue', icon: 'barcode', t: 'Lire le ticket', q: 'Quelle erreur coûte le plus ?', m: 'Montants faux non signalés < 1 %', why: 'L’erreur surlignée est rattrapée ; l’erreur silencieuse coûte.' },
  { id: 'B2', tone: 'teal', icon: 'layers', t: 'Proposer la catégorie', q: 'Que se passe-t-il si elle est fausse ?', m: 'Catégorie exacte ≥ 90 %, correction en 1 clic', why: 'Erreur bénigne et visible : l’exactitude globale suffit.' },
  { id: 'B3', tone: 'coral', icon: 'alert', t: 'Notes suspectes', q: 'Rater une fraude ou soupçonner à tort ?', m: 'Rappel ≥ 80 %, au plus 50 alertes pour 1 000 notes', why: 'On plafonne la charge des comptables et les salariés soupçonnés.' },
  { id: 'B4', tone: 'violet', icon: 'chat', t: 'Assistant voyage', q: 'Pire : ne pas savoir, ou inventer ?', m: '≥ 90 % de réponses justes et sourcées · 0 invention hors périmètre', why: 'Mieux vaut « je ne sais pas » qu’une règle inventée.' },
];

const M5_Metric: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Choisir la métrique : partir du coût de l’erreur</Title>
    <Lede>« Exactitude » ne suffit presque jamais. Pour chaque idée, débattez de la question, puis retournez la carte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      {M5_METRICS.map((m, i) => (
        <FlipCard
          key={m.id}
          w={403}
          h={520}
          tone={m.tone}
          backTone={m.tone}
          cls={A.in}
          style={dl(100 + i * 100)}
          front={
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IconTile name={m.icon} tone={m.tone} size={56} />
                <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, color: T[m.tone].fg }}>{m.id}</span>
              </div>
              <div style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: C.navy }}>{m.t}</div>
              <div style={{ marginTop: 22, fontSize: 27, lineHeight: 1.35, fontStyle: 'italic', color: T[m.tone].fg }}>« {m.q} »</div>
            </>
          }
          back={
            <>
              <Eyebrow c={T[m.tone].fg} size={18}>
                Critère proposé
              </Eyebrow>
              <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 26, lineHeight: 1.25, color: C.navy }}>{m.m}</div>
              <div style={{ marginTop: 'auto', fontSize: 21, lineHeight: 1.4, color: C.ink }}>{m.why}</div>
            </>
          }
        />
      ))}
    </div>
  </Frame>
);

// ─── Des critères flous aux critères testables ──────────────────────────────
const M5Pair = ({ n, bad, good }: { n: number; bad: string; good: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '600px 60px 1fr', alignItems: 'center', gap: 12 }}>
    <div className={A.left} style={{ background: T.coral.bg, borderRadius: 12, padding: '14px 20px', fontSize: 23, color: T.coral.fg, fontStyle: 'italic', ...dl(n * 100) }}>
      « {bad} »
    </div>
    <div className={b.fade(n)}>
      <FlowArrow w={56} color={C.green} />
    </div>
    <div className={b.left(n)} style={{ background: T.green.bg, borderRadius: 12, padding: '14px 20px', fontSize: 23, lineHeight: 1.35, color: C.ink, boxShadow: `inset 0 0 0 2px ${T.green.bd}` }}>
      {good}
    </div>
  </div>
);

const M5_BadGood: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Des critères flous aux critères testables</Title>
    <Lede>Un bon critère dit quoi mesurer, sur quoi, et à partir de quel seuil on dit « fait ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Pair n={1} bad="Le modèle doit être précis" good={<>Montant exact <strong>≥ 95 %</strong> sur le <strong>jeu de test v1</strong> (750 tickets)</>} />
      <M5Pair n={2} bad="L’IA doit être rapide" good={<>Pré-remplissage affiché en <strong>≤ 5 s</strong> pour 95 % des tickets</>} />
      <M5Pair n={3} bad="Il ne faut pas de biais" good={<>Écart d’exactitude <strong>≤ 5 points</strong> entre tickets français et étrangers</>} />
      <M5Pair n={4} bad="L’utilisateur peut corriger" good={<>Correction d’un champ <strong>en 1 clic</strong>, sans ressaisir les autres</>} />
      <M5Pair n={5} bad="Les données sont protégées" good={<>Nom et carte <strong>masqués avant tout envoi</strong>, vérifié par un test automatisé</>} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, display: 'flex', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="bulb" size={26} color={C.violet} /> Le test : deux personnes qui lisent le critère concluent-elles la même chose ?
    </div>
  </Frame>
);

// ─── Definition of Ready / Done ─────────────────────────────────────────────
const M5_Dor: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Definition of Ready, Definition of Done : version IA</Title>
    <Lede>À ajouter à vos définitions d’équipe. Cochez ce que votre équipe pratique déjà.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, width: 820, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Eyebrow c={C.blue} size={20} style={{ marginBottom: 4 }}>
          Ready · avant d’entrer en sprint
        </Eyebrow>
        <CheckItem id="r1" size={21} tone="blue">Problème et indicateur de succès définis</CheckItem>
        <CheckItem id="r2" size={21} tone="blue">Données identifiées, droit d’usage validé par le DPO</CheckItem>
        <CheckItem id="r3" size={21} tone="blue">Jeu de test constitué et figé</CheckItem>
        <CheckItem id="r4" size={21} tone="blue">Seuils fixés avec le métier</CheckItem>
        <CheckItem id="r5" size={21} tone="blue">Niveau d’automatisation et règle de doute choisis</CheckItem>
        <CheckItem id="r6" size={21} tone="blue">Comportement en cas de panne décrit</CheckItem>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 980, top: 250, width: 820, display: 'flex', flexDirection: 'column', gap: 8, ...dl(200) }}>
        <Eyebrow c={C.green} size={20} style={{ marginBottom: 4 }}>
          Done · avant de dire « livré »
        </Eyebrow>
        <CheckItem id="d1" size={21}>Seuils statistiques atteints sur le jeu de test</CheckItem>
        <CheckItem id="d2" size={21}>Scénarios de comportement au vert</CheckItem>
        <CheckItem id="d3" size={21}>Transparence et correction en place dans l’UX</CheckItem>
        <CheckItem id="d4" size={21}>Résultats vérifiés par sous-groupe</CheckItem>
        <CheckItem id="d5" size={21}>Journal et tableau de bord actifs, seuil d’alerte réglé</CheckItem>
        <CheckItem id="d6" size={21}>Fiche du modèle à jour : version, données, limites</CheckItem>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 690, width: 1680, display: 'flex', gap: 24, alignItems: 'center', ...dl(500) }}>
        <CheckScore
          max={12}
          label="Maturité IA de l’équipe"
          style={{ width: 520, padding: '16px 24px' }}
          levels={[
            { min: 0, text: 'Tout est à construire.', tone: 'coral' },
            { min: 5, text: 'Bonne base : complétez la DoD.', tone: 'yellow' },
            { min: 10, text: 'Prête pour la production.', tone: 'green' },
          ]}
        />
        <div style={{ flex: 1 }}>
          <Callout title="Le piège" tone="coral" icon="alert" size={22}>
            Une story IA « Done » sans tableau de bord est une story dont personne ne saura quand elle cesse de marcher.
          </Callout>
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Découper une feature IA ────────────────────────────────────────────────
const M5Slice = ({ n, tone, title, sub, tag, w }: { n: number; tone: Tone; title: string; sub: string; tag: string; w: number }) => (
  <div className={n === 1 ? A.left : b.left(n - 1)} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <div style={{ width: w, flex: 'none', height: 74, borderRadius: 14, background: STRONG[tone], display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', boxSizing: 'border-box', color: tone === 'yellow' ? C.ink : '#fff' }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30 }}>{n}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 23, lineHeight: 1.15 }}>{title}</span>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 22, lineHeight: 1.35, color: C.soft }}>{sub}</div>
    </div>
    <Tag tone={tone} size={18}>
      {tag}
    </Tag>
  </div>
);

const M5_Slicing: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Découper : commencer petit, monter par preuves</Title>
    <Lede>Un champ, un seuil élevé, peu de clients. Chaque tranche livre de la valeur et apprend quelque chose.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Slice n={1} tone="grey" w={560} title="Spike : 3 approches, 200 tickets" sub="Durée bornée à deux semaines. Livrable : une recommandation chiffrée." tag="exploration" />
      <M5Slice n={2} tone="blue" w={660} title="Montant seul, confiance ≥ 90 %" sub="Pilote chez trois clients. Tout le reste reste manuel." tag="première valeur" />
      <M5Slice n={3} tone="teal" w={760} title="Surlignage du doute + signalement" sub="La zone 60–90 % devient utile ; les corrections alimentent le journal." tag="UX de l’erreur" />
      <M5Slice n={4} tone="violet" w={860} title="Date, TVA, commerçant" sub="Les autres champs, un par un, chacun avec son seuil." tag="élargissement" />
      <M5Slice n={5} tone="green" w={960} title="Tableau de bord et alerte de dérive" sub="La condition pour généraliser à tous les clients." tag="exploitation" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      <Callout title="Le spike est une story à part entière" tone="blue" icon="flask" size={23}>
        Sa définition de « fait » n’est pas un logiciel livré, mais une décision éclairée : continuer, changer d’approche, ou arrêter.
      </Callout>
    </div>
  </Frame>
);

// ─── Exercice : la story à corriger ─────────────────────────────────────────
const M5Flaw = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px', borderLeft: `6px solid ${C.coral}` }}>
    <Num n={n} tone="coral" size={36} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5Mark = ({ n, children }: { n: number; children: ReactNode }) => (
  <span style={{ position: 'relative' }}>
    <span className={b.hi(n)} style={{ borderRadius: 6, padding: '0 4px', background: 'rgba(224,72,72,.0)' }}>
      {children}
    </span>
    <sup className={b.pop(n)} style={{ display: 'inline-block', marginLeft: 4, fontFamily: display, fontWeight: 800, fontSize: 18, color: C.coral }}>
      {n}
    </sup>
  </span>
);

const M5_Fix: Page = () => (
  <Frame mod={5} kind="exercice" beats={5}>
    <Title>Exercice : cette story passerait en sprint… et échouerait</Title>
    <Lede>B4, rédigée à la va-vite. Trois minutes en binôme : trouvez au moins cinq problèmes.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 780, boxSizing: 'border-box', background: '#FFFDF4', borderRadius: 8, boxShadow: '0 24px 44px -26px rgba(11,31,92,.55), 0 0 0 1px rgba(16,24,40,.08)', padding: '26px 30px', transform: 'rotate(-1deg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.muted }}>SPEN-412</span>
        <Tag tone="yellow" size={17}>
          Prête pour le sprint ?
        </Tag>
      </div>
      <div style={{ marginTop: 14, fontSize: 27, lineHeight: 1.5, color: C.ink }}>
        En tant que salarié, je veux <M5Mark n={1}>un chatbot IA</M5Mark> afin <M5Mark n={2}>d’avoir des réponses</M5Mark>.
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.08em', color: C.muted }}>CRITÈRES D’ACCEPTATION</div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 25, lineHeight: 1.45, color: C.ink }}>
        <div>
          – Le chatbot répond à <M5Mark n={3}>toutes les questions</M5Mark>.
        </div>
        <div>
          – Les réponses sont <M5Mark n={4}>correctes</M5Mark>.
        </div>
        <div>
          – <M5Mark n={5}>Il utilise GPT</M5Mark>.
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M5Flaw n={1} title="Une solution, pas un besoin">
        Quel problème ? 1 050 tickets « remboursable ? » par mois.
      </M5Flaw>
      <M5Flaw n={2} title="Une valeur non mesurable">
        Afin de quoi ? Diviser ces tickets par deux en trois mois.
      </M5Flaw>
      <M5Flaw n={3} title="Un périmètre infini">
        Seulement la politique du client ; hors périmètre, il le dit et passe la main.
      </M5Flaw>
      <M5Flaw n={4} title="Un critère non testable">
        ≥ 90 % de réponses justes et sourcées sur 100 questions de test.
      </M5Flaw>
      <M5Flaw n={5} title="Un choix technique déguisé">
        Le modèle se choisit sur preuves, pas dans la story.
      </M5Flaw>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 800, width: 780 }}>
      <Callout title="Et ce qui manque" tone="violet" icon="plus" size={21}>
        Sources citées, mention « assistant IA », cloisonnement entre clients, passage à un humain, indicateurs en production.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM 8 ──────────────────────────────────────────────────────────────────
const M5_Qcm8: Page = () => (
  <QcmPage
    mod={5}
    n={8}
    title="Un critère bien écrit"
    q="Lequel de ces critères d’acceptation est correctement formulé pour une feature IA ?"
    explain="Une métrique, un seuil, un jeu de test nommé : deux personnes qui le lisent concluent la même chose."
  >
    <Opt why="« Fiable » n’est ni mesuré ni borné : chacun en aura sa propre lecture.">Le modèle est fiable</Opt>
    <Opt why="Impossible pour un système probabiliste : la story ne serait jamais « faite ».">L’IA ne se trompe jamais</Opt>
    <Opt ok why="Mesurable, borné, reproductible : c’est un critère statistique bien formé.">
      Sur le jeu de test v1 (750 tickets), le montant est exact dans au moins 95 % des cas
    </Opt>
    <Opt why="C’est un choix technique, pas un résultat attendu : il n’a rien à faire dans les critères.">
      Le modèle utilise la dernière version du LLM
    </Opt>
  </QcmPage>
);

const M5_Recap: Page = () => (
  <RecapPage
    mod={5}
    title="À retenir du module 5"
    items={[
      { icon: 'brain', tone: 'violet', title: 'Une story probabiliste', text: 'Jamais vraie à 100 % : on décrit un seuil et le comportement quand l’IA doute.' },
      { icon: 'layers', tone: 'blue', title: 'Huit blocs', text: 'Story, comportement, données, performance, doute, UX, garde-fous, mesure.' },
      { icon: 'check', tone: 'green', title: 'Deux types de critères', text: 'Scénarios de comportement et critères statistiques sur un jeu de test figé.' },
      { icon: 'target', tone: 'coral', title: 'Le coût de l’erreur', text: 'Il dicte la métrique : l’erreur silencieuse est souvent celle à plafonner.' },
      { icon: 'flag', tone: 'teal', title: 'DoR et DoD adaptées', text: 'Jeu de test et seuils avant le sprint ; tableau de bord avant « livré ».' },
      { icon: 'route', tone: 'yellow', title: 'Découper par preuves', text: 'Un spike, puis un champ, un seuil élevé, peu de clients.' },
    ]}
    quote="Une story IA se teste comme les autres : il suffit d’écrire ce que « assez bien » veut dire."
  />
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Why, M5_Canvas, M5_Families, M5_Gherkin, M5_Metric, M5_BadGood, M5_Dor, M5_Slicing, M5_Fix, M5_Qcm8, M5_Recap];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · MODULE 5 · 14:30

OBJECTIF — Annoncer le module : transformer tout ce qu’on a vu en critères d’acceptation.

DIRE — « Depuis ce matin, on a accumulé des décisions : un seuil d’alerte, une règle de doute, un niveau d’automatisation, des exigences de sources… Il faut maintenant les écrire, là où l’équipe les lira : dans la user story. C’est l’objet de ce module, et c’est ce que vous ferez vous-mêmes au TP. »

TRANSITION — « D’abord : pourquoi la story habituelle ne marche pas. »`,
  `⏱ 4 min · POURQUOI LA STORY CLASSIQUE NE SUFFIT PAS

OBJECTIF — Montrer qu’un critère binaire est inadapté à un système probabiliste.

DIRE — « Voici B1 écrite comme d’habitude. Le critère : le montant est rempli correctement. Lisez-le bien. »

→ beat 1 : le tampon et la colonne classique. « Ce critère n’est jamais vrai à 100 %. Soit la story ne sera jamais “Done”, soit quelqu’un cochera “Done” après trois essais réussis, et on découvrira les erreurs en production. Une feature classique, c’est même entrée, même sortie : ça marche ou pas, et ça reste vrai. »

→ beat 2 : la colonne IA. « Une feature IA est juste 96 fois sur 100. Son critère est statistique, mesuré sur un jeu de test. Elle se dégrade avec le temps. Et il faut décrire ce qu’elle fait quand elle doute. »

TRANSITION — « Il faut donc une story enrichie. Voici son canevas. »`,
  `⏱ 6 min · LE CANEVAS EN HUIT BLOCS

OBJECTIF — Présenter le canevas qui structure la story IA et le TP.

DIRE — « Huit blocs. Un : la story elle-même, avec son indicateur de succès — la cinquième question du module 3. Deux : le comportement de l’IA et son niveau d’automatisation — le module 4. Trois : les données et le droit de les utiliser — le module 2. Quatre : la performance, métrique, seuil, jeu de test. Cinq : le doute et le repli. Six : l’UX. Sept : les garde-fous, biais, sécurité, RGPD, AI Act. Huit : la mesure en production. »

INSIST — « Vous remarquez ? Chaque bloc correspond à un module de la journée. Ce canevas, c’est la journée entière, résumée sur une page. Les deux premiers ressemblent à une story classique ; les six suivants la rendent livrable. »

CONSIGNE — « Gardez-le sous les yeux : c’est le canevas du TP. »

TRANSITION — « Ces blocs se traduisent en critères d’acceptation. Six familles. »`,
  `⏱ 5 min · SIX FAMILLES DE CRITÈRES

OBJECTIF — Donner une typologie des critères d’acceptation, chacune illustrée sur B1.

DIRE — « Les critères fonctionnels restent : le montant s’affiche dans le champ. On en ajoute cinq. La performance : une métrique, un seuil, un jeu de test nommé. Le doute et le repli : sous 60 %, champ vide. L’UX et la transparence : chaque champ lu porte la mention. L’éthique et la conformité : nom et carte masqués avant envoi. L’exploitation : latence, coût, journal, seuil d’alerte. »

QUESTION — « Laquelle de ces familles est la plus souvent oubliée dans vos stories ? » Réponse fréquente : le doute et l’exploitation.

TRANSITION — « Comment écrire tout ça en Given / When / Then ? »`,
  `⏱ 5 min · GIVEN / WHEN / THEN ADAPTÉ

OBJECTIF — Montrer la coexistence de scénarios de comportement et de critères statistiques.

DIRE — « Deux types de critères. Les scénarios de comportement : étant donné une confiance au-dessus de 90 %, alors le montant est pré-rempli et marqué. Ceux-là se testent comme d’habitude, en simulant la confiance. »

→ beat 1 : le critère statistique. « Et les critères statistiques : sur le jeu de test v1, le montant est exact pour au moins 95 % des tickets, et aucun sous-groupe n’est sous 90 %. On les vérifie à chaque nouvelle version du modèle, sur le jeu figé. »

→ beat 2 : le critère qui compte. « Regardez la dernière ligne : moins de 1 % de montants faux non signalés. C’est la plus importante. Un montant faux mais surligné, l’utilisateur le rattrape. Un montant faux silencieux part au remboursement. »

TRANSITION — « Ce raisonnement — partir du coût de l’erreur — vaut pour toutes les features. Exercice. »`,
  `⏱ 6 min · CHOISIR LA MÉTRIQUE (cartes à retourner)

OBJECTIF — Faire dériver la métrique du coût de l’erreur, feature par feature.

CONSIGNE — « Quatre features. Pour chacune, une question au recto. Débattez trente secondes, puis je retourne la carte. »

ANIMATION — B1 : « L’erreur silencieuse coûte : on plafonne les montants faux non signalés. » B2 : « Erreur bénigne et visible : l’exactitude globale suffit. » B3 : « On fixe un rappel minimum ET un plafond d’alertes : c’est le simulateur du module 2. » B4 : « Mieux vaut “je ne sais pas” qu’une règle inventée : zéro invention hors périmètre. »

INSIST — « “Exactitude” ne suffit presque jamais. La bonne métrique se déduit de la question : quelle erreur coûte le plus ? »

TRANSITION — « Passons des métriques aux formulations. »`,
  `⏱ 5 min · DES CRITÈRES FLOUS AUX CRITÈRES TESTABLES

OBJECTIF — Entraîner la reformulation de critères vagues.

DIRE — « À gauche, des critères qu’on lit tous les jours. Avant chaque clic, demandez à la salle comment le rendre testable. »

→ beat 1 : « précis » devient « montant exact ≥ 95 % sur le jeu de test v1 ».
→ beat 2 : « rapide » devient « ≤ 5 s pour 95 % des tickets ».
→ beat 3 : « pas de biais » devient « écart ≤ 5 points entre tickets français et étrangers ».
→ beat 4 : « peut corriger » devient « correction en 1 clic sans ressaisir le reste ».
→ beat 5 : « données protégées » devient « masquées avant envoi, vérifié par un test automatisé ».

INSIST — « Le test d’un bon critère : deux personnes qui le lisent concluent-elles la même chose ? »

TRANSITION — « Ces critères ont besoin d’un cadre d’équipe : la DoR et la DoD. »`,
  `⏱ 4 min · DOR ET DOD VERSION IA (exercice)

OBJECTIF — Adapter les définitions d’équipe aux features IA.

DIRE — « À gauche, ce qui doit être prêt avant le sprint : le problème et l’indicateur, les données et leur droit d’usage, le jeu de test figé, les seuils, la règle de doute, le comportement en panne. À droite, ce qui doit être vrai avant de dire “livré” : seuils atteints, scénarios au vert, UX en place, sous-groupes vérifiés, tableau de bord actif, fiche du modèle à jour. »

CONSIGNE — « Cochez, pour votre équipe réelle, ce qui est déjà pratiqué. » Faire cocher un volontaire.

INSIST — « Le piège : une story “Done” sans tableau de bord. Personne ne saura quand elle cesse de marcher. »

TRANSITION — « Dernier outil : le découpage. »`,
  `⏱ 4 min · DÉCOUPER UNE FEATURE IA

OBJECTIF — Montrer un découpage vertical progressif d’une feature IA.

DIRE — « Tranche 1 : un spike de deux semaines, trois approches sur 200 tickets. Son livrable n’est pas du code, c’est une recommandation. »

→ beat 1 : « Tranche 2 : le montant seul, avec un seuil de confiance élevé, chez trois clients. Tout le reste reste manuel. Première valeur. »
→ beat 2 : « Tranche 3 : le surlignage du doute et le signalement. La zone 60–90 % devient utile, et les corrections alimentent le journal. »
→ beat 3 : « Tranche 4 : les autres champs, un par un, chacun avec son seuil. »
→ beat 4 : « Tranche 5 : le tableau de bord et l’alerte de dérive. C’est la condition pour généraliser. »

INSIST — « Le spike est une story à part entière : sa définition de “fait”, c’est une décision éclairée — continuer, changer d’approche, ou arrêter. »

TRANSITION — « Vous avez tous les outils. Mettons-les à l’épreuve sur une mauvaise story. »`,
  `⏱ 8 min · EXERCICE : LA STORY À CORRIGER

OBJECTIF — Faire diagnostiquer les défauts d’une story IA typique.

CONSIGNE — « SPEN-412, l’assistant B4, rédigée à la va-vite. Elle a l’air prête. Trois minutes en binôme : trouvez au moins cinq problèmes. »

ANIMATION — Laisser chercher trois minutes. Recueillir les propositions, puis révéler un défaut par clic.

→ beat 1 : « un chatbot IA » : une solution, pas un besoin. Le problème : 1 050 tickets par mois.
→ beat 2 : « avoir des réponses » : aucune valeur mesurable. Il faut : diviser ces tickets par deux en trois mois.
→ beat 3 : « toutes les questions » : périmètre infini. Seulement la politique du client ; hors périmètre, il le dit et passe la main.
→ beat 4 : « correctes » : non testable. Il faut : ≥ 90 % de réponses justes et sourcées sur 100 questions de test.
→ beat 5 : « il utilise GPT » : un choix technique déguisé en critère. Et ce qui manque : sources, mention IA, cloisonnement, passage à un humain, indicateurs.

DEBRIEF — « Cette story aurait passé un refinement rapide. Elle aurait produit un assistant qui invente, sans qu’aucun critère ne le détecte. »

TRANSITION — « Un dernier QCM avant la pause. »`,
  `⏱ 2 min · QCM 8

OBJECTIF — Vérifier la capacité à reconnaître un critère statistique bien formé.

INTERACTION — Vote à main levée, puis clic.

→ beat 1 : la bonne réponse s’affiche (C).
→ beat 2 : l’essentiel s’affiche.

DIRE — « Une métrique, un seuil, un jeu de test nommé. Le piège D est fréquent : un choix technique n’est pas un critère d’acceptation. »

TRANSITION — « Ce qu’il faut retenir. »`,
  `⏱ 2 min · À RETENIR · M5

OBJECTIF — Fixer les idées du module.

DIRE — « Une story probabiliste. Huit blocs. Deux types de critères. Le coût de l’erreur dicte la métrique. Une DoR et une DoD adaptées. Et un découpage par preuves. »

INSIST — Relire la citation : « Une story IA se teste comme les autres : il suffit d’écrire ce que “assez bien” veut dire. »

ANIMATION — Annoncer la pause : 15 minutes, reprise à 15:40 pour l’atelier et le TP.

TRANSITION — « Après la pause, c’est vous qui écrivez. »`,
];
// @@NOTES-END
