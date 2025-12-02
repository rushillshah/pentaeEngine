"""
Stores static configuration data, mappings, and weights.
"""

# Pythagorean Letter Mapping
# 1: A, J, S ... 9: I, R
LETTER_MAP = {
    'A': 1, 'J': 1, 'S': 1,
    'B': 2, 'K': 2, 'T': 2,
    'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4,
    'E': 5, 'N': 5, 'W': 5,
    'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7,
    'H': 8, 'Q': 8, 'Z': 8,
    'I': 9, 'R': 9
}

# Vowels definition for Soul Urge (Y is excluded per requirements)
VOWELS = {'A', 'E', 'I', 'O', 'U'}

# Master Numbers that are not reduced
MASTER_NUMBERS = {11, 22, 33}

# Weights for the final mix
WEIGHTS = {
    'life_path': 0.5,
    'expression': 0.3,
    'soul_urge': 0.2
}

# Base Element Vectors
# Structure: {air, water, fire, earth, spirit}
ELEMENT_VECTORS = {
    1:  {"air": 0.0, "water": 0.0, "fire": 1.0, "earth": 0.0, "spirit": 0.0},
    2:  {"air": 0.0, "water": 1.0, "fire": 0.0, "earth": 0.0, "spirit": 0.0},
    3:  {"air": 1.0, "water": 0.0, "fire": 0.0, "earth": 0.0, "spirit": 0.0},
    4:  {"air": 0.0, "water": 0.0, "fire": 0.0, "earth": 1.0, "spirit": 0.0},
    5:  {"air": 0.4, "water": 0.0, "fire": 0.6, "earth": 0.0, "spirit": 0.0},
    6:  {"air": 0.0, "water": 0.5, "fire": 0.0, "earth": 0.5, "spirit": 0.0},
    7:  {"air": 0.0, "water": 0.0, "fire": 0.0, "earth": 0.0, "spirit": 1.0},
    8:  {"air": 0.0, "water": 0.0, "fire": 0.5, "earth": 0.5, "spirit": 0.0},
    9:  {"air": 0.0, "water": 0.5, "fire": 0.0, "earth": 0.0, "spirit": 0.5},
    # Master Numbers
    11: {"air": 0.4, "water": 0.0, "fire": 0.0, "earth": 0.0, "spirit": 0.6},
    22: {"air": 0.0, "water": 0.0, "fire": 0.0, "earth": 0.6, "spirit": 0.4},
    33: {"air": 0.0, "water": 0.0, "fire": 0.6, "earth": 0.0, "spirit": 0.4},
}