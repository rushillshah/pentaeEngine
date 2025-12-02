"""
Logic to blend multiple elemental vectors based on specific weights.
"""
from ..constants import parameters

def mix_profiles(life_path_vec, expression_vec, soul_urge_vec):
    """
    Weighted mixing of the three vectors.
    """
    
    # Initialize result vector
    final_vector = {"air": 0.0, "water": 0.0, "fire": 0.0, "earth": 0.0, "spirit": 0.0}
    
    # Helper to add weighted values
    def apply_weight(vector, weight):
        if not vector: return
        for element, value in vector.items():
            final_vector[element] += (value * weight)

    # Apply specific weights
    apply_weight(life_path_vec, parameters.WEIGHTS['life_path'])
    apply_weight(expression_vec, parameters.WEIGHTS['expression'])
    apply_weight(soul_urge_vec, parameters.WEIGHTS['soul_urge'])
    
    # Rounding for cleanliness
    for key in final_vector:
        final_vector[key] = round(final_vector[key], 4)
        
    return final_vector