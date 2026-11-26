// ─── M4 · Divider ───────────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Les grands enjeux éthiques" sub="Biais, transparence, vie privée : ce qui peut mal tourner, et pourquoi." dur="≈ 30 min">
    <SecItem n={1}>Biais algorithmiques et discrimination</SecItem>
    <SecItem n={2}>Transparence et explicabilité</SecItem>
    <SecItem n={3}>Respect de la vie privée et protection des données</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── M5 · Three families of risk ────────────────────────────────────────────
const M4Risk = ({ n, icon, tone, name, q, ex }: { n: number; icon: IconName; tone: Tone; name: string; q: string; ex: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 560, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.4, color: C.soft }}>{q}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>{ex}</div>
    </div>
  </div>
);

const M4_Three: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Trois grands enjeux éthiques</Title>
    <Lede>Aucun n’est une raison de renoncer. Tous sont une raison d’encadrer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M4Risk n={1} icon="scale" tone="violet" name="Les biais" q="L’IA reproduit, et parfois amplifie, les déséquilibres de ses exemples." ex={<><b>Mutuelle :</b> le tri des CV de Samir (P2).</>} />
      <M4Risk n={2} icon="eye" tone="teal" name="La transparence" q="Personne ne sait dire pourquoi le modèle a décidé." ex={<><b>Mutuelle :</b> le score de fraude de Mei (P3).</>} />
      <M4Risk n={3} icon="lock" tone="blue" name="La vie privée" q="L’IA a faim de données, souvent personnelles, parfois sensibles." ex={<><b>Mutuelle :</b> les campagnes de Vincent (P4).</>} />
    </div>
  </Frame>
);

// ─── M5 · Bias: how it happens (CV screening) ───────────────────────────────
const M4HBar = ({ label, pct, tone, d }: { label: string; pct: number; tone: Tone; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 54 }}>
    <span style={{ width: 120, fontSize: 25, color: C.ink }}>{label}</span>
    <div className={A.grow} style={{ width: pct * 5, height: 40, borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{pct} %</span>
  </div>
);

const M4Cv = ({ name, line, score, tone }: { name: string; line: string; score: number; tone: Tone }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '16px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name="doc" size={26} color={C.soft} />
      <b style={{ fontSize: 24 }}>{name}</b>
    </div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>10 ans d’expérience · mêmes diplômes</div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{line}</div>
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 44, color: STRONG[tone] }}>{score} / 100</div>
  </div>
);

const M4_Bias: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Le biais : l’IA apprend aussi nos travers</Title>
    <Lede>Comment un outil de tri de CV, entraîné sur dix ans d’embauches, apprend à discriminer.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 860, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 32px' }}>
      <Eyebrow c={C.soft} size={22}>
        1 · Les exemples : qui a été embauché ?
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <M4HBar label="Hommes" pct={80} tone="blue" d={300} />
        <M4HBar label="Femmes" pct={20} tone="violet" d={450} />
      </div>
      <div className={b.on(1)} style={{ marginTop: 22 }}>
        <Eyebrow c={C.soft} size={22}>
          2 · Ce que le modèle en déduit
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 27, lineHeight: 1.4, color: C.ink }}>« Un bon profil ressemble aux profils déjà embauchés. »</div>
      </div>
      <div className={b.on(2)} style={{ marginTop: 22 }}>
        <Eyebrow c={C.soft} size={22}>
          3 · Deux CV identiques, sauf une ligne
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', gap: 18 }}>
          <M4Cv name="CV A" line="Capitaine, club de hockey" score={82} tone="green" />
          <M4Cv name="CV B" line="Capitaine, équipe féminine de hockey" score={61} tone="coral" />
        </div>
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1040, top: 280, width: 760 }}>
      <Card tone="teal" icon="book" title="Un cas réel" size={25}>
        En 2018, Amazon a abandonné un outil expérimental de tri de CV : il pénalisait les candidatures contenant le mot « women’s » (Reuters).
      </Card>
    </div>
    <Callout cls={b.on(4)} title="Pour le projet P2 de Samir" tone="violet" icon="humanCheck" size={26} style={{ position: 'absolute', left: 1040, top: 640, width: 760 }}>
      Dix ans d’embauches de la Mutuelle : quels déséquilibres contiennent-ils ? À vérifier avant d’entraîner quoi que ce soit.
    </Callout>
  </Frame>
);

// ─── M5 · Biases in a project ───────────────────────────────────────────────
const M5BiasCard = ({ n, icon, tone, name, children, fix }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode; fix: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 825 }}>
    <div style={{ boxSizing: 'border-box', height: 310, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={58} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.4, color: T.green.fg }}>
        <Icon name="shieldCheck" size={26} style={{ marginTop: 2 }} />
        <span>{fix}</span>
      </div>
    </div>
  </div>
);

// ─── M4 · Where biases come from ────────────────────────────────────────────
const M4Src = ({ n, icon, tone, name, children, ex, tag }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode; ex: ReactNode; tag: string }) => (
  <div className={b.on(n)}>
    <div style={{ boxSizing: 'border-box', height: 340, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Num n={n} tone={tone} size={48} />
        <Icon name={icon} size={34} color={T[tone].fg} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '12px 18px', fontSize: 23, lineHeight: 1.4, color: C.ink }}>
        <Eyebrow c={T[tone].fg} size={18}>
          {tag}
        </Eyebrow>
        <div style={{ marginTop: 2 }}>{ex}</div>
      </div>
    </div>
  </div>
);

const M4_Sources: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>D’où viennent les biais ? Quatre portes d’entrée</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 26, columnGap: 30 }}>
      <M4Src n={1} icon="archive" tone="violet" name="Un passé déséquilibré" tag="Recrutement · 2018" ex="Amazon : le modèle apprend que les embauches passées étaient surtout masculines.">
        Les données reflètent des décisions humaines d’hier, avec leurs préjugés.
      </M4Src>
      <M4Src n={2} icon="users" tone="coral" name="Des données incomplètes" tag="Reconnaissance faciale · 2018" ex="Étude « Gender Shades » (MIT) : jusqu’à 34,7 % d’erreurs pour les femmes à la peau foncée, 0,8 % pour les hommes à la peau claire.">
        Certains groupes sont absents ou trop peu nombreux dans les exemples.
      </M4Src>
      <M4Src n={3} icon="map" tone="yellow" name="Des indices indirects" tag="Assurance, crédit" ex="Le code postal peut trahir l’origine ou le revenu ; un prénom ou un sport, le genre.">
        On retire la variable sensible… mais d’autres la révèlent quand même.
      </M4Src>
      <M4Src n={4} icon="target" tone="teal" name="Un mauvais objectif" tag="Santé · États-Unis · 2019" ex="Revue Science : estimer les besoins de soins par les dépenses passées désavantageait les patients noirs, qui avaient moins accès aux soins.">
        Le modèle optimise exactement ce qu’on lui demande, pas ce qu’on voulait.
      </M4Src>
    </div>
  </Frame>
);

// ─── M4 · Transparency & explainability (toggle) ────────────────────────────
const M4Notion = ({ d, icon, tone, name, q }: { d: number; icon: IconName; tone: Tone; name: string; q: string }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{q}</div>
    </div>
  </div>
);

const M4Factor = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
    <Num n={n} tone="teal" size={30} style={{ transform: 'translateY(4px)' }} />
    <span>{children}</span>
  </div>
);

const M4_BlackBox: Page = () => {
  const [on, setOn] = useState(false);
  return (
    <Frame mod={4} kind="exercice">
      <Title>Transparence et explicabilité : pouvoir dire pourquoi</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, ...dl(100) }}>
        <Toggle on={on} onChange={setOn} label={on ? 'Lettre explicable' : 'Lettre « boîte noire »'} tone="teal" size={28} />
      </div>
      <div
        className={A.in}
        style={{ position: 'absolute', left: 120, top: 280, width: 1040, height: 650, boxSizing: 'border-box', background: '#FFFEFA', borderRadius: 10, boxShadow: `${SHADOW}, inset 0 7px 0 ${on ? C.teal : C.faint}`, padding: '30px 40px', transition: `box-shadow 400ms ${EASE}`, ...dl(200) }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="leaf" tone="teal" size={44} solid />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.ink }}>Mutuelle des Érables</span>
          <span style={{ marginLeft: 'auto', fontSize: 21, color: C.muted }}>Réclamation no 2027-1184</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 25, lineHeight: 1.45, color: C.ink }}>
          Madame, après analyse, votre réclamation a été <b>signalée pour vérification approfondie</b>. Les versements sont suspendus.
        </div>
        {on ? (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.teal.fg }}>Les principaux facteurs de ce signalement :</div>
            <M4Factor n={1}>trois réclamations en six semaines ;</M4Factor>
            <M4Factor n={2}>un fournisseur de soins inscrit depuis moins d’un mois ;</M4Factor>
            <M4Factor n={3}>un montant 2,4 fois supérieur à la moyenne régionale.</M4Factor>
            <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.45, color: C.soft }}>
              Ce signalement a été produit par un système automatisé. Vous pouvez faire corriger vos renseignements et présenter vos observations à une conseillère, qui pourra réviser la décision.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, fontWeight: 600, color: T.coral.fg }}>
            <Icon name="alert" size={34} />
            Pourquoi ? Par qui ? Que puis-je faire ? La lettre ne le dit pas.
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1210, top: 280, width: 590, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M4Notion d={300} icon="eye" tone="blue" name="Transparence" q="Savoir qu’une IA intervient, et comment." />
        <M4Notion d={420} icon="bulb" tone="teal" name="Explicabilité" q="Pouvoir dire pourquoi ce résultat, pour cette personne." />
        <M4Notion d={540} icon="humanCheck" tone="green" name="Recours" q="Pouvoir contester auprès d’un humain." />
        <Callout cls={A.right} title="Au Québec" tone="yellow" icon="scale" size={24} style={dl(660)}>
          Pour une décision entièrement automatisée, c’est une obligation légale (module 5).
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M4 · Privacy: AI is hungry for data ────────────────────────────────────
const M4Priv = ({ d, icon, tone, name, children, ex }: { d: number; icon: IconName; tone: Tone; name: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 270, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={54} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'center', fontSize: 22, color: T[tone].fg, fontWeight: 600 }}>
        <Icon name="leaf" size={22} />
        {ex}
      </div>
    </div>
  </div>
);

const M4_Privacy: Page = () => (
  <Frame mod={4}>
    <Title>Vie privée : l’IA a faim de données</Title>
    <Lede>Quatre façons de trahir la confiance, souvent sans le vouloir.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 26, columnGap: 30 }}>
      <M4Priv d={100} icon="database" tone="blue" name="Collecter trop" ex="« Tant qu’à y être, gardons tout » : non.">
        Chaque donnée gardée « au cas où » est un risque de plus.
      </M4Priv>
      <M4Priv d={220} icon="route" tone="yellow" name="Détourner l’usage" ex="Une réclamation de santé réutilisée pour le marketing.">
        Des données recueillies pour un but, réutilisées pour un autre.
      </M4Priv>
      <M4Priv d={340} icon="search" tone="violet" name="Deviner l’intime" ex="Des achats en pharmacie qui « révèlent » une grossesse.">
        Un modèle peut déduire une maladie ou une situation familiale jamais déclarées.
      </M4Priv>
      <M4Priv d={460} icon="send" tone="coral" name="Laisser fuir" ex="Samsung, 2023 : du code confidentiel collé dans ChatGPT.">
        Coller un dossier dans un outil public, c’est le sortir de l’organisation.
      </M4Priv>
    </div>
    <Callout cls={A.in} title="La bonne question" tone="teal" icon="humanCheck" size={26} style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(600) }}>
      La personne s’attend-elle à cet usage de ses données ? Si la réponse est non, on s’arrête.
    </Callout>
  </Frame>
);

// ─── M4 · Exercise: traffic light for data ──────────────────────────────────
const M4Zone = ({ x, icon, tone, label }: { x: number; icon: IconName; tone: Tone; label: string }) => (
  <div
    className={A.fade}
    style={{ position: 'absolute', left: x, top: 500, width: 540, height: 450, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, border: `3px dashed ${T[tone].bd}`, padding: '18px 22px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M4Key = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span className={b.pop(1)} style={{ flex: 'none', marginLeft: 'auto', padding: '2px 10px', borderRadius: 8, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
    {children}
  </span>
);

const M4_Traffic: Page = () => (
  <Frame mod={4} kind="exercice" beats={1}>
    <Title>À vous : quelles données dans quel outil ?</Title>
    <Lede>Dites-moi où va chaque étiquette : vert, jaune ou rouge. Le corrigé apparaît au clic.</Lede>
    <M4Zone x={120} icon="check" tone="green" label="Vert · tout outil" />
    <M4Zone x={690} icon="shieldCheck" tone="yellow" label="Jaune · outil approuvé" />
    <M4Zone x={1260} icon="lock" tone="coral" label="Rouge · jamais tel quel" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Le texte d’une publicité de la Mutuelle <M4Key tone="green">VERT</M4Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Le dossier d’invalidité d’un membre <M4Key tone="coral">ROUGE</M4Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Le plan marketing 2027, confidentiel <M4Key tone="yellow">JAUNE</M4Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      La grille publique des soins remboursés <M4Key tone="green">VERT</M4Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Les CV reçus pour un poste d’analyste <M4Key tone="coral">ROUGE</M4Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Le compte rendu du comité de direction <M4Key tone="yellow">JAUNE</M4Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      Le diagnostic d’un employé en arrêt <M4Key tone="coral">ROUGE</M4Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Des statistiques de réclamations par région <M4Key tone="yellow">JAUNE</M4Key>
    </Drag>
  </Frame>
);

// ─── M4 · QCM & synthesis ───────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={3}
    title="Retirer la variable suffit-il ?"
    q="Le modèle de tri de Samir n’utilise pas le genre des candidats. Peut-il quand même désavantager les femmes ?"
    explain="Retirer une variable sensible ne suffit pas : d’autres données la « trahissent ». Il faut tester les résultats par groupe, avant et après la mise en service."
  >
    <Opt why="Piège ! C’est exactement le cas Amazon : le genre n’était pas une variable, mais des mots du CV le révélaient.">Non : sans la variable genre, c’est impossible</Opt>
    <Opt why="Piège ! Plus de données d’un passé déséquilibré, c’est surtout un biais mieux appris.">Non, si les données d’entraînement sont nombreuses</Opt>
    <Opt why="Piège ! Personne n’a besoin de le programmer : le modèle l’apprend seul, à partir des exemples.">Seulement si Mei l’a programmé ainsi</Opt>
    <Opt ok why="Exact : prénom, sport, interruption de carrière, école… Des indices indirects peuvent révéler le genre.">
      Oui, par des indices indirects : prénom, sport, pause de carrière
    </Opt>
  </QcmPage>
);

const M4_Synth: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={
      <>
        Pour un usage de l’IA dans votre organisation, posez trois questions :
        <br />
        <br />
        Qui pourrait être désavantagé ? Saurait-on expliquer un résultat ? Quelles données y passent ?
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Une IA apprend nos <b>déséquilibres</b> : elle n’est jamais neutre par défaut.
    </SynthRow>
    <SynthRow n={2} tone="coral" d={220}>
      Retirer la variable sensible <b>ne suffit pas</b> : il faut tester les résultats.
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Transparence, explicabilité, recours : <b>dire qu’une IA intervient, pourquoi, et comment contester</b>.
    </SynthRow>
    <SynthRow n={4} tone="blue" d={460}>
      Moins de données, <b>un seul usage annoncé</b>, aucune fuite vers un outil public.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      La question clé : <b>la personne s’y attend-elle ?</b>
    </SynthRow>
  </SynthPage>
);

// @@PAGES-BEGIN
export const __pages = [M4_Divider, M4_Three, M4_Bias, M4_Sources, M4_BlackBox, M4_Privacy, M4_Traffic, M4_Qcm, M4_Synth];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 4 (≈ 11 h 30)

OBJECTIF — Ouvrir le volet éthique, en partant de ce que les participants viennent d'observer en atelier.

DIRE — « Module 4 : les grands enjeux éthiques. Vous venez de voir de vos yeux des images stéréotypées et des sources inventées. Ce n'est pas un hasard : c'est la mécanique même de l'IA. Trois enjeux : les biais, la transparence, la vie privée. »

RYTHME — 30 minutes, jusqu'au dîner.

SOBEYS — 30 minutes, jusqu'à la fin de la matinée 1 (12 h).

TRANSITION — « Les trois enjeux en un coup d'œil. »`,
  `⏱ 2 min · TROIS ENJEUX (3 clics)

DIRE —
→ beat 1 : « Les biais : l'IA reproduit, et parfois amplifie, les déséquilibres de ses exemples. À la Mutuelle : le tri des CV de Samir. »
→ beat 2 : « La transparence : personne ne sait dire pourquoi le modèle a décidé. Le score de fraude de Mei. »
→ beat 3 : « La vie privée : l'IA a faim de données, souvent personnelles, parfois sensibles. Les campagnes de Vincent. »

INSISTER — « Aucun de ces enjeux n'est une raison de renoncer à l'IA. Tous sont une raison de l'encadrer. »

TRANSITION — « Commençons par le plus connu : le biais. »`,
  `⏱ 5 min · LE BIAIS (4 clics)

OBJECTIF — Faire comprendre mécaniquement d'où vient un biais algorithmique et comment il devient de la discrimination.

DIRE — « Imaginons un outil de tri de CV, entraîné sur dix ans d'embauches passées. Dans ce poste, 80 % des personnes embauchées étaient des hommes. »
→ beat 1 : « Le modèle n'a aucune intention. Il en déduit simplement qu'un bon profil ressemble aux profils déjà embauchés. »
→ beat 2 : « Deux CV identiques, sauf une ligne : "capitaine de l'équipe féminine de hockey". 82 contre 61. Le mot "féminine" est devenu un signal négatif. »
→ beat 3 : « Ce n'est pas de la fiction : en 2018, Reuters a révélé qu'Amazon avait abandonné un outil expérimental de tri de CV qui pénalisait les candidatures contenant le mot "women's", comme dans "women's chess club captain". »
→ beat 4 : « Pour le projet de Samir : dix ans d'embauches de la Mutuelle. Quels déséquilibres contiennent-elles ? À vérifier avant d'entraîner quoi que ce soit. »

PRÉCISION — Les scores 82 / 61 sont illustratifs. Au Québec, la Charte des droits et libertés de la personne interdit la discrimination à l'embauche (sexe, origine, âge…) : un outil biaisé expose l'organisation, même sans intention.

TRANSITION — « D'où viennent les biais, concrètement ? Quatre portes d'entrée. »`,
  `⏱ 4 min · QUATRE SOURCES DE BIAIS (4 clics)

DIRE —
→ beat 1 : « Un passé déséquilibré : les données reflètent des décisions humaines d'hier. C'est le cas Amazon. »
→ beat 2 : « Des données incomplètes : certains groupes sont absents ou trop peu nombreux. L'étude Gender Shades, de Joy Buolamwini et Timnit Gebru au MIT, en 2018 : des systèmes commerciaux de reconnaissance faciale se trompaient jusqu'à 34,7 % du temps sur le genre des femmes à la peau foncée, contre 0,8 % pour les hommes à la peau claire. »
→ beat 3 : « Des indices indirects, ou variables "proxy" : on retire la variable sensible, mais le code postal trahit l'origine ou le revenu ; un prénom, le genre. »
→ beat 4 : « Un mauvais objectif : une étude publiée dans la revue Science en 2019 (Obermeyer et collègues) a montré qu'un algorithme utilisé dans des hôpitaux américains estimait les besoins de soins à partir des dépenses passées. Or, à état de santé égal, les patients noirs avaient moins dépensé, faute d'accès aux soins. Ils étaient donc jugés moins prioritaires. »

MESSAGE CLÉ — « Aucune de ces sources ne suppose une mauvaise intention. C'est pour ça qu'il faut tester. »

QUESTION — « Pour le projet de Samir, lesquelles de ces quatre portes sont ouvertes ? » Réponse attendue : surtout 1 et 3.

TRANSITION — « Deuxième enjeu : la transparence. »`,
  `⏱ 5 min · TRANSPARENCE ET EXPLICABILITÉ (interrupteur)

ANIMATION — Commencez sur « Lettre boîte noire ». Lisez-la. Demandez : « Vous êtes ce membre. Que ressentez-vous ? Que pouvez-vous faire ? » Deux réponses au micro. Puis cliquez l'interrupteur.

DIRE — « Même décision, mais cette fois la lettre dit trois choses : les principaux facteurs du signalement ; qu'il vient d'un système automatisé ; et que le membre peut corriger ses renseignements et parler à une conseillère qui peut réviser la décision. »

Les trois notions à droite :
• Transparence : savoir qu'une IA intervient, et comment.
• Explicabilité : pouvoir dire pourquoi ce résultat, pour cette personne. Difficile avec un modèle profond, d'où le choix de modèles plus simples quand l'enjeu est élevé.
• Recours : pouvoir contester auprès d'un humain.

AU QUÉBEC — « Ce n'est pas qu'une bonne pratique. Quand une décision repose exclusivement sur un traitement automatisé, l'article 12.1 de la loi sur le secteur privé, modifiée par la Loi 25, oblige à informer la personne, à lui donner sur demande les principaux facteurs, et à lui permettre de présenter ses observations à quelqu'un qui peut réviser la décision. On le détaille au module 5. »

TRANSITION — « Troisième enjeu : la vie privée. »`,
  `⏱ 4 min · VIE PRIVÉE

DIRE — « L'IA a faim de données. Quatre façons de trahir la confiance, souvent sans le vouloir. »
• « Collecter trop : chaque donnée gardée "au cas où" est un risque de plus. C'est le principe de minimisation. »
• « Détourner l'usage : des données recueillies pour payer une réclamation, réutilisées pour cibler une publicité. Les gens n'ont pas donné leurs données pour ça. »
• « Deviner l'intime : un modèle peut déduire une grossesse ou une maladie à partir d'achats, sans que la personne l'ait jamais déclaré. La donnée devinée est aussi sensible que la donnée déclarée. »
• « Laisser fuir : en 2023, des ingénieurs de Samsung ont collé du code confidentiel dans ChatGPT. L'entreprise a ensuite restreint l'usage de ces outils. »

LA BONNE QUESTION — « La personne s'attend-elle à cet usage de ses données ? Si la réponse est non, on s'arrête. »

TRANSITION — « Exercice : quelles données, dans quel outil ? »`,
  `⏱ 5 min · EXERCICE FEU TRICOLORE (1 clic pour le corrigé)

ANIMATION — Pour chaque étiquette, demandez la couleur à voix haute (« vert », « jaune » ou « rouge ») et glissez-la selon la majorité. Double-clic pour remettre une étiquette à sa place. → révèle le corrigé.

CORRIGÉ —
• Vert (tout outil) : la publicité (publique), la grille des soins remboursés (publique).
• Jaune (outil approuvé par l'organisation seulement) : le plan marketing confidentiel, le compte rendu du comité de direction, les statistiques par région (agrégées, mais stratégiques ; attention aux petites régions où l'on pourrait reconnaître quelqu'un).
• Rouge (jamais tel quel) : le dossier d'invalidité, les CV, le diagnostic d'un employé. Renseignements personnels, voire de santé.

DÉBAT ATTENDU — Les statistiques : vert pour certains. « Agrégé ne veut pas dire anonyme : dans une petite région, trois réclamations suffisent à reconnaître quelqu'un. »

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 2 min · QCM 3

RÉPONSE — D : oui, par des indices indirects.
• A ✗ PIÈGE — C'est exactement le cas Amazon.
• B ✗ PIÈGE — Plus de données biaisées = un biais mieux appris.
• C ✗ PIÈGE — Personne ne le programme : le modèle l'apprend.

MESSAGE CLÉ — On ne prouve pas l'absence de biais en regardant les variables : on teste les résultats par groupe (taux de sélection des femmes et des hommes, par exemple).

TRANSITION — « Bilan du module 4, puis le dîner. »

SOBEYS — Dites « Bilan du module 4, puis on termine la matinée. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 4 (puis DÎNER, ≈ 12 h · SOBEYS : FIN DE LA MATINÉE 1 à 12 h)

DIRE — Relisez les cinq points.

À VOTRE POSTE — Les trois questions de la carte bleue : qui pourrait être désavantagé ? saurait-on expliquer ? quelles données y passent ?

ANNONCE — « Au retour du dîner, 13 h : ce que la loi impose déjà au Québec, et les grands principes de l'IA responsable. Puis un cas de votre secteur, à juger vous-mêmes. » (APSM : des caméras de fatigue dans une mine. Sobeys : la reconnaissance faciale en magasin. Ne dévoilez pas le cas : effet de surprise pour l'atelier 2.)

SOBEYS — Dites plutôt : « À la prochaine matinée, à 9 h : ce que la loi impose déjà au Québec, et les grands principes de l'IA responsable. Puis un cas de votre secteur, à juger vous-mêmes. » Rappelez la date de la matinée 2 et de garder le document de l'atelier 1. Aucun devoir demandé. Ne dévoilez pas le cas.`,
];
// @@NOTES-END
