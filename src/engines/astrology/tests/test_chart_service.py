"""Tests for the chart service (Kerykeion wrapper)."""
import pytest
from src.engines.astrology.services.chartService import compute_natal_chart, _parse_house


class TestParseHouse:
    def test_known_houses(self):
        assert _parse_house("First_House") == 1
        assert _parse_house("Sixth_House") == 6
        assert _parse_house("Twelfth_House") == 12

    def test_unknown_house_returns_none(self):
        assert _parse_house("Unknown") is None
        assert _parse_house("") is None


class TestComputeNatalChart:
    def test_returns_all_planets_and_ascendant(self):
        """Chart should have all 10 planets plus Ascendant."""
        chart = compute_natal_chart(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        expected_keys = {
            "Sun", "Moon", "Mercury", "Venus", "Mars",
            "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
            "Ascendant",
        }
        assert set(chart.keys()) == expected_keys

    def test_planet_has_sign_and_house(self):
        """Each planet should have sign and house keys."""
        chart = compute_natal_chart(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        for planet in ["Sun", "Moon", "Mercury", "Venus", "Mars",
                        "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]:
            assert "sign" in chart[planet]
            assert "house" in chart[planet]
            assert isinstance(chart[planet]["house"], int)

    def test_ascendant_has_sign(self):
        """Ascendant should have a sign."""
        chart = compute_natal_chart(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        assert "sign" in chart["Ascendant"]

    def test_known_chart_sun_sign(self):
        """July 23 1992 should have Leo Sun."""
        chart = compute_natal_chart(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        assert chart["Sun"]["sign"] == "Leo"

    def test_signs_are_valid_abbreviations(self):
        """All signs should be valid 3-letter abbreviations."""
        from src.engines.astrology.constants.parameters import SIGN_ELEMENTS
        chart = compute_natal_chart(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        for key, placement in chart.items():
            assert placement["sign"] in SIGN_ELEMENTS, (
                f"{key} has unknown sign {placement['sign']}"
            )

    def test_houses_in_valid_range(self):
        """All house numbers should be 1-12."""
        chart = compute_natal_chart(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        for planet in ["Sun", "Moon", "Mercury", "Venus", "Mars",
                        "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]:
            house = chart[planet]["house"]
            assert 1 <= house <= 12, f"{planet} house {house} out of range"
