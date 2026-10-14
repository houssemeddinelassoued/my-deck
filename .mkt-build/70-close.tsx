// ─── Projet final & clôture ─────────────────────────────────────────────────

const F_Section: Page = () => (
  <Section
    n={7}
    big="GO"
    title={
      <>
        Projet final :
        <br />
        votre mini-campagne
      </>
    }
    sub="Cible → concept → contenus → visuels → diffusion → analyse. Tout ce que vous avez appris, assemblé de bout en bout."
    dur="16:05 – 17:00"
    kind="atelier"
  >
    <SecItem n={1}>Le brief du projet et le canevas</SecItem>
    <SecItem n={2}>Planifier la diffusion et choisir ses indicateurs</SecItem>
    <SecItem n={3}>Pitch de 3 minutes par binôme</SecItem>
    <SecItem n={4}>Votre bibliothèque de prompts</SecItem>
    <SecItem n={5}>Bilan, plan d’action, clôture</SecItem>
  </Section>
);
F_Section.transition = BLOOM;

// ─── Le brief du projet ─────────────────────────────────────────────────────
const FStep = ({ n, icon, tone, title, out, mod, d }: { n: number; icon: IconName; tone: Tone; title: string; out: string; mod: string; d: number }) => (
  <div className={A.pop} style={{ width: 252, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[tone]}`, padding: '20px 20px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{mod}</span>
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>
      {n}. {title}
    </div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft, minHeight: 84 }}>{out}</div>
  </div>
);

const F_Brief: Page = () => (
  <Frame mod={7} kind="atelier" label="Projet final · mini-campagne">
    <Title>Le brief : une mini-campagne complète, en 35 minutes</Title>
    <Lede>En binôme, sur Ardente ou votre marque. Réutilisez tout ce que vous avez produit aujourd’hui : rien ne repart de zéro.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <FStep n={1} icon="target" tone="blue" title="Cible" out="1 persona prioritaire, son étape du parcours" mod="M2" d={100} />
      <FStep n={2} icon="bulb" tone="violet" title="Concept" out="Slogan + idée en une phrase + objectif chiffré" mod="M3·M4" d={200} />
      <FStep n={3} icon="pen" tone="teal" title="Contenus" out="3 contenus : post, email, et un format au choix" mod="M3·M5" d={300} />
      <FStep n={4} icon="image" tone="pink" title="Visuels" out="1 visuel clé + 1 déclinaison, check-list passée" mod="M4" d={400} />
      <FStep n={5} icon="send" tone="green" title="Diffusion" out="Plan sur 2 semaines : quand, où, budget" mod="M2·M5" d={500} />
      <FStep n={6} icon="chart" tone="yellow" title="Analyse" out="3 KPI, objectifs, et ce qu’on testera" mod="M6" d={600} />
    </div>
    <svg width={1680} height={30} style={{ position: 'absolute', left: 120, top: 250 }} aria-hidden>
      <path d="M 126 15 H 1554" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M 126 15 H 1554" dur={5} r={7} color={C.electric} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24, alignItems: 'stretch' }}>
      <Timer id="projet" minutes={35} label="Projet final" cls={A.in} style={{ width: 560, ...dl(700) }} />
      <Callout title="Règles" tone="blue" icon="flag" cls={A.in} style={{ flex: 1, ...dl(800) }} size={23}>
        Un seul objectif chiffré. Uniquement des faits autorisés. Grille de relecture sur chaque contenu. À 16:40, chaque binôme présente en <strong>3 minutes</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Le canevas ─────────────────────────────────────────────────────────────
const FBox = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 22px', height: 268, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={36} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 20, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const F_Canevas: Page = () => (
  <Frame mod={7} label="Projet final · mini-campagne">
    <Title>Le canevas d’une page à remplir… et l’exemple Ardente</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <FBox n={1} tone="blue" title="Cible" d={100}>
        <strong style={{ color: C.ink }}>Claire</strong>, office manager de PME lyonnaise (50–200 sal.), étape <strong style={{ color: C.ink }}>considération</strong>.
      </FBox>
      <FBox n={2} tone="violet" title="Concept & objectif" d={200}>
        « La pause qui compte. » Le café qui fait parler les équipes. <strong style={{ color: C.ink }}>Objectif : 150 dégustations en novembre.</strong>
      </FBox>
      <FBox n={3} tone="teal" title="Contenus" d={300}>
        Post LinkedIn « 5 signes… » · newsletter de lancement · email direct aux ETI · script vidéo 30 s.
      </FBox>
      <FBox n={4} tone="pink" title="Visuels" d={400}>
        Tasse vue de dessus + bulle dans la mousse, palette crème / brun. Post 4:5, story 9:16, affiche A4.
      </FBox>
      <FBox n={5} tone="green" title="Diffusion" d={500}>
        S1 teasing · S2 lancement · S3 preuves · S4 relance. 900 € sponsorisés ciblés 50–200 salariés.
      </FBox>
      <FBox n={6} tone="yellow" title="Analyse" d={600}>
        Demandes de dégustation · taux de clic newsletter · coût par demande. Test A/B sur 2 objets d’email.
      </FBox>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 800, ...dl(800) }}>
      Astuce : demandez à l’IA de remplir le canevas à partir de toute la conversation de la journée, puis corrigez-le.
    </Hint>
  </Frame>
);

// ─── Planifier la diffusion ─────────────────────────────────────────────────
const FDiff = ({ beat, icon, tone, ch, when, budget, kpi }: { beat: number; icon: IconName; tone: Tone; ch: string; when: string; budget: string; kpi: string }) => (
  <div className={b.left(beat)} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 200px 1fr', gap: 18, alignItems: 'center', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '14px 22px', fontSize: 22, lineHeight: 1.35, color: C.soft }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, color: C.ink, fontSize: 23 }}>
      <IconTile name={icon} tone={tone} size={42} solid /> {ch}
    </span>
    <span>{when}</span>
    <span style={{ fontFamily: mono, fontSize: 20 }}>{budget}</span>
    <span>{kpi}</span>
  </div>
);

const F_Diffusion: Page = () => (
  <Frame mod={7} beats={5} label="Projet final · mini-campagne">
    <Title>Diffusion : quand, où, combien… et comment on mesure</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: '300px 1fr 200px 1fr', gap: 18, padding: '0 22px', boxSizing: 'border-box' }}>
      <Eyebrow c={C.muted} size={17}>Canal</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Quand</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Budget</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Indicateur clé</Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FDiff beat={1} icon="linkedin" tone="blue" ch="LinkedIn" when="Mar. et jeu., 8 h 30" budget="900 €" kpi="Coût par demande (< 25 €)" />
      <FDiff beat={2} icon="insta" tone="pink" ch="Instagram" when="Lun., mer., ven., 12 h" budget="0 €" kpi="Enregistrements, réponses en story" />
      <FDiff beat={3} icon="news" tone="teal" ch="Newsletter" when="Jeu. 4/11 et 25/11, 9 h" budget="0 €" kpi="Taux de clic (> 8 %)" />
      <FDiff beat={4} icon="mail" tone="green" ch="Email direct" when="S2, 20 ETI ciblées" budget="0 €" kpi="Taux de réponse, rendez-vous" />
      <FDiff beat={5} icon="flag" tone="navy" ch="Objectif global" when="Du 3 au 30 novembre" budget="900 €" kpi="150 demandes de dégustation" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 24 }}>
      <PromptBox title="prompt · plan de diffusion" size={18} cls={A.fade} style={{ flex: 1.3, ...dl(400) }}>
        Propose un plan de diffusion sur 4 semaines pour ces contenus : canal, jour et heure, budget, indicateur clé et seuil de réussite. Justifie les horaires pour une cible B2B.
      </PromptBox>
      <Callout title="Vérifiez" tone="yellow" icon="chart" cls={b.on(5)} style={{ flex: 1 }} size={22}>
        Les « meilleurs horaires » de l’IA sont génériques : vos propres statistiques font foi.
      </Callout>
    </div>
  </Frame>
);

// ─── Pitch et évaluation ────────────────────────────────────────────────────
const F_Pitch: Page = () => (
  <Frame mod={7} kind="exercice" label="Projet final · présentations">
    <Title>Pitch : 3 minutes pour convaincre la direction</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade}>
        Votre déroulé
      </Eyebrow>
      <SynthRow n={1} tone="blue" d={100}>
        <strong>30 s</strong> · la cible et l’objectif
      </SynthRow>
      <SynthRow n={2} tone="violet" d={180}>
        <strong>45 s</strong> · le concept et un visuel
      </SynthRow>
      <SynthRow n={3} tone="teal" d={260}>
        <strong>45 s</strong> · deux contenus lus à voix haute
      </SynthRow>
      <SynthRow n={4} tone="green" d={340}>
        <strong>30 s</strong> · diffusion et indicateurs
      </SynthRow>
      <SynthRow n={5} tone="coral" d={420}>
        <strong>30 s</strong> · une correction faite sur l’IA
      </SynthRow>
      <Timer id="pitch" minutes={3} label="Pitch" compact cls={A.in} style={{ marginTop: 14, ...dl(500) }} />
    </div>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 740, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 10, ...dl(200) }}>
        <Eyebrow c={C.navy} size={20} style={{ marginBottom: 4 }}>
          Grille du groupe
        </Eyebrow>
        <CheckItem id="pi1" size={22}>Cible précise et objectif chiffré</CheckItem>
        <CheckItem id="pi2" size={22}>Concept mémorisable</CheckItem>
        <CheckItem id="pi3" size={22}>Contenus adaptés à leurs canaux</CheckItem>
        <CheckItem id="pi4" size={22}>Visuels cohérents entre eux</CheckItem>
        <CheckItem id="pi5" size={22}>Diffusion et KPI réalistes</CheckItem>
        <CheckItem id="pi6" size={22}>Aucun fait inventé, risques maîtrisés</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 190, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CheckScore
          max={6}
          label="Score du binôme"
          style={{ boxShadow: SHADOW }}
          levels={[
            { min: 0, text: 'À retravailler.', tone: 'grey' },
            { min: 3, text: 'Solide : quelques ajustements.', tone: 'blue' },
            { min: 5, text: 'Prête à lancer !', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Après chaque pitch : un point fort et une suggestion par le groupe. Réinitialisez la grille (re-cliquez) entre deux binômes.
    </Hint>
  </Frame>
);

// ─── La bibliothèque de prompts ─────────────────────────────────────────────
const FPrompt = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', height: 112, boxSizing: 'border-box', ...dl(d) }}>
    <Num n={n} tone={tone} size={38} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const F_Biblio: Page = () => (
  <Frame mod={7} label="Clôture">
    <Title>Votre bibliothèque : les 10 prompts à garder</Title>
    <Lede>Vous les avez tous testés aujourd’hui. Gardez-les dans un document partagé avec votre équipe, et améliorez-les.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <FPrompt n={1} tone="navy" title="Les 6 ingrédients" d={60}>Rôle, contexte, cible, objectif, format, ton & exemple.</FPrompt>
      <FPrompt n={2} tone="blue" title="Pose-moi d’abord tes questions" d={120}>Avant toute tâche importante.</FPrompt>
      <FPrompt n={3} tone="teal" title="Persona à partir de mes données" d={180}>Avec hypothèses signalées et sans stéréotypes.</FPrompt>
      <FPrompt n={4} tone="violet" title="Calendrier éditorial en tableau" d={240}>Persona + ligne éditoriale + temps forts.</FPrompt>
      <FPrompt n={5} tone="pink" title="Critique puis réécris" d={300}>« Note sur 10, puis réécris pour obtenir 9. »</FPrompt>
      <FPrompt n={6} tone="yellow" title="Réécris dans notre ton" d={360}>Charte + 2 exemples, faits identiques.</FPrompt>
      <FPrompt n={7} tone="coral" title="Prompt image + exclusions" d={420}>Sujet, style, composition, lumière, palette, format.</FPrompt>
      <FPrompt n={8} tone="green" title="Brief créatif en 8 rubriques" d={480}>Avec les questions encore ouvertes.</FPrompt>
      <FPrompt n={9} tone="blue" title="Prompt maître multicanal" d={540}>Contexte, matière, tâche, contraintes, tableau.</FPrompt>
      <FPrompt n={10} tone="navy" title="Analyse : montre tes calculs" d={600}>« … et dis-moi ce que tu ne sais pas. »</FPrompt>
    </div>
  </Frame>
);

// ─── Auto-positionnement de fin ─────────────────────────────────────────────
const F_AutoPos: Page = () => (
  <Frame mod={7} kind="exercice" label="Clôture">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations qu’à 9 heures. Comparez avec votre score du matin.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="fp1">Citer trois usages concrets de l’IA dans mon métier</CheckItem>
        <CheckItem id="fp2">Écrire un prompt qui donne un résultat utilisable du premier coup</CheckItem>
        <CheckItem id="fp3">Faire générer un persona et un calendrier éditorial crédibles</CheckItem>
        <CheckItem id="fp4">Transformer une idée en post, email, article et script vidéo</CheckItem>
        <CheckItem id="fp5">Rédiger un prompt d’image et un brief créatif</CheckItem>
        <CheckItem id="fp6">Adapter un même message à LinkedIn, Instagram et une newsletter</CheckItem>
        <CheckItem id="fp7">Faire analyser des avis clients ou des résultats de campagne</CheckItem>
        <CheckItem id="fp8">Repérer une erreur, un biais ou un risque juridique dans un texte d’IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les fiches synthèse : on en reparle.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : pratiquez chaque semaine.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : à vous de jouer !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Combien de points gagnés depuis ce matin ? Partagez votre progression au groupe.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d’action ──────────────────────────────────────────────────────────
const FAct = ({ when, tone, icon, title, children, d }: { when: string; tone: Tone; icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 28px', ...dl(d) }}>
    <Tag tone={tone} size={20}>
      {when}
    </Tag>
    <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const F_Plan: Page = () => (
  <Frame mod={7} label="Clôture">
    <Title>Votre plan d’action : trois étapes, pas plus</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', gap: 26 }}>
      <FAct when="Dès lundi" tone="blue" icon="book" title="Partager la bibliothèque" d={100}>
        Créez le document de prompts de l’équipe et ajoutez-y votre charte de ton.
      </FAct>
      <FAct when="Ce mois-ci" tone="violet" icon="calendar" title="Un usage par semaine" d={250}>
        Choisissez une tâche récurrente (posts, newsletter, avis) et mesurez le temps gagné.
      </FAct>
      <FAct when="Ce trimestre" tone="green" icon="shieldCheck" title="Des règles communes" d={400}>
        Outils autorisés, données interdites, relecture obligatoire, mention IA : écrivez-les.
      </FAct>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, boxSizing: 'border-box', background: G.navy, borderRadius: 22, padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 30, color: '#fff', ...dl(600) }}>
      <Icon name="hand" size={60} color="#C9B6FF" />
      <div>
        <Eyebrow c="#C9B6FF" size={20}>
          Mon engagement
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 30, lineHeight: 1.4 }}>Écrivez sur un post-it la première tâche que vous confierez à l’IA lundi… et collez-le sur votre écran.</div>
      </div>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const F_Merci: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 860 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.navy }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, ...dl(150) }}>
        L’IA propose, <strong style={{ color: C.navy }}>le marketeur dispose</strong>. À vous de créer plus vite, et mieux.
      </p>
      <Portrait w={170} x={0} y={330} cls={A.in} />
      <div className={A.in} style={{ position: 'absolute', left: 230, top: 354, ...dl(300) }}>
        <Eyebrow c={C.muted} size={20}>
          Votre formateur
        </Eyebrow>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>{AUTHOR}</div>
        <div style={{ marginTop: 8, fontSize: 23, color: C.soft }}>Questions, retours d’expérience : je reste joignable après la formation.</div>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1300, top: 160, width: 500, ...dl(300) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce que j’utiliserai en premier…
      </Eyebrow>
      <Poll>
        <PollRow id="fm1" label="Calendrier éditorial" tone="blue" icon="calendar" />
        <PollRow id="fm2" label="Rédaction & déclinaisons" tone="violet" icon="pen" />
        <PollRow id="fm3" label="Visuels & briefs" tone="pink" icon="image" />
        <PollRow id="fm4" label="Analyse des résultats" tone="green" icon="chart" />
      </Poll>
      <div style={{ marginTop: 22, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Pensez à remplir l’évaluation de la formation avant de partir.</div>
    </div>
    <Footer left={390} />
  </Frame>
);
F_Merci.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [F_Section, F_Brief, F_Canevas, F_Diffusion, F_Pitch, F_Biblio, F_AutoPos, F_Plan, F_Merci];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION PROJET FINAL · 16:05

OBJECTIF — Lancer le projet final.

DIRE — « Dernière ligne droite. Le programme demande une mini-campagne : cible, concept, contenus, visuels, diffusion, analyse. Bonne nouvelle : vous avez déjà presque tout. Il s’agit d’assembler, de compléter la diffusion et l’analyse, et de présenter. »

TRANSITION — « Voici le brief. »`,
  `⏱ 2 min de consigne + 35 min de travail · BRIEF DU PROJET (minuteur 35 min)

OBJECTIF — Faire produire la mini-campagne de bout en bout.

DIRE — « Six étapes, chacune renvoie à un module de la journée. Cible : votre persona. Concept : slogan, idée, objectif chiffré. Contenus : trois, dont un post et un email. Visuels : un visuel clé et une déclinaison. Diffusion : un plan sur deux semaines. Analyse : trois indicateurs et un test. Trente-cinq minutes. Les règles : un objectif chiffré, des faits autorisés seulement, la grille de relecture. À 16:40, pitch de trois minutes. »

ANIMATION — Lancer le minuteur. Passer dans chaque binôme : à 10 min vérifier cible et objectif ; à 20 min les contenus ; à 30 min la diffusion et les KPI. Montrer la page suivante (canevas) aux binômes qui bloquent.

TRANSITION — « Pour vous aider, le canevas et l’exemple Ardente. »`,
  `⏱ 2 min · CANEVAS (à laisser affiché pendant le travail)

OBJECTIF — Donner un support de restitution d’une page.

DIRE — « Six cases, une page. Voici l’exemple Ardente, rempli avec ce qu’on a fait aujourd’hui. Astuce : demandez à l’IA de remplir ce canevas à partir de toute votre conversation de la journée, puis corrigez-le. Elle a tout en mémoire dans la conversation. »

TRANSITION — « Zoom sur l’étape que nous n’avons pas encore détaillée : la diffusion. »`,
  `⏱ 3 min · DIFFUSION (5 clics)

OBJECTIF — Couvrir l’étape « diffusion » du programme : plan, budget, indicateurs.

DIRE — → LinkedIn : jours et heures pour une cible B2B, budget, coût par demande cible. → Instagram. → Newsletter. → Email direct. → l’objectif global. « Chaque ligne a un indicateur et un seuil : sans seuil, on ne sait pas si c’est réussi. »

INSISTER — Les horaires proposés par l’IA sont des moyennes générales. Vos statistiques de page font foi.

TRANSITION — Laisser travailler, puis à 16:40 : « Place aux pitchs. »`,
  `⏱ 15 min · PITCHS (3 min par binôme, minuteur)

OBJECTIF — Présenter la mini-campagne et recevoir un retour du groupe.

DIRE — « Trois minutes par binôme, comme devant votre direction. Le déroulé à gauche : cible et objectif, concept et visuel, deux contenus lus à voix haute, diffusion et indicateurs, et une correction que vous avez faite sur l’IA. Ce dernier point est important : il montre votre regard professionnel. »

ANIMATION — Lancer le minuteur pour chaque binôme. Le groupe coche la grille ; décocher entre deux binômes. Après chaque pitch : un point fort, une suggestion. Si le groupe est grand, faire pitcher 4 ou 5 binômes et les autres en 1 minute.

TRANSITION — « Bravo à tous. Avant de partir, votre boîte à outils. »`,
  `⏱ 2 min · BIBLIOTHÈQUE DE PROMPTS

OBJECTIF — Récapituler les outils réutilisables de la journée.

DIRE — « Dix prompts, tous testés aujourd’hui. » Les parcourir rapidement. « Mettez-les dans un document partagé avec l’équipe, avec votre charte de ton. C’est cette bibliothèque, enrichie semaine après semaine, qui fait la différence dans la durée. »

TRANSITION — « Mesurons votre progression. »`,
  `⏱ 2 min · AUTO-POSITIONNEMENT FINAL (exercice)

OBJECTIF — Mesurer la progression (dispositif d’évaluation).

DIRE — « Les mêmes huit affirmations qu’à neuf heures. Cochez ce que vous savez faire maintenant. Comparez avec votre score du matin. » Demander à quelques volontaires leur progression.

TRANSITION — « Et maintenant, comment continuer ? »`,
  `⏱ 2 min · PLAN D’ACTION

OBJECTIF — Ancrer le transfert en situation de travail.

DIRE — « Trois étapes, pas plus. Dès lundi : partager la bibliothèque. Ce mois-ci : un usage par semaine, en mesurant le temps gagné. Ce trimestre : écrire des règles communes avec votre équipe : outils autorisés, données interdites, relecture, mention IA. » « Et l’engagement : un post-it avec la première tâche que vous confierez à l’IA lundi. »

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 2 min · MERCI

OBJECTIF — Clore la journée.

DIRE — « Merci pour votre énergie. Retenez notre fil conducteur : l’IA propose, le marketeur dispose. Elle vous fait gagner du temps sur le premier jet ; votre valeur, c’est la stratégie, le regard critique et la connaissance de vos clients. » Faire voter : « Qu’utiliserez-vous en premier ? »

ANIMATION — Rappeler l’évaluation de la formation. Rester disponible pour les questions individuelles.`,
];
// @@NOTES-END
