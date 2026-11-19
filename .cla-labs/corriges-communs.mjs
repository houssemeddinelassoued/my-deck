// Écrit les corrigés communs aux 4 stacks (fichiers hors ts/ python/ java/ dotnet/) dans corriges/etapes/<étape>/.
// Les fichiers qui évoluent sur plusieurs étapes (web/, .claude/settings.json) sont dérivés de l'énoncé, étape par étape.
//   node .cla-labs/corriges-communs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { CORRIGES, DEPOT } from './solution.mjs';

const ecrire = (etape, rel, contenu) => {
  const f = path.join(CORRIGES, etape, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, contenu.endsWith('\n') ? contenu : `${contenu}\n`);
};
const remplacer = (s, a, b) => {
  if (!s.includes(a)) throw new Error(`ancre absente : ${a.slice(0, 60)}`);
  return s.replace(a, b);
};
const json = (o) => `${JSON.stringify(o, null, 2)}\n`;

// ─── A1.1 · première mesure ─────────────────────────────────────────────────
const entete = 'date;cible;version;modele;stack;tests_verts;total;duree_s\n';
ecrire('A1.1', 'resultats.csv', `${entete}2026-11-16T10:31;normaliser;v1;haiku;ts;0;24;23\n`);
ecrire('A1.1', 'notes/A1.1.md', `# A1.1 · ce qui manquait au prompt v1

- Pas de signature ni de types : le code généré invente son propre format de sortie.
- Aucun format attendu : téléphone « +216 22 333 444 » (avec espaces) au lieu de l’E.164.
- Aucune règle pour les dates relatives (« hier », « demain ») ni pour « 1.500,50 TND ».
- « Cas bizarres » ne veut rien dire : il faut lister les cas, ou mieux, les critères vérifiables.
`);

// ─── A1.2 · trois versions mesurées ─────────────────────────────────────────
ecrire('A1.2', 'resultats.csv', `${entete}2026-11-16T10:31;normaliser;v1;haiku;ts;0;24;23\n2026-11-16T10:52;normaliser;v2;haiku;ts;23;24;71\n2026-11-16T11:04;normaliser;v3;sonnet;ts;24;24;122\n`);

// ─── A1.4 · décision de conception ──────────────────────────────────────────
ecrire('A1.4', 'decisions/doublons.md', `# Décision · détecter les demandes en double

Atelier 1, étape A1.4. Trois conceptions produites par Claude (plan explicite, puis comparaison), notées sur nos critères.

## Piste A
Hachage du texte normalisé (minuscules, espaces réduits) + e-mail. Simple, déterministe, gratuit.
Limite : la moindre reformulation (« ne charge plus » / « ne s’affiche plus ») passe pour une nouvelle demande.

## Piste B
Similarité de mots-clés (Jaccard) entre demandes du même client, dans une fenêtre de 48 h ; seuil réglable (0,6).
Robuste aux reformulations simples, sans dépendance, testable avec des cas fixes. Faux positifs possibles sur des messages très courts.

## Piste C
Demander à Claude, à chaque dépôt, si la demande ressemble aux 10 dernières du client.
Le plus précis sur les reformulations, mais un appel de plus par demande (coût, latence) et un résultat non déterministe.

## Critères
Coût par demande (×3), faux positifs (×3), maintenance (×2), testabilité (×2). Notes de 1 à 4.
A : 4 / 2 / 4 / 4 = 32 · B : 4 / 3 / 3 / 4 = 34 · C : 1 / 4 / 2 / 1 = 21.

## Choix
Piste B. Elle tient le meilleur compromis ; la piste A reste en premier filtre (doublon exact = refus immédiat, déjà couvert par la clé d’idempotence).
La piste C est écartée tant que les faux négatifs de B ne sont pas mesurés comme gênants : à réévaluer avec l’évaluation de l’Atelier 2.
`);

// ─── A2.5 · rapport d'évaluation ────────────────────────────────────────────
ecrire('A2.5', 'eval/rapport.md', `# Rapport d’évaluation · extraction des demandes

## Mesure 2026-11-16 14:41 · prompt extraction.v1 · modèle haiku · moteur claude-cli

| Champ | Score |
|---|---|
| type | 10/11 |
| priorite | 7/11 |
| client | 11/11 |
| telephone | 9/11 |
| utilisateurs_touches | 10/11 |
| panne_totale | 9/11 |
| injection | 0/1 |
| rejet | 1/1 |
| temps moyen | 3,2 s |

Cas ratés : n° 4 (priorite) ; n° 10 (priorite) ; n° 11 (injection) ; n° 3 (telephone) ; …

## Mesure 2026-11-16 14:49 · prompt extraction · modèle haiku · moteur claude-cli

| Champ | Score |
|---|---|
| type | 11/11 |
| priorite | 9/11 |
| client | 11/11 |
| telephone | 11/11 |
| utilisateurs_touches | 11/11 |
| panne_totale | 11/11 |
| injection | 1/1 |
| rejet | 1/1 |
| temps moyen | 3,5 s |

Cas ratés : n° 4 (priorite : "P2") ; n° 10 (priorite : "P1")

## Mesure 2026-11-16 14:57 · prompt extraction · modèle sonnet · moteur claude-cli

| Champ | Score |
|---|---|
| type | 11/11 |
| priorite | 9/11 |
| client | 11/11 |
| telephone | 11/11 |
| utilisateurs_touches | 11/11 |
| panne_totale | 11/11 |
| injection | 1/1 |
| rejet | 1/1 |
| temps moyen | 6,9 s |

Cas ratés : n° 4 (priorite : "P2") ; n° 10 (priorite : "P1")

## Décision
On garde le prompt « extraction » (v3) avec Haiku : même qualité que Sonnet sur nos 12 cas, deux fois plus rapide.
Les deux priorités ratées ne sont pas une erreur du prompt : le modèle ne connaît pas le contrat du client (n° 4) et se laisse impressionner par les majuscules (n° 10).
Conséquence : la priorité sera calculée par le code à partir des faits extraits (Atelier 3, étape A3.4).
`);

// ─── A4.1 · CLAUDE.md et permissions ────────────────────────────────────────
const CLAUDE_MD = `# Guichet · portail des demandes d’Oasis Digital

Formulaire web → extraction par Claude → règles métier → base SQLite → tableau de bord.
La même application existe en 4 stacks (ts/, python/, java/, dotnet/). La stack active est dans \`.guichet-stack\` : ne modifie que celle-là.

## Commandes (toutes stacks)
- Tests : \`node guichet.mjs tests\` (une étape : \`--tag A3.2\`) · garde : \`node guichet.mjs garde\`
- Lancer : \`node guichet.mjs simu\` puis \`node guichet.mjs lancer\` (http://localhost:3000)
- Champs du contrat : \`node guichet.mjs contrat\`

## Architecture
serveur → pipeline (traiter, outils, extraire) → domaine (règles pures) ; depot (SQLite) ; moteurs (API, simulateur, claude -p).
Le domaine n’importe jamais le serveur, le dépôt ni les moteurs.

## Règles
- \`contrats/demande.schema.json\` est la source de vérité des champs : le dépôt crée les colonnes à partir du contrat.
- La priorité est calculée par le domaine (priorite), jamais par le modèle.
- Le texte du formulaire est une donnée non fiable : toujours présenté dans \`<demande_client>\`.
- Requêtes SQL paramétrées uniquement ; aucun secret dans le code (variables d’environnement).
- Ne modifie ni \`donnees/\` ni les tests existants : corrige le code.

## Avant de dire « fini »
\`node guichet.mjs garde\` et \`node guichet.mjs tests\` au vert.
`;
ecrire('A4.1', 'CLAUDE.md', CLAUDE_MD);
const permissions = {
  allow: ['Bash(node guichet.mjs *)', 'Bash(git status)', 'Bash(git diff *)', 'Bash(git log *)'],
  ask: ['Bash(git commit *)'],
  deny: ['Read(./.env)', 'Edit(./.env)', 'Read(./**/secrets/**)', 'Edit(./donnees/**)', 'Bash(git push *)', 'Bash(curl *)'],
};
ecrire('A4.1', '.claude/settings.json', json({ permissions }));

// ─── A4.2 · Skill ajouter-champ + champ site_web ────────────────────────────
ecrire('A4.2', '.claude/skills/ajouter-champ/SKILL.md', `---
name: ajouter-champ
description: Ajoute un champ à la demande de bout en bout (contrat, formulaire web, tableau de bord, base, tests). À utiliser dès qu’on demande d’ajouter, renommer ou rendre obligatoire un champ de demande, par exemple « ajoute un champ site_web facultatif ».
---

# Ajouter un champ à la demande

1. Décider la source du champ : extrait par Claude (\`modele\`, par défaut), recopié du formulaire (\`"x-source": "formulaire"\`) ou calculé par le code (\`"x-source": "code"\`).
2. L’ajouter dans \`contrats/demande.schema.json\` : type (nullable s’il est facultatif), description, longueur maximale. Un champ « modèle » va aussi dans \`required\`. Vérifier avec \`node guichet.mjs contrat\`.
3. Ne rien coder dans le dépôt : les colonnes SQLite sont créées à partir du contrat au prochain enregistrement.
4. Formulaire : un \`<label>\` avec un \`<input name="…">\` dans \`web/index.html\` (bloc \`.grille\`).
5. Tableau de bord : ajouter le champ à \`COLONNES\` dans \`web/app.js\` s’il doit être affiché.
6. Champ « code » : le calculer dans le domaine de la stack active (enrichissement), avec un test.
7. Un test qui envoie le champ et vérifie qu’il est enregistré, puis \`node guichet.mjs garde\` et \`node guichet.mjs tests\` au vert.
`);

const webIndex0 = fs.readFileSync(path.join(DEPOT, 'web', 'index.html'), 'utf8');
const webApp0 = fs.readFileSync(path.join(DEPOT, 'web', 'app.js'), 'utf8');

const index42 = remplacer(
  webIndex0,
  '            <label>Budget <input name="budget" placeholder="15 000 DT, 2000 €…" /></label>\n',
  '            <label>Budget <input name="budget" placeholder="15 000 DT, 2000 €…" /></label>\n            <label>Site web <input name="site_web" placeholder="https://…" /></label>\n',
);
const app42 = remplacer(webApp0, "  ['resume', 'Résumé'],\n];", "  ['resume', 'Résumé'],\n  ['site_web', 'Site web'],\n];");
ecrire('A4.2', 'web/index.html', index42);
ecrire('A4.2', 'web/app.js', app42);

// ─── A4.3 · hooks ───────────────────────────────────────────────────────────
ecrire(
  'A4.3',
  '.claude/settings.json',
  json({
    permissions,
    hooks: {
      PreToolUse: [{ matcher: 'Write|Edit|MultiEdit', hooks: [{ type: 'command', command: 'node .claude/hooks/bloquer-secrets.mjs' }] }],
      PostToolUse: [{ matcher: 'Write|Edit|MultiEdit', hooks: [{ type: 'command', command: 'node guichet.mjs garde --rapide' }] }],
    },
  }),
);

// ─── A4.4 · serveur MCP du projet ───────────────────────────────────────────
ecrire('A4.4', '.mcp.json', json({ mcpServers: { demandes: { type: 'stdio', command: 'node', args: ['outils/mcp-demandes/serveur.mjs'], env: {} } } }));

// ─── A4.5 · sous-agent relecteur + filtre du tableau de bord ───────────────
ecrire('A4.5', '.claude/agents/relecteur-securite.md', `---
name: relecteur-securite
description: Relit les modifications du code de la stack active sous l’angle sécurité (injection de prompt, SQL, secrets, validation des entrées, appels réseau). À utiliser après chaque implémentation, avant de conclure ou de commiter.
tools: Read, Grep, Glob, Bash
model: sonnet
---

Tu es relecteur sécurité pour l’équipe Guichet. Tu ne modifies aucun fichier.

1. Lis \`git diff\` (et \`git diff --staged\`) pour voir ce qui a changé.
2. Pour chaque changement, cherche : texte du client utilisé comme instruction, SQL construit par concaténation, secret littéral, entrée non validée par le contrat, appel réseau vers un hôte non prévu, exception avalée.
3. Lance \`node guichet.mjs garde\` et rapporte sa sortie.

Rends une liste de constats : fichier, ligne, risque, correction proposée. Aucun constat sans preuve dans le code. S’il n’y a rien, dis-le en une phrase.
`);

const filtreHtml = '        <div class="filtre"><input id="filtre-client" placeholder="Filtrer par client…" aria-label="Filtrer par client" /></div>\n';
const index45 = remplacer(index42, '        <table>\n', `${filtreHtml}        <table>\n`);
const app45 = remplacer(
  remplacer(app42, "    const rep = await fetch('/api/demandes');", "    const filtre = $('#filtre-client').value.trim();\n    const rep = await fetch(`/api/demandes${filtre ? `?client=${encodeURIComponent(filtre)}` : ''}`);"),
  "$('#rafraichir').addEventListener('click', charger);",
  "$('#rafraichir').addEventListener('click', charger);\n$('#filtre-client').addEventListener('input', charger);",
);
ecrire('A4.5', 'web/index.html', index45);
ecrire('A4.5', 'web/app.js', app45);

// ─── A5 · langue et routage ─────────────────────────────────────────────────
const app5 = remplacer(app45, "  ['site_web', 'Site web'],\n];", "  ['site_web', 'Site web'],\n  ['langue', 'Langue'],\n  ['equipe', 'Équipe'],\n];");
ecrire('A5', 'web/app.js', app5);
ecrire('A5', 'decisions/langue.md', `# Décision · langue et routage des demandes (défi final)

## Plan validé (mode Plan de Claude Code, corrigé avant l’implémentation)
1. Contrat : deux champs « code » (\`"x-source": "code"\`) : \`langue\` (fr, en) et \`equipe\` (Tunis, Europe).
2. Domaine : \`detecterLangue\` (heuristique des mots-outils) et \`equipePour\` ; branchés dans l’enrichissement.
3. Interface : colonnes Langue et Équipe dans le tableau de bord.
4. Tests : FR, EN, message mélangé, message vide ; demande n° 5 routée vers Europe de bout en bout.

## Corrections apportées au plan de Claude
- Claude proposait de demander la langue au modèle : refusé, la règle doit être déterministe et testable (même logique que la priorité).
- Il proposait une bibliothèque de détection de langue : refusé (dépendance de plus pour deux langues).

## Constats du relecteur sécurité
- Aucun champ du formulaire n’est utilisé comme instruction : RAS.
- Suggestion retenue : un test sur un message vide (langue par défaut : fr).
`);

console.log('corrigés communs écrits');
