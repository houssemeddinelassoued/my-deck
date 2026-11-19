package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;

import guichet.domaine.Validation;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/** [A2.1] Validation par le contrat : chaque cas de donnees/validation-cas.json. */
@Tag("A2.1")
class ValidationTest {
  static Stream<Map<String, Object>> cas() {
    return Commun.liste("validation-cas.json").stream();
  }

  @SuppressWarnings("unchecked")
  @ParameterizedTest(name = "[A2.1] {0}")
  @MethodSource("cas")
  void valide(Map<String, Object> c) {
    Map<String, Object> objet = new LinkedHashMap<>((Map<String, Object>) Commun.cas("validation-cas.json").get("base"));
    objet.putAll((Map<String, Object>) c.getOrDefault("modifs", Map.of()));
    for (Object k : (List<Object>) c.getOrDefault("supprimer", List.of())) objet.remove((String) k);
    List<String> erreurs = Validation.valider(objet, Contrat.chargerSchema());
    assertEquals(c.get("valide"), erreurs.isEmpty(), "écarts trouvés : " + erreurs);
  }
}
