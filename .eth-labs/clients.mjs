// Client variants of the IA114 participant guide (APSM / Sobeys) — used by .eth-labs/guide.mjs.
// Same content as the deck's client-specific ateliers (.eth-build/30-a1, 60-a2, 80-a3) + the tools comparison.
// h = helpers from guide.mjs: { P, BOX, FIG, TOOLS }.

export const CLIENTS = {
  apsm: {
    id: 'apsm',
    name: 'APSM',
    full: 'Association paritaire pour la santé et la sécurité du travail du secteur minier',
    pour: 'l’Association paritaire pour la santé et la sécurité du travail du secteur minier (APSM)',
    fict: 'Fil rouge et cas de l’atelier 2 : fictifs',
    sector: 'Santé et sécurité du travail · secteur minier',
    session: 'Session du 1er décembre 2026 · six heures',
    caseKey: 'camionMine',
    caseFile: 'camion-mine',
  },
  sobeys: {
    id: 'sobeys',
    name: 'Sobeys',
    full: 'Sobeys inc.',
    pour: 'Sobeys inc.',
    fict: 'Fil rouge : organisation fictive',
    sector: 'Épicerie et commerce de détail',
    session: 'Deux matinées · 9 h – 12 h',
    caseKey: 'camerasMagasin',
    caseFile: 'cameras-magasin',
  },
};

// ─── Tools comparison (shared, but the APSM framing asks for it explicitly) ──
export const toolsCompare = (cl, h) => `
<section style="margin-top:16pt">
  <h3>Quel assistant gratuit choisir ? Avantages et limites</h3>
  <table class="tight">
    <tr><th style="width:17%">Outil</th><th>Points forts</th><th>Limites</th><th style="width:28%">À vérifier</th></tr>
    <tr><td><b>ChatGPT</b></td><td>Polyvalent : texte, images, voix, recherche Web</td><td>Peut inventer des sources ; quotas en version gratuite</td><td>Le réglage qui utilise vos échanges pour l’entraînement</td></tr>
    <tr><td><b>Copilot</b></td><td>Recherche Web avec sources citées ; compte Microsoft gratuit</td><td>Moins de réglages fins que les versions payantes</td><td>Version grand public ≠ Copilot d’entreprise protégé</td></tr>
    <tr><td><b>Gemini</b></td><td>Recherche Google, images, lien avec Gmail et Docs</td><td>Mêle parfois sources et suppositions</td><td>Des réviseurs humains peuvent lire des échanges (selon Google)</td></tr>
    <tr><td><b>Claude</b></td><td>Rédaction nuancée, longs documents, analyse</td><td>Ne crée pas d’images ; quota quotidien</td><td>Le choix d’entraînement sur vos conversations</td></tr>
    <tr><td><b>Le Chat (Mistral)</b></td><td>Société européenne, rapide, à l’aise en français</td><td>Écosystème plus restreint</td><td>Les conditions de la version gratuite</td></tr>
    <tr><td><b>Perplexity</b></td><td>Moteur de réponse : cite ses sources à chaque réponse</td><td>Moins à l’aise pour rédiger longuement</td><td>Une source citée reste à ouvrir et à lire</td></tr>
  </table>
  ${h.BOX('note', 'La règle, quel que soit l’outil', `Version gratuite = aucune donnée personnelle ni confidentielle. ${cl === 'apsm' ? 'Aucun outil sous licence d’entreprise n’étant choisi, tous les ateliers se font en version gratuite. ' : ''}Pour vérifier une information, préférez un outil qui cite ses sources… et ouvrez-les. Comparatif indicatif, novembre 2026 : les offres changent souvent.`)}
</section>`;

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
export const atelier1 = (cl, h) => {
  const apsm = cl === 'apsm';
  return `
<section class="np">
  <h2><span class="n y">A1</span>Atelier 1 · Explorer des outils d’IA</h2>
  <p class="lede">Votre mission : <b>prendre l’IA en flagrant délit</b>. Trois étapes minutées, chacun sur son poste, avec un outil gratuit. Livrable : trois constats notés dans votre document.</p>
  <table>
    <tr><th>Étape</th><th style="width:16%">Durée</th></tr>
    <tr><td>1 · Converser avec un agent conversationnel</td><td>8 min</td></tr>
    <tr><td>2 · ${apsm ? 'Vérifier, et comparer deux outils' : 'Le mettre à l’épreuve'}</td><td>10 min</td></tr>
    <tr><td>3 · Générer une image ou un texte</td><td>10 min</td></tr>
    <tr><td>Débriefing : deux ou trois volontaires partagent leur écran</td><td>8 min</td></tr>
  </table>

  <h3>Étape 1 · Converser (8 min)</h3>
  ${h.P(
    apsm
      ? 'Tu es l’assistant d’un coordonnateur en santé et sécurité du travail dans une mine souterraine au Québec. Rédige le message de sécurité de 5 lignes qu’il lira à la rencontre de début de quart, sur le risque de chute de roches lors de l’écaillage. Ton clair et direct.'
      : 'Tu es l’agent conversationnel du service à la clientèle d’une épicerie au Québec. Un client écrit : « J’ai acheté du poulet hier et la date était dépassée. Je veux être remboursé, je suis fâché. » Réponds-lui en 5 lignes au plus, sur un ton chaleureux.',
  )}
  <p>Puis relancez, une demande à la fois :</p>
  <ol>
    <li>${apsm ? '« Plus simple, pour un travailleur dont le français n’est pas la langue maternelle. »' : '« Plus simple, pour une personne qui lit difficilement le français. »'}</li>
    <li>${apsm ? 'Un travailleur demande : « Et si je vois une fissure et que mon superviseur n’est pas là ? »' : 'Le client répond : « Et je n’ai plus mon reçu. »'}</li>
    <li>« Traduis ta dernière réponse en anglais. »</li>
  </ol>
  ${h.BOX(
    'note',
    'À noter pour vous',
    apsm
      ? 'Le message est-il exact et applicable sous terre ? A-t-il inventé une règle, une distance, un article ? Pourrait-on le lire tel quel, sans validation d’une personne compétente ? (Réponse attendue : non.)'
      : 'Le ton est-il adapté au client ? A-t-il promis un remboursement, un bon d’achat, un délai ? Propose-t-il de parler à une personne ?',
  )}

  <h3>Étape 2 · ${apsm ? 'Vérifier, et comparer deux outils' : 'Le mettre à l’épreuve'} (10 min)</h3>
  ${h.P('Quelle est l’amende maximale prévue par la Loi 25 pour une entreprise ?', 'Test 1 · un fait vérifiable')}
  ${
    apsm
      ? h.P('Quel article du Règlement sur la santé et la sécurité du travail dans les mines encadre l’écaillage ? Cite le texte exact et le lien LégisQuébec.', 'Test 2 · une source réglementaire') +
        h.P('Posez la question du test 2 dans un deuxième outil gratuit (Copilot, Perplexity, Gemini…) et comparez les deux réponses.', 'Test 3 · deux outils, même question')
      : h.P('Cite trois études canadiennes sur l’IA dans les épiceries, avec leurs auteurs et leurs liens.', 'Test 2 · des sources') +
        h.P('Es-tu sûr ? Je crois que ta réponse est fausse.', 'Test 3 · la pression')
  }
  ${h.BOX(
    'note',
    'À noter pour vous',
    apsm
      ? 'Ce qui était exact. Ce qui était inventé ou impossible à vérifier : ouvrez LégisQuébec, l’article existe-t-il, dit-il cela ? Quel outil vous a donné une source que vous pouvez ouvrir ?'
      : 'Ce qui était exact. Ce qui était inventé ou impossible à vérifier (ouvrez les liens !). A-t-il changé d’avis sans nouvelle information ?',
  )}
</section>

<section style="margin-top:16pt">
  <h3 style="margin-top:0">Étape 3 · Générer une image ou un texte (10 min)</h3>
  <div class="grid2">
    <div class="card v"><h4>A · Une image</h4><span class="small muted">Copilot, ChatGPT, Gemini</span>
      ${
        apsm
          ? h.P('Crée une affiche de prévention : « un mineur qui porte correctement tous ses équipements de protection, en galerie souterraine ».', 'Demande 1') +
            h.P('Crée l’image d’une personne qui dirige une mine.', 'Demande 2') +
            h.P('Crée l’image d’une personne qui conduit un camion de mine.', 'Demande 3')
          : h.P('Crée une image publicitaire : « une famille qui fait son épicerie ».', 'Demande 1') +
            h.P('Crée l’image d’une personne qui dirige une chaîne d’épiceries.', 'Demande 2') +
            h.P('Crée l’image d’une personne qui place les produits en rayon, la nuit.', 'Demande 3')
      }
    </div>
    <div class="card t"><h4>B · Un texte</h4><span class="small muted">tous les outils</span>
      ${
        apsm
          ? h.P('Décris en trois lignes une personne qui travaille sous terre. Donne-lui un prénom.', 'Demande 1') +
            h.P('Même chose pour une personne ingénieure, puis une personne en prévention.', 'Demande 2')
          : h.P('Décris en trois lignes une personne qui est PDG. Donne-lui un prénom.', 'Demande 1') +
            h.P('Même chose pour une personne caissière, puis une personne bouchère.', 'Demande 2')
      }
    </div>
  </div>
  ${h.BOX(
    'note',
    apsm ? 'Vérifiez, puis observez' : 'Observez qui apparaît',
    apsm
      ? 'Les équipements de protection sont-ils corrects et complets ? Le texte de l’affiche est-il lisible et juste ? Qui est représenté, qui n’apparaît jamais ? Une affiche avec un mauvais équipement enseigne la mauvaise pratique.'
      : 'Âge, genre, origine, handicap : qui est représenté ? Qui n’apparaît jamais ? Que se passe-t-il si vous demandez plus de diversité ?',
  )}

  <h3>Votre grille d’observation</h3>
  <table>
    <tr><th style="width:20%">Étape</th><th>Ce qui a bien marché</th><th>Ce qui a dérapé</th></tr>
    <tr><td>1 · Converser</td><td class="blank"></td><td class="blank"></td></tr>
    <tr><td>2 · ${apsm ? 'Vérifier' : 'Épreuve'}</td><td class="blank"></td><td class="blank"></td></tr>
    <tr><td>3 · Générer</td><td class="blank"></td><td class="blank"></td></tr>
  </table>
  <h3>Mes trois constats (livrable)</h3>
  <div class="line"></div><div class="line"></div><div class="line"></div>
  <h3>Débriefing</h3>
  <ol>
    <li>Qu’est-ce qui vous a surpris, en bien comme en mal ?</li>
    <li>L’avez-vous pris en défaut : ${apsm ? 'article inventé, fausse source, deux outils qui se contredisent' : 'fait inventé, fausse source, changement d’avis'} ?</li>
    <li>${apsm ? 'Vos images étaient-elles justes : équipements, texte, personnes représentées ?' : 'Qui était sur vos images ? Et qui n’y était pas ?'}</li>
  </ol>
</section>`;
};

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
export const atelier2 = (cl, h) => {
  const apsm = cl === 'apsm';
  const c = CLIENTS[cl];
  return `
<section class="np">
  <h2><span class="n y">A2</span>Atelier 2 · Étude de cas éthique</h2>
  <p class="lede">${
    apsm
      ? 'Un cas construit pour le secteur minier : une mine fictive, des systèmes bien réels. Vous l’analysez seul, puis vous dites comment vous auriez agi. Débat ensuite avec deux ou trois volontaires.'
      : 'Un cas réel, documenté par la Federal Trade Commission américaine (FTC). Vous l’analysez seul, puis vous dites comment vous auriez agi. Débat ensuite avec deux ou trois volontaires.'
  }</p>
  <div class="row">
    <div style="flex:1.2">
      <h3 style="margin-top:0">${apsm ? 'Le cas : des caméras de fatigue à la mine Val-Laurier (fictive)' : 'Le cas : la reconnaissance faciale chez Rite Aid'}</h3>
      <ul>${
        apsm
          ? `
        <li>La mine Val-Laurier (Abitibi) fait rouler <b>40 camions de minerai</b>, sous terre et en surface, jour et nuit.</li>
        <li>Après deux quasi-accidents liés à la somnolence, la fatigue devient une <b>priorité de prévention</b>.</li>
        <li>Une <b>caméra d’IA</b> dans chaque cabine analyse le visage du conducteur (yeux, bâillements, regard) : alerte sonore et signalement au superviseur.</li>
        <li>Le fournisseur garde les vidéos <b>sur son infonuagique, hors du Québec</b>, et calcule un « score de vigilance » par travailleur.</li>
        <li>Les conducteurs sont informés par une <b>note de service, la veille</b>.</li>
        <li>Un conducteur atteint d’une affection des paupières déclenche des <b>alertes à répétition</b>, et se fait retirer du volant.</li>
        <li>La direction propose d’utiliser le score pour les <b>évaluations</b> et l’attribution des quarts de nuit.</li>
        <li>Le syndicat demande à voir les données ; le <b>comité de santé et de sécurité</b> n’a pas été consulté.</li>`
          : `
        <li>Pour réduire le vol à l’étalage, la chaîne de pharmacies américaine <b>Rite Aid</b> utilise, de 2012 à 2020, la <b>reconnaissance faciale</b> dans des centaines de magasins.</li>
        <li>Le système compare chaque visage à une liste de personnes « à surveiller », souvent tirée d’<b>images de caméras floues</b>.</li>
        <li>Une correspondance déclenche une <b>alerte sur le téléphone</b> des employés.</li>
        <li>Résultat : des <b>milliers de fausses correspondances</b>, parfois avec des personnes jamais venues dans le magasin.</li>
        <li>Des clients sont <b>suivis, fouillés, expulsés</b>, parfois signalés à la police.</li>
        <li>Selon la FTC, les fausses alertes sont plus fréquentes dans les magasins de <b>quartiers à majorité noire ou asiatique</b>.</li>
        <li>Les clients <b>ne sont pas informés</b> que leur visage est analysé.</li>`
      }
      </ul>
    </div>
    <div style="flex:.8">${h.FIG(c.caseKey, '48mm', apsm ? 'Camion de minerai, mine souterraine' : 'Écran de surveillance en magasin')}
      ${h.BOX('tip', apsm ? 'Pourquoi ce cas ?' : 'Ça vous rappelle…', apsm ? 'Ces systèmes protègent réellement des vies. La question n’est pas de les refuser, mais de les encadrer : prévention ou surveillance ?' : 'Les caméras, la carte de fidélité, les offres ciblées : le commerce de détail regorge de données sur ses clients.')}
    </div>
  </div>
  <h3>Étape 1 · Analysez le cas avec les six principes (10 min)</h3>
  <table>
    <tr><th style="width:22%">Principe</th><th style="width:34%">Question</th><th>Ce qui a manqué (une phrase)</th></tr>
    ${(apsm
      ? [
          ['Équité', 'Qui subit les fausses alertes : lunettes, affection, éclairage ?'],
          ['Transparence', 'Les conducteurs savaient-ils ce qui était mesuré et gardé ?'],
          ['Vie privée', 'Un visage filmé : renseignement biométrique, sensible. Nécessaire ?'],
          ['Fiabilité', 'Que vaut une alerte de fatigue ? A‑t‑on mesuré les erreurs ?'],
          ['Contrôle humain', 'Après une alerte, qui décide : la machine ou le superviseur ?'],
          ['Responsabilité', 'Qui répond du système : la mine, le fournisseur, le comité ?'],
        ]
      : [
          ['Équité', 'Qui a subi les fausses alertes, et pourquoi eux ?'],
          ['Transparence', 'Les clients savaient-ils qu’on analysait leur visage ?'],
          ['Vie privée', 'Le visage est biométrique, sensible. Le but justifiait-il ce moyen ?'],
          ['Fiabilité', 'Images floues, erreurs non suivies : qui l’a testé ?'],
          ['Contrôle humain', 'Les employés vérifiaient-ils l’alerte, ou agissaient-ils dessus ?'],
          ['Responsabilité', 'Qui répond : la chaîne, le fournisseur, l’employé ?'],
        ]
    )
      .map(([p, q]) => `<tr><td><b>${p}</b></td><td>${q}</td><td class="blank"></td></tr>`)
      .join('\n    ')}
  </table>
</section>

<section style="margin-top:16pt">
  <h3 style="margin-top:0">Étape 2 · Comment auriez-vous agi ? (7 min)</h3>
  <p>Choisissez <b>un</b> rôle, puis écrivez trois décisions que vous auriez prises.</p>
  <div class="grid2">${
    apsm
      ? `
    <div class="card t"><h4>1 · Le fournisseur du système</h4>Vous vendez l’outil et vous entraînez le modèle.</div>
    <div class="card b"><h4>2 · Le superviseur de quart</h4>Vous recevez les alertes en temps réel, en pleine production.</div>
    <div class="card v"><h4>3 · Le comité de santé et de sécurité</h4>Paritaire, il n’a pas été consulté avant l’installation.</div>
    <div class="card c"><h4>4 · La direction de la mine</h4>Vous devez réduire les accidents… et tenir les coûts.</div>`
      : `
    <div class="card t"><h4>1 · Le fournisseur du logiciel</h4>Vous vendez la reconnaissance faciale et vous fixez le seuil d’alerte.</div>
    <div class="card b"><h4>2 · La gérante du magasin</h4>Vous recevez les alertes sur votre téléphone, en pleine affluence.</div>
    <div class="card v"><h4>3 · Le responsable de la vie privée</h4>Vous êtes consulté… quand on pense à vous consulter.</div>
    <div class="card c"><h4>4 · La direction de la prévention des pertes</h4>Vous devez réduire les vols, magasin par magasin.</div>`
  }
  </div>
  <table>
    <tr><th style="width:30%">Mon rôle : ……</th><th>Ma décision</th></tr>
    <tr><td>Ce que j’aurais <b>vérifié</b></td><td class="blank2"></td></tr>
    <tr><td>Ce que j’aurais <b>refusé</b></td><td class="blank2"></td></tr>
    <tr><td>Ce que j’aurais <b>changé</b> dans le processus</td><td class="blank2"></td></tr>
  </table>
  <h3>Débat (10 min)</h3>
  <ol>
    <li>Deux ou trois volontaires présentent leur rôle et leurs décisions, deux minutes chacun.</li>
    <li>D’accord ? Pas d’accord ? Une réaction au micro, en une phrase.</li>
    <li>Qu’est-ce qui vous aurait arrêté, en vrai ? Peur, hiérarchie, objectifs chiffrés, manque d’information…</li>
  </ol>
  ${
    apsm
      ? h.BOX(
          'note',
          'À lire après le débat · les repères pour décider',
          '<b>Loi 25 :</b> les images du visage sont des renseignements biométriques, donc sensibles : consentement exprès et évaluation des facteurs relatifs à la vie privée (EFVP) avant le déploiement. Si le système sert aussi à vérifier ou confirmer l’identité, la Loi concernant le cadre juridique des technologies de l’information exige une déclaration préalable à la CAI.<br><b>Hors du Québec :</b> envoyer les vidéos ailleurs exige d’évaluer la protection offerte (art. 17 de la loi sur le secteur privé).<br><b>Autre usage :</b> utiliser un score de sécurité pour évaluer le rendement est une autre finalité, qui exige en principe un nouveau consentement.<br><b>Prévention paritaire :</b> la Loi sur la santé et la sécurité du travail associe les travailleurs à la prévention ; le comité de santé et de sécurité doit être dans la boucle.<br><b>La leçon :</b> un bon outil de prévention peut devenir un outil de surveillance. La différence : une seule finalité annoncée, le comité consulté, un humain qui décide.<br><span class="small muted">Repères, pas avis juridique : pour un vrai projet, la personne responsable de la protection des renseignements personnels et un conseiller juridique.</span>',
        )
      : h.BOX(
          'note',
          'À lire après le débat · la suite de l’histoire',
          '<b>2012 – 2020 :</b> le système fonctionne dans des centaines de magasins, sans test sérieux de ses erreurs. <b>Juillet 2020 :</b> une enquête de Reuters révèle le système ; Rite Aid dit l’avoir abandonné. <b>2023, Canada :</b> en Colombie-Britannique, le commissaire à la protection de la vie privée conclut que des magasins Canadian Tire ont utilisé la reconnaissance faciale sans consentement adéquat. <b>Décembre 2023 :</b> la FTC interdit à Rite Aid d’utiliser la reconnaissance faciale pendant cinq ans.<br><b>La leçon :</b> sans test, sans transparence et sans contrôle humain, des clients deviennent des suspects. Au Québec, la biométrie exige en plus un consentement exprès et une déclaration préalable à la CAI.',
        )
  }
  ${h.BOX(
    'ok',
    apsm ? 'Et chez vous ? Trois garde-fous pour une caméra de fatigue' : 'Et chez vous ? Trois garde-fous avant toute caméra intelligente',
    apsm
      ? '1) Une seule finalité : la prévention, jamais l’évaluation ni la discipline sans nouveau consentement. 2) Un humain qui tranche : une alerte ouvre une discussion, pas une sanction ; les fausses alertes sont suivies. 3) Le comité dans la boucle : consulté avant l’achat, EFVP faite, données agrégées partagées, conservation limitée.'
      : '1) Prouver la nécessité : une EFVP, et la question : un moyen moins intrusif suffirait-il ? 2) Informer et consentir : affichage clair, consentement exprès pour la biométrie, déclaration préalable à la CAI. 3) Tester, puis vérifier : taux d’erreur mesurés par groupe ; aucune intervention sur une alerte qu’une personne n’a pas vérifiée.',
  )}
</section>`;
};

// ─── Atelier 3 (only the client-specific parts change) ──────────────────────
export const atelier3 = (cl, h) => {
  const apsm = cl === 'apsm';
  return `
<section class="np">
  <h2><span class="n y">A3</span>Atelier 3 · Votre mini-charte éthique IA</h2>
  <p class="lede">Une page, cinq rubriques, des règles vérifiables. ${apsm ? 'Pour la mine Val-Laurier de l’atelier 2, ou pour votre organisation' : 'Pour une épicerie comme la vôtre, ou pour votre service'}, sans détail confidentiel. <b>Le test de chaque phrase :</b> peut-on vérifier si elle est respectée ? Si non, réécrivez-la.</p>
  <table>
    <tr><th>Étape</th><th style="width:16%">Durée</th></tr>
    <tr><td>1 · Vos principes, avec vos mots (3 à 5, « chez nous, cela veut dire que… »)</td><td>8 min</td></tr>
    <tr><td>2 · Vos règles d’usage (3 permis, 3 interdits, 2 sur accord) et vos données (feu tricolore)</td><td>10 min</td></tr>
    <tr><td>3 · Vos rôles et votre suivi</td><td>7 min</td></tr>
    <tr><td>4 · La critique de l’IA</td><td>5 min</td></tr>
    <tr><td>Présentations de deux ou trois volontaires et rétroaction croisée</td><td>11 min</td></tr>
  </table>
  <div class="grid2">
    <div class="box warn" style="margin:0"><span class="t">Trop vague</span>« Nous valorisons la transparence. »</div>
    <div class="box ok" style="margin:0"><span class="t">Vérifiable</span>${apsm ? '« Une alerte de l’IA n’entraîne jamais de sanction : une personne vérifie, puis échange avec le travailleur. »' : '« Un client sait toujours, dès le premier message, qu’il échange avec une IA. »'}</div>
  </div>
  <h3>Étape 2 · Des exemples de règles</h3>
  <table class="tight">
    <tr><th style="background:#3A9F45">Permis</th><th style="background:#E0573D">Interdit</th><th style="background:#E8A600">Sur accord</th></tr>
    <tr><td>${apsm ? 'Premier jet d’une fiche de prévention, résumé d’un rapport anonymisé, traduction d’une consigne.' : 'Description de produit, résumé d’un document public, premier jet d’un courriel.'}</td><td>${
      apsm ? 'Diffuser une consigne de sécurité non validée, décider d’une sanction, coller un rapport d’accident nominatif.' : 'Coller des données de clients ou d’employés, décider seul d’un refus, reconnaître un client à son visage.'
    }</td><td>${apsm ? 'Tout outil qui capte l’image, la voix ou des données biométriques des travailleurs, avec le comité de santé et de sécurité.' : 'Toute offre personnalisée fondée sur un profil (profilage annoncé, désactivé par défaut), tout nouvel outil.'}</td></tr>
  </table>
  <h3>Étape 3 · Les questions à trancher</h3>
  <ol>
    <li><b>Qui approuve</b> un nouveau projet ou un nouvel outil d’IA ?${apsm ? ' Le comité de santé et de sécurité est-il consulté ?' : ''}</li>
    <li><b>Qui répond</b> de chaque système en service ?</li>
    <li><b>À qui signaler</b> un doute ou un incident, sans crainte de reproche ?</li>
    <li><b>Quel indicateur</b> suivre : incidents, plaintes, ${apsm ? 'fausses alertes,' : ''} décisions révisées après contestation ?</li>
    <li><b>Quand</b> réviser la charte ?</li>
  </ol>
  <h3>Étape 4 · La critique de l’IA</h3>
  ${h.P('Voici une mini-charte éthique IA. Joue le rôle d’un auditeur exigeant. 1) Quelles règles sont impossibles à vérifier ? 2) Que manque-t-il au regard de la Loi 25 du Québec ? 3) Quelle règle risque d’être contournée ? Réponds en cinq points courts. [collez votre charte]')}
  ${h.BOX('warn', 'Avant de coller', 'Aucun nom de personne ni détail confidentiel : des fonctions, pas des prénoms. Et gardez l’esprit critique : l’IA peut se tromper sur la Loi 25.')}
  <h3>Grille de rétroaction croisée</h3>
  <ul class="check" style="columns:2;column-gap:18pt">
    <li>Les règles sont-elles vérifiables ?</li>
    <li>Des responsables sont-ils nommés ?</li>
    <li>Les données sensibles sont-elles protégées ?</li>
    <li>Un humain peut-il réviser une décision ?</li>
    <li>La charte a-t-elle une date de révision ?</li>
  </ul>
</section>`;
};
