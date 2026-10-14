// ─── Module 2 · Stratégie marketing et création d’idées ─────────────────────

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Stratégie marketing
        <br />& création d’idées
      </>
    }
    sub="Bien parler à l’IA, puis s’en servir pour réfléchir : cible, personas, idées, ligne éditoriale, calendrier."
    dur="10:00 – 11:10 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · un calendrier de contenu sur un mois
      </Tag>
    }
  >
    <SecItem n={1}>La méthode du prompt en six ingrédients</SecItem>
    <SecItem n={2}>Définir une cible et créer des personas</SecItem>
    <SecItem n={3}>Trouver des idées de contenus</SecItem>
    <SecItem n={4}>Construire une ligne éditoriale</SecItem>
    <SecItem n={5}>Générer un calendrier éditorial</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Les six ingrédients d’un prompt (constructeur interactif) ──────────────
const M2Ing = ({ id, on, set, name, q, tone }: { id: string; on: Record<string, boolean>; set: (id: string, v: boolean) => void; name: string; q: string; tone: Tone }) => (
  <Toggle
    on={!!on[id]}
    onChange={(v) => set(id, v)}
    tone={tone}
    size={25}
    label={
      <span>
        <strong style={{ color: STRONG[tone] }}>{name}</strong> <span style={{ color: C.muted }}>· {q}</span>
      </span>
    }
  />
);
const M2Line = ({ show, tone, children }: { show: boolean; tone: Tone; children: ReactNode }) =>
  show ? (
    <div className={A.fade} style={{ animationDuration: '400ms', borderLeft: `4px solid ${STRONG[tone]}`, paddingLeft: 12, marginBottom: 8 } as CSSProperties}>
      {children}
    </div>
  ) : null;

const M2_Prompt: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const set = (id: string, v: boolean) => setOn((o) => ({ ...o, [id]: v }));
  const n = Object.values(on).filter(Boolean).length;
  const lvl = n <= 1 ? 0 : n <= 3 ? 1 : n <= 5 ? 2 : 3;
  const res = [
    { tone: 'coral' as Tone, tag: 'Générique, interchangeable', txt: '« Dans un monde où le café est essentiel, découvrez notre offre révolutionnaire ! ☕🚀 »' },
    { tone: 'yellow' as Tone, tag: 'Correct, mais plat', txt: '« Offrez à vos équipes un café de qualité au bureau avec Ardente. Contactez-nous ! »' },
    { tone: 'blue' as Tone, tag: 'Ciblé, utilisable après retouche', txt: '« Votre machine à café fait fuir vos équipes ? Ardente Bureau installe un café de spécialité dans vos locaux… »' },
    { tone: 'green' as Tone, tag: 'Prêt à relire', txt: '« Le bon café ne fait pas de bruit. Il fait parler. » Réservez une dégustation gratuite pour votre équipe.' },
  ][lvl];
  return (
    <Frame mod={2} kind="simu">
      <Title>La méthode : six ingrédients pour un prompt utile</Title>
      <Lede>Activez les ingrédients un par un et regardez la qualité du résultat évoluer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 640, display: 'flex', flexDirection: 'column', gap: 26, ...dl(100) }}>
        <M2Ing id="role" on={on} set={set} name="Rôle" q="qui parle ?" tone="navy" />
        <M2Ing id="ctx" on={on} set={set} name="Contexte" q="la marque, l’offre" tone="blue" />
        <M2Ing id="cible" on={on} set={set} name="Cible" q="à qui ?" tone="teal" />
        <M2Ing id="obj" on={on} set={set} name="Objectif" q="pour obtenir quoi ?" tone="green" />
        <M2Ing id="fmt" on={on} set={set} name="Format" q="longueur, structure" tone="violet" />
        <M2Ing id="ton" on={on} set={set} name="Ton & exemple" q="notre style" tone="pink" />
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, color: C.muted, marginRight: 6 }}>Qualité</span>
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 1 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 2 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 3 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 4 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 5 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 6 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ marginLeft: 8, fontFamily: display, fontWeight: 800, fontSize: 28, color: STRONG[res.tone] }}>{n} / 6</span>
        </div>
      </div>
      <PromptBox title="mon-prompt.txt" size={21} cls={A.right} style={{ position: 'absolute', left: 820, top: 270, width: 980, height: 470, ...dl(200) }}>
        <M2Line show={!!on.role} tone="navy">Tu es responsable marketing B2B d’un torréfacteur artisanal lyonnais.</M2Line>
        <M2Line show={!!on.ctx} tone="blue">Nous lançons Ardente Bureau : café de spécialité livré et machine installée en entreprise, sans engagement.</M2Line>
        <div style={{ marginBottom: 8, color: '#FFFFFF', fontWeight: 700 }}>Écris un post LinkedIn sur notre offre de café en entreprise.</div>
        <M2Line show={!!on.cible} tone="teal">Cible : office managers et RH de PME lyonnaises de 20 à 150 salariés.</M2Line>
        <M2Line show={!!on.obj} tone="green">Objectif : obtenir des demandes de dégustation gratuite au bureau.</M2Line>
        <M2Line show={!!on.fmt} tone="violet">Format : 120 à 150 mots, accroche de moins de 15 mots, 3 hashtags, un appel à l’action.</M2Line>
        <M2Line show={!!on.ton} tone="pink">Ton : chaleureux et expert, sans superlatifs. Notre style : « Le bon café ne fait pas de bruit. Il fait parler. »</M2Line>
      </PromptBox>
      <div
        className={A.right}
        style={{ position: 'absolute', left: 820, top: 770, width: 980, boxSizing: 'border-box', background: T[res.tone].bg, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${T[res.tone].bd}`, padding: '18px 26px', transition: 'background 300ms', ...dl(300) }}
      >
        <Eyebrow c={T[res.tone].fg} size={19}>
          Résultat probable · {res.tag}
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.42, color: C.ink }}>{res.txt}</div>
      </div>
    </Frame>
  );
};

// ─── Le prompt est une conversation ─────────────────────────────────────────
const M2_Iterer: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Le prompt est une conversation, pas un ordre unique</Title>
    <Lede>Le premier résultat est un brouillon. Ce sont les relances qui font la qualité.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="user" w={820} cls={A.in} style={dl(100)} size={24}>
        Avant de répondre, <strong>pose-moi les questions</strong> dont tu as besoin pour écrire un excellent post.
      </Bubble>
      <Bubble who="agent" name="Assistant IA" w={860} cls={b.on(1)} size={23}>
        1. Quel est le prix ou la formule d’essai ? 2. Avez-vous un client témoin ? 3. Quelle zone géographique ? 4. Quel ton sur LinkedIn ?
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(2)} size={24}>
        Propose <strong>trois accroches</strong> très différentes : une question, un chiffre, une anecdote.
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(3)} size={24}>
        <strong>Critique ton texte</strong> comme une directrice marketing exigeante, puis améliore-le.
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(4)} size={24}>
        Plus court de 30 %, <strong>sans emoji</strong>, et termine par une question.
      </Bubble>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1240, top: 270, width: 560, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(300) }}>
      <Eyebrow c={C.navy} size={20}>
        Cinq relances magiques
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Bullet size={24} tone="blue">Pose-moi d’abord tes questions</Bullet>
        <Bullet size={24} tone="violet">Donne-moi 3 variantes très différentes</Bullet>
        <Bullet size={24} tone="teal">Critique, puis améliore</Bullet>
        <Bullet size={24} tone="green">Plus court, plus concret, plus simple</Bullet>
        <Bullet size={24} tone="pink">Réécris avec cet exemple de notre style</Bullet>
      </div>
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1.5px solid ${C.rule}`, fontSize: 22, lineHeight: 1.4, color: C.soft }}>
        Le bon prompt, une fois trouvé, va dans votre <strong style={{ color: C.navy }}>bibliothèque</strong>.
      </div>
    </div>
  </Frame>
);

// ─── Définir une cible (entonnoir) ──────────────────────────────────────────
const M2Level = ({ w, tone, label, sub, beat }: { w: number; tone: Tone; label: string; sub: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: w, boxSizing: 'border-box', margin: '0 auto', background: beat === 3 ? G.blue : T[tone].bg, borderRadius: 16, boxShadow: beat === 3 ? SHADOW : `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 24px', textAlign: 'center' }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: beat === 3 ? '#fff' : T[tone].fg }}>{label}</div>
    <div style={{ fontSize: 20, color: beat === 3 ? '#DCE3FB' : C.muted }}>{sub}</div>
  </div>
);

const M2_Cible: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Définir une cible : « tout le monde » n’est pas une cible</Title>
    <Lede>L’IA aide à resserrer, à condition de lui donner vos vraies informations et de la laisser questionner.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M2Level w={900} tone="grey" label="Tout le monde boit du café" sub="trop large : aucun message ne porte" beat={0} />
      <M2Level w={760} tone="yellow" label="Les entreprises" sub="mieux, mais une start-up n’est pas un groupe du CAC 40" beat={1} />
      <M2Level w={620} tone="teal" label="PME lyonnaises de 20 à 150 salariés" sub="taille, zone, besoin commun" beat={2} />
      <M2Level w={480} tone="blue" label="Leurs office managers & RH" sub="ceux qui choisissent et achètent" beat={3} />
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PromptBox title="prompt · cible" size={20} cls={A.right} style={dl(200)}>
        Je suis chargée de marketing chez Ardente, torréfacteur lyonnais. Nous lançons une offre de café en entreprise. Voici nos ventes B2B actuelles : [tableau anonymisé].
        {'\n\n'}Aide-moi à choisir une <Cf>cible prioritaire</Cf>. Pose-moi d’abord 5 questions, puis propose 3 segments avec, pour chacun : taille, besoin, décideur, argument clé et risque.
      </PromptBox>
      <Callout title="Votre rôle" tone="coral" icon="humanCheck" cls={A.right} style={dl(400)} size={23}>
        L’IA propose des segments ; <strong>vos données de vente</strong> et votre connaissance terrain tranchent.
      </Callout>
    </div>
  </Frame>
);

// ─── Personas (onglets) ─────────────────────────────────────────────────────
const M2Box = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', height: 238, boxSizing: 'border-box' }}>
    <PanelTitle icon={icon} c={T[tone].fg}>
      {title}
    </PanelTitle>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);
const M2Persona = ({ name, role, tone, quote, goals, pains, chans, msg }: { name: string; role: string; tone: Tone; quote: string; goals: ReactNode; pains: ReactNode; chans: ReactNode; msg: ReactNode }) => (
  <div style={{ display: 'flex', gap: 26 }}>
    <div style={{ width: 500, flex: 'none', boxSizing: 'border-box', background: G.navy, borderRadius: 20, padding: '30px 32px', color: '#fff', height: 500 }}>
      <div style={{ width: 110, height: 110, borderRadius: 999, background: STRONG[tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="user" size={64} color="#fff" />
      </div>
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 800, fontSize: 40 }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 23, color: '#C9D2F2', lineHeight: 1.4 }}>{role}</div>
      <div style={{ marginTop: 26, fontSize: 25, lineHeight: 1.45, fontStyle: 'italic', color: '#fff' }}>« {quote} »</div>
    </div>
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <M2Box icon="target" tone="green" title="Objectifs">
        {goals}
      </M2Box>
      <M2Box icon="alert" tone="coral" title="Freins">
        {pains}
      </M2Box>
      <M2Box icon="megaphone" tone="blue" title="Où la toucher">
        {chans}
      </M2Box>
      <M2Box icon="chat" tone="violet" title="Le message qui marche">
        {msg}
      </M2Box>
    </div>
  </div>
);

const M2_Persona: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Créer des personas : trois visages pour Ardente Bureau</Title>
    <Tabs initial="claire">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 192, display: 'flex', gap: 12 }}>
        <TabBtn id="claire" icon="user" tone="teal">
          Claire · office manager
        </TabBtn>
        <TabBtn id="hugo" icon="rocket" tone="violet">
          Hugo · fondateur de start-up
        </TabBtn>
        <TabBtn id="nadia" icon="org" tone="pink">
          Nadia · DRH d’ETI
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
        <TabPane id="claire">
          <M2Persona
            name="Claire, 36 ans"
            role="Office manager · éditeur de logiciels, 80 salariés, Lyon 7e"
            tone="teal"
            quote="Je veux que les équipes aient envie de revenir au bureau, sans exploser mon budget."
            goals="Un lieu de vie agréable, des retours positifs des équipes, zéro gestion compliquée."
            pains="Budget serré, peur de l’engagement long, déjà déçue par un prestataire."
            chans="LinkedIn, newsletters professionnelles, salons RH et bouche-à-oreille."
            msg="« Sans engagement, installé en une semaine, et vos équipes votent pour leur café. »"
          />
        </TabPane>
        <TabPane id="hugo">
          <M2Persona
            name="Hugo, 31 ans"
            role="Cofondateur · start-up de la greentech, 25 salariés, Villeurbanne"
            tone="violet"
            quote="Notre culture d’équipe, c’est notre avantage pour recruter."
            goals="Attirer des talents, cohérence avec ses valeurs, une marque employeur forte."
            pains="Peu de temps, méfiance envers le discours « responsable » non prouvé."
            chans="LinkedIn, Instagram, podcasts entrepreneurs, réseaux de start-up."
            msg="« Un café traçable, du producteur à votre tasse : vos valeurs, servies chaque matin. »"
          />
        </TabPane>
        <TabPane id="nadia">
          <M2Persona
            name="Nadia, 47 ans"
            role="DRH · ETI industrielle, 400 salariés, trois sites en région"
            tone="pink"
            quote="Il me faut une solution simple, qui marche sur tous nos sites."
            goals="Qualité de vie au travail mesurable, un seul interlocuteur, des factures claires."
            pains="Achats centralisés, appels d’offres, besoin de références solides."
            chans="LinkedIn, email direct, recommandations de pairs, événements QVCT."
            msg="« Un interlocuteur unique pour vos trois sites, et un bilan de satisfaction chaque trimestre. »"
          />
        </TabPane>
      </div>
    </Tabs>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Personas fictifs générés par IA puis retravaillés : cliquez sur les onglets pour comparer.
    </Hint>
  </Frame>
);

// ─── Le prompt persona et ses pièges ────────────────────────────────────────
const M2_PersonaPrompt: Page = () => (
  <Frame mod={2}>
    <Title>Le prompt persona… et ses trois pièges</Title>
    <PromptBox title="prompt · persona" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 920, ...dl(100) }}>
      Tu es planneur stratégique. À partir des informations ci-dessous, crée <Cf>3 personas</Cf> distincts pour l’offre Ardente Bureau.
      {'\n\n'}
      <Cc>Informations : [offre, prix, zone, extraits anonymisés d’échanges clients]</Cc>
      {'\n\n'}Pour chaque persona : prénom, âge, poste, entreprise, citation typique, objectifs, freins, canaux, déclencheur d’achat, message clé.
      {'\n\n'}Signale ce qui relève de <Cn>l’hypothèse</Cn> et ce qui vient de mes données. Évite les stéréotypes.
    </PromptBox>
    <div style={{ position: 'absolute', left: 1100, top: 200, width: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="coral" icon="flask" title="Une hypothèse, pas une vérité" cls={A.right} style={dl(250)} size={23}>
        Confrontez-la à vos données : ventes, CRM, interviews, avis clients.
      </Card>
      <Card tone="yellow" icon="users" title="Gare aux clichés" cls={A.right} style={dl(400)} size={23}>
        L’IA associe facilement un métier à un âge ou un genre. Variez, corrigez.
      </Card>
      <Card tone="violet" icon="sparkles" title="Trop beau pour être vrai" cls={A.right} style={dl(550)} size={23}>
        Des détails très précis (« lit Les Échos le mardi ») sont souvent inventés.
      </Card>
    </div>
    <Callout title="Astuce" tone="blue" icon="bulb" cls={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 920, ...dl(700) }} size={23}>
      Donnez des verbatims réels anonymisés : le persona devient <strong>beaucoup plus juste</strong>.
    </Callout>
  </Frame>
);

// ─── La machine à idées ─────────────────────────────────────────────────────
const M2_ANGLES = [
  'les coulisses de la torréfaction',
  'l’erreur n° 1 avec la machine à café du bureau',
  'un chiffre surprenant sur les pauses en équipe',
  'le portrait d’un producteur partenaire',
  'l’avant / après d’une salle de pause',
  'le témoignage d’une entreprise cliente',
  'un mini-tuto pour réussir son café filtre',
  'une question ouverte à la communauté',
];
const M2_FORMATS = ['un carrousel LinkedIn', 'un reel Instagram', 'un article de blog', 'une newsletter', 'un sondage LinkedIn', 'une story Instagram', 'une vidéo de 30 secondes', 'une infographie'];
const M2_WHO = ['Claire, office manager', 'Hugo, fondateur de start-up', 'Nadia, DRH d’ETI'];
const M2_WHEN = ['un lundi matin', 'à la rentrée', 'le 1er octobre, Journée internationale du café', 'avant les fêtes de fin d’année', 'un jeudi midi', 'pendant la semaine de la QVCT'];

const M2Slot = ({ label, value, tone, spin }: { label: string; value: string; tone: Tone; spin: number }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 -5px 0 ${STRONG[tone]}`, padding: '16px 22px', height: 120, boxSizing: 'border-box' }}>
    <Eyebrow c={T[tone].fg} size={17}>
      {label}
    </Eyebrow>
    <div key={spin} className={A.down} style={{ marginTop: 8, fontSize: 26, fontWeight: 600, lineHeight: 1.3, color: C.ink, animationDuration: '450ms' } as CSSProperties}>
      {value}
    </div>
  </div>
);

const M2_Idees: Page = () => {
  const [s, setS] = useState({ a: 0, f: 0, w: 0, m: 0, n: 0 });
  const [kept, setKept] = useState(0);
  const roll = () =>
    setS((o) => ({
      a: Math.floor(Math.random() * M2_ANGLES.length),
      f: Math.floor(Math.random() * M2_FORMATS.length),
      w: Math.floor(Math.random() * M2_WHO.length),
      m: Math.floor(Math.random() * M2_WHEN.length),
      n: o.n + 1,
    }));
  return (
    <Frame mod={2} kind="simu">
      <Title>Trouver des idées : croiser angles × formats × cibles</Title>
      <Lede>La technique du « jeu de combinaisons » : demandez à l’IA 30 croisements, gardez les 3 meilleurs.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, ...dl(100) }}>
        <M2Slot label="Angle" value={M2_ANGLES[s.a]} tone="violet" spin={s.n} />
        <M2Slot label="Format" value={M2_FORMATS[s.f]} tone="blue" spin={s.n} />
        <M2Slot label="Pour" value={M2_WHO[s.w]} tone="teal" spin={s.n} />
        <M2Slot label="Quand" value={M2_WHEN[s.m]} tone="pink" spin={s.n} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1080, boxSizing: 'border-box', background: T.violet.bg, borderRadius: 18, padding: '22px 28px', ...dl(200) }}>
        <Eyebrow c={T.violet.fg} size={19}>
          L’idée
        </Eyebrow>
        <div key={s.n} className={A.fade} style={{ marginTop: 8, fontSize: 28, lineHeight: 1.4, color: C.ink, animationDuration: '500ms' } as CSSProperties}>
          Publier <strong>{M2_FORMATS[s.f]}</strong> sur <strong>{M2_ANGLES[s.a]}</strong>, pensé pour <strong>{M2_WHO[s.w]}</strong>, {M2_WHEN[s.m]}.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, display: 'flex', alignItems: 'center', gap: 16, ...dl(300) }}>
        <Btn icon="sparkles" tone="violet" onClick={roll} size={26}>
          Nouvelle idée
        </Btn>
        <Btn icon="star" ghost tone="green" onClick={() => setKept((x) => x + 1)} size={26}>
          On la garde
        </Btn>
        <span style={{ fontSize: 24, color: C.muted }}>
          Idées retenues : <strong style={{ fontFamily: display, fontSize: 34, color: C.green }}>{kept}</strong>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 1260, top: 270, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="blue" icon="filter" title="Demandez 30, gardez 3" cls={A.right} style={dl(250)} size={22}>
          La quantité d’abord, le tri ensuite, avec vos critères : cible, objectif, faisabilité.
        </Card>
        <Card tone="teal" icon="search" title="Partez des questions clients" cls={A.right} style={dl(400)} size={22}>
          FAQ, objections commerciales, avis : chaque question est un sujet.
        </Card>
        <Card tone="pink" icon="calendar" title="Calez sur les temps forts" cls={A.right} style={dl(550)} size={22}>
          Journées thématiques, saisons, actualité du secteur.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Ligne éditoriale (piliers) ─────────────────────────────────────────────
const M2Arc = ({ from, pct, color, d }: { from: number; pct: number; color: string; d: number }) => {
  const R = 150;
  const L = 2 * Math.PI * R;
  return (
    <circle
      cx={190}
      cy={190}
      r={R}
      fill="none"
      stroke={color}
      strokeWidth={60}
      strokeDasharray={`${(pct / 100) * L - 4} ${L}`}
      strokeDashoffset={-(from / 100) * L}
      transform="rotate(-90 190 190)"
      className={A.fade}
      style={dl(d)}
    />
  );
};
const M2Pillar = ({ pct, tone, name, ex, d }: { pct: number; tone: Tone; name: string; ex: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <span style={{ width: 84, fontFamily: display, fontWeight: 800, fontSize: 32, color: STRONG[tone], textAlign: 'right' }}>{pct} %</span>
    <span style={{ width: 14, height: 44, borderRadius: 4, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{ex}</div>
    </div>
  </div>
);

const M2_Ligne: Page = () => (
  <Frame mod={2}>
    <Title>Ligne éditoriale : de quoi on parle, et comment</Title>
    <svg width={380} height={380} className={A.pop} style={{ position: 'absolute', left: 120, top: 260, ...dl(100) }} aria-hidden>
      <M2Arc from={0} pct={30} color={C.blue} d={200} />
      <M2Arc from={30} pct={25} color={C.violet} d={320} />
      <M2Arc from={55} pct={20} color={C.green} d={440} />
      <M2Arc from={75} pct={15} color={C.yellow} d={560} />
      <M2Arc from={90} pct={10} color={C.pink} d={680} />
      <text x={190} y={180} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 30, fill: C.navy }}>
        5 piliers
      </text>
      <text x={190} y={214} textAnchor="middle" style={{ fontSize: 20, fill: C.muted }}>
        le mix du mois
      </text>
    </svg>
    <div style={{ position: 'absolute', left: 540, top: 270, width: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Pillar pct={30} tone="blue" name="Expertise café" ex="origines, torréfaction, préparation" d={200} />
      <M2Pillar pct={25} tone="violet" name="Coulisses" ex="l’atelier, l’équipe, les producteurs" d={320} />
      <M2Pillar pct={20} tone="green" name="Engagement" ex="traçabilité, prix juste, preuves" d={440} />
      <M2Pillar pct={15} tone="yellow" name="Offres" ex="Ardente Bureau, abonnement, e-shop" d={560} />
      <M2Pillar pct={10} tone="pink" name="Communauté" ex="clients, questions, sondages" d={680} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 260, width: 600, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(400) }}>
      <Eyebrow c={C.navy} size={20}>
        Charte de ton
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.ink }}>
        <strong>Promesse :</strong> le bon café rapproche les gens.
        <br />
        <strong>Ton :</strong> chaleureux, expert, jamais pédant.
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 21, lineHeight: 1.45 }}>
        <div style={{ background: T.green.bg, borderRadius: 12, padding: '12px 16px', color: C.ink }}>
          <strong style={{ color: T.green.fg }}>On dit</strong>
          <br />
          « dégustation »
          <br />
          « nos producteurs »
          <br />
          des faits, des preuves
        </div>
        <div style={{ background: T.coral.bg, borderRadius: 12, padding: '12px 16px', color: C.ink }}>
          <strong style={{ color: T.coral.fg }}>On ne dit pas</strong>
          <br />
          « révolutionnaire »
          <br />
          « le meilleur café »
          <br />
          des emojis en rafale
        </div>
      </div>
    </div>
    <Callout title="Avec l’IA" tone="violet" icon="sparkles" cls={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(800) }} size={24}>
      Donnez-lui vos 10 meilleurs posts : « Déduis-en nos piliers, notre ton et nos règles d’écriture. » Puis collez la charte en tête de chaque prompt.
    </Callout>
  </Frame>
);

// ─── Le calendrier éditorial ────────────────────────────────────────────────
const M2Cell = ({ tone, children, beat }: { tone: Tone; children: ReactNode; beat: number }) => (
  <div className={b.pop(beat)} style={{ background: T[tone].bg, boxShadow: `inset 4px 0 0 ${STRONG[tone]}`, borderRadius: 10, padding: '10px 14px', fontSize: 20, lineHeight: 1.3, color: C.ink, height: 96, boxSizing: 'border-box' }}>
    {children}
  </div>
);
const M2Head = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.08em', color: C.navy, textTransform: 'uppercase', padding: '0 4px' }}>{children}</div>
);
const M2Chan = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 600, color: C.ink }}>
    <IconTile name={icon} tone={tone} size={44} /> {children}
  </div>
);

const M2_Calendrier: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Générer un calendrier éditorial : novembre chez Ardente</Title>
    <Lede>Persona + ligne éditoriale + temps forts = un mois cohérent, généré en 2 minutes, ajusté en 15.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', gap: 14, alignItems: 'center', ...dl(100) }}>
      <span />
      <M2Head>Sem. 1 · teasing</M2Head>
      <M2Head>Sem. 2 · lancement</M2Head>
      <M2Head>Sem. 3 · preuves</M2Head>
      <M2Head>Sem. 4 · conversion</M2Head>
      <M2Chan icon="linkedin" tone="blue">
        LinkedIn
      </M2Chan>
      <M2Cell tone="violet" beat={1}>Carrousel : « 5 signes que votre café de bureau démotive »</M2Cell>
      <M2Cell tone="yellow" beat={2}>Annonce Ardente Bureau + offre dégustation</M2Cell>
      <M2Cell tone="green" beat={3}>Témoignage client : une PME du 7e</M2Cell>
      <M2Cell tone="yellow" beat={4}>Dernières dates de dégustation en novembre</M2Cell>
      <M2Chan icon="insta" tone="pink">
        Instagram
      </M2Chan>
      <M2Cell tone="violet" beat={1}>Reel : une matinée à l’atelier de torréfaction</M2Cell>
      <M2Cell tone="blue" beat={2}>Story quiz : « Quel café pour votre équipe ? »</M2Cell>
      <M2Cell tone="green" beat={3}>Portrait : notre productrice au Pérou</M2Cell>
      <M2Cell tone="pink" beat={4}>Sondage : votre rituel café préféré</M2Cell>
      <M2Chan icon="mail" tone="teal">
        Newsletter
      </M2Chan>
      <M2Cell tone="blue" beat={1}>Guide : réussir la pause café en équipe</M2Cell>
      <M2Cell tone="yellow" beat={2}>Lancement : l’offre détaillée et la FAQ</M2Cell>
      <M2Cell tone="violet" beat={3}>Coulisses : comment on choisit nos cafés</M2Cell>
      <M2Cell tone="yellow" beat={4}>Rappel : dégustation offerte avant le 30/11</M2Cell>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, display: 'flex', gap: 12, ...dl(400) }}>
      <Tag tone="blue" size={20}>Expertise</Tag>
      <Tag tone="violet" size={20}>Coulisses</Tag>
      <Tag tone="green" size={20}>Engagement & preuves</Tag>
      <Tag tone="yellow" size={20}>Offres</Tag>
      <Tag tone="pink" size={20}>Communauté</Tag>
    </div>
    <PromptBox title="prompt · calendrier" size={19} cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(600) }}>
      À partir du persona et de la ligne éditoriale ci-dessus, crée un calendrier de 4 semaines (LinkedIn 2×/sem., Instagram 3×/sem., newsletter 1×/sem.). <Cf>Tableau</Cf> : date, canal, pilier, sujet, format, appel à l’action.
    </PromptBox>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={1}
    title="Personas et IA"
    q="L’IA vient de vous générer trois personas très détaillés. Que faites-vous ?"
    explain="Un persona généré est une hypothèse de travail : on le confronte aux données réelles (ventes, CRM, avis, interviews) et on corrige les stéréotypes."
  >
    <Opt why="Les détails sont plausibles, pas vérifiés : vous risquez de cibler des personnes qui n’existent pas.">Je les utilise tels quels dans la campagne</Opt>
    <Opt ok why="Exact : c’est un point de départ très utile, à valider avec vos données et vos équipes commerciales.">
      Je les confronte à nos données clients et je les corrige
    </Opt>
    <Opt why="L’IA ne remplace pas la connaissance du terrain : elle n’a jamais parlé à vos clients.">J’arrête les études clients, l’IA suffit</Opt>
    <Opt why="Plus on a de personas, moins chacun est utile : choisissez une cible prioritaire.">J’en génère vingt pour couvrir tout le monde</Opt>
  </QcmPage>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="1"
    title="Un calendrier de contenu sur un mois"
    defi="calendrier"
    who="En binôme · Ardente ou votre marque"
    minutes={30}
    objective={
      <>
        Produire avec l’IA un <strong>calendrier éditorial d’un mois</strong>, cohérent avec une cible, une ligne éditoriale et des temps forts.
      </>
    }
    where={
      <>
        1 persona prioritaire · 4 à 5 piliers avec leur poids · un tableau de 4 semaines (12 à 16 publications) · les prompts utilisés, collés dans votre bibliothèque
      </>
    }
    crit={
      <>
        <CheckItem id="a1c1" size={22}>Chaque ligne sert la cible et l’objectif</CheckItem>
        <CheckItem id="a1c2" size={22}>Les piliers sont équilibrés</CheckItem>
        <CheckItem id="a1c3" size={22}>Un appel à l’action par publication</CheckItem>
        <CheckItem id="a1c4" size={22}>Vous avez corrigé au moins 3 idées faibles</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Prompt cible + persona (6 ingrédients). <strong>2.</strong> Demandez 30 idées, gardez-en 12. <strong>3.</strong> Faites générer la ligne éditoriale.{' '}
    <strong>4.</strong> Demandez le calendrier en tableau, puis critiquez-le avec l’IA.
    <Bonus>Demandez une version exportable (CSV) et importez-la dans votre tableur.</Bonus>
  </LabPage>
);

// ─── Exemple de restitution ─────────────────────────────────────────────────
const M2Row = ({ c, children, head = false }: { c: string[]; children?: ReactNode; head?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '130px 160px 190px 1fr 200px 300px', gap: 16, padding: '12px 20px', background: head ? C.navy : C.card, color: head ? '#fff' : C.ink, fontSize: head ? 19 : 21, fontWeight: head ? 700 : 400, letterSpacing: head ? '0.06em' : 0, borderBottom: `1px solid ${C.rule}` }}>
    <span>{c[0]}</span>
    <span>{c[1]}</span>
    <span>{c[2]}</span>
    <span>{c[3]}</span>
    <span>{c[4]}</span>
    <span>{c[5]}</span>
    {children}
  </div>
);

const M2_Exemple: Page = () => (
  <Frame mod={2} kind="cas">
    <Title>Exemple de restitution : un extrait du tableau généré</Title>
    <Lede>Ce que l’IA a produit en une minute, après deux relances. Repérez ce que vous changeriez encore.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW, ...dl(100) }}>
      <M2Row head c={['DATE', 'CANAL', 'PILIER', 'SUJET', 'FORMAT', 'APPEL À L’ACTION']} />
      <M2Row c={['Lun. 3/11', 'LinkedIn', 'Expertise', '5 signes que votre café de bureau démotive', 'Carrousel', 'Commentez votre signe n° 1']} />
      <M2Row c={['Mer. 5/11', 'Instagram', 'Coulisses', 'Une matinée à l’atelier de torréfaction', 'Reel 30 s', 'Enregistrez pour plus tard']} />
      <M2Row c={['Jeu. 6/11', 'Newsletter', 'Expertise', 'Réussir la pause café en équipe', 'Guide', 'Téléchargez la check-list']} />
      <M2Row c={['Mar. 11/11', 'LinkedIn', 'Offres', 'Lancement d’Ardente Bureau', 'Post + visuel', 'Réservez une dégustation']} />
      <M2Row c={['Mar. 18/11', 'LinkedIn', 'Engagement', 'Une PME du 7e raconte', 'Témoignage', 'Lire le cas client']} />
      <M2Row c={['Mar. 25/11', 'Newsletter', 'Offres', 'Dégustation offerte avant le 30/11', 'Email court', 'Choisir un créneau']} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 24 }}>
      <Callout title="Bien vu" tone="green" icon="check" cls={A.in} style={{ flex: 1, ...dl(400) }} size={23}>
        Progression teasing → lancement → preuves → conversion, un appel à l’action partout.
      </Callout>
      <Callout title="À corriger" tone="coral" icon="pen" cls={A.in} style={{ flex: 1, ...dl(550) }} size={23}>
        Le 11/11 est férié ! Et le témoignage client doit être réel et validé par le client.
      </Callout>
    </div>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Ce qu’on retient du module 2</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="navy" d={100}>
        Six ingrédients : <strong>rôle, contexte, cible, objectif, format, ton & exemple</strong>.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Le prompt est <strong>une conversation</strong> : questions, variantes, critique, réécriture.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Personas et cibles générés = <strong>hypothèses à valider</strong> avec vos données.
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        Idées : <strong>croiser angles × formats × cibles</strong>, demander 30, garder 3.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        La <strong>ligne éditoriale</strong> en tête de prompt rend tout le calendrier cohérent.
      </SynthRow>
    </div>
    <ProjectCard mod={2}>
      Vous avez une cible prioritaire, un persona, une ligne éditoriale et un calendrier d’un mois. Vos prompts sont dans la bibliothèque.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_Prompt, M2_Iterer, M2_Cible, M2_Persona, M2_PersonaPrompt, M2_Idees, M2_Ligne, M2_Calendrier, M2_Qcm, M2_Atelier, M2_Exemple, M2_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M2 · 10:00

OBJECTIF — Annoncer le module : bien parler à l’IA, puis l’utiliser pour réfléchir avant d’écrire.

DIRE — « Deuxième module, le plus important de la matinée. D’abord la méthode : comment écrire un prompt qui donne un résultat utile du premier coup. Ensuite, on s’en sert pour la stratégie : définir une cible, créer des personas, trouver des idées, construire une ligne éditoriale et générer un calendrier. Et vous finirez par votre propre calendrier d’un mois, en atelier. »

TRANSITION — « On commence par la recette. »`,
  `⏱ 6 min · SIX INGRÉDIENTS (interactif)

OBJECTIF — Faire découvrir la méthode du prompt en six ingrédients, par la démonstration.

DIRE — « Voici le prompt typique de quelqu’un qui a été déçu par l’IA : “Écris un post LinkedIn sur notre offre de café en entreprise.” Résultat : générique. » Activer Rôle et Contexte : « On dit qui parle et de quoi on parle. C’est déjà mieux, mais plat. » Activer Cible et Objectif : « À qui, pour obtenir quoi. Là, ça devient utilisable. » Activer Format et Ton : « Et avec un exemple de notre style, le texte ressemble enfin à la marque. »

INSISTER — C’est exactement ce que vous feriez avec un stagiaire ou une agence : un brief. Un prompt, c’est un brief.

ANIMATION — Rappeler le prompt « décevant » noté pendant le tour de table et le réécrire ensemble avec les six ingrédients.

TRANSITION — « Et même avec un bon prompt, on ne s’arrête pas au premier résultat. »`,
  `⏱ 3 min · LA CONVERSATION (4 clics)

OBJECTIF — Montrer l’itération : questions, variantes, critique, réécriture.

DIRE — « Première astuce : demandez-lui de vous poser des questions avant de répondre. » → « Elle demande ce qui lui manque : le prix, un client témoin. » → « Demandez toujours plusieurs variantes, très différentes. » → « Faites-la critiquer son propre texte, avec un rôle exigeant : c’est étonnamment efficace. » → « Et enfin les contraintes de finition : plus court, sans emoji, finir par une question. »

INSISTER — Le bon prompt, une fois trouvé, se range dans la bibliothèque : c’est elle qui fait gagner du temps la semaine suivante.

TRANSITION — « Appliquons ça à la stratégie : la cible. »`,
  `⏱ 4 min · DÉFINIR UNE CIBLE (3 clics)

OBJECTIF — Montrer comment l’IA aide à resserrer une cible, et où s’arrête son rôle.

DIRE — « “Tout le monde boit du café” : vrai, mais inutile. » → « Les entreprises : mieux. » → « Les PME lyonnaises de 20 à 150 salariés : on a une taille, une zone, un besoin. » → « Et dans ces PME, les personnes qui choisissent et achètent : office managers et RH. » Montrer le prompt : « On lui donne nos données de vente anonymisées et on lui demande de nous questionner d’abord. »

INSISTER — L’IA propose des segments, ce sont vos données et votre terrain qui tranchent.

TRANSITION — « Une cible, c’est abstrait. Donnons-lui un visage. »`,
  `⏱ 4 min · PERSONAS (onglets)

OBJECTIF — Montrer des personas exploitables et leur utilité pour le message.

DIRE — « Voici trois personas générés puis retravaillés. Claire, office manager : elle veut que les équipes reviennent au bureau sans exploser le budget. » Cliquer sur Hugo : « Hugo, fondateur de start-up, sensible aux valeurs mais méfiant envers le discours responsable non prouvé. » Cliquer sur Nadia : « Nadia, DRH d’une ETI de trois sites : achats centralisés, besoin de références. » « Regardez la dernière case : le message n’est pas le même pour les trois. C’est ça, l’intérêt d’un persona. »

ANIMATION — Demander au groupe : « Lequel de ces trois personas choisiriez-vous en priorité pour un lancement en novembre, et pourquoi ? »

TRANSITION — « Comment les obtenir, et comment ne pas se faire piéger ? »`,
  `⏱ 3 min · PROMPT PERSONA ET PIÈGES

OBJECTIF — Donner un prompt réutilisable et les précautions associées.

DIRE — « Le prompt : un rôle de planneur stratégique, nos informations, la liste des rubriques attendues. Et une consigne précieuse : signale ce qui est une hypothèse. » Lire les trois pièges : « C’est une hypothèse, pas une vérité. L’IA adore les clichés : un métier, un âge, un genre. Et les détails trop précis sont souvent inventés. »

INSISTER — L’astuce : donner des verbatims réels anonymisés, par exemple des extraits d’échanges commerciaux. Le persona devient beaucoup plus juste.

TRANSITION — « Avec une cible et des personas, on peut chercher des idées. »`,
  `⏱ 4 min · MACHINE À IDÉES (interactif)

OBJECTIF — Faire vivre la technique du croisement angles × formats × cibles × moments.

DIRE — « Une technique très simple pour ne jamais être à court d’idées : croiser. Un angle, un format, une cible, un moment. » Cliquer « Nouvelle idée » plusieurs fois et lire. « Certaines sont excellentes, d’autres absurdes : c’est normal. Avec l’IA, on fait pareil : on lui demande trente croisements et on garde les trois meilleurs. » Faire voter la salle : « On la garde ? »

INSISTER — Les trois cartes de droite : quantité puis tri, partir des questions clients, caler sur les temps forts.

TRANSITION — « Pour que ces idées forment un tout, il faut une ligne éditoriale. »`,
  `⏱ 4 min · LIGNE ÉDITORIALE

OBJECTIF — Montrer qu’une ligne éditoriale = piliers + ton, et comment l’IA aide à la formaliser.

DIRE — « Une ligne éditoriale répond à deux questions : de quoi parle-t-on, et comment. De quoi : cinq piliers, avec un poids. Chez Ardente, l’expertise café pèse 30 %, les offres seulement 15 % : on ne parle pas que de vendre. Comment : une promesse, un ton, et une liste de mots qu’on dit ou qu’on ne dit pas. »

INSISTER — L’astuce du bas : donnez à l’IA vos dix meilleurs posts et demandez-lui d’en déduire votre ligne. Ensuite, collez cette charte en tête de chaque prompt : c’est le secret pour que tout sonne « marque ».

TRANSITION — « On a tout pour générer le calendrier. »`,
  `⏱ 4 min · CALENDRIER ÉDITORIAL (4 clics)

OBJECTIF — Montrer un calendrier d’un mois généré à partir des éléments précédents.

DIRE — « Novembre chez Ardente. Quatre semaines avec une logique : teasing, lancement, preuves, conversion. » → révéler semaine par semaine. « Les couleurs correspondent aux piliers : on voit tout de suite si on parle trop de l’offre. » Montrer le prompt en bas : « Il tient en trois lignes parce que le persona et la ligne éditoriale sont déjà dans la conversation. »

INSISTER — Généré en 2 minutes, ajusté en 15 : le temps gagné est dans la structure, pas dans la relecture.

TRANSITION — « Petit QCM avant l’atelier. »`,
  `⏱ 2 min · QCM 1 (personas)

OBJECTIF — Vérifier la bonne posture face à un persona généré.

DIRE — « Vote à main levée. » Puis cliquer les réponses. Bonne réponse : B. « Un persona généré est une hypothèse de travail, à confronter à vos données. »

TRANSITION — « À vous : atelier 1. »`,
  `⏱ 30 min · ATELIER 1 — CALENDRIER D’UN MOIS (minuteur)

OBJECTIF — Produire un calendrier éditorial complet avec l’IA.

DIRE — « Trente minutes, en binôme, sur Ardente ou sur votre marque. Quatre étapes : le prompt cible et persona avec les six ingrédients ; trente idées dont vous gardez douze ; la ligne éditoriale ; puis le calendrier en tableau, que vous faites critiquer par l’IA. Vos livrables sont à droite. Et chaque prompt qui marche va dans votre bibliothèque. »

ANIMATION — Lancer le minuteur. Passer dans les binômes à 10 minutes : vérifier que le persona est précis. À 20 minutes : vérifier qu’ils demandent un tableau. Proposer le bonus CSV aux plus rapides. Faire cocher les critères de réussite à la fin.

TRANSITION — « Regardons un exemple de restitution. »`,
  `⏱ 4 min · EXEMPLE DE RESTITUTION

OBJECTIF — Montrer un résultat type et l’œil critique attendu.

DIRE — « Voici ce que l’IA a produit pour Ardente après deux relances. Ce qui est bien : la progression, un appel à l’action sur chaque ligne. Ce qui est à corriger : le 11 novembre est férié, l’IA ne l’a pas vu. Et le témoignage client doit être réel, validé par le client. L’IA ne peut pas inventer un client. »

ANIMATION — Demander à un ou deux binômes de montrer une ligne de leur calendrier dont ils sont fiers, et une correction qu’ils ont faite.

TRANSITION — « Je résume le module. »`,
  `⏱ 1 min · SYNTHÈSE M2

OBJECTIF — Clore le module, relier au carnet de campagne.

DIRE — « Cinq idées. » Les lire. « Vous avez maintenant une cible, un persona, une ligne éditoriale et un calendrier. C’est la colonne vertébrale de votre mini-campagne. »

TRANSITION — « Pause de 15 minutes. Au retour : on écrit les contenus. »`,
];
// @@NOTES-END
