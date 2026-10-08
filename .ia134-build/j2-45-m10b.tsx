// ─── M10 (suite) · Tableau de bord, amélioration continue, QCM 11 ───────────

// ─── Tableau de bord simulé ─────────────────────────────────────────────────
const M10bTile = ({
  tone,
  label,
  target,
  trend,
  good,
  d,
  children,
}: {
  tone: Tone;
  label: string;
  target: string;
  trend: string;
  good: boolean;
  d: number;
  children: ReactNode;
}) => (
  <div className={A.in} style={{ flex: 1, display: 'flex', ...dl(d) }}>
    <div
      style={{
        flex: 1,
        boxSizing: 'border-box',
        padding: '24px 26px 20px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
      }}
    >
      <Eyebrow c={T[tone].fg} size={21}>
        {label}
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 76, lineHeight: 1, color: C.ink, whiteSpace: 'nowrap' }}>
        {children}
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 21, color: C.muted }}>
        <span>{target}</span>
        <span style={{ fontWeight: 700, color: good ? C.green : C.coral }}>{trend}</span>
      </div>
    </div>
  </div>
);

const M10bBar = ({
  label,
  vol,
  pct,
  tone,
  d,
  hi,
}: {
  label: string;
  vol: string;
  pct: number;
  tone: Tone;
  d: number;
  hi?: number;
}) => (
  <div
    className={hi ? b.hi(hi) : undefined}
    style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '8px 12px', borderRadius: 12, background: hi ? T.coral.bg : 'transparent' }}
  >
    <div style={{ width: 300, flex: 'none' }}>
      <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 20, lineHeight: 1.3, color: C.muted }}>{vol}</div>
    </div>
    <div style={{ position: 'relative', flex: 1, height: 30, borderRadius: 15, background: C.panel }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: 30, borderRadius: 15, background: STRONG[tone], ...dl(d) }} />
      <div style={{ position: 'absolute', left: '90%', top: -8, bottom: -8, borderLeft: `3px dashed ${C.ink}` }} />
    </div>
    <div style={{ width: 96, flex: 'none', textAlign: 'right', fontFamily: mono, fontSize: 28, fontWeight: 700, color: tone === 'coral' ? C.coral : C.ink }}>
      <CountUp to={pct} delay={d} />
      {' %'}
    </div>
  </div>
);

const M10b_Dashboard: Page = () => (
  <Frame mod={10} kind="demo" beats={2}>
    <Title>Tableau de bord : le pilote, semaine 6</Title>
    <Lede>Agent de tri des courriels de Boréal · 1 100 courriels cette semaine · une ligne par famille de KPI.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <M10bTile tone="green" label="Exactitude globale" target="Cible : ≥ 95 %" trend="▼ 1,1 pt" good={false} d={0}>
        <CountUp to={94.6} digits={1} suffix=" %" />
      </M10bTile>
      <M10bTile tone="blue" label="Taux d’automatisation" target="Cible : 60 %" trend="▲ 4 pts" good d={120}>
        <CountUp to={63} suffix=" %" delay={120} />
      </M10bTile>
      <M10bTile tone="teal" label="Satisfaction (CSAT)" target="Cible : ≥ 4 / 5" trend="▲ 0,2" good d={240}>
        <CountUp to={4.3} digits={1} suffix=" / 5" delay={240} />
      </M10bTile>
      <M10bTile tone="coral" label="Coût par courriel" target="Cible : < 0,30 $" trend="▼ 0,03 $" good d={360}>
        <CountUp to={0.21} digits={2} suffix=" $" delay={360} />
      </M10bTile>
    </div>
    {/* Exactitude par type de courriel */}
    <div
      className={A.in}
      style={{
        position: 'absolute',
        left: 120,
        top: 490,
        width: 940,
        boxSizing: 'border-box',
        padding: '22px 22px 18px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: SHADOW,
        ...dl(400),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 12px 8px' }}>
        <Eyebrow c={C.muted} size={21}>
          Exactitude par type de courriel
        </Eyebrow>
        <span style={{ fontSize: 20, color: C.muted }}>┆ seuil d’alerte : 90 %</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M10bBar label="Suivi de commande" vol="520 courriels" pct={98} tone="green" d={600} />
        <M10bBar label="Changement d’adresse" vol="110 courriels" pct={97} tone="green" d={700} />
        <M10bBar label="Question sur un produit" vol="160 courriels" pct={95} tone="green" d={800} />
        <M10bBar label="Facturation" vol="220 courriels" pct={92} tone="teal" d={900} />
        <M10bBar label="Remboursement / retour" vol="90 courriels" pct={78} tone="coral" d={1000} hi={1} />
      </div>
    </div>
    {/* Alerte + lecture */}
    <div style={{ position: 'absolute', left: 1084, top: 490, width: 716, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className={A.pop} style={dl(1500)}>
        <div
          className={A.glow}
          style={{
            boxSizing: 'border-box',
            padding: '20px 24px',
            background: T.coral.bg,
            borderLeft: `8px solid ${C.coral}`,
            borderRadius: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={A.blink} style={{ width: 18, height: 18, borderRadius: 9, background: C.coral, flex: 'none' }} />
            <Eyebrow c={T.coral.fg} size={24}>
              Alerte · lundi 7 h 02
            </Eyebrow>
          </div>
          <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1.35, color: C.ink }}>
            <Strong c={C.coral}>Remboursements : 78&nbsp;%</Strong> d’exactitude, sous le seuil de 90&nbsp;%, depuis le 3 octobre.
          </div>
        </div>
      </div>
      <div className={b.on(1)}>
        <Callout title="Ce que la moyenne cache" tone="yellow" icon="eye" size={24}>
          94,6&nbsp;% au global… mais les erreurs tombent sur les courriels qui touchent <Hl>l’argent des clients</Hl>.
        </Callout>
      </div>
      <div className={b.on(2)}>
        <Callout title="Réaction immédiate" tone="blue" icon="humanCheck" size={24}>
          Remboursements en validation humaine le temps de corriger. Puis : trouver la cause.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Amélioration continue ──────────────────────────────────────────────────
const M10bNode = ({ x, y, beat, tone, icon, name }: { x: number; y: number; beat: number; tone: Tone; icon: IconName; name: string }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x - 125, top: y - 46, width: 250 }}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 92,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 20px',
        background: C.card,
        borderRadius: 16,
        boxShadow: `${SHADOW}, inset 0 0 0 3px ${STRONG[tone]}`,
      }}
    >
      <IconTile name={icon} tone={tone} size={56} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1, color: C.ink }}>{name}</span>
    </div>
  </div>
);

const M10bChevron = ({ x, y, rot, beat }: { x: number; y: number; rot: number; beat: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path className={b.fade(beat)} d="M -11 -12 L 7 0 L -11 12" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const M10bStep = ({ n, beat, tone, title, children }: { n: number; beat: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 31, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 25, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M10B_LOOP = 'M 520 390 A 230 230 0 1 1 519.99 390';

const M10b_Loop: Page = () => (
  <Frame mod={10} beats={5}>
    <Title>Amélioration continue et maintenance : une boucle</Title>
    <Lede>Un agent n’est jamais « fini » : données, politiques et clients changent chaque semaine.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <circle className={A.fade} cx={520} cy={620} r={230} fill="none" stroke={C.rule} strokeWidth={5} strokeDasharray="10 14" />
      <path className={b.draw(2)} pathLength={1} d="M 520 390 A 230 230 0 0 1 750 620" fill="none" stroke={C.blue} strokeWidth={6} />
      <path className={b.draw(3)} pathLength={1} d="M 750 620 A 230 230 0 0 1 520 850" fill="none" stroke={C.blue} strokeWidth={6} />
      <path className={b.draw(4)} pathLength={1} d="M 520 850 A 230 230 0 0 1 290 620" fill="none" stroke={C.blue} strokeWidth={6} />
      <path className={b.draw(5)} pathLength={1} d="M 290 620 A 230 230 0 0 1 520 390" fill="none" stroke={C.blue} strokeWidth={6} />
      <M10bChevron x={682.6} y={457.4} rot={45} beat={2} />
      <M10bChevron x={682.6} y={782.6} rot={135} beat={3} />
      <M10bChevron x={357.4} y={782.6} rot={225} beat={4} />
      <M10bChevron x={357.4} y={457.4} rot={315} beat={5} />
      <g className={b.fade(5)}>
        <FlowDot path={M10B_LOOP} dur={5} r={9} color={C.yellow} />
      </g>
    </svg>
    <div className={A.fade} style={{ position: 'absolute', left: 400, top: 568, width: 240, textAlign: 'center', ...dl(200) }}>
      <Icon name="loop" size={44} color={C.blue} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: C.ink }}>Chaque semaine</div>
    </div>
    <M10bNode x={520} y={390} beat={1} tone="blue" icon="chart" name="Mesurer" />
    <M10bNode x={750} y={620} beat={2} tone="violet" icon="search" name="Analyser" />
    <M10bNode x={520} y={850} beat={3} tone="yellow" icon="gear" name="Ajuster" />
    <M10bNode x={290} y={620} beat={4} tone="green" icon="check" name="Re-tester" />
    <div style={{ position: 'absolute', left: 960, top: 280, width: 840 }}>
      <Eyebrow c={C.muted} size={22} cls={A.fade}>
        Suite de l’alerte « remboursements »
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <M10bStep n={1} beat={1} tone="blue" title="Mesurer">
          Remboursements : 78&nbsp;% depuis le 3 octobre (seuil : 90&nbsp;%).
        </M10bStep>
        <M10bStep n={2} beat={2} tone="violet" title="Analyser">
          On lit 20 erreurs dans les traces : 14 citent l’ancienne politique de retour.
        </M10bStep>
        <M10bStep n={3} beat={3} tone="yellow" title="Ajuster">
          Nouvelle politique ajoutée à la base documentaire, l’ancienne retirée.
        </M10bStep>
        <M10bStep n={4} beat={4} tone="green" title="Re-tester">
          Jeu de test doré + les 20 cas ratés : 95&nbsp;%, aucune régression. On redéploie.
        </M10bStep>
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 960, top: 800, width: 840 }}>
      <Callout title="Règle d’or" tone="yellow" icon="bulb" size={25}>
        Chaque erreur vue en production devient <Hl>un nouveau cas de test</Hl>. Un seul changement à la fois.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM 11 ─────────────────────────────────────────────────────────────────
const M10b_Qcm11: Page = () => (
  <QcmPage
    mod={10}
    n={11}
    title="Juger un agent"
    q="Après deux mois de pilote, l’agent de tri traite 85 % des courriels sans intervention humaine. Que pouvez-vous en conclure ?"
    explain="L’automatisation mesure le volume, pas la qualité : un agent qui répond vite et faux automatise aussi ses erreurs. On lit ensemble qualité, efficacité, adoption et coûts/risques, vérifiés par un échantillon relu par des humains."
  >
    <Opt why="Piège ! 85 % de courriels traités ne dit pas combien de réponses étaient justes. Vite et faux, c’est aussi « automatisé ».">
      C’est un succès : 85&nbsp;% d’automatisation, bien au-delà de la cible de 60&nbsp;%
    </Opt>
    <Opt ok why="Oui : on croise ce chiffre avec l’exactitude, la satisfaction client, les incidents et le coût par courriel.">
      Pas grand-chose encore : il faut le lire avec l’exactitude, le CSAT, les incidents et le coût
    </Opt>
    <Opt why="Piège ! L’escalade est un garde-fou. Un agent qui n’escalade jamais ne reconnaît plus ses limites.">
      Il faut viser 100&nbsp;% : chaque courriel escaladé est un échec de l’agent
    </Opt>
    <Opt why="Non : la plateforme compte les courriels traités, pas les bonnes réponses. Seule une relecture d’échantillons le vérifie.">
      Le chiffre est fiable, puisque la plateforme le calcule automatiquement
    </Opt>
  </QcmPage>
);

// @@PAGES-BEGIN
export const __pages = [M10b_Dashboard, M10b_Loop, M10b_Qcm11];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 4 min · DÉMO (≈ 15 h 40)

OBJECTIF — Montrer à quoi ressemble un tableau de bord d'agent en pilote, et apprendre à le lire : une moyenne rassurante peut cacher un problème grave.

DIRE — « Voici le tableau de bord du pilote de Boréal, sixième semaine. Une tuile par famille de KPI. Exactitude : 94,6 %, presque la cible. Automatisation : 63 %, cible dépassée. Satisfaction : 4,3 sur 5. Coût : 21 cents par courriel. Si je m'arrête là, la direction est contente. »

« Mais regardez le détail par type de courriel : les remboursements sont à 78 %, depuis le 3 octobre. »

ANIMATION / INTERACTION — Laisser les chiffres s'animer, puis demander : « Qu'est-ce qui vous inquiète ? » Attendre qu'un participant pointe la ligne des remboursements.
→ beat 1 : la ligne s'encadre. « 90 courriels sur 1 100 : presque invisibles dans la moyenne… mais ce sont ceux qui touchent l'argent des clients. Rappelez-vous Air Canada. »
→ beat 2 : « On ne débranche pas l'agent : un humain valide cette catégorie seulement, le temps de trouver la cause. C'est le plan de retour arrière du module 9. »

INSISTER — Des seuils d'alerte par catégorie, pas seulement des moyennes.

TRANSITION — « Trouver la cause, corriger, vérifier : c'est la boucle d'amélioration continue. »`,
  `⏱ 3 min

OBJECTIF — Faire comprendre qu'un agent en production s'entretient chaque semaine, selon une boucle courte et disciplinée.

DIRE — « Un agent n'est jamais fini : la politique de retour change, un produit arrive, les clients écrivent autrement. L'agent ne le sait pas tant qu'on ne le lui dit pas. Suivons l'alerte de la page précédente. »

ANIMATION —
→ beat 1 : Mesurer. « Le tableau de bord donne le symptôme : 78 % sur les remboursements. »
→ beat 2 : Analyser. « On lit les traces du monitoring : 14 erreurs sur 20 citent l'ancienne politique. La cause est dans les données, pas dans le modèle. »
→ beat 3 : Ajuster. « On met à jour la base documentaire. Pas besoin de changer de modèle. »
→ beat 4 : Re-tester. « Jeu de test doré plus les 20 cas ratés : 95&nbsp;%, aucune régression. On redéploie. »
→ beat 5 : la boucle se referme. Lire la règle d'or.

INSISTER — Un seul changement à la fois, sinon on ne sait pas ce qui a fonctionné. Le jeu de test grossit à chaque tour.

INTERACTION — « Chez vous, qui ferait cette revue hebdomadaire ? » Réponse attendue : un responsable métier nommé, avec l'équipe technique.

TRANSITION — « Vérifions que vous ne vous laisserez pas piéger par un chiffre flatteur. »`,
  `⏱ 3 min · QCM

OBJECTIF — Ancrer l'idée que le taux d'automatisation, seul, ne permet pas de juger un agent.

DIRE — « Deux mois de pilote, 85 % des courriels traités sans humain. La direction demande : ça marche ? Votez. »

INTERACTION — Vote à main levée, cliquer sur les réponses du groupe. → beat 1 : bonne réponse ; → beat 2 : explication.

RÉPONSES —
✗ A — Succès, la cible est dépassée. C'est LE piège du module : le chiffre le plus facile à obtenir et le plus flatteur. Il ne dit rien de la justesse des réponses.
✓ B — Il faut le croiser avec la qualité, l'adoption, les coûts et les risques.
✗ C — Viser 100 %. Piège inverse : l'escalade est un garde-fou. Zéro escalade signifie souvent que l'agent ne reconnaît plus ses limites.
✗ D — Fiable car automatique. La plateforme compte ce qui est traité, pas ce qui est juste. Seule la relecture d'un échantillon par des humains le vérifie.

PIÈGE — A séduit ceux qui doivent rendre des comptes vite ; C séduit ceux qui veulent maximiser le retour sur investissement.

DIRE APRÈS — « Rappelez-vous le tableau de bord : 63 % d'automatisation, tout allait bien… sauf les remboursements. Un chiffre, c'est une question ; quatre familles, c'est une réponse. »

TRANSITION — « Vous savez maintenant mesurer. Il reste à tout assembler : votre feuille de route sur 90 jours. »`,
];
// @@NOTES-END
