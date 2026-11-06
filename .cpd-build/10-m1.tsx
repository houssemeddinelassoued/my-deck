// ─── Module 1 · Introduction à GitHub Copilot ───────────────────────────────

const M1_Divider: Page = () => (
  <Section
    n={1}
    title={
      <>
        Introduction à
        <br />
        GitHub Copilot
      </>
    }
    sub="D’où il vient, comment il fonctionne, ce qu’il sait faire… et ce qu’il ne sait pas faire."
    dur="J1 · 9:30 – 10:55"
    labs={<Tag tone="green" size={19}>Atelier 1 · premier contact</Tag>}
  >
    <SecItem n={1}>80 ans d’IA, cinq ans de Copilot</SecItem>
    <SecItem n={2}>Sous le capot : neurones, entraînement, tokens, Transformer</SecItem>
    <SecItem n={3}>Génération probabiliste, hallucinations, agents</SecItem>
    <SecItem n={4}>Prompt, contexte, harnais · Copilot, offres et nouveautés 2026</SecItem>
    <SecItem n={5}>Avantages, limites et démonstration en direct</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── Histoire ───────────────────────────────────────────────────────────────
const M1Mile = ({ x, year, title, sub, tone, d, now = false }: { x: number; year: string; title: string; sub: string; tone: Tone; d: number; now?: boolean }) => (
  <div className={now ? b.pop(1) : A.in} style={{ position: 'absolute', left: x - 125, top: 380, width: 250, textAlign: 'center', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>{year}</div>
    <div style={{ margin: '18px auto 0', width: 30, height: 30, borderRadius: 99, background: STRONG[tone], boxShadow: `0 0 0 8px ${T[tone].bg}` }} />
    <div style={{ marginTop: 26, fontSize: 25, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{sub}</div>
  </div>
);

const M1_Histoire: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Cinq ans d’histoire : de l’autocomplétion aux agents</Title>
    <Lede>Copilot est né d’un partenariat GitHub × OpenAI. Il a changé de nature chaque année.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 160, top: 467, width: 1600, height: 6, borderRadius: 3, background: G.brand, ...dl(100) }} />
    <M1Mile x={250} year="2021" title="Préversion" sub="Modèle OpenAI Codex : complétion de code « ghost text »" tone="navy" d={200} />
    <M1Mile x={530} year="2022" title="Disponible pour tous" sub="Abonnement individuel, puis offre entreprise" tone="blue" d={320} />
    <M1Mile x={810} year="2023" title="Copilot Chat" sub="On converse avec son code dans l’éditeur" tone="teal" d={440} />
    <M1Mile x={1090} year="2024" title="Choix du modèle" sub="Plusieurs fournisseurs · offre gratuite Copilot Free" tone="green" d={560} />
    <M1Mile x={1370} year="2025" title="Mode Agent" sub="Modifications multi-fichiers, agent cloud, revue de PR" tone="violet" d={680} />
    <M1Mile x={1650} year="2026" title="Fenêtre Agents" sub="Sessions cloud, automatisations, crédits IA" tone="coral" d={800} now />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout tone="blue" icon="bulb" title="Ce qui ne change pas" size={25}>
        Sous chaque nouveauté, le même moteur : un modèle de langage qui <strong>prédit</strong> du code plausible. Et la même règle : vous relisez.
      </Callout>
    </div>
  </Frame>
);

// ─── Fonctionnement ─────────────────────────────────────────────────────────
const M1Stage = ({ x, n, icon, tone, title, sub, beat }: { x: number; n: number; icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ position: 'absolute', left: x, top: 300, width: 250, height: 380, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={56} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: T[tone].bd }}>{n}</span>
    </div>
    <div style={{ marginTop: 18, fontSize: 25, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{sub}</div>
  </div>
);

const M1_Fonctionnement: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Ce qui se passe entre votre clavier et la suggestion</Title>
    <Lede>Une suggestion inline prend quelques centaines de millisecondes. Six étapes, dont la dernière vous appartient.</Lede>
    <M1Stage x={120} n={1} icon="code" tone="navy" title="Vous écrivez" sub="du code, un commentaire, ou une question dans le chat" beat={0} />
    <M1Stage x={406} n={2} icon="layers" tone="blue" title="VS Code assemble le contexte" sub="fichier courant, onglets ouverts, sélection, instructions" beat={1} />
    <M1Stage x={692} n={3} icon="shield" tone="teal" title="Le service Copilot filtre" sub="sécurité, contenus, code public correspondant" beat={2} />
    <M1Stage x={978} n={4} icon="brain" tone="violet" title="Le modèle prédit" sub="la suite la plus probable, morceau par morceau" beat={3} />
    <M1Stage x={1264} n={5} icon="sparkles" tone="green" title="La suggestion s’affiche" sub="texte grisé, réponse du chat ou modification proposée" beat={4} />
    <M1Stage x={1550} n={6} icon="humanCheck" tone="coral" title="Vous décidez" sub="lire, accepter, ajuster ou refuser" beat={5} />
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 730, width: 1680 }}>
      <Callout tone="coral" icon="alert" title="Ce que Copilot ne fait pas pour une suggestion inline" size={25}>
        Il n’exécute pas votre code, ne lance pas vos tests et ne « connaît » pas votre projet : il ne voit que le contexte envoyé à l’étape 2.
      </Callout>
    </div>
  </Frame>
);

// ─── Modèles ────────────────────────────────────────────────────────────────
const M1ModelCol = ({ icon, tone, title, sub, children, d }: { icon: IconName; tone: Tone; title: string; sub: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 20, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M1_Modeles: Page = () => (
  <Frame mod={1}>
    <Title>Plusieurs modèles derrière un seul Copilot</Title>
    <Lede>Copilot n’est pas un modèle : c’est un service qui orchestre des modèles de plusieurs fournisseurs (OpenAI, Anthropic, Google…).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      <M1ModelCol icon="bolt" tone="blue" title="Complétions inline" sub="un modèle rapide, dédié" d={100}>
        <Bullet size={22}>Répond en quelques centaines de ms</Bullet>
        <Bullet size={22}>Ne se choisit pas dans le chat</Bullet>
        <Bullet size={22}>Ne consomme pas de crédits IA</Bullet>
      </M1ModelCol>
      <M1ModelCol icon="sparkles" tone="green" title="Auto" sub="le choix par défaut du chat" d={220}>
        <Bullet size={22} tone="green">Copilot choisit un modèle adapté</Bullet>
        <Bullet size={22} tone="green">Seul choix sur l’offre Free</Bullet>
        <Bullet size={22} tone="green">Le bon réflexe pour débuter</Bullet>
      </M1ModelCol>
      <M1ModelCol icon="brain" tone="violet" title="Modèles au choix" sub="sélecteur de modèle (offres payantes)" d={340}>
        <Bullet size={22} tone="violet">Légers : rapides et économes</Bullet>
        <Bullet size={22} tone="violet">Avancés : raisonnement, plus coûteux</Bullet>
        <Bullet size={22} tone="violet">Liste qui évolue chaque mois</Bullet>
      </M1ModelCol>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout tone="blue" icon="scale" title="Changer de modèle ne change pas la méthode" size={25} cls={A.in} style={dl(600)}>
        Un modèle plus puissant se trompe moins souvent, pas jamais. Le contexte que vous donnez pèse plus lourd que le nom du modèle.
      </Callout>
    </div>
  </Frame>
);

// ─── Écosystème ─────────────────────────────────────────────────────────────
const M1Surface = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M1_Ecosysteme: Page = () => (
  <Frame mod={1}>
    <Title>Copilot dans l’écosystème GitHub</Title>
    <Lede>Le même compte, la même licence, plusieurs points d’entrée. Cette formation se concentre sur le premier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M1Surface icon="code" tone="blue" title="Dans l’éditeur" d={100}>
        <strong>VS Code</strong> (notre terrain de jeu), Visual Studio, JetBrains, Xcode, Eclipse…
      </M1Surface>
      <M1Surface icon="chat" tone="teal" title="Sur github.com" d={180}>
        Poser une question sur un dépôt, une issue ou une pull request.
      </M1Surface>
      <M1Surface icon="terminal" tone="navy" title="Copilot CLI" d={260}>
        Un agent dans le terminal : expliquer, exécuter, corriger.
      </M1Surface>
      <M1Surface icon="cloud" tone="violet" title="Agent cloud" d={340}>
        On lui confie une issue, il travaille seul et ouvre une pull request.
      </M1Surface>
      <M1Surface icon="shieldCheck" tone="coral" title="Revue de code" d={420}>
        Un premier relecteur automatique sur les pull requests.
      </M1Surface>
      <M1Surface icon="phone" tone="green" title="App Copilot & mobile" d={500}>
        Suivre et reprendre ses sessions d’agent hors de l’éditeur.
      </M1Surface>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 900, ...dl(800) }}>
      Agent cloud et revue de code : offres payantes. Tout ce que nous ferons fonctionne avec Copilot Free.
    </Hint>
  </Frame>
);

// ─── Offres & crédits (actualité) ───────────────────────────────────────────
const M1Plan = ({ name, price, tone, children, d }: { name: string; price: string; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{name}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 23, color: STRONG[tone] }}>{price}</span>
    </div>
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M1_Offres: Page = () => (
  <Frame mod={1} kind="actu">
    <Title>Offres et crédits IA : ce qui a changé en 2026</Title>
    <Lede>Depuis juin 2026, chat et agents consomment des « GitHub AI Credits ». Les suggestions inline, elles, restent hors crédits.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M1Plan name="Free" price="0 €" tone="green" d={100}>
        <Bullet size={22} tone="green">2 000 complétions par mois</Bullet>
        <Bullet size={22} tone="green">Chat et agent : usage limité</Bullet>
        <Bullet size={22} tone="green">Modèle Auto, sans revue de PR</Bullet>
      </M1Plan>
      <M1Plan name="Pro / Pro+" price="dès 10 $ / mois" tone="blue" d={220}>
        <Bullet size={22}>Complétions et NES illimitées</Bullet>
        <Bullet size={22}>Choix du modèle, crédits inclus</Bullet>
        <Bullet size={22}>Agent cloud et revue de code</Bullet>
      </M1Plan>
      <M1Plan name="Business / Enterprise" price="par siège" tone="violet" d={340}>
        <Bullet size={22} tone="violet">Licence attribuée par l’entreprise</Bullet>
        <Bullet size={22} tone="violet">Politiques fixées par l’administrateur</Bullet>
        <Bullet size={22} tone="violet">Vos données ne servent pas à l’entraînement</Bullet>
      </M1Plan>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 650, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="blue" icon="money" title="1 crédit = 0,01 $" size={23} cls={A.in} style={dl(500)}>
        Une question simple à un modèle léger coûte une fraction de crédit ; une longue session d’agent sur un modèle avancé, beaucoup plus.
      </Callout>
      <Callout tone="green" icon="bolt" title="Pour cette formation" size={23} cls={A.in} style={dl(650)}>
        L’essentiel se fait en suggestions inline et en chat : Copilot Free suffit pour tous les ateliers.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, fontSize: 19, color: C.muted, ...dl(900) }}>
      Source : github.com/features/copilot/plans, consulté le 4 novembre 2026. Les montants évoluent : vérifiez avant de citer un chiffre.
    </div>
  </Frame>
);

// ─── Nouveautés Universe 2026 (actualité) ───────────────────────────────────
const M1News = ({ icon, tone, title, tag, children, d }: { icon: IconName; tone: Tone; title: string; tag: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ flex: 1, fontSize: 25, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{title}</div>
      <Tag tone={tag === 'GA' ? 'green' : 'yellow'} size={16}>
        {tag}
      </Tag>
    </div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M1_Nouveautes: Page = () => (
  <Frame mod={1} kind="actu" beats={1}>
    <Title>Les nouveautés d’octobre 2026 (GitHub Universe)</Title>
    <Lede>Annoncées le 28 octobre pour VS Code : surtout des agents qui travaillent plus longtemps, ailleurs, et plus sûrement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <M1News icon="layers" tone="blue" title="Fenêtre Agents" tag="GA" d={100}>
        Lancer, suivre et comparer des sessions ; les reprendre dans l’app Copilot, sur mobile ou dans le CLI.
      </M1News>
      <M1News icon="server" tone="navy" title="Agent Host" tag="GA" d={180}>
        Les sessions continuent en arrière-plan, même fenêtre ou dossier fermés.
      </M1News>
      <M1News icon="scale" tone="violet" title="Comparer les modèles" tag="Préversion" d={260}>
        Plusieurs modèles sur la même tâche, côte à côte ; un « juge » peut recommander.
      </M1News>
      <M1News icon="clock" tone="teal" title="Automatisations cloud" tag="Préversion" d={340}>
        Des tâches d’agent planifiées ou déclenchées par une pull request (VS Code 1.144).
      </M1News>
      <M1News icon="plug" tone="green" title="Connecteurs Copilot" tag="Préversion" d={420}>
        Slack, Notion, Microsoft Learn… dans une session, sans installer de serveur MCP.
      </M1News>
      <M1News icon="lock" tone="coral" title="Bac à sable local" tag="GA" d={500}>
        Limite l’accès des agents aux fichiers, au réseau et aux identifiants (VS Code 1.141).
      </M1News>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Et pour vous, cette semaine ?" size={25}>
        Rien de tout cela n’est nécessaire pour bien débuter. Nous travaillons ce qui ne change pas : suggestions inline, chat, et vérification.
      </Callout>
    </div>
  </Frame>
);

// ─── Vrai ou faux ───────────────────────────────────────────────────────────
const M1Myth = ({ claim, verdict, ok, children, n }: { claim: string; verdict: string; ok: boolean; children: ReactNode; n: number }) => (
  <FlipCard
    w={538}
    h={300}
    tone="navy"
    backTone={ok ? 'green' : 'coral'}
    front={
      <>
        <Eyebrow c={C.muted} size={18}>
          Affirmation {n}
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 29, fontWeight: 700, lineHeight: 1.3, color: C.ink }}>« {claim} »</div>
        <div style={{ marginTop: 'auto', fontSize: 19, color: C.muted }}>Vrai ou faux ? Votez à voix haute, puis cliquez.</div>
      </>
    }
    back={
      <>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: ok ? T.green.fg : T.coral.fg }}>{verdict}</div>
        <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.45, color: C.ink }}>{children}</div>
      </>
    }
  />
);

const M1_VraiFaux: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Vrai ou faux ? Six idées reçues sur Copilot</Title>
    <Lede>Pour chaque carte, dites « vrai » ou « faux » au micro. Je retourne la carte après le vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 538px)', gap: 33, rowGap: 26 }}>
      <M1Myth n={1} claim="Copilot connaît tout mon projet." verdict="Faux" ok={false}>
        Il ne voit que le contexte envoyé : fichier courant, onglets ouverts, références que vous ajoutez.
      </M1Myth>
      <M1Myth n={2} claim="Il teste son code avant de me le proposer." verdict="Faux" ok={false}>
        Une suggestion inline n’est jamais exécutée. Un agent peut lancer des tests… si vous l’y autorisez.
      </M1Myth>
      <M1Myth n={3} claim="Il peut se tromper avec beaucoup d’aplomb." verdict="Vrai" ok>
        Il prédit du texte plausible : une API inventée a l’air aussi sûre qu’une vraie.
      </M1Myth>
      <M1Myth n={4} claim="Je suis responsable du code que j’accepte." verdict="Vrai" ok>
        Une suggestion acceptée devient votre code : en revue, en production, juridiquement.
      </M1Myth>
      <M1Myth n={5} claim="Il apprend mon code en direct, d’une session à l’autre." verdict="Faux" ok={false}>
        Le modèle ne change pas pendant que vous travaillez. Ce qui persiste, ce sont vos fichiers d’instructions.
      </M1Myth>
      <M1Myth n={6} claim="Avec Copilot, plus besoin de revue de code." verdict="Faux" ok={false}>
        Il accélère l’écriture : la relecture humaine et les tests deviennent encore plus importants.
      </M1Myth>
    </div>
  </Frame>
);

// ─── Avantages & limites ────────────────────────────────────────────────────
const M1_AvantagesLimites: Page = () => (
  <Frame mod={1}>
    <Title>Avantages et limites : où Copilot brille, où il trébuche</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${C.green}` }}>
      <PanelTitle icon="checkCircle" c={T.green.fg}>
        Là où il excelle
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={25} tone="green">Code répétitif, structures, conversions</Bullet>
        <Bullet size={25} tone="green">Expliquer un code ou une erreur inconnue</Bullet>
        <Bullet size={25} tone="green">Premier jet de tests et de documentation</Bullet>
        <Bullet size={25} tone="green">Syntaxe d’un langage ou d’une API que l’on connaît mal</Bullet>
        <Bullet size={25} tone="green">Renommer, extraire, simplifier</Bullet>
        <Bullet size={25} tone="green">Rester dans le flux, sans quitter l’éditeur</Bullet>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 200, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${C.coral}`, ...dl(200) }}>
      <PanelTitle icon="alert" c={T.coral.fg}>
        Là où il faut redoubler de vigilance
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={25} tone="coral">Règles métier subtiles et cas limites</Bullet>
        <Bullet size={25} tone="coral">Sécurité : injections, secrets, droits d’accès</Bullet>
        <Bullet size={25} tone="coral">API récentes ou internes : il invente</Bullet>
        <Bullet size={25} tone="coral">Gros changements sur un code qu’il voit en partie</Bullet>
        <Bullet size={25} tone="coral">Licences : code très proche d’un dépôt public</Bullet>
        <Bullet size={25} tone="coral">Décisions d’architecture : c’est la vôtre</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 780, width: 1680 }}>
      <Callout tone="blue" icon="hand" title="La bonne posture" size={26} cls={A.in} style={dl(500)}>
        Traitez Copilot comme un collègue junior très rapide et très cultivé : on lui délègue volontiers, on relit toujours.
      </Callout>
    </div>
  </Frame>
);

// ─── Démo en direct ─────────────────────────────────────────────────────────
const M1DemoStep = ({ n, tone, title, children, beat }: { n: number; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 24px' }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const M1_Demo: Page = () => (
  <Frame mod={1} kind="demo" beats={3}>
    <Title>Démo en direct : Copilot sur TaskFlow</Title>
    <Lede>Je partage mon écran. Regardez surtout ce que je fais entre deux suggestions : je lis.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M1DemoStep n={1} tone="blue" title="Une suggestion inline" beat={0}>
        Un commentaire dans <Ic>katas/01-premiers-pas.js</Ic>, le texte grisé, <Kbd>Tab</Kbd> ou <Kbd>Échap</Kbd>.
      </M1DemoStep>
      <M1DemoStep n={2} tone="teal" title="Une question au chat (Ask)" beat={1}>
        <Pr>« Explique la structure de ce projet en 5 lignes. »</Pr> Puis je vérifie dans le README.
      </M1DemoStep>
      <M1DemoStep n={3} tone="violet" title="Une modification sur place (Ctrl+I)" beat={2}>
        Je sélectionne une fonction : <Pr>« gère le tableau vide »</Pr>, je relis le diff, j’accepte.
      </M1DemoStep>
      <M1DemoStep n={4} tone="green" title="La preuve" beat={3}>
        <Ic>npm test</Ic> : sans test vert, rien n’est terminé.
      </M1DemoStep>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1240, top: 262, width: 560, ...dl(300) }}>
      <Card icon="chat" tone="navy" title="Questions / réponses" size={23} pad={26}>
        Pendant la démo : une question ? Écrivez-la dans le clavardage, j’y réponds à chaque étape.
        <div style={{ marginTop: 16, fontSize: 21, color: C.muted, fontStyle: 'italic' }}>
          Les plus fréquentes : « Il voit mon code ? », « C’est payant ? », « Et la confidentialité ? »
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Lab: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Premier contact avec Copilot"
    defi="explorer"
    who="Individuel · 20 min"
    objective={
      <>
        Voir Copilot à l’œuvre sur un vrai dépôt : lui faire <strong>expliquer TaskFlow</strong>, obtenir vos premières <strong>suggestions inline</strong>, et noter ce qui est juste… et ce qui ne l’est pas.
      </>
    }
    where={
      <>
        <PathChip size={19}>katas/01-premiers-pas.js</PathChip> complété et relu
        <br />
        <PathChip size={19}>JOURNAL.md</PathChip> · 3 observations
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l1a" size={21}>Une affirmation exacte et une imprécise relevées</CheckItem>
        <CheckItem id="l1b" size={21}>4 blocs du kata traités au clavier</CheckItem>
        <CheckItem id="l1c" size={21}>estBissextile(1900) vérifiée à la main</CheckItem>
      </>
    }
    suivi="Point d’étape au micro à 10 min : « Copilot vous a-t-il déjà dit quelque chose de faux ? »"
  >
    <WStep n={1}>
      Vue Chat (<Kbd>Ctrl+Alt+I</Kbd>), agent <strong>Ask</strong> : <Pr>« Explique la structure de ce projet en 5 lignes. Cite les fichiers. »</Pr> Comparez avec le README.
    </WStep>
    <WStep n={2}>
      Dans le kata, pour chaque ligne ▶ : attendez le texte grisé, lisez, <Kbd>Tab</Kbd> ou <Kbd>Échap</Kbd>.
    </WStep>
    <WStep n={3}>Vérifiez la règle bissextile sur 1900, 2000 et 2024, puis remplissez JOURNAL.md.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <Frame mod={1} kind="qcm">
    <Title>QCM · Module 1 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Sur quoi repose une suggestion de Copilot ?" explain="Un modèle de langage prédit la suite la plus probable à partir du contexte envoyé. Il n’exécute rien et ne « comprend » pas votre besoin.">
        <QOpt ok>Une prédiction du code le plus probable, à partir du contexte envoyé</QOpt>
        <QOpt>Une base de données de solutions validées par GitHub</QOpt>
        <QOpt>L’exécution de votre code pour trouver ce qui marche</QOpt>
      </QuizQ>
      <QuizQ q="Sur l’offre Copilot Free, qu’est-ce qui ne consomme pas de crédits IA ?" explain="Depuis juin 2026, complétions et suggestions de modification suivante sont hors crédits (avec un plafond de 2 000 complétions par mois sur Free). Chat et agents consomment des crédits.">
        <QOpt>Les questions dans le chat</QOpt>
        <QOpt ok>Les suggestions inline (complétions)</QOpt>
        <QOpt>Les sessions en mode Agent</QOpt>
      </QuizQ>
      <QuizQ q="Copilot propose une fonction qui « a l’air juste ». Que faites-vous ?" explain="Plausible ne veut pas dire correct : on lit, on teste les cas limites. C’est le réflexe de toute la formation.">
        <QOpt>Je l’accepte : il a été entraîné sur des millions de dépôts</QOpt>
        <QOpt>Je demande au chat si elle est juste, et je le crois</QOpt>
        <QOpt ok>Je la lis ligne à ligne et je la vérifie sur des cas limites</QOpt>
      </QuizQ>
      <QuizQ q="Parmi les nouveautés d’octobre 2026, laquelle permet de faire travailler plusieurs modèles sur la même tâche ?" explain="« Comparer les résultats de modèles », en préversion dans la fenêtre Agents. La fenêtre Agents en est le cadre, les connecteurs apportent du contexte externe.">
        <QOpt ok>La comparaison des résultats de modèles</QOpt>
        <QOpt>Les connecteurs Copilot</QOpt>
        <QOpt>Le bac à sable local</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M1_Pause: Page = () => <BreakPage mod={1} title="Pause" back="Reprise à 11 h 10 : on installe et on configure Copilot." minutes={15} />;

// @@PAGES-BEGIN
export const __pages = [M1_Divider, M1_IAHistoire, M1_Histoire, M1_IAMLDL, M1_Neurones, M1_Entrainement, M1_Tokens, M1_Transformer, M1_Generation, M1_Hallucinations, M1_Fonctionnement, M1_Agent, M1_Engineering, M1_Modeles, M1_Ecosysteme, M1_Offres, M1_Nouveautes, M1_VraiFaux, M1_AvantagesLimites, M1_Demo, M1_Lab, M1_Qcm, M1_Pause];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 1 · 9:30

OBJECTIF — Annoncer le module : comprendre avant d’utiliser.

DIRE — « Premier module : qu’est-ce que GitHub Copilot, vraiment ? D’où il vient, comment il fabrique une suggestion, ce qu’il sait faire et ce qu’il ne sait pas faire. On termine par une démo et votre premier atelier. »

TRANSITION — « Un peu d’histoire : celle de l’IA, puis celle de Copilot. »`,
  `⏱ 4 min · FRISE DE L’IA (interactive, 3 temps)

OBJECTIF — Situer Copilot dans 80 ans d’histoire de l’IA, mettre des visages sur les grandes étapes, montrer l’accélération depuis 2017.

DIRE — « L’IA n’est pas née avec ChatGPT. 1943, McCulloch et Pitts modélisent le neurone. 1950, Turing pose la question : une machine peut-elle penser ? 1956, Dartmouth invente le mot. 1957, le perceptron de Rosenblatt apprend. Puis deux hivers : promesses non tenues, crédits coupés. Le renouveau vient de l’apprentissage : rétropropagation en 1986, réseaux convolutifs de Yann LeCun, pendant que Deep Blue bat Kasparov par la force brute. Puis le deep learning : ImageNet, AlexNet en 2012, AlphaGo en 2016. » → beat 1 « 2017 : l’article Transformer de Google, “Attention Is All You Need”. C’est l’architecture de tous les LLM actuels. GPT-3 en 2020, GitHub Copilot en 2021, ChatGPT fin 2022. » → beat 2 « Depuis 2024, les modèles agissent : MCP les branche à vos outils, 2025 est l’année des agents de code, 2026 celle des équipes d’agents. »

ANIMATION — Survoler un jalon ouvre sa fiche (personnes, contexte, anecdote) ; survoler une période affiche son résumé. En piocher deux ou trois selon le public : ELIZA, AlexNet entraîné dans une chambre, le coup 37 d’AlphaGo. Ne pas tout lire.

TRANSITION — « Dans cette histoire, Copilot occupe les cinq dernières années. Zoom. »`,
  `⏱ 2 min · HISTOIRE DE COPILOT

OBJECTIF — Situer Copilot : un outil jeune, qui change vite.

DIRE — « 2021 : préversion, basée sur Codex, un modèle d’OpenAI spécialisé dans le code. 2022 : disponible pour tous. 2023 : le chat arrive dans l’éditeur. 2024 : on peut choisir son modèle, et une offre gratuite apparaît. 2025 : le mode Agent, qui modifie plusieurs fichiers et lance des commandes. Et 2026… » → beat 1 « … la fenêtre Agents, des sessions dans le cloud, et un nouveau modèle de facturation par crédits. Mais sous toutes ces couches, le même moteur. »

TRANSITION — « Justement, ouvrons le capot de ce moteur. »`,
  `⏱ 3 min · IA, ML, DEEP LEARNING, LLM (3 temps + interaction)

OBJECTIF — Clarifier le vocabulaire : chaque terme est un cas particulier du précédent ; le machine learning inverse la programmation.

DIRE — « L’intelligence artificielle, c’est le grand cercle : toute machine qui fait une tâche qu’on dirait intelligente, y compris avec des règles écrites à la main. » → beat 1 « Le machine learning est un sous-ensemble : on n’écrit plus les règles, on les fait apprendre à partir d’exemples. » → beat 2 « Le deep learning : de l’apprentissage avec des réseaux de neurones très profonds, depuis 2012. » → beat 3 « Et les LLM, les grands modèles de langage, sont des réseaux profonds géants entraînés sur du texte et du code. Copilot est là, au centre. »

ANIMATION — En bas à droite, cliquer « Programmation classique » puis « Machine learning » : les entrées et la sortie s’inversent. « Avant, vous donniez les règles. Maintenant, vous donnez des exemples et la machine fabrique les règles. »

TRANSITION — « Ces règles apprises sont stockées dans des neurones artificiels. Regardons-en un. »`,
  `⏱ 3 min · NEURONE ET RÉSEAU (interactif, 2 temps)

OBJECTIF — Démystifier le neurone : une somme pondérée et un seuil ; un réseau, ce sont des couches de ces calculs.

DIRE — « Un neurone artificiel fait trois choses : multiplier chaque entrée par un poids, additionner, décider. Ici, un neurone jouet décide si un ticket est urgent. »

ANIMATION — Activer « En production » : la somme devient positive, le ticket passe URGENT. Activer « Simple faute de frappe » : poids négatif, il redevient normal. À droite, cliquer « Propager un signal » : le signal traverse les couches de gauche à droite.

→ beat 1 « Personne n’a écrit 0,7 ou −0,6 : c’est l’entraînement qui trouve ces poids. » → beat 2 « GPT-3, en 2020 : 175 milliards de poids et 96 couches. Les modèles d’aujourd’hui sont plus grands encore. Le principe, lui, est celui de ce petit neurone. »

TRANSITION — « Comment trouve-t-on des milliards de poids ? En s’entraînant. »`,
  `⏱ 3 min · ENTRAÎNEMENT (interactif, 4 temps)

OBJECTIF — Faire comprendre l’entraînement : réduire l’erreur pas à pas ; les trois phases ; un modèle figé après coup.

DIRE — « Entraîner, c’est jouer à “devine le token suivant” sur des milliards d’exemples. À chaque erreur, on ajuste un peu les poids dans la direction qui réduit l’erreur : c’est la descente de gradient. »

ANIMATION — Cliquer « Un pas » plusieurs fois : la boule descend vers l’erreur minimale. Monter le taux d’apprentissage vers 0,30 puis « 10 pas » : la boule oscille ou diverge. « Trop prudent, c’est lent ; trop pressé, ça n’apprend plus. » Réinitialiser.

→ beat 1 « Phase 1, le pré-entraînement : des milliers de milliards de tokens, des semaines sur des milliers de GPU. » → beat 2 « Phase 2 : on lui montre des consignes et de bonnes réponses ; il apprend à suivre une demande. » → beat 3 « Phase 3 : des humains comparent ses réponses, il apprend à préférer les plus utiles et les plus sûres. » → beat 4 « Ensuite, on fige les poids. Le modèle n’apprend rien pendant votre session. Ce qu’il sait de TaskFlow, il le sait uniquement par le contexte que VS Code lui envoie. »

TRANSITION — « On a parlé de tokens. C’est quoi, exactement ? »`,
  `⏱ 3 min · TOKENS (interactif, 1 temps)

OBJECTIF — Faire comprendre l’unité de base du modèle et ses trois conséquences : coût, limite de contexte, angles morts.

DIRE — « Le modèle ne lit ni des lettres ni des mots, il lit des tokens : des morceaux de mots. »

ANIMATION — Cliquer « Du code », puis « Du français », puis « La même chose en anglais » : comparer le nombre de caractères par token (le français coûte un peu plus). Cliquer « Un identifiant » : un nom explicite se découpe en morceaux de sens, Copilot s’y retrouve bien. Activer « Ce que voit le modèle : des nombres » : chaque token est un identifiant numérique. Le découpage affiché est illustratif.

→ beat 1 « Trois conséquences. La facture : les crédits du chat et des agents se comptent en tokens. La limite : la fenêtre de contexte se mesure en tokens. Les angles morts : compter des lettres, c’est difficile pour lui, il ne voit pas les lettres. »

TRANSITION — « Comment le modèle relie-t-il ces tokens entre eux ? Avec l’attention. »`,
  `⏱ 3 min · TRANSFORMER ET ATTENTION (interactif, 1 temps)

OBJECTIF — Donner l’intuition de l’attention : chaque token pondère tous les autres pour comprendre le contexte.

DIRE — « 2017, Google publie le Transformer. Son idée : pour comprendre un mot, chaque token regarde tous les autres et décide lesquels comptent. »

ANIMATION — Phrase : cliquer « il » : les arcs montrent qu’il regarde surtout « ticket ». Cliquer « refuse » puis « long ». Onglet « Du code » : cliquer le second « t » : il regarde « tickets », d’où les suggestions de champs de ticket. Cliquer « 'fini' ». Les poids affichés sont illustratifs.

→ beat 1 « La chaîne complète : texte découpé en tokens, chaque token devient une liste de nombres, des dizaines de couches d’attention et de calcul, puis une probabilité pour chaque token possible. On en choisit un, on l’ajoute… et on recommence. »

TRANSITION — « Ce choix, justement, regardons-le de près. »`,
  `⏱ 4 min · GÉNÉRATION PROBABILISTE (démo interactive, 1 temps)

OBJECTIF — Faire vivre la prédiction probabiliste et la température ; plausible n’est pas correct.

DIRE — « Après “new Date(ticket.echeance) <”, le modèle calcule une probabilité pour chaque suite. “maintenant”, le paramètre, est la bonne. “new Date()” et “Date.now()” marchent… mais ignorent le paramètre, et le code devient difficile à tester. “ticket.creeLe”, c’est une logique fausse. “aujourdhui”, une variable qui n’existe pas. »

ANIMATION — Température 0,2 : cliquer « Tirer un token » cinq fois, presque toujours la même réponse. Monter à 1,8 : tirer cinq fois, les suites douteuses apparaissent. Lire le compteur « suites douteuses ».

→ beat 1 « Le token tiré est ajouté, et il prédit le suivant. C’est pour ça que la même question donne des réponses différentes. Et à l’atelier 1, vous testerez un cas où la réponse la plus fréquente sur Internet est fausse : les années bissextiles. Plausible n’est pas correct. »

TRANSITION — « Et quand le plausible est complètement faux, on parle d’hallucination. »`,
  `⏱ 2 min · HALLUCINATIONS (4 temps, cartes à retourner)

OBJECTIF — Expliquer pourquoi le modèle invente, et donner les premiers réflexes (approfondis au Module 8).

DIRE — « Le modèle ne consulte pas une base de faits. Il complète avec ce qui ressemble le plus à du vrai. » → beat 1 « Une méthode sortBy qui n’existe pas sur les tableaux JavaScript. » → beat 2 « Un paquet npm inventé : danger, quelqu’un a pu le publier exprès. » → beat 3 « Un réglage VS Code imaginaire, ignoré sans bruit. » → beat 4 « Pourquoi ? Motif rare, contexte incomplet, question qui présuppose la réponse. Vos parades : exécuter, tester, donner le contexte, vérifier la source. »

ANIMATION — Les cartes se retournent aussi au clic. Question au micro : « Laquelle de ces trois vous aurait piégé ? » (une ou deux réponses).

TRANSITION — « Revenons à Copilot : que se passe-t-il entre votre clavier et la suggestion ? »`,
  `⏱ 4 min · FONCTIONNEMENT

OBJECTIF — Faire comprendre la chaîne de production d’une suggestion, et surtout ce qui n’y figure pas.

DIRE — « Étape 1 : vous écrivez. » → beat 1 « Étape 2 : VS Code assemble le contexte : le fichier courant, les onglets ouverts, votre sélection, d’éventuelles instructions. C’est la seule chose que le modèle verra. » → beat 2 « Étape 3 : le service Copilot de GitHub applique des filtres : contenus, sécurité, et éventuellement le blocage des suggestions qui recopient du code public. » → beat 3 « Étape 4 : le modèle prédit la suite, morceau par morceau. » → beat 4 « Étape 5 : la suggestion s’affiche. » → beat 5 « Et étape 6, la vôtre : vous décidez. Remarquez ce qui manque : personne n’a exécuté ce code. »

TRANSITION — « Et si on donne des outils au modèle, et le droit de recommencer ? On obtient un agent. »`,
  `⏱ 3 min · LA BOUCLE AGENTIQUE (10 temps ou lecture automatique)

OBJECTIF — Faire comprendre ce qu’est un agent : un LLM + des outils + une boucle ; et la place de l’humain.

DIRE — « Le chat répond avec du texte. Un agent, lui, agit : il lit des fichiers, les modifie, lance des commandes, observe le résultat, et recommence jusqu’à atteindre l’objectif. Exemple sur TaskFlow : faire passer les tests de l’atelier 4 au vert. »

ANIMATION — Avancer clic par clic : chaque clic ajoute une ligne au journal et allume le nœud correspondant (Réfléchir, Agir, Observer). → beat 1 il planifie ; → beat 2 il lit le test ; → beat 3 il observe la règle des points ; → beat 4 il édite ; → beat 5 il lance les tests, et vous approuvez la commande ; → beat 6 un échec ; → beat 7 il replanifie ; → beat 8 il corrige ; → beat 9 tout est vert ; → beat 10 il rend la main avec un résumé et un diff. Variante : bouton « Lecture automatique ».

DIRE (fin) — « Remarquez l’étape 6 : il s’est trompé, et c’est le test qui l’a vu, pas lui. Sans test, l’agent aurait annoncé “terminé”. »

TRANSITION — « Comment guider un modèle ou un agent ? Trois leviers. »`,
  `⏱ 3 min · PROMPT, CONTEXTE, HARNAIS (2 temps + clic sur les couches)

OBJECTIF — Distinguer les trois leviers : ce que l’on demande, ce que le modèle voit, le cadre dans lequel l’agent agit.

DIRE — « Le prompt engineering, c’est l’art de formuler : objectif, contraintes, format, exemple. Exemple : ce commentaire qui guide la génération de validerTicket. » → beat 1 « Le context engineering, terme popularisé en 2025 : choisir ce que le modèle voit. Les bons fichiers, les règles du projet, une session propre, pas de bruit. Vous le pratiquerez au Module 3. » → beat 2 « Le harness engineering, le harnais : le cadre de l’agent. Quels outils, quelles permissions, quels garde-fous automatiques comme les tests, quel bac à sable, et une revue humaine à la fin. Plus vous déléguez, plus le harnais compte. »

ANIMATION — Cliquer chaque couche pour revenir sur un niveau ; le panneau de droite liste ce qu’on règle et où ça se trouve dans Copilot.

TRANSITION — « Ces leviers s’appliquent aux modèles que Copilot vous propose. Lesquels ? »`,
  `⏱ 3 min · MODÈLES

OBJECTIF — Démystifier le sélecteur de modèle.

DIRE — « Copilot n’est pas un modèle, c’est un service. Les suggestions inline utilisent un modèle rapide dédié, que vous ne choisissez pas dans le chat, et qui ne consomme pas de crédits. Dans le chat, le choix par défaut est Auto : Copilot choisit pour vous, et c’est le seul choix sur l’offre gratuite. Avec une offre payante, vous pouvez choisir parmi plusieurs modèles, légers ou avancés ; la liste change tous les mois. Retenez : changer de modèle ne remplace pas un bon contexte. »

TRANSITION — « Et Copilot ne vit pas seulement dans VS Code. »`,
  `⏱ 3 min · ÉCOSYSTÈME

OBJECTIF — Situer l’éditeur parmi les points d’entrée de Copilot.

DIRE — « Le même compte vous donne Copilot dans l’éditeur, sur github.com, dans le terminal avec Copilot CLI, un agent cloud à qui on confie une issue et qui ouvre une pull request, une revue de code automatique, et une app pour suivre ses sessions. Pendant deux jours, on reste dans l’éditeur : c’est là que se joue 90 % de votre quotidien. »

TRANSITION — « Parlons argent : les offres ont changé cette année. »`,
  `⏱ 3 min · OFFRES & CRÉDITS (actualité)

OBJECTIF — Donner une image juste et datée des offres, sans se perdre dans les tarifs.

DIRE — « Depuis juin 2026, GitHub facture l’usage du chat et des agents en crédits IA : un crédit vaut un centime de dollar, et le coût dépend du modèle et de la taille de la tâche. Les suggestions inline et les suggestions de modification suivante ne consomment pas de crédits. L’offre Free donne 2 000 complétions par mois et un usage limité du chat. Les offres Pro ajoutent l’illimité, le choix du modèle, l’agent cloud et la revue de code. En entreprise, Business ou Enterprise : la licence vient de votre organisation, l’administrateur fixe des politiques, et vos données ne servent pas à entraîner les modèles. »

ANIMATION — Insister sur la date : ces chiffres bougent ; renvoyer vers la page officielle.

TRANSITION — « Et le mois dernier, GitHub a annoncé une série de nouveautés. »`,
  `⏱ 3 min · NOUVEAUTÉS UNIVERSE 2026 (actualité)

OBJECTIF — Montrer que l’on suit l’actualité, et rassurer : rien d’indispensable pour débuter.

DIRE — « Le 28 octobre, à GitHub Universe, six annonces pour VS Code. La fenêtre Agents, pour lancer et suivre des sessions, qu’on peut reprendre sur mobile ou dans le terminal. L’Agent Host : les sessions continuent même fenêtre fermée. La comparaison de modèles sur une même tâche, en préversion. Des automatisations dans le cloud, déclenchées par exemple par une pull request. Des connecteurs vers Slack, Notion ou Microsoft Learn. Et un bac à sable qui limite ce que les agents peuvent toucher sur votre poste. » → beat 1 « Bonne nouvelle : rien de tout cela n’est nécessaire pour bien débuter. »

TRANSITION — « Vérifions vos intuitions sur Copilot. »`,
  `⏱ 5 min · VRAI OU FAUX (vote oral)

OBJECTIF — Faire émerger et corriger les idées reçues.

DIRE — « Six affirmations. Pour chacune, dites “vrai” ou “faux” au micro, je compte, puis je retourne la carte. »

ANIMATION — Carte 5 : préciser que la « mémoire » éventuelle d’un agent prend la forme de fichiers de notes visibles, pas d’un modèle qui apprend. Carte 4 : faire le lien avec le Module 8 (droits d’auteur).

TRANSITION — « Synthèse : où Copilot brille, où il trébuche. »`,
  `⏱ 3 min · AVANTAGES & LIMITES

OBJECTIF — Donner une grille de lecture réaliste.

DIRE — « À gauche, ce que Copilot fait très bien : le répétitif, l’explication, le premier jet de tests et de documentation, la syntaxe d’un langage qu’on connaît mal. À droite, les zones de vigilance : la logique métier subtile, la sécurité, les API récentes ou internes qu’il invente, et les licences. La bonne posture : un collègue junior très rapide et très cultivé. On délègue, on relit. »

TRANSITION — « Assez parlé : je vous montre. »`,
  `⏱ 6 min · DÉMO EN DIRECT + Q/R

OBJECTIF — Montrer les trois gestes de base sur TaskFlow, et répondre aux questions.

DIRE — « Je partage mon écran. Un : une suggestion inline sur un commentaire. » → beat 1 « Deux : une question au chat, en mode Ask, et je vérifie sa réponse dans le README. » → beat 2 « Trois : une modification sur place avec Ctrl+I, je relis le diff avant d’accepter. » → beat 3 « Quatre : la preuve, npm test. »

ANIMATION — Faire la démo réellement dans le dépôt taskflow-copilot (pas de capture). Prendre 2 ou 3 questions du clavardage.

TRANSITION — « À vous : premier atelier, vingt minutes. »`,
  `⏱ 20 min · ATELIER 1 (individuel)

OBJECTIF — Premier contact actif : expliquer le projet, premières suggestions, premier esprit critique.

DIRE — « Vingt minutes, chacun sur son poste. L’énoncé complet est dans ateliers/atelier-01-decouverte. Trois étapes : faire expliquer le projet et le comparer au README, traiter les quatre blocs du kata, et vérifier la règle des années bissextiles. Notez tout dans JOURNAL.md. »

ANIMATION — Lancer le minuteur. Point d’étape à 10 min : « Copilot vous a-t-il déjà dit quelque chose de faux ? » Bloqué (pas de suggestion) : vérifier la connexion, ce sera réglé au Module 2 ; avancer avec le chat.

TRANSITION — « On fait le point avec un QCM. »`,
  `⏱ 5 min · QCM MODULE 1 (vote oral)

OBJECTIF — Vérifier les notions clés du module.

DIRE — « Quatre questions. Votez à voix haute, A, B ou C, puis je clique. »

ANIMATION — Question 3 : faire le lien avec les réponses de l’atelier (1900).

TRANSITION — « Pause de quinze minutes. Ensuite, on installe et on configure Copilot proprement. »`,
  `⏱ 15 min · PAUSE · 10:55

DIRE — « Quinze minutes loin de l’écran. On reprend à 11 h 10 avec l’installation. »`,
];
// @@NOTES-END

