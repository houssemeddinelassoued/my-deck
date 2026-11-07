// Atelier 5 · Le circuit de signature (corrigé)

import { ErreurParafo } from './erreurs.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MODES = Object.freeze(['sequentiel', 'parallele']);

/**
 * Crée un circuit de signature.
 * @param {{ documentId: string, signataires: string[], mode?: 'sequentiel' | 'parallele' }} donnees
 * @throws {ErreurParafo} SIGNATAIRES_INVALIDES, MODE_INVALIDE
 */
export function creerCircuit({ documentId, signataires, mode = 'sequentiel' } = {}) {
  if (!Array.isArray(signataires) || signataires.length === 0) {
    throw new ErreurParafo('SIGNATAIRES_INVALIDES', 'Il faut au moins un signataire.');
  }
  const emails = signataires.map((s) => (typeof s === 'string' ? s.trim().toLowerCase() : ''));
  if (emails.some((e) => !EMAIL.test(e)) || new Set(emails).size !== emails.length) {
    throw new ErreurParafo('SIGNATAIRES_INVALIDES', 'Signataires : e-mails valides et sans doublon.');
  }
  if (!MODES.includes(mode)) {
    throw new ErreurParafo('MODE_INVALIDE', `Mode inconnu : ${mode}`);
  }
  return {
    documentId,
    mode,
    statut: 'en_cours',
    etapes: emails.map((email, i) => ({ email, ordre: i + 1, decision: null, le: null })),
  };
}

/**
 * E-mails des signataires attendus maintenant.
 * @returns {string[]}
 */
export function prochainsSignataires(circuit) {
  if (circuit.statut !== 'en_cours') return [];
  const enAttente = circuit.etapes.filter((e) => e.decision === null).map((e) => e.email);
  return circuit.mode === 'sequentiel' ? enAttente.slice(0, 1) : enAttente;
}

function decider(circuit, email, decision, maintenant) {
  if (circuit.statut !== 'en_cours') {
    throw new ErreurParafo('CIRCUIT_TERMINE', 'Ce circuit est terminé.');
  }
  const cible = String(email ?? '').trim().toLowerCase();
  const etape = circuit.etapes.find((e) => e.email === cible);
  if (!etape) throw new ErreurParafo('SIGNATAIRE_INCONNU', `${email} ne fait pas partie du circuit.`);
  if (etape.decision !== null) throw new ErreurParafo('DEJA_DECIDE', `${cible} a déjà décidé.`);
  if (!prochainsSignataires(circuit).includes(cible)) {
    throw new ErreurParafo('PAS_VOTRE_TOUR', `Ce n’est pas encore le tour de ${cible}.`);
  }
  const etapes = circuit.etapes.map((e) => (e.email === cible ? { ...e, decision, le: maintenant.toISOString() } : { ...e }));
  const statut = decision === 'refuse' ? 'refuse' : etapes.every((e) => e.decision === 'signe') ? 'signe' : 'en_cours';
  return { ...circuit, statut, etapes };
}

/** Enregistre une signature. Renvoie un nouveau circuit. */
export function signer(circuit, email, maintenant = new Date()) {
  return decider(circuit, email, 'signe', maintenant);
}

/**
 * Enregistre un refus motivé : le circuit s'arrête.
 * @throws {ErreurParafo} MOTIF_OBLIGATOIRE (en plus des contrôles de signer)
 */
export function refuser(circuit, email, motif, maintenant = new Date()) {
  const suivant = decider(circuit, email, 'refuse', maintenant);
  if (typeof motif !== 'string' || motif.trim() === '') {
    throw new ErreurParafo('MOTIF_OBLIGATOIRE', 'Un refus doit être motivé.');
  }
  return { ...suivant, motifRefus: motif.trim() };
}

/** Avancement : signatures obtenues sur le total. */
export function avancement(circuit) {
  const total = circuit.etapes.length;
  const signes = circuit.etapes.filter((e) => e.decision === 'signe').length;
  return { signes, total, pourcentage: Math.round((signes / total) * 100) };
}
