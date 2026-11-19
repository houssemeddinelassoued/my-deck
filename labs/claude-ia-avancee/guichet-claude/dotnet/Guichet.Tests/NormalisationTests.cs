using Guichet.Domaine;

namespace Guichet.Tests;

/// <summary>[A1.2] Normalisation : 24 cas (donnees/normalisation-cas.json), un test par cas.</summary>
[Trait("Category", "A1.2")]
public class NormalisationTests
{
    public static IEnumerable<object[]> Cas() => Commun.Liste("normalisation-cas.json");

    [Theory]
    [MemberData(nameof(Cas))]
    public void Normalise(CasDeTest c)
    {
        var aujourdhui = DateOnly.Parse((string)Commun.Cas("normalisation-cas.json")["aujourdhui"]!);
        var categorie = (string)c["categorie"]!;
        var n = Normaliseur.Normaliser(new Dictionary<string, string> { ["message"] = "", [categorie] = (string)c["entree"]! }, aujourdhui);
        var attendu = c["attendu"];
        switch (categorie)
        {
            case "telephone": Assert.Equal(attendu, n.Telephone); break;
            case "email": Assert.Equal(attendu, n.Email); break;
            case "date_souhaitee": Assert.Equal(attendu, n.DateSouhaitee); break;
            case "budget":
                if (attendu is null) Assert.Null(n.Budget);
                else
                {
                    var b = (Dictionary<string, object?>)attendu;
                    Assert.NotNull(n.Budget);
                    Assert.Equal(Convert.ToDouble(b["montant"]), n.Budget!.Montant, 9);
                    Assert.Equal(b["devise"], n.Budget.Devise);
                }
                break;
        }
    }
}
