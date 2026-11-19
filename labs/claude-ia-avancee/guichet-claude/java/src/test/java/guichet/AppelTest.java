package guichet;

import static org.junit.jupiter.api.Assertions.assertTrue;

import guichet.moteurs.MoteurApi;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

/** [A3.1] Premier appel par le SDK officiel (sur le simulateur : ANTHROPIC_BASE_URL). */
@Tag("A3.1")
class AppelTest {
  @Test
  void appelSimpleRenvoieLeTexte() {
    String texte = new MoteurApi().appelSimple("Bonjour, ici Guichet");
    assertTrue(texte != null && !texte.isEmpty(), "réponse vide");
    assertTrue(texte.contains("Guichet"));
  }
}
