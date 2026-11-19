"""Rend le prompt d'extraction (prompts/extraction.md) pour une demande du formulaire."""

from __future__ import annotations

from guichet.config import lire_texte
from guichet.domaine.demande import DemandeBrute
from guichet.pipeline.message import construire_message
from guichet.prompts.exemples import choisir_exemples, lire_exemples, rendre_exemples


def rendre_extraction(formulaire: DemandeBrute) -> str:
    prompt = lire_texte("prompts", "extraction.md")
    if "{{exemples}}" in prompt:
        prompt = prompt.replace("{{exemples}}", rendre_exemples(choisir_exemples(formulaire.get("message", ""), lire_exemples(), 3)))
    return prompt.replace("{{demande}}", construire_message(formulaire))
