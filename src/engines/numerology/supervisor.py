"""
The Main Supervisor.
Coordinates the user input, the calculation services, and the output display.
"""
import sys
# Import from our package
from .services import calculator, elementMapper, aggregator


def run(dob_str, full_name):
    """
    Pure computation: DOB + name → element vector.
    No I/O — suitable for programmatic use.

    Returns:
        dict with keys:
            life_path: int
            expression: int
            soul_urge: int | None
            element_vector: {air: float, water: float, ...}
    """
    lp_num = calculator.get_life_path(dob_str)
    exp_num = calculator.get_expression(full_name)
    su_num = calculator.get_soul_urge(full_name)

    lp_vec = elementMapper.number_to_vector(lp_num)
    exp_vec = elementMapper.number_to_vector(exp_num)
    su_vec = elementMapper.number_to_vector(su_num) if su_num else None

    final_profile = aggregator.mix_profiles(lp_vec, exp_vec, su_vec)

    return {
        "life_path": lp_num,
        "expression": exp_num,
        "soul_urge": su_num,
        "element_vector": final_profile,
    }


def print_report(result, name=""):
    """Print a formatted numerology report."""
    lp = result["life_path"]
    exp = result["expression"]
    su = result["soul_urge"]
    vec = result["element_vector"]

    if name:
        print("\n" + "=" * 30)
        print(f"REPORT FOR: {name.upper()}")
        print("=" * 30)

    print("\n[NUMBERS]")
    print(f"Life Path: {lp}")
    print(f"Expression: {exp}")
    print(f"Soul Urge: {su if su else 'N/A'}")

    print("\n" + "=" * 30)
    print("NUMEROLOGY ELEMENTAL SIGNATURE")
    print("=" * 30)

    sorted_elements = sorted(vec.items(), key=lambda x: x[1], reverse=True)
    for element, score in sorted_elements:
        percentage = score * 100
        bar = "█" * int(percentage / 5)
        print(f"{element.ljust(8)} | {bar} {percentage:.1f}%")


def main():
    print("Welcome to the Elemental Numerology Supervisor.")
    print("-----------------------------------------------")

    # 1. Input Phase
    try:
        dob_input = input("Enter Date of Birth (YYYY-MM-DD): ").strip()
        name_input = input("Enter Full Name: ").strip()
    except KeyboardInterrupt:
        print("\nGoodbye.")
        sys.exit()

    # 2. Run
    try:
        result = run(dob_input, name_input)
    except ValueError as e:
        print(f"\nError in calculation: {e}")
        return

    # 3. Report
    print_report(result, name_input)


if __name__ == "__main__":
    main()