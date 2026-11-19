using System.Globalization;
using System.Text;

namespace Guichet.Depot;

/// <summary>
/// Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…).
/// Recherche partielle, insensible à la casse et aux accents ; filtre vide = tout.
/// </summary>
public static class Filtre
{
    private static string Simplifier(object? s) =>
        new string((s?.ToString() ?? "").Normalize(NormalizationForm.FormD).Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray()).ToLowerInvariant().Trim();

    public static List<Dictionary<string, object?>> ParClient(List<Dictionary<string, object?>> demandes, string? client)
    {
        var cherche = Simplifier(client);
        if (cherche.Length == 0) return demandes;
        return demandes.Where(d => Simplifier(d.GetValueOrDefault("client")).Contains(cherche)).ToList();
    }
}
