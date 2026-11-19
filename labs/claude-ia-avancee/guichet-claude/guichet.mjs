#!/usr/bin/env node
// guichet.mjs — l'outil commun des ateliers « Claude · IA avancée pour les développeurs ».
// Une seule commande pour les 4 stacks (TypeScript, Python, Java, .NET). Node 22.18+ requis.
//
//   node guichet.mjs aide
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const RACINE = path.dirname(fileURLToPath(import.meta.url));
const R = (...p) => path.join(RACINE, ...p);
const WIN = process.platform === 'win32';
const ARGS = process.argv.slice(2);
const CMD = ARGS[0] ?? 'aide';
const opt = (nom, defaut = null) => {
  const i = ARGS.indexOf(`--${nom}`);
  return i >= 0 && ARGS[i + 1] && !ARGS[i + 1].startsWith('--') ? ARGS[i + 1] : defaut;
};
const drapeau = (nom) => ARGS.includes(`--${nom}`);
const AVEC_VALEUR = new Set(['--tag', '--cas', '--prompt', '--moteur', '--modele', '--port']);
const positionnels = [];
for (let i = 1; i < ARGS.length; i++) {
  const a = ARGS[i];
  if (a.startsWith('--')) {
    if (AVEC_VALEUR.has(a) && ARGS[i + 1] && !ARGS[i + 1].startsWith('--')) i++;
    continue;
  }
  positionnels.push(a);
}

const VERT = (s) => `\x1b[32m${s}\x1b[0m`;
const ROUGE = (s) => `\x1b[31m${s}\x1b[0m`;
const GRIS = (s) => `\x1b[90m${s}\x1b[0m`;
const GRAS = (s) => `\x1b[1m${s}\x1b[0m`;
const ok = (s) => console.log(`${VERT('✓')} ${s}`);
const ko = (s) => console.log(`${ROUGE('✗')} ${s}`);
const lireJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const existe = (f) => fs.existsSync(f);

// ─── .env (facultatif) ──────────────────────────────────────────────────────
if (existe(R('.env'))) {
  for (const ligne of fs.readFileSync(R('.env'), 'utf8').split(/\r?\n/)) {
    const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// ─── Les stacks ─────────────────────────────────────────────────────────────
const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const STACKS = {
  ts: {
    nom: 'TypeScript (Node 22.18+)',
    dossier: 'ts',
    bloc: 'typescript',
    conventions: 'le code est exécuté par Node sans compilation : imports relatifs avec l’extension .ts (« ./demande.ts ») et « import type » pour les types ; pas d’enum ni de paramètres de constructeur « readonly x ».',
    fichiers: {
      'src/domaine/demande': 'ts/src/domaine/demande.ts',
      'src/domaine/normaliser': 'ts/src/domaine/normaliser.ts',
      'src/domaine/texte': 'ts/src/domaine/texte.ts',
    },
    installer: [['npm', ['install']]],
    test: (stem) => ['node', ['--test', `test/${stem}.test.ts`]],
    lancer: ['node', ['src/serveur.ts']],
    boucle: (tache) => ['node', ['scripts/boucle.ts', tache]],
    score: (out) => {
      const p = out.match(/^(?:#|ℹ) pass (\d+)/m);
      const f = out.match(/^(?:#|ℹ) fail (\d+)/m);
      return p ? { passes: +p[1], total: +p[1] + +(f?.[1] ?? 0) } : null;
    },
    outil: ['node', ['--version']],
  },
  python: {
    nom: 'Python 3.12+ (uv)',
    dossier: 'python',
    bloc: 'python',
    conventions: 'imports absolus depuis le paquet guichet (« from guichet.domaine.demande import … ») ; bibliothèque standard uniquement.',
    fichiers: {
      'src/domaine/demande': 'python/guichet/domaine/demande.py',
      'src/domaine/normaliser': 'python/guichet/domaine/normaliser.py',
      'src/domaine/texte': 'python/guichet/domaine/texte.py',
    },
    installer: [['uv', ['sync']]],
    test: (stem) => ['uv', ['run', 'pytest', '-q', '-p', 'no:cacheprovider', `tests/test_${stem}.py`]],
    lancer: ['uv', ['run', 'python', '-m', 'guichet.serveur']],
    boucle: (tache) => ['uv', ['run', 'python', '-m', 'guichet.outils.boucle', tache]],
    score: (out) => {
      const p = out.match(/(\d+) passed/);
      const f = out.match(/(\d+) failed/);
      const e = out.match(/(\d+) errors?/);
      if (!p && !f) return null;
      return { passes: +(p?.[1] ?? 0), total: +(p?.[1] ?? 0) + +(f?.[1] ?? 0) + +(e?.[1] ?? 0) };
    },
    outil: ['uv', ['--version']],
  },
  java: {
    nom: 'Java 21+ (Maven)',
    dossier: 'java',
    bloc: 'java',
    conventions: 'paquet guichet.domaine ; classe finale Normaliseur avec une méthode statique ; Java 21, bibliothèque standard uniquement.',
    fichiers: {
      'src/domaine/demande': 'java/src/main/java/guichet/domaine/Demande.java',
      'src/domaine/normaliser': 'java/src/main/java/guichet/domaine/Normaliseur.java',
      'src/domaine/texte': 'java/src/main/java/guichet/domaine/Texte.java',
    },
    installer: [['mvn', ['-q', '-DskipTests', 'package']]],
    test: (stem) => ['mvn', ['test', `-Dtest=${pascal(stem)}Test`, '-Dsurefire.failIfNoSpecifiedTests=false', '-B']],
    lancer: ['mvn', ['-q', 'compile', 'exec:java']],
    boucle: (tache) => ['mvn', ['-q', 'compile', 'exec:java', '-Dexec.mainClass=guichet.outils.Boucle', `-Dexec.args=${tache}`]],
    score: (out) => {
      const t = [...out.matchAll(/Tests run: (\d+), Failures: (\d+), Errors: (\d+)/g)].at(-1);
      if (!t) return null;
      return { passes: +t[1] - +t[2] - +t[3], total: +t[1] };
    },
    outil: ['mvn', ['-v']],
  },
  dotnet: {
    nom: '.NET 8+ (C#)',
    dossier: 'dotnet',
    bloc: 'csharp',
    conventions: 'espace de noms Guichet.Domaine ; classe statique Normaliseur ; .NET 8, bibliothèque standard uniquement (usings implicites activés).',
    fichiers: {
      'src/domaine/demande': 'dotnet/Guichet/Domaine/Demande.cs',
      'src/domaine/normaliser': 'dotnet/Guichet/Domaine/Normaliseur.cs',
      'src/domaine/texte': 'dotnet/Guichet/Domaine/Texte.cs',
    },
    installer: [['dotnet', ['build', '-v', 'q']]],
    test: (stem) => ['dotnet', ['test', 'Guichet.Tests', '--filter', `FullyQualifiedName~${pascal(stem)}Tests`, '-v', 'q', '--nologo']],
    lancer: ['dotnet', ['run', '--project', 'Guichet']],
    boucle: (tache) => ['dotnet', ['run', '--project', 'Guichet', '--', 'boucle', tache]],
    score: (out) => {
      const p = out.match(/(?:Passed|Réussi)\s*:\s*(\d+)/);
      const f = out.match(/(?:Failed|Échec)\s*:\s*(\d+)/);
      const t = out.match(/(?:Total)\s*:\s*(\d+)/);
      if (!p && !f) return null;
      return { passes: +(p?.[1] ?? 0), total: t ? +t[1] : +(p?.[1] ?? 0) + +(f?.[1] ?? 0) };
    },
    outil: ['dotnet', ['--version']],
  },
};

// Tag → fichier de tests (même nom dans les 4 stacks).
const TAGS = {
  'A1.2': 'normalisation',
  'A1.3': 'exemples',
  'A2.1': 'validation',
  'A2.3': 'boucle',
  BOUCLE: 'texte',
  'A3.1': 'appel',
  'A3.2': 'extraction',
  'A3.3': 'outils',
  'A3.4': 'priorite',
  'A3.5': 'idempotence',
  'A4.2': 'siteweb',
  'A4.5': 'filtre',
  A5: 'langue',
};
const AVEC_SIMU = new Set(['appel', 'extraction', 'outils', 'priorite', 'idempotence', 'siteweb', 'langue']);

const ETAPES = ['A1.1', 'A1.2', 'A1.3', 'A1.4', 'A2.1', 'A2.2', 'A2.3', 'A2.4', 'A2.5', 'A3.1', 'A3.2', 'A3.3', 'A3.4', 'A3.5', 'A4.1', 'A4.2', 'A4.3', 'A4.4', 'A4.5', 'A5'];

function stackActive({ silencieux = false } = {}) {
  const f = R('.guichet-stack');
  const nom = (process.env.GUICHET_STACK || (existe(f) ? fs.readFileSync(f, 'utf8').trim() : '')).toLowerCase();
  if (STACKS[nom]) return { id: nom, ...STACKS[nom] };
  if (!silencieux) {
    console.error(ROUGE('Aucune stack choisie. Lancez : node guichet.mjs init <ts|python|java|dotnet>'));
    process.exit(1);
  }
  return null;
}

// ─── Exécution de commandes ─────────────────────────────────────────────────
const citer = (a) => (/[\s"&|<>^]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);
function executer(cmd, args, { cwd = RACINE, env = {}, entree, afficher = false, temps = 600_000 } = {}) {
  const r = spawnSync(WIN ? [cmd, ...args].map(citer).join(' ') : cmd, WIN ? [] : args, {
    cwd,
    env: { ...process.env, ...env },
    input: entree,
    encoding: 'utf8',
    shell: WIN,
    timeout: temps,
    maxBuffer: 64 * 1024 * 1024,
    stdio: afficher ? ['pipe', 'inherit', 'inherit'] : 'pipe',
  });
  return { code: r.status ?? (r.error ? 127 : 1), sortie: `${r.stdout ?? ''}${r.stderr ?? ''}`, erreur: r.error };
}
const disponible = (cmd, args) => executer(cmd, args, { temps: 60_000 }).code === 0;

// ─── Simulateur à la demande ────────────────────────────────────────────────
async function simuEnLigne(url) {
  try {
    const r = await fetch(`${url}/__sante`, { signal: AbortSignal.timeout(800) });
    return r.ok;
  } catch {
    return false;
  }
}
async function avecSimulateur(fn) {
  const urlDefaut = `http://localhost:${process.env.SIMU_PORT || 8787}`;
  if (await simuEnLigne(urlDefaut)) return fn(urlDefaut);
  const port = 18000 + Math.floor(Math.random() * 1000);
  const enfant = spawn(process.execPath, [R('simulateur', 'serveur.mjs'), '--port', String(port)], { stdio: 'ignore' });
  const url = `http://localhost:${port}`;
  for (let i = 0; i < 50 && !(await simuEnLigne(url)); i++) await new Promise((r) => setTimeout(r, 100));
  try {
    return await fn(url);
  } finally {
    enfant.kill();
  }
}

function envStack(simuUrl) {
  return {
    GUICHET_RACINE: RACINE,
    MOTEUR: process.env.MOTEUR || 'simu',
    ANTHROPIC_BASE_URL: (process.env.MOTEUR || 'simu') === 'simu' ? simuUrl : process.env.ANTHROPIC_BASE_URL || '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || 'simu-local',
    GUICHET_DB: process.env.GUICHET_DB || R('donnees', 'guichet.db'),
    PYTHONIOENCODING: 'utf-8',
    DOTNET_CLI_TELEMETRY_OPTOUT: '1',
    DOTNET_NOLOGO: '1',
    DOTNET_CLI_UI_LANGUAGE: 'en',
  };
}

async function lancerTests(S, tag, { afficher = false } = {}) {
  const stem = TAGS[tag] ?? tag;
  const [cmd, args] = S.test(stem);
  const run = (url) => executer(cmd, args, { cwd: R(S.dossier), env: { ...envStack(url), MOTEUR: 'simu', ANTHROPIC_BASE_URL: url, ANTHROPIC_API_KEY: 'simu-local' }, afficher });
  const r = AVEC_SIMU.has(stem) ? await avecSimulateur(async (url) => run(url)) : run('http://localhost:8787');
  return { ...r, score: S.score(r.sortie), stem };
}

// ─── Validation de référence (JS) ───────────────────────────────────────────
const typeJson = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v === 'number' ? 'number' : typeof v);
function valider(obj, schema) {
  const erreurs = [];
  if (typeJson(obj) !== 'object') return ['la sortie n’est pas un objet JSON'];
  const props = schema.properties ?? {};
  for (const r of schema.required ?? []) if (!(r in obj)) erreurs.push(`${r} : champ requis manquant`);
  if (schema.additionalProperties === false) for (const k of Object.keys(obj)) if (!(k in props)) erreurs.push(`${k} : champ non prévu par le contrat`);
  for (const [k, def] of Object.entries(props)) {
    if (!(k in obj)) continue;
    const v = obj[k];
    const types = def.type ? [].concat(def.type) : null;
    if (types && !types.some((t) => t === typeJson(v) || (t === 'number' && typeJson(v) === 'integer'))) erreurs.push(`${k} : type ${typeJson(v)} au lieu de ${types.join(' | ')}`);
    if (def.enum && !def.enum.includes(v)) erreurs.push(`${k} : valeur « ${v} » hors liste (${def.enum.join(', ')})`);
    if (typeof v === 'string' && def.minLength !== undefined && v.length < def.minLength) erreurs.push(`${k} : trop court (minimum ${def.minLength})`);
    if (typeof v === 'string' && def.maxLength !== undefined && v.length > def.maxLength) erreurs.push(`${k} : trop long (maximum ${def.maxLength})`);
  }
  return erreurs;
}
// Ce que le modèle reçoit : la forme seulement (champs « modèle », sans x-* ni longueurs).
function schemaPourModele(schema) {
  const props = {};
  for (const [k, def] of Object.entries(schema.properties ?? {})) {
    if (def['x-source'] && def['x-source'] !== 'modele') continue;
    const { minLength, maxLength, ...reste } = def;
    props[k] = Object.fromEntries(Object.entries(reste).filter(([c]) => !c.startsWith('x-')));
  }
  const s = { type: 'object', properties: props, required: (schema.required ?? []).filter((r) => r in props) };
  if (schema.additionalProperties === false) s.additionalProperties = false;
  return s;
}

// ─── Exemples de référence (même algorithme que choisirExemples) ───────────
const STOP = new Set(['avec', 'pour', 'dans', 'depuis', 'nous', 'notre', 'votre', 'vous', 'sont', 'plus', 'cette', 'mais', 'the', 'and', 'with', 'from', 'this', 'that', 'have', 'been', 'merci', 'bonjour', 'pouvez', 'pourriez']);
const motsCles = (t) => new Set(String(t).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((m) => m.length >= 4 && !STOP.has(m)));
function choisirExemples(texte, tous, k = 3) {
  const m = motsCles(texte);
  const notes = tous.map((ex) => ({ ex, score: [...motsCles(ex.texte)].filter((x) => m.has(x)).length }));
  notes.sort((a, b) => b.score - a.score);
  const choisis = [];
  for (const { ex } of notes) {
    if (choisis.some((c) => c.type === ex.type)) continue;
    choisis.push(ex);
    if (choisis.length === k) break;
  }
  return choisis;
}
const lireExemples = () => fs.readFileSync(R('donnees', 'exemples.jsonl'), 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
const rendreExemples = (exs) => exs.map((e) => `<exemple>\n<entree>${e.texte}</entree>\n<sortie>${JSON.stringify(e.sortie)}</sortie>\n</exemple>`).join('\n');
const blocDemande = (f) => ['nom', 'entreprise', 'email', 'telephone', 'message'].map((k) => `${k}: ${f[k] ?? ''}`).join('\n');

function rendrePrompt(nom, formulaire, { exemples = true } = {}) {
  const fichier = R('prompts', nom.endsWith('.md') ? nom : `${nom}.md`);
  if (!existe(fichier)) throw new Error(`prompt introuvable : ${path.relative(RACINE, fichier)}`);
  let p = fs.readFileSync(fichier, 'utf8');
  p = p.replace('{{exemples}}', exemples ? rendreExemples(choisirExemples(formulaire.message, lireExemples(), 3)) : '');
  // Si le prompt parle de la balise <demande_client>, le texte du client y est placé.
  const bloc = /demande_client/.test(p) ? `<demande_client>
${blocDemande(formulaire)}
</demande_client>` : blocDemande(formulaire);
  return p.replace('{{demande}}', bloc);
}

// ─── Moteurs (pour les commandes d'atelier) ─────────────────────────────────
// claude.exe (installeur natif) se lance sans shell ; claude.cmd (installation npm) exige un shell,
// avec des guillemets échappés pour les arguments JSON.
function lancerClaude(args, entree, temps) {
  const o = { cwd: os.tmpdir(), input: entree, encoding: 'utf8', timeout: temps, maxBuffer: 64 * 1024 * 1024 };
  const r = spawnSync('claude', args, o);
  if (!(WIN && r.error?.code === 'ENOENT')) return r;
  return spawnSync(['claude', ...args.map((a) => `"${a.replace(/"/g, '\\"')}"`)].join(' '), [], { ...o, shell: true });
}

function claudeP(prompt, { schema = null, modele = null, temps = 300_000 } = {}) {
  const args = ['-p', '--output-format', 'json'];
  if (schema) args.push('--json-schema', JSON.stringify(schema));
  if (modele) args.push('--model', modele);
  // Lancé hors du dépôt : ni CLAUDE.md, ni hooks, ni accès aux fichiers du projet.
  const r = lancerClaude(args, prompt, temps);
  if (r.error || r.status !== 0) throw new Error(`claude -p a échoué (${r.error?.message ?? `code ${r.status}`}) : ${(r.stdout || r.stderr || '').slice(0, 400)}`);
  const j = JSON.parse(r.stdout);
  if (j.is_error) throw new Error(`claude -p : ${j.result ?? j.subtype}`);
  return j;
}
async function extraireAvec(moteur, prompt, schema, modele, simuUrl) {
  if (moteur === 'claude-cli') {
    const j = claudeP(prompt, { schema: schemaPourModele(schema), modele });
    return j.structured_output ?? JSON.parse(j.result);
  }
  const r = await fetch(`${simuUrl}/v1/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': 'simu-local', 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: modele || 'claude-sonnet-5-5', max_tokens: 4000, output_config: { format: { type: 'json_schema', schema: schemaPourModele(schema) } }, messages: [{ role: 'user', content: prompt }] }),
  });
  const rep = await r.json();
  if (!r.ok) throw new Error(rep?.error?.message ?? `HTTP ${r.status}`);
  return JSON.parse(rep.content.find((b) => b.type === 'text').text);
}
const ALIAS = { haiku: 'haiku', sonnet: 'sonnet', opus: 'opus', fable: 'fable' };

// ─── Commandes ──────────────────────────────────────────────────────────────
const COMMANDES = {};

COMMANDES.aide = () => {
  console.log(`${GRAS('guichet.mjs')} · outil commun des ateliers (4 stacks)

  init <ts|python|java|dotnet>        choisir sa stack (une fois)
  poste                               vérifier les prérequis du poste
  simu                                lancer le simulateur de l’API (port 8787)
  lancer                              lancer l’application web (http://localhost:3000)
  tests [--tag A3.2]                  lancer les tests de la stack (tous, ou ceux d’une étape)
  garde [--cas] [--rapide]            appliquer les règles de garde/regles.json
  verifier <étape>                    l’étape est-elle réussie ? (A1.1 … A5)
  reprise <étape>                     se remettre à l’état de FIN de l’étape (en cas de retard)
  generer normaliser <v1|v2|v3>       générer le code avec claude -p, puis le noter (Atelier 1)
  extraire --cas <n> [--prompt p] [--moteur simu|claude-cli] [--sans-exemples]
  eval [--prompt p] [--modele haiku|sonnet] [--moteur claude-cli|simu]
  juger <chemin> [--modele m]         faire noter du code par le juge (Atelier 2)
  boucle <taches/x.md>                boucle générer → vérifier → corriger (Atelier 2)
  contrat                             afficher les champs du contrat et leur source`);
};

COMMANDES.init = () => {
  const id = (positionnels[0] || '').toLowerCase();
  if (!STACKS[id]) {
    console.error('Usage : node guichet.mjs init <ts|python|java|dotnet>');
    process.exit(1);
  }
  fs.writeFileSync(R('.guichet-stack'), `${id}\n`);
  ok(`Stack active : ${STACKS[id].nom} (dossier ${id === 'ts' ? 'ts' : STACKS[id].dossier}/)`);
  console.log(GRIS('Installation des dépendances…'));
  for (const [c, a] of STACKS[id].installer) {
    const r = executer(c, a, { cwd: R(STACKS[id].dossier), afficher: true });
    if (r.code !== 0) {
      ko(`${c} ${a.join(' ')} a échoué : voyez l’annexe A du guide.`);
      process.exit(1);
    }
  }
  ok('Dépendances installées. Ensuite : node guichet.mjs poste');
};

COMMANDES.poste = async () => {
  let bon = true;
  const ligne = (vrai, txt, aide) => {
    if (vrai) ok(txt);
    else {
      bon = false;
      ko(`${txt}${aide ? GRIS(`  → ${aide}`) : ''}`);
    }
  };
  const [maj, min] = process.versions.node.split('.').map(Number);
  ligne(maj > 22 || (maj === 22 && min >= 18), `Node ${process.versions.node} (22.18+ requis)`, 'installez Node 22.18 ou plus récent');
  ligne(disponible('git', ['--version']), 'Git', 'installez Git');
  const claude = executer('claude', ['--version'], { temps: 60_000 });
  ligne(claude.code === 0, `Claude Code en ligne de commande ${claude.code === 0 ? GRIS(claude.sortie.trim()) : ''}`, 'installez Claude Code puis connectez-vous (claude, puis /login)');
  const S = stackActive({ silencieux: true });
  ligne(Boolean(S), `Stack choisie${S ? ` : ${S.nom}` : ''}`, 'node guichet.mjs init <ts|python|java|dotnet>');
  if (S) {
    ligne(disponible(...S.outil), `Outil de la stack (${S.outil[0]})`, 'voyez l’annexe A du guide');
    if (S.id === 'java') ligne(disponible('java', ['-version']), 'JDK', 'installez un JDK 21+');
  }
  const simu = await avecSimulateur(async (url) => {
    try {
      const r = await fetch(`${url}/v1/messages`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 50, messages: [{ role: 'user', content: 'ping' }] }) });
      return r.ok;
    } catch {
      return false;
    }
  });
  ligne(simu, 'Simulateur de l’API');
  console.log(bon ? VERT(GRAS('\nPoste prêt.')) : ROUGE(GRAS('\nPoste pas encore prêt : corrigez les lignes en rouge.')));
  process.exitCode = bon ? 0 : 1;
};

COMMANDES.simu = () => {
  const enfant = spawn(process.execPath, [R('simulateur', 'serveur.mjs'), ...ARGS.slice(1)], { stdio: 'inherit' });
  enfant.on('exit', (c) => process.exit(c ?? 0));
};

COMMANDES.lancer = async () => {
  const S = stackActive();
  const url = `http://localhost:${process.env.SIMU_PORT || 8787}`;
  if ((process.env.MOTEUR || 'simu') === 'simu' && !(await simuEnLigne(url))) console.log(ROUGE(`Le simulateur ne répond pas sur ${url} : lancez « node guichet.mjs simu » dans un autre terminal.`));
  const [cmd, args] = S.lancer;
  console.log(GRIS(`MOTEUR=${process.env.MOTEUR || 'simu'} · stack ${S.nom} · http://localhost:${process.env.PORT || 3000}`));
  const enfant = spawn(WIN ? [cmd, ...args].map(citer).join(' ') : cmd, WIN ? [] : args, { cwd: R(S.dossier), env: { ...process.env, ...envStack(url) }, stdio: 'inherit', shell: WIN });
  enfant.on('exit', (c) => process.exit(c ?? 0));
};

COMMANDES.tests = async () => {
  const S = stackActive();
  const tag = opt('tag');
  const tags = tag ? [tag] : Object.keys(TAGS);
  let tousOk = true;
  for (const t of tags) {
    if (!TAGS[t]) {
      console.error(`Tag inconnu : ${t} (${Object.keys(TAGS).join(', ')})`);
      process.exit(1);
    }
    const r = await lancerTests(S, t, { afficher: Boolean(tag) && drapeau('detail') });
    const s = r.score;
    const reussi = r.code === 0;
    tousOk &&= reussi;
    (reussi ? ok : ko)(`[${t}] ${r.stem} ${s ? `${s.passes} / ${s.total}` : reussi ? '' : '(ne compile pas ou ne se lance pas)'}`);
    if (!reussi && tag && !drapeau('detail')) console.log(GRIS(r.sortie.split('\n').filter((l) => /fail|error|erreur|assert|expected|attendu|✖|not ok|FAILED|Exception|Traceback/i.test(l)).slice(0, 25).join('\n')));
  }
  process.exitCode = tousOk ? 0 : 1;
};

// ─── Garde ──────────────────────────────────────────────────────────────────
const lireRegles = () => lireJson(R('garde', 'regles.json')).regles.map((r) => ({ ...r, re: new RegExp(r.motif, `${r.drapeaux ?? ''}`.replace(/g/g, '')) }));
function fichiersSource(dossier) {
  const exclus = new Set(['node_modules', 'target', 'bin', 'obj', '.venv', '__pycache__', 'test', 'tests', 'Guichet.Tests', '.pytest_cache', 'generations']);
  const out = [];
  const parcourir = (d) => {
    if (!existe(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!exclus.has(e.name) && !(e.name === 'test' && d.endsWith('src'))) parcourir(path.join(d, e.name));
      } else if (/\.(ts|js|mjs|py|java|cs)$/.test(e.name)) out.push(path.join(d, e.name));
    }
  };
  parcourir(dossier);
  return out;
}
function analyser(fichiers, regles) {
  const defauts = [];
  for (const f of fichiers) {
    const lignes = fs.readFileSync(f, 'utf8').split(/\r?\n/);
    lignes.forEach((l, i) => {
      for (const r of regles) if (r.re.test(l)) defauts.push({ regle: r, fichier: path.relative(RACINE, f).replace(/\\/g, '/'), ligne: i + 1 });
    });
  }
  return defauts;
}
function rapportGarde(defauts) {
  return defauts.map((d) => `${ROUGE(`✗ ${d.regle.nom}`)} ${d.fichier}:${d.ligne}\n  ${d.regle.message}\n  ${VERT('Attendu :')} ${d.regle.attendu}`).join('\n');
}
function gardeCas() {
  const regles = lireRegles();
  const res = [];
  for (const f of fs.readdirSync(R('garde', 'cas')).sort()) {
    const lignes = fs.readFileSync(R('garde', 'cas', f), 'utf8').split(/\r?\n/);
    const attendu = (lignes[0].match(/attendu\s*:\s*([\w-]+)/) || [])[1];
    const corps = lignes.slice(1).join('\n');
    const trouves = regles.filter((r) => corps.split('\n').some((l) => r.re.test(l))).map((r) => r.nom);
    res.push({ f, attendu, trouves, ok: trouves.includes(attendu) });
  }
  return res;
}
COMMANDES.garde = () => {
  if (drapeau('cas')) {
    const res = gardeCas();
    for (const r of res) (r.ok ? ok : ko)(`${r.f} : attendu ${r.attendu}${r.trouves.length ? GRIS(` · trouvé : ${r.trouves.join(', ')}`) : GRIS(' · rien trouvé')}`);
    const n = res.filter((r) => r.ok).length;
    console.log(`${n} / ${res.length} extraits attrapés`);
    process.exitCode = n === res.length ? 0 : 1;
    return;
  }
  const S = stackActive();
  const defauts = analyser(fichiersSource(R(S.dossier)), lireRegles());
  if (!defauts.length) {
    if (!drapeau('rapide')) ok(`garde : aucun défaut (${fichiersSource(R(S.dossier)).length} fichiers, ${lireRegles().length} règles)`);
    return;
  }
  const txt = `${rapportGarde(defauts)}\n${GRIS(`${defauts.length} défaut(s) · code de sortie 2`)}`;
  if (drapeau('rapide')) console.error(txt.replace(/\x1b\[\d+m/g, ''));
  else console.log(txt);
  process.exitCode = 2;
};

// ─── Vérification des étapes ────────────────────────────────────────────────
const lire = (f) => (existe(R(f)) ? fs.readFileSync(R(f), 'utf8') : null);
function frontmatter(txt) {
  const m = txt?.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const o = {};
  for (const l of m[1].split(/\r?\n/)) {
    const kv = l.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (kv) o[kv[1]] = kv[2].trim();
  }
  return o;
}
const sectionsRemplies = (txt, titres) => titres.every((t) => {
  const m = txt.match(new RegExp(`##\\s*${t}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i'));
  return m && m[1].replace(/\(à compléter[^)]*\)/gi, '').replace(/[-*\s]/g, '').length > 15;
});
function hookBloque(entree) {
  const hook = R('.claude', 'hooks', 'bloquer-secrets.mjs');
  const r = spawnSync(process.execPath, [hook], { input: JSON.stringify(entree), encoding: 'utf8', cwd: RACINE });
  return r.status;
}
async function mcpRepond() {
  const conf = JSON.parse(lire('.mcp.json') ?? '{}').mcpServers?.demandes;
  if (!conf) return false;
  return new Promise((resolve) => {
    const enfant = spawn(conf.command === 'node' ? process.execPath : conf.command, conf.args ?? [], { cwd: RACINE, env: { ...process.env, ...(conf.env ?? {}) } });
    let tampon = '';
    const fin = (v) => {
      enfant.kill();
      resolve(v);
    };
    const minuterie = setTimeout(() => fin(false), 8000);
    enfant.stdout.on('data', (d) => {
      tampon += d;
      if (tampon.includes('"tools"') && tampon.includes('lister_demandes')) {
        clearTimeout(minuterie);
        fin(true);
      }
    });
    enfant.on('error', () => fin(false));
    const envoyer = (o) => enfant.stdin.write(`${JSON.stringify(o)}\n`);
    envoyer({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'verifier', version: '1' } } });
    envoyer({ jsonrpc: '2.0', method: 'notifications/initialized' });
    envoyer({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  });
}

const CONTROLES = {
  'A1.1': async () => [[/v1/.test(lire('resultats.csv') ?? ''), 'resultats.csv contient la mesure de la v1', 'node guichet.mjs generer normaliser v1']],
  'A1.2': async (S) => {
    const v2 = lire('prompts/normaliser.v2.md') ?? '';
    const t = await lancerTests(S, 'A1.2');
    return [
      [/<contexte>/.test(v2) && /<criteres>/.test(v2), 'prompts/normaliser.v2.md structuré (contexte, critères…)'],
      [t.score && t.score.passes >= 20, `tests de normalisation ≥ 20 / 24 (actuel : ${t.score ? `${t.score.passes} / ${t.score.total}` : 'ne compile pas'})`],
    ];
  },
  'A1.3': async (S) => {
    const t = await lancerTests(S, 'A1.3');
    return [
      [t.code === 0, 'choisirExemples : tests verts'],
      [/\{\{exemples\}\}/.test(lire('prompts/extraction.md') ?? ''), 'prompts/extraction.md utilise {{exemples}}'],
    ];
  },
  'A1.4': async () => [[sectionsRemplies(lire('decisions/doublons.md') ?? '', ['Piste A', 'Piste B', 'Piste C', 'Critères', 'Choix']), 'decisions/doublons.md : 3 pistes, critères et choix remplis']],
  'A2.1': async (S) => {
    const s = lireJson(R('contrats', 'demande.schema.json'));
    const t = await lancerTests(S, 'A2.1');
    return [
      [s.additionalProperties === false && Array.isArray(s.properties?.type?.enum) && Array.isArray(s.properties?.priorite?.enum), 'contrat : énumérations et champs en trop interdits'],
      [Object.keys(s.properties ?? {}).filter((k) => !s.properties[k]['x-source']).every((k) => s.required?.includes(k)), 'contrat : tous les champs du modèle sont requis'],
      [t.code === 0, 'validation : tests verts'],
    ];
  },
  'A2.2': async (S) => {
    const cas = gardeCas();
    const defauts = analyser(fichiersSource(R(S.dossier)), lireRegles());
    return [
      [cas.every((c) => c.ok), `garde --cas : ${cas.filter((c) => c.ok).length} / ${cas.length} extraits attrapés`],
      [defauts.length === 0, `garde sur votre code : ${defauts.length} défaut(s)`],
    ];
  },
  'A2.3': async (S) => [[(await lancerTests(S, 'A2.3')).code === 0, 'boucle : tests verts']],
  'A2.4': async () => {
    const j = lire('prompts/juge.md') ?? '';
    const grille = (j.match(/<grille>([\s\S]*?)<\/grille>/) || [])[1] ?? '';
    return [[(grille.match(/^\s*\d+\./gm) || []).length >= 4 && !/à écrire/.test(grille), 'prompts/juge.md : grille d’au moins 4 critères']];
  },
  'A2.5': async () => {
    const r = lire('eval/rapport.md') ?? '';
    return [
      [(r.match(/^## Mesure/gm) || []).length >= 2, 'eval/rapport.md : au moins 2 mesures'],
      [sectionsRemplies(r, ['Décision']), 'eval/rapport.md : décision écrite'],
    ];
  },
  'A3.1': async (S) => [[(await lancerTests(S, 'A3.1')).code === 0, 'premier appel : tests verts']],
  'A3.2': async (S) => [[(await lancerTests(S, 'A3.2')).code === 0, 'extraction structurée : tests verts']],
  'A3.3': async (S) => [[(await lancerTests(S, 'A3.3')).code === 0, 'boucle d’outils : tests verts']],
  'A3.4': async (S) => [[(await lancerTests(S, 'A3.4')).code === 0, 'priorité calculée et injection neutralisée : tests verts']],
  'A3.5': async (S) => [[(await lancerTests(S, 'A3.5')).code === 0, 'idempotence : tests verts']],
  'A4.1': async () => {
    const md = lire('CLAUDE.md') ?? '';
    let st = {};
    try {
      st = JSON.parse(lire('.claude/settings.json') ?? '{}');
    } catch {
      /* contrôlé plus bas */
    }
    const deny = st.permissions?.deny ?? [];
    const allow = st.permissions?.allow ?? [];
    return [
      [md.length > 0 && md.split('\n').length <= 80 && /guichet\.mjs/.test(md), 'CLAUDE.md : présent, court (≤ 80 lignes), avec les commandes'],
      [deny.some((r) => /\.env/.test(r)), 'permissions : lecture de .env refusée'],
      [allow.some((r) => /guichet\.mjs/.test(r)), 'permissions : commandes guichet.mjs autorisées'],
    ];
  },
  'A4.2': async (S) => {
    const fm = frontmatter(lire('.claude/skills/ajouter-champ/SKILL.md'));
    const s = lireJson(R('contrats', 'demande.schema.json'));
    const t = await lancerTests(S, 'A4.2');
    return [
      [fm?.name === 'ajouter-champ' && (fm?.description ?? '').length >= 60, 'Skill ajouter-champ : nom et description qui dit quand l’utiliser'],
      [Boolean(s.properties?.site_web), 'contrat : champ site_web'],
      [/name="site_web"/.test(lire('web/index.html') ?? ''), 'interface : champ site_web dans le formulaire'],
      [t.code === 0, 'site_web enregistré de bout en bout : tests verts'],
    ];
  },
  'A4.3': async () => {
    let st = {};
    try {
      st = JSON.parse(lire('.claude/settings.json') ?? '{}');
    } catch {
      /* */
    }
    const pre = JSON.stringify(st.hooks?.PreToolUse ?? '');
    const post = JSON.stringify(st.hooks?.PostToolUse ?? '');
    return [
      [hookBloque({ tool_name: 'Write', tool_input: { file_path: 'ts/src/config.ts', content: 'const NOTION_TOKEN = "ntn_51b2f8c3d9e0a1b2c3d4e5f6a9";' } }) === 2, 'hook : un secret dans le code est bloqué (code 2)'],
      [hookBloque({ tool_name: 'Write', tool_input: { file_path: '.env', content: 'X=1' } }) === 2, 'hook : l’écriture de .env est bloquée'],
      [hookBloque({ tool_name: 'Edit', tool_input: { file_path: 'ts/src/serveur.ts', old_string: 'a', new_string: 'const port = 3000;' } }) === 0, 'hook : une modification saine passe (code 0)'],
      [/bloquer-secrets/.test(pre) && /Write|Edit/.test(pre), 'settings.json : hook PreToolUse sur Write|Edit'],
      [/guichet\.mjs garde/.test(post), 'settings.json : garde lancée en PostToolUse'],
    ];
  },
  'A4.4': async () => [[await mcpRepond(), '.mcp.json : serveur « demandes » déclaré et qui répond (tools/list)']],
  'A4.5': async (S) => {
    const fm = frontmatter(lire('.claude/agents/relecteur-securite.md'));
    const t = await lancerTests(S, 'A4.5');
    return [
      [fm?.name === 'relecteur-securite' && Boolean(fm?.description), 'sous-agent relecteur-securite : nom et description'],
      [Boolean(fm?.tools) && !/\b(Write|Edit)\b/.test(fm.tools), 'sous-agent : outils en lecture seule (ni Write ni Edit)'],
      [t.code === 0, 'filtre par client : tests verts'],
    ];
  },
  A5: async (S) => {
    const t = await lancerTests(S, 'A5');
    return [
      [(lire('decisions/langue.md') ?? '').trim().length > 40, 'decisions/langue.md : plan relu et enregistré'],
      [t.code === 0, 'langue et routage : tests verts'],
    ];
  },
};

COMMANDES.verifier = async () => {
  const etape = (positionnels[0] || '').toUpperCase();
  if (etape === 'A0') return COMMANDES.poste();
  if (!CONTROLES[etape]) {
    console.error(`Étape inconnue. Étapes : A0, ${ETAPES.join(', ')}`);
    process.exit(1);
  }
  const S = stackActive();
  console.log(GRIS(`Vérification de ${etape} · ${S.nom}`));
  const res = await CONTROLES[etape](S);
  for (const [v, txt, aide] of res) (v ? ok : ko)(`${txt}${!v && aide ? GRIS(`  → ${aide}`) : ''}`);
  const bon = res.every(([v]) => v);
  console.log(bon ? VERT(GRAS(`\nÉtape ${etape} réussie.`)) : ROUGE(GRAS(`\nÉtape ${etape} pas encore réussie.`)) + GRIS(` En retard au point d’étape ? node guichet.mjs reprise ${etape}`));
  process.exitCode = bon ? 0 : 1;
};

// ─── Reprises ───────────────────────────────────────────────────────────────
COMMANDES.reprise = () => {
  const etape = (positionnels[0] || '').toUpperCase();
  const idx = ETAPES.indexOf(etape);
  if (idx < 0) {
    console.error(`Étape inconnue. Étapes : ${ETAPES.join(', ')}`);
    process.exit(1);
  }
  const S = stackActive();
  const autres = Object.values(STACKS).map((s) => `${s.dossier}/`).filter((d) => d !== `${S.dossier}/`);
  let n = 0;
  for (const e of ETAPES.slice(0, idx + 1)) {
    const f = R('reprises', `${e}.paquet`);
    if (!existe(f)) continue;
    const paquet = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(f, 'utf8'), 'base64')).toString('utf8'));
    for (const [rel, contenu] of Object.entries(paquet.fichiers)) {
      if (autres.some((d) => rel.startsWith(d))) continue;
      fs.mkdirSync(path.dirname(R(rel)), { recursive: true });
      fs.writeFileSync(R(rel), contenu);
      n++;
    }
  }
  ok(`Reprise ${etape} appliquée (${n} fichier(s) écrits pour ${S.nom}). Vous êtes au début de l’étape suivante.`);
  console.log(GRIS('Pensez à commiter avant et après une reprise : git add -A && git commit -m "reprise"'));
};

// ─── Atelier 1 : génération mesurée ─────────────────────────────────────────
COMMANDES.generer = async () => {
  const [cible, version] = positionnels;
  if (cible !== 'normaliser' || !version) {
    console.error('Usage : node guichet.mjs generer normaliser <v1|v2|v3> [--modele haiku|sonnet]');
    process.exit(1);
  }
  const S = stackActive();
  const fichierPrompt = R('prompts', `normaliser.${version}.md`);
  if (!existe(fichierPrompt)) {
    console.error(`Prompt introuvable : prompts/normaliser.${version}.md`);
    process.exit(1);
  }
  const cibleRel = S.fichiers['src/domaine/normaliser'];
  let prompt = fs.readFileSync(fichierPrompt, 'utf8').replace(/\{\{fichier:([^}]+)\}\}/g, (_, logique) => {
    const rel = S.fichiers[logique.trim()];
    return rel && existe(R(rel)) ? `<fichier chemin="${rel}">\n${fs.readFileSync(R(rel), 'utf8')}\n</fichier>` : `(fichier ${logique} introuvable)`;
  });
  prompt += `\n\n<consignes_outil>\nLangage : ${S.nom}. Fichier à produire : ${cibleRel}.\nConventions du projet : ${S.conventions}\nRéponds uniquement avec le contenu complet de ce fichier, dans un seul bloc de code, sans explication.\n</consignes_outil>\n`;
  const modele = opt('modele');
  console.log(GRIS(`claude -p ${modele ? `--model ${modele} ` : ''}· prompt ${path.basename(fichierPrompt)} · cible ${cibleRel}`));
  const debut = Date.now();
  let j;
  try {
    j = claudeP(prompt, { modele });
  } catch (e) {
    ko(e.message);
    process.exit(1);
  }
  const blocs = [...String(j.result).matchAll(/```[\w#+-]*\r?\n([\s\S]*?)```/g)].map((m) => m[1]);
  const code = blocs.sort((a, b) => b.length - a.length)[0] ?? String(j.result);
  fs.mkdirSync(R('generations'), { recursive: true });
  const ext = path.extname(cibleRel);
  fs.writeFileSync(R('generations', `normaliser.${version}${ext}`), code);
  const sauvegarde = existe(R(cibleRel)) ? fs.readFileSync(R(cibleRel), 'utf8') : null;
  fs.writeFileSync(R(cibleRel), code);
  const t = await lancerTests(S, 'A1.2');
  const duree = Math.round((Date.now() - debut) / 1000);
  const attendu = lireJson(R('donnees', 'normalisation-cas.json')).cas.length;
  // Moins de tests que de cas : le fichier de tests n'a pas pu charger le code (signature ou export absent).
  if (t.score && t.score.total < attendu) t.score = null;
  const passes = t.score?.passes ?? 0;
  if (!t.score) {
    if (sauvegarde !== null) fs.writeFileSync(R(cibleRel), sauvegarde);
    ko(`Le code généré ne compile pas ou ne respecte pas la signature attendue : 0 / ${attendu} (fichier précédent restauré ; la génération est dans generations/normaliser.${version}${ext})`);
  } else (passes === 24 ? ok : ko)(`${passes} / ${t.score.total} tests · ${duree} s · ajouté à resultats.csv`);
  const csv = R('resultats.csv');
  if (!existe(csv)) fs.writeFileSync(csv, 'date;cible;version;modele;stack;tests_verts;total;duree_s\n');
  fs.appendFileSync(csv, `${new Date().toISOString().slice(0, 16)};normaliser;${version};${modele ?? 'défaut'};${S.id};${passes};${t.score?.total ?? 24};${duree}\n`);
  if (t.score && passes < 24) console.log(GRIS('Détail des échecs : node guichet.mjs tests --tag A1.2 --detail'));
};

// ─── Extraction et évaluation ───────────────────────────────────────────────
const DEMANDES = () => lireJson(R('donnees', 'demandes.json'));
COMMANDES.extraire = async () => {
  const n = Number(opt('cas'));
  const d = DEMANDES().find((x) => x.id === n);
  if (!d) {
    console.error('Usage : node guichet.mjs extraire --cas <1-12> [--prompt extraction] [--moteur simu|claude-cli] [--sans-exemples] [--modele m]');
    process.exit(1);
  }
  const moteur = opt('moteur', process.env.MOTEUR || 'simu');
  const prompt = rendrePrompt(opt('prompt', 'extraction'), d.formulaire, { exemples: !drapeau('sans-exemples') });
  const schema = lireJson(R('contrats', 'demande.schema.json'));
  console.log(GRIS(`moteur ${moteur} · prompt ${opt('prompt', 'extraction')} · demande n° ${n}`));
  try {
    const sortie = await (moteur === 'simu' ? avecSimulateur((url) => extraireAvec('simu', prompt, schema, opt('modele'), url)) : extraireAvec(moteur, prompt, schema, opt('modele'), null));
    console.log(JSON.stringify(sortie, null, 2));
    const erreurs = valider(sortie, schema);
    if (erreurs.length) for (const e of erreurs) ko(`contrat : ${e}`);
    else ok('conforme au contrat');
  } catch (e) {
    ko(e.message);
    process.exitCode = 1;
  }
};

function noter(id, sortie, attendu, schema) {
  const res = {};
  if (attendu.rejet) {
    res.rejet = valider(sortie, schema).length > 0 || !sortie?.client;
    return res;
  }
  const f = attendu.faits;
  res.type = sortie.type === f.type;
  res.priorite = sortie.priorite === attendu.priorite;
  res.client = String(sortie.client ?? '').toLowerCase() === f.client.toLowerCase();
  res.telephone = (sortie.telephone ?? null) === f.telephone;
  res.utilisateurs_touches = (sortie.utilisateurs_touches ?? null) === f.utilisateurs_touches;
  res.panne_totale = Boolean(sortie.panne_totale) === f.panne_totale;
  if (attendu.injection) res.injection = sortie.type === 'question' && !/directeur|riahi|22000001/i.test(sortie.resume ?? '');
  return res;
}

COMMANDES.eval = async () => {
  const nomPrompt = opt('prompt', 'extraction');
  const modele = opt('modele');
  const moteur = opt('moteur', process.env.MOTEUR === 'simu' ? 'simu' : 'claude-cli');
  const schema = lireJson(R('contrats', 'demande.schema.json'));
  const attendus = lireJson(R('donnees', 'attendus.json'));
  const demandes = DEMANDES();
  console.log(GRIS(`Évaluation · prompt ${nomPrompt} · modèle ${modele ?? 'défaut'} · moteur ${moteur} · ${demandes.length} demandes`));
  const resultats = [];
  const run = async (url) => {
    const file = [...demandes];
    const travailleurs = Array.from({ length: moteur === 'simu' ? 1 : 4 }, async () => {
      while (file.length) {
        const d = file.shift();
        const t0 = Date.now();
        let sortie = null;
        let erreur = null;
        try {
          sortie = await extraireAvec(moteur, rendrePrompt(nomPrompt, d.formulaire), schema, modele, url);
        } catch (e) {
          erreur = e.message;
        }
        const notes = sortie ? noter(d.id, sortie, attendus[String(d.id)], schema) : attendus[String(d.id)].rejet ? { rejet: true } : {};
        resultats.push({ id: d.id, sortie, erreur, notes, duree: (Date.now() - t0) / 1000 });
        process.stdout.write(sortie || attendus[String(d.id)].rejet ? '.' : 'x');
      }
    });
    await Promise.all(travailleurs);
  };
  await (moteur === 'simu' ? avecSimulateur(run) : run(null));
  console.log('');
  resultats.sort((a, b) => a.id - b.id);
  const champs = ['type', 'priorite', 'client', 'telephone', 'utilisateurs_touches', 'panne_totale', 'injection', 'rejet'];
  const lignes = champs.map((c) => {
    const notes = resultats.filter((r) => c in r.notes);
    const bons = notes.filter((r) => r.notes[c]).length;
    return { c, bons, total: notes.length };
  });
  const moyenne = resultats.reduce((s, r) => s + r.duree, 0) / resultats.length;
  const rates = resultats.flatMap((r) => Object.entries(r.notes).filter(([, v]) => !v).map(([c]) => `n° ${r.id} (${c}${r.sortie && c in (r.sortie ?? {}) ? ` : ${JSON.stringify(r.sortie[c])}` : ''})`).concat(r.erreur ? [`n° ${r.id} (erreur : ${r.erreur.slice(0, 80)})`] : []));
  for (const l of lignes) console.log(`${l.c.padEnd(22)} ${l.bons === l.total ? VERT(`${l.bons}/${l.total}`) : ROUGE(`${l.bons}/${l.total}`)}`);
  console.log(`temps moyen            ${moyenne.toFixed(1).replace('.', ',')} s`);
  const fichier = R('eval', 'rapport.md');
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  let rapport = existe(fichier) ? fs.readFileSync(fichier, 'utf8') : '# Rapport d’évaluation · extraction des demandes\n\n## Décision\n\n(à compléter : quelle version, quel modèle, pourquoi)\n';
  const section = [
    `## Mesure ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · prompt ${nomPrompt} · modèle ${modele ?? 'défaut'} · moteur ${moteur}`,
    '',
    '| Champ | Score |',
    '|---|---|',
    ...lignes.map((l) => `| ${l.c} | ${l.bons}/${l.total} |`),
    `| temps moyen | ${moyenne.toFixed(1).replace('.', ',')} s |`,
    '',
    `Cas ratés : ${rates.length ? rates.join(' ; ') : 'aucun'}`,
    '',
  ].join('\n');
  rapport = rapport.includes('## Décision') ? rapport.replace('## Décision', `${section}\n## Décision`) : `${rapport}\n${section}`;
  fs.writeFileSync(fichier, rapport);
  ok(`Mesure ajoutée à eval/rapport.md`);
};

// ─── Juge ───────────────────────────────────────────────────────────────────
COMMANDES.juger = () => {
  const S = stackActive();
  const cible = positionnels[0];
  if (!cible) {
    console.error('Usage : node guichet.mjs juger <chemin> (ex. src/api, ou un fichier)');
    process.exit(1);
  }
  const base = [R(cible), R(S.dossier, cible), R(S.dossier, 'src', 'main', 'java', 'guichet', cible.replace(/^src\//, '')), R(S.dossier, 'guichet', cible.replace(/^src\//, '')), R(S.dossier, 'Guichet', pascal(cible.replace(/^src\//, '')))].find(existe);
  if (!base) {
    console.error(`Introuvable : ${cible}`);
    process.exit(1);
  }
  const fichiers = fs.statSync(base).isDirectory() ? fichiersSource(base) : [base];
  let code = '';
  for (const f of fichiers) {
    const bloc = `<fichier chemin="${path.relative(RACINE, f).replace(/\\/g, '/')}">\n${fs.readFileSync(f, 'utf8')}\n</fichier>\n`;
    if (code.length + bloc.length > 60_000) break;
    code += bloc;
  }
  const prompt = fs.readFileSync(R('prompts', 'juge.md'), 'utf8').replace('{{code}}', code);
  console.log(GRIS(`Juge · ${fichiers.length} fichier(s) · claude -p`));
  try {
    const j = claudeP(prompt, { schema: lireJson(R('contrats', 'verdict.schema.json')), modele: opt('modele') });
    const v = j.structured_output ?? JSON.parse(j.result);
    for (const c of v.criteres) console.log(`${'★'.repeat(c.note)}${'☆'.repeat(4 - c.note)}  ${GRAS(c.critere)}\n      ${c.justification}`);
    console.log(`\n${v.synthese}`);
  } catch (e) {
    ko(e.message);
    process.exitCode = 1;
  }
};

// ─── Boucle (délègue au code de votre stack) ───────────────────────────────
COMMANDES.boucle = () => {
  const S = stackActive();
  const tache = positionnels[0];
  if (!tache || !existe(R(tache))) {
    console.error('Usage : node guichet.mjs boucle taches/tronquer-resume.md');
    process.exit(1);
  }
  const [cmd, args] = S.boucle(R(tache));
  const r = executer(cmd, args, { cwd: R(S.dossier), env: envStack(''), afficher: true, temps: 1_800_000 });
  process.exitCode = r.code;
};

COMMANDES.contrat = () => {
  const s = lireJson(R('contrats', 'demande.schema.json'));
  for (const [k, def] of Object.entries(s.properties ?? {})) {
    const source = def['x-source'] ?? 'modele';
    console.log(`${k.padEnd(22)} ${String([].concat(def.type ?? (def.enum ? 'enum' : '?')).join('|')).padEnd(18)} ${GRIS(source)}${(s.required ?? []).includes(k) ? '' : GRIS(' (facultatif)')}`);
  }
  console.log(GRIS('\nSources : modele = extrait par Claude · formulaire = recopié du formulaire · code = calculé par l’application'));
  console.log(GRIS('Les colonnes de la base sont créées automatiquement à partir de ce contrat au démarrage.'));
};

// ─── Point d'entrée ─────────────────────────────────────────────────────────
const f = COMMANDES[CMD];
if (!f) {
  console.error(`Commande inconnue : ${CMD}`);
  COMMANDES.aide();
  process.exit(1);
}
await f();

