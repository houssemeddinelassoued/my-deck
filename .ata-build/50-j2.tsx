// ═══ Jour 2 · Reprise ════════════════════════════════════════════════════════

const J2_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <Squares s={300} x={1400} y={300} delay={200} />
    <div style={{ position: 'absolute', left: 120, top: 360, width: 1100 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA135 · Jour 2
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 120, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Aujourd’hui,
        <br />
        on construit
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        Concevoir, construire, tester et déployer un workflow automatisé avec une étape IA
      </p>
    </div>
    <Footer2 />
  </Frame>
);
J2_Cover.transition = BLOOM;

const J2_Rappel: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Reprise · Quiz éclair">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Ce qui reste d’hier
    </Title>
    <Qcm
      multi
      q="Parmi ces affirmations, lesquelles sont vraies ?"
      explain="On décrit d’abord les étapes, on préfère le connecteur au robot, on ferme les choix de l’IA et on confie le doute à un humain. Ces quatre réflexes guident toute la journée."
    >
      <Opt ok why="Oui : P d’abord (les étapes), puis O et C, puis I et S. On part de ce qu’on fait.">
        Un SIPOC se remplit en commençant par les étapes (P)
      </Opt>
      <Opt why="Piège ! Quand l’application a une API, le connecteur est plus rapide et plus robuste. Le RPA est le plan B.">
        Un robot RPA est le premier choix, même si l’application a une API
      </Opt>
      <Opt why="Piège ! Sans liste fermée, l’IA invente des catégories différentes pour la même chose : impossible à router.">
        Un prompt de workflow doit laisser l’IA libre de nommer les catégories
      </Opt>
      <Opt ok why="Oui : sous le seuil de confiance, la demande va dans une file « à vérifier ». Le reste passe automatiquement.">
        Sous un seuil de confiance, la demande est confiée à un humain
      </Opt>
    </Qcm>
  </Frame>
);

const J2Step = ({ n, t, h, tone, d, children }: { n: number; t: string; h: string; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '90px 70px 1fr 1fr', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 24px', ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 22, color: C.muted }}>{h}</span>
    <Num n={pad(n)} tone={tone} size={50} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{t}</span>
    <span style={{ fontSize: 23, color: C.soft }}>{children}</span>
  </div>
);

const J2_Programme: Page = () => (
  <Frame mod={0} label="Reprise · Programme du jour 2">
    <Title>Le fil de la journée : votre workflow, de l’idée à la production</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <J2Step d={100} n={6} h="9:15" tone="yellow" t="Un premier flux">
        Démo Power Automate, puis votre premier scénario Make
      </J2Step>
      <J2Step d={200} n={7} h="10:30" tone="teal" t="Méthodologie de conception">
        La fiche de conception de votre tâche
      </J2Step>
      <J2Step d={300} n={8} h="11:10" tone="blue" t="Construire un workflow">
        Sources, déclencheurs, actions, étape IA, routeur
      </J2Step>
      <J2Step d={400} n={9} h="13:30" tone="yellow" t="Un scénario complet">
        Trois scénarios au choix selon votre niveau
      </J2Step>
      <J2Step d={500} n={10} h="15:00" tone="green" t="Tester, optimiser, déployer">
        Plan de test, gain mesuré, documentation
      </J2Step>
    </div>
    <Callout cls={A.in} title="Votre carnet" icon="note" tone="blue" style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(700) }}>
      Gardez-le ouvert : rubriques 4 (fiche de conception) et 5 (tests et gain) se remplissent aujourd’hui.
    </Callout>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Rappel, J2_Programme];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · ACCUEIL DU JOUR 2

DIRE — « Bonjour ! Hier, on a repéré et compris. Aujourd'hui, on construit. »

LOGISTIQUE — Vérifiez le son et la caméra. Demandez : « Qui a eu un souci de compte Make ou de clé Gemini ? » Traitez-le pendant le quiz si besoin (un participant en partage d'écran 2 minutes, ou en aparté à la pause). Pauses : 10 h 15 et 14 h 45, dîner 12 h – 13 h.

TRANSITION — « Petit échauffement. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

ANIMATION — Les participants annoncent leurs lettres. Cochez la sélection majoritaire, « Valider ma sélection », puis cliquez chaque option. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et D.
• A ✓ — P, O, C, I, S.
• B ✗ — Connecteur d'abord.
• C ✗ — Choix fermés.
• D ✓ — Seuil de confiance et file « à vérifier ».

TRANSITION — « Le programme du jour. »`,
  `⏱ 2 min

DIRE — Parcourez les cinq étapes. « Le matin, la méthode et la construction guidée. L'après-midi, votre scénario complet, puis les tests et le déploiement. »

INSISTER — « Chaque module ajoute une brique à votre workflow. Si vous prenez du retard, les corrigés et les pas à pas sont dans le Chat. »

TRANSITION — « On commence par voir un flux en entier. »`,
];
// @@NOTES-END
