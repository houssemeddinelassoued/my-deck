// ─── Module 2 · Installation et configuration ───────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Installation et
        <br />
        configuration
      </>
    }
    sub="Un poste prêt, des réglages qui vous ressemblent, et les gestes clavier qui font gagner du temps."
    dur="J1 · 11:10 – 12:15"
    labs={<Tag tone="green" size={19}>Atelier 2 · réglages et 8 gestes</Tag>}
  >
    <SecItem n={1}>Installer Copilot dans VS Code</SecItem>
    <SecItem n={2}>S’authentifier et activer sa licence</SecItem>
    <SecItem n={3}>Paramétrer langue, langages et confidentialité</SecItem>
    <SecItem n={4}>Les raccourcis clavier essentiels</SecItem>
    <SecItem n={5}>Naviguer entre suggestions et piloter le panneau Chat</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── Installer ──────────────────────────────────────────────────────────────
const M2Step = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="blue" size={44} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 2 }}>{children}</div>
    </div>
  </div>
);

const M2StatusBar = () => (
  <div style={{ background: '#0F1530', borderRadius: 16, overflow: 'hidden', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)' }}>
    <div style={{ padding: '18px 22px', fontFamily: mono, fontSize: 19, color: '#AEB9E6', lineHeight: 1.6 }}>
      <span style={{ color: '#7C86A8' }}>{'// TaskFlow · src/tickets.js'}</span>
      {'\n'}
      <br />
      <span style={{ color: '#C792EA' }}>export const</span> TYPES = <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>Object.freeze([…])</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#1E22E8', fontSize: 17, color: '#fff', fontFamily: body }}>
      <span>⎇ main · 0 ⚠ 0 ✕</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Ln 3, Col 42</span>
        <span>JavaScript</span>
        <span className={A.glow} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.18)', borderRadius: 6, padding: '2px 10px' }}>
          <Icon name="sparkles" size={18} color="#fff" /> Copilot
        </span>
      </span>
    </div>
  </div>
);

const M2_Installer: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Installer Copilot dans VS Code</Title>
    <Lede>Copilot est intégré à VS Code : on se connecte avec son compte GitHub, l’extension Copilot Chat suit automatiquement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 880, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <M2Step n={1} title="Mettre VS Code à jour" d={100}>
        Aide › Rechercher les mises à jour : les nouveautés Copilot arrivent avec VS Code.
      </M2Step>
      <M2Step n={2} title="Cliquer sur l’icône Copilot" d={200}>
        Barre d’état, en bas à droite, ou vue Chat (<Kbd>Ctrl+Alt+I</Kbd>) › « Se connecter ».
      </M2Step>
      <M2Step n={3} title="Se connecter avec GitHub" d={300}>
        Le navigateur s’ouvre : autorisez VS Code, puis revenez dans l’éditeur.
      </M2Step>
      <M2Step n={4} title="Vérifier l’extension" d={400}>
        Vue Extensions (<Kbd>Ctrl+Maj+X</Kbd>) : « GitHub Copilot Chat » installée et activée.
      </M2Step>
      <M2Step n={5} title="Faire un premier essai" d={500}>
        Tapez un commentaire dans un fichier .js : le texte grisé apparaît.
      </M2Step>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1080, top: 280, width: 720, ...dl(300) }}>
      <M2StatusBar />
      <Callout tone="green" icon="checkCircle" title="Installation réussie si…" size={22} style={{ marginTop: 24 }}>
        L’icône Copilot de la barre d’état n’affiche ni barre oblique ni point d’exclamation, et la vue Chat répond.
      </Callout>
    </div>
  </Frame>
);

// ─── Authentification & licence ─────────────────────────────────────────────
const M2Case = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M2_Licence: Page = () => (
  <Frame mod={2}>
    <Title>Authentification et activation de la licence</Title>
    <Lede>Le compte GitHub avec lequel vous vous connectez détermine votre offre. Trois situations possibles :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M2Case icon="user" tone="green" title="Pas encore de licence" d={100}>
        Copilot Free s’active à la première connexion. Rien à payer, quotas mensuels.
      </M2Case>
      <M2Case icon="key" tone="blue" title="Licence personnelle" d={220}>
        Pro ou Pro+, souscrite sur github.com/settings/copilot avec votre compte.
      </M2Case>
      <M2Case icon="org" tone="violet" title="Licence d’entreprise" d={340}>
        Votre organisation vous attribue un siège Business ou Enterprise. Connectez-vous avec le compte rattaché à l’organisation.
      </M2Case>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(500) }}>
      <PanelTitle icon="search">Vérifier son statut en 10 secondes</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 28, marginTop: 6 }}>
        <Bullet size={23}>Icône Copilot de la barre d’état : offre et quotas restants</Bullet>
        <Bullet size={23}>Menu Comptes de VS Code : quel compte GitHub est connecté</Bullet>
        <Bullet size={23}>github.com/settings/copilot : offre, réglages, usage</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="yellow" icon="lock" title="Une fonctionnalité grisée ?" size={24} cls={A.in} style={dl(700)}>
        En entreprise, l’administrateur peut désactiver des modèles, le mode Agent ou les préversions. Ce n’est pas une panne : c’est une politique.
      </Callout>
    </div>
  </Frame>
);

// ─── Paramétrage ────────────────────────────────────────────────────────────
const M2Setting = ({ k: key, children, beat }: { k: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 18px', borderRadius: 12, background: T.blue.bg, boxShadow: `inset 5px 0 0 ${C.blue}` }}>
    <span style={{ fontFamily: mono, fontSize: 19, color: T.blue.fg }}>{key}</span>
    <span style={{ fontSize: 22, color: C.ink, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const M2_Parametres: Page = () => (
  <Frame mod={2} kind="demo" beats={4}>
    <Title>Paramétrer son environnement de travail</Title>
    <Lede>Des réglages d’espace de travail, versionnés avec le projet : toute l’équipe partage les mêmes.</Lede>
    <CodeDark file=".vscode/settings.json" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900 }}>
      {'{'}
      {'\n'}
      {'  '}
      <Cs>"github.copilot.chat.localeOverride"</Cs>: <Cs>"fr"</Cs>,{'\n'}
      {'  '}
      <Cs>"github.copilot.enable"</Cs>: {'{'}
      {'\n'}
      {'    '}
      <Cs>"*"</Cs>: <Ck>true</Ck>,{'\n'}
      {'    '}
      <Cs>"markdown"</Cs>: <Ck>false</Ck>,{'\n'}
      {'    '}
      <Cs>"plaintext"</Cs>: <Ck>false</Ck>
      {'\n'}
      {'  },\n'}
      {'  '}
      <Cs>"github.copilot.nextEditSuggestions.enabled"</Cs>: <Ck>true</Ck>,{'\n'}
      {'  '}
      <Cs>"editor.inlineSuggest.enabled"</Cs>: <Ck>true</Ck>
      {'\n'}
      {'}'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1070, top: 262, width: 730, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Setting k="localeOverride" beat={1}>
        Le chat répond en français, quelle que soit la langue de VS Code.
      </M2Setting>
      <M2Setting k="github.copilot.enable" beat={2}>
        Langages ciblés : les suggestions inline restent actives pour le code, coupées pour la prose.
      </M2Setting>
      <M2Setting k="nextEditSuggestions" beat={3}>
        Suggestions de modification suivante : Copilot anticipe la prochaine retouche.
      </M2Setting>
      <M2Setting k="Ctrl+, › « copilot »" beat={4}>
        Tous les réglages se retrouvent aussi dans l’éditeur de paramètres, sans JSON.
      </M2Setting>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Ctrl+Maj+P › « Préférences : Ouvrir les paramètres de l’espace de travail (JSON) »
    </Hint>
  </Frame>
);

// ─── Confidentialité ────────────────────────────────────────────────────────
const M2_Confidentialite: Page = () => (
  <Frame mod={2}>
    <Title>Deux réglages de confiance à connaître</Title>
    <Lede>Sur github.com/settings/copilot (compte personnel) ou dans les politiques de votre organisation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 26 }}>
      <Card icon="globe" tone="violet" title="Suggestions correspondant à du code public" size={23} pad={28} cls={A.in} style={dl(100)}>
        <strong>Bloquer</strong> : Copilot écarte les suggestions qui reproduisent un code public existant.
        <br />
        <strong>Autoriser</strong> : il les propose, avec une référence vers le code d’origine et sa licence.
      </Card>
      <Card icon="database" tone="blue" title="Utilisation de vos données" size={23} pad={28} cls={A.in} style={dl(250)}>
        Compte personnel : vérifiez le réglage qui autorise ou non l’usage de vos interactions pour améliorer les modèles.
        <br />
        Business / Enterprise : vos données ne servent pas à l’entraînement.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 26 }}>
      <Callout tone="teal" icon="eyeOff" title="Exclusion de contenu" size={23} cls={A.in} style={dl(450)}>
        En entreprise, l’administrateur peut interdire à Copilot de lire certains fichiers ou dépôts.
      </Callout>
      <Callout tone="coral" icon="lock" title="La meilleure protection reste vous" size={23} cls={A.in} style={dl(600)}>
        Pas de secret dans le code, pas de donnée réelle dans un prompt, fichier .env exclu du dépôt.
      </Callout>
    </div>
  </Frame>
);

// ─── Raccourcis ─────────────────────────────────────────────────────────────
const M2Key = ({ keys, label, sub, tone, d }: { keys: ReactNode; label: string; sub: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px', borderLeft: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontSize: 28, display: 'flex', gap: 6, flexWrap: 'wrap' }}>{keys}</div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M2_Raccourcis: Page = () => (
  <Frame mod={2}>
    <Title>Les 8 raccourcis qui changent tout</Title>
    <Lede>Windows et Linux. Sur macOS : Ctrl devient Cmd, Alt devient Option.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      <M2Key keys={<Kbd>Tab</Kbd>} label="Accepter la suggestion" sub="tout le texte grisé" tone="green" d={100} />
      <M2Key keys={<Kbd>Ctrl+I</Kbd>} label="Chat en ligne" sub="demander une modification sur place" tone="violet" d={150} />
      <M2Key keys={<Kbd>Échap</Kbd>} label="Refuser" sub="et continuer à taper" tone="coral" d={200} />
      <M2Key keys={<Kbd>Ctrl+Alt+I</Kbd>} label="Vue Chat" sub="converser, expliquer, planifier" tone="violet" d={250} />
      <M2Key keys={<Kbd>Ctrl+→</Kbd>} label="Accepter mot par mot" sub="garder le début seulement" tone="green" d={300} />
      <M2Key keys={<Kbd>Ctrl+N</Kbd>} label="Nouvelle conversation" sub="dans la vue Chat : repartir d’un contexte propre" tone="violet" d={350} />
      <M2Key keys={<><Kbd>Alt+]</Kbd><Kbd>Alt+[</Kbd></>} label="Suggestion suivante / précédente" sub="ou survol : barre « 1/3 »" tone="blue" d={400} />
      <M2Key keys={<Kbd>Alt+\</Kbd>} label="Déclencher une suggestion" sub="quand rien ne s’affiche" tone="blue" d={450} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="yellow" icon="pointer" title="Clavier AZERTY" size={23} cls={A.in} style={dl(700)}>
        Alt+] ou Alt+\ ne répondent pas ? Survolez le texte grisé, ou réattribuez le raccourci : Ctrl+K Ctrl+S › « inline suggestion ».
      </Callout>
    </div>
  </Frame>
);

// ─── Naviguer entre les suggestions ─────────────────────────────────────────
const M2_Navigation: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Naviguer entre les suggestions</Title>
    <Lede>Deux familles : la suite de ce que vous tapez (texte grisé), et la prochaine modification probable (flèche dans la gouttière).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 820 }}>
      <PanelTitle icon="code" c={C.blue}>
        Texte grisé · plusieurs propositions
      </PanelTitle>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: 20, top: -18, zIndex: 2, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, boxShadow: SHADOW, padding: '6px 14px', fontSize: 19, color: C.ink }}>
          <span>‹</span>
          <strong>2 / 3</strong>
          <span>›</span>
          <span style={{ color: C.muted }}>Accepter Tab · Mot Ctrl+→</span>
        </div>
        <CodeDark file="katas/02-raccourcis.js" size={21}>
          <Ck>function</Ck> <Cf>diviser</Cf>(a, b) {'{'}
          {'\n'}
          <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>
            {'  if (b === 0) throw new RangeError("division par zéro");\n  return a / b;'}
          </span>
          {'\n}'}
        </CodeDark>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet size={23}>Survol ou <Kbd>Alt+]</Kbd> : comparer les alternatives</Bullet>
        <Bullet size={23}><Kbd>Ctrl+→</Kbd> : n’accepter que le premier mot, puis le suivant</Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <PanelTitle icon="arrow" c={C.violet}>
        Modification suivante (NES)
      </PanelTitle>
      <CodeDark file="katas/02-raccourcis.js" size={21}>
        <Ck>function</Ck> <Cf>moyenne</Cf>(<span style={{ background: 'rgba(155,226,155,.25)' }}>valeurs</span>) {'{'}
        {'\n'}
        <span style={{ display: 'inline-block', width: 26, color: '#FFD27A' }}>➜</span>
        <Ck>return</Ck> <span style={{ textDecoration: 'line-through', color: '#F28B82' }}>nombres</span>
        <span style={{ color: '#9BE29B' }}>valeurs</span>.reduce(…) / …;{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet size={23} tone="violet">Vous renommez un paramètre : une flèche apparaît</Bullet>
        <Bullet size={23} tone="violet"><Kbd>Tab</Kbd> pour y aller, <Kbd>Tab</Kbd> pour appliquer, <Kbd>Échap</Kbd> pour ignorer</Bullet>
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="eye" title="Dans les deux cas" size={24}>
        Rien n’est écrit tant que vous n’avez pas appuyé sur Tab. Le texte grisé est une proposition, pas une décision.
      </Callout>
    </div>
  </Frame>
);

// ─── Le panneau Chat ────────────────────────────────────────────────────────
const M2Badge = ({ n, x, y }: { n: number; x: number; y: number }) => (
  <span style={{ position: 'absolute', left: x, top: y, width: 34, height: 34, borderRadius: 99, background: C.coral, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', boxShadow: '0 6px 14px -6px rgba(180,60,40,.7)' }}>
    {n}
  </span>
);

const M2Legend = ({ n, title, children, beat }: { n: number; title: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} tone="coral" size={36} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const M2ChatMock = () => (
  <div style={{ position: 'relative', width: 700, height: 650, background: '#1B1F3B', borderRadius: 18, boxShadow: '0 30px 60px -30px rgba(11,31,92,.8)', fontFamily: body, color: '#DCE2F5' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #2C3260', fontSize: 17, letterSpacing: '0.1em' }}>
      <span>CHAT</span>
      <span style={{ display: 'flex', gap: 18, fontSize: 22 }}>
        <span>＋</span>
        <span>⟲</span>
        <span>⋯</span>
      </span>
    </div>
    <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ alignSelf: 'flex-end', maxWidth: 480, background: '#2C3470', borderRadius: 12, padding: '10px 14px', fontSize: 18 }}>Explique trierBacklog en 3 points.</div>
      <div style={{ maxWidth: 560, fontSize: 18, lineHeight: 1.5, color: '#C5CCE8' }}>
        1. Copie le tableau reçu…
        <br />
        2. Trie par priorité, puis par points…
        <br />
        <span style={{ fontSize: 15, color: '#8D96C2' }}>Références : backlog.js, tickets.js</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, background: '#121633', borderRadius: 14, border: '1.5px solid #3A4280', padding: '12px 14px' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ fontSize: 15, background: '#2C3470', borderRadius: 6, padding: '2px 8px' }}>📎 Ajouter du contexte…</span>
        <span style={{ fontSize: 15, background: '#2C3470', borderRadius: 6, padding: '2px 8px' }}>backlog.js</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 18, color: '#7C86A8' }}>Demandez à Copilot, / pour les commandes, # pour le contexte</div>
      <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', fontSize: 16 }}>
        <span style={{ background: '#2C3470', borderRadius: 6, padding: '3px 10px' }}>Ask ▾</span>
        <span style={{ background: '#2C3470', borderRadius: 6, padding: '3px 10px' }}>Auto ▾</span>
        <span style={{ marginLeft: 'auto', background: C.electric, borderRadius: 6, padding: '3px 12px', color: '#fff' }}>➤</span>
      </div>
    </div>
    <M2Badge n={1} x={560} y={-14} />
    <M2Badge n={2} x={612} y={-14} />
    <M2Badge n={3} x={6} y={498} />
    <M2Badge n={4} x={6} y={578} />
    <M2Badge n={5} x={110} y={578} />
    <M2Badge n={6} x={300} y={536} />
  </div>
);

const M2_PanneauChat: Page = () => (
  <Frame mod={2} kind="demo" beats={6}>
    <Title>Le panneau Copilot Chat, bouton par bouton</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210 }}>
      <M2ChatMock />
    </div>
    <div style={{ position: 'absolute', left: 900, top: 210, width: 900, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Legend n={1} title="Nouvelle conversation" beat={1}>
        Un sujet = une conversation. <Kbd>Ctrl+N</Kbd> repart d’un contexte propre.
      </M2Legend>
      <M2Legend n={2} title="Historique des sessions" beat={2}>
        Retrouver, renommer ou reprendre une conversation passée.
      </M2Legend>
      <M2Legend n={3} title="Ajouter du contexte" beat={3}>
        <Ic>#file</Ic>, <Ic>#selection</Ic>, <Ic>#codebase</Ic>, ou glisser un fichier : ce que le modèle verra.
      </M2Legend>
      <M2Legend n={4} title="Choisir l’agent" beat={4}>
        <strong>Ask</strong> répond, <strong>Plan</strong> prépare, <strong>Agent</strong> modifie les fichiers.
      </M2Legend>
      <M2Legend n={5} title="Choisir le modèle" beat={5}>
        <strong>Auto</strong> par défaut ; le choix manuel dépend de votre offre.
      </M2Legend>
      <M2Legend n={6} title="Commandes « / »" beat={6}>
        <Ic>/explain</Ic> <Ic>/fix</Ic> <Ic>/tests</Ic> <Ic>/doc</Ic> : des raccourcis de demandes fréquentes.
      </M2Legend>
    </div>
  </Frame>
);

// ─── Ask, Plan, Agent, chat en ligne ────────────────────────────────────────
const M2Mode = ({ icon, tone, title, who, when, risk, d }: { icon: IconName; tone: Tone; title: string; who: string; when: string; risk: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>CE QU’IL FAIT</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{who}</div>
    <div style={{ marginTop: 12, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>QUAND</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{when}</div>
    <div style={{ marginTop: 12, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>VIGILANCE</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: T[tone].fg }}>{risk}</div>
  </div>
);

const M2_Agents: Page = () => (
  <Frame mod={2}>
    <Title>Ask, Plan, Agent… et le chat en ligne</Title>
    <Lede>Quatre façons de parler à Copilot. Pour débuter : Ask et Ctrl+I d’abord, Agent quand vous êtes à l’aise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 22 }}>
      <M2Mode icon="chat" tone="blue" title="Ask" who="Répond, explique, propose du code dans le chat" when="Comprendre un code, une erreur, une notion" risk="Aucune modification : vous copiez ce que vous voulez" d={100} />
      <M2Mode icon="pointer" tone="violet" title="Ctrl+I" who="Modifie la sélection, sur place, avec un diff" when="Une retouche ciblée sur une fonction" risk="Relire le diff avant d’accepter" d={220} />
      <M2Mode icon="map" tone="teal" title="Plan" who="Analyse et propose un plan, sans écrire de code" when="Avant une tâche qui touche plusieurs fichiers" risk="Le plan peut être faux : discutez-le" d={340} />
      <M2Mode icon="bot" tone="green" title="Agent" who="Modifie des fichiers, lance des commandes, itère" when="Une tâche multi-fichiers bien définie" risk="Il agit : permissions, diff, tests" d={460} />
    </div>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Lab: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Configurer son poste, prendre les réflexes"
    defi="config"
    who="Individuel · 30 min"
    objective={
      <>
        Vérifier votre <strong>licence</strong>, écrire votre <PathChip size={22}>.vscode/settings.json</PathChip> (langue, langages, NES) en vérifiant chaque effet, puis enchaîner les <strong>8 gestes clavier</strong> sans souris.
      </>
    }
    where={
      <>
        <PathChip size={19}>.vscode/settings.json</PathChip>
        <br />
        8 gestes cochés · <PathChip size={19}>JOURNAL.md</PathChip>
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l2a" size={21}>Le chat répond en français</CheckItem>
        <CheckItem id="l2b" size={21}>Aucune suggestion dans README.md</CheckItem>
        <CheckItem id="l2c" size={21}>Les 8 gestes réussis au clavier</CheckItem>
      </>
    }
    suivi="Points d’étape à 10 min (réglages) et à 25 min (gestes) : « Quel geste résiste ? »"
  >
    <WStep n={1}>Icône Copilot de la barre d’état : notez votre offre et vos quotas.</WStep>
    <WStep n={2}>Écrivez les 4 réglages de l’énoncé, puis vérifiez chacun par son effet visible.</WStep>
    <WStep n={3}>
      Ouvrez <PathChip size={20}>katas/02-raccourcis.js</PathChip> : gestes 1 à 8 dans l’ordre, sans souris.
    </WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <Frame mod={2} kind="qcm">
    <Title>QCM · Module 2 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous voulez garder seulement le début d’une suggestion. Quel geste ?" explain="Ctrl+→ accepte mot par mot : on s’arrête où l’on veut. Tab accepte tout, Échap refuse tout.">
        <QOpt>Tab, puis effacer la fin</QOpt>
        <QOpt ok>Ctrl+→, autant de fois que nécessaire</QOpt>
        <QOpt>Alt+], jusqu’à trouver la bonne longueur</QOpt>
      </QuizQ>
      <QuizQ q="Les suggestions inline vous gênent dans vos fichiers Markdown. Que faites-vous ?" explain="github.copilot.enable accepte un objet par langage : on coupe markdown sans toucher au reste. Le chat reste disponible.">
        <QOpt>Je désactive Copilot complètement</QOpt>
        <QOpt ok>« markdown »: false dans github.copilot.enable</QOpt>
        <QOpt>Je change de modèle dans le chat</QOpt>
      </QuizQ>
      <QuizQ q="Le mode Agent est grisé sur votre poste d’entreprise. Explication la plus probable ?" explain="Les offres Business et Enterprise permettent à l’administrateur de désactiver des fonctionnalités par politique. Vérifiez auprès de lui avant de chercher une panne.">
        <QOpt>L’extension est mal installée</QOpt>
        <QOpt ok>Une politique de l’organisation le désactive</QOpt>
        <QOpt>Le mode Agent n’existe que sur macOS</QOpt>
      </QuizQ>
      <QuizQ q="Pour comprendre un code sans risquer de le modifier, quel agent choisir ?" explain="Ask répond sans toucher aux fichiers. Agent peut modifier et exécuter ; Plan prépare un plan d’action.">
        <QOpt ok>Ask</QOpt>
        <QOpt>Agent</QOpt>
        <QOpt>Ctrl+I sur tout le fichier</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Divider, M2_Installer, M2_Licence, M2_Parametres, M2_Confidentialite, M2_Raccourcis, M2_Navigation, M2_PanneauChat, M2_Agents, M2_Lab, M2_Qcm];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 2 · 11:10

OBJECTIF — Annoncer un module très concret : à la fin, chaque poste est prêt et réglé.

DIRE — « Module 2 : installation et configuration. On installe, on vérifie la licence, on règle Copilot pour qu’il vous ressemble, et on apprend les raccourcis qui font gagner des heures. »

TRANSITION — « Installation, en cinq étapes. »`,
  `⏱ 6 min · INSTALLER (démo)

OBJECTIF — Faire installer et connecter Copilot sur chaque poste.

DIRE — « Copilot est désormais intégré à VS Code : il suffit de se connecter. Mettez VS Code à jour, cliquez sur l’icône Copilot en bas à droite ou ouvrez la vue Chat, connectez-vous avec GitHub : le navigateur s’ouvre, vous autorisez VS Code, vous revenez. L’extension Copilot Chat s’installe d’elle-même ; vérifiez-la dans la vue Extensions. Puis un premier essai : un commentaire dans un fichier JavaScript. »

ANIMATION — Faire en direct sur mon écran, puis point d’étape : « Qui voit le texte grisé ? Dites “oui” au micro. » Ceux qui ont déjà Copilot vérifient l’icône.

TRANSITION — « Quelle licence avez-vous activée ? »`,
  `⏱ 4 min · AUTHENTIFICATION & LICENCE

OBJECTIF — Que chacun sache quelle offre il utilise et pourquoi certaines fonctions peuvent manquer.

DIRE — « Trois cas. Pas de licence : Copilot Free s’active seul. Licence personnelle : Pro ou Pro+, sur votre compte. Licence d’entreprise : votre organisation vous attribue un siège ; connectez-vous avec le bon compte, c’est l’erreur la plus fréquente. Pour vérifier : l’icône de la barre d’état, le menu Comptes, et la page github.com/settings/copilot. Et si une fonctionnalité est grisée en entreprise, c’est souvent une politique de l’administrateur, pas une panne. »

TRANSITION — « Réglons maintenant votre environnement. »`,
  `⏱ 5 min · PARAMÉTRAGE (démo)

OBJECTIF — Présenter les réglages utiles, dans un fichier versionné.

DIRE — « Je préfère les réglages d’espace de travail : ils vivent dans le projet, toute l’équipe les partage. » → beat 1 « La langue : le chat répond en français. » → beat 2 « Les langages ciblés : on garde les suggestions pour le code, on les coupe pour la prose, Markdown et texte brut. » → beat 3 « Les suggestions de modification suivante : on les active, je vous les montre dans deux pages. » → beat 4 « Et tout cela existe aussi dans l’éditeur de paramètres : tapez “copilot” dans la recherche. »

TRANSITION — « Deux réglages de confiance, côté github.com. »`,
  `⏱ 4 min · CONFIDENTIALITÉ

OBJECTIF — Faire connaître les deux réglages de confiance et la règle d’or.

DIRE — « Premier réglage : les suggestions qui correspondent à du code public. Bloquer, et Copilot les écarte ; autoriser, et il les propose avec une référence vers le dépôt d’origine et sa licence. On en reparle au Module 8. Deuxième réglage : l’utilisation de vos données. Sur un compte personnel, vérifiez ce qui est coché ; en Business et Enterprise, vos données ne servent pas à l’entraînement. En entreprise, l’administrateur peut aussi exclure des fichiers. Mais la meilleure protection, c’est vous : pas de secret dans le code, pas de donnée réelle dans un prompt. »

ANIMATION — Montrer la page github.com/settings/copilot sur mon compte, sans s’y attarder.

TRANSITION — « Passons au clavier. »`,
  `⏱ 4 min · RACCOURCIS

OBJECTIF — Présenter les 8 gestes que l’atelier va entraîner.

DIRE — « Huit raccourcis. À gauche, le texte grisé : Tab accepte, Échap refuse, Ctrl+flèche droite accepte mot par mot, Alt+crochet passe d’une proposition à l’autre. À droite, le chat : Ctrl+I pour une modification sur place, Ctrl+Alt+I pour la vue Chat, Ctrl+N pour une nouvelle conversation. Et Alt+antislash pour forcer une suggestion. Sur un clavier AZERTY, certains crochets sont capricieux : on peut les réattribuer. »

TRANSITION — « Regardons la navigation en détail. »`,
  `⏱ 4 min · NAVIGATION (démo)

OBJECTIF — Montrer les alternatives, l’acceptation partielle et les suggestions de modification suivante.

DIRE — « Quand Copilot a plusieurs idées, survolez le texte grisé : une petite barre affiche 2 sur 3 et des flèches. Ici, la deuxième proposition gère la division par zéro : c’est elle que je veux. » → beat 1 « L’autre famille, ce sont les suggestions de modification suivante. Je renomme un paramètre : une flèche apparaît dans la gouttière, là où il faut répercuter le changement. Tab pour y aller, Tab pour appliquer. » → beat 2 « Dans les deux cas, rien n’est écrit sans votre Tab. »

TRANSITION — « Faisons le tour du panneau Chat. »`,
  `⏱ 5 min · PANNEAU CHAT (démo)

OBJECTIF — Rendre chacun autonome dans la vue Chat.

DIRE — « Six zones. » → beat 1 « Le plus : une nouvelle conversation. Un sujet, une conversation : sinon le contexte s’encombre. » → beat 2 « L’historique, pour reprendre une session. » → beat 3 « Ajouter du contexte : un fichier, la sélection, tout le code du projet avec #codebase. C’est ce que le modèle verra. » → beat 4 « Le choix de l’agent : Ask, Plan ou Agent. » → beat 5 « Le choix du modèle : Auto par défaut. » → beat 6 « Et les commandes slash : explain, fix, tests, doc. »

ANIMATION — Montrer chaque zone dans mon VS Code en parallèle.

TRANSITION — « Quatre façons de parler à Copilot : quand utiliser laquelle ? »`,
  `⏱ 4 min · ASK, PLAN, AGENT, CTRL+I

OBJECTIF — Donner la règle de choix pour un débutant.

DIRE — « Ask répond, sans rien modifier : idéal pour comprendre. Ctrl+I modifie votre sélection sur place, avec un diff à relire. Plan prépare un plan sans écrire de code, avant une tâche plus large. Agent modifie des fichiers et lance des commandes : puissant, mais il agit, donc permissions, diff et tests. Pendant deux jours, on vivra surtout en Ask et en Ctrl+I, et on verra l’Agent ponctuellement. »

TRANSITION — « À vous : trente minutes pour régler votre poste et prendre les réflexes. »`,
  `⏱ 30 min · ATELIER 2 (individuel)

OBJECTIF — Chaque poste est configuré et versionné ; les 8 gestes deviennent des réflexes.

DIRE — « Trente minutes. Énoncé dans ateliers/atelier-02-configuration. D’abord la licence, puis les quatre réglages, chacun vérifié par son effet, puis les huit gestes dans le kata, sans souris. »

ANIMATION — Coller le bloc settings.json dans le clavardage. Points d’étape à 10 min (« Le chat vous répond en français ? ») et 25 min (« Quel geste résiste ? »). AZERTY : montrer la réattribution d’un raccourci en partage d’écran.

TRANSITION — « QCM, puis on comprend vraiment les suggestions. »`,
  `⏱ 5 min · QCM MODULE 2 (vote oral)

OBJECTIF — Vérifier gestes et réglages.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Module 3 : comprendre ce que Copilot voit, pour comprendre ce qu’il propose. »`,
];
// @@NOTES-END
