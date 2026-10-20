// ─── Module 2 · Bien formuler : prompting et contexte ───────────────────────

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Bien formuler :
        <br />
        prompting et contexte
      </>
    }
    sub="Obtenir du premier coup une réponse exploitable : une demande structurée, le bon contexte, et quelques relances bien choisies."
    dur="11:15 – 12:30 · deux labs"
    labs={
      <>
        <Tag tone="green" size={19}>
          Lab 2.1 · communication d’incident
        </Tag>
        <Tag tone="green" size={19}>
          Lab 2.2 · réponse type
        </Tag>
      </>
    }
  >
    <SecItem n={1}>Les cinq ingrédients d’un prompt efficace</SecItem>
    <SecItem n={2}>Donner du contexte : fichiers, projets, instructions</SecItem>
    <SecItem n={3}>Itérer et faire poser les questions par l’IA</SecItem>
    <SecItem n={4}>La bibliothèque de prompts de l’équipe</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Avant / après ──────────────────────────────────────────────────────────
const M2_AvantApres: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Cinq mots ou cinq lignes : la différence</Title>
    <Lede>Lundi 8:05, FS-02 est tombé. Inès doit prévenir les entrepôts. Deux façons de demander.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 815, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Tag tone="coral" size={22} cls={A.in} style={{ alignSelf: 'flex-start' }}>
        <Icon name="x" size={22} /> La demande express
      </Tag>
      <PromptBox cls={A.in} size={26}>
        Écris un message sur la panne.
      </PromptBox>
      <AnswerBox id="copilot" cls={b.on(1)} size={23} style={{ background: T.coral.bg, boxShadow: `inset 0 0 0 1.5px ${T.coral.bd}` }}>
        <strong>Objet : Panne</strong>
        <br />
        Bonjour, nous rencontrons actuellement un problème technique. Nous mettons tout en œuvre pour le résoudre au plus vite. Merci de votre
        compréhension.
      </AnswerBox>
      <div className={b.fade(1)} style={{ fontSize: 22, color: T.coral.fg, fontWeight: 600 }}>
        Quelle panne ? Qui est touché ? Que faire en attendant ? Inutilisable.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 985, top: 270, width: 815, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Tag tone="green" size={22} cls={A.in} style={{ alignSelf: 'flex-start', ...dl(150) }}>
        <Icon name="check" size={22} /> La demande structurée
      </Tag>
      <PromptBox cls={A.in} size={21} style={dl(150)}>
        Tu es chargé de la communication du support d’Orvalis. FS-02 est indisponible depuis 7 h 52 ; 340 personnes des entrepôts ne peuvent plus ouvrir
        les bons de préparation ; retour visé vers 10 h 30. Rédige le message aux utilisateurs : un objet et cinq lignes, sans jargon, avec une ligne « Que
        faire en attendant ? ».
      </PromptBox>
      <AnswerBox id="copilot" cls={b.on(2)} size={21} style={{ background: T.green.bg, boxShadow: `inset 0 0 0 1.5px ${T.green.bd}` }}>
        <strong>Objet : Bons de préparation momentanément inaccessibles</strong>
        <br />
        Depuis 7 h 52, les bons de préparation ne s’ouvrent plus. Nos équipes interviennent et visent un retour vers 10 h 30.{' '}
        <strong>Que faire en attendant ?</strong> Utilisez les bons imprimés de la veille ; urgence : poste 4400.
      </AnswerBox>
    </div>
  </Frame>
);

// ─── Anatomie (constructeur interactif) ─────────────────────────────────────
const M2_ING = [
  { label: 'Rôle', tone: 'navy' as Tone, txt: 'Tu es chargé de la communication du support informatique d’Orvalis.' },
  { label: 'Contexte', tone: 'blue' as Tone, txt: 'Le serveur FS-02 est indisponible depuis 7 h 52. 340 personnes des entrepôts ne peuvent plus ouvrir les bons de préparation. Retour visé vers 10 h 30.' },
  { label: 'Tâche', tone: 'violet' as Tone, txt: 'Rédige le message d’information aux utilisateurs des entrepôts.' },
  { label: 'Format', tone: 'teal' as Tone, txt: 'Un objet, cinq lignes au maximum, puis une ligne « Que faire en attendant ? ».' },
  { label: 'Contraintes', tone: 'pink' as Tone, txt: 'Aucun terme technique, ton rassurant, pas d’heure de retour garantie.' },
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
  return <Toggle on={on} onChange={flip} tone={p.tone} size={25} label={<span style={{ fontWeight: 600 }}>{p.label}</span>} />;
};

const M2_Anatomie: Page = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const lvl = n <= 1 ? 0 : n <= 3 || !on[4] ? 1 : 2;
  const tone: Tone = lvl === 0 ? 'coral' : lvl === 1 ? 'yellow' : 'green';
  return (
    <Frame mod={2} kind="demo">
      <Title>Les cinq ingrédients d’un prompt</Title>
      <Lede>Partez de « Écris un message sur la panne », ajoutez les ingrédients un par un et regardez la réponse changer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 360, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Eyebrow c={C.navy} size={19}>
          Ingrédients
        </Eyebrow>
        <M2IngBtn i={0} on={on[0]} flip={() => flip(0)} />
        <M2IngBtn i={1} on={on[1]} flip={() => flip(1)} />
        <M2IngBtn i={2} on={on[2]} flip={() => flip(2)} />
        <M2IngBtn i={3} on={on[3]} flip={() => flip(3)} />
        <M2IngBtn i={4} on={on[4]} flip={() => flip(4)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Vider
          </Btn>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 520, top: 262, width: 640, ...dl(150) }}>
        <CodeDark file="prompt · communication d’incident" size={21} wrap style={{ minHeight: 600 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: body }}>
            <M2Ing i={0} on={on[0]} />
            <M2Ing i={1} on={on[1]} />
            {on[2] ? <M2Ing i={2} on /> : <div style={{ color: '#FFD27A' }}>Écris un message sur la panne.</div>}
            <M2Ing i={3} on={on[3]} />
            <M2Ing i={4} on={on[4]} />
          </div>
        </CodeDark>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1200, top: 262, width: 600, display: 'flex', flexDirection: 'column', gap: 18, ...dl(300) }}>
        <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px' }}>
          <Eyebrow c={C.muted} size={18}>
            Réponse exploitable ?
          </Eyebrow>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <span style={{ flex: 1, height: 16, borderRadius: 8, background: STRONG[tone] }} />
            <span style={{ flex: 1, height: 16, borderRadius: 8, background: lvl >= 1 ? STRONG[tone] : C.panel }} />
            <span style={{ flex: 1, height: 16, borderRadius: 8, background: lvl >= 2 ? STRONG[tone] : C.panel }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 23, fontWeight: 700, color: T[tone].fg }}>
            {lvl === 0 ? 'Non : vague et générique' : lvl === 1 ? 'Presque : précis mais pas adapté au lecteur' : 'Oui : prêt à envoyer après relecture'}
          </div>
        </div>
        <AnswerBox id="copilot" size={21}>
          {lvl === 0 ? (
            <>
              <strong>Objet : Panne</strong>
              <br />
              Bonjour, nous rencontrons actuellement un problème technique. Nous mettons tout en œuvre pour le résoudre. Merci de votre compréhension.
            </>
          ) : lvl === 1 ? (
            <>
              <strong>Objet : Incident sur le serveur FS-02</strong>
              <br />
              FS-02 est indisponible depuis 7 h 52 suite à la saturation du volume D:. Les équipes procèdent à la purge des journaux. Retour prévu à 10 h 30.
            </>
          ) : (
            <>
              <strong>Objet : Bons de préparation momentanément inaccessibles</strong>
              <br />
              Depuis 7 h 52, les bons de préparation ne s’ouvrent plus dans les entrepôts. Nos équipes interviennent ; nous visons un retour vers 10 h 30 et
              vous tiendrons informés. <strong>Que faire en attendant ?</strong> Utilisez les bons imprimés de la veille ; urgence : poste 4400.
            </>
          )}
        </AnswerBox>
      </div>
    </Frame>
  );
};

// ─── Même incident, deux lecteurs ───────────────────────────────────────────
const M2_Lecteurs: Page = () => (
  <Frame mod={2}>
    <Title>Même incident, deux lecteurs, deux messages</Title>
    <Lede>Seuls le rôle, la tâche et les contraintes changent. Le contexte, lui, est identique.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 815, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Tag tone="blue" size={22} style={{ alignSelf: 'flex-start' }}>
        <Icon name="users" size={22} /> Pour les utilisateurs des entrepôts
      </Tag>
      <PromptBox size={21}>« … Sans jargon, ton rassurant, une ligne “Que faire en attendant ?”. »</PromptBox>
      <AnswerBox id="copilot" size={22}>
        Depuis 7 h 52, les bons de préparation ne s’ouvrent plus. Nos équipes interviennent et visent un retour vers 10 h 30. En attendant, utilisez les
        bons imprimés de la veille. Urgence : poste 4400.
      </AnswerBox>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 985, top: 270, width: 815, display: 'flex', flexDirection: 'column', gap: 18, ...dl(200) }}>
      <Tag tone="violet" size={22} style={{ alignSelf: 'flex-start' }}>
        <Icon name="server" size={22} /> Pour l’équipe technique et l’astreinte
      </Tag>
      <PromptBox size={21}>« … Message technique, puces, état actuel, actions en cours, prochaine mise à jour. »</PromptBox>
      <AnswerBox id="copilot" size={22}>
        • FS-02 · volume D: plein (0 Go libre) depuis 7 h 52
        <br />• Cause probable : journaux de l’agent de sauvegarde
        <br />• En cours : purge manuelle par Malik, extension du volume étudiée
        <br />• Prochain point : 9 h 30 sur le canal Teams « Incidents »
      </AnswerBox>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(500) }}>
      <Callout title="Astuce" tone="blue" icon="bulb" size={24}>
        Écrivez le contexte une seule fois, puis demandez : « Décline ce message pour les utilisateurs, pour la direction et pour l’équipe technique. »
      </Callout>
    </div>
  </Frame>
);

// ─── Donner du contexte ─────────────────────────────────────────────────────
const M2Ctx = ({ icon, tone, title, apps, children, d }: { icon: IconName; tone: Tone; title: string; apps: ReactNode; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', display: 'flex', gap: 16 }}>{apps}</div>
  </div>
);

const M2_Contexte: Page = () => (
  <Frame mod={2}>
    <Title>Donner du contexte sans tout recopier</Title>
    <Lede>Le meilleur prompt échoue si l’IA ne sait pas de quoi on parle. Quatre façons de lui donner les bonnes pièces.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 640, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 24 }}>
      <M2Ctx icon="doc" tone="blue" title="Joindre le fichier" d={100} apps={<><AppChip id="chat" /><AppChip id="claude" /></>}>
        Le journal d’incident, l’export Excel, le rapport PDF. Plus fiable qu’un copier-coller partiel.
      </M2Ctx>
      <M2Ctx icon="link" tone="violet" title="Citer avec « / »" d={200} apps={<AppChip id="copilot" />}>
        Dans Microsoft 365 Copilot, « / » pointe un fichier SharePoint, un e-mail ou une réunion, sans le télécharger.
      </M2Ctx>
      <M2Ctx icon="folder" tone="coral" title="Un projet par sujet" d={300} apps={<AppChip id="claude" />}>
        Un projet « Procédures FS » avec les documents de référence et des instructions : plus besoin de tout redire à chaque fois.
      </M2Ctx>
      <M2Ctx icon="user" tone="teal" title="Des instructions permanentes" d={400} apps={<><AppChip id="copilot" /><AppChip id="claude" /></>}>
        « Je suis technicienne support chez Orvalis, je rédige pour des non-techniciens. » Réglé une fois, appliqué partout.
      </M2Ctx>
    </div>
  </Frame>
);

// ─── Itérer ─────────────────────────────────────────────────────────────────
const M2Rel = ({ id, children }: { id: string; children: ReactNode }) => (
  <TabPane id={id}>
    <AnswerBox id="claude" size={24}>
      {children}
    </AnswerBox>
  </TabPane>
);

const M2_Iterer: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Itérer : cinq relances qui valent de l’or</Title>
    <Lede>La première réponse est un brouillon. Cliquez une relance pour voir son effet sur le message de FS-02.</Lede>
    <Tabs initial="r1" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <TabBtn id="r1" tone="violet" icon="filter">
          « Plus court »
        </TabBtn>
        <TabBtn id="r2" tone="violet" icon="users">
          « Pour un non-technicien »
        </TabBtn>
        <TabBtn id="r3" tone="violet" icon="table">
          « En tableau »
        </TabBtn>
        <TabBtn id="r4" tone="violet" icon="search">
          « Qu’est-ce qui manque ? »
        </TabBtn>
        <TabBtn id="r5" tone="violet" icon="layers">
          « Trois versions »
        </TabBtn>
      </div>
      <M2Rel id="r1">FS-02 saturé depuis 7 h 52 (journaux de sauvegarde). Purge en cours, retour visé 10 h 30. Prochain point 9 h 30.</M2Rel>
      <M2Rel id="r2">
        Un serveur qui stocke les documents des entrepôts est plein depuis 7 h 52 : plus personne ne peut ouvrir les bons de préparation. L’équipe fait de
        la place ; on vise un retour vers 10 h 30.
      </M2Rel>
      <M2Rel id="r3">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', rowGap: 6, columnGap: 20 }}>
          <strong>Quoi</strong>
          <span>Serveur de fichiers FS-02 indisponible</span>
          <strong>Depuis</strong>
          <span>7 h 52</span>
          <strong>Impact</strong>
          <span>340 utilisateurs des entrepôts</span>
          <strong>Action</strong>
          <span>Purge des journaux de sauvegarde</span>
          <strong>Retour visé</strong>
          <span>10 h 30, prochain point 9 h 30</span>
        </div>
      </M2Rel>
      <M2Rel id="r4">
        Il manque : <strong>les sites concernés</strong> (les neuf entrepôts ou seulement certains ?), <strong>un contact</strong> pour les urgences, et{' '}
        <strong>l’heure du prochain message</strong>. Voulez-vous que je les ajoute ?
      </M2Rel>
      <M2Rel id="r5">
        <strong>Formel :</strong> « Nous vous informons d’une indisponibilité… »
        <br />
        <strong>Neutre :</strong> « Les bons de préparation ne s’ouvrent plus depuis 7 h 52… »
        <br />
        <strong>Chaleureux :</strong> « Mauvaise surprise ce matin : on s’en occupe… »
      </M2Rel>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(400) }}>
      <Callout title="Le réflexe" tone="yellow" icon="loop" size={24}>
        On corrige dans la même conversation : l’IA garde le contexte. On repart de zéro seulement quand on change de sujet.
      </Callout>
    </div>
  </Frame>
);

// ─── Faire poser les questions ──────────────────────────────────────────────
const M2_Questions: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Le meilleur prompt : « Pose-moi d’abord tes questions »</Title>
    <Lede>Quand on ne sait pas quoi préciser, on laisse l’IA demander ce qui lui manque.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="user" name="Malik" w={1150} size={23} cls={A.in}>
        Aide-moi à rédiger la procédure de purge des journaux de l’agent de sauvegarde. <strong>Avant de rédiger, pose-moi les questions dont tu as besoin.</strong>
      </Bubble>
      <Bubble who="agent" name="Claude" w={1150} size={23} cls={b.on(1)}>
        Quatre questions : 1. Quelle version de l’agent ? 2. Sur quels serveurs ? 3. Qui exécute la procédure : exploitation ou administrateur ? 4. Combien
        de jours de journaux faut-il garder ?
      </Bubble>
      <Bubble who="user" name="Malik" w={1150} size={23} cls={b.on(2)}>
        Version 12, serveurs FS-01 à FS-04, exécutée par l’exploitation, 30 jours de conservation.
      </Bubble>
      <Bubble who="agent" name="Claude" w={1150} size={23} cls={b.on(3)}>
        Voici la procédure en quatre parties : <strong>prérequis</strong>, <strong>étapes</strong>, <strong>vérifications</strong>,{' '}
        <strong>retour arrière</strong>…
      </Bubble>
    </div>
  </Frame>
);

// ─── Réparez ces prompts ────────────────────────────────────────────────────
const M2Bad = ({ txt }: { txt: string }) => (
  <>
    <Tag tone="coral" size={19} style={{ alignSelf: 'flex-start' }}>
      <Icon name="x" size={19} /> Prompt à réparer
    </Tag>
    <div style={{ marginTop: 24, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.25, color: C.navy }}>« {txt} »</div>
    <div style={{ marginTop: 22, fontSize: 23, color: C.muted }}>Qu’est-ce qui manque ? Pour qui ? Sous quelle forme ?</div>
  </>
);

const M2Good = ({ children, adds }: { children: ReactNode; adds: string }) => (
  <>
    <Eyebrow c={T.green.fg} size={18}>
      Version réparée
    </Eyebrow>
    <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.ink }}>{children}</div>
    <div style={{ marginTop: 'auto', fontSize: 19, fontWeight: 600, color: T.green.fg }}>+ {adds}</div>
  </>
);

const M2_Reparer: Page = () => (
  <Frame mod={2} kind="exercice" beats={3}>
    <Title>À vous : réparez ces trois prompts</Title>
    <Lede>Deux minutes par carte, en binôme. Puis on retourne la carte pour comparer avec notre version.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 45 }}>
      <FlipCard
        w={530}
        h={600}
        flipAt={1}
        tone="coral"
        backTone="green"
        cls={A.in}
        front={<M2Bad txt="Écris une procédure pour le VPN." />}
        back={
          <M2Good adds="public, poste, longueur, format, cas d’échec">
            Rédige pour des utilisateurs nomades non techniciens la procédure de connexion au VPN d’Orvalis depuis un portable Windows 11 : six étapes au
            maximum, une capture à insérer par étape, puis une section « Ça ne marche pas ? ».
          </M2Good>
        }
      />
      <FlipCard
        w={530}
        h={600}
        flipAt={2}
        tone="coral"
        backTone="green"
        cls={A.in}
        style={dl(120)}
        front={<M2Bad txt="Résume ce rapport." />}
        back={
          <M2Good adds="lecteur, nombre, tri, source, longueur">
            Résume ce rapport d’audit pour le DSI : les cinq constats majeurs classés par niveau de risque, la page de chaque constat, puis les trois actions
            prioritaires. Une page au maximum.
          </M2Good>
        }
      />
      <FlipCard
        w={530}
        h={600}
        flipAt={3}
        tone="coral"
        backTone="green"
        cls={A.in}
        style={dl(240)}
        front={<M2Bad txt="Analyse ces tickets." />}
        back={
          <M2Good adds="indicateurs, comparaison, nombre, hypothèses">
            Dans cet export de septembre, calcule le nombre de tickets et le délai moyen de résolution par catégorie, compare avec août, puis signale les trois
            plus forts écarts avec une hypothèse pour chacun.
          </M2Good>
        }
      />
    </div>
  </Frame>
);

// ─── Bibliothèque de prompts ────────────────────────────────────────────────
const M2Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 18, padding: '10px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, paddingTop: 3 }}>{label}</span>
    <span style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M2Var = ({ children }: { children: ReactNode }) => (
  <span style={{ color: T.violet.fg, background: T.violet.bg, borderRadius: 6, padding: '0 6px', fontWeight: 600 }}>[{children}]</span>
);

const M2_Biblio: Page = () => (
  <Frame mod={2}>
    <Title>La bibliothèque de prompts de l’équipe</Title>
    <Lede>Un bon prompt écrit une fois sert à toute l’équipe. On le range dans une fiche, avec des variables entre crochets.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 6 }}>
        <IconTile name="note" tone="violet" size={44} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>SUP-COM-INCIDENT · v2</span>
      </div>
      <M2Field label="Quand">Dès qu’un incident touche plus de 20 utilisateurs</M2Field>
      <M2Field label="Prompt">
        Tu es chargé de la communication du support. <M2Var>service</M2Var> est indisponible depuis <M2Var>heure</M2Var> ; <M2Var>impact</M2Var>. Rédige le
        message aux utilisateurs : un objet, cinq lignes, sans jargon, une ligne « Que faire en attendant ? ».
      </M2Field>
      <M2Field label="Outil">Copilot dans Outlook ou Claude</M2Field>
      <M2Field label="Auteur · date">Inès · octobre 2026</M2Field>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Eyebrow c={C.navy} size={19} cls={A.fade}>
        Où la ranger
      </Eyebrow>
      <Card icon="note" tone="violet" title="Prompts enregistrés" size={22} cls={A.right} style={dl(150)}>
        Dans Copilot : enregistrer un prompt et le partager avec l’équipe.
      </Card>
      <Card icon="folder" tone="coral" title="Un projet Claude" size={22} cls={A.right} style={dl(250)}>
        Les fiches en document de référence du projet de l’équipe.
      </Card>
      <Card icon="table" tone="teal" title="Une page partagée" size={22} cls={A.right} style={dl(350)}>
        SharePoint ou OneNote : simple, cherchable, versionné.
      </Card>
    </div>
  </Frame>
);

// ─── Labs ───────────────────────────────────────────────────────────────────
const M2_Lab1: Page = () => (
  <LabPage
    mod={2}
    n="2.1"
    title="La communication d’incident"
    defi="prompt"
    who="Individuel · puis relecture en binôme"
    minutes={15}
    where={
      <>
        <PathChip>Orvalis/journal-incident-FS02.docx</PathChip>
        <div style={{ marginTop: 10 }}>Deux messages, plus votre prompt rangé dans une fiche de la bibliothèque.</div>
      </>
    }
    objective={
      <>
        Rédiger, à partir du journal, <strong>deux messages</strong> sur l’incident FS-02 : un pour les utilisateurs des entrepôts, un pour la direction
        logistique.
      </>
    }
    crit={
      <>
        <CheckItem id="l21-c1" size={22}>
          Les cinq ingrédients présents
        </CheckItem>
        <CheckItem id="l21-c2" size={22}>
          Heure, impact et retour visé exacts
        </CheckItem>
        <CheckItem id="l21-c3" size={22}>
          Zéro jargon dans le message utilisateurs
        </CheckItem>
      </>
    }
  >
    <div>
      Écrivez le contexte une fois, puis déclinez pour chaque lecteur. La direction veut savoir : combien de commandes retardées, combien de temps, quel
      risque que ça recommence.
    </div>
    <Bonus>Faites rédiger le message de fin d’incident, à envoyer à 10 h 31, puis comparez le ton avec le premier.</Bonus>
  </LabPage>
);

const M2_Lab2: Page = () => (
  <LabPage
    mod={2}
    n="2.2"
    title="La réponse type à une demande récurrente"
    defi="prompt"
    who="En binôme"
    minutes={15}
    where={
      <>
        <PathChip>Orvalis/tickets-recurrents.xlsx</PathChip>
        <div style={{ marginTop: 10 }}>Une réponse type avec variables, testée sur deux tickets réels du fichier.</div>
      </>
    }
    objective={
      <>
        Créer la réponse type d’Inès pour « <strong>Je n’ai plus accès au dossier partagé</strong> » : une fiche réutilisable, avec des variables entre
        crochets.
      </>
    }
    crit={
      <>
        <CheckItem id="l22-c1" size={22}>
          Variables entre crochets, faciles à remplir
        </CheckItem>
        <CheckItem id="l22-c2" size={22}>
          Testée sur deux tickets différents
        </CheckItem>
        <CheckItem id="l22-c3" size={22}>
          Fiche complète : quand, prompt, outil, auteur
        </CheckItem>
      </>
    }
  >
    <div>
      Commencez par : « Pose-moi d’abord tes questions. » Puis demandez une réponse qui explique la cause probable, la vérification à faire par
      l’utilisateur et le délai de traitement.
    </div>
    <Bonus>Même exercice pour « nouveau téléphone : je ne reçois plus la notification d’authentification ».</Bonus>
  </LabPage>
);

// ─── Quiz & synthèse ────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz du module 2</Title>
    <QuizSeries y={200}>
      <QuizQ q="Quels sont les cinq ingrédients d’un prompt efficace ?" explain="Rôle, contexte, tâche, format, contraintes. Le contexte est souvent celui qui manque le plus.">
        <QOpt>Politesse, rôle, tâche, merci, signature</QOpt>
        <QOpt ok>Rôle, contexte, tâche, format, contraintes</QOpt>
        <QOpt>Tâche, longueur, langue, date, outil</QOpt>
      </QuizQ>
      <QuizQ q="La première réponse est trop technique pour les utilisateurs. Que faites-vous ?" explain="On relance dans la même conversation : l’IA garde le contexte et corrige la cible.">
        <QOpt>Je recommence une nouvelle conversation</QOpt>
        <QOpt ok>Je relance : « Réécris pour un non-technicien »</QOpt>
        <QOpt>Je corrige tout à la main</QOpt>
      </QuizQ>
      <QuizQ q="Vous ne savez pas quoi préciser pour une procédure. Le meilleur réflexe ?" explain="« Pose-moi d’abord tes questions » : l’IA liste ce qui lui manque, vous répondez, elle rédige.">
        <QOpt ok>Demander à l’IA de poser d’abord ses questions</QOpt>
        <QOpt>Écrire un prompt très long au hasard</QOpt>
        <QOpt>Laisser l’IA deviner</QOpt>
      </QuizQ>
      <QuizQ q="Dans Microsoft 365 Copilot, à quoi sert « / » dans un prompt ?" explain="À citer un fichier, un e-mail ou une réunion précis, sans le télécharger ni le copier.">
        <QOpt>À commenter le prompt</QOpt>
        <QOpt>À changer de langue</QOpt>
        <QOpt ok>À citer un fichier, un e-mail ou une réunion</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Ce qu’on retient du module 2</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="violet" d={100}>
        Cinq ingrédients : <strong>rôle, contexte, tâche, format, contraintes</strong>.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Le contexte s’apporte : <strong>fichier joint, « / », projet, instructions</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        La première réponse est un <strong>brouillon</strong> : on relance dans la même conversation.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Dans le doute : « <strong>Pose-moi d’abord tes questions</strong> ».
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Un bon prompt devient une <strong>fiche partagée</strong> de la bibliothèque d’équipe.
      </SynthRow>
    </div>
    <PosteCard>
      Créez la bibliothèque de l’équipe avec vos deux fiches du jour. Objectif : dix fiches d’ici un mois, une par demande récurrente.
    </PosteCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M2_Section, M2_AvantApres, M2_Anatomie, M2_Lecteurs, M2_Contexte, M2_Iterer, M2_Questions, M2_Reparer, M2_Biblio, M2_Lab1, M2_Lab2, M2_Quiz, M2_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M2 · 11:15

OBJECTIF — Annoncer le module : obtenir une réponse exploitable du premier coup.

DIRE — « À l’atelier, on a vu que le prompt compte plus que l’outil. Ce module vous donne une méthode : cinq ingrédients, le bon contexte, quelques relances. Et deux labs sur des situations très concrètes : la communication d’incident, et la réponse type à une demande qui revient tout le temps. »

TRANSITION — « Commençons par une comparaison. »`,
  `⏱ 4 min · AVANT / APRÈS (2 clics)

OBJECTIF — Montrer l’écart entre une demande express et une demande structurée.

DIRE — « Lundi 8 h 05, Inès doit prévenir les entrepôts. Première façon : “Écris un message sur la panne.” » → beat 1 : « Résultat : un message poli et vide. Quelle panne ? Qui est touché ? Que faire ? Inutilisable. » « Deuxième façon : cinq lignes de demande. » → beat 2 : « Résultat : un objet clair, l’heure, l’impact, ce qu’on fait et que faire en attendant. Trente secondes de plus à écrire, dix minutes de gagnées. »

TRANSITION — « Décortiquons la deuxième demande. »`,
  `⏱ 6 min · LES CINQ INGRÉDIENTS (démo interactive)

OBJECTIF — Présenter la structure rôle, contexte, tâche, format, contraintes et son effet sur la réponse.

DIRE — « On part de “Écris un message sur la panne”. » Activer Rôle et Tâche : « La jauge reste rouge : c’est encore générique. » Activer Contexte : « Maintenant c’est précis… mais regardez : “saturation du volume D:”, “purge des journaux”. C’est pour qui ? » Activer Format et Contraintes : « Là, c’est prêt à envoyer après relecture. »

INSISTER — Le contexte apporte les faits, les contraintes adaptent au lecteur. Ce sont les deux ingrédients les plus souvent oubliés.

ANIMATION — Les interrupteurs se cliquent à la souris. « Tout » et « Vider » pour rejouer.

TRANSITION — « Et si le lecteur change ? »`,
  `⏱ 3 min · DEUX LECTEURS

OBJECTIF — Montrer qu’on adapte un même contexte à plusieurs publics.

DIRE — « Même incident. À gauche, pour les entrepôts : sans jargon, que faire en attendant. À droite, pour l’équipe technique : des puces, l’état, la cause probable, le prochain point. Seuls le rôle, la tâche et les contraintes changent. L’astuce : écrire le contexte une fois et demander les déclinaisons. »

TRANSITION — « Encore faut-il que l’IA ait le contexte. Comment le lui donner ? »`,
  `⏱ 4 min · DONNER DU CONTEXTE

OBJECTIF — Présenter les quatre façons de fournir le contexte.

DIRE — « Un : joindre le fichier, plus fiable qu’un copier-coller partiel. Deux : dans Microsoft 365 Copilot, la barre oblique pour citer un fichier SharePoint, un e-mail ou une réunion. Trois : dans Claude, un projet par sujet, avec les documents de référence. Quatre : des instructions permanentes, réglées une fois. Par exemple : “Je suis technicienne support, je rédige pour des non-techniciens.” »

QUESTION — « Qui a déjà réglé des instructions personnalisées ? » Montrer où se trouvent les paramètres dans chaque outil.

TRANSITION — « Une fois la première réponse obtenue, on l’améliore. »`,
  `⏱ 4 min · ITÉRER (démo)

OBJECTIF — Donner cinq relances réutilisables.

DIRE — Cliquer chaque relance. « Plus court. Pour un non-technicien. En tableau : idéal pour un point d’incident. Qu’est-ce qui manque : ma préférée, l’IA relit son propre texte. Et trois versions de ton, pour choisir. »

INSISTER — On corrige dans la même conversation ; on n’en ouvre une nouvelle qu’en changeant de sujet.

TRANSITION — « Et quand on ne sait même pas quoi préciser ? »`,
  `⏱ 3 min · « POSE-MOI D’ABORD TES QUESTIONS » (3 clics)

OBJECTIF — Apprendre à faire poser les questions par l’IA.

DIRE — « Malik doit écrire une procédure. Il ne sait pas tout ce qu’il faut préciser. Il ajoute une phrase : “Avant de rédiger, pose-moi tes questions.” » → beat 1 : « L’IA demande la version, les serveurs, qui exécute, la durée de conservation. » → beat 2 : « Malik répond en une ligne. » → beat 3 : « Et la procédure arrive en quatre parties. On gagne un aller-retour, et on n’oublie rien. »

TRANSITION — « À vous de réparer quelques prompts. »`,
  `⏱ 7 min · RÉPAREZ CES PROMPTS (exercice, 3 clics)

OBJECTIF — Appliquer la méthode sur trois prompts réels.

DIRE — « Trois prompts qu’on voit tous les jours. Deux minutes par carte, en binôme : réécrivez-le. » Après chaque carte, faire lire une ou deux propositions, puis → beat 1, → beat 2, → beat 3 pour retourner les cartes l’une après l’autre.

RÉPONSES TYPES — Les participants ajoutent spontanément le format ; ils oublient le lecteur et le cas d’échec (« Ça ne marche pas ? »).

TRANSITION — « Ces bons prompts, il ne faut pas les perdre. »`,
  `⏱ 3 min · BIBLIOTHÈQUE DE PROMPTS

OBJECTIF — Installer l’idée d’une bibliothèque partagée.

DIRE — « Un bon prompt écrit une fois sert à toute l’équipe. On le range dans une fiche : un nom, quand l’utiliser, le prompt avec ses variables entre crochets, l’outil, l’auteur. Où la ranger ? Dans les prompts enregistrés de Copilot, dans un projet Claude, ou simplement dans une page SharePoint ou OneNote. Le plus important, c’est qu’elle soit trouvée. »

TRANSITION — « Vos deux premiers labs vont alimenter cette bibliothèque. »`,
  `⏱ 2 min + 15 min · LAB 2.1 (minuteur)

OBJECTIF — Rédiger une communication d’incident pour deux publics.

DIRE — « À partir du journal d’incident FS-02, rédigez deux messages : un pour les utilisateurs des entrepôts, un pour la direction logistique. Écrivez le contexte une fois, puis déclinez. Vérifiez l’heure, l’impact, le retour visé. Et rangez votre prompt dans une fiche. »

ANIMATION — Lancer le minuteur. Parcours de base pour les curieux : réutiliser le prompt de la page « cinq ingrédients ». Défi pour les réguliers : le bonus.

RÉPONSES TYPES — Erreur fréquente : la direction reçoit un message technique. Elle veut l’impact métier : commandes retardées, durée, risque de récidive.

TRANSITION — « Deuxième lab : une demande qui revient dix fois par jour. »`,
  `⏱ 2 min + 15 min · LAB 2.2 (minuteur)

OBJECTIF — Créer une réponse type réutilisable, avec variables.

DIRE — « Inès reçoit dix fois par jour : “Je n’ai plus accès au dossier partagé.” Créez sa réponse type. Commencez par “Pose-moi d’abord tes questions”, puis testez la réponse sur deux tickets du fichier. »

ANIMATION — Lancer le minuteur. Faire lire deux fiches à voix haute avant la pause déjeuner.

TRANSITION — « Petit quiz avant le déjeuner. »`,
  `⏱ 4 min · QUIZ M2

OBJECTIF — Évaluation formative du module 2.

DIRE — « Quatre questions, vote à main levée. »

TRANSITION — « Ce qu’on retient. »`,
  `⏱ 2 min · SYNTHÈSE M2 · 12:30

OBJECTIF — Ancrer les cinq idées du module.

DIRE — « Cinq ingrédients. Le contexte s’apporte de quatre façons. La première réponse est un brouillon. Dans le doute, faites poser les questions. Et un bon prompt devient une fiche partagée. Objectif pour votre équipe : dix fiches d’ici un mois. »

TRANSITION — « Bon appétit ! On reprend à 14 h avec le module 3 : rédiger, synthétiser, préparer. »`,
];
// @@NOTES-END
