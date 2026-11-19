package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import guichet.domaine.Demande;
import guichet.domaine.Normaliseur;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/** [A1.2] Normalisation : 24 cas (donnees/normalisation-cas.json), un test par cas. */
@Tag("A1.2")
class NormalisationTest {
  static Stream<Map<String, Object>> cas() {
    return Commun.liste("normalisation-cas.json").stream();
  }

  @ParameterizedTest(name = "[A1.2] {0}")
  @MethodSource("cas")
  void normalise(Map<String, Object> c) {
    LocalDate aujourdhui = LocalDate.parse((String) Commun.cas("normalisation-cas.json").get("aujourdhui"));
    String categorie = (String) c.get("categorie");
    Demande.Normalisee n = Normaliseur.normaliser(Map.of("message", "", categorie, (String) c.get("entree")), aujourdhui);
    Object attendu = c.get("attendu");
    switch (categorie) {
      case "telephone" -> assertEquals(attendu, n.telephone());
      case "email" -> assertEquals(attendu, n.email());
      case "date_souhaitee" -> assertEquals(attendu, n.dateSouhaitee());
      case "budget" -> {
        if (attendu == null) assertNull(n.budget());
        else {
          Map<?, ?> b = (Map<?, ?>) attendu;
          assertNotNull(n.budget());
          assertEquals(((Number) b.get("montant")).doubleValue(), n.budget().montant(), 1e-9);
          assertEquals(b.get("devise"), n.budget().devise());
        }
      }
      default -> throw new IllegalArgumentException(categorie + " " + List.of());
    }
  }
}
