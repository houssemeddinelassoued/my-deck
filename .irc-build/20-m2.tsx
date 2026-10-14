// ─── Module 2 · Comprendre et analyser une demande client ──────────────────

// Marker sweep: the highlight paints itself across the words on beat `n`.
for (let n = 1; n <= 8; n++) {
  CSS.push(`
.${P}-mk${n}{background-size:0% 100%;background-repeat:no-repeat;transition:background-size 700ms ${EASE}}
${at(n)} .${P}-mk${n}{background-size:100% 100%}
`);
}
const Mk = ({ n, tone = 'blue', children }: { n: number; tone?: Tone; children: ReactNode }) => (
  <span
    className={k(`mk${n}`)}
    style={{ backgroundImage: `linear-gradient(${T[tone].bd}, ${T[tone].bd})`, borderRadius: 4, padding: '0 3px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
  >
    {children}
  </span>
);

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Comprendre et analyser
        <br />
        une demande client
      </>
    }
    sub="Avant de répondre, comprendre : ce que le client veut, de quoi il parle, ce qui presse, et ce qu’il ressent."
    dur="10:00 – 10:55 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · analyser plusieurs demandes clients
      </Tag>
    }
  >
    <SecItem n={1}>Identifier l’intention du client</SecItem>
    <SecItem n={2}>Classer les demandes</SecItem>
    <SecItem n={3}>Extraire les informations importantes</SecItem>
    <SecItem n={4}>Détecter l’urgence</SecItem>
    <SecItem n={5}>Identifier les émotions et le niveau d’insatisfaction</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── La grille d’analyse en 5 questions ─────────────────────────────────────
const M2Q = ({ n, icon, tone, q, children }: { n: number; icon: IconName; tone: Tone; q: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px 24px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 25, lineHeight: 1.2, color: C.navy }}>{q}</div>
    <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M2_Grille: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Cinq questions à poser à chaque message</Title>
    <Lede>Appliquées au message de Mme Moreau. → répond à chaque question.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, ...dl(100) }}>
      <Bubble who="user" name="Mme Moreau · email" size={23} w={1580}>
        Mon lave-linge est arrivé avec 6 jours de retard et il fuit dès le premier lavage ! C’est la deuxième fois que je vous écris et personne ne
        répond. Je veux une solution rapide, sinon j’annule tout et je laisse un avis.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', gap: 20 }}>
      <M2Q n={1} icon="target" tone="blue" q="Que veut-elle ?">
        Une solution rapide à la fuite (réparation ou échange), et être enfin entendue.
      </M2Q>
      <M2Q n={2} icon="filter" tone="teal" q="De quoi parle-t-elle ?">
        SAV · produit défectueux, avec un retard de livraison en toile de fond.
      </M2Q>
      <M2Q n={3} icon="note" tone="violet" q="Quelles infos ?">
        Commande NM-48213 · lave-linge · retard 6 jours · fuite au 1er lavage · 2e contact.
      </M2Q>
      <M2Q n={4} icon="clock" tone="yellow" q="Est-ce urgent ?">
        Oui : appareil inutilisable, 2e relance, menace d’annulation et d’avis public.
      </M2Q>
      <M2Q n={5} icon="frown" tone="coral" q="Que ressent-elle ?">
        Exaspération : « personne ne répond », point d’exclamation, ultimatum.
      </M2Q>
    </div>
  </Frame>
);

// ─── Identifier l’intention (ce qui est dit / ce qui est voulu) ─────────────
const M2Int = ({ said, want, tone, flipAt }: { said: string; want: ReactNode; tone: Tone; flipAt: number }) => (
  <FlipCard
    w={396}
    h={440}
    tone={tone}
    backTone={tone}
    flipAt={flipAt}
    front={
      <>
        <Eyebrow c={C.muted} size={17}>
          Le client écrit
        </Eyebrow>
        <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 29, lineHeight: 1.3, color: C.navy }}>« {said} »</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={17}>
          Il veut vraiment
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{want}</div>
      </>
    }
  />
);

const M2_Intention: Page = () => (
  <Frame mod={2} kind="exercice" beats={4}>
    <Title>L’intention : ce que le client veut, pas seulement ce qu’il dit</Title>
    <Lede>Devinez l’intention réelle, puis retournez la carte (clic ou →).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 32, ...dl(100) }}>
      <M2Int said="Je suis très déçu par votre service." tone="blue" flipAt={1} want="Être reconnu dans sa déception… et savoir ce qui va être fait. Sans question explicite, il attend quand même une action." />
      <M2Int said="Vous avez bien reçu mon retour ?" tone="teal" flipAt={2} want="Être rassuré sur son remboursement : la vraie question, c’est « quand vais-je être remboursé ? »." />
      <M2Int said="C’est quoi ces frais de 9,90 € ?" tone="violet" flipAt={3} want="Contester des frais qu’il juge injustifiés, et probablement en obtenir le remboursement." />
      <M2Int said="Je déménage le 15 du mois prochain." tone="pink" flipAt={4} want="Faire livrer sa commande à la nouvelle adresse, ou décaler la livraison." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(500) }}>
      <Callout title="Avec l’IA" tone="blue" icon="sparkles" size={25}>
        Demandez-lui : « Quelle est l’<strong>intention principale</strong> du client ? Y a-t-il une <strong>intention secondaire</strong> ? Cite la
        phrase qui le montre. » La citation vous permet de vérifier en deux secondes.
      </Callout>
    </div>
  </Frame>
);

// ─── Classer les demandes (jeu de tri) ──────────────────────────────────────
const M2Zone = ({ x, y, tone, icon, label }: { x: number; y: number; tone: Tone; icon: IconName; label: string }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 560,
      height: 330,
      boxSizing: 'border-box',
      borderRadius: 20,
      background: T[tone].bg,
      boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`,
      padding: '16px 20px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={28} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M2_Classer: Page = () => (
  <Frame mod={2} kind="jeu" beats={1}>
    <Title>Jeu : rangez chaque demande dans sa catégorie</Title>
    <Lede>Glissez les étiquettes (double-clic = retour à la place). → affiche le corrigé.</Lede>
    <M2Zone x={660} y={250} tone="blue" icon="truck" label="Livraison" />
    <M2Zone x={1240} y={250} tone="coral" icon="tool" label="SAV · panne" />
    <M2Zone x={660} y={600} tone="violet" icon="euro" label="Facturation · remboursement" />
    <M2Zone x={1240} y={600} tone="teal" icon="cart" label="Commande · modification" />
    <Drag x={120} y={250} w={500} tone="grey" size={21}>
      « Colis indiqué livré, mais rien reçu »
    </Drag>
    <Drag x={120} y={330} w={500} tone="grey" size={21}>
      « Le four affiche une erreur E3 »
    </Drag>
    <Drag x={120} y={410} w={500} tone="grey" size={21}>
      « Je n’ai jamais reçu ma facture »
    </Drag>
    <Drag x={120} y={490} w={500} tone="grey" size={21}>
      « Ajouter une extension de garantie ? »
    </Drag>
    <Drag x={120} y={570} w={500} tone="grey" size={21}>
      « Le livreur a rayé mon parquet »
    </Drag>
    <Drag x={120} y={650} w={500} tone="grey" size={21}>
      « Retour fait, toujours pas remboursé »
    </Drag>
    <Drag x={120} y={730} w={500} tone="grey" size={21}>
      « Puis-je annuler ma commande d’hier ? »
    </Drag>
    <Drag x={120} y={810} w={500} tone="grey" size={21}>
      « Le lave-vaisselle ne vidange plus »
    </Drag>
    <div
      className={b.on(1)}
      style={{ position: 'absolute', left: 660, top: 945, width: 1140, display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.ink, zIndex: 25 }}
    >
      <Tag tone="blue" size={18}>Livraison : colis, parquet</Tag>
      <Tag tone="coral" size={18}>SAV : four, lave-vaisselle</Tag>
      <Tag tone="violet" size={18}>Factu. : facture, retour</Tag>
      <Tag tone="teal" size={18}>Commande : garantie, annulation</Tag>
    </div>
  </Frame>
);

// ─── Extraire les informations importantes ──────────────────────────────────
const M2Field = ({ n, label, value, tone }: { n: number; label: string; value: ReactNode; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '12px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 200, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span className={b.left(n)} style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
      {value}
    </span>
  </div>
);

const M2_Extraire: Page = () => (
  <Frame mod={2} beats={6}>
    <Title>Extraire les informations importantes</Title>
    <Lede>Le message est long et désordonné ; la fiche, elle, se lit en cinq secondes. → extrait chaque information.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 270, width: 820, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', fontSize: 25, lineHeight: 1.62, color: C.ink, ...dl(100) }}
    >
      <Eyebrow c={C.muted} size={17} style={{ marginBottom: 8 }}>
        Chat · samedi 14 h 05
      </Eyebrow>
      Bonjour, alors voilà, j’ai commandé <Mk n={2} tone="violet">la cave à vin Vinea 40</Mk> il y a deux semaines (commande{' '}
      <Mk n={1}>NM-51870</Mk>) et elle a été livrée <Mk n={3} tone="yellow">mardi dernier</Mk>. Depuis hier,{' '}
      <Mk n={4} tone="coral">elle ne refroidit plus du tout</Mk>, j’ai dû tout mettre au frigo. Je voudrais savoir{' '}
      <Mk n={5} tone="teal">si vous pouvez me l’échanger</Mk>, ou au pire la réparer. Je suis{' '}
      <Mk n={6} tone="green">joignable plutôt le soir après 18 h</Mk>. Merci d’avance, Thomas
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1000, top: 270, width: 800, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 32px', ...dl(200) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <IconTile name="table" tone="navy" size={42} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>Fiche de contact</span>
      </div>
      <M2Field n={1} label="Commande" value="NM-51870" tone="blue" />
      <M2Field n={2} label="Produit" value="Cave à vin Vinea 40" tone="violet" />
      <M2Field n={3} label="Livraison" value="Mardi dernier (moins de 15 jours)" tone="yellow" />
      <M2Field n={4} label="Problème" value="Ne refroidit plus depuis hier" tone="coral" />
      <M2Field n={5} label="Demande" value="Échange, à défaut réparation" tone="teal" />
      <M2Field n={6} label="Disponibilité" value="Le soir, après 18 h" tone="green" />
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 760, width: 820 }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={23}>
        Si une info manque (le n° de commande, par exemple), l’IA doit écrire « non précisé », jamais inventer. Dites-le dans le prompt.
      </Callout>
    </div>
  </Frame>
);

// ─── Détecter l’urgence ─────────────────────────────────────────────────────
const M2Prio = ({ n, p, tone, when, children }: { n: number; p: string; tone: Tone; when: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 8px 0 0 ${STRONG[tone]}`, padding: '16px 24px 16px 30px' }}>
    <span style={{ width: 74, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 40, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{p}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.navy }}>{when}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2Sig = ({ icon, children, d }: { icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <IconTile name={icon} tone="yellow" size={46} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M2_Urgence: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Détecter l’urgence : des signaux, puis une priorité</Title>
    <Lede>L’IA repère les signaux ; la grille de priorité, c’est votre entreprise qui la fixe.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Eyebrow c={C.amber} size={20} cls={A.fade}>
        Signaux d’urgence
      </Eyebrow>
      <M2Sig icon="alert" d={150}>
        Sécurité : étincelles, fuite, odeur de brûlé
      </M2Sig>
      <M2Sig icon="euro" d={250}>
        Impact financier : double prélèvement, loyer
      </M2Sig>
      <M2Sig icon="calendar" d={350}>
        Échéance proche : livraison demain, événement
      </M2Sig>
      <M2Sig icon="loop" d={450}>
        Relances : « deuxième fois », « troisième appel »
      </M2Sig>
      <M2Sig icon="megaphone" d={550}>
        Menaces : annulation, avis public, association
      </M2Sig>
      <M2Sig icon="heart" d={650}>
        Fragilité : âge, santé, situation difficile
      </M2Sig>
    </div>
    <div style={{ position: 'absolute', left: 820, top: 270, width: 980, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Prio n={1} p="P1" tone="coral" when="Immédiat">
        Sécurité ou fragilité : consigne de sécurité tout de suite, puis traitement prioritaire.
      </M2Prio>
      <M2Prio n={2} p="P2" tone="yellow" when="Dans la journée">
        Préjudice financier, 3e relance, menace de départ, échéance sous 48 h.
      </M2Prio>
      <M2Prio n={3} p="P3" tone="blue" when="Sous 24 h">
        Panne ou retard sans aggravation, demande de modification.
      </M2Prio>
      <M2Prio n={4} p="P4" tone="grey" when="Sous 72 h">
        Demande d’information, question générale, suggestion.
      </M2Prio>
      <div className={b.on(5)} style={{ marginTop: 6 }}>
        <Callout title="Attention" tone="coral" icon="eye" size={23}>
          Un client <strong>poli</strong> peut être en <strong>danger</strong> : « Ma plaque fait des étincelles, est-ce normal ? » est P1. L’urgence ne
          se lit pas qu’au ton.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Émotions : le thermomètre (interactif) ─────────────────────────────────
const EMO = [
  { label: 'Neutre', tone: 'green' as Tone, icon: 'smile' as IconName },
  { label: 'Inquiet', tone: 'teal' as Tone, icon: 'meh' as IconName },
  { label: 'Agacé', tone: 'yellow' as Tone, icon: 'meh' as IconName },
  { label: 'En colère', tone: 'coral' as Tone, icon: 'frown' as IconName },
  { label: 'Rupture', tone: 'violet' as Tone, icon: 'alert' as IconName },
];
const EMO_COL = [C.green, C.teal, C.yellow, C.coral, C.plum];

const M2Msg = ({ i, cur, set, children }: { i: number; cur: number; set: (i: number) => void; children: ReactNode }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(i);
    }}
    style={{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      padding: '14px 20px',
      borderRadius: 14,
      fontFamily: body,
      fontSize: 23,
      lineHeight: 1.4,
      color: C.ink,
      background: cur === i ? '#fff' : C.panel,
      boxShadow: cur === i ? `0 0 0 3px ${EMO_COL[i]}, ${SHADOW_SM}` : 'none',
      transition: `all 250ms ${EASE}`,
    }}
  >
    {children}
  </button>
);

const M2_Emotions: Page = () => {
  const [cur, set] = useState(0);
  const ang = -90 + cur * 45;
  const cues = [
    'Formule de politesse, question simple, aucun reproche.',
    '« Je commence à m’inquiéter » : besoin d’être rassuré.',
    '« 2e fois », « pas sérieux » : relance et reproche.',
    'MAJUSCULES, « !!! », demande d’un responsable.',
    'Ultimatum : avocat, avis négatifs. Risque de départ.',
  ];
  return (
    <Frame mod={2} kind="simu">
      <Title>Émotions : prendre la température du client</Title>
      <Lede>Cliquez un message : l’aiguille indique le niveau d’insatisfaction, et les indices qui le trahissent.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 12, ...dl(100) }}>
        <M2Msg i={0} cur={cur} set={set}>
          « Bonjour, pourriez-vous me dire quand arrive ma commande ? Merci. »
        </M2Msg>
        <M2Msg i={1} cur={cur} set={set}>
          « Je commence à m’inquiéter, toujours aucune nouvelle de ma livraison… »
        </M2Msg>
        <M2Msg i={2} cur={cur} set={set}>
          « C’est la deuxième fois que je pose la question. Pas très sérieux. »
        </M2Msg>
        <M2Msg i={3} cur={cur} set={set}>
          « C’EST INADMISSIBLE !!! Je veux parler à un responsable. »
        </M2Msg>
        <M2Msg i={4} cur={cur} set={set}>
          « Dernier message avant mon avocat, et un avis 1 étoile partout. »
        </M2Msg>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1020, top: 262, width: 780, height: 670, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
        <svg width={720} height={380} viewBox="0 0 720 380" style={{ display: 'block' }}>
          <path d="M 80 340 A 280 280 0 0 1 136 172" fill="none" stroke={EMO_COL[0]} strokeWidth={46} />
          <path d="M 140 166 A 280 280 0 0 1 271 74" fill="none" stroke={EMO_COL[1]} strokeWidth={46} />
          <path d="M 277 72 A 280 280 0 0 1 443 72" fill="none" stroke={EMO_COL[2]} strokeWidth={46} />
          <path d="M 449 74 A 280 280 0 0 1 580 166" fill="none" stroke={EMO_COL[3]} strokeWidth={46} />
          <path d="M 584 172 A 280 280 0 0 1 640 340" fill="none" stroke={EMO_COL[4]} strokeWidth={46} />
          <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: '360px 340px', transition: `transform 900ms ${EASE_BACK}` }}>
            <path d="M 352 340 L 360 110 L 368 340 Z" fill={C.navy} />
          </g>
          <circle cx={360} cy={340} r={24} fill={C.navy} />
          <circle cx={360} cy={340} r={9} fill="#fff" />
        </svg>
        <div key={cur} className={A.fade} style={{ animationDuration: '400ms', textAlign: 'center' } as CSSProperties}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: display, fontWeight: 800, fontSize: 44, color: EMO_COL[cur] === C.yellow ? C.amber : EMO_COL[cur] }}>
            <Icon name={EMO[cur].icon} size={46} color={EMO_COL[cur] === C.yellow ? C.amber : EMO_COL[cur]} />
            {EMO[cur].label}
          </div>
          <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{cues[cur]}</div>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 840, fontSize: 22, lineHeight: 1.45, color: C.muted, ...dl(500) }}>
        Avec l’IA : « Évalue l’émotion dominante (neutre → rupture) et cite les indices. » Elle détecte vite ; vous confirmez, car l’ironie et
        l’implicite la piègent encore.
      </div>
    </Frame>
  );
};

// ─── Reformuler la demande ──────────────────────────────────────────────────
const M2_Reformuler: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Reformuler la demande : « Si je comprends bien… »</Title>
    <Lede>Une reformulation courte prouve au client qu’il a été compris, et vous évite de répondre à côté.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, ...dl(100) }}>
      <Bubble who="user" name="Client · message vocal retranscrit" size={23}>
        Oui bonjour euh… c’est pour le frigo, enfin le combiné, celui que j’ai pris en promo, là, il fait un bruit, enfin pas tout le temps, surtout la
        nuit, et puis ma femme dit que la porte ferme mal, du coup je sais pas si c’est lié, bref, faudrait voir, merci.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 270, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.on(1)}>
        <Code title="Prompt" size={21} style={{ whiteSpace: 'pre-wrap' }}>
          Reformule cette demande en 2 phrases maximum, en commençant par « Si je comprends bien ». Liste ensuite les points à faire préciser au client.
        </Code>
      </div>
      <div className={b.on(2)} style={{ background: T.violet.bg, borderRadius: 18, padding: '20px 26px', fontSize: 24, lineHeight: 1.45, color: C.ink }}>
        <Eyebrow c={T.violet.fg} size={17} style={{ marginBottom: 6 }}>
          Reformulation proposée
        </Eyebrow>
        Si je comprends bien, votre réfrigérateur combiné fait un bruit inhabituel, surtout la nuit, et sa porte ferme mal. Vous souhaitez savoir si les
        deux sont liés et ce qui peut être fait.
      </div>
      <div className={b.on(3)} style={{ background: T.yellow.bg, borderRadius: 18, padding: '18px 26px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>
        <Eyebrow c={T.yellow.fg} size={17} style={{ marginBottom: 6 }}>
          À faire préciser
        </Eyebrow>
        Référence ou n° de commande · date d’achat · type de bruit · le joint de porte est-il abîmé ?
      </div>
    </div>
  </Frame>
);

// ─── Prompt d’analyse + analyseur interactif ────────────────────────────────
const M2Row = ({ label, value, tone, d }: { label: string; value: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '9px 0', borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ width: 150, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span style={{ fontSize: 22, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>{value}</span>
  </div>
);

const M2Res = ({ cat, intent, infos, urg, emo, next }: { cat: string; intent: string; infos: string; urg: string; emo: string; next: string }) => (
  <div>
    <M2Row label="Catégorie" value={cat} tone="teal" d={0} />
    <M2Row label="Intention" value={intent} tone="blue" d={120} />
    <M2Row label="Infos clés" value={infos} tone="violet" d={240} />
    <M2Row label="Urgence" value={urg} tone="yellow" d={360} />
    <M2Row label="Émotion" value={emo} tone="coral" d={480} />
    <M2Row label="À faire" value={next} tone="green" d={600} />
  </div>
);

const M2_Analyseur: Page = () => {
  const [cur, setCur] = useState('a');
  const [run, setRun] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const pick = (id: string) => setCur(id);
  const go = () => {
    setDone((d) => ({ ...d, [cur]: true }));
    setRun((r) => r + 1);
  };
  const MSG: Record<string, string> = {
    a: '« J’ai été prélevée deux fois de 649 € pour la commande NM-50122. Remboursez-moi vite, c’est mon loyer qui part ! »',
    b: '« Hello, est-ce que je peux changer la couleur du frigo commandé hier soir avant qu’il parte ? Merci ! »',
    c: '« Bonjour, ma plaque de cuisson fait des étincelles quand je l’allume, est-ce normal ? »',
  };
  return (
    <Frame mod={2} kind="simu">
      <Title>Le prompt d’analyse, en action</Title>
      <Lede>Un modèle à réutiliser tel quel. Choisissez un message, puis lancez l’analyse.</Lede>
      <CodeDark file="prompt-analyse.txt" size={19} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 700, height: 680, ...dl(100) }}>
        <Ck>Rôle · </Ck>Tu assistes un conseiller du service client de Nova Maison.{'\n\n'}
        <Ck>Tâche · </Ck>Analyse le message client ci-dessous et remplis la fiche :{'\n'}
        {'  '}- <Cf>Catégorie</Cf> : <Cs>Livraison | SAV | Facturation | Commande | Autre</Cs>
        {'\n'}
        {'  '}- <Cf>Intention</Cf> principale (et secondaire s’il y en a une){'\n'}
        {'  '}- <Cf>Infos clés</Cf> : n° de commande, produit, dates, montants{'\n'}
        {'  '}- <Cf>Urgence</Cf> : <Cs>P1 | P2 | P3 | P4</Cs> + le signal qui la justifie{'\n'}
        {'  '}- <Cf>Émotion</Cf> : <Cs>neutre → rupture</Cs> + l’indice{'\n'}
        {'  '}- <Cf>À faire</Cf> : la prochaine action conseillée{'\n\n'}
        <Ck>Règles · </Ck>N’invente rien : si une info manque, écris <Cs>« non précisé »</Cs>. Réponds sous forme de liste courte.{'\n\n'}
        <Cc>Message : """[coller le message]"""</Cc>
      </CodeDark>
      <div className={A.right} style={{ position: 'absolute', left: 870, top: 262, width: 930, ...dl(200) }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <M2Tab id="a" cur={cur} pick={pick} label="Message A" />
          <M2Tab id="b" cur={cur} pick={pick} label="Message B" />
          <M2Tab id="c" cur={cur} pick={pick} label="Message C" />
          <div style={{ marginLeft: 'auto' }}>
            <Btn icon="sparkles" tone="violet" size={22} onClick={go}>
              Analyser
            </Btn>
          </div>
        </div>
        <div style={{ marginTop: 16, background: C.panel, borderRadius: 16, padding: '16px 22px', fontSize: 23, lineHeight: 1.45, color: C.ink, minHeight: 104 }}>{MSG[cur]}</div>
        <div style={{ marginTop: 16, height: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 24px' }}>
          {!done[cur] ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 24, color: C.faint }}>
              <Icon name="sparkles" size={28} /> Cliquez sur « Analyser »
            </div>
          ) : cur === 'a' ? (
            <M2Res key={`a${run}`} cat="Facturation" intent="Remboursement du double prélèvement" infos="NM-50122 · 2 × 649 €" urg="P2 · préjudice financier, « loyer »" emo="Inquiète, pressée" next="Vérifier les paiements, lancer le remboursement, rassurer" />
          ) : cur === 'b' ? (
            <M2Res key={`b${run}`} cat="Commande" intent="Changer la couleur avant expédition" infos="Frigo · commandé hier soir · n° non précisé" urg="P3 · à traiter avant l’expédition" emo="Neutre, cordial" next="Demander le n°, vérifier le stock et le statut" />
          ) : (
            <M2Res key={`c${run}`} cat="SAV · sécurité" intent="Savoir si c’est normal (non : danger)" infos="Plaque de cuisson · étincelles · n° non précisé" urg="P1 · risque électrique" emo="Inquiet mais calme" next="Consigne : ne plus utiliser, couper le disjoncteur" />
          )}
        </div>
      </div>
    </Frame>
  );
};
const M2Tab = ({ id, cur, pick, label }: { id: string; cur: string; pick: (id: string) => void; label: string }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      pick(id);
    }}
    style={{
      border: 'none',
      cursor: 'pointer',
      padding: '10px 18px',
      borderRadius: 10,
      fontFamily: body,
      fontWeight: 600,
      fontSize: 21,
      background: cur === id ? C.electric : C.card,
      color: cur === id ? '#fff' : C.soft,
      boxShadow: cur === id ? '0 6px 16px -10px rgba(11,31,92,.6)' : `inset 0 0 0 1.5px ${C.rule}`,
    }}
  >
    {label}
  </button>
);

// ─── Le kit de l’atelier 1 : 5 demandes ─────────────────────────────────────
const M2Kit = ({ l, chan, icon, tone, children, d }: { l: string; chan: string; icon: IconName; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <Num n={l} tone={tone} size={40} />
      <Tag tone="grey" size={17}>
        <Icon name={icon} size={18} /> {chan}
      </Tag>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M2_Kit: Page = () => (
  <Frame mod={2} kind="atelier">
    <Title>Atelier 1 · les six demandes à analyser</Title>
    <Lede>Messages fictifs reçus par le service client de Nova Maison ce lundi matin.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <M2Kit l="A" chan="Email" icon="mail" tone="blue" d={100}>
        « Bonjour, j’ai été prélevée deux fois de 649 € pour la commande NM-50122. Merci de me rembourser au plus vite, c’est mon loyer qui part. »
      </M2Kit>
      <M2Kit l="B" chan="Chat" icon="chat" tone="teal" d={200}>
        « Hello, je voudrais savoir si je peux changer la couleur de mon frigo avant qu’il parte ? Commande passée hier soir. Merci ! »
      </M2Kit>
      <M2Kit l="C" chan="Appel retranscrit" icon="phone" tone="coral" d={300}>
        « TROISIÈME appel. Le technicien n’est jamais venu, j’ai posé une journée de congé pour rien. Je contacte une association de consommateurs. »
      </M2Kit>
      <M2Kit l="D" chan="Formulaire web" icon="form" tone="yellow" d={400}>
        « Ma plaque de cuisson fait des étincelles quand je l’allume, est-ce normal ? »
      </M2Kit>
      <M2Kit l="E" chan="Email" icon="mail" tone="violet" d={500}>
        « Bonjour, la livraison est prévue jeudi mais je serai absent, est-il possible de la décaler à samedi ? Cdt, M. Haddad »
      </M2Kit>
      <M2Kit l="F" chan="Réseau social" icon="megaphone" tone="pink" d={600}>
        « Super, Nova Maison : 3 semaines pour rembourser un retour. Bravo le service client 👏 #jamaisplus »
      </M2Kit>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(900) }}>
      <Icon name="eye" size={24} color={C.violet} />
      Message F : attention à l’ironie. « Super » et « bravo » ne veulent pas dire que le client est content.
    </div>
  </Frame>
);

const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="1"
    title="Analyser plusieurs demandes clients"
    defi="analyse"
    who="En binôme · 15 min"
    minutes={15}
    objective={
      <>
        Produire, avec l’IA, une <strong>fiche d’analyse</strong> pour chacun des six messages, puis la <strong>vérifier</strong> vous-même.
      </>
    }
    where={
      <>
        Six fiches d’analyse (A à F)
        <br />
        Votre prompt d’analyse, amélioré
        <br />
        Un désaccord IA / humain à partager
      </>
    }
    crit={
      <>
        <CheckItem id="a1-1" size={21}>
          Catégorie prise dans la liste fermée
        </CheckItem>
        <CheckItem id="a1-2" size={21}>
          Urgence justifiée par un signal
        </CheckItem>
        <CheckItem id="a1-3" size={21}>
          Aucune information inventée
        </CheckItem>
        <CheckItem id="a1-4" size={21}>
          L’ironie du message F détectée
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Copiez le prompt d’analyse dans votre outil IA. <strong>2.</strong> Analysez les messages un par un (ou les six d’un coup, en
    demandant un tableau). <strong>3.</strong> Relisez chaque fiche : seriez-vous d’accord ? <strong>4.</strong> Notez un cas où vous corrigez l’IA, et
    pourquoi.
    <Bonus>Demandez à l’IA de trier les six messages par ordre de traitement, et comparez avec votre propre ordre.</Bonus>
  </LabPage>
);

// ─── Corrigé de l’atelier 1 ─────────────────────────────────────────────────
const M2Cell = ({ children, tone, w }: { children: ReactNode; tone?: Tone; w: number }) => (
  <div style={{ width: w, flex: 'none', fontSize: 21, lineHeight: 1.3, color: tone ? T[tone].fg : C.ink, fontWeight: tone ? 700 : 500 }}>{children}</div>
);

const M2Line = ({ n, l, tone, cat, intent, urg, urgTone, emo }: { n: number; l: string; tone: Tone; cat: string; intent: string; urg: string; urgTone: Tone; emo: string }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 22px' }}>
    <Num n={l} tone={tone} size={40} />
    <M2Cell w={250}>{cat}</M2Cell>
    <M2Cell w={560}>{intent}</M2Cell>
    <M2Cell w={300} tone={urgTone}>
      {urg}
    </M2Cell>
    <M2Cell w={340}>{emo}</M2Cell>
  </div>
);

const M2Head = ({ children, w }: { children: ReactNode; w: number }) => (
  <div style={{ width: w, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>{children}</div>
);

const M2_Corrige: Page = () => (
  <Frame mod={2} kind="synthese" beats={6}>
    <Title>Atelier 1 · mise en commun</Title>
    <Lede>Comparez avec vos fiches. → affiche une ligne à la fois : où l’IA et vous n’étiez pas d’accord ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 20, padding: '0 22px' }}>
        <div style={{ width: 40, flex: 'none' }} />
        <M2Head w={250}>Catégorie</M2Head>
        <M2Head w={560}>Intention</M2Head>
        <M2Head w={300}>Urgence</M2Head>
        <M2Head w={340}>Émotion</M2Head>
      </div>
      <M2Line n={1} l="A" tone="blue" cat="Facturation" intent="Être remboursée du double prélèvement" urg="P2 · financier" urgTone="yellow" emo="Inquiète, pressée" />
      <M2Line n={2} l="B" tone="teal" cat="Commande" intent="Modifier la couleur avant expédition" urg="P3 · avant envoi" urgTone="blue" emo="Neutre, cordial" />
      <M2Line n={3} l="C" tone="coral" cat="SAV" intent="Obtenir l’intervention + réparation du préjudice" urg="P2 · 3e relance" urgTone="yellow" emo="Colère, menace" />
      <M2Line n={4} l="D" tone="yellow" cat="SAV · sécurité" intent="Savoir si c’est normal (non)" urg="P1 · sécurité" urgTone="coral" emo="Inquiet, calme" />
      <M2Line n={5} l="E" tone="violet" cat="Livraison" intent="Décaler la livraison à samedi" urg="P3 · avant jeudi" urgTone="blue" emo="Neutre" />
      <M2Line n={6} l="F" tone="pink" cat="Facturation" intent="Être remboursé · public : réponse rapide" urg="P2 · visibilité" urgTone="yellow" emo="Ironie, exaspération" />
    </div>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz : analyser une demande</Title>
    <QuizSeries y={220}>
      <QuizQ q="Pourquoi donner à l’IA une liste fermée de catégories ?" explain="Avec une liste fermée, chaque demande tombe dans une case connue : les statistiques sont comparables d’un jour à l’autre et le routage reste fiable.">
        <QOpt>Pour qu’elle aille plus vite</QOpt>
        <QOpt ok>Pour que les catégories restent cohérentes et exploitables</QOpt>
        <QOpt>Ce n’est pas utile, elle trouve seule</QOpt>
      </QuizQ>
      <QuizQ q="« Ma plaque fait des étincelles, est-ce normal ? » Message calme et poli. Priorité ?" explain="La sécurité passe avant le ton. On donne immédiatement la consigne (ne plus utiliser, couper l’alimentation), puis on traite en priorité.">
        <QOpt>P4 : simple question, client calme</QOpt>
        <QOpt>P3 : panne classique</QOpt>
        <QOpt ok>P1 : risque pour la sécurité</QOpt>
      </QuizQ>
      <QuizQ q="Le numéro de commande n’apparaît pas dans le message. L’IA doit…" explain="« Non précisé » est une réponse utile : elle vous dit quoi demander au client. Un numéro inventé, lui, peut faire traiter le mauvais dossier.">
        <QOpt ok>Écrire « non précisé »</QOpt>
        <QOpt>Proposer le numéro le plus probable</QOpt>
        <QOpt>Laisser le champ vide sans le signaler</QOpt>
      </QuizQ>
      <QuizQ q="« Bravo le service client 👏 » publié sur un réseau social. Émotion ?" explain="C’est de l’ironie : le client est mécontent, et en public. L’IA peut s’y tromper ; c’est typiquement un point que le conseiller vérifie.">
        <QOpt>Satisfait, il félicite l’équipe</QOpt>
        <QOpt ok>Exaspéré, sur le ton de l’ironie</QOpt>
        <QOpt>Neutre</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Module 2 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Cinq questions avant de répondre : <strong>intention, catégorie, infos clés, urgence, émotion</strong>.
      </SynthRow>
      <SynthRow n={2} tone="teal">
        L’intention réelle se cache souvent derrière la phrase : demandez à l’IA de <strong>citer l’indice</strong>.
      </SynthRow>
      <SynthRow n={3} tone="violet">
        Catégories et priorités : une <strong>liste fermée</strong> fixée par l’entreprise, et « non précisé » plutôt qu’inventé.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        L’urgence ne se lit pas qu’au ton : <strong>sécurité et fragilité d’abord</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral">
        L’IA détecte vite les émotions mais rate l’ironie : <strong>vous confirmez</strong>, puis vous reformulez.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : votre prompt d’analyse amélioré pendant l’atelier.
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_Grille, M2_Intention, M2_Classer, M2_Extraire, M2_Urgence, M2_Emotions, M2_Reformuler, M2_Analyseur, M2_Kit, M2_Atelier, M2_Corrige, M2_Quiz, M2_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 2 · OUVERTURE DE SECTION · 10:00

OBJECTIF — Annoncer le module : comprendre avant de répondre.

DIRE — « Combien de réponses à côté viennent d’une demande mal lue ? Ce module, c’est l’art de décortiquer un message : ce que le client veut, de quoi il parle, les infos utiles, ce qui presse, et ce qu’il ressent. L’IA est très forte pour ça, à condition de bien cadrer. Et vous le pratiquerez dans l’atelier 1. »

TRANSITION — « Cinq questions, appliquées à Mme Moreau. »`,
  `⏱ 3 min · LA GRILLE EN 5 QUESTIONS (→ ×5)

OBJECTIF — Installer la grille d’analyse qui servira tout le module.

DIRE — « Voici le message de Mme Moreau. Cinq questions. » → « Que veut-elle ? Une solution rapide, et être entendue. » → « De quoi parle-t-elle ? Du SAV : un produit défectueux, avec un retard en toile de fond. » → « Quelles infos ? Le numéro, le produit, le retard, la fuite, la relance. » → « Est-ce urgent ? Oui : l’appareil est inutilisable, c’est sa deuxième relance, et il y a une menace. » → « Que ressent-elle ? De l’exaspération. »

ANIMATION — Avant chaque →, faire répondre la salle.

TRANSITION — « Zoom sur chaque question, à commencer par l’intention. »`,
  `⏱ 4 min · L’INTENTION (cartes à retourner, → ×4)

OBJECTIF — Distinguer ce que le client dit de ce qu’il veut.

DIRE — Pour chaque carte : lire la phrase, demander « Que veut-il vraiment ? », puis retourner. « Je suis très déçu » : il attend une action. « Vous avez reçu mon retour ? » : la vraie question est « quand suis-je remboursé ? ». « C’est quoi ces frais ? » : il les conteste. « Je déménage le 15 » : il faut changer l’adresse ou la date.

INSISTER — Avec l’IA, demandez l’intention principale, la secondaire, et la phrase qui le prouve : vous vérifiez en deux secondes.

TRANSITION — « Deuxième question : de quoi parle-t-il ? Petit jeu. »`,
  `⏱ 4 min · JEU DE TRI (glisser-déposer, → corrigé)

OBJECTIF — Faire sentir la nécessité d’une liste de catégories commune, et ses cas limites.

DIRE — « Huit demandes, quatre catégories. Qui vient les ranger ? » Faire venir un ou deux volontaires. Discuter le cas du parquet rayé : livraison ou réclamation ? « Il n’y a pas de bonne réponse universelle : c’est à l’entreprise de fixer la règle, et à vous de la donner à l’IA. » → corrigé.

INSISTER — Liste fermée de catégories dans le prompt : sinon l’IA invente une catégorie différente à chaque fois, et vos statistiques deviennent inutilisables.

ANIMATION — Double-clic sur une étiquette = retour à sa place initiale.

TRANSITION — « Troisième question : les informations clés. »`,
  `⏱ 3 min · EXTRAIRE LES INFORMATIONS (→ ×6)

OBJECTIF — Montrer la transformation d’un message désordonné en fiche structurée.

DIRE — « Thomas écrit sur le chat, comme on parle. » → à chaque appui, une info est surlignée et rejoint la fiche : commande, produit, date de livraison, problème, demande, disponibilité. « En cinq secondes, le conseiller sait tout. Et la fiche peut être collée dans votre outil. »

INSISTER — Le piège : une info absente. L’IA doit écrire « non précisé », jamais inventer. Il faut l’écrire dans le prompt.

TRANSITION — « Quatrième question : est-ce urgent ? »`,
  `⏱ 4 min · DÉTECTER L’URGENCE (→ ×5)

OBJECTIF — Distinguer les signaux d’urgence et la grille de priorité.

DIRE — « À gauche, les signaux que l’IA sait repérer : sécurité, argent, échéance, relances, menaces, fragilité. » → P1 à P4. « La grille de priorité, c’est votre entreprise qui la fixe ; l’IA l’applique et justifie. » → « Attention : un client très poli peut être en danger. La plaque qui fait des étincelles, c’est P1, même si le message est calme. »

ANIMATION — Demander : « Chez vous, qui fixe les priorités ? Elles sont écrites quelque part ? »

TRANSITION — « Dernière question : l’émotion. »`,
  `⏱ 4 min · LE THERMOMÈTRE DES ÉMOTIONS (simulateur)

OBJECTIF — Repérer les indices d’émotion et les niveaux d’insatisfaction.

DIRE — Cliquer les messages un par un. « Neutre : politesse, question simple. Inquiet : besoin d’être rassuré. Agacé : relance et reproche. En colère : majuscules, points d’exclamation, demande d’un responsable. Rupture : ultimatum. » « Le niveau d’émotion change la réponse : on ne répond pas pareil à un client inquiet et à un client en rupture. On le verra au module 4. »

INSISTER — L’IA détecte vite, mais l’ironie et l’implicite la piègent encore : le conseiller confirme.

TRANSITION — « Une fois la demande comprise, on peut la reformuler. »`,
  `⏱ 3 min · REFORMULER (→ ×3)

OBJECTIF — Utiliser l’IA pour reformuler une demande confuse et repérer ce qu’il faut faire préciser.

DIRE — « Un message vocal retranscrit, comme on en reçoit beaucoup. » Le lire. → le prompt. → « La reformulation : deux phrases claires. Au téléphone, vous pouvez la dire telle quelle : « Si je comprends bien… ». Le client se sent compris. » → « Et la liste de ce qu’il faut lui demander. Vous gagnez un aller-retour. »

TRANSITION — « Assemblons tout ça dans un seul prompt d’analyse. »`,
  `⏱ 4 min · LE PROMPT D’ANALYSE EN ACTION (simulateur)

OBJECTIF — Donner un modèle de prompt d’analyse prêt à l’emploi et en montrer le résultat.

DIRE — Parcourir le prompt : rôle, tâche, les six champs, les listes fermées, la règle « n’invente rien ». Puis cliquer Message A → Analyser. Puis B, puis C. « Sur le message C, l’IA classe en P1 et donne la consigne de sécurité. Mais c’est vous qui vérifiez que la consigne est bien celle de votre procédure. »

ANIMATION — Si possible, faire la démonstration en direct dans votre outil IA avec le même prompt.

TRANSITION — « À vous de jouer : atelier 1. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 1

OBJECTIF — Présenter les six messages à analyser.

DIRE — « Six messages fictifs, reçus lundi matin. Des canaux différents : email, chat, appel retranscrit, formulaire, réseau social. Lisez-les rapidement. Attention au message F : de l’ironie. »

ANIMATION — Les messages sont aussi dans le kit distribué : chacun peut les copier.

TRANSITION — « Voici les consignes. »`,
  `⏱ 15 min · ATELIER 1 (minuteur 15 min)

OBJECTIF — Appliquer la grille d’analyse avec l’IA sur six cas variés et la vérifier.

DIRE — « En binôme. Copiez le prompt d’analyse, passez les six messages, et surtout relisez chaque fiche : seriez-vous d’accord ? Notez au moins un désaccord avec l’IA. Les critères de réussite sont à droite. »

ANIMATION — Lancer le minuteur. Passer dans les binômes : vérifier la liste fermée, le « non précisé », l’ironie du F. Bonus pour les plus rapides : faire trier les six messages par ordre de traitement.

TRANSITION — « On met en commun. »`,
  `⏱ 5 min · MISE EN COMMUN (→ ×6)

OBJECTIF — Comparer, discuter les écarts, valoriser les corrections humaines.

DIRE — Afficher les lignes une à une, demander à un binôme son analyse avant chaque →. Points de discussion : C (colère + menace : P2, et c’est un candidat à l’escalade, module 4) ; D (P1 malgré le calme) ; F (ironie, et c’est public : réponse rapide).

INSISTER — Recueillir les désaccords IA / humain : ce sont eux qui montrent pourquoi la validation humaine reste indispensable.

TRANSITION — « Petit quiz avant la pause. »`,
  `⏱ 3 min · QUIZ MODULE 2 (4 questions)

OBJECTIF — Vérifier : liste fermée, priorité sécurité, « non précisé », ironie.

DIRE — Lire, faire voter, cliquer, commenter l’explication.

TRANSITION — « Ce qu’il faut retenir. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 2

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Gardez votre prompt d’analyse dans votre document. Après la pause, on passe à la rédaction des réponses. »

TRANSITION — « Pause de quinze minutes. »`,
];
// @@NOTES-END
