package guichet.domaine;

import java.util.Map;

/**
 * Point d'extension : calcule les champs « code » du contrat (x-source: code) avant l'enregistrement.
 * Pour l'instant, aucun champ calculé.
 */
public final class Enrichissement {
  private Enrichissement() {}

  public static Map<String, Object> enrichir(Map<String, Object> demande) {
    return demande;
  }
}
