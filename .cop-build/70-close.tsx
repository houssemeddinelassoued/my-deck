// ─── Clôture ────────────────────────────────────────────────────────────────

// ─── Soutenances ────────────────────────────────────────────────────────────
const CPart = ({ n, tone, min, title, children }: { n: number; tone: Tone; min: string; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(n * 120) }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>
        {title} <span style={{ fontFamily: mono, fontSize: 20, color: STRONG[tone] }}>{min}</span>
      </div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const C_Soutenance: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Soutenances : quatre minutes pour convaincre</Title>
    <Lede>Le groupe évalue avec la grille. On ne juge pas la taille de la feature, mais la qualité des preuves.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CPart n={1} tone="blue" min="1 min" title="La démo">
        La feature en marche, appel réel à l’API.
      </CPart>
      <CPart n={2} tone="green" min="2 min" title="Les preuves">
        Matrice et tests, audit de sécurité, CI verte.
      </CPart>
      <CPart n={3} tone="violet" min="1 min" title="Un refus argumenté">
        Une proposition de Copilot que vous avez rejetée, et pourquoi.
      </CPart>
      <Timer id="soutenance" minutes={4} label="Soutenance" compact cls={A.in} style={dl(500)} />
    </div>
    <Checklist>
      <div className={A.right} style={{ position: 'absolute', left: 940, top: 262, width: 480, display: 'flex', flexDirection: 'column', gap: 10, ...dl(200) }}>
        <Eyebrow c={C.navy} size={19}>
          Grille du groupe
        </Eyebrow>
        <CheckItem id="so1" size={21}>La démo fonctionne</CheckItem>
        <CheckItem id="so2" w={2} size={21}>Tests : matrice et vert</CheckItem>
        <CheckItem id="so3" w={2} size={21}>Sécurité : faille prouvée et fermée</CheckItem>
        <CheckItem id="so4" size={21}>Méthode : plan, prompt d’équipe</CheckItem>
        <CheckItem id="so5" size={21}>PR et documentation à jour</CheckItem>
        <CheckItem id="so6" size={21}>Esprit critique : un refus argumenté</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1460, top: 300, width: 340, ...dl(350) }}>
        <CheckScore
          max={8}
          label="Score"
          levels={[
            { min: 0, text: 'À consolider.', tone: 'grey' },
            { min: 4, text: 'Solide.', tone: 'blue' },
            { min: 7, text: 'Prêt pour la prod.', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── Six idées à garder ─────────────────────────────────────────────────────
const CKey = ({ n, tone, icon, title, children, d }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={`M${n}`} tone={tone} size={50} />
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const C_Keys: Page = () => (
  <Frame mod={7}>
    <Title>Six idées à garder</Title>
    <Lede>Une par module. Si vous ne deviez retenir qu’une phrase de la journée : Copilot propose, vous prouvez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <CKey n={1} tone="blue" icon="chat" title="Le contexte" d={100}>
        Ce que Copilot voit, c’est vous qui le choisissez. Structurez, décomposez, mesurez.
      </CKey>
      <CKey n={2} tone="teal" icon="layers" title="L’architecture" d={180}>
        Plan et interfaces d’abord, génération par lots, à l’image de l’existant.
      </CKey>
      <CKey n={3} tone="pink" icon="flask" title="Les tests" d={260}>
        La matrice avant /tests. Le diff des tests se relit en premier.
      </CKey>
      <CKey n={4} tone="violet" icon="wand" title="Le refactoring" d={340}>
        Un principe par prompt, tests intouchés, performance mesurée.
      </CKey>
      <CKey n={5} tone="coral" icon="shield" title="La sécurité" d={420}>
        Nommez les menaces, prouvez par un test, outillez la détection.
      </CKey>
      <CKey n={6} tone="green" icon="users" title="L’équipe" d={500}>
        Ce qui marche se partage dans le dépôt. La valeur se mesure.
      </CKey>
    </div>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const C_AutoPos: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations qu’à 9:15. Cochez, comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="af1" size={27}>Expliquer ce que Copilot « voit » quand il propose une complétion</CheckItem>
        <CheckItem id="af2" size={27}>Découper une tâche complexe en une suite de prompts vérifiables</CheckItem>
        <CheckItem id="af3" size={27}>Faire générer un module qui respecte l’architecture existante</CheckItem>
        <CheckItem id="af4" size={27}>Obtenir des tests qui couvrent cas limites et cas négatifs</CheckItem>
        <CheckItem id="af5" size={27}>Refactorer du code généré en appliquant SOLID, tests au vert</CheckItem>
        <CheckItem id="af6" size={27}>Repérer une injection ou un contrôle d’accès manquant dans une suggestion</CheckItem>
        <CheckItem id="af7" size={27}>Partager instructions et prompts d’équipe via le dépôt</CheckItem>
        <CheckItem id="af8" size={27}>Mesurer l’apport réel de Copilot sur une équipe</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les TP à froid, à votre rythme.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : ancrez-la cette semaine.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : à vous de diffuser.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Un point qui reste décoché ? C’est la première ligne de votre plan d’action.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d'action ──────────────────────────────────────────────────────────
const CHorizon = ({ icon, tone, when, title, d, children }: { icon: IconName; tone: Tone; when: string; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div>
        <Eyebrow c={STRONG[tone] === C.yellow ? C.amber : STRONG[tone]} size={18}>
          {when}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `2px dashed ${C.rule}`, fontSize: 21, color: C.muted }}>Mon engagement : …</div>
  </div>
);

const C_Plan: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Mon plan d’action</Title>
    <Lede>Trois horizons, une action chacun. Écrivez-les sur votre fiche : le questionnaire à froid vous les rappellera.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 470, display: 'flex', gap: 28 }}>
      <CHorizon icon="bolt" tone="blue" when="Demain" title="Sur mon poste" d={100}>
        <Bullet size={22}>Écrire copilot-instructions.md pour mon projet</Bullet>
        <Bullet size={22}>Ajouter security.instructions.md</Bullet>
        <Bullet size={22}>Une matrice de cas avant chaque /tests</Bullet>
      </CHorizon>
      <CHorizon icon="users" tone="violet" when="Dans 30 jours" title="Avec mon équipe" d={220}>
        <Bullet size={22} tone="violet">Trois prompts d’équipe partagés et relus</Bullet>
        <Bullet size={22} tone="violet">Relire le diff des tests en premier, en règle</Bullet>
        <Bullet size={22} tone="violet">Mesurer une base « avant »</Bullet>
      </CHorizon>
      <CHorizon icon="flag" tone="green" when="Dans 90 jours" title="Pour l’organisation" d={340}>
        <Bullet size={22} tone="green">Charte adoptée et affichée</Bullet>
        <Bullet size={22} tone="green">CodeQL et secrets bloquants en CI</Bullet>
        <Bullet size={22} tone="green">Un bilan mesuré, partagé</Bullet>
      </CHorizon>
    </div>
  </Frame>
);

// ─── Ressources & évaluation ────────────────────────────────────────────────
const CRes = ({ icon, tone, title, url, d }: { icon: IconName; tone: Tone; title: string; url: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.electric }}>{url}</div>
    </div>
  </div>
);

const CEval = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const C_Resources: Page = () => (
  <Frame mod={7}>
    <Title>Ressources et évaluation</Title>
    <Lede>Copilot change chaque mois : ces sources font foi, nos supports datent d’octobre 2026.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CRes icon="book" tone="blue" title="Documentation GitHub Copilot" url="docs.github.com/copilot" d={100} />
      <CRes icon="code" tone="violet" title="Copilot dans VS Code" url="code.visualstudio.com/docs/copilot" d={170} />
      <CRes icon="layers" tone="green" title="Instructions, prompts et agents de la communauté" url="github.com/github/awesome-copilot" d={240} />
      <CRes icon="shield" tone="coral" title="OWASP Top 10 : 2025" url="owasp.org/Top10" d={310} />
      <CRes icon="chart" tone="teal" title="Rapports DORA (IA et performance)" url="dora.dev" d={380} />
      <CRes icon="flask" tone="yellow" title="Étude METR sur la productivité (2025)" url="metr.org" d={450} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1140, top: 262, width: 660, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
      <PanelTitle icon="note">Évaluation de la formation</PanelTitle>
      <CEval n={1} tone="blue" title="À chaud, maintenant" d={300}>
        Questionnaire de satisfaction : cinq minutes, avant de partir.
      </CEval>
      <CEval n={2} tone="violet" title="Par le formateur" d={400}>
        Compétences évaluées sur les TP et la soutenance.
      </CEval>
      <CEval n={3} tone="green" title="À froid, dans quelques semaines" d={500}>
        Ce qui est resté, ce que vous appliquez au quotidien.
      </CEval>
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
        <Quote by="Le fil conducteur de la journée">Copilot propose, le développeur dispose… et prouve.</Quote>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 520, ...dl(900) }}>
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
export const __pages = [C_Soutenance, C_Keys, C_AutoPos, C_Plan, C_Resources, C_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 25 min · SOUTENANCES · 16:30

OBJECTIF — Projet de clôture du programme : présenter et défendre la feature ; évaluation par le formateur des compétences acquises.

DIRE — « Quatre minutes par binôme : une minute de démo, deux minutes de preuves, une minute sur une proposition de Copilot que vous avez refusée. Le groupe évalue avec la grille : les tests et la sécurité comptent double. On ne juge pas la taille de la feature, mais la qualité des preuves. »

ANIMATION — Relancer le minuteur pour chaque binôme. Décocher la grille entre deux binômes. Une question du groupe par binôme, maximum. Noter les compétences observées pour l’évaluation formateur.

TRANSITION — « Bravo à tous. Rassemblons la journée. »`,
  `⏱ 3 min · SIX IDÉES À GARDER

OBJECTIF — Synthèse : une idée par module.

DIRE — « Le contexte : ce que Copilot voit, c’est vous qui le choisissez. L’architecture : plan et interfaces d’abord, génération par lots, à l’image de l’existant. Les tests : la matrice avant /tests, et le diff des tests relu en premier. Le refactoring : un principe par prompt, tests intouchés. La sécurité : nommer, prouver, outiller. L’équipe : ce qui marche se partage dans le dépôt, et la valeur se mesure. Et si une seule phrase : Copilot propose, vous prouvez. »

TRANSITION — « Mesurons le chemin parcouru. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Auto-positionnement de fin de formation, à comparer avec celui du matin.

DIRE — « Exactement les mêmes affirmations que ce matin. Cochez honnêtement, puis comparez avec votre score de départ. Ce qui reste décoché devient la première ligne de votre plan d’action. »

ANIMATION — Demander à quelques volontaires leur progression. Noter le score moyen pour le bilan de session.

TRANSITION — « Justement : votre plan d’action. »`,
  `⏱ 4 min · PLAN D’ACTION

OBJECTIF — Ancrer la mise en application au quotidien.

DIRE — « Trois horizons. Demain, sur votre poste : une action de moins d’une heure, comme écrire les instructions Copilot de votre projet. Dans trente jours, avec votre équipe : partager trois prompts, instaurer la relecture des tests en premier, mesurer une base. Dans quatre-vingt-dix jours, pour l’organisation : la charte, les analyses bloquantes en CI, un bilan chiffré. Une action par horizon, écrite sur votre fiche. Le questionnaire à froid vous demandera ce que vous en avez fait. »

TRANSITION — « Les ressources pour continuer, et l’évaluation. »`,
  `⏱ 3 min · RESSOURCES ET ÉVALUATION

OBJECTIF — Fournir les ressources documentaires et lancer l’évaluation à chaud.

DIRE — « Copilot évolue chaque mois : les noms de modes, de fichiers et de variables bougent. Ces sources font foi. La collection awesome-copilot maintenue par GitHub est une mine d’instructions et de prompts à adapter. Pour l’évaluation : questionnaire à chaud maintenant, l’évaluation de vos compétences par le formateur sur les TP et la soutenance, et un questionnaire à froid dans quelques semaines. »

ANIMATION — Laisser cinq minutes pour le questionnaire à chaud.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI · 17:00

DIRE — « Merci pour votre énergie et vos questions. Une seule chose à retenir : Copilot propose, le développeur dispose… et prouve. Bonne continuation ! »`,
];
// @@NOTES-END
