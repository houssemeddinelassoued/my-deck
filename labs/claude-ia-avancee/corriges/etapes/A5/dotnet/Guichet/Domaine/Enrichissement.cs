namespace Guichet.Domaine;

/// <summary>
/// Point d'extension : calcule les champs « code » du contrat (x-source: code) avant l'enregistrement.
/// A5 : langue du message et équipe de routage.
/// </summary>
public static class Enrichissement
{
    public static Dictionary<string, object?> Enrichir(Dictionary<string, object?> demande)
    {
        var langue = Langue.Detecter(demande.GetValueOrDefault("message") as string ?? "");
        return new Dictionary<string, object?>(demande) { ["langue"] = langue, ["equipe"] = Langue.EquipePour(langue) };
    }
}
