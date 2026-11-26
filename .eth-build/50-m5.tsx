// ─── M5 · Divider ───────────────────────────────────────────────────────────
const M5_Divider: Page = () => (
  <Section n={5} title="Loi 25 et principes de l’IA responsable" sub="Ce que la loi impose déjà au Québec, et les principes qui guident le reste." dur="≈ 40 min">
    <SecItem n={1}>La Loi 25 : ce qu’elle exige quand on utilise l’IA</SecItem>
    <SecItem n={2}>Décisions automatisées et EFVP</SecItem>
    <SecItem n={3}>La Déclaration de Montréal et les principes de l’IA responsable</SecItem>
    <SecItem n={4}>Ailleurs : l’Europe, le Canada, les normes</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// Photo inset, top-right, beside the title (titles and ledes on these pages stay under 1200 px).
const M5Inset = ({ id, pos }: { id: PhotoId; pos?: string }) => (
  <Photo id={id} w={400} h={168} pos={pos} cls={A.right} style={{ position: 'absolute', left: 1400, top: 98, boxShadow: SHADOW, ...dl(200) }} />
);

// ─── M5 · Loi 25 timeline ───────────────────────────────────────────────────
const M5Mile = ({ n, x, date, tone, title, children }: { n: number; x: number; date: string; tone: Tone; title: string; children: ReactNode }) => (
  <>
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 18, top: 482, width: 36, height: 36, borderRadius: 99, background: '#fff', boxShadow: `inset 0 0 0 9px ${STRONG[tone]}` }} />
    <div className={b.on(n)} style={{ position: 'absolute', left: x - 250, top: 550, width: 500 }}>
      <div style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 28px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{date}</div>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{children}</div>
      </div>
    </div>
  </>
);

const M5_Law25: Page = () => (
  <Frame mod={5} beats={3}>
    <Title w={1200}>La Loi 25 en bref</Title>
    <Lede w={1200}>Adoptée en 2021, elle modernise la protection des renseignements personnels.</Lede>
    <M5Inset id="parlement" pos="50% 40%" />
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 24, ...dl(100) }}>
      <Tag tone="blue" size={22}>
        <Icon name="org" size={22} /> Entreprises et organismes publics
      </Tag>
      <Tag tone="violet" size={22}>
        <Icon name="shield" size={22} /> Surveillée par la CAI
      </Tag>
      <Tag tone="coral" size={22}>
        <Icon name="money" size={22} /> Jusqu’à 25 M$ ou 4 % du chiffre d’affaires mondial
      </Tag>
    </div>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 496, width: 1680, height: 8, borderRadius: 4, background: C.rule, ...dl(200) }} />
    <M5Mile n={1} x={390} date="22 sept. 2022" tone="blue" title="Un responsable, des incidents déclarés">
      Une personne responsable de la protection des renseignements personnels. Les incidents à risque sont déclarés à la CAI.
    </M5Mile>
    <M5Mile n={2} x={960} date="22 sept. 2023" tone="violet" title="Le gros morceau">
      Évaluation des facteurs relatifs à la vie privée, consentement, transparence, décisions automatisées, sanctions.
    </M5Mile>
    <M5Mile n={3} x={1530} date="22 sept. 2024" tone="teal" title="La portabilité">
      Une personne peut obtenir ses renseignements dans un format technologique structuré et couramment utilisé.
    </M5Mile>
  </Frame>
);

// ─── M5 · What Loi 25 requires when you use AI ──────────────────────────────
const M5Duty = ({ d, icon, tone, name, art, children }: { d: number; icon: IconName; tone: Tone; name: string; art: string; children: ReactNode }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 320, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={54} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto' }}>
        <Tag tone="grey" size={19}>
          {art}
        </Tag>
      </div>
    </div>
  </div>
);

const M5_Duties: Page = () => (
  <Frame mod={5}>
    <Title>Ce que la Loi 25 exige quand on utilise l’IA</Title>
    <Lede>Six obligations qui touchent directement un projet d’IA, ici dans une entreprise privée.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 26, columnGap: 30 }}>
      <M5Duty d={100} icon="humanCheck" tone="blue" name="Un responsable désigné" art="Art. 3.1">
        Par défaut, la personne qui a la plus haute autorité. Elle peut déléguer par écrit.
      </M5Duty>
      <M5Duty d={200} icon="search" tone="violet" name="Une évaluation avant" art="Art. 3.3 · EFVP">
        Tout nouveau système qui traite des renseignements personnels passe par une EFVP.
      </M5Duty>
      <M5Duty d={300} icon="check" tone="green" name="Un consentement éclairé" art="Art. 12 et 14">
        Pour des fins précises, annoncées. Exprès pour les renseignements sensibles.
      </M5Duty>
      <M5Duty d={400} icon="eye" tone="yellow" name="Le profilage annoncé" art="Art. 8.1">
        Informer la personne, et désactiver ces fonctions par défaut.
      </M5Duty>
      <M5Duty d={500} icon="cpu" tone="teal" name="La décision automatisée" art="Art. 12.1">
        Informer, expliquer sur demande, permettre une révision par une personne.
      </M5Duty>
      <M5Duty d={600} icon="alert" tone="coral" name="Les incidents déclarés" art="Art. 3.5 à 3.8">
        Aviser la CAI et les personnes en cas de risque de préjudice sérieux. Tenir un registre.
      </M5Duty>
    </div>
  </Frame>
);

// ─── M5 · Zoom on art. 12.1 ─────────────────────────────────────────────────
const M5Right = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '26px 28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Num n={n} tone="teal" size={48} />
        <Icon name={icon} size={36} color={T.teal.fg} />
      </div>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5_Art12: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Zoom sur l’article 12.1 : la décision automatisée</Title>
    <Lede>Quand une décision repose exclusivement sur un traitement automatisé de renseignements personnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', alignItems: 'center', gap: 20 }}>
      <M5Right n={1} icon="bell" title="Informer la personne">
        Au plus tard au moment où on l’informe de la décision.
      </M5Right>
      <FlowArrow w={50} color={C.teal} cls={b.fade(2)} />
      <M5Right n={2} icon="bulb" title="Expliquer, sur demande">
        Les renseignements utilisés, les raisons et les principaux facteurs. Le droit de les faire corriger.
      </M5Right>
      <FlowArrow w={50} color={C.teal} cls={b.fade(3)} />
      <M5Right n={3} icon="humanCheck" title="Écouter, puis réviser">
        La personne présente ses observations à quelqu’un qui peut réviser la décision.
      </M5Right>
    </div>
    <Callout cls={b.on(4)} title="Pour le projet P3 de Mei" tone="yellow" icon="leaf" size={26} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      Si le score suspend seul les versements, l’article s’applique. Un vrai contrôle humain avant la décision change la donne… s’il n’est pas un simple tampon.
    </Callout>
  </Frame>
);

// ─── M5 · EFVP: five questions before launching P3 ──────────────────────────
const M5_Efvp: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>L’EFVP : cinq questions avant de lancer le projet P3</Title>
    <Lede>Évaluation des facteurs relatifs à la vie privée. Pour chaque question, dites-moi : la Mutuelle a-t-elle la réponse ?</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1060, ...dl(150) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="efvp-1">Quelles données, et sont-elles toutes nécessaires ?</CheckItem>
        <CheckItem id="efvp-2">Pour quelle finalité, annoncée aux membres ?</CheckItem>
        <CheckItem id="efvp-3">Où sont-elles hébergées ? Sortent-elles du Québec ?</CheckItem>
        <CheckItem id="efvp-4">Qui y a accès, et combien de temps les garde-t-on ?</CheckItem>
        <CheckItem id="efvp-5">Quels risques pour les membres, et quelles mesures ?</CheckItem>
      </div>
    </Checklist>
    <div style={{ position: 'absolute', left: 1240, top: 290, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="violet" icon="clock" title="Quand ?" size={25} cls={A.right} style={dl(300)}>
        Avant d’acheter ou de développer le système. Pas la veille de la mise en service.
      </Card>
      <Card tone="teal" icon="users" title="Qui ?" size={25} cls={A.right} style={dl(420)}>
        Le chef de projet, avec le responsable de la protection des renseignements personnels.
      </Card>
      <Callout cls={A.right} title="Proportionnée" tone="blue" icon="scale" size={24} style={dl(540)}>
        Plus les données sont sensibles, plus l’évaluation est poussée.
      </Callout>
    </div>
  </Frame>
);

// ─── M5 · Montréal Declaration ──────────────────────────────────────────────
const M5Prin = ({ d, n, icon, tone, children }: { d: number; n: number; icon: IconName; tone: Tone; children: ReactNode }) => (
  <div className={A.pop} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 230, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.faint }}>{pad(n)}</span>
        <IconTile name={icon} tone={tone} size={58} />
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 'auto', fontFamily: display, fontWeight: 700, fontSize: 29, lineHeight: 1.12, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M5_Montreal: Page = () => (
  <Frame mod={5}>
    <Title w={1200}>La Déclaration de Montréal : dix principes</Title>
    <Lede w={1200}>Pour un développement responsable de l’IA (2018). Une démarche citoyenne.</Lede>
    <M5Inset id="montreal" pos="50% 60%" />
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 312px)', rowGap: 26, columnGap: 30 }}>
      <M5Prin d={100} n={1} icon="smile" tone="green">
        Bien-être
      </M5Prin>
      <M5Prin d={160} n={2} icon="user" tone="blue">
        Respect de l’autonomie
      </M5Prin>
      <M5Prin d={220} n={3} icon="lock" tone="violet">
        Protection de l’intimité et de la vie privée
      </M5Prin>
      <M5Prin d={280} n={4} icon="users" tone="teal">
        Solidarité
      </M5Prin>
      <M5Prin d={340} n={5} icon="chat" tone="yellow">
        Participation démocratique
      </M5Prin>
      <M5Prin d={400} n={6} icon="scale" tone="coral">
        Équité
      </M5Prin>
      <M5Prin d={460} n={7} icon="globe" tone="green">
        Inclusion de la diversité
      </M5Prin>
      <M5Prin d={520} n={8} icon="shieldCheck" tone="blue">
        Prudence
      </M5Prin>
      <M5Prin d={580} n={9} icon="humanCheck" tone="violet">
        Responsabilité
      </M5Prin>
      <M5Prin d={640} n={10} icon="leaf" tone="teal">
        Développement soutenable
      </M5Prin>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, fontSize: 24, lineHeight: 1.4, color: C.muted, ...dl(800) }}>
      Texte intégral et signataires : declarationmontreal-iaresponsable.com
    </div>
  </Frame>
);

// ─── M5 · Responsible AI in six words ───────────────────────────────────────
const M5Pillar = ({ n, icon, tone, name, q }: { n: number; icon: IconName; tone: Tone; name: string; q: string }) => (
  <div className={b.on(n)}>
    <div style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        <b style={{ color: T[tone].fg }}>La question :</b> {q}
      </div>
    </div>
  </div>
);

const M5_Pillars: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>L’IA responsable en six principes opérationnels</Title>
    <Lede>Ce qui revient dans tous les cadres : Montréal, OCDE, UNESCO, ISO. Chacun devient une question.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 26, columnGap: 30 }}>
      <M5Pillar n={1} icon="scale" tone="violet" name="Équité" q="Qui pourrait être désavantagé, et l’a-t-on testé ?" />
      <M5Pillar n={2} icon="eye" tone="teal" name="Transparence" q="Les personnes savent-elles qu’une IA intervient ?" />
      <M5Pillar n={3} icon="lock" tone="blue" name="Vie privée" q="Utilise-t-on le minimum de données, pour un but annoncé ?" />
      <M5Pillar n={4} icon="shieldCheck" tone="green" name="Fiabilité" q="Que se passe-t-il quand le système se trompe ?" />
      <M5Pillar n={5} icon="humanCheck" tone="yellow" name="Contrôle humain" q="Qui peut arrêter, corriger ou réviser une décision ?" />
      <M5Pillar n={6} icon="flag" tone="coral" name="Responsabilité" q="Qui répond du système, nommément ?" />
    </div>
  </Frame>
);

// ─── M5 · Elsewhere: EU AI Act, Canada, standards ───────────────────────────
const M5Level = ({ d, w, tone, name, ex, when }: { d: number; w: number; tone: Tone; name: string; ex: string; when: string }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 24, ...dl(d) }}>
    <div style={{ width: 640, flex: 'none', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: w, height: 104, background: STRONG[tone], borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em' }}>
        {name}
      </div>
    </div>
    <div>
      <div style={{ fontSize: 24, lineHeight: 1.35, color: C.ink }}>{ex}</div>
      <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600, color: T[tone].fg }}>{when}</div>
    </div>
  </div>
);

const M5_World: Page = () => (
  <Frame mod={5}>
    <Title w={1200}>Ailleurs : l’Europe classe l’IA par risque</Title>
    <Lede w={1200}>Le règlement européen vise quiconque vend ou utilise de l’IA dans l’Union.</Lede>
    <M5Inset id="berlaymont" pos="40% 50%" />
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1160, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M5Level d={100} w={260} tone="coral" name="INACCEPTABLE" ex="Notation sociale, manipulation, émotions au travail" when="Interdit depuis le 2 février 2025" />
      <M5Level d={250} w={400} tone="yellow" name="HAUT RISQUE" ex="Recrutement, crédit, assurance vie et santé" when="Obligations au 2 décembre 2027 (report de 2026)" />
      <M5Level d={400} w={520} tone="blue" name="TRANSPARENCE" ex="Agents conversationnels, contenus générés" when="Signaler l’IA : depuis le 2 août 2026" />
      <M5Level d={550} w={640} tone="green" name="MINIMAL" ex="Filtre anti-pourriel, jeux vidéo" when="Aucune obligation particulière" />
    </div>
    <div style={{ position: 'absolute', left: 1330, top: 280, width: 470, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="coral" icon="flag" title="Au Canada" size={24} cls={A.right} style={dl(600)}>
        Pas de loi propre à l’IA. Le projet de loi C-36 (juin 2026) renforcerait les droits face aux décisions automatisées.
      </Card>
      <Card tone="violet" icon="book" title="Les normes" size={24} cls={A.right} style={dl(750)}>
        ISO/IEC 42001 (2023) : un système de management de l’IA, certifiable.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · Exercise: sort the uses by EU risk level ──────────────────────────
const M5Zone = ({ x, icon, tone, label }: { x: number; icon: IconName; tone: Tone; label: string }) => (
  <div
    className={A.fade}
    style={{ position: 'absolute', left: x, top: 520, width: 397, height: 430, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, border: `3px dashed ${T[tone].bd}`, padding: '16px 18px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M5Key = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span className={b.pop(1)} style={{ flex: 'none', marginLeft: 'auto', padding: '2px 10px', borderRadius: 8, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 18 }}>
    {children}
  </span>
);

const M5_RiskSort: Page = () => (
  <Frame mod={5} kind="exercice" beats={1}>
    <Title>À vous : si la Mutuelle opérait en Europe…</Title>
    <Lede>Dites-moi à quel niveau de risque va chaque usage. Le corrigé apparaît au clic.</Lede>
    <M5Zone x={120} icon="x" tone="coral" label="Inacceptable" />
    <M5Zone x={547} icon="alert" tone="yellow" label="Haut risque" />
    <M5Zone x={974} icon="eye" tone="blue" label="Transparence" />
    <M5Zone x={1401} icon="check" tone="green" label="Minimal" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Noter les membres selon leur vie sociale <M5Key tone="coral">INTERDIT</M5Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Trier les CV des candidats <M5Key tone="yellow">HAUT</M5Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Léa, l’agent conversationnel <M5Key tone="blue">TRANSP.</M5Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      Le filtre anti-pourriel <M5Key tone="green">MINIMAL</M5Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Tarifer une assurance vie selon le profil <M5Key tone="yellow">HAUT</M5Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Détecter les émotions des employés en réunion <M5Key tone="coral">INTERDIT</M5Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      Recommander un article du blogue <M5Key tone="green">MINIMAL</M5Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Une image publicitaire générée par IA <M5Key tone="blue">TRANSP.</M5Key>
    </Drag>
  </Frame>
);

// ─── M5 · QCM & synthesis ───────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={4}
    title="Le score de fraude face à la Loi 25"
    q="Le score de Mei suspend seul les versements d’un membre, sans regard humain. Que doit faire la Mutuelle, au minimum ?"
    explain="Décision exclusivement automatisée = article 12.1 : informer, donner sur demande les renseignements utilisés et les principaux facteurs, et permettre de présenter ses observations à une personne qui peut réviser la décision."
  >
    <Opt why="Piège ! La lutte contre la fraude est légitime, mais elle ne dispense pas des obligations de la Loi 25.">Rien : la lutte contre la fraude justifie le secret</Opt>
    <Opt ok why="Exact : ce sont les trois obligations de l’article 12.1, en vigueur depuis septembre 2023.">
      Informer le membre, expliquer sur demande, offrir une révision humaine
    </Opt>
    <Opt why="Piège ! La CAI surveille et enquête, mais n’autorise pas chaque décision à l’avance.">Obtenir l’accord de la CAI avant chaque suspension</Opt>
    <Opt why="Piège ! La loi demande les principaux facteurs de la décision, pas le code du modèle.">Publier le code source du modèle</Opt>
  </QcmPage>
);

const M5_Synth: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={
      <>
        Trouvez qui est la personne responsable de la protection des renseignements personnels dans votre organisation.
        <br />
        <br />
        Demandez-lui : nos projets d’IA ont-ils eu leur EFVP ?
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      La Loi 25 s’applique <b>déjà</b> à tout projet d’IA qui touche des renseignements personnels.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      <b>EFVP avant</b> tout nouveau système ; profilage annoncé et désactivé par défaut.
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Décision automatisée : <b>informer, expliquer, réviser</b>.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Six principes : équité, transparence, vie privée, fiabilité, <b>contrôle humain, responsabilité</b>.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      L’Europe classe par <b>niveau de risque</b> ; le Canada mise sur la vie privée.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M5_Divider, M5_Law25, M5_Duties, M5_Art12, M5_Efvp, M5_Montreal, M5_Pillars, M5_World, M5_RiskSort, M5_Qcm, M5_Synth];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 5 (≈ 13 h, au retour du dîner · SOBEYS : DÉBUT DE LA MATINÉE 2, 9 h)

OBJECTIF — Appliquer les principes de l'IA responsable et les cadres réglementaires comme la Loi 25 (objectif officiel n° 4).

DIRE — « Bon retour ! Ce matin, on a vu ce qui peut mal tourner. Maintenant : ce que la loi impose déjà au Québec, et les principes qui guident le reste. Rassurez-vous : pas besoin d'être juriste. »

SOBEYS — Début de la matinée 2. Vérifiez son, caméra et assistant d'IA ouvert. Rappel de 3 minutes, pris sur le temps du module : « Qu'est-ce qui vous est resté de la matinée 1 ? » Deux ou trois réponses au micro, puis dites : « Bienvenue ! À la matinée 1, on a vu ce qui peut mal tourner. Aujourd'hui : ce que la loi impose déjà au Québec, et les principes qui guident le reste. Rassurez-vous : pas besoin d'être juriste. »

PRUDENCE — Vous n'êtes pas juriste non plus : pour un cas précis, renvoyez toujours au responsable de la protection des renseignements personnels de l'organisation, ou à un avocat. Ce module donne des repères, pas un avis juridique.

TRANSITION — « La Loi 25, en trois dates. »`,
  `⏱ 4 min · LA LOI 25 EN BREF (3 clics)

DIRE — « Son vrai nom : Loi modernisant des dispositions législatives en matière de protection des renseignements personnels. Adoptée en septembre 2021. Elle modifie plusieurs lois, dont la loi sur le secteur privé et la loi sur l'accès, pour le secteur public. Elle vise les entreprises et les organismes publics, sous la surveillance de la Commission d'accès à l'information, la CAI. »

« Les sanctions sont sérieuses : pour une entreprise, jusqu'à 10 M$ ou 2 % du chiffre d'affaires mondial en sanction administrative, et jusqu'à 25 M$ ou 4 % en amende pénale. Les vrais chiffres, cette fois ! »

→ beat 1 : « 22 septembre 2022 : chaque organisation a une personne responsable de la protection des renseignements personnels, et doit déclarer à la CAI les incidents de confidentialité qui présentent un risque de préjudice sérieux. »
→ beat 2 : « 22 septembre 2023 : le gros morceau. L'évaluation des facteurs relatifs à la vie privée, l'EFVP ; le consentement ; la transparence ; les décisions automatisées ; les sanctions. »
→ beat 3 : « 22 septembre 2024 : la portabilité. Une personne peut obtenir ses renseignements dans un format structuré et couramment utilisé. »

TRANSITION — « Concrètement, qu'est-ce que ça change pour un projet d'IA ? »`,
  `⏱ 5 min · SIX OBLIGATIONS POUR UN PROJET D'IA

DIRE — Parcourez les six cartes (articles de la loi sur le secteur privé) :
• « Un responsable désigné (art. 3.1) : par défaut, la personne qui a la plus haute autorité, le PDG. Elle peut déléguer par écrit. Ses coordonnées sont publiées sur le site. À la Mutuelle, c'est Chloé. »
• « Une évaluation avant (art. 3.3) : tout projet d'acquisition, de développement ou de refonte d'un système qui traite des renseignements personnels passe par une EFVP. Un projet d'IA, presque toujours. »
• « Un consentement éclairé (art. 12 et 14) : pour des fins précises, annoncées, en termes simples. Exprès pour les renseignements sensibles, comme la santé. Réutiliser des données pour une autre fin demande en principe un nouveau consentement, sauf exceptions prévues par la loi. »
• « Le profilage annoncé (art. 8.1) : si on utilise une technologie qui permet d'identifier, de localiser ou de profiler quelqu'un, on l'en informe, et ces fonctions sont désactivées par défaut. Pensez aux campagnes de Vincent. »
• « La décision automatisée (art. 12.1) : zoom à la page suivante. »
• « Les incidents (art. 3.5 à 3.8) : aviser la CAI et les personnes concernées en cas de risque de préjudice sérieux, et tenir un registre de tous les incidents. »

À SOULIGNER — Il y a aussi la confidentialité par défaut (art. 9.1) : les paramètres d'un produit offert au public doivent assurer le plus haut niveau de confidentialité, sans intervention de la personne.

SECTEUR PUBLIC — Les organismes publics ont des obligations équivalentes, dans la loi sur l'accès.

TRANSITION — « Arrêtons-nous sur l'obligation la plus directement liée à l'IA. »`,
  `⏱ 4 min · ARTICLE 12.1 (4 clics)

DIRE — « L'article 12.1 s'applique quand une décision repose exclusivement sur un traitement automatisé de renseignements personnels. Trois obligations, qu'on a vues dans la lettre "explicable" ce matin. »

SOBEYS — Dites « à la matinée 1 » au lieu de « ce matin ».
→ beat 1 : « Informer la personne que la décision a été prise de façon automatisée, au plus tard au moment où on l'informe de la décision. »
→ beat 2 : « Sur demande, lui dire quels renseignements ont été utilisés, les raisons et les principaux facteurs et paramètres de la décision, et son droit de faire corriger ces renseignements. »
→ beat 3 : « Lui permettre de présenter ses observations à un membre du personnel en mesure de réviser la décision. »
→ beat 4 : « Pour P3 : si le score suspend seul les versements, l'article s'applique. Si un analyste examine vraiment chaque dossier avant, ce n'est plus "exclusivement automatisé". Mais attention au tampon : un humain qui approuve 500 dossiers à l'heure sans les lire ne change rien sur le fond. »

QUESTION — « Dans votre organisation, quelles décisions sont déjà prises par un système, sans humain ? » Une ou deux réponses.

TRANSITION — « Et avant de lancer P3, l'EFVP. »`,
  `⏱ 4 min · EFVP (cases à cocher)

ANIMATION — Lisez chaque question et demandez au groupe : « La Mutuelle a-t-elle la réponse pour P3 ? Oui ou non ? » Cochez celles pour lesquelles le groupe estime que la réponse est connue. Il en reste presque toujours : c'est le but.

DIRE — « L'EFVP, c'est l'évaluation des facteurs relatifs à la vie privée. Pas un formulaire de plus : cinq questions qu'un bon chef de projet se pose de toute façon. »
• Quelles données, et sont-elles toutes nécessaires ? (minimisation)
• Pour quelle finalité, annoncée aux membres ?
• Où sont-elles hébergées ? Si elles sortent du Québec, l'article 17 exige une évaluation supplémentaire (protection adéquate).
• Qui y a accès, et combien de temps les garde-t-on ?
• Quels risques pour les membres, et quelles mesures pour les réduire ?

À DROITE — Quand : avant d'acheter ou de développer. Qui : le chef de projet, avec la personne responsable. Proportionnée : plus les données sont sensibles, plus l'évaluation est poussée.

RESSOURCE — La CAI publie un guide d'accompagnement pour réaliser une EFVP (cai.gouv.qc.ca).

TRANSITION — « La loi dit le minimum. Les principes disent l'idéal. Ils sont nés en partie ici, à Montréal. »`,
  `⏱ 4 min · DÉCLARATION DE MONTRÉAL

DIRE — « En 2018, l'Université de Montréal publie la Déclaration de Montréal pour un développement responsable de l'intelligence artificielle, au terme d'une démarche de consultation citoyenne. Dix principes. »

Parcourez-les rapidement, en donnant un exemple pour deux ou trois :
• Bien-être : l'IA doit améliorer les conditions de vie.
• Autonomie : elle ne doit pas manipuler ni décider à notre place sans notre accord.
• Vie privée : protéger l'intimité (les données de santé de la Mutuelle).
• Solidarité, participation démocratique.
• Équité : ne pas créer ou renforcer de discriminations (le tri des CV).
• Inclusion de la diversité (les images stéréotypées de l'atelier 1).
• Prudence : anticiper les effets néfastes.
• Responsabilité : la décision reste humaine, quelqu'un en répond.
• Développement soutenable : l'empreinte énergétique de l'IA compte aussi.

À SOULIGNER — Des centaines d'organisations l'ont signée. Ce n'est pas une loi : c'est un engagement volontaire.

TRANSITION — « Dix principes, c'est beaucoup pour une charte. Résumons en six. »`,
  `⏱ 4 min · SIX PRINCIPES OPÉRATIONNELS (6 clics)

OBJECTIF — Donner la grille qui servira à l'atelier 2 et à la charte de l'atelier 3.

DIRE — « Tous les grands cadres, la Déclaration de Montréal, les principes de l'OCDE (2019, mis à jour en 2024), la recommandation de l'UNESCO (2021), la norme ISO 42001, se recoupent. Six mots reviennent partout. Et chacun devient une question. »
→ beat 1 : Équité. « Qui pourrait être désavantagé, et l'a-t-on testé ? »
→ beat 2 : Transparence. « Les personnes savent-elles qu'une IA intervient ? »
→ beat 3 : Vie privée. « Le minimum de données, pour un but annoncé ? »
→ beat 4 : Fiabilité. « Que se passe-t-il quand le système se trompe ? »
→ beat 5 : Contrôle humain. « Qui peut arrêter, corriger ou réviser ? »
→ beat 6 : Responsabilité. « Qui répond du système, nommément ? »

INSISTER — « Gardez ces six questions sous la main : vous allez vous en servir dans 10 minutes, sur un cas de votre secteur. »

TRANSITION — « Un coup d'œil hors du Québec. »`,
  `⏱ 4 min · AILLEURS : EUROPE, CANADA, NORMES

DIRE — « L'Europe a choisi une approche par niveau de risque, avec le règlement européen sur l'IA, en vigueur depuis août 2024. Il s'applique à toute organisation qui vend ou utilise de l'IA dans l'Union, y compris une entreprise québécoise qui y a des clients. »
• « Risque inacceptable : interdit depuis le 2 février 2025. La notation sociale, la manipulation, la reconnaissance des émotions au travail ou à l'école. »
• « Haut risque : recrutement, crédit, assurance vie et santé, santé, éducation… Des obligations lourdes : gestion des risques, qualité des données, supervision humaine. Initialement prévues pour août 2026, elles ont été reportées au 2 décembre 2027 par le règlement "omnibus" adopté en juillet 2026. »
• « Transparence : un agent conversationnel doit dire qu'il est une IA ; un contenu généré doit être signalé. Applicable depuis le 2 août 2026. »
• « Minimal : le filtre anti-pourriel. Rien de particulier. »

CANADA — « Le projet de loi fédéral sur l'IA, la LIAD, est mort au feuilleton en janvier 2025. Le gouvernement a choisi de ne pas le reprendre : en juin 2026, il a déposé le projet de loi C-36 sur la protection de la vie privée, qui prévoit notamment le droit de savoir quels renseignements ont servi à une décision automatisée et d'en demander la révision. » À VÉRIFIER avant chaque session : l'état d'avancement de C-36 sur parl.ca.

NORMES — « ISO/IEC 42001, publiée fin 2023 : un système de management de l'IA, comme ISO 9001 pour la qualité. Une organisation peut se faire certifier. »

TRANSITION — « Testons ces niveaux de risque sur la Mutuelle. »`,
  `⏱ 4 min · EXERCICE : NIVEAUX DE RISQUE (1 clic pour le corrigé)

ANIMATION — Pour chaque étiquette, demandez le niveau à voix haute et glissez-la selon la majorité. Double-clic pour remettre une étiquette à sa place. → révèle le corrigé.

CORRIGÉ —
• Inacceptable : noter les membres selon leur vie sociale (notation sociale) ; détecter les émotions des employés en réunion (interdit au travail, sauf raisons médicales ou de sécurité).
• Haut risque : trier les CV ; tarifer une assurance vie selon le profil (annexe III du règlement : évaluation des risques et tarification en assurance vie et santé).
• Transparence : Léa (dire qu'on parle à une IA) ; l'image publicitaire générée (la signaler comme générée).
• Minimal : le filtre anti-pourriel ; la recommandation d'articles de blogue.

DÉBAT POSSIBLE — « Et le score de fraude P3 ? » Bonne question : la détection de fraude n'est pas listée telle quelle en haut risque. Mais au Québec, la Loi 25 s'applique de toute façon. Les deux cadres ne se remplacent pas.

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 3 min · QCM 4

RÉPONSE — B : informer, expliquer sur demande, offrir une révision humaine.
• A ✗ PIÈGE — Lutter contre la fraude est légitime, mais ne dispense pas de la loi.
• C ✗ PIÈGE — La CAI n'autorise pas chaque décision à l'avance.
• D ✗ PIÈGE — On doit les principaux facteurs, pas le code.

TRANSITION — « Bilan du module, puis place à un vrai cas. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 5

DIRE — Relisez les cinq points.

À VOTRE POSTE — « Savez-vous qui est la personne responsable de la protection des renseignements personnels chez vous ? Son nom doit figurer sur le site de votre organisation. Demandez-lui si vos projets d'IA ont eu leur EFVP. »

TRANSITION — « Maintenant, un cas de votre secteur. Avec vos six questions en main, vous allez juger… et dire ce que vous auriez fait à leur place. »`,
];
// @@NOTES-END
