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
    if (!"incident".equals(faits.get("type"))) return "P3";
    boolean panne = Boolean.TRUE.equals(faits.get("panne_totale"));
    int utilisateurs = faits.get("utilisateurs_touches") instanceof Number n ? n.intValue() : 0;
    if (panne || utilisateurs >= 20) return "P1";
    return "or".equals(contrat) ? "P1" : "P2";
  }
}
