// ─── M6 · Divider ───────────────────────────────────────────────────────────
const M6_Divider: Page = () => (
  <Section n={6} title="Atelier 2 · Un mini-projet avec l’IA" sub="Un de vos projets, anonymisé, un imprévu de chantier, des messages à chaque public." dur="≈ 2 h 30" kind="atelier">
    <SecItem n={1}>Choisir un projet et le planifier avec l’IA</SecItem>
    <SecItem n={2}>Affronter un imprévu : compte rendu et suivi</SecItem>
    <SecItem n={3}>Communiquer : client, équipe, fournisseur, adjointe</SecItem>
    <SecItem n={4}>Présenter (2 ou 3 volontaires) et donner de la rétroaction</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── M6 · Mission ───────────────────────────────────────────────────────────
const M6Step = ({ n, tone, icon, t, title, children }: { n: number; tone: Tone; icon: IconName; t: string; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(n * 120) }}>
    <div style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconTile name={icon} tone={tone} size={62} solid />
        <Tag tone="grey" size={21}>
          {t}
        </Tag>
      </div>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>
        {n}. {title}
      </div>
      <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_Brief: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>La mission : un mini-projet, de bout en bout</Title>
    <Lede>En autonomie, chacun sur son poste. L’IA à chaque étape, et votre jugement à chaque sortie.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 24 }}>
      <M6Step n={1} tone="teal" icon="gantt" t="30 min" title="Planifier">
        Fiche de démarrage, découpage, échéancier, risques, RACI : dans l’outil.
      </M6Step>
      <M6Step n={2} tone="violet" icon="eye" t="25 min" title="Suivre">
        Un imprévu tombe : compte rendu, plan mis à jour, rapport.
      </M6Step>
      <M6Step n={3} tone="yellow" icon="megaphone" t="20 min" title="Communiquer">
        Trois messages, trois publics, et vos règles de transfert à l’adjointe.
      </M6Step>
      <M6Step n={4} tone="green" icon="video" t="3 min" title="Présenter">
        2 ou 3 volontaires, en partage d’écran : le résultat, l’imprévu, ce que l’IA a raté.
      </M6Step>
    </div>
    <Callout cls={A.in} title="La règle du jeu" tone="blue" icon="star" size={26} style={{ position: 'absolute', left: 120, top: 680, width: 1680, ...dl(700) }}>
      On ne juge pas le plus beau plan, mais le plus <b>réaliste</b> et la façon dont vous avez <b>vérifié</b> l’IA.
    </Callout>
  </Frame>
);

// ─── M6 · Pick a project ────────────────────────────────────────────────────
const M6Proj = ({ d, icon, tone, title, children, facts }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode; facts: string }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 320, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={54} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 31, lineHeight: 1.1, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', fontSize: 21, fontWeight: 600, color: T[tone].fg }}>{facts}</div>
    </div>
  </div>
);

const M6_Projects: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · Choisir un projet">
    <Title>Choisissez votre projet</Title>
    <Lede>De préférence l’un des vôtres, anonymisé. Sinon, l’un des quatre projets du fil rouge.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M6Proj d={100} icon="star" tone="blue" title="Votre propre projet" facts="Recommandé · sans client, prix ni adresse">
        Un de vos projets en cours : c’est celui qui vous servira lundi matin.
      </M6Proj>
      <M6Proj d={200} icon="facade" tone="teal" title="La pose du hall des Méandres" facts="Installation · 8 semaines · Mathieu">
        Le mur-rideau et la verrière du hall, de la livraison du verre à la fin de la pose.
      </M6Proj>
      <M6Proj d={300} icon="helmet" tone="coral" title="Les déficiences de fin de projet" facts="Fermeture · 4 semaines · Patrice">
        De la visite finale avec l’architecte à la levée de la dernière déficience.
      </M6Proj>
      <M6Proj d={400} icon="chat" tone="green" title="Un appel de service après-vente" facts="Après-vente · 3 semaines · Nadia">
        Une infiltration d’eau signalée par un client : diagnostic, intervention, suivi.
      </M6Proj>
      <M6Proj d={500} icon="money" tone="yellow" title="Le transfert d’un nouveau contrat" facts="Ventes → projet · 2 semaines · Éric">
        Des fenêtres pour une école : de la soumission signée à la réunion de démarrage.
      </M6Proj>
      <div className={A.in} style={{ width: 540, height: 320, boxSizing: 'border-box', borderRadius: 18, border: `3px dashed ${C.rule}`, padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, ...dl(600) }}>
        <Icon name="lock" size={44} color={C.coral} />
        <div style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>
          Projet réel : appliquez le <b>feu tricolore</b> du module 5 avant de coller quoi que ce soit.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── M6 · Phase pages (shared layout) ───────────────────────────────────────
const M6Do = ({ id, children }: { id: string; children: ReactNode }) => (
  <CheckItem id={id} size={26}>
    {children}
  </CheckItem>
);

const M6Phase = ({
  n,
  tone,
  title,
  lede,
  timer,
  minutes,
  items,
  tip,
}: {
  n: number;
  tone: Tone;
  title: string;
  lede: string;
  timer: string;
  minutes: number;
  items: ReactNode;
  tip: ReactNode;
}) => (
  <Frame mod={6} kind="atelier" label={`Atelier 2 · Étape ${n}`}>
    <Title>{title}</Title>
    <Lede>{lede}</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1060, ...dl(100) }}>
      <Eyebrow c={T[tone].fg} size={22} style={{ marginBottom: 12 }}>
        Livrables de l’étape
      </Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{items}</div>
    </Checklist>
    <Timer id={timer} minutes={minutes} label={`Étape ${n}`} cls={A.in} style={{ position: 'absolute', left: 1260, top: 280, width: 540, ...dl(250) }} />
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 600, width: 540, ...dl(400) }}>
      <Card tone={tone} icon="book" title="Dans la bibliothèque" size={23}>
        {tip}
      </Card>
    </div>
  </Frame>
);

const M6_Plan: Page = () => (
  <M6Phase
    n={1}
    tone="teal"
    title="Étape 1 · Planifier avec l’IA"
    lede="Comme à l’atelier 1, en plus rapide : vous connaissez maintenant les pièges."
    timer="m6-plan"
    minutes={30}
    tip="Modèles « Fiche de démarrage » et « Relance ». N’oubliez pas : « Signale ce que tu as supposé. »"
    items={
      <>
        <M6Do id="m6p-1">Une fiche de démarrage d’une page, avec les points à clarifier</M6Do>
        <M6Do id="m6p-2">Découpage en lots et tâches, avec dépendances</M6Do>
        <M6Do id="m6p-3">Échéancier avec 3 jalons et le chemin critique</M6Do>
        <M6Do id="m6p-4">5 risques, chacun avec une mesure</M6Do>
        <M6Do id="m6p-5">RACI vérifiée, et les tâches dans l’outil</M6Do>
      </>
    }
  />
);

// ─── M6 · The twist: draw an unexpected event ───────────────────────────────
const M6_EVENTS: { icon: IconName; tone: Tone; title: string; text: string }[] = [
  { icon: 'truck', tone: 'coral', title: 'Livraison en retard', text: 'Le verrier annonce 3 semaines de retard sur les unités scellées, sans solution de rechange.' },
  { icon: 'money', tone: 'yellow', title: 'Avis de modification', text: 'L’EG demande d’ajouter 4 fenêtres et veut votre prix d’ici vendredi.' },
  { icon: 'helmet', tone: 'violet', title: 'Contremaître absent', text: 'Le contremaître de l’équipe de pose est absent deux semaines, à partir de demain.' },
  { icon: 'calendar', tone: 'coral', title: 'Date avancée', text: 'L’EG avance d’une semaine la date du bâtiment fermé.' },
  { icon: 'camera', tone: 'blue', title: 'Déficience découverte', text: 'À la visite, l’architecte refuse 6 fenêtres : écart de couleur des profilés.' },
  { icon: 'chat', tone: 'teal', title: 'Client mécontent', text: 'Le client se plaint par écrit d’une infiltration d’eau et menace de retenir un paiement.' },
];

const M6_Twist: Page = () => {
  const [i, setI] = useState<number | null>(null);
  const [spin, setSpin] = useState(0);
  const draw = () => {
    let next = Math.floor(Math.random() * M6_EVENTS.length);
    if (next === i) next = (next + 1) % M6_EVENTS.length;
    setI(next);
    setSpin((s) => s + 1);
  };
  const ev = i === null ? null : M6_EVENTS[i];
  return (
    <Frame mod={6} kind="atelier" label="Atelier 2 · L’imprévu">
      <Title>Coup de théâtre : un imprévu pour chacun</Title>
      <Lede>Comme dans la vraie vie : il arrive au pire moment. Chaque participant reçoit le sien.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 980, height: 600, ...dl(100) }}>
        {ev ? (
          <div key={spin} className={A.pop} style={{ width: 980, height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 24, boxShadow: `${SHADOW}, inset 0 10px 0 ${STRONG[ev.tone]}`, padding: '44px 52px', animationDuration: '500ms' }}>
            <IconTile name={ev.icon} tone={ev.tone} size={110} solid />
            <div style={{ marginTop: 28, fontFamily: display, fontWeight: 700, fontSize: 72, lineHeight: 1.05, color: C.ink }}>{ev.title}</div>
            <div style={{ marginTop: 18, fontSize: 36, lineHeight: 1.4, color: C.soft }}>{ev.text}</div>
          </div>
        ) : (
          <div style={{ width: 980, height: 600, boxSizing: 'border-box', borderRadius: 24, border: `4px dashed ${C.rule}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div className={A.float}>
              <Icon name="alert" size={120} color={C.coral} sw={1.6} />
            </div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>Quel imprévu pour vous ?</div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1160, top: 290, width: 640 }}>
        <Btn icon="sparkles" tone="coral" size={32} onClick={draw}>
          {ev ? 'Tirer un autre imprévu' : 'Tirer un imprévu'}
        </Btn>
        <div className={A.in} style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, ...dl(300) }}>
          <Eyebrow c={C.muted} size={22}>
            Les six imprévus possibles
          </Eyebrow>
          <Tag tone="coral">Livraison en retard</Tag>
          <Tag tone="yellow">Avis de modification</Tag>
          <Tag tone="violet">Contremaître absent</Tag>
          <Tag tone="coral">Échéance avancée</Tag>
          <Tag tone="blue">Déficience découverte</Tag>
          <Tag tone="teal">Client mécontent</Tag>
        </div>
      </div>
    </Frame>
  );
};

const M6_Track: Page = () => (
  <M6Phase
    n={2}
    tone="violet"
    title="Étape 2 · Suivre : réagir à l’imprévu"
    lede="Écrivez (ou dictez) les notes brutes d’une réunion de chantier sur l’imprévu, puis laissez l’IA vous aider."
    timer="m6-track"
    minutes={25}
    tip="Modèles « Compte rendu » et « Rapport de visite ». Exigez [à confirmer] plutôt que des inventions."
    items={
      <>
        <M6Do id="m6t-1">8 à 10 lignes de notes brutes, comme en sortant de réunion</M6Do>
        <M6Do id="m6t-2">Compte rendu généré : décisions, actions, points ouverts</M6Do>
        <M6Do id="m6t-3">Relecture : les quatre erreurs typiques vérifiées</M6Do>
        <M6Do id="m6t-4">Plan mis à jour dans l’outil, chemin critique revu</M6Do>
        <M6Do id="m6t-5">Rapport à la direction avec une météo assumée</M6Do>
      </>
    }
  />
);

const M6_Comm: Page = () => (
  <M6Phase
    n={3}
    tone="yellow"
    title="Étape 3 · Communiquer à chaque public"
    lede="Un même imprévu, trois messages. Puis vos règles de transfert à l’adjointe."
    timer="m6-comm"
    minutes={20}
    tip="Modèle « Relance ». Demandez aussi : « Relis ce courriel comme si tu étais le destinataire. »"
    items={
      <>
        <M6Do id="m6c-1">Courriel au client ou à l’EG : impact et deux options</M6Do>
        <M6Do id="m6c-2">Message à l’équipe : ce qui change, qui fait quoi</M6Do>
        <M6Do id="m6c-3">Relance au fournisseur ou à l’architecte</M6Do>
        <M6Do id="m6c-4">Données anonymisées avant tout copier-coller</M6Do>
        <M6Do id="m6c-5">Vos règles de transfert : 5 cas, chacun avec sa consigne</M6Do>
      </>
    }
  />
);

// ─── M6 · Presentation format ───────────────────────────────────────────────
const M6Slot = ({ n, t, title, children }: { n: number; t: string; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(n * 110) }}>
    <Num n={n} tone="green" size={52} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 23, color: C.muted }}>{children}</div>
    </div>
    <Tag tone="grey" size={21}>
      {t}
    </Tag>
  </div>
);

const M6_Pitch: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · Présenter">
    <Title>Votre présentation : 3 minutes, 5 temps</Title>
    <Lede>Deux ou trois volontaires, en partage d’écran : montrez l’outil, pas des diapositives.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M6Slot n={1} t="20 s" title="Le projet en une phrase">
        Le bâtiment, les systèmes, l’échéance
      </M6Slot>
      <M6Slot n={2} t="50 s" title="Le plan, dans l’outil">
        Lots, jalons, chemin critique, un risque
      </M6Slot>
      <M6Slot n={3} t="40 s" title="L’imprévu et votre réaction">
        Ce qui a changé dans le plan
      </M6Slot>
      <M6Slot n={4} t="30 s" title="Un message, lu à voix haute">
        Au client, à l’EG ou à l’équipe
      </M6Slot>
      <M6Slot n={5} t="40 s" title="Ce que l’IA a raté">
        Et ce que vous avez corrigé
      </M6Slot>
    </div>
    <Timer id="m6-pitch" minutes={3} label="Présentation" cls={A.in} style={{ position: 'absolute', left: 1260, top: 280, width: 540, ...dl(300) }} />
    <Callout cls={A.in} title="Pour le public" tone="blue" icon="note" size={24} style={{ position: 'absolute', left: 1260, top: 620, width: 540, ...dl(500) }}>
      Préparez un point fort et une piste pour chaque présentation.
    </Callout>
  </Frame>
);

// ─── M6 · Work time ─────────────────────────────────────────────────────────
const M6_Work: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · À vous">
    <Title>À vous de jouer !</Title>
    <Lede>Un point d’étape à chaque changement d’étape. L’imprévu tombe après l’étape 1.</Lede>
    <Timer id="m6-work" minutes={75} label="Atelier 2" cls={A.in} style={{ position: 'absolute', left: 120, top: 290, ...dl(100) }} />
    <div style={{ position: 'absolute', left: 640, top: 290, width: 1160, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="teal" d={200}>
        <b>0:00 – 0:30</b> · Planifier : charte, découpage, échéancier, risques, RACI
      </SynthRow>
      <SynthRow n={2} tone="violet" d={300}>
        <b>0:30 – 0:55</b> · Suivre : l’imprévu, compte rendu, plan mis à jour, rapport
      </SynthRow>
      <SynthRow n={3} tone="yellow" d={400}>
        <b>0:55 – 1:15</b> · Communiquer : trois messages et les règles de transfert
      </SynthRow>
      <SynthRow n={4} tone="green" d={500}>
        <b>Ensuite</b> · Pause, puis 2 ou 3 présentations volontaires, 3 minutes chacune
      </SynthRow>
    </div>
    <Callout cls={A.in} title="Coincés ?" tone="blue" icon="chat" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 460, ...dl(600) }}>
      Signalez-le au micro, ou demandez à Copilot de vous poser ses questions.
    </Callout>
  </Frame>
);

// ─── M6 · Collective feedback grid (interactive stars) ──────────────────────
const M6StarRow = ({ label, sub, v, set }: { label: string; sub: string; v: number; set: (n: number) => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 0', borderTop: `1.5px solid ${C.rule}` }}>
    <div style={{ width: 560, flex: 'none' }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{sub}</div>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          data-osd-interactive
          onClick={(e) => {
            e.currentTarget.blur();
            set(v === s ? s - 1 : s);
          }}
          style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer' }}
          title={`${s} sur 5`}
        >
          <svg width={52} height={52} viewBox="0 0 24 24">
            <path
              d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
              fill={s <= v ? C.yellow : '#fff'}
              stroke={s <= v ? C.amber : C.faint}
              strokeWidth={1.6}
              strokeLinejoin="round"
              style={{ transition: 'fill 200ms' }}
            />
          </svg>
        </button>
      ))}
    </div>
  </div>
);

const M6_Feedback: Page = () => {
  const [team, setTeam] = useState(1);
  const [r, setR] = useState<number[]>([0, 0, 0, 0]);
  const set = (i: number) => (n: number) => setR((o) => o.map((x, j) => (j === i ? n : x)));
  const total = r.reduce((a, x) => a + x, 0);
  return (
    <Frame mod={6} kind="atelier" label="Atelier 2 · Rétroaction collective">
      <Title>Rétroaction collective</Title>
      <Lede>Après chaque présentation volontaire : un point fort et une piste. Le formateur synthétise la grille.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1140, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 32px 10px', ...dl(100) }}>
        <M6StarRow label="Un plan réaliste" sub="Dates, dépendances et responsables vérifiés" v={r[0]} set={set(0)} />
        <M6StarRow label="Une réaction à l’imprévu" sub="Le plan et le chemin critique mis à jour" v={r[1]} set={set(1)} />
        <M6StarRow label="Des messages adaptés" sub="Le bon ton pour chaque public" v={r[2]} set={set(2)} />
        <M6StarRow label="Un usage lucide de l’IA" sub="Ce qui a été corrigé, les données protégées" v={r[3]} set={set(3)} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 270, width: 480, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 30px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={22}>
          Participant {team}
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 110, lineHeight: 1, color: total >= 15 ? C.green : total >= 10 ? C.amber : C.blue }}>{total}</span>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 44, color: C.faint }}>/ 20</span>
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
          <Btn
            icon="arrow"
            size={22}
            onClick={() => {
              setTeam((t) => t + 1);
              setR([0, 0, 0, 0]);
            }}
          >
            Participant suivant
          </Btn>
          <Btn icon="reset" ghost tone="grey" size={22} onClick={() => setR([0, 0, 0, 0])} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1320, top: 600, width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Callout cls={A.in} title="Un point fort" tone="green" icon="star" size={24} style={dl(400)}>
          « Ce qui m’a convaincu, c’est… »
        </Callout>
        <Callout cls={A.in} title="Une piste" tone="yellow" icon="bulb" size={24} style={dl(500)}>
          « Et si vous essayiez… »
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M6 · Debrief ───────────────────────────────────────────────────────────
const M6_Debrief: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · Débriefing">
    <Title>Ce que l’atelier nous apprend</Title>
    <Lede>Un dernier sondage, puis trois questions pour tous.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Où l’IA vous a-t-elle le plus aidés ?" sub="Et où vous a-t-elle ralentis ?" d={100} />
      <AskCard n={2} title="Quelle erreur auriez-vous laissé passer ?" sub="Sans la relecture" d={220} />
      <AskCard n={3} title="Que garderez-vous lundi ?" sub="Un outil, une demande, un réflexe" d={340} />
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage · le plus grand gain de temps
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Un numéro par personne, à voix haute
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="plan" icon="gantt" tone="teal" label="1 · Le plan de départ" />
        <PollRow id="cr" icon="note" tone="violet" label="2 · Le compte rendu" />
        <PollRow id="mail" icon="inbox" tone="blue" label="3 · Le tri et les relances" />
        <PollRow id="msg" icon="mail" tone="yellow" label="4 · Les messages aux publics" />
        <PollRow id="none" icon="clock" tone="coral" label="5 · Aucun : la vérification a tout pris" />
      </Poll>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Divider, M6_Brief, M6_Projects, M6_Plan, M6_Twist, M6_Track, M6_Comm, M6_Pitch, M6_Work, M6_Feedback, M6_Debrief];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DE L'ATELIER 2 (≈ 13 h 00)

OBJECTIF — Lancer l'atelier final avec énergie.

DIRE — « Atelier 2 : un mini-projet avec l'IA, de bout en bout, chacun sur son poste. Et cette fois, si possible, sur un de vos vrais projets, anonymisé. Vous allez tout mobiliser : planifier comme hier, rédiger des comptes rendus comme ce matin, relancer, transférer à l'adjointe, et appliquer les règles du module 5. Avec une surprise en cours de route. »

LOGISTIQUE — Classe virtuelle : chacun garde la réunion ouverte, micro coupé, et travaille dans Copilot avec son compte Lessard, puis dans Excel, Planner ou Smartsheet. Demandez un « prêt » à chacun.

TRANSITION — « Voici la mission. »`,
  `⏱ 3 min · LA MISSION

DIRE — « Quatre étapes, en autonomie. Planifier en 30 minutes : vous connaissez la méthode. Suivre en 25 minutes : un imprévu de chantier va tomber, il faudra réagir. Communiquer en 20 minutes : trois messages, et vos règles de transfert à l'adjointe. Puis deux ou trois volontaires présentent leur travail, 3 minutes chacun, en partage d'écran. »

LA RÈGLE DU JEU — « On ne récompense pas le plus beau plan. On regarde le plus réaliste, et la façon dont vous avez vérifié l'IA. Dire "l'IA s'est trompée ici et je l'ai corrigée", c'est un point fort. »

PARCOURS ADJOINTE — Les adjointes peuvent prendre le projet de service après-vente, ou suivre un de leurs dossiers réels du point de vue du suivi : relances, classement, transferts reçus.

TRANSITION — « Premier choix : votre projet. »`,
  `⏱ 4 min · CHOIX DU PROJET

DIRE — « Le meilleur choix : un de vos projets en cours. C'est celui qui vous servira lundi. Sinon, quatre projets du fil rouge, un par étape du cycle : la pose du hall, les déficiences de fin de projet, un appel de service après-vente, le transfert d'un nouveau contrat. »

ANIMATION — Chacun annonce son choix (« mon projet », « hall », « déficiences », « après-vente », « transfert »). Notez les choix : ils vous serviront pour l'imprévu.

PROJET RÉEL — Rappelez le feu tricolore du module 5 : pas de nom de client, pas de prix, pas d'adresse, pas de nom d'employé. On écrit « l'EG », « l'architecte », « le bâtiment institutionnel ».

TRANSITION — « Étape 1 : planifier. »`,
  `⏱ 30 min · ÉTAPE 1 · PLANIFIER

ANIMATION — Lancez le minuteur. Les livrables restent affichés : laissez cette page en partage pendant le travail. À mi-parcours, point d'étape : « Où en êtes-vous (1 à 5) ? »

DIRE — « Comme hier, mais plus vite. Partez des modèles de la bibliothèque : fiche de démarrage, relance. Et n'oubliez pas : "Signale ce que tu as supposé." »

QUESTIONS À POSER (au micro, ou à la personne qui partage son écran) —
• « Donnez-moi votre chemin critique en une phrase. »
• « Quels délais l'IA a-t-elle inventés ? »

AIDE — Quelqu'un est bloqué : invitez-le à partager son écran 2 minutes pendant que les autres continuent.

TRANSITION — À la fin de l'étape 1 : « Vos plans sont prêts ? Parfait. Parce que le chantier arrive. »`,
  `⏱ 5 min · L'IMPRÉVU (bouton interactif)

ANIMATION — Appelez chaque participant par son prénom et cliquez « Tirer un imprévu » pour lui. Annoncez-le avec un peu de théâtre et écrivez-le dans le Chat (« Prénom : avis de modification »). Si l'imprévu n'a pas d'effet sur son projet, tirez-en un autre. Grand groupe : tirez un imprévu par projet choisi.

LES SIX IMPRÉVUS — livraison du verre en retard de 3 semaines ; avis de modification (4 fenêtres à ajouter, prix demandé d'ici vendredi) ; contremaître absent 2 semaines ; bâtiment fermé avancé d'une semaine ; 6 fenêtres refusées par l'architecte ; client mécontent qui menace de retenir un paiement.

DIRE — « Comme dans la vraie vie, il arrive au pire moment. Votre plan était beau ; voyons s'il est solide. »

POUR L'AVIS DE MODIFICATION — Rappelez : l'IA peut comparer la demande au contrat et préparer la réponse ; le prix et l'acceptation restent une décision humaine.

TRANSITION — « Étape 2 : suivre. »`,
  `⏱ 25 min · ÉTAPE 2 · SUIVRE

ANIMATION — Lancez le minuteur. Laissez cette page en partage.

DIRE — « Imaginez que vous sortez de la réunion de chantier où l'imprévu a été discuté. Écrivez, ou dictez au téléphone, 8 à 10 lignes de notes brutes, en vrac : qui a dit quoi, ce qui a été décidé, ce qui reste ouvert. Puis l'IA en fait le compte rendu, avec le modèle de ce matin. Relisez-le avec les quatre erreurs typiques : fausse décision, mauvaise personne, date inventée, point ouvert disparu. Mettez le plan à jour dans l'outil. Et rédigez le rapport à la direction, avec une météo que vous assumez. »

POINT D'ÉTAPE — À mi-parcours : « Une erreur que l'IA a faite dans votre compte rendu ? » Faites-en raconter deux ou trois : c'est très parlant.

TRANSITION — « Étape 3 : communiquer. »`,
  `⏱ 20 min · ÉTAPE 3 · COMMUNIQUER

ANIMATION — Lancez le minuteur.

DIRE — « Le même imprévu, trois publics. Au client ou à l'EG : impact et deux options. À l'équipe : ce qui change et qui fait quoi. Au fournisseur ou à l'architecte : une relance précise. Anonymisez avant de coller. Et terminez par vos règles de transfert : cinq situations courantes, et pour chacune, ce que l'adjointe reçoit et avec quelle consigne. »

EXEMPLE DE RÈGLE — « Certificat d'assurance demandé par l'EG : transférer à l'adjointe, consigne "envoyer la version à jour, me mettre en copie". »

ASTUCE — « Relis ce courriel comme si tu étais le destinataire : qu'est-ce qui pourrait l'irriter ? »

TRANSITION — « Préparez votre présentation : voici le format. »`,
  `⏱ 2 min · FORMAT DE PRÉSENTATION

DIRE — « Trois minutes, cinq temps, en partage d'écran. Le projet en une phrase. Le plan, montré dans l'outil, pas dans des diapositives. L'imprévu et votre réaction. Un message lu à voix haute. Et surtout : ce que l'IA a raté, et ce que vous avez corrigé. »

VOLONTAIRES — Deux ou trois volontaires présentent. Demandez-les maintenant pour qu'ils se préparent ; si personne ne se propose, sollicitez une personne qui a travaillé sur un vrai projet. Les autres peuvent déposer une capture de leur plan et leur « ce que l'IA a raté » dans le Chat. Rappelez de fermer les onglets personnels avant de partager l'écran.

POUR LE PUBLIC — « Pendant chaque présentation, préparez un point fort et une piste. »

TRANSITION — « Il vous reste du temps de travail : à vous ! » (Ou passez directement aux présentations après la pause.)`,
  `⏱ 75 min · TRAVAIL INDIVIDUEL (vue d'ensemble)

ANIMATION — Cette page sert de tableau de bord pendant tout l'atelier : le minuteur de 75 minutes continue même si vous changez de page. Laissez-la en partage pendant le travail ; passez aux pages d'étape pour relancer les consignes.

RYTHME — Pause de 14 h 30 entre la fin du travail et les présentations. En virtuel, la fatigue d'écran arrive vite : ne sautez pas la pause.

POINTS D'ÉTAPE — À 0:30, tirez les imprévus (page « Coup de théâtre »). À 0:55, annoncez l'étape 3. À 5 minutes de la fin, demandez aux volontaires de préparer leurs 5 temps. À chaque fois, un tour rapide pour savoir où chacun en est.

AIDE — Quelqu'un est bloqué : partage d'écran 2 minutes, ou « Demandez à Copilot de vous poser ses questions. »

POUR ALLER PLUS LOIN (utilisateurs avancés) — Faire la même étape avec Claude et comparer ; préparer la règle Outlook ou le flux Power Automate qui accompagne leurs règles de transfert.

TRANSITION — « Temps écoulé ! Pause, puis présentations. »`,
  `⏱ 3 min par volontaire + 1 min de rétroaction · RÉTROACTION COLLECTIVE (étoiles interactives)

ANIMATION — Après chaque présentation, reprenez votre partage d'écran sur cette page. Recueillez au micro un point fort et une piste. Cochez les étoiles en synthétisant ce que vous avez vu et entendu (vous pouvez aussi demander une note de 1 à 5 par critère). « Participant suivant » remet la grille à zéro.

LES QUATRE CRITÈRES — plan réaliste ; réaction à l'imprévu ; messages adaptés ; usage lucide de l'IA.

DIRE — « Un point fort d'abord, toujours. Puis une piste, formulée comme une proposition : "Et si vous essayiez…" » Faites dire un point fort et une piste par deux participants.

TON — Bienveillant et concret. Valorisez explicitement ceux qui montrent ce que l'IA a raté : c'est l'objectif de la formation.

TRANSITION — « Merci à nos volontaires ! Quelques leçons pour finir. »`,
  `⏱ 8 min · DÉBRIEFING DE L'ATELIER

ANIMATION — Sondage à voix haute (un numéro par personne, cliquez une ligne par réponse), puis les trois questions : deux ou trois réponses au micro, dont une adjointe.

LECTURE DU SONDAGE — Souvent : le compte rendu ou le tri et les relances. Si « Aucun » ressort : explorez. La vérification prend du temps au début ; elle devient rapide avec l'habitude et de bonnes demandes.

POINTS À FAIRE ÉMERGER —
• L'IA accélère surtout les premiers jets, les résumés et la mise en forme.
• Les erreurs portent sur les délais, les responsables et les faits : ce que seul le chargé de projet connaît.
• L'imprévu montre la vraie valeur : mettre à jour le plan, le compte rendu et les messages en quelques minutes.

TRANSITION — « Il est temps de conclure ces deux jours. »`,
];
// @@NOTES-END

