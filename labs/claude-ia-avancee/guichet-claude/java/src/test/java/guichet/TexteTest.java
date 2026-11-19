package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import guichet.domaine.Texte;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/** [BOUCLE] Tâche de la boucle : tronquerResume (donnees/texte-cas.json). */
@Tag("BOUCLE")
class TexteTest {
  static Stream<Map<String, Object>> cas() {
    return Commun.liste("texte-cas.json").stream();
  }

  @ParameterizedTest(name = "[BOUCLE] {0}")
  @MethodSource("cas")
  void tronque(Map<String, Object> c) {
    int max = ((Number) c.get("max")).intValue();
    String r = Texte.tronquerResume((String) c.get("texte"), max);
    assertEquals(c.get("attendu"), r);
    assertTrue(r.length() <= max);
  }
}
