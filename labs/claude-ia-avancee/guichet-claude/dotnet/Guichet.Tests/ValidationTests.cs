using Guichet.Domaine;

namespace Guichet.Tests;

/// <summary>[A2.1] Validation par le contrat : chaque cas de donnees/validation-cas.json.</summary>
[Trait("Category", "A2.1")]
public class ValidationTests
{
    public static IEnumerable<object[]> Cas() => Commun.Liste("validation-cas.json");

    [Theory]
    [MemberData(nameof(Cas))]
    public void Valide(CasDeTest c)
    {
        var objet = new Dictionary<string, object?>((Dictionary<string, object?>)Commun.Cas("validation-cas.json")["base"]!);
        if (c["modifs"] is Dictionary<string, object?> modifs) foreach (var (k, v) in modifs) objet[k] = v;
        if (c["supprimer"] is List<object?> suppr) foreach (var k in suppr) objet.Remove((string)k!);
        var erreurs = Validation.Valider(objet, Contrat.ChargerSchema());
        Assert.True((bool)c["valide"]! == (erreurs.Count == 0), $"écarts trouvés : {string.Join(" ; ", erreurs)}");
    }
}
