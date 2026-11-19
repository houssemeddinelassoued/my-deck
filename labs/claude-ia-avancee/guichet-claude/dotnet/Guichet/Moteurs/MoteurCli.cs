using System.Diagnostics;

namespace Guichet.Moteurs;

/// <summary>
/// Moteur « claude-cli » : le vrai modèle, via Claude Code en mode non interactif (claude -p) et votre licence.
/// Lancé depuis un dossier temporaire : ni CLAUDE.md, ni hooks, ni accès aux fichiers du dépôt.
/// Pas de boucle d'outils ici : le pipeline passe alors par l'extraction structurée.
/// </summary>
public sealed class MoteurCli : IMoteurClaude
{
    private readonly string? modele = Environment.GetEnvironmentVariable("GUICHET_MODELE_CLI"); // alias : haiku, sonnet, opus… (facultatif)

    public string Nom => "claude-cli";
    public bool SaitConverser => false;

    /// <summary>Lance claude -p et renvoie sa sortie JSON. Repli « cmd /c » pour une installation npm (claude.cmd).</summary>
    public static async Task<Dictionary<string, object?>> Lancer(IEnumerable<string> args, string entree)
    {
        Process DemarrerAvec(string fichier, IEnumerable<string> arguments)
        {
            var psi = new ProcessStartInfo(fichier) { RedirectStandardInput = true, RedirectStandardOutput = true, RedirectStandardError = true, UseShellExecute = false, WorkingDirectory = Path.GetTempPath() };
            foreach (var a in arguments) psi.ArgumentList.Add(a);
            return Process.Start(psi)!;
        }
        Process p;
        try { p = DemarrerAvec("claude", args); }
        catch (System.ComponentModel.Win32Exception) { p = DemarrerAvec("cmd", ["/c", "claude", .. args]); }
        await p.StandardInput.WriteAsync(entree);
        p.StandardInput.Close();
        var sortie = await p.StandardOutput.ReadToEndAsync();
        var erreurs = await p.StandardError.ReadToEndAsync();
        await p.WaitForExitAsync();
        if (p.ExitCode != 0) throw new InvalidOperationException($"claude -p a échoué : {(string.IsNullOrWhiteSpace(erreurs) ? sortie : erreurs)}");
        var json = Json.Objet(sortie);
        if (json.GetValueOrDefault("is_error") is true) throw new InvalidOperationException($"claude -p : {json.GetValueOrDefault("result")}");
        return json;
    }

    private List<string> Args(params string[] extra)
    {
        var a = new List<string> { "-p", "--output-format", "json" };
        if (!string.IsNullOrWhiteSpace(modele)) a.AddRange(["--model", modele]);
        a.AddRange(extra);
        return a;
    }

    public async Task<string> AppelSimple(string texte) => (await Lancer(Args(), texte)).GetValueOrDefault("result") as string ?? "";

    public async Task<Dictionary<string, object?>> Extraire(string prompt, Dictionary<string, object?> schema)
    {
        var s = await Lancer(Args("--json-schema", Json.Ecrire(schema)), prompt);
        return s.GetValueOrDefault("structured_output") as Dictionary<string, object?> ?? Json.Objet(s.GetValueOrDefault("result") as string ?? "null");
    }
}
