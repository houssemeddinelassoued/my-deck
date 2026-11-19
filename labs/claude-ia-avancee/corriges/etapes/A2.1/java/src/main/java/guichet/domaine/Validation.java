package guichet.domaine;

import guichet.Contrat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Atelier 2, étape A2.1 · validation stricte par le contrat (sous-ensemble de JSON Schema).
 * Renvoie la liste des écarts : vide = conforme. Ne lève jamais d'exception pour une donnée invalide.
 */
public final class Validation {
  private Validation() {}

  public static String typeJson(Object v) {
    if (v == null) return "null";
    if (v instanceof Boolean) return "boolean";
    if (v instanceof Integer || v instanceof Long) return "integer";
    if (v instanceof Number n) return n.doubleValue() == Math.rint(n.doubleValue()) ? "integer" : "number";
    if (v instanceof String) return "string";
    if (v instanceof List<?>) return "array";
    if (v instanceof Map<?, ?>) return "object";
    return v.getClass().getSimpleName();
  }

  @SuppressWarnings("unchecked")
  public static List<String> valider(Object objet, Map<String, Object> schema) {
    if (!(objet instanceof Map<?, ?>)) return List.of("la sortie n’est pas un objet JSON");
    Map<String, Object> o = (Map<String, Object>) objet;
    Map<String, Map<String, Object>> props = Contrat.proprietes(schema);
    List<String> erreurs = new ArrayList<>();

    for (String r : Contrat.requis(schema)) if (!o.containsKey(r)) erreurs.add(r + " : champ requis manquant");

    if (Boolean.FALSE.equals(schema.get("additionalProperties"))) {
      for (String k : o.keySet()) {
        if (!props.containsKey(k)) erreurs.add(k + " : champ non prévu par le contrat");
      }
    }

    for (var e : props.entrySet()) {
      String k = e.getKey();
      Map<String, Object> d = e.getValue();
      if (!o.containsKey(k)) continue;
      Object v = o.get(k);
      Object t = d.get("type");
      if (t != null) {
        List<String> types = t instanceof List<?> l ? (List<String>) l : List.of(t.toString());
        String tv = typeJson(v);
        if (types.stream().noneMatch(x -> x.equals(tv) || (x.equals("number") && tv.equals("integer")))) {
          erreurs.add(k + " : type " + tv + " au lieu de " + String.join(" | ", types));
        }
      }
      if (d.containsKey("enum") && !((List<Object>) d.get("enum")).contains(v)) {
        erreurs.add(k + " : valeur « " + v + " » hors liste " + d.get("enum"));
      }
      if (v instanceof String s && d.containsKey("minLength") && s.length() < ((Number) d.get("minLength")).intValue()) {
        erreurs.add(k + " : trop court (minimum " + d.get("minLength") + ")");
      }
      if (v instanceof String s && d.containsKey("maxLength") && s.length() > ((Number) d.get("maxLength")).intValue()) {
        erreurs.add(k + " : trop long (maximum " + d.get("maxLength") + ")");
      }
    }
    return erreurs;
  }
}
