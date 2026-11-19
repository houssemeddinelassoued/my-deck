package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;

import guichet.depot.DepotSqlite;
import guichet.pipeline.Traiter;
import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A4.2] Le champ site_web (ajouté au contrat par la Skill) va du formulaire à la base. */
@Tag("A4.2")
class SitewebTest {
  @Test
  void siteWebEnregistre() {
    DepotSqlite depot = Commun.depot();
    Map<String, String> formulaire = new LinkedHashMap<>(Commun.reference(6));
    formulaire.put("site_web", "https://djerba-sante.tn");
    Map<String, Object> d = Traiter.traiter(formulaire, Commun.dependances(depot)).demande();
    assertEquals("https://djerba-sante.tn", d.get("site_web"));
    assertEquals("https://djerba-sante.tn", depot.lister().get(0).get("site_web"));
  }
}
