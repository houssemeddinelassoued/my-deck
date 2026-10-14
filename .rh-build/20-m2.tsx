// ─── Module 2 · Rédiger des offres d’emploi ─────────────────────────────────

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Des offres qui donnent
        <br />
        envie de postuler
      </>
    }
    sub="Votre offre est la première impression que vous laissez. L’IA accélère la rédaction ; à vous d’apporter la vérité du poste et la voix de l’entreprise."
    dur="10:00 – 10:50 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · une offre complète avec l’IA
      </Tag>
    }
  >
    <SecItem n={1}>Définir le profil recherché à partir des notes du manager</SecItem>
    <SecItem n={2}>Identifier les compétences clés, et retirer les critères à risque</SecItem>
    <SecItem n={3}>Rédiger une offre attractive : structure et prompt type</SecItem>
    <SecItem n={4}>Adapter l’offre à chaque plateforme</SecItem>
    <SecItem n={5}>Améliorer une offre existante</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Définir le profil : des notes au profil structuré ──────────────────────
const M2_Profil: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Définir le profil : des notes en vrac au profil structuré</Title>
    <Lede>Le manager vous a parlé dix minutes entre deux portes. L’IA met de l’ordre ; vous vérifiez chaque ligne avec lui.</Lede>
    <DocSheet kind="Notes · manager du plateau" icon="note" meta="lundi" cls={A.left} style={{ position: 'absolute', left: 120, top: 262, width: 560 }} size={21}>
      <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.6, color: C.soft }}>
        - qqn de patient, gens énervés au tel (pannes PAC l’hiver !!)
        <br />- logiciel tickets + CRM maison, on forme
        <br />- horaires 8h-18h roulement, 1 samedi / mois
        <br />- débutant ok si bon rel. client
        <br />- remplace Julie (partie en mai)
        <br />- 24-26 k€ selon xp + prime trim.
        <br />- idéal : notions techniques chauffage ?
        <br />- vite, avant l’hiver
      </div>
    </DocSheet>
    <div className={b.on(1)} style={{ position: 'absolute', left: 720, top: 262, width: 480 }}>
      <PromptPanel title="prompt" size={19}>
        <Pk>RÔLE · </Pk>Tu es chargé·e de recrutement.
        {'\n'}
        <Pk c="#8EE6D4">TÂCHE · </Pk>À partir des notes ci-dessous, rédige un profil de poste structuré : finalité, missions, compétences indispensables, souhaitables, conditions.
        {'\n'}
        <Pk c="#FFA8A8">RÈGLES · </Pk>N’invente rien. Signale entre [crochets] ce qui manque ou reste à confirmer.
        {'\n'}
        <Pk c="#C9B6FF">NOTES · </Pk>
        <V>notes_manager</V>
      </PromptPanel>
    </div>
    <AIPanel title="Profil structuré" size={19} cls={b.on(2)} style={{ position: 'absolute', left: 1240, top: 262, width: 560 }}>
      <div>
        <strong>Finalité :</strong> accompagner les clients par téléphone et par écrit, surtout lors des pannes.
      </div>
      <div style={{ marginTop: 6 }}>
        <strong>Missions :</strong> traiter les appels et tickets, planifier les interventions, suivre les dossiers jusqu’à résolution.
      </div>
      <div style={{ marginTop: 6 }}>
        <strong>Indispensable :</strong> sens de la relation client, calme face aux clients mécontents, aisance à l’écrit.
      </div>
      <div style={{ marginTop: 6 }}>
        <strong>Souhaitable :</strong> notions de chauffage <span style={{ color: T.coral.fg, fontWeight: 600 }}>[à confirmer : vraiment utile ?]</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <strong>Conditions :</strong> CDI, 8 h – 18 h en roulement, 1 samedi par mois, 24 – 26 k€ + prime trimestrielle.
      </div>
      <div style={{ marginTop: 6, color: T.coral.fg, fontWeight: 600 }}>[Manque : date de prise de poste, lieu exact, télétravail ?]</div>
    </AIPanel>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1080 }}>
      <Callout title="Le détail qui change tout" tone="yellow" icon="bulb" size={24}>
        La consigne <strong>« N’invente rien, signale ce qui manque »</strong> transforme l’IA en outil de questionnement : vous repartez voir le manager avec trois questions précises.
      </Callout>
    </div>
  </Frame>
);

// ─── Compétences clés : tri ─────────────────────────────────────────────────
const M2Chip = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <Drag x={x} y={y} w={400} size={21} tone="violet">
    {children}
  </Drag>
);

const M2_Competences: Page = () => (
  <Frame mod={2} kind="exercice" beats={1}>
    <Title size={46}>Exercice : indispensable, souhaitable… ou à retirer ?</Title>
    <SortZone x={120} w={540} tone="green" icon="checkCircle" title="Indispensable" sol="Solution : 1 · 4 · 7 · ce qui fait réussir dans le poste dès le départ" />
    <SortZone x={690} w={540} tone="blue" icon="plus" title="Souhaitable" sol="Solution : 3 · 6 · un plus, qui s’apprend une fois en poste" />
    <SortZone x={1260} w={540} tone="coral" icon="x" title="À retirer" sol="Solution : 2 · 5 · 8 · discriminatoire ou sans lien avec le poste" />
    <M2Chip x={120} y={190}>1 · Garder son calme face à un client mécontent</M2Chip>
    <M2Chip x={540} y={190}>2 · Jeune et dynamique</M2Chip>
    <M2Chip x={960} y={190}>3 · Notions de chauffage et de pompes à chaleur</M2Chip>
    <M2Chip x={1380} y={190}>4 · Rédiger un message clair et sans faute</M2Chip>
    <M2Chip x={120} y={300}>5 · Habiter à moins de 15 minutes de l’agence</M2Chip>
    <M2Chip x={540} y={300}>6 · Connaître un logiciel de tickets</M2Chip>
    <M2Chip x={960} y={300}>7 · Organiser ses rappels et suivre ses dossiers</M2Chip>
    <M2Chip x={1380} y={300}>8 · Excellente présentation</M2Chip>
    <Hint style={{ position: 'absolute', left: 120, top: 950 }}>Glissez chaque carte (double-clic = retour). → affiche la correction.</Hint>
  </Frame>
);

// ─── Anatomie d’une offre attractive ────────────────────────────────────────
const M2Part = ({ n, title, sub, tone, d }: { n: number; title: string; sub: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35 }}>{sub}</div>
    </div>
  </div>
);

const M2_Anatomie: Page = () => (
  <Frame mod={2}>
    <Title>L’anatomie d’une offre qui convertit</Title>
    <Lede>Sept blocs, dans cet ordre. Le candidat lit en diagonale : chaque bloc doit répondre à une question qu’il se pose.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 17 }}>
      <M2Part n={1} tone="blue" title="Un intitulé que l’on recherche" sub="« Conseiller·ère clientèle », pas « Ninja du service client »" d={100} />
      <M2Part n={2} tone="violet" title="Une accroche tournée vers le candidat" sub="Ce que le poste lui apporte, en deux phrases" d={170} />
      <M2Part n={3} tone="teal" title="Les missions, concrètes" sub="Une journée type plutôt qu’une liste de 15 verbes" d={240} />
      <M2Part n={4} tone="green" title="Le profil, réaliste" sub="3 à 5 compétences clés, distinguer l’indispensable" d={310} />
      <M2Part n={5} tone="yellow" title="La rémunération et les avantages" sub="Une fourchette, les primes, le rythme" d={380} />
      <M2Part n={6} tone="pink" title="L’entreprise, en vrai" sub="L’équipe, le manager, ce qui la distingue" d={450} />
      <M2Part n={7} tone="navy" title="Le processus de recrutement" sub="Étapes, délais, interlocuteur" d={520} />
    </div>
    <DocSheet kind="Offre d’emploi" meta="Solvéa · Nantes" icon="megaphone" title="Conseiller·ère clientèle énergie (CDI)" cls={A.right} style={{ position: 'absolute', left: 800, top: 262, width: 1000, ...dl(200) }} size={22}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Tag tone="grey" size={17}>Nantes</Tag>
        <Tag tone="grey" size={17}>CDI</Tag>
        <Tag tone="yellow" size={17}>24 – 26 k€ + prime trimestrielle</Tag>
        <Tag tone="green" size={17}>Débutant·e bienvenu·e</Tag>
      </div>
      <div>
        <strong style={{ color: C.violet }}>Vous aimez aider et trouver des solutions ?</strong> Chez Solvéa, chaque appel compte : derrière, il y a une famille qui attend que son chauffage reparte.
      </div>
      <div style={{ marginTop: 10 }}>
        <strong style={{ color: T.teal.fg }}>Votre journée :</strong> vous répondez aux appels et messages, vous planifiez l’intervention du technicien, vous rappelez le client
        pour vérifier que tout fonctionne.
      </div>
      <div style={{ marginTop: 10 }}>
        <strong style={{ color: T.green.fg }}>Vous êtes fait·e pour ce poste si</strong> vous restez calme quand le ton monte, écrivez clairement et aimez suivre un dossier
        jusqu’au bout. Le reste, on vous le transmet : trois semaines de formation en binôme.
      </div>
      <div style={{ marginTop: 10 }}>
        <strong style={{ color: T.yellow.fg }}>Ce que l’on vous offre :</strong> horaires en roulement 8 h – 18 h, un samedi par mois récupéré, mutuelle prise en charge à 70 %.
      </div>
      <div style={{ marginTop: 10 }}>
        <strong style={{ color: T.navy.fg }}>La suite :</strong> appel de 15 min, entretien avec Karim (manager) et une mise en situation. Réponse sous 10 jours, quelle qu’elle soit.
      </div>
    </DocSheet>
  </Frame>
);

// ─── Le prompt type ─────────────────────────────────────────────────────────
const M2_PromptType: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Le prompt type pour rédiger une offre</Title>
    <Lede>Copiez-le, remplacez les variables. Il produit les sept blocs, dans votre ton, sans critère discriminatoire.</Lede>
    <PromptPanel title="prompt · rédiger une offre d’emploi" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <Pk>RÔLE · </Pk>Tu es un·e rédacteur·rice RH expert·e en marque employeur.
      {'\n'}
      <Pk c="#8EE6D4">CONTEXTE · </Pk>Entreprise : <V>présentation_entreprise</V>. Poste : <V>profil_structuré</V>. Public visé : <V>public</V>.
      {'\n'}
      <Pk c="#FFD27A">TÂCHE · </Pk>Rédige une offre d’emploi en 7 blocs : intitulé, accroche, journée type, profil (indispensable / souhaitable), rémunération et avantages,
      l’entreprise, processus de recrutement.
      {'\n'}
      <Pk c="#FFA8A8">CONTRAINTES · </Pk>Ton <V>ton</V>, vouvoiement, 350 mots maximum. Écriture inclusive sobre (point médian ou doublets). Aucun critère lié à l’âge, au sexe, à
      l’origine, à l’apparence, à la situation familiale. N’invente aucune information : marque [À COMPLÉTER].
      {'\n'}
      <Pk c="#C9B6FF">FORMAT · </Pk>Titres de bloc en gras, phrases courtes, 3 puces maximum par bloc.
    </PromptPanel>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="green" icon="checkCircle" title="Pourquoi ça marche" cls={A.right} style={dl(200)} size={22}>
        Structure imposée, garde-fous anti-discrimination intégrés, et l’interdiction d’inventer qui fait remonter les trous.
      </Card>
      <Card tone="violet" icon="sparkles" title="Pour aller plus loin" cls={A.right} style={dl(320)} size={22}>
        Collez deux offres que vous aimez : « Inspire-toi du ton de ces exemples, pas de leur contenu. »
      </Card>
      <Callout title="Relecture" tone="coral" icon="eye" cls={A.right} style={dl(440)} size={22}>
        Vérifiez chaque fait avec le manager : salaire, horaires, avantages. L’IA comble volontiers les blancs.
      </Callout>
    </div>
  </Frame>
);

// ─── Adapter l’offre aux plateformes ────────────────────────────────────────
const M2Plat = ({ tone, rules, children }: { tone: Tone; rules: string[]; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 28 }}>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '26px 30px', fontSize: 23, lineHeight: 1.5, color: C.ink, minHeight: 470, boxSizing: 'border-box' }}>{children}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T[tone].fg} size={20}>
        Les codes de la plateforme
      </Eyebrow>
      {rules.map((r) => (
        <Bullet key={r} size={23} tone={tone}>
          {r}
        </Bullet>
      ))}
    </div>
  </div>
);

const M2_Plateformes: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Une offre, cinq formats : adapter sans tout réécrire</Title>
    <Lede>
      Le prompt : « Adapte cette offre pour <V>plateforme</V> en respectant ses codes. Garde les faits, change la forme. »
    </Lede>
    <Tabs initial="jb" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
        <TabBtn id="jb" icon="search" tone="blue">
          Job board
        </TabBtn>
        <TabBtn id="li" icon="users" tone="navy">
          Réseau professionnel
        </TabBtn>
        <TabBtn id="sms" icon="phone" tone="green">
          Format court / mobile
        </TabBtn>
        <TabBtn id="int" icon="megaphone" tone="violet">
          Cooptation interne
        </TabBtn>
        <TabBtn id="en" icon="globe" tone="teal">
          Version anglaise
        </TabBtn>
      </div>
      <TabPane id="jb">
        <M2Plat tone="blue" rules={['Intitulé standard en premier, mots-clés du métier', 'Fourchette de salaire visible : filtre très utilisé', 'Structure complète en 7 blocs', '300 à 450 mots']}>
          <strong>Conseiller·ère clientèle énergie · CDI · Nantes · 24 – 26 k€</strong>
          <br />
          Vous aimez aider et trouver des solutions ? Rejoignez le service client de Solvéa, spécialiste des pompes à chaleur…
          <br />
          <span style={{ color: C.muted }}>[+ journée type, profil, avantages, processus]</span>
        </M2Plat>
      </TabPane>
      <TabPane id="li">
        <M2Plat tone="navy" rules={['Une accroche humaine dans les 2 premières lignes', 'Ton conversationnel, signé par une personne', 'Peu de liste, un lien vers l’offre complète', '3 hashtags maximum']}>
          L’hiver dernier, notre équipe a aidé 4 000 familles à retrouver du chauffage. 🔥
          <br />
          Pour l’hiver prochain, Karim cherche un·e conseiller·ère clientèle qui garde son calme quand le ton monte et aime trouver des solutions.
          <br />
          Débutant·e bienvenu·e : on forme pendant trois semaines. 📍 Nantes · CDI
          <br />
          👉 L’offre complète en commentaire. #recrutement #relationclient #Nantes
        </M2Plat>
      </TabPane>
      <TabPane id="sms">
        <M2Plat tone="green" rules={['Lu sur un téléphone en 10 secondes', 'Les 4 infos décisives : poste, lieu, contrat, salaire', 'Un seul appel à l’action', 'Moins de 60 mots']}>
          <strong>Solvéa recrute 📞</strong>
          <br />
          Conseiller·ère clientèle · CDI · Nantes
          <br />
          24 – 26 k€ + prime · débutant·e accepté·e, formation assurée
          <br />
          Postulez en 2 minutes, sans lettre de motivation : <span style={{ color: C.blue }}>solvea.example/jobs</span>
        </M2Plat>
      </TabPane>
      <TabPane id="int">
        <M2Plat tone="violet" rules={['Parle aux salariés, pas aux candidats', 'Explique ce qu’on attend d’eux : un nom, un partage', 'Rappelle la prime de cooptation et ses règles', 'Ton complice, court']}>
          <strong>Vous connaissez la perle rare ?</strong>
          <br />
          Le service client cherche un·e collègue pour remplacer Julie. Si quelqu’un de votre entourage a le sens du contact et garde son calme au téléphone, transmettez-lui l’offre.
          <br />
          Prime de cooptation : 500 € après la période d’essai.
        </M2Plat>
      </TabPane>
      <TabPane id="en">
        <M2Plat tone="teal" rules={['Traduire le sens, pas les mots (« CDI » = permanent contract)', 'Préciser le niveau de français requis', 'Garder les montants en euros, brut annuel', 'Faire relire par un·e anglophone']}>
          <strong>Customer Advisor – Energy (permanent contract) · Nantes, France</strong>
          <br />
          Do you enjoy helping people and solving problems? At Solvéa, every call matters: behind it is a family waiting for their heating to work again.
          <br />
          €24–26k gross per year + quarterly bonus · Fluent French required (customer calls).
        </M2Plat>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Améliorer une offre existante : repérez les failles ────────────────────
const M2_BAD = [
  { t: 'Commercial sédentaire (H/F) – Rockstar du service client !', bold: true },
  { t: 'Leader de la transition énergétique, nous recherchons notre futur collaborateur.' },
  { t: 'Missions : gestion portefeuille, tickets N1, upsell, suivi KPI CSAT / NPS…' },
  { t: 'Profil : jeune diplômé dynamique, idéalement 25-30 ans, excellente présentation.' },
  { t: 'Bac+5 exigé et 5 ans d’expérience minimum sur un poste similaire.' },
  { t: 'Disponibilité totale, pas peur des horaires, esprit start-up.' },
  { t: 'Rémunération : selon profil.' },
  { t: 'Envoyez CV + lettre de motivation + photo à rh@solvea.example' },
];
const M2_LINE = 54;
const M2_TOP = 262 + 50 + 18;

const M2_Ameliorer: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Repérez les huit failles de cette offre</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1080, boxSizing: 'border-box', background: '#fff', borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, boxSizing: 'border-box', padding: '0 22px', background: C.panel, borderBottom: `1.5px solid ${C.rule}` }}>
        <Icon name="megaphone" size={24} color={C.navy} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>Offre publiée l’an dernier</span>
      </div>
      <div style={{ padding: '18px 24px' }}>
        {M2_BAD.map((l) => (
          <div key={l.t} style={{ height: M2_LINE, display: 'flex', alignItems: 'center', fontSize: l.bold ? 25 : 22, fontWeight: l.bold ? 800 : 400, color: l.bold ? C.navy : C.ink, fontFamily: l.bold ? display : body }}>
            {l.t}
          </div>
        ))}
      </div>
    </div>
    <Hotspot n={1} x={1240} y={M2_TOP + M2_LINE * 0.5} title="Intitulé trompeur et fantaisiste" w={480}>
      Le poste n’est pas commercial, et « Rockstar » n’est tapé par aucun candidat dans un moteur de recherche.
    </Hotspot>
    <Hotspot n={2} x={1240} y={M2_TOP + M2_LINE * 1.5} title="Accroche autocentrée, masculin générique" w={480}>
      On parle de l’entreprise, pas du candidat. « Notre futur collaborateur » exclut implicitement.
    </Hotspot>
    <Hotspot n={3} x={1240} y={M2_TOP + M2_LINE * 2.5} title="Jargon et anglicismes" w={480}>
      Un candidat débutant ne sait pas ce que sont « N1 », « upsell » ou « CSAT ». Décrivez une journée.
    </Hotspot>
    <Hotspot n={4} x={1240} y={M2_TOP + M2_LINE * 3.5} title="Discrimination : âge et apparence" w={480}>
      « Jeune », « 25-30 ans », « excellente présentation » : critères discriminatoires (Code du travail, art. L.1132-1). Risque pénal.
    </Hotspot>
    <Hotspot n={5} x={1240} y={M2_TOP + M2_LINE * 4.5} title="Exigences incohérentes" w={480}>
      Bac+5 et 5 ans d’expérience pour un poste ouvert aux débutants : vous éliminez vos meilleurs candidats.
    </Hotspot>
    <Hotspot n={6} x={1240} y={M2_TOP + M2_LINE * 5.5} title="Conditions floues, voire illégales" w={480}>
      « Disponibilité totale » n’est pas une condition de travail : indiquez les horaires réels.
    </Hotspot>
    <Hotspot n={7} x={1240} y={M2_TOP + M2_LINE * 6.5} title="Pas de salaire" w={480}>
      C’est l’information la plus attendue. La directive européenne 2023/970 sur la transparence salariale renforce l’obligation d’informer les candidats.
    </Hotspot>
    <Hotspot n={8} x={1240} y={M2_TOP + M2_LINE * 7.5} title="Photo et lettre exigées" w={480} side="left">
      La photo ouvre la porte à la discrimination ; la lettre obligatoire décourage les profils opérationnels.
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 806, width: 1080, ...dl(400) }}>
      <PromptPanel title="prompt · auditer une offre" size={18}>
        Agis comme un·e expert·e en recrutement non discriminant. Analyse l’offre ci-dessous : liste les critères discriminatoires, le jargon, les incohérences et les informations
        manquantes, puis propose une version corrigée. Offre : <V>offre</V>
      </PromptPanel>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 1240, top: 830, width: 560, ...dl(600) }}>
      Cliquez les pastilles une à une, après avoir laissé le groupe chercher.
    </Hint>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="1"
    title="Créer une offre complète avec l’IA"
    defi="offre"
    who="En binôme"
    minutes={20}
    where={
      <>
        <strong>1 offre complète</strong> en 7 blocs pour le poste de votre choix (relation client ou développeur·se web), <strong>2 déclinaisons</strong> (réseau
        professionnel + format court) et la liste des questions à poser au manager.
      </>
    }
    objective={
      <>
        Produire, avec l’IA, une offre d’emploi attractive, inclusive et fidèle au poste, à partir des notes du manager de {PME}.
      </>
    }
    crit={
      <>
        <CheckItem id="a1c1" size={22}>Les 7 blocs sont présents</CheckItem>
        <CheckItem id="a1c2" size={22}>Aucun critère discriminatoire</CheckItem>
        <CheckItem id="a1c3" size={22}>Salaire, horaires, lieu : renseignés</CheckItem>
        <CheckItem id="a1c4" size={22}>Rien d’inventé : chaque fait vérifié</CheckItem>
      </>
    }
  >
    <div>1. Structurez le profil à partir des notes (prompt « N’invente rien »).</div>
    <div>2. Générez l’offre avec le prompt type, dans le ton de {PME} : chaleureux, concret.</div>
    <div>3. Faites auditer votre offre par l’IA, puis par votre binôme.</div>
    <div>4. Déclinez-la pour deux plateformes.</div>
    <Bonus>Demandez à l’IA de lire votre offre « comme un·e candidat·e de 50 ans en reconversion » : que ressent-il ou elle ?</Bonus>
  </LabPage>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz : quatre situations d’offre</Title>
    <QuizSeries y={200}>
      <QuizQ q="Le manager veut « un jeune pour dynamiser l’équipe ». Vous écrivez…" explain="On décrit le comportement attendu, jamais l’âge. « Jeune » est un critère discriminatoire, même s’il est sous-entendu.">
        <QOpt>« Profil junior, idéalement moins de 30 ans »</QOpt>
        <QOpt ok>« Vous aimez proposer des idées et faire bouger les habitudes »</QOpt>
        <QOpt>« Jeune diplômé·e » sans mention d’âge</QOpt>
      </QuizQ>
      <QuizQ q="L’IA a ajouté « certification RGE exigée » au profil. Vous…" explain="L’IA comble les blancs avec des éléments plausibles du secteur. Toute exigence doit venir du manager, pas du modèle.">
        <QOpt>La gardez : l’IA connaît le secteur</QOpt>
        <QOpt ok>Vérifiez avec le manager avant de publier</QOpt>
        <QOpt>La passez en « souhaitable »</QOpt>
      </QuizQ>
      <QuizQ q="Pour un post sur un réseau professionnel, le plus important est…" explain="Le fil d’actualité coupe après deux lignes : l’accroche humaine décide si l’on clique sur « voir plus ».">
        <QOpt>Reprendre l’offre complète à l’identique</QOpt>
        <QOpt ok>Une accroche humaine dans les deux premières lignes</QOpt>
        <QOpt>Le maximum de hashtags</QOpt>
      </QuizQ>
      <QuizQ q="Quelle information manque le plus souvent aux yeux des candidats ?" explain="Les enquêtes candidats placent la rémunération en tête des informations attendues ; l’afficher filtre aussi les candidatures hors budget.">
        <QOpt>L’historique de l’entreprise</QOpt>
        <QOpt ok>La rémunération</QOpt>
        <QOpt>Le nombre de salariés</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Ce qu’on retient du module 2</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        D’abord le <strong>profil structuré</strong>, validé avec le manager ; ensuite seulement l’offre.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        <strong>3 à 5 compétences clés</strong>, et on retire tout critère discriminatoire ou sans lien avec le poste.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Sept blocs tournés vers le candidat, <strong>salaire compris</strong>.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Une offre, plusieurs formats : <strong>on garde les faits, on change la forme</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        L’IA peut <strong>auditer</strong> une offre existante, mais elle peut aussi <strong>inventer</strong> : on vérifie tout.
      </SynthRow>
    </div>
    <ReflexCard title="Mon réflexe · M2">
      J’ajoute toujours à mes prompts : <strong>« N’invente rien. Marque [À COMPLÉTER] ce qui manque. »</strong>
    </ReflexCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_Profil, M2_Competences, M2_Anatomie, M2_PromptType, M2_Plateformes, M2_Ameliorer, M2_Atelier, M2_Quiz, M2_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M2 · 10:00

OBJECTIF — Annoncer le module sur les offres d’emploi.

DIRE — « Votre offre, c’est la première impression que vous laissez à un candidat. Dans ce module : définir le profil, choisir les compétences clés, rédiger une offre attractive, l’adapter à chaque plateforme et améliorer une offre existante. Puis vous en créerez une, de A à Z, pour Solvéa. »

TRANSITION — « Tout commence par un échange avec le manager. »`,
  `⏱ 4 min · DÉFINIR LE PROFIL (2 clics)

OBJECTIF — Montrer comment l’IA structure des notes brutes en profil de poste, sans inventer.

DIRE — « Voici les notes prises lors d’un échange de dix minutes avec Karim, le manager du plateau. Typique : abréviations, points d’exclamation, informations dans le désordre. » Clic : « Le prompt : rôle, tâche, et surtout une règle : n’invente rien, signale ce qui manque. » Clic : « Résultat : un profil structuré, et trois questions entre crochets. Vous retournez voir Karim avec ces questions : c’est le vrai gain. »

INSISTER — Le salaire et les horaires viennent des notes, pas de l’IA. Si l’IA en propose, c’est une invention.

TRANSITION — « Dans ce profil, quelles compétences garder ? »`,
  `⏱ 5 min · EXERCICE INDISPENSABLE / SOUHAITABLE / À RETIRER (drag & drop, 1 clic)

OBJECTIF — Distinguer compétences clés et critères à risque.

DIRE — « Huit critères entendus dans de vraies réunions de recrutement. Pour chacun : indispensable, souhaitable, ou à retirer ? »

ANIMATION — Faire glisser selon le groupe, puis clic pour la correction. Débats attendus : « habiter à moins de 15 minutes » est discriminatoire (le lieu de résidence fait partie des critères interdits par l’article L.1132-1). « Excellente présentation » renvoie à l’apparence physique, également un critère interdit. « Notions de chauffage » : souhaitable, car on forme.

TRANSITION — « Avec ces compétences, construisons l’offre. »`,
  `⏱ 4 min · ANATOMIE D’UNE OFFRE

OBJECTIF — Donner la structure en sept blocs.

DIRE — Parcourir les sept blocs à gauche, en montrant leur traduction dans l’offre Solvéa à droite. « L’intitulé : ce que les candidats tapent. L’accroche : ce que le poste leur apporte. La journée type plutôt qu’une liste de verbes. Un profil réaliste. Le salaire. L’entreprise en vrai, avec le prénom du manager. Et le processus : combien d’étapes, quel délai. “Réponse sous 10 jours, quelle qu’elle soit” : c’est un engagement fort, apprécié des candidats. »

TRANSITION — « Comment faire produire cette structure par l’IA ? »`,
  `⏱ 4 min · LE PROMPT TYPE (démo)

OBJECTIF — Donner un prompt réutilisable.

DIRE — « Voici le prompt type. Les cinq ingrédients du module 1, adaptés à l’offre. Les variables en jaune sont à remplacer. Regardez les contraintes : écriture inclusive sobre, liste des critères interdits, et l’interdiction d’inventer. »

ANIMATION — Si le temps le permet, faire la démonstration en direct dans l’assistant IA, avec le profil Solvéa.

TRANSITION — « Une offre ne se publie pas qu’à un seul endroit. »`,
  `⏱ 5 min · ADAPTER AUX PLATEFORMES (onglets)

OBJECTIF — Montrer qu’une même offre se décline selon les codes de chaque canal.

DIRE — Cliquer chaque onglet. « Job board : intitulé standard, salaire visible, structure complète. Réseau professionnel : une accroche humaine, signée par une personne. Format court : quatre informations, un lien. Cooptation : on parle aux salariés. Version anglaise : on traduit le sens, et on précise le niveau de français requis. »

INSISTER — Le prompt est toujours le même : « Garde les faits, change la forme. »

TRANSITION — « Et vos offres existantes ? Voyons comment l’IA peut les améliorer. »`,
  `⏱ 6 min · REPÉREZ LES FAILLES (hotspots)

OBJECTIF — Exercer l’œil critique et montrer l’usage « audit ».

DIRE — « Voici une offre publiée l’an dernier. Elle contient au moins huit problèmes. Deux minutes avec votre voisin : trouvez-les. » Puis cliquer les pastilles une à une, en laissant le groupe proposer.

INSISTER — La pastille 4 : l’âge et l’apparence physique sont des critères de discrimination interdits ; c’est un délit pénal (Code pénal, art. 225-1 et 225-2). La pastille 7 : la directive européenne sur la transparence salariale renforce l’information des candidats sur la rémunération ; vérifier son état de transposition en droit français au moment de la session.

ANIMATION — Terminer sur le prompt d’audit en bas : à tester pendant l’atelier.

TRANSITION — « À vous : vingt minutes pour créer votre offre. »`,
  `⏱ 20 min · ATELIER 1 (minuteur)

OBJECTIF — Créer une offre complète avec l’IA, conforme au programme.

CONSIGNE À DIRE — « En binôme, vingt minutes. Choisissez l’un des deux postes Solvéa. Quatre étapes : structurer le profil, générer l’offre, la faire auditer, la décliner pour deux plateformes. Les quatre critères de réussite sont à droite : cochez-les à la fin. »

ANIMATION — Lancer le minuteur. Passer dans les binômes. Erreurs fréquentes : oublier le salaire, laisser passer une information inventée, intitulé trop créatif. Au bout de 15 minutes, annoncer « dernières minutes pour les déclinaisons ».

DÉBRIEF — Faire lire deux accroches à voix haute. Le groupe vote pour celle qui donne le plus envie de postuler.`,
  `⏱ 3 min · QUIZ M2

OBJECTIF — Vérifier les acquis du module.

ANIMATION — Une question à la fois, vote à main levée, clic sur la réponse. Le score « du premier coup » se met à jour.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE M2

OBJECTIF — Ancrer les cinq messages du module.

DIRE — Relire les cinq lignes. « Et votre réflexe : “N’invente rien, marque À COMPLÉTER ce qui manque.” Cette phrase, vous allez la réutiliser toute la journée. »

TRANSITION — « Pause de quinze minutes. Ensuite : les candidatures arrivent. Comment les analyser avec l’IA, sans lui déléguer la décision ? »`,
];
// @@NOTES-END
