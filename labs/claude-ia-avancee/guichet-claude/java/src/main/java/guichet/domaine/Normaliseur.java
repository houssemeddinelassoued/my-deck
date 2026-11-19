package guichet.domaine;

import guichet.AFaire;
import java.time.LocalDate;
import java.util.Map;

/**
 * Atelier 1 · ce fichier est GÉNÉRÉ par Claude : node guichet.mjs generer normaliser v1 (puis v2, v3).
 * Ne l'écrivez pas à la main : améliorez le prompt.
 */
public final class Normaliseur {
  private Normaliseur() {}

  public static Demande.Normalisee normaliser(Map<String, String> brute, LocalDate aujourdhui) {
    return AFaire.completer("A1.2 : Normaliseur.normaliser (" + brute.size() + " champs, " + aujourdhui + ")");
  }
}
