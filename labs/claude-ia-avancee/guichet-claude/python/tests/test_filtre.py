"""[A4.5] Filtre du tableau de bord par client."""

from guichet.depot.filtre import filtrer_par_client

DEMANDES = [{"id": "D-1", "client": "Médina Retail"}, {"id": "D-2", "client": "Atlas Industrie"}, {"id": "D-3", "client": "Médina Retail"}]


def test_A4_5_recherche_partielle():
    assert [d["id"] for d in filtrer_par_client(DEMANDES, "medina")] == ["D-1", "D-3"]
    assert [d["id"] for d in filtrer_par_client(DEMANDES, "ATLAS")] == ["D-2"]


def test_A4_5_filtre_vide():
    assert len(filtrer_par_client(DEMANDES, "")) == 3
    assert len(filtrer_par_client(DEMANDES, None)) == 3


def test_A4_5_aucun_resultat():
    assert filtrer_par_client(DEMANDES, "zzz") == []
