// ─── Module 5 · Personnalisation et adaptation des contenus ─────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Personnalisation
        <br />& adaptation
      </>
    }
    sub="À partir d’un même contenu : LinkedIn, Instagram, newsletter, email, article, présentation commerciale. Et un message juste pour chaque public."
    dur="14:20 – 15:10 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · une campagne multicanale
      </Tag>
    }
  >
    <SecItem n={1}>Un message, six canaux : ce qui change, ce qui reste</SecItem>
    <SecItem n={2}>Adapter au public : persona et étape du parcours</SecItem>
    <SecItem n={3}>Personnaliser à grande échelle, sans risque</SecItem>
    <SecItem n={4}>Ajuster la longueur et le format</SecItem>
    <SecItem n={5}>Le prompt maître de déclinaison</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Un message, six canaux (onglets) ───────────────────────────────────────
const M5Why = ({ children }: { children: ReactNode }) => (
  <div style={{ width: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px' }}>
    <Eyebrow c={C.navy} size={19}>
      Ce qui change ici
    </Eyebrow>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);
const M5Pane = ({ mock, children }: { mock: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
    <div style={{ width: 1000, flex: 'none' }}>{mock}</div>
    <M5Why>{children}</M5Why>
  </div>
);
const M5Doc = ({ head, children }: { head: ReactNode; children: ReactNode }) => (
  <div style={{ width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden' }}>
    <div style={{ padding: '14px 24px', background: C.panel, fontSize: 19, color: C.muted, lineHeight: 1.5 }}>{head}</div>
    <div style={{ padding: '20px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M5_Canaux: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Un message, six canaux</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 172, width: 1680, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, background: T.violet.bg, borderRadius: 14, padding: '12px 22px', fontSize: 23, color: C.ink }}>
      <Icon name="bulb" size={28} color={T.violet.fg} />
      <span>
        <strong>Message pivot :</strong> Ardente Bureau installe le café de spécialité dans votre entreprise ; dégustation offerte en novembre.
      </span>
    </div>
    <Tabs initial="li">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 10, ...dl(100) }}>
        <TabBtn id="li" icon="linkedin" tone="blue">
          LinkedIn
        </TabBtn>
        <TabBtn id="ig" icon="insta" tone="pink">
          Instagram
        </TabBtn>
        <TabBtn id="nl" icon="news" tone="teal">
          Newsletter
        </TabBtn>
        <TabBtn id="em" icon="mail" tone="green">
          Email direct
        </TabBtn>
        <TabBtn id="ar" icon="doc" tone="navy">
          Article
        </TabBtn>
        <TabBtn id="pc" icon="slides" tone="violet">
          Présentation commerciale
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 330, width: 1680 }}>
        <TabPane id="li">
          <M5Pane
            mock={
              <SocialPost w={1000} size={23}>
                <strong>Votre machine à café fait-elle fuir vos équipes ?</strong>
                {'\n'}On l’entend souvent chez les office managers lyonnais. Alors on a créé Ardente Bureau : un café de spécialité torréfié à Lyon, installé chez vous en une semaine, sans engagement.
                {'\n'}→ En novembre, on vient le faire déguster à votre équipe. C’est offert.{'\n'}
                <span style={{ color: C.blue }}>#QVT #Lyon #CaféDeSpécialité</span>
              </SocialPost>
            }
          >
            <Bullet size={22} tone="blue">Accroche en question, visible avant « voir plus »</Bullet>
            <Bullet size={22} tone="blue">Angle professionnel : le problème de la cible</Bullet>
            <Bullet size={22} tone="blue">120 à 150 mots, 3 hashtags</Bullet>
            <Bullet size={22} tone="blue">KPI : commentaires, clics, demandes</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="ig">
          <M5Pane
            mock={
              <div style={{ display: 'flex', gap: 30 }}>
                <Phone w={270}>
                  <div style={{ position: 'relative', height: '100%', background: BRAND.dark }}>
                    <CupArt w={251} h={330} bg={BRAND.dark} cup="#F7EDE1" bubble style={{ position: 'absolute', top: 60 }} />
                    <div style={{ position: 'absolute', left: 16, top: 410, right: 12, fontFamily: display, fontWeight: 800, fontSize: 30, color: BRAND.cream }}>La pause qui compte.</div>
                    <div style={{ position: 'absolute', left: 16, bottom: 30, background: '#fff', color: C.ink, borderRadius: 12, padding: '8px 14px', fontSize: 15, fontWeight: 700 }}>
                      Sondage : votre café du bureau ? 😍 / 😬
                    </div>
                  </div>
                </Phone>
                <div style={{ flex: 1, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', fontSize: 23, lineHeight: 1.5, color: C.ink, alignSelf: 'flex-start' }}>
                  <Eyebrow c={T.pink.fg} size={18}>
                    Légende du post associé
                  </Eyebrow>
                  <div style={{ marginTop: 10 }}>
                    Le lundi matin, il y a ceux qui foncent à la machine… et ceux qui la fuient 😅 Ardente Bureau arrive dans les entreprises lyonnaises ☕
                    <br />
                    Taguez la personne qui gère le café chez vous 👇
                  </div>
                </div>
              </div>
            }
          >
            <Bullet size={22} tone="pink">Le visuel porte le message, le texte le complète</Bullet>
            <Bullet size={22} tone="pink">Ton plus léger, emojis mesurés</Bullet>
            <Bullet size={22} tone="pink">Interaction : sondage, tag, question</Bullet>
            <Bullet size={22} tone="pink">KPI : partages, enregistrements, réponses</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="nl">
          <M5Pane
            mock={
              <M5Doc
                head={
                  <>
                    <strong style={{ color: C.ink }}>Objet :</strong> La pause qui compte arrive au bureau · <strong style={{ color: C.ink }}>Pré-en-tête :</strong> dégustation offerte en novembre
                  </>
                }
              >
                Bonjour Claire,
                <br />
                Dix heures, la machine du bureau vous fait encore grimacer ? Ce mois-ci, nous lançons <strong>Ardente Bureau</strong> : nos cafés torréfiés à Lyon, installés chez vous en une semaine, sans engagement.
                <br />
                <span style={{ display: 'inline-block', marginTop: 12, background: C.green, color: '#fff', fontWeight: 700, borderRadius: 8, padding: '6px 18px' }}>Réserver ma dégustation</span>
              </M5Doc>
            }
          >
            <Bullet size={22} tone="teal">Lecteurs déjà abonnés : ton complice</Bullet>
            <Bullet size={22} tone="teal">Objet + pré-en-tête travaillés ensemble</Bullet>
            <Bullet size={22} tone="teal">Personnalisation par prénom</Bullet>
            <Bullet size={22} tone="teal">KPI : ouverture, clic, réservation</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="em">
          <M5Pane
            mock={
              <M5Doc
                head={
                  <>
                    <strong style={{ color: C.ink }}>À :</strong> Nadia R., DRH · <strong style={{ color: C.ink }}>Objet :</strong> Café sur vos trois sites : une idée pour la QVCT
                  </>
                }
              >
                Bonjour Nadia,
                <br />
                Vous préparez votre plan QVCT 2027 : nous accompagnons des entreprises multi-sites avec un café de spécialité et <strong>un interlocuteur unique</strong> pour tous les sites. Seriez-vous disponible 15 minutes la semaine prochaine
                pour en parler, ou pour organiser une dégustation sur l’un de vos sites ?
                <br />
                Bien à vous, Léa — Ardente
              </M5Doc>
            }
          >
            <Bullet size={22} tone="green">Un destinataire, un contexte précis</Bullet>
            <Bullet size={22} tone="green">Court : 80 mots, aucune image</Bullet>
            <Bullet size={22} tone="green">Une seule question fermée à la fin</Bullet>
            <Bullet size={22} tone="green">KPI : taux de réponse, rendez-vous</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="ar">
          <M5Pane
            mock={
              <M5Doc head="ardente · blog · Qualité de vie au travail · 6 min de lecture">
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy, lineHeight: 1.2 }}>Café au bureau : 5 critères pour choisir une solution qui plaît vraiment aux équipes</div>
                <div style={{ marginTop: 12, color: C.soft }}>
                  Qualité, entretien, budget, impact, simplicité : le guide pour comparer les offres de café en entreprise… et pourquoi la dégustation reste le meilleur test.
                </div>
              </M5Doc>
            }
          >
            <Bullet size={22} tone="navy">Utile avant d’être commercial</Bullet>
            <Bullet size={22} tone="navy">Titre construit sur une requête réelle</Bullet>
            <Bullet size={22} tone="navy">L’offre arrive en conclusion</Bullet>
            <Bullet size={22} tone="navy">KPI : trafic organique, temps de lecture</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="pc">
          <M5Pane
            mock={
              <div style={{ width: 1000, height: 450, boxSizing: 'border-box', background: G.navy, borderRadius: 18, boxShadow: SHADOW, padding: '40px 48px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <CupArt w={300} h={300} bg="transparent" cup="#F7EDE1" accent={BRAND.coffee} bubble style={{ position: 'absolute', right: 30, top: 70 }} />
                <Eyebrow c="#C9B6FF" size={18}>
                  Slide 3 / 6
                </Eyebrow>
                <div style={{ marginTop: 14, width: 580, fontFamily: display, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>Ardente Bureau : installé en une semaine, sans engagement</div>
                <div style={{ marginTop: 22, width: 580, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 23, color: '#DCE3FB' }}>
                  <span>• Machine et cafés fournis, entretien inclus</span>
                  <span>• Un café du mois choisi par vos équipes</span>
                  <span>• Résiliable à tout moment</span>
                </div>
              </div>
            }
          >
            <Bullet size={22} tone="violet">Un titre-message par slide</Bullet>
            <Bullet size={22} tone="violet">Trois points maximum, des faits</Bullet>
            <Bullet size={22} tone="violet">Adaptée au décideur rencontré</Bullet>
            <Bullet size={22} tone="violet">KPI : signature, prochaine étape</Bullet>
          </M5Pane>
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Les codes par canal (tableau) ──────────────────────────────────────────
const M5Row = ({ beat, icon, tone, ch, len, ton, form, cta }: { beat: number; icon: IconName; tone: Tone; ch: string; len: string; ton: string; form: string; cta: string }) => (
  <div className={beat ? b.left(beat) : undefined} style={{ display: 'grid', gridTemplateColumns: '300px 230px 270px 1fr 300px', gap: 16, alignItems: 'center', padding: '12px 22px', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, fontSize: 21, lineHeight: 1.35, color: C.soft }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 700, color: C.ink }}>
      <IconTile name={icon} tone={tone} size={42} solid /> {ch}
    </span>
    <span>{len}</span>
    <span>{ton}</span>
    <span>{form}</span>
    <span>{cta}</span>
  </div>
);

const M5_Codes: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>La grille des codes par canal, à coller dans vos prompts</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 196, width: 1680, display: 'grid', gridTemplateColumns: '300px 230px 270px 1fr 300px', gap: 16, padding: '0 22px', boxSizing: 'border-box' }}>
      <Eyebrow c={C.muted} size={17}>Canal</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Longueur</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Ton</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Forme</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Appel à l’action</Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 236, width: 1680, display: 'flex', flexDirection: 'column', gap: 11 }}>
      <M5Row beat={1} icon="linkedin" tone="blue" ch="LinkedIn" len="120–200 mots" ton="Expert, incarné" form="Accroche, lignes courtes, une preuve" cta="Commenter, demander" />
      <M5Row beat={2} icon="insta" tone="pink" ch="Instagram" len="30–80 mots" ton="Léger, visuel" form="Image d’abord, question, hashtags de niche" cta="Taguer, enregistrer" />
      <M5Row beat={3} icon="news" tone="teal" ch="Newsletter" len="150–300 mots" ton="Complice" form="Objet + pré-en-tête, 1 idée, 1 bouton" cta="Un seul clic" />
      <M5Row beat={4} icon="mail" tone="green" ch="Email direct" len="60–100 mots" ton="Personnel, sobre" form="Contexte du destinataire, pas d’image" cta="Une question fermée" />
      <M5Row beat={5} icon="doc" tone="navy" ch="Article" len="800–1 500 mots" ton="Pédagogique" form="H1, H2, FAQ, mots-clés" cta="Lire, télécharger" />
      <M5Row beat={6} icon="slides" tone="violet" ch="Présentation" len="6–10 slides" ton="Factuel, orienté client" form="Titres-messages, 3 points max" cta="Prochaine étape datée" />
    </div>
    <Callout title="Astuce" tone="violet" icon="sparkles" cls={b.on(6)} style={{ position: 'absolute', left: 120, top: 850, width: 1680 }} size={23}>
      Collez cette grille dans la conversation : « Respecte ces codes pour chaque déclinaison. » Les résultats deviennent réguliers d’un canal à l’autre.
    </Callout>
  </Frame>
);

// ─── Adapter au public (persona) ────────────────────────────────────────────
const M5_PERS = {
  claire: { tone: 'teal' as Tone, who: 'Claire · office manager, PME', obj: 'Un café qui fait revenir l’équipe au bureau ?', hook: 'Rendre le bureau plus accueillant sans alourdir votre quotidien, c’est tout un défi', arg: 'installé en une semaine, entretien inclus, et vous ne gérez rien', proof: 'une PME du 7e a vu sa salle de pause redevenir le cœur du bureau', cta: 'Je réserve la dégustation pour mon équipe' },
  hugo: { tone: 'violet' as Tone, who: 'Hugo · fondateur de start-up', obj: 'Une culture d’équipe qui se sent dès le café', hook: 'Votre culture d’équipe est votre meilleur argument pour recruter', arg: 'des cafés traçables, achetés directement à nos producteurs, et un café du mois choisi par vos équipes', proof: 'nous publions le prix payé à chaque producteur', cta: 'Je veux faire goûter l’équipe' },
  nadia: { tone: 'pink' as Tone, who: 'Nadia · DRH d’ETI, 3 sites', obj: 'Café sur vos 3 sites : un seul interlocuteur', hook: 'Bâtir un plan QVCT cohérent sur plusieurs sites n’est jamais simple', arg: 'un contrat unique pour tous vos sites, un interlocuteur dédié et un bilan de satisfaction chaque trimestre', proof: 'des entreprises multi-sites de la région nous font déjà confiance', cta: 'Planifier un échange de 15 minutes' },
};
type M5P = keyof typeof M5_PERS;
const M5Var = ({ children, tone }: { children: ReactNode; tone: Tone }) => (
  <mark style={{ background: T[tone].bg, boxShadow: `inset 0 -3px 0 ${STRONG[tone]}`, color: 'inherit', padding: '0 4px', borderRadius: 4 }}>{children}</mark>
);
const M5PBtn = ({ id, cur, set }: { id: M5P; cur: M5P; set: (p: M5P) => void }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(id);
    }}
    style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', boxSizing: 'border-box', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '14px 18px', fontFamily: body, fontSize: 23, fontWeight: 600, color: C.ink, textAlign: 'left', background: cur === id ? T[M5_PERS[id].tone].bg : C.card, boxShadow: cur === id ? `inset 0 0 0 3px ${STRONG[M5_PERS[id].tone]}` : `inset 0 0 0 1.5px ${C.rule}` }}
  >
    <span style={{ width: 46, height: 46, borderRadius: 99, background: STRONG[M5_PERS[id].tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="user" size={26} color="#fff" />
    </span>
    {M5_PERS[id].who}
  </button>
);

const M5_Public: Page = () => {
  const [p, setP] = useState<M5P>('claire');
  const d = M5_PERS[p];
  return (
    <Frame mod={5} kind="simu">
      <Title>Adapter au public : même offre, trois emails</Title>
      <Lede>Choisissez le destinataire. Les passages surlignés sont ceux que l’IA a adaptés au persona.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 500, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <M5PBtn id="claire" cur={p} set={setP} />
        <M5PBtn id="hugo" cur={p} set={setP} />
        <M5PBtn id="nadia" cur={p} set={setP} />
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Ce qui ne change pas : l’offre, les faits, la charte, la signature.</div>
      </div>
      <div key={p} className={A.fade} style={{ position: 'absolute', left: 680, top: 270, width: 1120, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ padding: '16px 28px', background: C.panel, fontSize: 22, color: C.soft }}>
          <strong style={{ color: C.ink }}>Objet :</strong> <M5Var tone={d.tone}>{d.obj}</M5Var>
        </div>
        <div style={{ padding: '24px 30px', fontSize: 26, lineHeight: 1.6, color: C.ink }}>
          Bonjour,
          <br />
          <M5Var tone={d.tone}>{d.hook}</M5Var>. Avec Ardente Bureau, le café de spécialité torréfié à Lyon s’installe chez vous : <M5Var tone={d.tone}>{d.arg}</M5Var>.
          <br />
          Preuve à l’appui : <M5Var tone={d.tone}>{d.proof}</M5Var>.
          <div style={{ marginTop: 18 }}>
            <span style={{ display: 'inline-block', background: STRONG[d.tone], color: '#fff', fontWeight: 700, borderRadius: 10, padding: '8px 22px', fontSize: 23 }}>{d.cta}</span>
          </div>
        </div>
      </div>
      <PromptBox title="prompt · adaptation persona" size={19} cls={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(400) }}>
        Adapte cet email au persona <Cf>{'{persona}'}</Cf> : change l’objet, l’accroche, l’argument principal, la preuve et l’appel à l’action. <Cn>Ne modifie ni l’offre, ni les faits, ni les prix.</Cn>
      </PromptBox>
    </Frame>
  );
};

// ─── Selon l’étape du parcours ──────────────────────────────────────────────
const M5Stage = ({ beat, n, tone, icon, name, mind, msg, fmt }: { beat: number; n: number; tone: Tone; icon: IconName; name: string; mind: string; msg: string; fmt: string }) => (
  <div className={b.on(beat)} style={{ width: 390, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div>
        <Eyebrow c={T[tone].fg} size={16}>
          Étape {n}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{name}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, fontSize: 21, fontStyle: 'italic', lineHeight: 1.4, color: C.muted, minHeight: 60 }}>« {mind} »</div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.4, fontWeight: 600, color: C.ink, minHeight: 96 }}>{msg}</div>
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1.5px solid ${C.rule}`, fontSize: 20, color: C.soft }}>{fmt}</div>
  </div>
);

const M5_Parcours: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Adapter à l’étape du parcours client</Title>
    <Lede>La même personne n’a pas besoin du même message selon qu’elle découvre la marque ou qu’elle est déjà cliente.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M5Stage beat={1} n={1} tone="blue" icon="eye" name="Découverte" mind="Notre café du bureau est moyen, mais bon…" msg="Un problème partagé, sans parler de nous." fmt="Post LinkedIn, carrousel, article" />
      <M5Stage beat={2} n={2} tone="violet" icon="scale" name="Considération" mind="Quelles solutions existent ? Combien ça coûte ?" msg="Comparatif honnête, FAQ, coulisses." fmt="Guide, newsletter, page web" />
      <M5Stage beat={3} n={3} tone="green" icon="checkCircle" name="Décision" mind="Est-ce que ça marchera chez nous ?" msg="Preuve, essai gratuit, contact direct." fmt="Dégustation, email, présentation" />
      <M5Stage beat={4} n={4} tone="pink" icon="heart" name="Fidélisation" mind="On est contents… on peut en faire plus ?" msg="Café du mois, nouveautés, parrainage." fmt="Newsletter clients, enquête" />
    </div>
    <Callout title="Le prompt" tone="blue" icon="chat" cls={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }} size={23}>
      « Pour le persona Claire, propose un contenu par étape du parcours : objectif, message, format, canal, appel à l’action. Présente-le en tableau. »
    </Callout>
  </Frame>
);

// ─── Personnaliser à grande échelle (variables) ─────────────────────────────
const M5_CONTACTS = [
  { prenom: 'Claire', ent: 'Logikio', taille: 80, ville: 'Lyon 7e' },
  { prenom: 'Hugo', ent: 'Verdana Tech', taille: 25, ville: 'Villeurbanne' },
  { prenom: 'Nadia', ent: 'Méca-Rhône', taille: 400, ville: 'Vénissieux' },
];
const m5Arg = (t: number) => (t < 50 ? 'sans engagement, résiliable à tout moment' : t <= 200 ? 'installé en une semaine, entretien inclus' : 'un interlocuteur unique pour tous vos sites');
const M5V = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.12)', borderRadius: 6, padding: '0 6px' }}>{children}</span>
);

const M5_Variables: Page = () => {
  const [i, setI] = useState(0);
  const c = M5_CONTACTS[i];
  return (
    <Frame mod={5} kind="simu">
      <Title>À grande échelle : l’IA rédige, l’outil remplit</Title>
      <PromptBox title="modèle-email.txt · rédigé avec l’IA" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 820, ...dl(100) }}>
        Objet : <M5V>{'{{prénom}}'}</M5V>, un vrai café chez <M5V>{'{{entreprise}}'}</M5V> ?{'\n\n'}Bonjour <M5V>{'{{prénom}}'}</M5V>,{'\n'}les équipes de <M5V>{'{{entreprise}}'}</M5V> à <M5V>{'{{ville}}'}</M5V> méritent mieux que le café de la machine.{'\n'}Ardente Bureau : <M5V>{'{{argument_taille}}'}</M5V>.{'\n\n'}
        <Cc>{'{{argument_taille}} = règle : < 50 sal. · 50–200 · > 200'}</Cc>
      </PromptBox>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 570, width: 820, display: 'flex', gap: 12, ...dl(200) }}>
        <Btn ghost={i !== 0} tone="teal" icon="user" size={21} onClick={() => setI(0)}>
          Claire · 80 sal.
        </Btn>
        <Btn ghost={i !== 1} tone="violet" icon="user" size={21} onClick={() => setI(1)}>
          Hugo · 25 sal.
        </Btn>
        <Btn ghost={i !== 2} tone="pink" icon="user" size={21} onClick={() => setI(2)}>
          Nadia · 400 sal.
        </Btn>
      </div>
      <div key={i} className={A.right} style={{ position: 'absolute', left: 1000, top: 200, width: 800, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ padding: '14px 24px', background: C.panel, fontSize: 21, color: C.ink }}>
          <strong>Objet :</strong> {c.prenom}, un vrai café chez {c.ent} ?
        </div>
        <div style={{ padding: '22px 26px', fontSize: 25, lineHeight: 1.55, color: C.ink }}>
          Bonjour {c.prenom},
          <br />
          les équipes de {c.ent} à {c.ville} méritent mieux que le café de la machine.
          <br />
          Ardente Bureau : <strong style={{ color: C.green }}>{m5Arg(c.taille)}</strong>.
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 560, width: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="green" icon="gear" title="Qui fait quoi ?" cls={A.right} style={dl(300)} size={22}>
          L’IA écrit le modèle et les variantes ; le CRM ou l’outil d’emailing insère les données. Le fichier clients ne passe jamais par l’assistant IA.
        </Card>
        <Card tone="coral" icon="lock" title="RGPD" cls={A.right} style={dl(450)} size={22}>
          Base légale (consentement ou intérêt légitime en B2B), désinscription facile, pas de données sensibles.
        </Card>
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 680, width: 820, ...dl(500) }}>
        Cliquez un contact : seules les variables changent, le message reste maîtrisé.
      </Hint>
    </Frame>
  );
};

// ─── L’accordéon de longueur ────────────────────────────────────────────────
const M5_LEN = [
  { fmt: 'Extrait d’article', words: 72, tone: 'navy' as Tone, txt: 'La pause café n’est pas du temps perdu. C’est souvent devant la machine que l’équipe se retrouve, qu’une idée se débloque, qu’un nouveau venu se sent accueilli. Encore faut-il que le café donne envie de s’y arrêter. Avec Ardente Bureau, nous installons dans votre entreprise un café de spécialité torréfié à Lyon, en une semaine et sans engagement. Et en novembre, nous venons le faire déguster à votre équipe.' },
  { fmt: 'Post LinkedIn', words: 39, tone: 'blue' as Tone, txt: 'La pause café, c’est souvent là que l’équipe se retrouve. Encore faut-il que le café suive. Ardente Bureau installe un café de spécialité torréfié à Lyon dans vos locaux, sans engagement. Dégustation offerte en novembre.' },
  { fmt: 'Légende Instagram', words: 18, tone: 'pink' as Tone, txt: 'Le café qui fait revenir l’équipe au bureau ☕ Dégustation offerte en novembre, lien en bio.' },
  { fmt: 'Notification / SMS', words: 11, tone: 'teal' as Tone, txt: 'Ardente Bureau : dégustation offerte pour votre équipe jusqu’au 30/11.' },
  { fmt: 'Objet d’email', words: 5, tone: 'green' as Tone, txt: 'La pause qui compte arrive.' },
];

const M5_Longueur: Page = () => {
  const [v, setV] = useState(0);
  const l = M5_LEN[v];
  return (
    <Frame mod={5} kind="simu">
      <Title>Ajuster la longueur sans perdre le message</Title>
      <Lede>Faites glisser : l’IA résume excellemment, à condition de lui dire ce qui doit absolument rester.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, ...dl(100) }}>
        <Range value={v} onChange={setV} min={0} max={4} step={1} w={1680} tone={l.tone} />
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 20, color: C.muted }}>
          <span>Article</span>
          <span>Post</span>
          <span>Instagram</span>
          <span>SMS</span>
          <span>Objet</span>
        </div>
      </div>
      <div key={v} className={A.in} style={{ position: 'absolute', left: 120, top: 400, width: 1680, height: 340, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[l.tone]}`, padding: '28px 40px', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag tone={l.tone} size={22}>
            {l.fmt}
          </Tag>
          <span style={{ fontFamily: mono, fontSize: 22, color: C.muted }}>{l.words} mots</span>
          <div style={{ flex: 1, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${(l.words / 72) * 100}%`, height: '100%', background: STRONG[l.tone], transition: `width 400ms ${EASE}` }} />
          </div>
        </div>
        <div style={{ marginTop: 22, fontSize: v === 0 ? 27 : v === 4 ? 56 : 34, lineHeight: 1.45, fontWeight: v === 4 ? 800 : 500, fontFamily: v === 4 ? display : body, color: C.ink }}>{l.txt}</div>
      </div>
      <Callout title="Le prompt" tone="blue" icon="chat" cls={A.fade} style={{ position: 'absolute', left: 120, top: 780, width: 1680, ...dl(400) }} size={23}>
        « Réduis à {'{N}'} mots. Garde obligatoirement : le nom de l’offre, le bénéfice principal et la date limite. Supprime tout le reste. »
      </Callout>
    </Frame>
  );
};

// ─── Le prompt maître de déclinaison ────────────────────────────────────────
const M5_Maitre: Page = () => (
  <Frame mod={5}>
    <Title>Le prompt maître : toute la déclinaison en une fois</Title>
    <Lede>À enregistrer dans votre bibliothèque. Il réunit tout ce qu’on a vu depuis ce matin.</Lede>
    <PromptBox title="prompt-maitre-multicanal.txt" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1100, ...dl(100) }}>
      <Cc># Contexte</Cc>
      {'\n'}Tu es responsable de contenu chez Ardente. Voici notre charte de ton : [charte]. Voici la grille des codes par canal : [grille].
      {'\n\n'}
      <Cc># Matière</Cc>
      {'\n'}Message pivot : [message]. Faits autorisés : [offre, prix, dates]. Preuves : [témoignages validés].
      {'\n\n'}
      <Cc># Tâche</Cc>
      {'\n'}Décline ce message pour : <Cf>LinkedIn, Instagram, newsletter, email direct, article (plan + intro), 3 slides</Cf>.
      {'\n'}Cible : [persona]. Étape du parcours : [étape].
      {'\n\n'}
      <Cc># Contraintes</Cc>
      {'\n'}N’invente aucun fait, chiffre ou citation. Signale toute information manquante.
      {'\n'}Présente le résultat en <Cn>tableau</Cn> : canal · texte · visuel suggéré · appel à l’action.
    </PromptBox>
    <div style={{ position: 'absolute', left: 1280, top: 270, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="layers" title="Quatre blocs" cls={A.right} style={dl(250)} size={22}>
        Contexte, matière, tâche, contraintes : on ne remplit que les crochets.
      </Card>
      <Card tone="green" icon="shieldCheck" title="Des faits « autorisés »" cls={A.right} style={dl(400)} size={22}>
        L’IA ne peut utiliser que ce que vous avez listé : fini les chiffres inventés.
      </Card>
      <Card tone="violet" icon="table" title="Un tableau en sortie" cls={A.right} style={dl(550)} size={22}>
        Facile à relire, à faire valider, et à copier dans votre outil de planification.
      </Card>
    </div>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>
      <span style={{ color: C.violet }}>Quiz</span> · quel canal, quel format ?
    </Title>
    <QuizSeries y={220}>
      <QuizQ q="Vous écrivez à une DRH que vous n’avez jamais rencontrée. Quel format ?" explain="Email direct : court, contextualisé, sans image, une seule question fermée. La newsletter s’adresse à des abonnés.">
        <QOpt>Une newsletter illustrée de 300 mots</QOpt>
        <QOpt ok>Un email court, personnalisé, avec une question fermée</QOpt>
        <QOpt>Un carrousel Instagram</QOpt>
      </QuizQ>
      <QuizQ q="Sur Instagram, qu’est-ce qui porte le message en premier ?" explain="Le visuel. La légende complète, engage par une question et des hashtags de niche.">
        <QOpt>La légende</QOpt>
        <QOpt>Les hashtags</QOpt>
        <QOpt ok>Le visuel</QOpt>
      </QuizQ>
      <QuizQ q="Un prospect découvre tout juste la marque. Quel message ?" explain="En découverte, on parle de son problème, pas de notre offre. L’essai gratuit vient à l’étape décision.">
        <QOpt ok>Un contenu utile sur son problème, sans parler de nous</QOpt>
        <QOpt>Le tarif détaillé et le bon de commande</QOpt>
        <QOpt>Une remise de 50 % immédiate</QOpt>
      </QuizQ>
      <QuizQ q="Pour personnaliser 2 000 emails, que donnez-vous à l’assistant IA ?" explain="L’IA rédige le modèle avec des variables ; c’est l’outil d’emailing ou le CRM qui insère les données. Le fichier clients reste dans les outils validés.">
        <QOpt>Le fichier clients complet</QOpt>
        <QOpt ok>Rien de personnel : il rédige un modèle avec des variables</QOpt>
        <QOpt>Les prénoms et emails seulement</QOpt>
      </QuizQ>
      <QuizQ q="Vous réduisez un article à un objet d’email. Que doit-on préciser à l’IA ?" explain="Ce qui doit absolument rester : sinon elle garde parfois le détail et perd le bénéfice ou la date limite.">
        <QOpt>Rien, elle sait résumer</QOpt>
        <QOpt>Le nombre exact de caractères seulement</QOpt>
        <QOpt ok>Les éléments à garder obligatoirement</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M5_Atelier: Page = () => (
  <LabPage
    mod={5}
    n="4"
    title="Produire une campagne multicanale"
    defi="multicanal"
    who="En binôme · votre campagne"
    minutes={25}
    objective={
      <>
        À partir de votre concept et de votre message pivot, produire la <strong>déclinaison complète</strong> sur six canaux, puis adapter l’email à <strong>deux personas</strong>.
      </>
    }
    where={<>Le tableau de déclinaison : LinkedIn · Instagram · newsletter · email · article (plan + intro) · 3 slides · 2 versions de l’email pour 2 personas</>}
    crit={
      <>
        <CheckItem id="a4c1" size={22}>Le message pivot est reconnaissable partout</CheckItem>
        <CheckItem id="a4c2" size={22}>Les codes de chaque canal sont respectés</CheckItem>
        <CheckItem id="a4c3" size={22}>Aucun fait inventé (faits autorisés seulement)</CheckItem>
        <CheckItem id="a4c4" size={22}>Les deux emails diffèrent vraiment</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Remplissez les crochets du prompt maître. <strong>2.</strong> Lancez-le, puis critiquez canal par canal avec la grille des codes. <strong>3.</strong> Adaptez l’email à deux personas sans toucher aux faits.{' '}
    <strong>4.</strong> Passez la grille de relecture sur les deux contenus les plus visibles.
    <Bonus>Ajoutez une version anglaise de la newsletter et vérifiez-la avec un collègue : la traduction littérale ne suffit pas.</Bonus>
  </LabPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Ce qu’on retient du module 5</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="violet" d={100}>
        Un <strong>message pivot</strong>, puis une forme adaptée à chaque canal.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        La <strong>grille des codes par canal</strong> dans le prompt rend les déclinaisons régulières.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        On adapte au <strong>persona</strong> et à l’<strong>étape du parcours</strong>, jamais les faits.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        À grande échelle : <strong>l’IA écrit le modèle</strong>, l’outil insère les données.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Pour raccourcir, dites <strong>ce qui doit rester</strong>.
      </SynthRow>
    </div>
    <ProjectCard mod={5}>
      Votre campagne est déclinée sur six canaux, avec un email adapté à deux personas. Il reste à prévoir comment mesurer… et à analyser.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M5_Section, M5_Canaux, M5_Codes, M5_Public, M5_Parcours, M5_Variables, M5_Longueur, M5_Maitre, M5_Quiz, M5_Atelier, M5_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M5 · 14:20

OBJECTIF — Annoncer le module : adapter un même contenu à plusieurs canaux et publics.

DIRE — « Module 5 : la personnalisation. Le programme dit : “à partir d’un même contenu”, LinkedIn, Instagram, newsletter, email, article, présentation commerciale. C’est là que l’IA fait gagner le plus de temps. Mais aussi : adapter à chaque public, à chaque étape du parcours, et personnaliser à grande échelle sans prendre de risque avec les données. »

TRANSITION — « Prenons un seul message et regardons-le sur six canaux. »`,
  `⏱ 6 min · UN MESSAGE, SIX CANAUX (onglets)

OBJECTIF — Montrer concrètement la même idée déclinée, et ce qui change d’un canal à l’autre.

DIRE — « En haut, le message pivot : il ne change jamais. » Cliquer chaque onglet. LinkedIn : « accroche en question, angle professionnel. » Instagram : « le visuel porte le message, interaction par sondage ou tag. » Newsletter : « des abonnés, un ton complice, un bouton. » Email direct : « une personne précise, 80 mots, une question fermée. » Article : « utile avant d’être commercial. » Présentation : « un titre-message, des faits. »

INSISTER — La colonne de droite indique aussi le KPI : on ne mesure pas la même chose partout. C’est le lien avec le module 6.

TRANSITION — « Ces codes, on peut les résumer dans une grille. »`,
  `⏱ 3 min · GRILLE DES CODES (6 clics)

OBJECTIF — Donner un outil réutilisable : la grille des codes par canal.

DIRE — → révéler canal par canal en lisant longueur, ton, forme, appel à l’action. « Ces chiffres sont des repères, pas des règles absolues : adaptez-les à votre audience et à vos statistiques. »

INSISTER — L’astuce : coller la grille dans la conversation. L’IA respecte remarquablement bien un cadre explicite.

TRANSITION — « Adapter au canal, c’est la forme. Adapter au public, c’est le fond. »`,
  `⏱ 4 min · ADAPTER AU PUBLIC (interactif)

OBJECTIF — Montrer une personnalisation par persona qui ne touche pas aux faits.

DIRE — « Le même email pour nos trois personas. » Cliquer Claire : « sans gestion, entretien inclus. » Hugo : « culture d’équipe, traçabilité. » Nadia : « multi-sites, interlocuteur unique, bilan trimestriel. » « Les passages surlignés sont ceux que l’IA a adaptés. Le reste, l’offre, les faits, la signature, ne bouge pas. »

INSISTER — Le prompt du bas : on dit explicitement ce qu’on ne doit pas modifier.

ANIMATION — Demander : « Lequel de ces emails vous convaincrait, vous ? » Les réponses varient selon les profils : c’est la démonstration.

TRANSITION — « Autre dimension : le moment du parcours. »`,
  `⏱ 3 min · PARCOURS CLIENT (4 clics)

OBJECTIF — Adapter le message à l’étape du parcours.

DIRE — → « Découverte : on parle du problème, pas de nous. » → « Considération : on aide à comparer, honnêtement. » → « Décision : la preuve, l’essai, le contact direct. » → « Fidélisation : on entretient la relation. » « L’erreur classique : envoyer l’offre commerciale à quelqu’un qui découvre la marque. »

INSISTER — Le prompt demande un tableau par étape : c’est un excellent complément au calendrier de ce matin.

TRANSITION — « Et quand on a 2 000 contacts ? »`,
  `⏱ 4 min · VARIABLES (interactif)

OBJECTIF — Montrer la personnalisation à grande échelle et la répartition des rôles IA / outil.

DIRE — « L’IA rédige un modèle avec des variables : prénom, entreprise, ville, et un argument qui dépend de la taille de l’entreprise. » Cliquer les trois contacts : « Seules les variables changent. » « Qui fait quoi ? L’IA écrit le modèle et ses variantes. Le CRM ou l’outil d’emailing insère les données. Le fichier clients ne passe jamais par l’assistant. »

INSISTER — RGPD : en B2B, la prospection par email est possible sur la base de l’intérêt légitime si le message est en lien avec la fonction de la personne, avec une désinscription simple. Vérifiez avec votre DPO.

TRANSITION — « Dernier levier d’adaptation : la longueur. »`,
  `⏱ 3 min · ACCORDÉON DE LONGUEUR (interactif)

OBJECTIF — Montrer la réduction maîtrisée d’un texte.

DIRE — Faire glisser de gauche à droite. « 72 mots, 39, 18, 11, 5. À chaque étape, on garde trois choses : le nom de l’offre, le bénéfice, la date limite. » « Si on ne le précise pas, l’IA garde parfois un détail joli et perd la date limite. »

TRANSITION — « On assemble tout ça dans un seul prompt. »`,
  `⏱ 3 min · PROMPT MAÎTRE

OBJECTIF — Donner le prompt réutilisable de déclinaison multicanale.

DIRE — « Quatre blocs. Contexte : charte et grille des codes. Matière : le message, les faits autorisés, les preuves. Tâche : les six canaux, la cible, l’étape. Contraintes : n’invente rien, signale ce qui manque, présente en tableau. » « La notion la plus importante : les faits autorisés. L’IA ne peut utiliser que ce que vous avez listé. »

ANIMATION — Demander à chacun de copier ce prompt dans sa bibliothèque maintenant : il sert dans l’atelier qui suit.

TRANSITION — « Vérifions les réflexes avant l’atelier. »`,
  `⏱ 4 min · QUIZ (5 questions)

OBJECTIF — Ancrer les choix de canal, de format et de personnalisation.

DIRE — « Cinq situations, vote à main levée, puis on clique. » Insister sur la question 4 : jamais de fichier clients dans l’assistant.

TRANSITION — « À vous : atelier 4. »`,
  `⏱ 25 min · ATELIER 4 — CAMPAGNE MULTICANALE (minuteur)

OBJECTIF — Produire la déclinaison complète de sa campagne sur six canaux et deux personas.

DIRE — « Vingt-cinq minutes. Remplissez les crochets du prompt maître avec votre concept et votre message pivot. Lancez-le, puis critiquez canal par canal avec la grille. Adaptez l’email à deux personas. Et passez la grille de relecture sur les deux contenus les plus visibles. »

ANIMATION — Lancer le minuteur. Vérifier que les « faits autorisés » sont bien listés. Bonus : version anglaise relue par un humain.

TRANSITION — « Je résume, puis pause. »`,
  `⏱ 1 min · SYNTHÈSE M5

OBJECTIF — Clore le module.

DIRE — « Cinq idées. » Les lire. « Votre campagne est prête à être diffusée. Reste une question : comment savoir si elle a marché ? Pause de 15 minutes, et au retour : l’analyse. »

TRANSITION — Pause.`,
];
// @@NOTES-END
