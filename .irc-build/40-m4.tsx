// ─── Module 4 · Gérer les réclamations et situations difficiles ────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Réclamations et
        <br />
        situations difficiles
      </>
    }
    sub="Comprendre le problème, reconnaître l’insatisfaction, désamorcer, et savoir passer la main : l’IA prépare, vous gardez le lien."
    dur="13:30 – 14:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · simulations de réclamations avec l’IA
      </Tag>
    }
  >
    <SecItem n={1}>Identifier le problème et reformuler la demande</SecItem>
    <SecItem n={2}>Reconnaître l’insatisfaction</SecItem>
    <SecItem n={3}>Construire une réponse adaptée</SecItem>
    <SecItem n={4}>Désamorcer un conflit</SecItem>
    <SecItem n={5}>Préparer une escalade vers un responsable</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Citation ───────────────────────────────────────────────────────────────
const M4_Citation: Page = () => (
  <Frame mod={4}>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 250, width: 10, height: 420, borderRadius: 5, background: G.violet }} />
    <div style={{ position: 'absolute', left: 200, top: 250, width: 1500 }}>
      <Quote
        cls={A.in}
        style={{ paddingLeft: 90, ...dl(150) }}
        by={
          <>
            Le « paradoxe de la réparation de service », observé en marketing des services : une réclamation bien traitée peut renforcer la confiance du
            client.
          </>
        }
      >
        <span style={{ fontSize: 64, lineHeight: 1.18 }}>
          Une réclamation n’est pas un problème à fermer : c’est un client qui vous donne <span style={{ color: C.violet }}>une deuxième chance</span>.
        </span>
      </Quote>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 200, top: 780, width: 1500, display: 'flex', gap: 22, ...dl(800) }}>
      <Tag tone="coral" size={22}>
        <Icon name="frown" size={22} /> Il aurait pu partir sans rien dire
      </Tag>
      <Tag tone="green" size={22}>
        <Icon name="smile" size={22} /> Il a pris le temps de vous écrire
      </Tag>
    </div>
  </Frame>
);

// ─── La méthode en six temps ────────────────────────────────────────────────
const M4Step = ({ n, icon, tone, title, ia, moi }: { n: number; icon: IconName; tone: Tone; title: string; ia: string; moi: string }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Num n={n} tone={tone} size={38} />
      <IconTile name={icon} tone={tone} size={38} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, lineHeight: 1.2, color: C.navy, minHeight: 56 }}>{title}</div>
    <div style={{ background: T.violet.bg, borderRadius: 10, padding: '10px 12px', fontSize: 19, lineHeight: 1.38, color: C.ink }}>
      <strong style={{ color: T.violet.fg }}>IA · </strong>
      {ia}
    </div>
    <div style={{ background: T.green.bg, borderRadius: 10, padding: '10px 12px', fontSize: 19, lineHeight: 1.38, color: C.ink }}>
      <strong style={{ color: T.green.fg }}>Vous · </strong>
      {moi}
    </div>
  </div>
);

const M4_Methode: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>La méthode en six temps</Title>
    <Lede>À chaque étape, ce que l’IA prépare… et ce qui reste à vous. → déroule les étapes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 14 }}>
      <M4Step n={1} icon="search" tone="blue" title="Identifier le problème" ia="sépare faits, ressentis et demandes" moi="vérifiez les faits dans le dossier" />
      <M4Step n={2} icon="loop" tone="teal" title="Reformuler la demande" ia="propose « Si je comprends bien… »" moi="validez avec le client" />
      <M4Step n={3} icon="heart" tone="pink" title="Reconnaître l’insatisfaction" ia="suggère des phrases d’empathie" moi="choisissez des mots sincères" />
      <M4Step n={4} icon="pen" tone="violet" title="Construire la réponse" ia="rédige à partir de la procédure" moi="décidez de la solution et du geste" />
      <M4Step n={5} icon="hand" tone="yellow" title="Désamorcer le conflit" ia="vous souffle des formulations calmes" moi="gardez le lien, ne cédez pas au ton" />
      <M4Step n={6} icon="send" tone="coral" title="Préparer l’escalade" ia="résume le dossier pour le responsable" moi="décidez de passer la main" />
    </div>
  </Frame>
);

// ─── Identifier le problème : faits / ressentis / demandes ──────────────────
const M4Col = ({ n, tone, icon, title, children }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: T[tone].bg, borderRadius: 20, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <Icon name={icon} size={30} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  </div>
);

const M4_Probleme: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Identifier le problème : trier faits, ressentis et demandes</Title>
    <Lede>Une réclamation mélange tout. Prompt : « Sépare les faits, les ressentis et les demandes du client. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, ...dl(100) }}>
      <Bubble who="user" name="M. Benali · 3e appel retranscrit" size={23} w={1580}>
        C’est la troisième fois que j’appelle ! Le technicien devait venir mardi, j’ai posé ma journée, personne. Vous vous moquez de vos clients. Je veux
        un rendez-vous cette semaine et qu’on me rembourse ma journée perdue, sinon je vais voir une association de consommateurs.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 480, width: 1680, display: 'flex', gap: 22 }}>
      <M4Col n={1} tone="blue" icon="note" title="Les faits">
        <Bullet size={22}>Rendez-vous technicien prévu mardi</Bullet>
        <Bullet size={22}>Personne n’est venu</Bullet>
        <Bullet size={22}>3e contact pour ce problème</Bullet>
      </M4Col>
      <M4Col n={2} tone="coral" icon="frown" title="Les ressentis">
        <Bullet size={22} tone="coral">Colère : « vous vous moquez »</Bullet>
        <Bullet size={22} tone="coral">Sentiment de perte (journée de congé)</Bullet>
        <Bullet size={22} tone="coral">Lassitude : 3 appels</Bullet>
      </M4Col>
      <M4Col n={3} tone="green" icon="target" title="Les demandes">
        <Bullet size={22} tone="green">Un rendez-vous cette semaine</Bullet>
        <Bullet size={22} tone="green">Une compensation de la journée</Bullet>
        <Bullet size={22} tone="green">Implicite : être pris au sérieux</Bullet>
      </M4Col>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout title="Pourquoi trier ?" tone="violet" icon="bulb" size={23}>
        On répond aux <strong>faits</strong> par une solution, aux <strong>ressentis</strong> par de la reconnaissance, aux <strong>demandes</strong> par
        une réponse claire (oui, non, ou ce qui est possible).
      </Callout>
    </div>
  </Frame>
);

// ─── Jeu : apaise ou envenime ? ─────────────────────────────────────────────
const M4Phrase = ({ phrase, ok, why, flipAt }: { phrase: string; ok: boolean; why: string; flipAt: number }) => (
  <FlipCard
    w={536}
    h={262}
    tone="grey"
    backTone={ok ? 'green' : 'coral'}
    flipAt={flipAt}
    front={<div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.3, color: C.navy }}>« {phrase} »</div>}
    back={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name={ok ? 'check' : 'x'} size={30} color={ok ? C.green : C.coral} sw={3} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: ok ? T.green.fg : T.coral.fg }}>{ok ? 'Apaise' : 'Envenime'}</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.42, color: C.ink }}>{why}</div>
      </>
    }
  />
);

const M4_Mots: Page = () => (
  <Frame mod={4} kind="jeu" beats={2}>
    <Title>Reconnaître l’insatisfaction : apaise ou envenime ?</Title>
    <Lede>Votez pour chaque phrase, puis retournez la carte. → retourne la première ligne, puis la seconde.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M4Phrase flipAt={1} ok={false} phrase="Calmez-vous, monsieur." why="Personne ne se calme sur ordre : la phrase nie l’émotion et la fait monter." />
      <M4Phrase flipAt={1} ok phrase="Je comprends : vous avez posé une journée pour rien." why="Elle reprend un fait précis : le client sait qu’il a été écouté." />
      <M4Phrase flipAt={1} ok={false} phrase="Ce n’est pas de notre faute, c’est le transporteur." why="Le client ne fait pas la différence : il attend une solution, pas un coupable." />
      <M4Phrase flipAt={2} ok phrase="Voici ce que je peux faire dès maintenant." why="On passe de la plainte à l’action, et le conseiller reprend la main." />
      <M4Phrase flipAt={2} ok={false} phrase="Comme indiqué dans mon précédent message…" why="Sous-entend que le client n’a pas lu : à éviter même si c’est vrai." />
      <M4Phrase flipAt={2} ok phrase="Vous avez raison d’insister, ce délai n’est pas normal." why="Reconnaître ce qui est légitime désamorce, sans reconnaître de faute juridique." />
    </div>
  </Frame>
);

// ─── Construire une réponse adaptée : le prompt réclamation ─────────────────
const M4_Prompt: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Construire une réponse adaptée : le prompt réclamation</Title>
    <Lede>Plus de garde-fous qu’une réponse ordinaire : c’est là que l’IA peut le plus vous coûter.</Lede>
    <CodeDark file="prompt-reclamation.txt" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 960, height: 680, ...dl(100) }}>
      <Ck>Rôle · </Ck>Tu aides un conseiller à répondre à une réclamation.{'\n\n'}
      <Ck>Contexte · </Ck>
      <Hole>fiche : faits, ressentis, demandes</Hole>
      {'\n'}
      <Ck>Procédure · </Ck>
      <Hole>solutions et gestes autorisés</Hole>
      {'\n\n'}
      <Ck>Tâche · </Ck>Rédige une réponse en 5 temps :{'\n'}
      {'  '}1. reconnaître la situation et l’émotion, avec un fait précis{'\n'}
      {'  '}2. présenter des excuses pour la gêne (pas de faute juridique){'\n'}
      {'  '}3. la solution, datée{'\n'}
      {'  '}4. la prochaine étape et le moyen de recontacter{'\n'}
      {'  '}5. une signature personnelle{'\n\n'}
      <Ck>Règles · </Ck>
      <Cf>N’invente aucun geste</Cf> : utilise seulement ceux de la procédure.{'\n'}
      Si une demande du client est impossible, dis-le clairement et propose une alternative.{'\n'}
      Pas de « calmez-vous », pas de justification qui accuse un tiers.{'\n'}
      Ton : <Cs>calme, respectueux, direct</Cs>. 150 mots maximum.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1130, top: 262, width: 670, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="layers" title="Le contexte trié" cls={b.on(1)} size={22}>
        La fiche faits / ressentis / demandes : l’IA répond à chaque niveau.
      </Card>
      <Card tone="coral" icon="lock" title="Les gestes listés" cls={b.on(2)} size={22}>
        L’IA ne peut proposer que ce que la procédure autorise. Le reste, c’est vous (ou votre responsable) qui décidez.
      </Card>
      <Card tone="green" icon="scale" title="Le « non » bien dit" cls={b.on(3)} size={22}>
        « Je ne peux pas rembourser votre journée ; je peux en revanche… » : clair, et tourné vers une solution.
      </Card>
    </div>
  </Frame>
);

// ─── Désamorcer un conflit (chat + coach) ───────────────────────────────────
const M4Tip = ({ n, tone, label }: { n: number; tone: Tone; label: string }) => (
  <div className={b.pop(n)} style={{ ...vars({ o: 'left center' }) }}>
    <Tag tone={tone} size={20}>
      <Icon name="bulb" size={20} /> {label}
    </Tag>
  </div>
);

const M4_Desamorcer: Page = () => (
  <Frame mod={4} kind="demo" beats={4}>
    <Title>Désamorcer un conflit : l’IA en coach discret</Title>
    <Lede>Un chat qui monte en tension. À chaque message, l’assistant souffle une technique. → avance dans l’échange.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, height: 680, boxSizing: 'border-box', background: C.panel, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
      <Bubble who="user" name="Client" size={22}>
        Ça fait 20 minutes que j’attends. VOUS ÊTES TOUS INCOMPÉTENTS.
      </Bubble>
      <Bubble who="human" name="Conseiller" size={22} cls={b.on(1)}>
        Je suis désolée pour cette attente. Je suis là maintenant et je m’occupe de vous personnellement.
      </Bubble>
      <Bubble who="user" name="Client" size={22} cls={b.on(2)}>
        Mon colis est perdu depuis 10 jours, personne ne sait où il est !
      </Bubble>
      <Bubble who="human" name="Conseiller" size={22} cls={b.on(2)}>
        Si je comprends bien, vous n’avez aucune nouvelle de votre colis depuis 10 jours. C’est très inquiétant, je comprends.
      </Bubble>
      <Bubble who="human" name="Conseiller" size={22} cls={b.on(3)}>
        Je vous propose deux options : un renvoi immédiat, ou le remboursement sous 5 jours. Laquelle préférez-vous ?
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, height: 680, boxSizing: 'border-box', background: T.violet.bg, borderRadius: 20, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconTile name="sparkles" tone="violet" size={40} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: T.violet.fg }}>Coach IA</span>
      </div>
      <M4Tip n={1} tone="blue" label="Ne pas relever l’insulte, prendre la main" />
      <M4Tip n={2} tone="teal" label="Reformuler, nommer l’émotion" />
      <M4Tip n={3} tone="green" label="Proposer un choix : le client reprend le contrôle" />
      <div className={b.on(4)} style={{ marginTop: 'auto', background: '#fff', borderRadius: 14, padding: '16px 20px', fontSize: 21, lineHeight: 1.45, color: C.ink }}>
        <strong style={{ color: T.coral.fg }}>Et si les insultes continuent ?</strong> On applique la procédure : un avertissement poli, puis on met fin à
        l’échange et on le signale. Votre respect compte aussi.
      </div>
    </div>
  </Frame>
);

// ─── Préparer une escalade ──────────────────────────────────────────────────
const M4Crit = ({ icon, children, d }: { icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={46} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M4NoteLine = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 170, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.navy.fg, paddingTop: 3 }}>{label}</span>
    <span style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M4_Escalade: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Préparer une escalade : passer la main, pas le problème</Title>
    <Lede>Quand escalader ? Et comment éviter que le responsable reparte de zéro ? → la note générée par l’IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={T.coral.fg} size={20} cls={A.fade}>
        On escalade quand…
      </Eyebrow>
      <M4Crit icon="euro" d={150}>
        Le geste demandé dépasse votre délégation
      </M4Crit>
      <M4Crit icon="scale" d={250}>
        Menace juridique, association, médias
      </M4Crit>
      <M4Crit icon="loop" d={350}>
        3e contact sans solution, ou échec de la solution
      </M4Crit>
      <M4Crit icon="heart" d={450}>
        Client vulnérable, situation sensible
      </M4Crit>
      <M4Crit icon="alert" d={550}>
        Risque pour la sécurité des personnes
      </M4Crit>
      <M4Crit icon="hand" d={650}>
        Le client le demande expressément
      </M4Crit>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 820, top: 262, width: 980, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <IconTile name="send" tone="coral" size={42} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>Note d’escalade · M. Benali</span>
        <Tag tone="yellow" size={17} style={{ marginLeft: 'auto' }}>
          P2 · réponse sous 24 h
        </Tag>
      </div>
      <M4NoteLine label="Situation">Intervention SAV non honorée mardi ; 3e contact ; journée de congé posée.</M4NoteLine>
      <M4NoteLine label="Déjà fait">Excuses, nouveau créneau jeudi 8 h–10 h proposé et accepté.</M4NoteLine>
      <M4NoteLine label="Demande">Compensation de la journée perdue (hors délégation conseiller).</M4NoteLine>
      <M4NoteLine label="Risque">Menace de saisir une association de consommateurs.</M4NoteLine>
      <M4NoteLine label="Proposition">Geste à valider : remboursement des frais de livraison + suivi personnalisé.</M4NoteLine>
      <div style={{ marginTop: 12, fontSize: 20, color: C.muted, lineHeight: 1.4 }}>
        Prompt : « Résume ce dossier pour mon responsable en 5 rubriques : situation, déjà fait, demande, risque, proposition. Factuel, sans adjectif. »
      </div>
    </div>
  </Frame>
);

// ─── S’entraîner : l’IA joue le client ──────────────────────────────────────
const M4Prof = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Simu: Page = () => (
  <Frame mod={4} kind="role">
    <Title>S’entraîner : l’IA joue le client mécontent</Title>
    <Lede>Un simulateur d’entraînement disponible à toute heure, sans risque pour un vrai client.</Lede>
    <CodeDark file="prompt-simulation.txt" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 960, height: 680, ...dl(100) }}>
      <Ck>Jeu de rôle · </Ck>Tu joues un client de Nova Maison. Je suis le conseiller.{'\n\n'}
      <Ck>Ton personnage · </Ck>
      <Hole>profil</Hole>
      {'\n'}
      <Ck>Ta situation · </Ck>
      <Hole>scénario</Hole>
      {'\n\n'}
      <Ck>Règles · </Ck>
      {'\n'}- Reste dans ton rôle, réponds en 1 à 3 phrases.{'\n'}- Ta colère baisse seulement si je reconnais ta situation et propose une
      solution concrète. Elle monte si je me justifie ou si je reste vague.{'\n'}- Ne m’aide pas : c’est moi qui m’entraîne.{'\n\n'}
      <Ck>Fin · </Ck>Quand j’écris <Cs>STOP</Cs>, sors du rôle et donne-moi un retour : 3 points forts, 3 axes de progrès, une note d’apaisement sur 10.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1130, top: 262, width: 670, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(200)}>
        Trois profils pour l’atelier
      </Eyebrow>
      <M4Prof icon="frown" tone="coral" title="Le furieux" d={300}>
        Majuscules, interruptions, veut un responsable tout de suite.
      </M4Prof>
      <M4Prof icon="book" tone="navy" title="Le procédurier" d={400}>
        Cite la loi et les CGV, exige des réponses écrites et précises.
      </M4Prof>
      <M4Prof icon="meh" tone="teal" title="Le déçu silencieux" d={500}>
        Poli, froid, répond par monosyllabes : il est déjà en train de partir.
      </M4Prof>
      <Callout title="Le vrai bénéfice" tone="green" icon="star" cls={A.right} style={dl(650)} size={22}>
        Répéter les phrases difficiles avant de les dire à un vrai client.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="3"
    title="Simulations de réclamations avec l’IA"
    defi="reclamation"
    who="En binôme · 20 min"
    minutes={20}
    objective={
      <>
        Mener jusqu’au bout <strong>deux réclamations simulées</strong> par l’IA, puis rédiger la réponse écrite et, si besoin, la{' '}
        <strong>note d’escalade</strong>.
      </>
    }
    where={
      <>
        2 conversations simulées + le retour de l’IA
        <br />
        1 réponse écrite à une réclamation
        <br />
        1 note d’escalade (si nécessaire)
      </>
    }
    crit={
      <>
        <CheckItem id="a3-1" size={21}>
          Faits, ressentis, demandes identifiés
        </CheckItem>
        <CheckItem id="a3-2" size={21}>
          Émotion reconnue avec un fait précis
        </CheckItem>
        <CheckItem id="a3-3" size={21}>
          Solution ou alternative concrète
        </CheckItem>
        <CheckItem id="a3-4" size={21}>
          Note d’apaisement de l’IA ≥ 7/10
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Personne A : lancez le prompt de simulation avec un profil et un scénario (M. Benali, colis perdu, frais contestés).{' '}
    <strong>2.</strong> Menez l’échange 6 à 8 messages, puis écrivez STOP. <strong>3.</strong> Inversez les rôles. <strong>4.</strong> Ensemble :
    rédigez la réponse écrite au cas le plus difficile, avec le prompt réclamation.
    <Bonus>Demandez à l’IA de rejouer la même scène avec un client « déçu silencieux » : quelles phrases ne marchent plus ?</Bonus>
  </LabPage>
);

// ─── Débrief : grille d’auto-évaluation ─────────────────────────────────────
const M4_Debrief: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Débrief · comment s’est passée votre simulation ?</Title>
    <Lede>Cochez ce que vous avez réussi à faire. Les « ×2 » sont les gestes qui apaisent le plus.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="db1" size={25}>Je n’ai pas relevé les provocations</CheckItem>
        <CheckItem id="db2" w={2} size={25}>J’ai reformulé avec un fait précis (« vous avez posé une journée… »)</CheckItem>
        <CheckItem id="db3" w={2} size={25}>J’ai nommé l’émotion sans la juger</CheckItem>
        <CheckItem id="db4" size={25}>Je ne me suis pas justifié(e) en accusant un tiers</CheckItem>
        <CheckItem id="db5" w={2} size={25}>J’ai proposé une solution concrète, ou un choix</CheckItem>
        <CheckItem id="db6" size={25}>J’ai dit « non » clairement quand c’était impossible</CheckItem>
        <CheckItem id="db7" size={25}>J’ai conclu par la prochaine étape</CheckItem>
        <CheckItem id="db8" size={25}>J’ai su quand proposer l’escalade</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={11}
          label="Mon score d’apaisement"
          levels={[
            { min: 0, text: 'Normal au début : rejouez la scène ce soir avec l’IA.', tone: 'grey' },
            { min: 5, text: 'Les bases sont là : travaillez la reformulation.', tone: 'blue' },
            { min: 9, text: 'Excellent : vous êtes prêt(e) pour les vrais cas.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Partagez au groupe la phrase qui a le mieux marché… et celle qui a fait monter la tension.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <Frame mod={4} kind="quiz">
    <Title>Quiz : réclamations et situations difficiles</Title>
    <QuizSeries y={220}>
      <QuizQ q="L’IA propose « En compensation, nous vous offrons 50 € ». Ce geste n’est pas dans la procédure. Vous…" explain="Un geste commercial engage l’entreprise : il suit la procédure ou la décision d’un responsable. On le retire du brouillon et on escalade si le cas le justifie.">
        <QOpt>Gardez-le : le client est très en colère</QOpt>
        <QOpt ok>Le retirez, et demandez l’avis de votre responsable si besoin</QOpt>
        <QOpt>Le réduisez à 20 €</QOpt>
      </QuizQ>
      <QuizQ q="Quelle phrase reconnaît l’insatisfaction sans reconnaître de faute juridique ?" explain="On reconnaît la gêne et ce qui est légitime (« ce délai n’est pas normal ») sans écrire « c’est notre faute » ni « nous sommes responsables du préjudice ».">
        <QOpt>« Nous reconnaissons notre entière responsabilité. »</QOpt>
        <QOpt ok>« Je comprends votre exaspération, ce délai n’est pas normal. »</QOpt>
        <QOpt>« Ce n’est pas de notre faute. »</QOpt>
      </QuizQ>
      <QuizQ q="Une bonne note d’escalade contient surtout…" explain="Le responsable doit pouvoir décider sans tout relire : situation, ce qui a déjà été fait, la demande, le risque, et votre proposition. Factuel, sans adjectifs.">
        <QOpt>Tout l’historique copié-collé</QOpt>
        <QOpt>Votre avis sur le client</QOpt>
        <QOpt ok>Situation, déjà fait, demande, risque, proposition</QOpt>
      </QuizQ>
      <QuizQ q="À quoi sert la simulation de réclamation avec l’IA ?" explain="C’est un entraînement : répéter les phrases difficiles, sans risque pour un vrai client, et recevoir un retour immédiat. Jamais avec des données réelles.">
        <QOpt ok>À s’entraîner sans risque, et à recevoir un retour</QOpt>
        <QOpt>À laisser l’IA répondre aux vrais clients en colère</QOpt>
        <QOpt>À évaluer officiellement les conseillers</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M4_Synthese: Page = () => (
  <Frame mod={4} kind="synthese">
    <Title>Module 4 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Trier <strong>faits, ressentis, demandes</strong> : une solution pour les faits, de la reconnaissance pour les ressentis.
      </SynthRow>
      <SynthRow n={2} tone="pink">
        Reconnaître avec un <strong>fait précis</strong> ; bannir « calmez-vous » et la justification qui accuse un tiers.
      </SynthRow>
      <SynthRow n={3} tone="violet">
        Le prompt réclamation liste les <strong>gestes autorisés</strong> : l’IA n’en invente aucun.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        Désamorcer : ne pas relever, reformuler, nommer l’émotion, <strong>proposer un choix</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral">
        Escalader au bon moment, avec une <strong>note en 5 rubriques</strong> : le responsable ne repart pas de zéro.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : le prompt réclamation et le prompt de simulation, pour vous entraîner quand vous voulez.
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Citation, M4_Methode, M4_Probleme, M4_Mots, M4_Prompt, M4_Desamorcer, M4_Escalade, M4_Simu, M4_Atelier, M4_Debrief, M4_Quiz, M4_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 4 · OUVERTURE DE SECTION · 13:30

OBJECTIF — Relancer l’énergie après le déjeuner et annoncer les situations difficiles.

DIRE — « Bon retour ! On attaque le module que beaucoup d’entre vous attendent : les réclamations et les situations tendues. On verra comment identifier le problème, reconnaître l’insatisfaction, construire la réponse, désamorcer, et préparer une escalade. Et vous allez vous entraîner contre un client simulé par l’IA. »

TRANSITION — « D’abord, changeons de regard sur la réclamation. »`,
  `⏱ 2 min · CITATION

OBJECTIF — Recadrer la réclamation comme une opportunité.

DIRE — « En marketing des services, on parle du paradoxe de la réparation : un client dont la réclamation est bien traitée peut sortir de l’expérience avec plus de confiance qu’avant. Pas toujours, mais souvent assez pour que ça vaille l’effort. Un client mécontent qui vous écrit vous donne une deuxième chance ; celui qui part sans rien dire, non. »

ANIMATION — Demander : « Vous avez déjà retourné un client très mécontent ? Qu’est-ce qui a marché ? » Un ou deux témoignages.

TRANSITION — « Pour y arriver, une méthode en six temps. »`,
  `⏱ 3 min · LA MÉTHODE EN SIX TEMPS (→ ×6)

OBJECTIF — Donner la trame du module, en séparant ce que fait l’IA et ce que fait le conseiller.

DIRE — À chaque →, lire l’étape, puis « l’IA prépare… et vous ». Insister : à l’étape 4, c’est vous qui décidez de la solution et du geste ; à l’étape 6, c’est vous qui décidez de passer la main.

TRANSITION — « Étape 1 : identifier le problème. »`,
  `⏱ 4 min · FAITS / RESSENTIS / DEMANDES (→ ×4)

OBJECTIF — Apprendre à trier une réclamation.

DIRE — Lire le message de M. Benali avec le ton. → « Les faits : ce qui s’est passé, vérifiable. » → « Les ressentis : la colère, la perte, la lassitude. » → « Les demandes : explicites, et une implicite : être pris au sérieux. » → « Et pourquoi trier : chaque niveau appelle une réponse différente. »

ANIMATION — Faire trier par la salle avant chaque →.

TRANSITION — « Les ressentis appellent de la reconnaissance. Mais avec quels mots ? »`,
  `⏱ 4 min · JEU : APAISE OU ENVENIME (cartes, → ×2)

OBJECTIF — Distinguer les formulations qui désamorcent de celles qui enveniment.

DIRE — Pour chaque carte, faire voter « apaise » ou « envenime » à main levée, puis retourner. Commenter : « calmez-vous » nie l’émotion ; « ce n’est pas notre faute » cherche un coupable ; « comme indiqué » sous-entend que le client n’a pas lu. Les bonnes phrases s’appuient sur un fait précis et tournent vers l’action.

INSISTER — On peut reconnaître ce qui est légitime sans reconnaître de faute juridique.

TRANSITION — « Ces mots, on va les mettre dans un prompt. »`,
  `⏱ 4 min · LE PROMPT RÉCLAMATION (→ ×3)

OBJECTIF — Donner un prompt avec garde-fous pour les réclamations.

DIRE — Parcourir le prompt. → « Le contexte trié : faits, ressentis, demandes. » → « Les gestes listés : l’IA ne peut proposer que ceux-là. C’est le garde-fou le plus important. » → « Et le non bien dit : clair, et tourné vers une alternative. »

INSISTER — C’est en réclamation que l’IA peut le plus vous coûter : un geste inventé, une reconnaissance de faute. Relecture obligatoire.

TRANSITION — « Et à l’oral, ou en chat, quand ça monte ? »`,
  `⏱ 4 min · DÉSAMORCER (démo, → ×4)

OBJECTIF — Montrer les techniques de désamorçage et l’IA comme coach.

DIRE — Lire le premier message du client. → « Le conseiller ne relève pas l’insulte et reprend la main. » → « Il reformule et nomme l’émotion. » → « Il propose un choix : le client reprend le contrôle, la tension baisse. » → « Et si les insultes continuent ? On applique la procédure : votre respect compte aussi. »

ANIMATION — Demander si leur outil propose déjà des suggestions en temps réel.

TRANSITION — « Parfois, il faut passer la main. »`,
  `⏱ 3 min · PRÉPARER UNE ESCALADE (→ note)

OBJECTIF — Savoir quand escalader et rédiger une note efficace.

DIRE — Parcourir les six critères. « Escalader n’est pas un échec : c’est reconnaître les limites de votre délégation. » → « Voici la note générée par l’IA à partir du dossier : situation, déjà fait, demande, risque, proposition. Votre responsable décide en deux minutes, et le client n’a pas à tout réexpliquer. »

TRANSITION — « Place à l’entraînement. »`,
  `⏱ 3 min · S’ENTRAÎNER AVEC L’IA (jeu de rôle)

OBJECTIF — Présenter le prompt de simulation et les trois profils.

DIRE — « L’IA va jouer le client. Les règles sont importantes : elle reste dans son rôle, sa colère baisse seulement si vous reconnaissez la situation et proposez une solution. Et quand vous écrivez STOP, elle vous fait un retour. Trois profils : le furieux, le procédurier, le déçu silencieux, souvent le plus difficile car il ne se plaint plus. »

INSISTER — Données fictives uniquement. C’est un outil d’entraînement, à refaire seul après la formation.

TRANSITION — « À vous ! »`,
  `⏱ 20 min · ATELIER 3 (minuteur 20 min)

OBJECTIF — S’entraîner à mener une réclamation difficile et rédiger la réponse.

DIRE — « En binôme. A mène la conversation, B observe et note les phrases qui marchent. Puis on inverse. Ensuite, ensemble, la réponse écrite au cas le plus difficile, avec le prompt réclamation. »

ANIMATION — Passer dans les binômes, lire des extraits. Repérer une très bonne phrase à partager au débrief. Si l’IA est trop gentille, conseiller d’ajouter : « Sois plus difficile, interromps-moi. »

TRANSITION — « Débrief. »`,
  `⏱ 4 min · DÉBRIEF (grille d’auto-évaluation)

OBJECTIF — Auto-évaluer sa pratique et partager les phrases efficaces.

DIRE — « Cochez ce que vous avez réussi. Les ×2 sont les gestes qui apaisent le plus : reformuler avec un fait, nommer l’émotion, proposer une solution. » Faire partager une phrase qui a marché et une qui a fait monter la tension.

TRANSITION — « Petit quiz. »`,
  `⏱ 3 min · QUIZ MODULE 4 (4 questions)

OBJECTIF — Vérifier : geste inventé, reconnaissance sans faute, note d’escalade, usage de la simulation.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « Ce qu’il faut retenir. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 4

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Gardez le prompt de simulation : c’est un excellent entraînement avant une semaine chargée. »

TRANSITION — « Module 5 : comment ne plus chercher la bonne information pendant dix minutes. »`,
];
// @@NOTES-END
