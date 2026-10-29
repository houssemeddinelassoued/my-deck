"""La tâche et ses règles d'ordre et d'affichage."""

from dataclasses import asdict, dataclass, field
from datetime import date

PRIORITES = ("haute", "normale", "basse")


@dataclass
class Tache:
    id: int
    titre: str
    priorite: str = "normale"
    echeance: date | None = None
    etiquettes: list[str] = field(default_factory=list)
    terminee: bool = False

    def cle_de_tri(self) -> tuple:
        """Priorité, puis échéance la plus proche (sans échéance en dernier), puis identifiant."""
        return (PRIORITES.index(self.priorite), self.echeance or date.max, self.id)

    def en_ligne(self) -> str:
        case = "[x]" if self.terminee else "[ ]"
        echeance = self.echeance.isoformat() if self.echeance else "—"
        etiquettes = " ".join(f"#{e}" for e in self.etiquettes)
        return f"{case} {self.id:<2} {self.priorite:<8} {echeance:<10}  {self.titre}  {etiquettes}".rstrip()

    def vers_dict(self) -> dict:
        d = asdict(self)
        d["echeance"] = self.echeance.isoformat() if self.echeance else None
        return d

    @classmethod
    def depuis_dict(cls, d: dict) -> "Tache":
        echeance = date.fromisoformat(d["echeance"]) if d.get("echeance") else None
        return cls(**{**d, "echeance": echeance})
