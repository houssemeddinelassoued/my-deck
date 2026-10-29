"""Calculs géographiques simples pour l'application de livraison.

Distances à vol d'oiseau (formule de haversine, Terre supposée sphérique), recherche
des points proches et affichage des coordonnées. Précision : environ 0,5 %, suffisante
pour estimer une zone de livraison, pas pour la navigation.
"""

from dataclasses import dataclass
from math import asin, cos, radians, sin, sqrt

RAYON_TERRE_KM = 6371.0


@dataclass(frozen=True)
class Point:
    """Un lieu nommé, en coordonnées WGS 84.

    Attributes:
        nom: Nom affiché du lieu.
        lat: Latitude en degrés décimaux, de -90 (sud) à 90 (nord).
        lon: Longitude en degrés décimaux, de -180 (ouest) à 180 (est).
    """

    nom: str
    lat: float
    lon: float


def distance_km(a: Point, b: Point) -> float:
    """Distance à vol d'oiseau entre deux points, par la formule de haversine.

    Args:
        a: Point de départ.
        b: Point d'arrivée.

    Returns:
        La distance en kilomètres, arrondie à 0,1 km.

    Example:
        >>> distance_km(Point("Montréal", 45.5019, -73.5674), Point("Québec", 46.8139, -71.2080))
        233.0
    """
    dlat = radians(b.lat - a.lat)
    dlon = radians(b.lon - a.lon)
    h = sin(dlat / 2) ** 2 + cos(radians(a.lat)) * cos(radians(b.lat)) * sin(dlon / 2) ** 2
    return round(2 * RAYON_TERRE_KM * asin(sqrt(h)), 1)


def dans_le_rayon(centre: Point, points: list[Point], rayon_km: float) -> list[Point]:
    """Points situés à au plus `rayon_km` du centre, du plus proche au plus éloigné.

    Args:
        centre: Point de référence.
        points: Points candidats.
        rayon_km: Rayon de recherche en kilomètres (bord inclus).

    Returns:
        Les points dans le rayon, triés par distance croissante.

    Raises:
        ValueError: Si `rayon_km` est négatif.

    Example:
        >>> mtl = Point("Montréal", 45.5019, -73.5674)
        >>> tr = Point("Trois-Rivières", 46.3430, -72.5477)
        >>> [p.nom for p in dans_le_rayon(mtl, [tr], 150)]
        ['Trois-Rivières']
    """
    if rayon_km < 0:
        raise ValueError("rayon négatif")
    return sorted((p for p in points if distance_km(centre, p) <= rayon_km), key=lambda p: distance_km(centre, p))


def plus_proche(origine: Point, points: list[Point]) -> Point | None:
    """Le point le plus proche de l'origine, l'origine elle-même étant exclue.

    Args:
        origine: Point de référence.
        points: Points candidats (peut contenir l'origine).

    Returns:
        Le point le plus proche, ou None s'il n'y a aucun autre point.

    Example:
        >>> mtl = Point("Montréal", 45.5019, -73.5674)
        >>> plus_proche(mtl, [mtl]) is None
        True
    """
    candidats = [p for p in points if p != origine]
    return min(candidats, key=lambda p: distance_km(origine, p), default=None)


def format_coordonnees(p: Point) -> str:
    """Coordonnées lisibles, avec 4 décimales et les points cardinaux N/S et E/O.

    Args:
        p: Le point à afficher.

    Returns:
        Une chaîne comme « 45.5019° N, 73.5674° O ».

    Example:
        >>> format_coordonnees(Point("Montréal", 45.5019, -73.5674))
        '45.5019° N, 73.5674° O'
    """
    ns = "N" if p.lat >= 0 else "S"
    eo = "E" if p.lon >= 0 else "O"
    return f"{abs(p.lat):.4f}° {ns}, {abs(p.lon):.4f}° {eo}"
