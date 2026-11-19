namespace Guichet.Depot;

public interface IDepot
{
    /// <summary>Enregistre une demande et la renvoie complétée (id, cree_le, statut).</summary>
    Dictionary<string, object?> Inserer(Dictionary<string, object?> demande);

    /// <summary>Toutes les demandes, les plus récentes d'abord.</summary>
    List<Dictionary<string, object?>> Lister();

    /// <summary>La demande déjà enregistrée avec cette clé d'idempotence, ou null.</summary>
    Dictionary<string, object?>? ParCle(string cle);
}
