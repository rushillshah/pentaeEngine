import type { ElementVector } from "@/types/personalization";
import { ELEMENT_MATRIX, FUNCTIONS } from "./constants";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

/**
 * Convert normalized cognitive function scores into a 5-element vector.
 *
 * For each function, multiply its weight by its ELEMENT_MATRIX row,
 * then accumulate per element and normalize to sum = 1.0.
 * Returns 0.2 each if all element values are zero.
 */
export function functionsToElements(
  normalized: Record<string, number>,
): ElementVector {
  const raw: Record<string, number> = {
    air: 0, water: 0, fire: 0, earth: 0, spirit: 0,
  };

  for (const fn of FUNCTIONS) {
    const weight = normalized[fn] ?? 0;
    const row = ELEMENT_MATRIX[fn];
    for (const el of ELEMENTS) {
      raw[el] += weight * row[el];
    }
  }

  const total = ELEMENTS.reduce((sum, el) => sum + raw[el], 0);

  if (total === 0) {
    return { air: 0.2, water: 0.2, fire: 0.2, earth: 0.2, spirit: 0.2 };
  }

  return {
    air: Math.round((raw.air / total) * 1e4) / 1e4,
    water: Math.round((raw.water / total) * 1e4) / 1e4,
    fire: Math.round((raw.fire / total) * 1e4) / 1e4,
    earth: Math.round((raw.earth / total) * 1e4) / 1e4,
    spirit: Math.round((raw.spirit / total) * 1e4) / 1e4,
  };
}
