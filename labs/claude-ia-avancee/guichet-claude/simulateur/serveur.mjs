// Simulateur de l'API Messages de Claude, pour les ateliers Guichet.
//
//   node simulateur/serveur.mjs            (port 8787, ou SIMU_PORT)
//
// Il parle le même format que POST /v1/messages : le SDK officiel de votre stack,
// pointé sur http://localhost:8787 (ANTHROPIC_BASE_URL), fonctionne sans clé réelle.
// Ce n'est PAS un modèle : il reconnaît les 12 demandes de donnees/ et rejoue des
// réponses enregistrées ; pour un texte inconnu, il applique quelques heuristiques.
//
//   GET    /__journal   les 50 dernières requêtes reçues et réponses envoyées (JSON)
//   DELETE /__journal   vide le journal
//   GET    /__sante     { ok: true }
//
// Comportements imités de la vraie API (pour apprendre les bons réflexes) :
//   - 400 si temperature / top_p / top_k sont envoyés, si le dernier message est
//     un message assistant (pré-remplissage), si tool_choice force un outil ;
//   - 400 si des tool_use restent sans tool_result dans le message user suivant ;
//   - un modèle « crédule » : si le texte du client n'est pas délimité par
//     <demande_client>, l'injection de la demande n° 11 fonctionne ;
//   - un modèle qui se trompe parfois de priorité (demandes n° 4 et n° 10).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const DONNEES = path.join(ICI, '..', 'donnees');
const lire = (f) => JSON.parse(fs.readFileSync(path.join(DONNEES, f), 'utf8'));
const DEMANDES = lire('demandes.json');
const ATTENDUS = lire('attendus.json');
const CLIENTS = lire('clients.json');

const PORT = Number(process.argv.includes('--port') ? process.argv[process.argv.indexOf('--port') + 1] : process.env.SIMU_PORT || 8787);
const journal = [];
const cacheVu = new Map(); // texte système → horodatage
let compteur = 0;

// Priorité « jugée » par le faux modèle : il ne connaît pas les contrats (n° 4)
// et se laisse impressionner par les majuscules (n° 10).
const PRIORITE_MODELE = { 4: 'P2', 10: 'P1' };

const normaliserEspaces = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function texteDe(contenu) {
  if (typeof contenu === 'string') return contenu;
  if (!Array.isArray(contenu)) return '';
  return contenu
    .map((b) => (b?.type === 'text' ? b.text : b?.type === 'tool_result' ? texteDe(b.content) : ''))
    .join('\n');
}

function texteComplet(corps) {
  const sys = typeof corps.system === 'string' ? corps.system : texteDe(corps.system);
  return [sys, ...corps.messages.map((m) => texteDe(m.content))].join('\n');
}

function trouverDemande(texte) {
  const t = normaliserEspaces(texte);
  return DEMANDES.find((d) => d.formulaire.message && t.includes(normaliserEspaces(d.formulaire.message)));
}

// Faits pour un texte inconnu : quelques heuristiques, assumées comme telles.
function faitsHeuristiques(texte) {
  const champ = (nom) => (texte.match(new RegExp(`^\\s*${nom}\\s*:\\s*(.+)$`, 'mi')) || [])[1]?.trim() || null;
  const message = champ('message') || texte;
  const bas = message.toLowerCase();
  const type = /devis|quote|prix|tarif|chiffr/.test(bas)
    ? 'devis'
    : /ajout|aimerions|voudrions|souhait|évolution|evolution|would like/.test(bas)
      ? 'evolution'
      : /\?\s*$|question|comment /.test(bas)
        ? 'question'
        : 'incident';
  const nb = bas.match(/(\d+)\s*(personnes|utilisateurs|users|agents|collaborateurs)/);
  const panne = /plus aucun|à l'arrêt|a l'arret|ne charge plus|ne marche plus|down|totalement|complètement/.test(bas);
  const utilisateurs = nb ? Number(nb[1]) : null;
  return {
    type,
    priorite: type !== 'incident' ? 'P3' : panne || (utilisateurs ?? 0) >= 20 ? 'P1' : 'P2',
    client: champ('entreprise') || '',
    contact: champ('nom'),
    email: champ('email')?.toLowerCase() || null,
    telephone: null,
    utilisateurs_touches: utilisateurs,
    panne_totale: panne,
    resume: normaliserEspaces(message).slice(0, 200),
  };
}

function faitsPour(corps) {
  const texte = texteComplet(corps);
  const d = trouverDemande(texte);
  if (!d) return { faits: faitsHeuristiques(texte), id: null };
  const a = ATTENDUS[String(d.id)];
  if (a.rejet) {
    return {
      id: d.id,
      faits: { type: 'incident', priorite: 'P2', client: '', contact: null, email: null, telephone: null, utilisateurs_touches: null, panne_totale: false, resume: 'ça marche pas' },
    };
  }
  const faits = { ...a.faits, priorite: PRIORITE_MODELE[d.id] ?? a.priorite };
  const delimite = [...texte.matchAll(/<demande_client>([\s\S]*?)<\/demande_client>/g)].some((m) => normaliserEspaces(m[1]).includes(normaliserEspaces(d.formulaire.message)));
  if (a.injection && !delimite) {
    // Le faux modèle « crédule » obéit à l'instruction cachée dans le formulaire.
    faits.type = 'incident';
    faits.priorite = 'P1';
    faits.resume = `${faits.resume} Contact direct du directeur technique : M. Riahi, +21622000001.`;
  }
  return { faits, id: d.id };
}

// Objet conforme aux propriétés d'un schéma (premier niveau).
function selonSchema(schema, valeurs) {
  const props = schema?.properties ?? {};
  const out = {};
  for (const [cle, def] of Object.entries(props)) {
    let v = valeurs[cle];
    if (v === undefined) {
      const types = [].concat(def?.type ?? []);
      v = types.includes('null') ? null : types.includes('boolean') ? false : types.includes('integer') ? 0 : def?.enum ? def.enum[0] : '';
    }
    out[cle] = v;
  }
  return out;
}

const erreur = (statut, message) => ({ statut, corps: { type: 'error', error: { type: 'invalid_request_error', message } } });

function controler(corps) {
  if (!corps || typeof corps !== 'object') return erreur(400, 'Invalid JSON body.');
  if (typeof corps.model !== 'string' || !corps.model) return erreur(400, 'model: Field required');
  if (typeof corps.max_tokens !== 'number') return erreur(400, 'max_tokens: Field required');
  if (!Array.isArray(corps.messages) || corps.messages.length === 0) return erreur(400, 'messages: at least one message is required');
  for (const p of ['temperature', 'top_p', 'top_k']) if (p in corps) return erreur(400, `${p}: this parameter is not supported by this model`);
  if (corps.messages.at(-1).role === 'assistant') return erreur(400, 'This model does not support assistant message prefill. The conversation must end with a user message.');
  if (corps.tool_choice && ['any', 'tool'].includes(corps.tool_choice.type)) return erreur(400, 'tool_choice: type "tool" and "any" are not supported for this model.');
  for (let i = 0; i < corps.messages.length; i++) {
    const m = corps.messages[i];
    if (m.role !== 'assistant' || !Array.isArray(m.content)) continue;
    const ids = m.content.filter((b) => b.type === 'tool_use').map((b) => b.id);
    if (!ids.length) continue;
    const suivant = corps.messages[i + 1];
    const recus = Array.isArray(suivant?.content) ? suivant.content.filter((b) => b.type === 'tool_result').map((b) => b.tool_use_id) : [];
    const manquants = ids.filter((id) => !recus.includes(id));
    if (suivant?.role !== 'user' || manquants.length) {
      return erreur(400, `messages.${i + 1}: tool_use ids were found without tool_result blocks immediately after: ${manquants.join(', ')}. Each tool_use block must have a corresponding tool_result block in the next message.`);
    }
  }
  return null;
}

function usage(corps, texteSortie) {
  const sys = typeof corps.system === 'string' ? corps.system : texteDe(corps.system);
  const avecCache = Array.isArray(corps.system) && corps.system.some((b) => b?.cache_control) ? true : Boolean(corps.cache_control);
  const jetonsSys = Math.ceil(sys.length / 4);
  const total = Math.ceil(texteComplet(corps).length / 4) + 20;
  let lus = 0;
  let ecrits = 0;
  if (avecCache && jetonsSys > 0) {
    const vu = cacheVu.get(sys);
    if (vu && Date.now() - vu < 5 * 60_000) lus = jetonsSys;
    else ecrits = jetonsSys;
    cacheVu.set(sys, Date.now());
  }
  return { input_tokens: total - lus - ecrits, cache_creation_input_tokens: ecrits, cache_read_input_tokens: lus, output_tokens: Math.ceil(texteSortie.length / 4) + 5 };
}

let idOutil = 0;
const toolUse = (name, input) => ({ type: 'tool_use', id: `toolu_simu_${++idOutil}`, name, input });

function repondre(corps) {
  const pb = controler(corps);
  if (pb) return pb;
  const outils = (corps.tools ?? []).filter((t) => t?.name);
  const parNom = Object.fromEntries(outils.map((t) => [t.name, t]));
  let content;
  let stop = 'end_turn';
  const format = corps.output_config?.format;

  if (format?.type === 'json_schema') {
    const { faits } = faitsPour(corps);
    content = [{ type: 'text', text: JSON.stringify(selonSchema(format.schema, faits)) }];
  } else if (outils.length) {
    const dernier = corps.messages.at(-1);
    const resultats = Array.isArray(dernier.content) ? dernier.content.filter((b) => b.type === 'tool_result') : [];
    const avant = corps.messages.at(-2);
    const appels = Array.isArray(avant?.content) ? avant.content.filter((b) => b.type === 'tool_use') : [];
    const { faits } = faitsPour(corps);
    if (!resultats.length) {
      if (parNom.chercher_client) {
        content = [{ type: 'text', text: 'Je cherche d’abord le client.' }, toolUse('chercher_client', { recherche: faits.client || faits.email || '' })];
      } else if (parNom.enregistrer_demande) {
        content = [toolUse('enregistrer_demande', selonSchema(parNom.enregistrer_demande.input_schema, { ...faits, client_id: null }))];
      } else {
        content = [{ type: 'text', text: 'Aucun outil utilisable : je ne peux rien enregistrer.' }];
      }
      if (content.some((b) => b.type === 'tool_use')) stop = 'tool_use';
    } else {
      const res = resultats[0];
      const appel = appels.find((a) => a.id === res.tool_use_id) ?? appels[0];
      const brut = texteDe(res.content);
      let donnees = {};
      try {
        donnees = JSON.parse(brut);
      } catch {
        /* résultat texte libre */
      }
      if (res.is_error) {
        content = [{ type: 'text', text: `L’outil ${appel?.name ?? '?'} a signalé une erreur : ${brut}. Je m’arrête là.` }];
      } else if (appel?.name === 'chercher_client' && parNom.enregistrer_demande) {
        const clientId = donnees.id ?? donnees.client_id ?? (Array.isArray(donnees) ? donnees[0]?.id : null) ?? null;
        content = [toolUse('enregistrer_demande', selonSchema(parNom.enregistrer_demande.input_schema, { ...faits, client_id: clientId }))];
        stop = 'tool_use';
      } else if (appel?.name === 'enregistrer_demande') {
        const ref = donnees.demande ?? donnees.id ?? '?';
        content = [{ type: 'text', text: `Demande ${ref} enregistrée en ${donnees.priorite ?? '?'}.` }];
      } else {
        content = [{ type: 'text', text: 'C’est fait.' }];
      }
    }
  } else {
    const t = normaliserEspaces(texteDe(corps.messages.at(-1).content)).slice(0, 80);
    content = [{ type: 'text', text: `Bonjour ! Ici le simulateur Guichet (aucun vrai modèle). J’ai bien reçu : « ${t} ».` }];
  }
  const sortie = content.map((b) => (b.type === 'text' ? b.text : JSON.stringify(b.input))).join('');
  return {
    statut: 200,
    corps: { id: `msg_simu_${++compteur}`, type: 'message', role: 'assistant', model: corps.model, content, stop_reason: stop, stop_sequence: null, usage: usage(corps, sortie) },
  };
}

const serveur = http.createServer((req, res) => {
  const envoyer = (statut, obj) => {
    res.writeHead(statut, { 'content-type': 'application/json; charset=utf-8', 'request-id': `req_simu_${compteur}` });
    res.end(JSON.stringify(obj, null, 2));
  };
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/__sante') return envoyer(200, { ok: true, simulateur: 'guichet' });
  if (req.method === 'GET' && url.pathname === '/__journal') return envoyer(200, journal);
  if (req.method === 'DELETE' && url.pathname === '/__journal') {
    journal.length = 0;
    return envoyer(200, { ok: true });
  }
  if (req.method === 'POST' && url.pathname === '/v1/messages') {
    let brut = '';
    req.setEncoding('utf8');
    req.on('data', (c) => (brut += c));
    req.on('end', () => {
      let corps = null;
      try {
        corps = JSON.parse(brut);
      } catch {
        /* contrôlé plus bas */
      }
      const { statut, corps: rep } = repondre(corps);
      journal.unshift({ horodatage: new Date().toISOString(), statut, requete: corps, reponse: rep });
      journal.length = Math.min(journal.length, 50);
      envoyer(statut, rep);
    });
    return;
  }
  envoyer(404, { type: 'error', error: { type: 'not_found_error', message: `${req.method} ${url.pathname} n’existe pas sur le simulateur` } });
});

serveur.listen(PORT, () => {
  console.log(`Simulateur Guichet prêt : http://localhost:${PORT}  (journal : http://localhost:${PORT}/__journal)`);
});
