package guichet;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Le contrat (contrats/demande.schema.json) est relu à chaque appel : le modifier suffit à faire évoluer
 * l'application (champs extraits, colonnes de la base, champs recopiés du formulaire).
 */
public final class Contrat {
  private Contrat() {}

  public static Map<String, Object> chargerSchema() {
    return Config.lireObjet("contrats", "demande.schema.json");
  }

  @SuppressWarnings("unchecked")
  public static Map<String, Map<String, Object>> proprietes(Map<String, Object> schema) {
    return (Map<String, Map<String, Object>>) schema.getOrDefault("properties", Map.of());
  }

  @SuppressWarnings("unchecked")
  public static List<String> requis(Map<String, Object> schema) {
    return (List<String>) schema.getOrDefault("required", List.of());
  }

  /** Source d'un champ : « modele » (extrait par Claude, par défaut), « formulaire » ou « code ». */
  public static String sourceDe(Map<String, Object> schema, String champ) {
    Object s = proprietes(schema).getOrDefault(champ, Map.of()).get("x-source");
    return s == null ? "modele" : s.toString();
  }

  public static List<String> champsDeSource(Map<String, Object> schema, String source) {
    List<String> out = new ArrayList<>();
    for (String c : proprietes(schema).keySet()) if (sourceDe(schema, c).equals(source)) out.add(c);
    return out;
  }

  /** Ce que le modèle reçoit : la forme des champs « modele », sans les x-* ni les longueurs (vérifiées par le code). */
  public static Map<String, Object> schemaPourModele(Map<String, Object> schema) {
    Map<String, Object> props = new LinkedHashMap<>();
    for (String champ : champsDeSource(schema, "modele")) {
      Map<String, Object> d = new LinkedHashMap<>(proprietes(schema).get(champ));
      d.keySet().removeIf(k -> k.startsWith("x-") || k.equals("minLength") || k.equals("maxLength"));
      props.put(champ, d);
    }
    Map<String, Object> s = new LinkedHashMap<>();
    s.put("type", "object");
    s.put("properties", props);
    s.put("required", requis(schema).stream().filter(props::containsKey).toList());
    if (Boolean.FALSE.equals(schema.get("additionalProperties"))) s.put("additionalProperties", false);
    return s;
  }

  /** Le contrat restreint aux champs « modele » : pour valider ce que Claude a extrait. */
  public static Map<String, Object> contratModele(Map<String, Object> schema) {
    List<String> garder = champsDeSource(schema, "modele");
    Map<String, Object> s = new LinkedHashMap<>(schema);
    Map<String, Object> props = new LinkedHashMap<>();
    for (String c : garder) props.put(c, proprietes(schema).get(c));
    s.put("properties", props);
    s.put("required", requis(schema).stream().filter(garder::contains).toList());
    return s;
  }
}
