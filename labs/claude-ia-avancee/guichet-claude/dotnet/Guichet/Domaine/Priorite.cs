namespace Guichet.Domaine;

/// <summary>
/// Atelier 3, étape A3.4 · la priorité est une règle métier : c'est le code qui décide, pas le modèle.
/// Règle : hors incident → P3 ; incident avec panne totale ou au moins 20 utilisateurs touchés → P1 ;
/// sinon P1 pour un contrat « or », P2 pour les autres.
/// </summary>
public static class Priorite
{
    public static string Calculer(IReadOnlyDictionary<string, object?> faits, string? contrat)
    {
        // Provisoire : on fait confiance à l'avis du modèle. À remplacer par la règle ci-dessus (A3.4).
        _ = contrat;
        return faits.TryGetValue("priorite", out var p) && p is string s ? s : "P2";
    }
}
