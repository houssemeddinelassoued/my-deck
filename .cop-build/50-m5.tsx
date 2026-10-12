// ─── Module 5 · Sécurité & audit du code généré ─────────────────────────────

const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Sécurité et audit
        <br />
        du code généré
      </>
    }
    sub="Les risques propres au code produit par IA, la grille OWASP, les prompts orientés sécurité, les outils… et le droit."
    dur="14:30 – 15:25 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 5 · audit de sécurité</Tag>}
  >
    <SecItem n={1}>Risques spécifiques au code généré</SecItem>
    <SecItem n={2}>Détecter les vulnérabilités suggérées</SecItem>
    <SecItem n={3}>La grille OWASP Top 10 : 2025</SecItem>
    <SecItem n={4}>Prompts orientés sécurité et outillage</SecItem>
    <SecItem n={5}>Droits d’auteur, licences, conformité</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Les risques ────────────────────────────────────────────────────────────
const M5Risk = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5_Risks: Page = () => (
  <Frame mod={5}>
    <Title>Les risques propres au code généré par IA</Title>
    <Lede>Le modèle reproduit ce qu’il a vu le plus souvent. Et sur le web, le code vulnérable ne manque pas.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 520, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px' }}>
      <Stat value={<CountUp to={45} suffix=" %" />} label="des tâches de code confiées à plus de 100 LLM ont produit une faille du Top 10 OWASP" tone="coral" size={120} />
      <div style={{ marginTop: 16, fontSize: 19, color: C.muted }}>Veracode, GenAI Code Security Report, 2025</div>
      <div style={{ marginTop: 22, fontSize: 23, lineHeight: 1.45, color: C.ink }}>
        Les modèles récents écrivent du code <strong>plus correct</strong>… pas <strong>plus sûr</strong>.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 690, top: 270, width: 1110, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <M5Risk icon="terminal" tone="coral" title="Injection" d={150}>
        SQL, commande, chemin : concaténation de l’entrée utilisateur.
      </M5Risk>
      <M5Risk icon="eye" tone="yellow" title="Exposition de données" d={250}>
        Champs sensibles renvoyés, traces et secrets dans les logs.
      </M5Risk>
      <M5Risk icon="lock" tone="violet" title="Contrôle d’accès oublié" d={350}>
        L’identité est vérifiée, la propriété jamais (IDOR).
      </M5Risk>
      <M5Risk icon="key" tone="pink" title="Secrets en dur" d={450}>
        Clé « de dev » qui finit en production et dans l’historique Git.
      </M5Risk>
      <M5Risk icon="archive" tone="teal" title="Dépendances vulnérables" d={550}>
        Versions datées, paquets hallucinés (module 2).
      </M5Risk>
      <M5Risk icon="bot" tone="navy" title="Injection de prompt indirecte" d={650}>
        Une issue ou un README piégé dicte des commandes à l’agent.
      </M5Risk>
    </div>
  </Frame>
);

// ─── Détecter (exercice) ────────────────────────────────────────────────────
const M5_Detect: Page = () => (
  <Frame mod={5} kind="exercice" beats={6}>
    <Title>Détecter : six failles dans une suggestion FastAPI</Title>
    <Lede>Elle compile, elle répond, les tests nominaux passent. Repérez les failles avant les réponses.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <CodeDark file="api/bookings.py" size={20}>
        SECRET = <Cs>"sallelibre-dev-secret"</Cs>
        <M3Mark n={1} />
        {'\n\n'}
        <Ck>def</Ck> <Cf>current_user</Cf>(token: str = Depends(oauth2)):{'\n'}
        {'    '}<Ck>return</Ck> jwt.<Cf>decode</Cf>(token, SECRET, algorithms=[<Cs>"HS256"</Cs>],{'\n'}
        {'                      '}options={'{'}<Cs>"verify_signature"</Cs>: <Cn>False</Cn>{'}'})
        <M3Mark n={2} />
        {'\n\n'}
        <Cf>@router.get</Cf>(<Cs>"/bookings/search"</Cs>){'\n'}
        <Ck>def</Ck> <Cf>search</Cf>(q: str, db=Depends(get_db)):{'\n'}
        {'    '}sql = <Cs>f"SELECT * FROM bookings WHERE title LIKE '%{'{q}'}%'"</Cs>
        <M3Mark n={3} />
        {'\n'}
        {'    '}<Ck>return</Ck> db.<Cf>execute</Cf>(sql).<Cf>fetchall</Cf>()
        <M3Mark n={4} />
        {'\n\n'}
        <Cf>@router.delete</Cf>(<Cs>"/bookings/{'{booking_id}'}"</Cs>){'\n'}
        <Ck>def</Ck> <Cf>cancel</Cf>(booking_id: int, user=Depends(current_user), db=Depends(get_db)):{'\n'}
        {'    '}<Ck>try</Ck>:{'\n'}
        {'        '}db.<Cf>execute</Cf>(<Cs>"DELETE FROM bookings WHERE id = ?"</Cs>, (booking_id,))
        <M3Mark n={5} />
        {'\n'}
        {'    '}<Ck>except</Ck> Exception:{'\n'}
        {'        '}<Ck>return</Ck> {'{'}<Cs>"error"</Cs>: traceback.<Cf>format_exc</Cf>(){'}'}
        <M3Mark n={6} />
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="Secret en dur">Dans le code, donc dans Git. Variable d’environnement, coffre.</M3Flaw>
      <M3Flaw n={2} title="Signature non vérifiée">N’importe qui forge un jeton admin.</M3Flaw>
      <M3Flaw n={3} title="Injection SQL">f-string : requête paramétrée obligatoire.</M3Flaw>
      <M3Flaw n={4} title="Surexposition">SELECT * renvoie e-mails et notes de tous.</M3Flaw>
      <M3Flaw n={5} title="IDOR">Aucun contrôle : Bob annule la réservation d’Alice.</M3Flaw>
      <M3Flaw n={6} title="Fuite d’information">La trace révèle chemins, versions et requêtes.</M3Flaw>
    </div>
  </Frame>
);

// ─── Grille OWASP Top 10 : 2025 (checklist interactive) ─────────────────────
const M5Owasp = ({ id, code, name, children }: { id: string; code: string; name: string; children: ReactNode }) => (
  <CheckItem id={id} size={21} tone="coral">
    <span style={{ fontFamily: mono, fontWeight: 700, color: T.coral.fg, marginRight: 12 }}>{code}</span>
    <strong style={{ fontWeight: 700 }}>{name}</strong>
    <span style={{ color: C.muted }}> · {children}</span>
  </CheckItem>
);

const M5_Owasp: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>La checklist OWASP Top 10 : 2025, appliquée à Copilot</Title>
    <Lede>Pour chaque catégorie, ce que le code généré oublie le plus souvent. Cochez ce que votre revue vérifie déjà.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 258, width: 1180, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <M5Owasp id="ow1" code="A01" name="Contrôle d’accès">propriétaire jamais vérifié</M5Owasp>
        <M5Owasp id="ow2" code="A02" name="Configuration">CORS ouvert, mode debug, en-têtes absents</M5Owasp>
        <M5Owasp id="ow3" code="A03" name="Chaîne d’approvisionnement">paquets hallucinés ou vulnérables</M5Owasp>
        <M5Owasp id="ow4" code="A04" name="Cryptographie">MD5, secret faible, aléa prévisible</M5Owasp>
        <M5Owasp id="ow5" code="A05" name="Injection">SQL ou commande par concaténation</M5Owasp>
        <M5Owasp id="ow6" code="A06" name="Conception">ni limite de débit, ni quota</M5Owasp>
        <M5Owasp id="ow7" code="A07" name="Authentification">JWT non vérifié, sans expiration</M5Owasp>
        <M5Owasp id="ow8" code="A08" name="Intégrité">désérialisation, actions CI non épinglées</M5Owasp>
        <M5Owasp id="ow9" code="A09" name="Journalisation et alertes">secrets loggés, aucun audit</M5Owasp>
        <M5Owasp id="ow10" code="A10" name="Conditions exceptionnelles">erreur avalée ou trace renvoyée</M5Owasp>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1360, top: 258, width: 440, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Ma revue couvre"
          levels={[
            { min: 0, text: 'Revue fonctionnelle seulement : le TP 5 tombe à pic.', tone: 'coral' },
            { min: 4, text: 'Bonne base : outillez le reste en CI.', tone: 'yellow' },
            { min: 8, text: 'Revue solide : faites-en un prompt d’équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Cette liste devient votre grille d’audit au TP 5… et un fichier de prompt au module 6.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Prompts orientés sécurité ──────────────────────────────────────────────
const M5Tip = ({ icon, tone, title, children, beat }: { icon: IconName; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontFamily: mono, fontSize: 18, lineHeight: 1.5, color: C.navy }}>{children}</div>
    </div>
  </div>
);

const M5_SecurePrompts: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Des prompts orientés sécurité</Title>
    <Lede>Un modèle ne protège que contre les menaces qu’on lui nomme. Rendez-les explicites, permanentes et vérifiables.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file=".github/instructions/security.instructions.md" size={20}>
        <Cc>---</Cc>
        {'\n'}
        <Ck>applyTo</Ck>: <Cs>"src/api/**,src/services/**"</Cs>
        {'\n'}
        <Cc>---</Cc>
        {'\n'}
        <Cf># Règles de sécurité</Cf>
        {'\n'}- Requêtes SQL toujours paramétrées, jamais concaténées.{'\n'}
        - Toute route qui lit ou modifie une ressource vérifie{'\n'}
        {'  '}que l’utilisateur courant en est propriétaire (ou admin).{'\n'}
        - Réponses via des DTO explicites : jamais d’entité brute.{'\n'}
        - Secrets lus depuis l’environnement, jamais en dur.{'\n'}
        - Erreurs : message générique au client, détail dans les logs{'\n'}
        {'  '}sans donnée personnelle ni jeton.{'\n'}
        - JWT : signature, algorithme et expiration vérifiés.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Tip icon="target" tone="coral" title="Nommer les menaces" beat={0}>
        Ajoute la recherche par titre. Menaces : injection, données d’autrui, champs sensibles.
      </M5Tip>
      <M5Tip icon="flask" tone="pink" title="Prouver par un test" beat={1}>
        Écris d’abord le test qui exploite la faille. Il doit échouer avant le correctif.
      </M5Tip>
      <M5Tip icon="bug" tone="violet" title="Relire en attaquant" beat={2}>
        Agis comme un pentesteur : comment exploiterais-tu ce diff ? Classe par criticité.
      </M5Tip>
    </div>
  </Frame>
);

// ─── Outillage ──────────────────────────────────────────────────────────────
const M5Stage = ({ n, icon, tone, title, tools, beat }: { n: number; icon: IconName; tone: Tone; title: string; tools: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={42} />
      <IconTile name={icon} tone={tone} size={42} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.5, color: C.soft }}>{tools}</div>
  </div>
);

const M5_Tools: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Outiller la détection : l’IA ne remplace pas les scanners</Title>
    <Lede>Copilot relit avec intelligence mais sans garantie. Les outils déterministes, eux, ne fatiguent jamais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M5Stage n={1} icon="code" tone="blue" title="Éditeur" beat={0} tools={<>Linters de sécurité, SAST local (Semgrep, SonarQube for IDE)</>} />
      <M5Stage n={2} icon="key" tone="yellow" title="Avant le push" beat={1} tools={<>Détection de secrets (gitleaks), push protection GitHub</>} />
      <M5Stage n={3} icon="git" tone="violet" title="Pull request" beat={2} tools={<>CodeQL + Copilot Autofix, Dependabot, dependency review</>} />
      <M5Stage n={4} icon="rocket" tone="green" title="CI" beat={3} tools={<>npm audit · pip-audit · OWASP Dependency-Check · dotnet list package --vulnerable</>} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 560, width: 1680, ...dl(500) }}>
      <Callout title="Copilot Autofix" tone="blue" icon="wand" size={24}>
        Il propose un correctif pour une alerte CodeQL : il se relit comme n’importe quel diff, avec un test qui prouve que la faille est fermée.
      </Callout>
    </div>
  </Frame>
);

// ─── Droits d'auteur, licences, conformité ──────────────────────────────────
const M5_Legal: Page = () => (
  <Frame mod={5}>
    <Title>Droits d’auteur, licences et conformité</Title>
    <Lede>Le code que vous commitez engage votre entreprise, quel que soit l’outil qui l’a suggéré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card cls={A.in} tone="blue" icon="search" title="Code correspondant au code public" size={23} style={dl(100)}>
        Réglage : bloquer, ou autoriser avec référencement (dépôt et licence d’origine affichés). Décidé par l’organisation.
      </Card>
      <Card cls={A.in} tone="violet" icon="scale" title="Licences" size={23} style={dl(200)}>
        Une suggestion proche d’un code sous licence copyleft peut imposer ses conditions. Le référencement permet de décider.
      </Card>
      <Card cls={A.in} tone="teal" icon="lock" title="Confidentialité" size={23} style={dl(300)}>
        Offres Business et Enterprise : données non utilisées pour l’entraînement. Exclusion de contenu pour les fichiers sensibles.
      </Card>
      <Card cls={A.in} tone="coral" icon="humanCheck" title="Responsabilité" size={23} style={dl(400)}>
        L’indemnisation de GitHub suppose le filtre de code public activé. La relecture humaine reste votre obligation.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(600) }}>
      <Callout title="À vérifier dans votre organisation" tone="yellow" icon="alert" size={24}>
        Réglage du filtre de code public, exclusions de contenu, modèles autorisés : ces choix sont faits par les admins, et ils évoluent.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="Un correctif automatique"
    q="Copilot Autofix propose un correctif pour une alerte CodeQL d’injection SQL. Que faites-vous ?"
    explain="Un correctif généré reste du code généré : il se relit, et un test d’exploitation prouve que la faille est fermée… et le reste."
  >
    <Opt why="Un correctif peut fermer l’alerte sans fermer la faille, ou casser un comportement voisin.">
      Le fusionner directement : l’outil est fait pour ça
    </Opt>
    <Opt ok why="Exact : relecture du diff, test qui exploite la faille (rouge avant, vert après), puis fusion via la revue habituelle.">
      Le relire et ajouter un test d’exploitation qui doit passer
    </Opt>
    <Opt why="Rejeter par principe, c’est garder la faille. Les correctifs proposés sont souvent bons : ils se vérifient.">
      L’ignorer : les correctifs générés ne sont pas fiables
    </Opt>
    <Opt why="Une alerte fermée à tort est pire qu’une alerte ouverte : elle ne sera plus jamais regardée.">
      Marquer l’alerte comme faux positif si les tests passent
    </Opt>
  </QcmPage>
);

// ─── TP 5 ───────────────────────────────────────────────────────────────────
const M5_TP: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="Audit de sécurité du code généré"
    defi="audit"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>SECURITY-AUDIT.md</PathChip> failles classées
        <br />
        <PathChip>tests/security/**</PathChip> un test par faille
        <br />
        <PathChip>.github/instructions/security…</PathChip>
      </>
    }
    objective={<>Analyser le code de {PROJECT} généré par Copilot, identifier les failles et les corriger avec des prompts ciblés.</>}
    crit={
      <>
        <CheckItem id="tp5-1" size={21}>Au moins quatre failles trouvées et classées</CheckItem>
        <CheckItem id="tp5-2" size={21}>Un test d’exploitation par faille corrigée</CheckItem>
        <CheckItem id="tp5-3" size={21}>DELETE d’autrui : 403, prouvé par un test</CheckItem>
        <CheckItem id="tp5-4" size={21}>security.instructions.md commité</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Audit en rôle d’attaquant, grille OWASP en référence (#file).</M2Step>
      <M2Step n={2}>Classez chaque faille : criticité, preuve, correctif proposé.</M2Step>
      <M2Step n={3}>Une faille, un test qui l’exploite (rouge), un prompt ciblé (vert).</M2Step>
      <M2Step n={4}>Rendez les règles permanentes : instructions par chemin.</M2Step>
    </div>
    <TpBonus>Lancez CodeQL ou Semgrep et comparez avec l’audit de Copilot : qui a trouvé quoi ?</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M5_Divider, M5_Risks, M5_Detect, M5_Owasp, M5_SecurePrompts, M5_Tools, M5_Legal, M5_Qcm, M5_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M5 · 14:30

OBJECTIF — Annoncer le module 5 du programme : sécurité et audit du code généré.

DIRE — « Module 5. Votre code est testé et propre. Est-il sûr ? On va voir les risques spécifiques au code généré, la checklist OWASP appliquée à Copilot, comment détecter les vulnérabilités dans une suggestion, comment écrire des prompts orientés sécurité, et la question des droits d’auteur et des licences. TP 5 : vous auditez votre propre code. »

TRANSITION — « D’abord, l’ampleur du problème. »`,
  `⏱ 4 min · RISQUES

OBJECTIF — Risques spécifiques au code généré par IA : injection, exposition de données, dépendances vulnérables.

DIRE — « Veracode a confié des tâches de code à plus de cent modèles en 2025 : dans 45 % des cas, le code contenait une faille du Top 10 OWASP. Et le constat clé : les modèles récents écrivent du code plus correct, pas plus sûr. Six familles de risques : l’injection, l’exposition de données, le contrôle d’accès oublié — l’identité est vérifiée, la propriété jamais —, les secrets en dur, les dépendances, et un risque propre aux agents : l’injection de prompt indirecte. Une issue ou un README contient des instructions cachées que l’agent lit… et exécute. D’où : approbation des commandes, droits minimaux, pas d’auto-approbation. »

TRANSITION — « Exercice : six failles dans une suggestion. »`,
  `⏱ 5 min · DÉTECTER (exercice, 6 temps)

OBJECTIF — Détecter les vulnérabilités dans le code suggéré.

DIRE — « Cette fois en Python, mais les failles sont les mêmes dans toutes les stacks. Cherchez. » Une minute, puis → clic par faille. « Un : secret en dur. Deux : signature non vérifiée, n’importe qui forge un jeton admin — on le voit réellement dans des suggestions, souvent pour "faire marcher" un test. Trois : injection SQL par f-string. Quatre : SELECT étoile renvoyé tel quel, les e-mails de tout le monde. Cinq : l’IDOR, Bob annule la réservation d’Alice — c’est le test d’intégration 403 du TP 3. Six : la trace d’erreur renvoyée au client. »

TRANSITION — « Pour ne rien oublier, une grille. »`,
  `⏱ 4 min · OWASP (checklist interactive)

OBJECTIF — Checklist de sécurité : OWASP et bonnes pratiques appliquées à Copilot.

DIRE — « L’OWASP Top 10 dans sa version 2025, avec pour chaque catégorie ce que le code généré oublie le plus souvent. Nouveautés 2025 à noter : la chaîne d’approvisionnement logicielle monte en troisième position — c’est notre slopsquatting — et une catégorie dédiée aux conditions exceptionnelles mal gérées. Cochez ce que votre revue de code vérifie déjà aujourd’hui. »

ANIMATION — Faire cocher par un volontaire pour son équipe. Commenter le score.

TRANSITION — « Comment obtenir du code sûr dès la génération ? »`,
  `⏱ 4 min · PROMPTS SÉCURITÉ (2 temps)

OBJECTIF — Utiliser Copilot pour générer du code sécurisé : prompts orientés sécurité.

DIRE — « Le levier permanent : un fichier d’instructions par chemin, chargé automatiquement dès qu’on touche à l’API ou aux services. Six règles, chacune répond à une faille de l’exercice. À droite, trois réflexes de prompt : nommer les menaces dans la demande. » → clic. « Prouver par un test d’exploitation, qui échoue avant le correctif. » → clic. « Et relire en attaquant : Copilot est étonnamment bon pour attaquer son propre code quand on lui donne ce rôle. »

TRANSITION — « Mais un modèle n’offre aucune garantie. Les outils, si. »`,
  `⏱ 3 min · OUTILLAGE (3 temps)

OBJECTIF — Compléter Copilot par des outils déterministes.

DIRE — « Quatre points de contrôle. Dans l’éditeur, linters et analyse statique. » → clic. « Avant le push, la détection de secrets. » → clic. « En pull request, CodeQL et Copilot Autofix, Dependabot et la revue des dépendances. » → clic. « En CI, l’audit des dépendances de votre stack. Copilot Autofix propose des correctifs pour les alertes CodeQL : excellent, mais ça reste du code généré. »

TRANSITION — « Dernier sujet du module, et pas le moindre : le droit. »`,
  `⏱ 3 min · DROITS ET LICENCES

OBJECTIF — Droits d’auteur, licences et conformité du code généré en contexte professionnel.

DIRE — « Quatre points. Le filtre de code public : bloquer les suggestions qui correspondent à du code public, ou les autoriser avec référencement, qui affiche le dépôt et la licence d’origine. Les licences : une suggestion proche d’un code copyleft peut imposer ses conditions. La confidentialité : en Business et Enterprise, vos données ne servent pas à l’entraînement, et l’exclusion de contenu protège les fichiers sensibles. La responsabilité : l’engagement d’indemnisation de GitHub suppose le filtre activé, et dans tous les cas, c’est vous qui commitez. Ces réglages sont décidés par les admins : vérifiez ceux de votre organisation. »

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 5

OBJECTIF — Ancrer la vérification des correctifs générés.

DIRE — « Le piège D est le plus dangereux : une alerte fermée à tort n’est plus jamais regardée. »

TRANSITION — « TP 5 : auditez votre code. »`,
  `⏱ 25 min (minuteur) · TP 5

OBJECTIF — Atelier du programme : analyser un code généré par Copilot, identifier les failles et les corriger avec des prompts ciblés.

DIRE — « Vous auditez votre propre API, celle générée ce matin. Prompt d’audit en rôle d’attaquant, avec la grille OWASP. Classez. Puis pour chaque faille : un test qui l’exploite, rouge ; un prompt ciblé ; vert. Et rendez les règles permanentes avec le fichier d’instructions de sécurité. Si votre API semble propre, testez le DELETE d’autrui : c’est la faille la plus fréquente. »

ANIMATION — Minuteur. Collecter au tableau les failles trouvées par les binômes : en général IDOR, surexposition, secret, absence de limite de débit.

TRANSITION — « Pause de 15 minutes. Ensuite : comment faire tout ça en équipe. »`,
];
// @@NOTES-END
