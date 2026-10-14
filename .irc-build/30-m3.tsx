// ─── Module 3 · Rédiger des réponses clients avec l’IA ─────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Rédiger des réponses
        <br />
        clients avec l’IA
      </>
    }
    sub="Des réponses claires, justes et personnalisées, au bon ton et dans la bonne langue : l’IA rédige le brouillon, vous signez la réponse."
    dur="11:10 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · créer plusieurs réponses à partir de situations clients
      </Tag>
    }
  >
    <SecItem n={1}>Une réponse claire et professionnelle</SecItem>
    <SecItem n={2}>Reformuler et retoucher un brouillon</SecItem>
    <SecItem n={3}>Personnaliser et adapter le ton au canal</SecItem>
    <SecItem n={4}>Modèles de réponses et demandes complexes</SecItem>
    <SecItem n={5}>Traduire sans perdre le sens</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Anatomie d’une bonne réponse ───────────────────────────────────────────
const M3Part = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '12px 20px 12px 24px' }}>
    <Num n={n} tone={tone} size={40} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: C.navy }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Anatomie: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Anatomie d’une bonne réponse client</Title>
    <Lede>Cinq briques, toujours dans le même ordre. → les repère dans la réponse à Mme Moreau.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 36px', fontSize: 25, lineHeight: 1.62, color: C.ink, ...dl(100) }}
    >
      <p style={{ margin: 0 }}>
        <Mk n={1} tone="blue">
          Bonjour Madame Moreau,
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={2} tone="coral">
          Je suis sincèrement désolé : un retard de 6 jours, puis une fuite dès le premier lavage, et un premier message resté sans réponse. Je comprends
          votre exaspération.
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={3} tone="violet">
          Votre lave-linge est sous garantie : je vous propose, au choix, son échange ou l’intervention d’un technicien sous 72 h.
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={4} tone="green">
          Répondez simplement « échange » ou « technicien » : je m’occupe de la suite dès réception et je vous confirme le rendez-vous par SMS.
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={5} tone="teal">Bien cordialement, Karim · service client Nova Maison · 01 23 45 67 89</Mk>
      </p>
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 262, width: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Part n={1} tone="blue" title="Saluer, personnellement">
        Le nom du client, sans formule toute faite.
      </M3Part>
      <M3Part n={2} tone="coral" title="Reconnaître la situation">
        Reprendre les faits et l’émotion : il a été lu.
      </M3Part>
      <M3Part n={3} tone="violet" title="Répondre, apporter la solution">
        La réponse d’abord, l’explication ensuite.
      </M3Part>
      <M3Part n={4} tone="green" title="Donner la prochaine étape">
        Qui fait quoi, quand, et comment le client agit.
      </M3Part>
      <M3Part n={5} tone="teal" title="Conclure et signer">
        Un prénom, un service, un moyen de recontacter.
      </M3Part>
    </div>
  </Frame>
);

// ─── Clair et professionnel : avant / après ─────────────────────────────────
const M3Fix = ({ n, bad, good }: { n: number; bad: string; good: string }) => (
  <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
    <div style={{ flex: 1, background: T.coral.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, lineHeight: 1.4, color: C.ink, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon name="x" size={24} color={C.coral} sw={3} />
      <span>{bad}</span>
    </div>
    <FlowArrow w={56} color={C.faint} />
    <div className={b.left(n)} style={{ flex: 1, background: T.green.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, lineHeight: 1.4, color: C.ink, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon name="check" size={24} color={C.green} sw={3} />
      <span>{good}</span>
    </div>
  </div>
);

const M3_Clair: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Clair et professionnel : cinq défauts que l’IA corrige bien</Title>
    <Lede>Demandez-lui : « Réécris en phrases courtes, sans jargon, la réponse en premier. » → corrige chaque défaut.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', gap: 18, fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      <span style={{ flex: 1, color: T.coral.fg }}>Ce qu’on lit souvent</span>
      <span style={{ width: 56 }} />
      <span style={{ flex: 1, color: T.green.fg }}>Ce que le client comprend</span>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 292, width: 1680, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
      <M3Fix n={1} bad="« Votre dossier est en cours de traitement par le service compétent. »" good="« Le service SAV examine votre demande ; vous aurez sa réponse vendredi au plus tard. »" />
      <M3Fix n={2} bad="« Conformément à l’article 7.2 de nos CGV relatives aux modalités de rétractation… »" good="« Vous avez 14 jours à partir de la livraison pour nous retourner l’article. »" />
      <M3Fix n={3} bad="« Le RMA a été créé, l’AR transporteur suivra sous J+2. »" good="« Votre retour est enregistré ; vous recevrez l’étiquette d’envoi d’ici 2 jours. »" />
      <M3Fix n={4} bad="Une phrase de 6 lignes qui explique tout avant de répondre." good="La réponse dans la 1re phrase, l’explication ensuite, en phrases courtes." />
      <M3Fix n={5} bad="« N’hésitez pas à revenir vers nous pour toute information. »" good="« Si l’étiquette n’arrive pas jeudi, répondez à ce message : je vous la renvoie. »" />
    </div>
  </Frame>
);

// ─── Retoucher un brouillon (boutons) ───────────────────────────────────────
const M3_VERS: Record<string, { label: string; prompt: string; text: ReactNode }> = {
  base: {
    label: 'Brouillon du conseiller',
    prompt: '—',
    text: (
      <>
        Bonjour, suite à votre réclamation concernant le retard de votre commande, nous vous informons que conformément à nos CGV le délai de livraison
        est donné à titre indicatif et que le transporteur a rencontré des difficultés logistiques indépendantes de notre volonté, nous avons relancé ce
        dernier et votre colis devrait vous parvenir sous 3 jours ouvrés. Cordialement.
      </>
    ),
  },
  clair: {
    label: 'Plus clair',
    prompt: 'Réécris ce brouillon : réponse en premier, phrases courtes, sans jargon. Ne change aucun fait.',
    text: (
      <>
        Bonjour Madame Leroy,
        <br />
        Votre colis arrivera sous 3 jours ouvrés. Notre transporteur a pris du retard ; je l’ai relancé ce matin.
        <br />
        Je vous envoie le lien de suivi dès qu’il est actif.
        <br />
        Bien cordialement, Inès
      </>
    ),
  },
  court: {
    label: 'Plus court',
    prompt: 'Réduis à 3 phrases maximum pour un chat, en gardant toutes les informations.',
    text: <>Bonjour Mme Leroy, votre colis a été retardé par le transporteur, que j’ai relancé. Il arrivera sous 3 jours ouvrés. Je vous envoie le suivi dès que possible.</>,
  },
  chaleur: {
    label: 'Plus chaleureux',
    prompt: 'Rends le ton plus chaleureux et empathique, sans en faire trop et sans promesse nouvelle.',
    text: (
      <>
        Bonjour Madame Leroy,
        <br />
        Je suis vraiment désolée pour ce retard, j’imagine que vous attendiez ce colis avec impatience. J’ai relancé notre transporteur ce matin : il
        arrivera sous 3 jours ouvrés, et je vous envoie le suivi dès qu’il est actif.
        <br />
        Belle journée, Inès
      </>
    ),
  },
  formel: {
    label: 'Plus formel',
    prompt: 'Adopte un registre formel et soutenu, adapté à un courrier officiel.',
    text: (
      <>
        Madame,
        <br />
        Nous vous prions de bien vouloir nous excuser pour le retard de livraison de votre commande. Notre transporteur, que nous avons relancé, nous
        indique une livraison sous 3 jours ouvrés. Nous vous adresserons le lien de suivi dès sa mise à disposition.
        <br />
        Veuillez agréer, Madame, l’expression de nos salutations distinguées.
      </>
    ),
  },
};

const M3VBtn = ({ id, cur, set, tone }: { id: string; cur: string; set: (s: string) => void; tone: Tone }) => (
  <Btn tone={tone} ghost={cur !== id} size={22} onClick={() => set(id)} style={{ width: '100%', justifyContent: 'flex-start' }}>
    {M3_VERS[id].label}
  </Btn>
);

const M3_Retouches: Page = () => {
  const [cur, set] = useState('base');
  const v = M3_VERS[cur];
  return (
    <Frame mod={3} kind="simu">
      <Title>Reformuler : retoucher un brouillon en un clic</Title>
      <Lede>Votre brouillon est juste, mais lourd. Choisissez une retouche : regardez ce qui change… et ce qui ne change pas.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 380, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <M3VBtn id="base" cur={cur} set={set} tone="grey" />
        <M3VBtn id="clair" cur={cur} set={set} tone="blue" />
        <M3VBtn id="court" cur={cur} set={set} tone="teal" />
        <M3VBtn id="chaleur" cur={cur} set={set} tone="pink" />
        <M3VBtn id="formel" cur={cur} set={set} tone="navy" />
        <div style={{ marginTop: 14 }}>
          <Callout title="Règle d’or" tone="coral" icon="lock" size={21}>
            Une retouche ne change jamais les faits : « 3 jours ouvrés » reste 3 jours ouvrés.
          </Callout>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 550, top: 262, width: 1250, ...dl(200) }}>
        <Code title="Prompt de retouche" size={21} style={{ whiteSpace: 'pre-wrap', minHeight: 70 }}>
          {v.prompt}
        </Code>
        <div
          key={cur}
          className={A.fade}
          style={{ marginTop: 18, height: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 34px', fontSize: 26, lineHeight: 1.55, color: C.ink, animationDuration: '400ms' } as CSSProperties}
        >
          <Eyebrow c={cur === 'base' ? C.muted : C.violet} size={17} style={{ marginBottom: 10 }}>
            {cur === 'base' ? 'Avant' : `Après · ${v.label.toLowerCase()}`}
          </Eyebrow>
          {v.text}
        </div>
      </div>
    </Frame>
  );
};

// ─── Le ton selon le canal (onglets) ────────────────────────────────────────
const M3Chan = ({ icon, tone, rules, children }: { icon: IconName; tone: Tone; rules: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 30, marginTop: 22 }}>
    <div style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 34px', fontSize: 25, lineHeight: 1.55, color: C.ink, minHeight: 440, boxSizing: 'border-box' }}>
      {children}
    </div>
    <div style={{ width: 520, flex: 'none', background: T[tone].bg, borderRadius: 20, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Icon name={icon} size={28} color={T[tone].fg} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, letterSpacing: '0.06em', textTransform: 'uppercase', color: T[tone].fg }}>Les codes du canal</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{rules}</div>
    </div>
  </div>
);

const M3_Canal: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Adapter le ton : la même réponse, quatre canaux</Title>
    <Lede>Situation : remboursement d’un retour en retard. Cliquez un canal ; le fond ne bouge pas, la forme s’adapte.</Lede>
    <Tabs initial="mail" cls={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <TabBtn id="mail" icon="mail" tone="blue">
          Email
        </TabBtn>
        <TabBtn id="chat" icon="chat" tone="teal">
          Chat
        </TabBtn>
        <TabBtn id="tel" icon="phone" tone="violet">
          Téléphone
        </TabBtn>
        <TabBtn id="rs" icon="megaphone" tone="pink">
          Réseau social (public)
        </TabBtn>
      </div>
      <TabPane id="mail">
        <M3Chan
          icon="mail"
          tone="blue"
          rules={
            <>
              <Bullet size={22}>Structuré : salutation, 3 paragraphes, signature</Bullet>
              <Bullet size={22}>Peut contenir le détail et les références</Bullet>
              <Bullet size={22}>Vouvoiement, registre professionnel</Bullet>
            </>
          }
        >
          Bonjour Monsieur Garnier,
          <br />
          Votre retour a bien été reçu le 2 octobre et votre remboursement de 189 € a été validé aujourd’hui. Je suis désolé pour ce délai, plus long
          que nos 14 jours habituels.
          <br />
          Il apparaîtra sur votre compte sous 3 à 5 jours ouvrés, selon votre banque.
          <br />
          Bien cordialement, Julien · service client Nova Maison
        </M3Chan>
      </TabPane>
      <TabPane id="chat">
        <M3Chan
          icon="chat"
          tone="teal"
          rules={
            <>
              <Bullet size={22} tone="teal">Messages courts, une idée par message</Bullet>
              <Bullet size={22} tone="teal">Réactif et direct, toujours poli</Bullet>
              <Bullet size={22} tone="teal">Vérifier que le client a tout compris</Bullet>
            </>
          }
        >
          Merci pour votre patience, M. Garnier.
          <br />
          Bonne nouvelle : votre remboursement de 189 € est validé aujourd’hui ✅
          <br />
          Comptez 3 à 5 jours ouvrés pour le voir sur votre compte.
          <br />
          Désolé pour l’attente. Puis-je vous aider pour autre chose ?
        </M3Chan>
      </TabPane>
      <TabPane id="tel">
        <M3Chan
          icon="phone"
          tone="violet"
          rules={
            <>
              <Bullet size={22} tone="violet">Phrases simples, faciles à dire à voix haute</Bullet>
              <Bullet size={22} tone="violet">Chiffres répétés, reformulation finale</Bullet>
              <Bullet size={22} tone="violet">Une trame, pas un texte à lire mot à mot</Bullet>
            </>
          }
        >
          <em style={{ color: C.muted }}>Trame d’appel :</em>
          <br />
          « Monsieur Garnier, j’ai une bonne nouvelle pour vous. »
          <br />
          « Votre remboursement est validé aujourd’hui : <strong>189 euros</strong>. »
          <br />
          « Il faut compter 3 à 5 jours ouvrés selon votre banque. »
          <br />
          « Je suis désolé pour l’attente. Avez-vous d’autres questions ? »
        </M3Chan>
      </TabPane>
      <TabPane id="rs">
        <M3Chan
          icon="megaphone"
          tone="pink"
          rules={
            <>
              <Bullet size={22} tone="pink">Réponse publique : visible par tous</Bullet>
              <Bullet size={22} tone="pink">Aucune donnée personnelle, aucun montant</Bullet>
              <Bullet size={22} tone="pink">Reconnaître, puis basculer en message privé</Bullet>
            </>
          }
        >
          Bonjour @agarnier, nous sommes désolés pour ce délai, ce n’est pas l’expérience que nous voulons vous offrir. Nous venons de vous écrire en
          message privé pour faire le point sur votre remboursement. L’équipe Nova Maison
        </M3Chan>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Personnaliser : les bons ingrédients ───────────────────────────────────
const M3Ing = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 16, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 24, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Perso: Page = () => (
  <Frame mod={3}>
    <Title>Personnaliser sans en dire trop</Title>
    <Lede>Ce qu’on donne à l’IA pour qu’elle personnalise, et ce qu’on garde pour soi.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 860, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.green.fg} size={20} cls={A.fade}>
        Utile à la réponse
      </Eyebrow>
      <M3Ing icon="user" tone="green" title="Civilité et nom d’usage" d={100}>
        « Madame Moreau », plutôt que « Cher client »
      </M3Ing>
      <M3Ing icon="cart" tone="green" title="Produit et situation" d={180}>
        Lave-linge, livré le 6, fuite au 1er lavage
      </M3Ing>
      <M3Ing icon="loop" tone="green" title="Historique utile" d={260}>
        2e relance, ancien client, appel de jeudi
      </M3Ing>
      <M3Ing icon="calendar" tone="green" title="Contraintes exprimées" d={340}>
        Absent jeudi, joignable après 18 h, réception samedi
      </M3Ing>
      <M3Ing icon="book" tone="green" title="Procédure applicable" d={420}>
        Garantie, délais, options proposées au client
      </M3Ing>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.coral.fg} size={20} cls={A.fade} style={dl(500)}>
        Inutile, et risqué
      </Eyebrow>
      <M3Ing icon="lock" tone="coral" title="Coordonnées bancaires, IBAN, carte" d={560}>
        Jamais dans une IA, même autorisée
      </M3Ing>
      <M3Ing icon="eyeOff" tone="coral" title="Adresse, téléphone, email complets" d={640}>
        Remplacez par [ADRESSE], [TÉL]
      </M3Ing>
      <M3Ing icon="heart" tone="coral" title="Santé, situation familiale, opinions" d={720}>
        Données sensibles : on n’en a pas besoin
      </M3Ing>
      <div className={A.in} style={dl(820)}>
        <Callout title="Le test" tone="blue" icon="eye" size={23}>
          « Cette information change-t-elle ma réponse ? » Si non, elle ne va pas dans le prompt.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Modèles de réponses ────────────────────────────────────────────────────
const M3_Modele: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Un modèle de réponse pour toute l’équipe</Title>
    <Lede>Des parties fixes, validées une fois ; des variables, remplies à chaque fois. → montre comment l’IA l’améliore.</Lede>
    <CodeDark file="modele-retard-livraison.txt" size={21} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900, height: 600, ...dl(100) }}>
      Bonjour <Hole>civilité + nom</Hole>,{'\n\n'}
      Je suis désolé(e) : votre commande <Hole>n° commande</Hole> n’est pas arrivée à la date prévue, le <Hole>date prévue</Hole>.{'\n\n'}
      Notre transporteur m’indique une livraison le <Hole>nouvelle date</Hole>. <Cc>{'{Si retard > 7 jours}'}</Cc> Pour ce désagrément,{' '}
      <Hole>geste prévu par la procédure</Hole>.{'\n\n'}
      Votre lien de suivi : <Hole>lien</Hole>. Si le colis n’est pas arrivé le <Hole>date + 1</Hole>, répondez à ce message : je m’en occupe
      en priorité.{'\n\n'}
      Bien cordialement,{'\n'}
      <Hole>prénom</Hole> · service client Nova Maison
    </CodeDark>
    <div style={{ position: 'absolute', left: 1070, top: 262, width: 730, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={b.on(1)}>
        <Code title="Prompt d’amélioration" size={20} style={{ whiteSpace: 'pre-wrap' }}>
          Voici notre modèle de réponse « retard de livraison ». Propose 3 améliorations pour le rendre plus clair et plus chaleureux. Garde toutes les
          variables entre crochets et ne crée aucun engagement nouveau.
        </Code>
      </div>
      <div className={b.on(2)} style={{ background: T.violet.bg, borderRadius: 18, padding: '18px 24px', fontSize: 22, lineHeight: 1.45, color: C.ink }}>
        <Eyebrow c={T.violet.fg} size={17} style={{ marginBottom: 6 }}>
          Suggestions de l’IA
        </Eyebrow>
        1. Donner la nouvelle date dès la 1re phrase.
        <br />
        2. Remplacer « désolé(e) » par une phrase qui reconnaît la gêne.
        <br />
        3. Ajouter une variante si la date est inconnue.
      </div>
      <div className={b.on(3)}>
        <Callout title="Qui valide ?" tone="green" icon="humanCheck" size={22}>
          Le modèle est relu par le référent qualité avant d’être partagé : c’est lui qui engage l’entreprise.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Demandes complexes ─────────────────────────────────────────────────────
const M3QA = ({ n, q, a, todo = false }: { n: number; q: string; a: ReactNode; todo?: boolean }) => (
  <div className={b.on(n + 1)} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${todo ? C.yellow : C.violet}`, padding: '12px 20px 12px 24px' }}>
    <div style={{ fontWeight: 700, fontSize: 21, color: C.navy }}>
      {n}. {q}
    </div>
    <div style={{ marginTop: 3, fontSize: 21, lineHeight: 1.4, color: todo ? T.yellow.fg : C.soft, fontWeight: todo ? 700 : 400 }}>{a}</div>
  </div>
);

const M3_Complexe: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Les demandes complexes : découper avant de répondre</Title>
    <Lede>Quatre questions dans un seul email. L’IA les liste, répond à ce qu’elle sait, et signale ce qu’elle ne sait pas.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, ...dl(100) }}>
      <Bubble who="user" name="M. Lambert · email" size={22}>
        Bonjour, j’ai reçu la table et les 6 chaises, mais une chaise est abîmée. Est-ce qu’on peut m’en renvoyer une seule ? Au passage, la facture
        indique 5 chaises au lieu de 6. Et le montage est-il compris dans la garantie de 2 ans ? Enfin, je voudrais commander le buffet assorti : il y a
        une remise si je le prends maintenant ?
      </Bubble>
      <div className={b.on(1)} style={{ marginTop: 22 }}>
        <Code title="Prompt" size={19} style={{ whiteSpace: 'pre-wrap' }}>
          Liste chaque question du client, numérotée. Pour chacune, réponds uniquement à partir de la procédure fournie. Si l’information n’y est pas,
          écris [À COMPLÉTER PAR LE CONSEILLER].
        </Code>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 930, top: 262, width: 870, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M3QA n={1} q="Renvoyer une seule chaise ?" a="Oui : remplacement à l’unité, sur photo du dommage, sous 10 jours." />
      <M3QA n={2} q="Facture : 5 chaises au lieu de 6" a="Facture rectificative à demander au service facturation." />
      <M3QA n={3} q="Montage couvert par la garantie ?" a="[À COMPLÉTER PAR LE CONSEILLER] · absent de la procédure" todo />
      <M3QA n={4} q="Remise sur le buffet ?" a="[À COMPLÉTER PAR LE CONSEILLER] · offres du moment" todo />
    </div>
  </Frame>
);

// ─── Traduction ─────────────────────────────────────────────────────────────
const M3TStep = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.48, color: C.ink }}>{children}</div>
  </div>
);

const M3_Traduction: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Traduire : répondre dans la langue du client</Title>
    <Lede>Une cliente écrit en espagnol. Quatre étapes, dont une que l’on oublie souvent : le contrôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 20 }}>
      <M3TStep n={1} icon="translate" tone="blue" title="1 · Comprendre">
        <em>« Hola, el sofá llegó con una pata rota. ¿Pueden cambiarla rápido? Gracias. »</em>
        <br />
        <span style={{ color: C.muted }}>→ Le canapé est arrivé avec un pied cassé. Pouvez-vous le changer rapidement ?</span>
      </M3TStep>
      <M3TStep n={2} icon="pen" tone="violet" title="2 · Rédiger en français">
        Vous rédigez (avec l’IA) la réponse en français, comme d’habitude, avec la procédure : envoi d’un pied de remplacement sous 5 jours.
      </M3TStep>
      <M3TStep n={3} icon="translate" tone="teal" title="3 · Traduire">
        « Traduis en espagnol, registre poli (usted). Garde les chiffres, dates et références à l’identique. »
        <br />
        <span style={{ color: C.muted }}>→ « Le enviaremos una pata de repuesto en 5 días… »</span>
      </M3TStep>
      <M3TStep n={4} icon="loop" tone="green" title="4 · Contrôler">
        Retraduisez la réponse en français dans une nouvelle conversation : le sens, les chiffres et le ton sont-ils intacts ?
      </M3TStep>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(400) }}>
      <Callout title="Limites" tone="yellow" icon="alert" size={24}>
        Expressions locales, humour, termes juridiques : la traduction peut trahir le sens. Pour un litige ou un document contractuel, faites valider par
        une personne qui maîtrise la langue.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz : le bon ton ──────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz : la bonne réponse, au bon ton</Title>
    <QuizSeries y={220}>
      <QuizQ q="Un client poste une critique publique sur un réseau social. Votre réponse publique contient…" explain="En public : on reconnaît, on s’excuse si besoin, et on bascule en privé. Aucun montant, aucun numéro de commande, aucune donnée personnelle.">
        <QOpt>Le détail de sa commande, pour montrer qu’on suit le dossier</QOpt>
        <QOpt ok>Une reconnaissance brève et une invitation en message privé</QOpt>
        <QOpt>Rien : on ne répond jamais en public</QOpt>
      </QuizQ>
      <QuizQ q="Vous demandez à l’IA de rendre une réponse « plus chaleureuse ». Elle ajoute « nous vous offrons la livraison ». Que faites-vous ?" explain="L’IA a créé un engagement qui n’existe pas. On le retire, et on précise dans le prompt : « sans promesse ni geste nouveau ».">
        <QOpt>Je garde : c’est sympa pour le client</QOpt>
        <QOpt ok>Je retire l’offre, qui n’est pas autorisée</QOpt>
        <QOpt>Je demande à un collègue s’il a déjà vu ça</QOpt>
      </QuizQ>
      <QuizQ q="Où placer la réponse à la question du client ?" explain="Le client cherche d’abord sa réponse. Elle vient tout de suite après la reconnaissance de la situation ; l’explication suit.">
        <QOpt>À la fin, après toutes les explications</QOpt>
        <QOpt ok>Au début, juste après avoir reconnu la situation</QOpt>
        <QOpt>Dans une pièce jointe</QOpt>
      </QuizQ>
      <QuizQ q="Pour traduire une réponse en allemand, la bonne pratique est…" explain="Rédiger en français (là où vous maîtrisez le fond), traduire en imposant de garder chiffres et références, puis contrôler par une rétro-traduction.">
        <QOpt>Demander directement à l’IA de répondre en allemand</QOpt>
        <QOpt ok>Rédiger en français, traduire, puis rétro-traduire pour contrôler</QOpt>
        <QOpt>Utiliser un traducteur différent pour chaque phrase</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M3Case = ({ l, tone, title, children, d }: { l: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={l} tone={tone} size={42} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const M3_Kit: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>Atelier 2 · quatre situations, quatre réponses</Title>
    <Lede>Vous reprenez les messages analysés à l’atelier 1. Chaque situation impose un canal et une contrainte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M3Case l="A" tone="blue" title="Double prélèvement · email" d={100}>
        Procédure : remboursement du doublon sous 48 h ouvrées après vérification. Contrainte : la cliente est inquiète pour son loyer, rassurez-la
        sans promettre plus que la procédure.
      </M3Case>
      <M3Case l="C" tone="coral" title="Technicien jamais venu · email" d={200}>
        Procédure : nouveau créneau prioritaire sous 48 h, geste commercial possible (validé par le superviseur). Contrainte : client en colère,
        3e relance.
      </M3Case>
      <M3Case l="E" tone="violet" title="Décaler une livraison · chat" d={300}>
        Procédure : report gratuit jusqu’à 10 jours si la demande arrive 24 h avant. Contrainte : 3 messages courts maximum.
      </M3Case>
      <M3Case l="F" tone="pink" title="Critique publique · réseau social" d={400}>
        Procédure : réponse publique sous 2 h, puis message privé. Contrainte : aucune donnée personnelle en public, pas d’ironie en retour.
      </M3Case>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="translate" size={24} color={C.violet} />
      Variante pour les binômes rapides : le client E écrit en anglais. Répondez-lui en anglais, avec contrôle par rétro-traduction.
    </div>
  </Frame>
);

const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="2"
    title="Créer plusieurs réponses à partir de situations clients"
    defi="redaction"
    who="En binôme · 20 min"
    minutes={20}
    objective={
      <>
        Rédiger avec l’IA <strong>quatre réponses prêtes à envoyer</strong>, chacune adaptée à son canal, puis les passer au crible des
        4 vérifications.
      </>
    }
    where={
      <>
        4 réponses relues et corrigées
        <br />
        Le meilleur prompt du binôme
        <br />
        1 modèle de réponse réutilisable
      </>
    }
    crit={
      <>
        <CheckItem id="a2-1" size={21}>
          Les 5 briques présentes
        </CheckItem>
        <CheckItem id="a2-2" size={21}>
          Ton et longueur adaptés au canal
        </CheckItem>
        <CheckItem id="a2-3" size={21}>
          Aucun engagement hors procédure
        </CheckItem>
        <CheckItem id="a2-4" size={21}>
          Exact · complet · adapté · conforme
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Construisez votre prompt : rôle, contexte (fiche d’analyse + procédure), tâche, format, ton. <strong>2.</strong> Générez la
    réponse A, puis retouchez-la (« plus clair », « plus court »…). <strong>3.</strong> Faites C, E et F en adaptant canal et ton.{' '}
    <strong>4.</strong> Transformez votre meilleure réponse en modèle avec des [variables].
    <Bonus>Comparez deux versions de la réponse C : l’une générée sans la fiche d’analyse, l’autre avec. Qu’est-ce qui change ?</Bonus>
  </LabPage>
);

// ─── Exemple commenté (réponse C) ───────────────────────────────────────────
const M3Note = ({ n, tone, label }: { n: number; tone: Tone; label: string }) => (
  <div className={b.pop(n)} style={{ display: 'flex', alignItems: 'center', gap: 12, ...vars({ o: 'left center' }) }}>
    <span style={{ width: 16, height: 16, borderRadius: 4, background: STRONG[tone], flex: 'none' }} />
    <span style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{label}</span>
  </div>
);

const M3_Exemple: Page = () => (
  <Frame mod={3} kind="synthese" beats={6}>
    <Title>Mise en commun · une réponse possible au client C</Title>
    <Lede>Lisez d’abord la vôtre. → décortique celle-ci, brique par brique.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1180, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 34px', fontSize: 24, lineHeight: 1.6, color: C.ink, ...dl(100) }}
    >
      <Mk n={1} tone="blue">
        Bonjour Monsieur Benali,
      </Mk>
      <br />
      <Mk n={2} tone="coral">
        Vous avez posé une journée de congé et le technicien n’est pas venu : c’est inacceptable, et c’est votre troisième appel. Je vous présente nos
        excuses.
      </Mk>{' '}
      <Mk n={3} tone="violet">
        J’ai réservé un créneau prioritaire jeudi 16 octobre entre 8 h et 10 h ; le technicien vous appellera 30 minutes avant son arrivée.
      </Mk>{' '}
      <Mk n={4} tone="yellow">
        Mon responsable a validé, pour ce désagrément, le remboursement de vos frais de livraison.
      </Mk>
      <br />
      <Mk n={5} tone="green">
        Si ce créneau ne vous convient pas, répondez à ce message avant mardi soir : je vous en propose un autre en priorité.
      </Mk>
      <br />
      <Mk n={6} tone="teal">
        Bien cordialement, Sarah · service client Nova Maison
      </Mk>
    </div>
    <div style={{ position: 'absolute', left: 1360, top: 262, width: 440, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <M3Note n={1} tone="blue" label="Salutation personnelle" />
      <M3Note n={2} tone="coral" label="Faits + émotion reconnus" />
      <M3Note n={3} tone="violet" label="Solution concrète, datée" />
      <M3Note n={4} tone="yellow" label="Geste validé par un humain" />
      <M3Note n={5} tone="green" label="Prochaine étape claire" />
      <M3Note n={6} tone="teal" label="Signature identifiable" />
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Le point de vigilance" tone="coral" icon="eye" size={23}>
        Le créneau et le geste ont été <strong>vérifiés</strong> par le conseiller dans l’outil de planification et auprès du responsable : l’IA ne
        les a pas inventés.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={2}
    title="Le modèle de réponse"
    q="Votre équipe veut un modèle « retard de livraison » généré par l’IA. Quelle est la bonne démarche ?"
    explain="L’IA accélère la rédaction du modèle ; un référent le valide une fois ; chacun ne remplit plus que les variables, et relit avant envoi."
  >
    <Opt why="Chaque conseiller aurait sa version : les clients recevraient des réponses différentes pour la même situation.">Chacun génère son modèle quand il en a besoin</Opt>
    <Opt ok why="Exact : parties fixes validées une fois, variables entre crochets, relecture à chaque utilisation.">
      L’IA propose, un référent valide, l’équipe réutilise avec des variables
    </Opt>
    <Opt why="Un modèle doit refléter vos procédures et vos engagements : il faut le relire avant de le diffuser.">On reprend la première version de l’IA telle quelle</Opt>
    <Opt why="Le modèle n’empêche pas la personnalisation : les variables (nom, produit, dates) sont là pour ça.">On abandonne les modèles : trop impersonnels</Opt>
  </QcmPage>
);

const M3_Synthese: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Module 3 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Cinq briques : <strong>saluer, reconnaître, répondre, donner la suite, signer</strong>. La réponse avant l’explication.
      </SynthRow>
      <SynthRow n={2} tone="violet">
        Retoucher un brouillon : plus clair, plus court, plus chaleureux… <strong>sans jamais changer les faits</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal">
        Le fond ne change pas, la forme s’adapte au <strong>canal</strong> : email, chat, téléphone, réseau social public.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        Demandes complexes : <strong>lister chaque question</strong>, répondre à partir de la procédure, signaler le « à compléter ».
      </SynthRow>
      <SynthRow n={5} tone="green">
        Modèles validés une fois, variables remplies à chaque fois ; traduction contrôlée par <strong>rétro-traduction</strong>.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : votre meilleur prompt de rédaction et votre premier modèle de réponse. Bon appétit !
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Anatomie, M3_Clair, M3_Retouches, M3_Canal, M3_Perso, M3_Modele, M3_Complexe, M3_Traduction, M3_Quiz, M3_Kit, M3_Atelier, M3_Exemple, M3_Qcm, M3_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 3 · OUVERTURE DE SECTION · 11:10

OBJECTIF — Annoncer le module le plus attendu : la rédaction.

DIRE — « On a compris la demande ; maintenant, on répond. Dans ce module : ce qui fait une bonne réponse, comment l’IA retouche un brouillon, comment adapter le ton au canal, comment créer des modèles réutilisables, traiter une demande à plusieurs questions, et traduire. Puis atelier 2 : vous rédigerez quatre vraies réponses. »

TRANSITION — « Qu’est-ce qu’une bonne réponse ? »`,
  `⏱ 4 min · ANATOMIE D’UNE BONNE RÉPONSE (→ ×5)

OBJECTIF — Donner une structure en cinq briques, réutilisable partout.

DIRE — « Voici la réponse à Mme Moreau. » → « Saluer, avec son nom. » → « Reconnaître : on reprend les faits et l’émotion. Elle sait qu’on l’a lue. » → « Répondre : la solution d’abord. » → « La prochaine étape : qui fait quoi, quand, et ce qu’elle doit faire, elle. » → « Conclure et signer : un prénom, un service, un moyen de nous recontacter. »

INSISTER — Ces cinq briques, vous pouvez les écrire dans votre prompt : « Structure ta réponse en cinq parties : … ».

TRANSITION — « Ensuite, la clarté. »`,
  `⏱ 4 min · CLAIR ET PROFESSIONNEL (→ ×5)

OBJECTIF — Montrer les défauts d’écriture courants et la version claire.

DIRE — Lire chaque phrase de gauche, demander « Le client comprend quoi ? », puis → la version claire. Insister sur le jargon interne (RMA, AR, J+2) que le client ne connaît pas, et sur la phrase finale vide « N’hésitez pas… » remplacée par une vraie consigne.

ANIMATION — Demander : « Quel jargon interne utilisez-vous sans vous en rendre compte ? » Noter deux ou trois exemples.

TRANSITION — « L’IA est excellente pour corriger ces défauts. Démonstration. »`,
  `⏱ 4 min · RETOUCHER UN BROUILLON (simulateur, boutons)

OBJECTIF — Montrer les commandes de retouche et la règle « on ne change pas les faits ».

DIRE — « Voici un brouillon de conseiller : juste, mais lourd. » Cliquer Plus clair, puis Plus court, Plus chaleureux, Plus formel. « À chaque fois, regardez : le délai reste 3 jours ouvrés. Une retouche change la forme, jamais le fond. »

INSISTER — C’est un usage très rentable : vous écrivez vite, à votre façon, et l’IA met en forme. Toujours ajouter « ne change aucun fait » au prompt.

TRANSITION — « Le ton dépend aussi du canal. »`,
  `⏱ 4 min · LE TON SELON LE CANAL (onglets)

OBJECTIF — Adapter la même réponse à l’email, au chat, au téléphone et au réseau social.

DIRE — Cliquer chaque onglet. « Email : structuré, détaillé. Chat : messages courts, réactifs. Téléphone : une trame à dire, pas un texte à lire, avec les chiffres répétés. Réseau social : c’est public ; aucune donnée personnelle, aucun montant, et on bascule en privé. »

ANIMATION — Demander quel canal est le plus utilisé chez eux, et faire préciser les codes maison (tutoiement en chat ? emojis ?).

TRANSITION — « Et la personnalisation : quoi donner à l’IA ? »`,
  `⏱ 3 min · PERSONNALISER SANS EN DIRE TROP

OBJECTIF — Distinguer les informations utiles à la réponse des données à ne pas transmettre.

DIRE — « À gauche, ce qui personnalise vraiment : le nom, le produit, l’historique, les contraintes, la procédure. À droite, ce qui n’apporte rien à la réponse et crée un risque : coordonnées bancaires, adresse complète, données de santé. » « Le test : est-ce que cette information change ma réponse ? Si non, elle ne va pas dans le prompt. »

TRANSITION — « Gagner du temps au quotidien : les modèles. »`,
  `⏱ 4 min · MODÈLES DE RÉPONSES (→ ×3)

OBJECTIF — Créer et améliorer des modèles réutilisables (objectif pédagogique dédié).

DIRE — « Un bon modèle a des parties fixes, validées une fois, et des variables entre crochets. » Montrer les variables et la condition « si retard > 7 jours ». → « On peut demander à l’IA de l’améliorer, en lui interdisant de créer des engagements. » → « Ses suggestions. » → « Et le modèle est validé par un référent avant d’être partagé. »

ANIMATION — Demander : « Avez-vous une bibliothèque de modèles ? Qui la tient à jour ? »

TRANSITION — « Et quand un email contient quatre questions ? »`,
  `⏱ 3 min · DEMANDES COMPLEXES (→ ×5)

OBJECTIF — Découper une demande multiple et faire apparaître ce que l’IA ne sait pas.

DIRE — « M. Lambert pose quatre questions dans le même email. Le risque : répondre à deux et oublier les deux autres. » → le prompt. → → « Pour les deux premières, la procédure donne la réponse. » → → « Pour les deux suivantes, l’IA écrit « à compléter » : c’est exactement ce qu’on veut. Elle ne devine pas une garantie ou une remise. »

TRANSITION — « Dernière technique : la traduction. »`,
  `⏱ 3 min · TRADUCTION (→ ×4)

OBJECTIF — Donner une méthode sûre en quatre étapes.

DIRE — → « Comprendre : l’IA traduit le message du client. » → « Rédiger en français, là où vous maîtrisez le fond. » → « Traduire, en imposant de garder chiffres et références. » → « Contrôler : on retraduit dans une nouvelle conversation et on compare. »

INSISTER — Pour un litige ou un document contractuel, validation par une personne qui maîtrise la langue.

TRANSITION — « Un quiz rapide avant l’atelier. »`,
  `⏱ 3 min · QUIZ MODULE 3 (4 questions)

OBJECTIF — Vérifier : réseau social, engagement inventé, place de la réponse, traduction.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « À vous d’écrire : atelier 2. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 2

OBJECTIF — Présenter les quatre situations, reprises de l’atelier 1.

DIRE — « Vous retrouvez quatre messages déjà analysés. Votre fiche d’analyse va devenir le contexte de votre prompt. Chaque situation a sa procédure et sa contrainte : email pour A et C, chat pour E, réseau social pour F. Les plus rapides : le client E écrit en anglais. »

TRANSITION — « Les consignes. »`,
  `⏱ 20 min · ATELIER 2 (minuteur 20 min)

OBJECTIF — Rédiger quatre réponses adaptées et créer un premier modèle.

DIRE — « Vingt minutes, en binôme. Construisez le prompt complet, générez, retouchez, et passez chaque réponse au crible des quatre vérifications. Enfin, transformez votre meilleure réponse en modèle. »

ANIMATION — Passer dans les binômes : vérifier que la fiche d’analyse et la procédure sont bien dans le prompt, traquer les engagements inventés (geste commercial, dates). Bonus : comparer une réponse générée avec et sans la fiche d’analyse.

TRANSITION — « Mise en commun. »`,
  `⏱ 5 min · EXEMPLE COMMENTÉ (→ ×6)

OBJECTIF — Comparer les productions à une réponse de référence.

DIRE — Faire lire une ou deux réponses de binômes à voix haute. Puis dérouler l’exemple : → salutation, → reconnaissance des faits et de l’émotion, → solution datée, → geste validé par le responsable, → prochaine étape, → signature et point de vigilance.

INSISTER — Le créneau et le geste ont été vérifiés par le conseiller : c’est ce qui fait la différence avec le brouillon fautif du module 1.

TRANSITION — « Dernière vérification. »`,
  `⏱ 2 min · QCM 2 (→ bonne réponse, → l’essentiel)

OBJECTIF — Vérifier la démarche de création des modèles.

DIRE — Lire, faire voter, cliquer. Commenter les pièges.

TRANSITION — « Synthèse avant le déjeuner. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 3 · 12:30

OBJECTIF — Récapituler et lancer la pause déjeuner.

DIRE — Lire les cinq points. « Sauvegardez votre meilleur prompt et votre modèle. Cet après-midi, on attaque les situations difficiles. Bon appétit ! »

TRANSITION — Reprise à 13:30 avec le module 4.`,
];
// @@NOTES-END
