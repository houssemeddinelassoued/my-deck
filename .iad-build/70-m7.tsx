// ─── Cas fil rouge, bonnes pratiques & clôture ──────────────────────────────
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
    sub="Une demande, du premier email jusqu’au suivi : toute la journée en un seul cas. Puis les règles pour utiliser l’IA en sécurité."
    dur="16:00 – 17:00 · atelier final"
    labs={
      <Tag tone="green" size={19}>
        Atelier final · de la demande au suivi
      </Tag>
    }
  >
    <SecItem n={1}>Réception → analyse → rédaction → document → synthèse → suivi</SecItem>
    <SecItem n={2}>Vérifier les résultats</SecItem>
    <SecItem n={3}>Confidentialité et données personnelles</SecItem>
    <SecItem n={4}>Bonnes pratiques professionnelles</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Le cas : la chaîne en 6 étapes ─────────────────────────────────────────
const M7_CHAIN: { icon: IconName; tone: Tone; t: string; mod: string }[] = [
  { icon: 'inbox', tone: 'blue', t: 'Réception', mod: 'M1' },
  { icon: 'search', tone: 'yellow', t: 'Analyse', mod: 'M4' },
  { icon: 'mail', tone: 'teal', t: 'Rédaction', mod: 'M3' },
  { icon: 'doc', tone: 'navy', t: 'Document', mod: 'M4' },
  { icon: 'layers', tone: 'violet', t: 'Synthèse', mod: 'M6' },
  { icon: 'bell', tone: 'green', t: 'Suivi', mod: 'M5' },
];

const M7_Cas: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Le cas fil rouge : une demande arrive</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px', display: 'flex', gap: 24 }}>
      <IconTile name="mail" tone="blue" size={64} solid />
      <div style={{ fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        <div style={{ fontSize: 19, color: C.muted }}>De : Mme Benali, services généraux, Cabinet Arvel · À : contact@ · Lundi 8 h 12</div>
        « Bonjour, nous emménageons dans de nouveaux locaux le 15 décembre et cherchons <strong>12 postes de travail complets</strong> (bureau, fauteuil, caisson), plus une table de réunion pour 8. Budget autour de 20 000 €. Pouvez-vous aussi <strong>reprendre nos anciens bureaux</strong> ? Il nous faudrait une proposition rapidement. »
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      {M7_CHAIN.map((c, i) => (
        <div key={c.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
          <div className={b.pop(i + 1)} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[c.tone]}`, padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <IconTile name={c.icon} tone={c.tone} size={64} solid />
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{c.t}</div>
            <Tag tone="grey" size={17}>
              revu en {c.mod}
            </Tag>
          </div>
          {i < 5 ? <Icon name="arrow" size={28} color={C.faint} style={{ marginTop: 70 }} /> : null}
        </div>
      ))}
    </div>
    <div className={b.fade(6)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Le principe" tone="blue" icon="route" size={23}>
        Un prompt par étape, chacun avec un résultat que <strong>vous relisez avant de passer au suivant</strong>. Une erreur à l’étape 2 se propage sinon jusqu’au client.
      </Callout>
    </div>
  </Frame>
);

// ─── Étape par étape (onglets) ──────────────────────────────────────────────
const M7Step = ({ prompt, children }: { prompt: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr', gap: 28 }}>
    <Bubble who="user" w={560} size={21}>
      {prompt}
    </Bubble>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px', fontSize: 21, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M7_Etapes: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Le cas, étape par étape</Title>
    <Tabs initial="s1" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <TabBtn id="s1" tone="blue" icon="inbox">
          1 · Réception
        </TabBtn>
        <TabBtn id="s2" tone="yellow" icon="search">
          2 · Analyse
        </TabBtn>
        <TabBtn id="s3" tone="teal" icon="mail">
          3 · Rédaction
        </TabBtn>
        <TabBtn id="s4" tone="navy" icon="doc">
          4 · Document
        </TabBtn>
        <TabBtn id="s5" tone="violet" icon="layers">
          5 · Synthèse
        </TabBtn>
        <TabBtn id="s6" tone="green" icon="bell">
          6 · Suivi
        </TabBtn>
      </div>
      <TabPane id="s1">
        <M7Step prompt="Classe cette demande : type (devis, réclamation, information…), urgence (1 à 3) avec justification, service concerné.">
          <Bullet size={22} tone="blue"><strong>Type</strong> : demande de devis (+ question de reprise de mobilier)</Bullet>
          <Bullet size={22} tone="blue"><strong>Urgence</strong> : 2 : échéance 15 décembre, « rapidement »</Bullet>
          <Bullet size={22} tone="blue"><strong>Service</strong> : commercial (devis) + logistique (reprise)</Bullet>
        </M7Step>
      </TabPane>
      <TabPane id="s2">
        <M7Step prompt="Extrais les éléments de la demande dans un tableau. Liste ensuite les informations manquantes pour établir le devis.">
          <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.65 }}>
            Postes complets · 12 · Table réunion · 8 places
            <br />
            Échéance · 15/12 · Budget · ≈ 20 000 €
            <br />
            Reprise anciens bureaux · demandée
          </div>
          <div style={{ marginTop: 8, color: C.coral, fontWeight: 600 }}>Manque : adresse de livraison, étage / ascenseur, gamme souhaitée, nombre de bureaux à reprendre.</div>
        </M7Step>
      </TabPane>
      <TabPane id="s3">
        <M7Step prompt="Rédige l’accusé de réception à Mme Benali : remercie, confirme un devis sous 48 h, pose les 4 questions manquantes. Ne t’engage ni sur la reprise ni sur le délai de livraison. 120 mots.">
          Bonjour Madame Benali, merci pour votre demande. Nous vous adresserons une proposition sous 48 heures. Pour l’établir au plus juste, pourriez-vous nous préciser : l’adresse de livraison, l’étage et l’accès (ascenseur), la gamme souhaitée, et le nombre de bureaux à reprendre ? Concernant la reprise, je reviens vers vous après étude par notre service logistique. Bien cordialement,
        </M7Step>
      </TabPane>
      <TabPane id="s4">
        <M7Step prompt="Crée une fiche de demande interne pour le commercial : client, contact, besoin détaillé, échéance, budget, points en attente, prochaine action.">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '6px 16px' }}>
            <strong>Client</strong>
            <span>Cabinet Arvel · Mme Benali</span>
            <strong>Besoin</strong>
            <span>12 postes complets + table 8 places</span>
            <strong>Échéance</strong>
            <span>Livraison avant le 15/12</span>
            <strong>En attente</strong>
            <span style={{ color: C.coral }}>Adresse, accès, gamme, reprise</span>
            <strong>Action</strong>
            <span>Devis à envoyer avant mercredi 10 h</span>
          </div>
        </M7Step>
      </TabPane>
      <TabPane id="s5">
        <M7Step prompt="Résume ce dossier en 3 lignes pour M. Garnier, avec la décision qu’il doit prendre.">
          Nouvelle demande du Cabinet Arvel : 12 postes + table de réunion, environ 20 000 €, livraison avant le 15/12. Accusé de réception envoyé, devis sous 48 h.
          <div style={{ marginTop: 8, fontWeight: 700, color: C.violet }}>Décision : accepter ou non la reprise des anciens bureaux (non proposée à ce jour).</div>
        </M7Step>
      </TabPane>
      <TabPane id="s6">
        <M7Step prompt="Propose les étapes de suivi : ligne pour le tableau de suivi, relance si pas de réponse, rappel interne.">
          <Bullet size={22} tone="green">Tableau de suivi : Arvel · devis · envoyé le [DATE] · statut « attente infos »</Bullet>
          <Bullet size={22} tone="green">Relance client à J + 3 si pas de réponse (modèle « Relance 1 »)</Bullet>
          <Bullet size={22} tone="green">Rappel au commercial mercredi 9 h : devis à envoyer</Bullet>
        </M7Step>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: C.soft, ...dl(400) }}>
      <Icon name="shieldCheck" size={28} color={C.green} /> À l’étape 3, la contrainte « ne t’engage pas » évite une promesse que l’entreprise n’a pas décidée.
    </div>
  </Frame>
);

// ─── Atelier final ──────────────────────────────────────────────────────────
const M7_Atelier: Page = () => (
  <LabPage
    mod={7}
    n="5"
    title="Traiter une demande de bout en bout"
    defi="filrouge"
    who="En binôme"
    minutes={25}
    label="Cas fil rouge & bonnes pratiques"
    where={
      <>
        Les <strong>6 productions</strong> (classement, tableau, email, fiche, synthèse, suivi) et les <strong>prompts</strong> utilisés, à ranger dans votre bibliothèque.
      </>
    }
    objective={
      <>
        Appliquer toute la journée à une nouvelle demande : <strong>réception → analyse → rédaction → document → synthèse → suivi</strong>, en relisant chaque étape.
      </>
    }
    crit={
      <>
        <CheckItem id="a5-c1" size={21}>Les 6 étapes sont produites</CheckItem>
        <CheckItem id="a5-c2" size={21}>Les infos manquantes sont listées</CheckItem>
        <CheckItem id="a5-c3" size={21}>Aucun engagement non autorisé</CheckItem>
        <CheckItem id="a5-c4" size={21}>Chaque étape a été relue</CheckItem>
      </>
    }
  >
    <div style={{ background: T.blue.bg, borderRadius: 12, padding: '12px 16px', fontSize: 20, lineHeight: 1.5, color: C.ink, fontStyle: 'italic' }}>
      « Bonjour, je suis M. Caron, de l’école Jules-Verne. Trois de nos chaises livrées le mois dernier sont déjà cassées et nous voudrions aussi commander 30 chaises supplémentaires pour la rentrée de janvier. Que pouvez-vous faire ? »
    </div>
    <div style={{ marginTop: 10, fontSize: 21, color: C.soft }}>
      Attention : une <strong>réclamation</strong> et une <strong>commande</strong> dans le même message. Deux traitements, deux tons.
    </div>
    <Bonus>Présentez en 1 minute au groupe l’étape où l’IA vous a fait gagner le plus de temps.</Bonus>
  </LabPage>
);

// ─── Vérification des résultats ─────────────────────────────────────────────
const M7_Verifier: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Vérifier avant d’utiliser : la grille en 6 points</Title>
    <Lede>À passer sur chaque texte produit par l’IA, en particulier ceux qui sortent de l’entreprise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="v1" size={26} tone="blue">
          <strong>Les faits</strong> : chaque information figure dans mes sources
        </CheckItem>
        <CheckItem id="v2" size={26} tone="blue">
          <strong>Les chiffres</strong> : montants, dates, quantités recalculés ou recopiés
        </CheckItem>
        <CheckItem id="v3" size={26} tone="blue">
          <strong>Les noms</strong> : personnes, titres, orthographe, références
        </CheckItem>
        <CheckItem id="v4" size={26} tone="violet">
          <strong>Les engagements</strong> : aucune promesse que je ne peux pas tenir
        </CheckItem>
        <CheckItem id="v5" size={26} tone="violet">
          <strong>Le ton</strong> : adapté au destinataire et à la situation
        </CheckItem>
        <CheckItem id="v6" size={26} tone="coral">
          <strong>Les données</strong> : rien de confidentiel n’a été transmis ou recopié
        </CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={6}
          label="Prêt à envoyer ?"
          levels={[
            { min: 0, text: 'Pas encore : relisez.', tone: 'coral' },
            { min: 4, text: 'Presque : terminez la grille.', tone: 'yellow' },
            { min: 6, text: 'Vous pouvez signer.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Plus l’enjeu est fort (client, juridique, finances), plus la vérification est poussée, et plus on la fait valider.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Confidentialité : le feu tricolore ─────────────────────────────────────
const M7Light = ({ n, tone, title, rule, items, x }: { n: number; tone: Tone; title: string; rule: string; items: string[]; x: number }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 200, width: 540, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '26px 28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ width: 54, height: 54, borderRadius: 999, background: STRONG[tone], boxShadow: `0 0 0 8px ${T[tone].bg}` }} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 16, fontSize: 22, fontWeight: 600, color: T[tone].fg, lineHeight: 1.4 }}>{rule}</div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((it) => (
        <Bullet key={it} size={22} tone={tone}>
          {it}
        </Bullet>
      ))}
    </div>
  </div>
);

const M7_Confidentialite: Page = () => (
  <Frame mod={7} beats={3}>
    <Title>Confidentialité : le feu tricolore</Title>
    <M7Light
      n={1}
      x={120}
      tone="green"
      title="Vert"
      rule="Sans risque, avec tout outil autorisé"
      items={['Informations publiques', 'Textes génériques sans nom', 'Modèles, trames, procédures neutres', 'Questions de méthode (formules, plan)']}
    />
    <M7Light
      n={2}
      x={690}
      tone="yellow"
      title="Orange"
      rule="Uniquement avec l’outil professionnel, après anonymisation"
      items={['Emails clients ou fournisseurs', 'Comptes rendus internes', 'Tableaux de suivi, chiffres internes', 'Documents de travail']}
    />
    <M7Light
      n={3}
      x={1260}
      tone="coral"
      title="Rouge"
      rule="Jamais dans un assistant IA, sauf règle interne explicite"
      items={['Santé, salaires, RIB, n° de sécurité sociale', 'Mots de passe, codes d’accès', 'Données RH, sanctions, recrutement', 'Contrats et documents confidentiels']}
    />
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 870, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft }}>
      <Icon name="book" size={28} color={C.blue} />
      <span>La règle qui prime : <strong style={{ color: C.navy }}>la politique de votre organisation</strong>. En cas de doute, on demande au service informatique ou au DPO.</span>
    </div>
  </Frame>
);

// ─── Anonymiser (interrupteur) ──────────────────────────────────────────────
const M7X = ({ on, real, fake }: { on: boolean; real: string; fake: string }) =>
  on ? <span style={{ background: T.green.bg, color: T.green.fg, fontWeight: 700, borderRadius: 6, padding: '0 6px' }}>{fake}</span> : <span style={{ background: T.coral.bg, color: T.coral.fg, fontWeight: 700, borderRadius: 6, padding: '0 6px' }}>{real}</span>;

const M7_Anonymiser: Page = () => {
  const [on, setOn] = useState(false);
  return (
    <Frame mod={7} kind="demo">
      <Title>Données personnelles : anonymiser avant de coller</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={on} onChange={setOn} tone="green" size={28} label={<strong>Anonymiser le texte</strong>} />
        <Tag tone={on ? 'green' : 'coral'} size={22}>
          {on ? 'Prêt à être collé dans l’outil pro' : '5 données personnelles exposées'}
        </Tag>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1180, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', fontSize: 27, lineHeight: 1.7, color: C.ink, ...dl(150) }}>
        Rédige un courrier à <M7X on={on} real="M. Julien Fabre" fake="[CLIENT]" />, domicilié <M7X on={on} real="12 rue des Lilas, 44000 Nantes" fake="[ADRESSE]" />, pour l’informer que son dossier de prise en charge de <M7X on={on} real="son arrêt maladie" fake="[MOTIF]" /> est complet. Rappeler sa référence <M7X on={on} real="n° SS 1 85 05 44 109 087" fake="[RÉFÉRENCE]" /> et son téléphone <M7X on={on} real="06 52 18 44 90" fake="[TÉLÉPHONE]" />.
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 290, width: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="green" icon="checkCircle" title="Le résultat reste utile" size={21} pad={22} cls={A.right}>
          L’IA rédige le courrier avec des [CHAMPS]. Vous les remplacez dans Word, chez vous.
        </Card>
        <Card tone="coral" icon="alert" title="Santé = rouge" size={21} pad={22} cls={A.right} style={dl(150)}>
          Même anonymisé, un motif médical précis reste une donnée sensible : remplacez-le par un champ.
        </Card>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
        <Callout title="Ce que dit le RGPD, en une phrase" tone="blue" icon="shield" size={23}>
          Une donnée personnelle ne peut être utilisée que pour une finalité prévue, par un outil autorisé : <strong>la coller dans un service non validé, c’est la transmettre à un tiers</strong>.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Bonnes pratiques professionnelles ──────────────────────────────────────
const M7_RULES: [IconName, Tone, string, string][] = [
  ['book', 'blue', 'Je respecte la politique interne', 'Outils autorisés, usages permis, règles de mon service.'],
  ['lock', 'coral', 'Je protège les données', 'Feu tricolore, anonymisation, compte professionnel.'],
  ['eye', 'violet', 'Je vérifie tout ce qui sort', 'Faits, chiffres, noms, engagements, ton.'],
  ['pen', 'teal', 'Je signe, donc j’assume', 'L’IA ne porte aucune responsabilité : vous, si.'],
  ['chat', 'green', 'Je reste transparente', 'Je signale l’usage de l’IA quand la règle ou le contexte l’exige.'],
  ['archive', 'yellow', 'Je capitalise', 'Bibliothèque de prompts et modèles partagés avec l’équipe.'],
];

const M7_Pratiques: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Bonnes pratiques professionnelles : ma charte</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {M7_RULES.map(([icon, tone, t, d], i) => (
        <div key={t} className={b.pop(i + 1)} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '26px 28px', minHeight: 250, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconTile name={icon} tone={tone} size={58} solid />
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: C.muted }}>{pad(i + 1)}</span>
          </div>
          <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.2, color: C.navy }}>{t}</div>
          <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{d}</div>
        </div>
      ))}
    </div>
    <div className={b.fade(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Quote by="Le fil conducteur de la journée">L’IA prépare, vous vérifiez, vous signez.</Quote>
    </div>
  </Frame>
);

// ─── Quiz final ─────────────────────────────────────────────────────────────
const M7_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz final : êtes-vous prêt·e pour lundi ?</Title>
    <QuizSeries y={220}>
      <QuizQ q="Une collègue vous demande de faire résumer par l’IA le dossier disciplinaire d’un salarié. Feu…" explain="Données RH et sanctions : feu rouge. Elles ne vont pas dans un assistant IA, sauf règle interne explicite avec un outil validé.">
        <QOpt>Vert</QOpt>
        <QOpt>Orange, en anonymisant</QOpt>
        <QOpt ok>Rouge</QOpt>
      </QuizQ>
      <QuizQ q="Dans le cas fil rouge, pourquoi relire après chaque étape ?" explain="Chaque étape réutilise la précédente : une erreur d’analyse se retrouve dans l’email, la fiche, la synthèse… jusqu’au client.">
        <QOpt>Pour faire plaisir au responsable</QOpt>
        <QOpt ok>Parce qu’une erreur se propage aux étapes suivantes</QOpt>
        <QOpt>Ce n’est pas utile si le prompt est bon</QOpt>
      </QuizQ>
      <QuizQ q="Quel est le premier réflexe pour un prompt qui marche bien ?" explain="Un bon prompt se range dans la bibliothèque, avec des [CROCHETS] pour ce qui change : il resservira la semaine prochaine.">
        <QOpt ok>Le ranger dans ma bibliothèque, avec des [CROCHETS]</QOpt>
        <QOpt>Le garder dans l’historique de l’outil</QOpt>
        <QOpt>Le réécrire de mémoire la prochaine fois</QOpt>
      </QuizQ>
      <QuizQ q="Un email généré contient une date que vous ne retrouvez dans aucune source. Vous…" explain="Une information introuvable dans les sources est probablement inventée : on la supprime ou on la vérifie avant tout envoi.">
        <QOpt>la gardez, l’IA a sûrement raison</QOpt>
        <QOpt ok>la vérifiez ou la retirez avant l’envoi</QOpt>
        <QOpt>ajoutez « sous réserve »</QOpt>
      </QuizQ>
      <QuizQ q="Qui est responsable d’un courrier rédigé avec l’IA et envoyé à un client ?" explain="L’IA est un outil. La personne qui envoie, et l’organisation au nom de laquelle elle écrit, restent responsables du contenu.">
        <QOpt>L’éditeur de l’IA</QOpt>
        <QOpt ok>Moi et mon organisation</QOpt>
        <QOpt>Personne, c’est automatique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const M7_AutoPos: Page = () => (
  <Frame mod={7} kind="exercice" label="Clôture · auto-positionnement">
    <Title>Auto-positionnement : et maintenant ?</Title>
    <Lede>Les huit affirmations de ce matin : cochez ce que vous savez faire maintenant.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="apf1">Expliquer ce qu’une IA générative sait faire… et ce qu’elle ne sait pas faire</CheckItem>
        <CheckItem id="apf2">Écrire une demande précise avec contexte, contraintes et format attendu</CheckItem>
        <CheckItem id="apf3">Faire rédiger ou reformuler un email dans le bon ton</CheckItem>
        <CheckItem id="apf4">Transformer des notes de réunion en compte rendu avec plan d’action</CheckItem>
        <CheckItem id="apf5">Faire extraire des informations précises d’un long document</CheckItem>
        <CheckItem id="apf6">Faire résumer un tableau de chiffres et en vérifier le résultat</CheckItem>
        <CheckItem id="apf7">Réutiliser des modèles de prompts au lieu de repartir de zéro</CheckItem>
        <CheckItem id="apf8">Dire quelles informations ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau ce soir"
          levels={[
            { min: 0, text: 'Reprenez les fiches du support à tête reposée.', tone: 'grey' },
            { min: 4, text: 'Belle progression : pratiquez dès lundi.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : partagez vos prompts !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Écart avec ce matin = votre progression du jour. Notez-le sur la fiche d’évaluation.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Mon plan pour lundi ────────────────────────────────────────────────────
const M7Plan = ({ when, tone, icon, children, d }: { when: string; tone: Tone; icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '20px 26px', display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{when}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Lundi: Page = () => (
  <Frame mod={7} kind="exercice" label="Clôture · mon plan d’action">
    <Title>Mon plan d’action : dès lundi matin</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 860, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M7Plan when="Lundi" tone="blue" icon="bolt" d={100}>
        Vérifier quel outil IA mon organisation autorise, et me connecter avec le compte professionnel.
      </M7Plan>
      <M7Plan when="Cette semaine" tone="violet" icon="chat" d={200}>
        Utiliser l’IA sur ma tâche n° 1 de l’atelier 1, avec un prompt de ma bibliothèque.
      </M7Plan>
      <M7Plan when="Ce mois-ci" tone="green" icon="archive" d={300}>
        Créer 3 modèles (email type, compte rendu, reporting) et les partager à l’équipe.
      </M7Plan>
      <M7Plan when="Toujours" tone="coral" icon="shieldCheck" d={400}>
        Feu tricolore avant de coller, grille de vérification avant d’envoyer.
      </M7Plan>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1040, top: 200, width: 760, ...dl(300) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        La tâche que je confie à l’IA en premier
      </Eyebrow>
      <Poll>
        <PollRow id="l-1" label="Répondre aux emails et relancer" tone="teal" icon="mail" />
        <PollRow id="l-2" label="Rédiger les comptes rendus" tone="navy" icon="doc" />
        <PollRow id="l-3" label="Préparer réunions et plannings" tone="green" icon="calendar" />
        <PollRow id="l-4" label="Analyser tableaux et reporting" tone="yellow" icon="table" />
        <PollRow id="l-5" label="Résumer et extraire des documents" tone="violet" icon="search" />
      </Poll>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const M7_Merci: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1000 }}>
      <Eyebrow c={C.violet} size={24} cls={A.in}>
        Fin de la formation
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '20px 0 0', fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, maxWidth: 940, ...dl(240) }}>
        Vous repartez avec une méthode, une bibliothèque de prompts et des réflexes de sécurité. Le reste, c’est la pratique : <strong style={{ color: C.navy }}>un peu chaque jour</strong>.
      </p>
      <div className={A.in} style={{ marginTop: 40, ...dl(400) }}>
        <Quote>L’IA prépare, vous vérifiez, vous signez.</Quote>
      </div>
    </div>
    <Portrait w={170} x={390} y={700} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 724, ...dl(500) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Questions, retours, prompts à partager : je reste disponible.</div>
      <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
        <Tag tone="green" size={20}>
          <Icon name="checkCircle" size={20} /> Fiche d’évaluation
        </Tag>
        <Tag tone="violet" size={20}>
          <Icon name="archive" size={20} /> Bibliothèque commune envoyée
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1460, top: 190, width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {M7_CHAIN.map((c, i) => (
        <div key={c.t} className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(600 + i * 100) }}>
          <IconTile name={c.icon} tone={c.tone} size={56} solid />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.navy }}>{c.t}</span>
        </div>
      ))}
    </div>
    <Footer left={390} />
  </Frame>
);
M7_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M7_Section, M7_Cas, M7_Etapes, M7_Atelier, M7_Verifier, M7_Confidentialite, M7_Anonymiser, M7_Pratiques, M7_Quiz, M7_AutoPos, M7_Lundi, M7_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION CAS FIL ROUGE · 16:00

OBJECTIF — Annoncer la dernière heure : tout assembler, puis sécuriser.

DIRE — « Dernière ligne droite. On va reprendre toute la journée sur un seul cas : une demande arrive, on la traite de bout en bout, de la réception jusqu’au suivi. Puis on termine par ce qui conditionne tout le reste : vérifier, protéger les données, et les bonnes pratiques professionnelles. »

TRANSITION — « Voici la demande. »`,
  `⏱ 3 min · LE CAS FIL ROUGE (6 clics)

OBJECTIF — Présenter la demande et la chaîne en six étapes.

DIRE — « Lundi, 8 h 12, un email arrive sur l’adresse générique. Mme Benali veut 12 postes de travail, une table de réunion, un budget, une échéance… et une question sur la reprise des anciens bureaux. » Un clic par étape : « Réception : on qualifie. Analyse : on extrait et on repère ce qui manque. Rédaction : on répond. Document : on prépare la fiche interne. Synthèse : on informe le directeur. Suivi : on programme les relances. Chaque étape mobilise un module de la journée. » Dernier clic : « Le principe : un prompt par étape, et vous relisez avant de passer à la suivante. »

TRANSITION — « Voyons chaque étape. »`,
  `⏱ 6 min · ÉTAPE PAR ÉTAPE (onglets)

OBJECTIF — Montrer le prompt et le résultat de chaque étape.

DIRE — Cliquer chaque onglet. « 1 : classer la demande, avec une justification de l’urgence. 2 : extraire dans un tableau, et surtout lister ce qui manque. 3 : l’accusé de réception, qui pose les questions manquantes et ne s’engage ni sur la reprise ni sur le délai. 4 : la fiche interne pour le commercial. 5 : trois lignes pour M. Garnier, avec la décision qu’il doit prendre. 6 : le suivi : ligne de tableau, relance, rappel. »

INSISTER — L’étape 3 : sans la contrainte « ne t’engage pas », l’IA aurait volontiers promis la reprise des bureaux.

TRANSITION — « À vous de jouer sur une nouvelle demande. »`,
  `⏱ 25 min · ATELIER FINAL (minuteur)

OBJECTIF — Appliquer toute la journée à un cas nouveau, en binôme.

DIRE — « Une nouvelle demande, de M. Caron, d’une école. Attention : elle contient une réclamation et une commande. Deux traitements, deux tons. Vous produisez les six étapes, en relisant chacune. Vingt-cinq minutes. Rangez vos prompts dans votre bibliothèque. »

ANIMATION — Lancer le minuteur. Passer dans les rangs : vérifier que la réclamation est traitée avec A-R-S-S, qu’aucun remplacement gratuit n’est promis sans décision, et que les informations manquantes (références des chaises, date de livraison, adresse) sont listées. Garder dix minutes en fin d’atelier pour deux ou trois restitutions d’une minute.

TRANSITION — « Avant de conclure, la grille de vérification. »`,
  `⏱ 3 min · VÉRIFIER LES RÉSULTATS (checklist)

OBJECTIF — Donner une grille de vérification simple et réutilisable.

DIRE — « Six points à passer sur chaque texte produit par l’IA. Les faits, les chiffres, les noms : c’est là que se cachent les inventions. Les engagements : aucune promesse non décidée. Le ton. Et les données : rien de confidentiel. » Cocher les lignes avec le groupe en reprenant l’email de l’atelier. « Plus l’enjeu est fort, plus la vérification est poussée, et plus on fait valider. »

TRANSITION — « Le dernier point mérite qu’on s’y arrête : les données. »`,
  `⏱ 4 min · FEU TRICOLORE (3 clics)

OBJECTIF — Donner une règle simple pour savoir ce qu’on peut coller.

DIRE — Clic 1 : « Vert : informations publiques, textes génériques, questions de méthode. Aucun risque. » Clic 2 : « Orange : emails clients, comptes rendus, chiffres internes. Uniquement avec l’outil professionnel autorisé, et après anonymisation. » Clic 3 : « Rouge : santé, salaires, coordonnées bancaires, mots de passe, données RH, contrats confidentiels. Jamais, sauf règle interne explicite. » Puis : « Et au-dessus de tout, la politique de votre organisation. En cas de doute, demandez au service informatique ou au délégué à la protection des données. »

ANIMATION — Faire classer à l’oral deux ou trois exemples apportés par le groupe.

TRANSITION — « Comment anonymiser concrètement ? »`,
  `⏱ 3 min · ANONYMISER (interrupteur)

OBJECTIF — Montrer une anonymisation simple et efficace.

DIRE — « Une demande banale : un courrier à un salarié. Mais regardez : nom, adresse, numéro de sécurité sociale, téléphone, et un motif médical. Cinq données personnelles. » Basculer. « Chaque donnée devient un champ entre crochets. L’IA rédige le courrier aussi bien, et vous remplacez les champs dans Word. Notez que le motif médical reste sensible même sans le nom : on le remplace aussi. »

INSISTER — La phrase du RGPD : coller une donnée personnelle dans un service non validé, c’est la transmettre à un tiers.

TRANSITION — « Pour finir, votre charte personnelle. »`,
  `⏱ 3 min · CHARTE DES BONNES PRATIQUES (6 clics)

OBJECTIF — Synthétiser les règles professionnelles de la journée.

DIRE — Un clic par règle : « Je respecte la politique interne. Je protège les données. Je vérifie tout ce qui sort. Je signe, donc j’assume : l’IA n’est jamais responsable, vous l’êtes. Je reste transparente quand la règle ou le contexte l’exige. Et je capitalise : prompts et modèles partagés. » Dernier clic : la citation.

TRANSITION — « Un dernier quiz pour valider la journée. »`,
  `⏱ 4 min · QUIZ FINAL (5 questions)

OBJECTIF — Évaluer les acquis de la journée, notamment sécurité et vérification.

DIRE — « Cinq questions qui reprennent toute la journée. »

ANIMATION — Cliquer les réponses majoritaires, lire les explications. Le score s’affiche à la fin : le commenter positivement.

TRANSITION — « Mesurons votre progression. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression, exigence du dispositif d’évaluation.

DIRE — « Les huit mêmes affirmations que ce matin. Cochez ce que vous savez faire maintenant, sans aide. Comparez avec votre score de ce matin et notez l’écart sur la fiche d’évaluation. »

ANIMATION — Faire un tour rapide : « Qui a gagné plus de trois points ? » Valoriser la progression.

TRANSITION — « Et maintenant, que faites-vous lundi ? »`,
  `⏱ 3 min · PLAN D’ACTION (sondage)

OBJECTIF — Transformer la formation en engagements concrets.

DIRE — « Quatre horizons. Lundi : vérifier l’outil autorisé et se connecter avec le compte pro. Cette semaine : votre tâche numéro un de ce matin. Ce mois-ci : trois modèles partagés. Et toujours : le feu tricolore et la grille de vérification. » Puis le sondage : « Quelle tâche allez-vous confier à l’IA en premier ? »

ANIMATION — Cliquer une ligne par vote. Comparer avec le sondage du matin sur les tâches chronophages.

TRANSITION — « Il ne me reste qu’à vous remercier. »`,
  `⏱ 2 min · MERCI · 17:00

OBJECTIF — Clore sur le fil conducteur et les suites.

DIRE — « Merci pour votre participation et votre énergie. Vous repartez avec une méthode, R-C-T-C-F, une bibliothèque de prompts, et des réflexes de sécurité. Le reste, c’est la pratique : un peu chaque jour. Je vous envoie la bibliothèque commune construite aujourd’hui. Et souvenez-vous : l’IA prépare, vous vérifiez, vous signez. »

ANIMATION — Distribuer ou rappeler la fiche d’évaluation à chaud. Laisser la page affichée pendant les questions.`,
];
// @@NOTES-END
