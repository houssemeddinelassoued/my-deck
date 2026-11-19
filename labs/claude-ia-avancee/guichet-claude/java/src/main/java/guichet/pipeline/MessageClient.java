package guichet.pipeline;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle. */
public final class MessageClient {
  private MessageClient() {}

  private static final List<String> CHAMPS = List.of("nom", "entreprise", "email", "telephone", "message");

  public static String construire(Map<String, String> formulaire) {
    // Provisoire : le texte du client est posé tel quel, au milieu de nos consignes.
    return CHAMPS.stream().map(c -> c + ": " + formulaire.getOrDefault(c, "")).collect(Collectors.joining("\n"));
  }
}
