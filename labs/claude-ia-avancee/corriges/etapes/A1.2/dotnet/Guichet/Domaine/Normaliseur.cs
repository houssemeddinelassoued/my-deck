using System.Globalization;
using System.Text.RegularExpressions;

namespace Guichet.Domaine;

/// <summary>Atelier 1 · version de référence (corrigé). En atelier, ce fichier est généré par Claude à partir du prompt v3.</summary>
public static class Normaliseur
{
    private static bool Vide(string? s) => string.IsNullOrWhiteSpace(s);
    private static string Espaces(string s) => s.Replace(' ', ' ').Replace(' ', ' ');

    public static string? Telephone(string? brut)
    {
        if (Vide(brut)) return null;
        var t = Regex.Replace(Espaces(brut!).Replace("(0)", ""), @"[\s.\-()]", "");
        Match m;
        if ((m = Regex.Match(t, @"^(?:\+|00)216(\d{8})$")).Success) return "+216" + m.Groups[1].Value;
        if (Regex.IsMatch(t, @"^[2-9]\d{7}$")) return "+216" + t;
        if ((m = Regex.Match(t, @"^(?:\+|00)33(\d{9})$")).Success) return "+33" + m.Groups[1].Value;
        if ((m = Regex.Match(t, @"^0(\d{9})$")).Success) return "+33" + m.Groups[1].Value;
        return null;
    }

    public static string? Email(string? brut)
    {
        if (Vide(brut)) return null;
        var e = Regex.Replace(Espaces(brut!), @"\s+", "").ToLowerInvariant();
        return Regex.IsMatch(e, @"^[^@\s]+@[^@\s]+\.[a-z]{2,}$") ? e : null;
    }

    private static string? Iso(int a, int m, int j)
    {
        try { return new DateOnly(a, m, j).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture); }
        catch (ArgumentOutOfRangeException) { return null; }
    }

    public static string? Date(string? brut, DateOnly aujourdhui)
    {
        if (Vide(brut)) return null;
        var t = Espaces(brut!).Trim().ToLowerInvariant();
        string Jour(DateOnly d) => d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        switch (t)
        {
            case "aujourd'hui" or "aujourd’hui": return Jour(aujourdhui);
            case "demain": return Jour(aujourdhui.AddDays(1));
            case "hier": return Jour(aujourdhui.AddDays(-1));
        }
        Match m;
        if ((m = Regex.Match(t, @"^(\d{4})-(\d{2})-(\d{2})$")).Success) return Iso(int.Parse(m.Groups[1].Value), int.Parse(m.Groups[2].Value), int.Parse(m.Groups[3].Value));
        if ((m = Regex.Match(t, @"^(\d{1,2})/(\d{1,2})/(\d{4})$")).Success) return Iso(int.Parse(m.Groups[3].Value), int.Parse(m.Groups[2].Value), int.Parse(m.Groups[1].Value));
        if ((m = Regex.Match(t, @"^(\d{1,2})/(\d{1,2})$")).Success) return Iso(aujourdhui.Year, int.Parse(m.Groups[2].Value), int.Parse(m.Groups[1].Value));
        return null;
    }

    public static Budget? BudgetDe(string? brut)
    {
        if (Vide(brut)) return null;
        var t = Espaces(brut!).ToLowerInvariant();
        string? devise = Regex.IsMatch(t, @"\b(dt|tnd|dinars?)\b") ? "TND" : Regex.IsMatch(t, @"€|\beur\b|\beuros?\b") ? "EUR" : null;
        var n = Regex.Match(t, @"\d[\d\s.,]*");
        if (devise is null || !n.Success) return null;
        var s = Regex.Replace(n.Value.Trim(), @"\s+", "");
        if (s.Contains('.') && s.Contains(',')) s = s.Replace(".", "").Replace(',', '.');
        else if (s.Contains(',')) s = s.Replace(',', '.');
        return double.TryParse(s, NumberStyles.Float, CultureInfo.InvariantCulture, out var montant) ? new Budget(montant, devise) : null;
    }

    public static Normalisee Normaliser(IReadOnlyDictionary<string, string> brute, DateOnly aujourdhui) => new(
        Email(brute.GetValueOrDefault("email")),
        Telephone(brute.GetValueOrDefault("telephone")),
        Date(brute.GetValueOrDefault("date_souhaitee"), aujourdhui),
        BudgetDe(brute.GetValueOrDefault("budget")));
}
