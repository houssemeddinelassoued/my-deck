namespace Guichet.Domaine;

// Types du domaine Guichet. Le contrat de référence est contrats/demande.schema.json.
//
// Une demande brute (formulaire) est un Dictionary<string, string> : nom, entreprise, email, telephone,
// date_souhaitee, budget, message. Les faits extraits par Claude et les demandes enregistrées sont des
// Dictionary<string, object?> dont les clés suivent le contrat.

/// <summary>Budget normalisé : montant et devise (TND ou EUR).</summary>
public sealed record Budget(double Montant, string Devise);

/// <summary>Résultat de Normaliseur.Normaliser : chaque champ est propre, ou null s'il est illisible.</summary>
public sealed record Normalisee(
    string? Email,          // minuscules, ou null
    string? Telephone,      // E.164 : +216XXXXXXXX ou +33XXXXXXXXX, ou null
    string? DateSouhaitee,  // AAAA-MM-JJ, ou null
    Budget? Budget);

/// <summary>Un client d'Oasis Digital (donnees/clients.json).</summary>
public sealed record Client(string Id, string Nom, string Domaine, string Contrat)
{
    public static Client Depuis(object? o)
    {
        var m = (Dictionary<string, object?>)o!;
        return new Client((string)m["id"]!, (string)m["nom"]!, (string)m["domaine"]!, (string)m["contrat"]!);
    }
}
