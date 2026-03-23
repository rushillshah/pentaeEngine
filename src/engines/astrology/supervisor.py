"""
Astrology Module Supervisor.
Coordinates chart computation, element mapping, and normalization.
"""
import sys
from .services import chartService, elementMapper, aggregator
from .constants import parameters


def run(year, month, day, hour, minute, lat, lng, tz_str):
    """
    Pure computation: birth data → element vector.
    No I/O — suitable for programmatic use.

    Args:
        year, month, day: Birth date integers
        hour, minute: Birth time integers (24h format)
        lat, lng: Geographic coordinates (floats)
        tz_str: IANA timezone string (e.g. "Asia/Dubai")

    Returns:
        dict with keys:
            chart_data: full natal chart placements
            element_vector: {air, water, fire, earth, spirit} normalized to 1.0
    """
    chart_data = chartService.compute_natal_chart(
        year, month, day, hour, minute, lat, lng, tz_str
    )
    raw_vector = elementMapper.chart_to_element_vector(chart_data)
    element_vector = aggregator.normalize_vector(raw_vector)

    return {
        "chart_data": chart_data,
        "element_vector": element_vector,
    }


def print_report(result):
    """Print a formatted astrology report."""
    chart = result["chart_data"]
    vec = result["element_vector"]

    print("\n" + "=" * 30)
    print("ASTROLOGY MODULE")
    print("=" * 30)

    print("\n[NATAL CHART]")
    for key in ["Sun", "Moon", "Ascendant"]:
        placement = chart.get(key, {})
        sign = placement.get("sign", "?")
        house = placement.get("house")
        if house:
            print(f"  {key:>10}: {sign} (House {house})")
        else:
            print(f"  {key:>10}: {sign}")

    print()
    for planet in parameters.PLANET_LIST:
        if planet in ("Sun", "Moon"):
            continue
        placement = chart.get(planet, {})
        sign = placement.get("sign", "?")
        house = placement.get("house")
        print(f"  {planet:>10}: {sign} (House {house})")

    # Spirit bonus breakdown
    print("\n[SPIRIT BONUSES]")
    total_bonus = 0.0
    for key in ["Sun", "Moon", "Ascendant"]:
        sign = chart.get(key, {}).get("sign")
        if sign in parameters.SPIRIT_SIGNS:
            print(f"  {key} in {sign}: +{parameters.SUN_MOON_ASC_SPIRIT_BONUS}")
            total_bonus += parameters.SUN_MOON_ASC_SPIRIT_BONUS

    neptune = chart.get("Neptune", {})
    if neptune.get("sign") in parameters.SPIRIT_SIGNS:
        print(f"  Neptune in {neptune['sign']}: +{parameters.NEPTUNE_SPIRIT_SIGN_BONUS}")
        total_bonus += parameters.NEPTUNE_SPIRIT_SIGN_BONUS
    if neptune.get("house") == 12:
        print(f"  Neptune in 12th house: +{parameters.NEPTUNE_12TH_HOUSE_BONUS}")
        total_bonus += parameters.NEPTUNE_12TH_HOUSE_BONUS

    planets_in_12 = elementMapper._count_planets_in_house(chart, 12)
    if planets_in_12 >= parameters.STELLIUM_THRESHOLD:
        print(f"  12th house stellium ({planets_in_12} planets): +{parameters.STELLIUM_12TH_HOUSE_BONUS}")
        total_bonus += parameters.STELLIUM_12TH_HOUSE_BONUS

    if total_bonus == 0:
        print("  (none)")
    else:
        print(f"  Total spirit bonus: +{total_bonus}")

    # Element bar chart
    print("\n" + "=" * 30)
    print("ASTROLOGY ELEMENTAL SIGNATURE")
    print("=" * 30)

    sorted_elements = sorted(vec.items(), key=lambda x: x[1], reverse=True)
    for element, score in sorted_elements:
        percentage = score * 100
        bar = "█" * int(percentage / 5)
        print(f"{element.ljust(8)} | {bar} {percentage:.1f}%")


def main():
    """Interactive CLI entry point for standalone testing."""
    print("=" * 30)
    print("  PENTAE ASTROLOGY ENGINE")
    print("=" * 30)

    try:
        dob_input = input("\nEnter Date of Birth (YYYY-MM-DD): ").strip()
        parts = dob_input.split("-")
        year, month, day = int(parts[0]), int(parts[1]), int(parts[2])

        time_input = input("Enter Birth Time (HH:MM, 24h): ").strip()
        time_parts = time_input.split(":")
        hour, minute = int(time_parts[0]), int(time_parts[1])

        lat_input = input("Enter Birth Latitude (e.g. 25.2048): ").strip()
        lng_input = input("Enter Birth Longitude (e.g. 55.2708): ").strip()
        lat, lng = float(lat_input), float(lng_input)
    except (KeyboardInterrupt, EOFError):
        print("\nGoodbye.")
        sys.exit()
    except (ValueError, IndexError) as e:
        print(f"\nInput error: {e}")
        return

    # Resolve timezone from coordinates
    from .utils import geocoder
    try:
        tz_str = geocoder.resolve_timezone(lat, lng)
        print(f"Resolved timezone: {tz_str}")
    except ValueError as e:
        print(f"\nTimezone error: {e}")
        return

    try:
        result = run(year, month, day, hour, minute, lat, lng, tz_str)
    except Exception as e:
        print(f"\nChart computation error: {e}")
        return

    print_report(result)
    print()


if __name__ == "__main__":
    main()
