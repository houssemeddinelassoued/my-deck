using System.Text.RegularExpressions;

namespace Guichet.Prompts;

/// <summary>Atelier 1, étape A1.3 · exemples dynamiques (few-shot) choisis par le code selon la demande.</summary>
public static class Exemples
{
    public sealed record Exemple(string Id, string Type, string Texte, object? Sortie);

    private static readonly HashSet<string> Stop = ["avec", "pour", "dans", "depuis", "nous", "notre", "votre", "vous", "sont", "plus", "cette", "mais", "the", "and", "with", "from", "this", "that", "have", "been", "merci", "bonjour", "pouvez", "pourriez"];

    /// <summary>Mots de 4 lettres ou plus, en minuscules, sans les mots vides. Fourni.</summary>
    public static HashSet<string> MotsCles(string? texte) =>
        Regex.Split((texte ?? "").ToLowerInvariant(), @"[^\p{L}\p{N}]+").Where(m => m.Length >= 4 && !Stop.Contains(m)).ToHashSet();

    public static List<Exemple> Lire() =>
        Config.LireTexte("donnees", "exemples.jsonl").Trim().Split('\n').Select(l =>
        {
            var o = Json.Objet(l);
            return new Exemple((string)o["id"]!, (string)o["type"]!, (string)o["texte"]!, o["sortie"]);
        }).ToList();

    /// <summary>
    /// Les k exemples les plus proches du texte, un seul par type.
    /// Score = nombre de mots-clés en commun ; à score égal, l'ordre du fichier est conservé.
    /// </summary>
    public static List<Exemple> Choisir(string? texte, List<Exemple> tous, int k = 3)
    {
        var mots = MotsCles(texte);
        var notes = tous.Select(ex => (Ex: ex, Score: AFaire.Completer<int>($"A1.3 : score = mots en commun ({mots.Count} mots-clés)"))).ToList();
        var triees = AFaire.Completer<IEnumerable<(Exemple Ex, int Score)>>($"A1.3 : ordre de tri ({notes.Count} notes)");
        var choisis = new List<Exemple>();
        foreach (var (ex, _) in triees)
        {
            if (choisis.Any(c => AFaire.Completer<bool>($"A1.3 : même type que {c.Id} ?"))) continue;
            choisis.Add(ex);
            if (choisis.Count == k) break;
        }
        return choisis;
    }

    public static string Rendre(IEnumerable<Exemple> exemples) =>
        string.Join("\n", exemples.Select(e => $"<exemple>\n<entree>{e.Texte}</entree>\n<sortie>{Json.Ecrire(e.Sortie)}</sortie>\n</exemple>"));
}
