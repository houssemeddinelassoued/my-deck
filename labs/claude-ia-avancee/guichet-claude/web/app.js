// Interface commune aux 4 stacks : elle ne parle qu'à l'API de votre application.
//   POST /api/demandes   → 201 { demande, nouvelle } | 422 { erreur } | 501 { erreur, reponse_brute }
//   GET  /api/demandes   → [ demande, … ]
const COLONNES = [
  ['id', 'N°'],
  ['cree_le', 'Reçue le'],
  ['priorite', 'Priorité'],
  ['type', 'Type'],
  ['client', 'Client'],
  ['contact', 'Contact'],
  ['resume', 'Résumé'],
];

const $ = (s) => document.querySelector(s);

function cellule(cle, valeur) {
  const td = document.createElement('td');
  if (valeur === null || valeur === undefined || valeur === '') {
    td.textContent = '—';
    td.className = 'nul';
  } else if (cle === 'priorite') {
    const b = document.createElement('span');
    b.className = `badge ${String(valeur).toLowerCase()}`;
    b.textContent = valeur;
    td.append(b);
  } else if (cle === 'cree_le') {
    td.textContent = new Date(valeur).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  } else {
    td.textContent = String(valeur);
  }
  return td;
}

async function charger() {
  try {
    const rep = await fetch('/api/demandes');
    const demandes = await rep.json();
    $('#entetes').replaceChildren(...COLONNES.map(([, titre]) => Object.assign(document.createElement('th'), { textContent: titre })));
    $('#lignes').replaceChildren(
      ...demandes.map((d) => {
        const tr = document.createElement('tr');
        tr.append(...COLONNES.map(([cle]) => cellule(cle, d[cle])));
        return tr;
      }),
    );
    $('#vide').hidden = demandes.length > 0;
    $('#etat').textContent = `${demandes.length} demande(s)`;
  } catch (e) {
    $('#etat').textContent = 'API injoignable';
  }
}

function afficherRetour(classe, html) {
  const r = $('#retour');
  r.className = `retour ${classe}`;
  r.innerHTML = html;
  r.hidden = false;
}

const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

$('#formulaire').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const donnees = Object.fromEntries(new FormData(ev.target).entries());
  afficherRetour('attente', 'Analyse en cours…');
  try {
    const rep = await fetch('/api/demandes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(donnees) });
    const corps = await rep.json();
    if (rep.status === 201) {
      const d = corps.demande;
      afficherRetour('ok', `${corps.nouvelle ? 'Demande enregistrée' : 'Demande déjà connue'} : <strong>${echapper(d.id)}</strong> · ${echapper(d.type)} · ${echapper(d.priorite)}`);
      await charger();
    } else if (rep.status === 501) {
      afficherRetour('info', `${echapper(corps.erreur)}<br><em>Réponse brute du moteur :</em> ${echapper(corps.reponse_brute ?? '—')}`);
    } else {
      afficherRetour('erreur', echapper(corps.erreur ?? `Erreur ${rep.status}`));
    }
  } catch (e) {
    afficherRetour('erreur', 'API injoignable : l’application est-elle lancée ?');
  }
});

$('#rafraichir').addEventListener('click', charger);

// Pré-remplissage avec les demandes de référence (servies par l'application).
fetch('/api/references')
  .then((r) => (r.ok ? r.json() : []))
  .then((refs) => {
    for (const d of refs) {
      const o = document.createElement('option');
      o.value = String(d.id);
      o.textContent = `n° ${d.id} · ${d.formulaire.entreprise || '(incomplète)'} · ${d.formulaire.message.slice(0, 50)}…`;
      $('#exemple').append(o);
    }
    $('#exemple').addEventListener('change', (ev) => {
      const d = refs.find((x) => String(x.id) === ev.target.value);
      if (!d) return;
      for (const [k, v] of Object.entries(d.formulaire)) {
        const champ = $(`#formulaire [name="${k}"]`);
        if (champ) champ.value = v;
      }
    });
  })
  .catch(() => {});

charger();
