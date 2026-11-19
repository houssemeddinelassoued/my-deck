package guichet.pipeline;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle.
 * Le texte du formulaire est une DONNÉE non fiable : il est délimité, et le prompt le dit.
 */
public final class MessageClient {
  private MessageClient() {}

  private static final List<String> CHAMPS = List.of("nom", "entreprise", "email", "telephone", "message");

  // On retire toute balise que le client aurait glissée pour « sortir » du bloc.
  private static String propre(String s) {
    return s == null ? "" : s.replaceAll("(?i)</?demande_client>", "");
  }

  public static String construire(Map<String, String> formulaire) {
    List<String> lignes = new ArrayList<>();
    lignes.add("<demande_client>");
    for (String c : CHAMPS) lignes.add(c + ": " + propre(formulaire.get(c)));
    lignes.add("</demande_client>");
    return String.join("\n", lignes);
  }
}
