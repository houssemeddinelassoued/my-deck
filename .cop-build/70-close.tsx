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
    <Title>Présentations : deux ou trois volontaires, quatre minutes</Title>
    <Lede>En partage d’écran. On ne juge pas la taille de la feature, mais la qualité des preuves et de l’orchestration.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CPart n={1} tone="blue" min="1 min" title="La démo">
        La feature en marche, et la session du chef d’orchestre : ses sous-agents.
      </CPart>
      <CPart n={2} tone="green" min="2 min" title="Les preuves">
        Plan validé, tests rouges puis verts, audit, CI verte.
      </CPart>
      <CPart n={3} tone="violet" min="1 min" title="Un refus argumenté">
        Un plan, un diff ou une proposition d’agent que vous avez refusés, et pourquoi.
      </CPart>
      <Timer id="soutenance" minutes={4} label="Présentation" compact cls={A.in} style={dl(500)} />
    </div>
    <Checklist>
      <div className={A.right} style={{ position: 'absolute', left: 940, top: 262, width: 480, display: 'flex', flexDirection: 'column', gap: 10, ...dl(200) }}>
        <Eyebrow c={C.navy} size={19}>
          Grille d’écoute
        </Eyebrow>
        <CheckItem id="so1" size={21}>La démo fonctionne</CheckItem>
        <CheckItem id="so2" w={2} size={21}>Tests : matrice et vert</CheckItem>
        <CheckItem id="so3" w={2} size={21}>Sécurité : faille prouvée et fermée</CheckItem>
        <CheckItem id="so4" size={21}>Agents : droits minimaux, deux validations</CheckItem>
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
        Plan d’abord, puis des règles écrites une fois : copilot-instructions.md, court.
      </CKey>
      <CKey n={3} tone="pink" icon="flask" title="Les tests" d={260}>
        La matrice avant les tests, la méthode dans une skill. Le diff des tests en premier.
      </CKey>
      <CKey n={4} tone="violet" icon="wand" title="Le refactoring" d={340}>
        Un agent, un rôle, des outils minimaux. Tests intouchés, performance mesurée.
      </CKey>
      <CKey n={5} tone="coral" icon="shield" title="La sécurité" d={420}>
        Un auditeur qui ne peut rien modifier. Chaque faille prouvée par un test.
      </CKey>
      <CKey n={6} tone="green" icon="route" title="L’orchestration" d={500}>
        Des agents qui délèguent, vous qui validez : le plan, puis le diff. La valeur se mesure.
      </CKey>
    </div>
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
        <Bullet size={22}>Convertir mes .prompt.md en skills</Bullet>
        <Bullet size={22}>Un premier agent, lecture seule</Bullet>
      </CHorizon>
      <CHorizon icon="users" tone="violet" when="Dans 30 jours" title="Avec mon équipe" d={220}>
        <Bullet size={22} tone="violet">Instructions, skills et agents relus en PR</Bullet>
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
        Compétences évaluées sur les TP et les présentations.
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
export const __pages = [C_Soutenance, C_Keys, C_Plan, C_Resources, C_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 12 min · PRÉSENTATIONS (2–3 volontaires) · 16:40

OBJECTIF — Projet de clôture du programme : présenter et défendre la feature ; évaluation par le formateur des compétences acquises.

DIRE — « Deux ou trois volontaires, quatre minutes chacun, en partage d’écran : une minute de démo avec la session du chef d’orchestre — dépliez un sous-agent —, deux minutes de preuves, une minute sur un refus : un plan, un diff ou une proposition que vous avez rejetés. Les autres écoutent avec la grille ; les tests et la sécurité comptent double. Vous pouvez déposer une capture de votre PR dans le Chat. »

ANIMATION — Appeler les volontaires repérés pendant le TP. Relancer le minuteur pour chacun et décocher la grille entre deux présentations. Une question au micro par présentation, maximum. Noter les compétences observées pendant les TP pour l’évaluation formateur.

TRANSITION — « Bravo à tous. Rassemblons la journée. »`,
  `⏱ 3 min · SIX IDÉES À GARDER

OBJECTIF — Synthèse : une idée par module.

DIRE — « Le contexte : ce que Copilot voit, c’est vous qui le choisissez. L’architecture : le plan d’abord, puis des règles écrites une fois, dans un fichier court. Les tests : la matrice avant les tests, la méthode dans une skill, et le diff des tests relu en premier. Le refactoring : un agent, un rôle, des outils minimaux. La sécurité : un auditeur qui ne peut rien modifier, chaque faille prouvée par un test. L’orchestration : des agents qui délèguent, vous qui validez. Et si une seule phrase : Copilot propose, vous prouvez. »

TRANSITION — « Et demain, que faites-vous ? »`,
  `⏱ 4 min · PLAN D’ACTION

OBJECTIF — Ancrer la mise en application au quotidien.

DIRE — « Trois horizons. Demain, sur votre poste : une action de moins d’une heure — écrire les instructions Copilot de votre projet, convertir vos anciens .prompt.md en skills, ou écrire un premier agent en lecture seule. Dans trente jours, avec votre équipe : instructions, skills et agents relus en PR comme du code, la relecture des tests en premier, une base mesurée. Dans quatre-vingt-dix jours, pour l’organisation : la charte, les analyses bloquantes en CI, un bilan chiffré. Une action par horizon, écrite dans votre document personnel. Puis un tour rapide au micro : deux ou trois volontaires lisent leur action de demain. Le questionnaire à froid vous demandera ce que vous en avez fait. »

TRANSITION — « Les ressources pour continuer, et l’évaluation. »`,
  `⏱ 3 min · RESSOURCES ET ÉVALUATION

OBJECTIF — Fournir les ressources documentaires et lancer l’évaluation à chaud.

DIRE — « Copilot évolue chaque mois : les noms de modes, de fichiers et de variables bougent. Ces sources font foi. La collection awesome-copilot maintenue par GitHub est une mine d’instructions, de skills et d’agents à adapter : relisez-les avant de les installer, une skill peut contenir des scripts. Pour l’évaluation : questionnaire à chaud maintenant, l’évaluation de vos compétences par le formateur sur les TP et les présentations, et un questionnaire à froid dans quelques semaines. »

ANIMATION — Laisser cinq minutes pour le questionnaire à chaud.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI · 17:00

DIRE — « Merci pour votre énergie et vos questions. Une seule chose à retenir : Copilot propose, le développeur dispose… et prouve. Bonne continuation ! »`,
];
// @@NOTES-END
