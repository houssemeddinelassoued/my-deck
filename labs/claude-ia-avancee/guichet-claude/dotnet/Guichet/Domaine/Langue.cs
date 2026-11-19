namespace Guichet.Domaine;

/// <summary>Défi final (Atelier 5) · langue de la demande et équipe de routage.</summary>
public static class Langue
{
    public static string Detecter(string? texte) => AFaire.Completer<string>($"A5 : Langue.Detecter ({texte?.Length ?? 0} caractères)");

    public static string EquipePour(string langue) => AFaire.Completer<string>($"A5 : Langue.EquipePour ({langue})");
}
