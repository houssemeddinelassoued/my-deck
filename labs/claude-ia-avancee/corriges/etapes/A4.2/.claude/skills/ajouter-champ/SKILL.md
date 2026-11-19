---
name: ajouter-champ
description: Ajoute un champ à la demande de bout en bout (contrat, formulaire web, tableau de bord, base, tests). À utiliser dès qu’on demande d’ajouter, renommer ou rendre obligatoire un champ de demande, par exemple « ajoute un champ site_web facultatif ».
---

# Ajouter un champ à la demande

1. Décider la source du champ : extrait par Claude (`modele`, par défaut), recopié du formulaire (`"x-source": "formulaire"`) ou calculé par le code (`"x-source": "code"`).
2. L’ajouter dans `contrats/demande.schema.json` : type (nullable s’il est facultatif), description, longueur maximale. Un champ « modèle » va aussi dans `required`. Vérifier avec `node guichet.mjs contrat`.
3. Ne rien coder dans le dépôt : les colonnes SQLite sont créées à partir du contrat au prochain enregistrement.
4. Formulaire : un `<label>` avec un `<input name="…">` dans `web/index.html` (bloc `.grille`).
5. Tableau de bord : ajouter le champ à `COLONNES` dans `web/app.js` s’il doit être affiché.
6. Champ « code » : le calculer dans le domaine de la stack active (enrichissement), avec un test.
7. Un test qui envoie le champ et vérifie qu’il est enregistré, puis `node guichet.mjs garde` et `node guichet.mjs tests` au vert.
