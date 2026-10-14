// ─── Module 1 · L’IA dans les RH ────────────────────────────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        L’IA dans les RH :
        <br />
        à quoi ça sert vraiment ?
      </>
    }
    sub="Avant d’écrire la moindre offre, on cartographie les usages, on apprend à parler à l’IA, et on regarde ses limites en face."
    dur="9:20 – 10:00"
  >
    <SecItem n={1}>Cinq familles d’usages : recrutement, communication, formation, administration</SecItem>
    <SecItem n={2}>Ce que l’IA générative fait bien… et ce qu’elle fait mal</SecItem>
    <SecItem n={3}>La méthode du prompt RH en cinq ingrédients</SecItem>
    <SecItem n={4}>Limites et risques : le cadre avant l’outil</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Usages par domaine (onglets) ───────────────────────────────────────────
const M1Use = ({ ask, get, gain, tone }: { ask: string; get: string; gain: string; tone: Tone }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${STRONG[tone]}`, padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 56px 1fr 150px', alignItems: 'center', gap: 14 }}>
    <div style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>
      <span style={{ fontWeight: 700, color: T[tone].fg }}>Je demande · </span>
      {ask}
    </div>
    <FlowArrow w={50} color={C.faint} />
    <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>
      <span style={{ fontWeight: 700, color: C.violet }}>J’obtiens · </span>
      {get}
    </div>
    <Tag tone="green" size={19} style={{ justifySelf: 'end' }}>
      <Icon name="clock" size={19} /> {gain}
    </Tag>
  </div>
);

const M1_Usages: Page = () => (
  <Frame mod={1} kind="demo">
    <Title>Où l’IA vous fait gagner du temps, domaine par domaine</Title>
    <Lede>Cliquez un onglet : des usages réels, avec des gains de temps indicatifs à vérifier chez vous.</Lede>
    <Tabs initial="rec" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <TabBtn id="rec" icon="search" tone="blue">
          Recrutement
        </TabBtn>
        <TabBtn id="com" icon="mail" tone="green">
          Communication
        </TabBtn>
        <TabBtn id="for" icon="graduation" tone="violet">
          Formation
        </TabBtn>
        <TabBtn id="adm" icon="folder" tone="teal">
          Administration
        </TabBtn>
        <TabBtn id="lim" icon="alert" tone="coral">
          Limites
        </TabBtn>
      </div>
      <TabPane id="rec">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <M1Use tone="blue" ask="une offre à partir de mes notes de réunion avec le manager" get="une première version structurée, prête à relire" gain="45 → 10 min" />
          <M1Use tone="blue" ask="les compétences clés d’un poste que je connais mal" get="une liste à valider avec l’opérationnel" gain="30 → 5 min" />
          <M1Use tone="blue" ask="un guide d’entretien et sa grille d’évaluation" get="12 questions classées par compétence + barème" gain="1 h → 15 min" />
          <M1Use tone="blue" ask="une requête booléenne pour un job board" get="une chaîne de recherche à tester et affiner" gain="20 → 5 min" />
        </div>
      </TabPane>
      <TabPane id="com">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <M1Use tone="green" ask="un refus personnalisé après un entretien" get="un message respectueux, avec un retour utile" gain="20 → 5 min" />
          <M1Use tone="green" ask="une note interne sur le nouveau calendrier des congés" get="un texte clair en trois versions de ton" gain="40 → 10 min" />
          <M1Use tone="green" ask="la reformulation d’une politique RH en langage simple" get="une FAQ salariés de dix questions" gain="1 h → 15 min" />
          <M1Use tone="green" ask="la traduction d’une offre pour un candidat anglophone" get="une version anglaise naturelle, à faire relire" gain="30 → 5 min" />
        </div>
      </TabPane>
      <TabPane id="for">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <M1Use tone="violet" ask="un parcours d’intégration de 30 jours pour un poste" get="un planning semaine par semaine, à adapter" gain="2 h → 30 min" />
          <M1Use tone="violet" ask="un quiz de fin de formation sécurité" get="dix questions avec corrigé et explications" gain="1 h → 10 min" />
          <M1Use tone="violet" ask="une analyse des besoins à partir d’entretiens annuels anonymisés" get="les thèmes récurrents, classés par fréquence" gain="1 j → 1 h" />
          <M1Use tone="violet" ask="un support pour présenter un nouvel outil" get="un plan de séance et les messages clés" gain="2 h → 30 min" />
        </div>
      </TabPane>
      <TabPane id="adm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <M1Use tone="teal" ask="le résumé d’un accord d’entreprise de 40 pages" get="une synthèse des points clés, articles cités" gain="2 h → 20 min" />
          <M1Use tone="teal" ask="un tableau de suivi des recrutements en cours" get="une structure de colonnes et des statuts" gain="30 → 5 min" />
          <M1Use tone="teal" ask="un modèle de compte rendu de réunion CSE" get="une trame avec rubriques et formulations neutres" gain="45 → 10 min" />
          <M1Use tone="teal" ask="une formule Excel pour calculer l’ancienneté" get="la formule expliquée pas à pas" gain="20 → 2 min" />
        </div>
      </TabPane>
      <TabPane id="lim">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Callout title="Ce que l’IA ne doit pas faire seule" tone="coral" icon="alert" size={26}>
            Décider qui est retenu ou écarté, noter un salarié, calculer une paie ou une indemnité, affirmer une règle de droit sans source, recevoir des données personnelles
            sans cadre.
          </Callout>
          <Callout title="La bonne posture" tone="green" icon="humanCheck" size={26}>
            L’IA prépare un brouillon, une synthèse, une liste d’options. Le professionnel RH vérifie, complète, corrige… et signe.
          </Callout>
        </div>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Ce que l’IA fait bien / mal ────────────────────────────────────────────
const M1Skill = ({ icon, title, ex, d, ok }: { icon: IconName; title: string; ex: string; d: number; ok: boolean }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={ok ? 'green' : 'coral'} size={50} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35 }}>{ex}</div>
    </div>
  </div>
);

const M1_Capacites: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Un excellent rédacteur… qui ne sait pas ce qu’il ne sait pas</Title>
    <Lede>L’IA générative prédit le texte le plus plausible. Plausible ne veut pas dire vrai, ni juste, ni conforme.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.green.fg} size={22} cls={A.fade}>
        Ce qu’elle fait bien
      </Eyebrow>
      <M1Skill ok icon="pen" title="Rédiger un premier jet" ex="offre, message, note interne, FAQ" d={100} />
      <M1Skill ok icon="layers" title="Résumer et structurer" ex="un CV, un accord, des notes d’entretien" d={180} />
      <M1Skill ok icon="loop" title="Reformuler, adapter le ton" ex="plus simple, plus chaleureux, plus court" d={260} />
      <M1Skill ok icon="bulb" title="Proposer des idées" ex="questions d’entretien, intitulés, thèmes de formation" d={340} />
    </div>
    <div style={{ position: 'absolute', left: 980, top: 270, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.coral.fg} size={22} cls={A.fade}>
        Ce qu’elle fait mal
      </Eyebrow>
      <M1Skill ok={false} icon="scale" title="Garantir l’exactitude juridique" ex="elle peut citer un article du Code du travail qui n’existe pas" d={420} />
      <M1Skill ok={false} icon="org" title="Connaître votre entreprise" ex="salaires, usages, culture : sauf si vous les lui donnez" d={500} />
      <M1Skill ok={false} icon="euro" title="Calculer de façon fiable" ex="paie, ancienneté, indemnités : utilisez un outil dédié" d={580} />
      <M1Skill ok={false} icon="users" title="Juger équitablement une personne" ex="elle reproduit les biais des textes qui l’ont nourrie" d={660} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 850, width: 1680 }}>
      <Callout title="Le mot à retenir" tone="violet" icon="sparkles">
        Traitez l’IA comme un <strong>stagiaire brillant, rapide et sûr de lui</strong> : vous lui confiez des brouillons, jamais une signature.
      </Callout>
    </div>
  </Frame>
);

// ─── La méthode en 5 ingrédients (démo interactive) ─────────────────────────
const M1_ING = [
  { k: 'RÔLE', c: '#9EC5FF', txt: 'Tu es chargé·e de recrutement dans une PME de 240 salariés.' },
  { k: 'CONTEXTE', c: '#8EE6D4', txt: 'Solvéa installe des pompes à chaleur. Nous recrutons un·e chargé·e de relation client en CDI à Nantes, débutant accepté.' },
  { k: 'TÂCHE', c: '#FFD27A', txt: 'Rédige l’accusé de réception envoyé à chaque candidat qui postule.' },
  { k: 'CONTRAINTES', c: '#FFA8A8', txt: 'Vouvoiement, ton chaleureux, 100 mots maximum, aucune promesse sur l’issue, délai de réponse : 10 jours.' },
  { k: 'FORMAT', c: '#C9B6FF', txt: 'Donne un objet d’email, puis le corps du message avec la variable {{prénom}}.' },
];

const M1IngBtn = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      flip();
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      padding: '12px 16px',
      border: 'none',
      borderRadius: 12,
      cursor: 'pointer',
      fontFamily: body,
      fontSize: 22,
      fontWeight: 700,
      textAlign: 'left',
      background: on ? T.violet.bg : C.card,
      color: on ? T.violet.fg : C.soft,
      boxShadow: on ? `inset 0 0 0 2.5px ${C.violet}` : `inset 0 0 0 1.5px ${C.rule}`,
      transition: `all 200ms ${EASE}`,
    }}
  >
    <Num n={i + 1} tone={on ? 'violet' : 'grey'} size={36} />
    {M1_ING[i].k}
    <span style={{ marginLeft: 'auto' }}>{on ? <Icon name="check" size={24} sw={3} /> : <Icon name="plus" size={24} />}</span>
  </button>
);

const M1_Methode: Page = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const level = !on[2] || n <= 1 ? 0 : on[1] && on[3] && on[4] ? 2 : 1;
  return (
    <Frame mod={1} kind="demo">
      <Title>La méthode du prompt RH en cinq ingrédients</Title>
      <Lede>Partez de « Écris un message pour les candidats », ajoutez les ingrédients un à un et regardez la réponse changer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 370, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Eyebrow c={C.navy} size={20}>
          Ingrédients
        </Eyebrow>
        {M1_ING.map((_, i) => (
          <M1IngBtn key={i} i={i} on={on[i]} flip={() => flip(i)} />
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Vider
          </Btn>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 530, top: 262, width: 640, ...dl(150) }}>
        <PromptPanel title="mon prompt" size={21} style={{ minHeight: 620 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {M1_ING.map((g, i) =>
              i === 2 && !on[2] ? (
                <div key={i} style={{ color: '#FFD27A' }}>
                  Écris un message pour les candidats.
                </div>
              ) : on[i] ? (
                <div key={i} className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
                  <Pk c={g.c}>{g.k} · </Pk>
                  {g.txt}
                </div>
              ) : null,
            )}
          </div>
        </PromptPanel>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1210, top: 262, width: 590, display: 'flex', flexDirection: 'column', gap: 18, ...dl(250) }}>
        <AIPanel size={20} style={{ minHeight: 470 }}>
          {level === 0 ? (
            <div style={{ color: C.soft }}>
              Bonjour,
              <br />
              Merci pour votre candidature. Nous l’étudierons avec attention et reviendrons vers vous dans les meilleurs délais.
              <br />
              Cordialement,
              <br />
              L’équipe RH
            </div>
          ) : level === 1 ? (
            <div>
              Bonjour,
              <br />
              Nous vous remercions pour votre candidature au poste de chargé·e de relation client chez Solvéa. Votre profil va être étudié avec soin. Nous ne manquerons pas
              de revenir vers vous très rapidement pour un entretien !
              <div style={{ marginTop: 10, fontSize: 18, color: T.coral.fg, fontWeight: 600 }}>⚠ « pour un entretien » : promesse implicite</div>
            </div>
          ) : (
            <div>
              <strong>Objet :</strong> Votre candidature chez Solvéa est bien arrivée
              <br />
              <br />
              Bonjour <span style={{ color: C.violet, fontWeight: 700 }}>{'{{prénom}}'}</span>,
              <br />
              Merci de l’intérêt que vous portez à Solvéa et au poste de chargé·e de relation client à Nantes. Votre candidature a bien été reçue. Notre équipe la lira avec
              attention et vous répondra, quelle que soit la suite, sous 10 jours.
              <br />
              Belle journée, l’équipe RH de Solvéa
            </div>
          )}
        </AIPanel>
        <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 600, color: level === 2 ? T.green.fg : level === 1 ? T.yellow.fg : T.coral.fg }}>
            <Icon name={level === 2 ? 'checkCircle' : 'alert'} size={30} />
            {level === 2 ? 'Prêt à relire et envoyer' : level === 1 ? 'Mieux, mais ton et promesses non maîtrisés' : 'Générique : il pourrait venir de n’importe qui'}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: n > i ? (n >= 5 ? C.green : n >= 3 ? C.yellow : C.coral) : C.panel }} />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Avant / après : itérer ─────────────────────────────────────────────────
const M1_Iterer: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Le premier jet n’est jamais le bon : on dialogue</Title>
    <Lede>Un prompt n’est pas une commande unique. Les meilleures réponses viennent en deux ou trois relances ciblées.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1000, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="user" w={820} cls={A.in}>
        Propose 5 intitulés de poste attractifs pour notre offre de chargé·e de relation client.
      </Bubble>
      <Bubble who="agent" w={820} cls={A.in} style={dl(200)}>
        1. Customer Happiness Hero · 2. Ninja de la relation client · 3. Conseiller·ère clientèle énergie · 4. Chargé·e d’expérience client · 5. Ambassadeur·rice Solvéa
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(1)}>
        Trop « startup » pour notre public. Garde des intitulés que les candidats tapent vraiment dans un moteur de recherche, sans anglicisme.
      </Bubble>
      <Bubble who="agent" w={820} cls={b.on(2)}>
        1. Conseiller·ère clientèle · 2. Chargé·e de relation client · 3. Téléconseiller·ère énergie · 4. Conseiller·ère service client · 5. Chargé·e de clientèle
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 250, width: 620, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade}>
        Quatre relances qui marchent
      </Eyebrow>
      <Card tone="violet" icon="target" title="Préciser" cls={A.in} style={dl(300)} size={22} pad={20}>
        « Pour un public débutant, sans jargon. »
      </Card>
      <Card tone="blue" icon="loop" title="Corriger" cls={A.in} style={dl(400)} size={22} pad={20}>
        « Le point 3 est faux : le poste n’est pas commercial. »
      </Card>
      <Card tone="teal" icon="layers" title="Varier" cls={A.in} style={dl(500)} size={22} pad={20}>
        « Donne trois versions : courte, standard, détaillée. »
      </Card>
      <Card tone="green" icon="search" title="Faire critiquer" cls={b.on(3)} size={22} pad={20}>
        « Relis ta réponse comme un candidat sceptique : qu’est-ce qui sonne faux ? »
      </Card>
    </div>
  </Frame>
);

// ─── Exercice de tri : bon usage ou pas ? ───────────────────────────────────
const M1Chip = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <Drag x={x} y={y} w={400} size={21} tone="navy">
    {children}
  </Drag>
);

const M1_Tri: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title size={46}>Exercice : feu vert, feu orange ou feu rouge ?</Title>
    <SortZone x={120} w={540} tone="green" icon="checkCircle" title="Feu vert" sol="Solution : 1 · 4 · 7 · usages de rédaction, sans données personnelles" />
    <SortZone x={690} w={540} tone="yellow" icon="alert" title="Feu orange · avec précautions" sol="Solution : 2 · 5 · 8 · données anonymisées et décision humaine" />
    <SortZone x={1260} w={540} tone="coral" icon="x" title="Feu rouge" sol="Solution : 3 · 6 · décision automatisée, données sensibles" />
    <M1Chip x={120} y={190}>1 · Rédiger une offre à partir d’une fiche de poste</M1Chip>
    <M1Chip x={540} y={190}>2 · Résumer un CV anonymisé pour le manager</M1Chip>
    <M1Chip x={960} y={190}>3 · Classer 200 CV et écarter les 150 derniers automatiquement</M1Chip>
    <M1Chip x={1380} y={190}>4 · Générer des questions d’entretien sur la gestion du stress</M1Chip>
    <M1Chip x={120} y={300}>5 · Synthétiser les comptes rendus d’entretiens annuels</M1Chip>
    <M1Chip x={540} y={300}>6 · Coller l’arrêt maladie d’un salarié pour rédiger un courrier</M1Chip>
    <M1Chip x={960} y={300}>7 · Écrire la note interne sur la journée solidarité</M1Chip>
    <M1Chip x={1380} y={300}>8 · Préparer l’entretien annuel d’un collaborateur</M1Chip>
    <Hint style={{ position: 'absolute', left: 120, top: 950 }}>Glissez chaque carte dans une colonne (double-clic = retour). → affiche la correction.</Hint>
  </Frame>
);

// ─── Limites et risques ─────────────────────────────────────────────────────
const M1Risk = ({ icon, tone, title, ex, beat }: { icon: IconName; tone: Tone; title: string; ex: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${STRONG[tone]}`, padding: '16px 22px' }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Cinq risques à garder en tête toute la journée</Title>
    <Lede>Chacun a sa parade. On y reviendra en détail au module 7.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1130, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Risk beat={1} icon="bug" tone="coral" title="Les hallucinations" ex="Un article de loi inventé, un diplôme qui n’existe pas : présentés avec aplomb." />
      <M1Risk beat={2} icon="scale" tone="yellow" title="Les biais" ex="Une offre au masculin, une préférence pour les parcours « classiques », un âge implicite." />
      <M1Risk beat={3} icon="lock" tone="violet" title="La confidentialité" ex="Ce que vous collez peut être conservé et réutilisé selon l’outil et le contrat." />
      <M1Risk beat={4} icon="humanCheck" tone="pink" title="La décision automatisée" ex="Écarter un candidat sur la seule base d’un score IA : interdit par le RGPD (art. 22)." />
      <M1Risk beat={5} icon="palette" tone="teal" title="L’uniformisation" ex="Toutes les offres finissent par se ressembler : votre marque employeur s’efface." />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1300, top: 262, width: 500, ...dl(200) }}>
      <Card tone="navy" icon="shieldCheck" title="La parade unique" size={24}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
          <Bullet size={23} tone="navy">Données fictives ou anonymisées</Bullet>
          <Bullet size={23} tone="navy">Outil validé par l’entreprise</Bullet>
          <Bullet size={23} tone="navy">Relecture systématique</Bullet>
          <Bullet size={23} tone="navy">Décision toujours humaine</Bullet>
          <Bullet size={23} tone="navy">Votre style, pas celui de l’IA</Bullet>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Le bon réflexe"
    q="Votre manager vous demande de « faire trier par l’IA » les 180 candidatures reçues pour le poste de relation client. Que faites-vous ?"
    explain="L’IA peut aider à lire et documenter, à partir d’une grille définie par l’humain. La décision d’écarter reste humaine (RGPD, art. 22), et les données doivent être protégées."
  >
    <Opt why="Une décision fondée exclusivement sur un traitement automatisé, qui affecte la personne, est interdite sauf exceptions. Et rien ne garantit la qualité du tri.">
      Je colle tous les CV dans l’IA et je garde les 20 premiers du classement.
    </Opt>
    <Opt ok why="C’est l’usage « aide à l’analyse » : grille objective d’abord, IA pour synthétiser, humain pour décider. Avec un outil validé et des données minimisées.">
      Je définis une grille de critères, l’IA m’aide à synthétiser chaque CV, et je décide moi-même.
    </Opt>
    <Opt why="L’IA peut faire gagner beaucoup de temps de lecture, dans un cadre. Refuser en bloc prive le service d’un vrai levier.">
      Je refuse : l’IA est interdite en recrutement.
    </Opt>
    <Opt why="Anonymiser est une bonne pratique, mais ne règle pas le problème principal : la décision automatisée.">
      J’anonymise les CV puis je laisse l’IA choisir les candidats à rencontrer.
    </Opt>
  </QcmPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Ce qu’on retient du module 1</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        L’IA aide dans <strong>quatre domaines</strong> : recrutement, communication, formation, administration.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Elle excelle à <strong>rédiger, résumer, reformuler</strong> ; elle est faible sur le droit, le calcul et le jugement.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Un bon prompt : <strong>rôle, contexte, tâche, contraintes, format</strong>. Puis on relance.
      </SynthRow>
      <SynthRow n={4} tone="coral" d={400}>
        Cinq risques : <strong>hallucinations, biais, confidentialité, décision automatisée, uniformisation</strong>.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        La règle de la journée : <strong>l’IA propose, le professionnel RH décide</strong>.
      </SynthRow>
    </div>
    <ReflexCard title="Mon réflexe · M1">
      Avant chaque prompt, je me pose deux questions : <strong>ai-je donné assez de contexte ?</strong> et <strong>ai-je retiré toute donnée personnelle ?</strong>
    </ReflexCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Usages, M1_Capacites, M1_Methode, M1_Iterer, M1_Tri, M1_Limites, M1_Qcm, M1_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M1 · 9:20

OBJECTIF — Annoncer le module : panorama des usages, méthode de prompt, limites.

DIRE — « Avant de rédiger quoi que ce soit, trois questions. À quoi sert l’IA dans un service RH ? Comment lui parler pour obtenir quelque chose d’utile ? Et où sont les limites ? Quarante minutes pour poser les bases de toute la journée. »

TRANSITION — « Commençons par les usages concrets. »`,
  `⏱ 7 min · USAGES PAR DOMAINE (onglets interactifs)

OBJECTIF — Montrer l’étendue des usages RH et chiffrer le temps gagné.

DIRE — Cliquer chaque onglet. « Recrutement : une offre à partir de vos notes, les compétences d’un métier que vous connaissez mal, un guide d’entretien. » « Communication : un refus personnalisé, une note interne, une FAQ. » « Formation : un parcours d’intégration, un quiz. » « Administration : la synthèse d’un accord d’entreprise, une formule Excel. » Terminer par l’onglet Limites : « Et voilà ce qu’on ne confie jamais à l’IA seule. »

ANIMATION — Demander après chaque onglet : « Qui fait déjà ça ? Combien de temps ça vous prend ? » Les gains sont indicatifs : inviter chacun à mesurer chez soi.

TRANSITION — « Pourquoi l’IA est forte sur certains usages et faible sur d’autres ? »`,
  `⏱ 4 min · CE QU’ELLE FAIT BIEN / MAL (1 clic)

OBJECTIF — Donner un modèle mental simple de l’IA générative.

DIRE — « L’IA générative a lu des milliards de textes et prédit le mot le plus plausible. Elle est donc excellente pour produire du texte : rédiger, résumer, reformuler, proposer. Mais plausible ne veut pas dire vrai. Elle peut inventer un article du Code du travail avec un aplomb total. Elle ne connaît pas votre entreprise. Elle calcule mal. Et elle reproduit les biais des textes qu’elle a lus. » Clic : « Le bon modèle mental : un stagiaire brillant, rapide et très sûr de lui. Vous lui confiez des brouillons, jamais une signature. »

TRANSITION — « Comment bien briefer ce stagiaire ? »`,
  `⏱ 7 min · LA MÉTHODE EN 5 INGRÉDIENTS (démo interactive)

OBJECTIF — Faire découvrir la structure d’un prompt efficace par l’expérience.

DIRE — « Départ : “Écris un message pour les candidats.” Regardez la réponse : générique. » Cliquer RÔLE, puis CONTEXTE, puis TÂCHE : « Ça s’améliore, mais lisez la fin : “pour un entretien”. L’IA promet quelque chose que vous n’avez pas décidé. » Ajouter CONTRAINTES et FORMAT : « Maintenant : un objet, une variable prénom, un délai réel, aucune promesse. C’est envoyable après relecture. »

INSISTER — Moyen mnémotechnique : « Qui est-elle ? Où est-on ? Que faire ? Avec quelles règles ? Sous quelle forme ? » Les contraintes sont l’ingrédient le plus oublié, et le plus important en RH.

ANIMATION — Faire deviner au groupe quel ingrédient ajouter ensuite. Bouton « Vider » pour recommencer.

TRANSITION — « Même avec un bon prompt, la première réponse n’est pas toujours la bonne. »`,
  `⏱ 4 min · ITÉRER (3 clics)

OBJECTIF — Installer le réflexe de relance.

DIRE — « Exemple : on demande cinq intitulés de poste. Réponse : Customer Happiness Hero, Ninja de la relation client… » Rire assuré. Clic : « On relance avec une précision : des intitulés que les candidats tapent vraiment. » Clic : « Beaucoup mieux. » Puis les quatre relances à droite : préciser, corriger, varier, et la plus puissante, clic, faire critiquer sa propre réponse par l’IA.

INSISTER — Un intitulé de poste « créatif » fait chuter la visibilité dans les moteurs de recherche des job boards.

TRANSITION — « À vous de jouer : un petit exercice de tri. »`,
  `⏱ 5 min · EXERCICE FEU VERT / ORANGE / ROUGE (drag & drop, 1 clic)

OBJECTIF — Faire classer des usages selon leur niveau de risque.

DIRE — « Huit usages. Pour chacun : feu vert, on y va ; feu orange, possible avec précautions ; feu rouge, on ne fait pas. Discutez deux minutes avec votre voisin, puis on place ensemble. »

ANIMATION — Faire glisser les cartes selon les propositions du groupe. Clic pour la correction. Points de débat attendus : la 8 (préparer l’entretien annuel) est orange car elle mobilise des données sur le salarié : anonymiser, rester sur la trame. La 3 est rouge : élimination automatique. La 6 est rouge : donnée de santé, catégorie particulière au sens du RGPD.

TRANSITION — « Ce tri repose sur cinq risques. Nommons-les. »`,
  `⏱ 4 min · CINQ RISQUES (5 clics)

OBJECTIF — Nommer les risques qui structureront le module 7.

DIRE — Un clic par risque. « Les hallucinations : l’IA invente avec aplomb. » « Les biais : elle reproduit les stéréotypes, par exemple une offre au masculin. » « La confidentialité : selon l’outil et le contrat, ce que vous collez peut être conservé. » « La décision automatisée : l’article 22 du RGPD interdit qu’une décision produisant des effets importants sur une personne repose exclusivement sur un traitement automatisé. » « L’uniformisation : si tout le monde utilise l’IA de la même façon, toutes les offres se ressemblent. » Puis la parade, à droite.

TRANSITION — « Vérifions que le message est passé. »`,
  `⏱ 3 min · QCM 1

OBJECTIF — Vérifier la compréhension de la posture « aide à la décision ».

DIRE — « Situation très réaliste : votre manager vous demande de faire trier les candidatures par l’IA. Votez. »

ANIMATION — Faire voter, cliquer la réponse majoritaire, puis les autres pour montrer les pièges. Clic 1 : bonne réponse ; clic 2 : l’essentiel. Le piège D est intéressant : anonymiser ne suffit pas, c’est la décision automatisée qui pose problème.

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M1

OBJECTIF — Ancrer les cinq messages du module.

DIRE — Relire les cinq lignes. « Et votre réflexe pour la journée : avant chaque prompt, deux questions. Ai-je donné assez de contexte ? Ai-je retiré toute donnée personnelle ? »

TRANSITION — « Passons à la pratique : la première chose qu’un candidat voit de vous, c’est votre offre d’emploi. »`,
];
// @@NOTES-END
