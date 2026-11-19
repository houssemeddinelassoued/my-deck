package guichet.domaine;

import java.util.Map;

/**
 * Atelier 3, étape A3.4 · la priorité est une règle métier : c'est le code qui décide, pas le modèle.
 * Règle : hors incident → P3 ; incident avec panne totale ou au moins 20 utilisateurs touchés → P1 ;
 * sinon P1 pour un contrat « or », P2 pour les autres.
 */
public final class Priorite {
  private Priorite() {}

  public static String calculer(Map<String, Object> faits, String contrat) {
    // Provisoire : on fait confiance à l'avis du modèle. À remplacer par la règle ci-dessus (A3.4).
    Object p = faits.get("priorite");
    return p == null ? "P2" : p.toString();
  }
}
