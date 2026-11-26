// ─── M7 · Divider ───────────────────────────────────────────────────────────
const M7_Divider: Page = () => (
  <Section n={7} title={<>Vers une gouvernance<br />de l’IA</>} sub="Des principes à la pratique : qui décide, qui vérifie, qui répond." dur="≈ 25 min">
    <SecItem n={1}>Rôles et responsabilités dans l’organisation</SecItem>
    <SecItem n={2}>Les points de contrôle d’un projet d’IA</SecItem>
    <SecItem n={3}>La charte éthique IA : à quoi elle sert, ce qu’elle contient</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// ─── M7 · Air Canada: who answers for the chatbot? ──────────────────────────
const M7_AirCanada: Page = () => (
  <Frame mod={7} kind="cas" beats={3}>
    <Title>« L’agent conversationnel est responsable de ses actes » ?</Title>
    <Lede>Colombie-Britannique, février 2024 : l’affaire Moffatt contre Air Canada.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <A2Fact d={100} icon="chat" tone="blue">
        Après un décès dans sa famille, un client demande à l’agent conversationnel d’Air Canada s’il existe un <b>tarif de deuil</b>.
      </A2Fact>
      <A2Fact d={220} icon="alert" tone="coral">
        L’agent lui répond qu’il peut demander le remboursement <b>après</b> son voyage. C’est faux : la politique officielle dit le contraire.
      </A2Fact>
      <div className={b.on(1)}>
        <A2Fact d={0} icon="scale" tone="violet">
          Devant le tribunal, Air Canada soutient que l’agent est <b>une entité distincte, responsable de ses propres actes</b>.
        </A2Fact>
      </div>
      <div className={b.on(2)}>
        <A2Fact d={0} icon="check" tone="green">
          Le tribunal rejette l’argument : l’entreprise répond de <b>toute l’information</b> de son site. Elle doit indemniser le client.
        </A2Fact>
      </div>
    </div>
    <Photo id="airCanada" w={540} h={260} pos="50% 55%" cls={A.right} style={{ position: 'absolute', left: 1260, top: 280, boxShadow: SHADOW, ...dl(300) }} />
    <div className={b.on(3)} style={{ position: 'absolute', left: 1260, top: 566, width: 540 }}>
      <div style={{ boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="flag" size={32} color={C.yellow} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase' }}>La règle</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.4, color: '#F2F8FC' }}>
          Une IA n’est jamais responsable. Une organisation l’est toujours, et quelqu’un, en son sein, doit l’être nommément.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── M7 · Roles ─────────────────────────────────────────────────────────────
const M7Role = ({ d, icon, tone, role, who, children }: { d: number; icon: IconName; tone: Tone; role: string; who: string; children: ReactNode }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{role}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 600, color: T[tone].fg }}>
        <Icon name="leaf" size={22} />
        {who}
      </div>
    </div>
  </div>
);

const M7_Roles: Page = () => (
  <Frame mod={7}>
    <Title>Qui fait quoi ? Six rôles à nommer</Title>
    <Lede>Une gouvernance, c’est d’abord des noms en face des responsabilités.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 26, columnGap: 30 }}>
      <M7Role d={100} icon="flag" tone="coral" role="La direction" who="À la Mutuelle : le comité de direction">
        Fixe l’ambition et les limites. Arbitre les cas difficiles. Peut tout arrêter.
      </M7Role>
      <M7Role d={200} icon="users" tone="violet" role="Le comité IA" who="Présidé par Nathalie">
        Approuve les projets à risque, tient le registre des systèmes d’IA.
      </M7Role>
      <M7Role d={300} icon="shield" tone="blue" role="Le responsable des renseignements personnels" who="Chloé">
        EFVP, consentement, incidents. Consulté au début, pas à la fin.
      </M7Role>
      <M7Role d={400} icon="target" tone="yellow" role="Le propriétaire du système" who="Samir pour P2, Vincent pour P1 et P4">
        Une personne du métier qui répond du système au quotidien.
      </M7Role>
      <M7Role d={500} icon="chart" tone="teal" role="L’équipe données et TI" who="Mei et son équipe">
        Teste les biais, documente, surveille, sécurise.
      </M7Role>
      <M7Role d={600} icon="user" tone="green" role="Chaque employé" who="Les 650 employés">
        Respecte la charte, utilise les outils approuvés, signale un problème.
      </M7Role>
    </div>
  </Frame>
);

// ─── M7 · Checkpoints along a project's life ────────────────────────────────
const M7Gate = ({ n, icon, tone, phase, children }: { n: number; icon: IconName; tone: Tone; phase: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 290, flex: 'none' }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Num n={n} tone={tone} size={44} />
        <Icon name={icon} size={34} color={T[tone].fg} />
      </div>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>{phase}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Lifecycle: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Cinq points de contrôle dans la vie d’un projet d’IA</Title>
    <Lede>À chaque étape, une question… et le droit de dire non.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', alignItems: 'center', gap: 8 }}>
      <M7Gate n={1} icon="bulb" tone="blue" phase="Idée">
        Fiche projet, niveau de risque. Le comité IA est informé.
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={2} icon="search" tone="violet" phase="Conception">
        EFVP. Quelles données, pour quel but ?
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={3} icon="scale" tone="teal" phase="Essais">
        Biais, fiabilité, explications testés avant le lancement.
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={4} icon="rocket" tone="green" phase="Lancement">
        Personnes informées, recours prévu, humain dans la boucle.
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={5} icon="gauge" tone="yellow" phase="Suivi">
        Indicateurs, incidents, revue annuelle.
      </M7Gate>
    </div>
    <Callout cls={b.on(6)} title="Le bouton d’arrêt" tone="coral" icon="pause" size={26} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      À chaque point, quelqu’un peut suspendre le projet. C’est ce qui manquait dans le cas de l’atelier 2.
    </Callout>
  </Frame>
);

// ─── M7 · What an AI ethics charter contains ────────────────────────────────
const M7Part = ({ n, icon, tone, name, children }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 24px', ...dl(100 + n * 110) }}>
    <Num n={n} tone={tone} size={46} />
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_CharterParts: Page = () => (
  <Frame mod={7}>
    <Title>La charte éthique IA : une page, cinq rubriques</Title>
    <Lede>Le modèle de votre atelier 3.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M7Part n={1} icon="star" tone="violet" name="Nos principes">
        Trois à cinq, reformulés avec nos mots.
      </M7Part>
      <M7Part n={2} icon="check" tone="green" name="Nos règles d’usage">
        Ce qui est permis, ce qui est interdit, ce qui demande un accord.
      </M7Part>
      <M7Part n={3} icon="lock" tone="blue" name="Nos données">
        Quelles données, dans quels outils : le feu tricolore.
      </M7Part>
      <M7Part n={4} icon="users" tone="yellow" name="Nos rôles">
        Qui approuve, qui répond, à qui signaler.
      </M7Part>
      <M7Part n={5} icon="loop" tone="teal" name="Notre suivi">
        Incidents, indicateurs, date de révision.
      </M7Part>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="coral" icon="x" title="Une charte vitrine" size={25} cls={A.right} style={dl(300)}>
        De belles valeurs, aucun nom, aucune règle concrète. Publiée, puis oubliée.
      </Card>
      <Card tone="green" icon="check" title="Une charte vivante" size={25} cls={A.right} style={dl(450)}>
        Des règles vérifiables, des responsables nommés, une date de révision.
      </Card>
    </div>
  </Frame>
);

// ─── M7 · Example: the Mutuelle's charter v1 ────────────────────────────────
const M7Rule = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} size={40} />
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M7_Charter: Page = () => (
  <Frame mod={7} label="Module 07 · Fil rouge">
    <Title>Exemple : la charte IA de la Mutuelle, version 1</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, padding: '30px 44px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name="leaf" tone="teal" size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>Charte éthique IA · Mutuelle des Érables</span>
        <Tag tone="grey" size={20} style={{ marginLeft: 'auto' }}>
          Version 1 · révision en juin 2027
        </Tag>
      </div>
      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 50, rowGap: 20 }}>
        <M7Rule n={1}>Nos principes : équité, transparence, vie privée, contrôle humain.</M7Rule>
        <M7Rule n={2}>Un membre sait toujours quand il échange avec une IA.</M7Rule>
        <M7Rule n={3}>Aucune décision qui touche un membre ou un candidat sans révision humaine possible.</M7Rule>
        <M7Rule n={4}>Jamais de données de santé, de CV ni de dossier dans un outil non approuvé.</M7Rule>
        <M7Rule n={5}>Tout projet d’IA passe par le comité IA et une EFVP, avant achat ou développement.</M7Rule>
        <M7Rule n={6}>Chaque système a un propriétaire nommé, qui en répond.</M7Rule>
        <M7Rule n={7}>Les résultats sont testés par groupe avant le lancement, puis chaque année.</M7Rule>
        <M7Rule n={8}>Un doute, un incident ? On le signale à Chloé, sans crainte de reproche.</M7Rule>
      </div>
    </div>
  </Frame>
);

// ─── M7 · QCM & synthesis ───────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <QcmPage
    mod={7}
    n={5}
    title="Une charte qui sert vraiment"
    q="Une charte éthique IA est vraiment utile quand…"
    explain="Une charte vivante contient des règles vérifiables, nomme des responsables et prévoit un suivi. Le reste est de la communication."
  >
    <Opt why="Piège ! La publier montre l’engagement, mais une charte vitrine n’a jamais empêché un dérapage.">elle est publiée en bonne place sur le site web</Opt>
    <Opt why="Piège ! S’inspirer d’un cadre reconnu est une bonne idée ; le recopier sans le traduire en règles concrètes, non.">elle reprend mot pour mot la Déclaration de Montréal</Opt>
    <Opt ok why="Exact : des noms, des règles vérifiables, une date de révision. C’est ce qui manquait dans le cas de l’atelier 2.">
      elle nomme des responsables et prévoit un suivi
    </Opt>
    <Opt why="Piège ! Tout interdire pousse les employés vers des outils non approuvés, en cachette. Le risque augmente.">elle interdit toute utilisation de l’IA générative</Opt>
  </QcmPage>
);

const M7_Synth: Page = () => (
  <SynthPage
    mod={7}
    title="Module 7 · Ce qu’il faut retenir"
    poste={
      <>
        Demandez : qui, chez nous, peut arrêter un système d’IA qui dérape ?
        <br />
        <br />
        Si personne ne sait répondre, vous avez trouvé votre premier chantier.
      </>
    }
  >
    <SynthRow n={1} tone="coral" d={100}>
      Une IA n’est <b>jamais</b> responsable : l’organisation l’est toujours.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      Six rôles à <b>nommer</b>, du comité de direction à chaque employé.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Cinq points de contrôle, et <b>un bouton d’arrêt</b> à chacun.
    </SynthRow>
    <SynthRow n={4} tone="teal" d={460}>
      Une charte en cinq rubriques : principes, règles, données, <b>rôles, suivi</b>.
    </SynthRow>
    <SynthRow n={5} tone="green" d={580}>
      Une charte <b>vivante</b>, pas vitrine.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M7_Divider, M7_AirCanada, M7_Roles, M7_Lifecycle, M7_CharterParts, M7_Charter, M7_Qcm, M7_Synth];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 7 (≈ 14 h 35, au retour de la pause · SOBEYS : ≈ 10 h 35)

OBJECTIF — Passer des principes à l'organisation : rôles, responsabilités, charte (contenu officiel du chapitre 5).

DIRE — « Le cas de l'atelier 2 l'a montré : le problème n'était pas seulement l'algorithme, c'était l'absence de gouvernance. Module 7 : qui décide, qui vérifie, qui répond. Et ce que contient une charte éthique IA, celle que vous écrirez à l'atelier 3. »

TRANSITION — « D'abord, une question de principe : une IA peut-elle être responsable ? »`,
  `⏱ 3 min · AIR CANADA (3 clics)

DIRE — « Colombie-Britannique, février 2024. Après le décès de sa grand-mère, Jake Moffatt demande à l'agent conversationnel d'Air Canada s'il existe un tarif de deuil. L'agent lui dit qu'il peut demander le remboursement après son voyage, dans les 90 jours. C'est faux : la politique d'Air Canada ne le permet pas. »
→ beat 1 : « Devant le Tribunal de résolution civile, Air Canada soutient que son agent conversationnel est une entité distincte, responsable de ses propres actes. »
→ beat 2 : « Le tribunal rejette l'argument : l'entreprise est responsable de toute l'information de son site, qu'elle vienne d'une page statique ou d'un agent conversationnel. Air Canada doit rembourser la différence, environ 650 $, plus les intérêts et les frais. »
→ beat 3 : « La règle : une IA n'est jamais responsable. Une organisation l'est toujours. Et en son sein, quelqu'un doit l'être, nommément. »

LIEN — C'est la réponse au QCM 2 de ce matin, sur Léa.

SOBEYS — Dites « de la matinée 1 » au lieu de « de ce matin ».

TRANSITION — « Alors, qui fait quoi ? »`,
  `⏱ 5 min · SIX RÔLES

DIRE — Parcourez les six cartes, avec la correspondance à la Mutuelle :
• La direction : fixe l'ambition et les limites, arbitre, peut tout arrêter. Le comité de direction.
• Le comité IA : approuve les projets à risque, tient le registre des systèmes d'IA. Nathalie le préside, avec Chloé, Mei, et des représentants des métiers. Dans une petite organisation, ce peut être deux ou trois personnes une fois par mois.
• Le responsable de la protection des renseignements personnels : EFVP, consentement, incidents. Chloé. « Consulté au début, pas à la fin. »
• Le propriétaire du système : une personne du métier, pas des TI, qui répond du système au quotidien. Samir pour le tri des CV, Vincent pour Léa et les campagnes.
• L'équipe données et TI : teste les biais, documente, surveille, sécurise. Mei.
• Chaque employé : respecte la charte, utilise les outils approuvés, signale un problème.

QUESTION — « Dans votre organisation, lesquels de ces rôles existent déjà, au moins de fait ? » Deux réponses au micro. Si un participant a répondu 5 au sondage de ce matin (règles d'usage), c'est le moment de lui donner la parole.

SOBEYS — Dites « de la matinée 1 » au lieu de « de ce matin ».

TRANSITION — « Ces rôles interviennent à des moments précis de la vie d'un projet. »`,
  `⏱ 4 min · CINQ POINTS DE CONTRÔLE (6 clics)

DIRE —
→ beat 1 : « L'idée : une fiche projet d'une page et un niveau de risque. Le comité IA est informé. »
→ beat 2 : « La conception : l'EFVP. Quelles données, pour quel but. »
→ beat 3 : « Les essais : on teste les biais par groupe, la fiabilité, la qualité des explications, avant le lancement. »
→ beat 4 : « Le lancement : les personnes sont informées, un recours est prévu, un humain reste dans la boucle. »
→ beat 5 : « Le suivi : des indicateurs, un registre des incidents, une revue annuelle. Un modèle se dégrade quand le monde change. »
→ beat 6 : « Et à chaque point, un bouton d'arrêt : quelqu'un peut suspendre le projet. C'est ce qui manquait dans le cas de l'atelier 2. »

À SOULIGNER — C'est proportionné : un filtre anti-pourriel ne passe pas par les cinq portes avec la même intensité qu'un score de fraude.

TRANSITION — « Tout ça s'écrit dans un document : la charte. »`,
  `⏱ 4 min · LA CHARTE EN CINQ RUBRIQUES

DIRE — « Une charte éthique IA tient en une page, en cinq rubriques. C'est le modèle de votre atelier. »
1. Nos principes : trois à cinq, reformulés avec nos mots (pas les dix de Montréal recopiés).
2. Nos règles d'usage : permis, interdit, soumis à accord.
3. Nos données : le feu tricolore de ce matin.

SOBEYS — « de la matinée 1 » au lieu de « de ce matin ».
4. Nos rôles : qui approuve, qui répond, à qui signaler.
5. Notre suivi : incidents, indicateurs, date de révision.

À DROITE — « Une charte vitrine : de belles valeurs, aucun nom. Une charte vivante : des règles vérifiables, des noms, une date. »

TEST SIMPLE — « Pour chaque phrase de votre charte : peut-on vérifier si elle est respectée ? Si non, elle est décorative. »

TRANSITION — « Voici la version 1 de la Mutuelle. »`,
  `⏱ 3 min · EXEMPLE DE CHARTE

DIRE — Lisez les huit règles en soulignant :
• la règle 2 : transparence, en écho à Léa et au règlement européen ;
• la règle 3 : la révision humaine, en écho à l'article 12.1 et au cas de l'atelier 2 ;
• la règle 5 : le passage obligé par le comité et l'EFVP, avant achat ;
• la règle 6 : un propriétaire nommé, en écho à Air Canada ;
• la règle 8 : « sans crainte de reproche ». Sans cette phrase, personne ne signale rien.

À SOULIGNER — Le bandeau : « Version 1, révision en juin 2027 ». Une charte vivante a une date.

TRANSITION — « Une question pour vérifier, puis c'est à vous. »`,
  `⏱ 2 min · QCM 5

RÉPONSE — C : elle nomme des responsables et prévoit un suivi.
• A ✗ PIÈGE — Publier ne suffit pas.
• B ✗ PIÈGE — S'inspirer oui, recopier non.
• D ✗ PIÈGE — Tout interdire pousse vers l'usage caché (« shadow AI »).

TRANSITION — « Bilan du module. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 7

DIRE — Relisez les cinq points.

À VOTRE POSTE — « Qui, chez nous, peut arrêter un système d'IA qui dérape ? Si personne ne sait répondre, vous avez trouvé votre premier chantier. »

TRANSITION — « Dernier atelier : votre mini-charte. »`,
];
// @@NOTES-END
