// CORRIGÉ · défauts : new Date("AAAA-MM-JJ") est lu en UTC ; heure du jour et changement d'heure
// faussent la division. On compare des dates calendaires, la date du jour passée en paramètre.
const jourUtc = (iso) => {
  const [a, m, j] = iso.split('-').map(Number);
  return Date.UTC(a, m - 1, j);
};

export function joursRestants(echeanceIso, aujourdHuiIso) {
  return Math.round((jourUtc(echeanceIso) - jourUtc(aujourdHuiIso)) / 86400000);
}
