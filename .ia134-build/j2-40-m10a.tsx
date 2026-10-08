// ═══ Module 10 — Mesure de performance (pages 8 à 11) ═══════════════════════

// ─── M10 divider ────────────────────────────────────────────────────────────
const M10a_Divider: Page = () => (
  <Section n={10} title="Mesure de performance" sub="Un agent qu’on ne mesure pas ne s’améliore pas… et ne se défend pas devant la direction." dur="≈ 20 min">
    <SecItem n={1}>Les 4 familles de KPI</SecItem>
    <SecItem n={2}>Évaluer la qualité des réponses</SecItem>
    <SecItem n={3}>Monitoring : traces et journaux</SecItem>
    <SecItem n={4}>Tableau de bord et amélioration continue</SecItem>
  </Section>
);
M10a_Divider.transition = BLOOM;

// ─── 4 familles de KPI ──────────────────────────────────────────────────────
const M10aKpi = ({ tone, name, target }: { tone: Tone; name: ReactNode; target: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <span style={{ flex: 'none', width: 13, height: 13, marginTop: 13, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.28, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 23, lineHeight: 1.32, color: T[tone].fg }}>{target}</div>
    </div>
  </div>
);

const M10aFamily = ({
  beat,
  tone,
  icon,
  name,
  q,
  children,
}: {
  beat: number;
  tone: Tone;
  icon: IconName;
  name: ReactNode;
  q: ReactNode;
  children: ReactNode;
}) => (
  <div className={b.on(beat)} style={{ flex: 1, display: 'flex' }}>
    <div
      style={{
        flex: 1,
        boxSizing: 'border-box',
        padding: '30px 26px 26px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.05, color: C.ink }}>{name}</div>
      </div>
      <div style={{ marginTop: 16, fontSize: 25, fontStyle: 'italic', lineHeight: 1.3, color: C.soft }}>{q}</div>
      <div style={{ marginTop: 14, height: 2, background: C.rule }} />
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 22 }}>{children}</div>
    </div>
  </div>
);

const M10a_Kpis: Page = () => (
  <Frame mod={10} beats={5}>
    <Title>Quatre familles de KPI pour juger un agent</Title>
    <Lede>Un seul chiffre raconte toujours une demi-vérité : on lit les quatre familles ensemble.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 286, width: 1680, display: 'flex', gap: 28, alignItems: 'stretch' }}>
      <M10aFamily beat={1} tone="green" icon="target" name="Qualité" q="« Répond-il juste ? »">
        <M10aKpi tone="green" name="Exactitude des réponses" target="Boréal : ≥ 95 % sur le jeu de test" />
        <M10aKpi tone="green" name="Taux d’hallucination" target="Réponses non appuyées : < 2 %" />
        <M10aKpi tone="green" name="Respect des règles" target="Ex. : aucun crédit hors politique" />
      </M10aFamily>
      <M10aFamily beat={2} tone="blue" icon="clock" name="Efficacité" q="« Fait-il gagner du temps ? »">
        <M10aKpi tone="blue" name="Temps de traitement" target="Courriel de suivi : de 4 h à 5 min" />
        <M10aKpi tone="blue" name="Taux d’automatisation" target="Part traitée sans humain : 60 %" />
        <M10aKpi tone="blue" name="Heures libérées / mois" target="À réinvestir, pas à couper" />
      </M10aFamily>
      <M10aFamily beat={3} tone="teal" icon="smile" name="Adoption" q="« Les gens l’utilisent-ils ? »">
        <M10aKpi tone="teal" name="Satisfaction client (CSAT)" target="Cible : ≥ 4 / 5, comparée à avant" />
        <M10aKpi tone="teal" name="Usage par les employés" target="Utilisateurs actifs par semaine" />
        <M10aKpi tone="teal" name="Taux de contournement" target="Retour à l’ancienne méthode" />
      </M10aFamily>
      <M10aFamily beat={4} tone="coral" icon="scale" name="Coûts et risques" q="« À quel prix, quels risques ? »">
        <M10aKpi tone="coral" name="Coût par tâche" target="Jetons, infrastructure, supervision" />
        <M10aKpi tone="coral" name="Incidents et plaintes" target="Cible : zéro incident grave" />
        <M10aKpi tone="coral" name="Taux d’escalade" target="Vers un humain : ni 0 %, ni 80 %" />
      </M10aFamily>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 812, width: 1680 }}>
      <Callout title="Le piège du chiffre unique" tone="yellow" icon="alert" size={27}>
        80 % d’automatisation avec 15 % de réponses fausses, c’est <Hl>des centaines de clients mal servis</Hl> chaque mois.
      </Callout>
    </div>
  </Frame>
);

// ─── Évaluer la qualité ─────────────────────────────────────────────────────
const M10aMethod = ({
  beat,
  n,
  tone,
  icon,
  title,
  when,
  children,
}: {
  beat: number;
  n: number;
  tone: Tone;
  icon: IconName;
  title: ReactNode;
  when: ReactNode;
  children: ReactNode;
}) => (
  <div className={b.left(beat)}>
    <div
      style={{
        boxSizing: 'border-box',
        padding: '26px 28px 26px 32px',
        background: C.card,
        borderRadius: 16,
        boxShadow: `${SHADOW_SM}, inset 8px 0 0 ${STRONG[tone]}`,
        display: 'flex',
        gap: 22,
        alignItems: 'flex-start',
      }}
    >
      <IconTile name={icon} tone={tone} size={60} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.ink }}>
            <span style={{ color: T[tone].fg }}>{n}.</span> {title}
          </div>
          <Tag tone={tone} size={20}>
            {when}
          </Tag>
        </div>
        <div style={{ marginTop: 8, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      </div>
    </div>
  </div>
);

const M10aCaseRow = ({ label, c = C.muted, children }: { label: string; c?: string; children: ReactNode }) => (
  <div>
    <Eyebrow c={c} size={19}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 2, fontSize: 23, lineHeight: 1.36, color: C.ink }}>{children}</div>
  </div>
);

const M10aScore = ({ label, v, beat, d }: { label: string; v: number; beat: number; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ width: 230, fontSize: 22, color: C.ink }}>{label}</span>
    <div style={{ position: 'relative', width: 250, height: 14, borderRadius: 7, background: C.rule, overflow: 'hidden' }}>
      <div className={b.grow(beat)} style={{ position: 'absolute', left: 0, top: 0, height: 14, width: v * 50, borderRadius: 7, background: v >= 4 ? C.green : C.amber, ...dl(d) }} />
    </div>
    <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ink }}>{v}/5</span>
  </div>
);

const M10aTool = ({ name, children }: { name: string; children: ReactNode }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 12 }}>
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 25, color: C.violet, whiteSpace: 'nowrap' }}>{name}</span>
    <span style={{ fontSize: 22, lineHeight: 1.3, color: C.soft }}>{children}</span>
  </div>
);

const M10a_Quality: Page = () => (
  <Frame mod={10} beats={6}>
    <Title>Évaluer la qualité : trois méthodes complémentaires</Title>
    <Lede>Automatique pour le volume, humaine pour la vérité : on combine les trois.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 940, height: 572, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <M10aMethod beat={1} n={1} tone="green" icon="star" title="Jeu de test « doré »" when="À chaque changement">
        100 à 200 vrais cas, avec la bonne réponse validée par un expert métier. On le rejoue avant toute mise en production.
      </M10aMethod>
      <M10aMethod beat={2} n={2} tone="violet" icon="scale" title="LLM-juge" when="En continu">
        Un second modèle note chaque réponse selon une grille. Rapide et peu coûteux, mais à calibrer contre l’humain.
      </M10aMethod>
      <M10aMethod beat={3} n={3} tone="blue" icon="humanCheck" title="Évaluation humaine" when="Chaque semaine">
        Des experts relisent un échantillon, par exemple 5 % des réponses. C’est la référence… et le poste le plus coûteux.
      </M10aMethod>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1100, top: 280, width: 700 }}>
      <div style={{ boxSizing: 'border-box', padding: '22px 28px 24px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="doc" size={30} color={C.green} />
          <Eyebrow c={T.green.fg} size={22}>
            Jeu doré · cas n° 037
          </Eyebrow>
        </div>
        <M10aCaseRow label="Entrée">« Où est ma commande #45812 ? Je l’attendais hier. »</M10aCaseRow>
        <M10aCaseRow label="Réponse attendue" c={T.green.fg}>
          Statut réel, date prévue, lien de suivi, ton courtois
        </M10aCaseRow>
        <M10aCaseRow label="Réponse de l’agent" c={T.blue.fg}>
          « Votre commande a été expédiée lundi ; livraison prévue jeudi. Voici le lien de suivi. »
        </M10aCaseRow>
        <div className={b.fade(5)} style={{ paddingTop: 12, borderTop: `2px solid ${C.rule}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Eyebrow c={T.violet.fg} size={19}>
            Verdict du LLM-juge
          </Eyebrow>
          <M10aScore label="Exactitude" v={5} beat={5} d={100} />
          <M10aScore label="Fidélité aux données" v={5} beat={5} d={250} />
          <M10aScore label="Ton et politesse" v={4} beat={5} d={400} />
          <div style={{ marginTop: 4 }}>
            <Tag tone="green" size={22}>
              <Icon name="check" size={22} sw={3} /> Cas réussi
            </Tag>
          </div>
        </div>
      </div>
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 886, width: 1680 }}>
      <div style={{ boxSizing: 'border-box', padding: '18px 28px', borderRadius: 14, background: T.violet.bg, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Eyebrow c={T.violet.fg} size={22} style={{ whiteSpace: 'nowrap' }}>
          Outils
        </Eyebrow>
        <M10aTool name="RAGAS">évaluer un RAG : fidélité, pertinence</M10aTool>
        <M10aTool name="DeepEval">des tests unitaires pour LLM</M10aTool>
        <M10aTool name="promptfoo">comparer prompts et modèles</M10aTool>
      </div>
    </div>
  </Frame>
);

// ─── Monitoring ─────────────────────────────────────────────────────────────
const M10A_LABEL_W = 330;
const M10A_BAR_W = 480;
const M10A_TOTAL = 4.2;

const M10aSpan = ({
  label,
  tone,
  start,
  end,
  d,
  depth = 1,
  cls,
}: {
  label: string;
  tone: Tone;
  start: number;
  end: number;
  d: number;
  depth?: number;
  cls?: string;
}) => {
  const x = M10A_LABEL_W + (start / M10A_TOTAL) * M10A_BAR_W;
  const w = ((end - start) / M10A_TOTAL) * M10A_BAR_W;
  return (
    <div className={cls} style={{ position: 'relative', height: 52, borderRadius: 10 }}>
      <span
        style={{
          position: 'absolute',
          left: 8 + depth * 18,
          top: 12,
          fontFamily: mono,
          fontSize: 20,
          fontWeight: depth === 0 ? 700 : 500,
          color: T[tone].fg,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div className={A.grow} style={{ position: 'absolute', left: x, top: 13, width: w, height: 26, borderRadius: 6, background: STRONG[tone], ...dl(d) }} />
      <span className={A.fade} style={{ position: 'absolute', left: x + w + 10, top: 14, fontSize: 20, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', ...dl(d + 500) }}>
        {fr(end - start, 1)} s
      </span>
    </div>
  );
};

const M10aTick = ({ t }: { t: number }) => (
  <span style={{ position: 'absolute', left: M10A_LABEL_W + (t / M10A_TOTAL) * M10A_BAR_W - 14, top: 0, fontSize: 20, color: C.faint }}>{t} s</span>
);

const M10aObsTool = ({ name, children }: { name: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
    <span style={{ flex: 'none', width: 270, fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.violet }}>{name}</span>
    <span style={{ fontSize: 22, lineHeight: 1.3, color: C.soft }}>{children}</span>
  </div>
);

const M10a_Monitoring: Page = () => (
  <Frame mod={10} beats={3}>
    <Title>Monitoring : voir ce que l’agent a vraiment fait</Title>
    <Lede>Une trace par demande : chaque appel au modèle, chaque outil, chaque décision, horodatés.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 940 }}>
      <div style={{ boxSizing: 'border-box', padding: '22px 28px 18px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Eyebrow size={22} style={{ marginRight: 'auto' }}>
            Trace · courriel #8812
          </Eyebrow>
          <Tag tone="grey" size={19}>
            4,2 s
          </Tag>
          <Tag tone="grey" size={19}>
            3 140 jetons
          </Tag>
          <Tag tone="grey" size={19}>
            0,011 $
          </Tag>
          <Tag tone="green" size={19}>
            <Icon name="check" size={18} sw={3} /> succès
          </Tag>
        </div>
        <div style={{ position: 'relative', height: 26, marginTop: 14 }}>
          <M10aTick t={0} />
          <M10aTick t={1} />
          <M10aTick t={2} />
          <M10aTick t={3} />
          <M10aTick t={4} />
        </div>
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <M10aSpan label="agent · traiter_courriel" tone="grey" start={0} end={4.2} d={200} depth={0} />
          <M10aSpan label="llm · extraire" tone="violet" start={0.1} end={1.2} d={450} />
          <M10aSpan label="outil · consulter_commande" tone="teal" start={1.2} end={1.6} d={700} cls={b.hi(1)} />
          <M10aSpan label="llm · rediger_reponse" tone="violet" start={1.6} end={3.0} d={950} />
          <M10aSpan label="garde-fou · verifier" tone="yellow" start={3.0} end={3.6} d={1200} />
          <M10aSpan label="outil · envoyer_courriel" tone="teal" start={3.6} end={4.1} d={1450} />
        </div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 776, width: 940 }}>
      <Code title="Détail du span · consulter_commande" size={22}>
        <div>
          <Jc>entrée </Jc> {'{ '}
          <Jk>"numero"</Jk>: <Js>"45812"</Js>
          {' }'}
        </div>
        <div>
          <Jc>sortie </Jc> {'{ '}
          <Jk>"statut"</Jk>: <Js>"expédiée"</Js>, <Jk>"livraison"</Jk>: <Js>"jeudi"</Js>
          {' }'}
        </div>
        <div>
          <Jc>droits </Jc> lecture seule <Jc>· durée</Jc> <Jn>0,4 s</Jn>
        </div>
      </Code>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1100, top: 280, width: 700 }}>
      <div style={{ boxSizing: 'border-box', padding: '22px 28px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW }}>
        <Eyebrow size={22}>Ce qu’on journalise</Eyebrow>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Bullet size={24}>Entrées et sorties de chaque étape</Bullet>
          <Bullet size={24}>Appels d’outils et leurs paramètres</Bullet>
          <Bullet size={24}>Jetons, coût et latence</Bullet>
          <Bullet size={24}>Versions du prompt et du modèle</Bullet>
          <Bullet size={24}>Escalades et validations humaines</Bullet>
          <Bullet size={24}>Rétroaction des utilisateurs (pouce ↑ / ↓)</Bullet>
        </div>
        <div style={{ marginTop: 14, padding: '10px 16px', borderRadius: 10, background: T.coral.bg, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Icon name="lock" size={26} color={T.coral.fg} style={{ marginTop: 3 }} />
          <span style={{ fontSize: 22, lineHeight: 1.35, color: C.ink }}>
            <Strong c={T.coral.fg}>Loi 25 :</Strong> masquer les renseignements personnels, fixer la durée de conservation.
          </span>
        </div>
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1100, top: 720, width: 700 }}>
      <div style={{ boxSizing: 'border-box', padding: '18px 28px', borderRadius: 14, background: T.violet.bg, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Eyebrow c={T.violet.fg} size={20}>
          Outils de traçabilité
        </Eyebrow>
        <M10aObsTool name="LangSmith">de l’équipe LangChain</M10aObsTool>
        <M10aObsTool name="Langfuse">code source ouvert</M10aObsTool>
        <M10aObsTool name="Arize Phoenix">code source ouvert</M10aObsTool>
        <M10aObsTool name="OpenTelemetry GenAI">norme ouverte de traces</M10aObsTool>
      </div>
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M10a_Divider, M10a_Kpis, M10a_Quality, M10a_Monitoring];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · DÉBUT DU MODULE 10 (≈ 15 h 30)

OBJECTIF — Annoncer le dernier module de contenu et poser la question qui le guide : comment prouver qu'un agent fait vraiment son travail ?

DIRE — « On vient de voir que le pilote doit prouver la valeur. Mais prouver, ça veut dire mesurer. Et c'est là que beaucoup de projets se font prendre : la direction demande, après trois mois, "est-ce que ça marche ?", et l'équipe répond avec une impression, une anecdote, ou un seul chiffre flatteur. Ce module vous donne de quoi répondre avec des faits. »

« Au programme, en vingt minutes : les quatre familles d'indicateurs qu'on lit ensemble ; comment évaluer la qualité des réponses, de façon automatique et humaine ; le monitoring, c'est-à-dire voir ce que l'agent a réellement fait, étape par étape ; puis un tableau de bord simulé et la boucle d'amélioration continue. »

INTERACTION — Question à main levée : « Qui, dans son organisation, mesure aujourd'hui la qualité d'un outil numérique autrement qu'au nombre d'utilisateurs ? » Généralement peu de mains : c'est exactement le sujet.

INSISTER — Les mesures se définissent AVANT le pilote, en même temps que les critères de passage du module 9. Sinon, il n'y a pas de situation de référence à laquelle se comparer.

TRANSITION — « Commençons par ce qu'on mesure : quatre familles, pas une. »`,
  `⏱ 4 min

OBJECTIF — Faire retenir qu'on juge un agent sur quatre familles d'indicateurs lues ensemble, jamais sur un seul chiffre.

DIRE — « Quatre questions simples, quatre familles. »
→ beat 1 : « La qualité : répond-il juste ? Exactitude sur le jeu de test, taux d'hallucination, c'est-à-dire les réponses qui ne s'appuient sur aucune source, et respect des règles : chez Boréal, aucun crédit accordé hors politique. »
→ beat 2 : « L'efficacité : le courriel "où est ma commande" passe de 4 heures à 5 minutes. Les heures libérées, on les réinvestit : message important pour vos équipes. »
→ beat 3 : « L'adoption : satisfaction client, usage réel, et un indicateur souvent oublié, le contournement. Si les employés retournent à l'ancienne méthode, c'est un signal d'alarme. »
→ beat 4 : « Coûts et risques : coût par tâche, incidents, escalades. Un taux d'escalade de 0 % n'est pas une bonne nouvelle : l'agent ne reconnaît sans doute pas ses limites. »
→ beat 5 : le piège.

INSISTER — « Sur 5 000 courriels par mois, 80 % d'automatisation avec 15 % d'erreurs, c'est 600 clients mal servis chaque mois. Le chiffre d'automatisation, seul, ment. »

INTERACTION — « Si vous ne deviez présenter que deux indicateurs à votre direction, lesquels choisiriez-vous ? » Viser une réponse qui combine qualité et efficacité.

TRANSITION — « La qualité est la famille la plus difficile à mesurer. Voyons comment on s'y prend. »`,
  `⏱ 4 min

OBJECTIF — Montrer qu'évaluer la qualité est une discipline outillée qui combine trois méthodes.

DIRE — « Trois méthodes, du plus automatique au plus humain. »
→ beat 1 : « Le jeu de test doré : 100 à 200 vrais courriels de Boréal, avec la bonne réponse validée par le service client. Chaque fois qu'on change le prompt ou le modèle, on le rejoue : ce sont des tests de non-régression. »
→ beat 2 : « Le LLM-juge : un second modèle note chaque réponse selon une grille, des milliers par jour. Mais il se trompe aussi : on vérifie qu'il est d'accord avec les humains. »
→ beat 3 : « L'évaluation humaine : des experts relisent un échantillon chaque semaine. C'est la vérité terrain, qui calibre les deux autres. »
→ beat 4 : un cas concret du jeu doré, tiré du simulateur de l'atelier.
→ beat 5 : « Le ton est à 4 sur 5 : rien de grave, mais c'est le genre de signal qu'on suit dans le temps. »
→ beat 6 : « RAGAS pour les assistants documentaires, DeepEval et promptfoo pour automatiser les tests : vos équipes TI les adopteront vite. »

INTERACTION — « Qui, chez vous, pourrait valider les réponses du jeu doré ? » Faire ressortir le rôle des experts métier, pas seulement des TI.

TRANSITION — « Évaluer avant de déployer, c'est bien. Mais en production, il faut voir ce que l'agent fait vraiment. »`,
  `⏱ 4 min

OBJECTIF — Faire comprendre ce qu'est une trace et pourquoi la journalisation est à la fois un outil de qualité, de sécurité et de conformité.

DIRE — « Voici ce que voit l'équipe quand un courriel passe par l'agent. Chaque ligne est une étape : le modèle extrait la demande, l'outil consulte la commande, le modèle rédige, le garde-fou vérifie, puis l'outil envoie. Durée totale : 4,2 secondes, coût : environ un cent. »
→ beat 1 : « On peut ouvrir n'importe quelle étape. Ici, consulter_commande : ce qui est entré, ce qui est sorti, avec quels droits. Si un client conteste une réponse, c'est la preuve de ce que l'agent savait. Rappelez-vous Air Canada. »
→ beat 2 : « Ce qu'on journalise : les étapes, les outils, le coût, les versions, les escalades et la rétroaction des utilisateurs. Mais attention à la Loi 25 : un journal plein de renseignements personnels devient lui-même un risque. On masque, et on fixe une durée de conservation. »
→ beat 3 : « Côté outils, LangSmith, Langfuse ou Arize Phoenix. Et OpenTelemetry, la norme ouverte : en l'exigeant, vous évitez d'être prisonnier d'un fournisseur. »

INTERACTION — « Si l'agent de Boréal envoie une réponse fausse vendredi soir, combien de temps vous faudrait-il pour comprendre pourquoi ? » Avec des traces : quelques minutes.

TRANSITION — « Toutes ces traces alimentent un tableau de bord. Voyons à quoi il ressemble. »`,
];
// @@NOTES-END
