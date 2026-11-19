package guichet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import guichet.moteurs.MoteurApi;
import guichet.pipeline.ErreurValidation;
import guichet.pipeline.Extraction;
import java.util.Map;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A3.2] Extraction structurée : sorties conformes au contrat, refus des demandes incomplètes. */
@Tag("A3.2")
class ExtractionTest {
  @Test
  void devisSahel() {
    Map<String, Object> faits = Extraction.extraire(new MoteurApi(), Commun.reference(3));
    assertEquals("devis", faits.get("type"));
    assertEquals("Sahel Logistique", faits.get("client"));
  }

  @Test
  void demandeIncompleteRefusee() {
    assertThrows(ErreurValidation.class, () -> Extraction.extraire(new MoteurApi(), Commun.reference(12)));
  }
}
