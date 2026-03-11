"""
Converts normalized cognitive function scores into a 5-element vector.

Uses the element matrix from parameters.py:
  For each function, multiply its normalized score by that function's
  element row, then sum across all 8 functions.

Finally, normalize the 5 elements so they sum to 1.0.
"""
from ..constants import parameters

ELEMENTS = ["air", "water", "fire", "earth", "spirit"]


def functions_to_elements(normalized_scores):
    """
    Takes normalized function scores (sum to 1.0) and returns
    a normalized 5-element vector (sum to 1.0).

    Steps:
      1. For each function, multiply its weight by its element row.
      2. Sum all contributions per element.
      3. Normalize so elements sum to 1.0.
    """
    raw_elements = {el: 0.0 for el in ELEMENTS}

    for fn, weight in normalized_scores.items():
        row = parameters.ELEMENT_MATRIX[fn]
        for el in ELEMENTS:
            raw_elements[el] += weight * row[el]

    # Normalize to sum to 1.0
    total = sum(raw_elements.values())
    if total == 0:
        return {el: 0.2 for el in ELEMENTS}

    return {el: round(raw_elements[el] / total, 4) for el in raw_elements}
