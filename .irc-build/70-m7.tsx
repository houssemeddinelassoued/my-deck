// ─── Module 7 · Projet final et bonnes pratiques ───────────────────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title={
      <>
        Cas fil rouge
        <br />
        et bonnes pratiques
      </>
    }
    sub="Assembler tout ce qu’on a vu sur une demande traitée de bout en bout, et fixer les règles qui protègent vos clients… et vous."
    dur="16:25 – 17:15 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 6 · cas fil rouge de bout en bout
      </Tag>
    }
  >
    <SecItem n={1}>Demande → analyse → réponse → validation → suivi → satisfaction</SecItem>
    <SecItem n={2}>Confidentialité et données clients</SecItem>
    <SecItem n={3}>Contrôle humain : qui décide quoi</SecItem>
    <SecItem n={4}>Les limites de l’IA</SecItem>
    <SecItem n={5}>Votre charte de bonnes pratiques</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Le parcours complet (onglets) ──────────────────────────────────────────
const M7Pane = ({ tone, title, ia, moi, children }: { tone: Tone; title: string; ia: ReactNode; moi: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, marginTop: 22 }}>
    <div style={{ flex: 1, minHeight: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 32px' }}>
      <Eyebrow c={T[tone].fg} size={18}>
        Mme Moreau · {title}
      </Eyebrow>
      <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.5, color: C.ink }}>{children}</div>
    </div>
    <div style={{ width: 560, flex: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ flex: 1, background: T.violet.bg, borderRadius: 18, padding: '20px 24px' }}>
        <PanelTitle icon="sparkles" c={T.violet.fg}>
          L’IA
        </PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{ia}</div>
      </div>
      <div style={{ flex: 1, background: T.green.bg, borderRadius: 18, padding: '20px 24px' }}>
        <PanelTitle icon="humanCheck" c={T.green.fg}>
          Vous
        </PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{moi}</div>
      </div>
    </div>
  </div>
);

const M7_Parcours: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Le parcours complet d’une demande, en six étapes</Title>
    <Lede>Retour sur Mme Moreau, de son email de lundi à son avis. Cliquez chaque étape.</Lede>
    <Tabs initial="1" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <TabBtn id="1" icon="mail" tone="blue">
          1 · Demande
        </TabBtn>
        <TabBtn id="2" icon="search" tone="teal">
          2 · Analyse
        </TabBtn>
        <TabBtn id="3" icon="pen" tone="violet">
          3 · Réponse
        </TabBtn>
        <TabBtn id="4" icon="humanCheck" tone="pink">
          4 · Validation
        </TabBtn>
        <TabBtn id="5" icon="calendar" tone="yellow">
          5 · Suivi
        </TabBtn>
        <TabBtn id="6" icon="smile" tone="green">
          6 · Satisfaction
        </TabBtn>
      </div>
      <TabPane id="1">
        <M7Pane tone="blue" title="la demande" ia="Rien encore : le message arrive dans la file, avec l’historique du dossier." moi="Vous ouvrez le message et le dossier client, dans l’outil autorisé.">
          « Mon lave-linge est arrivé avec 6 jours de retard et il fuit dès le premier lavage ! C’est la deuxième fois que je vous écris et personne ne
          répond. Je veux une solution rapide, sinon j’annule tout et je laisse un avis. »
        </M7Pane>
      </TabPane>
      <TabPane id="2">
        <M7Pane tone="teal" title="l’analyse" ia="Remplit la fiche avec le prompt d’analyse : catégorie, intention, infos, urgence, émotion." moi="Vérifiez les faits dans le dossier : retard confirmé, 1er message bien resté sans réponse.">
          <strong>SAV · produit défectueux</strong> (+ retard) · Intention : solution rapide · NM-48213, lave-linge, fuite au 1er lavage, 2e contact ·{' '}
          <strong>P2</strong> (2e relance, menace d’avis) · Émotion : exaspération.
        </M7Pane>
      </TabPane>
      <TabPane id="3">
        <M7Pane tone="violet" title="la réponse" ia="Rédige le brouillon en 5 briques, à partir de la fiche et de la procédure garantie." moi="Choisissez la solution et le ton ; retirez tout engagement que vous ne pouvez pas tenir.">
          « Je suis sincèrement désolé : un retard de 6 jours, puis une fuite dès le premier lavage, et un premier message resté sans réponse. Je vous
          propose, au choix, l’échange de l’appareil ou un technicien sous 72 h… »
        </M7Pane>
      </TabPane>
      <TabPane id="4">
        <M7Pane tone="pink" title="la validation" ia="Peut relire l’orthographe et vérifier que chaque question a une réponse." moi="Les 4 vérifications : exact, complet, adapté, conforme. Puis vous envoyez, sous votre nom.">
          ✓ Nom et produit exacts · ✓ délai de 72 h conforme à la procédure garantie · ✓ ton empathique, sans « calmez-vous » · ✓ aucun geste hors
          délégation · <strong>→ envoyé lundi 9 h 05.</strong>
        </M7Pane>
      </TabPane>
      <TabPane id="5">
        <M7Pane tone="yellow" title="le suivi" ia="Rédige le message de suivi et la synthèse du dossier pour l’outil client." moi="Programmez la relance, vérifiez que l’intervention a bien eu lieu, clôturez le dossier.">
          Mme Moreau choisit « technicien ». Intervention jeudi : joint changé. <strong>Vendredi</strong>, message de suivi : « L’intervention d’hier
          a-t-elle bien réglé le problème ? Votre lave-linge fonctionne-t-il normalement ? »
        </M7Pane>
      </TabPane>
      <TabPane id="6">
        <M7Pane tone="green" title="la satisfaction" ia="Analyse le verbatim : émotion, points positifs, irritant restant ; l’ajoute au reporting." moi="Remontez l’irritant « 1er message sans réponse » : c’est lui qui a tout aggravé.">
          Enquête : <strong>4 / 5</strong>. « Le technicien était top et le conseiller très réactif. Dommage qu’il ait fallu écrire deux fois. »
        </M7Pane>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Confidentialité : jeu de tri ───────────────────────────────────────────
const M7Zone = ({ x, tone, icon, label, sub }: { x: number; tone: Tone; icon: IconName; label: string; sub: string }) => (
  <div style={{ position: 'absolute', left: x, top: 250, width: 370, height: 640, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={28} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{label}</span>
    </div>
    <div style={{ marginTop: 4, fontSize: 18, color: T[tone].fg, opacity: 0.8 }}>{sub}</div>
  </div>
);

const M7_Donnees: Page = () => (
  <Frame mod={7} kind="jeu" beats={1}>
    <Title>Confidentialité : que peut-on donner à l’IA ?</Title>
    <Lede>Même dans l’outil autorisé par l’entreprise. Glissez chaque donnée dans sa colonne ; → affiche le corrigé.</Lede>
    <M7Zone x={660} tone="green" icon="checkCircle" label="Utile, je peux" sub="nécessaire à la réponse" />
    <M7Zone x={1045} tone="yellow" icon="eyeOff" label="Je remplace" sub="par [CLIENT], [ADRESSE]…" />
    <M7Zone x={1430} tone="coral" icon="lock" label="Jamais" sub="aucune raison valable" />
    <Drag x={120} y={250} w={500} tone="grey" size={21}>
      La description de la panne
    </Drag>
    <Drag x={120} y={322} w={500} tone="grey" size={21}>
      Le nom et le prénom du client
    </Drag>
    <Drag x={120} y={394} w={500} tone="grey" size={21}>
      Le numéro de carte bancaire
    </Drag>
    <Drag x={120} y={466} w={500} tone="grey" size={21}>
      La procédure SAV interne
    </Drag>
    <Drag x={120} y={538} w={500} tone="grey" size={21}>
      L’adresse postale complète
    </Drag>
    <Drag x={120} y={610} w={500} tone="grey" size={21}>
      Un certificat médical joint au dossier
    </Drag>
    <Drag x={120} y={682} w={500} tone="grey" size={21}>
      La date de livraison
    </Drag>
    <Drag x={120} y={754} w={500} tone="grey" size={21}>
      L’email et le téléphone du client
    </Drag>
    <Drag x={120} y={826} w={500} tone="grey" size={21}>
      Le mot de passe de l’espace client
    </Drag>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 920, width: 1680, display: 'flex', gap: 12, zIndex: 25 }}>
      <Tag tone="green" size={18}>
        Utile : panne, procédure, date
      </Tag>
      <Tag tone="yellow" size={18}>
        Remplacer : nom, adresse, email / tél.
      </Tag>
      <Tag tone="coral" size={18}>
        Jamais : carte bancaire, certificat médical, mot de passe
      </Tag>
    </div>
  </Frame>
);

// ─── Anonymiser (interrupteur) ──────────────────────────────────────────────
const M7Pii = ({ on, real, ph }: { on: boolean; real: string; ph: string }) =>
  on ? (
    <span style={{ fontFamily: mono, fontSize: '0.86em', color: T.yellow.fg, background: T.yellow.bg, borderRadius: 6, padding: '1px 6px', boxShadow: `inset 0 0 0 1.5px ${T.yellow.bd}` }}>{ph}</span>
  ) : (
    <span style={{ background: 'rgba(224,72,72,.14)', borderRadius: 4, padding: '0 3px' }}>{real}</span>
  );

const M7_Anonymiser: Page = () => {
  const [on, set] = useState(false);
  return (
    <Frame mod={7} kind="demo">
      <Title>Anonymiser en dix secondes, avant de coller</Title>
      <Lede>Basculez l’interrupteur : l’IA a tout ce qu’il faut pour aider… sans savoir qui est la cliente.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, ...dl(100) }}>
        <Toggle on={on} onChange={set} label={on ? 'Version anonymisée : prête à coller' : 'Version brute : à ne pas coller telle quelle'} tone="yellow" size={27} />
      </div>
      <div
        className={A.in}
        style={{ position: 'absolute', left: 120, top: 350, width: 1100, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: on ? `0 0 0 3px ${C.yellow}, ${SHADOW}` : `0 0 0 3px ${C.coral}, ${SHADOW}`, padding: '28px 36px', fontSize: 25, lineHeight: 1.65, color: C.ink, transition: `box-shadow 400ms ${EASE}`, ...dl(200) }}
      >
        Bonjour, je suis <M7Pii on={on} real="Léa Moreau" ph="[CLIENTE]" />, j’habite <M7Pii on={on} real="14 rue des Lilas, 69003 Lyon" ph="[ADRESSE]" />.
        Mon lave-linge (commande <M7Pii on={on} real="NM-48213" ph="[COMMANDE]" />) est arrivé avec 6 jours de retard et il fuit dès le premier lavage.
        Vous pouvez me joindre au <M7Pii on={on} real="06 12 34 56 78" ph="[TÉL]" /> ou à <M7Pii on={on} real="lea.moreau@mail.fr" ph="[EMAIL]" />. Le
        prélèvement a été fait sur ma carte <M7Pii on={on} real="4974 •••• •••• 2291" ph="[SUPPRIMÉ]" />.
      </div>
      <div style={{ position: 'absolute', left: 1270, top: 350, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="yellow" icon="eyeOff" title="Remplacer, pas supprimer" cls={A.right} style={dl(300)} size={22}>
          Les crochets gardent le sens : l’IA sait qu’il y a une adresse, sans la connaître. Vous remettez les vraies valeurs après.
        </Card>
        <Card tone="coral" icon="lock" title="Ce qui ne sert à rien part" cls={A.right} style={dl(450)} size={22}>
          La carte bancaire n’aide pas à répondre : elle est supprimée, pas remplacée.
        </Card>
        <Callout title="Règle d’entreprise" tone="blue" icon="shieldCheck" cls={A.right} style={dl(600)} size={21}>
          Outil autorisé, données minimales, et respect du RGPD : en cas de doute, demandez à votre référent.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Contrôle humain : qui décide quoi ──────────────────────────────────────
const M7Lvl = ({ n, tone, icon, title, sub, children }: { n: number; tone: Tone; icon: IconName; title: string; sub: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '22px 26px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 19, color: T[tone].fg, fontWeight: 600 }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M7_Controle: Page = () => (
  <Frame mod={7} beats={3}>
    <Title>Contrôle humain : trois niveaux, une règle claire</Title>
    <Lede>Plus l’enjeu pour le client est fort, plus l’humain est présent. → du moins au plus encadré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <M7Lvl n={1} tone="teal" icon="sparkles" title="L’IA m’aide" sub="pour moi, rien ne part au client">
        <Bullet size={22} tone="teal">Résumer un dossier, un appel</Bullet>
        <Bullet size={22} tone="teal">Analyser une demande</Bullet>
        <Bullet size={22} tone="teal">Chercher dans la documentation (source vérifiée)</Bullet>
        <Bullet size={22} tone="teal">Classer des conversations pour un reporting</Bullet>
      </M7Lvl>
      <M7Lvl n={2} tone="yellow" icon="eye" title="Je valide" sub="relecture systématique avant envoi">
        <Bullet size={22} tone="yellow">Toute réponse envoyée à un client</Bullet>
        <Bullet size={22} tone="yellow">Toute réponse publique</Bullet>
        <Bullet size={22} tone="yellow">Toute traduction</Bullet>
        <Bullet size={22} tone="yellow">Tout modèle partagé à l’équipe</Bullet>
      </M7Lvl>
      <M7Lvl n={3} tone="coral" icon="humanCheck" title="Je décide" sub="l’IA ne fait que préparer">
        <Bullet size={22} tone="coral">Un geste commercial, un remboursement</Bullet>
        <Bullet size={22} tone="coral">Une exception à la procédure</Bullet>
        <Bullet size={22} tone="coral">Un client vulnérable, un litige</Bullet>
        <Bullet size={22} tone="coral">Mettre fin à un échange, escalader</Bullet>
      </M7Lvl>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.navy, fontWeight: 600, ...dl(500) }}>
      <Icon name="shieldCheck" size={30} color={C.green} />
      Dans tous les cas : la réponse part sous votre nom, et c’est vous qui en êtes responsable.
    </div>
  </Frame>
);

// ─── Les limites de l’IA (et leurs parades) ─────────────────────────────────
const M7Lim = ({ icon, tone, title, parade }: { icon: IconName; tone: Tone; title: string; parade: ReactNode }) => (
  <FlipCard
    w={536}
    h={250}
    tone={tone}
    backTone="green"
    flipAt={1}
    front={
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.2, color: C.navy }}>{title}</div>
      </div>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={18}>
          La parade
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.ink }}>{parade}</div>
      </>
    }
  />
);

const M7_Limites: Page = () => (
  <Frame mod={7} kind="exercice" beats={1}>
    <Title>Les limites de l’IA, et la parade pour chacune</Title>
    <Lede>Avant de retourner une carte, demandez au groupe : « Quelle parade avons-nous vue aujourd’hui ? » → retourne tout.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M7Lim icon="alert" tone="coral" title="Elle invente quand elle ne sait pas" parade="Fournir le contexte, « non précisé » plutôt qu’inventé, relire nom, dates, montants." />
      <M7Lim icon="calendar" tone="yellow" title="Elle n’est pas à jour" parade="Elle ignore vos derniers tarifs et procédures : base de connaissances datée, source citée." />
      <M7Lim icon="lock" tone="navy" title="Elle peut exposer des données" parade="Outil autorisé uniquement, données minimales, anonymisation avant de coller." />
      <M7Lim icon="eyeOff" tone="pink" title="Elle rate l’implicite et l’ironie" parade="Vous confirmez l’émotion et l’intention ; l’IA détecte, l’humain interprète." />
      <M7Lim icon="heart" tone="violet" title="Elle n’éprouve pas d’empathie" parade="Elle imite les mots ; la sincérité, la décision et le geste viennent de vous." />
      <M7Lim icon="brain" tone="teal" title="Elle peut nous rendre passifs" parade="Gardez la main : écrivez parfois sans elle, challengez ses propositions." />
    </div>
  </Frame>
);

// ─── Charte de bonnes pratiques ─────────────────────────────────────────────
const M7_Charte: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Ma charte de l’IA en relation client</Title>
    <Lede>Dix règles à garder sous les yeux. Cochez celles que vous appliquez déjà ; les autres sont vos objectifs.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...dl(100) }}>
        <CheckItem id="ch1" size={22}>J’utilise uniquement l’outil autorisé</CheckItem>
        <CheckItem id="ch2" size={22}>Je ne colle que les données utiles</CheckItem>
        <CheckItem id="ch3" size={22}>J’anonymise avant de coller</CheckItem>
        <CheckItem id="ch4" size={22}>Je donne le contexte et la procédure</CheckItem>
        <CheckItem id="ch5" size={22}>Je relis chaque réponse en entier</CheckItem>
        <CheckItem id="ch6" size={22}>Je vérifie nom, dates, montants</CheckItem>
        <CheckItem id="ch7" size={22}>Aucun engagement hors procédure</CheckItem>
        <CheckItem id="ch8" size={22}>Je décide des gestes et exceptions</CheckItem>
        <CheckItem id="ch9" size={22}>Je signale les erreurs de l’IA</CheckItem>
        <CheckItem id="ch10" size={22}>Je partage mes bons prompts à l’équipe</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1350, top: 262, width: 450, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Ma charte aujourd’hui"
          levels={[
            { min: 0, text: 'Choisissez 3 règles à appliquer dès demain.', tone: 'grey' },
            { min: 5, text: 'Bonne base : visez les 10 d’ici un mois.', tone: 'blue' },
            { min: 9, text: 'Exemplaire : devenez le relais de votre équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.45, color: C.muted }}>Photographiez cette page : c’est votre aide-mémoire.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Atelier 6 : cas fil rouge ──────────────────────────────────────────────
const M7_Kit: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Atelier 6 · le cas à traiter de bout en bout</Title>
    <Lede>Un nouveau message, plus délicat. Lisez-le attentivement : il contient un piège de confidentialité.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, ...dl(100) }}>
      <Bubble who="user" name="Mme Nadia Ferreira · formulaire web · vendredi 17 h 40" size={25}>
        Bonjour, mon réfrigérateur livré il y a trois semaines ne refroidit plus depuis ce matin. J’ai 78 ans, je suis diabétique et mon insuline doit
        rester au frais. Ma fille m’a aidée à écrire ce message. Je ne peux pas me déplacer et je ne sais pas quoi faire. Pouvez-vous m’aider très
        vite ? Mon numéro : 06 98 76 54 32.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card tone="yellow" icon="split" title="Ce que vous avez" cls={A.right} style={dl(300)} size={21}>
        La note SAV-07 (module 5), vos prompts d’analyse et de réponse, la charte.
      </Card>
      <Card tone="green" icon="smile" title="Après la résolution" cls={A.right} style={dl(450)} size={21}>
        Réponse à l’enquête : « 3/5. Technicien venu lundi, très gentil. Mais tout le week-end sans frigo, c’était long. »
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 700, width: 1060, ...dl(600) }}>
      <Callout title="Questions à vous poser" tone="coral" icon="eye" size={23}>
        Quelle priorité ? Quelles données ne doivent pas aller dans l’IA ? Qui décide d’un geste exceptionnel ? Que faire avant lundi ?
      </Callout>
    </div>
  </Frame>
);

const M7_Atelier: Page = () => (
  <LabPage
    mod={7}
    n="6"
    title="Cas fil rouge : de la demande à la satisfaction"
    defi="projet"
    who="En binôme · 20 min"
    minutes={20}
    objective={
      <>
        Traiter la demande de Mme Ferreira <strong>en six étapes</strong>, avec l’IA, en appliquant la charte, puis présenter votre traitement en 2 minutes.
      </>
    }
    where={
      <>
        Fiche d’analyse + réponse validée
        <br />
        Note d’escalade + message de suivi
        <br />
        Analyse de l’avis + 1 amélioration
      </>
    }
    crit={
      <>
        <CheckItem id="a6-1" size={21}>
          Données de santé et téléphone hors IA
        </CheckItem>
        <CheckItem id="a6-2" size={21}>
          Priorité et vulnérabilité reconnues
        </CheckItem>
        <CheckItem id="a6-3" size={21}>
          Escalade pour une solution d’urgence
        </CheckItem>
        <CheckItem id="a6-4" size={21}>
          Amélioration tirée de l’avis
        </CheckItem>
      </>
    }
  >
    <strong>1. Analyse</strong> (en anonymisant) · <strong>2. Réponse</strong> avec la note SAV-07 · <strong>3. Validation</strong> par les 4 vérifications ·{' '}
    <strong>4. Escalade</strong> : un geste d’urgence (prêt, intervention samedi) est-il possible ? · <strong>5. Suivi</strong> : message de lundi soir ·{' '}
    <strong>6. Satisfaction</strong> : analysez l’avis 3/5 et proposez une amélioration du process.
    <Bonus>Rédigez aussi la fiche KB « client vulnérable sans froid le week-end » que l’équipe pourra réutiliser.</Bonus>
  </LabPage>
);

// ─── Restitution ────────────────────────────────────────────────────────────
const M7_Restitution: Page = () => (
  <Frame mod={7} kind="atelier" beats={3}>
    <Title>Restitution : 2 minutes par binôme</Title>
    <Lede>Trois questions, pas de diaporama. Le groupe vote pour la meilleure idée d’amélioration.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M3Part n={1} tone="blue" title="Qu’avez-vous laissé faire à l’IA, et qu’avez-vous corrigé ?">
        Un exemple précis de correction vaut mieux qu’un long discours.
      </M3Part>
      <M3Part n={2} tone="coral" title="Qu’avez-vous refusé de lui donner ?">
        Données, décisions : où avez-vous gardé la main ?
      </M3Part>
      <M3Part n={3} tone="green" title="Quelle amélioration proposez-vous ?">
        Tirée de l’avis client : action, responsable, indicateur.
      </M3Part>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540 }}>
      <Timer id="restitution" minutes={2} label="Temps de parole" cls={A.right} style={{ width: 540, ...dl(300) }} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Le point clé attendu" tone="violet" icon="heart" size={23}>
        Ici, le plus important n’est pas le texte : c’est d’avoir repéré la <strong>vulnérabilité</strong>, protégé la donnée de santé, et{' '}
        <strong>escaladé</strong> pour trouver une solution avant lundi.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_Parcours, M7_Donnees, M7_Anonymiser, M7_Controle, M7_Limites, M7_Charte, M7_Kit, M7_Atelier, M7_Restitution];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 7 · OUVERTURE DE SECTION · 16:25

OBJECTIF — Annoncer la mise en pratique finale et les bonnes pratiques.

DIRE — « Dernier module. On assemble tout sur un parcours complet, de la demande à la satisfaction. Et on fixe les règles du jeu : confidentialité, contrôle humain, limites de l’IA. Puis atelier 6, le cas fil rouge final. »

TRANSITION — « Retour sur Mme Moreau. »`,
  `⏱ 4 min · LE PARCOURS COMPLET (onglets 1 → 6)

OBJECTIF — Visualiser les six étapes du programme sur le cas fil rouge.

DIRE — Cliquer chaque onglet. Demande, analyse, réponse, validation, suivi, satisfaction. À chaque étape, la répartition : ce que fait l’IA, ce que vous faites. Insister sur l’étape 6 : « L’avis 4/5 contient un irritant : il a fallu écrire deux fois. C’est lui qui a tout aggravé, et il remonte dans le reporting du module 6. »

INSISTER — La boucle est bouclée : l’analyse de satisfaction améliore le traitement des prochaines demandes.

TRANSITION — « Avant de vous lâcher sur le cas final, les règles. D’abord, les données. »`,
  `⏱ 4 min · CONFIDENTIALITÉ : JEU DE TRI (→ corrigé)

OBJECTIF — Savoir quelles données donner, remplacer ou ne jamais donner à l’IA.

DIRE — « Même dans l’outil autorisé, on applique le principe de minimisation : seulement ce qui est utile à la réponse. » Faire glisser les étiquettes par des volontaires, discuter les hésitations. → corrigé.

INSISTER — Données bancaires, mots de passe, données de santé : jamais. Les données de santé sont des données sensibles au sens du RGPD.

TRANSITION — « Comment remplacer vite ? »`,
  `⏱ 2 min · ANONYMISER (interrupteur)

OBJECTIF — Montrer une anonymisation rapide et efficace.

DIRE — Basculer. « On remplace par des crochets : l’IA garde le sens. On supprime ce qui ne sert à rien, comme la carte bancaire. Et on remet les vraies valeurs dans la réponse finale, dans l’outil client. »

TRANSITION — « Deuxième règle : le contrôle humain. »`,
  `⏱ 3 min · CONTRÔLE HUMAIN (→ ×3)

OBJECTIF — Clarifier qui décide quoi.

DIRE — → « Niveau 1 : l’IA m’aide, rien ne part au client. » → « Niveau 2 : je valide, toute réponse envoyée est relue. » → « Niveau 3 : je décide ; l’IA ne fait que préparer. Gestes, exceptions, clients vulnérables, litiges. » « Et dans tous les cas, la réponse part sous votre nom. »

TRANSITION — « Troisième point : les limites. »`,
  `⏱ 3 min · LIMITES ET PARADES (cartes, → retourne tout)

OBJECTIF — Récapituler les limites de l’IA et les parades vues dans la journée.

DIRE — Pour chaque carte, demander la parade avant de retourner. C’est une révision active de la journée. Insister sur la dernière : « Gardez la main. Une IA qui écrit tout à votre place, c’est une compétence que vous perdez. »

TRANSITION — « Tout ça tient en une charte. »`,
  `⏱ 2 min · CHARTE DE BONNES PRATIQUES

OBJECTIF — Donner un aide-mémoire personnel.

DIRE — « Dix règles. Cochez celles que vous appliquez déjà. Les autres sont vos objectifs. Photographiez la page. »

TRANSITION — « Place au cas final. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 6

OBJECTIF — Présenter le cas Ferreira et son piège.

DIRE — Lire le message lentement. « Qu’est-ce qui change par rapport à Mme Moreau ? » Laisser répondre : une personne âgée, une donnée de santé, un vendredi soir, une urgence réelle. « Vous avez la note SAV-07, vos prompts, la charte. Et après la résolution, l’avis de la cliente : 3 sur 5. »

TRANSITION — « Les consignes. »`,
  `⏱ 20 min · ATELIER 6 (minuteur 20 min)

OBJECTIF — Traiter une demande de bout en bout, en appliquant la charte.

DIRE — « Six étapes, en binôme. L’IA vous aide à chaque étape, mais certaines décisions sont à vous : lesquelles ? »

ANIMATION — Vérifier : l’insuline et le téléphone ne sont pas collés dans l’IA (on écrit « cliente vulnérable, besoin urgent de froid ») ; la priorité est P1 (fragilité + santé) ; une escalade est faite pour une solution d’urgence (intervention samedi, prêt d’appareil, geste) ; l’amélioration tirée de l’avis porte sur la prise en charge le week-end des clients vulnérables.

TRANSITION — « Restitution. »`,
  `⏱ 8 min · RESTITUTION (→ ×3 questions, minuteur 2 min par binôme)

OBJECTIF — Partager les traitements et valoriser les bonnes décisions.

DIRE — « Deux minutes, trois questions. » Lancer le minuteur pour chaque binôme. Après chaque passage, une remarque positive et une question.

INSISTER — Le point clé : vulnérabilité repérée, donnée de santé protégée, escalade avant lundi.

ANIMATION — Si le groupe est grand, faire passer 4 binômes et recueillir les autres améliorations à l’oral.

TRANSITION — « Il est temps de mesurer le chemin parcouru. »`,
];
// @@NOTES-END
