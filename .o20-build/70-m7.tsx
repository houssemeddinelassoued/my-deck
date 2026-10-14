// ─── Module 7 · Créer des images, vidéos et contenus avec l’IA ──────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title="Créer des images, vidéos et contenus"
    sub="Du brief au visuel, du visuel à la vidéo : produire en une heure une mini-campagne qui demandait une semaine — en respectant les droits."
    dur="40 min"
    labs={<DefiBadge defi="campagne" />}
  >
    <SecItem n={1}>Adobe Firefly · créer et modifier des images</SecItem>
    <SecItem n={2}>Canva AI · la création graphique assistée</SecItem>
    <SecItem n={3}>Runway et CapCut AI · créer et monter des vidéos</SecItem>
    <SecItem n={4}>Droits, éthique et transparence</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Anatomie d’un prompt d’image (simulateur) ──────────────────────────────
const IMG_BRICKS: Brick[] = [
  { id: 'sub', label: 'Sujet', tone: 'blue', icon: 'target', hint: 'Quoi, qui, en train de faire quoi ?', text: 'Une tasse de café fumante sur un bureau en bois,' },
  { id: 'sty', label: 'Style', tone: 'violet', icon: 'palette', hint: 'Photo, illustration, aquarelle, 3D…', text: 'illustration flat, couleurs pastel,' },
  { id: 'cmp', label: 'Composition', tone: 'teal', icon: 'layers', hint: 'Cadrage, point de vue, espace libre.', text: 'tasse à gauche, espace libre à droite pour un titre,' },
  { id: 'lum', label: 'Lumière', tone: 'yellow', icon: 'bulb', hint: 'Ambiance, moment de la journée.', text: 'lumière chaude du matin,' },
  { id: 'fmt', label: 'Format', tone: 'pink', icon: 'image', hint: 'Où sera-t-elle publiée ?', text: 'format carré pour un post LinkedIn.' },
];

const M7Scene = ({ on }: { on: Record<string, boolean> }) => {
  const sq = !!on.fmt;
  const W = sq ? 440 : 760;
  const H = sq ? 440 : 428;
  const flat = !!on.sty;
  const warm = !!on.lum;
  const cx0 = on.cmp ? W * 0.3 : W * 0.5;
  const ty = H * 0.68;
  const cup = flat ? '#FFFFFF' : '#F2F2F2';
  const bgA = warm ? (flat ? '#FFE3C2' : '#FFD9A0') : flat ? '#E6F2F0' : '#D9DEE6';
  const bgB = warm ? (flat ? '#FFF5E6' : '#FFF1D6') : flat ? '#F7EEF5' : '#EEF1F6';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', borderRadius: 16, boxShadow: SHADOW, transition: 'all 400ms ease' }}>
      <defs>
        <radialGradient id={`${P}-m7bg`} cx="25%" cy="20%" r="90%">
          <stop offset="0%" stopColor={bgB} />
          <stop offset="100%" stopColor={bgA} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${P}-m7bg)`} />
      {warm ? <circle cx={W * 0.12} cy={H * 0.14} r={H * 0.09} fill={flat ? '#FFC98B' : '#FFE08A'} opacity={0.9} /> : null}
      {on.sub ? (
        <>
          <rect x={0} y={ty} width={W} height={H - ty} fill={flat ? '#F4C7A1' : '#9A6B47'} />
          {flat ? null : <rect x={0} y={ty} width={W} height={6} fill="#7A5236" />}
          <ellipse cx={cx0} cy={ty + 6} rx={78} ry={14} fill={flat ? '#E8B48C' : '#5E3E28'} opacity={0.6} />
          <path d={`M ${cx0 - 56} ${ty - 110} h 112 v 70 a 56 56 0 0 1 -112 0 z`} fill={cup} stroke={flat ? '#7FB8B0' : '#C9CED6'} strokeWidth={flat ? 5 : 3} />
          <path d={`M ${cx0 + 56} ${ty - 92} a 26 26 0 0 1 0 52`} fill="none" stroke={flat ? '#7FB8B0' : '#C9CED6'} strokeWidth={10} />
          <ellipse cx={cx0} cy={ty - 110} rx={56} ry={10} fill={flat ? '#B9785A' : '#4A2E1E'} />
          <g className={A.float}>
            <path d={`M ${cx0 - 18} ${ty - 130} q -14 -24 0 -46 q 14 -22 0 -44`} fill="none" stroke={flat ? '#C9D8F0' : '#FFFFFF'} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
            <path d={`M ${cx0 + 16} ${ty - 128} q -14 -24 0 -46 q 14 -22 0 -44`} fill="none" stroke={flat ? '#C9D8F0' : '#FFFFFF'} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
          </g>
        </>
      ) : (
        <text x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={40} fill="#A9B3C6">
          ? image au hasard ?
        </text>
      )}
      {on.cmp ? (
        <g>
          <rect x={W * 0.56} y={H * 0.18} width={W * 0.38} height={H * 0.36} rx={12} fill="none" stroke={C.teal} strokeWidth={3} strokeDasharray="10 8" />
          <text x={W * 0.75} y={H * 0.36} textAnchor="middle" dominantBaseline="middle" fontFamily="Open Sans, sans-serif" fontWeight={700} fontSize={20} fill={C.teal}>
            zone titre
          </text>
        </g>
      ) : null}
    </svg>
  );
};

const M7_ImgPrompt: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const n = IMG_BRICKS.filter((x) => on[x.id]).length;
  return (
    <Frame mod={7} kind="simu">
      <Title>Anatomie d’un prompt d’image</Title>
      <Lede>Cinq briques, comme pour le texte. Activez-les et regardez l’image se préciser.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 600, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {IMG_BRICKS.map((x) => (
          <div key={x.id} style={{ background: on[x.id] ? T[x.tone].bg : C.card, borderRadius: 16, boxShadow: on[x.id] ? `inset 0 0 0 2.5px ${STRONG[x.tone]}` : SHADOW_SM, padding: '14px 20px', transition: `all 250ms ${EASE}` }}>
            <Toggle on={!!on[x.id]} onChange={(v) => setOn((o) => ({ ...o, [x.id]: v }))} tone={x.tone} label={<strong style={{ fontFamily: display, fontSize: 26 }}>{x.label}</strong>} />
            <div style={{ marginTop: 4, marginLeft: 82, fontSize: 20, color: C.muted }}>{x.hint}</div>
          </div>
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 780, top: 260, width: 1020, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(150) }}>
        <M7Scene on={on} />
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 780, top: 770, width: 1020, minHeight: 110, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', fontSize: 21, lineHeight: 1.5, ...dl(300) }}>
        <span style={{ fontWeight: 700, color: C.muted, marginRight: 8 }}>Prompt ({n}/5) :</span>
        {n === 0 ? <span style={{ color: C.ink }}>Un café.</span> : null}
        {IMG_BRICKS.filter((x) => on[x.id]).map((x) => (
          <span key={x.id} style={{ background: T[x.tone].bg, boxShadow: `inset 0 -3px 0 ${STRONG[x.tone]}`, borderRadius: 5, padding: '0 5px', marginRight: 5 }}>
            {x.text}
          </span>
        ))}
      </div>
    </Frame>
  );
};

// ─── Outil 17 · Adobe Firefly ───────────────────────────────────────────────
const M7Var = ({ a, b: bb, label }: { a: string; b: string; label: string }) => (
  <div style={{ position: 'relative', height: 140, borderRadius: 12, background: `linear-gradient(135deg, ${a}, ${bb})`, overflow: 'hidden', boxShadow: SHADOW_SM }}>
    <div style={{ position: 'absolute', left: '18%', bottom: 0, width: '64%', height: '46%', borderRadius: '50% 50% 0 0', background: 'rgba(255,255,255,.35)' }} />
    <div style={{ position: 'absolute', left: '30%', bottom: '38%', width: 26, height: 26, borderRadius: 99, background: 'rgba(255,255,255,.6)' }} />
    <div style={{ position: 'absolute', left: '52%', bottom: '40%', width: 24, height: 24, borderRadius: 99, background: 'rgba(255,255,255,.6)' }} />
    <span style={{ position: 'absolute', left: 8, top: 6, fontSize: 14, fontWeight: 700, color: '#fff' }}>{label}</span>
  </div>
);

const M7_Firefly: Page = () => (
  <ToolPage
    mod={7}
    id="firefly"
    tone="coral"
    tagline="créer et modifier des images"
    feats={[
      ['image', 'Texte → image', 'Une description, quatre propositions, des réglages de style et de cadrage.'],
      ['wand', 'Remplissage génératif', 'Ajouter, retirer ou remplacer un élément dans une photo existante.'],
      ['layers', 'Extension d’image', 'Agrandir le cadre d’une photo pour l’adapter à une bannière.'],
      ['shieldCheck', 'Pensé pour l’usage professionnel', 'Modèles maison entraînés sur des contenus sous licence ou libres de droits.'],
    ]}
    exTitle="texte → image"
    prompt="Photo réaliste d’une équipe de quatre personnes en réunion dans un bureau lumineux, plantes vertes, ambiance chaleureuse, format 16:9."
    answer={
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <M7Var a="#5B8DEF" b="#9BD3AE" label="Variante 1" />
        <M7Var a="#F2A65A" b="#F7D9A8" label="Variante 2" />
        <M7Var a="#4E7D6B" b="#B6E0C8" label="Variante 3" />
        <M7Var a="#7A6FF0" b="#E3C8F5" label="Variante 4" />
      </div>
    }
    watch="Firefly propose aussi des modèles partenaires qui n’offrent pas les mêmes garanties : vérifiez lequel vous utilisez. Ni personne réelle, ni marque existante."
    tip="ajoutez une image de référence de style : tous les visuels d’une campagne garderont la même patte."
  />
);

// ─── Outil 18 · Canva AI (création graphique) ───────────────────────────────
const M7Fmt = ({ w, h, label, c }: { w: number; h: number; label: string; c: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{ width: w, height: h, borderRadius: 8, background: `linear-gradient(160deg, ${c}, #F3E8FF)`, boxShadow: SHADOW_SM, display: 'flex', alignItems: 'flex-end', padding: 6, boxSizing: 'border-box' }}>
      <div style={{ width: '70%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,.8)' }} />
    </div>
    <span style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}>{label}</span>
  </div>
);

const M7_Canva: Page = () => (
  <ToolPage
    mod={7}
    id="canva"
    tone="violet"
    tagline="la création graphique assistée"
    feats={[
      ['image', 'Génération d’images', 'Des illustrations et photos créées dans le design, au bon format.'],
      ['wand', 'Retouche magique', 'Gomme, détourage, arrière-plan supprimé, élément remplacé.'],
      ['layers', 'Une campagne, tous formats', 'Affiche, post, story, bannière : déclinés en un clic.'],
      ['video', 'Animation et vidéo', 'Animer un visuel, monter une courte vidéo avec des modèles.'],
    ]}
    exTitle="déclinaison de campagne"
    prompt="Décline mon affiche « Café IA » en post carré, story verticale, bannière intranet et vignette d’email."
    answer={
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, justifyContent: 'center', paddingTop: 8 }}>
        <M7Fmt w={120} h={170} label="Affiche A4" c="#7D2AE8" />
        <M7Fmt w={140} h={140} label="Post carré" c="#9B5DE5" />
        <M7Fmt w={96} h={170} label="Story" c="#B983FF" />
        <M7Fmt w={220} h={70} label="Bannière" c="#6A1BD1" />
      </div>
    }
    watch="Relisez chaque déclinaison : le texte peut être coupé ou mal placé. Et gardez la cohérence : même police, mêmes couleurs, mêmes images."
    tip="commencez par le format le plus contraint (la story verticale) : les autres se déclinent plus facilement."
  />
);

// ─── Outil 19 · Runway ──────────────────────────────────────────────────────
const M7Frame = ({ t, x }: { t: string; x: number }) => (
  <div style={{ flex: 1, height: 150, borderRadius: 10, background: 'linear-gradient(180deg, #2B2D42, #4A4E69)', position: 'relative', overflow: 'hidden', boxShadow: SHADOW_SM }}>
    <div style={{ position: 'absolute', left: `${x}%`, bottom: 18, width: 34, height: 90, borderRadius: '12px 12px 6px 6px', background: 'linear-gradient(180deg, #9BE29B, #2F855A)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: '#1B1C2B' }} />
    <span style={{ position: 'absolute', left: 8, top: 6, fontFamily: mono, fontSize: 13, color: '#E6EAF6' }}>{t}</span>
  </div>
);

const M7_Runway: Page = () => (
  <ToolPage
    mod={7}
    id="runway"
    tone="navy"
    tagline="la vidéo générée par IA"
    feats={[
      ['video', 'Texte ou image → vidéo', 'Des plans de quelques secondes générés à partir d’une description ou d’une image.'],
      ['pointer', 'Mouvements de caméra', 'Travelling, zoom, rotation : vous dirigez le plan.'],
      ['wand', 'Retouche vidéo', 'Retirer un objet, changer l’arrière-plan, créer un ralenti.'],
    ]}
    exTitle="image → vidéo"
    prompt="À partir de cette photo du produit, crée un plan de 5 secondes : travelling lent autour de la bouteille, lumière de studio."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <M7Frame t="0 s" x={30} />
          <M7Frame t="2 s" x={44} />
          <M7Frame t="5 s" x={58} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tag tone="grey" size={16}>Clip de 5 s</Tag>
          <Tag tone="grey" size={16}>Haute définition</Tag>
          <Tag tone="yellow" size={16}>Consomme des crédits</Tag>
        </div>
      </div>
    }
    watch="Clips courts, incohérences fréquentes (mains, texte, objets qui changent). Jamais le visage ou la voix d’une personne réelle : c’est un hypertrucage."
    tip="partez d’une image validée (Firefly ou Canva) plutôt que d’un texte : vous gardez le contrôle du rendu."
  />
);

// ─── Outil 20 · CapCut AI ───────────────────────────────────────────────────
const M7_CapCut: Page = () => (
  <ToolPage
    mod={7}
    id="capcut"
    tone="teal"
    tagline="le montage vidéo assisté"
    feats={[
      ['note', 'Sous-titres automatiques', 'Générés en quelques secondes, stylés, synchronisés.'],
      ['wand', 'Détourage et arrière-plan', 'Le sujet isolé sans fond vert.'],
      ['mic', 'Texte → voix', 'Une voix off synthétique pour une vidéo explicative.'],
      ['phone', 'Formats réseaux', 'Recadrage vertical, modèles, montage automatique.'],
    ]}
    exTitle="sous-titres automatiques"
    prompt="Ajoute des sous-titres automatiques à cette interview de 45 secondes et recadre-la en vertical."
    answer={
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ width: 150, height: 250, borderRadius: 20, background: 'linear-gradient(180deg, #334155, #0F172A)', position: 'relative', boxShadow: SHADOW, flex: 'none' }}>
          <div style={{ position: 'absolute', left: 45, top: 50, width: 60, height: 60, borderRadius: 99, background: '#94A3B8' }} />
          <div style={{ position: 'absolute', left: 30, top: 118, width: 90, height: 70, borderRadius: '40px 40px 0 0', background: '#94A3B8' }} />
          <div style={{ position: 'absolute', left: 10, right: 10, bottom: 26, background: 'rgba(0,0,0,.55)', borderRadius: 6, padding: '4px 6px', color: '#FFE066', fontSize: 14, fontWeight: 800, textAlign: 'center' }}>
            « On a gagné 3 heures par semaine »
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 19 }}>
          <M3Line icon="check" c={C.green}>87 sous-titres générés</M3Line>
          <M3Line icon="check" c={C.green}>Format 9:16 prêt à publier</M3Line>
          <M3Line icon="alert" c={C.amber}>2 noms propres mal orthographiés à corriger</M3Line>
        </div>
      </div>
    }
    watch="Lisez les conditions d’utilisation (droits accordés sur vos contenus) et la politique de votre entreprise. Musiques : souvent réservées à certains usages."
    tip="relisez les sous-titres : noms propres, chiffres et sigles sont les erreurs les plus fréquentes."
  />
);

// ─── Droits, éthique et transparence ────────────────────────────────────────
const M7Rule = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <IconTile name={icon} tone="coral" size={52} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 25, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Rights: Page = () => (
  <Frame mod={7} beats={5}>
    <Title>Images et vidéos IA : cinq règles avant de publier</Title>
    <Lede>Un visuel généré engage votre entreprise comme n’importe quelle publication.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <M7Rule n={1} icon="ticket" title="Vérifier la licence de l’outil">
        Usage commercial autorisé ? Avec quelle offre ? Chaque outil a ses conditions.
      </M7Rule>
      <M7Rule n={2} icon="user" title="Pas de personne réelle sans accord">
        Visage, voix, nom : imiter quelqu’un, c’est un hypertrucage (deepfake).
      </M7Rule>
      <M7Rule n={3} icon="x" title="Pas de marque ni d’œuvre d’autrui">
        Logos, personnages, « à la manière de » tel artiste : risque de contrefaçon.
      </M7Rule>
      <M7Rule n={4} icon="eye" title="Être transparent">
        Le règlement européen sur l’IA impose de signaler les contenus hypertruqués. Mentionnez « image générée par IA ».
      </M7Rule>
      <M7Rule n={5} icon="humanCheck" title="Relire comme un client">
        Mains à six doigts, texte déformé, détail absurde : un défaut ruine la crédibilité.
      </M7Rule>
    </div>
  </Frame>
);

// ─── Atelier 7 · mini-campagne ──────────────────────────────────────────────
const M7_Lab: Page = () => (
  <LabPage
    mod={7}
    n="7"
    title="Une mini-campagne à partir d’un même brief"
    defi="campagne"
    who="Groupes de 3 · un rôle par étape"
    minutes={25}
    tools={['chatgpt', 'firefly', 'canva', 'gamma', 'capcut', 'runway']}
    objective={
      <>
        À partir d’un même brief professionnel : <strong>brief → texte → visuel → présentation → courte vidéo</strong>, cohérents entre eux.
      </>
    }
    where={
      <>
        Un slogan et un texte d’annonce, un visuel (affiche ou post), 3 slides de présentation, une vidéo de 15 secondes. <strong>Une même charte</strong> pour tout.
      </>
    }
    crit={
      <>
        <CheckItem id="l7-c1" size={21}>Les 4 livrables existent</CheckItem>
        <CheckItem id="l7-c2" size={21}>Même message, mêmes couleurs partout</CheckItem>
        <CheckItem id="l7-c3" size={21}>Aucune personne ni marque réelle</CheckItem>
        <CheckItem id="l7-c4" size={21}>Mention « contenu généré par IA »</CheckItem>
      </>
    }
  >
    <div style={{ marginBottom: 10 }}>
      <strong style={{ color: C.navy }}>Le brief :</strong> lancer « <strong>Pause Verte</strong> », un service fictif de paniers de fruits bio livrés chaque semaine dans les entreprises de la ville.
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><strong style={{ color: C.navy }}>Rôle 1 · Plume :</strong> slogan et texte avec l’assistant.</div>
      <div><strong style={{ color: C.navy }}>Rôle 2 · Graphiste :</strong> visuel dans Firefly ou Canva, puis présentation Gamma.</div>
      <div><strong style={{ color: C.navy }}>Rôle 3 · Vidéaste :</strong> 15 secondes dans CapCut (ou un plan Runway).</div>
    </div>
  </LabPage>
);

const M7_LabSteps: Page = () => (
  <Frame mod={7} kind="lab" label="Atelier 7 · Les prompts de la chaîne">
    <Title size={46}>La chaîne de création, prompt par prompt</Title>
    <div style={{ position: 'absolute', left: 120, top: 180, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Step n={1} tone="blue" verb="Texte" ids={['chatgpt', 'claude']} d={100}>
        Tu es concepteur-rédacteur. Pour « Pause Verte » (paniers de fruits bio livrés au bureau), propose <Cs>5 slogans</Cs> de moins de 6 mots, puis un texte d’annonce de 60 mots pour LinkedIn. Ton frais, sans superlatifs.
      </M3Step>
      <M3Step n={2} tone="coral" verb="Visuel" ids={['firefly', 'canva']} d={200}>
        Illustration flat, couleurs vert tendre et orange, panier de fruits colorés sur un bureau moderne, <Cs>espace libre en haut pour le slogan</Cs>, format carré.
      </M3Step>
      <M3Step n={3} tone="pink" verb="Slides" ids={['gamma']} d={300}>
        3 slides pour présenter Pause Verte aux services RH : le problème, notre offre, comment commander. <Cs>Reprends le slogan et les couleurs du visuel.</Cs>
      </M3Step>
      <M3Step n={4} tone="navy" verb="Vidéo" ids={['capcut', 'runway']} d={400}>
        15 s verticales : visuel animé + slogan + voix off (texte → voix), <Cs>sous-titres automatiques</Cs>, mention « contenu généré par IA ».
      </M3Step>
    </div>
  </Frame>
);

// ─── Quiz M7 ────────────────────────────────────────────────────────────────
const M7_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz · Module 7</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous voulez retirer un objet gênant dans une photo existante. Quelle fonction ?" explain="Le remplissage génératif (Firefly, aussi intégré à Photoshop) ajoute, retire ou remplace un élément d’une image.">
        <QOpt>La traduction de documents</QOpt>
        <QOpt ok>Le remplissage génératif</QOpt>
        <QOpt>Le Consensus Meter</QOpt>
      </QuizQ>
      <QuizQ q="Quel outil sert d’abord à monter une vidéo avec sous-titres automatiques ?" explain="CapCut AI génère des sous-titres automatiques, recadre en vertical et propose des voix off synthétiques.">
        <QOpt ok>CapCut AI</QOpt>
        <QOpt>Elicit</QOpt>
        <QOpt>Grammarly</QOpt>
      </QuizQ>
      <QuizQ q="Pour une vidéo promotionnelle, faire parler un célèbre chef cuisinier grâce à l’IA est…" explain="Imiter le visage ou la voix d’une personne réelle sans accord est un hypertrucage : atteinte à ses droits et obligation de transparence.">
        <QOpt>une bonne idée si la vidéo est courte</QOpt>
        <QOpt>autorisé si on cite son nom</QOpt>
        <QOpt ok>interdit sans son accord : c’est un hypertrucage</QOpt>
      </QuizQ>
      <QuizQ q="Dans un prompt d’image, « espace libre à droite pour un titre » relève de…" explain="C’est la composition : cadrage, point de vue, placement des éléments et espaces réservés.">
        <QOpt>du style</QOpt>
        <QOpt ok>de la composition</QOpt>
        <QOpt>de la lumière</QOpt>
      </QuizQ>
      <QuizQ q="Pour garder le contrôle du rendu d’une vidéo Runway, le mieux est de partir…" explain="Partir d’une image validée donne beaucoup plus de contrôle qu’une description textuelle seule.">
        <QOpt>d’un texte très court</QOpt>
        <QOpt ok>d’une image déjà validée</QOpt>
        <QOpt>d’une musique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_ImgPrompt, M7_Firefly, M7_Canva, M7_Runway, M7_CapCut, M7_Rights, M7_Lab, M7_LabSteps, M7_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 7 · 16:00

OBJECTIF — Annoncer les outils n° 17 à 20 : images et vidéos.

DIRE — « Après la pause, on passe au visuel. Quatre outils : Adobe Firefly pour les images, Canva pour la création graphique, Runway pour générer des vidéos, CapCut pour les monter. Et un atelier pour produire une mini-campagne complète en vingt-cinq minutes. »

TRANSITION — « D’abord, comment parler à une IA d’image. »`,
  `⏱ 4 min · PROMPT D’IMAGE (simulateur)

OBJECTIF — Transposer les 5 briques du prompting à l’image : sujet, style, composition, lumière, format.

DIRE — « Demande de départ : “un café”. L’IA choisit tout au hasard. » Activer Sujet : « on sait ce qu’on veut voir. » Style : « illustration flat, pastel. » Composition : « la tasse à gauche, un espace pour le titre — c’est ce qui rend l’image utilisable. » Lumière : « l’ambiance. » Format : « carré pour LinkedIn. »

INSISTER — La composition est la brique la plus oubliée, et la plus utile pour un usage professionnel : on prévoit la place du texte.

TRANSITION — « Premier outil d’image : Adobe Firefly. »`,
  `⏱ 4 min · OUTIL 17 · ADOBE FIREFLY (2 clics)

OBJECTIF — Création et modification d’images.

DIRE — « Firefly, d’Adobe, génère des images à partir d’un texte, et surtout modifie des images existantes : remplissage génératif, extension du cadre. Son argument : ses modèles maison sont entraînés sur des contenus sous licence, pensés pour l’usage professionnel. » Clic 1 : « Quatre variantes. » Clic 2 : « Vigilance : Firefly donne aussi accès à des modèles partenaires, qui n’offrent pas les mêmes garanties. Et jamais de personne ni de marque réelle. »

TRANSITION — « Canva, cette fois côté création graphique. »`,
  `⏱ 3 min · OUTIL 18 · CANVA AI CRÉATION (2 clics)

OBJECTIF — Création graphique assistée par IA.

DIRE — « On a vu Canva pour mettre en page. Ici, son atelier graphique : génération d’images, retouche magique, et la déclinaison d’une campagne dans tous les formats. » Clic 1 : « Une affiche devient post, story, bannière. » Clic 2 : « On relit chaque déclinaison : un texte coupé arrive vite. »

TRANSITION — « Passons à la vidéo : Runway. »`,
  `⏱ 4 min · OUTIL 19 · RUNWAY (2 clics)

OBJECTIF — Création et modification de vidéos.

DIRE — « Runway génère des plans vidéo de quelques secondes à partir d’un texte ou d’une image, avec des mouvements de caméra. Il retouche aussi des vidéos existantes. » Clic 1 : « Une photo produit devient un travelling de cinq secondes. » Clic 2 : « Vigilance : clips courts, incohérences fréquentes, crédits. Et une ligne rouge : jamais le visage ou la voix d’une personne réelle. »

TRANSITION — « Pour monter le tout : CapCut. »`,
  `⏱ 3 min · OUTIL 20 · CAPCUT AI (2 clics)

OBJECTIF — Montage et création de contenus vidéo.

DIRE — « CapCut est l’outil de montage des réseaux sociaux. Ses fonctions IA : sous-titres automatiques, détourage, voix off, recadrage vertical. » Clic 1 : « 87 sous-titres en quelques secondes… dont deux noms propres à corriger. » Clic 2 : « Vigilance : lisez les conditions d’utilisation et la politique de votre entreprise ; certaines interdisent CapCut. Musiques : droits limités. »

TRANSITION — « Avant de créer : les règles. »`,
  `⏱ 4 min · CINQ RÈGLES (5 clics)

OBJECTIF — Droits, éthique et transparence des contenus générés.

DIRE — Clic par clic : « La licence de l’outil. Pas de personne réelle. Pas de marque ni d’œuvre d’autrui — le “à la manière de” tel artiste vivant est risqué. La transparence : le règlement européen sur l’IA impose de signaler les hypertrucages ; mentionnez “généré par IA”. Et relire comme un client. »

INSISTER — Ces règles valent pour l’atelier : la mention « contenu généré par IA » fait partie des critères.

TRANSITION — « À vous : la mini-campagne. »`,
  `⏱ 25 min · ATELIER 7 · MINI-CAMPAGNE (minuteur)

OBJECTIF — Brief → texte → visuel → présentation → courte vidéo.

DIRE — « Le brief : lancer Pause Verte, des paniers de fruits bio livrés dans les entreprises. Trois rôles : la plume écrit, le graphiste fait le visuel puis les slides, le vidéaste monte quinze secondes. L’enjeu : la cohérence. Même message, mêmes couleurs. »

ANIMATION — Lancer le minuteur. Restitution en mode « pitch » : chaque groupe montre sa campagne en 1 minute. Faire voter la plus cohérente.

TRANSITION — « Les prompts de la chaîne. »`,
  `⏱ (support de l’atelier 7) · LES PROMPTS

OBJECTIF — Donner un prompt de départ par étape.

DIRE — « Quatre prompts. Remarquez comme chacun reprend un élément du précédent : le slogan, les couleurs, l’espace pour le texte. C’est ce qui crée la cohérence d’une campagne. »

TRANSITION — « Quiz du module 7. »`,
  `⏱ 4 min · QUIZ MODULE 7

OBJECTIF — Vérifier : remplissage génératif, CapCut, hypertrucage, composition, contrôle du rendu vidéo.

DIRE — « Cinq questions. »

TRANSITION — « Dernier module : faire travailler l’IA toute seule, et le faire de façon responsable. »`,
];
// @@NOTES-END
