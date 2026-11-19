package guichet.depot;

import java.util.List;
import java.util.Map;

/** Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…). */
public final class Filtre {
  private Filtre() {}

  public static List<Map<String, Object>> parClient(List<Map<String, Object>> demandes, String client) {
    // Pas encore de filtre : toutes les demandes sont renvoyées.
    return demandes;
  }
}
