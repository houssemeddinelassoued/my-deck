package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import guichet.depot.DepotSqlite;
import guichet.pipeline.Traiter;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A3.5] Idempotence : la même demande soumise deux fois n'est enregistrée qu'une fois. */
@Tag("A3.5")
class IdempotenceTest {
  @Test
  void deuxiemeEnvoi() {
    DepotSqlite depot = Commun.depot();
    Traiter.Resultat premier = Traiter.traiter(Commun.reference(2), Commun.dependances(depot));
    Traiter.Resultat second = Traiter.traiter(Commun.reference(2), Commun.dependances(depot));
    assertFalse(second.nouvelle());
    assertEquals(premier.demande().get("id"), second.demande().get("id"));
    assertEquals(1, depot.lister().size());
  }
}
