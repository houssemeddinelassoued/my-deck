// ─── Module 1 · Comprendre l’IA dans le marketing ───────────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        Comprendre l’IA
        <br />
        dans le marketing
      </>
    }
    sub="Ce que l’IA générative sait faire pour un service marketing, avec quels outils, et où sont les pièges."
    dur="9:20 – 10:00"
  >
    <SecItem n={1}>IA générative et marketing : comment ça marche, en une minute</SecItem>
    <SecItem n={2}>Les différents types d’outils</SecItem>
    <SecItem n={3}>Textes, images, vidéos et présentations</SecItem>
    <SecItem n={4}>Opportunités… et limites</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Comment ça marche : prédire le mot suivant ─────────────────────────────
const M1Bar = ({ word, pct, top = false }: { word: string; pct: number; top?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 58 }}>
    <span style={{ width: 170, fontSize: 28, fontWeight: top ? 700 : 500, color: top ? C.navy : C.soft, textAlign: 'right' }}>{word}</span>
    <div style={{ width: 560, height: 36, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
      <div className={cx(b.grow(1), top && b.hi(2))} style={{ width: `${pct}%`, height: '100%', borderRadius: 10, background: top ? G.blue : C.faint }} />
    </div>
    <span className={b.fade(1)} style={{ width: 90, fontFamily: mono, fontSize: 24, color: top ? C.blue : C.muted }}>
      {pct} %
    </span>
  </div>
);

const M1_Predire: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>L’IA générative, en une minute : elle prédit la suite</Title>
    <Lede>Un modèle de langage a lu des milliards de textes. Il ne « sait » rien : il calcule le mot le plus probable, puis le suivant…</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 300, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 36px', ...dl(150) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>
        « Ce matin, rien ne vaut un bon
        <span style={{ position: 'relative', display: 'inline-block', width: 150, height: 54, borderRadius: 12, boxShadow: `inset 0 0 0 3px ${C.rule}` }}>
          <span className={b.pop(2)} style={{ position: 'absolute', inset: 0, borderRadius: 12, background: G.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            café
          </span>
        </span>
        »
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M1Bar word="café" pct={62} top />
        <M1Bar word="croissant" pct={14} />
        <M1Bar word="réveil" pct={9} />
        <M1Bar word="jus" pct={6} />
        <M1Bar word="autre…" pct={9} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 300, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="coral" icon="alert" title="Plausible ≠ vrai" cls={A.right} style={dl(300)} size={23}>
        Elle écrit ce qui « sonne juste ». Un chiffre, une date, une citation peuvent être inventés.
      </Card>
      <Card tone="violet" icon="eyeOff" title="Elle ne connaît pas votre marque" cls={A.right} style={dl(420)} size={23}>
        Vos offres, vos prix, votre ton : seulement si vous les lui donnez.
      </Card>
      <Card tone="green" icon="bulb" title="Plus de contexte, meilleure suite" cls={A.right} style={dl(540)} size={23}>
        Le prompt oriente la prédiction : c’est tout l’art du module 2.
      </Card>
    </div>
    <Callout title="La conséquence pour nous" tone="blue" icon="target" cls={b.on(3)} style={{ position: 'absolute', left: 120, top: 830, width: 1000 }} size={24}>
      L’IA est un excellent <strong>rédacteur de premier jet</strong>, pas une source d’information.
    </Callout>
  </Frame>
);

// ─── Six usages marketing (cartes à retourner) ──────────────────────────────
const M1Use = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode }) => (
  <FlipCard
    w={536}
    h={300}
    tone={tone}
    backTone={tone}
    flipAt={1}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name={icon} tone={tone} size={60} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{desc}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={19}>
          Chez Ardente
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M1_Usages: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Six usages de l’IA générative en marketing</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M1Use icon="bulb" tone="blue" title="Idéer" desc="Trouver des angles, des sujets, des concepts de campagne, des noms." ex="« 30 idées de posts pour faire connaître Ardente Bureau aux office managers. »" />
      <M1Use icon="pen" tone="violet" title="Rédiger" desc="Produire un premier jet : article, post, email, page web, script." ex="Un article de blog de 800 mots sur « la pause café, rituel d’équipe »." />
      <M1Use icon="split" tone="teal" title="Adapter" desc="Réécrire pour un autre public, un autre canal, une autre longueur." ex="Le même article transformé en post LinkedIn, carrousel Instagram et newsletter." />
      <M1Use icon="image" tone="pink" title="Visualiser" desc="Générer des visuels, des moodboards, des maquettes, des slides." ex="Trois pistes de visuels pour la campagne de novembre, au format story." />
      <M1Use icon="chart" tone="yellow" title="Analyser" desc="Synthétiser des avis, des commentaires, des résultats de campagne." ex="« Que disent nos 200 derniers avis clients ? Quels irritants reviennent ? »" />
      <M1Use icon="users" tone="green" title="Personnaliser" desc="Adapter le message à chaque segment, persona ou étape du parcours." ex="Un email de relance différent pour les PME, les start-up et les grands comptes." />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Cliquez une carte pour la retourner, ou → pour toutes les retourner.
    </Hint>
  </Frame>
);

// ─── Les familles d’outils (onglets) ────────────────────────────────────────
const M1Tool = ({ name, by, children, tone = 'blue' }: { name: string; by: string; children: ReactNode; tone?: Tone }) => (
  <div style={{ width: 536, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '18px 24px 18px 30px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{name}</span>
      <span style={{ fontSize: 18, color: C.muted }}>{by}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);
const M1Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 24 }}>{children}</div>
);

const M1_Outils: Page = () => (
  <Frame mod={1} kind="demo">
    <Title>Les différents types d’outils</Title>
    <Lede>Les noms changent tous les six mois ; les familles restent. Cliquez sur une famille.</Lede>
    <Tabs initial="assist">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, display: 'flex', gap: 12, ...dl(100) }}>
        <TabBtn id="assist" icon="chat" tone="blue">
          Assistants conversationnels
        </TabBtn>
        <TabBtn id="img" icon="image" tone="pink">
          Images
        </TabBtn>
        <TabBtn id="video" icon="video" tone="coral">
          Vidéo & voix
        </TabBtn>
        <TabBtn id="pres" icon="slides" tone="violet">
          Présentations
        </TabBtn>
        <TabBtn id="integ" icon="puzzle" tone="green">
          Intégrés à vos outils
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 370, width: 1680 }}>
        <TabPane id="assist">
          <M1Grid>
            <M1Tool name="ChatGPT" by="OpenAI">Le plus connu : rédaction, idéation, analyse de fichiers, images.</M1Tool>
            <M1Tool name="Copilot" by="Microsoft">Intégré à Word, PowerPoint, Outlook, Excel et Teams dans Microsoft 365.</M1Tool>
            <M1Tool name="Gemini" by="Google">Intégré à Gmail, Docs, Slides et Sheets dans Google Workspace.</M1Tool>
            <M1Tool name="Claude" by="Anthropic">Apprécié pour les textes longs, l’analyse de documents et le style.</M1Tool>
            <M1Tool name="Le Chat" by="Mistral AI">Alternative française et européenne, hébergement en Europe.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Idées, premiers jets, reformulation, synthèse, analyse de textes et de tableaux.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="img">
          <M1Grid>
            <M1Tool name="Assistants" by="ChatGPT, Gemini, Copilot" tone="pink">L’image générée dans la conversation : pratique pour itérer vite.</M1Tool>
            <M1Tool name="Midjourney" by="Midjourney" tone="pink">Très esthétique : moodboards, ambiances, pistes créatives.</M1Tool>
            <M1Tool name="Firefly" by="Adobe" tone="pink">Intégré à Photoshop et Express ; conçu pour un usage commercial.</M1Tool>
            <M1Tool name="Canva" by="Canva" tone="pink">Génération et retouche directement dans vos modèles de marque.</M1Tool>
            <M1Tool name="Ideogram" by="Ideogram" tone="pink">Réputé pour bien écrire du texte dans l’image.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Illustrations, fonds, mises en scène produit, déclinaisons de formats.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="video">
          <M1Grid>
            <M1Tool name="Génération vidéo" by="Runway, Veo, Sora…" tone="coral">Courts plans à partir d’un texte ou d’une image.</M1Tool>
            <M1Tool name="Avatars" by="Synthesia, HeyGen…" tone="coral">Vidéos explicatives avec présentateur virtuel, multilingues.</M1Tool>
            <M1Tool name="Montage" by="CapCut, Descript…" tone="coral">Sous-titres automatiques, découpe, formats courts.</M1Tool>
            <M1Tool name="Voix" by="ElevenLabs…" tone="coral">Voix off et doublage : attention au droit sur la voix.</M1Tool>
            <M1Tool name="Musique" by="Suno, Udio…" tone="coral">Jingles et fonds sonores : vérifier les licences.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Formats courts, tutoriels, déclinaisons linguistiques, prototypes de spots.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="pres">
          <M1Grid>
            <M1Tool name="Gamma" by="Gamma" tone="violet">Une présentation complète générée à partir d’un plan ou d’un texte.</M1Tool>
            <M1Tool name="Copilot" by="PowerPoint" tone="violet">Crée des slides depuis un document Word, dans votre modèle.</M1Tool>
            <M1Tool name="Canva" by="Canva" tone="violet">Présentations et documents commerciaux aux couleurs de la marque.</M1Tool>
            <M1Tool name="Gemini" by="Google Slides" tone="violet">Génère des slides et des images dans Slides.</M1Tool>
            <M1Tool name="Votre assistant" by="pour le fond" tone="violet">Plan, messages clés, notes : la structure avant la forme.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Un premier jet en 5 minutes, à reprendre dans votre charte graphique.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="integ">
          <M1Grid>
            <M1Tool name="Emailing & CRM" by="HubSpot, Brevo…" tone="green">Objets d’email, segments, textes de relance générés sur place.</M1Tool>
            <M1Tool name="Réseaux sociaux" by="Meta, LinkedIn…" tone="green">Variantes d’annonces, ciblage et textes publicitaires assistés.</M1Tool>
            <M1Tool name="Écriture" by="Notion, Word, Docs" tone="green">Reformuler, résumer, traduire sans quitter le document.</M1Tool>
            <M1Tool name="Tableur" by="Excel, Sheets" tone="green">Analyser un export de campagne en langage naturel.</M1Tool>
            <M1Tool name="Site web" by="CMS, SEO" tone="green">Méta-descriptions, textes alternatifs d’images, FAQ.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Gagner du temps là où vous travaillez déjà, sans copier-coller.
            </M1Tool>
          </M1Grid>
        </TabPane>
      </div>
    </Tabs>
    <Callout title="Le bon réflexe" tone="blue" icon="shieldCheck" cls={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(500) }} size={24}>
      Commencez par l’outil <strong>autorisé par votre entreprise</strong> (version professionnelle : vos données ne servent pas à entraîner le modèle).
    </Callout>
  </Frame>
);

// ─── Textes, images, vidéos, présentations ──────────────────────────────────
const M1Dots = ({ n, tone, beat }: { n: number; tone: Tone; beat: number }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 1 ? STRONG[tone] : C.panel, ...dl(0) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 2 ? STRONG[tone] : C.panel, ...dl(80) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 3 ? STRONG[tone] : C.panel, ...dl(160) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 4 ? STRONG[tone] : C.panel, ...dl(240) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 5 ? STRONG[tone] : C.panel, ...dl(320) }} />
  </div>
);
const M1Fmt = ({ icon, tone, title, level, maturity, good, warn, beat }: { icon: IconName; tone: Tone; title: string; level: number; maturity: string; good: ReactNode; warn: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ width: 399, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 26px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <M1Dots n={level} tone={tone} beat={beat} />
      <span style={{ fontSize: 19, fontWeight: 600, color: T[tone].fg }}>{maturity}</span>
    </div>
    <Eyebrow c={T.green.fg} size={17} style={{ marginTop: 24 }}>
      Excellent pour
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.ink, minHeight: 124 }}>{good}</div>
    <Eyebrow c={T.coral.fg} size={17} style={{ marginTop: 14 }}>
      Attention à
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{warn}</div>
  </div>
);

const M1_Formats: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Textes, images, vidéos, présentations : où en est l’IA ?</Title>
    <Lede>Quatre formats, quatre niveaux de maturité. Chaque → révèle un format.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 28 }}>
      <M1Fmt icon="type" tone="blue" title="Textes" level={5} maturity="Très mature" beat={1} good="Articles, posts, emails, slogans, scripts, reformulations, traductions." warn="Faits inventés, ton générique, répétitions." />
      <M1Fmt icon="image" tone="pink" title="Images" level={4} maturity="Mature" beat={2} good="Illustrations, ambiances, fonds, mises en scène produit, déclinaisons." warn="Texte dans l’image, mains, logos, ressemblance avec des personnes ou des œuvres." />
      <M1Fmt icon="video" tone="coral" title="Vidéos" level={3} maturity="En progrès rapide" beat={3} good="Plans courts, sous-titres, montage, avatars, voix off multilingue." warn="Cohérence entre plans, droit à l’image et à la voix, coût." />
      <M1Fmt icon="slides" tone="violet" title="Présentations" level={3} maturity="Bon premier jet" beat={4} good="Structure, plan, messages clés, notes de présentation, slides brutes." warn="Charte graphique, chiffres à sourcer, slides trop chargées." />
    </div>
    <Callout title="La règle" tone="blue" icon="eye" cls={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }} size={24}>
      Moins le format est mature, plus la <strong>relecture humaine</strong> doit être attentive… et plus le temps de retouche est à prévoir.
    </Callout>
  </Frame>
);

// ─── Simulateur : combien de temps gagné ? ──────────────────────────────────
const M1Slider = ({ label, value, unit, onChange, min, max, step = 1, tone }: { label: string; value: number; unit: string; onChange: (v: number) => void; min: number; max: number; step?: number; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: 760 }}>
      <span style={{ fontSize: 25, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: STRONG[tone], fontVariantNumeric: 'tabular-nums' }}>
        {value} <span style={{ fontSize: 22, fontWeight: 600, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <div style={{ marginTop: 10 }}>
      <Range value={value} onChange={onChange} min={min} max={max} step={step} w={760} tone={tone} />
    </div>
  </div>
);

const M1_Gain: Page = () => {
  const [n, setN] = useState(12);
  const [m, setM] = useState(45);
  const [g, setG] = useState(50);
  const [r, setR] = useState(10);
  const before = (n * m * 4.33) / 60;
  const after = (n * (m * (1 - g / 100) + r) * 4.33) / 60;
  const saved = before - after;
  const max = Math.max(before, after, 1);
  return (
    <Frame mod={1} kind="simu">
      <Title>Opportunité : combien de temps gagnez-vous vraiment ?</Title>
      <Lede>Réglez les curseurs avec vos chiffres. Le piège : oublier le temps de relecture.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, display: 'flex', flexDirection: 'column', gap: 34, ...dl(100) }}>
        <M1Slider label="Contenus produits par semaine" value={n} unit="contenus" onChange={setN} min={1} max={40} tone="blue" />
        <M1Slider label="Temps moyen par contenu, sans IA" value={m} unit="min" onChange={setM} min={10} max={180} step={5} tone="navy" />
        <M1Slider label="Temps gagné sur le premier jet" value={g} unit="%" onChange={setG} min={0} max={80} step={5} tone="green" />
        <M1Slider label="Relecture et correction ajoutées" value={r} unit="min / contenu" onChange={setR} min={0} max={40} tone="coral" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 280, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 36px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={20}>
          Par mois
        </Eyebrow>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 130, fontSize: 23, color: C.soft }}>Sans IA</span>
            <div style={{ flex: 1, height: 44, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
              <div style={{ width: `${(before / max) * 100}%`, height: '100%', background: C.faint, transition: `width 400ms ${EASE}` }} />
            </div>
            <span style={{ width: 100, fontFamily: mono, fontSize: 24, color: C.soft, textAlign: 'right' }}>{fr(before)} h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 130, fontSize: 23, color: C.soft }}>Avec IA</span>
            <div style={{ flex: 1, height: 44, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
              <div style={{ width: `${(after / max) * 100}%`, height: '100%', background: G.blue, transition: `width 400ms ${EASE}` }} />
            </div>
            <span style={{ width: 100, fontFamily: mono, fontSize: 24, color: C.blue, textAlign: 'right' }}>{fr(after)} h</span>
          </div>
        </div>
        <div style={{ marginTop: 34, paddingTop: 26, borderTop: `1.5px solid ${C.rule}` }}>
          <Eyebrow c={saved > 0 ? T.green.fg : T.coral.fg} size={20}>
            {saved > 0 ? 'Temps libéré chaque mois' : 'Pas rentable en l’état'}
          </Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6 }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 110, lineHeight: 1, color: saved > 0 ? C.green : C.coral, fontVariantNumeric: 'tabular-nums' }}>
              {fr(Math.abs(saved))} h
            </span>
            <span style={{ fontSize: 26, color: C.soft }}>{saved > 0 ? `soit ${fr(saved / 7, 1)} jours` : 'de plus'}</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
            {saved > 0 ? 'À réinvestir dans la stratégie, la créativité et la relation client.' : 'La relecture coûte plus que le gain : améliorez le prompt avant d’automatiser.'}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Limites : le post piégé ────────────────────────────────────────────────
for (let n = 1; n <= 6; n++) {
  CSS.push(`.${P}-flaw${n}{border-radius:6px;transition:background-color 500ms ${EASE},box-shadow 500ms ${EASE}}
${at(n)} .${P}-flaw${n}{background:rgba(224,72,72,.14);box-shadow:inset 0 -3px 0 ${C.coral}}`);
}
const M1Flaw = ({ n, children }: { n: number; children: ReactNode }) => (
  <span className={k(`flaw${n}`)} style={{ padding: '0 3px' }}>
    {children}
    <span className={b.pop(n)} style={{ display: 'inline-flex', verticalAlign: 'super', marginLeft: 4, width: 26, height: 26, borderRadius: 99, background: C.coral, color: '#fff', fontSize: 15, fontWeight: 700, alignItems: 'center', justifyContent: 'center' }}>
      {n}
    </span>
  </span>
);
const M1Why = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone="coral" size={36} />
    <div style={{ fontSize: 21, lineHeight: 1.38, color: C.soft }}>
      <strong style={{ color: C.ink }}>{title}</strong> · {children}
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} kind="exercice" beats={6}>
    <Title>Limites : trouvez les six problèmes de ce post</Title>
    <Lede>Généré en 3 secondes avec un prompt d’une ligne. Cherchez avant de cliquer : chaque → révèle un problème.</Lede>
    <SocialPost w={860} size={25} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, ...dl(100) }}>
      <M1Flaw n={1}>Dans un monde en constante évolution</M1Flaw>, Ardente révolutionne la pause café ! 🚀☕🔥✨{'\n\n'}
      Notre café est <M1Flaw n={2}>100 % neutre en carbone</M1Flaw> et <M1Flaw n={3}>préféré par 9 Français sur 10</M1Flaw>.{'\n\n'}
      <M1Flaw n={4}>« Le meilleur café de ma vie » — Marie, cliente depuis 2012</M1Flaw>
      {'\n\n'}
      Commandez vite : <M1Flaw n={5}>−50 % pour toujours</M1Flaw> !{'\n\n'}
      <M1Flaw n={6}>#café #coffee #love #instagood #business #lyon #pause #bureau #team #motivation</M1Flaw>
    </SocialPost>
    <div style={{ position: 'absolute', left: 1030, top: 270, width: 770, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M1Why n={1} title="Ton générique">la formule « passe-partout » de l’IA. Aucune voix de marque.</M1Why>
      <M1Why n={2} title="Allégation interdite">« neutre en carbone » est très encadré par la loi : risque de greenwashing.</M1Why>
      <M1Why n={3} title="Chiffre inventé">aucune étude derrière. Une source, ou on retire.</M1Why>
      <M1Why n={4} title="Fausse citation">Ardente existe depuis 2016… et Marie n’existe pas.</M1Why>
      <M1Why n={5} title="Promesse non validée">une offre commerciale engage l’entreprise : pratique trompeuse.</M1Why>
      <M1Why n={6} title="Hashtags hors cible">en anglais, génériques, sans lien avec le B2B lyonnais.</M1Why>
    </div>
  </Frame>
);

// ─── Règles d’or juridiques et éthiques ─────────────────────────────────────
const M1Rule = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card tone={tone} icon={icon} title={title} cls={A.in} style={{ width: 536, height: 290, ...dl(d) }} size={23}>
    {children}
  </Card>
);

const M1_Regles: Page = () => (
  <Frame mod={1}>
    <Title>Six règles d’or avant de publier un contenu généré</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36 }}>
      <M1Rule icon="lock" tone="coral" title="Confidentialité & RGPD" d={100}>
        Pas de données personnelles de clients ni de documents internes dans un outil grand public. Anonymisez.
      </M1Rule>
      <M1Rule icon="eye" tone="blue" title="Relecture humaine" d={200}>
        Tout fait, chiffre, citation et promesse est vérifié par une personne avant publication.
      </M1Rule>
      <M1Rule icon="scale" tone="yellow" title="Publicité loyale" d={300}>
        Pas d’allégation trompeuse ni de « vert » non prouvé : c’est la marque qui est responsable.
      </M1Rule>
      <M1Rule icon="palette" tone="pink" title="Droits & images" d={400}>
        Ne pas imiter un artiste, une marque ou une personne réelle. Vérifiez les conditions d’usage de l’outil.
      </M1Rule>
      <M1Rule icon="sparkles" tone="violet" title="Transparence" d={500}>
        Signalez les images ou vidéos réalistes générées par IA : c’est une exigence de l’AI Act européen.
      </M1Rule>
      <M1Rule icon="users" tone="green" title="Biais & inclusion" d={600}>
        L’IA reproduit des stéréotypes (âge, genre, origine). Relisez vos personas et vos visuels avec ce filtre.
      </M1Rule>
    </div>
  </Frame>
);

// ─── Quiz flash ─────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>
      <span style={{ color: C.violet }}>Quiz flash</span> · vrai ou faux ?
    </Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA connaît les prix et les offres d’Ardente. »" explain="Elle ne connaît que ce qu’on lui donne dans la conversation. Sinon, elle invente des tarifs plausibles… et faux.">
        <QOpt>Vrai, tout est sur Internet</QOpt>
        <QOpt ok>Faux, sauf si on les lui fournit</QOpt>
        <QOpt>Vrai, si la marque est connue</QOpt>
      </QuizQ>
      <QuizQ q="« Un texte bien écrit par l’IA peut être publié sans relecture. »" explain="Bien écrit ne veut pas dire exact. Un chiffre inventé ou une promesse non validée engage la marque : relecture systématique.">
        <QOpt>Vrai, s’il n’a pas de fautes</QOpt>
        <QOpt ok>Faux : on vérifie faits, ton et promesses</QOpt>
        <QOpt>Vrai, pour les réseaux sociaux</QOpt>
      </QuizQ>
      <QuizQ q="« Je colle notre fichier clients dans un assistant grand public pour le segmenter. »" explain="Ce sont des données personnelles : RGPD. On anonymise (pas de noms, emails, téléphones) ou on utilise un outil validé par l’entreprise.">
        <QOpt>Aucun problème si le compte est à mon nom</QOpt>
        <QOpt>Aucun problème si je supprime la conversation</QOpt>
        <QOpt ok>Non : on anonymise ou on passe par un outil validé</QOpt>
      </QuizQ>
      <QuizQ q="« Plus mon prompt est précis, plus la réponse est utile. »" explain="C’est le principe de base : cible, objectif, ton, format, exemples. Le module 2 vous donne une méthode en six ingrédients.">
        <QOpt ok>Vrai</QOpt>
        <QOpt>Faux, l’IA devine ce que je veux</QOpt>
        <QOpt>Faux, les prompts courts sont meilleurs</QOpt>
      </QuizQ>
      <QuizQ q="« Une image générée par IA est libre de droits par défaut. »" explain="Le régime juridique reste incertain et dépend de l’outil. Lisez ses conditions d’usage commercial et évitez toute ressemblance avec une œuvre, une marque ou une personne.">
        <QOpt>Vrai, puisque personne ne l’a dessinée</QOpt>
        <QOpt ok>Faux : conditions de l’outil et ressemblances à vérifier</QOpt>
        <QOpt>Vrai, si on la modifie un peu</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Ce qu’on retient du module 1</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        L’IA <strong>prédit un texte plausible</strong> : excellent premier jet, mauvaise source d’information.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Six usages : <strong>idéer, rédiger, adapter, visualiser, analyser, personnaliser</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Cinq familles d’outils ; commencez par <strong>celui autorisé par l’entreprise</strong>.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Le gain réel = temps gagné <strong>moins le temps de relecture</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Avant de publier : <strong>faits, ton, promesses, droits, transparence, biais</strong>.
      </SynthRow>
    </div>
    <ProjectCard mod={1}>
      Vous savez quel outil utiliser pour chaque format, et vous avez noté les six réflexes de vérification dans votre bibliothèque de prompts.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Predire, M1_Usages, M1_Outils, M1_Formats, M1_Gain, M1_Limites, M1_Regles, M1_Quiz, M1_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M1 · 9:20

OBJECTIF — Annoncer le module : un vocabulaire commun et une vision lucide de l’IA.

DIRE — « Premier module, quarante minutes pour comprendre. Comment fonctionne l’IA générative, sans jargon. Quels outils existent pour les textes, les images, la vidéo, les présentations. Et surtout, ce qu’elle fait bien et ce qu’elle fait mal, parce que c’est ça qui conditionne la façon de s’en servir. »

TRANSITION — « Commençons par le fonctionnement, en une minute. »`,
  `⏱ 4 min · PRÉDIRE LA SUITE (3 clics)

OBJECTIF — Faire comprendre que l’IA prédit du texte plausible, et en tirer les conséquences pratiques.

DIRE — « Je commence une phrase : “Ce matin, rien ne vaut un bon…” Vous avez tous complété dans votre tête. » → « L’IA fait exactement ça : elle calcule la probabilité de chaque mot possible. » → « Elle choisit “café”, puis recommence pour le mot suivant, des centaines de fois. Elle ne cherche pas dans une base de données, elle ne vérifie rien : elle produit ce qui est le plus plausible. » Montrer les trois cartes : « Plausible n’est pas vrai. Elle ne connaît pas votre marque. Et plus vous lui donnez de contexte, meilleure est la suite. » →

INSISTER — La phrase de la callout : excellent rédacteur de premier jet, pas une source d’information.

TRANSITION — « Alors concrètement, à quoi ça sert dans un service marketing ? »`,
  `⏱ 4 min · SIX USAGES (cartes à retourner)

OBJECTIF — Donner une carte mentale des usages, illustrée par le fil rouge.

DIRE — « Six verbes résument presque tout : idéer, rédiger, adapter, visualiser, analyser, personnaliser. Regardez l’ordre : ce n’est pas qu’un outil d’écriture. On peut l’utiliser avant d’écrire, pour réfléchir, et après, pour analyser. » Faire retourner une ou deux cartes par des participants, puis → pour tout retourner et lire les exemples Ardente.

ANIMATION — Demander : « Lequel de ces six usages vous ferait gagner le plus de temps dès lundi ? » Faire voter à main levée, noter le gagnant.

TRANSITION — « Pour chaque usage, il existe des outils. »`,
  `⏱ 5 min · FAMILLES D’OUTILS (onglets)

OBJECTIF — Donner un panorama des outils, sans en faire un catalogue.

DIRE — « Cinq familles. Les assistants conversationnels : ChatGPT, Copilot, Gemini, Claude, Le Chat. Ils font presque tout. » Cliquer Images : « Pour les visuels, les assistants génèrent aussi des images, mais des outils spécialisés comme Midjourney, Firefly ou Canva vont plus loin. » Cliquer Vidéo, Présentations, puis Intégrés : « Et souvent, l’IA est déjà dans vos outils : votre CRM, votre outil d’emailing, Canva, Word. »

INSISTER — La callout : utilisez la version professionnelle autorisée. Dans les offres entreprise, vos données ne servent pas à entraîner le modèle ; dans les versions gratuites, ce n’est pas toujours le cas. Les noms changent vite : ne vous attachez pas à un outil, attachez-vous à la méthode.

TRANSITION — « Selon le format, la maturité n’est pas la même. »`,
  `⏱ 3 min · QUATRE FORMATS (4 clics)

OBJECTIF — Calibrer les attentes par format.

DIRE — → « Les textes : très mature. Le risque, ce sont les faits inventés et le ton générique. » → « Les images : mature. Mais le texte dans l’image, les mains, les logos posent encore problème, et attention aux ressemblances. » → « La vidéo progresse très vite, mais la cohérence entre plans et le droit à l’image restent des sujets. » → « Les présentations : un bon premier jet, à reprendre dans votre charte. »

TRANSITION — « Concrètement, combien de temps peut-on gagner ? »`,
  `⏱ 4 min · SIMULATEUR DE GAIN (interactif)

OBJECTIF — Montrer que le gain est réel mais dépend du temps de relecture.

DIRE — « Prenons Ardente : 12 contenus par semaine, 45 minutes chacun. Si l’IA fait gagner la moitié du temps de premier jet et qu’on ajoute 10 minutes de relecture, on libère environ 20 heures par mois. » Puis pousser la relecture à 30 minutes : « Regardez : le gain fond. Si votre prompt est mauvais, vous passez votre temps à corriger. C’est pour ça que le module 2 est consacré au prompt. »

ANIMATION — Demander à un participant ses propres chiffres et les régler en direct.

TRANSITION — « Ce temps de relecture, il est indispensable. Voyons pourquoi. »`,
  `⏱ 5 min · LE POST PIÉGÉ (exercice, 6 clics)

OBJECTIF — Entraîner l’œil critique : repérer erreurs, risques juridiques et faiblesses de ton.

DIRE — « Ce post a été généré en trois secondes avec un prompt d’une ligne. Il y a six problèmes. Une minute, en binôme : trouvez-les. » Puis → pour chaque problème. 1 : « La formule passe-partout, signature d’un texte d’IA. » 2 : « “Neutre en carbone” : allégation très encadrée en France, et interdite dans l’UE lorsqu’elle repose sur la compensation carbone. » 3 : « Un chiffre sans source. » 4 : « Une citation inventée, et incohérente : Ardente a été fondée en 2016. » 5 : « Une promesse commerciale que personne n’a validée. » 6 : « Des hashtags génériques en anglais pour une cible B2B lyonnaise. »

INSISTER — Les problèmes 2, 4 et 5 ne sont pas des questions de style : ils engagent juridiquement la marque.

TRANSITION — « D’où nos six règles d’or. »`,
  `⏱ 3 min · SIX RÈGLES D’OR

OBJECTIF — Poser le cadre juridique et éthique, sans jargon.

DIRE — « Confidentialité : pas de données clients dans un outil grand public. Relecture humaine : systématique. Publicité loyale : la marque reste responsable de ce qu’elle publie, même si c’est l’IA qui l’a écrit. Droits : ne demandez pas “dans le style de” un illustrateur vivant ou une marque concurrente. Transparence : l’AI Act européen impose de signaler les images et vidéos réalistes générées ou manipulées par IA. Biais : l’IA reproduit les stéréotypes ; vos personas et vos visuels doivent être relus avec ce filtre. »

ANIMATION — Demander si l’entreprise des participants a une charte d’usage de l’IA. Si oui, elle prime.

TRANSITION — « Vérifions que c’est acquis : quiz flash. »`,
  `⏱ 4 min · QUIZ FLASH (5 questions)

OBJECTIF — Ancrer les notions du module.

DIRE — « Cinq affirmations, vote à main levée, puis on clique. » Après chaque réponse, lire l’explication. Insister sur la question 3 (données clients) : c’est l’erreur la plus fréquente et la plus grave.

ANIMATION — Le compteur de droite affiche les bonnes réponses du premier coup.

TRANSITION — « Je résume. »`,
  `⏱ 1 min · SYNTHÈSE M1

OBJECTIF — Clore le module et relier au carnet de campagne.

DIRE — « Cinq idées à retenir. » Les lire. « Dans votre bibliothèque de prompts, notez les six réflexes de vérification : faits, ton, promesses, droits, transparence, biais. Ils vous serviront toute la journée. »

TRANSITION — « Maintenant qu’on sait ce qu’est l’outil, apprenons à lui parler. Module 2 : stratégie et création d’idées. »`,
];
// @@NOTES-END
