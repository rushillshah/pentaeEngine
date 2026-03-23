"""
Wraps Kerykeion to compute a natal chart and return a plain dict.
No Kerykeion types leak outside this module.
"""
from kerykeion import AstrologicalSubject
from ..constants import parameters


def _parse_house(house_name):
    """
    Convert Kerykeion house name (e.g. "Twelfth_House") to integer (12).
    Returns None if unrecognized.
    """
    return parameters.HOUSE_NAME_TO_NUMBER.get(house_name)


def compute_natal_chart(year, month, day, hour, minute, lat, lng, tz_str):
    """
    Compute a full natal chart using Kerykeion (Swiss Ephemeris).

    Args:
        year, month, day: Birth date integers
        hour, minute: Birth time integers (24h format)
        lat, lng: Geographic coordinates (floats)
        tz_str: IANA timezone string (e.g. "Asia/Dubai")

    Returns:
        dict with keys:
            sun, moon, mercury, venus, mars, jupiter, saturn,
            uranus, neptune, pluto: each {"sign": str, "house": int}
            ascendant: {"sign": str}
    """
    subject = AstrologicalSubject(
        "User",
        year, month, day, hour, minute,
        lat=lat,
        lng=lng,
        tz_str=tz_str,
        online=False,
    )

    chart = {}

    # Extract planet data
    for planet_name in parameters.PLANET_LIST:
        attr_name = planet_name.lower()
        point = getattr(subject, attr_name)
        chart[planet_name] = {
            "sign": point.sign,
            "house": _parse_house(point.house),
        }

    # Ascendant comes from the first house cusp
    chart["Ascendant"] = {
        "sign": subject.first_house.sign,
    }

    return chart
