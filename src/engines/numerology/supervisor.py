"""
The Main Supervisor.
Coordinates the user input, the calculation services, and the output display.
"""
import sys
# Import from our package
from .services import calculator, elementMapper, aggregator

def print_vector(title, vector):
    print(f"\n--- {title} ---")
    if not vector:
        print("N/A")
        return
    for k, v in vector.items():
        if v > 0:
            print(f"  {k.capitalize()}: {int(v*100)}%")

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

    # 2. Calculation Phase
    try:
        lp_num = calculator.get_life_path(dob_input)
        exp_num = calculator.get_expression(name_input)
        su_num = calculator.get_soul_urge(name_input)
    except ValueError as e:
        print(f"\nError in calculation: {e}")
        return

    # 3. Mapping Phase
    lp_vec = elementMapper.number_to_vector(lp_num)
    exp_vec = elementMapper.number_to_vector(exp_num)
    su_vec = elementMapper.number_to_vector(su_num) if su_num else None

    # 4. Mixing Phase
    final_profile = aggregator.mix_profiles(lp_vec, exp_vec, su_vec)

    # 5. Report Phase
    print("\n" + "="*30)
    print(f"REPORT FOR: {name_input.upper()}")
    print("="*30)
    
    print(f"\n[NUMBERS]")
    print(f"Life Path: {lp_num}")
    print(f"Expression: {exp_num}")
    print(f"Soul Urge: {su_num if su_num else 'N/A'}")

    # Optional: Show individual breakdowns if you want detailed debugging
    # print_vector(f"Life Path ({lp_num})", lp_vec)
    
    print("\n" + "="*30)
    print("FINAL ELEMENTAL SIGNATURE")
    print("="*30)
    
    # Sort elements by strength for better readability
    sorted_elements = sorted(
        final_profile.items(), 
        key=lambda item: item[1], 
        reverse=True
    )

    for element, score in sorted_elements:
        percentage = score * 100
        bar_length = int(percentage / 5)
        bar = "█" * bar_length
        print(f"{element.ljust(8)} | {bar} {percentage:.1f}%")

if __name__ == "__main__":
    main()