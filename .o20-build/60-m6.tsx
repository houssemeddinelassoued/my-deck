// ─── Module 6 · Réunions, organisation et productivité ──────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title="Réunions, organisation et productivité"
    sub="Transcription, compte rendu, décisions, tâches, email de suivi : tout ce qui suit une réunion peut être préparé par l’IA."
    dur="45 min"
    labs={<DefiBadge defi="reunion" />}
  >
    <SecItem n={1}>Otter.ai · transcription et synthèse de réunions</SecItem>
    <SecItem n={2}>Fireflies.ai · compte rendu et extraction des actions</SecItem>
    <SecItem n={3}>Notion AI · organiser, rédiger, retrouver</SecItem>
    <SecItem n={4}>Enregistrer une réunion : les règles du jeu</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Le temps caché d’une réunion ───────────────────────────────────────────
const M6Bar = ({ label, sans, avec }: { label: string; sans: number; avec: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', alignItems: 'center', gap: 20 }}>
    <span style={{ fontSize: 24, color: C.ink }}>{label}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className={b.grow(1)} style={{ width: sans * 22, height: 26, borderRadius: 6, background: C.faint }} />
        <span className={b.fade(1)} style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>
          {sans} min
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className={b.grow(2)} style={{ width: Math.max(4, avec * 22), height: 26, borderRadius: 6, background: G.green }} />
        <span className={b.fade(2)} style={{ fontFamily: mono, fontSize: 20, color: C.green, fontWeight: 700 }}>
          {avec} min
        </span>
      </div>
    </div>
  </div>
);

const M6_Cost: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Après la réunion, le vrai travail commence</Title>
    <Lede>Pour une réunion d’une heure, voici ce qui suit habituellement. En gris sans IA, en vert avec.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M6Bar label="Prendre des notes" sans={20} avec={0} />
      <M6Bar label="Rédiger le compte rendu" sans={30} avec={5} />
      <M6Bar label="Lister les tâches" sans={10} avec={2} />
      <M6Bar label="Écrire l’email de suivi" sans={10} avec={3} />
    </div>
    <div className={b.pop(3)} style={{ position: 'absolute', left: 1340, top: 290, width: 460, background: C.navy, borderRadius: 22, padding: '30px 34px', color: '#fff', boxShadow: SHADOW }}>
      <Eyebrow c="#AEB9E6" size={19}>
        Temps administratif
      </Eyebrow>
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1 }}>
        70 → 10
      </div>
      <div style={{ marginTop: 6, fontSize: 28, color: '#DCE3FB' }}>minutes</div>
      <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: '#DCE3FB' }}>
        Et surtout : vous écoutez vraiment pendant la réunion, au lieu de prendre des notes.
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, fontSize: 19, color: C.muted, ...dl(600) }}>
      Ordres de grandeur illustratifs : le temps de relecture reste indispensable.
    </div>
  </Frame>
);

// ─── Outil 14 · Otter.ai ────────────────────────────────────────────────────
const M6Quote = ({ t, who, children }: { t: string; who: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 19, lineHeight: 1.4 }}>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 15, color: C.blue, background: T.blue.bg, borderRadius: 6, padding: '2px 7px', marginTop: 2 }}>{t}</span>
    <span>
      <strong>{who} : </strong>
      {children}
    </span>
  </div>
);

const M6_Otter: Page = () => (
  <ToolPage
    mod={6}
    id="otter"
    tone="blue"
    tagline="la transcription en direct"
    feats={[
      ['mic', 'Transcription en temps réel', 'Le texte s’affiche pendant que l’on parle, avec le nom de chaque intervenant.'],
      ['bot', 'Assistant de réunion', 'Il rejoint seul vos réunions Zoom, Teams ou Meet et prend les notes.'],
      ['layers', 'Résumé et actions', 'À la fin : synthèse, points clés et actions à mener.'],
      ['chat', 'Interroger la réunion', '« Qu’a dit Julie sur le budget ? » : réponse avec l’horodatage.'],
    ]}
    exTitle="poser une question à la réunion"
    prompt="Qu’a dit Julie sur le budget du salon ? Y a-t-il eu une décision ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>Julie a proposé de plafonner le budget à 18 000 €. Aucune décision : le sujet est reporté au comité du 20.</div>
        <M6Quote t="12:41" who="Julie">« Je propose qu’on ne dépasse pas 18 000 €, stand compris. »</M6Quote>
        <M6Quote t="14:05" who="Paul">« On tranchera au comité du 20, avec les devis. »</M6Quote>
      </div>
    }
    watch="Vérifiez que le français est bien pris en charge pour vos usages avant d’en faire votre outil. Et informez toujours les participants qu’ils sont enregistrés."
    tip="cliquez sur une phrase de la transcription pour réécouter le passage : idéal pour vérifier un chiffre ou une citation."
  />
);

// ─── Outil 15 · Fireflies.ai ────────────────────────────────────────────────
const M6Task = ({ who, what, when }: { who: string; what: string; when: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '28px 110px 1fr 110px', alignItems: 'center', gap: 10, fontSize: 19, background: T.grey.bg, borderRadius: 8, padding: '6px 10px' }}>
    <span style={{ width: 20, height: 20, borderRadius: 5, boxShadow: `inset 0 0 0 2px ${C.faint}` }} />
    <strong>{who}</strong>
    <span>{what}</span>
    <span style={{ fontFamily: mono, fontSize: 16, color: C.muted, textAlign: 'right' }}>{when}</span>
  </div>
);

const M6_Fireflies: Page = () => (
  <ToolPage
    mod={6}
    id="fireflies"
    tone="coral"
    tagline="compte rendu et actions"
    feats={[
      ['users', 'Il assiste à vos réunions', 'Transcription dans de nombreuses langues, dont le français.'],
      ['checkCircle', 'Extraction des actions', 'Qui fait quoi, pour quand : les engagements pris à l’oral, listés.'],
      ['search', 'Recherche dans l’historique', 'Retrouvez ce qui a été dit sur un sujet, toutes réunions confondues.'],
      ['plug', 'Envoi automatique', 'Compte rendu poussé vers Notion, Slack, le CRM ou par email.'],
    ]}
    exTitle="compte rendu automatique"
    prompt="Réunion « Lancement salon Pro’Expo » · 42 min · 5 participants"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 19 }}>
          <strong>Résumé :</strong> stand de 24 m² validé, budget à confirmer le 20, recrutement de deux hôtesses.
        </div>
        <strong style={{ fontSize: 16, letterSpacing: '0.08em', color: C.coral }}>ACTIONS DÉTECTÉES</strong>
        <M6Task who="Julie" what="Envoyer les 3 devis de stand" when="17 oct." />
        <M6Task who="Paul" what="Réserver l’hôtel pour l’équipe" when="24 oct." />
        <M6Task who="Amina" what="Brief agence d’hôtesses" when="31 oct." />
      </div>
    }
    watch="Le robot qui rejoint la réunion doit être annoncé : informez et recueillez l’accord des participants. Pas d’enregistrement d’entretiens RH ou de sujets confidentiels."
    tip="paramétrez l’envoi automatique du compte rendu vers Notion ou par email : plus aucun copier-coller après la réunion."
  />
);

// ─── Outil 16 · Notion AI ───────────────────────────────────────────────────
const M6Page = ({ t, d }: { t: string; d: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 16, background: T.grey.bg, borderRadius: 6, padding: '3px 8px', color: C.soft }}>
    <Icon name="doc" size={16} /> {t} · {d}
  </span>
);

const M6_Notion: Page = () => (
  <ToolPage
    mod={6}
    id="notion"
    tone="navy"
    tagline="organiser, rédiger, retrouver"
    feats={[
      ['pen', 'Rédiger dans vos pages', 'Résumer, reformuler, continuer un texte, sans quitter votre document.'],
      ['search', 'Questions sur tout l’espace', '« Où en est le projet X ? » : la réponse, avec les pages sources.'],
      ['mic', 'Notes de réunion', 'Transcription et résumé enregistrés directement dans la bonne page.'],
      ['table', 'Bases de données auto-remplies', 'Résumé, catégorie, priorité : des colonnes remplies par l’IA.'],
    ]}
    exTitle="question sur l’espace de travail"
    prompt="Quelles décisions ont été prises sur le projet Horizon ce mois-ci, et qu’est-ce qui est en retard ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M3Line icon="check" c={C.green}>Lancement décalé au 2 décembre ; budget communication validé</M3Line>
        <M3Line icon="alert" c={C.coral}>En retard : le planning révisé (attendu le 10), la maquette de la page d’accueil</M3Line>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <M6Page t="CR comité Horizon" d="3 oct." />
          <M6Page t="Planning Horizon" d="mis à jour le 8 oct." />
          <M6Page t="Tâches Horizon" d="base" />
        </div>
      </div>
    }
    watch="Il ne répond qu’à partir des pages auxquelles vous avez accès : un espace mal tenu donne des réponses incomplètes. Fonctions IA selon l’offre souscrite."
    tip="dans une base de tâches, ajoutez une colonne « Résumé IA » : chaque fiche se résume toute seule, toujours à jour."
  />
);

// ─── Enregistrer une réunion : les règles ───────────────────────────────────
const M6Flip = ({ sit, verdict, ok, d }: { sit: string; verdict: string; ok: 'ok' | 'mid' | 'ko'; d: number }) => (
  <FlipCard
    w={390}
    h={330}
    cls={A.in}
    style={dl(d)}
    tone="yellow"
    backTone={ok === 'ok' ? 'green' : ok === 'mid' ? 'yellow' : 'coral'}
    front={
      <>
        <Eyebrow c={T.yellow.fg} size={16}>
          Peut-on enregistrer ?
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.35, fontWeight: 600, color: C.ink }}>{sit}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={ok === 'ok' ? T.green.fg : ok === 'mid' ? T.yellow.fg : T.coral.fg} size={20}>
          {ok === 'ok' ? '✓ Oui, en informant' : ok === 'mid' ? '≈ Avec accord explicite' : '✗ Non'}
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{verdict}</div>
      </>
    }
  />
);

const M6_Rules: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Enregistrer une réunion : les règles du jeu</Title>
    <Lede>Une voix est une donnée personnelle. Votez pour chaque situation, puis retournez la carte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 40 }}>
      <M6Flip d={100} sit="Le point d’équipe hebdomadaire" ok="ok" verdict="Oui, si l’outil est autorisé par l’entreprise et que chacun est informé en début de réunion." />
      <M6Flip d={200} sit="Une réunion avec un client" ok="mid" verdict="Uniquement avec son accord explicite, demandé avant de lancer l’enregistrement." />
      <M6Flip d={300} sit="Un entretien annuel ou un entretien RH" ok="ko" verdict="Non : échange individuel, sensible et confidentiel. On prend des notes à la main." />
      <M6Flip d={400} sit="Une réunion sur un sujet juridique ou de santé" ok="ko" verdict="Non : données sensibles. Aucune transcription dans un outil grand public." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, ...dl(700) }}>
      {(
        [
          ['bell', 'Informer', 'Annoncer l’enregistrement au début, et le rappeler dans l’invitation.'],
          ['hand', 'Recueillir l’accord', 'Toute personne peut refuser : on coupe alors l’enregistrement.'],
          ['shieldCheck', 'Outil autorisé', 'Uniquement les outils validés par votre entreprise.'],
          ['archive', 'Supprimer', 'Ne gardez la transcription que le temps nécessaire.'],
        ] as [IconName, string, string][]
      ).map(([ic, t, s]) => (
        <div key={t} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <IconTile name={ic} tone="yellow" size={46} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 22, color: C.ink }}>{t}</div>
            <div style={{ fontSize: 19, lineHeight: 1.38, color: C.soft }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Cas pratique : la chaîne après-réunion ─────────────────────────────────
const M6Node = ({ n, icon, label, ids, out }: { n: number; icon: IconName; label: string; ids: ToolId[]; out: string }) => (
  <div className={b.pop(n)} style={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
    <IconTile name={icon} tone="yellow" size={74} solid />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{label}</div>
    <div style={{ display: 'flex', gap: 6 }}>
      {ids.map((id) => (
        <ToolTile key={id} id={id} size={32} />
      ))}
    </div>
    <div style={{ fontSize: 18, lineHeight: 1.35, color: C.soft, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 12px', minHeight: 72, boxSizing: 'border-box' }}>{out}</div>
  </div>
);

const M6_Pipeline: Page = () => (
  <Frame mod={6} kind="demo" beats={6}>
    <Title>La chaîne après-réunion, étape par étape</Title>
    <Lede>Réunion → transcription → synthèse → décisions → tâches → email de suivi. Chaque → ajoute une étape.</Lede>
    <svg width={1680} height={60} style={{ position: 'absolute', left: 120, top: 297 }} aria-hidden>
      <path d="M125 30 H1555" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M125 30 H1555" dur={4} r={8} color={C.amber} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M6Node n={1} icon="users" label="Réunion" ids={['otter', 'fireflies']} out="Le robot rejoint la visio, annoncé à tous" />
      <M6Node n={2} icon="mic" label="Transcription" ids={['otter', 'fireflies']} out="Texte intégral, intervenants, horodatage" />
      <M6Node n={3} icon="layers" label="Synthèse" ids={['fireflies', 'notion']} out="L’essentiel en 5 lignes" />
      <M6Node n={4} icon="flag" label="Décisions" ids={['fireflies', 'claude']} out="Ce qui est acté, ce qui est reporté" />
      <M6Node n={5} icon="checkCircle" label="Tâches" ids={['notion']} out="Qui, quoi, quand, dans la base projet" />
      <M6Node n={6} icon="send" label="Email de suivi" ids={['copilot', 'chatgpt']} out="Envoyé après relecture humaine" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(400) }}>
      <Callout title="Le point de contrôle" tone="pink" icon="humanCheck" size={24}>
        Entre « décisions » et « email », un humain relit : une décision mal comprise par l’IA, envoyée à dix personnes, devient une vraie décision.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 6 ──────────────────────────────────────────────────────────────
const M6_Lab: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="De la réunion à l’email de suivi"
    defi="reunion"
    who="Groupes de 3 ou 4"
    minutes={20}
    tools={['fireflies', 'otter', 'notion', 'copilot', 'chatgpt']}
    label="Module 6 · Cas pratique"
    objective={
      <>
        À partir d’une réunion, produire <strong>synthèse, décisions, tâches et email de suivi</strong>, en mesurant le temps gagné sur l’administratif.
      </>
    }
    where={
      <>
        Une page de compte rendu (synthèse · décisions · tâches avec responsable et échéance) et l’email de suivi <strong>prêt à envoyer</strong>.
      </>
    }
    crit={
      <>
        <CheckItem id="l6-c1" size={21}>Toutes les décisions retrouvées</CheckItem>
        <CheckItem id="l6-c2" size={21}>Chaque tâche : qui, quoi, quand</CheckItem>
        <CheckItem id="l6-c3" size={21}>Un point en suspens identifié</CheckItem>
        <CheckItem id="l6-c4" size={21}>L’email relu par un humain</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <strong style={{ color: C.navy }}>Option A · en direct :</strong> jouez 3 minutes du comité projet (rôles page suivante) avec Fireflies ou Otter qui transcrit.
      </div>
      <div>
        <strong style={{ color: C.navy }}>Option B · transcription fournie :</strong> utilisez l’extrait de la page suivante.
      </div>
      <div>
        Puis : synthèse et décisions (Notion AI ou assistant) → tâches dans une base Notion → email de suivi (Copilot ou ChatGPT).
      </div>
    </div>
  </LabPage>
);

// ─── La transcription fournie ───────────────────────────────────────────────
const M6Line = ({ t, who, c, children }: { t: string; who: string; c: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.42 }}>
    <span style={{ flex: 'none', width: 62, fontFamily: mono, fontSize: 17, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 92, fontWeight: 700, color: c }}>{who}</span>
    <span style={{ color: C.ink }}>{children}</span>
  </div>
);

const M6_Transcript: Page = () => (
  <Frame mod={6} kind="lab" label="Cas pratique · La transcription">
    <Title size={46}>Comité projet « Nouveaux bureaux » · 9 octobre</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 180, width: 1100, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <ToolTile id="fireflies" size={32} />
        <span style={{ fontSize: 18, color: C.muted }}>Transcription · 35 min · 4 participants · extrait (fictif)</span>
      </div>
      <M6Line t="00:02" who="Sophie" c={C.violet}>On doit trancher la date du déménagement. Le bailleur propose le 15 ou le 29 janvier.</M6Line>
      <M6Line t="03:40" who="Marc" c={C.teal}>Le 15, c’est trop juste pour le câblage. Je préfère le 29.</M6Line>
      <M6Line t="05:12" who="Sophie" c={C.violet}>D’accord, on part sur le 29 janvier.</M6Line>
      <M6Line t="08:30" who="Inès" c={C.pink}>Il faut prévenir les équipes au moins un mois avant. Je m’occupe de la communication.</M6Line>
      <M6Line t="12:05" who="Marc" c={C.teal}>Il nous manque encore deux devis de déménageurs.</M6Line>
      <M6Line t="14:20" who="Sophie" c={C.violet}>Marc, tu peux les avoir pour le 24 octobre ? — Marc : Oui, c’est jouable.</M6Line>
      <M6Line t="19:50" who="Inès" c={C.pink}>Et le parking ? On ne sait toujours pas combien de places on aura.</M6Line>
      <M6Line t="21:10" who="Sophie" c={C.violet}>On en reparle au prochain comité, le 6 novembre.</M6Line>
      <M6Line t="30:00" who="Karim" c={C.blue}>Côté informatique, je dois tester le réseau sur place avant le 15 décembre.</M6Line>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1270, top: 180, width: 530, ...dl(200) }}>
      <CodeDark file="Prompt de traitement" size={19} wrap>
        À partir de cette transcription :{'\n'}
        1. <Cs>Synthèse</Cs> en 3 lignes.{'\n'}
        2. <Cs>Décisions</Cs> prises (et options écartées).{'\n'}
        3. <Cs>Tâches</Cs> en tableau : responsable, action, échéance.{'\n'}
        4. <Cs>Points en suspens</Cs>.{'\n'}
        5. <Cs>Email de suivi</Cs> aux participants, 120 mots.{'\n\n'}
        <Cc>N’invente aucune date ni aucun responsable : écris « à définir ».</Cc>
      </CodeDark>
      <div style={{ marginTop: 18, fontSize: 20, lineHeight: 1.45, color: C.muted }}>
        <strong style={{ color: C.navy }}>Option A, rôles :</strong> Sophie (direction), Marc (services généraux), Inès (RH), Karim (informatique).
      </div>
    </div>
  </Frame>
);

// ─── Corrigé ────────────────────────────────────────────────────────────────
const M6_Fix: Page = () => (
  <Frame mod={6} kind="lab" label="Cas pratique · Un corrigé possible" beats={3}>
    <Title size={46}>Un corrigé possible</Title>
    <div style={{ position: 'absolute', left: 120, top: 180, width: 900, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={b.on(1)} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px' }}>
        <PanelTitle icon="layers">Synthèse et décisions</PanelTitle>
        <div style={{ fontSize: 21, lineHeight: 1.45, color: C.ink }}>
          Déménagement <strong>fixé au 29 janvier</strong> (le 15 est écarté : câblage trop juste). Devis et communication lancés ; parking en suspens.
        </div>
      </div>
      <div className={b.on(2)} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PanelTitle icon="checkCircle">Tâches</PanelTitle>
        <M6Task who="Marc" what="Obtenir 2 devis de déménageurs" when="24 oct." />
        <M6Task who="Karim" what="Tester le réseau sur place" when="15 déc." />
        <M6Task who="Inès" what="Prévenir les équipes" when="avant le 29 déc." />
        <M6Task who="Sophie" what="Parking à l’ordre du jour" when="6 nov." />
      </div>
    </div>
    <ToolWindow id="copilot" title="email de suivi" cls={b.on(3)} style={{ position: 'absolute', left: 1070, top: 180, width: 730, height: 600 }} pad={22}>
      <div style={{ fontSize: 20, lineHeight: 1.5, color: C.ink }}>
        <strong>Objet : Nouveaux bureaux · relevé de décisions du 9 octobre</strong>
        <br />
        <br />
        Bonjour à tous,
        <br />
        Merci pour ce comité. La date du déménagement est fixée au <strong>29 janvier</strong>.
        <br />
        <br />
        Prochaines étapes : Marc nous transmet deux devis de déménageurs d’ici le 24 octobre ; Karim teste le réseau sur place avant le 15 décembre ; Inès informe les équipes au plus tard un mois avant.
        <br />
        <br />
        Le parking reste à traiter : il sera à l’ordre du jour du comité du 6 novembre.
        <br />
        <br />
        Bonne journée, Sophie
      </div>
    </ToolWindow>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 810, width: 1680 }}>
      <Callout title="Remarquez" tone="coral" icon="eye" size={22}>
        L’échéance d’Inès n’a pas été dite en réunion : elle est <strong>déduite</strong> (« un mois avant »). Un humain doit la confirmer avant l’envoi.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M6 ────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz · Module 6</Title>
    <QuizSeries y={200}>
      <QuizQ q="Avant de lancer Fireflies ou Otter en réunion, vous devez…" explain="La voix est une donnée personnelle : on informe les participants et on recueille leur accord, avec un outil autorisé par l’entreprise.">
        <QOpt>rien : le robot est discret</QOpt>
        <QOpt ok>informer les participants et recueillir leur accord</QOpt>
        <QOpt>couper les caméras</QOpt>
      </QuizQ>
      <QuizQ q="Quel outil sert d’abord à extraire automatiquement les actions (qui, quoi, quand) d’une réunion ?" explain="Fireflies.ai produit le compte rendu et détecte les actions et engagements pris à l’oral.">
        <QOpt ok>Fireflies.ai</QOpt>
        <QOpt>DeepL</QOpt>
        <QOpt>Adobe Firefly</QOpt>
      </QuizQ>
      <QuizQ q="« Où en est le projet Horizon ? » Pour une réponse tirée de vos pages de projet, quel outil ?" explain="Notion AI répond à partir de tout votre espace de travail Notion, avec les pages sources.">
        <QOpt>Consensus</QOpt>
        <QOpt ok>Notion AI</QOpt>
        <QOpt>CapCut</QOpt>
      </QuizQ>
      <QuizQ q="Peut-on transcrire un entretien annuel avec un outil grand public ?" explain="Non : un entretien individuel RH est sensible et confidentiel. On prend des notes à la main.">
        <QOpt>Oui, si le salarié ne parle pas trop</QOpt>
        <QOpt>Oui, en supprimant le fichier ensuite</QOpt>
        <QOpt ok>Non : c’est un échange sensible et confidentiel</QOpt>
      </QuizQ>
      <QuizQ q="Le compte rendu IA attribue une échéance que personne n’a dite. Que faites-vous ?" explain="L’IA peut déduire ou inventer une information. On la fait confirmer par la personne concernée avant d’envoyer.">
        <QOpt>Vous l’envoyez : elle paraît logique</QOpt>
        <QOpt ok>Vous la faites confirmer avant l’envoi</QOpt>
        <QOpt>Vous supprimez toutes les échéances</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_Cost, M6_Otter, M6_Fireflies, M6_Notion, M6_Rules, M6_Pipeline, M6_Lab, M6_Transcript, M6_Fix, M6_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 6 · 15:05

OBJECTIF — Annoncer les outils n° 14 à 16 : réunions et organisation.

DIRE — « Qui a eu au moins trois réunions cette semaine ? » Laisser lever les mains. « Ce module est pour vous. Trois outils : Otter et Fireflies pour transcrire et faire le compte rendu, Notion AI pour organiser et retrouver. Et des règles, parce qu’enregistrer des personnes n’est jamais anodin. »

TRANSITION — « D’abord, où passe le temps. »`,
  `⏱ 3 min · LE TEMPS CACHÉ (3 clics)

OBJECTIF — Rendre visible le travail administratif qui suit une réunion.

DIRE — Clic 1 : « Sans IA : prendre des notes, rédiger le compte rendu, lister les tâches, écrire l’email. Environ soixante-dix minutes pour une heure de réunion. » Clic 2 : « Avec IA : il reste surtout de la relecture. » Clic 3 : « De soixante-dix à dix minutes. Et le bénéfice le plus sous-estimé : vous écoutez vraiment pendant la réunion. »

INSISTER — Ordres de grandeur illustratifs : à faire réagir le groupe.

TRANSITION — « Premier outil : Otter. »`,
  `⏱ 3 min · OUTIL 14 · OTTER.AI (2 clics)

OBJECTIF — Transcription et synthèse de réunions.

DIRE — « Otter transcrit en temps réel, reconnaît les intervenants, peut rejoindre seul vos visios, et produit un résumé. Sa fonction la plus pratique : interroger la réunion. » Clic 1 : « Qu’a dit Julie sur le budget ? Réponse, avec l’horodatage pour réécouter. » Clic 2 : « Vigilance : Otter est historiquement très orienté anglais ; vérifiez le français pour vos usages. Et on informe toujours les participants. »

TRANSITION — « Fireflies va plus loin sur les actions. »`,
  `⏱ 3 min · OUTIL 15 · FIREFLIES.AI (2 clics)

OBJECTIF — Compte rendu et extraction des actions.

DIRE — « Fireflies rejoint vos réunions, transcrit dans de nombreuses langues dont le français, et surtout extrait les actions : qui fait quoi, pour quand. » Clic 1 : « Un résumé et trois actions, sans que personne n’ait pris de notes. » Clic 2 : « Vigilance : le robot est visible dans la réunion, il doit être annoncé. Et jamais d’entretiens RH ou de sujets confidentiels. »

ASTUCE — L’envoi automatique vers Notion ou par email.

TRANSITION — « Ces comptes rendus, il faut les ranger et les retrouver : Notion AI. »`,
  `⏱ 3 min · OUTIL 16 · NOTION AI (2 clics)

OBJECTIF — Organisation, rédaction et gestion des connaissances.

DIRE — « Notion est un espace de travail : pages, bases de données, projets. Notion AI y ajoute la rédaction, les notes de réunion, et surtout la recherche : on pose une question sur tout l’espace. » Clic 1 : « Décisions et retards du projet Horizon, avec les pages sources. » Clic 2 : « Vigilance : il ne sait que ce qui est dans vos pages ; un espace mal tenu donne des réponses incomplètes. »

TRANSITION — « Avant de pratiquer : les règles de l’enregistrement. »`,
  `⏱ 4 min · LES RÈGLES (cartes)

OBJECTIF — Poser le cadre légal et éthique de l’enregistrement.

DIRE — « Une voix est une donnée personnelle. Quatre situations : votez, je retourne. » Puis : « Les quatre règles en bas : informer, recueillir l’accord, outil autorisé, supprimer dès que possible. »

ADAPTER — Rappeler que la politique de votre entreprise prime : certaines interdisent tout enregistrement par un outil externe.

TRANSITION — « Voyons la chaîne complète en démonstration. »`,
  `⏱ 3 min · LA CHAÎNE APRÈS-RÉUNION (démo, 6 clics)

OBJECTIF — Visualiser la chaîne réunion → transcription → synthèse → décisions → tâches → email.

DIRE — Clic par clic : « La réunion, avec le robot annoncé. La transcription. La synthèse. Les décisions. Les tâches dans la base projet Notion. L’email de suivi. » Puis le point de contrôle : « Entre décisions et email, un humain relit. Une décision mal comprise, envoyée à dix personnes, devient une vraie décision. »

TRANSITION — « À vous de jouer. »`,
  `⏱ 20 min · CAS PRATIQUE · APRÈS-RÉUNION (minuteur)

OBJECTIF — De la réunion à l’email de suivi, en réduisant le temps administratif.

DIRE — « Deux options. Option A, la plus amusante : en groupe de quatre, jouez trois minutes du comité projet avec Fireflies ou Otter qui transcrit. Option B : utilisez la transcription fournie. Ensuite, synthèse et décisions, tâches dans une base Notion, email de suivi. »

ANIMATION — L’option A fonctionne très bien et crée de l’énergie en fin d’après-midi : encourager au moins un groupe à la tenter. Lancer le minuteur.

TRANSITION — « La transcription et le prompt. »`,
  `⏱ (support du cas pratique) · LA TRANSCRIPTION

OBJECTIF — Fournir le matériau et un prompt de traitement.

DIRE — « Un extrait de comité projet, fictif. Le prompt à droite demande cinq livrables d’un coup, avec une règle : n’inventer aucune date ni aucun responsable. »

INSISTER — La consigne « écris à définir » évite que l’IA comble les trous.

TRANSITION — « Comparons avec un corrigé. »`,
  `⏱ 4 min · CORRIGÉ (3 clics)

OBJECTIF — Montrer un résultat attendu et le contrôle humain nécessaire.

DIRE — Clic 1 : « La synthèse et la décision, avec l’option écartée. » Clic 2 : « Les quatre tâches. » Clic 3 : « L’email de suivi. Mais regardez : l’échéance d’Inès n’a jamais été dite. Elle est déduite de “un mois avant”. Un humain doit la confirmer. »

ANIMATION — Demander aux groupes : avez-vous trouvé les quatre tâches ? Le parking en suspens ?

TRANSITION — « Quiz du module 6, puis pause. »`,
  `⏱ 4 min · QUIZ MODULE 6

OBJECTIF — Vérifier : consentement, extraction des actions, recherche Notion, réunions sensibles, information déduite.

DIRE — « Cinq questions. »

TRANSITION — « Pause de quinze minutes. Ensuite, on passe au visuel : images et vidéos. »`,
];
// @@NOTES-END
