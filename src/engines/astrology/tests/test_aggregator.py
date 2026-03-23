"""Tests for the aggregator service."""
from src.engines.astrology.services.aggregator import normalize_vector


class TestNormalizeVector:
    def test_sums_to_one(self):
        raw = {"air": 3.0, "water": 4.0, "fire": 6.0, "earth": 4.0, "spirit": 3.0}
        result = normalize_vector(raw)
        assert abs(sum(result.values()) - 1.0) < 0.01

    def test_preserves_proportions(self):
        raw = {"air": 2.0, "water": 2.0, "fire": 2.0, "earth": 2.0, "spirit": 2.0}
        result = normalize_vector(raw)
        assert result["air"] == 0.2
        assert result["fire"] == 0.2

    def test_all_zeros_returns_uniform(self):
        raw = {"air": 0, "water": 0, "fire": 0, "earth": 0, "spirit": 0}
        result = normalize_vector(raw)
        for el in result.values():
            assert el == 0.2

    def test_single_element_dominant(self):
        raw = {"air": 0, "water": 0, "fire": 10.0, "earth": 0, "spirit": 0}
        result = normalize_vector(raw)
        assert result["fire"] == 1.0
        assert result["air"] == 0.0

    def test_does_not_mutate_input(self):
        raw = {"air": 3.0, "water": 4.0, "fire": 6.0, "earth": 4.0, "spirit": 3.0}
        original = raw.copy()
        normalize_vector(raw)
        assert raw == original
