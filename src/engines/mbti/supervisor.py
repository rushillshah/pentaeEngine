"""
MBTI / Personality Module Supervisor.
Coordinates question input, scoring, and element mapping.
"""
import sys
from .services import scorer, elementMapper
from .constants import parameters


def collect_answers_interactive():
    """Prompt user for 8 Likert answers via stdin."""
    print("\nAnswer each question on a scale of 1-5:")
    print("  1 = Strongly disagree")
    print("  2 = Disagree")
    print("  3 = Neutral")
    print("  4 = Agree")
    print("  5 = Strongly agree\n")

    answers = []
    for i, q in enumerate(parameters.QUESTIONS):
        while True:
            try:
                raw = input(f"Q{i+1}: {q['text']}\n   Your answer (1-5): ").strip()
                v = int(raw)
                if 1 <= v <= 5:
                    answers.append(v)
                    print()
                    break
                print("   Please enter a number between 1 and 5.")
            except (ValueError, EOFError):
                print("   Please enter a number between 1 and 5.")
            except KeyboardInterrupt:
                print("\nGoodbye.")
                sys.exit()
    return answers


def run(answers):
    """
    Pure computation: answers → element vector.
    No I/O — suitable for programmatic use.

    Args:
        answers: list of 8 ints (each 1-5)

    Returns:
        dict with keys:
            raw_scores: {Ni: int, ...}
            normalized_scores: {Ni: float, ...}
            element_vector: {air: float, water: float, ...}
    """
    raw_scores = scorer.score_functions(answers)
    normalized_scores = scorer.normalize_functions(raw_scores)
    element_vector = elementMapper.functions_to_elements(normalized_scores)

    return {
        "raw_scores": raw_scores,
        "normalized_scores": normalized_scores,
        "element_vector": element_vector,
    }


def print_report(result):
    """Print a formatted MBTI report."""
    raw = result["raw_scores"]
    norm = result["normalized_scores"]
    vec = result["element_vector"]

    print("\n" + "=" * 30)
    print("MBTI / PERSONALITY MODULE")
    print("=" * 30)

    print("\n[COGNITIVE FUNCTIONS (raw → normalized)]")
    for fn in parameters.FUNCTIONS:
        pct = norm[fn] * 100
        print(f"  {fn:>2}: {raw[fn]:>2}  →  {pct:5.1f}%")

    print("\n" + "=" * 30)
    print("PERSONALITY ELEMENTAL SIGNATURE")
    print("=" * 30)

    sorted_elements = sorted(vec.items(), key=lambda x: x[1], reverse=True)
    for element, score in sorted_elements:
        percentage = score * 100
        bar = "█" * int(percentage / 5)
        print(f"{element.ljust(8)} | {bar} {percentage:.1f}%")


def main():
    print("Welcome to the Personality (MBTI) Module.")
    print("------------------------------------------")

    answers = collect_answers_interactive()
    result = run(answers)
    print_report(result)


if __name__ == "__main__":
    main()
