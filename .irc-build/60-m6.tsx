// ─── Module 6 · Analyser les interactions clients ──────────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Analyser les
        <br />
        interactions clients
      </>
    }
    sub="Des milliers d’échanges racontent ce qui ne va pas : l’IA les lit tous, fait ressortir les tendances, et vous aide à proposer des améliorations."
    dur="15:35 – 16:25 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 5 · conversations → analyse IA → tendances → recommandations
      </Tag>
    }
  >
    <SecItem n={1}>Synthèse d’appels et analyse des conversations</SecItem>
    <SecItem n={2}>Identifier les motifs de contact</SecItem>
    <SecItem n={3}>Analyser les réclamations et les problèmes récurrents</SecItem>
    <SecItem n={4}>Produire un reporting</SecItem>
    <SecItem n={5}>Identifier des pistes d’amélioration</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Synthèse d’appel ───────────────────────────────────────────────────────
const M6Tr = ({ who, children }: { who: 'C' | 'K'; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, fontSize: 20, lineHeight: 1.45 }}>
    <span style={{ width: 92, flex: 'none', fontFamily: mono, fontSize: 17, paddingTop: 2, color: who === 'C' ? C.coral : C.blue }}>{who === 'C' ? 'CLIENT' : 'CONSEIL.'}</span>
    <span style={{ color: C.soft }}>{children}</span>
  </div>
);

const M6_SyntheseAppel: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>La synthèse d’appel : 8 minutes, 6 lignes</Title>
    <Lede>La transcription est longue et répétitive. L’IA en tire la fiche à coller dans l’outil client. → génère la synthèse.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(100) }}>
      <Eyebrow c={C.muted} size={17}>
        Transcription · appel du 13/10 · 8 min 12 s (extrait)
      </Eyebrow>
      <M6Tr who="C">Oui bonjour, c’est pour ma commande de canapé, enfin, d’angle, le gris…</M6Tr>
      <M6Tr who="K">Je vous écoute, vous avez votre numéro de commande ?</M6Tr>
      <M6Tr who="C">Euh attendez… NM-52210. Il devait arriver hier, j’ai attendu toute la journée.</M6Tr>
      <M6Tr who="K">Je vois, le transporteur indique un échec de livraison, adresse incomplète.</M6Tr>
      <M6Tr who="C">Incomplète ? Il manque le bâtiment B, c’est vrai… mais personne ne m’a appelé !</M6Tr>
      <M6Tr who="K">Je comprends. Je corrige l’adresse et je vous propose jeudi ou samedi matin.</M6Tr>
      <M6Tr who="C">Samedi. Et je veux être appelé une heure avant cette fois.</M6Tr>
      <M6Tr who="K">C’est noté : samedi 8 h–12 h, appel une heure avant.</M6Tr>
      <div style={{ fontSize: 19, color: C.faint, fontStyle: 'italic' }}>[… 6 minutes de plus …]</div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={b.on(1)} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <IconTile name="note" tone="violet" size={42} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>Synthèse · NM-52210</span>
        </div>
        <M2Row label="Motif" value="Livraison · échec (adresse incomplète)" tone="blue" d={0} />
        <M2Row label="Cause" value="Bâtiment B absent de l’adresse" tone="yellow" d={0} />
        <M2Row label="Action" value="Adresse corrigée · relivraison samedi 8 h–12 h" tone="green" d={0} />
        <M2Row label="Engagement" value="Appel du livreur 1 h avant" tone="violet" d={0} />
        <M2Row label="Émotion" value="Agacé → apaisé en fin d’appel" tone="coral" d={0} />
        <M2Row label="Résolu ?" value="Oui, au 1er contact" tone="teal" d={0} />
      </div>
      <div className={b.on(2)}>
        <Callout title="Le vrai gain" tone="green" icon="clock" size={22}>
          Moins de saisie après l’appel, et des fiches toutes au même format : elles deviennent analysables en masse.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Le pipeline d’analyse ──────────────────────────────────────────────────
const M6Stage = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 360, flex: 'none', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[tone]}`, padding: '22px 24px 26px' }}>
    <IconTile name={icon} tone={tone} size={60} solid />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M6_Pipeline: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>De mille conversations à trois décisions</Title>
    <Lede>Le chemin de l’atelier 5, et de tout bon reporting. → déroule le pipeline.</Lede>
    <svg width={1680} height={60} style={{ position: 'absolute', left: 120, top: 300 }} aria-hidden>
      <path d="M 180 30 H 1500" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M 180 30 H 1500" dur={3.6} r={9} color={C.violet} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 380, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M6Stage n={1} icon="inbox" tone="blue" title="Conversations">
        Emails, chats, synthèses d’appels, avis : anonymisés, sur une période.
      </M6Stage>
      <M6Stage n={2} icon="sparkles" tone="violet" title="Analyse IA">
        Chaque échange classé : motif, émotion, résolu ou non, irritant.
      </M6Stage>
      <M6Stage n={3} icon="trend" tone="teal" title="Tendances">
        Ce qui revient, ce qui monte, ce qui fâche le plus.
      </M6Stage>
      <M6Stage n={4} icon="target" tone="green" title="Recommandations">
        Des actions concrètes, avec un responsable et un indicateur.
      </M6Stage>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(600) }}>
      <Callout title="Répartition des rôles" tone="yellow" icon="table" size={23}>
        L’IA <strong>lit et classe</strong> ; le tableur <strong>compte</strong> ; l’humain <strong>interprète et décide</strong>. Ne demandez pas à
        l’IA de faire des additions sur 1 000 lignes.
      </Callout>
    </div>
  </Frame>
);

// ─── Motifs de contact ──────────────────────────────────────────────────────
const M6Bar = ({ n, label, pct, w, tone }: { n: number; label: string; pct: string; w: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <span style={{ width: 380, flex: 'none', fontSize: 24, fontWeight: 600, color: C.ink, textAlign: 'right' }}>{label}</span>
    <div style={{ flex: 1, height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div className={b.grow(n)} style={{ width: w, height: 52, background: STRONG[tone], borderRadius: 10, ...dl(0) }} />
      <span className={b.fade(n)} style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: tone === 'grey' ? C.muted : STRONG[tone], ...dl(400) }}>
        {pct}
      </span>
    </div>
  </div>
);

const M6_Motifs: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Les motifs de contact : pourquoi on nous sollicite</Title>
    <Lede>Semaine 41 · 2 812 contacts de Nova Maison classés par l’IA (données fictives). → affiche la répartition.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', flexDirection: 'column', gap: 20, ...dl(100) }}>
      <M6Bar n={1} label="Suivi de livraison" pct="38 %" w={760} tone="blue" />
      <M6Bar n={1} label="Retour / remboursement" pct="21 %" w={420} tone="grey" />
      <M6Bar n={1} label="Panne / SAV" pct="17 %" w={340} tone="grey" />
      <M6Bar n={1} label="Modification de commande" pct="11 %" w={220} tone="grey" />
      <M6Bar n={1} label="Facturation" pct="8 %" w={160} tone="grey" />
      <M6Bar n={1} label="Autre" pct="5 %" w={100} tone="grey" />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 520, top: 790, width: 1280, ...dl(900) }}>
      <Callout title="La question à se poser" tone="blue" icon="search" size={24}>
        Parmi ces contacts, lesquels auraient pu être <strong>évités</strong> par une meilleure information envoyée au bon moment ?
      </Callout>
    </div>
  </Frame>
);

// ─── Grand chiffre ──────────────────────────────────────────────────────────
const M6_BigNumber: Page = () => (
  <Frame mod={6}>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 150, fontFamily: display, fontWeight: 800, fontSize: 400, lineHeight: 1, letterSpacing: '-0.04em', color: C.electric, ...dl(100) }}>
      <CountUp to={38} suffix=" %" dur={1400} delay={200} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 600, width: 1300, ...dl(700) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 58, lineHeight: 1.15, color: C.navy }}>
        des contacts posent la même question :<br />
        <span style={{ color: C.violet, whiteSpace: 'nowrap' }}>« Où est mon colis ? »</span>
      </div>
      <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.45, color: C.soft }}>
        Plus d’un contact sur trois. Un SMS de suivi envoyé automatiquement à chaque étape pourrait en éviter une grande partie.
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 130, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1200) }}>
      <Icon name="table" size={22} color={C.muted} /> Nova Maison, semaine 41 · données fictives de formation
    </div>
    <Outline x={1500} y={160} w={300} h={300} r={60} color={C.violet} cls={A.fade} />
    <Outline x={1580} y={240} w={300} h={300} r={60} cls={A.fade} />
  </Frame>
);

// ─── Analyse des réclamations : irritants ───────────────────────────────────
const M6Irr = ({ n, rank, title, count, verb, tone }: { n: number; rank: number; title: string; count: number; verb: string; tone: Tone }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 7px 0 0 ${STRONG[tone]}`, padding: '18px 26px 18px 30px' }}>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: STRONG[tone], width: 60 }}>{rank}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 22, fontStyle: 'italic', color: C.soft }}>« {verb} »</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.ink }}>{count}</div>
      <div style={{ fontSize: 18, color: C.muted }}>réclamations</div>
    </div>
  </div>
);

const M6_Irritants: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Analyser les réclamations : le top 3 des irritants</Title>
    <Lede>312 réclamations du mois, chacune résumée en un irritant par l’IA, puis regroupées. → du 3e au 1er.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column-reverse', gap: 16 }}>
      <M6Irr n={3} rank={1} title="Personne ne me rappelle" count={96} verb="On m’a promis un rappel, j’attends toujours depuis jeudi." tone="coral" />
      <M6Irr n={2} rank={2} title="Créneau de livraison non respecté" count={71} verb="J’ai posé ma journée et le livreur est passé à 19 h." tone="yellow" />
      <M6Irr n={1} rank={3} title="Remboursement jugé trop lent" count={58} verb="Trois semaines pour un remboursement, c’est abusé." tone="blue" />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Lecture" tone="violet" icon="bulb" size={24}>
        L’irritant n° 1 n’est pas un produit : c’est une <strong>promesse non tenue</strong> par le service client lui-même. Bonne nouvelle : c’est
        celui qu’on maîtrise le mieux.
      </Callout>
    </div>
  </Frame>
);

// ─── Problème récurrent : la courbe qui décroche ────────────────────────────
const M6_Recurrent: Page = () => {
  const xs = [90, 260, 430, 600, 770, 940, 1110];
  const vs = [4, 5, 3, 6, 5, 18, 27];
  const y = (v: number) => 420 - v * 13;
  const d = xs.map((x, i) => `${i ? 'L' : 'M'} ${x} ${y(vs[i])}`).join(' ');
  return (
    <Frame mod={6} beats={2}>
      <Title>Détecter un problème récurrent avant qu’il n’explose</Title>
      <Lede>Contacts mentionnant « fuite » + « lave-linge Aquaflow 8 », par semaine. → trace la courbe, puis l’alerte.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1200, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, ...dl(100) }}>
        <svg width={1200} height={540} viewBox="0 0 1200 540" style={{ display: 'block', marginTop: 10 }}>
          <line x1={60} x2={1150} y1={420} y2={420} stroke={C.rule} strokeWidth={2} />
          <line x1={60} x2={1150} y1={290} y2={290} stroke={C.rule} strokeWidth={1.5} strokeDasharray="6 8" />
          <text x={1150} y={280} textAnchor="end" fontSize={18} fill={C.muted} fontFamily="Open Sans, sans-serif">
            seuil d’alerte : 10 / semaine
          </text>
          {xs.map((x, i) => (
            <text key={x} x={x} y={460} textAnchor="middle" fontSize={20} fill={C.muted} fontFamily="Open Sans, sans-serif">
              S{35 + i}
            </text>
          ))}
          <path d={d} fill="none" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} className={b.draw(1)} />
          {xs.map((x, i) => (
            <circle key={x} cx={x} cy={y(vs[i])} r={i >= 5 ? 10 : 7} fill={i >= 5 ? C.coral : C.blue} className={b.fade(1)} style={dl(600 + i * 60)} />
          ))}
          <text x={1110} y={y(27) - 22} textAnchor="end" fontSize={26} fontWeight={700} fill={C.coral} fontFamily="Montserrat, sans-serif" className={b.fade(1)} style={dl(1000)}>
            27 contacts
          </text>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 1370, top: 262, width: 430, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className={b.on(2)} style={{ background: T.coral.bg, borderRadius: 18, boxShadow: `inset 0 0 0 2.5px ${C.coral}`, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="bell" size={28} color={C.coral} />
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T.coral.fg }}>Alerte · S41</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.45, color: C.ink }}>
            Hausse ×5 en 2 semaines. Point commun relevé par l’IA dans les verbatims : <strong>joint de hublot</strong>, lot livré fin septembre.
          </div>
        </div>
        <Card tone="green" icon="send" title="Action" cls={b.on(2)} size={21}>
          Alerte qualité au fournisseur ; fiche KB « fuite Aquaflow » pour les conseillers ; contact proactif des acheteurs du lot.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Reporting ──────────────────────────────────────────────────────────────
const M6Kpi = ({ label, value, delta, good, d }: { label: string; value: ReactNode; delta: string; good: boolean; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <Eyebrow c={C.muted} size={16}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: C.navy }}>{value}</div>
    <div style={{ marginTop: 4, fontSize: 20, fontWeight: 700, color: good ? C.green : C.coral }}>{delta}</div>
  </div>
);

const M6_Reporting: Page = () => (
  <Frame mod={6} kind="demo">
    <Title>Produire un reporting : les chiffres, puis le récit</Title>
    <Lede>Le tableur calcule les indicateurs ; l’IA rédige la synthèse hebdomadaire pour l’équipe et la direction.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 20 }}>
      <M6Kpi label="Contacts" value={<CountUp to={2812} />} delta="▲ 6 % vs S40" good={false} d={100} />
      <M6Kpi label="1re réponse" value={<CountUp to={19} suffix=" h" />} delta="▼ 3 h vs S40" good d={200} />
      <M6Kpi label="Résolu au 1er contact" value={<CountUp to={71} suffix=" %" />} delta="▲ 4 pts" good d={300} />
      <M6Kpi label="Satisfaction" value={<CountUp to={3.9} digits={1} suffix=" / 5" />} delta="▼ 0,1 pt" good={false} d={400} />
    </div>
    <CodeDark size={19} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 470, width: 760, height: 470, ...dl(500) }}>
      <Ck>Prompt · </Ck>À partir de ces indicateurs et du top des motifs et irritants, rédige la synthèse hebdomadaire du service client :{'\n'}- 3
      faits marquants, chiffrés{'\n'}- 1 signal faible à surveiller{'\n'}- 3 recommandations, chacune avec un responsable proposé{'\n\n'}Ton factuel,
      10 lignes maximum. N’invente aucun chiffre : utilise uniquement ceux fournis.{'\n\n'}
      <Cc>[indicateurs S41] [top motifs] [top irritants]</Cc>
    </CodeDark>
    <div className={A.right} style={{ position: 'absolute', left: 930, top: 470, width: 870, height: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px', fontSize: 21, lineHeight: 1.5, color: C.ink, ...dl(650) }}>
      <Eyebrow c={C.violet} size={17} style={{ marginBottom: 6 }}>
        Synthèse S41 · générée, puis relue
      </Eyebrow>
      <strong>Faits marquants.</strong> Volume en hausse (+6 %), porté par le suivi de livraison (38 %). Délai de 1re réponse amélioré (19 h). Résolution au
      1er contact à 71 % (+4 pts).
      <br />
      <strong>Signal faible.</strong> Fuites sur lave-linge Aquaflow 8 : 27 contacts en S41 (×5).
      <br />
      <strong>Recommandations.</strong> 1. SMS de suivi automatique (resp. logistique). 2. Rappels promis tracés dans l’outil (resp. superviseurs).
      3. Alerte qualité Aquaflow (resp. achats).
    </div>
  </Frame>
);

// ─── Pistes d’amélioration ──────────────────────────────────────────────────
const M6Row = ({ n, irr, cause, action, owner, kpi }: { n: number; irr: string; cause: string; action: string; owner: string; kpi: string }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <M2Cell w={300} tone="coral">
      {irr}
    </M2Cell>
    <M2Cell w={300}>{cause}</M2Cell>
    <M2Cell w={420}>{action}</M2Cell>
    <M2Cell w={220}>{owner}</M2Cell>
    <M2Cell w={300} tone="green">
      {kpi}
    </M2Cell>
  </div>
);

const M6_Pistes: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Des irritants aux pistes d’amélioration</Title>
    <Lede>« Pour chaque irritant : cause probable, action, responsable, indicateur. » → une ligne par irritant.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 18, padding: '0 22px' }}>
        <M2Head w={300}>Irritant</M2Head>
        <M2Head w={300}>Cause probable</M2Head>
        <M2Head w={420}>Action proposée</M2Head>
        <M2Head w={220}>Responsable</M2Head>
        <M2Head w={300}>Indicateur</M2Head>
      </div>
      <M6Row n={1} irr="Personne ne me rappelle" cause="Rappels notés sur papier, non suivis" action="Tâche de rappel datée dans l’outil, alerte à J+1" owner="Superviseurs" kpi="% de rappels tenus à J+1" />
      <M6Row n={2} irr="Créneau non respecté" cause="Créneaux de 4 h, pas d’appel préalable" action="Appel ou SMS du livreur 1 h avant" owner="Logistique" kpi="Réclamations « créneau » / sem." />
      <M6Row n={3} irr="Remboursement trop lent" cause="Contrôle des retours en file unique" action="Contrôle prioritaire des retours < 200 €" owner="Entrepôt" kpi="Délai moyen de remboursement" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="L’IA propose, l’équipe décide" tone="blue" icon="users" size={24}>
        Les causes sont des <strong>hypothèses</strong> : on les vérifie avec les équipes concernées avant de lancer l’action. Et on mesure, pour savoir
        si ça a marché.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 5 : kit + consignes ────────────────────────────────────────────
const M6V = ({ ch, children, d }: { ch: IconName; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px', fontSize: 19, lineHeight: 1.4, color: C.ink, ...dl(d) }}>
    <Icon name={ch} size={22} color={C.muted} style={{ marginTop: 2 }} />
    <span>{children}</span>
  </div>
);

const M6_Kit: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Atelier 5 · un extrait des 40 conversations du kit</Title>
    <Lede>Conversations anonymisées de la semaine 42. Le kit complet est dans vos documents.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
      <M6V ch="mail" d={100}>« Livraison prévue mardi, toujours rien jeudi. Aucun SMS. »</M6V>
      <M6V ch="chat" d={140}>« Le lave-linge fuit par le hublot, il a 3 semaines. »</M6V>
      <M6V ch="phone" d={180}>« On devait me rappeler lundi pour le remboursement… »</M6V>
      <M6V ch="megaphone" d={220}>« Livreur adorable, il a même repris les cartons 👍 »</M6V>
      <M6V ch="mail" d={260}>« Facture introuvable dans mon espace client. »</M6V>
      <M6V ch="chat" d={300}>« Encore une fuite sur mon Aquaflow, c’est un défaut de série ? »</M6V>
      <M6V ch="phone" d={340}>« 3e appel, toujours pas de rappel du SAV. »</M6V>
      <M6V ch="mail" d={380}>« Où en est mon colis ? Le lien de suivi ne marche pas. »</M6V>
      <M6V ch="form" d={420}>« Je souhaite annuler, la date est trop lointaine. »</M6V>
      <M6V ch="chat" d={460}>« Merci Inès, problème réglé en 5 minutes ! »</M6V>
      <M6V ch="mail" d={500}>« Remboursement reçu après 22 jours. Trop long. »</M6V>
      <M6V ch="phone" d={540}>« Le technicien n’avait pas la pièce, il faut revenir. »</M6V>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(800) }}>
      <Callout title="Pensez aussi au positif" tone="green" icon="thumbUp" size={23}>
        Les remerciements disent ce qui marche : à garder, à généraliser, à valoriser auprès de l’équipe.
      </Callout>
    </div>
  </Frame>
);

const M6_Atelier: Page = () => (
  <LabPage
    mod={6}
    n="5"
    title="Des conversations aux recommandations"
    defi="interactions"
    who="En binôme · 15 min"
    minutes={15}
    objective={
      <>
        Analyser les 40 conversations du kit avec l’IA et produire une <strong>synthèse d’une page</strong> : motifs, irritants, signal faible,
        trois recommandations.
      </>
    }
    where={
      <>
        Le tableau de classement (40 lignes)
        <br />
        Top 3 motifs + top 3 irritants
        <br />
        3 recommandations argumentées
      </>
    }
    crit={
      <>
        <CheckItem id="a5-1" size={21}>
          Catégories fermées, appliquées partout
        </CheckItem>
        <CheckItem id="a5-2" size={21}>
          Comptages vérifiés (tableur ou à la main)
        </CheckItem>
        <CheckItem id="a5-3" size={21}>
          Le signal faible Aquaflow repéré
        </CheckItem>
        <CheckItem id="a5-4" size={21}>
          Chaque reco : action, responsable, indicateur
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Faites classer chaque conversation dans un tableau : motif, émotion, résolu, irritant. <strong>2.</strong> Collez le tableau
    dans un tableur et comptez. <strong>3.</strong> Demandez à l’IA les tendances et un signal faible. <strong>4.</strong> Faites-lui proposer les
    recommandations, puis challengez-les : sont-elles réalistes chez vous ?
    <Bonus>Demandez la synthèse en deux versions : une pour l’équipe (concrète), une pour la direction (5 lignes).</Bonus>
  </LabPage>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz : analyser les interactions</Title>
    <QuizSeries y={220}>
      <QuizQ q="Pour connaître le nombre exact de contacts par motif sur 1 000 conversations, on…" explain="L’IA classe très bien chaque conversation ; pour compter, un tableur est exact à coup sûr. Les additions de l’IA sur de gros volumes peuvent être fausses.">
        <QOpt>Demande le total directement à l’IA</QOpt>
        <QOpt ok>Fait classer par l’IA, puis compte avec un tableur</QOpt>
        <QOpt>Estime à l’œil</QOpt>
      </QuizQ>
      <QuizQ q="Avant d’envoyer 500 conversations à l’IA, il faut…" explain="Noms, emails, téléphones, adresses, numéros de commande : on anonymise, et on n’utilise que l’outil autorisé par l’entreprise.">
        <QOpt>Les traduire en anglais</QOpt>
        <QOpt>Les raccourcir à une phrase</QOpt>
        <QOpt ok>Les anonymiser et utiliser un outil autorisé</QOpt>
      </QuizQ>
      <QuizQ q="L’IA propose une cause à un irritant. C’est…" explain="Une hypothèse plausible, pas un constat. On la vérifie avec les équipes concernées avant d’agir, puis on mesure l’effet de l’action.">
        <QOpt>Un fait établi</QOpt>
        <QOpt ok>Une hypothèse à vérifier avec les équipes</QOpt>
        <QOpt>Inutile : seules les données comptent</QOpt>
      </QuizQ>
      <QuizQ q="Une bonne recommandation contient…" explain="Une action précise, un responsable et un indicateur : sans eux, la recommandation reste un vœu pieux.">
        <QOpt>Un constat bien formulé</QOpt>
        <QOpt ok>Une action, un responsable et un indicateur</QOpt>
        <QOpt>Un graphique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Synthese: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Module 6 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="violet">
        Synthèses d’appel au <strong>même format</strong> : moins de saisie, et des données analysables en masse.
      </SynthRow>
      <SynthRow n={2} tone="blue">
        Conversations → <strong>analyse IA → tendances → recommandations</strong> ; l’IA classe, le tableur compte.
      </SynthRow>
      <SynthRow n={3} tone="teal">
        Les motifs révèlent les <strong>contacts évitables</strong> ; les irritants, les promesses non tenues.
      </SynthRow>
      <SynthRow n={4} tone="coral">
        Surveiller les <strong>signaux faibles</strong> : une courbe qui décroche vaut une alerte.
      </SynthRow>
      <SynthRow n={5} tone="green">
        Chaque recommandation : <strong>action, responsable, indicateur</strong>, et une cause vérifiée par l’équipe.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : le prompt de synthèse d’appel et le prompt de reporting hebdomadaire.
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_SyntheseAppel, M6_Pipeline, M6_Motifs, M6_BigNumber, M6_Irritants, M6_Recurrent, M6_Reporting, M6_Pistes, M6_Kit, M6_Atelier, M6_Quiz, M6_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 6 · OUVERTURE DE SECTION · 15:35

OBJECTIF — Changer d’échelle : du message individuel à l’ensemble des échanges.

DIRE — « Jusqu’ici, on a traité les clients un par un. Maintenant, on prend de la hauteur : que nous disent des milliers d’échanges ? Synthèse d’appels, motifs de contact, réclamations, problèmes récurrents, reporting, et surtout des pistes d’amélioration. »

TRANSITION — « Ça commence par chaque appel. »`,
  `⏱ 3 min · SYNTHÈSE D’APPEL (→ ×2)

OBJECTIF — Montrer la synthèse automatique d’un appel et son intérêt collectif.

DIRE — « Une transcription d’appel : longue, répétitive, mais tout y est. » → « L’IA en tire six lignes : motif, cause, action, engagement, émotion, résolu ou non. Vous la relisez et la collez dans l’outil client. » → « Le vrai gain : toutes les fiches ont le même format. On peut les analyser par centaines. »

INSISTER — Beaucoup d’outils de téléphonie proposent désormais la transcription et la synthèse automatiques ; le conseiller relit toujours l’engagement pris.

TRANSITION — « Comment passe-t-on de centaines de fiches à des décisions ? »`,
  `⏱ 3 min · LE PIPELINE (→ ×4)

OBJECTIF — Poser la méthode de l’atelier 5.

DIRE — → « Les conversations, anonymisées. » → « L’analyse IA : chaque échange classé. » → « Les tendances : ce qui revient, ce qui monte. » → « Les recommandations : des actions. » « Et la répartition des rôles : l’IA lit et classe, le tableur compte, l’humain interprète et décide. »

INSISTER — Les modèles de langage peuvent se tromper dans les additions sur de gros volumes : on compte avec un tableur.

TRANSITION — « Premier résultat : les motifs de contact. »`,
  `⏱ 3 min · MOTIFS DE CONTACT (→ barres)

OBJECTIF — Lire une répartition des motifs et repérer les contacts évitables.

DIRE — « 2 812 contacts en une semaine, classés par l’IA dans une liste fermée. » → « Le suivi de livraison écrase tout. » « La question à se poser n’est pas « comment répondre plus vite ? » mais « comment éviter que le client ait besoin d’appeler ? ». »

ANIMATION — Demander : « Chez vous, quel est le motif n° 1 ? »

TRANSITION — « Ce chiffre mérite une page à lui seul. »`,
  `⏱ 1 min · GRAND CHIFFRE : 38 %

OBJECTIF — Marquer les esprits avec un chiffre clé (données fictives du cas).

DIRE — « 38 %. Plus d’un contact sur trois pose la même question : « Où est mon colis ? ». Un SMS de suivi automatique à chaque étape pourrait en éviter une bonne partie. C’est le genre d’enseignement qu’on ne voit pas en traitant les messages un par un. »

INSISTER — Données fictives de formation ; l’ordre de grandeur est fréquent dans le e-commerce, mais mesurez le vôtre.

TRANSITION — « Et les réclamations ? »`,
  `⏱ 3 min · TOP 3 DES IRRITANTS (→ ×4)

OBJECTIF — Montrer l’analyse des réclamations par irritant, avec verbatims.

DIRE — Dérouler du 3e au 1er. « Remboursement trop lent. Créneau non respecté. Et le premier : personne ne me rappelle. » → « L’irritant n° 1 n’est pas un produit : c’est une promesse non tenue par le service client lui-même. Bonne nouvelle : c’est celui sur lequel on a le plus de prise. »

ANIMATION — Les verbatims rendent les chiffres concrets : en lire un à voix haute.

TRANSITION — « L’IA peut aussi détecter un problème qui commence. »`,
  `⏱ 3 min · PROBLÈME RÉCURRENT (→ courbe, → alerte)

OBJECTIF — Illustrer la détection d’un signal faible.

DIRE — → « Les contacts mentionnant une fuite sur l’Aquaflow 8 : stables pendant cinq semaines, puis ça décroche. » → « L’alerte : ×5 en deux semaines, et l’IA a relevé dans les verbatims un point commun, le joint de hublot. Actions : alerte qualité, fiche pour les conseillers, et contact proactif des acheteurs. »

INSISTER — Plus on détecte tôt, moins il y a de réclamations, et de clients perdus.

TRANSITION — « Tout ça se retrouve dans le reporting. »`,
  `⏱ 4 min · REPORTING (démo)

OBJECTIF — Montrer la répartition indicateurs (tableur) / récit (IA).

DIRE — « En haut, les indicateurs calculés : volume, délai de première réponse, résolution au premier contact, satisfaction. En bas, le prompt : trois faits, un signal faible, trois recommandations, et surtout « n’invente aucun chiffre ». Et la synthèse, relue avant envoi. »

ANIMATION — Les chiffres s’animent. Demander qui produit un reporting chez eux, et combien de temps ça prend.

TRANSITION — « Les recommandations, justement. »`,
  `⏱ 3 min · PISTES D’AMÉLIORATION (→ ×3)

OBJECTIF — Transformer un irritant en action mesurable.

DIRE — Dérouler les trois lignes : irritant, cause probable, action, responsable, indicateur. « La cause est une hypothèse : on la vérifie avec les équipes. Et sans indicateur, on ne saura jamais si l’action a marché. »

TRANSITION — « À vous : atelier 5. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 5

OBJECTIF — Présenter les conversations à analyser.

DIRE — « Quarante conversations anonymisées de la semaine 42 ; en voici douze. Vous reconnaissez des thèmes ? Il y a aussi des messages positifs : ils disent ce qui marche. »

TRANSITION — « Les consignes. »`,
  `⏱ 15 min · ATELIER 5 (minuteur 15 min)

OBJECTIF — Réaliser le pipeline complet : conversations → analyse IA → tendances → recommandations.

DIRE — « En binôme. Classement en tableau, comptage au tableur, tendances et signal faible, puis trois recommandations que vous challengez. »

ANIMATION — Vérifier : liste fermée de catégories, comptages faits hors IA, signal Aquaflow repéré (3 mentions sur 40 dans le kit), recommandations avec responsable et indicateur.

TRANSITION — « Quiz. »`,
  `⏱ 3 min · QUIZ MODULE 6 (4 questions)

OBJECTIF — Vérifier : comptage, anonymisation, hypothèse, recommandation.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « Synthèse. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 6

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Dernier module : on assemble tout sur le cas fil rouge, et on fait le point sur les bonnes pratiques. »

TRANSITION — « Module 7. »`,
];
// @@NOTES-END
