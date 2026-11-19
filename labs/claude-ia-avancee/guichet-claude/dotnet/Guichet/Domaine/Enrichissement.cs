namespace Guichet.Domaine;

/// <summary>
/// Point d'extension : calcule les champs « code » du contrat (x-source: code) avant l'enregistrement.
/// Pour l'instant, aucun champ calculé.
/// </summary>
public static class Enrichissement
{
    public static Dictionary<string, object?> Enrichir(Dictionary<string, object?> demande) => demande;
}
