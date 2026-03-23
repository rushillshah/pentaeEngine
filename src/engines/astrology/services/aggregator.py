"""
Normalizes the raw element vector so all 5 values sum to 1.0.
"""
from ..constants import parameters

ELEMENTS = parameters.ELEMENTS


def normalize_vector(raw_vector):
    """
    Normalize a raw element vector so values sum to 1.0.
    Returns a new dict (does not mutate the input).

    If all values are zero, returns uniform distribution (0.2 each).
    """
    total = sum(raw_vector.get(el, 0.0) for el in ELEMENTS)

    if total == 0:
        return {el: 0.2 for el in ELEMENTS}

    return {el: round(raw_vector.get(el, 0.0) / total, 4) for el in ELEMENTS}
