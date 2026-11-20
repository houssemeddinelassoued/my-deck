// ═══ Fin du jour 1 ═══════════════════════════════════════════════════════════

const J1Row = ({ n, tone, t, s, d }: { n: number; tone: Tone; t: string; s: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <Num n={pad(n)} tone={tone} size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{t}</div>
      <div style={{ fontSize: 22, color: C.soft }}>{s}</div>
    </div>
  </div>
);

const J1_Bilan: Page = () => (
  <Frame mod={5} label="Bilan du jour 1">
    <Title>Ce que vous avez fait aujourd’hui</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <J1Row d={100} n={1} tone="blue" t="Automatiser" s="Quand… Si… Alors… et six niveaux, du raccourci à l’agent" />
      <J1Row d={200} n={2} tone="teal" t="Choisir et analyser" s="Votre tâche notée sur 20, son SIPOC, son gain estimé" />
      <J1Row d={300} n={3} tone="blue" t="Les outils" s="Quatre familles, un vocabulaire commun, votre compte Make" />
      <J1Row d={400} n={4} tone="teal" t="Les robots RPA" s="Repérer, agir, enchaîner, quand il n’y a pas de connecteur" />
      <J1Row d={500} n={5} tone="violet" t="L’IA dans le circuit" s="Classer, extraire, rédiger, avec un seuil de confiance" />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1250, top: 220, width: 550, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(400) }}>
      <Eyebrow c={C.violet}>Tour éclair · un mot</Eyebrow>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.45, color: C.ink }}>
        Chacun dit <b>un mot</b> sur la journée, puis <b>la tâche</b> qu’il compte automatiser demain.
      </div>
      <Timer id="j1-tour" minutes={5} label="Tour éclair" compact style={{ marginTop: 22 }} />
    </div>
  </Frame>
);

const J1_Demain: Page = () => (
  <Frame mod={5} label="Bilan du jour 1 · Pour demain">
    <Title>Demain, on construit</Title>
    <Lede>Pour gagner du temps à 9 h, vérifiez ce soir ces quatre points.</Lede>
    <Checklist style={{ position: 'absolute', left: 120, top: 290, width: 960, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CheckItem id="make">Je me connecte à Make sans problème</CheckItem>
      <CheckItem id="sheet">Mon classeur « Demandes IA135 » a ses 7 en-têtes</CheckItem>
      <CheckItem id="key">Ma clé d’API Gemini est rangée dans un fichier personnel</CheckItem>
      <CheckItem id="carnet">Mon carnet contient ma tâche, son SIPOC et son prompt</CheckItem>
    </Checklist>
    <div className={A.right} style={{ position: 'absolute', left: 1160, top: 290, width: 640, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff', ...dl(300) }}>
      <Eyebrow c={C.yellow}>Au programme du jour 2</Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 26, lineHeight: 1.35 }}>
        <div>06 · Un premier flux, de bout en bout</div>
        <div>07 · La fiche de conception de votre tâche</div>
        <div>08 · Un workflow avec une étape IA</div>
        <div>09 · Un scénario complet, au choix</div>
        <div>10 · Tester, mesurer, déployer</div>
      </div>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J1_Bilan, J1_Demain];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 6 min · BILAN DU JOUR 1

OBJECTIF — Consolider la journée et faire émerger les intentions pour demain.

DIRE — Parcourez les cinq lignes rapidement : « Voilà le chemin parcouru. »

TOUR ÉCLAIR — Lancez le minuteur. Appelez chacun par son prénom : un mot sur la journée, puis la tâche qu'il veut automatiser demain. Notez les tâches : elles orienteront vos exemples au module 7 et le choix des scénarios au module 9.

SIGNAUX À REPÉRER — « Perdu », « technique » : prévoyez plus de temps au module 6. Quelqu'un n'a pas encore de compte Make ou de clé : proposez 5 minutes avant le début demain (8 h 55).`,
  `⏱ 2 min · POUR DEMAIN

DIRE — « Quatre vérifications ce soir, deux minutes chacune. » Cliquez les cases à titre d'exemple ; chacun vérifie pour soi.

INSISTER — « Demain, on construit dès 9 h 15. Si un compte bloque, écrivez-moi ce soir ou arrivez cinq minutes plus tôt. »

CLÔTURE — Remerciez, rappelez l'heure de début (9 h) et le lien de la classe virtuelle.`,
];
// @@NOTES-END
