using Guichet.Moteurs;

namespace Guichet.Tests;

/// <summary>[A3.1] Premier appel par le SDK officiel (sur le simulateur : ANTHROPIC_BASE_URL).</summary>
[Trait("Category", "A3.1")]
public class AppelTests
{
    [Fact]
    public async Task AppelSimpleRenvoieLeTexte()
    {
        var texte = await new MoteurApi().AppelSimple("Bonjour, ici Guichet");
        Assert.False(string.IsNullOrEmpty(texte));
        Assert.Contains("Guichet", texte);
    }
}
