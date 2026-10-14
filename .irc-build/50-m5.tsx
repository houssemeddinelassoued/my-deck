// ─── Module 5 · Créer une base de connaissances client ─────────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Créer une base
        <br />
        de connaissances client
      </>
    }
    sub="Transformer une documentation touffue en réponses prêtes à l’emploi : la même bonne information, pour tous les conseillers, en quelques secondes."
    dur="14:30 – 15:20 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · transformer une documentation en base de réponses
      </Tag>
    }
  >
    <SecItem n={1}>FAQ et questions fréquentes</SecItem>
    <SecItem n={2}>Procédures pas à pas</SecItem>
    <SecItem n={3}>Scripts de réponse</SecItem>
    <SecItem n={4}>Arbre de décision</SecItem>
    <SecItem n={5}>Recherche dans la documentation</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Le problème : une question, cinq réponses ──────────────────────────────
const M5Ans = ({ n, who, ans, tone }: { n: number; who: string; ans: string; tone: Tone }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <IconTile name="headset" tone={tone} size={48} />
    <span style={{ width: 170, flex: 'none', fontSize: 22, fontWeight: 600, color: C.muted }}>{who}</span>
    <span style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>« {ans} »</span>
  </div>
);

const M5_Probleme: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>Le problème : une question, cinq réponses</Title>
    <Lede>Un client pose la même question à cinq conseillers différents. → écoutez les réponses.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, ...dl(100) }}>
      <Bubble who="user" name="Client" size={27}>
        J’ai renvoyé mon aspirateur. Sous combien de temps serai-je remboursé ?
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 430, width: 760, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5Ans n={1} who="Conseiller 1" ans="Sous 7 jours." tone="blue" />
      <M5Ans n={2} who="Conseiller 2" ans="Comptez 14 jours." tone="teal" />
      <M5Ans n={3} who="Conseiller 3" ans="Dès réception du colis." tone="violet" />
      <M5Ans n={4} who="Conseiller 4" ans="Ça dépend de la banque." tone="yellow" />
      <M5Ans n={5} who="Conseiller 5" ans="Je me renseigne et je vous rappelle." tone="pink" />
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 960, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: G.navy, borderRadius: 20, padding: '28px 34px', color: '#fff' }}>
        <Eyebrow c="#AEB9E6" size={18}>
          La bonne réponse (procédure)
        </Eyebrow>
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 34, lineHeight: 1.25 }}>
          Remboursement sous 14 jours après réception et contrôle du retour, puis 3 à 5 jours ouvrés selon la banque.
        </div>
      </div>
      <Card tone="coral" icon="alert" title="Ce que ça coûte" size={23}>
        Des clients qui rappellent, comparent, s’agacent. Et des conseillers qui perdent du temps à chercher.
      </Card>
      <Card tone="green" icon="book" title="La solution" size={23}>
        Une base de connaissances : <strong>une seule vérité</strong>, à jour, trouvable en quelques secondes.
      </Card>
    </div>
  </Frame>
);

// ─── Du document à la FAQ ───────────────────────────────────────────────────
const M5QR = ({ n, q, a }: { n: number; q: string; a: string }) => (
  <div className={b.left(n)} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.teal}`, padding: '12px 20px 12px 24px' }}>
    <div style={{ fontWeight: 700, fontSize: 22, color: C.navy }}>{q}</div>
    <div style={{ marginTop: 3, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{a}</div>
  </div>
);

const M5_FAQ: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Du document à la FAQ, en une demande</Title>
    <Lede>Prompt : « Transforme ce texte en FAQ : questions formulées comme un client, réponses de 2 phrases maximum, sans rien ajouter. »</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 270, width: 760, boxSizing: 'border-box', background: '#FBFBF8', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '24px 30px', fontFamily: 'Georgia, serif', fontSize: 21, lineHeight: 1.6, color: C.soft, ...dl(100) }}
    >
      <div style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>Art. 7 · Droit de rétractation et retours</div>
      Conformément aux dispositions légales, le Client dispose d’un délai de quatorze (14) jours calendaires à compter de la réception du Produit pour
      exercer son droit de rétractation, sans avoir à justifier de motifs. Les frais de retour sont à la charge du Client, sauf pour les Produits
      volumineux (plus de 30 kg), pour lesquels Nova Maison organise l’enlèvement à ses frais. Le Produit doit être retourné complet, dans son
      emballage d’origine ou un emballage équivalent. Le remboursement intervient dans un délai de quatorze (14) jours suivant la réception et le
      contrôle du Produit retourné, par le même moyen de paiement que celui utilisé lors de la commande.
    </div>
    <div style={{ position: 'absolute', left: 940, top: 270, width: 860, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5QR n={1} q="J’ai combien de temps pour changer d’avis ?" a="14 jours à partir de la réception, sans avoir à vous justifier." />
      <M5QR n={2} q="Qui paie le retour ?" a="Vous, sauf pour les produits de plus de 30 kg : nous venons les chercher gratuitement." />
      <M5QR n={3} q="Faut-il garder le carton d’origine ?" a="Le produit doit revenir complet, dans son emballage d’origine ou un emballage équivalent." />
      <M5QR n={4} q="Quand serai-je remboursé ?" a="Sous 14 jours après réception et contrôle du retour, sur le moyen de paiement utilisé." />
      <div className={b.on(5)}>
        <Callout title="À vérifier" tone="yellow" icon="eye" size={22}>
          Chaque réponse est comparée au texte source : aucune condition oubliée, aucune ajoutée.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Trouver les vraies questions fréquentes ────────────────────────────────
const M5Bar = ({ n, q, v, w, tone }: { n: number; q: string; v: number; w: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 600, flex: 'none', fontSize: 23, color: C.ink }}>« {q} »</span>
    <div style={{ flex: 1, height: 38, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: w, height: '100%', background: STRONG[tone], borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 70, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 30, color: tone === 'yellow' ? C.amber : STRONG[tone], textAlign: 'right' }}>
      {v}
    </span>
  </div>
);

const M5_Frequentes: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Les vraies questions fréquentes sont dans vos messages</Title>
    <Lede>Pas celles qu’on imagine : celles que les clients posent vraiment, avec leurs mots. → l’analyse de 200 messages.</Lede>
    <CodeDark size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, ...dl(100) }}>
      <Ck>Prompt · </Ck>Voici 200 messages clients anonymisés. Regroupe-les par question posée. Pour chaque groupe : formule la question{' '}
      <Cf>avec les mots des clients</Cf>, compte les messages, et signale si notre FAQ actuelle y répond.
    </CodeDark>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Bar n={1} q="Où est mon colis ?" v={46} w={820} tone="blue" />
      <M5Bar n={1} q="Quand serai-je remboursé ?" v={31} w={553} tone="violet" />
      <M5Bar n={1} q="Comment je renvoie un gros appareil ?" v={22} w={392} tone="teal" />
      <M5Bar n={1} q="Le livreur peut-il monter à l’étage ?" v={17} w={303} tone="yellow" />
      <M5Bar n={1} q="Ma garantie couvre-t-elle cette panne ?" v={14} w={250} tone="pink" />
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 780, width: 1680 }}>
      <Callout title="Découverte" tone="coral" icon="search" size={24}>
        Deux de ces cinq questions (« monter à l’étage », « gros appareil ») <strong>n’ont aucune réponse dans la FAQ actuelle</strong>. C’est par elles
        qu’on commence.
      </Callout>
    </div>
  </Frame>
);

// ─── Procédure pas à pas ────────────────────────────────────────────────────
const M5PStep = ({ n, children, check }: { n: number; children: ReactNode; check?: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <Num n={n} tone="navy" size={44} />
    <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px' }}>
      <div style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
      {check ? (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, color: T.yellow.fg, fontWeight: 600 }}>
          <Icon name="eye" size={20} /> {check}
        </div>
      ) : null}
    </div>
  </div>
);

const M5_Procedure: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Procédures : du paragraphe aux étapes numérotées</Title>
    <Lede>Prompt : « Transforme cette procédure en étapes numérotées, une action par étape, avec les points de contrôle. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 620, ...dl(100) }}>
      <Card tone="grey" icon="doc" title="Procédure « Colis non reçu » · avant" size={21}>
        En cas de colis indiqué livré mais non reçu, vérifier d’abord l’adresse et la preuve de livraison, puis demander au client de vérifier auprès
        des voisins et du gardien ; s’il n’est pas retrouvé sous 48 h, ouvrir une enquête transporteur (formulaire T-12) qui prend 5 jours ouvrés, à
        l’issue de laquelle on renvoie ou on rembourse selon le choix du client, sauf si la commande dépasse 1 000 € auquel cas le superviseur valide.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 800, top: 270, width: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5PStep n={1} check="Adresse identique à la commande ?">
        Vérifier l’adresse et la preuve de livraison (photo, signature).
      </M5PStep>
      <M5PStep n={2}>Demander au client de vérifier auprès des voisins et du gardien.</M5PStep>
      <M5PStep n={3} check="Délai de 48 h écoulé ?">
        Si le colis n’est pas retrouvé : ouvrir l’enquête transporteur (formulaire T-12).
      </M5PStep>
      <M5PStep n={4}>Prévenir le client : résultat de l’enquête sous 5 jours ouvrés.</M5PStep>
      <M5PStep n={5} check="Commande > 1 000 € ? → validation superviseur">
        Renvoyer ou rembourser, au choix du client.
      </M5PStep>
    </div>
  </Frame>
);

// ─── Script de réponse téléphonique ─────────────────────────────────────────
const M5Line = ({ n, tone, label, children }: { n: number; tone: Tone; label: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <span style={{ width: 150, flex: 'none', paddingTop: 6 }}>
      <Tag tone={tone} size={17}>
        {label}
      </Tag>
    </span>
    <div style={{ flex: 1, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M5_Script: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Scripts de réponse : une trame, pas un texte à réciter</Title>
    <Lede>Généré par l’IA à partir de la procédure « colis non reçu », puis relu par le référent. → déroule le script.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1120, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(100) }}>
      <M5Line n={1} tone="blue" label="Accueil">
        « Je comprends, c’est très frustrant de voir un colis livré sans l’avoir reçu. On va le retrouver ensemble. »
      </M5Line>
      <M5Line n={2} tone="teal" label="Vérifier">
        « Je vérifie l’adresse avec vous : … » · « Le livreur a laissé une photo, je vous la décris. »
      </M5Line>
      <M5Line n={3} tone="yellow" label="Si… alors">
        <strong>Si</strong> photo devant une autre porte → voisins / gardien. <strong>Sinon</strong> → enquête T-12 tout de suite.
      </M5Line>
      <M5Line n={4} tone="violet" label="Engager">
        « J’ouvre l’enquête maintenant. Vous aurez la réponse sous 5 jours ouvrés, par email. »
      </M5Line>
      <M5Line n={5} tone="green" label="Conclure">
        « Je récapitule : … Avez-vous d’autres questions ? »
      </M5Line>
    </div>
    <div style={{ position: 'absolute', left: 1290, top: 262, width: 510, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="phone" title="Fait pour l’oral" cls={A.right} style={dl(300)} size={22}>
        Phrases courtes, faciles à dire ; des branches « si… alors » au lieu d’un bloc.
      </Card>
      <Card tone="pink" icon="user" title="Votre voix" cls={A.right} style={dl(450)} size={22}>
        Le script donne les étapes et les mots clés ; vous gardez votre façon de parler.
      </Card>
    </div>
  </Frame>
);

// ─── Arbre de décision (interactif) ─────────────────────────────────────────
type M5Node = { q?: string; yes?: string; no?: string; end?: string; tone?: Tone };
const M5_TREE: Record<string, M5Node> = {
  s: { q: 'Y a-t-il un risque : fumée, étincelles, grosse fuite ?', yes: 'e1', no: 'q2' },
  q2: { q: 'L’appareil a-t-il été livré il y a moins de 14 jours ?', yes: 'e2', no: 'q3' },
  q3: { q: 'Est-il encore sous garantie (moins de 2 ans) ?', yes: 'q4', no: 'e3' },
  q4: { q: 'La panne figure-t-elle dans le guide de dépannage ?', yes: 'e4', no: 'e5' },
  e1: { end: 'Consigne de sécurité : débrancher, ne plus utiliser. Priorité P1, technicien sous 24 h.', tone: 'coral' },
  e2: { end: 'Panne à la livraison : échange direct de l’appareil, enlèvement offert.', tone: 'green' },
  e3: { end: 'Hors garantie : proposer un devis de réparation, ou l’extension si elle a été souscrite.', tone: 'yellow' },
  e4: { end: 'Guider le client pas à pas avec la fiche de dépannage. En cas d’échec : technicien.', tone: 'blue' },
  e5: { end: 'Intervention d’un technicien sous garantie, sous 72 h.', tone: 'violet' },
};

const M5_Arbre: Page = () => {
  const [path, setPath] = useState<{ id: string; a?: 'Oui' | 'Non' }[]>([{ id: 's' }]);
  const cur = M5_TREE[path[path.length - 1].id];
  const go = (a: 'Oui' | 'Non') => {
    const next = a === 'Oui' ? cur.yes : cur.no;
    if (!next) return;
    setPath((p) => [...p.slice(0, -1), { ...p[p.length - 1], a }, { id: next }]);
  };
  return (
    <Frame mod={5} kind="simu">
      <Title>Arbre de décision : « Mon appareil est en panne »</Title>
      <Lede>Répondez aux questions comme avec un client au téléphone. L’arbre mène toujours à la bonne procédure.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 12, ...dl(100) }}>
        <Eyebrow c={C.muted} size={18}>
          Chemin parcouru
        </Eyebrow>
        {path.slice(0, -1).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>
            <Num n={i + 1} tone="grey" size={32} />
            <span style={{ flex: 1, fontSize: 19, lineHeight: 1.35, color: C.soft }}>{M5_TREE[s.id].q}</span>
            <Tag tone={s.a === 'Oui' ? 'green' : 'coral'} size={17}>
              {s.a}
            </Tag>
          </div>
        ))}
        {path.length === 1 ? <div style={{ fontSize: 21, color: C.faint }}>Aucune réponse pour l’instant.</div> : null}
        <div style={{ marginTop: 8 }}>
          <Btn icon="reset" ghost tone="grey" size={20} onClick={() => setPath([{ id: 's' }])}>
            Recommencer
          </Btn>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 740, top: 262, width: 1060, height: 520, ...dl(200) }}>
        {cur.end ? (
          <div
            key={path.length}
            className={A.pop}
            style={{ height: '100%', boxSizing: 'border-box', background: T[cur.tone ?? 'green'].bg, borderRadius: 24, boxShadow: `inset 0 0 0 3px ${STRONG[cur.tone ?? 'green']}`, padding: '44px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}
          >
            <Eyebrow c={T[cur.tone ?? 'green'].fg} size={22}>
              Procédure à appliquer
            </Eyebrow>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, lineHeight: 1.22, color: C.navy }}>{cur.end}</div>
          </div>
        ) : (
          <div key={path.length} className={A.fade} style={{ height: '100%', boxSizing: 'border-box', background: C.card, borderRadius: 24, boxShadow: SHADOW, padding: '44px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34, animationDuration: '350ms' } as CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconTile name="split" tone="yellow" size={52} solid />
              <Eyebrow c={T.yellow.fg} size={20}>
                Question {path.length}
              </Eyebrow>
            </div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 46, lineHeight: 1.2, color: C.navy }}>{cur.q}</div>
            <div style={{ display: 'flex', gap: 18 }}>
              <Btn tone="green" icon="check" size={28} onClick={() => go('Oui')}>
                Oui
              </Btn>
              <Btn tone="coral" icon="x" size={28} onClick={() => go('Non')}>
                Non
              </Btn>
            </div>
          </div>
        )}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 740, top: 812, width: 1060, ...dl(400) }}>
        <Callout title="Avec l’IA" tone="violet" icon="sparkles" size={22}>
          « À partir de ces trois procédures, construis un arbre de décision : une question fermée par étape, chaque branche finit par une action. »
          Puis testez chaque branche avec un cas réel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Recherche dans la documentation ────────────────────────────────────────
const M5_Recherche: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Rechercher dans la documentation, sources à l’appui</Title>
    <Lede>Trois règles dans le prompt, et l’IA cite ses sources. Comparez les deux cas.</Lede>
    <CodeDark size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 640, height: 640, ...dl(100) }}>
      <Ck>Document · </Ck>
      <Cc>[procédures SAV jointes, 40 pages]</Cc>
      {'\n\n'}
      <Ck>Règles · </Ck>
      {'\n'}1. Réponds <Cf>uniquement</Cf> à partir du document joint.{'\n\n'}2. Cite la <Cf>section</Cf> d’où vient chaque information.{'\n\n'}3. Si
      la réponse n’est pas dans le document, écris : <Cs>« Information absente du document. »</Cs> N’essaie pas de deviner.{'\n\n'}
      <Ck>Question · </Ck>
      <Cc>[question du conseiller]</Cc>
    </CodeDark>
    <Tabs initial="in" cls={A.right} style={{ position: 'absolute', left: 810, top: 262, width: 990, ...dl(200) }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <TabBtn id="in" icon="checkCircle" tone="green">
          Question couverte
        </TabBtn>
        <TabBtn id="out" icon="alert" tone="coral">
          Question non couverte
        </TabBtn>
      </div>
      <TabPane id="in">
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Bubble who="human" name="Conseiller" size={23}>
            Un client a un four sous garantie qui affiche l’erreur E3. Que faire ?
          </Bubble>
          <Bubble who="agent" name="Assistant" size={23}>
            L’erreur E3 indique une sonde de température défaillante <Tag tone="blue" size={16}>§ 4.2 Codes erreur</Tag>. Sous garantie, on programme un
            technicien sous 72 h <Tag tone="blue" size={16}>§ 2.1 Interventions</Tag>. Ne pas proposer de réinitialisation : elle ne corrige pas E3{' '}
            <Tag tone="blue" size={16}>§ 4.2</Tag>.
          </Bubble>
        </div>
      </TabPane>
      <TabPane id="out">
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Bubble who="human" name="Conseiller" size={23}>
            Le client peut-il faire réparer son four par un réparateur indépendant sans perdre la garantie ?
          </Bubble>
          <Bubble who="agent" name="Assistant" size={23}>
            Information absente du document. Les procédures SAV ne traitent pas des réparateurs indépendants. Je vous suggère de poser la question au
            service juridique.
          </Bubble>
          <Callout title="C’est une bonne réponse" tone="green" icon="thumbUp" size={22}>
            « Je ne sais pas » vaut mieux qu’une règle de garantie inventée.
          </Callout>
        </div>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── La fiche de connaissance idéale ────────────────────────────────────────
const M5FL = ({ label, tone, children }: { label: string; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 210, flex: 'none', paddingTop: 3, fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M5_Fiche: Page = () => (
  <Frame mod={5}>
    <Title>La fiche de connaissance : un format pour toutes</Title>
    <Lede>Le même gabarit pour chaque fiche : l’IA le remplit, le référent le valide, tout le monde le retrouve.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 34px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <IconTile name="book" tone="teal" size={46} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>KB-042 · Livraison à l’étage</span>
      </div>
      <M5FL label="Question client" tone="blue">
        « Le livreur peut-il monter mon lave-linge au 4e sans ascenseur ? »
      </M5FL>
      <M5FL label="Réponse courte" tone="violet">
        Oui, avec l’option « livraison en étage » (29 €), à choisir avant l’expédition.
      </M5FL>
      <M5FL label="Conditions" tone="yellow">
        Escalier praticable ; jusqu’au 6e étage ; produits de plus de 30 kg uniquement.
      </M5FL>
      <M5FL label="Mots-clés" tone="teal">
        étage, escalier, monter, porter, installation
      </M5FL>
      <M5FL label="Source" tone="navy">
        Conditions de livraison, § 3.4
      </M5FL>
      <M5FL label="Mise à jour" tone="green">
        12/10/2026 · validée par S. Martin (référente qualité)
      </M5FL>
    </div>
    <div style={{ position: 'absolute', left: 1270, top: 262, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="chat" title="Les mots du client" cls={A.right} style={dl(300)} size={22}>
        La question et les mots-clés sont écrits comme le client parle : on retrouve la fiche avec ses mots.
      </Card>
      <Card tone="green" icon="calendar" title="Daté et signé" cls={A.right} style={dl(450)} size={22}>
        Une fiche sans date ni responsable finit par mentir. Prévoyez une révision régulière.
      </Card>
    </div>
  </Frame>
);

// ─── Kit + atelier 4 ────────────────────────────────────────────────────────
const M5_Kit: Page = () => (
  <Frame mod={5} kind="atelier">
    <Title>Atelier 4 · la documentation à transformer</Title>
    <Lede>Extrait de la note interne « Garantie et SAV » de Nova Maison : dense, juste… et inutilisable pendant un appel.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: '#FBFBF8', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '26px 36px', fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.62, color: C.soft, ...dl(100) }}
    >
      <div style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>Note interne SAV-07 · Garantie, pannes et interventions (v3)</div>
      Tous les appareils électroménagers bénéficient de la garantie légale de conformité de deux ans à compter de la livraison. Toute panne constatée
      dans les 14 jours suivant la livraison donne lieu à un échange standard sans diagnostic préalable, l’enlèvement étant pris en charge. Au-delà, le
      conseiller oriente d’abord le client vers le guide de dépannage (codes erreur, réinitialisation), sauf code E3, E7 ou F2 qui nécessitent
      systématiquement un technicien. Les interventions sous garantie sont planifiées sous 72 h ouvrées, sur créneau de 2 h ; un SMS est envoyé la
      veille. En cas de seconde intervention infructueuse sur le même appareil, l’échange est proposé, sous validation du superviseur. Toute situation
      présentant un risque (fumée, étincelles, odeur de brûlé, fuite importante) impose une consigne de mise hors tension immédiate et une intervention
      prioritaire sous 24 h. Les appareils hors garantie font l’objet d’un devis (déplacement 49 €, déductible en cas de réparation). L’extension de
      garantie, si souscrite, prolonge les mêmes conditions de trois ans.
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(600) }}>
      <Icon name="eye" size={24} color={C.violet} />
      Neuf règles cachées dans un seul paragraphe. Combien en trouvez-vous à la première lecture ?
    </div>
  </Frame>
);

const M5_Atelier: Page = () => (
  <LabPage
    mod={5}
    n="4"
    title="Transformer une documentation en base de réponses"
    defi="connaissances"
    who="En binôme · 15 min"
    minutes={15}
    objective={
      <>
        À partir de la note SAV-07, produire avec l’IA une <strong>mini-base de connaissances</strong> utilisable pendant un appel.
      </>
    }
    where={
      <>
        Une FAQ de 6 questions client
        <br />
        Un arbre de décision « panne »
        <br />
        Une fiche de connaissance complète
      </>
    }
    crit={
      <>
        <CheckItem id="a4-1" size={21}>
          Les 9 règles de la note retrouvées
        </CheckItem>
        <CheckItem id="a4-2" size={21}>
          Questions écrites avec les mots du client
        </CheckItem>
        <CheckItem id="a4-3" size={21}>
          Chaque branche de l’arbre se termine par une action
        </CheckItem>
        <CheckItem id="a4-4" size={21}>
          Rien d’ajouté qui ne soit dans la note
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Demandez à l’IA de lister toutes les règles de la note (numérotées). <strong>2.</strong> Générez la FAQ (6 questions).{' '}
    <strong>3.</strong> Générez l’arbre de décision « panne ». <strong>4.</strong> Remplissez une fiche au format KB. <strong>5.</strong> Testez :
    posez à l’IA une question hors note, avec la règle « réponds seulement à partir du document ».
    <Bonus>Demandez un script téléphonique pour le cas « code E3 » et faites-le jouer à votre binôme.</Bonus>
  </LabPage>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>Quiz : la base de connaissances</Title>
    <QuizSeries y={220}>
      <QuizQ q="Vous posez une question absente de la documentation fournie. La meilleure réponse de l’IA est…" explain="Avec la règle « uniquement à partir du document », l’IA doit signaler l’absence d’information. Une réponse inventée serait diffusée à tous les clients.">
        <QOpt>Une réponse générale tirée de ses connaissances</QOpt>
        <QOpt ok>« Information absente du document. »</QOpt>
        <QOpt>La règle la plus probable dans le secteur</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi écrire les questions de la FAQ avec les mots des clients ?" explain="Le conseiller et le client cherchent avec leurs propres mots (« mon colis », pas « litige transporteur ») : la fiche doit être trouvable avec ces mots.">
        <QOpt>Pour faire plus sympathique</QOpt>
        <QOpt ok>Pour qu’on retrouve la fiche avec les mots qu’on tape vraiment</QOpt>
        <QOpt>Parce que l’IA ne comprend pas le vocabulaire métier</QOpt>
      </QuizQ>
      <QuizQ q="Qu’est-ce qui rend une fiche de connaissance fiable dans le temps ?" explain="Une source, une date et un responsable : on sait d’où vient l’information, quand elle a été vérifiée, et qui la met à jour.">
        <QOpt>Sa longueur</QOpt>
        <QOpt>Le fait qu’elle ait été générée par l’IA</QOpt>
        <QOpt ok>Sa source, sa date de mise à jour et son responsable</QOpt>
      </QuizQ>
      <QuizQ q="Un arbre de décision bien construit…" explain="Une question fermée par étape (oui / non), et chaque branche se termine par une action concrète. Sinon, le conseiller reste bloqué au milieu.">
        <QOpt ok>Pose des questions fermées et finit toujours par une action</QOpt>
        <QOpt>Contient toutes les exceptions possibles</QOpt>
        <QOpt>Remplace la procédure écrite</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Module 5 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Une base de connaissances = <strong>une seule vérité</strong>, trouvable en quelques secondes par tous.
      </SynthRow>
      <SynthRow n={2} tone="teal">
        Les vraies questions fréquentes sont <strong>dans vos messages</strong> : l’IA les regroupe et les compte.
      </SynthRow>
      <SynthRow n={3} tone="violet">
        FAQ, procédures, scripts, arbres : l’IA <strong>transforme le format</strong>, jamais le fond.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        Recherche : « <strong>seulement à partir du document</strong>, cite la section, sinon dis-le ».
      </SynthRow>
      <SynthRow n={5} tone="green">
        Chaque fiche a une <strong>source, une date et un responsable</strong>, et elle est validée avant publication.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : le prompt de recherche documentaire et le gabarit de fiche KB.
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Probleme, M5_FAQ, M5_Frequentes, M5_Procedure, M5_Script, M5_Arbre, M5_Recherche, M5_Fiche, M5_Kit, M5_Atelier, M5_Quiz, M5_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 5 · OUVERTURE DE SECTION · 14:30

OBJECTIF — Annoncer le module : capitaliser l’information.

DIRE — « Combien de temps passez-vous chaque jour à chercher une information ? Ce module, c’est la base de connaissances : la FAQ, les procédures, les scripts, les arbres de décision, et la recherche dans la documentation. L’IA est redoutable pour transformer un document touffu en réponses prêtes à l’emploi. »

TRANSITION — « Partons d’un problème que vous connaissez. »`,
  `⏱ 3 min · UNE QUESTION, CINQ RÉPONSES (→ ×6)

OBJECTIF — Faire ressentir le coût d’une information non partagée.

DIRE — Lire la question. → → → → → les cinq réponses. « Cinq conseillers, cinq réponses. Le client qui rappelle tombe sur quelqu’un d’autre et entend autre chose : il perd confiance. » → « La bonne réponse, c’est celle de la procédure. Une base de connaissances, c’est une seule vérité, accessible à tous. »

ANIMATION — Demander : « Ça vous arrive ? Sur quelle question ? »

TRANSITION — « Comment la construire vite ? En partant de vos documents. »`,
  `⏱ 3 min · DU DOCUMENT À LA FAQ (→ ×5)

OBJECTIF — Montrer la transformation d’un article de CGV en FAQ client.

DIRE — « À gauche, l’article 7 des conditions générales : juste, complet, illisible pour un client. Le prompt : transforme en FAQ, questions formulées comme un client, réponses courtes, rien d’ajouté. » → → → → les quatre questions. → « Et on vérifie : aucune condition oubliée, aucune ajoutée. Ici, l’exception des 30 kg est bien là. »

TRANSITION — « Mais quelles questions mettre dans la FAQ ? »`,
  `⏱ 3 min · LES VRAIES QUESTIONS FRÉQUENTES (→ ×2)

OBJECTIF — Utiliser les messages clients pour trouver les questions réelles.

DIRE — « On fournit à l’IA 200 messages anonymisés. Elle les regroupe par question, avec les mots des clients, et les compte. » → les barres. → « Et la découverte : deux des cinq questions les plus posées n’ont pas de réponse dans la FAQ. On commence par elles. »

INSISTER — Messages anonymisés, outil autorisé.

TRANSITION — « Pour les conseillers, les procédures. »`,
  `⏱ 3 min · PROCÉDURES PAS À PAS (→ ×5)

OBJECTIF — Transformer un paragraphe de procédure en étapes avec points de contrôle.

DIRE — « La procédure « colis non reçu » tient en une phrase de six lignes. Pendant un appel, impossible à suivre. » Dérouler les cinq étapes. « Chaque étape une action, et des points de contrôle en jaune : c’est là qu’on se trompe le plus. Notez l’exception à plus de 1 000 € : elle était cachée à la fin de la phrase. »

TRANSITION — « Au téléphone, on a besoin d’un script. »`,
  `⏱ 3 min · SCRIPTS DE RÉPONSE (→ ×5)

OBJECTIF — Produire une trame téléphonique à partir de la procédure.

DIRE — Dérouler : accueil, vérification, branche « si… alors », engagement, conclusion. « Ce n’est pas un texte à réciter : c’est une trame. Vous gardez votre voix ; le script garantit que vous n’oubliez aucune étape. »

TRANSITION — « Quand les cas se ramifient, un arbre de décision. »`,
  `⏱ 4 min · ARBRE DE DÉCISION (simulateur)

OBJECTIF — Faire vivre un arbre de décision et montrer qu’il mène toujours à une action.

DIRE — « Un client appelle : son appareil est en panne. » Faire répondre la salle à chaque question. Parcourir au moins deux chemins : risque → P1 ; puis livré il y a 3 semaines, sous garantie, panne non répertoriée → technicien sous 72 h. « Chaque branche se termine par une action. Le conseiller ne reste jamais bloqué. »

ANIMATION — Bouton « Recommencer » pour un autre chemin. Montrer le prompt qui génère l’arbre.

TRANSITION — « Et quand la documentation fait 40 pages ? »`,
  `⏱ 4 min · RECHERCHE DANS LA DOCUMENTATION (onglets)

OBJECTIF — Utiliser l’IA comme moteur de recherche documentaire fiable.

DIRE — « Trois règles : seulement le document, citer la section, et dire quand l’information est absente. » Onglet 1 : « Réponse avec ses sources : vous vérifiez en un clic. » Onglet 2 : « Question non couverte : l’IA le dit. C’est la meilleure réponse possible. »

INSISTER — Beaucoup d’outils professionnels intègrent cette recherche dans la base de l’entreprise : le principe est le même.

TRANSITION — « Dernier élément : le format des fiches. »`,
  `⏱ 2 min · LA FICHE DE CONNAISSANCE

OBJECTIF — Donner un gabarit standard de fiche.

DIRE — Parcourir les rubriques. « La question et les mots-clés avec les mots du client. Une réponse courte, les conditions, la source, et surtout la date et le responsable. Une fiche sans date finit par mentir. »

TRANSITION — « À vous : atelier 4. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 4

OBJECTIF — Présenter la note SAV-07 à transformer.

DIRE — « Voici une vraie note interne type : un seul paragraphe, neuf règles. Combien en trouvez-vous en le lisant ? » Laisser 30 secondes, recueillir. « L’IA va les extraire toutes, et vous allez vérifier. »

TRANSITION — « Les consignes. »`,
  `⏱ 15 min · ATELIER 4 (minuteur 15 min)

OBJECTIF — Produire une mini-base de connaissances à partir d’une documentation.

DIRE — « En binôme : listez les règles, générez la FAQ, l’arbre « panne » et une fiche KB. Et testez la recherche avec une question hors note. »

ANIMATION — Vérifier que les exceptions sont présentes (codes E3, E7, F2 ; 2e intervention ; frais de déplacement déductibles). Les neuf règles : garantie 2 ans ; panne < 14 jours = échange ; enlèvement pris en charge ; guide de dépannage d’abord ; E3/E7/F2 = technicien ; intervention sous 72 h, créneau 2 h, SMS la veille ; 2e échec = échange validé superviseur ; risque = mise hors tension + 24 h ; hors garantie = devis 49 € déductible (+ extension 3 ans).

TRANSITION — « Un quiz avant la pause. »`,
  `⏱ 3 min · QUIZ MODULE 5 (4 questions)

OBJECTIF — Vérifier : information absente, mots du client, fiabilité, arbre.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « Synthèse, puis pause. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 5 · 15:20

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Après la pause, on prend de la hauteur : on va analyser des centaines de conversations pour améliorer le service. »

TRANSITION — Pause de quinze minutes.`,
];
// @@NOTES-END
