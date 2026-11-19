using Anthropic;
using Anthropic.Models.Messages;

namespace Guichet.Moteurs;

/// <summary>Moteur « api » : le SDK officiel. Avec MOTEUR=simu, ANTHROPIC_BASE_URL pointe sur le simulateur.</summary>
public sealed class MoteurApi : IMoteurClaude
{
    private const string SystemeExtraction = "Tu extrais des informations factuelles de demandes clients. Tu réponds uniquement selon le schéma demandé.";

    private readonly AnthropicClient client;
    private readonly string modele;

    /// <summary>Le client lit ANTHROPIC_API_KEY ; l'adresse vient de ANTHROPIC_BASE_URL si elle est définie.</summary>
    public MoteurApi(string? modele = null)
    {
        var url = Environment.GetEnvironmentVariable("ANTHROPIC_BASE_URL");
        client = string.IsNullOrWhiteSpace(url) ? new AnthropicClient() : new AnthropicClient { BaseUrl = url };
        this.modele = modele ?? Config.Modele;
    }

    public string Nom => "api";

    public static string PremierTexte(Message rep) => rep.Content.Select(b => b.Value).OfType<TextBlock>().FirstOrDefault()?.Text ?? "";

    /// <summary>A3.1 · premier appel : une requête minimale, puis le texte du premier bloc « text ».</summary>
    public async Task<string> AppelSimple(string texte)
    {
        var rep = await client.Messages.Create(new MessageCreateParams
        {
            Model = modele,
            MaxTokens = 1000,
            Messages = [new UserMessageParam { Content = texte }],
        });
        return PremierTexte(rep);
    }

    /// <summary>A3.2 · sortie structurée : le contrat part dans OutputConfig.Format, la réponse est un JSON.</summary>
    public async Task<Dictionary<string, object?>> Extraire(string prompt, Dictionary<string, object?> schema)
    {
        var rep = await client.Messages.Create(new MessageCreateParams
        {
            Model = modele,
            MaxTokens = 4000,
            System = new List<TextBlockParam> { new() { Text = SystemeExtraction, CacheControl = new CacheControlEphemeral() } },
            OutputConfig = new OutputConfig { Format = new JsonOutputFormat { Schema = schema.ToDictionary(kv => kv.Key, kv => Json.Element(kv.Value)) } },
            Messages = [new UserMessageParam { Content = prompt }],
        });
        // max_tokens : JSON tronqué ; refusal : pas de contenu exploitable. On ne parse qu'après end_turn.
        if (rep.StopReason != "end_turn")
            throw new InvalidOperationException($"Extraction interrompue : stop_reason = {rep.StopReason}");
        return Json.Objet(PremierTexte(rep));
    }

    /// <summary>Un tour de la boucle d'outils (fourni).</summary>
    public Task<Message> Converser(List<TextBlockParam> system, List<Tool> tools, List<MessageParam> messages) =>
        client.Messages.Create(new MessageCreateParams
        {
            Model = modele,
            MaxTokens = 4000,
            System = system,
            Tools = tools.Select(t => (ToolUnion)t).ToList(),
            Messages = messages,
        });
}
