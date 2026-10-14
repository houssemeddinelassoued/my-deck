// ─── Module 2 · Les fondamentaux du prompting ───────────────────────────────

const M2_Section: Page = () => (
  <Section
    n={2}
    title="Les fondamentaux du prompting"
    sub="Les bases pour obtenir de bons résultats de n’importe quel outil présenté aujourd’hui : savoir formuler, préciser, itérer et vérifier."
    dur="50 min"
    labs={<DefiBadge defi="prompt" />}
  >
    <SecItem n={1}>Qu’est-ce qu’un prompt, et pourquoi ça rate</SecItem>
    <SecItem n={2}>Les 5 briques : contexte, objectif, rôle, contraintes, format</SecItem>
    <SecItem n={3}>Donner des exemples, itérer, faire préciser</SecItem>
    <SecItem n={4}>Vérifier et corriger une réponse générée</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Qu’est-ce qu’un prompt ? ───────────────────────────────────────────────
const M2_What: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Qu’est-ce qu’un prompt ?</Title>
    <Lede>La demande que vous écrivez à l’IA. Le bon réflexe : l’imaginer comme le brief d’un nouveau stagiaire.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 720 }}>
      <Quote by="La règle d’or de la journée">Un prompt, c’est un brief. Ce que vous ne dites pas, l’IA l’invente.</Quote>
      <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PromptBox size={26}>Rédige un compte rendu.</PromptBox>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, paddingLeft: 10 }}>
          <Icon name="arrow" size={24} color={C.faint} /> De quelle réunion ? Pour qui ? Quelle longueur ? Quel ton ?
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 920, top: 280, width: 880, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Eyebrow c={C.violet} size={20} cls={A.fade}>
        Votre stagiaire IA…
      </Eyebrow>
      <Card tone="blue" icon="brain" title="…est brillant et très rapide" cls={b.on(1)} size={23}>
        Il écrit, résume, traduit en quelques secondes, dans un français impeccable.
      </Card>
      <Card tone="violet" icon="eyeOff" title="…ne connaît rien de vous" cls={b.on(2)} size={23}>
        Ni votre entreprise, ni votre client, ni l’historique du dossier, ni vos habitudes.
      </Card>
      <Card tone="green" icon="target" title="…fait exactement ce que vous dites" cls={b.on(3)} size={23}>
        Une demande vague donne une réponse moyenne. Une demande précise donne une réponse utile.
      </Card>
    </div>
  </Frame>
);

// ─── Pourquoi ça rate ───────────────────────────────────────────────────────
const M2Cause = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <IconTile name={icon} tone="coral" size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M2_Bad: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Pourquoi certaines demandes échouent ?</Title>
    <Lede>La réponse est rarement « l’IA est nulle ». Elle est presque toujours dans la demande.</Lede>
    <ToolWindow id="chatgpt" title="une demande vague" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, height: 580 }}>
      <PromptBox size={24}>Fais-moi un mail pour la réunion.</PromptBox>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.5, color: C.soft }}>
        <ToolTile id="chatgpt" size={34} />
        <div>
          Objet : Réunion
          <br />
          Bonjour à tous,
          <br />
          Je vous propose une réunion afin d’échanger sur les sujets en cours. Merci de me faire part de vos disponibilités.
          <br />
          Cordialement,
          <br />
          [Votre nom]
        </div>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, fontWeight: 600, color: C.coral }}>
        <Icon name="x" size={24} color={C.coral} sw={3} /> Correct… et inutilisable : il faut tout réécrire.
      </div>
    </ToolWindow>
    <div style={{ position: 'absolute', left: 980, top: 270, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Cause n={1} icon="eyeOff" title="Trop vague">
        Quelle réunion, quand, avec qui, pour décider de quoi ?
      </M2Cause>
      <M2Cause n={2} icon="book" title="Pas de contexte">
        L’IA ignore le projet, les enjeux, l’historique.
      </M2Cause>
      <M2Cause n={3} icon="users" title="Pas de destinataire">
        Un mail à la direction ne s’écrit pas comme un mail à l’équipe.
      </M2Cause>
      <M2Cause n={4} icon="table" title="Pas de format">
        Longueur, ton, structure : rien n’est dit, tout est deviné.
      </M2Cause>
      <M2Cause n={5} icon="layers" title="Tout à la fois">
        Une demande géante en un bloc : mieux vaut découper en étapes.
      </M2Cause>
    </div>
  </Frame>
);

// ─── Le constructeur de prompt (interactif) ─────────────────────────────────
type Brick = { id: string; label: string; tone: Tone; icon: IconName; hint: string; text: string };
const BRICKS: Brick[] = [
  { id: 'role', label: 'Rôle', tone: 'violet', icon: 'user', hint: 'Qui l’IA doit-elle incarner ?', text: 'Tu es responsable de la communication interne d’une PME de 80 personnes.' },
  { id: 'ctx', label: 'Contexte', tone: 'blue', icon: 'book', hint: 'Quelle est la situation ?', text: 'Notre séminaire annuel a lieu le 21 novembre à Lyon. C’est le premier depuis le rachat de l’entreprise et certains salariés sont inquiets.' },
  { id: 'obj', label: 'Objectif', tone: 'green', icon: 'target', hint: 'Que voulez-vous obtenir, et pour quoi faire ?', text: 'Rédige le message d’annonce : il doit donner envie de venir et rassurer sur l’avenir.' },
  { id: 'cons', label: 'Contraintes', tone: 'yellow', icon: 'filter', hint: 'Ton, longueur, à inclure, à éviter.', text: 'Ton chaleureux, 150 mots maximum, sans jargon. Mentionne l’inscription avant le 7 novembre.' },
  { id: 'fmt', label: 'Format', tone: 'teal', icon: 'table', hint: 'Sous quelle forme voulez-vous la réponse ?', text: 'Donne un objet, le message, puis 3 variantes de phrase d’accroche.' },
];

const M2_RESULT: [string, Tone][] = [
  ['« Chers collègues, nous avons le plaisir de vous convier à notre séminaire… » : générique, sans date, sans âme. À réécrire.', 'coral'],
  ['Le ton est plus juste, mais l’IA invente la date, le lieu et le programme.', 'coral'],
  ['Les faits sont bons. Reste à deviner ce que le message doit produire.', 'yellow'],
  ['Le message a un cap : donner envie et rassurer. Longueur et ton encore aléatoires.', 'yellow'],
  ['Presque prêt : bon ton, bonne longueur, la date limite y est. Il manque la mise en forme.', 'blue'],
  ['Prêt à relire et envoyer : objet, message, et trois accroches au choix. Gain : 20 minutes.', 'green'],
];

const M2_Builder: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const n = BRICKS.filter((x) => on[x.id]).length;
  const [res, tone] = M2_RESULT[n];
  return (
    <Frame mod={2} kind="simu">
      <Title>Les 5 briques d’un bon prompt</Title>
      <Lede>Activez les briques une à une et regardez la demande… et le résultat attendu, changer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {BRICKS.map((x) => (
          <div key={x.id} style={{ background: on[x.id] ? T[x.tone].bg : C.card, borderRadius: 16, boxShadow: on[x.id] ? `inset 0 0 0 2.5px ${STRONG[x.tone]}` : SHADOW_SM, padding: '14px 20px', transition: `all 250ms ${EASE}` }}>
            <Toggle on={!!on[x.id]} onChange={(v) => setOn((o) => ({ ...o, [x.id]: v }))} tone={x.tone} label={<strong style={{ fontFamily: display, fontSize: 26 }}>{x.label}</strong>} />
            <div style={{ marginTop: 4, marginLeft: 82, fontSize: 20, color: C.muted }}>{x.hint}</div>
          </div>
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 820, top: 260, width: 980, height: 400, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={18}>
          Votre prompt
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.55, color: C.ink }}>
          {BRICKS.filter((x) => on[x.id]).map((x) => (
            <span key={x.id} className={A.fade} style={{ background: T[x.tone].bg, boxShadow: `inset 0 -3px 0 ${STRONG[x.tone]}`, borderRadius: 6, padding: '1px 6px', marginRight: 6 }}>
              {x.text}
            </span>
          ))}
          {n === 0 ? <span style={{ fontWeight: 600 }}>Écris une annonce pour le séminaire.</span> : null}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 820, top: 690, width: 980, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 20, padding: '20px 30px', borderLeft: `8px solid ${STRONG[tone]}`, transition: `background 300ms ${EASE}`, ...dl(300) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Eyebrow c={T[tone].fg} size={19}>
            Résultat attendu
          </Eyebrow>
          <div style={{ display: 'flex', gap: 6 }}>
            {BRICKS.map((x, i) => (
              <span key={x.id} style={{ width: 34, height: 12, borderRadius: 6, background: i < n ? STRONG[tone] : '#fff', transition: `background 300ms ${EASE}` }} />
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 800, fontSize: 30, color: T[tone].fg }}>{n} / 5</span>
        </div>
        <div key={n} className={A.fade} style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
          {res}
        </div>
      </div>
    </Frame>
  );
};

// ─── Donner des exemples ────────────────────────────────────────────────────
const M2_Examples: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Donner des exemples à l’IA</Title>
    <Lede>Montrer vaut mieux qu’expliquer : deux exemples suffisent souvent pour imposer votre style ou votre classement.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 960 }}>
      <CodeDark file="Prompt avec exemples · tri des emails clients" size={21} wrap>
        Classe chaque email client dans une catégorie et donne sa priorité.{'\n\n'}
        <Cc>Exemple 1</Cc>
        {'\n'}Email : « Ma commande n° 4471 n’est toujours pas arrivée, c’est la 3e relance. »{'\n'}
        <Cs>→ Livraison · priorité haute</Cs>
        {'\n\n'}
        <Cc>Exemple 2</Cc>
        {'\n'}Email : « Pouvez-vous m’envoyer votre catalogue 2027 ? »{'\n'}
        <Cs>→ Information · priorité basse</Cs>
        {'\n\n'}
        <Cf>À toi :</Cf> « Le produit reçu est cassé, je veux un remboursement rapidement. »
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1130, top: 270, width: 670, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.pop(1)} style={{ background: T.green.bg, borderRadius: 18, padding: '22px 26px', boxShadow: `inset 0 0 0 2.5px ${C.green}` }}>
        <Eyebrow c={T.green.fg} size={18}>
          Réponse de l’IA
        </Eyebrow>
        <div style={{ marginTop: 8, fontFamily: mono, fontSize: 28, fontWeight: 700, color: C.ink }}>→ Réclamation · priorité haute</div>
        <div style={{ marginTop: 8, fontSize: 20, color: C.soft }}>Même format, même logique que vos exemples : réutilisable tel quel.</div>
      </div>
      <Card tone="violet" icon="pen" title="Pour votre style d’écriture" cls={b.on(2)} size={22}>
        Collez deux de vos emails : « Écris dans le même style, aussi concis. »
      </Card>
      <Card tone="blue" icon="table" title="Pour un format exact" cls={b.on(2)} style={dl(150)} size={22}>
        Montrez une ligne de tableau remplie : l’IA remplit les suivantes à l’identique.
      </Card>
    </div>
  </Frame>
);

// ─── Itérer : reformuler, améliorer, faire préciser ─────────────────────────
const M2_Iterate: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Un prompt n’est pas un coup unique : on dialogue</Title>
    <Lede>Trois réflexes pour transformer une réponse moyenne en réponse excellente. Cliquez sur chaque onglet.</Lede>
    <Tabs initial="ask">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, display: 'flex', gap: 12 }}>
        <TabBtn id="ask" tone="violet" icon="chat">
          Faire préciser sa demande
        </TabBtn>
        <TabBtn id="improve" tone="blue" icon="loop">
          Demander une amélioration
        </TabBtn>
        <TabBtn id="meta" tone="green" icon="wand">
          Faire améliorer son prompt
        </TabBtn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 340, width: 1680, height: 520, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(150) }}>
        <TabPane id="ask">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bubble who="user" size={23} w={1200}>
              Je dois préparer un discours pour le départ en retraite de Martine, 32 ans de maison. <strong>Avant de l’écrire, pose-moi les questions dont tu as besoin.</strong>
            </Bubble>
            <Bubble who="agent" name="Assistant" size={23} w={1300}>
              Avec plaisir. 1) Combien de temps doit durer le discours ? 2) Quel était son poste et ses grandes réalisations ? 3) Une anecdote ou un trait de caractère à évoquer ? 4) Ton plutôt émouvant ou plutôt humoristique ? 5) Qui prend la parole : son responsable, un collègue ?
            </Bubble>
            <Callout title="Pourquoi ça marche" tone="violet" icon="bulb" size={22}>
              L’IA identifie elle-même ce qui lui manque. Vous répondez en 2 minutes, et le premier jet est le bon.
            </Callout>
          </div>
        </TabPane>
        <TabPane id="improve">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bubble who="user" size={23} w={1200}>
              C’est bien, mais <strong>plus court de moitié, plus direct</strong>, et termine par une question qui appelle une réponse.
            </Bubble>
            <Bubble who="user" size={23} w={1200}>
              Propose-moi <strong>3 versions</strong> : une formelle, une chaleureuse, une très courte pour Teams.
            </Bubble>
            <Bubble who="user" size={23} w={1200}>
              <strong>Relis ta réponse comme un client exigeant</strong> : qu’est-ce qui pourrait le gêner ? Corrige.
            </Bubble>
            <Callout title="Pourquoi ça marche" tone="blue" icon="bulb" size={22}>
              L’IA garde le fil de la conversation : inutile de tout réexpliquer, précisez seulement ce qui ne va pas.
            </Callout>
          </div>
        </TabPane>
        <TabPane id="meta">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bubble who="user" size={23} w={1200}>
              Voici mon prompt : « Fais un résumé du rapport pour le comité. » <strong>Améliore-le</strong> en ajoutant ce qui manque (contexte, objectif, rôle, contraintes, format), puis explique tes ajouts.
            </Bubble>
            <Bubble who="agent" name="Assistant" size={23} w={1300}>
              Version améliorée : « Tu es analyste financier. Résume ce rapport trimestriel pour un comité de direction qui a 5 minutes : 5 points clés, 3 risques, 1 recommandation, 200 mots maximum, en puces. » Ajouts : rôle, destinataire, temps de lecture…
            </Bubble>
            <Callout title="Pourquoi ça marche" tone="green" icon="bulb" size={22}>
              L’IA connaît les bonnes pratiques du prompting : utilisez-la comme coach, puis gardez le prompt amélioré dans vos modèles.
            </Callout>
          </div>
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Vérifier et corriger ───────────────────────────────────────────────────
const M2_Verify: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Vérifier et corriger une réponse générée</Title>
    <Lede>Avant d’envoyer quoi que ce soit, trois relectures : les faits, le fond, la forme. Cochez votre routine.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1130, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow c={C.coral} size={19}>
          1 · Les faits
        </Eyebrow>
        <CheckItem id="v1" tone="coral" size={24}>Les chiffres, dates, noms et citations sont vérifiés à la source</CheckItem>
        <CheckItem id="v2" tone="coral" size={24}>Rien n’a été inventé pour combler un manque d’information</CheckItem>
        <Eyebrow c={C.blue} size={19} style={{ marginTop: 10 }}>
          2 · Le fond
        </Eyebrow>
        <CheckItem id="v3" tone="blue" size={24}>La réponse traite vraiment ma demande, sans hors-sujet</CheckItem>
        <CheckItem id="v4" tone="blue" size={24}>Rien de faux, d’engageant ou de risque juridique n’est promis</CheckItem>
        <Eyebrow c={C.green} size={19} style={{ marginTop: 10 }}>
          3 · La forme
        </Eyebrow>
        <CheckItem id="v5" size={24}>Le ton convient au destinataire, et ça sonne comme moi</CheckItem>
        <CheckItem id="v6" size={24}>Les formules creuses typiques de l’IA ont été retirées</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1310, top: 270, width: 490, display: 'flex', flexDirection: 'column', gap: 20, ...dl(300) }}>
        <CheckScore
          max={6}
          label="Ma routine de relecture"
          levels={[
            { min: 0, text: 'Risqué : vous signez sans lire.', tone: 'coral' },
            { min: 3, text: 'Correct, mais un fait peut passer.', tone: 'yellow' },
            { min: 6, text: 'Professionnel : l’IA propose, vous disposez.', tone: 'green' },
          ]}
        />
        <Callout title="Corriger" tone="blue" icon="pen" size={22}>
          Ne réécrivez pas tout : dites à l’IA ce qui ne va pas (« le 2e paragraphe est faux : la date est le 12 »).
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ─── Formules utiles ────────────────────────────────────────────────────────
const M2Formula = ({ icon, tone, text, use, d }: { icon: IconName; tone: Tone; text: string; use: string; d: number }) => (
  <div className={A.pop} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={26} color={STRONG[tone]} />
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{use}</span>
    </div>
    <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.38, fontWeight: 600, color: C.ink }}>« {text} »</div>
  </div>
);

const M2_Formulas: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Huit formules à garder sous la main</Title>
    <Lede>À ajouter à la fin de n’importe quel prompt, dans n’importe quel assistant.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      <M2Formula icon="chat" tone="violet" use="Faire préciser" text="Pose-moi des questions avant de répondre." d={100} />
      <M2Formula icon="layers" tone="blue" use="Choisir" text="Propose 3 versions différentes." d={180} />
      <M2Formula icon="smile" tone="teal" use="Simplifier" text="Explique comme à un débutant." d={260} />
      <M2Formula icon="eye" tone="coral" use="Contrôler" text="Critique ta réponse et corrige-la." d={340} />
      <M2Formula icon="alert" tone="yellow" use="Limiter les inventions" text="Si tu ne sais pas, dis-le." d={420} />
      <M2Formula icon="table" tone="navy" use="Structurer" text="Présente le résultat en tableau." d={500} />
      <M2Formula icon="filter" tone="green" use="Synthétiser" text="Résume en 5 points, 100 mots max." d={580} />
      <M2Formula icon="link" tone="pink" use="Vérifier" text="Cite tes sources avec leur lien." d={660} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(900) }}>
      <Callout title="Astuce de pro" tone="green" icon="archive" size={24}>
        Créez un document « Mes prompts » : chaque prompt qui a bien marché y entre, avec ses trous à remplir. C’est votre premier gain de temps durable.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Lab: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="De « Rédige un email à mon client » au prompt structuré"
    defi="prompt"
    who="Binômes"
    minutes={15}
    tools={['chatgpt', 'copilot', 'gemini', 'claude']}
    objective={
      <>
        Transformer <strong>« Rédige un email à mon client »</strong> en un prompt structuré qui produit un email professionnel adapté à une situation précise.
      </>
    }
    where={
      <>
        Le prompt structuré (5 briques), l’email obtenu, et <strong>une phrase</strong> : ce qui a le plus changé entre le prompt brut et le prompt structuré.
      </>
    }
    crit={
      <>
        <CheckItem id="l2-c1" size={21}>Les 5 briques sont présentes</CheckItem>
        <CheckItem id="l2-c2" size={21}>Aucune information n’a été inventée par l’IA</CheckItem>
        <CheckItem id="l2-c3" size={21}>L’email est envoyable après relecture</CheckItem>
        <CheckItem id="l2-c4" size={21}>Le prompt est rangé dans « Mes prompts »</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Testez le prompt brut tel quel. Notez ce qui ne va pas.</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Choisissez une situation : retard de livraison, relance de devis, erreur de facturation, ou la vôtre.</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Écrivez le prompt avec les 5 briques. Comparez les deux emails.</div>
      <div><strong style={{ color: C.navy }}>4.</strong> Itérez au moins une fois : « plus court », « plus empathique »…</div>
    </div>
    <Bonus>Ajoutez « Pose-moi des questions avant de rédiger » : combien de questions l’IA vous pose-t-elle ?</Bonus>
  </LabPage>
);

const M2_LabFix: Page = () => (
  <Frame mod={2} kind="lab" label="Atelier 2 · Un corrigé possible" beats={2}>
    <Title size={46}>Un corrigé possible : le retard de livraison</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 880 }}>
      <CodeDark file="Prompt structuré" size={19} wrap>
        <Ck>Rôle</Ck> · Tu es responsable de compte chez un fournisseur de mobilier de bureau.{'\n'}
        <Ck>Contexte</Ck> · Notre client Alvéa attend 40 bureaux pour le 3 novembre, date de son déménagement. Notre transporteur a un retard : livraison le 13 novembre.{'\n'}
        <Ck>Objectif</Ck> · Prévenir le client, présenter nos excuses et proposer deux solutions : 10 bureaux de prêt dès le 3, ou 5 % de remise.{'\n'}
        <Ck>Contraintes</Ck> · Ton professionnel et empathique, 150 mots max, ne pas accuser le transporteur.{'\n'}
        <Ck>Format</Ck> · Objet, corps du message, signature.
      </CodeDark>
    </div>
    <ToolWindow id="claude" title="résultat" cls={b.on(1)} style={{ position: 'absolute', left: 1050, top: 190, width: 750, height: 660 }} pad={22}>
      <div style={{ fontSize: 20, lineHeight: 1.5, color: C.ink }}>
        <strong>Objet : Votre livraison du 3 novembre : deux solutions pour vous</strong>
        <br />
        <br />
        Bonjour Madame Leroy,
        <br />
        <br />
        Je vous dois une information importante : vos 40 bureaux ne pourront pas être livrés le 3 novembre, mais le 13. Je mesure la gêne que ce décalage représente en pleine période de déménagement, et je vous prie de nous en excuser.
        <br />
        <br />
        Pour que vos équipes soient installées dès le premier jour, je vous propose : <strong>10 bureaux de prêt livrés le 3 novembre</strong>, ou <strong>une remise de 5 %</strong> sur la commande.
        <br />
        <br />
        Je vous appelle demain pour en parler.
        <br />
        Bien cordialement, Thomas Garnier
      </div>
    </ToolWindow>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 630, width: 880, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Callout title="Ce qui a changé" tone="green" icon="checkCircle" size={22}>
        Faits exacts, solutions concrètes, bon ton : l’email part après une relecture de 30 secondes, au lieu d’une réécriture de 10 minutes.
      </Callout>
      <Callout title="À vérifier quand même" tone="coral" icon="eye" size={22}>
        Le nom de la cliente et la promesse d’appel « demain » : l’IA les a ajoutés, sont-ils justes ?
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M2 ────────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz · Module 2</Title>
    <QuizSeries y={200}>
      <QuizQ q="« Ton chaleureux, 150 mots maximum, sans jargon » : de quelle brique s’agit-il ?" explain="Ce sont des contraintes : elles cadrent le ton, la longueur, ce qu’il faut inclure ou éviter.">
        <QOpt>Le contexte</QOpt>
        <QOpt ok>Les contraintes</QOpt>
        <QOpt>Le rôle</QOpt>
      </QuizQ>
      <QuizQ q="La réponse de l’IA est générique et passe à côté de votre situation. La cause la plus probable ?" explain="L’IA ne connaît que ce que vous lui dites : sans contexte, elle comble les trous avec du générique.">
        <QOpt ok>Le prompt manque de contexte</QOpt>
        <QOpt>L’IA est en panne</QOpt>
        <QOpt>Il faut écrire le prompt en anglais</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez que l’IA classe des emails exactement comme vous le faites. La meilleure méthode ?" explain="Deux ou trois exemples résolus montrent le format et la logique attendus : c’est plus efficace qu’une longue explication.">
        <QOpt>Lui demander de « bien classer »</QOpt>
        <QOpt ok>Lui donner deux ou trois exemples déjà classés</QOpt>
        <QOpt>Lui envoyer tous vos emails de l’année</QOpt>
      </QuizQ>
      <QuizQ q="La réponse est presque bonne mais trop longue. Que faites-vous ?" explain="On itère dans la même conversation : l’IA garde le contexte, il suffit de préciser ce qui ne va pas.">
        <QOpt>Vous recommencez une nouvelle conversation de zéro</QOpt>
        <QOpt ok>Vous demandez « plus court de moitié » dans la même conversation</QOpt>
        <QOpt>Vous raccourcissez à la main en supprimant la fin</QOpt>
      </QuizQ>
      <QuizQ q="Quelle formule limite le risque d’invention ?" explain="Autoriser explicitement l’IA à dire qu’elle ne sait pas réduit sa tendance à combler les manques par des inventions plausibles.">
        <QOpt>« Réponds vite. »</QOpt>
        <QOpt>« Sois créatif. »</QOpt>
        <QOpt ok>« Si tu ne sais pas, dis-le. »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_What, M2_Bad, M2_Builder, M2_Examples, M2_Iterate, M2_Verify, M2_Formulas, M2_Lab, M2_LabFix, M2_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 2 · 10:30

OBJECTIF — Annoncer le module le plus transversal de la journée.

DIRE — « Ce module est le plus important de la journée. Tous les outils que vous verrez cet après-midi — ChatGPT, Gamma, Canva, Firefly, Notion — fonctionnent avec un prompt. Si vous savez formuler une demande, vous savez utiliser les vingt outils. »

TRANSITION — « Commençons par la définition. »`,
  `⏱ 4 min · QU’EST-CE QU’UN PROMPT ? (3 clics)

OBJECTIF — Installer la métaphore du brief au stagiaire.

DIRE — « Un prompt, c’est la demande que vous écrivez à l’IA. Le meilleur modèle mental : imaginez un nouveau stagiaire. » Clic 1 : « Il est brillant et très rapide. » Clic 2 : « Mais il ne connaît rien de vous : ni votre entreprise, ni votre client, ni l’historique. » Clic 3 : « Et il fait exactement ce que vous dites. Si vous lui dites “rédige un compte rendu”, il va deviner tout le reste. Ce que vous ne dites pas, l’IA l’invente. »

ANIMATION — Demander : « Si vous briefiez un vrai stagiaire pour ce compte rendu, que lui diriez-vous ? » Les réponses du groupe sont exactement les briques qu’on verra dans deux pages.

TRANSITION — « Voyons concrètement pourquoi une demande échoue. »`,
  `⏱ 4 min · POURQUOI ÇA RATE (5 clics)

OBJECTIF — Diagnostiquer les cinq causes classiques d’une mauvaise réponse.

DIRE — « Voici une demande que nous avons tous faite : “Fais-moi un mail pour la réunion.” La réponse est correcte… et inutilisable. Pourquoi ? » Cliquer chaque cause : trop vague, pas de contexte, pas de destinataire, pas de format, tout à la fois.

INSISTER — Quand le résultat est mauvais, le premier réflexe n’est pas de changer d’outil mais de relire sa demande.

TRANSITION — « La solution : cinq briques. »`,
  `⏱ 6 min · LES 5 BRIQUES (simulateur)

OBJECTIF — Faire découvrir contexte, objectif, rôle, contraintes, format, et leur effet cumulatif.

DIRE — « Demande de départ : “Écris une annonce pour le séminaire.” Activons les briques une par une. » Activer Rôle : « L’IA adopte le bon point de vue. » Contexte : « Elle n’invente plus la date ni le lieu. » Objectif : « Elle sait ce que le message doit produire. » Contraintes : « Ton, longueur, info obligatoire. » Format : « Je reçois exactement ce que je peux utiliser. Cinq sur cinq. »

ANIMATION — Faire choisir au groupe l’ordre d’activation. Montrer que le contexte et l’objectif ont le plus d’impact. Il n’y a pas d’ordre imposé dans le prompt final.

INSISTER — Pas besoin des cinq briques pour une question simple. Pour un livrable, oui.

TRANSITION — « Une sixième astuce : les exemples. »`,
  `⏱ 4 min · DONNER DES EXEMPLES (2 clics)

OBJECTIF — Montrer la puissance des exemples pour imposer un format ou un style.

DIRE — « Je veux que l’IA trie des emails clients exactement comme moi. Au lieu d’expliquer ma logique, je lui montre deux exemples déjà triés. » Clic 1 : « Elle reproduit le format et la logique : réclamation, priorité haute. » Clic 2 : « Même principe pour votre style d’écriture : collez deux de vos emails. Ou pour un tableau : montrez une ligne remplie. »

ATTENTION — Les exemples doivent être anonymisés : pas de vrais emails clients dans un outil non validé.

TRANSITION — « Et si la réponse ne convient pas ? On dialogue. »`,
  `⏱ 5 min · DIALOGUER (démo, onglets)

OBJECTIF — Couvrir : faire préciser sa demande, demander une reformulation ou amélioration.

DIRE — Onglet 1 : « Le réflexe le plus sous-estimé : demander à l’IA de vous poser des questions avant d’écrire. Elle identifie elle-même ce qui lui manque. » Onglet 2 : « Si la réponse est presque bonne, ne recommencez pas : précisez. Plus court, trois versions, relis comme un client exigeant. » Onglet 3 : « Et vous pouvez même faire améliorer votre prompt par l’IA. »

ANIMATION — Si le temps le permet, faire la démo en direct dans l’assistant de la salle avec le discours de départ en retraite.

TRANSITION — « Dernière étape, non négociable : vérifier. »`,
  `⏱ 4 min · VÉRIFIER ET CORRIGER (checklist)

OBJECTIF — Installer une routine de relecture en trois temps.

DIRE — « Trois relectures. Les faits : chiffres, dates, noms. Le fond : la réponse traite-t-elle vraiment ma demande, promet-elle quelque chose d’engageant ? La forme : le ton, et ces formules creuses typiques de l’IA — “n’hésitez pas”, “dans un monde en constante évolution”. Cochez ce que vous faites déjà. »

ANIMATION — Faire cocher un volontaire. Commenter le score.

INSISTER — Pour corriger, ne réécrivez pas tout à la main : dites à l’IA ce qui est faux.

TRANSITION — « Voici votre boîte de formules utiles. »`,
  `⏱ 3 min · HUIT FORMULES (synthèse)

OBJECTIF — Donner un mémo réutilisable immédiatement.

DIRE — « Huit formules à ajouter à n’importe quel prompt. Faire préciser, obtenir plusieurs versions, simplifier, faire critiquer, limiter les inventions, structurer en tableau, résumer, citer ses sources. » Puis l’astuce : « Créez dès aujourd’hui un document “Mes prompts”. Chaque prompt qui marche y entre. C’est ce qui fait gagner du temps sur la durée. »

TRANSITION — « À vous : atelier 2. »`,
  `⏱ 15 min · ATELIER 2 · PROMPT STRUCTURÉ (minuteur)

OBJECTIF — Transformer « Rédige un email à mon client » en prompt structuré produisant un email professionnel adapté.

DIRE — « Quinze minutes en binôme. D’abord, testez le prompt brut : “Rédige un email à mon client.” Regardez le résultat. Puis choisissez une situation — retard de livraison, relance de devis, erreur de facture, ou une vraie situation de votre métier, anonymisée. Écrivez le prompt avec les cinq briques et comparez. »

ANIMATION — Lancer le minuteur. Passer dans les rangs et vérifier que les situations sont fictives ou anonymisées. Faire lire deux prompts à voix haute à la fin.

TRANSITION — « Voici un corrigé possible. »`,
  `⏱ 4 min · CORRIGÉ ATELIER 2 (2 clics)

OBJECTIF — Montrer un exemple de prompt structuré et son résultat, et le contrôle qui reste nécessaire.

DIRE — « Voici un prompt structuré pour un retard de livraison : rôle, contexte précis, objectif avec deux solutions, contraintes dont “ne pas accuser le transporteur”, et le format. » Clic 1 : « Voici l’email obtenu, ici avec Claude. Il est précis, empathique, les deux solutions y sont. » Clic 2 : « Ce qui a changé : 30 secondes de relecture au lieu de 10 minutes d’écriture. Mais regardez : l’IA a ajouté un nom de cliente et la promesse d’appeler demain. À vérifier ! »

INSISTER — Même avec un excellent prompt, l’IA ajoute parfois des détails : la relecture reste indispensable.

TRANSITION — « Quiz du module 2. »`,
  `⏱ 4 min · QUIZ MODULE 2

OBJECTIF — Vérifier les acquis : briques, causes d’échec, exemples, itération, limiter les inventions.

DIRE — « Cinq questions. Votez à main levée. »

ANIMATION — Sur chaque question, faire justifier la bonne réponse par un participant.

TRANSITION — « On passe maintenant aux outils : les cinq grands assistants IA. »`,
];
// @@NOTES-END
