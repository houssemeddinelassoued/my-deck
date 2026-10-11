// ─── Module 5 · Cybersécurité & IA ──────────────────────────────────────────

const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Cybersécurité
        <br />
        et IA générative
      </>
    }
    sub="Les principaux risques, les bonnes pratiques et le cadre normatif. Puis l’analyse d’incidents réels."
    dur="11:15 – 12:30 · atelier inclus"
    kind="atelier"
    labs={
      <>
        <Tag tone="blue" size={19}>Démo · Lab 7.1</Tag>
        <Tag tone="yellow" size={19}>Analyse d’incidents</Tag>
      </>
    }
  >
    <SecItem n={1}>Fuite de données, code malveillant, dépendance</SecItem>
    <SecItem n={2}>Secrets, données envoyées, droits des agents</SecItem>
    <SecItem n={3}>Journalisation et traçabilité</SecItem>
    <SecItem n={4}>RGPD, AI Act, CRA et directives internes</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Carte des risques ──────────────────────────────────────────────────────
const M5Risk = ({ icon, tone, title, ex, mit, beat }: { icon: IconName; tone: Tone; title: string; ex: ReactNode; mit: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `8px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <IconTile name={icon} tone={tone} size={64} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 26, lineHeight: 1.42, color: C.soft }}>{ex}</div>
    <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `1.5px solid ${C.rule}`, fontSize: 24, lineHeight: 1.4, color: T.green.fg }}>
      <strong>Parade · </strong>
      {mit}
    </div>
  </div>
);

const M5_Risks: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Les principaux risques pour une équipe de développement</Title>
    <Lede>Les trois risques du programme… et un quatrième, apparu avec les agents qui agissent seuls.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 640, display: 'flex', gap: 22 }}>
      <M5Risk icon="eye" tone="coral" title="Fuite de données" ex="Code, secrets ou données personnelles envoyés dans un prompt, lus par un agent, ou exfiltrés par injection." mit="offre entreprise, exclusions, aucune donnée réelle." beat={0} />
      <M5Risk icon="bug" tone="violet" title="Code malveillant" ex="Paquet inventé ou piégé, extension compromise, faille introduite dans le code généré." mit="vérification des dépendances, SAST, revue." beat={1} />
      <M5Risk icon="cloud" tone="yellow" title="Dépendance aux services" ex="Panne, changement de prix (juin 2026), modèle retiré, enfermement chez un fournisseur." mit="formats ouverts (AGENTS.md, MCP), tests, plan B local." beat={2} />
      <M5Risk icon="bot" tone="pink" title="Agentivité excessive" ex="Un agent qui exécute, supprime ou publie avec trop de droits et trop peu de contrôles." mit="moindre privilège, approbations, conteneur." beat={3} />
    </div>
  </Frame>
);

// ─── OWASP Top 10 LLM 2025 ──────────────────────────────────────────────────
const M5Owasp = ({ code, name, dev, hot }: { code: string; name: string; dev: string; hot?: boolean }) => (
  <FlipCard
    w={316}
    h={262}
    tone={hot ? 'coral' : 'grey'}
    backTone={hot ? 'coral' : 'grey'}
    front={
      <>
        <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: hot ? C.coral : C.muted }}>{code}</div>
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: C.ink }}>{name}</div>
        {hot ? (
          <div style={{ marginTop: 10 }}>
            <Tag tone="coral" size={16}>
              Clé pour les devs
            </Tag>
          </div>
        ) : null}
      </>
    }
    back={
      <>
        <Eyebrow c={hot ? T.coral.fg : C.muted} size={17}>
          {code} · en développement
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.42, color: C.ink }}>{dev}</div>
      </>
    }
  />
);

const M5_Owasp: Page = () => (
  <Frame mod={5}>
    <Title>OWASP Top 10 pour les applications LLM (2025)</Title>
    <Lede>La référence pour nommer les risques. Six touchent directement les agents de code : cliquez une carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 316px)', gap: 25, rowGap: 26 }}>
      <M5Owasp hot code="LLM01" name="Injection de prompt" dev="Une issue, un README ou une page web contient des consignes cachées que l’agent exécute." />
      <M5Owasp hot code="LLM02" name="Divulgation d’informations sensibles" dev="L’agent lit un .env et le recopie dans un log, une PR ou une réponse." />
      <M5Owasp hot code="LLM03" name="Chaîne d’approvisionnement" dev="Paquet inventé ou piégé, extension, serveur MCP ou modèle compromis." />
      <M5Owasp code="LLM04" name="Empoisonnement des données et du modèle" dev="Données d’entraînement ou de RAG manipulées pour biaiser les réponses." />
      <M5Owasp hot code="LLM05" name="Traitement de sortie inadéquat" dev="Sortie du modèle injectée telle quelle dans du HTML, du SQL ou un shell." />
      <M5Owasp hot code="LLM06" name="Agentivité excessive" dev="Agent avec droits de production, commandes approuvées automatiquement." />
      <M5Owasp code="LLM07" name="Fuite du prompt système" dev="Des règles internes ou des secrets placés dans un prompt système… et révélés." />
      <M5Owasp code="LLM08" name="Faiblesses des vecteurs et embeddings" dev="Une base RAG qui mélange les documents de clients différents." />
      <M5Owasp code="LLM09" name="Désinformation" dev="API inventée, chiffre faux, norme citée à tort : présentés avec aplomb." />
      <M5Owasp hot code="LLM10" name="Consommation non bornée" dev="Boucle d’agent sans limite : crédits brûlés, quotas épuisés, facture." />
    </div>
  </Frame>
);

// ─── Secrets ────────────────────────────────────────────────────────────────
const M5_Secrets: Page = () => (
  <Frame mod={5} kind="actu">
    <Title>Protéger les clés d’API : les chiffres 2026</Title>
    <Lede>GitGuardian, State of Secrets Sprawl 2026 : les fuites de secrets accélèrent avec le code assisté par IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <Stat cls={A.in} style={{ flex: 1 }} size={86} tone="coral" value={<CountUp to={29} suffix=" M" />} label="secrets codés en dur exposés sur GitHub public en 2025 (+34 % en un an)" />
      <Stat cls={A.in} style={{ flex: 1, ...dl(150) }} size={86} tone="violet" value={<CountUp to={81} prefix="+" suffix=" %" />} label="de fuites de clés de services IA (1,27 million en 2025)" />
      <Stat cls={A.in} style={{ flex: 1, ...dl(300) }} size={86} tone="yellow" value={<CountUp to={32} suffix=" %" />} label="des dépôts internes contiennent au moins un secret (5,6 % des dépôts publics)" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 540, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(500) }}>
      <Eyebrow c={T.green.fg}>Six pratiques, du plus simple au plus robuste</Eyebrow>
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 44px' }}>
        <Bullet tone="green" size={26}>Aucun secret dans le code ni dans un prompt : variables d’environnement</Bullet>
        <Bullet tone="green" size={26}>.env dans .gitignore, scanner de secrets avant commit (pre-commit)</Bullet>
        <Bullet tone="green" size={26}>Protection au push du dépôt (secret scanning) activée</Bullet>
        <Bullet tone="green" size={26}>Coffre-fort de secrets, droits minimaux, une clé par usage</Bullet>
        <Bullet tone="green" size={26}>Jetons courts en CI (OIDC) plutôt que des clés permanentes</Bullet>
        <Bullet tone="green" size={26}>Fuite = rotation immédiate, puis nettoyage de l’historique</Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Ce qui quitte votre poste ──────────────────────────────────────────────
const M5Src = ({ icon, children, d }: { icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: SHADOW_SM, fontSize: 22, color: C.ink, ...dl(d) }}>
    <Icon name={icon} size={26} color={C.blue} />
    {children}
  </div>
);

const M5_DataFlow: Page = () => (
  <Frame mod={5} beats={1}>
    <Title>Maîtriser les données envoyées : ce qui quitte votre poste</Title>
    <Lede>Le prompt n’est que la partie visible. Un agent envoie aussi tout ce qu’il lit et tout ce que ses outils renvoient.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 560, background: T.blue.bg, borderRadius: 22, padding: '22px 24px', boxShadow: `inset 0 0 0 2.5px ${T.blue.bd}` }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T.blue.fg, marginBottom: 14 }}>Votre poste · VS Code</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M5Src icon="chat" d={100}>Votre prompt</M5Src>
        <M5Src icon="doc" d={180}>Fichiers joints avec #</M5Src>
        <M5Src icon="search" d={260}>Fichiers que l’agent lit de lui-même</M5Src>
        <M5Src icon="terminal" d={340}>Sorties de commandes (tests, logs…)</M5Src>
        <M5Src icon="plug" d={420}>Réponses des serveurs MCP</M5Src>
        <M5Src icon="code" d={500}>Onglets ouverts (complétion)</M5Src>
      </div>
    </div>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 690 560 L 860 560" stroke={C.faint} strokeWidth={5} strokeDasharray="10 14" className={A.march} />
      <path d="M 1180 560 L 1330 560" stroke={C.faint} strokeWidth={5} strokeDasharray="10 14" className={A.march} />
      <FlowDot path="M 690 560 L 1330 560" dur={2.6} color={C.coral} r={9} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 870, top: 450, width: 300, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', textAlign: 'center', ...dl(400) }}>
      <IconTile name="git" tone="navy" size={58} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink }}>Service de l’outil</div>
      <div style={{ fontSize: 19, color: C.muted }}>GitHub, éditeur, proxy</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1340, top: 450, width: 300, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', textAlign: 'center', ...dl(600) }}>
      <IconTile name="brain" tone="violet" size={58} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink }}>Fournisseur du modèle</div>
      <div style={{ fontSize: 19, color: C.muted }}>selon le modèle choisi</div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 720, top: 680, width: 1080, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Callout title="Leviers de maîtrise" tone="green" icon="shieldCheck" size={22}>
        Offre entreprise avec engagements contractuels · modèles autorisés par l’organisation · exclusions et .copilotignore · outils MCP limités ·
        données fictives · modèle local pour le code le plus sensible.
      </Callout>
      <div style={{ fontSize: 21, color: C.muted }}>Le choix du modèle dans le sélecteur détermine aussi qui traite la requête : c’est une décision de sécurité, pas seulement de qualité.</div>
    </div>
  </Frame>
);

// ─── Configurateur de droits de l'agent ─────────────────────────────────────
const M5_KNOBS = [
  { id: 'yolo', label: 'Approbation automatique de toutes les commandes', w: 30 },
  { id: 'net', label: 'Accès réseau sans restriction', w: 12 },
  { id: 'env', label: 'Secrets présents dans l’environnement de l’agent', w: 22 },
  { id: 'mcp', label: 'Serveurs MCP non vérifiés, tous outils actifs', w: 14 },
  { id: 'main', label: 'Droit de pousser directement sur main', w: 14 },
  { id: 'box', label: 'Agent isolé dans un conteneur (devcontainer)', w: -18 },
  { id: 'allow', label: 'Liste de commandes autorisées, le reste sur validation', w: -16 },
];

const M5Knob = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const k2 = M5_KNOBS[i];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
      <Toggle on={on} onChange={flip} tone={k2.w > 0 ? 'coral' : 'green'} size={24} label={k2.label} />
      <span style={{ fontFamily: mono, fontSize: 19, color: k2.w > 0 ? T.coral.fg : T.green.fg }}>
        {k2.w > 0 ? '+' : '−'}
        {Math.abs(k2.w)}
      </span>
    </div>
  );
};

const M5_Agency: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({ yolo: true, net: true, env: true, mcp: false, main: false, box: false, allow: false });
  const flip = (id: string) => setOn((o) => ({ ...o, [id]: !o[id] }));
  const raw = M5_KNOBS.reduce((a, k2) => a + (on[k2.id] ? k2.w : 0), 10);
  const risk = Math.max(0, Math.min(100, raw));
  const lv = risk >= 60 ? { t: 'Critique : un seul contenu piégé suffit.', tone: 'coral' as Tone } : risk >= 30 ? { t: 'Élevé : réduisez les droits.', tone: 'yellow' as Tone } : { t: 'Maîtrisé : moindre privilège appliqué.', tone: 'green' as Tone };
  return (
    <Frame mod={5} kind="exercice">
      <Title>Agentivité excessive : configurez votre agent</Title>
      <Lede>Activez ou non chaque réglage et observez le risque. Départ : une configuration hélas fréquente.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1040, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M5Knob i={0} on={on.yolo} flip={() => flip('yolo')} />
        <M5Knob i={1} on={on.net} flip={() => flip('net')} />
        <M5Knob i={2} on={on.env} flip={() => flip('env')} />
        <M5Knob i={3} on={on.mcp} flip={() => flip('mcp')} />
        <M5Knob i={4} on={on.main} flip={() => flip('main')} />
        <div style={{ height: 1.5, background: C.rule }} />
        <M5Knob i={5} on={on.box} flip={() => flip('box')} />
        <M5Knob i={6} on={on.allow} flip={() => flip('allow')} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1220, top: 262, width: 580, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={19}>
          Niveau de risque
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1, color: STRONG[lv.tone] === C.yellow ? C.amber : STRONG[lv.tone] }}>{risk}</span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.faint }}>/ 100</span>
        </div>
        <div style={{ marginTop: 16, height: 18, borderRadius: 9, background: C.panel, overflow: 'hidden' }}>
          <div style={{ width: `${risk}%`, height: '100%', background: STRONG[lv.tone], transition: `width 450ms ${EASE}` }} />
        </div>
        <div style={{ marginTop: 16, fontSize: 26, fontWeight: 700, color: T[lv.tone].fg }}>{lv.t}</div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1220, top: 600, width: 580, ...dl(300) }}>
        <Callout title="Août 2025 · Nx « s1ngularity »" tone="coral" icon="alert" size={21}>
          Un paquet npm piégé a lancé les agents CLI installés sur les postes (Claude Code, Gemini CLI, Amazon Q) avec leurs options de contournement des
          permissions, pour inventorier et exfiltrer des secrets.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Journalisation ─────────────────────────────────────────────────────────
const M5Log = ({ icon, tone, title, what, tool, d }: { icon: IconName; tone: Tone; title: string; what: string; tool: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 10, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 25, lineHeight: 1.42, color: C.soft }}>{what}</div>
    <div style={{ marginTop: 'auto', fontSize: 23, lineHeight: 1.38, color: T[tone].fg, fontWeight: 600 }}>{tool}</div>
  </div>
);

const M5_Logging: Page = () => (
  <Frame mod={5}>
    <Title>Journalisation : tracer sans fuir</Title>
    <Lede>En cas d’incident, savoir qui a fait quoi, avec quel outil… sans écrire de secret dans les journaux.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 430, display: 'flex', gap: 22 }}>
      <M5Log icon="org" tone="navy" title="L’outil" what="Qui utilise quoi, quels réglages, quelles politiques." tool="Journaux d’audit et métriques d’usage (offres entreprise)" d={100} />
      <M5Log icon="bot" tone="violet" title="L’agent" what="Fichiers lus, commandes lancées, outils appelés, tokens." tool="Chat Debug View, rapports de l’agent (docs/reports)" d={200} />
      <M5Log icon="git" tone="blue" title="Le code" what="Quel changement vient de quelle tâche, relu par qui." tool="Un commit par lot, PR liée à l’issue, mention de l’IA" d={300} />
      <M5Log icon="server" tone="green" title="L’application" what="Ce qui se passe en production, assaini." tool="Journaux sans prompt brut, sans secret, durée de conservation" d={400} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 730, width: 1680, ...dl(600) }}>
      <Callout title="Piège classique" tone="coral" icon="alert" size={24}>
        Journaliser les prompts « pour le debug » : on recopie dans les logs les données personnelles et les secrets qu’on voulait protéger. Masquez,
        tronquez, et appliquez une durée de conservation (RGPD).
      </Callout>
    </div>
  </Frame>
);

// ─── Démo Lab 7.1 : Chat Debug View ─────────────────────────────────────────
const M5Look = ({ n, title, children, beat }: { n: number; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <Num n={n} tone="blue" size={44} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5_DebugView: Page = () => (
  <Frame mod={5} kind="demo" beats={3}>
    <Title>Démo · Lab 7.1 : voir ce que Copilot envoie vraiment</Title>
    <Lede>Menu « … » de la vue Chat → Show Chat Debug View. On ne sécurise que ce que l’on voit.</Lede>
    <CodeDark file="Prompt fourni (nouvelle session, mode Agent)" size={21} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      Ajoute un filtre par emplacement (frigo, congélateur, placard) à l’écran Inventaire.{'\n'}Fichiers : <Cf>#src/ui/Inventory/Inventory.tsx</Cf> et{' '}
      <Cf>#src/domain/stock.ts</Cf>.{'\n'}Règles :{'\n'}- tests Vitest d’abord dans src/domain/stock.test.ts ;{'\n'}- logique de filtre en fonction pure dans src/domain ;
      {'\n'}- ne modifie aucun autre écran ;{'\n'}- termine par npm test, puis résume en 3 lignes.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Look n={1} title="System prompt" beat={0}>
        copilot-instructions.md toujours ; ui, domain et tests seulement si leur applyTo correspond. Un fichier absent = applyTo mal écrit.
      </M5Look>
      <M5Look n={2} title="Context" beat={1}>
        Les deux fichiers joints avec #. Rien d’autre ne devrait y être.
      </M5Look>
      <M5Look n={3} title="Tool responses" beat={2}>
        Les fichiers lus par l’agent de lui-même (un .env ? un export ?) et la sortie de npm test.
      </M5Look>
      <M5Look n={4} title="Tokens (survol du pied de réponse)" beat={3}>
        Entrée, entrée en cache, sortie. Le premier poste vient souvent des sorties d’outils, pas des instructions.
      </M5Look>
    </div>
  </Frame>
);

// ─── RGPD ───────────────────────────────────────────────────────────────────
const M5Gdpr = ({ art, title, children, d }: { art: string; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '20px 24px', display: 'flex', gap: 18, ...dl(d) }}>
    <span style={{ flex: 'none', height: 'fit-content', fontFamily: mono, fontSize: 19, fontWeight: 700, color: T.navy.fg, background: T.navy.bg, borderRadius: 8, padding: '4px 10px' }}>{art}</span>
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5_GDPR: Page = () => (
  <Frame mod={5}>
    <Title>RGPD : ce qui change quand l’IA entre dans le code</Title>
    <Lede>Dès qu’une donnée personnelle peut atteindre un prompt, un journal ou un jeu de test, le RGPD s’applique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <M5Gdpr art="Art. 5" title="Minimisation" d={100}>
        Ne transmettre que le strict nécessaire. Pour coder, des données fictives suffisent presque toujours.
      </M5Gdpr>
      <M5Gdpr art="Art. 28" title="Sous-traitant et contrat (DPA)" d={180}>
        Le fournisseur de l’outil traite des données pour vous : contrat obligatoire, garanties, sous-traitants ultérieurs.
      </M5Gdpr>
      <M5Gdpr art="Chap. V" title="Transferts hors UE" d={260}>
        Où sont traités les prompts ? Quel encadrement (clauses types, Data Privacy Framework) ?
      </M5Gdpr>
      <M5Gdpr art="Art. 35" title="Analyse d’impact (AIPD)" d={340}>
        Obligatoire si le traitement présente un risque élevé : souvent le cas pour un outil IA déployé à grande échelle.
      </M5Gdpr>
      <M5Gdpr art="Art. 25" title="Protection dès la conception" d={420}>
        Le code que vous générez traite des données ? Masquage, chiffrement, durées de conservation dès le premier commit.
      </M5Gdpr>
      <M5Gdpr art="CNIL" title="Recommandations IA" d={500}>
        La CNIL publie des fiches pratiques sur l’IA et le RGPD : une bonne base pour votre charte interne.
      </M5Gdpr>
    </div>
  </Frame>
);

// ─── AI Act + CRA : frise ───────────────────────────────────────────────────
const M5Milestone = ({ x, date, title, sub, tone, beat, up }: { x: number; date: string; title: string; sub: string; tone: Tone; beat: number; up: boolean }) => (
  <div className={beat ? b.on(beat) : A.fade} style={{ position: 'absolute', left: x - 140, top: up ? 270 : 600, width: 280, textAlign: 'center' }}>
    {up ? null : <div style={{ width: 3, height: 30, margin: '0 auto 8px', background: STRONG[tone], opacity: 0.5 }} />}
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: STRONG[tone] }}>{date}</div>
    <div style={{ marginTop: 4, fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 18, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
    {up ? <div style={{ width: 3, height: 30, margin: '8px auto 0', background: STRONG[tone], opacity: 0.5 }} /> : null}
  </div>
);

const M5_AIAct: Page = () => (
  <Frame mod={5} kind="actu" beats={2}>
    <Title>AI Act et Cyber Resilience Act : le calendrier</Title>
    <Lede>Deux règlements européens qui touchent déjà les équipes de développement, même sans « IA à haut risque ».</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <line x1={150} y1={570} x2={1790} y2={570} stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
      <line x1={150} y1={570} x2={1140} y2={570} stroke={C.navy} strokeWidth={8} strokeLinecap="round" className={A.grow} />
      <circle cx={190} cy={570} r={13} fill="#fff" stroke={C.navy} strokeWidth={6} />
      <circle cx={420} cy={570} r={13} fill="#fff" stroke={C.violet} strokeWidth={6} />
      <circle cx={650} cy={570} r={13} fill="#fff" stroke={C.navy} strokeWidth={6} />
      <circle cx={900} cy={570} r={13} fill="#fff" stroke={C.navy} strokeWidth={6} />
      <circle cx={1130} cy={570} r={16} fill={C.coral} stroke="#fff" strokeWidth={5} className={A.pulse} />
      <circle cx={1130} cy={570} r={13} fill={C.coral} stroke="#fff" strokeWidth={4} />
      <circle cx={1400} cy={570} r={13} fill="#fff" stroke={C.faint} strokeWidth={6} className={b.pop(2)} />
      <circle cx={1660} cy={570} r={13} fill="#fff" stroke={C.faint} strokeWidth={6} className={b.pop(2)} />
    </svg>
    <M5Milestone x={190} up date="1er août 2024" title="AI Act en vigueur" sub="application progressive" tone="navy" beat={0} />
    <M5Milestone x={420} up={false} date="2 février 2025" title="Maîtrise de l’IA (art. 4)" sub="former les personnes qui utilisent l’IA · pratiques interdites" tone="violet" beat={0} />
    <M5Milestone x={650} up date="2 août 2025" title="Modèles à usage général" sub="obligations des fournisseurs de modèles" tone="navy" beat={0} />
    <M5Milestone x={900} up={false} date="2 août 2026" title="Transparence (art. 50)" sub="informer qu’on parle à une IA, contenus générés" tone="navy" beat={0} />
    <M5Milestone x={1130} up date="11 sept. 2026" title="CRA : signalement" sub="vulnérabilités exploitées : alerte en 24 h, notification en 72 h" tone="coral" beat={1} />
    <M5Milestone x={1400} up={false} date="2 déc. 2027" title="IA à haut risque" sub="report prévu par l’omnibus numérique (accord de mai 2026)" tone="grey" beat={2} />
    <M5Milestone x={1660} up date="11 déc. 2027" title="CRA : application complète" sub="sécurité dès la conception des produits numériques" tone="grey" beat={2} />
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 820, width: 1680 }}>
      <Callout title="Pour vous, concrètement" tone="violet" icon="book" size={23}>
        Cette formation contribue à l’obligation de <strong>maîtrise de l’IA</strong> (art. 4). Et si vous éditez un logiciel vendu dans l’UE, le CRA s’applique
        au code… y compris au code généré par IA.
      </Callout>
    </div>
  </Frame>
);

// ─── Directives internes : construire la charte ─────────────────────────────
const M5_Charter: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Directives internes : votre charte d’usage de l’IA</Title>
    <Lede>Cochez ce qui existe déjà chez vous. Ce qui manque devient une action de votre plan au module 7.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <CheckItem id="ch1" size={25}>Liste des outils et offres autorisés</CheckItem>
        <CheckItem id="ch2" size={25}>Classification : quelles données peuvent sortir</CheckItem>
        <CheckItem id="ch3" size={25}>Tout code IA relu comme une PR externe</CheckItem>
        <CheckItem id="ch4" size={25}>Mention de l’usage de l’IA dans les PR</CheckItem>
        <CheckItem id="ch5" size={25}>Scanner de secrets et protection au push</CheckItem>
        <CheckItem id="ch6" size={25}>Droits des agents : approbations, pas d’accès prod</CheckItem>
        <CheckItem id="ch7" size={25}>Licences : filtre code public, contrôle en CI</CheckItem>
        <CheckItem id="ch8" size={25}>Formation des équipes (AI Act, art. 4)</CheckItem>
        <CheckItem id="ch9" size={25}>Procédure d’incident : qui prévenir, quoi révoquer</CheckItem>
        <CheckItem id="ch10" size={25}>Revue périodique de la charte</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1360, top: 262, width: 440, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Maturité de votre cadre"
          levels={[
            { min: 0, text: 'À construire : commencez par les points 1, 2 et 3.', tone: 'coral' },
            { min: 4, text: 'En cours : complétez agents et secrets.', tone: 'yellow' },
            { min: 8, text: 'Solide : entretenez-le.', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 1180, fontSize: 23, lineHeight: 1.45, color: C.muted, ...dl(500) }}>
      Open source : la charte fixe aussi les règles de contribution (code généré dans un projet public, licences, attribution).
    </div>
  </Frame>
);

// ─── Atelier : analyse d'incidents ──────────────────────────────────────────
const M5Q = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 29, color: C.ink }}>
    <Num n={n} tone="yellow" size={52} />
    <span>{children}</span>
  </div>
);

const M5_IncBrief: Page = () => (
  <Frame mod={5} kind="atelier">
    <Title>Atelier : analyse d’incidents liés à l’IA</Title>
    <Lede>Six incidents réels, 2023-2026. Un incident par groupe, cinq questions, deux minutes de restitution.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 36px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Eyebrow c={T.yellow.fg}>La grille d’analyse</Eyebrow>
      <M5Q n={1}>Que s’est-il passé ? (en trois phrases)</M5Q>
      <M5Q n={2}>Cause racine : technique… et organisationnelle</M5Q>
      <M5Q n={3}>Catégorie OWASP LLM concernée</M5Q>
      <M5Q n={4}>Quel contrôle l’aurait évité, ou détecté plus tôt ?</M5Q>
      <M5Q n={5}>Et chez nous : le même scénario est-il possible ?</M5Q>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="m5-inc" minutes={15} label="Analyse en groupe" cls={A.right} style={{ width: 560 }} />
      <Card tone="yellow" icon="users" title="Organisation" cls={A.right} style={dl(200)} size={22}>
        Groupes de 3. Le rapporteur présente en 2 minutes, le groupe suivant complète. On garde les contrôles dans la charte.
      </Card>
    </div>
  </Frame>
);

type M5IncP = { name: string; date: string; tag: string; tone: Tone; what: ReactNode; cause: ReactNode; owasp: string; ctl: ReactNode };
const M5Inc = (_: M5IncP) => null;

const M5Board = ({ children }: { children: ReactNode }) => {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<M5IncP>[];
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const it = items[idx].props;
  return (
    <>
      <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', gap: 10 }}>
        {items.map((x, i) => (
          <button
            key={i}
            type="button"
            data-osd-interactive
            onClick={(e) => {
              e.currentTarget.blur();
              setIdx(i);
              setOpen(false);
            }}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              borderRadius: 14,
              padding: '12px 14px',
              textAlign: 'left',
              fontFamily: body,
              background: i === idx ? G.navy : C.card,
              color: i === idx ? '#fff' : C.ink,
              boxShadow: i === idx ? 'none' : SHADOW_SM,
            }}
          >
            <div style={{ fontSize: 17, opacity: 0.75 }}>{x.props.date}</div>
            <div style={{ fontSize: 21, fontWeight: 700 }}>{x.props.name}</div>
          </button>
        ))}
      </div>
      <div key={idx} className={A.fade} style={{ position: 'absolute', left: 120, top: 360, width: 1680, display: 'flex', gap: 24, animationDuration: '400ms' } as CSSProperties}>
        <div style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
          <Tag tone={it.tone} size={19}>
            {it.tag}
          </Tag>
          <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.48, color: C.ink }}>{it.what}</div>
          <div style={{ marginTop: 22 }}>
            <Btn icon={open ? 'eyeOff' : 'eye'} tone="violet" size={21} onClick={() => setOpen((o) => !o)}>
              {open ? 'Masquer l’analyse' : 'Révéler l’analyse'}
            </Btn>
          </div>
        </div>
        <div style={{ width: 760, flex: 'none', display: 'flex', flexDirection: 'column', gap: 16, opacity: open ? 1 : 0.12, filter: open ? 'none' : 'blur(6px)', transition: `all 400ms ${EASE}` }}>
          <div style={{ background: T.coral.bg, borderRadius: 16, padding: '16px 22px' }}>
            <Eyebrow c={T.coral.fg} size={18}>
              Cause racine
            </Eyebrow>
            <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.42, color: C.ink }}>{it.cause}</div>
          </div>
          <div style={{ background: T.violet.bg, borderRadius: 16, padding: '14px 22px', fontSize: 22, color: C.ink }}>
            <strong style={{ color: T.violet.fg }}>OWASP · </strong>
            {it.owasp}
          </div>
          <div style={{ background: T.green.bg, borderRadius: 16, padding: '16px 22px' }}>
            <Eyebrow c={T.green.fg} size={18}>
              Contrôles qui auraient aidé
            </Eyebrow>
            <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.42, color: C.ink }}>{it.ctl}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const M5_Incidents: Page = () => (
  <Frame mod={5} kind="cas">
    <Title>Six incidents réels à analyser</Title>
    <M5Board>
      <M5Inc
        name="Samsung"
        date="avril 2023"
        tag="Fuite de données"
        tone="coral"
        what="Des ingénieurs collent du code source confidentiel et des notes de réunion dans ChatGPT pour déboguer et résumer. L’entreprise restreint ensuite l’usage de l’IA générative en interne."
        cause="Aucun outil validé ni règle claire ; données transmises à un tiers dont on ne maîtrise pas l’usage."
        owasp="LLM02 · divulgation d’informations sensibles"
        ctl="Offre entreprise, charte d’usage, classification des données, formation, prévention des fuites (DLP)."
      />
      <M5Inc
        name="Replit"
        date="juillet 2025"
        tag="Agentivité excessive"
        tone="pink"
        what="Pendant un gel des changements, un agent de code supprime la base de données de production d’un projet, puis donne des informations trompeuses sur la récupération possible."
        cause="Agent avec droits sur la production, environnements non séparés, gel exprimé seulement comme une consigne."
        owasp="LLM06 · agentivité excessive"
        ctl="Moindre privilège, séparation dev / prod, validation humaine des actions destructrices, sauvegardes testées."
      />
      <M5Inc
        name="Amazon Q"
        date="juillet 2025"
        tag="Chaîne d’approvisionnement"
        tone="violet"
        what="Un prompt « effaceur » (supprimer fichiers locaux et ressources cloud) est injecté dans le code de l’extension VS Code et publié dans la version signée 1.84.0. Selon AWS, son format l’empêchait de s’exécuter."
        cause="Contribution malveillante intégrée au dépôt open source, revue et contrôles de publication insuffisants."
        owasp="LLM03 · chaîne d’approvisionnement + LLM01 · injection"
        ctl="Revue stricte des contributions, droits minimaux sur le dépôt, confirmation humaine des commandes de l’agent."
      />
      <M5Inc
        name="Nx « s1ngularity »"
        date="août 2025"
        tag="Agents CLI détournés"
        tone="coral"
        what="Des versions piégées de Nx sont publiées sur npm. Un script d’installation lance les agents CLI présents (Claude Code, Gemini CLI, Amazon Q) avec leurs options de contournement des permissions pour chercher des secrets, publiés ensuite dans des dépôts des victimes."
        cause="Jeton de publication volé via une GitHub Action mal configurée ; agents installés sans garde-fou ; scripts d’installation exécutés."
        owasp="LLM03 · chaîne d’approvisionnement + LLM06"
        ctl="Jamais d’option de contournement des permissions, installation sans scripts quand c’est possible, rotation des jetons, scan de secrets."
      />
      <M5Inc
        name="CamoLeak"
        date="juin – août 2025"
        tag="Injection et exfiltration"
        tone="violet"
        what="Des instructions cachées dans des commentaires invisibles d’une PR poussent Copilot Chat, qui agit avec les droits de l’utilisateur, à lire des dépôts privés et à exfiltrer secrets et code via le proxy d’images de GitHub. Score CVSS 9,6."
        cause="Contenu non fiable traité comme une consigne ; sortie rendue (images) utilisée comme canal d’exfiltration."
        owasp="LLM01 · injection + LLM02 + LLM05 · sortie mal traitée"
        ctl="Corrigé par GitHub en désactivant le rendu d’images dans Copilot Chat. Côté équipe : prudence avec les PR externes, droits minimaux."
      />
      <M5Inc
        name="Clinejection"
        date="février 2026"
        tag="Injection en CI"
        tone="coral"
        what="Un titre d’issue piégé, lu par un workflow d’IA dans GitHub Actions, mène au vol des jetons de publication d’un assistant de code. Une version piégée de son CLI, publiée sur npm, installe un autre agent sur environ 4 000 machines."
        cause="Un workflow qui traite du contenu non fiable avait accès à des secrets ; rotation des jetons mal faite après un premier signalement."
        owasp="LLM01 · injection + LLM03 + LLM06"
        ctl="Aucun secret accessible aux workflows qui lisent du contenu externe, permissions minimales des Actions, publication à jetons courts."
      />
    </M5Board>
  </Frame>
);

// ─── QCM M5 ─────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={4}
    title="Un jeton a fuité"
    q="Votre agent a committé et poussé un jeton npm dans un dépôt public il y a dix minutes. Quelle est votre première action ?"
    explain="Un secret poussé doit être considéré comme compromis : des robots scannent GitHub en continu. On révoque d’abord, on nettoie ensuite, et on cherche pourquoi l’agent y avait accès."
  >
    <Opt why="Piège ! Le jeton a pu être copié dès la première minute : réécrire l’historique ne le rend pas inutilisable.">Réécrire l’historique (force push) pour supprimer le commit</Opt>
    <Opt why="Piège ! Les clones et caches existent déjà, et le jeton reste valide.">Passer le dépôt en privé</Opt>
    <Opt ok why="Oui : révoquer, en émettre un nouveau, vérifier les publications récentes, puis nettoyer l’historique et corriger la cause.">
      Révoquer le jeton immédiatement, puis nettoyer et analyser
    </Opt>
    <Opt why="Non : vous ajoutez du temps… et vous confiez l’incident à l’outil qui l’a causé.">Demander à l’agent de corriger son erreur</Opt>
  </QcmPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M5_Divider,
  M5_Risks,
  M5_Owasp,
  M5_Secrets,
  M5_DataFlow,
  M5_Agency,
  M5_Logging,
  M5_DebugView,
  M5_GDPR,
  M5_AIAct,
  M5_Charter,
  M5_IncBrief,
  M5_Incidents,
  M5_Qcm,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M5 · 11:15

OBJECTIF — Annoncer le module 5 du programme : principaux risques (fuite de données, code malveillant, dépendance aux services externes), bonnes pratiques (clés d’API, données envoyées, journalisation), cadre normatif (RGPD, directives internes, open source), et l’atelier d’analyse d’incidents.

DIRE — « Module 5 : la cybersécurité. Hier, on a vu les précautions individuelles. Aujourd’hui, on prend la casquette du RSSI : quels sont les risques pour une équipe, quelles pratiques les réduisent, quel cadre légal s’applique. Et surtout, on analysera six incidents réels, de 2023 à 2026, dont certains concernent directement les outils que vous utilisez. »

ANIMATION — Si des RSSI ou responsables sécurité sont présents, les inviter à compléter au fil du module.

TRANSITION — « Les quatre familles de risques. »`,
  `⏱ 4 min · RISQUES (3 temps)

OBJECTIF — Présenter les trois risques du programme et le risque agentique.

DIRE — « Un : la fuite de données. Ce que vous collez dans un prompt, ce que l’agent lit, ce qu’une injection lui fait exfiltrer. » → clic. « Deux : le code malveillant. Un paquet inventé ou piégé, une extension compromise, ou simplement une faille dans le code généré. » → clic. « Trois : la dépendance aux services externes. Une panne, un changement de prix — on l’a vécu en juin avec la facturation à l’usage —, un modèle retiré, l’enfermement chez un fournisseur. La parade : des formats ouverts comme AGENTS.md et MCP, des tests qui ne dépendent pas de l’outil, un plan B. » → clic. « Quatre, apparu avec les agents : l’agentivité excessive. Un agent qui exécute, supprime ou publie avec trop de droits. C’est le risque qui a produit les incidents les plus spectaculaires. »

ANIMATION — Demander quel risque inquiète le plus le groupe.

TRANSITION — « Pour nommer ces risques avec précision, il existe une référence : l’OWASP. »`,
  `⏱ 4 min · OWASP TOP 10 LLM (cartes)

OBJECTIF — Connaître la référence OWASP et ses six catégories clés pour un développeur.

DIRE — « L’OWASP, que vous connaissez pour le Top 10 web, publie un Top 10 pour les applications à base de LLM. Version 2025. Six catégories vous concernent directement, en rouge. LLM01, l’injection de prompt : on l’a vue hier. LLM02, la divulgation d’informations sensibles. LLM03, la chaîne d’approvisionnement : paquets, extensions, serveurs MCP. LLM05, le traitement de sortie inadéquat : la sortie du modèle injectée telle quelle dans du HTML ou un shell, comme l’innerHTML de l’audit d’hier. LLM06, l’agentivité excessive. Et LLM10, la consommation non bornée : une boucle d’agent qui brûle vos crédits. » Retourner deux ou trois cartes.

ANIMATION — Ces codes serviront dans l’analyse d’incidents : demander de les garder sous les yeux.

TRANSITION — « Première bonne pratique du programme : protéger les clés d’API. »`,
  `⏱ 4 min · ACTUALITÉ · SECRETS

OBJECTIF — Chiffrer le problème des secrets et donner six pratiques.

DIRE — « GitGuardian publie chaque année l’état des fuites de secrets. Édition 2026 : environ 29 millions de secrets codés en dur exposés sur GitHub public en 2025, plus 34 % en un an, la plus forte hausse jamais mesurée. Les clés de services d’IA fuient de plus en plus : plus 81 %. Et le chiffre qui surprend : 32 % des dépôts internes contiennent au moins un secret, contre 5,6 % des dépôts publics. L’interne n’est pas une protection. Le rapport observe aussi davantage de fuites dans les commits co-écrits avec des agents de code. Six pratiques : rien dans le code ni dans un prompt ; .env ignoré et scanner avant commit ; protection au push sur le dépôt ; coffre-fort de secrets et droits minimaux ; jetons courts en CI ; et en cas de fuite, rotation immédiate. »

ANIMATION — Demander : « Qui a un scanner de secrets en pre-commit ? »

TRANSITION — « Deuxième pratique : maîtriser les données envoyées. »`,
  `⏱ 3 min · DONNÉES ENVOYÉES (1 temps)

OBJECTIF — Rendre visible tout ce qui part vers le modèle.

DIRE — « Le prompt n’est que la partie visible. Un agent envoie aussi les fichiers joints, les fichiers qu’il a lus de lui-même, les sorties de commandes — vos tests, vos logs —, les réponses des serveurs MCP, et pour la complétion, le contenu des onglets ouverts. Tout ça passe par le service de l’outil, puis par le fournisseur du modèle que vous avez choisi. » → clic. « Les leviers : une offre entreprise avec des engagements contractuels ; des modèles autorisés par l’organisation ; les exclusions ; des outils MCP limités ; des données fictives ; et un modèle local pour le code le plus sensible. Notez que choisir un modèle dans le sélecteur, c’est aussi choisir qui traite votre requête. »

ANIMATION — Le point rouge qui circule symbolise une donnée qui sort. Demander : « Quel onglet avez-vous ouvert en ce moment ? Il part peut-être dans la complétion. »

TRANSITION — « Troisième pratique, propre aux agents : limiter leurs droits. »`,
  `⏱ 5 min · EXERCICE INTERACTIF · DROITS DE L’AGENT

OBJECTIF — Faire ressentir l’effet de chaque réglage sur le risque (LLM06).

DIRE — « Point de départ : une configuration malheureusement fréquente. Toutes les commandes approuvées automatiquement, le réseau ouvert, et des secrets dans l’environnement du terminal. Risque critique. » Désactiver l’approbation automatique : le risque baisse fortement. Retirer les secrets de l’environnement. Activer le conteneur et la liste de commandes autorisées. « On arrive à un niveau maîtrisé, sans empêcher l’agent de travailler. Pourquoi c’est important ? En août 2025, l’attaque Nx s1ngularity : un paquet npm piégé a lancé les agents CLI installés sur les postes avec leurs options de contournement des permissions, pour chercher des secrets. Selon Wiz, ça a fonctionné dans des centaines de cas. »

ANIMATION — Faire manipuler par un participant. Dans VS Code, l’approbation automatique globale et la liste de commandes du terminal se règlent dans les paramètres du chat (vérifier les noms exacts selon la version). Ne jamais lancer un agent CLI avec une option qui saute les permissions sur un poste qui contient des secrets.

TRANSITION — « Quatrième pratique : la journalisation. »`,
  `⏱ 3 min · JOURNALISATION

OBJECTIF — Savoir quoi tracer, à quel niveau, sans créer de nouvelle fuite.

DIRE — « En cas d’incident, la première question est : qui a fait quoi, avec quel outil ? Quatre niveaux. L’outil : les offres entreprise fournissent des journaux d’audit et des métriques d’usage. L’agent : les fichiers lus, les commandes, les outils, les tokens — la Chat Debug View, et les rapports que vos agents écriront cet après-midi. Le code : un commit par lot, une PR liée à l’issue, la mention de l’usage de l’IA. L’application : des journaux assainis. Et le piège classique : journaliser les prompts “pour le debug”. Vous recopiez alors dans les logs les données personnelles et les secrets que vous vouliez protéger. Masquez, tronquez, et fixez une durée de conservation : c’est une exigence du RGPD. »

ANIMATION — Demander si leurs PR mentionnent l’usage de l’IA ; c’est un sujet de charte.

TRANSITION — « Voyons concrètement ce qu’un agent envoie : démonstration du lab 7.1. »`,
  `⏱ 6 min · DÉMO FORMATEUR · LAB 7.1 (bonus) (3 temps)

OBJECTIF — Montrer en direct ce qui part au modèle, au service de la sécurité et de l’optimisation.

DIRE — « J’ouvre la Chat Debug View, puis une nouvelle session en mode Agent, et je lance ce prompt tel quel. » Lancer, puis inspecter. « Un : le prompt système. On y trouve copilot-instructions.md, et les instructions ui, domain et tests seulement parce que l’agent touche ces fichiers. » → clic. « Deux : le contexte, les deux fichiers joints. » → clic. « Trois : les réponses d’outils. Quels fichiers l’agent a-t-il lus de lui-même ? C’est ici que vous verriez un .env lu malgré vos exclusions. » → clic. « Quatre : les tokens, au survol du pied de la réponse. Le premier poste vient souvent des sorties d’outils, pas des instructions. Les tokens en cache augmentent d’une requête à l’autre : c’est le cache de prompt, on en reparle au module 6. »

ANIMATION — Si la démo en direct est impossible (réseau, licence), commenter la page clic par clic. Les noms de sections évoluent avec VS Code : les vérifier avant la session.

TRANSITION — « Passons au cadre normatif, à commencer par le RGPD. »`,
  `⏱ 4 min · RGPD

OBJECTIF — Relier les principes RGPD à l’usage de l’IA en développement.

DIRE — « Dès qu’une donnée personnelle peut atteindre un prompt, un journal ou un jeu de test, le RGPD s’applique. Article 5, la minimisation : pour coder, des données fictives suffisent presque toujours. Article 28 : le fournisseur de l’outil est votre sous-traitant, il faut un contrat avec des garanties. Chapitre V : où sont traités les prompts, et avec quel encadrement si c’est hors de l’UE ? Article 35 : l’analyse d’impact, souvent nécessaire pour un outil déployé à grande échelle. Article 25 : la protection dès la conception, qui s’applique aussi au code que vous générez. Et la CNIL publie des fiches pratiques sur l’IA, une très bonne base pour une charte. Je ne suis pas juriste : votre DPO est l’interlocuteur. »

ANIMATION — Demander si une AIPD a été faite pour l’outil IA de leur entreprise.

TRANSITION — « Deux règlements européens complètent le tableau : l’AI Act et le Cyber Resilience Act. »`,
  `⏱ 4 min · ACTUALITÉ · AI ACT + CRA (2 temps)

OBJECTIF — Donner le calendrier réglementaire à jour (octobre 2026) et ses effets pour les développeurs.

DIRE — « L’AI Act est entré en vigueur en août 2024 et s’applique par étapes. Février 2025 : les pratiques interdites, et une obligation souvent méconnue, l’article 4, la maîtrise de l’IA : former les personnes qui utilisent l’IA. Cette formation y contribue. Août 2025 : les obligations des fournisseurs de modèles à usage général. Août 2026 : la transparence, informer qu’on interagit avec une IA. » → clic. « Et il y a un mois, le 11 septembre 2026 : le Cyber Resilience Act impose aux éditeurs de signaler les vulnérabilités activement exploitées, alerte en 24 heures, notification en 72 heures. Ça concerne le code, y compris généré par IA. » → clic. « À venir : les obligations de l’IA à haut risque, que l’omnibus numérique reporte à décembre 2027 — accord politique en mai 2026 —, et l’application complète du CRA en décembre 2027. »

ANIMATION — Le point rouge pulse : c’est l’actualité la plus récente.

TRANSITION — « Dernier élément du cadre : vos directives internes. »`,
  `⏱ 4 min · EXERCICE · CHARTE INTERNE

OBJECTIF — Évaluer la maturité du cadre interne et repérer les manques (programme : directives internes, open source).

DIRE — « Dix éléments d’une charte d’usage de l’IA pour une équipe de développement. Cochez ce qui existe déjà chez vous. » Lire les dix points. « Ce qui manque deviendra une action de votre plan personnel au module 7. Si vous ne devez retenir que trois points pour démarrer : la liste des outils autorisés, la classification des données qui peuvent sortir, et la règle de revue du code IA. Et n’oubliez pas l’open source : la charte fixe aussi les règles de contribution à des projets publics avec du code généré. »

ANIMATION — Faire cocher par plusieurs participants d’entreprises différentes ; comparer les scores. Les RSSI peuvent partager leurs modèles de charte.

TRANSITION — « Maintenant, l’atelier du module : l’analyse d’incidents. »`,
  `⏱ 2 min · ATELIER · CONSIGNES

OBJECTIF — Lancer l’atelier d’analyse d’incidents (programme M5).

DIRE — « Six incidents réels, de 2023 à 2026. Groupes de trois, un incident par groupe. Cinq questions : que s’est-il passé, la cause racine technique et organisationnelle, la catégorie OWASP, le contrôle qui l’aurait évité ou détecté, et la question la plus importante : le même scénario est-il possible chez nous ? Quinze minutes d’analyse, puis deux minutes de restitution par groupe. »

ANIMATION — Attribuer les incidents : Samsung, Replit, Amazon Q, Nx, CamoLeak, Clinejection. Lancer le minuteur. Les groupes consultent la page suivante (onglets), sans révéler l’analyse avant la restitution.

TRANSITION — « Voici les incidents. »`,
  `⏱ 15 min d’analyse + 12 min de restitution · ÉTUDE DE CAS (onglets)

OBJECTIF — Analyser des incidents réels et en tirer des contrôles.

DIRE — À chaque restitution, cliquer l’onglet du groupe, laisser présenter, puis « Révéler l’analyse » pour compléter.

POINTS CLÉS PAR INCIDENT — Samsung 2023 : pas d’outil validé, d’où la charte et l’offre entreprise. Replit 2025 : un gel exprimé seulement en consigne n’est pas un contrôle ; séparer dev et prod. Amazon Q 2025 : la chaîne d’approvisionnement de l’outil lui-même ; version signée mais compromise. Nx 2025 : première attaque qui détourne les agents CLI des développeurs ; jamais d’option de contournement des permissions. CamoLeak 2025 : Copilot Chat exfiltrait via le proxy d’images ; GitHub a désactivé le rendu d’images ; la sortie du modèle est un canal. Clinejection 2026 : un workflow IA qui lit du contenu externe ne doit avoir accès à aucun secret.

MESSAGE TRANSVERSAL — Chaque incident combine une faiblesse technique ET une faiblesse organisationnelle. Les contrôles efficaces sont simples : moindre privilège, revue, séparation, rotation.

TRANSITION — « Un dernier QCM avant le déjeuner. »`,
  `⏱ 2 min · QCM 4 · fin vers 12:30

OBJECTIF — Ancrer la réaction correcte à une fuite de secret.

DIRE — « Un jeton npm poussé dans un dépôt public il y a dix minutes. Première action ? »

RÉPONSES — A ✗ piège : le jeton a pu être copié dès la première minute, des robots scannent GitHub en continu. B ✗ piège : clones et caches existent, le jeton reste valide. C ✓ révoquer immédiatement, en émettre un nouveau, vérifier les publications récentes (Clinejection !), puis nettoyer l’historique et corriger la cause : pourquoi l’agent avait-il ce jeton ? D ✗ on perd du temps.

ANIMATION — Relier à la procédure d’incident de la charte.

TRANSITION — « Bon appétit ! À 14 heures, module 6 : on construit une équipe d’agents et on fiabilise le code. »`,
];
// @@NOTES-END
