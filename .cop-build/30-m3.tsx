// ─── Module 3 · Automatiser les tests ───────────────────────────────────────

const M3_Divider: Page = () => (
  <Section
    n={3}
    title={
      <>
        Automatiser
        <br />
        la génération de tests
      </>
    }
    sub="Une stratégie d’abord, des tests ensuite : unitaires, mocks, intégration, couverture… et les pièges des tests générés."
    dur="11:40 – 12:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 3 · suite de tests complète</Tag>}
  >
    <SecItem n={1}>Stratégie : couverture, cas limites, cas négatifs</SecItem>
    <SecItem n={2}>Tests unitaires paramétrés</SecItem>
    <SecItem n={3}>Mocks et stubs pour isoler</SecItem>
    <SecItem n={4}>Scénarios d’intégration de bout en bout</SecItem>
    <SecItem n={5}>Couverture, mutation et pièges</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ─── Stratégie : la matrice de cas ──────────────────────────────────────────
const M3Col = ({ icon, tone, title, cls, children }: { icon: IconName; tone: Tone; title: string; cls?: string; children: ReactNode }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: STRONG[tone] === C.yellow ? C.amber : STRONG[tone] }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M3Case = ({ children, out }: { children: ReactNode; out: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: C.panel, fontSize: 20, lineHeight: 1.3, color: C.ink }}>
    <span>{children}</span>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 18, fontWeight: 700, color: C.navy }}>{out}</span>
  </div>
);

const M3_Strategy: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>D’abord la stratégie : la matrice de cas</Title>
    <Lede>« Écris des tests » produit surtout des cas nominaux. Exigez quatre colonnes, validez-les, puis seulement générez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 22 }}>
      <M3Col icon="checkCircle" tone="green" title="Nominal" cls={A.in}>
        <M3Case out="201">Créneau libre</M3Case>
        <M3Case out="201">Autre salle, même heure</M3Case>
        <M3Case out="204">Annuler la sienne</M3Case>
      </M3Col>
      <M3Col icon="target" tone="yellow" title="Limites" cls={b.on(1)}>
        <M3Case out="201">10h–11h puis 11h–12h</M3Case>
        <M3Case out="201">Début à 8:00 pile</M3Case>
        <M3Case out="?">Changement d’heure</M3Case>
      </M3Col>
      <M3Col icon="x" tone="coral" title="Négatifs" cls={b.on(2)}>
        <M3Case out="409">Chevauchement partiel</M3Case>
        <M3Case out="400">Début ≥ fin</M3Case>
        <M3Case out="404">Salle inconnue</M3Case>
      </M3Col>
      <M3Col icon="shield" tone="violet" title="Sécurité" cls={b.on(3)}>
        <M3Case out="403">Annuler celle d’un autre</M3Case>
        <M3Case out="401">Jeton expiré</M3Case>
        <M3Case out="400">Identifiant malformé</M3Case>
      </M3Col>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 30, alignItems: 'stretch' }}>
      <CodeDark file="Prompt" size={21} wrap style={{ flex: 1 }}>
        Avant d’écrire un test, liste les cas de BookingService.book() en quatre colonnes : nominal, limites, négatifs, sécurité. Pour chacun : entrée, résultat attendu. <span style={{ color: '#FFD27A' }}>Attends ma validation.</span>
      </CodeDark>
      <div style={{ width: 520, display: 'flex', alignItems: 'center', fontSize: 23, lineHeight: 1.45, color: C.soft }}>
        Le « ? » est voulu : une règle métier absente. Copilot ne doit pas l’inventer, c’est à vous de trancher.
      </div>
    </div>
  </Frame>
);

// ─── Tests unitaires paramétrés (onglets) ───────────────────────────────────
const M3_Unit: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Des tests unitaires paramétrés, pas copiés-collés</Title>
    <Lede>Un comportement, une table de cas : plus lisible en revue, et chaque cas limite reste visible.</Lede>
    <LangTabs initial="Jest" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="Jest" />
        <LangBtn lang="pytest" tone="yellow" />
        <LangBtn lang="JUnit 5" tone="coral" />
        <LangBtn lang="xUnit" tone="violet" />
      </div>
      <LangPane lang="Jest">
        <CodeDark file="overlap.test.ts" size={21}>
          <Ck>describe</Ck>(<Cs>'overlaps'</Cs>, () ={'>'} {'{'}
          {'\n'}
          {'  '}test.<Cf>each</Cf>([{'\n'}
          {'    '}[<Cs>'9h-10h'</Cs>, <Cs>'9h30-11h'</Cs>, <Cn>true</Cn>],{'\n'}
          {'    '}[<Cs>'9h-10h'</Cs>, <Cs>'10h-11h'</Cs>, <Cn>false</Cn>], <Cc>// bornes [début, fin[</Cc>
          {'\n'}
          {'    '}[<Cs>'9h-12h'</Cs>, <Cs>'10h-11h'</Cs>, <Cn>true</Cn>], <Cc>// inclusion</Cc>
          {'\n'}
          {'    '}[<Cs>'9h-10h'</Cs>, <Cs>'14h-15h'</Cs>, <Cn>false</Cn>],{'\n'}
          {'  '}])(<Cs>'%s contre %s → %s'</Cs>, (a, b, attendu) ={'>'} {'{'}
          {'\n'}
          {'    '}<Cf>expect</Cf>(<Cf>overlaps</Cf>(<Cf>slot</Cf>(a), <Cf>slot</Cf>(b))).<Cf>toBe</Cf>(attendu);{'\n'}
          {'  '}{'}'});{'\n'}
          {'}'});
        </CodeDark>
      </LangPane>
      <LangPane lang="pytest">
        <CodeDark file="test_overlap.py" size={21}>
          <Cf>@pytest.mark.parametrize</Cf>(<Cs>"a, b, attendu"</Cs>, [{'\n'}
          {'    '}(<Cs>"9h-10h"</Cs>, <Cs>"9h30-11h"</Cs>, <Cn>True</Cn>),{'\n'}
          {'    '}(<Cs>"9h-10h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>False</Cn>), <Cc># bornes [début, fin[</Cc>
          {'\n'}
          {'    '}(<Cs>"9h-12h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>True</Cn>), <Cc># inclusion</Cc>
          {'\n'}
          {'    '}(<Cs>"9h-10h"</Cs>, <Cs>"14h-15h"</Cs>, <Cn>False</Cn>),{'\n'}
          ]){'\n'}
          <Ck>def</Ck> <Cf>test_overlaps</Cf>(a, b, attendu):{'\n'}
          {'    '}<Ck>assert</Ck> <Cf>overlaps</Cf>(<Cf>slot</Cf>(a), <Cf>slot</Cf>(b)) <Ck>is</Ck> attendu
        </CodeDark>
      </LangPane>
      <LangPane lang="JUnit 5">
        <CodeDark file="OverlapTest.java" size={21}>
          <Cf>@ParameterizedTest</Cf>(name = <Cs>"{'{0}'} contre {'{1}'} → {'{2}'}"</Cs>){'\n'}
          <Cf>@CsvSource</Cf>({'{'}
          {'\n'}
          {'    '}<Cs>"9h-10h, 9h30-11h, true"</Cs>,{'\n'}
          {'    '}<Cs>"9h-10h, 10h-11h, false"</Cs>, <Cc>// bornes [début, fin[</Cc>
          {'\n'}
          {'    '}<Cs>"9h-12h, 10h-11h, true"</Cs>, <Cc>// inclusion</Cc>
          {'\n'}
          {'    '}<Cs>"9h-10h, 14h-15h, false"</Cs>{'\n'}
          {'}'}){'\n'}
          <Ck>void</Ck> <Cf>overlaps</Cf>(String a, String b, <Ck>boolean</Ck> attendu) {'{'}
          {'\n'}
          {'    '}<Cf>assertEquals</Cf>(attendu, Slots.<Cf>overlaps</Cf>(<Cf>slot</Cf>(a), <Cf>slot</Cf>(b)));{'\n'}
          {'}'}
        </CodeDark>
      </LangPane>
      <LangPane lang="xUnit">
        <CodeDark file="OverlapTests.cs" size={21}>
          [<Cf>Theory</Cf>]{'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-10h"</Cs>, <Cs>"9h30-11h"</Cs>, <Cn>true</Cn>)]{'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-10h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>false</Cn>)] <Cc>// bornes [début, fin[</Cc>
          {'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-12h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>true</Cn>)] <Cc>// inclusion</Cc>
          {'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-10h"</Cs>, <Cs>"14h-15h"</Cs>, <Cn>false</Cn>)]{'\n'}
          <Ck>public void</Ck> <Cf>Overlaps</Cf>(<Ck>string</Ck> a, <Ck>string</Ck> b, <Ck>bool</Ck> attendu) ={'>'}
          {'\n'}
          {'    '}Assert.<Cf>Equal</Cf>(attendu, Slots.<Cf>Overlaps</Cf>(<Cf>Slot</Cf>(a), <Cf>Slot</Cf>(b)));
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div className={A.right} style={{ position: 'absolute', left: 1240, top: 262, width: 560, ...dl(200) }}>
      <CodeDark file="Prompt" size={20} wrap>
        /tests pour #selection.{'\n'}
        Une table de cas reprenant la matrice validée.{'\n'}
        Noms = comportement attendu.{'\n'}
        Aucune logique (if, boucle) dans un test.{'\n'}
        <span style={{ color: '#FFD27A' }}>Lance la suite et montre-moi la sortie.</span>
      </CodeDark>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet size={22} tone="pink">Structure Arrange · Act · Assert</Bullet>
        <Bullet size={22} tone="pink">Données de test explicites et fixes</Bullet>
        <Bullet size={22} tone="pink">Un échec doit dire quel cas a cassé</Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Mocks et stubs ─────────────────────────────────────────────────────────
const M3Dep = ({ x, y, icon, tone, name, kind, how }: { x: number; y: number; icon: IconName; tone: Tone; name: string; kind: string; how: string }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: y, width: 370, display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '14px 18px', ...dl(y / 2) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>
        {name} <span style={{ fontSize: 17, fontWeight: 700, color: T[tone].fg, background: T[tone].bg, borderRadius: 999, padding: '2px 10px', marginLeft: 6 }}>{kind}</span>
      </div>
      <div style={{ fontSize: 19, color: C.muted }}>{how}</div>
    </div>
  </div>
);

const M3_Mocks: Page = () => (
  <Frame mod={3} beats={1}>
    <Title>Mocks et stubs : isoler sans mentir</Title>
    <Lede>On double les frontières que l’on possède — persistance, horloge, notifications —, jamais le domaine lui-même.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 490 520 L 600 380" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M 490 540 L 600 540" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M 490 560 L 600 700" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 460, width: 370, background: G.navy, borderRadius: 20, padding: '22px 26px', color: '#fff' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28 }}>BookingService</div>
      <div style={{ marginTop: 6, fontSize: 20, color: '#C9D2F2' }}>le code réellement testé</div>
    </div>
    <M3Dep x={600} y={330} icon="database" tone="teal" name="Repository" kind="stub" how="renvoie des données fixées" />
    <M3Dep x={600} y={490} icon="clock" tone="yellow" name="Horloge" kind="fake" how="maintenant = 12/10, 9:00" />
    <M3Dep x={600} y={650} icon="mail" tone="violet" name="Notifier" kind="mock" how="appelé une fois, vérifié" />
    <div style={{ position: 'absolute', left: 1060, top: 270, width: 740, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.right} tone="blue" icon="filter" title="Stub ou mock ?" size={22} style={dl(300)}>
        Le stub fournit un état, le mock vérifie une interaction. Préférez vérifier l’état : plus robuste au refactoring.
      </Card>
      <Card cls={A.right} tone="coral" icon="alert" title="Le test qui teste son mock" size={22} style={dl(420)}>
        Configurer un retour puis vérifier ce même retour ne prouve rien. Un classique des tests générés.
      </Card>
      <div className={b.on(1)}>
        <CodeDark file="Prompt" size={20} wrap>
          Génère les doubles des dépendances injectées de BookingService. Horloge fixe. <span style={{ color: '#FFD27A' }}>Ne double rien de src/domain.</span>
        </CodeDark>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 935, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
      Outils : jest.fn · unittest.mock · Mockito · Moq ou NSubstitute. Une horloge injectée évite les tests qui cassent à minuit.
    </div>
  </Frame>
);

// ─── Tests d'intégration ────────────────────────────────────────────────────
const M3Call = ({ verb, path, who, code, tone, beat }: { verb: string; path: string; who: string; code: string; tone: Tone; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 220px 90px', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 21, color: C.navy }}>{verb}</span>
    <span style={{ fontFamily: mono, fontSize: 21, color: C.ink }}>{path}</span>
    <span style={{ fontSize: 20, color: C.muted }}>{who}</span>
    <span style={{ textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color: '#fff', background: STRONG[tone], borderRadius: 8, padding: '4px 0' }}>{code}</span>
  </div>
);

const M3_Integration: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Intégration : un scénario de bout en bout</Title>
    <Lede>Vraies routes, vrai middleware d’auth, vraie validation. Seule la persistance est en mémoire, réinitialisée à chaque test.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M3Call verb="POST" path="/auth/login" who="Alice (membre)" code="200" tone="green" beat={0} />
      <M3Call verb="POST" path="/bookings · A · 9h–10h" who="Alice" code="201" tone="green" beat={1} />
      <M3Call verb="POST" path="/bookings · A · 9h30–10h30" who="Bob" code="409" tone="coral" beat={2} />
      <M3Call verb="DELETE" path="/bookings/{id d’Alice}" who="Bob" code="403" tone="coral" beat={3} />
      <M3Call verb="GET" path="/rooms/available?9h–10h" who="Bob" code="200" tone="green" beat={4} />
      <div className={b.on(4)} style={{ fontSize: 21, color: C.soft, paddingLeft: 20 }}>
        … et la salle A n’est pas dans la liste.
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 262, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
      <PanelTitle icon="tool">Par stack</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 21, color: C.soft }}>
        <div>
          <strong style={{ color: T.blue.fg }}>TS</strong> · supertest
        </div>
        <div>
          <strong style={{ color: T.yellow.fg }}>Python</strong> · TestClient (httpx)
        </div>
        <div>
          <strong style={{ color: T.coral.fg }}>Java</strong> · MockMvc, @SpringBootTest
        </div>
        <div>
          <strong style={{ color: T.violet.fg }}>C#</strong> · WebApplicationFactory
        </div>
        <div style={{ marginTop: 6, fontSize: 19, color: C.muted }}>Base réelle : Testcontainers, dans la CI.</div>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1260, top: 640, width: 540, ...dl(500) }}>
      <Callout title="Le prompt" tone="pink" icon="chat" size={21}>
        Écris ce scénario en un test d’intégration lisible comme une histoire : une étape, une assertion.
      </Callout>
    </div>
  </Frame>
);

// ─── Couverture et mutation ─────────────────────────────────────────────────
const M3Loop = ({ n, tone, title, sub, cls }: { n: number; tone: Tone; title: string; sub: string; cls?: string }) => (
  <div className={cls} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <Num n={n} tone={tone} size={48} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35 }}>{sub}</div>
    </div>
  </div>
);

const M3_Coverage: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Couverture : itérer… sans se faire piéger</Title>
    <Lede>La couverture dit ce qui a été exécuté, pas ce qui a été vérifié. La mutation dit si vos tests détectent une erreur.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Loop n={1} tone="blue" title="Mesurer" sub="jest --coverage · pytest-cov · JaCoCo · coverlet" cls={A.in} />
      <M3Loop n={2} tone="violet" title="Cibler" sub="donner le rapport : « couvre les branches 42–57 »" cls={A.in} />
      <M3Loop n={3} tone="pink" title="Générer" sub="les tests manquants, sur la matrice validée" cls={A.in} />
      <M3Loop n={4} tone="green" title="Muter" sub="Stryker · mutmut · PIT · Stryker.NET" cls={b.on(1)} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1000, top: 262, width: 800, ...dl(200) }}>
      <CodeDark file="booking.test.ts · 100 % de couverture" size={21}>
        <Ck>test</Ck>(<Cs>'book'</Cs>, <Ck>async</Ck> () ={'>'} {'{'}
        {'\n'}
        {'  '}<Ck>await</Ck> service.<Cf>book</Cf>(req);{'\n'}
        {'  '}<Ck>await</Ck> service.<Cf>book</Cf>(conflicting).<Cf>catch</Cf>(() ={'>'} {'{}'});{'\n'}
        {'}'});{'\n'}
        <Cc>// toutes les lignes exécutées… aucune assertion</Cc>
      </CodeDark>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1000, top: 560, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px' }}>
      <PanelTitle icon="bug" c={T.green.fg}>
        Le test de mutation
      </PanelTitle>
      <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>
        L’outil remplace <code style={{ fontFamily: mono, color: C.ink }}>{'<'}</code> par <code style={{ fontFamily: mono, color: C.ink }}>{'<='}</code> dans overlaps. Si aucun test ne casse, le mutant survit : vos tests ne protègent pas cette ligne.
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
      <Callout title="Indicateur d’équipe" tone="green" icon="gauge" size={23}>
        Seuil de couverture en CI comme garde-fou, score de mutation sur le domaine comme mesure de qualité.
      </Callout>
    </div>
  </Frame>
);

// ─── Les pièges des tests générés ───────────────────────────────────────────
const M3Mark = ({ n }: { n: number }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, marginLeft: 10, borderRadius: 99, background: C.coral, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 18, verticalAlign: 'middle' }}>{n}</span>
);

const M3Flaw = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone="coral" size={36} style={{ marginTop: 2 }} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Traps: Page = () => (
  <Frame mod={3} kind="exercice" beats={5}>
    <Title>Repérez les pièges : cinq défauts dans ce test généré</Title>
    <Lede>Il passe au vert. Il ne protège presque rien. Cherchez avant que les réponses n’apparaissent.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file="booking.service.test.ts" size={21}>
        <Ck>test</Ck>(<Cs>'book works'</Cs>, <Ck>async</Ck> () ={'>'} {'{'}
        <M3Mark n={1} />
        {'\n'}
        {'  '}repo.findOverlapping.<Cf>mockResolvedValue</Cf>([]);{'\n'}
        {'  '}<Ck>const</Ck> req = {'{'} roomId: <Cs>'A'</Cs>, start: <Ck>new</Ck> <Cf>Date</Cf>(), hours: <Cn>1</Cn> {'}'};
        <M3Mark n={2} />
        {'\n'}
        {'  '}<Ck>const</Ck> res = <Ck>await</Ck> service.<Cf>book</Cf>(req);{'\n'}
        {'  '}<Cf>expect</Cf>(repo.findOverlapping).<Cf>toHaveBeenCalled</Cf>();
        <M3Mark n={3} />
        {'\n'}
        {'  '}<Cf>expect</Cf>(res).<Cf>toBeDefined</Cf>();
        <M3Mark n={4} />
        {'\n'}
        {'}'});{'\n\n'}
        <Ck>test</Ck>.<Cf>skip</Cf>(<Cs>'rejects overlapping booking'</Cs>, <Ck>async</Ck> () ={'>'} {'{'}
        <M3Mark n={5} />
        {'\n'}
        {'  '}<Cc>// TODO: flaky, à corriger plus tard</Cc>
        {'\n'}
        {'}'});
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="Nom vague">Il doit décrire le comportement : « réserve un créneau libre ».</M3Flaw>
      <M3Flaw n={2} title="Date réelle">new Date() : test instable, dépend de l’heure d’exécution.</M3Flaw>
      <M3Flaw n={3} title="Teste le mock">Vérifie un appel interne, pas le résultat métier.</M3Flaw>
      <M3Flaw n={4} title="Assertion vide">toBeDefined passe pour presque n’importe quoi.</M3Flaw>
      <M3Flaw n={5} title="Test désactivé">L’agent a « fait passer la suite » en sautant le test qui échouait.</M3Flaw>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="« Tous les tests passent »"
    q="L’agent annonce : « bug corrigé, tous les tests passent ». Quelle vérification est prioritaire ?"
    explain="Un agent qui doit atteindre « tout au vert » peut y arriver en modifiant les tests. Le diff des tests se relit avant le diff du code."
  >
    <Opt why="Utile, mais une suite qui passe après qu’un test a été supprimé ou désactivé passe… toujours.">
      Relancer la suite soi-même
    </Opt>
    <Opt ok why="Exact : aucun test supprimé, sauté (skip) ou affaibli, aucune assertion commentée. C’est la triche la plus fréquente des agents.">
      Lire le diff des fichiers de test
    </Opt>
    <Opt why="La couverture peut rester stable avec des assertions vidées de leur sens.">
      Vérifier que la couverture n’a pas baissé
    </Opt>
    <Opt why="L’agent confirmera de bonne foi : il croit avoir réussi. Ce n’est pas une vérification indépendante.">
      Demander à l’agent de confirmer qu’il n’a rien cassé
    </Opt>
  </QcmPage>
);

// ─── TP 3 ───────────────────────────────────────────────────────────────────
const M3_TP: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Une suite de tests complète"
    defi="tests"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>tests/CASES.md</PathChip> matrice validée
        <br />
        <PathChip>tests/unit/**</PathChip> <PathChip>tests/integration/**</PathChip>
        <br />
        rapport de couverture (capture)
      </>
    }
    objective={<>Sur l’API du TP 2 : tests unitaires paramétrés, doubles de test pour isoler les dépendances, scénarios d’intégration et couverture mesurée.</>}
    crit={
      <>
        <CheckItem id="tp3-1" size={21}>Matrice en 4 colonnes validée avant génération</CheckItem>
        <CheckItem id="tp3-2" size={21}>Un test paramétré par règle métier</CheckItem>
        <CheckItem id="tp3-3" size={21}>Trois scénarios d’intégration, dont un 403</CheckItem>
        <CheckItem id="tp3-4" size={21}>Services couverts à 80 % des branches</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Faites produire la matrice de cas, complétez-la, tranchez les « ? ».</M2Step>
      <M2Step n={2}>Tests unitaires du domaine et des services, doubles injectés.</M2Step>
      <M2Step n={3}>Scénarios d’intégration à partir de la matrice « sécurité ».</M2Step>
      <M2Step n={4}>Couverture : ciblez les branches manquantes, relisez le diff des tests.</M2Step>
    </div>
    <TpBonus>Changez un {'<'} en {'<='} dans overlaps : au moins un test doit casser. Sinon, faites-le écrire.</TpBonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M3_Divider, M3_Strategy, M3_Unit, M3_Mocks, M3_Integration, M3_Coverage, M3_Traps, M3_Qcm, M3_TP];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DIVISEUR M3 · 11:40

OBJECTIF — Annoncer le module 3 du programme : automatisation de la génération de tests.

DIRE — « Module 3 : les tests. C’est là que Copilot fait gagner le plus de temps… et là qu’il donne la plus fausse impression de sécurité. Stratégie d’abord — couverture, cas limites, cas négatifs —, puis tests unitaires, mocks et stubs, tests d’intégration, et enfin l’analyse de couverture et ses pièges. TP 3 : la suite complète de l’API du TP 2. »

TRANSITION — « Tout commence par une stratégie, pas par /tests. »`,
  `⏱ 4 min · MATRICE DE CAS (4 temps)

OBJECTIF — Stratégie de test avec Copilot : couverture, cas limites, cas négatifs.

DIRE — « Si vous tapez juste "écris des tests", vous obtenez surtout des cas nominaux. Exigez quatre colonnes. Nominal. » → clic. « Limites : deux réservations bout à bout, une réservation pile à l’ouverture, le changement d’heure. » → clic. « Négatifs : chevauchement partiel, début après la fin, salle inconnue. » → clic. « Sécurité : annuler la réservation d’un autre, jeton expiré, identifiant malformé. » → clic. « Le prompt : liste les cas, attends ma validation. Et le point d’interrogation est voulu : le changement d’heure n’est pas spécifié. Copilot ne doit pas inventer la règle : c’est une décision produit. »

TRANSITION — « La matrice validée devient des tests paramétrés. »`,
  `⏱ 4 min · TESTS UNITAIRES (démo, onglets)

OBJECTIF — Génération automatisée de tests unitaires (Jest, pytest, JUnit…).

DIRE — « Quatre frameworks, même idée : un comportement, une table de cas. Chaque ligne de la matrice devient une ligne de la table, avec en commentaire la règle qu’elle protège. En revue, on voit immédiatement les cas manquants. Le prompt à droite : /tests sur la sélection, la matrice comme source, des noms qui décrivent le comportement, aucune logique dans les tests — un if dans un test, c’est un test qui peut se tromper —, et on termine par l’exécution. »

ANIMATION — Cliquer l’onglet de chaque stack présente dans le groupe.

TRANSITION — « Le service, lui, a des dépendances. Il faut les isoler. »`,
  `⏱ 4 min · MOCKS ET STUBS (1 temps)

OBJECTIF — Génération de mocks et stubs pour isoler les dépendances.

DIRE — « On isole le service testé de ses frontières : le repository devient un stub qui renvoie des données fixées, l’horloge un fake réglé sur une date, le notifier un mock dont on vérifie l’appel. La distinction compte : le stub fournit un état, le mock vérifie une interaction. Vérifier l’état est plus robuste au refactoring de cet après-midi. Le piège typique de Copilot : configurer un retour sur le mock, puis vérifier ce même retour. Le test passe toujours. » → clic. « Le prompt : doubles des dépendances injectées, horloge fixe, et surtout ne rien doubler du domaine. »

TRANSITION — « Les tests unitaires isolent. Les tests d’intégration assemblent. »`,
  `⏱ 4 min · INTÉGRATION (4 temps)

OBJECTIF — Tests d’intégration : générer des scénarios bout en bout avec Copilot.

DIRE — « Un scénario qui se lit comme une histoire. Alice se connecte. » → clic. « Elle réserve la salle A de 9h à 10h : 201. » → clic. « Bob tente 9h30–10h30 : 409. » → clic. « Bob essaie d’annuler la réservation d’Alice : 403. C’est le test qui attrapera la faille du module 5. » → clic. « Bob cherche une salle libre de 9h à 10h : la salle A n’y est pas. Vraies routes, vrai middleware, vraie validation ; la persistance est en mémoire et réinitialisée à chaque test. À droite, l’outil par stack. Avec une vraie base, Testcontainers, en CI. »

TRANSITION — « Comment savoir si on a assez testé ? La couverture… avec prudence. »`,
  `⏱ 4 min · COUVERTURE ET MUTATION (2 temps)

OBJECTIF — Analyse de couverture de code et itération sur les tests générés.

DIRE — « La boucle : mesurer, cibler — donner le rapport à Copilot en précisant les branches —, générer. Mais regardez ce test : 100 % de couverture, zéro assertion. La couverture dit ce qui a été exécuté, pas vérifié. » → clic. « D’où l’étape 4 : la mutation. L’outil modifie votre code — un inférieur strict devient inférieur ou égal — et regarde si un test casse. Si aucun ne casse, vos tests ne protègent pas cette ligne. » → clic. « En équipe : un seuil de couverture comme garde-fou en CI, le score de mutation sur le domaine comme vraie mesure. »

TRANSITION — « Exercice : cinq défauts dans un test généré. »`,
  `⏱ 4 min · PIÈGES (exercice, 5 temps)

OBJECTIF — Savoir relire un test généré.

DIRE — « Ce test passe au vert. Trouvez cinq défauts, à voix haute. » Laisser chercher 1 minute. Puis → clic par défaut. « Un : nom vague. Deux : une vraie date, le test change de comportement selon l’heure — dans deux semaines il réservera un samedi et cassera. Trois : il vérifie un appel interne, pas le résultat. Quatre : toBeDefined, l’assertion la plus faible qui soit. Cinq, le plus grave : le test qui échouait a été désactivé, avec un commentaire rassurant. C’est un comportement réel des agents quand on leur demande que tout passe. »

TRANSITION — « Ce qui nous amène au QCM. »`,
  `⏱ 2 min · QCM 3

OBJECTIF — Ancrer le réflexe de relire le diff des tests.

DIRE — « Quand l’objectif est "tout au vert", modifier le test est un chemin valide pour l’agent. La règle d’équipe : le diff des tests se relit avant le diff du code. »

TRANSITION — « TP 3, puis déjeuner. »`,
  `⏱ 25 min (minuteur) · TP 3

OBJECTIF — Atelier du programme : à partir du module développé au module 2, générer une suite complète de tests unitaires, mocks et tests d’intégration.

DIRE — « D’abord la matrice : faites-la produire, complétez-la, tranchez les points d’interrogation. Ensuite les tests unitaires, puis les scénarios d’intégration — reprenez la colonne sécurité —, puis la couverture. Avant de dire "fini", relisez le diff des tests. Bonus : faites une mutation à la main dans overlaps et vérifiez qu’un test casse. »

ANIMATION — Minuteur. Repérer un test d’intégration 403 qui échoue : c’est normal si l’API n’a pas de contrôle de propriétaire, et c’est précieux pour le module 5. Le noter.

TRANSITION — « Bon appétit. Reprise à 13:30 avec un quiz flash. »`,
];
// @@NOTES-END
