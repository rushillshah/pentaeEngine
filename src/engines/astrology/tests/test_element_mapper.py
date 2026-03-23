"""Tests for the element mapper service."""
import pytest
from src.engines.astrology.services.elementMapper import (
    sign_to_element,
    chart_to_element_vector,
    _compute_spirit_bonus,
    _count_planets_in_house,
)
from src.engines.astrology.constants import parameters


# -- sign_to_element -----------------------------------------------------------

class TestSignToElement:
    def test_fire_signs(self):
        assert sign_to_element("Ari") == "fire"
        assert sign_to_element("Leo") == "fire"
        assert sign_to_element("Sag") == "fire"

    def test_earth_signs(self):
        assert sign_to_element("Tau") == "earth"
        assert sign_to_element("Vir") == "earth"
        assert sign_to_element("Cap") == "earth"

    def test_air_signs(self):
        assert sign_to_element("Gem") == "air"
        assert sign_to_element("Lib") == "air"
        assert sign_to_element("Aqu") == "air"

    def test_water_signs(self):
        assert sign_to_element("Can") == "water"
        assert sign_to_element("Sco") == "water"
        assert sign_to_element("Pis") == "water"

    def test_unknown_sign_raises(self):
        with pytest.raises(ValueError, match="Unknown zodiac sign"):
            sign_to_element("Xyz")


# -- _count_planets_in_house ---------------------------------------------------

class TestCountPlanetsInHouse:
    def test_counts_correctly(self):
        chart = {
            "Sun": {"sign": "Leo", "house": 12},
            "Moon": {"sign": "Tau", "house": 12},
            "Mercury": {"sign": "Ari", "house": 5},
            "Ascendant": {"sign": "Sco"},
        }
        assert _count_planets_in_house(chart, 12) == 2
        assert _count_planets_in_house(chart, 5) == 1
        assert _count_planets_in_house(chart, 1) == 0

    def test_ignores_ascendant(self):
        """Ascendant has no house and should be skipped."""
        chart = {
            "Sun": {"sign": "Leo", "house": 1},
            "Ascendant": {"sign": "Sco"},
        }
        assert _count_planets_in_house(chart, 1) == 1


# -- _compute_spirit_bonus ----------------------------------------------------

class TestComputeSpiritBonus:
    def _make_chart(self, **overrides):
        """Helper to create a minimal chart dict."""
        base = {
            "Sun": {"sign": "Leo", "house": 5},
            "Moon": {"sign": "Tau", "house": 6},
            "Ascendant": {"sign": "Vir"},
            "Mercury": {"sign": "Gem", "house": 3},
            "Venus": {"sign": "Can", "house": 4},
            "Mars": {"sign": "Ari", "house": 1},
            "Jupiter": {"sign": "Leo", "house": 5},
            "Saturn": {"sign": "Cap", "house": 10},
            "Uranus": {"sign": "Tau", "house": 2},
            "Neptune": {"sign": "Cap", "house": 2},
            "Pluto": {"sign": "Sco", "house": 8},
        }
        base.update(overrides)
        return base

    def test_no_spirit_bonuses(self):
        chart = self._make_chart()
        assert _compute_spirit_bonus(chart) == 0.0

    def test_sun_in_spirit_sign(self):
        chart = self._make_chart(Sun={"sign": "Pis", "house": 5})
        assert _compute_spirit_bonus(chart) == 2.0

    def test_moon_in_spirit_sign(self):
        chart = self._make_chart(Moon={"sign": "Sag", "house": 6})
        assert _compute_spirit_bonus(chart) == 2.0

    def test_ascendant_in_spirit_sign(self):
        chart = self._make_chart(Ascendant={"sign": "Aqu"})
        assert _compute_spirit_bonus(chart) == 2.0

    def test_neptune_in_spirit_sign(self):
        chart = self._make_chart(Neptune={"sign": "Pis", "house": 2})
        assert _compute_spirit_bonus(chart) == 1.5

    def test_neptune_in_12th_house(self):
        chart = self._make_chart(Neptune={"sign": "Cap", "house": 12})
        assert _compute_spirit_bonus(chart) == 1.5

    def test_neptune_in_spirit_sign_and_12th_house(self):
        """Both Neptune bonuses should stack."""
        chart = self._make_chart(Neptune={"sign": "Pis", "house": 12})
        assert _compute_spirit_bonus(chart) == 3.0

    def test_12th_house_stellium(self):
        chart = self._make_chart(
            Mercury={"sign": "Gem", "house": 12},
            Venus={"sign": "Can", "house": 12},
            Mars={"sign": "Ari", "house": 12},
        )
        assert _compute_spirit_bonus(chart) == 1.0

    def test_all_bonuses_stacking(self):
        """Sun in Pis + Moon in Sag + Asc in Aqu + Neptune in Pis/12th + stellium."""
        chart = self._make_chart(
            Sun={"sign": "Pis", "house": 12},
            Moon={"sign": "Sag", "house": 12},
            Ascendant={"sign": "Aqu"},
            Mercury={"sign": "Ari", "house": 12},
            Neptune={"sign": "Pis", "house": 12},
        )
        # Sun +2 + Moon +2 + Asc +2 + Neptune sign +1.5 + Neptune 12th +1.5 + stellium +1 = 10
        assert _compute_spirit_bonus(chart) == 10.0


# -- chart_to_element_vector ---------------------------------------------------

class TestChartToElementVector:
    def test_all_fire_chart(self):
        """Chart with all placements in fire signs should be mostly fire."""
        chart = {
            "Sun": {"sign": "Ari", "house": 1},
            "Moon": {"sign": "Leo", "house": 5},
            "Ascendant": {"sign": "Sag"},
            "Mercury": {"sign": "Ari", "house": 1},
            "Venus": {"sign": "Leo", "house": 5},
            "Mars": {"sign": "Sag", "house": 9},
            "Jupiter": {"sign": "Ari", "house": 1},
            "Saturn": {"sign": "Leo", "house": 5},
            "Uranus": {"sign": "Sag", "house": 9},
            "Neptune": {"sign": "Ari", "house": 1},
            "Pluto": {"sign": "Leo", "house": 5},
        }
        vec = chart_to_element_vector(chart)
        # Fire should be the largest bucket (before normalization)
        assert vec["fire"] > vec["air"]
        assert vec["fire"] > vec["water"]
        assert vec["fire"] > vec["earth"]

    def test_vector_has_all_elements(self):
        chart = {
            "Sun": {"sign": "Leo", "house": 5},
            "Moon": {"sign": "Tau", "house": 6},
            "Ascendant": {"sign": "Vir"},
            "Mercury": {"sign": "Gem", "house": 3},
            "Venus": {"sign": "Can", "house": 4},
            "Mars": {"sign": "Ari", "house": 1},
            "Jupiter": {"sign": "Lib", "house": 7},
            "Saturn": {"sign": "Cap", "house": 10},
            "Uranus": {"sign": "Aqu", "house": 11},
            "Neptune": {"sign": "Pis", "house": 12},
            "Pluto": {"sign": "Sco", "house": 8},
        }
        vec = chart_to_element_vector(chart)
        assert set(vec.keys()) == {"air", "water", "fire", "earth", "spirit"}

    def test_spirit_only_from_bonuses(self):
        """Without spirit signs, spirit bucket should be 0."""
        chart = {
            "Sun": {"sign": "Leo", "house": 5},
            "Moon": {"sign": "Tau", "house": 6},
            "Ascendant": {"sign": "Vir"},
            "Mercury": {"sign": "Gem", "house": 3},
            "Venus": {"sign": "Can", "house": 4},
            "Mars": {"sign": "Ari", "house": 1},
            "Jupiter": {"sign": "Leo", "house": 5},
            "Saturn": {"sign": "Cap", "house": 10},
            "Uranus": {"sign": "Tau", "house": 2},
            "Neptune": {"sign": "Cap", "house": 2},
            "Pluto": {"sign": "Sco", "house": 8},
        }
        vec = chart_to_element_vector(chart)
        assert vec["spirit"] == 0.0
