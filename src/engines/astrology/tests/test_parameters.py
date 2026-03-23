"""Tests for astrology constants/parameters."""
from src.engines.astrology.constants import parameters


def test_all_12_signs_mapped():
    """Every zodiac sign should map to an element."""
    assert len(parameters.SIGN_ELEMENTS) == 12


def test_sign_elements_values():
    """All sign elements must be one of the four classical elements."""
    valid = {"fire", "earth", "air", "water"}
    for sign, element in parameters.SIGN_ELEMENTS.items():
        assert element in valid, f"{sign} has invalid element {element}"


def test_three_signs_per_element():
    """Each classical element should have exactly 3 signs."""
    counts = {}
    for element in parameters.SIGN_ELEMENTS.values():
        counts[element] = counts.get(element, 0) + 1
    for element, count in counts.items():
        assert count == 3, f"{element} has {count} signs, expected 3"


def test_planet_weights_keys():
    """All planets plus Ascendant should have weights."""
    expected = {
        "Sun", "Moon", "Ascendant",
        "Mercury", "Venus", "Mars",
        "Jupiter", "Saturn",
        "Uranus", "Neptune", "Pluto",
    }
    assert set(parameters.PLANET_WEIGHTS.keys()) == expected


def test_planet_weight_tiers():
    """Weights should match the spec: 3.0 / 1.5 / 1.0 / 0.5."""
    w = parameters.PLANET_WEIGHTS
    assert w["Sun"] == 3.0
    assert w["Moon"] == 3.0
    assert w["Ascendant"] == 3.0
    assert w["Mercury"] == 1.5
    assert w["Venus"] == 1.5
    assert w["Mars"] == 1.5
    assert w["Jupiter"] == 1.0
    assert w["Saturn"] == 1.0
    assert w["Uranus"] == 0.5
    assert w["Neptune"] == 0.5
    assert w["Pluto"] == 0.5


def test_spirit_signs():
    """Spirit signs should be Pisces, Sagittarius, Aquarius."""
    assert parameters.SPIRIT_SIGNS == {"Pis", "Sag", "Aqu"}


def test_house_name_mapping_complete():
    """All 12 houses should be mapped."""
    assert len(parameters.HOUSE_NAME_TO_NUMBER) == 12
    assert set(parameters.HOUSE_NAME_TO_NUMBER.values()) == set(range(1, 13))
