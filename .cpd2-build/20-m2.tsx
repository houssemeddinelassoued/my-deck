// ─── Module 2 · Installation et configuration ───────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Installer, configurer,
        <br />
        choisir
      </>
    }
    sub="Un poste prêt, quatre façons de travailler, et le bon modèle au bon prix."
    dur="J1 · 11:10 – 12:30"
    labs={<Tag tone="green" size={19}>Atelier 2 · un besoin, quatre modes</Tag>}
  >
    <SecItem n={1}>Installer, se connecter, comprendre sa licence et ses crédits</SecItem>
    <SecItem n={2}>Paramétrer, protéger ses données, les raccourcis essentiels</SecItem>
    <SecItem n={3}>Inline, Ask, Plan, Agent : quatre façons de travailler</SecItem>
    <SecItem n={4}>Session, harnais, rôle et modèle : qui fait quoi</SecItem>
    <SecItem n={5}>Choisir son modèle et rester économe</SecItem>
  </Section>
);

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
      <span style={{ color: '#7C86A8' }}>{'// Parafo · src/journal.js'}</span>
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
    <Lede>Copilot est intégré à VS Code : rien à installer, on se connecte avec son compte GitHub.</Lede>
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
      <M2Step n={4} title="Choisir la session Copilot" d={400}>
        Vue Chat, zone de saisie : session « Copilot », modèle « Auto ».
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
    <Title>Les 8 raccourcis essentiels</Title>
    <Lede>Windows et Linux. Sur macOS : Ctrl devient Cmd, Alt devient Option.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      <M2Key keys={<Kbd>Tab</Kbd>} label="Accepter la suggestion" sub="tout le texte grisé" tone="green" d={100} />
      <M2Key keys={<Kbd>Ctrl+I</Kbd>} label="Chat en ligne" sub="demander une modification sur place" tone="violet" d={150} />
      <M2Key keys={<Kbd>Échap</Kbd>} label="Refuser" sub="et continuer à taper" tone="coral" d={200} />
      <M2Key keys={<Kbd>Ctrl+Alt+I</Kbd>} label="Vue Chat" sub="converser, expliquer, planifier" tone="violet" d={250} />
      <M2Key keys={<Kbd>Ctrl+→</Kbd>} label="Accepter mot par mot" sub="garder le début seulement" tone="green" d={300} />
      <M2Key keys={<Kbd>Ctrl+N</Kbd>} label="Nouvelle conversation" sub="dans la vue Chat : repartir d’un contexte propre" tone="violet" d={350} />
      <M2Key keys={<><Kbd>Alt+]</Kbd><Kbd>Alt+[</Kbd></>} label="Suggestion suivante / précédente" sub="ou survol : barre « 1/3 »" tone="blue" d={400} />
      <M2Key keys={<Kbd>Tab</Kbd>} label="Suivre la flèche (NES)" sub="aller à la modification suivante, puis l’appliquer" tone="blue" d={450} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="yellow" icon="pointer" title="Clavier AZERTY" size={23} cls={A.in} style={dl(700)}>
        Alt+] ne répond pas ? Survolez le texte grisé, ou réattribuez le raccourci : Ctrl+K Ctrl+S › « inline suggestion ».
      </Callout>
    </div>
  </Frame>
);

// ─── Quatre façons de travailler ────────────────────────────────────────────
const M2Way = ({ icon, tone, title, who, cost, when, d }: { icon: IconName; tone: Tone; title: string; who: ReactNode; cost: ReactNode; when: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={48} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{who}</div>
    <div style={{ fontSize: 19, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: STRONG[tone] }}>Coût · </strong>
      {cost}
    </div>
    <div style={{ fontSize: 19, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: STRONG[tone] }}>Quand · </strong>
      {when}
    </div>
  </div>
);

const M2_Modes: Page = () => (
  <Frame mod={2}>
    <Title>Quatre façons de travailler avec Copilot</Title>
    <Lede>Du plus léger au plus autonome. Plus Copilot agit seul, plus vous devez cadrer… et relire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
      <M2Way icon="code" tone="green" title="Inline" who={<>Vous tapez, il <strong>complète</strong> en gris. NES propose la modification suivante.</>} cost="aucun crédit IA" when="une ligne, une petite fonction" d={100} />
      <M2Way icon="chat" tone="teal" title="Ask" who={<>Il <strong>répond</strong> et explique. Il ne touche à aucun fichier.</>} cost="une requête" when="comprendre, explorer, choisir" d={200} />
      <M2Way icon="map" tone="blue" title="Plan" who={<>Il lit le code et <strong>propose un plan</strong>. Vous le corrigez avant tout changement.</>} cost="une à quelques requêtes" when="une tâche en plusieurs étapes" d={300} />
      <M2Way icon="bot" tone="violet" title="Agent" who={<>Il <strong>édite</strong>, lance des commandes, lit le résultat, recommence.</>} cost="plusieurs requêtes par tâche" when="une tâche bornée par des tests" d={400} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="violet" icon="pointer" title="Et Ctrl+I ?" size={23} cls={A.in} style={dl(600)}>
        Le chat en ligne : une demande sur la sélection, un diff à accepter ou ignorer. Pratique pour une seule fonction.
      </Callout>
      <Callout tone="yellow" icon="bulb" title="La règle" size={23} cls={A.in} style={dl(750)}>
        Le plus petit mode qui suffit. Vous le vérifierez vous-même à l’Atelier 2.
      </Callout>
    </div>
  </Frame>
);

// ─── Session, harnais, rôle, modèle ─────────────────────────────────────────
const M2Layer = ({ tone, label, ex, children, d }: { tone: Tone; label: string; ex: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: 20, alignItems: 'center', background: T[tone].bg, borderRadius: 16, padding: '16px 22px', boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{label}</div>
    <div>
      <div style={{ fontSize: 22, color: C.ink, lineHeight: 1.35 }}>{children}</div>
      <div style={{ marginTop: 4, fontFamily: mono, fontSize: 18, color: T[tone].fg }}>{ex}</div>
    </div>
  </div>
);

const M2Drop = ({ label, value, tone }: { label: string; value: string; tone: Tone }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E98BC' }}>{label}</span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#232B5A', borderRadius: 8, padding: '6px 12px', fontSize: 19, color: '#fff', boxShadow: `inset 0 0 0 1.5px ${STRONG[tone]}` }}>
      {value} <span style={{ color: '#8E98BC' }}>▾</span>
    </span>
  </div>
);

const M2_Session: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Session, harnais, rôle, modèle : quatre réglages différents</Title>
    <Lede>On les confond souvent. Dans la zone de saisie du Chat, ce sont quatre listes distinctes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1040, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Layer tone="navy" label="Session · harnais" ex="Copilot · Local · Claude · Codex · Cloud" d={100}>
        <strong>Qui fait tourner</strong> la boucle de l’agent : outils, contexte, permissions.
      </M2Layer>
      <M2Layer tone="violet" label="Rôle" ex="Ask · Plan · Agent · vos agents" d={200}>
        <strong>Ce qu’on lui demande d’être</strong> : répondre, planifier, agir, ou un rôle que vous écrivez.
      </M2Layer>
      <M2Layer tone="blue" label="Modèle" ex="Auto · rapide · avancé" d={300}>
        <strong>Le cerveau</strong> qui prédit la suite. Il change la qualité et le coût, pas les droits.
      </M2Layer>
      <M2Layer tone="teal" label="Environnement" ex="votre poste · copie de travail · cloud" d={400}>
        <strong>Où s’exécutent</strong> les commandes et où vont les modifications.
      </M2Layer>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1220, top: 262, width: 580, background: '#0F1530', borderRadius: 18, padding: '22px 24px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(300) }}>
      <div style={{ fontSize: 19, color: '#AEB9E6', fontStyle: 'italic', marginBottom: 16 }}>Décris ce que tu veux faire…</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <M2Drop label="Session" value="Copilot" tone="navy" />
        <M2Drop label="Rôle" value="Agent" tone="violet" />
        <M2Drop label="Modèle" value="Auto" tone="blue" />
        <M2Drop label="Permissions" value="Manuelles" tone="coral" />
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1220, top: 560, width: 580 }}>
      <Callout tone="green" icon="checkCircle" title="Nos réglages pour deux jours" size={23}>
        Session <strong>Copilot</strong>, modèle <strong>Auto</strong>, permissions <strong>manuelles</strong>. Le rôle change selon l’atelier.
      </Callout>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(700) }}>
      Le harnais Copilot est le même dans VS Code, le CLI et l’app : nous l’ouvrirons au Module 5.
    </Hint>
  </Frame>
);

// ─── Trois fenêtres sur la même session ─────────────────────────────────────
const M2_Fenetres: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Trois endroits pour travailler avec l’agent</Title>
    <Lede>Aujourd’hui on découvre ; la fenêtre Agents et l’app servent vraiment au Module 8.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="chat" tone="teal" title="La vue Chat" size={23} pad={26} cls={A.in} style={dl(100)}>
        Dans l’éditeur, à côté du code : <Kbd>Ctrl+Alt+I</Kbd>. Une session à la fois, sous vos yeux.
        <div style={{ marginTop: 14, fontSize: 20, color: C.muted }}>Notre terrain des ateliers 1 à 7.</div>
      </Card>
      <Card icon="layers" tone="violet" title="La fenêtre Agents" size={23} pad={26} cls={A.in} style={dl(220)}>
        « Open in Agents » dans la barre de titre : plusieurs sessions en parallèle, chacune dans sa copie de travail, revue des changements.
        <div style={{ marginTop: 14, fontSize: 20, color: C.muted }}>Atelier 8 : deux tickets en même temps.</div>
      </Card>
      <Card icon="phone" tone="green" title="L’app GitHub Copilot" size={23} pad={26} cls={A.in} style={dl(340)}>
        Hors de l’éditeur : lancer, suivre et reprendre une session. Tous les plans, Free compris.
        <div style={{ marginTop: 14, fontSize: 20, color: C.muted }}>Bonus de l’Atelier 8 : reprendre une session.</div>
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout tone="blue" icon="server" title="Les sessions continuent sans vous" size={24} cls={A.in} style={dl(550)}>
        L’Agent Host garde une session active même fenêtre fermée. Vous la reprenez où vous voulez, avec le même historique.
      </Callout>
    </div>
  </Frame>
);

// ─── Choisir son modèle ─────────────────────────────────────────────────────
const M2Model = ({ name, sub, tier, tone, on }: { name: string; sub: string; tier: string; tone: Tone; on?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: on ? '#232B5A' : 'transparent' }}>
    <span style={{ width: 20, color: '#9BE29B', fontSize: 20 }}>{on ? '✓' : ''}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 22, color: '#fff', fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: 17, color: '#8E98BC' }}>{sub}</div>
    </div>
    <Tag tone={tone} size={16}>
      {tier}
    </Tag>
  </div>
);

const M2Rule = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="blue" size={42} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Modele: Page = () => (
  <Frame mod={2}>
    <Title>Choisir son modèle : commencer par Auto</Title>
    <Lede>Le modèle change la qualité et le coût d’une réponse. Le choix se fait dans la zone de saisie du Chat.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 720, background: '#0F1530', borderRadius: 18, padding: '18px 16px', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)', ...dl(100) }}>
      <div style={{ padding: '0 16px 10px', fontSize: 17, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E98BC' }}>Sélecteur de modèle (exemple)</div>
      <M2Model name="Auto" sub="Copilot choisit selon la tâche et la disponibilité" tier="recommandé" tone="green" on />
      <M2Model name="Un modèle rapide" sub="questions courtes, petites modifications" tier="Low" tone="teal" />
      <M2Model name="Un modèle équilibré" sub="la plupart des tâches de code" tier="Medium" tone="blue" />
      <M2Model name="Un modèle de raisonnement avancé" sub="longue tâche difficile, architecture" tier="High" tone="coral" />
      <div style={{ padding: '12px 16px 0', fontSize: 18, color: '#AEB9E6' }}>Au survol : coût par type de token et niveau Low / Medium / High.</div>
    </div>
    <div style={{ position: 'absolute', left: 920, top: 270, width: 880, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M2Rule n={1} title="Auto par défaut" d={200}>
        Il couvre les besoins d’un débutant et évite de payer un modèle avancé pour une question simple.
      </M2Rule>
      <M2Rule n={2} title="Changer pour une raison mesurée" d={320}>
        Une tâche échoue deux fois ? Essayez un autre modèle sur la <strong>même</strong> demande, et comparez.
      </M2Rule>
      <M2Rule n={3} title="L’effort de réflexion se paie" d={440}>
        Plus de réflexion = plus de tokens, plus lent, plus cher. Le réglage par défaut suffit presque toujours.
      </M2Rule>
      <M2Rule n={4} title="Votre organisation peut restreindre la liste" d={560}>
        En Business ou Enterprise, l’administrateur choisit les modèles disponibles.
      </M2Rule>
    </div>
  </Frame>
);

// ─── Lire un classement de modèles : benchlm.ai ─────────────────────────────
const BENCH_URL = 'https://benchlm.ai/coding';
const benchImg = new URL('./assets/benchlm/benchlm-coding-2026-11-07.png', import.meta.url).href;

const M2Mark = ({ n, x, y }: { n: number; x: number; y: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 999, background: C.coral, color: '#fff', border: '3px solid #fff', boxShadow: '0 6px 16px -6px rgba(180,60,40,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 22 }}>
    {n}
  </div>
);

const M2Rep = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <Num n={n} tone="coral" size={36} style={{ marginTop: 2 }} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_BenchLM: Page = () => {
  const [copie, setCopie] = useState(false);
  return (
    <Frame mod={2} kind="demo" beats={4}>
      <Title>Lire un classement de modèles : benchlm.ai</Title>
      <Lede>Un site indépendant qui agrège des tests publics. Utile pour choisir quoi essayer, pas pour décider à votre place.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000, borderRadius: 14, overflow: 'hidden', boxShadow: SHADOW, ...dl(100) }}>
        <img src={benchImg} alt="Classement Coding de benchlm.ai, 6 premiers modèles" style={{ display: 'block', width: 1000, height: 532 }} />
      </div>
      <M2Mark n={1} x={835} y={343} />
      <M2Mark n={2} x={651} y={343} />
      <M2Mark n={3} x={598} y={343} />
      <M2Mark n={4} x={295} y={548} />
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 806, width: 1000, fontSize: 18, color: C.muted, ...dl(400) }}>
        Capture du 7 novembre 2026, classement « Coding ». Site tiers : les chiffres changent chaque semaine.
      </div>
      <div style={{ position: 'absolute', left: 1180, top: 266, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M2Rep n={1} title="Score et rang">
          une moyenne de tests de code publics, pas votre projet
        </M2Rep>
        <M2Rep n={2} title="Prix par million de tokens">
          entrée / sortie : l’écart va de 1 à 5 entre voisins
        </M2Rep>
        <M2Rep n={3} title="Fenêtre de contexte">
          combien de code il peut garder en tête
        </M2Rep>
        <M2Rep n={4} title="Niveau de preuve">
          « Supported » mesuré, « Estimated » extrapolé
        </M2Rep>
        <div className={A.fade} style={{ display: 'flex', gap: 14, marginTop: 6, ...dl(500) }}>
          <Btn icon="globe" size={21} onClick={() => window.open(BENCH_URL, '_blank', 'noopener')}>
            Ouvrir benchlm.ai ↗
          </Btn>
          <Btn
            icon={copie ? 'check' : 'link'}
            tone={copie ? 'green' : 'blue'}
            ghost={!copie}
            size={21}
            onClick={() => {
              void copierTexte(BENCH_URL).then((ok) => {
                if (!ok) return;
                setCopie(true);
                window.setTimeout(() => setCopie(false), 2200);
              });
            }}
          >
            {copie ? 'Lien copié !' : 'Copier le lien'}
          </Btn>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 866, width: 1680 }}>
        <Callout tone="yellow" icon="scale" title="Le classement oriente, votre test sur Parafo décide" size={22} cls={b.on(4)}>
          Dans Copilot, commencez par Auto ; un modèle avancé sur une longue session coûte beaucoup plus de crédits.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Être économe en crédits ────────────────────────────────────────────────
const M2Eco = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={22} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M2_Econome: Page = () => (
  <Frame mod={2}>
    <Title>Être économe en crédits : six réflexes</Title>
    <Lede>Les mêmes réflexes donnent aussi de meilleures réponses : moins de bruit dans le contexte, moins d’erreurs.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <M2Eco icon="gauge" tone="green" title="Modèle Auto" d={100}>
        Un modèle avancé seulement quand une tâche l’exige, et pour cette tâche-là.
      </M2Eco>
      <M2Eco icon="plus" tone="blue" title="Une session par sujet" d={180}>
        Nouveau sujet, nouvelle session : l’historique ne se paie pas à chaque requête.
      </M2Eco>
      <M2Eco icon="target" tone="teal" title="Un contexte ciblé" d={260}>
        Citez les deux fichiers utiles plutôt que tout le dépôt.
      </M2Eco>
      <M2Eco icon="map" tone="violet" title="Plan avant Agent" d={340}>
        Un plan relu évite trois allers-retours de l’agent dans la mauvaise direction.
      </M2Eco>
      <M2Eco icon="tool" tone="navy" title="Peu d’outils actifs" d={420}>
        Chaque outil disponible occupe du contexte à chaque tour de boucle (Module 5).
      </M2Eco>
      <M2Eco icon="code" tone="pink" title="L’inline est gratuit" d={500}>
        Pour une ligne ou une petite fonction, le texte grisé ne consomme aucun crédit.
      </M2Eco>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, ...dl(800) }}>
      Mesurer : survol du sélecteur de modèle, journaux de l’agent. Notez vos chiffres dans JOURNAL.md à chaque atelier.
    </Hint>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Lab: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Un même besoin, quatre modes"
    defi="modes"
    who="Individuel · 30 min"
    objective={
      <>
        Créer les <strong>réglages du projet</strong>, puis écrire <Ic>normaliserEmail</Ic> quatre fois : inline, Ask, Plan, Agent. <strong>Mesurer</strong> ce que chaque mode coûte et rapporte.
      </>
    }
    where={
      <>
        <PathChip size={19}>.vscode/settings.json</PathChip>
        <br />
        <PathChip size={19}>katas/02-quatre-modes/</PathChip>
        <br />
        <PathChip size={19}>JOURNAL.md</PathChip> · le tableau rempli
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l2a" size={21}>Au moins 2 versions vertes (test:atelier2)</CheckItem>
        <CheckItem id="l2b" size={21}>Temps, tests et crédits notés par mode</CheckItem>
        <CheckItem id="l2c" size={21}>Le mode choisi, et pourquoi</CheckItem>
      </>
    }
    suivi="Points d’étape à 10 et 20 min : « Quel mode en êtes-vous ? »"
  >
    <WStep n={1}>
      Créez <Ic>.vscode/settings.json</Ic> (le texte à copier est dans le Chat), puis cherchez « copilot » dans les réglages.
    </WStep>
    <WStep n={2}>
      Inline, Ask, Plan, puis Agent : un fichier par mode. Relisez le plan avant de le lancer ; observez chaque approbation de l’agent.
    </WStep>
    <WStep n={3}>
      <Ic>npm run test:atelier2</Ic>, puis le tableau de <Ic>JOURNAL.md</Ic>.
    </WStep>
    <TpBonus>la version Ask avec un autre modèle : comparez résultat et coût au survol.</TpBonus>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <Frame mod={2} kind="qcm">
    <Title>QCM · Module 2 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Quel mode répond sans modifier aucun fichier ?" explain="Ask explique et propose, sans toucher au code. Ctrl+I et Agent modifient des fichiers (après votre accord pour Ctrl+I).">
        <QOpt ok>Ask</QOpt>
        <QOpt>Agent</QOpt>
        <QOpt>Ctrl+I, le chat en ligne</QOpt>
      </QuizQ>
      <QuizQ q="Le harnais, c’est…" explain="Le harnais fait tourner la boucle de l’agent : il fournit les outils, gère le contexte et applique les permissions. Le modèle, lui, prédit ; le rôle dit ce qu’on attend.">
        <QOpt>Le modèle de langage choisi dans le sélecteur</QOpt>
        <QOpt ok>Le moteur qui fait tourner l’agent : outils, contexte, permissions</QOpt>
        <QOpt>Le mode Ask, Plan ou Agent</QOpt>
      </QuizQ>
      <QuizQ q="Pour débuter, quels réglages choisir ?" explain="Auto couvre les besoins courants au meilleur coût ; des permissions manuelles vous montrent chaque action de l’agent avant qu’elle ait lieu.">
        <QOpt>Le modèle le plus cher, pour être tranquille</QOpt>
        <QOpt>Tout approuver automatiquement, pour aller vite</QOpt>
        <QOpt ok>Modèle Auto et permissions manuelles</QOpt>
      </QuizQ>
      <QuizQ q="Un classement comme benchlm.ai…" explain="Il agrège des tests publics : il aide à choisir quels modèles essayer. Seul un essai sur votre code, avec vos tests, dit lequel convient.">
        <QOpt ok>Oriente le choix ; un test sur votre code décide</QOpt>
        <QOpt>Désigne le meilleur modèle pour votre projet</QOpt>
        <QOpt>Remplace la relecture du code généré</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M2_Dejeuner: Page = () => <BreakPage mod={2} title="Bon appétit !" back="Reprise à 13 h 30 : bien parler à Copilot, prompting et contexte." minutes={60} icon="smile" />;

// @@PAGES-BEGIN
export const __pages = [M2_Divider, M2_Installer, M2_Licence, M2_Parametres, M2_Confidentialite, M2_Raccourcis, M2_Modes, M2_Session, M2_Fenetres, M2_Modele, M2_BenchLM, M2_Econome, M2_Lab, M2_Qcm, M2_Dejeuner];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 2 · 11:10

OBJECTIF — Annoncer le module : un poste prêt, quatre façons de travailler, le bon modèle.

DIRE — « Module 2. On termine l’installation, on règle Copilot, et surtout on découvre les quatre façons de travailler avec lui : le texte grisé, la question, le plan, et l’agent. Puis une question qui coûte de l’argent : quel modèle choisir ? »

TRANSITION — « D’abord, se connecter. »`,
  `⏱ 6 min · INSTALLER (démo)

OBJECTIF — Faire installer et connecter Copilot sur chaque poste.

DIRE — « Copilot est désormais intégré à VS Code : il suffit de se connecter. Mettez VS Code à jour, cliquez sur l’icône Copilot en bas à droite ou ouvrez la vue Chat, connectez-vous avec GitHub : le navigateur s’ouvre, vous autorisez VS Code, vous revenez. Dans la vue Chat, vérifiez la session : Copilot, et le modèle : Auto. Puis un premier essai : un commentaire dans un fichier JavaScript. »

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

OBJECTIF — Donner les 8 gestes clavier sur une seule page.

DIRE — « Huit raccourcis. À gauche, le texte grisé : Tab accepte, Échap refuse, Ctrl+flèche droite accepte mot par mot, Alt+crochet propose la suggestion suivante. Et quand vous modifiez une ligne, une flèche apparaît dans la marge : c’est la suggestion de modification suivante, on y va avec Tab, on l’applique avec Tab. À droite, le Chat : Ctrl+I sur place, Ctrl+Alt+I pour la vue Chat, et Ctrl+N pour repartir d’une session propre. »

ANIMATION — Clavier AZERTY : Alt+crochet ne répond pas toujours ; survoler le texte grisé ou réattribuer le raccourci.

TRANSITION — « Ces raccourcis servent au premier mode. Il y en a quatre. »`,
  `⏱ 5 min · QUATRE FAÇONS DE TRAVAILLER

OBJECTIF — Distinguer inline, Ask, Plan et Agent par ce qu’ils font, ce qu’ils coûtent, et quand les utiliser.

DIRE — « Quatre façons de travailler, du plus léger au plus autonome. Inline : vous tapez, il complète ; ça ne coûte aucun crédit. Ask : il répond, il explique, il ne touche à rien. Plan : il lit le code et vous propose un plan, que vous corrigez avant le moindre changement. Agent : il modifie les fichiers, lance des commandes, regarde le résultat et recommence ; il vous demande la permission pour ce qui est risqué. »

DIRE — « La règle : le plus petit mode qui suffit. Et plus Copilot agit seul, plus il faut cadrer et relire. Vous allez le mesurer vous-même à l’atelier. »

TRANSITION — « Dans la zone de saisie, il y a d’autres listes : à quoi servent-elles ? »`,
  `⏱ 3 min · SESSION, HARNAIS, RÔLE, MODÈLE

OBJECTIF — Séparer quatre réglages souvent confondus, et fixer ceux de la formation.

DIRE — « Quatre listes, quatre réglages différents. La session, c’est le harnais : le moteur qui fait tourner l’agent, ses outils, son contexte, ses permissions. Copilot est le harnais par défaut depuis octobre ; Local est l’ancien moteur de VS Code. Le rôle : Ask, Plan, Agent, ou un agent que vous écrirez demain. Le modèle : le cerveau qui prédit la suite ; il change la qualité et le coût, pas les droits. Et l’environnement : où s’exécutent les commandes. »

→ beat 1 « Pour deux jours : session Copilot, modèle Auto, permissions manuelles. Le rôle, lui, changera selon l’atelier. »

TRANSITION — « Et cette session, on peut la suivre à plusieurs endroits. »`,
  `⏱ 3 min · TROIS ENDROITS (démo rapide)

OBJECTIF — Montrer la vue Chat, la fenêtre Agents et l’app Copilot, sans s’y attarder.

DIRE — « Trois endroits pour travailler avec l’agent. La vue Chat, dans l’éditeur : c’est là que nous ferons presque tout. La fenêtre Agents : plusieurs sessions en parallèle, chacune dans sa copie de travail ; nous l’utiliserons au Module 8. Et l’app GitHub Copilot, hors de l’éditeur, sur tous les plans, Free compris. Une session continue même si vous fermez la fenêtre : vous la reprenez où vous voulez. »

ANIMATION — En partage d’écran : ouvrir la fenêtre Agents (« Open in Agents ») 20 secondes, puis la refermer.

TRANSITION — « Dernier réglage, et pas le moindre : le modèle. »`,
  `⏱ 4 min · CHOISIR SON MODÈLE

OBJECTIF — Installer le réflexe Auto, et les raisons de changer.

DIRE — « Le sélecteur de modèle. Au survol, VS Code affiche le coût par type de token et un niveau : Low, Medium, High. Quatre règles. Un : Auto par défaut, Copilot choisit selon la tâche. Deux : on change pour une raison mesurée, par exemple une tâche qui échoue deux fois ; et on compare sur la même demande. Trois : l’effort de réflexion se paie, en tokens et en temps. Quatre : en entreprise, l’administrateur peut restreindre la liste. »

ANIMATION — Je n’affiche volontairement pas de noms de modèles : la liste change tous les mois. Montrer la vraie liste dans mon VS Code si on me le demande.

TRANSITION — « Comment savoir lequel essayer ? Il existe des classements. »`,
  `⏱ 4 min · BENCHLM.AI (capture annotée + démo)

OBJECTIF — Apprendre à lire un classement de modèles, et à s’en méfier.

DIRE — « benchlm.ai est un site indépendant qui agrège des tests publics de modèles. Ici, le classement Coding. »

→ beat 1 « Un : le score et le rang. C’est une moyenne de tests publics, pas votre projet. »

→ beat 2 « Deux : le prix, par million de tokens, en entrée et en sortie. Entre deux voisins du classement, il peut varier de un à cinq. »

→ beat 3 « Trois : la fenêtre de contexte, ce que le modèle peut garder en tête. »

→ beat 4 « Quatre : le niveau de preuve. Supported, c’est mesuré ; Estimated, c’est extrapolé. Et la conclusion : le classement oriente, votre test sur Parafo décide. »

ACTION — Cliquer « Ouvrir benchlm.ai » : filtrer Coding, comparer deux modèles présents dans le sélecteur Copilot, ouvrir la page « GitHub Copilot » du site (offres et limites). Coller le lien dans le Chat avec « Copier le lien ».

ANIMATION — Vote oral : « A, B ou C : quel modèle pour générer les tests de journal.js ? » Réponse attendue : Auto d’abord ; un modèle plus fort si les tests échouent deux fois.

ATTENTION — Site tiers, données changeantes : refaire la capture avant chaque session (VERIFS-AVANT-SESSION.md).

TRANSITION — « Ces crédits, comment les économiser ? »`,
  `⏱ 2 min · ÊTRE ÉCONOME

OBJECTIF — Donner six réflexes d’économie, qui améliorent aussi les réponses.

DIRE — « Six réflexes. Modèle Auto. Une session par sujet : l’historique se renvoie à chaque requête. Un contexte ciblé : deux fichiers utiles plutôt que tout le dépôt. Un plan avant l’agent. Peu d’outils actifs, on verra pourquoi au Module 5. Et l’inline est gratuit. Bonus : ces réflexes donnent aussi de meilleures réponses, parce qu’il y a moins de bruit dans le contexte. »

TRANSITION — « À vous : trente minutes, un besoin, quatre modes. »`,
  `⏱ 30 min · ATELIER 2 (individuel) · 11:55

OBJECTIF — Créer les réglages du projet ; vivre les quatre modes sur le même besoin et mesurer.

DIRE — « Trente minutes. D’abord le fichier de réglages : je colle son contenu dans le Chat. Ensuite, la même petite fonction, normaliserEmail, quatre fois : en inline, en Ask, en Plan, en Agent. Un fichier par mode. À la fin, un tableau dans votre journal : temps, tests verts, crédits. »

ACTION — Coller dans le Chat le contenu de .vscode/settings.json (README de l’atelier, étape 1).

ANIMATION — Points d’étape à 10 et 20 min : « Quel mode en êtes-vous ? » Pièges : la regex « parfaite » du mode Ask qui accepte alice@exemple ; « Toujours autoriser » donné trop vite en mode Agent ; un plan qui veut modifier inline.js aussi. Crédits comptés : faire Plan et Agent en dernier.

TRANSITION — « QCM, puis déjeuner. »`,
  `⏱ 5 min · QCM MODULE 2 (vote oral)

OBJECTIF — Vérifier les modes, le harnais, les réglages par défaut et la lecture d’un classement.

DIRE — « Quatre questions, votez à voix haute par la lettre. Et une question pour vous : quel mode avez-vous préféré à l’atelier ? »

TRANSITION — « Bon appétit ! »`,
  `⏱ 60 min · DÉJEUNER · 12:30

DIRE — « Bon appétit ! Reprise à 13 h 30 : nous apprendrons à bien parler à Copilot. »`,
];
// @@NOTES-END
