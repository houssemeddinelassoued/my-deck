// ─── Ouverture ──────────────────────────────────────────────────────────────

// Cover: five everyday tasks, "avant / avec l'IA" bars shrinking.
const OCoverTask = ({ icon, tone, label, before, after, y, d }: { icon: IconName; tone: Tone; label: string; before: number; after: number; y: number; d: number }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 470, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <div style={{ flex: 1, fontSize: 23, fontWeight: 600, color: C.ink }}>{label}</div>
    </div>
    <div style={{ marginTop: 10, marginLeft: 62, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ height: 10, width: before * 7, borderRadius: 5, background: C.rule }} />
        <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{before} min</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className={A.grow} style={{ height: 10, width: after * 7, borderRadius: 5, background: STRONG[tone], ...dl(d + 500) }} />
        <span style={{ fontFamily: mono, fontSize: 17, fontWeight: 700, color: STRONG[tone] }}>{after} min avec l’IA</span>
      </div>
    </div>
  </div>
);

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 120, width: 920 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="smile" size={22} /> Niveau débutant
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        L’IA pour
        <br />
        <span style={{ color: C.plum }}>l’assistant administratif</span>
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 28, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Gagner du temps et améliorer son efficacité : rédiger, résumer, organiser et analyser{' '}
        <strong style={{ color: C.navy }}>avec un assistant IA, en toute sécurité</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={700} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 720, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · efficacité administrative</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="violet" size={19}>
          <Icon name="chat" size={19} /> Prompts
        </Tag>
        <Tag tone="teal" size={19}>
          <Icon name="mail" size={19} /> Emails
        </Tag>
        <Tag tone="blue" size={19}>
          <Icon name="doc" size={19} /> Synthèses
        </Tag>
        <Tag tone="yellow" size={19}>
          <Icon name="table" size={19} /> Tableaux
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1360, top: 150, width: 470, height: 760 }}>
      <Eyebrow c={C.navy} size={19} cls={A.fade} style={{ marginBottom: 22 }}>
        Temps passé · exemples typiques
      </Eyebrow>
      <OCoverTask icon="mail" tone="teal" label="Répondre à une réclamation" before={20} after={5} y={50} d={400} />
      <OCoverTask icon="doc" tone="blue" label="Compte rendu de réunion" before={45} after={12} y={190} d={520} />
      <OCoverTask icon="bell" tone="violet" label="Relancer trois clients" before={25} after={6} y={330} d={640} />
      <OCoverTask icon="table" tone="yellow" label="Synthèse d’un tableau de suivi" before={30} after={8} y={470} d={760} />
      <OCoverTask icon="calendar" tone="green" label="Préparer l’ordre du jour" before={15} after={4} y={610} d={880} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Bienvenue & promesse ───────────────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Une journée pour travailler autrement</Title>
    <Lede>Aucune connaissance technique requise : si vous savez écrire un email, vous savez parler à une IA.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de pratique : chaque notion est testée tout de suite sur un cas de bureau" tone="blue" d={150} />
      <OPromise value={<CountUp to={6} />} label="modules, du premier prompt jusqu’aux tableaux de données" tone="violet" d={280} />
      <OPromise value={<CountUp to={20} suffix="+" />} label="prompts prêts à l’emploi dans votre bibliothèque personnelle" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec une méthode, une bibliothèque de prompts et des modèles réutilisables dès lundi.
        Je montre, vous pratiquez : <strong>c’est vous qui tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA prépare, vous vérifiez, vous signez. »
    </div>
  </Frame>
);

// ─── Tour de table (sondage) ────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : d’où partez-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        J’ai déjà utilisé…
      </Eyebrow>
      <Poll>
        <PollRow id="o-t1" label="ChatGPT" tone="green" icon="chat" />
        <PollRow id="o-t2" label="Microsoft Copilot" tone="blue" icon="chat" />
        <PollRow id="o-t3" label="Gemini" tone="violet" icon="chat" />
        <PollRow id="o-t4" label="Le Chat (Mistral) ou un autre" tone="yellow" icon="chat" />
        <PollRow id="o-t5" label="Jamais essayé : je découvre" tone="grey" icon="smile" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce qui me prend le plus de temps
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="Les emails : écrire, répondre, relancer" tone="teal" icon="mail" />
        <PollRow id="o-a2" label="Les comptes rendus et les synthèses" tone="blue" icon="doc" />
        <PollRow id="o-a3" label="Les plannings, réunions et agendas" tone="green" icon="calendar" />
        <PollRow id="o-a4" label="Les tableaux et le reporting" tone="yellow" icon="table" />
        <PollRow id="o-a5" label="Chercher l’information dans les documents" tone="violet" icon="search" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      On garde ces résultats en tête : on insistera sur les deux tâches les plus votées.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OGoal = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs : à la fin de la journée, vous saurez…</Title>
    <Lede>Dix objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="chat" tone="blue" title="Demander" d={100}>
        <Bullet size={22}>Utiliser efficacement un assistant IA</Bullet>
        <Bullet size={22}>Rédiger des prompts adaptés aux tâches administratives</Bullet>
        <Bullet size={22}>Repérer les tâches que l’IA peut assister</Bullet>
      </OGoal>
      <OGoal icon="pen" tone="violet" title="Rédiger" d={220}>
        <Bullet size={22} tone="violet">Rédiger et reformuler emails et courriers</Bullet>
        <Bullet size={22} tone="violet">Produire comptes rendus et synthèses</Bullet>
        <Bullet size={22} tone="violet">Créer des modèles réutilisables</Bullet>
      </OGoal>
      <OGoal icon="layers" tone="green" title="Organiser" d={340}>
        <Bullet size={22} tone="green">Analyser et exploiter des documents</Bullet>
        <Bullet size={22} tone="green">Créer et améliorer tableaux et documents</Bullet>
        <Bullet size={22} tone="green">Organiser son activité avec l’IA</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Sécuriser" d={460}>
        <Bullet size={22} tone="coral">Utiliser l’IA de manière sécurisée</Bullet>
        <Bullet size={22} tone="coral">Vérifier chaque résultat avant de l’utiliser</Bullet>
        <Bullet size={22} tone="coral">Protéger les données personnelles</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, productions d’atelier, cas fil rouge final, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 78, fontFamily: mono, fontSize: 21, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="chat" tone="violet" title="Matin · Bien demander" sub="L’IA, les prompts, les écrits" d={0}>
        <OSlot t="9:00" title="Ouverture · objectifs · règles du jeu" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Découvrir l’IA dans les métiers administratifs" sub="Apports, limites, outils · atelier 5 tâches" tone="blue" d={230} />
        <OSlot t="10:15" title="Pause" tone="grey" d={310} />
        <OSlot t="10:30" mod="M2" title="Maîtriser les prompts" sub="Structure, contexte, format · atelier bibliothèque" tone="violet" d={390} />
        <OSlot t="11:30" mod="M3" title="Emails, courriers, communication" sub="Rédiger, reformuler, relancer · atelier" tone="teal" d={470} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="layers" tone="green" title="Après-midi · Bien produire" sub="Documents, organisation, données" d={200}>
        <OSlot t="13:30" mod="M4" title="Documents, comptes rendus et synthèses" sub="Résumer, extraire, comparer · atelier CR" tone="navy" d={350} />
        <OSlot t="14:30" mod="M5" title="IA et organisation du travail" sub="Journée, priorités, réunions, modèles" tone="green" d={430} />
        <OSlot t="15:10" title="Pause" tone="grey" d={510} />
        <OSlot t="15:20" mod="M6" title="IA, tableaux et données" sub="Analyser, nettoyer, préparer un reporting" tone="yellow" d={590} />
        <OSlot t="16:00" mod="★" title="Cas fil rouge et bonnes pratiques" sub="De la demande au suivi · sécurité · bilan" tone="coral" d={670} />
        <OSlot t="17:00" title="Fin de la journée" tone="grey" d={750} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 puis ★ l’après-midi.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice en fin de journée.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Expliquer ce qu’une IA générative sait faire… et ce qu’elle ne sait pas faire</CheckItem>
        <CheckItem id="ap2">Écrire une demande précise avec contexte, contraintes et format attendu</CheckItem>
        <CheckItem id="ap3">Faire rédiger ou reformuler un email dans le bon ton</CheckItem>
        <CheckItem id="ap4">Transformer des notes de réunion en compte rendu avec plan d’action</CheckItem>
        <CheckItem id="ap5">Faire extraire des informations précises d’un long document</CheckItem>
        <CheckItem id="ap6">Faire résumer un tableau de chiffres et en vérifier le résultat</CheckItem>
        <CheckItem id="ap7">Réutiliser des modèles de prompts au lieu de repartir de zéro</CheckItem>
        <CheckItem id="ap8">Dire quelles informations ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Utilisateur occasionnel : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus des ateliers.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression à 17 h.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Règles du jeu & persona ────────────────────────────────────────────────
const O_Regles: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Règles du jeu et outils de la journée</Title>
    <Lede>Un seul assistant IA suffit : prenez celui que votre organisation autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 980, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA ouvert : ChatGPT, Copilot, Gemini ou Le Chat</CheckItem>
        <CheckItem id="su2" size={26}>De préférence le compte professionnel fourni par l’employeur</CheckItem>
        <CheckItem id="su3" size={26}>Un traitement de texte et un tableur (Word / Excel ou équivalent)</CheckItem>
        <CheckItem id="su4" size={26}>Un document vierge pour coller vos meilleurs prompts</CheckItem>
        <CheckItem id="su5" size={26}>Les données fictives de la formation, aucune donnée réelle</CheckItem>
      </div>
    </Checklist>
    <div style={{ position: 'absolute', left: 1160, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <Eyebrow c={C.navy} size={19}>
          Notre terrain de jeu (fictif)
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', gap: 18, alignItems: 'center' }}>
          <IconTile name="org" tone="violet" size={64} solid />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Les Ateliers Morel</div>
            <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.4 }}>PME de 85 salariés · mobilier de bureau · Nantes</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          Vous êtes <strong style={{ color: C.navy }}>Nadia</strong>, assistante de direction de M. Garnier. Tous les exemples de la journée viennent de son bureau.
        </div>
      </div>
      <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={24}>
        Aucune donnée réelle de client, de collègue ou de contrat pendant les exercices. On travaille sur des cas inventés.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Welcome, O_Poll, O_Objectifs, O_Programme, O_AutoPos, O_Regles];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir le groupe et donner tout de suite le ton : concret, utile, accessible.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va parler d’un outil qui peut vous faire gagner plusieurs heures par semaine : l’intelligence artificielle générative. Regardez à droite : une réponse à une réclamation, un compte rendu, des relances, une synthèse de tableau, un ordre du jour. Ce sont des tâches que vous faites toutes les semaines. Les durées sont des ordres de grandeur, pas des promesses : mais l’écart est réel, et ce soir vous saurez le reproduire. »

ANIMATION — Laisser les barres se réduire. Ne pas commenter chaque ligne : demander « Qui reconnaît sa semaine dans cette liste ? »

TRANSITION — « Avant de commencer, quelques mots sur la journée. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Se présenter, poser le contrat pédagogique et le fil conducteur.

DIRE — « Je suis votre formateur pour la journée. Ma promesse tient en trois chiffres : sept heures de pratique, six modules, et plus de vingt prompts que vous emporterez dans votre bibliothèque personnelle. Aucune compétence technique n’est nécessaire : si vous savez écrire un email clair, vous savez parler à une IA. Notre contrat : je montre, vous pratiquez. Et le fil conducteur, que vous allez entendre souvent : l’IA prépare, vous vérifiez, vous signez. C’est toujours vous qui êtes responsable de ce qui part. »

INSISTER — Rassurer les débutants : on part de zéro, personne ne sera mis en difficulté.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les outils déjà utilisés et les tâches les plus chronophages pour adapter les exemples.

DIRE — « Premier vote, main levée : quels assistants IA avez-vous déjà utilisés, même une seule fois ? » Compter, cliquer. « Deuxième vote : qu’est-ce qui vous prend le plus de temps dans votre semaine ? Vous pouvez voter deux fois. »

ANIMATION — Cliquer une ligne par main levée. Noter les deux tâches les plus votées et y faire référence pendant la journée (« vous l’aviez voté ce matin… »). Si un participant n’a jamais utilisé d’IA, le rassurer et le mettre en binôme avec quelqu’un de plus habitué.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les dix objectifs du programme, regroupés en quatre gestes faciles à retenir.

DIRE — « Le programme compte dix objectifs. Pour les retenir, je les range en quatre gestes. Demander : savoir parler à l’IA et repérer les tâches où elle aide. Rédiger : emails, courriers, comptes rendus, modèles. Organiser : documents, tableaux, planning. Et sécuriser : vérifier les résultats et protéger les données. Ce dernier geste n’est pas en option : on y revient dans chaque module. »

TRANSITION — « Voici comment la journée est découpée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée.

DIRE — « Le matin, on apprend à bien demander : comprendre l’IA, construire un prompt, puis l’appliquer à vos écrits. L’après-midi, on apprend à bien produire : documents et comptes rendus, organisation, tableaux. On termine par un cas fil rouge qui reprend toute la journée, de la réception d’une demande jusqu’à son suivi, et par les bonnes pratiques de sécurité. Le bandeau en haut à droite vous indique toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe, mais protéger le temps des ateliers.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, comme le demande le dispositif d’évaluation.

DIRE — « Huit affirmations, une par grande compétence de la journée. Cochez uniquement ce que vous savez faire aujourd’hui, seul et sans chercher. Notez votre score sur un coin de feuille : on refera exactement le même exercice à la fin de la journée. »

ANIMATION — Faire cocher un volontaire à l’écran, ou laisser chacun noter sur papier. Repérer les scores élevés : leur proposer les bonus des ateliers et un rôle d’entraide.

TRANSITION — « Dernière étape avant de commencer : les règles du jeu. »`,
  `⏱ 3 min · RÈGLES DU JEU ET PERSONA

OBJECTIF — Vérifier les outils et présenter le contexte fictif utilisé dans tous les exemples.

DIRE — « Pour pratiquer, il vous faut un assistant IA ouvert : idéalement le compte professionnel fourni par votre employeur, parce qu’il protège mieux vos données. Et un document vierge où coller vos meilleurs prompts : ce sera votre bibliothèque. Tous nos exemples viennent d’une entreprise inventée : les Ateliers Morel, une PME nantaise. Vous êtes Nadia, assistante de direction. Et la règle d’or : aucune donnée réelle pendant les exercices. »

ANIMATION — Faire cocher la liste. Si un participant n’a pas d’accès, il travaille en binôme. Expliquer brièvement qu’on reviendra en détail sur la confidentialité au module final.

TRANSITION — « Tout le monde est prêt ? Module 1 : découvrir l’IA dans les métiers administratifs. »`,
];
// @@NOTES-END
