using System.Net.Http.Headers;
using System.Text;

namespace Guichet.Depot;

/// <summary>
/// Option STOCKAGE=notion : la base SQLite reste la référence (lecture, idempotence), et chaque nouvelle demande
/// est recopiée dans une base Notion. Prérequis (annexe B du guide) : une intégration interne (NOTION_TOKEN)
/// partagée avec une base (NOTION_BASE) qui a les propriétés : Nom (titre), Priorité (sélection), Type (sélection),
/// Client (texte), Résumé (texte).
/// </summary>
public sealed class DepotNotion : IDepot
{
    private readonly IDepot local;
    private readonly string jeton = Environment.GetEnvironmentVariable("NOTION_TOKEN") ?? "";
    private readonly string baseNotion = Environment.GetEnvironmentVariable("NOTION_BASE") ?? "";
    private static readonly HttpClient Http = new();

    public DepotNotion(IDepot local)
    {
        this.local = local;
        if (string.IsNullOrWhiteSpace(jeton) || string.IsNullOrWhiteSpace(baseNotion))
            throw new InvalidOperationException("STOCKAGE=notion : NOTION_TOKEN et NOTION_BASE doivent être définis (fichier .env).");
    }

    private static object Texte(object? v)
    {
        var s = v?.ToString() ?? "";
        return new { rich_text = new[] { new { text = new { content = s[..Math.Min(1900, s.Length)] } } } };
    }

    public Dictionary<string, object?> Inserer(Dictionary<string, object?> demande)
    {
        var d = local.Inserer(demande);
        var corps = new Dictionary<string, object?>
        {
            ["parent"] = new { database_id = baseNotion },
            ["properties"] = new Dictionary<string, object?>
            {
                ["Nom"] = new { title = new[] { new { text = new { content = $"{d["id"]} · {d.GetValueOrDefault("client")}" } } } },
                ["Priorité"] = new { select = new { name = d.GetValueOrDefault("priorite")?.ToString() ?? "P3" } },
                ["Type"] = new { select = new { name = d.GetValueOrDefault("type")?.ToString() ?? "question" } },
                ["Client"] = Texte(d.GetValueOrDefault("client")),
                ["Résumé"] = Texte(d.GetValueOrDefault("resume")),
            },
        };
        var req = new HttpRequestMessage(HttpMethod.Post, "https://api.notion.com/v1/pages") { Content = new StringContent(Json.Ecrire(corps), Encoding.UTF8, "application/json") };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", jeton);
        req.Headers.Add("Notion-Version", "2022-06-28");
        _ = Http.SendAsync(req).ContinueWith(t =>
        {
            if (t.IsFaulted || !t.Result.IsSuccessStatusCode) Console.Error.WriteLine($"Copie Notion de {d["id"]} impossible");
        });
        return d;
    }

    public List<Dictionary<string, object?>> Lister() => local.Lister();
    public Dictionary<string, object?>? ParCle(string cle) => local.ParCle(cle);
}
