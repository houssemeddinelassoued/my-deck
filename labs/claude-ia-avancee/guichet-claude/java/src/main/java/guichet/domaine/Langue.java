package guichet.domaine;

import guichet.AFaire;

/** Défi final (Atelier 5) · langue de la demande et équipe de routage. */
public final class Langue {
  private Langue() {}

  public static String detecter(String texte) {
    return AFaire.completer("A5 : Langue.detecter (" + (texte == null ? 0 : texte.length()) + " caractères)");
  }

  public static String equipePour(String langue) {
    return AFaire.completer("A5 : Langue.equipePour (" + langue + ")");
  }
}
