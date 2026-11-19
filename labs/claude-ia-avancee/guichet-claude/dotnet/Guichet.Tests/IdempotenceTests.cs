using Guichet.Depot;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>[A3.5] Idempotence : la même demande soumise deux fois n'est enregistrée qu'une fois.</summary>
[Trait("Category", "A3.5")]
public class IdempotenceTests
{
    [Fact]
    public async Task DeuxiemeEnvoi()
    {
        var depot = new DepotSqlite(":memory:");
        var premier = await Traiter.Executer(Commun.Reference(2), Commun.Dependances(depot));
        var second = await Traiter.Executer(Commun.Reference(2), Commun.Dependances(depot));
        Assert.False(second.Nouvelle);
        Assert.Equal(premier.Demande["id"], second.Demande["id"]);
        Assert.Single(depot.Lister());
    }
}
