"""
Static configuration for the Astrology module.
Sign-to-element mappings, planet weights, and spirit bonus rules.
"""

ELEMENTS = ["air", "water", "fire", "earth", "spirit"]

# Kerykeion returns abbreviated sign names — map to classical elements
SIGN_ELEMENTS = {
    # Fire signs
    "Ari": "fire",
    "Leo": "fire",
    "Sag": "fire",
    # Earth signs
    "Tau": "earth",
    "Vir": "earth",
    "Cap": "earth",
    # Air signs
    "Gem": "air",
    "Lib": "air",
    "Aqu": "air",
    # Water signs
    "Can": "water",
    "Sco": "water",
    "Pis": "water",
}

# Planets we extract from the natal chart
PLANET_LIST = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
]

# How much each planet/point contributes to the element buckets
PLANET_WEIGHTS = {
    "Sun": 3.0,
    "Moon": 3.0,
    "Ascendant": 3.0,
    "Mercury": 1.5,
    "Venus": 1.5,
    "Mars": 1.5,
    "Jupiter": 1.0,
    "Saturn": 1.0,
    "Uranus": 0.5,
    "Neptune": 0.5,
    "Pluto": 0.5,
}

# Signs that trigger Spirit bonuses
SPIRIT_SIGNS = {"Pis", "Sag", "Aqu"}

# Spirit bonus values
SUN_MOON_ASC_SPIRIT_BONUS = 2.0   # per placement in a spirit sign
NEPTUNE_SPIRIT_SIGN_BONUS = 1.5   # Neptune in a spirit sign
NEPTUNE_12TH_HOUSE_BONUS = 1.5    # Neptune in 12th house
STELLIUM_12TH_HOUSE_BONUS = 1.0   # 3+ planets in 12th house
STELLIUM_THRESHOLD = 3             # minimum planets for 12th-house stellium

# Kerykeion house name → integer mapping
HOUSE_NAME_TO_NUMBER = {
    "First_House": 1,
    "Second_House": 2,
    "Third_House": 3,
    "Fourth_House": 4,
    "Fifth_House": 5,
    "Sixth_House": 6,
    "Seventh_House": 7,
    "Eighth_House": 8,
    "Ninth_House": 9,
    "Tenth_House": 10,
    "Eleventh_House": 11,
    "Twelfth_House": 12,
}
