// ─── Module 6 · Analyser : données, statistiques et causes racines ──────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Analyser : données
        <br />
        et causes racines
      </>
    }
    sub="Tirer des conclusions fiables de données dispersées, puis comprendre pourquoi un incident est arrivé, pour qu’il n’arrive plus."
    dur="10:45 – 12:30 · deux labs"
    labs={
      <>
        <Tag tone="green" size={19}>
          Lab 6.1 · reporting mensuel
        </Tag>
        <Tag tone="green" size={19}>
          Lab 6.2 · post-mortem FS-02
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Copilot dans Excel et l’analyse de fichiers de Claude</SecItem>
    <SecItem n={2}>Préparer, croiser et vérifier les données</SecItem>
    <SecItem n={3}>Les indicateurs du support et le reporting commenté</SecItem>
    <SecItem n={4}>Chronologie, 5 pourquoi, Ishikawa</SecItem>
    <SecItem n={5}>Le post-mortem sans blâme</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Deux approches ─────────────────────────────────────────────────────────
const M6Col = ({ id, title, sub, d, children }: { id: AppId; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <AppTile id={id} size={60} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
  </div>
);

const M6_Approches: Page = () => (
  <Frame mod={6}>
    <Title>Deux façons d’analyser des données avec l’IA</Title>
    <Lede>Dans le classeur que vous avez ouvert, ou sur des fichiers que vous confiez. Les deux calculent pour de vrai.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 30 }}>
      <M6Col id="excel" title="Copilot dans Excel" sub="Travaille dans votre classeur" d={100}>
        <Bullet size={24} tone="green">Écrit et explique les formules</Bullet>
        <Bullet size={24} tone="green">Crée tableaux croisés et graphiques</Bullet>
        <Bullet size={24} tone="green">Met en évidence les valeurs anormales</Bullet>
        <Bullet size={24} tone="green">Fichier enregistré sur OneDrive ou SharePoint</Bullet>
      </M6Col>
      <M6Col id="claude" title="Claude · analyse de fichiers" sub="Travaille sur les fichiers confiés" d={250}>
        <Bullet size={24} tone="coral">Écrit et exécute lui-même le calcul</Bullet>
        <Bullet size={24} tone="coral">Croise plusieurs fichiers de formats différents</Bullet>
        <Bullet size={24} tone="coral">Produit graphiques et fichiers Excel</Bullet>
        <Bullet size={24} tone="coral">Commente les écarts en français</Bullet>
      </M6Col>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Bon à savoir" tone="blue" icon="chart" size={24}>
        Microsoft 365 Copilot propose aussi un agent Analyst, qui calcule de la même façon sur plusieurs fichiers. Dans tous les cas, l’IA ne doit pas «
        estimer » un total : elle doit le calculer.
      </Callout>
    </div>
  </Frame>
);

// ─── Préparer les données ───────────────────────────────────────────────────
const M6Cell = ({ children, bad = false, head = false }: { children: ReactNode; bad?: boolean; head?: boolean }) => (
  <span
    style={{
      padding: '6px 10px',
      fontSize: 19,
      fontWeight: head ? 700 : 400,
      color: bad ? T.coral.fg : C.ink,
      background: bad ? T.coral.bg : head ? C.panel : '#fff',
      borderRight: `1px solid ${C.rule}`,
      borderBottom: `1px solid ${C.rule}`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }}
  >
    {children}
  </span>
);

const M6_Preparer: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Des données propres d’abord, sinon l’IA calcule faux</Title>
    <Lede>Cinq règles simples avant de demander quoi que ce soit. L’IA peut d’ailleurs vous aider à nettoyer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 800 }}>
      <Tag tone="coral" size={20} style={{ marginBottom: 12 }}>
        <Icon name="x" size={20} /> Avant
      </Tag>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 230px 190px 260px', boxShadow: `inset 0 0 0 1px ${C.rule}`, borderRadius: 10, overflow: 'hidden' }}>
        <M6Cell head>N°</M6Cell>
        <M6Cell head bad>
          Catégorie / sous-cat.
        </M6Cell>
        <M6Cell head>Créé</M6Cell>
        <M6Cell head>Demandeur</M6Cell>
        <M6Cell>48210</M6Cell>
        <M6Cell>Impression</M6Cell>
        <M6Cell bad>lundi 8h</M6Cell>
        <M6Cell bad>j.martin</M6Cell>
        <M6Cell>48211</M6Cell>
        <M6Cell bad>impression</M6Cell>
        <M6Cell>12/10 08:20</M6Cell>
        <M6Cell bad>a.benali</M6Cell>
        <M6Cell bad>(fusionné)</M6Cell>
        <M6Cell bad>Total : 2</M6Cell>
        <M6Cell> </M6Cell>
        <M6Cell> </M6Cell>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 800 }}>
      <Tag tone="green" size={20} style={{ marginBottom: 12 }}>
        <Icon name="check" size={20} /> Après
      </Tag>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 230px 190px 260px', boxShadow: `inset 0 0 0 1px ${C.rule}`, borderRadius: 10, overflow: 'hidden' }}>
        <M6Cell head>N°</M6Cell>
        <M6Cell head>Catégorie</M6Cell>
        <M6Cell head>Créé le</M6Cell>
        <M6Cell head>Demandeur</M6Cell>
        <M6Cell>48210</M6Cell>
        <M6Cell>Impression</M6Cell>
        <M6Cell>12/10/2026 08:00</M6Cell>
        <M6Cell>UTILISATEUR_1</M6Cell>
        <M6Cell>48211</M6Cell>
        <M6Cell>Impression</M6Cell>
        <M6Cell>12/10/2026 08:20</M6Cell>
        <M6Cell>UTILISATEUR_2</M6Cell>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 262, width: 810, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Bullet size={25} cls={b.on(2)}>
        Une ligne = un ticket, pas de total au milieu
      </Bullet>
      <Bullet size={25} cls={b.on(2)} style={dl(100)}>
        Des en-têtes sur une seule ligne, sans fusion
      </Bullet>
      <Bullet size={25} cls={b.on(2)} style={dl(200)}>
        Des dates au format date, des libellés homogènes
      </Bullet>
      <Bullet size={25} cls={b.on(2)} style={dl(300)}>
        Une mise en forme en tableau (Ctrl + T)
      </Bullet>
      <Bullet size={25} tone="coral" cls={b.on(2)} style={dl(400)}>
        Les noms remplacés, en local (M4)
      </Bullet>
      <div className={b.on(2)} style={{ marginTop: 12, ...dl(500) }}>
        <PromptBox size={21}>« Liste les problèmes de qualité de ce tableau et propose les corrections, sans rien modifier. »</PromptBox>
      </div>
    </div>
  </Frame>
);

// ─── Copilot dans Excel (démo) ──────────────────────────────────────────────
const M6Row = ({ n, cat, h, sla }: { n: string; cat: string; h: string; sla: boolean }) => (
  <div className={sla ? b.hi(3) : undefined} style={{ display: 'grid', gridTemplateColumns: '120px 260px 1fr', borderBottom: `1px solid ${C.rule}`, background: sla ? '#fff' : '#fff' }}>
    <M6Cell>{n}</M6Cell>
    <M6Cell>{cat}</M6Cell>
    <span className={b.fade(1)} style={{ padding: '6px 10px', fontSize: 19, fontFamily: mono, color: C.ink, background: sla ? T.coral.bg : T.green.bg }}>
      {h}
    </span>
  </div>
);

const M6Ask = ({ beat, children }: { beat: number; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', borderRadius: 12, boxShadow: SHADOW_SM, padding: '12px 16px', fontSize: 20, lineHeight: 1.4, color: C.ink }}>
    <Num n={beat} tone="violet" size={30} />
    <span>{children}</span>
  </div>
);

const M6_Excel: Page = () => (
  <Frame mod={6} kind="demo" beats={4}>
    <Title>Copilot dans Excel : quatre demandes</Title>
    <Lede>L’export de septembre, mis en tableau. Chaque demande produit un objet Excel que l’on peut vérifier.</Lede>
    <AppWin id="excel" title="export-tickets-sept.xlsx" cls={A.in} pad={0} style={{ position: 'absolute', left: 120, top: 262, width: 1050 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 260px 1fr' }}>
        <M6Cell head>N°</M6Cell>
        <M6Cell head>Catégorie</M6Cell>
        <span className={b.fade(1)} style={{ padding: '6px 10px', fontSize: 19, fontWeight: 700, background: C.panel, borderBottom: `1px solid ${C.rule}` }}>
          Délai (h) = ([@Résolu] − [@Créé]) × 24
        </span>
      </div>
      <M6Row n="48210" cat="Impression" h="2,4" sla={false} />
      <M6Row n="48211" cat="Impression" h="27,5" sla />
      <M6Row n="48212" cat="Accès et comptes" h="0,6" sla={false} />
      <M6Row n="48213" cat="Impression" h="0,6" sla={false} />
      <M6Row n="48214" cat="Réseau et Wi-Fi" h="31,0" sla />
    </AppWin>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 600, width: 500, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '14px 20px' }}>
      <Eyebrow c={C.muted} size={16}>
        Tableau croisé
      </Eyebrow>
      <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 90px 120px', rowGap: 6, fontSize: 19 }}>
        <strong>Catégorie</strong>
        <strong>Nb</strong>
        <strong>Délai moy.</strong>
        <span>Accès et comptes</span>
        <span>412</span>
        <span>2,1 h</span>
        <span>Impression</span>
        <span>236</span>
        <span>9,8 h</span>
        <span>Réseau et Wi-Fi</span>
        <span>198</span>
        <span>11,4 h</span>
      </div>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 660, top: 600, width: 510, height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '14px 20px' }}>
      <Eyebrow c={C.muted} size={16}>
        Tickets par catégorie · septembre
      </Eyebrow>
      <svg width={470} height={230} viewBox="0 0 470 230" style={{ marginTop: 6 }}>
        <line x1={0} y1={210} x2={470} y2={210} stroke={C.rule} strokeWidth={2} />
        <rect className={b.growY(4)} x={20} y={210 - 170} width={70} height={170} rx={4} fill={C.blue} />
        <rect className={b.growY(4)} x={110} y={210 - 160} width={70} height={160} rx={4} fill={C.blue} style={dl(80)} />
        <rect className={b.growY(4)} x={200} y={210 - 124} width={70} height={124} rx={4} fill={C.blue} style={dl(160)} />
        <rect className={b.growY(4)} x={290} y={210 - 97} width={70} height={97} rx={4} fill={C.blue} style={dl(240)} />
        <rect className={b.growY(4)} x={380} y={210 - 82} width={70} height={82} rx={4} fill={C.blue} style={dl(320)} />
        <text x={55} y={30} textAnchor="middle" fontSize={17} fill={C.soft}>
          412
        </text>
        <text x={145} y={40} textAnchor="middle" fontSize={17} fill={C.soft}>
          388
        </text>
        <text x={235} y={76} textAnchor="middle" fontSize={17} fill={C.soft}>
          301
        </text>
        <text x={325} y={103} textAnchor="middle" fontSize={17} fill={C.soft}>
          236
        </text>
        <text x={415} y={118} textAnchor="middle" fontSize={17} fill={C.soft}>
          198
        </text>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1210, top: 262, width: 590, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 12, ...dl(200) }}>
        <AppTile id="copilot" size={36} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 20, color: C.navy }}>Volet Copilot</span>
      </div>
      <M6Ask beat={1}>Ajoute une colonne qui calcule le délai de résolution en heures.</M6Ask>
      <M6Ask beat={2}>Crée un tableau croisé : nombre de tickets et délai moyen par catégorie.</M6Ask>
      <M6Ask beat={3}>Mets en évidence les tickets résolus en plus de 24 heures.</M6Ask>
      <M6Ask beat={4}>Fais un graphique en barres des cinq catégories les plus fréquentes.</M6Ask>
    </div>
  </Frame>
);

// ─── Expliquer une formule ──────────────────────────────────────────────────
const M6Exp = ({ beat, part, children }: { beat: number; part: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 20, fontWeight: 700, color: T.violet.fg, background: T.violet.bg, borderRadius: 8, padding: '2px 10px' }}>{part}</span>
    <span style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M6_Formule: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>« Explique-moi cette formule » : le tableur hérité</Title>
    <Lede>Claire a hérité du fichier de suivi de son prédécesseur. Une formule incompréhensible, une question.</Lede>
    <CodeDark file="suivi-charge.xlsx · cellule F2" size={24} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      =SI(NB.SI.ENS(Tickets[Catégorie];[@Catégorie];Tickets[Statut];&quot;Ouvert&quot;)&gt;20;&quot;Surcharge&quot;;&quot;OK&quot;)
    </CodeDark>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M6Exp beat={1} part="NB.SI.ENS(…)">
        Compte les tickets de la même catégorie que la ligne, et dont le statut est « Ouvert ».
      </M6Exp>
      <M6Exp beat={2} part="> 20">Compare ce nombre au seuil de 20 tickets ouverts.</M6Exp>
      <M6Exp beat={3} part="SI(…)">
        Affiche « Surcharge » au-delà de 20, sinon « OK ». Le seuil est écrit en dur : à mettre dans une cellule pour pouvoir le changer.
      </M6Exp>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(300) }}>
      <Callout title="Relances utiles" tone="violet" icon="chat" size={23}>
        « Donne-moi un exemple chiffré. » · « Que se passe-t-il si une catégorie est vide ? » · « Propose une version plus lisible. »
      </Callout>
    </div>
  </Frame>
);

// ─── Croiser plusieurs sources ──────────────────────────────────────────────
const M6Src = ({ icon, tone, title, sub, beat }: { icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={b.left(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M6_Croiser: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Croiser trois sources que personne ne relie jamais</Title>
    <Lede>Claire veut savoir pourquoi le Wi-Fi coûte autant de tickets. La réponse est à cheval sur trois fichiers.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M6Src beat={1} icon="ticket" tone="teal" title="Export des tickets" sub="CSV · 1 846 lignes · colonne Site" />
      <M6Src beat={1} icon="bell" tone="yellow" title="Alertes de supervision" sub="CSV · bornes Wi-Fi par site" />
      <M6Src beat={1} icon="doc" tone="violet" title="Contrats prestataires" sub="Excel · site, prestataire, échéance" />
    </div>
    <div className={b.fade(2)} style={{ position: 'absolute', left: 710, top: 410 }}>
      <FlowArrow w={70} color={C.coral} />
    </div>
    <div className={b.pop(2)} style={{ position: 'absolute', left: 810, top: 330, width: 300, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', textAlign: 'center' }}>
      <AppTile id="claude" size={64} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.4, color: C.soft }}>relie les fichiers par <strong>le site</strong> et calcule</div>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 1140, top: 410 }}>
      <FlowArrow w={70} color={C.coral} />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AnswerBox id="claude" size={21}>
        Trois sites concentrent 61 % des tickets Wi-Fi : Lyon, Rennes et Lille. Ce sont les trois sites du même prestataire, dont le contrat arrive à
        échéance en décembre. Les alertes de bornes y sont deux fois plus fréquentes.
      </AnswerBox>
      <Callout title="À vérifier" tone="yellow" icon="search" size={21}>
        Une corrélation n’est pas une cause : c’est une piste pour le prochain comité fournisseur.
      </Callout>
    </div>
  </Frame>
);

// ─── Indicateurs du support ─────────────────────────────────────────────────
const M6Kpi = ({ icon, tone, name, def, d }: { icon: IconName; tone: Tone; name: string; def: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{def}</div>
    </div>
  </div>
);

const M6_Indicateurs: Page = () => (
  <Frame mod={6}>
    <Title>Les cinq indicateurs d’un reporting de support</Title>
    <Lede>Donnez leurs définitions à l’IA : sinon, elle choisira les siennes, et elles ne seront pas celles de votre contrat de service.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M6Kpi icon="ticket" tone="blue" name="Volume" def="Nombre de tickets créés sur la période, par catégorie et par site." d={100} />
      <M6Kpi icon="clock" tone="violet" name="Délai moyen de résolution" def="Moyenne de « résolu − créé », en heures ouvrées si c’est votre règle." d={200} />
      <M6Kpi icon="target" tone="green" name="Respect des SLA" def="Part des tickets résolus dans le délai prévu par leur priorité." d={300} />
      <M6Kpi icon="headset" tone="teal" name="Résolution au premier contact" def="Part des tickets résolus sans escalade ni rappel." d={400} />
      <M6Kpi icon="inbox" tone="coral" name="Stock" def="Tickets encore ouverts en fin de période, et leur ancienneté." d={500} />
      <div className={A.in} style={{ ...dl(600) }}>
        <PromptBox label="Le réflexe" size={22}>
          « Voici nos définitions et nos objectifs. Calcule chaque indicateur et montre-moi le calcul. »
        </PromptBox>
      </div>
    </div>
  </Frame>
);

// ─── Reporting de septembre ─────────────────────────────────────────────────
const M6_DATA = [
  { cat: 'Accès et comptes', aug: 398, sep: 412 },
  { cat: 'Postes de travail', aug: 371, sep: 388 },
  { cat: 'Applications métier', aug: 287, sep: 301 },
  { cat: 'Impression', aug: 128, sep: 236 },
  { cat: 'Réseau et Wi-Fi', aug: 141, sep: 198 },
  { cat: 'Messagerie', aug: 168, sep: 174 },
  { cat: 'Autres', aug: 119, sep: 137 },
];

const M6Group = ({ i, hot }: { i: number; hot?: string }) => {
  const r = M6_DATA[i];
  const x = 70 + i * 140;
  const sc = 0.62;
  const ha = r.aug * sc;
  const hs = r.sep * sc;
  return (
    <g>
      <rect className={b.growY(1)} x={x} y={300 - ha} width={46} height={ha} rx={4} fill={C.faint} style={dl(i * 60)} />
      <rect className={b.growY(1)} x={x + 50} y={300 - hs} width={46} height={hs} rx={4} fill={C.blue} style={dl(i * 60 + 30)} />
      <text x={x + 73} y={300 - hs - 10} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.ink} className={b.fade(1)} style={dl(600)}>
        {r.sep}
      </text>
      {hot ? (
        <g className={b.pop(2)} style={vars({ o: `${x + 48}px ${300 - hs - 60}px` })}>
          <rect x={x - 6} y={300 - hs - 78} width={108} height={36} rx={18} fill={C.coral} />
          <text x={x + 48} y={300 - hs - 53} textAnchor="middle" fontSize={19} fontWeight={800} fill="#fff">
            {hot}
          </text>
        </g>
      ) : null}
      <text x={x + 48} y={328} textAnchor="middle" fontSize={16} fill={C.soft}>
        {r.cat.split(' ')[0]}
      </text>
      <text x={x + 48} y={348} textAnchor="middle" fontSize={16} fill={C.soft}>
        {r.cat.split(' ').slice(1).join(' ')}
      </text>
    </g>
  );
};

const M6Tile = ({ v, label, tone }: { v: string; label: string; tone: Tone }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: tone === 'coral' ? T.coral.fg : C.navy }}>{v}</div>
    <div style={{ fontSize: 18, color: C.muted, lineHeight: 1.3 }}>{label}</div>
  </div>
);

const M6_Reporting: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Le reporting de septembre : des chiffres, puis des mots</Title>
    <Lede>L’IA calcule et trace ; elle repère les écarts ; elle propose un commentaire. Claire le valide avant envoi.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', gap: 14 }}>
      <M6Tile v="1 846" label="tickets · +14,5 % vs août" tone="navy" />
      <M6Tile v="91,4 %" label="SLA respectés · objectif 95 %" tone="coral" />
      <M6Tile v="143" label="tickets en stock fin septembre" tone="navy" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 380, width: 1060, height: 520, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '16px 20px', ...dl(150) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 19, color: C.soft }}>
        <span style={{ fontFamily: display, fontWeight: 700, color: C.navy }}>Tickets par catégorie</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, background: C.faint }} /> Août
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, background: C.blue }} /> Septembre
        </span>
      </div>
      <svg width={1020} height={440} viewBox="0 0 1020 360" style={{ marginTop: 4 }}>
        <line x1={50} y1={300} x2={1010} y2={300} stroke={C.rule} strokeWidth={2} />
        <M6Group i={0} />
        <M6Group i={1} />
        <M6Group i={2} />
        <M6Group i={3} hot="+84 %" />
        <M6Group i={4} hot="+40 %" />
        <M6Group i={5} />
        <M6Group i={6} />
      </svg>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1220, top: 262, width: 580, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AnswerBox id="claude" label="Commentaire proposé" size={21}>
        La hausse de 234 tickets vient pour 70 % de deux catégories : <strong>Impression</strong> (+108) et <strong>Réseau et Wi-Fi</strong> (+57).
        L’impression se concentre sur Lyon après la mise à jour de pilote du 3 septembre. Le respect des SLA (91,4 %) reste sous l’objectif.
      </AnswerBox>
      <Callout title="Claire vérifie" tone="yellow" icon="humanCheck" size={21}>
        Le 70 % (165 / 234), la date du 3 septembre, et le mot « concentre » : combien de tickets à Lyon ?
      </Callout>
    </div>
  </Frame>
);

// ─── Vérifier les chiffres ──────────────────────────────────────────────────
const M6_Verifier: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Quatre contrôles avant de publier un chiffre</Title>
    <Lede>Un reporting faux, c’est pire que pas de reporting : il fait prendre de mauvaises décisions.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M3Check n={1} title="Le total colle au nombre de lignes" beat={1}>
        « Combien de lignes as-tu lues ? » doit répondre 1 846, pas 1 800.
      </M3Check>
      <M3Check n={2} title="Un sous-total refait à la main" beat={2}>
        Un filtre Excel sur « Impression » : 236 tickets ? Alors le reste est probablement juste.
      </M3Check>
      <M3Check n={3} title="La méthode est visible" beat={3}>
        « Montre-moi la formule » ou « montre-moi le calcul » : une IA qui calcule sait le montrer.
      </M3Check>
      <M3Check n={4} title="Les mots collent aux chiffres" beat={4}>
        « Forte hausse », « se concentre », « stable » : chaque mot du commentaire doit être prouvé par un chiffre.
      </M3Check>
    </div>
  </Frame>
);

// ─── Chronologie de l'incident ──────────────────────────────────────────────
const M6Ev = ({ x, top, when, what, tone, beat }: { x: number; top: boolean; when: string; what: string; tone: Tone; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x - 120, width: 240, textAlign: 'center', ...(top ? { bottom: 532 } : { top: 556 }) }}>
    {top ? null : <div style={{ width: 4, height: 50, margin: '0 auto', background: STRONG[tone] }} />}
    <div style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[tone]}`, padding: '12px 14px' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 19, color: T[tone].fg }}>{when}</div>
      <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.35, color: C.ink }}>{what}</div>
    </div>
    {top ? <div style={{ width: 4, height: 50, margin: '0 auto', background: STRONG[tone] }} /> : null}
  </div>
);

const M6_Chrono: Page = () => (
  <Frame mod={6} beats={7}>
    <Title>Comprendre un incident : d’abord la chronologie</Title>
    <Lede>Claude la reconstitue à partir du journal, des alertes et des tickets. Malik et Thomas la corrigent.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 140, top: 548, width: 1640, height: 8, borderRadius: 4, background: G.brand }} />
    <M6Ev beat={1} x={260} top when="Ven. 2 oct." what="Mise à jour de l’agent : purge désactivée" tone="violet" />
    <M6Ev beat={2} x={500} top={false} when="Sam. 10 oct. 14:05" what="Alerte 90 % vers une boîte non lue" tone="yellow" />
    <M6Ev beat={3} x={740} top when="Dim. 11 oct. 23:10" what="Alerte 98 %, même boîte" tone="yellow" />
    <M6Ev beat={4} x={980} top={false} when="Lun. 12 oct. 7:52" what="Disque plein, 340 bloqués" tone="coral" />
    <M6Ev beat={5} x={1220} top when="8:05" what="Message aux entrepôts" tone="blue" />
    <M6Ev beat={6} x={1460} top={false} when="9:40" what="Purge manuelle par Malik" tone="teal" />
    <M6Ev beat={7} x={1700} top when="10:31" what="Service rétabli · 2 h 39" tone="green" />
    <div className={b.fade(7)} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(300) }}>
      <Callout title="Ce que la chronologie révèle" tone="coral" icon="eye" size={23}>
        Le problème n’a pas commencé lundi à 7:52, mais dix jours plus tôt. Et deux alertes sont passées inaperçues.
      </Callout>
    </div>
  </Frame>
);

// ─── 5 pourquoi ─────────────────────────────────────────────────────────────
const M6Why = ({ n, q, a, beat, root = false }: { n: number; q: string; a: string; beat: number; root?: boolean }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '60px 640px 1fr', alignItems: 'center', gap: 18, background: root ? T.coral.bg : C.card, borderRadius: 14, boxShadow: root ? `inset 0 0 0 2.5px ${C.coral}` : SHADOW_SM, padding: '12px 20px' }}>
    <Num n={n} tone={root ? 'coral' : 'navy'} size={44} />
    <span style={{ fontSize: 22, fontWeight: 600, color: C.navy }}>{q}</span>
    <span style={{ fontSize: 22, lineHeight: 1.35, color: C.ink }}>{a}</span>
  </div>
);

const M6_Pourquoi: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>Les 5 pourquoi, avec l’IA comme animatrice</Title>
    <Lede>« Pose-moi une question à la fois, ne propose pas la réponse. » L’IA anime, l’équipe répond avec ce qu’elle sait.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M6Why beat={1} n={1} q="Pourquoi 340 personnes étaient-elles bloquées ?" a="Le volume D: de FS-02 était plein." />
      <M6Why beat={2} n={2} q="Pourquoi le volume était-il plein ?" a="Les journaux de l’agent de sauvegarde occupaient 180 Go." />
      <M6Why beat={3} n={3} q="Pourquoi autant de journaux ?" a="La mise à jour du 2 octobre a désactivé la purge automatique." />
      <M6Why beat={4} n={4} q="Pourquoi personne ne l’a vu ?" a="Les alertes partaient vers une boîte partagée non lue le week-end." />
      <M6Why beat={5} n={5} q="Pourquoi ces règles n’ont-elles pas été revues ?" a="La procédure de changement ne prévoit aucune vérification de la supervision." root />
    </div>
    <div className={b.fade(5)} style={{ position: 'absolute', left: 120, top: 830, display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: C.muted, ...dl(300) }}>
      <Icon name="target" size={26} color={C.coral} />
      Cause racine : un trou dans la procédure de changement, pas une erreur individuelle.
    </div>
  </Frame>
);

// ─── Ishikawa ───────────────────────────────────────────────────────────────
const M6Bone = ({ x, top, label, causes, beat }: { x: number; top: boolean; label: string; causes: string[]; beat: number }) => {
  const y0 = top ? 60 : 500;
  return (
    <g className={b.fade(beat)}>
      <line x1={x} y1={top ? 90 : 470} x2={x + 150} y2={280} stroke={C.navy} strokeWidth={3} />
      <rect x={x - 110} y={top ? y0 - 44 : y0 - 6} width={220} height={40} rx={10} fill={C.navy} />
      <text x={x} y={top ? y0 - 17 : y0 + 21} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff">
        {label}
      </text>
      {causes.map((c, i) => (
        <text key={c} x={x + 10 + (top ? i * 55 : (1 - i) * 55) + 40} y={top ? 120 + i * 70 : 360 + i * 70} fontSize={19} fill={C.ink}>
          • {c}
        </text>
      ))}
    </g>
  );
};

const M6_Ishikawa: Page = () => (
  <Frame mod={6} beats={6}>
    <Title>Le diagramme d’Ishikawa : toutes les familles de causes</Title>
    <Lede>« Classe les causes possibles de l’incident dans un Ishikawa à six branches. » Puis l’équipe raye et complète.</Lede>
    <svg width={1680} height={600} viewBox="0 0 1680 560" className={A.fade} style={{ position: 'absolute', left: 120, top: 262 }}>
      <line x1={20} y1={280} x2={1350} y2={280} stroke={C.navy} strokeWidth={5} />
      <polygon points="1350,262 1380,280 1350,298" fill={C.navy} />
      <M6Bone x={160} top beat={1} label="Méthodes" causes={['Changement sans revue', 'de la supervision']} />
      <M6Bone x={600} top beat={2} label="Logiciel" causes={['Purge désactivée', 'par la mise à jour']} />
      <M6Bone x={1040} top beat={3} label="Supervision" causes={['Alertes vers une', 'boîte non lue']} />
      <M6Bone x={160} top={false} beat={4} label="Humain" causes={['Astreinte non', 'destinataire']} />
      <M6Bone x={600} top={false} beat={5} label="Matériel" causes={['Volume D: sans', 'marge d’extension']} />
      <M6Bone x={1040} top={false} beat={6} label="Environnement" causes={['Week-end, aucune', 'présence sur site']} />
    </svg>
    <div className={A.in} style={{ position: 'absolute', left: 1510, top: 452, width: 290, boxSizing: 'border-box', background: T.coral.bg, borderRadius: 16, boxShadow: `inset 0 0 0 2.5px ${C.coral}`, padding: '16px 18px' }}>
      <Icon name="hdd" size={34} color={T.coral.fg} />
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 22, color: T.coral.fg, lineHeight: 1.25 }}>FS-02 plein</div>
      <div style={{ fontSize: 19, color: C.ink }}>2 h 39 d’arrêt, 340 personnes</div>
    </div>
  </Frame>
);

// ─── Post-mortem ────────────────────────────────────────────────────────────
const M6Part = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', ...dl(d) }}>
    <Num n={n} tone="teal" size={40} />
    <span style={{ width: 290, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 23, color: C.navy }}>{title}</span>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const M6_PostMortem: Page = () => (
  <Frame mod={6}>
    <Title>Le post-mortem sans blâme</Title>
    <Lede>On décrit des faits et des mécanismes, jamais des fautifs. Sinon, au prochain incident, personne ne dira rien.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M6Part n={1} title="Résumé" d={100}>
        Trois lignes, lisibles par la direction
      </M6Part>
      <M6Part n={2} title="Impact" d={160}>
        Qui, combien, combien de temps, quel coût
      </M6Part>
      <M6Part n={3} title="Chronologie" d={220}>
        Les faits datés, du premier signal au retour
      </M6Part>
      <M6Part n={4} title="Causes" d={280}>
        La cause racine et les causes contributives
      </M6Part>
      <M6Part n={5} title="Ce qui a bien marché" d={340}>
        La communication de 8:05, la purge rapide
      </M6Part>
      <M6Part n={6} title="Actions" d={400}>
        Une action, un responsable, une échéance
      </M6Part>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox cls={A.right} size={21} style={dl(200)}>
        Rédige le post-mortem sans blâme de cet incident selon notre modèle. Aucun nom de personne : des rôles. Signale les faits dont tu n’es pas sûr.
      </PromptBox>
      <Callout title="Relecture" tone="yellow" icon="humanCheck" size={21} cls={A.right} style={dl(400)}>
        Relisez chaque phrase avec une question : « Est-ce que quelqu’un pourrait s’y sentir accusé ? »
      </Callout>
    </div>
  </Frame>
);

// ─── Labs ───────────────────────────────────────────────────────────────────
const M6_Lab1: Page = () => (
  <LabPage
    mod={6}
    n="6.1"
    title="Le reporting mensuel commenté"
    defi="reporting"
    who="Individuel · Copilot dans Excel ou Claude"
    minutes={22}
    where={
      <>
        <PathChip>Orvalis/export-tickets-sept.xlsx</PathChip>
        <PathChip>Orvalis/export-tickets-aout.xlsx</PathChip>
        <div style={{ marginTop: 10 }}>Cinq indicateurs, un graphique, un commentaire de dix lignes.</div>
      </>
    }
    objective={
      <>
        Produire le <strong>reporting de septembre</strong> d’Orvalis : les cinq indicateurs, la comparaison avec août, et un commentaire qui explique les
        écarts.
      </>
    }
    crit={
      <>
        <CheckItem id="l61-c1" size={22}>
          Les définitions données à l’IA
        </CheckItem>
        <CheckItem id="l61-c2" size={22}>
          Les quatre contrôles faits
        </CheckItem>
        <CheckItem id="l61-c3" size={22}>
          Chaque mot du commentaire prouvé
        </CheckItem>
      </>
    }
  >
    <div>Commencez par la qualité des données, puis donnez vos définitions et objectifs. Enfin : « Repère les trois plus forts écarts et propose une hypothèse pour chacun. »</div>
    <Bonus>Demandez un tableau de bord d’une page au format Excel, prêt à être réutilisé le mois prochain.</Bonus>
  </LabPage>
);

const M6_Lab2: Page = () => (
  <LabPage
    mod={6}
    n="6.2"
    title="Le post-mortem de l’incident FS-02"
    defi="rca"
    who="Par groupes de trois"
    minutes={22}
    where={
      <>
        <PathChip>Orvalis/journal-incident-FS02.docx</PathChip>
        <PathChip>Orvalis/alertes-supervision.csv</PathChip>
        <div style={{ marginTop: 10 }}>Chronologie, 5 pourquoi, post-mortem sans blâme.</div>
      </>
    }
    objective={
      <>
        Reconstituer la chronologie, trouver la <strong>cause racine</strong> avec les 5 pourquoi, puis rédiger le post-mortem et son plan d’actions.
      </>
    }
    crit={
      <>
        <CheckItem id="l62-c1" size={22}>
          Une chronologie qui commence avant lundi
        </CheckItem>
        <CheckItem id="l62-c2" size={22}>
          Une cause racine qui n’est pas une personne
        </CheckItem>
        <CheckItem id="l62-c3" size={22}>
          Des actions avec responsable et échéance
        </CheckItem>
      </>
    }
  >
    <div>Un membre du groupe joue l’équipe qui sait, l’IA anime les 5 pourquoi : « Pose-moi une question à la fois. » Le troisième rédige avec l’IA.</div>
    <Bonus>Demandez à l’IA les trois signaux faibles qui auraient permis de détecter l’incident avant lundi.</Bonus>
  </LabPage>
);

// ─── Quiz & synthèse ────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz du module 6</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi donner à l’IA vos définitions des indicateurs ?" explain="Sinon elle choisit les siennes. Le délai en heures ouvrées ou calendaires, par exemple, change tout le résultat.">
        <QOpt>Pour aller plus vite</QOpt>
        <QOpt ok>Pour que les chiffres correspondent à votre contrat de service</QOpt>
        <QOpt>Ce n’est pas utile, elle les connaît</QOpt>
      </QuizQ>
      <QuizQ q="Le total calculé par l’IA ne correspond pas au nombre de lignes. Que faites-vous ?" explain="On ne publie pas : on demande combien de lignes ont été lues et on cherche l’écart (lignes vides, doublons, filtres).">
        <QOpt>J’arrondis</QOpt>
        <QOpt ok>Je cherche l’écart avant de publier</QOpt>
        <QOpt>Je fais confiance à l’IA</QOpt>
      </QuizQ>
      <QuizQ q="Dans un 5 pourquoi bien mené, la cause racine est souvent…" explain="Un mécanisme ou un trou de processus. Une personne n’est presque jamais une cause racine.">
        <QOpt>Une personne qui s’est trompée</QOpt>
        <QOpt ok>Un trou dans un processus</QOpt>
        <QOpt>La faute de l’IA</QOpt>
      </QuizQ>
      <QuizQ q="Quel rôle donner à l’IA pendant un 5 pourquoi ?" explain="Animatrice : elle pose les questions, l’équipe répond avec ce qu’elle sait. Elle ne connaît pas votre infrastructure.">
        <QOpt>Elle trouve la cause seule</QOpt>
        <QOpt ok>Elle anime et pose les questions</QOpt>
        <QOpt>Elle désigne le responsable</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Synthese: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Ce qu’on retient du module 6</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        Des <strong>données propres</strong> d’abord ; l’IA <strong>calcule</strong>, elle n’estime pas.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        Vos <strong>définitions</strong> d’indicateurs, puis <strong>quatre contrôles</strong> avant publication.
      </SynthRow>
      <SynthRow n={3} tone="violet" d={300}>
        Croiser des sources fait apparaître des <strong>pistes</strong>, pas des preuves.
      </SynthRow>
      <SynthRow n={4} tone="coral" d={400}>
        Incident : <strong>chronologie, 5 pourquoi, Ishikawa</strong>, avec l’IA comme animatrice.
      </SynthRow>
      <SynthRow n={5} tone="teal" d={500}>
        Un post-mortem <strong>sans blâme</strong>, avec des actions datées.
      </SynthRow>
    </div>
    <PosteCard>
      Prochain reporting : faites-le avec l’IA en parallèle de la méthode habituelle, et comparez. Au deuxième mois, gardez la plus fiable.
    </PosteCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_Approches, M6_Preparer, M6_Excel, M6_Formule, M6_Croiser, M6_Indicateurs, M6_Reporting, M6_Verifier, M6_Chrono, M6_Pourquoi, M6_Ishikawa, M6_PostMortem, M6_Lab1, M6_Lab2, M6_Quiz, M6_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M6 · 10:45

OBJECTIF — Annoncer le module d’analyse.

DIRE — « Vous l’avez demandé dans le questionnaire : Excel, les données de sources diverses, les statistiques, et les causes racines d’incidents. Ce module couvre les deux : d’abord les données, avec le reporting de septembre d’Orvalis, puis les incidents, avec l’analyse de la panne de FS-02. »

TRANSITION — « Deux façons d’analyser des données avec l’IA. »`,
  `⏱ 3 min · DEUX APPROCHES

OBJECTIF — Distinguer Copilot dans Excel et l’analyse de fichiers de Claude.

DIRE — « Copilot dans Excel travaille dans votre classeur : formules, tableaux croisés, graphiques, mise en évidence. Le fichier doit être enregistré sur OneDrive ou SharePoint. Claude travaille sur les fichiers que vous lui confiez : il écrit et exécute lui-même le calcul, croise plusieurs fichiers et commente. Point commun essentiel : les deux calculent pour de vrai. Une IA qui “estime” un total de tête, on n’en veut pas. »

TRANSITION — « Encore faut-il des données propres. »`,
  `⏱ 4 min · PRÉPARER LES DONNÉES (2 clics)

OBJECTIF — Donner les règles de qualité des données avant analyse.

DIRE — « En haut, un export comme on en voit souvent : catégorie et sous-catégorie mélangées, “lundi 8h” comme date, une ligne de total au milieu, des noms. » → beat 1 : « En bas, la version propre. » → beat 2 : « Cinq règles : une ligne par ticket, des en-têtes simples, de vraies dates et des libellés homogènes, un tableau Excel, et des noms remplacés en local. Et l’IA peut vous aider à repérer les problèmes, sans rien modifier. »

TRANSITION — « Données propres : voyons Copilot dans Excel. »`,
  `⏱ 6 min · COPILOT DANS EXCEL (démo, 4 clics)

OBJECTIF — Montrer quatre demandes types dans Excel.

DIRE — → beat 1 : « Une colonne de délai en heures : Copilot écrit la formule, on peut la lire. » → beat 2 : « Un tableau croisé : nombre et délai moyen par catégorie. » → beat 3 : « La mise en évidence des tickets résolus en plus de 24 heures. » → beat 4 : « Et un graphique des cinq catégories les plus fréquentes. Chaque résultat est un objet Excel normal : vous pouvez le vérifier et le modifier. »

ANIMATION — Si une licence est disponible, faire la démonstration en direct sur le fichier du lab 6.1.

TRANSITION — « Et quand on hérite d’un fichier qu’on ne comprend pas ? »`,
  `⏱ 3 min · EXPLIQUER UNE FORMULE (3 clics)

OBJECTIF — Utiliser l’IA pour comprendre un tableur hérité.

DIRE — « Claire hérite d’un fichier de suivi. Une formule illisible. Elle demande : explique-moi cette formule. » → beat 1 : « Elle compte les tickets ouverts de la même catégorie. » → beat 2 : « Elle compare à 20. » → beat 3 : « Et affiche Surcharge ou OK. Bonus : l’IA remarque que le seuil est écrit en dur. » « Trois relances utiles en bas : un exemple chiffré, le cas limite, une version plus lisible. »

TRANSITION — « Allons plus loin : croiser plusieurs fichiers. »`,
  `⏱ 4 min · CROISER TROIS SOURCES (3 clics)

OBJECTIF — Montrer la consolidation multi-sources avec Claude.

DIRE — → beat 1 : « Trois fichiers que personne ne relie : les tickets, les alertes de supervision, les contrats prestataires. » → beat 2 : « Claude les relie par le site et calcule. » → beat 3 : « Résultat : trois sites concentrent 61 % des tickets Wi-Fi, tous chez le même prestataire. Attention : c’est une corrélation, une piste pour le comité fournisseur, pas une preuve. »

TRANSITION — « Pour un reporting, il faut d’abord des indicateurs bien définis. »`,
  `⏱ 3 min · CINQ INDICATEURS

OBJECTIF — Définir les indicateurs du support et rappeler de les donner à l’IA.

DIRE — « Volume, délai moyen de résolution, respect des SLA, résolution au premier contact, stock. Donnez vos définitions à l’IA : le délai en heures ouvrées ou calendaires, ça change tout. Le réflexe : “Voici nos définitions et nos objectifs. Calcule chaque indicateur et montre-moi le calcul.” »

TRANSITION — « Voici le reporting de septembre d’Orvalis. »`,
  `⏱ 6 min · REPORTING DE SEPTEMBRE (3 clics)

OBJECTIF — Montrer un reporting commenté et sa vérification.

DIRE — « En haut, trois chiffres : 1 846 tickets, en hausse de 14,5 %. 91,4 % de SLA respectés, sous l’objectif. 143 tickets en stock. » → beat 1 : « Le graphique : août en gris, septembre en bleu, par catégorie. » → beat 2 : « Deux écarts sautent aux yeux : l’impression, +84 %, et le Wi-Fi, +40 %. » → beat 3 : « Et le commentaire proposé par l’IA. Claire vérifie : les 70 %, c’est 165 sur 234, c’est juste. La date du 3 septembre : à vérifier dans les tickets. Et le mot “concentre” : combien de tickets à Lyon exactement ? »

INSISTER — L’impression qui monte : c’est le sujet du comité de jeudi, la migration de PRT-01. Les modules se répondent.

TRANSITION — « Quatre contrôles avant de publier. »`,
  `⏱ 3 min · QUATRE CONTRÔLES (4 clics)

OBJECTIF — Installer les contrôles de fiabilité d’un chiffre.

DIRE — → beat 1 : « Le total colle au nombre de lignes. » → beat 2 : « Un sous-total refait à la main avec un filtre. » → beat 3 : « La méthode est visible : formule ou calcul. » → beat 4 : « Et les mots collent aux chiffres : “forte hausse”, “se concentre”, chaque mot doit être prouvé. »

TRANSITION — « Passons aux incidents. Première étape : la chronologie. »`,
  `⏱ 4 min · CHRONOLOGIE (7 clics)

OBJECTIF — Montrer la reconstitution d’une chronologie à partir de plusieurs sources.

DIRE — Un événement par clic. → beat 1 : « Vendredi 2 octobre, la mise à jour de l’agent désactive la purge. » → beat 2 : « Samedi, une alerte à 90 %, vers une boîte partagée que personne ne lit le week-end. » → beat 3 : « Dimanche soir, 98 %. Même boîte. » → beat 4 : « Lundi 7 h 52, disque plein. » → beat 5 : « 8 h 05, le message aux entrepôts. » → beat 6 : « 9 h 40, la purge. » → beat 7 : « 10 h 31, retour à la normale. Ce que la chronologie révèle : le problème a commencé dix jours plus tôt. »

TRANSITION — « Maintenant, pourquoi ? »`,
  `⏱ 5 min · 5 POURQUOI (5 clics)

OBJECTIF — Mener un 5 pourquoi avec l’IA comme animatrice.

DIRE — « Astuce : on ne demande pas à l’IA la réponse. Elle ne connaît pas votre infrastructure. On lui demande d’animer : une question à la fois. » Une ligne par clic, → beat 1 à → beat 5. « Cinquième pourquoi : la procédure de changement ne prévoit aucune vérification de la supervision. C’est la cause racine. Pas Malik, pas l’éditeur : un trou dans un processus. »

TRANSITION — « Le 5 pourquoi suit un fil. L’Ishikawa ouvre toutes les pistes. »`,
  `⏱ 4 min · ISHIKAWA (6 clics)

OBJECTIF — Présenter le diagramme d’Ishikawa généré puis corrigé.

DIRE — « L’IA classe les causes possibles en six familles. » Une branche par clic : → beat 1 méthodes, → beat 2 logiciel, → beat 3 supervision, → beat 4 humain, → beat 5 matériel, → beat 6 environnement. « L’équipe raye ce qui n’a pas joué, et complète ce que l’IA ne pouvait pas savoir. »

TRANSITION — « Tout cela se termine par un document : le post-mortem. »`,
  `⏱ 3 min · POST-MORTEM SANS BLÂME

OBJECTIF — Donner la structure et l’état d’esprit du post-mortem.

DIRE — « Six parties : résumé, impact, chronologie, causes, ce qui a bien marché, actions. Sans blâme : des rôles, pas des noms ; des mécanismes, pas des fautes. Sinon, au prochain incident, personne ne dira rien. Le prompt le demande explicitement, et la relecture pose une question : quelqu’un pourrait-il s’y sentir accusé ? »

TRANSITION — « Deux labs, au choix ou en parallèle selon les profils. »`,
  `⏱ 2 min + 22 min · LAB 6.1 (minuteur)

OBJECTIF — Produire un reporting mensuel commenté et vérifié.

DIRE — « Les exports d’août et de septembre. Qualité des données d’abord, puis vos définitions, puis les cinq indicateurs, un graphique, et dix lignes de commentaire. Faites les quatre contrôles. »

ANIMATION — Proposer le lab 6.1 aux profils delivery et support, le lab 6.2 aux profils exploitation et infrastructure, ou faire les deux en parallèle par groupes. Lancer le minuteur.

TRANSITION — « Lab 6.2 pour les autres groupes. »`,
  `⏱ 2 min + 22 min · LAB 6.2 (minuteur)

OBJECTIF — Mener une analyse de causes racines et rédiger le post-mortem.

DIRE — « Par trois. Le journal et les alertes de l’incident. Un membre joue l’équipe qui sait, l’IA anime les 5 pourquoi, le troisième rédige le post-mortem avec l’IA. Critère clé : une cause racine qui n’est pas une personne. »

ANIMATION — Restitution croisée de 5 minutes : un groupe 6.1 présente à un groupe 6.2 et inversement.

TRANSITION — « Quiz avant le déjeuner. »`,
  `⏱ 4 min · QUIZ M6

OBJECTIF — Évaluation formative du module 6.

DIRE — « Quatre questions, vote à main levée. »

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M6 · 12:30

OBJECTIF — Ancrer les cinq idées du module.

DIRE — « Des données propres ; l’IA calcule, elle n’estime pas. Vos définitions, puis quatre contrôles. Croiser des sources donne des pistes, pas des preuves. Pour un incident : chronologie, 5 pourquoi, Ishikawa. Et un post-mortem sans blâme. »

TRANSITION — « Bon appétit ! Cet après-midi, le module que vous avez tous demandé : l’automatisation. »`,
];
// @@NOTES-END
