// Atelier 2 has two versions, chosen on the cover (useClient):
//   APSM   — fictional mine (Val-Laurier) installs AI fatigue cameras in its trucks: biometrics, Loi 25, comité SST.
//   Sobeys — real case: Rite Aid's facial recognition in stores (FTC, 2023), with the Canadian Tire echo (BC, 2023).
// Same page count, same timers, same structure in both versions.

// ─── A2 · Divider ───────────────────────────────────────────────────────────
const A2_Divider: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Section
      n={6}
      title="Atelier 2 · Étude de cas éthique"
      sub={apsm ? 'Une caméra d’IA contre la fatigue au volant, dans une mine. Prévention ou surveillance ?' : 'Un cas réel : la reconnaissance faciale en magasin. Vous l’analysez, puis vous dites comment vous auriez agi.'}
      dur="≈ 40 min"
      kind="atelier"
    >
      <SecItem n={1}>{apsm ? 'Le cas : des caméras de fatigue dans les camions' : 'Le cas : des caméras contre le vol à l’étalage'}</SecItem>
      <SecItem n={2}>Analyser avec les six principes</SecItem>
      <SecItem n={3}>Comment auriez-vous agi ? Choisissez un rôle</SecItem>
      <SecItem n={4}>{apsm ? 'Débat, puis les repères pour décider' : 'Débat, puis ce qui s’est vraiment passé'}</SecItem>
    </Section>
  );
};
A2_Divider.transition = BLOOM;

// ─── A2 · Helpers ───────────────────────────────────────────────────────────
const A2Fact = ({ d, icon, tone = 'teal', children }: { d: number; icon: IconName; tone?: Tone; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div style={{ fontSize: 26, lineHeight: 1.42, color: C.ink, paddingTop: 4 }}>{children}</div>
  </div>
);

const A2Echo = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className={A.right} style={{ position: 'absolute', left: 1260, top: 600, width: 540, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', color: '#fff', ...dl(600) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="leaf" size={30} color={C.yellow} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.45, color: '#F2F8FC' }}>{children}</div>
  </div>
);

const A2Caption = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 14, top: 12, padding: '4px 12px', borderRadius: 8, background: 'rgba(20,24,28,.6)', color: '#fff', fontSize: 19, fontWeight: 600 }}>{children}</div>
);

// ─── A2 · The case (1/2): the system ────────────────────────────────────────
const A2_Case1: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" label="Atelier 2 · Le cas (1/2)">
      <Title>{apsm ? 'Le cas : des caméras de fatigue dans les camions de la mine' : 'Le cas : la reconnaissance faciale chez Rite Aid'}</Title>
      <Lede>{apsm ? 'Une mine fictive, des systèmes bien réels : ils se répandent dans l’industrie minière.' : 'Une histoire vraie, documentée par la Federal Trade Commission américaine (FTC).'}</Lede>
      {apsm ? (
        <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="org">
            La mine <b>Val-Laurier</b> (fictive, Abitibi) fait rouler 40 camions de minerai, sous terre et en surface, jour et nuit.
          </A2Fact>
          <A2Fact d={220} icon="flag" tone="coral">
            Après deux quasi-accidents liés à la somnolence, la direction fait de la fatigue une <b>priorité de prévention</b>.
          </A2Fact>
          <A2Fact d={340} icon="cpu" tone="violet">
            Une <b>caméra d’IA</b> dans chaque cabine analyse le visage du conducteur : yeux, bâillements, regard. Alerte sonore, et signalement au superviseur.
          </A2Fact>
          <A2Fact d={460} icon="globe" tone="yellow">
            Le fournisseur garde les vidéos <b>sur son infonuagique, hors du Québec</b>, et calcule un « score de vigilance » par travailleur.
          </A2Fact>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="org">
            Rite Aid, grande chaîne de pharmacies américaine, veut réduire le <b>vol à l’étalage</b>.
          </A2Fact>
          <A2Fact d={220} icon="cpu" tone="violet">
            De 2012 à 2020, elle utilise la <b>reconnaissance faciale</b> dans des centaines de magasins.
          </A2Fact>
          <A2Fact d={340} icon="database" tone="coral">
            Le système compare chaque visage à une liste de personnes « à surveiller », souvent tirée d’<b>images de caméras floues</b>.
          </A2Fact>
          <A2Fact d={460} icon="bell" tone="yellow">
            Une correspondance déclenche une <b>alerte sur le téléphone</b> des employés du magasin.
          </A2Fact>
        </div>
      )}
      <Photo id={apsm ? 'camionMine' : 'camerasMagasin'} w={540} h={290} cls={A.right} style={{ position: 'absolute', left: 1260, top: 280, boxShadow: SHADOW, ...dl(450) }}>
        <A2Caption>{apsm ? 'Camion de minerai, mine souterraine' : 'Écran de surveillance en magasin'}</A2Caption>
      </Photo>
      {apsm ? (
        <A2Echo title="Pourquoi ce cas ?">Ces systèmes protègent réellement des vies. La question n’est pas de les refuser, mais de les encadrer.</A2Echo>
      ) : (
        <A2Echo title="Ça vous rappelle…">… les caméras, la carte de fidélité, les offres ciblées : le commerce de détail regorge de données sur ses clients.</A2Echo>
      )}
    </Frame>
  );
};

// ─── A2 · The case (2/2): what people lived ─────────────────────────────────
const A2_Case2: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" label="Atelier 2 · Le cas (2/2)">
      <Title>{apsm ? 'Ce que vivent les conducteurs' : 'Ce que vivent les clients signalés'}</Title>
      {apsm ? (
        <div style={{ position: 'absolute', left: 120, top: 220, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="doc" tone="coral">
            Les conducteurs apprennent l’installation par une <b>note de service, la veille</b>.
          </A2Fact>
          <A2Fact d={220} icon="eye" tone="coral">
            Un conducteur atteint d’une affection des paupières déclenche des <b>alertes à répétition</b>, et se fait retirer du volant.
          </A2Fact>
          <A2Fact d={340} icon="chart" tone="coral">
            La direction propose d’utiliser le score de vigilance pour les <b>évaluations</b> et l’attribution des quarts de nuit.
          </A2Fact>
          <A2Fact d={460} icon="users" tone="coral">
            Le syndicat demande à voir les données. Le <b>comité de santé et de sécurité</b> n’a pas été consulté.
          </A2Fact>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 120, top: 220, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="alert" tone="coral">
            Des <b>milliers de fausses correspondances</b>, parfois avec des personnes jamais venues dans le magasin.
          </A2Fact>
          <A2Fact d={220} icon="users" tone="coral">
            Des clients <b>suivis, fouillés, expulsés</b>, parfois signalés à la police devant leurs proches.
          </A2Fact>
          <A2Fact d={340} icon="scale" tone="coral">
            Selon la FTC, les fausses alertes sont plus fréquentes dans les magasins de <b>quartiers à majorité noire ou asiatique</b>.
          </A2Fact>
          <A2Fact d={460} icon="eye" tone="coral">
            Les clients <b>ne sont pas informés</b> que leur visage est analysé.
          </A2Fact>
        </div>
      )}
      <div className={A.right} style={{ position: 'absolute', left: 1260, top: 220, width: 540, ...dl(600) }}>
        <Callout title="Votre question" tone="yellow" icon="scale" size={28} style={{ padding: '26px 30px' }}>
          {apsm ? 'À quel moment l’outil de prévention devient-il un outil de surveillance ? Qui aurait dû intervenir ?' : 'Où, dans cette chaîne, aurait-on pu arrêter la machine ? Et qui aurait dû le faire ?'}
        </Callout>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, fontSize: 22, color: C.muted, ...dl(800) }}>
        {apsm ? 'Les repères pour décider après votre analyse. Le texte du cas est dans le Chat et dans votre guide.' : 'La suite de l’histoire après votre analyse. Le texte du cas est dans le Chat et dans votre guide.'}
      </div>
    </Frame>
  );
};

// ─── A2 · Step 1: analyse with the six principles ───────────────────────────
const A2Lens = ({ d, icon, tone, name, q }: { d: number; icon: IconName; tone: Tone; name: string; q: string }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</span>
    </div>
    <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{q}</div>
  </div>
);

const A2_Step1: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={6}
      label="Atelier 2 · Étape 1 sur 2"
      title="Étape 1 · Analysez le cas avec les six principes"
      lede="Pour chaque principe, notez en une phrase ce qui a manqué."
      timerId="a2-s1"
      minutes={10}
      timerLabel="Analyse"
      side={
        <NoteCard>
          <NoteLine>Six phrases, une par principe</NoteLine>
          <NoteLine>Le principe le plus gravement bafoué, selon vous</NoteLine>
          <NoteLine>{apsm ? 'Une question que vous auriez posée avant l’installation' : 'Une question que vous auriez posée en 2012'}</NoteLine>
        </NoteCard>
      }
    >
      {apsm ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <A2Lens d={150} icon="scale" tone="violet" name="Équité" q="Qui subit les fausses alertes : lunettes, affection, éclairage ?" />
          <A2Lens d={220} icon="eye" tone="teal" name="Transparence" q="Les conducteurs savaient-ils ce qui était mesuré et gardé ?" />
          <A2Lens d={290} icon="lock" tone="blue" name="Vie privée" q="Un visage filmé : renseignement biométrique, sensible. Nécessaire ?" />
          <A2Lens d={360} icon="shieldCheck" tone="green" name="Fiabilité" q="Que vaut une alerte de fatigue ? A-t-on mesuré les erreurs ?" />
          <A2Lens d={430} icon="humanCheck" tone="yellow" name="Contrôle humain" q="Après une alerte, qui décide : la machine ou le superviseur ?" />
          <A2Lens d={500} icon="flag" tone="coral" name="Responsabilité" q="Qui répond du système : la mine, le fournisseur, le comité ?" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <A2Lens d={150} icon="scale" tone="violet" name="Équité" q="Qui a subi les fausses alertes, et pourquoi eux ?" />
          <A2Lens d={220} icon="eye" tone="teal" name="Transparence" q="Les clients savaient-ils qu’on analysait leur visage ?" />
          <A2Lens d={290} icon="lock" tone="blue" name="Vie privée" q="Le visage est biométrique, sensible. Le but justifiait-il ce moyen ?" />
          <A2Lens d={360} icon="shieldCheck" tone="green" name="Fiabilité" q="Images floues, erreurs non suivies : qui l’a testé ?" />
          <A2Lens d={430} icon="humanCheck" tone="yellow" name="Contrôle humain" q="Les employés vérifiaient-ils l’alerte, ou agissaient-ils dessus ?" />
          <A2Lens d={500} icon="flag" tone="coral" name="Responsabilité" q="Qui répond : la chaîne, le fournisseur, l’employé ?" />
        </div>
      )}
    </WorkStep>
  );
};

// ─── A2 · Step 2: what would you have done? ─────────────────────────────────
const A2Role = ({ d, n, icon, tone, role, children }: { d: number; n: number; icon: IconName; tone: Tone; role: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{role}</div>
      <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const A2_Step2: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={6}
      label="Atelier 2 · Étape 2 sur 2"
      title="Étape 2 · Comment auriez-vous agi ?"
      lede={apsm ? 'Choisissez un rôle. Écrivez trois décisions que vous auriez prises, avant ou après l’installation.' : 'Choisissez un rôle. Écrivez trois décisions que vous auriez prises, en 2012 ou en cours de route.'}
      timerId="a2-s2"
      minutes={7}
      timerLabel="Votre rôle"
      side={
        <NoteCard title="Vos trois décisions">
          <NoteLine>Ce que j’aurais vérifié</NoteLine>
          <NoteLine>Ce que j’aurais refusé</NoteLine>
          <NoteLine>Ce que j’aurais changé dans le processus</NoteLine>
        </NoteCard>
      }
    >
      {apsm ? (
        <>
          <A2Role d={150} n={1} icon="chart" tone="teal" role="Le fournisseur du système">
            Vous vendez l’outil et vous entraînez le modèle.
          </A2Role>
          <A2Role d={250} n={2} icon="bell" tone="blue" role="Le superviseur de quart">
            Vous recevez les alertes en temps réel, en pleine production.
          </A2Role>
          <A2Role d={350} n={3} icon="users" tone="violet" role="Le comité de santé et de sécurité">
            Paritaire, il n’a pas été consulté avant l’installation.
          </A2Role>
          <A2Role d={450} n={4} icon="flag" tone="coral" role="La direction de la mine">
            Vous devez réduire les accidents… et tenir les coûts.
          </A2Role>
        </>
      ) : (
        <>
          <A2Role d={150} n={1} icon="chart" tone="teal" role="Le fournisseur du logiciel">
            Vous vendez la reconnaissance faciale et vous fixez le seuil d’alerte.
          </A2Role>
          <A2Role d={250} n={2} icon="store" tone="blue" role="La gérante du magasin">
            Vous recevez les alertes sur votre téléphone, en pleine affluence.
          </A2Role>
          <A2Role d={350} n={3} icon="shield" tone="violet" role="Le responsable de la vie privée">
            Vous êtes consulté… quand on pense à vous consulter.
          </A2Role>
          <A2Role d={450} n={4} icon="flag" tone="coral" role="La direction de la prévention des pertes">
            Vous devez réduire les vols, magasin par magasin.
          </A2Role>
        </>
      )}
    </WorkStep>
  );
};

// ─── A2 · Debate ────────────────────────────────────────────────────────────
const A2_Debate: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="atelier" label="Atelier 2 · Débat">
      <Title>Débat : à votre place, qu’auraient fait les autres ?</Title>
      <Lede>Deux ou trois volontaires présentent leur rôle et leurs décisions. Les autres réagissent au micro.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AskCard n={1} title="Quel rôle, quelles décisions ?" sub="Deux minutes par volontaire" d={100} />
        <AskCard n={2} title="D’accord ? Pas d’accord ?" sub="Une réaction au micro, en une phrase" d={220} />
        <AskCard n={3} title="Qu’est-ce qui vous aurait arrêté ?" sub="Peur, hiérarchie, objectifs, manque d’information…" d={340} />
      </div>
      <Timer id="a2-debate" minutes={10} label="Débat" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
      <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
        <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
          Sondage · la responsabilité principale revient…
        </Eyebrow>
        <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
          Un numéro par personne, à voix haute
        </Hint>
        <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
          <PollRow id="algo" icon="cpu" tone="grey" label="1 · À l’algorithme" />
          <PollRow id="tech" icon="chart" tone="teal" label="2 · Au fournisseur" />
          <PollRow id="ops" icon="bell" tone="blue" label={apsm ? '3 · Au superviseur de quart' : '3 · Aux employés du magasin'} />
          <PollRow id="lead" icon="flag" tone="coral" label={apsm ? '4 · À la direction de la mine' : '4 · À la direction de la chaîne'} />
          <PollRow id="all" icon="users" tone="violet" label="5 · À tous, faute de gouvernance" />
        </Poll>
      </div>
    </Frame>
  );
};

// ─── A2 · Then: what happened (Sobeys) / the rules to decide (APSM) ─────────
const A2Step = ({ n, x, date, tone, children }: { n: number; x: number; date: string; tone: Tone; children: ReactNode }) => (
  <>
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 16, top: 312, width: 32, height: 32, borderRadius: 99, background: '#fff', boxShadow: `inset 0 0 0 8px ${STRONG[tone]}` }} />
    <div className={b.on(n)} style={{ position: 'absolute', left: x - 190, top: 370, width: 380 }}>
      <div style={{ boxSizing: 'border-box', height: 270, background: C.card, borderRadius: 16, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 22px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{date}</div>
        <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
      </div>
    </div>
  </>
);

const A2_After: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" beats={5} label={apsm ? 'Atelier 2 · Les repères' : 'Atelier 2 · La suite'}>
      <Title>{apsm ? 'Les repères pour décider' : 'Ce qui s’est passé ensuite'}</Title>
      <div className={A.grow} style={{ position: 'absolute', left: 120, top: 324, width: 1680, height: 8, borderRadius: 4, background: C.rule, ...dl(100) }} />
      {apsm ? (
        <>
          <A2Step n={1} x={310} date="Loi 25 · biométrie" tone="blue">
            Les images du visage sont des renseignements sensibles : consentement exprès et EFVP avant le déploiement.
          </A2Step>
          <A2Step n={2} x={720} date="Hors du Québec" tone="violet">
            Envoyer les vidéos ailleurs exige d’évaluer la protection offerte là-bas (art. 17).
          </A2Step>
          <A2Step n={3} x={1130} date="Autre usage" tone="coral">
            Utiliser un score de sécurité pour évaluer le rendement : une autre fin, qui exige un nouveau consentement.
          </A2Step>
          <A2Step n={4} x={1540} date="Prévention paritaire" tone="teal">
            La Loi sur la santé et la sécurité du travail associe les travailleurs à la prévention : le comité doit être dans la boucle.
          </A2Step>
        </>
      ) : (
        <>
          <A2Step n={1} x={310} date="2012 – 2020" tone="blue">
            Le système fonctionne dans des centaines de magasins, sans test sérieux de ses erreurs.
          </A2Step>
          <A2Step n={2} x={720} date="Juil. 2020" tone="violet">
            Une enquête de Reuters révèle le système. Rite Aid dit l’avoir abandonné.
          </A2Step>
          <A2Step n={3} x={1130} date="2023 · Canada" tone="teal">
            En Colombie-Britannique, des magasins Canadian Tire sont blâmés pour leur reconnaissance faciale sans consentement.
          </A2Step>
          <A2Step n={4} x={1540} date="Déc. 2023" tone="coral">
            La FTC interdit à Rite Aid d’utiliser la reconnaissance faciale pendant cinq ans.
          </A2Step>
        </>
      )}
      <Callout cls={b.on(5)} title="La leçon" tone="yellow" icon="bulb" size={27} style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
        {apsm
          ? 'Un bon outil de prévention peut devenir un outil de surveillance. La différence : une seule finalité annoncée, le comité consulté, et un humain qui décide.'
          : 'Une technologie de sécurité, sans test, sans transparence et sans contrôle humain, a transformé des clients en suspects. Au Québec, la biométrie exige en plus consentement exprès et déclaration à la CAI.'}
      </Callout>
    </Frame>
  );
};

// ─── A2 · Back home: three safeguards ───────────────────────────────────────
const A2Guard = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '28px 30px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone="green" size={68} solid />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const A2_Mutuelle: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" beats={3} label="Atelier 2 · Et chez vous ?">
      <Title>{apsm ? 'Et chez vous ? Trois garde-fous pour une caméra de fatigue' : 'Et chez vous ? Trois garde-fous avant toute caméra intelligente'}</Title>
      <Lede>Ce qu’une organisation responsable décide avant d’aller plus loin.</Lede>
      {apsm ? (
        <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
          <A2Guard n={1} icon="target" title="Une seule finalité">
            La prévention, et rien d’autre : jamais l’évaluation ni la discipline, sans nouveau consentement.
          </A2Guard>
          <A2Guard n={2} icon="humanCheck" title="Un humain qui tranche">
            Une alerte ouvre une discussion, pas une sanction. Les fausses alertes sont suivies et corrigées.
          </A2Guard>
          <A2Guard n={3} icon="users" title="Le comité dans la boucle">
            Consulté avant l’achat, EFVP faite, données agrégées partagées, conservation limitée.
          </A2Guard>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
          <A2Guard n={1} icon="search" title="Prouver la nécessité">
            Une EFVP avant tout projet, et la question : un moyen moins intrusif suffirait-il ?
          </A2Guard>
          <A2Guard n={2} icon="eye" title="Informer et consentir">
            Affichage clair, consentement exprès pour la biométrie, déclaration préalable à la CAI.
          </A2Guard>
          <A2Guard n={3} icon="humanCheck" title="Tester, puis vérifier">
            Taux d’erreur mesurés par groupe. Aucune intervention sur une alerte qu’une personne n’a pas vérifiée.
          </A2Guard>
        </div>
      )}
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(300) }}>
        <FilRouge>Ces garde-fous entreront dans votre charte, à l’atelier 3</FilRouge>
      </div>
    </Frame>
  );
};

// @@PAGES-BEGIN
export const __pages = [A2_Divider, A2_Case1, A2_Case2, A2_Step1, A2_Step2, A2_Debate, A2_After, A2_Mutuelle];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DE L'ATELIER 2 (≈ 13 h 40)

VERSION CLIENT — Le cas change selon le client choisi sur la couverture.

OBJECTIF — Analyser un cas d'usage problématique de l'IA, puis débattre : « comment auriez-vous agi ? » (contenu officiel de l'atelier 2).

APSM — Un cas construit pour le secteur minier : des caméras d'IA contre la fatigue dans les camions d'une mine fictive. Ces systèmes existent réellement et se répandent dans l'industrie ; la mine et les faits du cas sont fictifs, et vous le dites. Il touche les trois priorités du cadrage : vérification (que vaut une alerte ?), éthique (prévention ou surveillance ?), Loi 25 (biométrie, consentement, EFVP, hébergement hors Québec).

SOBEYS — Un cas réel, documenté par la FTC américaine : la reconnaissance faciale de Rite Aid. Proche du commerce de détail et de la pharmacie, avec un écho canadien (Canadian Tire, Colombie-Britannique, 2023).

CHAT — Collez maintenant le texte du cas du client (il est aussi dans le guide PDF) :
APSM : « CAS — CAMÉRAS DE FATIGUE À LA MINE VAL-LAURIER (cas fictif). La mine fait rouler 40 camions de minerai, sous terre et en surface. Après deux quasi-accidents liés à la somnolence, la direction installe dans chaque cabine une caméra d'IA qui analyse le visage du conducteur (yeux, bâillements, regard) : alerte sonore et signalement au superviseur. Le fournisseur garde les vidéos sur son infonuagique, hors du Québec, et calcule un score de vigilance par travailleur. Les conducteurs sont informés par une note de service la veille. Un conducteur atteint d'une affection des paupières déclenche des alertes à répétition et se fait retirer du volant. La direction propose d'utiliser le score pour les évaluations et l'attribution des quarts de nuit. Le syndicat demande à voir les données ; le comité de santé et de sécurité n'a pas été consulté. »
SOBEYS : « CAS — LA RECONNAISSANCE FACIALE CHEZ RITE AID (cas réel, FTC, 2023). Pour réduire le vol à l'étalage, la chaîne de pharmacies américaine Rite Aid utilise de 2012 à 2020 la reconnaissance faciale dans des centaines de magasins. Le système compare chaque visage à une liste de personnes à surveiller, souvent constituée d'images de caméras de faible qualité ; une correspondance déclenche une alerte sur le téléphone des employés. Résultat : des milliers de fausses correspondances ; des clients suivis, fouillés, expulsés, parfois signalés à la police. Selon la FTC, les fausses alertes sont plus fréquentes dans les magasins de quartiers à majorité noire ou asiatique. Les clients ne sont pas informés. »

TRANSITION — « Voici le cas. »`,
  `⏱ 3 min · LE CAS (1/2) : LE SYSTÈME

APSM — Lisez les quatre faits, sans commenter. Précisez : « La mine est fictive ; les systèmes de détection de la fatigue par caméra, eux, sont réels et de plus en plus présents dans les mines. » Pointez la carte bleue : « Ces systèmes protègent réellement des vies. La question n'est pas de les refuser, mais de les encadrer. »

SOBEYS — Lisez les quatre faits : Rite Aid, le vol à l'étalage, la reconnaissance faciale de 2012 à 2020, une liste de personnes « à surveiller » tirée d'images floues, l'alerte sur le téléphone des employés. Pointez la carte bleue : « Le commerce de détail regorge de données sur ses clients : caméras, fidélité, offres ciblées. » Ne laissez pas entendre que Sobeys utilise ou a utilisé un tel système : c'est un cas de l'industrie, pas de l'entreprise.

SOURCES (Sobeys) — Décision et plainte de la Federal Trade Commission contre Rite Aid (décembre 2023) ; enquête de Reuters (juillet 2020) ; rapport d'enquête du commissaire à l'information et à la protection de la vie privée de la Colombie-Britannique sur des magasins Canadian Tire (2023).

TRANSITION — « Et du côté des personnes concernées ? »`,
  `⏱ 3 min · LE CAS (2/2) : LES PERSONNES CONCERNÉES

APSM — Note de service la veille ; un conducteur atteint d'une affection des paupières retiré du volant à cause des alertes ; le score proposé pour les évaluations et les quarts de nuit ; le syndicat qui demande les données, le comité non consulté. Laissez la question en suspens : « À quel moment l'outil de prévention devient-il un outil de surveillance ? »

SOBEYS — Des milliers de fausses correspondances ; des clients suivis, fouillés, expulsés, parfois signalés à la police ; selon la FTC, plus de fausses alertes dans les quartiers à majorité noire ou asiatique ; des clients non informés. Question en suspens : « Où aurait-on pu arrêter la machine ? »

NE PAS DIRE — La suite (APSM : les repères légaux ; Sobeys : la décision de la FTC) : elle arrive après le débat.

TRANSITION — « Étape 1 : chacun analyse le cas. »`,
  `⏱ 10 min · ÉTAPE 1 : ANALYSER AVEC LES SIX PRINCIPES

ANIMATION — Lancez le minuteur. Chacun écrit une phrase par principe. Le texte du cas est dans le Chat et dans le guide.

PISTES APSM —
• Équité : les fausses alertes touchent davantage certaines personnes (lunettes, affection, traits du visage, éclairage de la cabine).
• Transparence : une note la veille ; personne ne sait ce qui est mesuré, gardé, ni combien de temps.
• Vie privée : des images du visage = renseignements biométriques, sensibles ; nécessaires pour détecter la fatigue ? Hébergées hors du Québec.
• Fiabilité : aucune mesure du taux d'erreur avant le déploiement ; le conducteur retiré du volant à tort.
• Contrôle humain : l'alerte déclenche une mesure sans échange avec le travailleur.
• Responsabilité : la mine reste responsable de la prévention ; le fournisseur, de son outil ; le comité, absent.

PISTES SOBEYS —
• Équité : fausses alertes plus fréquentes dans certains quartiers.
• Transparence : clients non informés.
• Vie privée : biométrie, sans consentement.
• Fiabilité : images de faible qualité, erreurs non suivies.
• Contrôle humain : les employés agissaient sur l'alerte sans la vérifier.
• Responsabilité : la chaîne répond de l'outil qu'elle déploie.

POINT D'ÉTAPE — À 5 min : « Combien de principes avez-vous traités : 2, 4, 6 ? »

TRANSITION — « Étape 2 : passez de l'analyse à l'action. »`,
  `⏱ 7 min · ÉTAPE 2 : COMMENT AURIEZ-VOUS AGI ?

ANIMATION — Lancez le minuteur. Chacun choisit un rôle (1 à 4) et écrit trois décisions : vérifier, refuser, changer.

EXEMPLES APSM (si quelqu'un sèche) —
• Fournisseur : mesurer et publier les taux de fausses alertes ; héberger au Canada ou au Québec ; ne pas calculer de score individuel par défaut.
• Superviseur : une alerte = une conversation, pas un retrait automatique ; noter les fausses alertes.
• Comité de santé et de sécurité : exiger d'être consulté avant l'achat ; demander l'EFVP ; refuser l'usage du score pour l'évaluation.
• Direction : annoncer une finalité unique (la prévention), consulter avant, former les superviseurs.

EXEMPLES SOBEYS —
• Fournisseur : tester sur des visages variés ; refuser les images de faible qualité ; fixer un seuil prudent.
• Gérante : ne jamais intervenir sur une alerte non vérifiée ; faire remonter les erreurs.
• Responsable de la vie privée : exiger l'EFVP ; rappeler le consentement exprès et la déclaration à la CAI au Québec.
• Direction : comparer avec des moyens moins intrusifs ; accepter d'arrêter le projet.

POINT D'ÉTAPE — À 4 min : « Quel rôle avez-vous choisi ? »

TRANSITION — « Débat. »`,
  `⏱ 10 min · DÉBAT

ANIMATION — Lancez le minuteur. Deux ou trois volontaires, si possible de rôles différents, présentent leurs décisions en 2 minutes, au micro. Après chaque présentation, une ou deux réactions au micro. Puis le sondage : chacun annonce un numéro.

RELANCE CLÉ — « Qu'est-ce qui vous aurait arrêté, en vrai ? » La peur de contredire, les objectifs chiffrés, le manque d'information. APSM : « C'est exactement le rôle d'un comité paritaire : que dire stop ne repose pas sur une seule personne. »

LECTURE DU SONDAGE — Personne ne devrait choisir 1 (« l'algorithme ») sans être contredit : un algorithme n'est pas responsable. La réponse 5 ouvre le module 7.

TRANSITION — APSM : « Voici les repères qui permettent de décider. » Sobeys : « Voici ce qui s'est vraiment passé. »`,
  `⏱ 3 min · APSM : LES REPÈRES · SOBEYS : LA SUITE (5 clics)

APSM —
→ beat 1 : « Loi 25 : les images du visage sont des renseignements biométriques, donc sensibles. Il faut un consentement exprès et une évaluation des facteurs relatifs à la vie privée avant le déploiement. » Si le système sert aussi à vérifier ou confirmer l'identité, la Loi concernant le cadre juridique des technologies de l'information exige en plus une déclaration préalable à la CAI.
→ beat 2 : « Envoyer les vidéos hors du Québec exige d'évaluer si les renseignements y seront protégés adéquatement (article 17 de la loi sur le secteur privé). »
→ beat 3 : « Utiliser un score de sécurité pour l'évaluation du rendement, c'est une autre finalité : en principe, un nouveau consentement. »
→ beat 4 : « La Loi sur la santé et la sécurité du travail organise la prévention avec les travailleurs : le comité de santé et de sécurité a un rôle à jouer dans le choix des moyens de prévention. »
→ beat 5 : « La leçon : un bon outil de prévention peut devenir un outil de surveillance. La différence : une seule finalité annoncée, le comité consulté, un humain qui décide. »
PRUDENCE — Ce sont des repères, pas un avis juridique. Pour un vrai projet : la personne responsable de la protection des renseignements personnels, et un conseiller juridique.

SOBEYS —
→ beat 1 : « De 2012 à 2020, le système fonctionne dans des centaines de magasins, sans test sérieux de ses erreurs. »
→ beat 2 : « Juillet 2020 : une enquête de Reuters révèle le système. Rite Aid dit l'avoir abandonné. »
→ beat 3 : « 2023, au Canada : le commissaire à la protection de la vie privée de la Colombie-Britannique conclut que des magasins Canadian Tire de la province ont utilisé la reconnaissance faciale sans consentement adéquat. »
→ beat 4 : « Décembre 2023 : la FTC interdit à Rite Aid d'utiliser la reconnaissance faciale pendant cinq ans. »
→ beat 5 : « La leçon : sans test, sans transparence, sans contrôle humain, des clients deviennent des suspects. Au Québec, la biométrie exige en plus un consentement exprès et une déclaration à la CAI. »

TRANSITION — « Et chez vous ? »`,
  `⏱ 2 min · TROIS GARDE-FOUS (3 clics)

APSM —
→ beat 1 : « Une seule finalité : la prévention. Jamais l'évaluation ni la discipline, sans nouveau consentement. »
→ beat 2 : « Un humain qui tranche : une alerte ouvre une discussion, pas une sanction. Les fausses alertes sont suivies. »
→ beat 3 : « Le comité dans la boucle : consulté avant l'achat, EFVP faite, données agrégées partagées, conservation limitée. »

SOBEYS —
→ beat 1 : « Prouver la nécessité : une EFVP, et la question : un moyen moins intrusif suffirait-il ? »
→ beat 2 : « Informer et consentir : affichage clair, consentement exprès pour la biométrie, déclaration préalable à la CAI. »
→ beat 3 : « Tester, puis vérifier : taux d'erreur mesurés par groupe ; aucune intervention sur une alerte non vérifiée. »

« Ces garde-fous, il faut les écrire quelque part, et dire qui les fait respecter. C'est l'objet du module 7… après la pause. »

PAUSE — Annoncez 15 minutes (≈ 14 h 20).`,
];
// @@NOTES-END
