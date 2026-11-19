package guichet;

import guichet.depot.DepotSqlite;
import guichet.domaine.Demande;
import guichet.moteurs.MoteurApi;
import guichet.pipeline.Traiter;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Outils partagés par les tests : les cas viennent de donnees/, communs aux 4 stacks. */
final class Commun {
  private Commun() {}

  static Map<String, Object> cas(String fichier) {
    return Config.lireObjet("donnees", fichier);
  }

  @SuppressWarnings("unchecked")
  static List<Map<String, Object>> liste(String fichier) {
    return (List<Map<String, Object>>) cas(fichier).get("cas");
  }

  @SuppressWarnings("unchecked")
  static Map<String, String> reference(int id) {
    Map<String, Object> d = Config.lireListe("donnees", "demandes.json").stream().filter(x -> ((Number) x.get("id")).intValue() == id).findFirst().orElseThrow();
    Map<String, String> f = new LinkedHashMap<>();
    ((Map<String, Object>) d.get("formulaire")).forEach((k, v) -> f.put(k, String.valueOf(v)));
    return f;
  }

  static DepotSqlite depot() {
    return new DepotSqlite(":memory:");
  }

  static Traiter.Dependances dependances(DepotSqlite depot) {
    List<Demande.Client> clients = Config.lireListe("donnees", "clients.json").stream().map(Demande.Client::depuis).toList();
    return new Traiter.Dependances(new MoteurApi(), depot, clients, LocalDate.parse("2026-11-14"));
  }
}
