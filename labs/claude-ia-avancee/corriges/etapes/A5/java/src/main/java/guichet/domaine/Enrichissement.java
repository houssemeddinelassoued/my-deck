package guichet.domaine;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Point d'extension : calcule les champs « code » du contrat (x-source: code) avant l'enregistrement.
 * A5 : langue du message et équipe de routage.
 */
public final class Enrichissement {
  private Enrichissement() {}

  public static Map<String, Object> enrichir(Map<String, Object> demande) {
    Map<String, Object> d = new LinkedHashMap<>(demande);
    String langue = Langue.detecter(String.valueOf(demande.getOrDefault("message", "")));
    d.put("langue", langue);
    d.put("equipe", Langue.equipePour(langue));
    return d;
  }
}
