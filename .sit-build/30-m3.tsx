// ─── Module 3 · Rédiger, synthétiser, préparer ──────────────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Rédiger, synthétiser,
        <br />
        préparer
      </>
    }
    sub="Produire et condenser les documents du quotidien IT : rapports, procédures, articles, réunions, plannings et e-mails."
    dur="14:00 – 15:30 · deux labs"
    labs={
      <>
        <Tag tone="green" size={19}>
          Lab 3.1 · 40 pages → 1 page
        </Tag>
        <Tag tone="green" size={19}>
          Lab 3.2 · ticket → article KB
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Synthétiser un long rapport, et vérifier la synthèse</SecItem>
    <SecItem n={2}>Procédures et base de connaissances</SecItem>
    <SecItem n={3}>Préparer un comité, produire le compte rendu</SecItem>
    <SecItem n={4}>Planifier : planning, RACI, risques</SecItem>
    <SecItem n={5}>Les e-mails délicats</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Quatre familles de documents ───────────────────────────────────────────
const M3Fam = ({ icon, tone, title, ex, where, d }: { icon: IconName; tone: Tone; title: string; ex: ReactNode; where: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} solid />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</div>
    <div style={{ fontSize: 23, lineHeight: 1.5, color: C.soft }}>{ex}</div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone={tone} size={18}>
        {where}
      </Tag>
    </div>
  </div>
);

const M3_Familles: Page = () => (
  <Frame mod={3}>
    <Title>Quatre familles de documents, une même méthode</Title>
    <Lede>Ce que vous avez cité dans le questionnaire tient dans ces quatre cases.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 560, display: 'flex', gap: 24 }}>
      <M3Fam icon="mail" tone="blue" title="Communiquer" ex="E-mails délicats, annonces de maintenance, relances fournisseurs." where="M2 · fin de M3" d={100} />
      <M3Fam icon="book" tone="green" title="Documenter" ex="Procédures, modes opératoires, articles de base de connaissances." where="Lab 3.2" d={200} />
      <M3Fam icon="doc" tone="teal" title="Synthétiser" ex="Rapports d’audit, documentation éditeur, rapports d’exploitation." where="Lab 3.1" d={300} />
      <M3Fam icon="calendar" tone="violet" title="Préparer" ex="Comités, comptes rendus, plannings, RACI, listes de risques." where="Comité de jeudi" d={400} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: C.muted, ...dl(700) }}>
      <Icon name="loop" size={26} color={C.violet} />
      Toujours la même boucle : le bon contexte, une demande structurée, une relecture qui vérifie les faits.
    </div>
  </Frame>
);

// ─── Synthèse en trois passes ───────────────────────────────────────────────
const M3Pass = ({ n, tone, title, prompt, out, beat }: { n: number; tone: Tone; title: string; prompt: string; out: string; beat: number }) => (
  <div className={b.on(beat)} style={{ width: 500, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone={tone} size={48} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</span>
    </div>
    <PromptBox label="On demande" size={21}>
      {prompt}
    </PromptBox>
    <div style={{ fontSize: 21, lineHeight: 1.45, color: C.soft }}>
      <strong style={{ color: T[tone].fg }}>On obtient · </strong>
      {out}
    </div>
  </div>
);

const M3_TroisPasses: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Synthétiser un long rapport en trois passes</Title>
    <Lede>Plutôt qu’un « résume » unique, trois demandes courtes dans la même conversation. On garde la main à chaque étape.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', alignItems: 'flex-start', gap: 20 }}>
      <M3Pass n={1} tone="blue" beat={1} title="La carte" prompt="Donne-moi le plan du rapport et, pour chaque partie, ce qu’elle couvre en une ligne." out="la structure, et la certitude que l’IA a tout lu." />
      <Box x={0} y={0} cls={b.fade(2)} style={{ position: 'relative', alignSelf: 'center' }}>
        <FlowArrow w={60} />
      </Box>
      <M3Pass n={2} tone="teal" beat={2} title="L’essentiel" prompt="Quels sont les cinq constats majeurs ? Pour chacun : le risque et la page." out="des faits vérifiables, avec leur source." />
      <Box x={0} y={0} cls={b.fade(3)} style={{ position: 'relative', alignSelf: 'center' }}>
        <FlowArrow w={60} />
      </Box>
      <M3Pass n={3} tone="violet" beat={3} title="La décision" prompt="Rédige une note d’une page pour le DSI : constats, trois actions prioritaires, décision attendue." out="un livrable prêt à relire, puis à envoyer." />
    </div>
  </Frame>
);

// ─── Vérifier une synthèse ──────────────────────────────────────────────────
const M3Check = ({ n, title, children, beat }: { n: number; title: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
    <Num n={n} tone="green" size={44} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3Src = ({ children }: { children: ReactNode }) => (
  <span style={{ display: 'inline-block', marginLeft: 8, padding: '0 10px', borderRadius: 999, background: T.teal.bg, color: T.teal.fg, fontSize: 18, fontWeight: 700, boxShadow: `inset 0 0 0 1.5px ${T.teal.bd}` }}>
    {children}
  </span>
);

const M3_Verifier: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Une synthèse se vérifie avant de partir</Title>
    <Lede>La synthèse d’un rapport de 40 pages est lue par un décideur. Une erreur dedans coûte cher.</Lede>
    <AppWin id="claude" title="rapport-audit-infra-2026.pdf" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <Eyebrow c={C.muted} size={17}>
        Cinq constats majeurs
      </Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 22, lineHeight: 1.4, color: C.ink }}>
        <div>
          1. Douze comptes administrateurs sans double authentification <M3Src>p. 17</M3Src>
        </div>
        <div>
          2. Sauvegardes non testées depuis neuf mois <M3Src>p. 22</M3Src>
        </div>
        <div>
          3. Trois serveurs hors support éditeur <M3Src>p. 9</M3Src>
        </div>
        <div>
          4. Alertes de supervision non relues le week-end <M3Src>p. 28</M3Src>
        </div>
        <div>
          5. Inventaire des postes incomplet <M3Src>p. 31</M3Src>
        </div>
      </div>
    </AppWin>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <M3Check n={1} title="Exiger la page source" beat={1}>
        Chaque constat renvoie à une page : on peut aller voir.
      </M3Check>
      <M3Check n={2} title="Contrôler trois chiffres au hasard" beat={2}>
        Si un seul est faux, on revérifie tout.
      </M3Check>
      <M3Check n={3} title="Demander ce qui a été écarté" beat={3}>
        « Qu’as-tu laissé de côté, et pourquoi ? »
      </M3Check>
      <M3Check n={4} title="Faire relire par l’autre outil" beat={4}>
        Copilot relit la synthèse de Claude, ou l’inverse : « Trouve les erreurs. »
      </M3Check>
    </div>
  </Frame>
);

// ─── Procédure ──────────────────────────────────────────────────────────────
const M3Step = ({ n, title, children, beat }: { n: number; title: string; children: ReactNode; beat: number }) => (
  <div className={b.left(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px' }}>
    <Num n={n} tone="green" size={40} />
    <span style={{ width: 230, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 23, color: C.navy }}>{title}</span>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const M3_Procedure: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Des notes en vrac à la procédure standard</Title>
    <Lede>Malik a ses notes de lundi. L’IA les range dans la structure de la maison ; Malik vérifie chaque étape.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 600, boxSizing: 'border-box', background: '#FFFBEA', borderRadius: 16, boxShadow: SHADOW_SM, padding: '22px 26px', transform: 'rotate(-1.2deg)' }}>
      <Eyebrow c={T.yellow.fg} size={17}>
        Notes de Malik · lundi 9:40
      </Eyebrow>
      <div style={{ marginTop: 12, fontFamily: mono, fontSize: 20, lineHeight: 1.6, color: C.soft, whiteSpace: 'pre-wrap' }}>
        {`D: plein 0 Go → journaux agent sauvegarde
dossier Logs = 180 Go !!
arrêter le service avant ? oui
garder 30 j, supprimer le reste
redémarrer service + vérifier sauvegarde de nuit
penser à prévenir l'astreinte
si ça casse : restaurer dossier depuis snapshot`}
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 750, top: 470, ...dl(300) }}>
      <FlowArrow w={70} color={C.violet} />
    </div>
    <div style={{ position: 'absolute', left: 860, top: 262, width: 940, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M3Step n={1} title="Objet et périmètre" beat={1}>
        Purge des journaux de l’agent, serveurs FS-01 à FS-04
      </M3Step>
      <M3Step n={2} title="Prérequis" beat={2}>
        Snapshot du volume, astreinte prévenue, droits d’exploitation
      </M3Step>
      <M3Step n={3} title="Étapes" beat={3}>
        Arrêt du service, suppression au-delà de 30 jours, redémarrage
      </M3Step>
      <M3Step n={4} title="Vérifications" beat={4}>
        Espace libéré, service actif, sauvegarde de nuit réussie
      </M3Step>
      <M3Step n={5} title="Retour arrière" beat={5}>
        Restauration du dossier depuis le snapshot
      </M3Step>
      <M3Step n={6} title="Contacts" beat={6}>
        Exploitation, astreinte, responsable sauvegarde
      </M3Step>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 600, ...dl(500) }}>
      <Callout title="Le prompt" tone="violet" icon="chat" size={22}>
        « Transforme ces notes en procédure selon notre modèle. Signale les étapes que tu as dû deviner. »
      </Callout>
    </div>
  </Frame>
);

// ─── Base de connaissances ──────────────────────────────────────────────────
const M3Kb = ({ label, children, tone = 'green' }: { label: string; children: ReactNode; tone?: Tone }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, padding: '8px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg, paddingTop: 3 }}>{label}</span>
    <span style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M3_KB: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Un ticket résolu devient un article de la base</Title>
    <Lede>Le savoir est dans les notes du technicien. L’IA le remet dans l’ordre de lecture de celui qui aura le problème demain.</Lede>
    <AppWin id="ticket" title="ticket n° 48213 · résolu" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 700 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>« L’imprimante d’étiquettes de Lyon n’imprime plus rien »</div>
      <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, lineHeight: 1.6, color: C.soft, whiteSpace: 'pre-wrap' }}>
        {`08:12 appel quai 3, file bloquée
08:20 ping ok, page de test ok depuis l'imprimante
08:31 file PRT-01 : 214 travaux en erreur
08:35 pilote mis à jour hier soir (KB auto)
08:41 retour pilote v5.2 → OK
08:45 purge file, impression reprise
à faire : bloquer MAJ auto pilote sur PRT-01`}
      </div>
    </AppWin>
    <div className={b.fade(1)} style={{ position: 'absolute', left: 845, top: 470 }}>
      <FlowArrow w={60} color={C.violet} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 930, top: 262, width: 870, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 26px' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy, marginBottom: 6 }}>Les étiquettes ne s’impriment plus après une mise à jour</div>
      <M3Kb label="Symptôme">Rien ne sort, l’imprimante répond et imprime sa page de test.</M3Kb>
      <M3Kb label="Cause">Pilote mis à jour automatiquement sur PRT-01, incompatible.</M3Kb>
      <M3Kb label="Solution">Revenir au pilote 5.2, purger la file, relancer l’impression.</M3Kb>
      <M3Kb label="Prévention">Bloquer la mise à jour automatique des pilotes sur PRT-01.</M3Kb>
      <M3Kb label="Mots-clés" tone="violet">
        étiquettes, imprimante, quai, pilote, file bloquée
      </M3Kb>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 930, top: 760, width: 870 }}>
      <Callout title="Titre = symptôme" tone="yellow" icon="search" size={23}>
        On cherche avec les mots de l’utilisateur (« étiquettes ne s’impriment plus »), pas avec la cause (« pilote »).
      </Callout>
    </div>
  </Frame>
);

// ─── Comité de changement ───────────────────────────────────────────────────
const M3Prep = ({ icon, tone, title, prompt, d }: { icon: IconName; tone: Tone; title: string; prompt: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</span>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft, fontStyle: 'italic' }}>« {prompt} »</div>
  </div>
);

const M3_Comite: Page = () => (
  <Frame mod={3}>
    <Title>Préparer le comité de changement de jeudi</Title>
    <Lede>Claire présente la migration du serveur d’impression PRT-01. Quatre demandes, à partir du dossier technique de Malik.</Lede>
    <FilRouge cls={A.fade} style={{ position: 'absolute', left: 120, top: 248 }}>
      Comité de changement · jeudi 14:00
    </FilRouge>
    <div style={{ position: 'absolute', left: 120, top: 310, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M3Prep icon="note" tone="blue" title="L’ordre du jour" d={100} prompt="Propose un ordre du jour de 30 minutes pour présenter ce changement au comité, avec le temps par point." />
      <M3Prep icon="doc" tone="teal" title="La fiche de changement" d={200} prompt="Remplis notre modèle de fiche : description, justification, impacts, plan de retour arrière, communication." />
      <M3Prep icon="alert" tone="coral" title="Les questions qui fâchent" d={300} prompt="Joue un membre exigeant du comité : pose-moi les cinq questions les plus difficiles sur ce dossier." />
      <M3Prep icon="layers" tone="violet" title="Les diapositives" d={400} prompt="Crée une présentation de six diapositives à partir de la fiche de changement, avec des notes pour l’oratrice." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="star" size={24} color={C.violet} />
      La troisième demande est la plus rentable : on arrive au comité en ayant déjà répondu aux objections.
    </div>
  </Frame>
);

// ─── Compte rendu Teams ─────────────────────────────────────────────────────
const M3Act = ({ who, what, when }: { who: string; what: string; when: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px', gap: 14, fontSize: 21, padding: '6px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ color: C.ink }}>{what}</span>
    <span style={{ fontWeight: 700, color: C.navy }}>{who}</span>
    <span style={{ color: C.muted }}>{when}</span>
  </div>
);

const M3_CR: Page = () => (
  <Frame mod={3} kind="demo" beats={3}>
    <Title>Le compte rendu en trente secondes</Title>
    <Lede>Réunion transcrite dans Teams : Copilot sépare décisions, actions et points ouverts. Quelqu’un relit avant diffusion.</Lede>
    <AppWin id="teams" title="Comité de changement · récapitulatif" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180 }}>
      <div className={b.on(1)}>
        <Eyebrow c={T.green.fg} size={17}>
          Décisions
        </Eyebrow>
        <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.5, color: C.ink }}>
          Migration de PRT-01 validée · pilote à Lyon la semaine 46 · bascule générale conditionnée au bilan du pilote
        </div>
      </div>
      <div className={b.on(2)} style={{ marginTop: 18 }}>
        <Eyebrow c={T.blue.fg} size={17}>
          Actions
        </Eyebrow>
        <div style={{ marginTop: 6 }}>
          <M3Act what="Inventaire des pilotes d’imprimante par site" who="Malik" when="6 novembre" />
          <M3Act what="Message aux chefs d’entrepôt" who="Inès" when="10 novembre" />
          <M3Act what="Plan de retour arrière testé" who="Thomas" when="12 novembre" />
        </div>
      </div>
      <div className={b.on(3)} style={{ marginTop: 18 }}>
        <Eyebrow c={T.coral.fg} size={17}>
          Points ouverts
        </Eyebrow>
        <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.5, color: C.ink }}>Budget des licences du nouveau serveur à confirmer par les achats</div>
      </div>
    </AppWin>
    <div className={A.in} style={{ position: 'absolute', left: 1350, top: 262, width: 450, display: 'flex', flexDirection: 'column', gap: 18, ...dl(300) }}>
      <PromptBox size={21}>Liste les décisions, les actions avec responsable et échéance, puis les points restés ouverts.</PromptBox>
      <Callout title="Prérequis" tone="yellow" icon="alert" size={21}>
        Transcription activée, participants informés, et licence Microsoft 365 Copilot. Sans transcription : Copilot ne « voit » pas la réunion.
      </Callout>
    </div>
  </Frame>
);

// ─── Planning ───────────────────────────────────────────────────────────────
const M3Bar = ({ label, from, len, tone, beat }: { label: string; from: number; len: number; tone: Tone; beat: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '470px 1fr', alignItems: 'center', gap: 20, height: 62 }}>
    <span className={b.fade(beat)} style={{ fontSize: 23, fontWeight: 600, color: C.ink }}>
      {label}
    </span>
    <div style={{ position: 'relative', height: 40 }}>
      <div className={b.grow(beat)} style={{ position: 'absolute', left: `${(from / 15) * 100}%`, width: `${(len / 15) * 100}%`, top: 0, height: 40, borderRadius: 10, background: STRONG[tone] }} />
    </div>
  </div>
);

const M3_Planning: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Planifier la migration : le planning</Title>
    <Lede>« Propose un planning en trois semaines, avec les dépendances et un jalon de décision après le pilote. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '470px 1fr', gap: 20, marginBottom: 6 }}>
        <span />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontFamily: display, fontWeight: 700, fontSize: 19, color: C.muted, letterSpacing: '0.08em' }}>
          <span>SEMAINE 45</span>
          <span>SEMAINE 46</span>
          <span>SEMAINE 47</span>
        </div>
      </div>
      <M3Bar beat={1} label="Inventaire des pilotes par site" from={0} len={3} tone="blue" />
      <M3Bar beat={2} label="Installation du serveur PRT-02" from={2} len={4} tone="violet" />
      <M3Bar beat={3} label="Pilote à l’entrepôt de Lyon" from={5} len={4} tone="teal" />
      <M3Bar beat={4} label="Bascule des huit autres entrepôts" from={10} len={3} tone="green" />
      <M3Bar beat={5} label="Arrêt de PRT-01" from={13} len={2} tone="navy" />
    </div>
    <div className={b.pop(3)} style={{ position: 'absolute', left: 1315, top: 300, width: 6, height: 400, background: C.coral, borderRadius: 3, ...vars({ o: 'top center' }), ...dl(500) }} />
    <div className={b.fade(3)} style={{ position: 'absolute', left: 1335, top: 700, fontSize: 21, fontWeight: 700, color: T.coral.fg, ...dl(700) }}>
      ◆ Jalon : bilan du pilote, go / no go
    </div>
    <div className={b.fade(5)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout title="À vérifier vous-même" tone="yellow" icon="calendar" size={23}>
        Les jours fériés, les pics d’activité des entrepôts et les congés de l’équipe : l’IA ne les connaît pas si vous ne les donnez pas.
      </Callout>
    </div>
  </Frame>
);

// ─── RACI et risques ────────────────────────────────────────────────────────
const RACI_TONE: Record<string, Tone> = { R: 'blue', A: 'coral', C: 'teal', I: 'grey' };
const M3R = ({ v }: { v: string }) =>
  v ? (
    <span style={{ justifySelf: 'center', width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: STRONG[RACI_TONE[v]], color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 22 }}>
      {v}
    </span>
  ) : (
    <span />
  );

const M3RaciRow = ({ label, v, beat }: { label: string; v: string[]; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '360px repeat(5, 1fr)', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{label}</span>
    <M3R v={v[0]} />
    <M3R v={v[1]} />
    <M3R v={v[2]} />
    <M3R v={v[3]} />
    <M3R v={v[4]} />
  </div>
);

const M3_Raci: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Planifier la migration : le RACI</Title>
    <Lede>Qui Réalise, qui Approuve, qui est Consulté, qui est Informé. L’IA propose, l’équipe corrige en cinq minutes.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '360px repeat(5, 1fr)', gap: 8, paddingBottom: 8, fontFamily: display, fontWeight: 700, fontSize: 19, color: C.navy, textAlign: 'center' }}>
        <span />
        <span>Malik</span>
        <span>Thomas</span>
        <span>Inès</span>
        <span>Claire</span>
        <span>Prestataire</span>
      </div>
      <M3RaciRow beat={1} label="Inventaire des pilotes" v={['R', 'C', '', 'A', '']} />
      <M3RaciRow beat={2} label="Installation de PRT-02" v={['R', 'I', '', 'A', 'C']} />
      <M3RaciRow beat={3} label="Pilote à Lyon" v={['C', 'R', 'C', 'A', '']} />
      <M3RaciRow beat={4} label="Communication utilisateurs" v={['I', 'I', 'R', 'A', '']} />
      <M3RaciRow beat={5} label="Bascule et retour arrière" v={['C', 'R', 'I', 'A', 'C']} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1350, top: 262, width: 450, display: 'flex', flexDirection: 'column', gap: 18, ...dl(300) }}>
      <Card icon="alert" tone="coral" title="Et les risques ?" size={22}>
        « Liste les cinq risques de cette migration avec probabilité, impact et parade. Classe-les. »
      </Card>
      <Card icon="checkCircle" tone="green" title="La règle du A" size={22}>
        Un seul « A » par ligne. Demandez à l’IA de le vérifier elle-même.
      </Card>
    </div>
  </Frame>
);

// ─── E-mails délicats ───────────────────────────────────────────────────────
const M3Mail = ({ id, prompt, children }: { id: string; prompt: string; children: ReactNode }) => (
  <TabPane id={id}>
    <div style={{ display: 'flex', gap: 30 }}>
      <PromptBox size={23} style={{ width: 640, flex: 'none' }}>
        {prompt}
      </PromptBox>
      <AnswerBox id="outlook" size={22} style={{ flex: 1 }}>
        {children}
      </AnswerBox>
    </div>
  </TabPane>
);

const M3_Emails: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Les e-mails qu’on repousse toujours</Title>
    <Lede>Trois situations délicates du quotidien IT. Cliquez un onglet.</Lede>
    <Tabs initial="e1" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <TabBtn id="e1" icon="send">
          Relancer un prestataire
        </TabBtn>
        <TabBtn id="e2" icon="hand">
          Refuser poliment
        </TabBtn>
        <TabBtn id="e3" icon="calendar">
          Annoncer une maintenance
        </TabBtn>
      </div>
      <M3Mail id="e1" prompt="Relance ferme mais courtoise du prestataire Wi-Fi : intervention promise le 2 octobre, toujours rien, quai 3 de Lyon sans réseau. Demande une date sous 48 h.">
        Bonjour, sauf erreur de notre part, l’intervention prévue le 2 octobre sur le quai 3 de Lyon n’a pas eu lieu. Le quai reste sans réseau, ce qui
        ralentit les expéditions. Pouvez-vous nous confirmer une date d’intervention d’ici jeudi ? Merci d’avance.
      </M3Mail>
      <M3Mail id="e2" prompt="Refuse poliment l’installation d’un logiciel personnel demandée par un chef d’entrepôt. Explique pourquoi en une phrase, propose une alternative validée.">
        Bonjour, je comprends le besoin. Ce logiciel n’est pas validé par notre politique de sécurité : il ne peut pas être installé sur les postes
        d’Orvalis. Bonne nouvelle : l’application de planning du catalogue fait la même chose ; je peux vous l’installer dès demain.
      </M3Mail>
      <M3Mail id="e3" prompt="Annonce la maintenance du réseau de l’entrepôt de Rennes, samedi de 6 h à 8 h. Lecteurs : chefs d’équipe. Ce qui sera coupé, ce qui marche, qui appeler.">
        <strong>Maintenance réseau · Rennes · samedi 6 h – 8 h</strong>
        <br />
        Coupés : Wi-Fi des quais et scanners. Disponibles : téléphones fixes. Préparez les bons papier vendredi soir. Contact : astreinte, poste 4400.
      </M3Mail>
    </Tabs>
  </Frame>
);

// ─── Labs ───────────────────────────────────────────────────────────────────
const M3_Lab1: Page = () => (
  <LabPage
    mod={3}
    n="3.1"
    title="40 pages, une note d’une page"
    defi="synthese"
    who="Individuel"
    minutes={20}
    where={
      <>
        <PathChip>Orvalis/rapport-audit-infra-2026.pdf</PathChip>
        <div style={{ marginTop: 10 }}>Une note d’une page pour le DSI, avec la page source de chaque constat.</div>
      </>
    }
    objective={
      <>
        Réduire le rapport d’audit en <strong>une note d’une page</strong> pour le DSI, avec la méthode des trois passes, puis la vérifier.
      </>
    }
    crit={
      <>
        <CheckItem id="l31-c1" size={22}>
          Trois passes : carte, essentiel, décision
        </CheckItem>
        <CheckItem id="l31-c2" size={22}>
          Une page source par constat
        </CheckItem>
        <CheckItem id="l31-c3" size={22}>
          Trois chiffres vérifiés dans le PDF
        </CheckItem>
      </>
    }
  >
    <div>Passe 1 : le plan. Passe 2 : les cinq constats avec risque et page. Passe 3 : la note avec trois actions prioritaires et la décision attendue.</div>
    <Bonus>Faites relire votre note par l’autre outil : « Trouve les erreurs et les oublis par rapport au rapport. »</Bonus>
  </LabPage>
);

const M3_Lab2: Page = () => (
  <LabPage
    mod={3}
    n="3.2"
    title="Du ticket résolu à l’article"
    defi="kb"
    who="En binôme"
    minutes={15}
    where={
      <>
        <PathChip>Orvalis/tickets-resolus.xlsx</PathChip>
        <div style={{ marginTop: 10 }}>Deux articles au format de la maison et le prompt rangé dans la bibliothèque.</div>
      </>
    }
    objective={
      <>
        Transformer deux tickets résolus en <strong>articles de base de connaissances</strong> : symptôme, cause, solution, prévention, mots-clés.
      </>
    }
    crit={
      <>
        <CheckItem id="l32-c1" size={22}>
          Titre écrit avec les mots de l’utilisateur
        </CheckItem>
        <CheckItem id="l32-c2" size={22}>
          Étapes de solution testables
        </CheckItem>
        <CheckItem id="l32-c3" size={22}>
          Aucune donnée personnelle reprise du ticket
        </CheckItem>
      </>
    }
  >
    <div>
      Collez les notes du technicien et demandez l’article au format de la maison. Puis : « Quelles questions un utilisateur se poserait-il encore après
      avoir lu cet article ? »
    </div>
    <Bonus>Générez une version courte pour la réponse au ticket, et une version longue pour la base.</Bonus>
  </LabPage>
);

// ─── Quiz & synthèse ────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz du module 3</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi synthétiser un long rapport en trois passes ?" explain="On vérifie que tout a été lu (la carte), on récupère des faits sourcés (l’essentiel), puis on rédige pour le lecteur (la décision).">
        <QOpt>Parce que l’IA ne sait pas faire plus court</QOpt>
        <QOpt ok>Pour garder la main et obtenir des faits sourcés</QOpt>
        <QOpt>Pour consommer moins de licences</QOpt>
      </QuizQ>
      <QuizQ q="Le titre d’un article de base de connaissances doit décrire…" explain="Le symptôme, avec les mots de l’utilisateur : c’est ce qu’il tapera dans la recherche.">
        <QOpt>La cause technique</QOpt>
        <QOpt ok>Le symptôme, avec les mots de l’utilisateur</QOpt>
        <QOpt>Le numéro du ticket</QOpt>
      </QuizQ>
      <QuizQ q="Copilot peut-il résumer une réunion Teams qui n’était ni transcrite ni enregistrée ?" explain="Non : sans transcription, il n’a rien à lire. Il peut seulement résumer le fil de conversation écrit.">
        <QOpt>Oui, toujours</QOpt>
        <QOpt ok>Non, il lui faut la transcription</QOpt>
        <QOpt>Oui, s’il était invité</QOpt>
      </QuizQ>
      <QuizQ q="Quelle demande prépare le mieux un comité de changement ?" explain="Faire jouer à l’IA un membre exigeant permet de préparer les réponses aux objections avant la réunion.">
        <QOpt>« Écris-moi un beau discours »</QOpt>
        <QOpt ok>« Pose-moi les cinq questions les plus difficiles du comité »</QOpt>
        <QOpt>« Dis-moi si le comité va accepter »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M3_Synthese: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Ce qu’on retient du module 3</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="teal" d={100}>
        Un long rapport se synthétise en <strong>trois passes</strong> : carte, essentiel, décision.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        Une synthèse se <strong>vérifie</strong> : page source, chiffres, oublis, relecture croisée.
      </SynthRow>
      <SynthRow n={3} tone="blue" d={300}>
        Notes en vrac → <strong>procédure</strong> ; ticket résolu → <strong>article</strong> au titre « symptôme ».
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        Pour un comité : ordre du jour, fiche, <strong>questions qui fâchent</strong>, compte rendu.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Planning et RACI : l’IA propose, <strong>l’équipe corrige</strong>.
      </SynthRow>
    </div>
    <PosteCard>
      Chaque ticket résolu de la semaine prochaine devient un article. Cinq minutes par ticket, une base de connaissances qui grandit enfin.
    </PosteCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Familles, M3_TroisPasses, M3_Verifier, M3_Procedure, M3_KB, M3_Comite, M3_CR, M3_Planning, M3_Raci, M3_Emails, M3_Lab1, M3_Lab2, M3_Quiz, M3_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M3 · 14:00

OBJECTIF — Annoncer le module le plus « production » de la journée.

DIRE — « Rebonjour ! Cet après-midi, on produit. Synthétiser un long rapport et vérifier la synthèse, écrire des procédures et des articles de base de connaissances, préparer un comité et son compte rendu, planifier, et écrire les e-mails qu’on repousse toujours. Deux labs : un rapport de 40 pages réduit à une page, et un ticket transformé en article. »

TRANSITION — « Tout ce que vous avez cité tient en quatre familles. »`,
  `⏱ 2 min · QUATRE FAMILLES

OBJECTIF — Donner une carte des usages documentaires.

DIRE — « Communiquer, documenter, synthétiser, préparer. Ce sont les quatre familles de documents de votre quotidien, et elles reprennent ce que vous avez écrit dans le questionnaire. Et pour toutes, la même boucle : le bon contexte, une demande structurée, une relecture qui vérifie les faits. »

TRANSITION — « Commençons par la synthèse, votre deuxième priorité. »`,
  `⏱ 5 min · TROIS PASSES (3 clics)

OBJECTIF — Donner une méthode fiable de synthèse d’un long document.

DIRE — « Un seul “résume ce rapport” donne souvent un texte lisse où l’on ne sait pas ce qui manque. On préfère trois demandes courtes. » → beat 1 : « La carte : le plan et ce que couvre chaque partie. On vérifie que l’IA a tout lu. » → beat 2 : « L’essentiel : les cinq constats, avec le risque et la page. Des faits vérifiables. » → beat 3 : « La décision : la note pour le lecteur, avec les actions et la décision attendue. »

INSISTER — Les trois passes se font dans la même conversation.

TRANSITION — « Et avant d’envoyer cette note, on la vérifie. »`,
  `⏱ 4 min · VÉRIFIER (4 clics)

OBJECTIF — Installer quatre réflexes de vérification.

DIRE — « À gauche, la passe 2 sur le rapport d’audit d’Orvalis. » → beat 1 : « Chaque constat a sa page : on peut aller voir. » → beat 2 : « On contrôle trois chiffres au hasard. Si un seul est faux, on revérifie tout. » → beat 3 : « On demande ce qui a été écarté. » → beat 4 : « Et on fait relire par l’autre outil : Copilot relit Claude, ou l’inverse. Les deux ne se trompent pas au même endroit. »

TRANSITION — « Deuxième famille : documenter. »`,
  `⏱ 4 min · PROCÉDURE (6 clics)

OBJECTIF — Montrer la transformation de notes en procédure standard.

DIRE — « Les notes de Malik, lundi à 9 h 40. Tout y est, mais dans le désordre. L’IA les range dans la structure de la maison. » Un clic par rubrique : → beat 1 objet, → beat 2 prérequis, → beat 3 étapes, → beat 4 vérifications, → beat 5 retour arrière, → beat 6 contacts. « Et la phrase clé du prompt : “Signale les étapes que tu as dû deviner.” C’est là que Malik doit relire. »

INSISTER — Une procédure fausse est pire qu’une procédure absente. La relecture par celui qui connaît le système est obligatoire.

TRANSITION — « Même idée pour la base de connaissances. »`,
  `⏱ 4 min · ARTICLE KB (2 clics)

OBJECTIF — Montrer la transformation d’un ticket résolu en article.

DIRE — « Ticket 48213 : l’imprimante d’étiquettes de Lyon. Les notes sont chronologiques, utiles pour le technicien, illisibles pour le suivant. » → beat 1 : « L’IA en fait un article : symptôme, cause, solution, prévention, mots-clés. » → beat 2 : « Et une règle : le titre décrit le symptôme, avec les mots de l’utilisateur. Personne ne cherche “pilote”, tout le monde cherche “étiquettes ne s’impriment plus”. »

TRANSITION — « Troisième famille : préparer. Le comité de jeudi. »`,
  `⏱ 4 min · COMITÉ DE CHANGEMENT

OBJECTIF — Montrer quatre usages pour préparer une réunion à enjeu.

DIRE — « Claire présente jeudi la migration du serveur d’impression. Quatre demandes à partir du dossier de Malik : l’ordre du jour, la fiche de changement au format de la maison, les questions qui fâchent, et les diapositives. La troisième est la plus rentable : l’IA joue un membre exigeant du comité, et on arrive en ayant déjà préparé les réponses. »

QUESTION — « Qui prépare des comités ou des points de service ? Quelle question vous a déjà pris de court ? »

TRANSITION — « Et après la réunion, le compte rendu. »`,
  `⏱ 3 min · COMPTE RENDU TEAMS (démo, 3 clics)

OBJECTIF — Montrer le récapitulatif de réunion et ses prérequis.

DIRE — « Si la réunion est transcrite, Copilot dans Teams produit le compte rendu. » → beat 1 : « Les décisions. » → beat 2 : « Les actions, avec responsable et échéance. » → beat 3 : « Les points ouverts. Quelqu’un relit avant diffusion : une action mal attribuée, ça arrive. »

INSISTER — Prérequis : transcription activée, participants informés, licence. Sans transcription, Copilot ne voit pas la réunion.

TRANSITION — « Toujours pour ce comité : le planning. »`,
  `⏱ 3 min · PLANNING (5 clics)

OBJECTIF — Montrer la génération d’un planning avec jalon de décision.

DIRE — Un clic par phase : → beat 1 inventaire, → beat 2 installation, → beat 3 pilote à Lyon et son jalon go / no go, → beat 4 bascule, → beat 5 arrêt de l’ancien serveur. « L’IA pose la logique et les dépendances. Ce qu’elle ne connaît pas : les fériés, les pics d’activité, les congés. C’est à vous de les donner ou de corriger. »

TRANSITION — « Et qui fait quoi ? »`,
  `⏱ 3 min · RACI (5 clics)

OBJECTIF — Montrer un RACI généré et ses règles de contrôle.

DIRE — « Le RACI : qui réalise, qui approuve, qui est consulté, qui est informé. » Une ligne par clic, → beat 1 à → beat 5. « L’IA propose, l’équipe corrige en cinq minutes au lieu de trente. Deux demandes utiles : les cinq risques avec leur parade, et la vérification de la règle “un seul A par ligne”. »

TRANSITION — « Dernière famille : les e-mails qu’on repousse. »`,
  `⏱ 3 min · E-MAILS DÉLICATS (démo)

OBJECTIF — Donner trois modèles d’e-mails difficiles.

DIRE — Cliquer chaque onglet. « Relancer un prestataire : ferme mais courtois, avec une date. Refuser poliment : une phrase d’explication et une alternative. Annoncer une maintenance : ce qui est coupé, ce qui marche, qui appeler. Dans les trois cas, le prompt dit le ton et le lecteur. »

TRANSITION — « À vous. Premier lab : le rapport d’audit. »`,
  `⏱ 2 min + 20 min · LAB 3.1 (minuteur)

OBJECTIF — Synthétiser un rapport de 40 pages et vérifier la synthèse.

DIRE — « Le rapport d’audit d’Orvalis, 40 pages. Méthode des trois passes, puis vérification : une page source par constat, trois chiffres contrôlés dans le PDF. »

ANIMATION — Lancer le minuteur. Curieux : suivre exactement les trois prompts de la page « trois passes ». Réguliers : le bonus de relecture croisée.

RÉPONSES TYPES — Erreur fréquente : la note reprend les constats dans l’ordre du rapport au lieu de les classer par risque. Autre piège : un pourcentage confondu avec un nombre ; d’où les trois chiffres à vérifier.

TRANSITION — « Deuxième lab : la base de connaissances. »`,
  `⏱ 2 min + 15 min · LAB 3.2 (minuteur)

OBJECTIF — Transformer deux tickets résolus en articles.

DIRE — « En binôme, deux tickets résolus du fichier. Pour chacun, un article au format de la maison. Attention au troisième critère : aucune donnée personnelle reprise du ticket. Pas de nom d’utilisateur, pas de numéro de poste. »

ANIMATION — Lancer le minuteur. Faire lire un titre d’article par binôme : la salle dit si elle l’aurait trouvé en cherchant.

TRANSITION — « Quiz. »`,
  `⏱ 3 min · QUIZ M3

OBJECTIF — Évaluation formative du module 3.

DIRE — « Quatre questions, vote à main levée. »

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M3 · 15:30

OBJECTIF — Ancrer les cinq idées du module.

DIRE — « Trois passes. Une synthèse se vérifie. Des notes deviennent une procédure, un ticket devient un article. Pour un comité, préparez les questions qui fâchent. Et pour le planning et le RACI, l’IA propose, l’équipe corrige. »

TRANSITION — « Pause ! Au retour, le module 4 : les limites, la sécurité et la conformité. Un module important avant de passer à l’automatisation demain. »`,
];
// @@NOTES-END
