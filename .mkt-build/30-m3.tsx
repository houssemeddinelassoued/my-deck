// ─── Module 3 · Création de contenus avec l’IA ──────────────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Création de contenus
        <br />
        avec l’IA
      </>
    }
    sub="Articles, posts, newsletters, emails, pages web, slogans, scripts : une méthode commune, des codes propres à chaque format."
    dur="11:25 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · une idée, plusieurs contenus
      </Tag>
    }
  >
    <SecItem n={1}>Le cycle de création : brief, jet, critique, réécriture, validation</SecItem>
    <SecItem n={2}>Article, post LinkedIn, publications réseaux sociaux</SecItem>
    <SecItem n={3}>Newsletter, email, page web</SecItem>
    <SecItem n={4}>Slogans et scripts vidéo</SecItem>
    <SecItem n={5}>Trouver le ton juste et relire comme un éditeur</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Le cycle de création ───────────────────────────────────────────────────
const M3Step = ({ n, icon, tone, title, who, children }: { n: number; icon: IconName; tone: Tone; title: string; who: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 300, height: 270, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[tone]}`, padding: '22px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <Tag tone={who === 'IA' ? 'violet' : who === 'Vous' ? 'green' : 'blue'} size={18}>
        {who}
      </Tag>
    </div>
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>
      {n}. {title}
    </div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);
const M3Gap = ({ n }: { n: number }) => (
  <div className={b.fade(n)} style={{ width: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <FlowArrow w={40} color={C.faint} />
  </div>
);

const M3_Cycle: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Le cycle de création : l’IA écrit, vous dirigez</Title>
    <Lede>Le même cycle pour tous les formats. Le gain vient de la boucle critique → réécriture, pas du premier jet.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, display: 'flex' }}>
      <M3Step n={1} icon="note" tone="navy" title="Brief" who="Vous">
        Six ingrédients + la charte de ton.
      </M3Step>
      <M3Gap n={2} />
      <M3Step n={2} icon="sparkles" tone="violet" title="Premier jet" who="IA">
        Deux ou trois variantes, jamais une seule.
      </M3Step>
      <M3Gap n={3} />
      <M3Step n={3} icon="search" tone="blue" title="Critique" who="IA + vous">
        Faites-la relire avec une grille : cible, clarté, preuve, appel à l’action.
      </M3Step>
      <M3Gap n={4} />
      <M3Step n={4} icon="pen" tone="teal" title="Réécriture" who="IA">
        Consignes précises : « plus court », « plus concret », « sans jargon ».
      </M3Step>
      <M3Gap n={5} />
      <M3Step n={5} icon="humanCheck" tone="green" title="Validation" who="Vous">
        Faits, ton, promesses, droits. C’est votre signature.
      </M3Step>
    </div>
    <svg width={1920} height={200} style={{ position: 'absolute', left: 0, top: 560, pointerEvents: 'none' }} aria-hidden>
      <path d="M 1305 30 Q 960 170 615 30" fill="none" stroke={C.violet} strokeWidth={4} strokeDasharray="10 12" className={cx(A.march, b.fade(6))} />
      <polygon points="615,30 640,40 630,58" fill={C.violet} className={b.fade(6)} />
      <text x={960} y={128} textAnchor="middle" className={b.fade(6)} style={{ fontFamily: display, fontWeight: 700, fontSize: 24, fill: C.violet }}>
        on boucle 2 ou 3 fois
      </text>
    </svg>
    <Callout title="Le prompt de critique, à garder" tone="violet" icon="sparkles" cls={b.on(6)} style={{ position: 'absolute', left: 120, top: 780, width: 1680 }} size={24}>
      « Relis ce texte comme une directrice marketing exigeante. Note-le sur 10 pour la cible, la clarté, la preuve et l’appel à l’action. Puis réécris-le pour obtenir 9/10. »
    </Callout>
  </Frame>
);

// ─── Article de blog (onglets) ──────────────────────────────────────────────
const M3H = ({ lvl, children }: { lvl: 1 | 2; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingLeft: lvl === 2 ? 40 : 0 }}>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 19, fontWeight: 700, color: lvl === 1 ? C.electric : C.violet }}>H{lvl}</span>
    <span style={{ fontSize: lvl === 1 ? 27 : 24, fontWeight: lvl === 1 ? 700 : 500, color: C.ink }}>{children}</span>
  </div>
);

const M3_Article: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Un article de blog : du plan à l’introduction</Title>
    <Tabs initial="prompt">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 192, display: 'flex', gap: 12 }}>
        <TabBtn id="prompt" icon="chat" tone="navy">
          1 · Le prompt
        </TabBtn>
        <TabBtn id="plan" icon="layers" tone="blue">
          2 · Le plan
        </TabBtn>
        <TabBtn id="intro" icon="pen" tone="violet">
          3 · L’introduction
        </TabBtn>
        <TabBtn id="seo" icon="search" tone="green">
          4 · Le référencement
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
        <TabPane id="prompt">
          <PromptBox title="prompt · article" size={23}>
            Tu es rédacteur web spécialisé en qualité de vie au travail. Rédige le <Cf>plan détaillé</Cf> d’un article de blog pour Ardente.
            {'\n\n'}Sujet : la pause café, rituel d’équipe. Cible : office managers de PME. Objectif : faire découvrir Ardente Bureau sans discours commercial.
            {'\n\n'}Format : titre H1 de moins de 60 caractères, 5 parties H2, une FAQ de 3 questions. Pour chaque partie : idée clé et exemple concret.
            {'\n\n'}<Cn>Ne cite aucun chiffre sans me signaler qu’il faut le sourcer.</Cn>
          </PromptBox>
        </TabPane>
        <TabPane id="plan">
          <div style={{ display: 'flex', gap: 30 }}>
            <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <M3H lvl={1}>La pause café : 5 façons d’en faire un vrai rituel d’équipe</M3H>
              <M3H lvl={2}>Pourquoi la pause café compte plus qu’on ne le croit</M3H>
              <M3H lvl={2}>Un bon café, un lieu accueillant : les deux ingrédients</M3H>
              <M3H lvl={2}>Instaurer des moments partagés (sans les imposer)</M3H>
              <M3H lvl={2}>Impliquer les équipes dans le choix des cafés</M3H>
              <M3H lvl={2}>Concilier qualité, budget et responsabilité</M3H>
              <M3H lvl={2}>FAQ : budget, entretien, engagement</M3H>
            </div>
            <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Callout title="Bien" tone="green" icon="check" size={23}>
                Structure claire, angle utile pour la cible, l’offre n’apparaît qu’en fin d’article.
              </Callout>
              <Callout title="À vérifier" tone="coral" icon="alert" size={23}>
                La partie 1 appellera des chiffres : trouvez une vraie étude, ou supprimez-les.
              </Callout>
            </div>
          </div>
        </TabPane>
        <TabPane id="intro">
          <div style={{ display: 'flex', gap: 30 }}>
            <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '28px 34px', fontSize: 26, lineHeight: 1.55, color: C.ink }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy, marginBottom: 14 }}>La pause café : 5 façons d’en faire un vrai rituel d’équipe</div>
              Dix heures. Quelqu’un se lève, propose un café, et la conversation qui bloquait en réunion se dénoue en trois minutes devant la machine. La pause café n’est pas du temps perdu : c’est souvent là que l’équipe se
              retrouve. Encore faut-il lui donner un peu d’attention…
            </div>
            <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Callout title="Technique" tone="violet" icon="sparkles" size={23}>
                Demandez trois introductions : une scène, une question, un constat. Gardez la meilleure.
              </Callout>
              <Callout title="Votre touche" tone="blue" icon="pen" size={23}>
                Ajoutez une anecdote vraie de l’entreprise : c’est ce que l’IA ne peut pas inventer.
              </Callout>
            </div>
          </div>
        </TabPane>
        <TabPane id="seo">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <Card tone="green" icon="search" title="Mots-clés" size={23}>
              « Proposez 10 requêtes que tape un office manager qui cherche une solution café. » Puis vérifiez-les dans un outil SEO.
            </Card>
            <Card tone="blue" icon="type" title="Méta-description" size={23}>
              « Écris 3 méta-descriptions de 150 caractères, avec le mot-clé et un bénéfice. »
            </Card>
            <Card tone="violet" icon="image" title="Textes alternatifs" size={23}>
              « Rédige le texte alternatif de chaque image » : référencement et accessibilité d’un coup.
            </Card>
          </div>
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Post LinkedIn (choix de l’accroche) ────────────────────────────────────
const M3_HOOKS = {
  q: 'Votre machine à café fait-elle fuir vos équipes ?',
  c: '3 minutes. C’est le temps qu’il a fallu pour débloquer notre réunion de lundi.',
  a: 'Mardi, une cliente nous a dit : « Depuis votre café, les équipes reviennent au bureau. »',
};

const M3Hook = ({ id, label, set, cur, tone }: { id: keyof typeof M3_HOOKS; label: string; set: (h: keyof typeof M3_HOOKS) => void; cur: string; tone: Tone }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(id);
    }}
    style={{
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      borderRadius: 14,
      padding: '14px 20px',
      fontFamily: body,
      fontSize: 23,
      lineHeight: 1.35,
      color: C.ink,
      background: cur === id ? T[tone].bg : C.card,
      boxShadow: cur === id ? `inset 0 0 0 3px ${STRONG[tone]}` : `inset 0 0 0 1.5px ${C.rule}`,
      transition: `all 200ms ${EASE}`,
    }}
  >
    <strong style={{ color: STRONG[tone] }}>{label}</strong>
    <br />
    {M3_HOOKS[id]}
  </button>
);

const M3_LinkedIn: Page = () => {
  const [h, setH] = useState<keyof typeof M3_HOOKS>('q');
  return (
    <Frame mod={3} kind="exercice">
      <Title>Un post LinkedIn : tout se joue avant « … voir plus »</Title>
      <Lede>Deux lignes visibles, environ 200 caractères. Choisissez l’accroche, regardez l’effet.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <Eyebrow c={C.navy} size={20}>
          Trois accroches générées
        </Eyebrow>
        <M3Hook id="q" label="La question" set={setH} cur={h} tone="blue" />
        <M3Hook id="c" label="Le chiffre concret" set={setH} cur={h} tone="violet" />
        <M3Hook id="a" label="L’anecdote client" set={setH} cur={h} tone="green" />
        <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.4, color: C.muted }}>L’anecdote doit être vraie, et le client d’accord pour être cité.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 740, top: 270, ...dl(200) }}>
        <SocialPost w={620} size={22}>
          <span key={h} className={A.fade} style={{ fontWeight: 700, animationDuration: '400ms' } as CSSProperties}>
            {M3_HOOKS[h]}
          </span>
          {'\n'}
          <span style={{ color: C.muted }}>
            La pause café, c’est souvent là que l’équipe se retrouve… <strong style={{ color: C.soft }}>voir plus</strong>
          </span>
          {'\n\n'}
          <span style={{ opacity: 0.35 }}>
            Avec Ardente Bureau, nous installons un café de spécialité torréfié à Lyon dans vos locaux.{'\n'}→ Dégustation gratuite pour votre équipe en novembre.{'\n'}#QVT #Lyon #Café
          </span>
        </SocialPost>
      </div>
      <div style={{ position: 'absolute', left: 1420, top: 270, width: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(300)}>
          Anatomie
        </Eyebrow>
        <Card tone="blue" title="Accroche" bar={false} pad={18} size={21} cls={A.right} style={dl(350)}>
          Moins de 15 mots, une tension.
        </Card>
        <Card tone="violet" title="Corps aéré" bar={false} pad={18} size={21} cls={A.right} style={dl(450)}>
          Lignes courtes, une idée par ligne.
        </Card>
        <Card tone="green" title="Preuve" bar={false} pad={18} size={21} cls={A.right} style={dl(550)}>
          Un fait, un client, un chiffre sourcé.
        </Card>
        <Card tone="yellow" title="Appel à l’action" bar={false} pad={18} size={21} cls={A.right} style={dl(650)}>
          Un seul, clair. Et 3 hashtags max.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Instagram et autres réseaux ────────────────────────────────────────────
const M3Net = ({ icon, tone, name, children, d }: { icon: IconName; tone: Tone; name: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} solid />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Social: Page = () => (
  <Frame mod={3}>
    <Title>Réseaux sociaux : chaque réseau a sa grammaire</Title>
    <Phone w={330} cls={A.in} style={{ position: 'absolute', left: 140, top: 210, ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 14px 10px' }}>
        <BrandDot size={34} />
        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>ardente.cafe</span>
      </div>
      <CupArt w={307} h={307} bubble />
      <div style={{ padding: '10px 14px', fontSize: 15, lineHeight: 1.45, color: C.ink }}>
        <strong>ardente.cafe</strong> Le café du lundi a un super-pouvoir : il remet l’équipe en route ☕{'\n'}
        <br />
        Et chez vous, c’est qui le premier à la machine ? 👇
        <br />
        <span style={{ color: C.blue }}>#cafedespecialite #lyon #bureau #torrefaction</span>
      </div>
    </Phone>
    <div style={{ position: 'absolute', left: 560, top: 210, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(200)}>
        Une légende Instagram en 3 temps
      </Eyebrow>
      <Card tone="pink" icon="eye" title="1 · Le visuel d’abord" cls={A.in} style={dl(250)} size={22}>
        On regarde avant de lire : la légende complète l’image, elle ne la décrit pas.
      </Card>
      <Card tone="violet" icon="chat" title="2 · Une phrase qui engage" cls={A.in} style={dl(350)} size={22}>
        Une question simple, à laquelle on a envie de répondre.
      </Card>
      <Card tone="blue" icon="hash" title="3 · Des hashtags de niche" cls={A.in} style={dl(450)} size={22}>
        Quelques-uns, précis, en français pour une cible locale.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 210, width: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(300)}>
        Demandez des variantes par réseau
      </Eyebrow>
      <M3Net icon="insta" tone="pink" name="Instagram" d={400}>
        Émotion, coulisses, carrousels éducatifs, stories interactives.
      </M3Net>
      <M3Net icon="users" tone="blue" name="Facebook" d={500}>
        Communauté locale, événements, ton convivial.
      </M3Net>
      <M3Net icon="video" tone="coral" name="TikTok & Reels" d={600}>
        Une accroche dans les 2 premières secondes, sous-titres obligatoires.
      </M3Net>
      <M3Net icon="chat" tone="teal" name="Threads, X, Bluesky" d={700}>
        Phrases courtes, avis tranché, conversation.
      </M3Net>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 560, top: 905, ...dl(900) }}>
      Prompt : « Adapte ce message à Instagram, Facebook et TikTok en respectant les codes de chaque réseau. »
    </Hint>
  </Frame>
);

// ─── Newsletter (anatomie) ──────────────────────────────────────────────────
const M3NlBlock = ({ beat, h, tone, label, children }: { beat: number; h: number; tone: Tone; label: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ position: 'relative', height: h, boxSizing: 'border-box', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '10px 18px', fontSize: 20, lineHeight: 1.35, color: C.ink }}>
    {children}
    <span style={{ position: 'absolute', right: -250, top: '50%', transform: 'translateY(-50%)', width: 230, fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.06em', textTransform: 'uppercase', color: T[tone].fg }}>
      ← {label}
    </span>
  </div>
);

const M3_Newsletter: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Une newsletter : un objectif, un appel à l’action</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 700, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(100) }}>
      <M3NlBlock beat={1} h={64} tone="navy" label="Objet + pré-en-tête">
        <strong>La pause qui compte arrive au bureau</strong> · Dégustation offerte en novembre
      </M3NlBlock>
      <M3NlBlock beat={2} h={96} tone="violet" label="Accroche">
        Bonjour Claire, dix heures : la machine du bureau vous fait encore grimacer ? On a peut-être la solution.
      </M3NlBlock>
      <M3NlBlock beat={3} h={150} tone="blue" label="1 idée principale">
        <strong>Ardente Bureau</strong> : café de spécialité torréfié à Lyon, machine installée en une semaine, sans engagement.
        <div style={{ marginTop: 8 }}>
          <CupArt w={160} h={60} />
        </div>
      </M3NlBlock>
      <M3NlBlock beat={4} h={90} tone="teal" label="Preuve">
        « Les équipes votent chaque mois pour le café du mois. » — Office manager, PME lyonnaise (avec son accord)
      </M3NlBlock>
      <M3NlBlock beat={5} h={64} tone="green" label="Un seul bouton">
        <span style={{ display: 'inline-block', background: C.green, color: '#fff', fontWeight: 700, borderRadius: 8, padding: '4px 16px' }}>Réserver ma dégustation</span>
      </M3NlBlock>
      <M3NlBlock beat={6} h={54} tone="grey" label="Pied de page légal">
        Se désinscrire · Mentions légales · Données personnelles
      </M3NlBlock>
    </div>
    <PromptBox title="prompt · newsletter" size={20} cls={A.right} style={{ position: 'absolute', left: 1120, top: 190, width: 680, ...dl(300) }}>
      Rédige la newsletter de lancement d’Ardente Bureau pour nos clients B2B.
      {'\n'}Objectif <Cf>unique</Cf> : réserver une dégustation.
      {'\n'}Structure : objet (moins de 45 caractères) + pré-en-tête, accroche personnalisée avec {'{{prénom}}'}, une idée principale, une preuve, un seul bouton.
      {'\n'}Longueur : 150 mots. Ton : notre charte (ci-dessus).
      {'\n'}Propose 3 objets différents.
    </PromptBox>
    <Callout title="RGPD" tone="coral" icon="lock" cls={A.fade} style={{ position: 'absolute', left: 1120, top: 690, width: 680, ...dl(600) }} size={22}>
      Envoi aux seuls contacts qui ont consenti, lien de désinscription obligatoire. L’IA rédige ; votre outil d’emailing gère les données.
    </Callout>
  </Frame>
);

// ─── Emails : le testeur d’objets ───────────────────────────────────────────
const M3_SUBJECTS = [
  { id: 'a', t: 'Newsletter Ardente – Novembre – Numéro 47', score: 2, len: false, ben: false, perso: false, spam: true, why: 'Aucun bénéfice, et la fin est coupée sur mobile.' },
  { id: 'b', t: 'Votre équipe mérite mieux que ce café 😬', score: 7, len: true, ben: true, perso: false, spam: true, why: 'Curiosité et émotion. Un peu négatif : à tester.' },
  { id: 'c', t: 'Claire, une dégustation offerte pour l’équipe ?', score: 9, len: true, ben: true, perso: true, spam: true, why: 'Personnalisé, bénéfice clair, question : le meilleur.' },
  { id: 'd', t: 'GRATUIT !!! OFFRE EXCEPTIONNELLE CAFÉ 100 % OFFERT', score: 1, len: false, ben: true, perso: false, spam: false, why: 'Majuscules et mots « spam » : direction les indésirables.' },
];
const M3Crit = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink }}>
    <span style={{ width: 34, height: 34, borderRadius: 99, background: ok ? C.green : C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 300ms' }}>
      <Icon name={ok ? 'check' : 'x'} size={20} color="#fff" sw={3} />
    </span>
    {children}
  </div>
);
const M3Mail = ({ from, subj, hot = false }: { from: string; subj: string; hot?: boolean }) => (
  <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.rule}`, background: hot ? T.blue.bg : '#fff' }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{from}</div>
    <div style={{ fontSize: 15, color: hot ? C.ink : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subj}</div>
  </div>
);

const M3_Email: Page = () => {
  const [i, setI] = useState(0);
  const s = M3_SUBJECTS[i];
  return (
    <Frame mod={3} kind="simu">
      <Title>Un email : l’objet décide de tout</Title>
      <Lede>Quatre objets générés. Cliquez pour les tester dans une boîte de réception mobile.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <M3SubjBtn n={0} cur={i} set={setI} />
        <M3SubjBtn n={1} cur={i} set={setI} />
        <M3SubjBtn n={2} cur={i} set={setI} />
        <M3SubjBtn n={3} cur={i} set={setI} />
      </div>
      <Phone w={300} cls={A.in} style={{ position: 'absolute', left: 940, top: 240, ...dl(200) }}>
        <div style={{ padding: '40px 14px 10px', fontFamily: display, fontWeight: 800, fontSize: 22, color: C.ink }}>Boîte de réception</div>
        <M3Mail from="Service RH" subj="Planning des congés de fin d’année" />
        <M3Mail from="Ardente" subj={s.t} hot />
        <M3Mail from="Fournisseur papeterie" subj="Votre commande est expédiée" />
        <M3Mail from="Équipe IT" subj="Maintenance prévue ce soir à 20 h" />
      </Phone>
      <div key={i} className={A.right} style={{ position: 'absolute', left: 1300, top: 270, width: 500, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', animationDuration: '400ms', ...dl(0) } as CSSProperties}>
        <Eyebrow c={C.muted} size={19}>
          Score indicatif
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: s.score >= 7 ? C.green : s.score >= 4 ? C.amber : C.coral }}>
          {s.score}
          <span style={{ fontSize: 36, color: C.faint }}> / 10</span>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M3Crit ok={s.len}>Lisible en entier sur mobile</M3Crit>
          <M3Crit ok={s.ben}>Bénéfice clair</M3Crit>
          <M3Crit ok={s.perso}>Personnalisé</M3Crit>
          <M3Crit ok={s.spam}>Sans risque « spam »</M3Crit>
        </div>
        <div style={{ marginTop: 18, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{s.why}</div>
      </div>
      <Callout title="Méthode" tone="blue" icon="flask" cls={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 760, ...dl(500) }} size={22}>
        Faites générer 10 objets, gardez-en 2, et laissez un <strong>test A/B</strong> trancher.
      </Callout>
    </Frame>
  );
};
const M3SubjBtn = ({ n, cur, set }: { n: number; cur: number; set: (n: number) => void }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(n);
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      borderRadius: 14,
      padding: '16px 20px',
      fontFamily: body,
      fontSize: 24,
      color: C.ink,
      background: cur === n ? T.blue.bg : C.card,
      boxShadow: cur === n ? `inset 0 0 0 3px ${C.blue}` : `inset 0 0 0 1.5px ${C.rule}`,
    }}
  >
    <Num n={LETTERS[n]} tone={cur === n ? 'blue' : 'grey'} size={44} />
    {M3_SUBJECTS[n].t}
  </button>
);

// ─── Page web (wireframe) ───────────────────────────────────────────────────
const M3Wire = ({ beat, h, tone, label, children }: { beat: number; h: number; tone: Tone; label: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
    <div style={{ flex: 1, height: h, boxSizing: 'border-box', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '12px 20px', fontSize: 21, lineHeight: 1.35, color: C.ink }}>{children}</div>
    <div style={{ width: 300, display: 'flex', alignItems: 'center', fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.06em', textTransform: 'uppercase', color: T[tone].fg }}>← {label}</div>
  </div>
);

const M3_PageWeb: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Une page web : la structure avant les mots</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1060, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: C.panel }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FF5F57' }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FEBC2E' }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: '#28C840' }} />
        <span style={{ marginLeft: 12, fontFamily: mono, fontSize: 17, color: C.muted }}>ardente · /bureau</span>
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M3Wire beat={1} h={120} tone="navy" label="Attention · promesse">
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Le café de spécialité, installé dans votre entreprise</div>
          Torréfié à Lyon · installé en une semaine · sans engagement
        </M3Wire>
        <M3Wire beat={2} h={90} tone="blue" label="Intérêt · bénéfices">
          Des équipes qui se retrouvent · zéro gestion pour vous · un café qui a du sens
        </M3Wire>
        <M3Wire beat={3} h={90} tone="teal" label="Preuve · confiance">
          Témoignages clients réels · producteurs partenaires · ce qui est inclus
        </M3Wire>
        <M3Wire beat={4} h={90} tone="violet" label="Désir · objections">
          FAQ : combien ça coûte ? qui entretient la machine ? et si on arrête ?
        </M3Wire>
        <M3Wire beat={5} h={70} tone="green" label="Action">
          <span style={{ display: 'inline-block', background: C.green, color: '#fff', fontWeight: 700, borderRadius: 8, padding: '4px 16px' }}>Réserver ma dégustation gratuite</span>
        </M3Wire>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox title="prompt · page web" size={19} cls={A.right} style={dl(300)}>
        Propose la structure d’une page d’atterrissage pour Ardente Bureau selon le modèle <Cf>AIDA</Cf>. Pour chaque bloc : titre, texte de 30 mots maximum, élément visuel suggéré. Liste aussi les 5 objections probables d’un office manager.
      </PromptBox>
      <Card tone="green" icon="search" title="Bonus référencement" cls={A.right} style={dl(450)} size={21}>
        Balise titre, méta-description, textes alternatifs, FAQ : à demander dans la foulée.
      </Card>
      <Card tone="coral" icon="scale" title="Mentions obligatoires" cls={A.right} style={dl(600)} size={21}>
        Prix, conditions, mentions légales : jamais inventés par l’IA, toujours fournis par vous.
      </Card>
    </div>
  </Frame>
);

// ─── La machine à slogans ───────────────────────────────────────────────────
const M3_SLOGANS: { t: string; note: string; ok: boolean }[] = [
  { t: 'La pause qui compte.', note: 'Court, rythmé, porte la promesse.', ok: true },
  { t: 'Le bon café ne fait pas de bruit. Il fait parler.', note: 'Une signature de marque, réutilisable partout.', ok: true },
  { t: 'Faites infuser vos idées.', note: 'Piège : on infuse du thé, pas du café. L’IA ne vérifie pas le sens.', ok: false },
  { t: 'Votre équipe a du goût.', note: 'Valorise la cible, jeu de mots léger.', ok: true },
  { t: 'Le meilleur café de France.', note: 'Allégation invérifiable : interdit sans preuve.', ok: false },
  { t: 'Torréfié à Lyon, savouré au bureau.', note: 'Ancrage local + bénéfice : solide pour du B2B.', ok: true },
  { t: 'Du grain à moudre pour vos équipes.', note: 'Expression connue, déjà très utilisée : vérifier l’antériorité.', ok: false },
  { t: 'Le café qui réunit.', note: 'Simple, sincère, un peu générique.', ok: true },
];

const M3_Slogans: Page = () => {
  const [i, setI] = useState(0);
  const [keep, setKeep] = useState<number[]>([]);
  const s = M3_SLOGANS[i];
  return (
    <Frame mod={3} kind="simu">
      <Title>Des slogans : générer large, choisir avec des critères</Title>
      <Lede>Huit propositions de l’IA pour Ardente Bureau. Faites défiler, gardez vos favoris, et méfiez-vous des pièges.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1060, height: 300, boxSizing: 'border-box', background: G.navy, borderRadius: 24, boxShadow: SHADOW, padding: '44px 56px', color: '#fff', ...dl(100) }}>
        <Eyebrow c="#C9B6FF" size={20}>
          Proposition {i + 1} / {M3_SLOGANS.length}
        </Eyebrow>
        <div key={i} className={A.in} style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 54, lineHeight: 1.12, animationDuration: '500ms' } as CSSProperties}>
          {s.t}
        </div>
      </div>
      <div key={`n${i}`} className={A.fade} style={{ position: 'absolute', left: 120, top: 620, width: 1060, boxSizing: 'border-box', display: 'flex', gap: 14, alignItems: 'center', background: s.ok ? T.green.bg : T.coral.bg, borderRadius: 14, padding: '16px 22px', fontSize: 24, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
        <Icon name={s.ok ? 'check' : 'alert'} size={30} color={s.ok ? T.green.fg : T.coral.fg} />
        {s.note}
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 730, display: 'flex', gap: 14, ...dl(200) }}>
        <Btn icon="arrow" tone="violet" size={24} onClick={() => setI((x) => (x + 1) % M3_SLOGANS.length)}>
          Suivant
        </Btn>
        <Btn icon="star" ghost tone="green" size={24} onClick={() => setKeep((k) => (k.includes(i) ? k : [...k, i].slice(-3)))}>
          Je garde
        </Btn>
        <Btn icon="reset" ghost tone="grey" size={24} onClick={() => setKeep([])} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1240, top: 280, width: 560, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(300) }}>
        <Eyebrow c={C.navy} size={20}>
          Mes 3 favoris
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 170 }}>
          {keep.length === 0 ? <div style={{ fontSize: 22, color: C.faint }}>Cliquez « Je garde »…</div> : null}
          {keep.map((x) => (
            <div key={x} className={A.left} style={{ fontSize: 24, fontWeight: 600, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
              ★ {M3_SLOGANS[x].t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 16, borderTop: `1.5px solid ${C.rule}` }}>
          <Eyebrow c={C.muted} size={18}>
            Grille de choix
          </Eyebrow>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 21, color: C.soft }}>
            <span>Court · rythmé · mémorisable</span>
            <span>Porte un bénéfice ou une promesse</span>
            <span>Vrai, vérifiable, sans superlatif</span>
            <span>Disponible : recherche d’antériorité (INPI)</span>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Script vidéo (storyboard) ──────────────────────────────────────────────
const M3Shot = ({ beat, t, tone, img, vo, txt }: { beat: number; t: string; tone: Tone; img: ReactNode; vo: ReactNode; txt: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 360px', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '14px 20px 14px 26px', minHeight: 104, boxSizing: 'border-box' }}>
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: STRONG[tone] }}>{t}</span>
    <span style={{ fontSize: 21, lineHeight: 1.38, color: C.ink }}>{img}</span>
    <span style={{ fontSize: 21, lineHeight: 1.38, color: C.soft, fontStyle: 'italic' }}>{vo}</span>
    <span style={{ fontSize: 21, lineHeight: 1.3, fontWeight: 700, color: C.navy }}>{txt}</span>
  </div>
);

const M3_Script: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Un script vidéo de 30 secondes, prêt à tourner</Title>
    <Lede>Demandez un tableau : temps, image, voix off, texte à l’écran. Le tournage devient simple à organiser.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 268, width: 1680, display: 'grid', gridTemplateColumns: '120px 1fr 1fr 360px', gap: 18, padding: '0 20px 0 26px', boxSizing: 'border-box', ...dl(100) }}>
      <Eyebrow c={C.muted} size={17}>Temps</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Image</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Voix off</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Texte à l’écran</Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 310, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Shot beat={1} t="0–3 s" tone="coral" img="Gros plan : une tasse tiède oubliée sur un bureau." vo="(bruit de clavier, silence)" txt="Votre café de bureau, honnêtement ?" />
      <M3Shot beat={2} t="3–10 s" tone="yellow" img="Une équipe grimace devant la machine automatique." vo="« La pause café, c’est souvent le meilleur moment. Encore faut-il que le café suive. »" txt="" />
      <M3Shot beat={3} t="10–22 s" tone="blue" img="L’atelier de torréfaction, puis l’installation dans les locaux." vo="« Ardente torréfie à Lyon et installe tout chez vous, sans engagement. »" txt="Torréfié à Lyon · Installé en 1 semaine" />
      <M3Shot beat={4} t="22–30 s" tone="green" img="L’équipe trinque avec ses tasses ; logo Ardente." vo="« Réservez votre dégustation gratuite. »" txt="Dégustation offerte · lien en description" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', gap: 24 }}>
      <Callout title="Format court" tone="coral" icon="video" cls={A.fade} style={{ flex: 1, ...dl(400) }} size={22}>
        L’accroche se joue en 2 secondes ; sous-titres indispensables (la plupart des vidéos sont vues sans le son).
      </Callout>
      <Callout title="Droit à l’image" tone="yellow" icon="users" cls={A.fade} style={{ flex: 1, ...dl(550) }} size={22}>
        Collaborateurs ou clients filmés : autorisation écrite. Avatar ou voix de synthèse : le signaler.
      </Callout>
    </div>
  </Frame>
);

// ─── Le curseur de ton ──────────────────────────────────────────────────────
const M3_TONES = [
  { name: 'Institutionnel', tone: 'navy' as Tone, ok: false, txt: 'Ardente a le plaisir de vous présenter Ardente Bureau, une offre de café de spécialité destinée aux entreprises. Nous vous proposons une dégustation gratuite dans vos locaux.' },
  { name: 'Professionnel', tone: 'blue' as Tone, ok: true, txt: 'Ardente Bureau apporte le café de spécialité dans votre entreprise. Réservez une dégustation gratuite pour votre équipe, sans engagement.' },
  { name: 'Chaleureux · notre ton', tone: 'green' as Tone, ok: true, txt: 'Et si la meilleure réunion de la semaine se passait autour d’un bon café ? Ardente Bureau vient le faire déguster à votre équipe. C’est offert.' },
  { name: 'Décontracté', tone: 'yellow' as Tone, ok: true, txt: 'Votre café de bureau mérite mieux. On passe vous faire goûter le nôtre ? C’est offert, et on apporte les tasses.' },
  { name: 'Familier', tone: 'coral' as Tone, ok: false, txt: 'Le café du bureau, c’est vraiment pas ouf 😬 On débarque avec nos grains et on vous régale. Gratuit. Deal ? ☕🔥' },
];

const M3_Ton: Page = () => {
  const [v, setV] = useState(2);
  const t = M3_TONES[v];
  return (
    <Frame mod={3} kind="simu">
      <Title>Trouver le ton juste : un message, cinq voix</Title>
      <Lede>Faites glisser le curseur. Même information, même offre… et pourtant cinq marques différentes.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1680, ...dl(100) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, color: C.muted, marginBottom: 14 }}>
          <span>Formel</span>
          <span>Familier</span>
        </div>
        <Range value={v} onChange={setV} min={0} max={4} step={1} w={1680} tone={t.tone} />
      </div>
      <div key={v} className={A.in} style={{ position: 'absolute', left: 120, top: 400, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[t.tone]}`, padding: '34px 44px', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag tone={t.tone} size={22}>
            {t.name}
          </Tag>
          <Tag tone={t.ok ? 'green' : 'coral'} size={22}>
            <Icon name={t.ok ? 'check' : 'x'} size={20} sw={3} /> {t.ok ? 'Compatible avec la charte' : 'Hors charte Ardente'}
          </Tag>
        </div>
        <div style={{ marginTop: 22, fontSize: 38, lineHeight: 1.4, fontWeight: 500, color: C.ink }}>{t.txt}</div>
      </div>
      <PromptBox title="prompt · ton" size={21} cls={A.fade} style={{ position: 'absolute', left: 120, top: 770, width: 1680, ...dl(400) }}>
        Réécris ce texte avec le ton de notre charte : <Cs>chaleureux, expert, jamais pédant</Cs>. Voici deux exemples de notre style : [exemple 1] [exemple 2]. Garde les faits strictement identiques.
      </PromptBox>
    </Frame>
  );
};

// ─── Relire comme un éditeur (grille qualité) ───────────────────────────────
const M3_Relecture: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Relire comme un éditeur : la grille avant publication</Title>
    <Lede>Appliquez-la au dernier texte généré. Chaque case non cochée est un risque pour la marque.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="rl1" w={2} size={25}>Exact : chaque fait, chiffre, date et nom est vérifié et sourcé</CheckItem>
        <CheckItem id="rl2" w={2} size={25}>Honnête : aucune promesse, allégation ou citation non validée</CheckItem>
        <CheckItem id="rl3" size={25}>Fidèle : ton, vocabulaire et valeurs conformes à la charte</CheckItem>
        <CheckItem id="rl4" size={25}>Utile : la cible comprend le bénéfice et l’action attendue</CheckItem>
        <CheckItem id="rl5" size={25}>Original : pas de formule cliché, pas de copie d’un concurrent</CheckItem>
        <CheckItem id="rl6" size={25}>Inclusif : pas de stéréotype, langage accessible à tous</CheckItem>
        <CheckItem id="rl7" size={25}>Propre : orthographe, typographie, liens et mentions légales</CheckItem>
        <CheckItem id="rl8" size={25}>Transparent : contenu réaliste généré par IA signalé si nécessaire</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Prêt à publier ?"
          levels={[
            { min: 0, text: 'Brouillon : ne publiez pas.', tone: 'coral' },
            { min: 6, text: 'Presque : terminez les vérifications.', tone: 'yellow' },
            { min: 10, text: 'Prêt : publiez, c’est votre signature.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Les deux premiers critères comptent double : ce sont eux qui engagent juridiquement la marque.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="2"
    title="Transformer une idée en plusieurs contenus"
    defi="declinaison"
    who="En binôme · une idée de votre calendrier"
    minutes={25}
    objective={
      <>
        À partir d’<strong>une seule idée</strong> de votre calendrier, produire quatre contenus de formats différents, cohérents entre eux et conformes à la charte.
      </>
    }
    where={<>1 article (plan + intro) · 1 post LinkedIn · 1 email (3 objets) · 1 script vidéo de 30 s ou 3 slogans · la grille de relecture remplie</>}
    crit={
      <>
        <CheckItem id="a2c1" size={22}>Le même message clé partout</CheckItem>
        <CheckItem id="a2c2" size={22}>Les codes de chaque format respectés</CheckItem>
        <CheckItem id="a2c3" size={22}>Au moins une boucle critique → réécriture</CheckItem>
        <CheckItem id="a2c4" size={22}>Grille de relecture : 10 / 10</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Collez la charte de ton en tête de conversation. <strong>2.</strong> Rédigez l’article d’abord : c’est le contenu « pivot ». <strong>3.</strong> Demandez les déclinaisons une par une, avec les codes de
    chaque format. <strong>4.</strong> Passez chaque texte à la grille de relecture.
    <Bonus>Demandez à l’IA de jouer votre persona et de réagir à chaque contenu : « Qu’est-ce qui te donnerait envie de cliquer ? »</Bonus>
  </LabPage>
);

// ─── Exemple : une idée, six contenus ───────────────────────────────────────
const M3Out = ({ icon, tone, fmt, children, d }: { icon: IconName; tone: Tone; fmt: string; children: ReactNode; d: number }) => (
  <div className={A.pop} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 22px', height: 230, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{fmt}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M3_Exemple: Page = () => (
  <Frame mod={3} kind="cas">
    <Title>Exemple : une idée, six contenus</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, background: G.violet, borderRadius: 18, padding: '18px 28px', color: '#fff', ...dl(100) }}>
      <Icon name="bulb" size={40} color="#fff" />
      <span style={{ fontSize: 28, fontWeight: 600 }}>L’idée : « La pause café, c’est le meilleur moment pour débloquer une réunion. »</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M3Out icon="news" tone="navy" fmt="Article" d={250}>
        « 5 façons d’en faire un rituel d’équipe » : 900 mots, FAQ, méta-description.
      </M3Out>
      <M3Out icon="linkedin" tone="blue" fmt="Post LinkedIn" d={350}>
        Accroche chiffre « 3 minutes » + anecdote + appel à la dégustation.
      </M3Out>
      <M3Out icon="insta" tone="pink" fmt="Carrousel Instagram" d={450}>
        5 slides : « Ce qui se dit vraiment à la machine à café ».
      </M3Out>
      <M3Out icon="mail" tone="teal" fmt="Email" d={550}>
        Objet : « Claire, et si votre prochaine réunion commençait par un café ? »
      </M3Out>
      <M3Out icon="video" tone="coral" fmt="Script 30 s" d={650}>
        Une réunion bloquée… qui se débloque autour d’un café Ardente.
      </M3Out>
      <M3Out icon="megaphone" tone="yellow" fmt="Slogan" d={750}>
        « La pause qui compte. » — signature de toute la campagne.
      </M3Out>
    </div>
    <Callout title="Temps passé" tone="green" icon="clock" cls={A.fade} style={{ position: 'absolute', left: 120, top: 850, width: 1680, ...dl(900) }} size={23}>
      45 minutes au total, relecture comprise, contre une demi-journée sans IA. Le message reste le même partout : c’est ça, la cohérence.
    </Callout>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M3_Synthese: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Ce qu’on retient du module 3</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="navy" d={100}>
        Un cycle unique : <strong>brief → jet → critique → réécriture → validation</strong>.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Chaque format a <strong>ses codes</strong> : accroche, longueur, structure, appel à l’action.
      </SynthRow>
      <SynthRow n={3} tone="violet" d={300}>
        Demandez toujours <strong>plusieurs variantes</strong> : accroches, objets, slogans.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Le ton se pilote avec <strong>la charte et des exemples</strong>, pas avec des adjectifs.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        <strong>Grille de relecture</strong> avant chaque publication : exact, honnête, fidèle.
      </SynthRow>
    </div>
    <ProjectCard mod={3}>
      Une idée de votre calendrier est déclinée en quatre contenus relus et validés. Votre slogan de campagne est choisi.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Cycle, M3_Article, M3_LinkedIn, M3_Social, M3_Newsletter, M3_Email, M3_PageWeb, M3_Slogans, M3_Script, M3_Ton, M3_Relecture, M3_Atelier, M3_Exemple, M3_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M3 · 11:25

OBJECTIF — Annoncer le module : produire tous les formats avec une méthode commune.

DIRE — « Troisième module : on écrit. Articles, posts LinkedIn, publications sur les réseaux, newsletters, emails, pages web, slogans et scripts vidéo. Huit formats, mais une seule méthode, que je vous montre tout de suite. Puis on voit les codes propres à chaque format. Et l’atelier 2 : transformer une idée en plusieurs contenus. »

TRANSITION — « D’abord, la méthode commune. »`,
  `⏱ 4 min · LE CYCLE DE CRÉATION (6 clics)

OBJECTIF — Installer le cycle brief → jet → critique → réécriture → validation.

DIRE — → « Le brief, c’est vous : les six ingrédients et la charte. » → « Le premier jet, c’est l’IA, et toujours en plusieurs variantes. » → « La critique : on demande à l’IA de se relire avec une grille, et on donne notre avis. » → « La réécriture, avec des consignes précises. » → « La validation, c’est vous, toujours. » → « Et entre critique et réécriture, on boucle deux ou trois fois. C’est là que se fait la qualité. »

INSISTER — Le prompt de critique en bas : à copier dans la bibliothèque, il sert pour tous les formats.

TRANSITION — « Appliquons ce cycle au format le plus long : l’article. »`,
  `⏱ 4 min · ARTICLE DE BLOG (onglets)

OBJECTIF — Montrer la rédaction d’un article en étapes : prompt, plan, introduction, référencement.

DIRE — Onglet 1 : « On demande d’abord un plan, pas un article entier. Notez la dernière consigne : signaler les chiffres à sourcer. » Onglet 2 : « Le plan est clair, l’offre n’arrive qu’à la fin. Mais la partie 1 va appeler des statistiques : il faudra une vraie source. » Onglet 3 : « On demande trois introductions et on garde la meilleure. Votre touche : une anecdote vraie. » Onglet 4 : « Et on profite de l’IA pour le référencement : mots-clés, méta-description, textes alternatifs des images. »

INSISTER — Plan d’abord, puis section par section : un article généré d’un bloc est presque toujours plat.

TRANSITION — « Format beaucoup plus court, mais plus exigeant : le post LinkedIn. »`,
  `⏱ 4 min · POST LINKEDIN (interactif)

OBJECTIF — Montrer l’importance de l’accroche et l’anatomie d’un post.

DIRE — « Sur LinkedIn, on ne voit que deux lignes avant “voir plus”. Tout se joue là. L’IA nous a proposé trois accroches : une question, un chiffre concret, une anecdote. » Cliquer chacune : « Laquelle vous donne envie de cliquer sur “voir plus” ? » Faire voter. « À droite, l’anatomie : accroche courte avec une tension, corps aéré, une preuve, un seul appel à l’action et trois hashtags maximum. »

INSISTER — L’anecdote client est la plus forte… à condition d’être vraie et que le client ait donné son accord.

TRANSITION — « Les autres réseaux ont d’autres codes. »`,
  `⏱ 3 min · RÉSEAUX SOCIAUX

OBJECTIF — Différencier les codes par réseau.

DIRE — « Sur Instagram, l’image passe d’abord, la légende complète, une question engage, des hashtags de niche en français. » Montrer la colonne de droite : « Facebook pour la communauté locale, TikTok et Reels avec une accroche dans les deux premières secondes et des sous-titres, Threads ou Bluesky pour des phrases courtes et un avis tranché. »

INSISTER — Le prompt du bas : demandez les variantes par réseau en une fois, l’IA connaît bien ces codes. À vous de vérifier qu’ils correspondent à votre audience.

TRANSITION — « Passons aux canaux que vous maîtrisez : la newsletter. »`,
  `⏱ 3 min · NEWSLETTER (6 clics)

OBJECTIF — Montrer la structure d’une newsletter efficace et le prompt correspondant.

DIRE — → « Objet et pré-en-tête : c’est ce qui fait ouvrir. » → « Une accroche personnalisée. » → « Une seule idée principale. » → « Une preuve. » → « Un seul bouton : un objectif, une action. » → « Et le pied de page légal. » Montrer le prompt : « Notez la variable prénom entre accolades : l’IA rédige le modèle, votre outil d’emailing remplit les prénoms. »

INSISTER — RGPD : l’IA n’a pas besoin de votre fichier de contacts pour rédiger la newsletter.

TRANSITION — « Et dans un email, l’objet décide de tout. Testons. »`,
  `⏱ 4 min · TESTEUR D’OBJETS (interactif)

OBJECTIF — Apprendre à évaluer un objet d’email.

DIRE — « Quatre objets générés par l’IA. » Cliquer A : « Aucun bénéfice, et sur mobile on ne voit même pas la fin. » Cliquer D : « Majuscules, points d’exclamation, “gratuit” : direction les indésirables. » Cliquer B : « Curiosité, émotion : pas mal, un peu négatif. » Cliquer C : « Personnalisé, un bénéfice clair, une question : le meilleur. » « Et la vraie méthode : faites générer dix objets, gardez les deux meilleurs, et laissez un test A/B trancher. »

ANIMATION — Demander à la salle de voter avant chaque clic.

TRANSITION — « Quand l’email fonctionne, il renvoie vers une page web. »`,
  `⏱ 3 min · PAGE WEB (5 clics)

OBJECTIF — Montrer qu’on demande d’abord une structure, puis les textes.

DIRE — « Pour une page d’atterrissage, on demande la structure avant les mots, avec un modèle classique : AIDA. » → Attention : la promesse. → Intérêt : les bénéfices. → Preuve : la confiance. → Désir : les objections, sous forme de FAQ. → Action : un bouton. « Le prompt demande aussi les cinq objections probables d’un office manager : c’est souvent la partie la plus utile. »

INSISTER — Prix, conditions, mentions légales : toujours fournis par vous, jamais inventés par l’IA.

TRANSITION — « Format très court maintenant, et très créatif : le slogan. »`,
  `⏱ 4 min · MACHINE À SLOGANS (interactif)

OBJECTIF — Générer large, choisir avec des critères, repérer les pièges.

DIRE — « Huit propositions de l’IA. » Faire défiler avec « Suivant ». « “Faites infuser vos idées” : on infuse du thé, pas du café ! L’IA ne vérifie pas le sens. » « “Le meilleur café de France” : allégation invérifiable. » « “Du grain à moudre” : expression déjà très utilisée. » Faire garder trois favoris par vote. « La grille de choix : court, porteur d’un bénéfice, vrai, et disponible : avant d’adopter un slogan, recherche d’antériorité à l’INPI. »

TRANSITION — « Ce slogan, on va le mettre en images. D’abord, en vidéo. »`,
  `⏱ 3 min · SCRIPT VIDÉO (4 clics)

OBJECTIF — Montrer un script structuré en tableau, prêt à tourner.

DIRE — « Demandez toujours un tableau : temps, image, voix off, texte à l’écran. » → « Trois secondes pour accrocher. » → « Le problème. » → « La solution. » → « L’appel à l’action. » « Avec ce tableau, n’importe qui peut organiser le tournage, ou le donner à un outil de montage. »

INSISTER — Sous-titres indispensables. Et droit à l’image : autorisation écrite des personnes filmées ; si avatar ou voix de synthèse, le signaler.

TRANSITION — « Dernier réglage, le plus subtil : le ton. »`,
  `⏱ 3 min · CURSEUR DE TON (interactif)

OBJECTIF — Faire sentir l’impact du ton et la manière de le piloter.

DIRE — « Même information, même offre. » Faire glisser de gauche à droite et lire chaque version. « Institutionnel : correct mais froid. Professionnel : efficace. Chaleureux : c’est le ton d’Ardente. Décontracté : possible sur Instagram. Familier : hors charte. » « Comment obtenir le bon ton ? Pas avec des adjectifs comme “sympa” ou “dynamique”, mais avec la charte et deux exemples de votre style. Et une consigne : garder les faits identiques. »

TRANSITION — « Avant de publier quoi que ce soit, une dernière étape. »`,
  `⏱ 3 min · GRILLE DE RELECTURE (exercice)

OBJECTIF — Donner la grille qualité avant publication (objectif « vérifier, corriger, améliorer »).

DIRE — « Huit critères. Exact et honnête comptent double : ce sont eux qui engagent la marque. Fidèle à la charte, utile pour la cible, original, inclusif, propre, transparent. » Faire appliquer la grille au post LinkedIn vu tout à l’heure, en cochant ensemble.

INSISTER — Cette grille va dans votre bibliothèque. Vous pouvez même la donner à l’IA pour une pré-relecture, mais c’est vous qui cochez.

TRANSITION — « À vous : atelier 2. »`,
  `⏱ 25 min · ATELIER 2 — UNE IDÉE, PLUSIEURS CONTENUS (minuteur)

OBJECTIF — Décliner une idée en quatre contenus cohérents et relus.

DIRE — « Vingt-cinq minutes. Prenez une idée de votre calendrier. Collez la charte en tête de conversation. Commencez par l’article, c’est le contenu pivot. Puis demandez les déclinaisons une par une : post LinkedIn, email avec trois objets, et au choix un script vidéo ou trois slogans. Passez chaque texte à la grille. »

ANIMATION — Lancer le minuteur. À 10 minutes, vérifier que l’article pivot existe. À 20 minutes, rappeler la grille de relecture. Bonus pour les plus rapides : faire jouer le persona par l’IA.

TRANSITION — « Regardons un exemple de restitution. »`,
  `⏱ 3 min · EXEMPLE : UNE IDÉE, SIX CONTENUS

OBJECTIF — Montrer la cohérence d’une déclinaison complète.

DIRE — « L’idée : la pause café débloque les réunions. Six contenus : article, post, carrousel, email, script, slogan. Le message reste le même, la forme change. Quarante-cinq minutes, relecture comprise, contre une demi-journée sans IA. »

ANIMATION — Faire présenter un binôme : son idée, deux contenus, et une correction faite grâce à la grille.

TRANSITION — « Je résume avant la pause déjeuner. »`,
  `⏱ 1 min · SYNTHÈSE M3

OBJECTIF — Clore la matinée.

DIRE — « Cinq idées. » Les lire. « Ce matin, vous avez une cible, un calendrier, et des contenus relus. Cet après-midi : les visuels, la personnalisation, l’analyse, et la mini-campagne. Bon appétit, reprise à 13:30. »

TRANSITION — Pause déjeuner.`,
];
// @@NOTES-END
