// ═══ Module 1 · Introduction à l’automatisation ═════════════════════════════

const M1_Section: Page = () => (
  <Section n={1} title="Introduction à l’automatisation" sub="Ce qu’on automatise, comment, et ce que l’IA change." dur="45 min">
    <SecItem n={1}>Qu’est-ce que l’automatisation ?</SecItem>
    <SecItem n={2}>Automatisation classique ou avec IA</SecItem>
    <SecItem n={3}>Exemples concrets dans les entreprises</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Definition ─────────────────────────────────────────────────────────────
const M1Prop = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={24} cls={b.on(3)} style={{ ...dl(d) }}>
    {children}
  </Card>
);

const M1_Definition: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Automatiser, c’est confier une suite d’actions à un système</Title>
    <Lede>Un événement déclenche des actions selon des règles, sans que vous ayez à intervenir.</Lede>
    <FlowRow
      steps
      x={120}
      y={330}
      w={500}
      gap={90}
      nodes={[
        { kind: 'trigger', label: 'Quand…', sub: 'un courriel arrive, chaque lundi à 8 h, une ligne est ajoutée' },
        { kind: 'cond', label: 'Si…', sub: 'l’objet contient « facture », le montant dépasse 500 $' },
        { kind: 'action', label: 'Alors…', sub: 'enregistrer la pièce jointe, prévenir la comptable' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
      <M1Prop icon="loop" tone="blue" title="Répétable" d={0}>
        Il fait la même chose la 1<sup>re</sup> et la 1 000<sup>e</sup> fois, à 3 h du matin comme à midi.
      </M1Prop>
      <M1Prop icon="shieldCheck" tone="green" title="Fiable" d={150}>
        Pas de fatigue, pas d’oubli… tant que les règles et les données sont bonnes.
      </M1Prop>
      <M1Prop icon="eye" tone="teal" title="Traçable" d={300}>
        Chaque exécution laisse une trace : quand, quoi, avec quel résultat.
      </M1Prop>
    </div>
  </Frame>
);

// ─── Before / after ─────────────────────────────────────────────────────────
const M1Line = ({ i, t, children, auto = false }: { i: number; t: string; children: ReactNode; auto?: boolean }) => (
  <div className={auto ? b.left(1) : A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56, ...dl(auto ? i * 120 : 200 + i * 110) }}>
    <span style={{ width: 70, fontFamily: mono, fontSize: 20, color: auto ? T.green.fg : C.muted }}>{t}</span>
    <span style={{ width: 14, height: 14, flex: 'none', background: auto ? C.green : C.faint }} />
    <span style={{ fontSize: 25, color: C.ink }}>{children}</span>
  </div>
);

const M1_Avant: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>La même tâche, à la main puis automatisée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190 }}>
      <CasTag>Cabinet comptable · une facture fournisseur reçue par courriel</CasTag>
    </div>
    <Card tone="grey" icon="user" title="À la main" size={24} style={{ position: 'absolute', left: 120, top: 270, width: 800, height: 610 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <M1Line i={0} t="0:00">Ouvrir le courriel, télécharger la pièce jointe</M1Line>
        <M1Line i={1} t="1:30">La renommer « 2026-11_Fournisseur_Montant »</M1Line>
        <M1Line i={2} t="2:30">La ranger dans le bon dossier partagé</M1Line>
        <M1Line i={3} t="4:00">Recopier fournisseur, montant et échéance dans Excel</M1Line>
        <M1Line i={4} t="7:00">Vérifier les doublons</M1Line>
        <M1Line i={5} t="9:00">Écrire à la comptable pour approbation</M1Line>
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.coral }}>≈ 10 min × 60 factures / mois</div>
    </Card>
    <Card tone="green" icon="bolt" title="Automatisée" size={24} cls={b.on(1)} style={{ position: 'absolute', left: 1000, top: 270, width: 800, height: 610 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <M1Line auto i={0} t="0:00">Le courriel arrive : le workflow démarre seul</M1Line>
        <M1Line auto i={1} t="0:02">La pièce jointe est renommée et rangée</M1Line>
        <M1Line auto i={2} t="0:05">L’IA lit la facture et extrait les champs</M1Line>
        <M1Line auto i={3} t="0:06">Une ligne est ajoutée au registre, doublon vérifié</M1Line>
        <M1Line auto i={4} t="0:07">La comptable reçoit une demande d’approbation</M1Line>
        <M1Line auto i={5} t="…">Vous ne vérifiez que les cas signalés</M1Line>
      </div>
      <div className={b.fade(2)} style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 44, color: T.green.fg }}>
        ≈ 9 h rendues chaque mois
      </div>
    </Card>
  </Frame>
);

// ─── The ladder of automation ───────────────────────────────────────────────
const M1Rung = ({ i, tone, icon, title, ex, beat }: { i: number; tone: Tone; icon: IconName; title: string; ex: string; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: 120 + i * 282, top: 870 - (250 + i * 64), width: 264 }}>
    <div style={{ height: 250 + i * 64, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 20px' }}>
      <IconTile name={icon} tone={tone} size={56} solid={i >= 4} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.05, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.35, color: C.muted }}>{ex}</div>
    </div>
  </div>
);

const M1_Echelle: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Six niveaux d’automatisation</Title>
    <Lede>Du simple raccourci à l’agent qui décide de ses étapes : plus on monte, plus c’est puissant… et plus il faut encadrer.</Lede>
    <M1Rung i={0} beat={1} tone="grey" icon="filter" title="Règles et formules" ex="Règle Outlook, formule Excel, filtre Gmail" />
    <M1Rung i={1} beat={2} tone="blue" icon="code" title="Macros et scripts" ex="Macro Excel, Apps Script : du code, souvent fragile" />
    <M1Rung i={2} beat={3} tone="teal" icon="bot" title="RPA" ex="Un robot clique et tape à votre place à l’écran" />
    <M1Rung i={3} beat={4} tone="green" icon="puzzle" title="Workflows sans code" ex="Make, Zapier, n8n, Power Automate relient les applications" />
    <M1Rung i={4} beat={5} tone="violet" icon="sparkles" title="Workflows + IA" ex="Une étape IA lit, classe, extrait, résume" />
    <M1Rung i={5} beat={6} tone="coral" icon="brain" title="Agents IA" ex="L’IA choisit elle-même ses outils et ses étapes" />
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 892, display: 'flex', gap: 14, alignItems: 'center', fontSize: 22, color: C.muted, ...dl(400) }}>
      <Icon name="trend" size={26} color={C.blue} /> Ces deux jours : niveaux 3, 4 et 5. Le niveau 6 est présenté au module 5.
    </div>
  </Frame>
);

// ─── Classic vs AI ──────────────────────────────────────────────────────────
const M1_Classique: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Automatisation classique ou avec IA ?</Title>
    <Lede>La différence tient en une question : les règles peuvent-elles s’écrire à l’avance ?</Lede>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}
      cols="300px 1fr 1fr"
      size={28}
      hi={1}
      head={['', 'Classique (règles)', 'Avec IA']}
      rows={[
        ['Entrées', 'Structurées : formulaire, tableau, champ précis', 'Non structurées : courriel libre, PDF, image, voix'],
        ['Logique', 'Règles explicites : si… alors…', 'Jugement appris : « ressemble à une plainte »'],
        ['Résultat', 'Déterministe : toujours le même', 'Probable : très souvent juste, pas toujours'],
        ['Quand ça rate', 'Il s’arrête ou signale une erreur', 'Il se trompe… avec assurance'],
        ['Contrôle', 'Tests une fois pour toutes', 'Tests + échantillonnage + validation humaine'],
      ]}
    />
    <Callout cls={b.on(5)} title="En pratique" style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      On combine les deux : des règles pour tout ce qui peut s’écrire, l’IA seulement pour l’étape qui demande de <Hl>lire et comprendre</Hl>.
    </Callout>
  </Frame>
);

// ─── Interactive: rule vs AI on four e-mails ───────────────────────────────
const M1_MAILS = [
  { from: 'Bureau Plus', subj: 'Facture F-2291 · novembre', rule: { ok: true, txt: 'Classé dans « Factures »' }, ai: 'Facture fournisseur · 1 248,50 $ · échéance 15 déc.' },
  { from: 'Studio Graphik', subj: 'Ci-joint notre note d’honoraires', rule: { ok: false, txt: 'Non classé : le mot « facture » manque' }, ai: 'Facture fournisseur · 3 400 $ · payable à 30 jours' },
  { from: 'Mme Tremblay (cliente)', subj: 'Re: ma facture est-elle payée ?', rule: { ok: false, txt: 'Rangé à tort dans « Factures fournisseurs »' }, ai: 'Question de cliente · suivi de paiement · à traiter' },
  { from: 'Banque Laurentide', subj: 'Votre relevé mensuel · compte 4471', rule: { ok: false, txt: 'Non classé' }, ai: 'Relevé bancaire · à rapprocher' },
];

const M1_Regle: Page = () => {
  const [ai, setAi] = useState(false);
  return (
    <Frame mod={1} kind="demo">
      <Title>Une règle fixe face à quatre courriels réels</Title>
      <div style={{ position: 'absolute', left: 120, top: 188, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Code size={22} style={{ padding: '10px 18px' }}>
          <Jk>SI</Jk> objet contient <Js>« facture »</Js> <Jk>ALORS</Jk> dossier <Js>Factures</Js>
        </Code>
        <Toggle on={ai} onChange={setAi} tone="violet" label={<strong>{ai ? 'Étape IA activée' : 'Activer l’étape IA'}</strong>} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {M1_MAILS.map((m, i) => (
          <div key={m.subj} className={A.left} style={{ display: 'grid', gridTemplateColumns: '700px 1fr', gap: 24, alignItems: 'center', ...dl(i * 120) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
              <IconTile name="mail" tone="blue" size={50} />
              <div>
                <div style={{ fontSize: 20, color: C.muted }}>{m.from}</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{m.subj}</div>
              </div>
            </div>
            {ai ? (
              <div key="ai" className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16, background: T.violet.bg, borderRadius: 14, padding: '18px 22px', boxShadow: `inset 0 0 0 2px ${T.violet.bd}`, ...dl(i * 90) }}>
                <Icon name="sparkles" size={30} color={T.violet.fg} />
                <span style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{m.ai}</span>
              </div>
            ) : (
              <div key="rule" style={{ display: 'flex', alignItems: 'center', gap: 16, background: m.rule.ok ? T.green.bg : T.coral.bg, borderRadius: 14, padding: '18px 22px' }}>
                <Icon name={m.rule.ok ? 'check' : 'x'} size={30} color={m.rule.ok ? T.green.fg : T.coral.fg} sw={3} />
                <span style={{ fontSize: 25, color: C.ink }}>{m.rule.txt}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <Hint style={{ position: 'absolute', left: 120, top: 880 }}>
        {ai ? 'L’IA comprend le sens, pas seulement les mots. Mais qui vérifie quand elle se trompe ?' : 'Une règle sur un mot-clé : 1 courriel sur 4 bien traité.'}
      </Hint>
    </Frame>
  );
};

// ─── Sorting game ───────────────────────────────────────────────────────────
const M1Zone = ({ x, w, tone, icon, title, sub }: { x: number; w: number; tone: Tone; icon: IconName; title: string; sub: string }) => (
  <div style={{ position: 'absolute', left: x, top: 470, width: w, height: 440, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name={icon} size={34} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ marginTop: 4, fontSize: 20, color: C.soft }}>{sub}</div>
  </div>
);

const M1_Trier: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Règles, IA… ou ni l’un ni l’autre ?</Title>
    <Lede w={1680}>Dites-moi où va chaque étiquette. Je la déplace.</Lede>
    <M1Zone x={120} w={540} tone="blue" icon="filter" title="Des règles suffisent" sub="Données structurées, logique écrivable" />
    <M1Zone x={690} w={540} tone="violet" icon="sparkles" title="Il faut de l’IA" sub="Texte libre, images, jugement" />
    <M1Zone x={1260} w={540} tone="coral" icon="humanCheck" title="Garder humain" sub="Rare, sensible, relationnel" />
    <Drag x={120} y={280} w={520} tone="grey">Copier chaque ligne d’un formulaire dans Excel</Drag>
    <Drag x={660} y={280} w={560} tone="grey">Trier les courriels du service client par motif</Drag>
    <Drag x={1240} y={280} w={560} tone="grey">Annoncer un licenciement à un employé</Drag>
    <Drag x={120} y={350} w={520} tone="grey">Envoyer un rappel 3 jours avant l’échéance</Drag>
    <Drag x={660} y={350} w={560} tone="grey">Résumer 40 réponses ouvertes d’un sondage</Drag>
    <Drag x={1240} y={350} w={560} tone="grey">Lire les montants sur des factures scannées</Drag>
    <Drag x={380} y={410} w={600} tone="grey">Négocier un contrat avec un client mécontent</Drag>
    <Drag x={1000} y={410} w={600} tone="grey">Sauvegarder les pièces jointes dans un dossier</Drag>
  </Frame>
);

// ─── Examples by function ───────────────────────────────────────────────────
type M1Ex = { t: string; d: string; ai: boolean };
const M1_EX: Record<string, { icon: IconName; tone: Tone; items: M1Ex[] }> = {
  Finance: {
    icon: 'money',
    tone: 'green',
    items: [
      { t: 'Saisie des factures fournisseurs', d: 'Lecture des PDF, extraction des montants, registre, approbation', ai: true },
      { t: 'Relances de paiement', d: 'Rappel automatique à J-3, J+7, J+15 selon le registre', ai: false },
      { t: 'Rapprochement bancaire', d: 'Comparer relevé et grand livre, signaler les écarts', ai: false },
    ],
  },
  'Ressources humaines': {
    icon: 'users',
    tone: 'blue',
    items: [
      { t: 'Accueil d’une nouvelle recrue', d: 'Comptes, courriels de bienvenue, tâches au gestionnaire', ai: false },
      { t: 'Questions fréquentes des employés', d: 'Réponse proposée à partir du guide RH, validée par l’équipe RH', ai: true },
      { t: 'Suivi des demandes de congés', d: 'Formulaire → approbation → calendrier partagé', ai: false },
    ],
  },
  'Service client': {
    icon: 'chat',
    tone: 'violet',
    items: [
      { t: 'Tri des demandes entrantes', d: 'Motif, urgence et ton détectés par l’IA, puis routage', ai: true },
      { t: 'Brouillons de réponse', d: 'Réponse rédigée par l’IA, relue avant envoi', ai: true },
      { t: 'Accusé de réception', d: 'Numéro de dossier et délai annoncé, instantanément', ai: false },
    ],
  },
  Ventes: {
    icon: 'trend',
    tone: 'yellow',
    items: [
      { t: 'Nouveau prospect', d: 'Formulaire web → CRM → courriel de suivi au représentant', ai: false },
      { t: 'Compte rendu de rendez-vous', d: 'Notes résumées, prochaines étapes inscrites au CRM', ai: true },
      { t: 'Rapport hebdomadaire des ventes', d: 'Chiffres agrégés, commentaire rédigé par l’IA', ai: true },
    ],
  },
  Opérations: {
    icon: 'truck',
    tone: 'teal',
    items: [
      { t: 'Synchronisation des fichiers', d: 'Nouveau fichier déposé → copié, renommé, archivé', ai: false },
      { t: 'Bons de livraison scannés', d: 'Lecture des documents (OCR), contrôle des quantités', ai: true },
      { t: 'Alerte de stock bas', d: 'Seuil atteint → courriel au responsable des achats', ai: false },
    ],
  },
};

const M1_Exemples: Page = () => (
  <Frame mod={1}>
    <Title>Ce que les entreprises automatisent déjà</Title>
    <Lede>Choisissez un service : où retrouvez-vous votre propre travail ?</Lede>
    <Tabs initial="Finance" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(M1_EX).map(([k, v]) => (
          <TabBtn key={k} id={k} icon={v.icon} tone={v.tone} />
        ))}
      </div>
      {Object.entries(M1_EX).map(([k, v]) => (
        <TabPane key={k} id={k}>
          <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {v.items.map((it) => (
              <Card key={it.t} tone={it.ai ? 'violet' : v.tone} style={{ height: 380 }} size={25}>
                <Tag tone={it.ai ? 'violet' : 'grey'} size={19}>
                  <Icon name={it.ai ? 'sparkles' : 'gear'} size={20} /> {it.ai ? 'Avec IA' : 'Règles seules'}
                </Tag>
                <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: C.ink }}>{it.t}</div>
                <div style={{ marginTop: 14 }}>{it.d}</div>
              </Card>
            ))}
          </div>
        </TabPane>
      ))}
    </Tabs>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Classique ou IA ?"
    q="Un formulaire web envoie toujours les mêmes champs (nom, courriel, produit). Il faut les copier dans un tableau. Que choisir ?"
    explain="Les données sont déjà structurées : une règle fait le travail, gratuitement et sans erreur. L’IA coûte, ralentit et peut se tromper là où rien n’est à interpréter."
  >
    <Opt why="Piège ! Rien n’est à comprendre ici : les champs sont fixes. L’IA ajouterait un coût et un risque d’erreur inutiles.">
      Une étape IA, pour plus d’intelligence
    </Opt>
    <Opt ok why="Exact : déclencheur « nouvelle réponse » + action « ajouter une ligne ». Les données arrivent déjà rangées.">
      Une automatisation classique, sans IA
    </Opt>
    <Opt why="Piège ! La tâche est fréquente, simple et sans jugement : c’est exactement ce qu’on automatise.">
      Rien : c’est trop simple pour être automatisé
    </Opt>
    <Opt why="Piège ! Un agent IA choisit lui-même ses étapes : beaucoup trop pour une copie de champs fixes.">
      Un agent IA autonome
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M1_Synthese: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Repérez une tâche que vous faites chaque semaine. Écrivez-la sous la forme <b>Quand… Si… Alors…</b> dans votre carnet de bord.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Automatiser : un <b>déclencheur</b>, des <b>règles</b>, des <b>actions</b>, sans intervention.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Six niveaux, du raccourci à l’agent : on choisit <b>le plus simple</b> qui fait le travail.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      L’IA sert quand il faut <b>lire et comprendre</b> : texte libre, document, image.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      L’IA est probable, pas certaine : on prévoit <b>contrôles et validation</b>.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Definition, M1_Avant, M1_Echelle, M1_Classique, M1_Regle, M1_Trier, M1_Exemples, M1_Qcm, M1_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 1 (45 min)

DIRE — « Premier module : on pose les bases. Qu'est-ce qu'automatiser, et qu'est-ce que l'IA change vraiment ? On termine par des exemples concrets, service par service. »

TRANSITION — « Commençons par une définition simple. »`,
  `⏱ 4 min

OBJECTIF — Donner une définition opérationnelle, réutilisée toute la formation.

DIRE — « Automatiser, c'est confier une suite d'actions à un système. Toujours trois morceaux. » Cliquez (→) à chaque bloc :
→ beat 1 « Si… » — « Une règle : la condition qui décide. »
→ beat 2 « Alors… » — « Des actions : ce que le système fait à votre place. »
Avant le premier clic, lisez le bloc « Quand… » : « Un déclencheur : un événement, une heure, une nouvelle donnée. »
→ beat 3 — Les trois propriétés : répétable, fiable, traçable.

INSISTER — « Fiable… tant que les règles et les données sont bonnes. Une automatisation reproduit aussi les erreurs, mille fois et très vite. »

INTERACTION — « Donnez-moi une tâche de votre semaine sous la forme Quand… Si… Alors… » Écoutez deux réponses au micro.

TRANSITION — « Voyons ce que ça change sur une vraie tâche. »`,
  `⏱ 4 min · CAS : CABINET COMPTABLE

OBJECTIF — Rendre le gain concret, en minutes.

DIRE — « Un cabinet comptable reçoit ses factures fournisseurs par courriel. À la main : six gestes, environ dix minutes par facture. » Lisez la colonne de gauche.
→ beat 1 — La version automatisée apparaît : « Le courriel déclenche tout. Remarquez l'étape 3 : l'IA lit la facture. Sans elle, il faudrait un formulaire. »
→ beat 2 — « Soixante factures par mois : environ neuf heures rendues. Et vous ne regardez plus que les cas signalés. »

À SOULIGNER — L'humain ne disparaît pas : il approuve et traite les exceptions.

TRANSITION — « Il existe plusieurs façons d'automatiser. Rangeons-les. »`,
  `⏱ 5 min

OBJECTIF — Situer RPA, workflows et IA sur une même échelle.

DIRE — Révélez les niveaux un à un (→ beats 1 à 6) :
1. Règles et formules : « Vous en avez déjà : une règle Outlook, un filtre Gmail. »
2. Macros et scripts : « Du code. Puissant, mais fragile et dépendant de la personne qui l'a écrit. »
3. RPA : « Un robot logiciel qui clique et tape à l'écran comme vous. Module 4. »
4. Workflows sans code : « Make, Zapier, n8n, Power Automate relient les applications par leurs connecteurs. Notre outil principal. »
5. Workflows + IA : « Une étape IA dans le circuit : elle lit, classe, extrait. Modules 5 et 8. »
6. Agents IA : « L'IA choisit ses étapes elle-même. Prometteur, mais plus difficile à contrôler. »

MESSAGE CLÉ — « On choisit toujours le niveau le plus bas qui fait le travail. »

TRANSITION — « Arrêtons-nous sur la différence entre classique et IA. »`,
  `⏱ 5 min

OBJECTIF — Comprendre quand l'IA est utile et ce qu'elle change dans le contrôle.

DIRE — Révélez les lignes (→ beats 1 à 5).
• Entrées : « Classique : des données rangées. IA : du texte libre, un PDF, une photo. »
• Logique : « Une règle s'écrit. Un jugement comme “ce courriel est une plainte” ne s'écrit pas facilement. »
• Résultat : « Une règle donne toujours la même réponse. L'IA donne la réponse la plus probable. »
• Quand ça rate : « C'est la différence la plus importante. Une règle échoue en s'arrêtant. L'IA échoue en se trompant avec assurance. »
• Contrôle : « D'où les tests, l'échantillonnage et la validation humaine. »
→ beat 5 — À retenir : on combine les deux.

TRANSITION — « Démonstration : une règle face à quatre courriels. »`,
  `⏱ 6 min · DÉMO INTERACTIVE

OBJECTIF — Faire sentir la limite des règles et l'apport de l'IA.

DIRE — « La règle : si l'objet contient “facture”, on classe dans Factures. Regardez les résultats. » Commentez : 1 seul courriel bien traité sur 4. La note d'honoraires est manquée, la question de la cliente est mal rangée, le relevé est ignoré.

INTERACTION — « Comment amélioreriez-vous la règle ? » Écoutez deux réponses (ajouter “honoraires”, exclure “Re:”…). « Chaque mot ajouté corrige un cas et en casse un autre. »

Puis cliquez « Activer l'étape IA » : « L'IA comprend le sens. Elle classe, et en plus elle extrait le montant et l'échéance. »

QUESTION — « Et quand elle se trompe ? » C'est la bonne question : on y répond aux modules 8 et 10.

TRANSITION — « À vous de juger : règles, IA ou humain ? »`,
  `⏱ 7 min · EXERCICE ORAL

OBJECTIF — Exercer le premier réflexe : la bonne solution pour chaque tâche.

ANIMATION — Appelez un participant par son prénom pour chaque étiquette : « Où va-t-elle ? » Déplacez-la. Demandez parfois « Qui voit les choses autrement ? » et faites intervenir une deuxième personne au micro.

PROPOSITION DE CORRIGÉ —
• Règles : copier un formulaire, rappel à J-3, sauvegarder les pièces jointes.
• IA : trier par motif, résumer 40 réponses ouvertes, lire des factures scannées (OCR + extraction).
• Humain : annoncer un licenciement, négocier avec un client mécontent.

NUANCE — « Le résumé du sondage : IA, mais une personne relit avant diffusion. Négocier : l'IA peut préparer les arguments, la conversation reste humaine. » Double-cliquer sur une étiquette la remet à sa place.

TRANSITION — « Voyons ce que les entreprises automatisent déjà. »`,
  `⏱ 6 min

OBJECTIF — Donner des exemples concrets par service, et nourrir le choix de la tâche réelle.

ANIMATION — Cliquez les onglets en fonction du groupe (notes du tour de table). Pour chaque carte : « règles seules » ou « avec IA ». Faites remarquer que la majorité des automatisations utiles n'ont pas besoin d'IA.

INTERACTION — « Quelle carte ressemble le plus à votre travail ? » Deux ou trois réponses au micro, par prénom.

À SOULIGNER — Service client et ventes : beaucoup de texte libre, donc beaucoup d'IA. Finance et opérations : surtout des règles, l'IA pour lire les documents.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 3 min · QCM 1

ANIMATION — Votes à voix haute (A, B, C ou D). Cliquez la réponse majoritaire, puis les autres pour les pièges. → révèle la bonne réponse, puis l'essentiel.

RÉPONSE — B. Données structurées : une automatisation classique suffit.
• A ✗ — « L'IA partout » est le piège le plus courant : coût, lenteur, erreurs possibles.
• C ✗ — Fréquent et simple : candidat idéal.
• D ✗ — Un agent est disproportionné.

TRANSITION — « Synthèse du module. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. Insistez sur le 2 : « le plus simple qui fait le travail ».

À VOTRE POSTE — « Dans votre carnet, rubrique 1 : une première tâche écrite en Quand… Si… Alors… On la mettra à l'épreuve au module 2. »

TRANSITION — « Comment trouver les bonnes tâches à automatiser ? C'est le module 2. »`,
];
// @@NOTES-END
