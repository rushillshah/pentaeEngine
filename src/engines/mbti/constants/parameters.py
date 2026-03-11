"""
Static configuration for the MBTI / Cognitive Function personality module.
"""

# The 8 cognitive functions
FUNCTIONS = ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"]

# 8 Likert questions (1-5).
# Each question has a 'favored' function and an 'opposite' function.
# Scoring: answer v → favored gets v, opposite gets 6 - v.
QUESTIONS = [
    {
        "text": "I often get strong 'big picture' insights about where things are heading, even before there are obvious signs.",
        "favored": "Ni",
        "opposite": "Se",
    },
    {
        "text": "I feel most alive when I'm fully engaged in the present moment through my senses (movement, taste, touch, sights).",
        "favored": "Se",
        "opposite": "Ni",
    },
    {
        "text": "I quickly generate multiple ideas or alternatives when facing a problem, even if some of them seem wild or unrealistic.",
        "favored": "Ne",
        "opposite": "Si",
    },
    {
        "text": "I rely a lot on past experience, routines, or what has worked before when making decisions.",
        "favored": "Si",
        "opposite": "Ne",
    },
    {
        "text": "When I evaluate something, I focus first on whether it is logically consistent, even if it might upset people.",
        "favored": "Ti",
        "opposite": "Fi",
    },
    {
        "text": "I make many of my decisions based on whether they align with my personal values or feel 'right' in my heart.",
        "favored": "Fi",
        "opposite": "Ti",
    },
    {
        "text": "In groups, I naturally focus on getting things done efficiently, even if it means being direct or blunt.",
        "favored": "Te",
        "opposite": "Fe",
    },
    {
        "text": "In groups, I automatically notice how everyone is feeling and adjust my behavior to keep harmony.",
        "favored": "Fe",
        "opposite": "Te",
    },
]

# Element matrix: maps each cognitive function to a 5-element distribution.
# Each row sums to 1.0 (or close — they represent how much of that function
# pours into each element).
#
# From Section 8 of the spec:
#   Ni  → Spirit 1.0
#   Ne  → Spirit 0.5, Fire 0.5
#   Si  → Earth 1.0
#   Se  → Fire 0.5, Earth 0.5
#   Ti  → Air 1.0
#   Te  → Air 0.7, Earth 0.3
#   Fi  → Water 1.0
#   Fe  → Water 0.7, Fire 0.3
ELEMENT_MATRIX = {
    "Ni": {"air": 0.0, "water": 0.0, "fire": 0.0, "earth": 0.0, "spirit": 1.0},
    "Ne": {"air": 0.0, "water": 0.0, "fire": 0.5, "earth": 0.0, "spirit": 0.5},
    "Si": {"air": 0.0, "water": 0.0, "fire": 0.0, "earth": 1.0, "spirit": 0.0},
    "Se": {"air": 0.0, "water": 0.0, "fire": 0.5, "earth": 0.5, "spirit": 0.0},
    "Ti": {"air": 1.0, "water": 0.0, "fire": 0.0, "earth": 0.0, "spirit": 0.0},
    "Te": {"air": 0.7, "water": 0.0, "fire": 0.0, "earth": 0.3, "spirit": 0.0},
    "Fi": {"air": 0.0, "water": 1.0, "fire": 0.0, "earth": 0.0, "spirit": 0.0},
    "Fe": {"air": 0.0, "water": 0.7, "fire": 0.3, "earth": 0.0, "spirit": 0.0},
}
