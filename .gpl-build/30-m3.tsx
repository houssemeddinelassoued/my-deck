// ─── M3 · Divider ───────────────────────────────────────────────────────────
const M3_Divider: Page = () => (
  <Section n={3} title="Atelier 1 · Lancer un projet avec l’IA" sub="Du dossier des ventes au plan du projet des Méandres, puis une boîte de réception à reprendre en main." dur="≈ 1 h 45" kind="atelier">
    <SecItem n={1}>Découverte guidée de Copilot dans Outlook et de Copilot Chat</SecItem>
    <SecItem n={2}>Fiche de démarrage, découpage, échéancier, risques, RACI</SecItem>
    <SecItem n={3}>Trier une boîte de réception et préparer une relance</SecItem>
    <SecItem n={4}>Vérifier le plan : ce que l’IA rate</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ─── M3 · Workshop brief ────────────────────────────────────────────────────
const M3Stage = ({ n, t, title, children }: { n: number; t: string; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px', ...dl(n * 110) }}>
    <Num n={n} tone="yellow" size={48} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{children}</div>
    </div>
    <Tag tone="grey" size={21}>
      {t}
    </Tag>
  </div>
);

const M3_Brief: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>L’atelier en un coup d’œil</Title>
    <Lede>En autonomie, chacun sur son poste. Une mission : lancer le projet des Méandres, comme Mathieu cette semaine.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Stage n={1} t="15 min" title="Découvrir l’outil">
        Copilot dans Outlook et Copilot Chat, démonstration guidée
      </M3Stage>
      <M3Stage n={2} t="10 min" title="Cadrer">
        Le dossier des ventes en une fiche de démarrage
      </M3Stage>
      <M3Stage n={3} t="25 min" title="Planifier">
        Découpage, échéancier, risques, RACI, puis Excel ou Planner
      </M3Stage>
      <M3Stage n={4} t="10 min" title="Trier et relancer">
        La boîte de réception de Mathieu, et une relance prête
      </M3Stage>
      <M3Stage n={5} t="15 min" title="Vérifier et présenter">
        Grille de contrôle, puis partage d’écran de 2 ou 3 volontaires
      </M3Stage>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1180, top: 280, width: 620, ...dl(300) }}>
      <Card tone="yellow" icon="flag" title="Le livrable" size={23}>
        Un plan de 6 étapes, des tâches datées avec un responsable, 3 jalons, 5 risques. Et une relance prête à envoyer.
      </Card>
      <Card tone="blue" icon="tool" title="Les outils" size={23} style={{ marginTop: 16 }}>
        Copilot avec votre compte Lessard. Claude pour comparer, si vous l’avez. Puis Excel, Planner ou Smartsheet.
      </Card>
      <Card tone="green" icon="inbox" title="Parcours adjointe" size={23} style={{ marginTop: 16 }}>
        Même dossier, autre point de vue : commencez par l’étape 4, puis la liste des suivis à faire.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · The sales file (the data participants paste) ────────────────────────────────────────────────────
const M3Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 18, padding: '11px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 230, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 25, letterSpacing: '0.04em', color: C.blue }}>{label}</span>
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M3_File: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>Le dossier transmis par Éric : vos données de départ</Title>
    <Lede>Tout ce que l’IA doit savoir. Le reste, elle le devinera… et il faudra le vérifier.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.teal}`, padding: '14px 36px 18px', ...dl(100) }}>
      <M3Field label="Objet">Lot enveloppe du Centre sportif des Méandres : mur-rideau du hall (420 m²), 46 fenêtres, 6 portes d’entrée, 1 verrière.</M3Field>
      <M3Field label="Départ">Lundi 2 novembre. Contrat de 1,2 M$ avec Construction Boréa (EG). Architecte : Atelier Mercier.</M3Field>
      <M3Field label="Échéance">Bâtiment fermé le vendredi 14 mai. Structure d’acier terminée vers le 1ᵉʳ mars.</M3Field>
      <M3Field label="Équipe">Mathieu (chargé de projet), Hélène (direction), Nadia (adjointe), Éric (ventes), Patrice (installation).</M3Field>
      <M3Field label="Délais">Dessins d’atelier : 3 semaines, puis 10 jours ouvrables d’approbation. Verre : 8 semaines après commande.</M3Field>
      <M3Field label="Contraintes">Usine et chantier fermés 2 semaines aux Fêtes. Relevés au chantier une fois la structure terminée.</M3Field>
      <M3Field label="Déjà connu">Exclus : calfeutrage intérieur, stores. Éric a promis à Boréa une pose du hall « dès mars ».</M3Field>
    </div>
  </Frame>
);

// ─── M3 · Guided tour: Copilot in Outlook ──────────────────────────────────────────────────────────────────────────────
// Numbered pin on a mock screen + its explanation in the side column.
const M3Pin = ({ n, x, y }: { n: number; x: number; y: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 24, top: y - 24, width: 48, height: 48, zIndex: 5 }}>
    <div style={{ width: 48, height: 48, borderRadius: 99, background: C.coral, color: '#fff', border: '4px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 26, boxShadow: '0 6px 16px -6px rgba(180,60,40,.7)' }}>
      {n}
    </div>
  </div>
);

const M3Exp = ({ n, title, tone = 'coral', children }: { n: number; title: string; tone?: Tone; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 25, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3Row = ({ cells, head }: { cells: [string, string, string, string]; head?: boolean }) => (
  <div style={{ display: 'flex', borderBottom: `1.5px solid ${C.rule}`, fontSize: head ? 19 : 22, fontWeight: head ? 600 : 400, color: head ? C.muted : C.ink, textTransform: head ? 'uppercase' : 'none', letterSpacing: head ? '0.06em' : 0 }}>
    <span style={{ width: 380, padding: '10px 12px' }}>{cells[0]}</span>
    <span style={{ width: 160, padding: '10px 12px' }}>{cells[1]}</span>
    <span style={{ width: 160, padding: '10px 12px' }}>{cells[2]}</span>
    <span style={{ flex: 1, padding: '10px 12px', color: head ? C.violet : T.violet.fg }}>{cells[3]}</span>
  </div>
);

const M3OBtn = ({ hi, children }: { hi?: number; children: ReactNode }) => (
  <span className={hi ? b.hi(hi) : undefined} style={{ borderRadius: 999, display: 'inline-flex' }}>
    <Tag tone="violet" size={20}>
      <Icon name="sparkles" size={19} /> {children}
    </Tag>
  </span>
);

const M3_Outlook: Page = () => (
  <Frame mod={3} kind="demo" beats={4}>
    <Title>Découverte guidée : Copilot dans Outlook</Title>
    <Lede>Quatre endroits à connaître, directement dans vos courriels. Avec la licence Microsoft 365 Copilot.</Lede>
    <AppWin id="outlook" title="Boîte de réception · Mathieu" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1110, height: 650, ...dl(100) }} pad={30}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>RE: Méandres · dessins d’atelier MR-01</div>
        <AppTile id="copilot" size={46} />
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 22, color: C.muted }}>Atelier Mercier architectes · 14 messages</span>
        <M3OBtn hi={1}>Résumer</M3OBtn>
      </div>
      <div className={b.on(1)} style={{ marginTop: 14, background: T.violet.bg, borderRadius: 12, padding: '12px 18px', fontSize: 22, lineHeight: 1.45, color: C.ink }}>
        <b>Résumé</b> : deux corrections demandées (solin, ancrages). Boréa attend une date de pose. Aucune réponse envoyée.
      </div>
      <div style={{ marginTop: 18, background: C.card, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '16px 18px' }}>
        <M3OBtn hi={2}>Brouillon avec Copilot</M3OBtn>
        <div style={{ marginTop: 10, fontSize: 22, color: C.faint, fontStyle: 'italic' }}>« Confirme les deux corrections pour vendredi et demande la date d’approbation »</div>
        <div className={b.on(2)} style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.ink }}>
          Bonjour, merci pour vos commentaires. Nous vous transmettrons vendredi les dessins corrigés (solin et ancrages)…
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <M3OBtn hi={3}>Accompagnement : ton, clarté</M3OBtn>
      </div>
    </AppWin>
    <M3Pin n={1} x={705} y={428} />
    <M3Pin n={2} x={445} y={606} />
    <M3Pin n={3} x={492} y={800} />
    <M3Pin n={4} x={1208} y={360} />
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Résumer un fil">
        En haut du courriel : l’essentiel de 14 messages, et ce qui reste ouvert.
      </M3Exp>
      <M3Exp n={2} title="Brouillon avec Copilot">
        Vous décrivez la réponse en une phrase, il rédige. Vous relisez.
      </M3Exp>
      <M3Exp n={3} title="Accompagnement">
        Il relit votre courriel : ton, clarté, ce qui pourrait irriter.
      </M3Exp>
      <M3Exp n={4} title="Copilot à droite">
        « Quels courriels de Boréa attendent encore ma réponse ? »
      </M3Exp>
      <div className={A.fade} style={{ fontSize: 21, lineHeight: 1.4, color: C.muted, ...dl(600) }}>
        Sans licence : Copilot Chat, en collant le texte du courriel.
      </div>
    </div>
  </Frame>
);

// ─── M3 · Guided tour: Copilot Chat + an attached file ─────────────────────────────────────────────────────────────
const M3Sub = ({ n, children }: { n: number; children: ReactNode }) => (
  <div className={b.left(1)} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink, padding: '6px 0', ...dl(n * 120) }}>
    <span style={{ width: 22, height: 22, borderRadius: 6, boxShadow: `inset 0 0 0 2px ${C.faint}` }} />
    {children}
  </div>
);

const M3_Chat: Page = () => (
  <Frame mod={3} kind="demo" beats={4}>
    <Title>Découverte guidée : Copilot Chat et le dossier</Title>
    <Lede>Pour tous les comptes Lessard : joindre un document, puis lui poser des questions.</Lede>
    <AppWin id="copilot" title="Copilot Chat · compte Lessard" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1320, height: 650, ...dl(100) }} pad={30}>
      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={b.hi(1)} style={{ borderRadius: 999, display: 'inline-flex' }}>
              <Tag tone="blue" size={20}>
                <Icon name="doc" size={19} /> Soumission_Meandres.pdf
              </Tag>
            </span>
            <span style={{ fontSize: 21, color: C.muted }}>joint à la conversation</span>
          </div>
          <div style={{ marginTop: 16, background: C.panel, borderRadius: 12, padding: '14px 18px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>
            Résume ce dossier pour le chargé de projet : périmètre, exclusions, dates, promesses faites au client.
          </div>
          <div style={{ marginTop: 14 }}>
            <M3Sub n={0}>Périmètre : mur-rideau, 46 fenêtres, 6 entrées, verrière</M3Sub>
            <M3Sub n={1}>Exclus : calfeutrage intérieur, stores</M3Sub>
            <M3Sub n={2}>Échéance : bâtiment fermé le 14 mai</M3Sub>
            <M3Sub n={3}>Promesse : pose du hall « dès mars »</M3Sub>
          </div>
        </div>
        <div style={{ width: 470, flex: 'none', background: C.panel, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 21, fontWeight: 600, color: C.soft }}>Question suivante</span>
            <span className={b.hi(2)} style={{ borderRadius: 999, display: 'inline-flex' }}>
              <Tag tone="violet" size={18}>
                <Icon name="sparkles" size={17} /> Relancer
              </Tag>
            </span>
          </div>
          <div style={{ marginTop: 12, fontSize: 20, lineHeight: 1.45, color: C.muted }}>« Qu’est-ce qui manque pour lancer le projet ? Pose-moi tes questions. »</div>
          <div className={b.on(2)} style={{ marginTop: 14, background: T.violet.bg, borderRadius: 10, padding: '12px 14px', fontSize: 21, lineHeight: 1.45, color: C.ink }}>
            <b>À clarifier</b> : « dès mars » est-il écrit au contrat ? Qui fait les relevés ? Le délai d’approbation de l’architecte ?
          </div>
        </div>
      </div>
    </AppWin>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1480, top: 280, width: 320 }}>
      <Card tone="green" icon="shieldCheck" title="Données protégées" size={23}>
        Le bouclier vert : vous êtes connecté au compte Lessard, pas à un compte personnel.
      </Card>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1480, top: 620, width: 320 }}>
      <Card tone="violet" icon="layers" title="Et avec Claude ?" size={23}>
        Un « projet » garde le dossier et vos consignes d’une conversation à l’autre.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Step 1: charter ───────────────────────────────────────────────────
const M3Ch = ({ n, label, children }: { n: number; label: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ padding: '10px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <Eyebrow c={C.teal} size={20}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 2, fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M3_Charter: Page = () => (
  <Frame mod={3} kind="atelier" beats={5} label="Atelier 1 · Étape 1 · Cadrer">
    <Title>Étape 1 · Le dossier des ventes en une fiche</Title>
    <PromptBox cls={A.left} size={25} style={{ position: 'absolute', left: 120, top: 210, width: 760, ...dl(100) }}>
      Tu es chargé de projet. À partir du dossier transmis par les ventes ci-dessous, rédige la fiche de démarrage en une page : périmètre (inclus / exclu), dates clés, intervenants, engagements pris envers le client. Signale ce qui manque ou se contredit.
      <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, color: C.muted }}>[collez ici le dossier transmis par Éric]</div>
    </PromptBox>
    <Callout cls={A.left} title="Le réflexe" tone="yellow" icon="bulb" size={25} style={{ position: 'absolute', left: 120, top: 620, width: 760, ...dl(300) }}>
      « Signale ce qui manque » : l’IA liste les questions à poser à Éric au lieu d’inventer les réponses.
    </Callout>
    <div className={A.right} style={{ position: 'absolute', left: 940, top: 210, width: 860, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '24px 32px 18px', ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Fiche de démarrage · Méandres</div>
      <M3Ch n={1} label="Périmètre">
        Inclus : mur-rideau, 46 fenêtres, 6 entrées, verrière. Exclu : calfeutrage intérieur, stores.
      </M3Ch>
      <M3Ch n={2} label="Dates clés">
        Structure terminée vers le 1ᵉʳ mars. Bâtiment fermé le vendredi 14 mai.
      </M3Ch>
      <M3Ch n={3} label="Intervenants">
        Boréa (EG), Atelier Mercier (architecte), le verrier, l’équipe de pose de Patrice.
      </M3Ch>
      <M3Ch n={4} label="Engagements">
        Pose du hall « dès mars », promise par Éric à Boréa.
      </M3Ch>
      <div className={b.on(5)} style={{ marginTop: 12, background: T.coral.bg, borderRadius: 10, padding: '10px 14px', fontSize: 22, lineHeight: 1.4, color: T.coral.fg }}>
        <b>À clarifier avec Éric</b> : « dès mars » est-il au contrat ? La structure ne sera prête que vers le 1ᵉʳ mars.
      </div>
    </div>
  </Frame>
);

// ─── M3 · Step 2: work breakdown (animated tree) ────────────────────────────
const M3Lot = ({ i, n, tone, name, t1, t2, t3, added }: { i: number; n: number; tone: Tone; name: string; t1: string; t2: string; t3: string; added?: boolean }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: 120 + i * 240, top: 450, width: 222, ...dl(added ? 0 : i * 90) }}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 96,
        borderRadius: 14,
        background: added ? T.coral.bg : STRONG[tone],
        border: added ? `3px dashed ${C.coral}` : 'none',
        color: added ? T.coral.fg : tone === 'yellow' ? C.ink : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 12px',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 27,
        lineHeight: 1.1,
      }}
    >
      {name}
    </div>
    <div className={added ? undefined : b.fade(2)} style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, ...dl(i * 90) }}>
      <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 12px', fontSize: 21, lineHeight: 1.3, color: C.ink }}>{t1}</div>
      <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 12px', fontSize: 21, lineHeight: 1.3, color: C.ink }}>{t2}</div>
      <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 12px', fontSize: 21, lineHeight: 1.3, color: C.ink }}>{t3}</div>
    </div>
  </div>
);

const M3_Wbs: Page = () => (
  <Frame mod={3} kind="atelier" beats={3} label="Atelier 1 · Étape 2 · Découper">
    <Title>Étape 2 · Le découpage du projet</Title>
    <Lede>Demande : « Découpe le lot en étapes, puis en tâches de 1 à 2 semaines. » Puis on complète.</Lede>
    <div className={A.pop} style={{ position: 'absolute', left: 760, top: 280, width: 400, height: 80, borderRadius: 14, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 30, ...dl(100) }}>
      Lot enveloppe · Méandres
    </div>
    <svg width={1680} height={100} style={{ position: 'absolute', left: 120, top: 360, overflow: 'visible' }}>
      <path d="M840 0 V40 M111 40 H1551 M111 40 V90 M351 40 V90 M591 40 V90 M831 40 V90 M1071 40 V90 M1311 40 V90" stroke={C.faint} strokeWidth={3} fill="none" pathLength={1} className={b.draw(1)} />
      <path d="M1551 40 V90" stroke={C.coral} strokeWidth={3} strokeDasharray="8 8" fill="none" className={b.fade(3)} />
    </svg>
    <M3Lot i={0} n={1} tone="blue" name="Transfert et démarrage" t1="Revue du contrat" t2="Réunion de démarrage" t3="Liste des intervenants" />
    <M3Lot i={1} n={1} tone="teal" name="Dessins d’atelier" t1="Dessins MR et fenêtres" t2="Soumission à l’architecte" t3="Corrections" />
    <M3Lot i={2} n={1} tone="green" name="Achats et livraisons" t1="Commande du verre" t2="Profilés, quincaillerie" t3="Suivi des livraisons" />
    <M3Lot i={3} n={1} tone="violet" name="Fabrication" t1="Cadres en usine" t2="Contrôle qualité" t3="Expédition" />
    <M3Lot i={4} n={1} tone="yellow" name="Installation" t1="Relevés au chantier" t2="Fenêtres et entrées" t3="Mur-rideau, verrière" />
    <M3Lot i={5} n={1} tone="grey" name="Fermeture" t1="Liste de déficiences" t2="Documents de fin" t3="Garanties" />
    <M3Lot i={6} n={3} tone="coral" name="Gestion de projet" t1="Réunions de chantier" t2="Rapports à Hélène" t3="Avis de modification" added />
    <div className={b.on(3)} style={{ position: 'absolute', left: 1100, top: 770, width: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, fontSize: 24, fontWeight: 600, color: T.coral.fg, ...dl(300) }}>
      <Icon name="plus" size={28} sw={3} /> Ajouté par Mathieu : l’IA avait oublié son propre travail.
    </div>
  </Frame>
);

// ─── M3 · Step 3: schedule (animated Gantt) ─────────────────────────────────
const GX = 300; // grid start (inside the chart card)
const GW = 46; // one week
const M3Month = ({ w0, w1, label }: { w0: number; w1: number; label: string }) => (
  <div style={{ position: 'absolute', left: GX + (w0 - 1) * GW, top: 0, width: (w1 - w0 + 1) * GW, height: 40, boxSizing: 'border-box', borderLeft: `2px solid ${C.rule}`, paddingLeft: 10, fontFamily: display, fontWeight: 600, fontSize: 22, letterSpacing: '0.08em', color: C.muted }}>
    {label}
  </div>
);

const M3Gbar = ({ row, w0, w1, tone, label, crit }: { row: number; w0: number; w1: number; tone: Tone; label: string; crit?: boolean }) => (
  <>
    <div className={A.fade} style={{ position: 'absolute', left: 0, top: 56 + row * 66, width: 290, height: 46, display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 500, color: C.ink, ...dl(row * 80) }}>
      {label}
    </div>
    <div className={b.grow(1)} style={{ position: 'absolute', left: GX + (w0 - 1) * GW + 3, top: 60 + row * 66, width: (w1 - w0 + 1) * GW - 6, height: 38, ...dl(row * 110) }}>
      <div
        className={crit ? b.hi(3) : undefined}
        style={{ width: '100%', height: '100%', borderRadius: 8, background: STRONG[tone], boxShadow: crit ? undefined : 'none' }}
      />
    </div>
  </>
);

const M3Mile = ({ w, row, label, d, flip }: { w: number; row: number; label: string; d: number; flip?: boolean }) => (
  <div className={b.pop(2)} style={{ position: 'absolute', left: GX + w * GW - 18, top: 64 + row * 66, width: 30, height: 30, ...dl(d) }}>
    <div style={{ width: 30, height: 30, background: C.coral, transform: 'rotate(45deg)' }} />
    <div style={{ position: 'absolute', ...(flip ? { right: 44 } : { left: 40 }), top: 0, whiteSpace: 'nowrap', fontSize: 21, fontWeight: 700, color: T.coral.fg }}>{label}</div>
  </div>
);

const M3_Gantt: Page = () => (
  <Frame mod={3} kind="atelier" beats={3} label="Atelier 1 · Étape 3 · Planifier">
    <Title>Étape 3 · L’échéancier et ses jalons</Title>
    <Lede>Demande : « Place les étapes sur 28 semaines, avec dépendances, jalons et chemin critique. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100) }}>
      <div style={{ position: 'absolute', left: 30, top: 24, right: 30, bottom: 20 }}>
        <M3Month w0={1} w1={4} label="NOV." />
        <M3Month w0={5} w1={9} label="DÉC." />
        <M3Month w0={10} w1={13} label="JANV." />
        <M3Month w0={14} w1={17} label="FÉVR." />
        <M3Month w0={18} w1={22} label="MARS" />
        <M3Month w0={23} w1={26} label="AVRIL" />
        <M3Month w0={27} w1={28} label="MAI" />
        <div style={{ position: 'absolute', left: GX + 7 * GW, top: 40, width: 2 * GW, height: 540, background: 'repeating-linear-gradient(135deg, #EEF2F5 0 10px, #F7FAFC 10px 20px)' }} />
        <div style={{ position: 'absolute', left: GX + 7 * GW + 8, top: 518, fontSize: 19, color: C.muted }}>Fêtes</div>
        <M3Gbar row={0} w0={1} w1={1} tone="blue" label="Transfert" crit />
        <M3Gbar row={1} w0={1} w1={3} tone="teal" label="Dessins d’atelier" crit />
        <M3Gbar row={2} w0={4} w1={5} tone="teal" label="Approbation" crit />
        <M3Gbar row={3} w0={6} w1={15} tone="green" label="Verre (8 semaines)" crit />
        <M3Gbar row={4} w0={11} w1={19} tone="violet" label="Fabrication" />
        <M3Gbar row={5} w0={18} w1={19} tone="grey" label="Relevés au chantier" crit />
        <M3Gbar row={6} w0={21} w1={28} tone="yellow" label="Installation" crit />
        <M3Mile w={5} row={2} label="Dessins approuvés" d={0} />
        <M3Mile w={15} row={3} label="Verre livré · mi-février" d={200} />
        <M3Mile w={28} row={7} label="Bâtiment fermé · 14 mai" d={400} flip />
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 930, display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, color: C.blue, ...dl(300) }}>
      <Icon name="route" size={28} /> Chemin critique : dessins → approbation → verre → relevés → pose. Un jour de retard ici = un jour de retard au bâtiment fermé.
    </div>
  </Frame>
);

// ─── M3 · Step 4: risks (probability × impact) ──────────────────────────────
const M3Risk = ({ n, x, y, id }: { n: number; x: number; y: number; id: string }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 28, top: y - 28, width: 56, height: 56 }}>
    <div style={{ width: 56, height: 56, borderRadius: 99, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 26, boxShadow: '0 0 0 4px #fff' }}>{id}</div>
  </div>
);

const M3RiskRow = ({ n, id, name, children }: { n: number; id: string; name: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <span style={{ flex: 'none', width: 44, height: 44, borderRadius: 99, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 22 }}>{id}</span>
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{name}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M3Cell = ({ c, r, tone }: { c: number; r: number; tone: Tone }) => (
  <div style={{ position: 'absolute', left: 80 + c * 190, top: r * 190, width: 186, height: 186, background: T[tone].bg, borderRadius: 8 }} />
);

const M3_Risks: Page = () => (
  <Frame mod={3} kind="atelier" beats={6} label="Atelier 1 · Étape 4 · Anticiper">
    <Title>Étape 4 · Le registre des risques</Title>
    <Lede>Demande : « Liste 6 risques, note probabilité et impact, propose une mesure pour chacun. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 660, height: 650, ...dl(100) }}>
      <M3Cell c={0} r={0} tone="yellow" />
      <M3Cell c={1} r={0} tone="coral" />
      <M3Cell c={2} r={0} tone="coral" />
      <M3Cell c={0} r={1} tone="green" />
      <M3Cell c={1} r={1} tone="yellow" />
      <M3Cell c={2} r={1} tone="coral" />
      <M3Cell c={0} r={2} tone="green" />
      <M3Cell c={1} r={2} tone="green" />
      <M3Cell c={2} r={2} tone="yellow" />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 60, height: 570, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 22, fontWeight: 600, color: C.soft }}>Impact →</span>
      </div>
      <div style={{ position: 'absolute', left: 80, top: 584, width: 570, textAlign: 'center', fontSize: 22, fontWeight: 600, color: C.soft }}>Probabilité →</div>
      <M3Risk n={1} x={80 + 190 * 1.5} y={95} id="R1" />
      <M3Risk n={2} x={80 + 190 * 2.5} y={95} id="R2" />
      <M3Risk n={3} x={80 + 190 * 2.5} y={285} id="R3" />
      <M3Risk n={4} x={80 + 190 * 1.5} y={285} id="R4" />
      <M3Risk n={5} x={80 + 190 * 0.5} y={95} id="R5" />
      <M3Risk n={6} x={80 + 190 * 0.5} y={285} id="R6" />
    </div>
    <div style={{ position: 'absolute', left: 860, top: 270, width: 940, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M3RiskRow n={1} id="R1" name="Approbation des dessins en retard">
        Soumettre en deux envois ; relance à J+5 ; point fixe à chaque réunion de chantier.
      </M3RiskRow>
      <M3RiskRow n={2} id="R2" name="Structure d’acier terminée en retard">
        Suivi hebdomadaire avec Boréa ; relevés par zones dès qu’une zone est prête.
      </M3RiskRow>
      <M3RiskRow n={3} id="R3" name="Délai du verre plus long que prévu">
        Commande ferme dès l’approbation ; date de livraison confirmée par écrit.
      </M3RiskRow>
      <M3RiskRow n={4} id="R4" name="Écarts de mesures au chantier">
        Relevés par Patrice avant la fabrication finale ; tolérances indiquées aux dessins.
      </M3RiskRow>
      <M3RiskRow n={5} id="R5" name="Promesse des ventes intenable">
        Clarifier « dès mars » avec Éric, puis avec Boréa, à la réunion de démarrage.
      </M3RiskRow>
      <M3RiskRow n={6} id="R6" name="Météo pendant la pose">
        Jours tampons à l’échéancier ; protections temporaires prêtes.
      </M3RiskRow>
    </div>
  </Frame>
);

// ─── M3 · Step 5: RACI (with the AI's mistakes) ─────────────────────────────
const M3R = ({ v }: { v: string }) => {
  const tone: Tone = v === 'R' ? 'blue' : v === 'A' ? 'coral' : v === 'C' ? 'yellow' : v === 'I' ? 'grey' : 'grey';
  return (
    <span style={{ width: 150, display: 'flex', justifyContent: 'center' }}>
      {v ? (
        <span style={{ width: 52, height: 52, borderRadius: 10, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, color: T[tone].fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 28 }}>{v}</span>
      ) : (
        <span style={{ color: C.faint, fontSize: 26 }}>·</span>
      )}
    </span>
  );
};

const M3RaciRow = ({ d, task, v, flag }: { d: number; task: string; v: [string, string, string, string, string]; flag?: string }) => (
  <div style={{ position: 'relative' }}>
    <div className={b.left(1)} style={{ display: 'flex', alignItems: 'center', height: 76, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
      <span style={{ width: 380, fontSize: 26, color: C.ink }}>{task}</span>
      <M3R v={v[0]} />
      <M3R v={v[1]} />
      <M3R v={v[2]} />
      <M3R v={v[3]} />
      <M3R v={v[4]} />
    </div>
    {flag ? (
      <div className={b.fade(2)} style={{ position: 'absolute', left: -10, top: 4, width: 1140, height: 68, borderRadius: 12, boxShadow: `inset 0 0 0 3px ${C.coral}`, pointerEvents: 'none' }}>
        <span style={{ position: 'absolute', left: 1160, top: 14, whiteSpace: 'nowrap', fontSize: 23, fontWeight: 700, color: T.coral.fg }}>{flag}</span>
      </div>
    ) : null}
  </div>
);

const M3Who = ({ name }: { name: string }) => <span style={{ width: 150, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 26, color: C.ink }}>{name}</span>;

const M3_Raci: Page = () => (
  <Frame mod={3} kind="atelier" beats={2} label="Atelier 1 · Étape 5 · Répartir">
    <Title>Étape 5 · Qui fait quoi ? La matrice RACI</Title>
    <Lede>R réalise · A approuve (un seul !) · C est consulté · I est informé. Premier jet de l’IA :</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1140, ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <span style={{ width: 380 }} />
        <M3Who name="Mathieu" />
        <M3Who name="Hélène" />
        <M3Who name="Nadia" />
        <M3Who name="Éric" />
        <M3Who name="Patrice" />
      </div>
      <M3RaciRow d={0} task="Revue du contrat" v={['R', 'A', 'I', 'C', 'I']} />
      <M3RaciRow d={100} task="Dessins d’atelier" v={['R', 'A', '', '', 'C']} />
      <M3RaciRow d={200} task="Commandes et livraisons" v={['A', 'A', 'R', '', 'I']} flag="Deux A" />
      <M3RaciRow d={300} task="Classement et suivis" v={['A', '', 'R', '', '']} />
      <M3RaciRow d={400} task="Pose au chantier" v={['A', 'I', 'I', '', 'R']} />
      <M3RaciRow d={500} task="Liste de déficiences" v={['R', 'C', 'C', '', 'C']} flag="Aucun A" />
    </div>
    <Callout cls={b.on(2)} title="Pourquoi l’IA se trompe ici" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(400) }}>
      Elle ne connaît pas votre organisation : qui a vraiment l’autorité. La RACI se valide avec les personnes concernées.
    </Callout>
  </Frame>
);

// ─── M3 · From list to board ────────────────────────────────────────────────
const M3Col = ({ x, title, tone, children }: { x: number; title: string; tone: Tone; children?: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: 0, width: 300, height: 600, boxSizing: 'border-box', background: C.panel, borderRadius: 14, padding: '16px 14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ width: 14, height: 14, borderRadius: 99, background: STRONG[tone] }} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.06em', color: C.soft }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const M3Task = ({ i, title, who, due }: { i: number; title: string; who: string; due: string }) => (
  <div className={b.pop(1)} style={{ ...vars({ o: 'left top' }), ...dl(i * 120) }}>
    <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '12px 14px' }}>
      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{title}</div>
      <div className={b.fade(2)} style={{ marginTop: 8, display: 'flex', gap: 8, ...dl(i * 80) }}>
        <Tag tone="blue" size={18}>
          {who}
        </Tag>
        <Tag tone="grey" size={18}>
          {due}
        </Tag>
      </div>
    </div>
  </div>
);

const M3_Board: Page = () => (
  <Frame mod={3} kind="atelier" beats={3} label="Atelier 1 · Transférer dans l’outil">
    <Title>Du plan aux tâches : dans l’outil, pas dans un document</Title>
    <Lede>Un plan qui reste dans une conversation ne se suit pas. On le transforme en tâches.</Lede>
    <Code title="Réponse de l’IA (extrait)" size={21} cls={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 560, ...dl(100) }}>
      {'| Tâche               | Resp.   | Fin    |\n'}
      {'|---------------------|---------|--------|\n'}
      {'| Revue du contrat    | Mathieu | 6 nov  |\n'}
      {'| Classer le dossier  | Nadia   | 6 nov  |\n'}
      {'| Dessins MR-01       | Mathieu | 20 nov |\n'}
      {'| Commander le verre  | Mathieu | 8 déc  |\n'}
      {'| Relevés au chantier | Patrice | 5 mars |'}
    </Code>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 640, width: 560, display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="excel" size={38} /> Coller le tableau dans Excel
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="smartsheet" size={38} /> Smartsheet : importer le fichier Excel
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="planner" size={38} /> Planner : créer le plan avec Copilot
      </div>
    </div>
    <div style={{ position: 'absolute', left: 740, top: 280, width: 1060, height: 600 }}>
      <M3Col x={0} title="À FAIRE" tone="grey">
        <M3Task i={0} title="Classer le dossier du projet" who="Nadia" due="6 nov." />
        <M3Task i={1} title="Commander le verre" who="Mathieu" due="8 déc." />
        <M3Task i={2} title="Relevés au chantier" who="Patrice" due="5 mars" />
      </M3Col>
      <M3Col x={330} title="EN COURS" tone="blue">
        <M3Task i={3} title="Dessins d’atelier MR-01" who="Mathieu" due="20 nov." />
      </M3Col>
      <M3Col x={660} title="À VALIDER" tone="yellow">
        <M3Task i={4} title="Fiche de démarrage" who="Hélène" due="6 nov." />
      </M3Col>
    </div>
    <Callout cls={b.on(3)} title="La valeur" tone="green" icon="check" size={25} style={{ position: 'absolute', left: 740, top: 900, width: 1060, padding: '10px 22px' }}>
      Chaque tâche a un responsable et une date : demain, l’IA pourra suivre et alerter.
    </Callout>
  </Frame>
);

// ─── M3 · Verification checklist ────────────────────────────────────────────
const M3_Check: Page = () => (
  <Frame mod={3} kind="exercice" label="Atelier 1 · Vérifier">
    <Title>Grille de contrôle : votre plan est-il prêt ?</Title>
    <Lede>Passez votre plan à la grille. Ce que l’IA ne coche jamais seule : la réalité.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ width: 1100, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="m3-dates" w={2}>
            Les délais clés ont été validés par une personne qui sait (verrier, bureau technique)
          </CheckItem>
          <CheckItem id="m3-dep">Les dépendances sont indiquées : approbation → verre → pose</CheckItem>
          <CheckItem id="m3-crit">Le chemin critique est identifié</CheckItem>
          <CheckItem id="m3-owner" w={2}>
            Chaque tâche a un responsable (un seul) et une date
          </CheckItem>
          <CheckItem id="m3-cal">Le calendrier réel est respecté : fermeture des Fêtes, congés de l’équipe</CheckItem>
          <CheckItem id="m3-risk">Chaque risque majeur a une mesure et un responsable</CheckItem>
          <CheckItem id="m3-budget">Les exclusions et les promesses des ventes sont reprises</CheckItem>
          <CheckItem id="m3-invent" w={2}>
            Aucun fait inventé : délais, normes, quantités vérifiés
          </CheckItem>
        </div>
        <CheckScore
          max={11}
          label="Plan prêt à présenter ?"
          style={{ width: 540, alignSelf: 'flex-start' }}
          levels={[
            { min: 0, text: 'Premier jet : à retravailler', tone: 'coral' },
            { min: 6, text: 'Presque : complétez les trous', tone: 'yellow' },
            { min: 10, text: 'Prêt à présenter à Hélène', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── M3 · Spot the traps ────────────────────────────────────────────────────
const M3Line = ({ children, warn }: { children: ReactNode; warn?: boolean }) => (
  <div style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: `1.5px solid ${C.rule}`, fontSize: 25, lineHeight: 1.35, color: C.ink, background: warn ? 'transparent' : 'transparent' }}>
    {children}
  </div>
);

const M3_Traps: Page = () => (
  <Frame mod={3} kind="exercice" beats={4} label="Atelier 1 · Vérifier">
    <Title>Repérez les quatre pièges de ce plan généré</Title>
    <Lede>Il a l’air complet. Cherchez avant de cliquer sur les pastilles.</Lede>
    <AppWin id="copilot" title="Plan proposé (extrait)" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1020, ...dl(100) }} pad={26}>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 1 à 3</b> Dessins d’atelier · approbation prévue en 2 jours
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 4 à 11</b> Fabrication du verre, 8 semaines continues
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 13</b> Pose des fenêtres du hall
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 15</b> Relevés au chantier
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 23</b> Début de la pose du mur-rideau, mi-avril
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 28</b> Bâtiment fermé, vendredi 14 mai
      </M3Line>
    </AppWin>
    <M3Pin n={1} x={1110} y={377} />
    <M3Pin n={2} x={1110} y={437} />
    <M3Pin n={3} x={1110} y={497} />
    <M3Pin n={4} x={1110} y={616} />
    <div style={{ position: 'absolute', left: 1190, top: 270, width: 610, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Une durée inventée">
        Le dossier dit 10 jours ouvrables. L’IA a pris une valeur « typique ».
      </M3Exp>
      <M3Exp n={2} title="Les Fêtes oubliées">
        Les semaines 4 à 11 traversent Noël : usine fermée 2 semaines.
      </M3Exp>
      <M3Exp n={3} title="Un ordre impossible">
        Poser avant les relevés, et avant la fin de la structure : dépendance inversée.
      </M3Exp>
      <M3Exp n={4} title="Une promesse oubliée">
        Éric a promis « dès mars » à Boréa. Mi-avril, sans prévenir le client ?
      </M3Exp>
    </div>
    <Callout cls={A.in} title="Votre méthode" tone="yellow" icon="search" size={25} style={{ position: 'absolute', left: 120, top: 780, width: 1020, ...dl(400) }}>
      Confrontez chaque ligne au dossier et au calendrier réel. Demandez à l’IA : « Quelles dates as-tu supposées ? »
    </Callout>
  </Frame>
);

// ─── M3 · Exercise: Mathieu's inbox ─────────────────────────────────────────
const M3Zone = ({ x, icon, tone, label, sub }: { x: number; icon: IconName; tone: Tone; label: string; sub: string }) => (
  <div
    className={A.fade}
    style={{ position: 'absolute', left: x, top: 520, width: 405, height: 420, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, border: `3px dashed ${T[tone].bd}`, padding: '16px 20px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.05, color: T[tone].fg }}>{label}</div>
        <div style={{ fontSize: 20, color: C.soft }}>{sub}</div>
      </div>
    </div>
  </div>
);

const M3_Inbox: Page = () => (
  <Frame mod={3} kind="exercice" beats={1} label="Atelier 1 · Étape 4 · Trier">
    <Title>Étape 4 · La boîte de réception de Mathieu</Title>
    <Lede>Dites-moi où va chaque courriel. Puis demandez la même chose à Copilot, et comparez.</Lede>
    <M3Zone x={120} icon="bolt" tone="coral" label="À traiter" sub="aujourd’hui, par Mathieu" />
    <M3Zone x={545} icon="send" tone="green" label="À Nadia" sub="transférer, avec la consigne" />
    <M3Zone x={970} icon="bell" tone="yellow" label="À relancer" sub="on attend une réponse" />
    <M3Zone x={1395} icon="archive" tone="grey" label="À classer" sub="dans le dossier du projet" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Boréa · Date de pose du hall ? <M1Key tone="coral">TRAITER</M1Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Boréa · Certificat d’assurance à fournir <M1Key tone="green">NADIA</M1Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Vous · Dessins MR-01 envoyés le 23 nov. <M1Key tone="yellow">RELANCER</M1Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      Verrier · Bordereau de livraison 4471 <M1Key tone="grey">CLASSER</M1Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Ville · Formulaire d’accès au chantier <M1Key tone="green">NADIA</M1Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Patrice · Écart de 40 mm à l’axe C <M1Key tone="coral">TRAITER</M1Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      Boréa · Nouvelle liste des contacts <M1Key tone="grey">CLASSER</M1Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Vous · Prix des panneaux d’allège ? <M1Key tone="yellow">RELANCER</M1Key>
    </Drag>
  </Frame>
);

const M3_Work: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · À vous">
    <Title>À vous de jouer !</Title>
    <Lede>Le lancement du projet des Méandres, avec Copilot, puis dans Excel, Planner ou Smartsheet.</Lede>
    <Timer id="m3-work" minutes={45} label="Atelier 1" cls={A.in} style={{ position: 'absolute', left: 120, top: 290, ...dl(100) }} />
    <Checklist cls={A.in} style={{ position: 'absolute', left: 640, top: 290, width: 1160, ...dl(250) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="m3w-1">Fiche de démarrage en une page, avec les points à clarifier</CheckItem>
        <CheckItem id="m3w-2">Découpage : 6 à 8 étapes, tâches de 1 à 2 semaines</CheckItem>
        <CheckItem id="m3w-3">Échéancier : 3 jalons datés et le chemin critique</CheckItem>
        <CheckItem id="m3w-4">5 risques avec une mesure chacun</CheckItem>
        <CheckItem id="m3w-5">RACI vérifiée : un seul A par ligne</CheckItem>
        <CheckItem id="m3w-6">Les tâches dans l’outil, grille de contrôle passée</CheckItem>
        <CheckItem id="m3w-7">La boîte de réception triée, et une relance prête à envoyer</CheckItem>
      </div>
    </Checklist>
    <Callout cls={A.in} title="Coincés ?" tone="blue" icon="chat" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 460, ...dl(400) }}>
      Signalez-le au micro, ou demandez à Copilot de vous poser ses questions.
    </Callout>
  </Frame>
);

// ─── M3 · Debrief ───────────────────────────────────────────────────────────
const M3_Debrief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Débriefing">
    <Title>Débriefing : ce que l’IA a fait… et ce que vous avez fait</Title>
    <Lede>Deux ou trois volontaires partagent leur écran 2 minutes, puis on en discute ensemble.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qu’est-ce que l’IA a bien fait ?" sub="Résumé du dossier, structure, idées de risques…" d={100} />
      <AskCard n={2} title="Qu’avez-vous dû corriger ?" sub="Délais, dépendances, promesses des ventes, oublis" d={220} />
      <AskCard n={3} title="Le referiez-vous avec l’IA ?" sub="Sur votre prochain vrai projet" d={340} />
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage · temps gagné par rapport à un plan fait seul
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Un numéro par personne, à voix haute
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="lose" icon="clock" tone="coral" label="1 · Aucun, voire du temps perdu" />
        <PollRow id="some" icon="clock" tone="yellow" label="2 · Un peu : environ 25 %" />
        <PollRow id="half" icon="clock" tone="teal" label="3 · Beaucoup : environ la moitié" />
        <PollRow id="lots" icon="rocket" tone="green" label="4 · Énormément : plus de la moitié" />
      </Poll>
    </div>
  </Frame>
);

// ─── Day 1 · Wrap-up ────────────────────────────────────────────────────────
const J1Mod = ({ n, tone, title, d, children }: { n: number; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px' }}>
      <Num n={pad(n)} tone={tone} size={56} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const J1_Wrap: Page = () => (
  <Frame mod={3} kind="synthese" label="Bilan du jour 1">
    <Title>Bilan du jour 1</Title>
    <Lede>Ce matin, comprendre. Cet après-midi, planifier avec l’IA et vérifier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 30 }}>
      <J1Mod n={1} tone="blue" title="Introduction à l’IA" d={100}>
        Elle apprend d’exemples, prédit le mot probable, et peut inventer avec aplomb.
      </J1Mod>
      <J1Mod n={2} tone="teal" title="L’IA en gestion de projet" d={220}>
        Planifier, trier, rendre compte, relancer. Une demande en cinq ingrédients.
      </J1Mod>
      <J1Mod n={3} tone="yellow" title="Atelier 1" d={340}>
        Un plan généré en minutes, vérifié ligne par ligne. Une boîte de réception triée.
      </J1Mod>
    </div>
    <Callout cls={A.in} title="Demain" tone="green" icon="calendar" size={27} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(500) }}>
      Réunions et visites de chantier, tri et relances préparés à l’avance, limites et confidentialité, puis le mini-projet de l’atelier 2.
    </Callout>
  </Frame>
);

const J1Ticket = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(n * 140) }}>
    <div style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 30px' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const J1_Exit: Page = () => (
  <Frame mod={3} label="Fin du jour 1">
    <Title>Billet de sortie</Title>
    <Lede>Avant de partir : trois réponses courtes, chacun à son tour.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <J1Ticket n={1} icon="bulb" tone="blue" title="Une chose apprise">
        Ce qui vous a le plus surpris aujourd’hui.
      </J1Ticket>
      <J1Ticket n={2} icon="chat" tone="violet" title="Une question">
        Ce qui reste flou, on y répond demain matin.
      </J1Ticket>
      <J1Ticket n={3} icon="rocket" tone="green" title="Un essai ce soir">
        Une demande en cinq ingrédients sur un de vos vrais courriels.
      </J1Ticket>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 700, display: 'flex', alignItems: 'center', gap: 26, ...dl(600) }}>
      <MiniSquares size={56} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 64, color: C.ink }}>Merci, et à demain 9 h !</span>
    </div>
    <Squares s={170} x={1574} y={700} delay={500} />
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [
  M3_Divider,
  M3_Brief,
  M3_File,
  M3_Outlook,
  M3_Chat,
  M3_Charter,
  M3_Wbs,
  M3_Gantt,
  M3_Risks,
  M3_Raci,
  M3_Board,
  M3_Check,
  M3_Traps,
  M3_Inbox,
  M3_Work,
  M3_Debrief,
  J1_Wrap,
  J1_Exit,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DE L'ATELIER 1 (≈ 13 h 45)

OBJECTIF — Lancer l'atelier avec énergie.

DIRE — « Atelier 1 : lancer un projet avec l'IA. Vous allez faire ce que Mathieu doit faire cette semaine : recevoir le dossier des ventes, en tirer le plan du projet des Méandres, et reprendre en main sa boîte de réception. Avec l'IA, et en vérifiant tout. »

« D'abord une découverte guidée : Copilot dans Outlook, puis Copilot Chat avec un document joint. Puis on construit pas à pas : fiche de démarrage, découpage, échéancier, risques, RACI. On trie une boîte de réception. Et on termine par la partie la plus importante : vérifier ce que l'IA a raté. »

LOGISTIQUE — Atelier individuel : chacun travaille sur son poste, la classe virtuelle dans une fenêtre et Copilot dans une autre. Vérifiez que chacun est connecté à Copilot avec son compte Lessard (bouclier vert visible). Demandez un « prêt » à chacun avant de commencer.

TRANSITION — « Voici l'atelier en un coup d'œil. »`,
  `⏱ 2 min · CONSIGNES

OBJECTIF — Donner le déroulé, le livrable et les outils.

DIRE — « Cinq étapes : 15 minutes de découverte, 10 pour la fiche de démarrage, 25 pour planifier, 10 pour trier la boîte de réception et préparer une relance, 15 pour vérifier et présenter. »

« Le livrable : un plan dans un outil de suivi, pas dans une conversation. Six étapes, des tâches datées avec un responsable, trois jalons, cinq risques. Et une relance prête à envoyer. »

« Les outils : Copilot avec votre compte Lessard. Ceux qui ont Claude peuvent faire la même demande dans les deux et comparer. Pour les tâches : Excel, Planner ou Smartsheet, selon vos habitudes. »

PARCOURS ADJOINTE — Les adjointes suivent le même dossier, mais commencent par l'étape 4 (la boîte de réception), puis préparent la liste des suivis à faire et le plan de classement du dossier. Elles font ensuite les étapes 1 à 3 si le temps le permet.

TRANSITION — « Vos données de départ : le dossier transmis par Éric. »`,
  `⏱ 2 min · LE DOSSIER TRANSMIS PAR ÉRIC

OBJECTIF — Fournir le contexte à coller dans les demandes.

DIRE — « Voici tout ce que l'IA doit savoir : l'objet du contrat, la date de départ, l'échéance, l'équipe, les délais, les contraintes, et ce qui est déjà connu. »

INSISTER — « Ce dossier, c'est l'ingrédient "contexte". Plus il est complet, moins l'IA invente. Notez trois pièges cachés : les 10 jours ouvrables d'approbation, la fermeture des Fêtes, et la promesse d'Éric, "dès mars", alors que la structure ne sera prête que vers le 1er mars. On verra si l'IA en tient compte. »

LOGISTIQUE — Collez ce texte dans le Chat pour que chacun puisse le copier :
« DOSSIER DU PROJET — Centre sportif des Méandres (fictif). Objet : lot enveloppe en aluminium et verre, mur-rideau du hall (420 m²), 46 fenêtres, 6 portes d'entrée, 1 verrière. Départ : lundi 2 novembre. Contrat de 1,2 M$ avec Construction Boréa (entrepreneur général). Architecte : Atelier Mercier. Échéance : bâtiment fermé le vendredi 14 mai. Structure d'acier terminée vers le 1er mars. Équipe : Mathieu (chargé de projet), Hélène (directrice de projets), Nadia (adjointe), Éric (ventes), Patrice (contremaître d'installation). Délais : dessins d'atelier 3 semaines, puis 10 jours ouvrables d'approbation par l'architecte ; verre 8 semaines après la commande. Contraintes : usine et chantier fermés 2 semaines aux Fêtes ; relevés au chantier une fois la structure terminée. Exclusions : calfeutrage intérieur, stores. Déjà connu : Éric a promis à Boréa une pose du hall "dès mars". »

TRANSITION — « Découvrons Copilot dans Outlook. »`,
  `⏱ 6 min · DÉMO COPILOT DANS OUTLOOK (4 clics)

OBJECTIF — Repérer les quatre points d'entrée de Copilot dans Outlook.

DIRE — « Le fil de 14 messages avec l'architecte sur les dessins du mur-rideau. Quatre endroits à connaître. »
→ beat 1 : « En haut du courriel, "Résumer" : l'essentiel des 14 messages, et ce qui reste ouvert. »
→ beat 2 : « "Brouillon avec Copilot" : vous décrivez la réponse en une phrase, il rédige. Vous relisez, vous corrigez, vous envoyez. »
→ beat 3 : « L'accompagnement : il relit votre propre courriel et commente le ton et la clarté. Utile avant un courriel délicat à un client. »
→ beat 4 : « Le volet Copilot, à droite : des questions sur vos courriels. "Quels courriels de Boréa attendent encore ma réponse ?" »

LICENCE — Ces quatre fonctions exigent la licence Microsoft 365 Copilot. Sans elle, on copie le texte du courriel dans Copilot Chat. C'est moins fluide, mais ça marche.

DÉMO EN DIRECT — Si vous avez la licence, montrez « Résumer » et « Brouillon avec Copilot » sur un fil de démonstration (jamais un vrai courriel client à l'écran).

TRANSITION — « Et pour un document : Copilot Chat. »`,
  `⏱ 6 min · DÉMO COPILOT CHAT ET LE DOSSIER (4 clics)

OBJECTIF — Montrer l'usage accessible à tous : joindre un document et l'interroger.

DIRE — « Copilot Chat, avec votre compte Lessard. On joint la soumission et on pose une question précise. »
→ beat 1 : « Le fichier est joint ; la réponse sort en quatre lignes : périmètre, exclusions, échéance, et la promesse d'Éric. »
→ beat 2 : « La relance la plus utile : "Qu'est-ce qui manque pour lancer le projet ? Pose-moi tes questions." Trois questions sortent, dont celle qui compte : "dès mars" est-il au contrat ? »
→ beat 3 : « Le bouclier vert : vous êtes connecté au compte Lessard. Vos données ne servent pas à entraîner le modèle. Pas de bouclier, pas de dossier client. »
→ beat 4 : « Pour ceux qui ont Claude : un "projet" garde les documents et vos consignes d'une conversation à l'autre. Pratique pour un dossier qui dure six mois. »

CONSIGNE — Laissez 5 minutes d'exploration : chacun ouvre Copilot Chat et colle le dossier depuis le Chat.

TRANSITION — « On construit le lancement. Étape 1 : la fiche de démarrage. »`,
  `⏱ 3 min de démonstration + 10 min en autonomie · FICHE DE DÉMARRAGE (5 clics)

OBJECTIF — Produire la fiche de démarrage et apprendre le réflexe « signale ce qui manque ».

DIRE — « À gauche, la demande. Remarquez la dernière phrase : "Signale ce qui manque ou se contredit." »
→ beat 1 : « Le périmètre : inclus et exclu. L'exclu est aussi important que l'inclus : le calfeutrage intérieur et les stores ne sont pas à nous. »
→ beat 2 : « Les dates clés. »
→ beat 3 : « Les intervenants. »
→ beat 4 : « Les engagements pris envers le client. »
→ beat 5 : « Et voilà la contradiction : une pose "dès mars" promise, alors que la structure n'est prête que vers le 1er mars et qu'il faut d'abord faire les relevés. C'est à Éric et à Mathieu de clarifier, pas à l'IA de trancher. »

CONSIGNE — Chacun colle le dossier, lance la demande et note les questions que l'IA renvoie.

LIEN MÉTIER — « Le passage de la vente au projet, c'est là que se perdent les promesses. Une fiche comme celle-ci, relue par Éric, évite bien des surprises. »

TRANSITION — « Étape 2 : le découpage. »`,
  `⏱ 3 min · DÉCOUPAGE (3 clics)

OBJECTIF — Montrer un découpage généré et le compléter.

DIRE — « La demande : découpe le lot en étapes, puis en tâches de 1 à 2 semaines. »
→ beat 1 : « Six étapes apparaissent : transfert, dessins d'atelier, achats et livraisons, fabrication, installation, fermeture. »
→ beat 2 : « Puis les tâches de chaque étape. »
→ beat 3 : « Qu'est-ce qui manque ? Mathieu ajoute une septième colonne : la gestion de projet elle-même. Les réunions de chantier, les rapports à Hélène, les avis de modification. L'IA oublie très souvent le travail du chargé de projet ! »

QUESTION — « Voyez-vous d'autres oublis ? » Pistes : essais d'étanchéité, protection des ouvrages après la pose, échantillons et maquette à faire approuver, documents de fin de projet exigés par l'EG, mobilisation de la grue.

TRANSITION — « Étape 3 : l'échéancier. »`,
  `⏱ 4 min · ÉCHÉANCIER (3 clics)

OBJECTIF — Lire un diagramme de Gantt et le chemin critique.

DIRE — « 28 semaines, du 2 novembre au 14 mai. En hachuré, les Fêtes : usine et chantier fermés. »
→ beat 1 : « Les barres apparaissent : transfert, dessins d'atelier, approbation, verre sur 8 semaines plus les Fêtes, fabrication, relevés en mars, installation jusqu'au 14 mai. »
→ beat 2 : « Trois jalons : dessins approuvés début décembre, verre livré mi-février, bâtiment fermé le 14 mai. »
→ beat 3 : « Le chemin critique, encadré en bleu : dessins, approbation, verre, relevés, pose. Un jour de retard ici, c'est un jour de retard au bâtiment fermé. »

À SOULIGNER — « Ici, l'IA a respecté les Fêtes parce que le dossier les mentionnait. Sans cette ligne dans le contexte, elle les aurait ignorées. On le verra dans les pièges. »

ASTUCE OUTIL — Smartsheet, Planner (vue chronologie) et Excel (avec un modèle de diagramme de Gantt) affichent ce type de vue dès que les tâches ont des dates.

TRANSITION — « Étape 4 du plan : les risques. »`,
  `⏱ 4 min · RISQUES (6 clics)

OBJECTIF — Construire un registre des risques avec l'IA.

DIRE — « La demande : six risques, probabilité, impact, une mesure chacun. » Un clic par risque :
→ beat 1 : « R1, approbation des dessins en retard : impact élevé, probabilité moyenne. »
→ beat 2 : « R2, structure d'acier terminée en retard par l'EG : élevé et probable. Zone rouge. Vous le vivez souvent, je suppose. »
→ beat 3 : « R3, délai du verre plus long que prévu. »
→ beat 4 : « R4, écarts de mesures au chantier. »
→ beat 5 : « R5, la promesse des ventes intenable : peu probable qu'on la tienne, mais grave pour la relation. »
→ beat 6 : « R6, la météo pendant la pose. »

INSISTER — L'IA est excellente pour proposer des risques auxquels on n'a pas pensé. Mais les notes de probabilité et d'impact sont un jugement : c'est votre expérience qui les fixe.

TRANSITION — « Étape 5 : qui fait quoi. »`,
  `⏱ 4 min · RACI (2 clics)

OBJECTIF — Rappeler la RACI et montrer ses erreurs typiques quand l'IA la génère.

DIRE — « R réalise, A approuve, C est consulté, I est informé. Une règle d'or : un seul A par ligne. »
→ beat 1 : « Le premier jet de l'IA. Regardez bien… »
→ beat 2 : « Deux erreurs. Commandes et livraisons : deux A, Mathieu et Hélène. Qui tranche ? Liste de déficiences : aucun A. Personne n'approuve. »

« Pourquoi ? L'IA ne connaît pas votre organisation, ni qui a vraiment l'autorité chez Lessard. La RACI se valide avec les personnes concernées. »

ADJOINTES — Faites remarquer la ligne « Classement et suivis » : Nadia réalise, Mathieu approuve. « C'est ce qu'on formalisera demain avec les règles de transfert. »

TRANSITION — « Les tâches dans l'outil. »`,
  `⏱ 3 min · DANS L'OUTIL (3 clics)

OBJECTIF — Montrer le passage du texte aux tâches suivables.

DIRE — « Un plan qui reste dans une conversation ne se suit pas. À gauche, la réponse de l'IA sous forme de tableau. Trois façons de le transférer : le coller dans Excel, l'importer dans Smartsheet, ou créer le plan avec Copilot dans Planner. »
→ beat 1 : « Les tâches apparaissent sur le tableau. »
→ beat 2 : « Chacune avec son responsable et sa date. »
→ beat 3 : « C'est ce qui permettra demain de suivre et d'alerter. »

ASTUCE — Demandez à Copilot : « Donne-moi ce plan en tableau avec les colonnes Tâche, Responsable, Début, Fin » ; il se colle tel quel dans Excel, puis s'importe dans Smartsheet.

TRANSITION — « Avant de présenter : la grille de contrôle. »`,
  `⏱ 3 min · GRILLE DE CONTRÔLE (interactive)

OBJECTIF — Donner une grille de vérification réutilisable.

ANIMATION — Lisez chaque critère. Chacun l'applique à son propre plan pendant le travail. Au débriefing, cochez la grille à l'écran pour un participant qui partage son écran (certains critères comptent double, ×2).

DIRE — « Les trois critères qui comptent double : des délais validés par quelqu'un qui sait, un seul responsable par tâche, et aucun fait inventé. »

INSISTER — « Ce que l'IA ne coche jamais seule : la réalité. Elle ne sait pas que l'équipe de Patrice est sur un autre chantier en avril, ni que le verrier ferme une semaine de plus cette année. »

TRANSITION — « Entraînons-nous à repérer les pièges. »`,
  `⏱ 4 min · EXERCICE : LES QUATRE PIÈGES (4 clics ou clics sur les pastilles)

OBJECTIF — Exercer l'œil critique sur un plan qui « a l'air complet ».

ANIMATION — Laissez 1 minute pour chercher, chacun pour soi. Puis demandez les trouvailles au micro et révélez un piège par clic (ou cliquez sur les pastilles).
→ beat 1 : Approbation en 2 jours : durée inventée, le dossier dit 10 jours ouvrables.
→ beat 2 : Verre des semaines 4 à 11 : traverse les Fêtes, l'usine ferme 2 semaines.
→ beat 3 : Pose des fenêtres (sem. 13) avant les relevés (sem. 15), et avant la fin de la structure : dépendance inversée.
→ beat 4 : Pose du mur-rideau mi-avril : la promesse « dès mars » d'Éric est ignorée, sans que personne prévienne Boréa.

MÉTHODE — « Confrontez chaque ligne au dossier et au calendrier. Et demandez à l'IA : quelles dates as-tu supposées ? Elle vous le dira souvent. »

TRANSITION — « Dernière étape avant le travail : la boîte de réception. »`,
  `⏱ 6 min · EXERCICE : LA BOÎTE DE RÉCEPTION (glisser-déposer, 1 clic pour le corrigé)

OBJECTIF — Répondre au besoin exprimé par Valérie au cadrage : trier, prioriser, relancer, transférer aux adjointes.

ANIMATION — Pour chaque courriel, demandez une case à voix haute (« traiter », « Nadia », « relancer », « classer ») et glissez-le selon la majorité. Double-cliquer une étiquette la remet à sa place.
→ beat 1 : le corrigé apparaît sur chaque étiquette.

CORRIGÉ —
• À traiter : la date de pose demandée par Boréa, l'écart de 40 mm signalé par Patrice.
• À Nadia : le certificat d'assurance, le formulaire d'accès au chantier.
• À relancer : les dessins MR-01 envoyés sans retour, le prix des panneaux d'allège demandé.
• À classer : le bordereau de livraison, la nouvelle liste des contacts.

DÉBAT — Les adjointes classeront peut-être le bordereau « À Nadia » : très bien, si c'est elle qui le saisit. « La règle de transfert dépend de votre équipe : c'est justement ce qu'on écrira demain. »

PUIS — Collez dans le Chat les huit courriels ci-dessous. Chacun les donne à Copilot avec la demande du module 2 (« Classe-les en quatre groupes… »), compare avec le corrigé, puis demande la relance pour les dessins MR-01.
« 1. Boréa (chargé de projet EG) : Bonjour Mathieu, pouvez-vous nous confirmer la date de début de pose du mur-rideau du hall ? Nous bâtissons l'échéancier des finitions. 2. Boréa : Il nous manque votre certificat d'assurance à jour pour le dossier du chantier. 3. Vous, le 23 novembre : Veuillez trouver ci-joints les dessins d'atelier MR-01 pour approbation. (aucune réponse) 4. Verrier : Bordereau de livraison 4471, ci-joint. 5. Ville de Rivière-Claire : Formulaire d'accès au chantier à remplir pour chaque travailleur avant le 15. 6. Patrice : Relevé fait à l'axe C, on a 40 mm de plus que les plans. On fait quoi ? 7. Boréa : Voici la nouvelle liste des contacts du chantier. 8. Vous, à un fournisseur, il y a 10 jours : Pouvez-vous nous transmettre votre prix pour les panneaux d'allège ? (aucune réponse) »

TRANSITION — « À vous ! »`,
  `⏱ 45 min · TRAVAIL INDIVIDUEL

OBJECTIF — Lancer le projet des Méandres : la fiche, le plan dans un outil de suivi, la boîte de réception triée, une relance.

ANIMATION — Démarrez le minuteur (il continue si vous changez de page). Les participants travaillent seuls, micro coupé. Vous ne voyez pas leurs écrans : faites un point d'étape toutes les 15 minutes (« Où en êtes-vous : étape 1, 2, 3 ou 4 ? »). La pause de 14 h 30 peut être prise pendant l'atelier, selon le rythme.

QUESTIONS À POSER (à la personne qui partage son écran) —
• « Montrez-moi votre demande. Où est le contexte ? »
• « Quelles dates l'IA a-t-elle supposées ? »
• « Qui est le A de cette ligne ? »

AIDE — Quelqu'un est bloqué : invitez-le à partager son écran 2 minutes, ou suggérez « Demandez à Copilot de vous poser les questions qui lui manquent. »

POUR ALLER PLUS LOIN (utilisateurs avancés) — Comparer Copilot et Claude sur la même demande ; demander à Copilot un tableau prêt pour l'import dans Smartsheet ; demander la relance en anglais pour un fournisseur.

SIGNAL — À 5 minutes de la fin, demandez à chacun de passer son plan à la grille de contrôle.

TRANSITION — « Temps écoulé ! Débriefing. »`,
  `⏱ 15 min · DÉBRIEFING

OBJECTIF — Tirer les leçons de l'atelier.

ANIMATION — Deux ou trois volontaires partagent leur écran 2 minutes et répondent aux trois questions ; les autres réagissent au micro ou déposent une capture dans le Chat. Puis sondage : un numéro par personne, à voix haute, cliquez une ligne par réponse.

POINTS À FAIRE ÉMERGER —
• L'IA donne une structure et des idées très vite, et résume un dossier en une minute.
• Elle se trompe sur les délais, les dépendances, les responsabilités : tout ce qui demande de connaître la réalité du chantier.
• Le tri des courriels marche bien… à condition de vérifier la colonne « à traiter ».

LECTURE DU SONDAGE — Souvent « environ la moitié ». Si quelqu'un répond « temps perdu » : demandez pourquoi (demande trop vague ? outil mal maîtrisé ?). C'est précieux.

TRANSITION — « Faisons le bilan de cette journée. »`,
  `⏱ 3 min · BILAN DU JOUR 1

DIRE — « Module 1 : l'IA apprend d'exemples, prédit le mot probable, et peut inventer avec aplomb. Module 2 : quatre usages, planifier, trier, rendre compte, relancer, et une demande en cinq ingrédients. Atelier 1 : un plan généré en quelques minutes, mais vérifié ligne par ligne, et une boîte de réception triée. »

« Demain : les réunions et les visites de chantier, le tri et les relances préparés à l'avance, les limites et la confidentialité, puis le mini-projet de l'atelier 2, si possible sur un de vos vrais dossiers. »

QUESTION — « Qu'est-ce qui vous a le plus surpris aujourd'hui ? »

TRANSITION — « Avant de partir, un billet de sortie. »`,
  `⏱ 3 min · BILLET DE SORTIE

OBJECTIF — Mesurer les acquis et récolter les questions pour demain.

ANIMATION — Tour rapide au micro : chacun donne trois réponses courtes, une chose apprise, une question, un essai à faire ce soir. Notez les questions pour y répondre demain matin.

DIRE — « Je lirai vos questions ce soir et on commencera par y répondre demain matin. Et ce soir, si vous avez cinq minutes : une demande en cinq ingrédients sur un de vos vrais courriels, dans Copilot avec votre compte Lessard. »

À PRÉPARER POUR DEMAIN — Demandez à chacun de penser à un de ses projets en cours pour l'atelier 2 : on le travaillera anonymisé (pas de nom de client, pas de prix, pas d'adresse).

LOGISTIQUE — Rappel : demain 9 h, même lien de classe virtuelle.

CLÔTURE — « Merci pour cette belle journée, et à demain ! »`,
];
// @@NOTES-END
