// ─── M4 · Divider ───────────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Automatiser et collaborer avec l’IA" sub="Réunions et visites de chantier, courriels, relances : ce qui se répète chaque semaine." dur="≈ 1 h 15">
    <SecItem n={1}>Comptes rendus de réunion et rapports de visite de chantier</SecItem>
    <SecItem n={2}>Des actions aux tâches, sans ressaisie</SecItem>
    <SecItem n={3}>Tri, relances et alertes</SecItem>
    <SecItem n={4}>Chargés de projet et adjointes : travailler ensemble avec l’IA</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── M4 · Before / during / after the meeting ───────────────────────────────
const M4Moment = ({ n, tone, icon, when, children }: { n: number; tone: Tone; icon: IconName; when: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <IconTile name={icon} tone={tone} size={70} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>{when}</span>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    </div>
  </div>
);

const M4Do = ({ icon, children }: { icon: IconName; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 26, lineHeight: 1.35, color: C.ink }}>
    <Icon name={icon} size={30} color={C.blue} style={{ marginTop: 3 }} />
    <span>{children}</span>
  </div>
);

const M4_Meeting: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Une réunion, trois moments où l’IA aide</Title>
    <Lede>9 heures de réunions et de visites par semaine pour Mathieu. Voici où l’IA lui rend du temps.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M4Moment n={1} tone="blue" icon="calendar" when="Avant">
        <M4Do icon="list">Proposer l’ordre du jour à partir des points ouverts</M4Do>
        <M4Do icon="mail">Résumer le fil de courriels avec l’EG</M4Do>
        <M4Do icon="search">Préparer les questions pour l’architecte</M4Do>
      </M4Moment>
      <M4Moment n={2} tone="violet" icon="mic" when="Pendant">
        <M4Do icon="mic">Transcrire dans Teams, avec l’accord de tous</M4Do>
        <M4Do icon="helmet">Au chantier : dicter ses notes au téléphone</M4Do>
        <M4Do icon="camera">Prendre les photos des déficiences</M4Do>
      </M4Moment>
      <M4Moment n={3} tone="green" icon="check" when="Après">
        <M4Do icon="note">Compte rendu ou rapport de visite</M4Do>
        <M4Do icon="kanban">Créer les tâches dans l’outil</M4Do>
        <M4Do icon="send">Courriel de suivi à l’EG et à l’adjointe</M4Do>
      </M4Moment>
    </div>
  </Frame>
);

// ─── M4 · From transcript to minutes (animated extraction) ──────────────────
CSS.push(`
.${P}-m4t{transition:background 450ms ${EASE},box-shadow 450ms ${EASE}}
${at(1)} .${P}-m4t-dec{background:${T.green.bg};box-shadow:inset 5px 0 0 ${C.green}}
${at(2)} .${P}-m4t-act{background:${T.blue.bg};box-shadow:inset 5px 0 0 ${C.blue}}
${at(3)} .${P}-m4t-open{background:${T.yellow.bg};box-shadow:inset 5px 0 0 ${C.yellow}}
`);

const M4Say = ({ who, kind, children }: { who: string; kind?: 'dec' | 'act' | 'open'; children: ReactNode }) => (
  <div className={cx(k('m4t'), kind && k(`m4t-${kind}`))} style={{ display: 'flex', gap: 14, padding: '9px 14px', borderRadius: 8, fontSize: 23, lineHeight: 1.35 }}>
    <span style={{ width: 92, flex: 'none', fontWeight: 700, color: C.soft }}>{who}</span>
    <span style={{ color: C.ink }}>{children}</span>
  </div>
);

const M4Sec = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ marginTop: 14, ...dl(250) }}>
    <Eyebrow c={T[tone].fg} size={21}>
      {title}
    </Eyebrow>
    <div style={{ marginTop: 6, background: T[tone].bg, borderRadius: 10, padding: '10px 16px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M4_Transcript: Page = () => (
  <Frame mod={4} kind="demo" beats={3}>
    <Title>De la transcription au compte rendu</Title>
    <Lede>Réunion de chantier du mardi 2 mars, sur Teams, 6 personnes, 40 minutes. Extrait de la transcription :</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 270, width: 880, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 18px', ...dl(100) }}>
      <M4Say who="Mathieu">Le verre est arrivé, mais il manque 6 unités pour le hall.</M4Say>
      <M4Say who="Boréa">On peut quand même commencer la pose le 22 ?</M4Say>
      <M4Say who="Mathieu" kind="dec">
        Oui. On commence par la façade nord, le hall suivra.
      </M4Say>
      <M4Say who="Patrice" kind="act">
        Je refais les relevés de la façade nord d’ici le 9.
      </M4Say>
      <M4Say who="Mercier" kind="open">
        Et la couleur des panneaux d’allège ? Le client hésite.
      </M4Say>
      <M4Say who="Boréa" kind="open">
        On en reparle jeudi avec la Ville.
      </M4Say>
      <M4Say who="Nadia" kind="act">
        Je relance le verrier pour les 6 unités demain.
      </M4Say>
      <M4Say who="Mathieu">Parfait, merci à tous.</M4Say>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1060, top: 270, width: 740, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.violet}`, padding: '22px 28px 26px', ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="note" size={32} color={C.violet} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>Compte rendu · 2 mars</span>
      </div>
      <M4Sec n={1} tone="green" title="Décision">
        Pose à partir du 22 mars, façade nord d’abord.
      </M4Sec>
      <M4Sec n={2} tone="blue" title="Actions">
        <b>Patrice</b> · relevés de la façade nord · 9 mars
        <br />
        <b>Nadia</b> · relancer le verrier (6 unités) · 3 mars
      </M4Sec>
      <M4Sec n={3} tone="yellow" title="Point ouvert">
        Couleur des panneaux d’allège : décision jeudi, avec la Ville.
      </M4Sec>
    </div>
  </Frame>
);

// ─── M4 · The minutes request (reusable template) ───────────────────────────
const M4Slot = ({ children }: { children: ReactNode }) => (
  <span style={{ background: T.yellow.bg, color: T.yellow.fg, borderRadius: 6, padding: '0 6px', fontWeight: 600 }}>{children}</span>
);

const M4Tip = ({ d, icon, children }: { d: number; icon: IconName; children: ReactNode }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone="green" size={52} />
    <span style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M4_CrPrompt: Page = () => (
  <Frame mod={4}>
    <Title>La demande de compte rendu, prête à copier</Title>
    <Lede>À enregistrer dans votre bibliothèque. Les zones jaunes changent à chaque réunion.</Lede>
    <PromptBox cls={A.left} size={27} style={{ position: 'absolute', left: 120, top: 280, width: 1000, ...dl(100) }}>
      Tu es l’assistant du projet <M4Slot>Méandres</M4Slot>. À partir de la transcription ci-dessous de la réunion de chantier du <M4Slot>2 mars</M4Slot>, rédige le compte rendu en trois parties :
      <br />
      1. <b>Décisions</b> prises (seulement celles qui ont été clairement prises) ;
      <br />
      2. <b>Actions</b> : responsable, action, échéance ;
      <br />
      3. <b>Points ouverts</b> et qui doit trancher.
      <br />
      N’invente rien : si une information manque, écris <b>[à confirmer]</b>. 200 mots au maximum.
      <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, color: C.muted }}>[collez la transcription ou vos notes]</div>
    </PromptBox>
    <div style={{ position: 'absolute', left: 1170, top: 280, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Tip d={300} icon="check">
        « Seulement celles clairement prises » évite les fausses décisions.
      </M4Tip>
      <M4Tip d={420} icon="alert">
        « [à confirmer] » rend visibles les trous au lieu de les combler.
      </M4Tip>
      <M4Tip d={540} icon="users">
        Ajoutez la liste des participants : moins d’erreurs de noms.
      </M4Tip>
      <M4Tip d={660} icon="eye">
        Relisez toujours avant de diffuser : vous signez le compte rendu.
      </M4Tip>
    </div>
  </Frame>
);

// ─── M4 · Exercise: find the errors in the generated minutes ────────────────
const M4CrLine = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 25, lineHeight: 1.45, color: C.ink, padding: '4px 0' }}>{children}</div>;

const M4_CrErrors: Page = () => (
  <Frame mod={4} kind="exercice" beats={4}>
    <Title>Repérez les quatre erreurs de ce compte rendu</Title>
    <Lede>Généré à partir de la même réunion, avec une demande trop vague. Comparez avec la transcription.</Lede>
    <AppWin id="teams" title="Compte rendu généré" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1020, ...dl(100) }} pad={28}>
      <Eyebrow c={T.green.fg} size={21}>
        Décisions
      </Eyebrow>
      <M4CrLine>• Pose à partir du 22 mars, façade nord d’abord.</M4CrLine>
      <M4CrLine>• Panneaux d’allège : gris anthracite retenu.</M4CrLine>
      <Eyebrow c={T.blue.fg} size={21} style={{ marginTop: 14 }}>
        Actions
      </Eyebrow>
      <M4CrLine>• Mathieu : refaire les relevés de la façade nord, d’ici le 9 mars.</M4CrLine>
      <M4CrLine>• Nadia : relancer le verrier d’ici le 15 mars.</M4CrLine>
      <Eyebrow c={T.yellow.fg} size={21} style={{ marginTop: 14 }}>
        Points ouverts
      </Eyebrow>
      <M4CrLine>• Aucun.</M4CrLine>
    </AppWin>
    <M3Pin n={1} x={1110} y={449} />
    <M3Pin n={2} x={1110} y={532} />
    <M3Pin n={3} x={1110} y={576} />
    <M3Pin n={4} x={1110} y={659} />
    <div style={{ position: 'absolute', left: 1190, top: 280, width: 610, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Une fausse décision">
        On a seulement discuté de la couleur. Décision jeudi, avec la Ville.
      </M3Exp>
      <M3Exp n={2} title="La mauvaise personne">
        C’est Patrice qui refait les relevés, pas Mathieu.
      </M3Exp>
      <M3Exp n={3} title="Une date inventée">
        Nadia a dit « demain », soit le 3 mars.
      </M3Exp>
      <M3Exp n={4} title="Un point ouvert effacé">
        La couleur des panneaux reste à trancher.
      </M3Exp>
    </div>
  </Frame>
);

// ─── M4 · Site visit: dictated notes + photos → report ─────────────────────
const M4Photo = ({ n, label }: { n: number; label: string }) => (
  <div style={{ flex: 1, background: C.panel, borderRadius: 12, padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <Icon name="camera" size={40} color={C.soft} />
    <span style={{ fontSize: 19, fontWeight: 600, color: C.soft, textAlign: 'center', lineHeight: 1.25 }}>
      Photo {n} · {label}
    </span>
  </div>
);

const M4Def = ({ id, where, what, who }: { id: string; where: string; what: string; who: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', borderBottom: `1.5px solid ${C.rule}`, fontSize: 21, lineHeight: 1.3, color: C.ink }}>
    <b style={{ width: 44, flex: 'none', color: T.coral.fg }}>{id}</b>
    <span style={{ width: 150, flex: 'none', color: C.soft }}>{where}</span>
    <span style={{ flex: 1 }}>{what}</span>
    <Tag tone="grey" size={18}>
      {who}
    </Tag>
  </div>
);

const M4_Visit: Page = () => (
  <Frame mod={4} kind="demo" beats={4}>
    <Title>La visite de chantier : des notes dictées au rapport</Title>
    <Lede>Mathieu dicte au téléphone en marchant, prend trois photos, puis donne le tout à Copilot.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 270, width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px', ...dl(100) }}>
      <Eyebrow c={C.soft} size={21}>
        Notes dictées · visite du 30 mars
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.5, color: C.ink, fontStyle: 'italic' }}>
        « Façade nord, fenêtres posées à 80 %, euh… axe C le solin est pas fini, faut que Patrice repasse. Fenêtre N-12 vitre égratignée, à changer. Porte d’entrée 2, le ferme-porte frotte. Le hall attend toujours les 6 unités. Boréa veut la liste avant vendredi. »
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <M4Photo n={1} label="solin, axe C" />
        <M4Photo n={2} label="fenêtre N-12" />
        <M4Photo n={3} label="entrée 2" />
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 940, top: 270, width: 860, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.violet}`, padding: '20px 28px 22px', ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="doc" size={30} color={C.violet} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>Rapport de visite · 30 mars</span>
      </div>
      <M4Sec n={1} tone="green" title="Avancement">
        Façade nord : fenêtres posées à 80 %. Hall : en attente de 6 unités scellées.
      </M4Sec>
      <div className={b.on(2)} style={{ marginTop: 14 }}>
        <Eyebrow c={T.coral.fg} size={21}>
          Déficiences
        </Eyebrow>
        <M4Def id="D1" where="Axe C" what="Solin non terminé" who="Patrice" />
        <M4Def id="D2" where="Fenêtre N-12" what="Vitre égratignée, à remplacer" who="Mathieu" />
        <M4Def id="D3" where="Entrée 2" what="Le ferme-porte frotte" who="Patrice" />
      </div>
      <M4Sec n={3} tone="blue" title="Pour Nadia">
        Commander la vitre de N-12 · envoyer la liste à Boréa avant vendredi
      </M4Sec>
    </div>
    <Callout cls={b.on(4)} title="Le réflexe" tone="yellow" icon="eye" size={24} style={{ position: 'absolute', left: 120, top: 800, width: 760, padding: '12px 22px' }}>
      L’IA ne sait que ce que vous dictez. Vérifiez chaque ligne avec les photos avant d’envoyer.
    </Callout>
  </Frame>
);

// ─── M4 · Meeting summary tools ─────────────────────────────────────────────
const M4ToolRow = ({ d, id, where, what, note }: { d: number; id: AppId; where: string; what: string; note: string }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', minHeight: 104, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ width: 340, flex: 'none' }}>
      <AppChip id={id} size={26} />
    </span>
    <span style={{ width: 300, flex: 'none', fontSize: 24, color: C.soft, paddingRight: 20 }}>{where}</span>
    <span style={{ width: 520, flex: 'none', fontSize: 24, lineHeight: 1.35, color: C.ink, paddingRight: 20 }}>{what}</span>
    <span style={{ flex: 1, fontSize: 22, lineHeight: 1.35, color: C.muted }}>{note}</span>
  </div>
);

const M4Th = ({ w, children }: { w?: number; children: ReactNode }) => (
  <span style={{ width: w, flex: w ? 'none' : 1, fontFamily: display, fontWeight: 600, fontSize: 21, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted }}>{children}</span>
);

const M4_Tools: Page = () => (
  <Frame mod={4}>
    <Title>Résumés de réunions : les principaux outils</Title>
    <Lede>Même promesse : transcrire, résumer, extraire les actions. La différence : où vont vos données.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 32px 8px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 52 }}>
        <M4Th w={340}>Outil</M4Th>
        <M4Th w={300}>Où</M4Th>
        <M4Th w={520}>Ce qu’il produit</M4Th>
        <M4Th>À savoir</M4Th>
      </div>
      <M4ToolRow d={150} id="teams" where="Réunions Teams" what="Récapitulatif, tâches de suivi, questions sur la réunion" note="Licence Microsoft 365 Copilot ; transcription requise" />
      <M4ToolRow d={250} id="copilot" where="Notes, dictée, photos" what="Compte rendu ou rapport de visite à partir de ce que vous collez ou joignez" note="Copilot Chat : inclus avec le compte Lessard" />
      <M4ToolRow d={350} id="word" where="Dictée dans Word" what="Dicter ses notes au chantier, puis les mettre en forme" note="Dictée : tous ; Copilot dans Word : licence" />
      <M4ToolRow d={450} id="procore" where="Journaux de chantier" what="Agents qui suivent les journaux quotidiens et les observations" note="Déploiement progressif : à vérifier" />
      <M4ToolRow d={550} id="otter" where="Toute réunion" what="Un assistant rejoint l’appel, transcrit et résume" note="Service externe : à faire approuver" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, fontSize: 22, color: C.muted, ...dl(800) }}>
      Les offres évoluent vite : vérifiez langue française, licence et lieu d’hébergement des données avant d’adopter un outil.
    </div>
  </Frame>
);

// ─── M4 · Recording rules ───────────────────────────────────────────────────
const M4Rule = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={58} solid />
    <div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Consent: Page = () => (
  <Frame mod={4}>
    <Title>Transcrire une réunion : cinq règles</Title>
    <Lede>Une transcription contient des renseignements personnels et des propos spontanés.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1040, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M4Rule d={100} icon="megaphone" tone="blue" title="Annoncer et obtenir l’accord">
        Au début, à l’oral et dans l’invitation, y compris pour l’EG et l’architecte.
      </M4Rule>
      <M4Rule d={220} icon="lock" tone="coral" title="Pas pour les sujets sensibles">
        Négociations de prix, réclamations, litiges, ressources humaines.
      </M4Rule>
      <M4Rule d={340} icon="shieldCheck" tone="green" title="Un outil approuvé">
        Celui que Lessard a validé, pas un service découvert la veille.
      </M4Rule>
      <M4Rule d={460} icon="archive" tone="violet" title="Une durée de conservation">
        On garde le compte rendu, pas forcément l’enregistrement.
      </M4Rule>
      <M4Rule d={580} icon="eye" tone="yellow" title="Relire avant de diffuser">
        Celui qui envoie le compte rendu en est responsable.
      </M4Rule>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1220, top: 300, width: 580, ...dl(700) }}>
      <Quote by="Une phrase d’ouverture qui suffit">« Je propose d’activer la transcription pour le compte rendu. Quelqu’un s’y oppose ? »</Quote>
    </div>
  </Frame>
);

// ─── M4 · From actions to tasks ─────────────────────────────────────────────
const M4Act = ({ who, what, when }: { who: string; what: string; when: string }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: `1.5px solid ${C.rule}`, fontSize: 24, color: C.ink }}>
    <b style={{ width: 110, flex: 'none' }}>{who}</b>
    <span style={{ flex: 1 }}>{what}</span>
    <Tag tone="grey" size={20}>
      {when}
    </Tag>
  </div>
);

const M4Card = ({ n, who, what, when, tone }: { n: number; who: string; what: string; when: string; tone: Tone }) => (
  <div className={b.pop(n)} style={{ ...vars({ o: 'left center' }) }}>
    <div style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '16px 20px' }}>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{what}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <Tag tone={tone} size={20}>
          {who}
        </Tag>
        <Tag tone="grey" size={20}>
          <Icon name="calendar" size={18} /> {when}
        </Tag>
        <Tag tone="violet" size={20}>
          <Icon name="link" size={18} /> CR 2 mars
        </Tag>
      </div>
    </div>
  </div>
);

const M4_ToTasks: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Du compte rendu aux tâches, sans ressaisie</Title>
    <Lede>Une action qui reste dans un compte rendu est souvent une action oubliée.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 620, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(100) }}>
      <Eyebrow c={T.blue.fg} size={21}>
        Actions du compte rendu
      </Eyebrow>
      <M4Act who="Patrice" what="Relevés de la façade nord" when="9 mars" />
      <M4Act who="Nadia" what="Relancer le verrier" when="3 mars" />
      <M4Act who="Mathieu" what="Confirmer la séquence à Boréa" when="4 mars" />
    </div>
    <svg width={120} height={60} style={{ position: 'absolute', left: 770, top: 400, overflow: 'visible' }}>
      <path d="M0 30 H100" stroke={C.blue} strokeWidth={5} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M92 16 L110 30 L92 44" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" className={b.fade(1)} />
    </svg>
    <AppWin id="planner" title="Méandres · cette semaine" cls={A.right} style={{ position: 'absolute', left: 920, top: 280, width: 880, ...dl(200) }} pad={24}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Card n={1} who="Patrice" what="Relevés de la façade nord" when="9 mars" tone="violet" />
        <M4Card n={2} who="Nadia" what="Relancer le verrier pour les 6 unités" when="3 mars" tone="green" />
        <M4Card n={3} who="Mathieu" what="Confirmer la séquence de pose à Boréa" when="4 mars" tone="blue" />
      </div>
    </AppWin>
    <Callout cls={A.in} title="Comment ?" tone="blue" icon="plug" size={25} style={{ position: 'absolute', left: 120, top: 640, width: 620, ...dl(500) }}>
      Selon l’outil : tâches proposées par le récapitulatif, demande « crée ces tâches », ou automatisation.
    </Callout>
  </Frame>
);

// ─── M4 · "If… then" rules ──────────────────────────────────────────────────
const M4Chip = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ flex: 1, background: T[tone].bg, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 18px' }}>
    <Eyebrow c={T[tone].fg} size={19}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 4, fontSize: 25, lineHeight: 1.3, color: C.ink }}>{children}</div>
  </div>
);

const M4RuleRow = ({ n, a, c, x, ai }: { n: number; a: ReactNode; c: ReactNode; x: ReactNode; ai?: boolean }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <M4Chip tone="blue" label="Quand">
      {a}
    </M4Chip>
    <FlowArrow w={46} />
    <M4Chip tone="yellow" label="Si">
      {c}
    </M4Chip>
    <FlowArrow w={46} />
    <M4Chip tone={ai ? 'violet' : 'green'} label={ai ? 'Alors (avec l’IA)' : 'Alors'}>
      {x}
    </M4Chip>
  </div>
);

const M4_Rules: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Le suivi automatique : des règles « si… alors »</Title>
    <Lede>Les deux premières sont de l’automatisation, sans IA. Et c’est déjà beaucoup de temps gagné.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M4RuleRow n={1} a="Un courriel arrive" c="il vient de Boréa ou parle des Méandres" x="Classé dans le dossier du projet" />
      <M4RuleRow n={2} a="Chaque matin, 8 h" c="un courriel envoyé il y a 5 jours, sans réponse" x="Rappel à Mathieu : relancer ?" />
      <M4RuleRow n={3} a="Un courriel arrive" c="c’est une demande administrative (certificat, formulaire)" x="L’IA prépare le transfert à Nadia, avec la consigne" ai />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', alignItems: 'center', gap: 26, ...dl(400) }}>
      <span style={{ fontSize: 24, fontWeight: 600, color: C.soft }}>Où les créer :</span>
      <AppChip id="outlook" size={24} />
      <AppChip id="automate" size={24} />
      <AppChip id="planner" size={24} />
      <AppChip id="smartsheet" size={24} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 840, fontSize: 22, color: C.muted, ...dl(500) }}>
      Règles Outlook : pour tous. Power Automate : selon votre compte. Smartsheet : menu « Automatisations ». Jamais d’envoi automatique à un client.
    </div>
  </Frame>
);

// ─── M4 · Smart alerts ──────────────────────────────────────────────────────
const M4Signal = ({ n, icon, children }: { n: number; icon: IconName; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 25, lineHeight: 1.3, color: C.ink }}>
    <IconTile name={icon} tone="violet" size={48} />
    <span>{children}</span>
  </div>
);

const M4_Alerts: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>L’alerte intelligente : voir venir le retard</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 230, width: 620, height: 680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.faint}`, padding: '30px 32px' }}>
      <Eyebrow c={C.soft}>Alerte par règle</Eyebrow>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>Le constat</div>
      <div style={{ marginTop: 26, background: T.coral.bg, borderRadius: 12, padding: '18px 20px', fontSize: 26, lineHeight: 1.4, color: C.ink }}>
        <Icon name="bell" size={30} color={C.coral} style={{ display: 'inline-block', verticalAlign: '-6px', marginRight: 10 }} />
        « Approbation des dessins MR-01 » est en retard de 4 jours.
      </div>
      <div style={{ marginTop: 26, fontSize: 25, lineHeight: 1.45, color: C.soft }}>Utile… mais le retard est déjà là.</div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 800, top: 230, width: 1000, height: 680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.violet}`, padding: '30px 34px', ...dl(150) }}>
      <Eyebrow c={T.violet.fg}>Alerte intelligente</Eyebrow>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>L’anticipation, en croisant des signaux faibles</div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Signal n={1} icon="clock">
          Aucune réponse de l’architecte depuis 9 jours
        </M4Signal>
        <M4Signal n={2} icon="truck">
          Le verrier ne garantit son créneau que jusqu’au 11 décembre
        </M4Signal>
        <M4Signal n={3} icon="route">
          L’approbation est sur le chemin critique du 14 mai
        </M4Signal>
        <M4Signal n={4} icon="chat">
          Dernier courriel de l’architecte : « on manque de monde avant les Fêtes »
        </M4Signal>
      </div>
      <div className={b.on(5)} style={{ marginTop: 24, background: T.violet.bg, borderRadius: 12, padding: '16px 20px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        <b>Risque : commande du verre après les Fêtes.</b> Suggestion : appeler l’architecte aujourd’hui.
      </div>
    </div>
  </Frame>
);

// ─── M4 · Simulator: the project dashboard week by week ─────────────────────
const M4_DELTA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 5, 6, 8, 8, 7];

const M4Alert = ({ show, tone, icon, children }: { show: boolean; tone: Tone; icon: IconName; children: ReactNode }) =>
  show ? (
    <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 14, background: T[tone].bg, borderRadius: 12, boxShadow: `inset 5px 0 0 ${STRONG[tone]}`, padding: '11px 16px', fontSize: 22, lineHeight: 1.35, color: C.ink, animationDuration: '450ms' }}>
      <Icon name={icon} size={26} color={T[tone].fg} />
      <span>{children}</span>
    </div>
  ) : null;

const M4Kpi = ({ label, value, tone }: { label: string; value: string; tone: Tone }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <div style={{ fontSize: 20, color: C.muted }}>{label}</div>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
  </div>
);

const M4_Sim: Page = () => {
  const [wk, setWk] = useState(10);
  const plan = Math.round((wk / 28) * 100);
  const delta = M4_DELTA[wk] ?? 0;
  const real = plan - delta;
  const meteo: Tone = delta < 3 ? 'green' : delta < 6 ? 'yellow' : 'coral';
  return (
    <Frame mod={4} kind="exercice">
      <Title>Simulateur : le tableau de bord de Mathieu, semaine après semaine</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', alignItems: 'center', gap: 28, ...dl(100) }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink, width: 260 }}>Semaine {wk}</span>
        <Range value={wk} onChange={setWk} min={8} max={16} w={900} />
        <Hint>Glissez (ou flèches du clavier)</Hint>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 290, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <M4Kpi label="Avancement prévu" value={`${plan} %`} tone="grey" />
          <M4Kpi label="Avancement réel" value={`${real} %`} tone={meteo} />
        </div>
        <div style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
          <div style={{ fontSize: 20, color: C.muted }}>Météo proposée par l’IA</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ width: 46, height: 46, borderRadius: 99, background: meteo === 'green' ? C.green : '#DCE3E8' }} />
            <span style={{ width: 46, height: 46, borderRadius: 99, background: meteo === 'yellow' ? C.yellow : '#DCE3E8' }} />
            <span style={{ width: 46, height: 46, borderRadius: 99, background: meteo === 'coral' ? C.coral : '#DCE3E8' }} />
            <span style={{ marginLeft: 8, fontFamily: display, fontWeight: 700, fontSize: 38, color: STRONG[meteo] === C.yellow ? C.amber : STRONG[meteo] }}>
              {meteo === 'green' ? 'VERT' : meteo === 'yellow' ? 'JAUNE' : 'ROUGE'}
            </span>
          </div>
        </div>
        <div style={{ background: C.panel, borderRadius: 14, padding: '16px 20px', fontSize: 23, lineHeight: 1.4, color: C.soft }}>
          L’IA propose, Mathieu décide. La météo envoyée à Hélène reste <b>son</b> jugement.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 730, top: 290, width: 1070, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Icon name="bell" size={30} color={C.violet} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>Alertes et suggestions</span>
          {wk < 10 ? <span style={{ fontSize: 22, color: C.muted }}>· rien à signaler pour l’instant</span> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M4Alert show={wk >= 10} tone="yellow" icon="clock">
            Dessins des entrées : aucune nouvelle de l’architecte depuis 9 jours.
          </M4Alert>
          <M4Alert show={wk >= 11} tone="yellow" icon="users">
            Équipe de Patrice : 3 chantiers la même semaine de mars, charge à 140 %.
          </M4Alert>
          <M4Alert show={wk >= 12} tone="coral" icon="alert">
            Quincaillerie des portes non commandée : bloque la fabrication des entrées.
          </M4Alert>
          <M4Alert show={wk >= 13} tone="yellow" icon="chat">
            Verrier : « petite difficulté d’approvisionnement » (ton inquiet).
          </M4Alert>
          <M4Alert show={wk >= 14} tone="coral" icon="route">
            Jalon « Verre livré » : glissement probable de 5 jours.
          </M4Alert>
          <M4Alert show={wk >= 15} tone="blue" icon="bulb">
            Suggestion : commencer la pose par la façade nord, déjà livrée.
          </M4Alert>
        </div>
      </div>
    </Frame>
  );
};

// ─── M4 · Friday report in 3 minutes ────────────────────────────────────────
const M4Flow = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <IconTile name={icon} tone={tone} size={64} solid />
    <div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 23, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Report: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Le rapport du vendredi en trois minutes</Title>
    <Lede>L’automatisation rassemble, l’IA rédige, Mathieu juge. Chacun son rôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <M4Flow n={1} icon="kanban" tone="grey" title="1. L’outil rassemble">
        Tâches terminées, en retard, à venir
      </M4Flow>
      <M4Flow n={2} icon="sparkles" tone="violet" title="2. L’IA rédige">
        Avancement, points d’attention, décisions
      </M4Flow>
      <M4Flow n={3} icon="humanCheck" tone="blue" title="3. Mathieu relit et juge">
        Corrige, ajuste la météo, ajoute le contexte
      </M4Flow>
      <M4Flow n={4} icon="send" tone="green" title="4. Hélène reçoit">
        Le même format pour les 13 projets : elle sait où regarder
      </M4Flow>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 900, top: 270, width: 900, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.yellow}`, padding: '26px 34px', ...dl(200) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Méandres · semaine 14</span>
        <Tag tone="yellow" size={22}>
          MÉTÉO JAUNE
        </Tag>
      </div>
      <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.5, color: C.ink }}>
        <b>Avancement</b> : 46 % (prévu : 50 %).
        <br />
        <b>Fait</b> : dessins approuvés, verre commandé, cadres en fabrication.
        <br />
        <b>Points d’attention</b> : quincaillerie des portes non commandée, structure de Boréa en retard de 4 jours.
        <br />
        <b>Décision attendue d’Hélène</b> : heures supplémentaires à l’usine (6 000 $).
        <br />
        <b>Semaine prochaine</b> : livraison du verre, planification des relevés.
      </div>
      <div className={b.on(3)} style={{ marginTop: 16, background: T.blue.bg, borderRadius: 10, padding: '10px 16px', fontSize: 22, color: T.blue.fg }}>
        <Icon name="humanCheck" size={22} style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
        Relu par Mathieu : météo passée de vert à jaune, retard de la structure ajouté.
      </div>
    </div>
  </Frame>
);

// ─── M4 · Team practices ────────────────────────────────────────────────────
const M4Prac = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={25} cls={A.in} style={{ width: 540, height: 300, ...dl(d) }}>
    {children}
  </Card>
);

const M4_Team: Page = () => (
  <Frame mod={4}>
    <Title>Chargés de projet et adjointes : les pratiques d’équipe</Title>
    <Lede>L’IA individuelle fait gagner des minutes. L’IA d’équipe fait gagner des heures.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M4Prac d={100} icon="database" tone="blue" title="Un dossier par projet">
        Courriels, comptes rendus et décisions au même endroit : l’IA y trouve le contexte.
      </M4Prac>
      <M4Prac d={200} icon="send" tone="teal" title="Des règles de transfert">
        Ce que l’adjointe reçoit, avec quelle consigne : écrit une fois, appliqué par tous.
      </M4Prac>
      <M4Prac d={300} icon="note" tone="green" title="Une mention claire">
        « Brouillon IA, relu par Mathieu » : chacun sait ce qui a été vérifié.
      </M4Prac>
      <M4Prac d={400} icon="book" tone="yellow" title="Une bibliothèque">
        Les demandes qui marchent, partagées et améliorées par les sept membres de l’équipe.
      </M4Prac>
      <M4Prac d={500} icon="star" tone="violet" title="Partager les bons coups">
        Cinq minutes en réunion d’équipe : « mon meilleur usage de la semaine ».
      </M4Prac>
      <M4Prac d={600} icon="shieldCheck" tone="coral" title="Des règles communes">
        Outils permis, données interdites : décidé ensemble, écrit quelque part.
      </M4Prac>
    </div>
  </Frame>
);

// ─── M4 · Prompt library ────────────────────────────────────────────────────
const M4Lib = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 310, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '22px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={48} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Library: Page = () => (
  <Frame mod={4}>
    <Title>La bibliothèque de demandes de l’équipe</Title>
    <Lede>Six modèles à copier. Les zones entre crochets se remplacent à chaque usage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M4Lib d={100} icon="inbox" tone="teal" title="Tri des courriels">
        Voici [les courriels]. Classe-les : à traiter aujourd’hui, à transférer à [l’adjointe] avec la consigne, à relancer, à classer.
      </M4Lib>
      <M4Lib d={200} icon="note" tone="violet" title="Compte rendu">
        À partir de [la transcription], liste décisions, actions (qui, quoi, quand) et points ouverts. N’invente rien : [à confirmer].
      </M4Lib>
      <M4Lib d={300} icon="camera" tone="blue" title="Rapport de visite">
        À partir de [mes notes dictées et photos], rédige le rapport : avancement, déficiences (lieu, description, responsable), actions.
      </M4Lib>
      <M4Lib d={400} icon="bell" tone="yellow" title="Relance">
        Rédige une relance à [destinataire] sur [l’objet, envoyé le…]. Rappelle l’impact sur [la date]. Ton : [courtois / ferme]. 6 lignes.
      </M4Lib>
      <M4Lib d={500} icon="doc" tone="green" title="Fiche de démarrage">
        À partir de [la soumission et des exclusions], rédige la fiche : périmètre, dates, intervenants, engagements. Signale ce qui manque.
      </M4Lib>
      <M4Lib d={600} icon="chart" tone="coral" title="Rapport du vendredi">
        À partir de [mes notes], rédige le rapport pour [Hélène] : météo, avancement, 3 points d’attention, décision attendue. 150 mots.
      </M4Lib>
    </div>
  </Frame>
);

// ─── M4 · QCMs & synthesis ──────────────────────────────────────────────────
const M4_Qcm1: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="Avant de diffuser"
    q="Teams vient de produire le compte rendu de la réunion de chantier. Que fait Mathieu avant de l’envoyer à Boréa ?"
    explain="Le compte rendu engage celui qui l’envoie. Les erreurs typiques : fausse décision, mauvaise personne, date inventée, point ouvert disparu. Deux minutes de relecture suffisent."
  >
    <Opt ok why="Oui : décisions, responsables, dates et points ouverts. Le reste peut rester imparfait.">
      Il vérifie décisions, responsables, dates et points ouverts
    </Opt>
    <Opt why="Piège ! C’est justement là que se glissent les fausses décisions et les mauvaises attributions.">Il l’envoie tel quel : c’est la transcription exacte</Opt>
    <Opt why="Piège ! On perd tout le temps gagné. On vérifie les éléments à risque, pas chaque virgule.">Il réécoute toute la réunion pour tout vérifier</Opt>
    <Opt why="Piège ! Une IA ne vérifie pas mieux l’autre : seule la personne présente sait ce qui a été dit.">Il demande à une autre IA de le corriger</Opt>
  </QcmPage>
);

const M4_Qcm2: Page = () => (
  <QcmPage
    mod={4}
    n={5}
    title="Règle ou intelligence ?"
    q="Laquelle de ces alertes demande vraiment de l’intelligence artificielle ?"
    explain="Les trois autres sont des règles fixes, très utiles, qui constatent. L’IA croise des signaux faibles (silence, charge, ton des commentaires) pour anticiper."
  >
    <Opt why="Piège ! Une règle suffit : date dépassée → notification.">« La tâche X a dépassé son échéance »</Opt>
    <Opt why="Piège ! Une règle suffit : statut = Bloquée → message.">« La tâche Y vient de passer en statut Bloquée »</Opt>
    <Opt ok why="Oui : aucune règle simple ne le dit. L’IA combine l’absence de mise à jour, la charge et le ton des échanges.">
      « La tâche Z risque de glisser : silence, surcharge, ton inquiet »
    </Opt>
    <Opt why="Piège ! Une règle horaire suffit : chaque vendredi, 14 h.">« Rappel : le rapport hebdomadaire est dû aujourd’hui »</Opt>
  </QcmPage>
);

const M4_Synth: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={
      <>
        À votre prochaine visite de chantier : dictez vos notes, puis testez la demande de rapport de visite.
        <br />
        <br />
        Créez une première règle Outlook qui classe les courriels d’un projet.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Compte rendu et visite : <b>décisions, actions, déficiences</b>, rien d’inventé.
    </SynthRow>
    <SynthRow n={2} tone="coral" d={220}>
      Transcrire : <b>annoncer</b>, outil approuvé, pas de sujets sensibles.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Les actions deviennent des <b>tâches</b> avec responsable et date.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Règles « si… alors » pour constater, <b>IA pour anticiper</b>.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      En équipe : un dossier par projet, des <b>règles de transfert</b>, une bibliothèque.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M4_Divider,
  M4_Meeting,
  M4_Transcript,
  M4_CrPrompt,
  M4_CrErrors,
  M4_Visit,
  M4_Tools,
  M4_Consent,
  M4_ToTasks,
  M4_Rules,
  M4_Alerts,
  M4_Sim,
  M4_Report,
  M4_Team,
  M4_Library,
  M4_Qcm1,
  M4_Qcm2,
  M4_Synth,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 4 (≈ 9 h 15)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 4 : automatiser et collaborer. On s'attaque à ce qui se répète chaque semaine dans vos projets, et que Valérie a cité au cadrage : les comptes rendus de réunion, la synthèse des visites de chantier, le tri des courriels, les relances, et le transfert aux adjointes. »

« Quatre temps : comptes rendus et rapports de visite ; transformer les actions en tâches sans ressaisie ; le tri, les relances et les alertes ; et les pratiques d'équipe entre chargés de projet et adjointes. »

RYTHME — Environ 1 h 15, de 9 h 15 à 10 h 30. Gardez un bon rythme : la visite de chantier et l'exercice des erreurs sont les deux moments à ne pas couper.

TRANSITION — « Commençons par la réunion. »`,
  `⏱ 3 min · AVANT, PENDANT, APRÈS (3 clics)

OBJECTIF — Montrer que l'IA aide à chaque moment d'une réunion ou d'une visite.

DIRE — « 9 heures de réunions et de visites par semaine pour Mathieu. Trois moments où l'IA aide. »
→ beat 1 : « Avant : l'ordre du jour à partir des points ouverts, le résumé du fil de courriels avec l'EG, les questions à poser à l'architecte. »
→ beat 2 : « Pendant : transcrire dans Teams, avec l'accord de tous. Et au chantier, où il n'y a pas de Teams : dicter ses notes au téléphone, prendre les photos des déficiences. »
→ beat 3 : « Après : le compte rendu ou le rapport de visite, les tâches dans l'outil, le courriel de suivi à l'EG et à l'adjointe. C'est là que le gain est le plus grand. »

QUESTION — « Combien de temps vous prend un compte rendu de chantier ? Et combien de temps après la réunion le diffusez-vous ? »

TRANSITION — « Voyons comment l'IA passe d'une transcription à un compte rendu. »`,
  `⏱ 4 min · DÉMO : TRANSCRIPTION → COMPTE RENDU (3 clics)

OBJECTIF — Visualiser l'extraction : décisions, actions, points ouverts.

DIRE — « À gauche, un extrait de la transcription de la réunion de chantier du 2 mars, sur Teams. Des phrases spontanées, dans le désordre. »
→ beat 1 : « L'IA repère la décision, en vert : on commence la pose le 22 par la façade nord. »
→ beat 2 : « Les actions, en bleu : Patrice refait les relevés d'ici le 9 ; Nadia relance le verrier demain, donc le 3 mars. »
→ beat 3 : « Les points ouverts, en jaune : la couleur des panneaux d'allège. Décision jeudi, avec la Ville. »

INSISTER — « Remarquez : "on en reparle jeudi" n'est pas une décision. Une bonne extraction distingue ce qui est décidé de ce qui est discuté. Dans une réclamation, cette nuance vaut cher. »

TRANSITION — « Voici la demande qui produit ce résultat. »`,
  `⏱ 3 min · MODÈLE DE DEMANDE DE COMPTE RENDU

OBJECTIF — Donner un modèle réutilisable et expliquer ses garde-fous.

DIRE — « Les zones jaunes changent à chaque réunion : le projet, la date. Le reste se réutilise tel quel. »

Pointer les quatre conseils :
• « Seulement les décisions clairement prises » : évite les fausses décisions.
• « [à confirmer] » : l'IA montre les trous au lieu de les combler.
• La liste des participants : moins d'erreurs de noms, surtout avec une transcription automatique et des gens de plusieurs entreprises.
• Relire avant de diffuser : « C'est vous qui signez. »

ASTUCE — Pour une réunion en anglais ou bilingue : ajoutez « Rédige le compte rendu en français ».

LOGISTIQUE — Collez ce modèle dans le Chat ; il fait partie de la bibliothèque remise en fin de journée.

TRANSITION — « Et si la demande est trop vague ? Exercice. »`,
  `⏱ 5 min · EXERCICE : QUATRE ERREURS (4 clics)

OBJECTIF — Entraîner l'œil à repérer les erreurs typiques d'un compte rendu généré.

ANIMATION — Laissez 2 minutes : chacun compare, pour soi, avec la transcription de la page précédente (revenez-y si besoin). Faites annoncer les erreurs au micro, puis un clic par erreur.
→ beat 1 : Fausse décision : la couleur des panneaux n'a pas été retenue, on en a seulement discuté.
→ beat 2 : Mauvaise personne : c'est Patrice qui refait les relevés.
→ beat 3 : Date inventée : Nadia a dit « demain », donc le 3 mars, pas le 15.
→ beat 4 : Point ouvert effacé : la couleur des panneaux reste à trancher.

MESSAGE CLÉ — « Ce sont exactement les quatre erreurs à vérifier : décisions, responsables, dates, points ouverts. Deux minutes de relecture. »

TRANSITION — « Et quand la réunion se tient sur le chantier, sans Teams ? »`,
  `⏱ 5 min · DÉMO : LA VISITE DE CHANTIER (4 clics)

OBJECTIF — Répondre au besoin du cadrage : la synthèse des visites de chantier.

DIRE — « Mathieu fait le tour de la façade nord. Il dicte ses notes au téléphone en marchant, comme il parle, et prend trois photos. De retour au bureau, il donne le tout à Copilot : le texte de la dictée et les photos. »
→ beat 1 : « L'avancement, en une ligne. »
→ beat 2 : « Les déficiences, numérotées, avec le lieu et le responsable. C'est la liste que Boréa attend. »
→ beat 3 : « Ce que Nadia doit faire : commander la vitre, envoyer la liste à Boréa avant vendredi. C'est le transfert à l'adjointe, déjà rédigé. »
→ beat 4 : « Le réflexe : l'IA ne sait que ce que vous dictez. Elle peut décrire une photo, mais elle ne sait pas si l'égratignure est dans la tolérance. Vérifiez chaque ligne. »

COMMENT FAIRE — Dicter : l'enregistreur vocal du téléphone, la dictée de Word, ou le micro de l'application Copilot. Puis coller la transcription et joindre les photos dans Copilot Chat, avec le compte Lessard.

ATTENTION — Pas de visages ni de plaques d'immatriculation sur les photos que vous donnez à l'IA. Les photos d'un bâtiment client sont des données du client.

TRANSITION — « Quels outils font ces résumés ? »`,
  `⏱ 4 min · OUTILS DE RÉSUMÉ DE RÉUNION

OBJECTIF — Panorama des outils, avec le critère qui compte : où vont les données.

DIRE — Parcourez les cinq lignes :
• Copilot dans Teams : récapitulatif, tâches de suivi, questions sur la réunion. Licence Microsoft 365 Copilot et transcription nécessaires.
• Copilot Chat : à partir de vos notes, d'une dictée ou de photos. Inclus avec votre compte : c'est la solution pour tout le monde, et pour le chantier.
• La dictée de Word : pour dicter ses notes, puis les mettre en forme.
• Procore : ses agents suivent les journaux de chantier et les observations ; déploiement progressif, à vérifier chez vous.
• Otter.ai : un assistant qui rejoint l'appel. « Attention : service externe. Vos réunions partent chez un tiers. À faire approuver. »

INSISTER — « La qualité est comparable. La vraie question : est-ce que Lessard autorise cet outil pour ce type de réunion ? »

À VÉRIFIER — Ces offres évoluent vite ; vérifiez avant chaque session (français, licence, hébergement des données).

TRANSITION — « Justement : les règles pour transcrire une réunion. »`,
  `⏱ 3 min · CINQ RÈGLES POUR TRANSCRIRE

OBJECTIF — Installer de bons réflexes éthiques et légaux.

DIRE — « Une transcription contient des renseignements personnels et des propos spontanés. Cinq règles. »
1. Annoncer et obtenir l'accord, à l'oral et dans l'invitation. Y compris pour les gens de l'EG et de l'architecte : ce ne sont pas vos employés.
2. Pas pour les sujets sensibles : négociations de prix, réclamations, litiges, RH.
3. Un outil approuvé par Lessard.
4. Une durée de conservation : on garde le compte rendu, pas forcément l'enregistrement.
5. Relire avant de diffuser : celui qui envoie en est responsable.

Lire la citation : « Je propose d'activer la transcription pour le compte rendu. Quelqu'un s'y oppose ? » « Ça prend cinq secondes et ça règle la question du consentement. »

LIEN — Au Québec, la Loi 25 encadre les renseignements personnels ; on en reparle au module 5.

TRANSITION — « Le compte rendu est prêt. Que deviennent les actions ? »`,
  `⏱ 3 min · DES ACTIONS AUX TÂCHES (3 clics)

OBJECTIF — Montrer la continuité compte rendu → outil de tâches.

DIRE — « Une action qui reste dans un compte rendu est souvent une action oubliée. »
→ beat 1 : « L'action de Patrice devient une tâche dans Planner, avec responsable, date, et un lien vers le compte rendu. »
→ beat 2 : « Celle de Nadia. »
→ beat 3 : « Celle de Mathieu. »

COMMENT — « Selon l'outil : le récapitulatif de Teams propose directement les tâches, on demande à Copilot "crée ces tâches", ou on copie le tableau dans Smartsheet. »

INSISTER — Le lien vers le compte rendu donne le contexte à celui qui ouvre la tâche dans deux semaines.

TRANSITION — « Les tâches et les courriels peuvent maintenant se suivre presque tout seuls. »`,
  `⏱ 4 min · RÈGLES « SI… ALORS » (3 clics)

OBJECTIF — Montrer l'automatisation simple du tri et des relances, avant même l'IA.

DIRE — « Une règle a trois parties : quand, si, alors. »
→ beat 1 : « Quand un courriel arrive, s'il vient de Boréa ou parle des Méandres, alors il est classé dans le dossier du projet. C'est une simple règle Outlook, sans IA, sans licence. Faites-en une par gros projet. »
→ beat 2 : « Chaque matin à 8 h, si un courriel envoyé il y a 5 jours n'a pas de réponse, alors rappel à Mathieu : relancer ? Avec Power Automate, ou simplement un indicateur de suivi Outlook. »
→ beat 3 : « Quand un courriel arrive, si c'est une demande administrative, alors l'IA prépare le transfert à Nadia, avec la consigne. Ici on combine règle et IA, et c'est Mathieu qui clique "envoyer". »

LA RÈGLE D'OR — « Automatique ne veut pas dire sans vous. Jamais d'envoi automatique à un client ou à un fournisseur : l'IA prépare, vous envoyez. »

DÉMO OPTIONNELLE — Créez une règle Outlook en direct : clic droit sur un courriel, Règles, Créer une règle, Déplacer vers le dossier.

TRANSITION — « Les règles constatent. L'IA, elle, peut anticiper. »`,
  `⏱ 4 min · ALERTE INTELLIGENTE (5 clics)

OBJECTIF — Distinguer constat (règle) et anticipation (IA).

DIRE — « À gauche, l'alerte par règle : l'approbation des dessins est en retard de 4 jours. Utile, mais le retard est déjà là. »
« À droite, l'alerte intelligente : l'IA croise des signaux faibles. »
→ beat 1 : « Aucune réponse de l'architecte depuis 9 jours. »
→ beat 2 : « Le verrier ne garantit son créneau de production que jusqu'au 11 décembre. »
→ beat 3 : « L'approbation est sur le chemin critique du 14 mai. »
→ beat 4 : « Et le dernier courriel de l'architecte : "on manque de monde avant les Fêtes". Une règle ne lit pas le ton ; l'IA, si. »
→ beat 5 : « Conclusion : risque que la commande du verre passe après les Fêtes. Suggestion : appeler l'architecte aujourd'hui. Avant que le retard n'arrive. »

NUANCE — Ces alertes existent à des degrés divers selon les outils ; elles supposent des données tenues à jour. Aujourd'hui, le plus simple : demander chaque lundi à Copilot « Qu'est-ce qui risque de glisser cette semaine ? » en lui donnant vos fils de courriels.

TRANSITION — « Voyons-le évoluer semaine après semaine. »`,
  `⏱ 5 min · SIMULATEUR (curseur)

OBJECTIF — Faire vivre le suivi d'un projet qui dérive, et le rôle de l'humain.

ANIMATION — Commencez en semaine 10 (vous pouvez reculer à 8). Faites glisser le curseur semaine par semaine jusqu'à 16 (ou cliquez le curseur puis utilisez les flèches du clavier). Commentez chaque nouvelle alerte.

DIRE —
• Semaines 9 et 10 : « Tout va bien… puis un premier silence de l'architecte. »
• Semaine 11 : « L'équipe de Patrice est surchargée en mars. »
• Semaine 12 : « La quincaillerie des portes n'est pas commandée : rouge. »
• Semaine 13 : « Le ton du verrier change. »
• Semaine 14 : « Le jalon "Verre livré" va glisser. Météo rouge. »
• Semaine 15 : « Une suggestion : commencer par la façade nord. »

QUESTION — « À quelle semaine Mathieu aurait-il dû réagir ? » Réponse attendue : dès la 10 ou la 11, pas à la 14.

INSISTER — Encadré : la météo envoyée à Hélène reste le jugement de Mathieu.

TRANSITION — « Justement, le rapport à Hélène. »`,
  `⏱ 3 min · LE RAPPORT DU VENDREDI (4 clics)

OBJECTIF — Montrer la chaîne complète et la répartition des rôles.

DIRE —
→ beat 1 : « L'outil rassemble : tâches terminées, en retard, à venir. »
→ beat 2 : « L'IA rédige : avancement, points d'attention, décision attendue. »
→ beat 3 : « Mathieu relit et juge. Ici, il a fait passer la météo de vert à jaune, et ajouté le retard de la structure. Voyez l'encadré bleu. »
→ beat 4 : « Hélène reçoit le même format pour les 13 projets de Mathieu, et pour ceux de ses collègues : elle sait où regarder. »

INSISTER — « Un rapport trop optimiste, c'est la confiance de votre direction qui s'en va. L'IA a tendance à arrondir les angles : c'est à vous de nommer les problèmes. »

TRANSITION — « Passons de l'individu à l'équipe. »`,
  `⏱ 4 min · PRATIQUES D'ÉQUIPE

OBJECTIF — Donner six pratiques concrètes entre chargés de projet et adjointes.

DIRE — « L'IA individuelle fait gagner des minutes. L'IA d'équipe fait gagner des heures. »
1. Un dossier par projet : courriels, comptes rendus, décisions au même endroit. L'IA y trouve le contexte.
2. Des règles de transfert : ce que l'adjointe reçoit, avec quelle consigne. « Certificat d'assurance : Nadia l'envoie. Bordereau : Nadia le classe. Demande de prix : Mathieu répond. » Écrites une fois, appliquées par tous.
3. Une mention claire : « Brouillon IA, relu par… ».
4. Une bibliothèque de demandes, partagée et améliorée par les sept membres de l'équipe.
5. Partager les bons coups : cinq minutes en réunion d'équipe.
6. Des règles communes : outils permis, données interdites, écrites quelque part.

QUESTION — Faites répondre une adjointe et un chargé de projet : « Laquelle de ces pratiques pourriez-vous lancer dès la semaine prochaine ? »

TRANSITION — « Voici la bibliothèque de l'équipe. »`,
  `⏱ 3 min · BIBLIOTHÈQUE DE DEMANDES

OBJECTIF — Remettre six modèles prêts à l'emploi (ils serviront dans l'atelier 2).

DIRE — « Six modèles, tirés de vos besoins : tri des courriels, compte rendu, rapport de visite, relance, fiche de démarrage, rapport du vendredi. Les crochets se remplacent à chaque usage. »

« Remarquez que chacun contient les cinq ingrédients d'hier, et un garde-fou : "n'invente rien", "signale ce qui manque", "150 mots". »

ASTUCE — Stockez-les dans un OneNote d'équipe ou une publication épinglée dans le canal Teams de l'équipe. Dans Copilot, on peut aussi enregistrer des demandes ; dans Claude, un « projet » garde les instructions.

LOGISTIQUE — Partagez ces modèles aux participants (document ou Chat) pour l'atelier 2.

TRANSITION — « Deux QCM pour vérifier. »`,
  `⏱ 3 min · QCM 4

RÉPONSE — A : il vérifie décisions, responsables, dates et points ouverts.
• B ✗ PIÈGE — « Ce n'est pas une transcription, c'est une interprétation de la transcription. Et il part chez l'EG. »
• C ✗ PIÈGE — On perdrait tout le temps gagné.
• D ✗ PIÈGE — Une autre IA ne sait pas ce qui a été dit ; seule une personne présente le sait.

TRANSITION — « Deuxième question : règle ou intelligence ? »`,
  `⏱ 3 min · QCM 5

RÉPONSE — C : la tâche Z risque de glisser.
• A, B, D ✗ — Ce sont des règles fixes : date dépassée, statut, horaire. Très utiles, mais pas de l'IA.
• C ✓ — Aucune règle simple ne peut combiner le silence, la surcharge et le ton des échanges.

LIEN — « C'est la distinction du module 1 : automatisation = règles, IA = jugement appris. Et la voûte : des règles suffisent. »

TRANSITION — « Faisons le bilan du module 4. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 4

DIRE — Relisez les cinq points :
1. Compte rendu et visite : décisions, actions, déficiences, rien d'inventé.
2. Transcrire : annoncer, outil approuvé, pas de sujets sensibles.
3. Les actions deviennent des tâches avec responsable et date.
4. Règles pour constater, IA pour anticiper. Jamais d'envoi automatique à un client.
5. En équipe : un dossier par projet, des règles de transfert, une bibliothèque.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « On a vu tout ce que l'IA peut faire. Parlons maintenant de ses limites, de la confidentialité de vos données, et de la façon d'embarquer une équipe. »`,
];
// @@NOTES-END
