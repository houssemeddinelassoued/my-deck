namespace Guichet.Depot;

/// <summary>Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…).</summary>
public static class Filtre
{
    // Pas encore de filtre : toutes les demandes sont renvoyées.
    public static List<Dictionary<string, object?>> ParClient(List<Dictionary<string, object?>> demandes, string? client) => demandes;
}
