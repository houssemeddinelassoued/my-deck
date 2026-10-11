// ─── Module 7 · Synthèse & plan d'action + clôture ──────────────────────────

const M7_Divider: Page = () => (
  <Section
    n={7}
    title={
      <>
        Synthèse et
        <br />
        plan d’action
      </>
    }
    sub="On publie FrigoMalin, on rassemble les points clés et chacun repart avec son plan d’intégration de l’IA."
    dur="16:55 – 17:30"
    kind="synthese"
    labs={
      <>
        <Tag tone="green" size={19}>Lab 9.1</Tag>
        <Tag tone="pink" size={19}>Bonus 10.1 · 10.2 · 10.3</Tag>
      </>
    }
  >
    <SecItem n={1}>CI/CD : la mise en ligne sur GitHub Pages</SecItem>
    <SecItem n={2}>Les points clés des deux jours</SecItem>
    <SecItem n={3}>Votre plan personnel d’intégration</SecItem>
    <SecItem n={4}>Auto-positionnement final et évaluation</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// ─── Le pipeline ────────────────────────────────────────────────────────────
const M7Stage = ({ x, icon, tone, name, sub, d }: { x: number; icon: IconName; tone: Tone; name: string; sub: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: 380, width: 230, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 18px', textAlign: 'center', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} style={{ margin: '0 auto' }} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink }}>{name}</div>
    <div style={{ marginTop: 4, fontSize: 18, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M7_Pipeline: Page = () => (
  <Frame mod={7} beats={1} label="Fil rouge · Sprint 9 — CI/CD & GitHub Pages">
    <Title>Le pipeline : rien ne part en ligne sans passer les contrôles</Title>
    <Lede>Un workflow GitHub Actions vérifie tout, puis publie. Une version qui casse un test n’est jamais publiée.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 235 470 L 1690 470" stroke={C.rule} strokeWidth={6} strokeDasharray="10 14" className={A.march} />
      <FlowDot path="M 235 470 L 1690 470" dur={4} color={C.green} r={10} />
    </svg>
    <M7Stage x={120} icon="git" tone="navy" name="push sur main" sub="ou lancement manuel" d={100} />
    <M7Stage x={400} icon="filter" tone="blue" name="lint" sub="npm run lint" d={200} />
    <M7Stage x={680} icon="flask" tone="pink" name="tests" sub="npm test -- --run" d={300} />
    <M7Stage x={960} icon="layers" tone="violet" name="build" sub="dist/ · base /frigomalin/" d={400} />
    <M7Stage x={1240} icon="globe" tone="teal" name="E2E" sub="Playwright contre vite preview" d={500} />
    <M7Stage x={1520} icon="rocket" tone="green" name="deploy" sub="GitHub Pages" d={600} />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="coral" icon="key" title="Permissions minimales" style={{ flex: 1 }} size={22}>
        contents: read · pages: write · id-token: write (sans lui, le déploiement échoue). Aucun secret à stocker.
      </Card>
      <Card tone="blue" icon="clock" title="Versions vérifiées" style={{ flex: 1 }} size={22}>
        Demandez à l’agent de vérifier les versions actuelles des actions : un modèle propose souvent celles de son entraînement.
      </Card>
      <Card tone="green" icon="checkCircle" title="La preuve" style={{ flex: 1 }} size={22}>
        Cassez volontairement un test : la publication doit être bloquée. C’est le critère de réussite.
      </Card>
    </div>
  </Frame>
);

const M7_Lab91: Page = () => (
  <LabPage
    mod={7}
    n="9.1"
    title="Le workflow de déploiement"
    defi="inverse"
    who="Développeurs · DevOps"
    label="Fil rouge · Sprint 9 — CI/CD & GitHub Pages"
    where={
      <>
        <PathChip>.github/workflows/deploy-pages.yml</PathChip> · puis Settings → Pages → Source : GitHub Actions
      </>
    }
    objective="Faire générer, puis fiabiliser, le workflow qui teste et publie FrigoMalin sur GitHub Pages."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent developer</Tag>
        <Tag tone="blue" size={18}>GitHub Actions</Tag>
      </>
    }
    minutes={12}
    crit={
      <>
        <CheckItem id="l91a" size={21}>L’URL publique fonctionne</CheckItem>
        <CheckItem id="l91b" size={21}>Un test cassé bloque la publication</CheckItem>
        <CheckItem id="l91c" size={21}>Rafraîchir une page profonde marche</CheckItem>
      </>
    }
  >
    Voici le résultat attendu. Écrivez le prompt qui produit ce workflow du premier coup.
    <CodeDark size={19} wrap style={{ marginTop: 12 }}>
      <Cc>{'// Résultat attendu'}</Cc>
      {'\n'}• https://&lt;compte&gt;.github.io/frigomalin/ s’affiche, s’installe, marche hors ligne{'\n'}• Rafraîchir /frigomalin/recettes ne donne pas de 404{'\n'}• Un
      test en échec bloque la publication{'\n'}• Une seule publication à la fois{'\n'}
      <Cc>{'// Jobs : build (lint → tests → build → E2E) → deploy'}</Cc>
    </CodeDark>
  </LabPage>
);

// ─── Ce que vous avez construit ─────────────────────────────────────────────
const M7Done = ({ children, d }: { children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: C.ink, ...dl(d) }}>
    <Icon name="checkCircle" size={28} color={C.green} />
    <span>{children}</span>
  </div>
);

const M7_Built: Page = () => (
  <Frame mod={7} kind="synthese">
    <Title>
      FrigoMalin est en ligne : <span style={{ color: C.green }}>bravo !</span>
    </Title>
    <Lede>En deux jours, de l’idée à l’URL publique. Et surtout : un kit Copilot réutilisable dans vos propres dépôts.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={T.green.fg}>Le produit</Eyebrow>
      <M7Done d={100}>PRODUCT.md, MVP et 3 ADR</M7Done>
      <M7Done d={160}>Inventaire, dates DLC/DDM, scan Open Food Facts</M7Done>
      <M7Done d={220}>« Que cuisiner ? » développé en TDD</M7Done>
      <M7Done d={280}>PWA installable et hors ligne</M7Done>
      <M7Done d={340}>Tests unitaires et E2E, CI/CD, GitHub Pages</M7Done>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 262, width: 820, background: G.navy, borderRadius: 20, padding: '24px 30px', color: '#fff', ...dl(200) }}>
      <Eyebrow c="#AEB9E6">Votre kit Copilot, à copier lundi</Eyebrow>
      <div style={{ marginTop: 14, fontFamily: mono, fontSize: 22, lineHeight: 1.7, color: '#E6EAF6' }}>
        .github/copilot-instructions.md
        <br />
        .github/instructions/ × 3
        <br />
        .github/skills/ × 2
        <br />
        .github/agents/ × 6
        <br />
        .github/hooks/quality.json
        <br />
        .github/workflows/deploy-pages.yml
        <br />
        .copilotignore · .mcp.json
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Pour aller plus loin, en autonomie" tone="pink" icon="sparkles" size={23}>
        8 labs bonus : backlog via MCP (1.3), liste de courses (5.3), qa-explorer (6.4), Chat Debug View (7.1), revue Copilot (8.3), recette PO (10.1), release
        et rétrospective (10.2), backlog V2 prêt pour les agents (10.3).
      </Callout>
    </div>
  </Frame>
);

// ─── Dix points clés ────────────────────────────────────────────────────────
const M7Key = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, minHeight: 104, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px', borderLeft: `7px solid ${STRONG[tone]}` }}>
    <Num n={n} tone={tone} size={52} />
    <span style={{ fontSize: 27, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M7_Keys: Page = () => (
  <Frame mod={7} kind="synthese" beats={1}>
    <Title>Dix points clés à emporter</Title>
    <Lede>Ce qui doit rester dans six mois, quand les outils auront encore changé.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M7Key n={1} tone="blue">Un LLM prédit une suite probable : il ne vérifie rien</M7Key>
      <M7Key n={2} tone="blue">Choisir un outil : données et contrat d’abord</M7Key>
      <M7Key n={3} tone="violet">Cinq ingrédients par prompt, dont le critère de fin</M7Key>
      <M7Key n={4} tone="violet">Le contexte se construit : instructions, skills, exclusions</M7Key>
      <M7Key n={5} tone="violet">Plan validé, petits lots, un commit par lot</M7Key>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M7Key n={6} tone="coral">Tout contenu lu par un agent est une donnée, pas une consigne</M7Key>
      <M7Key n={7} tone="coral">Moindre privilège pour les agents, aucun secret à portée</M7Key>
      <M7Key n={8} tone="green">Tests d’abord, hooks déterministes, revue humaine</M7Key>
      <M7Key n={9} tone="green">Mesurez : délai, défauts, crédits par feature</M7Key>
      <M7Key n={10} tone="navy">Capitalisez : une correction répétée devient une règle</M7Key>
    </div>
  </Frame>
);

// ─── Aide-mémoire avant / pendant / après ───────────────────────────────────
const M7Memo = ({ title, tone, icon, d, children }: { title: string; tone: Tone; icon: IconName; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>{children}</div>
  </div>
);

const M7_Memo: Page = () => (
  <Frame mod={7} kind="synthese">
    <Title>L’aide-mémoire du développeur augmenté</Title>
    <Lede>À imprimer, à épingler, à partager avec votre équipe.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <M7Memo title="Avant" tone="blue" icon="map" d={100}>
        <Bullet tone="blue" size={27}>Le bon niveau : éditeur, complétion, inline ou agent ?</Bullet>
        <Bullet tone="blue" size={27}>Aucune donnée sensible dans le contexte</Bullet>
        <Bullet tone="blue" size={27}>Prompt : rôle, contexte ciblé, tâche bornée, format, fin</Bullet>
        <Bullet tone="blue" size={27}>Plan demandé et validé</Bullet>
      </M7Memo>
      <M7Memo title="Pendant" tone="violet" icon="bot" d={220}>
        <Bullet tone="violet" size={27}>Petits lots, diffs relus</Bullet>
        <Bullet tone="violet" size={27}>Commandes validées, jamais de contournement</Bullet>
        <Bullet tone="violet" size={27}>Une tâche = une session</Bullet>
        <Bullet tone="violet" size={27}>Dépendance inconnue : vérifiée sur le registre</Bullet>
      </M7Memo>
      <M7Memo title="Après" tone="green" icon="checkCircle" d={340}>
        <Bullet tone="green" size={27}>Tests, lint, SAST au vert</Bullet>
        <Bullet tone="green" size={27}>Je peux expliquer chaque ligne</Bullet>
        <Bullet tone="green" size={27}>Usage de l’IA tracé dans la PR</Bullet>
        <Bullet tone="green" size={27}>Ce qui a raté devient une règle</Bullet>
      </M7Memo>
    </div>
  </Frame>
);

// ─── Plan d'action personnel (interactif) ───────────────────────────────────
const M7_ACTIONS = [
  { id: 'a1', h: 0, label: 'Écrire le copilot-instructions.md de mon dépôt' },
  { id: 'a2', h: 0, label: 'Activer le scan de secrets et la protection au push' },
  { id: 'a3', h: 0, label: 'Appliquer « plan validé + petits lots »' },
  { id: 'a4', h: 0, label: 'Vérifier les conditions de mon offre IA' },
  { id: 'b1', h: 1, label: 'Créer 2 skills pour nos tâches répétitives' },
  { id: 'b2', h: 1, label: 'Ajouter un hook lint / format' },
  { id: 'b3', h: 1, label: 'Écrire les tests d’un module legacy avec l’IA' },
  { id: 'b4', h: 1, label: 'Mesurer délai, défauts et crédits par feature' },
  { id: 'c1', h: 2, label: 'Proposer une charte d’usage à mon équipe' },
  { id: 'c2', h: 2, label: 'Mettre en place des agents spécialisés' },
  { id: 'c3', h: 2, label: 'Intégrer SAST et E2E multi-env. en CI' },
  { id: 'c4', h: 2, label: 'Animer un partage de pratiques interne' },
];
const M7_H = [
  { t: 'Dès lundi', tone: 'green' as Tone },
  { t: 'Dans 30 jours', tone: 'blue' as Tone },
  { t: 'Dans 90 jours', tone: 'violet' as Tone },
];

const M7Chip = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const a = M7_ACTIONS[i];
  const tone = M7_H[a.h].tone;
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        flip();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        boxSizing: 'border-box',
        padding: '11px 16px',
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        fontFamily: body,
        fontSize: 21,
        lineHeight: 1.3,
        textAlign: 'left',
        color: C.ink,
        background: on ? T[tone].bg : C.card,
        boxShadow: on ? `inset 0 0 0 2.5px ${STRONG[tone]}` : `inset 0 0 0 1.5px ${C.rule}`,
        transition: `all 220ms ${EASE}`,
      }}
    >
      <span style={{ flex: 'none', width: 28, height: 28, borderRadius: 7, background: on ? STRONG[tone] : '#fff', boxShadow: on ? 'none' : `inset 0 0 0 2px ${C.faint}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on ? <Icon name="check" size={20} color="#fff" sw={3} /> : null}
      </span>
      {a.label}
    </button>
  );
};

const M7HCol = ({ h, children }: { h: number; children: ReactNode }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 14, height: 14, borderRadius: 4, background: STRONG[M7_H[h].tone] }} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{M7_H[h].t}</span>
    </div>
    {children}
  </div>
);

const M7_Plan: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const flip = (id: string) => setOn((o) => ({ ...o, [id]: !o[id] }));
  const n = (h: number) => M7_ACTIONS.filter((a) => a.h === h && on[a.id]).length;
  const total = n(0) + n(1) + n(2);
  const ok = n(0) >= 1 && n(1) >= 1 && n(2) >= 1 && total <= 6;
  return (
    <Frame mod={7} kind="exercice">
      <Title>Mon plan personnel d’intégration de l’IA</Title>
      <Lede>Au moins une action par horizon, six au maximum. Recopiez-les : l’évaluation à 45 jours y revient.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
        <M7HCol h={0}>
          <M7Chip i={0} on={!!on.a1} flip={() => flip('a1')} />
          <M7Chip i={1} on={!!on.a2} flip={() => flip('a2')} />
          <M7Chip i={2} on={!!on.a3} flip={() => flip('a3')} />
          <M7Chip i={3} on={!!on.a4} flip={() => flip('a4')} />
        </M7HCol>
        <M7HCol h={1}>
          <M7Chip i={4} on={!!on.b1} flip={() => flip('b1')} />
          <M7Chip i={5} on={!!on.b2} flip={() => flip('b2')} />
          <M7Chip i={6} on={!!on.b3} flip={() => flip('b3')} />
          <M7Chip i={7} on={!!on.b4} flip={() => flip('b4')} />
        </M7HCol>
        <M7HCol h={2}>
          <M7Chip i={8} on={!!on.c1} flip={() => flip('c1')} />
          <M7Chip i={9} on={!!on.c2} flip={() => flip('c2')} />
          <M7Chip i={10} on={!!on.c3} flip={() => flip('c3')} />
          <M7Chip i={11} on={!!on.c4} flip={() => flip('c4')} />
        </M7HCol>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'flex', gap: 24, alignItems: 'stretch', ...dl(300) }}>
        <div style={{ width: 420, flex: 'none', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px' }}>
          <Eyebrow c={C.muted} size={18}>
            Mon plan
          </Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 72, lineHeight: 1, color: ok ? C.green : total > 6 ? C.coral : C.electric }}>{total}</span>
            <span style={{ fontSize: 24, color: C.soft }}>action{total > 1 ? 's' : ''}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 21, fontWeight: 600, color: ok ? T.green.fg : total > 6 ? T.coral.fg : C.muted }}>
            {ok ? 'Plan équilibré ✓' : total > 6 ? 'Trop d’actions : priorisez !' : 'Une action par horizon, au moins.'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Callout title="Rendez-le concret" tone="violet" icon="calendar" size={23}>
            Pour chaque action : <strong>quoi</strong>, <strong>sur quel projet</strong>, <strong>comment je saurai que c’est fait</strong>. Bloquez dès maintenant
            un créneau dans votre agenda pour la première.
          </Callout>
        </div>
      </div>
    </Frame>
  );
};

// ─── Auto-positionnement final ──────────────────────────────────────────────
const M7_AutoPos: Page = () => {
  const [start, setStart] = useState(3);
  return (
    <Frame mod={7} kind="exercice">
      <Title>Auto-positionnement final : mesurez le chemin parcouru</Title>
      <Lede>Les huit affirmations d’hier matin : cochez ce que vous savez faire, puis réglez votre score de départ.</Lede>
      <Checklist>
        <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="fp1" size={25}>Expliquer pourquoi un LLM peut « halluciner » une API ou un paquet</CheckItem>
          <CheckItem id="fp2" size={25}>Choisir un outil d’IA selon des critères explicites (coût, confidentialité…)</CheckItem>
          <CheckItem id="fp3" size={25}>Écrire un prompt avec rôle, contexte ciblé, tâche, format et critère de fin</CheckItem>
          <CheckItem id="fp4" size={25}>Configurer les instructions de mon assistant pour un dépôt</CheckItem>
          <CheckItem id="fp5" size={25}>Faire travailler un agent en mode Plan, puis par petits lots</CheckItem>
          <CheckItem id="fp6" size={25}>Dire quelles données ne doivent jamais partir dans un prompt</CheckItem>
          <CheckItem id="fp7" size={25}>Valider du code généré avec tests et analyse statique avant le merge</CheckItem>
          <CheckItem id="fp8" size={25}>Citer les obligations RGPD et AI Act qui touchent mon usage</CheckItem>
        </div>
        <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, display: 'flex', flexDirection: 'column', gap: 20, ...dl(300) }}>
          <CheckScore
            max={8}
            label="Mon niveau aujourd’hui"
            levels={[
              { min: 0, text: 'Revoyez les labs bonus à votre rythme.', tone: 'yellow' },
              { min: 5, text: 'Opérationnel : à vous de jouer !', tone: 'blue' },
              { min: 7, text: 'Référent IA de votre équipe ?', tone: 'green' },
            ]}
          />
          <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px' }}>
            <Eyebrow c={C.muted} size={18}>
              Mon score d’hier matin : {start} / 8
            </Eyebrow>
            <div style={{ marginTop: 14 }}>
              <Range value={start} onChange={setStart} min={0} max={8} step={1} w={410} tone="grey" />
            </div>
          </div>
        </div>
      </Checklist>
    </Frame>
  );
};

// ─── Ressources ─────────────────────────────────────────────────────────────
const M7Res = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '20px 24px', display: 'flex', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Resources: Page = () => (
  <Frame mod={7}>
    <Title>Pour aller plus loin</Title>
    <Lede>Des sources fiables et à jour. Les outils changent tous les mois : revenez aux documentations officielles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <M7Res icon="code" tone="green" title="Le cahier de TP FrigoMalin" d={100}>
        23 labs + 8 bonus, indices et auto-évaluation : <span style={{ fontFamily: mono, color: C.electric }}>{LABS_URL}</span>
      </M7Res>
      <M7Res icon="book" tone="blue" title="Documentation GitHub Copilot et VS Code" d={170}>
        Personnalisation (instructions, skills, agents, hooks), modes du chat, MCP, facturation à l’usage.
      </M7Res>
      <M7Res icon="shield" tone="coral" title="OWASP Top 10 for LLM Applications 2025" d={240}>
        La référence des risques, avec des parades pour chaque catégorie.
      </M7Res>
      <M7Res icon="shieldCheck" tone="navy" title="ANSSI et BSI : « AI Coding Assistants »" d={310}>
        Recommandations franco-allemandes pour un usage sûr des assistants de programmation.
      </M7Res>
      <M7Res icon="scale" tone="violet" title="CNIL, AI Act, Cyber Resilience Act" d={380}>
        Fiches pratiques IA de la CNIL ; textes et calendriers officiels de la Commission européenne.
      </M7Res>
      <M7Res icon="globe" tone="teal" title="Standards ouverts" d={450}>
        Model Context Protocol, AGENTS.md, Agent Skills : spécifications et exemples.
      </M7Res>
    </div>
  </Frame>
);

// ─── Évaluation ─────────────────────────────────────────────────────────────
const M7_Eval: Page = () => (
  <Frame mod={7} kind="synthese">
    <Title>Évaluation de la formation</Title>
    <Lede>Votre avis compte : il améliore la prochaine session. Et la formation ne s’arrête pas ce soir.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1000, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="green" icon="star" title="Ce soir : questionnaire à chaud" cls={A.in} size={23}>
        Satisfaction, atteinte des objectifs, qualité des supports et des labs. 5 minutes.
      </Card>
      <Card tone="blue" icon="checkCircle" title="Validation des compétences" cls={A.in} style={dl(150)} size={23}>
        Sur la base des labs, QCM et ateliers réalisés pendant les deux jours.
      </Card>
      <Card tone="violet" icon="calendar" title="Dans 45 jours : questionnaire à froid" cls={A.in} style={dl(300)} size={23}>
        Qu’avez-vous mis en œuvre de votre plan ? Gardez votre fiche à portée de main.
      </Card>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1180, top: 262, width: 620, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce que je retiens le plus
      </Eyebrow>
      <Poll>
        <PollRow id="m7-r1" label="Prompting et contexte" tone="violet" icon="chat" />
        <PollRow id="m7-r2" label="Sécurité et incidents" tone="coral" icon="shield" />
        <PollRow id="m7-r3" label="Équipe d’agents" tone="blue" icon="bot" />
        <PollRow id="m7-r4" label="Tests et garde-fous" tone="green" icon="checkCircle" />
        <PollRow id="m7-r5" label="Le projet FrigoMalin" tone="yellow" icon="leaf" />
      </Poll>
    </div>
  </Frame>
);

// ─── Clôture ────────────────────────────────────────────────────────────────
const M7_Thanks: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1400 }}>
      <div className={A.in} style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: '-0.03em', color: C.navy }}>
        Merci !
      </div>
      <div className={A.in} style={{ marginTop: 40, maxWidth: 1150, ...dl(200) }}>
        <Quote by="Le fil conducteur de ces deux jours">L’IA est un accélérateur, mais c’est le développeur qui crée la valeur.</Quote>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1330, top: 470, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Votre formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 23, color: C.soft }}>
        <Icon name="link" size={24} color={C.electric} />
        <span style={{ fontFamily: mono, color: C.electric }}>{LABS_URL}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 23, color: C.soft }}>Questions, retours d’expérience à 45 jours : écrivez-moi via LinkedIn.</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 720, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
M7_Thanks.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [M7_Divider, M7_Pipeline, M7_Lab91, M7_Built, M7_Keys, M7_Memo, M7_Plan, M7_AutoPos, M7_Resources, M7_Eval, M7_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M7 · 16:55

OBJECTIF — Annoncer le module de synthèse du programme : points clés et plan personnel d’intégration de l’IA.

DIRE — « Dernier module. D’abord, on met FrigoMalin en ligne : c’est le sprint 9, la CI/CD. Ensuite, on rassemble les points clés des deux jours. Puis chacun construit son plan personnel d’intégration de l’IA dans son travail, c’est l’objectif final du programme. Et on termine par l’auto-positionnement, pour mesurer le chemin parcouru, et l’évaluation. »

ANIMATION — Si le planning a glissé, le lab 9.1 peut être fait en démonstration par le formateur sur un dépôt préparé.

TRANSITION — « La mise en ligne passe par un pipeline. »`,
  `⏱ 3 min · PIPELINE (1 temps)

OBJECTIF — Comprendre le pipeline CI/CD comme dernière porte de qualité.

DIRE — « Un push sur main déclenche le workflow. Lint, tests unitaires, build avec le chemin de base /frigomalin/, tests de bout en bout contre le build, et seulement si tout est vert : le déploiement sur GitHub Pages. Une version qui casse un test n’est jamais publiée. » → clic. « Trois points d’attention. Les permissions minimales : contents read, pages write, et id-token write — sans lui, le déploiement échoue, c’est l’erreur numéro un ; et aucun secret à stocker. Les versions des actions : demandez à l’agent de les vérifier, un modèle propose souvent celles de son entraînement. Et la preuve : cassez volontairement un test, la publication doit être bloquée. »

ANIMATION — Le point vert parcourt le pipeline.

TRANSITION — « Lab 9.1, en rétro-prompt. »`,
  `⏱ 12 min (minuteur) · LAB 9.1

OBJECTIF — Produire un workflow de déploiement fiable du premier coup.

DIRE — « Vous avez le résultat attendu. Écrivez le prompt qui produit ce workflow du premier coup, avec l’agent developer. Puis activez GitHub Actions comme source dans les paramètres Pages. »

CORRIGÉ (formateur) — Déclencheurs : push sur main et lancement manuel. Permissions : contents: read, pages: write, id-token: write ; concurrency « pages » sans annulation. Job build (ubuntu-latest, Node 22, cache npm) : npm ci → lint → npm test -- --run → build → copie de dist/index.html vers dist/404.html (si routage par historique, cohérent avec l’ADR 0003) → Chromium et test:e2e contre vite preview → upload-pages-artifact. Job deploy (needs: build, environnement github-pages) : deploy-pages. « Vérifie les versions actuelles des actions officielles. »

ANIMATION — Quand la première URL s’ouvre sur un téléphone, faire applaudir le groupe !

TRANSITION — « FrigoMalin est en ligne. Regardons ce que vous avez construit. »`,
  `⏱ 2 min · CE QUE VOUS AVEZ CONSTRUIT

OBJECTIF — Valoriser le résultat et souligner le kit réutilisable.

DIRE — « En deux jours : un produit cadré, des décisions documentées, l’inventaire, le scan, “Que cuisiner ?” en TDD, une PWA hors ligne, des tests, une CI/CD et une URL publique. Mais le plus précieux est à droite : votre kit Copilot. Instructions globales et ciblées, deux skills, six agents, un hook, un workflow, un .copilotignore et un .mcp.json. Ce sont des fichiers que vous pouvez copier et adapter dans vos dépôts dès lundi. Et pour continuer, huit labs bonus vous attendent, dont la recette PO sur l’URL publique et la préparation d’un backlog V2 prêt pour les agents. »

ANIMATION — Inviter chacun à ouvrir son URL et à installer l’application sur son téléphone.

TRANSITION — « Prenons du recul : les dix points clés. »`,
  `⏱ 4 min · SYNTHÈSE · DIX POINTS CLÉS (1 temps)

OBJECTIF — Ancrer les messages durables, indépendants des outils.

DIRE — « Les outils auront changé dans six mois. Ces dix points, non. Un : un LLM prédit une suite probable, il ne vérifie rien. Deux : pour choisir un outil, les données et le contrat d’abord. Trois : cinq ingrédients par prompt, dont le critère de fin. Quatre : le contexte se construit. Cinq : plan validé, petits lots, un commit par lot. » → clic. « Six : tout ce qu’un agent lit est une donnée, pas une consigne. Sept : moindre privilège pour les agents, aucun secret à portée. Huit : tests d’abord, hooks déterministes, revue humaine. Neuf : mesurez délai, défauts, crédits par feature. Dix : capitalisez, une correction répétée devient une règle. »

ANIMATION — Demander à chaque participant lequel des dix il juge le plus important pour son équipe.

TRANSITION — « Ces points se traduisent en réflexes, avant, pendant et après. »`,
  `⏱ 2 min · AIDE-MÉMOIRE

OBJECTIF — Donner un outil opérationnel à afficher.

DIRE — « Avant : le bon niveau d’assistance, rien de sensible dans le contexte, un prompt complet, un plan validé. Pendant : petits lots et diffs relus, commandes validées et jamais d’option de contournement, une tâche par session, toute dépendance inconnue vérifiée. Après : tests, lint et SAST au vert, je peux expliquer chaque ligne, l’usage de l’IA est tracé dans la PR, et ce qui a raté devient une règle. »

ANIMATION — Proposer de photographier la page ou de la partager dans l’espace du groupe.

TRANSITION — « Maintenant, votre plan à vous. »`,
  `⏱ 6 min · EXERCICE · PLAN D’ACTION PERSONNEL (objectif final du programme)

OBJECTIF — Chaque participant formalise un plan d’intégration de l’IA à trois horizons.

DIRE — « Trois horizons : dès lundi, dans 30 jours, dans 90 jours. Choisissez au moins une action par horizon, six au maximum : un plan trop chargé ne se fait pas. Pensez à ce qui manquait dans votre charte au module 5, et aux limites de votre cas d’intersession. Puis rendez chaque action concrète : quoi, sur quel projet, comment je saurai que c’est fait. Recopiez-le sur votre fiche : le questionnaire à froid, dans 45 jours, vous demandera où vous en êtes. »

ANIMATION — Faire construire le plan d’un volontaire à l’écran ; les autres sur leur fiche. Tour de table rapide : « votre action de lundi ». Les actions les plus citées : instructions du dépôt, scan de secrets, plan + lots.

TRANSITION — « Mesurons maintenant le chemin parcouru. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL (évaluation officielle « après »)

OBJECTIF — Mesurer la progression sur les mêmes 8 compétences qu’au départ.

DIRE — « Les huit mêmes affirmations qu’hier matin. Cochez honnêtement ce que vous savez faire maintenant. Puis réglez le curseur sur votre score d’hier. » Laisser cocher. « La différence, c’est ce que ces deux jours vous ont apporté. Si un point reste non coché, c’est votre premier lab bonus. »

ANIMATION — Faire annoncer quelques progressions à voix haute (sans pression). Noter, pour la validation des compétences, les points qui restent faibles dans le groupe.

TRANSITION — « Pour continuer à apprendre, quelques ressources fiables. »`,
  `⏱ 1 min · RESSOURCES

OBJECTIF — Orienter vers des sources fiables et à jour.

DIRE — « Le cahier de TP reste en ligne, avec les labs bonus. La documentation officielle de Copilot et de VS Code, à consulter souvent : ça change tous les mois. Le Top 10 OWASP pour les LLM. Les recommandations de l’ANSSI et du BSI sur les assistants de programmation, publiées en 2024. Les fiches de la CNIL, et les textes officiels de l’AI Act et du Cyber Resilience Act. Et les standards ouverts : MCP, AGENTS.md, Agent Skills. »

TRANSITION — « Un dernier mot sur l’évaluation. »`,
  `⏱ 3 min · ÉVALUATION

OBJECTIF — Présenter le dispositif d’évaluation officiel et recueillir un dernier retour.

DIRE — « Trois temps. Ce soir, le questionnaire de satisfaction à chaud : cinq minutes, il améliore vraiment la prochaine session. La validation de vos compétences, sur la base des labs, QCM et ateliers. Et dans 45 jours, un questionnaire à froid : qu’avez-vous mis en œuvre de votre plan ? Dernier sondage, main levée : ce que vous retenez le plus. »

ANIMATION — Compter les votes du sondage. Si la formation est en Action collective OPCO Atlas, rappeler qu’un prestataire peut aussi recueillir une évaluation à chaud.

TRANSITION — « Il me reste à vous remercier. »`,
  `⏱ 1 min · CLÔTURE · 17:30

OBJECTIF — Conclure sur le message central et laisser un contact.

DIRE — « Merci pour votre énergie, vos questions et vos cas réels, qui ont fait la richesse de ces deux jours. Je vous laisse avec le fil conducteur : l’IA est un accélérateur, mais c’est le développeur qui crée la valeur. Vous avez maintenant la méthode, les garde-fous et un kit pour le faire dès lundi. Le cahier de TP reste en ligne. Écrivez-moi pour me raconter où vous en serez dans 45 jours. Bonne continuation à toutes et à tous ! »

ANIMATION — Laisser la page affichée pendant le questionnaire à chaud.`,
];
// @@NOTES-END
