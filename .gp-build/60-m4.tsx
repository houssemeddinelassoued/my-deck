// ─── M4 · Divider ───────────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Automatiser et collaborer avec l’IA" sub="Réunions, comptes rendus, suivi des tâches : ce qui se répète chaque semaine." dur="≈ 1 h 15">
    <SecItem n={1}>Comptes rendus et résumés de réunions</SecItem>
    <SecItem n={2}>Des actions aux tâches, sans ressaisie</SecItem>
    <SecItem n={3}>Suivi des tâches et alertes intelligentes</SecItem>
    <SecItem n={4}>Travailler en équipe avec l’IA</SecItem>
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
    <Lede>11 heures de réunions par semaine pour Karim. Voici où l’IA lui rend du temps.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M4Moment n={1} tone="blue" icon="calendar" when="Avant">
        <M4Do icon="list">Proposer l’ordre du jour à partir des tâches en retard</M4Do>
        <M4Do icon="doc">Résumer les documents à lire</M4Do>
        <M4Do icon="mail">Rédiger l’invitation et l’objectif</M4Do>
      </M4Moment>
      <M4Moment n={2} tone="violet" icon="mic" when="Pendant">
        <M4Do icon="mic">Transcrire, avec l’accord des participants</M4Do>
        <M4Do icon="search">« Qu’a-t-on décidé jusqu’ici ? »</M4Do>
        <M4Do icon="clock">Rattraper quelqu’un qui arrive en retard</M4Do>
      </M4Moment>
      <M4Moment n={3} tone="green" icon="check" when="Après">
        <M4Do icon="note">Compte rendu : décisions, actions, points ouverts</M4Do>
        <M4Do icon="kanban">Créer les tâches dans l’outil</M4Do>
        <M4Do icon="send">Courriel de suivi aux absents</M4Do>
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
    <Lede>Réunion de suivi du mardi 2 février, 6 personnes, 40 minutes. Extrait de la transcription :</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 270, width: 880, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 18px', ...dl(100) }}>
      <M4Say who="Karim">Les comptoirs arrivent le 19 au lieu du 5.</M4Say>
      <M4Say who="Luc">On peut faire la pose un samedi ?</M4Say>
      <M4Say who="Karim" kind="dec">
        Le fournisseur dit oui. On part là-dessus : pose le samedi 20.
      </M4Say>
      <M4Say who="Annie" kind="act">
        Moi, j’avance le câblage réseau pendant ce temps, d’ici le 12.
      </M4Say>
      <M4Say who="Maxime" kind="open">
        Et les portes ouvertes ? On garde le 3 avril ?
      </M4Say>
      <M4Say who="Luc" kind="open">
        On en reparle jeudi, je veux voir l’impact.
      </M4Say>
      <M4Say who="Julie" kind="act">
        Je relance les deux candidats mécaniciens demain.
      </M4Say>
      <M4Say who="Karim">Parfait, merci tout le monde.</M4Say>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1060, top: 270, width: 740, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.violet}`, padding: '22px 28px 26px', ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="note" size={32} color={C.violet} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>Compte rendu · 2 février</span>
      </div>
      <M4Sec n={1} tone="green" title="Décision">
        Pose des comptoirs le samedi 20 février.
      </M4Sec>
      <M4Sec n={2} tone="blue" title="Actions">
        <b>Annie</b> · avancer le câblage réseau · 12 févr.
        <br />
        <b>Julie</b> · relancer 2 candidats · 3 févr.
      </M4Sec>
      <M4Sec n={3} tone="yellow" title="Point ouvert">
        Date des portes ouvertes (3 avril ?) : Luc tranche jeudi.
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
      Tu es l’assistant du projet <M4Slot>Limoilou</M4Slot>. À partir de la transcription ci-dessous de la réunion du <M4Slot>2 février</M4Slot>, rédige le compte rendu en trois parties :
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
      <M4CrLine>• Pose des comptoirs le samedi 20 février.</M4CrLine>
      <M4CrLine>• Portes ouvertes reportées au 10 avril.</M4CrLine>
      <Eyebrow c={T.blue.fg} size={21} style={{ marginTop: 14 }}>
        Actions
      </Eyebrow>
      <M4CrLine>• Maxime : avancer le câblage réseau, d’ici le 12 février.</M4CrLine>
      <M4CrLine>• Julie : relancer les candidats d’ici le 15 février.</M4CrLine>
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
        On a seulement discuté des portes ouvertes. Luc tranche jeudi.
      </M3Exp>
      <M3Exp n={2} title="La mauvaise personne">
        C’est Annie qui avance le câblage, pas Maxime.
      </M3Exp>
      <M3Exp n={3} title="Une date inventée">
        Julie a dit « demain », soit le 3 février.
      </M3Exp>
      <M3Exp n={4} title="Un point ouvert effacé">
        La date des portes ouvertes reste à trancher.
      </M3Exp>
    </div>
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
      <M4ToolRow d={150} id="teams" where="Réunions Teams" what="Récapitulatif, tâches de suivi, questions sur la réunion" note="Licence Copilot ; transcription requise" />
      <M4ToolRow d={250} id="google" where="Google Meet" what="« Prendre des notes pour moi » : notes dans un Doc" note="Selon l’édition Workspace" />
      <M4ToolRow d={350} id="zoom" where="Réunions Zoom" what="Résumé et prochaines étapes (AI Companion)" note="Comptes Zoom payants" />
      <M4ToolRow d={450} id="otter" where="Toute réunion" what="Un assistant rejoint l’appel, transcrit et résume" note="Service externe : à faire approuver" />
      <M4ToolRow d={550} id="notion" where="Dans Notion" what="Notes de réunion transcrites et résumées dans la page" note="Selon le forfait Notion" />
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
        Au début, à l’oral et dans l’invitation.
      </M4Rule>
      <M4Rule d={220} icon="lock" tone="coral" title="Pas pour les sujets sensibles">
        Ressources humaines, santé, conflits, négociations.
      </M4Rule>
      <M4Rule d={340} icon="shieldCheck" tone="green" title="Un outil approuvé">
        Celui que votre organisation a validé, pas un service découvert la veille.
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
    <b style={{ width: 90, flex: 'none' }}>{who}</b>
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
          <Icon name="link" size={18} /> CR 2 févr.
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
      <M4Act who="Annie" what="Avancer le câblage réseau" when="12 févr." />
      <M4Act who="Julie" what="Relancer 2 candidats" when="3 févr." />
      <M4Act who="Karim" what="Confirmer la pose du 20" when="4 févr." />
    </div>
    <svg width={120} height={60} style={{ position: 'absolute', left: 770, top: 400, overflow: 'visible' }}>
      <path d="M0 30 H100" stroke={C.blue} strokeWidth={5} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M92 16 L110 30 L92 44" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" className={b.fade(1)} />
    </svg>
    <AppWin id="planner" title="Projet Limoilou · cette semaine" cls={A.right} style={{ position: 'absolute', left: 920, top: 280, width: 880, ...dl(200) }} pad={24}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Card n={1} who="Annie" what="Avancer le câblage réseau" when="12 févr." tone="violet" />
        <M4Card n={2} who="Julie" what="Relancer 2 candidats mécaniciens" when="3 févr." tone="green" />
        <M4Card n={3} who="Karim" what="Confirmer la pose du samedi 20" when="4 févr." tone="blue" />
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
    <Lede>Ce n’est pas encore de l’IA : c’est de l’automatisation. Et c’est déjà beaucoup de temps gagné.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M4RuleRow n={1} a="Une tâche change de statut" c="le nouveau statut est « Bloquée »" x="Message à Karim dans Teams" />
      <M4RuleRow n={2} a="Chaque matin, 8 h" c="échéance dans 2 jours et tâche non commencée" x="Rappel au responsable" />
      <M4RuleRow n={3} a="Chaque vendredi, 14 h" c="tâches terminées cette semaine" x="L’IA rédige le brouillon du rapport" ai />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', alignItems: 'center', gap: 26, ...dl(400) }}>
      <span style={{ fontSize: 24, fontWeight: 600, color: C.soft }}>Où les créer :</span>
      <AppChip id="clickup" size={24} />
      <AppChip id="planner" size={24} />
      <AppChip id="notion" size={24} />
      <AppChip id="trello" size={24} />
      <AppChip id="monday" size={24} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 840, fontSize: 22, color: C.muted, ...dl(500) }}>
      Planner passe par Power Automate ; Trello par ses règles d’automatisation ; les autres ont un menu « Automatisations ».
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
        « Soumission de l’électricien » est en retard de 4 jours.
      </div>
      <div style={{ marginTop: 26, fontSize: 25, lineHeight: 1.45, color: C.soft }}>Utile… mais le retard est déjà là.</div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 800, top: 230, width: 1000, height: 680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.violet}`, padding: '30px 34px', ...dl(150) }}>
      <Eyebrow c={T.violet.fg}>Alerte intelligente</Eyebrow>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>L’anticipation, en croisant des signaux faibles</div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Signal n={1} icon="clock">
          Aucune mise à jour de la tâche depuis 9 jours
        </M4Signal>
        <M4Signal n={2} icon="users">
          Son responsable a 3 autres tâches cette semaine
        </M4Signal>
        <M4Signal n={3} icon="route">
          Elle est sur le chemin critique du 5 mars
        </M4Signal>
        <M4Signal n={4} icon="chat">
          Dernier commentaire : « petit souci avec le maître électricien »
        </M4Signal>
      </div>
      <div className={b.on(5)} style={{ marginTop: 24, background: T.violet.bg, borderRadius: 12, padding: '16px 20px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        <b>Risque de glissement du jalon du 5 mars.</b> Suggestion : appeler l’électricien aujourd’hui.
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
  const plan = Math.round((wk / 23) * 100);
  const delta = M4_DELTA[wk] ?? 0;
  const real = plan - delta;
  const meteo: Tone = delta < 3 ? 'green' : delta < 6 ? 'yellow' : 'coral';
  return (
    <Frame mod={4} kind="exercice">
      <Title>Simulateur : le tableau de bord de Karim, semaine après semaine</Title>
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
          L’IA propose, Karim décide. La météo envoyée à Luc reste <b>son</b> jugement.
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
            Soumission de l’électricien : aucune mise à jour depuis 9 jours.
          </M4Alert>
          <M4Alert show={wk >= 11} tone="yellow" icon="users">
            Annie : 3 tâches la même semaine, charge estimée à 140 %.
          </M4Alert>
          <M4Alert show={wk >= 12} tone="coral" icon="alert">
            Logiciel de caisse non choisi : bloque la formation de l’équipe.
          </M4Alert>
          <M4Alert show={wk >= 13} tone="yellow" icon="chat">
            Fournisseur : « petite difficulté d’approvisionnement » (ton inquiet).
          </M4Alert>
          <M4Alert show={wk >= 14} tone="coral" icon="route">
            Jalon « Travaux finis » : glissement probable de 5 jours.
          </M4Alert>
          <M4Alert show={wk >= 15} tone="blue" icon="bulb">
            Suggestion : avancer le câblage réseau pendant l’attente.
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
    <Lede>L’automatisation rassemble, l’IA rédige, Karim juge. Chacun son rôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <M4Flow n={1} icon="kanban" tone="grey" title="1. L’outil rassemble">
        Tâches terminées, en retard, à venir
      </M4Flow>
      <M4Flow n={2} icon="sparkles" tone="violet" title="2. L’IA rédige">
        Avancement, points d’attention, décisions
      </M4Flow>
      <M4Flow n={3} icon="humanCheck" tone="blue" title="3. Karim relit et juge">
        Corrige, ajuste la météo, ajoute le contexte
      </M4Flow>
      <M4Flow n={4} icon="send" tone="green" title="4. Luc reçoit">
        Le même format chaque semaine : il sait où regarder
      </M4Flow>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 900, top: 270, width: 900, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.yellow}`, padding: '26px 34px', ...dl(200) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Rapport · semaine 14</span>
        <Tag tone="yellow" size={22}>
          MÉTÉO JAUNE
        </Tag>
      </div>
      <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.5, color: C.ink }}>
        <b>Avancement</b> : 55 % (prévu : 61 %).
        <br />
        <b>Fait</b> : permis obtenu, 6 embauches sur 8, logiciel de caisse choisi.
        <br />
        <b>Points d’attention</b> : électricité (5 jours de retard), comptoirs livrés le 19.
        <br />
        <b>Décision attendue de Luc</b> : 6 000 $ sur la réserve pour l’électricité.
        <br />
        <b>Semaine prochaine</b> : câblage réseau, essais de la caisse.
      </div>
      <div className={b.on(3)} style={{ marginTop: 16, background: T.blue.bg, borderRadius: 10, padding: '10px 16px', fontSize: 22, color: T.blue.fg }}>
        <Icon name="humanCheck" size={22} style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
        Relu par Karim : météo passée de vert à jaune, contexte électricité ajouté.
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
    <Title>Collaborer avec l’IA : les pratiques d’équipe</Title>
    <Lede>L’IA individuelle fait gagner des minutes. L’IA d’équipe fait gagner des heures.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M4Prac d={100} icon="database" tone="blue" title="Une seule source">
        Tâches, comptes rendus et décisions au même endroit : l’IA y trouve le contexte.
      </M4Prac>
      <M4Prac d={200} icon="book" tone="teal" title="Une bibliothèque">
        Les demandes qui marchent, partagées et améliorées par tous.
      </M4Prac>
      <M4Prac d={300} icon="note" tone="green" title="Une mention claire">
        « Brouillon IA, relu par Karim » : chacun sait ce qui a été vérifié.
      </M4Prac>
      <M4Prac d={400} icon="humanCheck" tone="yellow" title="Un relecteur désigné">
        Pour chaque livrable généré, une personne qui en répond.
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
    <Title>La bibliothèque de demandes de l’équipe Limoilou</Title>
    <Lede>Six modèles à copier. Les zones entre crochets se remplacent à chaque usage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M4Lib d={100} icon="gantt" tone="teal" title="Plan de projet">
        Tu es chargé de projet. Voici [le contexte]. Découpe en lots et tâches, avec dépendances et jalons, en tableau. Signale les durées supposées.
      </M4Lib>
      <M4Lib d={200} icon="note" tone="violet" title="Compte rendu">
        À partir de [la transcription], liste décisions, actions (qui, quoi, quand) et points ouverts. N’invente rien : [à confirmer].
      </M4Lib>
      <M4Lib d={300} icon="chart" tone="blue" title="Rapport hebdomadaire">
        À partir de [mes notes], rédige le rapport pour [Luc] : météo, avancement, 3 points d’attention, décision attendue. 150 mots.
      </M4Lib>
      <M4Lib d={400} icon="mail" tone="yellow" title="Message délicat">
        Rédige un courriel à [destinataire] pour annoncer [la nouvelle]. Ton : [clair et rassurant]. Propose deux options.
      </M4Lib>
      <M4Lib d={500} icon="alert" tone="coral" title="Risques">
        Pour [le projet], liste 8 risques avec probabilité, impact et une mesure. Classe-les du plus grave au moins grave.
      </M4Lib>
      <M4Lib d={600} icon="calendar" tone="green" title="Préparer une réunion">
        À partir de [l’état des tâches], propose l’ordre du jour de [45 min] : objectifs, points à décider, temps par point.
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
    q="Teams vient de produire le compte rendu de la réunion de suivi. Que fait Karim avant de l’envoyer ?"
    explain="Le compte rendu engage celui qui l’envoie. Les erreurs typiques : fausse décision, mauvaise personne, date inventée, point ouvert disparu. Deux minutes de relecture suffisent."
  >
    <Opt why="Piège ! C’est justement là que se glissent les fausses décisions et les mauvaises attributions.">Il l’envoie tel quel : c’est la transcription exacte</Opt>
    <Opt ok why="Oui : décisions, responsables, dates et points ouverts. Le reste peut rester imparfait.">
      Il vérifie décisions, responsables, dates et points ouverts
    </Opt>
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
        À votre prochaine réunion : annoncez la transcription, puis testez la demande de compte rendu.
        <br />
        <br />
        Créez une première règle « si… alors » dans votre outil de tâches.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Compte rendu : <b>décisions, actions, points ouverts</b>, et rien d’inventé.
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
      En équipe : une source, une <b>bibliothèque</b>, un relecteur.
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

DIRE — « Module 4 : automatiser et collaborer. On s'attaque à ce qui se répète chaque semaine dans un projet : les réunions et leurs comptes rendus, le suivi des tâches, les relances, le rapport du vendredi. »

« Quatre temps : comptes rendus et résumés de réunions ; transformer les actions en tâches sans ressaisie ; le suivi automatique et les alertes intelligentes ; et les pratiques d'équipe pour que l'IA profite à tous. »

RYTHME — Environ 1 h 15, de 9 h 15 à 10 h 30. Gardez un bon rythme : le simulateur et l'exercice des erreurs sont les deux moments à ne pas couper.

TRANSITION — « Commençons par la réunion. »`,
  `⏱ 3 min · AVANT, PENDANT, APRÈS (3 clics)

OBJECTIF — Montrer que l'IA aide à chaque moment d'une réunion.

DIRE — « 11 heures de réunions par semaine pour Karim. Trois moments où l'IA aide. »
→ beat 1 : « Avant : proposer l'ordre du jour à partir des tâches en retard, résumer les documents à lire, rédiger l'invitation avec un objectif clair. »
→ beat 2 : « Pendant : transcrire, avec l'accord des participants ; demander "qu'a-t-on décidé jusqu'ici ?" ; rattraper quelqu'un qui arrive en retard. »
→ beat 3 : « Après : le compte rendu, les tâches dans l'outil, le courriel de suivi aux absents. C'est là que le gain est le plus grand. »

QUESTION — « Combien de temps vous prend un compte rendu ? Et combien de temps après la réunion le diffusez-vous ? »

TRANSITION — « Voyons comment l'IA passe d'une transcription à un compte rendu. »`,
  `⏱ 4 min · DÉMO : TRANSCRIPTION → COMPTE RENDU (3 clics)

OBJECTIF — Visualiser l'extraction : décisions, actions, points ouverts.

DIRE — « À gauche, un extrait de la transcription de la réunion du 2 février. Des phrases spontanées, dans le désordre. »
→ beat 1 : « L'IA repère la décision, en vert : la pose des comptoirs le samedi 20. »
→ beat 2 : « Les actions, en bleu : Annie avance le câblage réseau d'ici le 12 ; Julie relance les candidats demain, donc le 3 février. »
→ beat 3 : « Les points ouverts, en jaune : la date des portes ouvertes. Luc tranche jeudi. »

INSISTER — « Remarquez : "on en reparle jeudi" n'est pas une décision. Une bonne extraction distingue ce qui est décidé de ce qui est discuté. »

TRANSITION — « Voici la demande qui produit ce résultat. »`,
  `⏱ 3 min · MODÈLE DE DEMANDE DE COMPTE RENDU

OBJECTIF — Donner un modèle réutilisable et expliquer ses garde-fous.

DIRE — « Les zones jaunes changent à chaque réunion : le projet, la date. Le reste se réutilise tel quel. »

Pointer les quatre conseils :
• « Seulement les décisions clairement prises » : évite les fausses décisions.
• « [à confirmer] » : l'IA montre les trous au lieu de les combler.
• La liste des participants : moins d'erreurs de noms, surtout avec une transcription automatique.
• Relire avant de diffuser : « C'est vous qui signez. »

ASTUCE — Pour une réunion en anglais ou bilingue : ajoutez « Rédige le compte rendu en français ».

TRANSITION — « Et si la demande est trop vague ? Exercice. »`,
  `⏱ 5 min · EXERCICE : QUATRE ERREURS (4 clics)

OBJECTIF — Entraîner l'œil à repérer les erreurs typiques d'un compte rendu généré.

ANIMATION — Laissez 2 minutes : chacun compare avec la transcription de la page précédente (revenez-y si besoin) et écrit dans le clavardage les erreurs trouvées. Puis un clic par erreur.
→ beat 1 : Fausse décision : les portes ouvertes n'ont pas été reportées, on a seulement discuté.
→ beat 2 : Mauvaise personne : c'est Annie qui avance le câblage.
→ beat 3 : Date inventée : Julie a dit « demain », donc le 3 février, pas le 15.
→ beat 4 : Point ouvert effacé : la date des portes ouvertes reste à trancher.

MESSAGE CLÉ — « Ce sont exactement les quatre erreurs à vérifier : décisions, responsables, dates, points ouverts. Deux minutes de relecture. »

TRANSITION — « Quels outils font ces résumés ? »`,
  `⏱ 4 min · OUTILS DE RÉSUMÉ DE RÉUNION

OBJECTIF — Panorama des outils, avec le critère qui compte : où vont les données.

DIRE — Parcourez les cinq lignes :
• Copilot dans Teams : récapitulatif, tâches de suivi, questions sur la réunion. Licence Copilot et transcription nécessaires.
• Google Meet : « Prendre des notes pour moi », dans un Google Doc, selon l'édition Workspace.
• Zoom : AI Companion, résumé et prochaines étapes, avec les comptes payants.
• Otter.ai : un assistant qui rejoint l'appel, transcrit et résume. « Attention : c'est un service externe. Vos réunions partent chez un tiers. À faire approuver. »
• Notion : notes de réunion transcrites directement dans la page.

INSISTER — « La qualité est comparable. La vraie question : est-ce que mon organisation autorise cet outil pour ce type de réunion ? »

À VÉRIFIER — Ces offres évoluent vite ; vérifiez avant chaque session (français, licence, hébergement des données).

TRANSITION — « Justement : les règles pour transcrire une réunion. »`,
  `⏱ 3 min · CINQ RÈGLES POUR TRANSCRIRE

OBJECTIF — Installer de bons réflexes éthiques et légaux.

DIRE — « Une transcription contient des renseignements personnels et des propos spontanés. Cinq règles. »
1. Annoncer et obtenir l'accord, à l'oral et dans l'invitation.
2. Pas pour les sujets sensibles : RH, santé, conflits, négociations.
3. Un outil approuvé par l'organisation.
4. Une durée de conservation : on garde le compte rendu, pas forcément l'enregistrement.
5. Relire avant de diffuser : celui qui envoie en est responsable.

Lire la citation : « Je propose d'activer la transcription pour le compte rendu. Quelqu'un s'y oppose ? » « Ça prend cinq secondes et ça règle la question du consentement. »

LIEN — Au Québec, la Loi 25 encadre les renseignements personnels ; on en reparle au module 5.

TRANSITION — « Le compte rendu est prêt. Que deviennent les actions ? »`,
  `⏱ 3 min · DES ACTIONS AUX TÂCHES (3 clics)

OBJECTIF — Montrer la continuité compte rendu → outil de tâches.

DIRE — « Une action qui reste dans un compte rendu est souvent une action oubliée. »
→ beat 1 : « L'action d'Annie devient une tâche dans Planner, avec responsable, date, et un lien vers le compte rendu. »
→ beat 2 : « Celle de Julie. »
→ beat 3 : « Celle de Karim. »

COMMENT — « Selon l'outil : le récapitulatif propose directement les tâches, on demande à l'IA "crée ces tâches", ou on passe par une automatisation. »

INSISTER — Le lien vers le compte rendu donne le contexte à celui qui ouvre la tâche dans deux semaines.

TRANSITION — « Les tâches sont dans l'outil. Le suivi peut maintenant s'automatiser. »`,
  `⏱ 4 min · RÈGLES « SI… ALORS » (3 clics)

OBJECTIF — Montrer l'automatisation simple du suivi, avant même l'IA.

DIRE — « Une règle a trois parties : quand, si, alors. »
→ beat 1 : « Quand une tâche change de statut, si elle passe à "Bloquée", alors message à Karim dans Teams. Karim n'a plus besoin de demander "où en es-tu ?". »
→ beat 2 : « Chaque matin à 8 h, si une échéance arrive dans 2 jours et que la tâche n'est pas commencée, rappel au responsable. Les relances se font toutes seules. »
→ beat 3 : « Chaque vendredi à 14 h, l'outil rassemble les tâches terminées, et cette fois l'IA rédige le brouillon du rapport. On combine automatisation et IA. »

OÙ — ClickUp, Planner (avec Power Automate), Notion, Trello, monday.

DÉMO OPTIONNELLE — Créez une règle en direct dans ClickUp ou Trello.

TRANSITION — « Les règles constatent. L'IA, elle, peut anticiper. »`,
  `⏱ 4 min · ALERTE INTELLIGENTE (5 clics)

OBJECTIF — Distinguer constat (règle) et anticipation (IA).

DIRE — « À gauche, l'alerte par règle : la soumission est en retard de 4 jours. Utile, mais le retard est déjà là. »
« À droite, l'alerte intelligente : l'IA croise des signaux faibles. »
→ beat 1 : « Pas de mise à jour depuis 9 jours. »
→ beat 2 : « Son responsable est surchargé. »
→ beat 3 : « La tâche est sur le chemin critique. »
→ beat 4 : « Et le dernier commentaire : "petit souci avec le maître électricien". Une règle ne lit pas le ton ; l'IA, si. »
→ beat 5 : « Conclusion : risque de glissement, avec une suggestion d'action. Avant que le retard n'arrive. »

NUANCE — Ces alertes existent à des degrés divers selon les outils ; elles supposent des tâches tenues à jour.

TRANSITION — « Voyons-le évoluer semaine après semaine. »`,
  `⏱ 5 min · SIMULATEUR (curseur)

OBJECTIF — Faire vivre le suivi d'un projet qui dérive, et le rôle de l'humain.

ANIMATION — Commencez en semaine 10 (vous pouvez reculer à 8). Faites glisser le curseur semaine par semaine jusqu'à 16 (ou cliquez le curseur puis utilisez les flèches du clavier). Commentez chaque nouvelle alerte.

DIRE —
• Semaines 9 et 10 : « Tout va bien… puis un premier silence. »
• Semaine 11 : « Annie est surchargée. »
• Semaine 12 : « Le logiciel de caisse bloque la formation : rouge. »
• Semaine 13 : « Le ton du fournisseur change. »
• Semaine 14 : « Le jalon du 5 mars va glisser. Météo rouge. »
• Semaine 15 : « Une suggestion d'action. »

QUESTION — « À quelle semaine Karim aurait-il dû réagir ? » Réponse attendue : dès la 10 ou la 11, pas à la 14.

INSISTER — Encadré : la météo envoyée à Luc reste le jugement de Karim.

TRANSITION — « Justement, le rapport à Luc. »`,
  `⏱ 3 min · LE RAPPORT DU VENDREDI (4 clics)

OBJECTIF — Montrer la chaîne complète et la répartition des rôles.

DIRE —
→ beat 1 : « L'outil rassemble : tâches terminées, en retard, à venir. »
→ beat 2 : « L'IA rédige : avancement, points d'attention, décision attendue. »
→ beat 3 : « Karim relit et juge. Ici, il a fait passer la météo de vert à jaune, et ajouté le contexte sur l'électricité. Voyez l'encadré bleu. »
→ beat 4 : « Luc reçoit le même format chaque semaine : il sait où regarder. »

INSISTER — « Un rapport trop optimiste, c'est la confiance de Luc qui s'en va. L'IA a tendance à arrondir les angles : c'est à vous de nommer les problèmes. »

TRANSITION — « Passons de l'individu à l'équipe. »`,
  `⏱ 4 min · PRATIQUES D'ÉQUIPE

OBJECTIF — Donner six pratiques concrètes pour intégrer l'IA au travail collaboratif.

DIRE — « L'IA individuelle fait gagner des minutes. L'IA d'équipe fait gagner des heures. »
1. Une seule source : tâches, comptes rendus, décisions au même endroit. L'IA y trouve le contexte.
2. Une bibliothèque de demandes, partagée et améliorée.
3. Une mention claire : « Brouillon IA, relu par… ».
4. Un relecteur désigné pour chaque livrable généré.
5. Partager les bons coups : cinq minutes en réunion d'équipe.
6. Des règles communes : outils permis, données interdites, écrites quelque part.

QUESTION — « Laquelle de ces pratiques pourriez-vous lancer dès la semaine prochaine ? »

TRANSITION — « Voici la bibliothèque de l'équipe Limoilou. »`,
  `⏱ 3 min · BIBLIOTHÈQUE DE DEMANDES

OBJECTIF — Remettre six modèles prêts à l'emploi (ils serviront dans l'atelier 2).

DIRE — « Six modèles : plan de projet, compte rendu, rapport hebdomadaire, message délicat, risques, préparer une réunion. Les crochets se remplacent à chaque usage. »

« Remarquez que chacun contient les cinq ingrédients d'hier, et un garde-fou : "signale les durées supposées", "n'invente rien", "150 mots". »

ASTUCE — Stockez-les dans une page Notion, un OneNote d'équipe ou une note épinglée dans Teams. Certains assistants permettent aussi d'enregistrer des instructions ou des « projets » réutilisables.

LOGISTIQUE — Partagez ces modèles aux participants (document ou clavardage) pour l'atelier 2.

TRANSITION — « Deux QCM pour vérifier. »`,
  `⏱ 3 min · QCM 4

RÉPONSE — B : il vérifie décisions, responsables, dates et points ouverts.
• A ✗ PIÈGE — « Ce n'est pas une transcription, c'est une interprétation de la transcription. »
• C ✗ PIÈGE — On perdrait tout le temps gagné.
• D ✗ PIÈGE — Une autre IA ne sait pas ce qui a été dit ; seule une personne présente le sait.

TRANSITION — « Deuxième question : règle ou intelligence ? »`,
  `⏱ 3 min · QCM 5

RÉPONSE — C : la tâche Z risque de glisser.
• A, B, D ✗ — Ce sont des règles fixes : date dépassée, statut, horaire. Très utiles, mais pas de l'IA.
• C ✓ — Aucune règle simple ne peut combiner le silence, la surcharge et le ton des échanges.

LIEN — « C'est la distinction du module 1 : automatisation = règles, IA = jugement appris. »

TRANSITION — « Faisons le bilan du module 4. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 4

DIRE — Relisez les cinq points :
1. Compte rendu : décisions, actions, points ouverts, et rien d'inventé.
2. Transcrire : annoncer, outil approuvé, pas de sujets sensibles.
3. Les actions deviennent des tâches avec responsable et date.
4. Règles pour constater, IA pour anticiper.
5. En équipe : une source, une bibliothèque, un relecteur.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « On a vu tout ce que l'IA peut faire. Parlons maintenant de ses limites, de l'éthique et de la façon d'embarquer une équipe. »`,
];
// @@NOTES-END
