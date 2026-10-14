// ─── Module 6 · IA, tableaux et données ─────────────────────────────────────
const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        IA, tableaux
        <br />
        et données
      </>
    }
    sub="Analyser un tableau, repérer des tendances, nettoyer, structurer, préparer un reporting : l’IA commente, le tableur calcule."
    dur="15:20 – 16:00 · exercices inclus"
  >
    <SecItem n={1}>Analyser un tableau, identifier des tendances</SecItem>
    <SecItem n={2}>Nettoyer des données simples</SecItem>
    <SecItem n={3}>Transformer des données en synthèse</SecItem>
    <SecItem n={4}>Créer des tableaux structurés, préparer un reporting</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Données partagées du module ────────────────────────────────────────────
const M6_ROWS: [string, number, number, number][] = [
  ['Commercial', 1240, 1310, 1980],
  ['Administration', 820, 640, 860],
  ['Production', 2100, 1950, 2230],
  ['RH', 310, 290, 1150],
];
const M6_COL = [0, 1, 2].map((j) => M6_ROWS.reduce((s, r) => s + (r[j + 1] as number), 0));
const M6_TOTAL = M6_COL.reduce((s, x) => s + x, 0);

const M6Table = ({ hiRow, w = 900 }: { hiRow?: number; w?: number }) => (
  <div style={{ width: w, background: C.card, borderRadius: 16, boxShadow: SHADOW, overflow: 'hidden', fontSize: 22 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', background: C.navy, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
      {['Service', 'Juillet', 'Août', 'Sept.', 'Total'].map((h) => (
        <span key={h} style={{ padding: '12px 16px', textAlign: h === 'Service' ? 'left' : 'right' }}>
          {h}
        </span>
      ))}
    </div>
    {M6_ROWS.map((r, i) => (
      <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', borderBottom: `1.5px solid ${C.rule}`, background: hiRow === i ? T.yellow.bg : 'transparent' }}>
        <span style={{ padding: '11px 16px', fontWeight: 600, color: C.ink }}>{r[0]}</span>
        {[r[1], r[2], r[3], r[1] + r[2] + r[3]].map((v, j) => (
          <span key={j} style={{ padding: '11px 16px', textAlign: 'right', fontFamily: mono, fontSize: 20, color: j === 3 ? C.navy : C.soft, fontWeight: j === 3 ? 700 : 400 }}>
            {fr(v)} €
          </span>
        ))}
      </div>
    ))}
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', background: C.panel }}>
      <span style={{ padding: '11px 16px', fontWeight: 800, color: C.navy }}>Total</span>
      {[...M6_COL, M6_TOTAL].map((v, j) => (
        <span key={j} style={{ padding: '11px 16px', textAlign: 'right', fontFamily: mono, fontSize: 20, fontWeight: 700, color: C.navy }}>
          {fr(v)} €
        </span>
      ))}
    </div>
  </div>
);

// ─── Analyser un tableau ────────────────────────────────────────────────────
const M6_Analyser: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Analyser un tableau : ce que l’IA voit… et ce qu’elle rate</Title>
    <Lede>Dépenses de fournitures par service, 3e trimestre (données fictives). « Analyse ce tableau en 4 points. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280 }}>
      <M6Table hiRow={3} w={900} />
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card tone="blue" icon="trend" title="Septembre en forte hausse" cls={b.on(1)} size={21} pad={22}>
        + 48 % par rapport à août, tous services confondus.
      </Card>
      <Card tone="yellow" icon="alert" title="RH : × 4 en septembre" cls={b.on(2)} size={21} pad={22}>
        Dépense inhabituelle. <em>Hypothèse</em> : le salon de recrutement ? À vérifier.
      </Card>
      <Card tone="green" icon="chart" title="La production pèse 42 %" cls={b.on(3)} size={21} pad={22}>
        Premier poste de dépense, stable sur le trimestre.
      </Card>
      <div className={b.pop(4)} style={{ background: T.coral.bg, borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T.coral.bd}`, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Icon name="x" size={30} color={C.coral} />
        <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>
          « Total du trimestre : <strong>14 980 €</strong>. » <strong style={{ color: T.coral.fg }}>Faux</strong> : le tableur dit {fr(M6_TOTAL)} €. L’IA a mal additionné.
        </div>
      </div>
    </div>
    <div className={b.fade(4)} style={{ position: 'absolute', left: 120, top: 800, width: 900, fontSize: 23, lineHeight: 1.45, color: C.soft, display: 'flex', gap: 14, alignItems: 'center' }}>
      <Icon name="shieldCheck" size={30} color={C.green} />
      <span>L’IA est bonne pour <strong style={{ color: C.navy }}>commenter</strong>. Pour <strong style={{ color: C.navy }}>calculer</strong>, faites confiance aux formules.</span>
    </div>
  </Frame>
);

// ─── Identifier des tendances (graphique) ───────────────────────────────────
const M6_MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const M6_REQ = [118, 112, 131, 138, 135, 149, 96, 58, 162, 171, 178, 139];

const M6_Tendances: Page = () => {
  const max = 200;
  return (
    <Frame mod={6} beats={3}>
      <Title>Identifier des tendances</Title>
      <Lede>Demandes reçues à l’accueil par mois (fictif). « Quelles tendances vois-tu ? Distingue saisonnalité et évolution. Toute explication doit être présentée comme une hypothèse. »</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 320, width: 1060, height: 520, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px 20px', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', height: 400, display: 'flex', alignItems: 'flex-end', gap: 18, borderBottom: `2px solid ${C.rule}` }}>
          {M6_REQ.map((v, i) => {
            const summer = i === 6 || i === 7;
            const autumn = i >= 8 && i <= 10;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontFamily: mono, fontSize: 16, color: C.muted, marginBottom: 6 }}>{v}</span>
                <div className={A.growY} style={{ width: '100%', height: `${(v / max) * 340}px`, borderRadius: '8px 8px 0 0', background: summer ? STRONG.yellow : autumn ? STRONG.violet : STRONG.blue, ...dl(200 + i * 60) }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
          {M6_MONTHS.map((m, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: mono, fontSize: 18, color: C.muted }}>
              {m}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 320, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="blue" icon="trend" title="Évolution" cls={b.on(1)} size={21} pad={22}>
          Hausse régulière de janvier à juin : environ + 25 %.
        </Card>
        <Card tone="yellow" icon="calendar" title="Saisonnalité" cls={b.on(2)} size={21} pad={22}>
          Creux en juillet-août (fermeture estivale ?), à comparer avec l’an dernier.
        </Card>
        <Card tone="violet" icon="bolt" title="Pic d’automne" cls={b.on(3)} size={21} pad={22}>
          Septembre à novembre au plus haut : renfort d’accueil à prévoir ?
        </Card>
      </div>
      <div className={b.fade(3)} style={{ position: 'absolute', left: 1240, top: 905, width: 560, fontSize: 21, color: C.muted, lineHeight: 1.4 }}>
        Les « ? » sont voulus : l’IA voit les chiffres, pas les causes.
      </div>
    </Frame>
  );
};

// ─── Nettoyer des données simples ───────────────────────────────────────────
const M6_DIRTY = [
  ['DURAND marie', '06.12.34.56.78', '3/1/25', 'nantes'],
  ['Marie Durand', '0612345678', '03/01/2025', 'Nantes'],
  ['lefèvre Paul ', '+33 6 98 76 54 32', '2025-01-15', ''],
  ['Sophie  MARTIN', '06 11 22 33 44', '15 janv.', 'REZÉ'],
];
const M6_CLEAN = [
  ['Durand', 'Marie', '06 12 34 56 78', '03/01/2025', 'Nantes'],
  ['Lefèvre', 'Paul', '06 98 76 54 32', '15/01/2025', '[À COMPLÉTER]'],
  ['Martin', 'Sophie', '06 11 22 33 44', '15/01/2025 ?', 'Rezé'],
];

const M6_Nettoyer: Page = () => {
  const [clean, setClean] = useState(false);
  const rows = clean ? M6_CLEAN : M6_DIRTY;
  const head = clean ? ['Nom', 'Prénom', 'Téléphone', 'Inscription', 'Ville'] : ['Contact', 'Téléphone', 'Date', 'Ville'];
  const cols = clean ? '1fr 1fr 1.3fr 1.2fr 1.2fr' : '1.4fr 1.3fr 1fr 1fr';
  return (
    <Frame mod={6} kind="demo">
      <Title>Nettoyer des données simples</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={clean} onChange={setClean} tone="green" size={28} label={<strong>« Nettoie cette liste : sépare nom et prénom, harmonise les formats, supprime les doublons, signale les manques »</strong>} />
      </div>
      <div key={clean ? 'c' : 'd'} className={A.fade} style={{ position: 'absolute', left: 120, top: 290, width: 1180, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, background: clean ? C.green : C.muted, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
          {head.map((h) => (
            <span key={h} style={{ padding: '12px 16px' }}>
              {h}
            </span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: `1.5px solid ${C.rule}`, fontSize: 22 }}>
            {r.map((c, j) => (
              <span key={j} style={{ padding: '12px 16px', fontFamily: mono, fontSize: 20, color: c.startsWith('[') || c.endsWith('?') ? C.coral : c === '' ? C.faint : C.ink, whiteSpace: 'pre' }}>
                {c === '' ? '—' : c}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 290, width: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="green" icon="checkCircle" title="Ce qu’elle fait bien" size={21} pad={22} cls={A.right}>
          Majuscules, espaces, formats de téléphone et de date, doublons évidents.
        </Card>
        <Card tone="coral" icon="alert" title="Ce qu’il faut vérifier" size={21} pad={22} cls={A.right} style={dl(150)}>
          « 15 janv. » : quelle année ? Elle a supposé 2025 et l’a signalé. Toujours contrôler les suppositions.
        </Card>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
        <Callout title="Données personnelles" tone="coral" icon="lock" size={22}>
          Une vraie liste de contacts ne se colle pas dans un assistant grand public. Demandez plutôt <strong>la méthode ou les formules</strong> (SUPPRESPACE, NOMPROPRE…) et appliquez-les vous-même dans Excel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Transformer des données en synthèse ────────────────────────────────────
const M6_Synthese: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Transformer des données en synthèse</Title>
    <Lede>« À partir de ce tableau, rédige une synthèse de 5 lignes pour le directeur administratif et financier. Chiffres arrondis, une recommandation. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 300 }}>
      <M6Table w={760} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 940, top: 300, width: 860, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Synthèse · fournitures T3
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        <div className={b.fade(1)}>
          Les dépenses de fournitures du 3e trimestre atteignent <strong>environ 14 900 €</strong>, dont plus de 40 % pour la production.
        </div>
        <div className={b.fade(2)}>
          Septembre concentre 42 % du trimestre, porté par le commercial et surtout les RH (dépense multipliée par quatre).
        </div>
        <div className={b.fade(3)} style={{ background: T.green.bg, borderRadius: 12, padding: '10px 14px' }}>
          <strong style={{ color: T.green.fg }}>Recommandation</strong> : vérifier la dépense RH de septembre et fixer un budget trimestriel par service.
        </div>
      </div>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 940, top: 800, width: 860, fontSize: 21, color: C.muted, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name="eye" size={26} color={C.blue} /> Avant d’envoyer : chaque chiffre de la synthèse se retrouve dans le tableau.
    </div>
  </Frame>
);

// ─── Créer des tableaux structurés (texte → tableau + formule) ──────────────
const M6_Structurer: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Créer des tableaux structurés… et leurs formules</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 760 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        Trois emails d’inscription à la formation sécurité
      </Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 21, lineHeight: 1.45, color: C.soft, fontStyle: 'italic' }}>
        <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>« Je m’inscris pour la session du 4 décembre. Paul, service production. Je serai en fauteuil. »</div>
        <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>« Inscription de Lina Haddad, commerciale, session du 11/12. »</div>
        <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>« Bonjour, Hugo de l’admin, le 4 si possible, sinon le 11. »</div>
      </div>
      <div className={A.fade} style={{ marginTop: 16, ...dl(300) }}>
        <Bubble who="user" w={720} size={20}>
          Range ces inscriptions dans un tableau : nom, prénom, service, session, besoin particulier. Une info absente = « ? ».
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 230, width: 860 }}>
      <div className={b.on(1)} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, overflow: 'hidden', fontSize: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 1fr 1fr 1.3fr', background: C.navy, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 18 }}>
          {['Nom', 'Prénom', 'Service', 'Session', 'Besoin'].map((h) => (
            <span key={h} style={{ padding: '10px 14px' }}>
              {h}
            </span>
          ))}
        </div>
        {[
          ['?', 'Paul', 'Production', '04/12', 'Accès PMR'],
          ['Haddad', 'Lina', 'Commercial', '11/12', '—'],
          ['?', 'Hugo', 'Administration', '04/12 ou 11/12', '—'],
        ].map((r) => (
          <div key={r[1]} style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 1fr 1fr 1.3fr', borderBottom: `1.5px solid ${C.rule}` }}>
            {r.map((c, j) => (
              <span key={j} style={{ padding: '10px 14px', color: c === '?' || c.includes(' ou ') ? C.coral : C.ink, fontWeight: c === '?' ? 700 : 400 }}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={b.on(2)} style={{ marginTop: 22 }}>
        <Bubble who="user" w={820} size={20}>
          Donne-moi la formule Excel qui compte les inscrits par session.
        </Bubble>
      </div>
      <div className={b.on(3)} style={{ marginTop: 14 }}>
        <CodeDark file="formule proposée" size={22}>
          <Cf>=NB.SI</Cf>(D2:D50; <Cs>"04/12"</Cs>)
        </CodeDark>
        <div style={{ marginTop: 10, fontSize: 20, color: C.muted }}>Testez-la sur 3 lignes dont vous connaissez le résultat avant de lui faire confiance.</div>
      </div>
    </div>
  </Frame>
);

// ─── Préparer un reporting ──────────────────────────────────────────────────
const M6Kpi = ({ v, label, delta, tone, d }: { v: ReactNode; label: string; delta: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 24px', ...dl(d) }}>
    <div style={{ fontSize: 20, color: C.muted }}>{label}</div>
    <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 56, lineHeight: 1, color: C.navy }}>{v}</div>
    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: STRONG[tone] }}>{delta}</div>
  </div>
);

const M6_Reporting: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Préparer un reporting mensuel en 15 minutes</Title>
    <Lede>Les chiffres viennent du tableur. L’IA rédige le commentaire, dans un format identique chaque mois.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 22 }}>
      <M6Kpi v={<CountUp to={171} />} label="Demandes reçues · octobre" delta="▲ + 6 % vs septembre" tone="blue" d={100} />
      <M6Kpi v={<CountUp to={94} suffix=" %" />} label="Traitées sous 48 h" delta="▲ + 3 points" tone="green" d={200} />
      <M6Kpi v={<CountUp to={12} />} label="Réclamations" delta="▼ − 4 vs septembre" tone="green" d={300} />
      <M6Kpi v={<CountUp to={2.4} digits={1} suffix=" j" />} label="Délai moyen de réponse" delta="▲ + 0,3 jour" tone="coral" d={400} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 500, width: 820 }}>
      <CodeDark file="prompt · reporting mensuel (modèle)" size={20} wrap>
        Voici les indicateurs de <Cn>[MOIS]</Cn> et du mois précédent : <Cn>[INDICATEURS]</Cn>.{'\n'}
        Rédige le commentaire du reporting : 3 faits marquants, 1 point de vigilance, 1 action proposée. 100 mots. N’utilise que ces chiffres ; ne recalcule rien.
      </CodeDark>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 980, top: 500, width: 820, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 22, lineHeight: 1.5, color: C.ink }}>
      <Eyebrow c={C.navy} size={18}>
        Commentaire généré
      </Eyebrow>
      <div style={{ marginTop: 8 }}>
        Octobre confirme le pic d’automne (171 demandes, + 6 %), avec un meilleur taux de traitement sous 48 h (94 %) et moins de réclamations (12).{' '}
        <strong style={{ color: C.coral }}>Vigilance</strong> : le délai moyen remonte à 2,4 jours. <strong style={{ color: C.green }}>Action</strong> : renfort d’accueil le lundi matin en novembre.
      </div>
    </div>
  </Frame>
);

// ─── Quiz M6 ────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz : tableaux et données</Title>
    <QuizSeries y={220}>
      <QuizQ q="L’IA annonce un total de 14 980 €. Que faites-vous ?" explain="L’IA peut se tromper en additionnant. Le total se vérifie avec une formule (SOMME) dans le tableur, qui fait foi.">
        <QOpt>Je le reporte tel quel</QOpt>
        <QOpt ok>Je le vérifie avec une formule SOMME</QOpt>
        <QOpt>Je lui demande si elle est sûre</QOpt>
      </QuizQ>
      <QuizQ q="« Les demandes baissent en août à cause des congés. » Comment présenter cette phrase ?" explain="L’IA voit les chiffres, pas les causes. Une explication proposée par l’IA reste une hypothèse à confirmer.">
        <QOpt>Comme un fait établi</QOpt>
        <QOpt ok>Comme une hypothèse à vérifier</QOpt>
        <QOpt>Il faut la supprimer</QOpt>
      </QuizQ>
      <QuizQ q="Vous devez nettoyer un fichier de 2 000 contacts clients réels. Le bon réflexe ?" explain="Des données personnelles réelles ne vont pas dans un assistant non autorisé. On demande la méthode et les formules, puis on les applique soi-même dans le tableur.">
        <QOpt>Coller tout le fichier dans l’IA</QOpt>
        <QOpt ok>Demander la méthode et les formules, puis les appliquer dans Excel</QOpt>
        <QOpt>Envoyer le fichier par email à l’IA</QOpt>
      </QuizQ>
      <QuizQ q="Dans un prompt de reporting, pourquoi écrire « ne recalcule rien » ?" explain="On veut que l’IA commente les chiffres du tableur, pas qu’elle en produise de nouveaux, potentiellement faux.">
        <QOpt>Pour aller plus vite</QOpt>
        <QOpt ok>Pour qu’elle n’utilise que les chiffres fournis</QOpt>
        <QOpt>Parce qu’elle ne sait pas compter du tout</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_Analyser, M6_Tendances, M6_Nettoyer, M6_Synthese, M6_Structurer, M6_Reporting, M6_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 6 · 15:20

OBJECTIF — Annoncer le module données, souvent redouté, et le dédramatiser.

DIRE — « Module 6 : les tableaux et les données. Pas besoin d’être expert d’Excel. L’IA est très utile pour commenter un tableau, repérer des tendances, nettoyer une liste, structurer des informations, rédiger un reporting. Une règle à retenir pour tout le module : l’IA commente, le tableur calcule. »

TRANSITION — « Premier exemple : analyser un tableau. »`,
  `⏱ 5 min · ANALYSER UN TABLEAU (4 clics)

OBJECTIF — Montrer la valeur de l’analyse… et le risque de calcul.

DIRE — « Un tableau de dépenses de fournitures. On demande une analyse en quatre points. » Clic 1 : « Septembre en forte hausse : c’est juste, + 48 %. » Clic 2 : « Les RH ont quadruplé leur dépense : bien vu, et l’IA présente l’explication comme une hypothèse. » Clic 3 : « La production pèse 42 % : juste. » Clic 4 : « Et le total : 14 980 euros. Faux. Le tableur dit 14 880. L’IA a mal additionné, avec le même aplomb que pour le reste. »

INSISTER — L’IA repère très bien ce qui est inhabituel. Les calculs, eux, se font dans le tableur.

TRANSITION — « Sur une année entière, on peut chercher des tendances. »`,
  `⏱ 4 min · TENDANCES (3 clics)

OBJECTIF — Distinguer évolution, saisonnalité et hypothèse.

DIRE — « Douze mois de demandes reçues à l’accueil. La demande est précise : distingue saisonnalité et évolution, et présente toute explication comme une hypothèse. » Clics : « Une hausse régulière au premier semestre. Un creux en été, peut-être la fermeture estivale : à comparer avec l’an dernier. Un pic à l’automne : faut-il un renfort ? »

INSISTER — Les points d’interrogation sont voulus : l’IA voit les chiffres, pas les causes. Les causes, c’est vous qui les connaissez.

TRANSITION — « Avant d’analyser, il faut souvent nettoyer. »`,
  `⏱ 4 min · NETTOYER (interrupteur)

OBJECTIF — Montrer le nettoyage d’une liste et ses limites.

DIRE — « Une liste de contacts typique : majuscules au hasard, téléphones dans tous les formats, dates de trois façons, un doublon, une ville manquante. » Basculer. « Nom et prénom séparés, formats harmonisés, doublon supprimé, manque signalé. Mais regardez “15 janvier” : l’IA a supposé 2025 et l’a signalé. Il faut contrôler chaque supposition. »

INSISTER — L’encadré rouge : une vraie liste de contacts contient des données personnelles. Avec un outil non autorisé, on demande la méthode et les formules, on n’envoie pas les données.

TRANSITION — « Une fois les données propres, on peut les raconter. »`,
  `⏱ 3 min · SYNTHÈSE (3 clics)

OBJECTIF — Transformer un tableau en texte pour un décideur.

DIRE — « Même tableau, autre demande : cinq lignes pour le directeur financier, chiffres arrondis, une recommandation. » Clics : « Le total arrondi, la répartition, le mois de septembre, et une recommandation concrète. Avant d’envoyer : chaque chiffre de la synthèse doit se retrouver dans le tableau. »

TRANSITION — « L’IA peut aussi faire l’inverse : transformer du texte en tableau. »`,
  `⏱ 4 min · TABLEAUX STRUCTURÉS ET FORMULES (3 clics)

OBJECTIF — Montrer la structuration d’informations éparses et l’aide aux formules.

DIRE — « Trois emails d’inscription, rédigés chacun à sa manière. On demande un tableau avec des colonnes imposées, et un point d’interrogation quand l’info manque. » Clic 1 : « Le tableau : les noms manquants et la session hésitante d’Hugo sont signalés. Le fauteuil est devenu un besoin d’accès PMR. » Clic 2 et 3 : « Et l’IA peut écrire la formule Excel dont vous avez besoin. NB.SI compte les inscrits par session. »

INSISTER — Une formule se teste sur quelques lignes dont on connaît le résultat avant de lui faire confiance.

TRANSITION — « Dernier usage : le reporting mensuel. »`,
  `⏱ 4 min · REPORTING (2 clics)

OBJECTIF — Montrer un reporting régulier : chiffres du tableur, commentaire de l’IA, modèle réutilisable.

DIRE — « Quatre indicateurs du mois, calculés dans le tableur. » Clic 1 : « Le prompt modèle : trois faits marquants, un point de vigilance, une action. Et deux consignes clés : n’utilise que ces chiffres, ne recalcule rien. » Clic 2 : « Le commentaire obtenu. Chaque mois, même format : votre directeur sait où regarder. Quinze minutes au lieu d’une heure. »

TRANSITION — « Quiz, puis le grand final de la journée. »`,
  `⏱ 3 min · QUIZ M6 (4 questions)

OBJECTIF — Ancrer la règle « l’IA commente, le tableur calcule » et le réflexe données personnelles.

DIRE — « Quatre questions. »

ANIMATION — Cliquer les réponses majoritaires, lire les explications. La question 3 fait le lien avec le module final sur la confidentialité.

TRANSITION — « Vous avez tous les outils. Place au cas fil rouge, qui reprend toute la journée. »`,
];
// @@NOTES-END
