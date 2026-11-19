using Guichet.Domaine;
using Guichet.Moteurs;
using Guichet.Prompts;

namespace Guichet.Pipeline;

/// <summary>Atelier 3, étape A3.2 · extraction structurée : le modèle reçoit la forme, le code vérifie le contrat.</summary>
public static class Extraction
{
    public static async Task<Dictionary<string, object?>> Extraire(IMoteurClaude moteur, IReadOnlyDictionary<string, string> formulaire)
    {
        var schema = Contrat.ChargerSchema();
        var sortie = await moteur.Extraire(Gabarit.RendreExtraction(formulaire), Contrat.SchemaPourModele(schema));
        var erreurs = Validation.Valider(sortie, Contrat.ContratModele(schema));
        if (erreurs.Count > 0) throw new ErreurValidation(erreurs);
        return sortie;
    }
}
