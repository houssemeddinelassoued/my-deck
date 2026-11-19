package guichet.prompts;

import guichet.Config;
import guichet.pipeline.MessageClient;
import java.util.Map;

/** Rend le prompt d'extraction (prompts/extraction.md) pour une demande du formulaire. */
public final class Gabarit {
  private Gabarit() {}

  public static String rendreExtraction(Map<String, String> formulaire) {
    String prompt = Config.lireTexte("prompts", "extraction.md");
    if (prompt.contains("{{exemples}}")) {
      prompt = prompt.replace("{{exemples}}", Exemples.rendre(Exemples.choisir(formulaire.getOrDefault("message", ""), Exemples.lire(), 3)));
    }
    return prompt.replace("{{demande}}", MessageClient.construire(formulaire));
  }
}
