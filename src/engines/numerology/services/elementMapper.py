"""
Service to translate a raw numerology number into an elemental vector.
"""
from ..constants import parameters

def number_to_vector(number):
    """
    Look up the element vector for a given number.
    Returns a copy of the dictionary to prevent mutation issues.
    """
    if number in parameters.ELEMENT_VECTORS:
        return parameters.ELEMENT_VECTORS[number].copy()
    
    # Fallback (Should ideally not happen if reduction works correctly)
    return {"air": 0, "water": 0, "fire": 0, "earth": 0, "spirit": 0}