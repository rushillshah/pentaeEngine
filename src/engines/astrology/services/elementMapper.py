"""
Maps natal chart data to a 5-element vector with spirit bonuses.
"""
from ..constants import parameters

ELEMENTS = parameters.ELEMENTS


def sign_to_element(sign):
    """
    Look up the classical element for a zodiac sign abbreviation.
    Returns one of "fire", "earth", "air", "water".
    Raises ValueError for unknown signs.
    """
    element = parameters.SIGN_ELEMENTS.get(sign)
    if element is None:
        raise ValueError(f"Unknown zodiac sign abbreviation: {sign}")
    return element


def _count_planets_in_house(chart_data, house_number):
    """Count how many planets are in a given house."""
    count = 0
    for key, placement in chart_data.items():
        if key == "Ascendant":
            continue
        if placement.get("house") == house_number:
            count += 1
    return count


def _compute_spirit_bonus(chart_data):
    """
    Calculate Spirit bonus points from special placements.

    Rules:
        - Sun/Moon/Ascendant in Pisces, Sagittarius, or Aquarius: +2.0 each
        - Neptune in a spirit sign: +1.5
        - Neptune in 12th house: +1.5
        - 3+ planets in 12th house: +1.0
    """
    bonus = 0.0

    # Sun/Moon/Ascendant in spirit signs
    for key in ["Sun", "Moon", "Ascendant"]:
        placement = chart_data.get(key, {})
        if placement.get("sign") in parameters.SPIRIT_SIGNS:
            bonus += parameters.SUN_MOON_ASC_SPIRIT_BONUS

    # Neptune in a spirit sign
    neptune = chart_data.get("Neptune", {})
    if neptune.get("sign") in parameters.SPIRIT_SIGNS:
        bonus += parameters.NEPTUNE_SPIRIT_SIGN_BONUS

    # Neptune in 12th house
    if neptune.get("house") == 12:
        bonus += parameters.NEPTUNE_12TH_HOUSE_BONUS

    # 12th house stellium (3+ planets)
    if _count_planets_in_house(chart_data, 12) >= parameters.STELLIUM_THRESHOLD:
        bonus += parameters.STELLIUM_12TH_HOUSE_BONUS

    return bonus


def chart_to_element_vector(chart_data):
    """
    Convert natal chart placements into a raw (unnormalized) element vector.

    Steps:
        1. For each planet/point, add its weight to the element of its sign.
        2. Add spirit bonuses based on special placements.

    Args:
        chart_data: dict from chartService.compute_natal_chart()

    Returns:
        dict {air: float, water: float, fire: float, earth: float, spirit: float}
        (raw — not yet normalized)
    """
    vector = {el: 0.0 for el in ELEMENTS}

    # Step 1: Weighted planet contributions
    for point_name, weight in parameters.PLANET_WEIGHTS.items():
        placement = chart_data.get(point_name)
        if placement is None:
            continue
        sign = placement.get("sign")
        if sign is None:
            continue
        element = sign_to_element(sign)
        vector[element] += weight

    # Step 2: Spirit bonuses
    vector["spirit"] += _compute_spirit_bonus(chart_data)

    return vector
