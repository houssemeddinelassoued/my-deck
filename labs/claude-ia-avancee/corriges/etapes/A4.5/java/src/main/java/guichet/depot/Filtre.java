package guichet.depot;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…).
 * Recherche partielle, insensible à la casse et aux accents ; filtre vide = tout.
 */
public final class Filtre {
  private Filtre() {}

  private static String simplifier(Object s) {
    return Normalizer.normalize(s == null ? "" : s.toString(), Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).strip();
  }

  public static List<Map<String, Object>> parClient(List<Map<String, Object>> demandes, String client) {
    String cherche = simplifier(client);
    if (cherche.isEmpty()) return demandes;
    return demandes.stream().filter(d -> simplifier(d.get("client")).contains(cherche)).toList();
  }
}
