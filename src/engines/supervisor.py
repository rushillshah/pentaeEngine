"""
Combined Engine Supervisor.
Runs numerology + MBTI + astrology modules, shows individual outputs,
then combines them into a unified elemental profile.
"""
import sys
from .numerology import supervisor as numerology
from .mbti import supervisor as mbti
from .mbti.constants import parameters as mbti_params
from .astrology import supervisor as astrology
from .astrology.utils import geocoder

ELEMENTS = ["air", "water", "fire", "earth", "spirit"]

# Module weights for combining (equal split — 3 of 4 planned modules)
MODULE_WEIGHTS = {
    "numerology": 0.33,
    "mbti": 0.33,
    "astrology": 0.34,
}


def combine_vectors(vectors, weights):
    """
    Weighted average of multiple element vectors.
    Each vector is a dict {air, water, fire, earth, spirit}.
    Weights are normalized so they sum to 1.0.
    """
    total_weight = sum(weights.values())
    combined = {el: 0.0 for el in ELEMENTS}

    for module_name, vec in vectors.items():
        w = weights[module_name] / total_weight
        for el in ELEMENTS:
            combined[el] += vec.get(el, 0.0) * w

    # Normalize to sum to 1.0
    total = sum(combined.values())
    if total == 0:
        return {el: 0.2 for el in ELEMENTS}

    return {el: round(combined[el] / total, 4) for el in combined}


def print_element_bar(vector, title):
    """Print a sorted bar chart for an element vector."""
    print("\n" + "=" * 40)
    print(title)
    print("=" * 40)

    sorted_elements = sorted(vector.items(), key=lambda x: x[1], reverse=True)
    for element, score in sorted_elements:
        percentage = score * 100
        bar = "█" * int(percentage / 5)
        print(f"{element.ljust(8)} | {bar} {percentage:.1f}%")


def main():
    print("=" * 40)
    print("  PENTAE ELEMENTAL ENGINE")
    print("  Numerology + MBTI + Astrology")
    print("=" * 40)

    # ── Numerology inputs ──────────────────────────────
    print("\n--- NUMEROLOGY MODULE ---")
    try:
        dob_input = input("Enter Date of Birth (YYYY-MM-DD): ").strip()
        name_input = input("Enter Full Name: ").strip()
    except KeyboardInterrupt:
        print("\nGoodbye.")
        sys.exit()

    try:
        num_result = numerology.run(dob_input, name_input)
    except ValueError as e:
        print(f"\nNumerology error: {e}")
        return

    # ── MBTI inputs ────────────────────────────────────
    print("\n--- PERSONALITY (MBTI) MODULE ---")
    answers = mbti.collect_answers_interactive()
    mbti_result = mbti.run(answers)

    # ── Astrology inputs ─────────────────────────────
    print("\n--- ASTROLOGY MODULE ---")
    try:
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

    try:
        tz_str = geocoder.resolve_timezone(lat, lng)
        print(f"Resolved timezone: {tz_str}")
    except ValueError as e:
        print(f"\nTimezone error: {e}")
        return

    try:
        astro_result = astrology.run(year, month, day, hour, minute, lat, lng, tz_str)
    except Exception as e:
        print(f"\nAstrology error: {e}")
        return

    # ── Individual reports ─────────────────────────────
    numerology.print_report(num_result, name_input)
    mbti.print_report(mbti_result)
    astrology.print_report(astro_result)

    # ── Combined output ────────────────────────────────
    combined_vec = combine_vectors(
        {
            "numerology": num_result["element_vector"],
            "mbti": mbti_result["element_vector"],
            "astrology": astro_result["element_vector"],
        },
        MODULE_WEIGHTS,
    )

    print_element_bar(combined_vec, "COMBINED ELEMENTAL QUINTESSENCE (33/33/34)")

    print(f"\n[WEIGHTS USED]")
    for mod, w in MODULE_WEIGHTS.items():
        print(f"  {mod}: {int(w * 100)}%")

    print()


if __name__ == "__main__":
    main()
