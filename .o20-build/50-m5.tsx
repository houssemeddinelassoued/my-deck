// ─── Module 5 · Rédiger plus rapidement et améliorer ses documents ──────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title="Rédiger plus vite, et mieux"
    sub="Corriger, reformuler, traduire, mettre en slides, illustrer : un outil spécialisé par étape, et vos documents prennent forme en quelques minutes."
    dur="50 min"
    labs={<DefiBadge defi="redaction" />}
  >
    <SecItem n={1}>Grammarly · corriger et améliorer ses textes</SecItem>
    <SecItem n={2}>DeepL et DeepL Write · traduire et reformuler</SecItem>
    <SecItem n={3}>Canva AI · créer des supports visuels</SecItem>
    <SecItem n={4}>Gamma · créer une présentation en une minute</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── La chaîne rédactionnelle ───────────────────────────────────────────────
const M5Stage = ({ n, icon, verb, ids, sub }: { n: number; icon: IconName; verb: string; ids: ToolId[]; sub: string }) => (
  <div className={b.pop(n)} style={{ width: 300, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
    <IconTile name={icon} tone="green" size={64} solid />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{verb}</div>
    <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.35, minHeight: 52 }}>{sub}</div>
    <div style={{ display: 'flex', gap: 8 }}>
      {ids.map((id) => (
        <ToolChip key={id} id={id} size={19} />
      ))}
    </div>
  </div>
);

const M5_Chain: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Un document, cinq étapes, un outil par étape</Title>
    <Lede>L’assistant écrit le premier jet. Les spécialistes le rendent impeccable, multilingue et présentable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <M5Stage n={1} icon="pen" verb="Écrire" ids={['chatgpt']} sub="Le premier jet à partir de notes" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(2)} />
      <M5Stage n={2} icon="check" verb="Corriger" ids={['grammarly']} sub="Fautes, clarté, ton" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(3)} />
      <M5Stage n={3} icon="translate" verb="Traduire" ids={['deepl']} sub="Texte ou document entier" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(4)} />
      <M5Stage n={4} icon="slides" verb="Présenter" ids={['gamma']} sub="Des slides en une minute" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(5)} />
      <M5Stage n={5} icon="image" verb="Illustrer" ids={['canva']} sub="Affiche, post, visuel" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(600) }}>
      <Callout title="Le bon réflexe" tone="green" icon="bulb" size={24}>
        Ne demandez pas tout à un seul outil. Un assistant généraliste fait tout « correctement » ; un spécialiste fait sa tâche <strong>très bien</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Outil 10 · Grammarly ───────────────────────────────────────────────────
const Fix = ({ from, to }: { from: string; to: string }) => (
  <span>
    <span style={{ textDecoration: 'line-through', textDecorationColor: C.coral, color: C.muted }}>{from}</span>{' '}
    <span style={{ background: T.green.bg, color: T.green.fg, fontWeight: 700, borderRadius: 5, padding: '0 5px' }}>{to}</span>
  </span>
);

const M5_Grammarly: Page = () => (
  <ToolPage
    mod={5}
    id="grammarly"
    tone="green"
    tagline="le correcteur intelligent"
    feats={[
      ['check', 'Correction en temps réel', 'Orthographe, grammaire, ponctuation, pendant que vous tapez.'],
      ['smile', 'Détecteur de ton', 'Votre message sonne-t-il sec, hésitant, confiant ? Il vous le dit.'],
      ['loop', 'Reformulation', 'Plus clair, plus court, plus formel : une phrase réécrite en un clic.'],
      ['globe', 'Partout où vous écrivez', 'Extension navigateur, Outlook, Word, Google Docs.'],
    ]}
    exTitle="email en anglais"
    prompt="We was not able to deliver your order in time, sorry for that. We will try to send it asap if it's possible for you."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ lineHeight: 1.7 }}>
          We <Fix from="was" to="were" /> not able to deliver your order <Fix from="in time, sorry for that" to="on time, and we apologize" />. We will{' '}
          <Fix from="try to send it asap if it's possible for you" to="ship it as soon as possible" />.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="green" size={16}>3 corrections</Tag>
          <Tag tone="yellow" size={16}>Ton : hésitant → confiant</Tag>
          <Tag tone="blue" size={16}>Clarté : +2 points</Tag>
        </div>
      </div>
    }
    watch="Pensé d’abord pour l’anglais : idéal pour vos emails internationaux. Pour le français, préférez DeepL Write ou le correcteur de votre suite bureautique."
    tip="activez la définition d’objectifs (destinataire, intention) : les suggestions s’adaptent à un client, un collègue, un recruteur."
  />
);

// ─── Outil 11 · DeepL / DeepL Write ─────────────────────────────────────────
const M5_DeepL: Page = () => (
  <ToolPage
    mod={5}
    id="deepl"
    tone="navy"
    tagline="traduire et reformuler"
    feats={[
      ['translate', 'Traduction de texte', 'Une traduction naturelle, qui respecte les tournures de chaque langue.'],
      ['doc', 'Traduction de documents', 'Word, PowerPoint, PDF : traduits en gardant la mise en page.'],
      ['book', 'Glossaire', 'Vos termes métier traduits toujours de la même façon.'],
      ['pen', 'DeepL Write', 'Reformule votre texte avec le style et le ton choisis.'],
    ]}
    exTitle="DeepL Write · style professionnel"
    prompt="Suite à votre mail, je reviens vers vous pour vous dire qu’on a bien pris en compte votre demande et qu’on va faire le nécessaire au plus vite."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 22, lineHeight: 1.5 }}>Nous avons bien reçu votre demande et la traitons en priorité. Je vous tiens informé de son avancement.</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="navy" size={16}>Style : professionnel</Tag>
          <Tag tone="navy" size={16}>Ton : confiant</Tag>
          <Tag tone="green" size={16}>36 → 20 mots</Tag>
        </div>
        <div style={{ fontSize: 18, color: C.muted }}>Cliquez sur un mot pour voir d’autres formulations.</div>
      </div>
    }
    watch="Version gratuite : vos textes peuvent être conservés pour améliorer le service. DeepL Pro garantit leur suppression. Relisez toujours les termes métier."
    tip="créez un glossaire avec vos termes métier et noms de produits : ils seront traduits toujours de la même façon."
  />
);

// ─── Outil 12 · Canva AI ────────────────────────────────────────────────────
const M5Thumb = ({ bg, fg, title, sub }: { bg: string; fg: string; title: string; sub: string }) => (
  <div style={{ flex: 1, height: 230, borderRadius: 12, background: bg, color: fg, padding: '16px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: SHADOW_SM }}>
    <div style={{ width: 40, height: 40, borderRadius: 99, background: 'rgba(255,255,255,.35)' }} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, lineHeight: 1.1 }}>{title}</div>
    <div style={{ fontSize: 15, opacity: 0.9 }}>{sub}</div>
    <div style={{ marginTop: 'auto', height: 46, borderRadius: 8, background: 'rgba(255,255,255,.25)' }} />
  </div>
);

const M5_Canva: Page = () => (
  <ToolPage
    mod={5}
    id="canva"
    tone="violet"
    tagline="le studio graphique assisté"
    feats={[
      ['wand', 'Création assistée', 'Décrivez votre support : il propose des mises en page prêtes à modifier.'],
      ['pen', 'Rédaction intégrée', 'Titres, accroches, textes courts écrits directement dans le design.'],
      ['image', 'Images générées', 'Une illustration créée à partir d’une description, ou retouchée.'],
      ['layers', 'Redimensionnement magique', 'Un visuel décliné en affiche, post, story, bannière.'],
    ]}
    exTitle="affiche A4"
    prompt="Affiche A4 pour notre journée portes ouvertes du samedi 15 novembre, ton familial et chaleureux, dominante verte."
    answer={
      <div style={{ display: 'flex', gap: 12 }}>
        <M5Thumb bg="#1F7A4D" fg="#fff" title="Portes ouvertes" sub="Samedi 15 novembre · 10 h – 17 h" />
        <M5Thumb bg="#E8F5E9" fg="#1F5132" title="Venez nous rencontrer !" sub="Ateliers · visite · goûter" />
        <M5Thumb bg="#2E7D32" fg="#FFF8E1" title="On vous ouvre nos portes" sub="Le 15/11, en famille" />
      </div>
    }
    watch="Images générées : vérifiez les conditions d’usage commercial de votre offre. Et personnalisez : un modèle non retouché se reconnaît au premier coup d’œil."
    tip="le kit de marque (logo, couleurs, polices) applique automatiquement votre charte graphique à chaque création."
  />
);

// ─── Outil 13 · Gamma ───────────────────────────────────────────────────────
const M5Slide = ({ n, t, c }: { n: number; t: string; c: string }) => (
  <div style={{ height: 92, borderRadius: 10, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: mono, fontSize: 13, color: C.faint }}>{n}</span>
      <span style={{ width: 22, height: 6, borderRadius: 3, background: c }} />
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{t}</div>
  </div>
);

const M5_Gamma: Page = () => (
  <ToolPage
    mod={5}
    id="gamma"
    tone="pink"
    tagline="une présentation en une minute"
    feats={[
      ['slides', 'Génération complète', 'Présentation, document ou page web à partir d’un sujet, de notes ou d’un fichier.'],
      ['palette', 'Mise en forme en un clic', 'Changez de thème : tout le contenu se remet en page.'],
      ['send', 'Export', 'PowerPoint, PDF, Google Slides, ou un simple lien à partager.'],
    ]}
    exTitle="à partir de notes"
    prompt="Crée 8 slides : bilan du projet Horizon pour le comité de direction, à partir des notes jointes. Ton factuel, une idée par slide."
    answer={
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <M5Slide n={1} t="Projet Horizon : le bilan" c={C.pink} />
        <M5Slide n={2} t="Objectifs de départ" c={C.violet} />
        <M5Slide n={3} t="Ce qui a été livré" c={C.green} />
        <M5Slide n={4} t="Chiffres clés" c={C.blue} />
        <M5Slide n={5} t="Ce qui a coincé" c={C.coral} />
        <M5Slide n={6} t="Leçons apprises" c={C.yellow} />
        <M5Slide n={7} t="Prochaines étapes" c={C.teal} />
        <M5Slide n={8} t="Décisions attendues" c={C.navy} />
      </div>
    }
    watch="Si vos notes sont maigres, Gamma comble avec du contenu générique, voire inventé. L’export PowerPoint peut perdre une partie de la mise en forme."
    tip="collez un plan détaillé et choisissez de « conserver » votre texte plutôt que de le « générer » : Gamma met en forme sans réinventer."
  />
);

// ─── Reformuler : avant / après ─────────────────────────────────────────────
const M5Flip = ({ how, id, before, after, d }: { how: string; id: ToolId; before: string; after: string; d: number }) => (
  <FlipCard
    w={530}
    h={470}
    cls={A.in}
    style={dl(d)}
    tone="grey"
    backTone="green"
    front={
      <>
        <Eyebrow c={C.muted} size={17}>
          Avant · {how}
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.45, color: C.soft, fontStyle: 'italic' }}>« {before} »</div>
      </>
    }
    back={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ToolTile id={id} size={36} />
          <Eyebrow c={T.green.fg} size={17}>
            Après · {how}
          </Eyebrow>
        </div>
        <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.ink, fontWeight: 600 }}>« {after} »</div>
      </>
    }
  />
);

const M5_Rewrite: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Reformuler : trois avant / après</Title>
    <Lede>Cliquez sur chaque carte. Même information, trois intentions différentes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 45 }}>
      <M5Flip
        d={100}
        how="simplifier"
        id="deepl"
        before="Dans le cadre de l’optimisation de nos process, il a été acté la mise en œuvre d’un dispositif de dématérialisation des notes de frais impactant l’ensemble des collaborateurs à compter du T1."
        after="À partir de janvier, toutes les notes de frais passeront en ligne. Fini le papier : vous les déclarerez depuis votre téléphone."
      />
      <M5Flip
        d={200}
        how="raccourcir"
        id="chatgpt"
        before="Je me permets de revenir vers vous concernant le devis que nous vous avons adressé il y a maintenant deux semaines, afin de savoir si vous aviez eu l’occasion d’en prendre connaissance et si vous aviez des questions éventuelles."
        after="Avez-vous pu consulter notre devis du 1er octobre ? Je reste disponible pour en parler."
      />
      <M5Flip
        d={300}
        how="adoucir le ton"
        id="claude"
        before="Comme je vous l’ai déjà dit trois fois, le dossier est incomplet. Merci de lire mes messages et d’envoyer enfin les pièces manquantes."
        after="Il nous manque encore deux pièces pour finaliser votre dossier : le justificatif de domicile et le RIB. Pouvez-vous nous les transmettre d’ici vendredi ?"
      />
    </div>
  </Frame>
);

// ─── Atelier 5 ──────────────────────────────────────────────────────────────
const M5_Lab: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="Le circuit rédactionnel : cinq tâches"
    defi="redaction"
    who="Binômes · au moins 3 tâches sur 5"
    minutes={25}
    tools={['copilot', 'chatgpt', 'grammarly', 'deepl', 'gamma', 'canva']}
    objective={
      <>
        Utiliser l’outil le plus adapté à chaque tâche rédactionnelle, et <strong>mesurer le temps gagné</strong> par rapport à votre façon habituelle de faire.
      </>
    }
    where={
      <>
        Pour chaque tâche réalisée : le résultat, l’outil utilisé, le temps passé, et <strong>une limite</strong> constatée.
      </>
    }
    crit={
      <>
        <CheckItem id="l5-c1" size={21}>3 tâches au moins, 3 outils différents</CheckItem>
        <CheckItem id="l5-c2" size={21}>Chaque résultat relu et corrigé</CheckItem>
        <CheckItem id="l5-c3" size={21}>Temps passé noté pour chaque tâche</CheckItem>
        <CheckItem id="l5-c4" size={21}>Une limite repérée par outil</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Transformer des notes en email professionnel</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Reformuler un texte jargonneux</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Traduire et améliorer un document</div>
      <div><strong style={{ color: C.navy }}>4.</strong> Transformer un contenu en présentation</div>
      <div><strong style={{ color: C.navy }}>5.</strong> Créer un support visuel à partir d’un brief</div>
    </div>
    <Bonus>Enchaînez les tâches 4 et 5 : la présentation Gamma et l’affiche Canva sur le même sujet.</Bonus>
  </LabPage>
);

// ─── Matériaux de l’atelier (onglets) ───────────────────────────────────────
const M5Mat = ({ material, prompt, ids }: { material: ReactNode; prompt: ReactNode; ids: ToolId[] }) => (
  <div style={{ display: 'flex', gap: 28 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow c={C.muted} size={17}>
        Le matériau (fictif)
      </Eyebrow>
      <div style={{ marginTop: 10, background: '#FFFBEA', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${T.yellow.bd}`, padding: '18px 22px', fontSize: 22, lineHeight: 1.5, color: C.ink, minHeight: 260, boxSizing: 'border-box' }}>{material}</div>
    </div>
    <div style={{ flex: 1 }}>
      <Eyebrow c={C.muted} size={17}>
        Prompt de départ
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <CodeDark size={20} wrap style={{ minHeight: 260 }}>
          {prompt}
        </CodeDark>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, fontSize: 20, color: C.muted }}>
        Outils :
        {ids.map((id) => (
          <ToolChip key={id} id={id} size={21} />
        ))}
      </div>
    </div>
  </div>
);

const M5_LabMat: Page = () => (
  <Frame mod={5} kind="lab" label="Atelier 5 · Les matériaux">
    <Title size={46}>Les cinq tâches : matériaux et prompts</Title>
    <Tabs initial="t1">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 180, display: 'flex', gap: 10 }}>
        <TabBtn id="t1" tone="blue" icon="mail">1 · Notes → email</TabBtn>
        <TabBtn id="t2" tone="navy" icon="loop">2 · Reformuler</TabBtn>
        <TabBtn id="t3" tone="teal" icon="translate">3 · Traduire</TabBtn>
        <TabBtn id="t4" tone="pink" icon="slides">4 · Présentation</TabBtn>
        <TabBtn id="t5" tone="violet" icon="image">5 · Visuel</TabBtn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, height: 610, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(150) }}>
        <TabPane id="t1">
          <M5Mat
            ids={['copilot', 'chatgpt']}
            material={
              <span style={{ fontFamily: mono, fontSize: 20 }}>
                RDV client Dupuis 10/10
                <br />– ok devis v2 sauf option maintenance
                <br />– veulent démarrer en janvier
                <br />– envoyer planning + nouveau devis avant le 20/10
                <br />– contact : Mme Roux, achats
              </span>
            }
            prompt={
              <>
                Transforme ces notes en email professionnel à Mme Roux : remerciements, récapitulatif des décisions, prochaines étapes avec dates. <Cs>120 mots, ton cordial.</Cs> N’invente aucune information.
              </>
            }
          />
        </TabPane>
        <TabPane id="t2">
          <M5Mat
            ids={['deepl', 'chatgpt']}
            material="Dans le cadre de l’optimisation de nos process, il a été acté la mise en œuvre d’un dispositif de dématérialisation des notes de frais impactant l’ensemble des collaborateurs à compter du T1, conformément aux orientations stratégiques validées en CODIR."
            prompt={
              <>
                Dans DeepL Write : collez le texte, style <Cs>« simple »</Cs>, puis <Cs>« professionnel »</Cs>. Comparez.{'\n\n'}
                Dans un assistant : « Réécris pour des salariés non spécialistes, 2 phrases, sans jargon. »
              </>
            }
          />
        </TabPane>
        <TabPane id="t3">
          <M5Mat
            ids={['deepl', 'grammarly']}
            material="La fiche produit « Bureau assis-debout Alto » (Word, 1 page, avec tableau des dimensions), à traduire en anglais pour un distributeur britannique."
            prompt={
              <>
                1. DeepL · onglet <Cs>Documents</Cs> : déposez le fichier Word, langue cible anglais (britannique).{'\n'}
                2. Ouvrez le résultat : la mise en page est-elle conservée ?{'\n'}
                3. Grammarly : vérifiez le ton du texte d’introduction en anglais.
              </>
            }
          />
        </TabPane>
        <TabPane id="t4">
          <M5Mat
            ids={['gamma', 'copilot']}
            material="La note d’une page du cas pratique du module 4 (forfait mobilités durables), ou le rapport d’activité fictif fourni."
            prompt={
              <>
                Crée une présentation de <Cs>6 slides</Cs> pour le comité de direction à partir de ce texte. Une idée par slide, des titres qui affirment, un dernier slide « décision attendue ». <Cs>Conserve mes chiffres, n’en ajoute aucun.</Cs>
              </>
            }
          />
        </TabPane>
        <TabPane id="t5">
          <M5Mat
            ids={['canva']}
            material={
              <>
                <strong>Brief :</strong> un « Café IA » ouvert à tous les salariés, jeudi 6 novembre à 12 h 30, salle Lumière. 30 minutes pour partager une astuce IA. Ton convivial, pas de jargon. Formats : affiche A4 + post pour l’intranet.
              </>
            }
            prompt={
              <>
                Dans Canva, création assistée : « Affiche A4 conviviale pour un Café IA, jeudi 6 novembre 12 h 30, salle Lumière, ouvert à tous. » Puis <Cs>redimensionnement magique</Cs> → post carré.
              </>
            }
          />
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Quiz M5 ────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>Quiz · Module 5</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous devez traduire une plaquette PowerPoint en allemand sans casser la mise en page. Quel outil ?" explain="DeepL traduit des documents Word, PowerPoint ou PDF entiers en conservant leur mise en page.">
        <QOpt>Grammarly</QOpt>
        <QOpt ok>DeepL (traduction de documents)</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="Grammarly est surtout recommandé pour…" explain="Grammarly est pensé d’abord pour l’anglais : idéal pour corriger et ajuster le ton de vos écrits en anglais.">
        <QOpt ok>vos emails et documents en anglais</QOpt>
        <QOpt>traduire des vidéos</QOpt>
        <QOpt>créer des affiches</QOpt>
      </QuizQ>
      <QuizQ q="Gamma a ajouté des chiffres absents de vos notes. Que faites-vous ?" explain="Quand le contenu fourni est maigre, Gamma comble avec du générique. On supprime les ajouts et on lui demande de conserver le texte fourni.">
        <QOpt>Vous les gardez : ils rendent la présentation plus crédible</QOpt>
        <QOpt ok>Vous les supprimez et demandez de conserver uniquement votre texte</QOpt>
        <QOpt>Vous exportez en PDF pour les figer</QOpt>
      </QuizQ>
      <QuizQ q="Votre affiche Canva doit exister aussi en post carré et en story. Le plus rapide ?" explain="Le redimensionnement magique décline un design en plusieurs formats en un clic, à retoucher ensuite.">
        <QOpt>Tout refaire trois fois</QOpt>
        <QOpt ok>Le redimensionnement magique</QOpt>
        <QOpt>Une capture d’écran recadrée</QOpt>
      </QuizQ>
      <QuizQ q="Avec la version gratuite de DeepL, vous pouvez traduire…" explain="En version gratuite, les textes peuvent être conservés pour améliorer le service : réservez-la aux contenus non confidentiels.">
        <QOpt>le contrat de travail d’un salarié</QOpt>
        <QOpt ok>une fiche produit déjà publique</QOpt>
        <QOpt>le fichier clients</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Chain, M5_Grammarly, M5_DeepL, M5_Canva, M5_Gamma, M5_Rewrite, M5_Lab, M5_LabMat, M5_Quiz];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · MODULE 5 · 14:15

OBJECTIF — Annoncer les outils n° 10 à 13 : rédaction, traduction, présentations, visuels.

DIRE — « On a trouvé et vérifié l’information. Maintenant, on la met en forme. Quatre outils spécialisés : Grammarly pour corriger, DeepL pour traduire et reformuler, Canva pour illustrer, Gamma pour présenter. »

TRANSITION — « Voyons comment ils s’enchaînent. »`,
  `⏱ 2 min · LA CHAÎNE RÉDACTIONNELLE (5 clics)

OBJECTIF — Positionner chaque outil sur une étape.

DIRE — Clic par clic : « Écrire le premier jet avec votre assistant. Corriger avec Grammarly. Traduire avec DeepL. Présenter avec Gamma. Illustrer avec Canva. » Puis : « Un généraliste fait tout correctement ; un spécialiste fait sa tâche très bien. »

TRANSITION — « Premier spécialiste : Grammarly. »`,
  `⏱ 3 min · OUTIL 10 · GRAMMARLY (2 clics)

OBJECTIF — Correction et amélioration des textes.

DIRE — « Grammarly corrige pendant que vous écrivez, partout : navigateur, Outlook, Word. Il détecte aussi votre ton. Exemple : un email en anglais un peu bancal. » Clic 1 : « Trois corrections, et le ton passe d’hésitant à confiant. » Clic 2 : « Vigilance importante : Grammarly est pensé d’abord pour l’anglais. Pour vos textes en français, DeepL Write ou le correcteur de votre suite sont plus adaptés. »

TRANSITION — « Justement : DeepL. »`,
  `⏱ 4 min · OUTIL 11 · DEEPL / DEEPL WRITE (2 clics)

OBJECTIF — Traduction, reformulation et amélioration rédactionnelle.

DIRE — « DeepL, entreprise européenne, est réputé pour la qualité de ses traductions. Deux fonctions clés : traduire des documents entiers en gardant la mise en page, et DeepL Write pour reformuler. Exemple : une phrase typique de mail administratif. » Clic 1 : « 36 mots deviennent 20, plus clairs, plus professionnels. » Clic 2 : « Vigilance : en gratuit, vos textes peuvent être conservés. La version Pro garantit leur suppression. »

ASTUCE — Le glossaire pour les termes métier.

TRANSITION — « Passons au visuel : Canva. »`,
  `⏱ 4 min · OUTIL 12 · CANVA AI (2 clics)

OBJECTIF — Création de contenus et supports visuels.

DIRE — « Canva, beaucoup le connaissent déjà. Ce qui change avec l’IA : vous décrivez votre support, il propose des mises en page ; il écrit les textes, génère des images, et décline un visuel dans tous les formats. Exemple : une affiche de portes ouvertes. » Clic 1 : « Trois propositions en quelques secondes. » Clic 2 : « Vigilance : droits d’usage des images générées selon votre offre, et personnalisez — un modèle brut se reconnaît. »

ASTUCE — Le kit de marque pour appliquer la charte.

TRANSITION — « Et les présentations : Gamma. »`,
  `⏱ 4 min · OUTIL 13 · GAMMA (2 clics)

OBJECTIF — Création rapide de présentations.

DIRE — « Gamma génère une présentation complète à partir d’un sujet, de notes ou d’un fichier. Exemple : le bilan d’un projet pour le comité de direction. » Clic 1 : « Huit slides structurés, une idée par slide. » Clic 2 : « Vigilance : si vos notes sont maigres, Gamma invente du contenu. L’astuce : choisissez de conserver votre texte plutôt que de le générer. Et l’export PowerPoint peut demander des retouches. »

ANIMATION — Démo en direct très parlante : coller la note du cas pratique M4 et générer.

TRANSITION — « Avant l’atelier, trois exemples de reformulation. »`,
  `⏱ 3 min · AVANT / APRÈS (cartes)

OBJECTIF — Montrer trois intentions de reformulation : simplifier, raccourcir, adoucir.

DIRE — « Même information, trois intentions. » Retourner chaque carte. « Simplifier : le jargon devient une phrase que tout le monde comprend. Raccourcir : une relance de 45 mots devient 15. Adoucir : un message agacé devient un message clair et respectueux, avec en prime les pièces précises demandées. »

INSISTER — Pour adoucir, c’est l’IA qui aide à prendre du recul : utile quand on écrit sous le coup de l’agacement.

TRANSITION — « À vous : l’atelier en cinq tâches. »`,
  `⏱ 25 min · ATELIER 5 · CIRCUIT RÉDACTIONNEL (minuteur)

OBJECTIF — Notes → email, reformuler, traduire et améliorer, contenu → présentation, brief → visuel.

DIRE — « Vingt-cinq minutes, en binôme. Au moins trois tâches sur cinq, avec trois outils différents. Notez le temps passé, et comparez avec votre façon habituelle de faire. Les matériaux sont sur la page suivante. »

ANIMATION — Laisser la page des matériaux affichée. Faire circuler : les tâches 4 et 5 demandent un compte Gamma et Canva. Restitution : chaque binôme annonce son meilleur gain de temps et une limite rencontrée.

TRANSITION — « Les matériaux. »`,
  `⏱ (support de l’atelier 5) · MATÉRIAUX (onglets)

OBJECTIF — Fournir un matériau fictif et un prompt de départ par tâche.

DIRE — Cliquer chaque onglet : « Tâche 1 : des notes brutes de rendez-vous client. Tâche 2 : un paragraphe jargonneux. Tâche 3 : une fiche produit Word à traduire. Tâche 4 : la note du module 4 à transformer en slides. Tâche 5 : un brief pour un Café IA. »

INSISTER — Dans chaque prompt, une contrainte anti-invention : « N’invente aucune information », « Conserve mes chiffres ».

TRANSITION — « Quiz du module 5. »`,
  `⏱ 4 min · QUIZ MODULE 5

OBJECTIF — Vérifier : traduction de documents, usage de Grammarly, contenus inventés par Gamma, redimensionnement Canva, données en version gratuite.

DIRE — « Cinq questions, puis pause. »

TRANSITION — « Ensuite : les réunions, ou comment ne plus jamais rédiger un compte rendu à la main. »`,
];
// @@NOTES-END
