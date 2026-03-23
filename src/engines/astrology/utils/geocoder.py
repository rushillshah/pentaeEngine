"""
Utility to resolve timezone from geographic coordinates.
Keeps the engine offline — no network calls.
"""
from timezonefinder import TimezoneFinder

_tf = TimezoneFinder()


def validate_coordinates(lat, lng):
    """
    Check that latitude and longitude are within valid ranges.
    Raises ValueError if out of bounds.
    """
    if not (-90 <= lat <= 90):
        raise ValueError(f"Latitude must be between -90 and 90, got {lat}.")
    if not (-180 <= lng <= 180):
        raise ValueError(f"Longitude must be between -180 and 180, got {lng}.")


def resolve_timezone(lat, lng):
    """
    Convert (latitude, longitude) to an IANA timezone string.
    Uses the timezonefinder library (offline, no network).

    Returns: str like "Asia/Dubai", "America/New_York", etc.
    Raises ValueError if coordinates are invalid or timezone cannot be determined.
    """
    validate_coordinates(lat, lng)

    tz_str = _tf.timezone_at(lat=lat, lng=lng)
    if tz_str is None:
        raise ValueError(
            f"Could not determine timezone for coordinates ({lat}, {lng}). "
            "This may be an ocean or polar region."
        )

    return tz_str
