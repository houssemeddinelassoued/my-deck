// ─── Module 2 · Prompting avancé pour les workflows ─────────────────────────

// Variable placeholder inside a dark prompt panel.
const V = ({ children, c = '#FFD27A' }: { children: ReactNode; c?: string }) => (
  <span style={{ color: c, background: 'rgba(255,255,255,.07)', borderRadius: 6, padding: '0 4px' }}>
    {'{{'}
    {children}
    {'}}'}
  </span>
);

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Des prompts faits
        <br />
        pour tourner seuls
      </>
    }
    sub="Dans un workflow, personne ne relit la réponse avant l’étape suivante : le prompt doit être précis, structuré et prévisible."
    dur="11:00 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · cinq prompts de workflow
      </Tag>
    }
  >
    <SecItem n={1}>Prompt de conversation vs prompt de workflow</SecItem>
    <SecItem n={2}>Tâche précise, variables, format imposé, exemples</SecItem>
    <SecItem n={3}>Décomposer et chaîner les prompts</SecItem>
    <SecItem n={4}>Prompts réutilisables et versionnés</SecItem>
    <SecItem n={5}>Gérer les réponses imprécises ou incomplètes</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Conversation vs workflow ───────────────────────────────────────────────
const M2Row = ({ label, a, b: bb, beat }: { label: string; a: string; b: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 20, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 22, color: C.navy }}>{label}</div>
    <div style={{ fontSize: 23, color: C.soft, lineHeight: 1.35 }}>{a}</div>
    <div style={{ fontSize: 23, color: C.ink, fontWeight: 600, lineHeight: 1.35 }}>{bb}</div>
  </div>
);

const M2_Versus: Page = () => (
  <Frame mod={2} beats={6}>
    <Title>Prompt de conversation ou prompt de workflow ?</Title>
    <Lede>Le même modèle, deux métiers différents. Le second ne peut pas compter sur vous pour rattraper le coup.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 20, padding: '0 22px', boxSizing: 'border-box' }}>
      <span />
      <Tag tone="grey" size={22} style={{ justifySelf: 'start' }}>
        <Icon name="chat" size={22} /> Conversation
      </Tag>
      <Tag tone="violet" size={22} style={{ justifySelf: 'start' }}>
        <Icon name="route" size={22} /> Workflow
      </Tag>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 320, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M2Row beat={1} label="Qui lit la réponse ?" a="Vous, tout de suite" b="Un programme, puis parfois quelqu’un" />
      <M2Row beat={2} label="Itérations" a="On reformule jusqu’à ce que ça aille" b="Aucune : ça doit marcher du premier coup" />
      <M2Row beat={3} label="Données" a="Copiées-collées à la main" b="Injectées par des variables" />
      <M2Row beat={4} label="Format" a="Libre, agréable à lire" b="Imposé : JSON, liste, valeur unique" />
      <M2Row beat={5} label="Erreurs" a="Vous les voyez" b="Elles doivent être détectées par le flux" />
      <M2Row beat={6} label="Cycle de vie" a="Jetable" b="Écrit une fois, testé, versionné, partagé" />
    </div>
  </Frame>
);

// ─── Anatomie (constructeur interactif) ─────────────────────────────────────
const M2_ING = [
  { label: 'Rôle', tone: 'navy' as Tone, txt: 'Tu es l’assistant du service client de Jardiflor, boutique en ligne de jardinage.' },
  { label: 'Contexte', tone: 'blue' as Tone, txt: 'Tu traites les emails clients. Ta réponse est lue par un programme, pas par un humain.' },
  { label: 'Tâche précise', tone: 'violet' as Tone, txt: 'Classe l’email dans UNE catégorie et note son urgence.' },
  { label: 'Contraintes', tone: 'pink' as Tone, txt: 'Catégories : commande, livraison, retour, produit, facturation, autre. Urgence : 1, 2 ou 3. N’invente rien.' },
  { label: 'Format de sortie', tone: 'teal' as Tone, txt: 'Réponds uniquement avec ce JSON : {"categorie": "…", "urgence": 1, "resume": "…"}' },
  { label: 'Exemple', tone: 'green' as Tone, txt: '« Colis jamais arrivé, 2e fois ! » → {"categorie": "livraison", "urgence": 3, "resume": "Colis non reçu, récidive"}' },
];

const M2Ing = ({ i, on }: { i: number; on: boolean }) => {
  const p = M2_ING[i];
  return on ? (
    <div className={A.fade} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDuration: '400ms' } as CSSProperties}>
      <span style={{ flex: 'none', width: 7, alignSelf: 'stretch', borderRadius: 4, background: STRONG[p.tone] }} />
      <span>{p.txt}</span>
    </div>
  ) : null;
};

const M2IngBtn = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const p = M2_ING[i];
  return <Toggle on={on} onChange={flip} tone={p.tone} size={24} label={<span style={{ fontWeight: 600 }}>{p.label}</span>} />;
};

const M2_Anatomie: Page = () => {
  const [on, setOn] = useState([false, false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const json = on[4];
  const enumOk = json && on[3];
  const stable = enumOk && on[5];
  return (
    <Frame mod={2} kind="demo">
      <Title>Anatomie d’un prompt de workflow</Title>
      <Lede>Partez de « Analyse cet email », ajoutez les ingrédients et regardez si l’étape suivante peut lire la réponse.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 400, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Eyebrow c={C.navy} size={20}>
          Ingrédients
        </Eyebrow>
        <M2IngBtn i={0} on={on[0]} flip={() => flip(0)} />
        <M2IngBtn i={1} on={on[1]} flip={() => flip(1)} />
        <M2IngBtn i={2} on={on[2]} flip={() => flip(2)} />
        <M2IngBtn i={3} on={on[3]} flip={() => flip(3)} />
        <M2IngBtn i={4} on={on[4]} flip={() => flip(4)} />
        <M2IngBtn i={5} on={on[5]} flip={() => flip(5)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false, false])}>
            Vider
          </Btn>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 560, top: 262, width: 760, ...dl(150) }}>
        <CodeDark file="prompt · étape « classer l’email »" size={20} wrap style={{ minHeight: 560 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <M2Ing i={0} on={on[0]} />
            <M2Ing i={1} on={on[1]} />
            {on[2] ? <M2Ing i={2} on /> : <div style={{ color: '#FFD27A' }}>Analyse cet email.</div>}
            <M2Ing i={3} on={on[3]} />
            <M2Ing i={4} on={on[4]} />
            <M2Ing i={5} on={on[5]} />
            <div>
              Email : <V>email</V>
            </div>
          </div>
        </CodeDark>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1360, top: 262, width: 440, display: 'flex', flexDirection: 'column', gap: 18, ...dl(250) }}>
        <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px' }}>
          <PanelTitle icon="sparkles" c={C.violet}>
            Réponse de l’IA
          </PanelTitle>
          <div style={{ fontFamily: json ? mono : body, fontSize: json ? 19 : 21, lineHeight: 1.45, color: C.ink, whiteSpace: 'pre-wrap', minHeight: 200 }}>
            {!json
              ? 'Cet email semble concerner un souci de livraison. Le client paraît agacé : je vous conseille de lui répondre rapidement en vous excusant et en proposant…'
              : enumOk
                ? '{\n  "categorie": "livraison",\n  "urgence": 3,\n  "resume": "Colis non reçu"\n}'
                : '{\n  "categorie": "Problème logistique",\n  "urgence": "élevée",\n  "resume": "Colis non reçu"\n}'}
          </div>
        </div>
        <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px' }}>
          <PanelTitle icon="split" c={C.amber}>
            L’étape suivante peut-elle lire ?
          </PanelTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 600, color: stable ? T.green.fg : enumOk ? T.yellow.fg : T.coral.fg }}>
            <Icon name={stable ? 'checkCircle' : 'alert'} size={30} />
            {stable ? 'Oui, et de façon stable' : enumOk ? 'Oui, mais variable d’un email à l’autre' : json ? 'Non : valeurs hors liste' : 'Non : texte libre'}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <span style={{ flex: 1, height: 12, borderRadius: 6, background: n >= 1 ? C.coral : C.panel }} />
            <span style={{ flex: 1, height: 12, borderRadius: 6, background: n >= 2 ? C.yellow : C.panel }} />
            <span style={{ flex: 1, height: 12, borderRadius: 6, background: n >= 3 ? C.yellow : C.panel }} />
            <span style={{ flex: 1, height: 12, borderRadius: 6, background: n >= 4 ? C.green : C.panel }} />
            <span style={{ flex: 1, height: 12, borderRadius: 6, background: n >= 5 ? C.green : C.panel }} />
            <span style={{ flex: 1, height: 12, borderRadius: 6, background: n >= 6 ? C.green : C.panel }} />
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Définir précisément la tâche ───────────────────────────────────────────
const M2Pair = ({ bad, good, why, beat }: { bad: string; good: ReactNode; why: string; beat: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '520px 60px 1fr', alignItems: 'center', gap: 16 }}>
    <div className={A.in} style={{ background: T.coral.bg, borderRadius: 14, padding: '18px 22px', fontSize: 25, color: C.ink, boxShadow: `inset 0 0 0 2px ${T.coral.bd}` }}>
      « {bad} »
    </div>
    <div className={b.fade(beat)}>
      <FlowArrow w={56} color={C.violet} />
    </div>
    <div className={b.on(beat)} style={{ background: C.card, borderRadius: 14, padding: '16px 22px', boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.green}` }}>
      <div style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>{good}</div>
      <div style={{ marginTop: 6, fontSize: 19, color: T.green.fg, fontWeight: 600 }}>{why}</div>
    </div>
  </div>
);

const M2_Tache: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Définir précisément la tâche</Title>
    <Lede>Un verbe flou donne une sortie floue. Un prompt de workflow dit quoi produire, dans quelles limites, et comment savoir que c’est fini.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', flexDirection: 'column', gap: 34 }}>
      <M2Pair
        beat={1}
        bad="Analyse ce mail."
        good={
          <>
            Indique la <strong>catégorie</strong> (parmi 6), l’<strong>urgence</strong> (1 à 3) et un <strong>résumé de 15 mots maximum</strong>.
          </>
        }
        why="Trois sorties nommées, bornées, vérifiables"
      />
      <M2Pair
        beat={2}
        bad="Fais un résumé de la réunion."
        good={
          <>
            Liste les <strong>décisions prises</strong>, puis les <strong>actions</strong> avec responsable et échéance. Ignore les échanges informels.
          </>
        }
        why="On dit ce qui compte… et ce qu’on écarte"
      />
      <M2Pair
        beat={3}
        bad="Réponds au client."
        good={
          <>
            Rédige un <strong>brouillon de 80 mots</strong>, en vouvoyant. Ne promets <strong>ni remboursement ni délai</strong>. Termine par la signature du service.
          </>
        }
        why="Longueur, ton, interdits, fin explicite"
      />
    </div>
  </Frame>
);

// ─── Variables et données dynamiques ────────────────────────────────────────
const M2_ROWS = [
  { prenom: 'Léa', commande: '#48213', produit: 'Tondeuse T-400', message: 'La lame vibre fortement depuis hier, est-ce normal ?' },
  { prenom: 'Marc', commande: '#48377', produit: 'Kit d’arrosage', message: 'Je n’ai reçu que la moitié du kit : il manque les raccords.' },
  { prenom: 'Sofia', commande: '#48390', produit: 'Serre 6 m²', message: 'Pouvez-vous ajouter le n° de TVA de ma société sur la facture ?' },
];

const M2Cell = ({ children, w, head = false, c }: { children: ReactNode; w: number; head?: boolean; c?: string }) => (
  <div style={{ width: w, flex: 'none', padding: '10px 14px', boxSizing: 'border-box', fontSize: head ? 18 : 20, fontWeight: head ? 700 : 400, fontFamily: head ? mono : body, color: c ?? (head ? C.muted : C.ink), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderRight: `1px solid ${C.rule}` }}>
    {children}
  </div>
);

const M2SheetRow = ({ i, sel, pick }: { i: number; sel: boolean; pick: () => void }) => {
  const r = M2_ROWS[i];
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        pick();
      }}
      style={{ display: 'flex', width: '100%', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', background: sel ? T.yellow.bg : '#fff', boxShadow: sel ? `inset 0 0 0 3px ${C.yellow}` : `inset 0 -1px 0 ${C.rule}`, fontFamily: body }}
    >
      <M2Cell w={60} c={C.muted}>
        {i + 2}
      </M2Cell>
      <M2Cell w={140}>{r.prenom}</M2Cell>
      <M2Cell w={150}>{r.commande}</M2Cell>
      <M2Cell w={240}>{r.produit}</M2Cell>
      <M2Cell w={1090}>{r.message}</M2Cell>
    </button>
  );
};

const Fill = ({ children, c }: { children: ReactNode; c: string }) => <span style={{ color: c, fontWeight: 700, background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '0 4px' }}>{children}</span>;

const M2_Variables: Page = () => {
  const [i, setI] = useState(0);
  const r = M2_ROWS[i];
  return (
    <Frame mod={2} kind="demo">
      <Title>Variables : un prompt, mille cas</Title>
      <Lede>Écrit une fois, avec des trous : le workflow les remplit à chaque exécution. Cliquez une ligne du tableur.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, background: '#fff', borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden' }}>
        <div style={{ display: 'flex', background: T.green.bg, boxShadow: `inset 0 -2px 0 ${T.green.bd}` }}>
          <M2Cell w={60} head>
            {' '}
          </M2Cell>
          <M2Cell w={140} head>
            prenom
          </M2Cell>
          <M2Cell w={150} head>
            commande
          </M2Cell>
          <M2Cell w={240} head>
            produit
          </M2Cell>
          <M2Cell w={1090} head>
            message
          </M2Cell>
        </div>
        <M2SheetRow i={0} sel={i === 0} pick={() => setI(0)} />
        <M2SheetRow i={1} sel={i === 1} pick={() => setI(1)} />
        <M2SheetRow i={2} sel={i === 2} pick={() => setI(2)} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 800, ...dl(150) }}>
        <CodeDark file="modèle de prompt (écrit une fois)" size={21} wrap style={{ height: 380 }}>
          Client : <V>prenom</V> · Commande <V c="#82AAFF">commande</V>
          {'\n'}Produit : <V c="#9BE29B">produit</V>
          {'\n'}Message : « <V c="#F7B36B">message</V> »{'\n\n'}
          Rédige un brouillon de réponse de 80 mots maximum, ton chaleureux, en vouvoyant. Ne promets ni remboursement ni geste commercial.
        </CodeDark>
      </div>
      <div style={{ position: 'absolute', left: 940, top: 600 }}>
        <FlowArrow w={60} color={C.violet} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1020, top: 520, width: 780, ...dl(250) }}>
        <CodeDark file={`prompt envoyé · ligne ${i + 2}`} size={21} wrap style={{ height: 380 }}>
          <div key={i} className={A.fade} style={{ animationDuration: '450ms' } as CSSProperties}>
            Client : <Fill c="#FFD27A">{r.prenom}</Fill> · Commande <Fill c="#82AAFF">{r.commande}</Fill>
            {'\n'}Produit : <Fill c="#9BE29B">{r.produit}</Fill>
            {'\n'}Message : « <Fill c="#F7B36B">{r.message}</Fill> »{'\n\n'}
            Rédige un brouillon de réponse de 80 mots maximum, ton chaleureux, en vouvoyant. Ne promets ni remboursement ni geste commercial.
          </div>
        </CodeDark>
      </div>
    </Frame>
  );
};

// ─── Imposer un format de sortie ────────────────────────────────────────────
const M2Rule = ({ n, children, d }: { n: number; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <Num n={n} tone="teal" size={40} />
    <div style={{ fontSize: 24, lineHeight: 1.4, color: C.ink, paddingTop: 4 }}>{children}</div>
  </div>
);

const M2_Format: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Imposer un format, demander une réponse structurée</Title>
    <Lede>La sortie de l’IA devient l’entrée de l’étape suivante. Elle doit donc avoir une forme connue d’avance.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <CodeDark file="fin du prompt · format imposé" size={21} wrap>
        <Cc>{'# Format de réponse'}</Cc>
        {'\n'}Réponds UNIQUEMENT avec un JSON valide, sans texte autour :{'\n'}
        {'{'}
        {'\n  '}
        <Cs>"categorie"</Cs>: <Cn>"commande" | "livraison" | "retour" | "autre"</Cn>,{'\n  '}
        <Cs>"urgence"</Cs>: <Cn>1 | 2 | 3</Cn>,{'\n  '}
        <Cs>"numero_commande"</Cs>: <Cn>"chaîne" | null</Cn>,{'\n  '}
        <Cs>"resume"</Cs>: <Cn>"15 mots maximum"</Cn>
        {'\n'}
        {'}'}
        {'\n'}Si une information est absente, mets <Ck>null</Ck>. N’invente jamais.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 270, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Rule n={1} d={200}>
        <strong>« Uniquement »</strong> : pas de « Voici la réponse : » qui casse la lecture.
      </M2Rule>
      <M2Rule n={2} d={300}>
        <strong>Valeurs autorisées</strong> : une liste fermée, que les conditions sauront tester.
      </M2Rule>
      <M2Rule n={3} d={400}>
        <strong>null si absent</strong> : l’absence est une information, pas une invitation à inventer.
      </M2Rule>
      <M2Rule n={4} d={500}>
        <strong>Noms de champs stables</strong> : en minuscules, sans accents ni espaces.
      </M2Rule>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 740, width: 1680, display: 'flex', alignItems: 'center', gap: 20 }}>
      <FlowNode kind="ai" label="Classer l’email" sub="sortie JSON" w={300} />
      <FlowArrow w={60} color={C.faint} />
      <FlowNode kind="data" label="Lire le JSON" sub="« analyser le JSON »" w={300} />
      <FlowArrow w={60} color={C.faint} />
      <FlowNode kind="cond" label="categorie = livraison ?" sub="test exact sur la valeur" w={340} />
      <div className={b.on(2)} style={{ flex: 1, fontSize: 22, lineHeight: 1.4, color: C.soft, paddingLeft: 10 }}>
        Si l’IA répond « Livraison » avec une majuscule, la condition échoue : <strong style={{ color: C.coral }}>le format est un contrat</strong>.
      </div>
    </div>
  </Frame>
);

// ─── Utiliser des exemples (avec / sans) ────────────────────────────────────
const M2Out = ({ input, out, ok }: { input: string; out: string; ok: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <div style={{ fontSize: 22, color: C.soft, fontStyle: 'italic' }}>« {input} »</div>
    <div key={out} className={A.fade} style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, color: ok ? T.green.fg : T.coral.fg, background: ok ? T.green.bg : T.coral.bg, borderRadius: 8, padding: '6px 12px', animationDuration: '400ms' } as CSSProperties}>
      {out}
    </div>
  </div>
);

const M2_Exemples: Page = () => {
  const [few, setFew] = useState(false);
  return (
    <Frame mod={2} kind="demo">
      <Title>Utiliser des exemples pour stabiliser la sortie</Title>
      <Lede>Quatre emails sur le même sujet. Sans exemple, l’IA invente sa propre étiquette à chaque fois.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={few} onChange={setFew} tone="green" size={28} label={<strong>Ajouter 3 exemples au prompt</strong>} />
        <Tag tone={few ? 'green' : 'coral'} size={22}>
          {few ? '4 / 4 sorties identiques' : '4 étiquettes différentes'}
        </Tag>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 350, width: 1040, display: 'flex', flexDirection: 'column', gap: 14, ...dl(150) }}>
        <M2Out input="Mon colis est bloqué au dépôt depuis 5 jours." out={few ? 'livraison' : 'Livraison'} ok={few} />
        <M2Out input="Le transporteur dit avoir livré, je n’ai rien reçu." out={few ? 'livraison' : 'problème_transport'} ok={few} />
        <M2Out input="Quand vais-je recevoir ma commande ?" out={few ? 'livraison' : 'suivi commande'} ok={few} />
        <M2Out input="Le livreur a laissé le carton sous la pluie." out={few ? 'livraison' : 'Logistique'} ok={few} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1220, top: 350, width: 580, ...dl(250) }}>
        <CodeDark file="exemples ajoutés au prompt" size={18} wrap>
          <Cc># Exemples</Cc>
          {'\n'}« Où en est ma commande ? »{'\n'}→ <Cs>{'{"categorie": "livraison"}'}</Cs>
          {'\n'}« Je veux renvoyer ce pull. »{'\n'}→ <Cs>{'{"categorie": "retour"}'}</Cs>
          {'\n'}« Facture en double ? »{'\n'}→ <Cs>{'{"categorie": "facturation"}'}</Cs>
        </CodeDark>
        <div style={{ marginTop: 20 }}>
          <Callout title="Bon exemple" tone="green" icon="check" size={22}>
            Court, varié, au format exact attendu. Incluez un cas limite (« autre »).
          </Callout>
        </div>
      </div>
    </Frame>
  );
};

// ─── Décomposer et chaîner ──────────────────────────────────────────────────
const M2Stage = ({ n, tone, icon, title, prompt, out, beat }: { n: number; tone: Tone; icon: IconName; title: string; prompt: string; out: string; beat: number }) => (
  <div className={b.on(beat)} style={{ width: 390, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <IconTile name={icon} tone={tone} size={40} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ fontSize: 20, lineHeight: 1.45, color: C.soft, minHeight: 116 }}>{prompt}</div>
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.45, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '10px 12px', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, minHeight: 82, whiteSpace: 'pre-wrap' }}>{out}</div>
  </div>
);

const M2_Chaine: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Décomposer une tâche complexe, chaîner les prompts</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', alignItems: 'center', gap: 22, background: T.coral.bg, borderRadius: 16, padding: '16px 24px', boxShadow: `inset 0 0 0 2px ${T.coral.bd}` }}>
      <Icon name="alert" size={34} color={C.coral} />
      <div style={{ fontSize: 24, color: C.ink, lineHeight: 1.4 }}>
        <strong>Le prompt géant</strong> « lis, classe, extrais, réponds et vérifie » : impossible à tester, une erreur au début contamine tout, et on ne sait pas où ça casse.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'flex', alignItems: 'stretch', gap: 40 }}>
      <M2Stage beat={1} n={1} tone="yellow" icon="filter" title="Classer" prompt="Catégorie parmi 6, urgence 1 à 3. JSON." out={'{"categorie": "facturation",\n "urgence": 2}'} />
      <M2Stage beat={2} n={2} tone="teal" icon="search" title="Extraire" prompt="Si facturation : n° de commande, montant contesté, motif. null si absent." out={'{"commande": "#48390",\n "montant": null}'} />
      <M2Stage beat={3} n={3} tone="violet" icon="pen" title="Rédiger" prompt="Brouillon de 80 mots à partir des champs extraits, sans promesse de remboursement." out="« Bonjour Sofia, nous avons bien reçu votre demande… »" />
      <M2Stage beat={4} n={4} tone="green" icon="shieldCheck" title="Vérifier" prompt="Le brouillon contient-il une promesse, un montant ou un délai ? Réponds oui / non + motif." out={'{"conforme": true}'} />
    </div>
    <svg width={1680} height={40} style={{ position: 'absolute', left: 120, top: 520 }} aria-hidden>
      <path className={b.fade(2)} d="M392 20 H 428" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
      <path className={b.fade(3)} d="M822 20 H 858" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
      <path className={b.fade(4)} d="M1252 20 H 1288" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
    </svg>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>
        Chaque maillon a <strong>une entrée, une sortie, un test</strong>. On peut changer de modèle, de prompt ou de règle maillon par maillon.
      </span>
    </div>
  </Frame>
);

// ─── Prompts réutilisables : la fiche prompt ────────────────────────────────
const M2Field = ({ k: key, children, tone = 'grey' }: { k: string; children: ReactNode; tone?: Tone }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'baseline', padding: '10px 0', borderBottom: `1px solid ${C.rule}` }}>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{key}</span>
    <span style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M2_Fiche: Page = () => (
  <Frame mod={2}>
    <Title>Créer des prompts réutilisables : la fiche prompt</Title>
    <Lede>Un prompt de workflow est un composant : il a un nom, une version, des entrées, une sortie et des tests.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 32px', borderTop: `7px solid ${C.violet}` }}>
      <M2Field k="Nom" tone="violet">
        <strong>classer-email-sav</strong> · v1.3
      </M2Field>
      <M2Field k="Objectif">Attribuer une catégorie et une urgence à chaque email du SAV</M2Field>
      <M2Field k="Entrées" tone="blue">
        <span style={{ fontFamily: mono }}>{'{{objet}} {{email}}'}</span>
      </M2Field>
      <M2Field k="Sortie" tone="teal">
        <span style={{ fontFamily: mono }}>JSON · categorie, urgence, resume</span>
      </M2Field>
      <M2Field k="Modèle" tone="grey">
        Celui validé par l’entreprise · température basse
      </M2Field>
      <M2Field k="Jeu de tests" tone="green">
        20 emails réels anonymisés, dont 5 pièges · 19 / 20 réussis
      </M2Field>
      <M2Field k="Propriétaire" tone="pink">
        Responsable SAV · revue tous les 3 mois
      </M2Field>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="violet" icon="layers" title="Une bibliothèque" cls={A.right} style={dl(200)} size={22}>
        Un dossier partagé, une fiche par prompt : on réutilise au lieu de réécrire.
      </Card>
      <Card tone="green" icon="flask" title="Testé avant d’être branché" cls={A.right} style={dl(320)} size={22}>
        Chaque modification repasse le jeu de tests. Pas de test, pas de mise en production.
      </Card>
      <Card tone="blue" icon="git" title="Versionné" cls={A.right} style={dl(440)} size={22}>
        On sait quelle version a produit quelle réponse, et on peut revenir en arrière.
      </Card>
    </div>
  </Frame>
);

// ─── Réponses imprécises ou incomplètes ─────────────────────────────────────
const M2Chk = ({ x, label }: { x: number; label: string }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: 300, width: 300, height: 120, boxSizing: 'border-box', background: T.yellow.bg, borderRadius: 16, boxShadow: `inset 0 0 0 2.5px ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 16px', textAlign: 'center' }}>
    <Icon name="split" size={30} color={T.yellow.fg} />
    <span style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.25, color: T.yellow.fg }}>{label}</span>
  </div>
);

const M2Fail = ({ x, title, sub, beat }: { x: number; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x, top: 540, width: 300, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${C.coral}`, padding: '16px 18px' }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: T.coral.fg, lineHeight: 1.3 }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.4, color: C.soft }}>{sub}</div>
  </div>
);

const M2_Imprecis: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Gérer les réponses imprécises ou incomplètes</Title>
    <Lede>L’IA se trompera. Le workflow doit le détecter avant que l’erreur ne parte chez un client.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden>
      <path d="M360 360 H 420 M720 360 H 780 M1080 360 H 1140 M1440 360 H 1500" stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
      <path className={b.draw(1)} pathLength={1} d="M570 420 V 540" stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
      <path className={b.draw(2)} pathLength={1} d="M930 420 V 540" stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
      <path className={b.draw(3)} pathLength={1} d="M1290 420 V 540" stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
    </svg>
    <FlowNode kind="ai" label="L’IA répond" w={240} cls={A.in} style={{ position: 'absolute', left: 120, top: 300 }} />
    <M2Chk x={420} label="JSON valide ?" />
    <M2Chk x={780} label="Champs obligatoires présents ?" />
    <M2Chk x={1140} label="Confiance ≥ 0,8 ?" />
    <FlowNode kind="action" label="Suite du workflow" w={300} cls={A.in} style={{ position: 'absolute', left: 1500, top: 300 }} />
    <M2Fail x={420} beat={1} title="Relancer une fois" sub="avec le message d’erreur : « JSON invalide, corrige le format »" />
    <M2Fail x={780} beat={2} title="Compléter ou marquer" sub="demander l’info manquante au client, ou statut « incomplet »" />
    <M2Fail x={1140} beat={3} title="File humaine" sub="un humain tranche ; son choix enrichit les exemples du prompt" />
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
      <CodeDark file="à ajouter au prompt" size={21} wrap>
        Si une information manque, mets <Ck>null</Ck> : n’invente jamais. Si la demande ne correspond à aucune catégorie, réponds <Cs>"autre"</Cs>. Ajoute un champ{' '}
        <Cs>"confiance"</Cs> entre 0 et 1.
      </CodeDark>
    </div>
  </Frame>
);

// ─── Exercice : trouvez les 6 défauts ───────────────────────────────────────
const M2_Defauts: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Exercice : six défauts dans ce prompt de workflow</Title>
    <Lede>Trouvez-les à l’oral, puis cliquez les pastilles. Ensuite, réécrivez-le en binôme.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <CodeDark file="prompt · réponse SAV (version 0)" size={24}>
        Bonjour ! Peux-tu analyser ce mail client stp ?{'\n'}
        Dis-moi de quoi ça parle, si c’est urgent, et réponds-lui{'\n'}
        en proposant un geste commercial si besoin.{'\n'}
        Mets ça sous la forme que tu veux.{'\n'}
        Les catégories, c’est genre livraison, SAV, etc.{'\n'}
        {'\n'}
        Mail : <V>email</V>
        {'\n'}
        Merci beaucoup !!
      </CodeDark>
    </div>
    <Hotspot n={1} x={1245} y={348} title="Tâche vague" w={460}>
      « Analyser » ne dit pas quoi produire : quelles sorties, quelles valeurs ?
    </Hotspot>
    <Hotspot n={2} x={1245} y={385} title="Trois tâches en une" w={460}>
      Classer, évaluer l’urgence et répondre : à découper en trois maillons testables.
    </Hotspot>
    <Hotspot n={3} x={1245} y={422} title="Engagement interdit" w={460}>
      Un geste commercial engage l’entreprise : jamais décidé par l’IA sans validation.
    </Hotspot>
    <Hotspot n={4} x={1245} y={459} title="Format libre" w={460}>
      L’étape suivante ne pourra pas lire la réponse : imposez un JSON.
    </Hotspot>
    <Hotspot n={5} x={1245} y={496} title="Liste ouverte" w={460}>
      « etc. » invite l’IA à inventer des catégories : liste fermée + « autre ».
    </Hotspot>
    <Hotspot n={6} x={1245} y={570} title="Aucun cas d’échec prévu" w={460}>
      Email vide, hors sujet, en anglais ? Que faire si l’info manque ? null, « autre », confiance.
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 700, width: 1100, ...dl(500) }}>
      <Callout title="Et les politesses ?" tone="blue" icon="chat" size={23}>
        « Bonjour », « stp », « merci » ne nuisent pas, mais n’aident pas non plus. Dans un workflow, gardez les mots pour les consignes.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Cinq prompts prêts à brancher"
    defi="prompts"
    who="En binôme"
    minutes={40}
    where={
      <>
        Cinq <strong>fiches prompt</strong> (nom, entrées, sortie, prompt) et pour chacune <strong>trois tests</strong> dont un piège, avec le résultat obtenu.
      </>
    }
    objective={
      <>
        Écrire des prompts capables de <strong>classer</strong> une demande, <strong>extraire</strong> des informations, <strong>analyser</strong> un document,{' '}
        <strong>générer</strong> une réponse et <strong>transformer</strong> du texte en données structurées.
      </>
    }
    crit={
      <>
        <CheckItem id="a2c1" size={22}>Sorties au format imposé (JSON ou liste)</CheckItem>
        <CheckItem id="a2c2" size={22}>Variables nommées en {'{{…}}'}</CheckItem>
        <CheckItem id="a2c3" size={22}>Cas « information absente » géré</CheckItem>
        <CheckItem id="a2c4" size={22}>3 tests passés, dont un piège</CheckItem>
      </>
    }
  >
    <div>1. Choisissez un cas par type sur la page suivante, ou prenez votre propre processus.</div>
    <div>2. Rédigez avec la structure : rôle, contexte, tâche, contraintes, format, exemple.</div>
    <div>3. Testez sur trois entrées différentes dans votre assistant IA, dont une piégeuse.</div>
    <div>4. Corrigez jusqu’à obtenir trois sorties identiques en structure.</div>
    <Bonus>Chaînez deux de vos prompts : la sortie du premier devient la variable du second.</Bonus>
  </LabPage>
);

// ─── Atelier 2 · Les cinq cas ───────────────────────────────────────────────
const M2Case = ({ input, out, hint }: { input: ReactNode; out: ReactNode; hint: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
    <div>
      <Eyebrow c={C.muted} size={18} style={{ marginBottom: 10 }}>
        Entrée (exemple)
      </Eyebrow>
      <div style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '18px 22px', fontSize: 22, lineHeight: 1.5, color: C.ink, minHeight: 300, boxSizing: 'border-box' }}>{input}</div>
    </div>
    <div>
      <Eyebrow c={C.muted} size={18} style={{ marginBottom: 10 }}>
        Sortie attendue (forme)
      </Eyebrow>
      <CodeDark size={20} style={{ minHeight: 300 }}>
        {out}
      </CodeDark>
      <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', fontSize: 20, color: T.violet.fg }}>
        <Icon name="bulb" size={22} /> {hint}
      </div>
    </div>
  </div>
);

const M2_Cas: Page = () => (
  <Frame mod={2} kind="lab">
    <Title>Atelier 2 · Cinq cas au choix</Title>
    <Tabs initial="classer" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
        <TabBtn id="classer" tone="yellow" icon="filter">
          Classer · ticket IT
        </TabBtn>
        <TabBtn id="extraire" tone="teal" icon="search">
          Extraire · bon de commande
        </TabBtn>
        <TabBtn id="analyser" tone="pink" icon="eye">
          Analyser · réclamation
        </TabBtn>
        <TabBtn id="generer" tone="violet" icon="pen">
          Générer · candidature
        </TabBtn>
        <TabBtn id="transformer" tone="green" icon="table">
          Transformer · réunion
        </TabBtn>
      </div>
      <TabPane id="classer">
        <M2Case
          input="« Depuis la mise à jour de ce matin, mon PC redémarre en boucle. J’ai une présentation client à 14 h. »"
          out={'{\n  "categorie": "poste_travail" | "logiciel"\n             | "reseau" | "acces" | "autre",\n  "urgence": 1 | 2 | 3,\n  "motif_urgence": "…" | null\n}'}
          hint="Piège : un ticket qui mélange deux catégories."
        />
      </TabPane>
      <TabPane id="extraire">
        <M2Case
          input="« Bonjour, merci de nous livrer 40 chaises Oslo (réf. CH-220) et 10 tables T-80 avant le 15/11 à notre site de Lyon. Bon de commande BC-7781. Paiement à 30 jours. »"
          out={'{\n  "bon_commande": "BC-7781",\n  "lignes": [{"ref": "…", "qte": 0}],\n  "date_livraison": "AAAA-MM-JJ" | null,\n  "lieu": "…",\n  "paiement": "…" | null\n}'}
          hint="Piège : une date relative (« fin du mois »)."
        />
      </TabPane>
      <TabPane id="analyser">
        <M2Case
          input="« Troisième panne en deux mois. Si rien n’est fait d’ici vendredi, je saisis mon avocat et je publie un avis sur tous les sites. »"
          out={'{\n  "sentiment": "negatif" | "neutre" | "positif",\n  "risque_juridique": true | false,\n  "risque_image": true | false,\n  "points_cles": ["…"],\n  "escalade": true | false\n}'}
          hint="Piège : l’ironie (« Bravo, encore en retard ! »)."
        />
      </TabPane>
      <TabPane id="generer">
        <M2Case
          input={
            <>
              Variables : <span style={{ fontFamily: mono, color: C.violet }}>{'{{prenom}} {{poste}} {{date_reception}}'}</span>
              <br />
              Consigne : accusé de réception de candidature, 70 mots, chaleureux, délai de réponse « sous 3 semaines », aucune promesse d’entretien.
            </>
          }
          out={'Texte brut, 70 mots maximum,\nsans objet ni signature\n(ajoutés par le workflow).'}
          hint="Piège : un prénom manquant dans les données."
        />
      </TabPane>
      <TabPane id="transformer">
        <M2Case
          input="« … Julie s’occupe de relancer le fournisseur avant jeudi. Pour le salon, on part sur le stand B, Karim réserve. On en reparle au prochain comité… »"
          out={'[\n  {"action": "…", "responsable": "…",\n   "echeance": "AAAA-MM-JJ" | null},\n  …\n]'}
          hint="Piège : une action sans responsable désigné."
        />
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Quiz M2 ────────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz du module 2</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi imposer une liste fermée de catégories ?" explain="La condition suivante teste une valeur exacte. Une catégorie inventée ou mal orthographiée fait sortir le cas du flux sans bruit.">
        <QOpt>Pour que la réponse soit plus courte</QOpt>
        <QOpt ok>Pour que les conditions du workflow puissent la tester</QOpt>
        <QOpt>Parce que l’IA ne connaît pas d’autres mots</QOpt>
      </QuizQ>
      <QuizQ q="L’IA ne trouve pas le numéro de commande dans l’email. Que doit dire le prompt ?" explain="null est une information exploitable : le workflow peut demander le numéro au client. Une valeur inventée, elle, passe inaperçue.">
        <QOpt>Déduis-le à partir du contexte</QOpt>
        <QOpt ok>Mets null si l’information est absente</QOpt>
        <QOpt>Écris « 00000 »</QOpt>
      </QuizQ>
      <QuizQ q="Quel est le principal intérêt du chaînage de prompts ?" explain="Chaque maillon a une entrée, une sortie et un test : on localise et on corrige les erreurs, maillon par maillon.">
        <QOpt>Utiliser moins de jetons</QOpt>
        <QOpt>Rendre l’IA plus créative</QOpt>
        <QOpt ok>Tester et corriger chaque étape séparément</QOpt>
      </QuizQ>
      <QuizQ q="Que contient une bonne fiche prompt réutilisable ?" explain="Nom, version, entrées, format de sortie, jeu de tests et propriétaire : c’est un composant, pas un texte jetable.">
        <QOpt>Le prompt seul, c’est suffisant</QOpt>
        <QOpt ok>Entrées, format de sortie, version, tests, propriétaire</QOpt>
        <QOpt>Le nom de la personne qui l’a écrit</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse M2 ────────────────────────────────────────────────────────────
const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Ce qu’on retient du module 2</Title>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="violet" d={100}>
        Un prompt de workflow est <strong>lu par une machine</strong> : il doit marcher du premier coup.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        <strong>Tâche précise, variables, format imposé, exemples</strong> : les quatre leviers de stabilité.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        On <strong>découpe et on chaîne</strong> : un maillon, une sortie, un test.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Un prompt est un <strong>composant</strong> : fiche, version, jeu de tests, propriétaire.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        On prévoit l’échec : <strong>null, « autre », confiance, relance, file humaine</strong>.
      </SynthRow>
    </div>
    <ProjectCard mod={2}>
      Chaque étape <strong>IA</strong> de votre cartographie a maintenant son prompt : entrées en variables, sortie au format imposé, et un cas d’échec prévu.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_Versus, M2_Anatomie, M2_Tache, M2_Variables, M2_Format, M2_Exemples, M2_Chaine, M2_Fiche, M2_Imprecis, M2_Defauts, M2_Atelier, M2_Cas, M2_Quiz, M2_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M2 · 11:00

OBJECTIF — Annoncer le changement de nature du prompt.

DIRE — « Vous écrivez déjà des prompts. Mais un prompt de conversation et un prompt de workflow sont deux métiers différents. Dans un workflow, personne ne relit la réponse avant l’étape suivante. Le prompt doit donc être précis, structuré et prévisible. On va voir comment, puis vous écrirez cinq prompts prêts à brancher. »

TRANSITION — « Comparons les deux. »`,
  `⏱ 4 min · CONVERSATION VS WORKFLOW (6 clics)

OBJECTIF — Faire comprendre les exigences propres au prompt de workflow.

DIRE — Une ligne par clic. « Qui lit la réponse ? En conversation, vous. En workflow, un programme. » « Itérations : en conversation on reformule ; en workflow, ça doit marcher du premier coup, sur des centaines de cas. » « Les données ne sont plus copiées-collées, elles arrivent par des variables. » « Le format n’est plus libre : il est imposé. » « Les erreurs, vous ne les voyez plus : le flux doit les détecter. » « Et le prompt n’est plus jetable : il est écrit une fois, testé, versionné, partagé. »

TRANSITION — « Construisons un prompt de workflow, ingrédient par ingrédient. »`,
  `⏱ 6 min · ANATOMIE (démo interactive)

OBJECTIF — Rappeler la structure d’un prompt professionnel et montrer l’effet de chaque ingrédient sur l’exploitabilité.

DIRE — « On part de “Analyse cet email”. Réponse : un joli texte… que l’étape suivante ne peut pas lire. » Activer Rôle et Contexte : « Mieux cadré, mais toujours du texte. » Activer Format : « Du JSON ! Mais regardez : “Problème logistique”, “élevée” : des valeurs hors liste. » Activer Contraintes : « Valeurs autorisées : la condition suivante peut tester “livraison”. » Activer Exemple : « Et maintenant c’est stable d’un email à l’autre. »

INSISTER — Le contexte « ta réponse est lue par un programme » change le comportement du modèle : il évite les formules de politesse.

TRANSITION — « Premier levier : la tâche elle-même. »`,
  `⏱ 4 min · DÉFINIR LA TÂCHE (3 clics)

OBJECTIF — Apprendre à définir précisément une tâche.

DIRE — « Trois demandes floues qu’on voit partout. » Clic. « “Analyse ce mail” devient trois sorties nommées et bornées : catégorie parmi six, urgence de 1 à 3, résumé de 15 mots. » Clic. « “Fais un résumé” : on dit ce qui compte, décisions et actions, et ce qu’on ignore. » Clic. « “Réponds au client” : longueur, ton, interdits, fin explicite. Une bonne tâche se vérifie : on peut dire oui ou non, c’est conforme. »

ANIMATION — Demander à la salle un quatrième exemple de demande floue et le réécrire ensemble.

TRANSITION — « Deuxième levier : les variables. »`,
  `⏱ 4 min · VARIABLES (démo interactive)

OBJECTIF — Utiliser des variables et des données dynamiques.

DIRE — « En haut, un tableur alimenté par un formulaire. À gauche, le modèle de prompt, écrit une fois, avec des trous entre doubles accolades. À droite, ce qui part vraiment au modèle. » Cliquer la ligne de Marc, puis de Sofia. « Le prompt ne change pas, les données si. C’est exactement ce que fera Make ou Power Automate : remplacer chaque variable par la valeur du cas en cours. »

INSISTER — Les consignes restent fixes ; seules les données varient. Ne jamais mettre de consigne dans une variable remplie par un client : c’est une porte d’entrée pour l’injection de prompt (module 9).

TRANSITION — « Troisième levier : le format de sortie. »`,
  `⏱ 4 min · FORMAT IMPOSÉ (2 clics)

OBJECTIF — Imposer un format de sortie et une réponse structurée.

DIRE — « Voici la fin type d’un prompt de workflow : uniquement du JSON valide, des valeurs autorisées, null si absent. Quatre règles à droite. » Clic. « Pourquoi c’est vital : après l’IA, l’outil lit le JSON et une condition teste la catégorie. » Clic. « Si l’IA répond “Livraison” avec une majuscule, le test échoue et le cas sort du flux sans bruit. Le format est un contrat entre l’IA et la suite du workflow. »

TRANSITION — « Quatrième levier : les exemples. »`,
  `⏱ 3 min · EXEMPLES (bascule)

OBJECTIF — Montrer l’effet des exemples sur la stabilité.

DIRE — « Quatre emails qui parlent tous de livraison. Sans exemple, quatre étiquettes différentes. » Activer la bascule. « Avec trois exemples courts au format exact attendu : quatre fois “livraison”. Les exemples valent souvent mieux qu’un long paragraphe d’explications. Un bon jeu d’exemples est court, varié, et contient un cas limite. »

ATTENTION — Des exemples tous semblables biaisent le modèle vers cette catégorie : variez-les.

TRANSITION — « Et quand la tâche est trop grosse pour un seul prompt ? »`,
  `⏱ 5 min · CHAÎNAGE (4 clics)

OBJECTIF — Décomposer une tâche complexe et chaîner les prompts.

DIRE — « En haut, le prompt géant qui fait tout : impossible à tester. » Clic : « Maillon 1, classer. » Clic : « Maillon 2, extraire, seulement si c’est de la facturation : le n° de commande, le montant contesté, null si absent. » Clic : « Maillon 3, rédiger à partir des champs extraits, pas de l’email brut. » Clic : « Maillon 4, une IA vérifie la première : y a-t-il une promesse, un montant, un délai ? »

INSISTER — Chaque maillon a une entrée, une sortie, un test : on peut remplacer un maillon sans tout casser.

TRANSITION — « Ces prompts, on veut les réutiliser. »`,
  `⏱ 3 min · FICHE PROMPT

OBJECTIF — Créer des prompts réutilisables.

DIRE — « Un prompt de workflow est un composant, comme une formule Excel partagée. Il a un nom, une version, des entrées, un format de sortie, un jeu de tests et un propriétaire. Le jeu de tests est le point le plus négligé : vingt cas réels anonymisés, dont cinq pièges. Chaque modification repasse les tests. C’est ce qui vous permettra de changer de modèle l’an prochain sans angoisse. »

TRANSITION — « Dernier point : quand l’IA répond mal. »`,
  `⏱ 4 min · RÉPONSES IMPRÉCISES (3 clics)

OBJECTIF — Gérer les réponses imprécises ou incomplètes.

DIRE — « Trois contrôles après chaque réponse de l’IA. » Clic. « JSON invalide : on relance une fois, en joignant le message d’erreur. » Clic. « Champ obligatoire manquant : on complète, par exemple en demandant au client, ou on marque le cas incomplet. » Clic. « Confiance faible : le cas part dans une file humaine, et la décision humaine devient un nouvel exemple pour le prompt. En bas, les trois phrases à ajouter à vos prompts. »

NUANCE — La « confiance » auto-déclarée par l’IA est un indicateur imparfait : utile pour trier, pas une garantie.

TRANSITION — « À vous de jouer : un prompt plein de défauts. »`,
  `⏱ 5 min · EXERCICE : 6 DÉFAUTS (hotspots)

OBJECTIF — Appliquer les principes en repérant les défauts d’un prompt réel.

DIRE — « Ce prompt a été trouvé dans un vrai scénario d’automatisation. Trouvez six défauts. » Laisser la salle proposer, cliquer la pastille correspondante à chaque bonne trouvaille.

LES 6 — 1 tâche vague · 2 trois tâches en une · 3 geste commercial décidé par l’IA · 4 format libre · 5 liste ouverte avec « etc. » · 6 aucun cas d’échec prévu.

ANIMATION — Faire réécrire le prompt en binôme pendant 3 minutes, puis lire une version.

TRANSITION — « Atelier 2. »`,
  `⏱ 40 min · ATELIER 2 · CINQ PROMPTS (minuteur)

OBJECTIF — Créer des prompts pour classer, extraire, analyser, générer et transformer.

CONSIGNE À DIRE — « En binôme, cinq fiches prompt, une par type. Prenez les cas de la page suivante ou, mieux, les étapes IA de votre propre processus. Pour chaque prompt : trois tests dans votre assistant, dont un piège. Vous avez réussi quand les trois sorties ont exactement la même structure. »

ANIMATION — Afficher la page suivante pendant l’atelier. Passer dans les rangs : vérifier le format, la gestion de l’absence et le piège. Défi bonus pour les rapides : chaîner deux prompts.

DÉBRIEF — Une paire présente son prompt le plus robuste, une autre son piège le plus retors.`,
  `⏱ (pendant l’atelier) · LES CINQ CAS

OBJECTIF — Fournir des cas prêts à l’emploi, variés par métier.

DIRE — « Cinq onglets, cinq métiers : support informatique, achats, relation client, RH, gestion de projet. À gauche une entrée type, à droite la forme attendue de la sortie, et en violet le piège à tester. »

ANIMATION — Cliquer les onglets un par un au lancement de l’atelier, puis laisser la page affichée.

TRANSITION — Après l’atelier : « Vérifions les acquis. »`,
  `⏱ 4 min · QUIZ M2 (4 questions)

OBJECTIF — Vérifier les acquis : liste fermée, null, chaînage, fiche prompt.

DIRE — Lire, faire voter, cliquer. Revenir sur la question 2 si besoin : « Une valeur inventée passe inaperçue ; un null déclenche une action. »

TRANSITION — « Synthèse avant le déjeuner. »`,
  `⏱ 2 min · SYNTHÈSE M2

OBJECTIF — Ancrer les idées clés et faire le point projet.

DIRE — « Cinq idées : un prompt de workflow est lu par une machine ; quatre leviers de stabilité ; on découpe et on chaîne ; un prompt est un composant ; on prévoit l’échec. Côté projet : chaque étape IA de votre cartographie a son prompt. »

TRANSITION — « Bon déjeuner. À 13:30, on s’attaque aux documents et aux données. »`,
];
// @@NOTES-END
