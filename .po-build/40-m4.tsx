// ─── Module 4 · Le workflow IA du PO ────────────────────────────────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title="Le workflow IA du PO"
    sub="Données → modèle → intégration → UX : suivre B1 du backlog jusqu’à la production, et voir où le PO décide."
    dur="50 min"
    labs={
      <>
        <Tag tone="green" size={20}>
          Maquette · UX de l’erreur
        </Tag>
        <Tag tone="green" size={20}>
          Exercice · remettre dans l’ordre
        </Tag>
        <Tag tone="violet" size={20}>
          QCM 7
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Les quatre étapes, et la boucle qui les relie</SecItem>
    <SecItem n={2}>Données et modèle : définir la bonne réponse, choisir sur preuves</SecItem>
    <SecItem n={3}>Intégration : confiance, garde-fous, repli, humain dans la boucle</SecItem>
    <SecItem n={4}>UX et production : concevoir pour l’erreur, mesurer, ré-entraîner</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Les quatre étapes ──────────────────────────────────────────────────────
const M4Stage = ({ n, icon, tone, title, items, q, cls }: { n: number; icon: IconName; tone: Tone; title: string; items: string[]; q: string; cls: string }) => (
  <div className={cls} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `8px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={58} solid />
      <div>
        <Eyebrow c={T[tone].fg} size={17}>
          Étape {n}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</div>
      </div>
    </div>
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it) => (
        <Bullet key={it} tone={tone} size={22}>
          {it}
        </Bullet>
      ))}
    </div>
    <div style={{ marginTop: 'auto', paddingTop: 16 }}>
      <div style={{ background: T[tone].bg, borderRadius: 12, padding: '12px 16px', fontSize: 20, lineHeight: 1.38, color: C.ink }}>
        <strong style={{ color: T[tone].fg }}>Question du PO · </strong>
        {q}
      </div>
    </div>
  </div>
);

const M4_Flow: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Le workflow d’une feature IA, en quatre étapes</Title>
    <Lede>Le fil rouge de l’après-midi : B1, la lecture automatique des tickets.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 480, display: 'flex', alignItems: 'stretch', gap: 10 }}>
      <M4Stage n={1} icon="database" tone="blue" title="Données" cls={A.in} items={['Collecter un échantillon', 'Définir la bonne réponse', 'Annoter, découper']} q="Qu’est-ce qu’une bonne réponse ?" />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FlowArrow w={40} cls={b.fade(1)} />
      </div>
      <M4Stage n={2} icon="brain" tone="violet" title="Modèle" cls={b.on(1)} items={['Choisir l’approche', 'Entraîner ou configurer', 'Évaluer sur le jeu de test']} q="Quels critères pour dire « assez bon » ?" />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FlowArrow w={40} cls={b.fade(2)} />
      </div>
      <M4Stage n={3} icon="plug" tone="teal" title="Intégration" cls={b.on(2)} items={['Brancher dans le produit', 'Garde-fous et repli', 'Journaliser']} q="Que fait le produit quand l’IA doute ?" />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FlowArrow w={40} cls={b.fade(3)} />
      </div>
      <M4Stage n={4} icon="pointer" tone="pink" title="UX" cls={b.on(3)} items={['Afficher la confiance', 'Faciliter la correction', 'Recueillir le retour']} q="Comment l’utilisateur repère et corrige l’erreur ?" />
    </div>
    <svg width={1680} height={120} viewBox="0 0 1680 120" style={{ position: 'absolute', left: 120, top: 750 }}>
      <path d="M 1470 4 C 1470 100, 210 100, 210 14" fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="10 12" className={cx(A.march, b.fade(4))} />
      <polygon points="210,2 199,24 221,24" fill={C.green} className={b.fade(4)} />
    </svg>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 862, width: 1680, textAlign: 'center', fontSize: 25, color: C.ink }}>
      <strong style={{ color: T.green.fg }}>La boucle :</strong> mesurer en production, récupérer les corrections des utilisateurs, ré-entraîner. Une feature IA n’est jamais « terminée ».
    </div>
  </Frame>
);

// ─── Étape 1 · Données ──────────────────────────────────────────────────────
const M4Pipe = ({ icon, tone, title, sub }: { icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.3, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M4Split = ({ pct, bg, label, sub, d }: { pct: number; bg: string; label: string; sub: string; d: number }) => (
  <div style={{ width: `${pct}%`, boxSizing: 'border-box', paddingRight: 6 }}>
    <div className={A.grow} style={{ height: 56, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', paddingLeft: 16, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 24, ...dl(d) }}>
      {pct} %
    </div>
    <div style={{ marginTop: 8, fontSize: 21, fontWeight: 700, color: C.ink }}>{label}</div>
    <div style={{ fontSize: 18, lineHeight: 1.3, color: C.muted }}>{sub}</div>
  </div>
);

const M4_Data: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Étape 1 · Données : définir ce qu’est une bonne réponse</Title>
    <Lede>Avant tout modèle, il faut des exemples dont on connaît la réponse. Et c’est au PO de dire laquelle.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', alignItems: 'center', gap: 10 }}>
      <M4Pipe icon="archive" tone="grey" title="2,1 M photos" sub="archivées sur 3 ans" />
      <FlowArrow w={40} />
      <M4Pipe icon="filter" tone="blue" title="Échantillon de 5 000" sub="dont 15 % de tickets difficiles" />
      <FlowArrow w={40} />
      <M4Pipe icon="users" tone="violet" title="Annotation" sub="2 annotateurs · 3 semaines" />
      <FlowArrow w={40} />
      <M4Pipe icon="layers" tone="green" title="Trois jeux" sub="séparés une fois pour toutes" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 420, width: 900, ...dl(200) }}>
      <Eyebrow c={C.navy} size={20} style={{ marginBottom: 14 }}>
        Le découpage des 5 000 tickets
      </Eyebrow>
      <div style={{ display: 'flex' }}>
        <M4Split pct={70} bg={G.blue} label="Entraînement" sub="le modèle apprend dessus" d={400} />
        <M4Split pct={15} bg={C.violet} label="Validation" sub="pour régler" d={600} />
        <M4Split pct={15} bg={C.green} label="Test" sub="« golden set »" d={800} />
      </div>
      <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.42, color: C.soft }}>
        Les 750 tickets de test ne servent qu’à juger. Personne n’y touche pendant le développement : c’est l’examen final, sujet scellé.
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1080, top: 420, width: 720, ...dl(300) }}>
      <Code title="Guide d’annotation · B1 · v1.2" size={20}>
        <Jk>montant</Jk>    = total TTC payé, pourboire inclus{'\n'}
        <Jk>date</Jk>       = date de la transaction{'\n'}
        <Jk>tva</Jk>        = somme des TVA ; vide si absente{'\n'}
        <Jk>commerçant</Jk> = enseigne, pas raison sociale{'\n'}
        <Jk>illisible</Jk>  = cocher, <Jn>ne jamais deviner</Jn>
      </Code>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Le rôle du PO" tone="violet" icon="target" size={24}>
        Rédiger et arbitrer le guide d’annotation. Quand deux annotateurs ne sont pas d’accord, ce n’est pas le modèle qui est flou : c’est la définition de la bonne réponse.
      </Callout>
    </div>
  </Frame>
);

// ─── Étape 2 · Modèle ───────────────────────────────────────────────────────
type M4Cell = [string, boolean];
const M4_CRIT: { k: string; s: string; v: M4Cell[] }[] = [
  { k: 'Montant exact', s: '≥ 95 %', v: [['93 %', false], ['96 %', true], ['97 %', true]] },
  { k: 'Date exacte', s: '≥ 97 %', v: [['98 %', true], ['98 %', true], ['99 %', true]] },
  { k: 'Temps de réponse', s: '≤ 5 s', v: [['0,8 s', true], ['3,5 s', true], ['0,3 s', true]] },
  { k: 'Coût par ticket', s: '≤ 1 centime', v: [['0,2 c', true], ['0,8 c', true], ['0,05 c', true]] },
  { k: 'Disponible', s: '≤ 2 mois', v: [['immédiat', true], ['3 semaines', true], ['5 mois', false]] },
  { k: 'Données traitées en UE', s: 'obligatoire', v: [['oui', true], ['oui, au contrat', true], ['oui', true]] },
];

const M4_Model: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Étape 2 · Modèle : choisir sur preuves, pas sur démo</Title>
    <Lede>Trois candidats évalués sur les 750 tickets du jeu de test. Les seuils ont été fixés avant les essais.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '14px 26px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '360px 240px repeat(3, 1fr)', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `2px solid ${C.rule}` }}>
        <Eyebrow c={C.muted} size={17}>
          Critère
        </Eyebrow>
        <Eyebrow c={C.violet} size={17}>
          Seuil fixé avant
        </Eyebrow>
        {(['Service OCR acheté', 'LLM vision par API', 'Modèle sur mesure'] as const).map((h, i) => (
          <div key={h} style={{ fontFamily: display, fontWeight: 700, fontSize: 22, color: C.navy, textAlign: 'center' }}>
            <Icon name={(['cart', 'cloud', 'gear'] as IconName[])[i]} size={22} color={C.navy} style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
            {h}
          </div>
        ))}
      </div>
      {M4_CRIT.map((r) => (
        <div key={r.k} style={{ display: 'grid', gridTemplateColumns: '360px 240px repeat(3, 1fr)', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.rule}` }}>
          <div style={{ fontSize: 23, fontWeight: 600, color: C.ink }}>{r.k}</div>
          <div style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, color: C.violet }}>{r.s}</div>
          {r.v.map(([v, ok], i) => (
            <div key={i} className={b.fade(1)} style={{ justifySelf: 'center', ...dl(i * 150) }}>
              <Tag tone={ok ? 'green' : 'coral'} size={20}>
                <Icon name={ok ? 'check' : 'x'} size={18} sw={3} /> {v}
              </Tag>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Décision PO pour le MVP" tone="blue" icon="target" size={24}>
        Le LLM vision, avec masquage des données personnelles avant envoi. Le sur-mesure est réévalué dans six mois, si le volume
        et le coût le justifient. Le service acheté échoue sur le critère clé : le montant.
      </Callout>
    </div>
  </Frame>
);

// ─── Du POC à la production ─────────────────────────────────────────────────
const M4Mile = ({ n, tone, title, dur, what, gate, cls }: { n: number; tone: Tone; title: string; dur: string; what: string; gate: string; cls: string }) => (
  <div className={cls} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={50} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
        <div style={{ fontFamily: mono, fontSize: 19, color: T[tone].fg }}>{dur}</div>
      </div>
    </div>
    <div style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 18px', fontSize: 21, lineHeight: 1.4, color: C.soft }}>{what}</div>
    <div style={{ background: T[tone].bg, borderRadius: 12, padding: '12px 16px', fontSize: 20, lineHeight: 1.38, color: C.ink }}>
      <strong style={{ color: T[tone].fg }}>Passage · </strong>
      {gate}
    </div>
  </div>
);

const M4_Iter: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Du POC à la production : quatre jalons, quatre décisions</Title>
    <Lede>À chaque jalon, un critère de passage écrit à l’avance. Arrêter est une issue normale, pas un échec.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 420, display: 'flex', gap: 24 }}>
      <M4Mile n={1} tone="blue" title="Exploration" dur="2 semaines" what="200 tickets, trois approches essayées à la main. Est-ce seulement possible ?" gate="au moins une approche dépasse 85 % sur le montant." cls={A.in} />
      <M4Mile n={2} tone="violet" title="POC" dur="5 semaines" what="Le jeu de test de 750 tickets, les critères chiffrés, le comparatif des candidats." gate="tous les seuils atteints par un candidat." cls={b.on(1)} />
      <M4Mile n={3} tone="teal" title="Pilote" dur="2 mois" what="Trois clients volontaires, pré-remplissage avec validation humaine systématique." gate="temps de saisie divisé par deux, moins de 2 % de réclamations." cls={b.on(2)} />
      <M4Mile n={4} tone="green" title="Généralisation" dur="en continu" what="Tous les clients, tableau de bord, ré-entraînement planifié." gate="revue trimestrielle de la qualité et du coût." cls={b.on(3)} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(600) }}>
      <Callout title="Un POC qui marche n’est pas un produit" tone="coral" icon="alert" size={24}>
        Après le POC restent l’intégration, l’UX de l’erreur, la conformité, le support et l’exploitation. Budgétez-les dès le départ.
      </Callout>
    </div>
  </Frame>
);

// ─── Étape 3 · Intégration ──────────────────────────────────────────────────
const M4Route = ({ tone, cond, title, sub }: { tone: Tone; cond: string; title: string; sub: string }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', borderLeft: `8px solid ${STRONG[tone]}` }}>
    <Tag tone={tone} size={19}>
      {cond}
    </Tag>
    <div style={{ marginTop: 10, fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 2, fontSize: 20, lineHeight: 1.35, color: C.soft }}>{sub}</div>
  </div>
);

const M4_Integration: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Étape 3 · Intégration : décider quoi faire du doute</Title>
    <Lede>Le modèle renvoie une réponse et un niveau de confiance. Le produit décide de la suite, selon une règle fixée par le PO.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', alignItems: 'center', gap: 14 }}>
      <M4Pipe icon="phone" tone="blue" title="Appli Spendo" sub="photo du ticket" />
      <FlowArrow w={44} />
      <div style={{ flex: 2.4, background: T.navy.bg, borderRadius: 18, padding: '14px 18px', boxShadow: `inset 0 0 0 2px ${T.navy.bd}` }}>
        <Eyebrow c={C.navy} size={17} style={{ marginBottom: 10 }}>
          Service IA
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <M4Pipe icon="eyeOff" tone="violet" title="Masquer" sub="nom, carte" />
          <FlowArrow w={30} />
          <M4Pipe icon="brain" tone="blue" title="Lire" sub="LLM vision" />
          <FlowArrow w={30} />
          <M4Pipe icon="checkCircle" tone="teal" title="Contrôler" sub="lignes = total ?" />
        </div>
      </div>
      <FlowArrow w={44} />
      <M4Pipe icon="gauge" tone="yellow" title="Réponse" sub="+ confiance" />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 470, width: 1680 }}>
      <Eyebrow c={C.navy} size={20} style={{ marginBottom: 12 }}>
        La règle de décision, champ par champ
      </Eyebrow>
      <div style={{ display: 'flex', gap: 20 }}>
        <M4Route tone="green" cond="confiance ≥ 90 %" title="Pré-rempli" sub="L’utilisateur voit la valeur, peut la modifier." />
        <M4Route tone="yellow" cond="entre 60 et 90 %" title="Pré-rempli, surligné" sub="« À vérifier » : la zone du ticket est montrée." />
        <M4Route tone="coral" cond="< 60 % ou incohérent" title="Saisie manuelle" sub="Champ vide, photo affichée à côté." />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <Callout title="Repli" tone="blue" icon="reset" size={22}>
          Pas de réponse en 5 secondes ? Saisie manuelle. L’IA ne bloque jamais une note de frais.
        </Callout>
      </div>
      <div style={{ flex: 1 }}>
        <Callout title="Journal" tone="violet" icon="doc" size={22}>
          Chaque prédiction, sa confiance et la correction de l’utilisateur : la matière du ré-entraînement.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Où placer l’humain ─────────────────────────────────────────────────────
const M4Level = ({ n, tone, title, sub, when, ids }: { n: number; tone: Tone; title: string; sub: string; when: string; ids: string }) => (
  <div className={A.in} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', ...dl(100 + n * 120) }}>
    <Num n={n} tone={tone} size={44} />
    <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 25, lineHeight: 1.15, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.35, color: C.soft }}>{sub}</div>
    <div style={{ marginTop: 10, fontSize: 19, lineHeight: 1.35, color: C.muted }}>
      <strong>Quand ? </strong>
      {when}
    </div>
    <div className={b.pop(1)} style={{ marginTop: 'auto', paddingTop: 14 }}>
      <Tag tone={tone} size={19}>
        <Icon name="cart" size={18} /> {ids}
      </Tag>
    </div>
  </div>
);

const M4_Hitl: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Où placer l’humain ? Quatre niveaux d’automatisation</Title>
    <Lede>Ce choix de produit se décide feature par feature, et figure dans la user story.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 21, color: C.green }}>← l’humain décide</span>
      <div style={{ flex: 1, margin: '0 24px', height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${C.green}, ${C.yellow}, ${C.coral})` }} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 21, color: C.coral }}>la machine décide →</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 320, width: 1680, height: 440, display: 'flex', gap: 20 }}>
      <M4Level n={1} tone="green" title="Suggestion" sub="L’IA propose, l’humain choisit." when="erreur coûteuse, ou qui touche une personne" ids="B3 alertes · B4 assistant" />
      <M4Level n={2} tone="teal" title="Pré-remplissage" sub="L’IA remplit, l’humain valide." when="gain de temps, erreur visible" ids="B1 lecture du ticket" />
      <M4Level n={3} tone="yellow" title="Automatique, contrôlé" sub="L’IA décide, l’humain contrôle un échantillon et peut annuler." when="gros volume, erreur rattrapable" ids="B2 catégorie" />
      <M4Level n={4} tone="coral" title="Automatique complet" sub="Personne ne regarde." when="erreur sans conséquence" ids="rarement souhaitable" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(800) }}>
      <Callout title="Règle de pouce" tone="navy" icon="scale" size={24}>
        Plus l’erreur coûte cher ou touche une personne, plus l’humain reste près de la décision. On monte d’un niveau quand la mesure le justifie.
      </Callout>
    </div>
  </Frame>
);

// ─── Étape 4 · UX : maquette avant / après ──────────────────────────────────
const M4Field = ({ label, value, state, note }: { label: string; value: string; state: 'plain' | 'ok' | 'check'; note?: string }) => (
  <div>
    <div style={{ fontSize: 18, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{label}</div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 50,
        boxSizing: 'border-box',
        padding: '0 14px',
        borderRadius: 10,
        background: state === 'check' ? T.yellow.bg : '#fff',
        boxShadow: `inset 0 0 0 2px ${state === 'check' ? C.yellow : C.rule}`,
        fontSize: 22,
        color: C.ink,
        transition: `all 300ms ${EASE}`,
      }}
    >
      <span style={{ flex: 1 }}>{value}</span>
      {state === 'ok' ? <Icon name="sparkles" size={20} color={C.violet} /> : null}
      {state === 'check' ? <Icon name="alert" size={22} color={C.amber} /> : null}
    </div>
    {note ? <div style={{ marginTop: 4, fontSize: 17, fontWeight: 600, color: T.yellow.fg }}>{note}</div> : null}
  </div>
);

const M4Principle = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Ux: Page = () => {
  const [good, setGood] = useState(false);
  return (
    <Frame mod={4} kind="demo">
      <Title>Étape 4 · UX : concevoir pour le moment où l’IA se trompe</Title>
      <Lede>Le ticket de la brasserie : total corrigé à la main. Comparez les deux écrans.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1090, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>Nouvelle dépense</div>
          <Toggle on={good} onChange={setGood} label="Version conçue pour l’erreur" tone="green" size={22} />
        </div>
        <div
          style={{
            marginTop: 14,
            minHeight: 50,
            boxSizing: 'border-box',
            borderRadius: 12,
            padding: '10px 16px',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: good ? T.violet.bg : 'transparent',
            color: T.violet.fg,
            transition: `background 300ms ${EASE}`,
          }}
        >
          {good ? (
            <>
              <Icon name="sparkles" size={22} /> Lu automatiquement : vérifiez le champ surligné avant d’envoyer.
            </>
          ) : null}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 26 }}>
          <div style={{ position: 'relative', flex: 'none', width: 250, height: 330, borderRadius: 10, background: '#FFFEFA', boxShadow: `inset 0 0 0 2px ${C.rule}`, padding: '16px 18px', boxSizing: 'border-box', fontFamily: mono, fontSize: 14, lineHeight: 1.6, color: '#555' }}>
            <div style={{ fontWeight: 700, textAlign: 'center' }}>LE COMPTOIR</div>
            <div style={{ textAlign: 'center' }}>14/03/2026 20:41</div>
            <div style={{ borderTop: '1px dashed #bbb', margin: '8px 0' }} />
            <div>2 Menu affaires 78,00</div>
            <div>1 Côtes-du-Rh. 32,00</div>
            <div style={{ borderTop: '1px dashed #bbb', margin: '8px 0' }} />
            <div style={{ fontWeight: 700 }}>
              TOTAL <s>110,00</s> <span style={{ fontFamily: '"Segoe Script", cursive', color: '#1A3FB8' }}>170</span>
            </div>
            <div>TVA 10 % 10,00</div>
            <div
              style={{
                position: 'absolute',
                left: 10,
                right: 10,
                top: 134,
                height: 28,
                borderRadius: 6,
                boxShadow: `0 0 0 3px ${C.yellow}`,
                background: 'rgba(242,162,12,.12)',
                opacity: good ? 1 : 0,
                transition: `opacity 300ms ${EASE}`,
              }}
            />
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignContent: 'start' }}>
            <M4Field label="Montant TTC" value={good ? '110,00 € ou 170,00 € ?' : '170,00 €'} state={good ? 'check' : 'plain'} note={good ? 'À vérifier · lignes ≠ total' : undefined} />
            <M4Field label="Date" value="14/03/2026" state={good ? 'ok' : 'plain'} />
            <M4Field label="TVA" value="10,00 €" state={good ? 'ok' : 'plain'} />
            <M4Field label="Commerçant" value="Le Comptoir" state={good ? 'ok' : 'plain'} />
            <M4Field label="Catégorie" value="Repas d’affaires" state={good ? 'ok' : 'plain'} />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Btn tone={good ? 'grey' : 'blue'} ghost={good} icon="send" size={20} disabled={good}>
                {good ? 'Vérifiez d’abord' : 'Envoyer'}
              </Btn>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, minHeight: 30, fontSize: 19, color: good ? T.violet.fg : C.coral }}>
          {good ? (
            <>
              <Icon name="flag" size={18} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
              Mal lu ? Signalez-le : votre correction améliore Spendo.
            </>
          ) : (
            'Rien n’indique que 170 € a été deviné : l’erreur partira au remboursement.'
          )}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Eyebrow c={C.navy} size={20} cls={A.fade}>
          Cinq principes d’UX de l’IA
        </Eyebrow>
        <M4Principle icon="sparkles" tone="violet" title="Dire que c’est l’IA" d={150}>
          L’utilisateur sait ce qui a été deviné.
        </M4Principle>
        <M4Principle icon="gauge" tone="yellow" title="Montrer le doute" d={250}>
          La confiance se traduit en surlignage, pas en pourcentage.
        </M4Principle>
        <M4Principle icon="pointer" tone="blue" title="Corriger plus vite que saisir" d={350}>
          Sinon, l’IA fait perdre du temps.
        </M4Principle>
        <M4Principle icon="eye" tone="teal" title="Montrer d’où vient la réponse" d={450}>
          La zone lue, la source citée.
        </M4Principle>
        <M4Principle icon="loop" tone="green" title="Recueillir le retour" d={550}>
          Chaque correction est un exemple d’entraînement.
        </M4Principle>
      </div>
    </Frame>
  );
};

// ─── Après la mise en production ────────────────────────────────────────────
const M4_SERIES = [6.5, 5.8, 5.2, 4.9, 4.7, 4.6, 4.5, 9.8, 10.4, 6.1, 4.8, 4.4];
const M4X = (i: number) => 70 + i * 82;
const M4Y = (v: number) => 400 - v * 34;

const M4Kpi = ({ icon, tone, title, value, sub, d }: { icon: IconName; tone: Tone; title: string; value: string; sub: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div style={{ flex: 1 }}>
      <Eyebrow c={T[tone].fg} size={16}>
        {title}
      </Eyebrow>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy, lineHeight: 1.15 }}>{value}</div>
      <div style={{ fontSize: 18, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M4_Monitor: Page = () => {
  const d = M4_SERIES.map((v, i) => `${i ? 'L' : 'M'} ${M4X(i)} ${M4Y(v)}`).join(' ');
  return (
    <Frame mod={4} beats={2}>
      <Title>En production : surveiller, détecter la dérive, ré-entraîner</Title>
      <Lede>Le meilleur indicateur de qualité de B1 est gratuit : la part des champs corrigés par les utilisateurs.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 22px', boxSizing: 'border-box' }}>
        <Eyebrow c={C.navy} size={18}>
          % de champs corrigés · 12 semaines après le lancement
        </Eyebrow>
        <svg width={1036} height={470} viewBox="0 0 1036 470" style={{ display: 'block', marginTop: 8 }}>
          {[2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <line x1={50} x2={1020} y1={M4Y(v)} y2={M4Y(v)} stroke={C.rule} strokeWidth={1.5} />
              <text x={40} y={M4Y(v) + 6} textAnchor="end" style={{ fontFamily: mono, fontSize: 16, fill: C.muted }}>
                {v} %
              </text>
            </g>
          ))}
          <line x1={50} x2={1020} y1={M4Y(7)} y2={M4Y(7)} stroke={C.coral} strokeWidth={3} strokeDasharray="10 8" />
          <text x={1016} y={M4Y(7) - 10} textAnchor="end" style={{ fontFamily: body, fontWeight: 700, fontSize: 18, fill: C.coral }}>
            seuil d’alerte 7 %
          </text>
          <path d={d} pathLength={1} fill="none" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" className={A.draw} />
          {M4_SERIES.map((v, i) => (
            <circle key={i} cx={M4X(i)} cy={M4Y(v)} r={7} fill={v > 7 ? C.coral : C.blue} className={A.dot} style={dl(300 + i * 80)} />
          ))}
          {M4_SERIES.map((_, i) => (
            <text key={i} x={M4X(i)} y={440} textAnchor="middle" style={{ fontFamily: mono, fontSize: 16, fill: C.muted }}>
              S{i + 1}
            </text>
          ))}
          <g className={b.fade(1)}>
            <rect x={M4X(7) - 290} y={M4Y(9.8) - 10} width={250} height={56} rx={10} fill={T.coral.bg} stroke={C.coral} strokeWidth={2} />
            <text x={M4X(7) - 165} y={M4Y(9.8) + 24} textAnchor="middle" style={{ fontFamily: body, fontWeight: 700, fontSize: 18, fill: T.coral.fg }}>
              Nouveau format SNCF
            </text>
          </g>
          <g className={b.fade(2)}>
            <rect x={M4X(9) + 20} y={M4Y(6.1) - 76} width={230} height={56} rx={10} fill={T.green.bg} stroke={C.green} strokeWidth={2} />
            <text x={M4X(9) + 135} y={M4Y(6.1) - 42} textAnchor="middle" style={{ fontFamily: body, fontWeight: 700, fontSize: 18, fill: T.green.fg }}>
              Ré-entraînement
            </text>
          </g>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M4Kpi icon="gauge" tone="blue" title="Qualité" value="4,4 % corrigés" sub="cible : moins de 5 %" d={150} />
        <M4Kpi icon="users" tone="teal" title="Adoption" value="78 % par photo" sub="notes créées en photographiant" d={250} />
        <M4Kpi icon="clock" tone="green" title="Valeur" value="4 min → 1 min 10" sub="temps moyen de saisie" d={350} />
        <M4Kpi icon="euro" tone="yellow" title="Coût" value="1 420 € / mois" sub="appels au modèle" d={450} />
      </div>
      <div className={b.on(2)} style={{ position: 'absolute', left: 1240, top: 790, width: 560 }}>
        <Callout title="La dérive" tone="coral" icon="trend" size={21}>
          Le monde change, le modèle non. On le voit vite si on le mesure.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Qui fait quoi ──────────────────────────────────────────────────────────
const RACI_COLS = ['PO', 'Data', 'Dev', 'UX', 'DPO · RSSI'];
const RACI: { k: string; v: string[]; po: string }[] = [
  { k: 'Données', v: ['D', 'R', 'C', '', 'C'], po: 'Guide d’annotation, échantillon représentatif' },
  { k: 'Modèle', v: ['D', 'R', 'C', '', 'C'], po: 'Seuils fixés avant les essais, choix du candidat' },
  { k: 'Intégration', v: ['D', 'C', 'R', 'C', 'C'], po: 'Règle de décision, repli, journal' },
  { k: 'UX', v: ['D', 'C', 'R', 'R', 'C'], po: 'Transparence, correction, retour' },
  { k: 'Production', v: ['D', 'R', 'R', 'C', 'C'], po: 'Indicateurs, seuil d’alerte, ré-entraînement' },
];
const RACI_TONE: Record<string, Tone> = { D: 'violet', R: 'blue', C: 'grey' };

const M4_Roles: Page = () => (
  <Frame mod={4}>
    <Title>Qui fait quoi ? Le PO décide des critères</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '14px 26px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, 130px) 1fr', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `2px solid ${C.rule}` }}>
        <Eyebrow c={C.muted} size={17}>
          Étape
        </Eyebrow>
        {RACI_COLS.map((c) => (
          <div key={c} style={{ textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 20, color: c === 'PO' ? C.violet : C.navy }}>
            {c}
          </div>
        ))}
        <Eyebrow c={C.violet} size={17}>
          Ce que le PO décide
        </Eyebrow>
      </div>
      {RACI.map((r, ri) => (
        <div key={r.k} className={A.left} style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, 130px) 1fr', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${C.rule}`, ...dl(150 + ri * 100) }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.ink }}>{r.k}</div>
          {r.v.map((x, i) => (
            <div key={i} style={{ justifySelf: 'center' }}>
              {x ? <Num n={x} tone={RACI_TONE[x]} size={42} /> : <span style={{ color: C.faint, fontSize: 22 }}>—</span>}
            </div>
          ))}
          <div style={{ fontSize: 21, lineHeight: 1.35, color: C.soft }}>{r.po}</div>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, display: 'flex', gap: 28, fontSize: 22, color: C.soft, ...dl(800) }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="D" tone="violet" size={34} /> décide
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="R" tone="blue" size={34} /> réalise
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="C" tone="grey" size={34} /> consulté
      </span>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(900) }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={23}>
        Déléguer les critères à l’équipe data « parce que c’est technique ». Un seuil de confiance est une décision de produit.
      </Callout>
    </div>
  </Frame>
);

// ─── Exercice : remettre le workflow dans l’ordre ───────────────────────────
const M4_STEPS = [
  'Fixer les critères d’acceptation avec le métier',
  'Rédiger le guide d’annotation',
  'Annoter un échantillon représentatif',
  'Comparer les modèles sur le jeu de test',
  'Brancher le modèle avec garde-fous et repli',
  'Concevoir l’UX de vérification et de correction',
  'Lancer un pilote avec trois clients',
  'Surveiller et ré-entraîner',
];
const M4_SHUFFLE = [4, 1, 7, 3, 0, 6, 2, 5];
const M4_TONES: Tone[] = ['blue', 'violet', 'teal', 'green', 'yellow', 'pink', 'coral', 'navy'];

const M4_Order: Page = () => (
  <Frame mod={4} kind="exercice" beats={1}>
    <Title>Exercice : remettez le workflow de B1 dans l’ordre</Title>
    <Lede>Glissez chaque étiquette sur son numéro. Double-clic pour la renvoyer à gauche.</Lede>
    {M4_STEPS.map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: 980, top: 262 + i * 80, width: 820, height: 66, boxSizing: 'border-box', borderRadius: 14, border: `3px dashed ${C.rule}`, display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 12 }}>
        <Num n={i + 1} tone="navy" size={40} />
        <span className={b.fade(1)} style={{ fontSize: 19, color: C.muted, ...dl(i * 80) }}>
          {M4_STEPS[i]}
        </span>
      </div>
    ))}
    {M4_SHUFFLE.map((si, i) => (
      <Drag key={si} x={120} y={262 + i * 80} w={780} tone={M4_TONES[si]} size={22}>
        {M4_STEPS[si]}
      </Drag>
    ))}
  </Frame>
);

// ─── QCM 7 ──────────────────────────────────────────────────────────────────
const M4_Qcm7: Page = () => (
  <QcmPage
    mod={4}
    n={7}
    title="Quand le modèle doute"
    q="Le modèle de B1 lit le montant avec une confiance de 55 %. D’après la règle de décision, que fait Spendo ?"
    explain="En dessous du seuil, le produit ne devine pas : il laisse l’humain saisir, avec l’aide visuelle. Ce comportement est écrit dans la user story."
  >
    <Opt why="L’erreur passerait inaperçue : c’est exactement l’écran « mauvaise UX » de tout à l’heure.">Il pré-remplit le champ normalement</Opt>
    <Opt why="L’IA ne doit jamais bloquer la note : le repli, c’est la saisie manuelle.">Il bloque la note jusqu’à une nouvelle photo</Opt>
    <Opt ok why="Sous 60 %, champ vide et photo affichée : l’utilisateur saisit, aidé, sans se fier à une devinette.">
      Il laisse le champ vide et affiche la photo à côté
    </Opt>
    <Opt why="Plus cher et plus lent, sans garantie : la règle de décision existe justement pour trancher.">Il relance automatiquement un modèle plus gros</Opt>
  </QcmPage>
);

const M4_Recap: Page = () => (
  <RecapPage
    mod={4}
    title="À retenir du module 4"
    items={[
      { icon: 'database', tone: 'blue', title: 'La bonne réponse se définit', text: 'Guide d’annotation, échantillon représentatif, jeu de test scellé.' },
      { icon: 'brain', tone: 'violet', title: 'Choisir sur preuves', text: 'Des seuils fixés avant les essais, mesurés sur le jeu de test.' },
      { icon: 'flag', tone: 'teal', title: 'Des jalons go / no-go', text: 'Exploration, POC, pilote, généralisation : arrêter est une issue normale.' },
      { icon: 'plug', tone: 'yellow', title: 'Décider quoi faire du doute', text: 'Seuils de confiance, repli, journal : écrits par le PO.' },
      { icon: 'pointer', tone: 'pink', title: 'UX de l’erreur', text: 'Signaler, montrer le doute, corriger plus vite que saisir.' },
      { icon: 'loop', tone: 'green', title: 'Jamais terminée', text: 'Mesurer, détecter la dérive, ré-entraîner.' },
    ]}
    quote="Le PO ne construit pas le modèle : il décide des critères qui le jugent."
  />
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Flow, M4_Data, M4_Model, M4_Iter, M4_Integration, M4_Hitl, M4_Ux, M4_Monitor, M4_Roles, M4_Order, M4_Qcm7, M4_Recap];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · MODULE 4 · 13:40

OBJECTIF — Annoncer le module : suivre B1 du backlog à la production.

DIRE — « Ce matin, vous avez choisi B1, la lecture automatique des tickets. Maintenant, on le fait passer du backlog à la production. Quatre étapes : données, modèle, intégration, UX. À chaque étape, je vous montrerai la décision qui revient au PO. Spoiler : il y en a une à chaque étape. »

TRANSITION — « Vue d’ensemble d’abord. »`,
  `⏱ 5 min · LES QUATRE ÉTAPES

OBJECTIF — Donner la carte du workflow et la question du PO à chaque étape.

DIRE — « Étape 1, les données : collecter un échantillon, définir la bonne réponse, annoter. La question du PO : qu’est-ce qu’une bonne réponse ? »

→ beat 1 : modèle. « Étape 2, le modèle : choisir l’approche, l’entraîner ou la configurer, l’évaluer. Votre question : quels critères pour dire “assez bon” ? »
→ beat 2 : intégration. « Étape 3, l’intégration : le brancher, avec des garde-fous et un repli. Votre question : que fait le produit quand l’IA doute ? »
→ beat 3 : UX. « Étape 4, l’UX : afficher la confiance, faciliter la correction. Votre question : comment l’utilisateur repère-t-il l’erreur ? »
→ beat 4 : la boucle. « Et tout est relié par une boucle : on mesure en production, on récupère les corrections, on ré-entraîne. Une feature IA n’est jamais terminée. »

TRANSITION — « Zoom sur chaque étape, en commençant par les données. »`,
  `⏱ 5 min · ÉTAPE 1 · DONNÉES

OBJECTIF — Expliquer annotation, découpage des jeux de données et rôle du PO.

DIRE — « On part de 2,1 millions de photos. On en tire un échantillon de 5 000, en forçant 15 % de tickets difficiles — froissés, manuscrits, étrangers —, sinon le modèle ne les verra jamais. Deux annotateurs saisissent la bonne réponse pendant trois semaines. »

DIRE — « On découpe : 70 % pour l’entraînement, 15 % pour régler, et 15 % pour le test : le “golden set”. Ces 750 tickets, personne n’y touche. C’est l’examen final, sujet scellé. Si l’équipe s’entraîne dessus, les résultats sont truqués sans le vouloir. »

DIRE — « À droite, le guide d’annotation. Le montant, c’est le total TTC pourboire inclus ? Ou hors pourboire ? Ce n’est pas une question technique : c’est une règle métier. »

→ beat 1 : le rôle du PO. « Le PO rédige et arbitre ce guide. Quand deux annotateurs ne sont pas d’accord, c’est la définition qui est floue. Et un modèle ne peut pas être plus clair que sa définition. »

TRANSITION — « Les données sont prêtes. Choisissons un modèle. »`,
  `⏱ 6 min · ÉTAPE 2 · MODÈLE

OBJECTIF — Montrer une décision de modèle prise sur des critères fixés à l’avance.

DIRE — « Trois candidats, ceux du module 3 : un service acheté, un LLM vision par API, un modèle sur mesure. Six critères, avec un seuil fixé avant les essais. C’est essentiel : si on fixe le seuil après avoir vu les résultats, on choisit toujours son favori. »

→ beat 1 : les résultats. « Le service acheté échoue sur le montant : 93 %. Le sur-mesure est le meilleur partout… mais disponible dans cinq mois. Le LLM vision passe tous les critères. »

→ beat 2 : la décision. « Décision pour le MVP : le LLM vision, avec masquage des données personnelles avant envoi. On réévalue le sur-mesure dans six mois si le volume et le coût le justifient. »

QUESTION — « Si le métier avait fixé le seuil du montant à 97 %, que se passerait-il ? » Réponse : aucun candidat prêt à temps ; on négocie, on attend, ou on change de niveau d’automatisation.

TRANSITION — « Ce choix arrive au bout d’un chemin en plusieurs jalons. »`,
  `⏱ 4 min · DU POC À LA PRODUCTION

OBJECTIF — Présenter les jalons et leurs critères de passage.

DIRE — « Exploration : deux semaines, 200 tickets, est-ce seulement possible ? On passe si une approche dépasse 85 %. »

→ beat 1 : POC. « Le POC : cinq semaines, le jeu de test, les critères chiffrés. On passe si tous les seuils sont atteints. »
→ beat 2 : pilote. « Le pilote : deux mois, trois clients volontaires, validation humaine systématique. On passe si le temps de saisie est divisé par deux, avec moins de 2 % de réclamations. »
→ beat 3 : généralisation. « Puis la généralisation, avec un tableau de bord et une revue trimestrielle. »

INSIST — « Arrêter à un jalon est une issue normale. Et un POC qui marche n’est pas un produit : restent l’intégration, l’UX, la conformité, le support, l’exploitation. Budgétez-les dès le départ. »

TRANSITION — « Étape 3 : brancher le modèle dans Spendo. »`,
  `⏱ 5 min · ÉTAPE 3 · INTÉGRATION

OBJECTIF — Montrer la règle de décision fondée sur la confiance, le repli et la journalisation.

DIRE — « La photo part vers le service IA. Trois étapes : masquer les données personnelles, lire avec le modèle, puis contrôler la cohérence — les lignes font-elles le total ? Il renvoie une réponse et une confiance, champ par champ. »

→ beat 1 : la règle de décision. « Et là, le produit décide. Confiance au-dessus de 90 % : on pré-remplit. Entre 60 et 90 : on pré-remplit en surlignant “à vérifier”. Sous 60 %, ou si c’est incohérent : on laisse le champ vide et on affiche la photo. Ces seuils, c’est le PO qui les fixe, avec le métier. »

→ beat 2 : repli et journal. « Le repli : si le service ne répond pas en cinq secondes, saisie manuelle. L’IA ne bloque jamais une note. Le journal : chaque prédiction, sa confiance, la correction de l’utilisateur. C’est la matière première du ré-entraînement. »

TRANSITION — « Cette règle de décision pose une question plus large : où placer l’humain ? »`,
  `⏱ 4 min · OÙ PLACER L’HUMAIN

OBJECTIF — Présenter les quatre niveaux d’automatisation et les associer aux features.

DIRE — « Quatre niveaux, de “l’humain décide” à “la machine décide”. La suggestion : l’IA propose, l’humain choisit. Le pré-remplissage : l’IA remplit, l’humain valide. L’automatique contrôlé : l’IA décide, l’humain contrôle un échantillon et peut annuler. Et l’automatique complet : personne ne regarde. »

→ beat 1 : les features. « B3 et B4 au niveau 1 : les alertes et l’assistant ne décident de rien. B1 au niveau 2. B2, la catégorie, au niveau 3 : gros volume, erreur facilement rattrapable. Le niveau 4 est rarement souhaitable. »

INSIST — « Plus l’erreur coûte cher ou touche une personne, plus l’humain reste près de la décision. On monte d’un niveau quand la mesure le justifie, pas parce que la démo était belle. »

TRANSITION — « Le niveau 2 n’a de sens que si l’humain voit vraiment l’erreur. C’est l’UX. »`,
  `⏱ 6 min · ÉTAPE 4 · UX (maquette interactive)

OBJECTIF — Faire comparer une UX naïve et une UX conçue pour l’erreur.

DEMO — Afficher d’abord la version par défaut. « Le ticket de la brasserie. Le modèle a lu 170 €. Rien ne l’indique : tout a l’air sûr, le bouton Envoyer est bleu. L’erreur partira au remboursement. »

DEMO — Activer « Version conçue pour l’erreur ». « Un bandeau dit que c’est lu automatiquement. Le montant est surligné : “110 ou 170 ?”, parce que les lignes ne font pas le total. La zone du ticket est encadrée. Les autres champs portent une petite étincelle. Le bouton attend la vérification. Et un lien permet de signaler une mauvaise lecture. »

DIRE — « À droite, cinq principes : dire que c’est l’IA, montrer le doute — en surlignage, pas en pourcentage —, rendre la correction plus rapide que la saisie, montrer d’où vient la réponse, et recueillir le retour. »

QUESTION — « Dans vos produits, lequel de ces cinq principes manque le plus souvent ? »

TRANSITION — « La feature est en production. Le travail commence. »`,
  `⏱ 4 min · EN PRODUCTION : MONITORING

OBJECTIF — Montrer les indicateurs à suivre et un cas de dérive.

DIRE — « Le meilleur indicateur de qualité est gratuit : la part des champs corrigés par les utilisateurs. Elle baisse les premières semaines, de 6,5 à 4,5 %. »

→ beat 1 : la dérive. « Semaine 8, ça monte à près de 10 %. Que s’est-il passé ? La SNCF a changé le format de ses billets. Le monde a changé, le modèle non. »
→ beat 2 : le ré-entraînement. « Le seuil d’alerte à 7 % a déclenché une analyse, on a ajouté des exemples, ré-entraîné : retour à 4,4 %. »

DIRE — « À droite, quatre indicateurs : qualité, adoption, valeur, coût. Le temps de saisie est passé de 4 minutes à 1 minute 10 : c’est la valeur promise au module 3, mesurée. »

TRANSITION — « Qui fait quoi dans tout ça ? »`,
  `⏱ 3 min · QUI FAIT QUOI

OBJECTIF — Clarifier les rôles et ce qui reste de la responsabilité du PO.

DIRE — « Lisez la colonne PO : un D partout. Le PO ne réalise rien de technique, mais il décide à chaque étape : le guide d’annotation, les seuils, la règle de décision, la transparence, les indicateurs. L’équipe data et les développeurs réalisent. Le DPO et le RSSI sont consultés à chaque étape, pas seulement à la fin. »

INSIST — « Le piège : déléguer les critères à l’équipe data parce que c’est technique. Un seuil de confiance est une décision de produit. »

TRANSITION — « Vérifions que le workflow est clair : un exercice d’ordre. »`,
  `⏱ 4 min · EXERCICE : REMETTRE DANS L’ORDRE (glisser-déposer)

OBJECTIF — Consolider la séquence du workflow.

CONSIGNE — « Huit étapes en désordre. Dictez-moi l’ordre, je glisse. »

→ beat 1 : l’ordre attendu s’affiche dans les cases.

DEBRIEF — « L’étape 1 surprend souvent : on fixe les critères d’acceptation avec le métier avant tout. Les étapes 5 et 6 se font en pratique en parallèle : l’UX se conçoit dès que la règle de décision est connue. »

TRANSITION — « Un QCM, et on passe à la rédaction. »`,
  `⏱ 2 min · QCM 7

OBJECTIF — Vérifier l’application de la règle de décision.

INTERACTION — Vote à main levée, puis clic.

→ beat 1 : la bonne réponse s’affiche (C).
→ beat 2 : l’essentiel s’affiche.

DIRE — « Sous le seuil, le produit ne devine pas. Et ce comportement sera écrit noir sur blanc dans la user story : c’est le sujet du module 5. »

TRANSITION — « Ce qu’il faut retenir. »`,
  `⏱ 1 min · À RETENIR · M4

OBJECTIF — Fixer les idées du module.

DIRE — « La bonne réponse se définit. On choisit sur preuves. Des jalons go / no-go. On décide quoi faire du doute. L’UX de l’erreur. Et une feature qui n’est jamais terminée. »

INSIST — Relire la citation : « Le PO ne construit pas le modèle : il décide des critères qui le jugent. »

TRANSITION — « Tous ces critères, il faut maintenant les écrire. Module 5 : cadrer une fonctionnalité IA. »`,
];
// @@NOTES-END
