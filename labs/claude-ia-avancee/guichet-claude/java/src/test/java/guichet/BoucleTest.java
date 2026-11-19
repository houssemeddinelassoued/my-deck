package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import guichet.outils.Boucle;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A2.3] Boucle générer → vérifier → corriger, avec un générateur et un vérificateur simulés. */
@Tag("A2.3")
class BoucleTest {
  @Test
  void sArreteAuPremierTourVert() {
    int[] tours = {0};
    Boucle.Resultat r = Boucle.boucle("t", (t, retours) -> tours[0]++, () -> new Boucle.Verification(tours[0] == 2, "sortie " + tours[0]), 3);
    assertTrue(r.ok());
    assertEquals(2, r.tour());
  }

  @Test
  void renvoieLaSortieExacte() {
    List<String> recus = new ArrayList<>();
    int[] n = {0};
    Boucle.boucle("t", (t, retours) -> recus.add(retours), () -> {
      n[0]++;
      return new Boucle.Verification(n[0] == 3, "✗ sql-concatene ligne " + n[0]);
    }, 3);
    assertEquals(List.of("", "✗ sql-concatene ligne 1", "✗ sql-concatene ligne 2"), recus);
  }

  @Test
  void echoueApresTroisTours() {
    Boucle.Resultat r = Boucle.boucle("t", (t, retours) -> {}, () -> new Boucle.Verification(false, "rouge"), 3);
    assertFalse(r.ok());
    assertEquals(3, r.historique().size());
  }
}
