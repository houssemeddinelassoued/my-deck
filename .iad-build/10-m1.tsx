// ─── Module 1 · Découvrir l’IA dans les métiers administratifs ──────────────
const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        Découvrir l’IA dans
        <br />
        les métiers administratifs
      </>
    }
    sub="Ce que l’IA générative apporte vraiment à un assistant, ce qu’elle ne sait pas faire, et comment choisir son outil."
    dur="9:20 – 10:15 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · identifier 5 tâches
      </Tag>
    }
  >
    <SecItem n={1}>Ce que l’IA peut apporter à un assistant</SecItem>
    <SecItem n={2}>Les tâches adaptées… et les autres</SecItem>
    <SecItem n={3}>Les limites à connaître</SecItem>
    <SecItem n={4}>Choisir le bon outil, adopter les bons réflexes</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── L’IA générative, c’est quoi ? ──────────────────────────────────────────
const M1_NEXT = [
  { w: 'réception', p: 91, tone: 'violet' as Tone },
  { w: 'note', p: 5, tone: 'grey' as Tone },
  { w: 'suite', p: 3, tone: 'grey' as Tone },
  { w: 'humeur', p: 1, tone: 'grey' as Tone },
];

const M1_Quoi: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>L’IA générative, en une image</Title>
    <Lede>Un modèle qui a lu des milliards de textes et qui prédit, mot après mot, la suite la plus probable.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(150) }}>
      <Eyebrow c={C.navy} size={19}>
        Ce que fait l’IA quand elle écrit
      </Eyebrow>
      <div style={{ marginTop: 18, fontSize: 34, lineHeight: 1.4, color: C.ink }}>
        « Madame, nous accusons bonne <span style={{ display: 'inline-block', minWidth: 170, borderBottom: `4px dashed ${C.violet}`, color: C.violet, fontWeight: 700 }}><span className={b.fade(1)}>réception</span></span> de votre courrier… »
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M1_NEXT.map((n, i) => (
          <div key={n.w} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 150, fontFamily: mono, fontSize: 22, color: i === 0 ? C.violet : C.muted, fontWeight: i === 0 ? 700 : 400 }}>{n.w}</span>
            <div style={{ flex: 1, height: 22, background: C.panel, borderRadius: 11, overflow: 'hidden' }}>
              <div className={A.grow} style={{ height: '100%', width: `${n.p}%`, borderRadius: 11, background: STRONG[n.tone], ...dl(400 + i * 120) }} />
            </div>
            <span style={{ width: 70, textAlign: 'right', fontFamily: mono, fontSize: 21, color: C.muted }}>{n.p} %</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontSize: 20, color: C.faint }}>Probabilités illustratives</div>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="book" title="Il a énormément lu" cls={b.on(1)} size={23}>
        Courriers, procédures, articles : il connaît les formules et les usages de l’écrit professionnel.
      </Card>
      <Card tone="coral" icon="eyeOff" title="Il ne connaît pas votre bureau" cls={b.on(2)} size={23}>
        Vos clients, vos tarifs, vos procédures : il ne sait que ce que vous lui donnez.
      </Card>
      <Card tone="green" icon="bulb" title="Il écrit vite, pas forcément juste" cls={b.on(3)} size={23}>
        Une réponse fluide n’est pas une réponse vraie. D’où le réflexe : je relis.
      </Card>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 860, width: 900, fontSize: 25, color: C.soft, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="user" size={30} color={C.violet} />
      <span>Imaginez <strong style={{ color: C.navy }}>un stagiaire brillant et très rapide</strong>, à qui il faut tout expliquer.</span>
    </div>
  </Frame>
);

// ─── Ce que l’IA apporte (flip cards) ───────────────────────────────────────
const M1Cap = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode }) => (
  <FlipCard
    w={536}
    h={300}
    tone={tone}
    backTone={tone}
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
        <Eyebrow c={T[tone].fg} size={18}>
          Exemple de demande
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.45, color: C.ink, fontStyle: 'italic' }}>{ex}</div>
      </>
    }
  />
);

const M1_Apports: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Ce que l’IA peut apporter à un assistant</Title>
    <Lede>Six super-pouvoirs du quotidien. Cliquez une carte pour voir une demande type.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, rowGap: 32 }}>
      <M1Cap icon="pen" tone="blue" title="Rédiger" desc="Un premier jet d’email, de courrier, de note en quelques secondes." ex="« Rédige un email pour confirmer à M. Lambert son rendez-vous du jeudi 14 à 10 h avec M. Garnier. Ton cordial, 5 lignes. »" />
      <M1Cap icon="loop" tone="violet" title="Reformuler" desc="Plus clair, plus court, plus diplomate : le même message, en mieux." ex="« Reformule ce message pour qu’il soit ferme mais courtois, sans reproche : [texte]. »" />
      <M1Cap icon="doc" tone="teal" title="Résumer" desc="Un document de 20 pages ramené à l’essentiel, pour le bon lecteur." ex="« Résume ce rapport en 5 points pour mon directeur, qui a 2 minutes pour le lire. »" />
      <M1Cap icon="layers" tone="green" title="Structurer" desc="Des notes en vrac transformées en compte rendu, plan ou procédure." ex="« Transforme ces notes en compte rendu : décisions, actions, responsables, échéances. »" />
      <M1Cap icon="search" tone="yellow" title="Extraire" desc="Retrouver une date, un montant, une clause dans un long document." ex="« Dans ce contrat, liste la durée, le préavis de résiliation et les pénalités. »" />
      <M1Cap icon="globe" tone="pink" title="Traduire" desc="Traduire et adapter un message pour un interlocuteur étranger." ex="« Traduis cet email en anglais professionnel, en adaptant les formules de politesse. »" />
    </div>
  </Frame>
);

// ─── Simulateur de gain de temps ────────────────────────────────────────────
const M1Slider = ({ label, hint, v, set, min, max, step = 1, unit, tone }: { label: string; hint: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: STRONG[tone] }}>
        {v} {unit}
      </span>
    </div>
    <div style={{ fontSize: 19, color: C.muted, marginBottom: 10 }}>{hint}</div>
    <Range value={v} onChange={set} min={min} max={max} step={step} w={900} tone={tone} />
  </div>
);

const M1_Gain: Page = () => {
  const [mails, setMails] = useState(40);
  const [docs, setDocs] = useState(4);
  const [share, setShare] = useState(50);
  const minutes = (mails * 8 + docs * 45) * (share / 100);
  const hWeek = minutes / 60;
  const days = (hWeek * 45) / 7;
  return (
    <Frame mod={1} kind="simu">
      <Title>Simulateur : combien de temps pourriez-vous gagner ?</Title>
      <Lede>Réglez les curseurs sur votre propre semaine. Hypothèses : 8 min par email, 45 min par document.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <M1Slider label="Emails rédigés par semaine" hint="réponses, relances, confirmations…" v={mails} set={setMails} min={0} max={150} step={5} unit="" tone="teal" />
        <M1Slider label="Documents produits par semaine" hint="comptes rendus, notes, synthèses, procédures" v={docs} set={setDocs} min={0} max={20} unit="" tone="blue" />
        <M1Slider label="Part du temps économisée avec l’IA" hint="prudent : 30 % · réaliste : 50 % · relecture comprise" v={share} set={setShare} min={10} max={70} step={5} unit="%" tone="violet" />
      </div>
      <div style={{ position: 'absolute', left: 1160, top: 280, width: 640, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div className={A.right} style={{ background: G.navy, borderRadius: 20, padding: '28px 34px', color: '#fff', ...dl(200) }}>
          <Eyebrow c="#AEB9E6" size={19}>
            Temps libéré par semaine
          </Eyebrow>
          <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 110, lineHeight: 1 }}>
            {fr(hWeek, 1)}
            <span style={{ fontSize: 50 }}> h</span>
          </div>
        </div>
        <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 34px', ...dl(300) }}>
          <Eyebrow c={C.navy} size={19}>
            Sur une année (45 semaines)
          </Eyebrow>
          <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 64, lineHeight: 1, color: C.green }}>
            ≈ {fr(days, 0)} <span style={{ fontSize: 34 }}>journées de 7 h</span>
          </div>
        </div>
        <Callout title="Honnêtement" tone="blue" icon="scale" size={22} cls={A.right} style={dl(400)}>
          Le gain réel dépend du temps de relecture. Un mauvais prompt, ou un résultat non vérifié, fait perdre plus de temps qu’il n’en fait gagner.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Exercice : tâches adaptées ou non (drag) ───────────────────────────────
const M1Zone = ({ x, tone, icon, title, sub, sol }: { x: number; tone: Tone; icon: IconName; title: string; sub: string; sol: string }) => (
  <div style={{ position: 'absolute', left: x, top: 420, width: 548, height: 520, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={30} color={STRONG[tone]} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ fontSize: 19, color: T[tone].fg, marginTop: 2 }}>{sub}</div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>
      <Icon name="checkCircle" size={26} color={STRONG[tone]} /> {sol}
    </div>
  </div>
);

const M1Chip = ({ n, x, y, children }: { n: number; x: number; y: number; children: ReactNode }) => (
  <Drag x={x} y={y} w={548} tone="navy" size={21}>
    <Num n={n} tone="navy" size={32} />
    <span>{children}</span>
  </Drag>
);

const M1_Tri: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title size={46}>Exercice : l’IA, oui, avec prudence, ou non ?</Title>
    <M1Zone x={120} tone="green" icon="checkCircle" title="Idéal pour l’IA" sub="texte, répétitif, facile à relire" sol="Solution : 1 · 4 · 7" />
    <M1Zone x={686} tone="yellow" icon="alert" title="Oui, avec vigilance" sub="chiffres, faits, enjeu pour un client" sol="Solution : 2 · 5 · 8" />
    <M1Zone x={1252} tone="coral" icon="x" title="À éviter" sub="données sensibles, décision engageante" sol="Solution : 3 · 6 · 9" />
    <M1Chip n={1} x={120} y={190}>Reformuler un email trop sec</M1Chip>
    <M1Chip n={2} x={686} y={190}>Résumer un contrat fournisseur</M1Chip>
    <M1Chip n={3} x={1252} y={190}>Coller le dossier médical d’un salarié</M1Chip>
    <M1Chip n={4} x={120} y={258}>Préparer l’ordre du jour d’une réunion</M1Chip>
    <M1Chip n={5} x={686} y={258}>Calculer le total des notes de frais</M1Chip>
    <M1Chip n={6} x={1252} y={258}>Décider seule d’accorder un avoir de 2 000 €</M1Chip>
    <M1Chip n={7} x={120} y={326}>Traduire une invitation en anglais</M1Chip>
    <M1Chip n={8} x={686} y={326}>Rédiger une réponse à une réclamation</M1Chip>
    <M1Chip n={9} x={1252} y={326}>Envoyer la paie d’un collègue pour vérification</M1Chip>
    <Hint style={{ position: 'absolute', left: 120, top: 952 }}>Glissez chaque étiquette dans une colonne · double-clic pour la remettre en place · → pour la solution.</Hint>
  </Frame>
);

// ─── Les limites de l’IA ────────────────────────────────────────────────────
const M1Lim = ({ icon, tone, title, children, n }: { icon: IconName; tone: Tone; title: string; children: ReactNode; n: number }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Les limites de l’IA : ce qu’il faut savoir</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 900, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="user" cls={A.in} w={700} size={24}>
        Quel est le délai légal pour répondre à une réclamation client ?
      </Bubble>
      <Bubble who="agent" name="Assistant IA" cls={A.in} w={760} size={24} style={dl(400)}>
        Selon l’article L. 218-4 du Code de la consommation, vous disposez de <strong>15 jours ouvrés</strong> pour répondre à toute réclamation écrite d’un client.
      </Bubble>
      <div className={b.pop(1)} style={{ marginLeft: 68, display: 'flex', alignItems: 'center', gap: 14, background: T.coral.bg, borderRadius: 14, padding: '14px 20px', boxShadow: `inset 0 0 0 2px ${T.coral.bd}` }}>
        <Icon name="alert" size={34} color={C.coral} />
        <span style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>
          <strong style={{ color: T.coral.fg }}>Réponse inventée.</strong> Ton assuré, article cité… mais cette règle générale n’existe pas sous cette forme. C’est une <strong>hallucination</strong>.
        </span>
      </div>
      <div className={b.fade(1)} style={{ marginLeft: 68, fontSize: 21, color: C.muted }}>
        Exemple fictif construit pour la formation : vérifiez toujours une référence juridique à la source.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 200, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Lim n={1} icon="alert" tone="coral" title="Elle peut inventer">
        Faits, chiffres, références : avec aplomb.
      </M1Lim>
      <M1Lim n={2} icon="clock" tone="yellow" title="Ses connaissances ont une date">
        Lois, tarifs, actualités récentes : à vérifier.
      </M1Lim>
      <M1Lim n={3} icon="gauge" tone="blue" title="Elle calcule mal">
        Totaux et pourcentages : laissez le tableur compter.
      </M1Lim>
      <M1Lim n={4} icon="eyeOff" tone="violet" title="Elle ignore votre contexte">
        Sans consignes, elle répond « en général ».
      </M1Lim>
      <M1Lim n={5} icon="lock" tone="navy" title="Ce que vous collez peut sortir">
        Selon l’outil, vos textes peuvent être conservés.
      </M1Lim>
    </div>
  </Frame>
);

// ─── Choisir le bon outil ───────────────────────────────────────────────────
const M1Tool = ({ who, where, plus, watch }: { who: string; where: string; plus: ReactNode; watch: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 30px' }}>
      <PanelTitle icon="org">Éditeur et environnement</PanelTitle>
      <div style={{ fontSize: 25, lineHeight: 1.45, color: C.ink }}>{who}</div>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{where}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Callout title="Points forts" tone="green" icon="star" size={23}>
        {plus}
      </Callout>
      <Callout title="Points d’attention" tone="yellow" icon="alert" size={23}>
        {watch}
      </Callout>
    </div>
  </div>
);

const M1_Outils: Page = () => (
  <Frame mod={1}>
    <Title>Choisir le bon outil</Title>
    <Lede>Le meilleur outil est souvent celui que votre organisation fournit déjà : il est intégré et encadré.</Lede>
    <Tabs initial="copilot" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
        <TabBtn id="copilot" tone="blue" icon="chat">
          Microsoft Copilot
        </TabBtn>
        <TabBtn id="gemini" tone="violet" icon="chat">
          Gemini
        </TabBtn>
        <TabBtn id="chatgpt" tone="green" icon="chat">
          ChatGPT
        </TabBtn>
        <TabBtn id="lechat" tone="yellow" icon="chat">
          Le Chat
        </TabBtn>
      </div>
      <TabPane id="copilot">
        <M1Tool
          who="Microsoft. Disponible dans le navigateur et, selon la licence, dans Outlook, Word, Excel, PowerPoint et Teams."
          where="Pertinent si votre bureau travaille déjà sous Microsoft 365."
          plus="Travaille directement dans vos documents et emails ; compte professionnel souvent déjà géré par l’entreprise."
          watch="Les fonctions intégrées aux applications dépendent de la licence souscrite : vérifiez ce qui est activé chez vous."
        />
      </TabPane>
      <TabPane id="gemini">
        <M1Tool
          who="Google. Disponible dans le navigateur et, selon l’abonnement, dans Gmail, Docs, Sheets et Agenda."
          where="Pertinent si votre bureau travaille sous Google Workspace."
          plus="Intégration naturelle à la messagerie et aux documents Google."
          watch="Comme pour tout outil : utilisez le compte professionnel, pas un compte personnel."
        />
      </TabPane>
      <TabPane id="chatgpt">
        <M1Tool
          who="OpenAI. Application web, mobile et de bureau, avec des offres pour les entreprises."
          where="L’outil le plus connu, très polyvalent pour rédiger, résumer, analyser."
          plus="Très à l’aise pour la rédaction et la reformulation ; peut analyser des fichiers joints."
          watch="Une version gratuite ou personnelle n’offre pas les mêmes garanties qu’une offre entreprise sur les données."
        />
      </TabPane>
      <TabPane id="lechat">
        <M1Tool
          who="Mistral AI, entreprise française. Application web et mobile, avec des offres pour les entreprises."
          where="Pertinent pour qui privilégie un acteur européen."
          plus="Bon niveau en français ; acteur soumis au droit européen."
          watch="Mêmes règles qu’ailleurs : compte professionnel et aucune donnée sensible."
        />
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', gap: 16, alignItems: 'center', fontSize: 23, color: C.soft, ...dl(500) }}>
      <Icon name="checkCircle" size={28} color={C.green} />
      <span>
        Trois questions pour choisir : <strong style={{ color: C.navy }}>Est-ce autorisé chez nous ?</strong> · <strong style={{ color: C.navy }}>Est-ce intégré à mes outils ?</strong> · <strong style={{ color: C.navy }}>Où vont mes données ?</strong>
      </span>
    </div>
  </Frame>
);

// ─── Bonnes pratiques ───────────────────────────────────────────────────────
const M1Rule = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px' }}>
    <Num n={n} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Pratiques: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Six réflexes pour bien démarrer</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M1Rule n={1} tone="blue" title="Expliquez comme à un nouveau collègue">
        Qui, quoi, pour qui, pourquoi : le contexte fait la qualité.
      </M1Rule>
      <M1Rule n={2} tone="violet" title="Une demande, un objectif">
        Mieux vaut trois demandes simples qu’une demande fourre-tout.
      </M1Rule>
      <M1Rule n={3} tone="teal" title="Dialoguez, ne vous contentez pas du premier jet">
        « Plus court », « plus formel », « ajoute une date » : on affine.
      </M1Rule>
      <M1Rule n={4} tone="green" title="Relisez tout, vérifiez les faits">
        Noms, dates, montants, références : vous signez, vous vérifiez.
      </M1Rule>
      <M1Rule n={5} tone="coral" title="Anonymisez avant de coller">
        Pas de nom, d’adresse, de numéro ou de donnée sensible réelle.
      </M1Rule>
      <M1Rule n={6} tone="yellow" title="Gardez ce qui marche">
        Un bon prompt se copie dans votre bibliothèque et se réutilise.
      </M1Rule>
    </div>
    <div className={b.fade(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Quote by="Le fil conducteur de la journée">L’IA prépare, vous vérifiez, vous signez.</Quote>
    </div>
  </Frame>
);

// ─── Quiz M1 ────────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz : vrai ou faux ?</Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA connaît les tarifs et les procédures de mon entreprise. »" explain="Elle ne sait que ce que vous lui donnez dans la conversation (texte collé, document joint). Sinon, elle invente une réponse plausible.">
        <QOpt>Vrai, elle a tout lu sur Internet</QOpt>
        <QOpt ok>Faux, sauf si je les lui fournis</QOpt>
        <QOpt>Vrai, si mon entreprise a un site web</QOpt>
      </QuizQ>
      <QuizQ q="« Une réponse bien écrite et sûre d’elle est forcément juste. »" explain="C’est le piège principal : l’IA peut inventer avec aplomb (hallucination). Plus l’enjeu est fort, plus on vérifie à la source.">
        <QOpt>Vrai</QOpt>
        <QOpt ok>Faux : le ton ne garantit rien</QOpt>
        <QOpt>Vrai, avec les modèles récents</QOpt>
      </QuizQ>
      <QuizQ q="Pour additionner 200 lignes de notes de frais, le mieux est…" explain="L’IA prédit du texte : elle peut se tromper sur un calcul. Elle peut en revanche vous écrire la formule à utiliser dans le tableur.">
        <QOpt>de demander le total à l’IA</QOpt>
        <QOpt ok>d’utiliser une formule du tableur (que l’IA peut m’aider à écrire)</QOpt>
        <QOpt>de demander deux fois à l’IA et de comparer</QOpt>
      </QuizQ>
      <QuizQ q="Quel compte utiliser pour un usage professionnel ?" explain="Le compte fourni par l’employeur est encadré : contrat, paramètres de confidentialité, règles internes. Un compte personnel ne l’est pas.">
        <QOpt>Mon compte personnel gratuit, c’est plus simple</QOpt>
        <QOpt ok>Le compte professionnel autorisé par mon organisation</QOpt>
        <QOpt>Peu importe, ce sont les mêmes outils</QOpt>
      </QuizQ>
      <QuizQ q="Votre premier jet ne convient pas. Que faire ?" explain="On dialogue : on précise ce qui ne va pas (« trop long », « plus formel », « ajoute la date »). C’est souvent au 2e ou 3e échange que le texte devient bon.">
        <QOpt>Abandonner : l’IA ne sait pas faire</QOpt>
        <QOpt ok>Préciser ce qui ne va pas et redemander</QOpt>
        <QOpt>Reposer exactement la même question</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Atelier: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Identifier 5 tâches à confier à l’IA"
    defi="reperage"
    who="Seul, puis en binôme"
    minutes={15}
    where={
      <>
        Une liste de <strong>5 tâches</strong> réelles de votre poste, chacune avec : fréquence, temps passé, ce que l’IA ferait, ce que vous vérifieriez.
      </>
    }
    objective={
      <>
        Repérer dans <strong>votre propre semaine</strong> cinq tâches que l’IA pourrait accélérer ou améliorer, et les classer par gain attendu.
      </>
    }
    crit={
      <>
        <CheckItem id="a1-c1" size={21}>5 tâches concrètes, pas des généralités</CheckItem>
        <CheckItem id="a1-c2" size={21}>Fréquence et durée estimées</CheckItem>
        <CheckItem id="a1-c3" size={21}>Pour chacune, le point de vérification</CheckItem>
        <CheckItem id="a1-c4" size={21}>Aucune tâche « à éviter » retenue</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet size={22} tone="blue">
        <strong>Fréquence</strong> : chaque jour (3), chaque semaine (2), chaque mois (1)
      </Bullet>
      <Bullet size={22} tone="violet">
        <strong>Temps</strong> : plus de 30 min (3), 10 à 30 min (2), moins (1)
      </Bullet>
      <Bullet size={22} tone="green">
        <strong>Texte</strong> : la tâche consiste surtout à lire ou écrire (3), en partie (2), peu (1)
      </Bullet>
      <Bullet size={22} tone="coral">
        Multipliez les trois notes : <strong>au-dessus de 12</strong>, c’est une priorité.
      </Bullet>
    </div>
    <Bonus>Pour votre n°1, écrivez déjà la demande que vous feriez à l’IA : on l’améliorera au module 2.</Bonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M1_Section, M1_Quoi, M1_Apports, M1_Gain, M1_Tri, M1_Limites, M1_Outils, M1_Pratiques, M1_Quiz, M1_Atelier];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 1 · 9:20

OBJECTIF — Annoncer le module : comprendre avant d’utiliser.

DIRE — « Premier module : découvrir l’IA dans nos métiers. En une heure, on va voir ce qu’elle apporte vraiment à un assistant, quelles tâches lui confier, lesquelles éviter, ses limites, et comment choisir son outil. On finira par un atelier où vous identifierez cinq tâches de votre propre poste. »

TRANSITION — « D’abord, qu’est-ce que c’est, une IA générative ? »`,
  `⏱ 5 min · L’IA GÉNÉRATIVE EN UNE IMAGE (3 clics)

OBJECTIF — Donner une image mentale simple et juste du fonctionnement, sans technique.

DIRE — « Une IA générative, c’est un programme qui a lu des milliards de textes et qui a appris une chose : prédire le mot suivant le plus probable. Regardez : “Madame, nous accusons bonne…” Vous avez toutes et tous pensé “réception”. L’IA aussi, et elle le fait mot après mot, très vite. » Clic 1 : « Elle a énormément lu, donc elle maîtrise les formules de l’écrit professionnel. » Clic 2 : « Mais elle ne connaît pas votre bureau : ni vos clients, ni vos tarifs. » Clic 3 : « Et comme elle prédit ce qui est probable, pas ce qui est vrai, elle peut écrire très bien quelque chose de faux. Imaginez un stagiaire brillant, très rapide, qui vient d’arriver : il faut tout lui expliquer, et relire son travail. »

INSISTER — L’image du stagiaire servira toute la journée.

TRANSITION — « Concrètement, qu’est-ce que ce stagiaire sait faire pour vous ? »`,
  `⏱ 5 min · CE QUE L’IA APPORTE (cartes à retourner)

OBJECTIF — Montrer six usages concrets, chacun avec une demande type.

DIRE — « Six super-pouvoirs du quotidien. Rédiger, reformuler, résumer, structurer, extraire, traduire. Je retourne une carte, et je vous demande pour chacune : quand l’avez-vous fait pour la dernière fois ? »

ANIMATION — Cliquer les cartes une par une ou faire choisir le groupe. Lire la demande type au dos à voix haute : remarquer qu’elle précise toujours un destinataire, une longueur ou un ton. C’est un avant-goût du module 2.

TRANSITION — « Combien de temps cela peut-il vous faire gagner ? Faisons le calcul pour vous. »`,
  `⏱ 5 min · SIMULATEUR DE GAIN DE TEMPS (interactif)

OBJECTIF — Rendre le bénéfice concret et personnel, tout en restant honnête sur la relecture.

DIRE — « Prenons un volontaire. Combien d’emails rédigez-vous par semaine ? Combien de documents : comptes rendus, notes, synthèses ? » Régler les curseurs. « Avec une hypothèse prudente de 50 % de temps gagné, relecture comprise, on arrive à… » Lire le résultat. « Sur une année, c’est ce nombre de journées entières. Mais attention : ce gain suppose deux choses que l’on va apprendre aujourd’hui. Bien demander, sinon on passe son temps à corriger. Et bien vérifier, parce qu’une erreur envoyée coûte bien plus cher que le temps gagné. »

ANIMATION — Faire varier la part économisée de 30 à 70 % pour montrer la sensibilité. Les flèches du clavier ajustent le curseur sélectionné.

TRANSITION — « Toutes les tâches ne se prêtent pas à l’IA. Faisons le tri. »`,
  `⏱ 6 min · EXERCICE DE TRI (glisser-déposer, 1 clic pour la solution)

OBJECTIF — Apprendre à distinguer les tâches idéales, à surveiller et à éviter.

DIRE — « Neuf tâches, trois colonnes. Idéal : du texte, du répétitif, facile à relire. Avec vigilance : il y a des chiffres, des faits ou un enjeu pour un client. À éviter : des données sensibles, ou une décision qui engage l’entreprise. À vous de me dire où va chaque étiquette. »

ANIMATION — Faire glisser les étiquettes selon les propositions du groupe. Débattre des cas 2, 5 et 8 : le résumé d’un contrat est utile mais à vérifier ; le calcul des frais, c’est le tableur ; la réponse à une réclamation est une très bonne tâche… à condition de relire. Clic pour la solution.

INSISTER — Les cas 3 et 9 ne sont pas des problèmes techniques mais de confidentialité. Le cas 6 est une décision : l’IA peut préparer, jamais décider.

TRANSITION — « Parlons justement de ce que l’IA fait mal. »`,
  `⏱ 6 min · LES LIMITES (5 clics)

OBJECTIF — Faire vivre une hallucination et lister les cinq limites à connaître.

DIRE — « Une question, une réponse qui a l’air parfaite : un article de loi, un délai précis. » Clic 1 : « Sauf que cette règle, sous cette forme, n’existe pas. C’est ce qu’on appelle une hallucination : l’IA produit le texte le plus plausible, pas le plus vrai. C’est un exemple construit pour la formation, mais il est très représentatif. » Puis clics 2 à 5 : « Ses connaissances s’arrêtent à une date ; elle calcule mal ; elle ignore votre contexte ; et ce que vous collez peut être conservé selon l’outil et le compte. »

INSISTER — Aucune référence juridique, aucun chiffre, aucun nom ne part sans vérification à la source.

TRANSITION — « Quel outil choisir, alors ? »`,
  `⏱ 4 min · CHOISIR LE BON OUTIL (onglets)

OBJECTIF — Présenter les principaux assistants sans faire de publicité, et donner trois critères de choix.

DIRE — « Quatre grands outils, qui font tous à peu près la même chose pour nos besoins. » Cliquer chaque onglet brièvement. « Le critère numéro un n’est pas la qualité, elles se valent pour l’écrit : c’est ce que votre organisation autorise. Le compte professionnel est encadré par un contrat, un compte personnel non. Ensuite : est-ce intégré à mes outils, Outlook ou Gmail, Word ou Docs ? Et enfin : où vont mes données ? »

ANIMATION — Demander qui a accès à un outil fourni par son employeur. Les offres et fonctions évoluent vite : rester factuel et inviter à vérifier auprès du service informatique.

TRANSITION — « Quel que soit l’outil, six réflexes. »`,
  `⏱ 4 min · SIX RÉFLEXES (6 clics)

OBJECTIF — Ancrer les bonnes pratiques de base avant de pratiquer.

DIRE — Un clic par réflexe. « Un : expliquez comme à un nouveau collègue. Deux : une demande, un objectif. Trois : dialoguez, le premier jet n’est qu’un brouillon. Quatre : relisez et vérifiez. Cinq : anonymisez avant de coller. Six : gardez ce qui marche dans votre bibliothèque. » Dernier clic : la citation. « Retenez la phrase : l’IA prépare, vous vérifiez, vous signez. »

TRANSITION — « Vérifions que c’est acquis avec un petit quiz. »`,
  `⏱ 4 min · QUIZ M1 (5 questions)

OBJECTIF — Valider les notions clés du module.

DIRE — « Cinq questions, une à la fois. Votez à main levée, puis je clique. »

ANIMATION — Cliquer la réponse choisie par la majorité : le retour s’affiche immédiatement. Lire l’explication à voix haute à chaque fois. Le score s’affiche en fin de série.

TRANSITION — « À vous de jouer : premier atelier. »`,
  `⏱ 15 min · ATELIER 1 (minuteur)

OBJECTIF — Chaque participant identifie cinq tâches de son poste à confier à l’IA, avec la vérification associée.

DIRE — « Pendant dix minutes, seul, listez cinq tâches réelles de votre semaine. Pour chacune, donnez trois notes : fréquence, temps, part de texte, et multipliez-les. Au-dessus de 12, c’est une priorité. Notez aussi ce que vous vérifieriez. Puis cinq minutes en binôme : comparez vos listes, challengez-vous. »

ANIMATION — Lancer le minuteur. Passer dans les rangs, aider à rendre les tâches concrètes (« les emails » devient « répondre aux demandes de devis »). Recueillir deux ou trois exemples à l’oral à la fin.

TRANSITION — « Vous avez vos tâches. Maintenant, apprenons à bien les demander. Petite pause, puis module 2. »`,
];
// @@NOTES-END
