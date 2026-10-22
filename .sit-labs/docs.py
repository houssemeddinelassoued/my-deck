# Livret des labs (A4 portrait) et mémo participant (A4 paysage), en HTML pour impression PDF.
# Contenu aligné sur le deck slides/ia-support-infrastructure.

COURSE = 'Support & infrastructure IT : boostez vos performances grâce à l’IA'
AUTHOR = 'Houssem Eddine LASSOUED'

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">'

BASE_CSS = '''
:root{--ink:#101828;--soft:#3B4558;--muted:#6B7690;--rule:#DDE3EE;--panel:#EBEFF7;--navy:#0B1F5C;--electric:#1E22E8;--blue:#0A62D0;--violet:#7442E0;--green:#0E9F6E;--coral:#E04848;--yellow:#F2A20C;--teal:#0E9AAE}
*{box-sizing:border-box}
body{margin:0;font-family:"Open Sans","Segoe UI",Arial,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,h4,.d{font-family:"Montserrat","Segoe UI",Arial,sans-serif}
.mono{font-family:"JetBrains Mono",Consolas,monospace}
.tag{display:inline-block;padding:1mm 3mm;border-radius:10mm;font:700 8pt "Montserrat",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}
.prompt{background:#F4F6FB;border-left:2.5pt solid var(--navy);border-radius:1.5mm;padding:2.4mm 3.2mm;font-size:9.8pt;line-height:1.45;font-style:italic;color:var(--ink)}
.chip{display:inline-block;font:8.5pt "JetBrains Mono",Consolas,monospace;background:#E7EBF5;color:var(--navy);padding:.4mm 2mm;border-radius:1.2mm;margin:0 1mm .8mm 0}
'''


def esc(s):
    return s


# ─── Livret des labs ─────────────────────────────────────────────────────────
LABS = [
    dict(code='Atelier 1', mod='M1 · Panorama', kind='atelier', title='Même tâche, deux outils', dur='20 min', who='En binôme · un poste par outil',
         obj='Résumer le journal de l’incident FS-02 pour le directeur logistique, une fois avec Copilot, une fois avec Claude, avec exactement le même prompt, puis comparer les deux résultats sur une grille commune.',
         files=['journal-incident-FS02.docx'],
         steps=[
             ('Répartissez-vous les outils', 'Une personne travaille dans Copilot (Copilot Chat ou Microsoft 365 Copilot), l’autre dans Claude. Joignez le journal d’incident dans chaque outil.'),
             ('Envoyez le même prompt', 'Copiez-le mot pour mot dans les deux outils :', 'Résume ce journal d’incident en dix lignes pour le directeur logistique : ce qui s’est passé, l’impact, la durée, ce qui est fait pour que ça ne recommence pas. Pas de jargon technique.'),
             ('Vérifiez chaque chiffre', 'Heure de début, durée (2 h 39), nombre de personnes bloquées, bons de préparation retardés : tout doit être dans le journal.'),
             ('Notez les deux résultats', 'Sur 5, pour chaque critère : fidélité au journal, clarté pour le lecteur, respect du format, rapidité, facilité d’accès.'),
             ('Préparez la restitution', 'Une différence marquante entre les deux outils, et une phrase : « Sur cette tâche, nous choisirions… parce que… ».'),
         ],
         crit=['Même prompt, mot pour mot, dans les deux outils', 'Chaque chiffre vérifié dans le journal', 'Une note lisible par un non-technicien'],
         bonus='Demandez ensuite à chaque outil : « Qu’as-tu laissé de côté, et pourquoi ? » Comparez les réponses.'),
    dict(code='Lab 2.1', mod='M2 · Bien formuler', kind='lab', title='La communication d’incident', dur='15 min', who='Individuel · relecture en binôme',
         obj='Rédiger, à partir du journal, deux messages sur l’incident FS-02 : un pour les utilisateurs des entrepôts, un pour la direction logistique. Puis ranger le prompt dans une fiche de la bibliothèque.',
         files=['journal-incident-FS02.docx'],
         steps=[
             ('Écrivez le contexte une seule fois', 'Rôle, faits (heure, service, impact, retour visé), lecteurs.'),
             ('Message aux entrepôts', 'Les cinq ingrédients :', 'Tu es chargé de la communication du support d’Orvalis. FS-02 est indisponible depuis 7 h 52 ; 340 personnes des entrepôts ne peuvent plus ouvrir les bons de préparation ; retour visé vers 10 h 30. Rédige le message aux utilisateurs : un objet et cinq lignes, sans jargon, avec une ligne « Que faire en attendant ? ».'),
             ('Message à la direction', 'Relancez dans la même conversation : la direction veut savoir combien de commandes sont retardées, pendant combien de temps, et quel est le risque que ça recommence.'),
             ('Relisez en binôme', 'Heure, impact, retour visé : exacts ? Zéro jargon dans le message aux entrepôts ?'),
             ('Rangez la fiche', 'Nom, quand l’utiliser, prompt avec [variables], outil, auteur, date.'),
         ],
         crit=['Les cinq ingrédients présents', 'Heure, impact et retour visé exacts', 'Zéro jargon dans le message utilisateurs'],
         bonus='Faites rédiger le message de fin d’incident, envoyé à 10 h 40, puis comparez le ton avec le premier.'),
    dict(code='Lab 2.2', mod='M2 · Bien formuler', kind='lab', title='La réponse type à une demande récurrente', dur='15 min', who='En binôme',
         obj='Créer la réponse type d’Inès pour « Je n’ai plus accès au dossier partagé » : une fiche réutilisable, avec des variables entre crochets, testée sur deux tickets réels du fichier.',
         files=['tickets-recurrents.xlsx'],
         steps=[
             ('Faites poser les questions', 'Commencez par :', 'Je dois écrire une réponse type pour les tickets « Je n’ai plus accès au dossier partagé ». Avant de rédiger, pose-moi les questions dont tu as besoin.'),
             ('Répondez, puis demandez la réponse type', 'Elle explique la cause probable, la vérification à faire par l’utilisateur et le délai de traitement. Variables entre crochets : [prénom], [dossier], [délai].'),
             ('Testez sur deux tickets', 'Choisissez deux messages différents dans le fichier : la réponse type convient-elle aux deux ?'),
             ('Corrigez et rangez', 'Ajustez la fiche, puis rangez-la dans la bibliothèque de l’équipe.'),
         ],
         crit=['Variables entre crochets, faciles à remplir', 'Testée sur deux tickets différents', 'Fiche complète : quand, prompt, outil, auteur'],
         bonus='Même exercice pour « nouveau téléphone : je ne reçois plus la notification d’authentification ».'),
    dict(code='Lab 3.1', mod='M3 · Rédiger, synthétiser', kind='lab', title='40 pages, une note d’une page', dur='20 min', who='Individuel',
         obj='Réduire le rapport d’audit de l’infrastructure en une note d’une page pour le DSI, avec la méthode des trois passes, puis vérifier la note.',
         files=['rapport-audit-infra-2026.pdf'],
         steps=[
             ('Passe 1 · la carte', '', 'Donne-moi le plan du rapport et, pour chaque partie, ce qu’elle couvre en une ligne.'),
             ('Passe 2 · l’essentiel', '', 'Quels sont les cinq constats majeurs ? Pour chacun : le niveau de risque et la page.'),
             ('Passe 3 · la décision', '', 'Rédige une note d’une page pour le DSI : constats classés par risque, trois actions prioritaires, décision attendue.'),
             ('Vérifiez', 'Allez lire la page de chaque constat. Contrôlez trois chiffres au hasard dans le PDF. Demandez : « Qu’as-tu laissé de côté ? »'),
         ],
         crit=['Trois passes : carte, essentiel, décision', 'Une page source par constat', 'Trois chiffres vérifiés dans le PDF'],
         bonus='Faites relire votre note par l’autre outil : « Trouve les erreurs et les oublis par rapport au rapport. »'),
    dict(code='Lab 3.2', mod='M3 · Rédiger, synthétiser', kind='lab', title='Du ticket résolu à l’article', dur='15 min', who='En binôme',
         obj='Transformer deux tickets résolus en articles de base de connaissances : symptôme, cause, solution, prévention, mots-clés.',
         files=['tickets-resolus.xlsx', 'base-connaissances/ (exemples)'],
         steps=[
             ('Choisissez deux tickets', 'Le n° 48213 (imprimante d’étiquettes) et un autre au choix.'),
             ('Demandez l’article', 'Collez les notes du technicien :', 'Transforme ces notes en article de base de connaissances : titre décrivant le symptôme avec les mots de l’utilisateur, puis symptôme, cause, solution en étapes, prévention, mots-clés. Retire toute donnée personnelle.'),
             ('Vérifiez', 'Aucun nom, téléphone ou poste de la personne. Étapes testables par un utilisateur.'),
             ('Complétez', '« Quelles questions un utilisateur se poserait-il encore après avoir lu cet article ? »'),
         ],
         crit=['Titre écrit avec les mots de l’utilisateur', 'Étapes de solution testables', 'Aucune donnée personnelle reprise du ticket'],
         bonus='Générez une version courte pour la réponse au ticket, et une version longue pour la base.'),
    dict(code='Atelier 4', mod='M4 · Sécurité', kind='atelier', title='Auditer une procédure générée par l’IA', dur='20 min', who='Par groupes de trois',
         obj='Une IA a rédigé la procédure de purge des journaux de FS-02. Elle a l’air parfaite. Trouvez les six erreurs avant qu’elle soit publiée.',
         files=['procedure-purge-IA.docx'],
         steps=[
             ('Lisez ligne par ligne', 'Cherchez quatre types de problèmes : droits trop larges, commandes dangereuses, étapes manquantes, données sensibles.'),
             ('Listez les erreurs', 'Pour chacune : la ligne, le problème, la correction, la règle de la charte associée.'),
             ('Faites relire l’IA', '', 'Relis cette procédure comme un administrateur prudent. Liste les erreurs de sécurité et les étapes manquantes.'),
             ('Comparez', 'L’IA a-t-elle trouvé les mêmes erreurs que vous ? Lesquelles a-t-elle manquées, et pourquoi ?'),
         ],
         crit=['Au moins cinq erreurs trouvées sur six', 'Une correction proposée pour chacune', 'Une règle de la charte associée à chacune'],
         bonus='Réécrivez la procédure corrigée avec l’IA, en lui donnant votre liste d’erreurs.'),
    dict(code='Mission', mod='Intersession', kind='atelier', title='Votre tâche réelle, avant le jour 2', dur='30 à 60 min', who='Individuel',
         obj='Traiter avec Copilot ou Claude une tâche réelle qui vous prend du temps, et la présenter en trois minutes au début du jour 2.',
         files=['Vos propres documents (sans donnée sensible)'],
         steps=[
             ('Choisissez la tâche', 'Un rapport à lire, un e-mail difficile, une procédure à rafraîchir, un tableau Excel à commenter, une réunion à préparer.'),
             ('Traitez-la', 'Cinq ingrédients, le bon contexte, deux relances avant de réécrire.'),
             ('Notez quatre choses', 'La tâche et sa fréquence · le prompt final · le résultat (bon, corrigé) · minutes avant et après.'),
             ('Respectez le feu tricolore', 'Pas de secret, pas de données RH, journaux anonymisés. Outil professionnel uniquement.'),
         ],
         crit=['Une tâche réelle et fréquente', 'Un prompt final noté', 'Un temps gagné mesuré honnêtement'],
         bonus='Essayez la même tâche dans les deux outils et notez lequel vous garderiez.'),
    dict(code='Lab 6.1', mod='M6 · Analyser', kind='lab', title='Le reporting mensuel commenté', dur='22 min', who='Individuel · Copilot dans Excel ou Claude',
         obj='Produire le reporting de septembre d’Orvalis : les cinq indicateurs, la comparaison avec août, un graphique et un commentaire de dix lignes qui explique les écarts.',
         files=['export-tickets-sept.xlsx', 'export-tickets-aout.xlsx', 'Reporting/definitions-indicateurs.docx', 'Reporting/objectifs-SLA-2026.xlsx'],
         steps=[
             ('Qualité des données', '', 'Liste les problèmes de qualité de ce tableau et propose les corrections, sans rien modifier.'),
             ('Donnez vos définitions', 'Joignez les définitions et les objectifs :', 'Voici nos définitions et nos objectifs. Calcule chaque indicateur pour septembre et pour août, et montre-moi le calcul.'),
             ('Les écarts', '', 'Repère les trois plus forts écarts entre août et septembre et propose une hypothèse pour chacun.'),
             ('Les quatre contrôles', 'Total = nombre de lignes · un sous-total refait à la main · la méthode visible · chaque mot du commentaire prouvé par un chiffre.'),
         ],
         crit=['Les définitions données à l’IA', 'Les quatre contrôles faits', 'Chaque mot du commentaire prouvé'],
         bonus='Demandez un tableau de bord d’une page au format Excel, prêt à être réutilisé le mois prochain.'),
    dict(code='Lab 6.2', mod='M6 · Analyser', kind='lab', title='Le post-mortem de l’incident FS-02', dur='22 min', who='Par groupes de trois',
         obj='Reconstituer la chronologie, trouver la cause racine avec les 5 pourquoi, puis rédiger le post-mortem sans blâme et son plan d’actions.',
         files=['journal-incident-FS02.docx', 'alertes-supervision.csv'],
         steps=[
             ('La chronologie', 'Joignez les deux fichiers :', 'Reconstitue la chronologie complète de l’incident FS-02, du premier signal au retour à la normale. Indique la source de chaque événement.'),
             ('Les 5 pourquoi', 'Un membre joue « l’équipe qui sait », l’IA anime :', 'Anime un 5 pourquoi sur cet incident. Pose-moi une question à la fois et ne propose pas la réponse.'),
             ('Le post-mortem', 'Le troisième membre rédige :', 'Rédige le post-mortem sans blâme selon ces parties : résumé, impact, chronologie, causes, ce qui a bien marché, actions. Aucun nom de personne : des rôles.'),
             ('Relisez', 'Quelqu’un pourrait-il s’y sentir accusé ? Chaque action a-t-elle un responsable et une échéance ?'),
         ],
         crit=['Une chronologie qui commence avant lundi', 'Une cause racine qui n’est pas une personne', 'Des actions avec responsable et échéance'],
         bonus='Demandez les trois signaux faibles qui auraient permis de détecter l’incident avant lundi.'),
    dict(code='Lab 7.1', mod='M7 · Automatiser', kind='lab', title='L’agent « assistant support »', dur='20 min', who='En binôme · au choix avec le lab 7.2',
         obj='Créer l’agent qui répond aux questions courantes des entrepôts uniquement à partir de la base de connaissances d’Orvalis, et vérifier qu’il sait dire non.',
         files=['base-connaissances/ (8 articles)', 'vos articles du lab 3.2'],
         steps=[
             ('Créez l’agent', 'Dans Microsoft 365 Copilot (créer un agent) ou, à défaut, dans un projet Claude. Nom : Assistant support Orvalis.'),
             ('Instructions', '', 'Aide les salariés à résoudre les problèmes informatiques courants. Réponds uniquement à partir des articles fournis. Si la réponse n’y est pas, dis-le et propose d’ouvrir un ticket au 4400. Ne demande jamais de mot de passe. Cinq étapes au maximum.'),
             ('Connaissances et suggestions', 'Ajoutez les articles. Deux suggestions de démarrage : « Mon imprimante n’imprime plus », « Je n’ai plus accès au dossier partagé ».'),
             ('Testez', 'Cinq questions réelles, puis deux pièges : une question hors sujet, une demande de réinitialisation du mot de passe d’un collègue.'),
         ],
         crit=['Il cite l’article source', 'Il dit « je ne sais pas » hors de ses sources', 'Il refuse les deux questions pièges'],
         bonus='Demandez à l’IA de générer vingt questions de test réalistes, puis passez-les à l’agent.'),
    dict(code='Lab 7.2', mod='M7 · Automatiser', kind='lab', title='Le flux de reporting automatique', dur='20 min', who='En binôme · au choix avec le lab 7.1',
         obj='Construire le flux du lundi : export → résumé IA → approbation → publication, décrit en français puis relu étape par étape.',
         files=['Reporting/ (définitions, objectifs, modèle)', 'export-tickets-sept.xlsx'],
         steps=[
             ('Décrivez le flux', 'Dans Power Automate, avec Copilot :', 'Chaque lundi à 8 h, récupère l’export des tickets déposé dans SharePoint, demande à l’IA un résumé des indicateurs, envoie-le à Claire pour approbation, puis publie-le dans le canal Teams « Direction ».'),
             ('Relisez chaque étape', 'Déclencheur, fichier, étape IA, approbation, action : bon dossier ? bon canal ? bons destinataires ?'),
             ('Testez une fois', 'Avec l’export de septembre. Vérifiez le résumé produit avec les quatre contrôles.'),
             ('Rangez le prompt', 'Le prompt de l’étape IA rejoint la bibliothèque, avec sa fiche.'),
         ],
         crit=['Une étape d’approbation humaine', 'Testé une fois, résultat vérifié', 'Le prompt de l’étape IA dans la bibliothèque'],
         bonus='Ajoutez une condition : si le respect des SLA passe sous 90 %, une alerte part aussi au responsable support. Sans Power Automate : dessinez le flux et faites tourner l’étape IA dans un projet Claude.'),
    dict(code='Lab 7.3', mod='M7 · Automatiser', kind='lab', title='Votre premier script en vibe coding', dur='25 min', who='Individuel · relecture croisée',
         obj='Faire écrire, expliquer et tester un script d’inventaire en lecture seule : l’espace libre des disques des serveurs de test (ou de votre poste).',
         files=['serveurs-test.txt', 'exports-entrepots/ (bonus macro)'],
         steps=[
             ('Écrivez le prompt en six ingrédients', '', 'Objectif : je veux l’espace libre de tous les disques des serveurs listés. Environnement : Windows, PowerShell 5.1, mon compte habituel. Entrée : serveurs.txt, un nom par ligne. Sortie : un CSV pour Excel (séparateur ;) trié du plus plein au moins plein. Sécurité : uniquement de la lecture. Pédagogie : je ne sais pas programmer, commente chaque ligne en français et explique comment le lancer.'),
             ('Faites expliquer', '« Explique-moi chaque ligne en français simple. » Puis expliquez-la vous-même à votre voisin.'),
             ('Vérifiez', '« Ce script modifie-t-il quelque chose ? » Repérez les verbes Remove, Set, Stop, Disable, Format, Move.'),
             ('Testez, corrigez', 'Lancez-le sur serveurs-test.txt. En cas d’erreur rouge, collez le message à l’IA : « Explique simplement et corrige. »'),
         ],
         crit=['Le prompt contient les six ingrédients', 'Chaque ligne expliquée à votre voisin', 'Aucun verbe qui modifie, vérifié'],
         bonus='Faites écrire la macro Excel qui consolide les neuf fichiers de exports-entrepots/ dans un seul onglet, et testez-la.'),
    dict(code='Atelier 7', mod='M7 · Automatiser', kind='atelier', title='Votre tâche, automatisée avant ce soir', dur='20 min', who='En binôme · une tâche apportée par chacun',
         obj='Chacun apporte une tâche qui revient chaque semaine. Le binôme choisit la bonne marche de l’échelle et la construit pour l’une des deux.',
         files=['Vos propres fichiers (règles du module 4)'],
         steps=[
             ('Score de la tâche', 'Fréquente · plus de dix minutes · règles stables · données numériques · erreur sans gravité. Score sur 5.'),
             ('Choisissez la marche', 'Prompt enregistré, modèle ou projet, agent, flux, script : la plus basse qui suffit.'),
             ('Construisez et testez', 'Une version qui marche sur un cas réel.'),
             ('Cochez les garde-fous', 'Les huit cases avant la production, puis une minute de démonstration au groupe.'),
         ],
         crit=['Score de la tâche calculé', 'La marche la plus basse qui suffit', 'Les garde-fous cochés'],
         bonus='Estimez le temps gagné par mois et ajoutez-le au compteur de l’équipe.'),
    dict(code='Plan', mod='M8 · Synthèse', kind='atelier', title='Votre plan d’action à 30 jours', dur='8 min', who='Individuel',
         obj='Repartir avec trois tâches concrètes, datées et mesurables, à mener dans les trente prochains jours.',
         files=[],
         steps=[
             ('Trois tâches, pas plus', 'Une « gain rapide », une tâche de votre intersession, une tâche du module 7.'),
             ('Pour chacune', 'La marche et l’outil · le gain mensuel estimé · une date.'),
             ('Votre premier pas lundi', 'Une action de dix minutes, à faire dès lundi matin.'),
             ('Qui peut vous aider', 'Un collègue, un responsable, le référent IA de l’équipe.'),
         ],
         crit=['Trois tâches datées', 'Un gain estimé pour chacune', 'Un premier pas pour lundi'],
         bonus='Relisez ce plan dans un mois et mettez à jour le compteur de temps gagné.'),
]

TONE = {'lab': ('#0E9F6E', '#E2F6EE', 'Lab'), 'atelier': ('#D98A00', '#FEF3DC', 'Atelier')}


def lab_page(L, n, total):
    fg, bg, kind = TONE[L['kind']]
    steps = ''
    for i, s in enumerate(L['steps'], start=1):
        title, txt = s[0], s[1]
        pr = f'<div class="prompt">« {s[2]} »</div>' if len(s) > 2 else ''
        steps += f'<div class="step"><span class="num">{i}</span><div><div class="st">{title}</div>{f"<div class=sx>{txt}</div>" if txt else ""}{pr}</div></div>'
    files = ''.join(f'<span class="chip">Orvalis/{f}</span>' if not f.startswith('Vos') else f'<span class="chip">{f}</span>' for f in L['files']) or '<span class="muted">Aucun fichier</span>'
    crit = ''.join(f'<li><span class="box"></span>{c}</li>' for c in L['crit'])
    return f'''<section class="page">
<div class="top"><span class="d brand">Livret des labs · {COURSE.split(':')[0].strip()}</span><span class="d">{L['mod']}</span></div>
<div class="head"><span class="tag" style="background:{fg};color:#fff">{kind}</span><span class="tag" style="background:#EEF1F6;color:#3B4558">⏱ {L['dur']}</span><span class="tag" style="background:#EEF1F6;color:#3B4558">{L['who']}</span></div>
<h1><span style="color:{fg}">{L['code']}</span> · {L['title']}</h1>
<div class="obj" style="border-color:{fg};background:{bg}"><div class="lab">Objectif</div>{L['obj']}</div>
<div class="files"><div class="lab">Fichiers</div>{files}</div>
<div class="lab" style="margin-top:5mm">Étapes</div>
<div class="steps">{steps}</div>
<div class="row"><div class="crit"><div class="lab">Critères de réussite</div><ul>{crit}</ul></div>
<div class="bonus"><div class="lab" style="color:#9C2380">Bonus</div>{L['bonus']}</div></div>
<div class="foot"><span>Données fictives du dossier Orvalis · jamais de données réelles dans les labs</span><span>{n} / {total}</span></div>
</section>'''


FILE_MAP = [
    ('journal-incident-FS02.docx', 'Journal de l’incident du 12 octobre', 'Atelier 1 · Labs 2.1, 6.2'),
    ('tickets-recurrents.xlsx', '20 demandes récurrentes (accès, téléphone)', 'Lab 2.2'),
    ('rapport-audit-infra-2026.pdf', 'Rapport d’audit de 40 pages', 'Lab 3.1'),
    ('tickets-resolus.xlsx', '6 tickets résolus avec notes de technicien', 'Lab 3.2'),
    ('procedure-purge-IA.docx', 'Procédure générée par une IA (piégée)', 'Atelier 4'),
    ('export-tickets-sept.xlsx · export-tickets-aout.xlsx', 'Exports de 1 846 et 1 612 tickets', 'Labs 6.1, 7.2'),
    ('Reporting/', 'Définitions, objectifs SLA, modèle de reporting', 'Labs 6.1, 7.2'),
    ('alertes-supervision.csv', 'Alertes de supervision, septembre-octobre', 'Lab 6.2'),
    ('contrats-prestataires.xlsx', 'Contrats Wi-Fi et impression', 'Démo M6 · bonus'),
    ('base-connaissances/', '8 articles de base de connaissances', 'Lab 7.1'),
    ('serveurs-test.txt · exports-entrepots/', 'Liste de serveurs de test · 9 exports par entrepôt', 'Lab 7.3'),
    ('dossier-migration-PRT01.docx', 'Dossier du comité de changement', 'Démos M1, M3'),
]


def livret():
    total = 2 + len(LABS)
    rows = ''.join(f'<tr><td class="mono">{a}</td><td>{b}</td><td>{c}</td></tr>' for a, b, c in FILE_MAP)
    pages = [f'''<section class="page cover"><div class="d gk"><span>Une formation</span><b>GK Global Knowledge</b></div>
<div><div class="tag" style="background:#EFE9FC;color:#5A2FC2">Livret des labs · 2 jours · 14 h</div>
<h1 class="ct">Support &amp;<br/>infrastructure IT</h1><div class="cs d">Boostez vos performances grâce à l’IA</div>
<p class="cl">Neuf labs, quatre ateliers, une mission d’intersession et votre plan d’action, sur le fil rouge du service IT d’Orvalis.</p></div>
<div class="cf"><div><div class="muted2">Formateur</div><div class="d" style="font-weight:800;font-size:15pt">{AUTHOR}</div></div><div class="muted2">Microsoft 365 Copilot · Claude</div></div></section>''',
             f'''<section class="page"><div class="top"><span class="d brand">Livret des labs</span><span class="d">Mode d’emploi</span></div>
<h1>Mode d’emploi</h1>
<p class="intro">Chaque fiche suit le même plan : un objectif, les fichiers à utiliser, des étapes avec les prompts de départ, des critères de réussite et un bonus. Les <b>curieux</b> suivent les prompts tels quels ; les <b>utilisateurs réguliers</b> visent le bonus.</p>
<div class="lab">Le dossier Orvalis</div>
<table class="ft"><thead><tr><th>Fichier</th><th>Contenu</th><th>Utilisé dans</th></tr></thead><tbody>{rows}</tbody></table>
<div class="rules"><div class="rule" style="border-color:#0E9F6E"><b style="color:#0A7A55">Vert · je peux le donner</b><br/>Message d’erreur anonyme, documentation publique, procédure sans donnée nominative.</div>
<div class="rule" style="border-color:#F2A20C"><b style="color:#8A5A00">Orange · j’anonymise d’abord</b><br/>Exports avec noms, journaux avec adresses IP, schémas réseau. En local, avant l’envoi.</div>
<div class="rule" style="border-color:#E04848"><b style="color:#B42F2F">Rouge · jamais</b><br/>Mots de passe, secrets, clés privées, données RH, paie, santé.</div></div>
<p class="note">Orvalis, ses salariés, ses chiffres et ses prestataires sont fictifs. Utilisez uniquement les outils et les comptes professionnels autorisés par votre entreprise.</p>
<div class="foot"><span>Données fictives du dossier Orvalis · jamais de données réelles dans les labs</span><span>2 / {total}</span></div></section>''']
    for i, L in enumerate(LABS, start=3):
        pages.append(lab_page(L, i, total))
    css = BASE_CSS + '''
@page{size:A4;margin:0}
.page{width:210mm;height:297mm;padding:20mm 18mm 16mm;position:relative;page-break-after:always;overflow:hidden;background:#fff}
.page::before{content:"";position:absolute;left:0;top:0;right:0;height:2.2mm;background:linear-gradient(90deg,#0B1F5C,#1E22E8 55%,#7442E0)}
.top{position:absolute;top:8mm;left:18mm;right:18mm;display:flex;justify-content:space-between;font-size:8pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.brand{color:var(--navy)}
h1{font-size:21pt;line-height:1.15;color:var(--navy);margin:3mm 0 5mm;font-weight:800}
.head{display:flex;gap:2mm;flex-wrap:wrap;margin-top:2mm}
.lab{font:700 8.5pt "Montserrat",Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--navy);margin-bottom:2mm}
.obj{border-left:3pt solid;border-radius:2mm;padding:3.5mm 4.5mm;font-size:10.5pt;line-height:1.5}
.files{margin-top:4.5mm}
.steps{display:flex;flex-direction:column;gap:4.6mm}
.step{display:flex;gap:3.5mm;align-items:flex-start}
.num{flex:none;width:7.5mm;height:7.5mm;border-radius:2mm;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font:800 10pt "Montserrat",Arial,sans-serif}
.st{font:700 11.5pt "Montserrat",Arial,sans-serif;color:var(--ink);margin:.6mm 0 1.2mm}
.sx{font-size:10.5pt;line-height:1.5;color:var(--soft);margin-bottom:1.8mm}
.row{position:absolute;left:18mm;right:18mm;bottom:16mm;display:flex;gap:5mm}
.crit{flex:1.2;border:.6pt solid var(--rule);border-radius:2mm;padding:3.5mm 4.5mm}
.crit ul{list-style:none;margin:0;padding:0}.crit li{display:flex;gap:2.5mm;align-items:center;font-size:9.5pt;margin-bottom:1.6mm}
.box{flex:none;width:3.6mm;height:3.6mm;border:1pt solid var(--muted);border-radius:.8mm}
.bonus{flex:1;background:#FBE8F5;border-radius:2mm;padding:3.5mm 4.5mm;font-size:9.5pt;line-height:1.45}
.foot{position:absolute;left:18mm;right:18mm;bottom:7mm;display:flex;justify-content:space-between;font-size:7.5pt;color:var(--muted)}
.muted{color:var(--muted);font-size:9pt}.muted2{color:#9FB1D3;font-size:9pt;letter-spacing:.08em;text-transform:uppercase;font-family:Montserrat,Arial,sans-serif;font-weight:700}
.intro{font-size:10.5pt;line-height:1.55;color:var(--soft);margin:0 0 6mm}
.ft{width:100%;border-collapse:collapse;font-size:8.8pt;margin-bottom:6mm}.ft th{background:var(--navy);color:#fff;text-align:left;padding:2mm 2.5mm;font-family:Montserrat,Arial,sans-serif}.ft td{padding:1.8mm 2.5mm;border-bottom:.4pt solid var(--rule)}
.rules{display:flex;gap:3mm}.rule{flex:1;border-top:2.5pt solid;border-radius:1.5mm;background:#F6F8FC;padding:3mm;font-size:8.8pt;line-height:1.45}
.note{position:absolute;left:18mm;right:18mm;bottom:16mm;font-size:8.5pt;color:var(--muted);font-style:italic}
.cover{background:#0B1F5C;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:30mm 22mm 24mm}
.cover::before{display:none}
.gk{display:flex;gap:4mm;align-items:baseline;font-size:10pt;letter-spacing:.14em;text-transform:uppercase;color:#C7CFEA}.gk b{font-size:16pt;letter-spacing:0;text-transform:none;color:#fff}
.ct{color:#fff;font-size:34pt;margin:6mm 0 2mm}.cs{font-size:20pt;font-weight:800;color:#C9B6FF}
.cl{font-size:12pt;line-height:1.55;color:#E6EAF6;max-width:150mm;margin-top:8mm}
.cf{display:flex;justify-content:space-between;align-items:flex-end;border-top:.6pt solid rgba(255,255,255,.25);padding-top:5mm}
'''
    return f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Livret des labs · Support & infrastructure IT</title>{FONTS}<style>{css}</style></head><body>{"".join(pages)}</body></html>'


# ─── Mémo participant (A4 paysage, 2 pages) ──────────────────────────────────
def card(title, color, body, cls=''):
    return f'<div class="card {cls}" style="border-top-color:{color}"><h3 style="color:{color}">{title}</h3>{body}</div>'


def li(*xs):
    return '<ul>' + ''.join(f'<li>{x}</li>' for x in xs) + '</ul>'


def ol(*xs):
    return '<ol>' + ''.join(f'<li>{x}</li>' for x in xs) + '</ol>'


def memo():
    p1 = ''.join([
        card('Choisir son outil', '#0A62D0', ol(
            '<b>Qu’autorise l’entreprise ?</b> La charte prime, compte pro uniquement.',
            '<b>Où sont les infos ?</b> E-mails, Teams, SharePoint → <b>Microsoft 365 Copilot</b>.',
            '<b>Long ou complexe ?</b> Rapport de 100 pages, raisonnement → <b>Claude</b>.',
            '<b>Faut-il calculer ?</b> Classeur ouvert → <b>Copilot dans Excel</b> ; plusieurs fichiers → <b>Claude</b>.',
        ) + '<p class="small">Copilot Chat (inclus) ne voit que ce que vous lui donnez. Microsoft 365 Copilot (licence) lit vos données, dans la limite de vos droits.</p>'),
        card('Le prompt en 5 ingrédients', '#7442E0', '<div class="ing"><span style="background:#0B1F5C">Rôle</span><span style="background:#0A62D0">Contexte</span><span style="background:#7442E0">Tâche</span><span style="background:#0E9AAE">Format</span><span style="background:#C2369E">Contraintes</span></div>'
             '<div class="prompt">« Tu es chargé de la communication du support. FS-02 est indisponible depuis 7 h 52 ; 340 personnes bloquées ; retour visé 10 h 30. Rédige le message aux utilisateurs : un objet, cinq lignes, sans jargon, une ligne “Que faire en attendant ?”. »</div>'
             '<p class="small">Le <b>contexte</b> apporte les faits, les <b>contraintes</b> adaptent au lecteur : ce sont les deux plus souvent oubliés.</p>'),
        card('Donner du contexte', '#0E9AAE', li('<b>Joindre le fichier</b> plutôt que le résumer.', '<b>« / »</b> dans Microsoft 365 Copilot : citer un fichier, un e-mail, une réunion.', '<b>Un projet Claude</b> par sujet : instructions + documents.', '<b>Instructions permanentes</b> : qui vous êtes, pour qui vous écrivez.')),
        card('Cinq relances qui valent de l’or', '#0E9F6E', li('« Plus court, cinq lignes maximum. »', '« Réécris pour un non-technicien. »', '« Présente-le en tableau. »', '« Qu’est-ce qui manque ? »', '« Propose trois versions de ton différent. »') + '<div class="prompt">« Avant de rédiger, pose-moi les questions dont tu as besoin. »</div>'),
        card('Synthèse en trois passes', '#0B1F5C', ol('<b>La carte</b> : « Donne le plan et ce que couvre chaque partie. »', '<b>L’essentiel</b> : « Les cinq constats majeurs, avec le risque et la page. »', '<b>La décision</b> : « Une note d’une page pour [lecteur], avec la décision attendue. »')
             + '<p class="small"><b>Vérifier</b> : page source · trois chiffres au hasard · « Qu’as-tu laissé de côté ? » · relecture par l’autre outil.</p>'),
        card('Données : le feu tricolore', '#E04848', '<div class="lights"><div><b style="color:#0A7A55">Vert</b> erreur anonyme, doc publique, procédure générique</div><div><b style="color:#8A5A00">Orange</b> noms, adresses IP, schémas → anonymiser <u>en local</u></div><div><b style="color:#B42F2F">Rouge</b> mots de passe, clés, RH, paie, santé : jamais</div></div>'
             '<p class="small">Secret collé par erreur = compromis : on le change et on signale. Un contenu externe peut contenir des ordres cachés : relire, valider, signaler.</p>'),
        card('Documenter', '#D98A00', li('<b>Procédure</b> : objet, prérequis, étapes, vérifications, retour arrière, contacts. « Signale les étapes que tu as dû deviner. »', '<b>Article KB</b> : titre = <u>symptôme</u> avec les mots de l’utilisateur, puis cause, solution, prévention, mots-clés.', '<b>Comité</b> : « Joue un membre exigeant : pose-moi les 5 questions les plus difficiles. »')),
        card('Copilot au quotidien', '#2B6CD4', li('<b>Outlook</b> : résumer un fil, rédiger avec le bon ton.', '<b>Teams</b> : décisions et actions d’une réunion (transcription activée).', '<b>Word</b> : premier jet à partir d’un fichier cité avec « / ».', '<b>Excel</b> : « Explique-moi cette formule », tableaux croisés.')),
    ])
    p2 = ''.join([
        card('Analyser des données', '#0A62D0', li('<b>Données propres</b> : une ligne = un ticket, en-têtes simples, vraies dates, libellés homogènes, Ctrl + T.', '<b>Vos définitions</b> d’indicateurs et vos objectifs, toujours fournis.', 'L’IA <b>calcule</b> (Excel, analyse de fichiers), elle n’estime pas.')
             + '<p class="small"><b>4 contrôles</b> : total = nombre de lignes · un sous-total refait à la main · « Montre-moi le calcul » · chaque mot prouvé par un chiffre.</p>'),
        card('Comprendre un incident', '#E04848', ol('<b>Chronologie</b> datée, avec la source de chaque événement.', '<b>5 pourquoi</b> : l’IA anime, l’équipe répond.', '<b>Ishikawa</b> : méthodes, logiciel, supervision, humain, matériel, environnement.', '<b>Post-mortem sans blâme</b> : résumé, impact, chronologie, causes, ce qui a marché, actions datées.')
             + '<div class="prompt">« Anime un 5 pourquoi sur cet incident. Une question à la fois, ne propose pas la réponse. »</div>'),
        card('Cette tâche s’automatise-t-elle ?', '#0E9F6E', '<p class="small" style="margin-top:0">Un point par « oui » : fréquente · plus de 10 min · règles stables · données numériques · erreur sans gravité.</p><div class="score"><span style="background:#0E9F6E">4–5 automatiser</span><span style="background:#F2A20C">3 avec validation</span><span style="background:#E04848">0–2 rester manuel</span></div>'
             + '<div class="ladder"><span>1 Prompt enregistré</span><span>2 Modèle / projet</span><span>3 Agent</span><span>4 Flux</span><span>5 Script</span></div><p class="small">La marche la <b>plus basse</b> qui suffit.</p>'),
        card('Un agent sans code', '#7442E0', li('<b>Nom</b>, <b>instructions</b>, <b>connaissances</b>, <b>suggestions</b> de démarrage.', 'La phrase clé : « Réponds <u>uniquement</u> à partir des articles fournis. Sinon, dis-le et propose un ticket. »', 'Avant l’ouverture : 20 questions réelles, 5 pièges, un propriétaire, lecture seule.')),
        card('Prompts prêts à copier', '#0E9AAE', '<div class="prompt">« Liste les problèmes de qualité de ce tableau et propose les corrections, sans rien modifier. »</div><div class="prompt">« Voici nos définitions. Calcule chaque indicateur et montre-moi le calcul. »</div><div class="prompt">« Explique-moi chaque ligne de ce script en français simple. Modifie-t-il quelque chose ? »</div>'),
        card('Vibe coding : le prompt en 6 ingrédients', '#0B1F5C', '<div class="six"><span><b>Objectif</b> le résultat voulu</span><span><b>Environnement</b> Windows, PowerShell 5.1</span><span><b>Entrée</b> fichier, colonnes</span><span><b>Sortie</b> CSV ; trié</span><span><b>Sécurité</b> lecture seule</span><span><b>Pédagogie</b> commente en français</span></div>'
             + '<p class="small"><b>Boucle</b> : décrire → l’IA écrit → expliquer ligne par ligne → tester sans risque → coller l’erreur pour corriger.</p>'),
        card('Avant d’exécuter un script', '#B42F2F', ol('Je sais l’<b>expliquer</b> ligne par ligne.', 'Je repère ce qui <b>modifie</b> : <span class="mono">Remove · Set · Stop · Disable · Format · Move</span>.', 'Je <b>teste sans risque</b> : lecture seule, <span class="mono">-WhatIf</span>, environnement de test.', 'Je fais <b>relire</b> ; droits minimum, pas d’admin sans nécessité.')),
        card('Prêt pour la production ? 8 cases', '#C2369E', '<div class="eight">' + ''.join(f'<span>☐ {x}</span>' for x in ['Expliqué', 'Testé en lecture seule', 'Testé en environnement de test', 'Relu par un collègue', 'Aucun secret écrit', 'Validation humaine avant action', 'Laisse une trace', 'Propriétaire + fiche']) + '</div>'),
    ])
    css = BASE_CSS + '''
@page{size:A4 landscape;margin:0}
.page{width:297mm;height:210mm;padding:15mm 11mm 9mm;position:relative;page-break-after:always;overflow:hidden}
.page::before{content:"";position:absolute;left:0;top:0;right:0;height:2mm;background:linear-gradient(90deg,#0B1F5C,#1E22E8 55%,#7442E0)}
.mh{position:absolute;top:5.5mm;left:11mm;right:11mm;display:flex;justify-content:space-between;align-items:baseline}
.mh h2{margin:0;font-size:13pt;font-weight:800;color:var(--navy);white-space:nowrap}.mh span{font-size:7.5pt;color:var(--muted);letter-spacing:.06em}
.grid{column-count:3;column-gap:4mm;height:100%}
.card{break-inside:avoid;background:#fff;border:.5pt solid var(--rule);border-top:2.4pt solid;border-radius:1.8mm;padding:3mm 3.6mm;margin-bottom:3.4mm;font-size:9.4pt;line-height:1.42}
.card h3{margin:0 0 1.8mm;font-size:10.6pt;font-weight:800}
.card ul,.card ol{margin:0;padding-left:4.2mm}.card li{margin-bottom:.9mm}
.small{font-size:8.8pt;color:var(--soft);margin:1.8mm 0 0}
.prompt{font-size:8.8pt;margin-top:1.8mm;padding:1.8mm 2.6mm}
.ing,.score,.ladder{display:flex;flex-wrap:wrap;gap:1mm;margin-bottom:1.6mm}
.ing span,.score span{color:#fff;font:700 8.2pt Montserrat,Arial,sans-serif;padding:.6mm 2mm;border-radius:5mm}
.ladder span{font:700 8.2pt Montserrat,Arial,sans-serif;background:#EEF1F6;color:var(--navy);padding:.6mm 2mm;border-radius:1mm}
.lights div{margin-bottom:.9mm}
.six{display:grid;grid-template-columns:1fr 1fr;gap:1mm 2.5mm}.six span{font-size:8.8pt}.six b{display:block;color:var(--navy);font-family:Montserrat,Arial,sans-serif;font-size:8.6pt}
.eight{display:grid;grid-template-columns:1fr 1fr;gap:1mm 2.5mm;font-size:9pt}
.ft{position:absolute;left:11mm;right:11mm;bottom:3.5mm;display:flex;justify-content:space-between;font-size:7pt;color:var(--muted)}
'''

    def page(n, title, inner):
        return f'''<section class="page"><div class="mh"><h2>Mémo participant · {title}</h2><span>GK Global Knowledge · {AUTHOR}</span></div>
<div class="grid">{inner}</div><div class="ft"><span>Outils et fonctions évoluent : la charte de votre entreprise et la documentation des éditeurs font foi.</span><span>{n} / 2</span></div></section>'''

    return f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Mémo participant · Support & infrastructure IT</title>{FONTS}<style>{css}</style></head><body>{page(1, "formuler, produire, protéger", p1)}{page(2, "analyser, automatiser, garder la main", p2)}</body></html>'


if __name__ == '__main__':
    import os
    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    from audit import html as audit_html

    here = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'html')
    os.makedirs(here, exist_ok=True)
    for name, content in [('audit.html', audit_html()), ('livret.html', livret()), ('memo.html', memo())]:
        with open(os.path.join(here, name), 'w', encoding='utf-8') as f:
            f.write(content)
    print('html ok')
