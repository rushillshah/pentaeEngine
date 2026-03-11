"""
Converts 8 Likert answers (1-5) into raw cognitive function scores.

For each question:
  - favored function gets the raw answer (v)
  - opposite function gets (6 - v)

Each function appears in exactly 2 questions, so:
  min per function = 1 + 1 = 2
  max per function = 5 + 5 = 10
"""
from ..constants import parameters


def score_functions(answers):
    """
    Takes a list of 8 integers (each 1-5) and returns a dict of
    raw cognitive function scores.

    Returns: {"Ni": int, "Ne": int, ...}  (each 2-10)
    """
    if len(answers) != 8:
        raise ValueError(f"Expected 8 answers, got {len(answers)}.")

    scores = {fn: 0 for fn in parameters.FUNCTIONS}

    for i, v in enumerate(answers):
        if not (1 <= v <= 5):
            raise ValueError(f"Answer {i+1} must be 1-5, got {v}.")

        q = parameters.QUESTIONS[i]
        scores[q["favored"]] += v
        scores[q["opposite"]] += 6 - v

    return scores


def normalize_functions(raw_scores):
    """
    Normalize raw scores so they sum to 1.0.

    Returns: {"Ni": float, "Ne": float, ...}  (each 0.0-1.0, sum = 1.0)
    """
    total = sum(raw_scores.values())
    if total == 0:
        count = len(raw_scores)
        return {fn: 1.0 / count for fn in raw_scores}

    return {fn: round(val / total, 6) for fn, val in raw_scores.items()}
