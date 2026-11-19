package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;

import guichet.prompts.Exemples;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/** [A1.3] Exemples dynamiques : sélection par mots-clés, un exemple par type, tri stable. */
@Tag("A1.3")
class ExemplesTest {
  static Stream<Map<String, Object>> cas() {
    return Commun.liste("exemples-cas.json").stream();
  }

  @ParameterizedTest(name = "[A1.3] {0}")
  @MethodSource("cas")
  void choisit(Map<String, Object> c) {
    List<String> ids = Exemples.choisir((String) c.get("texte"), Exemples.lire(), ((Number) c.get("k")).intValue()).stream().map(Exemples.Exemple::id).toList();
    assertEquals(c.get("attendu"), ids);
  }
}
