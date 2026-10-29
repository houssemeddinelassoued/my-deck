"""Service de notes personnelles (corrigé après revue)."""

import hashlib
import hmac
import os
import sqlite3

SCHEMA = """
create table if not exists users (id integer primary key, email text unique, password text);
create table if not exists notes (id integer primary key, owner integer, contenu text);
"""
ITERATIONS = 200_000


def _secret() -> bytes:
    # Lu à l'exécution, jamais dans le code ni dans Git (variable d'environnement, coffre-fort…).
    return os.environ["NOTES_SECRET"].encode()


def _hacher(mot_de_passe: str, sel: bytes | None = None) -> str:
    sel = sel or os.urandom(16)
    empreinte = hashlib.pbkdf2_hmac("sha256", mot_de_passe.encode(), sel, ITERATIONS)
    return f"pbkdf2${ITERATIONS}${sel.hex()}${empreinte.hex()}"


def _verifier(mot_de_passe: str, stocke: str) -> bool:
    _, _, sel, _ = stocke.split("$")
    return hmac.compare_digest(_hacher(mot_de_passe, bytes.fromhex(sel)), stocke)


class NotesService:
    def __init__(self, chemin_bd: str = ":memory:"):
        self.bd = sqlite3.connect(chemin_bd)
        self.bd.executescript(SCHEMA)

    def inscrire(self, email: str, mot_de_passe: str) -> int:
        cur = self.bd.execute(
            "insert into users (email, password) values (?, ?)", (email, _hacher(mot_de_passe))
        )
        self.bd.commit()
        return cur.lastrowid

    def connecter(self, email: str, mot_de_passe: str) -> int | None:
        row = self.bd.execute("select id, password from users where email = ?", (email,)).fetchone()
        if row and _verifier(mot_de_passe, row[1]):
            return row[0]
        return None

    def ajouter_note(self, user_id: int, contenu: str) -> int:
        cur = self.bd.execute("insert into notes (owner, contenu) values (?, ?)", (user_id, contenu))
        self.bd.commit()
        return cur.lastrowid

    def lire_note(self, user_id: int, note_id: int) -> str | None:
        row = self.bd.execute(
            "select contenu from notes where id = ? and owner = ?", (note_id, user_id)
        ).fetchone()
        return row[0] if row else None

    def jeton(self, user_id: int) -> str:
        return hmac.new(_secret(), str(user_id).encode(), hashlib.sha256).hexdigest()
