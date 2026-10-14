// ─── Module 7 · Éthique, confidentialité et projet final ────────────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title={
      <>
        Éthique, confidentialité
        <br />
        et cas pratique final
      </>
    }
    sub="Les règles du jeu, rassemblées : données personnelles, RGPD, biais, discrimination, validation humaine. Puis on enchaîne tout un recrutement, de bout en bout."
    dur="16:15 – 17:20 · cas pratique inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 5 · cas pratique de bout en bout
      </Tag>
    }
  >
    <SecItem n={1}>Données personnelles et confidentialité : que peut-on coller ?</SecItem>
    <SecItem n={2}>Biais algorithmiques et risques de discrimination</SecItem>
    <SecItem n={3}>Le RGPD appliqué à l’IA en RH</SecItem>
    <SecItem n={4}>La validation humaine, la vraie</SecItem>
    <SecItem n={5}>Cas pratique : du besoin à la communication candidat</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Données personnelles : que peut-on coller ? ────────────────────────────
const M7_LBL: [string, string, string] = ['OUI', 'NON', 'APRÈS ANONYMISATION'];

const M7_Donnees: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>« Je peux le coller dans l’IA ? » Huit cas à trancher</Title>
    <Lede>Donnée personnelle : toute information qui identifie une personne, même indirectement. Votez, puis cliquez.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Verdict labels={M7_LBL} ok q="La fiche de poste du technicien de maintenance" why="Aucune donnée personnelle : c’est un document sur le poste, pas sur une personne." />
      <Verdict labels={M7_LBL} mid ok q="Le CV d’une candidate, pour en faire une synthèse" why="Retirez nom, coordonnées, photo, âge, adresse ; utilisez un outil validé par l’entreprise." />
      <Verdict labels={M7_LBL} ok={false} q="Le certificat médical d’un salarié pour rédiger un courrier" why="Donnée de santé : catégorie particulière (RGPD, art. 9). Jamais dans un assistant IA." />
      <Verdict labels={M7_LBL} mid ok q="Les comptes rendus des entretiens annuels du service" why="Possible pour dégager des tendances, après anonymisation et dans un outil validé." />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14, ...dl(150) }}>
      <Verdict labels={M7_LBL} ok={false} q="Le tableau des salaires nominatifs pour analyser les écarts" why="Données nominatives et confidentielles. Travaillez sur des données agrégées, ou dans un outil interne sécurisé." />
      <Verdict labels={M7_LBL} ok q="Un accord d’entreprise pour en faire une FAQ" why="Document collectif, sans donnée personnelle. Vérifiez seulement sa confidentialité interne." />
      <Verdict labels={M7_LBL} ok={false} q="Un dossier disciplinaire pour préparer la lettre de sanction" why="Données sensibles et à fort enjeu juridique : rédigez à partir d’un modèle validé, sans l’IA." />
      <Verdict labels={M7_LBL} mid ok q="Le message d’un candidat mécontent, pour préparer la réponse" why="Retirez nom et coordonnées : le contenu suffit pour proposer une réponse." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 900, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(500) }}>
      <Icon name="shieldCheck" size={30} color={C.green} />
      Pseudonymiser (« Candidate C » au lieu du nom) réduit le risque ; une personne peut rester identifiable par recoupement : retirez aussi les détails trop précis.
    </div>
  </Frame>
);

// ─── Confidentialité : quel outil ? ─────────────────────────────────────────
const M7Row = ({ q, a, b: bb, c }: { q: string; a: string; b: string; c: string }) => (
  <>
    <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, alignSelf: 'center' }}>{q}</div>
    <div style={{ background: T.coral.bg, borderRadius: 12, padding: '14px 16px', fontSize: 20, lineHeight: 1.35, color: T.coral.fg, fontWeight: 600 }}>{a}</div>
    <div style={{ background: T.yellow.bg, borderRadius: 12, padding: '14px 16px', fontSize: 20, lineHeight: 1.35, color: T.yellow.fg, fontWeight: 600 }}>{bb}</div>
    <div style={{ background: T.green.bg, borderRadius: 12, padding: '14px 16px', fontSize: 20, lineHeight: 1.35, color: T.green.fg, fontWeight: 600 }}>{c}</div>
  </>
);

const M7_Outils: Page = () => (
  <Frame mod={7}>
    <Title>Confidentialité : tous les outils ne se valent pas</Title>
    <Lede>Repères généraux, qui varient selon l’éditeur et l’offre. Votre DSI et votre DPO tranchent.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '330px 1fr 1fr 1fr', gap: 14 }}>
      <span />
      {[
        { t: 'Compte personnel gratuit', i: 'user' as IconName, tone: 'coral' as Tone },
        { t: 'Offre professionnelle / entreprise', i: 'briefcase' as IconName, tone: 'yellow' as Tone },
        { t: 'Outil déployé et validé par l’entreprise', i: 'shieldCheck' as IconName, tone: 'green' as Tone },
      ].map((h) => (
        <div key={h.t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile name={h.i} tone={h.tone} size={46} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 21, color: C.navy, lineHeight: 1.2 }}>{h.t}</span>
        </div>
      ))}
      <M7Row q="Données réutilisées pour entraîner ?" a="Souvent possible par défaut, parfois désactivable" b="En général non, selon le contrat" c="Non, encadré contractuellement" />
      <M7Row q="Contrat de sous-traitance RGPD" a="Aucun" b="Souvent disponible" c="Signé et vérifié par le DPO" />
      <M7Row q="Lieu et durée de conservation" a="Peu de maîtrise" b="Paramétrable selon l’offre" c="Défini dans la politique interne" />
      <M7Row q="Usage pour des données RH" a="Jamais de données personnelles" b="Données minimisées, si autorisé" c="Selon la politique interne" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(400) }}>
      <Callout title="Le « shadow AI »" tone="coral" icon="eyeOff" size={23}>
        Utiliser son compte personnel au travail, faute d’outil fourni, est le premier risque de fuite de données RH. La solution n’est pas l’interdiction : c’est un outil validé et
        des règles claires.
      </Callout>
    </div>
  </Frame>
);

// ─── Biais algorithmiques ───────────────────────────────────────────────────
const M7_Biais: Page = () => (
  <Frame mod={7} beats={3}>
    <Title>Biais algorithmiques : l’IA apprend le passé… et le répète</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 7px 0 0 ${C.coral}`, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 22 }}>
      <IconTile name="alert" tone="coral" size={60} solid />
      <div style={{ fontSize: 25, lineHeight: 1.45, color: C.ink }}>
        <strong>Un cas d’école.</strong> En 2018, Reuters révèle qu’Amazon a abandonné un outil expérimental de tri de CV : entraîné sur dix ans de recrutements majoritairement
        masculins, il pénalisait les CV contenant le mot « women’s ».
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 400, width: 1680, display: 'flex', alignItems: 'center', gap: 18 }}>
      <Card tone="grey" icon="archive" title="Données du passé" cls={b.on(1)} style={{ flex: 1 }} size={22}>
        Recrutements, promotions, textes du web : avec leurs déséquilibres.
      </Card>
      <div className={b.fade(2)}>
        <FlowArrow w={60} color={C.faint} />
      </div>
      <Card tone="violet" icon="brain" title="Le modèle apprend" cls={b.on(2)} style={{ flex: 1 }} size={22}>
        Il repère des régularités, y compris celles qu’on voudrait corriger.
      </Card>
      <div className={b.fade(3)}>
        <FlowArrow w={60} color={C.faint} />
      </div>
      <Card tone="coral" icon="loop" title="Il les reproduit" cls={b.on(3)} style={{ flex: 1 }} size={22}>
        Offres genrées, préférence pour les parcours « classiques », écoles connues.
      </Card>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Callout title="Le test de permutation" tone="violet" icon="loop" size={22}>
        Soumettez le même CV en changeant uniquement le prénom, l’âge ou l’adresse. Si l’avis de l’IA change, votre usage est biaisé.
      </Callout>
      <Callout title="Les variables « proxy »" tone="yellow" icon="search" size={22}>
        Code postal, trous dans le CV, sport pratiqué : des détails anodins qui renvoient indirectement à l’origine, au sexe ou à la santé.
      </Callout>
    </div>
  </Frame>
);

// ─── Risques de discrimination ──────────────────────────────────────────────
const M7_CRIT = [
  'Origine',
  'Sexe',
  'Mœurs',
  'Orientation sexuelle',
  'Identité de genre',
  'Âge',
  'Situation de famille',
  'Grossesse',
  'Caractéristiques génétiques',
  'Vulnérabilité économique',
  'Ethnie',
  'Nation',
  'Prétendue race',
  'Opinions politiques',
  'Activités syndicales',
  'Mandat électif',
  'Convictions religieuses',
  'Apparence physique',
  'Nom de famille',
  'Lieu de résidence',
  'Domiciliation bancaire',
  'État de santé',
  'Perte d’autonomie',
  'Handicap',
  'Langue parlée',
  'Lanceur d’alerte',
];

const M7_Discrim: Page = () => (
  <Frame mod={7}>
    <Title>Plus de 25 critères de discrimination interdits</Title>
    <Lede>Code du travail, art. L.1132-1 : aucun candidat écarté pour l’un de ces critères, par un humain ou par un outil.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1100, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {M7_CRIT.map((c, i) => (
        <span key={c} className={A.pop} style={{ ...dl(80 + i * 35) }}>
          <Tag tone={i % 3 === 0 ? 'coral' : i % 3 === 1 ? 'violet' : 'navy'} size={22}>
            {c}
          </Tag>
        </span>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 1270, top: 262, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Stat value="3 ans" label="d’emprisonnement et 45 000 € d’amende encourus pour discrimination à l’embauche (Code pénal, art. 225-2)" tone="coral" size={84} cls={A.right} style={dl(300)} />
      <Card tone="navy" icon="scale" title="L’outil ne vous protège pas" cls={A.right} style={dl(450)} size={21}>
        L’employeur reste responsable des décisions prises avec l’aide d’une IA. « C’est l’algorithme » n’est pas une défense.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1100, ...dl(1100) }}>
      <Callout title="Avec l’IA, deux risques" tone="yellow" icon="alert" size={22}>
        La discrimination <strong>directe</strong> (un critère dans le prompt) et <strong>indirecte</strong> (un critère neutre en apparence qui désavantage un groupe).
      </Callout>
    </div>
  </Frame>
);

// ─── Le RGPD appliqué ───────────────────────────────────────────────────────
const M7Rule = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '22px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const M7_RGPD: Page = () => (
  <Frame mod={7}>
    <Title>Le RGPD appliqué à l’IA en RH : six réflexes</Title>
    <Lede>Le RGPD n’interdit pas l’IA. Il impose de savoir pourquoi, avec quoi, combien de temps, et d’en informer les personnes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M7Rule icon="target" tone="blue" title="Finalité" d={100}>
        Une donnée collectée pour recruter sert à recruter. Pas à alimenter un autre projet.
      </M7Rule>
      <M7Rule icon="filter" tone="teal" title="Minimisation" d={200}>
        Seulement les données nécessaires : on retire ce qui n’aide pas à évaluer.
      </M7Rule>
      <M7Rule icon="clock" tone="violet" title="Durée limitée" d={300}>
        Candidatures non retenues : 2 ans maximum après le dernier contact (recommandation CNIL).
      </M7Rule>
      <M7Rule icon="megaphone" tone="green" title="Information" d={400}>
        Les candidats sont informés du traitement de leurs données, et de l’usage d’outils d’IA.
      </M7Rule>
      <M7Rule icon="lock" tone="navy" title="Sécurité" d={500}>
        Outils validés, accès limités, aucun compte personnel pour des données RH.
      </M7Rule>
      <M7Rule icon="hand" tone="coral" title="Droits des personnes" d={600}>
        Accès, rectification, opposition… et le droit à une intervention humaine (art. 22).
      </M7Rule>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(900) }}>
      <Icon name="users" size={26} color={C.electric} />
      Un doute ? Votre DPO (délégué à la protection des données) est l’interlocuteur naturel avant tout nouvel usage.
    </div>
  </Frame>
);

// ─── Validation humaine ─────────────────────────────────────────────────────
const M7_STEPS: { t: string; icon: IconName; ia: string; h: string }[] = [
  { t: 'Besoin', icon: 'briefcase', ia: 'Structure les notes', h: 'Valide avec le manager' },
  { t: 'Offre', icon: 'megaphone', ia: 'Rédige, décline', h: 'Vérifie chaque fait' },
  { t: 'Critères', icon: 'table', ia: 'Propose la grille', h: 'Fixe les poids' },
  { t: 'Analyse', icon: 'search', ia: 'Synthétise, cite', h: 'Décide qui rencontrer' },
  { t: 'Entretien', icon: 'chat', ia: 'Prépare, simule', h: 'Mène et note' },
  { t: 'Communication', icon: 'mail', ia: 'Rédige les messages', h: 'Relit et envoie' },
];

const M7_Validation: Page = () => (
  <Frame mod={7} beats={2}>
    <Title>La validation humaine, la vraie : pas un tampon</Title>
    <Lede>À chaque étape, l’IA prépare et un humain tranche. Une validation qui ne modifie jamais rien n’est plus une validation.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
      {M7_STEPS.map((s, i) => (
        <div key={s.t} style={{ display: 'flex', flexDirection: 'column', gap: 10, ...dl(i * 80) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: display, fontWeight: 800, fontSize: 22, color: C.navy }}>
            <IconTile name={s.icon} tone="navy" size={42} />
            {s.t}
          </div>
          <div style={{ background: T.violet.bg, borderRadius: 12, padding: '12px 14px', fontSize: 19, lineHeight: 1.35, color: T.violet.fg, fontWeight: 600, display: 'flex', gap: 8 }}>
            <Icon name="sparkles" size={20} /> {s.ia}
          </div>
          <div style={{ background: T.pink.bg, borderRadius: 12, padding: '12px 14px', fontSize: 19, lineHeight: 1.35, color: T.pink.fg, fontWeight: 700, display: 'flex', gap: 8, boxShadow: `inset 0 0 0 2px ${T.pink.bd}` }}>
            <Icon name="humanCheck" size={20} /> {s.h}
          </div>
        </div>
      ))}
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 820 }}>
      <Card tone="coral" icon="alert" title="Le biais d’automatisation" size={22}>
        Plus l’outil a raison souvent, plus on lui fait confiance… et moins on vérifie. C’est précisément là que l’erreur passe.
      </Card>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 980, top: 560, width: 820 }}>
      <Card tone="green" icon="checkCircle" title="Une validation réelle, c’est…" size={22}>
        Du temps pour relire · le droit de contredire l’IA · une décision motivée et tracée · une personne identifiée comme responsable.
      </Card>
    </div>
  </Frame>
);

// ─── Ma charte d’usage ──────────────────────────────────────────────────────
const M7_Charte: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Ma charte d’usage de l’IA en RH : où en êtes-vous ?</Title>
    <Lede>Cochez les règles que vous appliquez déjà ou que vous vous engagez à appliquer dès demain.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <CheckItem id="ch1" size={22}>J’utilise uniquement l’outil validé par l’entreprise</CheckItem>
        <CheckItem id="ch2" size={22}>Je minimise les données avant de coller</CheckItem>
        <CheckItem id="ch3" size={22}>Aucune donnée de santé, disciplinaire ou nominative</CheckItem>
        <CheckItem id="ch4" size={22}>Mes prompts excluent les critères discriminatoires</CheckItem>
        <CheckItem id="ch5" size={22}>« N’invente rien » dans chaque prompt</CheckItem>
        <CheckItem id="ch6" size={22}>Chaque avis sur un candidat cite une preuve</CheckItem>
        <CheckItem id="ch7" size={22}>Aucune décision sans regard humain</CheckItem>
        <CheckItem id="ch8" size={22}>Je relis tout message avant envoi</CheckItem>
        <CheckItem id="ch9" size={22}>Les candidats sont informés de l’usage de l’IA</CheckItem>
        <CheckItem id="ch10" size={22}>Je fais le test de permutation sur mes prompts</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Ma maturité"
          levels={[
            { min: 0, text: 'À construire : commencez par les règles 1, 2 et 7.', tone: 'coral' },
            { min: 5, text: 'En bonne voie : formalisez-les avec votre DPO.', tone: 'yellow' },
            { min: 9, text: 'Exemplaire : partagez votre charte avec l’équipe.', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── Cas pratique : le brief ────────────────────────────────────────────────
const M7_Cas: Page = () => (
  <LabPage
    mod={7}
    n="5"
    title="Cas pratique : un recrutement de bout en bout"
    defi="projet"
    who="En binôme"
    minutes={35}
    whereTitle="Le dossier à produire"
    where={
      <>
        1 profil validé · 1 offre + 1 déclinaison · 1 grille pondérée · 2 synthèses de CV fictifs · 1 guide d’entretien et sa grille · 2 messages (convocation, refus) ·{' '}
        <strong>1 registre des vérifications</strong> humaines.
      </>
    }
    objective={
      <>
        {PME} ouvre un nouveau poste : <strong>technicien·ne de maintenance itinérant·e</strong> à Angers. Enchaînez toutes les étapes vues aujourd’hui, en réutilisant vos
        prompts.
      </>
    }
    crit={
      <>
        <CheckItem id="a5c1" size={22}>Les 6 étapes produites et reliées</CheckItem>
        <CheckItem id="a5c2" size={22}>Une vérification humaine par étape</CheckItem>
        <CheckItem id="a5c3" size={22}>Aucune donnée réelle, aucun critère interdit</CheckItem>
        <CheckItem id="a5c4" size={22}>Restitution en 3 minutes</CheckItem>
      </>
    }
  >
    <div>1. Besoin → offre : structurez la note du manager (page suivante), rédigez l’offre.</div>
    <div>2. Critères → analyse : grille, puis synthèse de deux CV que vous inventez.</div>
    <div>3. Entretien : guide, grille d’évaluation, une question de mise en situation.</div>
    <div>4. Communication : convocation et refus, depuis votre bibliothèque.</div>
    <Bonus>Faites le test de permutation sur votre analyse de CV : l’avis change-t-il avec le prénom ?</Bonus>
  </LabPage>
);

// ─── Cas pratique : la chaîne ───────────────────────────────────────────────
const M7_Chaine: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Le cas pratique : la note du manager et la chaîne à produire</Title>
    <DocSheet kind="Email · de Julien, responsable SAV Angers" icon="mail" meta="ce matin" cls={A.left} style={{ position: 'absolute', left: 120, top: 200, width: 700 }} size={21}>
      Bonjour,
      <br />
      Il me faut un·e technicien·e de plus avant l’hiver : 6 interventions par jour chez les particuliers autour d’Angers, véhicule de service fourni, astreinte un week-end sur six.
      <br />
      Idéalement BTS fluides-énergies ou équivalent, mais un bon électricien motivé, on le forme aux pompes à chaleur. Habilitation électrique indispensable. Le contact client compte
      autant que la technique : les gens sont souvent stressés quand ça tombe en panne.
      <br />
      28 à 32 k€ selon expérience + primes d’astreinte.
      <br />
      Julien
    </DocSheet>
    <div style={{ position: 'absolute', left: 870, top: 200, width: 930, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { t: 'Besoin', m: 'M2', tone: 'navy' as Tone, out: 'Profil structuré + questions à Julien', chk: 'Julien valide le profil' },
        { t: 'Offre', m: 'M2', tone: 'blue' as Tone, out: 'Offre en 7 blocs + version courte', chk: 'Aucun fait inventé, aucun critère interdit' },
        { t: 'Critères', m: 'M3', tone: 'teal' as Tone, out: 'Grille pondérée avec échelles', chk: 'Figée avant les CV' },
        { t: 'Analyse', m: 'M3', tone: 'violet' as Tone, out: '2 synthèses avec preuves + tableau', chk: 'Décision humaine motivée' },
        { t: 'Entretien', m: 'M4', tone: 'yellow' as Tone, out: 'Guide 45 min + grille + mise en situation', chk: 'Questions toutes liées au poste' },
        { t: 'Communication', m: 'M5', tone: 'green' as Tone, out: 'Convocation + refus personnalisés', chk: 'Relus : dates, lieux, promesses' },
      ].map((s, i) => (
        <div key={s.t} className={A.right} style={{ display: 'grid', gridTemplateColumns: '210px 1fr 320px', alignItems: 'center', gap: 14, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[s.tone]}`, padding: '12px 18px', ...dl(150 + i * 90) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Num n={i + 1} tone={s.tone} size={34} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{s.t}</div>
              <div style={{ fontSize: 16, color: C.muted }}>prompts du {s.m}</div>
            </div>
          </div>
          <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.3 }}>{s.out}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600, color: T.pink.fg, lineHeight: 1.3 }}>
            <Icon name="humanCheck" size={22} /> {s.chk}
          </div>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 700, ...dl(800) }}>
      <Callout title="Piège glissé dans la note" tone="yellow" icon="search" size={21}>
        Un critère de la note mérite d’être questionné avec Julien. Lequel, et pourquoi ?
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz final éthique ─────────────────────────────────────────────────────
const M7_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz : éthique et conformité</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pseudonymiser un CV (« Candidate C ») suffit-il toujours à protéger la personne ?" explain="Non : des détails précis (employeur rare, dates, ville) permettent parfois de la retrouver. On retire aussi les détails trop identifiants.">
        <QOpt>Oui, sans nom elle est anonyme</QOpt>
        <QOpt ok>Non, elle peut rester identifiable par recoupement</QOpt>
        <QOpt>Oui, si l’outil est payant</QOpt>
      </QuizQ>
      <QuizQ q="Un outil propose de ne retenir que les candidats habitant à moins de 20 km. C’est…" explain="Le lieu de résidence est un critère de discrimination interdit (L.1132-1). Parlez plutôt des horaires et des déplacements réels du poste.">
        <QOpt>Une bonne pratique pour limiter le turnover</QOpt>
        <QOpt ok>Un critère de discrimination interdit</QOpt>
        <QOpt>Autorisé si le candidat est d’accord</QOpt>
      </QuizQ>
      <QuizQ q="Vous validez systématiquement les suggestions de l’IA depuis trois mois sans en modifier aucune. Le risque principal ?" explain="Le biais d’automatisation : la validation devient un tampon, et la décision est de fait automatisée.">
        <QOpt>Aucun, l’outil est fiable</QOpt>
        <QOpt ok>Le biais d’automatisation : la validation n’en est plus une</QOpt>
        <QOpt>Une perte de temps</QOpt>
      </QuizQ>
      <QuizQ q="Dans la note de Julien, quel critère faut-il questionner ?" explain="« Un bon électricien motivé » : la motivation n’est pas un critère observable. À traduire en indices concrets avec Julien (projets, formation suivie…). Et l’habilitation électrique est, elle, un vrai prérequis légal.">
        <QOpt>L’habilitation électrique</QOpt>
        <QOpt ok>« Motivé » : à traduire en indices observables</QOpt>
        <QOpt>Le salaire de 28 à 32 k€</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_Donnees, M7_Outils, M7_Biais, M7_Discrim, M7_RGPD, M7_Validation, M7_Charte, M7_Cas, M7_Chaine, M7_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M7 · 16:15

OBJECTIF — Annoncer le dernier module : rassembler les règles, puis le cas pratique final.

DIRE — « Toute la journée, on a posé des garde-fous au fil de l’eau. On les rassemble maintenant : données personnelles, confidentialité, biais, discrimination, RGPD, validation humaine. Vingt minutes de cadre, puis trente-cinq minutes de cas pratique où vous enchaînerez tout un recrutement. »

TRANSITION — « Première question, la plus concrète : qu’ai-je le droit de coller dans l’IA ? »`,
  `⏱ 5 min · QUE PEUT-ON COLLER ? (cartes à cliquer)

OBJECTIF — Savoir distinguer les données utilisables, à anonymiser, interdites.

DIRE — « Une donnée personnelle, c’est toute information qui permet d’identifier quelqu’un, même indirectement. Huit cas. Pour chacun : oui, non, ou après anonymisation. Votez. »

ANIMATION — Faire voter à main levée avant chaque clic. Insister sur les données de santé : catégorie particulière (article 9 du RGPD), jamais dans un assistant IA. Et sur la phrase du bas : pseudonymiser n’est pas anonymiser. Une « technicienne de 58 ans, seule femme de l’équipe d’Angers » reste identifiable sans son nom.

TRANSITION — « Et cela dépend aussi de l’outil. »`,
  `⏱ 4 min · QUEL OUTIL ?

OBJECTIF — Distinguer les niveaux de garantie des outils.

DIRE — « Trois familles. Le compte personnel gratuit : vos contenus peuvent être utilisés pour améliorer les modèles selon les paramètres, pas de contrat de sous-traitance. Les offres professionnelles : en général, des engagements contractuels. L’outil déployé par l’entreprise : validé par la DSI et le DPO. » Puis le shadow AI : « Le premier risque, c’est d’utiliser son compte perso faute d’outil. La solution n’est pas l’interdiction, c’est un outil validé et des règles claires. »

INSISTER — Ce tableau donne des repères généraux : les conditions changent selon les éditeurs et les offres. Renvoyer vers la DSI et le DPO de chaque entreprise.

TRANSITION — « Même avec le bon outil, il reste un risque : les biais. »`,
  `⏱ 4 min · BIAIS ALGORITHMIQUES (3 clics)

OBJECTIF — Comprendre d’où viennent les biais et comment les tester.

DIRE — « Un cas d’école : en 2018, Reuters révèle qu’Amazon a abandonné un outil expérimental de tri de CV. Entraîné sur dix ans de recrutements majoritairement masculins, il pénalisait les CV contenant le mot “women’s”, comme dans “capitaine du club d’échecs féminin”. » Clics : « Données du passé, le modèle apprend, il reproduit. » Puis les deux outils : « Le test de permutation : même CV, seul le prénom change. Et les variables proxy : un code postal peut dire l’origine sociale, un trou dans le CV peut dire une maternité. »

ANIMATION — Proposer de faire le test de permutation en bonus du cas pratique.

TRANSITION — « Ces biais mènent à un risque juridique très concret : la discrimination. »`,
  `⏱ 3 min · CRITÈRES DE DISCRIMINATION

OBJECTIF — Connaître les critères interdits et les sanctions.

DIRE — « L’article L.1132-1 du Code du travail liste plus de vingt-cinq critères. Certains sont évidents : origine, sexe, âge. D’autres moins : lieu de résidence, domiciliation bancaire, capacité à parler une autre langue que le français, nom de famille. La sanction pénale : jusqu’à trois ans de prison et 45 000 euros d’amende. Et l’employeur reste responsable des décisions prises avec une IA. » Puis la distinction directe / indirecte.

TRANSITION — « Le RGPD, appliqué à nos usages. »`,
  `⏱ 4 min · RGPD : SIX RÉFLEXES

OBJECTIF — Traduire le RGPD en réflexes opérationnels.

DIRE — Parcourir les six cartes. « Finalité, minimisation, durée, information, sécurité, droits. Le RGPD n’interdit pas l’IA. Il demande de savoir pourquoi on traite, avec quelles données, combien de temps, et d’en informer les personnes. Le droit à une intervention humaine, c’est l’article 22, vu ce matin. »

INSISTER — Le DPO de l’entreprise est l’interlocuteur à solliciter avant tout nouvel usage d’IA sur des données RH.

TRANSITION — « Dernier principe, le plus important : la validation humaine. »`,
  `⏱ 4 min · VALIDATION HUMAINE (2 clics)

OBJECTIF — Distinguer validation réelle et validation alibi.

DIRE — « Toute la journée en un tableau : à chaque étape, l’IA prépare, en violet, et un humain tranche, en rose. » Clic : « Le biais d’automatisation : plus l’outil a souvent raison, moins on vérifie. » Clic : « Une validation réelle : du temps, le droit de contredire, une décision motivée, un responsable identifié. »

TRANSITION — « Faisons le point sur vos pratiques. »`,
  `⏱ 3 min · MA CHARTE D’USAGE (checklist)

OBJECTIF — Faire s’approprier les règles sous forme d’engagements.

DIRE — « Dix règles. Cochez celles que vous appliquez déjà, ou que vous vous engagez à appliquer dès demain. Ce n’est pas un examen : c’est votre charte personnelle. »

ANIMATION — Inviter les participants à photographier la page : elle peut servir de base à une charte d’équipe.

TRANSITION — « Place au cas pratique. »`,
  `⏱ 35 min · ATELIER 5 · CAS PRATIQUE (minuteur)

OBJECTIF — Enchaîner tout le processus : besoin → offre → critères → analyse des candidatures → entretien → communication candidat.

CONSIGNE À DIRE — « Solvéa ouvre un nouveau poste : technicien·ne de maintenance itinérant·e à Angers. En binôme, trente-cinq minutes. Six étapes, en réutilisant vos prompts de la journée. Et pour chaque étape, notez dans un petit registre la vérification humaine que vous avez faite. À la fin, trois minutes de restitution par binôme. »

ANIMATION — Afficher la page suivante (la note de Julien et la chaîne) pendant le travail. Annoncer les jalons : à 10 min « offre terminée », à 20 min « analyse terminée », à 30 min « messages en cours ». Les CV sont à inventer par les binômes : rappeler qu’ils doivent être fictifs.

GESTION DU TEMPS — Avec un grand groupe, faire restituer 4 ou 5 binômes seulement.`,
  `⏱ (pendant le cas pratique) · LA NOTE ET LA CHAÎNE

OBJECTIF — Fournir la matière du cas pratique et le fil des six étapes.

DIRE — « La note de Julien, responsable SAV, et les six étapes. Pour chacune : ce que vous produisez, avec quels prompts, et le contrôle humain. Un piège est glissé dans la note : trouvez-le. »

ANIMATION — Le piège : « un bon électricien motivé ». La motivation n’est pas observable : à traduire en indices avec Julien. L’habilitation électrique, en revanche, est un vrai prérequis réglementaire. Laisser cette page affichée pendant le travail.`,
  `⏱ 4 min · QUIZ ÉTHIQUE

ANIMATION — Une question à la fois. La dernière question reprend le piège de la note de Julien : la poser après le cas pratique.

TRANSITION — « Place aux restitutions. »`,
];
// @@NOTES-END
