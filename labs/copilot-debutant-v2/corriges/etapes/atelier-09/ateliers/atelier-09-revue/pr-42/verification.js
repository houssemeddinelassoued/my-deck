import { createHash, timingSafeEqual } from 'node:crypto';

const HEX_SHA256 = /^[0-9a-f]{64}$/;

/**
 * Vérifie que le contenu correspond à l'empreinte enregistrée au registre.
 * Comparaison en temps constant : la durée ne révèle pas où les empreintes diffèrent.
 * @param {Buffer | string} contenu
 * @param {string} empreinteAttendue SHA-256 en hexadécimal
 * @returns {boolean}
 */
export function empreinteValide(contenu, empreinteAttendue) {
  if (typeof empreinteAttendue !== 'string' || !HEX_SHA256.test(empreinteAttendue)) return false;
  const calculee = createHash('sha256').update(contenu).digest();
  return timingSafeEqual(calculee, Buffer.from(empreinteAttendue, 'hex'));
}
