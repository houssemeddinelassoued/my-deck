namespace Guichet.Domaine;

/// <summary>
/// Atelier 1 · ce fichier est GÉNÉRÉ par Claude : node guichet.mjs generer normaliser v1 (puis v2, v3).
/// Ne l'écrivez pas à la main : améliorez le prompt.
/// </summary>
public static class Normaliseur
{
    public static Normalisee Normaliser(IReadOnlyDictionary<string, string> brute, DateOnly aujourdhui) =>
        AFaire.Completer<Normalisee>($"A1.2 : Normaliseur.Normaliser ({brute.Count} champs, {aujourdhui:yyyy-MM-dd})");
}
