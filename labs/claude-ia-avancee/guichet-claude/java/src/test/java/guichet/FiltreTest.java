package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;

import guichet.depot.Filtre;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A4.5] Filtre du tableau de bord par client. */
@Tag("A4.5")
class FiltreTest {
  private static final List<Map<String, Object>> DEMANDES = List.of(
      Map.of("id", "D-1", "client", "Médina Retail"), Map.of("id", "D-2", "client", "Atlas Industrie"), Map.of("id", "D-3", "client", "Médina Retail"));

  private static List<Object> ids(List<Map<String, Object>> l) {
    return l.stream().map(d -> d.get("id")).toList();
  }

  @Test
  void recherchePartielle() {
    assertEquals(List.of("D-1", "D-3"), ids(Filtre.parClient(DEMANDES, "medina")));
    assertEquals(List.of("D-2"), ids(Filtre.parClient(DEMANDES, "ATLAS")));
  }

  @Test
  void filtreVide() {
    assertEquals(3, Filtre.parClient(DEMANDES, "").size());
    assertEquals(3, Filtre.parClient(DEMANDES, null).size());
  }

  @Test
  void aucunResultat() {
    assertEquals(List.of(), Filtre.parClient(DEMANDES, "zzz"));
  }
}
