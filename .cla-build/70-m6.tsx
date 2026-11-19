// ─── Module 6 · Défi final ──────────────────────────────────────────────────

const M6_Section: Page = () => (
  <Section n={6} title="Défi final" sub="Une demande métier, livrée en autonomie avec tout le harnais construit en deux jours." dur="35 min" labs={<Tag tone="green" size={20}>Atelier 5 · Livraison autonome</Tag>}>
    <SecItem n={1}>Planifier avec Claude Code, valider le plan</SecItem>
    <SecItem n={2}>Implémenter avec la Skill, sous les hooks</SecItem>
    <SecItem n={3}>Faire relire, corriger, livrer</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

const M6_A5: Page = () => (
  <LabPage
    mod={6}
    n="5"
    title="La demande métier d’Oasis Digital"
    defi="livrer"
    who="Individuel"
    minutes={30}
    objective={
      <>
        « Nos clients européens écrivent en anglais. Détectez la <strong>langue</strong> de chaque demande, affichez-la dans le tableau de bord, et routez les demandes en anglais vers
        l’<strong>équipe Europe</strong>. »
      </>
    }
    where={
      <>
        le plan relu dans <Ic>decisions/langue.md</Ic>
        <br />
        le champ <Ic>langue</Ic> (via la Skill)
        <br />
        la règle de routage dans <Ic>domaine/</Ic>
        <br />
        un commit propre
      </>
    }
    crit={
      <>
        <CheckItem id="a5c1" size={21}>
          Plan validé par vous avant tout code
        </CheckItem>
        <CheckItem id="a5c2" size={21}>
          Constats du relecteur traités ou justifiés
        </CheckItem>
        <CheckItem id="a5c3" size={21}>
          verifier A5 au vert
        </CheckItem>
      </>
    }
    suivi="Point d’étape à 14 h 45 : « Plan validé ? Implémentation ? Relecture ? »"
  >
    <WStep n="1">Mode Plan : faites proposer un plan ; corrigez-le ; enregistrez-le.</WStep>
    <WStep n="2">Implémentation : la Skill ajouter-champ doit se déclencher ; les hooks tournent.</WStep>
    <WStep n="3">Le routage est une règle métier en code, avec ses tests (FR, EN, mélange).</WStep>
    <WStep n="4">Relecture par relecteur-securite ; corrections ; verifier A5 ; commit.</WStep>
    <TpBonus>Lancez la même demande sur claude.ai/code depuis votre dépôt GitHub, et comparez la PR obtenue à votre version.</TpBonus>
  </LabPage>
);

const M6_Restit: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Restitution finale</Title>
    <Lede>Deux ou trois volontaires montrent leur session : le plan, un garde-fou qui s’est déclenché, le résultat. 2 à 3 minutes chacun.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
      <PanelTitle icon="eye">Ce qu’on regarde ensemble</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={24}>Qu’avez-vous corrigé dans le plan de Claude ?</Bullet>
        <Bullet size={24}>La Skill s’est-elle déclenchée seule ? Les hooks ont-ils bloqué quelque chose ?</Bullet>
        <Bullet size={24}>Qu’a trouvé le relecteur que vous n’aviez pas vu ?</Bullet>
        <Bullet size={24}>Combien de temps, et combien d’interventions de votre part ?</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 262, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="restitution" minutes={3} label="Participant suivant" cls={A.right} style={dl(200)} />
      <Callout tone="green" icon="bulb" title="Ce que montre ce défi" size={23} cls={A.right} style={dl(350)}>
        Avec un harnais, déléguer une fonctionnalité entière devient raisonnable : vous cadrez au début, vous vérifiez à la fin, les garde-fous tiennent le milieu.
      </Callout>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M6_Section, M6_A5, M6_Restit];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION MODULE 6 · J2 14:25

OBJECTIF — Lancer le défi final : tout le harnais au service d’une vraie demande.

DIRE — « Dernier atelier : une demande métier, livrée en autonomie, avec tout ce que vous avez construit. Vous êtes le chef de projet : Claude Code fait le travail, vous cadrez et vous vérifiez. »

TRANSITION — « Voici la demande. »`,
  `⏱ 2 min · BRIEF ATELIER 5 (minuteur 30 min)

OBJECTIF — Lancer le défi : plan, implémentation, relecture, livraison.

DIRE — « La demande d’Oasis Digital : détecter la langue, l’afficher, et router les demandes en anglais vers l’équipe Europe. Quatre temps : le plan en mode Plan, que vous corrigez ; l’implémentation, où la Skill et les hooks doivent jouer leur rôle ; le routage comme règle métier testée ; et la relecture par votre sous-agent. Trente minutes. »

ANIMATION — Lancer le minuteur. Point d’étape à 14 h 45. Retard sur l’Atelier 4 : reprise A4.5 d’abord (2 minutes).

TRANSITION — « Qui veut nous montrer sa session ? »`,
  `⏱ 8 min · RESTITUTION FINALE (2–3 volontaires, minuteur 3 min chacun)

OBJECTIF — Faire montrer des sessions réelles et tirer la leçon : cadrer au début, vérifier à la fin.

DIRE — « Deux ou trois volontaires, trois minutes chacun. Montrez le plan, un garde-fou qui s’est déclenché, et le résultat. »

ANIMATION — Relancer le minuteur à chaque participant (« Participant suivant »). Questionner sur les quatre points.

TRANSITION — « Dernier QCM. »`,
];
// @@NOTES-END
