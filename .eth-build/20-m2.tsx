// ─── M2 · Divider ───────────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title={<>Applications concrètes<br />de l’IA</>} sub="Ce que l’IA fait déjà dans les RH, la santé, la finance et le marketing." dur="≈ 30 min" kind="demo">
    <SecItem n={1}>Quatre secteurs, douze usages</SecItem>
    <SecItem n={2}>Des réussites documentées</SecItem>
    <SecItem n={3}>Démonstrations : agent conversationnel et lecture de documents</SecItem>
    <SecItem n={4}>Le Programme IA de la Mutuelle</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── M2 · Four sectors ──────────────────────────────────────────────────────
const M2Use = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', fontSize: 25, lineHeight: 1.35, color: C.ink }}>
    <span style={{ flex: 'none', width: 11, height: 11, background: C.blue, transform: 'translateY(-3px)' }} />
    <span>{children}</span>
  </div>
);

const M2Sector = ({ n, icon, tone, name, ph, pos, children, watch }: { n: number; icon: IconName; tone: Tone; name: string; ph: PhotoId; pos?: string; children: ReactNode; watch: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', height: 360, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, overflow: 'hidden' }}>
    <Photo id={ph} w={240} h={360} radius={0} pos={pos} />
    <div style={{ flex: 1, boxSizing: 'border-box', padding: '26px 26px 22px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: T.coral.bg, borderRadius: 10, padding: '8px 14px', fontSize: 22, color: T.coral.fg, fontWeight: 600 }}>
        <Icon name="alert" size={24} />
        {watch}
      </div>
    </div>
  </div>
);

const M2_Sectors: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Quatre secteurs, douze usages déjà courants</Title>
    <div style={{ position: 'absolute', left: 120, top: 206, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 24, columnGap: 30 }}>
      <M2Sector n={1} icon="users" tone="green" ph="entrevue" pos="70% 50%" name="Ressources humaines" watch="Vigilance : biais dans le tri des CV">
        <M2Use>Rédiger des offres d’emploi inclusives</M2Use>
        <M2Use>Présélectionner des candidatures</M2Use>
        <M2Use>Répondre aux questions des employés</M2Use>
      </M2Sector>
      <M2Sector n={2} icon="stethoscope" tone="teal" ph="radiologie" pos="60% 50%" name="Santé" watch="Vigilance : données sensibles">
        <M2Use>Aider au diagnostic en imagerie</M2Use>
        <M2Use>Résumer les notes cliniques</M2Use>
        <M2Use>Prévoir l’achalandage des urgences</M2Use>
      </M2Sector>
      <M2Sector n={3} icon="money" tone="blue" ph="paiement" name="Finance et assurance" watch="Vigilance : pouvoir expliquer un refus">
        <M2Use>Détecter la fraude en temps réel</M2Use>
        <M2Use>Évaluer un risque de crédit</M2Use>
        <M2Use>Lire factures, contrats et formulaires</M2Use>
      </M2Sector>
      <M2Sector n={4} icon="megaphone" tone="yellow" ph="timesSquare" name="Marketing" watch="Vigilance : profilage et consentement">
        <M2Use>Recommander le bon produit</M2Use>
        <M2Use>Créer textes et visuels de campagne</M2Use>
        <M2Use>Analyser les avis et les commentaires</M2Use>
      </M2Sector>
    </div>
  </Frame>
);

// ─── M2 · Documented successes ──────────────────────────────────────────────
const M2Case = ({ d, icon, tone, tag, title, ph, pos, children, src }: { d: number; icon: IconName; tone: Tone; tag: string; title: string; ph: PhotoId; pos?: string; children: ReactNode; src: string }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 570, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Photo id={ph} w="100%" h={190} radius={0} pos={pos}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 7, background: STRONG[tone] }} />
        <div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconTile name={icon} tone={tone} size={44} solid />
          <Tag tone={tone} size={20} style={{ background: '#fff' }}>
            {tag}
          </Tag>
        </div>
      </Photo>
      <div style={{ flex: 1, padding: '18px 24px 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', fontSize: 19, lineHeight: 1.35, color: C.muted }}>{src}</div>
      </div>
    </div>
  </div>
);

const M2_Cases: Page = () => (
  <Frame mod={2} kind="cas">
    <Title>Quatre réussites documentées</Title>
    <Lede>Des gains réels, mesurés… et à chaque fois, une question à se poser.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 397px)', columnGap: 30 }}>
      <M2Case d={100} icon="eye" tone="teal" tag="Santé · 2018" title="Lire un fond d’œil" ph="fondOeil" src="Autorisation de la FDA, avril 2018 (IDx-DR)">
        Premier système autorisé aux États-Unis à détecter la rétinopathie diabétique sans qu’un spécialiste lise l’image.
      </M2Case>
      <M2Case d={220} icon="sparkles" tone="violet" tag="Science · 2024" title="Prédire les protéines" ph="proteine" src="Prix Nobel de chimie 2024 (AlphaFold)">
        AlphaFold prédit la forme de centaines de millions de protéines. Ses créateurs reçoivent le prix Nobel.
      </M2Case>
      <M2Case d={340} icon="shield" tone="blue" tag="Finance · 2023" title="Bloquer la fraude" ph="datacenter" src="Visa, communiqué de juillet 2024">
        Selon Visa, son IA a aidé à bloquer environ 40 milliards de dollars américains de fraude en un an.
      </M2Case>
      <M2Case d={460} icon="play" tone="yellow" tag="Marketing · 2015" title="Recommander" ph="achat" src="Gomez-Uribe et Hunt, ACM, 2015">
        Chez Netflix, environ 80 % des heures visionnées viennent des recommandations personnalisées.
      </M2Case>
    </div>
    <Callout cls={A.in} title="Le revers de chaque réussite" tone="violet" icon="scale" size={26} style={{ position: 'absolute', left: 120, top: 870, width: 1680, padding: '14px 26px', ...dl(700) }}>
      Qui vérifie l’erreur du système ? Qui a donné ses données ? Qui peut contester ? Ce sera notre après-midi.
    </Callout>
  </Frame>
);

// ─── M2 · Demo: a member-service chatbot ────────────────────────────────────
const M2Msg = ({ who, tone, label, cls, children }: { who: 'user' | 'agent'; tone?: Tone; label?: string; cls?: string; children: ReactNode }) => {
  const right = who === 'user';
  const bg = right ? C.card : tone ? T[tone].bg : T.blue.bg;
  return (
    <div className={cls} style={{ display: 'flex', flexDirection: right ? 'row-reverse' : 'row', gap: 16, alignItems: 'flex-start' }}>
      <Avatar who={who} size={52} />
      <div style={{ maxWidth: 760, background: bg, borderRadius: right ? '20px 6px 20px 20px' : '6px 20px 20px 20px', boxShadow: tone ? `inset 0 0 0 2.5px ${STRONG[tone]}` : SHADOW_SM, padding: '12px 22px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        {label ? (
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase', color: tone ? T[tone].fg : C.muted, marginBottom: 2 }}>{label}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

const M2Watch = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.fade(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 25, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_DemoChat: Page = () => (
  <Frame mod={2} kind="demo" beats={4}>
    <Title>Démo · « Léa », l’agent conversationnel de la Mutuelle</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1080, height: 720, boxSizing: 'border-box', background: C.panel, borderRadius: 18, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(100) }}>
      <M2Msg who="user">Bonjour, comment je fais une demande de prestations d’invalidité ?</M2Msg>
      <M2Msg who="agent" label="Léa" cls={b.on(1)}>
        Bonjour ! Remplissez le formulaire dans votre Espace membre, avec la déclaration de votre médecin. Voulez-vous le lien ?
      </M2Msg>
      <M2Msg who="user" cls={b.on(2)}>
        Mon médecin parle d’épuisement professionnel. Ça va être accepté ?
      </M2Msg>
      <M2Msg who="agent" tone="coral" label="Réponse A · risquée" cls={b.on(3)}>
        Oui, ce type de dossier est généralement accepté. Vous devriez recevoir vos prestations sous 2 semaines !
      </M2Msg>
      <M2Msg who="agent" tone="green" label="Réponse B · responsable" cls={b.on(4)}>
        Je ne peux pas me prononcer sur votre dossier : une conseillère l’évaluera. Voulez-vous lui parler ?
      </M2Msg>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 210, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow cls={A.in} c={C.blue} style={dl(200)}>
        Ce qu’on observe
      </Eyebrow>
      <M2Watch n={1} icon="smile" tone="blue" title="Le ton">
        Fluide, poli, disponible jour et nuit.
      </M2Watch>
      <M2Watch n={2} icon="heart" tone="violet" title="Des données de santé">
        Le membre confie un diagnostic sans y penser.
      </M2Watch>
      <M2Watch n={3} icon="alert" tone="coral" title="Une promesse inventée">
        Accord et délai : rien ne les fonde.
      </M2Watch>
      <M2Watch n={4} icon="humanCheck" tone="green" title="Une limite assumée">
        Elle sait dire « je ne sais pas » et passer la main.
      </M2Watch>
    </div>
  </Frame>
);

// ─── M2 · Demo: reading a scanned form ──────────────────────────────────────
const M2Field = ({ n, label, value, tone, cls }: { n: number; label: string; value: string; tone: Tone; cls?: string }) => (
  <div className={cls} style={{ position: 'relative', height: 74, borderBottom: `2px solid ${C.rule}`, display: 'flex', alignItems: 'flex-end', paddingBottom: 6 }}>
    <span style={{ position: 'absolute', left: 0, top: 4, fontSize: 19, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontFamily: '"Segoe Script", "Comic Sans MS", cursive', fontSize: 30, color: '#1F3A93' }}>{value}</span>
    <span className={b.pop(n)} style={{ position: 'absolute', inset: '-6px -10px', borderRadius: 8, boxShadow: `0 0 0 3px ${STRONG[tone]}`, background: mix(STRONG[tone], 8, 'transparent') }} />
  </div>
);

const M2Out = ({ n, k: key, v, p, tone }: { n: number; k: string; v: string; p: number; tone: Tone }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 66, borderTop: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 190, fontFamily: mono, fontSize: 22, color: C.muted }}>{key}</span>
    <span style={{ flex: 1, fontWeight: 600, fontSize: 25, color: C.ink }}>{v}</span>
    <Tag tone={tone} size={21}>
      {p} %
    </Tag>
  </div>
);

const M2_DemoVision: Page = () => (
  <Frame mod={2} kind="demo" beats={5}>
    <Title>Démo · Lire un formulaire manuscrit numérisé</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 210, width: 780, height: 720, boxSizing: 'border-box', background: '#FFFEF8', borderRadius: 6, boxShadow: '0 30px 60px -30px rgba(20,60,100,.55), 0 0 0 1px rgba(0,0,0,.06)', padding: '30px 40px', transform: 'rotate(-0.8deg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name="leaf" tone="teal" size={48} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>Mutuelle des Érables</div>
          <div style={{ fontSize: 20, color: C.muted }}>Demande de remboursement · soins de santé</div>
        </div>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M2Field n={1} label="Nom du membre" value="Gabrielle Tremblay" tone="blue" />
        <M2Field n={2} label="Numéro de certificat" value="ME-48 213 07" tone="blue" />
        <M2Field n={3} label="Type de soin" value="Physiothérapie" tone="blue" />
        <M2Field n={4} label="Montant réclamé" value="85,00 $" tone="blue" />
        <M2Field n={5} label="Signature" value="G. Tremblay" tone="coral" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 210, width: 840 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 30px 10px', ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Icon name="scan" size={30} color={C.blue} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>Ce que le modèle extrait</span>
          <span style={{ marginLeft: 'auto', fontSize: 21, color: C.muted }}>confiance</span>
        </div>
        <M2Out n={1} k="membre" v="Gabrielle Tremblay" p={98} tone="green" />
        <M2Out n={2} k="certificat" v="ME-48 213 07" p={95} tone="green" />
        <M2Out n={3} k="soin" v="Physiothérapie" p={97} tone="green" />
        <M2Out n={4} k="montant" v="85,00 $" p={91} tone="green" />
        <M2Out n={5} k="signature" v="présente ?" p={54} tone="coral" />
      </div>
      <Callout cls={b.on(5)} title="Seuil de confiance" tone="yellow" icon="humanCheck" size={25} style={{ marginTop: 22, ...dl(300) }}>
        Sous 80 %, le dossier part vers une personne. La machine trie, l’humain tranche.
      </Callout>
    </div>
  </Frame>
);

// ─── M2 · Comparing free AI assistants ──────────────────────────────────────
const M2ToolRow = ({ d, id, plus, minus, check }: { d: number; id: AppId; plus: string; minus: string; check: string }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', alignItems: 'center', columnGap: 24, minHeight: 92, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <AppChip id={id} size={26} />
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.35, color: C.ink }}>
      <Icon name="check" size={24} color={C.green} sw={3} style={{ marginTop: 3 }} />
      <span>{plus}</span>
    </div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.35, color: C.ink }}>
      <Icon name="x" size={24} color={C.coral} sw={3} style={{ marginTop: 3 }} />
      <span>{minus}</span>
    </div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.35, color: T.violet.fg }}>
      <Icon name="search" size={24} style={{ marginTop: 3 }} />
      <span>{check}</span>
    </div>
  </div>
);

const M2_Tools: Page = () => (
  <Frame mod={2}>
    <Title>Quel assistant gratuit choisir ? Avantages et limites</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '6px 30px 4px', ...dl(100) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', columnGap: 24, height: 54, alignItems: 'center' }}>
        <span />
        <Eyebrow c={T.green.fg} size={21}>
          Points forts
        </Eyebrow>
        <Eyebrow c={T.coral.fg} size={21}>
          Limites
        </Eyebrow>
        <Eyebrow c={T.violet.fg} size={21}>
          À vérifier
        </Eyebrow>
      </div>
      <M2ToolRow d={150} id="chatgpt" plus="Polyvalent : texte, images, voix, recherche Web" minus="Peut inventer des sources ; quotas en version gratuite" check="Le réglage qui utilise vos échanges pour l’entraînement" />
      <M2ToolRow d={230} id="copilot" plus="Recherche Web avec sources citées ; compte Microsoft gratuit" minus="Moins de réglages fins que les versions payantes" check="Version grand public ≠ Copilot d’entreprise protégé" />
      <M2ToolRow d={310} id="gemini" plus="Recherche Google, images, lien avec Gmail et Docs" minus="Mêle parfois sources et suppositions" check="Des réviseurs humains peuvent lire des échanges (selon Google)" />
      <M2ToolRow d={390} id="claude" plus="Rédaction nuancée, longs documents, analyse" minus="Ne crée pas d’images ; quota quotidien" check="Le choix d’entraînement sur vos conversations" />
      <M2ToolRow d={470} id="mistral" plus="Société européenne, rapide, à l’aise en français" minus="Écosystème plus restreint" check="Les conditions de la version gratuite" />
      <M2ToolRow d={550} id="perplexity" plus="Moteur de réponse : cite ses sources à chaque réponse" minus="Moins à l’aise pour rédiger longuement" check="Une source citée reste à ouvrir et à lire" />
    </div>
    <Callout cls={A.in} title="La règle, quel que soit l’outil" tone="yellow" icon="lock" size={25} style={{ position: 'absolute', left: 120, top: 880, width: 1680, padding: '12px 26px', ...dl(700) }}>
      Version gratuite = aucune donnée personnelle ni confidentielle. Comparatif indicatif, novembre 2026 : les offres changent souvent.
    </Callout>
  </Frame>
);

// ─── M2 · The Mutuelle's AI programme ───────────────────────────────────────
const M2Proj = ({ n, code, icon, tone, title, who, tech, gain, q }: { n: number; code: string; icon: IconName; tone: Tone; title: string; who: CastId; tech: string; gain: string; q: string }) => (
  <div className={A.in} style={{ ...dl(n * 120) }}>
    <div style={{ boxSizing: 'border-box', height: 640, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <Tag tone={tone} size={22}>
          {code}
        </Tag>
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 14 }}>
        <Who id={who} size={22} sub={false} />
      </div>
      <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.4, color: C.muted }}>{tech}</div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Gain espéré :</b> {gain}
      </div>
      <div className={b.on(n)} style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start', background: T.violet.bg, borderRadius: 12, padding: '12px 16px', fontSize: 23, lineHeight: 1.35, color: T.violet.fg, fontWeight: 600 }}>
        <Icon name="scale" size={26} style={{ marginTop: 2 }} />
        <span>{q}</span>
      </div>
    </div>
  </div>
);

const M2_Programme: Page = () => (
  <Frame mod={2} kind="cas" beats={4} label="Module 02 · Fil rouge">
    <Title>Le Programme IA de la Mutuelle : quatre projets</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 397px)', columnGap: 30 }}>
      <M2Proj n={1} code="P1" icon="chat" tone="blue" title="Léa, l’agent conversationnel" who="vincent" tech="IA générative" gain="répondre 24 h sur 24 aux questions simples" q="Peut-elle promettre ? Le membre sait-il qu’il parle à une IA ?" />
      <M2Proj n={2} code="P2" icon="users" tone="green" title="Le tri des candidatures" who="samir" tech="Machine learning sur 10 ans d’embauches" gain="passer de 4 000 CV à 400" q="Le modèle reproduit-il les choix du passé ?" />
      <M2Proj n={3} code="P3" icon="shield" tone="teal" title="Le score de risque de fraude" who="mei" tech="Analyse prédictive sur les réclamations" gain="cibler les contrôles" q="Peut-on expliquer le score à un membre soupçonné ?" />
      <M2Proj n={4} code="P4" icon="megaphone" tone="yellow" title="Les campagnes personnalisées" who="vincent" tech="Prédiction et génération de contenus" gain="la bonne offre au bon membre" q="Les membres ont-ils consenti à ce profilage ?" />
    </div>
  </Frame>
);

// ─── M2 · QCM & synthesis ───────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Qui répond de l’agent conversationnel ?"
    q="Léa écrit à un membre : « Votre dossier sera accepté. » Il est refusé. Qui est responsable de cette promesse ?"
    explain="L’organisation qui met un agent conversationnel en ligne répond de ce qu’il dit, comme d’une page de son site. Un tribunal l’a confirmé en 2024 (Air Canada) : on y revient au module 7."
  >
    <Opt ok why="Oui : pour le membre, Léa parle au nom de la Mutuelle. La Mutuelle répond de ses réponses, comme de son site web.">
      La Mutuelle, qui a mis Léa en ligne
    </Opt>
    <Opt why="Piège ! Le fournisseur du modèle a pu commettre une faute envers la Mutuelle, mais face au membre, c’est la Mutuelle qui s’est engagée.">
      Le fournisseur du modèle d’IA
    </Opt>
    <Opt why="Piège ! On ne peut pas reprocher au membre d’avoir cru l’outil officiel de sa mutuelle.">Le membre, qui aurait dû vérifier ailleurs</Opt>
    <Opt why="Piège ! « C’est la machine » n’est pas une défense : quelqu’un l’a choisie, configurée et publiée.">Personne : c’est une erreur de la machine</Opt>
  </QcmPage>
);

const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Repérez un usage de l’IA dans votre secteur.
        <br />
        <br />
        Posez-vous la question du jour : qu’est-ce que ça change pour la confiance des personnes concernées ?
      </>
    }
  >
    <SynthRow n={1} tone="green" d={100}>
      L’IA est déjà présente dans <b>tous les secteurs</b>, souvent sans bruit.
    </SynthRow>
    <SynthRow n={2} tone="blue" d={220}>
      Les gains sont <b>réels et mesurés</b> : diagnostic, fraude, recommandation.
    </SynthRow>
    <SynthRow n={3} tone="coral" d={340}>
      Un agent conversationnel peut <b>promettre ce qu’il ne sait pas</b>.
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={460}>
      Sous un seuil de confiance, <b>l’humain tranche</b>.
    </SynthRow>
    <SynthRow n={5} tone="violet" d={580}>
      Chaque projet d’IA pose <b>une question éthique</b> dès le départ.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M2_Divider, M2_Sectors, M2_Cases, M2_DemoChat, M2_DemoVision, M2_Tools, M2_Programme, M2_Qcm, M2_Synth];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 10 h 05)

OBJECTIF — Passer de la théorie aux usages réels.

DIRE — « Module 2 : les applications concrètes. Quatre secteurs, ceux du programme : RH, santé, finance, marketing. Des réussites documentées. Deux démonstrations. Et les quatre projets d'IA de la Mutuelle des Érables, qui vont nous servir tout l'après-midi. »

RYTHME — Environ 30 minutes, puis la pause.

TRANSITION — « Faisons le tour des secteurs. »`,
  `⏱ 5 min · QUATRE SECTEURS (4 clics)

OBJECTIF — Identifier des cas d'usage concrets dans différents secteurs (objectif officiel n° 2).

DIRE — Un secteur par clic. Pour chacun, lisez les trois usages, puis la vigilance en rouge : c'est le fil qu'on tirera cet après-midi.
→ beat 1 : RH. « Rédiger des offres d'emploi inclusives, présélectionner des candidatures, répondre aux questions des employés. Vigilance : les biais dans le tri. »
→ beat 2 : Santé. « Aide au diagnostic en imagerie, transcription des notes cliniques, prévision de l'achalandage des urgences. Vigilance : des données parmi les plus sensibles, et la décision reste médicale. »
→ beat 3 : Finance et assurance. « Fraude en temps réel, risque de crédit ou d'assurance, lecture de documents. Vigilance : pouvoir expliquer un refus. »
→ beat 4 : Marketing. « Recommandation, création de contenus, analyse des avis. Vigilance : le profilage et le consentement. »

INTERACTION — Reprenez les secteurs notés au tour de table : « Vous qui êtes en santé : lequel de ces usages existe chez vous ? » Une ou deux réponses au micro.

TRANSITION — « Des promesses ? Non : des résultats documentés. »`,
  `⏱ 4 min · QUATRE RÉUSSITES DOCUMENTÉES

OBJECTIF — Montrer que les gains sont réels, avec des sources, avant d'aborder les risques.

DIRE —
• « Santé, 2018 : la FDA, l'agence américaine du médicament, autorise IDx-DR, premier système d'IA qui détecte la rétinopathie diabétique, une maladie de l'œil, sans qu'un spécialiste lise l'image. Ça permet le dépistage en pharmacie ou en clinique de première ligne. »
• « Science, 2024 : le prix Nobel de chimie récompense notamment Demis Hassabis et John Jumper pour AlphaFold, qui prédit la forme des protéines. Des années de laboratoire gagnées pour la recherche de médicaments. »
• « Finance : selon Visa, son IA a aidé à bloquer environ 40 milliards de dollars américains de fraude sur un an (annonce de juillet 2024). »
• « Marketing : chez Netflix, environ 80 % des heures visionnées viennent des recommandations, selon un article de deux de ses dirigeants paru en 2015. »

LE REVERS — Lisez l'encadré : « Qui vérifie l'erreur ? Qui a donné ses données ? Qui peut contester ? »

À VÉRIFIER — Les chiffres d'entreprises (Visa, Netflix) sont déclaratifs : présentez-les comme tels.

TRANSITION — « Place aux démonstrations. »`,
  `⏱ 5 min · DÉMO : AGENT CONVERSATIONNEL (4 clics)

OBJECTIF — Montrer ce qu'un agent conversationnel fait bien… et où il dérape.

DIRE — « Voici Léa, l'agent conversationnel que Vincent veut lancer. Un membre demande comment faire une demande de prestations d'invalidité. »
→ beat 1 : « Réponse claire, polie, utile. 24 heures sur 24. »
→ beat 2 : « Le membre ajoute : "Mon médecin parle d'épuisement professionnel." Il vient de confier une donnée de santé, sans y penser. »
→ beat 3 : « Réponse A : "Oui, c'est généralement accepté, vous recevrez vos prestations sous 2 semaines." Rien ne fonde cet accord ni ce délai. C'est le mot suivant le plus probable, comme ce matin. »
→ beat 4 : « Réponse B : "Je ne peux pas me prononcer, une conseillère l'évaluera." Moins séduisante, mais responsable. »

DÉMO EN DIRECT (si le temps le permet, 2 min) — Partagez votre écran sur ChatGPT, Copilot ou Gemini et collez :
« Tu es Léa, l'agent conversationnel de la Mutuelle des Érables, une mutuelle d'assurance de personnes au Québec. Un membre écrit : "Mon médecin parle d'épuisement professionnel. Mon dossier d'invalidité va être accepté ?" Réponds-lui. »
Observez à voix haute avec le groupe : promet-il ? invente-t-il un délai ? renvoie-t-il vers un humain ? Puis ajoutez : « Ne promets jamais un résultat ; propose toujours un humain. » et relancez. Le cadrage change la réponse : c'est déjà de la gouvernance.

TRANSITION — « Deuxième démo : la vision par ordinateur. »`,
  `⏱ 5 min · DÉMO : LECTURE D'UN FORMULAIRE (5 clics)

OBJECTIF — Illustrer la reconnaissance d'image appliquée à un document, et la notion de seuil de confiance.

DIRE — « Un formulaire de remboursement, rempli à la main et numérisé. Un modèle de deep learning le lit. »
→ beats 1 à 4 : nom, numéro de certificat, type de soin, montant. « À chaque champ, le modèle donne une confiance : 98 %, 95 %, 97 %, 91 %. »
→ beat 5 : « La signature : 54 %. Le modèle hésite. Bonne pratique : sous un seuil, par exemple 80 %, le dossier part vers une personne. La machine trie, l'humain tranche. »

DÉMO EN DIRECT (optionnelle, 2 min) — Dans Copilot, ChatGPT ou Gemini, déposez une photo SANS donnée personnelle (une affiche, un reçu fictif, une photo de votre bureau) et demandez : « Décris cette image et extrais le texte que tu y lis. » Montrez ce qu'il lit bien et ce qu'il devine.

RAPPEL — Le formulaire et le membre sont fictifs. Ne déposez jamais un vrai formulaire dans un outil public.

TRANSITION — « Toutes ces démonstrations, vous pouvez les refaire avec des outils gratuits. Lesquels choisir ? »`,
  `⏱ 5 min · COMPARER LES ASSISTANTS GRATUITS

OBJECTIF — Comparer les outils d'IA, leurs avantages et leurs inconvénients (demande de l'APSM, utile à tous). Préparer l'atelier 1, où chacun choisit un outil gratuit.

DIRE — Une ligne par outil, sans entrer dans le détail technique :
• ChatGPT : le plus polyvalent (texte, images, voix, recherche Web). Il peut inventer des sources ; la version gratuite a des quotas. À vérifier : le réglage qui permet d'utiliser vos échanges pour améliorer les modèles (désactivable dans les paramètres).
• Copilot (version grand public) : la recherche Web avec sources citées, gratuite avec un compte Microsoft. Attention : ce n'est pas Microsoft 365 Copilot, la version d'entreprise avec protection des données de l'organisation.
• Gemini : la recherche Google, les images, le lien avec Gmail et Docs. Google indique que des réviseurs humains peuvent lire certaines conversations : rien de confidentiel.
• Claude : très bon en rédaction nuancée et sur de longs documents ; ne crée pas d'images ; quota quotidien en gratuit. Un choix d'entraînement existe dans les réglages.
• Le Chat (Mistral AI) : une entreprise française, donc européenne ; rapide et à l'aise en français.
• Perplexity : un moteur de réponse qui cite ses sources à chaque réponse. Excellent pour vérifier… à condition d'ouvrir les sources.

MESSAGE CLÉ — « Il n'y a pas de meilleur outil dans l'absolu : il y a le bon outil pour la tâche. Et pour vérifier une information, celui qui cite ses sources. La règle ne change pas : en version gratuite, aucune donnée personnelle ni confidentielle. »

APSM — Aucun outil sous licence d'entreprise n'est choisi : tous les ateliers se font en version gratuite. Insistez sur la vérification (priorité du cadrage) : Copilot et Perplexity citent leurs sources, ce qui facilite le contrôle.

À VÉRIFIER — Les offres gratuites, les quotas et les réglages changent souvent : vérifiez-les la veille de chaque session. Les mentions de la colonne « À vérifier » sont des pistes, pas des garanties.

TRANSITION — « Ces outils, la Mutuelle veut les utiliser. Voici ses quatre projets. »`,
  `⏱ 4 min · LE PROGRAMME IA DE LA MUTUELLE (4 clics)

OBJECTIF — Poser les quatre projets du fil rouge, chacun avec sa question éthique. On les retrouvera tout l'après-midi.

DIRE — Présentez les quatre cartes (elles apparaissent seules), puis un clic par question éthique :
→ beat 1 : P1, Léa, portée par Vincent. « Peut-elle promettre ? Le membre sait-il qu'il parle à une IA ? »
→ beat 2 : P2, le tri des candidatures de Samir, entraîné sur 10 ans d'embauches. « Le modèle reproduit-il les choix du passé ? »
→ beat 3 : P3, le score de risque de fraude de Mei. « Peut-on expliquer le score à un membre soupçonné ? »
→ beat 4 : P4, les campagnes personnalisées. « Les membres ont-ils consenti à ce profilage ? »

INTERACTION — « Lequel de ces quatre projets vous inquiète le plus ? Répondez P1, P2, P3 ou P4. » Écoutez trois réponses ; gardez-les en tête pour l'atelier 2 et la charte.

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 3 min · QCM 2

ANIMATION — Votes à voix haute (A à D). Cliquez l'option majoritaire, puis → pour la réponse et → pour l'essentiel.

RÉPONSE — A : la Mutuelle.
• B ✗ PIÈGE — Le fournisseur peut avoir des comptes à rendre à la Mutuelle (contrat), mais face au membre, c'est la Mutuelle qui s'est engagée.
• C ✗ PIÈGE — Le membre a cru l'outil officiel de sa mutuelle : c'est raisonnable.
• D ✗ PIÈGE — « C'est la machine » n'est pas une défense.

À ANNONCER — Un vrai tribunal a tranché exactement cette question en 2024 : Air Canada. On le verra au module 7, sur la gouvernance.

TRANSITION — « Bilan du module 2, puis la pause. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 2 (puis PAUSE, ≈ 10 h 35)

DIRE — Relisez les cinq points :
1. L'IA est déjà dans tous les secteurs.
2. Les gains sont réels et mesurés.
3. Un agent conversationnel peut promettre ce qu'il ne sait pas.
4. Sous un seuil de confiance, l'humain tranche.
5. Chaque projet pose une question éthique dès le départ.

À VOTRE POSTE — Un usage de l'IA dans votre secteur, et ce qu'il change pour la confiance.

PAUSE — Annoncez 15 minutes. « Au retour, c'est vous qui manipulez : atelier 1. Gardez votre assistant d'IA ouvert. »`,
];
// @@NOTES-END
