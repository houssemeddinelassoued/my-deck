// ─── Module 1 · Au-delà des bases ───────────────────────────────────────────

const M1_Section: Page = () => (
  <Section n={1} title="Au-delà des bases" sub="Ce qui a changé chez Claude en 2026 et ce que cela change pour un développeur." dur="25 min">
    <SecItem n={1}>La gamme 2026 et comment choisir un modèle</SecItem>
    <SecItem n={2}>Réflexion adaptative et niveau d’effort</SecItem>
    <SecItem n={3}>Fenêtre de 1 M de jetons et prompt caching</SecItem>
    <SecItem n={4}>Sorties structurées, et ce qui ne marche plus</SecItem>
    <SecItem n={5}>Modèle + harnais : la définition qui guide les deux jours</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Rappel : base → 2026 ───────────────────────────────────────────────────
const M1Pair = ({ icon, tone, before, after, d }: { icon: IconName; tone: Tone; before: ReactNode; after: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '60px minmax(0, 1fr) 60px minmax(0, 1fr)', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone="grey" size={52} />
    <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{before}</div>
    <Icon name="arrow" size={34} color={C.electric} sw={2.6} />
    <div style={{ fontSize: 23, lineHeight: 1.35, color: C.ink, background: T[tone].bg, borderRadius: 12, padding: '10px 16px', boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}` }}>{after}</div>
  </div>
);

const M1_Rappel: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Ce que vous savez déjà… et ce qui a changé</Title>
    <Lede>Le principe ne bouge pas : un modèle prédit la suite d’un texte à partir de son contexte. Ce qui change, c’est tout ce qu’on peut régler autour.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '60px minmax(0, 1fr) 60px minmax(0, 1fr)', gap: 18 }}>
      <span />
      <Eyebrow c={C.muted} size={19}>
        L’usage « conversation »
      </Eyebrow>
      <span />
      <Eyebrow c={C.electric} size={19}>
        L’usage « développeur » en 2026
      </Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 310, width: 1680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.on(1)}>
        <M1Pair icon="brain" tone="blue" before="« Réfléchis étape par étape » dans le prompt" after={<><strong>Réflexion adaptative</strong> intégrée, dosée par un niveau d’effort</>} d={0} />
      </div>
      <div className={b.on(2)}>
        <M1Pair icon="doc" tone="navy" before="Coller quelques fichiers dans la conversation" after={<><strong>1 M de jetons</strong> de contexte, et un cache pour ne pas tout repayer</>} d={0} />
      </div>
      <div className={b.on(3)}>
        <M1Pair icon="code" tone="teal" before="« Réponds uniquement en JSON », puis prier" after={<><strong>Sorties structurées</strong> : un schéma JSON imposé par l’API</>} d={0} />
      </div>
      <div className={b.on(4)}>
        <M1Pair icon="tool" tone="violet" before="Copier-coller la réponse dans l’éditeur" after={<><strong>Outils et agents</strong> : Claude lit, exécute, modifie, vérifie</>} d={0} />
      </div>
      <div className={b.on(5)}>
        <M1Pair icon="shield" tone="pink" before="Relire à l’œil et espérer" after={<><strong>Harnais</strong> : contrats, garde-fous, tests et évaluations automatiques</>} d={0} />
      </div>
    </div>
  </Frame>
);

// ─── La gamme 2026 ──────────────────────────────────────────────────────────
const M1Model = ({ name, tag, tone, price, use, note, d }: { name: string; tag: string; tone: Tone; price: string; use: ReactNode; note: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <Eyebrow c={T[tone].fg} size={17}>
      {tag}
    </Eyebrow>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.navy, lineHeight: 1.05 }}>{name}</div>
    <div style={{ fontFamily: mono, fontSize: 19, color: C.soft }}>{price}</div>
    <div style={{ fontSize: 21, lineHeight: 1.42, color: C.ink }}>{use}</div>
    <div style={{ marginTop: 'auto', fontSize: 18, lineHeight: 1.4, color: C.muted }}>{note}</div>
  </div>
);

const M1_Gamme: Page = () => (
  <Frame mod={1}>
    <Title>La gamme Claude en novembre 2026</Title>
    <Lede>Quatre familles, 1 M de jetons de contexte chacune. Prix API par million de jetons (entrée / sortie).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 440, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
      <M1Model name="Haiku 5.5" tag="Rapide · économique" tone="teal" price="0,10 $ / 0,50 $" use="Classification, extraction en volume, sous-agents, juges sur des milliers de cas." note="Le bon réflexe pour tout ce qui tourne en boucle ou en masse." d={100} />
      <M1Model name="Sonnet 5.5" tag="Le quotidien du code" tone="blue" price="2 $ / 10 $" use="Code au quotidien, agents, automatisations d’entreprise : vitesse et capacité." note="Effort par défaut : high." d={200} />
      <M1Model name="Opus 5.5" tag="Raisonnement exigeant" tone="navy" price="4 $ / 20 $" use="Conception, bugs subtils, revues profondes, tâches agentiques longues." note="Réflexion toujours active, effort par défaut : medium." d={300} />
      <M1Model name="Fable 5.2" tag="Le plus capable" tone="violet" price="8 $ / 40 $" use="Les tâches les plus difficiles et les plus longues, en autonomie sur la durée." note="Plus cher, plus lent : à réserver aux cas qui le justifient." d={400} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 736, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.muted, ...dl(700) }}>
      <Icon name="calendar" size={24} color={C.electric} />
      Tarifs publics de l’API au 14 novembre 2026, susceptibles d’évoluer. Avec votre licence Team ou Enterprise, Claude Code et claude.ai sont inclus : vous ne payez pas au jeton.
    </div>
    <div style={{ position: 'absolute', left: 120, top: 820, width: 1680 }}>
      <Callout tone="blue" icon="scale" title="Règle pratique" size={23} cls={A.in} style={dl(850)}>
        Commencez par le plus petit modèle qui tient la qualité <em>sur vos cas</em>, et mesurez avant de monter. Le Module 3 vous donne l’outil pour mesurer.
      </Callout>
    </div>
  </Frame>
);

// ─── Choisir un modèle (cartes à retourner) ─────────────────────────────────
const M1Pick = ({ task, model, why, tone }: { task: string; model: string; why: string; tone: Tone }) => (
  <FlipCard
    w={530}
    h={250}
    tone="grey"
    backTone={tone}
    front={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Icon name="target" size={30} color={C.muted} />
        <div style={{ fontSize: 25, lineHeight: 1.35, color: C.ink, fontWeight: 600 }}>{task}</div>
      </div>
    }
    back={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: T[tone].fg }}>{model}</div>
        <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{why}</div>
      </div>
    }
  />
);

const M1_Choisir: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>À vous : quel modèle pour quelle tâche ?</Title>
    <Lede>Votez à voix haute pour chaque carte, puis je la retourne.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', justifyContent: 'space-between', rowGap: 30 }}>
      <M1Pick task="Qualifier 40 000 demandes clients par jour (type, priorité)" model="Haiku 5.5" why="Tâche simple, en masse : le coût par appel domine. On vérifie la qualité sur un échantillon." tone="teal" />
      <M1Pick task="Ajouter un endpoint et ses tests dans un dépôt connu" model="Sonnet 5.5" why="Le cas d’usage quotidien : rapide, bon en code et en agentique." tone="blue" />
      <M1Pick task="Trouver un bug de concurrence intermittent" model="Opus 5.5" why="Raisonnement long sur peu d’indices : l’effort et la profondeur paient." tone="navy" />
      <M1Pick task="Noter 1 000 réponses avec une grille fixe (juge)" model="Haiku 5.5 ou Sonnet 5.5" why="Un juge tourne en boucle : on prend le plus petit qui concorde avec un humain sur 30 cas." tone="teal" />
      <M1Pick task="Migrer 300 fichiers d’un framework à l’autre, en autonomie" model="Fable 5.2 ou Opus 5.5" why="Tâche longue, beaucoup d’étapes : la capacité à tenir sur la durée compte plus que le prix." tone="violet" />
      <M1Pick task="Relire une PR sensible (authentification, paiement)" model="Opus 5.5" why="Le coût d’une erreur dépasse de loin le coût du modèle. Et un humain relit quand même." tone="navy" />
    </div>
  </Frame>
);

// ─── Fenêtre de contexte ────────────────────────────────────────────────────
const M1_Contexte: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>1 M de jetons : le bon contexte, pas tout le contexte</Title>
    <Lede>Un million de jetons, c’est environ 750 000 mots, ou un dépôt de taille moyenne. Mais ce qui entre dans la fenêtre se paie trois fois.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div className={A.in} style={{ display: 'flex', height: 70, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW_SM }}>
        <div style={{ width: '6%', background: C.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>outils</div>
        <div style={{ width: '9%', background: C.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>système</div>
        <div style={{ width: '45%', background: T.teal.bg, color: T.teal.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>fichiers, docs, historique</div>
        <div style={{ width: '6%', background: C.electric, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>tâche</div>
        <div style={{ flex: 1, background: C.panel, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>place libre pour réfléchir et répondre</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 380, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="euro" tone="blue" title="En coût" size={23} pad={24} cls={b.on(1)}>
        Chaque jeton d’entrée est facturé à chaque appel. Un agent qui fait 40 tours relit 40 fois son contexte.
      </Card>
      <Card icon="clock" tone="navy" title="En latence" size={23} pad={24} cls={b.on(1)} style={dl(120)}>
        Plus le contexte est long, plus le premier jeton de réponse arrive tard.
      </Card>
      <Card icon="eye" tone="coral" title="En attention" size={23} pad={24} cls={b.on(1)} style={dl(240)}>
        Une consigne noyée dans 300 pages pèse moins. Le bruit dilue ce qui compte vraiment.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout tone="green" icon="filter" title="Ce que font les bons harnais" size={24} cls={b.on(2)}>
        Ils choisissent : un CLAUDE.md court, des fichiers lus à la demande, des sous-agents qui lisent à part et ne rapportent qu’un résumé, et un cache pour la partie stable.
      </Callout>
    </div>
  </Frame>
);

// ─── Réflexion adaptative ───────────────────────────────────────────────────
const M1_Reflexion: Page = () => (
  <Frame mod={1}>
    <Title>La réflexion est intégrée : vous réglez l’effort</Title>
    <Lede>Sur les modèles récents, Claude décide seul quand et combien réfléchir avant de répondre. Sur Opus 5.5 et Fable 5.2, la réflexion ne se coupe plus.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 860, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="brain" tone="blue" title="Réflexion adaptative" d={100}>
        Le modèle raisonne dans des blocs dédiés avant sa réponse. Par défaut, ce raisonnement n’est pas affiché.
      </Row2>
      <Row2 icon="gauge" tone="navy" title="Un seul levier : l’effort" d={200}>
        <Ic>low</Ic> <Ic>medium</Ic> <Ic>high</Ic> <Ic>xhigh</Ic> <Ic>max</Ic> : plus d’effort, plus de réflexion, plus de jetons, plus de temps.
      </Row2>
      <Row2 icon="x" tone="coral" title="Les anciens réglages renvoient une erreur" d={300}>
        Le « budget de réflexion » en jetons a disparu au profit de l’effort.
      </Row2>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 270, width: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodeDark file="appel API · TypeScript" size={21} cls={A.right} style={dl(250)}>
        <Ck>const</Ck> rep = <Ck>await</Ck> client.messages.<Cf>create</Cf>({'{'}
        {'\n'}  model: <Cs>'claude-opus-5-5'</Cs>,
        {'\n'}  max_tokens: <Cn>16000</Cn>,
        {'\n'}  output_config: {'{'} effort: <Cs>'high'</Cs> {'}'},
        {'\n'}  messages: [{'{'} role: <Cs>'user'</Cs>, content: tache {'}'}],
        {'\n'}{'}'});
      </CodeDark>
      <CodeDark file="Claude Code · terminal" size={21} cls={A.right} style={dl(400)}>
        <Sh c="# même idée, en ligne de commande">claude --effort high</Sh>
        <span style={{ color: '#8A8A98' }}>{'> '}</span>/effort xhigh
      </CodeDark>
    </div>
  </Frame>
);

// ─── Effort : curseur interactif ────────────────────────────────────────────
const EFFORTS = [
  { k: 'low', q: 2, t: 1, c: 1, use: 'Classification, extraction simple, sous-agents de lecture, discussions courtes.' },
  { k: 'medium', q: 3, t: 2, c: 2, use: 'Défaut d’Opus 5.5 : bon compromis pour la plupart des tâches de code courantes.' },
  { k: 'high', q: 4, t: 3, c: 3, use: 'Défaut de Sonnet 5.5 : code non trivial, revues, raisonnement à plusieurs étapes.' },
  { k: 'xhigh', q: 4.5, t: 4, c: 4, use: 'Tâches agentiques longues de code, quand chaque erreur coûte une boucle de plus.' },
  { k: 'max', q: 5, t: 5, c: 5, use: 'Quand la justesse compte plus que le coût et le temps. À mesurer, pas à mettre par défaut.' },
];

const M1Gauge = ({ label, v, tone }: { label: string; v: number; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.ink }}>
      <span>{label}</span>
    </div>
    <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${v * 20}%`, height: '100%', background: STRONG[tone], borderRadius: 11, transition: `width 500ms ${EASE}` }} />
    </div>
  </div>
);

const M1_Effort: Page = () => {
  const [i, setI] = useState(2);
  const e = EFFORTS[i];
  return (
    <Frame mod={1} kind="exercice">
      <Title>Quel effort pour quelle tâche ?</Title>
      <Lede>Déplacez le curseur. Les jauges donnent des ordres de grandeur relatifs, pas des mesures : mesurez sur vos propres cas.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Eyebrow c={C.muted} size={19}>
            output_config.effort
          </Eyebrow>
          <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 44, color: C.electric }}>{e.k}</span>
        </div>
        <Range value={i} onChange={setI} min={0} max={4} step={1} w={836} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 19, color: C.muted }}>
          {EFFORTS.map((x) => (
            <span key={x.k}>{x.k}</span>
          ))}
        </div>
        <M1Gauge label="Profondeur de raisonnement" v={e.q} tone="blue" />
        <M1Gauge label="Temps de réponse" v={e.t} tone="navy" />
        <M1Gauge label="Jetons consommés" v={e.c} tone="coral" />
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card icon="target" tone="blue" title={`Quand choisir « ${e.k} » ?`} size={24} pad={26} cls={A.right}>
          {e.use}
        </Card>
        <Callout tone="yellow" icon="alert" title="Piège fréquent" size={23} cls={A.right} style={dl(200)}>
          Le plus petit modèle avec un effort plus faible bat souvent l’ancien gros modèle au maximum. Comparez au coût <strong>par tâche réussie</strong>, pas par appel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Prompt caching ─────────────────────────────────────────────────────────
const M1Seg = ({ w, bg, c, children }: { w: number; bg: string; c: string; children: ReactNode }) => (
  <div style={{ width: w, height: 64, background: bg, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700, flex: 'none' }}>{children}</div>
);

const M1_Caching: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Prompt caching : ne repayez pas ce qui ne change pas</Title>
    <Lede>Claude met en cache le <strong>début identique</strong> de vos requêtes. Ordre de lecture : outils → système → messages. Un octet qui change invalide tout ce qui suit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 320, width: 1680, display: 'flex', flexDirection: 'column', gap: 22 }}>
      {[
        { n: 1, lab: 'Appel 1', tag: 'écriture du cache · ×1,25', tone: 'yellow' as Tone, last: 'demande n° 1' },
        { n: 2, lab: 'Appel 2', tag: 'lecture du cache · ≈ ×0,05 à ×0,1', tone: 'green' as Tone, last: 'demande n° 2' },
        { n: 3, lab: 'Appel 3', tag: 'lecture du cache · ≈ ×0,05 à ×0,1', tone: 'green' as Tone, last: 'demande n° 3' },
      ].map((r) => (
        <div key={r.n} className={b.on(r.n)} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ width: 110, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{r.lab}</span>
          <div style={{ display: 'flex', borderRadius: 14, overflow: 'hidden', boxShadow: SHADOW_SM }}>
            <M1Seg w={170} bg={C.navy} c="#fff">
              outils
            </M1Seg>
            <M1Seg w={330} bg={C.blue} c="#fff">
              instructions système
            </M1Seg>
            <M1Seg w={360} bg={T.teal.bg} c={T.teal.fg}>
              exemples, schéma, code
            </M1Seg>
            <div style={{ width: 8, background: C.electric }} />
            <M1Seg w={190} bg="#fff" c={C.ink}>
              {r.last}
            </M1Seg>
          </div>
          <Tag tone={r.tone} size={20}>
            {r.tag}
          </Tag>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 1036, top: 286, fontSize: 18, fontWeight: 700, color: C.electric, fontFamily: display, letterSpacing: '0.08em' }}>POINT DE CACHE</div>
    <div style={{ position: 'absolute', left: 120, top: 600, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="layers" tone="green" title="Stable d’abord" size={22} pad={22} cls={A.in} style={dl(300)}>
        Outils, consignes, exemples et schéma en tête, toujours dans le même ordre. Le variable (la demande) à la fin.
      </Card>
      <Card icon="alert" tone="coral" title="Invalideurs silencieux" size={22} pad={22} cls={A.in} style={dl(400)}>
        La date du jour dans le système, un identifiant de requête, un JSON aux clés non triées, une liste d’outils qui varie.
      </Card>
      <Card icon="clock" tone="navy" title="Durée et seuil" size={22} pad={22} cls={A.in} style={dl(500)}>
        5 minutes par défaut (1 h en option). En dessous de quelques milliers de jetons, le préfixe n’est pas mis en cache.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(700) }}>
      <Icon name="check" size={24} color={C.green} /> Vérifiez dans la réponse : <Ic>usage.cache_read_input_tokens</Ic> doit être supérieur à 0 dès le deuxième appel.
    </div>
  </Frame>
);

// ─── Caching : calcul interactif ────────────────────────────────────────────
const M1_CacheCalc: Page = () => {
  const [calls, setCalls] = useState(1000);
  const [prefix, setPrefix] = useState(8000);
  const vari = 600; // jetons variables par demande
  // Sonnet 5.5 : entrée 2 $ / MTok, écriture du cache ×1,25, lecture 0,10 $ / MTok.
  const sans = (calls * (prefix + vari) * 2) / 1e6;
  const avec = (prefix * 2.5 + (calls - 1) * prefix * 0.1 + calls * vari * 2) / 1e6;
  const gain = sans > 0 ? Math.round((1 - avec / sans) * 100) : 0;
  return (
    <Frame mod={1} kind="exercice">
      <Title>Combien rapporte le cache sur le pipeline Guichet ?</Title>
      <Lede>Hypothèse : Sonnet 5.5, un préfixe stable (consignes, exemples, schéma) et 600 jetons de demande variable. Coût d’entrée seulement.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, color: C.ink }}>
          <span>Demandes traitées (dans la durée du cache)</span>
          <strong style={{ fontFamily: mono, color: C.electric }}>{fr(calls)}</strong>
        </div>
        <Range value={calls} onChange={setCalls} min={10} max={10000} step={10} w={836} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, color: C.ink, marginTop: 8 }}>
          <span>Taille du préfixe stable (jetons)</span>
          <strong style={{ fontFamily: mono, color: C.electric }}>{fr(prefix)}</strong>
        </div>
        <Range value={prefix} onChange={setPrefix} min={2000} max={40000} step={1000} w={836} />
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
        <Stat value={`${fr(sans, 2)} $`} label="sans cache" tone="coral" size={56} cls={A.right} />
        <Stat value={`${fr(avec, 2)} $`} label="avec cache" tone="green" size={56} cls={A.right} style={dl(120)} />
        <div className={A.right} style={{ gridColumn: '1 / span 2', background: T.green.bg, borderRadius: 18, padding: '20px 26px', boxShadow: `inset 0 0 0 2px ${T.green.bd}`, ...dl(240) }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: T.green.fg }}>−{gain} %</div>
          <div style={{ fontSize: 22, color: C.ink }}>sur le coût d’entrée, si les appels restent dans la durée du cache</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 780, width: 1680 }}>
        <Callout tone="navy" icon="bolt" title="Bonus rarement cité : la latence" size={23} cls={A.in} style={dl(400)}>
          Un préfixe lu dans le cache n’est pas retraité : la réponse commence plus tôt. Sur un agent qui relit son contexte à chaque tour, c’est sensible.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Sorties structurées ────────────────────────────────────────────────────
const M1_Structured: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Sorties structurées : le JSON garanti par l’API</Title>
    <Lede>On fournit un schéma JSON ; la génération est contrainte pour le respecter. Fini le JSON tronqué, les clés inventées, le texte avant l’accolade.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <CodeDark file="extraction · TypeScript" size={20} cls={A.left}>
        <Ck>const</Ck> rep = <Ck>await</Ck> client.messages.<Cf>create</Cf>({'{'}
        {'\n'}  model: <Cs>'claude-sonnet-5-5'</Cs>,
        {'\n'}  max_tokens: <Cn>4000</Cn>,
        {'\n'}  output_config: {'{'}
        {'\n'}    format: {'{'} type: <Cs>'json_schema'</Cs>, schema: SCHEMA_DEMANDE {'}'},
        {'\n'}  {'}'},
        {'\n'}  messages: [{'{'} role: <Cs>'user'</Cs>, content: texte {'}'}],
        {'\n'}{'}'});
        {'\n'}
        {'\n'}<Cc>{'// le premier bloc texte contient un JSON valide'}</Cc>
        {'\n'}<Ck>const</Ck> demande = JSON.<Cf>parse</Cf>(texteDe(rep));
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card icon="checkCircle" tone="green" title="Ce que l’API garantit" size={23} pad={24} cls={b.on(1)}>
        Un JSON qui <strong>respecte le schéma</strong> : types, champs obligatoires, valeurs d’une énumération.
      </Card>
      <Card icon="alert" tone="coral" title="Ce qu’elle ne garantit pas" size={23} pad={24} cls={b.on(2)}>
        Que les valeurs soient <strong>justes</strong> : une priorité « urgente » peut être mal jugée, un téléphone mal recopié. Ça, c’est le travail du harnais (Module 3).
      </Card>
      <Callout tone="blue" icon="tool" title="Même idée pour les outils" size={22} cls={b.on(2)} style={dl(150)}>
        <Ic>strict: true</Ic> sur une définition d’outil garantit des arguments conformes à son schéma.
      </Callout>
    </div>
  </Frame>
);

// ─── Ce qui ne marche plus ──────────────────────────────────────────────────
const M1Old = ({ old, now, d }: { old: ReactNode; now: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 50px minmax(0, 1fr)', alignItems: 'center', gap: 16, ...dl(d) }}>
    <div style={{ fontSize: 22, lineHeight: 1.35, color: T.coral.fg, background: T.coral.bg, borderRadius: 12, padding: '12px 16px', textDecoration: 'line-through', textDecorationThickness: 1.5 }}>{old}</div>
    <Icon name="arrow" size={30} color={C.faint} sw={2.6} />
    <div style={{ fontSize: 22, lineHeight: 1.35, color: C.ink, background: T.green.bg, borderRadius: 12, padding: '12px 16px' }}>{now}</div>
  </div>
);

const M1_Pieges: Page = () => (
  <Frame mod={1}>
    <Title>Vos prompts de 2024 : ce qui renvoie désormais une erreur</Title>
    <Lede>Sur les modèles 2026 et la version d’API actuelle, plusieurs habitudes provoquent une erreur 400 ou dégradent le résultat.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Old old="Pré-remplir la réponse de l’assistant avec « { »" now="Sorties structurées, ou consigne de format dans le système" d={100} />
      <M1Old old="temperature, top_p, top_k pour « stabiliser »" now="Rien : ces paramètres sont refusés. Stabilisez par le prompt, les exemples, le schéma" d={200} />
      <M1Old old="Un budget de réflexion en nombre de jetons" now="Réflexion adaptative + niveau d’effort" d={300} />
      <M1Old old="Forcer l’appel d’un outil précis (tool_choice forcé)" now="tool_choice auto + consigne qui nomme l’outil + strict: true" d={400} />
      <M1Old old="« Tu DOIS ABSOLUMENT… » en majuscules, partout" now="Consignes calmes et motivées : les modèles récents sur-réagissent aux injonctions" d={500} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="À retenir" size={23} cls={A.in} style={dl(700)}>
        Un prompt est du code : il a des dépendances (modèle, version d’API) et il vieillit. Relisez vos prompts à chaque changement de modèle.
      </Callout>
    </div>
  </Frame>
);

// ─── Harness engineering : définition ───────────────────────────────────────
const M1Ring = ({ a, label, tone, icon }: { a: number; label: string; tone: Tone; icon: IconName }) => {
  const r = 300;
  const x = 420 + r * Math.cos((a * Math.PI) / 180);
  const y = 330 + r * Math.sin((a * Math.PI) / 180);
  return (
    <div style={{ position: 'absolute', left: x - 110, top: y - 46, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <IconTile name={icon} tone={tone} size={58} solid />
      <span style={{ fontSize: 21, fontWeight: 700, color: C.ink, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </div>
  );
};

const M1_Harness: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Modèle + harnais = un système fiable</Title>
    <Lede>Le harnais, c’est tout ce qui entoure le modèle : ce qu’il voit, ce qu’il peut faire, et ce qui vérifie ce qu’il produit.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 268, width: 840, height: 680 }}>
      <svg width={840} height={680} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <circle cx={420} cy={330} r={300} fill="none" stroke={C.rule} strokeWidth={3} strokeDasharray="6 10" className={A.spin} />
      </svg>
      <div style={{ position: 'absolute', left: 300, top: 210, width: 240, height: 240, borderRadius: 999, background: G.navy, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW }}>
        <Icon name="sparkles" size={52} color="#fff" />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, marginTop: 8 }}>Modèle</div>
      </div>
      <M1Ring a={-90} label="Instructions et contexte" tone="blue" icon="note" />
      <M1Ring a={-18} label="Outils et permissions" tone="teal" icon="tool" />
      <M1Ring a={54} label="Contrats et schémas" tone="navy" icon="code" />
      <M1Ring a={126} label="Vérifications automatiques" tone="green" icon="shieldCheck" />
      <M1Ring a={198} label="Boucle et évaluation" tone="violet" icon="loop" />
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 270, width: 760, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card icon="shield" tone="navy" title="Harness engineering" size={24} pad={26} cls={b.on(1)}>
        Concevoir ce qui entoure le modèle pour que le résultat soit <strong>fiable, vérifiable et reproductible</strong>, même quand le modèle se trompe.
      </Card>
      <div className={b.on(2)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Bullet size={24}>
          <strong>Contraindre</strong> : ce que le modèle voit, peut faire et doit rendre
        </Bullet>
        <Bullet size={24}>
          <strong>Vérifier</strong> : par du code, pas par une promesse
        </Bullet>
        <Bullet size={24}>
          <strong>Boucler</strong> : renvoyer l’erreur, corriger, re-vérifier
        </Bullet>
      </div>
      <Callout tone="blue" icon="terminal" title="Claude Code est un harnais" size={22} cls={b.on(2)} style={dl(200)}>
        Une boucle d’agent, des outils, des permissions, un contexte géré. Le Jour 2, vous le configurez pour votre dépôt.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Rappel, M1_Gamme, M1_Choisir, M1_Contexte, M1_Reflexion, M1_Effort, M1_Caching, M1_CacheCalc, M1_Structured, M1_Pieges, M1_Harness];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 1 · J1 9:30

OBJECTIF — Annoncer les cinq points du module : ce qui a changé chez Claude, vu par un développeur.

DIRE — « Vous connaissez déjà les bases : un modèle de langage, un prompt, une réponse. Ce module va vite sur ce qui a changé en 2026, parce que plusieurs habitudes de prompting sont devenues inutiles, voire renvoient une erreur. »

TRANSITION — « Commençons par le avant / après. »`,
  `⏱ 2 min · CE QUI A CHANGÉ (5 beats)

OBJECTIF — Montrer que le principe ne change pas, mais que tout ce qui l’entoure se règle.

DIRE — « Le principe ne bouge pas : un modèle prédit la suite d’un texte à partir de son contexte. »
→ beat 1 « Avant, on écrivait “réfléchis étape par étape”. Aujourd’hui la réflexion est intégrée et on règle un niveau d’effort. »
→ beat 2 « Avant, on collait trois fichiers. Aujourd’hui, un million de jetons de contexte, et un cache. »
→ beat 3 « Avant, on suppliait le modèle de répondre en JSON. Aujourd’hui, l’API impose un schéma. »
→ beat 4 « Avant, on copiait-collait. Aujourd’hui, Claude agit avec des outils. »
→ beat 5 « Et surtout : avant, on relisait à l’œil. Aujourd’hui, on construit un harnais qui vérifie. C’est le fil des deux jours. »

TRANSITION — « Voyons d’abord les modèles. »`,
  `⏱ 2 min · LA GAMME 2026

OBJECTIF — Situer les quatre familles et leur ordre de prix, sans entrer dans les fiches techniques.

DIRE — « Quatre familles. Haiku 5.5 : rapide et très peu cher, pour ce qui tourne en masse. Sonnet 5.5 : le quotidien du code et des agents. Opus 5.5 : le raisonnement exigeant. Fable 5.2 : le plus capable, pour les tâches les plus longues et les plus difficiles, au prix fort. Tous ont un million de jetons de contexte. »

DIRE — « Les prix sont ceux de l’API ; avec votre licence, vous ne payez pas au jeton dans Claude Code. Mais dès que vous automatisez, c’est le prix API qui compte. »

ANIMATION — Tarifs vérifiés au 14 novembre 2026 : re-vérifier sur la page de tarifs d’Anthropic avant chaque session.

TRANSITION — « À vous de choisir. »`,
  `⏱ 3 min · QUEL MODÈLE ? (cartes à retourner, vote oral)

OBJECTIF — Faire pratiquer le choix modèle / tâche avec l’argument du coût par tâche réussie.

DIRE — « Six situations. Pour chacune, vous me dites à voix haute le modèle que vous prendriez, et je retourne la carte. »

ANIMATION — Lire chaque carte, écouter deux ou trois réponses, cliquer pour retourner. Insister sur la carte « juge » : on prend le plus petit modèle qui concorde avec un humain, et on le vérifie sur une trentaine de cas. Sur la dernière : même avec Opus, un humain relit une PR sensible.

TRANSITION — « Parlons du contexte. »`,
  `⏱ 2 min · FENÊTRE DE CONTEXTE (2 beats)

OBJECTIF — Montrer que 1 M de jetons est une capacité, pas une stratégie.

DIRE — « Un million de jetons, c’est énorme : un dépôt moyen entier. Mais tout ce que vous mettez dedans se paie trois fois. »
→ beat 1 « En coût, à chaque appel. En latence. Et en attention : une consigne noyée dans trois cents pages pèse moins. »
→ beat 2 « Les bons harnais choisissent : un fichier d’instructions court, des lectures à la demande, des sous-agents qui lisent à part, et un cache pour la partie stable. Claude Code fait exactement ça. »

TRANSITION — « Et pour réfléchir ? »`,
  `⏱ 2 min · RÉFLEXION ADAPTATIVE

OBJECTIF — Expliquer la réflexion intégrée et le levier unique de l’effort.

DIRE — « Les modèles récents raisonnent dans des blocs dédiés avant de répondre, et décident eux-mêmes combien. Sur Opus 5.5 et Fable 5.2, on ne peut même plus couper la réflexion. Votre levier, c’est l’effort : de low à max. »

DIRE — « À droite, la même idée dans l’API et dans Claude Code. L’ancien “budget de réflexion” en jetons renvoie désormais une erreur. »

TRANSITION — « Quel effort choisir ? »`,
  `⏱ 2 min · EFFORT (curseur interactif)

OBJECTIF — Donner des repères d’usage pour chaque niveau d’effort.

DIRE — « Je déplace le curseur. Low pour la classification et les sous-agents de lecture. Medium, c’est le défaut d’Opus 5.5. High, le défaut de Sonnet 5.5, pour le code non trivial. Xhigh pour les longues tâches agentiques de code. Max quand la justesse compte plus que tout, et seulement après avoir mesuré. »

DIRE — « Le piège : comparer au coût par appel. Ce qui compte, c’est le coût par tâche réussie : un appel moins cher qui demande trois corrections coûte plus cher. »

TRANSITION — « Deuxième levier d’économie : le cache. »`,
  `⏱ 3 min · PROMPT CACHING (3 beats)

OBJECTIF — Faire comprendre le mécanisme du préfixe et les règles de placement.

DIRE — « Claude met en cache le début identique de vos requêtes, dans l’ordre outils, système, messages. »
→ beat 1 « Premier appel : il écrit le cache, un peu plus cher que la normale. »
→ beat 2 « Deuxième appel avec le même début : il lit le cache, pour une fraction du prix. »
→ beat 3 « Et ainsi de suite tant que le cache vit : cinq minutes par défaut, une heure en option. »

DIRE — « Trois règles en bas : le stable d’abord et le variable à la fin ; attention aux invalideurs silencieux, comme la date du jour dans le système ; et un seuil minimal de taille. Vérifiez toujours cache_read_input_tokens. »

TRANSITION — « Combien ça rapporte sur notre fil rouge ? »`,
  `⏱ 2 min · CALCUL DU CACHE (curseurs)

OBJECTIF — Chiffrer le gain sur un cas réaliste et montrer que le gain dépend du rapport préfixe / partie variable.

DIRE — « Notre pipeline Guichet : des consignes, des exemples et un schéma stables, et une demande variable de six cents jetons. Je pousse le nombre de demandes : le gain grimpe vite. Je réduis le préfixe : le gain baisse, et sous un certain seuil il n’y a même plus de cache. »

ANIMATION — Hypothèses affichées : Sonnet 5.5, entrée 2 $ par million, écriture ×1,25, lecture 0,10 $ par million. Seul le coût d’entrée est calculé.

TRANSITION — « Troisième changement : le JSON. »`,
  `⏱ 2 min · SORTIES STRUCTURÉES (2 beats)

OBJECTIF — Distinguer la garantie de forme (schéma) de la garantie de fond (valeurs justes).

DIRE — « On passe un schéma JSON dans output_config.format, et la génération est contrainte : le JSON est valide et conforme au schéma. C’est ce qu’on utilisera à l’Atelier 2 et à l’Atelier 3. »
→ beat 1 « Garanti : la forme, les types, les champs obligatoires, les valeurs d’une liste. »
→ beat 2 « Pas garanti : que les valeurs soient justes. Une priorité mal jugée reste mal jugée. C’est le travail du harnais. Et même idée pour les outils, avec strict: true. »

TRANSITION — « Ce qui ne marche plus. »`,
  `⏱ 2 min · CE QUI RENVOIE UNE ERREUR

OBJECTIF — Désamorcer les habitudes héritées qui cassent sur les modèles 2026.

DIRE — « Si vous avez des prompts de 2024 en production, voici ce qui casse. Le pré-remplissage de la réponse : erreur. Temperature et top_p : refusés par la version actuelle de l’API. Le budget de réflexion : remplacé par l’effort. Forcer un outil précis : erreur sur Opus 5.5 et Sonnet 5.5, on passe par auto plus une consigne. Et les majuscules partout : les modèles récents prennent les consignes très au sérieux, ils sur-réagissent. »

DIRE — « Un prompt est du code : il a des dépendances et il vieillit. »

TRANSITION — « Et maintenant la définition qui va guider les deux jours. »`,
  `⏱ 3 min · MODÈLE + HARNAIS (2 beats)

OBJECTIF — Poser la définition du harness engineering et le triptyque contraindre / vérifier / boucler.

DIRE — « Au centre, le modèle. Autour, le harnais : les instructions et le contexte, les outils et les permissions, les contrats et les schémas, les vérifications automatiques, la boucle et l’évaluation. »
→ beat 1 « Le harness engineering, c’est concevoir tout ça pour que le résultat soit fiable même quand le modèle se trompe, parce qu’il se trompera. »
→ beat 2 « Trois verbes : contraindre, vérifier, boucler. Et Claude Code lui-même est un harnais : demain, vous le configurerez pour votre dépôt. »

TRANSITION — « Avant le harnais, le prompt. Module 2 : le prompt engineering avancé pour le code. »`,
];
// @@NOTES-END
