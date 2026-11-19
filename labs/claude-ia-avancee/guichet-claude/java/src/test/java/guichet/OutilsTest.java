package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import guichet.depot.DepotSqlite;
import guichet.pipeline.Traiter;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A3.3] Boucle d'outils : chercher_client puis enregistrer_demande, jusqu'à end_turn. */
@Tag("A3.3")
class OutilsTest {
  @Test
  void atlasIndustrie() {
    DepotSqlite depot = Commun.depot();
    Traiter.Resultat r = Traiter.traiter(Commun.reference(1), Commun.dependances(depot));
    assertTrue(r.nouvelle());
    assertEquals("C-0142", r.demande().get("client_id"));
    assertEquals("incident", r.demande().get("type"));
    assertEquals(1, depot.lister().size());
  }

  @Test
  void balticFreight() {
    Traiter.Resultat r = Traiter.traiter(Commun.reference(8), Commun.dependances(Commun.depot()));
    assertEquals("C-0302", r.demande().get("client_id"));
    assertEquals("devis", r.demande().get("type"));
  }
}
