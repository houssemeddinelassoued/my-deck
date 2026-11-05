// ─── Module 9 · Les agents dans Copilot (Jour 2, fin) ───────────────────────
// Numéro interne 11 (le 9 sert à la clôture) ; affiché « Module 9 ».
// Formats vérifiés le 5 novembre 2026 sur code.visualstudio.com :
// .github/agents/*.agent.md (name, description, tools, agents, model, skills, handoffs)
// .github/skills/<nom>/SKILL.md (name = nom du dossier, description), chargement progressif.

CSS.push(`
@keyframes ${P}-pkt{from{transform:translate(var(--x0),var(--y0)) translate(-50%,-50%) scale(.6);opacity:0}12%{opacity:1}to{transform:translate(var(--x1),var(--y1)) translate(-50%,-50%) scale(1);opacity:1}}
.${P}-pkt{position:absolute;left:0;top:0;animation:${P}-pkt 1050ms ${EASE} var(--d,0ms) both;pointer-events:none}
@keyframes ${P}-edge{to{stroke-dashoffset:-28}}
.${P}-edge{stroke-dasharray:10 8;animation:${P}-edge 700ms linear infinite}
.${P}-agn{transition:transform 360ms ${EASE_BACK},box-shadow 300ms ${EASE},opacity 300ms ${EASE},background 300ms ${EASE}}
.${P}-row{cursor:pointer;transition:background 220ms ${EASE}}
.${P}-chip{cursor:pointer;transition:all 220ms ${EASE}}
.${P}-gstep{transition:opacity 300ms ${EASE},transform 300ms ${EASE}}
`);

// ─── Diviseur ───────────────────────────────────────────────────────────────
const M9_Divider: Page = () => (
  <Section
    n={11}
    num={9}
    title={
      <>
        Les agents
        <br />
        dans Copilot
      </>
    }
    sub="Un rôle, des outils, des savoir-faire… et une équipe d’agents qui travaille ensemble, sous votre contrôle."
    dur="J2 · 16:40 – 17:20"
    labs={<Tag tone="green" size={19}>Atelier 9 · votre équipe d’agents</Tag>}
  >
    <SecItem n={1}>Un agent personnalisé : rôle, outils, relais</SecItem>
    <SecItem n={2}>Créer un agent dans VS Code</SecItem>
    <SecItem n={3}>Les Skills : un savoir-faire chargé à la demande</SecItem>
    <SecItem n={4}>Orchestrer une équipe d’agents</SecItem>
    <SecItem n={5}>Le potentiel… et les points d’attention</SecItem>
  </Section>
);
M9_Divider.transition = BLOOM;

// ─── Anatomie d’un agent ────────────────────────────────────────────────────
type AnaField = 'name' | 'desc' | 'tools' | 'skills' | 'handoffs' | 'body';
const ANA_LINES: { f: AnaField; node: ReactNode }[] = [
  { f: 'name', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'name', node: <><Ck>name</Ck>: Testeur QA</> },
  { f: 'desc', node: <><Ck>description</Ck>: Vérifie une fonctionnalité avec</> },
  { f: 'desc', node: <>{'  '}des tests de cas limites. Ne corrige jamais src/.</> },
  { f: 'tools', node: <><Ck>tools</Ck>: [<Cs>'read'</Cs>, <Cs>'search'</Cs>, <Cs>'edit'</Cs>, <Cs>'execute'</Cs>]</> },
  { f: 'skills', node: <><Ck>skills</Ck>: [<Cs>'tests-node'</Cs>]</> },
  { f: 'handoffs', node: <><Ck>handoffs</Ck>:</> },
  { f: 'handoffs', node: <>{'  - '}<Ck>label</Ck>: Renvoyer au Développeur</> },
  { f: 'handoffs', node: <>{'    '}<Ck>agent</Ck>: Développeur</> },
  { f: 'handoffs', node: <>{'    '}<Ck>prompt</Ck>: Corrige les échecs signalés…</> },
  { f: 'body', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'body', node: <>Tu es le testeur QA de TaskFlow.</> },
  { f: 'body', node: <>Tu ne fais pas confiance au développeur : tu vérifies.</> },
  { f: 'body', node: <>- Tu modifies uniquement test/*-qa.test.js.</> },
  { f: 'body', node: <>- Un test qui échoue ne s’affaiblit pas.</> },
];
const ANA_INFO: Record<AnaField, { t: string; tone: Tone; icon: IconName; text: ReactNode; tip: string }> = {
  name: { t: 'name · le nom', tone: 'navy', icon: 'user', text: 'Le nom affiché dans la liste des agents du chat. C’est aussi lui qu’on cite pour un relais ou un sous-agent.', tip: 'Court et unique : « Testeur QA », pas « Agent 2 ».' },
  desc: { t: 'description · quand l’utiliser', tone: 'blue', icon: 'note', text: 'Obligatoire. Elle dit ce que fait l’agent et quand le choisir ; un chef d’orchestre la lit pour décider à qui déléguer.', tip: 'Dites aussi ce qu’il ne fait jamais.' },
  tools: { t: 'tools · ce qu’il a le droit de faire', tone: 'coral', icon: 'tool', text: 'La liste des outils : sans « edit », il ne peut pas modifier de fichier ; sans « execute », pas de terminal. Cliquez les outils pour voir le risque.', tip: 'Le minimum nécessaire, jamais « * » par confort.' },
  skills: { t: 'skills · ses savoir-faire', tone: 'violet', icon: 'book', text: 'Les skills chargées dans son contexte : ici la procédure de tests du projet, écrite une fois, réutilisée par chaque agent.', tip: 'Une skill = un dossier .github/skills/<nom>/.' },
  handoffs: { t: 'handoffs · les relais', tone: 'green', icon: 'send', text: 'À la fin de sa réponse, un bouton propose de passer la main à un autre agent, avec une demande pré-remplie. Vous relisez, puis vous cliquez.', tip: 'send: false = vous gardez la main avant chaque relais.' },
  body: { t: 'Le corps · son rôle et ses règles', tone: 'pink', icon: 'chat', text: 'Les consignes en Markdown, ajoutées à chaque demande faite à cet agent : sa mission, sa méthode, ses interdits.', tip: 'Des règles vérifiables, pas des vœux pieux.' },
};
const ANA_ORDER: AnaField[] = ['name', 'desc', 'tools', 'skills', 'handoffs', 'body'];
const TOOLS9 = [
  { id: 'read', what: 'lire les fichiers', risk: 1 },
  { id: 'search', what: 'chercher dans le code', risk: 1 },
  { id: 'todo', what: 'tenir une liste de tâches', risk: 0 },
  { id: 'edit', what: 'créer et modifier des fichiers', risk: 2 },
  { id: 'agent', what: 'déléguer à d’autres agents', risk: 2 },
  { id: 'execute', what: 'lancer des commandes (terminal)', risk: 3 },
  { id: 'web', what: 'lire des pages Internet', risk: 3 },
];

const M9_Anatomie: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<AnaField | null>(null);
  const [tools, setTools] = useState<string[]>(['read', 'search', 'edit', 'execute']);
  useEffect(() => setPick(null), [beats]);
  const sel = pick ?? ANA_ORDER[Math.min(beats, 5)];
  const info = ANA_INFO[sel];
  const risk = TOOLS9.filter((t) => tools.includes(t.id)).reduce((a, t) => a + t.risk, 0);
  const lvl = risk <= 3 ? { t: 'faible', tone: 'green' as Tone } : risk <= 7 ? { t: 'modéré', tone: 'yellow' as Tone } : { t: 'élevé', tone: 'coral' as Tone };
  const injection = tools.includes('execute') && tools.includes('web');
  return (
    <Frame mod={11} beats={5}>
      <Title>Un agent personnalisé, c’est un fichier .agent.md</Title>
      <Lede>Un rôle, des outils, des savoir-faire et des relais, écrits une fois et versionnés avec le code. Cliquez une ligne.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '16px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px 10px', fontFamily: mono, fontSize: 18, color: '#9AA6C8' }}>
          <Icon name="doc" size={22} color="#9AA6C8" /> .github/agents/testeur-qa.agent.md
        </div>
        {ANA_LINES.map((l, i) => {
          const on = l.f === sel;
          return (
            <div
              key={i}
              role="button"
              data-osd-interactive
              className={k('row')}
              onClick={() => setPick(l.f)}
              style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', fontFamily: mono, fontSize: 21, lineHeight: '33px', color: on ? '#fff' : '#C9D2EA', background: on ? 'rgba(116,66,224,.32)' : 'transparent', boxShadow: on ? `inset 5px 0 0 ${STRONG[ANA_INFO[l.f].tone]}` : 'none', whiteSpace: 'pre' }}
            >
              <span style={{ textAlign: 'right', paddingRight: 14, color: '#56607E' }}>{i + 1}</span>
              <span>{l.node}</span>
            </div>
          );
        })}
      </div>
      <div key={sel} className={k('swap')} style={{ position: 'absolute', left: 1070, top: 270, width: 730, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[info.tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={info.icon} tone={info.tone} size={56} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{info.t}</span>
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{info.text}</div>
        {sel === 'tools' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {TOOLS9.map((t) => {
                const on = tools.includes(t.id);
                const tone: Tone = t.risk >= 3 ? 'coral' : t.risk === 2 ? 'yellow' : 'green';
                return (
                  <div
                    key={t.id}
                    role="button"
                    data-osd-interactive
                    className={k('chip')}
                    onClick={() => setTools((o) => (o.includes(t.id) ? o.filter((x) => x !== t.id) : [...o, t.id]))}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, background: on ? T[tone].bg : C.panel, boxShadow: on ? `inset 0 0 0 2px ${STRONG[tone]}` : 'none', opacity: on ? 1 : 0.6 }}
                  >
                    <Icon name={on ? 'checkCircle' : 'x'} size={22} color={on ? STRONG[tone] : C.faint} sw={2.4} />
                    <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{t.id}</span>
                    <span style={{ fontSize: 17, color: C.soft, lineHeight: 1.2 }}>{t.what}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.soft }}>
              Pouvoir donné :
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (risk / 12) * 100)}%`, height: '100%', background: STRONG[lvl.tone], transition: `width 400ms ${EASE}` }} />
              </div>
              <Tag tone={lvl.tone} size={18}>
                {lvl.t}
              </Tag>
            </div>
            {injection ? <div style={{ fontSize: 19, color: T.coral.fg, fontWeight: 600 }}>⚠ Terminal + Internet : une page piégée peut lui dicter une commande (injection de prompt).</div> : null}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T[info.tone].bg, color: T[info.tone].fg, borderRadius: 14, padding: '14px 18px', fontSize: 21, fontWeight: 600 }}>
            <Icon name="bulb" size={26} sw={2.2} /> {info.tip}
          </div>
        )}
      </div>
    </Frame>
  );
};

// ─── Créer un agent ─────────────────────────────────────────────────────────
const M9Step = ({ n, title, children, on }: { n: number; title: ReactNode; children: ReactNode; on: boolean }) => (
  <div className={k('gstep')} style={{ display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr)', gap: 16, alignItems: 'start', opacity: on ? 1 : 0.35, transform: on ? 'none' : 'translateX(-8px)' }}>
    <span style={{ width: 56, height: 56, borderRadius: 16, background: on ? G.blue : C.panel, color: on ? '#fff' : C.muted, fontFamily: display, fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const MockBar = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#1B2340', color: '#9AA6C8', fontFamily: mono, fontSize: 17, borderBottom: '1px solid #2A3459' }}>
    <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FF5F57' }} />
    <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FEBC2E' }} />
    <span style={{ width: 11, height: 11, borderRadius: 99, background: '#28C840' }} />
    <span style={{ marginLeft: 10 }}>{children}</span>
  </div>
);

const M9_Creer: Page = () => {
  const [ref, beats] = useBeats();
  const st = Math.min(Math.max(beats, 0), 4);
  const row = (txt: ReactNode, hi = false, icon: IconName = 'doc') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 8, background: hi ? 'rgba(30,34,232,.5)' : 'transparent', color: hi ? '#fff' : '#C9D2EA', fontSize: 19 }}>
      <Icon name={icon} size={20} color={hi ? '#fff' : '#7C86A8'} /> {txt}
    </div>
  );
  return (
    <Frame mod={11} beats={4}>
      <Title>Créer un agent : quatre gestes dans VS Code</Title>
      <Lede>Pas d’extension à installer : un fichier dans le dépôt suffit, et toute l’équipe en profite via Git.</Lede>
      <div ref={ref} style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <M9Step n={1} on={st >= 1} title="Ouvrir les personnalisations">
          <Kbd>Ctrl+Maj+P</Kbd> › « Chat: Open Customizations »
        </M9Step>
        <M9Step n={2} on={st >= 2} title="Onglet Agents › New Agent (+) › Workspace">
          Workspace = dans ce dépôt, partagé par Git. User = pour tous vos projets.
        </M9Step>
        <M9Step n={3} on={st >= 3} title="Nommer, puis écrire le rôle">
          testeur-qa → <PathChip size={18}>.github/agents/testeur-qa.agent.md</PathChip>
        </M9Step>
        <M9Step n={4} on={st >= 4} title="Le choisir dans la liste des agents du chat">
          Il rejoint Ask, Plan et Agent. Testez-le sur une petite tâche connue.
        </M9Step>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 280, width: 800, height: 470, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden', ...dl(200) }}>
        <MockBar>Visual Studio Code · taskflow-copilot</MockBar>
        <div key={st} className={k('swap')} style={{ padding: 22, fontFamily: mono }}>
          {st <= 1 ? (
            <div style={{ background: '#1B2340', borderRadius: 12, padding: 12, boxShadow: '0 16px 40px -16px rgba(0,0,0,.7)' }}>
              <div style={{ background: '#0F1730', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 20, boxShadow: `inset 0 0 0 2px ${C.electric}` }}>&gt; chat: open custo▌</div>
              <div style={{ marginTop: 8 }}>
                {row('Chat: Open Customizations', st >= 1, 'gear')}
                {row('Chat: New Custom Agent…', false, 'plus')}
                {row('Chat: Configure Instructions', false, 'note')}
              </div>
            </div>
          ) : st === 2 ? (
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {['Agents', 'Skills', 'Instructions', 'Prompts'].map((t, i) => (
                  <span key={t} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 18, background: i === 0 ? C.electric : '#1B2340', color: i === 0 ? '#fff' : '#9AA6C8' }}>{t}</span>
                ))}
              </div>
              {row(<><strong>Workspace</strong> · .github/agents</>, false, 'archive')}
              {row('+ New Agent', true, 'plus')}
              {row(<><strong>User</strong> · ~/.copilot/agents</>, false, 'user')}
            </div>
          ) : st === 3 ? (
            <div>
              {row('taskflow-copilot', false, 'archive')}
              {row('  .github', false, 'archive')}
              {row('    agents', false, 'archive')}
              {row('      testeur-qa.agent.md', true, 'doc')}
              {row('    skills', false, 'archive')}
              {row('    copilot-instructions.md', false, 'note')}
            </div>
          ) : (
            <div>
              <div style={{ color: '#9AA6C8', fontSize: 17, marginBottom: 8 }}>CHAT · choisir un agent</div>
              {row('Agent', false, 'bot')}
              {row('Ask', false, 'chat')}
              {row('Plan', false, 'route')}
              <div style={{ height: 1, background: '#2A3459', margin: '8px 0' }} />
              {row('Analyste PO', false, 'user')}
              {row('Développeur', false, 'code')}
              {row('Testeur QA', true, 'flask')}
            </div>
          )}
        </div>
      </div>
      <div className={b.on(4)} style={{ position: 'absolute', left: 1000, top: 780, width: 800 }}>
        <Callout tone="green" icon="send" title="Les relais (handoffs)" size={21}>
          Quand un agent a fini, un bouton propose « Confier au Testeur QA » avec une demande pré-remplie. Vous relisez, puis vous cliquez.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Skills ─────────────────────────────────────────────────────────────────
type SkLvl = 1 | 2 | 3;
const SKILLS9 = [
  { id: 'conventions-taskflow', desc: 'Conventions de code TaskFlow. À utiliser pour écrire du code dans src/.', res: null as string | null },
  { id: 'tests-node', desc: 'Écrire et lancer des tests node:test pour TaskFlow.', res: 'modele.test.js' },
  { id: 'note-de-version', desc: 'Rédiger la note de version d’un sprint.', res: 'gabarit.md' },
];
const SK_REQ: { q: string; lv: SkLvl[] }[] = [
  { q: 'Ajoute des tests pour echeances.js', lv: [1, 3, 1] },
  { q: 'Implémente ticketsEnRetard dans src/', lv: [2, 1, 1] },
  { q: 'Renomme la variable x en total', lv: [1, 1, 1] },
  { q: '/note-de-version sprint 12', lv: [1, 1, 3] },
];
const SK_TOK = (lv: SkLvl) => (lv === 1 ? 0.1 : lv === 2 ? 1.5 : 2.4);

const M9_Skills: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const ri = pick ?? Math.min(Math.max(beats - 1, 0), 3);
  const req = SK_REQ[ri];
  const tok = req.lv.reduce((a, l) => a + SK_TOK(l), 0);
  const LV: Record<SkLvl, { t: string; tone: Tone }> = { 1: { t: 'nom + description', tone: 'grey' }, 2: { t: '+ instructions', tone: 'blue' }, 3: { t: '+ fichiers', tone: 'violet' } };
  return (
    <Frame mod={11} beats={4}>
      <Title>Une Skill : un savoir-faire chargé seulement quand il sert</Title>
      <Lede>Un dossier, un SKILL.md, des fichiers. Copilot lit la description ; le reste n’entre que si la demande le justifie.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CodeDark file=".github/skills/tests-node/SKILL.md" size={19}>
          <span style={{ color: '#7C86A8' }}>---</span>
          {'\n'}
          <Ck>name</Ck>: tests-node
          {'\n'}
          <Ck>description</Ck>: Écrire et lancer des tests
          {'\n'}
          {'  '}node:test pour TaskFlow (AAA, cas limites).
          {'\n'}
          <span style={{ color: '#7C86A8' }}>---</span>
          {'\n'}
          <Cf># Tests node:test pour TaskFlow</Cf>
          {'\n'}- assert/strict, dates fixes AAAA-MM-JJ
          {'\n'}- cas limites : vide, bornes, 29 février…
          {'\n'}- Modèle : [modele.test.js](./modele.test.js)
        </CodeDark>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {[
            ['1', 'Découverte', 'nom + description, toujours lus', 'grey'],
            ['2', 'Instructions', 'le corps du SKILL.md, si pertinent', 'blue'],
            ['3', 'Ressources', 'fichiers cités, si nécessaires', 'violet'],
          ].map(([n, t, s2, tone]) => (
            <div key={n} style={{ background: T[tone as Tone].bg, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, color: T[tone as Tone].fg }}>
                {n} · {t}
              </div>
              <div style={{ marginTop: 4, fontSize: 18, lineHeight: 1.35, color: C.soft }}>{s2}</div>
            </div>
          ))}
        </div>
      </div>
      <div ref={ref} className={A.right} style={{ position: 'absolute', left: 870, top: 290, width: 930, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <PanelTitle icon="chat">Votre demande · cliquez</PanelTitle>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {SK_REQ.map((r, i) => (
            <Btn key={r.q} size={18} ghost={i !== ri} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
              {r.q}
            </Btn>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SKILLS9.map((s, i) => {
            const lv = req.lv[i];
            const L = LV[lv];
            return (
              <div key={`${ri}-${s.id}`} className={k('swap')} style={{ ...dl(i * 90), display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr) 170px', gap: 12, alignItems: 'center', padding: '10px 14px', borderRadius: 14, background: lv > 1 ? T[L.tone].bg : C.panel, boxShadow: lv > 1 ? `inset 0 0 0 2px ${STRONG[L.tone]}` : 'none' }}>
                <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{s.id}</span>
                <span style={{ fontSize: 17, lineHeight: 1.3, color: C.soft }}>
                  {s.desc}
                  {lv === 3 && s.res ? <strong style={{ color: T.violet.fg }}> + {s.res}</strong> : null}
                </span>
                <Tag tone={L.tone} size={16}>
                  {L.t}
                </Tag>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, color: C.soft }}>
          Contexte occupé par les skills :
          <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${(tok / 7.5) * 100}%`, height: '100%', background: G.violet, transition: `width 450ms ${EASE}` }} />
          </div>
          <strong style={{ fontFamily: mono, color: C.ink }}>~{fr(tok, 1)} k tokens</strong>
        </div>
        <div style={{ marginTop: 6, fontSize: 16, color: C.faint }}>Ordres de grandeur illustratifs.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 870, top: 830, width: 930, ...dl(400) }}>
        <Callout tone="yellow" icon="bulb" title="La description fait tout" size={20}>
          Sans les bons mots dans la description, la skill ne se charge jamais. Elle s’appelle aussi à la main : tapez / dans le chat.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Quel fichier pour quel besoin ? ────────────────────────────────────────
const FILES9 = [
  { name: 'copilot-instructions.md', path: '.github/', icon: 'note' as IconName, tone: 'navy' as Tone, when: 'Chargé à chaque demande', what: 'Les règles d’équipe : langage, style, interdits.' },
  { name: '*.prompt.md', path: '.github/prompts/', icon: 'bolt' as IconName, tone: 'green' as Tone, when: 'Lancé par vous : /nom', what: 'Une tâche répétée, toujours décrite pareil.' },
  { name: '*.agent.md', path: '.github/agents/', icon: 'bot' as IconName, tone: 'blue' as Tone, when: 'Choisi dans la liste, ou délégué', what: 'Un rôle : consignes, outils, relais.' },
  { name: 'SKILL.md', path: '.github/skills/<nom>/', icon: 'book' as IconName, tone: 'violet' as Tone, when: 'Chargé si la demande correspond', what: 'Un savoir-faire, avec ses fichiers.' },
];
const SIT9 = [
  { q: '« Toujours node:test, jamais new Date() dans la logique. »', a: 0 },
  { q: '« Générer la note de version à chaque fin de sprint. »', a: 1 },
  { q: '« Un relecteur qui ne modifie jamais de fichier. »', a: 2 },
  { q: '« Notre procédure de tests, avec un fichier modèle. »', a: 3 },
];

const M9_QuelFichier: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const si = pick ?? (beats >= 1 ? Math.min(beats - 1, 3) : null);
  const ans = si === null ? null : SIT9[si].a;
  return (
    <Frame mod={11} kind="exercice" beats={4}>
      <Title>Instructions, prompt, agent ou skill : quel fichier ?</Title>
      <Lede>Quatre fichiers Markdown, quatre usages. Pour chaque besoin, votez à voix haute, puis je clique la réponse.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {SIT9.map((s, i) => (
          <Btn key={s.q} size={20} tone="navy" ghost={si !== i} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
            {i + 1}. {s.q}
          </Btn>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 430, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
        {FILES9.map((f, i) => {
          const on = ans === i;
          const off = ans !== null && !on;
          return (
            <div key={f.name} className={cx(A.in, k('agn'))} style={{ ...dl(150 + i * 100), height: 420, boxSizing: 'border-box', background: C.card, borderRadius: 22, padding: '24px 24px', boxShadow: on ? `0 0 0 5px ${STRONG[f.tone]}, 0 24px 50px -24px rgba(11,31,92,.6)` : `${SHADOW}, inset 0 7px 0 ${STRONG[f.tone]}`, transform: on ? 'translateY(-10px)' : 'none', opacity: off ? 0.4 : 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <IconTile name={f.icon} tone={f.tone} size={60} solid={on} />
              <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ink }}>{f.name}</div>
              <div style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{f.path}</div>
              <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{f.what}</div>
              <div style={{ marginTop: 'auto' }}>
                <Tag tone={f.tone} size={17}>
                  {f.when}
                </Tag>
              </div>
              {on ? (
                <div className={k('swap')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 21, fontWeight: 700, color: T.green.fg }}>
                  <Icon name="checkCircle" size={26} sw={2.4} color={C.green} /> Réponse {(si ?? 0) + 1}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
        Ils se combinent : l’agent Testeur QA suit les instructions d’équipe et charge la skill tests-node.
      </div>
    </Frame>
  );
};

// ─── Orchestration : la simulation ──────────────────────────────────────────
type NodeId = 'H' | 'HUB' | 'PO' | 'DS' | 'DEV' | 'QA' | 'SEC' | 'REV';
const NODES9: Record<NodeId, { x: number; y: number; label: string; icon: IconName; tone: Tone }> = {
  H: { x: 215, y: 655, label: 'Vous', icon: 'humanCheck', tone: 'green' },
  HUB: { x: 700, y: 655, label: 'Chef d’orchestre', icon: 'route', tone: 'navy' },
  PO: { x: 450, y: 420, label: 'Analyste PO', icon: 'target', tone: 'blue' },
  DS: { x: 745, y: 390, label: 'Designer UX', icon: 'palette', tone: 'pink' },
  DEV: { x: 1040, y: 430, label: 'Développeur', icon: 'code', tone: 'violet' },
  QA: { x: 1110, y: 690, label: 'Testeur QA', icon: 'flask', tone: 'teal' },
  SEC: { x: 905, y: 900, label: 'Sécurité', icon: 'shield', tone: 'coral' },
  REV: { x: 495, y: 900, label: 'Reviewer', icon: 'eye', tone: 'yellow' },
};
type Move = [NodeId, NodeId, string];
type SStep = { m: Move[]; log: string; bad?: boolean; gate?: boolean; cost: number };
const SCEN9: { label: string; kind: string; steps: SStep[] }[] = [
  {
    label: 'Nouvelle fonctionnalité',
    kind: 'Relais séquentiel',
    steps: [
      { m: [['H', 'PO', 'brief']], log: 'Vous : « les tickets en retard, les plus en retard d’abord »', cost: 1 },
      { m: [['PO', 'H', 'story']], log: 'Analyste PO : user story + 6 critères → vous validez', gate: true, cost: 2 },
      { m: [['PO', 'DS', 'story validée']], log: 'Designer UX : maquette du badge « En retard »', cost: 2 },
      { m: [['DS', 'DEV', 'maquette']], log: 'Développeur : echeances.js + badge, tests d’acceptation verts', cost: 4 },
      { m: [['DEV', 'QA', 'code']], log: 'Testeur QA : 5 cas limites ajoutés', cost: 3 },
      { m: [['QA', 'DEV', '✗ 29 février']], log: 'Testeur QA : 1 échec (année bissextile) → retour au Développeur', bad: true, cost: 1 },
      { m: [['DEV', 'QA', 'correctif']], log: 'Développeur : correctif ; tous les tests passent', cost: 2 },
      { m: [['QA', 'SEC', 'tests ✓']], log: 'Sécurité : aucun secret, aucune dépendance ajoutée', cost: 2 },
      { m: [['SEC', 'REV', 'feu vert']], log: 'Reviewer : 2 remarques de lisibilité, appliquées', cost: 2 },
      { m: [['REV', 'H', 'PR prête']], log: 'Vous : relecture du diff et fusion de la PR', gate: true, cost: 0 },
    ],
  },
  {
    label: 'Revue en parallèle',
    kind: 'Éventail puis synthèse',
    steps: [
      { m: [['H', 'HUB', 'PR #42']], log: 'Vous : « fais relire la PR #42 »', cost: 1 },
      { m: [['HUB', 'QA', 'diff'], ['HUB', 'SEC', 'diff'], ['HUB', 'REV', 'diff']], log: 'Chef d’orchestre : 3 sous-agents lancés en même temps', cost: 2 },
      { m: [['QA', 'HUB', '2 tests manquants'], ['SEC', 'HUB', '1 faille'], ['REV', 'HUB', '4 remarques']], log: 'Chacun rend son rapport, dans un contexte séparé', cost: 6 },
      { m: [['HUB', 'H', 'synthèse']], log: 'Synthèse : 1 bloquant (faille), 2 tests à ajouter → vous décidez', gate: true, cost: 1 },
    ],
  },
  {
    label: 'Bug en production',
    kind: 'Boucle courte',
    steps: [
      { m: [['H', 'QA', 'ticket #87']], log: 'Vous : « l’export CSV casse les titres avec ; »', cost: 1 },
      { m: [['QA', 'DEV', 'test ✗']], log: 'Testeur QA : un test qui reproduit le bug (rouge)', cost: 2 },
      { m: [['DEV', 'QA', 'correctif']], log: 'Développeur : correctif minimal', cost: 2 },
      { m: [['QA', 'REV', 'test ✓']], log: 'Testeur QA : le test passe, rien d’autre ne casse', cost: 1 },
      { m: [['REV', 'H', 'PR 6 lignes']], log: 'Vous : relecture rapide et fusion', gate: true, cost: 0 },
    ],
  },
  {
    label: 'Garde-fou sécurité',
    kind: 'Blocage et arbitrage',
    steps: [
      { m: [['H', 'DEV', 'brief']], log: 'Vous : « branche TaskFlow sur l’API tickets de l’entreprise »', cost: 1 },
      { m: [['DEV', 'SEC', 'code']], log: 'Développeur : client HTTP écrit', cost: 3 },
      { m: [['SEC', 'DEV', '✗ jeton en clair']], log: 'Sécurité : BLOQUÉ, jeton dans le code et dans l’URL', bad: true, cost: 1 },
      { m: [['DEV', 'SEC', 'variable d’env.']], log: 'Développeur : jeton lu depuis l’environnement, en-tête Authorization', cost: 2 },
      { m: [['SEC', 'H', 'question']], log: 'Sécurité : « quel coffre-fort pour la production ? » → décision humaine', gate: true, cost: 1 },
    ],
  },
];

const AgNode = ({ id, state }: { id: NodeId; state: 'idle' | 'on' | 'done' | 'bad' }) => {
  const n = NODES9[id];
  const on = state === 'on' || state === 'bad';
  const ring = state === 'bad' ? C.coral : STRONG[n.tone];
  const hub = id === 'HUB';
  return (
    <div
      className={k('agn')}
      style={{
        position: 'absolute',
        left: n.x - 110,
        top: n.y - 42,
        width: 220,
        height: 84,
        boxSizing: 'border-box',
        borderRadius: 18,
        background: hub ? G.navy : on ? T[n.tone].bg : C.card,
        color: hub ? '#fff' : C.ink,
        boxShadow: on ? `0 0 0 4px ${ring}, 0 0 0 14px ${T[n.tone].bg}` : SHADOW,
        transform: on ? 'scale(1.07)' : 'none',
        opacity: state === 'idle' ? 0.72 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 14px',
        zIndex: 2,
      }}
    >
      <IconTile name={n.icon} tone={n.tone} size={50} solid={on || hub} />
      <span style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.15 }}>{n.label}</span>
      {state === 'done' ? (
        <span style={{ position: 'absolute', right: -8, top: -8, width: 28, height: 28, borderRadius: 99, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={18} sw={3} />
        </span>
      ) : null}
    </div>
  );
};

const M9_Orchestration: Page = () => {
  const [ref, beats] = useBeats();
  const [sc, setSc] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scen = SCEN9[sc];
  const N = scen.steps.length;
  useEffect(() => {
    if (beats > 3) return;
    setSc(Math.max(0, Math.min(beats, 3)));
    setStep(0);
    setPlaying(true);
  }, [beats]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => Math.min(N, s + 1)), 1700);
    return () => window.clearInterval(id);
  }, [playing, N, sc]);
  useEffect(() => {
    if (step >= N) setPlaying(false);
  }, [step, N]);
  const cur = step > 0 ? scen.steps[step - 1] : null;
  const done = new Set<NodeId>();
  scen.steps.slice(0, Math.max(0, step - 1)).forEach((s) => s.m.forEach(([, to]) => done.add(to)));
  const active = new Set<NodeId>();
  cur?.m.forEach(([, to]) => active.add(to));
  const used = new Set<NodeId>();
  scen.steps.slice(0, step).forEach((s) => s.m.forEach(([a, z]) => [a, z].forEach((x) => x !== 'H' && used.add(x))));
  const gates = scen.steps.slice(0, step).filter((s) => s.gate).length;
  const cost = scen.steps.slice(0, step).reduce((a, s) => a + s.cost, 0);
  const choose = (i: number) => {
    setSc(i);
    setStep(0);
    setPlaying(true);
  };
  return (
    <Frame mod={11} kind="demo" beats={3}>
      <Title>Simulation : une équipe d’agents orchestrée</Title>
      <Lede>Chaque agent a son rôle, ses outils et son propre contexte. Choisissez un scénario et regardez circuler le travail.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 262 }}>
        <MTabs items={SCEN9.map((s) => s.label)} cur={sc} set={choose} size={19} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        {(Object.keys(NODES9) as NodeId[])
          .filter((id) => id !== 'HUB')
          .map((id) => (
            <line key={id} x1={NODES9.HUB.x} y1={NODES9.HUB.y} x2={NODES9[id].x} y2={NODES9[id].y} stroke={C.rule} strokeWidth={3} strokeDasharray="4 10" />
          ))}
        {cur?.m.map(([a, z], i) => (
          <line key={`${sc}-${step}-${i}`} className={k('edge')} x1={NODES9[a].x} y1={NODES9[a].y} x2={NODES9[z].x} y2={NODES9[z].y} stroke={cur.bad ? C.coral : C.electric} strokeWidth={5} strokeLinecap="round" />
        ))}
      </svg>
      {(Object.keys(NODES9) as NodeId[]).map((id) => (
        <AgNode key={id} id={id} state={active.has(id) ? (cur?.bad ? 'bad' : 'on') : done.has(id) ? 'done' : 'idle'} />
      ))}
      {cur?.m.map(([a, z, art], i) => (
        <div
          key={`p-${sc}-${step}-${i}`}
          className={k('pkt')}
          style={{ ['--x0' as string]: `${NODES9[a].x}px`, ['--y0' as string]: `${NODES9[a].y}px`, ['--x1' as string]: `${NODES9[z].x}px`, ['--y1' as string]: `${NODES9[z].y - 62}px`, ...dl(i * 120), zIndex: 3, padding: '6px 14px', borderRadius: 99, background: cur.bad ? C.coral : C.electric, color: '#fff', fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 10px 24px -10px rgba(11,31,92,.8)' } as CSSProperties}
        >
          {art}
        </div>
      ))}
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 262, width: 480, height: 700, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '18px 20px', display: 'flex', flexDirection: 'column', ...dl(200) }}>
        <div style={{ fontSize: 17, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9AA6C8' }}>{scen.kind}</div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          {(
            [
              ['étapes', `${step} / ${N}`],
              ['agents mobilisés', `${used.size}`],
              ['validations humaines', `${gates}`],
              ['crédits (illustratif)', `≈ ${cost * 6}`],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: '#fff' }}>{v}</div>
              <div style={{ fontSize: 15, color: '#9AA6C8' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
          {scen.steps.slice(Math.max(0, step - 6), step).map((s, i, arr) => {
            const last = i === arr.length - 1;
            return (
              <div key={`${sc}-${step - arr.length + i}`} className={k('swap')} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0, 1fr)', gap: 8, padding: '6px 8px', borderRadius: 8, background: last ? 'rgba(255,255,255,.08)' : 'transparent' }}>
                <Icon name={s.bad ? 'alert' : s.gate ? 'humanCheck' : 'send'} size={20} color={s.bad ? C.coral : s.gate ? '#3DDC97' : '#82AAFF'} sw={2.2} />
                <span style={{ fontSize: 17, lineHeight: 1.3, color: last ? '#fff' : '#C9D2EA' }}>{s.log}</span>
              </div>
            );
          })}
          {step === 0 ? <div style={{ fontSize: 18, color: '#7C86A8' }}>Appuyez sur Lecture…</div> : null}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 980, display: 'flex', gap: 10, ...dl(300) }}>
        <Btn icon={playing ? 'pause' : 'play'} size={19} onClick={() => (step >= N ? choose(sc) : setPlaying((p) => !p))}>
          {playing ? 'Pause' : 'Lecture'}
        </Btn>
        <Btn
          icon="arrow"
          size={19}
          ghost
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(N, s + 1));
          }}
        >
          Pas
        </Btn>
        <Btn
          icon="reset"
          size={19}
          ghost
          tone="grey"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        />
      </div>
    </Frame>
  );
};

// ─── Le potentiel ───────────────────────────────────────────────────────────
const GANTT_SOLO: [string, number, number, Tone][] = [
  ['Spécifier', 0, 2, 'blue'],
  ['Maquetter', 2, 4, 'pink'],
  ['Coder', 4, 9, 'violet'],
  ['Tester', 9, 12, 'teal'],
  ['Sécurité', 12, 13.5, 'coral'],
  ['Relire', 13.5, 15, 'yellow'],
];
const GANTT_TEAM: [string, number, number, Tone][] = [
  ['Spécifier', 0, 1, 'blue'],
  ['Maquetter', 1, 2.5, 'pink'],
  ['Coder', 1, 5, 'violet'],
  ['Tester', 2.5, 6, 'teal'],
  ['Sécurité', 5, 6.5, 'coral'],
  ['Relire', 5, 6.5, 'yellow'],
];
const GX9 = (u: number) => (u / 15) * 1180;

const M9Gantt = ({ rows, beat, top, gates }: { rows: [string, number, number, Tone][]; beat: number; top: number; gates: number[] }) => (
  <div style={{ position: 'absolute', left: 300, top, width: 1180, height: rows.length * 34 }}>
    {rows.map(([t, a, z, tone], i) => (
      <div key={t} className={beat ? b.grow(beat) : A.grow} style={{ position: 'absolute', left: GX9(a), top: i * 34, width: GX9(z - a), height: 26, borderRadius: 8, background: STRONG[tone], transformOrigin: 'left center', display: 'flex', alignItems: 'center', paddingLeft: 10, boxSizing: 'border-box', color: '#fff', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', ...dl(i * 140) }}>
        {t}
      </div>
    ))}
    {gates.map((g) => (
      <div key={g} className={beat ? b.pop(beat) : A.pop} style={{ position: 'absolute', left: GX9(g) - 13, top: -34, width: 26, height: 26, transform: 'rotate(45deg)', background: C.green, borderRadius: 5, ...dl(900) }} />
    ))}
  </div>
);

const M9_Potentiel: Page = () => (
  <Frame mod={11} beats={2}>
    <Title>Le potentiel : spécialiser, paralléliser, se vérifier</Title>
    <Lede>Une équipe ne pense pas mieux qu’un seul modèle : elle découpe, parallélise et se contrôle. Durées illustratives.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 320, width: 170, fontSize: 21, fontWeight: 700, color: C.ink }}>
      Un agent seul
      <div style={{ fontSize: 17, fontWeight: 400, color: C.muted }}>tout dans un contexte</div>
    </div>
    <M9Gantt rows={GANTT_SOLO} beat={0} top={320} gates={[15]} />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 170, fontSize: 21, fontWeight: 700, color: C.ink }}>
      Une équipe orchestrée
      <div style={{ fontSize: 17, fontWeight: 400, color: C.muted }}>un contexte par rôle</div>
    </div>
    <M9Gantt rows={GANTT_TEAM} beat={1} top={560} gates={[1, 6.5]} />
    <div className={b.fade(1)} style={{ position: 'absolute', left: 1500, top: 560, width: 300, fontSize: 19, color: C.soft, lineHeight: 1.4 }}>
      <span style={{ display: 'inline-block', width: 16, height: 16, background: C.green, transform: 'rotate(45deg)', borderRadius: 3, marginRight: 10 }} />
      vos validations : la story, puis la PR
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 22 }}>
      <Card tone="blue" icon="target" title="Spécialisation" size={19} pad={18}>
        Un contexte court et propre par rôle : moins de bruit, de meilleures réponses.
      </Card>
      <Card tone="violet" icon="layers" title="Parallélisme" size={19} pad={18}>
        Tests, sécurité et relecture en même temps, sur le même diff.
      </Card>
      <Card tone="teal" icon="shieldCheck" title="Contrôle croisé" size={19} pad={18}>
        Le Testeur ne fait pas confiance au Développeur : il le prouve.
      </Card>
      <Card tone="green" icon="note" title="Traçabilité" size={19} pad={18}>
        Chaque relais laisse un artefact relisible : story, tests, rapport.
      </Card>
    </div>
  </Frame>
);

// ─── Points d’attention ─────────────────────────────────────────────────────
const RISK9: { icon: IconName; t: string; f: string; p: string }[] = [
  { icon: 'euro', t: 'La facture', f: 'Chaque agent et chaque aller-retour consomment des crédits IA.', p: 'Un brief précis, 2 allers-retours maximum, des modèles légers pour les rôles simples.' },
  { icon: 'route', t: 'L’erreur en cascade', f: 'Une story fausse au départ : tout le reste est faux, avec aplomb.', p: 'Vous validez la story avant le premier relais. Toujours.' },
  { icon: 'users', t: 'La complaisance', f: 'Même modèle, mêmes angles morts : des tests qui valident le bug.', p: 'Les tests d’acceptation, c’est vous qui les écrivez ou les relisez.' },
  { icon: 'key', t: 'Trop de pouvoir', f: 'Terminal + Internet + secrets : une page piégée peut dicter une commande.', p: 'Outils minimaux par agent, approbation des commandes, bac à sable.' },
  { icon: 'puzzle', t: 'Les agents et skills de tiers', f: 'Une skill peut contenir des scripts : c’est du code exécuté chez vous.', p: 'Relire avant d’installer, source de confiance, versionner dans le dépôt.' },
  { icon: 'eyeOff', t: 'L’humain hors boucle', f: 'Une PR de 2 000 lignes produite en 10 minutes ne sera jamais vraiment relue.', p: 'Petits lots, relecture du diff, et le « c’est fini » reste à vous.' },
];

const M9_Attention: Page = () => (
  <Frame mod={11} beats={6}>
    <Title>Plus d’autonomie, plus de garde-fous</Title>
    <Lede>Six points d’attention propres à l’orchestration, et leurs parades. Les cartes se retournent au clic.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      {RISK9.map((r, i) => (
        <FlipCard
          key={r.t}
          w={542}
          h={318}
          flipAt={i + 1}
          tone="coral"
          backTone="green"
          cls={A.in}
          style={dl(i * 90)}
          front={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <IconTile name={r.icon} tone="coral" size={54} />
                <span style={{ fontSize: 27, fontWeight: 800, color: C.ink }}>{r.t}</span>
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{r.f}</div>
            </div>
          }
          back={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800, color: T.green.fg }}>
                <Icon name="shieldCheck" size={28} sw={2.4} /> Parade
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.42, color: C.ink }}>{r.p}</div>
            </div>
          }
        />
      ))}
    </div>
  </Frame>
);

// ─── Atelier 9 ──────────────────────────────────────────────────────────────
const M9_Lab: Page = () => (
  <LabPage
    mod={11}
    n="9"
    title="Votre équipe d’agents livre une fonctionnalité"
    defi="agents"
    who="Individuel · 30 min"
    objective={
      <>
        Créer <strong>3 agents</strong> (Analyste PO, Développeur, Testeur QA) et <strong>2 skills</strong> (conventions, tests), puis leur faire livrer les <strong>tickets en retard</strong> sans écrire le code vous-même.
      </>
    }
    where={
      <>
        <PathChip size={19}>ateliers/atelier-09-agents/</PathChip>
        <br />
        <PathChip size={19}>.github/agents/</PathChip> · <PathChip size={19}>.github/skills/</PathChip>
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l9a" size={21}>3 agents et 2 skills, sans TODO, outils minimaux</CheckItem>
        <CheckItem id="l9b" size={21}>test:atelier9 et npm test au vert</CheckItem>
        <CheckItem id="l9c" size={21}>Tests QA ajoutés, relais notés dans JOURNAL.md</CheckItem>
      </>
    }
    bonus={
      <Callout tone="pink" icon="sparkles" title="Bonus" size={19}>
        Même équipe pour l’export CSV, puis un Chef d’orchestre qui délègue aux trois.
      </Callout>
    }
    suivi="Points d’étape à 12 min (agents listés ?) et 24 min (tests verts ?). Ne jamais laisser un agent modifier test/echeances.test.js."
  >
    <WStep n={1}>Copier modeles/.github à la racine, compléter les TODO des 2 skills puis des 3 agents.</WStep>
    <WStep n={2}>Analyste PO : le brief, puis vous validez la story avant le relais.</WStep>
    <WStep n={3}>Développeur, puis Testeur QA : approuvez chaque commande, faites relire chaque relais.</WStep>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M9_Divider, M9_Anatomie, M9_Creer, M9_Skills, M9_QuelFichier, M9_Orchestration, M9_Potentiel, M9_Attention, M9_Lab];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 9 · 16:40

OBJECTIF — Ouvrir le dernier module : passer de « un assistant » à « une équipe d’assistants », sans perdre le contrôle.

DIRE — « Dernier module. Depuis le Module 1, vous savez ce qu’est un agent : un modèle, des outils, une boucle. Dans Copilot, vous pouvez créer vos propres agents, leur donner un rôle précis, des outils limités, des savoir-faire, et les faire travailler ensemble. On voit comment, ce que ça promet, et où ça peut déraper. Puis vous montez votre propre équipe. »

TRANSITION — « Un agent personnalisé, concrètement, c’est un fichier. »`,
  `⏱ 2 min · ANATOMIE D’UN AGENT (5 temps + clics)

OBJECTIF — Lire un fichier .agent.md : chaque champ a un rôle, et les outils sont une décision de sécurité.

DIRE — « Voici le Testeur QA que vous allez créer. En haut, un en-tête : son nom, celui de la liste. » → beat 1 « La description, obligatoire : ce qu’il fait et ce qu’il ne fait jamais ; un chef d’orchestre la lit pour décider à qui confier une tâche. » → beat 2 « Les outils : c’est son permis. Sans edit, il ne modifie rien ; sans execute, pas de terminal. » → beat 3 « Ses skills : la procédure de tests du projet. » → beat 4 « Les relais : un bouton pour passer la main au Développeur, avec une demande pré-remplie. » → beat 5 « Et le corps : son rôle et ses règles, en Markdown. »

ANIMATION — Au beat 2, cliquer web : la jauge monte et l’alerte injection de prompt apparaît. « Terminal plus Internet : une page piégée peut lui souffler une commande. Le minimum d’outils, toujours. » Décocher web.

TRANSITION — « Comment on le crée ? Quatre gestes. »`,
  `⏱ 1 min · CRÉER UN AGENT (4 temps)

OBJECTIF — Montrer le chemin exact dans VS Code et l’emplacement du fichier.

DIRE — → beat 1 « Ctrl+Maj+P, “Chat: Open Customizations”. » → beat 2 « Onglet Agents, New Agent, puis Workspace : le fichier ira dans le dépôt et toute l’équipe l’aura au prochain git pull. User, c’est pour vous seul, dans tous vos projets. » → beat 3 « Un nom, et VS Code crée .github/agents/testeur-qa.agent.md. » → beat 4 « Il apparaît dans la liste des agents du chat, à côté d’Ask, Plan et Agent. Et quand il a fini, un bouton de relais propose de passer au suivant. »

ANIMATION — Si le temps le permet, le faire en direct sur le dépôt (30 s). Les noms de menus peuvent légèrement changer d’une version à l’autre : la commande « Chat: Open Customizations » est le point d’entrée stable.

TRANSITION — « Un agent a un rôle. Une skill, c’est un savoir-faire. »`,
  `⏱ 2 min · SKILLS (4 temps + clics)

OBJECTIF — Comprendre le chargement progressif : la description décide, le reste n’entre que si besoin.

DIRE — « Une skill, c’est un dossier dans .github/skills avec un SKILL.md : un nom, une description, des instructions, et éventuellement des fichiers, ici un modèle de test. Copilot lit en permanence les noms et descriptions de toutes les skills, c’est très léger. » → beat 1 « Je demande des tests : la skill tests-node se charge, et même son fichier modèle. » → beat 2 « J’implémente dans src : c’est conventions-taskflow qui se charge. » → beat 3 « Je renomme une variable : rien ne se charge, le contexte reste léger. » → beat 4 « Et on peut l’appeler à la main, avec une barre oblique. »

ANIMATION — Cliquer les demandes pour montrer la jauge. Insister : « Si la description ne contient pas les mots de vos demandes, la skill dort. » Les tokens sont des ordres de grandeur.

TRANSITION — « Instructions, prompts, agents, skills : on s’y perd. Petit exercice. »`,
  `⏱ 2 min · QUEL FICHIER ? (exercice oral, 4 temps)

OBJECTIF — Distinguer les quatre fichiers de personnalisation.

DIRE — « Quatre besoins. Votez à voix haute : instructions, prompt, agent ou skill ? » → beat 1 « Une règle qui vaut toujours : le fichier d’instructions, chargé à chaque demande. » → beat 2 « Une tâche répétée que vous lancez : un fichier prompt, appelé avec une barre oblique. » → beat 3 « Un rôle avec des outils restreints : un agent. » → beat 4 « Une procédure avec un fichier modèle, utile seulement quand on teste : une skill. »

ANIMATION — Laisser 5 secondes de vote au micro avant chaque clic. Conclure avec la phrase du bas : ils se combinent.

TRANSITION — « Maintenant, faisons travailler plusieurs agents ensemble. »`,
  `⏱ 3 min · SIMULATION D’ORCHESTRATION (démo, 3 temps)

OBJECTIF — Rendre visibles quatre façons d’orchestrer des agents, le potentiel et la place de l’humain.

DIRE — « Sept rôles : vous, un chef d’orchestre, et six agents spécialisés. Scénario 1, une nouvelle fonctionnalité : chacun passe le relais au suivant. Regardez l’étape 2 : vous validez la story. Et l’étape 6 : le Testeur trouve un bug, retour au Développeur. » → beat 1 « Scénario 2 : la revue en parallèle. Le chef d’orchestre lance trois sous-agents en même temps, chacun dans son propre contexte, puis fait la synthèse. » → beat 2 « Scénario 3 : un bug en production. Le Testeur commence par un test qui reproduit le bug. Boucle courte, PR de six lignes. » → beat 3 « Scénario 4 : le garde-fou. La Sécurité bloque un jeton en clair, et finit par une question que seul un humain peut trancher. »

ANIMATION — Chaque clic lance un scénario en lecture automatique ; Pause et Pas permettent de commenter une étape. Montrer les compteurs : agents mobilisés, validations humaines, crédits (illustratifs). Les deux relais avec validation humaine sont marqués d’une icône verte.

TRANSITION — « Pourquoi s’embêter avec une équipe ? »`,
  `⏱ 1 min · LE POTENTIEL (2 temps)

OBJECTIF — Situer le gain réel : découpage, parallélisme, contrôle croisé ; pas une intelligence supérieure.

DIRE — « Un agent seul enchaîne tout dans un seul contexte, qui grossit et se brouille. » → beat 1 « Une équipe : chaque rôle a un contexte court, et plusieurs tâches avancent en parallèle. Les losanges verts, ce sont vos validations : la story au début, la PR à la fin. » → beat 2 « Quatre gains : spécialisation, parallélisme, contrôle croisé, traçabilité. Les durées sont illustratives. »

TRANSITION — « Mais plus d’autonomie, c’est aussi plus de risques. »`,
  `⏱ 2 min · POINTS D’ATTENTION (6 temps, cartes à retourner)

OBJECTIF — Lister les risques propres à l’orchestration et leurs parades.

DIRE — → beat 1 « La facture : chaque agent consomme des crédits ; une boucle mal cadrée coûte cher. » → beat 2 « L’erreur en cascade : si la story est fausse, toute l’équipe se trompe avec aplomb. » → beat 3 « La complaisance : même modèle, mêmes angles morts. Les tests d’acceptation, c’est vous. » → beat 4 « Trop de pouvoir : terminal, Internet et secrets ensemble, c’est la porte ouverte à l’injection de prompt. » → beat 5 « Les skills de tiers peuvent contenir des scripts : relisez avant d’installer. » → beat 6 « L’humain hors boucle : une PR géante ne sera jamais vraiment relue. »

TRANSITION — « À vous de monter votre équipe. »`,
  `⏱ 30 min · ATELIER 9 (individuel) · 16:50

OBJECTIF — Créer 3 agents et 2 skills, et leur faire livrer une fonctionnalité réelle de TaskFlow, en gardant la main.

DIRE — « Dans ateliers/atelier-09-agents, des modèles avec des TODO. Copiez le dossier .github du modèle à la racine. Complétez d’abord les deux skills, puis les trois agents, avec le minimum d’outils. Ensuite, l’Analyste PO reçoit le brief qui est en tête de src/echeances.js. Vous validez sa story, puis relais au Développeur, puis au Testeur QA. Le test d’acceptation test/echeances.test.js est votre garde-fou : aucun agent n’y touche. »

ANIMATION — Lancer le minuteur 30 min. Point d’étape à 12 min : « Vos trois agents sont dans la liste ? » À 24 min : « test:atelier9 au vert ? » Pièges fréquents : un Développeur qui modifie le test d’acceptation (le refuser, renforcer sa règle) ; une skill qui ne se charge pas (description sans les bons mots, ou nom de dossier différent du name) ; le bouton de relais absent (nom de l’agent cible mal orthographié). Corrigés complets dans corriges/ateliers/atelier-09-agents/ : les coller dans le clavardage si quelqu’un est bloqué plus de 10 minutes.

TRANSITION — « Deux volontaires : quel relais avez-vous dû corriger ? Puis on conclut. »`,
];
// @@NOTES-END
