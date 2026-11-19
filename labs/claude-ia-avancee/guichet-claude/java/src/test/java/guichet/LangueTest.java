package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;

import guichet.domaine.Langue;
import guichet.pipeline.Traiter;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/** [A5] Défi final : langue détectée et équipe de routage, de bout en bout. */
@Tag("A5")
class LangueTest {
  static Stream<Map<String, Object>> cas() {
    return Commun.liste("langue-cas.json").stream();
  }

  @ParameterizedTest(name = "[A5] {0}")
  @MethodSource("cas")
  void detecte(Map<String, Object> c) {
    String langue = Langue.detecter((String) c.get("texte"));
    assertEquals(c.get("langue"), langue);
    assertEquals(c.get("equipe"), Langue.equipePour(langue));
  }

  @Test
  void routageDeBoutEnBout() {
    Map<String, Object> d = Traiter.traiter(Commun.reference(5), Commun.dependances(Commun.depot())).demande();
    assertEquals("en", d.get("langue"));
    assertEquals("Europe", d.get("equipe"));
  }
}
