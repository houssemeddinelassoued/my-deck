using System.Text.Json;

namespace Guichet;

/// <summary>Chemins et réglages communs. GUICHET_RACINE est fourni par node guichet.mjs.</summary>
public static class Config
{
    public static readonly string Racine = TrouverRacine();
    public static readonly string Modele = Environment.GetEnvironmentVariable("GUICHET_MODELE") ?? "claude-sonnet-5-5";

    private static string TrouverRacine()
    {
        var r = Environment.GetEnvironmentVariable("GUICHET_RACINE");
        if (!string.IsNullOrWhiteSpace(r)) return r;
        // Repli : on remonte jusqu'au dossier qui contient guichet.mjs.
        for (var d = new DirectoryInfo(AppContext.BaseDirectory); d != null; d = d.Parent)
            if (File.Exists(Path.Combine(d.FullName, "guichet.mjs"))) return d.FullName;
        return Directory.GetParent(Directory.GetCurrentDirectory())!.FullName;
    }

    public static string Chemin(params string[] parties) => Path.Combine([Racine, .. parties]);
    public static string LireTexte(params string[] parties) => File.ReadAllText(Chemin(parties));
    public static Dictionary<string, object?> LireObjet(params string[] parties) => Json.Objet(LireTexte(parties));
    public static List<object?> LireListe(params string[] parties) => Json.Liste(LireTexte(parties));

    /// <summary>Date du jour à Tunis.</summary>
    public static DateOnly Aujourdhui()
    {
        try { return DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"))); }
        catch (TimeZoneNotFoundException) { return DateOnly.FromDateTime(DateTime.Now); }
    }
}

/// <summary>Un trou de l'énoncé n'est pas encore complété.</summary>
public sealed class NonImplemente(string quoi) : Exception($"À compléter · {quoi}");

/// <summary>Marque un trou de l'énoncé : le code compile, mais lève une erreur claire à l'exécution.</summary>
public static class AFaire
{
    public static T Completer<T>(string quoi) => throw new NonImplemente(quoi);
}

/// <summary>JSON ↔ objets simples (Dictionary, List, string, long, double, bool, null).</summary>
public static class Json
{
    public static readonly JsonSerializerOptions Options = new() { Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping };

    public static object? VersObjet(JsonElement e) => e.ValueKind switch
    {
        JsonValueKind.Object => e.EnumerateObject().ToDictionary(p => p.Name, p => VersObjet(p.Value)),
        JsonValueKind.Array => e.EnumerateArray().Select(VersObjet).ToList(),
        JsonValueKind.String => e.GetString(),
        JsonValueKind.Number => e.TryGetInt64(out var l) ? l : e.GetDouble(),
        JsonValueKind.True => true,
        JsonValueKind.False => false,
        _ => null,
    };

    public static Dictionary<string, object?> Objet(string json) => (Dictionary<string, object?>)VersObjet(JsonDocument.Parse(json).RootElement)!;
    public static List<object?> Liste(string json) => (List<object?>)VersObjet(JsonDocument.Parse(json).RootElement)!;
    public static string Ecrire(object? o) => JsonSerializer.Serialize(o, Options);
    public static JsonElement Element(object? o) => JsonSerializer.SerializeToElement(o, Options);
}
