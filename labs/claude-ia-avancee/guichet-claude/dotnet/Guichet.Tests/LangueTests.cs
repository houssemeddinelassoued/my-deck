using Guichet.Depot;
using Guichet.Domaine;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>[A5] Défi final : langue détectée et équipe de routage, de bout en bout.</summary>
[Trait("Category", "A5")]
public class LangueTests
{
    public static IEnumerable<object[]> Cas() => Commun.Liste("langue-cas.json");

    [Theory]
    [MemberData(nameof(Cas))]
    public void Detecte(CasDeTest c)
    {
        var langue = Langue.Detecter((string)c["texte"]!);
        Assert.Equal((string)c["langue"]!, langue);
        Assert.Equal((string)c["equipe"]!, Langue.EquipePour(langue));
    }

    [Fact]
    public async Task RoutageDeBoutEnBout()
    {
        var d = (await Traiter.Executer(Commun.Reference(5), Commun.Dependances(new DepotSqlite(":memory:")))).Demande;
        Assert.Equal("en", d.GetValueOrDefault("langue"));
        Assert.Equal("Europe", d.GetValueOrDefault("equipe"));
    }
}
