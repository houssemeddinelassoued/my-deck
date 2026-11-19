// ─── Close · The journey ────────────────────────────────────────────────────
const CLMod = ({ n, tone, title, d, children }: { n: number; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 290, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 24px' }}>
      <Num n={pad(n)} tone={tone} size={44} />
      <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const CL_Journey: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Une journée, huit modules : le chemin parcouru</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 397px)', rowGap: 26, columnGap: 30 }}>
      <CLMod n={1} tone="blue" title="Qu’est-ce que l’IA ?" d={100}>
        Elle apprend d’exemples et prédit le probable, pas le vrai.
      </CLMod>
      <CLMod n={2} tone="blue" title="Applications" d={170}>
        Des gains réels dans tous les secteurs, et une question éthique pour chacun.
      </CLMod>
      <CLMod n={3} tone="yellow" title="Atelier 1" d={240}>
        Un outil pris en flagrant délit : source inventée, image stéréotypée.
      </CLMod>
      <CLMod n={4} tone="violet" title="Enjeux éthiques" d={310}>
        Biais, transparence, vie privée.
      </CLMod>
      <CLMod n={5} tone="violet" title="Loi 25 et principes" d={380}>
        EFVP, décision automatisée, six principes.
      </CLMod>
      <CLMod n={6} tone="yellow" title="Atelier 2" d={450}>
        Un cas de votre secteur : sans gouvernance, l’outil dérape.
      </CLMod>
      <CLMod n={7} tone="violet" title="Gouvernance" d={520}>
        Des rôles nommés, cinq points de contrôle, un bouton d’arrêt.
      </CLMod>
      <CLMod n={8} tone="yellow" title="Atelier 3" d={590}>
        Votre mini-charte, vivante et vérifiable.
      </CLMod>
    </div>
  </Frame>
);

// ─── Close · Final quiz (multi) ─────────────────────────────────────────────
const CL_Quiz: Page = () => (
  <Frame mod={9} kind="qcm" beats={2} label="Clôture · Quiz final">
    <Title>
      <span style={{ color: C.violet }}>Quiz final</span> · Les bons réflexes
    </Title>
    <Qcm
      multi
      q="Lesquelles de ces pratiques relèvent d’une IA responsable ?"
      explain="Dire qu’une IA intervient, tester les résultats, garder un humain capable de réviser, encadrer les outils : c’est la réponse à la question de Nathalie, ce matin."
    >
      <Opt ok why="Oui : c’est la transparence, exigée en Europe pour les agents conversationnels et attendue partout.">
        Informer les membres qu’ils échangent avec une IA
      </Opt>
      <Opt why="Piège ! Retirer une variable ne suffit pas : des indices indirects la révèlent. Il faut tester les résultats par groupe.">
        Retirer le genre des données, puis ne plus rien tester
      </Opt>
      <Opt ok why="Oui : c’est le contrôle humain, et au Québec une obligation de l’article 12.1 pour les décisions automatisées.">
        Prévoir qu’une personne puisse réviser une décision automatisée
      </Opt>
      <Opt why="Piège ! Sans règle, les données sensibles finissent dans des outils non approuvés. Une charte encadre sans tout interdire.">
        Laisser chaque employé choisir ses outils d’IA, sans règle
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Close · Personal action plan ───────────────────────────────────────────
const CLWhen = ({ d, tone, icon, when, children, ex }: { d: number; tone: Tone; icon: IconName; when: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{when}</div>
      <div style={{ marginTop: 10, fontSize: 29, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Exemple :</b> {ex}
      </div>
    </div>
  </div>
);

const CL_Action: Page = () => (
  <Frame mod={9} label="Clôture · Plan d’action">
    <Title>Votre plan d’action : trois engagements</Title>
    <Lede>Écrivez-les maintenant, dans un document à vous. Un engagement écrit a bien plus de chances d’être tenu.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <CLWhen d={100} tone="blue" icon="bolt" when="Cette semaine" ex="demander qui est notre responsable des renseignements personnels.">
        Une question posée dans votre organisation.
      </CLWhen>
      <CLWhen d={250} tone="teal" icon="calendar" when="Ce mois-ci" ex="présenter ma mini-charte à mon gestionnaire.">
        Votre charte partagée, discutée, améliorée.
      </CLWhen>
      <CLWhen d={400} tone="green" icon="users" when="Dans 3 mois" ex="un registre des outils d’IA utilisés dans mon service.">
        Une pratique de gouvernance installée.
      </CLWhen>
    </div>
    <Callout cls={A.in} title="Petit et précis" tone="yellow" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      « Présenter ma charte à l’équipe le 15 » plutôt que « faire plus attention à l’éthique ».
    </Callout>
  </Frame>
);

// ─── Close · Resources ──────────────────────────────────────────────────────
const CLTool = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={24} cls={A.in} style={{ height: 270, ...dl(d) }}>
    {children}
  </Card>
);

const CL_Resources: Page = () => (
  <Frame mod={9} label="Clôture · Ressources">
    <Title>Pour aller plus loin</Title>
    <Lede>Des sources fiables, à consulter plutôt qu’à demander à une IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <CLTool d={100} icon="shield" tone="blue" title="Commission d’accès à l’information">
        Loi 25, guide de l’EFVP, incidents de confidentialité. cai.gouv.qc.ca
      </CLTool>
      <CLTool d={200} icon="leaf" tone="teal" title="Déclaration de Montréal">
        Les dix principes et le guide pour les appliquer. declarationmontreal-iaresponsable.com
      </CLTool>
      <CLTool d={300} icon="globe" tone="violet" title="OCDE et UNESCO">
        Principes de l’IA (OCDE, 2024) et recommandation sur l’éthique de l’IA (UNESCO, 2021).
      </CLTool>
      <CLTool d={400} icon="book" tone="yellow" title="Règlement européen sur l’IA">
        Règlement (UE) 2024/1689 et son report « omnibus » de 2026.
      </CLTool>
      <CLTool d={500} icon="layers" tone="green" title="ISO/IEC 42001">
        La norme de système de management de l’IA, certifiable.
      </CLTool>
      <CLTool d={600} icon="search" tone="coral" title="Obvia">
        L’Observatoire international sur les impacts sociétaux de l’IA, au Québec. obvia.ca
      </CLTool>
    </div>
  </Frame>
);

// ─── Close · Photo credits ──────────────────────────────────────────────────
const CLCredit = ({ id, what, who }: { id: PhotoId; what: string; who: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62, borderTop: `1.5px solid ${C.rule}` }}>
    <Photo id={id} w={70} h={48} radius={8} credit={false} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{what}</div>
      <div style={{ fontSize: 19, lineHeight: 1.3, color: C.muted }}>{who}</div>
    </div>
  </div>
);

const CL_Credits: Page = () => (
  <Frame mod={9} label="Clôture · Crédits photographiques">
    <Title>Crédits photographiques</Title>
    <Lede>Photos de Wikimedia Commons, sous licence libre. Logos des outils : marques de leurs propriétaires.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 60, ...dl(100) }}>
      <div>
        <CLCredit id="turing" what="Alan Turing à 16 ans" who="Auteur inconnu · domaine public" />
        <CLCredit id="mccarthy" what="John McCarthy, Stanford" who="null0 · CC BY-SA 2.0" />
        <CLCredit id="deepBlue" what="Deep Blue, Computer History Museum" who="Anton Chiang · CC BY 2.0" />
        <CLCredit id="hinton" what="Geoffrey Hinton" who="Xuthoria · CC BY-SA 4.0" />
        <CLCredit id="leeSedol" what="Lee Sedol" who="LG Electronics · CC BY 2.0" />
        <CLCredit id="troisRivieres" what="Trois-Rivières" who="Quintin Soloviev · CC BY 4.0" />
        <CLCredit id="entrevue" what="Entrevue d’embauche" who="Amtec Photos · CC BY-SA 2.0" />
        <CLCredit id="radiologie" what="Radiologue examinant des radiographies" who="Bill Branson, NCI · domaine public" />
        <CLCredit id="paiement" what="Terminal de paiement" who="Daylon124 · CC0" />
        <CLCredit id="timesSquare" what="Times Square, New York" who="Kevani pour la Wikimedia Foundation · CC BY-SA 4.0" />
      </div>
      <div>
        <CLCredit id="fondOeil" what="Fond d’œil normal" who="Mikael Häggström · CC0" />
        <CLCredit id="proteine" what="Protéine en rubans (triose-phosphate isomérase)" who="Jane Richardson · CC BY 3.0" />
        <CLCredit id="datacenter" what="Centre de données" who="PiDatacenters · CC BY-SA 4.0" />
        <CLCredit id="achat" what="Achat en ligne" who="Shixart1985 · CC BY 2.0" />
        <CLCredit id="parlement" what="Hôtel du Parlement, Québec" who="Marc-Lautenbacher · CC BY-SA 4.0" />
        <CLCredit id="montreal" what="Montréal vu du mont Royal" who="Taxiarchos228 · CC BY 3.0" />
        <CLCredit id="berlaymont" what="Le Berlaymont, Bruxelles" who="KenSwe72 · CC BY 4.0" />
        <CLCredit id="camionMine" what="Camion de minerai, mine souterraine (Australie)" who="R. Hill, CSIRO · CC BY 3.0" />
        <CLCredit id="camerasMagasin" what="Écran de surveillance en magasin" who="MIKI Yoshihito · domaine public" />
        <CLCredit id="airCanada" what="Boeing 787-9 d’Air Canada" who="Adam Moreira · CC BY-SA 4.0" />
      </div>
    </div>
  </Frame>
);

// ─── Close · Thanks ─────────────────────────────────────────────────────────
const CL_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA114 · Fin
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 38, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        Une IA n’est jamais responsable. <Hl>Nous, toujours.</Hl>
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 18, ...dl(400) }}>
        <IconTile name="star" tone="yellow" size={64} solid />
        <span style={{ fontSize: 30, fontWeight: 500, color: C.ink }}>Merci de remplir l’évaluation de la formation.</span>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(560) }}>
      <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>
    <Squares s={380} x={1270} y={330} delay={200} />
    <Footer2 />
  </Frame>
);
CL_Thanks.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [CL_Journey, CL_Quiz, CL_Action, CL_Resources, CL_Credits, CL_Thanks];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 3 min · CLÔTURE (≈ 15 h 45)

OBJECTIF — Remettre en perspective le chemin parcouru.

DIRE — « Une journée, huit modules. Ce matin : l'IA apprend d'exemples et prédit le probable, pas le vrai. Elle rend de vrais services dans tous les secteurs. Vous l'avez prise en flagrant délit. Puis les enjeux : biais, transparence, vie privée. Cet après-midi : la Loi 25 et six principes ; un cas de votre secteur, où un outil d'IA mal encadré dérape ; la gouvernance ; et votre charte. »

QUESTION — « Quel module vous servira le plus en rentrant ? » Deux ou trois réponses au micro.

TRANSITION — « Un dernier quiz, pour la route. »`,
  `⏱ 2 min · QUIZ FINAL (réponses multiples)

ANIMATION — Faites voter pour chaque option, cochez, validez, puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Transparence.
• B ✗ PIÈGE — Retirer une variable sans tester : le cas Amazon.
• C ✓ — Contrôle humain, article 12.1.
• D ✗ PIÈGE — Sans règle, les données sensibles fuient vers des outils non approuvés.

MESSAGE CLÉ — Revenez à la question de Nathalie : « Comment profiter de l'IA sans trahir la confiance ? » Réponse : en le disant, en le testant, en gardant un humain, en l'écrivant.

TRANSITION — « De la formation à votre quotidien. »`,
  `⏱ 4 min · PLAN D'ACTION PERSONNEL

ANIMATION — Chacun écrit ses trois engagements dans un document à lui. Laissez 2 minutes de silence (caméras allumées si possible). Puis invitez deux ou trois volontaires à en lire un au micro.

DIRE — « Trois engagements. Cette semaine : une question posée, par exemple "Qui est notre responsable des renseignements personnels ?". Ce mois-ci : votre charte présentée à votre gestionnaire ou à votre équipe. Dans trois mois : une pratique installée, comme un registre des outils d'IA de votre service. »

INSISTER — « Petit et précis vaut mieux que grand et vague. »

TRANSITION — « Quelques ressources fiables. »`,
  `⏱ 2 min · RESSOURCES

DIRE — « Six sources fiables, à consulter plutôt qu'à demander à une IA, vous savez maintenant pourquoi. »
• La CAI : la Loi 25, le guide de l'EFVP, la déclaration des incidents.
• La Déclaration de Montréal : les dix principes.
• Les principes de l'OCDE (mis à jour en 2024) et la recommandation de l'UNESCO (2021).
• Le règlement européen sur l'IA, si vous avez des clients en Europe.
• La norme ISO/IEC 42001.
• Obvia, l'Observatoire international sur les impacts sociétaux de l'IA et du numérique, un réseau de recherche québécois.

LOGISTIQUE — Indiquez comment les participants récupèrent le support (courriel, plateforme Technologia, lien de partage).

TRANSITION — « Il ne me reste qu'à vous remercier. »`,
  `⏱ 0 min · CRÉDITS PHOTOGRAPHIQUES

Page de référence, à ne pas commenter : les photos du support viennent de Wikimedia Commons, sous licence libre (CC0, CC BY, CC BY-SA, domaine public). Les licences CC BY et CC BY-SA exigent de citer l'auteur : cette page et les mentions sur chaque photo y répondent. Ne la retirez pas si vous diffusez le support.

TRANSITION — Passez directement à la page suivante.`,
  `⏱ 4 min · REMERCIEMENTS ET ÉVALUATION

DIRE — « Merci pour votre participation, vos analyses et vos chartes. Une phrase à retenir : une IA n'est jamais responsable. Nous, toujours. »

ÉVALUATION — Laissez quelques minutes pour remplir l'évaluation de la formation (lien ou formulaire Technologia). Restez disponible pour les questions individuelles.

À PERSONNALISER — Vos coordonnées professionnelles si vous souhaitez être joint après la formation.

CLÔTURE — « Bon retour, et bonne gouvernance ! »`,
];
// @@NOTES-END
