# Tâche · tronquer un résumé

Implémente `tronquerResume(texte, max = 280)` dans le fichier de domaine « texte » de la stack.

Règles :
- retirer les espaces au début et à la fin ;
- si le texte fait au plus `max` caractères, le renvoyer tel quel ;
- sinon, couper au dernier espace situé avant la position `max - 1`, retirer les espaces de fin, et ajouter « … » (un seul caractère) ; s'il n'y a pas d'espace, couper à `max - 1` caractères ;
- le résultat ne dépasse jamais `max` caractères.

Ne modifie que ce fichier. Ne change ni le nom ni la signature de la fonction.

fichier-ts: ts/src/domaine/texte.ts
fichier-python: python/guichet/domaine/texte.py
fichier-java: java/src/main/java/guichet/domaine/Texte.java
fichier-dotnet: dotnet/Guichet/Domaine/Texte.cs
