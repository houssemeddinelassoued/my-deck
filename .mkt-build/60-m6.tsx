// ─── Module 6 · Analyse marketing avec l’IA ─────────────────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Analyse marketing
        <br />
        avec l’IA
      </>
    }
    sub="Des données aux décisions : résultats de campagne, avis clients, commentaires, tendances, synthèse et recommandations."
    dur="15:25 – 16:05 · exercice inclus"
  >
    <SecItem n={1}>Analyse de données marketing</SecItem>
    <SecItem n={2}>Analyse de retours clients et de commentaires</SecItem>
    <SecItem n={3}>Identification des tendances</SecItem>
    <SecItem n={4}>Synthèse de résultats</SecItem>
    <SecItem n={5}>Suggestions d’amélioration… et les pièges de l’analyse</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Analyse de données de campagne ─────────────────────────────────────────
const M6Cell = ({ children, strong = false, c }: { children: ReactNode; strong?: boolean; c?: string }) => (
  <span style={{ fontFamily: mono, fontSize: 19, textAlign: 'right', fontWeight: strong ? 700 : 400, color: c ?? C.ink }}>{children}</span>
);
const M6Line = ({ ch, imp, clk, ctr, dem, cost, head = false }: { ch: string; imp: string; clk: string; ctr: string; dem: string; cost: string; head?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr 1fr 1fr', gap: 10, padding: '9px 16px', background: head ? C.navy : C.card, borderBottom: `1px solid ${C.rule}` }}>
    {head ? (
      <>
        <Eyebrow c="#fff" size={15}>{ch}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{imp}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{clk}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{ctr}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{dem}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{cost}</Eyebrow>
      </>
    ) : (
      <>
        <span style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{ch}</span>
        <M6Cell>{imp}</M6Cell>
        <M6Cell>{clk}</M6Cell>
        <M6Cell>{ctr}</M6Cell>
        <M6Cell strong c={C.blue}>
          {dem}
        </M6Cell>
        <M6Cell>{cost}</M6Cell>
      </>
    )}
  </div>
);
const M6Insight = ({ beat, n, tone, children }: { beat: number; n: number; tone: Tone; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone={tone} size={36} />
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M6_Donnees: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Analyser des données : le bilan de novembre chez Ardente</Title>
    <Lede>Un export de vos outils, collé ou joint, et une question précise. L’IA lit le tableau ; le tableur calcule.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 980, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW, ...dl(100) }}>
      <M6Line head ch="Canal" imp="Vues" clk="Clics" ctr="Taux clic" dem="Demandes" cost="Coût" />
      <M6Line ch="LinkedIn organique" imp="18 400" clk="520" ctr="2,8 %" dem="31" cost="0 €" />
      <M6Line ch="LinkedIn sponsorisé" imp="42 000" clk="610" ctr="1,5 %" dem="22" cost="900 €" />
      <M6Line ch="Instagram" imp="25 300" clk="380" ctr="1,5 %" dem="9" cost="0 €" />
      <M6Line ch="Newsletter" imp="11 800" clk="1 060" ctr="9,0 %" dem="58" cost="0 €" />
      <M6Line ch="Email direct" imp="240" clk="41" ctr="17,1 %" dem="19" cost="0 €" />
      <M6Line ch="Article (SEO)" imp="3 900" clk="210" ctr="5,4 %" dem="7" cost="0 €" />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: T.blue.bg, fontSize: 20, fontWeight: 700, color: C.navy }}>
        <span>Total demandes de dégustation</span>
        <span style={{ fontFamily: mono }}>146 / objectif 150</span>
      </div>
    </div>
    <PromptBox title="prompt · analyse" size={18} cls={A.in} style={{ position: 'absolute', left: 120, top: 740, width: 980, ...dl(300) }}>
      Analyse ce tableau de résultats. Identifie 3 enseignements et 3 actions pour décembre. <Cn>Montre le calcul de chaque chiffre que tu cites</Cn>, et signale ce que les données ne permettent pas de conclure.
    </PromptBox>
    <div style={{ position: 'absolute', left: 1160, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.violet} size={19} cls={A.fade} style={dl(200)}>
        Ce que l’IA en tire
      </Eyebrow>
      <M6Insight beat={1} n={1} tone="green">
        La <strong>newsletter</strong> apporte 58 demandes sur 146, soit 40 % : le canal le plus rentable.
      </M6Insight>
      <M6Insight beat={2} n={2} tone="blue">
        L’<strong>email direct</strong> convertit fort (19 demandes pour 240 envois) : à étendre aux ETI.
      </M6Insight>
      <M6Insight beat={3} n={3} tone="coral">
        Le <strong>sponsorisé</strong> coûte 41 € par demande (900 / 22) : à cibler ou à couper.
      </M6Insight>
      <M6Insight beat={4} n={4} tone="yellow">
        <strong>Limite :</strong> on ne sait pas combien de dégustations deviennent des contrats. Il manque cette colonne.
      </M6Insight>
    </div>
  </Frame>
);

// ─── Le même tableau, en graphique ──────────────────────────────────────────
const M6Bar = ({ label, v, max, tone, beat, d }: { label: string; v: number; max: number; tone: Tone; beat: number; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 64 }}>
    <span style={{ width: 250, fontSize: 24, color: C.ink, textAlign: 'right' }}>{label}</span>
    <div style={{ flex: 1, height: 44 }}>
      <div className={b.grow(beat)} style={{ width: `${(v / max) * 100}%`, height: '100%', borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    </div>
    <span className={b.fade(beat)} style={{ width: 70, fontFamily: display, fontWeight: 800, fontSize: 30, color: STRONG[tone], ...dl(d + 300) }}>
      {v}
    </span>
  </div>
);

const M6_Graph: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Le bon graphique : l’IA conseille, le tableur trace</Title>
    <Lede>« Quel graphique montre le mieux la contribution de chaque canal ? » Réponse : des barres horizontales triées.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1100, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 34px', ...dl(100) }}>
      <Eyebrow c={C.navy} size={20}>
        Demandes de dégustation par canal · novembre
      </Eyebrow>
      <div style={{ marginTop: 16 }}>
        <M6Bar label="Newsletter" v={58} max={58} tone="green" beat={1} d={0} />
        <M6Bar label="LinkedIn organique" v={31} max={58} tone="blue" beat={1} d={100} />
        <M6Bar label="LinkedIn sponsorisé" v={22} max={58} tone="coral" beat={1} d={200} />
        <M6Bar label="Email direct" v={19} max={58} tone="blue" beat={1} d={300} />
        <M6Bar label="Instagram" v={9} max={58} tone="grey" beat={1} d={400} />
        <M6Bar label="Article (SEO)" v={7} max={58} tone="grey" beat={1} d={500} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="green" icon="table" title="Le tableur calcule" cls={A.right} style={dl(250)} size={22}>
        Totaux, taux, coûts : Excel ou Sheets. L’IA peut écrire la formule.
      </Card>
      <Card tone="blue" icon="chart" title="L’IA conseille" cls={A.right} style={dl(400)} size={22}>
        Type de graphique, titre qui affirme, couleur pour l’essentiel seulement.
      </Card>
      <Callout title="Titre-message" tone="violet" icon="type" cls={b.on(2)} size={22}>
        « La newsletter apporte 40 % des demandes » plutôt que « Demandes par canal ».
      </Callout>
    </div>
  </Frame>
);

// ─── Analyse de retours clients ─────────────────────────────────────────────
const M6Theme = ({ beat, name, n, pos, quote }: { beat: number; name: string; n: number; pos: number; quote: string }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '260px 1fr 520px', gap: 20, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 19, color: C.muted }}>{n} mentions</div>
    </div>
    <div style={{ display: 'flex', height: 30, borderRadius: 8, overflow: 'hidden', width: `${(n / 86) * 100}%`, minWidth: 120 }}>
      <div style={{ width: `${pos}%`, background: C.green }} />
      <div style={{ flex: 1, background: C.coral }} />
    </div>
    <div style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.35, color: C.soft }}>« {quote} »</div>
  </div>
);

const M6_Avis: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>Analyser des retours clients : 200 avis en 2 minutes</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 186, display: 'flex', alignItems: 'center', gap: 22, fontSize: 21, color: C.soft }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 14, borderRadius: 4, background: C.green }} /> positif
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 14, borderRadius: 4, background: C.coral }} /> négatif
      </span>
      <span>· avis e-shop et Google, anonymisés · un avis peut citer plusieurs thèmes</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 236, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M6Theme beat={1} name="Goût & qualité" n={86} pos={92} quote="Enfin un café qui a du goût, on sent le travail de torréfaction." />
      <M6Theme beat={2} name="Livraison" n={54} pos={39} quote="Café excellent mais 9 jours pour le recevoir, c’est long." />
      <M6Theme beat={3} name="Prix" n={41} pos={46} quote="Un peu cher pour un usage quotidien, mais ça se justifie." />
      <M6Theme beat={4} name="Emballage" n={33} pos={70} quote="Le sachet refermable est top, dommage qu’il ne soit pas recyclable." />
      <M6Theme beat={5} name="Service client" n={27} pos={85} quote="Réponse rapide et très humaine quand ma commande s’est perdue." />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 770, width: 1680, display: 'flex', gap: 24 }}>
      <PromptBox title="prompt · avis clients" size={18} cls={A.fade} style={{ flex: 1.3, ...dl(400) }}>
        Voici 200 avis anonymisés. Regroupe-les en 5 à 7 thèmes. Pour chacun : nombre de mentions, part positive / négative, une citation exacte représentative. <Cn>Ne reformule pas les citations.</Cn>
      </PromptBox>
      <Callout title="Enseignement" tone="coral" icon="truck" cls={b.on(5)} style={{ flex: 1 }} size={22}>
        L’irritant n° 1 n’est pas le produit mais la <strong>livraison</strong> : à traiter avant le lancement B2B.
      </Callout>
    </div>
  </Frame>
);

// ─── Analyse de commentaires (modération assistée) ──────────────────────────
const M6_COMMENTS = [
  { who: 'Julie M.', txt: 'On l’a testé au bureau la semaine dernière, toute l’équipe est fan !', cat: 'Positif', tone: 'green' as Tone, rep: 'Merci Julie ! Transmettez nos amitiés à l’équipe ☕ Quel café a eu le plus de succès ?' },
  { who: 'Karim B.', txt: 'C’est combien pour une boîte de 30 personnes ?', cat: 'Question · opportunité', tone: 'blue' as Tone, rep: 'Bonjour Karim, tout dépend de votre consommation : on vous envoie un devis en message privé ?' },
  { who: 'Sophie L.', txt: 'Toujours pas reçu ma commande passée il y a 12 jours…', cat: 'Négatif · urgent', tone: 'coral' as Tone, rep: 'Bonjour Sophie, désolés pour ce retard. On regarde tout de suite : pouvez-vous nous envoyer votre numéro de commande en privé ?' },
  { who: 'Marc T.', txt: 'Encore une boîte qui fait du greenwashing avec ses « producteurs ».', cat: 'Critique · sensible', tone: 'yellow' as Tone, rep: 'Bonjour Marc, question légitime. Nous publions le prix payé à chaque producteur ici : [lien]. Nous répondons volontiers à vos questions.' },
  { who: 'Compte inconnu', txt: '🔥 Gagnez 5000 €/mois depuis chez vous, cliquez ici 🔥', cat: 'Spam', tone: 'grey' as Tone, rep: 'Pas de réponse : masquer ou supprimer, et signaler.' },
];
const M6CBtn = ({ i, cur, set }: { i: number; cur: number; set: (i: number) => void }) => {
  const c = M6_COMMENTS[i];
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        set(i);
      }}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start', width: '100%', boxSizing: 'border-box', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '14px 18px', fontFamily: body, background: cur === i ? T[c.tone].bg : C.card, boxShadow: cur === i ? `inset 0 0 0 3px ${STRONG[c.tone]}` : `inset 0 0 0 1.5px ${C.rule}` }}
    >
      <Avatar who="user" size={44} />
      <span style={{ fontSize: 22, lineHeight: 1.38, color: C.ink }}>
        <strong>{c.who}</strong> · {c.txt}
      </span>
    </button>
  );
};

const M6_Commentaires: Page = () => {
  const [i, setI] = useState(-1);
  const c = i >= 0 ? M6_COMMENTS[i] : null;
  return (
    <Frame mod={6} kind="simu">
      <Title>Analyser des commentaires : trier, prioriser, répondre</Title>
      <Lede>Votez d’abord : quelle catégorie, quelle urgence ? Puis cliquez pour voir l’analyse et la réponse suggérée.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 980, display: 'flex', flexDirection: 'column', gap: 12, ...dl(100) }}>
        <M6CBtn i={0} cur={i} set={setI} />
        <M6CBtn i={1} cur={i} set={setI} />
        <M6CBtn i={2} cur={i} set={setI} />
        <M6CBtn i={3} cur={i} set={setI} />
        <M6CBtn i={4} cur={i} set={setI} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1160, top: 270, width: 640, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(200) }}>
        {c ? (
          <div key={i} className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
            <Eyebrow c={C.muted} size={18}>
              Catégorie proposée
            </Eyebrow>
            <div style={{ marginTop: 10 }}>
              <Tag tone={c.tone} size={24}>
                {c.cat}
              </Tag>
            </div>
            <Eyebrow c={C.muted} size={18} style={{ marginTop: 26 }}>
              Réponse suggérée
            </Eyebrow>
            <div style={{ marginTop: 10, background: T.blue.bg, borderRadius: 14, padding: '16px 20px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>{c.rep}</div>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: C.soft }}>
              <Icon name="humanCheck" size={26} color={C.green} /> Un humain relit et publie la réponse.
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 24, lineHeight: 1.45, color: C.muted }}>
            Cliquez un commentaire.
            <br />
            <br />
            Le prompt utilisé : « Classe chaque commentaire (positif, question, négatif, critique sensible, spam), indique l’urgence, et propose une réponse dans notre ton. Ne promets rien que nous n’ayons validé. »
          </div>
        )}
      </div>
      <Callout title="Règle" tone="coral" icon="alert" cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(500) }} size={22}>
        Les commentaires négatifs et sensibles ne reçoivent jamais de réponse automatique : l’IA propose, une personne décide et répond.
      </Callout>
    </Frame>
  );
};

// ─── Identification des tendances ───────────────────────────────────────────
const M6_MONTHS = ['nov.', 'déc.', 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.'];
const m6Path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'} ${60 + i * 90} ${400 - v * 3.4}`).join(' ');
const M6_SERIES = {
  filtre: [30, 32, 35, 38, 42, 47, 52, 58, 63, 70, 78, 86],
  bureau: [40, 38, 45, 44, 48, 50, 47, 42, 40, 55, 72, 80],
  capsule: [80, 78, 74, 72, 70, 66, 64, 60, 58, 55, 52, 50],
};

const M6_Tendances: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Identifier des tendances : ce qui monte, ce qui baisse</Title>
    <Lede>Mentions dans vos commentaires, avis et recherches sur 12 mois (indice 100 = maximum). L’IA repère, vous vérifiez.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1140, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', ...dl(100) }}>
      <svg width={1092} height={450} viewBox="0 0 1092 450" style={{ display: 'block' }} aria-hidden>
        <line x1={50} y1={400} x2={1060} y2={400} stroke={C.rule} strokeWidth={2} />
        <line x1={50} y1={230} x2={1060} y2={230} stroke={C.rule} strokeWidth={1} strokeDasharray="6 8" />
        <line x1={50} y1={60} x2={1060} y2={60} stroke={C.rule} strokeWidth={1} strokeDasharray="6 8" />
        <text x={40} y={405} textAnchor="end" style={{ fontSize: 16, fill: C.muted }}>0</text>
        <text x={40} y={235} textAnchor="end" style={{ fontSize: 16, fill: C.muted }}>50</text>
        <text x={40} y={65} textAnchor="end" style={{ fontSize: 16, fill: C.muted }}>100</text>
        <text x={60} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[0]}</text>
        <text x={330} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[3]}</text>
        <text x={600} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[6]}</text>
        <text x={870} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[9]}</text>
        <text x={1050} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[11]}</text>
        <path d={m6Path(M6_SERIES.filtre)} pathLength={1} fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className={b.draw(1)} />
        <path d={m6Path(M6_SERIES.bureau)} pathLength={1} fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className={b.draw(2)} />
        <path d={m6Path(M6_SERIES.capsule)} pathLength={1} fill="none" stroke={C.faint} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className={b.draw(3)} />
        <text x={1000} y={78} textAnchor="end" className={b.fade(1)} style={{ fontSize: 20, fontWeight: 700, fill: C.green }}>Café filtre ↑</text>
        <text x={1060} y={205} textAnchor="end" className={b.fade(2)} style={{ fontSize: 20, fontWeight: 700, fill: C.blue }}>Café au bureau ↑</text>
        <text x={1060} y={265} textAnchor="end" className={b.fade(3)} style={{ fontSize: 20, fontWeight: 700, fill: C.muted }}>Capsules ↓</text>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1320, top: 270, width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card tone="green" icon="trend" title="Signal" cls={b.on(1)} size={21}>
        Le café filtre progresse toute l’année : un contenu « tutos » à renforcer.
      </Card>
      <Card tone="blue" icon="calendar" title="Saisonnalité" cls={b.on(2)} size={21}>
        « Bureau » remonte chaque rentrée : lancer le B2B en septembre l’an prochain.
      </Card>
      <Card tone="coral" icon="search" title="À vérifier" cls={b.on(3)} size={21}>
        Croisez avec Google Trends, vos ventes et la presse du secteur avant de décider.
      </Card>
    </div>
    <PromptBox title="prompt · tendances" size={18} cls={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1140, ...dl(400) }}>
      Voici nos commentaires et avis des 12 derniers mois, datés. Quels sujets sont en hausse ou en baisse ? Donne, pour chacun, le nombre de mentions par trimestre et 2 exemples datés.
    </PromptBox>
  </Frame>
);

// ─── Synthèse de résultats : le rapport en une page ─────────────────────────
const M6Block = ({ beat, tone, title, children }: { beat: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '16px 22px 16px 28px' }}>
    <Eyebrow c={T[tone].fg} size={17}>
      {title}
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.42, color: C.ink }}>{children}</div>
  </div>
);
const M6Kpi = ({ v, l, tone }: { v: string; l: string; tone: Tone }) => (
  <div style={{ flex: 1, background: T[tone].bg, borderRadius: 14, padding: '14px 18px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, lineHeight: 1, color: STRONG[tone] }}>{v}</div>
    <div style={{ marginTop: 6, fontSize: 19, color: C.soft }}>{l}</div>
  </div>
);

const M6_Synthese: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Synthèse de résultats : le bilan en une page</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1100, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={b.on(1)} style={{ display: 'flex', gap: 14 }}>
        <M6Kpi v="146" l="demandes de dégustation (objectif 150)" tone="blue" />
        <M6Kpi v="40 %" l="des demandes via la newsletter" tone="green" />
        <M6Kpi v="41 €" l="par demande en sponsorisé" tone="coral" />
      </div>
      <M6Block beat={2} tone="green" title="Ce qui a marché">
        Newsletter et email direct : messages personnalisés, appel à l’action unique. Le slogan « La pause qui compte » est repris en commentaires.
      </M6Block>
      <M6Block beat={3} tone="coral" title="Ce qui n’a pas marché">
        LinkedIn sponsorisé trop large (toutes tailles d’entreprises). Instagram : visibilité forte, peu de demandes B2B.
      </M6Block>
      <M6Block beat={4} tone="violet" title="Trois recommandations pour décembre">
        1. Recentrer le sponsorisé sur les office managers de 50 à 200 salariés. 2. Étendre l’email direct aux ETI. 3. Mesurer la conversion dégustation → contrat.
      </M6Block>
    </div>
    <div style={{ position: 'absolute', left: 1280, top: 190, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox title="prompt · synthèse" size={18} cls={A.right} style={dl(200)}>
        À partir de notre analyse, rédige une synthèse d’une page pour la direction : 3 chiffres clés, ce qui a marché, ce qui n’a pas marché, 3 recommandations priorisées.{'\n'}Phrases courtes. <Cn>Aucun chiffre absent du tableau.</Cn>
      </PromptBox>
      <Callout title="Contrôle" tone="yellow" icon="eye" cls={A.right} style={dl(400)} size={22}>
        Vérifiez chaque chiffre de la synthèse dans le tableau source avant envoi.
      </Callout>
    </div>
  </Frame>
);

// ─── Suggestions d’amélioration : matrice impact / effort ───────────────────
const M6_Matrice: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Suggestions d’amélioration : impact × effort</Title>
    <Lede>L’IA a proposé huit actions. Faites-les glisser dans la matrice avec le groupe (double-clic : retour au départ).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1120, height: 620, ...dl(100) }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
        <div style={{ background: T.green.bg, borderRadius: '18px 4px 4px 4px', padding: 18 }}>
          <Eyebrow c={T.green.fg} size={19}>Victoires rapides</Eyebrow>
        </div>
        <div style={{ background: T.blue.bg, borderRadius: '4px 18px 4px 4px', padding: 18 }}>
          <Eyebrow c={T.blue.fg} size={19}>Projets majeurs</Eyebrow>
        </div>
        <div style={{ background: T.grey.bg, borderRadius: '4px 4px 4px 18px', padding: 18, display: 'flex', alignItems: 'flex-end' }}>
          <Eyebrow c={T.grey.fg} size={19}>Si on a le temps</Eyebrow>
        </div>
        <div style={{ background: T.coral.bg, borderRadius: '4px 4px 18px 4px', padding: 18, display: 'flex', alignItems: 'flex-end' }}>
          <Eyebrow c={T.coral.fg} size={19}>À éviter</Eyebrow>
        </div>
      </div>
      <div style={{ position: 'absolute', left: -46, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <span style={{ transform: 'rotate(-90deg)', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: C.muted, whiteSpace: 'nowrap' }}>IMPACT ↑</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -34, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: C.muted }}>EFFORT →</div>
    </div>
    <Drag x={1290} y={270} w={510} size={22} tone="violet">Tester 2 objets d’email (A/B)</Drag>
    <Drag x={1290} y={340} w={510} size={22} tone="violet">Cibler le sponsorisé (50–200 sal.)</Drag>
    <Drag x={1290} y={410} w={510} size={22} tone="violet">Programme de parrainage B2B</Drag>
    <Drag x={1290} y={480} w={510} size={22} tone="violet">Refaire tout le site web</Drag>
    <Drag x={1290} y={550} w={510} size={22} tone="violet">Répondre aux avis sur la livraison</Drag>
    <Drag x={1290} y={620} w={510} size={22} tone="violet">Lancer une chaîne YouTube</Drag>
    <Drag x={1290} y={690} w={510} size={22} tone="violet">Changer de transporteur</Drag>
    <Drag x={1290} y={760} w={510} size={22} tone="violet">Témoignage vidéo sur la page</Drag>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 1290, top: 850, width: 510, ...dl(500) }}>
      L’IA propose et estime ; c’est l’équipe qui connaît ses moyens.
    </Hint>
  </Frame>
);

// ─── Les pièges de l’analyse ────────────────────────────────────────────────
const M6_Pieges: Page = () => (
  <Frame mod={6}>
    <Title>Cinq pièges de l’analyse avec l’IA</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <Card tone="coral" icon="money" title="Chiffres inventés ou faux" cls={A.in} style={{ height: 300, ...dl(100) }} size={22}>
        L’IA peut se tromper dans un calcul ou « compléter » une donnée. Calculs dans le tableur, chiffres revérifiés.
      </Card>
      <Card tone="yellow" icon="link" title="Corrélation ≠ causalité" cls={A.in} style={{ height: 300, ...dl(200) }} size={22}>
        Les ventes montent quand on poste plus ? Peut-être la rentrée. Demandez : « Quelles autres explications ? »
      </Card>
      <Card tone="violet" icon="users" title="Échantillon biaisé" cls={A.in} style={{ height: 300, ...dl(300) }} size={22}>
        Les avis viennent surtout des très contents et des très mécontents. 30 commentaires ne font pas un marché.
      </Card>
      <Card tone="blue" icon="lock" title="Données personnelles" cls={A.in} style={{ height: 300, ...dl(400) }} size={22}>
        Exportez sans nom, email ni téléphone. Les avis aussi : retirez les signatures.
      </Card>
      <Card tone="teal" icon="filter" title="Conclusion trop sûre" cls={A.in} style={{ height: 300, ...dl(500) }} size={22}>
        Exigez de l’IA ce que les données ne permettent pas de conclure, et le niveau de confiance.
      </Card>
      <div className={A.in} style={{ height: 300, boxSizing: 'border-box', background: G.navy, borderRadius: 18, padding: '28px 30px', color: '#fff', ...dl(600) }}>
        <Eyebrow c="#C9B6FF" size={19}>
          La phrase à ajouter
        </Eyebrow>
        <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.3 }}>« Montre tes calculs, cite tes sources dans les données, et dis-moi ce que tu ne sais pas. »</div>
      </div>
    </div>
  </Frame>
);

// ─── Exercice : analyser 10 avis ────────────────────────────────────────────
const M6Rev = ({ stars, children }: { stars: number; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px', fontSize: 19, lineHeight: 1.38, color: C.ink }}>
    <span style={{ color: C.amber, letterSpacing: 2 }}>{'★'.repeat(stars)}</span>
    <span style={{ color: C.rule, letterSpacing: 2 }}>{'★'.repeat(5 - stars)}</span> {children}
  </div>
);

const M6_Exercice: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Exercice flash : à vous d’analyser ces 10 avis</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1060, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...dl(100) }}>
      <M6Rev stars={5}>Arômes incroyables, le moka d’Éthiopie est devenu notre rituel.</M6Rev>
      <M6Rev stars={2}>Colis arrivé ouvert, la moitié du café renversé.</M6Rev>
      <M6Rev stars={4}>Très bon, mais l’abonnement est compliqué à mettre en pause.</M6Rev>
      <M6Rev stars={5}>Conseils au téléphone parfaits pour choisir la mouture.</M6Rev>
      <M6Rev stars={3}>Bon café, mais 8 jours de livraison pour Lyon même…</M6Rev>
      <M6Rev stars={1}>Impossible de résilier l’abonnement depuis le site.</M6Rev>
      <M6Rev stars={5}>On l’a fait goûter au bureau, tout le monde a adoré.</M6Rev>
      <M6Rev stars={4}>Sachet refermable pratique, j’aimerais une option vrac.</M6Rev>
      <M6Rev stars={2}>Prix en hausse sans prévenir les abonnés.</M6Rev>
      <M6Rev stars={5}>Le petit mot manuscrit dans le colis, quelle attention !</M6Rev>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(200) }}>
        <PanelTitle icon="target" c={T.green.fg}>
          Votre mission
        </PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          <strong>1.</strong> Faites classer ces avis en thèmes par l’IA. <strong>2.</strong> Identifiez l’irritant prioritaire. <strong>3.</strong> Proposez une action et un contenu qui y répondent.
        </div>
      </div>
      <Timer id="m6-avis" minutes={8} label="Exercice" compact cls={A.right} style={dl(300)} />
      <FlipCard
        w={560}
        h={260}
        tone="green"
        cls={A.right}
        style={dl(400)}
        front={
          <>
            <Eyebrow c={T.green.fg} size={18}>
              Correction
            </Eyebrow>
            <div style={{ marginTop: 10, fontSize: 22, color: C.soft }}>Retournez après l’exercice.</div>
          </>
        }
        back={
          <div style={{ fontSize: 20, lineHeight: 1.45, color: C.ink }}>
            <strong>Thèmes :</strong> produit (+), service (+), livraison (−), <strong>abonnement (−)</strong>, prix (−).
            <br />
            <strong>Irritant prioritaire :</strong> la gestion de l’abonnement (pause, résiliation) : risque légal en plus d’être frustrant.
            <br />
            <strong>Action :</strong> résiliation en ligne simple + FAQ « gérer mon abonnement ».
          </div>
        }
      />
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <QcmPage
    mod={6}
    n={3}
    title="Analyse"
    q="L’IA vous annonce : « Vos posts du mardi génèrent 3 fois plus de demandes. » Quelle est la bonne réaction ?"
    explain="On vérifie le calcul dans les données, on cherche d’autres explications (sujet, format, période) et on teste avant de généraliser."
  >
    <Opt why="Une conclusion non vérifiée peut reposer sur un calcul erroné ou sur deux posts exceptionnels.">Je publie désormais uniquement le mardi</Opt>
    <Opt ok why="Exact : vérifier le chiffre, chercher les causes alternatives, puis tester sur quelques semaines.">Je vérifie le calcul, je cherche d’autres explications et je teste</Opt>
    <Opt why="L’IA est utile pour repérer des pistes : il ne faut pas la croire aveuglément, ni l’ignorer.">J’ignore l’analyse, l’IA se trompe toujours</Opt>
    <Opt why="Ajouter des données personnelles n’améliore pas la fiabilité de la conclusion et pose un problème RGPD.">Je lui donne la liste nominative des clients pour qu’elle confirme</Opt>
  </QcmPage>
);

// ─── Synthèse du module ─────────────────────────────────────────────────────
const M6_Bilan: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Ce qu’on retient du module 6</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        Données anonymisées + question précise : <strong>l’IA lit, le tableur calcule</strong>.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        Avis et commentaires : <strong>thèmes, sentiment, citations exactes</strong>, irritant n° 1.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Tendances : l’IA <strong>repère des signaux</strong>, d’autres sources les confirment.
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        Synthèse en une page : <strong>chiffres clés, réussites, échecs, 3 recommandations</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        « Montre tes calculs et <strong>dis-moi ce que tu ne sais pas</strong>. »
      </SynthRow>
    </div>
    <ProjectCard mod={6}>
      Vous savez quels indicateurs suivre pour chaque canal et comment transformer les résultats en recommandations. Tout est prêt pour la mini-campagne.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_Donnees, M6_Graph, M6_Avis, M6_Commentaires, M6_Tendances, M6_Synthese, M6_Matrice, M6_Pieges, M6_Exercice, M6_Qcm, M6_Bilan];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M6 · 15:25

OBJECTIF — Annoncer le dernier module de contenu : l’analyse.

DIRE — « Dernier module avant le projet : l’analyse. C’est souvent la partie qu’on n’a jamais le temps de faire, et c’est là que l’IA aide énormément. Six sujets du programme : données marketing, retours clients, commentaires, tendances, synthèse de résultats et suggestions d’amélioration. Et les pièges, parce qu’une analyse fausse est pire que pas d’analyse. »

TRANSITION — « Premier cas : le bilan de la campagne de novembre. »`,
  `⏱ 4 min · ANALYSE DE DONNÉES (4 clics)

OBJECTIF — Montrer l’analyse d’un export de résultats et la répartition IA / tableur.

DIRE — « Voici l’export de la campagne Ardente, données fictives. 146 demandes pour un objectif de 150. » Lire le prompt : « Une question précise, et deux exigences : montre tes calculs, et dis ce que les données ne permettent pas de conclure. » → enseignement 1 : la newsletter. → 2 : l’email direct. → 3 : le coût du sponsorisé, 900 divisé par 22. → 4 : la limite, on ne sait pas combien de dégustations deviennent des contrats.

INSISTER — Le quatrième point est le plus précieux : une bonne analyse dit aussi ce qu’elle ne sait pas.

TRANSITION — « Pour présenter ces résultats, il faut un graphique. »`,
  `⏱ 2 min · GRAPHIQUE (2 clics)

OBJECTIF — Utiliser l’IA comme conseil en visualisation, le tableur pour produire.

DIRE — → « Barres horizontales triées : on voit tout de suite qui contribue. » « L’IA conseille le type de graphique et peut écrire les formules ; le tableur calcule et trace. » → « Et un titre qui affirme : “La newsletter apporte 40 % des demandes”. Le lecteur comprend sans chercher. »

TRANSITION — « Deuxième source d’information : vos clients. »`,
  `⏱ 4 min · AVIS CLIENTS (5 clics)

OBJECTIF — Montrer l’analyse thématique d’avis clients.

DIRE — « 200 avis, anonymisés. On demande des thèmes, la part positive et négative, et une citation exacte. » → révéler les thèmes. « Le goût : excellent. La livraison : l’irritant numéro 1. Le prix : partagé. L’emballage : bien, mais une attente sur le recyclable. Le service client : un point fort. »

INSISTER — « Ne reformule pas les citations » : sinon l’IA les embellit. Et l’enseignement : le problème n’est pas le produit mais la livraison, à régler avant de promettre « installé en une semaine » aux entreprises.

TRANSITION — « Les commentaires, eux, demandent une réponse. »`,
  `⏱ 4 min · COMMENTAIRES (interactif)

OBJECTIF — Montrer la modération assistée : classer, prioriser, proposer une réponse.

DIRE — « Cinq commentaires sous notre post. Pour chacun, votez : quelle catégorie, quelle urgence ? » Puis cliquer. « Julie : positif, on remercie et on relance la conversation. Karim : une question, c’est une opportunité commerciale. Sophie : négatif et urgent, on passe en privé. Marc : critique sensible, on répond avec des preuves, sans se défendre. Et le spam : on masque. »

INSISTER — Jamais de réponse automatique aux commentaires négatifs ou sensibles. L’IA propose, une personne publie.

TRANSITION — « En prenant du recul sur un an, on voit des tendances. »`,
  `⏱ 3 min · TENDANCES (3 clics)

OBJECTIF — Montrer le repérage de tendances et la nécessité de les confirmer.

DIRE — → « Le café filtre monte toute l’année : on renforce les tutos. » → « Le café au bureau remonte à chaque rentrée : l’an prochain, on lance le B2B en septembre, pas en novembre. » → « Les capsules baissent. » « Mais l’IA travaille sur nos données seulement. On croise avec Google Trends, nos ventes, la presse du secteur. »

TRANSITION — « Tout ça doit tenir en une page pour la direction. »`,
  `⏱ 3 min · SYNTHÈSE DE RÉSULTATS (4 clics)

OBJECTIF — Donner la structure d’une synthèse d’une page.

DIRE — → « Trois chiffres clés. » → « Ce qui a marché. » → « Ce qui n’a pas marché. » → « Trois recommandations priorisées. » « Le prompt impose : aucun chiffre absent du tableau. Et le contrôle humain : on vérifie chaque chiffre avant d’envoyer. »

TRANSITION — « Les recommandations, justement : comment choisir ? »`,
  `⏱ 4 min · MATRICE IMPACT / EFFORT (exercice)

OBJECTIF — Prioriser les suggestions d’amélioration en groupe.

DIRE — « L’IA a proposé huit actions. Plaçons-les ensemble. » Faire glisser avec le groupe : test A/B des objets et réponse aux avis = victoires rapides ; changer de transporteur et cibler le sponsorisé = projets majeurs ; refaire le site, chaîne YouTube = à éviter pour l’instant.

INSISTER — L’IA estime l’impact et l’effort de façon générique ; c’est l’équipe qui connaît ses moyens et son contexte.

TRANSITION — « Avant l’exercice, les cinq pièges. »`,
  `⏱ 3 min · PIÈGES DE L’ANALYSE

OBJECTIF — Garantir des analyses fiables (objectif « vérifier, corriger »).

DIRE — « Chiffres inventés : on calcule dans le tableur. Corrélation n’est pas causalité : demandez “quelles autres explications ?”. Échantillon biaisé : les avis viennent des extrêmes. Données personnelles : on anonymise. Conclusion trop sûre : on exige les limites. » « Et la phrase à ajouter à tous vos prompts d’analyse. »

TRANSITION — « À vous : exercice flash. »`,
  `⏱ 8 min · EXERCICE FLASH (minuteur 8 min)

OBJECTIF — Analyser un petit corpus d’avis avec l’IA.

DIRE — « Dix avis. Recopiez-les ou décrivez-les à votre IA, faites-les classer en thèmes, identifiez l’irritant prioritaire et proposez une action, plus un contenu qui y répond. Huit minutes. »

ANIMATION — Lancer le minuteur, puis retourner la carte de correction. Point clé : la résiliation d’abonnement difficile est un irritant ET un risque légal (la résiliation en ligne doit être simple).

TRANSITION — « Dernier QCM. »`,
  `⏱ 2 min · QCM 3 (analyse)

OBJECTIF — Vérifier la posture critique face à une conclusion de l’IA.

DIRE — « Vote. » Bonne réponse : B. « Vérifier, chercher d’autres explications, tester. »

TRANSITION — « Je résume. »`,
  `⏱ 1 min · SYNTHÈSE M6

OBJECTIF — Clore les modules de contenu.

DIRE — « Cinq idées. » Les lire. « Vous avez maintenant toutes les pièces : cible, idées, contenus, visuels, déclinaisons, analyse. Il est temps de tout assembler. »

TRANSITION — « Projet final : votre mini-campagne. »`,
];
// @@NOTES-END
