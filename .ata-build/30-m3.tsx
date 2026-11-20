// ═══ Module 3 · Les outils d’automatisation ═════════════════════════════════

const M3_Section: Page = () => (
  <Section n={3} title="Les outils d’automatisation" sub="Quatre familles d’outils, un même vocabulaire, et votre poste prêt pour demain." dur="50 min">
    <SecItem n={1}>Les familles d’outils et comment ils se connectent</SecItem>
    <SecItem n={2}>Make, Zapier, n8n, Power Automate : lequel choisir ?</SecItem>
    <SecItem n={3}>Prise en main de Make et préparation des comptes</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Families ───────────────────────────────────────────────────────────────
const M3Fam = ({ tone, icon, title, apps, d, children }: { tone: Tone; icon: IconName; title: string; apps: AppId[]; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '28px 26px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={72} />
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {apps.map((a) => (
        <AppChip key={a} id={a} size={21} />
      ))}
    </div>
  </div>
);

const M3_Familles: Page = () => (
  <Frame mod={3}>
    <Title>Quatre familles d’outils</Title>
    <Lede>Elles ne se font pas concurrence : elles se complètent, et se combinent souvent dans un même processus.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
      <M3Fam d={100} tone="violet" icon="puzzle" title="Plateformes sans code" apps={['make', 'zapier', 'n8n']}>
        Relient des applications en ligne par leurs connecteurs. Notre outil principal.
      </M3Fam>
      <M3Fam d={220} tone="blue" icon="layers" title="Automatisation des suites" apps={['automate', 'outlook', 'sheets']}>
        Intégrée à Microsoft 365 ou à Google Workspace : pratique si vous y vivez déjà.
      </M3Fam>
      <M3Fam d={340} tone="teal" icon="bot" title="RPA : robots logiciels" apps={['pad', 'uipath']}>
        Un robot reproduit vos clics et vos frappes à l’écran, même sans connecteur.
      </M3Fam>
      <M3Fam d={460} tone="coral" icon="sparkles" title="Assistants et agents IA" apps={['copilot', 'gemini', 'chatgpt']}>
        Comprennent, rédigent, classent. Certains enchaînent déjà des actions seuls.
      </M3Fam>
    </div>
  </Frame>
);

// ─── How a connector works ──────────────────────────────────────────────────
const M3_Connecteur: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Comment une plateforme relie deux applications</Title>
    <Lede>Pas de magie : chaque application ouvre une porte, l’API. Le connecteur sait y frapper à votre place.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M520 520 H860" stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
      <path d="M1060 520 H1400" stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
      <FlowDot path="M520 520 H860" dur={2} color={C.blue} r={9} />
      <FlowDot path="M1060 520 H1400" dur={2} begin={1} color={C.green} r={9} />
    </svg>
    <div className={A.in} style={{ position: 'absolute', left: 220, top: 400, width: 300, textAlign: 'center' }}>
      <AppTile id="gmail" size={150} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32 }}>Application A</div>
      <div style={{ fontSize: 22, color: C.muted }}>« un nouveau courriel »</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 860, top: 400, width: 200, textAlign: 'center', ...dl(300) }}>
      <AppTile id="make" size={150} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32 }}>Plateforme</div>
      <div style={{ fontSize: 22, color: C.muted }}>applique vos règles</div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1400, top: 400, width: 300, textAlign: 'center', ...dl(500) }}>
      <AppTile id="sheets" size={150} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32 }}>Application B</div>
      <div style={{ fontSize: 22, color: C.muted }}>« ajouter une ligne »</div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <Card tone="blue" icon="key" title="1 · Connexion" size={23} cls={b.on(1)}>
        Vous autorisez une fois la plateforme à agir en votre nom (compte, ou clé d’API).
      </Card>
      <Card tone="yellow" icon="clock" title="2 · Vérification ou signal" size={23} cls={b.on(2)}>
        La plateforme <b>vérifie</b> toutes les X minutes, ou l’application l’<b>avertit</b> à l’instant (webhook).
      </Card>
      <Card tone="green" icon="send" title="3 · Action" size={23} cls={b.on(3)}>
        Elle lit ou écrit les données, puis passe à l’étape suivante.
      </Card>
    </div>
  </Frame>
);

// ─── Panorama (perishable: free offers) ─────────────────────────────────────
const M3_TOOLS: { id: AppId; who: string; plus: string[]; free: string; minus: string }[] = [
  {
    id: 'make',
    who: 'Workflows visuels à plusieurs étapes, avec conditions et IA',
    plus: ['Éditeur visuel très lisible', 'Routeurs, filtres, gestion d’erreurs', 'Modules IA prêts à l’emploi (Gemini, OpenAI…)'],
    free: '1 000 crédits par mois · 2 scénarios actifs · exécution au plus toutes les 15 min',
    minus: 'Chaque module exécuté consomme des crédits : on teste avec parcimonie.',
  },
  {
    id: 'zapier',
    who: 'Automatisations simples et rapides, catalogue d’applications immense',
    plus: ['Le plus simple à prendre en main', 'Des milliers d’applications', 'Assistant IA pour construire'],
    free: '100 tâches par mois · Zaps à 2 étapes (un déclencheur, une action)',
    minus: 'Le multi-étapes et les conditions demandent une offre payante.',
  },
  {
    id: 'n8n',
    who: 'Équipes techniques qui veulent garder la main sur leurs données',
    plus: ['Code source ouvert, très puissant', 'Hébergeable chez soi (données internes)', 'Nœuds IA et agents avancés'],
    free: 'Gratuit en auto-hébergement (Community Edition) · version infonuagique payante après un essai',
    minus: 'L’auto-hébergement demande un serveur et des compétences techniques.',
  },
  {
    id: 'automate',
    who: 'Organisations sous Microsoft 365 (Outlook, Teams, SharePoint)',
    plus: ['Intégré à Microsoft 365', 'Approbations Teams, SharePoint, Excel', 'Volet RPA avec Power Automate Desktop'],
    free: 'Flux infonuagiques inclus dans la plupart des licences Microsoft 365 · connecteurs Premium et AI Builder payants',
    minus: 'Sans licence Microsoft 365, l’accès est limité : vérifiez avec votre service informatique.',
  },
  {
    id: 'pad',
    who: 'Robots sur votre poste Windows : logiciels sans connecteur, fichiers, Excel',
    plus: ['Gratuit pour Windows 10 et 11', 'Enregistreur d’actions', 'Excel, fichiers, navigateur, applications'],
    free: 'Gratuit en mode « assisté » : le robot tourne quand vous le lancez, sur votre poste',
    minus: 'Robots planifiés et sans surveillance : licence payante.',
  },
];

const M3_Panorama: Page = () => (
  <Frame mod={3}>
    <Title>Cinq outils, cinq profils</Title>
    <Tabs initial="make" cls={A.in} style={{ position: 'absolute', left: 120, top: 196, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {M3_TOOLS.map((t) => (
          <TabBtn key={t.id} id={t.id} app={t.id}>
            {APPS[t.id].short}
          </TabBtn>
        ))}
      </div>
      {M3_TOOLS.map((t) => (
        <TabPane key={t.id} id={t.id}>
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '28px 32px', height: 560, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <AppTile id={t.id} size={90} />
                <div style={{ fontFamily: display, fontWeight: 700, fontSize: 50, color: C.ink }}>{APPS[t.id].name}</div>
              </div>
              <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.4, color: C.soft }}>
                <b style={{ color: C.ink }}>Pour qui :</b> {t.who}
              </div>
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {t.plus.map((p) => (
                  <Bullet key={p} tone="green" size={25}>
                    {p}
                  </Bullet>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Callout title="Offre gratuite" tone="green" icon="money" size={26}>
                {t.free}
              </Callout>
              <Callout title="À savoir" tone="coral" icon="alert" size={26}>
                {t.minus}
              </Callout>
            </div>
          </div>
        </TabPane>
      ))}
    </Tabs>
    <Verified style={{ position: 'absolute', left: 120, top: 905 }} />
  </Frame>
);

// ─── Rosetta: same ideas, different words ───────────────────────────────────
const M3_Vocab: Page = () => (
  <Frame mod={3}>
    <Title>Mêmes idées, mots différents</Title>
    <Lede>Apprenez les concepts une fois : vous les retrouverez dans tous les outils.</Lede>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}
      cols="330px repeat(4, 1fr)"
      size={23}
      head={[
        'Concept',
        <AppChip key="m" id="make" size={20} />,
        <AppChip key="z" id="zapier" size={20} />,
        <AppChip key="n" id="n8n" size={20} />,
        <AppChip key="p" id="automate" size={20} />,
      ]}
      rows={[
        ['L’automatisation', 'Scénario', 'Zap', 'Workflow', 'Flux (flow)'],
        ['Ce qui la démarre', 'Module déclencheur', 'Trigger', 'Nœud Trigger', 'Déclencheur'],
        ['Une étape', 'Module', 'Action', 'Nœud', 'Action'],
        ['Les conditions', 'Filtre, routeur', 'Filter, Paths', 'IF, Switch', 'Condition, Switch'],
        ['Ce qu’on paie', 'Crédits', 'Tâches', 'Exécutions', 'Licences, exécutions'],
        ['L’historique', 'History', 'Zap history', 'Executions', 'Historique d’exécution'],
      ]}
    />
  </Frame>
);

// ─── Which tool? (interactive) ──────────────────────────────────────────────
const M3_Choisir: Page = () => {
  const [screen, setScreen] = useState(false);
  const [m365, setM365] = useState(false);
  const [it, setIt] = useState(false);
  const [simple, setSimple] = useState(false);
  const pick: { id: AppId; why: string } = screen
    ? { id: 'pad', why: 'Un logiciel sans connecteur : il faut un robot qui agit à l’écran.' }
    : m365
      ? { id: 'automate', why: 'Vous vivez dans Microsoft 365 et la licence est là : restez chez vous.' }
      : it
        ? { id: 'n8n', why: 'Une équipe technique peut l’héberger : les données restent chez vous.' }
        : simple
          ? { id: 'zapier', why: 'Un déclencheur, une action : l’offre gratuite suffit, et c’est le plus simple.' }
          : { id: 'make', why: 'Plusieurs étapes, des conditions, de l’IA, sans budget : le meilleur compromis.' };
  return (
    <Frame mod={3} kind="exercice">
      <Title>Quel outil pour quel besoin ?</Title>
      <Lede w={900}>Répondez aux quatre questions pour la tâche de votre carnet. Je les coche selon vos réponses.</Lede>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 340, width: 900, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Toggle on={screen} onChange={setScreen} tone="teal" label="Une application n’a ni connecteur ni API (vieux logiciel, site sans accès)" />
        <Toggle on={m365} onChange={setM365} tone="blue" label="Votre organisation vit dans Microsoft 365, licence comprise" />
        <Toggle on={it} onChange={setIt} tone="coral" label="Une équipe technique peut héberger un outil en interne" />
        <Toggle on={simple} onChange={setSimple} tone="yellow" label="Il suffit d’un déclencheur et d’une seule action" />
      </div>
      <div key={pick.id} className={A.pop} style={{ position: 'absolute', left: 1130, top: 300, width: 670, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: SHADOW, padding: '40px 40px', textAlign: 'center' }}>
        <Eyebrow c={C.muted}>Piste recommandée</Eyebrow>
        <AppTile id={pick.id} size={170} style={{ margin: '30px auto 0' }} />
        <div style={{ marginTop: 24, fontFamily: display, fontWeight: 700, fontSize: 56, color: C.ink }}>{APPS[pick.id].name}</div>
        <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.4, color: C.soft }}>{pick.why}</div>
      </div>
      <Hint style={{ position: 'absolute', left: 120, top: 900 }}>Les questions sont lues dans l’ordre : la première réponse « oui » l’emporte.</Hint>
    </Frame>
  );
};

// ─── Make: interface tour ───────────────────────────────────────────────────
const M3_Make: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Make en un coup d’œil</Title>
    <Hint style={{ position: 'absolute', left: 120, top: 184 }}>Cliquez les pastilles : les cinq zones à connaître avant demain.</Hint>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 240, width: 1680, height: 660, borderRadius: 18, overflow: 'hidden', background: C.card, boxShadow: SHADOW }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', background: '#2B1A4A', color: '#fff' }}>
        <AppTile id="make" size={40} />
        <span style={{ fontSize: 24, fontWeight: 600 }}>Mon premier scénario</span>
        <span style={{ marginLeft: 'auto', fontSize: 20, opacity: 0.8 }}>Scenarios · Connections · Webhooks · Data stores</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 64, right: 0, bottom: 86, backgroundImage: `radial-gradient(${C.rule} 2px, transparent 2px)`, backgroundSize: '28px 28px' }} />
      <Chain
        x={260}
        y={250}
        size={130}
        gap={180}
        items={[
          { app: 'sheets', label: 'Google Sheets', sub: 'Watch New Rows' },
          { app: 'gemini', label: 'Google Gemini AI', sub: 'Generate a response' },
          { app: 'gmail', label: 'Gmail', sub: 'Send an email' },
        ]}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', background: C.panel, borderTop: `1.5px solid ${C.rule}` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 12, background: '#6D00CC', color: '#fff', fontWeight: 700, fontSize: 22 }}>
          <Icon name="play" size={22} /> Run once
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.soft }}>
          <span style={{ width: 52, height: 30, borderRadius: 99, background: '#CBD4DB' }} /> Every 15 minutes
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 21, color: C.soft }}>
          <Icon name="clock" size={22} /> History
        </span>
      </div>
    </div>
    <Hotspot n={1} x={460} y={480} title="Le module déclencheur">
      Toujours le premier, à gauche. L’horloge indique qu’il vérifie l’application à intervalles réguliers.
    </Hotspot>
    <Hotspot n={2} x={650} y={556} side="below" title="Le lien entre modules">
      Un clic sur le lien permet d’ajouter un filtre : « ne continuer que si… ».
    </Hotspot>
    <Hotspot n={3} x={330} y={835} title="Run once">
      Exécute le scénario une seule fois, tout de suite : c’est votre bouton de test.
    </Hotspot>
    <Hotspot n={4} x={620} y={835} title="La planification">
      Active le scénario en continu, toutes les X minutes. On l’active seulement quand tout est testé.
    </Hotspot>
    <Hotspot n={5} x={1600} y={835} side="left" title="L’historique">
      Chaque exécution, ses données et ses erreurs : votre outil de diagnostic.
    </Hotspot>
  </Frame>
);

// ─── Setup ──────────────────────────────────────────────────────────────────
const M3_Setup: Page = () => (
  <AtelierPage
    mod={3}
    n="Préparation"
    title="Votre poste prêt pour les ateliers"
    timerId="m3-setup"
    minutes={15}
    tools="make.com · Google Sheets · aistudio.google.com · Copilot, Gemini ou ChatGPT (comptes gratuits)"
    objective="Créer les comptes gratuits et le fichier dont vous aurez besoin demain, pour que les ateliers ne commencent pas par une inscription."
    deliver={
      <>
        Un compte Make actif, un classeur Google Sheets <b>« Demandes IA135 »</b> et une clé d’API Gemini rangée en lieu sûr.
        <div style={{ marginTop: 10, fontSize: 21, color: C.coral, fontWeight: 600 }}>Ne collez jamais votre clé dans le Chat.</div>
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Connecté à Make (offre gratuite)</CheckItem>
        <CheckItem id="b" size={22}>Classeur créé, en-têtes en ligne 1</CheckItem>
        <CheckItem id="c" size={22}>Clé Gemini créée et notée</CheckItem>
        <CheckItem id="d" size={22}>Un assistant IA ouvert dans un onglet</CheckItem>
      </>
    }
  >
    <Do n={1}>
      <b>make.com</b> › <Kbd>Get started free</Kbd> : inscrivez-vous avec votre compte Google.
    </Do>
    <Do n={2}>
      Dans Google Sheets, créez <b>« Demandes IA135 »</b> avec, en ligne 1 : Date · Nom · Courriel · Message · Catégorie · Priorité · Résumé.
    </Do>
    <Do n={3}>
      <b>aistudio.google.com</b> › <Kbd>Get API key</Kbd> › <Kbd>Create API key</Kbd>. Copiez-la dans un fichier personnel.
    </Do>
    <Do n={4}>Ouvrez un assistant IA gratuit (Copilot, Gemini ou ChatGPT) : il servira au module 5.</Do>
    <Bonus>Sous Windows 10 ou 11 ? Installez Power Automate Desktop (Microsoft Store, gratuit) pour suivre la démo du module 4.</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="Choisir son outil"
    q="Sans budget, vous voulez relier Gmail, Google Sheets et une IA dans un workflow de six étapes avec un routeur. Quel outil ?"
    explain="Plusieurs étapes, des conditions et de l’IA sans payer : Make (offre gratuite) est le bon compromis. Zapier gratuit s’arrête à deux étapes, n8n infonuagique est payant, et un robot d’écran n’est pas fait pour relier des applications en ligne."
  >
    <Opt ok why="Exact : l’offre gratuite accepte routeurs et modules IA. Seule limite : 1 000 crédits par mois, à surveiller.">
      Make, offre gratuite
    </Opt>
    <Opt why="Piège ! L’offre gratuite de Zapier se limite à des Zaps de deux étapes, sans Paths.">
      Zapier, offre gratuite
    </Opt>
    <Opt why="Piège ! La version infonuagique de n8n est payante après l’essai ; la version gratuite demande un serveur.">
      n8n, version infonuagique
    </Opt>
    <Opt why="Piège ! Power Automate Desktop pilote l’écran de votre poste : inutile quand les applications ont des connecteurs.">
      Power Automate Desktop
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M3_Synthese: Page = () => (
  <SynthPage
    mod={3}
    title="Module 3 · Ce qu’il faut retenir"
    poste={
      <>
        Demandez à votre service informatique quels outils sont <b>autorisés</b> chez vous et quelles données peuvent y passer. Notez la réponse dans votre carnet.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Quatre familles : <b>sans code</b>, suites bureautiques, <b>RPA</b>, assistants IA.
    </SynthRow>
    <SynthRow n={2} tone="blue" d={220}>
      Un connecteur passe par l’<b>API</b> : il vérifie à intervalles, ou reçoit un signal (webhook).
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Scénario, Zap, workflow, flux : <b>les mêmes concepts</b> partout.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Sans budget et avec plusieurs étapes : <b>Make</b>. Les offres gratuites changent : revérifiez-les.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Familles, M3_Connecteur, M3_Panorama, M3_Vocab, M3_Choisir, M3_Make, M3_Setup, M3_Qcm, M3_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 3 (50 min)

DIRE — « Bon retour ! Cet après-midi, on découvre les outils. On fait le tour du marché, on apprend le vocabulaire commun, et surtout : on prépare vos comptes pour que demain matin, on construise directement. »

TRANSITION — « Quatre grandes familles d'outils. »`,
  `⏱ 4 min

OBJECTIF — Situer chaque outil dans une famille.

DIRE — Parcourez les quatre cartes.
• Sans code : « Make, Zapier, n8n relient des applications en ligne. C'est l'outil des deux jours. »
• Suites : « Power Automate chez Microsoft, les automatisations de Google Workspace : intégrés, si vous y vivez déjà. »
• RPA : « Le robot qui clique à votre place, quand il n'y a pas de connecteur. Module 4. »
• IA : « Les assistants comprennent et rédigent. Ils deviennent une étape du workflow. Module 5. »

INSISTER — « Dans la vraie vie, on combine : Make déclenche, une IA classe, un robot saisit dans un vieux logiciel. »

TRANSITION — « Comment une plateforme parle-t-elle à Gmail ou à Sheets ? »`,
  `⏱ 4 min

OBJECTIF — Démystifier la connexion entre applications.

DIRE — « Chaque application en ligne ouvre une porte, l'API : une interface prévue pour les programmes, pas pour les humains. La plateforme passe par cette porte. »
→ beat 1 Connexion — « Vous l'autorisez une fois, avec votre compte ou une clé. C'est aussi un enjeu de sécurité : elle agit en votre nom. »
→ beat 2 Vérification ou signal — « Soit la plateforme regarde toutes les 15 minutes s'il y a du nouveau ; soit l'application la prévient immédiatement, c'est un webhook. »
→ beat 3 Action — « Elle lit ou écrit, puis passe à la suite. »

TRANSITION — « Faisons le tour des outils. »`,
  `⏱ 7 min · PAGE PÉRISSABLE

OBJECTIF — Présenter cinq outils, leurs offres gratuites et leurs limites.

AVANT CHAQUE SESSION — Revérifiez les offres gratuites (make.com/pricing, zapier.com/pricing, n8n.io/pricing) : elles changent souvent. Vérifié en novembre 2026 : Make 1 000 crédits par mois et 2 scénarios actifs ; Zapier 100 tâches et Zaps à 2 étapes ; n8n gratuit en auto-hébergement seulement ; Power Automate Desktop gratuit sous Windows en mode assisté.

ANIMATION — Cliquez les onglets un à un. Pour chacun : pour qui, points forts, offre gratuite, limite.

MESSAGE — « Make est notre choix pour les ateliers : visuel, multi-étapes, avec des modules IA, et gratuit pour apprendre. Ce que vous apprenez se transpose aux autres. »

TRANSITION — « Justement : le vocabulaire change, pas les idées. »`,
  `⏱ 3 min

OBJECTIF — Donner une table de correspondance réutilisable.

DIRE — « Make parle de scénario et de modules, Zapier de Zaps et d'étapes, n8n de nœuds, Power Automate de flux. Ce sont les mêmes concepts. »

INSISTER — La ligne « Ce qu'on paie » : « Chez Make, chaque module exécuté consomme un crédit. Un scénario de 5 modules qui tourne 200 fois : 1 000 crédits, toute l'offre gratuite du mois. D'où l'importance des filtres en tête de scénario. »

TRANSITION — « Et pour votre tâche, quel outil ? »`,
  `⏱ 5 min · EXERCICE ORAL

OBJECTIF — Appliquer une logique de choix à la tâche du carnet.

ANIMATION — Demandez à un volontaire de présenter sa tâche en une phrase. Posez les quatre questions à voix haute ; il répond, vous basculez les interrupteurs. Lisez la recommandation.

Recommencez avec un deuxième volontaire dont la tâche est différente (idéalement un vieux logiciel, pour voir apparaître Power Automate Desktop).

NUANCE — « C'est une piste, pas une vérité : la politique de votre organisation passe avant. »

TRANSITION — « Visite guidée de Make. »`,
  `⏱ 5 min · DÉMO

OBJECTIF — Familiariser avec l'interface de Make avant de l'utiliser.

ANIMATION — Cliquez les pastilles dans l'ordre. Idéalement, montrez ensuite l'interface réelle en partage d'écran (make.com, après connexion).
1. Le module déclencheur, toujours à gauche.
2. Le lien : un clic pour ajouter un filtre.
3. Run once : le bouton de test.
4. La planification : on l'active quand tout fonctionne.
5. L'historique : votre outil de diagnostic.

À SOULIGNER — L'interface de Make est en anglais. Les noms de modules affichés ici (Watch New Rows, Generate a response, Send an email) peuvent varier légèrement d'une version à l'autre.

TRANSITION — « Préparons vos postes. »`,
  `⏱ 15 min · PRÉPARATION INDIVIDUELLE

OBJECTIF — Tous les comptes prêts avant le jour 2.

ANIMATION — Lancez le minuteur. Collez dans le Chat : le lien make.com, le lien aistudio.google.com et la liste des en-têtes du classeur (Date · Nom · Courriel · Message · Catégorie · Priorité · Résumé).

POINT D'ÉTAPE à 7 min — « Qui a son compte Make ? Son classeur ? Sa clé ? » Réponses au micro.

DIFFICULTÉS FRÉQUENTES —
• Compte Google professionnel bloqué pour AI Studio : utiliser un compte Google personnel, avec des données fictives seulement.
• Make demande une région : choisir celle proposée par défaut.
• SÉCURITÉ : la clé d'API donne accès à votre compte Gemini. On ne la colle jamais dans le Chat, un courriel ou une capture partagée.

DONNÉES — Rappel : l'offre gratuite de Gemini peut utiliser vos requêtes pour améliorer les produits de Google. Données inventées uniquement.

BONUS — Power Automate Desktop pour les participants sous Windows.

TRANSITION — « Un QCM pour fixer les choix d'outils. »`,
  `⏱ 2 min · QCM 3

RÉPONSE — A. Make, offre gratuite.
• B ✗ — Zapier gratuit : deux étapes.
• C ✗ — n8n infonuagique : payant après l'essai.
• D ✗ — Un robot d'écran n'est pas fait pour relier des applications en ligne.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

À VOTRE POSTE — « Une question à poser chez vous : quels outils sont autorisés, et pour quelles données ? C'est souvent ce qui décide, avant la technique. »

TRANSITION — « Et quand il n'y a pas de connecteur ? On fait appel à un robot. Module 4 : le RPA. »`,
];
// @@NOTES-END
