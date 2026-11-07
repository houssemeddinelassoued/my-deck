// Relances du parapheur (code de 2019, refactoré à l'Atelier 6 SANS changer son comportement)
//
// Les défauts historiques sont CONSERVÉS volontairement (tests de caractérisation) :
//   - le jour d'envoi compte comme premier jour ouvré ;
//   - sans liste fournie, les fériés de 2019 s'appliquent ;
//   - un délai en texte ('5') est accepté ;
//   - la liste des fériés reçue est triée sur place.
// La version corrigée est src/relances.js.

const FERIES_2019 = ['2019-01-01', '2019-04-22', '2019-05-01', '2019-05-08', '2019-05-30', '2019-06-10', '2019-07-14', '2019-08-15', '2019-11-01', '2019-11-11', '2019-12-25'];
const UN_JOUR = 86_400_000;
const INTERVALLE_RELANCE = 3;

function versTexte(date) {
  const mois = String(date.getUTCMonth() + 1).padStart(2, '0');
  const jour = String(date.getUTCDate()).padStart(2, '0');
  return `${date.getUTCFullYear()}-${mois}-${jour}`;
}

function estOuvre(date, feries) {
  const jourSemaine = date.getUTCDay();
  const estWeekEnd = jourSemaine === 0 || jourSemaine === 6;
  return !estWeekEnd && !feries.includes(versTexte(date));
}

function lendemain(date) {
  return new Date(date.getTime() + UN_JOUR);
}

/**
 * @param {string} dateEnvoi 'AAAA-MM-JJ'
 * @param {number} delai jours ouvrés (le jour d'envoi compte, défaut historique)
 * @param {string[]} [feries] modifié sur place (défaut historique)
 * @param {'r' | 'e'} type 'r' = dates de relance, 'e' = date d'expiration
 */
export function calc(dateEnvoi, delai, feries, type) {
  const jours = feries || FERIES_2019;
  jours.sort();

  let date = new Date(`${dateEnvoi}T00:00:00Z`);
  let compteur = estOuvre(date, jours) ? 1 : 0;
  const relances = [];

  while (compteur < delai) {
    date = lendemain(date);
    if (!estOuvre(date, jours)) continue;
    compteur++;
    // == conservé : comportement de 2019 (un refactoring ne change pas les comparaisons)
    if (type == 'r' && compteur % INTERVALLE_RELANCE === 0 && compteur < delai) {
      relances.push(versTexte(date));
    }
  }

  if (type == 'e') return versTexte(date);
  if (type == 'r') return relances;
  return null;
}
