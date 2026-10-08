// ─── M1 · 4. Classic LLM vs agent (animated comparison table) ───────────────
// One row per → press: the LLM cell slides in, then the agent cell rises.
const M1cColHead = ({ x, w, icon, tone, title, sub, d }: { x: number; w: number; icon: IconName; tone: Tone; title: string; sub: string; d: number }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 280, width: w, ...dl(d) }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        height: 76,
        padding: '0 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: tone === 'grey' ? T.grey.bg : STRONG[tone],
        borderRadius: 16,
        boxShadow: SHADOW_SM,
      }}
    >
      <Icon name={icon} size={40} color={tone === 'grey' ? C.soft : '#fff'} sw={2.2} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1, color: tone === 'grey' ? C.ink : '#fff' }}>{title}</span>
      <span style={{ marginLeft: 'auto', fontSize: 21, color: tone === 'grey' ? C.muted : 'rgba(255,255,255,.85)' }}>{sub}</span>
    </div>
  </div>
);

const M1cRow = ({
  n,
  icon,
  label,
  llm,
  agent,
  risk = false,
}: {
  n: number;
  icon: IconName;
  label: string;
  llm: ReactNode;
  agent: ReactNode;
  risk?: boolean;
}) => {
  const top = 372 + (n - 1) * 82;
  const tone: Tone = risk ? 'coral' : 'blue';
  return (
    <>
      <div className={b.fade(n)} style={{ position: 'absolute', left: 120, top, width: 330, height: 72, display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={risk ? 'coral' : 'grey'} size={50} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 29, lineHeight: 1.05, color: C.ink }}>{label}</span>
      </div>
      <div className={b.left(n)} style={{ position: 'absolute', left: 470, top, width: 600 }}>
        <div
          style={{
            boxSizing: 'border-box',
            width: 600,
            height: 72,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            background: C.card,
            borderRadius: 14,
            boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.faint}`,
            fontSize: 26,
            lineHeight: 1.2,
            color: C.soft,
          }}
        >
          {llm}
        </div>
      </div>
      <div className={b.fade(n)} style={{ position: 'absolute', left: 1084, top: top + 20, width: 44, height: 32, ...dl(250) }}>
        <Icon name="arrow" size={32} color={STRONG[tone]} sw={2.6} />
      </div>
      <div className={b.on(n)} style={{ position: 'absolute', left: 1140, top, width: 660, ...dl(350) }}>
        <div
          style={{
            boxSizing: 'border-box',
            width: 660,
            height: 72,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            background: T[tone].bg,
            borderRadius: 14,
            boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${STRONG[tone]}`,
            fontSize: 26,
            lineHeight: 1.2,
            color: C.ink,
          }}
        >
          {agent}
        </div>
      </div>
    </>
  );
};

const M1c_Compare: Page = () => (
  <Frame mod={1} beats={7}>
    <Title>LLM classique ou agent : ce qui change vraiment</Title>
    <Lede>Même moteur de langage, mais une tout autre posture… et un tout autre niveau de risque.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 302, width: 330 }}>
      <Eyebrow size={22} c={C.muted}>
        Critère
      </Eyebrow>
    </div>
    <M1cColHead x={470} w={600} icon="chat" tone="grey" title="LLM classique" sub="ex. : ChatGPT en clavardage" d={100} />
    <M1cColHead x={1140} w={660} icon="bot" tone="blue" title="Agent IA" sub="ex. : agent de soutien TI" d={220} />
    <M1cRow n={1} icon="play" label="Posture" llm={<span><b>Réactif</b> : attend votre question</span>} agent={<span><b>Proactif</b> : poursuit un objectif</span>} />
    <M1cRow n={2} icon="loop" label="Déroulement" llm={<span><b>Un seul tour</b> : question → réponse</span>} agent={<span><b>Plusieurs étapes</b>, en boucle, jusqu’au but</span>} />
    <M1cRow n={3} icon="bolt" label="Ce qu’il produit" llm={<span><b>Du texte</b> que vous copiez-collez</span>} agent={<span><b>Des actions</b> dans vos systèmes</span>} />
    <M1cRow n={4} icon="archive" label="Mémoire" llm={<span><b>Sans état</b> : repart de zéro</span>} agent={<span><b>Mémoire</b> : contexte, historique, préférences</span>} />
    <M1cRow n={5} icon="database" label="Connaissances" llm={<span><b>Figées</b> à la date d’entraînement</span>} agent={<span><b>Accès à jour</b> : vos données, vos API</span>} />
    <M1cRow n={6} icon="alert" label="En cas d’erreur" risk llm={<span><b>Un texte faux</b> : vous le relisez</span>} agent={<span><b>Une action fausse</b> : elle a déjà eu lieu</span>} />
    <div className={b.on(7)} style={{ position: 'absolute', left: 120, top: 878, width: 1680 }}>
      <Callout title="" tone="yellow" icon="bulb" size={27} style={{ padding: '18px 28px', alignItems: 'center' }}>
        Un agent n’est pas « un LLM plus fort » : c’est un LLM <Strong>+ des outils + une boucle</Strong>. Plus de pouvoir, <Hl>plus de garde-fous</Hl>.
      </Callout>
    </div>
  </Frame>
);

// ─── M1 · 5. Demo: same request, two worlds ─────────────────────────────────
// Left: the LLM hands back a draft (beat 1). Right: the agent calls three tools
// (beats 2–4) and confirms (beat 5). Beat 6: the verdict under each panel.
const M1cPanel = ({ x, w, tone, icon, title, cls, children }: { x: number; w: number; tone: Tone; icon: IconName; title: string; cls: string; children: ReactNode }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: 372, width: w }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        height: 586,
        padding: '22px 28px 24px',
        background: tone === 'grey' ? 'rgba(255,255,255,.6)' : C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={48} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1, color: C.ink }}>{title}</span>
      </div>
      {children}
    </div>
  </div>
);

const M1cCall = ({ n, icon, call, children }: { n: number; icon: IconName; call: ReactNode; children: ReactNode }) => (
  <div className={b.left(n)}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxSizing: 'border-box',
        padding: '10px 18px 10px 12px',
        background: '#F7FAFC',
        borderRadius: 12,
        boxShadow: `inset 0 0 0 1.5px ${C.rule}`,
      }}
    >
      <IconTile name={icon} tone="teal" size={46} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: mono, fontSize: 21, lineHeight: 1.3, color: C.ink }}>{call}</span>
        <span className={b.fade(n)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, lineHeight: 1.3, color: T.green.fg, ...dl(700) }}>
          <Icon name="check" size={22} color={C.green} sw={2.8} />
          {children}
        </span>
      </div>
    </div>
  </div>
);

const M1cTodo = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, lineHeight: 1.3, color: C.ink }}>
    <span style={{ flex: 'none', width: 26, height: 26, boxSizing: 'border-box', borderRadius: 6, border: `3px solid ${C.faint}` }} />
    {children}
  </div>
);

const M1cVerdict = ({ tone, icon, children }: { tone: Tone; icon: IconName; children: ReactNode }) => (
  <div
    className={b.pop(6)}
    style={{
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 20px',
      borderRadius: 12,
      background: T[tone].bg,
      color: T[tone].fg,
      fontFamily: display,
      fontWeight: 700,
      fontSize: 28,
      lineHeight: 1.1,
    }}
  >
    <Icon name={icon} size={30} sw={2.6} />
    {children}
  </div>
);

const M1c_Demo: Page = () => (
  <Frame mod={1} kind="demo" beats={6} label="Module 01 · Même demande, deux mondes">
    <Title>Même demande, deux mondes</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', justifyContent: 'center', ...dl(150) }}>
      <Bubble who="user" name="Marie, gestionnaire · Boréal" size={28}>
        « Réserve la salle Laurentides jeudi 10 h et préviens l’équipe. »
      </Bubble>
    </div>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M 880 310 C 880 345, 470 330, 470 362" pathLength={1} fill="none" stroke={C.faint} strokeWidth={4} strokeLinecap="round" className={A.draw} style={dl(400)} />
      <path d="M 1040 310 C 1040 345, 1330 330, 1330 362" pathLength={1} fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" className={A.draw} style={dl(550)} />
    </svg>
    <M1cPanel x={120} w={700} tone="grey" icon="chat" title="LLM classique" cls={A.left}>
      <div className={b.on(1)}>
        <Bubble who="agent" size={23} w={560}>
          Voici un modèle de courriel :
          <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: '#fff', fontSize: 21, lineHeight: 1.4, color: C.soft }}>
            Objet : Réunion jeudi 10 h<br />
            Bonjour à tous, nous nous réunirons jeudi à 10 h dans la salle Laurentides…
          </div>
        </Bubble>
      </div>
      <div className={b.fade(1)} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6, ...dl(600) }}>
        <Eyebrow size={20} c={C.coral}>
          Reste à faire… par vous
        </Eyebrow>
        <M1cTodo>Vérifier si la salle est libre</M1cTodo>
        <M1cTodo>La réserver dans Outlook</M1cTodo>
        <M1cTodo>Copier, adapter et envoyer le courriel</M1cTodo>
      </div>
      <M1cVerdict tone="coral" icon="doc">
        Résultat : un texte. Le travail reste à faire.
      </M1cVerdict>
    </M1cPanel>
    <M1cPanel x={860} w={940} tone="blue" icon="bot" title="Agent IA" cls={A.right}>
      <M1cCall n={2} icon="calendar" call={<span>consulter_calendrier(<Js>"Laurentides"</Js>, <Js>"jeudi 10:00"</Js>)</span>}>
        Salle libre de 10 h à 12 h
      </M1cCall>
      <M1cCall n={3} icon="key" call={<span>reserver_salle(<Js>"Laurentides"</Js>, <Js>"10:00–11:00"</Js>)</span>}>
        Réservation confirmée · n° R-2291
      </M1cCall>
      <M1cCall n={4} icon="mail" call={<span>envoyer_invitation(<Js>"équipe Finance"</Js>, <Jn>8</Jn>)</span>}>
        Invitation envoyée à 8 personnes
      </M1cCall>
      <div className={b.on(5)}>
        <Bubble who="agent" size={24} w={760}>
          C’est fait : salle Laurentides réservée jeudi de 10 h à 11 h, invitation envoyée aux 8 membres de l’équipe.
        </Bubble>
      </div>
      <M1cVerdict tone="green" icon="check">
        Résultat : la tâche est accomplie.
      </M1cVerdict>
    </M1cPanel>
  </Frame>
);

// ─── M1 · 6. The three key notions (+ autonomy as their result) ────────────
const M1cNotion = ({
  x,
  n,
  icon,
  tone,
  title,
  q,
  ex,
  children,
}: {
  x: number;
  n: number;
  icon: IconName;
  tone: Tone;
  title: string;
  q: string;
  ex: string;
  children: ReactNode;
}) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: 280, width: 500, ...vars({ o: 'center bottom' }) }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: 500,
        height: 400,
        padding: '30px 30px 26px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <IconTile name={icon} tone={tone} size={68} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 42, lineHeight: 1, color: C.ink }}>{title}</span>
        <Num n={n} tone={tone} size={36} style={{ marginLeft: 'auto' }} />
      </div>
      <div style={{ marginTop: 18, fontSize: 27, lineHeight: 1.38, color: C.ink }}>{children}</div>
      <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.35, color: T[tone].fg, fontWeight: 600 }}>{q}</div>
      <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `2px dashed ${C.rule}`, fontSize: 22, lineHeight: 1.38, color: C.soft, fontStyle: 'italic' }}>
        {ex}
      </div>
    </div>
  </div>
);

const M1cPlus = ({ x, n }: { x: number; n: number }) => (
  <div
    className={b.pop(n)}
    style={{
      position: 'absolute',
      left: x - 24,
      top: 456,
      width: 48,
      height: 48,
      borderRadius: 999,
      background: C.ink,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: display,
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1,
      boxShadow: SHADOW_SM,
    }}
  >
    +
  </div>
);

const M1c_Notions: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Les 3 notions clés d’un agent</Title>
    <Lede>Objectifs, mémoire, capacité d’agir : ensemble, elles donnent l’autonomie.</Lede>
    <M1cNotion x={120} n={1} icon="target" tone="blue" title="Objectifs" q="Quand saura-t-il qu’il a terminé ?" ex="Boréal : « Chaque employé bloqué retrouve son accès en moins de 15 min. »">
      Un <b>résultat à atteindre</b>, pas une simple question à laquelle répondre.
    </M1cNotion>
    <M1cPlus x={665} n={2} />
    <M1cNotion x={710} n={2} icon="archive" tone="violet" title="Mémoire" q="Que doit-il retenir, et pourquoi ?" ex="Boréal : « Ce client a déjà reçu un crédit le mois dernier. »">
      Ce qu’il <b>retient</b> d’une étape à l’autre, d’une session à l’autre.
    </M1cNotion>
    <M1cPlus x={1255} n={3} />
    <M1cNotion x={1300} n={3} icon="tool" tone="teal" title="Capacité d’agir" q="Qu’a-t-il le droit de faire, exactement ?" ex="Boréal : réinitialiser un mot de passe, créer un billet, envoyer un courriel.">
      Des <b>outils</b> pour changer quelque chose dans vos systèmes.
    </M1cNotion>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M 370 690 C 370 745, 760 735, 830 792" pathLength={1} fill="none" stroke={T.blue.bd} strokeWidth={5} strokeLinecap="round" className={b.draw(4)} />
      <path d="M 960 690 L 960 792" pathLength={1} fill="none" stroke={T.violet.bd} strokeWidth={5} strokeLinecap="round" className={b.draw(4)} style={dl(150)} />
      <path d="M 1550 690 C 1550 745, 1160 735, 1090 792" pathLength={1} fill="none" stroke={T.teal.bd} strokeWidth={5} strokeLinecap="round" className={b.draw(4)} style={dl(300)} />
    </svg>
    <div className={b.on(4)} style={{ position: 'absolute', left: 360, top: 790, width: 1200, ...dl(700) }}>
      <div
        style={{
          boxSizing: 'border-box',
          width: 1200,
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          background: G.blue,
          borderRadius: 'var(--osd-radius)',
          boxShadow: '0 24px 48px -26px rgba(20,60,100,.65)',
          color: '#fff',
        }}
      >
        <Icon name="gauge" size={70} color="#fff" sw={1.9} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05 }}>= Autonomie</div>
          <div style={{ marginTop: 6, fontSize: 25, lineHeight: 1.35, color: 'rgba(255,255,255,.92)' }}>
            Plus les trois sont développées, plus l’agent agit seul… et plus il lui faut de garde-fous.
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── M1 · 7. Autonomy scale L0 → L5 (interactive Range) ─────────────────────
// Slider (or click a step) → description, Boréal example, human supervision.
// Beat 1: the "useful zone" bracket appears and the scale jumps to L3.
const M1cLvX = [250, 534, 818, 1102, 1386, 1670];
const M1cLevels: { name: string; tone: Tone; does: string; ex: string; sup: string; supPct: number }[] = [
  {
    name: 'Outil',
    tone: 'grey',
    does: 'Répond quand on le lui demande. Vous faites tout le reste.',
    ex: 'ChatGPT rédige un brouillon de courriel que vous copiez-collez.',
    sup: 'Vous exécutez tout',
    supPct: 100,
  },
  {
    name: 'Assistant',
    tone: 'blue',
    does: 'Suggère une action ; l’humain décide et l’exécute lui-même.',
    ex: 'Propose une réponse au client ; l’agent du service client l’envoie.',
    sup: 'Chaque sortie relue',
    supPct: 85,
  },
  {
    name: 'Exécutant supervisé',
    tone: 'teal',
    does: 'Prépare et exécute, mais un humain approuve chaque action importante.',
    ex: 'Prépare un crédit de 45 $ ; un superviseur clique « Approuver ».',
    sup: 'Approbation par action',
    supPct: 65,
  },
  {
    name: 'Autonome encadré',
    tone: 'green',
    does: 'Agit seul dans un périmètre défini ; escalade les exceptions.',
    ex: 'Réinitialise les mots de passe après MFA, transfère le reste au TI.',
    sup: 'Règles, escalade, journal',
    supPct: 45,
  },
  {
    name: 'Très autonome',
    tone: 'yellow',
    does: 'Planifie et mène des tâches longues ; l’humain contrôle après coup.',
    ex: 'Passe seul les commandes courantes aux fournisseurs, sous un plafond.',
    sup: 'Audit a posteriori',
    supPct: 22,
  },
  {
    name: 'Autonomie complète',
    tone: 'coral',
    does: 'Se fixe ses propres sous-objectifs et agit sans supervision.',
    ex: 'Négocier seul les contrats fournisseurs : à éviter (on le verra au Jour 2).',
    sup: 'Aucune : rarement acceptable',
    supPct: 4,
  },
];

const M1cStep = ({ i, lvl, onPick }: { i: number; lvl: number; onPick: (i: number) => void }) => {
  const m = M1cLevels[i];
  const on = i === lvl;
  const h = 100 + i * 34;
  const fg = m.tone === 'yellow' ? C.ink : '#fff';
  return (
    <div className={A.growY} style={{ position: 'absolute', left: M1cLvX[i] - 130, top: 572 - h, width: 260, height: h, ...dl(100 + i * 110) }}>
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          onPick(i);
        }}
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: 'none',
          borderRadius: '16px 16px 6px 6px',
          padding: '14px 16px',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          background: on ? STRONG[m.tone] : T[m.tone].bg,
          color: on ? fg : T[m.tone].fg,
          boxShadow: on ? `0 0 0 5px ${T[m.tone].bd}, ${SHADOW}` : SHADOW_SM,
          transition: `background 350ms ${EASE}, color 350ms ${EASE}, box-shadow 350ms ${EASE}`,
        }}
      >
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>L{i}</span>
        <span style={{ marginTop: 4, fontFamily: body, fontWeight: 600, fontSize: 22, lineHeight: 1.2 }}>{m.name}</span>
      </button>
    </div>
  );
};

const M1cInfo = ({ icon, title, tone, children }: { icon: IconName; title: string; tone: Tone; children: ReactNode }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={26} color={T[tone].fg} sw={2.4} />
      <Eyebrow size={20} c={T[tone].fg}>
        {title}
      </Eyebrow>
    </div>
    <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.36, color: C.ink }}>{children}</div>
  </div>
);

const M1c_Autonomy: Page = () => {
  const [ref, beats] = useBeats();
  const [lvl, setLvl] = useState(0);
  useEffect(() => {
    if (beats >= 1 && beats < 99) setLvl(3);
  }, [beats]);
  const m = M1cLevels[lvl];
  const tone: Tone = m.tone === 'grey' ? 'blue' : m.tone;
  return (
    <Frame mod={1} beats={1} label="Module 01 · Échelle d’autonomie">
      <Title>L’échelle d’autonomie : de L0 à L5</Title>
      <Lede>Glissez le curseur ou cliquez une marche : qui décide, qui agit, qui surveille ?</Lede>
      <div ref={ref} className={b.fade(1)} style={{ position: 'absolute', left: 676, top: 290, width: 568 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tag tone="green" size={22}>
            Zone utile en entreprise : L2 – L3
          </Tag>
        </div>
        <div style={{ marginTop: 8, height: 18, boxSizing: 'border-box', border: `4px solid ${C.green}`, borderBottom: 'none', borderRadius: '10px 10px 0 0' }} />
      </div>
      <M1cStep i={0} lvl={lvl} onPick={setLvl} />
      <M1cStep i={1} lvl={lvl} onPick={setLvl} />
      <M1cStep i={2} lvl={lvl} onPick={setLvl} />
      <M1cStep i={3} lvl={lvl} onPick={setLvl} />
      <M1cStep i={4} lvl={lvl} onPick={setLvl} />
      <M1cStep i={5} lvl={lvl} onPick={setLvl} />
      <div className={A.fade} style={{ position: 'absolute', left: 229, top: 596, width: 1462, ...dl(700) }}>
        <Range value={lvl} onChange={setLvl} min={0} max={5} w={1462} tone={tone} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 668, width: 1680, ...dl(500) }}>
        <div
          style={{
            boxSizing: 'border-box',
            width: 1680,
            padding: '22px 34px 26px',
            background: C.card,
            borderRadius: 'var(--osd-radius)',
            boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[m.tone]}`,
            transition: `box-shadow 350ms ${EASE}`,
          }}
        >
          <div key={lvl} className={A.fade} style={{ display: 'flex', gap: 40 }}>
            <div style={{ flex: 'none', width: 250 }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1, color: m.tone === 'yellow' ? C.amber : STRONG[m.tone] }}>L{lvl}</div>
              <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{m.name}</div>
            </div>
            <M1cInfo icon="bot" title="Ce que fait l’IA" tone={tone}>
              {m.does}
            </M1cInfo>
            <M1cInfo icon="truck" title="Exemple Boréal" tone="teal">
              {m.ex}
            </M1cInfo>
            <div style={{ flex: 'none', width: 300 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="humanCheck" size={26} color={T.violet.fg} sw={2.4} />
                <Eyebrow size={20} c={T.violet.fg}>
                  Supervision humaine
                </Eyebrow>
              </div>
              <div style={{ marginTop: 14, height: 16, borderRadius: 8, background: C.rule, overflow: 'hidden' }}>
                <div style={{ width: `${m.supPct}%`, height: '100%', borderRadius: 8, background: C.violet, transition: `width 600ms ${EASE}` }} />
              </div>
              <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.3, fontWeight: 600, color: C.ink }}>{m.sup}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 890, width: 1680 }}>
        <Callout title="" tone="green" icon="target" size={26} style={{ padding: '16px 28px', alignItems: 'center' }}>
          La plupart des agents utiles aujourd’hui sont en <Strong c={T.green.fg}>L2 – L3</Strong> : l’agent agit, <Hl>l’humain garde la main sur ce qui compte</Hl>.
        </Callout>
      </div>
    </Frame>
  );
};

// @@PAGES-BEGIN
export const __pages = [M1c_Compare, M1c_Demo, M1c_Notions, M1c_Autonomy];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 5 min

OBJECTIF — Montrer la différence de nature entre un LLM conversationnel et un agent, et finir sur le risque, qui justifiera les garde-fous du Jour 2.

DIRE — « À gauche, ce que vous connaissez : ChatGPT, Copilot en clavardage. À droite, un agent. Le moteur est souvent le même modèle ; ce qui change, c'est ce qu'on a branché autour. »

ANIMATION — Une ligne par clic ; lisez la gauche, pause, puis la droite :
→ beat 1 : POSTURE. « Le LLM attend votre question ; l'agent part d'un objectif. »
→ beat 2 : DÉROULEMENT. « Un seul tour d'un côté, une boucle de l'autre. »
→ beat 3 : PRODUIT. « Le LLM vous donne du texte : c'est VOUS qui faites le travail ensuite. »
→ beat 4 : MÉMOIRE. « Sans mémoire, chaque conversation repart de zéro. »
→ beat 5 : CONNAISSANCES. « Le modèle seul s'arrête à sa date d'entraînement. »
→ beat 6 : LE RISQUE, en rouge. « Un texte faux, vous le relisez. Une action fausse — un remboursement, un compte supprimé — a déjà eu lieu. »
→ beat 7 : le message à retenir.

INTERACTION — « Quelle ligne vous inquiète le plus ? » Réponse fréquente : la dernière. C'est le sujet du module 6.

TRANSITION — « Voyons-le en direct : la même demande, envoyée aux deux. »`,
  `⏱ 5 min · DÉMO

OBJECTIF — Rendre la différence palpable avec une demande banale du quotidien de Boréal : le LLM produit un texte, l'agent produit un résultat.

DIRE — Lisez la demande de Marie à voix haute. « Une demande de trente secondes. Envoyons-la aux deux mondes. »

ANIMATION —
→ beat 1 : réponse du LLM. « Très poli… mais regardez la liste : vérifier, réserver, envoyer. C'est encore Marie qui fait tout. »
→ beat 2 : l'agent consulte le calendrier. « Il ne devine pas : il vérifie que la salle est libre. »
→ beat 3 : il réserve. « Une vraie action, dans un vrai système, avec un numéro de confirmation. »
→ beat 4 : il envoie l'invitation aux huit membres de l'équipe.
→ beat 5 : il confirme à Marie ce qu'il a fait. « Remarquez : il rend compte. C'est essentiel pour la confiance. »
→ beat 6 : les deux verdicts.

À SOULIGNER — « Chaque ligne grise à droite est un appel d'outil : le modèle demande, le système exécute. Et si la salle est prise ? Si "l'équipe" est ambiguë ? Un bon agent demande une précision plutôt que d'inventer. »

INTERACTION — « Qui aurait aimé déléguer ce genre de petite tâche ce matin ? » Notez que c'est un cas à faible risque : un bon premier candidat.

TRANSITION — « Ce qui permet à l'agent de faire ça tient en trois notions. »`,
  `⏱ 4 min

OBJECTIF — Fixer le vocabulaire de base du module : objectifs, mémoire, capacité d'agir. L'autonomie n'est pas une quatrième brique : c'est le résultat des trois.

DIRE — « Si vous ne retenez que trois mots de ce matin, retenez ceux-là. Ils vont structurer toute la conception d'un agent au Jour 2. »

ANIMATION —
→ beat 1 : OBJECTIFS. « Un agent ne répond pas à une question : il poursuit un résultat. La question clé : quand saura-t-il qu'il a terminé ? Si vous ne savez pas y répondre, l'agent non plus. »
→ beat 2 : MÉMOIRE. « Pour enchaîner des étapes, il doit se souvenir de ce qu'il a fait — et de ce qui s'est passé avant : le crédit du mois dernier. »
→ beat 3 : CAPACITÉ D'AGIR. « Ce sont les outils. La vraie question n'est pas "que peut-il faire ?" mais "qu'a-t-il le DROIT de faire ?" »
→ beat 4 : les trois convergent vers l'AUTONOMIE. « Plus l'objectif est large, la mémoire riche et les outils puissants, plus l'agent agit seul. C'est un réglage, pas un interrupteur. »

INTERACTION — « Pour la tâche hebdomadaire à laquelle vous pensiez tantôt : laquelle des trois notions serait la plus difficile à mettre en place chez vous ? » Souvent : les outils (accès aux systèmes) ou la mémoire (données dispersées).

TRANSITION — « Puisque l'autonomie est un réglage, regardons les crans de ce réglage. »`,
  `⏱ 5 min · INTERACTIF

OBJECTIF — Montrer que l'autonomie se règle par paliers, et que la plupart des agents utiles en entreprise se situent en L2–L3 : l'agent agit dans un cadre, un humain garde la main sur ce qui compte.

DIRE — « On parle des agents comme s'ils étaient tout ou rien. C'est plutôt une échelle, comme les niveaux de la voiture autonome. »

INTERACTION — Glissez le curseur de L0 à L5 (ou cliquez les marches) en lisant l'exemple Boréal :
L0 : un brouillon. L1 : il suggère, l'humain envoie. L2 : il prépare le crédit, un superviseur approuve. L3 : il réinitialise les mots de passe après MFA et transfère le reste. L4 : il passe des commandes sous plafond, on audite après. L5 : négocier seul avec les fournisseurs, qu'on classera « à éviter » demain.
Montrez la barre violette : la supervision diminue à chaque cran.

→ beat 1 : l'accolade verte apparaît et le curseur revient sur L3. « Voilà la zone où se trouvent la plupart des projets qui réussissent. Monter d'un cran, ça se mérite : avec des mesures et de la confiance. »

QUESTION AU GROUPE — « À quel niveau mettriez-vous un agent qui répond aux courriels des clients de Boréal ? » Réponses attendues : L2 au départ, L3 pour les demandes simples une fois les résultats mesurés.

TRANSITION — « Reprenons maintenant chacune des trois notions en détail, en commençant par les objectifs. »`,
];
// @@NOTES-END
