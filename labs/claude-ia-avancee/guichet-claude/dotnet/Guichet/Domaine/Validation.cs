namespace Guichet.Domaine;

/// <summary>
/// Atelier 2, étape A2.1 · validation stricte par le contrat (sous-ensemble de JSON Schema).
/// Renvoie la liste des écarts : vide = conforme. Ne lève jamais d'exception pour une donnée invalide.
/// </summary>
public static class Validation
{
    public static string TypeJson(object? v) => v switch
    {
        null => "null",
        bool => "boolean",
        int or long => "integer",
        double d => d == Math.Round(d) ? "integer" : "number",
        string => "string",
        System.Collections.IList => "array",
        IDictionary<string, object?> => "object",
        _ => v.GetType().Name,
    };

    public static List<string> Valider(object? objet, Dictionary<string, object?> schema)
    {
        if (objet is not IDictionary<string, object?> o) return ["la sortie n’est pas un objet JSON"];
        var props = Contrat.Proprietes(schema);
        var erreurs = new List<string>();

        foreach (var r in Contrat.Requis(schema)) if (!o.ContainsKey(r)) erreurs.Add($"{r} : champ requis manquant");

        if (schema.TryGetValue("additionalProperties", out var a) && a is false)
            foreach (var k in o.Keys)
                if (AFaire.Completer<bool>("A2.1 : ce champ est-il absent du contrat ?")) erreurs.Add($"{k} : champ non prévu par le contrat");

        foreach (var (k, d) in props)
        {
            if (!o.TryGetValue(k, out var v)) continue;
            if (d.TryGetValue("type", out var t) && t is not null)
            {
                var types = t is List<object?> l ? l.Select(x => (string)x!).ToList() : [(string)t];
                var tv = TypeJson(v);
                if (!types.Any(x => x == tv || (x == "number" && tv == "integer"))) erreurs.Add($"{k} : type {tv} au lieu de {string.Join(" | ", types)}");
            }
            if (d.ContainsKey("enum") && AFaire.Completer<bool>("A2.1 : la valeur est-elle hors de l’énumération ?"))
                erreurs.Add($"{k} : valeur « {v} » hors liste");
            if (v is string s1 && d.ContainsKey("minLength") && AFaire.Completer<bool>("A2.1 : la chaîne est-elle trop courte ?"))
                erreurs.Add($"{k} : trop court (minimum {d["minLength"]})");
            if (v is string s2 && d.TryGetValue("maxLength", out var max) && s2.Length > Convert.ToInt32(max))
                erreurs.Add($"{k} : trop long (maximum {max})");
        }
        return erreurs;
    }
}
