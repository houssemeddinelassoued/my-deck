// ─── Module 4 · Documents, comptes rendus et synthèses ──────────────────────
const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Documents, comptes
        <br />
        rendus et synthèses
      </>
    }
    sub="Résumer, extraire, comparer, structurer : l’IA lit vite et organise bien. À vous de vérifier qu’elle n’a rien oublié ni inventé."
    dur="13:30 – 14:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · notes brutes → CR → plan d’action
      </Tag>
    }
  >
    <SecItem n={1}>Résumer un document, extraire des informations</SecItem>
    <SecItem n={2}>Comparer plusieurs documents</SecItem>
    <SecItem n={3}>Préparer un compte rendu à partir de notes</SecItem>
    <SecItem n={4}>Créer une procédure</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Résumer pour un lecteur (onglets) ──────────────────────────────────────
const M4Sum = ({ prompt, children }: { prompt: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 28 }}>
    <Bubble who="user" w={520} size={22}>
      {prompt}
    </Bubble>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M4_Resumer: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Résumer un document : pour qui, et pour quoi faire ?</Title>
    <Lede>Le même rapport d’audit énergétique des locaux (18 pages), résumé pour trois lecteurs différents.</Lede>
    <Tabs initial="dir" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="dir" tone="navy" icon="user">
          Le directeur · 2 minutes
        </TabBtn>
        <TabBtn id="equipe" tone="green" icon="users">
          Les salariés · ce qui change
        </TabBtn>
        <TabBtn id="compta" tone="yellow" icon="euro">
          La comptabilité · les coûts
        </TabBtn>
      </div>
      <TabPane id="dir">
        <M4Sum prompt="Résume ce rapport en 3 points pour mon directeur, qui a 2 minutes. Termine par la décision à prendre.">
          <Bullet size={23} tone="navy">Les locaux consomment 30 % de plus que la moyenne, surtout à cause du chauffage.</Bullet>
          <Bullet size={23} tone="navy">Trois travaux sont recommandés ; l’isolation des combles est le plus rentable.</Bullet>
          <Bullet size={23} tone="navy">Des aides publiques peuvent couvrir une partie du coût.</Bullet>
          <div style={{ marginTop: 12, fontWeight: 700, color: C.navy }}>Décision : lancer ou non les devis d’isolation avant fin décembre.</div>
        </M4Sum>
      </TabPane>
      <TabPane id="equipe">
        <M4Sum prompt="Résume ce rapport pour les salariés : uniquement ce qui change pour eux au quotidien, ton simple, 80 mots.">
          Bonne nouvelle : des travaux vont améliorer le confort des bureaux. Dès janvier, le chauffage sera programmé (19 °C en journée, réduit la nuit et le week-end). Pensez à éteindre écrans et imprimantes le soir : c’est le geste le plus efficace. Les éventuels travaux d’isolation seront annoncés à l’avance.
        </M4Sum>
      </TabPane>
      <TabPane id="compta">
        <M4Sum prompt="Extrais du rapport tous les montants (coûts, économies, aides) dans un tableau. Indique la page de chaque chiffre.">
          <div style={{ fontFamily: mono, fontSize: 21, lineHeight: 1.7 }}>
            Isolation combles · coût 18 000 € · économie 4 200 €/an · p. 11
            <br />
            Programmation chauffage · coût 3 500 € · économie 1 800 €/an · p. 12
            <br />
            Remplacement fenêtres · coût 46 000 € · économie 3 100 €/an · p. 13
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: C.coral, fontWeight: 600 }}>→ Les numéros de page servent à vérifier chaque chiffre dans l’original.</div>
        </M4Sum>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 840, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(400) }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>Rapport et chiffres fictifs. Un résumé utile dit <strong style={{ color: C.navy }}>pour qui</strong>, <strong style={{ color: C.navy }}>combien de points</strong> et <strong style={{ color: C.navy }}>ce qu’il faut décider</strong>.</span>
    </div>
  </Frame>
);

// ─── Extraire des informations ──────────────────────────────────────────────
const M4_FIELDS: [string, string, Tone][] = [
  ['Prestataire', 'NetClair SARL', 'blue'],
  ['Durée', '12 mois, renouvelable par tacite reconduction', 'blue'],
  ['Prix', '1 450 € HT / mois, révisable au 1er janvier', 'yellow'],
  ['Préavis de résiliation', '3 mois avant l’échéance, par lettre recommandée', 'coral'],
  ['Pénalités', 'non trouvé dans le document', 'grey'],
];

const M4_Extraire: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>Extraire des informations d’un long document</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 760 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        Contrat de nettoyage · extrait (page 4 sur 14)
      </Eyebrow>
      <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '22px 26px', fontFamily: 'Georgia, serif', fontSize: 20, lineHeight: 1.6, color: C.soft }}>
        <strong>Article 5 – Durée.</strong> Le présent contrat est conclu pour une durée de douze (12) mois à compter de sa signature. Il se renouvelle par tacite reconduction pour des périodes successives de même durée…
        <br />
        <strong>Article 6 – Prix.</strong> En contrepartie des prestations, le Client verse au Prestataire la somme mensuelle de 1 450 € HT, révisable au 1er janvier de chaque année selon l’indice…
        <br />
        <strong>Article 9 – Résiliation.</strong> Chaque partie peut résilier le contrat par lettre recommandée avec accusé de réception, moyennant un préavis de trois (3) mois avant l’échéance…
      </div>
      <div className={A.fade} style={{ marginTop: 18, ...dl(300) }}>
        <Bubble who="user" w={700} size={21}>
          Extrais : prestataire, durée, prix, préavis, pénalités. Tableau à 2 colonnes. Si une info est absente, écris « non trouvé ». N’invente rien.
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 222, width: 860, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden' }}>
      {M4_FIELDS.map(([k2, v, tone], i) => (
        <div key={k2} className={b.fade(i + 1)} style={{ display: 'grid', gridTemplateColumns: '290px 1fr', borderBottom: i < 4 ? `1.5px solid ${C.rule}` : 'none' }}>
          <div style={{ padding: '18px 22px', fontWeight: 700, fontSize: 23, color: C.navy, background: C.panel }}>{k2}</div>
          <div style={{ padding: '18px 22px', fontSize: 23, color: tone === 'grey' ? C.muted : C.ink, fontStyle: tone === 'grey' ? 'italic' : 'normal', boxShadow: `inset 5px 0 0 ${STRONG[tone]}` }}>{v}</div>
        </div>
      ))}
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 940, top: 720, width: 860 }}>
      <Callout title="« non trouvé » est une bonne réponse" tone="green" icon="checkCircle" size={22}>
        Sans cette consigne, l’IA aurait pu inventer une pénalité « standard ». Une case vide se vérifie ; une invention passe inaperçue.
      </Callout>
    </div>
  </Frame>
);

// ─── Comparer plusieurs documents ───────────────────────────────────────────
const M4Diff = ({ n, topic, a, b2, tone, impact }: { n: number; topic: string; a: string; b2: string; tone: Tone; impact: string }) => (
  <div className={b.on(n)} style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr 300px', gap: 0, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, overflow: 'hidden', fontSize: 22 }}>
    <div style={{ padding: '14px 18px', fontWeight: 700, color: C.navy, background: C.panel }}>{topic}</div>
    <div style={{ padding: '14px 18px', color: C.muted, textDecoration: 'line-through' }}>{a}</div>
    <div style={{ padding: '14px 18px', color: C.ink, fontWeight: 600 }}>{b2}</div>
    <div style={{ padding: '14px 18px', background: T[tone].bg, color: T[tone].fg, fontWeight: 600, fontSize: 20 }}>{impact}</div>
  </div>
);

const M4_Comparer: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Comparer deux versions d’un document</Title>
    <Lede>« Compare la version 2024 et la version 2025 du règlement télétravail. Tableau : sujet, avant, après, impact pour les salariés. »</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: '240px 1fr 1fr 300px', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>
      <span style={{ padding: '0 18px' }}>Sujet</span>
      <span style={{ padding: '0 18px' }}>Version 2024</span>
      <span style={{ padding: '0 18px' }}>Version 2025</span>
      <span style={{ padding: '0 18px' }}>Impact</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M4Diff n={1} topic="Jours par semaine" a="2 jours maximum" b2="3 jours maximum" tone="green" impact="Plus de souplesse" />
      <M4Diff n={2} topic="Demande" a="Par email au manager" b2="Via le portail RH, 48 h avant" tone="yellow" impact="Nouvelle démarche" />
      <M4Diff n={3} topic="Indemnité" a="Aucune" b2="2,50 € par jour télétravaillé" tone="green" impact="Gain financier" />
      <M4Diff n={4} topic="Jour de présence" a="Libre" b2="Mardi obligatoire sur site" tone="coral" impact="Contrainte nouvelle" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(400) }}>
      <Callout title="Vérification indispensable" tone="coral" icon="eye" size={23}>
        L’IA peut <strong>manquer une différence</strong> discrète (un mot, un chiffre). Pour un texte qui engage (contrat, règlement), utilisez aussi la fonction « Comparer » de votre traitement de texte.
      </Callout>
    </div>
  </Frame>
);

// ─── Préparer un compte rendu (structure) ───────────────────────────────────
const M4_CR: { icon: IconName; tone: Tone; t: string; d: string }[] = [
  { icon: 'calendar', tone: 'blue', t: 'En-tête', d: 'Réunion, date, lieu, présents, excusés' },
  { icon: 'target', tone: 'violet', t: 'Objet', d: 'Pourquoi on s’est réunis, en une phrase' },
  { icon: 'chat', tone: 'teal', t: 'Points abordés', d: 'Un paragraphe court par sujet' },
  { icon: 'checkCircle', tone: 'green', t: 'Décisions', d: 'Ce qui a été tranché, sans ambiguïté' },
  { icon: 'flag', tone: 'coral', t: 'Actions', d: 'Qui fait quoi, pour quand' },
  { icon: 'clock', tone: 'yellow', t: 'Prochaine réunion', d: 'Date et sujets à suivre' },
];

const M4_CompteRendu: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Préparer un compte rendu : la structure à imposer</Title>
    <Lede>L’IA met en forme vos notes. Donnez-lui le plan : elle le suivra à la lettre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      {M4_CR.map((c, i) => (
        <div key={c.t} className={b.pop(i + 1)} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[c.tone]}`, padding: '24px 26px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <IconTile name={c.icon} tone={c.tone} size={56} />
          <div>
            <div style={{ fontSize: 15, fontFamily: display, fontWeight: 700, letterSpacing: '0.12em', color: C.muted }}>{pad(i + 1)}</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{c.t}</div>
            <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{c.d}</div>
          </div>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(300) }}>
      <CodeDark file="consigne à ajouter" size={22} wrap>
        N’ajoute <Ck>aucune</Ck> décision ni action absente des notes. Si un responsable ou une échéance manque, écris <Cs>[À PRÉCISER]</Cs>. Ne cite pas les propos personnels, seulement les positions.
      </CodeDark>
    </div>
  </Frame>
);

// ─── Notes brutes → CR → plan d’action (stepper) ────────────────────────────
const M4_STEPS = ['Notes brutes', 'Compte rendu', 'Plan d’action'];
const M4_ACT: [string, string, string, Tone][] = [
  ['Demander 3 devis de traiteur', 'Nadia', '20 nov.', 'blue'],
  ['Réserver la salle Loire (35 pers.)', 'Nadia', '18 nov.', 'blue'],
  ['Valider le budget séminaire', 'M. Garnier', '22 nov.', 'violet'],
  ['Préparer le programme de la journée', 'Mme Roux', '29 nov.', 'green'],
  ['Choisir l’intervenant extérieur', '[À PRÉCISER]', '[À PRÉCISER]', 'coral'],
];

const M4_Transformer: Page = () => {
  const [s, setS] = useState(0);
  return (
    <Frame mod={4} kind="demo">
      <Title>Notes brutes → compte rendu → plan d’action</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 14 }}>
        {M4_STEPS.map((l, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Btn tone={i === 0 ? 'grey' : i === 1 ? 'navy' : 'green'} ghost={s !== i} onClick={() => setS(i)} size={23}>
              {i + 1}. {l}
            </Btn>
            {i < 2 ? <Icon name="arrow" size={26} color={C.faint} /> : null}
          </div>
        ))}
      </div>
      <div key={s} className={A.fade} style={{ position: 'absolute', left: 120, top: 280, width: 1680, animationDuration: '400ms' } as CSSProperties}>
        {s === 0 ? (
          <div style={{ background: '#FFFBEA', borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T.yellow.bd}`, padding: '24px 30px', fontFamily: mono, fontSize: 22, lineHeight: 1.65, color: C.soft, transform: 'rotate(-0.4deg)' }}>
            réu séminaire 12/11 – Garnier, Roux, Petit, Nadia (Moreau excusé)
            <br />- séminaire mars, 35 pers, Nantes ou proche
            <br />- budget ?? Garnier valide d’ici 22/11 – pas plus de 15k
            <br />- traiteur : Nadia demande 3 devis avt 20/11
            <br />- salle Loire OK si dispo → Nadia réserve (18/11)
            <br />- programme : Roux s’en charge fin nov
            <br />- intervenant ext. ? idée coach / pas tranché
            <br />- prochaine réu début déc
          </div>
        ) : s === 1 ? (
          <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 32px', fontSize: 22, lineHeight: 1.5, color: C.ink, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 40px' }}>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Compte rendu · Préparation du séminaire</div>
              <div style={{ color: C.muted, fontSize: 20 }}>12 novembre · Présents : M. Garnier, Mme Roux, M. Petit, Nadia · Excusé : M. Moreau</div>
              <div style={{ marginTop: 12 }}>
                <strong>Objet</strong> : organiser le séminaire annuel de mars (35 personnes, Nantes ou proximité).
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Points abordés</strong> : lieu, restauration, budget, programme, intervenant extérieur.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.green }}>Décisions</div>
              <Bullet size={21} tone="green">Plafond de budget : 15 000 €, validation finale le 22/11.</Bullet>
              <Bullet size={21} tone="green">Salle Loire retenue, sous réserve de disponibilité.</Bullet>
              <div style={{ marginTop: 8, fontWeight: 700, color: C.coral }}>Non tranché</div>
              <Bullet size={21} tone="coral">Intervenant extérieur (piste : un coach).</Bullet>
              <div style={{ marginTop: 8 }}>
                <strong>Prochaine réunion</strong> : début décembre [date À PRÉCISER].
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 220px', background: C.navy, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 21 }}>
              <span style={{ padding: '14px 22px' }}>Action</span>
              <span style={{ padding: '14px 22px' }}>Responsable</span>
              <span style={{ padding: '14px 22px' }}>Échéance</span>
            </div>
            {M4_ACT.map(([a, w, d, tone]) => (
              <div key={a} style={{ display: 'grid', gridTemplateColumns: '1fr 280px 220px', fontSize: 23, borderBottom: `1.5px solid ${C.rule}`, boxShadow: `inset 6px 0 0 ${STRONG[tone]}` }}>
                <span style={{ padding: '13px 22px', color: C.ink }}>{a}</span>
                <span style={{ padding: '13px 22px', color: w.startsWith('[') ? C.coral : C.ink, fontWeight: 600 }}>{w}</span>
                <span style={{ padding: '13px 22px', color: d.startsWith('[') ? C.coral : C.ink, fontFamily: mono, fontSize: 21 }}>{d}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(400) }}>
        Cliquez les étapes. Remarquez les [À PRÉCISER] : l’IA signale ce qui manque au lieu de l’inventer.
      </Hint>
    </Frame>
  );
};

// ─── Créer une procédure ────────────────────────────────────────────────────
const M4_PROC = [
  'Accueillir le visiteur et lui demander l’objet de sa visite.',
  'Vérifier son nom sur le planning des rendez-vous du jour.',
  'Lui faire signer le registre et lui remettre un badge « Visiteur ».',
  'Prévenir la personne qu’il vient voir (poste ou Teams).',
  'Lui indiquer la salle d’attente et lui proposer une boisson.',
  'À son départ : récupérer le badge et noter l’heure de sortie.',
];

const M4_Procedure: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Créer une procédure à partir d’une explication</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 640 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        Ce que Nadia explique à l’intérimaire
      </Eyebrow>
      <Bubble who="user" w={600} size={21}>
        Transforme mon explication en procédure numérotée pour l’accueil des visiteurs. Verbes à l’infinitif, une action par étape, 8 étapes max. Ajoute à la fin « en cas de problème ».
        <div style={{ marginTop: 10, fontStyle: 'italic', color: C.soft }}>
          « Quand quelqu’un arrive, tu lui demandes qui il vient voir, tu regardes dans le planning, il signe le registre, tu donnes un badge, tu appelles la personne, tu l’installes… et quand il part tu récupères le badge, n’oublie pas l’heure. »
        </div>
      </Bubble>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 820, top: 200, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, marginBottom: 14 }}>Procédure · Accueil d’un visiteur</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M4_PROC.map((p, i) => (
          <div key={p} className={b.left(i + 1)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Num n={i + 1} tone="teal" size={40} />
            <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{p}</span>
          </div>
        ))}
      </div>
      <div className={b.fade(6)} style={{ marginTop: 16, background: T.coral.bg, borderRadius: 12, padding: '12px 18px', fontSize: 21, color: C.ink }}>
        <strong style={{ color: T.coral.fg }}>En cas de problème</strong> : visiteur non attendu → appeler le responsable avant de le laisser entrer.
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 640, fontSize: 22, lineHeight: 1.45, color: C.soft, ...dl(400) }}>
      <Icon name="checkCircle" size={26} color={C.green} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 10 }} />
      Testez la procédure : <strong style={{ color: C.navy }}>donnez-la à un collègue</strong> qui ne connaît pas la tâche. Là où il hésite, il manque une étape.
    </div>
  </Frame>
);

// ─── Exercice : vérifier un CR généré (hotspots) ────────────────────────────
const M4_Verifier: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Exercice : ce compte rendu généré contient 4 erreurs</Title>
    <Lede>Comparez-le aux notes brutes de la page précédente (séminaire). Trouvez, puis cliquez les pastilles.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', fontSize: 23, lineHeight: 1.75, color: C.ink }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>Compte rendu · Séminaire de mars</div>
      <div>Présents : M. Garnier, Mme Roux, M. Petit, M. Moreau, Nadia</div>
      <div>Budget validé : 15 000 €.</div>
      <div>Traiteur : Nadia demande 3 devis avant le 20 novembre.</div>
      <div>Intervenant : il a été décidé de faire appel à un coach.</div>
      <div>Programme : Mme Roux, pour fin novembre.</div>
      <div>Prochaine réunion : lundi 2 décembre à 14 h.</div>
    </div>
    <Hotspot n={1} x={1150} y={358} title="Excusé devenu présent" w={520}>
      M. Moreau était excusé : il ne doit pas figurer parmi les présents.
    </Hotspot>
    <Hotspot n={2} x={1150} y={398} title="Budget pas encore validé" w={520}>
      Les notes disent : plafond 15 000 €, validation par M. Garnier d’ici le 22/11.
    </Hotspot>
    <Hotspot n={3} x={1150} y={478} title="Décision inventée" w={520}>
      Le coach n’était qu’une idée : « pas tranché ».
    </Hotspot>
    <Hotspot n={4} x={1150} y={559} title="Date inventée" w={520}>
      Les notes disent seulement « début décembre ».
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 740, width: 1060, ...dl(500) }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={23}>
        Ces erreurs sont <strong>plausibles</strong> : rien ne les signale à la lecture. Seule la comparaison avec les notes les révèle.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM M4 ─────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={2}
    title="Extraire sans risque"
    q="Vous demandez à l’IA d’extraire les dates clés d’un contrat de 30 pages. Quelle consigne réduit le plus le risque d’erreur ?"
    explain="Demander la page (ou l’article) de chaque information permet de vérifier rapidement dans l’original, et « non trouvé » empêche l’invention. Les deux ensemble rendent l’extraction contrôlable."
  >
    <Opt why="La demande est polie, mais rien ne permet de vérifier ni n’empêche l’invention.">« Merci de bien vouloir extraire les dates. »</Opt>
    <Opt why="Demander de « bien vérifier » ne change pas la façon dont l’IA produit sa réponse.">« Extrais les dates et vérifie bien. »</Opt>
    <Opt ok why="Exact : la référence permet le contrôle, « non trouvé » empêche l’invention.">
      « Extrais les dates avec l’article et la page de chacune ; écris “non trouvé” si une date est absente. »
    </Opt>
    <Opt why="Plus court n’est pas plus fiable : un résumé peut perdre des dates.">« Résume le contrat en 5 lignes. »</Opt>
  </QcmPage>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Notes brutes → compte rendu → plan d’action"
    defi="synthese"
    who="Seul, puis relecture croisée en binôme"
    minutes={20}
    where={
      <>
        Un <strong>compte rendu</strong> d’une page et un <strong>tableau d’actions</strong> (qui / quoi / quand), plus la liste des corrections faites après relecture.
      </>
    }
    objective={
      <>
        À partir des notes brutes fournies (réunion « déménagement des archives »), produire un compte rendu professionnel puis un plan d’action <strong>fidèle aux notes</strong>.
      </>
    }
    crit={
      <>
        <CheckItem id="a4-c1" size={21}>Les 6 rubriques du CR sont présentes</CheckItem>
        <CheckItem id="a4-c2" size={21}>Aucune décision ni date inventée</CheckItem>
        <CheckItem id="a4-c3" size={21}>Chaque action a un responsable</CheckItem>
        <CheckItem id="a4-c4" size={21}>Les manques sont signalés</CheckItem>
      </>
    }
  >
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.55, background: '#FFFBEA', borderRadius: 10, padding: '10px 14px', color: C.soft }}>
      réu archives 08/11 – Garnier, Petit, Nadia, Leroy (SI)
      <br />- déménagement archives sous-sol → box ext., janvier ?
      <br />- tri avant : Petit propose 2 j, ok Garnier
      <br />- devis transport : Nadia, 2 devis min, avt 25/11
      <br />- docs RH : à part, Leroy voit avec juriste
      <br />- budget pas évoqué / reparler
    </div>
    <Bonus>Demandez ensuite un email de diffusion du CR aux participants, 60 mots.</Bonus>
  </LabPage>
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_Resumer, M4_Extraire, M4_Comparer, M4_CompteRendu, M4_Transformer, M4_Verifier, M4_Procedure, M4_Qcm, M4_Atelier];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 4 · 13:30

OBJECTIF — Relancer l’énergie après le déjeuner et annoncer le module.

DIRE — « Bon retour ! Cet après-midi, on passe des emails aux documents. Module 4 : résumer, extraire, comparer, faire un compte rendu, écrire une procédure. L’IA lit très vite et organise très bien. Mais elle peut oublier un point ou en inventer un : c’est pour ça qu’on va beaucoup parler de vérification. »

ANIMATION — Petit réveil : « Levez la main si vous avez déjà passé plus d’une heure sur un compte rendu. »

TRANSITION — « Premier usage : résumer. »`,
  `⏱ 4 min · RÉSUMER POUR UN LECTEUR (onglets)

OBJECTIF — Montrer qu’un bon résumé dépend du lecteur et de l’usage.

DIRE — « Le même rapport de 18 pages, trois résumés. » Cliquer chaque onglet. « Pour le directeur : trois points et la décision à prendre. Pour les salariés : seulement ce qui change pour eux, avec un ton simple. Pour la comptabilité : les montants, avec la page de chaque chiffre. Ce dernier détail est précieux : vous pouvez vérifier chaque chiffre dans l’original en quelques secondes. »

INSISTER — Le rapport est fictif. Un résumé, c’est des choix : il faut dire à l’IA ce qui compte.

TRANSITION — « Parfois, on ne veut pas un résumé mais une information précise. »`,
  `⏱ 4 min · EXTRAIRE (5 clics)

OBJECTIF — Apprendre à extraire des informations de façon contrôlable.

DIRE — « Un contrat de nettoyage de 14 pages. On veut cinq informations. La demande précise la forme, un tableau, et deux consignes de sécurité : écrire “non trouvé” si l’info est absente, et ne rien inventer. » Un clic par ligne. Au dernier : « Pénalités : non trouvé. C’est une excellente réponse. Sans la consigne, l’IA aurait pu écrire une pénalité qui “se pratique habituellement”. »

INSISTER — Le préavis de résiliation : c’est typiquement l’information qu’on cherche une fois par an, au mauvais moment. Une extraction à la signature, rangée dans le dossier, fait gagner beaucoup de temps.

TRANSITION — « Et pour comparer deux documents ? »`,
  `⏱ 3 min · COMPARER (4 clics)

OBJECTIF — Montrer la comparaison de versions, et sa limite.

DIRE — « Deux versions du règlement télétravail. On demande un tableau avec une colonne impact pour les salariés : c’est elle qui rend la comparaison utile. » Un clic par ligne. « Trois jours au lieu de deux, une nouvelle démarche, une indemnité, et une contrainte nouvelle : le mardi sur site. »

INSISTER — L’IA peut manquer une différence discrète. Pour un contrat ou un règlement, on utilise aussi la fonction de comparaison du traitement de texte, qui ne rate rien.

TRANSITION — « Passons au document le plus fréquent : le compte rendu. »`,
  `⏱ 3 min · STRUCTURE D’UN COMPTE RENDU (6 clics)

OBJECTIF — Donner le plan à imposer à l’IA.

DIRE — Un clic par rubrique : « En-tête, objet, points abordés, décisions, actions, prochaine réunion. Si vous donnez ce plan, l’IA le suit. » Puis la consigne : « Et surtout trois règles : aucune décision absente des notes, À PRÉCISER pour ce qui manque, et on rapporte des positions, pas des propos personnels. »

TRANSITION — « Voyons la transformation complète. »`,
  `⏱ 5 min · NOTES → CR → PLAN D’ACTION (boutons)

OBJECTIF — Montrer la chaîne complète, cœur de l’atelier qui suit.

DIRE — Étape 1 : « Les notes de Nadia : abréviations, points d’interrogation, rien n’est rédigé. » Étape 2 : « Le compte rendu : structuré, avec une rubrique non tranché pour l’intervenant. » Étape 3 : « Le plan d’action : qui, quoi, quand. Et quand l’information manque, À PRÉCISER en rouge. »

ANIMATION — Revenir à l’étape 1 et demander : « L’IA a-t-elle bien tout repris ? » Cela prépare l’exercice suivant.

TRANSITION — « Justement, voici un compte rendu moins sage… »`,
  `⏱ 4 min · EXERCICE : 4 ERREURS (pastilles)

OBJECTIF — Entraîner l’œil à la vérification d’un compte rendu.

DIRE — « Voici un compte rendu généré à partir des mêmes notes, mais sans les consignes de sécurité. Il contient quatre erreurs. Comparez avec les notes. » Revenir si besoin à la page précédente. Cliquer chaque pastille au fil des trouvailles : « Un excusé devenu présent, un budget présenté comme validé, une décision inventée, une date inventée. »

INSISTER — Ces erreurs sont plausibles : on ne les voit pas en lisant, seulement en comparant. C’est la règle d’or du compte rendu : on relit avec les notes à côté.

TRANSITION — « Dernier usage : écrire une procédure. »`,
  `⏱ 3 min · CRÉER UNE PROCÉDURE (6 clics)

OBJECTIF — Montrer comment transformer une explication orale en procédure.

DIRE — « Nadia explique l’accueil des visiteurs à un intérimaire, comme on le fait tous, à l’oral. La demande impose la forme : numéroté, verbes à l’infinitif, une action par étape, et une rubrique en cas de problème. » Un clic par étape. « Le test ultime : donner la procédure à quelqu’un qui ne connaît pas la tâche. Là où il hésite, il manque une étape. »

TRANSITION — « Petit QCM. »`,
  `⏱ 2 min · QCM M4

OBJECTIF — Vérifier le réflexe d’extraction contrôlable.

DIRE — « Quelle consigne réduit le plus le risque d’erreur ? » Faire voter, cliquer la réponse de la majorité, puis révéler la bonne réponse et l’explication.

TRANSITION — « À vous : l’atelier compte rendu. »`,
  `⏱ 20 min · ATELIER 4 (minuteur)

OBJECTIF — Produire un compte rendu et un plan d’action fidèles à des notes brutes.

DIRE — « Voici les notes d’une réunion sur le déménagement des archives. Vingt minutes. Produisez le compte rendu avec les six rubriques, puis le plan d’action. Ensuite, échangez avec votre binôme : chacun relit le travail de l’autre, les notes sous les yeux. »

ANIMATION — Lancer le minuteur. Points à surveiller : la date de janvier suivie d’un point d’interrogation (non décidée), le budget non évoqué (à signaler), les documents RH (sujet sensible à traiter à part). Faire lire un plan d’action en fin d’atelier.

TRANSITION — « Vos documents sont faits. Voyons maintenant comment l’IA peut organiser votre travail. Module 5. »`,
];
// @@NOTES-END
