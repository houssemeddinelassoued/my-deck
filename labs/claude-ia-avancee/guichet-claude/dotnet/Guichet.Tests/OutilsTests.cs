using Guichet.Depot;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>[A3.3] Boucle d'outils : chercher_client puis enregistrer_demande, jusqu'à end_turn.</summary>
[Trait("Category", "A3.3")]
public class OutilsTests
{
    [Fact]
    public async Task AtlasIndustrie()
    {
        var depot = new DepotSqlite(":memory:");
        var r = await Traiter.Executer(Commun.Reference(1), Commun.Dependances(depot));
        Assert.True(r.Nouvelle);
        Assert.Equal("C-0142", r.Demande["client_id"]);
        Assert.Equal("incident", r.Demande["type"]);
        Assert.Single(depot.Lister());
    }

    [Fact]
    public async Task BalticFreight()
    {
        var r = await Traiter.Executer(Commun.Reference(8), Commun.Dependances(new DepotSqlite(":memory:")));
        Assert.Equal("C-0302", r.Demande["client_id"]);
        Assert.Equal("devis", r.Demande["type"]);
    }
}
