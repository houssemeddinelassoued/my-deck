// Hook PreToolUse (Atelier 4, étape A4.3) — à compléter.
//
// Claude Code lance ce script AVANT chaque Write ou Edit, en lui passant l'appel
// prévu en JSON sur l'entrée standard, par exemple :
//   { "tool_name": "Write", "tool_input": { "file_path": "...", "content": "..." } }
//   { "tool_name": "Edit",  "tool_input": { "file_path": "...", "old_string": "...", "new_string": "..." } }
//
// Code de sortie 0 : l'action continue.
// Code de sortie 2 : l'action est BLOQUÉE et le texte écrit sur stderr est renvoyé à Claude.
import fs from 'node:fs';

const appel = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
const entree = appel.tool_input ?? {};
const chemin = String(entree.file_path ?? '');
const texte = [entree.content, entree.new_string, ...(entree.edits ?? []).map((e) => e.new_string)].filter(Boolean).join('\n');

// TODO 1 : bloquer toute écriture d'un fichier .env (mais pas .env.exemple).
// TODO 2 : bloquer un texte qui contient un secret. Réutilisez le motif de la règle
//          « secret-en-dur » de garde/regles.json plutôt que d'en écrire un autre.
// Pour bloquer : process.stderr.write('message clair pour Claude'); process.exit(2);

process.exit(0);
