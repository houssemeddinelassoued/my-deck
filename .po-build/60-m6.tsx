// ─── Module 6 · Atelier & TP user story ─────────────────────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title="Du besoin brut à la user story IA"
    sub="Atelier de reformulation, puis TP : rédiger une user story IA complète, avec ses critères d’acceptation, relue par vos pairs."
    dur="60 min"
    kind="atelier"
    labs={
      <>
        <Tag tone="yellow" size={20}>
          Atelier 2 · reformuler
        </Tag>
        <Tag tone="green" size={20}>
          TP · rédiger la story
        </Tag>
        <Tag tone="violet" size={20}>
          Relecture par les pairs
        </Tag>
      </>
    }
  >
    <SecItem n={1}>La méthode en cinq étapes, et un exemple guidé</SecItem>
    <SecItem n={2}>Atelier : reformuler un besoin produit brut</SecItem>
    <SecItem n={3}>TP : rédiger la story complète avec le canevas</SecItem>
    <SecItem n={4}>Relecture croisée avec la grille, puis corrigé</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── La méthode en cinq étapes ──────────────────────────────────────────────
const M6Step = ({ n, tone, icon, title, out, q }: { n: number; tone: Tone; icon: IconName; title: string; out: string; q: string }) => (
  <div className={n === 1 ? A.in : b.on(n - 1)} style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: (5 - n) * 46 }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Num n={n} tone={tone} size={44} />
        <IconTile name={icon} tone={tone} size={44} />
      </div>
      <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 25, lineHeight: 1.15, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.38, fontStyle: 'italic', color: C.soft }}>« {q} »</div>
      <div style={{ marginTop: 'auto', paddingTop: 12, fontSize: 19, fontWeight: 700, color: T[tone].fg }}>→ {out}</div>
    </div>
  </div>
);

const M6_Method: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>La méthode : cinq étapes du besoin brut à la story</Title>
    <Lede>Chaque étape produit quelque chose. Si une étape conclut « pas d’IA », c’est une bonne nouvelle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 600, display: 'flex', alignItems: 'stretch', gap: 18 }}>
      <M6Step n={1} tone="grey" icon="chat" title="Écouter le besoin brut" q="Qu’est-ce qui vous fait perdre du temps ?" out="un verbatim" />
      <M6Step n={2} tone="blue" icon="search" title="Reformuler le problème" q="Qui, quoi, combien, pourquoi ?" out="un problème mesuré" />
      <M6Step n={3} tone="violet" icon="brain" title="Tester l’hypothèse IA" q="Une règle suffit-elle ?" out="IA, ou pas d’IA" />
      <M6Step n={4} tone="yellow" icon="humanCheck" title="Placer l’humain" q="Que fait-on quand elle doute ?" out="niveau et règle de doute" />
      <M6Step n={5} tone="green" icon="note" title="Écrire la story" q="Qu’est-ce qu’« assez bien » ?" out="les 8 blocs du canevas" />
    </div>
  </Frame>
);

// ─── Exemple guidé ──────────────────────────────────────────────────────────
const M6Ex = ({ n, tone, label, children, cls }: { n: number; tone: Tone; label: string; children: ReactNode; cls: string }) => (
  <div className={cls} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18, alignItems: 'stretch' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T[tone].bg, borderRadius: 14, padding: '12px 16px' }}>
      <Num n={n} tone={tone} size={38} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 21, color: T[tone].fg, lineHeight: 1.2 }}>{label}</span>
    </div>
    <div style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', fontSize: 22, lineHeight: 1.4, color: C.ink, display: 'flex', alignItems: 'center' }}>
      <div>{children}</div>
    </div>
  </div>
);

const M6_Example: Page = () => (
  <Frame mod={6} kind="cas" beats={4}>
    <Title>Exemple guidé : le manager du vendredi soir</Title>
    <div style={{ position: 'absolute', left: 120, top: 196, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M6Ex n={1} tone="grey" label="Besoin brut" cls={A.in}>
        <em>« Je passe mes vendredis soir à valider des notes de frais. À la fin, je ne regarde plus rien. »</em>
      </M6Ex>
      <M6Ex n={2} tone="blue" label="Problème" cls={b.on(1)}>
        12 managers interrogés : <strong>35 min par semaine</strong>, validation en bloc ; <strong>0,8 % de notes non conformes</strong> validées
        quand même. Cause : toutes les notes se ressemblent à l’écran.
      </M6Ex>
      <M6Ex n={3} tone="violet" label="Hypothèse IA" cls={b.on(2)}>
        Règles de politique (plafonds) <strong>+ un modèle</strong> qui repère les notes inhabituelles pour ce salarié. Les règles seules
        ne voient pas l’inhabituel.
      </M6Ex>
      <M6Ex n={4} tone="yellow" label="Humain et doute" cls={b.on(3)}>
        Niveau 1, suggestion : le manager décide toujours. Les notes « à examiner » sont en tête, <strong>avec leur raison</strong>. Si le
        modèle est indisponible : affichage habituel.
      </M6Ex>
      <M6Ex n={5} tone="green" label="Story" cls={b.on(4)}>
        <strong>En tant que</strong> manager, <strong>je veux</strong> que les notes à examiner soient signalées avec leur raison et les autres regroupées,{' '}
        <strong>afin de</strong> consacrer mon temps de validation aux seules notes à risque.
        <div style={{ marginTop: 6, fontSize: 20, color: T.green.fg, fontWeight: 600 }}>
          Succès : temps de validation −50 % et notes non conformes validées −50 %, en trois mois.
        </div>
      </M6Ex>
    </div>
  </Frame>
);

// ─── Les trois besoins bruts ────────────────────────────────────────────────
const M6Need = ({ who, icon, tone, quote, hint, n, d }: { who: string; icon: IconName; tone: Tone; quote: string; hint: string; n: number; d: number }) => (
  <div className={A.in} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={58} solid />
      <div>
        <Eyebrow c={T[tone].fg} size={17}>
          Groupe {String.fromCharCode(64 + n)}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{who}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, fontSize: 26, lineHeight: 1.42, fontStyle: 'italic', color: C.ink }}>« {quote} »</div>
    <div className={b.on(n)} style={{ marginTop: 'auto', paddingTop: 16 }}>
      <div style={{ background: T[tone].bg, borderRadius: 12, padding: '12px 16px', fontSize: 20, lineHeight: 1.38, color: C.ink }}>
        <strong style={{ color: T[tone].fg }}>Piste · </strong>
        {hint}
      </div>
    </div>
  </div>
);

const M6_Needs: Page = () => (
  <Frame mod={6} kind="atelier" beats={3}>
    <Title>Trois besoins bruts remontés aux équipes de Spendo</Title>
    <Lede>Un besoin par groupe. Ou, si vous préférez, un besoin réel de votre propre produit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 560, display: 'flex', gap: 24 }}>
      <M6Need
        n={1}
        d={100}
        who="Une comptable"
        icon="euro"
        tone="coral"
        quote="Je passe des heures à relancer les salariés pour des justificatifs manquants ou illisibles."
        hint="Détecter à la saisie le justificatif illisible ou incomplet. Une règle suffit pour « manquant », pas pour « illisible »."
      />
      <M6Need
        n={2}
        d={220}
        who="Un DAF"
        icon="chart"
        tone="green"
        quote="Je ne sais jamais combien on va dépenser en déplacements avant la fin du trimestre."
        hint="Prévision par service. Peu d’utilisateurs : la valeur se joue sur la décision budgétaire, pas sur le volume."
      />
      <M6Need
        n={3}
        d={340}
        who="Un salarié à l’étranger"
        icon="globe"
        tone="violet"
        quote="À l’étranger, je ne sais ni ce que je peux dépenser, ni dans quelle devise déclarer."
        hint="Plafonds du pays affichés (règle) + assistant sur la politique du client (RAG). La conversion de devise n’a pas besoin d’IA."
      />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 856, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="lock" size={24} color={C.coral} /> Votre propre produit ? Aucune donnée réelle de client ou de salarié dans vos notes.
    </div>
  </Frame>
);

// ─── Atelier 2 : reformuler ─────────────────────────────────────────────────
const M6_Atelier: Page = () => (
  <LabPage
    mod={6}
    n="2"
    tag="Atelier"
    kind="atelier"
    title="Reformuler un besoin en user story IA"
    defi="reformuler"
    who="Groupes de 3"
    minutes={12}
    objective={
      <>
        Appliquer les cinq étapes à votre besoin brut, jusqu’à <strong>une story en une phrase et son indicateur de succès</strong>, ou jusqu’à
        un « pas d’IA » argumenté.
      </>
    }
    where={
      <>
        Le problème : qui, quoi, combien, pourquoi
        <br />
        L’hypothèse IA, ou le « pas d’IA »
        <br />
        La story et son indicateur de succès
      </>
    }
    crit={
      <>
        <CheckItem id="at2-1" size={21}>Le problème est chiffré, même grossièrement</CheckItem>
        <CheckItem id="at2-2" size={21}>Une alternative sans IA a été envisagée</CheckItem>
        <CheckItem id="at2-3" size={21}>Le niveau d’automatisation est choisi</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet tone="blue" size={23}>
        <strong>4 min ·</strong> étapes 1 et 2 : écrivez le problème, avec des hypothèses chiffrées
      </Bullet>
      <Bullet tone="violet" size={23}>
        <strong>4 min ·</strong> étapes 3 et 4 : signaux, anti-signaux, niveau d’automatisation
      </Bullet>
      <Bullet tone="green" size={23}>
        <strong>4 min ·</strong> étape 5 : la story en une phrase, l’indicateur de succès
      </Bullet>
    </div>
    <TpBonus>préparez une phrase pour défendre votre choix devant un directeur qui veut « de l’IA partout ».</TpBonus>
  </LabPage>
);

// ─── TP : rédiger la story complète ─────────────────────────────────────────
const M6_Tp: Page = () => (
  <LabPage
    mod={6}
    n="final"
    title="Rédiger une user story IA complète"
    defi="rediger"
    who="Individuel, puis binôme"
    minutes={20}
    objective={
      <>
        À partir de votre story de l’atelier (ou de B4, l’assistant voyage), rédigez <strong>la story complète en huit blocs</strong>, avec
        des critères d’acceptation testables.
      </>
    }
    where={
      <>
        Les 8 blocs du canevas, renseignés
        <br />
        Au moins 6 critères, dont 2 statistiques
        <br />
        Au moins 1 scénario de doute ou de panne
      </>
    }
    crit={
      <>
        <CheckItem id="tp-1" size={21}>Chaque critère statistique nomme son jeu de test</CheckItem>
        <CheckItem id="tp-2" size={21}>Le comportement quand l’IA doute est décrit</CheckItem>
        <CheckItem id="tp-3" size={21}>Aucun choix technique dans les critères</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet tone="blue" size={23}>
        <strong>15 min ·</strong> rédaction individuelle, avec le canevas de la page suivante
      </Bullet>
      <Bullet tone="green" size={23}>
        <strong>5 min ·</strong> échange avec votre binôme : lisez la story de l’autre à voix haute
      </Bullet>
      <Bullet tone="coral" size={23}>
        Coincé ? Reprenez les six familles de critères du module 5, une par une.
      </Bullet>
    </div>
    <TpBonus>ajoutez le découpage en trois tranches, en commençant par un spike.</TpBonus>
  </LabPage>
);

// ─── Le canevas à remplir ───────────────────────────────────────────────────
const Blank = ({ children }: { children: ReactNode }) => (
  <span style={{ display: 'inline-block', padding: '0 8px', margin: '0 2px', borderRadius: 6, background: T.violet.bg, color: T.violet.fg, fontWeight: 600, boxShadow: `inset 0 -2px 0 ${T.violet.bd}` }}>
    {children}
  </span>
);

const M6Block = ({ i, children, d }: { i: number; children: ReactNode; d: number }) => {
  const c = CANVAS[i];
  return (
    <div className={A.in} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px', borderLeft: `6px solid ${STRONG[c.tone]}`, ...dl(d) }}>
      <Num n={i + 1} tone={c.tone} size={34} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 20, color: C.navy }}>{c.t}</div>
        <div style={{ marginTop: 2, fontSize: 19, lineHeight: 1.5, color: C.ink }}>{children}</div>
      </div>
    </div>
  );
};

const M6_Template: Page = () => (
  <Frame mod={6} kind="lab">
    <Title>Le canevas du TP : complétez chaque champ</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <M6Block i={0} d={80}>
        En tant que <Blank>qui</Blank>, je veux <Blank>quoi</Blank> afin de <Blank>valeur</Blank>. Succès : <Blank>indicateur</Blank> en <Blank>délai</Blank>.
      </M6Block>
      <M6Block i={1} d={140}>
        L’IA <Blank>propose / pré-remplit / décide</Blank> <Blank>quoi</Blank>. Niveau d’automatisation : <Blank>1 à 4</Blank>.
      </M6Block>
      <M6Block i={2} d={200}>
        Entrées : <Blank>données</Blank>. Données personnelles : <Blank>lesquelles, masquées ?</Blank> Droit d’usage validé par <Blank>qui</Blank>.
      </M6Block>
      <M6Block i={3} d={260}>
        Sur <Blank>jeu de test, taille</Blank> : <Blank>métrique</Blank> ≥ <Blank>seuil</Blank>. Aucun sous-groupe sous <Blank>seuil</Blank>.
      </M6Block>
      <M6Block i={4} d={320}>
        Si confiance &lt; <Blank>seuil</Blank> : <Blank>comportement</Blank>. Si panne : <Blank>repli</Blank>.
      </M6Block>
      <M6Block i={5} d={380}>
        L’utilisateur sait que <Blank>c’est l’IA</Blank>, voit <Blank>le doute</Blank>, corrige en <Blank>combien de gestes</Blank>.
      </M6Block>
      <M6Block i={6} d={440}>
        Biais vérifiés sur <Blank>sous-groupes</Blank>. Sécurité : <Blank>injection, cloisonnement</Blank>. AI Act : <Blank>niveau</Blank>.
      </M6Block>
      <M6Block i={7} d={500}>
        Indicateurs : <Blank>qualité, adoption, valeur, coût</Blank>. Alerte si <Blank>seuil</Blank>. Ré-entraînement : <Blank>quand</Blank>.
      </M6Block>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(900) }}>
      <Icon name="doc" size={24} color={C.violet} /> Copiez ce canevas dans votre outil habituel : Jira, Azure DevOps, Notion… Il tient sur une page.
    </div>
  </Frame>
);

// ─── Relecture par les pairs ────────────────────────────────────────────────
const M6_Peer: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Relecture croisée : la grille sur 20 points</Title>
    <Lede>Échangez vos stories avec un autre binôme. Cochez ce qui est présent et testable, pas ce qui est « à peu près là ».</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CheckItem id="pr1" w={3} size={23}>Problème et indicateur de succès mesurables · 3 pts</CheckItem>
        <CheckItem id="pr2" w={2} size={23}>Comportement IA et niveau d’automatisation explicites · 2 pts</CheckItem>
        <CheckItem id="pr3" w={2} size={23}>Données et droit d’usage identifiés · 2 pts</CheckItem>
        <CheckItem id="pr4" w={3} size={23}>Au moins 2 critères statistiques : métrique, seuil, jeu de test · 3 pts</CheckItem>
        <CheckItem id="pr5" w={3} size={23}>Le doute et la panne sont décrits · 3 pts</CheckItem>
        <CheckItem id="pr6" w={2} size={23}>L’UX dit que c’est l’IA et permet de corriger · 2 pts</CheckItem>
        <CheckItem id="pr7" w={3} size={23}>Garde-fous : biais, données personnelles, sécurité · 3 pts</CheckItem>
        <CheckItem id="pr8" w={2} size={23}>La mesure en production est prévue · 2 pts</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1170, top: 262, width: 630, ...dl(300) }}>
        <CheckScore
          max={20}
          label="Note de la story"
          levels={[
            { min: 0, text: 'À retravailler avant le refinement.', tone: 'coral' },
            { min: 10, text: 'Solide : complétez les blocs manquants.', tone: 'yellow' },
            { min: 16, text: 'Prête pour le refinement avec l’équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20 }}>
          <Timer id="peer" minutes={8} label="Relecture" compact />
        </div>

      </div>
    </Checklist>
  </Frame>
);

// ─── Corrigé : la story complète de B4 ──────────────────────────────────────
const M6Line = ({ i, children }: { i: number; children: ReactNode }) => {
  const c = CANVAS[i];
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ flex: 'none', marginTop: 4, width: 26, height: 26, borderRadius: 7, background: STRONG[c.tone], color: c.tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {i + 1}
      </span>
      <div style={{ fontSize: 21, lineHeight: 1.42, color: C.ink }}>
        <strong style={{ color: T[c.tone].fg }}>{c.t} · </strong>
        {children}
      </div>
    </div>
  );
};

const M6_Correction: Page = () => (
  <Frame mod={6} kind="synthese" beats={1}>
    <Title>Un corrigé : SPEN-412 réécrite en huit blocs</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40, rowGap: 20 }}>
      <M6Line i={0}>
        En tant que salarié, je veux savoir si une dépense est remboursable selon la politique de mon entreprise, afin de ne plus attendre le support.
        Succès : tickets « remboursable ? » divisés par deux en trois mois.
      </M6Line>
      <M6Line i={1}>Niveau 1 : l’assistant répond et cite sa source ; il ne valide ni ne refuse aucune note.</M6Line>
      <M6Line i={2}>Politique voyages du seul client de l’utilisateur ; cloisonnement par entreprise ; aucun nom transmis au modèle.</M6Line>
      <M6Line i={3}>Sur 100 questions de test par politique : ≥ 90 % justes et sourcées ; 20 questions hors périmètre : 0 invention.</M6Line>
      <M6Line i={4}>Pas de passage pertinent trouvé : « je ne sais pas » et lien vers le support. Service indisponible : FAQ statique.</M6Line>
      <M6Line i={5}>Mention « assistant IA » visible ; source cliquable ; bouton « réponse utile ? » sous chaque réponse.</M6Line>
      <M6Line i={6}>Test d’injection sur 30 messages piégés : 0 fuite d’une autre entreprise ; AI Act : risque limité, transparence assurée.</M6Line>
      <M6Line i={7}>Taux de réponses utiles, tickets support, coût mensuel ; alerte si « utile » &lt; 80 % sur une semaine.</M6Line>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 660, width: 1680, display: 'flex', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <Callout title="Ce qui a changé" tone="green" icon="check" size={22}>
          Un problème chiffré, un périmètre borné, des critères mesurables, un comportement de doute. Aucune ligne sur « GPT ».
        </Callout>
      </div>
      <div style={{ flex: 1 }}>
        <Callout title="Comparez avec la vôtre" tone="violet" icon="search" size={22}>
          Quel bloc était le plus difficile à écrire ? C’est probablement celui à travailler avec votre équipe.
        </Callout>
      </div>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_Method, M6_Example, M6_Needs, M6_Atelier, M6_Tp, M6_Template, M6_Peer, M6_Correction];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · MODULE 6 · 15:40

OBJECTIF — Annoncer la mise en pratique finale : reformuler, puis rédiger.

DIRE — « Dernier module, et c’est vous qui travaillez. D’abord une méthode et un exemple, puis un atelier de reformulation en groupe, puis le TP : chacun rédige une user story IA complète, relue par un autre binôme avec une grille. C’est le livrable de la journée. »

TRANSITION — « La méthode, en cinq étapes. »`,
  `⏱ 4 min · LA MÉTHODE EN CINQ ÉTAPES

OBJECTIF — Donner une démarche reproductible du besoin brut à la story.

DIRE — « Étape 1 : écouter le besoin brut, avec ses mots. On en tire un verbatim. »

→ beat 1 : « Étape 2 : reformuler le problème. Qui, quoi, combien, pourquoi. On en tire un problème mesuré. »
→ beat 2 : « Étape 3 : tester l’hypothèse IA. Les signaux, les anti-signaux, et la question qui tue : une règle suffit-elle ? »
→ beat 3 : « Étape 4 : placer l’humain. Le niveau d’automatisation, la règle de doute. »
→ beat 4 : « Étape 5 : écrire la story, avec les huit blocs du canevas. »

INSIST — « Si une étape conclut “pas d’IA”, c’est une bonne nouvelle : vous venez d’économiser des mois. »

TRANSITION — « Déroulons la méthode sur un exemple. »`,
  `⏱ 5 min · EXEMPLE GUIDÉ

OBJECTIF — Montrer la méthode appliquée de bout en bout.

DIRE — « Le besoin brut d’un manager : “Je passe mes vendredis soir à valider des notes de frais. À la fin, je ne regarde plus rien.” »

→ beat 1 : le problème. « On a interrogé 12 managers : 35 minutes par semaine, validation en bloc, et 0,8 % de notes non conformes validées quand même. La cause : toutes les notes se ressemblent à l’écran. »
→ beat 2 : l’hypothèse IA. « Les plafonds de la politique, c’est une règle. Mais “inhabituel pour ce salarié”, une règle ne le voit pas : là, un modèle apporte quelque chose. »
→ beat 3 : humain et doute. « Niveau 1 : le manager décide toujours. Les notes à examiner sont en tête, avec leur raison. Si le modèle tombe : affichage habituel. »
→ beat 4 : la story. « En tant que manager, je veux que les notes à examiner soient signalées avec leur raison, afin de consacrer mon temps aux seules notes à risque. Succès : temps de validation et notes non conformes divisés par deux. »

QUESTION — « Qu’est-ce qui manque encore pour qu’elle soit prête ? » Réponses attendues : jeu de test, seuils, biais (certains métiers plus signalés ?), mesure en production.

TRANSITION — « À vous. Trois besoins bruts. »`,
  `⏱ 1 min · LES TROIS BESOINS BRUTS

OBJECTIF — Distribuer les sujets de l’atelier.

CONSIGNE — « Un besoin par groupe : la comptable pour le groupe A, le DAF pour le B, le salarié à l’étranger pour le C. Ou un besoin réel de votre produit, sans aucune donnée réelle. »

ANIMATION — Ne révéler les pistes qu’au moment de la mise en commun, une par clic.

→ beat 1 : piste du groupe A. « Manquant, c’est une règle ; illisible, c’est un modèle. »
→ beat 2 : piste du groupe B. « Peu d’utilisateurs : la valeur se joue sur la décision budgétaire. »
→ beat 3 : piste du groupe C. « Les plafonds du pays : une règle. Les questions : l’assistant. La devise : pas d’IA du tout. »

TRANSITION — « Voici la consigne précise. »`,
  `⏱ 12 min · ATELIER 2 : REFORMULER (minuteur)

OBJECTIF — Appliquer la méthode en groupe, jusqu’à une story en une phrase.

CONSIGNE — « Douze minutes, trois temps de quatre minutes. Le problème avec des hypothèses chiffrées ; l’hypothèse IA et le niveau d’automatisation ; la story et son indicateur. »

ANIMATION — Lancer le minuteur. Passer dans les groupes. Relances : « Combien ça coûte aujourd’hui ? », « Une règle ne suffirait pas ? », « Qui décide à la fin ? ». Pour les groupes rapides : la phrase de défense du bonus.

MISE EN COMMUN — 3 minutes à la fin (sur le temps du TP si besoin) : chaque groupe lit sa story en une phrase. Révéler alors les pistes sur la page précédente.

TRANSITION — « Vous avez la phrase. Maintenant, la story complète. »`,
  `⏱ 20 min · TP : RÉDIGER LA STORY COMPLÈTE (minuteur)

OBJECTIF — Produire le livrable de la journée : une user story IA complète avec critères d’acceptation.

CONSIGNE — « Quinze minutes de rédaction individuelle, à partir de la story de votre groupe, ou de B4 si vous préférez. Les huit blocs, au moins six critères dont deux statistiques, et au moins un scénario de doute ou de panne. Puis cinq minutes avec votre binôme : lisez la story de l’autre à voix haute. »

ANIMATION — Afficher la page suivante (le canevas) pendant la rédaction. Circuler. Erreurs fréquentes à corriger : critère sans jeu de test, « l’IA doit être précise », nom de modèle dans les critères, aucun repli décrit.

TRANSITION — « Le canevas, sous vos yeux pendant le TP. »`,
  `⏱ 1 min · LE CANEVAS (affiché pendant le TP)

OBJECTIF — Fournir le gabarit de rédaction.

DIRE — « Chaque zone violette est à compléter. Copiez ce canevas dans votre outil habituel : il tient sur une page, et il est fait pour Jira, Azure DevOps ou Notion. »

ANIMATION — Laisser cette page affichée pendant les 15 minutes de rédaction.

TRANSITION — « Temps écoulé : passons à la relecture croisée. »`,
  `⏱ 8 min · RELECTURE CROISÉE (grille sur 20)

OBJECTIF — Évaluer la story par les pairs, avec une grille explicite.

CONSIGNE — « Échangez votre story avec un autre binôme. Cochez ce qui est présent ET testable. Les blocs qui pèsent 3 points : le problème, les critères statistiques, le doute, les garde-fous. »

ANIMATION — Lancer le minuteur de 8 minutes. Puis demander deux volontaires pour lire leur story ; appliquer la grille à l’écran en cochant avec le groupe.

DEBRIEF — Valoriser les stories à 16 et plus : « prêtes pour un refinement ». Pour les autres, identifier le bloc manquant le plus fréquent.

EVALUATION — Ce TP sert d’évaluation de l’objectif « structurer une user story IA simple et réaliste ». Noter les scores pour la feuille d’évaluation.

TRANSITION — « Voici un corrigé possible, sur la story SPEN-412 du module 5. »`,
  `⏱ 5 min · CORRIGÉ

OBJECTIF — Montrer une story complète de référence et faire comparer.

DIRE — « SPEN-412 réécrite. Bloc 1 : le problème et le succès chiffré. Bloc 2 : niveau 1, l’assistant ne valide ni ne refuse rien. Bloc 3 : le cloisonnement par entreprise. Bloc 4 : 100 questions de test, et 20 questions pièges hors périmètre, avec zéro invention tolérée. Bloc 5 : “je ne sais pas”, et une FAQ statique en cas de panne. Bloc 6 : la mention IA, la source, le retour utilisateur. Bloc 7 : un test d’injection et la transparence AI Act. Bloc 8 : les indicateurs et l’alerte. »

→ beat 1 : les deux encadrés. « Ce qui a changé : un problème chiffré, un périmètre borné, des critères mesurables. Et plus aucune ligne sur GPT. Comparez avec la vôtre : le bloc le plus difficile à écrire, c’est celui à travailler avec votre équipe. »

TRANSITION — « Il est temps de conclure. »`,
];
// @@NOTES-END
