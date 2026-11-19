// Hook PreToolUse (Atelier 4, étape A4.3).
//
// Claude Code lance ce script AVANT chaque Write ou Edit, en lui passant l'appel
// prévu en JSON sur l'entrée standard, par exemple :
//   { "tool_name": "Write", "tool_input": { "file_path": "...", "content": "..." } }
//   { "tool_name": "Edit",  "tool_input": { "file_path": "...", "old_string": "...", "new_string": "..." } }
//
// Code de sortie 0 : l'action continue.
// Code de sortie 2 : l'action est BLOQUÉE et le texte écrit sur stderr est renvoyé à Claude.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const appel = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
const entree = appel.tool_input ?? {};
const chemin = String(entree.file_path ?? '');
const texte = [entree.content, entree.new_string, ...(entree.edits ?? []).map((e) => e.new_string)].filter(Boolean).join('\n');

const bloquer = (message) => {
  process.stderr.write(`${message}\n`);
  process.exit(2);
};

// 1. Jamais d'écriture dans un fichier .env (le modèle .env.exemple reste modifiable).
const nom = path.basename(chemin);
if (/^\.env(\..+)?$/.test(nom) && nom !== '.env.exemple') {
  bloquer(`Écriture de ${nom} refusée : les secrets ne passent pas par Claude. Demandez à l'utilisateur de modifier ce fichier lui-même.`);
}

// 2. Pas de secret littéral : même motif que la règle « secret-en-dur » de la garde.
const regle = JSON.parse(fs.readFileSync(path.join(RACINE, 'garde', 'regles.json'), 'utf8')).regles.find((r) => r.nom === 'secret-en-dur');
if (regle && new RegExp(regle.motif, regle.drapeaux ?? '').test(texte)) {
  bloquer(`Secret littéral détecté dans ${chemin || 'le texte à écrire'} (règle secret-en-dur). ${regle.attendu}.`);
}

process.exit(0);
