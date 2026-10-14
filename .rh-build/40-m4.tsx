// ─── Module 4 · Préparer et conduire les entretiens ─────────────────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Des entretiens préparés,
        <br />
        structurés, équitables
      </>
    }
    sub="Un entretien structuré prédit bien mieux la réussite dans le poste qu’une conversation libre. L’IA rend la préparation rapide ; elle peut même jouer le candidat."
    dur="13:30 – 14:40 · simulation incluse"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · simulation d’entretien avec l’IA
      </Tag>
    }
  >
    <SecItem n={1}>Construire un guide d’entretien en sept temps</SecItem>
    <SecItem n={2}>Générer des questions et les adapter au poste</SecItem>
    <SecItem n={3}>Les questions qu’on n’a pas le droit de poser</SecItem>
    <SecItem n={4}>Préparer une grille d’évaluation</SecItem>
    <SecItem n={5}>Simuler un entretien, puis se faire débriefer</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Construire un guide d’entretien ────────────────────────────────────────
const M4_PHASES = [
  { t: 'Accueil', m: 3, tone: 'grey' as Tone, d: 'Mettre à l’aise, annoncer le déroulé' },
  { t: 'Le poste', m: 5, tone: 'blue' as Tone, d: 'Présenter Solvéa, l’équipe, le poste' },
  { t: 'Le parcours', m: 8, tone: 'teal' as Tone, d: 'Faire raconter, relier au poste' },
  { t: 'Compétences', m: 15, tone: 'violet' as Tone, d: 'Questions comportementales par critère' },
  { t: 'Mise en situation', m: 8, tone: 'yellow' as Tone, d: 'Un appel client difficile, joué' },
  { t: 'Ses questions', m: 4, tone: 'green' as Tone, d: 'Ce que le candidat veut savoir' },
  { t: 'Conclusion', m: 2, tone: 'navy' as Tone, d: 'Prochaines étapes, délai de réponse' },
];

const M4_Guide: Page = () => {
  const total = M4_PHASES.reduce((a, p) => a + p.m, 0);
  return (
    <Frame mod={4} beats={1}>
      <Title>Construire un guide d’entretien : sept temps, 45 minutes</Title>
      <Lede>Même déroulé, mêmes questions de base pour tous les candidats : c’est la condition de l’équité et de la comparaison.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', height: 64, borderRadius: 14, overflow: 'hidden', boxShadow: SHADOW_SM }}>
        {M4_PHASES.map((p, i) => (
          <div
            key={p.t}
            className={A.grow}
            style={{ width: `${(p.m / total) * 100}%`, background: STRONG[p.tone], display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 800, fontSize: 20, ...dl(100 + i * 90) }}
          >
            {p.m}’
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 360, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14 }}>
        {M4_PHASES.map((p, i) => (
          <div key={p.t} className={A.in} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[p.tone]}`, padding: '18px 16px', ...dl(400 + i * 90) }}>
            <Num n={i + 1} tone={p.tone} size={36} />
            <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{p.t}</div>
            <div style={{ marginTop: 6, fontSize: 18, color: C.muted, lineHeight: 1.35 }}>{p.d}</div>
          </div>
        ))}
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680 }}>
        <PromptPanel title="prompt · guide d’entretien" size={20}>
          <Pk>RÔLE · </Pk>Tu es recruteur·se expérimenté·e. <Pk c="#8EE6D4">CONTEXTE · </Pk>Offre : <V>offre</V> · Grille de critères : <V>grille</V>.
          {'\n'}
          <Pk c="#FFD27A">TÂCHE · </Pk>Construis un guide d’entretien de 45 minutes en 7 temps (accueil, poste, parcours, compétences, mise en situation, questions du candidat,
          conclusion) avec la durée, l’objectif et les questions de chaque temps.
          {'\n'}
          <Pk c="#FFA8A8">CONTRAINTES · </Pk>2 questions comportementales par critère. Aucune question sur la vie privée. <Pk c="#C9B6FF">FORMAT · </Pk>tableau.
        </PromptPanel>
      </div>
    </Frame>
  );
};

// ─── Générer des questions : la méthode STAR ────────────────────────────────
const M4Q = ({ q, look, tone }: { q: string; look: string[]; tone: Tone }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '24px 28px' }}>
      <Eyebrow c={T[tone].fg} size={18}>
        La question
      </Eyebrow>
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: C.navy }}>« {q} »</div>
    </div>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px' }}>
      <Eyebrow c={C.green} size={18}>
        Ce qu’on cherche à entendre
      </Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {look.map((l) => (
          <Bullet key={l} size={22} tone="green">
            {l}
          </Bullet>
        ))}
      </div>
    </div>
  </div>
);

const M4_Questions: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Générer des questions : quatre familles, une méthode</Title>
    <Lede>Demandez à l’IA des questions par famille, avec pour chacune les indices d’une bonne réponse.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', gap: 14 }}>
      {[
        { l: 'S', t: 'Situation', d: 'le contexte' },
        { l: 'T', t: 'Tâche', d: 'le rôle de la personne' },
        { l: 'A', t: 'Action', d: 'ce qu’elle a fait, elle' },
        { l: 'R', t: 'Résultat', d: 'ce qui s’est passé ensuite' },
      ].map((s, i) => (
        <div key={s.l} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, background: T.violet.bg, borderRadius: 14, padding: '12px 18px', ...dl(i * 80) }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.violet, lineHeight: 1 }}>{s.l}</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{s.t}</div>
            <div style={{ fontSize: 18, color: C.muted }}>{s.d}</div>
          </div>
        </div>
      ))}
    </div>
    <Tabs initial="comp" cls={A.in} style={{ position: 'absolute', left: 120, top: 370, width: 1680, ...dl(200) }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <TabBtn id="comp" icon="loop" tone="violet">
          Comportementale (passé)
        </TabBtn>
        <TabBtn id="situ" icon="target" tone="blue">
          Situationnelle (futur)
        </TabBtn>
        <TabBtn id="tech" icon="tool" tone="teal">
          Technique / métier
        </TabBtn>
        <TabBtn id="moti" icon="heart" tone="pink">
          Motivation
        </TabBtn>
      </div>
      <TabPane id="comp">
        <M4Q tone="violet" q="Racontez-moi la dernière fois qu’un client vous a parlé de façon agressive. Qu’avez-vous fait ?" look={['Un exemple réel et précis, pas une généralité', 'Ce que la personne a fait, elle (« je », pas « on »)', 'Calme, écoute, reformulation, solution', 'Un résultat, et ce qu’elle en a appris']} />
      </TabPane>
      <TabPane id="situ">
        <M4Q tone="blue" q="Un client appelle pour la troisième fois : son chauffage ne marche toujours pas et aucun technicien n’est libre avant jeudi. Que faites-vous ?" look={['Reconnaître l’émotion avant de parler solution', 'Chercher des options : dépannage provisoire, conseil', 'Ne pas promettre ce qu’on ne peut pas tenir', 'Escalader au bon moment']} />
      </TabPane>
      <TabPane id="tech">
        <M4Q tone="teal" q="Voici un message client mal rédigé et en colère. Vous avez 5 minutes pour lui répondre par écrit." look={['Orthographe, clarté, ton adapté', 'Réponse à toutes les questions posées', 'Une prochaine étape concrète', 'Longueur raisonnable']} />
      </TabPane>
      <TabPane id="moti">
        <M4Q tone="pink" q="Qu’est-ce qui vous donnerait envie de rester chez nous dans deux ans ?" look={['Ce qui motive vraiment la personne', 'Cohérence avec ce que le poste peut offrir', 'Projection réaliste', 'Questions en retour sur l’entreprise']} />
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Adapter les questions au poste ─────────────────────────────────────────
const M4_Adapter: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Adapter les questions au poste : même critère, autre réalité</Title>
    <Lede>Prompt : « Adapte cette question au poste <V>poste</V>, avec une situation réelle de chez nous. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, background: T.grey.bg, borderRadius: 18, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
      <Tag tone="grey" size={20}>
        Question générique
      </Tag>
      <span style={{ fontSize: 28, fontWeight: 600, color: C.soft }}>« Comment gérez-vous la pression ? »</span>
      <span style={{ marginLeft: 'auto', fontSize: 21, color: T.coral.fg, fontWeight: 600 }}>→ réponse toute faite garantie</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 400, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <div className={b.on(1)} style={{ background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '26px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="phone" tone="teal" size={52} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{JOB_A}</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 26, lineHeight: 1.45, color: C.ink }}>
          « Lundi 8 h, vague de froid : 40 appels en attente, dont des personnes âgées sans chauffage. Comment organisez-vous votre matinée ? »
        </div>
        <div style={{ marginTop: 14, fontSize: 21, color: T.teal.fg, fontWeight: 600 }}>Révèle : priorisation, empathie, sang-froid</div>
      </div>
      <div className={b.on(2)} style={{ background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.violet}`, padding: '26px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="code" tone="violet" size={52} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{JOB_B}</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 26, lineHeight: 1.45, color: C.ink }}>
          « Le portail client est en panne un vendredi à 17 h, et le service client vous appelle toutes les dix minutes. Racontez une situation comparable vécue. »
        </div>
        <div style={{ marginTop: 14, fontSize: 21, color: T.violet.fg, fontWeight: 600 }}>Révèle : diagnostic, communication, gestion des urgences</div>
      </div>
    </div>
  </Frame>
);

// ─── Questions autorisées / interdites ──────────────────────────────────────
const M4_Interdites: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Autorisée ou interdite ? Les questions à risque</Title>
    <Lede>Lien direct et nécessaire avec le poste exigé (Code du travail, art. L.1221-6). Cliquez pour le verdict.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Verdict ok={false} q="Avez-vous des enfants ? Comment ferez-vous pour la garde ?" why="Situation familiale : critère discriminatoire. On peut en revanche présenter les horaires et demander s’ils conviennent." />
      <Verdict ok q="Le poste demande un samedi par mois : est-ce compatible avec votre organisation ?" why="Question liée à une condition réelle du poste, posée à tous les candidats." />
      <Verdict ok={false} q="Vous avez un léger accent, vous êtes d’où ?" why="Origine : critère discriminatoire, même posé « par curiosité »." />
      <Verdict ok={false} q="Êtes-vous syndiqué·e ? Que pensez-vous des grèves ?" why="Activités syndicales et opinions : critères interdits." />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14, ...dl(150) }}>
      <Verdict ok q="Racontez-moi une erreur que vous avez faite et ce que vous en avez retiré." why="Question comportementale classique, liée aux compétences." />
      <Verdict ok={false} q="Prévoyez-vous un congé maternité prochainement ?" why="Grossesse, situation de famille : interdit, et la candidate n’a aucune obligation d’en parler." />
      <Verdict mid ok q="Quel est votre niveau d’anglais ?" why="Autorisée si le poste l’exige réellement (clients anglophones). Sinon, sans lien avec le poste." />
      <Verdict ok={false} q="Quel âge avez-vous ? Vous comptez travailler encore combien d’années ?" why="Âge : critère discriminatoire, y compris de façon détournée." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, ...dl(400) }}>
      <Callout title="Le réflexe" tone="violet" icon="sparkles" size={22}>
        Ajoutez au prompt : <strong>« Vérifie qu’aucune question ne porte sur la vie privée, la santé, l’origine, l’âge, la famille ou les opinions. »</strong>
      </Callout>
    </div>
  </Frame>
);

// ─── Grille d’évaluation ────────────────────────────────────────────────────
const M4Anchor = ({ n, tone, t }: { n: number; tone: Tone; t: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <Num n={n} tone={tone} size={32} />
    <span style={{ fontSize: 19, lineHeight: 1.35, color: C.ink }}>{t}</span>
  </div>
);

const M4_Grille: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Préparer une grille d’évaluation à indicateurs observables</Title>
    <Lede>Chaque note est ancrée sur un comportement décrit. On note juste après l’entretien, avant d’en parler.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr) 200px', gap: 16, paddingBottom: 12, borderBottom: `2px solid ${C.rule}`, fontFamily: display, fontWeight: 700, fontSize: 17, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
        <span>Critère · question</span>
        <span>1 · insuffisant</span>
        <span>2 · partiel</span>
        <span>3 · attendu</span>
        <span>4 · remarquable</span>
        <span>Notes / preuve</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr) 200px', gap: 16, padding: '16px 0', borderBottom: `1px solid ${C.rule}`, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>Gestion des tensions</div>
          <div style={{ fontSize: 18, color: C.muted }}>« le client agressif »</div>
        </div>
        <M4Anchor n={1} tone="coral" t="Pas d’exemple, ou rejette la faute sur le client" />
        <M4Anchor n={2} tone="yellow" t="Exemple vague, actions peu décrites" />
        <M4Anchor n={3} tone="blue" t="Exemple précis : écoute, reformule, propose" />
        <M4Anchor n={4} tone="green" t="Idem + désamorce et transforme en satisfaction" />
        <div style={{ height: 70, borderRadius: 10, background: T.grey.bg, boxShadow: `inset 0 0 0 1.5px ${C.rule}` }} />
      </div>
      <div className={b.on(1)} style={{ display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr) 200px', gap: 16, padding: '16px 0', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>Expression écrite</div>
          <div style={{ fontSize: 18, color: C.muted }}>« réponse en 5 min »</div>
        </div>
        <M4Anchor n={1} tone="coral" t="Nombreuses fautes, message confus" />
        <M4Anchor n={2} tone="yellow" t="Correct mais ne répond pas à tout" />
        <M4Anchor n={3} tone="blue" t="Clair, complet, ton adapté" />
        <M4Anchor n={4} tone="green" t="Idem + concis, rassurant, prochaine étape claire" />
        <div style={{ height: 70, borderRadius: 10, background: T.grey.bg, boxShadow: `inset 0 0 0 1.5px ${C.rule}` }} />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1680, display: 'flex', gap: 24 }}>
      <Callout title="Avec l’IA" tone="violet" icon="sparkles" size={22} style={{ flex: 1 }}>
        « Pour chaque critère, décris 4 niveaux par des comportements observables. »
      </Callout>
      <Callout title="Sans l’IA" tone="green" icon="humanCheck" size={22} style={{ flex: 1 }}>
        La note elle-même : c’est vous qui l’attribuez, preuves à l’appui.
      </Callout>
    </div>
  </Frame>
);

// ─── Simuler un entretien ───────────────────────────────────────────────────
const M4_Simuler: Page = () => (
  <Frame mod={4} kind="demo" beats={3}>
    <Title>Simuler un entretien : l’IA joue le candidat</Title>
    <Lede>Pour s’entraîner à relancer, à creuser, à rester neutre… sans mobiliser un vrai candidat.</Lede>
    <PromptPanel title="prompt · jeu de rôle" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 700 }}>
      <Pk>JEU DE RÔLE · </Pk>Tu joues Alex, candidat·e au poste <V>poste</V> chez Solvéa. Profil : <V>cv_fictif</V>.
      {'\n'}
      <Pk c="#FFD27A">COMPORTEMENT · </Pk>Réponds de façon réaliste. Reste vague au début : ne donne des détails que si je relance avec une bonne question. Une réponse à la fois,
      4 phrases maximum.
      {'\n'}
      <Pk c="#FFA8A8">FIN · </Pk>Quand j’écris « FIN », sors du rôle et évalue mes questions : ouvertes ou fermées, relances, neutralité, questions interdites éventuelles.
    </PromptPanel>
    <div style={{ position: 'absolute', left: 870, top: 262, width: 930, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bubble who="user" w={700} name="Vous · recruteur" cls={A.in} size={23} style={dl(200)}>
        Parlez-moi d’une situation difficile avec un client.
      </Bubble>
      <Bubble who="agent" w={700} name="Alex · IA" cls={A.in} size={23} style={dl(350)}>
        Oh, il y en a eu pas mal… Je dirais que je reste toujours calme et que je trouve une solution.
      </Bubble>
      <Bubble who="user" w={700} name="Vous · recruteur" cls={b.on(1)} size={23}>
        Prenez la dernière. Que s’est-il passé exactement, et qu’avez-vous fait, vous ?
      </Bubble>
      <Bubble who="agent" w={700} name="Alex · IA" cls={b.on(2)} size={23}>
        Un client attendait un remboursement depuis un mois. Je l’ai laissé parler, j’ai vérifié le dossier pendant l’appel et j’ai obtenu une validation de mon responsable le jour même.
      </Bubble>
      <div className={b.on(3)}>
        <Tag tone="green" size={21}>
          <Icon name="checkCircle" size={22} /> La relance précise a fait émerger un exemple STAR complet
        </Tag>
      </div>
    </div>
  </Frame>
);

// ─── Débrief ────────────────────────────────────────────────────────────────
const M4_Debrief: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>« FIN » : l’IA sort du rôle et débriefe le recruteur</Title>
    <AIPanel title="Débrief de votre entretien simulé" size={22} cls={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1000 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <strong style={{ color: T.green.fg }}>✓ Points forts.</strong> Relance précise sur « la dernière fois » ; vous avez fait préciser le « je ». Bonne présentation du poste.
        </div>
        <div>
          <strong style={{ color: T.yellow.fg }}>⚠ À améliorer.</strong> 4 questions fermées sur 11 (« Vous êtes à l’aise au téléphone ? »). Vous avez suggéré la réponse une fois
          (« Vous restez calme, j’imagine ? »).
        </div>
        <div>
          <strong style={{ color: T.coral.fg }}>✗ Vigilance.</strong> « Vous habitez loin ? » : le lieu de résidence est un critère sensible. Préférez « Les horaires 8 h – 18 h vous
          conviennent-ils ? »
        </div>
        <div>
          <strong style={{ color: T.violet.fg }}>Question à essayer.</strong> « Qu’auriez-vous fait différemment ? »
        </div>
      </div>
    </AIPanel>
    <div style={{ position: 'absolute', left: 1170, top: 200, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="users" title="Trois usages de la simulation" cls={A.right} style={dl(200)} size={22}>
        Former un manager qui recrute pour la première fois · tester un nouveau guide d’entretien · préparer un entretien délicat.
      </Card>
      <Callout title="Et en vrai entretien ?" tone="coral" icon="lock" cls={A.right} style={dl(350)} size={22}>
        Enregistrer ou transcrire un entretien réel avec un outil d’IA suppose d’informer le candidat, d’obtenir son accord et d’utiliser un outil validé.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="3"
    title="Simulation d’entretien avec l’IA"
    defi="entretien"
    who="En trinôme · l’IA joue le candidat"
    minutes={25}
    where={
      <>
        <strong>1 guide d’entretien</strong> de 45 min, <strong>1 grille d’évaluation</strong> à indicateurs, <strong>1 simulation</strong> de 10 minutes et son débrief
        par l’IA et par l’observateur.
      </>
    }
    objective={<>Préparer un entretien avec l’IA (questions, grille, mise en situation), puis le mener face à un·e candidat·e joué·e par l’IA.</>}
    crit={
      <>
        <CheckItem id="a3c1" size={22}>Questions comportementales pour chaque critère</CheckItem>
        <CheckItem id="a3c2" size={22}>Aucune question interdite</CheckItem>
        <CheckItem id="a3c3" size={22}>Au moins deux relances STAR</CheckItem>
        <CheckItem id="a3c4" size={22}>Grille remplie avec des preuves</CheckItem>
      </>
    }
  >
    <div>1. Générez le guide et la grille à partir de votre offre et de votre grille de critères (10 min).</div>
    <div>2. Lancez le prompt « jeu de rôle » : un·e mène l’entretien, l’IA joue Alex (10 min).</div>
    <div>3. L’observateur note les questions fermées, suggestives, interdites.</div>
    <div>4. Tapez « FIN » : comparez le débrief de l’IA et celui de l’observateur.</div>
    <Bonus>Rejouez avec un·e candidat·e « difficile » : très bavard·e, ou qui pose une question sur le salaire dès la première minute.</Bonus>
  </LabPage>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <Frame mod={4} kind="quiz">
    <Title>Quiz : l’entretien structuré</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi poser les mêmes questions de base à tous les candidats ?" explain="L’entretien structuré permet de comparer sur la même base et réduit l’influence des impressions et des biais.">
        <QOpt>Pour gagner du temps de préparation</QOpt>
        <QOpt ok>Pour comparer équitablement et limiter les biais</QOpt>
        <QOpt>Parce que la loi l’impose mot pour mot</QOpt>
      </QuizQ>
      <QuizQ q="« Vous êtes à l’aise au téléphone ? » est une question…" explain="Fermée et suggestive : tout candidat répondra oui. Préférez une question comportementale qui demande un exemple.">
        <QOpt>Comportementale</QOpt>
        <QOpt ok>Fermée et suggestive</QOpt>
        <QOpt>Situationnelle</QOpt>
      </QuizQ>
      <QuizQ q="Dans STAR, le « A » désigne…" explain="Action : ce que la personne a fait, elle, et non l’équipe. C’est le cœur de la réponse.">
        <QOpt>L’attitude du candidat</QOpt>
        <QOpt ok>Les actions de la personne elle-même</QOpt>
        <QOpt>L’analyse du recruteur</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez transcrire automatiquement un vrai entretien. Il faut d’abord…" explain="Information et accord du candidat, outil validé par l’entreprise, durée de conservation définie : ce sont des données personnelles.">
        <QOpt>Rien, si l’outil est gratuit</QOpt>
        <QOpt ok>Informer le candidat et obtenir son accord, avec un outil validé</QOpt>
        <QOpt>Supprimer la transcription après la décision</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M4_Synthese: Page = () => (
  <Frame mod={4} kind="synthese">
    <Title>Ce qu’on retient du module 4</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="navy" d={100}>
        Un <strong>guide en sept temps</strong>, le même pour tous les candidats.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Des questions <strong>comportementales et situationnelles</strong>, adaptées au poste, creusées en <strong>STAR</strong>.
      </SynthRow>
      <SynthRow n={3} tone="coral" d={300}>
        Aucune question sans <strong>lien direct avec le poste</strong> : vie privée, origine, âge, santé, opinions.
      </SynthRow>
      <SynthRow n={4} tone="teal" d={400}>
        Une <strong>grille à indicateurs observables</strong>, remplie avec des preuves.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        La <strong>simulation</strong> avec l’IA entraîne le recruteur et teste le guide.
      </SynthRow>
    </div>
    <ReflexCard title="Mon réflexe · M4">
      Quand une réponse reste générale, je relance : <strong>« Prenez la dernière fois. Qu’avez-vous fait, vous ? »</strong>
    </ReflexCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Guide, M4_Questions, M4_Adapter, M4_Interdites, M4_Grille, M4_Simuler, M4_Debrief, M4_Atelier, M4_Quiz, M4_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M4 · 13:30

OBJECTIF — Relancer l’énergie après le déjeuner, annoncer le module entretiens.

DIRE — « Rebonjour ! Cet après-midi, on échange et on accompagne. Premier sujet : l’entretien. Les recherches en psychologie du travail le montrent depuis longtemps : un entretien structuré, avec les mêmes questions et une grille, prédit bien mieux la réussite dans le poste qu’une conversation libre. Le problème, c’est que ça prend du temps à préparer. L’IA règle ce problème. Et elle peut même jouer le candidat pour vous entraîner. »

TRANSITION — « Commençons par le guide. »`,
  `⏱ 5 min · GUIDE D’ENTRETIEN (1 clic)

OBJECTIF — Donner la structure d’un entretien en sept temps et le prompt pour la produire.

DIRE — « Quarante-cinq minutes, sept temps. Regardez la barre : le plus gros bloc, quinze minutes, c’est l’exploration des compétences. Et huit minutes de mise en situation : pour la relation client, un appel difficile joué. » Clic : « Le prompt : on donne l’offre et la grille du module 3, et on demande deux questions comportementales par critère. Aucune question sur la vie privée : on le dit explicitement. »

TRANSITION — « Quelles questions poser ? »`,
  `⏱ 6 min · QUATRE FAMILLES DE QUESTIONS (onglets)

OBJECTIF — Distinguer les familles de questions et introduire la méthode STAR.

DIRE — « STAR : Situation, Tâche, Action, Résultat. Une bonne réponse comportementale contient les quatre. » Cliquer chaque onglet. « Comportementale : on demande un exemple passé réel. Situationnelle : une situation future, propre à Solvéa. Technique : une mise en situation écrite. Motivation : ce qui ferait rester la personne. Pour chaque question, demandez à l’IA ce qu’on cherche à entendre : c’est ce qui vous permettra de noter. »

TRANSITION — « Ces questions, il faut les adapter au poste. »`,
  `⏱ 4 min · ADAPTER AU POSTE (2 clics)

OBJECTIF — Montrer la puissance d’une question contextualisée.

DIRE — « “Comment gérez-vous la pression ?” Tout candidat a sa réponse toute prête. » Clic : « Pour le poste de relation client : lundi 8 h, vague de froid, quarante appels en attente. Là, il faut réfléchir. » Clic : « Pour le développeur : le portail en panne un vendredi à 17 h. Même critère, autre réalité. »

ANIMATION — Demander au groupe une question générique qu’ils posent souvent, et la faire adapter en direct par l’IA.

TRANSITION — « Attention : l’IA peut aussi proposer des questions que vous n’avez pas le droit de poser. »`,
  `⏱ 6 min · AUTORISÉE OU INTERDITE ? (cartes à cliquer)

OBJECTIF — Connaître les limites légales des questions d’entretien.

DIRE — « Le principe : article L.1221-6 du Code du travail, les informations demandées doivent avoir un lien direct et nécessaire avec le poste ou l’évaluation des aptitudes. Huit questions : votez, puis je clique. »

ANIMATION — Pour chaque carte, faire voter à main levée avant de cliquer. Le cas de l’anglais est « selon le poste » : c’est le lien avec le poste qui compte. Insister : la question sur la garde d’enfants est souvent posée « par bienveillance », mais elle reste discriminatoire. L’alternative : présenter les horaires et demander s’ils conviennent, à tous les candidats.

TRANSITION — « Questions prêtes. Comment noter les réponses ? »`,
  `⏱ 5 min · GRILLE D’ÉVALUATION (2 clics)

OBJECTIF — Montrer une grille à indicateurs comportementaux.

DIRE — « Chaque niveau est décrit par un comportement observable. Niveau 1 : pas d’exemple, ou rejette la faute sur le client. Niveau 4 : désamorce et transforme en satisfaction. Deux recruteurs qui utilisent cette grille donneront des notes beaucoup plus proches. » Clic : deuxième critère. Clic : « L’IA rédige les indicateurs ; la note, c’est vous qui la mettez, preuves à l’appui. »

INSISTER — Noter juste après l’entretien, avant d’en discuter avec un collègue : sinon le premier avis exprimé influence l’autre.

TRANSITION — « Et maintenant, entraînons-nous. »`,
  `⏱ 5 min · SIMULER UN ENTRETIEN (démo, 3 clics)

OBJECTIF — Montrer le jeu de rôle avec l’IA en candidat.

DIRE — « Le prompt : l’IA joue Alex. Consigne clé : rester vague au début, et ne donner des détails que si on relance bien. Comme un vrai candidat. Le mot “FIN” déclenche le débrief. » Clic après la réponse vague d’Alex : « Comment relancer ? » Laisser proposer. Clic : la relance précise. Clic : « Et l’exemple STAR complet sort. »

ANIMATION — Idéalement, faire la démonstration en direct, avec un volontaire du groupe dans le rôle du recruteur.

TRANSITION — « Ce qui est précieux, c’est le débrief. »`,
  `⏱ 3 min · DÉBRIEF PAR L’IA

OBJECTIF — Montrer l’IA comme coach du recruteur, et rappeler le cadre des vrais entretiens.

DIRE — « Après “FIN”, l’IA sort du rôle : points forts, questions fermées, une question suggestive, et une vigilance sur une question sensible. C’est un excellent outil pour former un manager qui recrute pour la première fois. » Puis la vigilance : « En vrai entretien, transcrire ou enregistrer avec une IA suppose d’informer le candidat, son accord, et un outil validé. »

TRANSITION — « À vous de jouer, en trinôme. »`,
  `⏱ 25 min · ATELIER 3 · SIMULATION (minuteur)

OBJECTIF — Préparer un entretien avec l’IA et le mener en simulation.

CONSIGNE À DIRE — « Trinômes : un recruteur qui mène l’entretien, un observateur qui note les questions, un évaluateur qui remplit la grille ; l’IA joue le candidat. Dix minutes de préparation, dix minutes de simulation, cinq minutes de débrief. Si le temps le permet, on tourne les rôles. »

ANIMATION — Lancer le minuteur. Annoncer les bascules : « préparation terminée », « tapez FIN ». Passer voir les observateurs : leur rappeler de noter les questions fermées.

DÉBRIEF — Demander à deux trinômes : quelle remarque de l’IA vous a surpris ? L’observateur humain a-t-il vu des choses que l’IA n’a pas vues ? (Souvent : le non-verbal, le ton, l’écoute.)`,
  `⏱ 3 min · QUIZ M4

ANIMATION — Une question à la fois, vote, clic.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE M4

DIRE — Relire les cinq lignes. « Et la relance magique : “Prenez la dernière fois. Qu’avez-vous fait, vous ?” »

TRANSITION — « L’entretien est fait. Reste à répondre à chaque candidat : c’est le module 5. »`,
];
// @@NOTES-END
