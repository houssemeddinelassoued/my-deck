// ─── Module 5 · Communication avec les candidats ────────────────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Chaque candidat
        <br />
        mérite une réponse
      </>
    }
    sub="Le silence est la première cause de mauvaise expérience candidat. Avec l’IA, une réponse personnalisée prend deux minutes : plus d’excuse."
    dur="14:40 – 15:25 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · une bibliothèque de messages RH
      </Tag>
    }
  >
    <SecItem n={1}>Sept moments clés, de la confirmation à l’onboarding</SecItem>
    <SecItem n={2}>Maîtriser le ton : formel, neutre, chaleureux</SecItem>
    <SecItem n={3}>Le message le plus difficile : le refus</SecItem>
    <SecItem n={4}>Personnaliser à grande échelle, sans erreur</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Les sept moments (explorateur interactif) ──────────────────────────────
const M5_MSG: { k: string; icon: IconName; tone: Tone; obj: string; body: string[]; rules: string[] }[] = [
  {
    k: 'Confirmation',
    icon: 'checkCircle',
    tone: 'teal',
    obj: 'Votre candidature est bien arrivée',
    body: ['Bonjour {{prénom}},', 'Merci pour votre candidature au poste de {{poste}}. Nous la lisons avec attention et vous répondrons sous 10 jours, quelle que soit la suite.', 'L’équipe RH de Solvéa'],
    rules: ['Envoyée le jour même', 'Un délai de réponse réel', 'Aucune promesse sur l’issue'],
  },
  {
    k: 'Présélection',
    icon: 'search',
    tone: 'blue',
    obj: 'Échangeons 15 minutes au téléphone ?',
    body: ['Bonjour {{prénom}},', 'Votre parcours en {{point_fort}} nous a donné envie d’en savoir plus. Seriez-vous disponible pour un appel de 15 minutes ? Voici trois créneaux : {{créneaux}}.', 'Léa, chargée de recrutement'],
    rules: ['Un élément précis du parcours', 'Des créneaux concrets', 'Durée et objet annoncés'],
  },
  {
    k: 'Convocation',
    icon: 'calendar',
    tone: 'violet',
    obj: 'Entretien le {{date}} à {{heure}}',
    body: ['Bonjour {{prénom}},', 'Nous vous attendons le {{date}} à {{heure}}, {{adresse}}, pour 45 minutes avec Karim (manager) et moi-même : échange, puis courte mise en situation.', 'Un besoin d’aménagement ? Dites-le-nous.', 'Léa'],
    rules: ['Date, heure, lieu, durée, interlocuteurs', 'Le déroulé, pour réduire le stress', 'Proposer un aménagement (handicap)'],
  },
  {
    k: 'Relance',
    icon: 'bell',
    tone: 'yellow',
    obj: 'Toujours partant·e pour notre échange ?',
    body: ['Bonjour {{prénom}},', 'Je me permets de revenir vers vous : le créneau proposé vous convient-il ? Si votre situation a changé, un simple mot suffit, sans justification.', 'Belle journée, Léa'],
    rules: ['Une seule relance, courtoise', 'Laisser une porte de sortie', 'Pas de reproche'],
  },
  {
    k: 'Proposition',
    icon: 'star',
    tone: 'green',
    obj: 'Bonne nouvelle : nous aimerions travailler avec vous',
    body: ['Bonjour {{prénom}},', 'Après nos échanges, nous avons le plaisir de vous proposer le poste de {{poste}} : CDI, {{salaire}}, début le {{date_début}}. Karim vous appellera demain pour en parler.', 'Réponse souhaitée d’ici le {{date_limite}}.'],
    rules: ['Les conditions exactes, vérifiées', 'Un appel humain d’abord', 'Un délai de réflexion raisonnable'],
  },
  {
    k: 'Refus',
    icon: 'mail',
    tone: 'coral',
    obj: 'Votre candidature au poste de {{poste}}',
    body: ['Bonjour {{prénom}},', 'Merci pour le temps consacré à nos échanges. Nous avons retenu un profil plus expérimenté en {{critère}}. Vos qualités de {{point_fort}} ont été remarquées.', 'Nous vous souhaitons pleine réussite.'],
    rules: ['Rapide, même si c’est non', 'Un motif factuel, lié au poste', 'Un retour utile si entretien'],
  },
  {
    k: 'Onboarding',
    icon: 'graduation',
    tone: 'pink',
    obj: 'J−7 : tout ce qu’il faut savoir pour lundi',
    body: ['Bonjour {{prénom}},', 'Toute l’équipe a hâte de vous accueillir lundi à 9 h. Au programme : café d’accueil, visite, puis formation avec Nadia, votre binôme. Parking : {{info}}.', 'Une question d’ici là ? Écrivez-moi.'],
    rules: ['Envoyé une semaine avant', 'Le programme du premier jour', 'Un contact nominatif'],
  },
];

const M5_Parcours: Page = () => {
  const [i, setI] = useState(0);
  const m = M5_MSG[i];
  return (
    <Frame mod={5} kind="demo">
      <Title>Sept moments, sept messages : le parcours candidat</Title>
      <Lede>Cliquez une étape : un modèle généré avec l’IA, puis relu. Les variables en violet changent à chaque envoi.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', alignItems: 'center', gap: 6 }}>
        {M5_MSG.map((x, j) => (
          <div key={x.k} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
            <button
              type="button"
              data-osd-interactive
              onClick={(e) => {
                e.currentTarget.blur();
                setI(j);
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '12px 6px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 14,
                background: j === i ? STRONG[x.tone] : C.card,
                color: j === i ? (x.tone === 'yellow' ? C.ink : '#fff') : C.soft,
                boxShadow: j === i ? '0 10px 24px -14px rgba(11,31,92,.7)' : SHADOW_SM,
                fontFamily: body,
                fontWeight: 700,
                fontSize: 20,
                transition: `all 250ms ${EASE}`,
              }}
            >
              <Icon name={x.icon} size={30} />
              {x.k}
            </button>
            {j < M5_MSG.length - 1 ? <Icon name="arrow" size={20} color={C.faint} /> : null}
          </div>
        ))}
      </div>
      <div key={i} className={A.fade} style={{ position: 'absolute', left: 120, top: 400, width: 1680, display: 'grid', gridTemplateColumns: '1fr 520px', gap: 30, animationDuration: '350ms' } as CSSProperties}>
        <DocSheet kind={`Email · ${m.k}`} icon="mail" meta="modèle relu et validé" size={24}>
          <div style={{ fontWeight: 700, color: C.navy, marginBottom: 12 }}>Objet : {m.obj.split(/(\{\{[^}]+\}\})/).map((p, j) => (p.startsWith('{{') ? <span key={j} style={{ color: C.violet }}>{p}</span> : p))}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {m.body.map((l) => (
              <div key={l}>{l.split(/(\{\{[^}]+\}\})/).map((p, j) => (p.startsWith('{{') ? <span key={j} style={{ color: C.violet, fontWeight: 700 }}>{p}</span> : p))}</div>
            ))}
          </div>
        </DocSheet>
        <div style={{ background: T[m.tone].bg, borderRadius: 18, padding: '24px 28px', boxShadow: `inset 0 0 0 2px ${T[m.tone].bd}` }}>
          <Eyebrow c={T[m.tone].fg} size={20}>
            Les règles du message
          </Eyebrow>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {m.rules.map((r) => (
              <Bullet key={r} size={25} tone={m.tone}>
                {r}
              </Bullet>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Maîtriser le ton (curseur) ─────────────────────────────────────────────
const M5_TONES = [
  {
    l: 'Formel',
    tone: 'navy' as Tone,
    t: 'Madame, Monsieur,\nNous accusons réception de votre candidature au poste de conseiller·ère clientèle. Après étude de votre dossier, nous souhaiterions convenir d’un entretien téléphonique. Nous vous prions de bien vouloir nous indiquer vos disponibilités.\nVeuillez agréer nos salutations distinguées.',
    use: 'Postes de direction, secteur public, première prise de contact très institutionnelle.',
  },
  {
    l: 'Neutre',
    tone: 'blue' as Tone,
    t: 'Bonjour Camille,\nMerci pour votre candidature au poste de conseiller·ère clientèle. Votre profil nous intéresse et nous aimerions échanger avec vous par téléphone. Pouvez-vous nous indiquer vos disponibilités cette semaine ?\nCordialement, Léa',
    use: 'La valeur par défaut : professionnel, clair, adapté à la plupart des situations.',
  },
  {
    l: 'Chaleureux',
    tone: 'pink' as Tone,
    t: 'Bonjour Camille,\nVotre expérience au rayon chauffage nous a tout de suite parlé : c’est exactement ce que vivent nos clients l’hiver ! On aimerait beaucoup en discuter avec vous, 15 minutes au téléphone. Mardi ou jeudi, ça vous irait ?\nÀ très vite, Léa',
    use: 'Postes en tension, culture d’entreprise proche, candidats jeunes ou en reconversion.',
  },
];

const M5_Ton: Page = () => {
  const [t, setT] = useState(1);
  const m = M5_TONES[t];
  return (
    <Frame mod={5} kind="demo">
      <Title>Maîtriser le ton : le même message, trois registres</Title>
      <Lede>Faites glisser le curseur. Prompt : « Réécris sur un ton <V>registre</V>, mêmes informations. »</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', alignItems: 'center', gap: 30 }}>
        {M5_TONES.map((x, i) => (
          <span key={x.l} style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: i === t ? STRONG[x.tone] : C.faint, width: 170, textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center' }}>
            {x.l}
          </span>
        ))}
        <Range value={t} onChange={setT} min={0} max={2} step={1} w={900} tone={m.tone} />
      </div>
      <div key={t} className={A.fade} style={{ position: 'absolute', left: 120, top: 370, width: 1680, display: 'grid', gridTemplateColumns: '1fr 520px', gap: 30, animationDuration: '350ms' } as CSSProperties}>
        <DocSheet kind={`Message de présélection · ton ${m.l.toLowerCase()}`} icon="mail" size={26}>
          <div style={{ whiteSpace: 'pre-line', lineHeight: 1.55 }}>{m.t}</div>
        </DocSheet>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card tone={m.tone} icon="target" title="Quand l’utiliser" size={24}>
            {m.use}
          </Card>
          <Callout title="Charte de ton" tone="yellow" icon="book" size={22}>
            Décrivez votre ton une fois pour toutes (tutoiement ou non, emojis ou non, formule de fin) et collez-le dans chaque prompt.
          </Callout>
        </div>
      </div>
    </Frame>
  );
};

// ─── Le refus ───────────────────────────────────────────────────────────────
const M5_Refus: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Le message le plus difficile : le refus</Title>
    <Lede>Un candidat refusé reste un client, un prescripteur, peut-être un futur collègue. Il se souvient surtout de la manière.</Lede>
    <BeforeAfter
      labels={['Le refus type', 'Le refus soigné']}
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}
      before={
        <DocSheet kind="Email · envoyé 7 semaines après l’entretien" icon="mail" size={24}>
          Madame, Monsieur,
          <br />
          Nous avons le regret de vous informer que votre candidature n’a pas été retenue. Nous conservons votre CV dans notre CVthèque.
          <br />
          Cordialement, le service RH
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag tone="coral" size={17}>Trop tard</Tag>
            <Tag tone="coral" size={17}>Impersonnel</Tag>
            <Tag tone="coral" size={17}>Aucun retour</Tag>
            <Tag tone="coral" size={17}>CV conservé sans information</Tag>
          </div>
        </DocSheet>
      }
      after={
        <DocSheet kind="Email · envoyé 4 jours après l’entretien" icon="mail" size={23}>
          Bonjour Camille,
          <br />
          Merci pour notre échange de mardi et pour votre mise en situation. Nous avons retenu une personne ayant déjà l’expérience des réclamations téléphoniques.
          <br />
          Votre écoute et la clarté de votre réponse écrite ont été très appréciées. Si vous le souhaitez, nous pouvons garder votre candidature 2 ans pour un futur poste : répondez
          simplement « oui ».
          <br />
          Bonne continuation, Léa
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag tone="green" size={17}>Rapide</Tag>
            <Tag tone="green" size={17}>Motif factuel</Tag>
            <Tag tone="green" size={17}>Retour positif</Tag>
            <Tag tone="green" size={17}>Conservation consentie</Tag>
          </div>
        </DocSheet>
      }
    />
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptPanel title="prompt · refus personnalisé" size={18} cls={A.right} style={dl(200)}>
        Rédige un refus après entretien, ton respectueux et chaleureux, 100 mots. Motif : <V>motif_factuel</V>. Point fort à valoriser : <V>point_fort</V>. N’ajoute aucun motif ni
        compliment que je n’ai pas fourni.
      </PromptPanel>
      <Callout title="Jamais dans un refus" tone="coral" icon="x" cls={A.right} style={dl(350)} size={21}>
        Un motif lié à un critère discriminatoire, un avis sur la personnalité, une promesse de « prochaine fois ».
      </Callout>
    </div>
  </Frame>
);

// ─── Personnaliser à grande échelle ─────────────────────────────────────────
const M5Gen = ({ name, pf, crit, d }: { name: string; pf: string; crit: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', fontSize: 20, lineHeight: 1.45, color: C.ink, ...dl(d) }}>
    Bonjour <strong style={{ color: C.violet }}>{name}</strong>, merci pour notre échange. Nous avons retenu un profil plus expérimenté en <strong style={{ color: C.violet }}>{crit}</strong>. Votre{' '}
    <strong style={{ color: C.violet }}>{pf}</strong> a été remarquée…
  </div>
);

const M5_Echelle: Page = () => (
  <Frame mod={5} beats={1}>
    <Title>Personnaliser à grande échelle, sans laisser l’IA inventer</Title>
    <Lede>Un modèle, vos variables, et l’IA assemble. Les informations viennent de vous, jamais d’elle.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px' }}>
      <PanelTitle icon="table">Vos variables (issues de vos grilles)</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', gap: 10, fontSize: 20 }}>
        {['prénom', 'point fort', 'critère manquant'].map((h) => (
          <span key={h} style={{ fontFamily: mono, fontSize: 18, color: C.violet, fontWeight: 700 }}>
            {`{{${h}}}`}
          </span>
        ))}
        {[
          ['Camille', 'écoute', 'réclamations téléphoniques'],
          ['Yanis', 'réponse écrite très claire', 'notions techniques'],
          ['Inès', 'connaissance des pompes à chaleur', 'gestion d’un fort volume d’appels'],
        ].flatMap((r) =>
          r.map((c, j) => (
            <span key={r[0] + j} style={{ padding: '8px 10px', background: T.grey.bg, borderRadius: 8, color: C.ink }}>
              {c}
            </span>
          )),
        )}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <PanelTitle icon="sparkles" c={C.violet}>
        Messages assemblés par l’IA
      </PanelTitle>
      <M5Gen name="Camille" pf="écoute" crit="réclamations téléphoniques" d={200} />
      <M5Gen name="Yanis" pf="réponse écrite très claire" crit="notions techniques" d={300} />
      <M5Gen name="Inès" pf="connaissance des pompes à chaleur" crit="gestion d’un fort volume d’appels" d={400} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'flex', gap: 24 }}>
      <Callout title="Le piège du « point fort » inventé" tone="coral" icon="alert" size={22} style={{ flex: 1 }}>
        Sans variable, l’IA écrit « votre dynamisme a été remarqué » à tout le monde. Le candidat le sent, et c’est faux.
      </Callout>
      <Callout title="Relire avant d’envoyer" tone="green" icon="eye" size={22} style={{ flex: 1 }}>
        Un coup d’œil par message : bon prénom, bon poste, bon motif. Les erreurs de fusion arrivent aussi avec l’IA.
      </Callout>
    </div>
  </Frame>
);

// ─── Repérez les erreurs : une convocation générée ──────────────────────────
const M5_BAD = [
  { t: 'Objet : Convocation entretien', bold: true },
  { t: 'Salut Camille,' },
  { t: 'Suite à votre candidature au poste de Développeur web,' },
  { t: 'nous vous convoquons le jeudi 31 novembre à 14 h' },
  { t: 'dans nos locaux, 12 avenue de la Gare à Angers.' },
  { t: 'Merci d’apporter pièce d’identité, carte Vitale et une photo.' },
  { t: 'Karim a déjà hâte de vous accueillir dans son équipe !' },
  { t: 'Cordialement, [Votre nom]' },
];
const M5_LINE = 56;
const M5_TOP = 230 + 50 + 18;

const M5_Erreurs: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Repérez les huit erreurs de cette convocation</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 230, width: 980, boxSizing: 'border-box', background: '#fff', borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, boxSizing: 'border-box', padding: '0 22px', background: C.panel, borderBottom: `1.5px solid ${C.rule}` }}>
        <Icon name="mail" size={24} color={C.navy} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>Brouillon · à envoyer à Camille (relation client, Nantes)</span>
      </div>
      <div style={{ padding: '18px 24px' }}>
        {M5_BAD.map((l) => (
          <div key={l.t} style={{ height: M5_LINE, display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: l.bold ? 700 : 400, color: l.bold ? C.navy : C.ink }}>
            {l.t}
          </div>
        ))}
      </div>
    </div>
    <Hotspot n={1} x={1140} y={M5_TOP + M5_LINE * 0.5} title="Objet sec et administratif" w={560}>
      « Convocation » sonne comme une convocation au tribunal. Préférez « Notre entretien du mardi 18 novembre ».
    </Hotspot>
    <Hotspot n={2} x={1140} y={M5_TOP + M5_LINE * 1.5} title="Tutoiement hors charte" w={560}>
      Le ton doit suivre votre charte. Collez-la dans le prompt.
    </Hotspot>
    <Hotspot n={3} x={1140} y={M5_TOP + M5_LINE * 2.5} title="Mauvais poste : erreur de fusion" w={560}>
      Camille a postulé en relation client. L’IA a mélangé deux dossiers de la même conversation.
    </Hotspot>
    <Hotspot n={4} x={1140} y={M5_TOP + M5_LINE * 3.5} title="Date impossible" w={560}>
      Le 31 novembre n’existe pas. L’IA ne vérifie pas un calendrier : toujours contrôler dates et jours.
    </Hotspot>
    <Hotspot n={5} x={1140} y={M5_TOP + M5_LINE * 4.5} title="Adresse inventée" w={560}>
      Le poste est à Nantes ; l’adresse d’Angers a été « complétée » par l’IA. Hallucination typique.
    </Hotspot>
    <Hotspot n={6} x={1140} y={M5_TOP + M5_LINE * 5.5} title="Données inutiles demandées" w={560}>
      Carte Vitale et photo n’ont rien à faire dans un entretien : minimisation des données (RGPD).
    </Hotspot>
    <Hotspot n={7} x={1140} y={M5_TOP + M5_LINE * 6.5} title="Promesse implicite d’embauche" w={560}>
      « Vous accueillir dans son équipe » : à éviter tant que la décision n’est pas prise.
    </Hotspot>
    <Hotspot n={8} x={1140} y={M5_TOP + M5_LINE * 7.5} title="Signature non remplie" w={560}>
      Le placeholder [Votre nom] trahit le copier-coller. Et il manque la durée, l’interlocuteur, le déroulé.
    </Hotspot>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(500) }}>
      Laissez le groupe chercher deux minutes, puis cliquez les pastilles une à une.
    </Hint>
  </Frame>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M5_Atelier: Page = () => (
  <LabPage
    mod={5}
    n="4"
    title="Créer une bibliothèque de messages RH"
    defi="messages"
    who="En binôme, puis mise en commun"
    minutes={20}
    where={
      <>
        <strong>7 modèles</strong> (convocation, confirmation, relance, refus, présélection, proposition, onboarding), chacun avec ses <strong>variables</strong>, et une{' '}
        <strong>charte de ton</strong> de 5 lignes pour {PME}.
      </>
    }
    objective={<>Construire une bibliothèque réutilisable de messages candidats, personnalisables et conformes à la charte de ton de {PME}.</>}
    crit={
      <>
        <CheckItem id="a4c1" size={22}>Les 7 moments couverts</CheckItem>
        <CheckItem id="a4c2" size={22}>Variables explicites {'{{…}}'}</CheckItem>
        <CheckItem id="a4c3" size={22}>Ton homogène, charte respectée</CheckItem>
        <CheckItem id="a4c4" size={22}>Aucune promesse ni information inventée</CheckItem>
      </>
    }
  >
    <div>1. Rédigez la charte de ton (vouvoiement, longueur, signature, emojis).</div>
    <div>2. Générez les 7 modèles en une fois, charte collée dans le prompt.</div>
    <div>3. Relisez : faits, promesses, variables. Corrigez à la main.</div>
    <div>4. Testez un modèle avec les variables d’un·e candidat·e fictif·ve.</div>
    <Bonus>Demandez la version SMS (160 caractères) de la convocation et de la relance.</Bonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="Garder un CV"
    q="Camille n’est pas retenue, mais vous aimeriez la recontacter pour un futur poste. Que faites-vous de sa candidature ?"
    explain="La conservation d’une candidature non retenue doit être limitée dans le temps (la CNIL recommande 2 ans maximum après le dernier contact) et la personne doit en être informée, avec la possibilité de s’y opposer ou de demander la suppression."
  >
    <Opt why="Une conservation illimitée est contraire au principe de limitation de la durée de conservation du RGPD.">
      Je la garde dans la CVthèque sans limite de durée : elle pourrait toujours servir.
    </Opt>
    <Opt ok why="Information claire, durée limitée, droit de s’y opposer : c’est la pratique recommandée.">
      Je l’informe dans le message de refus, je propose une conservation de 2 ans maximum, et elle peut refuser.
    </Opt>
    <Opt why="Supprimer est conforme, mais vous perdez un vivier. On peut conserver dans un cadre transparent.">
      Je supprime tout immédiatement, c’est obligatoire.
    </Opt>
    <Opt why="Un assistant IA grand public n’est pas une CVthèque : vous perdez la maîtrise des données.">
      Je colle son CV dans mon assistant IA pour le retrouver plus tard.
    </Opt>
  </QcmPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Ce qu’on retient du module 5</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="green" d={100}>
        <strong>Sept moments</strong>, sept modèles : plus aucun candidat sans réponse.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Une <strong>charte de ton</strong> collée dans chaque prompt.
      </SynthRow>
      <SynthRow n={3} tone="coral" d={300}>
        Le refus : <strong>rapide, factuel, valorisant</strong>, conservation du CV consentie.
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        La personnalisation vient de <strong>vos variables</strong>, jamais de l’imagination de l’IA.
      </SynthRow>
      <SynthRow n={5} tone="yellow" d={500}>
        On <strong>relit chaque message</strong> : dates, lieux, postes, promesses.
      </SynthRow>
    </div>
    <ReflexCard title="Mon réflexe · M5">
      Avant d’envoyer un message généré : <strong>bon prénom, bon poste, bonne date, aucune promesse</strong>. Dix secondes, zéro gaffe.
    </ReflexCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Parcours, M5_Ton, M5_Refus, M5_Echelle, M5_Erreurs, M5_Atelier, M5_Qcm, M5_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M5 · 14:40

OBJECTIF — Annoncer le module sur la communication candidat.

DIRE — « Question : combien d’entre vous ont déjà postulé quelque part sans jamais recevoir de réponse ? » Laisser lever les mains. « C’est la première cause de mauvaise expérience candidat. Et c’est souvent une question de temps. Avec l’IA, une réponse personnalisée prend deux minutes. Dans ce module : les sept moments clés, le ton, le refus, et la personnalisation à grande échelle. »

TRANSITION — « Voici le parcours. »`,
  `⏱ 6 min · LES SEPT MOMENTS (explorateur interactif)

OBJECTIF — Couvrir les sept messages du programme : confirmation, présélection, convocation, relance, proposition, refus, onboarding.

DIRE — Cliquer chaque étape. Pour chacune, lire l’objet et une règle. « Confirmation : le jour même, avec un délai réel. Présélection : un élément précis du parcours, et des créneaux concrets. Convocation : tout ce qu’il faut pour venir serein, et la proposition d’aménagement pour les personnes en situation de handicap. Relance : une seule, avec une porte de sortie. Proposition : un appel humain d’abord. Refus : on y revient dans un instant. Onboarding : une semaine avant, le programme du premier jour. »

INSISTER — Les variables en violet : ce sont elles qui personnalisent, et c’est vous qui les remplissez.

TRANSITION — « Un même message peut s’écrire de plusieurs façons. »`,
  `⏱ 4 min · LE TON (curseur interactif)

OBJECTIF — Montrer que l’IA module le registre sans changer les faits.

DIRE — Faire glisser le curseur. « Formel : “Madame, Monsieur”, salutations distinguées. Neutre : la valeur par défaut. Chaleureux : on cite le rayon chauffage, on propose deux jours. Même information, trois expériences très différentes. » Puis la charte de ton : « Écrivez-la une fois, collez-la dans chaque prompt : c’est ce qui rend vos messages homogènes, quel que soit le collègue qui les envoie. »

ANIMATION — Demander au groupe : « Lequel enverriez-vous chez vous ? » Les réponses varient selon les entreprises : c’est le but.

TRANSITION — « Le message le plus difficile à écrire, c’est le refus. »`,
  `⏱ 5 min · LE REFUS (avant / après)

OBJECTIF — Montrer un refus soigné et ses règles.

DIRE — « Voici le refus type. » Lire. « Sept semaines après l’entretien, impersonnel, aucun retour, et un CV conservé sans information. » Cliquer « Le refus soigné » : « Quatre jours après. Un motif factuel, lié au poste. Un retour positif, précis. Et une proposition de conservation du CV, avec l’accord de la personne. » Puis le prompt : « N’ajoute aucun motif ni compliment que je n’ai pas fourni. »

INSISTER — Le motif d’un refus ne doit jamais renvoyer à un critère discriminatoire, même maladroitement (« équipe déjà jeune », « poste physique »…).

TRANSITION — « Et quand vous avez trente refus à envoyer ? »`,
  `⏱ 4 min · PERSONNALISER À GRANDE ÉCHELLE (1 clic)

OBJECTIF — Montrer le principe modèle + variables, et ses pièges.

DIRE — « Un tableau, trois colonnes, issues de vos grilles d’entretien : prénom, point fort, critère manquant. L’IA assemble trois messages réellement personnalisés. » Clic : « Le piège : sans variable, l’IA invente un point fort générique. Et l’autre piège : les erreurs de fusion, mauvais prénom, mauvais poste. On relit chaque message. »

TRANSITION — « Justement : à vous de repérer les erreurs. »`,
  `⏱ 5 min · REPÉREZ LES ERREURS (hotspots)

OBJECTIF — Exercer la relecture critique d’un message généré.

DIRE — « Voici une convocation générée par l’IA, prête à partir pour Camille, relation client à Nantes. Il y a huit erreurs. Deux minutes. » Puis cliquer les pastilles une à une.

INSISTER — Les erreurs 3, 4 et 5 sont typiques de l’IA : mélange entre dossiers d’une même conversation, date impossible, adresse « complétée ». L’erreur 6 est une question RGPD : on ne demande que ce qui est nécessaire.

TRANSITION — « À vous de construire votre bibliothèque de messages. »`,
  `⏱ 20 min · ATELIER 4 (minuteur)

OBJECTIF — Créer une bibliothèque de messages RH, conforme au programme.

CONSIGNE À DIRE — « En binôme, vingt minutes. D’abord la charte de ton de Solvéa en cinq lignes. Puis les sept modèles en un seul prompt, charte collée. Ensuite, relecture : faits, promesses, variables. Enfin, testez un modèle avec un candidat fictif. »

ANIMATION — Lancer le minuteur. Vérifier que les binômes ne laissent pas l’IA inventer de détails (adresse, salaire, noms). Proposer aux plus rapides le bonus SMS.

DÉBRIEF — Mise en commun : chaque binôme lit son meilleur refus. Le groupe choisit le plus réussi : il pourra servir de référence.`,
  `⏱ 3 min · QCM 5

OBJECTIF — Vérifier la règle de conservation des candidatures.

ANIMATION — Vote, clic sur la réponse, puis les pièges. Préciser que la recommandation de 2 ans vient de la CNIL (référentiel sur le recrutement) ; vérifier la politique interne de l’entreprise.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE M5

DIRE — Relire les cinq lignes. « Et le réflexe des dix secondes : bon prénom, bon poste, bonne date, aucune promesse. »

TRANSITION — « Pause de quinze minutes. Ensuite, on quitte le recrutement pour les collaborateurs déjà en poste. »`,
];
// @@NOTES-END
