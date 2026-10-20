// ─── Clôture ────────────────────────────────────────────────────────────────

const C_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz final : l’après-midi en six questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Dans le workflow d’une feature IA, qui définit ce qu’est une « bonne réponse » ?" explain="Le PO, avec le métier, via le guide d’annotation : c’est une règle de produit, pas une question technique.">
        <QOpt>Le data scientist</QOpt>
        <QOpt ok>Le PO, avec le métier</QOpt>
        <QOpt>Le modèle, à partir des données</QOpt>
      </QuizQ>
      <QuizQ q="Le jeu de test (« golden set ») sert à…" explain="Juger le modèle sur des cas qu’il n’a jamais vus. Personne n’y touche pendant le développement.">
        <QOpt>Entraîner le modèle plus vite</QOpt>
        <QOpt ok>Juger le modèle sur des cas jamais vus</QOpt>
        <QOpt>Remplacer les tests fonctionnels</QOpt>
      </QuizQ>
      <QuizQ q="Pour B1, le critère le plus important à plafonner est…" explain="L’erreur surlignée est rattrapée par l’utilisateur ; l’erreur silencieuse part au remboursement.">
        <QOpt>Le temps de réponse</QOpt>
        <QOpt>L’exactitude globale du modèle</QOpt>
        <QOpt ok>Les montants faux non signalés</QOpt>
      </QuizQ>
      <QuizQ q="Une feature dont l’erreur touche directement une personne doit plutôt être…" explain="Une suggestion : l’IA propose, l’humain décide. On monte d’un niveau seulement quand la mesure le justifie.">
        <QOpt ok>Une suggestion, l’humain décide</QOpt>
        <QOpt>Automatique, contrôlée par échantillon</QOpt>
        <QOpt>Automatique complète</QOpt>
      </QuizQ>
      <QuizQ q="« Il utilise GPT » dans les critères d’acceptation, c’est…" explain="Un choix technique déguisé : les critères décrivent un résultat observable, le modèle se choisit sur preuves.">
        <QOpt>Une bonne pratique de transparence</QOpt>
        <QOpt ok>Un choix technique qui n’a rien à faire là</QOpt>
        <QOpt>Obligatoire avec l’AI Act</QOpt>
      </QuizQ>
      <QuizQ q="La part des champs corrigés par les utilisateurs remonte brutalement. C’est probablement…" explain="Une dérive : les données ont changé (nouveau format de ticket). On analyse, on ajoute des exemples, on ré-entraîne.">
        <QOpt>Un bug d’affichage</QOpt>
        <QOpt ok>Une dérive : le monde a changé, pas le modèle</QOpt>
        <QOpt>Des utilisateurs qui testent l’outil</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Points clés ────────────────────────────────────────────────────────────
const CKey = ({ n, tone, icon, title, children, d }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 28px', borderTop: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone={tone} size={50} />
      <IconTile name={icon} tone={tone} size={50} />
    </div>
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const C_Keys: Page = () => (
  <Frame mod={7} kind="synthese">
    <Title>Points clés : ce que vous emportez</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, height: 520, display: 'flex', gap: 24 }}>
      <CKey n={1} tone="blue" icon="brain" title="Les bases IA utiles au PO" d={100}>
        Apprendre plutôt que programmer, huit familles de modèles, un LLM qui prédit sans savoir. Et un modèle qui se trompera toujours.
      </CKey>
      <CKey n={2} tone="teal" icon="filter" title="Détecter les opportunités" d={250}>
        Partir du problème, six signaux, valeur chiffrée, faisabilité en quatre axes, scoring justifié. Et oser « pas d’IA ».
      </CKey>
      <CKey n={3} tone="green" icon="note" title="Une user story IA réaliste" d={400}>
        Huit blocs, des critères statistiques sur un jeu de test, le comportement quand l’IA doute, la mesure en production.
      </CKey>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 770, width: 1680, ...dl(700) }}>
      <Quote by="Le fil conducteur de la journée">On ne priorise pas de l’IA. On priorise un problème… que l’IA résout parfois.</Quote>
    </div>
  </Frame>
);

// ─── Plan d’action 30 jours ─────────────────────────────────────────────────
const CWeek = ({ n, tone, icon, title, children, d }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 24px', ...dl(d) }}>
    <div style={{ flex: 'none', width: 130 }}>
      <Eyebrow c={T[tone].fg} size={17}>
        Semaine
      </Eyebrow>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, lineHeight: 1, color: STRONG[tone] }}>{n}</div>
    </div>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const C_Plan: Page = () => (
  <Frame mod={7}>
    <Title>Votre plan d’action : 30 jours, une feature IA cadrée</Title>
    <Lede>Notez dès maintenant la date de chaque étape dans votre agenda.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CWeek n={1} tone="blue" icon="filter" title="Passer votre backlog au crible" d={100}>
        Six signaux, anti-signaux, et la liste des idées qui n’ont pas besoin d’IA : souvent vos meilleurs gains rapides.
      </CWeek>
      <CWeek n={2} tone="teal" icon="search" title="Choisir une idée et la creuser" d={220}>
        Les cinq questions du problème, le calculateur de valeur, le diagnostic données en cinq questions.
      </CWeek>
      <CWeek n={3} tone="violet" icon="users" title="Embarquer les bonnes personnes" d={340}>
        Une heure avec la data, le DPO et le RSSI : faisabilité, droit d’usage, fournisseur, niveau AI Act.
      </CWeek>
      <CWeek n={4} tone="green" icon="note" title="Écrire la story et la passer en refinement" d={460}>
        Le canevas en huit blocs, la DoR version IA, et un spike borné comme première tranche.
      </CWeek>
    </div>
  </Frame>
);

// ─── Ressources & évaluation ────────────────────────────────────────────────
const CRes = ({ icon, tone, title, src, d }: { icon: IconName; tone: Tone; title: string; src: string; d: number }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.blue }}>{src}</div>
    </div>
  </div>
);

const CEval = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone={tone} size={40} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const C_Resources: Page = () => (
  <Frame mod={7}>
    <Title>Pour aller plus loin, et votre évaluation</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade}>
        Ressources
      </Eyebrow>
      <CRes icon="shield" tone="violet" title="CNIL · fiches pratiques sur l’IA et le RGPD" src="cnil.fr · rubrique Intelligence artificielle" d={100} />
      <CRes icon="scale" tone="navy" title="Règlement européen sur l’IA (AI Act)" src="eur-lex.europa.eu · règlement (UE) 2024/1689" d={180} />
      <CRes icon="pointer" tone="pink" title="People + AI Guidebook : l’UX des produits IA" src="pair.withgoogle.com/guidebook" d={260} />
      <CRes icon="book" tone="blue" title="Chip Huyen · Designing Machine Learning Systems" src="O’Reilly, 2022" d={340} />
      <CRes icon="note" tone="green" title="Le canevas en huit blocs et la grille sur 20" src="support de formation · pages du module 6" d={420} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1180, top: 200, width: 620, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Évaluation de la formation
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CEval n={1} tone="blue" title="Acquis" d={300}>
          QCM des modules, atelier de priorisation, story notée par les pairs.
        </CEval>
        <CEval n={2} tone="violet" title="Questionnaire à chaud" d={420}>
          Cinq minutes, maintenant : contenu, rythme, utilité pour votre poste.
        </CEval>
        <CEval n={3} tone="green" title="Questionnaire à froid" d={540}>
          Dans un mois : qu’avez-vous appliqué de votre plan d’action ?
        </CEval>
      </div>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const C_Thanks: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1400 }}>
      <div className={A.in} style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: '-0.03em', color: C.navy }}>
        Merci !
      </div>
      <div className={A.in} style={{ marginTop: 40, maxWidth: 1150, ...dl(200) }}>
        <Quote by="À garder pour votre prochain refinement">Une story IA se teste comme les autres : il suffit d’écrire ce que « assez bien » veut dire.</Quote>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 560, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Votre formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 10, fontSize: 23, color: C.soft }}>Questions et retours d’expérience bienvenus, par LinkedIn.</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 720, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
C_Thanks.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [C_Quiz, C_Keys, C_Plan, C_Resources, C_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 5 min · QUIZ FINAL · 16:40

OBJECTIF — Vérifier les acquis de l’après-midi.

DIRE — « Six questions sur l’après-midi. Même règle que ce midi : vote à main levée, je clique la réponse majoritaire. »

INTERACTION — Une question à la fois. Si la majorité se trompe, cliquer d’abord la mauvaise réponse et laisser le groupe se corriger. Noter le score du premier coup pour l’évaluation.

TRANSITION — « Les trois points clés de la journée. »`,
  `⏱ 3 min · POINTS CLÉS

OBJECTIF — Énoncer les trois takeaways du programme.

DIRE — « Un : les bases IA utiles au PO. Apprendre plutôt que programmer, les familles de modèles, un LLM qui prédit sans savoir, et un modèle qui se trompera toujours. Deux : détecter les opportunités dans un backlog. Partir du problème, les signaux, la valeur, la faisabilité, le scoring. Et oser dire “pas d’IA”. Trois : structurer une user story IA simple et réaliste. Huit blocs, des critères statistiques, le doute, la mesure. »

INSIST — Relire la citation : « On ne priorise pas de l’IA. On priorise un problème… que l’IA résout parfois. »

TRANSITION — « Pour que ces trois points servent dès lundi, un plan d’action. »`,
  `⏱ 3 min · PLAN D’ACTION 30 JOURS

OBJECTIF — Transformer la formation en actions datées.

DIRE — « Semaine 1 : passez votre backlog au crible, avec les six signaux. Vous trouverez probablement des idées qui n’ont pas besoin d’IA : ce sont souvent vos meilleurs gains rapides. Semaine 2 : choisissez une idée, et creusez-la avec les cinq questions, le calculateur, le diagnostic données. Semaine 3 : une heure avec la data, le DPO et le RSSI. Semaine 4 : écrivez la story avec le canevas, et passez-la en refinement, en commençant par un spike. »

CONSIGNE — « Sortez votre agenda et notez la date de chaque étape maintenant. Sinon, ce plan restera sur cette page. »

TRANSITION — « Quelques ressources, et l’évaluation. »`,
  `⏱ 2 min · RESSOURCES ET ÉVALUATION

OBJECTIF — Donner des ressources fiables et lancer le questionnaire à chaud.

DIRE — « Cinq ressources. La CNIL pour les fiches pratiques IA et RGPD. Le texte de l’AI Act. Le People + AI Guidebook de Google, excellent sur l’UX des produits IA. Le livre de Chip Huyen si vous voulez comprendre le travail de l’équipe data. Et le canevas et la grille de ce support. »

EVALUATION — « Les acquis ont été évalués toute la journée : QCM, atelier, story notée. Il reste le questionnaire à chaud : cinq minutes, maintenant. Et dans un mois, un questionnaire à froid sur votre plan d’action. »

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI · 17:00

OBJECTIF — Clore la journée.

DIRE — « Merci pour votre énergie et vos questions. Une dernière phrase à garder pour votre prochain refinement : une story IA se teste comme les autres, il suffit d’écrire ce que “assez bien” veut dire. Bonne fin de journée ! »

ANIMATION — Laisser la page affichée pendant les questionnaires et les échanges informels.`,
];
// @@NOTES-END
