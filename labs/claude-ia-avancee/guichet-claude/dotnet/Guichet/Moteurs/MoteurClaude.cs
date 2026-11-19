using Anthropic.Models.Messages;

namespace Guichet.Moteurs;

/// <summary>
/// L'interface MoteurClaude isole la dépendance au modèle : le pipeline ne sait pas qui lui répond.
///   MOTEUR=simu        MoteurApi pointé sur le simulateur local (ANTHROPIC_BASE_URL)
///   MOTEUR=claude-cli  MoteurCli : claude -p, avec votre licence Claude (pas de boucle d'outils)
///   MOTEUR=api         MoteurApi sur l'API réelle (ANTHROPIC_API_KEY)
/// </summary>
public interface IMoteurClaude
{
    string Nom { get; }

    /// <summary>Un appel minimal : un texte en entrée, le texte de la réponse en sortie.</summary>
    Task<string> AppelSimple(string texte);

    /// <summary>Sortie structurée : un objet JSON conforme au schéma fourni.</summary>
    Task<Dictionary<string, object?>> Extraire(string prompt, Dictionary<string, object?> schema);

    /// <summary>Ce moteur sait-il mener une boucle d'outils ? (non pour claude-cli)</summary>
    bool SaitConverser => true;

    /// <summary>Un tour de conversation avec outils.</summary>
    Task<Message> Converser(List<TextBlockParam> system, List<Tool> tools, List<MessageParam> messages) =>
        throw new NotSupportedException($"{Nom} ne mène pas de boucle d'outils");

    static IMoteurClaude Choisir() => Environment.GetEnvironmentVariable("MOTEUR") == "claude-cli" ? new MoteurCli() : new MoteurApi();
}
