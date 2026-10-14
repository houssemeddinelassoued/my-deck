// ─── Module 2 · Maîtriser les prompts ───────────────────────────────────────
const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Maîtriser les prompts
        <br />
        pour les tâches administratives
      </>
    }
    sub="Un prompt, c’est une consigne. Bien écrite, elle donne un résultat utilisable du premier coup ; floue, elle fait perdre du temps."
    dur="10:30 – 11:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · bibliothèque de prompts
      </Tag>
    }
  >
    <SecItem n={1}>La structure d’un prompt efficace</SecItem>
    <SecItem n={2}>Contexte, résultat attendu, contraintes</SecItem>
    <SecItem n={3}>Obtenir une réponse structurée</SecItem>
    <SecItem n={4}>Créer des prompts réutilisables</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Avant / après ──────────────────────────────────────────────────────────
const M2_AvantApres: Page = () => {
  const [good, setGood] = useState(false);
  return (
    <Frame mod={2} kind="demo">
      <Title>Même besoin, deux demandes, deux résultats</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={good} onChange={setGood} tone="green" size={28} label={<strong>Afficher la demande précise</strong>} />
        <Tag tone={good ? 'green' : 'coral'} size={22}>
          {good ? 'Prêt à envoyer après relecture' : 'À réécrire presque entièrement'}
        </Tag>
      </div>
      <div key={good ? 'g' : 'v'} className={A.fade} style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: '700px 1fr', gap: 40, animationDuration: '400ms' } as CSSProperties}>
        <div>
          <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
            La demande
          </Eyebrow>
          <Bubble who="user" w={660} size={good ? 22 : 26}>
            {good ? (
              <>
                Tu es assistante de direction. M. Garnier doit <strong>reporter le comité de direction du jeudi 14 au jeudi 21 novembre</strong>, même heure (9 h, salle Loire), à cause d’un déplacement client. Rédige l’email aux 6 participants. Ton cordial, 100 mots maximum, demande de confirmer sa présence avant le vendredi 15. Donne l’objet puis le corps, sans signature.
              </>
            ) : (
              <>Écris un mail pour décaler la réunion.</>
            )}
          </Bubble>
        </div>
        <div>
          <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
            La réponse de l’IA
          </Eyebrow>
          <div style={{ background: good ? T.green.bg : T.coral.bg, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${good ? T.green.bd : T.coral.bd}`, padding: '22px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>
            {good ? (
              <>
                <strong>Objet : Report du comité de direction au jeudi 21 novembre</strong>
                <br />
                <br />
                Bonjour à toutes et à tous,
                <br />
                En raison d’un déplacement client de M. Garnier, le comité de direction prévu le jeudi 14 novembre est reporté au <strong>jeudi 21 novembre, à 9 h, salle Loire</strong>. L’ordre du jour reste inchangé.
                <br />
                Merci de bien vouloir confirmer votre présence avant le vendredi 15 novembre.
                <br />
                Belle journée à vous,
              </>
            ) : (
              <>
                <strong>Objet : Changement de date de la réunion</strong>
                <br />
                <br />
                Bonjour [Nom],
                <br />
                Je me permets de vous contacter afin de vous informer que la réunion prévue le <strong>[date]</strong> doit malheureusement être décalée pour des raisons d’organisation. Nous vous proposons de la reporter au <strong>[nouvelle date]</strong>. N’hésitez pas à revenir vers moi pour toute question.
                <br />
                Cordialement, [Votre nom]
              </>
            )}
          </div>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.soft, ...dl(400) }}>
        <Icon name="bulb" size={28} color={C.violet} />
        <span>30 secondes de plus pour écrire la demande, <strong style={{ color: C.navy }}>5 minutes de moins à corriger</strong>.</span>
      </div>
    </Frame>
  );
};

// ─── Structure d’un prompt (R-C-T-C-F) ──────────────────────────────────────
const M2_BLOCKS: { k: string; label: string; tone: Tone; txt: string; q: string }[] = [
  { k: 'R', label: 'Rôle', tone: 'blue', txt: 'Tu es assistante de direction dans une PME de 85 salariés.', q: 'Qui l’IA doit-elle être ?' },
  { k: 'C', label: 'Contexte', tone: 'violet', txt: 'Un client, M. Lambert, se plaint d’une livraison de bureaux arrivée avec 10 jours de retard.', q: 'Que se passe-t-il ?' },
  { k: 'T', label: 'Tâche', tone: 'teal', txt: 'Rédige la réponse à son email de réclamation.', q: 'Que doit-elle produire ?' },
  { k: 'C', label: 'Contraintes', tone: 'coral', txt: 'Ton empathique et professionnel, 150 mots max., aucune promesse de remboursement.', q: 'Quelles règles respecter ?' },
  { k: 'F', label: 'Format', tone: 'green', txt: 'Donne l’objet puis le corps de l’email, sans signature.', q: 'Sous quelle forme ?' },
];

const M2_Structure: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>La structure d’un prompt efficace : R · C · T · C · F</Title>
    <Lede>Cinq ingrédients. Tous ne sont pas obligatoires, mais chacun améliore le résultat.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {M2_BLOCKS.map((bk, i) => (
        <div key={bk.label} className={b.left(i + 1)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
          <Num n={bk.k} tone={bk.tone} size={56} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: STRONG[bk.tone] }}>{bk.label}</div>
            <div style={{ fontSize: 21, color: C.muted }}>{bk.q}</div>
          </div>
        </div>
      ))}
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 280, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Le prompt, construit pas à pas
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M2_BLOCKS.map((bk, i) => (
          <div key={bk.label} className={b.fade(i + 1)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ flex: 'none', width: 10, alignSelf: 'stretch', borderRadius: 5, background: STRONG[bk.tone] }} />
            <span style={{ fontSize: 27, lineHeight: 1.45, color: C.ink }}>{bk.txt}</span>
          </div>
        ))}
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 740, top: 790, width: 1060 }}>
      <Callout title="Moyen mnémotechnique" tone="violet" icon="bulb" size={24}>
        « <strong>R</strong>édiger <strong>C</strong>orrectement <strong>T</strong>outes <strong>C</strong>es <strong>F</strong>ormules » : rôle, contexte, tâche, contraintes, format.
      </Callout>
    </div>
  </Frame>
);

// ─── Donner un contexte (toggles) ───────────────────────────────────────────
const M2_CTX: { label: string; guess: string; tone: Tone }[] = [
  { label: 'Qui je suis', guess: 'Qui écrit, au nom de qui ?', tone: 'blue' },
  { label: 'À qui j’écris', guess: 'Un client, un collègue, un fournisseur ?', tone: 'violet' },
  { label: 'La situation', guess: 'Que s’est-il passé, quand, où ?', tone: 'teal' },
  { label: 'L’historique', guess: 'Premier contact ou troisième relance ?', tone: 'yellow' },
  { label: 'L’objectif', guess: 'Informer, rassurer, obtenir une réponse ?', tone: 'green' },
];

const M2_Contexte: Page = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const n = on.filter(Boolean).length;
  const pct = 20 + n * 16;
  return (
    <Frame mod={2} kind="simu">
      <Title>Donner un contexte : ce que l’IA ne peut pas deviner</Title>
      <Lede>Activez les éléments de contexte : à chaque ajout, l’IA a une question de moins à deviner.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {M2_CTX.map((c, i) => (
          <Toggle key={c.label} on={on[i]} onChange={() => setOn((o) => o.map((x, j) => (j === i ? !x : x)))} tone={c.tone} size={27} label={<span style={{ fontWeight: 600 }}>{c.label}</span>} />
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 960, top: 280, width: 840, ...dl(150) }}>
        <Eyebrow c={C.navy} size={19}>
          Ce que l’IA doit encore deviner
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {M2_CTX.map((c, i) => (
            <div
              key={c.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 25,
                color: on[i] ? C.faint : C.ink,
                textDecoration: on[i] ? 'line-through' : 'none',
                transition: `color 400ms ${EASE}`,
              }}
            >
              <Icon name={on[i] ? 'checkCircle' : 'alert'} size={28} color={on[i] ? C.green : C.amber} />
              {c.guess}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Pertinence de la réponse</span>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: n >= 4 ? C.green : n >= 2 ? C.amber : C.coral }}>{pct} %</span>
          </div>
          <div style={{ marginTop: 10, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 11, background: n >= 4 ? G.green : n >= 2 ? STRONG.yellow : STRONG.coral, transition: `width 600ms ${EASE}` }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 19, color: C.faint }}>Jauge illustrative</div>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 870, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.soft, ...dl(500) }}>
        <Icon name="user" size={28} color={C.violet} />
        <span>Le bon test : <strong style={{ color: C.navy }}>un intérimaire arrivé ce matin comprendrait-il ma demande ?</strong></span>
      </div>
    </Frame>
  );
};

// ─── Résultat attendu & contraintes ─────────────────────────────────────────
const M2Item = ({ n, icon, tone, label, ex }: { n: number; icon: IconName; tone: Tone; label: string; ex: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 20, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
    </div>
  </div>
);

const M2_Resultat: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Définir le résultat attendu, poser les contraintes</Title>
    <Lede>Dites ce que vous voulez recevoir, et ce que vous ne voulez surtout pas.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 810 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <IconTile name="target" tone="blue" size={44} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Le résultat attendu</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M2Item n={1} icon="doc" tone="blue" label="Le type de document" ex="un email, une note interne, un tableau, un courrier" />
        <M2Item n={1} icon="user" tone="blue" label="Le lecteur" ex="« pour mon directeur », « pour un client mécontent »" />
        <M2Item n={1} icon="gauge" tone="blue" label="La longueur" ex="« 5 lignes », « 150 mots », « une page maximum »" />
        <M2Item n={1} icon="chat" tone="blue" label="Le ton" ex="cordial, ferme, rassurant, institutionnel" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 270, width: 810 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, ...dl(150) }}>
        <IconTile name="shield" tone="coral" size={44} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Les contraintes</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M2Item n={2} icon="check" tone="green" label="À faire" ex="« vouvoie », « rappelle la référence de commande »" />
        <M2Item n={2} icon="x" tone="coral" label="À ne pas faire" ex="« aucune promesse de délai », « pas de jargon »" />
        <M2Item n={2} icon="book" tone="violet" label="À respecter" ex="« utilise uniquement les informations ci-dessous »" />
        <M2Item n={2} icon="alert" tone="yellow" label="En cas de doute" ex="« si une information manque, signale-la entre crochets »" />
      </div>
    </div>
    <div className={b.fade(2)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout title="La contrainte qui change tout" tone="green" icon="shieldCheck" size={24}>
        « <strong>Si une information manque, ne l’invente pas : écris [À COMPLÉTER].</strong> » Vous repérez ensuite les trous d’un coup d’œil.
      </Callout>
    </div>
  </Frame>
);

// ─── Obtenir une réponse structurée (onglets) ───────────────────────────────
const M2_TH: CSSProperties = { textAlign: 'left', padding: '12px 18px', fontFamily: display, fontWeight: 700, fontSize: 21, color: '#fff', background: C.navy };
const M2_TD: CSSProperties = { padding: '12px 18px', fontSize: 22, color: C.ink, borderBottom: `1.5px solid ${C.rule}` };

const M2_Format: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Obtenir une réponse structurée</Title>
    <Lede>
      Demande : « Présente les 3 devis de traiteur reçus pour le séminaire de mars. » Puis on choisit la forme.
    </Lede>
    <Tabs initial="tab" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="tab" tone="blue" icon="table">
          « …sous forme de tableau »
        </TabBtn>
        <TabBtn id="puces" tone="violet" icon="layers">
          « …en 3 puces »
        </TabBtn>
        <TabBtn id="reco" tone="green" icon="star">
          « …avec une recommandation »
        </TabBtn>
      </div>
      <TabPane id="tab">
        <table style={{ width: 1400, borderCollapse: 'separate', borderSpacing: 0, background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW }}>
          <thead>
            <tr>
              <th style={M2_TH}>Traiteur</th>
              <th style={M2_TH}>Prix / personne</th>
              <th style={M2_TH}>Option végétarienne</th>
              <th style={M2_TH}>Délai de confirmation</th>
              <th style={M2_TH}>Point d’attention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={M2_TD}>Saveurs d’Erdre</td>
              <td style={M2_TD}>38 € HT</td>
              <td style={M2_TD}>Oui</td>
              <td style={M2_TD}>J − 10</td>
              <td style={M2_TD}>Boissons en supplément</td>
            </tr>
            <tr>
              <td style={M2_TD}>Le Panier Nantais</td>
              <td style={M2_TD}>32 € HT</td>
              <td style={M2_TD}>Sur demande</td>
              <td style={M2_TD}>J − 15</td>
              <td style={M2_TD}>Minimum 40 couverts</td>
            </tr>
            <tr>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>Maison Corbin</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>45 € HT</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>Oui</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>J − 7</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>Service et vaisselle inclus</td>
            </tr>
          </tbody>
        </table>
      </TabPane>
      <TabPane id="puces">
        <div style={{ width: 1400, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '26px 34px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Bullet size={26} tone="violet">
            <strong>Le Panier Nantais</strong> est le moins cher (32 € HT), mais exige 40 couverts minimum et une confirmation à J − 15.
          </Bullet>
          <Bullet size={26} tone="violet">
            <strong>Saveurs d’Erdre</strong> est intermédiaire (38 € HT), boissons non comprises.
          </Bullet>
          <Bullet size={26} tone="violet">
            <strong>Maison Corbin</strong> est le plus cher (45 € HT), mais inclut service et vaisselle.
          </Bullet>
        </div>
      </TabPane>
      <TabPane id="reco">
        <div style={{ width: 1400, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '26px 34px', fontSize: 26, lineHeight: 1.5, color: C.ink }}>
          Pour 35 participants, <strong>Le Panier Nantais</strong> est exclu (minimum 40 couverts). Entre les deux autres, <strong>Maison Corbin</strong> coûte 7 € de plus par personne mais inclut service et vaisselle, ce qui évite une location séparée.{' '}
          <span style={{ color: T.blue.fg, fontWeight: 600 }}>Recommandation : demander à Saveurs d’Erdre le prix des boissons avant de trancher.</span>
        </div>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 14, flexWrap: 'wrap', ...dl(400) }}>
      <Tag tone="grey" size={22}>
        <Icon name="table" size={22} /> tableau avec colonnes imposées
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="layers" size={22} /> liste à puces
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="check" size={22} /> checklist à cocher
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="doc" size={22} /> plan avec titres
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="mail" size={22} /> objet + corps d’email
      </Tag>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 850, width: 1680, fontSize: 23, color: C.soft, ...dl(500) }}>
      Astuce : nommez les colonnes vous-même (« colonnes : traiteur, prix, délai ») pour pouvoir coller le tableau directement dans Excel.
    </div>
  </Frame>
);

// ─── Itérer : la conversation ───────────────────────────────────────────────
const M2_Iterer: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Le premier jet n’est qu’un brouillon : affinez</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bubble who="user" w={900} size={22} cls={A.in}>
        Rédige une note interne annonçant la fermeture du parking du 2 au 6 décembre pour travaux.
      </Bubble>
      <Bubble who="agent" name="Version 1" w={940} size={22} cls={b.on(1)}>
        Chers collaborateurs, nous souhaitons vous informer que, dans le cadre de travaux de rénovation indispensables à l’amélioration de nos infrastructures, le parking sera fermé… <span style={{ color: C.muted }}>(12 lignes)</span>
      </Bubble>
      <Bubble who="user" w={900} size={22} cls={b.on(2)}>
        Trop long. 5 lignes maximum, et ajoute la solution : le parking municipal rue Paul-Bert, avec badge remis à l’accueil.
      </Bubble>
      <Bubble who="agent" name="Version 2" w={940} size={22} cls={b.on(3)}>
        <strong>Parking fermé du 2 au 6 décembre (travaux).</strong> Pendant cette période, vous pouvez stationner au parking municipal, rue Paul-Bert. Les badges d’accès sont à retirer à l’accueil dès le 28 novembre. Merci de votre compréhension.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 190, width: 540 }}>
      <Eyebrow c={C.navy} size={19} cls={A.fade}>
        Les relances qui marchent
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['« Plus court / plus long »', '« Plus formel / plus chaleureux »', '« Ajoute… / retire… »', '« Propose 3 versions »', '« Que manque-t-il ? »', '« Corrige l’orthographe uniquement »'].map((t, i) => (
          <div key={t} className={b.left(4)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '12px 18px', fontSize: 23, color: C.ink, ...dl(i * 90) }}>
            <Icon name="loop" size={24} color={C.violet} /> {t}
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

// ─── Prompts réutilisables (modèle à trous) ─────────────────────────────────
const M2V = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#FFD27A', background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '0 6px' }}>[{children}]</span>
);

const M2_Modele: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Créer des prompts réutilisables</Title>
    <Lede>Écrivez-le une fois, avec des [CROCHETS] à la place de ce qui change. Réutilisez-le cent fois.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <CodeDark file="modèle · réponse à une demande de devis" size={24} wrap>
        Tu es assistante commerciale chez <M2V>ENTREPRISE</M2V>, qui vend <M2V>PRODUITS</M2V>.{'\n'}
        Un prospect, <M2V>NOM</M2V>, demande un devis pour <M2V>BESOIN</M2V>.{'\n'}
        Rédige un email qui :{'\n'}
        {'  '}1. le remercie de sa demande ;{'\n'}
        {'  '}2. confirme l’envoi du devis sous <M2V>DÉLAI</M2V> ;{'\n'}
        {'  '}3. pose les questions manquantes : <M2V>QUESTIONS</M2V>.{'\n'}
        Ton professionnel et chaleureux, 120 mots maximum.{'\n'}
        Format : objet, puis corps de l’email, sans signature.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="archive" title="Où les ranger ?" cls={b.on(1)} size={22}>
        Un document « Ma bibliothèque de prompts », classé par usage : emails, comptes rendus, tableaux…
      </Card>
      <Card tone="blue" icon="gear" title="Encore mieux" cls={b.on(1)} size={22} style={dl(120)}>
        Selon l’outil : instructions personnalisées, assistants ou « gems » pré-configurés avec vos règles.
      </Card>
      <Card tone="green" icon="users" title="À partager" cls={b.on(2)} size={22}>
        Une bibliothèque d’équipe harmonise le ton de tous les courriers du service.
      </Card>
    </div>
    <div className={b.fade(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1060, fontSize: 23, color: C.soft, display: 'flex', gap: 14, alignItems: 'center' }}>
      <Icon name="bulb" size={28} color={C.violet} /> Astuce : demandez à l’IA de transformer votre meilleur échange en modèle à crochets.
    </div>
  </Frame>
);

// ─── Exercice : défauts d’un prompt (hotspots) ──────────────────────────────
const M2_Defauts: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Exercice : cinq défauts dans cette demande</Title>
    <Lede>Trouvez-les à l’oral, puis cliquez les pastilles. Ensuite, réécrivez-la avec R · C · T · C · F.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <CodeDark file="demande de Nadia (version 0)" size={25}>
        Fais-moi un compte rendu de la réunion d’hier.{'\n'}
        Il faut que ce soit bien et pas trop long.{'\n'}
        Mets aussi les chiffres du trimestre dedans,{'\n'}
        et envoie-le à toute l’équipe.{'\n'}
        {'\n'}
        Notes : voir pièce jointe CR_RH_salaires_2025.xlsx
      </CodeDark>
    </div>
    <Hotspot n={1} x={1245} y={340} title="Aucun contexte" w={480}>
      Quelle réunion, quels participants ? Les notes ne sont même pas fournies dans le texte.
    </Hotspot>
    <Hotspot n={2} x={1245} y={380} title="Critères flous" w={480}>
      « Bien », « pas trop long » : quel plan, combien de mots, pour quel lecteur ?
    </Hotspot>
    <Hotspot n={3} x={1245} y={420} title="Chiffres non fournis" w={480}>
      L’IA ne les connaît pas : elle risque de les inventer.
    </Hotspot>
    <Hotspot n={4} x={1245} y={460} title="Elle n’envoie rien" w={480}>
      L’IA rédige ; c’est vous qui relisez puis envoyez.
    </Hotspot>
    <Hotspot n={5} x={1245} y={540} title="Données sensibles" w={480}>
      Un fichier de salaires n’a rien à faire dans un assistant IA.
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 640, width: 1100, ...dl(500) }}>
      <Callout title="Version corrigée, en résumé" tone="green" icon="checkCircle" size={23}>
        Rôle + réunion (date, participants, objet) + notes collées et anonymisées + plan imposé (décisions, actions, responsables, échéances) + 1 page max. + « signale ce qui manque ».
      </Callout>
    </div>
  </Frame>
);

// ─── QCM M2 ─────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={1}
    title="Quel est le meilleur prompt ?"
    q="Nadia doit relancer un fournisseur qui n’a pas livré les ramettes de papier commandées il y a 3 semaines. Quelle demande donnera le meilleur résultat ?"
    explain="La réponse C contient un rôle, le contexte (commande, date, retard), la tâche, des contraintes (ton, longueur, demande de date) et un format. Les autres obligent l’IA à deviner, ou lui demandent d’agir à votre place."
  >
    <Opt why="Aucun contexte : quel fournisseur, quelle commande, quel ton ? Le résultat sera générique.">Écris une relance fournisseur.</Opt>
    <Opt why="La menace et le ton agressif sont imposés sans nuance : risqué pour la relation commerciale.">Écris un email très sec au fournisseur pour qu’il comprenne qu’on n’est pas contents.</Opt>
    <Opt ok why="Exact : rôle, contexte, tâche, contraintes et format sont présents.">
      Tu es assistante de direction. Commande n° 4521 de 50 ramettes passée le 2 octobre, non livrée. Rédige une relance ferme mais courtoise, 80 mots, qui demande une date de livraison ferme. Objet + corps.
    </Opt>
    <Opt why="L’IA n’envoie pas d’email à votre place dans un assistant classique, et vous devez relire avant l’envoi.">Envoie une relance au fournisseur de papier.</Opt>
  </QcmPage>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Créer votre bibliothèque de prompts"
    defi="prompts"
    who="En binôme"
    minutes={25}
    where={
      <>
        Un document <strong>« Ma bibliothèque de prompts »</strong> avec au moins 5 modèles à crochets, chacun testé une fois dans votre assistant IA.
      </>
    }
    objective={
      <>
        Rédiger cinq prompts <strong>réutilisables</strong> pour vos tâches les plus fréquentes, en appliquant la structure R · C · T · C · F.
      </>
    }
    crit={
      <>
        <CheckItem id="a2-c1" size={21}>Les 5 ingrédients sont présents</CheckItem>
        <CheckItem id="a2-c2" size={21}>Ce qui change est entre [CROCHETS]</CheckItem>
        <CheckItem id="a2-c3" size={21}>Chaque prompt a été testé</CheckItem>
        <CheckItem id="a2-c4" size={21}>Un nom clair pour le retrouver</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet size={22} tone="violet">
        Partez des <strong>5 tâches de l’atelier 1</strong> ou des modèles proposés page suivante.
      </Bullet>
      <Bullet size={22} tone="violet">
        Testez chaque prompt avec un cas fictif, puis améliorez-le <strong>une fois</strong>.
      </Bullet>
      <Bullet size={22} tone="violet">
        Ajoutez la ligne : « si une information manque, écris [À COMPLÉTER] ».
      </Bullet>
    </div>
    <Bonus>Demandez à l’IA : « Pose-moi les questions dont tu as besoin avant de rédiger. » Comparez le résultat.</Bonus>
  </LabPage>
);

// ─── Exemples de bibliothèque ───────────────────────────────────────────────
const M2Lib = ({ icon, tone, name, use, prompt }: { icon: IconName; tone: Tone; name: string; use: string; prompt: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} />
      <div>
        <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{name}</div>
        <div style={{ fontSize: 18, color: C.muted }}>{use}</div>
      </div>
    </div>
    <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.soft }}>{prompt}</div>
  </div>
);

const M2_Biblio: Page = () => (
  <Frame mod={2} kind="lab">
    <Title>Atelier 2 · Cinq modèles pour démarrer</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Lib icon="mail" tone="teal" name="Réponse type" use="emails entrants" prompt="Tu es [RÔLE]. Réponds à cet email de [EXPÉDITEUR] : [EMAIL]. Objectif : [OBJECTIF]. Ton [TON], [N] mots max. Objet + corps." />
      <M2Lib icon="loop" tone="violet" name="Reformulation" use="tous écrits" prompt="Reformule ce texte pour [LECTEUR] : plus [clair / court / diplomate]. Garde tous les faits, ne rajoute rien. Texte : [TEXTE]" />
      <M2Lib icon="doc" tone="navy" name="Compte rendu" use="réunions" prompt="À partir de ces notes de la réunion [OBJET] du [DATE] : [NOTES]. Rédige un CR : contexte, décisions, actions (qui / quoi / quand). 1 page max." />
      <M2Lib icon="search" tone="yellow" name="Extraction" use="documents" prompt="Dans ce document : [TEXTE]. Extrais [INFOS] dans un tableau. Si une info est absente, écris « non trouvé ». N’invente rien." />
      <M2Lib icon="calendar" tone="green" name="Ordre du jour" use="réunions" prompt="Prépare l’ordre du jour de [RÉUNION] ([DURÉE], [PARTICIPANTS]). Sujets : [SUJETS]. Minutage par point, objectif de chaque point." />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(400) }}>
      Copiez, adaptez, testez. Un bon modèle est court, précis, et dit quoi faire quand une information manque.
    </Hint>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_AvantApres, M2_Structure, M2_Contexte, M2_Resultat, M2_Format, M2_Iterer, M2_Modele, M2_Defauts, M2_Qcm, M2_Atelier, M2_Biblio];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 2 · 10:30

OBJECTIF — Annoncer le module central de la matinée.

DIRE — « Bon retour de pause. Module 2 : les prompts. Un prompt, c’est simplement la consigne que vous donnez à l’IA. C’est la compétence qui fait toute la différence : bien écrite, la consigne donne un résultat utilisable du premier coup ; floue, elle fait perdre du temps. On termine par la création de votre bibliothèque de prompts. »

TRANSITION — « Commençons par une démonstration. »`,
  `⏱ 4 min · AVANT / APRÈS (interrupteur)

OBJECTIF — Montrer l’effet spectaculaire d’une consigne précise.

DIRE — « Même besoin : prévenir que le comité de direction est décalé. Demande vague à gauche : “Écris un mail pour décaler la réunion.” Regardez la réponse : des crochets partout, une raison inventée, un texte passe-partout. Il faut tout réécrire. » Basculer l’interrupteur. « Maintenant la demande précise : qui je suis, ce qui se passe, la nouvelle date, le ton, la longueur, le format. Résultat : un email prêt à envoyer après relecture. »

ANIMATION — Basculer plusieurs fois pour comparer. Demander : « Qu’est-ce qui a fait la différence ? » Noter les réponses : elles annoncent la page suivante.

TRANSITION — « Ces éléments, on peut les ranger dans une structure simple. »`,
  `⏱ 6 min · STRUCTURE R-C-T-C-F (5 clics)

OBJECTIF — Donner une méthode mémorisable pour construire un prompt.

DIRE — Un clic par ingrédient. « R comme Rôle : qui l’IA doit-elle être ? Ici, une assistante de direction. C comme Contexte : que se passe-t-il ? Un client se plaint d’un retard de 10 jours. T comme Tâche : que doit-elle produire ? La réponse à la réclamation. C comme Contraintes : le ton, la longueur, et surtout ce qu’il ne faut pas faire, ici aucune promesse de remboursement. F comme Format : l’objet puis le corps, sans signature. » Dernier clic : « Pour le retenir : Rédiger Correctement Toutes Ces Formules. »

INSISTER — Tous les ingrédients ne sont pas obligatoires pour une demande simple, mais le contexte et la tâche le sont toujours.

TRANSITION — « Le contexte est l’ingrédient le plus souvent oublié. Zoom dessus. »`,
  `⏱ 4 min · DONNER UN CONTEXTE (interrupteurs)

OBJECTIF — Faire comprendre que tout ce qui n’est pas dit doit être deviné par l’IA.

DIRE — « Sans contexte, l’IA doit deviner cinq choses : qui écrit, à qui, la situation, l’historique, l’objectif. Activons-les une par une. » Activer les interrupteurs en commentant. « Chaque élément ajouté, c’est une question qu’elle n’a plus à deviner, donc une réponse plus juste. Le bon test : un intérimaire arrivé ce matin comprendrait-il ma demande ? Si non, l’IA non plus. »

ANIMATION — La jauge est illustrative. Faire activer les interrupteurs par un participant.

TRANSITION — « Deux autres ingrédients : le résultat attendu et les contraintes. »`,
  `⏱ 4 min · RÉSULTAT ATTENDU ET CONTRAINTES (2 clics)

OBJECTIF — Apprendre à préciser le livrable et à encadrer l’IA.

DIRE — Clic 1 : « Le résultat attendu : le type de document, le lecteur, la longueur, le ton. Dire “pour mon directeur qui a deux minutes” change complètement le résumé. » Clic 2 : « Les contraintes : ce qu’il faut faire, ce qu’il ne faut pas faire, les sources à respecter, et quoi faire en cas de doute. » Puis l’encadré : « La contrainte qui change tout : si une information manque, ne l’invente pas, écris À COMPLÉTER entre crochets. Vous repérez les trous d’un coup d’œil, au lieu de découvrir une date inventée après l’envoi. »

TRANSITION — « Et pour la forme de la réponse, vous avez le choix. »`,
  `⏱ 4 min · RÉPONSE STRUCTURÉE (onglets)

OBJECTIF — Montrer qu’on peut imposer la forme : tableau, puces, recommandation.

DIRE — « Trois devis de traiteur. Même contenu, trois formes. » Cliquer chaque onglet. « Le tableau, pour comparer : si vous nommez les colonnes, vous pouvez le coller directement dans Excel. Les puces, pour un message rapide. La recommandation, pour un directeur qui veut une décision. Remarquez qu’ici l’IA a raisonné : 35 participants, donc le traiteur à 40 couverts minimum est exclu. »

INSISTER — Les chiffres viennent des devis fournis : il faut toujours les recouper avec les documents d’origine.

TRANSITION — « Et si le résultat ne convient pas ? On dialogue. »`,
  `⏱ 3 min · ITÉRER (4 clics)

OBJECTIF — Installer le réflexe du dialogue plutôt que de l’abandon.

DIRE — Clic 1 : « Première version : douze lignes, beaucoup trop long pour une note sur le parking. » Clic 2 : « On ne recommence pas : on précise. Cinq lignes, et ajoute la solution. » Clic 3 : « Deuxième version : courte, utile, avec la solution. » Clic 4 : « Voici les relances qui marchent le mieux. Ma préférée : “Que manque-t-il ?” L’IA repère souvent elle-même les oublis. »

TRANSITION — « Quand un prompt marche bien, on le garde. »`,
  `⏱ 4 min · PROMPTS RÉUTILISABLES (2 clics)

OBJECTIF — Montrer comment transformer un bon prompt en modèle à crochets.

DIRE — « Voici un modèle pour répondre aux demandes de devis. Tout ce qui change d’une fois à l’autre est entre crochets : l’entreprise, le nom, le besoin, le délai. Il suffit de remplacer les crochets. » Clic 1 : « Où les ranger ? Dans un simple document, classé par usage. Selon l’outil, vous pouvez aussi enregistrer des instructions personnalisées ou créer un assistant pré-configuré. » Clic 2 : « Et partagez-les : une bibliothèque d’équipe harmonise le ton de tous les courriers. Astuce : demandez à l’IA de transformer votre meilleur échange en modèle. »

TRANSITION — « Avant de créer les vôtres, un exercice d’œil critique. »`,
  `⏱ 4 min · EXERCICE : CINQ DÉFAUTS (pastilles)

OBJECTIF — Apprendre à repérer les défauts d’une demande.

DIRE — « Voici une demande de Nadia. Elle contient cinq défauts. Trouvez-les. » Laisser chercher une minute. Cliquer chaque pastille au fur et à mesure des propositions. « Pas de contexte, des critères flous, des chiffres non fournis donc inventés, une action que l’IA ne fait pas, et surtout un fichier de salaires : donnée sensible. »

INSISTER — Le défaut numéro 5 est le plus grave : il ne produit pas un mauvais texte, il crée un risque pour l’entreprise.

TRANSITION — « Petit QCM pour vérifier. »`,
  `⏱ 3 min · QCM M2

OBJECTIF — Vérifier que la structure R-C-T-C-F est acquise.

DIRE — « Quatre propositions pour relancer un fournisseur. Laquelle donnera le meilleur résultat ? » Faire voter. Cliquer la réponse de la majorité : le retour s’affiche. Clic suivant : la bonne réponse, puis l’explication.

ANIMATION — Insister sur la réponse D : dans un assistant classique, l’IA n’envoie rien, et même quand un outil le permet, on relit avant.

TRANSITION — « À vous : construisez votre bibliothèque. »`,
  `⏱ 25 min · ATELIER 2 (minuteur)

OBJECTIF — Chaque participant repart avec au moins cinq prompts réutilisables testés.

DIRE — « En binôme, vingt-cinq minutes. Partez de vos cinq tâches de l’atelier 1, ou des modèles de la page suivante. Pour chaque prompt : les cinq ingrédients, des crochets pour ce qui change, un test avec un cas fictif, une amélioration. Donnez-lui un nom pour le retrouver. »

ANIMATION — Lancer le minuteur, afficher la page suivante pendant l’atelier. Passer dans les rangs : vérifier la présence de la contrainte À COMPLÉTER. À la fin, faire lire deux prompts et les améliorer collectivement.

TRANSITION — Afficher la page suivante comme support.`,
  `⏱ (support de l’atelier 2) · CINQ MODÈLES

OBJECTIF — Fournir des points de départ aux participants qui manquent d’idées.

DIRE — « Voici cinq modèles génériques : réponse type, reformulation, compte rendu, extraction, ordre du jour. Copiez-les, adaptez-les à votre poste et testez-les. On les réutilisera tout au long de la journée. »

ANIMATION — Laisser cette page affichée pendant l’atelier. En fin d’atelier, recueillir les meilleurs prompts du groupe pour une bibliothèque commune (à envoyer après la formation).

TRANSITION — « Votre bibliothèque est lancée. Appliquons-la à ce qui vous prend le plus de temps : les emails. Module 3. »`,
];
// @@NOTES-END
