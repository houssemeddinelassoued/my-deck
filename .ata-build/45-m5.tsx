// ═══ Module 5 · Automatiser avec l’IA ═══════════════════════════════════════

const M5_Section: Page = () => (
  <Section n={5} title="Automatiser avec l’IA" sub="Lire, classer, extraire, rédiger : l’IA devient une étape du workflow." dur="55 min">
    <SecItem n={1}>Analyse de documents, OCR, classification</SecItem>
    <SecItem n={2}>Réponses automatiques par IA</SecItem>
    <SecItem n={3}>Agents IA (ex. : Copilot) et prompts de workflow</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── What AI adds: unstructured → structured ────────────────────────────────
const M5_Apport: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Ce que l’IA ajoute : du texte libre aux données rangées</Title>
    <Lede>Une règle a besoin de champs. L’IA sait les fabriquer à partir d’un message écrit librement.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 300, width: 640 }}>
      <AppWin id="gmail" title="Boîte de réception">
        <div style={{ fontSize: 20, color: C.muted }}>De : Louis Bérubé · objet : petit souci</div>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.5, color: C.ink }}>
          Bonjour, j’ai commandé deux étagères la semaine passée (commande 88213) et une des deux est arrivée avec une tablette brisée. Pas très content, c’était un cadeau pour Noël… Vous pouvez m’en renvoyer une rapidement ?
        </div>
      </AppWin>
    </div>
    <div className={b.pop(1)} style={{ position: 'absolute', left: 820, top: 440, width: 200, textAlign: 'center' }}>
      <IconTile name="sparkles" tone="violet" size={120} solid style={{ margin: '0 auto', borderRadius: 999 }} />
      <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 28, color: T.violet.fg }}>ÉTAPE IA</div>
    </div>
    <Code cls={b.on(2)} title="Sortie structurée" size={25} style={{ position: 'absolute', left: 1080, top: 300, width: 720 }}>
      {'{\n'}
      {'  '}<Jk>"categorie"</Jk>: <Js>"produit endommagé"</Js>,{'\n'}
      {'  '}<Jk>"commande"</Jk>: <Js>"88213"</Js>,{'\n'}
      {'  '}<Jk>"produit"</Jk>: <Js>"étagère"</Js>,{'\n'}
      {'  '}<Jk>"demande"</Jk>: <Js>"remplacement"</Js>,{'\n'}
      {'  '}<Jk>"priorite"</Jk>: <Js>"haute"</Js>,{'\n'}
      {'  '}<Jk>"ton"</Jk>: <Js>"mécontent"</Js>,{'\n'}
      {'  '}<Jk>"confiance"</Jk>: <Jn>0.93</Jn>{'\n'}
      {'}'}
    </Code>
    <Hint cls={b.fade(2)} style={{ position: 'absolute', left: 1080, top: 760 }}>
      Ces champs, une règle sait ensuite les router : c’est la combinaison gagnante.
    </Hint>
  </Frame>
);

// ─── Six operations ─────────────────────────────────────────────────────────
const M5_OPS: { icon: IconName; tone: Tone; t: string; ex: string }[] = [
  { icon: 'filter', tone: 'blue', t: 'Classer', ex: 'Ce courriel : plainte, question, commande ou facture ?' },
  { icon: 'scan', tone: 'teal', t: 'Extraire', ex: 'Nom, montant, date et numéro, dans une facture ou un courriel' },
  { icon: 'doc', tone: 'green', t: 'Résumer', ex: 'Un compte rendu de 3 pages en 5 lignes et 3 actions' },
  { icon: 'send', tone: 'violet', t: 'Rédiger', ex: 'Une réponse de premier niveau, à relire avant envoi' },
  { icon: 'globe', tone: 'yellow', t: 'Traduire', ex: 'Une demande reçue en anglais, traitée en français' },
  { icon: 'smile', tone: 'coral', t: 'Analyser le ton', ex: 'Client irrité ? Priorité relevée, gestionnaire averti' },
];

const M5_Ops: Page = () => (
  <Frame mod={5}>
    <Title>Six opérations qu’une étape IA sait faire</Title>
    <Lede>Dans un workflow, l’IA ne « discute » pas : elle fait une seule opération, précise, et rend un résultat exploitable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      {M5_OPS.map((o, i) => (
        <Card key={o.t} tone={o.tone} icon={o.icon} title={o.t} size={25} cls={A.in} style={{ height: 270, ...dl(100 + i * 90) }}>
          {o.ex}
        </Card>
      ))}
    </div>
  </Frame>
);

// ─── Document analysis / OCR ────────────────────────────────────────────────
const M5_Ocr: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Analyser un document : OCR puis extraction</Title>
    <Lede>L’OCR (reconnaissance optique de caractères) transforme une image en texte. L’IA comprend ensuite ce texte.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 300, width: 470, height: 560, boxSizing: 'border-box', background: '#FBFAF6', borderRadius: 6, boxShadow: SHADOW, padding: '34px 34px', transform: 'rotate(-1.5deg)', fontFamily: mono, fontSize: 20, lineHeight: 1.6, color: '#3B3B3B' }}>
      <div style={{ fontWeight: 700, fontSize: 24 }}>QUINCAILLERIE BEAUDRY</div>
      <div>1420, rue Principale, Granby</div>
      <div style={{ marginTop: 16 }}>Facture n° 7734 · 2026-11-03</div>
      <div style={{ marginTop: 16, borderTop: '2px dashed #bbb', paddingTop: 10 }}>Vis 3 po (500) ...... 42,90</div>
      <div>Planches 2x4 (24) .... 187,20</div>
      <div>Livraison ............ 35,00</div>
      <div style={{ marginTop: 10, borderTop: '2px dashed #bbb', paddingTop: 10 }}>TPS ................. 13,26</div>
      <div>TVQ ................. 26,45</div>
      <div style={{ fontWeight: 700 }}>TOTAL .............. 304,81 $</div>
      <div style={{ marginTop: 14 }}>Payable sous 30 jours</div>
      <Tag tone="grey" size={18} style={{ position: 'absolute', right: 20, bottom: 18 }}>
        <Icon name="image" size={18} /> photo du reçu
      </Tag>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 660, top: 330, width: 520 }}>
      <Eyebrow c={T.teal.fg}>1 · OCR : du texte brut</Eyebrow>
      <Code size={19} style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        QUINCAILLERIE BEAUDRY 1420, rue Principale, Granby Facture n° 7734 · 2026-11-03 Vis 3 po (500) ...... 42,90 Planches 2x4 (24) .... 187,20 Livraison 35,00 TPS 13,26 TVQ 26,45 TOTAL 304,81 $ Payable sous 30 jours
      </Code>
      <div style={{ marginTop: 12, fontSize: 21, color: C.muted }}>Lisible par une machine… mais pas encore rangé.</div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1250, top: 330, width: 550 }}>
      <Eyebrow c={T.violet.fg}>2 · IA : des champs</Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Fournisseur', 'Quincaillerie Beaudry'],
          ['N° de facture', '7734'],
          ['Date', '2026-11-03'],
          ['Total TTC', '304,81 $'],
          ['Taxes', 'TPS 13,26 · TVQ 26,45'],
          ['Échéance', '2026-12-03'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 16px', fontSize: 22 }}>
            <span style={{ color: C.muted }}>{k}</span>
            <b style={{ color: C.ink }}>{v}</b>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 21, color: T.coral.fg, fontWeight: 600 }}>L’échéance est calculée : à vérifier !</div>
    </div>
  </Frame>
);

// ─── Classification (interactive) ───────────────────────────────────────────
const M5_MSGS = [
  { who: 'Mme Gauthier', txt: 'Ma commande 4521 devait arriver lundi, toujours rien. C’est la deuxième fois. Je veux une réponse aujourd’hui.', cat: 'Livraison en retard', prio: 'Haute', ton: 'Irritée', conf: 0.94, why: 'Retard, récidive, exige une réponse le jour même' },
  { who: 'M. Nguyen', txt: 'Avez-vous la table Nordik en chêne clair ? Merci !', cat: 'Question produit', prio: 'Normale', ton: 'Neutre', conf: 0.97, why: 'Question simple sur la disponibilité' },
  { who: 'Mme Roy', txt: 'Le pied de la chaise est arrivé fendu, photo jointe. Échange ou remboursement ?', cat: 'Produit endommagé', prio: 'Haute', ton: 'Déçue', conf: 0.91, why: 'Dommage à la livraison, demande de solution' },
  { who: 'Atelier Lumen', txt: 'Je suis designer et j’aimerais discuter d’une collaboration avec votre marque.', cat: 'Autre', prio: 'Normale', ton: 'Positif', conf: 0.58, why: 'Ne correspond à aucune catégorie prévue' },
];

const M5_Classif: Page = () => {
  const [i, setI] = useState(0);
  const m = M5_MSGS[i];
  const low = m.conf < 0.75;
  return (
    <Frame mod={5} kind="demo">
      <Title>Classer une demande : catégorie, priorité, ton</Title>
      <div style={{ position: 'absolute', left: 120, top: 186 }}>
        <CasTag>Fabricant de meubles en ligne · 400 messages par semaine</CasTag>
      </div>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 260, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {M5_MSGS.map((x, j) => (
          <button
            key={x.who}
            type="button"
            data-osd-interactive
            onClick={(e) => {
              e.currentTarget.blur();
              setI(j);
            }}
            style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 14, padding: '16px 20px', fontFamily: body, background: j === i ? T.blue.bg : C.card, boxShadow: j === i ? `inset 0 0 0 3px ${C.blue}` : SHADOW_SM }}
          >
            <IconTile name="mail" tone="blue" size={46} />
            <span>
              <span style={{ display: 'block', fontSize: 19, color: C.muted }}>{x.who}</span>
              <span style={{ display: 'block', fontSize: 23, lineHeight: 1.4, color: C.ink }}>{x.txt}</span>
            </span>
          </button>
        ))}
      </div>
      <div key={i} className={A.in} style={{ position: 'absolute', left: 1010, top: 260, width: 790, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', animationDuration: '450ms' } as CSSProperties}>
        <Eyebrow c={T.violet.fg}>Résultat de l’étape IA</Eyebrow>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Catégorie', m.cat],
            ['Priorité', m.prio],
            ['Ton', m.ton],
            ['Confiance', fr(m.conf, 2)],
          ].map(([k, v]) => (
            <div key={k} style={{ background: C.panel, borderRadius: 12, padding: '12px 18px' }}>
              <div style={{ fontSize: 19, color: C.muted }}>{k}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: k === 'Confiance' && low ? C.coral : C.ink }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.4, color: C.soft }}>
          <b>Justification :</b> {m.why}
        </div>
        <Callout
          title={low ? 'Sous le seuil de 0,75' : 'Au-dessus du seuil'}
          tone={low ? 'coral' : 'green'}
          icon={low ? 'humanCheck' : 'route'}
          size={23}
          style={{ marginTop: 18 }}
        >
          {low ? 'Pas de routage automatique : le message va dans la file « à vérifier » d’un humain.' : 'Routage automatique vers la bonne file, avec la priorité indiquée.'}
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Extraction to JSON ─────────────────────────────────────────────────────
const M5_Extraction: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Extraire des informations, champ par champ</Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Entreprise de déménagement · demandes de soumission</CasTag>
    </div>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 260, width: 760 }}>
      <AppWin id="outlook" title="Demande de prix">
        <div style={{ fontSize: 25, lineHeight: 1.55, color: C.ink }}>
          Bonjour, nous déménageons de <Hl>Laval</Hl> à <Hl>Sherbrooke</Hl> le <Hl>12 décembre</Hl>. C’est un <Hl>4 1/2 au 2e étage sans ascenseur</Hl>, avec un <Hl>piano</Hl>. Pouvez-vous m’envoyer un prix ?
          <br />
          <Hl>Julie Martin</Hl>, <Hl>514 555-0182</Hl>
        </div>
      </AppWin>
      <Callout title="Le prompt demande" tone="violet" icon="chat" size={22} style={{ marginTop: 24 }}>
        Extrais client, téléphone, départ, arrivée, date (AAAA-MM-JJ), logement, objets spéciaux. Liste ce qui manque. Réponds en JSON, sans texte autour.
      </Callout>
    </div>
    <Code cls={b.on(1)} title="Réponse de l’IA" size={23} style={{ position: 'absolute', left: 960, top: 260, width: 840 }}>
      {'{\n'}
      {'  '}<Jk>"client"</Jk>: <Js>"Julie Martin"</Js>,{'\n'}
      {'  '}<Jk>"telephone"</Jk>: <Js>"514 555-0182"</Js>,{'\n'}
      {'  '}<Jk>"depart"</Jk>: <Js>"Laval"</Js>,{'\n'}
      {'  '}<Jk>"arrivee"</Jk>: <Js>"Sherbrooke"</Js>,{'\n'}
      {'  '}<Jk>"date"</Jk>: <Js>"2026-12-12"</Js>,{'\n'}
      {'  '}<Jk>"logement"</Jk>: <Js>"4 1/2, 2e étage, sans ascenseur"</Js>,{'\n'}
      {'  '}<Jk>"objets_speciaux"</Jk>: [<Js>"piano"</Js>],{'\n'}
      {'  '}<Jk>"manquant"</Jk>: [<Js>"courriel"</Js>, <Js>"adresse exacte"</Js>]{'\n'}
      {'}'}
    </Code>
    <div className={b.on(2)} style={{ position: 'absolute', left: 960, top: 710, width: 840, display: 'flex', gap: 18 }}>
      <Callout title="L’année ?" tone="yellow" icon="alert" size={22} style={{ flex: 1 }}>
        L’IA a déduit 2026 : une hypothèse à contrôler.
      </Callout>
      <Callout title="Ce qui manque" tone="green" icon="check" size={22} style={{ flex: 1 }}>
        Le workflow peut redemander le courriel automatiquement.
      </Callout>
    </div>
    <Hint cls={b.fade(3)} style={{ position: 'absolute', left: 960, top: 890 }}>
      Un JSON se lit par la plateforme : chaque champ devient une variable du workflow.
    </Hint>
  </Frame>
);

// ─── Automatic replies: three levels of risk ────────────────────────────────
const M5Lvl = ({ n, tone, icon, title, risk, ex, beat }: { n: number; tone: Tone; icon: IconName; title: string; risk: string; ex: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 300px', alignItems: 'center', gap: 24, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[tone]}`, padding: '22px 28px' }}>
    <IconTile name={icon} tone={tone} size={80} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>
        {n} · {title}
      </div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
    <Tag tone={tone} size={21} style={{ justifySelf: 'end' }}>
      Risque {risk}
    </Tag>
  </div>
);

const M5_Reponses: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Réponses automatiques : trois niveaux d’audace</Title>
    <Lede>Plus la réponse part seule, plus il faut de garde-fous. On commence toujours au niveau 2.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M5Lvl beat={1} n={1} tone="green" icon="check" title="Accusé de réception" risk="faible" ex="Message type, numéro de dossier, délai annoncé. Pas d’IA nécessaire." />
      <M5Lvl beat={2} n={2} tone="blue" icon="humanCheck" title="Brouillon rédigé par l’IA, relu par un humain" risk="maîtrisé" ex="L’IA prépare la réponse à partir de vos documents ; une personne valide, corrige, envoie." />
      <M5Lvl beat={3} n={3} tone="coral" icon="bolt" title="Envoi automatique de la réponse IA" risk="élevé" ex="Seulement pour des questions simples, sur une base de réponses validées, avec un seuil de confiance et un suivi." />
    </div>
    <Callout cls={b.on(4)} title="Ce qui ne part jamais seul" tone="coral" icon="alert" style={{ position: 'absolute', left: 120, top: 820, width: 1680 }}>
      Un engagement (prix, délai, remboursement), un sujet juridique ou médical, un client irrité : toujours un humain.
    </Callout>
  </Frame>
);

// ─── Agents ─────────────────────────────────────────────────────────────────
const M5_Agents: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Assistant, workflow avec IA, agent : qui décide des étapes ?</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      {(
        [
          ['chat', 'blue', 'Assistant IA', 'Vous', 'Vous posez une question, il répond. Vous copiez, collez, agissez.', 'Copilot Chat, Gemini, ChatGPT', 'Très prévisible'],
          ['route', 'violet', 'Workflow avec IA', 'Vous, à l’avance', 'Les étapes sont fixées ; l’IA fait une seule opération dans le circuit.', 'Make + Gemini, Power Automate + IA', 'Prévisible et contrôlable'],
          ['brain', 'coral', 'Agent IA', 'L’IA elle-même', 'On lui donne un objectif et des outils ; elle choisit ses étapes et les enchaîne.', 'Agents Copilot, Gems Gemini, agents ChatGPT, agents Make', 'Puissant, moins prévisible'],
        ] as [IconName, Tone, string, string, string, string, string][]
      ).map(([ic, tone, t, who, d, ex, pred], i) => (
        <div key={t} className={b.on(i + 1)} style={{ height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '30px 30px', display: 'flex', flexDirection: 'column' }}>
          <IconTile name={ic} tone={tone} size={80} solid />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>{t}</div>
          <div style={{ marginTop: 6, fontSize: 23, color: T[tone].fg, fontWeight: 700 }}>Qui décide des étapes : {who}</div>
          <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{d}</div>
          <div style={{ marginTop: 'auto', fontSize: 21, lineHeight: 1.4, color: C.muted }}>Ex. : {ex}</div>
          <Tag tone={tone} size={20} style={{ marginTop: 14, alignSelf: 'flex-start' }}>
            {pred}
          </Tag>
        </div>
      ))}
    </div>
    <Verified style={{ position: 'absolute', left: 120, top: 860 }}>Noms d’offres vérifiés en novembre 2026 : ils évoluent vite, revérifiez avant chaque session.</Verified>
  </Frame>
);

// ─── Workflow prompt anatomy ────────────────────────────────────────────────
const M5Lbl = ({ beat, y, tone, children }: { beat: number; y: number; tone: Tone; children: ReactNode }) => (
  <div className={b.left(beat)} style={{ position: 'absolute', left: 1330, top: y, width: 470, display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ width: 16, height: 16, background: STRONG[tone], flex: 'none' }} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M5_Prompt: Page = () => {
  const L = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
    <div style={{ borderLeft: `6px solid ${STRONG[tone]}`, paddingLeft: 14, marginBottom: 10 }}>{children}</div>
  );
  return (
    <Frame mod={5} beats={6}>
      <Title>Le prompt de workflow : écrit une fois, exécuté mille fois</Title>
      <Lede>Personne ne le relit avant chaque exécution : il doit être précis, fermé, et prévoir le doute.</Lede>
      <Code cls={A.in} size={22} style={{ position: 'absolute', left: 120, top: 290, width: 1160, whiteSpace: 'pre-wrap' }}>
        <L tone="blue">Tu es l’assistant du service client d’un fabricant de meubles.</L>
        <L tone="teal">Classe le message ci-dessous dans UNE catégorie.</L>
        <L tone="green">Catégories autorisées : livraison, produit endommagé, question produit, facturation, autre.</L>
        <L tone="violet">
          Réponds uniquement en JSON : {'{'}"categorie": "...", "priorite": "haute|normale", "confiance": 0 à 1{'}'}
        </L>
        <L tone="coral">Si tu hésites, mets "autre" et une confiance inférieure à 0,5. N’invente rien.</L>
        <L tone="yellow">Message : {'{{'}Message{'}}'}</L>
      </Code>
      <M5Lbl beat={1} y={300} tone="blue">Un rôle et un contexte</M5Lbl>
      <M5Lbl beat={2} y={370} tone="teal">Une seule tâche</M5Lbl>
      <M5Lbl beat={3} y={440} tone="green">Une liste fermée de choix</M5Lbl>
      <M5Lbl beat={4} y={530} tone="violet">Un format de sortie imposé, lisible par la machine</M5Lbl>
      <M5Lbl beat={5} y={630} tone="coral">Que faire en cas de doute</M5Lbl>
      <M5Lbl beat={6} y={720} tone="yellow">La donnée, insérée par la plateforme (variable)</M5Lbl>
    </Frame>
  );
};

// ─── Exercise: classify six e-mails ─────────────────────────────────────────
const M5_Exercice: Page = () => (
  <AtelierPage
    mod={5}
    kind="exercice"
    n="Exercice 3"
    title="Classer six messages avec votre IA"
    timerId="m5-classif"
    minutes={15}
    tools="Copilot, Gemini ou ChatGPT (compte gratuit) · les six messages fictifs collés dans le Chat"
    objective="Tester un prompt de workflow sur six messages et repérer où l’IA hésite ou se trompe."
    deliver={
      <>
        Un tableau de 6 lignes : <b>message · catégorie · priorité · confiance · juste ou faux</b>, et une version améliorée de votre prompt.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Une réponse en JSON pour chaque message</CheckItem>
        <CheckItem id="b" size={22}>Au moins une erreur ou une hésitation repérée</CheckItem>
        <CheckItem id="c" size={22}>Le prompt corrigé et retesté</CheckItem>
      </>
    }
  >
    <Do n={1}>Copiez le prompt de la page précédente (collé dans le Chat) dans votre assistant IA.</Do>
    <Do n={2}>Testez-le sur chacun des six messages, un par un. Notez les résultats.</Do>
    <Do n={3}>Comparez avec ce que vous auriez répondu. Où l’IA hésite-t-elle ? Pourquoi ?</Do>
    <Do n={4}>Améliorez le prompt (catégorie mieux définie, exemple ajouté) et retestez le message le plus difficile.</Do>
    <Bonus>Adaptez le prompt à votre tâche réelle : quelles catégories, quel format ? Notez-le dans votre carnet.</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="L’étape IA bien encadrée"
    q="Votre étape IA classe les plaintes. Pour un message ambigu, que doit faire le workflow ?"
    explain="L’IA peut se tromper avec assurance : on lui demande un indice de confiance, on fixe un seuil, et sous ce seuil un humain tranche. Le flux reste automatique pour la majorité des cas."
  >
    <Opt why="Piège ! L’IA choisira quelque chose, avec aplomb. Le message risque d’atterrir dans la mauvaise file, sans que personne le sache.">
      Laisser l’IA choisir la catégorie la plus probable et continuer
    </Opt>
    <Opt ok why="Exact : confiance sous le seuil → file « à vérifier ». C’est le principe de la validation humaine ciblée.">
      Envoyer le message dans une file « à vérifier » quand la confiance est basse
    </Opt>
    <Opt why="Piège ! On perd tout le gain sur les 90 % de messages clairs.">
      Faire relire tous les messages par un humain
    </Opt>
    <Opt why="Piège ! Relancer la même question donne souvent une autre réponse : ce n’est pas un contrôle.">
      Reposer la question à l’IA jusqu’à obtenir une réponse sûre
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M5_Synthese: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={
      <>
        Écrivez le <b>prompt de workflow</b> de votre tâche : rôle, tâche, choix fermés, format JSON, cas de doute. Testez-le sur 5 exemples fictifs.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      L’IA transforme le <b>texte libre en champs</b> que les règles savent router.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Documents : <b>OCR</b> pour lire, IA pour comprendre, humain pour vérifier ce qui est déduit.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Réponses : on commence par le <b>brouillon relu</b>, jamais par l’envoi automatique.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      Un prompt de workflow : <b>fermé</b>, en JSON, avec un <b>seuil de confiance</b>.
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Apport, M5_Ops, M5_Ocr, M5_Classif, M5_Extraction, M5_Reponses, M5_Agents, M5_Prompt, M5_Exercice, M5_Qcm, M5_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 5 (55 min)

DIRE — « Dernier module du jour : l'IA dans l'automatisation. Pas l'IA qui discute avec vous : l'IA comme une étape du circuit, qui lit, classe, extrait ou rédige. »

TRANSITION — « Ce qu'elle ajoute, en une image. »`,
  `⏱ 4 min

OBJECTIF — Montrer la transformation centrale : texte libre → données structurées.

DIRE — Lisez le courriel de Louis : « Une règle ne peut rien en faire : pas de champ, pas de mot-clé fiable. »
→ beat 1 — L'étape IA.
→ beat 2 — La sortie : catégorie, commande, produit, demande, priorité, ton, confiance. « Ce format s'appelle JSON : des paires nom-valeur que la plateforme lit sans effort. »

MESSAGE — « L'IA fabrique les champs, les règles font le routage. C'est la combinaison gagnante. »

TRANSITION — « Six opérations possibles. »`,
  `⏱ 3 min

OBJECTIF — Inventorier ce qu'une étape IA sait faire.

DIRE — Parcourez les cartes. « Une étape IA ne fait qu'une chose à la fois : plus la tâche est précise, plus le résultat est fiable. Si vous voulez classer ET résumer, faites deux étapes. »

INTERACTION — « Laquelle de ces six opérations servirait votre tâche ? » Deux ou trois réponses.

TRANSITION — « Et quand l'entrée est un document papier ? »`,
  `⏱ 5 min

OBJECTIF — Expliquer la chaîne OCR + IA (programme : analyse de documents, OCR).

DIRE — « Un reçu de quincaillerie, photographié. »
→ beat 1 — L'OCR : « La machine reconnaît les caractères. On obtient du texte brut, dans le désordre. »
→ beat 2 — L'IA : « Elle comprend que 304,81 est le total, que 7734 est le numéro de facture. »

INSISTER — L'échéance : « Elle n'est pas écrite, l'IA l'a calculée (30 jours). Tout ce qui est déduit doit être vérifié. Et une photo floue donne un OCR faux. »

OUTILS — Les assistants gratuits (Copilot, Gemini, ChatGPT) lisent une photo directement. Dans Make, les modules IA acceptent souvent une image ou un PDF.

TRANSITION — « La classification, en démonstration. »`,
  `⏱ 6 min · DÉMO INTERACTIVE

OBJECTIF — Montrer une classification avec seuil de confiance.

ANIMATION — Cliquez les messages un à un.
• Mme Gauthier : livraison, haute, irritée, 0,94.
• M. Nguyen : question produit, normale.
• Mme Roy : produit endommagé, haute.
• Atelier Lumen : « autre », 0,58 → sous le seuil, file « à vérifier ».

MESSAGE — « Le seuil de 0,75 est un choix métier. Trop haut : un humain revoit tout. Trop bas : des erreurs passent. On l'ajuste avec les tests du module 10. »

NUANCE — La « confiance » donnée par un modèle de langage est une auto-évaluation, pas une probabilité rigoureuse. Elle reste utile comme signal d'alerte.

TRANSITION — « L'extraction, maintenant. »`,
  `⏱ 4 min

OBJECTIF — Montrer une extraction structurée et ses pièges.

DIRE — Lisez la demande : les passages surlignés sont ce que l'IA doit trouver.
→ beat 1 — La réponse JSON.
→ beat 2 — Deux remarques : l'année est déduite ; la liste « manquant » permet de redemander automatiquement le courriel.
→ beat 3 — « Chaque champ devient une variable du workflow : on l'écrit dans Sheets, on s'en sert dans un courriel. »

TRANSITION — « L'IA peut aussi répondre. Jusqu'où ? »`,
  `⏱ 4 min

OBJECTIF — Graduer l'automatisation des réponses (programme : réponses automatiques par IA).

DIRE — Révélez les niveaux (→ beats 1 à 3).
1. Accusé de réception : « Aucun risque, et déjà très apprécié. »
2. Brouillon relu : « Notre recommandation : l'IA fait 80 % du travail, l'humain garde la responsabilité. »
3. Envoi automatique : « Pour les questions simples et fréquentes, sur une base de réponses validées, avec un seuil et un suivi. »
→ beat 4 — Ce qui ne part jamais seul.

EXEMPLE — Le cas Air Canada (2024) : un agent conversationnel a promis un remboursement qui n'existait pas ; l'entreprise a été tenue responsable. « L'IA parle en votre nom. »

TRANSITION — « Et les agents IA, dont on parle tant ? »`,
  `⏱ 5 min · PAGE PÉRISSABLE

OBJECTIF — Situer les agents IA (programme : agents IA, ex. Copilot).

DIRE — Révélez les colonnes (→ beats 1 à 3). La question clé : « Qui décide des étapes ? »
• Assistant : vous. Copilot Chat, Gemini, ChatGPT.
• Workflow avec IA : vous, à l'avance. « C'est ce qu'on construit demain. »
• Agent : l'IA elle-même. « Vous lui donnez un objectif et des outils (lire les courriels, consulter le CRM, écrire un brouillon) ; elle enchaîne. Microsoft propose des agents dans Copilot, Google des Gems, OpenAI des agents dans ChatGPT, Make ses propres agents. »

MESSAGE — « Plus d'autonomie, moins de prévisibilité. Pour un processus métier répétitif, le workflow avec IA reste le plus sûr aujourd'hui. »

AVANT CHAQUE SESSION — Revérifiez les noms et la disponibilité des offres d'agents.

TRANSITION — « Comment écrire l'instruction de l'étape IA ? »`,
  `⏱ 5 min

OBJECTIF — Donner l'anatomie d'un prompt de workflow.

DIRE — « Un prompt de conversation, vous le corrigez en direct. Un prompt de workflow tourne mille fois sans vous. » Révélez (→ beats 1 à 6) : rôle, tâche unique, choix fermés, format JSON, cas de doute, variable.

INSISTER — Les choix fermés : « Sans liste, l'IA invente des catégories : “livraison tardive”, “retard de livraison”, “problème de livraison”… trois noms pour une même file. »

LOGISTIQUE — Collez ce prompt dans le Chat pour l'exercice suivant, avec les six messages fictifs :
1. « Bonjour, la facture 2231 compte deux fois les frais de livraison. »
2. « Mon canapé devait arriver hier entre 8 h et 12 h. Personne. Je suis en congé pour rien. »
3. « Le tissu du fauteuil Alba existe-t-il en vert ? »
4. « La porte de l'armoire est arrivée rayée, mais ce n'est pas grave, je la garde. »
5. « Super service, merci à l'équipe de livraison ! »
6. « Je veux annuler ma commande avant qu'elle parte et être remboursé. »

TRANSITION — « À vous de tester. »`,
  `⏱ 15 min · EXERCICE 3 INDIVIDUEL

OBJECTIF — Tester un prompt de workflow et voir ses limites.

ANIMATION — Lancez le minuteur. Chacun dans son assistant gratuit.

POINT D'ÉTAPE à 7 min — « Combien de messages traités ? Une hésitation ? »

CE QU'ON OBSERVE SOUVENT —
• Message 4 : produit endommagé… mais pas de demande : priorité ?
• Message 5 : un compliment, aucune catégorie : « autre » attendu.
• Message 6 : annulation : aucune catégorie ne convient → c'est le prompt qui est incomplet.
• D'une IA à l'autre, les résultats diffèrent : d'où les tests.

RESTITUTION (4 min, incluse) — Deux ou trois volontaires : « Quelle erreur ? Quelle correction du prompt ? »

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 5

RÉPONSE — B. Seuil de confiance et file « à vérifier ».
• A ✗ — L'IA se trompe avec aplomb.
• C ✗ — On perd tout le gain.
• D ✗ — Redemander n'est pas vérifier.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Demain, ce prompt entre dans Make. »

À VOTRE POSTE — Le prompt de votre tâche réelle, testé sur cinq exemples fictifs, dans le carnet.

TRANSITION — « Bilan de la journée. »`,
];
// @@NOTES-END
