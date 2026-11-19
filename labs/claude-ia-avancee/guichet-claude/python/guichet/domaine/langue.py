"""Défi final (Atelier 5) · langue de la demande et équipe de routage."""

from __future__ import annotations

from guichet.config import a_completer


def detecter_langue(texte: str) -> str:
    a_completer(f"A5 : detecter_langue ({len(texte or '')} caractères)")


def equipe_pour(langue: str) -> str:
    a_completer(f"A5 : equipe_pour ({langue})")
