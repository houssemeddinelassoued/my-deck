// ─── M5 · Divider ───────────────────────────────────────────────────────────
const M5_Divider: Page = () => (
  <Section n={5} title="Limites, éthique et adoption" sub="Biais, erreurs, confidentialité… et comment embarquer une équipe." dur="≈ 1 h 15">
    <SecItem n={1}>Les biais : l’IA apprend aussi nos travers</SecItem>
    <SecItem n={2}>Les erreurs, et combien vérifier</SecItem>
    <SecItem n={3}>Confidentialité et cadre légal</SecItem>
    <SecItem n={4}>Accompagner le changement dans une équipe</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── M5 · Three families of risk ────────────────────────────────────────────
const M5Risk = ({ n, icon, tone, name, q, ex }: { n: number; icon: IconName; tone: Tone; name: string; q: string; ex: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 560, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.4, color: C.soft }}>{q}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>{ex}</div>
    </div>
  </div>
);

const M5_Three: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Trois familles de risques</Title>
    <Lede>Aucune n’est une raison de renoncer. Toutes sont une raison d’encadrer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M5Risk n={1} icon="scale" tone="violet" name="Les biais" q="L’IA reproduit les déséquilibres de ses exemples." ex={<><b>Projet :</b> trier des CV, estimer des durées.</>} />
      <M5Risk n={2} icon="alert" tone="coral" name="Les erreurs" q="Elle se trompe avec aplomb, sans prévenir." ex={<><b>Projet :</b> un chiffre faux dans le rapport à la direction.</>} />
      <M5Risk n={3} icon="lock" tone="blue" name="La confidentialité" q="Ce que vous collez sort de votre organisation." ex={<><b>Projet :</b> un contrat fournisseur dans un outil gratuit.</>} />
    </div>
  </Frame>
);

// ─── M5 · Bias: how it happens (CV screening) ───────────────────────────────
const M5HBar = ({ label, pct, tone, d }: { label: string; pct: number; tone: Tone; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 54 }}>
    <span style={{ width: 120, fontSize: 25, color: C.ink }}>{label}</span>
    <div className={A.grow} style={{ width: pct * 5, height: 40, borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{pct} %</span>
  </div>
);

const M5Cv = ({ name, line, score, tone }: { name: string; line: string; score: number; tone: Tone }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '16px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name="doc" size={26} color={C.soft} />
      <b style={{ fontSize: 24 }}>{name}</b>
    </div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>10 ans d’expérience · mêmes diplômes</div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{line}</div>
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 44, color: STRONG[tone] }}>{score} / 100</div>
  </div>
);

const M5_Bias: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Le biais : l’IA apprend aussi nos travers</Title>
    <Lede>Exemple : un outil de tri de CV entraîné sur dix ans d’embauches passées.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 860, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 32px' }}>
      <Eyebrow c={C.soft} size={22}>
        1 · Les exemples : qui a été embauché ?
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <M5HBar label="Hommes" pct={80} tone="blue" d={300} />
        <M5HBar label="Femmes" pct={20} tone="violet" d={450} />
      </div>
      <div className={b.on(1)} style={{ marginTop: 22 }}>
        <Eyebrow c={C.soft} size={22}>
          2 · Ce que le modèle en déduit
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 27, lineHeight: 1.4, color: C.ink }}>« Un bon profil ressemble aux profils déjà embauchés. »</div>
      </div>
      <div className={b.on(2)} style={{ marginTop: 22 }}>
        <Eyebrow c={C.soft} size={22}>
          3 · Deux CV identiques, sauf une ligne
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', gap: 18 }}>
          <M5Cv name="CV A" line="Capitaine, club de hockey" score={82} tone="green" />
          <M5Cv name="CV B" line="Capitaine, équipe féminine de hockey" score={61} tone="coral" />
        </div>
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1040, top: 280, width: 760 }}>
      <Card tone="teal" icon="book" title="Un cas réel" size={25}>
        En 2018, Amazon a abandonné un outil expérimental de tri de CV : il pénalisait les candidatures contenant le mot « women’s » (Reuters).
      </Card>
    </div>
    <Callout cls={b.on(4)} title="Pour le recrutement de Julie" tone="violet" icon="humanCheck" size={26} style={{ position: 'absolute', left: 1040, top: 640, width: 760 }}>
      L’IA aide à rédiger l’offre et à préparer les entrevues. Le tri et le choix des candidats restent humains, sur des critères écrits.
    </Callout>
  </Frame>
);

// ─── M5 · Biases in a project ───────────────────────────────────────────────
const M5BiasCard = ({ n, icon, tone, name, children, fix }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode; fix: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 825 }}>
    <div style={{ boxSizing: 'border-box', height: 310, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={58} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.4, color: T.green.fg }}>
        <Icon name="shieldCheck" size={26} style={{ marginTop: 2 }} />
        <span>{fix}</span>
      </div>
    </div>
  </div>
);

const M5_BiasPm: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Quatre biais qui guettent vos projets</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 30, columnGap: 30 }}>
      <M5BiasCard n={1} icon="smile" tone="yellow" name="La complaisance" fix="Demandez : « Quelles sont les 5 faiblesses de ce plan ? »">
        « Mon échéancier est réaliste, non ? » « Oui, tout à fait ! » L’IA a tendance à vous donner raison.
      </M5BiasCard>
      <M5BiasCard n={2} icon="chat" tone="blue" name="La formulation" fix="Posez des questions ouvertes, sans la réponse dedans.">
        Une question orientée appelle une réponse orientée : « Pourquoi l’option B est-elle meilleure ? »
      </M5BiasCard>
      <M5BiasCard n={3} icon="globe" tone="violet" name="Le biais culturel" fix="Précisez : « au Québec », « en dollars canadiens », « selon nos congés ».">
        Exemples surtout américains : elle oublie les Fêtes, la Saint-Jean, les vacances de la construction.
      </M5BiasCard>
      <M5BiasCard n={4} icon="clock" tone="coral" name="L’optimisme moyen" fix="Comparez avec vos projets passés et ajoutez une marge.">
        Ses durées reflètent un projet « typique », pas votre fournisseur qui a toujours du retard.
      </M5BiasCard>
    </div>
  </Frame>
);

// ─── M5 · Errors: two real cases ────────────────────────────────────────────
const M5Case = ({ n, tone, icon, year, title, children, lesson }: { n: number; tone: Tone; icon: IconName; year: string; title: string; children: ReactNode; lesson: string }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={64} solid />
        <Tag tone={tone} size={22}>
          {year}
        </Tag>
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.45, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, fontWeight: 600, lineHeight: 1.4, color: T[tone].fg }}>{lesson}</div>
    </div>
  </div>
);

const M5_Errors: Page = () => (
  <Frame mod={5} kind="cas" beats={3}>
    <Title>Les erreurs : deux cas réels… et le vôtre</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'flex', gap: 30 }}>
      <M5Case n={1} tone="coral" icon="chat" year="Canada · 2024" title="Le clavardeur d’Air Canada" lesson="L’organisation répond de ce que dit son IA.">
        Il invente une politique de remboursement pour un deuil. Le tribunal de la C.-B. donne raison au client : Air Canada doit payer.
      </M5Case>
      <M5Case n={2} tone="violet" icon="scale" year="New York · 2023" title="Les jurisprudences inventées" lesson="Toute source se vérifie à la source.">
        Des avocats déposent un mémoire avec six décisions inventées par ChatGPT. Le juge les sanctionne d’une amende.
      </M5Case>
      <M5Case n={3} tone="blue" icon="chart" year="Limoilou · semaine 14" title="Le rapport de Karim" lesson="Un chiffre faux peut fausser une décision.">
        L’IA additionne mal deux lots du budget : 6 000 $ « disponibles » qui n’existent pas. Luc approuve une dépense.
      </M5Case>
    </div>
    <Callout cls={b.on(3)} title="Le point commun" tone="yellow" icon="humanCheck" size={26} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(400) }}>
      Chaque fois, l’IA a produit un texte plausible et une personne l’a utilisé sans le vérifier.
    </Callout>
  </Frame>
);

// ─── M5 · How much to check ─────────────────────────────────────────────────
const M5Level = ({ n, w, tone, stake, check }: { n: number; w: number; tone: Tone; stake: string; check: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 26, height: 128 }}>
    <div style={{ width: 520, flex: 'none' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{stake}</div>
    </div>
    <div style={{ width: 420, flex: 'none', height: 40, background: C.panel, borderRadius: 10, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: w, height: '100%', background: STRONG[tone], ...dl(200) }} />
    </div>
    <div style={{ flex: 1, fontSize: 25, lineHeight: 1.4, color: C.ink }}>{check}</div>
  </div>
);

const M5_HowMuch: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Combien vérifier ? Selon l’enjeu</Title>
    <Lede>Tout vérifier tue le gain de temps. Ne rien vérifier tue la confiance.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 36px', ...dl(100) }}>
      <M5Level n={1} w={90} tone="green" stake="Un brouillon pour soi" check="Lecture rapide : est-ce utile ?" />
      <M5Level n={2} w={200} tone="teal" stake="Partagé avec l’équipe" check="Noms, dates, responsables, faits clés." />
      <M5Level n={3} w={320} tone="yellow" stake="Envoyé à la direction, à un client" check="Chaque chiffre et chaque source, plus une relecture par un collègue." />
      <M5Level n={4} w={420} tone="coral" stake="Engage une décision, une personne, un contrat" check={<><b>L’humain décide.</b> L’IA aide à préparer, rien de plus.</>} />
    </div>
  </Frame>
);

// ─── M5 · Where your data goes ──────────────────────────────────────────────
const M5Row = ({ d, label, pub, ent }: { d: number; label: string; pub: ReactNode; ent: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', minHeight: 92, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ width: 400, flex: 'none', fontWeight: 600, fontSize: 25, color: C.ink }}>{label}</span>
    <span style={{ flex: 1, fontSize: 24, lineHeight: 1.35, color: T.coral.fg, paddingRight: 20 }}>{pub}</span>
    <span style={{ flex: 1, fontSize: 24, lineHeight: 1.35, color: T.green.fg }}>{ent}</span>
  </div>
);

const M5_Data: Page = () => (
  <Frame mod={5}>
    <Title>Où vont vos données ?</Title>
    <Lede>Même outil, deux versions, deux niveaux de protection. Vérifiez toujours les réglages réels.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '10px 36px 6px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 70 }}>
        <span style={{ width: 400, flex: 'none' }} />
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>
          <Icon name="user" size={30} color={C.coral} /> Version grand public
        </span>
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>
          <Icon name="shieldCheck" size={30} color={C.green} /> Version entreprise approuvée
        </span>
      </div>
      <M5Row d={200} label="Vos échanges entraînent le modèle ?" pub="Possible selon les réglages du compte" ent="Non, selon le contrat de l’organisation" />
      <M5Row d={300} label="Qui contrôle les comptes ?" pub="Vous seul, avec votre adresse" ent="Les TI : accès, départs, journaux" />
      <M5Row d={400} label="Durée de conservation" pub="Selon les réglages du service" ent="Selon la politique de l’organisation" />
      <M5Row d={500} label="Lieu d’hébergement" pub="Pas toujours au Canada" ent="Parfois au choix : Canada, Europe…" />
    </div>
    <Callout cls={A.in} title="Un cas réel · Samsung, 2023" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(700) }}>
      Des ingénieurs collent du code confidentiel dans ChatGPT. L’entreprise interdit ensuite temporairement l’IA générative.
    </Callout>
  </Frame>
);

// ─── M5 · Exercise: traffic light for data ──────────────────────────────────
const M5_Traffic: Page = () => (
  <Frame mod={5} kind="exercice" beats={1}>
    <Title>À vous : feu vert, jaune ou rouge ?</Title>
    <Lede>Pour chaque information, votez : vert, jaune ou rouge. Le corrigé apparaît au clic.</Lede>
    <M1Zone x={120} icon="check" tone="green" label="Vert · tout outil" />
    <M1Zone x={690} icon="shieldCheck" tone="yellow" label="Jaune · outil approuvé" />
    <M1Zone x={1260} icon="lock" tone="coral" label="Rouge · jamais tel quel" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Le texte de l’affiche des portes ouvertes <M1Key tone="green">VERT</M1Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Les CV des candidats mécaniciens <M1Key tone="coral">ROUGE</M1Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Le budget détaillé du projet <M1Key tone="yellow">JAUNE</M1Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      Une procédure générique d’ouverture de caisse <M1Key tone="green">VERT</M1Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Le salaire offert à la future gérante <M1Key tone="coral">ROUGE</M1Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Le contrat du fournisseur de comptoirs <M1Key tone="yellow">JAUNE</M1Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      L’arrêt maladie d’un employé <M1Key tone="coral">ROUGE</M1Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Le compte rendu de la réunion de suivi <M1Key tone="yellow">JAUNE</M1Key>
    </Drag>
  </Frame>
);

// ─── M5 · Anonymize (interactive toggle) ────────────────────────────────────
const M5Mask = ({ on, real, fake }: { on: boolean; real: string; fake: string }) => (
  <span
    style={{
      background: on ? T.green.bg : T.coral.bg,
      color: on ? T.green.fg : T.coral.fg,
      fontWeight: 600,
      borderRadius: 6,
      padding: '0 6px',
      transition: `background 400ms ${EASE}, color 400ms ${EASE}`,
    }}
  >
    {on ? fake : real}
  </span>
);

const M5Tip = ({ d, icon, children }: { d: number; icon: IconName; children: ReactNode }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone="green" size={52} />
    <span style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M5_Anon: Page = () => {
  const [on, setOn] = useState(false);
  return (
    <Frame mod={5} kind="exercice">
      <Title>Anonymiser avant de demander</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 204, ...dl(100) }}>
        <Toggle on={on} onChange={setOn} label={on ? 'Version anonymisée' : 'Version d’origine'} tone="green" size={28} />
      </div>
      <PromptBox cls={A.in} size={30} style={{ position: 'absolute', left: 120, top: 290, width: 1000, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${on ? C.green : C.coral}`, ...dl(200) }}>
        Rédige une réponse ferme mais polie à <M5Mask on={on} real="Sylvie Bouchard" fake="[RESPONSABLE]" />, de <M5Mask on={on} real="Comptoirs Rive-Sud inc." fake="[FOURNISSEUR]" /> (<M5Mask on={on} real="418 555-0142" fake="[TÉL.]" />). Contrat <M5Mask on={on} real="no 2024-117 de 38 450 $" fake="[CONTRAT]" /> : livraison en retard de deux semaines. Nous appliquons la pénalité <M5Mask on={on} real="de 1 500 $ prévue à l’article 9" fake="prévue au contrat" />.
      </PromptBox>
      <div style={{ position: 'absolute', left: 120, top: 700, width: 1000, display: 'flex', alignItems: 'center', gap: 14, fontSize: 27, fontWeight: 600, color: on ? T.green.fg : T.coral.fg }}>
        <Icon name={on ? 'check' : 'alert'} size={32} />
        {on ? 'La réponse sera aussi bonne. On remet les vrais noms dans le courriel final.' : 'Cinq informations identifiantes ou confidentielles.'}
      </div>
      <div style={{ position: 'absolute', left: 1180, top: 290, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M5Tip d={300} icon="user">
          Remplacer les noms par des rôles
        </M5Tip>
        <M5Tip d={400} icon="x">
          Retirer coordonnées et numéros
        </M5Tip>
        <M5Tip d={500} icon="money">
          Masquer ou arrondir les montants
        </M5Tip>
        <M5Tip d={600} icon="send">
          Remettre les vrais éléments à la fin, hors de l’IA
        </M5Tip>
      </div>
      <Callout cls={A.in} title="Limite" tone="yellow" icon="alert" size={24} style={{ position: 'absolute', left: 120, top: 800, width: 1680, padding: '14px 26px', ...dl(700) }}>
        Anonymiser réduit le risque sans le supprimer : un contexte très précis suffit parfois à reconnaître quelqu’un.
      </Callout>
    </Frame>
  );
};

// ─── M5 · The legal frame ───────────────────────────────────────────────────
const M5_Law: Page = () => (
  <Frame mod={5}>
    <Title>Le cadre : ce qui s’applique déjà</Title>
    <Lede>Pas besoin d’être juriste. Quatre repères suffisent pour un chargé de projet.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 30, columnGap: 30 }}>
      <Card tone="blue" icon="shield" title="Loi 25 (Québec)" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(100) }}>
        Protection des renseignements personnels : évaluation des facteurs relatifs à la vie privée (EFVP) pour un nouveau système, et information de la personne si une décision repose uniquement sur un traitement automatisé.
      </Card>
      <Card tone="green" icon="book" title="La politique de votre organisation" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(220) }}>
        Outils autorisés, usages interdits, personne à consulter. Votre premier document à lire en rentrant : il prime sur vos habitudes.
      </Card>
      <Card tone="yellow" icon="key" title="Vos contrats" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(340) }}>
        Les ententes de confidentialité avec vos clients et fournisseurs s’appliquent aussi à ce que vous collez dans une IA.
      </Card>
      <Card tone="violet" icon="globe" title="Si vous travaillez avec l’Europe" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(460) }}>
        Le règlement européen sur l’IA (AI Act), en vigueur depuis 2024, impose des obligations progressives, plus fortes pour les usages à haut risque comme le recrutement.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 930, fontSize: 22, color: C.muted, ...dl(700) }}>
      Au fédéral, le projet de loi C-27 (qui incluait une loi sur l’IA) est mort au feuilleton en janvier 2025. Vérifiez l’état actuel.
    </div>
  </Frame>
);

// ─── M5 · Self-check: my reflexes ───────────────────────────────────────────
const M5_Reflexes: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Vos huit réflexes : où en êtes-vous ?</Title>
    <Lede>Comptez pour vous ceux que vous faites déjà. Honnêtement : personne ne verra votre score.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ width: 1100, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="m5-tool">J’utilise uniquement les outils approuvés par mon organisation</CheckItem>
          <CheckItem id="m5-data">Je ne colle jamais de renseignements personnels ou confidentiels</CheckItem>
          <CheckItem id="m5-ctx">Je donne le contexte et le format attendus</CheckItem>
          <CheckItem id="m5-check">Je vérifie chiffres, dates, noms et sources avant de diffuser</CheckItem>
          <CheckItem id="m5-ask">Je demande à l’IA ce qu’elle a supposé ou deviné</CheckItem>
          <CheckItem id="m5-say">Je signale quand un document a été préparé avec l’IA</CheckItem>
          <CheckItem id="m5-dec">Je garde la décision : l’IA propose, je tranche</CheckItem>
          <CheckItem id="m5-share">Je partage mes bonnes demandes avec l’équipe</CheckItem>
        </div>
        <CheckScore
          max={8}
          label="Mon niveau de maîtrise"
          style={{ width: 540, alignSelf: 'flex-start' }}
          levels={[
            { min: 0, text: 'Des réflexes à construire : commencez par les deux premiers', tone: 'coral' },
            { min: 4, text: 'Bonne base : visez la vérification systématique', tone: 'yellow' },
            { min: 7, text: 'Usage maîtrisé : devenez la personne-ressource', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── M5 · Change: four reactions (flip cards) ───────────────────────────────
const M5Persona = ({ id, quote, children }: { id: CastId; quote: string; children: ReactNode }) => (
  <FlipCard
    w={825}
    h={300}
    tone={CAST[id].tone}
    backTone="green"
    front={
      <div>
        <Who id={id} size={26} />
        <div style={{ marginTop: 18, fontFamily: display, fontWeight: 600, fontSize: 34, lineHeight: 1.2, color: C.ink }}>{quote}</div>
      </div>
    }
    back={
      <div>
        <Eyebrow c={T.green.fg} size={22}>
          La réponse de Karim
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.45, color: C.ink }}>{children}</div>
      </div>
    }
  />
);

const M5_Personas: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Accompagner l’équipe : quatre réactions, quatre réponses</Title>
    <Lede>Que répondriez-vous ? Vos idées d’abord, puis on retourne la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 30, columnGap: 30, ...dl(150) }}>
      <M5Persona id="julie" quote="« L’IA va trier mes candidats à ma place ? »">
        Non. Elle t’aide à rédiger les offres et à préparer les entrevues. Le choix reste le tien, sur des critères écrits.
      </M5Persona>
      <M5Persona id="annie" quote="« J’ai déjà tout mis dans ChatGPT, c’est génial ! »">
        Super, deviens notre personne-ressource ! Mais sur l’outil approuvé, et seulement avec des données « vertes ».
      </M5Persona>
      <M5Persona id="maxime" quote="« C’est du texte générique, ça ne vaut rien. »">
        Essayons sur tes variantes de publications. Tu gardes le dernier mot sur le ton : c’est ton métier.
      </M5Persona>
      <M5Persona id="luc" quote="« D’accord, mais qu’est-ce que ça rapporte ? »">
        On mesure pendant 4 semaines le temps gagné sur les comptes rendus et le rapport hebdo, et je te montre les chiffres.
      </M5Persona>
    </div>
  </Frame>
);

// ─── M5 · Adoption curve ────────────────────────────────────────────────────
const m5Curve = (xa: number, xb: number, close = true) => {
  let d = close ? `M${xa} 470` : '';
  for (let x = xa; x <= xb; x += 10) {
    const y = 470 - 400 * Math.exp(-((x - 840) ** 2) / (2 * 260 * 260));
    d += `${d ? ' L' : 'M'}${x} ${y.toFixed(1)}`;
  }
  return close ? `${d} L${xb} 470 Z` : d;
};

const M5Seg = ({ n, x, w, tone, name, pct, who }: { n: number; x: number; w: number; tone: Tone; name: string; pct: string; who?: CastId }) => (
  <>
    <div className={b.on(n)} style={{ position: 'absolute', left: 120 + x, top: 730, width: w, textAlign: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 27, lineHeight: 1.1, color: T[tone].fg }}>{name}</div>
      <div style={{ fontSize: 22, color: C.soft }}>{pct}</div>
    </div>
    {who ? (
      <div className={b.pop(n)} style={{ position: 'absolute', left: 120 + x, top: 840, width: w, display: 'flex', justifyContent: 'center', ...dl(300) }}>
        <Tag tone={CAST[who].tone} size={22}>
          {CAST[who].name}
        </Tag>
      </div>
    ) : null}
  </>
);

const M5_Curve: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Dans toute équipe, cinq profils face à la nouveauté</Title>
    <Lede>La courbe d’adoption de Rogers. Commencez par les volontaires : leurs résultats convaincront la majorité.</Lede>
    <svg width={1680} height={480} viewBox="0 0 1680 480" style={{ position: 'absolute', left: 120, top: 250 }}>
      <path d={m5Curve(0, 320)} fill={T.violet.bg} stroke={C.violet} strokeWidth={2} className={b.fade(1)} />
      <path d={m5Curve(320, 580)} fill={T.blue.bg} stroke={C.blue} strokeWidth={2} className={b.fade(2)} />
      <path d={m5Curve(580, 840)} fill={T.teal.bg} stroke={C.teal} strokeWidth={2} className={b.fade(3)} />
      <path d={m5Curve(840, 1100)} fill={T.yellow.bg} stroke={C.amber} strokeWidth={2} className={b.fade(4)} />
      <path d={m5Curve(1100, 1680)} fill={T.grey.bg} stroke={C.faint} strokeWidth={2} className={b.fade(5)} />
      <path d={m5Curve(0, 1680, false)} fill="none" stroke={C.ink} strokeWidth={4} pathLength={1} className={A.draw} />
      <line x1={0} y1={470} x2={1680} y2={470} stroke={C.faint} strokeWidth={3} />
    </svg>
    <M5Seg n={1} x={0} w={320} tone="violet" name="Innovateurs" pct="2,5 %" who="annie" />
    <M5Seg n={2} x={320} w={260} tone="blue" name="Adopteurs précoces" pct="13,5 %" who="karim" />
    <M5Seg n={3} x={580} w={260} tone="teal" name="Majorité précoce" pct="34 %" who="julie" />
    <M5Seg n={4} x={840} w={260} tone="yellow" name="Majorité tardive" pct="34 %" who="maxime" />
    <M5Seg n={5} x={1100} w={580} tone="grey" name="Retardataires" pct="16 %" />
  </Frame>
);

// ─── M5 · 90-day adoption plan ──────────────────────────────────────────────
const M5Phase = ({ n, tone, days, verb, children }: { n: number; tone: Tone; days: string; verb: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px' }}>
      <Tag tone={tone} size={22}>
        {days}
      </Tag>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 52, color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  </div>
);

const M5_Plan: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Un plan d’adoption sur 90 jours</Title>
    <Lede>Petit, mesuré, partagé. C’est ce que Karim propose à Luc pour l’équipe Limoilou.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 30 }}>
      <M5Phase n={1} tone="blue" days="Jours 1 à 30" verb="Essayer">
        <Bullet size={26}>Deux cas pilotes : comptes rendus et rapport hebdo</Bullet>
        <Bullet size={26}>Une charte d’usage d’une page</Bullet>
        <Bullet size={26}>Annie, personne-ressource</Bullet>
      </M5Phase>
      <M5Phase n={2} tone="teal" days="Jours 31 à 60" verb="Mesurer">
        <Bullet size={26} tone="teal">Temps gagné par semaine</Bullet>
        <Bullet size={26} tone="teal">Erreurs repérées à la relecture</Bullet>
        <Bullet size={26} tone="teal">Satisfaction de l’équipe</Bullet>
      </M5Phase>
      <M5Phase n={3} tone="green" days="Jours 61 à 90" verb="Étendre">
        <Bullet size={26} tone="green">Bibliothèque de demandes partagée</Bullet>
        <Bullet size={26} tone="green">Trois nouveaux cas d’usage</Bullet>
        <Bullet size={26} tone="green">Charte révisée avec l’équipe</Bullet>
      </M5Phase>
    </div>
    <Callout cls={b.on(3)} title="Pour convaincre Luc" tone="yellow" icon="chart" size={26} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(400) }}>
      Des chiffres mesurés sur deux usages valent mieux que dix promesses : temps gagné, erreurs évitées.
    </Callout>
  </Frame>
);

// ─── M5 · Team charter ──────────────────────────────────────────────────────
const M5Rule = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} size={40} />
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M5_Charter: Page = () => (
  <Frame mod={5}>
    <Title>La charte d’usage de l’équipe Limoilou</Title>
    <Lede>Une page, huit règles, décidées ensemble. Un modèle à adapter pour votre équipe.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${C.blue}`, padding: '32px 44px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name="shieldCheck" tone="blue" size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>Charte d’usage de l’IA · Projet Limoilou</span>
        <Tag tone="grey" size={20} style={{ marginLeft: 'auto' }}>
          Version 1 · revue toutes les 4 semaines
        </Tag>
      </div>
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 50, rowGap: 22 }}>
        <M5Rule n={1}>Outils : Copilot (licence de l’entreprise) et ClickUp. Rien d’autre sans l’accord d’Annie.</M5Rule>
        <M5Rule n={2}>Jamais de CV, salaires, données de santé ni contrats dans un outil non approuvé.</M5Rule>
        <M5Rule n={3}>Tout document généré est relu par son auteur avant diffusion.</M5Rule>
        <M5Rule n={4}>Mention « préparé avec l’IA » sur ce qui sort de l’équipe.</M5Rule>
        <M5Rule n={5}>Budget, embauches et dates : les décisions restent humaines.</M5Rule>
        <M5Rule n={6}>Transcription annoncée en début de réunion, jamais pour un sujet RH.</M5Rule>
        <M5Rule n={7}>Les bonnes demandes vont dans la bibliothèque partagée.</M5Rule>
        <M5Rule n={8}>Un doute ? On demande avant de coller.</M5Rule>
      </div>
    </div>
  </Frame>
);

// ─── M5 · QCMs & synthesis ──────────────────────────────────────────────────
const M5_Qcm1: Page = () => (
  <QcmPage
    mod={5}
    n={6}
    title="Les CV"
    q="Pour aller vite, Annie colle les 12 CV reçus dans un ChatGPT gratuit et demande un classement. Quel est le problème principal ?"
    explain="Deux problèmes : des renseignements personnels dans un outil non approuvé (Loi 25), et un tri automatisé exposé aux biais. L’IA peut aider à préparer les critères ou les questions d’entrevue, pas à classer des personnes."
  >
    <Opt why="Piège ! La longueur n’est pas le sujet : l’outil les lirait sans difficulté.">Les CV sont trop longs pour l’outil</Opt>
    <Opt ok why="Oui : des renseignements personnels sortent de l’organisation, et le classement risque de reproduire des biais.">
      Des données personnelles dans un outil non approuvé, et un tri exposé aux biais
    </Opt>
    <Opt why="Piège ! La plupart des assistants lisent les PDF. Le problème n’est pas technique.">ChatGPT ne sait pas lire les CV en PDF</Opt>
    <Opt why="Piège ! Vérifier le classement ne règle ni la fuite de données ni le biais du tri.">Aucun, si elle vérifie le classement ensuite</Opt>
  </QcmPage>
);

const M5_Qcm2: Page = () => (
  <QcmPage
    mod={5}
    n={7}
    title="La complaisance"
    q="Karim demande : « Mon échéancier est réaliste, n’est-ce pas ? » L’IA répond : « Oui, tout à fait ! » Que doit-il en retenir ?"
    explain="Une question qui contient la réponse attendue appelle une réponse complaisante. Pour un vrai regard critique, on demande explicitement les faiblesses, les risques ou un avis contradictoire."
  >
    <Opt why="Piège ! La question orientait la réponse : ce « oui » ne vaut pas une validation.">Que son échéancier est validé</Opt>
    <Opt ok why="Oui : « Joue l’avocat du diable : quelles sont les 5 faiblesses de cet échéancier ? » donne une réponse bien plus utile.">
      Que la question était orientée : il faut demander les faiblesses
    </Opt>
    <Opt why="Piège ! Une autre IA, avec la même question orientée, risque la même complaisance.">Qu’il faut poser la même question à une autre IA</Opt>
    <Opt why="Piège ! Elle peut très bien repérer des faiblesses… si on le lui demande.">Que l’IA ne sait pas évaluer un échéancier</Opt>
  </QcmPage>
);

const M5_Synth: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={
      <>
        Lisez la politique d’usage de l’IA de votre organisation, ou demandez-la.
        <br />
        <br />
        Proposez à votre équipe une charte d’une page, en partant du modèle Limoilou.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Biais : l’IA reproduit ses exemples, et vous <b>donne raison</b> trop vite.
    </SynthRow>
    <SynthRow n={2} tone="coral" d={220}>
      Erreurs : on vérifie <b>selon l’enjeu</b> ; les décisions restent humaines.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Données : <b>outil approuvé</b>, et on anonymise au moindre doute.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Changement : partir des <b>volontaires</b>, mesurer, partager.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      Une <b>charte d’équipe</b> d’une page vaut mieux qu’un long règlement.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M5_Divider,
  M5_Three,
  M5_Bias,
  M5_BiasPm,
  M5_Errors,
  M5_HowMuch,
  M5_Data,
  M5_Traffic,
  M5_Anon,
  M5_Law,
  M5_Reflexes,
  M5_Personas,
  M5_Curve,
  M5_Plan,
  M5_Charter,
  M5_Qcm1,
  M5_Qcm2,
  M5_Synth,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 5 (≈ 10 h 45)

OBJECTIF — Annoncer un module lucide, sans tomber dans la peur.

DIRE — « Module 5 : limites, éthique et adoption. Depuis hier, on a vu tout ce que l'IA sait faire. Maintenant, ce qui peut mal tourner, et comment l'éviter. Puis une question que tout chargé de projet se pose : comment embarquer une équipe qui n'est pas convaincue ? »

« Quatre temps : les biais ; les erreurs et combien vérifier ; la confidentialité et le cadre légal ; l'accompagnement du changement. »

TRANSITION — « Trois familles de risques. »`,
  `⏱ 2 min · TROIS FAMILLES (3 clics)

DIRE — « Aucune n'est une raison de renoncer. Toutes sont une raison d'encadrer. »
→ beat 1 : « Les biais : l'IA reproduit les déséquilibres de ses exemples. Dans un projet : trier des CV, estimer des durées. »
→ beat 2 : « Les erreurs : elle se trompe avec aplomb. Un chiffre faux dans le rapport à la direction. »
→ beat 3 : « La confidentialité : ce que vous collez sort de votre organisation. Un contrat fournisseur dans un outil gratuit. »

TRANSITION — « Commençons par les biais, avec un exemple très concret. »`,
  `⏱ 5 min · LE BIAIS (4 clics)

OBJECTIF — Faire comprendre mécaniquement d'où vient un biais.

DIRE — « Imaginons un outil de tri de CV, entraîné sur dix ans d'embauches passées. Dans ce poste, 80 % des personnes embauchées étaient des hommes. »
→ beat 1 : « Le modèle n'a aucune intention. Il en déduit simplement qu'un bon profil ressemble aux profils déjà embauchés. »
→ beat 2 : « Deux CV identiques, sauf une ligne : "capitaine de l'équipe féminine de hockey". 82 contre 61. Le mot "féminine" est devenu un signal négatif. »
→ beat 3 : « Ce n'est pas de la fiction : en 2018, Reuters a révélé qu'Amazon avait abandonné un outil expérimental de tri de CV qui pénalisait les candidatures contenant le mot "women's". »
→ beat 4 : « Pour le recrutement de Julie : l'IA aide à rédiger l'offre et à préparer les entrevues. Le tri et le choix restent humains, sur des critères écrits à l'avance. »

PRÉCISION — Les scores 82 / 61 sont illustratifs.

TRANSITION — « Dans vos projets, les biais sont souvent plus discrets. »`,
  `⏱ 4 min · QUATRE BIAIS EN PROJET (4 clics)

DIRE —
→ beat 1 : « La complaisance : "Mon échéancier est réaliste, non ?" "Oui, tout à fait !" Les assistants ont tendance à vous donner raison. Parade : demandez les cinq faiblesses. »
→ beat 2 : « La formulation : une question orientée appelle une réponse orientée. Posez des questions ouvertes. »
→ beat 3 : « Le biais culturel : les exemples sont surtout américains. L'IA oublie les Fêtes, la Saint-Jean, les vacances de la construction. Précisez "au Québec", "en dollars canadiens". »
→ beat 4 : « L'optimisme moyen : ses durées reflètent un projet typique, pas votre fournisseur qui a toujours du retard. Comparez avec vos projets passés. »

INTERACTION — « Avez-vous déjà vu l'IA vous donner raison trop vite ? »

TRANSITION — « Deuxième famille : les erreurs, avec des cas réels. »`,
  `⏱ 5 min · ÉTUDES DE CAS : ERREURS (3 clics)

DIRE —
→ beat 1 : « Février 2024 : le clavardeur d'Air Canada invente une politique de remboursement pour les voyages liés à un deuil. Le Tribunal de résolution civile de la Colombie-Britannique (affaire Moffatt) donne raison au client : Air Canada est responsable de ce que dit son agent conversationnel. Leçon : l'organisation répond de son IA. »
→ beat 2 : « 2023, New York (affaire Mata c. Avianca) : des avocats déposent un mémoire avec six décisions de justice inventées par ChatGPT. Le juge les sanctionne d'une amende de 5 000 $ US. Leçon : toute source se vérifie à la source. »
→ beat 3 : « Et le vôtre : dans le rapport de la semaine 14, l'IA additionne mal deux lots du budget. 6 000 $ "disponibles" qui n'existent pas. Luc approuve une dépense. Personne n'a menti ; personne n'a vérifié. »

TRANSITION — « Alors, faut-il tout vérifier ? Non : selon l'enjeu. »`,
  `⏱ 3 min · COMBIEN VÉRIFIER (4 clics)

DIRE — « Tout vérifier tue le gain de temps. Ne rien vérifier tue la confiance. La règle : vérifier selon l'enjeu. »
→ beat 1 : « Un brouillon pour soi : lecture rapide. »
→ beat 2 : « Partagé avec l'équipe : noms, dates, responsables, faits clés. »
→ beat 3 : « Envoyé à la direction ou à un client : chaque chiffre, chaque source, et un collègue relit. »
→ beat 4 : « Ce qui engage une décision, une personne, un contrat : l'humain décide. L'IA aide à préparer. »

ASTUCE — Pour les calculs, demandez à l'IA de montrer le détail du calcul, ou faites-les dans Excel.

TRANSITION — « Troisième famille : vos données. »`,
  `⏱ 4 min · OÙ VONT VOS DONNÉES

DIRE — « Même outil, deux versions. À gauche la version grand public : selon les réglages, vos échanges peuvent servir à améliorer les modèles ; vous seul contrôlez le compte ; conservation et hébergement selon le service, pas toujours au Canada. À droite la version entreprise approuvée : en général pas d'entraînement sur vos données selon le contrat, comptes gérés par les TI, politique de conservation de l'organisation. »

CAS RÉEL — « Samsung, 2023 : des ingénieurs collent du code confidentiel dans ChatGPT pour le corriger. L'entreprise interdit ensuite temporairement les outils d'IA générative. »

RÈGLE SIMPLE — « Ce que vous ne mettriez pas sur un forum public ne va pas dans un outil non approuvé. »

À VÉRIFIER — Les politiques des fournisseurs changent : présentez-les comme des tendances, et renvoyez aux conditions réelles de l'outil utilisé.

TRANSITION — « Exercice : quelles données, dans quel outil ? »`,
  `⏱ 5 min · EXERCICE FEU TRICOLORE (1 clic pour le corrigé)

ANIMATION — Pour chaque étiquette, demandez la couleur à voix haute (« vert », « jaune » ou « rouge ») et glissez-la selon la majorité. Double-clic pour remettre une étiquette à sa place. → révèle le corrigé.

CORRIGÉ —
• Vert (tout outil) : texte de l'affiche (public), procédure générique.
• Jaune (outil approuvé seulement) : budget détaillé, contrat fournisseur (aussi soumis à la confidentialité contractuelle), compte rendu de réunion.
• Rouge (jamais tel quel) : CV, salaire, arrêt maladie. Renseignements personnels, voire sensibles.

DÉBAT ATTENDU — « Le compte rendu » : vert pour certains. Il contient souvent des noms, des retards, des tensions : jaune par prudence.

TRANSITION — « Et si on a besoin d'aide sur un document rouge ou jaune ? On anonymise. »`,
  `⏱ 3 min · ANONYMISER (interrupteur)

ANIMATION — Commencez sur « Version d'origine » : cinq éléments en rouge. Cliquez l'interrupteur : ils sont remplacés par des étiquettes.

DIRE — « La réponse de l'IA sera tout aussi bonne : elle n'a besoin ni du nom de Sylvie, ni du numéro de contrat pour rédiger un courriel ferme et poli. On remet les vrais éléments à la fin, dans Outlook, hors de l'IA. »

Les quatre gestes : noms → rôles ; retirer coordonnées et numéros ; masquer les montants ; remettre les vrais éléments à la fin.

LIMITE — « Anonymiser réduit le risque, sans le supprimer : "la gérante de la boutique de Limoilou" suffit à reconnaître une personne. »

TRANSITION — « Le cadre légal en quatre repères. »`,
  `⏱ 4 min · CADRE LÉGAL

DIRE —
• « Loi 25, au Québec : protection des renseignements personnels. Pour un nouveau système qui traite des renseignements personnels, une évaluation des facteurs relatifs à la vie privée, l'EFVP. Et si une décision concernant une personne repose uniquement sur un traitement automatisé, il faut l'en informer. »
• « La politique de votre organisation : votre premier document à lire en rentrant. »
• « Vos contrats : une entente de confidentialité avec un client s'applique aussi à ce que vous collez dans une IA. »
• « Si vous travaillez avec l'Europe : le règlement européen sur l'IA, l'AI Act, en vigueur depuis 2024, avec des obligations progressives, plus fortes pour les usages à haut risque, dont le recrutement. »

PRÉCISION — Au fédéral, le projet de loi C-27, qui incluait la Loi sur l'intelligence artificielle et les données, est mort au feuilleton lors de la prorogation de janvier 2025. VÉRIFIEZ l'état de la législation avant chaque session.

PRUDENCE — Vous n'êtes pas juriste : pour un cas précis, renvoyez au responsable de la protection des renseignements personnels de l'organisation.

TRANSITION — « Faisons le point sur vos propres réflexes. »`,
  `⏱ 3 min · AUTODIAGNOSTIC (cases à cocher)

ANIMATION — Chacun compte pour soi, sur papier ou dans un document, les réflexes qu'il pratique déjà ; ne demandez pas les scores. Cochez la grille à l'écran pour illustrer, puis demandez le réflexe qui manque le plus.

DIRE — « Huit réflexes. Personne ne voit votre écran : soyez honnêtes. »

LECTURE —
• 0 à 3 : commencez par les deux premiers, outils approuvés et données.
• 4 à 6 : bonne base ; la vérification systématique est le prochain pas.
• 7 ou 8 : devenez la personne-ressource de votre équipe.

QUESTION — « Quel réflexe vous manque le plus souvent ? » Généralement : « Je signale quand un document a été préparé avec l'IA. » Discutez-en : transparence n'est pas aveu de faiblesse.

TRANSITION — « Passons à l'équipe : comment accompagner le changement ? »`,
  `⏱ 6 min · QUATRE RÉACTIONS (cartes à retourner)

OBJECTIF — Travailler des réponses concrètes aux réactions typiques.

ANIMATION — Pour chaque carte : lisez la phrase, demandez « Que répondriez-vous ? », écoutez deux réponses, puis retournez la carte.

DIRE —
• Julie, l'inquiète : la peur d'être remplacée ou de perdre le contrôle. Réponse : clarifier ce que l'IA fait et ne fait pas.
• Annie, l'enthousiaste : un atout, à canaliser. En faire la personne-ressource, dans le cadre.
• Maxime, le sceptique : le convaincre par un cas où il gagne du temps, et respecter son expertise.
• Luc, le commanditaire : il veut des résultats. Mesurer et montrer.

MESSAGE CLÉ — « On n'accompagne pas une équipe avec un outil : on l'accompagne avec des réponses à ses craintes. »

TRANSITION — « Ces quatre profils ont un nom : la courbe d'adoption. »`,
  `⏱ 3 min · COURBE D'ADOPTION (5 clics)

DIRE — « Everett Rogers a décrit comment une innovation se diffuse. »
→ beat 1 : « Les innovateurs, 2,5 % : Annie. Ils essaient tout. »
→ beat 2 : « Les adopteurs précoces, 13,5 % : Karim. Ils essaient quand ils voient l'utilité, et les autres les écoutent. »
→ beat 3 : « La majorité précoce, 34 % : Julie. Ils suivent quand ça a fait ses preuves. »
→ beat 4 : « La majorité tardive, 34 % : Maxime. Ils suivent quand c'est devenu la norme. »
→ beat 5 : « Les retardataires, 16 %. Ne forcez pas : rassurez, et laissez les résultats parler. »

MESSAGE CLÉ — « Commencez par les volontaires. Leurs résultats convaincront la majorité. Imposer l'IA à tout le monde le même jour, c'est se mettre la majorité à dos. »

TRANSITION — « Concrètement, un plan sur 90 jours. »`,
  `⏱ 3 min · PLAN SUR 90 JOURS (3 clics)

DIRE —
→ beat 1 : « Jours 1 à 30 : essayer. Deux cas pilotes seulement, les comptes rendus et le rapport hebdo. Une charte d'une page. Annie comme personne-ressource. »
→ beat 2 : « Jours 31 à 60 : mesurer. Temps gagné, erreurs repérées à la relecture, satisfaction de l'équipe. C'est ce que Luc attend. »
→ beat 3 : « Jours 61 à 90 : étendre. Bibliothèque partagée, trois nouveaux cas, charte révisée avec l'équipe. »

INSISTER — Petit, mesuré, partagé. Mieux vaut deux usages bien installés que dix essais abandonnés.

TRANSITION — « Voici la charte de l'équipe Limoilou. »`,
  `⏱ 3 min · CHARTE D'USAGE

DIRE — « Une page, huit règles, décidées ensemble. » Lisez les huit règles en soulignant :
• la règle 1 : des outils nommés, et une personne qui autorise ;
• la règle 2 : le feu rouge de tout à l'heure ;
• la règle 5 : les décisions restent humaines ;
• la règle 8 : « Un doute ? On demande avant de coller. » La plus simple, la plus utile.

ATELIER 2 — « Cet après-midi, votre mini-projet inclura une charte de ce type. Gardez ce modèle. »

TRANSITION — « Deux QCM pour terminer. »`,
  `⏱ 3 min · QCM 6

RÉPONSE — B.
• A ✗ PIÈGE — La longueur n'est pas le problème.
• C ✗ PIÈGE — Les assistants lisent les PDF.
• D ✗ PIÈGE — Vérifier le classement ne règle ni la fuite de données ni le biais.

POUR ALLER PLUS LOIN — « Que peut faire Annie à la place ? » Aider Julie à écrire une grille de critères, préparer des questions d'entrevue, rédiger les réponses aux candidats.

TRANSITION — « Dernière question, sur la complaisance. »`,
  `⏱ 2 min · QCM 7

RÉPONSE — B : la question était orientée.

DÉMO OPTIONNELLE — Posez en direct les deux questions à un assistant : « Mon échéancier est réaliste, n'est-ce pas ? » puis « Joue l'avocat du diable : quelles sont les 5 faiblesses de cet échéancier ? ». Comparez.

TRANSITION — « Faisons le bilan du module 5. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 5

DIRE — Relisez les cinq points :
1. Biais : l'IA reproduit ses exemples et vous donne raison trop vite.
2. Erreurs : on vérifie selon l'enjeu, les décisions restent humaines.
3. Données : outil approuvé, et on anonymise au moindre doute.
4. Changement : partir des volontaires, mesurer, partager.
5. Une charte d'équipe d'une page.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « Bon dîner ! Cet après-midi : votre mini-projet avec l'IA, de la planification à la présentation. »`,
];
// @@NOTES-END
