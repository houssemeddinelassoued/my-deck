package guichet.domaine;

import guichet.AFaire;

/**
 * Tâche de la boucle (Atelier 2, étape A2.3) : ce fichier est écrit par Claude via
 * node guichet.mjs boucle taches/tronquer-resume.md
 */
public final class Texte {
  private Texte() {}

  public static String tronquerResume(String texte, int max) {
    return AFaire.completer("BOUCLE : tronquerResume (" + (texte == null ? 0 : texte.length()) + " caractères, max " + max + ")");
  }
}
