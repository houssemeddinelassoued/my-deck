// ─── A3 · Divider ───────────────────────────────────────────────────────────
const A3_Divider: Page = () => (
  <Section n={8} title={<>Atelier 3 ·<br />Mini‑charte éthique IA</>} sub="Une page, cinq rubriques, des règles vérifiables. Puis la rétroaction de vos collègues." dur="≈ 45 min" kind="atelier">
    <SecItem n={1}>Vos principes, avec vos mots</SecItem>
    <SecItem n={2}>Vos règles d’usage et vos données</SecItem>
    <SecItem n={3}>Vos rôles et votre suivi</SecItem>
    <SecItem n={4}>La critique de l’IA, puis celle de vos collègues</SecItem>
  </Section>
);
A3_Divider.transition = BLOOM;

// ─── A3 · Brief ─────────────────────────────────────────────────────────────
const A3Line = ({ n, name, hint }: { n: number; name: string; hint: string }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 0', borderTop: `1.5px dashed ${C.rule}` }}>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.blue, width: 30 }}>{n}</span>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 27, color: C.ink, width: 250, flex: 'none' }}>{name}</span>
    <span style={{ fontSize: 22, color: C.faint, fontStyle: 'italic' }}>{hint}</span>
  </div>
);

const A3_Brief: Page = () => (
  <Frame mod={8} kind="atelier" label="Atelier 3 · Consignes">
    <Title>Votre mission : une charte vivante, pas vitrine</Title>
    <Lede>
      <ByClient
        apsm="Pour la mine Val-Laurier, ou pour votre organisation, sans détail confidentiel. Le modèle est dans le Chat."
        sobeys="Pour une épicerie comme la vôtre, ou pour votre service, sans détail confidentiel. Le modèle est dans le Chat."
      />
    </Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 290, width: 860, boxSizing: 'border-box', background: '#FFFEFA', borderRadius: 12, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '24px 32px 14px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Icon name="shieldCheck" size={34} color={C.teal} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>Mini-charte éthique IA · [Organisation]</span>
      </div>
      <A3Line n={1} name="Nos principes" hint="3 à 5, avec nos mots" />
      <A3Line n={2} name="Nos règles d’usage" hint="permis · interdit · sur accord" />
      <A3Line n={3} name="Nos données" hint="vert · jaune · rouge" />
      <A3Line n={4} name="Nos rôles" hint="qui approuve, qui répond" />
      <A3Line n={5} name="Notre suivi" hint="incidents, révision le…" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1040, top: 290, width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '10px 30px 4px', ...dl(250) }}>
      <PlanRow n={1} mins="8 min" d={300}>
        Principes
      </PlanRow>
      <PlanRow n={2} mins="10 min" d={380}>
        Règles et données
      </PlanRow>
      <PlanRow n={3} mins="7 min" d={460}>
        Rôles et suivi
      </PlanRow>
      <PlanRow n={4} mins="5 min" d={540}>
        La critique de l’IA
      </PlanRow>
      <PlanRow n="★" mins="11 min" d={620}>
        Présentations et rétroaction
      </PlanRow>
    </div>
    <Callout cls={A.in} title="Le test de chaque phrase" tone="yellow" icon="search" size={26} style={{ position: 'absolute', left: 120, top: 830, width: 1680, padding: '14px 26px', ...dl(700) }}>
      Peut-on vérifier si elle est respectée ? Si non, réécrivez-la.
    </Callout>
  </Frame>
);

// ─── A3 · Step 1: principles ────────────────────────────────────────────────
const A3Chip = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, fontFamily: display, fontWeight: 700, fontSize: 27, color: T[tone].fg }}>
    <Icon name={icon} size={26} />
    {children}
  </span>
);

const A3_Step1: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 1 sur 4"
    title="Étape 1 · Vos principes, avec vos mots"
    timerId="a3-s1"
    minutes={8}
    timerLabel="Principes"
    side={
      <NoteCard>
        <NoteLine>3 à 5 principes, pas plus</NoteLine>
        <NoteLine>Pour chacun : « Chez nous, cela veut dire que… »</NoteLine>
        <NoteLine>Un exemple concret par principe</NoteLine>
      </NoteCard>
    }
  >
    <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(150) }}>
      <Eyebrow c={C.muted} size={21}>
        Choisissez parmi les six
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', columnGap: 16, rowGap: 14 }}>
        <A3Chip icon="scale" tone="violet">
          Équité
        </A3Chip>
        <A3Chip icon="eye" tone="teal">
          Transparence
        </A3Chip>
        <A3Chip icon="lock" tone="blue">
          Vie privée
        </A3Chip>
        <A3Chip icon="shieldCheck" tone="green">
          Fiabilité
        </A3Chip>
        <A3Chip icon="humanCheck" tone="yellow">
          Contrôle humain
        </A3Chip>
        <A3Chip icon="flag" tone="coral">
          Responsabilité
        </A3Chip>
      </div>
    </div>
    <Eyebrow cls={A.in} c={C.muted} size={21} style={dl(300)}>
      Exemple de reformulation
    </Eyebrow>
    <div className={A.in} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...dl(350) }}>
      <Callout title="Trop vague" tone="coral" icon="x" size={25} style={{ padding: '14px 24px' }}>
        « Nous valorisons la transparence. »
      </Callout>
      <Callout title="Vérifiable" tone="green" icon="check" size={25} style={{ padding: '14px 24px' }}>
        <ByClient
          apsm="« Une alerte de l’IA n’entraîne jamais de sanction : une personne vérifie, puis échange avec le travailleur. »"
          sobeys="« Un client sait toujours, dès le premier message, qu’il échange avec une IA. »"
        />
      </Callout>
    </div>
  </WorkStep>
);

// ─── A3 · Step 2: rules and data ────────────────────────────────────────────
const A3Col = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 20px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const A3_Step2: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 2 sur 4"
    title="Étape 2 · Vos règles d’usage et vos données"
    timerId="a3-s2"
    minutes={10}
    timerLabel="Règles et données"
    side={
      <NoteCard>
        <NoteLine>3 usages permis, 3 interdits, 2 sur accord</NoteLine>
        <NoteLine>Le feu tricolore : 2 exemples par couleur</NoteLine>
        <NoteLine>Les outils approuvés, nommés</NoteLine>
      </NoteCard>
    }
  >
    <div style={{ display: 'flex', gap: 16 }}>
      <A3Col d={150} icon="check" tone="green" title="Permis">
        <ByClient
          apsm="Premier jet d’une fiche de prévention, résumé d’un rapport anonymisé, traduction d’une consigne."
          sobeys="Description de produit, résumé d’un document public, premier jet d’un courriel."
        />
      </A3Col>
      <A3Col d={250} icon="x" tone="coral" title="Interdit">
        <ByClient
          apsm="Diffuser une consigne de sécurité non validée, décider d’une sanction, coller un rapport d’accident nominatif."
          sobeys="Coller des données de clients ou d’employés, décider seul d’un refus, reconnaître un client à son visage."
        />
      </A3Col>
      <A3Col d={350} icon="key" tone="yellow" title="Sur accord">
        <ByClient
          apsm="Tout outil qui capte l’image, la voix ou des données biométriques des travailleurs."
          sobeys="Toute offre personnalisée fondée sur un profil, tout nouvel outil."
        />
      </A3Col>
    </div>
    <div className={A.in} style={{ display: 'flex', gap: 16, ...dl(450) }}>
      <Tag tone="green" size={24}>
        <Icon name="check" size={24} /> Vert · tout outil
      </Tag>
      <Tag tone="yellow" size={24}>
        <Icon name="shieldCheck" size={24} /> Jaune · outil approuvé
      </Tag>
      <Tag tone="coral" size={24}>
        <Icon name="lock" size={24} /> Rouge · jamais tel quel
      </Tag>
    </div>
    <Hint cls={A.in} style={{ fontSize: 24, ...dl(550) }}>
      Les exemples ci-dessus sont des pistes : adaptez-les à votre organisation.
    </Hint>
  </WorkStep>
);

// ─── A3 · Step 3: roles and follow-up ───────────────────────────────────────
const A3_Step3: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 3 sur 4"
    title="Étape 3 · Vos rôles et votre suivi"
    lede="Des fonctions plutôt que des prénoms, si vous travaillez sur votre organisation."
    timerId="a3-s3"
    minutes={7}
    timerLabel="Rôles et suivi"
    side={
      <NoteCard>
        <NoteLine>Au moins trois rôles nommés</NoteLine>
        <NoteLine>Une adresse ou une personne pour signaler</NoteLine>
        <NoteLine>Une date de révision</NoteLine>
      </NoteCard>
    }
  >
    <DoRow n={1} d={150}>
      <b>Qui approuve</b> un nouveau projet ou un nouvel outil d’IA ?
    </DoRow>
    <DoRow n={2} d={250}>
      <b>Qui répond</b> de chaque système en service ?
    </DoRow>
    <DoRow n={3} d={350}>
      <b>À qui signaler</b> un doute ou un incident, sans crainte de reproche ?
    </DoRow>
    <DoRow n={4} d={450}>
      <b>Quel indicateur</b> suivre ? Par exemple : le nombre d’incidents, de plaintes, de décisions révisées.
    </DoRow>
    <DoRow n={5} d={550}>
      <b>Quand</b> réviser la charte ?
    </DoRow>
  </WorkStep>
);

// ─── A3 · Step 4: ask the AI to critique ────────────────────────────────────
const A3_Step4: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 4 sur 4"
    title="Étape 4 · Demandez à l’IA de critiquer votre charte"
    timerId="a3-s4"
    minutes={5}
    timerLabel="Critique"
    side={
      <NoteCard>
        <NoteLine>Les critiques que vous retenez</NoteLine>
        <NoteLine>Celles que vous rejetez, et pourquoi</NoteLine>
        <NoteLine>Une phrase réécrite</NoteLine>
      </NoteCard>
    }
  >
    <PromptBox label="À copier depuis le Chat" size={25} cls={A.in} style={dl(150)}>
      Voici une mini-charte éthique IA. Joue le rôle d’un auditeur exigeant. 1) Quelles règles sont impossibles à vérifier ? 2) Que manque-t-il au regard de la Loi 25 du Québec ? 3) Quelle règle risque d’être contournée ? Réponds en cinq points courts. [collez votre charte]
    </PromptBox>
    <Callout cls={A.in} title="Avant de coller" tone="coral" icon="lock" size={25} style={dl(300)}>
      Aucun nom de personne ni détail confidentiel : des fonctions, pas des prénoms.
    </Callout>
    <Callout cls={A.in} title="Vous restez l’auteur" tone="blue" icon="humanCheck" size={25} style={dl(400)}>
      L’IA propose, vous tranchez. Gardez seulement ce qui vous convainc.
    </Callout>
  </WorkStep>
);

// ─── A3 · Share and cross feedback ──────────────────────────────────────────
const A3Crit = ({ d, icon, q }: { d: number; icon: IconName; q: string }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 76, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <IconTile name={icon} tone="teal" size={46} />
    <span style={{ fontSize: 26, color: C.ink }}>{q}</span>
  </div>
);

const A3_Share: Page = () => (
  <Frame mod={8} kind="atelier" label="Atelier 3 · Présentations">
    <Title>Présentations et rétroaction croisée</Title>
    <Lede>Deux ou trois volontaires présentent leur charte en partage d’écran, deux minutes chacun.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Le volontaire présente" sub="Deux minutes : la règle dont il est le plus fier" d={100} />
      <AskCard n={2} title="Un point fort, une piste" sub="Une ou deux personnes réagissent au micro" d={220} />
      <AskCard n={3} title="Participant suivant" sub="Les autres déposent leur charte dans le Chat" d={340} />
    </div>
    <Timer id="a3-share" minutes={11} label="Présentations" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
    <div className={A.in} style={{ position: 'absolute', left: 1000, top: 280, width: 800, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 32px 8px', ...dl(200) }}>
      <Eyebrow c={T.teal.fg} size={22}>
        Grille de rétroaction
      </Eyebrow>
      <div style={{ marginTop: 12 }}>
        <A3Crit d={300} icon="search" q="Les règles sont-elles vérifiables ?" />
        <A3Crit d={380} icon="users" q="Des responsables sont-ils nommés ?" />
        <A3Crit d={460} icon="lock" q="Les données sensibles sont-elles protégées ?" />
        <A3Crit d={540} icon="humanCheck" q="Un humain peut-il réviser une décision ?" />
        <A3Crit d={620} icon="calendar" q="La charte a-t-elle une date de révision ?" />
      </div>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [A3_Divider, A3_Brief, A3_Step1, A3_Step2, A3_Step3, A3_Step4, A3_Share];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DE L'ATELIER 3 (≈ 15 h · SOBEYS : ≈ 11 h)

OBJECTIF — Élaborer une mini-charte éthique pour encadrer l'usage de l'IA en organisation (objectif officiel n° 5), puis la présenter et recevoir une rétroaction croisée.

DIRE — « Dernier atelier, et le plus engageant : votre mini-charte éthique IA. Une page, cinq rubriques, des règles vérifiables. Chacun la sienne. APSM : pour la mine Val-Laurier de l'atelier 2, ou pour votre organisation. Sobeys : pour une épicerie comme la vôtre, ou pour votre service. Toujours sans détail confidentiel. Puis deux ou trois volontaires la présentent, et on se fait une rétroaction croisée. »

TRANSITION — « Voici le modèle. »`,
  `⏱ 3 min · CONSIGNES

CHAT — Collez le modèle dans le Chat :
« MINI-CHARTE ÉTHIQUE IA · [Organisation] — Version 1 · révision le [date]
1. NOS PRINCIPES (3 à 5) — [Principe] : chez nous, cela veut dire que…
2. NOS RÈGLES D'USAGE — Permis : … / Interdit : … / Sur accord : …
3. NOS DONNÉES — Vert (tout outil) : … / Jaune (outil approuvé) : … / Rouge (jamais tel quel) : … / Outils approuvés : …
4. NOS RÔLES — Approuve les projets : … / Répond de chaque système : … / Reçoit les signalements : …
5. NOTRE SUIVI — Indicateur : … / Révision : … »

DIRE — « À gauche, les cinq rubriques, vues au module 7. À droite, le déroulé : 8, 10, 7 et 5 minutes, puis 11 minutes de présentations. Votre livrable : la charte, dans un document à vous. »

LE TEST — « Pour chaque phrase : peut-on vérifier si elle est respectée ? Si non, réécrivez-la. »

CHOIX — Ceux qui travaillent sur leur organisation : des fonctions plutôt que des prénoms, aucun détail confidentiel (ils vont la coller dans une IA à l'étape 4).

TRANSITION — « Étape 1 : les principes. »`,
  `⏱ 8 min · ÉTAPE 1 : PRINCIPES

ANIMATION — Lancez le minuteur. Chacun choisit 3 à 5 principes parmi les six (ou dans la Déclaration de Montréal) et écrit pour chacun : « Chez nous, cela veut dire que… ».

DIRE — Montrez l'exemple : « "Nous valorisons la transparence" : trop vague, invérifiable. "Un membre sait toujours, dès le premier message, qu'il échange avec une IA" : vérifiable. »

POINT D'ÉTAPE — À 4 min : « Combien de principes reformulés : 1, 2, 3 ? »

RELANCE — Si quelqu'un bloque : « Repensez au cas de l'atelier 2 : quel principe, écrit noir sur blanc, aurait tout changé ? »

TRANSITION — « Étape 2 : les règles et les données. »`,
  `⏱ 10 min · ÉTAPE 2 : RÈGLES ET DONNÉES

ANIMATION — Lancez le minuteur. Trois colonnes de règles (permis, interdit, sur accord), puis le feu tricolore avec deux exemples par couleur, et les outils approuvés.

DIRE — « Les exemples à l'écran sont des pistes. »
APSM — Permis : un premier jet de fiche de prévention, le résumé d'un rapport d'inspection anonymisé, la traduction d'une consigne. Interdit : diffuser une consigne de sécurité que personne de compétent n'a validée, décider d'une sanction, coller un rapport d'accident nominatif dans un outil gratuit. Sur accord : tout outil qui capte l'image, la voix ou des données biométriques des travailleurs (le cas de l'atelier 2), avec le comité de santé et de sécurité.
SOBEYS — Permis : une description de produit, le résumé d'un document public, le premier jet d'un courriel. Interdit : coller des données de clients ou d'employés, décider seul d'un refus, reconnaître un client à son visage (le cas de l'atelier 2). Sur accord : toute offre personnalisée fondée sur un profil (profilage annoncé et désactivé par défaut, art. 8.1), tout nouvel outil.

ATTENTION — Une charte qui interdit tout pousse à l'usage caché. Encouragez au moins trois usages permis, concrets.

POINT D'ÉTAPE — À 5 min : « Règles faites ? Feu tricolore commencé ? »

TRANSITION — « Étape 3 : qui fait quoi. »`,
  `⏱ 7 min · ÉTAPE 3 : RÔLES ET SUIVI

ANIMATION — Lancez le minuteur. Cinq questions à l'écran, une réponse chacune.

DIRE — « Reprenez les six rôles du module 7. Au minimum : qui approuve, qui répond de chaque système, à qui on signale. Et une date de révision : sans date, la charte meurt. »

INDICATEURS POSSIBLES — Nombre d'incidents signalés ; nombre de décisions révisées après contestation ; part des projets passés par l'EFVP ; écart de résultats entre groupes pour un système de tri.

POINT D'ÉTAPE — À 4 min : « Combien de rôles nommés ? »

TRANSITION — « Étape 4 : on fait relire par une IA… et on garde l'esprit critique. »`,
  `⏱ 5 min · ÉTAPE 4 : CRITIQUE PAR L'IA

ANIMATION — Collez le texte à copier dans le Chat. Lancez le minuteur.
« Voici une mini-charte éthique IA. Joue le rôle d'un auditeur exigeant. 1) Quelles règles sont impossibles à vérifier ? 2) Que manque-t-il au regard de la Loi 25 du Québec ? 3) Quelle règle risque d'être contournée ? Réponds en cinq points courts. [collez votre charte] »

DIRE — « Avant de coller : aucun nom, aucun détail confidentiel. Puis lisez la critique… avec les réflexes de ce matin. L'IA peut se tromper sur la Loi 25 ! Gardez seulement ce qui vous convainc, et réécrivez une phrase. »

SOBEYS — Dites « de la matinée 1 » au lieu de « de ce matin ».

CE QU'ILS VONT OBSERVER — Des critiques souvent pertinentes (règles vagues, absence de recours, de date) ; parfois des obligations inventées ou des références légales approximatives : bon rappel du module 1.

TRANSITION — « Présentations. »`,
  `⏱ 11 min · PRÉSENTATIONS ET RÉTROACTION CROISÉE

ANIMATION — Lancez le minuteur. Demandez deux ou trois volontaires. Chacun partage son écran et présente sa charte en 2 minutes, en insistant sur la règle dont il est le plus fier. Après chaque présentation, une ou deux personnes donnent au micro un point fort et une piste, en s'appuyant sur la grille de droite. Puis « Participant suivant ». Les autres peuvent déposer leur charte dans le Chat (version sans détail confidentiel) pour que chacun reparte avec plusieurs exemples.

VOTRE RÔLE — Synthétisez après chaque passage en une phrase, à partir de la grille : vérifiable ? nommé ? données protégées ? révision humaine ? date ?

SI PERSONNE NE SE PORTE VOLONTAIRE — Présentez vous-même une charte « à améliorer » (par exemple celle de la Mutuelle sans les règles 6 et 8) et demandez au groupe ce qui manque.

TRANSITION — « Merci à nos volontaires. Il est temps de faire le bilan de la journée. »

SOBEYS — Dites « le bilan de nos deux matinées ».`,
];
// @@NOTES-END
