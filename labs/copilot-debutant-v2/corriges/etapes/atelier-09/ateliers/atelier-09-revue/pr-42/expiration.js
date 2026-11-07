/**
 * Le document peut-il encore être signé aujourd'hui ?
 * Règle Parafo : on peut signer jusqu'au jour d'expiration INCLUS.
 * @param {string} dateExpiration 'AAAA-MM-JJ'
 * @param {string} aujourdhui 'AAAA-MM-JJ'
 * @returns {boolean}
 */
export function peutEncoreSigner(dateExpiration, aujourdhui) {
  return aujourdhui <= dateExpiration;
}
