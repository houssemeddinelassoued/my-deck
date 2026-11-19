package guichet.domaine;

/**
 * Tâche de la boucle (Atelier 2, étape A2.3) : écrit par Claude via
 * node guichet.mjs boucle taches/tronquer-resume.md
 */
public final class Texte {
  private Texte() {}

  public static String tronquerResume(String texte, int max) {
    String t = texte == null ? "" : texte.strip();
    if (t.length() <= max) return t;
    String coupe = t.substring(0, max - 1);
    int espace = coupe.lastIndexOf(' ');
    if (espace > 0) coupe = coupe.substring(0, espace);
    return coupe.stripTrailing() + "…";
  }
}
