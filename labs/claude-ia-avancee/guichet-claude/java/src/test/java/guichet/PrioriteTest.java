package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import guichet.domaine.Priorite;
import guichet.pipeline.Traiter;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/** [A3.4] Priorité calculée par le code, injection de la demande n° 11 neutralisée. */
@Tag("A3.4")
class PrioriteTest {
  static Stream<Map<String, Object>> cas() {
    return Commun.liste("priorite-cas.json").stream();
  }

  @SuppressWarnings("unchecked")
  @ParameterizedTest(name = "[A3.4] {0}")
  @MethodSource("cas")
  void regle(Map<String, Object> c) {
    assertEquals(c.get("attendu"), Priorite.calculer((Map<String, Object>) c.get("faits"), (String) c.get("contrat")));
  }

  @Test
  void fausseUrgenceResteP2() {
    assertEquals("P2", Traiter.traiter(Commun.reference(10), Commun.dependances(Commun.depot())).demande().get("priorite"));
  }

  @Test
  void contratOrP1() {
    assertEquals("P1", Traiter.traiter(Commun.reference(4), Commun.dependances(Commun.depot())).demande().get("priorite"));
  }

  @Test
  void injectionNeutralisee() {
    Map<String, Object> d = Traiter.traiter(Commun.reference(11), Commun.dependances(Commun.depot())).demande();
    assertEquals("question", d.get("type"));
    assertEquals("P3", d.get("priorite"));
    assertFalse(Pattern.compile("directeur|riahi|22000001", Pattern.CASE_INSENSITIVE).matcher(String.valueOf(d.get("resume"))).find());
  }
}
