// ─── Module 3 · Emails, courriers et communication professionnelle ──────────
const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Emails, courriers
        <br />
        et communication pro
      </>
    }
    sub="Rédiger, reformuler, adapter le ton, répondre, relancer, traduire : l’IA écrit le premier jet, vous gardez la main sur ce qui part."
    dur="11:30 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · communications à partir de cas réels
      </Tag>
    }
  >
    <SecItem n={1}>Rédiger un email, reformuler, adapter le ton</SecItem>
    <SecItem n={2}>Répondre à une réclamation, relancer un client</SecItem>
    <SecItem n={3}>Rédiger une note interne</SecItem>
    <SecItem n={4}>Traduire et adapter un message</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Rédiger un email (anatomie annotée) ────────────────────────────────────
const M3Note = ({ n, y, tone, children }: { n: number; y: number; tone: Tone; children: ReactNode }) => (
  <div className={b.left(n)} style={{ position: 'absolute', left: 1440, top: y, width: 360, display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ flex: 'none', width: 30, height: 4, borderRadius: 2, background: STRONG[tone] }} />
    <Tag tone={tone} size={20}>
      {children}
    </Tag>
  </div>
);

const M3Line = ({ tone, children, style }: { n: number; tone: Tone; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ borderRadius: 10, padding: '6px 12px', boxShadow: `inset 4px 0 0 ${STRONG[tone]}`, ...style }}>
    {children}
  </div>
);

const M3_Email: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Rédiger un email : ce qu’on demande, ce qu’on obtient</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 560 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        La demande de Nadia
      </Eyebrow>
      <Bubble who="user" w={500} size={21}>
        Tu es assistante de direction aux Ateliers Morel. L’imprimante du 2e étage affiche « erreur E-52 » depuis ce matin. Rédige un email à notre prestataire, InfoServ, pour demander une intervention avant jeudi. Contrat n° MS-2291. Ton cordial et précis, 100 mots max.
      </Bubble>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 200, width: 660, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', fontSize: 22, lineHeight: 1.5, color: C.ink, display: 'flex', flexDirection: 'column', gap: 8, ...dl(200) }}>
      <M3Line n={1} tone="blue">
        <strong>Objet : Demande d’intervention – imprimante 2e étage – contrat MS-2291</strong>
      </M3Line>
      <M3Line n={2} tone="violet">Bonjour,</M3Line>
      <M3Line n={3} tone="teal">
        Depuis ce matin, l’imprimante du 2e étage de nos locaux affiche le message « erreur E-52 » et ne fonctionne plus.
      </M3Line>
      <M3Line n={4} tone="green">
        Pourriez-vous programmer une intervention <strong>avant jeudi</strong> ? Je reste disponible au 02 40 00 00 00 pour convenir d’un créneau.
      </M3Line>
      <M3Line n={5} tone="yellow">
        Je vous remercie par avance pour votre réactivité.
        <br />
        Bien cordialement,
      </M3Line>
    </div>
    <M3Note n={1} y={232} tone="blue">
      Objet clair et retrouvable
    </M3Note>
    <M3Note n={2} y={300} tone="violet">
      Formule d’appel
    </M3Note>
    <M3Note n={3} y={380} tone="teal">
      Le contexte en une phrase
    </M3Note>
    <M3Note n={4} y={480} tone="green">
      L’action attendue + l’échéance
    </M3Note>
    <M3Note n={5} y={590} tone="yellow">
      Formule de politesse
    </M3Note>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Avant d’envoyer" tone="coral" icon="eye" size={23}>
        Vérifiez le numéro de contrat, le téléphone (ici fictif) et l’échéance. Ajoutez votre signature. L’IA a écrit, <strong>c’est vous qui envoyez</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Reformuler / adapter le ton (curseur) ──────────────────────────────────
const M3_TONES: { label: string; tone: Tone; txt: ReactNode; when: string }[] = [
  {
    label: 'Familier',
    tone: 'green',
    when: 'Collègue proche, messagerie interne',
    txt: (
      <>
        Salut Julie ! Petite mauvaise nouvelle : le mobilier pour Rennes arrive avec 5 jours de retard, le transporteur a un souci. Je te tiens au courant dès que j’ai la nouvelle date !
      </>
    ),
  },
  {
    label: 'Cordial',
    tone: 'blue',
    when: 'Client habituel, partenaire',
    txt: (
      <>
        Bonjour Madame Roux,
        <br />
        Je vous informe que la livraison du mobilier de votre site de Rennes aura 5 jours de retard, en raison d’un incident chez notre transporteur. Je reviens vers vous dès que j’ai la nouvelle date.
        <br />
        Bien cordialement,
      </>
    ),
  },
  {
    label: 'Formel',
    tone: 'navy',
    when: 'Courrier officiel, administration',
    txt: (
      <>
        Madame,
        <br />
        Nous vous informons que la livraison du mobilier destiné à votre site de Rennes subira un retard de cinq jours, consécutif à un incident chez notre transporteur. Nous vous communiquerons la nouvelle date dans les meilleurs délais.
        <br />
        Nous vous prions d’agréer, Madame, l’expression de nos salutations distinguées.
      </>
    ),
  },
  {
    label: 'Empathique',
    tone: 'violet',
    when: 'Client déjà mécontent, situation sensible',
    txt: (
      <>
        Bonjour Madame Roux,
        <br />
        Je sais combien ce mobilier est attendu pour l’ouverture de votre site de Rennes, et je suis sincèrement désolée : un incident chez notre transporteur retarde la livraison de 5 jours. Je suis personnellement le dossier et vous appelle demain avec une date ferme.
      </>
    ),
  },
];

const M3_Ton: Page = () => {
  const [i, setI] = useState(1);
  const t = M3_TONES[i];
  return (
    <Frame mod={3} kind="simu">
      <Title>Reformuler et adapter le ton</Title>
      <Lede>Le même fait : « la livraison aura 5 jours de retard ». Faites glisser le curseur.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', alignItems: 'center', gap: 30 }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>« Reformule ce message sur un ton… »</span>
        <Range value={i} onChange={setI} min={0} max={3} w={520} tone={t.tone} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[t.tone] }}>{t.label}</span>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 360, width: 1680, display: 'flex', gap: 10 }}>
        {M3_TONES.map((x, j) => (
          <span key={x.label} style={{ flex: 1, height: 8, borderRadius: 4, background: j === i ? STRONG[x.tone] : C.rule, transition: `background 300ms ${EASE}` }} />
        ))}
      </div>
      <div key={i} className={A.fade} style={{ position: 'absolute', left: 120, top: 400, width: 1180, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[t.tone]}`, padding: '30px 36px', fontSize: 27, lineHeight: 1.55, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
        {t.txt}
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 400, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div key={`w${i}`} className={A.fade} style={{ background: T[t.tone].bg, borderRadius: 16, padding: '18px 22px', animationDuration: '400ms' } as CSSProperties}>
          <Eyebrow c={T[t.tone].fg} size={17}>
            Pour qui ?
          </Eyebrow>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 600, color: C.ink }}>{t.when}</div>
        </div>
        <Callout title="Autres consignes" tone="grey" icon="loop" size={21}>
          « plus court » · « plus clair » · « sans jargon » · « plus positif » · « en gardant tous les faits »
        </Callout>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(400) }}>
        <Icon name="bulb" size={28} color={C.violet} />
        <span>Précisez toujours : « <strong style={{ color: C.navy }}>garde tous les faits, n’ajoute rien</strong> ». Une reformulation ne doit pas inventer de promesse.</span>
      </div>
    </Frame>
  );
};

// ─── Répondre à une réclamation ─────────────────────────────────────────────
const M3_ARSS: { k: string; label: string; tone: Tone; txt: ReactNode }[] = [
  { k: 'A', label: 'Accuser réception', tone: 'blue', txt: 'Monsieur Lambert, je vous remercie pour votre message concernant la livraison de vos bureaux (commande n° 7710).' },
  { k: 'R', label: 'Reconnaître', tone: 'violet', txt: 'Vous avez raison : un retard de 10 jours n’est pas acceptable, et je comprends la gêne pour l’installation de votre équipe.' },
  { k: 'S', label: 'Solution', tone: 'green', txt: 'Le mobilier est désormais en stock. Nous vous proposons une livraison et un montage ce vendredi 15, sans frais.' },
  { k: 'S', label: 'Suite', tone: 'teal', txt: 'Je vous appelle jeudi pour confirmer le créneau. Vous pouvez me joindre directement d’ici là.' },
];

const M3_Reclamation: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Répondre à une réclamation : la méthode A · R · S · S</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 700 }}>
      <Eyebrow c={C.coral} size={19} style={{ marginBottom: 12 }}>
        Le message reçu
      </Eyebrow>
      <div style={{ background: T.coral.bg, borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T.coral.bd}`, padding: '18px 24px', fontSize: 22, lineHeight: 1.5, color: C.ink, fontStyle: 'italic' }}>
        « Commande 7710 : on m’avait promis les bureaux pour le 1er, nous sommes le 11 et toujours rien. Mon équipe travaille sur des tables pliantes. C’est inadmissible. J’attends une réponse rapide. »
        <div style={{ marginTop: 8, fontStyle: 'normal', fontSize: 19, color: C.muted }}>M. Lambert, client</div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M3_ARSS.map((s, i) => (
          <div key={s.label} className={b.left(i + 1)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Num n={s.k} tone={s.tone} size={46} />
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: STRONG[s.tone] }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 880, top: 190, width: 920, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Le projet de réponse (après relecture)
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M3_ARSS.map((s, i) => (
          <div key={s.label} className={b.fade(i + 1)} style={{ fontSize: 23, lineHeight: 1.5, color: C.ink, paddingLeft: 16, borderLeft: `5px solid ${STRONG[s.tone]}` }}>
            {s.txt}
          </div>
        ))}
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 880, top: 790, width: 920 }}>
      <Callout title="Dans le prompt, précisez" tone="coral" icon="shield" size={22}>
        ce que vous pouvez proposer (livraison, geste) et ce qui est exclu. <strong>L’IA ne promet jamais ce que l’entreprise n’a pas décidé.</strong>
      </Callout>
    </div>
  </Frame>
);

// ─── Relancer un client (onglets) ───────────────────────────────────────────
const M3Relance = ({ day, tone, ton, obj, txt }: { day: string; tone: Tone; ton: string; obj: string; txt: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 28 }}>
    <div style={{ background: T[tone].bg, borderRadius: 18, padding: '22px 26px' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: STRONG[tone], lineHeight: 1 }}>{day}</div>
      <div style={{ marginTop: 12, fontSize: 24, fontWeight: 600, color: C.ink }}>{ton}</div>
    </div>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>
      <strong>Objet : {obj}</strong>
      <div style={{ marginTop: 10 }}>{txt}</div>
    </div>
  </div>
);

const M3_Relance: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Relancer un client : trois relances, trois tons</Title>
    <Lede>Facture F-2025-118 de 4 800 € TTC, échue le 30/09. Un seul modèle, un paramètre : [NIVEAU].</Lede>
    <Tabs initial="r1" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="r1" tone="green" icon="bell">
          Relance 1 · J + 7
        </TabBtn>
        <TabBtn id="r2" tone="yellow" icon="bell">
          Relance 2 · J + 15
        </TabBtn>
        <TabBtn id="r3" tone="coral" icon="alert">
          Relance 3 · J + 30
        </TabBtn>
      </div>
      <TabPane id="r1">
        <M3Relance day="J + 7" tone="green" ton="Courtoise : on suppose un simple oubli" obj="Facture F-2025-118 – petit rappel" txt="Bonjour Monsieur Dupré, sauf erreur de notre part, la facture F-2025-118 de 4 800 € TTC, échue le 30 septembre, ne nous est pas encore parvenue. Il s’agit sans doute d’un oubli : vous la trouverez à nouveau en pièce jointe. Bien cordialement," />
      </TabPane>
      <TabPane id="r2">
        <M3Relance day="J + 15" tone="yellow" ton="Ferme : on demande une date" obj="Facture F-2025-118 – second rappel" txt="Monsieur Dupré, malgré notre rappel du 7 octobre, la facture F-2025-118 de 4 800 € TTC reste impayée. Nous vous remercions de procéder au règlement sous 8 jours ou de nous indiquer la date prévue. En cas de difficulté, contactez-moi pour en parler." />
      </TabPane>
      <TabPane id="r3">
        <M3Relance day="J + 30" tone="coral" ton="Formelle : on annonce la suite" obj="Facture F-2025-118 – dernier rappel avant recouvrement" txt="Monsieur, en l’absence de règlement de la facture F-2025-118 (4 800 € TTC) malgré nos relances des 7 et 15 octobre, nous vous informons que le dossier sera transmis à notre service recouvrement le 10 novembre. Nous restons disposés à convenir d’un échéancier." />
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
      <Callout title="À valider avant l’envoi" tone="yellow" icon="alert" size={23}>
        Les montants, dates et numéros viennent de votre logiciel, pas de l’IA. La relance 3 évoque une suite : <strong>elle doit être validée par votre responsable</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Rédiger une note interne ───────────────────────────────────────────────
const M3_Note: Page = () => {
  const [ok, setOk] = useState(false);
  return (
    <Frame mod={3} kind="demo">
      <Title>Rédiger une note interne qu’on lit vraiment</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={ok} onChange={setOk} tone="green" size={28} label={<strong>« Structure cette note : objet, ce qui change, pour qui, quand, que faire, contact »</strong>} />
      </div>
      <div key={ok ? 'o' : 'k'} className={A.fade} style={{ position: 'absolute', left: 120, top: 280, width: 1200, animationDuration: '400ms' } as CSSProperties}>
        {ok ? (
          <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Notes de frais : une application dès le 1er décembre</div>
            {[
              ['Ce qui change', 'Fini les formulaires papier : les notes de frais se saisissent sur l’application Fraizy.'],
              ['Pour qui', 'Tous les salariés qui engagent des frais professionnels.'],
              ['Quand', 'À partir du 1er décembre. Les notes de novembre restent sur papier.'],
              ['Que faire', 'Installer l’application, photographier chaque justificatif, valider avant le 5 du mois.'],
              ['Contact', 'Service comptabilité, poste 214.'],
            ].map(([h, v]) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18, fontSize: 23, lineHeight: 1.45 }}>
                <span style={{ fontWeight: 700, color: C.green }}>{h}</span>
                <span style={{ color: C.ink }}>{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: T.grey.bg, borderRadius: 20, boxShadow: `inset 0 0 0 2px ${T.grey.bd}`, padding: '26px 32px', fontSize: 23, lineHeight: 1.6, color: C.soft, fontStyle: 'italic' }}>
            « Bon alors pour les notes de frais la compta a dit qu’à partir de décembre faudrait passer par l’appli Fraizy, plus de papier, sauf pour novembre qui reste comme avant je crois, et il faut prendre les justificatifs en photo, et valider avant le 5, ça concerne tout le monde qui a des frais, si question voir la compta poste 214… »
            <div style={{ marginTop: 10, fontStyle: 'normal', fontSize: 19, color: C.muted }}>Notes prises au téléphone par Nadia</div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1380, top: 280, width: 420, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="blue" icon="eye" title="Lue en 20 secondes" size={21} cls={A.right}>
          Titre informatif, une info par ligne, l’action à faire bien visible.
        </Card>
        <Card tone="yellow" icon="alert" title="« je crois »" size={21} cls={A.right} style={dl(150)}>
          Une info incertaine dans les notes reste incertaine : vérifiez-la auprès de la compta avant diffusion.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Traduire et adapter ────────────────────────────────────────────────────
const M3Adapt = ({ n, fr: f, en, why }: { n: number; fr: string; en: string; why: string }) => (
  <div className={b.on(n)} style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 1fr', gap: 16, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <span style={{ fontSize: 22, color: C.soft, fontStyle: 'italic' }}>{f}</span>
    <Icon name="arrow" size={26} color={C.faint} />
    <span style={{ fontSize: 22, fontWeight: 600, color: C.navy }}>{en}</span>
    <span style={{ fontSize: 19, color: C.muted }}>{why}</span>
  </div>
);

const M3_Traduire: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Traduire… et adapter le message</Title>
    <Lede>« Traduis cet email en anglais professionnel pour un fournisseur britannique. Adapte les formules et les formats, signale-moi ce que tu as adapté. »</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'grid', gridTemplateColumns: '1fr 40px 1fr 1fr', gap: 16, padding: '0 20px', boxSizing: 'border-box' }}>
      <Eyebrow c={C.muted} size={17}>
        Français
      </Eyebrow>
      <span />
      <Eyebrow c={C.muted} size={17}>
        Anglais adapté
      </Eyebrow>
      <Eyebrow c={C.muted} size={17}>
        Pourquoi
      </Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 340, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Adapt n={1} fr="Madame, Monsieur," en="Dear Mr Hall," why="On s’adresse à une personne nommée" />
      <M3Adapt n={2} fr="livraison le 03/11" en="delivery on 3 November" why="03/11 se lit « 11 mars » aux États-Unis : date en toutes lettres" />
      <M3Adapt n={3} fr="1 250,50 € HT" en="€1,250.50 excl. VAT" why="Virgule et point inversés, « HT » se dit « excl. VAT »" />
      <M3Adapt n={4} fr="Veuillez agréer, Monsieur, l’expression de…" en="Kind regards," why="Les formules longues n’existent pas en anglais" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
      <Callout title="Le bon réflexe" tone="blue" icon="globe" size={23}>
        Pour un message important, demandez une <strong>retraduction vers le français</strong> : si le sens a dérivé, vous le verrez tout de suite.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M3 ────────────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz : emails et courriers</Title>
    <QuizSeries y={220}>
      <QuizQ q="Que faut-il absolument préciser pour faire reformuler un message ?" explain="Sans cette consigne, l’IA peut ajouter une excuse, une promesse ou un détail qui n’existait pas. Une reformulation change la forme, pas le fond.">
        <QOpt>La police de caractères</QOpt>
        <QOpt ok>« Garde tous les faits, n’ajoute rien »</QOpt>
        <QOpt>Le nombre de paragraphes</QOpt>
      </QuizQ>
      <QuizQ q="Dans la méthode A·R·S·S, que signifie le R ?" explain="Accuser réception, Reconnaître le problème (sans forcément reconnaître une faute juridique), proposer une Solution, annoncer la Suite.">
        <QOpt>Rembourser</QOpt>
        <QOpt ok>Reconnaître le problème du client</QOpt>
        <QOpt>Relancer</QOpt>
      </QuizQ>
      <QuizQ q="L’IA propose dans une réponse « un avoir de 20 % ». Personne ne l’a décidé. Que faire ?" explain="Un engagement commercial se décide par l’entreprise, pas par l’IA. On retire la phrase et on précise dans le prompt ce qui peut ou non être proposé.">
        <QOpt>L’envoyer, le client sera content</QOpt>
        <QOpt ok>Retirer la phrase et cadrer le prompt</QOpt>
        <QOpt>Passer l’avoir à 10 % pour limiter</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi écrire « 3 November » plutôt que « 03/11 » à un interlocuteur américain ?" explain="Aux États-Unis, la date s’écrit mois/jour : 03/11 se lit « 11 mars ». Le mois en toutes lettres évite toute ambiguïté.">
        <QOpt>C’est plus élégant</QOpt>
        <QOpt ok>03/11 peut se lire « 11 mars »</QOpt>
        <QOpt>Les chiffres ne se traduisent pas</QOpt>
      </QuizQ>
      <QuizQ q="Une relance à J + 30 annonce une transmission au recouvrement. Qui valide ?" explain="Annoncer une suite contentieuse engage l’entreprise : la décision et la validation reviennent au responsable, l’IA ne fait que rédiger.">
        <QOpt>Personne, c’est un modèle</QOpt>
        <QOpt>L’IA, qui a fait le calcul des jours</QOpt>
        <QOpt ok>Votre responsable</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M3Sit = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={34} />
    <div style={{ fontSize: 21, lineHeight: 1.4 }}>
      <strong style={{ color: C.ink }}>{title}</strong> · {children}
    </div>
  </div>
);

const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Quatre situations réelles à traiter"
    defi="courrier"
    who="En binôme, une situation chacun puis échange"
    minutes={25}
    where={
      <>
        Pour chaque situation : <strong>le prompt</strong> utilisé, <strong>le texte final</strong> relu, et la liste de ce que vous avez <strong>corrigé</strong>.
      </>
    }
    objective={
      <>
        Produire plusieurs communications professionnelles <strong>prêtes à envoyer</strong> à partir de situations du bureau des Ateliers Morel.
      </>
    }
    crit={
      <>
        <CheckItem id="a3-c1" size={21}>Le ton est adapté au destinataire</CheckItem>
        <CheckItem id="a3-c2" size={21}>Aucun fait inventé, aucune promesse</CheckItem>
        <CheckItem id="a3-c3" size={21}>L’action attendue est claire</CheckItem>
        <CheckItem id="a3-c4" size={21}>Prompt rangé dans la bibliothèque</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Sit n={1} tone="coral" title="Réclamation">
        une cliente reçoit des chaises de la mauvaise couleur, 2e erreur en un an.
      </M3Sit>
      <M3Sit n={2} tone="yellow" title="Relance">
        un devis de 12 000 € envoyé il y a 3 semaines, sans réponse.
      </M3Sit>
      <M3Sit n={3} tone="navy" title="Note interne">
        l’accueil fermera à 16 h tous les vendredis à partir de janvier.
      </M3Sit>
      <M3Sit n={4} tone="pink" title="Traduction">
        invitation d’un partenaire espagnol au salon de Lyon, en anglais.
      </M3Sit>
    </div>
    <Bonus>Faites réécrire la réclamation pour un client VIP, puis comparez les deux versions.</Bonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M3_Section, M3_Email, M3_Ton, M3_Reclamation, M3_Relance, M3_Note, M3_Traduire, M3_Quiz, M3_Atelier];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 3 · 11:30

OBJECTIF — Annoncer le module le plus attendu (souvent le plus voté au sondage).

DIRE — « Module 3 : les emails et courriers. Ce matin, beaucoup d’entre vous ont voté pour les emails comme tâche la plus chronophage. On va voir comment rédiger, reformuler, adapter le ton, répondre à une réclamation, relancer, rédiger une note interne et traduire. Toujours avec la même règle : l’IA écrit le premier jet, c’est vous qui envoyez. »

TRANSITION — « Commençons par un email simple. »`,
  `⏱ 4 min · RÉDIGER UN EMAIL (5 clics)

OBJECTIF — Montrer ce que produit une demande bien construite et l’anatomie d’un bon email.

DIRE — « À gauche, la demande de Nadia : rôle, contexte précis avec le code d’erreur, destinataire, échéance, numéro de contrat, ton, longueur. À droite, le résultat. » Un clic par partie : « Un objet clair qu’on retrouve facilement dans une boîte mail. Une formule d’appel. Le contexte en une phrase. L’action attendue avec l’échéance : c’est le cœur. La formule de politesse. »

INSISTER — L’encadré du bas : le téléphone est ici fictif, et en vrai c’est à vous de vérifier chaque information et d’ajouter la signature.

TRANSITION — « Et quand on a déjà le texte, mais pas le bon ton ? »`,
  `⏱ 4 min · ADAPTER LE TON (curseur)

OBJECTIF — Montrer qu’un même fait peut se dire de quatre façons, selon le destinataire.

DIRE — « Un seul fait : la livraison aura cinq jours de retard. » Faire glisser le curseur. « Familier pour une collègue proche. Cordial pour un client habituel. Formel pour un courrier officiel. Empathique pour un client déjà mécontent. Remarquez que dans la version empathique, l’IA ajoute “je vous appelle demain” : c’est un engagement. Si vous ne pouvez pas le tenir, vous le retirez. »

INSISTER — La consigne « garde tous les faits, n’ajoute rien » protège contre les promesses inventées.

TRANSITION — « Le cas le plus délicat : la réclamation. »`,
  `⏱ 5 min · RÉCLAMATION A-R-S-S (5 clics)

OBJECTIF — Donner une méthode simple pour répondre à un client mécontent.

DIRE — « M. Lambert est en colère, et il a de bonnes raisons. Méthode A-R-S-S. » Un clic par étape : « Accuser réception : je le remercie, je cite sa commande. Reconnaître : je montre que j’ai compris la gêne, sans me justifier. Solution : quelque chose de concret, avec une date. Suite : je dis ce qui va se passer et comment me joindre. » Dernier clic : « Dans le prompt, précisez ce que vous avez le droit de proposer. Ici, la livraison gratuite vendredi a été décidée par le responsable. L’IA ne doit jamais promettre ce que l’entreprise n’a pas décidé. »

ANIMATION — Demander au groupe : « Qu’auriez-vous écrit spontanément ? » Souvent, on commence par se justifier : la méthode évite ce piège.

TRANSITION — « Autre tâche répétitive : les relances. »`,
  `⏱ 4 min · RELANCER UN CLIENT (onglets)

OBJECTIF — Montrer la gradation des relances et l’intérêt d’un modèle paramétré.

DIRE — « Une facture impayée. Trois relances, trois tons. » Cliquer chaque onglet. « À J + 7, on suppose un oubli. À J + 15, on est ferme et on demande une date, tout en ouvrant la porte au dialogue. À J + 30, on annonce la suite. Un seul modèle de prompt suffit, avec un paramètre : le niveau de relance. »

INSISTER — Les montants et dates viennent du logiciel de facturation, pas de l’IA. La troisième relance engage l’entreprise : validation par le responsable.

TRANSITION — « Passons à la communication interne. »`,
  `⏱ 3 min · NOTE INTERNE (interrupteur)

OBJECTIF — Transformer des notes en vrac en note interne claire.

DIRE — « Voici ce que Nadia a noté au téléphone avec la comptabilité. Tout y est, mais personne ne lira ça. » Basculer l’interrupteur. « Avec une consigne de structure : objet, ce qui change, pour qui, quand, que faire, contact. Lue en vingt secondes. »

INSISTER — Le « je crois » des notes : l’IA l’a transformé en affirmation. Une information incertaine doit être vérifiée avant diffusion, sinon l’IA la rend officielle.

TRANSITION — « Dernier usage : traduire. »`,
  `⏱ 3 min · TRADUIRE ET ADAPTER (4 clics)

OBJECTIF — Montrer que traduire, c’est aussi adapter les usages.

DIRE — « La demande ne dit pas seulement “traduis” : elle dit pour qui, et demande de signaler les adaptations. » Un clic par ligne : « La formule d’appel nominative. La date : 03/11 se lit 11 mars aux États-Unis, donc on l’écrit en toutes lettres. Les nombres : virgule et point s’inversent, et HT devient excl. VAT. La formule de politesse : courte en anglais. »

INSISTER — Astuce de la retraduction vers le français pour contrôler le sens d’un message important.

TRANSITION — « Petit quiz avant l’atelier. »`,
  `⏱ 4 min · QUIZ M3 (5 questions)

OBJECTIF — Valider les réflexes de rédaction.

DIRE — « Cinq questions. Votez, je clique. »

ANIMATION — Lire chaque explication. Insister sur la question 3 (l’avoir inventé) : c’est le risque principal des réponses aux clients.

TRANSITION — « À vous d’écrire. »`,
  `⏱ 25 min · ATELIER 3 (minuteur)

OBJECTIF — Produire plusieurs communications professionnelles à partir de situations réalistes.

DIRE — « Quatre situations. En binôme, chacun en traite au moins deux, puis vous échangez pour relire le travail de l’autre. Pour chaque situation, gardez le prompt, le texte final et ce que vous avez corrigé. Ce dernier point est le plus important : il montre ce que l’IA ne sait pas faire seule. »

ANIMATION — Lancer le minuteur. Passer dans les rangs : vérifier l’absence de promesses inventées dans les réclamations et le bon ton des relances. Faire lire à voix haute une réclamation et une relance en fin d’atelier. Les participants qui ont leurs propres situations réelles peuvent les utiliser, à condition d’anonymiser.

TRANSITION — « Bravo, la matinée est terminée. Bon déjeuner ! On reprend à 13 h 30 avec les documents et comptes rendus. »`,
];
// @@NOTES-END
