namespace Guichet;

/// <summary>
/// Le contrat (contrats/demande.schema.json) est relu à chaque appel : le modifier suffit à faire évoluer
/// l'application (champs extraits, colonnes de la base, champs recopiés du formulaire).
/// </summary>
public static class Contrat
{
    public static Dictionary<string, object?> ChargerSchema() => Config.LireObjet("contrats", "demande.schema.json");

    public static Dictionary<string, Dictionary<string, object?>> Proprietes(Dictionary<string, object?> schema) =>
        schema.TryGetValue("properties", out var p) && p is Dictionary<string, object?> d
            ? d.ToDictionary(kv => kv.Key, kv => (Dictionary<string, object?>)kv.Value!)
            : [];

    public static List<string> Requis(Dictionary<string, object?> schema) =>
        schema.TryGetValue("required", out var r) && r is List<object?> l ? l.Select(x => (string)x!).ToList() : [];

    /// <summary>Source d'un champ : « modele » (extrait par Claude, par défaut), « formulaire » ou « code ».</summary>
    public static string SourceDe(Dictionary<string, object?> schema, string champ) =>
        Proprietes(schema).TryGetValue(champ, out var d) && d.TryGetValue("x-source", out var s) && s is string t ? t : "modele";

    public static List<string> ChampsDeSource(Dictionary<string, object?> schema, string source) =>
        Proprietes(schema).Keys.Where(c => SourceDe(schema, c) == source).ToList();

    /// <summary>Ce que le modèle reçoit : la forme des champs « modele », sans les x-* ni les longueurs (vérifiées par le code).</summary>
    public static Dictionary<string, object?> SchemaPourModele(Dictionary<string, object?> schema)
    {
        var props = new Dictionary<string, object?>();
        foreach (var champ in ChampsDeSource(schema, "modele"))
            props[champ] = Proprietes(schema)[champ].Where(kv => !kv.Key.StartsWith("x-") && kv.Key is not ("minLength" or "maxLength")).ToDictionary(kv => kv.Key, kv => kv.Value);
        var s = new Dictionary<string, object?>
        {
            ["type"] = "object",
            ["properties"] = props,
            ["required"] = Requis(schema).Where(props.ContainsKey).Cast<object?>().ToList(),
        };
        if (schema.TryGetValue("additionalProperties", out var a) && a is false) s["additionalProperties"] = false;
        return s;
    }

    /// <summary>Le contrat restreint aux champs « modele » : pour valider ce que Claude a extrait.</summary>
    public static Dictionary<string, object?> ContratModele(Dictionary<string, object?> schema)
    {
        var garder = ChampsDeSource(schema, "modele");
        return new Dictionary<string, object?>(schema)
        {
            ["properties"] = Proprietes(schema).Where(kv => garder.Contains(kv.Key)).ToDictionary(kv => kv.Key, kv => (object?)kv.Value),
            ["required"] = Requis(schema).Where(garder.Contains).Cast<object?>().ToList(),
        };
    }
}
