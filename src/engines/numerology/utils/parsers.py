"""
Helper functions for string manipulation and mathematical reduction.
"""
from ..constants import parameters

def clean_string(input_str):
    """
    Removes non-alpha characters and converts to uppercase.
    Example: "John Doe 123" -> "JOHNDOE"
    """
    return "".join([char.upper() for char in input_str if char.isalpha()])

def reduce_number(number):
    """
    Reduces a number to a single digit (1-9), unless it is a 
    Master Number (11, 22, 33).
    """
    current = number
    
    # Loop until single digit
    while current > 9:
        # Check if it is a Master Number immediately
        if current in parameters.MASTER_NUMBERS:
            return current
            
        # Sum the digits
        # e.g. 32 -> [3, 2] -> 5
        current = sum(int(digit) for digit in str(current))
        
    return current