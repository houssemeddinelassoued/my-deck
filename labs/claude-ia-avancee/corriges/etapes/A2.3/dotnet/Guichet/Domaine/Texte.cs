namespace Guichet.Domaine;

/// <summary>
/// Tâche de la boucle (Atelier 2, étape A2.3) : écrit par Claude via
/// node guichet.mjs boucle taches/tronquer-resume.md
/// </summary>
public static class Texte
{
    public static string TronquerResume(string? texte, int max = 280)
    {
        var t = (texte ?? "").Trim();
        if (t.Length <= max) return t;
        var coupe = t[..(max - 1)];
        var espace = coupe.LastIndexOf(' ');
        if (espace > 0) coupe = coupe[..espace];
        return coupe.TrimEnd() + "…";
    }
}
