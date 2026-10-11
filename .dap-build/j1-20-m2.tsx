// ─── Module 2 · Intégrer l'IA dans le workflow ──────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Intégrer l’IA dans
        <br />
        le workflow
      </>
    }
    sub="L’IA à chaque étape du cycle : modes, prompting, contexte, collaboration humain–IA et indicateurs."
    dur="11:30 – 15:30 · labs inclus"
    labs={
      <>
        <Tag tone="green" size={19}>2.1</Tag>
        <Tag tone="green" size={19}>2.2</Tag>
        <Tag tone="green" size={19}>2.3</Tag>
        <Tag tone="green" size={19}>3.1</Tag>
        <Tag tone="green" size={19}>3.3</Tag>
        <Tag tone="green" size={19}>3.4</Tag>
      </>
    }
  >
    <SecItem n={1}>Le cycle de développement augmenté</SecItem>
    <SecItem n={2}>Ask, Plan, Agent : le bon mode au bon moment</SecItem>
    <SecItem n={3}>Prompting : les cinq ingrédients</SecItem>
    <SecItem n={4}>Context engineering : instructions, skills, MCP</SecItem>
    <SecItem n={5}>Collaboration humain–IA et indicateurs</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── Le cycle augmenté ──────────────────────────────────────────────────────
const M2Phase = ({ icon, tone, name, ia, you, lab, d }: { icon: IconName; tone: Tone; name: string; ia: ReactNode; you: ReactNode; lab: string; d: number }) => (
  <div className={A.in} style={{ width: 262, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 20px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{name}</div>
    <div style={{ fontSize: 23, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: STRONG[tone] }}>IA · </strong>
      {ia}
    </div>
    <div style={{ fontSize: 23, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: C.navy }}>Vous · </strong>
      {you}
    </div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone="green" size={17}>
        {lab}
      </Tag>
    </div>
  </div>
);

const M2_Cycle: Page = () => (
  <Frame mod={2}>
    <Title>L’IA à chaque étape du cycle de développement</Title>
    <Lede>Pas un outil de plus : un coéquipier présent de la conception à la maintenance, toujours sous votre contrôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 540, display: 'flex', justifyContent: 'space-between' }}>
      <M2Phase icon="bulb" tone="blue" name="Conception" ia="challenge l’idée, propose options et schémas" you="tranchez et documentez (ADR)" lab="Labs 1.x · 2.x" d={100} />
      <M2Phase icon="code" tone="violet" name="Codage" ia="complète, implémente par lots, applique les skills" you="validez le plan, relisez les diffs" lab="Labs 4.x · 5.x" d={200} />
      <M2Phase icon="flask" tone="pink" name="Tests" ia="écrit les tests d’abord, cas limites, E2E" you="vérifiez qu’ils testent la bonne chose" lab="Labs 5.2 · 8.2" d={300} />
      <M2Phase icon="doc" tone="teal" name="Documentation" ia="README, JSDoc, notes de version" you="corrigez ce qui est faux ou daté" lab="Labs 2.2 · 10.2" d={400} />
      <M2Phase icon="eye" tone="yellow" name="Revue" ia="première revue, sécurité, conventions" you="décidez, la responsabilité reste humaine" lab="Labs 6.1 · 8.3" d={500} />
      <M2Phase icon="rocket" tone="green" name="Livraison" ia="écrit la CI, explique un échec, analyse un log" you="gardez les portes de qualité" lab="Lab 9.1" d={600} />
    </div>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 250 840 C 250 905, 1670 905, 1670 840" fill="none" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M 262 852 L 250 836 L 238 852" fill="none" stroke={C.faint} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className={A.fade} style={{ position: 'absolute', left: 0, right: 0, top: 905, textAlign: 'center', fontSize: 22, color: C.muted, ...dl(800) }}>
      Une boucle courte : petites itérations, chaque sortie de l’IA vérifiée avant l’étape suivante.
    </div>
  </Frame>
);

// ─── Ask / Plan / Agent ─────────────────────────────────────────────────────
const M2Mode = ({ icon, tone, name, what, when, risk, cls }: { icon: IconName; tone: Tone; name: string; what: string; when: string; risk: string; cls?: string }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `8px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={60} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: STRONG[tone] }}>{name}</div>
    </div>
    <div style={{ marginTop: 18, fontSize: 19, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>CE QU’IL FAIT</div>
    <div style={{ fontSize: 26, lineHeight: 1.4, color: C.ink }}>{what}</div>
    <div style={{ marginTop: 14, fontSize: 19, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>QUAND L’UTILISER</div>
    <div style={{ fontSize: 26, lineHeight: 1.4, color: C.ink }}>{when}</div>
    <div style={{ marginTop: 14, fontSize: 19, fontWeight: 700, letterSpacing: '0.08em', color: T.coral.fg }}>VIGILANCE</div>
    <div style={{ fontSize: 24, lineHeight: 1.4, color: C.soft }}>{risk}</div>
  </div>
);

const M2_Modes: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Ask, Plan, Agent : le bon mode au bon moment</Title>
    <Lede>Les trois agents intégrés de Copilot dans VS Code, du plus prudent au plus autonome.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 26 }}>
      <M2Mode cls={A.in} icon="chat" tone="teal" name="Ask" what="Répond, explique, compare. Ne modifie rien." when="Comprendre un code, explorer des options, se faire poser des questions." risk="Les réponses restent des propositions : rien n’est vérifié." />
      <M2Mode cls={b.on(1)} icon="map" tone="blue" name="Plan" what="Analyse le dépôt et produit un plan d’action, sans écrire de code." when="Avant toute tâche de plus d’un fichier : vous validez le plan." risk="Un plan flou donne une exécution floue : relisez-le vraiment." />
      <M2Mode cls={b.on(2)} icon="bot" tone="violet" name="Agent" what="Lit, modifie plusieurs fichiers, lance commandes et tests, itère." when="Exécuter un plan validé, par petits lots, avec un critère de fin." risk="Commandes exécutées, fichiers modifiés : diffs relus, droits limités." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', gap: 28, alignItems: 'center', fontSize: 22, color: C.soft, ...dl(600) }}>
      <span>
        <Kbd>Tab</Kbd> complétion
      </span>
      <span>
        <Kbd>Ctrl+I</Kbd> chat inline
      </span>
      <span>
        <Kbd>Ctrl+Alt+I</Kbd> vue Chat
      </span>
      <span>
        <Kbd>#</Kbd> joindre un fichier
      </span>
      <span>
        <Kbd>/compact</Kbd> <Kbd>/fork</Kbd> gérer la session
      </span>
    </div>
  </Frame>
);

// ─── Les 5 ingrédients ──────────────────────────────────────────────────────
const M2Ing = ({ n, tone, title, ex, beat }: { n: number; tone: Tone; title: string; ex: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 24, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '24px 28px', borderLeft: `8px solid ${STRONG[tone]}` }}>
    <Num n={n} tone={tone} size={60} />
    <div style={{ width: 400, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 31, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 26, lineHeight: 1.4, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
  </div>
);

const M2_Ingredients: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Les cinq ingrédients d’un bon prompt</Title>
    <Lede>La grille que vous utiliserez dans chaque lab. Un ingrédient manquant, c’est une décision laissée au hasard.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 265, width: 1680, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <M2Ing n={1} tone="blue" title="Un rôle" ex="« Agis comme un développeur TypeScript senior »… ou mieux : le bon agent sélectionné." beat={0} />
      <M2Ing n={2} tone="violet" title="Un contexte ciblé" ex="2 ou 3 fichiers nommés avec # (#PRODUCT.md, #src/domain/types.ts), pas tout le projet." beat={1} />
      <M2Ing n={3} tone="pink" title="Une seule tâche, bornée" ex="« Uniquement le filtre par emplacement. N’écris aucun composant. »" beat={2} />
      <M2Ing n={4} tone="teal" title="Contraintes et format" ex="Où écrire, quel format, quelle longueur : « tests Vitest dans stock.test.ts »." beat={3} />
      <M2Ing n={5} tone="green" title="Un critère de fin" ex="La commande qui prouve que c’est fini : « termine par npm test, tout doit passer »." beat={4} />
    </div>
  </Frame>
);

// ─── Constructeur de prompt interactif ──────────────────────────────────────
const M2_PARTS = [
  { k: 'role', label: 'Rôle', tone: 'blue' as Tone, txt: 'Agis comme un développeur React + TypeScript senior du projet FrigoMalin.' },
  { k: 'ctx', label: 'Contexte ciblé', tone: 'violet' as Tone, txt: 'Fichiers : #src/ui/Inventory/Inventory.tsx et #src/domain/stock.ts.' },
  { k: 'task', label: 'Tâche bornée', tone: 'pink' as Tone, txt: 'Ajoute uniquement un filtre par emplacement (frigo, congélateur, placard). Ne modifie aucun autre écran.' },
  { k: 'fmt', label: 'Contraintes & format', tone: 'teal' as Tone, txt: 'Logique de filtre en fonction pure dans src/domain ; tests Vitest d’abord dans stock.test.ts.' },
  { k: 'done', label: 'Critère de fin', tone: 'green' as Tone, txt: 'Termine par npm test (tout au vert) et résume en 3 lignes les fichiers modifiés.' },
];

const M2Part = ({ i, on }: { i: number; on: boolean }) => {
  const p = M2_PARTS[i];
  return on ? (
    <div className={A.fade} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDuration: '400ms' } as CSSProperties}>
      <span style={{ flex: 'none', width: 8, alignSelf: 'stretch', borderRadius: 4, background: STRONG[p.tone] }} />
      <span>{p.txt}</span>
    </div>
  ) : null;
};

const M2PartBtn = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const p = M2_PARTS[i];
  return (
    <Toggle on={on} onChange={flip} tone={p.tone} size={24} label={<span style={{ fontWeight: 600 }}>{p.label}</span>} />
  );
};

const M2_PromptLab: Page = () => {
  const [on, setOn] = useState<boolean[]>([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const verdict =
    n === 0 ? 'Le modèle devine tout : où, comment, jusqu’où.' : n < 3 ? 'Mieux, mais des décisions restent au hasard.' : n < 5 ? 'Presque : il manque de quoi savoir quand c’est fini.' : 'Prompt complet : résultat prévisible et vérifiable.';
  return (
    <Frame mod={2} kind="demo">
      <Title>Un prompt, cinq améliorations</Title>
      <Lede>Partez du prompt vague, ajoutez les ingrédients un à un et regardez la demande devenir vérifiable.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 440, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Eyebrow c={C.navy} size={20}>
          Ingrédients
        </Eyebrow>
        <M2PartBtn i={0} on={on[0]} flip={() => flip(0)} />
        <M2PartBtn i={1} on={on[1]} flip={() => flip(1)} />
        <M2PartBtn i={2} on={on[2]} flip={() => flip(2)} />
        <M2PartBtn i={3} on={on[3]} flip={() => flip(3)} />
        <M2PartBtn i={4} on={on[4]} flip={() => flip(4)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Vider
          </Btn>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 620, top: 270, width: 1180, ...dl(150) }}>
        <CodeDark file="Prompt (mode Agent)" size={24} wrap style={{ minHeight: 470 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <M2Part i={0} on={on[0]} />
            <M2Part i={1} on={on[1]} />
            {on[2] ? <M2Part i={2} on /> : <div style={{ color: '#FFD27A' }}>Ajoute un filtre à l’inventaire.</div>}
            <M2Part i={3} on={on[3]} />
            <M2Part i={4} on={on[4]} />
          </div>
        </CodeDark>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 1 ? C.coral : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 2 ? C.yellow : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 3 ? C.yellow : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 4 ? C.green : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 5 ? C.green : C.panel }} />
          </div>
          <span style={{ fontSize: 25, fontWeight: 600, color: n === 5 ? T.green.fg : n >= 3 ? T.yellow.fg : T.coral.fg }}>{verdict}</span>
        </div>
      </div>
    </Frame>
  );
};

// ─── Techniques de prompting (cartes à retourner) ───────────────────────────
const M2Tech = ({ icon, tone, title, when, ex }: { icon: IconName; tone: Tone; title: string; when: string; ex: ReactNode }) => (
  <FlipCard
    w={538}
    h={320}
    tone={tone}
    backTone={tone}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={icon} tone={tone} size={54} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{when}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={18}>
          Exemple
        </Eyebrow>
        <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, lineHeight: 1.5, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M2_Techniques: Page = () => (
  <Frame mod={2}>
    <Title>Six techniques qui changent tout</Title>
    <Lede>Cliquez une carte pour voir un exemple de formulation sur FrigoMalin.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 538px)', gap: 33, rowGap: 30 }}>
      <M2Tech icon="chat" tone="blue" title="Questions d’abord" when="Quand le besoin est flou : faites-vous interroger avant toute écriture." ex="Avant d’écrire, pose-moi au maximum 5 questions pour lever les ambiguïtés." />
      <M2Tech icon="map" tone="violet" title="Le plan avant le code" when="Toute tâche de plus d’un fichier : plan validé, puis exécution par lots." ex="Propose un plan en lots de 1 à 3 fichiers. N’écris aucun code avant mon accord." />
      <M2Tech icon="layers" tone="teal" title="Des exemples (few-shot)" when="Pour un format ou un style précis : montrez 1 ou 2 exemples." ex="Nomme les tests comme ceci : « signale un produit périmé hier »." />
      <M2Tech icon="flask" tone="pink" title="Les tests d’abord" when="Pour la logique métier : les tests fixent le comportement attendu." ex="Écris uniquement les tests de suggestRecipes. Lance-les : ils doivent échouer." />
      <M2Tech icon="reset" tone="yellow" title="Le rétro-prompt" when="Vous avez le résultat voulu : faites retrouver la consigne qui le produit." ex="Voici le résultat attendu (types.ts). Quel prompt l’aurait produit du premier coup ?" />
      <M2Tech icon="checkCircle" tone="green" title="Un critère de fin vérifiable" when="Toujours : sinon l’agent décide seul quand il a « fini »." ex="Termine par npm test et npm run lint. Tout doit passer, sinon corrige." />
    </div>
  </Frame>
);

// ─── Context engineering : 4 couches ────────────────────────────────────────
const M2Layer = ({ w, tone, title, files, desc, beat }: { w: number; tone: Tone; title: string; files: ReactNode; desc: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
    <div
      style={{
        width: w,
        flex: 'none',
        height: 128,
        borderRadius: 18,
        background: T[tone].bg,
        boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 26px',
        boxSizing: 'border-box',
        marginLeft: (900 - w) / 2,
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</div>
      <div style={{ marginTop: 6, fontFamily: mono, fontSize: 19, color: C.ink }}>{files}</div>
    </div>
    <div style={{ width: 700, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{desc}</div>
  </div>
);

const M2_Layers: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Context engineering : quatre couches</Title>
    <Lede>Le vrai levier n’est pas le prompt du jour : c’est ce que l’assistant sait déjà… ou ne voit jamais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Layer w={420} tone="navy" title="Toujours chargé" files="copilot-instructions.md · AGENTS.md" desc="Court et dense : stack, commandes, structure, principes, interdits. Payé à chaque requête." beat={0} />
      <M2Layer w={600} tone="blue" title="Selon le fichier" files="*.instructions.md (applyTo)" desc="Règles des tests, de l’UI, du domaine : chargées seulement quand ces fichiers sont en jeu." beat={1} />
      <M2Layer w={780} tone="green" title="À la demande" files="skills · # fichiers · outils MCP" desc="Savoir-faire et documentation chargés quand la tâche les réclame (la description décide)." beat={2} />
      <M2Layer w={900} tone="coral" title="Jamais" files=".copilotignore · exclusion de contenu · .gitignore" desc="Secrets, données réelles, fichiers lourds : hors contexte. On y revient au module 3." beat={3} />
    </div>
  </Frame>
);

// ─── Les fichiers de personnalisation ───────────────────────────────────────
const M2FRow = ({ file, when, role, lab, tone, d }: { file: string; when: string; role: string; lab: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '460px 360px 1fr 150px', alignItems: 'center', gap: 20, padding: '14px 22px', borderRadius: 14, background: C.card, boxShadow: SHADOW_SM, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, color: T[tone].fg }}>{file}</span>
    <span style={{ fontSize: 21, color: C.ink }}>{when}</span>
    <span style={{ fontSize: 21, color: C.soft }}>{role}</span>
    <span>
      <Tag tone="green" size={17}>
        {lab}
      </Tag>
    </span>
  </div>
);

const M2_Files: Page = () => (
  <Frame mod={2}>
    <Title>Les fichiers qui personnalisent votre assistant</Title>
    <Lede>Tous versionnés dans le dépôt. Retenez surtout la colonne « chargé quand » : elle fait la facture.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '460px 360px 1fr 150px', gap: 20, padding: '0 22px', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>FICHIER</span>
        <span>CHARGÉ QUAND</span>
        <span>SERT À</span>
        <span>LAB</span>
      </div>
      <M2FRow file=".github/copilot-instructions.md" when="à chaque requête" role="stack, commandes, principes, interdits" lab="3.3" tone="navy" d={100} />
      <M2FRow file="*.instructions.md (applyTo)" when="si un fichier correspond" role="règles par type de fichier" lab="3.4" tone="blue" d={170} />
      <M2FRow file=".github/skills/*/SKILL.md" when="si la tâche correspond" role="savoir-faire, gabarits, scripts" lab="4.2 · 4.3" tone="green" d={240} />
      <M2FRow file=".github/agents/*.agent.md" when="agent choisi ou appelé" role="rôle, outils, modèle, interdits" lab="2.1 · 6.x" tone="violet" d={310} />
      <M2FRow file=".github/hooks/*.json" when="à chaque événement" role="contrôles déterministes (lint…)" lab="8.1" tone="coral" d={380} />
      <M2FRow file=".mcp.json" when="au démarrage des serveurs" role="brancher GitHub, Playwright…" lab="1.3 · 6.4" tone="teal" d={450} />
      <M2FRow file="AGENTS.md" when="lu par plusieurs agents" role="instructions portables multi-outils" lab="option" tone="grey" d={520} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
      Noms et emplacements vérifiés pour VS Code en octobre 2026 : Copilot évolue vite, contrôlez la documentation avant chaque projet.
    </div>
  </Frame>
);

// ─── MCP ────────────────────────────────────────────────────────────────────
const M2Srv = ({ x, y, icon, tone, name, desc, beat }: { x: number; y: number; icon: IconName; tone: Tone; name: string; desc: string; beat: number }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x, top: y, width: 330, display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '14px 18px' }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 18, color: C.muted, lineHeight: 1.3 }}>{desc}</div>
    </div>
  </div>
);

const M2_MCP: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>MCP : le port USB-C des agents</Title>
    <Lede>Model Context Protocol : un standard ouvert pour brancher un agent sur des outils et des données.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <path d="M 560 560 L 760 380" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M 560 580 L 760 560" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M 560 600 L 760 740" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 140, top: 450, width: 420, background: G.navy, borderRadius: 22, padding: '24px 28px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name="bot" tone="violet" size={58} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28 }}>Agent (Copilot)</div>
          <div style={{ fontSize: 19, color: '#C9D2F2' }}>client MCP</div>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.4, color: '#DCE3FA' }}>Découvre les outils de chaque serveur et décide quand les appeler.</div>
    </div>
    <M2Srv x={770} y={320} icon="git" tone="navy" name="GitHub" desc="issues, PR, revues (lab 1.3)" beat={1} />
    <M2Srv x={770} y={505} icon="globe" tone="green" name="Playwright" desc="piloter un vrai navigateur (lab 6.4)" beat={1} />
    <M2Srv x={770} y={690} icon="palette" tone="pink" name="Google Stitch" desc="maquettes d’écrans (lab 4.1)" beat={1} />
    <div className={b.on(2)} style={{ position: 'absolute', left: 1180, top: 300, width: 620, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="flag" title="Un standard neutre" size={22}>
        Créé par Anthropic (nov. 2024), confié en déc. 2025 à l’Agentic AI Foundation (Linux Foundation), avec AGENTS.md et goose. Supporté par
        VS Code, ChatGPT, Cursor, Gemini…
      </Card>
      <Card tone="coral" icon="alert" title="Trois vigilances" size={22}>
        Un serveur MCP est du code tiers avec des droits. Chaque outil ajoute sa définition au contexte. Les données qu’il renvoie peuvent contenir
        des instructions malveillantes.
      </Card>
    </div>
  </Frame>
);

// ─── Que confier à l'IA ? (glisser-déposer) ─────────────────────────────────
const M2Zone = ({ x, title, sub, tone }: { x: number; title: string; sub: string; tone: Tone }) => (
  <div style={{ position: 'absolute', left: x, top: 500, width: 540, height: 460, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '18px 22px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 20, color: C.soft, marginTop: 2 }}>{sub}</div>
  </div>
);

const M2_Automate: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Que confier à l’IA ? Triez les tâches</Title>
    <Lede>Glissez chaque tâche dans une colonne. Double-clic : la pastille revient à sa place. On débat ensuite.</Lede>
    <M2Zone x={120} title="L’IA fait, je relis" sub="répétitif, vérifiable, faible risque" tone="green" />
    <M2Zone x={690} title="L’IA propose, je décide" sub="options utiles, décision humaine" tone="yellow" />
    <M2Zone x={1260} title="Je garde la main" sub="ou un outil déterministe" tone="coral" />
    <Drag x={120} y={262} w={405} tone="blue" size={21}>Snippets et boilerplate</Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={21}>Tests d’une fonction pure</Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={21}>Commentaires JSDoc</Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={21}>Renommer un symbole partout</Drag>
    <Drag x={120} y={330} w={405} tone="blue" size={21}>Migration vers une version majeure</Drag>
    <Drag x={545} y={330} w={405} tone="blue" size={21}>Choix d’architecture</Drag>
    <Drag x={970} y={330} w={405} tone="blue" size={21}>Revue de sécurité finale</Drag>
    <Drag x={1395} y={330} w={405} tone="blue" size={21}>Rotation d’une clé d’API</Drag>
    <Drag x={120} y={398} w={405} tone="blue" size={21}>Message de commit</Drag>
    <Drag x={545} y={398} w={405} tone="blue" size={21}>Jeu de données de test</Drag>
    <Drag x={970} y={398} w={405} tone="blue" size={21}>Décision de mise en production</Drag>
    <Drag x={1395} y={398} w={405} tone="blue" size={21}>Expliquer un log d’erreur</Drag>
  </Frame>
);

// ─── Collaboration humain–IA ────────────────────────────────────────────────
const M2Gate = ({ n, title, sub, beat }: { n: number; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 62, height: 62, flex: 'none', borderRadius: 16, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="humanCheck" size={34} color="#fff" />
    </div>
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>
        {n} · {title}
      </div>
      <div style={{ fontSize: 21, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M2_Collab: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Collaboration humain–IA : qui fait quoi ?</Title>
    <Lede>Un partenariat efficace où chacun apporte ce qu’il fait de mieux… et où la décision reste humaine.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 265, width: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="navy" icon="user" title="Le développeur" cls={A.in} size={22}>
        <strong>Architecte</strong> des choix · <strong>validateur</strong> du code · <strong>décideur</strong> final, responsable · <strong>expert métier</strong> qui
        connaît le contexte.
      </Card>
      <Card tone="violet" icon="bot" title="L’IA" cls={A.in} style={dl(150)} size={22}>
        <strong>Assistant</strong> sur le standard · <strong>accélérateur</strong> du répétitif · <strong>générateur</strong> d’options · <strong>amplificateur</strong> de vos
        compétences.
      </Card>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 265, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', ...dl(250) }}>
      <Eyebrow c={T.green.fg}>Quatre points de contrôle humains, à chaque tâche</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M2Gate n={1} title="Plan validé" sub="Avant toute modification : périmètre, fichiers, ordre, critère de fin." beat={1} />
        <M2Gate n={2} title="Diff relu" sub="Chaque lot lu comme une PR externe : compréhensible, nécessaire, sûr." beat={2} />
        <M2Gate n={3} title="Tests au vert" sub="Les tests et le lint passent, et testent vraiment ce qui compte." beat={3} />
        <M2Gate n={4} title="Merge par un humain" sub="Celui qui merge assume : jamais de mise en production sans revue." beat={4} />
      </div>
    </div>
  </Frame>
);

// ─── Indicateurs d'efficacité ───────────────────────────────────────────────
const M2Kpi = ({ label, verdict, why }: { label: string; verdict: 'ok' | 'mid' | 'bad'; why: string }) => {
  const [open, setOpen] = useState(false);
  const v = { ok: { t: 'Utile', tone: 'green' as Tone, icon: 'check' as IconName }, mid: { t: 'À interpréter', tone: 'yellow' as Tone, icon: 'alert' as IconName }, bad: { t: 'Trompeur', tone: 'coral' as Tone, icon: 'x' as IconName } }[verdict];
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        setOpen((o) => !o);
      }}
      style={{
        boxSizing: 'border-box',
        height: 124,
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 16,
        padding: '14px 20px',
        fontFamily: body,
        background: open ? T[v.tone].bg : C.card,
        boxShadow: open ? `inset 0 0 0 3px ${STRONG[v.tone]}` : SHADOW_SM,
        transition: `all 250ms ${EASE}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{label}</span>
        {open ? (
          <Tag tone={v.tone} size={17}>
            <Icon name={v.icon} size={17} sw={3} /> {v.t}
          </Tag>
        ) : (
          <Icon name="eye" size={24} color={C.faint} />
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 19, lineHeight: 1.35, color: open ? C.ink : C.faint }}>{open ? why : 'Utile, à interpréter ou trompeur ? Votez, puis cliquez.'}</div>
    </button>
  );
};

const M2_KPI: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Indicateurs d’efficacité : lesquels garder ?</Title>
    <Lede>Le programme demande de mesurer. Encore faut-il mesurer ce qui compte. Votez pour chaque indicateur, puis révélez.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <M2Kpi label="Délai issue → mise en production" verdict="ok" why="Mesure le flux de bout en bout (métrique DORA)." />
      <M2Kpi label="Lignes de code générées" verdict="bad" why="Plus de code, c’est plus de dette : mesure de vanité." />
      <M2Kpi label="Taux de suggestions acceptées" verdict="mid" why="Indique l’adoption, pas la valeur ni la qualité." />
      <M2Kpi label="Défauts échappés en production" verdict="ok" why="La qualité réelle, celle que voient les utilisateurs." />
      <M2Kpi label="Temps de revue par PR" verdict="ok" why="Si l’IA gonfle les PR, la revue devient le goulot." />
      <M2Kpi label="Nombre de prompts envoyés" verdict="bad" why="Mesure l’activité, pas le résultat." />
      <M2Kpi label="Couverture de tests" verdict="mid" why="Utile si les assertions sont pertinentes, sinon illusoire." />
      <M2Kpi label="Crédits IA par feature livrée" verdict="ok" why="Le coût rapporté à la valeur : clé depuis juin 2026." />
      <M2Kpi label="Taux de retouche (rework, revert)" verdict="ok" why="Révèle le code accepté trop vite." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 900, width: 1680, fontSize: 21, color: C.muted, ...dl(600) }}>
      Pour aller plus loin : les métriques DORA (délai, fréquence, échecs, restauration) et le cadre SPACE (satisfaction, performance, activité, collaboration, flux).
    </div>
  </Frame>
);

// ─── Sprint 2 · Architecture 100 % navigateur ───────────────────────────────
const M2Box = ({ x, y, w, h, tone, title, sub, cls }: { x: number; y: number; w: number; h: number; tone: Tone; title: string; sub: string; cls?: string }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: 16, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 18, color: C.soft, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M2_SprintArchi: Page = () => (
  <Frame mod={2} label="Fil rouge · Sprint 2 — Architecture 100 % navigateur">
    <Title>Sprint 2 : une architecture 100 % navigateur</Title>
    <Lede>GitHub Pages ne sert que des fichiers statiques : toute l’application tourne sur le téléphone de l’utilisateur.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 265, width: 1000, height: 640, background: C.card, borderRadius: 20, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 24, top: 18, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>SCHÉMA C4 · NIVEAU 2 (SIMPLIFIÉ)</div>
      <div style={{ position: 'absolute', left: 30, top: 60, width: 640, height: 555, borderRadius: 18, boxShadow: `inset 0 0 0 2.5px ${C.navy}`, background: 'rgba(11,31,92,0.03)' }}>
        <div style={{ position: 'absolute', left: 18, top: 12, fontSize: 19, fontWeight: 700, color: C.navy }}>Navigateur · PWA FrigoMalin</div>
      </div>
      <M2Box x={60} y={110} w={580} h={92} tone="blue" title="Interface (SPA)" sub="React + TypeScript · src/ui" cls={A.fade} />
      <M2Box x={60} y={222} w={580} h={92} tone="violet" title="Domaine" sub="TypeScript pur, testable · src/domain" cls={A.fade} />
      <M2Box x={60} y={334} w={280} h={110} tone="green" title="IndexedDB" sub="Dexie · données du foyer" cls={A.fade} />
      <M2Box x={360} y={334} w={280} h={110} tone="teal" title="Service worker" sub="cache · hors ligne" cls={A.fade} />
      <M2Box x={60} y={464} w={580} h={120} tone="grey" title="Publié sur GitHub Pages" sub="fichiers statiques · chemin /frigomalin/ · aucun secret" cls={A.fade} />
      <M2Box x={720} y={222} w={250} h={130} tone="yellow" title="Open Food Facts" sub="API publique, sans clé · repli manuel" cls={A.right} />
      <svg width={1000} height={640} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <path d="M 640 287 L 712 287" stroke={C.amber} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 265, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="bot" title="Premier agent personnalisé" cls={A.in} style={dl(200)} size={22}>
        Un <strong>architecte en lecture seule</strong> : il propose schémas et ADR, mais ne peut pas toucher au code.
      </Card>
      <Card tone="blue" icon="doc" title="Décisions tracées (ADR)" cls={A.in} style={dl(320)} size={22}>
        Stockage, framework, routage : chaque choix documenté, avec ses conséquences négatives.
      </Card>
      <Card tone="green" icon="layers" title="Les types comme contexte" cls={A.in} style={dl(440)} size={22}>
        Des types stricts guident ensuite tous les agents : c’est le contexte le moins cher et le plus précis.
      </Card>
    </div>
  </Frame>
);

// ─── Labs 2.1, 2.2, 2.3 ─────────────────────────────────────────────────────
const M2_Lab21: Page = () => (
  <LabPage
    mod={2}
    n="2.1"
    title="Un agent architecte en lecture seule"
    defi="squelette"
    who="Architectes · Tech Leads"
    label="Fil rouge · Sprint 2 — Architecture 100 % navigateur"
    where={
      <>
        <PathChip>.github/agents/architect.agent.md</PathChip>
      </>
    }
    objective="Créer l’agent architect, puis lui faire produire le schéma C4 (niveaux 1 et 2) de FrigoMalin en Mermaid."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent personnalisé</Tag>
        <Tag tone="blue" size={18}>*.agent.md</Tag>
        <Tag tone="blue" size={18}>Mermaid</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l21a" size={22}>L’agent apparaît dans la liste des agents</CheckItem>
        <CheckItem id="l21b" size={22}>Il refuse de modifier un fichier</CheckItem>
        <CheckItem id="l21c" size={22}>Le Mermaid s’affiche dans l’aperçu</CheckItem>
      </>
    }
  >
    Complétez l’en-tête et le corps, sélectionnez l’agent, puis demandez-lui le schéma en une phrase.
    <CodeDark size={21} wrap style={{ marginTop: 12 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>name</Ck>: architect{'\n'}
      <Ck>description</Ck>: <Hole>quand utiliser cet agent ?</Hole>
      {'\n'}
      <Ck>tools</Ck>: <Hole>lecture et recherche uniquement</Hole>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}Tu es <Hole>rôle</Hole>.{'\n'}Contraintes d’architecture : <Hole>au moins 4</Hole>
      {'\n'}Tu ne modifies jamais <Hole>…</Hole>
      {'\n'}Tes livrables : <Hole>format(s)</Hole>
    </CodeDark>
  </LabPage>
);

const M2_Lab22: Page = () => (
  <LabPage
    mod={2}
    n="2.2"
    title="Trois décisions d’architecture (ADR)"
    defi="construire"
    who="Architectes · Tech Leads"
    label="Fil rouge · Sprint 2 — Architecture 100 % navigateur"
    where={
      <>
        <PathChip>docs/adr/0001-stockage.md</PathChip> <PathChip>0002-framework.md</PathChip> <PathChip>0003-routage.md</PathChip>
      </>
    }
    objective="Documenter 3 ADR : IndexedDB ou localStorage, choix du framework, routage par hash ou repli 404.html."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent architect</Tag>
        <Tag tone="blue" size={18}>Contexte explicite (#)</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l22a" size={22}>3 fichiers docs/adr/000X-*.md</CheckItem>
        <CheckItem id="l22b" size={22}>Au moins 2 options comparées par ADR</CheckItem>
        <CheckItem id="l22c" size={22}>Conséquences négatives explicites</CheckItem>
      </>
    }
  >
    Construisez le prompt à partir des ingrédients. Un prompt pour les 3 ADR, ou un prompt réutilisable pour un ADR à la fois : à vous de choisir et de
    justifier.
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 22, color: C.ink }}>
      <Bullet tone="green" size={22}>l’agent architect (lab 2.1)</Bullet>
      <Bullet tone="green" size={22}>#PRODUCT.md et #docs/mvp.md</Bullet>
      <Bullet tone="green" size={22}>le format MADR : contexte · options · décision · conséquences</Bullet>
      <Bullet tone="green" size={22}>un critère de comparaison chiffré par option</Bullet>
      <Bullet tone="green" size={22}>le dossier docs/adr/ (numérotation 0001-…)</Bullet>
    </div>
  </LabPage>
);

const M2_Lab23: Page = () => (
  <LabPage
    mod={2}
    n="2.3"
    title="Modèle de données & types TypeScript"
    defi="inverse"
    who="Développeurs"
    label="Fil rouge · Sprint 2 — Architecture 100 % navigateur"
    where={
      <>
        <PathChip>src/domain/types.ts</PathChip> <PathChip>src/data/db.ts</PathChip> <PathChip>src/data/seed.ts</PathChip>
      </>
    }
    objective="Produire les types du domaine, le schéma de base Dexie et un générateur de 40 produits de test réalistes."
    feats={
      <>
        <Tag tone="blue" size={18}>Mode Agent</Tag>
        <Tag tone="blue" size={18}>Types comme contexte</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l23a" size={22}>npm run build compile sans erreur</CheckItem>
        <CheckItem id="l23b" size={22}>Produits périmés, du jour et à venir</CheckItem>
        <CheckItem id="l23c" size={22}>Aucun type any</CheckItem>
      </>
    }
  >
    Voici l’extrait attendu : écrivez le prompt qui le produit.
    <CodeDark file="src/domain/types.ts (extrait attendu)" size={19} style={{ marginTop: 10 }}>
      <Ck>export type</Ck> DateKind = <Cs>'DLC'</Cs> | <Cs>'DDM'</Cs>;{'\n'}
      <Ck>export interface</Ck> <Cf>StockItem</Cf> {'{'}
      {'\n  '}id: <Ck>string</Ck>; name: <Ck>string</Ck>; barcode?: <Ck>string</Ck>;{'\n  '}quantity: <Ck>number</Ck>; unit: <Cs>'pièce'</Cs> | <Cs>'g'</Cs> |{' '}
      <Cs>'kg'</Cs> | <Cs>'ml'</Cs> | <Cs>'L'</Cs>;{'\n  '}expiresOn: <Ck>string</Ck>; <Cc>{'// ISO 8601'}</Cc>
      {'\n  '}dateKind: DateKind; location: <Cs>'frigo'</Cs> | <Cs>'congélateur'</Cs> | <Cs>'placard'</Cs>;{'\n  '}status: <Cs>'en-stock'</Cs> |{' '}
      <Cs>'consommé'</Cs> | <Cs>'jeté'</Cs>;{'\n}'}
      {'\n'}
      <Cc>{'// + db.ts (Dexie) · seed.ts (40 produits de test)'}</Cc>
    </CodeDark>
  </LabPage>
);

// ─── Sprint 3 · Workspace & context engineering ─────────────────────────────
const M2Q = ({ icon, tone, q, a, ex, d }: { icon: IconName; tone: Tone; q: string; a: string; ex: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `8px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink, lineHeight: 1.2 }}>{q}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: STRONG[tone] }}>{a}</div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>{ex}</div>
  </div>
);

const M2_SprintCtx: Page = () => (
  <Frame mod={2} label="Fil rouge · Sprint 3 — Workspace & context engineering">
    <Title>Sprint 3 : préparer ce que Copilot verra</Title>
    <Lede>Avant la première ligne de code métier : trois questions, trois réponses, trois fichiers.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 26 }}>
      <M2Q icon="book" tone="blue" q="Que doit-il savoir ?" a="Les instructions" d={100} ex={<>Stack, commandes, structure, principes, interdits : <PathChip size={20}>copilot-instructions.md</PathChip> (lab 3.3), puis règles ciblées (lab 3.4).</>} />
      <M2Q icon="filter" tone="yellow" q="Que n’a-t-il pas besoin de voir ?" a="Les exclusions" d={220} ex={<><PathChip size={20}>dist/</PathChip> <PathChip size={20}>node_modules/</PathChip> <PathChip size={20}>coverage/</PathChip> : hors index et hors recherche (lab 3.1).</>} />
      <M2Q icon="lock" tone="coral" q="Que ne doit-il jamais voir ?" a="Les données sensibles" d={340} ex={<>Secrets, exports réels, fichiers lourds : <PathChip size={20}>.copilotignore</PathChip> et défense en profondeur (lab 3.2, module 3).</>} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Le socle de l’optimisation" tone="violet" icon="gauge">
        Chaque ligne d’instruction est payée à chaque requête, chaque fichier inutile dilue l’attention. Un bon contexte, c’est des réponses meilleures{' '}
        <strong>et</strong> une facture plus basse.
      </Callout>
    </div>
  </Frame>
);

// ─── Labs 3.1, 3.3, 3.4 ─────────────────────────────────────────────────────
const M2_Lab31: Page = () => (
  <LabPage
    mod={2}
    n="3.1"
    title="Créer le projet, exclure ce qui pollue"
    defi="trous"
    who="Développeurs"
    label="Fil rouge · Sprint 3 — Workspace & context engineering"
    where={
      <>
        <PathChip>.gitignore</PathChip> <PathChip>vite.config.ts</PathChip> <PathChip>.vscode/settings.json</PathChip>
      </>
    }
    objective="Créer le projet Vite + TypeScript en mode Agent, puis exclure les dossiers générés de l’index et des recherches de Copilot."
    feats={
      <>
        <Tag tone="blue" size={18}>Mode Agent</Tag>
        <Tag tone="blue" size={18}>files.exclude · search.exclude</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l31a" size={22}>npm run dev affiche la page</CheckItem>
        <CheckItem id="l31b" size={22}>Scripts lint, test et build présents</CheckItem>
        <CheckItem id="l31c" size={22}>Aucune recherche ne renvoie dist/</CheckItem>
      </>
    }
  >
    Complétez le prompt. Vérifiez ensuite que l’agent n’est pas resté bloqué sur une commande interactive.
    <CodeDark size={21} wrap style={{ marginTop: 12 }}>
      Crée le projet FrigoMalin dans le dossier courant avec <Hole>outil</Hole> et le modèle <Hole>framework + TS</Hole>.{'\n'}Ajoute <Hole>outils qualité</Hole> et les
      scripts npm : <Hole>liste</Hole>.{'\n'}Configure Vite pour GitHub Pages : <Hole>réglage</Hole>.{'\n'}Mets à jour .gitignore et .vscode/settings.json pour exclure{' '}
      <Hole>dossiers</Hole> de <Hole>…</Hole>.{'\n'}Utilise uniquement des commandes <Hole>…</Hole>.
    </CodeDark>
  </LabPage>
);

const M2_Lab33: Page = () => (
  <LabPage
    mod={2}
    n="3.3"
    title="copilot-instructions.md : l’essentiel"
    defi="ameliorer"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 3 — Workspace & context engineering"
    where={
      <>
        <PathChip>.github/copilot-instructions.md</PathChip> (dans .github/, pas à la racine).
      </>
    }
    objective="Écrire un copilot-instructions.md de moins de 60 lignes, chargé à chaque requête : chaque ligne doit changer le comportement du modèle."
    feats={
      <>
        <Tag tone="blue" size={18}>Instructions globales</Tag>
        <Tag tone="blue" size={18}>AGENTS.md (variante)</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l33a" size={22}>Moins de 60 lignes</CheckItem>
        <CheckItem id="l33b" size={22}>Commandes et structure présentes</CheckItem>
        <CheckItem id="l33c" size={22}>Au moins 3 interdits propres au projet</CheckItem>
        <CheckItem id="l33d" size={22}>Principes non négociables vérifiables</CheckItem>
      </>
    }
  >
    Ce premier jet, typique d’un fichier généré automatiquement, est trop long et flou. Réécrivez-le, ou écrivez le prompt qui le fait réécrire.
    <CodeDark file="copilot-instructions.md (premier jet)" size={19} wrap style={{ marginTop: 10 }}>
      # Instructions{'\n'}Tu es un assistant très compétent et bienveillant. Écris toujours du code propre, lisible, maintenable, performant et sécurisé. Respecte les
      bonnes pratiques. Utilise TypeScript. Commente bien le code. Fais attention aux erreurs. Pense à l’accessibilité.{'\n'}Le projet est une application qui
      s’appelle FrigoMalin et qui aide les gens à ne pas gaspiller…{'\n'}
      <Cc>[… 150 lignes de ce style …]</Cc>
    </CodeDark>
  </LabPage>
);

const M2_Lab34: Page = () => (
  <LabPage
    mod={2}
    n="3.4"
    title="Instructions ciblées (applyTo)"
    defi="squelette"
    who="Développeurs"
    label="Fil rouge · Sprint 3 — Workspace & context engineering"
    where={
      <>
        <PathChip>.github/instructions/</PathChip> tests · ui · domain<PathChip>.instructions.md</PathChip>
      </>
    }
    objective="Découper les règles par type de fichier (tests, UI, domaine) pour qu’elles ne soient chargées qu’au besoin."
    feats={
      <>
        <Tag tone="blue" size={18}>*.instructions.md</Tag>
        <Tag tone="blue" size={18}>applyTo</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l34a" size={22}>3 fichiers avec un applyTo précis</CheckItem>
        <CheckItem id="l34b" size={22}>Aucune règle dupliquée avec le fichier global</CheckItem>
      </>
    }
  >
    Complétez les trois fichiers : en-tête + 3 à 5 règles chacun.
    <CodeDark file=".github/instructions/tests.instructions.md" size={21} wrap style={{ marginTop: 12 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>applyTo</Ck>: <Cs>"</Cs>
      <Hole>motif des fichiers de test</Hole>
      <Cs>"</Cs>
      {'\n'}
      <Ck>description</Ck>: <Hole>…</Hole>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}
      <Hole>3 à 5 règles</Hole>
      {'\n\n'}
      <Cc>{'// puis ui.instructions.md (applyTo ?) et domain.instructions.md : à vous'}</Cc>
    </CodeDark>
  </LabPage>
);

// ─── QCM M2 ─────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Où écrire la règle ?"
    q="Vous voulez que vos règles d’écriture des tests ne soient chargées que lorsque l’agent touche un fichier *.test.ts. Où les écrivez-vous ?"
    explain="Chaque couche de contexte a son déclencheur : toujours (instructions globales), par fichier (applyTo), par tâche (skills). Placer une règle au bon niveau, c’est payer moins et mieux guider."
  >
    <Opt why="Piège ! Ce fichier est chargé à CHAQUE requête : vous payez les règles de test même pour du CSS.">Dans .github/copilot-instructions.md</Opt>
    <Opt why="Non : un skill se déclenche selon la tâche (sa description), pas selon le fichier ouvert. Utile pour un savoir-faire, pas pour une règle.">Dans un skill « tests »</Opt>
    <Opt ok why="Oui : applyTo: &quot;**/*.test.ts&quot; charge ces règles seulement quand un fichier de test est en jeu.">
      Dans .github/instructions/tests.instructions.md avec un applyTo
    </Opt>
    <Opt why="Non : vous les oublierez une fois sur deux, et elles ne sont ni versionnées ni partagées.">Dans chaque prompt, au cas par cas</Opt>
  </QcmPage>
);

// @@PAGES-BEGIN
export const __pages = [
  M2_Divider,
  M2_Cycle,
  M2_Modes,
  M2_Ingredients,
  M2_PromptLab,
  M2_Techniques,
  M2_Layers,
  M2_Files,
  M2_MCP,
  M2_Automate,
  M2_Collab,
  M2_KPI,
  M2_Qcm,
  M2_SprintArchi,
  M2_Lab21,
  M2_Lab22,
  M2_Lab23,
  M2_SprintCtx,
  M2_Lab31,
  M2_Lab33,
  M2_Lab34,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M2 · 11:30

OBJECTIF — Annoncer le module 2 du programme : l’IA à chaque étape du cycle, l’automatisation (snippets, tests, commentaires), les stratégies de prompting, la collaboration humain–IA et les indicateurs.

DIRE — « Module 2 : intégrer l’IA dans le workflow. C’est le cœur de la journée. On va voir comment l’IA s’insère à chaque étape du cycle, comment choisir le bon mode d’assistance, comment écrire des prompts qui donnent des résultats prévisibles, et surtout comment préparer le contexte — ce que l’assistant sait déjà avant même que vous tapiez. On terminera par la collaboration humain–IA et les indicateurs pour mesurer l’efficacité. Ensuite, deux sprints FrigoMalin : l’architecture, puis le contexte Copilot. C’est l’atelier du programme : un workflow multi-outils, de la génération à l’analyse. »

ANIMATION — Pointer les six labs.

TRANSITION — « Premier point : où l’IA intervient-elle dans le cycle ? »`,
  `⏱ 3 min · CYCLE AUGMENTÉ

OBJECTIF — Montrer l’IA à chaque étape, avec le rôle humain correspondant.

DIRE — « Six étapes. En conception, l’IA challenge l’idée et propose des options ; vous tranchez et documentez. En codage, elle complète et implémente par lots ; vous validez le plan et relisez les diffs. En tests, elle écrit les tests d’abord, les cas limites, les E2E ; vous vérifiez qu’ils testent la bonne chose. En documentation, elle produit README, JSDoc, notes de version ; vous corrigez ce qui est faux. En revue, elle fait une première passe ; la décision et la responsabilité restent humaines. En livraison, elle écrit la CI et explique un échec ; vous gardez les portes de qualité. Chaque carte renvoie aux labs FrigoMalin correspondants : vous allez tout pratiquer. Et c’est une boucle courte : petites itérations, chaque sortie vérifiée. »

ANIMATION — Les cartes apparaissent en séquence ; la flèche pointillée symbolise la boucle.

TRANSITION — « Pour chaque étape, il faut le bon niveau d’assistance. Dans Copilot, ce sont les modes. »`,
  `⏱ 3 min · MODES (2 temps)

OBJECTIF — Distinguer Ask, Plan et Agent, et donner les raccourcis utiles.

DIRE — « Copilot propose trois agents intégrés. Ask répond, explique, compare : il ne modifie rien. C’est votre sparring partner du lab 1.1. » → clic. « Plan analyse le dépôt et produit un plan, sans écrire de code. Règle d’équipe : toute tâche de plus d’un fichier commence par un plan que vous validez. » → clic. « Agent exécute : il lit, modifie plusieurs fichiers, lance des commandes et les tests, et itère jusqu’au critère de fin. C’est puissant, donc on relit les diffs et on limite les droits. En bas, les raccourcis : Tab pour la complétion, Ctrl+I pour le chat inline, Ctrl+Alt+I pour la vue Chat, le dièse pour joindre un fichier, et /compact, /fork pour gérer la session — on les reverra au module 6. »

ANIMATION — Démonstration rapide possible : basculer entre les trois agents dans la liste déroulante de la vue Chat.

TRANSITION — « Quel que soit le mode, la qualité dépend du prompt. Cinq ingrédients. »`,
  `⏱ 3 min · INGRÉDIENTS (4 temps)

OBJECTIF — Installer la grille des cinq ingrédients utilisée dans tous les labs.

DIRE — « Un : un rôle. “Agis comme…”, ou mieux, le bon agent sélectionné, qui porte déjà son rôle. » → clic. « Deux : un contexte ciblé. Deux ou trois fichiers nommés avec le dièse. Pas tout le projet : on a vu que le contexte se paie et se dilue. » → clic. « Trois : une seule tâche, bornée. “Uniquement…”, “n’écris pas…” : c’est ce qui empêche l’agent de déborder. » → clic. « Quatre : contraintes et format. Où écrire, quel format, quelle longueur. » → clic. « Cinq, le plus oublié : le critère de fin. La commande qui prouve que c’est terminé. Sans lui, c’est l’agent qui décide quand il a fini. Ces cinq ingrédients sont votre checklist de relecture de prompt pour les deux jours. »

ANIMATION — Révéler un ingrédient par clic ; demander après chacun « qu’est-ce qui se passe s’il manque ? ».

TRANSITION — « Voyons l’effet concret, ingrédient par ingrédient. »`,
  `⏱ 3 min · DÉMO INTERACTIVE

OBJECTIF — Montrer la transformation d’un prompt vague en prompt vérifiable.

DIRE — « Prompt de départ : “Ajoute un filtre à l’inventaire.” Quel filtre ? Où ? Testé comment ? Le modèle devine tout. » Activer le rôle. « On sait qui parle. » Activer le contexte. « On sait où regarder. » Activer la tâche bornée : le prompt vague est remplacé. « On sait exactement quoi faire, et quoi ne pas faire. » Activer les contraintes. « On sait où va la logique et comment elle est testée. » Activer le critère de fin. « Et on sait quand c’est fini : npm test au vert. Ce prompt fait cinq lignes. Il vous fait gagner trois allers-retours. C’est d’ailleurs, mot pour mot, le prompt du lab 7.1 qu’on utilisera pour regarder ce qui part réellement au modèle. »

ANIMATION — Activer les interrupteurs un à un ; la jauge et le verdict évoluent. Demander à un participant de proposer l’ordre.

TRANSITION — « Au-delà des ingrédients, quelques techniques font une grande différence. »`,
  `⏱ 4 min · TECHNIQUES (cartes)

OBJECTIF — Donner six techniques de prompting concrètes, avec un exemple chacune.

DIRE — « Six techniques. Les questions d’abord, quand le besoin est flou. Le plan avant le code, pour toute tâche multi-fichiers. Les exemples, ou few-shot, pour imposer un format ou un style. Les tests d’abord, pour fixer le comportement métier avant l’implémentation. Le rétro-prompt : vous avez le résultat voulu, faites retrouver la consigne — c’est le lab 2.3. Et toujours un critère de fin vérifiable. » Retourner deux ou trois cartes à la demande du groupe.

ANIMATION — Demander : « Laquelle utilisez-vous déjà ? Laquelle allez-vous essayer en premier ? » Les anti-patterns à citer à l’oral : « fais-le bien », « corrige tout », « voici tout le projet ».

TRANSITION — « Le prompt, c’est la demande du moment. Le vrai levier, c’est ce que l’assistant sait déjà : le contexte. »`,
  `⏱ 3 min · COUCHES DE CONTEXTE (3 temps)

OBJECTIF — Structurer le context engineering en quatre couches selon leur déclencheur.

DIRE — « Quatre couches. Toujours chargé : copilot-instructions.md, ou AGENTS.md, le format portable. Il part à chaque requête, donc il doit être court et dense. » → clic. « Selon le fichier : les fichiers d’instructions avec applyTo. Les règles de test ne partent que si on touche un test. » → clic. « À la demande : les skills, les fichiers joints, les outils MCP. Ils sont chargés quand la tâche les réclame ; pour un skill, c’est sa description qui décide. » → clic. « Et jamais : ce qui ne doit pas entrer dans le contexte. Secrets, données réelles, fichiers lourds. C’est le sujet du module 3. Retenez la forme : plus c’est souvent chargé, plus ce doit être petit. »

ANIMATION — La pyramide inversée se construit couche par couche.

TRANSITION — « Concrètement, quels fichiers ? Voici la carte complète. »`,
  `⏱ 3 min · FICHIERS DE PERSONNALISATION

OBJECTIF — Donner la carte de référence des fichiers Copilot, leur déclencheur et le lab associé.

DIRE — « Voici votre aide-mémoire. Les instructions globales, à chaque requête. Les instructions ciblées, si un fichier correspond. Les skills, si la tâche correspond. Les agents, quand on les choisit ou qu’un autre agent les appelle. Les hooks, à chaque événement, de façon déterministe. Le fichier .mcp.json, qui branche les serveurs. Et AGENTS.md, le standard ouvert lu par plusieurs outils : utile si votre équipe mélange Copilot, Claude Code ou Codex. La colonne à retenir, c’est “chargé quand” : c’est elle qui fait votre facture. Tout est dans le dépôt, versionné. Dernier point : Copilot évolue tous les mois, ces noms sont vérifiés pour octobre 2026, contrôlez la documentation avant chaque projet. »

ANIMATION — Proposer une photo de la page : c’est un mémo utile.

TRANSITION — « Une ligne mérite un zoom : .mcp.json, et le protocole MCP. »`,
  `⏱ 3 min · MCP (2 temps)

OBJECTIF — Comprendre MCP, son statut de standard, et ses risques.

DIRE — « MCP, Model Context Protocol, c’est le port USB-C des agents : un standard pour brancher un agent sur des outils et des données. L’agent est un client MCP ; il découvre les outils de chaque serveur et décide quand les appeler. » → clic 1. « Dans FrigoMalin : le serveur GitHub pour créer les issues, Playwright pour piloter un vrai navigateur, Stitch pour les maquettes. » → clic 2. « C’est devenu un standard neutre : créé par Anthropic fin 2024, confié en décembre 2025 à l’Agentic AI Foundation, sous l’égide de la Linux Foundation, avec AGENTS.md et goose. Trois vigilances : un serveur MCP est du code tiers qui agit avec vos droits ; chaque outil exposé ajoute sa définition au contexte, donc des tokens ; et les données renvoyées peuvent contenir des instructions malveillantes — c’est l’injection de prompt indirecte, module 5. Sur les licences Business, les serveurs MCP doivent être autorisés par l’administrateur. »

ANIMATION — Les serveurs apparaissent, puis les deux cartes.

TRANSITION — « Maintenant, une question d’équipe : que confier à l’IA ? »`,
  `⏱ 5 min · EXERCICE DE TRI (glisser-déposer)

OBJECTIF — Décider collectivement du niveau de délégation par type de tâche (automatisation : snippets, tests, commentaires, programme M2).

DIRE — « Douze tâches, trois colonnes. Ce que l’IA fait et que je relis. Ce que l’IA propose et que je décide. Ce que je garde, ou que je confie à un outil déterministe. Faites glisser, on débat. »

RÉPONSES TYPES — L’IA fait : snippets, tests d’une fonction pure, JSDoc, message de commit, jeu de données de test. L’IA propose : migration majeure (par lots, tests de caractérisation), choix d’architecture (options + ADR), expliquer un log. Je garde : décision de mise en production, revue de sécurité finale, rotation d’une clé. PIÈGE : « renommer un symbole partout » n’est pas une tâche d’IA, c’est la commande Renommer (F2) de l’éditeur : exacte, instantanée, gratuite.

ANIMATION — Inviter deux participants à déplacer les pastilles. Double-clic pour remettre une pastille.

TRANSITION — « Ce tri dessine les rôles. Formalisons qui fait quoi. »`,
  `⏱ 3 min · COLLABORATION (4 temps)

OBJECTIF — Définir les rôles et les quatre points de contrôle humains (programme : collaboration humain–IA).

DIRE — « Le développeur est architecte, validateur, décideur final et expert métier. L’IA est assistant, accélérateur, générateur d’options, amplificateur. Ce partage se traduit en quatre points de contrôle, à chaque tâche. » → clic. « Un : le plan validé, avant toute modification. » → clic. « Deux : le diff relu, comme une PR externe. » → clic. « Trois : les tests au vert, et des tests qui testent vraiment. » → clic. « Quatre : le merge par un humain. Celui qui merge assume. Pas de mise en production sans revue, c’est une règle de prudence du module 3 et une exigence de sécurité du module 5. »

ANIMATION — Les quatre portes s’allument une à une.

TRANSITION — « Et pour savoir si tout ça marche, il faut mesurer. »`,
  `⏱ 4 min · EXERCICE · INDICATEURS

OBJECTIF — Distinguer indicateurs utiles et indicateurs de vanité (programme : indicateurs d’efficacité).

DIRE — « Neuf indicateurs. Pour chacun : utile, à interpréter, ou trompeur ? Votez, puis je révèle. »

RÉPONSES — Délai issue → production : utile (DORA). Lignes générées : trompeur. Taux d’acceptation : à interpréter (adoption, pas valeur). Défauts échappés : utile. Temps de revue par PR : utile, l’IA peut gonfler les PR. Nombre de prompts : trompeur. Couverture : à interpréter (qualité des assertions). Crédits IA par feature livrée : utile, le coût rapporté à la valeur, essentiel depuis la facturation à l’usage. Taux de retouche : utile.

ANIMATION — Cliquer chaque carte après le vote. Rappeler le paradoxe METR : on mesure des tâches terminées et validées, pas des impressions. Mentionner DORA et SPACE pour aller plus loin.

TRANSITION — « Petit QCM avant de repasser au clavier. »`,
  `⏱ 2 min · QCM 2

OBJECTIF — Vérifier la compréhension des couches de contexte.

DIRE — « Règles de test chargées seulement quand on touche un test : où les écrivez-vous ? »

RÉPONSES — A ✗ piège : chargé à chaque requête. B ✗ un skill se déclenche selon la tâche, pas le fichier. C ✓ tests.instructions.md avec applyTo « **/*.test.ts ». D ✗ oubli garanti, rien de versionné.

ANIMATION — Cliquer les options, → bonne réponse, → l’essentiel. Rebondir : « Et le lint, on le met où ? » Réponse : ni dans une instruction ni dans un skill, dans un hook (module 6) : c’est déterministe.

TRANSITION — « Retour à FrigoMalin : sprint 2, l’architecture. » (Si 12:15 est dépassé, lancer le lab 2.1 et faire les labs 2.2 et 2.3 après le déjeuner.)`,
  `⏱ 3 min · SPRINT 2 · ARCHITECTURE

OBJECTIF — Poser les contraintes d’architecture qui guideront les agents.

DIRE — « GitHub Pages ne sert que des fichiers statiques. Donc tout tourne dans le navigateur : l’interface, la logique métier en TypeScript pur, les données dans IndexedDB, un service worker pour le hors ligne. Seule dépendance externe : l’API Open Food Facts, publique, sans clé, avec un repli en saisie manuelle si elle ne répond pas. Aucun secret possible : tout ce qui est publié est lisible. Dans ce sprint, trois labs. Un : votre premier agent personnalisé, un architecte en lecture seule. Deux : trois décisions d’architecture documentées en ADR, avec leurs conséquences négatives. Trois : les types TypeScript, qui deviennent le contexte le moins cher et le plus précis pour tous les agents suivants. »

ANIMATION — Laisser le schéma C4 s’afficher ; pointer le flux en pointillé vers Open Food Facts.

TRANSITION — « Lab 2.1 : un agent qui ne peut pas coder. »`,
  `⏱ 20 min (minuteur) · LAB 2.1 · 12:10

OBJECTIF — Créer un agent personnalisé, comprendre que restreindre les outils garantit le rôle.

DIRE — « Un agent qui ne peut pas éditer ne peut pas se lancer dans le code : il reste dans son rôle. Complétez l’en-tête : la description, c’est le “quand m’utiliser” que Copilot lit pour proposer l’agent et, plus tard, pour l’appeler en sous-agent. Les outils : lecture, recherche, et web pour la documentation. Le bouton Configure Tools donne les noms exacts. »

CORRIGÉ (formateur) — description : « Architecte de FrigoMalin. À utiliser pour les choix techniques, les ADR et les schémas, jamais pour écrire du code applicatif. » tools: ['read', 'search', 'web']. Contraintes : statique sur GitHub Pages, aucun secret ; IndexedDB + export JSON ; hors ligne (PWA) ; chemin /frigomalin/ ; seule API Open Food Facts avec repli manuel. « Tu ne modifies jamais de fichier. » Livrables : Mermaid C4 niveaux 1 et 2, ADR MADR, risques. Test : lui demander de modifier un fichier, il doit refuser.

TRANSITION — « Déjeuner. À 14 h : les ADR. »`,
  `⏱ 15 min (minuteur) · LAB 2.2 · 14:00

OBJECTIF — Construire un prompt réutilisable et produire des ADR qui assument leurs conséquences.

DIRE — « Reprise. Votre agent architecte va rédiger trois ADR. Vous construisez le prompt à partir des ingrédients. Choix stratégique : un prompt pour les trois, ou un prompt pour un ADR à la fois ? Justifiez. »

CORRIGÉ (formateur) — Recommandé : un ADR par requête (réponses courtes, relisibles, contexte léger). Exemple 0001 : « Options : localStorage, IndexedDB via Dexie, IndexedDB via idb. Pour chaque option : limite de stockage, requêtes (index, tri par date), poids ajouté au bundle, facilité de test. Termine par la décision, ses conséquences positives et négatives, et ce qui nous ferait revenir sur ce choix. Ne rédige que cet ADR. » Décisions attendues : Dexie ; React + TS ; routage par hash OU repli 404.html (GitHub Pages ne réécrit pas les URL). Conséquence négative de 0001 : données sur un seul appareil (d’où le partage en V2). Un prompt réutilisable est un futur skill.

TRANSITION — « Les décisions sont prises, traduisons-les en types. »`,
  `⏱ 15 min (minuteur) · LAB 2.3

OBJECTIF — Pratiquer le rétro-prompt et produire des types stricts qui guideront tous les agents.

DIRE — « Cette fois, vous avez le résultat. Retrouvez le prompt qui le produit du premier coup : les types, la base Dexie et un générateur de 40 produits de test. »

CORRIGÉ (formateur) — Rôle TS senior ; contexte #PRODUCT.md (glossaire) et #docs/adr/0001-stockage.md ; 1) types.ts : StockItem, Recipe, ImpactEntry, unions littérales, aucun any ; 2) db.ts : base « frigomalin » v1, index expiresOn, status, barcode ; 3) seed.ts : fonction qui génère 40 produits avec des dates RELATIVES à aujourd’hui (3 DLC dépassées, 3 qui expirent aujourd’hui, 2 DDM dépassées, le reste sur 30 jours) ; « ne crée aucun composant d’interface ». Point clé : dates relatives, sinon la démo casse dans une semaine. DLC dépassée = à jeter, DDM dépassée = encore consommable.

TRANSITION — « Le domaine existe. Sprint 3 : préparer ce que Copilot verra à chaque requête. »`,
  `⏱ 2 min · SPRINT 3 · CONTEXTE

OBJECTIF — Introduire les trois labs de context engineering par trois questions.

DIRE — « Avant d’écrire du code métier, on prépare le contexte. Trois questions. Que doit-il savoir ? Ce sont les instructions : le fichier global et les règles ciblées. Que n’a-t-il pas besoin de voir ? Les dossiers générés, dist, node_modules, coverage : hors index, hors recherche. Que ne doit-il jamais voir ? Les secrets, les données réelles : on le traite au module 3 avec le lab 3.2. Chaque ligne d’instruction est payée à chaque requête et chaque fichier inutile dilue l’attention. Un bon contexte, c’est de meilleures réponses et une facture plus basse. »

ANIMATION — Relier les trois cartes aux couches de contexte vues tout à l’heure.

TRANSITION — « Lab 3.1 : créer le projet proprement. »`,
  `⏱ 15 min (minuteur) · LAB 3.1

OBJECTIF — Créer le projet en mode Agent sans blocage, configurer Vite pour Pages, exclure ce qui pollue.

DIRE — « Prompt à trous. Attention au piège numéro un : l’outil de création pose des questions au clavier, et l’agent reste bloqué. Exigez des commandes non interactives et demandez à voir chaque commande avant exécution. »

CORRIGÉ (formateur) — « Crée le projet avec Vite et le modèle react-ts. Ajoute ESLint, Prettier, Vitest et Testing Library, scripts dev, build, preview, lint, lint:fix, test, test:e2e. Configure Vite pour GitHub Pages : base: '/frigomalin/'. Mets à jour .gitignore (dist, coverage, playwright-report, test-results) et .vscode/settings.json (files.exclude et search.exclude, + node_modules). Commandes non interactives (--yes), montre chaque commande avant de l’exécuter. » Sans base, page blanche garantie sur Pages. files.exclude masque aussi dans l’explorateur ; search.exclude laisse visible mais hors recherche.

TRANSITION — « Le projet tourne. Écrivons ce que Copilot lira à chaque requête. »`,
  `⏱ 20 min (minuteur) · LAB 3.3

OBJECTIF — Écrire des instructions globales courtes, denses et vérifiables.

DIRE — « Ce premier jet est typique d’un fichier généré : 150 lignes de bonnes intentions. “Écris du code propre” ne change rien au comportement du modèle. Critère : chaque ligne doit changer le comportement, sinon on la supprime. Moins de 60 lignes. »

CORRIGÉ (formateur) — Sections : renvois (PRODUCT.md, docs/adr/, issues) ; stack ; commandes ; structure (domain pur, data, ui, e2e) ; 5 principes non négociables vérifiables (zéro backend/secret, hors ligne d’abord, tests d’abord, accessibilité AA mobile 360 px, budget JS < 200 Ko gzip et Lighthouse ≥ 90) ; règles projet (dates ISO via dates.ts, DLC dépassée = à jeter / DDM dépassée = consommable, seul appel réseau Open Food Facts avec repli) ; interdits (pas de backend ni secret, ne jamais lire .env* ni exports/, pas de dépendance sans le signaler). Variante : AGENTS.md, mais jamais deux fichiers contradictoires.

TRANSITION — « Les règles générales sont posées. Les règles spécifiques vont dans des fichiers ciblés. »`,
  `⏱ 15 min (minuteur) · LAB 3.4 · fin vers 15:30, puis pause

OBJECTIF — Découper les règles par type de fichier avec applyTo.

DIRE — « Trois fichiers : tests, interface, domaine. Un en-tête avec applyTo, trois à cinq règles. Vérifiez ensuite, dans les références d’une réponse, que seul le bon fichier a été chargé. »

CORRIGÉ (formateur) — tests : applyTo "**/*.test.ts,**/*.test.tsx" ; figer la date (vi.useFakeTimers + vi.setSystemTime) ; un describe par règle, noms en français ; pas de mock du domaine ; fake-indexeddb. ui : applyTo "src/ui/**" ; couleurs uniquement via tokens.css ; mobile d’abord ; accessibilité AA ; aucune logique métier. domain : applyTo "src/domain/**" ; fonctions pures sans React, Dexie ni API navigateur ; un test par règle ; recevoir « aujourd’hui » en paramètre, jamais new Date() dans une règle. Erreur fréquente : un applyTo sur « ** » qui recharge tout.

TRANSITION — « Pause de quinze minutes. Ensuite, module 3 : les limites et les précautions. »`,
];
// @@NOTES-END
