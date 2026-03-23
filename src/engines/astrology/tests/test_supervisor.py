"""Tests for the astrology supervisor (end-to-end)."""
import pytest
from src.engines.astrology.supervisor import run


class TestSupervisorRun:
    def test_returns_chart_data_and_element_vector(self):
        result = run(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        assert "chart_data" in result
        assert "element_vector" in result

    def test_element_vector_sums_to_one(self):
        result = run(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        total = sum(result["element_vector"].values())
        assert abs(total - 1.0) < 0.01

    def test_element_vector_has_five_elements(self):
        result = run(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        assert set(result["element_vector"].keys()) == {
            "air", "water", "fire", "earth", "spirit"
        }

    def test_all_values_non_negative(self):
        result = run(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        for val in result["element_vector"].values():
            assert val >= 0

    def test_known_leo_sun(self):
        """July 23 1992 should produce Leo Sun."""
        result = run(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        assert result["chart_data"]["Sun"]["sign"] == "Leo"

    def test_pisces_sun_has_spirit(self):
        """Pisces sun should trigger spirit bonus, giving spirit > 0."""
        result = run(1995, 3, 5, 3, 0, 51.5074, -0.1278, "Europe/London")
        assert result["element_vector"]["spirit"] > 0

    def test_different_births_produce_different_vectors(self):
        r1 = run(1992, 7, 23, 14, 30, 25.2048, 55.2708, "Asia/Dubai")
        r2 = run(1985, 1, 15, 8, 0, 19.076, 72.8777, "Asia/Kolkata")
        assert r1["element_vector"] != r2["element_vector"]
