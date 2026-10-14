// ─── Module 6 · Construire des workflows avec conditions et logique ─────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Conditions
        <br />& logique
      </>
    }
    sub="Si / alors, filtres, routage, exceptions, erreurs et validation humaine : un workflow qui sait choisir son chemin."
    dur="11:00 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 6 · un workflow à plusieurs scénarios
      </Tag>
    }
  >
    <SecItem n={1}>Conditions « si / alors » et filtres</SecItem>
    <SecItem n={2}>Routage automatique et chemins multiples</SecItem>
    <SecItem n={3}>Exceptions, erreurs et variables dynamiques</SecItem>
    <SecItem n={4}>Validation humaine dans le flux</SecItem>
    <SecItem n={5}>Limiter les erreurs d’automatisation</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Si / alors : testeur de conditions ─────────────────────────────────────
const M6_REQ = [
  { s: 'Devis pour 40 postes', cat: 'commercial', urg: 2, mt: 12000 },
  { s: 'Colis abîmé à la livraison', cat: 'sav', urg: 2, mt: 0 },
  { s: 'Serveur à l’arrêt, 40 personnes bloquées', cat: 'sav', urg: 3, mt: 0 },
  { s: 'Demande de catalogue', cat: 'commercial', urg: 1, mt: 0 },
  { s: 'Facture reçue en double', cat: 'facturation', urg: 2, mt: 480 },
  { s: 'Candidature spontanée', cat: 'autre', urg: 1, mt: 0 },
];
type M6Req = (typeof M6_REQ)[number];
const M6_CONDS = [
  { f: 'categorie', op: '=', v: '"sav"', alors: 'File SAV', test: (r: M6Req) => r.cat === 'sav' },
  { f: 'urgence', op: '≥', v: '3', alors: 'Alerte immédiate', test: (r: M6Req) => r.urg >= 3 },
  { f: 'categorie = "commercial" ET montant', op: '≥', v: '5 000', alors: 'Responsable grands comptes', test: (r: M6Req) => r.cat === 'commercial' && r.mt >= 5000 },
];

const M6CondPart = ({ children, tone, label }: { children: ReactNode; tone: Tone; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, padding: '8px 16px', borderRadius: 10, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, color: C.ink, whiteSpace: 'nowrap' }}>{children}</span>
  </div>
);

const M6ReqRow = ({ i, c }: { i: number; c: number }) => {
  const r = M6_REQ[i];
  const ok = M6_CONDS[c].test(r);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 90px 120px 400px', gap: 14, alignItems: 'center', padding: '12px 20px', background: ok ? T.green.bg : C.card, borderRadius: 12, boxShadow: ok ? `inset 0 0 0 2px ${T.green.bd}` : SHADOW_SM, transition: `all 350ms ${EASE}` }}>
      <span style={{ fontSize: 22, color: C.ink }}>{r.s}</span>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.soft }}>{r.cat}</span>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.soft }}>{r.urg}</span>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.soft }}>{r.mt ? fr(r.mt) : '—'}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: ok ? T.green.fg : C.muted }}>
        <Icon name={ok ? 'checkCircle' : 'arrow'} size={24} /> {ok ? `Alors → ${M6_CONDS[c].alors}` : 'Sinon → standard'}
      </span>
    </div>
  );
};

const M6_SiAlors: Page = () => {
  const [c, setC] = useState(0);
  const k0 = M6_CONDS[c];
  return (
    <Frame mod={6} kind="demo">
      <Title>« Si / alors » : l’anatomie d’une condition</Title>
      <Lede>Un champ, un opérateur, une valeur. Choisissez une condition : quelles demandes prennent « alors » ?</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 256, display: 'flex', gap: 12 }}>
        <Btn size={20} ghost={c !== 0} tone="teal" onClick={() => setC(0)}>
          catégorie = sav
        </Btn>
        <Btn size={20} ghost={c !== 1} tone="coral" onClick={() => setC(1)}>
          urgence ≥ 3
        </Btn>
        <Btn size={20} ghost={c !== 2} tone="violet" onClick={() => setC(2)}>
          commercial ET montant ≥ 5 000
        </Btn>
      </div>
      <div key={c} className={A.fade} style={{ position: 'absolute', left: 120, top: 330, display: 'flex', alignItems: 'flex-end', gap: 16, animationDuration: '400ms' } as CSSProperties}>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy, paddingBottom: 8 }}>SI</span>
        <M6CondPart tone="blue" label="Champ">
          {k0.f}
        </M6CondPart>
        <M6CondPart tone="yellow" label="Opérateur">
          {k0.op}
        </M6CondPart>
        <M6CondPart tone="green" label="Valeur">
          {k0.v}
        </M6CondPart>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy, paddingBottom: 8 }}>ALORS</span>
        <M6CondPart tone="pink" label="Action">
          {k0.alors}
        </M6CondPart>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 460, width: 1680, display: 'flex', flexDirection: 'column', gap: 9, ...dl(150) }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 90px 120px 400px', gap: 14, padding: '0 20px', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
          <span>Demande</span>
          <span>categorie</span>
          <span>urgence</span>
          <span>montant €</span>
          <span>Chemin</span>
        </div>
        <M6ReqRow i={0} c={c} />
        <M6ReqRow i={1} c={c} />
        <M6ReqRow i={2} c={c} />
        <M6ReqRow i={3} c={c} />
        <M6ReqRow i={4} c={c} />
        <M6ReqRow i={5} c={c} />
      </div>
    </Frame>
  );
};

// ─── Filtre, condition, routeur ─────────────────────────────────────────────
const M6Kind = ({ tone, icon, title, sub, children, d, svg }: { tone: Tone; icon: IconName; title: string; sub: string; children: ReactNode; d: number; svg: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '24px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 20, color: T[tone].fg }}>{sub}</div>
      </div>
    </div>
    <div style={{ margin: '20px 0 14px', height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFC', borderRadius: 14 }}>{svg}</div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const M6_Filtres: Page = () => (
  <Frame mod={6}>
    <Title>Filtre, condition, routeur : trois outils, trois usages</Title>
    <Lede>Le filtre arrête, la condition sépare en deux, le routeur distribue entre plusieurs chemins.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 26 }}>
      <M6Kind
        tone="coral"
        icon="filter"
        title="Filtre"
        sub="continuer… ou s’arrêter"
        d={100}
        svg={
          <svg width={360} height={120} aria-hidden>
            <path d="M20 60 H 150" stroke={C.faint} strokeWidth={6} strokeLinecap="round" />
            <path d="M210 60 H 340" stroke={C.green} strokeWidth={6} strokeLinecap="round" />
            <rect x={150} y={30} width={60} height={60} rx={14} fill={T.coral.bg} stroke={C.coral} strokeWidth={4} />
            <path d="M166 46 h28 l-10 14 v14 l-8 -4 v-10 z" fill={C.coral} />
          </svg>
        }
      >
        « Seulement les demandes en français. » Les autres ne vont pas plus loin.
      </M6Kind>
      <M6Kind
        tone="yellow"
        icon="split"
        title="Condition"
        sub="si… alors… sinon"
        d={220}
        svg={
          <svg width={360} height={140} aria-hidden>
            <path d="M20 70 H 140" stroke={C.faint} strokeWidth={6} strokeLinecap="round" />
            <path d="M200 70 C 240 70, 250 25, 330 25" stroke={C.green} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M200 70 C 240 70, 250 115, 330 115" stroke={C.faint} strokeWidth={6} fill="none" strokeLinecap="round" />
            <rect x={140} y={40} width={60} height={60} rx={10} transform="rotate(45 170 70)" fill={T.yellow.bg} stroke={C.yellow} strokeWidth={4} />
          </svg>
        }
      >
        « Si urgence = 3, alerte ; sinon, file normale. » Deux chemins, un seul emprunté.
      </M6Kind>
      <M6Kind
        tone="violet"
        icon="route"
        title="Routeur"
        sub="plusieurs chemins"
        d={340}
        svg={
          <svg width={360} height={150} aria-hidden>
            <path d="M20 75 H 140" stroke={C.faint} strokeWidth={6} strokeLinecap="round" />
            <path d="M180 75 C 230 75, 240 15, 330 15" stroke={C.blue} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M180 75 C 230 75, 240 55, 330 55" stroke={C.teal} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M180 75 C 230 75, 240 95, 330 95" stroke={C.coral} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M180 75 C 230 75, 240 135, 330 135" stroke={C.faint} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="8 8" />
            <circle cx={160} cy={75} r={26} fill={C.violet} />
          </svg>
        }
      >
        Un chemin par catégorie, plus une <strong>route de secours</strong> pour tout le reste.
      </M6Kind>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(600) }}>
      <Callout title="Piège classique" tone="yellow" icon="alert" size={23}>
        Dans un routeur Make ou des Paths Zapier, une demande peut suivre <strong>plusieurs</strong> chemins si plusieurs conditions sont vraies. Rendez-les exclusives.
      </Callout>
    </div>
  </Frame>
);

// ─── Simulateur de routage ──────────────────────────────────────────────────
const M6_IN = [
  { t: 'URGENT : plus aucun accès au logiciel depuis ce matin, 40 utilisateurs bloqués.', cat: 'sav', urg: 3, route: 0 },
  { t: 'Bonjour, pourriez-vous m’envoyer une proposition pour 25 licences ?', cat: 'commercial', urg: 1, route: 1 },
  { t: 'Mon imprimante affiche l’erreur E-204 depuis la mise à jour.', cat: 'sav', urg: 2, route: 2 },
  { t: 'Je souhaite modifier l’adresse de facturation de mon compte.', cat: 'administratif', urg: 1, route: 3 },
  { t: 'On m’avait promis une remise, je résilie si rien n’est fait d’ici vendredi !', cat: 'commercial', urg: 3, route: 0 },
];
const M6_ROUTES = [
  { n: 1, tone: 'coral' as Tone, icon: 'bell' as IconName, t: 'Urgent', rule: 'urgence = 3', act: 'Notification immédiate au responsable' },
  { n: 2, tone: 'blue' as Tone, icon: 'money' as IconName, t: 'Commercial', rule: 'categorie = commercial', act: 'Fiche dans le CRM + commercial' },
  { n: 3, tone: 'teal' as Tone, icon: 'tool' as IconName, t: 'Support', rule: 'categorie = sav', act: 'Ticket dans l’outil de support' },
  { n: 4, tone: 'grey' as Tone, icon: 'inbox' as IconName, t: 'Standard', rule: 'sinon', act: 'File de traitement standard' },
];

const M6In = ({ i, cur, pick }: { i: number; cur: number; pick: () => void }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      pick();
    }}
    style={{ display: 'flex', gap: 14, alignItems: 'flex-start', width: '100%', boxSizing: 'border-box', padding: '14px 18px', border: 'none', borderRadius: 14, cursor: 'pointer', textAlign: 'left', fontFamily: body, fontSize: 21, lineHeight: 1.4, color: C.ink, background: cur === i ? T.blue.bg : C.card, boxShadow: cur === i ? `inset 0 0 0 3px ${C.blue}` : SHADOW_SM, transition: `all 250ms ${EASE}` }}
  >
    <Icon name="mail" size={24} color={cur === i ? C.blue : C.faint} style={{ marginTop: 3 }} />
    <span>{M6_IN[i].t}</span>
  </button>
);

const M6Route = ({ r, y, on }: { r: number; y: number; on: boolean }) => {
  const R = M6_ROUTES[r];
  return (
    <div style={{ position: 'absolute', left: 1400, top: y, width: 400, boxSizing: 'border-box', display: 'flex', gap: 14, alignItems: 'center', background: on ? T[R.tone].bg : C.card, borderRadius: 16, padding: '14px 18px', boxShadow: on ? `inset 0 0 0 3px ${STRONG[R.tone]}, 0 18px 30px -18px rgba(11,31,92,.5)` : SHADOW_SM, transform: on ? 'translateX(-8px)' : 'none', transition: `all 400ms ${EASE}` }}>
      <IconTile name={R.icon} tone={R.tone} size={50} solid={on} />
      <div>
        <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>
          {R.n} · {R.t} <span style={{ fontFamily: mono, fontSize: 17, color: C.muted, fontWeight: 400 }}>{R.rule}</span>
        </div>
        <div style={{ fontSize: 19, color: C.soft }}>{R.act}</div>
      </div>
    </div>
  );
};

const M6_RY = [262, 412, 562, 712];

const M6_Routage: Page = () => {
  const [cur, setCur] = useState(-1);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (cur < 0) return;
    setPhase(0);
    const a = window.setTimeout(() => setPhase(1), 600);
    const b2 = window.setTimeout(() => setPhase(2), 1300);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b2);
    };
  }, [cur]);
  const req = cur >= 0 ? M6_IN[cur] : null;
  const route = req && phase >= 2 ? req.route : -1;
  return (
    <Frame mod={6} kind="simu">
      <Title>Simulateur : le routage des demandes</Title>
      <Lede>Demande reçue → classification IA → routeur. Cliquez une demande et suivez son chemin.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M6In i={0} cur={cur} pick={() => setCur(0)} />
        <M6In i={1} cur={cur} pick={() => setCur(1)} />
        <M6In i={2} cur={cur} pick={() => setCur(2)} />
        <M6In i={3} cur={cur} pick={() => setCur(3)} />
        <M6In i={4} cur={cur} pick={() => setCur(4)} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
        <path d="M1110 520 C 1250 520, 1250 310, 1392 310" stroke={route === 0 ? C.coral : C.rule} strokeWidth={route === 0 ? 7 : 4} fill="none" style={{ transition: 'all 300ms' }} />
        <path d="M1110 520 C 1250 520, 1250 460, 1392 460" stroke={route === 1 ? C.blue : C.rule} strokeWidth={route === 1 ? 7 : 4} fill="none" style={{ transition: 'all 300ms' }} />
        <path d="M1110 520 C 1250 520, 1250 610, 1392 610" stroke={route === 2 ? C.teal : C.rule} strokeWidth={route === 2 ? 7 : 4} fill="none" style={{ transition: 'all 300ms' }} />
        <path d="M1110 520 C 1250 520, 1250 760, 1392 760" stroke={route === 3 ? C.muted : C.rule} strokeWidth={route === 3 ? 7 : 4} fill="none" strokeDasharray="10 8" style={{ transition: 'all 300ms' }} />
        <path d="M760 520 H 800" stroke={C.rule} strokeWidth={4} />
      </svg>
      <div className={A.in} style={{ position: 'absolute', left: 800, top: 400, width: 250, ...dl(150) }}>
        <FlowNode kind="ai" label="Classification" sub="catégorie + urgence" w={250} />
        <div style={{ marginTop: 12, minHeight: 90, fontFamily: mono, fontSize: 19, lineHeight: 1.5, background: '#0F1530', color: '#E6EAF6', borderRadius: 12, padding: '10px 14px' }}>
          {req && phase >= 1 ? (
            <div key={cur} className={A.fade} style={{ animationDuration: '300ms' } as CSSProperties}>
              <span style={{ color: '#9BE29B' }}>categorie</span>: {req.cat}
              <br />
              <span style={{ color: '#9BE29B' }}>urgence</span>: {req.urg}
            </div>
          ) : (
            <span style={{ color: '#7C86A8' }}>{req ? 'analyse…' : 'en attente'}</span>
          )}
        </div>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 1080, top: 490, width: 60, height: 60, borderRadius: 999, background: C.violet, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -8px rgba(116,66,224,.7)', ...dl(250) }}>
        <Icon name="route" size={32} color="#fff" />
      </div>
      <M6Route r={0} y={M6_RY[0]} on={route === 0} />
      <M6Route r={1} y={M6_RY[1]} on={route === 1} />
      <M6Route r={2} y={M6_RY[2]} on={route === 2} />
      <M6Route r={3} y={M6_RY[3]} on={route === 3} />
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(500) }}>
        <Icon name="bulb" size={26} color={C.violet} />
        Les routes sont testées dans l’ordre : « Urgent » passe avant tout. La dernière route, sans condition, rattrape tout le reste.
      </div>
    </Frame>
  );
};

// ─── Exceptions et erreurs ──────────────────────────────────────────────────
const M6Err = ({ icon, tone, title, ex, d }: { icon: IconName; tone: Tone; title: string; ex: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 16, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft }}>{ex}</div>
    </div>
  </div>
);

const M6Fix = ({ n, title, children, beat }: { n: number; title: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.green}`, padding: '14px 20px' }}>
    <Num n={n} tone="green" size={38} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_Erreurs: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>Gérer les exceptions et les erreurs</Title>
    <Lede>Tout scénario finira par échouer. La question n’est pas « si », mais « que se passe-t-il alors ? ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.coral.fg} size={20} cls={A.fade}>
        Quatre familles d’échec
      </Eyebrow>
      <M6Err icon="server" tone="coral" title="Technique" ex="Application indisponible, délai dépassé, quota atteint" d={100} />
      <M6Err icon="database" tone="yellow" title="Données" ex="Champ vide, date mal formée, doublon" d={200} />
      <M6Err icon="sparkles" tone="violet" title="IA" ex="JSON invalide, catégorie hors liste, confiance faible" d={300} />
      <M6Err icon="alert" tone="pink" title="Métier" ex="Cas que les règles n’ont pas prévu" d={400} />
    </div>
    <div style={{ position: 'absolute', left: 960, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={T.green.fg} size={20} cls={b.fade(1)}>
        Cinq réponses possibles
      </Eyebrow>
      <M6Fix n={1} beat={1} title="Réessayer">
        Après quelques minutes, 2 ou 3 fois : la plupart des pannes techniques passent.
      </M6Fix>
      <M6Fix n={2} beat={2} title="Prendre un chemin de secours">
        Teams en panne ? Email. IA hors service ? File humaine.
      </M6Fix>
      <M6Fix n={3} beat={3} title="Ignorer et continuer">
        Pour une étape non essentielle (un journal secondaire, une statistique).
      </M6Fix>
      <M6Fix n={4} beat={4} title="Mettre de côté">
        Le cas part dans une file « à traiter », rien ne se perd.
      </M6Fix>
      <M6Fix n={5} beat={5} title="Alerter le propriétaire">
        Toujours : un email ou un message, avec le lien vers l’exécution en échec.
      </M6Fix>
    </div>
  </Frame>
);

// ─── Variables et déclenchements conditionnels ──────────────────────────────
const M6Dyn = ({ icon, tone, title, code, children, d }: { icon: IconName; tone: Tone; title: string; code: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontFamily: mono, fontSize: 20, color: '#E6EAF6', background: '#0F1530', borderRadius: 10, padding: '10px 14px', whiteSpace: 'pre-wrap' }}>{code}</div>
    <div style={{ marginTop: 12, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M6_Dynamique: Page = () => (
  <Frame mod={6}>
    <Title>Variables et déclenchements conditionnels</Title>
    <Lede>Quatre techniques qui rendent un scénario plus intelligent sans le rendre plus compliqué.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <M6Dyn icon="filter" tone="blue" title="Ne déclencher que si…" code={'déclencheur : nouvel email\ncondition : objet contient "devis"'} d={100}>
        Le scénario ne démarre que pour les cas utiles : moins d’opérations, moins de bruit.
      </M6Dyn>
      <M6Dyn icon="loop" tone="violet" title="Un compteur" code={'relances = relances + 1\nsi relances ≥ 3 → humain'} d={200}>
        La variable mémorise l’historique du cas et évite les relances sans fin.
      </M6Dyn>
      <M6Dyn icon="clock" tone="teal" title="Heures ouvrées" code={'si heure < 9 h ou > 18 h\n→ attendre le lendemain 9 h'} d={300}>
        Pas de SMS à un commercial à 23 h, pas d’accusé de réception le dimanche à 3 h.
      </M6Dyn>
      <M6Dyn icon="table" tone="green" title="Paramètres dans un tableur" code={'seuil = Paramètres!B2   (5 000 €)\nresponsable = Paramètres!B3'} d={400}>
        Le métier change un seuil ou un destinataire sans toucher au scénario.
      </M6Dyn>
    </div>
  </Frame>
);

// ─── Validation humaine dans le flux (simulateur d’approbation) ─────────────
const M6_Approbation: Page = () => {
  const [st, setSt] = useState<'wait' | 'ok' | 'ko' | 'late'>('wait');
  const tone: Tone = st === 'ok' ? 'green' : st === 'ko' ? 'coral' : st === 'late' ? 'yellow' : 'grey';
  const msg =
    st === 'ok'
      ? 'Approuvé → l’email part, la ligne passe au statut « envoyé », la décision est journalisée.'
      : st === 'ko'
        ? 'Refusé → retour à l’étape de rédaction avec le commentaire ; le cas reste dans la file.'
        : st === 'late'
          ? 'Sans réponse en 24 h → relance, puis escalade au responsable de l’équipe.'
          : 'Le flux est en pause : il attend la décision.';
  return (
    <Frame mod={6} kind="simu">
      <Title>La validation humaine dans le flux</Title>
      <Lede>Le scénario se met en pause et envoie une demande d’approbation. Décidez à la place du valideur.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', background: T.blue.bg }}>
          <Icon name="chat" size={26} color={C.blue} />
          <span style={{ fontSize: 21, fontWeight: 700, color: T.blue.fg }}>Approbations · demande en attente</span>
        </div>
        <div style={{ padding: '22px 28px' }}>
          <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>Réponse au client Orvia · remise demandée</div>
          <div style={{ marginTop: 8, fontSize: 20, color: C.muted }}>Catégorie : commercial · urgence 3 · montant 12 400 €</div>
          <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.5, color: C.soft, background: '#F7FAFC', borderRadius: 12, padding: '14px 18px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>
            « Bonjour Monsieur Lenoir, nous avons bien reçu votre demande concernant la remise évoquée. Votre interlocuteur vous recontacte avant vendredi… »
          </div>
          <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
            <Btn tone="green" icon="check" size={22} onClick={() => setSt('ok')}>
              Approuver
            </Btn>
            <Btn tone="coral" icon="x" size={22} onClick={() => setSt('ko')}>
              Refuser
            </Btn>
            <Btn ghost tone="yellow" icon="clock" size={22} onClick={() => setSt('late')}>
              Pas de réponse
            </Btn>
            <Btn ghost tone="grey" icon="reset" size={22} onClick={() => setSt('wait')} />
          </div>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 960, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 18, ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <FlowNode kind="ai" label="Brouillon" w={200} />
          <FlowArrow w={40} color={C.faint} />
          <FlowNode kind="human" label="Approbation" w={220} style={{ boxShadow: `${SHADOW_SM}, inset 0 0 0 3px ${STRONG[tone]}` }} />
          <FlowArrow w={40} color={st === 'ok' ? C.green : C.faint} />
          <FlowNode kind="action" label="Envoi" w={200} style={{ opacity: st === 'ok' ? 1 : 0.35, transition: 'opacity 300ms' }} />
        </div>
        <div key={st} className={A.in} style={{ animationDuration: '400ms', background: T[tone].bg, borderRadius: 16, padding: '20px 24px', fontSize: 25, lineHeight: 1.45, color: C.ink, boxShadow: `inset 0 0 0 2px ${T[tone].bd}` } as CSSProperties}>
          {msg}
        </div>
        <Callout title="Dans les outils" tone="blue" icon="puzzle" size={21}>
          Power Automate : action « Approbations ». Make, Zapier : message Teams, Slack ou email avec boutons, ou étape « Human in the Loop ».
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Limiter les erreurs (checklist) ────────────────────────────────────────
const M6_Limiter: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Limiter les erreurs d’automatisation : votre check-list</Title>
    <Lede>Cochez ce que votre scénario de ce matin respecte déjà. Le reste est votre liste de travail.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1120, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        <CheckItem id="li1" size={22}>Testé avec de vrais cas, pas des champs vides</CheckItem>
        <CheckItem id="li2" size={22}>Au moins un cas limite et un cas piège testés</CheckItem>
        <CheckItem id="li3" size={22}>Un mode « brouillon » avant les envois réels</CheckItem>
        <CheckItem id="li4" size={22}>Une route « sinon » qui rattrape tout</CheckItem>
        <CheckItem id="li5" size={22}>Un plafond de volume par jour</CheckItem>
        <CheckItem id="li6" size={22}>Une alerte en cas d’échec</CheckItem>
        <CheckItem id="li7" size={22}>Chaque exécution laisse une trace</CheckItem>
        <CheckItem id="li8" size={22}>Un propriétaire nommé</CheckItem>
        <CheckItem id="li9" size={22}>Un moyen simple de tout arrêter</CheckItem>
        <CheckItem id="li10" size={22}>Une revue mensuelle des cas en erreur</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1300, top: 262, width: 500, ...dl(250) }}>
        <CheckScore
          max={10}
          label="Robustesse"
          levels={[
            { min: 0, text: 'Prototype : à ne pas laisser seul.', tone: 'coral' },
            { min: 4, text: 'Pilote : sous surveillance rapprochée.', tone: 'yellow' },
            { min: 7, text: 'Prêt pour un usage réel.', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── Quiz : quel chemin ? ───────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz : quel chemin prend cette demande ?</Title>
    <QuizSeries y={200}>
      <QuizQ q="Routes testées dans l’ordre : 1 Urgent (urgence = 3) · 2 Commercial · 3 SAV · 4 Sinon. Demande SAV, urgence 3 ?" explain="La route 1 est testée en premier et sa condition est vraie : Urgent. C’est pourquoi l’ordre des routes compte.">
        <QOpt ok>Urgent</QOpt>
        <QOpt>SAV</QOpt>
        <QOpt>Les deux, forcément</QOpt>
      </QuizQ>
      <QuizQ q="Un filtre « langue = français » est placé avant l’IA. Une demande arrive en anglais. Que se passe-t-il ?" explain="Le filtre arrête l’exécution : rien après lui ne s’exécute. Pensez à prévoir ce que deviennent ces cas (route de secours ou alerte).">
        <QOpt>L’IA la traduit</QOpt>
        <QOpt ok>Le scénario s’arrête pour cette demande</QOpt>
        <QOpt>Elle part dans la route « sinon »</QOpt>
      </QuizQ>
      <QuizQ q="L’IA renvoie la catégorie « réclamation », absente de la liste. Quelle route ?" explain="Aucune condition n’est vraie : seule la route « sinon » la rattrape. Sans elle, la demande serait perdue sans bruit.">
        <QOpt>Commercial</QOpt>
        <QOpt>Aucune, elle est perdue</QOpt>
        <QOpt ok>La route « sinon »</QOpt>
      </QuizQ>
      <QuizQ q="L’outil de ticketing ne répond pas. Quelle est la meilleure première réaction du scénario ?" explain="Une panne technique est souvent passagère : réessayer quelques fois, puis basculer sur un chemin de secours et alerter.">
        <QOpt ok>Réessayer, puis chemin de secours et alerte</QOpt>
        <QOpt>Ignorer l’étape</QOpt>
        <QOpt>Désactiver le scénario</QOpt>
      </QuizQ>
      <QuizQ q="Une demande d’approbation reste sans réponse depuis 2 jours. Que prévoir ?" explain="Un délai d’expiration : relance, puis escalade. Sinon le cas reste bloqué indéfiniment dans le flux.">
        <QOpt>Approuver automatiquement</QOpt>
        <QOpt ok>Relancer puis escalader</QOpt>
        <QOpt>Attendre, c’est le rôle du valideur</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 6 ──────────────────────────────────────────────────────────────
const M6_Atelier: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="Un workflow à plusieurs scénarios"
    defi="routage"
    who="En binôme"
    minutes={40}
    where={
      <>
        Votre scénario de l’atelier 5, enrichi d’un <strong>routeur à 4 routes</strong>, d’une route <strong>« sinon »</strong> et d’une <strong>gestion d’erreur</strong>.
      </>
    }
    objective={
      <>
        Demande reçue → classification IA → <strong>si commercial</strong> : commercial · <strong>si SAV</strong> : support · <strong>si urgente</strong> : notification
        immédiate · <strong>sinon</strong> : traitement standard.
      </>
    }
    crit={
      <>
        <CheckItem id="a6c1" size={22}>Les 4 routes sont exclusives</CheckItem>
        <CheckItem id="a6c2" size={22}>« Urgent » est testé en premier</CheckItem>
        <CheckItem id="a6c3" size={22}>Une catégorie inconnue finit en « sinon »</CheckItem>
        <CheckItem id="a6c4" size={22}>Une erreur déclenche une alerte</CheckItem>
      </>
    }
  >
    <div>1. Ajoutez un routeur (ou des conditions) après l’étape IA.</div>
    <div>2. Une route par cas, dans le bon ordre, puis la route « sinon ».</div>
    <div>3. Testez les 5 demandes du simulateur, plus une catégorie inventée.</div>
    <div>4. Débranchez volontairement une connexion : l’alerte part-elle ?</div>
    <Bonus>Ajoutez une approbation humaine avant tout envoi au-dessus de 5 000 €.</Bonus>
  </LabPage>
);

// ─── Synthèse M6 ────────────────────────────────────────────────────────────
const M6_Synthese: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Ce qu’on retient du module 6</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="yellow" d={100}>
        Une condition = <strong>champ, opérateur, valeur</strong>, et toujours un « sinon ».
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Le filtre arrête, la condition sépare, le routeur <strong>distribue</strong>, dans un ordre qui compte.
      </SynthRow>
      <SynthRow n={3} tone="coral" d={300}>
        Chaque échec a sa réponse : <strong>réessayer, secours, ignorer, mettre de côté, alerter</strong>.
      </SynthRow>
      <SynthRow n={4} tone="pink" d={400}>
        La validation humaine est <strong>une étape du flux</strong>, avec un délai et une escalade.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        Les <strong>paramètres</strong> vivent dans un tableur : le métier les règle sans toucher au scénario.
      </SynthRow>
    </div>
    <ProjectCard mod={6}>
      Votre scénario <strong>choisit son chemin</strong> : conditions, routes exclusives, route « sinon », et une alerte quand quelque chose casse.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_SiAlors, M6_Filtres, M6_Routage, M6_Erreurs, M6_Dynamique, M6_Approbation, M6_Limiter, M6_Quiz, M6_Atelier, M6_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M6 · 11:00

OBJECTIF — Annoncer le module logique.

DIRE — « Votre scénario tourne, mais il fait toujours la même chose. Un vrai processus a des embranchements : selon la catégorie, l’urgence, le montant. Et il a des imprévus : erreurs, exceptions, valideurs absents. Ce module apprend à votre workflow à choisir son chemin. L’atelier 6 ajoute un routeur à votre scénario. »

TRANSITION — « Commençons par la brique de base : la condition. »`,
  `⏱ 4 min · SI / ALORS (démo interactive)

OBJECTIF — Comprendre les conditions « si / alors ».

DIRE — « Une condition, c’est trois morceaux : un champ, un opérateur, une valeur. Si catégorie égale SAV, alors file SAV. Regardez les lignes en vert : deux demandes sur six. » Cliquer « urgence ≥ 3 » : « Une seule. » Cliquer la condition combinée : « Commercial ET montant supérieur ou égal à 5 000 : seul le devis de 40 postes passe. Et pour toutes les autres : sinon. Une condition sans “sinon”, c’est une demande qui disparaît. »

TRANSITION — « La condition a deux cousins : le filtre et le routeur. »`,
  `⏱ 3 min · FILTRE, CONDITION, ROUTEUR

OBJECTIF — Distinguer filtres, conditions et routage automatique.

DIRE — « Le filtre est une barrière : on continue ou on s’arrête. La condition sépare en deux : un seul chemin est emprunté. Le routeur distribue entre plusieurs chemins, avec une route de secours. Et le piège : dans Make ou Zapier, si deux conditions de route sont vraies, la demande prend les deux chemins. Rendez vos routes exclusives. »

NUANCE — Dans Power Automate, le « Commutateur » est exclusif par construction ; la logique reste la même.

TRANSITION — « Voyons un routeur en action. »`,
  `⏱ 5 min · SIMULATEUR DE ROUTAGE

OBJECTIF — Construire mentalement un workflow à plusieurs scénarios : l’exemple du programme.

DIRE — « Cinq demandes. Je clique la première : l’IA classe — SAV, urgence 3 — et le routeur l’envoie en Urgent : notification immédiate. » Cliquer la 2 : « Commercial. » La 3 : « Support. » La 4 : « Administratif : aucune route ne correspond, c’est la route “sinon”. » La 5 : « Commerciale, mais urgente : les routes sont testées dans l’ordre, Urgent passe en premier. »

ANIMATION — Avant chaque clic, faire deviner la route à la salle.

TRANSITION — « Et quand ça casse ? »`,
  `⏱ 4 min · EXCEPTIONS ET ERREURS (5 clics)

OBJECTIF — Gérer les exceptions et les erreurs.

DIRE — « Quatre familles d’échec : technique, données, IA, métier. » Puis les cinq réponses, une par clic : « Réessayer : la plupart des pannes techniques sont passagères. Chemin de secours. Ignorer et continuer, seulement pour une étape non essentielle. Mettre de côté dans une file “à traiter”. Et toujours : alerter le propriétaire avec le lien vers l’exécution en échec. »

NUANCE — Dans les outils : gestionnaires d’erreur dans Make, « Configurer l’exécution après » et étendues dans Power Automate, gestion d’erreurs et relecture automatique dans Zapier.

TRANSITION — « Quatre techniques pour un scénario plus malin. »`,
  `⏱ 3 min · VARIABLES ET DÉCLENCHEMENTS CONDITIONNELS

OBJECTIF — Utiliser variables, données dynamiques et déclenchements conditionnels.

DIRE — « Ne déclencher que si c’est utile : moins d’opérations. Un compteur, pour éviter les relances sans fin. Les heures ouvrées : pas de SMS à 23 h. Et ma préférée : les paramètres dans un tableur. Le seuil de 5 000 euros, le nom du responsable : le métier les change dans une cellule, sans toucher au scénario, et sans vous appeler. »

TRANSITION — « Revenons sur la validation humaine, cette fois dans l’outil. »`,
  `⏱ 4 min · APPROBATION (simulateur)

OBJECTIF — Intégrer la validation humaine comme étape du flux.

DIRE — « Le scénario a rédigé une réponse commerciale sensible : il se met en pause et envoie une demande d’approbation. » Cliquer Approuver : « L’email part, la décision est journalisée. » Refuser : « Retour à la rédaction avec le commentaire. » Pas de réponse : « Et c’est le cas oublié : sans délai d’expiration, le cas reste bloqué. Relance, puis escalade. »

TRANSITION — « Faisons le point sur la robustesse de vos scénarios. »`,
  `⏱ 4 min · CHECK-LIST ROBUSTESSE

OBJECTIF — Limiter les erreurs d’automatisation.

DIRE — « Dix points. Cochez ceux que votre scénario de ce matin respecte. En dessous de 4 : prototype, à ne pas laisser seul. De 4 à 6 : pilote sous surveillance. 7 et plus : prêt pour un usage réel. Le point le plus souvent oublié : un moyen simple de tout arrêter. »

TRANSITION — « Quiz : quel chemin ? »`,
  `⏱ 5 min · QUIZ « QUEL CHEMIN ? » (5 questions)

OBJECTIF — Vérifier la compréhension de l’ordre des routes, des filtres, du « sinon », des erreurs et des délais.

DIRE — Lire, faire voter, cliquer. Revenir sur la question 2 : un filtre arrête ; ce n’est pas une route « sinon ».

TRANSITION — « Atelier 6. »`,
  `⏱ 40 min · ATELIER 6 · ROUTAGE (minuteur)

OBJECTIF — Construire un workflow comportant plusieurs scénarios.

CONSIGNE À DIRE — « Partez de votre scénario de l’atelier 5. Après l’étape IA, ajoutez un routeur : Urgent d’abord, puis Commercial, puis SAV, puis la route sinon. Testez les cinq demandes du simulateur et une catégorie inventée. Puis débranchez volontairement une connexion : l’alerte doit partir. »

ANIMATION — Montrer en direct la création d’un routeur dans l’outil majoritaire. Passer dans les rangs : vérifier l’exclusivité des routes et l’ordre.

DÉBRIEF — Un binôme montre l’historique d’une demande routée et l’alerte d’erreur reçue.`,
  `⏱ 2 min · SYNTHÈSE M6

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Une condition, c’est champ, opérateur, valeur, et un sinon. Filtre, condition, routeur, dans un ordre qui compte. Chaque échec a sa réponse. La validation humaine a un délai. Et les paramètres vivent dans un tableur. Côté projet : votre scénario choisit son chemin. »

TRANSITION — « Bon déjeuner. Cet après-midi : connecter les outils entre eux. »`,
];
// @@NOTES-END
