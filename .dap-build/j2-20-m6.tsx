// ─── Module 6 · Évaluer & fiabiliser le code ────────────────────────────────

const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Évaluer et fiabiliser
        <br />
        le code généré
      </>
    }
    sub="Méthodes d’évaluation, équipe d’agents, garde-fous, optimisation, maintenabilité et rétro-ingénierie des prompts."
    dur="14:00 – 16:55 · atelier en binômes"
    kind="atelier"
    labs={
      <>
        <Tag tone="green" size={19}>6.1</Tag>
        <Tag tone="green" size={19}>6.2</Tag>
        <Tag tone="green" size={19}>6.3</Tag>
        <Tag tone="green" size={19}>8.1</Tag>
        <Tag tone="green" size={19}>8.2</Tag>
        <Tag tone="green" size={19}>7.2</Tag>
        <Tag tone="green" size={19}>7.3</Tag>
      </>
    }
  >
    <SecItem n={1}>Pair programming humain–IA, analyses statique et dynamique</SecItem>
    <SecItem n={2}>Une équipe d’agents qui se contrôlent</SecItem>
    <SecItem n={3}>Hooks et tests : des garde-fous déterministes</SecItem>
    <SecItem n={4}>Optimisation, maintenabilité, rétro-ingénierie</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── Pyramide de vérification ───────────────────────────────────────────────
const M6Lvl = ({ w, tone, title, sub, cost, beat }: { w: number; tone: Tone; title: string; sub: string; cost: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
    <div
      style={{
        width: w,
        marginLeft: (1000 - w) / 2,
        flex: 'none',
        height: 104,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: STRONG[tone],
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25 }}>{title}</div>
      <div style={{ fontSize: 19, opacity: 0.9 }}>{sub}</div>
    </div>
    <div style={{ fontSize: 22, color: C.soft, width: 620 }}>{cost}</div>
  </div>
);

const M6_Pyramid: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>La pyramide de vérification du code généré</Title>
    <Lede>Du plus automatique et rapide (en bas) au plus humain et coûteux (en haut). Chaque étage attrape ce que l’autre rate.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column-reverse', gap: 14 }}>
      <M6Lvl w={1000} tone="navy" title="Typage strict, lint, formatage" sub="à chaque édition (hook)" cost="Secondes · attrape API inventées, erreurs de types, style." beat={0} />
      <M6Lvl w={850} tone="blue" title="Tests unitaires" sub="à chaque lot, tests d’abord" cost="Minutes · fixe le comportement métier, cas limites." beat={1} />
      <M6Lvl w={700} tone="violet" title="Analyse statique de sécurité + dépendances" sub="SAST, audit, secrets" cost="Minutes · injections, XSS, paquets vulnérables ou inventés." beat={2} />
      <M6Lvl w={550} tone="teal" title="Tests E2E multi-environnements" sub="navigateurs, écrans, hors ligne" cost="Dizaines de minutes · parcours réels, régressions visuelles." beat={3} />
      <M6Lvl w={400} tone="green" title="Revue humaine" sub="intention, conception" cost="Le plus cher et le plus précieux : est-ce le bon code ?" beat={4} />
    </div>
  </Frame>
);

// ─── Pair programming humain–IA ─────────────────────────────────────────────
const M6Pair = ({ icon, tone, title, who, how, when, d }: { icon: IconName; tone: Tone; title: string; who: string; how: string; when: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `8px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: T[tone].fg }}>{who}</div>
    <div style={{ fontSize: 24, lineHeight: 1.42, color: C.soft }}>{how}</div>
    <div style={{ marginTop: 'auto', fontSize: 22, lineHeight: 1.4, color: C.ink }}>
      <strong>Quand · </strong>
      {when}
    </div>
  </div>
);

const M6_Pair: Page = () => (
  <Frame mod={6}>
    <Title>Pair programming humain–IA : trois formations</Title>
    <Lede>Le pilote tient le clavier, le navigateur garde le cap. Avec l’IA, choisissez qui fait quoi… et changez souvent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 560, display: 'flex', gap: 24 }}>
      <M6Pair icon="bot" tone="violet" title="L’IA pilote" who="Vous naviguez" how="L’agent écrit par lots ; vous validez le plan, relisez chaque diff, corrigez la trajectoire." when="code nouveau, bien spécifié, couvert par des tests." d={100} />
      <M6Pair icon="user" tone="blue" title="Vous pilotez" who="L’IA navigue" how="Vous codez ; l’IA (Ask) challenge, signale les cas oubliés, propose des tests." when="code critique, conception délicate, apprentissage." d={220} />
      <M6Pair icon="loop" tone="green" title="Ping-pong TDD" who="Rôles alternés" how="Vous écrivez un test, l’IA le fait passer ; puis l’inverse. Les tests restent la référence." when="logique métier, refactoring sous contrôle." d={340} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, fontSize: 23, color: C.muted, ...dl(600) }}>
      Et le binôme humain reste précieux : deux personnes qui relisent un prompt et un diff valent mieux qu’une.
    </div>
  </Frame>
);

// ─── Statique vs dynamique ──────────────────────────────────────────────────
const M6Col = ({ tone, icon, title, sub, cls, children }: { tone: Tone; icon: IconName; title: string; sub: string; cls?: string; children: ReactNode }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={58} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
  </div>
);

const M6Tool = ({ what, tools }: { what: string; tools: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
    <span style={{ width: 280, flex: 'none', fontSize: 23, fontWeight: 600, color: C.ink }}>{what}</span>
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{tools}</span>
  </div>
);

const M6_StaticDyn: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Analyse statique et analyse dynamique</Title>
    <Lede>Lire le code sans l’exécuter, puis l’exécuter pour l’observer : les deux sont indispensables, surtout pour du code généré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <M6Col cls={A.in} tone="navy" icon="search" title="Statique" sub="sans exécuter">
        <M6Tool what="Types et lint" tools={<><Tag tone="navy" size={18}>TypeScript strict</Tag><Tag tone="navy" size={18}>ESLint</Tag></>} />
        <M6Tool what="Qualité, dette" tools={<><Tag tone="navy" size={18}>SonarQube</Tag><Tag tone="navy" size={18}>complexité, duplication</Tag></>} />
        <M6Tool what="Sécurité (SAST)" tools={<><Tag tone="navy" size={18}>CodeQL</Tag><Tag tone="navy" size={18}>Semgrep</Tag></>} />
        <M6Tool what="Dépendances, secrets" tools={<><Tag tone="navy" size={18}>npm audit</Tag><Tag tone="navy" size={18}>Dependabot</Tag><Tag tone="navy" size={18}>secret scanning</Tag></>} />
      </M6Col>
      <M6Col cls={b.on(1)} tone="teal" icon="play" title="Dynamique" sub="en exécutant">
        <M6Tool what="Tests unitaires" tools={<><Tag tone="teal" size={18}>Vitest</Tag><Tag tone="teal" size={18}>mutation testing</Tag></>} />
        <M6Tool what="Parcours bout en bout" tools={<><Tag tone="teal" size={18}>Playwright</Tag></>} />
        <M6Tool what="Sécurité (DAST)" tools={<><Tag tone="teal" size={18}>OWASP ZAP</Tag><Tag tone="teal" size={18}>fuzzing</Tag></>} />
        <M6Tool what="Performance, accessibilité" tools={<><Tag tone="teal" size={18}>Lighthouse</Tag><Tag tone="teal" size={18}>axe</Tag></>} />
      </M6Col>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(300) }}>
      <Callout title="L’IA dans la boucle" tone="violet" icon="sparkles" size={23}>
        Faites-lui expliquer un avertissement et proposer un correctif (Copilot Autofix, chat sur l’alerte)… mais c’est l’outil, pas l’IA, qui dit si c’est
        corrigé : on relance l’analyse.
      </Callout>
    </div>
  </Frame>
);

// ─── Tests multi-environnements ─────────────────────────────────────────────
const M6_ENV = [
  { id: 'chromium', g: 'b', label: 'Chromium' },
  { id: 'firefox', g: 'b', label: 'Firefox' },
  { id: 'webkit', g: 'b', label: 'WebKit (Safari)' },
  { id: 'mobile', g: 'v', label: 'Mobile 360 px' },
  { id: 'desktop', g: 'v', label: 'Bureau 1280 px' },
  { id: 'online', g: 'n', label: 'En ligne' },
  { id: 'offline', g: 'n', label: 'Hors ligne' },
  { id: 'paris', g: 'z', label: 'Europe/Paris' },
  { id: 'utc', g: 'z', label: 'UTC' },
];

const M6Env = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => (
  <Toggle on={on} onChange={flip} tone="teal" size={23} label={M6_ENV[i].label} />
);

const M6Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Eyebrow c={C.muted} size={17}>
      {title}
    </Eyebrow>
    {children}
  </div>
);

const M6_MultiEnv: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({ chromium: true, firefox: false, webkit: false, mobile: true, desktop: false, online: true, offline: false, paris: true, utc: false });
  const flip = (id: string) => setOn((o) => ({ ...o, [id]: !o[id] }));
  const count = (g: string) => Math.max(1, M6_ENV.filter((e) => e.g === g && on[e.id]).length);
  const combos = count('b') * count('v') * count('n') * count('z');
  const runs = combos * 3;
  const minutes = (runs * 20) / 60;
  return (
    <Frame mod={6} kind="exercice">
      <Title>Tests multi-environnements : la matrice</Title>
      <Lede>Activez les dimensions à couvrir. 3 parcours critiques, ~20 s chacun : combien coûte votre matrice ?</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1040, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <M6Group title="Navigateurs">
          <M6Env i={0} on={on.chromium} flip={() => flip('chromium')} />
          <M6Env i={1} on={on.firefox} flip={() => flip('firefox')} />
          <M6Env i={2} on={on.webkit} flip={() => flip('webkit')} />
        </M6Group>
        <M6Group title="Écrans">
          <M6Env i={3} on={on.mobile} flip={() => flip('mobile')} />
          <M6Env i={4} on={on.desktop} flip={() => flip('desktop')} />
        </M6Group>
        <M6Group title="Réseau">
          <M6Env i={5} on={on.online} flip={() => flip('online')} />
          <M6Env i={6} on={on.offline} flip={() => flip('offline')} />
        </M6Group>
        <M6Group title="Fuseau horaire">
          <M6Env i={7} on={on.paris} flip={() => flip('paris')} />
          <M6Env i={8} on={on.utc} flip={() => flip('utc')} />
        </M6Group>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1220, top: 262, width: 580, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={18}>
          Votre matrice
        </Eyebrow>
        <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: C.teal }}>{combos}</div>
        <div style={{ fontSize: 24, color: C.soft }}>combinaisons · {runs} exécutions</div>
        <div style={{ marginTop: 16, fontSize: 30, fontWeight: 700, color: minutes > 10 ? C.coral : C.green }}>≈ {fr(minutes, 0)} min de CI</div>
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          {combos >= 12 ? 'Trop pour chaque PR : gardez la matrice complète pour la nuit.' : 'Raisonnable pour chaque PR.'}
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1220, top: 640, width: 580, ...dl(300) }}>
        <Callout title="Stratégie" tone="teal" icon="route" size={21}>
          À chaque PR : la combinaison la plus risquée (mobile, hors ligne). Chaque nuit : toute la matrice. Le fuseau UTC révèle les bugs de dates.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Sprint 6 : une équipe d'agents ─────────────────────────────────────────
const M6Agent = ({ x, y, icon, tone, name, role, tools, beat }: { x: number; y: number; icon: IconName; tone: Tone; name: string; role: string; tools: string; beat: number }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x, top: y, width: 290, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 18px', borderTop: `6px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} />
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 21, color: T[tone].fg }}>{name}</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.35, color: C.ink }}>{role}</div>
    <div style={{ marginTop: 6, fontFamily: mono, fontSize: 16, color: C.muted }}>{tools}</div>
  </div>
);

const M6_Team: Page = () => (
  <Frame mod={6} beats={5} label="Fil rouge · Sprint 6 — Agents & orchestration">
    <Title>Sprint 6 : d’un assistant à une équipe d’agents</Title>
    <Lede>Des spécialistes aux droits limités, un lead qui planifie, délègue et décide sur des comptes rendus courts.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={700} y1={420} x2={265} y2={560} color={C.faint} n={1} />
      <Arrow x1={760} y1={420} x2={575} y2={560} color={C.faint} n={2} />
      <Arrow x1={860} y1={420} x2={885} y2={560} color={C.faint} n={3} />
      <Arrow x1={920} y1={420} x2={1195} y2={560} color={C.faint} n={4} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 560, top: 262, width: 500, background: G.navy, borderRadius: 20, padding: '18px 24px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name="org" tone="violet" size={54} solid />
        <div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 24 }}>feature-lead</div>
          <div style={{ fontSize: 19, color: '#C9D2F2' }}>planifie · délègue · décide · rapporte</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontFamily: mono, fontSize: 16, color: '#AEB9E6' }}>read, search, todo, agent, edit (rapport seulement)</div>
    </div>
    <M6Agent x={120} y={560} icon="code" tone="blue" name="developer" role="réalise une tâche, sans élargir le périmètre" tools="read search edit execute" beat={1} />
    <M6Agent x={430} y={560} icon="flask" tone="pink" name="tester" role="écrit et lance les tests, rien d’autre" tools="read search edit execute" beat={2} />
    <M6Agent x={740} y={560} icon="wand" tone="green" name="refactorer" role="simplifie, comportement inchangé" tools="read search edit execute" beat={3} />
    <M6Agent x={1050} y={560} icon="shieldCheck" tone="coral" name="security-reviewer" role="audite, signale, ne corrige pas" tools="read search" beat={4} />
    <div className={b.on(5)} style={{ position: 'absolute', left: 1400, top: 262, width: 400 }}>
      <CodeDark file="Compte rendu commun" size={19}>
        Statut : <Cs>OK</Cs> | <Cn>KO</Cn> | <Cn>BLOQUÉ</Cn>
        {'\n'}Fichiers : …{'\n'}Tests : npm test → …{'\n'}Points ouverts : …{'\n'}Recommandation : …
      </CodeDark>
      <div style={{ marginTop: 16, fontSize: 21, lineHeight: 1.42, color: C.soft }}>
        5 lignes maximum : le lead décide sur ce contrat, sans relire les diffs. Son contexte reste compact.
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(300) }}>
      <Callout title="Le principe" tone="violet" icon="layers" size={22}>
        Chaque sous-agent démarre avec un contexte neuf et ne renvoie que son compte rendu. Celui qui audite ne corrige pas ; celui qui teste ne touche pas au code.
      </Callout>
    </div>
  </Frame>
);

// ─── Labs 6.1, 6.2, 6.3 ─────────────────────────────────────────────────────
const M6_Lab61: Page = () => (
  <LabPage
    mod={6}
    n="6.1"
    title="Les spécialistes"
    defi="construire"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 6 — Agents & orchestration"
    where={
      <>
        <PathChip>.github/agents/</PathChip> developer · tester · refactorer · security-reviewer <PathChip>.agent.md</PathChip>
      </>
    }
    objective="Créer 4 agents spécialisés, chacun avec ses outils et son modèle, qui terminent tous par le même compte rendu court."
    feats={
      <>
        <Tag tone="blue" size={18}>tools</Tag>
        <Tag tone="blue" size={18}>model</Tag>
        <Tag tone="blue" size={18}>Compte rendu commun</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l61a" size={21}>4 agents sélectionnables</CheckItem>
        <CheckItem id="l61b" size={21}>Le security-reviewer ne peut rien modifier</CheckItem>
        <CheckItem id="l61c" size={21}>Section « Tu ne fais jamais » partout</CheckItem>
      </>
    }
  >
    Remplissez d’abord le tableau de conception et le format du compte rendu, faites-les valider, puis écrivez les 4 fichiers et testez chaque agent seul.
    <CodeDark size={18} style={{ marginTop: 12 }}>
      Agent             | Rôle | Outils | Modèle | JAMAIS{'\n'}developer         | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}tester            | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}refactorer        | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}security-reviewer | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}Compte rendu commun : <Hole>…</Hole>
    </CodeDark>
  </LabPage>
);

const M6_Lab62: Page = () => (
  <LabPage
    mod={6}
    n="6.2"
    title="Le feature-lead"
    defi="squelette"
    who="Tech Leads"
    label="Fil rouge · Sprint 6 — Agents & orchestration"
    where={
      <>
        <PathChip>.github/agents/feature-lead.agent.md</PathChip> · rapports dans <PathChip>docs/reports/</PathChip>
      </>
    }
    objective="Créer le lead : il planifie, délègue chaque tâche aux spécialistes en sous-agents, décide sur leurs comptes rendus et rédige un rapport. Il ne touche jamais au code."
    feats={
      <>
        <Tag tone="blue" size={18}>Sous-agents</Tag>
        <Tag tone="blue" size={18}>agents:</Tag>
        <Tag tone="blue" size={18}>handoffs (option)</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l62a" size={21}>N’appelle que les 4 spécialistes</CheckItem>
        <CheckItem id="l62b" size={21}>Décision écrite pour OK, KO, BLOQUÉ</CheckItem>
        <CheckItem id="l62c" size={21}>N’écrit que dans docs/reports/</CheckItem>
      </>
    }
  >
    Complétez l’en-tête et les règles de décision. Que décide le lead pour chaque statut ? Quand rend-il la main ?
    <CodeDark size={18} wrap style={{ marginTop: 10 }}>
      <Ck>tools</Ck>: ['read', 'search', 'todo', <Hole>sous-agents</Hole>, <Hole>rapport</Hole>]{'\n'}
      <Ck>agents</Ck>: <Hole>lesquels ?</Hole> · <Ck>model</Ck>: <Hole>type</Hole>
      {'\n'}Statut OK : <Hole>…</Hole>
      {'\n'}Statut KO (tests rouges) : <Hole>…</Hole>
      {'\n'}Statut BLOQUÉ (audit) : <Hole>…</Hole>
      {'\n'}
      <Hole>au bout de combien d’échecs rends-tu la main ?</Hole>
      {'\n'}Tu ne fais jamais : <Hole>…</Hole>
    </CodeDark>
  </LabPage>
);

const M6_Lab63: Page = () => (
  <LabPage
    mod={6}
    n="6.3"
    title="Orchestration : le mode hors ligne"
    defi="construire"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 6 — Agents & orchestration"
    where={
      <>
        Aucun nouvel agent. Code dans <PathChip>src/</PathChip> <PathChip>public/</PathChip> · rapport <PathChip>docs/reports/pwa-hors-ligne.md</PathChip>
      </>
    }
    objective="Confier une vraie feature au feature-lead et le laisser orchestrer : plan validé, délégations, décisions sur comptes rendus, rapport final."
    feats={
      <>
        <Tag tone="blue" size={18}>Orchestration</Tag>
        <Tag tone="blue" size={18}>Contexte isolé</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l63a" size={21}>Plan validé avant toute délégation</CheckItem>
        <CheckItem id="l63b" size={21}>Aucun fichier modifié hors docs/reports/</CheckItem>
        <CheckItem id="l63c" size={21}>Décisions et raisons dans le rapport</CheckItem>
        <CheckItem id="l63d" size={21}>Installable, se recharge hors ligne</CheckItem>
      </>
    }
  >
    Écrivez le prompt confié au feature-lead : la feature (PWA installable et hors ligne), le périmètre (manifeste, service worker, icônes, bannière), le hors
    périmètre, les principes, le critère de fin, le rapport attendu.
    <div style={{ marginTop: 12, fontSize: 22, color: C.ink }}>
      Puis analysez le rapport : combien de tâches, combien de retours au developer, et une décision du lead que vous auriez prise autrement.
    </div>
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: C.pink }}>
      <Icon name="sparkles" size={22} color={C.pink} /> Bonus 6.4 : qa-explorer, un agent qui teste l’appli comme un humain (MCP Playwright).
    </div>
  </LabPage>
);

// ─── Hooks ──────────────────────────────────────────────────────────────────
const M6_Hooks: Page = () => (
  <Frame mod={6} beats={1} label="Fil rouge · Sprint 8 — Garde-fous">
    <Title>Consigne ou hook : probabiliste ou déterministe</Title>
    <Lede>Une consigne peut être oubliée par le modèle. Un hook, jamais : c’est une commande exécutée par l’outil, pas par l’IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.yellow}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="chat" tone="yellow" size={56} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>Consigne</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 21, color: C.soft }}>« Pense à lancer le lint après chaque modification. »</div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.ink }}>Suivie… la plupart du temps. Le modèle peut l’oublier, surtout quand le contexte est chargé.</div>
      </div>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.green}`, ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="bolt" tone="green" size={56} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>Hook</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 21, color: C.soft }}>postToolUse → npm run lint:fix && prettier</div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.ink }}>Exécuté à chaque édition, quoi que pense le modèle. Rapide, ciblé, vérifiable.</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="coral" icon="shield" title="Avant un outil" style={{ flex: 1 }} size={22}>
        Bloquer une commande dangereuse (rm -rf, push --force), une écriture hors du dossier autorisé.
      </Card>
      <Card tone="green" icon="checkCircle" title="Après un outil" style={{ flex: 1 }} size={22}>
        Formater, linter, lancer les tests ciblés, renvoyer les erreurs au modèle.
      </Card>
      <Card tone="navy" icon="clock" title="La règle d’or" style={{ flex: 1 }} size={22}>
        Un hook rapide et bien choisi vaut mieux que dix hooks lents qui ralentissent chaque édition.
      </Card>
    </div>
  </Frame>
);

const M6_Lab81: Page = () => (
  <LabPage
    mod={6}
    n="8.1"
    title="Un hook : lint et formatage"
    defi="squelette"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 8 — Garde-fous"
    where={
      <>
        <PathChip>.github/hooks/quality.json</PathChip>
      </>
    }
    objective="Créer un hook qui lance le lint et le formatage automatiquement chaque fois que l’agent modifie un fichier."
    feats={
      <>
        <Tag tone="blue" size={18}>Hooks</Tag>
        <Tag tone="blue" size={18}>postToolUse</Tag>
      </>
    }
    minutes={10}
    crit={
      <>
        <CheckItem id="l81a" size={21}>Se déclenche après une édition</CheckItem>
        <CheckItem id="l81b" size={21}>Fonctionne sous Windows et Linux</CheckItem>
        <CheckItem id="l81c" size={21}>Un fichier mal formaté est corrigé seul</CheckItem>
      </>
    }
  >
    Complétez, puis demandez une modification mal formatée pour vérifier le déclenchement.
    <CodeDark size={18} style={{ marginTop: 10 }}>
      {'{'}
      {'\n  '}
      <Cs>"version"</Cs>: <Hole>…</Hole>,{'\n  '}
      <Cs>"hooks"</Cs>: {'{'}
      {'\n    '}
      <Cs>"</Cs>
      <Hole>événement APRÈS un outil</Hole>
      <Cs>"</Cs>: [{'{'}
      {'\n      '}
      <Cs>"type"</Cs>: <Cs>"command"</Cs>, <Cs>"matcher"</Cs>: <Hole>quels outils ?</Hole>,{'\n      '}
      <Cs>"bash"</Cs>: <Hole>…</Hole>, <Cs>"powershell"</Cs>: <Hole>…</Hole>,{'\n      '}
      <Cs>"timeoutSec"</Cs>: <Hole>…</Hole>
      {'\n    }]\n  }\n}'}
    </CodeDark>
  </LabPage>
);

const M6_Lab82: Page = () => (
  <LabPage
    mod={6}
    n="8.2"
    title="Tests unitaires & E2E par l’agent tester"
    defi="trous"
    who="Développeurs · QA"
    label="Fil rouge · Sprint 8 — Garde-fous"
    where={
      <>
        <PathChip>src/domain/*.test.ts</PathChip> · <PathChip>tests/e2e/</PathChip>
      </>
    }
    objective="Compléter la couverture : tests unitaires des règles de dates et 3 tests E2E Playwright des parcours critiques, en mobile et bureau."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent tester</Tag>
        <Tag tone="blue" size={18}>Playwright</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l82a" size={21}>Les tests de dates passent à toute heure</CheckItem>
        <CheckItem id="l82b" size={21}>3 tests E2E verts en local</CheckItem>
        <CheckItem id="l82c" size={21}>Aucun sélecteur CSS fragile</CheckItem>
      </>
    }
    bonus={
      <Callout title="Bonus · Lab 8.3" tone="pink" icon="sparkles" size={19}>
        Revue de PR par Copilot, guidée par vos critères (dont la sécurité front).
      </Callout>
    }
  >
    Complétez le prompt pour l’agent tester.
    <CodeDark size={20} wrap style={{ marginTop: 12 }}>
      Écris les tests manquants pour <Hole>fichier(s)</Hole>.{'\n'}Cas limites de dates : <Hole>au moins 4</Hole>.{'\n'}Puis 3 tests Playwright : <Hole>parcours</Hole>, en{' '}
      <Hole>résolution(s)</Hole>.{'\n'}Règles : <Hole>comment rendre les tests stables ?</Hole>
      {'\n'}Termine par <Hole>…</Hole>.
    </CodeDark>
  </LabPage>
);

// ─── Optimisation & maintenabilité ──────────────────────────────────────────
const M6Smell = ({ smell, fix, d }: { smell: string; fix: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', alignItems: 'center', gap: 10, ...dl(d) }}>
    <div style={{ background: T.coral.bg, borderRadius: 14, padding: '14px 20px', fontSize: 23, color: C.ink }}>{smell}</div>
    <Icon name="arrow" size={34} color={C.faint} style={{ margin: '0 auto' }} />
    <div style={{ background: T.green.bg, borderRadius: 14, padding: '14px 20px', fontSize: 23, color: C.ink }}>{fix}</div>
  </div>
);

const M6_Maintain: Page = () => (
  <Frame mod={6}>
    <Title>Optimisation et maintenabilité : la dette va vite aussi</Title>
    <Lede>L’IA écrit plus de code, plus vite. Les études (GitClear 2025) observent plus de duplication et moins de refactoring.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 10, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>SYMPTÔME FRÉQUENT</span>
        <span />
        <span>RÉPONSE</span>
      </div>
      <M6Smell smell="Code dupliqué plutôt que réutilisé" fix="Instructions : « réutilise src/domain », détection de duplication en CI" d={100} />
      <M6Smell smell="Fonctions longues, complexité élevée" fix="Seuils de complexité dans le lint, agent refactorer tests au vert" d={200} />
      <M6Smell smell="Dépendance ajoutée pour trois lignes" fix="Règle « pas de dépendance sans le signaler », budget de bundle" d={300} />
      <M6Smell smell="Performance ignorée (O(n²), rendus inutiles)" fix="Exiger la complexité attendue, mesurer (Lighthouse, profiler)" d={400} />
      <M6Smell smell="Nommage générique (data, item2, handleStuff)" fix="Glossaire du PRODUCT.md, revue ciblée sur les noms" d={500} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(700) }}>
      <Callout title="Le critère ultime" tone="navy" icon="users" size={23}>
        Dans six mois, un collègue (ou un agent) devra modifier ce code. Lisible, testé, documenté par ses tests : sinon, l’accélération d’aujourd’hui est un emprunt.
      </Callout>
    </div>
  </Frame>
);

// ─── Labs 7.2 et 7.3 (QCM) ──────────────────────────────────────────────────
const M6_Lab72: Page = () => (
  <Frame mod={6} kind="lab" label="Fil rouge · Sprint 7 — Optimisation">
    <Title>
      <span style={{ color: C.green }}>Lab 7.2</span> · Alléger le contexte
    </Title>
    <Lede>Un contexte plus petit, c’est moins cher… et un modèle plus concentré. Six situations réelles.</Lede>
    <QuizSeries y={255}>
      <QuizQ q="Depuis ce matin, la même session enchaîne inventaire, bug CSS et question Git. Nouvelle tâche :" explain="Une tâche = une session : l’historique précédent est du contexte payé à chaque requête, sans valeur.">
        <QOpt>Continuer dans la même session : l’agent garde tout en mémoire</QOpt>
        <QOpt ok>Ouvrir une nouvelle session (Ctrl+N) dédiée à la tâche</QOpt>
        <QOpt>Coller un résumé des échanges précédents</QOpt>
        <QOpt>Désactiver les fichiers d’instructions</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez qu’un agent ajoute un filtre à l’écran Inventaire." explain="Des mentions précises donnent un contexte petit et pertinent ; l’agent sait chercher le reste.">
        <QOpt>« Voici tout le projet #codebase, ajoute un filtre »</QOpt>
        <QOpt ok>Nommer les 2 ou 3 fichiers utiles avec #</QOpt>
        <QOpt>Coller le contenu de tous les fichiers de src/</QOpt>
        <QOpt>Ne donner aucun contexte</QOpt>
      </QuizQ>
      <QuizQ q="À chaque exécution, npm test affiche 400 lignes que l’agent relit." explain="Les sorties d’outils sont souvent le premier poste de tokens : une règle de test concise profite à toutes les sessions.">
        <QOpt>Désactiver les tests pendant le développement</QOpt>
        <QOpt>Demander à l’agent de ne jamais lire la sortie</QOpt>
        <QOpt ok>Règle dans tests.instructions.md : tests ciblés, rapporteur concis</QOpt>
        <QOpt>Passer à un modèle avec une plus grande fenêtre</QOpt>
      </QuizQ>
      <QuizQ q="L’agent a besoin de la documentation de Dexie (3 000 lignes)." explain="Un skill n’est chargé que lorsqu’il sert, et sa version réduite coûte peu.">
        <QOpt>La coller en entier à chaque session</QOpt>
        <QOpt ok>Un skill réduit aux 30 lignes utiles, chargé à la demande</QOpt>
        <QOpt>L’ajouter dans copilot-instructions.md</QOpt>
        <QOpt>Laisser l’agent deviner l’API</QOpt>
      </QuizQ>
      <QuizQ q="La session s’allonge, vous voulez continuer sans perdre les décisions prises." explain="/compact résume l’historique ; le faire vous-même évite qu’un compactage automatique efface un détail.">
        <QOpt ok>Lancer /compact au bon moment</QOpt>
        <QOpt>Fermer et rouvrir VS Code</QOpt>
        <QOpt>Ajouter « souviens-toi de tout » au prompt</QOpt>
        <QOpt>Recommencer la tâche depuis le début</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez essayer une approche alternative sans encombrer la session." explain="/fork copie la session jusqu’au message courant : la variante hérite du contexte, la session principale reste propre.">
        <QOpt ok>Lancer /fork pour explorer la variante</QOpt>
        <QOpt>Créer un nouveau dépôt</QOpt>
        <QOpt>Écrire la variante dans la même session puis l’annuler</QOpt>
        <QOpt>Désactiver les instructions</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Lab73: Page = () => (
  <Frame mod={6} kind="lab" label="Fil rouge · Sprint 7 — Optimisation">
    <Title>
      <span style={{ color: C.green }}>Lab 7.3</span> · Alléger la facture : modèles, outils, scripts
    </Title>
    <Lede>Depuis juin 2026, chaque token est facturé. Six choix, à qualité égale.</Lede>
    <QuizSeries y={255}>
      <QuizQ q="Quel modèle pour planifier une feature, puis pour exécuter un plan clair ?" explain="Le raisonnement sert au plan ; un plan clair s’exécute très bien avec un modèle économique. L’agent fige ce choix par rôle.">
        <QOpt>Le modèle le plus puissant pour les deux</QOpt>
        <QOpt ok>Raisonnement pour planifier (lead), économique ou Auto pour exécuter</QOpt>
        <QOpt>Le moins cher pour les deux</QOpt>
        <QOpt>Le modèle n’a pas d’impact sur le coût</QOpt>
      </QuizQ>
      <QuizQ q="Pour du pur code, les serveurs MCP GitHub et Playwright sont actifs avec tous leurs outils." explain="Chaque outil déclaré ajoute sa définition au contexte : n’exposer que l’utile réduit tokens et erreurs.">
        <QOpt>Les laisser : plus d’outils, plus de capacités</QOpt>
        <QOpt ok>Désactiver les outils inutiles (Configure Tools)</QOpt>
        <QOpt>Ajouter un serveur MCP supplémentaire</QOpt>
        <QOpt>Supprimer .mcp.json</QOpt>
      </QuizQ>
      <QuizQ q="Il faut générer 40 fiches recettes au même format." explain="Une boucle coûte moins cher dans un script que dans une conversation : l’agent écrit le script une fois.">
        <QOpt>Demander 40 fois à l’agent</QOpt>
        <QOpt ok>Faire écrire un script de génération, puis l’exécuter</QOpt>
        <QOpt>Copier-coller 40 fois la même réponse</QOpt>
        <QOpt>Ouvrir 40 sessions en parallèle</QOpt>
      </QuizQ>
      <QuizQ q="En pleine session, vous hésitez à modifier copilot-instructions.md ou à changer de modèle." explain="Le cache de prompt réutilise le début stable de la requête : le modifier en cours de session l’invalide.">
        <QOpt>Aucun impact</QOpt>
        <QOpt ok>Ça casse le cache de prompt : faites-le en début de session</QOpt>
        <QOpt>Ça accélère toujours les réponses</QOpt>
        <QOpt>C’est recommandé toutes les 10 requêtes</QOpt>
      </QuizQ>
      <QuizQ q="Un modèle bon marché échoue trois fois ; un plus cher réussit du premier coup." explain="On compare le coût de tâches réussies, pas le prix au token.">
        <QOpt>Le bon marché reste toujours plus économique</QOpt>
        <QOpt ok>Comparer le coût total à qualité égale</QOpt>
        <QOpt>Toujours prendre le plus cher</QOpt>
        <QOpt>Le nombre d’essais ne compte pas</QOpt>
      </QuizQ>
      <QuizQ q="Où voir le coût d’une réponse pendant que vous travaillez ?" explain="Le survol du pied de réponse affiche la consommation ; le sélecteur de modèles compare les coûts.">
        <QOpt>Uniquement sur la facture mensuelle</QOpt>
        <QOpt ok>Au survol du pied de la réponse (et dans le sélecteur de modèles)</QOpt>
        <QOpt>Dans package.json</QOpt>
        <QOpt>Dans l’onglet Actions de GitHub</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Rétro-ingénierie des prompts ───────────────────────────────────────────
const M6Retro = ({ sym, miss, fix, beat }: { sym: string; miss: string; fix: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '520px 440px 1fr', gap: 16 }}>
    <div style={{ background: T.coral.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, color: C.ink }}>{sym}</div>
    <div style={{ background: T.yellow.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, color: C.ink }}>{miss}</div>
    <div style={{ background: T.green.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, color: C.ink }}>{fix}</div>
  </div>
);

const M6_Retro: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Rétro-ingénierie : du mauvais résultat au meilleur prompt</Title>
    <Lede>Un résultat décevant est un diagnostic : quel ingrédient manquait ? Puis on capitalise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '520px 440px 1fr', gap: 16, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>CE QUE L’AGENT A FAIT</span>
        <span>INGRÉDIENT MANQUANT</span>
        <span>CORRECTIF DURABLE</span>
      </div>
      <M6Retro sym="Il a modifié 12 fichiers pour un filtre" miss="Tâche non bornée" fix="« uniquement… » + lots ; règle dans les instructions" beat={0} />
      <M6Retro sym="Il a stocké les données dans localStorage" miss="Contexte : l’ADR n’était pas joint" fix="#docs/adr/0001 ; instruction « stockage via src/data »" beat={1} />
      <M6Retro sym="Ses tests passent… sur du code faux" miss="Tests écrits après le code" fix="TDD ; règle dans tests.instructions.md" beat={2} />
      <M6Retro sym="Il a codé les couleurs en dur" miss="Convention non écrite" fix="skill create-component + script check.mjs" beat={3} />
      <M6Retro sym="Il tourne en boucle sans s’arrêter" miss="Pas de critère de fin" fix="commande de fin + limite d’échecs (feature-lead)" beat={4} />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(300) }}>
      <Callout title="Règle de capitalisation" tone="violet" icon="layers" size={23}>
        Une correction de prompt répétée deux fois devient une <strong>instruction</strong>, un <strong>skill</strong> ou un <strong>hook</strong>. Votre configuration
        apprend, pas seulement vous.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier en binômes ─────────────────────────────────────────────────────
const M6Step = ({ n, title, t, children, d }: { n: number; title: string; t: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="yellow" size={50} />
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</span>
        <Tag tone="grey" size={17}>
          {t}
        </Tag>
      </div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_AtelierBrief: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Atelier en binômes : améliorer un code produit par IA</Title>
    <Lede>Un pilote, un navigateur, on échange à mi-parcours. Un code plus sûr, lisible, testé… et son prompt.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <M6Step n={1} title="Caractériser" t="5 min" d={100}>
        Écrire des tests qui figent le comportement actuel, y compris les bugs repérés.
      </M6Step>
      <M6Step n={2} title="Analyser" t="5 min" d={200}>
        Lint strict, types, SAST : lister et prioriser les problèmes.
      </M6Step>
      <M6Step n={3} title="Refactorer avec l’IA" t="10 min" d={300}>
        Petits pas, tests au vert à chaque étape ; l’agent refactorer peut aider.
      </M6Step>
      <M6Step n={4} title="Rétro-prompt" t="5 min" d={400}>
        Écrire le prompt qui aurait produit la bonne version du premier coup.
      </M6Step>
      <M6Step n={5} title="Capitaliser" t="5 min" d={500}>
        Une règle ajoutée aux instructions, à un skill ou à la checklist de revue.
      </M6Step>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="m6-binome" minutes={30} label="Atelier binômes" cls={A.right} style={{ width: 540 }} />
      <Card tone="green" icon="checkCircle" title="Livrables" cls={A.right} style={dl(200)} size={22}>
        Code amélioré et testé · liste priorisée · prompt amélioré · une règle capitalisée.
      </Card>
    </div>
  </Frame>
);

const M6_AtelierCode: Page = () => {
  const [after, setAfter] = useState(false);
  return (
    <Frame mod={6} kind="atelier">
      <Title>Le code à améliorer : le tableau « kg et € sauvés »</Title>
      <Lede>Généré en une requête, « ça marche » en démo. Combien de problèmes ? Puis basculez sur « Après ».</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 12 }}>
        <Btn tone={after ? 'grey' : 'coral'} ghost={after} size={21} icon="bug" onClick={() => setAfter(false)}>
          Avant (généré)
        </Btn>
        <Btn tone={after ? 'green' : 'grey'} ghost={!after} size={21} icon="checkCircle" onClick={() => setAfter(true)}>
          Après (amélioré)
        </Btn>
      </div>
      {after ? (
        <CodeDark key="after" file="src/domain/impact.ts — après" size={21} cls={A.fade} style={{ position: 'absolute', left: 120, top: 330, width: 1160 }}>
          <Ck>const</Ck> EURO_PER_KG = <Cn>3.5</Cn>; <Cc>{'// hypothèse documentée dans PRODUCT.md'}</Cc>
          {'\n'}
          <Ck>const</Ck> KG_FACTOR: Record{'<'}Unit, <Ck>number</Ck> | <Ck>null</Ck>{'>'} = {'{'} g: <Cn>0.001</Cn>, kg: <Cn>1</Cn>, ml: <Cn>0.001</Cn>, L: <Cn>1</Cn>, pièce: <Ck>null</Ck> {'}'};
          {'\n\n'}
          <Ck>export function</Ck> <Cf>computeImpact</Cf>(items: <Ck>readonly</Ck> StockItem[], today: IsoDate): Impact {'{'}
          {'\n  '}
          <Ck>const</Ck> unique = <Ck>new</Ck> <Cf>Map</Cf>(items.<Cf>map</Cf>((it) =&gt; [it.id, it]));{'\n  '}
          <Ck>let</Ck> kg = <Cn>0</Cn>;{'\n  '}
          <Ck>for</Ck> (<Ck>const</Ck> it <Ck>of</Ck> unique.<Cf>values</Cf>()) {'{'}
          {'\n    '}
          <Ck>const</Ck> factor = KG_FACTOR[it.unit];{'\n    '}
          <Ck>if</Ck> (factor === <Ck>null</Ck> || !<Cf>isSaved</Cf>(it, today)) <Ck>continue</Ck>; <Cc>{'// règle dans dates.ts'}</Cc>
          {'\n    '}kg += it.quantity * factor;{'\n  }\n  '}
          <Ck>return</Ck> {'{'} kg: <Cf>round2</Cf>(kg), euros: <Cf>round2</Cf>(kg * EURO_PER_KG) {'}'};{'\n}'}
        </CodeDark>
      ) : (
        <CodeDark key="before" file="src/domain/impact.ts — généré par IA" size={21} cls={A.fade} style={{ position: 'absolute', left: 120, top: 330, width: 1160 }}>
          <Ck>export function</Ck> <Cf>computeImpact</Cf>(items: <Cx>any[]</Cx>) {'{'}
          {'\n  '}
          <Ck>let</Ck> kg = <Cn>0</Cn>, euros = <Cn>0</Cn>;{'\n  '}
          <Ck>for</Ck> (<Ck>let</Ck> i = <Cn>0</Cn>; i {'<'} items.length; i++) {'{'}
          {'\n    '}
          <Cx>
            <Ck>for</Ck> (<Ck>let</Ck> j = <Cn>0</Cn>; j {'<'} items.length; j++)
          </Cx>
          {'\n      '}
          <Ck>if</Ck> (i != j && items[i].id == items[j].id) <Cx>items.splice(j, 1)</Cx>;{'\n    '}
          <Ck>const</Ck> it = items[i];{'\n    '}
          <Ck>if</Ck> (it.status == <Cs>'consommé'</Cs> && <Cx>new Date(it.expiresOn) {'>='} new Date()</Cx>) {'{'}
          {'\n      '}kg += <Cx>it.unit == <Cs>'g'</Cs> ? it.quantity / <Cn>1000</Cn> : it.quantity</Cx>;{'\n      '}euros += it.quantity * <Cx>
            <Cn>0.0035</Cn>
          </Cx>;{'\n    }\n  }\n  '}
          <Ck>return</Ck> {'{'} kg: Math.<Cf>round</Cf>(kg * <Cn>100</Cn>) / <Cn>100</Cn>, euros: <Cx>euros.toFixed(2)</Cx> {'}'};{'\n}'}
        </CodeDark>
      )}
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 330, width: 470, display: 'flex', flexDirection: 'column', gap: 12, ...dl(200) }}>
        <Eyebrow c={after ? T.green.fg : T.coral.fg} size={20}>
          {after ? 'Ce qui a changé' : 'À trouver (soulignés)'}
        </Eyebrow>
        {after ? (
          <>
            <Bullet tone="green" size={21}>Types stricts, entrée non modifiée (readonly)</Bullet>
            <Bullet tone="green" size={21}>Doublons en O(n) avec une Map</Bullet>
            <Bullet tone="green" size={21}>« Aujourd’hui » en paramètre : testable, sans fuseau</Bullet>
            <Bullet tone="green" size={21}>Toutes les unités gérées, pièce exclue</Bullet>
            <Bullet tone="green" size={21}>Constantes nommées et documentées</Bullet>
            <Bullet tone="green" size={21}>Types de retour cohérents (nombres)</Bullet>
          </>
        ) : (
          <>
            <Bullet tone="coral" size={21}>any : aucune vérification de type</Bullet>
            <Bullet tone="coral" size={21}>Double boucle O(n²) et splice pendant l’itération</Bullet>
            <Bullet tone="coral" size={21}>new Date() : non testable, piège de fuseau</Bullet>
            <Bullet tone="coral" size={21}>Unités ml, L, pièce comptées en kg</Bullet>
            <Bullet tone="coral" size={21}>Nombre magique 0.0035, appliqué à toute unité</Bullet>
            <Bullet tone="coral" size={21}>euros en texte, kg en nombre</Bullet>
          </>
        )}
      </div>
    </Frame>
  );
};

// ─── QCM M6 ─────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <QcmPage
    mod={6}
    n={5}
    title="Le feature-lead"
    q="Pourquoi le feature-lead décide-t-il à partir des comptes rendus de ses spécialistes plutôt qu’en relisant leurs diffs ?"
    explain="Chaque sous-agent travaille dans son propre contexte et ne renvoie qu’un compte rendu de 5 lignes : le lead garde un contexte compact sur toute la feature. La relecture des diffs reste le rôle de l’humain."
  >
    <Opt why="Piège ! Il sait lire du code ; c’est un choix d’architecture, pas une incapacité.">Parce qu’un agent ne sait pas lire un diff</Opt>
    <Opt ok why="Oui : des centaines de lignes lues par les spécialistes n’entrent jamais dans son contexte. Il reste précis et économique.">
      Pour garder son contexte compact et ses décisions fiables
    </Opt>
    <Opt why="Non : les diffs ne sont pas confidentiels entre agents du même dépôt.">Parce que les diffs sont confidentiels</Opt>
    <Opt why="Piège ! Personne ne relirait les diffs : c’est justement le rôle de l’humain à la revue.">Pour que plus personne n’ait à relire les diffs</Opt>
  </QcmPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M6_Divider,
  M6_Pyramid,
  M6_Pair,
  M6_StaticDyn,
  M6_MultiEnv,
  M6_Team,
  M6_Lab61,
  M6_Lab62,
  M6_Lab63,
  M6_Hooks,
  M6_Lab81,
  M6_Lab82,
  M6_Maintain,
  M6_Lab72,
  M6_Lab73,
  M6_Retro,
  M6_AtelierBrief,
  M6_AtelierCode,
  M6_Qcm,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M6 · 14:00

OBJECTIF — Annoncer le module 6 du programme : méthodes d’évaluation (pair programming humain–IA, analyses statique et dynamique, tests multi-environnements), optimisation et maintenabilité, rétro-ingénierie des prompts, atelier en binômes.

DIRE — « Module 6 : évaluer et fiabiliser le code. C’est le module le plus long et le plus dense. On commence par les méthodes d’évaluation. Puis on construit dans FrigoMalin une équipe d’agents qui se contrôlent mutuellement, avec des garde-fous déterministes : hooks et tests. On parlera optimisation, du code et de la facture, puis de rétro-ingénierie : transformer un mauvais résultat en meilleur prompt. Et on finira par l’atelier du programme en binômes : améliorer un code produit par IA. »

ANIMATION — Annoncer le rythme : pause vers 15:30.

TRANSITION — « D’abord, une vue d’ensemble : la pyramide de vérification. »`,
  `⏱ 3 min · PYRAMIDE (4 temps)

OBJECTIF — Structurer les méthodes d’évaluation par coût et fréquence.

DIRE — « En bas, le moins cher et le plus fréquent : le typage strict, le lint, le formatage. À chaque édition, en secondes, ça attrape les API inventées et les erreurs de types. » → clic. « Les tests unitaires, à chaque lot, tests d’abord. » → clic. « L’analyse statique de sécurité et des dépendances : injections, XSS, paquets vulnérables ou inventés. » → clic. « Les tests de bout en bout, dans plusieurs environnements. » → clic. « Et au sommet, la revue humaine : la plus chère et la plus précieuse, parce qu’elle seule répond à la question : est-ce le bon code ? Le principe : chaque étage attrape ce que l’autre rate, et on automatise tout ce qui peut l’être pour que l’humain se concentre sur l’intention. »

ANIMATION — La pyramide se construit de bas en haut.

TRANSITION — « Commençons par la méthode la plus humaine : le pair programming avec l’IA. »`,
  `⏱ 3 min · PAIR PROGRAMMING

OBJECTIF — Présenter trois formations de pair programming humain–IA (programme M6).

DIRE — « Le pair programming classique : un pilote au clavier, un navigateur qui garde le cap. Avec l’IA, trois formations. L’IA pilote, vous naviguez : l’agent écrit par lots, vous validez le plan et relisez les diffs ; idéal pour du code nouveau bien spécifié. Vous pilotez, l’IA navigue : vous codez, l’IA en mode Ask challenge vos choix, signale les cas oubliés, propose des tests ; idéal pour le code critique ou quand vous apprenez. Et le ping-pong TDD : vous écrivez un test, l’IA le fait passer, puis l’inverse. Changez souvent de formation. Et n’oubliez pas le binôme humain : deux personnes qui relisent un prompt et un diff, c’est ce qu’on fait depuis hier. »

ANIMATION — Demander quelle formation chacun utilise spontanément ; souvent, la première uniquement.

TRANSITION — « Deuxième méthode du programme : les analyses statique et dynamique. »`,
  `⏱ 4 min · STATIQUE / DYNAMIQUE (1 temps)

OBJECTIF — Situer les outils d’analyse statique et dynamique et le rôle de l’IA.

DIRE — « Analyse statique : on lit le code sans l’exécuter. Typage strict et ESLint ; SonarQube pour la qualité et la dette ; CodeQL ou Semgrep pour la sécurité ; npm audit, Dependabot et le secret scanning pour les dépendances et les secrets. » → clic. « Analyse dynamique : on exécute. Tests unitaires avec Vitest, et le mutation testing pour vérifier que vos tests détectent vraiment les erreurs ; Playwright pour les parcours ; OWASP ZAP ou du fuzzing pour la sécurité ; Lighthouse et axe pour la performance et l’accessibilité. L’IA s’insère dans la boucle : elle explique un avertissement, propose un correctif, comme Copilot Autofix. Mais c’est l’outil qui dit si c’est corrigé : on relance l’analyse. »

ANIMATION — Demander quels outils sont déjà en CI chez eux.

TRANSITION — « Troisième méthode : les tests multi-environnements. »`,
  `⏱ 4 min · EXERCICE INTERACTIF · MATRICE

OBJECTIF — Concevoir une stratégie de tests multi-environnements réaliste (programme M6).

DIRE — « Une application web tourne sur plusieurs navigateurs, plusieurs tailles d’écran, en ligne et hors ligne, dans plusieurs fuseaux horaires. Activez les dimensions. » Activer tout : « 24 combinaisons, 72 exécutions, environ 24 minutes de CI à chaque PR. Trop. » Revenir à mobile + hors ligne + Paris + UTC. « La stratégie : à chaque PR, la combinaison la plus risquée — pour FrigoMalin, mobile et hors ligne ; chaque nuit, toute la matrice. Et testez en UTC : c’est là qu’apparaissent les bugs de dates, comme le produit qui “expire” deux heures trop tôt. Playwright permet de déclarer ces combinaisons comme des projets. »

ANIMATION — Laisser un participant composer sa matrice pour son propre projet.

TRANSITION — « Ces méthodes, on va les confier en partie à une équipe d’agents. Sprint 6. »`,
  `⏱ 4 min · SPRINT 6 · ÉQUIPE (5 temps)

OBJECTIF — Présenter l’architecture lead + spécialistes et le compte rendu commun.

DIRE — « On passe d’un assistant généraliste à une équipe. Le feature-lead planifie, délègue, décide et rapporte ; il n’écrit jamais de code. » → clic. « Le developer réalise une tâche, sans élargir le périmètre. » → clic. « Le tester écrit et lance les tests, et ne touche à rien d’autre. » → clic. « Le refactorer simplifie à comportement constant, seulement quand les tests sont verts. » → clic. « Le security-reviewer audite et signale, mais ne corrige pas : il n’a que des outils de lecture. » → clic. « Tous terminent par le même compte rendu de cinq lignes : statut, fichiers, tests, points ouverts, recommandation. Le lead décide sur ce contrat, sans relire les diffs : chaque sous-agent a son propre contexte, le lead reste compact. Et celui qui audite ne corrige pas : séparation des rôles. »

ANIMATION — Les flèches se dessinent une à une.

TRANSITION — « Lab 6.1 : créer les spécialistes. »`,
  `⏱ 20 min (minuteur) · LAB 6.1

OBJECTIF — Concevoir puis créer 4 agents spécialisés aux droits limités.

DIRE — « Conception d’abord : remplissez le tableau et le format du compte rendu, faites-les valider par votre binôme, puis écrivez les quatre fichiers. Testez chaque agent seul sur une petite tâche. »

CORRIGÉ (formateur) — developer : réalise une tâche ; read, search, edit, execute ; modèle économique ; jamais changer le périmètre. tester : read, search, edit, execute ; jamais modifier hors *.test.*. refactorer : préalable npm test (KO → stop) ; jamais modifier un test ni le comportement. security-reviewer : read, search uniquement ; modèle de raisonnement ; checklist FrigoMalin (innerHTML sur données externes, import JSON validé, aucun secret, CSP intacte, dépendances auditées) ; tableau gravité/fichier/risque/correctif ; Statut BLOQUÉ dès un point bloquant ; jamais corriger lui-même. Compte rendu : Statut OK|KO|BLOQUÉ, Fichiers, Tests, Points ouverts, Recommandation.

ANIMATION — Vérifier que le security-reviewer refuse de modifier un fichier.

TRANSITION — « Les spécialistes existent. Il leur faut un chef. »`,
  `⏱ 15 min (minuteur) · LAB 6.2

OBJECTIF — Écrire un lead qui délègue et décide selon des règles explicites.

DIRE — « Le point d’attention : pour chaque statut, que décide le lead ? Et quand vous rend-il la main ? »

CORRIGÉ (formateur) — tools: read, search, todo, agent, edit ; agents: developer, tester, refactorer, security-reviewer ; modèle de raisonnement. 1) Planifier en tâches de 30 min max, présenter le plan, attendre la validation. 2) Déléguer dans l’ordre developer → tester → refactorer → security-reviewer, en transmettant la tâche seule. 3) OK : agent suivant ; KO : retour au developer avec le compte rendu du tester, pas de refactoring sur tests rouges ; BLOQUÉ : retour au developer avec les seuls points bloquants, puis re-tester et re-auditer ; 2 échecs sur la même tâche : s’arrêter et demander. 4) Rapport docs/reports/<feature>.md. Jamais : écrire hors docs/reports/, changer le périmètre, ignorer un point bloquant. Option : handoffs avec send: false pour valider chaque relais.

TRANSITION — « Lançons l’équipe sur une vraie feature. »`,
  `⏱ 20 min (minuteur) · LAB 6.3

OBJECTIF — Orchestrer une feature de bout en bout et analyser les décisions du lead.

DIRE — « Le prompt au lead dit QUOI et QUAND c’est fini ; le COMMENT est dans l’agent. Si vous redictez les étapes, c’est que votre lead est mal écrit. Validez le plan avant toute délégation, puis lisez le rapport. »

CORRIGÉ (formateur) — Feature : PWA installable et hors ligne. Périmètre : manifeste, service worker qui met l’application en cache, icônes 192 et 512 px, bannière « Vous êtes hors ligne ». Hors périmètre : synchronisation, notifications push. Contraintes : principes de copilot-instructions.md, JS initial < 200 Ko gzip, repli Open Food Facts. Fin : npm test et build passent, installable, se recharge hors ligne. Piège classique : le service worker ignore le chemin /frigomalin/ de GitHub Pages. Si l’équipe ne l’a pas vu, l’humain doit le voir.

ANIMATION — Pendant que les agents tournent, faire observer les sous-agents dans la vue Chat. Bonus 6.4 : qa-explorer via MCP Playwright.

TRANSITION — « Nos agents vont vite. Les garde-fous garantissent qu’ils vont dans la bonne direction. »`,
  `⏱ 3 min · HOOKS (1 temps) · ~15:15

OBJECTIF — Distinguer consigne probabiliste et hook déterministe.

DIRE — « “Pense à lancer le lint” : c’est une consigne. Le modèle la suit la plupart du temps, mais il peut l’oublier, surtout quand le contexte est chargé. Un hook, c’est une commande exécutée par l’outil à un moment précis, quoi que pense le modèle. » → clic. « Deux usages. Avant un outil : bloquer une commande dangereuse, comme rm -rf ou un push forcé, ou une écriture hors du dossier autorisé — par exemple, vérifier que le feature-lead n’écrit que dans docs/reports. Après un outil : formater, linter, lancer les tests ciblés, et renvoyer les erreurs au modèle. Règle d’or : un hook rapide et bien choisi. Dix hooks lents ralentissent chaque édition. »

ANIMATION — Relier à l’incident Replit : un gel exprimé en consigne n’est pas un contrôle.

TRANSITION — « Lab 8.1 : votre premier hook. »`,
  `⏱ 10 min (minuteur) · LAB 8.1 · puis pause 15:30

OBJECTIF — Créer un hook postToolUse multiplateforme.

DIRE — « Complétez le fichier, puis demandez à l’agent une modification volontairement mal formatée : le hook doit corriger sans que vous le demandiez. »

CORRIGÉ (formateur) — version: 1 ; hooks.postToolUse : type command, matcher "edit|create", bash "npm run lint:fix --silent && npx prettier --write src --log-level warn", powershell "npm run lint:fix --silent; npx prettier --write src --log-level warn", timeoutSec 60. Le nom exact de l’outil d’édition dépend de la version : le vérifier dans les journaux de debug avant d’écrire le matcher. Pour renvoyer les erreurs restantes au modèle, le hook peut écrire un JSON avec additionalContext sur sa sortie standard.

ANIMATION — Lancer le minuteur. Annoncer la pause de 15 minutes à la fin du lab.

TRANSITION — « Pause ! À la reprise : les tests par l’agent tester. »`,
  `⏱ 15 min (minuteur) · LAB 8.2 · 15:45

OBJECTIF — Faire écrire des tests stables, unitaires et E2E.

DIRE — « Reprise. Prompt à trous pour l’agent tester. Le cœur du sujet : rendre les tests stables. »

CORRIGÉ (formateur) — Fichiers : #src/domain/dates.ts et #src/domain/expiry.ts. Cas limites : ajout à 23 h 59 et consultation à 0 h 01, changements d’heure de mars et d’octobre, Europe/Paris contre UTC, 29 février, DDM dépassée contre DLC dépassée. 3 parcours Playwright : ajouter un produit puis le retrouver trié ; marquer consommé puis voir l’impact mis à jour ; passer hors ligne puis recharger sans perte ; en 360×800 et 1280×800. Règles : date figée (vi.setSystemTime, page.clock), sélecteurs getByRole / getByLabel, aucune attente fixe (waitForTimeout interdit), base IndexedDB vidée avant chaque test. Fin : npm test et npm run test:e2e, résumé en 3 lignes.

ANIMATION — Les sélecteurs par rôle testent aussi l’accessibilité. Bonus 8.3 : revue de PR par Copilot avec vos critères.

TRANSITION — « Les tests protègent le comportement. Parlons de la qualité dans la durée. »`,
  `⏱ 3 min · MAINTENABILITÉ

OBJECTIF — Identifier la dette typique du code généré et ses réponses (programme : optimisation et maintenabilité).

DIRE — « L’IA écrit plus de code, plus vite… et la dette aussi. Les analyses de GitClear sur des millions de lignes observent depuis 2024 plus de code dupliqué et moins de refactoring. Cinq symptômes. Le code dupliqué : on répond par une instruction “réutilise src/domain” et une détection de duplication en CI. Les fonctions longues : des seuils de complexité dans le lint, et l’agent refactorer. La dépendance ajoutée pour trois lignes : une règle “pas de dépendance sans le signaler” et un budget de bundle. La performance ignorée : exiger la complexité attendue et mesurer. Le nommage générique : le glossaire de PRODUCT.md. Le critère ultime : dans six mois, quelqu’un devra modifier ce code. Sinon, l’accélération d’aujourd’hui est un emprunt. »

ANIMATION — Demander quel symptôme ils voient le plus en revue.

TRANSITION — « Optimisation, toujours, mais côté facture : deux QCM rapides. »`,
  `⏱ 5 min · LAB 7.2 (QCM)

OBJECTIF — Réflexes pour garder le contexte petit.

RÉPONSES — 1 : nouvelle session, une tâche = une session. 2 : 2 ou 3 fichiers nommés avec #. 3 : règle de test concise dans tests.instructions.md ; les sorties d’outils sont le premier poste de tokens. 4 : skill réduit aux lignes utiles. 5 : /compact au bon moment, avant le compactage automatique. 6 : /fork pour explorer une variante.

DIRE — « Six situations, votez, cliquez. La technique la plus rentable, c’est presque toujours : une tâche, une session. Et pour constater l’effet, la Chat Debug View vue ce matin. »

ANIMATION — Rythme rapide ; le compteur « du premier coup » motive le groupe.

TRANSITION — « Et maintenant, la facture. »`,
  `⏱ 5 min · LAB 7.3 (QCM)

OBJECTIF — Réduire le coût sans perdre en qualité.

RÉPONSES — 1 : raisonnement pour planifier, économique ou Auto pour exécuter ; l’agent fige ce choix par rôle. 2 : désactiver les outils inutiles (Configure Tools). 3 : faire écrire un script, puis l’exécuter. 4 : modifier les instructions ou changer de modèle en cours de session casse le cache de prompt. 5 : comparer le coût de tâches réussies, pas le prix au token. 6 : survol du pied de réponse, et sélecteur de modèles.

DIRE — « Depuis juin, Copilot facture les tokens. Les plus gros gains viennent du bon modèle pour le bon rôle, et du script plutôt que la boucle dans le chat. Et on compare toujours à qualité égale : mêmes tests au vert. »

TRANSITION — « Dernière méthode du programme : la rétro-ingénierie des prompts. »`,
  `⏱ 4 min · RÉTRO-INGÉNIERIE (4 temps)

OBJECTIF — Transformer un mauvais résultat en meilleur prompt, puis en règle durable (programme M6).

DIRE — « Un résultat décevant n’est pas un échec, c’est un diagnostic. L’agent a modifié douze fichiers pour un filtre ? Il manquait une tâche bornée. Correctif durable : “uniquement…”, des lots, et une règle dans les instructions. » → clic. « Il a utilisé localStorage ? L’ADR n’était pas dans le contexte. » → clic. « Ses tests passent sur du code faux ? Les tests ont été écrits après le code : TDD. » → clic. « Il a codé les couleurs en dur ? Une convention non écrite : le skill et son script de vérification. » → clic. « Il tourne en boucle ? Pas de critère de fin : une commande de fin et une limite d’échecs. La règle : une correction répétée deux fois devient une instruction, un skill ou un hook. Votre configuration apprend. »

ANIMATION — Demander un exemple vécu dans les labs et le classer dans le tableau.

TRANSITION — « Mettons tout ça en pratique : l’atelier en binômes. »`,
  `⏱ 2 min · ATELIER BINÔMES · CONSIGNES (programme : améliorer un code produit par IA)

OBJECTIF — Lancer l’atelier en binômes.

DIRE — « En binômes, un pilote et un navigateur, on échange à mi-parcours. Cinq étapes. Caractériser : des tests qui figent le comportement actuel, même les bugs, pour ne rien casser sans le savoir. Analyser : lint strict, types, SAST. Refactorer avec l’IA, à petits pas, tests au vert. Rétro-prompt : le prompt qui aurait produit la bonne version du premier coup. Capitaliser : une règle pour vos instructions, un skill ou votre checklist de revue. »

ANIMATION — Former les binômes en mélangeant les niveaux (auto-positionnement d’hier). Lancer le minuteur de 30 minutes (à réduire à 20 si le planning a glissé).

TRANSITION — « Voici le code à améliorer. »`,
  `⏱ 25 min (atelier) + 5 min de restitution · ATELIER · CODE

OBJECTIF — Améliorer un code généré, de façon outillée et testée.

DIRE — « La fonction qui calcule les kilos et les euros sauvés. Elle marche sur l’exemple de la démo. Cherchez les problèmes, puis appliquez les cinq étapes. »

RÉPONSES — any ; double boucle O(n²) et splice pendant l’itération (des éléments sautés, et l’entrée de l’appelant modifiée) ; new Date() dans le domaine : non testable, et new Date('2026-10-11') est minuit UTC, donc 2 h à Paris : un produit consommé le jour de sa DLC n’est pas compté ; ml, L et pièce comptés comme des kg (4 yaourts = 4 kg !) ; 0.0035 nombre magique appliqué à toute unité ; euros renvoyé en texte. En restitution, cliquer « Après » : Map, today en paramètre, table de facteurs, constantes nommées, round2.

PROMPT ATTENDU — rôle ; #src/domain/types.ts, #src/domain/dates.ts ; « fonction pure, today en paramètre, aucune mutation, toutes les unités, pièce exclue, constantes nommées, tests d’abord avec cas limites de fuseau ».

TRANSITION — « Dernier QCM de l’après-midi. »`,
  `⏱ 2 min · QCM 5 · ~16:50

OBJECTIF — Vérifier la compréhension de l’orchestration.

RÉPONSES — A ✗ piège : c’est un choix d’architecture. B ✓ contexte compact et décisions fiables. C ✗ rien de confidentiel. D ✗ piège : la relecture des diffs reste le rôle de l’humain, à la revue de PR.

DIRE — « C’est la clé de toute orchestration : des agents qui travaillent dans leur propre contexte et ne remontent que l’essentiel. Et un humain qui garde la décision. »

TRANSITION — « Il est temps de mettre FrigoMalin en ligne et de faire la synthèse : module 7. »`,
];
// @@NOTES-END
