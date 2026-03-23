"""Tests for the geocoder utility."""
import pytest
from src.engines.astrology.utils.geocoder import resolve_timezone, validate_coordinates


class TestValidateCoordinates:
    def test_valid_coordinates(self):
        validate_coordinates(25.2, 55.3)
        validate_coordinates(0, 0)
        validate_coordinates(-90, -180)
        validate_coordinates(90, 180)

    def test_latitude_out_of_range(self):
        with pytest.raises(ValueError, match="Latitude"):
            validate_coordinates(91, 0)

    def test_negative_latitude_out_of_range(self):
        with pytest.raises(ValueError, match="Latitude"):
            validate_coordinates(-91, 0)

    def test_longitude_out_of_range(self):
        with pytest.raises(ValueError, match="Longitude"):
            validate_coordinates(0, 181)


class TestResolveTimezone:
    def test_dubai(self):
        assert resolve_timezone(25.2048, 55.2708) == "Asia/Dubai"

    def test_mumbai(self):
        assert resolve_timezone(19.0760, 72.8777) == "Asia/Kolkata"

    def test_london(self):
        assert resolve_timezone(51.5074, -0.1278) == "Europe/London"

    def test_new_york(self):
        assert resolve_timezone(40.7128, -74.0060) == "America/New_York"

    def test_invalid_coordinates_raises(self):
        with pytest.raises(ValueError):
            resolve_timezone(100, 0)
