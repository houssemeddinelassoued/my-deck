using Guichet.Depot;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>[A4.2] Le champ site_web (ajouté au contrat par la Skill) va du formulaire à la base.</summary>
[Trait("Category", "A4.2")]
public class SitewebTests
{
    [Fact]
    public async Task SiteWebEnregistre()
    {
        var depot = new DepotSqlite(":memory:");
        var formulaire = new Dictionary<string, string>(Commun.Reference(6)) { ["site_web"] = "https://djerba-sante.tn" };
        var d = (await Traiter.Executer(formulaire, Commun.Dependances(depot))).Demande;
        Assert.Equal("https://djerba-sante.tn", d.GetValueOrDefault("site_web"));
        Assert.Equal("https://djerba-sante.tn", depot.Lister()[0].GetValueOrDefault("site_web"));
    }
}
