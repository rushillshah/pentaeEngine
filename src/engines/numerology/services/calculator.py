"""
Specific logic for extracting Life Path, Expression, and Soul Urge numbers.
"""
from ..utils import parsers
from ..constants import parameters

def get_life_path(dob_str):
    """
    Calculates Life Path from YYYY-MM-DD string.
    1. Extract all digits.
    2. Sum them.
    3. Reduce.
    """
    # Extract only digits from "1992-07-23" -> "19920723"
    digits = [int(char) for char in dob_str if char.isdigit()]
    
    if not digits:
        raise ValueError("Date of birth must contain numbers.")

    initial_sum = sum(digits)
    return parsers.reduce_number(initial_sum)

def get_expression(full_name):
    """
    Calculates Expression Number from Full Name.
    1. Clean string (A-Z).
    2. Map letters to numbers.
    3. Sum and Reduce.
    """
    clean_name = parsers.clean_string(full_name)
    if not clean_name:
        raise ValueError("Name must contain letters.")
        
    numbers = [parameters.LETTER_MAP[char] for char in clean_name if char in parameters.LETTER_MAP]
    total = sum(numbers)
    return parsers.reduce_number(total)

def get_soul_urge(full_name):
    """
    Calculates Soul Urge Number from Vowels in Full Name.
    1. Clean string.
    2. Filter for Vowels (A, E, I, O, U).
    3. Map to numbers, Sum and Reduce.
    Returns None if no vowels found.
    """
    clean_name = parsers.clean_string(full_name)
    vowel_numbers = [
        parameters.LETTER_MAP[char] for char in clean_name 
        if char in parameters.VOWELS and char in parameters.LETTER_MAP
    ]
    
    if not vowel_numbers:
        return None
        
    total = sum(vowel_numbers)
    return parsers.reduce_number(total)