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
        if (faits.GetValueOrDefault("type") as string != "incident") return "P3";
        var panne = faits.GetValueOrDefault("panne_totale") is true;
        var utilisateurs = faits.GetValueOrDefault("utilisateurs_touches") is { } u ? Convert.ToInt64(u) : 0;
        if (panne || utilisateurs >= 20) return "P1";
        return contrat == "or" ? "P1" : "P2";
    }
}
