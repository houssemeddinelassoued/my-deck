namespace Guichet.Domaine;

/// <summary>
/// Tâche de la boucle (Atelier 2, étape A2.3) : ce fichier est écrit par Claude via
/// node guichet.mjs boucle taches/tronquer-resume.md
/// </summary>
public static class Texte
{
    public static string TronquerResume(string? texte, int max = 280) =>
        AFaire.Completer<string>($"BOUCLE : TronquerResume ({texte?.Length ?? 0} caractères, max {max})");
}
