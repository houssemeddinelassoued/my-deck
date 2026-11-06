// ─── Module 8 · Bonnes pratiques et vérification du code généré ─────────────

const M8_Divider: Page = () => (
  <Section
    n={8}
    title={
      <>
        Bonnes pratiques
        <br />
        et vérification
      </>
    }
    sub="Relire, détecter, prouver, et faire de Copilot un membre fiable de la revue de code d’équipe."
    dur="J2 · 15:15 – 16:40"
    labs={<Tag tone="green" size={19}>Atelier 8 · revue de code et livraison</Tag>}
  >
    <SecItem n={1}>Pourquoi ne pas faire confiance au code généré sans vérification</SecItem>
    <SecItem n={2}>Checklist de relecture : logique, performances, sécurité</SecItem>
    <SecItem n={3}>Identifier les hallucinations et les erreurs courantes</SecItem>
    <SecItem n={4}>Droits d’auteur et propriété intellectuelle</SecItem>
    <SecItem n={5}>Copilot dans le workflow de revue de code d’équipe</SecItem>
  </Section>
);
M8_Divider.transition = BLOOM;

// ─── Pourquoi vérifier ──────────────────────────────────────────────────────
const M8_Confiance: Page = () => (
  <Frame mod={8}>
    <Title>Pourquoi ne pas faire confiance sans vérifier</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 760 }}>
      <Stat value={<CountUp to={45} suffix=" %" />} tone="coral" size={190} label={<>des échantillons de code générés par IA testés contenaient une faille de sécurité.</>} />
      <div style={{ marginTop: 18, fontSize: 19, color: C.muted }}>Source : Veracode, GenAI Code Security Report, 2025 (plus de 100 modèles, 80 tâches de code).</div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 220, width: 840, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="brain" tone="violet" title="Il vise le plausible, pas le correct" d={200}>
        La suggestion la plus probable n’est pas toujours la bonne.
      </Row2>
      <Row2 icon="eyeOff" tone="blue" title="Il ne voit qu’une partie du projet" d={300}>
        Règles métier, conventions, contraintes : ce qu’il ne voit pas, il le devine.
      </Row2>
      <Row2 icon="clock" tone="yellow" title="Ses connaissances ont une date" d={400}>
        API récentes, versions, failles connues : il peut avoir un train de retard.
      </Row2>
      <Row2 icon="play" tone="coral" title="Il n’exécute rien" d={500}>
        Aucune suggestion inline n’a tourné avant d’arriver dans votre éditeur.
      </Row2>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="humanCheck" title="Le principe" size={25} cls={A.in} style={dl(700)}>
        Une suggestion acceptée devient votre code. Vous le relisez comme celui d’un collègue, et vous le prouvez par des tests.
      </Callout>
    </div>
  </Frame>
);

// ─── Checklist de relecture ─────────────────────────────────────────────────
const M8Col = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M8_Checklist: Page = () => (
  <Frame mod={8} kind="exercice">
    <Title>La checklist de relecture : logique, performances, sécurité</Title>
    <Lede>À garder à côté de VS Code. Pour illustrer, je coche sur une suggestion de l’Atelier 5 que vous me dictez.</Lede>
    <Checklist>
      <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
        <M8Col icon="checkCircle" tone="blue" title="Logique" d={100}>
          <CheckItem id="cl1" size={21} tone="blue">Fait ce qui est demandé, tout ce qui est demandé</CheckItem>
          <CheckItem id="cl2" size={21} tone="blue">Cas limites : vide, null, bornes, doublons</CheckItem>
          <CheckItem id="cl3" size={21} tone="blue">Erreurs gérées, messages clairs</CheckItem>
          <CheckItem id="cl4" size={21} tone="blue">Fonctions et API qui existent vraiment</CheckItem>
        </M8Col>
        <M8Col icon="gauge" tone="yellow" title="Performances" d={220}>
          <CheckItem id="cp1" size={21} tone="yellow">Pas de boucle dans une boucle évitable</CheckItem>
          <CheckItem id="cp2" size={21} tone="yellow">Pas de recalcul inutile dans une boucle</CheckItem>
          <CheckItem id="cp3" size={21} tone="yellow">Set ou Map pour les recherches répétées</CheckItem>
          <CheckItem id="cp4" size={21} tone="yellow">Raisonnable sur 50 000 éléments ?</CheckItem>
        </M8Col>
        <M8Col icon="shield" tone="coral" title="Sécurité" d={340}>
          <CheckItem id="cs1" size={21} tone="coral">Aucun secret, aucun jeton dans le code</CheckItem>
          <CheckItem id="cs2" size={21} tone="coral">Entrées utilisateur jamais injectées telles quelles</CheckItem>
          <CheckItem id="cs3" size={21} tone="coral">Dépendance proposée : existe-t-elle, est-elle sûre ?</CheckItem>
          <CheckItem id="cs4" size={21} tone="coral">Licence : code recopié d’un dépôt public ?</CheckItem>
        </M8Col>
      </div>
    </Checklist>
    <div style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout tone="green" icon="flask" title="Et toujours, la preuve" size={24} cls={A.in} style={dl(600)}>
        Chaque doute devient un test. Un test qui échoue vaut mieux qu’une impression rassurante.
      </Callout>
    </div>
  </Frame>
);

// ─── Hallucinations ─────────────────────────────────────────────────────────
const M8Hallu = ({ icon, title, ex, detect, d }: { icon: IconName; title: string; ex: ReactNode; detect: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone="coral" size={44} />
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontSize: 20, color: C.ink, lineHeight: 1.4 }}>{ex}</div>
    <div style={{ marginTop: 8, fontSize: 19, color: T.green.fg, lineHeight: 1.35 }}>
      <strong>Détecter · </strong>
      {detect}
    </div>
  </div>
);

const M8_Hallucinations: Page = () => (
  <Frame mod={8}>
    <Title>Identifier les hallucinations et les erreurs courantes</Title>
    <Lede>Une hallucination, c’est du code ou une affirmation inventés, présentés avec assurance. Six formes fréquentes :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
      <M8Hallu icon="sparkles" title="L’API inventée" ex={<><Ic>tickets.sortBy("priorite")</Ic> : n’existe pas en JavaScript.</>} detect="exécuter ; documentation officielle" d={100} />
      <M8Hallu icon="archive" title="Le paquet fantôme" ex={<><Ic>npm install csv-taskflow-utils</Ic> : nom plausible, inexistant… ou piégé.</>} detect="npm view, page du paquet, popularité" d={180} />
      <M8Hallu icon="gear" title="L’option imaginaire" ex={<>Un paramètre qui « devrait » exister dans une vraie fonction.</>} detect="infobulle de VS Code, types" d={260} />
      <M8Hallu icon="clock" title="La syntaxe périmée" ex={<>Une API dépréciée, une ancienne version de bibliothèque.</>} detect="version installée, avertissements" d={340} />
      <M8Hallu icon="brain" title="La logique plausible" ex={<>Année bissextile « divisible par 4 », points « entre 1 et 13 ».</>} detect="cas limites, tests à partir de la règle" d={420} />
      <M8Hallu icon="chat" title="L’explication assurée" ex={<>« Ce code est sûr et optimal » : une affirmation n’est pas une preuve.</>} detect="demander : « comment le vérifier ? »" d={500} />
    </div>
  </Frame>
);

// ─── Sécurité ───────────────────────────────────────────────────────────────
const M8Sec = ({ tone, title, bad, good, d }: { tone: Tone; title: string; bad: string; good: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.coral.bg, color: T.coral.fg, borderRadius: 10, padding: '10px 14px' }}>{bad}</div>
    <div style={{ textAlign: 'center', fontSize: 22, color: C.faint, margin: '4px 0' }}>↓</div>
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.green.bg, color: T.green.fg, borderRadius: 10, padding: '10px 14px' }}>{good}</div>
  </div>
);

const M8_Securite: Page = () => (
  <Frame mod={8}>
    <Title>Sécurité : les trois réflexes du débutant</Title>
    <Lede>Copilot reproduit les motifs les plus fréquents, y compris les mauvaises habitudes. Trois cas reviennent sans cesse :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M8Sec tone="coral" title="1 · Les secrets" bad={'const TOKEN = "ghp_…";\nfetch(url + "?token=" + TOKEN)'} good={'const jeton = process.env.TASKFLOW_TOKEN;\nheaders: { Authorization: … }'} d={100} />
      <M8Sec tone="violet" title="2 · Les injections" bad={'carte.innerHTML =\n  "<h3>" + ticket.titre + "</h3>";'} good={'titre.textContent = ticket.titre;\n// requêtes SQL paramétrées'} d={220} />
      <M8Sec tone="blue" title="3 · Les dépendances" bad={'npm install un-paquet-propose\n# jamais vérifié'} good={'npm view un-paquet-propose\n# existe ? maintenu ? populaire ?'} d={340} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="coral" icon="lock" title="Un secret commité est un secret publié" size={24} cls={A.in} style={dl(600)}>
        Même supprimé ensuite, il reste dans l’historique Git. Révoquez-le immédiatement, puis nettoyez.
      </Callout>
    </div>
  </Frame>
);

// ─── Droits d'auteur ────────────────────────────────────────────────────────
const M8_Droits: Page = () => (
  <Frame mod={8}>
    <Title>Droits d’auteur et propriété intellectuelle</Title>
    <Lede>Copilot a appris sur du code public, sous toutes sortes de licences. Ce qu’il faut savoir, sans être juriste :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <Card icon="user" tone="blue" title="Le code accepté vous engage" size={22} pad={24} cls={A.in} style={dl(100)}>
        GitHub ne revendique pas la propriété des suggestions : vous en êtes responsable, comme de tout code que vous intégrez.
      </Card>
      <Card icon="globe" tone="violet" title="Le filtre « code public »" size={22} pad={24} cls={A.in} style={dl(200)}>
        Bloquer les suggestions qui reproduisent un code public, ou les autoriser avec la référence du dépôt d’origine et sa licence.
      </Card>
      <Card icon="scale" tone="teal" title="Les licences « copyleft »" size={22} pad={24} cls={A.in} style={dl(300)}>
        Un long bloc copié d’un projet GPL peut imposer ses conditions à votre code. Un en-tête de licence dans une suggestion : alerte.
      </Card>
      <Card icon="org" tone="green" title="La politique de l’entreprise" size={22} pad={24} cls={A.in} style={dl(400)}>
        En Business et Enterprise, GitHub prévoit une garantie juridique, sous conditions (dont le filtre activé). Suivez les règles internes.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Règle pratique" size={24} cls={A.in} style={dl(600)}>
        Code court et générique : aucun souci. Long bloc spécifique, en-tête de licence, nom d’auteur : on ne l’intègre pas, on le réécrit ou on demande.
      </Callout>
    </div>
  </Frame>
);

// ─── Workflow de revue ──────────────────────────────────────────────────────
const M8Flow = ({ n, icon, tone, title, sub, who }: { n: number; icon: IconName; tone: Tone; title: string; sub: string; who: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: 250 }}>
    <IconTile name={icon} tone={tone} size={70} solid />
    <div style={{ marginTop: 14, fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{sub}</div>
    <Tag tone={tone} size={16} style={{ marginTop: 10 }}>
      {who}
    </Tag>
  </div>
);

const M8_Revue: Page = () => (
  <Frame mod={8} beats={6}>
    <Title>Intégrer Copilot dans la revue de code d’équipe</Title>
    <Lede>Copilot intervient à plusieurs étapes. Aucune ne remplace la relecture humaine ni les tests automatiques.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 245, top: 334, width: 1430, height: 4, background: C.rule }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M8Flow n={1} icon="code" tone="blue" title="Écrire" sub="avec Copilot, petits commits" who="vous + Copilot" />
      <M8Flow n={2} icon="checkCircle" tone="navy" title="Se relire" sub="checklist, tests au vert" who="vous" />
      <M8Flow n={3} icon="sparkles" tone="violet" title="Second avis" sub="revue Copilot de la sélection" who="Copilot" />
      <M8Flow n={4} icon="git" tone="teal" title="Pull request" sub="description claire, rôle de l’IA" who="vous" />
      <M8Flow n={5} icon="shieldCheck" tone="coral" title="Revue humaine" sub="+ revue Copilot (offres payantes)" who="équipe" />
      <M8Flow n={6} icon="flask" tone="green" title="Intégration" sub="tests automatiques, puis fusion" who="CI" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Callout tone="blue" icon="doc" title="Dans la pull request" size={22} cls={b.on(4)}>
        Dites ce qui a été généré et comment vous l’avez vérifié : le relecteur sait où regarder.
      </Callout>
      <Callout tone="green" icon="users" title="Des règles partagées" size={22} cls={b.on(6)}>
        Les conventions de l’équipe vont dans le dépôt : un fichier d’instructions lu par Copilot.
      </Callout>
    </div>
  </Frame>
);

// ─── Le fichier d'instructions ──────────────────────────────────────────────
const M8_Instructions: Page = () => (
  <Frame mod={8} kind="demo">
    <Title>Le fichier d’instructions de l’équipe</Title>
    <Lede>Un fichier Markdown versionné, joint automatiquement aux demandes du chat et des agents.</Lede>
    <CodeDark file=".github/copilot-instructions.md" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Ck># TaskFlow · conventions</Ck>
      {'\n'}- JavaScript moderne (ES modules), const/let, ===.{'\n'}- Logique métier en fonctions pures : jamais new Date(),{'\n  '}la date du jour est passée en paramètre.{'\n'}- Erreurs métier : {'{ ok: false, erreur }'}, jamais alert().{'\n'}- Affichage : textContent, jamais innerHTML.{'\n'}- Aucun secret dans le code : process.env.{'\n'}- Tests : node:test + node:assert/strict, motif AAA,{'\n  '}noms en phrases (« refuse… quand… »).{'\n'}- Toute fonction exportée a une JSDoc complète.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Bien écrit" size={21} pad={22} cls={A.right} style={dl(200)}>
        Court, concret, vérifiable. Des règles, pas une encyclopédie.
      </Card>
      <Card icon="eye" tone="blue" title="Vérifier qu’il est lu" size={21} pad={22} cls={A.right} style={dl(350)}>
        Sous la réponse du chat, la liste des références cite le fichier.
      </Card>
      <Card icon="bolt" tone="violet" title="Le générer" size={21} pad={22} cls={A.right} style={dl(500)}>
        <Ic>/init</Ic> dans une session d’agent propose un premier jet à partir du projet. À relire !
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Il guide le chat et les agents ; les suggestions inline, elles, imitent surtout le fichier ouvert.
    </Hint>
  </Frame>
);

const M8_Pause: Page = () => <BreakPage mod={8} title="Pause" back="Reprise à 16 h 00 : l’Atelier 8, la revue de code finale." minutes={15} />;

// ─── Atelier 8 ──────────────────────────────────────────────────────────────
const M8_Lab: Page = () => (
  <LabPage
    mod={8}
    n="8"
    title="Revue de code et livraison"
    defi="revue"
    who="Individuel · 30 min"
    objective={
      <>
        Relire <strong>8 suggestions acceptées trop vite</strong> avec la checklist, prouver chaque défaut par un test, le corriger, puis livrer TaskFlow avec un <PathChip size={22}>.github/copilot-instructions.md</PathChip>.
      </>
    }
    where={
      <>
        <PathChip size={19}>ateliers/atelier-08-revue/</PathChip>
        <br />
        <PathChip size={19}>REVUE.md</PathChip> · <PathChip size={19}>revue.test.js</PathChip>
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l8a" size={21}>8 défauts identifiés et classés</CheckItem>
        <CheckItem id="l8b" size={21}>test:revue au vert après correction</CheckItem>
        <CheckItem id="l8c" size={21}>Instructions versionnées, npm test vert</CheckItem>
      </>
    }
    suivi="Points d’étape à 10 min (relecture sans outil) et 30 min. Préparez 2 min de restitution."
  >
    <WStep n={1}>Relire sans outil : défaut soupçonné et catégorie dans REVUE.md. Puis second avis de Copilot sur deux d’entre eux.</WStep>
    <WStep n={2}>Un test qui échoue par défaut (01 à 07), puis la correction jusqu’au vert. Pour 08 : une décision.</WStep>
    <WStep n={3}>Écrivez vos 5 à 8 règles d’équipe, vérifiez-les dans le chat, commit final.</WStep>
  </LabPage>
);

// ─── Restitution ────────────────────────────────────────────────────────────
const M8_Restitution: Page = () => (
  <Frame mod={8} kind="exercice" label="Restitutions">
    <Title>Restitution : deux volontaires, deux minutes</Title>
    <Lede>Partage d’écran, minuteur à l’écran, questions au micro. Les autres : une capture dans le clavardage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Key n={1} tone="blue" title="Le défaut le mieux caché" d={100}>
        Lequel des 8, et le test qui l’a prouvé.
      </M4Key>
      <M4Key n={2} tone="violet" title="Ce que Copilot a trouvé… ou manqué" d={200}>
        Son second avis face au vôtre.
      </M4Key>
      <M4Key n={3} tone="green" title="Votre règle d’équipe préférée" d={300}>
        Celle de copilot-instructions.md que vous emportez lundi.
      </M4Key>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="restitution" minutes={2} label="Participant suivant" cls={A.right} style={{ width: 560, ...dl(200) }} />
      <Callout tone="teal" icon="users" title="Rétroaction" size={22} cls={A.right} style={dl(400)}>
        Un point fort, une piste, au micro. Plus de 10 participants : 5 ou 6 volontaires, les autres déposent une capture dans le clavardage.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M8_Qcm: Page = () => (
  <Frame mod={8} kind="qcm">
    <Title>QCM · Module 8 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Copilot propose npm install csv-taskflow-utils. Votre premier réflexe ?" explain="Un paquet suggéré peut ne pas exister, ou avoir été créé par un attaquant sur un nom « halluciné » plausible. On vérifie qu’il existe, qui le maintient, sa popularité.">
        <QOpt ok>Je vérifie qu’il existe et qu’il est fiable avant tout</QOpt>
        <QOpt>Je l’installe, Copilot connaît l’écosystème</QOpt>
        <QOpt>Je demande à Copilot s’il est sûr</QOpt>
      </QuizQ>
      <QuizQ q="Une suggestion arrive avec un en-tête « Licensed under the GPL v3 ». Que faites-vous ?" explain="C’est un signal de code recopié sous licence copyleft. On ne l’intègre pas tel quel : on réécrit, on utilise une alternative (ici structuredClone), ou on suit la politique de l’entreprise.">
        <QOpt>Je supprime l’en-tête et je garde le code</QOpt>
        <QOpt ok>Je ne l’intègre pas tel quel : alternative ou réécriture</QOpt>
        <QOpt>Je l’accepte : Copilot ne propose que du code libre</QOpt>
      </QuizQ>
      <QuizQ q="Où mettre la règle « textContent, jamais innerHTML » pour que toute l’équipe en profite avec Copilot ?" explain="Le fichier .github/copilot-instructions.md est versionné avec le dépôt et joint automatiquement aux demandes du chat et des agents.">
        <QOpt>Dans un message du chat, à chaque fois</QOpt>
        <QOpt>Dans les réglages personnels de VS Code</QOpt>
        <QOpt ok>Dans .github/copilot-instructions.md</QOpt>
      </QuizQ>
      <QuizQ q="La revue Copilot d’une pull request ne trouve rien. Peut-on fusionner ?" explain="La revue automatique est un second avis : elle ne remplace ni la relecture humaine ni les tests de la CI.">
        <QOpt ok>Non : relecture humaine et tests restent nécessaires</QOpt>
        <QOpt>Oui, si le code a été généré par Copilot</QOpt>
        <QOpt>Oui, elle a tout vérifié</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M8_Divider, M8_Confiance, M8_Checklist, M8_Hallucinations, M8_Securite, M8_Droits, M8_Revue, M8_Instructions, M8_Pause, M8_Lab, M8_Restitution, M8_Qcm];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 8 · 15:15

OBJECTIF — Annoncer le module de vérification, synthèse de toute la formation.

DIRE — « Dernier module : les bonnes pratiques de vérification. Tout ce que nous avons fait depuis hier converge ici : relire, détecter, prouver, et faire de Copilot un membre fiable de la revue de code. »

TRANSITION — « D’abord, pourquoi tant de méfiance ? »`,
  `⏱ 4 min · POURQUOI VÉRIFIER

OBJECTIF — Ancrer la nécessité de vérifier par un chiffre et quatre raisons.

DIRE — « Un chiffre : dans une étude de Veracode publiée en 2025, sur plus de cent modèles et quatre-vingts tâches de code, quarante-cinq pour cent des échantillons générés contenaient une faille de sécurité. Quatre raisons : il vise le plausible ; il ne voit qu’une partie du projet ; ses connaissances ont une date ; il n’exécute rien. Le principe : une suggestion acceptée devient votre code. »

ANIMATION — Si on vous demande la source : Veracode, « 2025 GenAI Code Security Report ».

TRANSITION — « Comment relire efficacement ? Avec une checklist. »`,
  `⏱ 5 min · CHECKLIST (exercice)

OBJECTIF — Donner une checklist de relecture en trois volets et l’appliquer.

DIRE — « Trois colonnes, douze points. Logique : la demande, les cas limites, les erreurs, les fonctions qui existent. Performances : boucles imbriquées, recalculs, Set ou Map, et la question des 50 000 éléments. Sécurité : secrets, injections, dépendances, licences. Dictez-moi une fonction que vous avez générée à l’Atelier 5 : on la passe à la checklist ensemble. »

ANIMATION — Cocher au fil des réponses. Rappeler : chaque doute devient un test.

TRANSITION — « Un type d’erreur mérite une page : les hallucinations. »`,
  `⏱ 2 min · HALLUCINATIONS (rappel du Module 1, aller vite)

OBJECTIF — Faire reconnaître six formes d’hallucination et leur moyen de détection.

DIRE — « Une hallucination, c’est quelque chose d’inventé et présenté avec assurance. L’API inventée : sortBy n’existe pas sur les tableaux. Le paquet fantôme : un nom plausible qui n’existe pas, ou pire, qu’un attaquant a créé pour piéger ceux qui suivent l’IA. L’option imaginaire. La syntaxe périmée. La logique plausible, comme notre année bissextile. Et l’explication assurée : “ce code est sûr”. Pour chacune, un moyen de détection concret. »

TRANSITION — « Côté sécurité, trois réflexes suffisent pour commencer. »`,
  `⏱ 4 min · SÉCURITÉ

OBJECTIF — Installer trois réflexes : secrets, injections, dépendances.

DIRE — « Un : les secrets. Jamais de jeton dans le code ni dans une URL ; une variable d’environnement et un en-tête. Deux : les injections. Ne jamais insérer une entrée utilisateur telle quelle dans du HTML ou une requête SQL : textContent, requêtes paramétrées. Trois : les dépendances. Avant d’installer un paquet proposé, on vérifie qu’il existe et qu’il est maintenu. Et un secret commité est un secret publié : on le révoque immédiatement. »

TRANSITION — « Question fréquente : à qui appartient le code généré ? »`,
  `⏱ 5 min · DROITS D’AUTEUR & PI

OBJECTIF — Donner les repères juridiques essentiels, sans jargon.

DIRE — « Quatre repères. Le code accepté vous engage : GitHub ne revendique pas les suggestions, vous en êtes responsable. Le filtre “code public” : bloquer, ou autoriser avec la référence et la licence du dépôt d’origine. Les licences copyleft comme la GPL : un long bloc recopié peut imposer ses conditions. Et la politique de l’entreprise : en Business et Enterprise, GitHub prévoit une garantie juridique, sous conditions, notamment le filtre activé. Règle pratique : code court et générique, aucun souci ; long bloc spécifique avec un en-tête de licence, on ne l’intègre pas. »

ANIMATION — Je ne suis pas juriste : renvoyer les questions précises vers le service juridique de l’entreprise.

TRANSITION — « Comment tout cela s’organise en équipe ? »`,
  `⏱ 5 min · REVUE D’ÉQUIPE

OBJECTIF — Situer Copilot dans le workflow de revue, sans remplacer l’humain ni la CI.

DIRE — « Six étapes. » → beat 1 « Écrire, avec Copilot, en petits commits. » → beat 2 « Se relire avec la checklist, tests au vert. » → beat 3 « Un second avis : la revue Copilot de votre sélection. » → beat 4 « La pull request : dites ce qui a été généré et comment vous l’avez vérifié. » → beat 5 « La revue humaine, éventuellement précédée d’une revue Copilot sur la PR, avec les offres payantes. » → beat 6 « Et les tests automatiques avant la fusion. Les règles de l’équipe, elles, vont dans le dépôt. »

TRANSITION — « Justement : le fichier d’instructions. »`,
  `⏱ 4 min · FICHIER D’INSTRUCTIONS (démo)

OBJECTIF — Montrer un fichier d’instructions utile et comment vérifier qu’il est lu.

DIRE — « .github/copilot-instructions.md : un fichier Markdown versionné, joint automatiquement aux demandes du chat et des agents. Voici celui de TaskFlow : sept règles, toutes tirées de ces deux jours. Court, concret, vérifiable. Pour vérifier qu’il est lu : sous la réponse du chat, la liste des références le cite. Et /init, dans une session d’agent, en propose un premier jet. Nuance : les suggestions inline, elles, imitent surtout le fichier ouvert. »

ANIMATION — Montrer en direct la référence au fichier sous une réponse du chat.

TRANSITION — « Quinze minutes de pause avant le dernier atelier. »`,
  `⏱ 15 min · PAUSE · 15:45

DIRE — « Dernière pause, quinze minutes. À 16 h 00, l’Atelier 8 : la revue de code finale de TaskFlow. »`,
  `⏱ 30 min · ATELIER 8 (individuel) · 16:00

OBJECTIF — Appliquer la checklist, prouver chaque défaut par un test, livrer avec des règles d’équipe.

DIRE — « Quarante minutes, énoncé dans ateliers/atelier-08-revue. Huit suggestions acceptées trop vite par un collègue. D’abord, relisez sans outil et notez vos soupçons. Puis le second avis de Copilot sur deux d’entre elles. Ensuite, un test qui échoue par défaut, et la correction. Enfin, vos règles d’équipe et le commit final. Préparez deux minutes de restitution. »

ANIMATION — Points d’étape à 10 min (« Combien de défauts trouvés sans outil ? ») et 30 min. Le plus souvent manqué : 07 (dates) et 06 (performance).

TRANSITION — « Place aux restitutions. »`,
  `⏱ 5 min · RESTITUTION (2 volontaires, partage d’écran)

OBJECTIF — Chaque participant présente son travail ; rétroaction collective.

DIRE — « Deux volontaires, deux minutes chacun. Partagez votre écran : le défaut le mieux caché et son test, ce que Copilot a trouvé ou manqué, et votre règle d’équipe préférée. » Après chacun : « Un point fort, une piste. Participant suivant ! »

ANIMATION — Relancer le minuteur à chaque volontaire. Les autres déposent une capture de leur REVUE.md dans le clavardage : le temps gagné sert au Module 9.

TRANSITION — « Un dernier QCM. »`,
  `⏱ 5 min · QCM MODULE 8 (vote oral)

OBJECTIF — Vérifier les réflexes de vérification.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Dernier module : les agents. »`,
];
// @@NOTES-END
