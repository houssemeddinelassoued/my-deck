// ─── M3 · Divider ───────────────────────────────────────────────────────────
const M3_Divider: Page = () => (
  <Section n={3} title="Atelier 1 · Un plan de projet avec l’IA" sub="Explorer Notion AI ou ClickUp, puis générer et vérifier le plan du projet Limoilou." dur="≈ 1 h 45" kind="atelier">
    <SecItem n={1}>Découverte guidée de Notion AI et de ClickUp Brain</SecItem>
    <SecItem n={2}>Charte, découpage, échéancier, risques, RACI</SecItem>
    <SecItem n={3}>Des tâches dans l’outil, prêtes à suivre</SecItem>
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
    <Lede>En autonomie, chacun sur son poste. Une seule mission : le plan du projet Limoilou, dans un outil.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Stage n={1} t="15 min" title="Découvrir l’outil">
        Notion AI ou ClickUp, démonstration guidée
      </M3Stage>
      <M3Stage n={2} t="10 min" title="Cadrer">
        Charte du projet en une page
      </M3Stage>
      <M3Stage n={3} t="25 min" title="Planifier">
        Découpage, échéancier, risques, RACI
      </M3Stage>
      <M3Stage n={4} t="10 min" title="Transférer">
        Les tâches dans l’outil, avec responsables et dates
      </M3Stage>
      <M3Stage n={5} t="15 min" title="Vérifier et présenter">
        Grille de contrôle, puis partage d’écran de quelques volontaires
      </M3Stage>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1180, top: 280, width: 620, ...dl(300) }}>
      <Card tone="yellow" icon="flag" title="Le livrable" size={26}>
        Un plan dans l’outil : 6 à 8 lots, des tâches datées avec un responsable, 3 jalons, 5 risques.
      </Card>
      <Card tone="blue" icon="tool" title="Les outils" size={26} style={{ marginTop: 22 }}>
        Notion AI ou ClickUp. À défaut : ChatGPT, Gemini, Copilot ou Claude, puis Excel ou Planner.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Karim's file (the data teams paste) ───────────────────────────────
const M3Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 18, padding: '11px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 230, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 25, letterSpacing: '0.04em', color: C.blue }}>{label}</span>
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M3_File: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>Le dossier de Karim : vos données de départ</Title>
    <Lede>Tout ce que l’IA doit savoir. Le reste, elle le devinera… et il faudra le vérifier.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.teal}`, padding: '14px 36px 18px', ...dl(100) }}>
      <M3Field label="Objectif">Ouvrir la 4ᵉ boutique-atelier Vélo Fleuve, 3ᵉ Avenue, Limoilou (Québec), le samedi 10 avril.</M3Field>
      <M3Field label="Départ">Lundi 2 novembre. Bail signé. Local vide de 250 m².</M3Field>
      <M3Field label="Budget">420 000 $ : travaux 230 k$, équipements et TI 75 k$, inventaire initial 70 k$, marketing 25 k$, réserve 20 k$.</M3Field>
      <M3Field label="Équipe">Karim (chargé de projet), Luc (commanditaire), Julie (RH), Maxime (marketing), Annie (TI).</M3Field>
      <M3Field label="Embauches">1 gérant(e), 3 mécaniciens, 4 conseillers à la vente. Mécaniciens rares dans la région.</M3Field>
      <M3Field label="Contraintes">Permis de la Ville : environ 6 semaines. Chantiers fermés pendant les Fêtes. Travaux : 10 semaines.</M3Field>
      <M3Field label="Déjà connu">Le fournisseur de comptoirs a souvent du retard. Logiciel de caisse à choisir parmi deux offres.</M3Field>
    </div>
  </Frame>
);

// ─── M3 · Guided tour: Notion AI ────────────────────────────────────────────
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

const M3_Notion: Page = () => (
  <Frame mod={3} kind="demo" beats={4}>
    <Title>Découverte guidée : Notion AI</Title>
    <Lede>Un espace de pages et de bases de données, avec l’IA partout. Quatre endroits à connaître.</Lede>
    <AppWin id="notion" title="Projet Limoilou · Plan" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1110, height: 650, ...dl(100) }} pad={30}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>Ouverture boutique Limoilou</div>
      <div style={{ marginTop: 14, fontSize: 24, color: C.faint, fontStyle: 'italic' }}>Appuyez sur Espace pour demander à l’IA, ou « / » pour les commandes…</div>
      <div style={{ marginTop: 20, display: 'flex', gap: 14 }}>
        <Tag tone="violet" size={21}>
          <Icon name="sparkles" size={20} /> Rédiger avec l’IA
        </Tag>
        <Tag tone="grey" size={21}>
          Modèle : plan de projet
        </Tag>
      </div>
      <div style={{ marginTop: 26, background: C.card, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>
        <M3Row head cells={['Tâche', 'Responsable', 'Échéance', 'Résumé IA']} />
        <M3Row cells={['Obtenir le permis de la Ville', 'Karim', '18 déc.', 'En attente du plan signé']} />
        <M3Row cells={['Afficher les postes de mécanicien', 'Julie', '7 déc.', 'Offre rédigée, à valider']} />
        <M3Row cells={['Choisir le logiciel de caisse', 'Annie', '22 janv.', '2 offres, démo jeudi']} />
      </div>
    </AppWin>
    <M3Pin n={1} x={940} y={441} />
    <M3Pin n={2} x={700} y={493} />
    <M3Pin n={3} x={1170} y={557} />
    <M3Pin n={4} x={1170} y={305} />
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Demander à l’IA">
        Espace sur une ligne vide : rédiger, résumer, traduire, continuer.
      </M3Exp>
      <M3Exp n={2} title="Modèles et rédaction">
        Partir d’un modèle de plan, ou générer une page entière.
      </M3Exp>
      <M3Exp n={3} title="Colonnes remplies par l’IA">
        Une propriété IA résume ou classe chaque ligne.
      </M3Exp>
      <M3Exp n={4} title="Questions sur l’espace">
        « Quelles tâches de Julie sont en retard ? »
      </M3Exp>
      <div className={A.fade} style={{ fontSize: 21, lineHeight: 1.4, color: C.muted, ...dl(600) }}>
        Fonctions selon le forfait Notion de votre organisation.
      </div>
    </div>
  </Frame>
);

// ─── M3 · Guided tour: ClickUp Brain ────────────────────────────────────────
const M3Sub = ({ n, children }: { n: number; children: ReactNode }) => (
  <div className={b.left(1)} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink, padding: '6px 0', ...dl(n * 120) }}>
    <span style={{ width: 22, height: 22, borderRadius: 6, boxShadow: `inset 0 0 0 2px ${C.faint}` }} />
    {children}
  </div>
);

const M3_ClickUp: Page = () => (
  <Frame mod={3} kind="demo" beats={4}>
    <Title>Découverte guidée : ClickUp Brain</Title>
    <Lede>Un outil de gestion de tâches où l’IA travaille directement sur les tâches et leurs fils.</Lede>
    <AppWin id="clickup" title="Limoilou › Systèmes TI › Tâche" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1320, height: 650, ...dl(100) }} pad={30}>
      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Tag tone="violet" size={20}>
              EN COURS
            </Tag>
            <span style={{ fontSize: 21, color: C.muted }}>Annie · échéance 22 janvier</span>
          </div>
          <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>Choisir le logiciel de caisse</div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: C.soft }}>Sous-tâches</span>
            <span className={b.hi(1)} style={{ borderRadius: 999, display: 'inline-flex' }}>
              <Tag tone="violet" size={19}>
                <Icon name="sparkles" size={18} /> Générer des sous-tâches
              </Tag>
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <M3Sub n={0}>Lister les besoins (caisse, inventaire, rendez-vous)</M3Sub>
            <M3Sub n={1}>Démo des deux fournisseurs</M3Sub>
            <M3Sub n={2}>Comparer coûts sur 3 ans</M3Sub>
            <M3Sub n={3}>Recommandation à Luc</M3Sub>
          </div>
        </div>
        <div style={{ width: 470, flex: 'none', background: C.panel, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 21, fontWeight: 600, color: C.soft }}>Commentaires (23)</span>
            <span className={b.hi(2)} style={{ borderRadius: 999, display: 'inline-flex' }}>
              <Tag tone="violet" size={18}>
                <Icon name="sparkles" size={17} /> Résumer
              </Tag>
            </span>
          </div>
          <div style={{ marginTop: 12, fontSize: 20, lineHeight: 1.45, color: C.muted }}>Annie : l’offre B inclut le module de rendez-vous…</div>
          <div style={{ marginTop: 6, fontSize: 20, lineHeight: 1.45, color: C.muted }}>Karim : et la formation du personnel ?</div>
          <div className={b.on(2)} style={{ marginTop: 14, background: T.violet.bg, borderRadius: 10, padding: '12px 14px', fontSize: 21, lineHeight: 1.45, color: C.ink }}>
            <b>Résumé</b> : l’offre B coûte 12 % de plus mais inclut les rendez-vous et la formation. Décision attendue de Luc.
          </div>
        </div>
      </div>
    </AppWin>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1480, top: 280, width: 320 }}>
      <Card tone="violet" icon="doc" title="Mises à jour de statut" size={23}>
        Un résumé d’avancement rédigé à partir des tâches de la semaine.
      </Card>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1480, top: 600, width: 320 }}>
      <Card tone="violet" icon="search" title="Questions" size={23}>
        « Qu’est-ce qui bloque le lot TI ? » L’IA répond à partir des tâches.
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
    <Title>Étape 1 · La charte du projet en une page</Title>
    <PromptBox cls={A.left} size={25} style={{ position: 'absolute', left: 120, top: 210, width: 760, ...dl(100) }}>
      Tu es chargé de projet. À partir du dossier ci-dessous, rédige la charte du projet en une page : objectif mesurable, périmètre (inclus / exclu), livrables, parties prenantes, critères de réussite. Signale ce qui manque pour la compléter.
      <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, color: C.muted }}>[collez ici le dossier de Karim]</div>
    </PromptBox>
    <Callout cls={A.left} title="Le réflexe" tone="yellow" icon="bulb" size={25} style={{ position: 'absolute', left: 120, top: 620, width: 760, ...dl(300) }}>
      « Signale ce qui manque » : l’IA liste les questions à poser à Luc au lieu d’inventer les réponses.
    </Callout>
    <div className={A.right} style={{ position: 'absolute', left: 940, top: 210, width: 860, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '24px 32px 18px', ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Charte · Boutique Limoilou</div>
      <M3Ch n={1} label="Objectif">
        Ouvrir le 10 avril, dans le budget de 420 k$, avec 8 employés formés.
      </M3Ch>
      <M3Ch n={2} label="Périmètre">
        Inclus : local, équipe, systèmes, lancement. Exclu : vente en ligne, location de vélos.
      </M3Ch>
      <M3Ch n={3} label="Livrables">
        Boutique aménagée, équipe formée, caisse et rendez-vous en ligne, campagne d’ouverture.
      </M3Ch>
      <M3Ch n={4} label="Réussite">
        Ouverture à la date, budget ± 5 %, 300 visiteurs aux portes ouvertes.
      </M3Ch>
      <div className={b.on(5)} style={{ marginTop: 12, background: T.coral.bg, borderRadius: 10, padding: '10px 14px', fontSize: 22, lineHeight: 1.4, color: T.coral.fg }}>
        <b>À confirmer avec Luc</b> : « 300 visiteurs » a été proposé par l’IA. Est-ce le bon objectif ?
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
    <Lede>Demande : « Découpe en lots, puis en tâches de 1 à 2 semaines. » Puis on complète.</Lede>
    <div className={A.pop} style={{ position: 'absolute', left: 760, top: 280, width: 400, height: 80, borderRadius: 14, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 30, ...dl(100) }}>
      Ouverture boutique Limoilou
    </div>
    <svg width={1680} height={100} style={{ position: 'absolute', left: 120, top: 360, overflow: 'visible' }}>
      <path d="M840 0 V40 M111 40 H1551 M111 40 V90 M351 40 V90 M591 40 V90 M831 40 V90 M1071 40 V90 M1311 40 V90" stroke={C.faint} strokeWidth={3} fill="none" pathLength={1} className={b.draw(1)} />
      <path d="M1551 40 V90" stroke={C.coral} strokeWidth={3} strokeDasharray="8 8" fill="none" className={b.fade(3)} />
    </svg>
    <M3Lot i={0} n={1} tone="blue" name="Cadrage" t1="Charte validée" t2="Budget détaillé" t3="Comité de suivi" />
    <M3Lot i={1} n={1} tone="teal" name="Local et travaux" t1="Permis de la Ville" t2="Soumissions" t3="Chantier" />
    <M3Lot i={2} n={1} tone="green" name="Ressources humaines" t1="Affichage des postes" t2="Entrevues" t3="Formation" />
    <M3Lot i={3} n={1} tone="violet" name="Systèmes TI" t1="Logiciel de caisse" t2="Réseau et Wi-Fi" t3="Rendez-vous en ligne" />
    <M3Lot i={4} n={1} tone="yellow" name="Marketing" t1="Campagne locale" t2="Réseaux sociaux" t3="Portes ouvertes" />
    <M3Lot i={5} n={1} tone="grey" name="Ouverture" t1="Inventaire initial" t2="Essais à blanc" t3="Inauguration" />
    <M3Lot i={6} n={3} tone="coral" name="Gestion de projet" t1="Suivi hebdomadaire" t2="Rapports à Luc" t3="Bilan du projet" added />
    <div className={b.on(3)} style={{ position: 'absolute', left: 1100, top: 770, width: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, fontSize: 24, fontWeight: 600, color: T.coral.fg, ...dl(300) }}>
      <Icon name="plus" size={28} sw={3} /> Ajouté par Karim : l’IA avait oublié son propre travail.
    </div>
  </Frame>
);

// ─── M3 · Step 3: schedule (animated Gantt) ─────────────────────────────────
const GX = 300; // grid start (inside the chart card)
const GW = 56; // one week
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
    <Lede>Demande : « Place les lots sur 23 semaines, avec dépendances, jalons et chemin critique. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100) }}>
      <div style={{ position: 'absolute', left: 30, top: 24, right: 30, bottom: 20 }}>
        <M3Month w0={1} w1={4} label="NOV." />
        <M3Month w0={5} w1={9} label="DÉC." />
        <M3Month w0={10} w1={13} label="JANV." />
        <M3Month w0={14} w1={17} label="FÉVR." />
        <M3Month w0={18} w1={22} label="MARS" />
        <M3Month w0={23} w1={23} label="AV." />
        <div style={{ position: 'absolute', left: GX + 7 * GW, top: 40, width: 2 * GW, height: 540, background: 'repeating-linear-gradient(135deg, #EEF2F5 0 10px, #F7FAFC 10px 20px)' }} />
        <div style={{ position: 'absolute', left: GX + 7 * GW + 8, top: 518, fontSize: 19, color: C.muted }}>Fêtes</div>
        <M3Gbar row={0} w0={1} w1={2} tone="blue" label="Cadrage" crit />
        <M3Gbar row={1} w0={2} w1={7} tone="teal" label="Permis de la Ville" crit />
        <M3Gbar row={2} w0={10} w1={18} tone="teal" label="Travaux" crit />
        <M3Gbar row={3} w0={5} w1={19} tone="green" label="Recrutement" />
        <M3Gbar row={4} w0={12} w1={21} tone="violet" label="Systèmes TI" crit />
        <M3Gbar row={5} w0={14} w1={23} tone="yellow" label="Marketing" />
        <M3Gbar row={6} w0={20} w1={23} tone="grey" label="Inventaire et essais" crit />
        <M3Mile w={7} row={1} label="Permis" d={0} />
        <M3Mile w={18} row={2} label="Travaux finis · 5 mars" d={200} />
        <M3Mile w={23} row={7} label="Ouverture · 10 avril" d={400} flip />
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 930, display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, color: C.blue, ...dl(300) }}>
      <Icon name="route" size={28} /> Chemin critique : cadrage → permis → travaux → systèmes → essais. Un jour de retard ici = un jour de retard à l’ouverture.
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
      <M3RiskRow n={1} id="R1" name="Permis en retard">
        Déposer les plans dès la semaine 2 ; relance hebdomadaire à la Ville.
      </M3RiskRow>
      <M3RiskRow n={2} id="R2" name="Pénurie de mécaniciens">
        Afficher dès décembre ; former un mécanicien de Lévis en renfort.
      </M3RiskRow>
      <M3RiskRow n={3} id="R3" name="Retard du fournisseur de comptoirs">
        Commande ferme en janvier, pénalités au contrat, plan B.
      </M3RiskRow>
      <M3RiskRow n={4} id="R4" name="Dépassement du budget des travaux">
        Réserve de 20 k$ ; trois soumissions par lot.
      </M3RiskRow>
      <M3RiskRow n={5} id="R5" name="Caisse non prête à l’ouverture">
        Essais à blanc deux semaines avant ; caisse mobile de secours.
      </M3RiskRow>
      <M3RiskRow n={6} id="R6" name="Peu de clients à l’ouverture">
        Préinscriptions aux portes ouvertes ; partenariat avec un club local.
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
        <M3Who name="Karim" />
        <M3Who name="Luc" />
        <M3Who name="Julie" />
        <M3Who name="Maxime" />
        <M3Who name="Annie" />
      </div>
      <M3RaciRow d={0} task="Charte et budget" v={['R', 'A', 'C', 'C', 'C']} />
      <M3RaciRow d={100} task="Permis et travaux" v={['R', 'A', '', '', 'I']} />
      <M3RaciRow d={200} task="Recrutement" v={['A', 'A', 'R', '', '']} flag="Deux A" />
      <M3RaciRow d={300} task="Caisse et réseau" v={['A', 'I', 'I', '', 'R']} />
      <M3RaciRow d={400} task="Campagne d’ouverture" v={['A', 'C', 'I', 'R', 'I']} />
      <M3RaciRow d={500} task="Inauguration" v={['R', 'C', 'C', 'C', 'C']} flag="Aucun A" />
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
      {'| Tâche               | Resp. | Fin    |\n'}
      {'|---------------------|-------|--------|\n'}
      {'| Déposer les plans   | Karim | 13 nov |\n'}
      {'| Afficher mécaniciens| Julie | 7 déc  |\n'}
      {'| Choisir la caisse   | Annie | 22 jan |\n'}
      {'| Signer comptoirs    | Karim | 15 jan |\n'}
      {'| Lancer la campagne  | Maxime| 1 mars |'}
    </Code>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 640, width: 560, display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="notion" size={38} /> Coller le tableau : Notion crée la base
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="clickup" size={38} /> Importer un CSV, ou générer les tâches
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="planner" size={38} /> Planner : créer le plan avec Copilot
      </div>
    </div>
    <div style={{ position: 'absolute', left: 740, top: 280, width: 1060, height: 600 }}>
      <M3Col x={0} title="À FAIRE" tone="grey">
        <M3Task i={0} title="Afficher les postes de mécanicien" who="Julie" due="7 déc." />
        <M3Task i={1} title="Choisir le logiciel de caisse" who="Annie" due="22 janv." />
        <M3Task i={2} title="Signer le contrat des comptoirs" who="Karim" due="15 janv." />
      </M3Col>
      <M3Col x={330} title="EN COURS" tone="blue">
        <M3Task i={3} title="Déposer les plans à la Ville" who="Karim" due="13 nov." />
      </M3Col>
      <M3Col x={660} title="À VALIDER" tone="yellow">
        <M3Task i={4} title="Charte du projet" who="Luc" due="9 nov." />
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
            Les durées clés ont été validées par une personne qui sait
          </CheckItem>
          <CheckItem id="m3-dep">Les dépendances entre tâches sont indiquées</CheckItem>
          <CheckItem id="m3-crit">Le chemin critique est identifié</CheckItem>
          <CheckItem id="m3-owner" w={2}>
            Chaque tâche a un responsable (un seul) et une date
          </CheckItem>
          <CheckItem id="m3-cal">Le calendrier réel est respecté : Fêtes, congés, semaine de relâche</CheckItem>
          <CheckItem id="m3-risk">Chaque risque majeur a une mesure et un responsable</CheckItem>
          <CheckItem id="m3-budget">Les montants concordent avec le budget de 420 k$</CheckItem>
          <CheckItem id="m3-invent" w={2}>
            Aucun fait inventé : délais de permis, règles, chiffres vérifiés
          </CheckItem>
        </div>
        <CheckScore
          max={11}
          label="Plan prêt à présenter ?"
          style={{ width: 540, alignSelf: 'flex-start' }}
          levels={[
            { min: 0, text: 'Premier jet : à retravailler', tone: 'coral' },
            { min: 6, text: 'Presque : complétez les trous', tone: 'yellow' },
            { min: 10, text: 'Prêt à présenter à Luc', tone: 'green' },
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
    <AppWin id="chatgpt" title="Plan proposé (extrait)" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1020, ...dl(100) }} pad={26}>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 2</b> Dépôt du permis · obtention prévue en 2 semaines
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 4 à 13</b> Travaux d’aménagement, 10 semaines continues
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 12</b> Formation de l’équipe à la caisse
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 15</b> Installation du logiciel de caisse
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 16</b> Affichage des postes de mécanicien
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 23</b> Ouverture, samedi 10 avril
      </M3Line>
    </AppWin>
    <M3Pin n={1} x={1110} y={377} />
    <M3Pin n={2} x={1110} y={437} />
    <M3Pin n={3} x={1110} y={497} />
    <M3Pin n={4} x={1110} y={616} />
    <div style={{ position: 'absolute', left: 1190, top: 270, width: 610, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Une durée inventée">
        Le dossier dit 6 semaines. L’IA a pris une valeur « typique ».
      </M3Exp>
      <M3Exp n={2} title="Les Fêtes oubliées">
        Les semaines 4 à 13 traversent Noël : chantiers fermés 2 semaines.
      </M3Exp>
      <M3Exp n={3} title="Un ordre impossible">
        Former à la caisse avant de l’installer : dépendance inversée.
      </M3Exp>
      <M3Exp n={4} title="Trop tard">
        Mécaniciens rares : en semaine 16, on n’a plus le temps de recruter.
      </M3Exp>
    </div>
    <Callout cls={A.in} title="Votre méthode" tone="yellow" icon="search" size={25} style={{ position: 'absolute', left: 120, top: 780, width: 1020, ...dl(400) }}>
      Confrontez chaque ligne au dossier et au calendrier réel. Demandez à l’IA : « Quelles dates as-tu supposées ? »
    </Callout>
  </Frame>
);

// ─── M3 · Work time ─────────────────────────────────────────────────────────
const M3_Work: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · À vous">
    <Title>À vous de jouer !</Title>
    <Lede>Votre plan du projet Limoilou, dans Notion AI, ClickUp ou votre outil de secours.</Lede>
    <Timer id="m3-work" minutes={45} label="Atelier 1" cls={A.in} style={{ position: 'absolute', left: 120, top: 290, ...dl(100) }} />
    <Checklist cls={A.in} style={{ position: 'absolute', left: 640, top: 290, width: 1160, ...dl(250) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="m3w-1">Charte en une page, avec ce qui manque</CheckItem>
        <CheckItem id="m3w-2">Découpage : 6 à 8 lots, tâches de 1 à 2 semaines</CheckItem>
        <CheckItem id="m3w-3">Échéancier : 3 jalons datés et le chemin critique</CheckItem>
        <CheckItem id="m3w-4">5 risques avec une mesure chacun</CheckItem>
        <CheckItem id="m3w-5">RACI vérifiée : un seul A par ligne</CheckItem>
        <CheckItem id="m3w-6">Les tâches dans l’outil, avec responsable et date</CheckItem>
        <CheckItem id="m3w-7">Grille de contrôle passée</CheckItem>
      </div>
    </Checklist>
    <Callout cls={A.in} title="Coincés ?" tone="blue" icon="chat" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 460, ...dl(400) }}>
      Signalez-le, ou demandez à l’IA de vous poser ses questions.
    </Callout>
  </Frame>
);

// ─── M3 · Debrief ───────────────────────────────────────────────────────────
const M3_Debrief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Débriefing">
    <Title>Débriefing : ce que l’IA a fait… et ce que vous avez fait</Title>
    <Lede>Quelques volontaires partagent leur écran 2 minutes, puis on en discute ensemble.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qu’est-ce que l’IA a bien fait ?" sub="Structure, rapidité, idées de risques…" d={100} />
      <AskCard n={2} title="Qu’avez-vous dû corriger ?" sub="Dates, dépendances, responsables, oublis" d={220} />
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
        Planifier, suivre, rendre compte, communiquer. Une demande en cinq ingrédients.
      </J1Mod>
      <J1Mod n={3} tone="yellow" title="Atelier 1" d={340}>
        Un plan généré en minutes, mais vérifié ligne par ligne : dates, dépendances, RACI.
      </J1Mod>
    </div>
    <Callout cls={A.in} title="Demain" tone="green" icon="calendar" size={27} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(500) }}>
      Comptes rendus et résumés de réunions, suivi et alertes, limites et éthique, puis le mini-projet de l’atelier 2.
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
        Une demande en cinq ingrédients sur votre vrai projet.
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
  M3_Notion,
  M3_ClickUp,
  M3_Charter,
  M3_Wbs,
  M3_Gantt,
  M3_Risks,
  M3_Raci,
  M3_Board,
  M3_Check,
  M3_Traps,
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

DIRE — « Atelier 1 : un plan de projet avec l'IA. Vous allez faire ce que Karim doit faire cette semaine : bâtir le plan du projet Limoilou. Mais avec l'IA, et en vérifiant tout. »

« D'abord une découverte guidée de deux outils : Notion AI et ClickUp. Puis on construit pas à pas : charte, découpage, échéancier, risques, RACI. On transfère les tâches dans l'outil. Et on termine par la partie la plus importante : vérifier ce que l'IA a raté. »

LOGISTIQUE — Atelier individuel : chacun travaille sur son poste, la classe virtuelle ouverte dans une fenêtre et l'outil dans une autre. Vérifiez que chacun a accès à Notion ou ClickUp (versions d'essai gratuites) ou, à défaut, à un assistant générique. Demandez un « prêt » à chacun avant de commencer.

TRANSITION — « Voici l'atelier en un coup d'œil. »`,
  `⏱ 2 min · CONSIGNES

OBJECTIF — Donner le déroulé, le livrable et les outils.

DIRE — « Cinq étapes : 15 minutes de découverte de l'outil, 10 pour la charte, 25 pour planifier, 10 pour transférer les tâches dans l'outil, 15 pour vérifier et présenter. »

« Le livrable : un plan dans l'outil, pas dans une conversation. Six à huit lots, des tâches datées avec un responsable, trois jalons, cinq risques. »

« Les outils : Notion AI ou ClickUp. Si vous n'y avez pas accès, ChatGPT, Gemini, Copilot ou Claude, puis Excel ou Planner pour les tâches. »

ASTUCE — Notion et ClickUp proposent des versions d'essai gratuites ; créez les comptes avant la formation si possible.

TRANSITION — « Vos données de départ : le dossier de Karim. »`,
  `⏱ 2 min · LE DOSSIER DE KARIM

OBJECTIF — Fournir le contexte à coller dans les demandes.

DIRE — « Voici tout ce que l'IA doit savoir : objectif, date de départ, budget détaillé, équipe, embauches, contraintes, et ce qui est déjà connu. »

INSISTER — « Ce dossier, c'est l'ingrédient "contexte". Plus il est complet, moins l'IA invente. Notez trois pièges cachés dans les contraintes : le permis de 6 semaines, les Fêtes, et les mécaniciens rares. On verra si l'IA en tient compte. »

LOGISTIQUE — Collez ce texte dans le clavardage (ou envoyez-le par courriel) pour que chacun puisse le copier.

TRANSITION — « Découvrons maintenant Notion AI. »`,
  `⏱ 6 min · DÉMO NOTION AI (4 clics)

OBJECTIF — Repérer les quatre points d'entrée de l'IA dans Notion.

DIRE — « Notion, c'est un espace de pages et de bases de données. L'IA y est partout. »
→ beat 1 : « Sur une ligne vide, la touche Espace ouvre l'IA : rédiger, résumer, traduire, continuer. »
→ beat 2 : « On peut partir d'un modèle de plan de projet, ou générer une page entière à partir d'une consigne. »
→ beat 3 : « Dans une base de données, une colonne peut être remplie par l'IA : un résumé ou une catégorie pour chaque tâche. »
→ beat 4 : « Et on peut poser des questions sur tout l'espace : quelles tâches de Julie sont en retard ? »

DÉMO EN DIRECT — Si possible, montrez-le dans un vrai espace Notion de démonstration : créez une page « Projet Limoilou », appuyez sur Espace, demandez un plan.

À VÉRIFIER — L'interface évolue souvent et dépend du forfait. Testez avant la session.

TRANSITION — « Même exercice avec ClickUp. »`,
  `⏱ 6 min · DÉMO CLICKUP BRAIN (4 clics)

OBJECTIF — Repérer les usages de l'IA dans un outil de gestion de tâches.

DIRE — « ClickUp, c'est un outil de tâches. Son IA s'appelle Brain et travaille sur les tâches elles-mêmes. »
→ beat 1 : « Générer des sous-tâches à partir du titre et de la description. Quatre sous-tâches pour choisir la caisse. »
→ beat 2 : « Résumer un fil de commentaires : 23 commentaires en trois lignes, avec la décision attendue. »
→ beat 3 : « Rédiger une mise à jour de statut à partir des tâches de la semaine. »
→ beat 4 : « Poser une question : qu'est-ce qui bloque le lot TI ? »

DÉMO EN DIRECT — Si possible, montrez la génération de sous-tâches dans une vraie tâche.

CHOIX — Chacun annonce son outil (« Notion » ou « ClickUp »). Laissez 5 minutes d'exploration libre.

TRANSITION — « On construit le plan. Étape 1 : la charte. »`,
  `⏱ 3 min de démonstration + 10 min en autonomie · CHARTE (5 clics)

OBJECTIF — Produire la charte et apprendre le réflexe « signale ce qui manque ».

DIRE — « À gauche, la demande. Remarquez la dernière phrase : "Signale ce qui manque pour la compléter." »
→ beat 1 : « L'objectif : date, budget, équipe formée. Mesurable. »
→ beat 2 : « Le périmètre : inclus et exclu. L'exclu est aussi important que l'inclus : pas de vente en ligne, pas de location. »
→ beat 3 : « Les livrables. »
→ beat 4 : « Les critères de réussite. »
→ beat 5 : « Et voilà le piège : "300 visiteurs aux portes ouvertes". D'où vient ce chiffre ? Nulle part. L'IA l'a proposé. C'est à Luc de le fixer. »

CONSIGNE — Chacun colle le dossier, lance la demande et note les questions que l'IA renvoie.

TRANSITION — « Étape 2 : le découpage. »`,
  `⏱ 3 min · DÉCOUPAGE (3 clics)

OBJECTIF — Montrer un découpage généré et le compléter.

DIRE — « La demande : découpe en lots, puis en tâches de 1 à 2 semaines. »
→ beat 1 : « Six lots apparaissent : cadrage, local et travaux, RH, TI, marketing, ouverture. »
→ beat 2 : « Puis les tâches de chaque lot. »
→ beat 3 : « Qu'est-ce qui manque ? Karim ajoute un septième lot : la gestion de projet elle-même. Le suivi hebdomadaire, les rapports à Luc, le bilan. L'IA oublie très souvent le travail du chargé de projet ! »

QUESTION — « Voyez-vous d'autres oublis ? » Pistes : assurances, enseigne, ouverture du compte marchand, contrat d'entretien.

TRANSITION — « Étape 3 : l'échéancier. »`,
  `⏱ 4 min · ÉCHÉANCIER (3 clics)

OBJECTIF — Lire un diagramme de Gantt et le chemin critique.

DIRE — « 23 semaines, de novembre à avril. En hachuré, les Fêtes : chantiers fermés. »
→ beat 1 : « Les barres apparaissent : cadrage, permis de 6 semaines, travaux après les Fêtes, recrutement qui commence tôt, TI, marketing, essais. »
→ beat 2 : « Trois jalons : permis obtenu, travaux finis le 5 mars, ouverture le 10 avril. »
→ beat 3 : « Le chemin critique, encadré en bleu : cadrage, permis, travaux, systèmes, essais. Un jour de retard ici, c'est un jour de retard à l'ouverture. »

À SOULIGNER — « Ici, l'IA a respecté les Fêtes parce que le dossier les mentionnait. Sans cette ligne dans le contexte, elle les aurait ignorées. On le verra dans les pièges. »

ASTUCE OUTIL — ClickUp, Notion (vue chronologie) et Planner affichent ce type de diagramme dès que les tâches ont des dates.

TRANSITION — « Étape 4 : les risques. »`,
  `⏱ 4 min · RISQUES (6 clics)

OBJECTIF — Construire un registre des risques avec l'IA.

DIRE — « La demande : six risques, probabilité, impact, une mesure chacun. » Un clic par risque :
→ beat 1 : « R1, permis en retard : impact élevé, probabilité moyenne. »
→ beat 2 : « R2, pénurie de mécaniciens : élevé et probable. Zone rouge. »
→ beat 3 : « R3, retard du fournisseur de comptoirs : on le sait déjà. »
→ beat 4 : « R4, dépassement du budget des travaux. »
→ beat 5 : « R5, caisse non prête : peu probable mais grave. »
→ beat 6 : « R6, peu de clients à l'ouverture. »

INSISTER — L'IA est excellente pour proposer des risques auxquels on n'a pas pensé. Mais les notes de probabilité et d'impact sont un jugement : l'équipe les ajuste.

TRANSITION — « Étape 5 : qui fait quoi. »`,
  `⏱ 4 min · RACI (2 clics)

OBJECTIF — Rappeler la RACI et montrer ses erreurs typiques quand l'IA la génère.

DIRE — « R réalise, A approuve, C est consulté, I est informé. Une règle d'or : un seul A par ligne. »
→ beat 1 : « Le premier jet de l'IA. Regardez bien… »
→ beat 2 : « Deux erreurs. Recrutement : deux A, Karim et Luc. Qui tranche ? Inauguration : aucun A. Personne n'approuve. »

« Pourquoi ? L'IA ne connaît pas votre organisation, ni qui a vraiment l'autorité. La RACI se valide avec les personnes concernées. »

TRANSITION — « Dernière étape : les tâches dans l'outil. »`,
  `⏱ 3 min · DANS L'OUTIL (3 clics)

OBJECTIF — Montrer le passage du texte aux tâches suivables.

DIRE — « Un plan qui reste dans une conversation ne se suit pas. À gauche, la réponse de l'IA sous forme de tableau. Trois façons de le transférer : le coller dans Notion, qui crée la base ; l'importer en CSV ou générer les tâches dans ClickUp ; ou créer le plan avec Copilot dans Planner. »
→ beat 1 : « Les tâches apparaissent sur le tableau. »
→ beat 2 : « Chacune avec son responsable et sa date. »
→ beat 3 : « C'est ce qui permettra demain à l'IA de suivre et d'alerter. »

ASTUCE — Demandez à l'IA : « Donne-moi ce plan en tableau Markdown » ou « en CSV avec les colonnes Tâche, Responsable, Début, Fin ».

TRANSITION — « Avant de présenter : la grille de contrôle. »`,
  `⏱ 3 min · GRILLE DE CONTRÔLE (interactive)

OBJECTIF — Donner une grille de vérification réutilisable.

ANIMATION — Lisez chaque critère. Chacun l'applique à son propre plan pendant le travail. Au débriefing, cochez la grille pour un participant qui partage son écran (certains critères comptent double, ×2).

DIRE — « Les trois critères qui comptent double : des durées validées par quelqu'un qui sait, un seul responsable par tâche, et aucun fait inventé. »

INSISTER — « Ce que l'IA ne coche jamais seule : la réalité. Elle ne sait pas que l'électricien est en vacances, ni que la semaine de relâche tombe en mars. »

TRANSITION — « Entraînons-nous à repérer les pièges. »`,
  `⏱ 4 min · EXERCICE : LES QUATRE PIÈGES (4 clics ou clics sur les pastilles)

OBJECTIF — Exercer l'œil critique sur un plan qui « a l'air complet ».

ANIMATION — Laissez 1 minute au groupe pour chercher. Puis révélez un piège par clic (ou cliquez sur les pastilles).
→ beat 1 : Permis en 2 semaines : durée inventée, le dossier dit 6.
→ beat 2 : Travaux des semaines 4 à 13 : traversent les Fêtes.
→ beat 3 : Formation à la caisse (sem. 12) avant son installation (sem. 15) : dépendance inversée.
→ beat 4 : Mécaniciens affichés en semaine 16 : beaucoup trop tard pour des profils rares.

MÉTHODE — « Confrontez chaque ligne au dossier et au calendrier. Et demandez à l'IA : quelles dates as-tu supposées ? Elle vous le dira souvent. »

TRANSITION — « À vous ! »`,
  `⏱ 45 min · TRAVAIL EN ÉQUIPE

OBJECTIF — Produire le plan du projet Limoilou dans un outil.

ANIMATION — Démarrez le minuteur (il continue si vous changez de page). Les participants travaillent seuls, micro coupé. Vous ne voyez pas leurs écrans : faites un point d'étape toutes les 15 minutes (« Où en êtes-vous : étape 1, 2, 3 ou 4 ? »). La pause de 14 h 30 peut être prise pendant l'atelier, selon le rythme.

QUESTIONS À POSER DANS LE CLAVARDAGE (ou à la personne qui partage son écran) —
• « Montrez-moi votre demande. Où est le contexte ? »
• « Quelles dates l'IA a-t-elle supposées ? »
• « Qui est le A de cette ligne ? »

AIDE — Quelqu'un écrit « bloqué » : invitez-le à partager son écran 2 minutes, ou suggérez « Demandez à l'IA de vous poser les questions qui lui manquent. »

SIGNAL — À 5 minutes de la fin, demandez à chacun de passer son plan à la grille de contrôle.

TRANSITION — « Temps écoulé ! Débriefing. »`,
  `⏱ 15 min · DÉBRIEFING

OBJECTIF — Tirer les leçons de l'atelier.

ANIMATION — Trois ou quatre volontaires partagent leur écran 2 minutes et répondent aux trois questions ; les autres réagissent au micro. Puis sondage : un numéro par personne, à voix haute, cliquez une ligne par réponse.

POINTS À FAIRE ÉMERGER —
• L'IA donne une structure et des idées très vite.
• Elle se trompe sur les dates, les dépendances, les responsabilités : tout ce qui demande de connaître la réalité.
• Le gain de temps est réel… à condition de vérifier.

LECTURE DU SONDAGE — Souvent « environ la moitié ». Si quelqu'un répond « temps perdu » : demandez pourquoi (demande trop vague ? outil mal maîtrisé ?). C'est précieux.

TRANSITION — « Faisons le bilan de cette journée. »`,
  `⏱ 3 min · BILAN DU JOUR 1

DIRE — « Module 1 : l'IA apprend d'exemples, prédit le mot probable, et peut inventer avec aplomb. Module 2 : quatre usages en gestion de projet et une demande en cinq ingrédients. Atelier 1 : un plan généré en quelques minutes, mais vérifié ligne par ligne. »

« Demain : les comptes rendus et résumés de réunions, le suivi et les alertes, les limites et l'éthique, puis le mini-projet complet de l'atelier 2. »

QUESTION — « Qu'est-ce qui vous a le plus surpris aujourd'hui ? »

TRANSITION — « Avant de partir, un billet de sortie. »`,
  `⏱ 3 min · BILLET DE SORTIE

OBJECTIF — Mesurer les acquis et récolter les questions pour demain.

ANIMATION — Tour rapide au micro : chacun donne trois réponses courtes, une chose apprise, une question, un essai à faire ce soir. Notez les questions pour y répondre demain matin.

DIRE — « Je lirai vos questions ce soir et on commencera par y répondre demain matin. Et ce soir, si vous avez cinq minutes : une demande en cinq ingrédients sur votre vrai projet, sans données confidentielles. »

LOGISTIQUE — Rappel : demain 9 h, même lien de classe virtuelle.

CLÔTURE — « Merci pour cette belle journée, et à demain ! »`,
];
// @@NOTES-END
