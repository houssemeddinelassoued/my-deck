// ─── Module 1 · L’IA au service de la relation client ──────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        L’IA au service
        <br />
        de la relation client
      </>
    }
    sub="Ce que l’IA générative sait faire pour un conseiller, ce qu’elle ne sait pas faire, et pourquoi la validation humaine reste au cœur."
    dur="9:20 – 10:00"
  >
    <SecItem n={1}>Les usages de l’IA dans la relation client</SecItem>
    <SecItem n={2}>L’assistance au conseiller</SecItem>
    <SecItem n={3}>L’analyse des demandes et la personnalisation</SecItem>
    <SecItem n={4}>Les limites et la validation humaine</SecItem>
    <SecItem n={5}>Bien demander : la recette d’un bon prompt</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Où part le temps d’un conseiller ───────────────────────────────────────
const M1Seg = ({ w, tone, label, pct, ia, d }: { w: number; tone: Tone; label: string; pct: string; ia: boolean; d: number }) => (
  <div style={{ position: 'relative', width: w, flex: 'none' }}>
    <div
      className={A.grow}
      style={{ height: 120, background: STRONG[tone], borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(d) }}
    >
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: tone === 'yellow' ? C.ink : '#fff' }}>{pct}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.3, fontWeight: 600, color: C.ink }}>{label}</div>
    {ia ? (
      <div className={b.pop(1)} style={{ position: 'absolute', right: 10, top: -24, ...vars({ o: 'center' }) }}>
        <Tag tone="violet" size={18} style={{ background: C.violet, color: '#fff', boxShadow: 'none' }}>
          <Icon name="sparkles" size={18} /> IA
        </Tag>
      </div>
    ) : null}
  </div>
);

const M1_Temps: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Une journée de conseiller : où part le temps ?</Title>
    <Lede>Ordre de grandeur sur un traitement d’email client. → montre où l’IA peut aider, puis ce qu’on y gagne.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'flex', gap: 12 }}>
      <M1Seg w={400} tone="blue" label="Lire, comprendre, retrouver l’historique" pct="25 %" ia d={100} />
      <M1Seg w={320} tone="teal" label="Chercher la bonne info, la procédure" pct="20 %" ia d={250} />
      <M1Seg w={480} tone="violet" label="Rédiger la réponse" pct="30 %" ia d={400} />
      <M1Seg w={240} tone="yellow" label="Saisir, résumer, classer" pct="15 %" ia d={550} />
      <M1Seg w={192} tone="green" label="Relation, conseil, geste" pct="10 %" ia={false} d={700} />
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 26 }}>
      <Card tone="violet" icon="clock" title="Ce que l’IA accélère" style={{ flex: 1 }} size={24}>
        Lire et résumer un long historique, retrouver la procédure, proposer un premier brouillon, remplir la fiche de contact.
      </Card>
      <Card tone="green" icon="heart" title="Ce que vous gagnez" style={{ flex: 1 }} size={24}>
        Du temps pour l’écoute, le conseil, les cas complexes et les clients fragiles : la part que l’IA ne fait pas.
      </Card>
      <Card tone="coral" icon="eye" title="Ce qui ne change pas" style={{ flex: 1 }} size={24}>
        Vous restez responsable de chaque réponse envoyée : l’IA prépare, vous relisez et validez.
      </Card>
    </div>
  </Frame>
);

// ─── L’IA générative en une minute ──────────────────────────────────────────
const M1Next = ({ word, p, w, d, best = false }: { word: string; p: string; w: number; d: number; best?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 250, flex: 'none', fontSize: 27, fontWeight: best ? 700 : 500, color: best ? C.violet : C.soft }}>{word}</span>
    <div style={{ flex: 1, height: 34, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: w, height: '100%', background: best ? G.violet : C.faint, borderRadius: 8, ...dl(d) }} />
    </div>
    <span style={{ width: 80, flex: 'none', fontFamily: mono, fontSize: 24, color: best ? C.violet : C.muted, textAlign: 'right' }}>{p}</span>
  </div>
);

const M1_CestQuoi: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>L’IA générative en une minute</Title>
    <Lede>Elle ne « sait » pas : elle prédit, mot après mot, la suite la plus probable d’un texte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(100) }}>
      <Eyebrow c={C.muted} size={19}>
        Le texte commence par…
      </Eyebrow>
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.navy, lineHeight: 1.3 }}>
        « Votre commande sera livrée <span className={A.blink} style={{ color: C.violet }}>▌</span> »
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M1Next word="demain" p="41 %" w={300} d={500} best />
        <M1Next word="sous 48 heures" p="27 %" w={200} d={650} />
        <M1Next word="lundi" p="14 %" w={104} d={800} />
        <M1Next word="par transporteur" p="9 %" w={66} d={950} />
      </div>
      <div style={{ marginTop: 22, fontSize: 22, color: C.muted, lineHeight: 1.4 }}>
        Elle choisit un mot plausible… pas forcément le vrai délai de <em>cette</em> commande.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="blue" icon="book" title="Elle a beaucoup lu" cls={b.on(1)} size={24}>
        Entraînée sur d’immenses volumes de textes : elle écrit très bien, dans toutes les langues et tous les tons.
      </Card>
      <Card tone="yellow" icon="lock" title="Elle ne connaît pas Nova Maison" cls={b.on(2)} size={24}>
        Ni vos procédures, ni vos délais, ni le dossier du client, sauf si vous les lui donnez dans la demande.
      </Card>
      <Card tone="coral" icon="alert" title="Elle peut se tromper avec aplomb" cls={b.on(3)} size={24}>
        Quand l’info manque, elle complète avec du plausible. C’est ce qu’on appelle une « hallucination ».
      </Card>
    </div>
  </Frame>
);

// ─── Six usages (cartes à retourner) ────────────────────────────────────────
const M1Use = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode }) => (
  <FlipCard
    w={536}
    h={296}
    tone={tone}
    backTone={tone}
    flipAt={1}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name={icon} tone={tone} size={60} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{desc}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={19}>
          Chez Nova Maison
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M1_Usages: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Six usages de l’IA dans la relation client</Title>
    <Lede>Cliquez une carte pour voir l’exemple concret. → retourne toutes les cartes.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M1Use icon="search" tone="blue" title="Analyser" desc="Comprendre une demande : intention, catégorie, urgence, émotion." ex="Un email de 20 lignes devient une fiche : « panne + retard, urgent, cliente très mécontente, 2e relance »." />
      <M1Use icon="pen" tone="violet" title="Rédiger" desc="Proposer un brouillon de réponse clair, complet et au bon ton." ex="Le conseiller obtient un brouillon en 10 secondes, le relit, corrige un délai et l’envoie." />
      <M1Use icon="user" tone="pink" title="Personnaliser" desc="Adapter la réponse au client, à son historique, à son canal." ex="« Comme indiqué lors de votre appel de jeudi… » plutôt qu’un modèle impersonnel." />
      <M1Use icon="translate" tone="teal" title="Traduire" desc="Répondre dans la langue du client, et comprendre la sienne." ex="Une cliente écrit en espagnol : on comprend, on répond en espagnol, avec la même qualité." />
      <M1Use icon="book" tone="yellow" title="Rechercher" desc="Trouver la bonne procédure dans une documentation volumineuse." ex="« Que faire si un appareil fuit sous garantie ? » → la procédure SAV, avec sa source." />
      <M1Use icon="chart" tone="green" title="Synthétiser" desc="Résumer un appel, repérer les motifs et les irritants récurrents." ex="Chaque lundi : les 5 motifs de contact de la semaine et les 3 irritants qui montent." />
    </div>
  </Frame>
);

// ─── L’assistant du conseiller (maquette) ───────────────────────────────────
const M1Sugg = ({ icon, tone, title, children, n }: { icon: IconName; tone: Tone; title: string; children: ReactNode; n: number }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${STRONG[tone]}`, padding: '14px 20px 14px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={22} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 17, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M1_Assistance: Page = () => (
  <Frame mod={1} kind="demo" beats={4}>
    <Title>L’assistance au conseiller : un copilote, pas un pilote</Title>
    <Lede>Pendant que le client écrit, l’IA prépare. → fait apparaître chaque aide, une par une.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 820, height: 690, boxSizing: 'border-box', background: C.panel, borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column', gap: 18, ...dl(100) }}>
      <Eyebrow c={C.muted} size={18}>
        Chat en cours · client n° 77 104
      </Eyebrow>
      <Bubble who="user" name="Client" size={23}>
        Bonjour, j’ai commandé un canapé le 3, on m’annonçait 10 jours, toujours rien. Je reçois du monde samedi…
      </Bubble>
      <Bubble who="human" name="Conseiller" size={23}>
        Bonjour, je regarde votre commande tout de suite.
      </Bubble>
      <Bubble who="user" name="Client" size={23}>
        Et le suivi colis ne marche pas non plus.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 260, width: 820, height: 690, boxSizing: 'border-box', background: T.violet.bg, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 12, ...dl(300) }}>
        <IconTile name="sparkles" tone="violet" size={40} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T.violet.fg }}>Assistant IA du conseiller</span>
      </div>
      <M1Sugg icon="note" tone="blue" title="Résumé" n={1}>
        Canapé commandé le 3, délai annoncé dépassé, suivi colis inaccessible, contrainte : samedi.
      </M1Sugg>
      <M1Sugg icon="target" tone="yellow" title="Intention · urgence" n={2}>
        Obtenir une date de livraison ferme · urgence moyenne (échéance samedi).
      </M1Sugg>
      <M1Sugg icon="book" tone="teal" title="Procédure suggérée" n={3}>
        « Retard transporteur » : contacter le transporteur, proposer un créneau, geste si plus de 7 jours.
      </M1Sugg>
      <M1Sugg icon="pen" tone="violet" title="Réponse proposée" n={4}>
        « Je comprends, surtout avec votre réception samedi. Je contacte le transporteur et je reviens vers vous avant 16 h… »
      </M1Sugg>
    </div>
  </Frame>
);

// ─── Personnalisation : avant / après ───────────────────────────────────────
const M1_Perso: Page = () => {
  const [perso, setPerso] = useState(false);
  return (
    <Frame mod={1} kind="demo">
      <Title>La personnalisation : le même message, deux expériences</Title>
      <Lede>Basculez l’interrupteur : l’IA a reçu, en plus, l’historique et le contexte du client.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, ...dl(100) }}>
        <Toggle on={perso} onChange={setPerso} label={perso ? 'Réponse personnalisée (avec contexte)' : 'Réponse générique (sans contexte)'} tone="violet" size={28} />
      </div>
      <div
        className={A.in}
        style={{
          position: 'absolute',
          left: 120,
          top: 350,
          width: 1060,
          height: 560,
          boxSizing: 'border-box',
          background: C.card,
          borderRadius: 20,
          boxShadow: perso ? `0 0 0 3px ${C.violet}, ${SHADOW}` : SHADOW,
          padding: '30px 36px',
          fontSize: 26,
          lineHeight: 1.5,
          color: C.ink,
          transition: `box-shadow 400ms ${EASE}`,
          ...dl(200),
        }}
      >
        {perso ? (
          <div key="p" className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
            <p style={{ margin: 0 }}>
              Bonjour <Hl>Monsieur Petit</Hl>,
            </p>
            <p style={{ margin: '14px 0 0' }}>
              Merci pour votre retour sur <Hl>le réfrigérateur Glacia livré mardi</Hl>. Je comprends qu’un bruit la nuit soit pénible,{' '}
              <Hl>d’autant que c’est votre deuxième appareil chez nous</Hl>.
            </p>
            <p style={{ margin: '14px 0 0' }}>
              Comme il est <Hl>sous garantie jusqu’en mars 2028</Hl>, je vous propose la visite d’un technicien <Hl>jeudi ou vendredi matin</Hl>.
              Lequel vous convient ?
            </p>
            <p style={{ margin: '14px 0 0' }}>Bien cordialement, Inès, service client Nova Maison</p>
          </div>
        ) : (
          <div key="g" className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
            <p style={{ margin: 0 }}>Bonjour,</p>
            <p style={{ margin: '14px 0 0' }}>
              Nous avons bien reçu votre demande concernant votre produit. Nous sommes désolés pour la gêne occasionnée.
            </p>
            <p style={{ margin: '14px 0 0' }}>
              Votre demande a été transmise au service concerné, qui reviendra vers vous dans les meilleurs délais.
            </p>
            <p style={{ margin: '14px 0 0' }}>Cordialement, le service client</p>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1230, top: 350, width: 570, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone="violet" icon="user" title="Ce qui personnalise" cls={A.right} style={dl(300)} size={23}>
          Le nom, le produit, l’historique, la garantie, une solution concrète et un choix laissé au client.
        </Card>
        <Card tone="coral" icon="alert" title="Ce qui la rend possible" cls={A.right} style={dl(450)} size={23}>
          Le contexte que <strong>vous</strong> donnez à l’IA. Sans contexte, elle ne peut produire que du générique… ou inventer.
        </Card>
        <Callout title="Attention" tone="yellow" icon="lock" cls={A.right} style={dl(600)} size={22}>
          Personnaliser ≠ tout coller : seulement le nécessaire, dans un outil autorisé.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Quiz flash : vrai ou faux ? ────────────────────────────────────────────
const M1_QuizFlash: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz flash : vrai ou faux ?</Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA connaît nos conditions de retour et nos délais de livraison. »" explain="Elle ne connaît que ce que vous lui donnez : la procédure collée dans la demande, ou une base de connaissances branchée sur l’outil. Sinon, elle invente un délai plausible.">
        <QOpt>Vrai, elle a été entraînée sur Internet</QOpt>
        <QOpt ok>Faux, sauf si on les lui fournit</QOpt>
        <QOpt>Vrai, si notre site est public</QOpt>
      </QuizQ>
      <QuizQ q="« L’IA peut se tromper tout en ayant l’air sûre d’elle. »" explain="C’est l’hallucination : une réponse fausse, bien rédigée. D’où la relecture systématique avant envoi, surtout sur les montants, les délais et les engagements.">
        <QOpt ok>Vrai, et c’est le principal piège</QOpt>
        <QOpt>Faux, elle dit toujours « je ne sais pas »</QOpt>
        <QOpt>Faux, avec les versions récentes</QOpt>
      </QuizQ>
      <QuizQ q="« Je peux coller l’email d’un client avec son adresse et son IBAN dans une IA grand public. »" explain="Jamais dans un outil non autorisé : les données peuvent être conservées ou réutilisées. On utilise l’outil validé par l’entreprise et on retire les données inutiles (module 7).">
        <QOpt>Vrai, si je supprime l’échange après</QOpt>
        <QOpt>Vrai, c’est pour aider le client</QOpt>
        <QOpt ok>Faux : outil autorisé et données minimales</QOpt>
      </QuizQ>
      <QuizQ q="« Le même prompt donne toujours exactement la même réponse. »" explain="La génération comporte une part de hasard : deux essais donnent deux formulations. C’est pour cela qu’on crée des modèles cadrés et qu’on relit toujours.">
        <QOpt>Vrai</QOpt>
        <QOpt ok>Faux : la formulation varie d’un essai à l’autre</QOpt>
        <QOpt>Vrai, si on écrit en majuscules</QOpt>
      </QuizQ>
      <QuizQ q="« Avec l’IA, le conseiller n’est plus responsable de la réponse envoyée. »" explain="La réponse part au nom de l’entreprise et du conseiller. L’IA est un outil de préparation : la décision et la responsabilité restent humaines.">
        <QOpt>Vrai, c’est l’outil qui a écrit</QOpt>
        <QOpt ok>Faux : celui qui envoie reste responsable</QOpt>
        <QOpt>Ça dépend de l’outil</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Les limites ────────────────────────────────────────────────────────────
const M1Lim = ({ icon, tone, title, children, n }: { icon: IconName; tone: Tone; title: string; children: ReactNode; n: number }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px' }}>
    <IconTile name={icon} tone={tone} size={58} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Cinq limites à connaître avant de s’y fier</Title>
    <Lede>→ fait apparaître chaque limite, puis la parade.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M1Lim icon="alert" tone="coral" title="Elle invente quand elle ne sait pas" n={1}>
        Un délai, un montant, un geste commercial qui n’existent pas.
      </M1Lim>
      <M1Lim icon="eyeOff" tone="yellow" title="Elle ne voit pas vos systèmes" n={2}>
        Elle ignore l’état réel de la commande, du stock ou du dossier.
      </M1Lim>
      <M1Lim icon="lock" tone="navy" title="Elle peut exposer des données" n={3}>
        Ce qu’on colle dans un outil non autorisé peut sortir de l’entreprise.
      </M1Lim>
      <M1Lim icon="frown" tone="pink" title="Elle peut rater le ton" n={4}>
        Trop formelle, trop enjouée, ou maladroite face à un client fragile.
      </M1Lim>
      <M1Lim icon="scale" tone="violet" title="Elle ne décide pas" n={5}>
        Un remboursement, une exception, un geste : c’est une décision humaine.
      </M1Lim>
      <div className={b.pop(6)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: G.navy, borderRadius: 18, padding: '20px 28px', color: '#fff' }}>
        <Icon name="humanCheck" size={58} color="#fff" />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28 }}>La parade : la validation humaine</div>
          <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: '#D6DCF5' }}>Fournir le contexte, relire, corriger, décider.</div>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Repérez les erreurs (soulignement + corrections au fil des →) ─────────
// Faulty phrase: a red bar grows under it on beat `n`.
const Cx2 = ({ n, children }: { n: number; children: ReactNode }) => (
  <span style={{ position: 'relative' }}>
    {children}
    <span className={b.grow(n)} style={{ position: 'absolute', left: 0, right: 0, bottom: -3, height: 5, borderRadius: 3, background: C.coral }} />
  </span>
);

const M1Err = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.coral}`, padding: '14px 20px 14px 22px' }}>
    <Num n={n} tone="coral" size={40} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 24, color: T.coral.fg }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1Pin = ({ n, y }: { n: number; y: number }) => (
  <Num n={n} tone="coral" size={44} cls={b.pop(n)} style={{ position: 'absolute', left: 1100, top: y - 22, boxShadow: '0 0 0 4px #fff' }} />
);

const M1_Erreurs: Page = () => (
  <Frame mod={1} kind="exercice" beats={5}>
    <Title>À vous : repérez les quatre erreurs de l’IA</Title>
    <Lede>Brouillon généré pour Mme Moreau sans lui donner le dossier. Cherchez d’abord, puis → révèle chaque erreur.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 270, width: 1060, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 38px', fontSize: 27, lineHeight: 1.55, color: C.ink, ...dl(100) }}
    >
      <Eyebrow c={C.violet} size={18} style={{ marginBottom: 10 }}>
        Brouillon IA · non relu
      </Eyebrow>
      <p style={{ margin: 0 }}>
        Bonjour <Cx2 n={1}>Madame Morel</Cx2>,
      </p>
      <p style={{ margin: '12px 0 0' }}>
        Nous sommes désolés pour la fuite de votre <Cx2 n={2}>lave-vaisselle</Cx2>.
      </p>
      <p style={{ margin: '12px 0 0' }}>
        Un technicien passera chez vous <Cx2 n={3}>demain entre 8 h et 10 h</Cx2>.
      </p>
      <p style={{ margin: '12px 0 0' }}>
        Pour nous excuser, nous vous offrons <Cx2 n={4}>un bon d’achat de 100 €</Cx2>.
      </p>
      <p style={{ margin: '12px 0 0' }}>Cordialement, le service client</p>
    </div>
    <M1Pin n={1} y={353} />
    <M1Pin n={2} y={407} />
    <M1Pin n={3} y={461} />
    <M1Pin n={4} y={515} />
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Err n={1} title="Mauvais nom">
        La cliente s’appelle Mme Moreau : la confiance est rompue dès la 1re ligne.
      </M1Err>
      <M1Err n={2} title="Mauvais produit">
        C’est un lave-linge : l’IA a « complété » avec un produit plausible.
      </M1Err>
      <M1Err n={3} title="Engagement inventé">
        Aucun créneau n’a été réservé : promesse impossible à tenir.
      </M1Err>
      <M1Err n={4} title="Geste non autorisé">
        Un geste commercial se décide selon la procédure, par une personne habilitée.
      </M1Err>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 690, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Callout title="La leçon" tone="green" icon="checkCircle" size={25}>
        Le texte est fluide et poli… et pourtant faux sur quatre points. <strong>La forme ne garantit jamais le fond.</strong>
      </Callout>
      <Callout title="Réflexe" tone="blue" icon="eye" size={25}>
        Vérifiez toujours : <strong>nom, produit, dates, montants, engagements</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── L’IA propose, le conseiller dispose ────────────────────────────────────
const M1Check = ({ n, tone, q, children }: { n: number; tone: Tone; q: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <Num n={n} tone={tone} size={50} />
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{q}</div>
    <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M1_Validation: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>« L’IA propose, le conseiller dispose » : les 4 vérifications</Title>
    <Lede>Avant chaque envoi, quatre questions. Trente secondes qui évitent une réclamation de plus.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 24 }}>
      <M1Check n={1} tone="blue" q="Exact ?">
        Noms, produits, numéros, dates, montants, délais : tout correspond au dossier.
      </M1Check>
      <M1Check n={2} tone="teal" q="Complet ?">
        Toutes les questions du client ont une réponse, et la prochaine étape est claire.
      </M1Check>
      <M1Check n={3} tone="violet" q="Adapté ?">
        Le ton convient à la situation et au client ; pas de jargon, pas de copier-coller visible.
      </M1Check>
      <M1Check n={4} tone="coral" q="Conforme ?">
        Rien d’interdit : pas d’engagement non autorisé, pas de donnée d’un autre client.
      </M1Check>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Règle d’équipe" tone="green" icon="humanCheck" size={26}>
        Aucun texte généré ne part sans avoir été lu en entier. Si vous ne pouvez pas vérifier une information, vous ne l’envoyez pas.
      </Callout>
    </div>
  </Frame>
);

// ─── La recette du prompt (constructeur interactif) ─────────────────────────
const M1Ing = ({ on, set, tone, label }: { on: boolean; set: (v: boolean) => void; tone: Tone; label: string }) => (
  <Toggle on={on} onChange={set} label={<span style={{ fontWeight: 600 }}>{label}</span>} tone={tone} size={25} />
);

const M1_Recette: Page = () => {
  const [role, setRole] = useState(false);
  const [ctx, setCtx] = useState(false);
  const [fmt, setFmt] = useState(false);
  const [ton, setTon] = useState(false);
  const score = 1 + Number(role) + Number(ctx) + Number(fmt) + Number(ton);
  const lv = score <= 2 ? 0 : score <= 4 ? 1 : 2;
  const tone: Tone = lv === 0 ? 'coral' : lv === 1 ? 'yellow' : 'green';
  return (
    <Frame mod={1} kind="simu">
      <Title>Bien demander : la recette d’un bon prompt</Title>
      <Lede>Activez les ingrédients un à un et regardez la réponse s’améliorer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 420, display: 'flex', flexDirection: 'column', gap: 22, ...dl(100) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 25, fontWeight: 600, color: C.ink }}>
          <span style={{ width: 66, height: 38, borderRadius: 999, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={22} color="#fff" sw={3} />
          </span>
          Tâche (toujours)
        </div>
        <M1Ing on={role} set={setRole} tone="violet" label="Rôle" />
        <M1Ing on={ctx} set={setCtx} tone="teal" label="Contexte" />
        <M1Ing on={fmt} set={setFmt} tone="yellow" label="Format" />
        <M1Ing on={ton} set={setTon} tone="pink" label="Ton" />
        <div style={{ marginTop: 10, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '16px 20px' }}>
          <Eyebrow c={C.muted} size={17}>
            Qualité de la réponse
          </Eyebrow>
          <div style={{ marginTop: 10, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${score * 20}%`, height: '100%', background: STRONG[tone], transition: `width 450ms ${EASE}, background 300ms` }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>{['Générique', 'Correcte', 'Prête à relire'][lv]}</div>
        </div>
      </div>
      <CodeDark file="mon-prompt.txt" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 580, top: 262, width: 600, height: 670, ...dl(200) }}>
        {role ? (
          <>
            <Ck>Rôle · </Ck>Tu es conseiller du service client de Nova Maison (électroménager en ligne).{'\n\n'}
          </>
        ) : null}
        {ctx ? (
          <>
            <Ck>Contexte · </Ck>Lave-linge livré avec 6 jours de retard, fuite au 1er lavage, 2e relance. Procédure : échange ou technicien sous 72 h, au choix
            du client.{'\n\n'}
          </>
        ) : null}
        <Ck>Tâche · </Ck>Rédige une réponse à l’email ci-dessous.{'\n\n'}
        {fmt ? (
          <>
            <Ck>Format · </Ck>Email de 120 mots max, 3 paragraphes, prochaine étape claire.{'\n\n'}
          </>
        ) : null}
        {ton ? (
          <>
            <Ck>Ton · </Ck>Empathique et professionnel, vouvoiement, sans jargon.{'\n\n'}
          </>
        ) : null}
        <Cc>[email de la cliente]</Cc>
      </CodeDark>
      <div
        style={{
          position: 'absolute',
          left: 1220,
          top: 262,
          width: 580,
          height: 670,
          boxSizing: 'border-box',
          background: C.card,
          borderRadius: 20,
          boxShadow: `inset 0 0 0 3px ${STRONG[tone]}, ${SHADOW}`,
          padding: '24px 28px',
          fontSize: 22,
          lineHeight: 1.5,
          color: C.ink,
          transition: `box-shadow 300ms ${EASE}`,
        }}
      >
        <Eyebrow c={T[tone].fg} size={17} style={{ marginBottom: 10 }}>
          Réponse obtenue
        </Eyebrow>
        {lv === 0 ? (
          <div key="0" className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
            Bonjour, nous sommes désolés pour la gêne occasionnée. Votre demande a bien été prise en compte et sera traitée dans les meilleurs délais.
            N’hésitez pas à nous recontacter. Cordialement.
          </div>
        ) : lv === 1 ? (
          <div key="1" className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
            Bonjour Madame, nous sommes désolés pour le retard de livraison et le problème rencontré avec votre lave-linge. Nous allons organiser une
            solution rapidement : un conseiller vous recontactera. Cordialement, le service client Nova Maison.
          </div>
        ) : (
          <div key="2" className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
            Bonjour Madame Moreau,
            <br />
            <br />
            Je suis sincèrement désolé : un retard de 6 jours, puis une fuite dès le premier lavage, et une deuxième relance sans réponse. Ce
            n’est pas le service que vous méritez.
            <br />
            <br />
            Je vous propose, au choix : l’échange de l’appareil ou la venue d’un technicien sous 72 h. Répondez simplement « échange » ou
            « technicien » et je m’en occupe aujourd’hui.
            <br />
            <br />
            Bien cordialement, Karim, service client Nova Maison
          </div>
        )}
      </div>
    </Frame>
  );
};

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Le bon réflexe"
    q="L’IA propose une réponse parfaite… avec un remboursement « sous 48 h ». Vous ne connaissez pas ce délai. Que faites-vous ?"
    explain="Une information que vous ne pouvez pas vérifier ne part pas. Vous vérifiez dans la procédure ou le dossier, ou vous la retirez : le client retiendra la promesse."
  >
    <Opt why="Le texte est fluide, mais un délai inventé devient une promesse que l’entreprise devra tenir… ou une réclamation.">J’envoie : la réponse est très bien écrite</Opt>
    <Opt ok why="Exact : on vérifie la procédure ou le dossier ; à défaut, on retire le délai ou on le remplace par la bonne information.">
      Je vérifie le délai, sinon je le retire
    </Opt>
    <Opt why="L’IA confirmera souvent sa propre réponse : elle n’a pas accès à vos procédures. Ce n’est pas une vérification.">Je demande à l’IA si elle est sûre</Opt>
    <Opt why="Le reste du brouillon est peut-être utile : il suffit de corriger le point douteux.">Je supprime tout et j’écris tout seul</Opt>
  </QcmPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const SynthRow = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(150 + n * 120) }}>
    <Num n={n} tone={tone} size={48} />
    <div style={{ fontSize: 27, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Module 1 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        L’IA générative <strong>prédit du texte</strong> : excellente pour lire, résumer, rédiger, traduire ; elle ne connaît pas vos dossiers.
      </SynthRow>
      <SynthRow n={2} tone="violet">
        Six usages clés : <strong>analyser, rédiger, personnaliser, traduire, rechercher, synthétiser</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal">
        Un bon prompt = <strong>rôle + contexte + tâche + format + ton</strong>. Plus de contexte, moins d’invention.
      </SynthRow>
      <SynthRow n={4} tone="coral">
        Elle peut inventer avec aplomb : vérifiez <strong>nom, produit, dates, montants, engagements</strong>.
      </SynthRow>
      <SynthRow n={5} tone="green">
        <strong>L’IA propose, le conseiller dispose</strong> : exact, complet, adapté, conforme… puis envoyé.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : copiez la recette du prompt, elle servira dans tous les ateliers.
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Temps, M1_CestQuoi, M1_Usages, M1_Assistance, M1_Perso, M1_QuizFlash, M1_Limites, M1_Erreurs, M1_Validation, M1_Recette, M1_Qcm, M1_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 1 · OUVERTURE DE SECTION · 9:20

OBJECTIF — Annoncer le module : comprendre ce que l’IA peut faire pour un conseiller, et ses limites.

DIRE — « Premier module : l’IA au service de la relation client. On va voir ce qu’elle sait faire, à quoi ressemble concrètement l’assistance au conseiller, comment elle personnalise, et surtout ses limites, parce que c’est ce qui vous permettra de l’utiliser en confiance. On finira par la recette d’un bon prompt, qui servira toute la journée. »

TRANSITION — « Commençons par votre quotidien. »`,
  `⏱ 4 min · OÙ PART LE TEMPS (→ badges IA, → cartes)

OBJECTIF — Partir du réel : la plupart du temps passé sur un contact n’est pas de la relation.

DIRE — « Voici un ordre de grandeur pour le traitement d’un email client. Un quart du temps à lire, comprendre, retrouver l’historique. Un cinquième à chercher la bonne info. Presque un tiers à rédiger. Et du temps de saisie et de classement. La vraie relation, le conseil, le geste : une petite part. » → « L’IA peut aider sur les quatre premiers blocs. » → « Ce qu’on gagne, c’est du temps pour la partie verte, celle où vous faites la différence. Et ce qui ne change pas : c’est vous qui envoyez. »

ANIMATION — Demander : « Chez vous, quel bloc est le plus gros ? » Les chiffres sont illustratifs : l’important est la répartition.

TRANSITION — « Mais au fait, comment ça marche, une IA générative ? »`,
  `⏱ 4 min · L’IA GÉNÉRATIVE EN UNE MINUTE (→ ×3)

OBJECTIF — Donner un modèle mental simple et juste : une machine à prédire le texte.

DIRE — « Une IA générative, c’est une machine qui prédit la suite la plus probable d’un texte. Si j’écris « Votre commande sera livrée… », elle calcule que « demain » est très probable, « sous 48 heures » aussi. Elle choisit un mot plausible. Pas forcément le vrai délai de cette commande-là. » → « Elle a énormément lu : elle écrit très bien. » → « Mais elle ne connaît pas Nova Maison : ni vos procédures, ni le dossier du client, sauf si vous les lui donnez. » → « Et quand l’information manque, elle complète avec du plausible : c’est l’hallucination. »

INSISTER — C’est la clé de toute la journée : la qualité de la réponse dépend de ce qu’on lui fournit.

TRANSITION — « Concrètement, à quoi peut-elle servir chez vous ? »`,
  `⏱ 4 min · SIX USAGES (cartes à retourner, → retourne tout)

OBJECTIF — Montrer l’étendue des usages avec des exemples concrets.

DIRE — « Six usages. Analyser une demande. Rédiger un brouillon. Personnaliser. Traduire. Rechercher dans la documentation. Synthétiser les échanges. » Faire retourner une ou deux cartes par des participants. « Chacun de ces usages, on va le pratiquer aujourd’hui : l’analyse au module 2, la rédaction au 3, la recherche au 5, la synthèse au 6. »

ANIMATION — Demander quel usage leur parle le plus. → retourne toutes les cartes.

TRANSITION — « Zoom sur le premier usage, le plus courant : l’assistance au conseiller. »`,
  `⏱ 3 min · L’ASSISTANCE AU CONSEILLER (démo, → ×4)

OBJECTIF — Rendre concret le « copilote » intégré à l’outil du conseiller.

DIRE — « À gauche, un chat en cours. À droite, ce que de plus en plus d’outils de relation client proposent : un assistant qui travaille en parallèle. » → « Un résumé de la situation. » → « L’intention et l’urgence. » → « La procédure suggérée, tirée de la base de connaissances. » → « Et une proposition de réponse. Le conseiller garde la main : il prend, il modifie, ou il ignore. »

INSISTER — Copilote, pas pilote : c’est le conseiller qui envoie. Si votre outil intègre déjà ce type d’assistant, demander aux participants d’en témoigner.

TRANSITION — « Autre usage clé : la personnalisation. »`,
  `⏱ 3 min · PERSONNALISATION (interrupteur)

OBJECTIF — Montrer la différence entre réponse générique et personnalisée, et d’où elle vient : le contexte.

DIRE — « Voici la réponse générique, celle qu’on reçoit tous. » Lire. « Maintenant, je donne à l’IA l’historique et le contexte. » Basculer. « Le nom, le produit, la date, l’historique, la garantie, une solution concrète, un choix. Le client se sent reconnu. »

INSISTER — Ce qui personnalise, c’est le contexte fourni. Mais seulement le nécessaire, et dans un outil autorisé.

ANIMATION — Basculer plusieurs fois, demander : « Laquelle vous aimeriez recevoir ? »

TRANSITION — « Petit quiz pour vérifier ce qu’on a vu. »`,
  `⏱ 4 min · QUIZ FLASH (5 questions)

OBJECTIF — Ancrer les notions : connaissance limitée, hallucination, données, variabilité, responsabilité.

DIRE — Lire chaque affirmation, faire voter à main levée, puis cliquer. Commenter l’explication.

ANIMATION — Utiliser « Suivante ». Le score « du premier coup » se met à jour : en faire un petit jeu collectif.

TRANSITION — « On a évoqué les erreurs. Regardons les limites en face. »`,
  `⏱ 3 min · CINQ LIMITES (→ ×6)

OBJECTIF — Lister les limites concrètes, et la parade unique.

DIRE — → « Elle invente quand elle ne sait pas. » → « Elle ne voit pas vos systèmes : l’état de la commande, elle ne le connaît pas. » → « Elle peut exposer des données si l’outil n’est pas autorisé. » → « Elle peut rater le ton, notamment avec un client en difficulté. » → « Elle ne décide pas : un remboursement, une exception, c’est vous. » → « Et la parade, c’est la validation humaine. »

TRANSITION — « Mettons ça en pratique : chasse aux erreurs. »`,
  `⏱ 4 min · REPÉREZ LES ERREURS (exercice, → ×5)

OBJECTIF — Entraîner l’œil à relire un brouillon IA.

DIRE — « Voici un brouillon que l’IA a produit pour Mme Moreau, sans qu’on lui donne le dossier. Une minute en silence : combien d’erreurs trouvez-vous ? » Laisser chercher, recueillir les réponses. Puis → à chaque erreur : « Mauvais nom. » → « Mauvais produit. » → « Un rendez-vous technicien inventé. » → « Et un bon d’achat de 100 € que personne n’a autorisé. » → la leçon et le réflexe.

INSISTER — Le texte est poli et fluide, et pourtant faux sur quatre points. La forme ne garantit jamais le fond.

TRANSITION — « D’où notre règle : l’IA propose, le conseiller dispose. »`,
  `⏱ 3 min · LES 4 VÉRIFICATIONS (→ ×5)

OBJECTIF — Donner une routine de relecture simple et mémorisable.

DIRE — « Quatre questions avant chaque envoi. » → « Exact : noms, dates, montants. » → « Complet : toutes les questions ont une réponse, la prochaine étape est claire. » → « Adapté : le ton convient. » → « Conforme : pas d’engagement non autorisé. » → « Et la règle d’équipe : aucun texte généré ne part sans avoir été lu en entier. »

ANIMATION — Proposer un moyen mnémotechnique : « E-C-A-C ».

TRANSITION — « Dernier point du module : comment bien demander. »`,
  `⏱ 5 min · LA RECETTE DU PROMPT (simulateur, interrupteurs)

OBJECTIF — Faire comprendre par l’expérience que la qualité de la réponse dépend des ingrédients du prompt.

DIRE — « Au départ, seulement la tâche : « Réponds à cet email. » Résultat : générique. » Activer Rôle. « On dit à l’IA qui elle est. » Activer Contexte. « On lui donne les faits et la procédure. C’est l’ingrédient le plus important. » Activer Format, puis Ton. « Et maintenant : une réponse prête à relire, personnalisée, avec une vraie solution. »

ANIMATION — Faire choisir aux participants l’ordre des ingrédients. Montrer que le contexte fait le plus grand saut.

INSISTER — Rôle, contexte, tâche, format, ton : à copier dans votre document.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 2 min · QCM 1 (→ bonne réponse, → l’essentiel)

OBJECTIF — Vérifier le réflexe de vérification.

DIRE — Lire la question, faire voter, cliquer. Faire cliquer les pièges pour les commentaires. Insister sur la réponse C : demander à l’IA si elle est sûre n’est pas une vérification.

TRANSITION — « Ce qu’il faut retenir du module 1. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 1

OBJECTIF — Récapituler en cinq phrases.

DIRE — Lire les cinq points. « Copiez la recette du prompt dans votre document : vous allez vous en servir dès le prochain module. »

TRANSITION — « Module 2 : on prend un message client et on apprend à le décortiquer. »`,
];
// @@NOTES-END
