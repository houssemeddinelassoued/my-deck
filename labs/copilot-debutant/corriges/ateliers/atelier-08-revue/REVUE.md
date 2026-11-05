# Revue · corrigé formateur

| # | Défaut | Catégorie | Correction |
|---|---|---|---|
| 01 | `sortBy` n'existe pas ; `sort` trierait sur place | API inventée | `[...t].sort((a, b) => a.priorite - b.priorite)` |
| 02 | non estimés comptés (null → 0) ; `NaN` sur liste vide | Logique | filtrer les estimés, 0 si vide |
| 03 | saisie transformée en RegExp sans échappement | Sécurité / robustesse | `includes` sur des minuscules |
| 04 | titre injecté dans du HTML (XSS) | Sécurité | `textContent`, ou échappement |
| 05 | jeton en dur, dans l'URL, en HTTP | Sécurité | variable d'environnement, en-tête `Authorization`, HTTPS |
| 06 | `findIndex` dans `filter` : O(n²) | Performance | `Set` : O(n) |
| 07 | date ISO lue en UTC, heure du jour, changement d'heure | Logique (dates) | dates calendaires UTC, date du jour en paramètre |
| 08 | code copié sous GPL-3.0 avec son en-tête | Licence / PI | supprimer, utiliser `structuredClone` |
